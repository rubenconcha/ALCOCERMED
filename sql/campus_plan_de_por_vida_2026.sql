-- Adds lifetime access without changing existing memberships or free demos.
BEGIN;
ALTER TABLE public.campus_memberships DROP CONSTRAINT IF EXISTS campus_memberships_plan_check;
ALTER TABLE public.campus_memberships DROP CONSTRAINT IF EXISTS campus_memberships_check;
ALTER TABLE public.campus_memberships ADD CONSTRAINT campus_memberships_plan_check CHECK(plan IN ('legacy','monthly','semester','annual','lifetime'));
ALTER TABLE public.campus_memberships ADD CONSTRAINT campus_memberships_check CHECK(plan IN ('legacy','lifetime') OR expires_at IS NOT NULL);

CREATE OR REPLACE FUNCTION public.campus_has_access() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT public.campus_is_admin() OR EXISTS (
  SELECT 1 FROM public.campus_memberships m WHERE m.user_id=auth.uid()
  AND m.plan IN ('monthly','semester','annual','lifetime') AND m.starts_at<=now()
  AND (m.expires_at IS NULL OR m.expires_at>now())
 );
$$;
CREATE OR REPLACE FUNCTION public.campus_game_access(p_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT public.campus_has_access() OR p_id IN (
  '7d7b8eaa-4b8e-51cb-a9db-a666bda3d976'::uuid,
  '2fa17a3c-035a-50d7-afae-ed8fe3ba11fc'::uuid,
  'be379789-f013-4431-bb31-95b1c6f01517'::uuid,
  '113fd5dc-8283-9838-9557-f032f103b5ef'::uuid,
  'a7d3b295-dc3a-6c7a-6cc4-743cdd9724ae'::uuid,
  '29d04e4f-2469-1ff1-c583-9d8f2105e363'::uuid
 );
$$;
CREATE OR REPLACE FUNCTION public.campus_activate(p_email text,p_months integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid;
BEGIN
 IF NOT public.campus_is_admin() THEN RAISE EXCEPTION 'Solo administradores'; END IF;
 IF p_months IS NULL OR p_months NOT IN (0,1,6,12) THEN RAISE EXCEPTION 'Duración inválida'; END IF;
 SELECT id INTO uid FROM auth.users WHERE lower(email)=lower(trim(p_email));
 IF uid IS NULL THEN RAISE EXCEPTION 'El estudiante debe registrarse primero'; END IF;
 INSERT INTO public.campus_memberships(user_id,plan,starts_at,expires_at)
 VALUES(uid,CASE p_months WHEN 0 THEN 'lifetime' WHEN 1 THEN 'monthly' WHEN 6 THEN 'semester' ELSE 'annual' END,now(),CASE WHEN p_months=0 THEN NULL ELSE now()+make_interval(months=>p_months) END)
 ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan,starts_at=excluded.starts_at,expires_at=excluded.expires_at;
END;
$$;
REVOKE ALL ON FUNCTION public.campus_activate(text,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.campus_activate(text,integer) TO authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
