-- ═══════════════════════════════════════════════════════
-- DEVICE CONTROL SYSTEM FOR ALCOCERMED
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. Crear tabla de sesiones de dispositivos
CREATE TABLE IF NOT EXISTS public.device_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    device_name TEXT DEFAULT 'Desconocido',
    is_active BOOLEAN DEFAULT false,
    last_seen TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, device_id)
);

-- 2. Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_device_sessions_user ON public.device_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_device_sessions_active ON public.device_sessions(user_id, is_active);

-- 3. Habilitar RLS
ALTER TABLE public.device_sessions ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de seguridad (cada usuario solo ve sus dispositivos)
DROP POLICY IF EXISTS "Users read own devices" ON public.device_sessions;
CREATE POLICY "Users read own devices" ON public.device_sessions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own devices" ON public.device_sessions;
CREATE POLICY "Users insert own devices" ON public.device_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own devices" ON public.device_sessions;
CREATE POLICY "Users update own devices" ON public.device_sessions
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own devices" ON public.device_sessions;
CREATE POLICY "Users delete own devices" ON public.device_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Función para activar un dispositivo (desactiva los demás)
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
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('ok', false, 'error', 'No autenticado');
    END IF;

    -- Contar dispositivos registrados de este usuario
    SELECT COUNT(*) INTO v_device_count
    FROM public.device_sessions
    WHERE user_id = v_user_id;

    -- Verificar si este dispositivo ya está registrado
    SELECT EXISTS(
        SELECT 1 FROM public.device_sessions
        WHERE user_id = v_user_id AND device_id = p_device_id
    ) INTO v_device_exists;

    -- Si el dispositivo no existe y ya tiene 2, rechazar
    IF NOT v_device_exists AND v_device_count >= 2 THEN
        RETURN json_build_object(
            'ok', false,
            'error', 'Límite de dispositivos alcanzado. Solo puedes usar 2 dispositivos. Contacta al administrador.',
            'code', 'DEVICE_LIMIT'
        );
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

-- 6. Función para verificar si este dispositivo sigue activo
CREATE OR REPLACE FUNCTION public.check_device_active(p_device_id TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_is_active BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RETURN json_build_object('active', false, 'reason', 'No autenticado');
    END IF;

    SELECT is_active INTO v_is_active
    FROM public.device_sessions
    WHERE user_id = v_user_id AND device_id = p_device_id;

    IF v_is_active IS NULL THEN
        RETURN json_build_object('active', false, 'reason', 'Dispositivo no registrado');
    END IF;

    IF v_is_active THEN
        -- Actualizar last_seen
        UPDATE public.device_sessions
        SET last_seen = now()
        WHERE user_id = v_user_id AND device_id = p_device_id;
        RETURN json_build_object('active', true);
    ELSE
        RETURN json_build_object('active', false, 'reason', 'Sesión activa en otro dispositivo');
    END IF;
END;
$$;

-- 7. Permisos de ejecución
GRANT EXECUTE ON FUNCTION public.activate_device(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_device_active(TEXT) TO authenticated;
GRANT ALL ON public.device_sessions TO authenticated;
