-- Habilitar RLS en las tablas de simulacros y banco si no están habilitadas
ALTER TABLE public.resultados_simulacros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultados_banco ENABLE ROW LEVEL SECURITY;

-- Políticas para resultados_simulacros
DROP POLICY IF EXISTS "Usuarios leen sus propios simulacros" ON public.resultados_simulacros;
CREATE POLICY "Usuarios leen sus propios simulacros" ON public.resultados_simulacros
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios insertan sus propios simulacros" ON public.resultados_simulacros;
CREATE POLICY "Usuarios insertan sus propios simulacros" ON public.resultados_simulacros
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para resultados_banco
DROP POLICY IF EXISTS "Usuarios leen sus propios bancos" ON public.resultados_banco;
CREATE POLICY "Usuarios leen sus propios bancos" ON public.resultados_banco
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuarios insertan sus propios bancos" ON public.resultados_banco;
CREATE POLICY "Usuarios insertan sus propios bancos" ON public.resultados_banco
    FOR INSERT WITH CHECK (auth.uid() = user_id);
