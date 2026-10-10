-- AlcocerMed: acceso gratuito y suscripciones. Migración transaccional e idempotente.
BEGIN;
CREATE TABLE IF NOT EXISTS public.campus_access_settings (id boolean PRIMARY KEY DEFAULT true CHECK(id), legacy_cutoff timestamptz NOT NULL DEFAULT now());
INSERT INTO public.campus_access_settings(id) VALUES(true) ON CONFLICT DO NOTHING;
ALTER TABLE public.campus_access_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_access_settings FROM anon, authenticated;
CREATE TABLE IF NOT EXISTS public.campus_memberships (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 plan text NOT NULL CHECK(plan IN ('legacy','monthly','semester','annual')),
 starts_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz,
 CHECK(plan='legacy' OR expires_at IS NOT NULL)
);
ALTER TABLE public.campus_memberships ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_memberships FROM anon, authenticated;
-- Preserva las cuentas existentes; nunca concede acceso por metadata del usuario.
INSERT INTO public.campus_memberships(user_id,plan)
 SELECT id,'legacy' FROM auth.users WHERE created_at < (SELECT legacy_cutoff FROM public.campus_access_settings WHERE id)
 ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION public.campus_is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT EXISTS(SELECT 1 FROM auth.users WHERE id=auth.uid() AND lower(email) IN ('pichon4488@gmail.com','admin@alcocermed.com','admin@bencarson.com','rubenconcha@example.com'));
$$;
CREATE OR REPLACE FUNCTION public.campus_has_access() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT public.campus_is_admin() OR EXISTS(SELECT 1 FROM public.campus_memberships WHERE user_id=auth.uid() AND starts_at<=now() AND (expires_at IS NULL OR expires_at>now()));
$$;
CREATE TABLE IF NOT EXISTS public.campus_free_items(kind text NOT NULL,id bigint NOT NULL,PRIMARY KEY(kind,id));
ALTER TABLE public.campus_free_items ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_free_items FROM anon, authenticated;
INSERT INTO public.campus_free_items SELECT 'flashcards',id FROM public.flashcards WHERE materia='BIOLOGIA CELULAR' ORDER BY id LIMIT 5 ON CONFLICT DO NOTHING;
INSERT INTO public.campus_free_items SELECT 'banco_preguntas',id FROM public.banco_preguntas ORDER BY id LIMIT 5 ON CONFLICT DO NOTHING;
CREATE OR REPLACE FUNCTION public.campus_free_item(p_kind text,p_id bigint) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT auth.uid() IS NOT NULL AND EXISTS(SELECT 1 FROM public.campus_free_items WHERE kind=p_kind AND id=p_id);
$$;
CREATE OR REPLACE FUNCTION public.campus_access() RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('ready',true,'premium',public.campus_has_access(),'admin',public.campus_is_admin(),'flashcards',5,'maps',5,'questions',5,'expires_at',(SELECT expires_at FROM public.campus_memberships WHERE user_id=auth.uid()));
$$;
CREATE OR REPLACE FUNCTION public.campus_activate(p_email text,p_months integer) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid;
BEGIN
 IF NOT public.campus_is_admin() THEN RAISE EXCEPTION 'Solo administradores'; END IF;
 IF p_months NOT IN (1,6,12) THEN RAISE EXCEPTION 'Duración inválida'; END IF;
 SELECT id INTO uid FROM auth.users WHERE lower(email)=lower(trim(p_email));
 IF uid IS NULL THEN RAISE EXCEPTION 'El estudiante debe registrarse primero'; END IF;
 INSERT INTO public.campus_memberships(user_id,plan,starts_at,expires_at) VALUES(uid,CASE p_months WHEN 1 THEN 'monthly' WHEN 6 THEN 'semester' ELSE 'annual' END,now(),now()+make_interval(months=>p_months))
 ON CONFLICT(user_id) DO UPDATE SET plan=excluded.plan,starts_at=excluded.starts_at,expires_at=excluded.expires_at;
END; $$;
REVOKE ALL ON FUNCTION public.campus_activate(text,integer) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.campus_activate(text,integer) TO authenticated;
-- Restrictivas: se combinan con las políticas existentes sin borrarlas.
DO $$ DECLARE t text; gate text; BEGIN
 FOREACH t IN ARRAY ARRAY['flashcards','banco_preguntas','simulacros','videoclases','importar_excel_preguntas'] LOOP
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 gate := 'public.campus_has_access()';
 IF t IN ('flashcards','banco_preguntas') THEN gate:=gate||format(' OR public.campus_free_item(%L,id)',t); END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='campus_content_access') THEN
 EXECUTE format('CREATE POLICY campus_content_access ON public.%I AS RESTRICTIVE FOR SELECT TO public USING (%s)',t,gate);
 END IF;
 END LOOP;
END $$;
CREATE OR REPLACE FUNCTION public.campus_game_access(p_id uuid) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT public.campus_is_admin()
 OR EXISTS(SELECT 1 FROM public.campus_memberships WHERE user_id=auth.uid() AND starts_at<=now() AND (expires_at IS NULL OR expires_at>now()))
 OR p_id IN ('7d7b8eaa-4b8e-51cb-a9db-a666bda3d976'::uuid,'2fa17a3c-035a-50d7-afae-ed8fe3ba11fc'::uuid,'be379789-f013-4431-bb31-95b1c6f01517'::uuid);
$$;
DO $$ DECLARE t text; col text; BEGIN
 FOREACH t IN ARRAY ARRAY['evaluaciones','evaluacion_preguntas'] LOOP
 col:=CASE WHEN t='evaluaciones' THEN 'id' ELSE 'evaluacion_id' END;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='campus_game_access') THEN
 EXECUTE format('CREATE POLICY campus_game_access ON public.%I AS RESTRICTIVE FOR SELECT TO public USING (public.campus_game_access(%I))',t,col);
 END IF;
 END LOOP;
END $$;
-- El catálogo muestra nombres y cantidades, nunca respuestas bloqueadas.
CREATE OR REPLACE FUNCTION public.campus_catalog() RETURNS TABLE(materia text,tema text,total bigint,free_count bigint) LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT f.materia,f.tema,count(*),count(*) FILTER(WHERE EXISTS(SELECT 1 FROM public.campus_free_items s WHERE s.kind='flashcards' AND s.id=f.id)) FROM public.flashcards f WHERE auth.uid() IS NOT NULL GROUP BY f.materia,f.tema;
$$;
-- Aislar información personal antes de abrir el registro al público.
DO $$ DECLARE t text; col text; BEGIN
 FOREACH t IN ARRAY ARRAY['profiles','user_profiles','progreso_flashcards','progreso_videoclases','progreso_sesiones','resultados_banco','resultados_simulacros','banco_errores'] LOOP
 col:=CASE WHEN t='profiles' THEN 'id' ELSE 'user_id' END;
 EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename=t AND policyname='campus_private_rows') THEN
 EXECUTE format('CREATE POLICY campus_private_rows ON public.%I AS RESTRICTIVE FOR ALL TO public USING (auth.uid()=%I OR public.campus_is_admin()) WITH CHECK(auth.uid()=%I OR public.campus_is_admin())',t,col,col);
 END IF;
 END LOOP;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE tablename='progreso_flashcards' AND policyname='campus_own_progress') THEN
 CREATE POLICY campus_own_progress ON public.progreso_flashcards FOR ALL TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
 END IF;
 IF NOT EXISTS(SELECT 1 FROM pg_policies WHERE tablename='leads_ventas' AND policyname='campus_private_leads') THEN
 CREATE POLICY campus_private_leads ON public.leads_ventas AS RESTRICTIVE FOR SELECT TO public USING(public.campus_is_admin());
 END IF;
END $$;
NOTIFY pgrst,'reload schema';
COMMIT;
