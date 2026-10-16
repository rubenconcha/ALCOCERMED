"""Build topic papers only from PDF-grounded prompts and answers.

All alternatives also come from the supplied bibliography. No numeric
fabrications, Internet sources or legacy unreferenced question bank are used.
Run --verify-pdfs to check every textual evidence against the actual PDFs.
The two image-only health infographics (PDF 9 and 25) were visually checked.
"""
import argparse
import hashlib
import json
import re
import unicodedata
from collections import defaultdict, Counter
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STORE = ROOT / 'api/_evaluations'
SUBJECTS = {'morfo': 'MORFOFUNCION', 'biologia': 'BIOLOGIA CELULAR', 'salud': 'SALUD PUBLICA'}
LABELS = {'morfo': 'Morfofunción', 'biologia': 'Biología celular', 'salud': 'Educación en Salud e Investigación'}
HEALTH_TITLES = ['Educación en salud','Concepto de salud y determinantes','Funciones de salud pública','Niveles de prevención','Promoción de la salud','Atención primaria de salud','Factor de riesgo y salud comunitaria','ODS y cobertura sanitaria','Salud en Bolivia y modelo SAFCI','Epidemiología social','Proceso de investigación','Problema y objetivos de investigación','Marco teórico e hipótesis','Variables y medición','Estadística descriptiva','Muestreo','Frecuencias y gráficos','Medidas de tendencia central','Medidas de posición','Dispersión y forma de los datos','Análisis de datos en Excel y SPSS']
STOP = set('el la los las un una unos unas de del al y o que en con por para se su sus es son como mas a lo le las esta este estas estos una'.split())

@lru_cache(maxsize=50000)
def norm(text):
    return re.sub(r'[^a-z0-9]+', ' ', unicodedata.normalize('NFKD', text.lower()).encode('ascii', 'ignore').decode()).strip()

@lru_cache(maxsize=50000)
def compact(text):
    return norm(text).replace(' ', '')

@lru_cache(maxsize=50000)
def words(text):
    return {word[:-1] if word.endswith('s') and len(word)>4 else word for word in norm(text).split() if word not in STOP}

def similar(a, b):
    a, b = norm(a), norm(b)
    if a == b or a in b or b in a:
        return True
    wa, wb = words(a), words(b)
    return bool(wa and wb) and len(wa & wb) / min(len(wa), len(wb)) >= .50

def tie(value):
    return int(hashlib.sha256(value.encode()).hexdigest()[:12], 16)

def answer_kind(card):
    q, a = norm(card['question']), norm(card['answer'])
    if q.startswith(('quien ', 'quienes ')):
        return 'person'
    if re.search(r'\b(ano|fecha)\b', q) and re.search(r'\b\d{4}\b', a):
        return 'year' if len(a.split()) <= 2 else 'dated-event'
    if re.search(r'\d', a) and len(a.split()) < 12:
        return 'numeric'
    if q.startswith(('donde ', 'en que ', 'hacia donde ', 'a donde ')) and a.startswith(('en ', 'entre ', 'desde ', 'hacia ', 'a ')):
        return 'location'
    if q.startswith(('que es ', 'que son ', 'como se define ', 'como define ')):
        return 'definition'
    if q.startswith(('para que ', 'por que ')) or re.search(r'\b(funcion|finalidad|objetivo|permite|sirve)\b', q):
        return 'function'
    if q.startswith(('cuales ',)) or ' y ' in a and ',' in a:
        return 'list'
    if a.startswith(('a ', 'al ', 'en ', 'entre ', 'desde ', 'hacia ', 'sobre ', 'por ', 'durante ')):
        return 'preposition'
    if a.split()[0] in {'aumenta','aumentan','disminuye','disminuyen','permite','permiten','son','es','se','ser','mantener','reducir','evitar','producir','formar','regular','transportar','estimular','inhibir','adquirir','proporcionar','tomar'}:
        return 'action'
    if a in {'uno','una','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez'}:
        return 'numeric'
    return 'name' if len(a.split()) <= 7 else 'description'

def choose_options(card, pool):
    # Close paraphrases and alternatives stated in the supporting passage are
    # excluded rather than treated as false answers.
    answer = card['answer']
    candidates = []
    for candidate in pool:
        # These neighboring learning outcomes can both answer a broad health
        # education prompt; never use one as a distractor for the other.
        if card['id'].startswith('salud-01-') and candidate['id'].startswith('salud-01-'):
            continue
        if card['id'].startswith('salud-04-') and candidate['id'].startswith('salud-04-') and ('cuaternaria' in card['question'] and 'cuaternaria' in candidate['question']):
            continue
        if answer_kind(card) != answer_kind(candidate):
            continue
        if candidate['id'] == card['id'] or similar(answer, candidate['answer']):
            continue
        if compact(candidate['answer']) in compact(card['evidence']):
            continue
        if norm(candidate['answer']).startswith(('si ', 'no ')):
            continue
        qa, qb = words(card['question']), words(candidate['question'])
        overlap = len(qa & qb) / max(1, len(qa | qb))
        if overlap > .78:
            continue
        same_shape = (len(answer.split()) <= 5) == (len(candidate['answer'].split()) <= 5)
        score = (4 if card['topic'] == candidate['topic'] else 0) + (2 if same_shape else 0) + overlap
        score -= abs(len(answer) - len(candidate['answer'])) / max(100, len(answer))
        candidates.append((-score, tie(card['id'] + candidate['id']), candidate))
    options = [card]
    for _, _, candidate in sorted(candidates, key=lambda item: item[:2]):
        if any(similar(candidate['answer'], other['answer']) for other in options):
            continue
        options.append(candidate)
        if len(options) == 4:
            return options
    return None

def build(verify=False, pdf_dir=Path.home()/'Downloads'):
    sources = json.loads((STORE/'source-cards.json').read_text(encoding='utf8'))
    catalog, audit = [], []
    for source in sources:
        info = source['source']; key = info['id']
        pages = []
        if verify:
            import pymupdf
            doc = pymupdf.open(pdf_dir/info['filename'])
            pages = [compact(page.get_text()) for page in doc]
        groups, pool, seen = {}, [], set()
        for chapter in source['chapters']:
            topic = chapter['topic']
            group = groups.setdefault(topic, {'number': len(groups)+1, 'title': chapter['title'] if key!='salud' else HEALTH_TITLES[min(len(groups),20)], 'cards': []})
            for original in chapter['cards']:
                card = dict(original, topic=topic)
                if verify:
                    image = card.get('evidence_kind') == 'image_transcription' and key == 'salud' and card['pdf_page'] in [9,25]
                    assert image or compact(card['evidence']) in pages[card['pdf_page']-1], card['id']
                # Do not turn yes/no prompts into four unrelated options.
                if norm(card['answer']).startswith(('si ', 'no ')) or len(card['answer']) > 330:
                    continue
                signature = (topic, norm(card['question']))
                if signature in seen:
                    continue
                seen.add(signature); pool.append(card); group['cards'].append(card)
        for topic, group in groups.items():
            identifier = key + '-' + str(group['number']).zfill(2)
            # Round-robin sections spreads coverage across the chapter instead
            # of simply taking the first thirty cards.
            sections = defaultdict(list)
            for card in group['cards']:
                sections[card.get('section') or str(card['pdf_page'])].append(card)
            selected=[]
            while any(sections.values()) and len(selected)<30:
                for section in sections.values():
                    if section and len(selected)<30:
                        card = section.pop(0)
                        options = choose_options(card,pool)
                        if options:
                            selected.append(dict(card, options=options))
            selected.sort(key=lambda c: (c['pdf_page'], c['id']))
            assert len(selected)>=7, (topic,len(selected))
            questions=[]
            for number, card in enumerate(selected,1):
                options=card['options']
                options.sort(key=lambda c:tie(card['id']+'|'+c['id']))
                correct=next(i for i,c in enumerate(options) if c['id']==card['id'])
                row={'content_id':card['id'],'materia':SUBJECTS[key],'tema':topic,'numero_pregunta':number,
                     'pregunta':card['question'],'respuesta_correcta':'ABCD'[correct],
                     'justificacion':card['answer'],'fuente':info['title'],'paginas_pdf':str(card['pdf_page']),
                     'pagina_impresa':str(card.get('page','')),'dificultad':'medio'}
                for index,option in enumerate(options): row['opcion_'+'abcd'[index]]=option['answer']
                questions.append(row)
                audit.append({'paper':identifier,'question':card['id'],'pdf':info['filename'],'pdf_page':card['pdf_page'],
                              'evidence_kind':card.get('evidence_kind','pdf_text'),'evidence_sha256':hashlib.sha256(card['evidence'].encode()).hexdigest(),
                              'option_source_ids':[o['id'] for o in options]})
            paper={'id':identifier,'subject':SUBJECTS[key],'subjectLabel':LABELS[key],'topic':topic,'title':group['title'],
                   'number':group['number'],'count':len(questions),'duration':len(questions),'source':info['title'],'questions':questions}
            (STORE/(identifier+'.json')).write_text(json.dumps(paper,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
            catalog.append({k:v for k,v in paper.items() if k!='questions'})
    target=ROOT/'content/topic-evaluations';target.mkdir(parents=True,exist_ok=True)
    (target/'catalog.json').write_text(json.dumps({'version':1,'exams':catalog},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    (STORE/'source-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps({'evaluations':len(catalog),'questions':len(audit),'subjects':dict(Counter(e['subject'] for e in catalog)),'min':min(e['count'] for e in catalog),'max':max(e['count'] for e in catalog)},ensure_ascii=False))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--verify-pdfs',action='store_true');parser.add_argument('--pdf-dir',type=Path,default=Path.home()/'Downloads')
    args=parser.parse_args();build(args.verify_pdfs,args.pdf_dir)
