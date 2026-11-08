# Simulacro por materia y nivel

## Práctica por temas de Medicina

El selector de Simulacro agrupa Morfofunción (29 temas), Biología Celular (18) y Educación en Salud e Investigación (21) bajo «Materias de Medicina». Cada tema ofrece cuatro preguntas de reconocimiento, cuatro de aplicación y dos que comparan situaciones. «Todos los temas» sortea hasta veinte preguntas de la materia y del nivel elegido. Los simulacros completos y semanales se abren desde el enlace inferior.

Las explicaciones se basan en los tres PDF de `referencias-oficiales/` indicados en su manifiesto. Se consultaron Saladin, *Anatomía y fisiología: la unidad entre forma y función*, 6.ª edición (portada y créditos en PDF 5 y 6), Calvo González, *Biología celular biomédica*, Elsevier, 2015 (PDF 9 y 20), y *Educación en Salud e Investigación*, UMSS, Curso Básico 2025–2026 (PDF 1). La revisión indica tema, sección y página PDF. Incluye el folio impreso cuando se identifica de forma independiente. El archivo de Calvo tiene folios electrónicos.

Para regenerar las 680 preguntas, ejecuta `python tools/suficiencia/build_medicine.py --refs RUTA_A_REFERENCIAS_OFICIALES` con PyMuPDF. El generador verifica las huellas del manifiesto y los pasajes que respaldan los ejercicios. La figura de los ODS del PDF de Salud se cotejó visualmente. La colección se sirve por `/api/suficiencia?collection=medicina-oficial` con la sesión y el acceso verificados por el campus.

## Práctica por capítulos de Medicina UMSA 2026

En Simulacro, el grupo «Textos oficiales UMSA 2026» del selector de temas contiene 38 ejercicios propios de AlcocerMed: 14 de Matemática, 12 de Física y 12 de Química. Hay un ejercicio por cada capítulo y cinco en total para Productos y cocientes notables. Las preguntas muestran resolución, apartado, página impresa y página PDF. «Todos los capítulos UMSA» permite practicar con el conjunto de esa materia. Los 980 ejercicios originales y sus simulacros conservan sus datos.

Fuentes publicadas por la [Unidad de Admisión Facultativa de Medicina UMSA](https://umsa.bo/web/uafmed/inicio), portadas y créditos en las páginas PDF 1 y 2:

- [Texto guía Matemática 2026](https://drive.google.com/file/d/1IRuuJCW8oBAOqL2uqwHZv4eWSVtZkwqF/view), 184 páginas. Revisión y actualización: Ysau Marte Quiroga Chambi y Ariel Natalio Cruz Limachi. SHA-256: `6f2ab1e474383751e19a3aff1c8b09ba55286454b628bda697e6c6eb78af0692`.
- [Texto guía Física 2026](https://drive.google.com/file/d/1L1z3zmyHNpzaB4HGrlJNEjMs6QWF7XUz/view), 202 páginas. Revisión y actualización: Edwin Huanca Choque y Gerad Vicente Sánchez. SHA-256: `0cfca2cb4cef3c61d819c3c106013032f3be6b293409c862e536cf09c4671a82`.
- [Texto guía Química 2026](https://drive.google.com/file/d/1kVK0xS3ULILT3oB98-RCbH2aRV4ffqWA/view), 296 páginas. Revisión y actualización: Juan Pablo Apaza y Maria del Carmen Sandy Serrudo. SHA-256: `39193884b8a5544e13abd441ffad3dc584276d454609a5c700ca0912fa2b397a`.

Los PDF se enlazan en el campus sin subir copias al repositorio. La colección adicional se sirve con los permisos existentes de `/api/suficiencia?collection=umsa-2026`.

Una sola entrada «simulacro» en el menú lateral. El selector reutiliza el formato del Banco de preguntas: materia y tema en dos campos, botones Todos/Fácil/Intermedio/Difícil, resumen de cantidad y botón amarillo «Iniciar simulacro». El tema permanece deshabilitado hasta elegir materia y el inicio exige una combinación con preguntas disponibles. El panel de seguimiento muestra la última práctica real de esa cuenta o una invitación a comenzar; no inventa métricas de dificultad personal.

Los temas numéricos se agrupan por contenido; en lectura cada tema corresponde a un pasaje completo. Se sortean hasta veinte preguntas de la materia, tema y nivel elegidos. Lectura conserva las cinco preguntas de cada texto; Completo toma cinco preguntas por materia e incluye una lectura completa. Los campos elegidos se guardan junto al intento y se validan al restaurarlo. El banco se carga una vez al abrir y los cambios de filtros no vuelven a descargarlo.

## Material

- 980 preguntas distintas: 260 de matemáticas, 260 de física, 260 de química y 200 de lectura.
- 180 ejercicios básicos nuevos: 60 por materia numérica, en 30 familias. Trabajan conteo, conjuntos sencillos, promedios, operaciones directas, unidades, fórmulas proporcionadas, composición y proporciones químicas elementales.
- 120 simulacros por dificultad: 103 por materia, de hasta diez preguntas, y 17 completos de cuarenta preguntas. Los de materia distribuyen las 980 preguntas una vez. Los completos reutilizan parte del mismo material, con diez preguntas de cada materia. No se cuentan como otras preguntas únicas.
- 40 lecturas con cinco preguntas por texto. Se mantienen textos completos dentro de un mismo nivel, sin fragmentarlos.

Fácil prioriza reconocimiento y una relación directa; intermedio, fórmulas y transformaciones previas; difícil, operaciones o ideas encadenadas. En lectura se considera la complejidad conceptual del pasaje. La clasificación es pedagógica estimada, documentada en `difficulty-review.json`, no una calibración obtenida de notas de alumnos. Los simulacros fijos mantienen sus duraciones. El selector configura entre 2 y 3 minutos por pregunta según dificultad (2,5 cuando se eligen todos).

## Ayuda y continuidad

Suficiencia ofrece «Ver resolución paso a paso» durante el intento, con conceptos previos, operaciones, error frecuente, comprobación y respuesta. En lectura se cita la oración y su párrafo. Las prácticas de Medicina ofrecen «Ver explicación». La ayuda conserva la respuesta seleccionada y el tiempo del intento.

Los sesenta simulacros originales y los 120 por nivel conservan sus identificadores; se abren desde «Ver simulacros anteriores». Se conserva también el antiguo inicial para restaurar intentos. La versión del guardado permanece en 1 y el avance se aísla por cuenta en el navegador; no se sincroniza entre dispositivos.

## Fuentes y comprobación

El documento ABP de La Paz/UMSA, autorizado expresamente por el usuario, tiene 44 páginas escaneadas. Se seleccionaron 92 preguntas y se crearon 688 variantes, incluidas las 180 básicas. Cada variante se identifica como práctica nueva y conserva página y ejercicio padre. El PDF no incluye patrón oficial; las claves son razonadas.

Las lecturas adaptan los capítulos 1 y 2 de Kenneth S. Saladin, Anatomía y fisiología: la unidad entre forma y función, 6.ª edición. Los créditos se verificaron en páginas PDF 5 y 6. Se conserva capítulo, sección, página impresa y página PDF. No se usan fuentes académicas externas ni se modifican los PDF originales.

Para reconstruir: `python tools/suficiencia/build_all.py --source-pdf RUTA_AL_PDF_OFICIAL`, con PyMuPDF y SymPy. Se verifica la huella del PDF. Tras preparar el banco anterior y sus lecciones, `build_beginner.py` genera los 180 ejercicios y `build_levels.py` asigna dificultad y compone los simulacros.

`node --test tests/suficiencia.test.cjs tests/suficiencia-levels.test.cjs tests/suficiencia-medicina.test.cjs` comprueba permisos, progreso, ayuda, niveles, textos completos y cobertura. Las 508 variantes previas conservan su verificación numérica y simbólica en `calculation-review.json`. Las 180 nuevas se recalculan independientemente a partir de `beginner-checks.json` en las pruebas.

El contenido se sirve por `/api/suficiencia` con sesión y suscripción verificadas en Supabase. Las rutas de `_sufficiency/` están bloqueadas. No se guardan textos ni claves en el estado local del intento. El tiempo utiliza una fecha absoluta y corrige al vencer. Las notas y duraciones son de práctica, sin carácter oficial de admisión.
