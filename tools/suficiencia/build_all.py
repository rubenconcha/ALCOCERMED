"""Rebuild the 800-question practice bank using the reviewed source selection."""
from pathlib import Path
import argparse,hashlib,shutil,subprocess,sys,json
import pymupdf
ROOT=Path(__file__).resolve().parents[2]
parser=argparse.ArgumentParser()
parser.add_argument('--source-pdf',type=Path,default=ROOT/'referencias-oficiales'/'morfofisiliologia-saladin-anatomia-y-fisiologia (1) (3).pdf')
args=parser.parse_args()
expected='e00074c7105c10052637b1c2a82f2b8959cf7c4cb9a91c4abd058ce958e58148'
if not args.source_pdf.is_file():raise SystemExit('Falta el PDF oficial de Saladin. Usa --source-pdf con su ubicación; no se sustituye por otras fuentes.')
if hashlib.sha256(args.source_pdf.read_bytes()).hexdigest()!=expected:raise SystemExit('El PDF no coincide con la edición oficial revisada. Revalidar el contenido antes de generar.')
work=ROOT/'tmp'/'suficiencia-build';work.mkdir(parents=True,exist_ok=True)
shutil.copyfile(ROOT/'api/_sufficiency/base-selection.json',work/'base-bank.json')
with pymupdf.open(args.source_pdf) as pdf:
 for n in list(range(30,53))+list(range(70,87)):(work/f'saladin-{n}.txt').write_text(pdf[n-1].get_text(),encoding='utf8')
for script in ['build_calculation_practice.py','build_reading_expansion.py','verify_calculations.py','assemble.py']:
 subprocess.run([sys.executable,str(Path(__file__).parent/script)],check=True,cwd=ROOT)
review=json.loads((work/'verified-calculations.json').read_text(encoding='utf8'))
review['date']='2026-10-30';review['sourcePdfSha256']=expected
review['questionDataSha256']=hashlib.sha256((work/'calculation-questions.json').read_bytes()).hexdigest()
(ROOT/'api/_sufficiency/calculation-review.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print('Rebuild complete: 800 questions, 40 passages and 60 named simulations. Original PDFs unchanged.')
