# Simulacro por materia y nivel

Una sola entrada «simulacro» en el menú lateral. El selector reutiliza el formato del Banco de preguntas: materia y tema en dos campos, botones Todos/Fácil/Intermedio/Difícil, resumen de cantidad y botón amarillo «Iniciar simulacro». El tema permanece deshabilitado hasta elegir materia y el inicio exige una combinación con preguntas disponibles. El panel de seguimiento muestra la última práctica real de esa cuenta o una invitación a comenzar; no inventa métricas de dificultad personal.

Los temas numéricos se agrupan por contenido; en lectura cada tema corresponde a un pasaje completo. Se sortean hasta veinte preguntas de la materia, tema y nivel elegidos. Lectura conserva las cinco preguntas de cada texto; Completo toma cinco preguntas por materia e incluye una lectura completa. Los campos elegidos se guardan junto al intento y se validan al restaurarlo. El banco se carga una vez al abrir y los cambios de filtros no vuelven a descargarlo.

## Material

- 980 preguntas distintas: 260 de matemáticas, 260 de física, 260 de química y 200 de lectura.
- 180 ejercicios básicos nuevos: 60 por materia numérica, en 30 familias. Trabajan conteo, conjuntos sencillos, promedios, operaciones directas, unidades, fórmulas proporcionadas, composición y proporciones químicas elementales.
- 120 simulacros por dificultad: 103 por materia, de hasta diez preguntas, y 17 completos de cuarenta preguntas. Los de materia distribuyen las 980 preguntas una vez. Los completos reutilizan parte del mismo material, con diez preguntas de cada materia. No se cuentan como otras preguntas únicas.
- 40 lecturas con cinco preguntas por texto. Se mantienen textos completos dentro de un mismo nivel, sin fragmentarlos.

Fácil prioriza reconocimiento y una relación directa; intermedio, fórmulas y transformaciones previas; difícil, operaciones o ideas encadenadas. En lectura se considera la complejidad conceptual del pasaje. La clasificación es pedagógica estimada, documentada en `difficulty-review.json`, no una calibración obtenida de notas de alumnos. Los simulacros fijos mantienen sus duraciones. El selector configura entre 2 y 3 minutos por pregunta según dificultad (2,5 cuando se eligen todos).

## Ayuda y continuidad

Todas las preguntas ofrecen «Ver resolución paso a paso» durante el intento, con conceptos previos, operaciones, error frecuente, comprobación y respuesta. En lectura se cita la oración y su párrafo. Abrir la ayuda no elige una respuesta ni reinicia el reloj.

Los sesenta simulacros originales y los 120 por nivel conservan sus identificadores; se abren desde «Ver simulacros anteriores». Se conserva también el antiguo inicial para restaurar intentos. La versión del guardado permanece en 1 y el avance se aísla por cuenta en el navegador; no se sincroniza entre dispositivos.

## Fuentes y comprobación

El documento ABP de La Paz/UMSA, autorizado expresamente por el usuario, tiene 44 páginas escaneadas. Se seleccionaron 92 preguntas y se crearon 688 variantes, incluidas las 180 básicas. Cada variante se identifica como práctica nueva y conserva página y ejercicio padre. El PDF no incluye patrón oficial; las claves son razonadas.

Las lecturas adaptan los capítulos 1 y 2 de Kenneth S. Saladin, Anatomía y fisiología: la unidad entre forma y función, 6.ª edición. Los créditos se verificaron en páginas PDF 5 y 6. Se conserva capítulo, sección, página impresa y página PDF. No se usan fuentes académicas externas ni se modifican los PDF originales.

Para reconstruir: `python tools/suficiencia/build_all.py --source-pdf RUTA_AL_PDF_OFICIAL`, con PyMuPDF y SymPy. Se verifica la huella del PDF. Tras preparar el banco anterior y sus lecciones, `build_beginner.py` genera los 180 ejercicios y `build_levels.py` asigna dificultad y compone los simulacros.

`node --test tests/suficiencia.test.cjs tests/suficiencia-levels.test.cjs` comprueba permisos, progreso, ayuda, niveles, textos completos y cobertura. Las 508 variantes previas conservan su verificación numérica/simbólica en `calculation-review.json`; las 180 nuevas se recalculan independientemente a partir de `beginner-checks.json` en las pruebas.

El contenido se sirve por `/api/suficiencia` con sesión y suscripción verificadas en Supabase. Las rutas de `_sufficiency/` están bloqueadas. No se guardan textos ni claves en el estado local del intento. El tiempo utiliza una fecha absoluta y corrige al vencer. Las notas y duraciones son de práctica, sin carácter oficial de admisión.
