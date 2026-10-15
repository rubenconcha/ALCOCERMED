-- Explicit atlas entitlements tied to a paid membership and a finite period.
-- Existing administrator and course-enrollment access is preserved.
BEGIN;
CREATE TABLE IF NOT EXISTS public.campus_atlas_subscription_grants (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 starts_at timestamptz NOT NULL,
 expires_at timestamptz NOT NULL,
 CHECK (expires_at > starts_at)
);
ALTER TABLE public.campus_atlas_subscription_grants ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_atlas_subscription_grants FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.campus_atlas_access() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('ready',true,'allowed',
  public.campus_is_admin()
  OR EXISTS (
   SELECT 1 FROM public.campus_course_enrollments e
   WHERE e.user_id=auth.uid() AND e.active
  )
  OR (
   public.campus_has_access()
   AND EXISTS (
    SELECT 1 FROM public.campus_atlas_subscription_grants g
    WHERE g.user_id=auth.uid()
      AND g.starts_at<=now() AND g.expires_at>now()
   )
  )
 );
$$;
REVOKE ALL ON FUNCTION public.campus_atlas_access() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.campus_atlas_access() TO authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
