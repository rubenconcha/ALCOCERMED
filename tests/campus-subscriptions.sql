-- Ejecutar en una base de prueba con campus_suscripciones_fechas_2026.sql aplicado.
BEGIN;

CREATE FUNCTION pg_temp.expect_subscription(label text, result boolean) RETURNS text
LANGUAGE plpgsql AS $$
BEGIN
  IF result IS DISTINCT FROM true THEN RAISE EXCEPTION 'Falló: %', label; END IF;
  RETURN label;
END;
$$;

INSERT INTO auth.users (id, email, email_confirmed_at, created_at) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'pichon4488@gmail.com', now(), '-infinity'),
  ('a0000000-0000-4000-8000-000000000002', 'qa-suscripcion@example.invalid', now(), now());
INSERT INTO auth.sessions (id, user_id) VALUES
  ('a1000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002'),
  ('a1000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000002');
INSERT INTO public.device_sessions (user_id, device_id, device_name, is_active, last_seen, auth_session_id)
VALUES ('a0000000-0000-4000-8000-000000000002', 'qa-membership-pc', 'PC', true, now(), 'a1000000-0000-4000-8000-000000000002');
INSERT INTO public.campus_memberships(user_id, plan)
VALUES ('a0000000-0000-4000-8000-000000000002', 'legacy');

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000001"}', true);
SELECT pg_temp.expect_subscription('no aparecen registros legacy', NOT EXISTS (
  SELECT 1 FROM public.campus_admin_list_subscriptions()
));
SELECT pg_temp.expect_subscription('el inicio futuro queda programado',
  public.campus_admin_save_subscription('qa-suscripcion@example.invalid', 'full', current_date + 5, current_date + 15)->>'status' = 'scheduled'
);

SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000002","session_id":"a1000000-0000-4000-8000-000000000002"}', true);
SELECT pg_temp.expect_subscription('el plan programado todavía no concede acceso', NOT public.campus_has_access()
  AND NOT public.campus_has_video_access() AND public.campus_atlas_access()->>'allowed' = 'false');
DO $$
BEGIN
  BEGIN
    PERFORM public.campus_admin_list_subscriptions();
    RAISE EXCEPTION 'Un estudiante pudo leer la lista';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM public.campus_admin_save_subscription('qa-suscripcion@example.invalid', 'full', current_date, current_date);
    RAISE EXCEPTION 'Un estudiante pudo activar un plan';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
  BEGIN
    PERFORM public.campus_admin_remove_subscription('qa-suscripcion@example.invalid', 'all');
    RAISE EXCEPTION 'Un estudiante pudo cancelar un plan';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END;
$$;

SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000001"}', true);
DO $$
BEGIN
  BEGIN
    PERFORM public.campus_admin_save_subscription('qa-suscripcion@example.invalid', 'full', current_date + 1, current_date);
    RAISE EXCEPTION 'Se aceptaron fechas invertidas';
  EXCEPTION WHEN invalid_parameter_value THEN NULL;
  END;
  BEGIN
    PERFORM public.campus_admin_save_subscription('qa-inexistente@example.invalid', 'full', current_date, current_date);
    RAISE EXCEPTION 'Se aceptó un correo sin cuenta';
  EXCEPTION WHEN no_data_found THEN NULL;
  END;
END;
$$;
SELECT pg_temp.expect_subscription('el último día completo está incluido en Bolivia',
  public.campus_admin_save_subscription(' QA-SUSCRIPCION@EXAMPLE.INVALID ', 'videos',
    (now() AT TIME ZONE 'America/La_Paz')::date, (now() AT TIME ZONE 'America/La_Paz')::date
  )->>'status' = 'active'
);
SELECT pg_temp.expect_subscription('la lista conserva fechas, alcance y estado', (
  SELECT count(*) = 2 AND count(*) FILTER (WHERE scope = 'videos' AND status = 'active'
    AND starts_on = (now() AT TIME ZONE 'America/La_Paz')::date AND ends_on = starts_on) = 1
  FROM public.campus_admin_list_subscriptions() WHERE email = 'qa-suscripcion@example.invalid'
));

SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000002","session_id":"a1000000-0000-4000-8000-000000000002"}', true);
SELECT pg_temp.expect_subscription('solo videos no habilita la plataforma, juegos ni atlas',
  public.campus_access()->>'videos' = 'true' AND public.campus_access()->>'premium' = 'false'
  AND NOT public.campus_game_access('00000000-0000-4000-8000-000000000000')
  AND public.campus_atlas_access()->>'allowed' = 'false'
);
SELECT pg_temp.expect_subscription('la política de videoclases permite leer el catálogo', EXISTS (SELECT 1 FROM public.videoclases));
SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000002","session_id":"a1000000-0000-4000-8000-000000000003"}', true);
SELECT pg_temp.expect_subscription('la sesión sin dispositivo autorizado no abre videos',
  NOT public.campus_has_video_access() AND NOT EXISTS (SELECT 1 FROM public.videoclases)
);
RESET ROLE;
SELECT pg_temp.expect_subscription('las tablas y las funciones de gestión son privadas',
  NOT has_table_privilege('authenticated', 'public.campus_video_subscription_grants', 'SELECT') AND
  NOT has_function_privilege('anon', 'public.campus_admin_list_subscriptions()', 'EXECUTE') AND
  NOT has_function_privilege('anon', 'public.campus_admin_save_subscription(text,text,date,date)', 'EXECUTE') AND
  NOT has_function_privilege('anon', 'public.campus_admin_remove_subscription(text,text)', 'EXECUTE')
);

SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000001"}', true);
SELECT public.campus_admin_save_subscription('qa-suscripcion@example.invalid', 'full', current_date - 1, current_date + 1);
SELECT pg_temp.expect_subscription('la baja de solo videos conserva el plan completo',
  public.campus_admin_remove_subscription('qa-suscripcion@example.invalid', 'videos') = '{"full":false,"videos":true}'::jsonb
);
SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000002","session_id":"a1000000-0000-4000-8000-000000000002"}', true);
SELECT pg_temp.expect_subscription('el plan completo abre plataforma, juegos, atlas y videos',
  public.campus_has_access() AND public.campus_game_access('00000000-0000-4000-8000-000000000000')
  AND public.campus_atlas_access()->>'allowed' = 'true' AND public.campus_has_video_access()
);
SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000001"}', true);
SELECT public.campus_admin_save_subscription('qa-suscripcion@example.invalid', 'videos', current_date - 1, current_date + 1);
SELECT pg_temp.expect_subscription('la baja completa conserva la concesión independiente de videos',
  public.campus_admin_remove_subscription('qa-suscripcion@example.invalid', 'full') = '{"full":true,"videos":false}'::jsonb
);
SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000002","session_id":"a1000000-0000-4000-8000-000000000002"}', true);
SELECT pg_temp.expect_subscription('al retirar el plan completo solo queda videos',
  NOT public.campus_has_access() AND public.campus_has_video_access() AND public.campus_atlas_access()->>'allowed' = 'false'
);
SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000001"}', true);
SELECT pg_temp.expect_subscription('quitar ambos corta el acceso vigente restante',
  public.campus_admin_remove_subscription('qa-suscripcion@example.invalid', 'all') = '{"full":false,"videos":true}'::jsonb
);
SELECT pg_temp.expect_subscription('repetir la baja no cambia otro acceso',
  public.campus_admin_remove_subscription('qa-suscripcion@example.invalid', 'all') = '{"full":false,"videos":false}'::jsonb
);
SELECT pg_temp.expect_subscription('la lista muestra ambos registros como quitados',
  (SELECT count(*) = 2 AND bool_and(status = 'cancelled') FROM public.campus_admin_list_subscriptions())
);
SELECT public.campus_admin_save_subscription('qa-suscripcion@example.invalid', 'videos', current_date - 3, current_date - 2);
SELECT set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000002","session_id":"a1000000-0000-4000-8000-000000000002"}', true);
SELECT pg_temp.expect_subscription('un período vencido no abre el catálogo',
  NOT public.campus_has_video_access() AND NOT EXISTS (SELECT 1 FROM public.videoclases)
);
RESET ROLE;
INSERT INTO public.campus_course_enrollments (user_id, course_name, mode)
VALUES ('a0000000-0000-4000-8000-000000000002', 'Curso de prueba', 'virtual');
SET LOCAL ROLE authenticated;
SELECT pg_temp.expect_subscription('el atlas por curso conserva su acceso independiente', public.campus_atlas_access()->>'allowed' = 'true');
ROLLBACK;
