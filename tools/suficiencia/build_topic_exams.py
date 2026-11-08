"""Build the difficult questions for Medicine practice by topic from local references."""

import argparse
import hashlib
import json
import re
from pathlib import Path

import pymupdf

from build_medicine import BOOKS, COLLECTION, ROOT, STORE, assertion_question, compact, get_concept

DRAFT = STORE / 'medicina-preguntas-por-tema.txt'
OUTPUT = STORE / 'medicina-preguntas-por-tema.json'
STARTER_MINI = ROOT / 'api/_simulations/mini-foundations.json'


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def read_questions():
    topics = {}
    topic = None
    pair = []
    for line_number, line in enumerate(DRAFT.read_text(encoding='utf-8').splitlines(), start=1):
        line = line.strip()
        if line.startswith('#'):
            continue
        if not line or line.startswith('['):
            if pair:
                if len(pair) not in (2, 3):
                    raise ValueError(f'{topic}: dos o tres afirmaciones requeridas, línea {line_number}')
                topics[topic].append(pair)
                pair = []
            if line.startswith('['):
                topic = line.removeprefix('[').removesuffix(']')
                if topic in topics:
                    raise ValueError(f'Tema repetido: {topic}')
                topics[topic] = []
            continue
        match = re.fullmatch(r'([+-]) ([^|]+) \| ([^|]+) \| ([^|]+)', line)
        if not topic or not match:
            raise ValueError(f'Formato inválido, línea {line_number}')
        sign, reference, statement, reason = match.groups()
        pair.append((sign == '+', reference.strip(), statement.strip(), reason.strip()))
    if pair:
        if len(pair) not in (2, 3):
            raise ValueError(f'{topic}: dos o tres afirmaciones requeridas')
        topics[topic].append(pair)
    return topics


def statement_source(reference, paper, cards, pdf, book_key):
    if reference.startswith('@'):
        page, section, anchor = reference[1:].split(';', 2)
        page = int(page)
        content = pdf[page - 1].get_text()
        if compact(anchor) not in compact(content):
            raise ValueError(f'Ancla no encontrada: {paper["id"]}, página PDF {page}: {anchor}')
        expected = page - 28 if book_key == 'morfo' else None
        printed = expected if str(expected) in [line.strip() for line in content.splitlines()[:8]] else None
        return {'pdfPage': page, 'printedPage': printed, 'section': section, 'anchor': anchor}

    context = get_concept([reference, reference, reference, reference, reference], paper, cards, pdf, book_key)
    return {
        'pdfPage': context.pdf_page, 'printedPage': context.printed_page,
        'section': context.section, 'cardId': reference,
    }


def write_question(paper, book_key, index, draft, cards, pdf):
    parts = [(statement, truth, reason) for truth, _, statement, reason in draft]
    item = assertion_question(parts)
    citations = [statement_source(ref, paper, cards, pdf, book_key) for _, ref, _, _ in draft]
    subject, document = BOOKS[book_key]
    return {
        'id': f'{COLLECTION}-{paper["id"]}-ampliacion-{index:02d}-umss',
        'subject': subject, 'topic': paper['title'], 'difficulty': 'dificil',
        **item,
        'source': {
            'collection': COLLECTION, 'document': document, 'topicId': paper['id'],
            'chapterNumber': paper['number'], 'chapter': paper['title'],
            'section': ' / '.join(dict.fromkeys(c['section'] for c in citations)),
            'printedPages': sorted({c['printedPage'] for c in citations if c['printedPage'] is not None}),
            'pdfPages': sorted({c['pdfPage'] for c in citations}),
            'statements': citations,
        },
    }


def reviewed_mini(rows, papers, book_key, file, sha, pdf):
    # Keep the checked mini-exam corrections under distinct practice IDs.
    for row in rows:
        source = row['source']
        if source['file'] != file:
            continue
        topic = {'biologia': 'biologia-01', 'morfo': 'morfo-08'}[book_key]
        page = source['evidence_page']
        if (source['sha256'] != sha or page not in source['pdf_pages']
                or compact(source['anchor']) not in compact(pdf[page - 1].get_text())):
            raise ValueError(f'La referencia del minisimulacro no coincide: {row["id"]}')
        paper = papers[topic]
        subject, document = BOOKS[book_key]
        yield {
            'id': f'{COLLECTION}-{topic}-{row["id"]}-umss',
            'subject': subject, 'topic': paper['title'], 'difficulty': 'dificil',
            'text': row['pregunta'],
            'options': [row['opcion_' + letter] for letter in 'abcd'],
            'correct': 'ABCD'.index(row['respuesta_correcta']),
            'truth_values': row['truth_values'],
            'explanation': row['justificacion'],
            'comentarios_opciones': row['comentarios_opciones'],
            'source': {
                'collection': COLLECTION, 'document': document, 'topicId': topic,
                'chapterNumber': paper['number'], 'chapter': paper['title'],
                'section': source['section'], 'pdfPages': source['pdf_pages'],
                'printedPages': [int(p) for p in (source['printed_pages'] or [])],
            },
        }


def build(refs):
    manifest = {row['archivo']: row for row in read_json(refs / 'manifest.json')['archivos']}
    papers = {p['id']: p for p in read_json(ROOT / 'content/topic-evaluations/catalog.json')['exams']}
    bank = read_json(ROOT / 'api/_evaluations/source-cards.json')
    draft = read_questions()
    reused_topics = {'morfo-08', 'biologia-01'}
    expected_topics = set(papers) - reused_topics
    if set(draft) != expected_topics:
        raise ValueError(f'Revisar cobertura del borrador: {sorted(expected_topics ^ set(draft))}')
    mini = [row for row in read_json(STARTER_MINI)['questions']
            if row['materia'] == 'BIOLOGIA CELULAR' or row['coverage']['chapter'] == 8]
    questions = []
    for book in bank:
        source = book['source']
        book_key, file = source['id'], source['filename']
        with (refs / file).open('rb') as f:
            sha = hashlib.file_digest(f, 'sha256').hexdigest()
        if sha != manifest[file]['sha256']:
            raise ValueError(f'La huella del PDF no coincide: {file}')
        cards = {c['id']: (ch['topic'], c) for ch in book['chapters'] for c in ch['cards']}
        with pymupdf.open(refs / file) as pdf:
            if len(pdf) != manifest[file]['paginas_pdf']:
                raise ValueError(f'Cantidad de páginas no coincide: {file}')
            questions.extend(reviewed_mini(mini, papers, book_key, file, sha, pdf))
            for topic, items in draft.items():
                if not topic.startswith(book_key + '-'):
                    continue
                if len(items) < 4:
                    raise ValueError(f'Pocas preguntas en {topic}: {len(items)}')
                statements = [compact(row[2]) for item in items for row in item]
                if len(statements) != len(set(statements)):
                    raise ValueError(f'Afirmaciones repetidas en {topic}')
                for i, item in enumerate(items, start=1):
                    questions.append(write_question(papers[topic], book_key, i, item, cards, pdf))
    if len([q for q in questions if q['source']['topicId'] == 'morfo-01']) != 18:
        raise ValueError('Morfofunción 1 requiere dieciocho preguntas nuevas')
    payload = ',\n'.join(json.dumps(q, ensure_ascii=False, separators=(',', ':')) for q in questions)
    OUTPUT.write_text('[\n' + payload + '\n]\n', encoding='utf-8', newline='\n')
    print(f'{len(questions)} preguntas adicionales verificadas en los PDF locales')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refs', required=True, type=Path)
    build(parser.parse_args().refs)
