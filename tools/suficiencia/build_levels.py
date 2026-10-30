"""Classify by prerequisite/operation demand and build deterministic level papers.

Reading levels apply to complete passages (including all five questions), so
no paper presents a fragment of a text or silently mixes passage levels.
"""
from pathlib import Path
from collections import Counter,defaultdict
import json,math,random
ROOT=Path(__file__).resolve().parents[2];path=ROOT/'api/_sufficiency/bank.json'
b=json.loads(path.read_text(encoding='utf8'))
labels={'matematicas':'Matemáticas','fisica':'Física','quimica':'Química','lectura':'Lectura comprensiva'}
levels={'facil':'Fácil','intermedio':'Intermedio','dificil':'Difícil'}
easy_original=set('36-64 41-22 18-42 41-26 36-65 36-69 10-33 05-08 36-61 36-71 30-35 17-31 17-32 17-33 17-35 05-13 05-14 13-13 13-20 16-24 36-59 35-53 35-54 35-45 35-46 16-22 44-49'.split())
hard_original=set('05-09 10-36 13-07 13-10 26-40 30-34 36-74 37-77 21-35 13-14 17-39 34-28 34-29 43-40 21-27 25-25 36-57 43-43 44-46'.split())
easy_read=set('lectura-hipotesis lectura-experimento lectura-variacion'.split())
easy_read|={'lectura-ampliada-'+s for s in 'forma-funcion exploracion escala ciencia-cooperativa celulas vida desarrollo palabras precision referencia eponimos'.split()}
mid_read=set('lectura-revision lectura-teorias lectura-homeostasis'.split())
mid_read|={'lectura-ampliada-'+s for s in 'comparacion autoridad vesalio circulacion microscopios induccion muestras replicacion historia-evolutiva jerarquia'.split()}
family_levels={
 'matematicas':{'facil':{'promedio','multiplos','razon'},'dificil':{'logaritmos','log-base-variable','identidad-cubica','diferencia-cuadrados'}},
 'fisica':{'facil':{'ondas','temperatura'},'dificil':{'tiro-vertical','dos-encuentros','plano-inclinado','lente-divergente','lente-convergente'}},
 'quimica':{'facil':{'orbitales','unidad-masa','composicion','masa-molar'},'dificil':{'pureza','dicromato-yodo','nitrogeno-alanina','combustion-etano','fraccion-masica'}}
}
assert easy_read.isdisjoint(mid_read)
passages={p['id']:p for p in b['passages']}
assert easy_read|mid_read <= passages.keys()
for p in b['passages']:
 p['difficulty']='facil' if p['id'] in easy_read else 'intermedio' if p['id'] in mid_read else 'dificil'
for q in b['questions']:
 if q['subject']=='lectura':
  level=passages[q['passageId']]['difficulty'];reason={'facil':'Texto de introducción con relaciones concretas o definiciones explícitas.','intermedio':'Texto que exige integrar definiciones, comparaciones y límites entre dos párrafos.','dificil':'Texto con relaciones científicas más abstractas, cadenas causales o límites que requieren una lectura detenida.'}[level]
 elif q.get('practiceKind')=='basica':level='facil';reason='Datos pequeños y una sola habilidad: conteo, conversión directa o fórmula indicada.'
 elif q['id'].startswith('abp-'):
  key=q['id'][4:];level='facil' if key in easy_original else 'dificil' if key in hard_original else 'intermedio'
  reason={'facil':'Reconocimiento de un concepto, conteo o cálculo directo.','intermedio':'Aplicación de una relación con uno o dos pasos previos.','dificil':'Varias transformaciones algebraicas, decisiones de modelo o conversiones encadenadas.'}[level]
 else:
  f=q['family'];rule=family_levels[q['subject']];level=next((key for key,values in rule.items() if f in values),'intermedio')
  reason={'facil':'Una relación directa o conteo, con datos accesibles.','intermedio':'Aplicación de fórmulas, signos, fracciones o conversiones antes del resultado.','dificil':'Varias relaciones o transformaciones encadenadas; requiere dominar los pasos previos.'}[level]
 q['difficulty']=level;q['difficultyReason']=reason

def spread(rows):
 groups=defaultdict(list)
 # New beginner items precede older items; each paper samples several skills.
 for q in rows:groups[('0' if q.get('practiceKind')=='basica' else '1')+q.get('family',q['topic'])].append(q)
 skills='contar union interseccion complemento media dato-faltante razon-directa multiplo potencia-diez division-simple centimetros segundos rapidez aceleracion fuerza peso onda carga voltaje energia elementos atomos-formula unidades-formula orbitales-basicos masa-molar-basica moles-a-masa masa-a-moles hgo-basico agua-basica mg-basico'.split()
 keys=sorted(groups,key=lambda key:(key[0],skills.index(key[1:]) if key[1:] in skills else 999,key));out=[]
 while any(groups.values()):
  for key in keys:
   if groups[key]:out.append(groups[key].pop(0))
 return out

papers=[];by_area={}
for subject in labels:
 for level in levels:
  rows=[q for q in b['questions'] if q['subject']==subject and q['difficulty']==level]
  if subject=='lectura':
   ps=[p for p in b['passages'] if p['difficulty']==level]
   ordered=[q for p in ps for q in rows if q['passageId']==p['id']]
  else:ordered=spread(rows)
  by_area[subject,level]=ordered
  for index,start in enumerate(range(0,len(ordered),10),1):
   chunk=ordered[start:start+10]
   description=(f'{len(chunk)//5} lectura'+('s completas' if len(chunk)>5 else ' completa')+' con preguntas sobre el texto.') if subject=='lectura' else {'facil':'Conceptos y ejercicios directos para empezar.','intermedio':'Aplica lo aprendido con fórmulas y conversiones.','dificil':'Problemas que combinan varios pasos.'}[level]
   papers.append(dict(id=f'nivel-{subject}-{level}-{index:02d}',title=f'Simulacro {index:02d}',subject=subject,difficulty=level,questionIds=[q['id'] for q in chunk],questionCount=len(chunk),minutes=max(5,math.ceil(len(chunk)*{'facil':2,'intermedio':2.5,'dificil':3}[level])),description=description,type='por-nivel',commented=True))

# Mixed papers reuse the same material for rehearsal; they are not additional questions.
for level in levels:
 count=min(len(by_area[s,level])//10 for s in labels)
 for index in range(count):
  rows=[q for s in labels for q in by_area[s,level][index*10:(index+1)*10]]
  papers.append(dict(id=f'nivel-completo-{level}-{index+1:02d}',title=f'Simulacro {index+1:02d}',subject='integral',difficulty=level,questionIds=[q['id'] for q in rows],questionCount=40,minutes={'facil':80,'intermedio':100,'dificil':120}[level],description='Diez preguntas de cada materia, todas del nivel elegido.',type='por-nivel',commented=True))

b['levelPapers']=papers;b['difficultyRevision']=1;b['contentRevision']=3
b['statistics'].update(questions=len(b['questions']),uniqueQuestionCount=len(b['questions']),perSubject=dict(Counter(q['subject'] for q in b['questions'])),beginnerPractice=180,levelSimulations=len(papers),perDifficulty={s:dict(Counter(q['difficulty'] for q in b['questions'] if q['subject']==s)) for s in labels})
b['statistics']['newPractice']=len(b['questions'])-122
b['statistics']['newABPStyleExercises']=688
b['statistics']['legacyPaperQuestions']=800
path.write_text(json.dumps(b,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
report={'revision':1,'date':'2026-10-30','criteria':{'facil':'Reconocimiento, conteo o una relación directa; se añaden 180 ejercicios de iniciación con cantidades sencillas.','intermedio':'Fórmulas y una o dos transformaciones, conversiones o comparaciones.','dificil':'Álgebra, modelos o conversiones encadenadas. En lectura, relaciones abstractas y científicas con matices.'},'notEmpiricallyCalibrated':True,'readingUnit':'Texto completo con sus cinco preguntas; dificultad estimada por complejidad conceptual del pasaje.','statistics':b['statistics'],'questions':[{'id':q['id'],'subject':q['subject'],'difficulty':q['difficulty'],'reason':q['difficultyReason']} for q in b['questions']],'bankBytes':path.stat().st_size}
(ROOT/'api/_sufficiency/difficulty-review.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
audit_path=ROOT/'api/_sufficiency/source-audit.json';audit=json.loads(audit_path.read_text(encoding='utf8'))
audit['counts']=b['statistics']['perSubject']
audit['progressivePractice']={'date':'2026-10-30','beginnerExercises':180,'families':30,'source':'Variantes básicas de los problemas ABP autorizados; cada una conserva página, ejercicio padre y datos de cálculo.','difficultyCriteria':report['criteria'],'statistics':b['statistics'],'independentCheck':'beginner-checks.json: datos usados por las pruebas independientes de las 180 claves.'}
audit_path.write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
review_path=ROOT/'api/_sufficiency/teaching-review.json';review=json.loads(review_path.read_text(encoding='utf8'))
if 'questionAndKeySha256' in review:review['original800QuestionAndKeySha256']=review.pop('questionAndKeySha256')
review.update(questions=len(b['questions']),areas=b['statistics']['perSubject'],beginnerLessons=180,stepCount=dict(sorted(Counter(len(q['solution']['steps']) for q in b['questions']).items())),bankBytes=path.stat().st_size)
review_path.write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Difficulty bank:',b['statistics']['perDifficulty'],'; papers:',len(papers),'; bytes:',path.stat().st_size)
