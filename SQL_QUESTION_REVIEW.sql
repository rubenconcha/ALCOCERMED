-- Conserva las preguntas y respuestas de las nuevas entregas con sus políticas RLS actuales.
begin;
alter table public.resultados_simulacros add column if not exists question_review jsonb;
alter table public.resultados_banco add column if not exists question_review jsonb;
comment on column public.resultados_simulacros.question_review is 'Instantánea v1 de las preguntas, opciones presentadas y respuestas al entregar. NULL en intentos históricos sin detalle.';
comment on column public.resultados_banco.question_review is 'Instantánea v1 de las preguntas, opciones presentadas y respuestas al entregar. NULL en intentos históricos sin detalle.';
notify pgrst,'reload schema';
commit;
