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
