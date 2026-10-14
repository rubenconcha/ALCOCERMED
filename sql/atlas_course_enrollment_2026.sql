-- Course enrolment is independent of a campus subscription or account creation.
BEGIN;
CREATE TABLE IF NOT EXISTS public.campus_course_enrollments (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 course_name text NOT NULL CHECK(length(trim(course_name)) BETWEEN 2 AND 120),
 mode text NOT NULL CHECK(mode IN ('virtual','presencial')),
 active boolean NOT NULL DEFAULT true,
 verified_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
 verified_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,course_name,mode)
);
ALTER TABLE public.campus_course_enrollments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.campus_course_enrollments FROM anon,authenticated;

CREATE OR REPLACE FUNCTION public.campus_atlas_access() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
 SELECT jsonb_build_object('ready',true,'allowed',
  public.campus_is_admin() OR EXISTS(
   SELECT 1 FROM public.campus_course_enrollments e WHERE e.user_id=auth.uid() AND e.active
  ));
$$;
REVOKE ALL ON FUNCTION public.campus_atlas_access() FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.campus_atlas_access() TO authenticated;

CREATE OR REPLACE FUNCTION public.campus_set_course_enrollment(
 p_email text,p_course text,p_mode text,p_active boolean
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
DECLARE uid uuid;
BEGIN
 IF NOT public.campus_is_admin() THEN RAISE EXCEPTION 'Solo administradores'; END IF;
 IF p_mode IS NULL OR p_mode NOT IN ('virtual','presencial') OR p_active IS NULL
    OR p_course IS NULL OR length(trim(p_course)) NOT BETWEEN 2 AND 120 THEN
  RAISE EXCEPTION 'Completa el curso y su modalidad';
 END IF;
 SELECT id INTO uid FROM auth.users WHERE lower(email)=lower(trim(p_email));
 IF uid IS NULL THEN RAISE EXCEPTION 'El estudiante debe crear su cuenta con ese correo primero'; END IF;
 INSERT INTO public.campus_course_enrollments(user_id,course_name,mode,active,verified_by,verified_at)
 VALUES(uid,trim(p_course),p_mode,p_active,auth.uid(),now())
 ON CONFLICT(user_id,course_name,mode) DO UPDATE
 SET active=excluded.active,verified_by=excluded.verified_by,verified_at=excluded.verified_at;
END;
$$;
REVOKE ALL ON FUNCTION public.campus_set_course_enrollment(text,text,text,boolean) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.campus_set_course_enrollment(text,text,text,boolean) TO authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
