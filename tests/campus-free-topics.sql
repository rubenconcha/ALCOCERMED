-- Run in Supabase SQL Editor after SQL_CAMPUS_DOS_TEMAS_GRATIS.sql.
-- All changes, including the temporary auth user and membership, roll back.
BEGIN;
CREATE TEMP TABLE free_topic_checks (check_name text, passed boolean) ON COMMIT DROP;
GRANT ALL ON free_topic_checks TO authenticated, anon;
INSERT INTO auth.users (id, email, created_at)
VALUES ('00000000-0000-4000-8000-000000002222', 'free-two-topics@example.invalid', now());
SELECT set_config('request.jwt.claims', '{"sub":"00000000-0000-4000-8000-000000002222","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;

INSERT INTO free_topic_checks
SELECT 'free account is not premium', NOT public.campus_has_access()
  AND (public.campus_access()->>'premium')::boolean = false;
INSERT INTO free_topic_checks
SELECT 'only six book topics are readable',
  count(*) = 6 FROM (SELECT DISTINCT materia, tema FROM public.flashcards) visible;
INSERT INTO free_topic_checks
SELECT 'catalog has exactly six unlocked topics',
  count(*) FILTER (WHERE free_count > 0) = 6
  AND count(*) FILTER (WHERE free_count = 0) > 0
  FROM public.campus_catalog();
INSERT INTO free_topic_checks
SELECT 'free account cannot read blocked cards', NOT EXISTS (
  SELECT 1 FROM public.flashcards
  WHERE materia = 'MORFOFUNCION' AND tema = 'corazon'
);

RESET ROLE;
INSERT INTO public.campus_memberships (user_id, plan)
VALUES ('00000000-0000-4000-8000-000000002222', 'legacy');
SET LOCAL ROLE authenticated;
INSERT INTO free_topic_checks
SELECT 'legacy account keeps the free limit', NOT public.campus_has_access() AND NOT EXISTS (
  SELECT 1 FROM public.flashcards
  WHERE materia = 'MORFOFUNCION' AND tema = 'corazon'
);
INSERT INTO free_topic_checks
SELECT 'legacy account cannot open paid games', NOT public.campus_game_access('00000000-0000-4000-8000-000000009999');
RESET ROLE;
UPDATE public.campus_memberships SET plan='monthly', expires_at=now() + interval '1 month'
WHERE user_id='00000000-0000-4000-8000-000000002222';
SET LOCAL ROLE authenticated;
INSERT INTO free_topic_checks
SELECT 'paid account reads blocked cards', public.campus_has_access() AND EXISTS (
  SELECT 1 FROM public.flashcards
  WHERE materia = 'MORFOFUNCION' AND tema = 'corazon'
);
INSERT INTO free_topic_checks
SELECT 'paid account opens paid games', public.campus_game_access('00000000-0000-4000-8000-000000009999');
RESET ROLE;
SET LOCAL ROLE anon;
SELECT set_config('request.jwt.claims', '{}', true);
INSERT INTO free_topic_checks
SELECT 'anonymous account cannot read cards', NOT public.campus_has_access()
  AND NOT EXISTS (SELECT 1 FROM public.flashcards);
SELECT * FROM free_topic_checks;
ROLLBACK;
