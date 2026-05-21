-- ================================================================
-- PLANTILLA SQL — CREAR EVALUACIONES DIRECTAMENTE EN SUPABASE
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- 
-- PASO 1: Reemplaza 'TU-USER-ID-AQUI' por tu UUID de usuario
--         (lo ves en Authentication > Users > tu email > UID)
-- PASO 2: Personaliza título, asignatura, preguntas, etc.
-- PASO 3: Ejecuta todo el script de una vez
-- ================================================================

-- ═══════════════════════════════════════════════════════════
-- EJEMPLO 1: SELECCIÓN ÚNICA (mc) + VERDADERO/FALSO (tf)
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    eval_id uuid;
    user_id uuid := 'TU-USER-ID-AQUI';  -- ⚠️ REEMPLAZAR con tu UUID real
    quiz_code text;
BEGIN
    -- Generar código aleatorio de 6 caracteres para la evaluación
    quiz_code := upper(substr(md5(random()::text), 1, 6));

    -- 1. Crear la evaluación
    INSERT INTO public.evaluaciones (titulo, asignatura, tema, nivel, idioma, created_by, publicado, codigo, iniciado, modo_sesion, visibilidad, created_at, updated_at)
    VALUES ('Anatomía del corazón - Examen rápido', 'Anatomía', 'Sistema cardiovascular', 'Universidad', 'Español', user_id, true, quiz_code, true, 'test', 'publica', now(), now())
    RETURNING id INTO eval_id;

    -- 2. Insertar preguntas
    -- Pregunta 1: Selección única
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'mc', '¿Cuál es la válvula que separa la aurícula izquierda del ventrículo izquierdo?',
        '[
            {"text":"Válvula mitral","correct":true,"color":"ac-blue"},
            {"text":"Válvula tricúspide","correct":false,"color":"ac-teal"},
            {"text":"Válvula aórtica","correct":false,"color":"ac-yellow"},
            {"text":"Válvula pulmonar","correct":false,"color":"ac-pink"}
        ]'::jsonb, false, 0, 1, 30);

    -- Pregunta 2: Verdadero o falso
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'tf', 'La arteria aorta sale del ventrículo derecho.',
        '[
            {"text":"Verdadero","correct":false,"color":"ac-blue"},
            {"text":"Falso","correct":true,"color":"ac-pink"}
        ]'::jsonb, false, 1, 1, 30);

    -- Pregunta 3: Otra de selección única
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'mc', '¿Qué arteria irriga principalmente el corazón?',
        '[
            {"text":"Arteria carótida","correct":false,"color":"ac-blue"},
            {"text":"Arteria coronaria","correct":true,"color":"ac-teal"},
            {"text":"Arteria pulmonar","correct":false,"color":"ac-yellow"},
            {"text":"Arteria femoral","correct":false,"color":"ac-pink"}
        ]'::jsonb, false, 2, 1, 30);

    RAISE NOTICE '✅ Evaluación creada. ID: %, Código: %', eval_id, quiz_code;
END $$;


-- ═══════════════════════════════════════════════════════════
-- EJEMPLO 2: SELECCIÓN MÚLTIPLE (ms)
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    eval_id uuid;
    user_id uuid := 'TU-USER-ID-AQUI';  -- ⚠️ REEMPLAZAR
    quiz_code text;
BEGIN
    quiz_code := upper(substr(md5(random()::text), 1, 6));

    INSERT INTO public.evaluaciones (titulo, asignatura, tema, nivel, idioma, created_by, publicado, codigo, iniciado, modo_sesion, visibilidad, created_at, updated_at)
    VALUES ('Farmacología - Selección múltiple', 'Farmacología', 'Antibióticos', 'Universidad', 'Español', user_id, true, quiz_code, true, 'test', 'publica', now(), now())
    RETURNING id INTO eval_id;

    -- Pregunta: Selección múltiple (multiple_correctas = true)
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'ms', '¿Cuáles de los siguientes son antibióticos betalactámicos? (Selecciona todos los correctos)',
        '[
            {"text":"Penicilina","correct":true,"color":"ac-blue"},
            {"text":"Cefalosporina","correct":true,"color":"ac-teal"},
            {"text":"Tetraciclina","correct":false,"color":"ac-yellow"},
            {"text":"Amoxicilina","correct":true,"color":"ac-pink"},
            {"text":"Ciprofloxacino","correct":false,"color":"ac-purple"}
        ]'::jsonb, true, 0, 2, 60);

    RAISE NOTICE '✅ Evaluación creada. ID: %, Código: %', eval_id, quiz_code;
END $$;


-- ═══════════════════════════════════════════════════════════
-- EJEMPLO 3: COMPLETA LOS ESPACIOS (fb)
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    eval_id uuid;
    user_id uuid := 'TU-USER-ID-AQUI';  -- ⚠️ REEMPLAZAR
    quiz_code text;
BEGIN
    quiz_code := upper(substr(md5(random()::text), 1, 6));

    INSERT INTO public.evaluaciones (titulo, asignatura, tema, nivel, idioma, created_by, publicado, codigo, iniciado, modo_sesion, visibilidad, created_at, updated_at)
    VALUES ('Terminología médica - Completar', 'Terminología', 'Prefijos y sufijos', 'Preparatoria', 'Español', user_id, true, quiz_code, true, 'test', 'publica', now(), now())
    RETURNING id INTO eval_id;

    -- Pregunta 1: Un espacio en blanco
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'fb', 'La inflamación del hígado se denomina _____ .',
        '[
            {"text":"hepatitis","correct":true,"color":"ac-blue"}
        ]'::jsonb, false, 0, 1, 30);

    -- Pregunta 2: Un espacio con múltiples respuestas aceptadas (separadas por coma)
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'fb', 'El término médico para "dolor de cabeza" es _____ .',
        '[
            {"text":"cefalea,cefalalgia,cefalgia","correct":true,"color":"ac-blue"}
        ]'::jsonb, false, 1, 1, 30);

    -- Pregunta 3: Dos espacios en blanco (el texto contiene dos _____)
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'fb', 'La _____ es el estudio de las causas de las enfermedades, mientras que la _____ estudia los cambios estructurales.',
        '[
            {"text":"etiología,causa","correct":true,"color":"ac-blue"},
            {"text":"patología,patologia","correct":true,"color":"ac-teal"}
        ]'::jsonb, false, 2, 2, 60);

    RAISE NOTICE '✅ Evaluación creada. ID: %, Código: %', eval_id, quiz_code;
END $$;


-- ═══════════════════════════════════════════════════════════
-- EJEMPLO 4: IDENTIFICAR PARTES EN IMAGEN (dnd)
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    eval_id uuid;
    user_id uuid := 'TU-USER-ID-AQUI';  -- ⚠️ REEMPLAZAR
    quiz_code text;
    imagen_url text := 'https://asnwhddmurstzmghuyin.supabase.co/storage/v1/object/public/imagenes/corazon.jpg';  -- ⚠️ REEMPLAZAR con tu URL de imagen
BEGIN
    quiz_code := upper(substr(md5(random()::text), 1, 6));

    INSERT INTO public.evaluaciones (titulo, asignatura, tema, nivel, idioma, created_by, publicado, codigo, iniciado, modo_sesion, visibilidad, created_at, updated_at)
    VALUES ('Anatomía - Identifica las partes del corazón', 'Anatomía', 'Sistema cardiovascular', 'Universidad', 'Español', user_id, true, quiz_code, true, 'test', 'publica', now(), now())
    RETURNING id INTO eval_id;

    -- Pregunta DND: Identificar partes en imagen
    -- Cada opción es una etiqueta con pinX/pinY en porcentaje y la URL de la imagen
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'dnd', 'Identifica las siguientes estructuras en la imagen del corazón:',
        ('[
            {"text":"Aurícula derecha","correct":true,"color":"ac-blue","pregunta_imagen":"' || imagen_url || '","pinX":25,"pinY":30},
            {"text":"Ventrículo izquierdo","correct":true,"color":"ac-teal","pregunta_imagen":"' || imagen_url || '","pinX":55,"pinY":70},
            {"text":"Arteria aorta","correct":true,"color":"ac-yellow","pregunta_imagen":"' || imagen_url || '","pinX":50,"pinY":15},
            {"text":"Vena cava superior","correct":true,"color":"ac-pink","pregunta_imagen":"' || imagen_url || '","pinX":20,"pinY":10}
        ]')::jsonb, false, 0, 2, 60);

    RAISE NOTICE '✅ Evaluación creada. ID: %, Código: %', eval_id, quiz_code;
END $$;


-- ═══════════════════════════════════════════════════════════
-- EJEMPLO 5: RESPUESTA ABIERTA (oa)
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    eval_id uuid;
    user_id uuid := 'TU-USER-ID-AQUI';  -- ⚠️ REEMPLAZAR
    quiz_code text;
BEGIN
    quiz_code := upper(substr(md5(random()::text), 1, 6));

    INSERT INTO public.evaluaciones (titulo, asignatura, tema, nivel, idioma, created_by, publicado, codigo, iniciado, modo_sesion, visibilidad, created_at, updated_at)
    VALUES ('Razonamiento clínico - Casos abiertos', 'Clínica', 'Razonamiento diagnóstico', 'Universidad', 'Español', user_id, true, quiz_code, true, 'test', 'publica', now(), now())
    RETURNING id INTO eval_id;

    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'oa', 'Paciente de 45 años con dolor torácico opresivo irradiado a brazo izquierdo. ¿Cuál es tu diagnóstico presuntivo y qué estudios solicitarías?',
        '[]'::jsonb, false, 0, 0, 300);

    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'oa', 'Describe el mecanismo fisiopatológico de la diabetes mellitus tipo 2.',
        '[]'::jsonb, false, 1, 0, 300);

    RAISE NOTICE '✅ Evaluación creada. ID: %, Código: %', eval_id, quiz_code;
END $$;


-- ═══════════════════════════════════════════════════════════
-- EJEMPLO 6: EVALUACIÓN COMBINADA (varios tipos en una sola)
-- ═══════════════════════════════════════════════════════════

DO $$
DECLARE
    eval_id uuid;
    user_id uuid := 'TU-USER-ID-AQUI';  -- ⚠️ REEMPLAZAR
    quiz_code text;
BEGIN
    quiz_code := upper(substr(md5(random()::text), 1, 6));

    INSERT INTO public.evaluaciones (titulo, asignatura, tema, nivel, idioma, created_by, publicado, codigo, iniciado, modo_sesion, visibilidad, created_at, updated_at)
    VALUES ('Examen integral de Fisiología', 'Fisiología', 'General', 'Universidad', 'Español', user_id, true, quiz_code, true, 'test', 'publica', now(), now())
    RETURNING id INTO eval_id;

    -- Pregunta 1: Selección única
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'mc', '¿Dónde se produce la eritropoyetina?',
        '[
            {"text":"Hígado","correct":false,"color":"ac-blue"},
            {"text":"Riñón","correct":true,"color":"ac-teal"},
            {"text":"Bazo","correct":false,"color":"ac-yellow"},
            {"text":"Médula ósea","correct":false,"color":"ac-pink"}
        ]'::jsonb, false, 0, 1, 30);

    -- Pregunta 2: Verdadero/Falso
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'tf', 'El potencial de acción cardíaco tiene una fase de meseta ausente en el músculo esquelético.',
        '[
            {"text":"Verdadero","correct":true,"color":"ac-blue"},
            {"text":"Falso","correct":false,"color":"ac-pink"}
        ]'::jsonb, false, 1, 1, 30);

    -- Pregunta 3: Selección múltiple
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'ms', '¿Cuáles son hormonas producidas por la adenohipófisis?',
        '[
            {"text":"GH (hormona del crecimiento)","correct":true,"color":"ac-blue"},
            {"text":"TSH (tirotropina)","correct":true,"color":"ac-teal"},
            {"text":"Oxitocina","correct":false,"color":"ac-yellow"},
            {"text":"Prolactina","correct":true,"color":"ac-pink"},
            {"text":"ADH (vasopresina)","correct":false,"color":"ac-purple"}
        ]'::jsonb, true, 2, 2, 60);

    -- Pregunta 4: Completar espacios
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'fb', 'La unidad funcional del riñón es la _____.',
        '[
            {"text":"nefrona,nefróna,nefron","correct":true,"color":"ac-blue"}
        ]'::jsonb, false, 3, 1, 30);

    -- Pregunta 5: Respuesta abierta
    INSERT INTO public.evaluacion_preguntas (evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador)
    VALUES (eval_id, 'oa', 'Explica el mecanismo de retroalimentación negativa del eje hipotálamo-hipófisis-tiroides.',
        '[]'::jsonb, false, 4, 0, 300);

    RAISE NOTICE '✅ Evaluación creada. ID: %, Código: %', eval_id, quiz_code;
END $$;


-- ═══════════════════════════════════════════════════════════
-- CONSULTAS ÚTILES
-- ═══════════════════════════════════════════════════════════

-- Ver todas tus evaluaciones:
-- SELECT id, titulo, publicado, codigo, created_at FROM public.evaluaciones WHERE created_by = 'TU-USER-ID-AQUI' ORDER BY created_at DESC;

-- Ver preguntas de una evaluación específica:
-- SELECT * FROM public.evaluacion_preguntas WHERE evaluacion_id = 'EL-UUID-DE-TU-EVALUACION' ORDER BY orden;

-- Eliminar una evaluación completa (preguntas + resultados):
-- DELETE FROM public.evaluacion_preguntas WHERE evaluacion_id = 'EL-UUID';
-- DELETE FROM public.evaluacion_resultados WHERE evaluacion_id = 'EL-UUID';
-- DELETE FROM public.evaluacion_participantes WHERE evaluacion_id = 'EL-UUID';
-- DELETE FROM public.evaluaciones WHERE id = 'EL-UUID';

-- Cambiar una evaluación de borrador a publicada:
-- UPDATE public.evaluaciones SET publicado = true, iniciado = true WHERE id = 'EL-UUID';
