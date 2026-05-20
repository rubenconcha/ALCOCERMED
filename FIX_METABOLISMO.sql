-- ═══ CORREGIR PREGUNTA DE METABOLISMO: cambiar tipo de 'ms' a 'mc' ═══
-- La pregunta tiene solo 1 respuesta correcta (catabolismo) pero está guardada como selección múltiple.
-- Ejecutar en: Supabase Dashboard > SQL Editor

UPDATE evaluacion_preguntas 
SET tipo = 'mc', multiple_correctas = false
WHERE id = 'bba96531-8a72-400e-83f7-4b8ced80f4b2';

-- Verificar que se aplicó:
SELECT id, tipo, multiple_correctas, texto 
FROM evaluacion_preguntas 
WHERE id = 'bba96531-8a72-400e-83f7-4b8ced80f4b2';
