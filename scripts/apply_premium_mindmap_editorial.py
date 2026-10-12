"""Apply reviewed paragraphs and specific introductory diagrams reproducibly."""
from pathlib import Path
import json
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
def main():
 ed=json.loads((ROOT/'api/_mindmaps/editorial.json').read_text(encoding='utf8'))
 for key,rows in ed.items():
  p=ROOT/'api/_mindmaps'/(key+'.json');d=json.loads(p.read_text(encoding='utf8'))
  headings={r[0] for r in rows}
  d['sections']=[s for s in d['sections'] if s['title'] not in headings|{'Desarrollo del subtema'}]
  if key == 'salud_19_frecuencias__04':
   for section in d['sections']:
    for group in section['groups']:
     group['items']=[item for item in group['items'] if not ('acumulad' in item.get('text','').lower() and 'cualitativ' in item.get('text','').lower() and 'aplica' in item.get('text','').lower())]
  for title,text,source in rows:
   d['sections'].append({'title':title,'groups':[{'title':title,'items':[{'title':'Explicación','text':text,'source':{'reference':source,'kind':'paraphrase'}}]}]})
  assert len(d['sections'])<=6
  p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf8')
 out=ROOT/'assets/mindmaps/premium-illustrations'
 im=Image.open(out/'biocel_01_introduccion__03.webp')
 im.crop((0,0,im.width,int(im.height*.405))).save(out/'biocel_01_introduccion__02.webp',quality=94)
 special=[('biocel_01_introduccion__02','webp','Organización de una bacteria; panel A de la figura 1-4 de Calvo.',None),
 ('biocel_01_introduccion__05','svg','Esquema de un viroide: ARN circular sin cápside.','<circle cx="180" cy="120" r="65" fill="none" stroke="#34a17a" stroke-width="12" stroke-dasharray="12 6"/><path d="M135 67 Q180 30 225 67 M118 100 Q155 120 125 149 M239 97 Q200 120 237 150" stroke="#207b70" stroke-width="8" fill="none"/><text x="180" y="221">ARN circular sin cápside</text>'),
 ('biocel_01_introduccion__06','svg','Esquema de cambio de conformación de una proteína priónica.','<path d="M30 90 C80 10 100 160 145 80 C180 5 195 140 220 78" stroke="#378dca" stroke-width="10" fill="none"/><path d="M270 60l55 80-55-30 55-20-55 60" stroke="#d85b72" stroke-width="10" fill="none"/><path d="M223 102h30m-12-10 12 10-12 10" stroke="#264761" stroke-width="5" fill="none"/><text x="110" y="206">PrP normal</text><text x="292" y="206">PrP alterada</text>')]
 ledger=json.loads((ROOT/'content/mindmaps-premium-illustrations.json').read_text(encoding='utf8'))
 for ident,ext,alt,svg in special:
  file=out/(ident+'.'+ext)
  if svg:
   file.write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 240"><rect width="360" height="240" rx="18" fill="#f4f9fd"/><g font-family="Arial,sans-serif" font-size="17" text-anchor="middle" fill="#264761">'+svg+'</g></svg>',encoding='utf8')
  image='/assets/mindmaps/premium-illustrations/'+file.name
  p=ROOT/'api/_mindmaps'/(ident+'.json');d=json.loads(p.read_text(encoding='utf8'))
  d['assets']['image']=image;d['assets']['alt']=alt;p.write_text(json.dumps(d,ensure_ascii=False,separators=(',',':')),encoding='utf8')
  ledger[ident]={'image':image,'alt':alt,'book':'bio','pdfPage':42 if ext=='webp' else 51 if ident.endswith('05') else 52,'kind':'source panel' if ext=='webp' else 'concept diagram'}
 (ROOT/'content/mindmaps-premium-illustrations.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding='utf8')
 print('Reviewed short-topic paragraphs and introductory diagrams applied.')
if __name__=='__main__':main()
