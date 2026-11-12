-- Una cuenta de estudiante conserva un navegador. El cambio requiere verificar el correo.
-- Ejecutar después de publicar la entrada que consulta primero activate_device.
BEGIN;
SET LOCAL lock_timeout = '5s';
LOCK TABLE public.device_sessions IN ACCESS EXCLUSIVE MODE;

ALTER TABLE public.device_sessions ADD COLUMN IF NOT EXISTS auth_session_id uuid;

-- Conservar el navegador usado más recientemente y el historial de los demás.
WITH active AS (
  SELECT id, row_number() OVER (
    PARTITION BY user_id ORDER BY last_seen DESC NULLS LAST, created_at DESC NULLS LAST, id
  ) AS position
  FROM public.device_sessions
  WHERE is_active
)
UPDATE public.device_sessions d
SET is_active = false, auth_session_id = NULL
FROM active a
WHERE d.id = a.id AND a.position > 1;

CREATE UNIQUE INDEX IF NOT EXISTS device_sessions_one_active
  ON public.device_sessions (user_id) WHERE is_active;

-- Los identificadores de navegador se consultan solo por las funciones de abajo.
REVOKE ALL ON public.device_sessions FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.campus_device_limit() RETURNS integer
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$ SELECT 1 $$;

CREATE OR REPLACE FUNCTION public.campus_device_auth_session() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT s.id FROM auth.sessions s
  WHERE s.id = nullif(auth.jwt()->>'session_id', '')::uuid
    AND s.user_id = auth.uid()
    AND (s.not_after IS NULL OR s.not_after > now())
$$;

CREATE OR REPLACE FUNCTION public.campus_device_session_allowed() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT auth.uid() IS NOT NULL AND (
    public.campus_is_admin()
    OR EXISTS (
      SELECT 1 FROM public.device_sessions d
      WHERE d.user_id = auth.uid() AND d.is_active
        AND d.auth_session_id = public.campus_device_auth_session()
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.campus_device_fresh_email() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (
    SELECT 1 FROM jsonb_array_elements(coalesce(auth.jwt()->'amr', '[]'::jsonb)) a
    WHERE a->>'method' = 'otp'
      AND CASE WHEN jsonb_typeof(a->'timestamp') = 'number' THEN (a->>'timestamp')::numeric END
          BETWEEN extract(epoch FROM now() - interval '10 minutes')
              AND extract(epoch FROM now() + interval '30 seconds')
  )
$$;

REVOKE ALL ON FUNCTION public.campus_device_auth_session(), public.campus_device_session_allowed(),
  public.campus_device_fresh_email() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.campus_has_access() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.campus_device_session_allowed() AND (
    public.campus_is_admin() OR EXISTS (
      SELECT 1 FROM public.campus_memberships m
      WHERE m.user_id = auth.uid() AND m.plan IN ('monthly','semester','annual','lifetime')
        AND m.starts_at <= now() AND (m.expires_at IS NULL OR m.expires_at > now())
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.campus_access() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT CASE WHEN auth.uid() IS NOT NULL AND NOT public.campus_device_session_allowed()
    THEN jsonb_build_object('ready', false, 'premium', false, 'admin', false, 'code', 'DEVICE_LIMIT')
    ELSE jsonb_build_object(
      'ready', true, 'premium', public.campus_has_access(), 'admin', public.campus_is_admin(),
      'trial', false, 'free_topics_per_subject', 2,
      'expires_at', (SELECT m.expires_at FROM public.campus_memberships m WHERE m.user_id = auth.uid())
    )
  END
$$;

CREATE OR REPLACE FUNCTION public.campus_free_item(p_kind text, p_id bigint) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT public.campus_device_session_allowed() AND p_kind = 'flashcards' AND EXISTS (
    SELECT 1 FROM public.flashcards f
    JOIN public.campus_free_topics t ON t.materia = f.materia AND t.tema = f.tema
    WHERE f.id = p_id
  )
$$;

CREATE OR REPLACE FUNCTION public.campus_game_access(p_id uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT (auth.uid() IS NULL OR public.campus_device_session_allowed()) AND (
    public.campus_has_access() OR p_id IN (
      '7d7b8eaa-4b8e-51cb-a9db-a666bda3d976'::uuid,
      '2fa17a3c-035a-50d7-afae-ed8fe3ba11fc'::uuid,
      'be379789-f013-4431-bb31-95b1c6f01517'::uuid,
      '113fd5dc-8283-9838-9557-f032f103b5ef'::uuid,
      'a7d3b295-dc3a-6c7a-6cc4-743cdd9724ae'::uuid,
      '29d04e4f-2469-1ff1-c583-9d8f2105e363'::uuid
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.campus_atlas_access() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT jsonb_build_object('ready', true, 'allowed', public.campus_device_session_allowed() AND (
    public.campus_is_admin()
    OR EXISTS (SELECT 1 FROM public.campus_course_enrollments e WHERE e.user_id = auth.uid() AND e.active)
    OR (public.campus_has_access() AND EXISTS (
      SELECT 1 FROM public.campus_atlas_subscription_grants g
      WHERE g.user_id = auth.uid() AND g.starts_at <= now() AND g.expires_at > now()
    ))
  ))
$$;

CREATE OR REPLACE FUNCTION public.activate_device(p_device_id text, p_device_name text) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  u uuid := auth.uid();
  session_id uuid := public.campus_device_auth_session();
BEGIN
  IF session_id IS NULL THEN
    RETURN json_build_object('ok', false, 'code', 'NOT_AUTHENTICATED');
  END IF;
  IF nullif(btrim(p_device_id), '') IS NULL OR length(p_device_id) > 128 THEN
    RETURN json_build_object('ok', false, 'code', 'INVALID_DEVICE');
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(u::text, 0));
  IF EXISTS (
    SELECT 1 FROM public.device_sessions d
    WHERE d.user_id = u AND d.is_active AND d.device_id <> p_device_id
  ) THEN
    RETURN json_build_object('ok', false, 'code', 'DEVICE_LIMIT', 'limit', 1);
  END IF;

  INSERT INTO public.device_sessions (user_id, device_id, device_name, is_active, last_seen, auth_session_id)
  VALUES (u, p_device_id, left(coalesce(nullif(btrim(p_device_name), ''), 'Navegador'), 80), true, now(), session_id)
  ON CONFLICT (user_id, device_id) DO UPDATE SET
    device_name = excluded.device_name, is_active = true, last_seen = excluded.last_seen,
    auth_session_id = excluded.auth_session_id;

  RETURN json_build_object('ok', true, 'limit', 1, 'registered', 1, 'access', public.campus_access());
END;
$$;

CREATE OR REPLACE FUNCTION public.check_device_active(p_device_id text) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  u uuid := auth.uid();
  session_id uuid := public.campus_device_auth_session();
BEGIN
  IF session_id IS NULL THEN
    RETURN json_build_object('active', false, 'reason', 'No autenticado');
  END IF;

  -- Durante la migración un navegador conservado se vincula con su sesión al volver a verificar.
  UPDATE public.device_sessions d
  SET last_seen = now(), auth_session_id = session_id
  WHERE d.user_id = u AND d.device_id = p_device_id AND d.is_active
    AND (d.auth_session_id IS NULL OR d.auth_session_id = session_id);
  RETURN json_build_object('active', FOUND, 'limit', 1);
END;
$$;

CREATE OR REPLACE FUNCTION public.campus_my_devices() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  u uuid := auth.uid();
  next_change timestamptz;
  devices jsonb;
BEGIN
  IF public.campus_device_auth_session() IS NULL
      OR NOT (public.campus_device_session_allowed() OR public.campus_device_fresh_email()) THEN
    RAISE EXCEPTION 'Confirma tu correo para consultar el dispositivo' USING ERRCODE = '42501';
  END IF;
  SELECT changed_at + interval '7 days' INTO next_change FROM public.campus_device_changes WHERE user_id = u;
  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'device_id', device_id, 'name', device_name, 'last_seen', last_seen)), '[]'::jsonb)
  INTO devices FROM public.device_sessions WHERE user_id = u AND is_active;
  RETURN jsonb_build_object(
    'devices', devices, 'limit', 1, 'next_change_at', next_change,
    'can_replace', next_change IS NULL OR next_change <= now()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.campus_replace_device(p_old_device_id text, p_new_device_id text, p_device_name text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  u uuid := auth.uid();
  session_id uuid := public.campus_device_auth_session();
  previous public.device_sessions%ROWTYPE;
  next_change timestamptz;
BEGIN
  IF session_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'code', 'NOT_AUTHENTICATED');
  END IF;
  IF NOT public.campus_device_fresh_email() THEN
    RETURN jsonb_build_object('ok', false, 'code', 'EMAIL_VERIFICATION_REQUIRED');
  END IF;
  IF nullif(btrim(p_new_device_id), '') IS NULL OR length(p_new_device_id) > 128
      OR p_old_device_id IS NULL OR p_old_device_id = p_new_device_id THEN
    RETURN jsonb_build_object('ok', false, 'code', 'INVALID_DEVICE');
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(u::text, 0));
  SELECT d.* INTO previous FROM public.device_sessions d WHERE d.user_id = u AND d.is_active;
  SELECT changed_at + interval '7 days' INTO next_change FROM public.campus_device_changes WHERE user_id = u;
  IF previous.device_id = p_new_device_id AND previous.auth_session_id = session_id THEN
    RETURN jsonb_build_object('ok', true, 'limit', 1, 'next_change_at', next_change);
  END IF;
  IF next_change > now() THEN
    RETURN jsonb_build_object('ok', false, 'code', 'CHANGE_COOLDOWN', 'next_change_at', next_change);
  END IF;
  IF previous.device_id IS DISTINCT FROM p_old_device_id THEN
    RETURN jsonb_build_object('ok', false, 'code', 'DEVICE_CHANGED');
  END IF;

  UPDATE public.device_sessions SET is_active = false, auth_session_id = NULL WHERE id = previous.id;
  INSERT INTO public.device_sessions (user_id, device_id, device_name, is_active, last_seen, auth_session_id)
  VALUES (u, p_new_device_id, left(coalesce(nullif(btrim(p_device_name), ''), 'Navegador'), 80), true, now(), session_id)
  ON CONFLICT (user_id, device_id) DO UPDATE SET
    device_name = excluded.device_name, is_active = true, last_seen = excluded.last_seen,
    auth_session_id = excluded.auth_session_id;
  INSERT INTO public.campus_device_changes (user_id, changed_at) VALUES (u, now())
  ON CONFLICT (user_id) DO UPDATE SET changed_at = excluded.changed_at;
  RETURN jsonb_build_object('ok', true, 'limit', 1, 'next_change_at', now() + interval '7 days');
END;
$$;

REVOKE ALL ON FUNCTION public.activate_device(text, text), public.check_device_active(text),
  public.campus_my_devices(), public.campus_replace_device(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.activate_device(text, text), public.check_device_active(text),
  public.campus_my_devices(), public.campus_replace_device(text, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
COMMIT;
