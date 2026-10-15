from pathlib import Path
from pypdf import PdfReader
import json
ROOT=Path(__file__).resolve().parents[1]
reader=PdfReader(ROOT/'api/_pdf/morfofuncion-sangre.pdf')
assert len(reader.pages)==17
titles=['Leucopoyesis: del precursor a la función','Reserva medular, sangre y tejidos','Diferencial: calcular antes de interpretar','Hemostasia: integrar fases y controles']
extension=''
for page,title in zip(reader.pages[10:14],titles):
 text=' '.join(page.extract_text().split());extension+=text+' '
 assert title in text and len(text)>1500
 assert 'PREPARATORIA BEN CARSON' in text and 'revisión docente pendiente' in text
 assert 'Fuente: Saladin' in text and 'Ilustración generada con IA' in text
 assert len(page.images)>=2
 assert any(image.image.width>=700 for image in page.images)
for case in range(1,7):assert f'Caso {case}' in extension
assert '5 200 neutrófilos/µl' in extension and '2 000/4 000 = 0,50' in extension
assert 'precursores T migran al timo' in extension
assert 'no identifica por sí solo una leucemia' in extension
assert 'la plasmina degrada fibrina' in extension
assert len(extension.split())>1100

for i, title in enumerate(["Plasma: leer una proporción", "Hemoglobina: conectar estructura", "EPO: seguir la señal"],14):
 text=reader.pages[i].extract_text();assert title in text and len(text)>1100;assert len(reader.pages[i].images)>=2

import pdfplumber
with pdfplumber.open(ROOT/"api/_pdf/morfofuncion-sangre.pdf") as pdf:
 for page in pdf.pages[14:]:
  assert all(0<=w["x0"]<w["x1"]<=page.width and 0<=w["top"]<w["bottom"]<=page.height for w in page.extract_words())
print("PASS: 17 searchable pages, original six cases and three added pages, logo/art, arithmetic and actual PDF text bounds.")
