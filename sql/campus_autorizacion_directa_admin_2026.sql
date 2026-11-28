-- Approve access for an existing verified student when an admin saves full access.
-- The original roster and admin authorization are left unchanged.

CREATE TABLE private.campus_manual_student_approvals (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL CHECK (email = lower(btrim(email)) AND email <> ''),
  starts_at timestamptz NOT NULL,
  expires_at timestamptz NOT NULL CHECK (expires_at > starts_at),
  approved_by uuid,
  approved_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE private.campus_manual_student_approvals ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE private.campus_manual_student_approvals FROM PUBLIC, anon, authenticated, service_role;

CREATE FUNCTION private.campus_student_email_eligible(p_user uuid, p_at timestamptz DEFAULT now())
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
SELECT EXISTS (
  SELECT 1
  FROM auth.users u
  WHERE u.id = p_user AND u.email_confirmed_at IS NOT NULL
    AND NOT coalesce(u.banned_until > p_at, false)
    AND (
      private.campus_email_eligible(u.id, p_at)
      OR EXISTS (
        SELECT 1 FROM private.campus_manual_student_approvals a
        JOIN public.campus_memberships m ON m.user_id = a.user_id AND m.plan = 'custom'
          AND m.starts_at = a.starts_at AND m.expires_at = a.expires_at
        WHERE a.user_id = u.id AND a.email = lower(btrim(u.email))
          AND a.starts_at <= p_at AND a.expires_at > p_at
      )
    )
)
$function$;
REVOKE ALL ON FUNCTION private.campus_student_email_eligible(uuid,timestamptz) FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.campus_has_access()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
SELECT private.campus_student_email_eligible(auth.uid()) AND public.campus_device_session_allowed() AND (
    public.campus_is_admin() OR EXISTS (
        SELECT 1 FROM public.campus_memberships m WHERE m.user_id=auth.uid()
        AND m.plan IN ('monthly','semester','annual','lifetime','custom')
        AND m.starts_at<=now() AND (m.expires_at IS NULL OR m.expires_at>now())
    )
)
$function$;

CREATE OR REPLACE FUNCTION public.campus_admin_list_subscriptions()
 RETURNS TABLE(email text, student_name text, scope text, plan text, starts_on date, ends_on date, status text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  IF public.campus_is_admin() IS DISTINCT FROM true THEN
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
           WHEN NOT private.campus_student_email_eligible(u.id) OR coalesce(u.banned_until > now(), false) THEN 'blocked'
           WHEN s.scope = 'full' AND s.plan NOT IN ('monthly','semester','annual','lifetime','custom') THEN 'blocked'
           WHEN s.scope = 'videos' AND NOT EXISTS (
             SELECT 1 FROM public.campus_memberships m
             WHERE m.user_id = u.id AND m.plan IN ('monthly','semester','annual','lifetime','custom')
               AND m.starts_at <= now() AND (m.expires_at IS NULL OR m.expires_at > now())
           ) THEN 'blocked'
           WHEN EXISTS (
             SELECT 1 FROM private.campus_authorized_emails r
             WHERE r.email = lower(btrim(u.email)) AND r.is_staff
           ) THEN 'staff'
           WHEN s.scope = 'videos' THEN 'included'
           ELSE 'active'
         END
  FROM subscriptions s JOIN auth.users u ON u.id = s.user_id
  ORDER BY lower(u.email), s.scope, u.id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.campus_admin_save_subscription(p_email text, p_scope text, p_start date, p_end date)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  student_id uuid;
  access_start timestamptz;
  access_end timestamptz;
  account record;
BEGIN
  IF public.campus_is_admin() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Solo administradores' USING ERRCODE = '42501';
  END IF;
  IF p_scope IS NULL OR p_scope NOT IN ('full', 'videos') THEN
    RAISE EXCEPTION 'Elige el tipo de acceso.' USING ERRCODE = '22023';
  END IF;
  IF p_start IS NULL OR p_end IS NULL OR NOT isfinite(p_start) OR NOT isfinite(p_end) OR p_end < p_start THEN
    RAISE EXCEPTION 'La fecha de fin debe ser igual o posterior a la de inicio.' USING ERRCODE = '22023';
  END IF;

  BEGIN
    SELECT u.id, u.email, u.email_confirmed_at, u.banned_until INTO STRICT account
    FROM auth.users u
    WHERE lower(btrim(u.email)) = lower(btrim(p_email))
    FOR NO KEY UPDATE;
  EXCEPTION
    WHEN no_data_found THEN
      RAISE EXCEPTION 'El estudiante debe registrarse con ese correo.' USING ERRCODE = 'P0002';
    WHEN too_many_rows THEN
      RAISE EXCEPTION 'El correo no identifica una sola cuenta. Revisa el registro.' USING ERRCODE = '22023';
  END;
  student_id := account.id;
  IF account.banned_until > now() THEN
    RAISE EXCEPTION 'Esta cuenta está suspendida. No se guardó la suscripción.'
      USING ERRCODE = '22023';
  END IF;

  access_start := p_start::timestamp AT TIME ZONE 'America/La_Paz';
  access_end := (p_end + 1)::timestamp AT TIME ZONE 'America/La_Paz';

  IF account.email_confirmed_at IS NULL THEN
    RAISE EXCEPTION 'El estudiante aún no confirmó ese correo. No se guardó la suscripción.'
      USING ERRCODE = '22023';
  END IF;

  IF p_scope = 'full' THEN
    INSERT INTO public.campus_memberships (user_id, plan, starts_at, expires_at)
    VALUES (student_id, 'custom', access_start, access_end)
    ON CONFLICT (user_id) DO UPDATE
    SET plan = EXCLUDED.plan, starts_at = EXCLUDED.starts_at, expires_at = EXCLUDED.expires_at;

    INSERT INTO public.campus_atlas_subscription_grants (user_id, starts_at, expires_at)
    VALUES (student_id, access_start, access_end)
    ON CONFLICT (user_id) DO UPDATE
    SET starts_at = EXCLUDED.starts_at, expires_at = EXCLUDED.expires_at;
    INSERT INTO private.campus_manual_student_approvals (user_id, email, starts_at, expires_at, approved_by)
    VALUES (student_id, lower(btrim(account.email)), access_start, access_end, auth.uid())
    ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email, starts_at = EXCLUDED.starts_at, expires_at = EXCLUDED.expires_at,
        approved_by = EXCLUDED.approved_by, approved_at = now();
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
$function$;

CREATE OR REPLACE FUNCTION public.campus_admin_remove_subscription(p_email text, p_scope text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  student_id uuid;
  removed_full boolean := false;
  removed_videos boolean := false;
BEGIN
  IF public.campus_is_admin() IS DISTINCT FROM true THEN
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
    DELETE FROM private.campus_manual_student_approvals a WHERE a.user_id = student_id;
  END IF;
  IF p_scope IN ('all', 'videos') THEN
    UPDATE public.campus_video_subscription_grants SET revoked_at = now()
    WHERE user_id = student_id AND revoked_at IS NULL AND expires_at > now();
    removed_videos := FOUND;
  END IF;

  RETURN jsonb_build_object('full', removed_full, 'videos', removed_videos);
END;
$function$;
