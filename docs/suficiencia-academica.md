# Simulacro: práctica comentada

Una sola entrada «simulacro» en el menú lateral. El catálogo conserva las tarjetas y los botones de la plataforma. Ofrece filtro por tipo o materia, búsqueda y paginación de doce tarjetas. El acceso anterior a los quince simulacros por temas se conserva.

## Material

- 800 preguntas: 200 de matemáticas, 200 de física, 200 de química y 200 de lectura comprensiva.
- 40 lecturas, con cinco preguntas de comprensión, inferencia, vocabulario o relación de ideas por texto.
- 20 simulacros completos de 40 preguntas y 60 minutos. Cada uno contiene 10 preguntas de cada área y dos lecturas completas. Los veinte distribuyen las 800 preguntas sin repetirlas entre ellos.
- 40 simulacros por materia (10 para cada área), de 20 preguntas y 30 minutos. Distribuyen el mismo banco para repaso dirigido: no se presentan como otras 800 preguntas distintas.
- Cada pregunta tiene clave razonada, comentario y referencia. Al terminar, los comentarios pueden consultarse en la revisión. El resultado anterior por simulacro y el intento actual se guardan por cuenta en el navegador.

## Procedencia y límites

Fuente ABP autorizada expresamente por el usuario: documento «Medicina: exámenes pasados ABP», 44 páginas escaneadas de La Paz / UMSA. Su selección revisada contiene 92 preguntas numéricas o conceptuales. No se recibió un patrón oficial y no se publica el PDF original.

La ampliación añade 508 ejercicios nuevos (160 matemáticas, 168 física y 180 química) distribuidos en 59 familias de problemas. Cada variante señala el ejercicio y la página de referencia y se identifica como práctica nueva de AlcocerMed. Se cambian datos o se solicita una magnitud relacionada; no se atribuyen esas variantes a un examen pasado real. Incluyen pasos de resolución con unidades, dominios y redondeo cuando corresponde.

Las 40 lecturas y sus 200 preguntas son adaptaciones didácticas de los capítulos 1 y 2 de Kenneth S. Saladin, Anatomía y fisiología: la unidad entre forma y función, 6.ª edición. Los créditos se verificaron en páginas PDF 5 y 6; cada texto conserva sección, página impresa y página PDF. El documento ABP no proporciona pasajes completos de lectura. No se emplearon fuentes académicas externas ni se modificaron los PDF originales.

Las distribuciones, duraciones y notas son de práctica; no se presentan como un examen oficial ni como criterio de admisión de la UMSA o de la UMSS. Las preguntas ambiguas del original continúan excluidas o llevan la adaptación documentada en `api/_sufficiency/source-audit.json`.

## Comprobación y reconstrucción

`node --test tests/suficiencia.test.cjs` comprueba el banco, las 60 composiciones, la ausencia de repeticiones dentro de cada serie, las lecturas completas, comentarios, corrección, permisos y aislamiento entre cuentas.

`api/_sufficiency/calculation-review.json` conserva 508 comprobaciones de claves mediante cálculo numérico independiente y álgebra simbólica, en las 59 familias. `tools/suficiencia/verify_calculations.py` es el verificador reproducible.

Para reconstruir: `python tools/suficiencia/build_all.py --source-pdf RUTA_AL_PDF_OFICIAL`. Requiere PyMuPDF y SymPy. Se comprueba la huella SHA-256 de la edición oficial antes de extraer páginas. La selección base revisada es `api/_sufficiency/base-selection.json`; los archivos auxiliares se escriben en `tmp/suficiencia-build/` y los originales no se alteran.

El banco se sirve únicamente por `/api/suficiencia` con sesión y suscripción verificadas en Supabase. La ruta de archivos privados queda denegada. No se guardan textos ni claves en el estado local del intento. El temporizador usa una fecha absoluta, continúa al recargar y corrige automáticamente al vencerse. El avance no se sincroniza entre dispositivos.
