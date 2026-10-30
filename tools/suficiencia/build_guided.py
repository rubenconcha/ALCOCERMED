"""A gentler starting route through existing, sourced practice questions."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
path=ROOT/'api/_sufficiency/bank.json'
bank=json.loads(path.read_text(encoding='utf8'))
areas={
 'matematicas':['abp-36-64','abp-41-22','abp-18-42','abp-41-26','abp-36-65','abp-36-69','abp-10-33','practica-matematicas-promedio-01','practica-matematicas-razon-01','practica-matematicas-conjuntos-01'],
 'fisica':['abp-17-31','abp-17-32','abp-17-33','abp-05-14','abp-13-20','practica-fisica-ondas-01','abp-21-29','abp-21-30','abp-05-11','abp-34-27'],
 'quimica':['abp-16-24','abp-36-59','abp-35-53','abp-35-54','abp-35-45','abp-35-46','practica-quimica-composicion-01','practica-quimica-orbitales-01','abp-17-28','practica-quimica-masa-moleculas-01'],
 'lectura':[q['id'] for p in ['lectura-hipotesis','lectura-experimento'] for q in bank['questions'] if q.get('passageId')==p]
}
lookup={q['id']:q for q in bank['questions']}
for area,ids in areas.items():
 assert len(ids)==10,(area,ids)
 assert all(lookup[id]['subject']==area for id in ids),area
ids=[id for rows in areas.values() for id in rows]
assert len(set(ids))==40
bank['introPaper']={'id':'inicial','title':'Simulacro inicial','description':'Empieza con preguntas más sencillas. Puedes consultar la resolución mientras respondes.','subject':'integral','questionCount':40,'minutes':60,'questionIds':ids,'kind':'selección inicial de práctica existente'}
path.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
review_path=ROOT/'api/_sufficiency/teaching-review.json'
review=json.loads(review_path.read_text(encoding='utf8'))
review['bankBytes']=path.stat().st_size
review['introPractice']={'questions':40,'perArea':10,'newQuestions':0,'startsWith':'abp-36-64','wholeReadings':2}
review_path.write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Guided entry: 40 existing questions, 10 per area, two complete readings; original 60 papers unchanged.')
