-- Production-safe verification: every temporary activation is rolled back.
BEGIN;
DO $$
DECLARE admin_id uuid; student_id uuid; student_email text; denied boolean := false;
BEGIN
 SELECT id INTO admin_id FROM auth.users WHERE lower(email)='pichon4488@gmail.com';
 SELECT id,email INTO student_id,student_email FROM auth.users WHERE lower(email) NOT IN ('pichon4488@gmail.com','admin@alcocermed.com','admin@bencarson.com','rubenconcha@example.com') ORDER BY created_at LIMIT 1;
 IF admin_id IS NULL OR student_id IS NULL THEN RAISE EXCEPTION 'No se encontraron las cuentas de prueba'; END IF;
 PERFORM set_config('request.jwt.claim.sub',admin_id::text,true);
 PERFORM public.campus_activate(student_email,0);
 IF NOT EXISTS(SELECT 1 FROM public.campus_memberships WHERE user_id=student_id AND plan='lifetime' AND expires_at IS NULL) THEN RAISE EXCEPTION 'El acceso vitalicio tiene vencimiento'; END IF;
 PERFORM set_config('request.jwt.claim.sub',student_id::text,true);
 IF NOT public.campus_has_access() OR NOT public.campus_game_access('00000000-0000-0000-0000-000000000000'::uuid) OR NOT (public.campus_access()->>'premium')::boolean THEN RAISE EXCEPTION 'El acceso vitalicio no desbloquea el campus'; END IF;
 BEGIN
  PERFORM public.campus_activate(student_email,0);
 EXCEPTION WHEN raise_exception THEN
  IF SQLERRM='Solo administradores' THEN denied:=true; ELSE RAISE; END IF;
 END;
 IF NOT denied THEN RAISE EXCEPTION 'Un estudiante puede activar su propio acceso'; END IF;
 PERFORM set_config('request.jwt.claim.sub',admin_id::text,true);
 PERFORM public.campus_activate(student_email,1);
 IF NOT EXISTS(SELECT 1 FROM public.campus_memberships WHERE user_id=student_id AND plan='monthly' AND expires_at=now()+interval '1 month') THEN RAISE EXCEPTION 'Falló el plan mensual'; END IF;
 PERFORM public.campus_activate(student_email,6);
 IF NOT EXISTS(SELECT 1 FROM public.campus_memberships WHERE user_id=student_id AND plan='semester' AND expires_at=now()+interval '6 months') THEN RAISE EXCEPTION 'Falló el plan semestral'; END IF;
END;
$$;
ROLLBACK;
