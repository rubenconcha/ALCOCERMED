"""Apply the UMSS assertion format to the numbered Medicine simulations.

The source for new assertions is the reviewed bank produced by build_medicine.py.
The historic-format questions already present in prepared models can also be reused.
"""
import hashlib
import json
import random
import re
import unicodedata
from collections import Counter
from dataclasses import dataclass
from itertools import combinations
from pathlib import Path

from build_medicine import BOOKS, assertion_question

ROOT = Path(__file__).resolve().parents[2]
SIM = ROOT / 'api/_simulations'
CATALOGUE = ROOT / 'content/simulacros-catalog.json'
DEMO = ROOT / 'api/_simulations/demo-2026.json'
AUDIT = ROOT / 'quality/simulation-composition-audit.json'
SUBJECTS = {'morfofuncion': 'MORFOFUNCION', 'biologia-celular': 'BIOLOGIA CELULAR', 'educacion-salud': 'SALUD PUBLICA'}
TOPIC_BOUNDS = {
    'first': [(1, 11), (1, 6), (1, 6)],
    'second': [(12, 20), (7, 12), (7, 12)],
    'final': [(1, 29), (1, 18), (1, 21)],
}


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def write(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')


def normalize(value):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', value.lower()))


def assertion_options(question):
    a = normalize(question['opcion_a'])
    return a == 'sololaafirmacion1escorrecta' or bool(re.fullmatch(r'(?:si)?1(?:es)?(?:correct[oa]|incorrect[oa])', a))


def anchored_paper_row(row):
    """Choose readable historic items when a block needs more distinct statements."""
    expected = 3 if row.get('opcion_e') else 2
    numbered = [int(n) for n in re.findall(r'^\s*([123])(?:[.\s)\-])', row['pregunta'], flags=re.M)]
    return (numbered == list(range(1, expected + 1))
            and len(row['respuestas_aceptadas']) == 1
            and not re.search(r'\b(?:y|o)\s*$', row['pregunta'], re.I))


@dataclass(frozen=True)
class Fact:
    text: str
    truth: bool
    reason: str
    subject: str
    chapter: int
    topic: str
    source: dict

    @property
    def key(self):
        return normalize(self.text)


def load_facts():
    banks = ROOT / 'api/_sufficiency'
    rows = load(banks / 'medicina-oficial.json')['questions'] + load(banks / 'articulaciones-examen.json')
    facts = []
    for q in rows:
        if not q.get('truth_values'):
            continue
        source = q['source']
        for stem, reason, truth in zip(q['text'].splitlines()[1:], q['explanation'].splitlines(), q['truth_values'], strict=True):
            text = stem.split('. ', 1)[1]
            rationale = reason.split('. ', 2)[2]
            facts.append(Fact(text, truth, rationale, SUBJECTS[q['subject']], source['chapterNumber'], q['topic'], source))
    return facts


def supplemental_facts(facts):
    topics = {f.source['topicId']: f.topic for f in facts}
    fixed = {}
    for line in (SIM / 'afirmaciones-adicionales.txt').read_text(encoding='utf-8').splitlines():
        if not line or line.startswith('#'):
            continue
        destination, code, pages, printed, section, statement, reason = [field.strip() for field in line.split('|')]
        prefix, chapter = code.split('-')
        subject, document = BOOKS[prefix]
        source = {
            'topicId': code, 'document': document, 'section': section,
            'pdfPages': list(map(int, pages.split(','))),
            'printedPages': list(map(int, printed.split(','))),
        }
        fact = Fact(statement[2:], statement[0] == '+', reason, SUBJECTS[subject], int(chapter), topics[code], source)
        if destination == 'pool':
            facts.append(fact)
        else:
            fixed.setdefault(destination, []).append(fact)
    return fixed


def bounds(scope, subject, old):
    low, high = dict(zip(SUBJECTS.values(), TOPIC_BOUNDS[scope], strict=True))[subject]
    if scope == 'final' and subject == 'SALUD PUBLICA' and old >= 14:
        low = 14
    return low, high


def compose(facts, row_id, number):
    answer = assertion_question([(f.text, f.truth, f.reason) for f in facts])
    key = 'ABCDE'[answer['correct']]
    primary = facts[0]
    citations = []
    for f in facts:
        cite = f'cap. {f.chapter} · {f.source["section"]}'
        if cite not in citations:
            citations.append(cite)
    pages = sorted({p for f in facts for p in f.source['pdfPages']})
    printed = sorted({p for f in facts for p in f.source['printedPages']})
    return {
        'id': row_id,
        'numero_original': number,
        'numero_pregunta': number,
        'materia': primary.subject, 'tema': primary.topic, 'dificultad': 'dificil',
        'pregunta': answer['text'],
        **{'opcion_' + letter: value for letter, value in zip('abcde', answer['options'])},
        'respuesta_correcta': key, 'respuestas_aceptadas': [key],
        'justificacion': answer['explanation'],
        'comentarios_opciones': answer['comentarios_opciones'], 'truth_values': answer['truth_values'],
        'fuente': primary.source['document'] + ' · ' + ' / '.join(citations),
        'paginas_pdf': ', '.join(map(str, pages)), 'pagina_impresa': ', '.join(map(str, printed)),
        'coverage': {'subject': primary.subject, 'chapter': primary.chapter, 'curriculum': 'official-pdfs-2026-10-19'},
    }


def choose_facts(pool, target, arity, used_sets):
    ordered = sorted(pool, key=lambda f: abs(f.chapter - target))
    for primary in ordered:
        others = sorted((f for f in ordered if f.key != primary.key), key=lambda f: abs(f.chapter - primary.chapter))
        for rest in combinations(others, arity - 1):
            group = (primary, *rest)
            if len({f.key for f in group}) != arity or (arity == 3 and sum(f.truth for f in group) == 2):
                continue
            if frozenset(f.key for f in group) not in used_sets:
                return group
    return ()


def reformat_paper(paper, all_facts, archived, used_sets, used_archival, fixed):
    randomizer = random.Random(paper['id'])
    facts = list(all_facts)
    archive = list(archived)
    randomizer.shuffle(facts)
    randomizer.shuffle(archive)
    keep = [q for q in paper['questions'] if assertion_options(q)]
    stems = {normalize(q['pregunta']) for q in keep}
    sources = {q.get('source_question_id', q['id']) for q in keep}
    used_facts = set()
    changed = Counter()
    for i, old in enumerate(paper['questions']):
        if assertion_options(old):
            continue
        subject, chapter = old['materia'], old['coverage']['chapter']
        low, high = bounds(paper['scope'], subject, chapter if paper['id'] != 'demo-full' else 0)
        local = [f for f in facts if f.subject == subject and low <= f.chapter <= high and f.key not in used_facts]
        candidates = [q for q in archive if q['materia'] == subject and low <= q['coverage']['chapter'] <= high
                      and normalize(q['pregunta']) not in stems and q.get('source_question_id', q['id']) not in sources]
        remaining = sum(1 for q in paper['questions'][i:] if q['materia'] == subject and not assertion_options(q))
        arity = 3 if subject != 'SALUD PUBLICA' and i >= 50 and len(local) > remaining * 2 else 2
        # Prefer facts from the original chapter, then nearby chapters in the same partial.
        group = fixed.get(f'{paper["id"]}:{i + 1}') or choose_facts(
            [f for f in local if f.chapter == chapter], chapter, arity, used_sets,
        )
        if not group:
            group = choose_facts(local, chapter, arity, used_sets) or choose_facts(local, chapter, 2, used_sets)
        historical = None
        if not group:
            historical = min(candidates, key=lambda q: (
                q['source_question_id'] in used_archival, abs(q['coverage']['chapter'] - chapter),
            ), default=None)
        if not group and not historical:
            raise ValueError(f'Faltan afirmaciones distintas para {paper["id"]}, {subject}, tema {chapter}, posición {i + 1}')
        number = i + 1
        row_id = f'{paper["id"]}-umss-{number:03d}'
        if historical:
            row = {**historical, 'id': row_id, 'numero_original': number, 'numero_pregunta': number}
            sources.add(historical['source_question_id'])
            used_archival.add(historical['source_question_id'])
            changed['archival'] += 1
        else:
            row = compose(group, row_id, number)
            keys = frozenset(f.key for f in group)
            used_sets.add(keys)
            used_facts.update(keys)
            changed['bibliographic'] += 1
        changed['same_topic' if row['coverage']['chapter'] == chapter else 'same_stage'] += 1
        paper['questions'][i] = row
        stems.add(normalize(row['pregunta']))
    return changed


def existing_sets(papers):
    result = set()
    for q in (q for paper in papers for q in paper['questions'] if q.get('truth_values')):
        lines = q['pregunta'].splitlines()[1:]
        if len(lines) == len(q['truth_values']):
            result.add(frozenset(normalize(line.split('. ', 1)[-1]) for line in lines))
    return result


def refresh_audit(report, entries, papers):
    for item in report['models']:
        p = papers[item['id']]
        rows = p['questions']
        item['chapters'] = {s: sorted({q['coverage']['chapter'] for q in rows if q['materia'] == s}) for s in SUBJECTS.values()}
        item['source_question_ids'] = [q['source_question_id'] for q in rows if q.get('source_question_id')]
    sets = {p['id']: {normalize(q['pregunta']) for q in p['questions']} for p in papers.values()}
    keys = [e.get('curatedId', 'demo-full') for e in entries]
    prior = set.union(*(sets[k] for k in keys[:8]))
    fresh = set.union(*(sets[k] for k in keys[8:]))
    report['expansion']['distinct_added_stems'] = len(fresh)
    report['expansion']['stems_not_in_previous_models'] = len(fresh - prior)
    for pair in report['cross_model_exact_stem_overlap']:
        pair['shared'] = len(sets[pair['a']] & sets[pair['b']])


def archival_pool(papers):
    archive = {}
    for paper in papers:
        for q in paper['questions']:
            if assertion_options(q) and q.get('source_question_id') and anchored_paper_row(q):
                archive.setdefault(q['source_question_id'], q)

    folder = ROOT / 'api/_past_exams'
    index = load(folder / 'topic-index.json')
    subject_by_prefix = dict(zip(['morfo', 'biologia', 'salud'], SUBJECTS.values(), strict=True))
    for paper_id, assigned in index['exams'].items():
        for q in load(folder / (paper_id + '.json'))['questions']:
            code = assigned[q['numero_original'] - 1] or ''
            if not re.fullmatch(r'(morfo|biologia|salud)-\d+', code) or not anchored_paper_row(q) or q['id'] in archive:
                continue
            prefix, number = code.split('-')
            subject = subject_by_prefix[prefix]
            digest = hashlib.sha256(json.dumps(q, ensure_ascii=False, sort_keys=True).encode('utf-8')).hexdigest()
            archive[q['id']] = {
                **q, 'materia': subject, 'tema': index['topics'][code]['title'],
                'source_question_id': q['id'], 'source_sha256': digest, 'source_numero_original': q['numero_original'],
                'coverage': {'subject': subject, 'chapter': int(number), 'curriculum': 'past-exams-' + paper_id},
            }
    return list(archive.values())


def build():
    entries = [e for e in load(CATALOGUE)['entries'] if e['scope'] in TOPIC_BOUNDS]
    papers = {e['curatedId']: load(SIM / (e['curatedId'] + '.json')) for e in entries if e.get('curatedId')}
    demo = load(DEMO)
    sample = {'id': 'demo-full', 'scope': 'final', 'questions': demo['full']}
    facts = load_facts()
    used = existing_sets(papers.values()) | existing_sets([sample])
    used.update(frozenset(f.key for f in facts[i:i + 2]) for i in range(0, len(facts), 2))
    fixed = supplemental_facts(facts)
    archive = archival_pool(papers.values())
    counts = {}
    used_archival = set()
    # Allocate unused statements within the sample as well as within each exam.
    # An empty archival pool prevents exposing paid historical rows in the public file.
    for p in [*papers.values(), sample]:
        diff = reformat_paper(p, facts, [] if p is sample else archive, used, used_archival, fixed)
        if diff:
            counts[p['id']] = dict(diff)
    report = load(AUDIT)
    refresh_audit(report, entries, {**papers, 'demo-full': sample})
    if counts:
        report['assertion_revision'] = counts
    for p in papers.values():
        if p['id'] in counts:
            write(SIM / (p['id'] + '.json'), p)
    if sample['id'] in counts:
        write(DEMO, {'full': sample['questions']})
    write(AUDIT, report)
    print(json.dumps(counts, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    build()
