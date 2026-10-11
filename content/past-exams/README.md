# Exámenes pasados de ingreso a Medicina UMSS

Fuente: `C:\Users\PC\Downloads\documento_prepa_ben_carson_editado.docx`.
El catálogo registra el SHA-256 del documento importado. Se conservaron los enunciados y la numeración del Word, sin corregir afirmaciones deliberadamente falsas de las preguntas.

15 exámenes, 6 gestiones, 1491 preguntas calificables. El catálogo público contiene solo información de los exámenes. Las preguntas y las imágenes de los patrones se sirven desde `api/past-exam.js`, previa comprobación de sesión y acceso en `campus_access`. Todos los exámenes y patrones de la última gestión (2025–2026) están disponibles para cuentas gratuitas. Las gestiones anteriores requieren un plan vigente. La gestión gratuita se define en `catalog.freeYear`, compartida por la interfaz y el servidor.

Observaciones del documento original:

- Segundo parcial 2022–2023: faltan 47, 48 y 49.
- Primer parcial 2023–2024: faltan 24, 55 y 65.
- Primer parcial 2024–2025: falta 53.
- Final 2025–2026: falta 67. La 66 está incompleta y sus afirmaciones no corresponden al enunciado. Se conserva en `excludedQuestions` y se explica al estudiante; no se califica.
- Final 2022–2023, pregunta 52: todas las alternativas están marcadas en el patrón; se aceptan A–E.
- Primer parcial 2023–2024, pregunta 55, y segundo parcial 2023–2024, pregunta 96: el patrón marca A y C. La 55 no figura en los enunciados disponibles.
- Segundo parcial 2024–2025: el patrón marca A y C en 60 y 91.
- Segundo parcial 2025–2026: la nota de corrección del patrón indica 44=C, 46=A y acepta A o C en 95, 97 y 100.

Reimportación: `python scripts/import_past_exams.py <ruta-del-Word>` (requiere Python, Pillow, NumPy y OpenCV). Las posiciones de las cartillas están calibradas para este archivo. La importación se detiene si una pregunta no tiene una clave verificada. Revisar `tmp/past-exams-source/import-issues.json` antes de publicar otra versión.
