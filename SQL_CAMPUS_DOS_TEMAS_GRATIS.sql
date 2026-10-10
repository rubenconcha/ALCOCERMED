-- Cuenta gratuita: los dos primeros temas de cada libro oficial.
-- Las suscripciones y cuentas administrativas conservan el acceso completo.
-- Idempotente y aditivo: no borra tarjetas ni progreso de estudiantes.
BEGIN;

CREATE TABLE IF NOT EXISTS public.campus_free_topics (
  materia text NOT NULL,
  tema text NOT NULL,
  chapter_order smallint NOT NULL CHECK (chapter_order BETWEEN 1 AND 2),
  PRIMARY KEY (materia, tema),
  UNIQUE (materia, chapter_order)
);
ALTER TABLE public.campus_free_topics ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_free_topics FROM anon, authenticated;

INSERT INTO public.campus_free_topics (materia, tema, chapter_order) VALUES
  ('MORFOFUNCION', 'temas principales de anatomia y fisiologia', 1),
  ('MORFOFUNCION', 'la quimica de la vida', 2),
  ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 1),
  ('BIOLOGIA CELULAR', 'metodos y tecnicas basicas en biologia celular', 2),
  ('SALUD PUBLICA', 'educacion en salud', 1),
  ('SALUD PUBLICA', 'concepto de salud y determinantes', 2)
ON CONFLICT (materia, tema) DO UPDATE SET chapter_order = EXCLUDED.chapter_order;

CREATE OR REPLACE FUNCTION public.campus_has_access()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.campus_is_admin() OR EXISTS (
    SELECT 1 FROM public.campus_memberships m
    WHERE m.user_id = auth.uid()
      AND m.plan IN ('monthly', 'semester', 'annual')
      AND m.starts_at <= now()
      AND (m.expires_at IS NULL OR m.expires_at > now())
  );
$$;

-- Las antiguas membresías "legacy" no acreditan un plan pagado.
CREATE OR REPLACE FUNCTION public.campus_game_access(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.campus_is_admin()
    OR EXISTS (
      SELECT 1 FROM public.campus_memberships m
      WHERE m.user_id = auth.uid()
        AND m.plan IN ('monthly', 'semester', 'annual')
        AND m.starts_at <= now()
        AND m.expires_at > now()
    )
    OR p_id IN (
      '7d7b8eaa-4b8e-51cb-a9db-a666bda3d976'::uuid,
      '2fa17a3c-035a-50d7-afae-ed8fe3ba11fc'::uuid,
      'be379789-f013-4431-bb31-95b1c6f01517'::uuid
    );
$$;

CREATE OR REPLACE FUNCTION public.campus_free_item(p_kind text, p_id bigint)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT auth.uid() IS NOT NULL AND p_kind = 'flashcards' AND EXISTS (
    SELECT 1 FROM public.flashcards f
    JOIN public.campus_free_topics t
      ON t.materia = f.materia AND t.tema = f.tema
    WHERE f.id = p_id
  );
$$;

CREATE OR REPLACE FUNCTION public.campus_access()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object(
    'ready', true,
    'premium', public.campus_has_access(),
    'admin', public.campus_is_admin(),
    'trial', false,
    'free_topics_per_subject', 2,
    'expires_at', (SELECT m.expires_at FROM public.campus_memberships m WHERE m.user_id = auth.uid())
  );
$$;

-- Expone los títulos bloqueados al estudiante, sin revelar preguntas ni respuestas.
CREATE OR REPLACE FUNCTION public.campus_catalog()
RETURNS TABLE (materia text, tema text, total bigint, free_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT f.materia, f.tema, count(*),
         count(*) FILTER (WHERE t.tema IS NOT NULL)
  FROM public.flashcards f
  LEFT JOIN public.campus_free_topics t
    ON t.materia = f.materia AND t.tema = f.tema
  WHERE auth.uid() IS NOT NULL
  GROUP BY f.materia, f.tema
  ORDER BY f.materia, coalesce(min(t.chapter_order), 999), f.tema;
$$;

NOTIFY pgrst, 'reload schema';
COMMIT;
