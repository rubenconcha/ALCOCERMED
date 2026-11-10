"""Build topic exams from editorially written alternatives and their official readings."""
import argparse
import hashlib
import json
import re
import unicodedata
from collections import defaultdict
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


def from_medicine(entry, paper):
    source = entry['source']
    slug, label = BOOKS[paper['id'].split('-')[0]]
    section = f'{paper["title"]} · {source["section"]}'
    folios = {s['pdfPage']: s['printedPage'] for s in source.get('statements', [])}
    pages, printed = source['pdfPages'], source['printedPages']
    if not folios and len(printed) == len(pages):
        folios = dict(zip(pages, printed))
    return {
        **entry, 'id': 'evaluacion:' + entry['id'],
        'references': [reference(slug, label, section, page, folios.get(page)) for page in pages],
    }


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

    catalog, audit, output = [], [], []
    blood = sangre(refs)
    for metadata in original_catalog['exams']:
        topic = metadata['id']
        if topic in PRESERVED_PAPERS:
            catalog.append(metadata)
            audit.extend(row for row in original_audit if row['paper'] == topic)
            continue
        if topic == 'morfo-18':
            questions = blood
        else:
            questions = [from_medicine(row, metadata) for row in medicine[topic]]
            questions.extend(from_verified_bank(row, metadata, documents[topic]) for row in verified[topic])
        if len(questions) < 8 or len({normalized(row['text']) for row in questions}) != len(questions):
            raise ValueError(f'Cobertura insuficiente o enunciado duplicado: {topic}')
        rows = [arrange(metadata, i, row) for i, row in enumerate(questions, 1)]
        revised = {**metadata, 'count': len(rows), 'duration': len(rows)}
        catalog.append(revised)
        output.append((STORE / f'{topic}.json', {**revised, 'questions': rows}))
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
