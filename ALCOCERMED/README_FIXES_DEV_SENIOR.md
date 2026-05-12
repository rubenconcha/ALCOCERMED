# ALCOCERMED - Correcciones Dev Senior

Cambios aplicados en este paquete:

- `config.js` centraliza `SUPABASE_URL`, `SUPABASE_KEY` anon y correos administradores.
- `index.html` y `admin.html` cargan `config.js` antes de `script.js`/`admin.js`.
- Se agrego validacion HTML5 para email y contrasena minima de 6 caracteres.
- `script.js` registra dispositivos usando la RPC `register_device`, para evitar condiciones de carrera.
- `isDeviceAuthorized()` ahora falla de forma segura: si hay error de red/BD, bloquea el acceso en lugar de permitirlo.
- Pantallas de bloqueo de dispositivo unificadas para bloqueo temporal/permanente.
- Catches criticos ahora registran errores con `console.warn` o `console.error`.
- `admin.js` consume `config.js`, valida login, corrige `showToast` y protege `renderEstudiantes` ante `user_id` no string.
- `vercel.json` actualizado para SPA y ruta `/admin`.
- GitHub Actions agregado para validar sintaxis JS.

## Que debes hacer tu

1. Ya ejecutaste los SQL de Supabase: perfecto. Solo confirma que exista la funcion `register_device`.
2. Sube esta carpeta corregida a GitHub o arrastra el ZIP/carpeta a Vercel.
3. Si usas Vercel, entra a la URL publicada y prueba login normal.
4. Para el panel admin, abre `/admin` o `admin.html` y usa un correo incluido en `ADMIN_EMAILS`.
5. En Supabase verifica que las politicas RLS de `user_devices` permitan que cada usuario lea/modifique solo su propia fila.

Nunca coloques una clave `service_role` en el frontend. La clave actual es `anon`, publica para apps web.
