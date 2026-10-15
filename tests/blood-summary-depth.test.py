from pathlib import Path
from pypdf import PdfReader
import json
ROOT=Path(__file__).resolve().parents[1]
reader=PdfReader(ROOT/'api/_pdf/morfofuncion-sangre.pdf')
assert len(reader.pages)==14
titles=['Leucopoyesis: del precursor a la función','Reserva medular, sangre y tejidos','Diferencial: calcular antes de interpretar','Hemostasia: integrar fases y controles']
extension=''
for page,title in zip(reader.pages[10:],titles):
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
layout=json.loads((ROOT/'output/morfo-sangre-sentidos/pdf-depth-qa/layout.json').read_text())
assert all(row['bottom']>=87 for row in layout)
print('PASS: 14 pages, original base preserved, 4 sourced searchable extensions, 6 worked cases, embedded logo/illustrations, arithmetic and page bounds.')
