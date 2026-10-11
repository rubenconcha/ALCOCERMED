BEGIN;
CREATE TABLE IF NOT EXISTS public.intocables_esenciales (
  id text PRIMARY KEY,
  materia text NOT NULL,
  tema text NOT NULL,
  titulo text NOT NULL,
  clave text NOT NULL,
  explicacion text NOT NULL,
  error_comun text NOT NULL,
  pregunta text NOT NULL,
  respuesta text NOT NULL,
  fuente text NOT NULL,
  orden integer NOT NULL UNIQUE,
  acceso_gratis boolean NOT NULL DEFAULT false,
  actualizado_en timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.intocables_esenciales ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.intocables_esenciales FROM anon;
GRANT SELECT ON public.intocables_esenciales TO authenticated;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='intocables_esenciales' AND policyname='intocables_lectura_campus') THEN
    CREATE POLICY intocables_lectura_campus ON public.intocables_esenciales
      FOR SELECT TO authenticated
      USING (acceso_gratis OR public.campus_has_access());
  END IF;
END $$;
NOTIFY pgrst, 'reload schema';
COMMIT;
