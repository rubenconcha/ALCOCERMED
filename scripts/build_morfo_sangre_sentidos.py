"""Build reviewed Saladin study packs, protected summaries and additive database imports."""
from pathlib import Path
from collections import Counter
from html import escape
import hashlib, json, re, unicodedata, uuid

ROOT=Path(__file__).resolve().parents[1]
SOURCE='Saladin, Anatomía y fisiología: la unidad entre forma y función'
TOPICS=[('sangre','Sangre','sangre',18,'SANG26'),('sentidos','Órganos de los sentidos','organos de los sentidos',16,'SENT26')]
def norm(s): return ''.join(c for c in unicodedata.normalize('NFD',s.casefold()) if not unicodedata.combining(c)).strip()
def dump(p,data): p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
def quote(s): return "'"+s.replace("'","''")+"'"
def parse(slug):
    sections=[]
    for line in (ROOT/'content'/f'morfo-{slug}-2026.txt').read_text(encoding='utf8').splitlines():
        if not line.strip():continue
        if line.startswith('## '):
            title,pages=map(str.strip,line[3:].split('|'));sections.append(dict(title=title,pages=pages,summary='',items=[]))
        elif ' | ' not in line: sections[-1]['summary']=line
        else:
            fields=[v.strip() for v in line.split(' | ')];assert len(fields)==6,(slug,line)
            q,correct,*tail=fields;distractors=tail[:3];why=tail[3];assert q.endswith('?') and len(set(map(norm,[correct,*distractors])))==4
            sections[-1]['items'].append(dict(question=q,correct=correct,distractors=distractors,explanation=why))
    assert len(sections)==10 and all(len(s['items'])==8 and s['summary'] for s in sections)
    return sections

def database_sql(topic,rows,sim,assessment,eval_id,code,title):
    payload=quote(json.dumps(rows,ensure_ascii=False,separators=(',',':')))
    simq=[dict(nombre=f'Práctica bibliográfica - Morfofunción - {title} (40 preguntas)',numero_pregunta=i+1,**{k.lower():v for k,v in r.items()}) for i,r in enumerate(sim)]
    for r in simq:r['justificacion']=r.pop('explicacion')
    questions=[]
    for i,r in enumerate(assessment):
        qid=str(uuid.uuid5(uuid.NAMESPACE_URL,f'alcocermed:morfo:20261014:{topic}:eval:{r["PREGUNTA"]}'))
        questions.append(dict(id=qid,evaluacion_id=eval_id,tipo='mc',texto=r['PREGUNTA'],opciones=[dict(text=r['OPCION_'+a],correct=a==r['RESPUESTA_CORRECTA'],color=['ac-blue','ac-pink','ac-yellow','ac-green'][j]) for j,a in enumerate('ABCD')],orden=i+1,puntos=1,temporizador=60))
    config=dict(maxQuestions=30,questionOrder=[q['id'] for q in questions],enabledPowerups=[])
    # No student records, policies, accounts or existing evaluations are changed.
    sql=f'''-- Morfofunción: {title}. Reejecutable; conserva material y progreso existentes.
BEGIN;
LOCK TABLE public.flashcards, public.banco_preguntas IN SHARE ROW EXCLUSIVE MODE;
CREATE TEMP TABLE morfo_incoming ON COMMIT DROP AS
SELECT * FROM jsonb_to_recordset({payload}::jsonb) AS p("MATERIA" text,"TEMA" text,"PREGUNTA" text,"OPCION_A" text,"OPCION_B" text,"OPCION_C" text,"OPCION_D" text,"RESPUESTA_CORRECTA" text,"EXPLICACION" text,"DIFICULTAD" text,"FUENTE" text,"PAGINAS_PDF" text);
WITH missing AS (SELECT p.* FROM morfo_incoming p WHERE NOT EXISTS (SELECT 1 FROM public.flashcards f WHERE lower(btrim(f.materia))=lower(btrim(p."MATERIA")) AND lower(btrim(f.tema))=lower(btrim(p."TEMA")) AND lower(btrim(f.pregunta))=lower(btrim(p."PREGUNTA")))), numbered AS (SELECT (SELECT coalesce(max(id),0) FROM public.flashcards)+row_number() over(order by "PREGUNTA") id,m.* FROM missing m)
INSERT INTO public.flashcards(id,materia,tema,pregunta,respuesta) SELECT id,"MATERIA","TEMA","PREGUNTA",CASE "RESPUESTA_CORRECTA" WHEN 'A' THEN "OPCION_A" WHEN 'B' THEN "OPCION_B" WHEN 'C' THEN "OPCION_C" ELSE "OPCION_D" END||'. '||"EXPLICACION" FROM numbered;
WITH missing AS (SELECT p.* FROM morfo_incoming p WHERE NOT EXISTS(SELECT 1 FROM public.banco_preguntas b WHERE lower(btrim(b."MATERIA"))=lower(btrim(p."MATERIA")) AND lower(btrim(b."TEMA"))=lower(btrim(p."TEMA")) AND lower(btrim(b."PREGUNTA"))=lower(btrim(p."PREGUNTA")))), numbered AS (SELECT (SELECT coalesce(max(id),0) FROM public.banco_preguntas)+row_number() over(order by "PREGUNTA") id,m.* FROM missing m)
INSERT INTO public.banco_preguntas(id,"MATERIA","TEMA","PREGUNTA","OPCION_A","OPCION_B","OPCION_C","OPCION_D","RESPUESTA_CORRECTA","EXPLICACION","DIFICULTAD","FUENTE","PAGINAS_PDF") SELECT id,"MATERIA","TEMA","PREGUNTA","OPCION_A","OPCION_B","OPCION_C","OPCION_D","RESPUESTA_CORRECTA","EXPLICACION","DIFICULTAD","FUENTE","PAGINAS_PDF" FROM numbered;
INSERT INTO public.simulacros(nombre,materia,tema,numero_pregunta,pregunta,opcion_a,opcion_b,opcion_c,opcion_d,respuesta_correcta,justificacion,dificultad,fuente,paginas_pdf)
SELECT p.nombre,p.materia,p.tema,p.numero_pregunta,p.pregunta,p.opcion_a,p.opcion_b,p.opcion_c,p.opcion_d,p.respuesta_correcta,p.justificacion,p.dificultad,p.fuente,p.paginas_pdf FROM jsonb_to_recordset({quote(json.dumps(simq,ensure_ascii=False,separators=(',',':')))}::jsonb) AS p(nombre text,materia text,tema text,numero_pregunta int,pregunta text,opcion_a text,opcion_b text,opcion_c text,opcion_d text,respuesta_correcta text,justificacion text,dificultad text,fuente text,paginas_pdf text) WHERE NOT EXISTS(SELECT 1 FROM public.simulacros s WHERE s.nombre=p.nombre AND s.numero_pregunta=p.numero_pregunta);
INSERT INTO public.evaluaciones(id,titulo,asignatura,tema,nivel,idioma,visibilidad,objetivo,codigo,publicado,iniciado,modo_sesion,config_juego)
VALUES({quote(eval_id)}::uuid,{quote('Evaluación de Morfofunción - '+title+' (30 preguntas)')},'MORFOFUNCION',{quote(topic)},'Repaso integral','Español','publica',{quote('Comprobar los diez bloques del capítulo con 30 preguntas equilibradas. Fuente: '+SOURCE)},'{code}',true,true,'individual',{quote(json.dumps(config))}::jsonb) ON CONFLICT(id) DO NOTHING;
INSERT INTO public.evaluacion_preguntas(id,evaluacion_id,tipo,texto,opciones,orden,puntos,temporizador)
SELECT p.id,p.evaluacion_id,p.tipo,p.texto,p.opciones,p.orden,p.puntos,p.temporizador FROM jsonb_to_recordset({quote(json.dumps(questions,ensure_ascii=False,separators=(',',':')))}::jsonb) AS p(id uuid,evaluacion_id uuid,tipo text,texto text,opciones jsonb,orden int,puntos int,temporizador int) ON CONFLICT(id) DO NOTHING;
COMMIT;
SELECT 'flashcards' recurso,count(*) cantidad FROM public.flashcards WHERE materia='MORFOFUNCION' AND tema={quote(topic)} UNION ALL SELECT 'banco',count(*) FROM public.banco_preguntas WHERE "MATERIA"='MORFOFUNCION' AND "TEMA"={quote(topic)} UNION ALL SELECT 'simulacro',count(*) FROM public.simulacros WHERE nombre={quote(simq[0]['nombre'])} UNION ALL SELECT 'evaluacion',count(*) FROM public.evaluacion_preguntas WHERE evaluacion_id={quote(eval_id)}::uuid;
'''
    return sql,questions,simq

def pdf_summary(slug,title,chapter,sections):
    from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,PageBreak,Table,TableStyle,KeepTogether
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_LEFT
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.pagesizes import A4
    from pypdf import PdfReader
    import fitz
    pdfmetrics.registerFont(TTFont('Course','C:/Windows/Fonts/arial.ttf'));pdfmetrics.registerFont(TTFont('CourseBold','C:/Windows/Fonts/arialbd.ttf'))
    pdfmetrics.registerFontFamily('Course',normal='Course',bold='CourseBold',italic='Course',boldItalic='CourseBold')
    navy='#18263f';accent='#b34350' if slug=='sangre' else '#177c9f';width,height=A4
    styles={
      'title':ParagraphStyle('title',fontName='CourseBold',fontSize=23,leading=28,textColor=colors.HexColor(navy),spaceAfter=15),
      'body':ParagraphStyle('body',fontName='Course',fontSize=10,leading=15,textColor=colors.HexColor('#344258'),spaceAfter=12),
      'key':ParagraphStyle('key',fontName='Course',fontSize=9.3,leading=13.4,textColor=colors.HexColor('#344258'),spaceAfter=8),
      'small':ParagraphStyle('small',fontName='Course',fontSize=8,leading=11.5,textColor=colors.HexColor('#60718a')),
      'label':ParagraphStyle('label',fontName='CourseBold',fontSize=10.2,leading=15,textColor=colors.HexColor(accent),spaceBefore=12,spaceAfter=10)}
    target=ROOT/'api'/'_pdf'/f'morfofuncion-{slug}.pdf';target.parent.mkdir(parents=True,exist_ok=True)
    def frame(c,doc):
      c.setFillColor(colors.HexColor(navy));c.rect(0,height-58,width,58,fill=1,stroke=0)
      c.setFillColor(colors.white);c.setFont('CourseBold',12);c.drawString(40,height-28,'PREPARATORIA BEN CARSON')
      c.setFont('Course',8);c.drawString(40,height-43,f'MORFOFUNCIÓN  /  {title.upper()}  /  SALADIN - CAPÍTULO {chapter}')
      c.setFillColor(colors.HexColor(accent));c.rect(0,height-62,width,4,fill=1,stroke=0)
      c.setStrokeColor(colors.HexColor('#dce5ee'));c.line(40,46,width-40,46);c.setFillColor(colors.HexColor('#60718a'));c.setFont('Course',7)
      c.drawString(40,31,'Síntesis original para estudio. Consulta el texto base para ampliar cada apartado.');c.drawRightString(width-40,31,f'{doc.page} / 10')
    story=[]
    for i,section in enumerate(sections):
      first,last=map(int,section['pages'].split('-'));printed=f'{first-28}-{last-28}'
      story.append(Paragraph(f'BLOQUE {i+1:02d} / 10',styles['label']))
      story.append(Paragraph(escape(section['title']),styles['title']))
      story.append(Paragraph(escape(section['summary']),styles['body']))
      story.append(Paragraph('CONCEPTOS ESENCIALES',styles['label']))
      for n,item in enumerate(section['items']):
        text=f'<b>{escape(item["correct"])}.</b> {escape(item["explanation"])}'
        table=Table([[Paragraph(f'{n+1:02d}',styles['small']),Paragraph(text,styles['key'])]],colWidths=[25,width-105])
        table.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),4),('BACKGROUND',(0,0),(-1,-1),colors.HexColor('#f4f7fa' if n%2==0 else '#ffffff'))]))
        story.append(table)
      story.append(Spacer(1,12));story.append(Paragraph(f'<b>Fuente de este bloque:</b> Saladin, capítulo {chapter}. Páginas del libro {printed}; páginas del PDF {section["pages"]}.',styles['small']))
      if i<9:story.append(PageBreak())
    SimpleDocTemplate(str(target),pagesize=A4,rightMargin=40,leftMargin=40,topMargin=80,bottomMargin=60,title=f'{title} - Resumen de Morfofunción',author='Preparatoria Ben Carson').build(story,onFirstPage=frame,onLaterPages=frame)
    assert len(PdfReader(target).pages)==10,f'Pagination overflow: {target}'
    preview=ROOT/'assets'/'resumenes-portadas'/f'morfofuncion-{slug}.png';preview.parent.mkdir(parents=True,exist_ok=True)
    doc=fitz.open(target);doc[0].get_pixmap(matrix=fitz.Matrix(1,1)).save(preview)
    qa=ROOT/'output'/'morfo-sangre-sentidos'/'pdf-qa';qa.mkdir(parents=True,exist_ok=True)
    for i,page in enumerate(doc):page.get_pixmap(matrix=fitz.Matrix(1.1,1.1)).save(qa/f'{slug}-{i+1:02d}.png')
    copy=ROOT/'output'/'pdf'/target.name;copy.parent.mkdir(parents=True,exist_ok=True);copy.write_bytes(target.read_bytes())

def main():
    bank=[];packs=[];fc=json.loads((ROOT/'content'/'flashcards_morfo_2026.json').read_text(encoding='utf8'))
    for slug,title,topic,chapter,code in TOPICS:
      sections=parse(slug);rows=[];sim=[];assessment=[]
      for si,section in enumerate(sections):
        for qi,item in enumerate(section['items']):
          options=item['distractors'].copy();correct_index=(si+qi)%4;options.insert(correct_index,item['correct'])
          row=dict(MATERIA='MORFOFUNCION',TEMA=topic,PREGUNTA=item['question'],**{'OPCION_'+a:options[j] for j,a in enumerate('ABCD')},RESPUESTA_CORRECTA='ABCD'[correct_index],EXPLICACION=item['explanation'],DIFICULTAD='medio' if qi>3 else 'facil',FUENTE=SOURCE+f', capítulo {chapter}',PAGINAS_PDF=section['pages'])
          rows.append(row)
          if qi<4:sim.append(row)
          elif qi<7:assessment.append(row)
      assert len(rows)==80 and len(sim)==40 and len(assessment)==30 and len(set(r['PREGUNTA'] for r in rows))==80
      assert set(r['PREGUNTA'] for r in sim).isdisjoint(r['PREGUNTA'] for r in assessment)
      eval_id=str(uuid.uuid5(uuid.NAMESPACE_URL,f'alcocermed:morfo:20261014:{topic}:evaluation'))
      sql,questions,simq=database_sql(topic,rows,sim,assessment,eval_id,code,title)
      (ROOT/f'SQL_MORFO_{slug.upper()}_COMPLETO_2026.sql').write_text(sql,encoding='utf8')
      pack=dict(slug=slug,title=title,topic=topic,chapter=chapter,sections=sections,questions=rows,simulacro=simq,evaluation=dict(id=eval_id,code=code,questions=questions),summary=f'morfofuncion-{slug}')
      packs.append(pack);bank.extend(rows)
      group=next(g for g in fc['groups'] if g['tema']==topic);seen={norm(q) for q,a in group['cards']}
      for section in sections:
        for item in section['items']:
          if norm(item['question']) not in seen:group['cards'].append([item['question'],item['correct']+'. '+item['explanation']]);seen.add(norm(item['question']))
      pdf_summary(slug,title,chapter,sections)
    dump(ROOT/'content'/'morfo_sangre_sentidos_2026.json',dict(version='2026-10-14',packs=packs))
    dump(ROOT/'content'/'flashcards_morfo_2026.json',fc)
    original=json.loads((ROOT/'content'/'banco_bibliografia_2026.json').read_text(encoding='utf8'))
    keys={(norm(r['MATERIA']),norm(r['PREGUNTA'])) for r in bank}
    original=[r for r in original if (norm(r['MATERIA']),norm(r['PREGUNTA'])) not in keys]+bank
    dump(ROOT/'content'/'banco_bibliografia_2026.json',original)
    manifest=[dict(tema=p['topic'],flashcards_nuevas=80,preguntas_nuevas=80,resumen_paginas=10,simulacro_preguntas=40,evaluacion_preguntas=30,codigo=p['evaluation']['code'],evaluacion_id=p['evaluation']['id']) for p in packs]
    dump(ROOT/'output'/'morfo-sangre-sentidos'/'manifest.json',manifest)
    print(json.dumps(manifest,ensure_ascii=False,indent=2))

if __name__=='__main__':main()
