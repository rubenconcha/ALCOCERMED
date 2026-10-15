import json,re,sys
from pathlib import Path
from collections import Counter
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
packs=json.loads((ROOT/'content/morfo_sangre_sentidos_2026.json').read_text(encoding='utf8'))['packs']
assert len(packs)==2
for p in packs:
    rows=p['questions'];assert len(rows)==80 and len({r['PREGUNTA'] for r in rows})==80
    assert Counter(r['RESPUESTA_CORRECTA'] for r in rows)==dict.fromkeys('ABCD',20)
    for r in rows:
        assert r['TEMA']==p['topic'] and r['MATERIA']=='MORFOFUNCION'
        assert len(set(r['OPCION_'+a].lower() for a in 'ABCD'))==4
        assert r['EXPLICACION'] and 'capítulo '+str(p['chapter']) in r['FUENTE']
        assert re.fullmatch(r'\d+-\d+',r['PAGINAS_PDF'])
    assert len(p['simulacro'])==40 and len(p['evaluation']['questions'])==30
    assert len({q['pregunta'] for q in p['simulacro']})==40
    assert {q['pregunta'] for q in p['simulacro']}.isdisjoint(q['texto'] for q in p['evaluation']['questions'])
    for section in p['sections']:
        questions={q['question'] for q in section['items']}
        assert len(questions & {q['pregunta'] for q in p['simulacro']})==4
        assert len(questions & {q['texto'] for q in p['evaluation']['questions']})==3
    for q in p['evaluation']['questions']:
        assert len(q['opciones'])==4 and sum(o['correct'] for o in q['opciones'])==1
    correct=[next('ABCD'[i] for i,o in enumerate(q['opciones']) if o['correct']) for q in p['evaluation']['questions']]
    assert set(correct)==set('ABCD') and max(Counter(correct).values())-min(Counter(correct).values())<=1
    reader=PdfReader(ROOT/'api/_pdf'/f'{p["summary"]}.pdf');assert len(reader.pages)==10
    for i,page in enumerate(reader.pages):
        text=page.extract_text();assert 'CONCEPTOS ESENCIALES' in text and 'Fuente de este bloque' in text
        assert p['sections'][i]['title'] in re.sub(r'\s+',' ',text) and '\ufffd' not in text
    assert (ROOT/'assets/resumenes-portadas'/f'{p["summary"]}.png').exists()
    sql=(ROOT/f'SQL_MORFO_{p["slug"].upper()}_COMPLETO_2026.sql').read_text(encoding='utf8')
    assert 'WHERE NOT EXISTS' in sql and 'ON CONFLICT(id) DO NOTHING' in sql
    assert not re.search(r'\b(DELETE|TRUNCATE|DROP TABLE|ALTER POLICY)\b',sql,re.I)
print('PASS: 160 reviewed questions/cards, balanced answers, all 20 sections, independent 40/30-question selections, PDF text/pages, covers and additive imports.')
