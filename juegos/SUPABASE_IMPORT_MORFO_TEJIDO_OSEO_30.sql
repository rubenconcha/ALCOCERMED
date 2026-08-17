-- Banco visual: Tejido oseo, crecimiento, remodelacion y lesiones (Morfofuncion).
-- 30 preguntas en el banco; el estudiante recibe 10 al azar por intento.
-- Distribucion: 13 mc, 8 ms, 3 tf y 6 dnd.
--
-- Requisitos:
-- 1) Conservar la carpeta juegos/assets/huesos-saladin/ al publicar el sitio.
-- 2) Ejecutar este archivo completo en Supabase SQL Editor.
-- 3) En Juegos > MORFOFUNCION aparecera "Tejido oseo: crecimiento, remodelacion y lesiones".

begin;

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo,
  publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'a75885a2-341c-489c-83bc-2d7e216d91f0',
  'Tejido óseo: crecimiento, remodelación y lesiones',
  'MORFOFUNCION',
  'Residencia',
  'espanol',
  'publica',
  'Distinguir la microestructura y las células del tejido óseo, explicar la osificación, el crecimiento y la remodelación, y reconocer patrones de fractura y sus etapas de reparación.',
  'HUESOS2',
  true,
  'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23',
  now(), now(), true,
  'Capítulo 7 de Saladin: Tejido óseo',
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
where evaluacion_id = 'a75885a2-341c-489c-83bc-2d7e216d91f0';

insert into public.evaluacion_preguntas (
  id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador
) values
(
  '6da7f97e-a6ba-4872-8db8-47eea0abcc24', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué célula ósea secreta osteoide para formar nueva matriz?',
  $$[{"text":"Osteoblasto","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteoclasto","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteocito","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Condrocito","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"}]$$::jsonb,
  false, 1, 1, 45
),
(
  '0ddb0dd7-f020-4986-8ad0-ab3f3ee7ae72', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué célula madura ocupa una laguna y ayuda a mantener la matriz ósea?',
  $$[{"text":"Osteocito","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteoclasto","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Fibroblasto","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Eritrocito","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"}]$$::jsonb,
  false, 2, 1, 45
),
(
  '2202814f-cc05-4f37-bd16-e2960d8ac076', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué célula grande y multinucleada se especializa en resorber hueso?',
  $$[{"text":"Osteoclasto","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteoblasto","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteocito","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Célula osteogénica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"}]$$::jsonb,
  false, 3, 1, 45
),
(
  'a0626872-6c2e-4cc3-b9db-e6ddd1d5b432', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Cuál es la unidad estructural cilíndrica característica del hueso compacto?',
  $$[{"text":"La osteona o sistema de Havers","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"La trabécula","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"La placa epifisaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"El callo fibrocartilaginoso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"}]$$::jsonb,
  false, 4, 1, 45
),
(
  '85721c23-67a7-43f1-a660-be4236c953e4', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué contiene normalmente el conducto central de una osteona?',
  $$[{"text":"Vasos sanguíneos y fibras nerviosas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Solo cartílago hialino","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Únicamente adipocitos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Líquido sinovial","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"}]$$::jsonb,
  false, 5, 1, 45
),
(
  '8e08041a-98a9-4d68-be73-1e2a5c3af88d', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Cómo se organiza principalmente el hueso esponjoso?',
  $$[{"text":"Como una red de trabéculas con espacios interpuestos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Como osteonas sólidas sin espacios","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Como una sola capa de cartílago","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Como fibras musculares paralelas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  false, 6, 1, 45
),
(
  '1cccc8f0-e797-4516-ba92-55e03ca4ed2d', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué caracteriza a la osificación intramembranosa?',
  $$[{"text":"El hueso se forma directamente dentro de tejido mesenquimatoso","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_7_osificacion_intramembranosa.png"},{"text":"Siempre reemplaza primero un molde de cartílago hialino","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_7_osificacion_intramembranosa.png"},{"text":"Ocurre solo después de una fractura","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_7_osificacion_intramembranosa.png"},{"text":"Produce exclusivamente huesos sesamoideos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_7_osificacion_intramembranosa.png"}]$$::jsonb,
  false, 7, 1, 45
),
(
  'cf9b3c1a-a984-40a6-ad53-e38beaaa3039', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué sucede en la osificación endocondral?',
  $$[{"text":"El tejido óseo reemplaza progresivamente un molde de cartílago hialino","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"},{"text":"El hueso aparece sin ningún tejido precursor","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"},{"text":"La médula ósea se transforma en músculo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"},{"text":"El periostio se convierte en epidermis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"}]$$::jsonb,
  false, 8, 1, 45
),
(
  '197f9d85-95d6-4a04-abfe-6c32713c0eef', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué estructura permite el crecimiento longitudinal de un hueso largo inmaduro?',
  $$[{"text":"La placa epifisaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"El conducto central de la osteona","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"La cavidad sinovial","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"El foramen nutricio únicamente","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"}]$$::jsonb,
  false, 9, 1, 45
),
(
  'b725a6d3-f71f-43b7-acf9-db30160b1dfa', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Cómo se denomina el crecimiento que aumenta el diámetro de un hueso?',
  $$[{"text":"Crecimiento por aposición","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Crecimiento intersticial de la diáfisis mineralizada","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Reducción cerrada","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Formación del hematoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  false, 10, 1, 45
),
(
  'e28b93d4-07d9-4963-8296-f21d0ac14954', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué describe mejor la remodelación ósea en el adulto?',
  $$[{"text":"Resorción de hueso viejo o dañado seguida de formación de hueso nuevo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Conversión permanente de hueso en cartílago","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Crecimiento longitudinal sin límite","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Pérdida de toda la matriz mineral","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"}]$$::jsonb,
  false, 11, 1, 45
),
(
  'd12ba36e-bf68-4f3f-9d58-49e6d1a74d45', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Qué define a una fractura abierta o compuesta?',
  $$[{"text":"El hueso fracturado se comunica con el exterior a través de una herida","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"La piel permanece íntegra en todo momento","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"Solo se rompe un lado del hueso","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"La línea es siempre perpendicular al eje","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"}]$$::jsonb,
  false, 12, 1, 45
),
(
  '2c701323-03d0-40e5-a999-26d1db814797', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'mc',
  '¿Cuál es el primer evento principal de la reparación de una fractura?',
  $$[{"text":"Formación de un hematoma por los vasos lesionados","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Remodelación inmediata del hueso compacto","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Formación instantánea de una nueva articulación","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Desaparición completa de la médula ósea","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"}]$$::jsonb,
  false, 13, 1, 45
),
(
  '198e0d16-792b-47ce-abe4-2e1f08b163f0', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'ms',
  'Selecciona las afirmaciones correctas sobre la matriz ósea.',
  $$[{"text":"El colágeno aporta resistencia a la tracción y cierta flexibilidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Las sales minerales aportan dureza y resistencia a la compresión","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"La hidroxiapatita contiene calcio y fosfato","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"El osteoide es la porción orgánica no mineralizada recién secretada","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"La matriz ósea está formada solo por agua","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"}]$$::jsonb,
  true, 14, 1, 50
),
(
  'fb442472-2dea-4382-879e-406d80b580ac', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'ms',
  'Selecciona los componentes o relaciones correctas de una osteona.',
  $$[{"text":"Laminillas concéntricas alrededor de un conducto central","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Osteocitos alojados en lagunas","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Canalículos que comunican lagunas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Vasos dentro del conducto central","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Alvéolos pulmonares entre las laminillas","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"}]$$::jsonb,
  true, 15, 1, 50
),
(
  '2322eea9-8cb7-4835-9401-4a88e56933ad', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'ms',
  'Selecciona las zonas que forman la placa epifisaria.',
  $$[{"text":"Zona de cartílago de reserva","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de proliferación celular","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de hipertrofia celular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de calcificación","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de depósito óseo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de contracción muscular","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"}]$$::jsonb,
  true, 16, 1, 50
),
(
  '61502d54-f6ba-4171-bffe-18158e29322f', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'ms',
  'Selecciona factores que favorecen el mantenimiento de huesos sanos.',
  $$[{"text":"Carga mecánica y ejercicio adecuados","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Aporte suficiente de calcio","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Vitamina D para facilitar la absorción de calcio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Regulación hormonal equilibrada","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Inmovilización prolongada como estímulo formador","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  true, 17, 1, 50
),
(
  '4335b687-2145-4c91-b221-fbcdaba87b1e', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'ms',
  'Selecciona las relaciones correctas entre patrón de fractura y descripción.',
  $$[{"text":"Sin desplazamiento — los extremos conservan la alineación","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"Con desplazamiento — los fragmentos pierden la alineación","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"Conminuta — produce varios fragmentos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"En tallo verde — es una fractura incompleta","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"Sin desplazamiento — siempre atraviesa la piel","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"}]$$::jsonb,
  true, 18, 1, 50
),
(
  '5ac6ca7f-7c9e-4435-9490-cb7a06a480f2', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'ms',
  'Selecciona las etapas principales de la reparación de una fractura.',
  $$[{"text":"Formación del hematoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Formación del callo fibrocartilaginoso","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Formación del callo óseo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Remodelación","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Conversión del hueso en músculo","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"}]$$::jsonb,
  true, 19, 1, 50
),
(
  '4daa1640-42a3-44ec-9c30-5862bbbe89a0', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'ms',
  'Selecciona las relaciones correctas entre células óseas y función.',
  $$[{"text":"Célula osteogénica — origina osteoblastos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteoblasto — forma matriz ósea","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteocito — mantiene la matriz y detecta cambios mecánicos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteoclasto — resorbe tejido óseo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteoclasto — secreta cartílago articular","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"}]$$::jsonb,
  true, 20, 1, 50
),
(
  '0d0987b1-345e-4f54-a9bd-3449d6e47f6d', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'ms',
  'Selecciona las afirmaciones correctas sobre hueso compacto y esponjoso.',
  $$[{"text":"El hueso compacto forma una capa cortical densa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"El hueso compacto se organiza principalmente en osteonas","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"El hueso esponjoso forma una red de trabéculas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"Los espacios del hueso esponjoso pueden contener médula ósea","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"},{"text":"El hueso esponjoso carece por completo de osteocitos","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_1_hueso_largo.png"}]$$::jsonb,
  true, 21, 1, 50
),
(
  '80833675-3014-4f65-a66e-0269cd38b6dc', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'tf',
  'Verdadero o falso: el tejido óseo es dinámico y se remodela durante la vida.',
  $$[{"text":"Verdadero","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Falso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"}]$$::jsonb,
  false, 22, 1, 40
),
(
  '33e5e677-0253-4d17-8828-abe790f24a32', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'tf',
  'Verdadero o falso: el osteoclasto es la célula que deposita osteoide para formar hueso nuevo.',
  $$[{"text":"Verdadero","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Falso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"}]$$::jsonb,
  false, 23, 1, 40
),
(
  '17d01092-dfb3-4a55-a477-e090106633c7', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'tf',
  'Verdadero o falso: una fractura en tallo verde es incompleta y afecta solo un lado del hueso.',
  $$[{"text":"Verdadero","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"Falso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"}]$$::jsonb,
  false, 24, 1, 40
),
(
  'bfc21322-e2bd-4598-8ca9-fab7a4209484', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'dnd',
  'Relaciona los números con las estructuras mostradas en la histología ósea.',
  $$[{"text":"Hueso compacto","correct":true,"color":"ac-blue","pinX":33,"pinY":17,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Hueso esponjoso","correct":true,"color":"ac-green","pinX":74,"pinY":29,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Osteona","correct":true,"color":"ac-yellow","pinX":38,"pinY":58,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"},{"text":"Conducto central","correct":true,"color":"ac-pink","pinX":27,"pinY":77,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_4_histologia_osea.png"}]$$::jsonb,
  false, 25, 1, 70
),
(
  '5b0ba904-f546-4495-9a04-e5f55115a89f', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'dnd',
  'Relaciona cada población o célula ósea con el sitio numerado.',
  $$[{"text":"Célula osteogénica","correct":true,"color":"ac-blue","pinX":20,"pinY":20,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteocito","correct":true,"color":"ac-green","pinX":78,"pinY":20,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Citoblastos","correct":true,"color":"ac-yellow","pinX":20,"pinY":52,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"},{"text":"Osteoclasto","correct":true,"color":"ac-pink","pinX":80,"pinY":55,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_3_celulas_oseas.png"}]$$::jsonb,
  false, 26, 1, 70
),
(
  '43f565af-2f76-475b-815f-81aadd873b41', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'dnd',
  'Relaciona cada fila con una etapa de la osificación endocondral.',
  $$[{"text":"Modelo inicial de cartílago","correct":true,"color":"ac-blue","pinX":9,"pinY":27,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"},{"text":"Centro de osificación primario","correct":true,"color":"ac-green","pinX":8,"pinY":50,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"},{"text":"Invasión vascular y cavidad medular primaria","correct":true,"color":"ac-yellow","pinX":25,"pinY":48,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"},{"text":"Hueso infantil con placa epifisaria","correct":true,"color":"ac-pink","pinX":62,"pinY":43,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"},{"text":"Hueso adulto con placa cerrada","correct":true,"color":"ac-purple","pinX":85,"pinY":35,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_9_osificacion_endocondral.png"}]$$::jsonb,
  false, 27, 1, 70
),
(
  'bf5a20cb-d382-469e-819e-6408d9a683c4', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'dnd',
  'Relaciona los números con las zonas de la placa epifisaria, de epífisis a diáfisis.',
  $$[{"text":"Zona de cartílago de reserva","correct":true,"color":"ac-blue","pinX":63,"pinY":26,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de proliferación celular","correct":true,"color":"ac-green","pinX":63,"pinY":39,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de hipertrofia celular","correct":true,"color":"ac-yellow","pinX":63,"pinY":51,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de calcificación","correct":true,"color":"ac-pink","pinX":63,"pinY":64,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"},{"text":"Zona de depósito óseo","correct":true,"color":"ac-purple","pinX":63,"pinY":77,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_12_placa_epifisaria.png"}]$$::jsonb,
  false, 28, 1, 70
),
(
  'cd188a1c-c7fa-4127-8625-5007015b9162', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'dnd',
  'Relaciona cada patrón numerado con el tipo de fractura.',
  $$[{"text":"Sin desplazamiento","correct":true,"color":"ac-blue","pinX":24,"pinY":28,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"Con desplazamiento","correct":true,"color":"ac-green","pinX":71,"pinY":28,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"Conminuta","correct":true,"color":"ac-yellow","pinX":24,"pinY":65,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"},{"text":"En tallo verde","correct":true,"color":"ac-pink","pinX":71,"pinY":65,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_17_tipos_fractura.png"}]$$::jsonb,
  false, 29, 1, 70
),
(
  'b46d5bee-3e6d-4504-93de-3e66401db31c', 'a75885a2-341c-489c-83bc-2d7e216d91f0', 'dnd',
  'Relaciona los números con las etapas de reparación de la fractura.',
  $$[{"text":"Formación de hematoma","correct":true,"color":"ac-blue","pinX":11,"pinY":30,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Formación de callo suave","correct":true,"color":"ac-green","pinX":37,"pinY":30,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Formación de callo duro","correct":true,"color":"ac-yellow","pinX":62,"pinY":30,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"},{"text":"Remodelación ósea","correct":true,"color":"ac-pink","pinX":87,"pinY":30,"pregunta_imagen":"/juegos/assets/huesos-saladin/cap7_fig7_18_reparacion_fractura.png"}]$$::jsonb,
  false, 30, 1, 70
);

commit;
