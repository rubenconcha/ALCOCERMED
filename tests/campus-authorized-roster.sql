-- Run inside a transaction after a private roster import. No student emails in Git.
DO $$
DECLARE u record; tested_student boolean:=false; eligible boolean;
BEGIN
    IF NOT (SELECT enabled FROM private.campus_roster_settings WHERE id) THEN RAISE EXCEPTION 'Roster not enabled'; END IF;
    IF (SELECT count(*) FROM private.campus_authorized_emails WHERE NOT is_staff)<>169 THEN RAISE EXCEPTION 'Unexpected roster size'; END IF;
    IF (SELECT count(*) FROM private.campus_authorized_emails WHERE is_staff)<>9 THEN RAISE EXCEPTION 'Staff exceptions differ'; END IF;
    IF EXISTS (
        SELECT 1 FROM auth.users a JOIN private.campus_authorized_emails r ON r.email=lower(btrim(a.email))
        LEFT JOIN public.campus_memberships m ON m.user_id=a.id
        WHERE NOT r.is_staff AND (m.user_id IS NULL OR m.plan<>'custom' OR m.starts_at<>r.starts_at OR m.expires_at<>r.expires_at)
    ) THEN RAISE EXCEPTION 'A listed student is missing the correct membership'; END IF;
    IF EXISTS (
        SELECT 1 FROM auth.users a LEFT JOIN private.campus_authorized_emails r ON r.email=lower(btrim(a.email))
        JOIN public.campus_memberships m ON m.user_id=a.id WHERE r.email IS NULL AND m.plan<>'cancelled'
    ) THEN RAISE EXCEPTION 'An excluded account still has a membership'; END IF;
    IF EXISTS (
        SELECT 1 FROM auth.users a JOIN private.campus_authorized_emails r ON r.email=lower(btrim(a.email))
        LEFT JOIN public.campus_atlas_subscription_grants g ON g.user_id=a.id
        WHERE NOT r.is_staff AND (g.user_id IS NULL OR g.expires_at<>r.expires_at)
    ) THEN RAISE EXCEPTION 'Atlas dates differ from the student deadline'; END IF;
    IF has_table_privilege('anon','private.campus_authorized_emails','SELECT')
       OR has_table_privilege('authenticated','private.campus_authorized_emails','SELECT')
       OR has_schema_privilege('anon','private','USAGE')
       OR has_schema_privilege('authenticated','private','USAGE') THEN RAISE EXCEPTION 'Private roster exposed'; END IF;

    FOR u IN SELECT a.id,a.email,r.is_staff,r.expires_at FROM auth.users a
        LEFT JOIN private.campus_authorized_emails r ON r.email=lower(btrim(a.email))
    LOOP
        eligible:=private.campus_email_eligible(u.id);
        IF eligible IS DISTINCT FROM (u.is_staff IS NOT NULL) THEN RAISE EXCEPTION 'Eligibility mismatch for account %',u.id; END IF;
        IF u.is_staff=false THEN
            IF private.campus_email_eligible(u.id,'2026-12-19 03:59:59.999999+00') IS NOT TRUE
               OR private.campus_email_eligible(u.id,'2026-12-19 04:00:00+00') IS NOT FALSE
               OR private.campus_email_eligible(u.id,'2027-01-01 00:00:00+00') IS NOT FALSE THEN
                RAISE EXCEPTION 'Student expiration boundary is wrong';
            END IF;
        ELSIF u.is_staff=true THEN
            IF private.campus_email_eligible(u.id,'2027-01-01 00:00:00+00') IS NOT TRUE THEN RAISE EXCEPTION 'Staff incorrectly capped'; END IF;
        ELSE
            PERFORM set_config('request.jwt.claim.sub',u.id::text,true);
            PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u.id,'role','authenticated')::text,true);
            IF public.campus_is_admin() OR public.campus_has_access() OR public.campus_has_video_access()
               OR (public.campus_atlas_access()->>'allowed')::boolean THEN RAISE EXCEPTION 'Excluded account retains content access'; END IF;
        END IF;
    END LOOP;

    FOR u IN SELECT a.id,d.auth_session_id FROM auth.users a
      JOIN private.campus_authorized_emails r ON r.email=lower(btrim(a.email)) AND NOT r.is_staff
      JOIN public.device_sessions d ON d.user_id=a.id AND d.is_active AND d.auth_session_id IS NOT NULL LIMIT 1
    LOOP
      PERFORM set_config('request.jwt.claim.sub',u.id::text,true);
      PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u.id,'role','authenticated','session_id',u.auth_session_id)::text,true);
      IF public.campus_has_access() IS NOT TRUE OR (public.campus_access()->>'ready')::boolean IS NOT TRUE THEN
          RAISE EXCEPTION 'Listed student with active device cannot enter';
      END IF;
      tested_student:=true;
    END LOOP;
    IF NOT tested_student THEN RAISE EXCEPTION 'No active listed student session available for access test'; END IF;
    SELECT id INTO u FROM auth.users WHERE lower(email)='pichon4488@gmail.com';
    PERFORM set_config('request.jwt.claim.sub',u.id::text,true);
    PERFORM set_config('request.jwt.claims',jsonb_build_object('sub',u.id,'role','authenticated')::text,true);
    IF public.campus_is_admin() IS NOT TRUE OR public.campus_has_access() IS NOT TRUE THEN RAISE EXCEPTION 'Owner access would be lost'; END IF;
END
$$;
