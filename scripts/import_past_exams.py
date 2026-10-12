"""Import the supplied historical Word collection, preserving source numbering and keys."""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
STARTS = [0, 305, 563, 787, 1027, 1264, 1515, 1892, 2367, 2847, 3325, 3799, 4275, 4609, 4889, 5278]
YEARS = ['2021', '2021', '2021–2022'] + [y for y in ['2022–2023', '2023–2024', '2024–2025', '2025–2026'] for _ in range(3)]
TYPES = ['Primer parcial', 'Segundo parcial', 'Examen final'] * 5
# Each grid: first question, number of rows, top A/E x and y, bottom A/E x and y.
STANDARD = [(1,16,47,139,449,47,139,702),(17,42,207,299,25,208,299,711),(59,42,367,459,26,368,459,712)]
GRIDS = {
  1: STANDARD, 7: STANDARD, 8: STANDARD, 9: STANDARD,
  2: [(1,16,162,360,922,162,360,1462),(17,42,507,698,27,507,698,1480),(59,42,845,1037,27,845,1037,1481)],
  3: [(1,16,115,220,488,108,215,766),(17,42,324,428,40,290,394,780),(59,42,509,612,52,478,580,788)],
  4: [(1,16,109,203,440,105,200,674),(17,42,279,374,52,270,367,681),(59,42,446,541,55,437,532,682)],
  5: [(1,16,64,167,482,57,163,739),(17,42,257,361,52,239,343,757),(59,42,442,546,58,425,526,764)],
  6: [(1,16,61,166,482,59,164,733),(17,42,245,349,58,242,346,743),(59,42,430,534,61,427,531,744)],
  10: [(1,25,62,148,246,62,148,772),(26,25,199,285,246,199,285,772),(51,25,335,421,246,335,421,772),(76,25,471,557,246,471,557,772)],
  11: [(1,25,75,154,242,61,159,760),(26,25,202,283,237,210,308,753),(51,25,328,407,233,356,454,746),(76,25,454,533,227,499,592,741)],
  12: [(1,25,66,158,235,65,157,735),(26,25,202,294,236,201,293,737),(51,25,339,431,236,337,429,737),(76,25,475,567,239,473,565,737)],
  13: [(1,25,70,164,305,66,160,726),(26,25,209,302,307,204,298,728),(51,25,346,440,309,339,432,730),(76,25,485,579,310,478,571,730)],
  14: [(1,25,51,143,300,51,143,725),(26,25,184,274,300,183,274,725),(51,25,316,405,300,315,405,725),(76,25,448,538,300,448,538,725)],
  15: [(1,25,59,151,282,59,151,675),(26,25,194,285,281,194,285,673),(51,25,329,421,280,329,421,675),(76,25,465,556,280,465,556,675)]
}

def read_key(path, index):
    image = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
    answers = {}; uncertain = []
    circles = cv2.HoughCircles(image, cv2.HOUGH_GRADIENT, 1, 10, param1=70, param2=13, minRadius=4, maxRadius=14)
    circles = circles[0] if circles is not None else []
    for col, (first, rows, xa, xe, yt, ba, be, yb) in enumerate(GRIDS[index]):
        for row in range(rows):
            t=row/(rows-1); y=yt+t*(yb-yt); a=xa+t*(ba-xa); e=xe+t*(be-xe)
            # The photographed 2024–2025 sheet has curved rows from page perspective.
            if index == 11:
                y -= 60*t*(1-t)
                a += [24,0,-8,-18][col]*t*(1-t)
                e += [14,0,-34,-40][col]*t*(1-t)
            scores=[]
            for k in range(5):
                x=a+(e-a)*k/4
                near=sorted([(float((cx-x)**2+(cy-y)**2),cx,cy) for cx,cy,r in circles],key=lambda v:v[0])
                if index in [3,5,11] and near and near[0][0]<80: x,yc=near[0][1:]
                else: yc=y
                x=round(x);yc=round(yc);radius=3 if index in [3,5,11] else max(2,round((e-a)/4*.18))
                scores.append(float(image[yc-radius:yc+radius+1,x-radius:x+radius+1].mean()))
            ranked=sorted(range(5), key=lambda k:scores[k])
            best=ranked[0];margin=scores[ranked[1]]-scores[best]
            if scores[best] < 145 and margin > 25:
                answers[first+row]='ABCDE'[best]
            else:
                uncertain.append({'n':first+row,'scores':scores,'expected':[a,e,y]})
    return answers, uncertain

def text(node):
    return ''.join(t.text or '' for t in node.iter(W+'t')).strip()

def import_collection(source):
    output=ROOT/'api'/'_past_exams';output.mkdir(parents=True,exist_ok=True)
    (ROOT/'tmp'/'past-exams-source').mkdir(parents=True,exist_ok=True)
    (ROOT/'content'/'past-exams').mkdir(parents=True,exist_ok=True)
    media=output;media.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(source) as z:
        body=list(ET.fromstring(z.read('word/document.xml')).find(W+'body'))
        all_text=[text(p) for p in body]
        exams=[]; issues=[]
        for idx,(a,b) in enumerate(zip(STARTS,STARTS[1:]),1):
            year=YEARS[idx-1];kind=TYPES[idx-1];slug=year.replace('–','-')+'-'+str((idx-1)%3+1)
            # 2021 contains two partials; the following final belongs to 2021–2022.
            if idx <= 2:slug='2021-'+str(idx)
            pattern=ROOT/'tmp'/'past-exams-source'/f'image{idx}.png'
            pattern.write_bytes(z.read(f'word/media/image{idx}.png'))
            key,uncertain=read_key(pattern,idx)
            if [u for u in uncertain if u['n'] not in {6:{52},7:{55},8:{96},11:{21,60,91},14:{44,46,95,97,100}}.get(idx,set())]:issues.append({'exam':slug,'uncertain_keys':uncertain})
            # Explicit multiple marks / correction notes, visually checked on the source sheets.
            corrections={6:{52:list('ABCDE')},7:{55:['A','C']},8:{96:['A','C']},11:{21:['C'],60:['A','C'],91:['A','C']},14:{44:['C'],46:['A'],95:['A','C'],97:['A','C'],100:['A','C']}}.get(idx,{})
            key.update({n:v[0] for n,v in corrections.items()})
            with Image.open(pattern) as im:im.convert('RGB').save(media/(slug+'-pattern.webp'),'WEBP',quality=88)
            starts=[];last=0
            for i in range(a,b):
                s=all_text[i];m=re.match(r'^(\d{1,3})\s*[.\-º°)]\s*-?\s*(.*)',s)
                if not m:continue
                n=int(m[1]);bold=body[i].find('.//'+W+'b') is not None
                # Statement numbers 1–3 must not be confused with question headers.
                low_ok=n>3 or n==1 and last==0 or bold or i>a and not all_text[i-1]
                if 1<=n<=100 and n>last and low_ok:
                    starts.append((n,i));last=n
            questions=[];excluded=[];arity=4
            for pos,(n,i) in enumerate(starts):
                stop=starts[pos+1][1] if pos+1<len(starts) else b
                # Read the most recently stated selection key, including per-question keys.
                for keyline in all_text[a:i+1]:
                    definitions=dict(re.findall(r'([A-E])[.)]\s*(.*?)(?=\s+[A-E][.)]|$)',keyline)) if re.match(r'^[A-E][.)]',keyline) else {}
                    if 'C' in definitions:
                        if re.match(r'(?i)(?:Si\s+)?3\b',definitions['C']):arity=5
                        elif re.search(r'(?i)amb[oa]s?|los dos',definitions['C']):arity=4
                pieces=[];options={} 
                for j in range(i,stop):
                    s=all_text[j]
                    if not s:continue
                    if j==i:s=re.sub(r'^\d{1,3}\s*[.\-º°)]\s*-?\s*','',s)
                    # Changes of selection key and headings belong to instructions, not the preceding question.
                    if j>i and (re.match(r'^[A-E][.)]',s) or re.search(r'(?i)^A continuaci|^PATR[OÓ]N|^INTRODUCCI|^MORFOFUN|^BIOLOG[IÍ]A CELULAR|^EDUCACI[OÓ]N PARA LA SALUD|^SALUD P[ÚU]BLICA|^PREGUNTAS DE|^UNIVERSIDAD|^FACULTAD|^CURSO|^Considere|^II\.',s)):
                        continue
                    if re.match(r'^[A-E][.)]',s):
                        options.update(dict(re.findall(r'([A-E])[.)]\s*(.*?)(?=\s+[A-E][.)]|$)',s)))
                    elif s:pieces.append(s)
                # The original instructions define two- or three-statement selection keys.
                choices=['Si 1 es correcto','Si 2 es correcto','Si ambos son correctos','Si ninguno es correcto'] if arity==4 else ['Si 1 es correcto','Si 2 es correcto','Si 3 es correcto','Si todos son correctos','Si ninguno es correcto']
                if idx==15 and n==66:
                    excluded.append({'numero_original':n,'pregunta':'\n'.join(pieces),'reason':'Enunciado incompleto: falta la afirmación 1 y las afirmaciones 2 y 3 no corresponden al tema indicado.'})
                    continue
                accepted=corrections.get(n,[key[n]] if n in key else [])
                if not accepted:raise ValueError(f'Unverified key: {slug} #{n}')
                if any('ABCDE'.index(k)>=len(choices) for k in accepted):raise ValueError(f'Invalid key option: {slug} #{n} {accepted}')
                questions.append({'id':slug+'-'+str(n),'numero_original':n,'pregunta':'\n'.join(pieces),'opcion_a':choices[0],'opcion_b':choices[1],'opcion_c':choices[2],'opcion_d':choices[3],**({'opcion_e':choices[4]} if len(choices)>4 else {}),'respuesta_correcta':accepted[0],'respuestas_aceptadas':accepted,'fuente':f'Examen pasado · Gestión {year} · {kind}','comentario': 'Respuesta según el patrón original.'+(' El patrón acepta '+ ' o '.join(accepted)+'.' if len(accepted)>1 else '')})
            missing=sorted(set(range(1,101))-set(q['numero_original'] for q in questions+excluded))
            durations=re.findall(r'duraci[oó]n del examen es de (\d+) minutos',' '.join(all_text[a:min(a+20,b)]),re.I)
            meta={'id':slug,'year':year,'type':kind,'title':kind+' · '+year,'count':len(questions),'duration':100,'pattern':'/api/past-exam?id='+slug+'&pattern=1','missingNumbers':missing,'excludedQuestions':excluded}
            (output/(slug+'.json')).write_text(json.dumps({**meta,'questions':questions},ensure_ascii=False,indent=2),encoding='utf-8')
            exams.append(meta)
            print(slug,len(questions),'missing:',missing)
        (ROOT/'content'/'past-exams'/'catalog.json').write_text(json.dumps({'freeYear':YEARS[-1],'source':'documento_prepa_ben_carson_editado.docx','sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'exams':exams},ensure_ascii=False,indent=2),encoding='utf-8')
        (ROOT/'tmp'/'past-exams-source'/'import-issues.json').write_text(json.dumps(issues,indent=2),encoding='utf-8')
        print('Key issues:',json.dumps(issues))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('source',type=Path);args=parser.parse_args();import_collection(args.source)
