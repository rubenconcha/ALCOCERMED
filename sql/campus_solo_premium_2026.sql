-- AlcocerMed: ingreso exclusivo con Premium completo vigente.
-- Aplicar después del frontend v206 (Google se valida después de autenticar).
-- Conserva cuentas, suscripciones, permisos de administradores y datos de estudio.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

CREATE OR REPLACE FUNCTION public.campus_free_item(p_kind text, p_id bigint)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
SELECT false
$function$;

CREATE OR REPLACE FUNCTION public.campus_game_access(p_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
SELECT public.campus_has_access()
$function$;

CREATE OR REPLACE FUNCTION public.campus_has_video_access()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
SELECT public.campus_has_access()
$function$;

CREATE OR REPLACE FUNCTION public.campus_atlas_access()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
SELECT jsonb_build_object('ready', public.campus_has_access(),
 'allowed', public.campus_has_access() AND (
  public.campus_is_admin()
  OR EXISTS (SELECT 1 FROM public.campus_course_enrollments e WHERE e.user_id = auth.uid() AND e.active)
  OR EXISTS (SELECT 1 FROM public.campus_atlas_subscription_grants g
   WHERE g.user_id = auth.uid() AND g.starts_at <= now() AND g.expires_at > now())
 ))
$function$;

CREATE OR REPLACE FUNCTION public.campus_catalog()
 RETURNS TABLE(materia text, tema text, total bigint, free_count bigint)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
SELECT f.materia, f.tema, count(*), 0::bigint
 FROM public.flashcards f
 LEFT JOIN public.campus_free_topics t ON t.materia = f.materia AND t.tema = f.tema
 WHERE public.campus_has_access()
 GROUP BY f.materia, f.tema
 ORDER BY f.materia, coalesce(min(t.chapter_order), 999), f.tema
$function$;

CREATE OR REPLACE FUNCTION public.campus_access()
 RETURNS jsonb
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
SELECT CASE
 WHEN auth.uid() IS NULL THEN
  jsonb_build_object('ready', false, 'premium', false, 'atlas', false, 'videos', false, 'code', 'NOT_AUTHENTICATED')
 WHEN NOT public.campus_device_session_allowed() THEN
  jsonb_build_object('ready', false, 'premium', false, 'atlas', false, 'videos', false, 'code', 'DEVICE_LIMIT')
 WHEN NOT public.campus_has_access() THEN
  jsonb_build_object('ready', false, 'premium', false, 'atlas', false, 'videos', false, 'code', 'PREMIUM_REQUIRED')
 ELSE jsonb_build_object(
  'ready', true, 'premium', true, 'admin', public.campus_is_admin(),
  'atlas', public.campus_atlas_access()->'allowed', 'videos', true,
  'trial', false, 'free_topics_per_subject', 0,
  'expires_at', CASE WHEN public.campus_is_admin() THEN NULL ELSE
   (SELECT m.expires_at FROM public.campus_memberships m WHERE m.user_id = auth.uid()) END)
 END
$function$;

CREATE OR REPLACE FUNCTION public.check_device_active(p_device_id text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
 IF NOT FOUND THEN
  RETURN json_build_object('active', false, 'limit', 1);
 END IF;
 IF NOT public.campus_has_access() THEN
  RETURN json_build_object('active', false, 'code', 'PREMIUM_REQUIRED', 'limit', 1);
 END IF;
 RETURN json_build_object('active', true, 'limit', 1);
END;
$function$;

NOTIFY pgrst, 'reload schema';
COMMIT;
SELECT 'premium_only_applied' AS status;
