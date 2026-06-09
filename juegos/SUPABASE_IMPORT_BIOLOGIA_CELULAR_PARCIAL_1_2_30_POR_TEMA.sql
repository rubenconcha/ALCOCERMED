-- Importa primer y segundo parcial de Biologia Celular desde Biologia Celular Biomedica (Alfonzo/Alfonso Calvo Gonzales, Elsevier).
-- Capitulos 1 al 12: 30 preguntas por tema; la app muestra 10 por intento con maxQuestions.
-- Imagenes locales nuevas: juegos/assets/biologia-celular-parciales/.
begin;

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9', 'Capitulo 1 Biologia Celular - introduccion', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar teoria celular, tipos celulares, virus, priones y bases de informacion biologica desde Calvo.', 'BC01P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 1: introduccion a la biologia celular', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '601b9a75-345b-5de9-bd63-00da7fdf67ee',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'La teoria celular establece que la celula es:',
  '[{"text":"La unidad estructural y funcional de los seres vivos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Un organulo membranoso","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Un virus complejo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Una proteina catalitica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '292fea5d-ca1a-5eef-b886-55ee9b5351af',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'Una celula procariota se caracteriza por:',
  '[{"text":"Poseer nucleolo complejo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Tener mitocondrias","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Presentar RER","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Carecer de nucleo delimitado por envoltura","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '10ab6dbf-b090-53ce-b612-c56dda7c2824',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'Una celula eucariota se diferencia por:',
  '[{"text":"Carecer de ribosomas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Ser siempre bacteriana","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Compartimentos membranosos internos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Ausencia total de ADN","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '9fc43d6e-c558-5623-bf5a-c7f5fce73527',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'El ADN almacena principalmente:',
  '[{"text":"Enzimas lisosomales","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Informacion genetica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Energia inmediata","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Lipid rafts","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '39e58e2b-b97a-500f-b98b-6f0ad929b692',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'El ARN puede participar en:',
  '[{"text":"Expresion de la informacion genetica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Formar bicapa lipidica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Dar rigidez osea","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Oxidar acidos grasos siempre","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'd248e289-f0e8-5cb6-b6c6-e2188226b542',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'Un virus necesita celulas porque:',
  '[{"text":"Tiene mitocondrias propias","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Posee ribosomas completos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Es una celula eucariota","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"No realiza por si solo todo el metabolismo reproductivo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '2cfc368e-e886-5e68-ba06-fc3e9c432aec',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'Los priones son:',
  '[{"text":"Bacterias pequenas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Lisosomas defectuosos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Proteinas infecciosas mal plegadas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"ADN circular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'a37e37be-9471-565a-b9a0-6ec6fc063ebc',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'Un modelo biologico se usa para:',
  '[{"text":"Evitar hipotesis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Estudiar procesos conservados en sistemas manejables","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Sustituir todo experimento","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Eliminar controles","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '5636f2ce-e839-5a8b-bb06-81cd68df2ae1',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'Las bacterias son utiles como modelos porque:',
  '[{"text":"Crecen rapido y son manipulables geneticamente","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Carecen siempre de ADN","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Tienen nucleolo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"No tienen membrana","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '6176e8b1-2d77-5880-b4b0-833891c5957f',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'La biologia celular biomedica relaciona:',
  '[{"text":"Solo taxonomia vegetal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Solo anatomia macroscopica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Solo meteorologia","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Estructura celular con salud y enfermedad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '99e5ba20-e484-5148-b3cf-418855e8d935',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'La membrana plasmatica cumple:',
  '[{"text":"Producir ATP siempre","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Ser el nucleolo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Separar y comunicar celula con entorno","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Guardar cromosomas exclusivamente","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '12b56476-959a-5789-b4f4-1de8afe09c49',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'El citoplasma eucariota contiene:',
  '[{"text":"Solo pared bacteriana","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Citosol, organulos y citoesqueleto","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Solo ADN nuclear","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Solo plasma sanguineo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'cbd26dda-6172-58f0-b158-74f2093bde05',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'El nucleo eucariota contiene:',
  '[{"text":"ADN organizado en cromatina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Lisosomas primarios","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Caveolas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"ATP sintasa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '91df616b-e0c6-5aeb-bfb7-49c0364e88ae',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'La homeostasis celular requiere:',
  '[{"text":"Aislamiento absoluto","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Ausencia de energia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"No expresar genes","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Control de intercambio y respuesta al entorno","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'fa35c17d-1848-5da3-b300-a8daf84a776d',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'Un gen se expresa cuando:',
  '[{"text":"Se elimina la membrana","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Se bloquea todo ribosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Su informacion contribuye a producir ARN o proteina funcional","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Se destruye el cromosoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '9b8547c8-c185-5795-b868-47de442b550d',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'Una proteina puede actuar como:',
  '[{"text":"Solo acido nucleico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Enzima, receptor, transportador o estructura","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Solo material genetico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Solo lipido de membrana","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'b02971c9-38cc-538a-bb0c-b314dc6ae96b',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'La evolucion celular se apoya en:',
  '[{"text":"Conservacion y variacion de mecanismos moleculares","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Ausencia de mutaciones","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Inmovilidad genetica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"No seleccion natural","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '882bb4f9-ea7e-5eca-b531-cb92a8569966',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'mc',
  'La comparacion procariota-eucariota ayuda a:',
  '[{"text":"Eliminar la teoria celular","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Probar que virus son celulas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Negar el ADN","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Entender organizacion y complejidad celular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'b16d067c-1ab4-5515-b327-dd7fa40b4d86',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'ms',
  'Selecciona componentes comunes de celulas.',
  '[{"text":"Membrana plasmatica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Material genetico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Ribosomas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Citoplasma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Capside viral obligada","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '7ebe4ae6-ba42-5a4e-bb22-3dfc5a7d24a9',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'ms',
  'Selecciona ejemplos de sistemas acelulares.',
  '[{"text":"Virus","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Viroides","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Priones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Mitocondria como organismo libre actual","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '65f9d4b1-ccd3-50c2-bd43-1e9f3e7642ca',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'ms',
  'Selecciona rasgos eucariotas.',
  '[{"text":"Nucleo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Sistema de endomembranas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Mitocondrias","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Citoesqueleto organizado","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Nucleoide bacteriano","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '85f2b751-8a61-54b2-b8d5-25ac31f83c87',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'ms',
  'Selecciona funciones de proteinas celulares.',
  '[{"text":"Catalisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Transporte","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Recepcion de senales","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Soporte estructural","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Almacenar toda herencia por si solas","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'f2ff6cd6-e56c-56ac-b390-1e796f1a6d01',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'ms',
  'Selecciona conceptos introductorios del capitulo.',
  '[{"text":"Teoria celular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Modelos biologicos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Virus","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Priones","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'a643d1b7-10af-5d25-b50c-4f9a73b69120',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'ms',
  'Selecciona niveles de informacion biologica.',
  '[{"text":"ADN","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"ARN","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Proteina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"},{"text":"Caveola como acido nucleico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '3424ab74-c4b7-5ab8-b505-38ebc4b8aa3f',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'dnd',
  'Relaciona conceptos introductorios.',
  '[{"text":"Teoria celular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":15,"pinY":36},{"text":"Procariota","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":33,"pinY":36},{"text":"Eucariota","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":51,"pinY":36},{"text":"Virus","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":69,"pinY":36},{"text":"Prion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":85,"pinY":36},{"text":"ADN","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '3e85e5eb-959b-52c9-bff7-2ab8bee08031',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'dnd',
  'Relaciona celula y material genetico.',
  '[{"text":"Procariota","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":33,"pinY":36},{"text":"Nucleoide","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":33,"pinY":46},{"text":"Eucariota","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":51,"pinY":36},{"text":"Nucleo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":51,"pinY":46},{"text":"ADN","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '33f3d596-1eca-5e30-b196-c4aa8621cd59',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'dnd',
  'Relaciona agentes acelulares.',
  '[{"text":"Virus","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":69,"pinY":36},{"text":"Capside","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":69,"pinY":46},{"text":"Prion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":85,"pinY":36},{"text":"Proteina mal plegada","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":85,"pinY":46},{"text":"ARN viral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":58,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '39958698-856b-5669-b2a0-cccb55b12d14',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'dnd',
  'Relaciona flujo general de informacion.',
  '[{"text":"ADN","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":22,"pinY":67},{"text":"ARN","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":40,"pinY":67},{"text":"Proteina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":58,"pinY":67},{"text":"Funcion celular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":76,"pinY":67},{"text":"Fenotipo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":85,"pinY":50}]'::jsonb,
  false, 27, 1, 75
),
(
  '88ee7a80-8162-56fa-b128-505a4a08f88d',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'dnd',
  'Relaciona modelos biologicos.',
  '[{"text":"Bacteria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":33,"pinY":36},{"text":"Levadura","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":51,"pinY":36},{"text":"Cultivo celular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":76,"pinY":67},{"text":"Animal modelo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":85,"pinY":36},{"text":"Gen conservado","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '8fbb3be5-d58e-5f1d-b9bf-288d10c29187',
  '90d8fca4-6e57-5d53-b7d6-2dbc987df7d9',
  'dnd',
  'Relaciona organizacion celular.',
  '[{"text":"Membrana","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":15,"pinY":36},{"text":"Citoplasma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":51,"pinY":36},{"text":"Nucleo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":51,"pinY":46},{"text":"Organulos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":58,"pinY":67},{"text":"Citoesqueleto","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '7b163c43-f925-5c44-bdd6-98f2b980add2', 'Capitulo 2 Biologia Celular - metodos y tecnicas', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar microscopia, tecnicas de ADN, inmunodeteccion, cultivo y fraccionamiento desde Calvo.', 'BC02P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 2: como se estudian las celulas', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '7b163c43-f925-5c44-bdd6-98f2b980add2';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'cedc6bfe-450a-5fcb-bb1e-448e6eb70c85',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La microscopia optica usa principalmente:',
  '[{"text":"Luz visible y lentes","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Electrones solamente","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"PCR","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Anticuerpos primarios","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'deaf69a0-a4ff-5768-bc14-34a8dddd73cb',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La microscopia electronica permite:',
  '[{"text":"Menor resolucion que ojo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Amplificar ADN","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Medir fluorescencia soluble","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Mayor resolucion ultraestructural","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '51d675b9-73a4-5cc9-bb23-2087210be822',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La fijacion de muestras busca:',
  '[{"text":"Mover organulos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Activar mitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Preservar estructuras celulares","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Degradar acidos nucleicos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '41c1741e-9424-5cfe-b929-65bbbfb54d3c',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La PCR sirve para:',
  '[{"text":"Ver mitocondrias en vivo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Amplificar secuencias de ADN","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Separar organulos por densidad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Medir antigenos con enzimas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '322f0b43-ef86-53a9-bc05-4d48310ef1dd',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La electroforesis separa acidos nucleicos por:',
  '[{"text":"Tamano y carga","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Color celular","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Actividad motora","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"pH lisosomal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'cb2fe2d0-d72e-528f-b0af-c05e5656c94c',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La secuenciacion de ADN determina:',
  '[{"text":"Masa de organulos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Velocidad de endocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Numero de caveolas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Orden de nucleotidos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '4448f6f2-4044-5fe7-b888-f0db7a35859e',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La hibridacion in situ permite:',
  '[{"text":"Medir ATP directo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Eliminar cromatina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Localizar secuencias de acidos nucleicos en celulas o tejidos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Romper todas las membranas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'f2446921-4afe-55de-be15-f97e59b0b082',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'ELISA se basa en:',
  '[{"text":"Mitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Union antigeno-anticuerpo y deteccion enzimatica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Centrifugacion diferencial","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Difusion simple","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '4cc3b1c8-437f-55c5-ba0e-92937fb56d11',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La citometria de flujo analiza:',
  '[{"text":"Celulas individuales en suspension","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Solo tejidos incluidos en parafina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Un unico gel de ADN","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Solo organulos fijos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '417cd8c5-0e01-522d-be87-dbb054b1e5b4',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'El cultivo celular permite:',
  '[{"text":"Evitar nutrientes","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Impedir division siempre","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Eliminar controles","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Mantener celulas en condiciones controladas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '69984a9f-9020-54b0-bdbc-053552803526',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La centrifugacion diferencial separa:',
  '[{"text":"Proteinas por codon","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Receptores por ligando","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Componentes por tamano y densidad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Genes por promotor","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '81166499-3d0b-5ae9-b3b3-31faf5383eee',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'Un anticuerpo monoclonal reconoce:',
  '[{"text":"Solo lipidos sin especificidad","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Un epitopo especifico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Todos los antigenos al azar","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Solo ADN","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '0817a368-845d-5216-b53a-494bd6c823b5',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La inmunofluorescencia permite:',
  '[{"text":"Detectar moleculas con anticuerpos marcados","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Amplificar ARN","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Crear animales knock out","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Medir presion osmotica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'bf6441c1-eae7-5d90-b79e-ce39b8578bcc',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'Un animal knock out tiene:',
  '[{"text":"Todos sus genes duplicados","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Ausencia de celulas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Solo virus","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Un gen inactivado experimentalmente","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '55e70315-f9a8-5172-b5e5-9ed4a0e7df9b',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'Los microarrays estudian:',
  '[{"text":"Un solo ion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Matriz extracelular solamente","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Expresion de muchos genes a la vez","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Solo forma celular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '4e5aa591-5caa-52f1-b13d-7a429a92b2a3',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La terapia genica intenta:',
  '[{"text":"Eliminar PCR","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Introducir o corregir material genetico con fin terapeutico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Bloquear toda expresion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Sustituir microscopia","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'ea2643ca-937d-5cc9-b719-11c9190c0e2f',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'El fraccionamiento celular requiere:',
  '[{"text":"Ruptura celular controlada y centrifugacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Celulas intactas sin romper","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Solo tincion H-E","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Solo anticuerpos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '74398344-f6b3-5876-b285-a2e6286897c2',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'mc',
  'La cuantificacion de acidos nucleicos puede usar:',
  '[{"text":"Onda P","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Potencial de Nernst","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Absorbancia a 260 nm","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'd61d8d45-60ca-52f2-bf12-ad60d09d7c83',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'ms',
  'Selecciona tecnicas de microscopia.',
  '[{"text":"Optica convencional","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Electronica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Fluorescencia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"ELISA como microscopio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '21063b24-6af8-5f47-b494-2728b3e1a649',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'ms',
  'Selecciona tecnicas de ADN.',
  '[{"text":"PCR","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Secuenciacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Hibridacion in situ","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Electroforesis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Fagocitosis","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'f099c1c3-2947-505b-b036-6d6f750d3666',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'ms',
  'Selecciona tecnicas inmunologicas.',
  '[{"text":"Anticuerpos monoclonales","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"ELISA","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Inmunofluorescencia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Nernst","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'add83ea1-40e2-5a18-b52e-a263e62088e6',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'ms',
  'Selecciona usos de cultivo celular.',
  '[{"text":"Ensayo experimental","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Produccion biologica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Observacion de respuestas celulares","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Formar priones obligatoriamente","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '47c37b87-f83c-5f48-bd34-b1d7aa697c36',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'ms',
  'Selecciona pasos generales de fraccionamiento.',
  '[{"text":"Homogeneizacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Centrifugacion diferencial","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Obtencion de fracciones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Transcripcion nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '3550e672-2be8-555e-b5b1-e818cfcdf6ee',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'ms',
  'Selecciona enfoques de genetica experimental.',
  '[{"text":"ADN recombinante","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Transgenesis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Knock out","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Terapia genica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"},{"text":"Exocitosis constitutiva","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  'cdea344d-1dd6-5f90-beed-8d34a7bb945e',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'dnd',
  'Relaciona tecnicas.',
  '[{"text":"Microscopia optica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":13,"pinY":35},{"text":"Microscopia electronica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":32,"pinY":35},{"text":"PCR","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":50,"pinY":35},{"text":"Secuenciacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":69,"pinY":35},{"text":"Citometria","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":41,"pinY":67},{"text":"Centrifugacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  'ba6c9d3a-25a1-560d-beec-28be6d6d5b9a',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'dnd',
  'Relaciona biologia molecular.',
  '[{"text":"PCR","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":50,"pinY":35},{"text":"ADN molde","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":50,"pinY":45},{"text":"Secuenciacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":69,"pinY":35},{"text":"Nucleotidos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":69,"pinY":45},{"text":"Hibridacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":86,"pinY":35}]'::jsonb,
  false, 25, 1, 75
),
(
  '5688e93f-8915-58ce-be87-25dbb3e70323',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'dnd',
  'Relaciona inmunodeteccion.',
  '[{"text":"Antigeno","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":20,"pinY":67},{"text":"Anticuerpo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":32,"pinY":67},{"text":"ELISA","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":22,"pinY":67},{"text":"Fluorescencia","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":13,"pinY":35},{"text":"Citometria","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '32812aa2-fa83-5872-bc69-0b64a54caaf7',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'dnd',
  'Relaciona fraccionamiento.',
  '[{"text":"Homogeneizado","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":58,"pinY":67},{"text":"Centrifugacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":78,"pinY":67},{"text":"Nucleo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":20,"pinY":40},{"text":"Mitocondria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":36,"pinY":45},{"text":"Microsomas","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":55,"pinY":50}]'::jsonb,
  false, 27, 1, 75
),
(
  '8ee00116-a053-5b21-b7fd-4696bc68d2a9',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'dnd',
  'Relaciona microscopia.',
  '[{"text":"Optica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":13,"pinY":35},{"text":"Luz visible","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":13,"pinY":45},{"text":"Electronica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":32,"pinY":35},{"text":"Electrones","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":32,"pinY":45},{"text":"Resolucion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":50,"pinY":50}]'::jsonb,
  false, 28, 1, 75
),
(
  'ab65b469-e058-5eba-be6e-ba7fe29af7ef',
  '7b163c43-f925-5c44-bdd6-98f2b980add2',
  'dnd',
  'Relaciona cultivo celular.',
  '[{"text":"Cultivo celular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":58,"pinY":67},{"text":"Medio nutritivo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":58,"pinY":77},{"text":"Incubador","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":70,"pinY":77},{"text":"Linea celular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":82,"pinY":77},{"text":"Ensayo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap02_metodos_tecnicas.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632', 'Capitulo 3 Biologia Celular - membrana plasmatica', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar mosaico fluido, lipidos, proteinas, glucocaliz y fluidez de membrana desde Calvo.', 'BC03P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 3: estructura de la membrana plasmatica', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '9c30c89e-cc46-53a9-b001-a33a8bc8a632';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '37ba4932-94b7-5e61-b947-f4a6134809f1',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'El modelo de mosaico fluido propone:',
  '[{"text":"Bicapa lipidica con proteinas moviles","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Sandwich rigido de proteina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Pared de celulosa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Cromatina condensada","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '9d75028f-cb94-5ecf-b688-2ac27d625152',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'Los fosfolipidos son:',
  '[{"text":"Solo hidrofobos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Solo proteicos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Acidos nucleicos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Anfipaticos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '6272d603-32be-5368-b0d7-1179ca72786f',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'El colesterol modula:',
  '[{"text":"Splicing","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Transcripcion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Fluidez de membrana","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Codigo genetico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  'ab025801-7ba2-5322-b786-966793aedba0',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'Las balsas lipidicas son ricas en:',
  '[{"text":"Actina y miosina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Colesterol y esfingolipidos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"ADN y histonas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Ribosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '614bfe47-0c21-593f-b71e-7042d83f0c0c',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'Una proteina integral:',
  '[{"text":"Se inserta en la bicapa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Esta siempre fuera de membrana","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Es ADN","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Es glucogeno","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'beedc16a-49b5-5702-bfc1-3e680399eda5',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'El glucocaliz se ubica:',
  '[{"text":"En matriz mitocondrial","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Dentro del nucleolo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"En ribosoma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"En la cara extracelular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '881914ae-aaa7-5ab0-bbf8-6d2d5c371d73',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'La asimetria de membrana significa:',
  '[{"text":"Sin proteinas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Solo colesterol","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Diferente composicion en cada monocapa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Ambas caras identicas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '12193665-6f9b-500b-bac2-78f1ce17381f',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'La fluidez aumenta con:',
  '[{"text":"Mas enlaces rigidos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Acidos grasos insaturados","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Saturacion extrema","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Baja temperatura siempre","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '2703c010-b225-5bf2-bfe6-ecdbd32ce451',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'La temperatura de fusion se relaciona con:',
  '[{"text":"Paso gel-fluido de lipidos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Inicio de mitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Activacion de PCR","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Coagulacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '090f4037-475e-5343-b77c-9e3cc0f2f8a3',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'Las glucoproteinas participan en:',
  '[{"text":"Sintesis de ATP","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Replicacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Beta oxidacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Reconocimiento celular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '9935decc-5714-59e6-b3ba-a28bed593c0e',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'Las proteinas perifericas se asocian:',
  '[{"text":"Dentro del ADN","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Como histonas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"A una cara de la membrana","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Atravesando siempre toda bicapa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '4999aeb7-929e-5864-bbcd-9c73944122ba',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'Los esfingolipidos son importantes en:',
  '[{"text":"Peroxisomas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Microdominios y reconocimiento","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Splicing","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Ribosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '3a8bce2a-abda-5528-b69c-da2c9908520b',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'La membrana mitocondrial interna tiene:',
  '[{"text":"Alto contenido proteico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Solo glucidos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Ausencia de proteinas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Nucleosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'fb18b71c-d764-54c0-b910-dde66c5f48df',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'La movilidad lateral de lipidos apoya:',
  '[{"text":"Rigidez absoluta","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Imposibilidad de difusion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Cristalizacion permanente","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Dinamismo del mosaico fluido","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'a05276b1-a62c-50cd-b040-90649cfc1823',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'La cubierta glucidica protege y participa en:',
  '[{"text":"Degradacion proteasomal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Traduccion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Adhesion y reconocimiento","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Contraccion muscular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'd98fd4b3-e981-5162-bec3-23d82215a279',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'Una proteina transmembrana puede funcionar como:',
  '[{"text":"Peroxisoma","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Canal, receptor o transportador","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Histona nuclear","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Codon","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'd24fc10e-c6ba-581f-bd29-9088f922915d',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'La membrana es selectiva porque:',
  '[{"text":"Su composicion regula paso molecular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Permite paso libre a todo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"No tiene lipidos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Es pared mineral","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'd981bb87-5d31-530b-b44d-43695560dd5f',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'mc',
  'Los lipidos de membrana se organizan espontaneamente por:',
  '[{"text":"Codigo genetico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Bomba Na-K","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Splicing","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Efecto hidrofobico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '7208bb85-b271-5697-ba76-bb2962a0bfcc',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'ms',
  'Selecciona componentes de membrana.',
  '[{"text":"Fosfolipidos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Colesterol","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Proteinas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Glucidos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Cromosomas","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '39da517e-2b11-5362-bc61-2b02f9900d8c',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'ms',
  'Selecciona funciones del glucocaliz.',
  '[{"text":"Proteccion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Reconocimiento","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Adhesion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Sintesis de ATP","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '90240f46-33b4-5a0c-bf7c-b8a892922bc7',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'ms',
  'Selecciona tipos de proteinas de membrana.',
  '[{"text":"Integrales","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Perifericas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Ancladas a lipidos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Histonas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '6dd9b7a3-b1fc-51c9-bb4f-6773b955f874',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'ms',
  'Selecciona factores de fluidez.',
  '[{"text":"Temperatura","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Colesterol","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Insaturacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Longitud de cadenas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Numero de intrones","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '9c657d71-6c0e-5dff-bfd2-95366d15f33d',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'ms',
  'Selecciona conceptos del mosaico fluido.',
  '[{"text":"Bicapa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Movilidad lateral","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Proteinas insertas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Asimetria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Rigidez absoluta","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '57b0057e-6d72-53e8-b267-4043c2c5db92',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'ms',
  'Selecciona lipidos de rafts.',
  '[{"text":"Colesterol","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Esfingolipidos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"ARNr","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"},{"text":"Tubulina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '7a0341f1-fe14-59d6-ba3b-63f5210a5566',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"Bicapa lipidica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":15,"pinY":38},{"text":"Fosfolipidos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":33,"pinY":38},{"text":"Colesterol","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":50,"pinY":38},{"text":"Proteina integral","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":68,"pinY":38},{"text":"Glucocaliz","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":43,"pinY":69},{"text":"Balsa lipidica","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":25,"pinY":69}]'::jsonb,
  false, 24, 1, 75
),
(
  '09687c18-59ae-5053-b92b-0f8250cf4086',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"Balsa lipidica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":25,"pinY":69},{"text":"Glucocaliz","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":43,"pinY":69},{"text":"Proteina integral","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":68,"pinY":38},{"text":"Colesterol","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":50,"pinY":38},{"text":"Fosfolipidos","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":33,"pinY":38},{"text":"Bicapa lipidica","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":15,"pinY":38}]'::jsonb,
  false, 25, 1, 75
),
(
  '878e0c85-850d-5674-ba2e-6599c7622019',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"Bicapa lipidica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":15,"pinY":38},{"text":"Fosfolipidos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":33,"pinY":38},{"text":"Colesterol","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":50,"pinY":38},{"text":"Proteina integral","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":68,"pinY":38},{"text":"Glucocaliz","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":43,"pinY":69}]'::jsonb,
  false, 26, 1, 75
),
(
  '47827d76-1449-5c2a-b4af-3702e1771933',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"Fosfolipidos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":33,"pinY":38},{"text":"Colesterol","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":50,"pinY":38},{"text":"Proteina integral","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":68,"pinY":38},{"text":"Glucocaliz","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":43,"pinY":69},{"text":"Balsa lipidica","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":25,"pinY":69}]'::jsonb,
  false, 27, 1, 75
),
(
  'a5da9f0b-8f8b-5dcb-bf60-8a2525acb1ce',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"Bicapa lipidica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":15,"pinY":38},{"text":"Fosfolipidos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":33,"pinY":38},{"text":"Colesterol","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":50,"pinY":38},{"text":"Glucocaliz","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":43,"pinY":69},{"text":"Balsa lipidica","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":25,"pinY":69}]'::jsonb,
  false, 28, 1, 75
),
(
  '2bb935b1-7711-5dbe-bc3a-07bdae31a8db',
  '9c30c89e-cc46-53a9-b001-a33a8bc8a632',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"Bicapa lipidica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":15,"pinY":38},{"text":"Colesterol","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":50,"pinY":38},{"text":"Glucocaliz","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":43,"pinY":69},{"text":"Fosfolipidos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":33,"pinY":38},{"text":"Proteina integral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap03_membrana_estructura.svg","pinX":68,"pinY":38}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'f926bbd0-205f-543c-b3be-ea7ed1af070f', 'Capitulo 4 Biologia Celular - microtransporte', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar transporte pasivo, activo, canales ionicos y potencial de membrana desde Calvo.', 'BC04P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 4: transporte a traves de la membrana', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'f926bbd0-205f-543c-b3be-ea7ed1af070f';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '3a5ef5b2-88eb-5825-b161-236c5b09eeee',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Transporte pasivo ocurre:',
  '[{"text":"A favor del gradiente sin ATP directo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Contra gradiente siempre","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Solo por vesiculas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"En nucleolo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'c82cb7dd-fa33-5f61-b15b-a6e48141123d',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Difusion simple atraviesa:',
  '[{"text":"Ribosoma","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Proteasoma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Bicapa sin transportador especifico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'f164a01f-3884-5d92-b7c6-4e3552af9190',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Difusion facilitada usa:',
  '[{"text":"Histonas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Cilios","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Canales o transportadores","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  'd86eec71-a30f-55e4-ba29-eb0b8d9da27e',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Osmosis es movimiento de:',
  '[{"text":"Colesterol","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Agua","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"ADN","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Proteinas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '30ce8bda-8858-576d-b4f1-d45de876baf0',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Transporte activo primario usa:',
  '[{"text":"Energia de ATP","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Gradiente de otro soluto solo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Luz visible","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Anticuerpos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '5645c842-9b56-5a6e-b963-7024746ad358',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Bomba Na-K es ejemplo de:',
  '[{"text":"Canal pasivo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Receptor nuclear","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Proteasoma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"ATPasa de transporte activo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '4fac4c5d-142a-584c-b180-113da9d07234',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Simporte mueve solutos:',
  '[{"text":"Sin membrana","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Solo por exocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"En la misma direccion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"En direcciones opuestas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '12d378c7-784b-5803-bb59-be454a7eec9b',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Antiporte mueve solutos:',
  '[{"text":"Solo ribosomas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"En direcciones opuestas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Misma direccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Solo vesiculas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '8c24747a-09a2-5291-b721-e7dbb764f0ea',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Canales dependientes de ligando se abren por:',
  '[{"text":"Union de una molecula reguladora","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Cambio de fase lipidica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Splicing","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Glicosilacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '9d6b1c9d-7df9-5bc0-b70a-2bb274528256',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Canales dependientes de voltaje responden a:',
  '[{"text":"ADN repetido","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"pH nuclear","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Colageno","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Cambio de potencial de membrana","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'a9f3212f-a9c3-52ec-bf56-156deb5b2c22',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'La ecuacion de Nernst estima:',
  '[{"text":"Tamano de vesicula","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Numero de intrones","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Potencial de equilibrio de un ion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Tasa de traduccion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'a8d32c00-50f6-5c13-b90e-27d675e4a975',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'La permeabilidad selectiva depende de:',
  '[{"text":"Solo colageno","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Membrana y proteinas transportadoras","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Ausencia de lipidos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Solo ADN","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '35ebcf26-d4a8-5da8-b770-597c8fccfaae',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Un gradiente electroquimico combina:',
  '[{"text":"Concentracion y carga electrica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Color y forma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Masa y edad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"ARN y histona","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '3151c2e9-058a-5e9e-b311-2fe4dedf5349',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'El transporte activo secundario usa:',
  '[{"text":"ATP directo siempre","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Anticuerpos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Luz UV","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Energia almacenada en gradiente ionico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '6643fbf5-9504-5d54-b6ad-705f62589686',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Un canal ionico es generalmente:',
  '[{"text":"Una histona","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Un lisosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Selectivo y regulable","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Inespecifico siempre","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '9a8b1e91-fe83-592c-b245-cf557725a0e9',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'El potencial de membrana depende de:',
  '[{"text":"Golgi cis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Distribucion desigual de iones","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Numero de vesiculas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Longitud de ADN","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '7ccd11ab-73e8-5447-bcca-443a7bac0835',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'La membrana impide paso libre de:',
  '[{"text":"Moleculas polares grandes","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Gases pequenos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Moleculas liposolubles pequenas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Agua por acuaporinas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'a924c6c7-c161-5a1b-b41d-083df3571160',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'mc',
  'Las acuaporinas facilitan:',
  '[{"text":"ADN","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Proteinas plegadas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Colesterol esterificado","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Movimiento de agua","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '95d52943-65de-59dc-b6eb-46b16363a9e5',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'ms',
  'Selecciona transportes pasivos.',
  '[{"text":"Difusion simple","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Difusion facilitada","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Osmosis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Bomba Na-K","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '23434bfd-4d45-5944-babd-46a33c059e85',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'ms',
  'Selecciona transportes activos.',
  '[{"text":"Primario","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Secundario","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Simporte acoplado","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Antiporte acoplado","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Difusion simple","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'd2191ab5-3829-5961-b4db-a50eed6b837d',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'ms',
  'Selecciona regulaciones de canales.',
  '[{"text":"Ligando","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Voltaje","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Mecanica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Codigo genetico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '8969b4e8-e027-5e8a-beb2-3790f055eea1',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'ms',
  'Selecciona componentes del gradiente electroquimico.',
  '[{"text":"Gradiente quimico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Diferencia electrica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Glucocaliz","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '2a77e70c-b154-5f13-bf30-bbe67032987e',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'ms',
  'Selecciona funciones de bomba Na-K.',
  '[{"text":"Mantener gradientes de Na","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Mantener gradientes de K","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Contribuir al potencial","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Sintetizar ARN","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'b92b21cb-ef3a-5558-bae3-61f6276b0ca5',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'ms',
  'Selecciona permeables con facilidad relativa.',
  '[{"text":"Gases","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Moleculas liposolubles pequenas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Iones sin canal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"},{"text":"Proteinas grandes","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '35b5fa4b-f6bc-58f8-bc04-549758000dcc',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"Difusion simple","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":15,"pinY":36},{"text":"Difusion facilitada","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":33,"pinY":36},{"text":"Osmosis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":51,"pinY":36},{"text":"Canal ionico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":69,"pinY":36},{"text":"Bomba Na-K","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":85,"pinY":36},{"text":"Antiporte","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":58,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  'a9d388d1-b684-50dc-b042-75b4a631cc1c',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"Antiporte","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":58,"pinY":67},{"text":"Bomba Na-K","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":85,"pinY":36},{"text":"Canal ionico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":69,"pinY":36},{"text":"Osmosis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":51,"pinY":36},{"text":"Difusion facilitada","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":33,"pinY":36},{"text":"Difusion simple","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":15,"pinY":36}]'::jsonb,
  false, 25, 1, 75
),
(
  '929dc5eb-023a-529f-bb99-caae245cccbc',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"Difusion simple","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":15,"pinY":36},{"text":"Difusion facilitada","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":33,"pinY":36},{"text":"Osmosis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":51,"pinY":36},{"text":"Canal ionico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":69,"pinY":36},{"text":"Bomba Na-K","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":85,"pinY":36}]'::jsonb,
  false, 26, 1, 75
),
(
  '5d8165e1-6e9d-5af2-b012-937e67f59aec',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"Difusion facilitada","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":33,"pinY":36},{"text":"Osmosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":51,"pinY":36},{"text":"Canal ionico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":69,"pinY":36},{"text":"Bomba Na-K","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":85,"pinY":36},{"text":"Antiporte","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":58,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  '0c808387-b2b9-5d74-b055-0361410f11ce',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"Difusion simple","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":15,"pinY":36},{"text":"Difusion facilitada","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":33,"pinY":36},{"text":"Osmosis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":51,"pinY":36},{"text":"Bomba Na-K","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":85,"pinY":36},{"text":"Antiporte","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":58,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'b6904a57-3da3-5e00-b3db-c2ed32aa298d',
  'f926bbd0-205f-543c-b3be-ea7ed1af070f',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"Difusion simple","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":15,"pinY":36},{"text":"Osmosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":51,"pinY":36},{"text":"Bomba Na-K","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":85,"pinY":36},{"text":"Difusion facilitada","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":33,"pinY":36},{"text":"Canal ionico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap04_microtransporte.svg","pinX":69,"pinY":36}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '409130f8-5f0b-5819-b5e4-9807f2b48f77', 'Capitulo 5 Biologia Celular - macrotransporte', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar endocitosis, exocitosis, vesiculas, clatrina, caveolas y trafico de membrana desde Calvo.', 'BC05P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 5: endocitosis y exocitosis', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '409130f8-5f0b-5819-b5e4-9807f2b48f77';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '585aca8d-0ec3-520d-b46a-cc58471619c1',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'Endocitosis introduce material a la celula. Identifica el concepto:',
  '[{"text":"Endocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'e0ef7c94-c1af-5033-bfd1-32f9928861a1',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'Exocitosis libera material al exterior. Identifica el concepto:',
  '[{"text":"Endocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'ce7b03ee-51fe-5cc9-b989-451ffcdf6957',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'Clatrina recubre vesiculas. Identifica el concepto:',
  '[{"text":"Exocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '78e5e3e3-ae7a-5d69-bb1d-49058ced9515',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'Caveolas son invaginaciones ricas en colesterol. Identifica el concepto:',
  '[{"text":"Clatrina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'b5dd5e2b-3ace-5d6f-b9b1-a44e59ab1a58',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'Endosomas clasifican carga. Identifica el concepto:',
  '[{"text":"Endosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '2b55fd83-bc73-5fa5-bf55-fcdfd18af78f',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'Lisosomas degradan con hidrolasas acidas. Identifica el concepto:',
  '[{"text":"Endocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Lisosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '68676eae-4cfe-5a4f-ba78-813cb0e8b869',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'SNARE facilita fusion vesicular. Identifica el concepto:',
  '[{"text":"Exocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"SNARE","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '07c41174-e87f-54a4-b39b-ad51643bbc65',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'Transcitosis cruza la celula. Identifica el concepto:',
  '[{"text":"Clatrina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Transcitosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  'cc03a801-e726-5640-b9dc-ad4f018361ef',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Endocitosis se relaciona mejor con:',
  '[{"text":"celula","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'b53b79d8-3424-59c3-b098-63e3854d6da0',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Exocitosis se relaciona mejor con:',
  '[{"text":"Endocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"exterior","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '3e50eb2b-ee59-538b-b428-89c32dd836d8',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Clatrina se relaciona mejor con:',
  '[{"text":"Exocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"vesiculas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'd152d2d4-f505-5b07-b423-d127e6255483',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Caveolas se relaciona mejor con:',
  '[{"text":"Clatrina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"colesterol","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '9c084194-06bc-548f-b6de-8be97035e51e',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Endosoma se relaciona mejor con:',
  '[{"text":"carga","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '1d065e62-569b-501d-b851-19021791e200',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Lisosoma se relaciona mejor con:',
  '[{"text":"Endocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"acidas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'edea7f6e-6b2d-5640-bb7a-ec0e29472cee',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, SNARE se relaciona mejor con:',
  '[{"text":"Exocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"vesicular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '45a5cc17-f5b6-591b-b079-76e6d9769906',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Transcitosis se relaciona mejor con:',
  '[{"text":"Clatrina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"celula","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endocitosis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'd8348bc0-3825-5e39-b4f4-b27d7092c05c',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Endocitosis se relaciona mejor con:',
  '[{"text":"celula","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '9a5c349e-89b8-52e3-b8ff-df385c693d82',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'mc',
  'En el capitulo 5, Exocitosis se relaciona mejor con:',
  '[{"text":"Endocitosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"exterior","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '553d0ac8-208b-52cf-bbc6-08c14be0c256',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'ms',
  'Selecciona conceptos centrales del capitulo.',
  '[{"text":"Endocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'a7a83159-4c5d-54ac-b0f9-dd2e9979b8bb',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'ms',
  'Selecciona estructuras o procesos relacionados.',
  '[{"text":"Endosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Lisosoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"SNARE","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Transcitosis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Onda P","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '8bc78773-8978-54ef-b906-9b2989bc23b7',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'ms',
  'Selecciona pares correctos de este tema.',
  '[{"text":"Endocitosis: introduce material a la","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Exocitosis: libera material al exterior","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Nucleolo: bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'cca84c6d-5e52-5161-bf72-8f1254fe29b6',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'ms',
  'Selecciona componentes funcionales.',
  '[{"text":"Endocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Clatrina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Endosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Virus como organulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'f3849b31-317f-5bac-b6f8-4bb1ebb9440f',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'ms',
  'Selecciona elementos que requieren regulacion celular.',
  '[{"text":"Exocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Caveolas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Lisosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Cristalino ocular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '25b4fa87-fd0f-5d71-be3b-52b1c460b673',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'ms',
  'Selecciona aplicaciones biomédicas posibles.',
  '[{"text":"SNARE","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Transcitosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"},{"text":"Presion arterial sistolica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  'c818df0f-92a9-5464-b175-78a4426aad79',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"Fagocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":15,"pinY":36},{"text":"Pinocitosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":33,"pinY":36},{"text":"Receptor","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":51,"pinY":36},{"text":"Clatrina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":69,"pinY":36},{"text":"Caveola","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":85,"pinY":36},{"text":"SNARE","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":80,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '2b026136-3fd8-57f2-b8d3-0ba643197e83',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"SNARE","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":80,"pinY":67},{"text":"Caveola","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":85,"pinY":36},{"text":"Clatrina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":69,"pinY":36},{"text":"Receptor","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":51,"pinY":36},{"text":"Pinocitosis","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":33,"pinY":36},{"text":"Fagocitosis","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":15,"pinY":36}]'::jsonb,
  false, 25, 1, 75
),
(
  'faae8fa6-8671-5ed8-b693-55de17400b2a',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"Fagocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":15,"pinY":36},{"text":"Pinocitosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":33,"pinY":36},{"text":"Receptor","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":51,"pinY":36},{"text":"Clatrina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":69,"pinY":36},{"text":"Caveola","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":85,"pinY":36}]'::jsonb,
  false, 26, 1, 75
),
(
  'b6f9da03-5d00-54ee-badb-2966fff6efc8',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"Pinocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":33,"pinY":36},{"text":"Receptor","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":51,"pinY":36},{"text":"Clatrina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":69,"pinY":36},{"text":"Caveola","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":85,"pinY":36},{"text":"SNARE","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":80,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  'e6170c57-3b52-5d21-b41c-f4b859153ad3',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"Fagocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":15,"pinY":36},{"text":"Pinocitosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":33,"pinY":36},{"text":"Receptor","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":51,"pinY":36},{"text":"Caveola","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":85,"pinY":36},{"text":"SNARE","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":80,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '509898ee-6449-597e-b181-d559f7dac0bf',
  '409130f8-5f0b-5819-b5e4-9807f2b48f77',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"Fagocitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":15,"pinY":36},{"text":"Receptor","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":51,"pinY":36},{"text":"Caveola","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":85,"pinY":36},{"text":"Pinocitosis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":33,"pinY":36},{"text":"Clatrina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap05_macrotransporte.svg","pinX":69,"pinY":36}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f', 'Capitulo 6 Biologia Celular - especializaciones de membrana', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar uniones celulares, membrana basal, matriz extracelular e integrinas desde Calvo.', 'BC06P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 6: especializaciones de membrana e interaccion celular', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'b92dab4b-3ae0-5d19-becb-9925e95a5a29',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'Microvellosidades aumentan superficie. Identifica el concepto:',
  '[{"text":"Microvellosidades","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '0cb827c1-5693-5a7d-b9a1-05a202f8020d',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'Cilios dependen de microtubulos y dineina. Identifica el concepto:',
  '[{"text":"Microvellosidades","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'bd6757d4-1372-5176-b548-81c525311af8',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'Uniones estrechas sellan espacio paracelular. Identifica el concepto:',
  '[{"text":"Cilios","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '82d0f4dc-36fa-5219-ba98-759040163da3',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'Desmosomas dan adhesion mecanica. Identifica el concepto:',
  '[{"text":"Uniones estrechas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'edfb9d0a-e83d-5e93-b9dc-53a0d748c950',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'Uniones gap comunican citoplasmas. Identifica el concepto:',
  '[{"text":"Gap","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'a2f3ee76-116d-5b9f-b4f4-dd6f8276981b',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'Membrana basal sostiene epitelios. Identifica el concepto:',
  '[{"text":"Microvellosidades","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Membrana basal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '21d2716e-c136-543c-b787-1649c2f60b49',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'MEC contiene fibras y sustancia fundamental. Identifica el concepto:',
  '[{"text":"Cilios","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Matriz extracelular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '814cf800-f86f-5182-bf87-cef94db61b82',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'Integrinas conectan MEC y citoesqueleto. Identifica el concepto:',
  '[{"text":"Uniones estrechas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Integrinas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '230d7ebe-928b-58b7-b295-c8cde56a3d2a',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Microvellosidades se relaciona mejor con:',
  '[{"text":"superficie","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '8403762c-f85c-558f-b564-cbca049953f1',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Cilios se relaciona mejor con:',
  '[{"text":"Microvellosidades","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"dineina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'bbe12004-20ab-5cc3-b33a-e3388892fdf8',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Uniones estrechas se relaciona mejor con:',
  '[{"text":"Cilios","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"paracelular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '3bf9414b-937e-54cd-b9d2-543659227c33',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Desmosomas se relaciona mejor con:',
  '[{"text":"Uniones estrechas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"mecanica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '5caf7f60-60dc-5a63-b7ee-1f15830c2dd6',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Gap se relaciona mejor con:',
  '[{"text":"citoplasmas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '4e01b09b-4f07-5fdb-b983-64676900cc34',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Membrana basal se relaciona mejor con:',
  '[{"text":"Microvellosidades","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"epitelios","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '0ce3b92f-0a3a-5ba0-b7cb-7f3b9ae15cfd',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Matriz extracelular se relaciona mejor con:',
  '[{"text":"Cilios","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"fundamental","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '96c09274-4443-59ae-b5e1-a957cdf8d080',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Integrinas se relaciona mejor con:',
  '[{"text":"Uniones estrechas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"citoesqueleto","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Microvellosidades","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '2324067c-ffe3-5e58-b3e0-d5fb02e3c54e',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Microvellosidades se relaciona mejor con:',
  '[{"text":"superficie","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '46a69444-c0cf-51e7-bfa7-912b8b793473',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'mc',
  'En el capitulo 6, Cilios se relaciona mejor con:',
  '[{"text":"Microvellosidades","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"dineina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'ab8a57ff-6c20-530c-b460-eff257517674',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'ms',
  'Selecciona conceptos centrales del capitulo.',
  '[{"text":"Microvellosidades","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '9697652c-6ed7-531e-bc2b-b4d3aebd54c3',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'ms',
  'Selecciona estructuras o procesos relacionados.',
  '[{"text":"Gap","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Membrana basal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Matriz extracelular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Integrinas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Onda P","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'aa2ed04b-9df6-5678-bbc7-58e1e52985fa',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'ms',
  'Selecciona pares correctos de este tema.',
  '[{"text":"Microvellosidades: aumentan superficie","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cilios: dependen de microtubulos y","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Nucleolo: bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'ef8f1aef-f0c1-501c-b46f-3c502ab4d445',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'ms',
  'Selecciona componentes funcionales.',
  '[{"text":"Microvellosidades","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Uniones estrechas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Gap","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Virus como organulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'f01da451-0d08-508e-b71d-b3f5e260f035',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'ms',
  'Selecciona elementos que requieren regulacion celular.',
  '[{"text":"Cilios","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Desmosomas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Membrana basal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Cristalino ocular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '1ffbaa07-b20e-50c1-b2ca-d8cdd054728c',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'ms',
  'Selecciona aplicaciones biomédicas posibles.',
  '[{"text":"Matriz extracelular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Integrinas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"},{"text":"Presion arterial sistolica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  'e08d521d-ae03-591d-bc68-f0ddda5605c9',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"Microvellosidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":13,"pinY":35},{"text":"Cilio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":32,"pinY":35},{"text":"Union estrecha","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":50,"pinY":35},{"text":"Desmosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":69,"pinY":35},{"text":"Gap","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":86,"pinY":35},{"text":"Integrina","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '41483e67-1510-58e6-b614-509cc26ee191',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"Integrina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":78,"pinY":67},{"text":"Gap","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":86,"pinY":35},{"text":"Desmosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":69,"pinY":35},{"text":"Union estrecha","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":50,"pinY":35},{"text":"Cilio","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":32,"pinY":35},{"text":"Microvellosidad","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":13,"pinY":35}]'::jsonb,
  false, 25, 1, 75
),
(
  '9b13303b-4d68-558e-be12-8dcbaa4fbd39',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"Microvellosidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":13,"pinY":35},{"text":"Cilio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":32,"pinY":35},{"text":"Union estrecha","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":50,"pinY":35},{"text":"Desmosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":69,"pinY":35},{"text":"Gap","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":86,"pinY":35}]'::jsonb,
  false, 26, 1, 75
),
(
  'aacbc3c1-82d8-55f2-b296-f5b5ea443c79',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"Cilio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":32,"pinY":35},{"text":"Union estrecha","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":50,"pinY":35},{"text":"Desmosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":69,"pinY":35},{"text":"Gap","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":86,"pinY":35},{"text":"Integrina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  'ecb7f98c-41e7-5ee2-bd39-f14983e12288',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"Microvellosidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":13,"pinY":35},{"text":"Cilio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":32,"pinY":35},{"text":"Union estrecha","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":50,"pinY":35},{"text":"Gap","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":86,"pinY":35},{"text":"Integrina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '5dbd019c-2c41-55f6-b055-7ff603e7b5d4',
  '6c79a27b-8b9f-558b-b6ac-515dbaf7ff1f',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"Microvellosidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":13,"pinY":35},{"text":"Union estrecha","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":50,"pinY":35},{"text":"Gap","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":86,"pinY":35},{"text":"Cilio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":32,"pinY":35},{"text":"Desmosoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap06_especializaciones_mec.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82', 'Capitulo 7 Biologia Celular - nucleo I', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar envoltura nuclear, cromatina, cromosomas, replicacion, reparacion y recombinacion desde Calvo.', 'BC07P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 7: organizacion de cromatina y conservacion genetica', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '1f4072c0-6653-52fc-b39a-3ff2a33eac82';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '296d0ed1-bae6-5605-bc3c-39951fd9e2e0',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'Envoltura nuclear tiene doble membrana. Identifica el concepto:',
  '[{"text":"Envoltura nuclear","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '1bf2f1d6-03f1-5632-b15a-8f76c31de755',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'Poros nucleares regulan transporte. Identifica el concepto:',
  '[{"text":"Envoltura nuclear","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '3fa5baff-4d0f-5d32-b458-108d6da64553',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'Cromatina combina ADN e histonas. Identifica el concepto:',
  '[{"text":"Poros nucleares","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '4e6fcec7-6509-5b45-b341-d472e2ed4687',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'Nucleosoma es unidad basica de cromatina. Identifica el concepto:',
  '[{"text":"Cromatina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'f549d8fd-7989-587f-bb66-8e25b6bba514',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'Eucromatina es menos condensada. Identifica el concepto:',
  '[{"text":"Eucromatina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '9c67e1be-1595-5065-b643-b7dfc180d877',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'Heterocromatina es mas condensada. Identifica el concepto:',
  '[{"text":"Envoltura nuclear","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Heterocromatina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '4b4c5c13-fbc3-591e-bcee-632aee43c467',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'Replicacion conserva informacion genetica. Identifica el concepto:',
  '[{"text":"Poros nucleares","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Replicacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '5fd74e3b-a4ea-5f19-b7f6-e559c5102ed9',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'Reparacion corrige lesiones del ADN. Identifica el concepto:',
  '[{"text":"Cromatina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Reparacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  'e3ffff82-de02-53e5-b6d2-5a8dea871fbc',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Envoltura nuclear se relaciona mejor con:',
  '[{"text":"membrana","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'c9ecde52-2e66-598c-b497-134b51c852d7',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Poros nucleares se relaciona mejor con:',
  '[{"text":"Envoltura nuclear","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"transporte","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '0ec4dae2-a7d6-5357-b68e-40e65406fcba',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Cromatina se relaciona mejor con:',
  '[{"text":"Poros nucleares","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"histonas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'f7115d1b-c4d6-5715-bf1f-173418ae07ed',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Nucleosoma se relaciona mejor con:',
  '[{"text":"Cromatina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"cromatina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'c42f07f0-4ca6-5bf8-b325-53cdef3ca678',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Eucromatina se relaciona mejor con:',
  '[{"text":"condensada","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '6292a020-64e3-5571-be3c-404c1be2814c',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Heterocromatina se relaciona mejor con:',
  '[{"text":"Envoltura nuclear","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"condensada","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'fe034895-7e65-58d0-b421-b930b1c96d94',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Replicacion se relaciona mejor con:',
  '[{"text":"Poros nucleares","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"genetica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '0b774b2a-9b5f-5ade-b13d-61d1425c2947',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Reparacion se relaciona mejor con:',
  '[{"text":"Cromatina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"ADN","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Envoltura nuclear","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'e16cfdc1-43f6-53e2-b233-685ec2b10212',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Envoltura nuclear se relaciona mejor con:',
  '[{"text":"membrana","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '34160785-87e5-5c6c-b4e1-7dcc885ce16a',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'mc',
  'En el capitulo 7, Poros nucleares se relaciona mejor con:',
  '[{"text":"Envoltura nuclear","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"transporte","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '76cecc3e-39b3-51f3-b4cf-7079b753adcb',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'ms',
  'Selecciona conceptos centrales del capitulo.',
  '[{"text":"Envoltura nuclear","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '769717ff-df32-5972-bbd9-8a650815c314',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'ms',
  'Selecciona estructuras o procesos relacionados.',
  '[{"text":"Eucromatina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Heterocromatina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Replicacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Reparacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Onda P","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '32f9e43c-44c8-5abc-b2c4-71cb98c101c2',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'ms',
  'Selecciona pares correctos de este tema.',
  '[{"text":"Envoltura nuclear: nuclear tiene doble membrana","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Poros nucleares: nucleares regulan transporte","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleolo: bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '2d7e0461-378f-527a-beb3-8edf73954f81',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'ms',
  'Selecciona componentes funcionales.',
  '[{"text":"Envoltura nuclear","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cromatina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Eucromatina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Virus como organulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'cb5c3bd8-c5b5-5c69-b3a6-5472bd1b3b63',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'ms',
  'Selecciona elementos que requieren regulacion celular.',
  '[{"text":"Poros nucleares","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Nucleosoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Heterocromatina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Cristalino ocular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'f22829fd-977c-551a-bc2e-a63045a8eb69',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'ms',
  'Selecciona aplicaciones biomédicas posibles.',
  '[{"text":"Replicacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Reparacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"},{"text":"Presion arterial sistolica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '5aaf5cdd-5fde-542c-b429-996c39fec77d',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"Envoltura nuclear","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":15,"pinY":35},{"text":"Poro nuclear","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":33,"pinY":35},{"text":"Nucleosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":51,"pinY":35},{"text":"Eucromatina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":69,"pinY":35},{"text":"Heterocromatina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":85,"pinY":35},{"text":"Replicacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":40,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '3e725296-96a1-5764-b099-94594de9bf24',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"Replicacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":40,"pinY":67},{"text":"Heterocromatina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":85,"pinY":35},{"text":"Eucromatina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":69,"pinY":35},{"text":"Nucleosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":51,"pinY":35},{"text":"Poro nuclear","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":33,"pinY":35},{"text":"Envoltura nuclear","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":15,"pinY":35}]'::jsonb,
  false, 25, 1, 75
),
(
  'e731fa66-861f-54d6-bc24-11df137b0351',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"Envoltura nuclear","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":15,"pinY":35},{"text":"Poro nuclear","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":33,"pinY":35},{"text":"Nucleosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":51,"pinY":35},{"text":"Eucromatina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":69,"pinY":35},{"text":"Heterocromatina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":85,"pinY":35}]'::jsonb,
  false, 26, 1, 75
),
(
  '9609d12e-04df-5bd2-b04f-088cb849f24f',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"Poro nuclear","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":33,"pinY":35},{"text":"Nucleosoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":51,"pinY":35},{"text":"Eucromatina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":69,"pinY":35},{"text":"Heterocromatina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":85,"pinY":35},{"text":"Replicacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":40,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  '56f66820-70b4-516e-bdc7-e231c62e39a9',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"Envoltura nuclear","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":15,"pinY":35},{"text":"Poro nuclear","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":33,"pinY":35},{"text":"Nucleosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":51,"pinY":35},{"text":"Heterocromatina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":85,"pinY":35},{"text":"Replicacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":40,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'ba73a290-61bf-5d66-baa8-e5dad7f47b7b',
  '1f4072c0-6653-52fc-b39a-3ff2a33eac82',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"Envoltura nuclear","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":15,"pinY":35},{"text":"Nucleosoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":51,"pinY":35},{"text":"Heterocromatina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":85,"pinY":35},{"text":"Poro nuclear","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":33,"pinY":35},{"text":"Eucromatina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap07_nucleo_cromatina.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02', 'Capitulo 8 Biologia Celular - nucleo II', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar transcripcion, maduracion de ARN, splicing, exportacion y nucleolo desde Calvo.', 'BC08P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 8: transcripcion, maduracion del ARN y nucleolo', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '6c8515d9-3adc-57f1-b90d-c0ea81037f02';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'f87b5cbf-1489-5160-b626-16e555f31142',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'Transcripcion sintetiza ARN desde ADN. Identifica el concepto:',
  '[{"text":"Transcripcion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '4e4586f7-3cde-5ad2-bc98-cd2c0bf5679a',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'ARN polimerasa cataliza sintesis de ARN. Identifica el concepto:',
  '[{"text":"Transcripcion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '5c5863d2-23b2-53f0-b872-b8c8b66faf9f',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'Promotor inicia regulacion transcripcional. Identifica el concepto:',
  '[{"text":"ARN polimerasa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '96536a6c-883a-5ee8-b57e-d389e86372d9',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'Pre-ARNm requiere maduracion. Identifica el concepto:',
  '[{"text":"Promotor","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'c675d563-aee8-5352-b33f-b9bd0323e145',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'Caperuza 5 protege ARNm. Identifica el concepto:',
  '[{"text":"Caperuza 5","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'bc3f50bc-1aec-5259-bf07-a0180983ec15',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'Cola poli-A estabiliza extremo 3. Identifica el concepto:',
  '[{"text":"Transcripcion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Cola poli-A","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '677cd93e-0ba7-5605-bf8f-26cf5e20cde6',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'Splicing elimina intrones. Identifica el concepto:',
  '[{"text":"ARN polimerasa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Splicing","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '7b0daf08-6f65-5f0d-bc74-43b3b6485fb5',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'Nucleolo produce ARNr y subunidades ribosomales. Identifica el concepto:',
  '[{"text":"Promotor","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Nucleolo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  'f76a0ec9-4f0f-5da7-bece-1d51aedaa041',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, Transcripcion se relaciona mejor con:',
  '[{"text":"ADN","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '7cae76de-c317-577b-b8bd-c7aad33bcc46',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, ARN polimerasa se relaciona mejor con:',
  '[{"text":"Transcripcion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'c5b95c50-6c64-528d-ba8a-36fdcbb1d3f8',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, Promotor se relaciona mejor con:',
  '[{"text":"ARN polimerasa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"transcripcional","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'ab758efb-e4be-51bc-bdc2-c7eb352968f0',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, Pre-ARNm se relaciona mejor con:',
  '[{"text":"Promotor","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"maduracion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '61afa2f4-1eb8-583f-ba35-ace509ee9c6f',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, Caperuza 5 se relaciona mejor con:',
  '[{"text":"ARNm","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '44288ad3-efb0-5e4e-b591-faa5f6c56e4e',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, Cola poli-A se relaciona mejor con:',
  '[{"text":"Transcripcion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"3","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'fed10355-a470-52e4-bfaf-76e4625fccc2',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, Splicing se relaciona mejor con:',
  '[{"text":"ARN polimerasa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"intrones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'fc6aa492-0e6c-590a-bd32-718d6d489dda',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, Nucleolo se relaciona mejor con:',
  '[{"text":"Promotor","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ribosomales","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Transcripcion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '16bca50a-3d33-5a6b-bd96-0e6e1083dcd8',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, Transcripcion se relaciona mejor con:',
  '[{"text":"ADN","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '1d123794-e0d4-550f-b47b-0e7ed2c3955b',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'mc',
  'En el capitulo 8, ARN polimerasa se relaciona mejor con:',
  '[{"text":"Transcripcion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '1e1e1f24-7491-500d-b440-1df0456fdb12',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'ms',
  'Selecciona conceptos centrales del capitulo.',
  '[{"text":"Transcripcion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'bd1f777e-d523-5ffa-b6a2-7faea1a6ffcf',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'ms',
  'Selecciona estructuras o procesos relacionados.',
  '[{"text":"Caperuza 5","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Cola poli-A","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Splicing","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Nucleolo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Onda P","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'e8db09ea-6ad2-5313-b94c-4f7415079dd6',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'ms',
  'Selecciona pares correctos de este tema.',
  '[{"text":"Transcripcion: sintetiza ARN desde ADN","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"ARN polimerasa: polimerasa cataliza sintesis de","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Nucleolo: bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'cbfddf96-6484-5663-b3fb-d40a86e65947',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'ms',
  'Selecciona componentes funcionales.',
  '[{"text":"Transcripcion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Promotor","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Caperuza 5","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Virus como organulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'aafb18f6-e28b-52fa-b556-473f6e4a1fda',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'ms',
  'Selecciona elementos que requieren regulacion celular.',
  '[{"text":"ARN polimerasa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Pre-ARNm","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Cola poli-A","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Cristalino ocular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '670697c2-43a7-5a55-b99d-3379a1f5b9d6',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'ms',
  'Selecciona aplicaciones biomédicas posibles.',
  '[{"text":"Splicing","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Nucleolo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"},{"text":"Presion arterial sistolica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '5e89f01f-6233-566e-b101-aee64400d4e9',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"ARN polimerasa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":15,"pinY":35},{"text":"Promotor","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":33,"pinY":35},{"text":"Transcrito primario","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":51,"pinY":35},{"text":"Caperuza 5","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":69,"pinY":35},{"text":"Cola poli-A","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":85,"pinY":35},{"text":"Nucleolo","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '58a65324-7a9b-5d7e-be51-924b42c84ca7',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"Nucleolo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":76,"pinY":67},{"text":"Cola poli-A","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":85,"pinY":35},{"text":"Caperuza 5","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":69,"pinY":35},{"text":"Transcrito primario","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":51,"pinY":35},{"text":"Promotor","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":33,"pinY":35},{"text":"ARN polimerasa","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":15,"pinY":35}]'::jsonb,
  false, 25, 1, 75
),
(
  'd3330c21-c94b-5f54-b39a-7fd7add5e88a',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"ARN polimerasa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":15,"pinY":35},{"text":"Promotor","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":33,"pinY":35},{"text":"Transcrito primario","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":51,"pinY":35},{"text":"Caperuza 5","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":69,"pinY":35},{"text":"Cola poli-A","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":85,"pinY":35}]'::jsonb,
  false, 26, 1, 75
),
(
  'c2a2e930-a398-5be6-b38a-f83a3274f679',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"Promotor","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":33,"pinY":35},{"text":"Transcrito primario","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":51,"pinY":35},{"text":"Caperuza 5","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":69,"pinY":35},{"text":"Cola poli-A","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":85,"pinY":35},{"text":"Nucleolo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  '501fea86-8f71-5644-b646-19fc4fe47576',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"ARN polimerasa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":15,"pinY":35},{"text":"Promotor","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":33,"pinY":35},{"text":"Transcrito primario","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":51,"pinY":35},{"text":"Cola poli-A","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":85,"pinY":35},{"text":"Nucleolo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '573c9b73-a5ee-5b8c-ba40-667e4242dd10',
  '6c8515d9-3adc-57f1-b90d-c0ea81037f02',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"ARN polimerasa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":15,"pinY":35},{"text":"Transcrito primario","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":51,"pinY":35},{"text":"Cola poli-A","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":85,"pinY":35},{"text":"Promotor","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":33,"pinY":35},{"text":"Caperuza 5","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap08_transcripcion_nucleolo.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a', 'Capitulo 9 Biologia Celular - sintesis de proteinas', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar traduccion, codigo genetico, plegamiento, modificaciones y degradacion proteica desde Calvo.', 'BC09P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 9: sintesis y modificacion de proteinas', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '528acaf2-0131-5d2b-b5d9-5cac5ae8718a';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '91b4d1b7-74b3-5eee-b04b-baf905049edb',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'Traduccion sintetiza proteinas. Identifica el concepto:',
  '[{"text":"Traduccion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'c799ce86-8bf0-5115-b8c8-0830a190cc72',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'Ribosoma lee ARNm. Identifica el concepto:',
  '[{"text":"Traduccion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'e8e42e6d-fe6e-5b03-be72-f53d4ed166d0',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'ARNm porta codones. Identifica el concepto:',
  '[{"text":"Ribosoma","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '6134ec7b-4dea-5768-bbf6-8471906e0f6b',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'ARNt aporta aminoacidos. Identifica el concepto:',
  '[{"text":"ARNm","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'ff16104a-ac3f-5171-b25b-97ce8553582a',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'Codon especifica aminoacido o stop. Identifica el concepto:',
  '[{"text":"Codon","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '6031ed0b-ed48-579d-b043-dfdc33f0e5f1',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'Plegamiento define estructura funcional. Identifica el concepto:',
  '[{"text":"Traduccion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Plegamiento","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  'a1d72824-7ee9-54c8-b86d-c746b914d65c',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'Glicosilacion modifica proteinas. Identifica el concepto:',
  '[{"text":"Ribosoma","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Glicosilacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'c40bc952-57b6-5fc9-bd32-123de5d1c945',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'Proteasoma degrada proteinas ubiquitinadas. Identifica el concepto:',
  '[{"text":"ARNm","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Proteasoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '2caaaacf-b11c-571f-b67e-0d5db6fcf0fd',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, Traduccion se relaciona mejor con:',
  '[{"text":"proteinas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '3920a9bb-2e42-5176-b925-52ec7826cbaa',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, Ribosoma se relaciona mejor con:',
  '[{"text":"Traduccion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '598f8003-4f99-5145-ba7c-a0394a3d99c1',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, ARNm se relaciona mejor con:',
  '[{"text":"Ribosoma","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"codones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '2f916732-2189-5e43-b54a-d500cc4bdd93',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, ARNt se relaciona mejor con:',
  '[{"text":"ARNm","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"aminoacidos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'f5652575-cbbe-5aff-b801-85d2b9bf84c3',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, Codon se relaciona mejor con:',
  '[{"text":"stop","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '677eda56-ef17-554f-b885-1c0c0bab60cf',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, Plegamiento se relaciona mejor con:',
  '[{"text":"Traduccion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"funcional","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '93bbe1a1-06d5-52a7-bdaa-6ed766069804',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, Glicosilacion se relaciona mejor con:',
  '[{"text":"Ribosoma","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"proteinas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'c9be9bda-f8a6-564a-bccf-71be93bbff79',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, Proteasoma se relaciona mejor con:',
  '[{"text":"ARNm","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ubiquitinadas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Traduccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '0a8f716d-215c-5059-b35e-68aa69783fc5',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, Traduccion se relaciona mejor con:',
  '[{"text":"proteinas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '5141a7d9-3560-5726-b94d-144c1a85b55d',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'mc',
  'En el capitulo 9, Ribosoma se relaciona mejor con:',
  '[{"text":"Traduccion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '2c579abc-fff6-5ab9-b9c5-1c4f6f5fe19b',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'ms',
  'Selecciona conceptos centrales del capitulo.',
  '[{"text":"Traduccion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '60c7277d-3698-5a4e-b4c7-f62931283081',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'ms',
  'Selecciona estructuras o procesos relacionados.',
  '[{"text":"Codon","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Plegamiento","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Glicosilacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Proteasoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Onda P","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'a43250b0-1315-57f8-b7ae-d65b879a603c',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'ms',
  'Selecciona pares correctos de este tema.',
  '[{"text":"Traduccion: sintetiza proteinas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Ribosoma: lee ARNm","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Nucleolo: bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '2355ceee-c878-5689-b065-9ab61d19aa3d',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'ms',
  'Selecciona componentes funcionales.',
  '[{"text":"Traduccion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNm","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Codon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Virus como organulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'cf840cbe-1ed0-5121-ba28-8afa4226281b',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'ms',
  'Selecciona elementos que requieren regulacion celular.',
  '[{"text":"Ribosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"ARNt","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Plegamiento","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Cristalino ocular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '34d03161-94c1-54bc-b910-3f94e63c438f',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'ms',
  'Selecciona aplicaciones biomédicas posibles.',
  '[{"text":"Glicosilacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Proteasoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"},{"text":"Presion arterial sistolica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '32d32d1f-e069-5da2-ba80-ddfef30f3835',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"Ribosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":15,"pinY":35},{"text":"ARNm","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":33,"pinY":35},{"text":"ARNt","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":51,"pinY":35},{"text":"Codon","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":69,"pinY":35},{"text":"Peptido","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":85,"pinY":35},{"text":"Proteasoma","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '7158ab88-7b3d-57f0-b738-5bb6f605325e',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"Proteasoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":76,"pinY":67},{"text":"Peptido","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":85,"pinY":35},{"text":"Codon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":69,"pinY":35},{"text":"ARNt","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":51,"pinY":35},{"text":"ARNm","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":33,"pinY":35},{"text":"Ribosoma","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":15,"pinY":35}]'::jsonb,
  false, 25, 1, 75
),
(
  'e4e61bee-b123-5f5c-bbef-1115f0e0b925',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"Ribosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":15,"pinY":35},{"text":"ARNm","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":33,"pinY":35},{"text":"ARNt","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":51,"pinY":35},{"text":"Codon","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":69,"pinY":35},{"text":"Peptido","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":85,"pinY":35}]'::jsonb,
  false, 26, 1, 75
),
(
  '80c970a4-9e80-5921-bfa1-1e61344bd955',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"ARNm","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":33,"pinY":35},{"text":"ARNt","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":51,"pinY":35},{"text":"Codon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":69,"pinY":35},{"text":"Peptido","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":85,"pinY":35},{"text":"Proteasoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  '217551d5-0888-5036-b28c-e16b53284b9d',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"Ribosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":15,"pinY":35},{"text":"ARNm","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":33,"pinY":35},{"text":"ARNt","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":51,"pinY":35},{"text":"Peptido","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":85,"pinY":35},{"text":"Proteasoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '26d096fc-e619-5e5b-b53b-71f3479b5301',
  '528acaf2-0131-5d2b-b5d9-5cac5ae8718a',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"Ribosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":15,"pinY":35},{"text":"ARNt","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":51,"pinY":35},{"text":"Peptido","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":85,"pinY":35},{"text":"ARNm","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":33,"pinY":35},{"text":"Codon","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap09_sintesis_proteinas.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'fddad17e-fd7d-5735-b13a-61aa311a70b9', 'Capitulo 10 Biologia Celular - endomembranas', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar RER, REL, Golgi, lisosomas y trafico vesicular desde Calvo.', 'BC10P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 10: RE, aparato de Golgi y lisosomas', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'fddad17e-fd7d-5735-b13a-61aa311a70b9';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '1f7efd72-a535-5f5c-b0ef-86941ae402c6',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'RER sintetiza proteinas secretadas y de membrana. Identifica el concepto:',
  '[{"text":"RER","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '6baa85ab-0c35-53c4-bf2f-b26f5ef258f4',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'REL sintetiza lipidos y detoxifica. Identifica el concepto:',
  '[{"text":"RER","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '9fb26c13-f81c-553f-b6b1-5158a880045c',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'Golgi modifica y clasifica proteinas. Identifica el concepto:',
  '[{"text":"REL","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '7ab90191-42f2-541d-b213-0dfdf092bf81',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'Lisosomas degradan macromoleculas. Identifica el concepto:',
  '[{"text":"Golgi","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'd009697c-6260-5e90-b0a6-b739587f2f4c',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'Peptido senal dirige al RER. Identifica el concepto:',
  '[{"text":"Peptido senal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '9bd27df3-bdc3-5b0d-b01e-5fca6f9824d4',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'COPII transporta RE a Golgi. Identifica el concepto:',
  '[{"text":"RER","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"COPII","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  'b4869645-6c10-5efb-b97f-5378d41cf929',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'COPI participa en retorno Golgi-RE. Identifica el concepto:',
  '[{"text":"REL","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"COPI","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '73780a0c-de40-5a8b-b8e9-178a3b9c0b41',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'Clatrina participa en trafico selectivo. Identifica el concepto:',
  '[{"text":"Golgi","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Clatrina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '4a4eba1f-9dbb-59f1-ba51-e0ebe278c85c',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, RER se relaciona mejor con:',
  '[{"text":"membrana","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '04805018-5648-5c4e-b8e6-dcf442ccc12d',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, REL se relaciona mejor con:',
  '[{"text":"RER","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"detoxifica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '5183cc10-2ddd-5600-bf4c-f36dcac7e503',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, Golgi se relaciona mejor con:',
  '[{"text":"REL","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"proteinas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '46d6e2fa-e701-5f21-b541-720f140eb3c3',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, Lisosomas se relaciona mejor con:',
  '[{"text":"Golgi","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"macromoleculas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'e0ccfc82-76fc-5f23-b867-c9c214743661',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, Peptido senal se relaciona mejor con:',
  '[{"text":"RER","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'd0c74115-428b-51ae-b1e9-d0f0486db865',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, COPII se relaciona mejor con:',
  '[{"text":"RER","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'a8176d2f-4018-52a7-bd2d-d3170faab59e',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, COPI se relaciona mejor con:',
  '[{"text":"REL","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi-RE","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '8a464ba8-8fec-5383-bfd6-a2c957bf4243',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, Clatrina se relaciona mejor con:',
  '[{"text":"Golgi","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"selectivo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"RER","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'be45375f-f709-5d78-b5ef-5c86e19fd1df',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, RER se relaciona mejor con:',
  '[{"text":"membrana","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'ff5cd633-7314-5c35-ba81-f49c4d6f23ee',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'mc',
  'En el capitulo 10, REL se relaciona mejor con:',
  '[{"text":"RER","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"detoxifica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '3e993645-9b85-5ba1-b751-61e6f808bd30',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'ms',
  'Selecciona conceptos centrales del capitulo.',
  '[{"text":"RER","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '08bf3d45-3b94-57b6-bf4d-0f009cd2e5f4',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'ms',
  'Selecciona estructuras o procesos relacionados.',
  '[{"text":"Peptido senal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"COPII","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"COPI","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Clatrina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Onda P","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'af72736d-6cd2-5242-b2ee-46c4317f4e1a',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'ms',
  'Selecciona pares correctos de este tema.',
  '[{"text":"RER: sintetiza proteinas secretadas y","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"REL: sintetiza lipidos y detoxifica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Nucleolo: bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'f7a05712-5029-5092-bca9-559201481992',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'ms',
  'Selecciona componentes funcionales.',
  '[{"text":"RER","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Golgi","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Peptido senal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Virus como organulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '7fa1c960-07b0-5c35-bc61-c059019b4736',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'ms',
  'Selecciona elementos que requieren regulacion celular.',
  '[{"text":"REL","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Lisosomas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"COPII","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Cristalino ocular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '9acc13bf-66b9-5384-b95e-38a7b280d16e',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'ms',
  'Selecciona aplicaciones biomédicas posibles.',
  '[{"text":"COPI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Clatrina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"},{"text":"Presion arterial sistolica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '5cf04413-2dbd-5d63-b774-6ecb355cd562',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"RER","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":15,"pinY":35},{"text":"REL","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":33,"pinY":35},{"text":"Golgi cis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":51,"pinY":35},{"text":"Golgi trans","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":69,"pinY":35},{"text":"Lisosoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":85,"pinY":35},{"text":"COPII","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":40,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '2896a1be-fbba-5f8e-b187-8c476a94593b',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"COPII","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":40,"pinY":67},{"text":"Lisosoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":85,"pinY":35},{"text":"Golgi trans","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":69,"pinY":35},{"text":"Golgi cis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":51,"pinY":35},{"text":"REL","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":33,"pinY":35},{"text":"RER","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":15,"pinY":35}]'::jsonb,
  false, 25, 1, 75
),
(
  'ab876060-a223-5326-bdac-6758dabd15ea',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"RER","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":15,"pinY":35},{"text":"REL","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":33,"pinY":35},{"text":"Golgi cis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":51,"pinY":35},{"text":"Golgi trans","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":69,"pinY":35},{"text":"Lisosoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":85,"pinY":35}]'::jsonb,
  false, 26, 1, 75
),
(
  'b94891a9-c352-55c3-b2b2-b1836a90d8e0',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"REL","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":33,"pinY":35},{"text":"Golgi cis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":51,"pinY":35},{"text":"Golgi trans","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":69,"pinY":35},{"text":"Lisosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":85,"pinY":35},{"text":"COPII","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":40,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  'edff2957-319e-5ffe-b865-d844baceb5d6',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"RER","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":15,"pinY":35},{"text":"REL","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":33,"pinY":35},{"text":"Golgi cis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":51,"pinY":35},{"text":"Lisosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":85,"pinY":35},{"text":"COPII","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":40,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'cc0ce875-8166-55f6-b3a7-c193e6ec033c',
  'fddad17e-fd7d-5735-b13a-61aa311a70b9',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"RER","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":15,"pinY":35},{"text":"Golgi cis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":51,"pinY":35},{"text":"Lisosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":85,"pinY":35},{"text":"REL","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":33,"pinY":35},{"text":"Golgi trans","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap10_endomembranas.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a', 'Capitulo 11 Biologia Celular - mitocondrias y peroxisomas', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar bioenergetica mitocondrial, ROS, patologias mitocondriales y peroxisomas desde Calvo.', 'BC11P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 11: mitocondrias y peroxisomas', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'bc4f1601-ac7b-59f5-bd6a-70301177f12a';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '911b95e3-1b00-59d7-bcf7-5113ea84f92e',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'Mitocondria produce ATP aerobico. Identifica el concepto:',
  '[{"text":"Mitocondria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '552f5b75-fa0b-57fd-bd86-dab16a9cd465',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'Crestas amplian membrana interna. Identifica el concepto:',
  '[{"text":"Mitocondria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'e68e5942-80bb-5594-b788-71d7a1ee85ad',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'Matriz contiene enzimas y ADN. Identifica el concepto:',
  '[{"text":"Crestas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  'fac2ec5c-684e-502b-bfc3-8c2e85b4cadb',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'ADN mitocondrial se hereda sobre todo por via materna. Identifica el concepto:',
  '[{"text":"Matriz","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'f37f7121-f70f-5431-ba99-7e0c69b4b47c',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'Cadena respiratoria mueve electrones. Identifica el concepto:',
  '[{"text":"Cadena respiratoria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '0757e139-4caf-5b3d-b39e-816c06967b86',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'ATP sintasa usa gradiente de protones. Identifica el concepto:',
  '[{"text":"Mitocondria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ATP sintasa","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  'b6b7e408-5b12-521e-b29f-5f810580c4c1',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'ROS son especies reactivas de oxigeno. Identifica el concepto:',
  '[{"text":"Crestas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ROS","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '42ff61d2-d7a0-5b36-bf6f-c3e54c5a5ed9',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'Peroxisoma detoxifica y oxida sustratos. Identifica el concepto:',
  '[{"text":"Matriz","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Peroxisoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '31829d68-dea5-54ab-b726-13acea52b6b4',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, Mitocondria se relaciona mejor con:',
  '[{"text":"aerobico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'ec949473-d140-5458-b13f-15435b245eea',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, Crestas se relaciona mejor con:',
  '[{"text":"Mitocondria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"interna","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '7886d0ab-d5bc-523e-b761-ac654c26e138',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, Matriz se relaciona mejor con:',
  '[{"text":"Crestas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '1a6656b9-c352-5f1f-b9f6-32727fea2608',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, ADN mitocondrial se relaciona mejor con:',
  '[{"text":"Matriz","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"materna","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '602c4ebd-7547-5ff8-b326-2386c0e8f85c',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, Cadena respiratoria se relaciona mejor con:',
  '[{"text":"electrones","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '58ae1028-fdd0-553c-be76-1395e5ffd9e8',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, ATP sintasa se relaciona mejor con:',
  '[{"text":"Mitocondria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"protones","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '63d2a309-c7a1-5458-ba15-3585dde250d4',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, ROS se relaciona mejor con:',
  '[{"text":"Crestas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"oxigeno","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '7521fc6f-83ca-50fe-bc7a-7e97b63164e8',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, Peroxisoma se relaciona mejor con:',
  '[{"text":"Matriz","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"sustratos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Mitocondria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '9c9f0e84-55ca-52aa-bccd-0185491d9720',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, Mitocondria se relaciona mejor con:',
  '[{"text":"aerobico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'c6f32b12-69e1-5d94-b93f-a0e57cc6706a',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'mc',
  'En el capitulo 11, Crestas se relaciona mejor con:',
  '[{"text":"Mitocondria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"interna","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'd8506381-7aec-52e2-b08f-9b64945ad596',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'ms',
  'Selecciona conceptos centrales del capitulo.',
  '[{"text":"Mitocondria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '581e99c5-e42a-56af-bb11-1510c1443959',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'ms',
  'Selecciona estructuras o procesos relacionados.',
  '[{"text":"Cadena respiratoria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ATP sintasa","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ROS","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Peroxisoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Onda P","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '3b95a2ae-d2a7-5fd1-bbbc-ebcdff54a8c7',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'ms',
  'Selecciona pares correctos de este tema.',
  '[{"text":"Mitocondria: produce ATP aerobico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Crestas: amplian membrana interna","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Nucleolo: bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '9cf8350a-323f-5128-bb42-ab3b3dca85be',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'ms',
  'Selecciona componentes funcionales.',
  '[{"text":"Mitocondria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Matriz","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Cadena respiratoria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Virus como organulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '53d7964c-aca0-52b5-bf42-48f75a9ccd98',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'ms',
  'Selecciona elementos que requieren regulacion celular.',
  '[{"text":"Crestas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ADN mitocondrial","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"ATP sintasa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Cristalino ocular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'a25164bf-1f69-59df-b8cd-aa18ec800d9e',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'ms',
  'Selecciona aplicaciones biomédicas posibles.',
  '[{"text":"ROS","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Peroxisoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"},{"text":"Presion arterial sistolica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '0b343394-e1aa-5824-bc17-e2f45908ee24',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"Membrana externa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":15,"pinY":35},{"text":"Membrana interna","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":33,"pinY":35},{"text":"Crestas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":51,"pinY":35},{"text":"Matriz","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":69,"pinY":35},{"text":"ADN mitocondrial","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":85,"pinY":35},{"text":"Peroxisoma","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '89dcc7b9-dff0-5efe-bebd-4c16e41d2681',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"Peroxisoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":76,"pinY":67},{"text":"ADN mitocondrial","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":85,"pinY":35},{"text":"Matriz","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":69,"pinY":35},{"text":"Crestas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":51,"pinY":35},{"text":"Membrana interna","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":33,"pinY":35},{"text":"Membrana externa","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":15,"pinY":35}]'::jsonb,
  false, 25, 1, 75
),
(
  '649e6fb5-e8db-5102-b6a8-528536b88576',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"Membrana externa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":15,"pinY":35},{"text":"Membrana interna","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":33,"pinY":35},{"text":"Crestas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":51,"pinY":35},{"text":"Matriz","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":69,"pinY":35},{"text":"ADN mitocondrial","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":85,"pinY":35}]'::jsonb,
  false, 26, 1, 75
),
(
  'a84c0df9-67c4-55f7-bfc9-627dd482ebd8',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"Membrana interna","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":33,"pinY":35},{"text":"Crestas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":51,"pinY":35},{"text":"Matriz","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":69,"pinY":35},{"text":"ADN mitocondrial","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":85,"pinY":35},{"text":"Peroxisoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  'f03a811a-28cd-5be0-bd71-1a43951207ea',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"Membrana externa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":15,"pinY":35},{"text":"Membrana interna","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":33,"pinY":35},{"text":"Crestas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":51,"pinY":35},{"text":"ADN mitocondrial","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":85,"pinY":35},{"text":"Peroxisoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":76,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'a0069ba6-d827-5423-b8bd-38a8054257d6',
  'bc4f1601-ac7b-59f5-bd6a-70301177f12a',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"Membrana externa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":15,"pinY":35},{"text":"Crestas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":51,"pinY":35},{"text":"ADN mitocondrial","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":85,"pinY":35},{"text":"Membrana interna","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":33,"pinY":35},{"text":"Matriz","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap11_mitocondria_peroxisoma.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8', 'Capitulo 12 Biologia Celular - citoesqueleto', 'BIOLOGIA CELULAR', 'Residencia', 'espanol', 'publica',
  'Repasar actina, microtubulos, filamentos intermedios, motores y migracion celular desde Calvo.', 'BC12P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 12: el citoesqueleto', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '9a1dd724-ce76-5ea4-ba7c-12253ed0835d',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'Actina forma microfilamentos. Identifica el concepto:',
  '[{"text":"Actina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'bc929e41-9629-5170-b9a7-575a81774000',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'Miosina es motor de actina. Identifica el concepto:',
  '[{"text":"Actina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '2c98dad0-7d6a-58bc-b211-b503c354a7df',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'Microtubulos sirven como rutas y huso. Identifica el concepto:',
  '[{"text":"Miosina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '3e62b144-7c47-52b4-b336-040b9d432e21',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'Tubulina forma microtubulos. Identifica el concepto:',
  '[{"text":"Microtubulos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'dac484fd-8f33-51cc-b540-2a716c166a03',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'Centrosoma organiza microtubulos. Identifica el concepto:',
  '[{"text":"Centrosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'cd2d5341-ba35-598e-bebe-70b30bbe5758',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'Quinesina camina hacia extremo positivo. Identifica el concepto:',
  '[{"text":"Actina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Quinesina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '6e47228a-a70e-50e7-bdb4-3119cdd81796',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'Dineina camina hacia extremo negativo. Identifica el concepto:',
  '[{"text":"Miosina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Dineina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'aed29f9a-714c-5239-b7f2-65c1adbb9c3f',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'Lamelipodios impulsan migracion. Identifica el concepto:',
  '[{"text":"Microtubulos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Lamelipodios","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '08a117f8-6914-5cf2-ba80-3e0e30f9d719',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Actina se relaciona mejor con:',
  '[{"text":"microfilamentos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'f0241492-e2a5-5648-b650-c99d86e931db',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Miosina se relaciona mejor con:',
  '[{"text":"Actina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"actina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '4bdbe0a5-c861-51eb-b7a3-90cc1cfe2605',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Microtubulos se relaciona mejor con:',
  '[{"text":"Miosina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"huso","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'd7208a71-1b91-5b0c-b0c8-7605311ac7da',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Tubulina se relaciona mejor con:',
  '[{"text":"Microtubulos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"microtubulos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'b0a4098b-84ec-5026-b200-5d3e0557d340',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Centrosoma se relaciona mejor con:',
  '[{"text":"microtubulos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'e7d41876-6ed0-5609-bb16-d6c49c0025af',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Quinesina se relaciona mejor con:',
  '[{"text":"Actina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"positivo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '811d2d52-291b-55a4-b40d-75ef7fe1312a',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Dineina se relaciona mejor con:',
  '[{"text":"Miosina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"negativo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'bb39d893-44d7-5e59-b5f9-7282628eb2ab',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Lamelipodios se relaciona mejor con:',
  '[{"text":"Microtubulos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"migracion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Actina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '525a4ede-6e24-5b4c-b2c0-23f0a3fd760a',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Actina se relaciona mejor con:',
  '[{"text":"microfilamentos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'de528a22-5431-58e2-baf2-9345c5b03e5b',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'mc',
  'En el capitulo 12, Miosina se relaciona mejor con:',
  '[{"text":"Actina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"actina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '66d7229a-a722-5b85-bb22-25bdeaf5d2e3',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'ms',
  'Selecciona conceptos centrales del capitulo.',
  '[{"text":"Actina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '0af055c9-1638-5dba-b044-30905036718a',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'ms',
  'Selecciona estructuras o procesos relacionados.',
  '[{"text":"Centrosoma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Quinesina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Dineina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Lamelipodios","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Onda P","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '2de06850-aed9-52cd-be69-b28e2b6ebe54',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'ms',
  'Selecciona pares correctos de este tema.',
  '[{"text":"Actina: forma microfilamentos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Miosina: es motor de actina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Nucleolo: bomba Na-K","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '4b7e02fa-61ff-5813-bd83-c9a854974d9a',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'ms',
  'Selecciona componentes funcionales.',
  '[{"text":"Actina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Microtubulos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Centrosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Virus como organulo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '671c19c0-c519-55dc-bd15-25fb121cc6d7',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'ms',
  'Selecciona elementos que requieren regulacion celular.',
  '[{"text":"Miosina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Tubulina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Quinesina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Cristalino ocular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '56345773-2e14-52c6-be9d-f404107d820b',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'ms',
  'Selecciona aplicaciones biomédicas posibles.',
  '[{"text":"Dineina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Lamelipodios","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"},{"text":"Presion arterial sistolica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  'ad42830d-6436-5e14-bfed-0b214a9eb2eb',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'dnd',
  'Relaciona estructuras clave.',
  '[{"text":"Actina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":15,"pinY":35},{"text":"Miosina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":33,"pinY":35},{"text":"Microtubulo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":51,"pinY":35},{"text":"Tubulina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":69,"pinY":35},{"text":"Centrosoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":85,"pinY":35},{"text":"Dineina","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":58,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '349d81c4-9026-529e-bd19-89622a8d4b7e',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'dnd',
  'Relaciona el proceso principal.',
  '[{"text":"Dineina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":58,"pinY":67},{"text":"Centrosoma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":85,"pinY":35},{"text":"Tubulina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":69,"pinY":35},{"text":"Microtubulo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":51,"pinY":35},{"text":"Miosina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":33,"pinY":35},{"text":"Actina","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":15,"pinY":35}]'::jsonb,
  false, 25, 1, 75
),
(
  'fb73142f-287f-50c9-b41b-a7464c502f2c',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'dnd',
  'Relaciona componentes funcionales.',
  '[{"text":"Actina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":15,"pinY":35},{"text":"Miosina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":33,"pinY":35},{"text":"Microtubulo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":51,"pinY":35},{"text":"Tubulina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":69,"pinY":35},{"text":"Centrosoma","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":85,"pinY":35}]'::jsonb,
  false, 26, 1, 75
),
(
  '2bdba736-2bff-5005-b16f-4036c19d1ec8',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'dnd',
  'Relaciona etiquetas del esquema.',
  '[{"text":"Miosina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":33,"pinY":35},{"text":"Microtubulo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":51,"pinY":35},{"text":"Tubulina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":69,"pinY":35},{"text":"Centrosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":85,"pinY":35},{"text":"Dineina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":58,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  '1947d0c2-4abf-558d-b939-bc72ea950923',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'dnd',
  'Relaciona elementos aplicados.',
  '[{"text":"Actina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":15,"pinY":35},{"text":"Miosina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":33,"pinY":35},{"text":"Microtubulo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":51,"pinY":35},{"text":"Centrosoma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":85,"pinY":35},{"text":"Dineina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":58,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '8ac4b7c5-8776-5d50-b8f0-934fdb3cc5d9',
  '0b76e410-dbdb-5777-b5cd-0cf8cbbba9f8',
  'dnd',
  'Relaciona conceptos del capitulo.',
  '[{"text":"Actina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":15,"pinY":35},{"text":"Microtubulo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":51,"pinY":35},{"text":"Centrosoma","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":85,"pinY":35},{"text":"Miosina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":33,"pinY":35},{"text":"Tubulina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/biologia-celular-parciales/cap12_citoesqueleto.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 29, 1, 75
);
commit;
