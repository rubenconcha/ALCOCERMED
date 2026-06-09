-- Importa primer y segundo parcial de Educacion en Salud e Investigacion.
-- Temas 1 al 12 segun cronograma: 30 preguntas por tema; la app muestra 10 por intento con maxQuestions.
-- Imagenes locales nuevas: juegos/assets/salud-publica-parciales/.
begin;

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9', 'Tema 1 Salud Publica - generalidades y bases normativas', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 1: generalidades, bases normativas y politicas internacionales desde el material oficial de Educacion en Salud e Investigacion.', 'SP01P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 1: Generalidades, bases normativas y politicas internacionales', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'db08a86a-11bd-52e4-ce09-f2b744dad5d9';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '3bea9399-4e1c-569e-c9fb-4e174e02278e',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Acciones colectivas para proteger y mejorar salud poblacional',
  '[{"text":"Salud publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'c6c88e9a-65b9-5d04-cf43-1c4408bc0bbb',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Proceso que permite mayor control sobre la salud',
  '[{"text":"Prevencion primaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '652123b7-fe82-51d7-c4cd-aa74239aaf46',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Evita aparicion de enfermedad',
  '[{"text":"Prevencion terciaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion cuaternaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  'e4cf3ad1-0185-58d7-c747-2eeac712d9cc',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Detecta tempranamente y limita dano',
  '[{"text":"Prevencion primaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'c8433e16-1a32-5507-cc1a-e89e0a35b8b7',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Reduce secuelas de enfermedad establecida',
  '[{"text":"Prevencion terciaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '87a65c31-d7dd-511c-cc58-71df7489c310',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Evita intervenciones innecesarias o iatrogenicas',
  '[{"text":"Prevencion primaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '3fa6e740-9fae-5479-cd70-666d7ab038b6',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Estrategia integral cercana a la comunidad',
  '[{"text":"Promocion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"APS","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '8244840d-0b51-5771-cd63-f4974d3735ba',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Condiciones sociales que influyen en salud',
  '[{"text":"Prevencion secundaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Determinantes sociales","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '0294bd09-6b17-5ca2-c42f-a56cfc1aaaf4',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'Documento clave de promocion de la salud',
  '[{"text":"Carta de Ottawa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '1dabb1e5-303c-547c-c108-88dafcce0e1d',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: acciones colectivas para proteger y mejorar salud poblacional',
  '[{"text":"Promocion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Salud publica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '7b477dc7-6dc3-5f29-ca2d-4267dd93c969',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: proceso que permite mayor control sobre la salud',
  '[{"text":"Prevencion secundaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '9b77c510-5f69-551f-c6d1-4e153bbc9b2e',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: evita aparicion de enfermedad',
  '[{"text":"Prevencion cuaternaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '9ef28b26-2d2f-5dc6-cb49-6d7e3a397202',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: detecta tempranamente y limita dano',
  '[{"text":"Prevencion secundaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '9e55f88c-68a7-51af-ca63-a8bb01626035',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: reduce secuelas de enfermedad establecida',
  '[{"text":"Promocion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '90194595-dd5c-5ea5-c7a0-52c15d4b0ad9',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: evita intervenciones innecesarias o iatrogenicas',
  '[{"text":"Prevencion secundaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'a33b3170-faec-5864-c3d9-fdd89d34406d',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: estrategia integral cercana a la comunidad',
  '[{"text":"Prevencion primaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"APS","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '66d24cfd-8254-5d19-cb98-ccb31b5145ab',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: condiciones sociales que influyen en salud',
  '[{"text":"Determinantes sociales","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '1018ced3-48c9-577d-c468-0a4a1037c0e0',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'mc',
  'En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: documento clave de promocion de la salud',
  '[{"text":"Prevencion primaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Carta de Ottawa","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '30936162-a192-5cbe-c514-ed6779d69eab',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Salud publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion primaria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion secundaria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'b1c8bc42-1354-547a-c4a0-1c0ffe96eb35',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Prevencion terciaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"APS","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Determinantes sociales","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '84138439-7471-5249-c3f9-137d2afc3900',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Salud publica: Acciones colectivas para proteger y","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Promocion: Proceso que permite mayor control","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '62fa6389-1f81-53c7-c083-5417afd2ddd9',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Prevencion primaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Carta de Ottawa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '5e8e2eda-b2fa-53c8-c677-934499fffec4',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Prevencion secundaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"APS","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Determinantes sociales","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '57086d91-ab89-5d6d-c5e3-a2c2e3894ae5',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Salud publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Prevencion terciaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Carta de Ottawa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '813370fb-850e-5be3-c117-3cc97e3cd903',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Salud publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":13,"pinY":35},{"text":"Promocion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":32,"pinY":35},{"text":"Prevencion primaria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":50,"pinY":35},{"text":"Prevencion secundaria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":69,"pinY":35},{"text":"Prevencion terciaria","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":86,"pinY":35},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '54a5a1b9-61cf-58b9-cb37-b02c3dbda08b',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Prevencion secundaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":69,"pinY":35},{"text":"Prevencion terciaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":86,"pinY":35},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":22,"pinY":67},{"text":"APS","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":41,"pinY":67},{"text":"Determinantes sociales","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":59,"pinY":67},{"text":"Carta de Ottawa","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '4a0bcbdc-f613-5da2-c6f4-715d663952c6',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Salud publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":13,"pinY":35},{"text":"Prevencion primaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":50,"pinY":35},{"text":"Prevencion terciaria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":86,"pinY":35},{"text":"APS","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":41,"pinY":67},{"text":"Carta de Ottawa","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '165263ac-3a14-5d31-c25e-396d83c49314',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Carta de Ottawa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":78,"pinY":67},{"text":"Determinantes sociales","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":59,"pinY":67},{"text":"APS","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":41,"pinY":67},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":22,"pinY":67},{"text":"Prevencion terciaria","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":86,"pinY":35},{"text":"Prevencion secundaria","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  'da1067ce-2ce5-5c7c-c8f1-ebe62476fc68',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Promocion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":32,"pinY":35},{"text":"Prevencion primaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":50,"pinY":35},{"text":"Prevencion secundaria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":69,"pinY":35},{"text":"Prevencion terciaria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":86,"pinY":35},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":22,"pinY":67},{"text":"APS","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '7689164e-da2e-5dda-cae1-d142f8956022',
  'db08a86a-11bd-52e4-ce09-f2b744dad5d9',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Prevencion primaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":50,"pinY":35},{"text":"Prevencion secundaria","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":69,"pinY":35},{"text":"Prevencion terciaria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":86,"pinY":35},{"text":"Prevencion cuaternaria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":22,"pinY":67},{"text":"APS","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":41,"pinY":67},{"text":"Determinantes sociales","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp01_sp01p1.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc', 'Tema 2 Salud Publica - politicas publicas en salud', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 2: politicas publicas en salud desde el material oficial de Educacion en Salud e Investigacion.', 'SP02P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 2: Politicas publicas en salud', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'ac9dee4a-2dfb-5991-c709-4a941c5d51fc';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '8aa0ac9f-c7b8-5d8b-cb6a-de4ff8602392',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Curso de accion estatal para resolver asuntos publicos',
  '[{"text":"Politica publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '285acfb0-4a3c-5938-c425-dcd1a458d9de',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Campo de accion poblacional en salud',
  '[{"text":"Derecho a la salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'b79bca05-738f-526d-c5db-1c5dd80f9178',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Base normativa para garantizar atencion',
  '[{"text":"Universalidad","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Solidaridad","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '8f95fb97-6099-59ff-cf21-db8fbc80497e',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Reducir desigualdades injustas',
  '[{"text":"Derecho a la salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'b348e8a5-d437-5cf7-c1b9-c652a3e5dfdd',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Cobertura para toda la poblacion',
  '[{"text":"Universalidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '2aa1affd-463e-5140-c867-0175f60de715',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Apoyo colectivo segun necesidad',
  '[{"text":"Derecho a la salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Solidaridad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  'b55dfe2f-c4f9-597e-c0f6-acab500fa1e9',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Coordinacion con otros sectores',
  '[{"text":"Salud publica","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Intersectorialidad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Politica publica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '87be7e6d-e0ad-5ad6-c002-7b7fc385798c',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Toma de decisiones con actores sociales',
  '[{"text":"Equidad","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Gobernanza","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  'd44a5842-cda3-5b6c-ca55-26660cf4c688',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'Medicion de resultados e impacto',
  '[{"text":"Evaluacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'df40c792-2624-554d-c9c5-22cdbcddf50b',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: curso de accion estatal para resolver asuntos publicos',
  '[{"text":"Salud publica","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Politica publica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'bc2a7848-7cfa-5658-c1ad-2c735a2a272c',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: campo de accion poblacional en salud',
  '[{"text":"Equidad","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '3e96be01-393b-57b0-c974-a8e4920832cd',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: base normativa para garantizar atencion',
  '[{"text":"Solidaridad","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '78132a58-f55b-5a08-c838-086c70b225ee',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: reducir desigualdades injustas',
  '[{"text":"Equidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Politica publica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '74c040f6-aae7-5e55-c262-10494135f42f',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: cobertura para toda la poblacion',
  '[{"text":"Salud publica","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'ce8cdf5f-4be9-5ae9-c9d4-64b61739c5ef',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: apoyo colectivo segun necesidad',
  '[{"text":"Equidad","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Solidaridad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '6abe8de4-3897-5e1a-c2fc-8664e511bcff',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: coordinacion con otros sectores',
  '[{"text":"Derecho a la salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Intersectorialidad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'c146490a-bcee-5ef1-c488-c3211175b331',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: toma de decisiones con actores sociales',
  '[{"text":"Gobernanza","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '6b021bc5-2fa9-5cf2-c58f-fd25c4f7866d',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'mc',
  'En Tema 2: Politicas publicas en salud, identifica el concepto relacionado con: medicion de resultados e impacto',
  '[{"text":"Derecho a la salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Evaluacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'ef663c01-22e2-5df1-ccc2-60293727817b',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Politica publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Derecho a la salud","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Equidad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '04611a5e-9a60-526b-cdbc-559918accdd6',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Universalidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Solidaridad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Intersectorialidad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Gobernanza","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '0c57134b-a977-5b48-c8da-92048c484456',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Politica publica: Curso de accion estatal para","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Salud publica: Campo de accion poblacional en","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '2f10eec0-e186-511e-c0d2-eef7b3e57925',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Derecho a la salud","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Solidaridad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Evaluacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '00f15287-b754-56d5-cf1b-391abb16a0e6',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Equidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Intersectorialidad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Gobernanza","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '17bb999a-ccc1-5176-cb0a-99a238decb5c',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Politica publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Universalidad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Evaluacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '51eeb0d3-91fb-5dda-c4ca-92ea52e8b519',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Politica publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":13,"pinY":35},{"text":"Salud publica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":32,"pinY":35},{"text":"Derecho a la salud","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":50,"pinY":35},{"text":"Equidad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":69,"pinY":35},{"text":"Universalidad","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":86,"pinY":35},{"text":"Solidaridad","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '4a9eed14-bff7-5f70-cb31-544e87764772',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Equidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":69,"pinY":35},{"text":"Universalidad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":86,"pinY":35},{"text":"Solidaridad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":22,"pinY":67},{"text":"Intersectorialidad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":41,"pinY":67},{"text":"Gobernanza","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":59,"pinY":67},{"text":"Evaluacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '85e24ae6-1dfc-5912-c749-cbf0ca8d6a16',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Politica publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":13,"pinY":35},{"text":"Derecho a la salud","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":50,"pinY":35},{"text":"Universalidad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":86,"pinY":35},{"text":"Intersectorialidad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":41,"pinY":67},{"text":"Evaluacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  'b9fbde3d-3dd5-573f-c1d6-a403f19855af',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Evaluacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":78,"pinY":67},{"text":"Gobernanza","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":59,"pinY":67},{"text":"Intersectorialidad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":41,"pinY":67},{"text":"Solidaridad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":22,"pinY":67},{"text":"Universalidad","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":86,"pinY":35},{"text":"Equidad","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  '721c2f52-c168-5e77-cfea-a2843d8ccba9',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Salud publica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":32,"pinY":35},{"text":"Derecho a la salud","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":50,"pinY":35},{"text":"Equidad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":69,"pinY":35},{"text":"Universalidad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":86,"pinY":35},{"text":"Solidaridad","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":22,"pinY":67},{"text":"Intersectorialidad","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '21edae3d-7572-5902-c92a-02375b34266c',
  'ac9dee4a-2dfb-5991-c709-4a941c5d51fc',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Derecho a la salud","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":50,"pinY":35},{"text":"Equidad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":69,"pinY":35},{"text":"Universalidad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":86,"pinY":35},{"text":"Solidaridad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":22,"pinY":67},{"text":"Intersectorialidad","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":41,"pinY":67},{"text":"Gobernanza","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp02_sp02p1.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '64e70024-2e36-5cb1-c6a3-abd3493c9126', 'Tema 3 Salud Publica - programas de salud en Bolivia', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 3: programas de salud en bolivia desde el material oficial de Educacion en Salud e Investigacion.', 'SP03P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 3: Programas de salud en Bolivia', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '64e70024-2e36-5cb1-c6a3-abd3493c9126';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '8c29a92b-00fc-5afe-c037-ef0cdcf169ce',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Politica de Salud Familiar Comunitaria Intercultural',
  '[{"text":"SAFCI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '7843e8e8-5edd-5de7-cb37-e21949c3c173',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Sistema Unico de Salud gratuito y universal',
  '[{"text":"Mi Salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'dfcde528-85ec-5dbd-cbd7-c39c0c130b1b',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Programa con equipos comunitarios y visitas domiciliarias',
  '[{"text":"VIH/ITS","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Tuberculosis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '4ca72194-4111-5572-cda2-8dbe319df45a',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Programa de vacunacion universal',
  '[{"text":"Mi Salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SAFCI","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '029c3871-c073-5c2c-cee3-51df4224c2d6',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Programa de prevencion diagnostico y tratamiento',
  '[{"text":"VIH/ITS","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'f711000b-9ace-5485-ce52-62d272bf70c6',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Programa de control de enfermedad transmisible',
  '[{"text":"Mi Salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Tuberculosis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '5728dc18-186e-5cf0-c33c-a9292fbb3676',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Problema prioritario vectorial en Bolivia',
  '[{"text":"SUS","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Chagas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SAFCI","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '9635eff7-e1de-519a-c54c-1ce0616e7cd2',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Atencion prioritaria a binomio madre-nino',
  '[{"text":"PAI","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Salud materna infantil","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '882597bc-db12-5b06-c60f-2f7e8f6e886c',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'Medidas para evaluar metas e impacto',
  '[{"text":"Indicadores","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '68f29597-0482-5185-c93f-98ab2cee9d4f',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: politica de salud familiar comunitaria intercultural',
  '[{"text":"SUS","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SAFCI","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'c5b0aeee-e5e6-5d00-cebb-f93b09108c53',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: sistema unico de salud gratuito y universal',
  '[{"text":"PAI","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'c967dcbb-ebeb-5b72-c595-66c7b023db61',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: programa con equipos comunitarios y visitas domiciliarias',
  '[{"text":"Tuberculosis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '85b5e644-cf30-5058-cead-64175226c02d',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: programa de vacunacion universal',
  '[{"text":"PAI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SAFCI","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '1a9c869e-44c0-5586-c7ce-e848a947c560',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: programa de prevencion diagnostico y tratamiento',
  '[{"text":"SUS","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '6d563839-e703-564a-ccff-99b32bb41a68',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: programa de control de enfermedad transmisible',
  '[{"text":"PAI","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Tuberculosis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'cb7ecdcc-740c-535a-cc5e-a02eb89e3d44',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: problema prioritario vectorial en bolivia',
  '[{"text":"Mi Salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Chagas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SAFCI","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '7677ebf2-b6f1-5494-c1c9-743cac090b7e',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: atencion prioritaria a binomio madre-nino',
  '[{"text":"Salud materna infantil","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '2e34536a-e71d-5711-c6a0-0ce3ff9e89ef',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'mc',
  'En Tema 3: Programas de salud en Bolivia, identifica el concepto relacionado con: medidas para evaluar metas e impacto',
  '[{"text":"Mi Salud","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Indicadores","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '19722b24-4c20-5fb8-cba4-bdde3e6ae5b2',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"SAFCI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mi Salud","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"PAI","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'b7846151-8f41-52c3-c349-c49ac6779ec3',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"VIH/ITS","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Tuberculosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Chagas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Salud materna infantil","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '38e2cffc-38e2-555c-cf75-96e1d8b48d42',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"SAFCI: Politica de Salud Familiar Comunitaria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"SUS: Sistema Unico de Salud gratuito","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'a0c72b4c-e78b-5513-c7f2-16337d6fef0a',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Mi Salud","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Tuberculosis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Indicadores","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'e7e0cf28-4182-5f73-c22c-3928784e2cbe',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"PAI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Chagas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Salud materna infantil","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '9016972e-719f-5937-c1db-674e9646fc96',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"SAFCI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"VIH/ITS","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Indicadores","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '757380f6-fbfe-5c46-cd32-ce9f076f6ba2',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"SAFCI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":13,"pinY":35},{"text":"SUS","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":32,"pinY":35},{"text":"Mi Salud","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":50,"pinY":35},{"text":"PAI","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":69,"pinY":35},{"text":"VIH/ITS","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":86,"pinY":35},{"text":"Tuberculosis","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '499dcea0-0871-5097-ceea-ff03208f21da',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"PAI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":69,"pinY":35},{"text":"VIH/ITS","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":86,"pinY":35},{"text":"Tuberculosis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":22,"pinY":67},{"text":"Chagas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":41,"pinY":67},{"text":"Salud materna infantil","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":59,"pinY":67},{"text":"Indicadores","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '9ba593e2-5996-5ca8-cde7-9695f7086a89',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"SAFCI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":13,"pinY":35},{"text":"Mi Salud","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":50,"pinY":35},{"text":"VIH/ITS","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":86,"pinY":35},{"text":"Chagas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":41,"pinY":67},{"text":"Indicadores","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '93fe5abd-6d67-5aad-c08c-d15cc1d6ab9f',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Indicadores","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":78,"pinY":67},{"text":"Salud materna infantil","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":59,"pinY":67},{"text":"Chagas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":41,"pinY":67},{"text":"Tuberculosis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":22,"pinY":67},{"text":"VIH/ITS","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":86,"pinY":35},{"text":"PAI","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  'f79adb2f-92bb-593f-cbb1-853c01521b47',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"SUS","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":32,"pinY":35},{"text":"Mi Salud","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":50,"pinY":35},{"text":"PAI","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":69,"pinY":35},{"text":"VIH/ITS","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":86,"pinY":35},{"text":"Tuberculosis","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":22,"pinY":67},{"text":"Chagas","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '87615ed4-b00f-573d-ce5b-01908d799ff4',
  '64e70024-2e36-5cb1-c6a3-abd3493c9126',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Mi Salud","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":50,"pinY":35},{"text":"PAI","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":69,"pinY":35},{"text":"VIH/ITS","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":86,"pinY":35},{"text":"Tuberculosis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":22,"pinY":67},{"text":"Chagas","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":41,"pinY":67},{"text":"Salud materna infantil","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp03_sp03p1.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '5936a198-1804-5346-cf80-6ce3551b1397', 'Tema 4 Investigacion - perspectiva social epidemiologica', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 4: proceso investigativo desde la perspectiva social epidemiologica desde el material oficial de Educacion en Salud e Investigacion.', 'SP04P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 4: Proceso investigativo desde la perspectiva social epidemiologica', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '5936a198-1804-5346-cf80-6ce3551b1397';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'a480f2dc-3e65-58c9-cb18-b3255525cca6',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Situacion delimitada que requiere estudio',
  '[{"text":"Problema de investigacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'ef2f7ef5-488e-5793-c8a7-0b5ca01972cb',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Analiza condiciones sociales de la salud',
  '[{"text":"Epidemiologia","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '352624e6-c1d6-5fcc-c7ca-0c6d359529d4',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Estudia distribucion y determinantes en poblaciones',
  '[{"text":"Poblacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Contexto","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '6aaca57c-c54d-57fc-c9a7-c8f2e5d525bc',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Factores que explican desigualdad y riesgo',
  '[{"text":"Epidemiologia","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Problema de investigacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '4c436710-de5b-5ddd-ca31-935d76fc8d3e',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Grupo humano donde ocurre el fenomeno',
  '[{"text":"Poblacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '4828d7a8-591c-5dbd-cc8f-059ce5f314e3',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Condiciones historicas y territoriales',
  '[{"text":"Epidemiologia","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Contexto","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  'e6b56d00-7c1b-5c0a-c26c-bb041cbc866d',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Resultados que se busca alcanzar',
  '[{"text":"Perspectiva social","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Objetivos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Problema de investigacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'e1c824fc-2739-54b7-cc69-169d6e3c3339',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Caracteristicas observables o medibles',
  '[{"text":"Determinantes","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Variables","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '9eb08c63-af49-5159-ccb3-f01d86f8da6b',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'Informacion recolectada para analizar',
  '[{"text":"Datos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '3908b4cf-d226-5d08-cded-306321090757',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: situacion delimitada que requiere estudio',
  '[{"text":"Perspectiva social","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Problema de investigacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'aa97ed59-8bd4-5353-c6b0-569c644f3354',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: analiza condiciones sociales de la salud',
  '[{"text":"Determinantes","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'ebf9f2db-4762-52ab-c158-103abf37310b',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: estudia distribucion y determinantes en poblaciones',
  '[{"text":"Contexto","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '3703a413-bbd9-5f09-cccc-d8e96719d660',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: factores que explican desigualdad y riesgo',
  '[{"text":"Determinantes","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Problema de investigacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '8a3ea406-e38f-5386-c907-c03025c4d8bf',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: grupo humano donde ocurre el fenomeno',
  '[{"text":"Perspectiva social","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '5afe1310-0f59-582d-c5ef-c2cc4df63c4a',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: condiciones historicas y territoriales',
  '[{"text":"Determinantes","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Contexto","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'da8a8035-94d8-56e6-c747-ffcad05ad5da',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: resultados que se busca alcanzar',
  '[{"text":"Epidemiologia","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Objetivos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Problema de investigacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'ae52edca-5830-59ff-c17f-6e04eadf0329',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: caracteristicas observables o medibles',
  '[{"text":"Variables","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '9a10994c-66d7-5423-c87b-7c620717f7c0',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'mc',
  'En Tema 4: Proceso investigativo desde la perspectiva social epidemiologica, identifica el concepto relacionado con: informacion recolectada para analizar',
  '[{"text":"Epidemiologia","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Datos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '3da39b1a-6a27-5cc8-c890-cb9067af9b04',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Problema de investigacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Epidemiologia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Determinantes","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'dfbb43c2-ec56-558b-c049-248672273bd1',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Poblacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Contexto","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Objetivos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Variables","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'b98c6cfb-41c5-5284-ccfc-3bd29af4f1e4',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Problema de investigacion: Situacion delimitada que requiere estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Perspectiva social: Analiza condiciones sociales de la","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '5b3061cc-7f01-5fea-c989-ea62c6804280',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Epidemiologia","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Contexto","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Datos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '8fda73c6-4c14-5587-c935-deaedb295cec',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Determinantes","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Objetivos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Variables","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'fe15368c-5e59-5b28-c80b-f78d5fae4871',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Problema de investigacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Poblacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Datos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '3d057343-6cc4-5d5a-c56f-37c9cc4c74d5',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Problema de investigacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":13,"pinY":35},{"text":"Perspectiva social","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":32,"pinY":35},{"text":"Epidemiologia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":50,"pinY":35},{"text":"Determinantes","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":69,"pinY":35},{"text":"Poblacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":86,"pinY":35},{"text":"Contexto","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  'dece66e1-16a1-5a7b-ce14-9b329c7947f3',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Determinantes","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":69,"pinY":35},{"text":"Poblacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":86,"pinY":35},{"text":"Contexto","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":22,"pinY":67},{"text":"Objetivos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":41,"pinY":67},{"text":"Variables","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":59,"pinY":67},{"text":"Datos","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  'a721ebd7-3dff-5277-c47f-19b3c51a5090',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Problema de investigacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":13,"pinY":35},{"text":"Epidemiologia","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":50,"pinY":35},{"text":"Poblacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":86,"pinY":35},{"text":"Objetivos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":41,"pinY":67},{"text":"Datos","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  'f6a72872-8d4f-50fa-c080-3c9132418068',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Datos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":78,"pinY":67},{"text":"Variables","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":59,"pinY":67},{"text":"Objetivos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":41,"pinY":67},{"text":"Contexto","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":22,"pinY":67},{"text":"Poblacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":86,"pinY":35},{"text":"Determinantes","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  'a265a5f2-ee25-5b88-c569-aa6d2be05b75',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Perspectiva social","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":32,"pinY":35},{"text":"Epidemiologia","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":50,"pinY":35},{"text":"Determinantes","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":69,"pinY":35},{"text":"Poblacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":86,"pinY":35},{"text":"Contexto","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":22,"pinY":67},{"text":"Objetivos","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '89309e8d-a398-5f12-cca5-0f1c50efcc25',
  '5936a198-1804-5346-cf80-6ce3551b1397',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Epidemiologia","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":50,"pinY":35},{"text":"Determinantes","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":69,"pinY":35},{"text":"Poblacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":86,"pinY":35},{"text":"Contexto","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":22,"pinY":67},{"text":"Objetivos","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":41,"pinY":67},{"text":"Variables","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp04_sp04p1.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '0f8ca82a-027b-5be6-c398-416b11aae300', 'Tema 5 Investigacion - momentos del proceso', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 5: momentos del proceso de investigacion desde el material oficial de Educacion en Salud e Investigacion.', 'SP05P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 5: Momentos del proceso de investigacion', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '0f8ca82a-027b-5be6-c398-416b11aae300';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '3a280462-0ffb-5c1a-c9f3-6f189f1302d9',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Reconocer area o problema inicial',
  '[{"text":"Identificacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'f0ae9212-5e31-5cdf-caeb-7b5a291df384',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Precisar alcance temporal espacial y poblacional',
  '[{"text":"Definicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'd004041d-9795-562a-cbdf-8ad4762a07d4',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Redactar problema investigable',
  '[{"text":"Recoleccion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Tabulacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  'ec954394-b9fe-5bf0-c882-c2e5742662ff',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Plan para responder la pregunta',
  '[{"text":"Definicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Identificacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'c0fdcf4b-5b85-5ff8-c1f5-f025f01267ac',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Obtencion sistematica de informacion',
  '[{"text":"Recoleccion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'cc2650da-65a2-55a9-cebe-23a3df34e430',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Organizacion de datos recolectados',
  '[{"text":"Definicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Tabulacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '00ce6255-0ab3-5b1c-c74d-7c93e3123e5d',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Interpretacion segun objetivos',
  '[{"text":"Delimitacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Analisis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Identificacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '3edf9dac-9ca0-520f-c3fb-2eae9309fe56',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Documento que comunica proceso y resultados',
  '[{"text":"Diseno","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Informe final","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '99bfe65d-6d52-54ed-cf2c-0524302ab664',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'Respuestas derivadas del analisis',
  '[{"text":"Conclusiones","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '9ea7dff1-a6f8-551f-c9cd-b3fd7e16603f',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: reconocer area o problema inicial',
  '[{"text":"Delimitacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Identificacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'fbc4ee82-1f86-5ce8-cdd1-f66f8f3152f0',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: precisar alcance temporal espacial y poblacional',
  '[{"text":"Diseno","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '87081d54-9dfc-57db-cf36-0fb033212f78',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: redactar problema investigable',
  '[{"text":"Tabulacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '86f69d38-debb-55f2-c3d9-9185677c0c7f',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: plan para responder la pregunta',
  '[{"text":"Diseno","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Identificacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '511e978b-5866-51e7-c5fc-c4c4df8ce31c',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: obtencion sistematica de informacion',
  '[{"text":"Delimitacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'bf90b84a-8c79-507e-cccc-3cc3010d83ca',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: organizacion de datos recolectados',
  '[{"text":"Diseno","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Tabulacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'f37ffd2d-b36a-59f2-c1ed-122ab7e63c36',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: interpretacion segun objetivos',
  '[{"text":"Definicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Analisis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Identificacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '75fd47f9-079e-5ac8-c3f8-f754c225c3b8',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: documento que comunica proceso y resultados',
  '[{"text":"Informe final","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '1edaf9d5-cb45-5bd9-cda1-eba1f70ab6e5',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'mc',
  'En Tema 5: Momentos del proceso de investigacion, identifica el concepto relacionado con: respuestas derivadas del analisis',
  '[{"text":"Definicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Conclusiones","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '1a779fa9-8cae-5a27-ca4b-ad20411582f1',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Identificacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Definicion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Diseno","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '008abbbd-e1e5-5d69-c42c-3346ae034da0',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Recoleccion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Tabulacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Analisis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Informe final","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '04bca329-fabc-561d-ccb0-cbdb1cacd1db',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Identificacion: Reconocer area o problema inicial","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Delimitacion: Precisar alcance temporal espacial y","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'a0b12b0a-6360-5271-c853-014f40950476',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Definicion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Tabulacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Conclusiones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'eb0d802c-893d-545d-c732-a859a5b28b3a',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Diseno","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Analisis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Informe final","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'ce90160e-6c31-5100-c127-0e37b4788e1f',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Identificacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Recoleccion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Conclusiones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '4dc1653b-7fb9-5c77-c466-da989c96350d',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Identificacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":13,"pinY":35},{"text":"Delimitacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":32,"pinY":35},{"text":"Definicion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":50,"pinY":35},{"text":"Diseno","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":69,"pinY":35},{"text":"Recoleccion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":86,"pinY":35},{"text":"Tabulacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '9eb78682-fda1-5e8c-c749-e38e046d704d',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Diseno","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":69,"pinY":35},{"text":"Recoleccion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":86,"pinY":35},{"text":"Tabulacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":22,"pinY":67},{"text":"Analisis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":41,"pinY":67},{"text":"Informe final","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":59,"pinY":67},{"text":"Conclusiones","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '629c0e9c-9a57-5125-cf76-199d8a3b775e',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Identificacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":13,"pinY":35},{"text":"Definicion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":50,"pinY":35},{"text":"Recoleccion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":86,"pinY":35},{"text":"Analisis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":41,"pinY":67},{"text":"Conclusiones","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  'fb1604f4-9a10-5e13-c1ff-2bd3b877f617',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Conclusiones","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":78,"pinY":67},{"text":"Informe final","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":59,"pinY":67},{"text":"Analisis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":41,"pinY":67},{"text":"Tabulacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":22,"pinY":67},{"text":"Recoleccion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":86,"pinY":35},{"text":"Diseno","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  'c4c30922-ebc6-594d-cf88-54c5c564f0eb',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Delimitacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":32,"pinY":35},{"text":"Definicion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":50,"pinY":35},{"text":"Diseno","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":69,"pinY":35},{"text":"Recoleccion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":86,"pinY":35},{"text":"Tabulacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":22,"pinY":67},{"text":"Analisis","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '0e5c5e19-0605-5e85-c9e0-51f6bdbf34df',
  '0f8ca82a-027b-5be6-c398-416b11aae300',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Definicion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":50,"pinY":35},{"text":"Diseno","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":69,"pinY":35},{"text":"Recoleccion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":86,"pinY":35},{"text":"Tabulacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":22,"pinY":67},{"text":"Analisis","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":41,"pinY":67},{"text":"Informe final","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp05_sp05p1.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '2165b1db-a32a-5aad-c37d-82fb9a269891', 'Tema 6 Investigacion - objeto teoria e hipotesis', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 6: objeto de estudio, fundamentacion teorica e hipotesis desde el material oficial de Educacion en Salud e Investigacion.', 'SP06P1', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '2165b1db-a32a-5aad-c37d-82fb9a269891';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '536beda8-0c31-5591-cc3a-5391e1afa687',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Fenomeno concreto que se investigara',
  '[{"text":"Objeto de estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'fc22c480-83c4-563a-c71b-2c68c88b8214',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Pregunta o situacion central delimitada',
  '[{"text":"Justificacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '1dca1305-29cd-577e-c01c-9c7cacf95b76',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Razones y utilidad del estudio',
  '[{"text":"Marco teorico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Hipotesis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  'acf9097a-5935-5554-c5f0-08acd68b7ac0',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Logros que orientan la investigacion',
  '[{"text":"Justificacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objeto de estudio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '2e7bdac4-1956-5ef1-c7e9-f5486d226574',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Base conceptual y antecedentes',
  '[{"text":"Marco teorico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'fef3ed59-6b1e-58d5-cb32-f3175c9d2abc',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Respuesta tentativa comprobable',
  '[{"text":"Justificacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Hipotesis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '2d9ff427-d681-5ae2-c53c-c48690b7ef8c',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Caracteristica que puede variar',
  '[{"text":"Problema","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Variable","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objeto de estudio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'c6c2c583-2d03-5e58-ca76-953b27379659',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Medida observable de una variable',
  '[{"text":"Objetivos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Indicador","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '39ed3eae-32bc-5152-c853-4df8b7a5e6fb',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'Traduccion de conceptos a mediciones',
  '[{"text":"Operacionalizacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '4e298bba-0f5c-5fc7-cbb6-7a909f0e068a',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: fenomeno concreto que se investigara',
  '[{"text":"Problema","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objeto de estudio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '2192bc39-ba49-5ab0-c7b8-e4566c090839',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: pregunta o situacion central delimitada',
  '[{"text":"Objetivos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '3e9b71d3-ebec-5e54-cc33-92d5a650c450',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: razones y utilidad del estudio',
  '[{"text":"Hipotesis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'c743631f-39ea-5d51-c185-854e0f7b1a5b',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: logros que orientan la investigacion',
  '[{"text":"Objetivos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objeto de estudio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'e7a972f0-c5a9-5e15-c5bc-aa2087aa6afb',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: base conceptual y antecedentes',
  '[{"text":"Problema","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '3b2f2f29-ac66-5757-c496-7335e1675fb0',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: respuesta tentativa comprobable',
  '[{"text":"Objetivos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Hipotesis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '2bf5e181-2e10-5e46-c1d0-3a8bebe8f37c',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: caracteristica que puede variar',
  '[{"text":"Justificacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Variable","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objeto de estudio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '774dc436-504d-5a22-c6c7-84b459b282da',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: medida observable de una variable',
  '[{"text":"Indicador","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'bc4cf685-8637-5805-ce88-7530c611b015',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'mc',
  'En Tema 6: Objeto de estudio, fundamentacion teorica e hipotesis, identifica el concepto relacionado con: traduccion de conceptos a mediciones',
  '[{"text":"Justificacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Operacionalizacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'f67229b0-b643-58fc-ca2e-c2ccfedf7d02',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Objeto de estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Justificacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Objetivos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '1c4125b3-5bd3-562a-ceee-0d10a939e583',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Marco teorico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Hipotesis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Variable","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Indicador","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '73358402-eecd-5d8a-c7da-797ed7b6718c',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Objeto de estudio: Fenomeno concreto que se investigara","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Problema: Pregunta o situacion central delimitada","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '6616809a-1b06-51ec-c3df-8f4cd61ae636',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Justificacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Hipotesis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Operacionalizacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '74638337-2b7d-5cf0-c953-a4711412e7cb',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Objetivos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Variable","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Indicador","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '5afbaa5d-95a9-5d6e-cbae-5cde62b6ad44',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Objeto de estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Marco teorico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Operacionalizacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '25d01093-21c2-5690-c9a6-8cd922b9cb7f',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Objeto de estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":13,"pinY":35},{"text":"Problema","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":32,"pinY":35},{"text":"Justificacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":50,"pinY":35},{"text":"Objetivos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":69,"pinY":35},{"text":"Marco teorico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":86,"pinY":35},{"text":"Hipotesis","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '9a069dd8-5e48-5c35-c2f6-cc58c245d8f1',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Objetivos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":69,"pinY":35},{"text":"Marco teorico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":86,"pinY":35},{"text":"Hipotesis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":22,"pinY":67},{"text":"Variable","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":41,"pinY":67},{"text":"Indicador","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":59,"pinY":67},{"text":"Operacionalizacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '70ac3945-2f36-56c4-ca44-451177c01d77',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Objeto de estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":13,"pinY":35},{"text":"Justificacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":50,"pinY":35},{"text":"Marco teorico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":86,"pinY":35},{"text":"Variable","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":41,"pinY":67},{"text":"Operacionalizacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '0c5277f6-2573-5632-cbf8-6c2bd7284761',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Operacionalizacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":78,"pinY":67},{"text":"Indicador","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":59,"pinY":67},{"text":"Variable","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":41,"pinY":67},{"text":"Hipotesis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":22,"pinY":67},{"text":"Marco teorico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":86,"pinY":35},{"text":"Objetivos","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  '201a2219-25ba-5e1c-ce25-7b67fba3a33c',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Problema","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":32,"pinY":35},{"text":"Justificacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":50,"pinY":35},{"text":"Objetivos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":69,"pinY":35},{"text":"Marco teorico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":86,"pinY":35},{"text":"Hipotesis","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":22,"pinY":67},{"text":"Variable","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'fdeb5c0d-31b3-5daa-c2e2-de511e7cb532',
  '2165b1db-a32a-5aad-c37d-82fb9a269891',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Justificacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":50,"pinY":35},{"text":"Objetivos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":69,"pinY":35},{"text":"Marco teorico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":86,"pinY":35},{"text":"Hipotesis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":22,"pinY":67},{"text":"Variable","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":41,"pinY":67},{"text":"Indicador","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp06_sp06p1.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '9de26112-2a1b-5447-c4f1-1845682d5392', 'Tema 7 Investigacion - tipos de muestreo', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 7: introduccion a los tipos de muestreo desde el material oficial de Educacion en Salud e Investigacion.', 'SP07P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 7: Introduccion a los tipos de muestreo', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '9de26112-2a1b-5447-c4f1-1845682d5392';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'e64bed7b-008d-5aaa-c30a-124514b5c533',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Seleccion de parte de una poblacion',
  '[{"text":"Muestreo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '9bc878af-d44c-5cbf-c8ea-45ce257f0ded',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Todos tienen probabilidad conocida e igual',
  '[{"text":"Sistematico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '28e1e765-44f6-5542-c3d4-de5489206456',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Seleccion por intervalo despues de arranque',
  '[{"text":"Conglomerados","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conveniencia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '3a1dcba3-127f-53c1-c62a-f641d0be1823',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Divide poblacion en estratos homogeneos',
  '[{"text":"Sistematico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Muestreo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '3847085a-08af-5e20-c4ad-33ff6f193d01',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Selecciona grupos naturales o comunas',
  '[{"text":"Conglomerados","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '2f542339-72b1-509c-c760-f84b8d5b86d1',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Incluye sujetos accesibles',
  '[{"text":"Sistematico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conveniencia","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '390b3d35-ae84-56a9-cbef-b18e497db9c1',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Seleccion no probabilistica por categorias',
  '[{"text":"Aleatorio simple","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Cuotas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Muestreo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'c8548092-1764-5848-ce1f-08c508bcf839',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Participantes refieren nuevos participantes',
  '[{"text":"Estratificado","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Bola de nieve","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '5d95da4b-2701-5274-cea6-81b195c4cc27',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'Diferencia esperada entre muestra y poblacion',
  '[{"text":"Error muestral","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'e20d25fc-1f51-5f16-c933-2b046cd43c07',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: seleccion de parte de una poblacion',
  '[{"text":"Aleatorio simple","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Muestreo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '4d71c4bf-4972-59d9-ce09-b8623ef9b75d',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: todos tienen probabilidad conocida e igual',
  '[{"text":"Estratificado","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '929f7ea1-a3f3-5ba1-ce54-2befb4aa66d9',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: seleccion por intervalo despues de arranque',
  '[{"text":"Conveniencia","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '149cf1dc-4d3f-5729-c5db-ddaae249f9dc',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: divide poblacion en estratos homogeneos',
  '[{"text":"Estratificado","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Muestreo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '0042d4b8-4677-5883-c60c-f82f1fb015e0',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: selecciona grupos naturales o comunas',
  '[{"text":"Aleatorio simple","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '322a6308-2bfa-5c1c-c239-fffcbd3d4d3b',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: incluye sujetos accesibles',
  '[{"text":"Estratificado","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conveniencia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '2287c24d-7c47-57b1-c870-acbfbacdffd4',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: seleccion no probabilistica por categorias',
  '[{"text":"Sistematico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Cuotas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Muestreo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '5aceba89-1dee-5ff9-cb3d-d7a19db5e901',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: participantes refieren nuevos participantes',
  '[{"text":"Bola de nieve","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '773cb8a8-d0d5-5a5b-cb2f-92baf5ddc6ba',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'mc',
  'En Tema 7: Introduccion a los tipos de muestreo, identifica el concepto relacionado con: diferencia esperada entre muestra y poblacion',
  '[{"text":"Sistematico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Error muestral","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '777042f5-13c9-59de-c733-faf77a181023',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Muestreo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Sistematico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Estratificado","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '7a994674-431b-5a15-c17c-31b2699e1347',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Conglomerados","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conveniencia","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Cuotas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Bola de nieve","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '7df7b498-c2ac-5b33-c583-bec03f4b76ee',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Muestreo: Seleccion de parte de una","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Aleatorio simple: Todos tienen probabilidad conocida e","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '98b17114-8ac2-5a67-c015-e246a146a711',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Sistematico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conveniencia","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Error muestral","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '19a934de-b074-5510-c5fb-0374fd0b3aaf',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Estratificado","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Cuotas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Bola de nieve","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '6d7b3c5f-9bfa-5534-ca5e-6228976b4fb6',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Muestreo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Conglomerados","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Error muestral","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  'e0922211-1a96-5b6f-c7cc-2b6e32577533',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Muestreo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":13,"pinY":35},{"text":"Aleatorio simple","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":32,"pinY":35},{"text":"Sistematico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":50,"pinY":35},{"text":"Estratificado","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":69,"pinY":35},{"text":"Conglomerados","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":86,"pinY":35},{"text":"Conveniencia","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '6b2a7935-057d-5238-c9bd-f1a698800bdc',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Estratificado","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":69,"pinY":35},{"text":"Conglomerados","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":86,"pinY":35},{"text":"Conveniencia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":22,"pinY":67},{"text":"Cuotas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":41,"pinY":67},{"text":"Bola de nieve","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":59,"pinY":67},{"text":"Error muestral","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  'baa52e9d-df53-55aa-c170-4e4a8527dce3',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Muestreo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":13,"pinY":35},{"text":"Sistematico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":50,"pinY":35},{"text":"Conglomerados","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":86,"pinY":35},{"text":"Cuotas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":41,"pinY":67},{"text":"Error muestral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '59f1089b-f80e-593d-ccbb-8be62fed56c3',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Error muestral","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":78,"pinY":67},{"text":"Bola de nieve","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":59,"pinY":67},{"text":"Cuotas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":41,"pinY":67},{"text":"Conveniencia","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":22,"pinY":67},{"text":"Conglomerados","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":86,"pinY":35},{"text":"Estratificado","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  '0c296f35-f27d-5d78-ca5a-7ce87af76c26',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Aleatorio simple","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":32,"pinY":35},{"text":"Sistematico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":50,"pinY":35},{"text":"Estratificado","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":69,"pinY":35},{"text":"Conglomerados","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":86,"pinY":35},{"text":"Conveniencia","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":22,"pinY":67},{"text":"Cuotas","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'fca4fcd9-120b-5fa4-c0d9-a48c1098d147',
  '9de26112-2a1b-5447-c4f1-1845682d5392',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Sistematico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":50,"pinY":35},{"text":"Estratificado","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":69,"pinY":35},{"text":"Conglomerados","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":86,"pinY":35},{"text":"Conveniencia","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":22,"pinY":67},{"text":"Cuotas","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":41,"pinY":67},{"text":"Bola de nieve","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp07_sp07p2.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '512db625-43f6-5076-c30f-e5662844f75f', 'Tema 8 Investigacion - diseno metodologico', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 8: breve introduccion al diseno metodologico desde el material oficial de Educacion en Salud e Investigacion.', 'SP08P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 8: Breve introduccion al diseno metodologico', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '512db625-43f6-5076-c30f-e5662844f75f';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '5e458798-e1fc-58a6-c85f-4af85ffb2579',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Plan ordenado de como investigar',
  '[{"text":"Diseno metodologico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'f97c3af7-5361-524a-cc8e-cf06539f22ca',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Interrogante que guia el estudio',
  '[{"text":"Enfoque","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '3ba93e98-d4ca-574d-ca80-af5d0ee22225',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Cuantitativo cualitativo o mixto',
  '[{"text":"Muestra","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tecnica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '6fc7a14e-0254-5e90-c3b4-a7f0ad222d1e',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Estructura segun alcance y temporalidad',
  '[{"text":"Enfoque","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Diseno metodologico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'b2068ed9-f75e-5933-c563-22a9e9b5e32d',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Subconjunto que aporta informacion',
  '[{"text":"Muestra","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'd0fd619c-d35f-506b-c15c-a92d538a0338',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Modo de recolectar datos',
  '[{"text":"Enfoque","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tecnica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  'b83b201e-8f44-5bfa-c89b-53c945d6bdd2',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Herramienta concreta de medicion',
  '[{"text":"Pregunta","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Instrumento","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Diseno metodologico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'eb551ef8-0e78-5a2d-c5b6-f1e94d214521',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Proteccion de participantes y consentimiento',
  '[{"text":"Tipo de estudio","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Etica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '39e10544-a76d-549f-cdd3-144d506e39ef',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'Estrategia para procesar resultados',
  '[{"text":"Plan de analisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'b732ef4f-3d9e-51d5-ccad-0a8e68b425d9',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: plan ordenado de como investigar',
  '[{"text":"Pregunta","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Diseno metodologico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'dde09215-32db-5093-c03f-14a1ed7a7a0b',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: interrogante que guia el estudio',
  '[{"text":"Tipo de estudio","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'dc3ca8da-fb01-5b02-cdda-c9a5b70bdfc9',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: cuantitativo cualitativo o mixto',
  '[{"text":"Tecnica","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'c9e69211-ab3f-5eb4-c282-d8ff5533b9bd',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: estructura segun alcance y temporalidad',
  '[{"text":"Tipo de estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Diseno metodologico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'bc1ace15-3602-5e8e-cd6b-6831bbc81f65',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: subconjunto que aporta informacion',
  '[{"text":"Pregunta","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '09901a9b-3705-59cb-c35a-862168909350',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: modo de recolectar datos',
  '[{"text":"Tipo de estudio","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tecnica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '8f8ac848-1ca6-5ef4-ce1c-c4436ca7f73f',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: herramienta concreta de medicion',
  '[{"text":"Enfoque","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Instrumento","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Diseno metodologico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'e7a572ad-aa84-5558-cb2e-cb29ad97dec3',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: proteccion de participantes y consentimiento',
  '[{"text":"Etica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'f7f6a73f-6743-55b0-c468-11c975499bf7',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'mc',
  'En Tema 8: Breve introduccion al diseno metodologico, identifica el concepto relacionado con: estrategia para procesar resultados',
  '[{"text":"Enfoque","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Plan de analisis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'ad808ee5-f3bd-5a6a-c064-10ee5234e609',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Diseno metodologico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Enfoque","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tipo de estudio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'fbed11b1-6d6c-5728-c0d2-13785c753354',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Muestra","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tecnica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Instrumento","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Etica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '651999e5-2716-52cf-ceeb-31b600145382',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Diseno metodologico: Plan ordenado de como investigar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Pregunta: Interrogante que guia el estudio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'dfe605bd-948c-504a-cf6a-4bf29aee003b',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Enfoque","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Tecnica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Plan de analisis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '4fc56bac-7247-58e5-cc4c-36113269cc72',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Tipo de estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Instrumento","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Etica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '9dda62d6-47d0-58ed-c1c9-a0138e01602e',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Diseno metodologico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Muestra","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Plan de analisis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '71fa4fa1-11c2-51d9-cb2e-8d4e177ed899',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Diseno metodologico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":13,"pinY":35},{"text":"Pregunta","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":32,"pinY":35},{"text":"Enfoque","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":50,"pinY":35},{"text":"Tipo de estudio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":69,"pinY":35},{"text":"Muestra","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":86,"pinY":35},{"text":"Tecnica","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '66af9d21-3a09-5ab9-c939-4176b20f235f',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Tipo de estudio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":69,"pinY":35},{"text":"Muestra","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":86,"pinY":35},{"text":"Tecnica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":22,"pinY":67},{"text":"Instrumento","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":41,"pinY":67},{"text":"Etica","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":59,"pinY":67},{"text":"Plan de analisis","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '8e9cc466-fbc5-52f7-ca00-a0cc9676e3bf',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Diseno metodologico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":13,"pinY":35},{"text":"Enfoque","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":50,"pinY":35},{"text":"Muestra","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":86,"pinY":35},{"text":"Instrumento","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":41,"pinY":67},{"text":"Plan de analisis","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '0aeecc81-d1a6-5798-c1fc-356fbcf8c2db',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Plan de analisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":78,"pinY":67},{"text":"Etica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":59,"pinY":67},{"text":"Instrumento","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":41,"pinY":67},{"text":"Tecnica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":22,"pinY":67},{"text":"Muestra","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":86,"pinY":35},{"text":"Tipo de estudio","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  'a7a421af-334b-5af2-cffe-97f438a7f5ed',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Pregunta","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":32,"pinY":35},{"text":"Enfoque","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":50,"pinY":35},{"text":"Tipo de estudio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":69,"pinY":35},{"text":"Muestra","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":86,"pinY":35},{"text":"Tecnica","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":22,"pinY":67},{"text":"Instrumento","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'e7bbd2ea-db2c-5838-caea-96cf341ffe0c',
  '512db625-43f6-5076-c30f-e5662844f75f',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Enfoque","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":50,"pinY":35},{"text":"Tipo de estudio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":69,"pinY":35},{"text":"Muestra","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":86,"pinY":35},{"text":"Tecnica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":22,"pinY":67},{"text":"Instrumento","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":41,"pinY":67},{"text":"Etica","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp08_sp08p2.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '161b3643-acb8-54fb-c457-567fbbc44296', 'Tema 9 Investigacion - disenos cuantitativos', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 9: disenos para investigacion cuantitativa desde el material oficial de Educacion en Salud e Investigacion.', 'SP09P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 9: Disenos para investigacion cuantitativa', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '161b3643-acb8-54fb-c457-567fbbc44296';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '3c3382da-9e72-5508-c12d-9477fedee251',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Enfoque que cuantifica fenomenos',
  '[{"text":"Cuantitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'fed10f2c-e338-5ff5-cc6a-ed628c050a6a',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Asignacion de valores a variables',
  '[{"text":"Variable","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '1268800e-da4a-5ab6-c6ba-e7c668758ba3',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Caracteristica medible',
  '[{"text":"Analitico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Transversal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '5a42ec4f-8683-5474-c00c-6d8415a3374d',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Describe frecuencia o distribucion',
  '[{"text":"Variable","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'b4811864-5c22-5f64-c260-789250939f47',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Busca asociacion entre exposicion y evento',
  '[{"text":"Analitico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '6dd1dd35-a6f4-510e-c6c4-d7eb36576e11',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Mide en un momento determinado',
  '[{"text":"Variable","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Transversal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '364a21c4-813b-551d-c107-45c3c8ba61c8',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Sigue expuestos y no expuestos',
  '[{"text":"Medicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cohorte","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'e5e1a19b-77c0-55f3-cf50-352b0cdde52d',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Compara enfermos y no enfermos retrospectivamente',
  '[{"text":"Descriptivo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Caso-control","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  'ac15daa3-b65a-5d19-c83f-a2a2eecc8ced',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'Intervencion controlada para evaluar efecto',
  '[{"text":"Ensayo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'e93d9d23-4574-5873-c6db-fe3aae8e3396',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: enfoque que cuantifica fenomenos',
  '[{"text":"Medicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cuantitativa","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '198b3538-5a77-5dfa-cfad-bcd6bd8503b9',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: asignacion de valores a variables',
  '[{"text":"Descriptivo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '202e6030-dd93-5db6-c4be-6f563023874c',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: caracteristica medible',
  '[{"text":"Transversal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'ba295772-1e2b-51b1-ca56-1fb54a0ae064',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: describe frecuencia o distribucion',
  '[{"text":"Descriptivo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'd96ce0d5-05eb-5e3e-c4c4-b4c5f5ba8d13',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: busca asociacion entre exposicion y evento',
  '[{"text":"Medicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'a383d038-7696-571a-c921-605b5e93d46a',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: mide en un momento determinado',
  '[{"text":"Descriptivo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Transversal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'bcc59665-129b-5248-c8ff-e2a5498e07aa',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: sigue expuestos y no expuestos',
  '[{"text":"Variable","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cohorte","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '704adc00-77b4-5334-c67e-0926da38f8b9',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: compara enfermos y no enfermos retrospectivamente',
  '[{"text":"Caso-control","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '60444006-e342-50d4-cfea-0a52ab636cb9',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'mc',
  'En Tema 9: Disenos para investigacion cuantitativa, identifica el concepto relacionado con: intervencion controlada para evaluar efecto',
  '[{"text":"Variable","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Ensayo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '1a1ee061-a5c1-55b7-c99c-909771cd76db',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Cuantitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Variable","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Descriptivo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '403b334f-434d-5052-cc3f-b72470ba379f',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Analitico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Transversal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cohorte","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Caso-control","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'dc123ba7-8500-5e97-c108-fb75f6e5ed74',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Cuantitativa: Enfoque que cuantifica fenomenos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Medicion: Asignacion de valores a variables","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '6f2b6154-3bf7-5975-cd19-97e35a0c2d80',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Variable","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Transversal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Ensayo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '7c048fe4-0546-5590-c7d8-b48b0b80df32',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Descriptivo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Cohorte","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Caso-control","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '8212e7e9-688f-5990-ce4a-19cbda6ee16e',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Cuantitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Analitico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Ensayo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '12a4025e-52df-5419-cea7-63ba8c3bef0c',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Cuantitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":13,"pinY":35},{"text":"Medicion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":32,"pinY":35},{"text":"Variable","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":50,"pinY":35},{"text":"Descriptivo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":69,"pinY":35},{"text":"Analitico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":86,"pinY":35},{"text":"Transversal","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  'ff7c0185-36b0-5fad-c830-2885dd8f8612',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Descriptivo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":69,"pinY":35},{"text":"Analitico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":86,"pinY":35},{"text":"Transversal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":22,"pinY":67},{"text":"Cohorte","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":41,"pinY":67},{"text":"Caso-control","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":59,"pinY":67},{"text":"Ensayo","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  'b5f790e3-beaa-5ecd-c95f-81419ae627c4',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Cuantitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":13,"pinY":35},{"text":"Variable","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":50,"pinY":35},{"text":"Analitico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":86,"pinY":35},{"text":"Cohorte","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":41,"pinY":67},{"text":"Ensayo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  'c7ac7383-85f6-53fc-cf41-c9db24448e15',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Ensayo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":78,"pinY":67},{"text":"Caso-control","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":59,"pinY":67},{"text":"Cohorte","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":41,"pinY":67},{"text":"Transversal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":22,"pinY":67},{"text":"Analitico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":86,"pinY":35},{"text":"Descriptivo","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  '90a51add-8a2f-5bfe-cc13-8dfccf5f27fd',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Medicion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":32,"pinY":35},{"text":"Variable","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":50,"pinY":35},{"text":"Descriptivo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":69,"pinY":35},{"text":"Analitico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":86,"pinY":35},{"text":"Transversal","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":22,"pinY":67},{"text":"Cohorte","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '9db4c1a6-462d-5584-c64a-a422d547d399',
  '161b3643-acb8-54fb-c457-567fbbc44296',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Variable","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":50,"pinY":35},{"text":"Descriptivo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":69,"pinY":35},{"text":"Analitico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":86,"pinY":35},{"text":"Transversal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":22,"pinY":67},{"text":"Cohorte","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":41,"pinY":67},{"text":"Caso-control","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp09_sp09p2.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'a1779608-8130-5f41-c6c9-ee8338184383', 'Tema 10 Investigacion - disenos cualitativos', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 10: disenos de investigacion cualitativa desde el material oficial de Educacion en Salud e Investigacion.', 'SP10P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 10: Disenos de investigacion cualitativa', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'a1779608-8130-5f41-c6c9-ee8338184383';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '37a026d3-a845-5f84-cca4-05c98d50862c',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'Enfoque que comprende experiencias',
  '[{"text":"Cualitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'dd04d20a-2236-5305-cddd-ea0180bfaf5a',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'Sentidos atribuidos por participantes',
  '[{"text":"Entrevista","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'a9bf6552-8a1f-5fe6-cba3-193a5b148488',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'Conversacion guiada para profundidad',
  '[{"text":"Observacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Muestreo teorico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  'fd636142-6157-59db-cb7c-62628c9d952a',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'Discusion grupal orientada',
  '[{"text":"Entrevista","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '563ba2e4-ab72-5463-c0ac-c025a634c489',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'Registro sistematico de conductas y contexto',
  '[{"text":"Observacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '7033764e-3781-5dcf-ca6c-6fc20950f1a7',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'Seleccion segun desarrollo teorico',
  '[{"text":"Entrevista","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Muestreo teorico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '2bbf3d16-2e9b-5eeb-c119-83abdbfea19c',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'No aparecen categorias nuevas',
  '[{"text":"Significados","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Saturacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'be4b6d00-823c-534e-c2b5-b38b7eac3ca4',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'Asignacion de codigos a datos',
  '[{"text":"Grupo focal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Codificacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  'b2155b8a-c845-5655-cb44-87b833eebc88',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'Contraste de fuentes metodos o investigadores',
  '[{"text":"Triangulacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'b542c9cc-e652-558e-c37e-f8d7a4cd41f0',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: enfoque que comprende experiencias',
  '[{"text":"Significados","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Cualitativa","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'f99aba57-aeda-59ef-c415-7a927cdb6e2d',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: sentidos atribuidos por participantes',
  '[{"text":"Grupo focal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '805aff9b-9e3c-5257-cea6-8e751176087f',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: conversacion guiada para profundidad',
  '[{"text":"Muestreo teorico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '756504ad-c538-545d-c115-97298e7c0d20',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: discusion grupal orientada',
  '[{"text":"Grupo focal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'fd7efdc8-a248-520d-c1c3-a266186b39ce',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: registro sistematico de conductas y contexto',
  '[{"text":"Significados","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'ab9418c1-bced-5369-c5bc-7e07267078f0',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: seleccion segun desarrollo teorico',
  '[{"text":"Grupo focal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Muestreo teorico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'a5925901-73b7-523d-c10f-cf5ef9c33fd6',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: no aparecen categorias nuevas',
  '[{"text":"Entrevista","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Saturacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '4dfce1f9-fbdb-5a14-c6a2-d78a83428c19',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: asignacion de codigos a datos',
  '[{"text":"Codificacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'c117b6a1-6ee6-5a40-c061-ed0dc20175fa',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'mc',
  'En Tema 10: Disenos de investigacion cualitativa, identifica el concepto relacionado con: contraste de fuentes metodos o investigadores',
  '[{"text":"Entrevista","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Triangulacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '6c43a3d4-a688-54fd-c13b-e7c3768f30fd',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Cualitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Entrevista","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Grupo focal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'fb6e6f56-e42f-57be-c801-934de20e15cc',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Observacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Muestreo teorico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Saturacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Codificacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'ee7c422d-ace9-5c16-c8c4-9b39dcef6091',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Cualitativa: Enfoque que comprende experiencias","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Significados: Sentidos atribuidos por participantes","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'ea77a9f6-6ac0-5117-cde4-bd345d1cd792',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Entrevista","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Muestreo teorico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Triangulacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '7e9e9f1f-5fa0-5344-c9dc-1c3296ae2b8b',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Grupo focal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Saturacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Codificacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'eee0fe63-c6d5-5030-c208-3982924a9adf',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Cualitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Observacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Triangulacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '0c57ce11-ebc9-5303-c18e-4ef4f7f4f1e6',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Cualitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":13,"pinY":35},{"text":"Significados","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":32,"pinY":35},{"text":"Entrevista","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":50,"pinY":35},{"text":"Grupo focal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":69,"pinY":35},{"text":"Observacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":86,"pinY":35},{"text":"Muestreo teorico","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  'eabd6b91-0c84-514c-cf32-00e1b3ac544c',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Grupo focal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":69,"pinY":35},{"text":"Observacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":86,"pinY":35},{"text":"Muestreo teorico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":22,"pinY":67},{"text":"Saturacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":41,"pinY":67},{"text":"Codificacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":59,"pinY":67},{"text":"Triangulacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  'a700485e-3eb9-542c-c03c-23fde0630550',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Cualitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":13,"pinY":35},{"text":"Entrevista","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":50,"pinY":35},{"text":"Observacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":86,"pinY":35},{"text":"Saturacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":41,"pinY":67},{"text":"Triangulacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  'e0c101eb-5dec-5836-c3b3-b31b4e041d6b',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Triangulacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":78,"pinY":67},{"text":"Codificacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":59,"pinY":67},{"text":"Saturacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":41,"pinY":67},{"text":"Muestreo teorico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":22,"pinY":67},{"text":"Observacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":86,"pinY":35},{"text":"Grupo focal","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  '0ddb6386-66cd-53d7-ca4f-fdfbe2c426e0',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Significados","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":32,"pinY":35},{"text":"Entrevista","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":50,"pinY":35},{"text":"Grupo focal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":69,"pinY":35},{"text":"Observacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":86,"pinY":35},{"text":"Muestreo teorico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":22,"pinY":67},{"text":"Saturacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'e199eb7d-d713-5d11-c4ef-fd160e0bf58b',
  'a1779608-8130-5f41-c6c9-ee8338184383',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Entrevista","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":50,"pinY":35},{"text":"Grupo focal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":69,"pinY":35},{"text":"Observacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":86,"pinY":35},{"text":"Muestreo teorico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":22,"pinY":67},{"text":"Saturacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":41,"pinY":67},{"text":"Codificacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp10_sp10p2.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4', 'Tema 11 Investigacion - variables', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 11: definicion y medicion de variables desde el material oficial de Educacion en Salud e Investigacion.', 'SP11P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 11: Definicion y medicion de variables', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '6f3f398c-7d9e-5c63-c54c-23fe022d0de4';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '627e08aa-0b9f-54cc-c5c8-96313642f4eb',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Caracteristica que cambia o se mide',
  '[{"text":"Variable","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '63c9f4d4-b529-533d-ca01-62b0a9a021ec',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Variable de categorias no numericas',
  '[{"text":"Cuantitativa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '79c7fb54-00df-54ce-c6d4-fb4e9c953bb3',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Variable expresada numericamente',
  '[{"text":"Ordinal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Intervalo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '95140f4e-81fa-54d4-c76c-f46053f4bb93',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Categorias sin orden',
  '[{"text":"Cuantitativa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Variable","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'd761291d-fe66-5975-c114-191791c3c261',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Categorias con orden',
  '[{"text":"Ordinal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'be25c61b-6a90-5db7-ca27-7e94688f055f',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Escala con intervalos sin cero absoluto',
  '[{"text":"Cuantitativa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Intervalo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '087f60d8-28d8-5ab6-c439-473b0b878c99',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Escala con cero absoluto',
  '[{"text":"Cualitativa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Razon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Variable","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '9a582192-b28a-5148-cf88-d9c9ba0da907',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Medida observable de variable',
  '[{"text":"Nominal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Indicador","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '6cce55b1-77be-553d-c3f2-092ccbe8d815',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'Definicion practica para medir',
  '[{"text":"Operacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '3fafddee-d386-5372-c51f-aae4df3ea792',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: caracteristica que cambia o se mide',
  '[{"text":"Cualitativa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Variable","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '9f8be707-5952-51ca-c89f-8b1f5e67b3de',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: variable de categorias no numericas',
  '[{"text":"Nominal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '5156f3c1-7943-5137-c82b-f3124d530e71',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: variable expresada numericamente',
  '[{"text":"Intervalo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '353a4760-e021-5509-c7c7-9adfb6992656',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: categorias sin orden',
  '[{"text":"Nominal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Variable","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '87bc3f0c-c952-5f3c-cfdb-c450fae406c4',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: categorias con orden',
  '[{"text":"Cualitativa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '51feb1f8-6f34-5b33-c9cf-6238b25d0e62',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: escala con intervalos sin cero absoluto',
  '[{"text":"Nominal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Intervalo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '564df7bc-f04d-5161-c162-51b10e50840e',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: escala con cero absoluto',
  '[{"text":"Cuantitativa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Razon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Variable","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '8f21e297-beb4-579a-c649-678564cb6ca1',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: medida observable de variable',
  '[{"text":"Indicador","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'a6c582a2-d601-5c31-c90c-f96e814da191',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'mc',
  'En Tema 11: Definicion y medicion de variables, identifica el concepto relacionado con: definicion practica para medir',
  '[{"text":"Cuantitativa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Operacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '3ddf51e0-a890-5dd8-c6f9-d6caa3be5c6d',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Variable","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cuantitativa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nominal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '50038a79-10d9-5388-c0ab-5dc59ce5141b',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Ordinal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Intervalo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Razon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Indicador","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'a6f343a0-3cfd-5a49-cffd-b79b8a5e8489',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Variable: Caracteristica que cambia o se","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cualitativa: Variable de categorias no numericas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '7e38fd32-309b-52ff-c6b5-8e164024c4b2',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Cuantitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Intervalo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Operacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'af65081c-ad56-5a03-cd1c-23f420b3cafc',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Nominal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Razon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Indicador","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '9e1536ae-e22d-5e5a-c9d7-91debdabc5de',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Variable","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Ordinal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Operacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '3d63d83f-bd6e-5579-caa6-95fa759f6413',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Variable","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":13,"pinY":35},{"text":"Cualitativa","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":32,"pinY":35},{"text":"Cuantitativa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":50,"pinY":35},{"text":"Nominal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":69,"pinY":35},{"text":"Ordinal","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":86,"pinY":35},{"text":"Intervalo","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '209c9b9c-48a8-5221-c037-d7e1f424c936',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Nominal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":69,"pinY":35},{"text":"Ordinal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":86,"pinY":35},{"text":"Intervalo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":22,"pinY":67},{"text":"Razon","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":41,"pinY":67},{"text":"Indicador","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":59,"pinY":67},{"text":"Operacion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '5e617cf3-893e-5a07-c4b8-1c86831cb590',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Variable","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":13,"pinY":35},{"text":"Cuantitativa","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":50,"pinY":35},{"text":"Ordinal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":86,"pinY":35},{"text":"Razon","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":41,"pinY":67},{"text":"Operacion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '2dfe8851-7bdb-524f-cad3-46bbab8bde91',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Operacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":78,"pinY":67},{"text":"Indicador","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":59,"pinY":67},{"text":"Razon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":41,"pinY":67},{"text":"Intervalo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":22,"pinY":67},{"text":"Ordinal","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":86,"pinY":35},{"text":"Nominal","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  '32f89d21-a701-53af-c6ba-036e621d03f6',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Cualitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":32,"pinY":35},{"text":"Cuantitativa","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":50,"pinY":35},{"text":"Nominal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":69,"pinY":35},{"text":"Ordinal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":86,"pinY":35},{"text":"Intervalo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":22,"pinY":67},{"text":"Razon","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '6c871684-8e76-5589-cf2e-a5fbb07deab8',
  '6f3f398c-7d9e-5c63-c54c-23fe022d0de4',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Cuantitativa","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":50,"pinY":35},{"text":"Nominal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":69,"pinY":35},{"text":"Ordinal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":86,"pinY":35},{"text":"Intervalo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":22,"pinY":67},{"text":"Razon","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":41,"pinY":67},{"text":"Indicador","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp11_sp11p2.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'b2f247fb-7e53-5310-cef9-03cdcf39e259', 'Tema 12 Investigacion - poblacion y muestra', 'EDUCACION PARA LA SALUD', 'Residencia', 'espanol', 'publica',
  'Repasar tema 12: poblacion y muestra desde el material oficial de Educacion en Salud e Investigacion.', 'SP12P2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Tema 12: Poblacion y muestra', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'b2f247fb-7e53-5310-cef9-03cdcf39e259';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'd1be1ca2-b819-5e8b-cbb8-be522a3b3543',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Conjunto total teorico de interes',
  '[{"text":"Universo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'bfbe2594-f7c9-5479-c604-3720d9418c80',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Conjunto accesible definido para estudio',
  '[{"text":"Muestra","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'c73b5435-ac6e-5482-c6c0-da36dcee57be',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Subconjunto seleccionado',
  '[{"text":"Marco muestral","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio inclusion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '4c9d7300-0005-587b-cfbc-6d67d8c5b07e',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Elemento sobre el que se observa informacion',
  '[{"text":"Muestra","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Universo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '17b78337-d1bc-5c9b-c803-bd9033c015e8',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Listado o base para seleccionar muestra',
  '[{"text":"Marco muestral","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '24c9cab6-6b44-58c4-c120-494dd5f3b45f',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Condicion para participar',
  '[{"text":"Muestra","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio inclusion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  'f432f858-d07a-5b45-c6cd-f384b032ac55',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Condicion para no participar',
  '[{"text":"Poblacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio exclusion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Universo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '79381aee-246c-57cb-cbfa-c3f1598e937c',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Numero necesario de participantes',
  '[{"text":"Unidad de analisis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Tamano muestral","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '58792d10-d758-5476-c4e2-d2c836d7c68f',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'Capacidad de reflejar a la poblacion',
  '[{"text":"Representatividad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '17c16eae-bfbc-50b6-cf93-d951e2bac0d5',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: conjunto total teorico de interes',
  '[{"text":"Poblacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Universo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '094ed416-4da3-51a5-ca04-d00a6c95f8cf',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: conjunto accesible definido para estudio',
  '[{"text":"Unidad de analisis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '1c93b2d4-d86d-573d-cbe2-1204eec4e3a1',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: subconjunto seleccionado',
  '[{"text":"Criterio inclusion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '3d26b733-9cff-5d6a-c8c0-7cf5c4d4de8c',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: elemento sobre el que se observa informacion',
  '[{"text":"Unidad de analisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Universo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '6d482eec-bbb1-5471-c640-bdf568e7ce07',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: listado o base para seleccionar muestra',
  '[{"text":"Poblacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'c6b9285f-0dcd-5540-cb13-7718fdb2feac',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: condicion para participar',
  '[{"text":"Unidad de analisis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio inclusion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'd3e4879c-8668-5930-c0c6-c55181679726',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: condicion para no participar',
  '[{"text":"Muestra","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio exclusion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Universo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '7fc327b4-0fef-5ae7-c18e-4f0d9afa012d',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: numero necesario de participantes',
  '[{"text":"Tamano muestral","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '4751f648-eae7-5196-c390-9d19392460b8',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'mc',
  'En Tema 12: Poblacion y muestra, identifica el concepto relacionado con: capacidad de reflejar a la poblacion',
  '[{"text":"Muestra","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Representatividad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'e8791701-4a90-5898-c7e8-05db9dccaf62',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'ms',
  'Selecciona conceptos centrales de este tema.',
  '[{"text":"Universo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Muestra","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Unidad de analisis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Hallazgo anatomico aislado","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  '10d71e12-2361-5999-cb7a-200eb70af4f7',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'ms',
  'Selecciona elementos operativos o aplicados.',
  '[{"text":"Marco muestral","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio inclusion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio exclusion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Tamano muestral","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Potencial de accion neuronal","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'e5c90848-3788-52db-c71e-41536cfd7a63',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'ms',
  'Selecciona pares correctos del tema.',
  '[{"text":"Universo: Conjunto total teorico de interes","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Poblacion: Conjunto accesible definido para estudio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Mitocondria: politica publica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'd540fdbc-2d9c-5994-c763-a6eddd9bbc59',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'ms',
  'Selecciona elementos que se usan para planificar o evaluar.',
  '[{"text":"Muestra","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio inclusion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Representatividad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Cromatina nuclear","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '54378db9-b0bd-5c2a-ccb8-7130b705e5d4',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'ms',
  'Selecciona conceptos que deben definirse con claridad.',
  '[{"text":"Unidad de analisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Criterio exclusion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Tamano muestral","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Vaina de mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '4d06cf0c-8507-511d-ca66-bbb19953455c',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'ms',
  'Selecciona componentes relevantes para el examen parcial.',
  '[{"text":"Universo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Marco muestral","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Representatividad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"},{"text":"Nodo sinoauricular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '439d451f-1bee-5576-c8f7-5999f0661b15',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'dnd',
  'Relaciona conceptos del esquema.',
  '[{"text":"Universo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":13,"pinY":35},{"text":"Poblacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":32,"pinY":35},{"text":"Muestra","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":50,"pinY":35},{"text":"Unidad de analisis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":69,"pinY":35},{"text":"Marco muestral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":86,"pinY":35},{"text":"Criterio inclusion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":22,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '762840ac-cc6b-5652-c999-ed670ecee9e8',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'dnd',
  'Relaciona componentes aplicados.',
  '[{"text":"Unidad de analisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":69,"pinY":35},{"text":"Marco muestral","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":86,"pinY":35},{"text":"Criterio inclusion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":22,"pinY":67},{"text":"Criterio exclusion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":41,"pinY":67},{"text":"Tamano muestral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":59,"pinY":67},{"text":"Representatividad","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  'a36b00fe-7854-5385-cc32-37a4b3f45337',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'dnd',
  'Relaciona elementos principales.',
  '[{"text":"Universo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":13,"pinY":35},{"text":"Muestra","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":50,"pinY":35},{"text":"Marco muestral","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":86,"pinY":35},{"text":"Criterio exclusion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":41,"pinY":67},{"text":"Representatividad","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":78,"pinY":67}]'::jsonb,
  false, 26, 1, 75
),
(
  '65edf332-d318-5ebf-c640-4ccb700016cd',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'dnd',
  'Relaciona conceptos y etapas.',
  '[{"text":"Representatividad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":78,"pinY":67},{"text":"Tamano muestral","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":59,"pinY":67},{"text":"Criterio exclusion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":41,"pinY":67},{"text":"Criterio inclusion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":22,"pinY":67},{"text":"Marco muestral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":86,"pinY":35},{"text":"Unidad de analisis","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":69,"pinY":35}]'::jsonb,
  false, 27, 1, 75
),
(
  'd20fcc08-543c-5d6a-c04a-0f348d5961a3',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'dnd',
  'Relaciona etiquetas del tema.',
  '[{"text":"Poblacion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":32,"pinY":35},{"text":"Muestra","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":50,"pinY":35},{"text":"Unidad de analisis","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":69,"pinY":35},{"text":"Marco muestral","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":86,"pinY":35},{"text":"Criterio inclusion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":22,"pinY":67},{"text":"Criterio exclusion","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":41,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  'f7187eed-63a3-569e-cf3e-67fae0dd3a7e',
  'b2f247fb-7e53-5310-cef9-03cdcf39e259',
  'dnd',
  'Relaciona practica y evaluacion.',
  '[{"text":"Muestra","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":50,"pinY":35},{"text":"Unidad de analisis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":69,"pinY":35},{"text":"Marco muestral","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":86,"pinY":35},{"text":"Criterio inclusion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":22,"pinY":67},{"text":"Criterio exclusion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":41,"pinY":67},{"text":"Tamano muestral","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/salud-publica-parciales/sp12_sp12p2.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);
commit;
