-- Metadatos de Ben Carson. No asigna grupos ni altera accesos existentes.
-- Aplicar después de campus_suscripciones_fechas_2026.sql.
BEGIN;
SET LOCAL lock_timeout = '5s';

DO $$ BEGIN
  IF to_regprocedure('public.campus_admin_save_subscription(text,text,date,date)') IS NULL THEN
    RAISE EXCEPTION 'Primero aplica campus_suscripciones_fechas_2026.sql.';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.campus_ben_carson_groups (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  student_group text NOT NULL CHECK (student_group IN ('presencial_1', 'presencial_2', 'virtual'))
);

ALTER TABLE public.campus_ben_carson_groups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.campus_ben_carson_groups FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.campus_admin_activate_ben_carson_group(
  p_email text, p_start date, p_end date, p_group text
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  student_id uuid;
  result jsonb;
BEGIN
  IF public.campus_is_admin() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Solo administradores' USING ERRCODE = '42501';
  END IF;
  IF p_group IS NULL OR p_group NOT IN ('presencial_1', 'presencial_2', 'virtual') THEN
    RAISE EXCEPTION 'Elige un grupo válido de Ben Carson.' USING ERRCODE = '22023';
  END IF;

  BEGIN
    SELECT u.id INTO STRICT student_id FROM auth.users u
    WHERE lower(u.email) = lower(btrim(p_email))
    FOR NO KEY UPDATE;
  EXCEPTION
    WHEN no_data_found THEN
      RAISE EXCEPTION 'El estudiante debe registrarse con ese correo.' USING ERRCODE = 'P0002';
    WHEN too_many_rows THEN
      RAISE EXCEPTION 'El correo no identifica una sola cuenta. Revisa el registro.' USING ERRCODE = '22023';
  END;

  result := public.campus_admin_save_subscription(p_email, 'full', p_start, p_end);
  INSERT INTO public.campus_ben_carson_groups (user_id, student_group)
  VALUES (student_id, p_group)
  ON CONFLICT (user_id) DO UPDATE SET student_group = EXCLUDED.student_group;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.campus_admin_list_ben_carson_groups()
RETURNS TABLE (user_id uuid, student_group text, email text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF public.campus_is_admin() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Solo administradores' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT g.user_id, g.student_group,
    CASE WHEN NOT EXISTS (
      SELECT 1 FROM auth.users other
      WHERE other.id <> u.id AND lower(btrim(other.email)) = lower(btrim(u.email))
    ) THEN lower(btrim(u.email))::text END
  FROM public.campus_ben_carson_groups g JOIN auth.users u ON u.id = g.user_id
  ORDER BY g.user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.campus_admin_activate_ben_carson_group(text, date, date, text),
  public.campus_admin_list_ben_carson_groups() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.campus_admin_activate_ben_carson_group(text, date, date, text),
  public.campus_admin_list_ben_carson_groups() TO authenticated;
NOTIFY pgrst, 'reload schema';

COMMIT;
