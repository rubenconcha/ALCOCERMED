-- Evita que el panel anuncie una activación que la nómina privada no permite.
-- Requiere la migración SQL_CAMPUS_AUTHORIZED_ROSTER.sql.
-- No cambia nómina, roles, reglas de acceso o datos existentes.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE OR REPLACE FUNCTION public.campus_admin_save_subscription(
  p_email text, p_scope text, p_start date, p_end date
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  student_id uuid;
  access_start timestamptz;
  access_end timestamptz;
  roster_enabled boolean;
  roster_entry private.campus_authorized_emails%ROWTYPE;
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

  -- Verifica la misma cuenta y toda la vigencia solicitada antes de modificar
  -- suscripciones. No añade cuentas a la nómina ni cambia excepciones.
  SELECT settings.enabled INTO roster_enabled
  FROM private.campus_roster_settings settings WHERE settings.id FOR SHARE;
  IF roster_enabled IS TRUE THEN
    IF account.email_confirmed_at IS NULL THEN
      RAISE EXCEPTION 'El estudiante aún no confirmó ese correo. No se guardó la suscripción.'
        USING ERRCODE = '22023';
    END IF;
    SELECT r.* INTO roster_entry
    FROM private.campus_authorized_emails r WHERE r.email = lower(btrim(account.email)) FOR SHARE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Este correo no está en la nómina autorizada. No se guardó la suscripción.'
        USING ERRCODE = '22023';
    END IF;
    IF NOT roster_entry.is_staff
      AND (access_start < roster_entry.starts_at OR access_end > roster_entry.expires_at) THEN
      RAISE EXCEPTION 'Las fechas elegidas exceden la vigencia autorizada en la nómina. No se guardó la suscripción.'
        USING ERRCODE = '22023';
    END IF;
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

NOTIFY pgrst, 'reload schema';
COMMIT;
