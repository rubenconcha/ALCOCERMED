-- ═══════════════════════════════════════════════════════
-- FIX: Permitir al admin borrar participantes y resultados 
-- cuando inicia una nueva sesión del lobby
-- Ejecutar en Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- Asegurar que existan las políticas para DELETE en evaluacion_participantes
DROP POLICY IF EXISTS "Admin delete participantes" ON public.evaluacion_participantes;
CREATE POLICY "Admin delete participantes" ON public.evaluacion_participantes
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );

-- Asegurar que existan las políticas para DELETE en evaluacion_resultados
DROP POLICY IF EXISTS "Admin delete resultados" ON public.evaluacion_resultados;
CREATE POLICY "Admin delete resultados" ON public.evaluacion_resultados
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );

-- También asegurar que los estudiantes pueden hacer upsert de participantes
DROP POLICY IF EXISTS "Authenticated insert participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated insert participantes" ON public.evaluacion_participantes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated read participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated read participantes" ON public.evaluacion_participantes
    FOR SELECT USING (true);

-- Asegurar UPDATE para upsert
DROP POLICY IF EXISTS "Authenticated update participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated update participantes" ON public.evaluacion_participantes
    FOR UPDATE USING (auth.uid() = user_id);
