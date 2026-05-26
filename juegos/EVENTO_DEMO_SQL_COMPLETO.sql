-- ===============================================================================
-- ALCOCERMED — SQL COMPLETO PARA EL EVENTO DEMO (~100 estudiantes)
-- ===============================================================================
-- DÓNDE: Supabase Dashboard → SQL Editor → New query → pegar todo → Run
--
-- ¿CUÁNDO EJECUTARLO?
--   Una vez, HOY, antes del evento. Si ya ejecutaste PERMISOS_*.sql antes,
--   volver a ejecutar es seguro (solo reemplaza políticas con el mismo nombre).
--
-- LO QUE NO VA EN SQL (hazlo en el panel de Supabase):
--   Authentication → Providers → Email:
--     [x] Enable Email provider
--     [x] Enable sign ups
--     [ ] Confirm email  ← DESACTIVADO (importante: entran al instante)
--   Authentication → Settings → Minimum password length: 6
--
-- LINK PARA ALUMNOS: https://alcocermed.com/juegos/?demo=1
-- CÓDIGO DEL EVENTO: BENCARSON2026  (en juegos/app.js → DEMO_EVENT.accessCode)
-- ===============================================================================


-- ─── 1. RLS activado en tablas del juego ───
ALTER TABLE public.evaluaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion_preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion_participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluacion_resultados ENABLE ROW LEVEL SECURITY;


-- ─── 2. EVALUACIONES: estudiantes ven las publicadas; profesor gestiona las suyas ───
DROP POLICY IF EXISTS "Estudiantes pueden ver evaluaciones publicadas" ON public.evaluaciones;
CREATE POLICY "Estudiantes pueden ver evaluaciones publicadas" ON public.evaluaciones
    FOR SELECT USING (publicado = true);

DROP POLICY IF EXISTS "Profesores gestionan sus evaluaciones" ON public.evaluaciones;
CREATE POLICY "Profesores gestionan sus evaluaciones" ON public.evaluaciones
    FOR ALL USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Creador actualiza evaluaciones" ON public.evaluaciones;
CREATE POLICY "Creador actualiza evaluaciones" ON public.evaluaciones
    FOR UPDATE USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Creador borra evaluaciones" ON public.evaluaciones;
CREATE POLICY "Creador borra evaluaciones" ON public.evaluaciones
    FOR DELETE USING (auth.uid() = created_by);


-- ─── 3. PREGUNTAS: estudiantes leen; profesor edita las de sus evaluaciones ───
DROP POLICY IF EXISTS "Estudiantes pueden ver preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Estudiantes pueden ver preguntas" ON public.evaluacion_preguntas
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profesores gestionan sus preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Profesores gestionan sus preguntas" ON public.evaluacion_preguntas
    FOR ALL USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );

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

DROP POLICY IF EXISTS "Creador borra preguntas" ON public.evaluacion_preguntas;
CREATE POLICY "Creador borra preguntas" ON public.evaluacion_preguntas
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );


-- ─── 4. PARTICIPANTES: cada alumno registra su nombre (podio / ranking) ───
DROP POLICY IF EXISTS "Authenticated insert participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated insert participantes" ON public.evaluacion_participantes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated read participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated read participantes" ON public.evaluacion_participantes
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated update participantes" ON public.evaluacion_participantes;
CREATE POLICY "Authenticated update participantes" ON public.evaluacion_participantes
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Creador borra participantes" ON public.evaluacion_participantes;
CREATE POLICY "Creador borra participantes" ON public.evaluacion_participantes
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );


-- ─── 5. RESULTADOS: guardar nota propia + ver podio de todos ───
DROP POLICY IF EXISTS "Todos pueden leer resultados" ON public.evaluacion_resultados;
CREATE POLICY "Todos pueden leer resultados" ON public.evaluacion_resultados
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Estudiantes insertan resultados" ON public.evaluacion_resultados;
CREATE POLICY "Estudiantes insertan resultados" ON public.evaluacion_resultados
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Estudiantes actualizan resultados" ON public.evaluacion_resultados;
CREATE POLICY "Estudiantes actualizan resultados" ON public.evaluacion_resultados
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Creador borra resultados" ON public.evaluacion_resultados;
CREATE POLICY "Creador borra resultados" ON public.evaluacion_resultados
    FOR DELETE USING (
        auth.uid() IN (
            SELECT created_by FROM public.evaluaciones WHERE id = evaluacion_id
        )
    );


-- ─── 6. Verificación rápida (opcional: debe devolver filas) ───
SELECT 'evaluaciones' AS tabla, COUNT(*) AS politicas
FROM pg_policies WHERE tablename = 'evaluaciones' AND schemaname = 'public'
UNION ALL
SELECT 'evaluacion_preguntas', COUNT(*) FROM pg_policies WHERE tablename = 'evaluacion_preguntas' AND schemaname = 'public'
UNION ALL
SELECT 'evaluacion_participantes', COUNT(*) FROM pg_policies WHERE tablename = 'evaluacion_participantes' AND schemaname = 'public'
UNION ALL
SELECT 'evaluacion_resultados', COUNT(*) FROM pg_policies WHERE tablename = 'evaluacion_resultados' AND schemaname = 'public';


-- ─── 7. Orden de preguntas y comodines (editor admin) ───
ALTER TABLE public.evaluaciones
ADD COLUMN IF NOT EXISTS config_juego jsonb DEFAULT '{}'::jsonb;
