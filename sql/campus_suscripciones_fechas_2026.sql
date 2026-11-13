-- Suscripciones por fechas y acceso exclusivo a videoclases.
BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE public.campus_memberships
  DROP CONSTRAINT IF EXISTS campus_memberships_plan_check,
  DROP CONSTRAINT IF EXISTS campus_memberships_check,
  ADD CONSTRAINT campus_memberships_plan_check
    CHECK (plan IN ('legacy', 'monthly', 'semester', 'annual', 'lifetime', 'custom', 'cancelled')),
  ADD CONSTRAINT campus_memberships_check
    CHECK (plan IN ('legacy', 'lifetime', 'cancelled') OR expires_at IS NOT NULL);

CREATE TABLE IF NOT EXISTS public.campus_video_subscription_grants (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL CHECK (expires_at > starts_at),
  revoked_at timestamptz
);
ALTER TABLE public.campus_video_subscription_grants ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_video_subscription_grants FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.campus_has_access() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.campus_device_session_allowed() AND (
    public.campus_is_admin() OR EXISTS (
      SELECT 1 FROM public.campus_memberships m
      WHERE m.user_id = auth.uid() AND m.plan IN ('monthly', 'semester', 'annual', 'lifetime', 'custom')
        AND m.starts_at <= now() AND (m.expires_at IS NULL OR m.expires_at > now())
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.campus_has_video_access() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.campus_has_access() OR (
    public.campus_device_session_allowed() AND EXISTS (
      SELECT 1 FROM public.campus_video_subscription_grants g
      WHERE g.user_id = auth.uid() AND g.revoked_at IS NULL
        AND g.starts_at <= now() AND g.expires_at > now()
    )
  )
$$;
REVOKE ALL ON FUNCTION public.campus_has_video_access() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.campus_has_video_access() TO anon, authenticated;

ALTER POLICY campus_content_access ON public.videoclases USING (public.campus_has_video_access());

CREATE OR REPLACE FUNCTION public.campus_access() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT CASE WHEN auth.uid() IS NOT NULL AND NOT public.campus_device_session_allowed()
    THEN jsonb_build_object('ready', false, 'premium', false, 'admin', false, 'code', 'DEVICE_LIMIT')
    ELSE jsonb_build_object(
      'ready', true, 'premium', public.campus_has_access(), 'admin', public.campus_is_admin(),
      'atlas', public.campus_atlas_access()->'allowed', 'videos', public.campus_has_video_access(),
      'trial', false, 'free_topics_per_subject', 2,
      'expires_at', (SELECT m.expires_at FROM public.campus_memberships m WHERE m.user_id = auth.uid())
    )
  END
$$;

CREATE OR REPLACE FUNCTION public.campus_admin_save_subscription(
  p_email text, p_scope text, p_start date, p_end date
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  student_id uuid;
  access_start timestamptz;
  access_end timestamptz;
BEGIN
  IF NOT public.campus_is_admin() THEN
    RAISE EXCEPTION 'Solo administradores' USING ERRCODE = '42501';
  END IF;
  IF p_scope IS NULL OR p_scope NOT IN ('full', 'videos') THEN
    RAISE EXCEPTION 'Elige el tipo de acceso.' USING ERRCODE = '22023';
  END IF;
  IF p_start IS NULL OR p_end IS NULL OR NOT isfinite(p_start) OR NOT isfinite(p_end) OR p_end < p_start THEN
    RAISE EXCEPTION 'La fecha de fin debe ser igual o posterior a la de inicio.' USING ERRCODE = '22023';
  END IF;

  SELECT u.id INTO student_id FROM auth.users u
  WHERE lower(u.email) = lower(btrim(p_email))
  FOR NO KEY UPDATE;
  IF student_id IS NULL THEN
    RAISE EXCEPTION 'El estudiante debe registrarse con ese correo.' USING ERRCODE = 'P0002';
  END IF;

  access_start := p_start::timestamp AT TIME ZONE 'America/La_Paz';
  access_end := (p_end + 1)::timestamp AT TIME ZONE 'America/La_Paz';
  IF p_scope = 'full' THEN
    INSERT INTO public.campus_memberships (user_id, plan, starts_at, expires_at)
    VALUES (student_id, 'custom', access_start, access_end)
    ON CONFLICT (user_id) DO UPDATE
    SET plan = EXCLUDED.plan, starts_at = EXCLUDED.starts_at, expires_at = EXCLUDED.expires_at;

    INSERT INTO public.campus_atlas_subscription_grants (user_id, starts_at, expires_at)
    VALUES (student_id, access_start, access_end)
    ON CONFLICT (user_id) DO UPDATE
    SET starts_at = EXCLUDED.starts_at, expires_at = EXCLUDED.expires_at;
  ELSE
    INSERT INTO public.campus_video_subscription_grants (user_id, starts_at, expires_at)
    VALUES (student_id, access_start, access_end)
    ON CONFLICT (user_id) DO UPDATE
    SET starts_at = EXCLUDED.starts_at, expires_at = EXCLUDED.expires_at, revoked_at = NULL;
  END IF;

  RETURN jsonb_build_object('status', CASE
    WHEN access_end <= now() THEN 'expired'
    WHEN access_start > now() THEN 'scheduled'
    ELSE 'active'
  END);
END;
$$;

CREATE OR REPLACE FUNCTION public.campus_admin_remove_subscription(p_email text, p_scope text)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  student_id uuid;
  removed_full boolean := false;
  removed_videos boolean := false;
BEGIN
  IF NOT public.campus_is_admin() THEN
    RAISE EXCEPTION 'Solo administradores' USING ERRCODE = '42501';
  END IF;
  IF p_scope IS NULL OR p_scope NOT IN ('all', 'full', 'videos') THEN
    RAISE EXCEPTION 'Elige el acceso que quieres quitar.' USING ERRCODE = '22023';
  END IF;

  SELECT u.id INTO student_id FROM auth.users u
  WHERE lower(u.email) = lower(btrim(p_email))
  FOR NO KEY UPDATE;
  IF student_id IS NULL THEN
    RAISE EXCEPTION 'El estudiante debe registrarse con ese correo.' USING ERRCODE = 'P0002';
  END IF;

  IF p_scope IN ('all', 'full') THEN
    -- Al cambiar el plan, el acceso al atlas ligado a la suscripción también se corta.
    UPDATE public.campus_memberships
    SET plan = 'cancelled'
    WHERE user_id = student_id AND plan IN ('monthly', 'semester', 'annual', 'lifetime', 'custom')
      AND (expires_at IS NULL OR expires_at > now());
    removed_full := FOUND;
  END IF;
  IF p_scope IN ('all', 'videos') THEN
    UPDATE public.campus_video_subscription_grants SET revoked_at = now()
    WHERE user_id = student_id AND revoked_at IS NULL AND expires_at > now();
    removed_videos := FOUND;
  END IF;

  RETURN jsonb_build_object('full', removed_full, 'videos', removed_videos);
END;
$$;

CREATE OR REPLACE FUNCTION public.campus_admin_list_subscriptions()
RETURNS TABLE (email text, student_name text, scope text, plan text, starts_on date, ends_on date, status text)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NOT public.campus_is_admin() THEN
    RAISE EXCEPTION 'Solo administradores' USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
  WITH subscriptions AS (
    SELECT m.user_id, 'full'::text AS scope, m.plan, m.starts_at, m.expires_at,
           m.plan = 'cancelled' AS cancelled
    FROM public.campus_memberships m
    WHERE m.plan <> 'legacy'
    UNION ALL
    SELECT g.user_id, 'videos', 'videos', g.starts_at, g.expires_at, g.revoked_at IS NOT NULL
    FROM public.campus_video_subscription_grants g
  )
  SELECT u.email::text,
         coalesce(nullif(btrim(u.raw_user_meta_data->>'full_name'), ''),
                  nullif(btrim(u.raw_user_meta_data->>'name'), '')),
         s.scope, s.plan, (s.starts_at AT TIME ZONE 'America/La_Paz')::date,
         ((s.expires_at - interval '1 microsecond') AT TIME ZONE 'America/La_Paz')::date,
         CASE
           WHEN s.cancelled THEN 'cancelled'
           WHEN s.expires_at <= now() THEN 'expired'
           WHEN s.starts_at > now() THEN 'scheduled'
           ELSE 'active'
         END
  FROM subscriptions s JOIN auth.users u ON u.id = s.user_id
  ORDER BY lower(u.email), s.scope, u.id;
END;
$$;

REVOKE ALL ON FUNCTION public.campus_admin_save_subscription(text, text, date, date),
  public.campus_admin_remove_subscription(text, text), public.campus_admin_list_subscriptions()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.campus_admin_save_subscription(text, text, date, date),
  public.campus_admin_remove_subscription(text, text), public.campus_admin_list_subscriptions()
  TO authenticated;

NOTIFY pgrst, 'reload schema';
COMMIT;
