# Panel admin de progreso

Esta version permite que el administrador vea desde `admin.html`:

- Lista de estudiantes con actividad.
- Simulacros realizados.
- Promedios y calificaciones.
- Historial de banco de preguntas.
- Videoclases vistas y porcentaje de progreso.
- Actividad reciente.
- Detalle individual por estudiante.

## Nota sobre correos
Supabase no permite leer `auth.users` directamente desde el frontend por seguridad.
Por eso el panel muestra los correos si encuentra una de estas opciones:

1. RPC `admin_list_users` disponible.
2. Tabla `profiles` o `user_profiles` con `user_id` y `email`.
3. Columnas `email`, `user_email` o `student_email` en las tablas de progreso.

Si no existe ninguna, el panel igual muestra el progreso, pero identifica al alumno como `estudiante ...XXXXXX`.

El archivo `SQL_OPCIONAL_CORREOS_ADMIN.sql` permite activar la opcion 1 para ver los correos reales del Auth de Supabase.
