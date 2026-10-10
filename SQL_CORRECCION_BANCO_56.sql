-- Corrige una pregunta anterior cuya jerarquía corporal estaba invertida.
UPDATE public.banco_preguntas
SET "PREGUNTA" = '¿Qué nivel de organización está inmediatamente por debajo del tejido?',
    "EXPLICACION" = 'La célula. Las células forman tejidos y los tejidos forman órganos.'
WHERE id = 56 AND "RESPUESTA_CORRECTA" = 'D';
