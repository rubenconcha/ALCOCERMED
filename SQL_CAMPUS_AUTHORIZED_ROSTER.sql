-- Restricción por nómina solicitada el 26 de noviembre de 2026.
-- Los correos y respaldos se importan únicamente en el esquema privado.
-- Este archivo no contiene la nómina ni datos personales de estudiantes.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;

CREATE TABLE IF NOT EXISTS private.campus_roster_settings (
    id boolean PRIMARY KEY DEFAULT true CHECK (id),
    enabled boolean NOT NULL DEFAULT false,
    batch text NOT NULL
);
INSERT INTO private.campus_roster_settings(id,enabled,batch)
VALUES(true,false,'roster_20261126_dec18') ON CONFLICT(id) DO NOTHING;

CREATE TABLE IF NOT EXISTS private.campus_authorized_emails (
    email text PRIMARY KEY CHECK (email = lower(btrim(email)) AND position('@' in email)>1),
    is_staff boolean NOT NULL DEFAULT false,
    student_groups text[] NOT NULL DEFAULT '{}',
    starts_at timestamptz NOT NULL,
    expires_at timestamptz,
    provenance jsonb NOT NULL DEFAULT '[]'::jsonb,
    CHECK (is_staff OR (expires_at IS NOT NULL AND expires_at > starts_at)),
    CHECK (student_groups <@ ARRAY['presencial_1','presencial_2','virtual']::text[])
);

CREATE TABLE IF NOT EXISTS private.campus_roster_audit (
    batch text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now(),
    before_data jsonb NOT NULL,
    summary jsonb
);
ALTER TABLE private.campus_roster_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.campus_authorized_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.campus_roster_audit ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.campus_roster_settings,private.campus_authorized_emails,private.campus_roster_audit
FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION private.campus_email_eligible(p_user uuid,p_at timestamptz DEFAULT now())
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
SELECT CASE WHEN NOT coalesce((SELECT s.enabled FROM private.campus_roster_settings s WHERE s.id),false)
THEN true ELSE EXISTS (
    SELECT 1 FROM auth.users u JOIN private.campus_authorized_emails r ON r.email=lower(btrim(u.email))
    WHERE u.id=p_user AND u.email_confirmed_at IS NOT NULL
      AND (r.is_staff OR (r.starts_at<=p_at AND r.expires_at>p_at))
) END
$$;
REVOKE ALL ON FUNCTION private.campus_email_eligible(uuid,timestamptz) FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.campus_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
SELECT private.campus_email_eligible(auth.uid()) AND EXISTS (
    SELECT 1 FROM auth.users u WHERE u.id=auth.uid()
    AND u.created_at < (SELECT legacy_cutoff FROM public.campus_access_settings WHERE id)
    AND lower(u.email) IN ('pichon4488@gmail.com','admin@alcocermed.com','admin@bencarson.com','rubenconcha@example.com')
)
$$;

CREATE OR REPLACE FUNCTION public.campus_has_access()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
SELECT private.campus_email_eligible(auth.uid()) AND public.campus_device_session_allowed() AND (
    public.campus_is_admin() OR EXISTS (
        SELECT 1 FROM public.campus_memberships m WHERE m.user_id=auth.uid()
        AND m.plan IN ('monthly','semester','annual','lifetime','custom')
        AND m.starts_at<=now() AND (m.expires_at IS NULL OR m.expires_at>now())
    )
)
$$;

-- Evita conservar una entrada gratuita por consulta directa después de retirar el acceso.
ALTER POLICY intocables_lectura_campus ON public.intocables_esenciales USING (public.campus_has_access());

CREATE OR REPLACE FUNCTION private.campus_enroll_authorized_email()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE r private.campus_authorized_emails%ROWTYPE;
BEGIN
    IF NOT coalesce((SELECT s.enabled FROM private.campus_roster_settings s WHERE s.id),false)
       OR NEW.email_confirmed_at IS NULL THEN RETURN NEW; END IF;
    SELECT * INTO r FROM private.campus_authorized_emails WHERE email=lower(btrim(NEW.email));
    IF NOT FOUND THEN RETURN NEW; END IF;
    IF r.is_staff THEN
        INSERT INTO public.campus_memberships(user_id,plan,starts_at,expires_at)
        VALUES(NEW.id,'lifetime',now(),NULL) ON CONFLICT(user_id) DO NOTHING;
        RETURN NEW;
    END IF;
    IF r.expires_at<=now() THEN RETURN NEW; END IF;
    INSERT INTO public.campus_memberships(user_id,plan,starts_at,expires_at)
    VALUES(NEW.id,'custom',r.starts_at,r.expires_at)
    ON CONFLICT(user_id) DO UPDATE SET plan=EXCLUDED.plan,starts_at=EXCLUDED.starts_at,expires_at=EXCLUDED.expires_at;
    INSERT INTO public.campus_atlas_subscription_grants(user_id,starts_at,expires_at)
    VALUES(NEW.id,r.starts_at,r.expires_at)
    ON CONFLICT(user_id) DO UPDATE SET starts_at=EXCLUDED.starts_at,expires_at=EXCLUDED.expires_at;
    IF cardinality(r.student_groups)=1 THEN
        INSERT INTO public.campus_ben_carson_groups(user_id,student_group) VALUES(NEW.id,r.student_groups[1])
        ON CONFLICT(user_id) DO UPDATE SET student_group=EXCLUDED.student_group;
    END IF;
    RETURN NEW;
END
$$;
REVOKE ALL ON FUNCTION private.campus_enroll_authorized_email() FROM PUBLIC,anon,authenticated;
CREATE TRIGGER campus_enroll_authorized_email
AFTER INSERT OR UPDATE OF email,email_confirmed_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION private.campus_enroll_authorized_email();

NOTIFY pgrst, 'reload schema';
