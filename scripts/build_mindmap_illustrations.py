"""Make topic-specific vector diagrams and select appropriate book figures."""
from pathlib import Path
import json, html, math
import pymupdf
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/mindmaps/illustrations'
OUT.mkdir(exist_ok=True)
P=['#338ac4','#58a46a','#d3913a','#9b6bb1','#35a6a8','#d77395']

def text(x,y,t,size=20,color='#254763',anchor='middle'):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" fill="{color}">{html.escape(t)}</text>'
def rect(x,y,w,h,fill='#eef7fc',stroke='#a1c9df',radius=15):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
def line(x1,y1,x2,y2,color='#76a7c7',arrow=False):
    return f'<path d="M{x1},{y1} L{x2},{y2}" fill="none" stroke="{color}" stroke-width="3"'+(' marker-end="url(#arrow)"' if arrow else '')+'/>'
def person(x,y,color='#338ac4',scale=1):
    return f'<g transform="translate({x},{y}) scale({scale})"><circle cy="-20" r="12" fill="{color}"/><path d="M-18,25 V8 Q-18,-2 0,-2 Q18,-2 18,8 V25 M-8,24 V45 M8,24 V45" fill="none" stroke="{color}" stroke-width="9" stroke-linecap="round"/></g>'
def flow(labels):
    out=''
    for i,(top,bottom) in enumerate(labels):
        x=25+i*210
        out+=rect(x,130,180,150,stroke=P[i])+text(x+90,195,top,22)+text(x+90,233,bottom,18)
        if i<2:out+=line(x+183,205,x+203,205,arrow=True)
    return out
def wheel(center,labels):
    out=rect(235,170,170,80)+text(320,219,center,20)
    for i,label in enumerate(labels):
        a=2*math.pi*i/len(labels)-math.pi/2;x=320+215*math.cos(a);y=210+145*math.sin(a)
        out+=line(320,210,x,y,P[i%6])+rect(round(x-90),round(y-28),180,56,stroke=P[i%6])+text(round(x),round(y+7),label,17)
    return out
def bars():
    return line(75,330,570,330)+line(75,330,75,80)+''.join(rect(100+i*82,330-v,60,v,P[i%6],P[i%6],4)+text(130+i*82,359,str(i+1),16) for i,v in enumerate([70,145,230,170,95]))
def numberline():
    return line(70,240,575,240)+''.join(line(95+i*55,230,95+i*55,250)+text(95+i*55,280,str(i+1),18) for i in range(9))
def table(values,headers):
    out=''
    for j,row in enumerate([headers]+values):
        for i,val in enumerate(row):
            x=80+i*150;y=90+j*55
            out+=rect(x,y,150,55,'#dceef9' if j==0 else '#fff','#a1c9df',0)+text(x+75,y+35,str(val),19)
    return out

flows={
1:[('Comprender','información'),('Practicar','habilidades'),('Decidir','cuidado')],
6:[('Política','prioridades'),('Programa','acciones'),('Evaluación','resultados')],
7:[('Conocimientos','comprender'),('Actitudes','valorar'),('Prácticas','aplicar')],
9:[('Comunidad','diagnóstico'),('Planificación','participación'),('Acción','seguimiento')],
10:[('Necesidad','población'),('Programa','recursos'),('Resultado','indicadores')],
11:[('Detectar','notificar'),('Analizar','distribución'),('Responder','control')],
13:[('Problema','pregunta'),('Método','datos'),('Resultados','conclusiones')],
14:[('Pregunta','delimitar'),('Objetivos','conocer'),('Método','responder')],
15:[('Marco teórico','conceptos'),('Variables','indicadores'),('Medición','datos')],
}
catalog=json.loads((ROOT/'content/mindmaps-catalog.json').read_text(encoding='utf8'))
for entry in catalog:
    if not entry['key'].startswith('salud'):continue
    n=int(entry['key'].split('_')[1]);stem=Path(entry['key']).stem
    if n in flows:body=flow(flows[n])
    elif n==2:
        body=''
        for i,(lab,c) in enumerate(zip(['Condiciones de vida','Redes sociales','Prácticas','Persona'],P)):
            body+=rect(45+i*45,45+i*45,550-i*90,350-i*85,fill=['#eef7fc','#eff8ef','#fff6e8','#f5edfa'][i],stroke=c)+text(320,78+i*45,lab,20)
        body+=person(320,268,P[3],.8)
    elif n==3:
        body=line(70,225,580,225,arrow=True)+text(320,80,'Prevención',25)
        for i,(top,bottom) in enumerate([('Primaria','evitar inicio'),('Secundaria','detectar pronto'),('Terciaria','limitar secuelas')]):
            x=95+i*220;body+=f'<circle cx="{x}" cy="225" r="13" fill="{P[i]}"/>'+text(x,180,top,18)+text(x,277,bottom,16)
        body+=rect(110,320,420,60,'#f5edfa','#9b6bb1')+text(320,359,'Cuaternaria: evitar daño innecesario',18)
    elif n==4:body=wheel('Ottawa',['Políticas','Entornos','Comunidad','Habilidades','Servicios'])
    elif n==5:body=wheel('SAFCI',['Familia','Comunidad','Interculturalidad','Atención integral'])
    elif n==8:body=wheel('Riesgo',['Biología','Conductas','Condiciones sociales','Ambiente'])
    elif n==12:body=flow([('Condiciones','sociales'),('Exposición','oportunidades'),('Salud','distribución')])
    elif n==16 or n==17:
        body=rect(50,60,540,320)+text(320,92,'Población',24)
        for i in range(30):
            x=90+(i%10)*51;y=140+(i//10)*70
            body+=f'<circle cx="{x}" cy="{y}" r="12" fill="{P[1] if i%4==0 else "#b3cfdf"}"/>'
        body+=text(320,354,'Muestra: subconjunto seleccionado',20)
    elif n==18:
        body=numberline()+line(95,160,535,160)+line(95,145,95,175)+line(535,145,535,175)+text(315,120,'Rango = máximo − mínimo',23)+text(95,325,'Mínimo',19)+text(535,325,'Máximo',19)
    elif n==19:body=table([['A',8,'40 %'],['B',7,'35 %'],['C',5,'25 %'],['Total',20,'100 %']],['Categoría','Frecuencia','Porcentaje'])+text(320,405,'Ejemplo ilustrativo · n = 20',17)
    elif n==20:body=bars()+text(320,65,'Distribución de frecuencias',23)+text(320,403,'Ejemplo ilustrativo',17)
    elif n==21:body=table([['Grupo A',12,8],['Grupo B',6,14],['Total',18,22]],['Grupo','Sí','No'])+text(320,352,'Fila × columna: frecuencia conjunta',20)+text(320,395,'Ejemplo ilustrativo',17)
    elif n==22:
        body=numberline()+text(320,70,'Valores: 2, 3, 3, 4, 8',23)
        for x in [150,205,205,260,480]:body+=f'<circle cx="{x}" cy="210" r="9" fill="{P[0]}"/>'
        body+=text(320,335,'Media = 4 · Mediana = 3 · Moda = 3',21)+text(320,395,'Ejemplo ilustrativo',17)
    elif n==23:
        body=line(65,210,575,210)+rect(185,150,270,120,'#e6f3fb','#338ac4')+line(320,150,320,270,P[2])+line(65,180,65,240)+line(575,180,575,240)
        for x,l in [(185,'Q1'),(320,'Q2'),(455,'Q3')]:body+=text(x,310,l,22)
        body+=text(320,90,'Posición en datos ordenados',23)+text(320,375,'25 % · 50 % · 75 %',22)
    elif n==24:
        body=text(320,65,'Igual centro · distinta dispersión',23)
        for y,xs,label in [(180,[270,290,310,330,350,370],'Menor dispersión'),(300,[110,170,250,390,470,530],'Mayor dispersión')]:
            body+=line(70,y,570,y)+''.join(f'<circle cx="{x}" cy="{y}" r="9" fill="{P[0]}"/>' for x in xs)+text(320,y+43,label,19)
        body+=line(320,120,320,310,P[2])
    elif n==25:
        body=text(320,60,'Asimetría: dirección de la cola',23)
        curves=[('M50,210 C90,210 110,105 150,105 C190,105 210,210 250,210','Simétrica'),('M350,210 C370,210 385,105 410,105 C455,105 460,200 590,210','Positiva'),('M65,365 C190,365 200,260 235,260 C265,260 285,365 305,365','Negativa')]
        for i,(d,label) in enumerate(curves):body+=f'<path d="{d}" fill="none" stroke="{P[i]}" stroke-width="5"/>'+text([150,470,185][i],[244,244,399][i],label,19)
    else:
        body=rect(45,65,550,305,'#fff','#a1c9df')+rect(45,65,550,40,'#e5f2fa','#a1c9df',0)+text(320,92,'Hoja de datos' if n==26 else 'Vista de datos',21)
        for x in range(45,596,110):body+=line(x,105,x,370,'#d2e3ed')
        for y in range(105,371,44):body+=line(45,y,595,y,'#d2e3ed')
        for i,v in enumerate([12,15,11,18,14]):body+=text(200,137+i*44,str(v),18)
        body+=text(320,415,'Organizar → analizar → interpretar',22)
    svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 440" role="img"><title>'+html.escape(entry['title'])+'</title><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3z" fill="#76a7c7"/></marker></defs><g font-family="Arial, sans-serif">'+body+'</g></svg>'
    (OUT/(stem+'.svg')).write_text(svg,encoding='utf8')

# Prefer an actual overview of the topic over an incidental photo or secondary diagram.
ledger=json.loads((ROOT/'content/mindmaps-illustration-sources.json').read_text(encoding='utf8'))
docs={'morfo':pymupdf.open(r'C:\Users\PC\Downloads\morfofisiliologia-saladin-anatomia-y-fisiologia (1) (3).pdf'),
      'bio':pymupdf.open(r'C:\Users\PC\Downloads\Biologia_Celular_Biomedica_St_Alfonso_Ca (1).pdf')}
replacements={'morfo_05_histologia.png':('morfo',176),'morfo_09_articulaciones.png':('morfo',312),
 'biocel_01_introduccion.png':('bio',38),'lacelula.png':('bio',38),
 'biocel_07_nucleo_cromatina_adn.png':('bio',293),'nucleocelular.png':('bio',293)}
for key,(book,num) in replacements.items():
    page=docs[book][num-1]
    options=[pymupdf.Rect(x['bbox']) for x in page.get_image_info() if x['width']>150 and x['height']>100 and pymupdf.Rect(x['bbox']).y0>35]
    clip=max(options,key=lambda r:r.width*r.height)
    clip=pymupdf.Rect(clip.x0-3,clip.y0-3,clip.x1+3,clip.y1+3)&page.rect
    pix=page.get_pixmap(matrix=pymupdf.Matrix(2,2),clip=clip,alpha=False)
    im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im.thumbnail((900,700));im.save(OUT/(Path(key).stem+'.webp'),quality=90,method=6)
    ledger[key]['imagePage']=num;ledger[key]['imageRect']=list(clip)
(ROOT/'content/mindmaps-illustration-sources.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('27 vector diagrams and 6 selected source figures')
