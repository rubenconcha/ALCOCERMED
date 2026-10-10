"""Comprueba que las imágenes citadas por las importaciones de Juegos existen."""

from collections import defaultdict
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
sources = sorted((root / "juegos").glob("*.sql"))
references = defaultdict(set)
pattern = re.compile(r'"pregunta_imagen"\s*:\s*"([^"\\]+)"')

for source in sources:
    for image in pattern.findall(source.read_text(encoding="utf-8")):
        if image.startswith("/juegos/"):
            references[image].add(source.name)

missing = {image: sources for image, sources in references.items()
           if not (root / image.lstrip("/")).is_file()}
print(f"{len(references)} rutas de imágenes, {len(missing)} faltantes")
for image, source_files in sorted(missing.items()):
    print(image, "←", ", ".join(sorted(source_files)))
raise SystemExit(bool(missing))
