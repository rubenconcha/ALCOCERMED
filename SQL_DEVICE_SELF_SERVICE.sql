BEGIN;
CREATE TABLE IF NOT EXISTS public.campus_device_changes (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 changed_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.campus_device_changes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_device_changes FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.campus_my_devices() RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE u uuid:=auth.uid(); v_next timestamptz; v_devices jsonb;
BEGIN
 IF u IS NULL THEN RAISE EXCEPTION 'Inicia sesión para ver tus dispositivos'; END IF;
 SELECT changed_at+interval '7 days' INTO v_next FROM public.campus_device_changes WHERE user_id=u;
 SELECT coalesce(jsonb_agg(jsonb_build_object('device_id',device_id,'name',device_name,'last_seen',last_seen) ORDER BY last_seen DESC),'[]'::jsonb)
 INTO v_devices FROM public.device_sessions WHERE user_id=u AND is_active=true;
 RETURN jsonb_build_object('devices',v_devices,'limit',2,'next_change_at',v_next,'can_replace',v_next IS NULL OR v_next<=now());
END $$;

CREATE OR REPLACE FUNCTION public.campus_replace_device(p_old_device_id text,p_new_device_id text,p_device_name text) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE u uuid:=auth.uid(); v_last timestamptz; v_verified boolean; v_count integer;
BEGIN
 IF u IS NULL THEN RETURN jsonb_build_object('ok',false,'code','NOT_AUTHENTICATED'); END IF;
 -- Only a fresh email OTP/magic-link authentication proves access to the inbox.
 SELECT EXISTS(SELECT 1 FROM jsonb_array_elements(coalesce(auth.jwt()->'amr','[]'::jsonb)) a
 WHERE a->>'method'='otp' AND (a->>'timestamp')::numeric BETWEEN extract(epoch FROM now()-interval '10 minutes') AND extract(epoch FROM now()+interval '30 seconds')) INTO v_verified;
 IF NOT v_verified THEN RETURN jsonb_build_object('ok',false,'code','EMAIL_VERIFICATION_REQUIRED'); END IF;
 IF p_new_device_id IS NULL OR length(btrim(p_new_device_id))=0 OR length(p_new_device_id)>128 OR p_old_device_id IS NULL OR p_old_device_id=p_new_device_id THEN
 RETURN jsonb_build_object('ok',false,'code','INVALID_DEVICE'); END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(u::text,0));
 SELECT changed_at INTO v_last FROM public.campus_device_changes WHERE user_id=u;
 IF v_last>now()-interval '7 days' THEN RETURN jsonb_build_object('ok',false,'code','CHANGE_COOLDOWN','next_change_at',v_last+interval '7 days'); END IF;
 IF NOT EXISTS(SELECT 1 FROM public.device_sessions WHERE user_id=u AND device_id=p_old_device_id AND is_active=true)
 OR EXISTS(SELECT 1 FROM public.device_sessions WHERE user_id=u AND device_id=p_new_device_id AND is_active=true) THEN
 RETURN jsonb_build_object('ok',false,'code','DEVICE_CHANGED'); END IF;
 SELECT count(*) INTO v_count FROM public.device_sessions WHERE user_id=u AND is_active=true;
 IF v_count>2 THEN RETURN jsonb_build_object('ok',false,'code','DEVICE_LIMIT'); END IF;
 UPDATE public.device_sessions SET is_active=false WHERE user_id=u AND device_id=p_old_device_id;
 INSERT INTO public.device_sessions(user_id,device_id,device_name,is_active,last_seen)
 VALUES(u,p_new_device_id,left(coalesce(nullif(btrim(p_device_name),''),'Navegador'),80),true,now())
 ON CONFLICT(user_id,device_id) DO UPDATE SET is_active=true,last_seen=now(),device_name=excluded.device_name;
 INSERT INTO public.campus_device_changes(user_id,changed_at) VALUES(u,now())
 ON CONFLICT(user_id) DO UPDATE SET changed_at=excluded.changed_at;
 RETURN jsonb_build_object('ok',true,'limit',2,'next_change_at',now()+interval '7 days');
END $$;
REVOKE ALL ON FUNCTION public.campus_my_devices() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.campus_replace_device(text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.campus_my_devices() TO authenticated;
GRANT EXECUTE ON FUNCTION public.campus_replace_device(text,text,text) TO authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
