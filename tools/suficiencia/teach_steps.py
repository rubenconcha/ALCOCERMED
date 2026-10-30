"""Attach beginner-level worked lessons without changing questions or answer keys."""
from pathlib import Path
import json,hashlib,re,copy
from collections import Counter
import teach_math,teach_physics,teach_chemistry,teach_original,teach_reading
ROOT=Path(__file__).resolve().parents[2]
path=ROOT/'api/_sufficiency/bank.json'
bank=json.loads(path.read_text(encoding='utf8'))
checks=json.loads((ROOT/'tmp/suficiencia-build/calculation-checks.json').read_text(encoding='utf8'))
inputs={r['id']:r for r in checks}
passages={p['id']:p for p in bank['passages']}
modules={'matematicas':teach_math,'fisica':teach_physics,'quimica':teach_chemistry}
before=copy.deepcopy(bank['questions'])
for q in bank['questions']:
    if q['subject']=='lectura':worked=teach_reading.explain(q,passages[q['passageId']])
    elif q['id'] in inputs:
        data=inputs[q['id']];worked=modules[q['subject']].explain(data['family'],data['inputs'])
    else:worked=copy.deepcopy(teach_original.explain(q))
    worked['answer']=q['options'][q['correct']]
    assert 4<=len(worked['steps'])<=12,q['id']
    for row in worked['steps']:
        assert row['title'] and row['text'],q['id']
        if 'quote' in row:assert row['quote'] in passages[q['passageId']]['text'].split('\n\n')[row['paragraph']-1],q['id']
    text=json.dumps(worked,ensure_ascii=False)
    assert not re.search(r'\b(?:NaN|Infinity|undefined)\b|\{(?:a|b|c|n|value)\}',text),q['id']
    q['solution']=worked
assert [{k:v for k,v in q.items() if k!='solution'} for q in bank['questions']]==before
bank['teachingRevision']=1
path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
report={'revision':1,'date':'2026-10-30','questions':len(bank['questions']),'areas':dict(Counter(q['subject'] for q in bank['questions'])),'stepCount':dict(sorted(Counter(len(q['solution']['steps']) for q in bank['questions']).items())),'numericFamilies':len({(r['subject'],r['family']) for r in checks}),'originalAbpLessons':len(teach_original.LESSONS),'readingLessons':sum(q['subject']=='lectura' for q in bank['questions']),'questionAndKeySha256':hashlib.sha256(json.dumps(before,ensure_ascii=False,sort_keys=True).encode()).hexdigest(),'bankBytes':path.stat().st_size,'preserved':['ids','questions','options','answer keys','sources','passages','papers','saved-attempt version'],'notes':['Each numeric family has an explicit formula/substitution/arithmetic lesson; no splitting of the former paragraph.','Reading evidence is checked as an exact substring of the named paragraph.','The closest printed alternative in abp-35-56 is explicitly identified as such; original options remain unchanged.']}
(ROOT/'api/_sufficiency/teaching-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(json.dumps(report,ensure_ascii=False))
