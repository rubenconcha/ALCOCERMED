"""Build one dedicated, source-expanded map for each of the six topic branches.

The book paragraphs are transcribed from the user-supplied PDFs, not generated
from an unrelated question bank. Only complete sentences and relevant matches
are accepted; page/block provenance stays with every explanation.
"""
from pathlib import Path
import json, re, math, unicodedata
from collections import Counter
import pymupdf

ROOT=Path(__file__).resolve().parents[1]
BOOKS={
 'morfo':Path('C:/Users/PC/Downloads/morfofisiliologia-saladin-anatomia-y-fisiologia (1) (3).pdf'),
 'bio':Path('C:/Users/PC/Downloads/Biologia_Celular_Biomedica_St_Alfonso_Ca (1).pdf'),
 'salud':Path('C:/Users/PC/Downloads/EDUCACION EN SALUD E INVESTIGACION CB24-25 (1).pdf')}
STOP=set('para como este esta estos estas desde entre sobre tiene tienen puede pueden donde porque cuando mediante permite permiten forma parte partes ser son los las del una uno unos unas que con por sus sin más cual cada mismo misma hace texto capítulo figura tabla relación funciones proceso concepto idea definición características importancia funcionamiento general estructura organización célula celular humano humana salud estudiar'.split())

def norm(s):
 return ''.join(c for c in unicodedata.normalize('NFD',s.lower()) if not unicodedata.combining(c))
STOP={norm(w) for w in STOP}
def tokens(s):
 return [(w[:-1] if len(w)>5 and w.endswith('s') else w)[:6] for w in re.findall(r'[a-z]{3,}',norm(s)) if w not in STOP]
def clean(s):
 s=re.sub(r'(\w)-\s*\n\s*(\w)',r'\1\2',s)
 s=re.sub(r'(fi|fl) (?=[a-záéíóúñ])',r'\1',s)
 s=re.sub(r'\s+',' ',s).strip()
 s=re.sub(r'\b([A-Za-záéíóúñ]{6,})\d{1,2}\b',r'\1',s)
 s=re.sub(r'\s+[¹²³⁴⁵⁶⁷⁸⁹⁰]+\b','',s)
 return s
def chunks(raw):
 s=clean(raw)
 if re.match(r'^(FIGURA|CUADRO|CAPÍTULO|GUÍA|ESQUEMA|CONOCIMIENTO|REPASO|CURSO BASICO|Facultad de|Universidad Mayor|UNIVERSIDAD|ANTES DE|APLIQUE|PREGUNTAS|OBJETIVOS|RESULTADOS|BIBLIOGRAF)',s):return []
 s=re.sub(r'^[▪•\-]\s*','',s)
 if len(s)<75 or len(s)>9000 or re.search(r'https?://|www\.|ISBN',s):return []
 # Remove running page numbers; do not turn tables, formulas or captions into prose.
 s=re.sub(r'^\d{1,4}\s+','',s)
 if len(re.findall(r'\b\d+(?:[.,]\d+)?\b',s))>len(s.split())*.13:return []
 sentences=re.split(r'(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡])',s)
 out=[];acc=[]
 for sentence in sentences:
  if not re.match(r'^[A-ZÁÉÍÓÚÑ¿¡]',sentence) or not re.search(r'[.!?]$',sentence):continue
  if len(sentence)<20 or len(sentence)>1100:continue
  if len(' '.join(acc+[sentence]))>950 and acc:
   if len(' '.join(acc))>=75:out.append(' '.join(acc))
   acc=[]
  acc.append(sentence)
  if len(' '.join(acc))>=380:
   out.append(' '.join(acc));acc=[]
 if acc and len(' '.join(acc))>=75:out.append(' '.join(acc))
 return out

def prose_blocks(page, book):
 blocks=page.get_text('blocks')
 if book=='morfo':return blocks
 # These two PDFs split prose into individual lines. Reassemble a sentence
 # before filtering, using coordinates to exclude running headers and footers.
 result=[];acc=[];bbox=None
 for block in blocks:
  text=block[4].strip()
  if not text or (book=='salud' and (block[1]<80 or block[1]>page.rect.height-85)) or (book=='bio' and block[1]<35):continue
  heading=len(text)<65 and not re.search(r'[.!?]$',text) and not re.match(r'^[a-záéíóúñ(]',text)
  if heading or text.startswith(('FIGURA','Tabla ','CUADRO')):
   acc=[];bbox=None;continue
  if text.startswith(('▪','•')) and acc:acc=[];bbox=None
  acc.append(text)
  bbox=list(block[:4]) if bbox is None else [min(bbox[0],block[0]),min(bbox[1],block[1]),max(bbox[2],block[2]),max(bbox[3],block[3])]
  if re.search(r'[.!?]$',text):
   result.append((*bbox,'\n'.join(acc)));acc=[];bbox=None
 return result

def main():
 catalog=json.loads((ROOT/'content/mindmaps-catalog.json').read_text(encoding='utf8'))
 sources=json.loads((ROOT/'content/mindmaps-sources.json').read_text(encoding='utf8'))
 raw=(ROOT/'mindmap-detailed-content.js').read_text(encoding='utf8')
 base=json.JSONDecoder().raw_decode(raw.split('window.MINDMAP_DETAILED_CONTENT =',1)[1].lstrip())[0]
 docs={b:pymupdf.open(p) for b,p in BOOKS.items()}
 cache={};metadata=[];review=[]
 dest=ROOT/'api/_mindmaps';dest.mkdir(exist_ok=True)
 for topic in catalog:
  key=topic['key'];asset=sources[key];book='morfo' if key.startswith('morfo') else 'salud' if key.startswith('salud') else 'bio'
  start,end=asset['source']['pdfPages']
  if key.startswith('salud_04'):end=9
  cid=(book,start,end)
  if cid not in cache:
   corpus=[];seen=set()
   for page_no in range(start,end+1):
    for block in prose_blocks(docs[book][page_no-1],book):
     for paragraph in chunks(block[4]):
      if paragraph in seen:continue
      seen.add(paragraph);corpus.append({'text':paragraph,'page':page_no,'bbox':[round(float(n),2) for n in block[:4]],'words':Counter(tokens(paragraph))})
   df=Counter(w for p in corpus for w in p['words']);idf={w:math.log(1+len(corpus)/(1+n)) for w,n in df.items()}
   cache[cid]=(corpus,idf)
  corpus,idf=cache[cid]
  for branch_no,branch in enumerate(base[key],1):
   ident=Path(key).stem+'__'+str(branch_no).zfill(2)
   items=[item for group in branch['groups'] for item in group['items']]
   # Some concepts occur in both foundation and explanation; keep one clear branch.
   unique=[];seen=set()
   for item in items:
    if norm(item['title']) not in seen:unique.append(item);seen.add(norm(item['title']))
   context=Counter(tokens(branch['title']))
   anchors=[]
   toc=docs[book].get_toc()
   for ti,(level,heading,page_no) in enumerate(toc):
    if not start<=page_no<=end:continue
    overlap=set(tokens(heading))&set(context)
    if not overlap:continue
    score=sum(idf.get(w,0)+1 for w in overlap)
    last=end
    for next_level,_,next_page in toc[ti+1:]:
     if next_level<=level and next_page>page_no:
      last=min(end,next_page);break
    anchors.append((score,len(overlap),page_no,last,heading))
   anchors.sort(reverse=True)
   anchor=anchors[0] if anchors and anchors[0][0]>=3 and anchors[0][1]>=min(2,len(context)) else None
   branch_corpus=[p for p in corpus if not anchor or anchor[2]<=p['page']<=anchor[3]]
   # Prevent adjacent, different categories (e.g. tertiary prevention or a virus)
   # from being attached to a primary-prevention or prokaryote explanation.
   required=[]
   for word in ['primaria','secundaria','terciaria','cuaternaria','eucariotas','procariotas','bacterias','viroides','priones','simpática','parasimpática']:
    if re.search(r'\b'+re.escape(norm(word))+r'\b',norm(branch['title'])):required=tokens(word);break
   if required:branch_corpus=[p for p in branch_corpus if set(required)&set(p['words'])]
   sections=[];used=set();matches=[]
   for index,item in enumerate(unique):
    query=Counter(tokens(item['title']+' '+item['text']))
    title_words=set(tokens(item['title']))
    ranked=[]
    for p in branch_corpus:
     overlap=set(query)&set(p['words'])
     if title_words and not (title_words & overlap):continue
     if len(overlap)<2 and not (title_words & overlap):continue
     score=sum(idf.get(w,0)*(2 if w in title_words else 1)*min(p['words'][w],2) for w in overlap)
     score+=2.5*sum(idf.get(w,0)+1 for w in set(context)&set(p['words']))
     if p['text'] in used:score*=.25
     ranked.append((score,len(overlap),p))
    ranked.sort(key=lambda x:x[0],reverse=True)
    selected=ranked[0] if ranked else None
    concept_items=[{'title':'Idea principal','text':item['text']}]
    if selected and selected[0]>=3.0 and selected[2]['text'] not in used:
     score,overlap,p=selected;used.add(p['text'])
     concept_items.append({'title':'Desarrollo','text':p['text'],'source':{'book':asset['source']['book'],'pdfPage':p['page'],'bbox':p['bbox']}})
     matches.append({'concept':item['title'],'page':p['page'],'score':round(score,2),'overlap':overlap,'text':p['text']})
    sections.append({'title':item['title'],'color':branch['color'],'groups':[{'title':item['title']+' · explicación','items':concept_items}]})
   # A relevant book paragraph can develop the entire subtitle without being
   # falsely attached to a more specific definition that it does not explain.
   if len(matches)<2:
    broad=Counter(tokens(branch['title']+' '+' '.join(x['text'] for x in unique)))
    additional=[]
    for p in branch_corpus:
     if p['text'] in used:continue
     overlap=set(broad)&set(p['words'])
     if len(overlap)<2:continue
     score=sum(idf.get(w,0)+1 for w in overlap)+3*sum(idf.get(w,0)+1 for w in set(context)&set(p['words']))
     additional.append((score,p))
    additional.sort(key=lambda x:x[0],reverse=True)
    explanations=[]
    for score,p in additional[:max(0,2-len(matches))]:
     used.add(p['text']);explanations.append({'title':'Explicación del subtema','text':p['text'],'source':{'book':asset['source']['book'],'pdfPage':p['page'],'bbox':p['bbox']}})
     matches.append({'concept':branch['title'],'page':p['page'],'score':round(score,2),'overlap':len(set(broad)&set(p['words'])),'text':p['text']})
    if explanations:sections.append({'title':'Desarrollo del subtema','color':branch['color'],'groups':[{'title':branch['title'],'items':explanations}]})
   # Six branches maximum keeps the original viewer shortcuts and balanced columns.
   if len(sections)>6:
    grouped=[sections[i::6] for i in range(6)]
    sections=[{'title':g[0]['title'],'color':branch['color'],'groups':[x for section in g for x in section['groups']]} for g in grouped]
   title=branch['title']
   image=asset['image']
   payload={'id':ident,'title':title,'topic':topic['title'],'sections':sections,'assets':{'image':image,'alt':asset['alt'],'download':'/api/mindmap?id='+ident+'&format=image','filename':ident+'-Prepa-Ben-Carson.webp','source':asset['source']}}
   illustration_file=ROOT/'content/mindmaps-premium-illustrations.json'
   if illustration_file.exists():
    image_ledger=json.loads(illustration_file.read_text(encoding='utf8'))
    if ident in image_ledger:
     payload['assets']['image']=image_ledger[ident]['image'];payload['assets']['alt']=image_ledger[ident]['alt']
   (dest/(ident+'.json')).write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf8')
   metadata.append({'id':ident,'titulo':title,'root_title':title+' · '+topic['title'],'materia':topic['subject'],'tema':topic['title'],'parent_key':key,'url_imagen':'premium/'+ident+'.json','descripcion':topic['title'],'premium':True,'acceso_gratis':False,'preview':'/assets/mindmaps/premium-previews/'+ident+'.webp'})
   review.append({'id':ident,'topic':topic['title'],'subtitle':title,'paragraphs':len(matches),'concepts':len(unique),'sourceMatches':matches})
 print(json.dumps({'maps':len(metadata),'topics':len(catalog),'paragraphs':sum(x['paragraphs'] for x in review),'missingParagraphs':[x['id'] for x in review if x['paragraphs']<2]}))
 assert len(metadata)==79*6
 # Preserve individually authored additions instead of limiting a topic to six maps.
 curated_file=ROOT/'content/mindmaps-curated-additions.json'
 if curated_file.exists():
  known={m['id'] for m in metadata}
  metadata.extend(m for m in json.loads(curated_file.read_text(encoding='utf8')) if m['id'] not in known)
 (ROOT/'mindmap-premium-catalog.js').write_text('/* Public titles and previews only; explanations are subscription protected. */\nwindow.MINDMAP_PREMIUM_CATALOG = '+json.dumps(metadata,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf8')
 (ROOT/'content/mindmaps-premium-catalog.json').write_text(json.dumps(metadata,ensure_ascii=False,indent=2),encoding='utf8')
 (ROOT/'output/mapas-qa/premium-source-review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2),encoding='utf8')

if __name__=='__main__':
 main()
 if (ROOT/'api/_mindmaps/editorial.json').exists():
  from apply_premium_mindmap_editorial import main as apply_reviewed
  apply_reviewed()
