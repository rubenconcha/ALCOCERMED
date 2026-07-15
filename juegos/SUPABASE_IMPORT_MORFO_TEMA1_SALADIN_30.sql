-- Importa Tema 1 de Morfofuncion (Saladin, Anatomia y Fisiologia) con 30 preguntas visuales.
-- La evaluacion muestra 10 preguntas por intento desde un banco de 30.
-- Tipos incluidos: seleccion unica (mc), seleccion multiple (ms), verdadero/falso (tf) y relacionar sobre imagen (dnd).
--
-- Requisitos:
-- 1) Desplegar la carpeta: juegos/assets/capitulo1-tema1-saladin/
-- 2) Ejecutar este archivo en Supabase SQL Editor.
-- 3) Entrar a Juegos > MORFOFUNCION > "Tema 1 Morfofuncion - Anatomia y fisiologia".

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
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'Tema 1 Morfofuncion - Anatomia y fisiologia',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Repasar conceptos esenciales del tema 1: anatomia, fisiologia, metodo cientifico, homeostasis, terminologia, regiones, cavidades y sistemas corporales.',
  'T1MORF',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(),
  now(),
  true,
  'Tema 1: Temas principales de anatomia y fisiologia',
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
where evaluacion_id = '0a8ea035-007e-5aaf-b891-e43f5402fa56';

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
  'cdb01b7f-bc1c-5bac-892f-f4845682b3d8',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'Segun el tema 1, la anatomia se ocupa principalmente de:',
  $$[
    {"text":"La forma y estructura del cuerpo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"La funcion experimental de los organos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"El tratamiento farmacologico de enfermedades","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"La composicion quimica de los alimentos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"}
  ]$$::jsonb,
  false,
  0,
  1,
  45
),
(
  '33968fe3-4086-56a1-bda5-98c755dae66d',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'La fisiologia estudia sobre todo:',
  $$[
    {"text":"La funcion corporal y sus mecanismos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"Solo nombres de regiones externas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"Solo la diseccion de cadaveres","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"La clasificacion comercial de equipos medicos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"}
  ]$$::jsonb,
  false,
  1,
  1,
  45
),
(
  '960a5cdf-518c-547e-b197-9b071f87b2f3',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'La radiologia es relevante porque permite:',
  $$[
    {"text":"Ver el interior del cuerpo sin cirugia exploratoria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_23.png"},
    {"text":"Reemplazar toda exploracion microscopica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_23.png"},
    {"text":"Observar solo celulas individuales vivas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_23.png"},
    {"text":"Evitar cualquier necesidad de diagnostico clinico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_23.png"}
  ]$$::jsonb,
  false,
  2,
  1,
  45
),
(
  '7ec65f72-704f-546d-94a7-e16c9104042b',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'ms',
  'Selecciona campos relacionados con el estudio microscopico descrito en el tema.',
  $$[
    {"text":"Histologia","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"Citologia","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"Ultraestructura","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"Astrologia zodiacal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"},
    {"text":"Topografia comercial","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_03.png"}
  ]$$::jsonb,
  true,
  3,
  1,
  50
),
(
  '8ab550d2-326f-58bc-9844-44f923ccea85',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'ms',
  'Selecciona aportes historicos que impulsaron la medicina moderna.',
  $$[
    {"text":"Vesalius realizo disecciones y publico ilustraciones anatomicas exactas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_05.png"},
    {"text":"Hooke y Leeuwenhoek abrieron el estudio microscopico de la vida","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_06.png"},
    {"text":"La tradicion dogmatica de no cuestionar libros antiguos acelero la ciencia","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_05.png"},
    {"text":"La observacion directa ayudo a corregir errores anatomicos heredados","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_05.png"},
    {"text":"La diseccion humana nunca fue importante para la anatomia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_05.png"}
  ]$$::jsonb,
  true,
  4,
  1,
  55
),
(
  '45e95ab8-e181-5647-8d11-0e31d6091ddb',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'En el metodo hipotetico-deductivo, el orden mas adecuado es:',
  $$[
    {"text":"Pregunta, hipotesis, prediccion y experimento","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_08.png"},
    {"text":"Conclusion, dogma, autoridad y memorizacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_08.png"},
    {"text":"Experimento, supersticion, hipotesis y mito","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_08.png"},
    {"text":"Revision externa antes de formular cualquier pregunta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_08.png"}
  ]$$::jsonb,
  false,
  5,
  1,
  45
),
(
  '2a98c39a-21ef-5658-831d-405968f64bd4',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'tf',
  'Una hipotesis cientifica debe poder ponerse a prueba y, en principio, refutarse.',
  $$[
    {"text":"Verdadero","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_08.png"},
    {"text":"Falso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_08.png"}
  ]$$::jsonb,
  false,
  6,
  1,
  35
),
(
  '5746871e-ad26-5ef6-83c7-af62ec68c787',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'ms',
  'En un experimento bien disenado, selecciona elementos que aumentan la confiabilidad.',
  $$[
    {"text":"Grupo control","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_09.png"},
    {"text":"Placebo cuando corresponde","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_09.png"},
    {"text":"Analisis estadistico de los resultados","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_09.png"},
    {"text":"Aceptar diferencias sin medir variacion aleatoria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_09.png"},
    {"text":"Cambiar la hipotesis para que siempre salga verdadera","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_09.png"}
  ]$$::jsonb,
  true,
  7,
  1,
  55
),
(
  '832f8e4b-0d55-56a5-9d08-2bc9d8125b11',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'En biologia, evolucion significa:',
  $$[
    {"text":"Cambio en la composicion genetica de una poblacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_10.png"},
    {"text":"Mejora intencional de cada individuo durante su vida","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_10.png"},
    {"text":"Aparicion espontanea de organos por necesidad inmediata","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_10.png"},
    {"text":"Desaparicion de toda variacion hereditaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_10.png"}
  ]$$::jsonb,
  false,
  8,
  1,
  45
),
(
  '8f630fca-fd8d-5f36-a685-76d0fffb7dd3',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'ms',
  'Selecciona adaptaciones basicas de los primates destacadas en el tema.',
  $$[
    {"text":"Pulgares oponibles","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_11.png"},
    {"text":"Ojos dirigidos hacia el frente con vision estereoscopica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_11.png"},
    {"text":"Hombros con gran movilidad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_11.png"},
    {"text":"Perdida de toda destreza manual","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_11.png"},
    {"text":"Ojos laterales sin profundidad visual","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_11.png"}
  ]$$::jsonb,
  true,
  9,
  1,
  55
),
(
  '0992930e-440c-56da-85e3-bc90d5a718de',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'Una ventaja funcional importante de la bipedestacion fue:',
  $$[
    {"text":"Liberar las extremidades superiores para transportar y manipular objetos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_12.png"},
    {"text":"Impedir la vigilancia del entorno","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_12.png"},
    {"text":"Eliminar la necesidad de cambios esqueleticos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_12.png"},
    {"text":"Disminuir por completo la capacidad de caminar","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_12.png"}
  ]$$::jsonb,
  false,
  10,
  1,
  45
),
(
  '6e86b795-0be5-5185-ab78-2bb61e5d6c9a',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'En la jerarquia estructural, el orden de menor a mayor complejidad es:',
  $$[
    {"text":"Atomo, molecula, organelo, celula, tejido, organo, sistema y organismo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_13.png"},
    {"text":"Organismo, celula, atomo, sistema, tejido y molecula","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_13.png"},
    {"text":"Organo, molecula, organismo, tejido, celula y atomo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_13.png"},
    {"text":"Tejido, sistema, molecula, organelo, atomo y celula","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_13.png"}
  ]$$::jsonb,
  false,
  11,
  1,
  50
),
(
  '3d207ebe-a814-5261-af35-1a236a5a4ce6',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'ms',
  'Selecciona caracteristicas de la vida humana descritas en el tema.',
  $$[
    {"text":"Organizacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_16.png"},
    {"text":"Metabolismo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_16.png"},
    {"text":"Homeostasis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_16.png"},
    {"text":"Ausencia total de respuesta a estimulos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_16.png"},
    {"text":"Incapacidad de desarrollo","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_16.png"}
  ]$$::jsonb,
  true,
  12,
  1,
  55
),
(
  'c1aed27d-f24a-5e0e-9838-bbf2278367a4',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'La retroalimentacion negativa se caracteriza por:',
  $$[
    {"text":"Oponerse al cambio y devolver la variable hacia su punto de ajuste","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_17.png"},
    {"text":"Amplificar siempre el estimulo hasta destruir el equilibrio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_17.png"},
    {"text":"Actuar solo durante el parto","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_17.png"},
    {"text":"No participar en la homeostasis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_17.png"}
  ]$$::jsonb,
  false,
  13,
  1,
  45
),
(
  '71ca829b-be20-5a69-a69e-6ac6d67e6279',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'tf',
  'La retroalimentacion positiva amplifica el cambio; el parto es un ejemplo clasico.',
  $$[
    {"text":"Verdadero","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_19.png"},
    {"text":"Falso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_19.png"}
  ]$$::jsonb,
  false,
  14,
  1,
  35
),
(
  '0a826865-73e9-55e9-8add-d68c3e0ea417',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'Ante aumento de temperatura corporal, una respuesta homeostatica esperada es:',
  $$[
    {"text":"Vasodilatacion cutanea y sudoracion para perder calor","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_17.png"},
    {"text":"Vasoconstriccion intensa y escalofrios para producir mas calor","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_17.png"},
    {"text":"Suspender toda perdida de calor por la piel","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_17.png"},
    {"text":"Aumentar la fiebre sin control por retroalimentacion negativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_17.png"}
  ]$$::jsonb,
  false,
  15,
  1,
  45
),
(
  'af49bcdf-62f7-59d6-bd91-dddd675e6d95',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'dnd',
  'Relaciona cada corte anatomico con la figura correspondiente.',
  $$[
    {"text":"Corte sagital","correct":true,"color":"ac-purple","pinX":17,"pinY":50,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_planos_cortes.png"},
    {"text":"Corte frontal","correct":true,"color":"ac-blue","pinX":50,"pinY":50,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_planos_cortes.png"},
    {"text":"Corte transversal","correct":true,"color":"ac-yellow","pinX":83,"pinY":50,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_planos_cortes.png"}
  ]$$::jsonb,
  false,
  16,
  1,
  60
),
(
  '599507b5-24ac-5a3c-b9f0-4a8aef881a5f',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'dnd',
  'Relaciona los huesos del antebrazo senalados en la imagen.',
  $$[
    {"text":"Radio","correct":true,"color":"ac-blue","pinX":28,"pinY":46,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_antebrazo_radio_cubito.png"},
    {"text":"Cubito","correct":true,"color":"ac-green","pinX":43,"pinY":47,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_antebrazo_radio_cubito.png"}
  ]$$::jsonb,
  false,
  17,
  1,
  45
),
(
  '0c28f10e-630b-5b61-9fc2-0f0b97c0cf92',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'En posicion anatomica correcta:',
  $$[
    {"text":"El sujeto esta de pie, mira al frente y las palmas se orientan hacia adelante","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_29.png"},
    {"text":"El sujeto esta acostado boca abajo con palmas hacia atras","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_29.png"},
    {"text":"Los pies estan elevados y las rodillas flexionadas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_29.png"},
    {"text":"La cabeza se gira hacia un lado para mostrar el perfil","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_29.png"}
  ]$$::jsonb,
  false,
  18,
  1,
  45
),
(
  '43a37c93-0802-5b15-92b4-b965066590f9',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'Cuando el antebrazo esta en supinacion:',
  $$[
    {"text":"La palma mira hacia adelante en posicion anatomica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_29.png"},
    {"text":"El radio cruza al cubito y la palma mira hacia atras","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_29.png"},
    {"text":"La mano queda siempre cerrada en puno","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_29.png"},
    {"text":"El codo se vuelve distal respecto a la muneca","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_29.png"}
  ]$$::jsonb,
  false,
  19,
  1,
  45
),
(
  '7ae73999-cc8f-5408-9a34-a83af84ca8e8',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'El plano transversal divide el cuerpo en porciones:',
  $$[
    {"text":"Superior e inferior","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"},
    {"text":"Anterior y posterior","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"},
    {"text":"Derecha e izquierda","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"},
    {"text":"Proximal y distal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"}
  ]$$::jsonb,
  false,
  20,
  1,
  45
),
(
  '6485b40c-6215-5cfb-8bea-6565f8a8bdf6',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'ms',
  'Selecciona pares de terminos direccionales correctamente relacionados.',
  $$[
    {"text":"Superior / inferior","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"},
    {"text":"Medial / lateral","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"},
    {"text":"Proximal / distal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"},
    {"text":"Pleural / cerebral","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"},
    {"text":"Sagital / peritoneal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_30.png"}
  ]$$::jsonb,
  true,
  21,
  1,
  50
),
(
  '9ffeb9be-3859-5eb9-8ce7-5adc80ae3b93',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'dnd',
  'Relaciona regiones corporales anteriores senaladas.',
  $$[
    {"text":"Region cefalica","correct":true,"color":"ac-blue","pinX":51,"pinY":8,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png"},
    {"text":"Region cervical","correct":true,"color":"ac-green","pinX":50,"pinY":19,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png"},
    {"text":"Region toracica","correct":true,"color":"ac-purple","pinX":50,"pinY":33,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png"},
    {"text":"Region umbilical","correct":true,"color":"ac-yellow","pinX":50,"pinY":49,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png"},
    {"text":"Region inguinal","correct":true,"color":"ac-pink","pinX":55,"pinY":63,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png"},
    {"text":"Region femoral","correct":true,"color":"ac-teal","pinX":55,"pinY":76,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png"}
  ]$$::jsonb,
  false,
  22,
  1,
  65
),
(
  '0891ca1e-d72c-5437-965b-790424516378',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'mc',
  'La region axial del cuerpo comprende principalmente:',
  $$[
    {"text":"Cabeza, cuello y tronco","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_32.png"},
    {"text":"Solo extremidades superiores","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_32.png"},
    {"text":"Solo extremidades inferiores","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_32.png"},
    {"text":"Unicamente manos y pies","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_32.png"}
  ]$$::jsonb,
  false,
  23,
  1,
  45
),
(
  'e7e58b8a-4cee-5835-b130-6b6719558fb3',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'dnd',
  'Relaciona los cuatro cuadrantes abdominales.',
  $$[
    {"text":"Cuadrante superior derecho","correct":true,"color":"ac-blue","pinX":37,"pinY":43,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cuadrantes_abdominales.png"},
    {"text":"Cuadrante superior izquierdo","correct":true,"color":"ac-yellow","pinX":62,"pinY":43,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cuadrantes_abdominales.png"},
    {"text":"Cuadrante inferior derecho","correct":true,"color":"ac-pink","pinX":37,"pinY":56,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cuadrantes_abdominales.png"},
    {"text":"Cuadrante inferior izquierdo","correct":true,"color":"ac-green","pinX":62,"pinY":56,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cuadrantes_abdominales.png"}
  ]$$::jsonb,
  false,
  24,
  1,
  60
),
(
  '46212a70-1276-590f-a4ee-aad28d5c4542',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'dnd',
  'Relaciona las nueve regiones abdominales principales.',
  $$[
    {"text":"Hipocondrio derecho","correct":true,"color":"ac-blue","pinX":28,"pinY":37,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region epigastrica","correct":true,"color":"ac-yellow","pinX":50,"pinY":37,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"},
    {"text":"Hipocondrio izquierdo","correct":true,"color":"ac-green","pinX":72,"pinY":37,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region lumbar derecha","correct":true,"color":"ac-purple","pinX":28,"pinY":51,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region umbilical","correct":true,"color":"ac-pink","pinX":50,"pinY":51,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region lumbar izquierda","correct":true,"color":"ac-purple","pinX":72,"pinY":51,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region inguinal derecha","correct":true,"color":"ac-teal","pinX":28,"pinY":65,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region hipogastrica","correct":true,"color":"ac-yellow","pinX":50,"pinY":65,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"},
    {"text":"Region inguinal izquierda","correct":true,"color":"ac-teal","pinX":72,"pinY":65,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png"}
  ]$$::jsonb,
  false,
  25,
  1,
  80
),
(
  '211f9b2c-7809-5e20-a8e3-ab2358d5fa04',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'dnd',
  'Relaciona las cavidades corporales principales.',
  $$[
    {"text":"Cavidad craneana","correct":true,"color":"ac-blue","pinX":43,"pinY":6,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cavidades_corporales.png"},
    {"text":"Conducto vertebral","correct":true,"color":"ac-green","pinX":63,"pinY":31,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cavidades_corporales.png"},
    {"text":"Cavidad toracica","correct":true,"color":"ac-purple","pinX":38,"pinY":34,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cavidades_corporales.png"},
    {"text":"Cavidad abdominal","correct":true,"color":"ac-pink","pinX":37,"pinY":60,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cavidades_corporales.png"},
    {"text":"Cavidad pelvica","correct":true,"color":"ac-yellow","pinX":47,"pinY":75,"pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/cap1_cavidades_corporales.png"}
  ]$$::jsonb,
  false,
  26,
  1,
  65
),
(
  '8f6cac53-0b1f-5687-a81e-470d7cdfb4aa',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'ms',
  'Selecciona membranas serosas descritas para cavidades corporales.',
  $$[
    {"text":"Pleura","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_35.png"},
    {"text":"Pericardio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_35.png"},
    {"text":"Peritoneo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_35.png"},
    {"text":"Meninges como membrana serosa toracica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_35.png"},
    {"text":"Mediastino como capa visceral del pulmon","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_35.png"}
  ]$$::jsonb,
  true,
  27,
  1,
  55
),
(
  'b7ed455f-5cf7-5708-b5d3-dacfc57de727',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'ms',
  'Selecciona asociaciones correctas entre sistema de organos y funcion principal.',
  $$[
    {"text":"Sistema endocrino: produccion de hormonas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_39.png"},
    {"text":"Sistema nervioso: comunicacion interna rapida y control","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_39.png"},
    {"text":"Sistema circulatorio: distribucion de nutrientes, oxigeno y hormonas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_39.png"},
    {"text":"Sistema digestivo: absorcion de oxigeno y eliminacion de CO2","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_39.png"},
    {"text":"Sistema reproductor: regulacion principal del equilibrio acidobasico sanguineo","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_39.png"}
  ]$$::jsonb,
  true,
  28,
  1,
  55
),
(
  '3b21829e-1c4e-51e7-8b90-85c2d2c27010',
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'tf',
  'La variacion anatomica es siempre patologica y casi nunca aparece en personas sanas.',
  $$[
    {"text":"Verdadero","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_15.png"},
    {"text":"Falso","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo1-tema1-saladin/tema1_page_15.png"}
  ]$$::jsonb,
  false,
  29,
  1,
  35
);

commit;
