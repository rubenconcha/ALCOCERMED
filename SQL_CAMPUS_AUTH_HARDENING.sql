BEGIN;
CREATE OR REPLACE FUNCTION public.campus_is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM auth.users u WHERE u.id=auth.uid() AND u.created_at < (SELECT legacy_cutoff FROM public.campus_access_settings WHERE id) AND lower(u.email) IN ('pichon4488@gmail.com','admin@alcocermed.com','admin@bencarson.com','rubenconcha@example.com'));
$$;
CREATE OR REPLACE FUNCTION public.admin_list_users() RETURNS TABLE(user_id uuid,email text,name text,last_seen timestamptz,created_at timestamptz) LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
 IF NOT public.campus_is_admin() THEN RAISE EXCEPTION 'not authorized'; END IF;
 RETURN QUERY SELECT u.id,u.email::text,coalesce(u.raw_user_meta_data->>'full_name',u.raw_user_meta_data->>'name',split_part(u.email,'@',1))::text,u.last_sign_in_at,u.created_at FROM auth.users u ORDER BY u.created_at DESC;
END; $$;
-- No permite que una cuenta nueva registre dispositivos de otra persona.
DO $$ DECLARE definition text; BEGIN
 SELECT pg_get_functiondef('public.register_device(uuid,text,timestamptz)'::regprocedure) INTO definition;
 IF definition NOT LIKE '%CAMPUS_AUTH_CHECK%' THEN
 definition:=replace(definition,E'BEGIN',E'BEGIN\n -- CAMPUS_AUTH_CHECK\n IF auth.uid() IS NULL OR auth.uid() <> _user_id THEN RAISE EXCEPTION ''not authorized''; END IF;');
 EXECUTE definition;
 END IF;
END $$;
NOTIFY pgrst,'reload schema';
COMMIT;
