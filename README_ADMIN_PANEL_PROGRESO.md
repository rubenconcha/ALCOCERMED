# Panel admin de progreso

Esta version permite que el administrador vea desde `admin.html`:

- Lista de estudiantes con actividad.
- Simulacros realizados.
- Promedios y calificaciones.
- Historial de banco de preguntas.
- Videoclases vistas y porcentaje de progreso.
- Actividad reciente.
- Detalle individual por estudiante.

## Evaluaciones por tema

Entrar en `admin.html?seccion=evaluaciones`. La sección abre Morfofunción, tema 1, y permite elegir cualquiera de los temas del catálogo.

Las evaluaciones nativas ya guardaban sus entregas en `resultados_simulacros`, identificadas por `Evaluación: <título>` y materia. El informe reúne esos registros históricos sin moverlos ni modificar notas. Se pueden filtrar fechas (zona de Bolivia), nombre o correo y presencia de entrega. Cada estudiante tiene su historial completo del tema y período; muestra porcentaje, correctas, incorrectas, sin responder, cantidad de preguntas y tiempo. Conserva las versiones históricas de 20 o 30 preguntas. Los promedios usan la última entrega de cada estudiante y excluyen las cuentas administradoras configuradas.

«Sin entrega registrada» solo significa que no existe un resultado consultable en ese tema y período para una cuenta conocida por el panel. No equivale a no haber abierto la evaluación, y no sustituye una lista de curso. Si la consulta de resultados falla, el informe muestra el error en lugar de atribuir faltas de entrega. El listado visible se puede exportar a CSV.

Los registros históricos no guardan las alternativas seleccionadas por pregunta; no se puede reconstruir ese detalle a partir del porcentaje. No se requieren tablas, migraciones ni permisos adicionales para este informe.

## Nota sobre correos
Supabase no permite leer `auth.users` directamente desde el frontend por seguridad.
Por eso el panel muestra los correos si encuentra una de estas opciones:

1. RPC `admin_list_users` disponible.
2. Tabla `profiles` o `user_profiles` con `user_id` y `email`.
3. Columnas `email`, `user_email` o `student_email` en las tablas de progreso.

Si no existe ninguna, el panel igual muestra el progreso, pero identifica al alumno como `estudiante ...XXXXXX`.

El archivo `SQL_OPCIONAL_CORREOS_ADMIN.sql` permite activar la opcion 1 para ver los correos reales del Auth de Supabase.


### Seguimiento según el menú de la preparatoria

En Administración → Evaluaciones, el selector «Sección del menú» permite consultar flashcards, mapas, atlas, resúmenes, intocables, banco, exámenes, simulacros, evaluaciones y juegos, con estudiante, materia, tema, fechas e historial CSV. Conserva el estilo del panel. Evaluación abre el informe de entregas por tema.

Aplicar `SQL_CAMPUS_SECTION_TRACKING.sql` antes de publicar el registro de nuevas actividades. Se aplicó al proyecto `asnwhddmurstzmghuyin` el 20/10/2026. RLS limita lecturas a la propia cuenta o al administrador; el RPC fija usuario y fecha en servidor. No hay acceso anónimo ni inserción directa desde el navegador. Las visitas, aperturas y repasos son indicadores de uso declarados por el cliente, no constancia de lectura ni evaluación supervisada.

El pasado se conserva con sus límites: flashcards solo tiene un total histórico sin tema; los exámenes/simulacros antiguos sin sección explícita se consultan en «sin clasificación histórica». Los nuevos resultados incluyen `menu_section`. Los juegos por materias conservan sus resultados y se vinculan por UUID, nunca por coincidencia de nombre; una cuenta invitada no puede atribuirse automáticamente a una cuenta de alumno. Las secciones que antes no guardaban actividad empiezan a registrar con esta versión. Menú visitado no equivale a recurso abierto o finalizado. El atlas solo registra el recurso cargado y no cada estructura interna. Quiz y ahorcado registran rondas; no tienen desglose de tema si la ronda no lo proporciona. No se reconstruyen respuestas individuales que no fueron almacenadas.

El nuevo módulo consulta datos existentes y registra uso futuro; no cambia preguntas, bibliografía ni calificaciones. Las fallas de consulta se muestran como consulta incompleta. CSV exporta únicamente el filtro visible, con protección contra fórmulas. No publicar `tmp/`, capturas privadas ni fuentes extraídas.


### Perfil individual y entregas por día

La ficha «Ver progreso» y «Abrir perfil completo» usa ahora el mismo modelo por herramienta del seguimiento: no clasifica `Evaluación:` como simulacro. Muestra todas las secciones del menú en bloques desplegables, sus registros por materia y tema, fechas y resultados guardados, con aciertos/errores/omisiones cuando esos campos existen. Flashcards muestra aperturas de tema nuevas y repasos; el acumulado histórico no acredita haber visto una tarjeta ni permite atribuir repasos a un día. La ausencia de registro se indica expresamente y no se presenta como prueba de que el alumno no estudió.

En Evaluaciones, «Historial de todas las evaluaciones» reúne materias y temas y muestra solo cuentas con entrega. «Hoy» o «Fecha exacta» filtran por día de Bolivia y por entregas guardadas; Desde/Hasta conserva el filtro por intervalo. Ver intentos detalla el título de cada evaluación y CSV respeta la selección. No se calcula progreso entre temas distintos en el historial conjunto. El perfil individual también permite Hoy o una fecha exacta para todas sus herramientas. Las nuevas aperturas de flashcards se registran al abrir un tema; no se reconstruyen aperturas anteriores.


### Preguntas incorrectas y nueva ficha individual

Aplicar `SQL_QUESTION_REVIEW.sql` antes de publicar el nuevo cliente. Se aplicó al proyecto `asnwhddmurstzmghuyin` el 20/10/2026; las dos tablas mantienen RLS activado. Las nuevas entregas nativas de Evaluación, Exámenes, Simulacros y Banco guardan `question_review`: versión, enunciado, alternativas presentadas, opción elegida, alternativas aceptadas, número original, explicación y referencia disponibles. Es una copia de la pregunta existente, no una explicación generada ni una reconstrucción con un banco actualizado. No cambia el cálculo de notas.

«Ver errores y respuestas» en la ficha y «Revisar preguntas» en Ver intentos abren un visor con Incorrectas, Sin responder y Todas. La elegida se distingue de las aceptadas. Un intento antiguo con `question_review = NULL` muestra expresamente que no conservó respuestas individuales; no se deducen a partir de su porcentaje. El visor se carga por ID del intento con la sesión del administrador y las políticas existentes; el listado general no descarga las instantáneas. Los resultados de Juegos por materias conservan su historial propio; esta instantánea corresponde a los motores nativos de exámenes y banco.

La ficha usa tarjetas de intentos, notas y recuentos destacados, prioriza Evaluación y agrupa las herramientas sin registros en un bloque desplegable. Conserva los filtros por día, el estilo azul/dorado de la preparatoria y el registro separado de aperturas y repasos de flashcards.

### Torta de errores dentro del perfil completo

La ficha individual incluye «Errores por materia» después del resumen y antes del historial. Es exclusiva del flujo de administrador existente. Respeta «Todas las fechas», «Hoy» y fecha exacta de Bolivia; Actualizar recarga también el análisis sin cambiar la fecha seleccionada. No requiere migración ni cambia notas, resultados, preguntas o permisos.

La torta suma errores atribuibles de Morfofunción, Salud Pública, Matemáticas y Biología Celular. Su porcentaje es errores de la materia / total de errores atribuibles a esas cuatro materias. La tabla usa un denominador diferente: errores / (correctas + incorrectas) de cada materia. Las proporciones visibles de la torta se redondean por restos mayores para sumar 100,0%; su geometría usa las proporciones originales. Un nuevo intento es una nueva observación; los duplicados del mismo ID y tabla se omiten, sin colapsar intentos legítimos con igual resultado.

Solo al abrir el perfil se consultan `id,question_review` de `resultados_simulacros` y `resultados_banco`, con `user_id` exacto y paginación. Se valida la instantánea mediante `QuestionReview.inspect`. Omisiones y respuestas sin clave válida se separan de correctas/incorrectas. Sin instantánea, un intento monomateria puede aportar sus recuentos explícitos históricos; banco deriva omisiones como total − correctas − incorrectas. No se infieren errores desde el porcentaje. Las claves históricas no se pueden verificar y la tabla lo indica. Detalles malformados, contadores inválidos, materias desconocidas y exámenes mixtos quedan fuera: la instantánea actual no conserva materia por pregunta. Juegos, visitas y repasos no son errores. Un fallo de lectura se anuncia como consulta incompleta y excluye esa fuente.

Pruebas locales: `node --test tests/admin-subject-errors.test.cjs tests/admin-section-tracking.test.cjs tests/admin-topic-results.test.cjs tests/question-review.test.cjs`. QA de navegador completamente aislada con fixtures: `node tests/admin-subject-errors.browser.cjs` (Playwright instalado; opcional `PLAYWRIGHT_MODULE` y `CHROMIUM_EXECUTABLE`). Bloquea todas las solicitudes de red, usa el HTML y CSS reales con datos ficticios y guarda capturas en `outputs/subject-errors-qa/`, que está ignorado por Git. Cubre escritorio, móvil, filtros, recarga, cero errores, ausencia de actividad, aislamiento entre perfiles, respuesta tardía y salida de sesión. No se realizaron lecturas ni escrituras de alumnos reales para esta implementación.
