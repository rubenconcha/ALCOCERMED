-- Aplicar después de sql/campus_un_dispositivo_2026.sql.
-- La fila de campus_device_changes registra que la cuenta ya usó su cambio automático.
BEGIN;
SET LOCAL lock_timeout = '5s';

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
    RETURN json_build_object(
      'ok', false, 'code', 'DEVICE_LIMIT', 'limit', 1,
      'support_required', EXISTS (SELECT 1 FROM public.campus_device_changes c WHERE c.user_id = u)
    );
  END IF;

  INSERT INTO public.device_sessions (user_id, device_id, device_name, is_active, last_seen, auth_session_id)
  VALUES (u, p_device_id, left(coalesce(nullif(btrim(p_device_name), ''), 'Navegador'), 80), true, now(), session_id)
  ON CONFLICT (user_id, device_id) DO UPDATE SET
    device_name = excluded.device_name, is_active = true, last_seen = excluded.last_seen,
    auth_session_id = excluded.auth_session_id;

  RETURN json_build_object('ok', true, 'limit', 1, 'registered', 1, 'access', public.campus_access());
END;
$$;

CREATE OR REPLACE FUNCTION public.campus_my_devices() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  u uuid := auth.uid();
  devices jsonb;
BEGIN
  IF public.campus_device_auth_session() IS NULL
      OR NOT (public.campus_device_session_allowed() OR public.campus_device_fresh_email()) THEN
    RAISE EXCEPTION 'Confirma tu correo para consultar el dispositivo' USING ERRCODE = '42501';
  END IF;
  SELECT coalesce(jsonb_agg(jsonb_build_object(
    'device_id', device_id, 'name', device_name, 'last_seen', last_seen)), '[]'::jsonb)
  INTO devices FROM public.device_sessions WHERE user_id = u AND is_active;
  RETURN jsonb_build_object(
    'devices', devices, 'limit', 1,
    'can_replace', NOT EXISTS (SELECT 1 FROM public.campus_device_changes c WHERE c.user_id = u)
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.campus_replace_device(p_old_device_id text, p_new_device_id text, p_device_name text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  u uuid := auth.uid();
  session_id uuid := public.campus_device_auth_session();
  previous public.device_sessions%ROWTYPE;
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
  IF previous.device_id = p_new_device_id AND previous.auth_session_id = session_id THEN
    RETURN jsonb_build_object('ok', true, 'limit', 1);
  END IF;
  IF EXISTS (SELECT 1 FROM public.campus_device_changes c WHERE c.user_id = u) THEN
    RETURN jsonb_build_object('ok', false, 'code', 'SUPPORT_REQUIRED');
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
  INSERT INTO public.campus_device_changes (user_id, changed_at) VALUES (u, now());
  RETURN jsonb_build_object('ok', true, 'limit', 1);
END;
$$;

REVOKE ALL ON FUNCTION public.activate_device(text, text), public.campus_my_devices(),
  public.campus_replace_device(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.activate_device(text, text), public.campus_my_devices(),
  public.campus_replace_device(text, text, text) TO authenticated;

NOTIFY pgrst, 'reload schema';
COMMIT;
