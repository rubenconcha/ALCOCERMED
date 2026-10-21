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
