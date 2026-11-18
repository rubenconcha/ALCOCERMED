-- Restaurar el dispositivo de un estudiante desde el panel de administración.
-- Aplicar en Supabase → SQL Editor (una sola vez).
-- Deja sin efecto el navegador autorizado y permite que la cuenta entre desde su
-- dispositivo actual; también devuelve a la cuenta su cambio automático de equipo.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE OR REPLACE FUNCTION public.campus_admin_reset_devices(p_email text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  student_id uuid;
  devices_reset integer := 0;
  changes_reset integer := 0;
BEGIN
  IF NOT public.campus_is_admin() THEN
    RAISE EXCEPTION 'Solo administradores' USING ERRCODE = '42501';
  END IF;
  IF nullif(btrim(p_email), '') IS NULL THEN
    RAISE EXCEPTION 'Escribe el correo del estudiante.' USING ERRCODE = '22023';
  END IF;

  SELECT u.id INTO student_id FROM auth.users u
  WHERE lower(u.email) = lower(btrim(p_email))
  FOR NO KEY UPDATE;
  IF student_id IS NULL THEN
    RAISE EXCEPTION 'El estudiante debe registrarse con ese correo.' USING ERRCODE = 'P0002';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(student_id::text, 0));
  UPDATE public.device_sessions
  SET is_active = false, auth_session_id = NULL
  WHERE user_id = student_id AND is_active;
  GET DIAGNOSTICS devices_reset = ROW_COUNT;

  DELETE FROM public.campus_device_changes WHERE user_id = student_id;
  GET DIAGNOSTICS changes_reset = ROW_COUNT;

  RETURN jsonb_build_object('ok', true, 'devices_reset', devices_reset, 'changes_reset', changes_reset);
END;
$$;

REVOKE ALL ON FUNCTION public.campus_admin_reset_devices(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.campus_admin_reset_devices(text) TO authenticated;

NOTIFY pgrst, 'reload schema';
COMMIT;

-- ══════════════════════════════════════════════════════════════════════════
-- RESTAURACIÓN PUNTUAL SOLICITADA (Luiztinta99@gmail.com)
-- Ejecuta esta parte una sola vez para que la estudiante pueda entrar ya.
-- Si ya no la necesitas, puedes borrar estas dos sentencias antes de ejecutar.
-- ══════════════════════════════════════════════════════════════════════════
UPDATE public.device_sessions
SET is_active = false, auth_session_id = NULL
WHERE user_id = (SELECT u.id FROM auth.users u WHERE lower(u.email) = lower('Luiztinta99@gmail.com'))
  AND is_active;

DELETE FROM public.campus_device_changes
WHERE user_id = (SELECT u.id FROM auth.users u WHERE lower(u.email) = lower('Luiztinta99@gmail.com'));
