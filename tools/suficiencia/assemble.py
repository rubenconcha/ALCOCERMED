from pathlib import Path
import json,random,collections,copy,hashlib
HERE=Path(__file__).resolve().parents[2]/'tmp'/'suficiencia-build';OUT=Path(__file__).resolve().parents[2]/'api'/'_sufficiency'
b=json.loads((HERE/'base-bank.json').read_text(encoding='utf8'))
numeric=json.loads((HERE/'calculation-questions.json').read_text(encoding='utf8'))
reading=json.loads((HERE/'new-reading.json').read_text(encoding='utf8'))
b['questions']+=numeric+reading['questions'];b['passages']+=reading['passages']
assert len(b['questions'])==800
assert len({q['id'] for q in b['questions']})==800
assert len({q['text'] for q in b['questions'] if q['subject']!='lectura'})==600
assert len({p['text'] for p in b['passages']})==40
assert collections.Counter(q['subject'] for q in b['questions'])==dict.fromkeys(['matematicas','fisica','quimica','lectura'],200)

labels={'matematicas':'Matemáticas','fisica':'Física','quimica':'Química','lectura':'Lectura comprensiva'}
rng=random.Random('AlcocerMed-simulacros-ABP-800-v1')
def buckets(subject):
 pool=[q for q in b['questions'] if q['subject']==subject];rng.shuffle(pool)
 groups=collections.defaultdict(list)
 for q in pool:groups[q.get('family','original:'+q['topic'])].append(q)
 keys=list(groups);rng.shuffle(keys)
 result=[[] for _ in range(20)];used=[collections.Counter() for _ in range(20)]
 # Distribute the most common families first; never repeat a family in a
 # paper while a same-size bucket without that family remains available.
 for family in sorted(keys,key=lambda k:-len(groups[k])):
  for q in groups[family]:
   candidates=[i for i in range(20) if len(result[i])<10];rng.shuffle(candidates)
   index=min(candidates,key=lambda i:(used[i][family],len(result[i])))
   result[index].append(q['id']);used[index][family]+=1
 for bucket in result:assert len(bucket)==10;rng.shuffle(bucket)
 return result
sets={s:buckets(s) for s in ['matematicas','fisica','quimica']}
passages=b['passages'].copy();rng.shuffle(passages)
reading_ids={p['id']:[q['id'] for q in b['questions'] if q.get('passageId')==p['id']] for p in passages}
assert all(len(ids)==5 for ids in reading_ids.values())
sets['lectura']=[sum((reading_ids[p['id']] for p in passages[i:i+2]),[]) for i in range(0,40,2)]

papers=[]
for i in range(20):
 ids=sum((sets[s][i] for s in labels),[])
 papers.append({'id':f'completo-{i+1:02}','title':f'Simulacro {i+1:02}','subject':'integral','questionIds':ids,'questionCount':40,'minutes':60,'description':'Matemáticas, física, química y lectura comprensiva.','type':'completo','commented':True})
for subject,label in labels.items():
 for i in range(10):
  ids=sets[subject][2*i]+sets[subject][2*i+1]
  papers.append({'id':f'{subject}-{i+1:02}','title':f'{label} {i+1:02}','subject':subject,'questionIds':ids,'questionCount':20,'minutes':30,'description':'Cuatro lecturas con preguntas de comprensión.' if subject=='lectura' else 'Ejercicios de práctica con comentario de resolución.','type':'por-materia','commented':True})

for paper in papers:assert len(paper['questionIds'])==paper['questionCount']==len(set(paper['questionIds']))
full=collections.Counter(q for p in papers if p['subject']=='integral' for q in p['questionIds'])
subject=collections.Counter(q for p in papers if p['subject']!='integral' for q in p['questionIds'])
assert set(full)==set(subject)=={q['id'] for q in b['questions']}
assert all(count==1 for count in full.values()) and all(count==1 for count in subject.values())
b['papers']=papers;b['contentRevision']=2
b['statistics']={'questions':800,'perSubject':dict.fromkeys(labels,200),'passages':40,'completeSimulations':20,'subjectSimulations':40,'sourceSelection':122,'newPractice':678,'uniqueQuestionCount':800}
b['statistics'].update(abpDocumentQuestions=92,newABPStyleExercises=508,readingQuestions=200)
b['readingSource']['pdfPages']=sorted({n for p in b['passages'] for n in p['source']['pdfPages']})
b['readingSource']['printedPages']=sorted({n for p in b['passages'] for n in p['source']['printedPages']})
b['readingSource']['chapters']=[1,2]
b['readingSource'].pop('chapter',None)
serialized=json.dumps(b,ensure_ascii=False,indent=2)+'\n'
assert len(serialized.encode())<3_000_000
(OUT/'bank.json').write_text(serialized,encoding='utf8')
audit=json.loads((OUT/'source-audit.json').read_text(encoding='utf8'))
audit['expansion']={'date':'2026-10-30','authorizedBy':'Solicitud expresa de mucho material nuevo siguiendo la lógica del documento de La Paz, con comentarios.','statistics':b['statistics'],'calculationFamilies':dict(collections.Counter(q['subject'] for q in numeric)),'basis':'508 variantes nuevas ancladas a ejercicios concretos del ABP; 34 lecturas nuevas y 170 preguntas adaptadas de los capítulos 1 y 2 de Saladin. Se distinguen expresamente de la selección original.','fixedPapers':'Los 20 completos cubren las 800 preguntas una sola vez. Los 40 por materia vuelven a distribuir el mismo banco para repaso focalizado; no representan otras 800 preguntas diferentes.','readingReferences':[{'id':p['id'],'title':p['title'],'source':p['source']} for p in reading['passages']]}
audit['counts']=b['statistics']['perSubject']
audit['reading']['pdfPages']=b['readingSource']['pdfPages'];audit['reading']['printedPages']=b['readingSource']['printedPages'];audit['reading']['chapters']=[1,2]
audit['reading'].pop('chapter',None)
audit['reading']['note']='El documento ABP no aporta pasajes completos de lectura comprensiva. Los 40 textos y sus 200 preguntas son adaptaciones didácticas de los capítulos 1 y 2 del texto oficial de Saladin, no preguntas del examen ABP. Incluyen las seis lecturas iniciales y 34 nuevas.'
audit['reading']['passages']=[{'id':p['id'],'title':p['title'],'source':p['source']} for p in b['passages']]
audit['grading'].update(completeSimulations=20,subjectSimulations=40,subjectQuestions=20,subjectMinutes=30)
(OUT/'source-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Assembled',len(b['questions']),'questions,',len(b['passages']),'texts,',len(papers),'fixed papers;',len(serialized.encode()),'bytes')
