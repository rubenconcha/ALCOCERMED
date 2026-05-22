-- ═══════════════════════════════════════════════════════
-- FIX: LÍMITE DE 2 DISPOSITIVOS INTELIGENTE
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Reemplazar la función activate_device con versión corregida
CREATE OR REPLACE FUNCTION public.activate_device(p_device_id TEXT, p_device_name TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_device_count INT;
    v_device_exists BOOLEAN;
    v_result JSON;
    v_oldest_id UUID;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('ok', false, 'error', 'No autenticado');
    END IF;

    -- Limpiar dispositivos inactivos por más de 48 horas
    DELETE FROM public.device_sessions
    WHERE user_id = v_user_id
      AND is_active = false
      AND last_seen < now() - interval '48 hours';

    -- Contar dispositivos ACTIVOS O vistos en las últimas 24h
    SELECT COUNT(*) INTO v_device_count
    FROM public.device_sessions
    WHERE user_id = v_user_id
      AND (is_active = true OR last_seen > now() - interval '24 hours');

    -- Verificar si este dispositivo ya está registrado
    SELECT EXISTS(
        SELECT 1 FROM public.device_sessions
        WHERE user_id = v_user_id AND device_id = p_device_id
    ) INTO v_device_exists;

    -- Si es nuevo y ya tiene 2 dispositivos activos/recientes, eliminar el más antiguo
    IF NOT v_device_exists AND v_device_count >= 2 THEN
        -- Buscar el dispositivo más antiguo que NO sea este
        SELECT id INTO v_oldest_id
        FROM public.device_sessions
        WHERE user_id = v_user_id
        ORDER BY last_seen ASC
        LIMIT 1;

        IF v_oldest_id IS NOT NULL THEN
            DELETE FROM public.device_sessions WHERE id = v_oldest_id;
        END IF;
    END IF;

    -- Registrar dispositivo si es nuevo
    IF NOT v_device_exists THEN
        INSERT INTO public.device_sessions (user_id, device_id, device_name, is_active, last_seen)
        VALUES (v_user_id, p_device_id, p_device_name, false, now());
    END IF;

    -- Desactivar TODOS los dispositivos del usuario
    UPDATE public.device_sessions
    SET is_active = false
    WHERE user_id = v_user_id;

    -- Activar SOLO este dispositivo
    UPDATE public.device_sessions
    SET is_active = true, last_seen = now(), device_name = p_device_name
    WHERE user_id = v_user_id AND device_id = p_device_id;

    RETURN json_build_object('ok', true);
END;
$$;

-- Asegurar permisos
GRANT EXECUTE ON FUNCTION public.activate_device(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_device_active(TEXT) TO authenticated;
