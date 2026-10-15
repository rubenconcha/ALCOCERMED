from pathlib import Path
from pypdf import PdfReader
import json
ROOT=Path(__file__).resolve().parents[1]
reader=PdfReader(ROOT/'api/_pdf/morfofuncion-sentidos.pdf')
assert len(reader.pages)==15
titles=['Gusto: de la saliva a la señal nerviosa','Olfato: amplificación y código combinado','Retina: luz, glutamato y contraste','Audición: convertir movimiento en señal','Equilibrio: dirección, aceleración y mirada']
extension=''
for n,(page,title) in enumerate(zip(reader.pages[10:],titles),11):
 text=' '.join(page.extract_text().split());extension+=text+' '
 assert title in text and len(text)>1600
 assert 'PREPARATORIA BEN CARSON' in text and 'revisión docente pendiente' in text
 assert 'Fuente: Saladin' in text and 'Ilustración generada con IA' in text
 assert f'{n:02d} / 15' in text and len(page.images)>=2
 assert any(image.image.width>=700 for image in page.images)
for case in range(1,7):assert f'Caso {case}' in extension
for phrase in ['disminuye el GMPc','hiperpolarización y menor liberación de glutamato','la fibra nerviosa conduce potenciales de acción','cúpula normal','un receptor puede responder a varios odorantes','NBK10867','PMID 10089886']:
 assert phrase in extension,phrase
assert len(extension.split())>1450
assert '\ufffd' not in ''.join(p.extract_text() for p in reader.pages)
layout=json.loads((ROOT/'output/morfo-sangre-sentidos/pdf-sentidos-depth-qa/layout.json').read_text())
assert all(row['bottom']>=87 for row in layout)
print('PASS: 15 pages, five sourced illustrated extensions, six worked cases, readable searchable text, original logos, safe bounds and explicit complementary references.')
