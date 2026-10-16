"""Select illustrations near the relevant book paragraphs, with figure provenance."""
from pathlib import Path
import json,re,unicodedata
import pymupdf
ROOT=Path(__file__).resolve().parents[1]
BOOKS={
 'morfo':'C:/Users/PC/Downloads/morfofisiliologia-saladin-anatomia-y-fisiologia (1) (3).pdf',
 'bio':'C:/Users/PC/Downloads/Biologia_Celular_Biomedica_St_Alfonso_Ca (1).pdf'}
def words(text):
 text=''.join(c for c in unicodedata.normalize('NFD',text.lower()) if not unicodedata.combining(c))
 return {w[:6] for w in re.findall(r'[a-z]{4,}',text) if w not in {'estructura','funciones','organizacion','funcion','forma','general','celular','celulas','sistema','figura'}}
def main():
 catalog=json.loads((ROOT/'content/mindmaps-premium-catalog.json').read_text(encoding='utf8'))
 docs={b:pymupdf.open(p) for b,p in BOOKS.items()};cache={};ledger={};out=ROOT/'assets/mindmaps/premium-illustrations';out.mkdir(exist_ok=True)
 for entry in catalog:
  if entry.get('format')=='interactive-mind-map' and entry.get('content_revision',0)>=2:continue
  ident=entry['id'];p=ROOT/'api/_mindmaps'/f'{ident}.json';data=json.loads(p.read_text(encoding='utf8'))
  book='morfo' if ident.startswith('morfo') else 'salud' if ident.startswith('salud') else 'bio'
  if book not in docs:continue
  paragraphs=[i for s in data['sections'] for g in s['groups'] for i in g['items'] if i.get('source')]
  pages={i['source']['pdfPage'] for i in paragraphs if 'pdfPage' in i['source']};lo,hi=data['assets']['source']['pdfPages']
  candidates=[];query=words(entry['titulo'])
  for page_no in sorted({n+d for n in pages for d in [-1,0,1] if lo<=n+d<=hi}):
   key=(book,page_no)
   if key not in cache:
    page=docs[book][page_no-1];blocks=page.get_text('blocks');figures=[]
    captions=[b for b in blocks if re.match(r'\s*(FIGURA|Figura)\s+\d',b[4])]
    for image in page.get_images(full=True):
     for rect in page.get_image_rects(image[0]):
      if rect.width<100 or rect.height<60 or rect.width*rect.height<14000:continue
      cap=min(captions,key=lambda c:abs(c[1]-rect.y1)) if captions else None
      if not cap:continue
      figures.append({'page':page_no,'bbox':list(rect),'caption':cap[4]})
    cache[key]=figures
   for fig in cache[key]:
    score=len(query&words(fig['caption']))
    if not score:continue
    score=score*10+ (2 if page_no in pages else 0)
    candidates.append((score,fig))
  if not candidates:continue
  _,fig=max(candidates,key=lambda n:n[0]);page=docs[book][fig['page']-1]
  rect=pymupdf.Rect(fig['bbox']);pix=page.get_pixmap(matrix=pymupdf.Matrix(min(2.2,900/rect.width),min(2.2,900/rect.width)),clip=rect,alpha=False)
  from PIL import Image
  image=Image.frombytes('RGB',(pix.width,pix.height),pix.samples);file=out/(ident+'.webp');image.save(file,quality=92,method=4)
  data['assets']['image']='/assets/mindmaps/premium-illustrations/'+file.name
  data['assets']['alt']=re.sub(r'\s+',' ',fig['caption']).strip()
  p.write_text(json.dumps(data,ensure_ascii=False,separators=(',',':')),encoding='utf8')
  ledger[ident]={'image':data['assets']['image'],'alt':data['assets']['alt'],'book':book,'pdfPage':fig['page'],'bbox':fig['bbox']}
 (ROOT/'content/mindmaps-premium-illustrations.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2),encoding='utf8')
 print(json.dumps({'specificBookFigures':len(ledger)}))
if __name__=='__main__':main()
