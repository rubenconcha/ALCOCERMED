-- ===============================================================================
-- ALCOCERMED — CONFIGURACIÓN PARA EVENTO DEMO (~100 estudiantes)
-- Ejecutar en Supabase Dashboard > SQL Editor (si faltan permisos)
-- ===============================================================================

-- 1) Permisos de lectura/escritura (si aún no los tienes)
--    Ver también: PERMISOS_ESTUDIANTES.sql, PERMISOS_RESULTADOS.sql, FIX_DELETE_PUBLICAR.sql

-- 2) En Supabase Dashboard > Authentication > Providers > Email:
--    [x] Enable Email provider
--    [x] Enable sign ups
--    [ ] Confirm email  ← DESACTIVAR para que entren al instante (recomendado en el evento)

-- 3) Authentication > Settings:
--    Ajusta "Minimum password length" a 6 (o menos si tu política lo permite)

-- 4) Código del evento (debe coincidir con juegos/app.js → DEMO_EVENT.accessCode):
--    Por defecto: BENCARSON2026
--    Cámbialo en app.js antes del evento si quieres otro código.

-- 5) Link para compartir con alumnos:
--    https://alcocermed.com/juegos/?demo=1
--    (abre directo la pestaña «Cuenta demo 24h»)

-- 6) Opcional: ver cuentas demo creadas
-- SELECT id, email, raw_user_meta_data->>'full_name' AS nombre,
--        raw_user_meta_data->>'demo_expires_at' AS expira,
--        created_at
-- FROM auth.users
-- WHERE email LIKE '%@demo.alcocermed.app'
-- ORDER BY created_at DESC;

-- 7) Opcional: limpiar cuentas demo después del evento (¡irreversible!)
-- DELETE FROM auth.users WHERE email LIKE '%@demo.alcocermed.app';
