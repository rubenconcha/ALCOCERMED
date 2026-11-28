-- Clasifica las suscripciones por acceso efectivo sin cambiar ningún permiso.
BEGIN;
SET LOCAL lock_timeout = '5s';
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
           WHEN NOT private.campus_email_eligible(u.id) OR coalesce(u.banned_until > now(), false) THEN 'blocked'
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

CREATE OR REPLACE FUNCTION public.campus_admin_access_counts()
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF public.campus_is_admin() IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Solo administradores' USING ERRCODE = '42501';
  END IF;
  RETURN jsonb_build_object(
    'registered', (SELECT count(*) FROM auth.users),
    'active_students', (SELECT count(DISTINCT lower(btrim(s.email))) FROM public.campus_admin_list_subscriptions() s
                        WHERE s.scope='full' AND s.status='active')
  );
END;
$$;
REVOKE ALL ON FUNCTION public.campus_admin_access_counts() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.campus_admin_access_counts() TO authenticated;
NOTIFY pgrst, 'reload schema';
COMMIT;
