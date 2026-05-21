-- ============================================================
-- FIX: POLÍTICAS RLS PARA PERMITIR BORRAR EVALUACIONES Y PUBLICAR
-- Ejecutar en SQL Editor de Supabase (Dashboard > SQL Editor)
-- ============================================================

-- 1. Asegurar RLS habilitado en todas las tablas involucradas
ALTER TABLE public.evaluacion_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion_resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion_preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;

-- 2. Política DELETE para evaluacion_participantes (el creador de la evaluación puede borrar participantes)
DROP POLICY IF EXISTS "Creador borra participantes" ON public.evaluacion_participantes;
CREATE POLICY "Creador borra participantes" ON public.evaluacion_participantes
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );

-- 3. Política DELETE para evaluacion_resultados (el creador de la evaluación puede borrar resultados)
DROP POLICY IF EXISTS "Creador borra resultados" ON public.evaluacion_resultados;
CREATE POLICY "Creador borra resultados" ON public.evaluacion_resultados
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );

-- 4. Política DELETE para evaluacion_preguntas (el creador puede borrar preguntas)
DROP POLICY IF EXISTS "Creador borra preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Creador borra preguntas" ON public.evaluacion_preguntas
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );

-- 5. Política UPDATE para evaluaciones (el creador puede publicar/despublicar su evaluación)
DROP POLICY IF EXISTS "Creador actualiza evaluaciones" ON public.evaluaciones;
CREATE POLICY "Creador actualiza evaluaciones" ON public.evaluaciones
    FOR UPDATE USING (auth.uid() = created_by);

-- 6. Política DELETE para evaluaciones (el creador puede borrar su evaluación)
DROP POLICY IF EXISTS "Creador borra evaluaciones" ON public.evaluaciones;
CREATE POLICY "Creador borra evaluaciones" ON public.evaluaciones
    FOR DELETE USING (auth.uid() = created_by);

-- 7. Mantener políticas existentes que permitan a estudiantes ver/insertar
DROP POLICY IF EXISTS "Estudiantes pueden ver evaluaciones publicadas" ON public.evaluaciones;
CREATE POLICY "Estudiantes pueden ver evaluaciones publicadas" ON public.evaluaciones
    FOR SELECT USING (publicado = true);

DROP POLICY IF EXISTS "Authenticated insert participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated insert participantes" ON public.evaluacion_participantes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated read participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated read participantes" ON public.evaluacion_participantes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated update participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated update participantes" ON public.evaluacion_participantes
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Todos pueden leer resultados" ON public.evaluacion_resultados;
CREATE POLICY "Todos pueden leer resultados" ON public.evaluacion_resultados
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Estudiantes insertan resultados" ON public.evaluacion_resultados;
CREATE POLICY "Estudiantes insertan resultados" ON public.evaluacion_resultados
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Estudiantes actualizan resultados" ON public.evaluacion_resultados;
CREATE POLICY "Estudiantes actualizan resultados" ON public.evaluacion_resultados
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Estudiantes pueden ver preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Estudiantes pueden ver preguntas" ON public.evaluacion_preguntas
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Creador inserta preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Creador inserta preguntas" ON public.evaluacion_preguntas
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );

DROP POLICY IF EXISTS "Creador actualiza preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Creador actualiza preguntas" ON public.evaluacion_preguntas
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );
