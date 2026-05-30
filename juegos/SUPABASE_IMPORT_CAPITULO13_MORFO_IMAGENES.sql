-- Importa evaluacion visual del Capitulo 13 - Morfofuncion.
-- Incluye 20 preguntas: seleccion unica, seleccion multiple y relacionar imagenes.
--
-- Las imagenes usadas por estas preguntas estan en:
-- juegos/assets/capitulo13-morfo/

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
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'Capitulo 13 Morfofuncion - sistema nervioso',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Identificar raices, ramas, plexos y nervios espinales con imagenes del texto oficial.',
  'CAP13M',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(),
  now(),
  true,
  'Capitulo 13: medula espinal, nervios espinales y plexos',
  'test',
  '{
    "maxQuestions": 10,
    "questionOrder": [],
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
where evaluacion_id = '132d4d35-4a39-4dfc-8b87-5e9f30d13f01';

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
-- Seleccion unica
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13101',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'En la imagen, el nervio hipogloso corresponde a que par craneal?',
  '[
    {"text":"XII","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"},
    {"text":"IX","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"},
    {"text":"X","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"},
    {"text":"VII","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"}
  ]'::jsonb,
  false, 0, 1, 45
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13102',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'El ganglio nervioso de la raiz posterior contiene principalmente:',
  '[
    {"text":"Cuerpos neuronales sensitivos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Neuronas motoras somaticas del asta anterior","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Fibras musculares esqueleticas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Liquido cefalorraquideo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}
  ]'::jsonb,
  false, 1, 1, 45
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13103',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La raiz anterior del nervio espinal conduce principalmente fibras:',
  '[
    {"text":"Motoras eferentes","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"},
    {"text":"Sensitivas aferentes","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"},
    {"text":"Exclusivamente parasimpaticas craneales","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"},
    {"text":"Exclusivamente de propiocepcion consciente","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"}
  ]'::jsonb,
  false, 2, 1, 45
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13104',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'En la organizacion posterior mostrada, el plexo braquial se forma principalmente por niveles:',
  '[
    {"text":"C5 a T1","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"C1 a C4","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"T1 a T12","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"L4 a S4","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}
  ]'::jsonb,
  false, 3, 1, 45
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13105',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'Los nervios intercostales pertenecen a la region:',
  '[
    {"text":"Toracica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Cervical","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Lumbar","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Coccigea","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}
  ]'::jsonb,
  false, 4, 1, 45
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13106',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'En el corte del nervio raquideo, un fasciculo es:',
  '[
    {"text":"Un paquete de fibras nerviosas dentro del nervio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"El cuerpo vertebral que rodea a la medula","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"La raiz que solo conduce fibras motoras","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"La membrana que cubre al pulmon","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}
  ]'::jsonb,
  false, 5, 1, 45
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13107',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La union de la raiz anterior y la raiz posterior forma el:',
  '[
    {"text":"Nervio raquideo o espinal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Plexo coccigeo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Ganglio de la raiz posterior","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Fasciculo gracil","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}
  ]'::jsonb,
  false, 6, 1, 45
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13108',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'En la figura posterior, el plexo lumbar se relaciona principalmente con:',
  '[
    {"text":"L1 a L4","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"C1 a C5","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"C5 a T1","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"T1 a T12","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}
  ]'::jsonb,
  false, 7, 1, 45
),

-- Seleccion multiple
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13109',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona las estructuras que forman parte directa de un nervio espinal o raquideo.',
  '[
    {"text":"Raiz anterior","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Raiz posterior","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Ganglio nervioso de la raiz posterior","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Alveolo pulmonar","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}
  ]'::jsonb,
  true, 8, 1, 60
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13110',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona los plexos nerviosos mostrados en la imagen posterior.',
  '[
    {"text":"Plexo cervical","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo braquial","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo lumbar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo sacro","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo pulmonar","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}
  ]'::jsonb,
  true, 9, 1, 60
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13111',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona las afirmaciones correctas sobre raices y ramas del nervio espinal.',
  '[
    {"text":"La raiz posterior se asocia con informacion sensitiva","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"La raiz anterior se asocia con salida motora","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"El ganglio de la raiz posterior es sensitivo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"El cuerpo vertebral es una rama del nervio espinal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}
  ]'::jsonb,
  true, 10, 1, 60
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13112',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona los elementos observables en el corte del nervio periferico.',
  '[
    {"text":"Fasciculos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Vasos sanguineos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Fibras nerviosas agrupadas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Cartilago articular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}
  ]'::jsonb,
  true, 11, 1, 60
),

-- Relacionar / identificar partes
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13113',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona las raices del plexo cervical.',
  '[
    {"text":"C1","correct":true,"color":"ac-blue","pinX":62,"pinY":7,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"},
    {"text":"C2","correct":true,"color":"ac-teal","pinX":62,"pinY":22,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"},
    {"text":"C3","correct":true,"color":"ac-yellow","pinX":62,"pinY":39,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"},
    {"text":"C4","correct":true,"color":"ac-pink","pinX":62,"pinY":58,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"},
    {"text":"C5","correct":true,"color":"ac-purple","pinX":62,"pinY":76,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_plexo_cervical.png"}
  ]'::jsonb,
  true, 12, 1, 75
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13114',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona estructuras del nervio espinal en vista anterolateral.',
  '[
    {"text":"Medula espinal","correct":true,"color":"ac-blue","pinX":52,"pinY":9,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"},
    {"text":"Raiz posterior","correct":true,"color":"ac-teal","pinX":68,"pinY":26,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"},
    {"text":"Ganglio de raiz posterior","correct":true,"color":"ac-yellow","pinX":82,"pinY":34,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"},
    {"text":"Ramo anterior","correct":true,"color":"ac-pink","pinX":73,"pinY":53,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"},
    {"text":"Ramo posterior","correct":true,"color":"ac-purple","pinX":78,"pinY":72,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png"}
  ]'::jsonb,
  true, 13, 1, 75
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13115',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona raices, ramas y referencias del corte transversal.',
  '[
    {"text":"Raiz posterior","correct":true,"color":"ac-blue","pinX":28,"pinY":37,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Rama posterior","correct":true,"color":"ac-teal","pinX":19,"pinY":44,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Ganglio nervioso de la raiz posterior","correct":true,"color":"ac-yellow","pinX":76,"pinY":50,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Rama anterior","correct":true,"color":"ac-pink","pinX":84,"pinY":62,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Raiz anterior","correct":true,"color":"ac-purple","pinX":44,"pinY":60,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Cuerpo vertebral","correct":true,"color":"ac-green","pinX":49,"pinY":78,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}
  ]'::jsonb,
  true, 14, 1, 90
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13116',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona plexos y nervios en la vista posterior.',
  '[
    {"text":"Plexo cervical","correct":true,"color":"ac-blue","pinX":38,"pinY":14,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo braquial","correct":true,"color":"ac-teal","pinX":34,"pinY":23,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Nervios intercostales","correct":true,"color":"ac-yellow","pinX":42,"pinY":42,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo lumbar","correct":true,"color":"ac-pink","pinX":48,"pinY":62,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo sacro","correct":true,"color":"ac-purple","pinX":53,"pinY":82,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo coccigeo","correct":true,"color":"ac-green","pinX":51,"pinY":92,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}
  ]'::jsonb,
  true, 15, 1, 90
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13117',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona estructuras del nervio raquideo y su corte.',
  '[
    {"text":"Radiculas","correct":true,"color":"ac-blue","pinX":23,"pinY":16,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Raiz posterior","correct":true,"color":"ac-teal","pinX":12,"pinY":22,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Ganglio nervioso de la raiz posterior","correct":true,"color":"ac-yellow","pinX":17,"pinY":31,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Raiz anterior","correct":true,"color":"ac-pink","pinX":14,"pinY":41,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Nervio raquideo","correct":true,"color":"ac-purple","pinX":11,"pinY":50,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Vasos sanguineos","correct":true,"color":"ac-green","pinX":41,"pinY":69,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},
    {"text":"Fasciculo","correct":true,"color":"ac-teal","pinX":40,"pinY":82,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}
  ]'::jsonb,
  true, 16, 1, 90
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13118',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona niveles vertebrales principales de la figura posterior.',
  '[
    {"text":"C1","correct":true,"color":"ac-blue","pinX":51,"pinY":9,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"T1","correct":true,"color":"ac-teal","pinX":51,"pinY":28,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"T12","correct":true,"color":"ac-yellow","pinX":51,"pinY":57,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"L1","correct":true,"color":"ac-pink","pinX":52,"pinY":60,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"L5","correct":true,"color":"ac-purple","pinX":53,"pinY":78,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"S1","correct":true,"color":"ac-green","pinX":53,"pinY":83,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}
  ]'::jsonb,
  true, 17, 1, 90
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13119',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona ramos y raices del nervio espinal.',
  '[
    {"text":"Raiz posterior","correct":true,"color":"ac-blue","pinX":29,"pinY":35,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Raiz anterior","correct":true,"color":"ac-teal","pinX":43,"pinY":61,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Rama posterior","correct":true,"color":"ac-yellow","pinX":20,"pinY":45,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},
    {"text":"Rama anterior","correct":true,"color":"ac-pink","pinX":83,"pinY":62,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}
  ]'::jsonb,
  true, 18, 1, 75
),
(
  '132d4d35-4a39-4dfc-8b87-5e9f30d13120',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona los niveles de origen de los plexos principales.',
  '[
    {"text":"Plexo cervical: C1 a C5","correct":true,"color":"ac-blue","pinX":38,"pinY":14,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo braquial: C5 a T1","correct":true,"color":"ac-teal","pinX":34,"pinY":23,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo lumbar: L1 a L4","correct":true,"color":"ac-yellow","pinX":48,"pinY":62,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo sacro: L4 a S4","correct":true,"color":"ac-pink","pinX":53,"pinY":82,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},
    {"text":"Plexo coccigeo: S4 a Co1","correct":true,"color":"ac-purple","pinX":51,"pinY":92,"pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}
  ]'::jsonb,
  true, 19, 1, 90
);

commit;

