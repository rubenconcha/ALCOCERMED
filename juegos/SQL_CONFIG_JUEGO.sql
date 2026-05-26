-- Columna para orden de preguntas y comodines (desde el editor admin)
-- Ejecutar en Supabase → SQL Editor

ALTER TABLE public.evaluaciones
ADD COLUMN IF NOT EXISTS config_juego jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.evaluaciones.config_juego IS
  'Orden de preguntas para estudiantes, maxQuestions, enabledPowerups, etc.';
