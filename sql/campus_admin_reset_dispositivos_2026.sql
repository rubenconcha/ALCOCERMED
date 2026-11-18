-- Restaurar el dispositivo de un estudiante desde el panel de administración.
-- Aplicar en Supabase → SQL Editor (una sola vez).
--
-- Este archivo tiene DOS partes:
--   1) Crea la función que usa el botón "restaurar dispositivo" del panel admin.
--   2) Restaura ahora mismo a Luiztinta99@gmail.com (Luiztinta99).
--
-- Importante: la función solo funciona llamada desde el panel con una sesión de
-- administrador. No la ejecutes desde el SQL Editor; para una restauración manual
-- usa las dos sentencias directas de la parte 2.

-- ══════════════════════════════════════════════════════════════════════════
-- PARTE 1 · Función para el botón del panel de administración
-- ══════════════════════════════════════════════════════════════════════════
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
  WHERE lower(u.email) = lower(btrim(p_email));
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

-- ══════════════════════════════════════════════════════════════════════════
-- PARTE 2 · Restauración inmediata de Luiztinta99@gmail.com
-- Ejecuta estas dos sentencias para que la estudiante pueda entrar ya.
-- (No llaman a la función: se ejecutan directamente con permisos del editor.)
-- ══════════════════════════════════════════════════════════════════════════
UPDATE public.device_sessions
SET is_active = false, auth_session_id = NULL
WHERE user_id = (SELECT u.id FROM auth.users u WHERE lower(u.email) = lower('Luiztinta99@gmail.com'))
  AND is_active;

DELETE FROM public.campus_device_changes
WHERE user_id = (SELECT u.id FROM auth.users u WHERE lower(u.email) = lower('Luiztinta99@gmail.com'));
