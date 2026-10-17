"""Verify every official-source citation and build the protected study catalogue.

No textbook or evidence excerpt is sent to the browser. The authoring sources stay
under api/_flashcards and are blocked from direct requests by the deployment config.
"""
from __future__ import annotations
import argparse
from collections import Counter
from hashlib import sha256
import json
from pathlib import Path
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
SUBJECTS = {'morfo': 'MORFOFUNCION', 'biologia': 'BIOLOGIA CELULAR', 'salud': 'SALUD PUBLICA'}
EXPECTED = {'morfo': 29, 'biologia': 18, 'salud': 21}


def normalized(text):
    text = re.sub(r'(\w)[-\u00ad]\s*\n\s*(\w)', r'\1\2', str(text))
    text = unicodedata.normalize('NFKD', text).casefold()
    return re.sub(r'[^\w]+', '', text)


def build(pdf_dir=None):
    cards, topics, stats, seen_ids, seen_questions = [], [], [], set(), set()
    reviews_path = ROOT / 'api' / '_flashcards' / 'image-evidence-reviewed.json'
    image_reviews = json.loads(reviews_path.read_text(encoding='utf-8')) if reviews_path.exists() else {}
    for source_id, materia in SUBJECTS.items():
        source_path = ROOT / 'api' / '_flashcards' / 'sources' / (source_id + '.json')
        payload = json.loads(source_path.read_text(encoding='utf-8'))
        source = payload['source']
        if source['id'] != source_id or not source.get('title') or not source.get('filename'):
            raise ValueError('Fuente incompleta: ' + source_id)
        if len(payload['chapters']) < EXPECTED[source_id]:
            raise ValueError('Faltan temas: ' + source_id)
        doc = None
        if pdf_dir:
            import pymupdf
            doc = pymupdf.open(pdf_dir / source['filename'])
        source_count, word_counts, image_count = 0, [], 0
        chapter_bounds = {}
        if doc and source_id == 'morfo':
            landmarks = []
            for level, title, page_index in doc.get_toc():
                match = re.match(r'(Capítulo\s+\d+|Atlas\s+[A-Z])\b', title)
                if match:
                    landmarks.append((normalized(match.group(1)), page_index))
                elif title.startswith('Apéndice A:'):
                    landmarks.append(('appendix', page_index))
            for position, (label, start) in enumerate(landmarks[:-1]):
                chapter_bounds[label] = (start, landmarks[position + 1][1] - 1)
        elif doc and source_id == 'biologia':
            covers = []
            for sheet in doc:
                text = sheet.get_text()
                cover = re.search(r'CAPÍTULO\s+(\d+)', text)
                if cover and len(text) < 100:
                    covers.append((normalized('Capítulo ' + cover.group(1)), sheet.number + 1))
            if len(covers) != 18:
                raise ValueError('No se identificaron los 18 capítulos de Biología')
            index_start = next(sheet.number + 1 for sheet in doc
                               if sheet.number + 1 > covers[-1][1] and 'Índice alfabético' in sheet.get_text())
            covers.append(('index', index_start))
            for position, (label, start) in enumerate(covers[:-1]):
                chapter_bounds[label] = (start, covers[position + 1][1] - 1)
        chapter_names = set()
        for chapter in payload['chapters']:
            if not chapter['title'] or not chapter['topic'] or not chapter['cards']:
                raise ValueError('Capítulo vacío: ' + source_id)
            number = chapter.get('number')
            label = chapter.get('label') or ('Capítulo ' + str(number) if number is not None else '')
            chapter_label = (label + ': ' if label else '') + chapter['title']
            chapter_names.add((label, chapter['title']))
            group = {'materia': materia, 'tema': chapter['topic'], 'chapter': number,
                     'chapter_title': chapter['title'], 'count': len(chapter['cards']), 'free_count': 0}
            for index, item in enumerate(chapter['cards']):
                question, answer = item['question'].strip(), item['answer'].strip()
                item_id = item['id']
                fingerprint = (materia, normalized(question))
                if item_id in seen_ids or fingerprint in seen_questions:
                    raise ValueError('Tarjeta duplicada: ' + item_id + ' / ' + question)
                seen_ids.add(item_id)
                seen_questions.add(fingerprint)
                if not question.startswith('¿') or not question.endswith('?') or len(question) < 12 or len(question.split()) > 35:
                    raise ValueError('Pregunta incompleta: ' + item_id)
                words = len(answer.split())
                if not answer or words > 25 or '\ufffd' in question + answer:
                    raise ValueError('Respuesta demasiado larga o dañada: ' + item_id)
                if answer.casefold().strip(' .!') in {'sí', 'si', 'no'}:
                    raise ValueError('Respuesta sin criterio ni aclaración: ' + item_id)
                # Keep paired comparisons on separate lines without changing their words.
                answer = re.sub(r'(?<=[.;]) +(?=[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?: [a-záéíóúüñ]+){0,3}:)', '\n', answer)
                if re.search(r'\b(importancia|por qué es importante|qué relación conceptual|cómo integrarías)\b', question, re.I):
                    raise ValueError('Pregunta vaga: ' + item_id)
                page, pdf_page = item['page'], item['pdf_page']
                if not isinstance(pdf_page, int) or pdf_page < 1 or not page:
                    raise ValueError('Página incompleta: ' + item_id)
                if source_id == 'morfo':
                    if page != pdf_page - 28:
                        raise ValueError('Numeración de Saladin incorrecta: ' + item_id)
                    if doc:
                        bounds = chapter_bounds.get(normalized(label))
                        if not bounds or not bounds[0] <= pdf_page <= bounds[1]:
                            raise ValueError('La página pertenece a otro capítulo: ' + item_id)
                elif source_id == 'biologia' and page != pdf_page:
                    raise ValueError('Numeración de Biología incorrecta: ' + item_id)
                if doc and source_id == 'biologia':
                    bounds = chapter_bounds.get(normalized(label))
                    if not bounds or not bounds[0] <= pdf_page <= bounds[1]:
                        raise ValueError('La página pertenece a otro capítulo: ' + item_id)
                evidence = item.get('evidence')
                if not evidence:
                    raise ValueError('Falta evidencia: ' + item_id)
                if item.get('evidence_kind') == 'image_transcription':
                    digest = sha256(json.dumps(item, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
                    review = image_reviews.get(item_id)
                    if not review or review['card_sha256'] != digest or review['pdf_page'] != pdf_page:
                        raise ValueError('Falta revisión visual de la infografía: ' + item_id)
                    image_count += 1
                elif doc:
                    if pdf_page > len(doc):
                        raise ValueError('Página fuera del PDF: ' + item_id)
                    text = normalized(doc[pdf_page - 1].get_text())
                    for excerpt in evidence if isinstance(evidence, list) else [evidence]:
                        if normalized(excerpt) not in text:
                            raise ValueError('Evidencia ausente en su página: ' + item_id + ' / ' + str(pdf_page))
                pages = ', '.join(map(str, page)) if isinstance(page, list) else str(page)
                reference = source['title'] + ' · ' + chapter_label + ' · pág. ' + pages
                cards.append({'id': item_id, 'materia': materia, 'tema': chapter['topic'],
                              'pregunta': question, 'respuesta': answer, 'subtema': item['section'],
                              'chapter': number, 'chapter_title': chapter['title'], 'source_title': source['title'],
                              'page': page, 'pdf_page': pdf_page, 'reference': reference,
                              'official_source': source_id, 'source_reviewed': True})
                if item.get('answer_table'):
                    table = item['answer_table']
                    if not table.get('title') or not 2 <= len(table['columns']) <= 6 or not 1 <= len(table['rows']) <= 8:
                        raise ValueError('Cuadro incompleto: ' + item_id)
                    if any(len(row) != len(table['columns']) for row in table['rows']):
                        raise ValueError('Columnas del cuadro inconsistentes: ' + item_id)
                    if source_id != 'morfo' or table['page'] != table['pdf_page'] - 28:
                        raise ValueError('Referencia del cuadro incorrecta: ' + item_id)
                    bounds = chapter_bounds.get(normalized(label))
                    if doc and (not bounds or not bounds[0] <= table['pdf_page'] <= bounds[1]
                                or normalized(table['evidence']) not in normalized(doc[table['pdf_page'] - 1].get_text())):
                        raise ValueError('Evidencia del cuadro ausente: ' + item_id)
                    cards[-1]['answer_table'] = {key: table[key] for key in ['title', 'columns', 'rows', 'note']}
                    cards[-1]['answer_table']['reference'] = source['title'] + ' · ' + chapter_label + ' · pág. ' + str(table['page'])
                source_count += 1
                word_counts.append(words)
            existing = next((topic for topic in topics if topic['materia'] == materia and topic['tema'] == group['tema']), None)
            if existing:
                existing['count'] += group['count']
                existing['free_count'] += group['free_count']
            else:
                topics.append(group)
        stats.append({'materia': materia, 'chapters': len(chapter_names), 'topics': len({ch['topic'] for ch in payload['chapters']}), 'cards': source_count,
                      'longest_answer_words': max(word_counts), 'median_answer_words': sorted(word_counts)[len(word_counts)//2],
                      'source_sha256': sha256(source_path.read_bytes()).hexdigest(), 'visually_verified_cards': image_count,
                      'pdf_sha256': sha256((pdf_dir / source['filename']).read_bytes()).hexdigest() if pdf_dir else None})
    output = {'schema': 'official-flashcards-v1', 'version': '2026-10-16', 'cards': cards, 'catalog': topics}
    subtopics = Counter((c['materia'], c['tema'], c['subtema']) for c in cards)
    thin = [(key, count) for key, count in subtopics.items() if count < 3]
    if thin:
        raise ValueError('Subtemas con menos de tres tarjetas: ' + str(thin))
    target = ROOT / 'api' / '_flashcards' / 'library.json'
    target.write_text(json.dumps(output, ensure_ascii=False, separators=(',', ':')), encoding='utf-8', newline='\n')
    report = {'version': output['version'], 'verified_against_pdf': bool(pdf_dir), 'total_cards': len(cards), 'total_topics': len(topics),
              'total_subtopics': len(subtopics), 'minimum_cards_per_subtopic': min(subtopics.values()),
              'subjects': stats, 'topics': topics, 'library_sha256': sha256(target.read_bytes()).hexdigest()}
    (ROOT / 'api' / '_flashcards' / 'audit.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8', newline='\n')
    print(json.dumps({k: v for k, v in report.items() if k != 'topics'}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--pdf-dir', type=Path)
    build(parser.parse_args().pdf_dir)
