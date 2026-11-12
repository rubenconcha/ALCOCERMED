-- Regresión con campus_un_dispositivo_2026.sql y campus_cambios_dispositivo_soporte_2026.sql aplicados.
BEGIN;

CREATE FUNCTION pg_temp.expect_device(label text, result boolean) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  IF result IS DISTINCT FROM true THEN RAISE EXCEPTION 'Falló: %', label; END IF;
  RETURN label;
END;
$$;

INSERT INTO auth.users (id, email, email_confirmed_at, created_at)
VALUES ('10000000-0000-4000-8000-000000000001', 'qa-device@example.invalid', now(), now());
INSERT INTO auth.sessions (id, user_id)
VALUES
  ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001'),
  ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001'),
  ('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001');

INSERT INTO public.campus_memberships (user_id, plan, starts_at)
VALUES ('10000000-0000-4000-8000-000000000001', 'lifetime', now());
INSERT INTO public.campus_device_limits (user_id, device_limit, replace_on_login)
VALUES ('10000000-0000-4000-8000-000000000001', 1, true);

-- La cuenta antigua conserva el dispositivo activo y vincula la sesión al verificar.
INSERT INTO public.device_sessions (user_id, device_id, device_name, is_active, last_seen)
VALUES ('10000000-0000-4000-8000-000000000001', 'qa-pc', 'PC', true, now() - interval '1 day');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","session_id":"20000000-0000-4000-8000-000000000001"}',true);
SELECT pg_temp.expect_device('la comprobación vincula el navegador conservado', (public.check_device_active('qa-pc')->>'active')::boolean);
SELECT pg_temp.expect_device('la sesión autorizada mantiene su plan', (public.campus_access()->>'premium')::boolean);
SELECT pg_temp.expect_device('la compu vuelve a entrar sin pedir código', (public.activate_device('qa-pc','PC')->'access'->>'ready')::boolean);

SELECT set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","session_id":"20000000-0000-4000-8000-000000000002"}',true);
SELECT pg_temp.expect_device('un segundo navegador requiere código aunque tuviera una excepción', public.activate_device('qa-cel','Celular')->>'code' = 'DEVICE_LIMIT');
SELECT pg_temp.expect_device('el primer cambio se ofrece con código', public.activate_device('qa-cel','Celular')->>'support_required' = 'false');
SELECT pg_temp.expect_device('la sesión pendiente no accede a los contenidos', public.campus_access()->>'ready' = 'false');
SELECT pg_temp.expect_device('la sesión pendiente tampoco abre el atlas', public.campus_atlas_access()->>'allowed' = 'false');
SELECT pg_temp.expect_device('la contraseña sola no autoriza el cambio', public.campus_replace_device('qa-pc','qa-cel','Celular')->>'code' = 'EMAIL_VERIFICATION_REQUIRED');
SELECT pg_temp.expect_device('el navegador pendiente no puede leer el registro de dispositivos', NOT has_table_privilege('authenticated','public.device_sessions','SELECT'));
DO $$
BEGIN
  PERFORM public.campus_my_devices();
  RAISE EXCEPTION 'Se reveló el navegador antes de verificar el correo';
EXCEPTION WHEN insufficient_privilege THEN
  NULL;
END;
$$;

SELECT set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","session_id":"20000000-0000-4000-8000-000000000001"}',true);
SELECT pg_temp.expect_device('la compu sigue habilitada mientras se espera el código', (public.check_device_active('qa-pc')->>'active')::boolean);

SELECT set_config('request.jwt.claims',jsonb_build_object(
  'sub','10000000-0000-4000-8000-000000000001','session_id','20000000-0000-4000-8000-000000000003',
  'amr',jsonb_build_array(jsonb_build_object('method','otp','timestamp',extract(epoch FROM now()-interval '11 minutes')))
)::text,true);
SELECT pg_temp.expect_device('la verificación vencida no cambia de navegador', public.campus_replace_device('qa-pc','qa-cel','Celular')->>'code' = 'EMAIL_VERIFICATION_REQUIRED');

SELECT set_config('request.jwt.claims',jsonb_build_object(
  'sub','10000000-0000-4000-8000-000000000001','session_id','20000000-0000-4000-8000-000000000003',
  'amr',jsonb_build_array(jsonb_build_object('method','otp','timestamp',extract(epoch FROM now())))
)::text,true);
SELECT pg_temp.expect_device('el correo verificado puede consultar un solo navegador', jsonb_array_length(public.campus_my_devices()->'devices') = 1);
SELECT pg_temp.expect_device('un código válido activa el celular', (public.campus_replace_device('qa-pc','qa-cel','Celular')->>'ok')::boolean);
SELECT pg_temp.expect_device('reintentar una transferencia aplicada es seguro', (public.campus_replace_device('qa-pc','qa-cel','Celular')->>'ok')::boolean);
SELECT pg_temp.expect_device('el celular autorizado accede a los contenidos', (public.campus_access()->>'ready')::boolean);
SELECT pg_temp.expect_device('un segundo cambio requiere soporte', public.campus_replace_device('qa-cel','qa-tercero','Otro')->>'code' = 'SUPPORT_REQUIRED');
SELECT pg_temp.expect_device('la consulta del dispositivo confirma que se usó el cambio', public.campus_my_devices()->>'can_replace' = 'false');

RESET ROLE;
UPDATE public.campus_device_changes SET changed_at = now() - interval '30 days'
WHERE user_id = '10000000-0000-4000-8000-000000000001';
SET LOCAL ROLE authenticated;
SELECT pg_temp.expect_device('un cambio antiguo sigue requiriendo soporte', public.campus_replace_device('qa-cel','qa-tercero','Otro')->>'code' = 'SUPPORT_REQUIRED');

SELECT set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","session_id":"20000000-0000-4000-8000-000000000001"}',true);
SELECT pg_temp.expect_device('el navegador anterior pierde la sesión en el servidor', public.check_device_active('qa-pc')->>'active' = 'false');
SELECT pg_temp.expect_device('el token anterior ya no abre contenidos', public.campus_access()->>'ready' = 'false');
SELECT pg_temp.expect_device('un navegador anterior no puede volver con contraseña', public.activate_device('qa-pc','PC')->>'code' = 'DEVICE_LIMIT');
SELECT pg_temp.expect_device('el nuevo intento muestra soporte desde el acceso', public.activate_device('qa-pc','PC')->>'support_required' = 'true');
RESET ROLE;
SELECT pg_temp.expect_device('solo queda una fila activa y se conserva el historial', (
  SELECT count(*) FILTER (WHERE is_active) = 1 AND count(*) = 2
  FROM public.device_sessions WHERE user_id = '10000000-0000-4000-8000-000000000001'
));

SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims','{}',true);
SELECT pg_temp.expect_device('el registro público sigue disponible', (public.campus_access()->>'ready')::boolean);
SELECT pg_temp.expect_device('la partida pública sigue disponible', public.campus_game_access('7d7b8eaa-4b8e-51cb-a9db-a666bda3d976'));
ROLLBACK;
