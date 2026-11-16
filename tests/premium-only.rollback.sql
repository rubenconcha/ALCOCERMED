-- Run inside a transaction AFTER the migration's function definitions and BEFORE
-- ROLLBACK. Uses an existing valid device/session without exposing identifiers.
-- Membership and last_seen changes are visible only in this transaction.
DO $test$
DECLARE
 fixture record;
 result jsonb;
BEGIN
 PERFORM set_config('request.jwt.claims', '{}', true);
 IF public.campus_access()->>'code' IS DISTINCT FROM 'NOT_AUTHENTICATED'
  OR public.campus_game_access('7d7b8eaa-4b8e-51cb-a9db-a666bda3d976')
  OR public.campus_free_item('flashcards', 1)
 THEN RAISE EXCEPTION 'Anonymous access must be denied'; END IF;

 SELECT d.user_id, d.device_id, d.auth_session_id INTO STRICT fixture
 FROM public.device_sessions d
 JOIN auth.sessions s ON s.id = d.auth_session_id AND s.user_id = d.user_id
 JOIN auth.users u ON u.id = d.user_id
 JOIN public.campus_memberships m ON m.user_id = d.user_id
 WHERE d.is_active AND (s.not_after IS NULL OR s.not_after > now())
  AND m.plan IN ('monthly','semester','annual','lifetime','custom')
  AND m.starts_at <= now() AND (m.expires_at IS NULL OR m.expires_at > now())
  AND lower(u.email) NOT IN ('pichon4488@gmail.com','admin@alcocermed.com','admin@bencarson.com','rubenconcha@example.com')
 ORDER BY d.last_seen DESC LIMIT 1;
 PERFORM set_config('request.jwt.claims', jsonb_build_object(
  'sub', fixture.user_id, 'session_id', fixture.auth_session_id, 'role', 'authenticated')::text, true);
 result := public.campus_access();
 IF result->>'premium' IS DISTINCT FROM 'true' OR result->>'ready' IS DISTINCT FROM 'true'
  OR NOT public.campus_has_video_access()
  OR (public.check_device_active(fixture.device_id)::jsonb)->>'active' IS DISTINCT FROM 'true'
 THEN RAISE EXCEPTION 'Current full Premium must be preserved'; END IF;
 SET LOCAL ROLE authenticated;
 IF NOT EXISTS(SELECT 1 FROM public.flashcards LIMIT 1)
 THEN RAISE EXCEPTION 'Premium must retain access through RLS'; END IF;
 RESET ROLE;

 UPDATE public.campus_memberships SET plan='annual', starts_at=now()-interval '2 days',
  expires_at=now()-interval '1 day' WHERE user_id=fixture.user_id;
 result := public.campus_access();
 IF result->>'code' IS DISTINCT FROM 'PREMIUM_REQUIRED'
  OR public.campus_has_video_access()
  OR public.campus_atlas_access()->>'allowed' IS DISTINCT FROM 'false'
  OR public.campus_game_access('7d7b8eaa-4b8e-51cb-a9db-a666bda3d976')
  OR (public.check_device_active(fixture.device_id)::jsonb)->>'code' IS DISTINCT FROM 'PREMIUM_REQUIRED'
 THEN RAISE EXCEPTION 'Expired membership must revoke all access and the open session'; END IF;
 SET LOCAL ROLE authenticated;
 IF EXISTS(SELECT 1 FROM public.flashcards LIMIT 1)
  OR EXISTS(SELECT 1 FROM public.videoclases LIMIT 1)
  OR EXISTS(SELECT 1 FROM public.evaluaciones LIMIT 1)
  OR EXISTS(SELECT 1 FROM public.campus_catalog() LIMIT 1)
 THEN RAISE EXCEPTION 'RLS must deny expired accounts including former samples'; END IF;
 RESET ROLE;

 UPDATE public.campus_memberships SET starts_at=now()+interval '1 day',
  expires_at=now()+interval '1 year' WHERE user_id=fixture.user_id;
 IF public.campus_access()->>'code' IS DISTINCT FROM 'PREMIUM_REQUIRED'
 THEN RAISE EXCEPTION 'Future membership must not open the campus early'; END IF;
 UPDATE public.campus_memberships SET plan='legacy', starts_at=now()-interval '1 day',
  expires_at=NULL WHERE user_id=fixture.user_id;
 IF public.campus_access()->>'code' IS DISTINCT FROM 'PREMIUM_REQUIRED'
 THEN RAISE EXCEPTION 'Legacy/free accounts must not enter'; END IF;
 UPDATE public.campus_memberships SET plan='cancelled' WHERE user_id=fixture.user_id;
 IF public.campus_access()->>'code' IS DISTINCT FROM 'PREMIUM_REQUIRED'
 THEN RAISE EXCEPTION 'Cancelled membership must not enter'; END IF;
 PERFORM set_config('request.jwt.claims', jsonb_build_object(
  'sub', fixture.user_id, 'session_id', '00000000-0000-0000-0000-000000000000', 'role', 'authenticated')::text, true);
 IF public.campus_access()->>'code' IS DISTINCT FROM 'DEVICE_LIMIT'
 THEN RAISE EXCEPTION 'An unauthorized device must remain denied'; END IF;
END;
$test$;
ROLLBACK;
SELECT 'premium_only_rollback_tests_passed' AS status;
