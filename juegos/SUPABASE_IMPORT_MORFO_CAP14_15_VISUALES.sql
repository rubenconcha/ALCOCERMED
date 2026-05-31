-- Importa evaluaciones visuales de Morfofuncion: pares craneales, SNA y reflejos viscerales.
-- Cada evaluacion tiene 20 preguntas y muestra 10 por intento con maxQuestions.
-- Imagenes locales en juegos/assets/capitulo14-pares-craneales, capitulo15-sistema-nervioso-autonomo y capitulo15-reflejos-viscerales.

begin;

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'Capitulo 14 Morfofuncion - pares craneales',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Identificar pares craneales, funciones, divisiones y trayectos con imagenes del texto oficial.',
  'PC14M',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(),
  now(),
  true,
  'Capitulo 14: encefalo y pares craneales',
  'test',
  '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;

delete from public.evaluacion_preguntas where evaluacion_id = 'e861bbdc-c7a2-e11e-5797-1ccd25784835';

insert into public.evaluacion_preguntas (
  id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador
) values
(
  '5adb5110-cd0d-217d-feed-86c5104ff79e',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'En la imagen, el nervio olfatorio (I) se relaciona principalmente con:',
  '[{"text":"Olfato","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_olfatorio.png"},{"text":"Audicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_olfatorio.png"},{"text":"Deglucion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_olfatorio.png"},{"text":"Movimiento lateral del ojo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_olfatorio.png"}]'::jsonb,
  false, 0, 1, 45
),
(
  '7b8c6bd0-85bb-7245-75ec-71785b31d8bd',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'En la base del encefalo, el nervio optico corresponde al par craneal:',
  '[{"text":"II","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_optico.png"},{"text":"III","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_optico.png"},{"text":"V","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_optico.png"},{"text":"VIII","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_optico.png"}]'::jsonb,
  false, 1, 1, 45
),
(
  'f398b23b-6ec9-e3b5-895a-4b52822ee406',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'La figura del nervio motor ocular comun orienta a que funcion principal?',
  '[{"text":"Movimientos oculares y control pupilar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"},{"text":"Audicion y equilibrio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"},{"text":"Sensibilidad facial principal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"},{"text":"Movimientos de la lengua","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"}]'::jsonb,
  false, 2, 1, 45
),
(
  '8925313a-f890-a872-a6d5-05be9f9f6498',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'En la imagen del trigemino, la division mandibular se representa como:',
  '[{"text":"V3","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"V1","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"V2","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"VII","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"}]'::jsonb,
  false, 3, 1, 45
),
(
  'f856e6f9-84c9-347d-c625-73a4e9e7483b',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'La figura del nervio facial destaca un par craneal que controla sobre todo:',
  '[{"text":"Expresion facial","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png"},{"text":"Vision central","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png"},{"text":"Audicion pura","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png"},{"text":"Abduccion del ojo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png"}]'::jsonb,
  false, 4, 1, 45
),
(
  '57afb68a-da63-c7e7-b1c2-27876ba501b5',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El nervio auditivo o vestibulococlear (VIII) se asocia con:',
  '[{"text":"Audicion y equilibrio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png"},{"text":"Olfato","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png"},{"text":"Movimientos del trapecio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png"},{"text":"Motilidad intestinal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png"}]'::jsonb,
  false, 5, 1, 45
),
(
  '84a8bf9d-3b73-0554-7888-9ada15a33434',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'En la imagen, el nervio vago (X) se caracteriza por inervar ampliamente:',
  '[{"text":"Visceras toracicas y abdominopelvicas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"Solo musculos extraoculares","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"Solo piel de la cara","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"Solo la retina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"}]'::jsonb,
  false, 6, 1, 45
),
(
  '4f5893ab-645a-bbce-bb6a-1c663264c65c',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'En la figura inferior, el nervio hipogloso (XII) controla principalmente:',
  '[{"text":"Movimientos de la lengua","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png"},{"text":"Olfato","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png"},{"text":"Audicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png"},{"text":"Glandula lagrimal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png"}]'::jsonb,
  false, 7, 1, 45
),
(
  'af26af5a-676c-14e8-64d1-c63683981dff',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Selecciona los pares craneales sensitivos principales que aparecen en el cuadro.',
  '[{"text":"I olfatorio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"II optico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"VIII vestibulococlear","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"XI accesorio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"XII hipogloso","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  true, 8, 1, 45
),
(
  '8ef62a8a-e7be-a099-68ba-698628e1cb0c',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Segun las figuras, cuales pares craneales son motores de manera predominante?',
  '[{"text":"III motor ocular comun","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"},{"text":"IV patetico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"},{"text":"VI motor ocular externo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"},{"text":"XI accesorio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"},{"text":"I olfatorio","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png"}]'::jsonb,
  true, 9, 1, 45
),
(
  '75fbb75c-2e68-0768-b8ad-9761e42d6092',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'En el nervio trigemino, que divisiones forman el territorio sensitivo facial mostrado?',
  '[{"text":"Oftalmica V1","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"Maxilar V2","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"Mandibular V3","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"Vago X","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"Accesorio XI","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"}]'::jsonb,
  true, 10, 1, 45
),
(
  '1c97389b-fd4f-db4b-e283-b191bceb3a4e',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Que pares craneales llevan fibras parasimpaticas hacia organos de la cabeza o visceras?',
  '[{"text":"III","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"VII","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"IX","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"X","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"XII","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"}]'::jsonb,
  true, 11, 1, 45
),
(
  '67402142-86f6-0fc8-c7fc-13fe68cb118a',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona los principales pares craneales en la vista basal mostrada.',
  '[{"text":"I olfatorio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":45,"pinY":17},{"text":"II optico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":47,"pinY":30},{"text":"III oculomotor","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":53,"pinY":39},{"text":"V trigemino","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":53,"pinY":51},{"text":"VII facial","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":54,"pinY":61},{"text":"X vago","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":55,"pinY":75},{"text":"XII hipogloso","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":56,"pinY":82}]'::jsonb,
  false, 12, 1, 60
),
(
  'cf18aa86-038d-3f6e-cbf5-7ffe0b246fe2',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona las divisiones del nervio trigemino.',
  '[{"text":"Division oftalmica V1","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":70,"pinY":22},{"text":"Division maxilar V2","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":70,"pinY":31},{"text":"Division mandibular V3","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":70,"pinY":41},{"text":"Ganglio trigemino","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":60,"pinY":20},{"text":"Ramas motoras de V3","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":67,"pinY":72}]'::jsonb,
  false, 13, 1, 60
),
(
  '6d49c382-ac73-382b-4b0b-9e30df3b088a',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona las cinco ramas terminales del nervio facial.',
  '[{"text":"Temporal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":59,"pinY":72},{"text":"Cigomatico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":58,"pinY":77},{"text":"Bucal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":56,"pinY":83},{"text":"Mandibular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":58,"pinY":89},{"text":"Cervical","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":60,"pinY":94}]'::jsonb,
  false, 14, 1, 60
),
(
  'd4d8ed69-0289-669a-020f-883c2438a086',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona destinos o referencias del nervio vago.',
  '[{"text":"Agujero yugular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":67,"pinY":22},{"text":"Nervio laringeo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":69,"pinY":36},{"text":"Corazon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":57,"pinY":56},{"text":"Estomago","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":49,"pinY":78},{"text":"Intestino delgado","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":72,"pinY":86}]'::jsonb,
  false, 15, 1, 60
),
(
  '4504cfbe-b420-90ff-0cd5-019f06c02330',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona estructuras del nervio motor ocular comun y patetico.',
  '[{"text":"Nervio III","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png","pinX":73,"pinY":16},{"text":"Rama superior","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png","pinX":74,"pinY":23},{"text":"Rama inferior","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png","pinX":74,"pinY":29},{"text":"Ganglio ciliar","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png","pinX":74,"pinY":36},{"text":"Nervio IV","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_oculomotores.png","pinX":40,"pinY":88}]'::jsonb,
  false, 16, 1, 60
),
(
  'b3104adf-d65c-ad86-9ba8-89db70c3747d',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona estructuras de los nervios accesorio e hipogloso.',
  '[{"text":"Nervio accesorio XI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":61,"pinY":22},{"text":"Musculo esternocleidomastoideo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":64,"pinY":36},{"text":"Trapecio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":64,"pinY":44},{"text":"Canal hipogloso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":54,"pinY":78},{"text":"Nervio hipogloso XII","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":55,"pinY":92}]'::jsonb,
  false, 17, 1, 60
),
(
  '9b73b84f-0b16-c41c-4c7d-9f25bc6d7a6e',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona nervios de audicion, deglucion y salivacion.',
  '[{"text":"Nervio auditivo VIII","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":78,"pinY":26},{"text":"Caracol","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":75,"pinY":38},{"text":"Vestibulo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":75,"pinY":43},{"text":"Nervio glosofaringeo IX","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":82,"pinY":77},{"text":"Seno carotideo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":83,"pinY":91}]'::jsonb,
  false, 18, 1, 60
),
(
  'e6ee3945-3f7b-78a7-3c2e-a252d2202574',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona numeros romanos con los pares craneales destacados.',
  '[{"text":"II optico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":50,"pinY":31},{"text":"V trigemino","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":54,"pinY":50},{"text":"VII facial","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":55,"pinY":61},{"text":"IX glosofaringeo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":55,"pinY":70},{"text":"X vago","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":56,"pinY":75},{"text":"XI accesorio","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":57,"pinY":88}]'::jsonb,
  false, 19, 1, 60
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'Capitulo 15 Morfofuncion - sistema nervioso autonomo',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Reconocer divisiones, rutas, ganglios, neurotransmisores y organos diana del sistema nervioso autonomo.',
  'SNA15M',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(),
  now(),
  true,
  'Capitulo 15: sistema nervioso autonomo',
  'test',
  '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;

delete from public.evaluacion_preguntas where evaluacion_id = '4a2549a4-e070-34c8-2513-5cdada997302';

insert into public.evaluacion_preguntas (
  id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador
) values
(
  'ca933b94-207b-b98e-a6ba-afaab8b2ae7e',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La comparacion mostrada indica que la ruta autonoma eferente utiliza:',
  '[{"text":"Dos neuronas y un ganglio neurovegetativo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Una sola motoneurona somatica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Solo fibras sensitivas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Solo musculo esqueletico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  false, 0, 1, 45
),
(
  '8db1a4ad-a2c7-bb54-9250-9f9291ebe215',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La division simpatica del sistema nervioso autonomo se describe como:',
  '[{"text":"Toracolumbar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Craneosacra","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Solo cortical","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Exclusivamente somatica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"}]'::jsonb,
  false, 1, 1, 45
),
(
  '304b15f0-efe9-cc8f-fd11-fc3bd432ed1a',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La division parasimpatica se reconoce por su salida:',
  '[{"text":"Craneosacra","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Toracolumbar","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Solo cervical","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Solo lumbar","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"}]'::jsonb,
  false, 2, 1, 45
),
(
  'a5c11311-10b0-8785-3b45-dd69a208a0c4',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'En el esquema simpatico, las fibras posganglionares se muestran principalmente en color:',
  '[{"text":"Rojo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Azul","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Morado","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Negro","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"}]'::jsonb,
  false, 3, 1, 45
),
(
  'a6a0ed9b-16ca-cd28-cfe2-b4f3b5ad322c',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La figura de la cadena simpatica muestra que las fibras preganglionares pueden entrar mediante:',
  '[{"text":"Rama comunicante blanca","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png"},{"text":"Nervio optico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png"},{"text":"Conducto auditivo interno","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png"},{"text":"Canal hipogloso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png"}]'::jsonb,
  false, 4, 1, 45
),
(
  'ba7bf25a-069f-b4de-f95a-59ddfc5068a1',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'En los componentes abdominopelvicos simpaticos, la glandula suprarrenal destacada participa por su:',
  '[{"text":"Medula suprarrenal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png"},{"text":"Corteza visual","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png"},{"text":"Retina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png"},{"text":"Vestibulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png"}]'::jsonb,
  false, 5, 1, 45
),
(
  '1d8af791-efc6-42cc-e524-69a3cf07536e',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'En el parasimpatico general, que par craneal aporta la mayor distribucion hacia torax y abdomen?',
  '[{"text":"Nervio vago X","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Nervio olfatorio I","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Nervio optico II","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Nervio accesorio XI","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"}]'::jsonb,
  false, 6, 1, 45
),
(
  '26b464bf-6b04-3f81-dd44-238d2f10eae4',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'En el esquema de neurotransmisores, la fibra adrenergica simpatica posganglionar libera sobre todo:',
  '[{"text":"Norepinefrina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Dopamina retinal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Melatonina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Glicina muscular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"}]'::jsonb,
  false, 7, 1, 45
),
(
  '6b6b0ef6-235b-f888-19f9-33a65a9819ef',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Selecciona efectos tipicos de activacion simpatica mostrados o inferidos por las figuras.',
  '[{"text":"Aumento de actividad cardiaca","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Broncodilatacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Movilizacion de energia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Disminucion marcada de alerta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Constriccion pupilar parasimpatica","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"}]'::jsonb,
  true, 8, 1, 45
),
(
  '1b957c23-005a-18da-f829-882d50bb2fb4',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Selecciona efectos parasimpaticos compatibles con el esquema.',
  '[{"text":"Favorecer digestion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Estimular miccion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Conservar energia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Dilatar pupila por via adrenergica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Aumentar tono simpatico general","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"}]'::jsonb,
  true, 9, 1, 45
),
(
  '23d46e9b-c541-f88e-297c-1d88b62f7986',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'En las rutas autonomas, que afirmaciones son correctas?',
  '[{"text":"La fibra preganglionar sale del SNC","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Existe sinapsis en un ganglio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"La fibra posganglionar llega al efector visceral","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Siempre hay una sola neurona desde SNC al efector","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"El efector exclusivo es musculo esqueletico","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  true, 10, 1, 45
),
(
  '9e74681a-59e1-0961-6639-3af523b97573',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Segun el esquema de neurotransmisores, cuales receptores o transmisores corresponden al ANS?',
  '[{"text":"ACh","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"NE","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Receptor nicotinico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Receptor muscarinico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Rodopsina","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"}]'::jsonb,
  true, 11, 1, 45
),
(
  'e0c914e1-4432-67e0-e910-5fcca71a5624',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona destinos principales de la division simpatica.',
  '[{"text":"Corazon","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":72,"pinY":36},{"text":"Pulmon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":75,"pinY":49},{"text":"Ganglio celiaco","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":50,"pinY":51},{"text":"Intestino delgado","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":74,"pinY":70},{"text":"Vejiga urinaria","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":72,"pinY":93},{"text":"Cadena simpatica","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":24,"pinY":72}]'::jsonb,
  false, 12, 1, 60
),
(
  '793981df-e921-5793-dad3-a95a97fa0a3c',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona destinos principales de la division parasimpatica.',
  '[{"text":"Nervio vago X","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":35,"pinY":35},{"text":"Plexo cardiaco","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":40,"pinY":40},{"text":"Estomago","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":74,"pinY":55},{"text":"Colon descendente","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":76,"pinY":73},{"text":"Nervios pelvicos","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":43,"pinY":83},{"text":"Vejiga urinaria","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":70,"pinY":91}]'::jsonb,
  false, 13, 1, 60
),
(
  '1003be2a-a96a-1a32-b283-be54738836ee',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona estructuras de la cadena simpatica.',
  '[{"text":"Fibra simpatica preganglionar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png","pinX":69,"pinY":35},{"text":"Fibra simpatica posganglionar","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png","pinX":73,"pinY":43},{"text":"Rama blanca","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png","pinX":67,"pinY":57},{"text":"Rama gris","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png","pinX":72,"pinY":57},{"text":"Tronco simpatico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png","pinX":80,"pinY":62},{"text":"Nervio esplacnico","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_cadena_simpatica.png","pinX":36,"pinY":68}]'::jsonb,
  false, 14, 1, 60
),
(
  '8e4d28fe-df94-7711-80e1-5561369f88df',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona neurotransmisores y receptores autonomos.',
  '[{"text":"ACh preganglionar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":30,"pinY":17},{"text":"Receptor nicotinico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":57,"pinY":13},{"text":"NE posganglionar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":70,"pinY":54},{"text":"Receptor adrenergico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":82,"pinY":61},{"text":"Receptor muscarinico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":82,"pinY":91}]'::jsonb,
  false, 15, 1, 60
),
(
  'fe7fde5a-79c4-146e-048b-79a6e4e8c42d',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona los componentes de la inervacion dual del iris.',
  '[{"text":"Ganglio cervical superior","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":36,"pinY":28},{"text":"Ganglio ciliar","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":70,"pinY":38},{"text":"Efecto simpatico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":24,"pinY":76},{"text":"Efecto parasimpatico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":83,"pinY":76},{"text":"Pupila dilatada","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":32,"pinY":91},{"text":"Pupila constrenida","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":80,"pinY":91}]'::jsonb,
  false, 16, 1, 60
),
(
  '6f48a609-4dc7-4bdc-5921-7e4cc62cea31',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona los pasos del arco reflejo autonomo barorreceptor.',
  '[{"text":"Barorreceptores carotideos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_reflejo_barorreceptor.png","pinX":67,"pinY":38},{"text":"Nervio glosofaringeo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_reflejo_barorreceptor.png","pinX":67,"pinY":26},{"text":"Nervio vago","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_reflejo_barorreceptor.png","pinX":19,"pinY":48},{"text":"Ganglio terminal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_reflejo_barorreceptor.png","pinX":34,"pinY":58},{"text":"Disminuye ritmo cardiaco","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_reflejo_barorreceptor.png","pinX":22,"pinY":78}]'::jsonb,
  false, 17, 1, 60
),
(
  '75b4026a-892f-7919-03fb-2c801bf53d89',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona la ruta somatica y la ruta autonoma de salida.',
  '[{"text":"Ruta somatica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":17,"pinY":18},{"text":"Fibra mielinica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":54,"pinY":19},{"text":"Ganglio neurovegetativo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":53,"pinY":72},{"text":"Fibra posganglionar amielinica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":65,"pinY":62},{"text":"Efector visceral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":88,"pinY":65}]'::jsonb,
  false, 18, 1, 60
),
(
  '44945d36-8aa3-35a3-bd14-fa5704e96d92',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona componentes abdominopelvicos simpaticos.',
  '[{"text":"Ganglio celiaco","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png","pinX":26,"pinY":34},{"text":"Glandula suprarrenal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png","pinX":27,"pinY":42},{"text":"Plexo renal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png","pinX":27,"pinY":49},{"text":"Plexo aortico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png","pinX":28,"pinY":64},{"text":"Ganglio mesenterico superior","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png","pinX":74,"pinY":43},{"text":"Ganglio mesenterico inferior","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_abdominopelvico.png","pinX":73,"pinY":58}]'::jsonb,
  false, 19, 1, 60
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'Capitulo 15 Morfofuncion - reflejos viscerales',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Relacionar arcos reflejos autonomos, vias aferentes y eferentes, efectores viscerales y respuestas homeostaticas.',
  'RV15M',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(),
  now(),
  true,
  'Capitulo 15: reflejos viscerales',
  'test',
  '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;

delete from public.evaluacion_preguntas where evaluacion_id = '9964c761-0495-41de-2a05-f1366ed220f7';

insert into public.evaluacion_preguntas (
  id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador
) values
(
  '0f218552-6c53-54be-27cd-a3d319f40b38',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'mc',
  'En el arco barorreceptor mostrado, los receptores detectan principalmente:',
  '[{"text":"Aumento de presion arterial","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Disminucion de luz ambiental","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Vibracion sonora","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Olor intenso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"}]'::jsonb,
  false, 0, 1, 45
),
(
  '958acb34-a972-613f-a7f3-96d2f04685cb',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'mc',
  'En la figura, la senal aferente desde barorreceptores carotideos viaja al bulbo por el nervio:',
  '[{"text":"Glosofaringeo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Optico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Hipogloso","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Accesorio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"}]'::jsonb,
  false, 1, 1, 45
),
(
  'c1198823-d8f2-42f0-c430-320494ea9e39',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'mc',
  'La respuesta eferente que reduce el ritmo cardiaco viaja principalmente por:',
  '[{"text":"Nervio vago","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Nervio olfatorio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Nervio vestibulococlear","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Nervio accesorio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"}]'::jsonb,
  false, 2, 1, 45
),
(
  '09e7bb06-f1bf-9911-c3ae-cbb5c978942a',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'mc',
  'Un reflejo visceral autonomo termina sobre todo en:',
  '[{"text":"Musculo liso, cardiaco o glandulas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"},{"text":"Solo musculo esqueletico voluntario","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"},{"text":"Solo retina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"},{"text":"Solo hueso cortical","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"}]'::jsonb,
  false, 3, 1, 45
),
(
  '4fd4ae6a-7da2-1c55-7515-2646021116dd',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'mc',
  'En la inervacion dual del iris, el efecto simpatico produce:',
  '[{"text":"Pupila dilatada","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Pupila constrenida","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Perdida del olfato","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Cierre de cuerdas vocales","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"}]'::jsonb,
  false, 4, 1, 45
),
(
  '9929fba2-4b94-3c33-23ef-2f0bf2d234cc',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'mc',
  'En la misma figura, el efecto parasimpatico sobre el iris produce:',
  '[{"text":"Pupila constrenida","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Pupila dilatada","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Taquicardia maxima","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Broncodilatacion pura","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"}]'::jsonb,
  false, 5, 1, 45
),
(
  'b2db93f0-8188-1d45-2976-8d1ca787010f',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'mc',
  'El tono vasomotor mostrado depende principalmente de:',
  '[{"text":"Actividad simpatica sobre musculo liso vascular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png"},{"text":"Actividad olfatoria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png"},{"text":"Nervio optico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png"},{"text":"Contraccion de musculo esqueletico voluntario","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png"}]'::jsonb,
  false, 6, 1, 45
),
(
  '368abb13-de2d-2db3-f302-7bf01dae7390',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'mc',
  'En el esquema de neurotransmisores, una fibra colinergica libera:',
  '[{"text":"Acetilcolina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png"},{"text":"Norepinefrina exclusivamente","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png"},{"text":"Melanina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png"},{"text":"Hemoglobina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png"}]'::jsonb,
  false, 7, 1, 45
),
(
  '8b1c5ee9-8a97-2d30-ba85-2206b0e6cdc5',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'ms',
  'Selecciona componentes del reflejo barorreceptor autonomo.',
  '[{"text":"Barorreceptores","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Bulbo raquideo como centro integrador","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Nervio vago eferente","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Corazon como efector","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Retina como efector principal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"}]'::jsonb,
  true, 8, 1, 45
),
(
  '2962ece7-d1af-fb2b-cd79-bb81cd27155e',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'ms',
  'Selecciona ejemplos de respuestas viscerales autonomas.',
  '[{"text":"Cambio de frecuencia cardiaca","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png"},{"text":"Cambio de tono vascular","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png"},{"text":"Secrecion glandular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png"},{"text":"Motilidad intestinal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png"},{"text":"Movimiento voluntario del biceps","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png"}]'::jsonb,
  true, 9, 1, 45
),
(
  'c99b3150-e13f-66ed-3f43-b3527890df2d',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'ms',
  'En la inervacion dual, que organos o tejidos pueden recibir acciones antagonicas?',
  '[{"text":"Iris","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Corazon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Tubo digestivo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Vasos sanguineos con tono simpatico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"},{"text":"Cristalino sin inervacion","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png"}]'::jsonb,
  true, 10, 1, 45
),
(
  'b267b01d-2265-254e-2c9e-d477d8f141a1',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'ms',
  'En los reflejos viscerales, que elementos pueden formar parte de la via eferente?',
  '[{"text":"Neurona preganglionar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"},{"text":"Ganglio autonomo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"},{"text":"Neurona posganglionar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"},{"text":"Efector visceral","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"},{"text":"Receptor olfatorio como unico efector","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png"}]'::jsonb,
  true, 11, 1, 45
),
(
  'a40f2904-0a92-bf09-5f30-8ddb742a6a86',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'dnd',
  'Ordena y relaciona el arco reflejo barorreceptor.',
  '[{"text":"1 Barorreceptores","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":68,"pinY":39},{"text":"2 Nervio glosofaringeo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":68,"pinY":26},{"text":"3 Nervio vago","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":20,"pinY":48},{"text":"Ganglio terminal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":34,"pinY":58},{"text":"4 Disminuye ritmo cardiaco","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":23,"pinY":78}]'::jsonb,
  false, 12, 1, 60
),
(
  '87f5ff39-fc87-e795-f199-02de0d6a1a1d',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'dnd',
  'Relaciona la ruta eferente autonoma frente a la somatica.',
  '[{"text":"Inervacion somatica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png","pinX":17,"pinY":18},{"text":"Efector somatico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png","pinX":88,"pinY":20},{"text":"Inervacion autonoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png","pinX":17,"pinY":58},{"text":"Ganglio neurovegetativo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png","pinX":52,"pinY":73},{"text":"Efector visceral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_rutas_eferentes.png","pinX":88,"pinY":65}]'::jsonb,
  false, 13, 1, 60
),
(
  '4fe1fccf-0c7c-99d6-801f-c70a9a48d359',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'dnd',
  'Relaciona destinos viscerales simpaticos.',
  '[{"text":"Ojo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png","pinX":76,"pinY":12},{"text":"Corazon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png","pinX":72,"pinY":36},{"text":"Pulmon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png","pinX":75,"pinY":49},{"text":"Higado y vesicula biliar","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png","pinX":75,"pinY":58},{"text":"Intestino grueso","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png","pinX":76,"pinY":74},{"text":"Medula suprarrenal","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_simpatico_general.png","pinX":75,"pinY":82}]'::jsonb,
  false, 14, 1, 60
),
(
  'dd9c0e58-3b3c-e9e7-58ec-b764879baf37',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'dnd',
  'Relaciona destinos viscerales parasimpaticos.',
  '[{"text":"Ojo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_parasimpatico_general.png","pinX":76,"pinY":14},{"text":"Corazon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_parasimpatico_general.png","pinX":72,"pinY":35},{"text":"Pulmones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_parasimpatico_general.png","pinX":73,"pinY":44},{"text":"Estomago","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_parasimpatico_general.png","pinX":75,"pinY":55},{"text":"Colon descendente","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_parasimpatico_general.png","pinX":76,"pinY":72},{"text":"Vejiga urinaria","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_parasimpatico_general.png","pinX":70,"pinY":91}]'::jsonb,
  false, 15, 1, 60
),
(
  '2392e1a0-a198-a1fb-d7aa-dcd6ec4aedf4',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'dnd',
  'Relaciona los efectos de la inervacion dual del iris.',
  '[{"text":"Fibras simpaticas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png","pinX":70,"pinY":24},{"text":"Fibras parasimpaticas III","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png","pinX":67,"pinY":13},{"text":"Ganglio ciliar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png","pinX":70,"pinY":38},{"text":"Pupila dilatada","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png","pinX":32,"pinY":91},{"text":"Pupila constrenida","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_iris_dual.png","pinX":80,"pinY":91}]'::jsonb,
  false, 16, 1, 60
),
(
  'cc85c683-a713-9d54-2e0b-aad59ef3cb87',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'dnd',
  'Relaciona los cambios de tono vasomotor.',
  '[{"text":"Tono simpatico fuerte","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png","pinX":78,"pinY":20},{"text":"Contraccion de musculo liso","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png","pinX":78,"pinY":34},{"text":"Vasoconstriccion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png","pinX":78,"pinY":46},{"text":"Tono simpatico debil","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png","pinX":78,"pinY":61},{"text":"Vasodilatacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png","pinX":78,"pinY":78}]'::jsonb,
  false, 17, 1, 60
),
(
  'b233d67d-19e3-2625-4ed3-64a943840444',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'dnd',
  'Relaciona transmisores y receptores de reflejos autonomos.',
  '[{"text":"ACh","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png","pinX":31,"pinY":16},{"text":"Receptor nicotinico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png","pinX":57,"pinY":13},{"text":"NE","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png","pinX":71,"pinY":54},{"text":"Receptor adrenergico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png","pinX":82,"pinY":61},{"text":"Receptor muscarinico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_neurotransmisores.png","pinX":82,"pinY":91}]'::jsonb,
  false, 18, 1, 60
),
(
  'b41834c7-8b54-4ad8-520d-ad5e5b59bebd',
  '9964c761-0495-41de-2a05-f1366ed220f7',
  'dnd',
  'Relaciona los elementos generales de un reflejo visceral.',
  '[{"text":"Receptor visceral","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":68,"pinY":39},{"text":"Via aferente","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":61,"pinY":29},{"text":"Centro integrador bulbar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":40,"pinY":21},{"text":"Via eferente vagal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":19,"pinY":48},{"text":"Efector cardiaco","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":47,"pinY":68}]'::jsonb,
  false, 19, 1, 60
);

commit;
