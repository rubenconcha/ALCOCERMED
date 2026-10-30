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

## Explicaciones desde cero (30 de octubre de 2026)

Las 800 preguntas incluyen `solution`: objetivo, conceptos previos, entre cuatro y diez pasos desarrollados, operaciones separadas del texto, error frecuente y comprobación. Los problemas calculados tienen un desarrollo específico por familia y datos, no una división del comentario anterior en oraciones. Las 92 preguntas originales tienen sus propias soluciones; las 200 de lectura incluyen evidencia literal y su párrafo de procedencia. Las preguntas negativas explican que la alternativa seleccionada es una afirmación que se rechaza.

`tools/suficiencia/teach_steps.py` se ejecuta al final de la reconstrucción, sin alterar enunciados, alternativas, claves, referencias ni composiciones. Los módulos `teach_math.py`, `teach_physics.py`, `teach_chemistry.py`, `teach_original.py` y `teach_reading.py` conservan el desarrollo pedagógico. `api/_sufficiency/teaching-review.json` registra cobertura, tamaño y huella del contenido previo. El error de precisión de la alternativa original de masa por átomo (abp-35-56) se explica expresamente: es la opción impresa más cercana, no un redondeo exacto.

Las lecciones se muestran al terminar, con pasos numerados y texto de 16 px en celular. No cambian la versión del intento guardado; los resultados anteriores pueden abrir las nuevas explicaciones. Las pruebas verifican las 800 soluciones, citas de los párrafos, respuestas finales, conversiones representativas, escape HTML y rechazo de contenido incompleto. El banco continúa siendo privado y la respuesta completa pesa menos de 2 MB.

## Ayuda durante cada ejercicio

El botón «Ver resolución paso a paso» aparece en todas las preguntas, incluidas las lecturas. Abre la solución en la misma pantalla antes de terminar la práctica y permite volver a las opciones. No marca una respuesta automáticamente ni cambia el tiempo límite. Se conserva por pregunta el estado abierto de la ayuda y la respuesta elegida al navegar o recargar, aislado por cuenta. Las pruebas del flujo comprueban esas condiciones.

El acceso «Empieza por lo básico» ofrece un simulacro inicial de 40 preguntas existentes: diez por materia y dos lecturas completas de introducción al método científico. Comienza con conteo y conceptos y luego incorpora cálculos. Es una selección más sencilla para iniciar el repaso, no otras cuarenta preguntas nuevas; los sesenta simulacros anteriores siguen intactos. `tools/suficiencia/build_guided.py` reconstruye esa selección.

Los enunciados separan oraciones en líneas y las opciones usan un mínimo de 16 px. La pregunta de conjuntos abp-05-01 presenta las cinco listas en filas y expresa las tres condiciones en palabras, conservando el original simbólico desplegable. La pregunta inicial abp-36-64 desarrolla la lista de 0 a 5 y explica las alternativas con notación de comprensión o puntos suspensivos. Estas presentaciones conservan el orden de opciones y las claves de la selección fuente.
