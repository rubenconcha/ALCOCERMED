-- ===============================================================================
-- REINICIAR LÍMITE DE DISPOSITIVOS PARA UN ESTUDIANTE
-- ===============================================================================
-- IMPORTANTE: Ejecuta este código en el "SQL Editor" de tu panel de Supabase.
-- Reemplaza 'correo_del_estudiante@gmail.com' con el correo real del estudiante.

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- 1. Buscar el ID del usuario usando su correo
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'correo_del_estudiante@gmail.com';

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No se encontró ningún usuario con ese correo.';
    RETURN;
  END IF;

  -- 2. Borrar todos los dispositivos registrados para ese usuario
  DELETE FROM public.device_sessions
  WHERE user_id = v_user_id;

  RAISE NOTICE 'Se han borrado los dispositivos. El estudiante ya puede iniciar sesión en 2 dispositivos nuevos.';
END $$;


-- ===============================================================================
-- OPCIÓN B: REINICIAR LOS DISPOSITIVOS DE TODOS LOS ESTUDIANTES (PELIGROSO)
-- ===============================================================================
-- Si quieres borrar la memoria de dispositivos de TODOS los usuarios al mismo tiempo,
-- descomenta y ejecuta la siguiente línea (bajo tu propio riesgo):

-- DELETE FROM public.device_sessions;
