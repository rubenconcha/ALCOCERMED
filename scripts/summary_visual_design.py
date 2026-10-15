"""Branded, illustrated Saladin summary pages with searchable, authored text."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]
NAVY = '#18263f'
TEXT = '#344258'
MUTED = '#60718a'
LOGO = ROOT / 'promo-ben-carson-tiktok/public/authentic/logo.png'
CONNECTIONS = {
 'sangre': [
  ('Transportar','Regular','Proteger'),('Agua y solutos','Proteínas plasmáticas','Equilibrio de líquidos'),
  ('Menor oxigenación','Eritropoyetina renal','Producción medular'),('Forma bicóncava','Hemoglobina','Transporte de gases'),
  ('Eritrocito envejecido','Retiro por macrófagos','Reciclaje del hierro'),('Antígenos de membrana','Reconocimiento','Respuesta inmunitaria'),
  ('Reclutamiento','Diapédesis','Defensa tisular'),('Adhesión plaquetaria','Activación','Agregación'),
  ('Trombina','Fibrina','Coágulo estable'),('Reparación tisular','Plasmina','Degradación de fibrina')],
 'sentidos': [
  ('Estímulo','Transducción','Codificación'),('Contacto o estiramiento','Receptor','Información sensitiva'),
  ('Estímulo nocivo','Transmisión','Modulación del dolor'),('Sustancia disuelta','Célula gustativa','Señal aferente'),
  ('Molécula odorante','Receptor olfatorio','Bulbo olfatorio'),('Captación externa','Transmisión media','Transducción interna'),
  ('Vibración','Células ciliadas','Señal coclear'),('Movimiento','Receptores vestibulares','Información de equilibrio'),
  ('Refracción','Acomodación','Imagen retiniana'),('Fotorreceptor','Circuito retiniano','Vía visual')]
}

FIGURES = {
 'sangre': [
  (0, 'Un tejido que circula', 'Plasma, eritrocitos, leucocitos y plaquetas integran la sangre.'),
  (1, 'Separación de los componentes', 'Plasma arriba, capa leucoplaquetaria intermedia y eritrocitos abajo. Proporciones orientativas.'),
  (3, 'La producción comienza en la médula', 'La médula ósea roja produce células sanguíneas. El riñón participa en el control mediante eritropoyetina.'),
  (2, 'Forma y función del eritrocito', 'La forma bicóncava aumenta la superficie de intercambio; la hemoglobina transporta gases.'),
  (4, 'Reciclaje de componentes', 'Macrófagos del bazo y del hígado participan en el retiro de eritrocitos envejecidos y la recuperación de hierro.'),
  (9, 'Reconocimiento de antígenos', 'Las formas de superficie representan antígenos. Esquema conceptual: no es una tabla de compatibilidad transfusional.'),
  (5, 'Diversidad de leucocitos', 'Arriba: neutrófilo, eosinófilo y basófilo. Abajo: monocito y linfocito. Tamaños no comparativos.'),
  (7, 'De la lesión al tapón', 'Las plaquetas se adhieren y agregan en la lesión. La malla de fibrina corresponde a la estabilización posterior.'),
  (8, 'Estabilizar el coágulo', 'La cascada genera trombina; esta convierte fibrinógeno en fibrina. La figura resume el proceso, sin representar cada factor.'),
  (8, 'Retirar la malla al reparar', 'La plasmina degrada fibrina durante la fibrinólisis; el equilibrio evita tanto hemorragia como trombosis.')],
 'sentidos': [
  (0, 'Del estímulo a la señal nerviosa', 'El receptor transforma energía del estímulo en una respuesta eléctrica que llega al sistema nervioso.'),
  (1, 'Detectar contacto y posición', 'Receptores cutáneos y propioceptores aportan información sobre el entorno y el estado corporal.'),
  (2, 'Vías que transmiten y modulan', 'La nocicepción asciende hacia el encéfalo y puede modularse mediante circuitos descendentes. Trayecto simplificado.'),
  (3, 'Un botón gustativo en detalle', 'Las células receptoras contactan sustancias disueltas por el poro gustativo y se comunican con fibras sensitivas.'),
  (4, 'Del epitelio al bulbo olfatorio', 'Las fibras de los receptores atraviesan la lámina cribosa y alcanzan el bulbo olfatorio.'),
  (5, 'Tres regiones, una secuencia', 'Oído externo: captar. Oído medio: transmitir. Oído interno: transformar vibración y detectar movimiento.'),
  (6, 'La vibración mueve las células ciliadas', 'El órgano de Corti descansa sobre la membrana basilar. La deflexión de estereocilios participa en la transducción.'),
  (7, 'Rotación y aceleración', 'Los conductos semicirculares detectan aceleración angular; las máculas, aceleración lineal e inclinación.'),
  (8, 'Enfocar sobre la retina', 'Córnea y cristalino refractan la luz. La acomodación modifica la curvatura del cristalino.'),
  (9, 'De la luz a la información visual', 'Fotorreceptores, células bipolares y ganglionares participan en la señal retiniana. Las flechas son conceptuales.')]
}

def pdf_summary(slug, title, chapter, sections):
    import fitz
    from reportlab.pdfgen.canvas import Canvas
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.colors import HexColor, white
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.platypus import Paragraph
    from reportlab.lib.utils import ImageReader
    from pypdf import PdfReader
    for name, font in [('Course', 'arial.ttf'), ('CourseBold', 'arialbd.ttf')]:
        if name not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont(name, 'C:/Windows/Fonts/'+font))
    pdfmetrics.registerFontFamily('Course', normal='Course', bold='CourseBold', italic='Course', boldItalic='CourseBold')
    w,h=A4
    margin=36; gap=22; col=(w-margin*2-gap)/2
    accent='#ae354d' if slug=='sangre' else '#127d96'
    pale='#fcf0f3' if slug=='sangre' else '#edf8fa'
    art=ROOT/'assets/summary-art'/f'{slug}-generativa.png'
    assert art.exists(), f'Missing generated plate: {art}'
    artwork=ImageReader(str(art)); iw,ih=artwork.getSize()
    # Reviewed figure bounds exclude neighboring art in the generated plate.
    # PDF clipping leaves the original raster unchanged and text searchable.
    rows = ([(0,.196),(.201,.390),(.393,.577),(.580,.763),(.774,.970)]
            if slug=='sangre' else [(0,.184),(.189,.378),(.383,.576),(.586,.770),(.778,.975)])
    def figure(canvas, panel, x, y, size):
        row,column=divmod(panel,2)
        x0,x1=(0,.492) if column==0 else (.508,1)
        y0,y1=rows[row]
        scale=min(size/((x1-x0)*iw),size/((y1-y0)*ih))
        fw,fh=(x1-x0)*iw*scale,(y1-y0)*ih*scale
        fx,fy=x+(size-fw)/2,y+(size-fh)/2
        canvas.saveState()
        path=canvas.beginPath();path.rect(fx,fy,fw,fh);canvas.clipPath(path,stroke=0)
        canvas.drawImage(artwork,fx-x0*iw*scale,fy-(1-y1)*ih*scale,width=iw*scale,height=ih*scale,mask='auto')
        canvas.restoreState()
    def paragraph(canvas,text,x,top,width,*,size=9.5,leading=None,bold=False,color=TEXT):
        style=ParagraphStyle('p',fontName='CourseBold' if bold else 'Course',fontSize=size,leading=leading or size*1.39,textColor=HexColor(color))
        p=Paragraph(text,style); _,ph=p.wrap(width,1000)
        p.drawOn(canvas,x,top-ph)
        return top-ph
    def rule(canvas,x,y,width,color='#dfe7ed'):
        canvas.setStrokeColor(HexColor(color));canvas.setLineWidth(.5);canvas.line(x,y,x+width,y)
    target=ROOT/'api/_pdf'/f'morfofuncion-{slug}.pdf'
    c=Canvas(str(target),pagesize=A4,pageCompression=1)
    c.setTitle(f'{title} - Resumen ilustrado de Morfofunción')
    c.setAuthor('Preparatoria Ben Carson')
    c.setSubject('Síntesis original basada en Saladin; ilustraciones generadas con IA y maquetación editorial.')
    layout=[]
    for i,section in enumerate(sections):
        c.setFillColor(HexColor(accent));c.rect(0,h-6,w,6,fill=1,stroke=0)
        c.drawImage(str(LOGO),margin-4,h-76,width=58,height=58,preserveAspectRatio=True,mask='auto')
        paragraph(c,'PREPARATORIA BEN CARSON',margin+64,h-31,300,size=11.3,bold=True,color=NAVY)
        paragraph(c,'MORFOFUNCIÓN  /  RESUMEN ILUSTRADO',margin+64,h-48,310,size=8.1,color=accent)
        paragraph(c,'ALCOCERMED',w-margin-100,h-32,100,size=8.2,bold=True,color=NAVY)
        rule(c,margin,h-83,w-margin*2)
        paragraph(c,f'SALADIN · CAPÍTULO {chapter}  /  {escape(title.upper())}',margin,h-100,w-margin*2,size=8,bold=True,color=accent)
        top=paragraph(c,escape(section['title']),margin,h-121,w-margin*2,size=22,leading=26,bold=True,color=NAVY)-18
        x2=margin+col+gap
        # Left: narrative and first four essential concepts.
        c.setFillColor(HexColor(pale));c.roundRect(margin,top-5,col,4,2,fill=1,stroke=0)
        left=paragraph(c,'LA IDEA CENTRAL',margin,top-16,col,size=8.5,bold=True,color=accent)-9
        left=paragraph(c,escape(section['summary']),margin,left,col,size=9.6,leading=13.7)-17
        left=paragraph(c,'CONCEPTOS ESENCIALES',margin,left,col,size=8.5,bold=True,color=accent)-10
        # Right: generated figure and interpretation, followed by the other four concepts.
        panel,figtitle,caption=FIGURES[slug][i]
        size=176
        figure(c,panel,x2+(col-size)/2,top-size,size)
        right=paragraph(c,escape(figtitle),x2,top-size-7,col,size=9.3,bold=True,color=NAVY)-5
        right=paragraph(c,escape(caption),x2,right,col,size=8.2,leading=11.1,color=MUTED)-13
        right=paragraph(c,'PARA COMPLETAR EL REPASO',x2,right,col,size=8.5,bold=True,color=accent)-10
        for start,x,y in [(0,margin,left),(4,x2,right)]:
            for n,item in enumerate(section['items'][start:start+4],start+1):
                c.setFillColor(HexColor(pale));c.roundRect(x,y-15,21,18,4,fill=1,stroke=0)
                paragraph(c,f'{n:02d}',x+4,y-2,19,size=8,bold=True,color=accent)
                text=f'<b>{escape(item["correct"])}.</b> {escape(item["explanation"])}'
                y=paragraph(c,text,x+29,y,col-29,size=9.1,leading=12.35)-8
                rule(c,x+29,y+3,col-29)
            layout.append(dict(topic=slug,page=i+1,column=start//4,bottom=round(y,2)))
            assert y>=130, f'Content overflow: {slug} page {i+1}, column {start//4}: {y}'
        # A compact pathway connects the page's core ideas without replacing the text.
        for n,label in enumerate(CONNECTIONS[slug][i]):
            bx=margin+n*(w-margin*2+10)/3;bw=(w-margin*2-20)/3
            c.setFillColor(HexColor('#f4f7fa'));c.roundRect(bx,139,bw,53,6,fill=1,stroke=0)
            paragraph(c,f'{n+1:02d}',bx+10,182,24,size=8,bold=True,color=accent)
            paragraph(c,escape(label),bx+10,165,bw-20,size=8.7,leading=10.5,bold=True,color=NAVY)
        # Active recall is separate from the eight preserved explanatory concepts.
        c.setFillColor(HexColor(pale));c.roundRect(margin,77,w-margin*2,43,7,fill=1,stroke=0)
        paragraph(c,'COMPRUEBA TU COMPRENSIÓN',margin+12,108,190,size=7.5,bold=True,color=accent)
        paragraph(c,escape(section['items'][0]['question']),margin+12,94,w-margin*2-24,size=8.1,leading=10.8,color=NAVY)
        first,last=map(int,section['pages'].split('-'))
        paragraph(c,f'<b>Fuente de este bloque:</b> Saladin, cap. {chapter}. Libro: {first-28}-{last-28}; PDF: {section["pages"]}.',margin,66,w-margin*2,size=6.8,leading=9,color=MUTED)
        rule(c,margin,43,w-margin*2)
        paragraph(c,'Ben Carson · Ilustración generada con IA; esquema de apoyo al texto.',margin,33,w-margin*2-65,size=6.8,color=MUTED)
        paragraph(c,f'{i+1:02d} / 10',w-margin-42,33,44,size=8,bold=True,color=accent)
        c.showPage()
    c.save()
    reader=PdfReader(target);assert len(reader.pages)==10
    for i,p in enumerate(reader.pages):
        txt=p.extract_text()
        assert 'PREPARATORIA BEN CARSON' in txt and section is not None
        for item in sections[i]['items']:
            assert item['correct'] in ' '.join(txt.split()), (slug,i,item['correct'])
        assert len(p.images)>=2, (slug,i,'Missing logo or illustration')
    doc=fitz.open(target)
    preview=ROOT/'assets/resumenes-portadas'/f'morfofuncion-{slug}.png'
    doc[0].get_pixmap(matrix=fitz.Matrix(1,1)).save(preview)
    qa=ROOT/'output/morfo-sangre-sentidos/pdf-qa';qa.mkdir(parents=True,exist_ok=True)
    for i,page in enumerate(doc):
        page.get_pixmap(matrix=fitz.Matrix(1.3,1.3)).save(qa/f'{slug}-{i+1:02d}.png')
    (qa/f'{slug}-layout.json').write_text(json.dumps(layout,indent=2),encoding='utf8')
    out=ROOT/'output/pdf'/target.name;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(target.read_bytes())
    print(f'{slug}: 10 branded, illustrated pages, {target.stat().st_size} bytes; lowest text baseline {min(x["bottom"] for x in layout):.1f}')
