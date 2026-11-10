"""Build topic exams from editorially written alternatives and their official readings."""
import argparse
import hashlib
import json
import re
import sys
import unicodedata
from collections import defaultdict
from contextlib import ExitStack
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
STORE = ROOT / 'api/_evaluations'
CATALOG = ROOT / 'content/topic-evaluations/catalog.json'
PRESERVED_PAPERS = {'morfo-01', 'morfo-08', 'morfo-09'}
BOOKS = {
    'morfo': ('morfofuncion', 'Saladin'),
    'biologia': ('biologia-celular', 'Calvo'),
    'salud': ('educacion-salud', 'UMSS'),
}
SALADIN = 'Kenneth S. Saladin · Anatomía y fisiología. La unidad entre forma y función · 6.ª edición'


def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def write(path, content):
    path.write_text(json.dumps(content, ensure_ascii=False, indent=2) + '\n', encoding='utf-8', newline='\n')


def normalized(text):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', text.casefold()))


def arrange(paper, number, entry):
    prompt, options, correct = entry['text'], entry['options'], entry['correct']
    if not prompt.strip() or not entry['explanation'].strip():
        raise ValueError(f'Enunciado o comentario vacío: {entry["id"]}')
    if not 4 <= len(options) <= 5 or len({normalized(o) for o in options}) != len(options) or not 0 <= correct < len(options):
        raise ValueError(f'Opciones inválidas: {entry["id"]}')
    source = entry['source']
    references = entry['references']
    row = {
        'content_id': entry['id'], 'materia': paper['subject'], 'tema': paper['topic'],
        'numero_pregunta': number, 'pregunta': prompt, 'respuesta_correcta': 'ABCDE'[correct],
        'justificacion': entry['explanation'], 'fuente': source['document'],
        'paginas_pdf': ', '.join(str(r['page']) for r in references),
        'pagina_impresa': ', '.join(str(r['printed']) for r in references if r.get('printed') is not None),
        'dificultad': {'intermedio': 'medio'}.get(entry['difficulty'], entry['difficulty']),
        'lecturas_comentario': references, 'source': source,
    }
    if entry.get('comentarios_opciones'):
        row['comentarios_opciones'] = entry['comentarios_opciones']
    row.update({f'opcion_{letter}': option for letter, option in zip('abcde', options)})
    return row


def reference(slug, label, section, page, printed=None, marks=None):
    return {'slug': slug, 'label': label, 'section': section, 'page': page,
            'printed': printed, 'marks': marks or []}


def from_medicine(entry, paper, pdf, anchors, explanations, editor):
    source = entry['source']
    slug, label = BOOKS[paper['id'].split('-')[0]]
    section = f'{paper["title"]} · {source["section"]}'
    folios = {s['pdfPage']: s['printedPage'] for s in source.get('statements', [])}
    pages, printed = source['pdfPages'], source['printedPages']
    if not folios and len(printed) == len(pages):
        folios = dict(zip(pages, printed))
    locations = defaultdict(list)
    for page, anchor in anchors:
        if page not in pages:
            raise ValueError(f'La referencia no corresponde a la pregunta {entry["id"]}')
        locations[page].extend(verified_marks(pdf[page - 1], anchor))
    references = [reference(slug, label, section, page,
                            folios.get(page) or verified_printed(pdf[page - 1], page, slug),
                            list(dict.fromkeys(tuple(mark) for mark in locations[page])))
                  for page in pages]
    prepared = {**entry, **editor.get(entry['id'], {}), 'id': 'evaluacion:' + entry['id'], 'references': references}
    if entry['difficulty'] == 'intermedio':
        prepared['comentarios_opciones'] = {letter: explanations[choice]
                                          for letter, choice in zip('ABCD', entry['options'], strict=True)}
    return prepared


def from_verified_bank(entry, paper, document):
    # The editorial bank puts the key first. Rotate it before displaying it.
    options = [entry['answer'], *entry['distractors']]
    shift = int(hashlib.sha256(entry['id'].encode()).hexdigest(), 16) % len(options)
    choices = options[shift:] + options[:shift]
    return {
        'id': 'evaluacion:' + entry['id'],
        'text': entry['prompt'], 'options': choices, 'correct': choices.index(entry['answer']),
        'difficulty': 'dificil', 'explanation': entry['explanation'],
        'source': {'document': document, 'topicId': paper['id']},
        'references': entry['references'],
    }


def marks(page, anchor):
    return [
        [round(n, 4) for n in (r.x0 / page.rect.width, r.y0 / page.rect.height,
                               r.width / page.rect.width, r.height / page.rect.height)]
        for r in page.search_for(anchor)[:2]
        if 0 <= r.x0 < r.x1 <= page.rect.width and 0 <= r.y0 < r.y1 <= page.rect.height
    ]


def verified_printed(page, number, slug):
    if slug not in ('morfofuncion', 'biologia-celular'):
        return None
    expected = number - 28 if slug == 'morfofuncion' else number
    lines = [line.strip() for line in page.get_text().splitlines()[:8]]
    return expected if str(expected) in lines else None


def verified_marks(page, anchor):
    if not anchor:
        return []
    if normalized(anchor) not in normalized(page.get_text()):
        raise ValueError(f'Pasaje sin verificar en PDF {page.number + 1}: {anchor[:75]}')
    if len(anchor) < 85 and not anchor.strip().isdigit():
        hits = marks(page, anchor)
        if hits:
            return hits
    words = anchor.split()
    for index in (0, len(words) // 2, max(0, len(words) - 6)):
        snippet = ' '.join(words[index:index + 5])
        if len(snippet) >= 12 and (hits := marks(page, snippet)):
            return hits
    return []


def official_books(refs, stack):
    sources = read(STORE / 'source-cards.json')
    manifest = {row['archivo']: row for row in read(refs / 'manifest.json')['archivos']}
    pdfs, cards = {}, {}
    for book in sources:
        source = book['source']
        path = refs / source['filename']
        with path.open('rb') as pdf_file:
            digest = hashlib.file_digest(pdf_file, 'sha256').hexdigest()
        if digest != manifest[path.name]['sha256']:
            raise ValueError(f'El PDF no coincide con el manifiesto: {path.name}')
        pdf = stack.enter_context(pymupdf.open(path))
        if len(pdf) != manifest[path.name]['paginas_pdf']:
            raise ValueError(f'El número de páginas no coincide: {path.name}')
        pdfs[source['id']] = pdf
        cards.update({card['id']: card for chapter in book['chapters'] for card in chapter['cards']})
    return pdfs, cards


def source_locations(entry, cards, concepts, mini):
    def anchor(card):
        return '' if card.get('evidence_kind') == 'image_transcription' else card['evidence']

    source = entry['source']
    topic = source['topicId']
    if entry['difficulty'] == 'intermedio':
        index = int(entry['id'].rsplit('-', 1)[-1]) - 1
        card_id, _, _, _, _, *override = concepts[topic][index]
        card = cards[card_id]
        if override:
            page, _, quote = override[0].split(';', 2)
            return [(int(page), quote if card.get('evidence_kind') != 'image_transcription' else '')]
        return [(card['pdf_page'], anchor(card))]
    if statements := source.get('statements'):
        return [(row['pdfPage'], row.get('anchor') or anchor(cards[row['cardId']])) for row in statements]
    if entry['id'] in mini:
        evidence = mini[entry['id']]
        return [(evidence['evidence_page'], evidence['anchor'])]
    raise ValueError(f'No se encontró el pasaje de {entry["id"]}')


def add_preserved_readings(paper, pdf, editor):
    for row in paper['questions']:
        source = row['source']
        citation = editor.get(row['content_id'], {}).get('citation')
        if citation:
            page = citation['pdf_page']
            printed = verified_printed(pdf[page - 1], page, 'morfofuncion')
            source.update(pdf_pages=[page], evidence_page=page, anchor=citation['anchor'],
                          verified_anchors=[{**citation, 'printed_page': printed}])
            source.pop('evidence_excerpt', None)
            row.update(paginas_pdf=str(page), pagina_impresa=str(printed or ''))
        anchors = source.get('verified_anchors') or [{'pdf_page': source['evidence_page'], 'anchor': source['anchor']}]
        by_page = defaultdict(list)
        for locator in anchors:
            number = locator['pdf_page']
            by_page[number].extend(verified_marks(pdf[number - 1], locator['anchor']))
        section = source.get('section') or paper['title']
        row['lecturas_comentario'] = [
            reference('morfofuncion', 'Saladin', f'Capítulo {paper["number"]} · {section}', page,
                      verified_printed(pdf[page - 1], page, 'morfofuncion'), by_page[page])
            for page in source['pdf_pages']
        ]
    return paper


def sangre(refs):
    manifest = next(row for row in read(refs / 'manifest.json')['archivos'] if row['archivo'].startswith('morfo'))
    path = refs / manifest['archivo']
    with path.open('rb') as pdf:
        digest = hashlib.file_digest(pdf, 'sha256').hexdigest()
    if digest != manifest['sha256']:
        raise ValueError('El PDF de Saladin no coincide con el manifiesto')
    rows = []
    with pymupdf.open(path) as pdf:
        for line in (STORE / 'sangre-revision.txt').read_text(encoding='utf-8-sig').splitlines():
            if not line.strip() or line.startswith('#'):
                continue
            code, digital, section, anchor, prompt, *fields = [part.strip() for part in line.split('|')]
            number = int(digital)
            pairs = list(zip(fields[::2], fields[1::2], strict=True))
            if len(pairs) != 4 or not all(fields):
                raise ValueError(f'Faltan opciones o explicaciones en Sangre: {code}')
            page = pdf[number - 1]
            printed = number - 28
            highlighted = marks(page, anchor)
            if not highlighted or str(printed) not in [item.strip() for item in page.get_text().splitlines()[:8]]:
                raise ValueError(f'Referencia de Sangre sin verificar: {code}, PDF {number}: {anchor}')
            answer, explanation = pairs[0]
            # Rotate with a fixed sequence, so the keys are balanced across the paper.
            shift = (3 * len(rows) + 2) % 4
            ordered = pairs[shift:] + pairs[:shift]
            options = [option for option, _ in ordered]
            rows.append({
                'id': 'morfo-18-' + code, 'text': prompt, 'options': options, 'correct': options.index(answer),
                'explanation': explanation, 'difficulty': 'intermedio',
                'comentarios_opciones': {letter: reason for letter, (_, reason) in zip('ABCD', ordered, strict=True)},
                'source': {
                    'document': SALADIN, 'topicId': 'morfo-18', 'chapterNumber': 18,
                    'file': manifest['archivo'], 'sha256': digest, 'pdf_pages': [number],
                    'section': section, 'verified_anchors': [{'pdf_page': number, 'printed_page': printed, 'anchor': anchor}],
                },
                'references': [reference('morfofuncion', 'Saladin', f'Capítulo 18 · {section}', number, printed, highlighted)],
            })
    if len(rows) != 30 or len({row['id'] for row in rows}) != 30:
        raise ValueError('Sangre requiere treinta preguntas diferentes')
    return rows


def build(refs):
    sys.path.insert(0, str(ROOT))
    from tools.suficiencia.build_medicine import read_concepts

    original_catalog = read(CATALOG)
    original_audit = read(STORE / 'source-audit.json')
    medicine = defaultdict(list)
    verified = defaultdict(list)
    documents = {}
    for row in read(ROOT / 'api/_sufficiency/medicina-oficial.json')['questions']:
        topic = row['source']['topicId']
        documents[topic] = row['source']['document']
        if row['difficulty'] == 'intermedio':
            medicine[topic].append(row)
    for row in read(ROOT / 'api/_sufficiency/medicina-preguntas-por-tema.json'):
        medicine[row['source']['topicId']].append(row)
    for row in read(ROOT / 'api/_mindmaps/banco-verificado.json'):
        verified[row['id'].split(':')[1]].append(row)

    editor = read(STORE / 'editorial-revision.json')
    concepts = read_concepts()
    mini = {
        f'medicina-oficial-biologia-01-{row["id"]}-umss': row['source']
        for row in read(ROOT / 'api/_simulations/mini-foundations.json')['questions']
        if row['materia'] == 'BIOLOGIA CELULAR'
    }
    catalog, audit, output = [], [], []
    blood = sangre(refs)
    with ExitStack() as stack:
        pdfs, cards = official_books(refs, stack)
        for metadata in original_catalog['exams']:
            topic = metadata['id']
            target = STORE / f'{topic}.json'
            pdf = pdfs[topic.split('-')[0]]
            if topic in PRESERVED_PAPERS:
                catalog.append(metadata)
                audit.extend(row for row in original_audit if row['paper'] == topic)
                output.append((target, add_preserved_readings(read(target), pdf, editor)))
                continue
            if topic == 'morfo-18':
                questions = blood
            else:
                explanations = {row['options'][row['correct']]: editor.get(row['id'], {}).get('explanation', row['explanation'])
                                for row in medicine[topic] if row['difficulty'] == 'intermedio'}
                questions = [
                    from_medicine(row, metadata, pdf, source_locations(row, cards, concepts, mini), explanations, editor)
                    for row in medicine[topic]
                ]
                questions.extend(from_verified_bank(row, metadata, documents[topic]) for row in verified[topic])
            if len(questions) < 8 or len({normalized(row['text']) for row in questions}) != len(questions):
                raise ValueError(f'Cobertura insuficiente o enunciado duplicado: {topic}')
            rows = [arrange(metadata, i, row) for i, row in enumerate(questions, 1)]
            revised = {**metadata, 'count': len(rows), 'duration': len(rows)}
            catalog.append(revised)
            output.append((target, {**revised, 'questions': rows}))
            for row in rows:
                audit.append({'paper': topic, 'question': row['content_id'], 'authored_options': True,
                              'pdf_pages': [ref['page'] for ref in row['lecturas_comentario']]})

    for path, paper in output:
        write(path, paper)
    write(CATALOG, {**original_catalog, 'exams': catalog})
    write(STORE / 'source-audit.json', audit)
    print(f'{len(catalog)} evaluaciones de Medicina, {len(audit)} preguntas')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refs', type=Path, required=True)
    build(parser.parse_args().refs)
