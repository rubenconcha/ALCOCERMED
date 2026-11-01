# Mis resultados — alcance y verificación

Estado de revisión: preparado para publicación autorizada. No requiere migraciones ni modifica registros reales. La identificación del despliegue se registra por separado después de verificarlo.

Base: `origin/main` `ff23f4d71201f6ba965117aafb74109f0c1dcb33`, que incluye el gráfico administrativo publicado. Se trabajó en una copia independiente en `task-6/results-work`; los cuatro archivos inicialmente modificados se verificaron contra el contenido raw de ese commit. El cierre se realizó en `task-6/full-patched`, una copia completa del archivo oficial de ese commit (714.561.211 bytes comprimidos), con todos sus assets y los objetos Git históricos requeridos por las pruebas. No se editó `task-4`.

## Causa

La tarjeta del inicio «Mis resultados / Consulta tus evaluaciones» llamaba a `openEvaluacion()`. Esa función está extendida por `topic-evaluations.js` para abrir el catálogo de evaluaciones por tema. El historial quedaba debajo, dentro de un desplegable. Además, `renderEvaluacion()` mezcla `pb_historial` compartido del navegador con la nube y omite identificadores y snapshots de preguntas.

La tarjeta ahora abre `openStudentResults()` y una pantalla independiente. El catálogo continúa disponible en su flujo original; no se borran exámenes ni evaluaciones.

## Alcance

- Historial propio, paginado, de `resultados_simulacros`, incluyendo simulacros, evaluaciones y exámenes. Filtra tipo y fecha UTC, con actualización manual. Los antiguos sin tipo se identifican como históricos.
- Métricas: número de intentos, simulacros con tipo conocido, promedio y mejor nota registrada. Se conservan las notas originales; no se recalifican.
- Gráfico de distribución de errores: errores de la materia / total de errores atribuibles. Barras de tasa: errores / preguntas respondidas con clave válida. Omitidas y sin clave/detalle se muestran separadas. Temas y preguntas con más errores se calculan únicamente desde snapshots almacenados.
- Cada intento tiene «Ver resultado y revisar preguntas»: enunciado, opciones presentadas, elegida, correcta según clave guardada, estado, comentario y fuente disponibles. Filtros para acertadas, incorrectas, omitidas y sin clave/detalle; regreso al historial.
- Históricos sin respuestas mantienen el resumen y explican el límite. No se consultan versiones actuales de exámenes para reconstruirlos. Los mixtos sin materia por pregunta se excluyen del análisis por materia, con nota.
- `question-review.js`: los nuevos snapshots nativos añaden materia y tema de la pregunta, sin cambiar la clasificación ni notas.
- Suficiencia tiene un almacén por cuenta y navegador, diferente de la nube. Se muestran los últimos resultados por simulacro como locales. Los nuevos intentos guardan snapshot al terminar, incluyendo la última práctica configurable, para revisar después sin recargar claves del banco. No se migra ni modifica historial antiguo; los antiguos sin snapshot mantienen solo su agregado. No es un archivo de todos los intentos locales históricos ni se sincroniza entre dispositivos.

## Aislamiento y esquema

La pantalla usa el cliente autenticado existente y solo `resultados_simulacros`. Todas las lecturas contienen `eq('user_id', cuentaActual)`; el detalle añade `eq('id', intento)`. Se verifica la sesión antes y después, se comprueba el dueño recibido y se descartan éxitos y errores tardíos por generación/cuenta. No usa endpoints, credenciales ni roles administrativos. Cerrar sesión limpia sincrónicamente la UI y también invalida cargas; salir de la pantalla invalida el detalle. No se usa `pb_historial`.

No hay extensión backend ni SQL nuevo. Las columnas usadas ya existen: `id,user_id,materia,simulacro_titulo,created_at,porcentaje,correctas,incorrectas,sin_respuesta,tiempo_segundos,menu_section,question_review`. Si faltan las columnas opcionales `menu_section` o `question_review`, se conserva el resumen sin inventar el detalle/tipo. Los errores de permisos se muestran como error; no se eluden RLS ni se convierten en historial vacío exitoso. La autorización de servidor se simula en QA; no se auditaron políticas desplegadas ni cuentas reales.

El nuevo JSON local de Suficiencia se añade al registro que ya guarda cada cuenta (`result_snapshot` y `question_review`). No cambia la selección, contenido, respuestas correctas, cálculo de nota ni identificadores de exámenes. Conserva las opciones y claves del momento de entrega. `resultados_banco`, juegos y flashcards quedan fuera de esta sección de exámenes realizados.

## Archivos del parche

- `campus.html`: CTA, CSS/JS de la pantalla y versiones de assets modificados.
- `script.js`: registro de pantalla en navegación y limpieza en login/logout.
- `question-review.js`: materia/tema en futuros snapshots.
- `suficiencia.js`: snapshot local al terminar, sin cambiar calificación.
- `student-results.js`, `student-results.css`: modelo, carga propia, UI y diseño responsive AlcocerMed.
- `sw.js`: nuevas versiones y assets de la pantalla en precarga; mantiene las exclusiones de API/respuestas privadas y la separación de cachés.
- `.github/workflows/ci.yml`: añade comprobación del historial y aislamiento antes de los pasos existentes; preserva las comprobaciones administrativas.
- `tests/student-results.test.cjs`, `tests/student-results-sufficiency.test.cjs`, `tests/student-results.browser.py`: fixtures exclusivamente sintéticos. La nueva integración ejecuta el guardado real de Suficiencia con el banco existente y comprueba que respuestas y nota se mantienen.
- Este documento de revisión.

Los módulos de administración y su CI se preservaron. No contiene cambios de RumboResi.

## Validación realizada

`node --test tests/student-results.test.cjs tests/student-results-sufficiency.test.cjs tests/question-review.test.cjs tests/admin-subject-errors.test.cjs tests/admin-topic-results.test.cjs`

**39/39 pruebas pasan** (se conservan las 38 originales y se añade la integración de Suficiencia): cuentas separadas, tipos/fechas, duplicados, vacío, históricos, mixtos, estados, denominadores, cambios de pregunta, snapshots locales, paginación, esquema opcional, autorización denegada, cargas tardías exitosas/fallidas, refresco, navegación real de campus y regresión de revisión/admin.

`python tests/student-results.browser.py`

**PASS**, Chromium offline a 1440 px y 390 px: historial → revisión → filtros de preguntas → volver; histórico sin detalle; fechas vacías/inválidas; recarga; consulta denegada; cuenta vacía; logout y detalle tardío; SDK asíncrono e INITIAL_SESSION; revisión local sin petición de detalle a nube. Cero errores JS, sin desborde horizontal. Todas las peticiones externas se abortan y las consultas usan fixtures; no se crean intentos ni se alteran estudiantes.

Capturas inspeccionadas: `outputs/student-results-qa/desktop-history.png`, `desktop-review.png`, `mobile-history.png`, `mobile-review.png`.

Cierre en copia completa, Node 24, misma configuración para base y parche:

| Suite | Base ff23f4d | Parche |
| --- | --- | --- |
| Node completa | 217 pruebas: 211 pasan, 6 fallan | 236 pruebas: 230 pasan, los mismos 6 fallan |
| PDF Python (pypdf/Pillow instalados en workspace) | 3 ejecutadas, 3 fallos de aserción | Los mismos 3 fallos de aserción |
| Específica de resultados/revisión/admin | — | 39/39 pasan |
| Chromium offline PC/móvil | — | Pasa harness aislado y campus completo |

Las seis ubicaciones fallidas de Node coinciden exactamente entre base y parche: `juegos-quiz-copy.test.cjs` (orden/versionado de scripts), `official-flashcards.test.cjs` (hash de fuente morfo), `platform-audit.test.cjs` (precarga ya desfasada de topic-evaluations), `premium-mindmaps.test.cjs` (contenido morfo_08), y dos casos de `public-sample.test.cjs` (marcado/renderers de muestra). No se modificó su contenido para ocultarlos. Los tres PDF fallan ya en la base por marcadores de revisión docente/paginación: `blood-summary-depth.test.py`, `morfo-sangre-sentidos.test.py`, `senses-summary-depth.test.py`. Los archivos educativos y demás assets son idénticos byte por byte.

El primer intento de ampliar la suite tropezó con permisos loopback/dependencias/objetos Git ausentes. Se resolvieron en el entorno de QA, sin cambiar tests existentes, antes de obtener las cifras anteriores. La prueba adicional del campus completo ejecuta los scripts y assets reales desde archivos locales mediante Playwright, sustituyendo solo auth/consultas con fixtures. Confirma CTA real → historial → revisión → volver → móvil → logout, consultas propias y cero escrituras. El servidor HTTP loopback mostró resets intermitentes; la entrega directa de los mismos bytes mediante `route.fulfill(path=...)` hizo el ensayo determinista. Se bloquean logo externo y Font Awesome durante QA offline; sus abortos esperados no son errores JS.

`git diff --check` pasa. La comparación completa de archivos existentes detecta cambios solo en `campus.html`, `script.js`, `question-review.js`, `suficiencia.js`, `sw.js` y `.github/workflows/ci.yml`, además de los seis archivos nuevos indicados. Sin cambios a módulos admin, contenido, precios, IDs, calificaciones ni políticas. No se ejecutaron pruebas SQL contra producción, ni intentos autenticados reales, ni auditoría de RLS desplegado; el código reutiliza las lecturas estudiantiles existentes y prueba sus rechazos con fixtures.

## Entrega

`../mis-resultados-local.patch` aplica los doce archivos anteriores sobre la base indicada. `../mis-resultados-local.zip` incluye únicamente el parche, archivos cambiados y evidencia visual. La publicación se autorizó después de la primera entrega local. Ejecutar y comprobar el nuevo paso de CI en el commit publicado; el fallo de fuentes morfo del CI general es preexistente y debe conservarse visible. Consultar el informe de publicación para SHA remoto, estado READY y hashes de recursos, sin dar por probado el funcionamiento con cuentas reales.
