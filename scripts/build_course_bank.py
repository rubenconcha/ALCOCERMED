"""Build the Medicine question bank with links to the relevant official PDF pages."""
import argparse
import json
import re
import sys
from collections import defaultdict
from contextlib import ExitStack
from pathlib import Path

from build_topic_evaluations import (
    BOOKS, CATALOG, ROOT, STORE, arrange, from_medicine, from_verified_bank,
    normalized, official_books, read, reference, source_locations, verified_marks,
    verified_printed,
)
from build_verified_bank import load_topics

BANK = ROOT / 'api/_mindmaps'
REVIEWED_EVALUATIONS = ('morfo-01', 'morfo-08', 'morfo-09', 'morfo-18')
ASSERTION_CHOICE = re.compile(r'^(solo|amb[ao]s|ningun[ao]|tod[ao]s)\b.*\b(afirmaci[oó]n(?:es)?|enunciados?)\b', re.I)
# Some reviewed questions had page numbers without coordinates. These passages
# replace those references with the specific paragraphs, labels or illustrations.
SALADIN_PASSAGES = {
    'morfo-01-clase-005': [(52, 'con rayos X'), (52, 'ondas ultrasónicas')],
    'morfo-01-clase-009': [(33, 'publicó el primer atlas'), (33, 'William Harvey')],
    'morfo-01-clase-016': [(41, 'sistemas endocrino y digestivo')],
    'morfo-01-clase-017': [(41, 'Se llama reduccionismo'), (42, 'teoría complementaria')],
    'morfo-01-clase-018': [(43, 'anabolismo'), (43, 'síntesis de proteínas')],
    'morfo-01-clase-020': [(42, 'transposición visceral')],
    'morfo-01-clase-021': [(44, 'capacidad del cuerpo para detec')],
    'morfo-01-clase-023': [(46, 'grador y un efector'), (46, 'Los receptores son estructuras')],
    'morfo-01-clase-024': [(47, 'Retroalimentación positiva en el parto')],
    'morfo-01-clase-025': [(57, 'las palmas y la cara dirigidas'), (58, 'si está boca arriba')],
    'morfo-01-clase-026': [(58, 'Un plano frontal')],
    'morfo-01-clase-027': [(59, 'distal para denotar')],
    'morfo-01-clase-029': [(62, 'La cavidad craneana está encerrada'), (63, 'cavidad pericárdica'), (63, 'cavidad pleural')],
    'morfo-01-clase-030': [(64, 'el peritoneo visceral'), (64, 'órganos retroperitoneales')],
    'morfo-08-visual-003': [(264, 'alveolo dental')],
    'morfo-09-razonamiento-004': [(309, 'como gonfosis'), (309, 'Las suturas son articulaciones')],
    'morfo-09-razonamiento-005': [(310, 'unidos por cartílago hialino'), (311, 'unidos por un disco interpú')],
    'morfo-09-razonamiento-007': [(310, 'pronación y supinación')],
    'morfo-09-razonamiento-024': [(327, 'mediante un disco articular'), (329, 'denominados meniscos lateral y medial')],
    'morfo-09-razonamiento-028': [(333, 'del pie y limita la dorsifl exión')],
    'medicina-oficial-morfo-10-4': [(346, 'un músculo que evita que un hueso se mueva')],
    'medicina-oficial-morfo-15-3': [(601, 'Todas las fibras parasimpáticas son')],
}
# The Compendio's ODS infographic is an image. These are the bounding boxes of
# the four cited tiles on PDF page 9, in PDF points on the original page.
ODS_BOXES = {1: (137, 234, 184, 362), 2: (189, 367, 235, 495),
             3: (189, 101, 235, 230), 4: (345, 367, 391, 495)}


def reading_highlights(row, pdf, slug):
    key = re.sub(r'-(?:facil|intermedio)-', '-', row['content_id'].split(':', 1)[1])
    readings = row['lecturas_comentario']
    if locations := SALADIN_PASSAGES.get(key):
        by_page = defaultdict(list)
        for page, anchor in locations:
            by_page[page].extend(verified_marks(pdf[page - 1], anchor))
        return [reference(slug, readings[0]['label'], readings[0]['section'], page,
                          verified_printed(pdf[page - 1], page, slug), marks)
                for page, marks in by_page.items()]
    if key.startswith('medicina-oficial-salud-08-'):
        x0, y0, x1, y1 = ODS_BOXES[int(key.rsplit('-', 1)[1])]
        rect = pdf[8].rect
        return [{**readings[0], 'printed': 8, 'marks': [[round(value, 4) for value in (
            x0 / rect.width, y0 / rect.height, (x1 - x0) / rect.width, (y1 - y0) / rect.height
        )]]}]
    return readings


def spirillum(paper, pdf):
    section = 'Capítulo 1 · Morfología de las bacterias'
    readings = [
        reference('biologia-celular', 'Calvo', section, page, page,
                  verified_marks(pdf[page - 1], anchor))
        for page, anchor in [(42, 'espirilos (en forma de sacacorchos)'), (44, 'un bacilo curvo')]
    ]
    return arrange(paper, 0, {
        'id': 'banco-curso:biologia-01:espirilo',
        'text': 'Una bacteria presenta forma de sacacorchos. ¿Cómo se denomina esa morfología?',
        'options': ['Coco', 'Espirilo', 'Bacilo recto', 'Bacilo curvo (vibrio)'],
        'correct': 1,
        'difficulty': 'facil',
        'explanation': 'Calvo llama espirilos a las bacterias con forma de sacacorchos. Distingue esa forma de la esférica de los cocos y de la forma de bastoncillo de los bacilos.',
        'comentarios_opciones': {
            'A': 'Los cocos tienen forma esférica.',
            'B': 'La forma de sacacorchos corresponde al espirilo.',
            'C': 'Un bacilo recto tiene forma de bastoncillo.',
            'D': 'Un bastoncillo curvo tiene una curvatura. La forma de sacacorchos describe una hélice.',
        },
        'source': {'document': 'Alfonso Calvo González · Biología celular biomédica'},
        'references': readings,
    })


def build(refs):
    sys.path.insert(0, str(ROOT))
    from tools.suficiencia.build_medicine import read_concepts

    topics = load_topics()
    papers = {entry['id']: entry for entry in read(CATALOG)['exams']}
    concepts = read_concepts()
    editor = read(STORE / 'editorial-revision.json')
    basic, difficult, evaluated = (defaultdict(list) for _ in range(3))
    for entry in read(ROOT / 'api/_sufficiency/medicina-oficial.json')['questions']:
        if entry['difficulty'] in ('facil', 'intermedio'):
            basic[entry['source']['topicId']].append(entry)
    for entry in read(BANK / 'banco-verificado.json'):
        difficult[entry['id'].split(':')[1]].append(entry)
    for topic in REVIEWED_EVALUATIONS:
        for row in read(STORE / f'{topic}.json')['questions']:
            if not any(ASSERTION_CHOICE.search(row.get('opcion_' + letter, '')) for letter in 'abcde'):
                evaluated[topic].append(row)

    output, sample = [], []
    with ExitStack() as stack:
        pdfs, cards = official_books(refs, stack)
        for topic, paper in papers.items():
            area = topic.split('-')[0]
            slug = BOOKS[area][0]
            pdf = pdfs[area]
            explanations = {
                row['options'][row['correct']]: editor.get(row['id'], {}).get('explanation', row['explanation'])
                for row in basic[topic] if row['difficulty'] == 'intermedio'
            }
            chapter = [spirillum(paper, pdf)] if topic == 'biologia-01' else []
            for entry in basic[topic]:
                row = from_medicine(entry, paper, pdf, source_locations(entry, cards, concepts, {}),
                                    explanations, editor)
                row['id'] = 'banco-curso:' + entry['id']
                if entry['difficulty'] == 'facil':
                    row['explanation'] = explanations[entry['options'][entry['correct']]]
                chapter.append(arrange(paper, 0, row))
            for entry in difficult[topic]:
                row = from_verified_bank(entry, paper, basic[topic][0]['source']['document'])
                row['id'] = entry['id']
                chapter.append(arrange(paper, 0, row))
            for row in evaluated[topic]:
                chapter.append({**row, 'content_id': 'banco-curso:' + row['content_id'],
                                'dificultad': 'dificil' if row['dificultad'] == 'aplicacion' else row['dificultad']})

            prompts = set()
            for row in chapter:
                prompt = normalized(row['pregunta'])
                if prompt in prompts:
                    continue
                prompts.add(prompt)
                row['tema'] = topics[paper['subject']][paper['number'] - 1]
                for field in ('numero_pregunta', 'source', 'fuente', 'paginas_pdf', 'pagina_impresa'):
                    row.pop(field, None)
                readings = row['lecturas_comentario'] = reading_highlights(row, pdf, slug)
                if not 1 <= len(readings) <= 2 or any(
                    ref['slug'] != slug or not 1 <= ref['page'] <= len(pdf) or not ref['marks'] for ref in readings
                ):
                    raise ValueError(f'Falta una lectura oficial válida: {row["content_id"]}')
                for ref in readings:
                    ref['printed'] = ref['printed'] or verified_printed(pdf[ref['page'] - 1], ref['page'], slug)
                output.append(row)
            if paper['number'] == 1:
                sample.extend([row['content_id'] for row in chapter if row['dificultad'] == 'facil'][:3])

    if len({row['content_id'] for row in output}) != len(output):
        raise ValueError('Hay identificadores repetidos en el banco.')
    target = ROOT / 'api/_banco/curso.json'
    with target.open('w', encoding='utf-8', newline='\n') as handle:
        encode = json.JSONEncoder(ensure_ascii=False, separators=(',', ':')).encode
        handle.write('{"sample":' + encode(sample) + ',\n"questions":[\n')
        handle.write(',\n'.join(map(encode, output)) + '\n]}\n')
    print(f'{len(output)} preguntas de Medicina en {len(papers)} temas, {len(sample)} de muestra')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--refs', type=Path, required=True)
    build(parser.parse_args().refs)
