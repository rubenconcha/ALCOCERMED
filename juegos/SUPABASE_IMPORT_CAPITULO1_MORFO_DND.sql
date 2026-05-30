-- Importa una evaluacion de preguntas con imagen para Capitulo 1 - Morfofuncion.
-- Las imagenes deben existir en la app en:
-- juegos/assets/capitulo1-morfo/
--
-- Uso recomendado:
-- 1) Subir/desplegar la carpeta juegos/assets/capitulo1-morfo con la app.
-- 2) Ejecutar este SQL en Supabase SQL Editor.
-- 3) Entrar a la app > JUGAR > MORFOFUNCION > "Capitulo 1 Morfofuncion - imagenes".

begin;

insert into public.evaluaciones (
  id,
  titulo,
  asignatura,
  nivel,
  idioma,
  visibilidad,
  objetivo,
  codigo,
  publicado,
  created_by,
  created_at,
  updated_at,
  iniciado,
  tema,
  modo_sesion,
  config_juego
) values (
  '5f4c3c25-7f13-48fd-a64c-5fa7796f7fd1',
  'Capitulo 1 Morfofuncion - imagenes',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Relacionar estructuras e identificar partes desde imagenes del texto oficial.',
  'C1MORF',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(),
  now(),
  true,
  'Capitulo 1: Temas principales de anatomia y fisiologia',
  'test',
  '{
    "maxQuestions": 6,
    "questionOrder": [
      "87ed37f2-c87a-43fd-a458-5f9f0f88a101",
      "87ed37f2-c87a-43fd-a458-5f9f0f88a102",
      "87ed37f2-c87a-43fd-a458-5f9f0f88a103",
      "87ed37f2-c87a-43fd-a458-5f9f0f88a104",
      "87ed37f2-c87a-43fd-a458-5f9f0f88a105",
      "87ed37f2-c87a-43fd-a458-5f9f0f88a106"
    ],
    "enabledPowerups": ["x2", "time", "hint", "retry"]
  }'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo,
  asignatura = excluded.asignatura,
  nivel = excluded.nivel,
  idioma = excluded.idioma,
  visibilidad = excluded.visibilidad,
  objetivo = excluded.objetivo,
  codigo = excluded.codigo,
  publicado = excluded.publicado,
  updated_at = now(),
  iniciado = excluded.iniciado,
  tema = excluded.tema,
  modo_sesion = excluded.modo_sesion,
  config_juego = excluded.config_juego;

delete from public.evaluacion_preguntas
where evaluacion_id = '5f4c3c25-7f13-48fd-a64c-5fa7796f7fd1';

insert into public.evaluacion_preguntas (
  id,
  evaluacion_id,
  tipo,
  texto,
  opciones,
  multiple_correctas,
  orden,
  puntos,
  temporizador
) values
(
  '87ed37f2-c87a-43fd-a458-5f9f0f88a101',
  '5f4c3c25-7f13-48fd-a64c-5fa7796f7fd1',
  'dnd',
  'Capitulo 1 imagen: relaciona los huesos del antebrazo senalados.',
  '[
    {"text":"Radio","correct":true,"color":"ac-blue","pinX":28,"pinY":46,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_antebrazo_radio_cubito.png"},
    {"text":"Cubito","correct":true,"color":"ac-green","pinX":43,"pinY":47,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_antebrazo_radio_cubito.png"}
  ]'::jsonb,
  true,
  0,
  1,
  45
),
(
  '87ed37f2-c87a-43fd-a458-5f9f0f88a102',
  '5f4c3c25-7f13-48fd-a64c-5fa7796f7fd1',
  'dnd',
  'Capitulo 1 imagen: identifica el plano o corte anatomico representado.',
  '[
    {"text":"Corte sagital","correct":true,"color":"ac-purple","pinX":17,"pinY":50,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_planos_cortes.png"},
    {"text":"Corte frontal","correct":true,"color":"ac-blue","pinX":50,"pinY":50,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_planos_cortes.png"},
    {"text":"Corte transversal","correct":true,"color":"ac-yellow","pinX":83,"pinY":50,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_planos_cortes.png"}
  ]'::jsonb,
  true,
  1,
  1,
  45
),
(
  '87ed37f2-c87a-43fd-a458-5f9f0f88a103',
  '5f4c3c25-7f13-48fd-a64c-5fa7796f7fd1',
  'dnd',
  'Capitulo 1 imagen: ubica regiones corporales anteriores.',
  '[
    {"text":"Region cefalica","correct":true,"color":"ac-blue","pinX":51,"pinY":8,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_regiones_corporales_anterior.png"},
    {"text":"Region cervical","correct":true,"color":"ac-green","pinX":50,"pinY":19,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_regiones_corporales_anterior.png"},
    {"text":"Region toracica","correct":true,"color":"ac-purple","pinX":50,"pinY":33,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_regiones_corporales_anterior.png"},
    {"text":"Region umbilical","correct":true,"color":"ac-yellow","pinX":50,"pinY":49,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_regiones_corporales_anterior.png"},
    {"text":"Region inguinal","correct":true,"color":"ac-pink","pinX":55,"pinY":63,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_regiones_corporales_anterior.png"},
    {"text":"Region femoral","correct":true,"color":"ac-yellow","pinX":55,"pinY":76,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_regiones_corporales_anterior.png"}
  ]'::jsonb,
  true,
  2,
  1,
  60
),
(
  '87ed37f2-c87a-43fd-a458-5f9f0f88a104',
  '5f4c3c25-7f13-48fd-a64c-5fa7796f7fd1',
  'dnd',
  'Capitulo 1 imagen: relaciona los cuatro cuadrantes abdominales.',
  '[
    {"text":"Cuadrante superior derecho","correct":true,"color":"ac-blue","pinX":37,"pinY":43,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cuadrantes_abdominales.png"},
    {"text":"Cuadrante superior izquierdo","correct":true,"color":"ac-yellow","pinX":62,"pinY":43,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cuadrantes_abdominales.png"},
    {"text":"Cuadrante inferior derecho","correct":true,"color":"ac-pink","pinX":37,"pinY":56,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cuadrantes_abdominales.png"},
    {"text":"Cuadrante inferior izquierdo","correct":true,"color":"ac-green","pinX":62,"pinY":56,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cuadrantes_abdominales.png"}
  ]'::jsonb,
  true,
  3,
  1,
  60
),
(
  '87ed37f2-c87a-43fd-a458-5f9f0f88a105',
  '5f4c3c25-7f13-48fd-a64c-5fa7796f7fd1',
  'dnd',
  'Capitulo 1 imagen: relaciona las nueve regiones abdominales.',
  '[
    {"text":"Hipocondrio derecho","correct":true,"color":"ac-blue","pinX":28,"pinY":37,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region epigastrica","correct":true,"color":"ac-yellow","pinX":50,"pinY":37,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"},
    {"text":"Hipocondrio izquierdo","correct":true,"color":"ac-green","pinX":72,"pinY":37,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region lumbar derecha","correct":true,"color":"ac-purple","pinX":28,"pinY":51,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region umbilical","correct":true,"color":"ac-pink","pinX":50,"pinY":51,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region lumbar izquierda","correct":true,"color":"ac-purple","pinX":72,"pinY":51,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region inguinal derecha","correct":true,"color":"ac-teal","pinX":28,"pinY":65,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region hipogastrica","correct":true,"color":"ac-yellow","pinX":50,"pinY":65,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region inguinal izquierda","correct":true,"color":"ac-teal","pinX":72,"pinY":65,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_nueve_regiones_abdominales.png"}
  ]'::jsonb,
  true,
  4,
  1,
  75
),
(
  '87ed37f2-c87a-43fd-a458-5f9f0f88a106',
  '5f4c3c25-7f13-48fd-a64c-5fa7796f7fd1',
  'dnd',
  'Capitulo 1 imagen: identifica las principales cavidades corporales.',
  '[
    {"text":"Cavidad craneana","correct":true,"color":"ac-blue","pinX":43,"pinY":6,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cavidades_corporales.png"},
    {"text":"Conducto vertebral","correct":true,"color":"ac-green","pinX":63,"pinY":31,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cavidades_corporales.png"},
    {"text":"Cavidad toracica","correct":true,"color":"ac-purple","pinX":38,"pinY":34,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cavidades_corporales.png"},
    {"text":"Cavidad abdominal","correct":true,"color":"ac-pink","pinX":37,"pinY":60,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cavidades_corporales.png"},
    {"text":"Cavidad pelvica","correct":true,"color":"ac-yellow","pinX":47,"pinY":75,"pregunta_imagen":"./assets/capitulo1-morfo/cap1_cavidades_corporales.png"}
  ]'::jsonb,
  true,
  5,
  1,
  60
);

commit;

