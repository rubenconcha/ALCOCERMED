-- Banco visual: Sistema oseo, anatomia y clasificacion (Morfofuncion).
-- 30 preguntas en el banco; el estudiante recibe 10 al azar por intento.
-- Distribucion: 13 mc, 8 ms, 3 tf y 6 dnd.
--
-- Requisitos:
-- 1) Conservar la carpeta juegos/assets/huesos-saladin/ al publicar el sitio.
-- 2) Ejecutar este archivo completo en Supabase SQL Editor.
-- 3) En Juegos > MORFOFUNCION aparecera "Sistema oseo: anatomia y clasificacion".

begin;

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo,
  publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '324184d6-ceeb-4cb1-8768-993edcff0fec',
  'Sistema óseo: anatomía y clasificación',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Reconocer las funciones y divisiones del esqueleto, clasificar los huesos por su forma e identificar la anatomía macroscópica del hueso largo, los miembros y los principales accidentes óseos.',
  'HUESOS',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(), now(), true,
  'Capítulo 8 de Saladin: El sistema óseo',
  'test',
  '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
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
where evaluacion_id = '324184d6-ceeb-4cb1-8768-993edcff0fec';

insert into public.evaluacion_preguntas (
  id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador
) values
(
  '245bf57f-8654-4714-8f9c-7d8b6ebf345d', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Qué función del sistema óseo explica que el cráneo rodee al encéfalo?',
  $$[{"text":"Protección de órganos internos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Producción de bilis","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Intercambio de gases","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Digestión de proteínas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 1, 1, 45
),
(
  'cd588024-68dc-4745-a19b-d775a347afab', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Cuál conjunto pertenece por completo al esqueleto axial?',
  $$[{"text":"Cráneo, columna vertebral, costillas y esternón","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Clavículas, escápulas, húmeros y radios","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Huesos coxales, fémures, tibias y fíbulas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Carpos, metacarpos, tarsos y metatarsos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 2, 1, 45
),
(
  '49f5356e-34f7-4f5e-8c4e-29c704584bf0', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Qué incluye el esqueleto apendicular?',
  $$[{"text":"Las cinturas pectoral y pélvica junto con los miembros","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Solo el cráneo y la columna vertebral","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Solo las costillas y el esternón","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"El cráneo, el hioides y los huesecillos auditivos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 3, 1, 45
),
(
  '7c7f2d32-abe7-463a-98ee-7a53a839606b', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿En qué se basa la clasificación de Saladin de un hueso como largo, corto o irregular?',
  $$[{"text":"En su forma general","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Únicamente en su peso","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"En el color de la médula","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"En la edad de la persona","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 4, 1, 45
),
(
  '5450a11b-3424-469d-ba3a-e1869c403234', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Cuál es un ejemplo típico de hueso corto?',
  $$[{"text":"Un hueso del carpo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"El fémur","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"El esternón","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Una vértebra lumbar","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 5, 1, 45
),
(
  '6a416a42-5bfd-41fe-9ccc-4ba553661138', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Cuál de los siguientes se clasifica como hueso corto en Saladin?',
  $$[{"text":"La rótula","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"El fémur","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"El esternón","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Una vértebra","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 6, 1, 45
),
(
  'bd8d67ba-73be-438b-900b-afbfd57b34b8', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Qué hueso se clasifica como irregular por su forma compleja?',
  $$[{"text":"Una vértebra","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"El húmero","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Un metacarpiano","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Un hueso del carpo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 7, 1, 45
),
(
  'f33ae545-5aa9-4e4b-aa72-832c5c764d9b', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Cuál de estos ejemplos pertenece al grupo de huesos irregulares?',
  $$[{"text":"El esfenoides","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"La rótula","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"El fémur","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Un hueso del carpo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 8, 1, 45
),
(
  'c984c436-e1ed-4bf7-b8f9-423d221522d1', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Qué región de un hueso largo corresponde al cuerpo o eje tubular?',
  $$[{"text":"La diáfisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"La epífisis","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"La metáfisis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"La faceta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  false, 9, 1, 45
),
(
  '226f4c0b-1d14-43a7-a71e-919868fc44b8', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Cómo se denomina cada extremo ensanchado de un hueso largo?',
  $$[{"text":"Epífisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Diáfisis","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Foramen","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Cresta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  false, 10, 1, 45
),
(
  '4ba3c8b9-a818-4e70-ac62-5c1083966e6a', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Qué región une la diáfisis con una epífisis y alberga la placa de crecimiento en el hueso inmaduro?',
  $$[{"text":"La metáfisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"La cavidad medular","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"La fosa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"El periostio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  false, 11, 1, 45
),
(
  '65e1d67e-8cc0-41e5-94f6-d5b5217b96bd', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Dónde se localiza principalmente la cavidad medular en un hueso largo?',
  $$[{"text":"En el interior de la diáfisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Sobre el cartílago articular","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Dentro de un ligamento","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Entre dos costillas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  false, 12, 1, 45
),
(
  '81db9e2f-5e2c-4a6f-a3be-b4f36f05b293', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'mc',
  '¿Qué membrana recubre externamente al hueso, excepto en las superficies articulares?',
  $$[{"text":"El periostio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"El endocardio","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"La pleura","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"La duramadre","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  false, 13, 1, 45
),
(
  '25e7babe-6177-45fe-97cc-d3b504e70304', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'ms',
  'Selecciona las funciones principales del sistema óseo.',
  $$[{"text":"Sostener el cuerpo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Proteger órganos internos","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Facilitar el movimiento junto con los músculos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Almacenar minerales como calcio y fosfato","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Producir bilis","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  true, 14, 1, 50
),
(
  'ad6a9607-0807-441f-8865-764770b716ca', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'ms',
  'Selecciona los componentes del esqueleto axial.',
  $$[{"text":"Cráneo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Columna vertebral","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Costillas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Esternón","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Huesos del miembro superior","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  true, 15, 1, 50
),
(
  'b6bd7270-744b-477e-b053-50f67067d038', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'ms',
  'Selecciona las estructuras que pertenecen al esqueleto apendicular.',
  $$[{"text":"Cintura pectoral","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Miembros superiores","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Cintura pélvica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Miembros inferiores","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Caja torácica","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  true, 16, 1, 50
),
(
  '3e85b638-e61d-47db-8995-5bfa54745b17', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'ms',
  'Selecciona los ejemplos de huesos largos.',
  $$[{"text":"Húmero","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Radio","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Fémur","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Metacarpiano","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Hueso del carpo","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  true, 17, 1, 50
),
(
  'c26e2d7c-defd-426c-9695-8a845b8f7f8b', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'ms',
  'Selecciona las relaciones correctas entre hueso y clasificación.',
  $$[{"text":"Carpiano — hueso corto","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Rótula — hueso corto","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Vértebra — hueso irregular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Fémur — hueso largo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Esternón — hueso largo","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  true, 18, 1, 50
),
(
  'e4202656-7b42-4a7b-b358-0d2c6db0e6bd', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'ms',
  'Selecciona las estructuras macroscópicas de un hueso largo.',
  $$[{"text":"Epífisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Metáfisis","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Diáfisis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Cavidad medular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Alvéolo pulmonar","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  true, 19, 1, 50
),
(
  '28d91191-e739-4376-bc06-9a937052a288', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'ms',
  'Selecciona los accidentes óseos que suelen servir para inserción de tendones o ligamentos.',
  $$[{"text":"Tubérculo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Tuberosidad","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Cresta","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Proceso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Foramen","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"}]$$::jsonb,
  true, 20, 1, 50
),
(
  '8cc025a2-2eca-4640-aaa4-dc14c0883cc9', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'ms',
  'Selecciona las relaciones correctas entre accidente óseo y descripción.',
  $$[{"text":"Cabeza — superficie articular redondeada","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Cóndilo — prominencia articular redondeada","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Foramen — abertura a través del hueso","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Fosa — depresión en la superficie ósea","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Tubérculo — depresión profunda","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"}]$$::jsonb,
  true, 21, 1, 50
),
(
  '580a3931-6779-4d00-a7ba-edcbfff2d7af', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'tf',
  'Verdadero o falso: el esqueleto humano adulto se describe habitualmente con 206 huesos.',
  $$[{"text":"Verdadero","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Falso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 22, 1, 40
),
(
  '5b2ab2c2-f3ec-43a2-ae8f-97de12f2856f', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'tf',
  'Verdadero o falso: el cráneo y la columna vertebral forman parte del esqueleto apendicular.',
  $$[{"text":"Verdadero","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Falso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 23, 1, 40
),
(
  'bb47c2f2-fa90-4e88-9c0e-1b298655e19b', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'tf',
  'Verdadero o falso: Saladin incluye la rótula entre los huesos cortos.',
  $$[{"text":"Verdadero","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Falso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 24, 1, 40
),
(
  '42f9f68b-a25f-4808-b11b-e45719a5f7b5', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'dnd',
  'Relaciona cada ejemplo del esqueleto con la clasificación usada por Saladin.',
  $$[{"text":"Etmoides (en el cráneo) — hueso irregular","correct":true,"color":"ac-blue","pinX":30,"pinY":10,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Húmero — hueso largo","correct":true,"color":"ac-green","pinX":30,"pinY":31,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Carpianos — huesos cortos","correct":true,"color":"ac-yellow","pinX":30,"pinY":49,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Rótula — hueso corto","correct":true,"color":"ac-pink","pinX":30,"pinY":67,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 25, 1, 70
),
(
  '70ef70b1-ad03-4dcc-901b-c40e810fe7ea', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'dnd',
  'Relaciona cada región numerada con la división del esqueleto a la que pertenece.',
  $$[{"text":"Cráneo — axial","correct":true,"color":"ac-blue","pinX":30,"pinY":10,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Caja torácica — axial","correct":true,"color":"ac-green","pinX":30,"pinY":31,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Miembro superior — apendicular","correct":true,"color":"ac-yellow","pinX":48,"pinY":52,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Miembro inferior — apendicular","correct":true,"color":"ac-pink","pinX":30,"pinY":73,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 26, 1, 70
),
(
  '299f9ea4-b38f-44bd-9231-72fd45b26a6a', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'dnd',
  'Relaciona los números con las regiones del hueso largo.',
  $$[{"text":"Epífisis proximal","correct":true,"color":"ac-blue","pinX":65,"pinY":14,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Metáfisis proximal","correct":true,"color":"ac-green","pinX":65,"pinY":27,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Cavidad medular","correct":true,"color":"ac-yellow","pinX":28,"pinY":39,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Diáfisis","correct":true,"color":"ac-pink","pinX":65,"pinY":51,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Epífisis distal","correct":true,"color":"ac-purple","pinX":65,"pinY":75,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  false, 27, 1, 70
),
(
  'c401da01-ae39-4ada-bcad-f77d6e02bd5b', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'dnd',
  'Relaciona los números con las estructuras del miembro superior.',
  $$[{"text":"Cabeza del húmero","correct":true,"color":"ac-blue","pinX":14,"pinY":18,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_32_33_miembro_superior.png"},{"text":"Tuberosidad deltoidea","correct":true,"color":"ac-green","pinX":38,"pinY":42,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_32_33_miembro_superior.png"},{"text":"Diáfisis del radio","correct":true,"color":"ac-yellow","pinX":69,"pinY":55,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_32_33_miembro_superior.png"},{"text":"Cabeza del cúbito","correct":true,"color":"ac-pink","pinX":65,"pinY":72,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_32_33_miembro_superior.png"}]$$::jsonb,
  false, 28, 1, 70
),
(
  '90418141-333c-413b-af0a-0d38463190e6', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'dnd',
  'Relaciona los números con los huesos o grupos del miembro inferior.',
  $$[{"text":"Hueso coxal","correct":true,"color":"ac-blue","pinX":30,"pinY":47,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Fémur","correct":true,"color":"ac-green","pinX":30,"pinY":61,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Tibia","correct":true,"color":"ac-yellow","pinX":30,"pinY":79,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"},{"text":"Huesos tarsianos","correct":true,"color":"ac-pink","pinX":30,"pinY":94,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_1_esqueleto_adulto.png"}]$$::jsonb,
  false, 29, 1, 70
),
(
  '4624f8a4-2e11-4e70-8abb-06a5fefe7cfa', '324184d6-ceeb-4cb1-8768-993edcff0fec', 'dnd',
  'Relaciona cada esquema numerado con el accidente óseo representado.',
  $$[{"text":"Líneas del cráneo","correct":true,"color":"ac-blue","pinX":18,"pinY":13,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Cabeza femoral","correct":true,"color":"ac-green","pinX":64,"pinY":26,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Cresta femoral","correct":true,"color":"ac-yellow","pinX":73,"pinY":32,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Fosa de la escápula","correct":true,"color":"ac-pink","pinX":31,"pinY":57,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"},{"text":"Cóndilos femorales","correct":true,"color":"ac-purple","pinX":72,"pinY":75,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap8_fig8_2_accidentes_oseos.png"}]$$::jsonb,
  false, 30, 1, 70
);

commit;
