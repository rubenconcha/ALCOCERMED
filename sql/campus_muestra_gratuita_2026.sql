-- Exige un plan vigente para las partidas del campus.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE OR REPLACE FUNCTION public.campus_game_access(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.campus_has_access();
$$;

DROP POLICY IF EXISTS campus_game_access ON public.evaluaciones;
CREATE POLICY campus_game_access ON public.evaluaciones AS RESTRICTIVE FOR SELECT TO PUBLIC
  USING (public.campus_game_access(id));
DROP POLICY IF EXISTS campus_game_access ON public.evaluacion_preguntas;
CREATE POLICY campus_game_access ON public.evaluacion_preguntas AS RESTRICTIVE FOR SELECT TO PUBLIC
  USING (public.campus_game_access(evaluacion_id));

CREATE OR REPLACE FUNCTION public.campus_game_catalog()
RETURNS TABLE (id uuid, titulo text, tema text, codigo text, asignatura text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT e.id, e.titulo, e.tema, e.codigo, e.asignatura, e.created_at
  FROM public.evaluaciones e
  WHERE e.publicado IS TRUE AND public.campus_has_access()
  ORDER BY e.created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.campus_game_catalog() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.campus_game_catalog() TO authenticated;

CREATE OR REPLACE FUNCTION public.campus_catalog()
RETURNS TABLE (materia text, tema text, total bigint, free_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT f.materia, f.tema, count(*), count(*) FILTER (WHERE t.tema IS NOT NULL)
  FROM public.flashcards f
  LEFT JOIN public.campus_free_topics t ON t.materia = f.materia AND t.tema = f.tema
  WHERE public.campus_device_session_allowed() AND (public.campus_has_access() OR t.tema IS NOT NULL)
  GROUP BY f.materia, f.tema
  ORDER BY f.materia, coalesce(min(t.chapter_order), 999), f.tema;
$$;

CREATE OR REPLACE FUNCTION public.campus_access()
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT CASE WHEN auth.uid() IS NOT NULL AND NOT public.campus_device_session_allowed()
    THEN jsonb_build_object('ready', false, 'premium', false, 'admin', false, 'code', 'DEVICE_LIMIT')
    ELSE jsonb_build_object(
      'ready', true, 'premium', public.campus_has_access(), 'admin', public.campus_is_admin(),
      'atlas', public.campus_atlas_access()->'allowed', 'trial', false, 'free_topics_per_subject', 2,
      'expires_at', (SELECT m.expires_at FROM public.campus_memberships m WHERE m.user_id = auth.uid())
    )
  END;
$$;

NOTIFY pgrst, 'reload schema';
COMMIT;
