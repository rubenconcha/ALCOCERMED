-- ===============================================================================
-- SOLUCIÓN CRÍTICA: PERMISOS PARA QUE LOS ESTUDIANTES PUEDAN VER LOS EXÁMENES
-- ===============================================================================
-- Ejecutar en SQL Editor de Supabase

-- 1. Asegurar que las tablas tienen RLS habilitado
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion_preguntas ENABLE ROW LEVEL SECURITY;

-- 2. Permitir que cualquier usuario autenticado (estudiantes) pueda VER las evaluaciones publicadas
DROP POLICY IF EXISTS "Estudiantes pueden ver evaluaciones publicadas" ON public.evaluaciones;
CREATE POLICY "Estudiantes pueden ver evaluaciones publicadas" ON public.evaluaciones
    FOR SELECT USING (publicado = true);

-- 3. Permitir que cualquier usuario autenticado (estudiantes) pueda VER las preguntas de una evaluación
DROP POLICY IF EXISTS "Estudiantes pueden ver preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Estudiantes pueden ver preguntas" ON public.evaluacion_preguntas
    FOR SELECT USING (true);

-- 4. Asegurarnos que los profesores sigan pudiendo crear y editar sus propias evaluaciones
DROP POLICY IF EXISTS "Profesores gestionan sus evaluaciones" ON public.evaluaciones;
CREATE POLICY "Profesores gestionan sus evaluaciones" ON public.evaluaciones
    FOR ALL USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Profesores gestionan sus preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Profesores gestionan sus preguntas" ON public.evaluacion_preguntas
    FOR ALL USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );
