-- ===============================================================================
-- SOLUCIÓN: PERMISOS PARA QUE ESTUDIANTES PUEDAN GUARDAR Y VER RESULTADOS
-- ===============================================================================
-- Ejecutar en SQL Editor de Supabase

-- 1. Habilitar RLS en resultados (si no estaba)
ALTER TABLE public.evaluacion_resultados ENABLE ROW LEVEL SECURITY;

-- 2. Permitir que cualquier usuario lea los resultados del podio (estudiantes y profesor)
DROP POLICY IF EXISTS "Todos pueden leer resultados" ON public.evaluacion_resultados;
CREATE POLICY "Todos pueden leer resultados" ON public.evaluacion_resultados
    FOR SELECT USING (true);

-- 3. Permitir que cada estudiante guarde (INSERT) sus propios resultados
DROP POLICY IF EXISTS "Estudiantes insertan resultados" ON public.evaluacion_resultados;
CREATE POLICY "Estudiantes insertan resultados" ON public.evaluacion_resultados
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Permitir que cada estudiante actualice (UPDATE) sus propios resultados
DROP POLICY IF EXISTS "Estudiantes actualizan resultados" ON public.evaluacion_resultados;
CREATE POLICY "Estudiantes actualizan resultados" ON public.evaluacion_resultados
    FOR UPDATE USING (auth.uid() = user_id);
