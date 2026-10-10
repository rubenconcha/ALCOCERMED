-- Simulacros de práctica basados exclusivamente en las preguntas del banco
-- que indican uno de los tres PDF aportados por Preparatoria Ben Carson.
-- No sustituye la revisión académica de preguntas y distractores.
-- Reejecutable: no duplica simulacros ya creados ni modifica las muestras CAP.

BEGIN;

ALTER TABLE public.simulacros ADD COLUMN IF NOT EXISTS fuente text;
ALTER TABLE public.simulacros ADD COLUMN IF NOT EXISTS paginas_pdf text;

WITH fuente AS (
    SELECT b.*,
           row_number() OVER (
               PARTITION BY b."MATERIA", b."TEMA"
               ORDER BY md5(b."PREGUNTA"), b.id
           ) AS orden_tema
    FROM public.banco_preguntas b
    WHERE b."FUENTE" IS NOT NULL
      AND b."RESPUESTA_CORRECTA" IN ('A', 'B', 'C', 'D')
      AND b."OPCION_A" IS NOT NULL AND b."OPCION_B" IS NOT NULL
      AND b."OPCION_C" IS NOT NULL AND b."OPCION_D" IS NOT NULL
), repartidas AS (
    SELECT f.*,
           row_number() OVER (
               PARTITION BY f."MATERIA"
               ORDER BY f.orden_tema, md5(f."TEMA"), md5(f."PREGUNTA"), f.id
           ) AS orden_materia,
           count(*) OVER (PARTITION BY f."MATERIA") AS total_materia
    FROM fuente f
), asignadas AS (
    SELECT r.*,
           floor((r.orden_materia - 1) * ceil(r.total_materia / 50.0)
               / r.total_materia)::integer + 1 AS numero_simulacro
    FROM repartidas r
), numeradas AS (
    SELECT a.*,
           row_number() OVER (
               PARTITION BY a."MATERIA", a.numero_simulacro
               ORDER BY a.orden_materia
           )::integer AS numero_en_simulacro
    FROM asignadas a
), payload AS (
    SELECT 'Práctica bibliográfica · ' ||
           CASE n."MATERIA"
               WHEN 'MORFOFUNCION' THEN 'Morfofunción'
               WHEN 'BIOLOGIA CELULAR' THEN 'Biología celular'
               WHEN 'SALUD PUBLICA' THEN 'Educación para la Salud'
           END || ' · ' || lpad(n.numero_simulacro::text, 2, '0') AS nombre,
           n."MATERIA" AS materia,
           n.numero_en_simulacro AS numero_pregunta,
           n."TEMA" AS tema,
           n."PREGUNTA" AS pregunta,
           n."OPCION_A" AS opcion_a,
           n."OPCION_B" AS opcion_b,
           n."OPCION_C" AS opcion_c,
           n."OPCION_D" AS opcion_d,
           NULL::text AS opcion_e,
           n."RESPUESTA_CORRECTA" AS respuesta_correcta,
           n."EXPLICACION" AS justificacion,
           n."DIFICULTAD" AS dificultad,
           n."FUENTE" AS fuente,
           n."PAGINAS_PDF" AS paginas_pdf
    FROM numeradas n
)
INSERT INTO public.simulacros
    (nombre, materia, numero_pregunta, tema, pregunta,
     opcion_a, opcion_b, opcion_c, opcion_d, opcion_e,
     respuesta_correcta, justificacion, dificultad, fuente, paginas_pdf)
SELECT p.* FROM payload p
WHERE NOT EXISTS (
    SELECT 1 FROM public.simulacros s
    WHERE s.nombre = p.nombre AND s.numero_pregunta = p.numero_pregunta
);

WITH elegidas AS (
    SELECT b.*,
           row_number() OVER (
               PARTITION BY b."MATERIA"
               ORDER BY md5('integral-2026-' || b."PREGUNTA"), b.id
           ) AS orden_materia
    FROM public.banco_preguntas b
    WHERE b."FUENTE" IS NOT NULL
      AND b."MATERIA" IN ('MORFOFUNCION', 'BIOLOGIA CELULAR', 'SALUD PUBLICA')
), numeradas AS (
    SELECT e.*,
           row_number() OVER (
               ORDER BY md5('mezcla-2026-' || e."PREGUNTA"), e.id
           )::integer AS numero_en_simulacro
    FROM elegidas e
    WHERE e.orden_materia <= 20
), payload AS (
    SELECT 'Práctica bibliográfica · Integral · 01'::text AS nombre,
           'INTEGRAL'::text AS materia,
           n.numero_en_simulacro AS numero_pregunta,
           n."MATERIA" || ' · ' || n."TEMA" AS tema,
           n."PREGUNTA" AS pregunta,
           n."OPCION_A" AS opcion_a,
           n."OPCION_B" AS opcion_b,
           n."OPCION_C" AS opcion_c,
           n."OPCION_D" AS opcion_d,
           NULL::text AS opcion_e,
           n."RESPUESTA_CORRECTA" AS respuesta_correcta,
           n."EXPLICACION" AS justificacion,
           n."DIFICULTAD" AS dificultad,
           n."FUENTE" AS fuente,
           n."PAGINAS_PDF" AS paginas_pdf
    FROM numeradas n
)
INSERT INTO public.simulacros
    (nombre, materia, numero_pregunta, tema, pregunta,
     opcion_a, opcion_b, opcion_c, opcion_d, opcion_e,
     respuesta_correcta, justificacion, dificultad, fuente, paginas_pdf)
SELECT p.* FROM payload p
WHERE NOT EXISTS (
    SELECT 1 FROM public.simulacros s
    WHERE s.nombre = p.nombre AND s.numero_pregunta = p.numero_pregunta
);

COMMIT;

-- Control sugerido tras ejecutar:
-- SELECT materia, count(DISTINCT nombre) AS simulacros, count(*) AS preguntas
-- FROM public.simulacros WHERE nombre LIKE 'Práctica bibliográfica · %'
-- GROUP BY materia ORDER BY materia;
