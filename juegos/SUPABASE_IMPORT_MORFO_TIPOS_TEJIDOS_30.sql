-- Banco visual: Tipos de tejidos (Morfofuncion / Saladin, capitulo 5).
-- 30 preguntas por tema; el estudiante recibe 10 por intento.
-- Distribucion igual a los bancos demo: 13 mc, 8 ms, 3 tf y 6 dnd.
--
-- Requisitos:
-- 1) Conservar la carpeta juegos/assets/tipos-tejidos/ al publicar el sitio.
-- 2) Ejecutar este archivo completo en Supabase SQL Editor.
-- 3) En Juegos > MORFOFUNCION aparecerá "Tipos de tejidos".

begin;

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo,
  publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1',
  'Tipos de tejidos',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Distinguir los cuatro tipos fundamentales de tejidos, sus caracteristicas, funciones y localizaciones principales.',
  'TEJIDOS',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(), now(), true,
  'Capitulo 5: Tipos de tejidos',
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
where evaluacion_id = '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1';

insert into public.evaluacion_preguntas (
  id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador
) values
(
  'c980b310-c47f-4f3a-a3c6-95e0b8c3ad28', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Cuales son los cuatro tipos fundamentales de tejido en el cuerpo humano?',
  $$[{"text":"Epitelial, conectivo, muscular y nervioso","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Oseo, cartilaginoso, adiposo y sanguineo","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Cutaneo, visceral, articular y vascular","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Glandular, tendinoso, nervioso y oseo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"}]$$::jsonb,
  false, 1, 1, 45
),
(
  '07c5fce1-623c-4cf0-95bd-04914e48fa39', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Que funcion caracteriza mejor al tejido epitelial?',
  $$[{"text":"Cubrir superficies, revestir cavidades y formar glandulas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Transmitir impulsos electricos a larga distancia","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Contraerse para producir movimiento","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Formar una matriz extracelular abundante","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"}]$$::jsonb,
  false, 2, 1, 45
),
(
  'bd9e90dd-1336-4435-8216-336b23b2588c', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Cual es una caracteristica distintiva del tejido conectivo?',
  $$[{"text":"Posee abundante matriz extracelular entre sus celulas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Siempre forma capas avasculares de celulas apretadas","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Esta compuesto solo por neuronas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"No contiene fibras de ningun tipo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"}]$$::jsonb,
  false, 3, 1, 45
),
(
  'de48672c-0c29-4518-9518-baadbad06088', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Donde se encuentra el musculo cardiaco?',
  $$[{"text":"En la pared del corazon","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"En los tendones","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"En la epidermis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"En los nervios perifericos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"}]$$::jsonb,
  false, 4, 1, 45
),
(
  'b761b450-d71d-4af0-bf51-25598dab5132', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Cual celula es la principal responsable de recibir y transmitir senales en el tejido nervioso?',
  $$[{"text":"La neurona","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"El fibroblasto","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"El adipocito","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"El queratinocito","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"}]$$::jsonb,
  false, 5, 1, 45
),
(
  '8c450605-c67a-4500-9c62-dbc99ebe2c8d', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Como se nutre el epitelio, que carece de vasos sanguineos propios?',
  $$[{"text":"Por difusion desde el tejido conectivo subyacente","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Por arterias que recorren cada capa epitelial","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Por impulsos enviados por las neuronas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"No requiere nutrientes porque no tiene metabolismo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"}]$$::jsonb,
  false, 6, 1, 45
),
(
  'e2f8afe3-036f-4f8d-88ec-8752dfd1b14b', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Que tipo de epitelio es especialmente delgado y adecuado para intercambio rapido por difusion?',
  $$[{"text":"Epitelio simple plano","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Epitelio estratificado plano queratinizado","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Tejido conectivo denso regular","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Musculo esqueletico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"}]$$::jsonb,
  false, 7, 1, 45
),
(
  '07d039c6-fc3e-4e0b-bb85-5a1e7172b8e4', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Cual es la principal ventaja funcional del epitelio estratificado plano?',
  $$[{"text":"Resistir la abrasion al tener varias capas de celulas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Contraerse de manera involuntaria","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Conducir senales electricas entre organos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Almacenar grasa como funcion principal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"}]$$::jsonb,
  false, 8, 1, 45
),
(
  'a98a713b-893c-4a96-9b44-661b68d78380', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Que tejido conectivo forma tendones, con fibras de colageno ordenadas en paralelo?',
  $$[{"text":"Tejido conectivo denso regular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Tejido adiposo","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Epitelio de transicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Tejido nervioso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"}]$$::jsonb,
  false, 9, 1, 45
),
(
  '7761a9ec-ab34-4998-b028-6c4959bc24b0', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Cual es una funcion importante del cartilago hialino en las superficies articulares?',
  $$[{"text":"Reducir la friccion y distribuir cargas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Producir potenciales de accion","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Secretar queratina para la piel","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Generar movimientos voluntarios","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"}]$$::jsonb,
  false, 10, 1, 45
),
(
  '67cd9b99-707b-4476-bd03-6df5ae073d3f', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Que rasgo permite reconocer al musculo esqueletico en una preparacion histologica?',
  $$[{"text":"Fibras largas estriadas y varios nucleos perifericos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Celulas fusiformes sin estriaciones","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Celulas ramificadas con discos intercalares","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Una capa de celulas sobre membrana basal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"}]$$::jsonb,
  false, 11, 1, 45
),
(
  '74c35250-2bdb-408a-8a6b-b55f5336e9e7', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Que combinacion identifica correctamente al musculo cardiaco?',
  $$[{"text":"Celulas estriadas, ramificadas y con discos intercalares","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Celulas fusiformes con un nucleo y sin estriaciones","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Fibras largas multinucleadas de control voluntario","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Capa avascular que reviste cavidades","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"}]$$::jsonb,
  false, 12, 1, 45
),
(
  '0b14e99e-a9e5-4fd5-915d-fe59ffa0b3c7', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'mc',
  'Cual descripcion corresponde al musculo liso?',
  $$[{"text":"Celulas fusiformes, no estriadas, de contraccion involuntaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Fibras ramificadas con discos intercalares","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Neuronas con dendritas y axon","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Capas de celulas con polaridad apical-basal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"}]$$::jsonb,
  false, 13, 1, 45
),
(
  'f08e0535-9cfd-4470-af16-dad7f5504020', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'ms',
  'Selecciona las caracteristicas propias de la mayoria de los epitelios.',
  $$[{"text":"Presentan polaridad apical-basal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Se apoyan sobre una membrana basal","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Carecen de vasos sanguineos propios","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Tienen mucha matriz extracelular entre celulas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"}]$$::jsonb,
  true, 14, 1, 50
),
(
  'e4686efd-32ce-40ea-88da-d36ea4f7dab7', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'ms',
  'Selecciona los ejemplos de tejido conectivo especializado.',
  $$[{"text":"Tejido adiposo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Cartilago","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Hueso","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Sangre","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Epidermis","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"}]$$::jsonb,
  true, 15, 1, 50
),
(
  'd631bd8b-5b42-4a3a-9843-f8859520aa3d', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'ms',
  'Selecciona funciones que puede cumplir el tejido conectivo.',
  $$[{"text":"Sostener y unir estructuras","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Proteger organos","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Almacenar energia en forma de grasa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Transportar sustancias mediante la sangre","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Generar los impulsos nerviosos como funcion principal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"}]$$::jsonb,
  true, 16, 1, 50
),
(
  '02eea44d-edc9-4752-9b86-642d1c8b121a', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'ms',
  'Selecciona las afirmaciones correctas sobre los tipos de musculo.',
  $$[{"text":"El musculo esqueletico es estriado","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"El musculo cardiaco posee discos intercalares","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"El musculo liso participa en paredes de organos huecos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"El musculo cardiaco y el liso actuan de modo involuntario","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"El musculo liso presenta estriaciones visibles","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"}]$$::jsonb,
  true, 17, 1, 50
),
(
  '56791af9-9f0d-4f3a-b820-d08726db3cef', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'ms',
  'Selecciona las afirmaciones correctas sobre el tejido nervioso.',
  $$[{"text":"Las neuronas reciben, integran y transmiten informacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"La glia brinda soporte y ayuda a mantener el entorno neuronal","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"El axon conduce senales desde el cuerpo celular hacia otras celulas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"Todas las neuronas se dividen con frecuencia durante la vida adulta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"}]$$::jsonb,
  true, 18, 1, 50
),
(
  '81805959-de2d-4f62-ba31-8c469c0e4067', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'ms',
  'Selecciona las afirmaciones correctas sobre la clasificacion de los epitelios.',
  $$[{"text":"Simple indica una sola capa de celulas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Estratificado indica dos o mas capas celulares","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Plano, cubico y cilindrico describen la forma celular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Todo epitelio estratificado es queratinizado","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"}]$$::jsonb,
  true, 19, 1, 50
),
(
  '6224bb40-ca07-46cd-8f7a-50ec5217b5ba', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'ms',
  'Selecciona las afirmaciones correctas sobre membranas formadas por tejidos.',
  $$[{"text":"La piel combina un epitelio con tejido conectivo subyacente","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Las mucosas revisten conductos que se abren al exterior","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Las serosas reducen la friccion entre organos en cavidades cerradas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Las membranas sinoviales son ejemplos de membranas de tejido conectivo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Toda membrana del cuerpo esta formada solo por tejido nervioso","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"}]$$::jsonb,
  true, 20, 1, 50
),
(
  '140b3e78-3889-4ba5-b44a-a7b916b1fc27', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'ms',
  'Selecciona las relaciones correctas entre capas embrionarias y tejidos.',
  $$[{"text":"El ectodermo origina principalmente el tejido nervioso","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"El mesodermo origina la mayor parte del musculo y del tejido conectivo","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"El epitelio puede derivar de cualquiera de las tres capas embrionarias","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Todos los tejidos derivan exclusivamente del mesodermo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"}]$$::jsonb,
  true, 21, 1, 50
),
(
  '9f266a7a-a69d-406c-bc85-d13fbc2897e7', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'tf',
  'Verdadero o falso: el tejido conectivo suele tener mas matriz extracelular que el tejido epitelial.',
  $$[{"text":"Verdadero","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Falso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"}]$$::jsonb,
  false, 22, 1, 40
),
(
  'ccdf7c6e-390c-4a13-8a0b-fc4e57b42d6e', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'tf',
  'Verdadero o falso: tanto el musculo liso como el cardiaco son tejidos estriados.',
  $$[{"text":"Verdadero","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Falso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"}]$$::jsonb,
  false, 23, 1, 40
),
(
  '597ef1bc-f89a-4475-899f-917ccc6c18a2', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'tf',
  'Verdadero o falso: la glia aporta soporte esencial al funcionamiento de las neuronas.',
  $$[{"text":"Verdadero","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"Falso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"}]$$::jsonb,
  false, 24, 1, 40
),
(
  '6dd41c00-3394-49e7-9d8b-92bf909e84eb', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'dnd',
  'Relaciona cada panel del atlas con su tipo fundamental de tejido.',
  $$[{"text":"Tejido epitelial","correct":true,"color":"ac-blue","pinX":25,"pinY":25,"pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Tejido conectivo","correct":true,"color":"ac-green","pinX":75,"pinY":25,"pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Tejido muscular","correct":true,"color":"ac-yellow","pinX":25,"pinY":75,"pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Tejido nervioso","correct":true,"color":"ac-pink","pinX":75,"pinY":75,"pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"}]$$::jsonb,
  false, 25, 1, 60
),
(
  'c34669b1-8f20-4825-a0b9-5d11dac6bb2f', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'dnd',
  'Relaciona las estructuras visibles del tejido epitelial.',
  $$[{"text":"Capa epitelial","correct":true,"color":"ac-blue","pinX":50,"pinY":30,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Membrana basal","correct":true,"color":"ac-green","pinX":50,"pinY":54,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"},{"text":"Tejido conectivo subyacente","correct":true,"color":"ac-yellow","pinX":50,"pinY":76,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-epitelial.png"}]$$::jsonb,
  false, 26, 1, 60
),
(
  '6a75d63a-23ad-43ed-aec3-b9fa9de9def8', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'dnd',
  'Relaciona los componentes principales del tejido conectivo laxo ilustrado.',
  $$[{"text":"Fibras de colageno","correct":true,"color":"ac-blue","pinX":64,"pinY":35,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Fibroblasto","correct":true,"color":"ac-green","pinX":30,"pinY":52,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"},{"text":"Adipocito","correct":true,"color":"ac-yellow","pinX":16,"pinY":52,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-conectivo.png"}]$$::jsonb,
  false, 27, 1, 60
),
(
  '96af0adf-118b-4da5-ab4b-6a17e9e21293', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'dnd',
  'Relaciona cada franja de la imagen con el tipo de musculo correspondiente.',
  $$[{"text":"Musculo esqueletico","correct":true,"color":"ac-blue","pinX":50,"pinY":17,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Musculo cardiaco","correct":true,"color":"ac-green","pinX":50,"pinY":50,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"},{"text":"Musculo liso","correct":true,"color":"ac-yellow","pinX":50,"pinY":83,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-muscular.png"}]$$::jsonb,
  false, 28, 1, 60
),
(
  'a0998692-8cbb-4765-8729-2c53b0e1978f', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'dnd',
  'Relaciona las partes de la neurona ilustrada.',
  $$[{"text":"Dendritas","correct":true,"color":"ac-blue","pinX":25,"pinY":18,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"Cuerpo celular o soma","correct":true,"color":"ac-green","pinX":34,"pinY":34,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"Vaina de mielina","correct":true,"color":"ac-yellow","pinX":55,"pinY":55,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"},{"text":"Axon","correct":true,"color":"ac-pink","pinX":73,"pinY":84,"pregunta_imagen":"/juegos/assets/tipos-tejidos/tejido-nervioso.png"}]$$::jsonb,
  false, 29, 1, 60
),
(
  'b765f57c-b14f-4676-8b01-f4a99181e92c', '1dfcbdd6-e615-47d3-9f8f-cdee8a9d89c1', 'dnd',
  'Relaciona cada tejido del atlas con su funcion predominante.',
  $$[{"text":"Revestir y proteger superficies","correct":true,"color":"ac-blue","pinX":25,"pinY":25,"pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Sostener, unir y proteger","correct":true,"color":"ac-green","pinX":75,"pinY":25,"pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Contraerse para producir movimiento","correct":true,"color":"ac-yellow","pinX":25,"pinY":75,"pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"},{"text":"Recibir y transmitir informacion","correct":true,"color":"ac-pink","pinX":75,"pinY":75,"pregunta_imagen":"/juegos/assets/tipos-tejidos/atlas-cuatro-tejidos.png"}]$$::jsonb,
  false, 30, 1, 60
);

commit;
