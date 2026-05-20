-- Agregar la columna 'equipo' a la tabla 'evaluacion_participantes' si no existe
ALTER TABLE public.evaluacion_participantes 
ADD COLUMN IF NOT EXISTS equipo VARCHAR(255);

-- Agregar la columna 'equipo' a la tabla 'evaluacion_resultados' si no existe
ALTER TABLE public.evaluacion_resultados 
ADD COLUMN IF NOT EXISTS equipo VARCHAR(255);
