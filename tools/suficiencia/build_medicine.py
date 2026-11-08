"""Build the filtered Medicine practices and verify their local PDF references."""

import argparse
import hashlib
import json
import random
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path

import pymupdf


ROOT = Path(__file__).resolve().parents[2]
STORE = ROOT / 'api/_sufficiency'
COLLECTION = 'medicina-oficial'
BOOKS = {
    'morfo': ('morfofuncion', 'Kenneth S. Saladin · Anatomía y fisiología: la unidad entre forma y función · 6.ª edición'),
    'biologia': ('biologia-celular', 'Alfonso Calvo González · Biología celular biomédica · Elsevier, 2015'),
    'salud': ('educacion-salud', 'UMSS · Educación en Salud e Investigación · Curso Básico 2025–2026'),
}
# Folios del bloque escaneado de Metodología de la investigación, legibles en
# el encabezado de la imagen aunque el OCR no los incluye en el texto.
HEALTH_PRINTED = {35: 28, 41: 34, 44: 37, 53: 46, 55: 48, 56: 49, 59: 52, 66: 59, 71: 64}


@dataclass(frozen=True)
class Concept:
    term: str
    question: str
    scenario: str
    explanation: str
    section: str
    pdf_page: int
    printed_page: int | None


def compact(value):
    normalized = unicodedata.normalize('NFKD', value.casefold())
    return re.sub(r'[^a-z0-9]', '', normalized)


def read_concepts():
    groups = {}
    for row in (STORE / 'medicina-conceptos.txt').read_text(encoding='utf8').splitlines():
        if not row or row.startswith('#'):
            continue
        if row.startswith('[') and row.endswith(']'):
            topic_id = row[1:-1]
            if topic_id in groups:
                raise ValueError(f'Tema duplicado: {topic_id}')
            groups[topic_id] = []
        else:
            groups[topic_id].append([value.strip() for value in row.split('|')])
    return groups


def get_concept(row, paper, cards, pdf, book_key):
    card_id, term, question, scenario, explanation, *override = row
    topic, card = cards[card_id]
    if topic != paper['topic'] or not all((term, question, scenario, explanation)):
        raise ValueError(f'Concepto incompleto o fuera del temario: {card_id}')
    number, section, anchor = card['pdf_page'], card['section'], card['evidence']
    if override:
        page, section, anchor = override[0].split(';', 2)
        number = int(page)
    text = pdf[number - 1].get_text()
    # Las cuatro fichas de ODS de esta colección corresponden a la figura revisada de la página 9.
    image = book_key == 'salud' and number == 9 and card.get('evidence_kind') == 'image_transcription'
    if not image and (not compact(anchor) or compact(anchor) not in compact(text)):
        raise ValueError(f'Ancla no encontrada: {card_id}, página PDF {number}')
    printed = None
    if book_key == 'morfo':
        expected = number - 28
        # El folio está en el encabezado, en un orden variable según la página.
        if str(expected) in [line.strip() for line in text.splitlines()[:8]]:
            printed = expected
    if book_key == 'salud' and number == card['pdf_page']:
        expected = card['page']
        if str(expected) in [line.strip() for line in text.splitlines()] or image or HEALTH_PRINTED.get(number) == expected:
            printed = expected
    return Concept(term, question, scenario, explanation, section, number, printed)


def make_question(paper, book_key, difficulty, number, prompt, options, answer, explanation, concepts):
    question_id = f"{COLLECTION}-{paper['id']}-{difficulty}-{number}"
    choices = list(options)
    seed = int.from_bytes(hashlib.sha256(question_id.encode()).digest()[:8], 'big')
    random.Random(seed).shuffle(choices)
    subject, document = BOOKS[book_key]
    return {
        'id': question_id, 'subject': subject, 'topic': paper['title'], 'difficulty': difficulty,
        'text': prompt, 'options': choices, 'correct': choices.index(answer), 'explanation': explanation,
        'source': {
            'collection': COLLECTION, 'document': document, 'topicId': paper['id'],
            'chapterNumber': paper['number'], 'chapter': paper['title'],
            'section': ' / '.join(dict.fromkeys(c.section for c in concepts)),
            'printedPages': sorted({c.printed_page for c in concepts if c.printed_page}),
            'pdfPages': sorted({c.pdf_page for c in concepts}),
        },
    }


def questions_for(paper, book_key, concepts):
    terms = [c.term for c in concepts]
    if len(set(terms)) != 4 or len(concepts) != 4:
        raise ValueError(f"Se requieren cuatro conceptos distintos: {paper['id']}")
    for index, c in enumerate(concepts, start=1):
        yield make_question(paper, book_key, 'facil', index, c.question, terms, c.term, c.explanation, [c])
        yield make_question(paper, book_key, 'intermedio', index, c.scenario + '\n¿Qué opción corresponde al caso?',
                            terms, c.term, c.explanation, [c])
    for index, (a, b, other_a, other_b) in enumerate(
        (concepts, concepts[2:] + concepts[:2]), start=1
    ):
        def option(first, second):
            return f'A: {first.term} · B: {second.term}'

        choices = [option(x, y) for x in (a, other_a) for y in (b, other_b)]
        prompt = f'Caso A. {a.scenario}\nCaso B. {b.scenario}\n¿Qué par responde correctamente a los dos casos?'
        explanation = f'Caso A. {a.explanation}\nCaso B. {b.explanation}'
        yield make_question(paper, book_key, 'dificil', index, prompt, choices, option(a, b), explanation, [a, b])


def build(refs):
    manifest = json.loads((refs / 'manifest.json').read_text(encoding='utf8'))
    files = {row['archivo']: row for row in manifest['archivos']}
    groups = read_concepts()
    catalog = json.loads((ROOT / 'content/topic-evaluations/catalog.json').read_text(encoding='utf8'))['exams']
    if set(groups) != {paper['id'] for paper in catalog}:
        raise ValueError('El banco debe cubrir todos los temas del catálogo')
    sources = json.loads((ROOT / 'api/_evaluations/source-cards.json').read_text(encoding='utf8'))
    questions = []
    for source in sources:
        book_key, name = (source['source'][field] for field in ('id', 'filename'))
        path = refs / name
        with path.open('rb') as stream:
            sha = hashlib.file_digest(stream, 'sha256').hexdigest()
        if sha != files[name]['sha256']:
            raise ValueError(f'La huella del PDF no coincide con el manifiesto: {name}')
        cards = {card['id']: (ch['topic'], card) for ch in source['chapters'] for card in ch['cards']}
        with pymupdf.open(path) as pdf:
            if len(pdf) != files[name]['paginas_pdf']:
                raise ValueError(f'El número de páginas no coincide con el manifiesto: {name}')
            for paper in (p for p in catalog if p['id'].startswith(book_key + '-')):
                concepts = [get_concept(row, paper, cards, pdf, book_key) for row in groups[paper['id']]]
                questions.extend(questions_for(paper, book_key, concepts))
    if len(questions) != len(catalog) * 10:
        raise ValueError('Número inesperado de preguntas')
    lines = ',\n'.join(json.dumps(row, ensure_ascii=False, separators=(',', ':')) for row in questions)
    output = STORE / 'medicina-oficial.json'
    output.write_text('{"collection":"' + COLLECTION + '","questions":[\n' + lines + '\n]}\n', encoding='utf8', newline='\n')
    print(f'{len(questions)} ejercicios de {len(catalog)} temas verificados contra {len(sources)} PDF')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refs', type=Path, required=True, help='Carpeta referencias-oficiales con los tres PDF y el manifiesto')
    build(parser.parse_args().refs)
