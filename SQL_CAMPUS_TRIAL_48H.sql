-- Prueba completa de 48 horas desde el registro. No modifica los planes pagados.
BEGIN;
CREATE OR REPLACE FUNCTION public.campus_trial_end() RETURNS timestamptz LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT u.created_at + interval '48 hours' FROM auth.users u
 WHERE u.id=auth.uid() AND u.created_at >= (SELECT legacy_cutoff FROM public.campus_access_settings WHERE id)
 AND NOT EXISTS(SELECT 1 FROM public.campus_memberships m WHERE m.user_id=u.id);
$$;
CREATE OR REPLACE FUNCTION public.campus_has_access() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT public.campus_is_admin() OR EXISTS(SELECT 1 FROM public.campus_memberships WHERE user_id=auth.uid() AND starts_at<=now() AND (expires_at IS NULL OR expires_at>now())) OR coalesce(public.campus_trial_end()>now(),false);
$$;
CREATE OR REPLACE FUNCTION public.campus_free_item(p_kind text,p_id bigint) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$ SELECT false; $$;
CREATE OR REPLACE FUNCTION public.campus_access() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('ready',true,'premium',public.campus_has_access(),'admin',public.campus_is_admin(),'trial',coalesce(public.campus_trial_end()>now(),false),'expires_at',coalesce((SELECT expires_at FROM public.campus_memberships WHERE user_id=auth.uid()),public.campus_trial_end()));
$$;
CREATE OR REPLACE FUNCTION public.campus_catalog() RETURNS TABLE(materia text,tema text,total bigint,free_count bigint) LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$ SELECT f.materia,f.tema,count(*),0::bigint FROM public.flashcards f WHERE auth.uid() IS NOT NULL GROUP BY f.materia,f.tema; $$;
NOTIFY pgrst,'reload schema';
COMMIT;
