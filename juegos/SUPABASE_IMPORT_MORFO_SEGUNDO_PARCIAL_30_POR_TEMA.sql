-- Importa todo el segundo parcial de Morfofuncion desde Saladin (capitulos 12 al 20).
-- Cada tema tiene 30 preguntas tipo juego; la app muestra 10 por intento.
-- Imagenes locales nuevas: juegos/assets/segundo-parcial-morfo/.
begin;
update public.evaluaciones set publicado = false, iniciado = false, updated_at = now() where codigo = 'RV15M';

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c', 'Capitulo 12 Morfofuncion - tejido nervioso', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar neuronas, neuroglia, potenciales de accion, sinapsis e integracion neuronal desde Saladin.', 'C12M2', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 12: tejido nervioso', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'bf18a943-1164-5fcc-a7bd-010eba5ea75c';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '1e47cf93-6e05-5b4e-a2fe-f1817d8b88b8',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La propiedad neuronal que permite responder a estimulos se llama:',
  '[{"text":"Excitabilidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Contractilidad","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Osmosis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Hemostasia","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '89be9cf4-9057-5889-ac1c-16603a2a076b',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La conductividad neuronal permite:',
  '[{"text":"Secretar bilis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Filtrar plasma","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Formar hueso","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Propagar senales electricas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '377f9f24-c0e4-5c7f-a9f7-a28b9ec84818',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'Una neurona aferente conduce informacion:',
  '[{"text":"Entre eritrocitos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Solo por venas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Desde receptores hacia el SNC","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Desde SNC a musculo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  'a3517791-1a0f-53db-a94a-f30a35a70fe3',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La estructura que recibe muchas senales entrantes es:',
  '[{"text":"Fibrina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Dendrita","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Axon terminal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Nodo de Ranvier","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '1675b007-2b0e-5b9c-ae2e-b5a4159fb529',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La mielina del SNC la producen:',
  '[{"text":"Oligodendrocitos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Celulas de Schwann","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Basofilos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Plaquetas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '13504c7b-5e3f-586c-aaa5-1551eae71bf1',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La mielina del SNP la producen:',
  '[{"text":"Astrocitos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Microglia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Ependimocitos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Celulas de Schwann","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '7039bbba-2eba-5202-ad55-b52f8ef31592',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'Los astrocitos ayudan especialmente a:',
  '[{"text":"Audicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Contraccion cardiaca","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Soporte y barrera hematoencefalica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Coagulacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '6b53fead-5954-54c5-a5ea-b9c41242aa7d',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La microglia cumple funcion de:',
  '[{"text":"Secrecion tiroidea","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Defensa fagocitica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Mielina periferica","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Transporte de oxigeno","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '98406f67-f76a-5d6a-a2bc-69e269e5ba15',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'El potencial de reposo neuronal tipico es cercano a:',
  '[{"text":"-70 mV","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"+70 mV","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"0 mV fijo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"-5 mV","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '916867a6-acf2-596f-a8cd-70c09a643d17',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La despolarizacion depende sobre todo de entrada de:',
  '[{"text":"K+","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Fibrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Hemoglobina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Na+","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'e9455bcf-2244-530a-ad3c-490c2e8e647f',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La repolarizacion depende sobre todo de salida de:',
  '[{"text":"Glucosa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Albumina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"K+","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Na+","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'f7f67fa3-68b4-5a45-ab90-9fa078e502e7',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La conduccion saltatoria salta entre:',
  '[{"text":"Ganglios linfaticos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Nodos de Ranvier","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Dendritas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Somatas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '7afcd6db-ad59-570f-ad15-58f0eb130940',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'En la terminal sinaptica se abren canales de:',
  '[{"text":"Ca2+","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Fe2+","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Urea","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Tiroxina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'e0ebbb84-2801-5108-a924-7192a238253b',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'Un EPSP hace mas probable el disparo porque:',
  '[{"text":"Hiperpolariza siempre","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Destruye mielina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Forma plaquetas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Despolariza la membrana postsinaptica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '12156086-fece-5057-acc3-2255a0989b7b',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'Un IPSP reduce el disparo porque:',
  '[{"text":"Forma LCR","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Contrae musculo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Hiperpolariza o estabiliza la membrana","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Abre siempre sodio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'ee101a4f-a180-5c4b-a231-9ddbfdec163b',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La recaptacion sirve para:',
  '[{"text":"Abrir pupila","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Terminar la senal sinaptica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Duplicar DNA","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Aumentar hematocrito","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '1b857139-2b91-53d4-ad9e-2af46ab1bfc2',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'La barrera hematoencefalica limita:',
  '[{"text":"Paso de sustancias desde sangre a encefalo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Salida de bilis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Entrada de aire","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Cierre valvular","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '3b9aa2f6-9e9b-574e-a2f2-eee842a693bd',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'mc',
  'Los neuromoduladores suelen tener accion:',
  '[{"text":"Solo mecanica","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Coagulante","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Fotoreceptora","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Mas prolongada y moduladora","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'fa272e69-d803-5202-a65f-24241e7fb452',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'ms',
  'Selecciona propiedades universales neuronales.',
  '[{"text":"Excitabilidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Conductividad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Secrecion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Osteogenesis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'bcd27b19-ba44-539b-aeee-f648a509da45',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'ms',
  'Selecciona glia del SNC.',
  '[{"text":"Astrocitos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Oligodendrocitos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Microglia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Ependimocitos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Celulas de Schwann","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'cfbd9874-008f-5fea-a412-204617f5530e',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'ms',
  'Selecciona mecanismos que terminan una senal sinaptica.',
  '[{"text":"Difusion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Recaptacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Degradacion enzimatica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Osificacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'a65033c8-a38f-5381-ac31-5b9baea363ba',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'ms',
  'Selecciona factores que aceleran conduccion.',
  '[{"text":"Mayor diametro","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Mielina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Conduccion saltatoria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Menor temperatura extrema","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'd80bcfc5-f3bc-52ec-adf3-4fddec6f3e08',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'ms',
  'Selecciona elementos de sinapsis quimica.',
  '[{"text":"Terminal presinaptica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Hendidura","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Receptor postsinaptico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Neurotransmisor","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Disco articular","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '21337a9b-dcec-5883-aa11-e721b969e320',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'ms',
  'Selecciona procesos de integracion neuronal.',
  '[{"text":"EPSP","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"IPSP","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Sumacion temporal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Sumacion espacial","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"},{"text":"Eritropoyesis","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '7f3ebe08-e7fb-5232-a13b-e8c0cafcec51',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'dnd',
  'Relaciona partes de la neurona.',
  '[{"text":"Dendritas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":15,"pinY":39},{"text":"Soma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":30,"pinY":48},{"text":"Axon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":46,"pinY":48},{"text":"Mielina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":61,"pinY":42},{"text":"Nodo Ranvier","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":76,"pinY":48},{"text":"Terminal","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":88,"pinY":39}]'::jsonb,
  false, 24, 1, 75
),
(
  '2749938a-3c76-50db-ac38-89715baa62ab',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'dnd',
  'Relaciona neuroglia y conduccion.',
  '[{"text":"Astrocito","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":23,"pinY":74},{"text":"Oligodendrocito","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":50,"pinY":74},{"text":"Microglia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":76,"pinY":74},{"text":"Mielina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":61,"pinY":42},{"text":"Nodo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":76,"pinY":48}]'::jsonb,
  false, 25, 1, 75
),
(
  '5c5010a7-348a-5a84-ace9-38a7cf0f9cee',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'dnd',
  'Ubica elementos sinapticos.',
  '[{"text":"Axon","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":46,"pinY":48},{"text":"Terminal sinaptica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":88,"pinY":39},{"text":"Hendidura","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":83,"pinY":44},{"text":"Receptor postsinaptico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":78,"pinY":50}]'::jsonb,
  false, 26, 1, 75
),
(
  '03f1f69a-525d-5304-ad0f-542cb0e70947',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'dnd',
  'Relaciona zonas funcionales.',
  '[{"text":"Zona receptora","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":15,"pinY":39},{"text":"Zona integradora","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":30,"pinY":48},{"text":"Zona conductora","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":46,"pinY":48},{"text":"Zona secretora","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":88,"pinY":39}]'::jsonb,
  false, 27, 1, 75
),
(
  '22ae3c2c-eb23-5bd2-a10d-a94a0a76c4bc',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'dnd',
  'Relaciona soporte celular.',
  '[{"text":"Astrocito: soporte","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":23,"pinY":74},{"text":"Oligodendrocito: SNC","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":50,"pinY":74},{"text":"Microglia: defensa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":76,"pinY":74},{"text":"Nodo: salto","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":76,"pinY":48}]'::jsonb,
  false, 28, 1, 75
),
(
  '41747f8c-1505-5ad1-a7d2-9e51d3ac996a',
  'bf18a943-1164-5fcc-a7bd-010eba5ea75c',
  'dnd',
  'Relaciona estructuras del impulso.',
  '[{"text":"Dendrita","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":15,"pinY":39},{"text":"Soma","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":30,"pinY":48},{"text":"Axon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":46,"pinY":48},{"text":"Mielina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":61,"pinY":42},{"text":"Terminal","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap12_tejido_nervioso.svg","pinX":88,"pinY":39}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01', 'Capitulo 13 Morfofuncion - medula y reflejos', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar medula espinal, nervios raquideos, plexos, vias y reflejos somaticos desde Saladin.', 'CAP13M', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 13: medula espinal, nervios raquideos y reflejos somaticos', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '132d4d35-4a39-4dfc-8b87-5e9f30d13f01';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '6b800577-ae52-5919-a4eb-f5649f4ab684',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La medula espinal funciona como:',
  '[{"text":"Via de conduccion y centro reflejo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Glandula endocrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Filtro de plasma","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Organo auditivo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  false, 0, 1, 45
),
(
  'f6f7c798-59cc-56ba-a142-3a3fa261a2f9',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'El ganglio de raiz posterior contiene:',
  '[{"text":"Motoneuronas anteriores","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Eritrocitos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Celulas tiroideas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Somatas sensitivos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  false, 1, 1, 45
),
(
  'd34b0599-c9da-5df4-a2b9-bd77c5a03f05',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La raiz anterior conduce fibras:',
  '[{"text":"Linfaticas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Endocrinas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Motoras eferentes","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Sensitivas aferentes","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}]'::jsonb,
  false, 2, 1, 45
),
(
  'c219cc95-f3e9-53db-a288-d64ba67e8220',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La sustancia gris medular forma:',
  '[{"text":"Valvulas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Astas posteriores, laterales y anteriores","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Foliculos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Alveolos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  false, 3, 1, 45
),
(
  'c63f4688-0d1e-57ed-afd7-efb05bac6ede',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La sustancia blanca medular contiene:',
  '[{"text":"Fasciculos ascendentes y descendentes","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Cartilago","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Plaquetas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Cristalino","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  false, 4, 1, 45
),
(
  '46f5c2ab-baba-5ff3-a5e0-50398fe9e85d',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'Los fasciculos gracil y cuneiforme son vias:',
  '[{"text":"Descendentes puras","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Endocrinas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Digestivas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Ascendentes sensitivas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  false, 5, 1, 45
),
(
  'fc2b6268-e1b0-502d-a0c5-6dd3cef5037a',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'El plexo braquial se forma por:',
  '[{"text":"T2 a T12","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"S4 a Co1","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"C5 a T1","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"C1 a C4","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  false, 6, 1, 45
),
(
  '81c8cce1-e2c7-5cbb-aacf-a807790e7a3a',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'Los nervios intercostales son:',
  '[{"text":"Ramos cervicales","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Ramos anteriores toracicos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Pares craneales","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Plexo sacro","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  false, 7, 1, 45
),
(
  '68201d0f-919c-5813-a02c-628a23190e3c',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'Un dermatoma es:',
  '[{"text":"Area cutanea de un nervio raquideo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Tunica vascular","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Ventriculo cerebral","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Hormona","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  false, 8, 1, 45
),
(
  '0cccacf7-eff4-5892-a0ef-2e42f62e0ce3',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'El arco reflejo requiere:',
  '[{"text":"Solo sangre","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Solo arteria","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Solo retina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Receptor, aferente, centro, eferente y efector","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  false, 9, 1, 45
),
(
  '8e091d7f-9ae4-5b37-a655-74348eb4f59a',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'El huso muscular detecta:',
  '[{"text":"Glucosa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Olor","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Estiramiento muscular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Presion arterial","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  false, 10, 1, 45
),
(
  'ecbcb54c-02bf-5ede-aa79-30b8f1edd1e9',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'El reflejo rotuliano produce:',
  '[{"text":"Midriasis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Contraccion del musculo estirado","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Relajacion total","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Secrecion biliar","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  false, 11, 1, 45
),
(
  '58b9d7d1-96e6-5ed8-a937-5a4d9b35f1ad',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La inhibicion reciproca relaja:',
  '[{"text":"Musculos antagonistas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Raiz dorsal","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Periostio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Receptor","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  false, 12, 1, 45
),
(
  '01d5da85-edf1-5ef8-ac7b-ca201ad4b900',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'El reflejo flexor sirve para:',
  '[{"text":"Aumentar tiroxina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Elevar hematocrito","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Abrir valvulas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Retirar una parte del dano","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  false, 13, 1, 45
),
(
  '1415fe9b-adfe-588a-a4b2-3066701248db',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La extension cruzada ayuda a:',
  '[{"text":"Producir LCR","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Ver colores","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Mantener equilibrio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Formar anticuerpos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  false, 14, 1, 45
),
(
  '6bb2726f-ac32-5e26-ae27-59f6968ff1c6',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'La poliomielitis afecta especialmente:',
  '[{"text":"Osteoclastos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Motoneuronas somaticas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Celulas beta","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Eritrocitos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}]'::jsonb,
  false, 15, 1, 45
),
(
  'c73c0af1-2afc-56d5-a91e-740578f2f0ed',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'El zoster se relaciona con virus en:',
  '[{"text":"Ganglios sensitivos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Foliculos tiroideos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Valvulas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Capilares","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}]'::jsonb,
  false, 16, 1, 45
),
(
  '93e58af5-e850-56cf-a07f-61b460d5a32f',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'mc',
  'Una lesion medular puede interrumpir:',
  '[{"text":"Solo digestion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Solo vision","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Solo coagulos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Vias sensitivas y motoras","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  false, 17, 1, 45
),
(
  '64f14738-d43d-5943-ae69-9af2145572a8',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona meninges medulares.',
  '[{"text":"Duramadre","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Aracnoides","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Piamadre","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Endocardio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  true, 18, 1, 60
),
(
  '824234c6-4d93-5a0c-a77c-0772c49338f1',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona componentes del nervio raquideo.',
  '[{"text":"Raiz posterior","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Raiz anterior","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Ganglio posterior","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Ramo anterior","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"},{"text":"Conducto auditivo","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png"}]'::jsonb,
  true, 19, 1, 60
),
(
  '4bd2fbe7-ecc4-5e7a-a776-d0c22fa89f11',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona plexos nerviosos.',
  '[{"text":"Cervical","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Braquial","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Lumbar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Sacro","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Pulmonar como principal raquideo","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  true, 20, 1, 60
),
(
  '2737453f-e103-5a7d-a76b-71533527a9e9',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona reflejos somaticos.',
  '[{"text":"Miotatico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Flexor","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Extension cruzada","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Osteotendinoso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"},{"text":"Barorreceptor visceral","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png"}]'::jsonb,
  true, 21, 1, 60
),
(
  'c7ca29ce-63a9-5d65-a130-57e2c957f6d9',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona sensibilidad de vias ascendentes.',
  '[{"text":"Tacto fino","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Propiocepcion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Dolor","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Temperatura","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Insulina","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  true, 22, 1, 60
),
(
  '9ae91e5c-ad6c-5f10-a852-0d063bba7736',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'ms',
  'Selecciona funciones descendentes.',
  '[{"text":"Control motor voluntario","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Modulacion motora","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Influencia en motoneuronas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"},{"text":"Plasma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png"}]'::jsonb,
  true, 23, 1, 60
),
(
  '14bc6d34-7b8c-50ee-ac8d-bb4d3591cc5f',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona raices y ramas.',
  '[{"text":"Raiz posterior","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":28,"pinY":37},{"text":"Ganglio posterior","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":76,"pinY":50},{"text":"Raiz anterior","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":44,"pinY":60},{"text":"Rama anterior","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":84,"pinY":62},{"text":"Rama posterior","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":19,"pinY":44}]'::jsonb,
  false, 24, 1, 75
),
(
  '5c92095f-089a-5b96-a9e3-e1134322ae89',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona plexos.',
  '[{"text":"Cervical","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":38,"pinY":14},{"text":"Braquial","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":34,"pinY":23},{"text":"Intercostales","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":42,"pinY":42},{"text":"Lumbar","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":48,"pinY":62},{"text":"Sacro","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":53,"pinY":82},{"text":"Coccigeo","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":51,"pinY":92}]'::jsonb,
  false, 25, 1, 75
),
(
  'e441b76a-084d-5f01-a958-f202e93d54d4',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona corte de nervio.',
  '[{"text":"Radiculas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png","pinX":23,"pinY":16},{"text":"Raiz posterior","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png","pinX":12,"pinY":22},{"text":"Ganglio posterior","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png","pinX":17,"pinY":31},{"text":"Raiz anterior","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png","pinX":14,"pinY":41},{"text":"Nervio raquideo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png","pinX":11,"pinY":50},{"text":"Fasciculo","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_raquideo_fasciculos.png","pinX":40,"pinY":82}]'::jsonb,
  false, 26, 1, 75
),
(
  '79e54e4c-df3e-5012-a7c8-8fafe179dd28',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona rangos de plexos.',
  '[{"text":"Cervical C1-C5","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":38,"pinY":14},{"text":"Braquial C5-T1","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":34,"pinY":23},{"text":"Lumbar L1-L4","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":48,"pinY":62},{"text":"Sacro L4-S4","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":53,"pinY":82},{"text":"Coccigeo S4-Co1","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_medula_plexos_dorso.png","pinX":51,"pinY":92}]'::jsonb,
  false, 27, 1, 75
),
(
  '9a9a7845-bef3-5467-a906-e4c5a370bd5c',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona nervio espinal.',
  '[{"text":"Medula","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png","pinX":52,"pinY":9},{"text":"Raiz posterior","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png","pinX":68,"pinY":26},{"text":"Ganglio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png","pinX":82,"pinY":34},{"text":"Ramo anterior","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png","pinX":73,"pinY":53},{"text":"Ramo posterior","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_nervio_espinal_vista_anterolateral.png","pinX":78,"pinY":72}]'::jsonb,
  false, 28, 1, 75
),
(
  '8fb29891-40c6-5ff9-a8f1-7402caefc56b',
  '132d4d35-4a39-4dfc-8b87-5e9f30d13f01',
  'dnd',
  'Relaciona arco reflejo.',
  '[{"text":"Receptor","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":28,"pinY":37},{"text":"Via aferente","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":76,"pinY":50},{"text":"Centro medular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":44,"pinY":60},{"text":"Via eferente","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":84,"pinY":62},{"text":"Efector","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo13-morfo/cap13_raices_ramas_corte_transversal.png","pinX":19,"pinY":44}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'e861bbdc-c7a2-e11e-5797-1ccd25784835', 'Capitulo 14 Morfofuncion - encefalo y pares craneales', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar organizacion encefalica, LCR, tallo, cerebelo, funciones corticales y pares craneales desde Saladin.', 'PC14M', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 14: encefalo y pares craneales', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'e861bbdc-c7a2-e11e-5797-1ccd25784835';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'b8b88c47-2898-5386-a69b-2f0eaef0ae12',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El encefalo incluye:',
  '[{"text":"Cerebro, diencefalo, tallo y cerebelo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Pulmon y pleura","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Plasma y eritrocitos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Epidermis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 0, 1, 45
),
(
  '72ecea14-fb80-5c01-a0d9-3f36c0e9182c',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'La materia gris contiene:',
  '[{"text":"Solo axones mielinizados","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Solo sangre","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Matriz osea","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Somatas, dendritas y sinapsis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 1, 1, 45
),
(
  '16ddbd82-f266-5bef-a7c2-5c75d207b6ea',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'La materia blanca contiene:',
  '[{"text":"Plaquetas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Huesecillos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Axones mielinizados","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Foliculos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 2, 1, 45
),
(
  'b7327aef-c4e6-5f33-a429-ab771c52d5cd',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El LCR circula por ventriculos y espacio:',
  '[{"text":"Peritoneal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Subaracnoideo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Pleural","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Sinovial","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 3, 1, 45
),
(
  'f4831260-a9bf-54ae-a705-d2c76ee5dadb',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'La hidrocefalia implica:',
  '[{"text":"Acumulacion anormal de LCR","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Anemia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Trombosis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Catarata","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 4, 1, 45
),
(
  'f19872c6-42c6-54fb-a7a4-2b6a767e7e27',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El bulbo raquideo contiene centros:',
  '[{"text":"Visuales de color","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Pancreaticos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Oseos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Cardiorrespiratorios","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 5, 1, 45
),
(
  'ffbdf38f-a4c5-5fa0-a6a2-5ba2ce7151a4',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El cerebelo coordina:',
  '[{"text":"Inmunidad","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Filtracion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Precision del movimiento","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Coagulacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 6, 1, 45
),
(
  '9eef71c8-31e3-5458-a865-fff109b297e2',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El talamo es:',
  '[{"text":"Bomba venosa","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Relevo sensitivo hacia corteza","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Valvula","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Glandula exocrina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 7, 1, 45
),
(
  'ea77f550-8cae-5bf2-a668-0ae10ae588f2',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El hipotalamo regula:',
  '[{"text":"Homeostasis y control autonomo/endocrino","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Osificacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Audicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Hemostasia","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 8, 1, 45
),
(
  '21a7779d-6bda-58dd-ae9f-bc85ee1212b8',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El sistema limbico participa en:',
  '[{"text":"Intercambio capilar","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Sistole","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Eritropoyesis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Emocion y memoria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 9, 1, 45
),
(
  '2791d566-54b4-563c-adaa-9951dfe1ef20',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'La formacion reticular participa en:',
  '[{"text":"Ventilacion mecanica","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Tiroxina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Alerta y filtrado","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Fibrina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 10, 1, 45
),
(
  '8f78dddb-55cc-5e68-a0c5-42ad8f4ea67e',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El area de Broca se asocia con:',
  '[{"text":"Gasto cardiaco","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Produccion del habla","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Coagulacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Olfato","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 11, 1, 45
),
(
  'ff9ffca0-d454-55ad-a61b-de727182b299',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El area de Wernicke se asocia con:',
  '[{"text":"Comprension del lenguaje","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Secrecion biliar","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Vision nocturna","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Retorno venoso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  false, 12, 1, 45
),
(
  'ea0f905c-0943-5ebb-a934-9dfdd72330c9',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El trigemino es el par:',
  '[{"text":"I","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"VII","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"XII","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"V","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"}]'::jsonb,
  false, 13, 1, 45
),
(
  'b9c26079-6852-5ab7-a2fb-3f576b6a7e0d',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El facial es el par:',
  '[{"text":"V","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png"},{"text":"XI","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png"},{"text":"VII","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png"},{"text":"II","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png"}]'::jsonb,
  false, 14, 1, 45
),
(
  '06c35735-2cc5-5cbe-a8c8-b5d0460fc914',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El vago es el par:',
  '[{"text":"XII","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"X","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"III","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"VIII","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"}]'::jsonb,
  false, 15, 1, 45
),
(
  '78e6b2fa-4427-599c-a262-7be53d3342d7',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El vestibulococlear se asocia con:',
  '[{"text":"Audicion y equilibrio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png"},{"text":"Olfato","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png"},{"text":"Lengua","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png"},{"text":"Masticacion pura","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png"}]'::jsonb,
  false, 16, 1, 45
),
(
  'd77e8082-0698-55f3-aa61-176d46f2486d',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'mc',
  'El hipogloso controla:',
  '[{"text":"Audicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png"},{"text":"Olfato","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png"},{"text":"Vision","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png"},{"text":"Movimientos de lengua","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png"}]'::jsonb,
  false, 17, 1, 45
),
(
  'e9e4f9a2-649d-5a63-a24e-b7ffc991c7f9',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Selecciona partes del tallo encefalico.',
  '[{"text":"Mesencefalo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Protuberancia","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Bulbo raquideo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Hipofisis anterior","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  true, 18, 1, 60
),
(
  'e9b7fc49-697b-5d85-a815-c43ea31dc395',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Selecciona funciones integradoras.',
  '[{"text":"Sueno","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Cognicion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Memoria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Lenguaje","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Hemostasia","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  true, 19, 1, 60
),
(
  'cf384f57-ada9-5ecc-adee-c5caa37a68fc',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Selecciona pares sensitivos principales.',
  '[{"text":"I olfatorio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"II optico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"VIII vestibulococlear","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"XI accesorio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  true, 20, 1, 60
),
(
  'c97b115b-adb6-5933-a2ae-fb7bce1c0e97',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Selecciona pares con parasimpatico.',
  '[{"text":"III","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"VII","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"IX","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"X","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"XII","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  true, 21, 1, 60
),
(
  '79e87b22-0152-5606-a637-cac0f1626b51',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Selecciona divisiones del trigemino.',
  '[{"text":"V1 oftalmica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"V2 maxilar","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"V3 mandibular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"},{"text":"V4 vagal","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png"}]'::jsonb,
  true, 22, 1, 60
),
(
  '53fc9c98-1ecc-5b4c-ad78-4fd2674a1ad2',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'ms',
  'Selecciona meninges craneales.',
  '[{"text":"Duramadre","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Aracnoides","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Piamadre","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"},{"text":"Pericardio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png"}]'::jsonb,
  true, 23, 1, 60
),
(
  'cc66f548-177b-5af5-a8d2-37eb8b317dd8',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona pares craneales.',
  '[{"text":"I olfatorio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":45,"pinY":17},{"text":"II optico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":47,"pinY":30},{"text":"III oculomotor","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":53,"pinY":39},{"text":"V trigemino","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":53,"pinY":51},{"text":"VII facial","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":54,"pinY":61},{"text":"X vago","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":55,"pinY":75},{"text":"XII hipogloso","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_pares_craneales_base.png","pinX":56,"pinY":82}]'::jsonb,
  false, 24, 1, 75
),
(
  'c88a63f2-7636-5522-a8e9-ef9b4f038ca9',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona trigemino.',
  '[{"text":"V1 oftalmica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":70,"pinY":22},{"text":"V2 maxilar","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":70,"pinY":31},{"text":"V3 mandibular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":70,"pinY":41},{"text":"Ganglio trigemino","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":60,"pinY":20},{"text":"Ramas motoras","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_trigemino.png","pinX":67,"pinY":72}]'::jsonb,
  false, 25, 1, 75
),
(
  'c65bec6d-4201-5d14-a56e-4995aeee5138',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona facial.',
  '[{"text":"Temporal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":59,"pinY":72},{"text":"Cigomatico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":58,"pinY":77},{"text":"Bucal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":56,"pinY":83},{"text":"Mandibular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":58,"pinY":89},{"text":"Cervical","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_facial.png","pinX":60,"pinY":94}]'::jsonb,
  false, 26, 1, 75
),
(
  '35b1bbc2-d285-57c2-a5af-e0c8a17b63a3',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona vago.',
  '[{"text":"Agujero yugular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":67,"pinY":22},{"text":"Laringeo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":69,"pinY":36},{"text":"Corazon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":57,"pinY":56},{"text":"Estomago","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":49,"pinY":78},{"text":"Intestino","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png","pinX":72,"pinY":86}]'::jsonb,
  false, 27, 1, 75
),
(
  'a41205e7-3fa9-5428-acfa-f6b861fb1e1f',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona accesorio e hipogloso.',
  '[{"text":"Accesorio XI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":61,"pinY":22},{"text":"ECM","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":64,"pinY":36},{"text":"Trapecio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":64,"pinY":44},{"text":"Canal hipogloso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":54,"pinY":78},{"text":"Hipogloso XII","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_accesorio_hipogloso.png","pinX":55,"pinY":92}]'::jsonb,
  false, 28, 1, 75
),
(
  '04202e05-9da0-5757-a636-87a77fd477c0',
  'e861bbdc-c7a2-e11e-5797-1ccd25784835',
  'dnd',
  'Relaciona audicion y deglucion.',
  '[{"text":"VIII","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":78,"pinY":26},{"text":"Coclea","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":75,"pinY":38},{"text":"Vestibulo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":75,"pinY":43},{"text":"IX","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":82,"pinY":77},{"text":"Seno carotideo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_auditivo_glosofaringeo.png","pinX":83,"pinY":91}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '4a2549a4-e070-34c8-2513-5cdada997302', 'Capitulo 15 Morfofuncion - SNA y reflejos viscerales', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar division simpatica, parasimpatica, sistema enterico, neurotransmisores, receptores y reflejos viscerales desde Saladin.', 'SNA15M', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 15: sistema nervioso autonomo y reflejos viscerales', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '4a2549a4-e070-34c8-2513-5cdada997302';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'ca6e1887-0d1e-5e20-a5f7-7869d33d5016',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'Una via eferente autonoma tipica usa:',
  '[{"text":"Dos neuronas y un ganglio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Una motoneurona","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Solo glia","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Solo aferente","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  false, 0, 1, 45
),
(
  'f523f0c5-bb89-570f-a7dd-0850b159a762',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La division simpatica es:',
  '[{"text":"Craneosacra","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Somatica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Retiniana","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Toracolumbar","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"}]'::jsonb,
  false, 1, 1, 45
),
(
  '4949eef5-00c2-52c3-a88e-96f1f317857a',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La division parasimpatica es:',
  '[{"text":"Intercostal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Endocrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Craneosacra","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Toracolumbar","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"}]'::jsonb,
  false, 2, 1, 45
),
(
  'bbfe0a00-9075-50ec-aff9-1198fddd1067',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'El sistema enterico esta en:',
  '[{"text":"Ventriculos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Pared del tubo digestivo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Corteza visual","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Medula osea","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  false, 3, 1, 45
),
(
  '3c9ac39e-5f07-550a-abc0-7a49a3c3b9ea',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La medula suprarrenal es como:',
  '[{"text":"Ganglio simpatico modificado","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Ganglio parasimpatico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Nervio sensitivo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Valvula","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"}]'::jsonb,
  false, 4, 1, 45
),
(
  '1065762e-c145-530f-a36b-94393f14b9e0',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La preganglionar autonoma libera:',
  '[{"text":"Hemoglobina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Fibrina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Melatonina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Acetilcolina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"}]'::jsonb,
  false, 5, 1, 45
),
(
  'c644bdcd-1e5d-5d57-a2c4-1de881fc0859',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La posganglionar simpatica comun libera:',
  '[{"text":"Tiroxina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Fibrinogeno","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Norepinefrina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"},{"text":"Insulina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png"}]'::jsonb,
  false, 6, 1, 45
),
(
  '652bc179-451e-5af3-aa30-6381b9aa2286',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'Inervacion dual significa:',
  '[{"text":"Dos capas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Fibras simpaticas y parasimpaticas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Dos arterias","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Dos eritrocitos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  false, 7, 1, 45
),
(
  '9cf852f6-faa8-5e0f-acc9-58b2ee6b46a7',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'Un efecto simpatico esperado es:',
  '[{"text":"Aumentar frecuencia cardiaca","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Aumentar digestion fuerte","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Constrenir pupila","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Liberar insulina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"}]'::jsonb,
  false, 8, 1, 45
),
(
  'cfda7916-27fc-55f2-a5f0-c9d89257bbaf',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'Un efecto parasimpatico esperado es:',
  '[{"text":"Broncodilatar por lucha","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Vasoconstriccion cutanea","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Adrenalina maxima","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Aumentar actividad digestiva","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"}]'::jsonb,
  false, 9, 1, 45
),
(
  '512edbd5-42d3-5147-a525-9b92556fa4b2',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'El barorreflejo responde a:',
  '[{"text":"Longitud osea","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Melanina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Presion arterial","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Color","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"}]'::jsonb,
  false, 10, 1, 45
),
(
  '8ab61bd6-940c-53d1-a57d-83a206c720a6',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'Muchos reflejos cardiovasculares integran en:',
  '[{"text":"Tiroides","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Bulbo raquideo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Cartilago","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Rinon","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"}]'::jsonb,
  false, 11, 1, 45
),
(
  '28c6c2f6-31cd-5e34-a82a-89b5b6e55d4a',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'El vago es parasimpatico importante porque:',
  '[{"text":"Inerva visceras toracicas y abdominales","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"Mueve solo lengua","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"Conduce olfato","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"},{"text":"Inerva piel brazo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo14-pares-craneales/pc_vago.png"}]'::jsonb,
  false, 12, 1, 45
),
(
  'ab6ca87d-b74f-53d0-a327-cb9ab790a419',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'El tono vasomotor depende de:',
  '[{"text":"Nervio optico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png"},{"text":"Biceps","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png"},{"text":"Saliva","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png"},{"text":"Actividad simpatica vascular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_tono_vasomotor.png"}]'::jsonb,
  false, 13, 1, 45
),
(
  'd4daf6ee-f8c1-5e2f-ad17-e0143354edc0',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La pupila se dilata por predominio:',
  '[{"text":"Somatico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png"},{"text":"Tiroideo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png"},{"text":"Simpatico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png"},{"text":"Parasimpatico","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png"}]'::jsonb,
  false, 14, 1, 45
),
(
  '05e41352-dc77-51d0-a85f-85c7983cbb04',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'La pupila se constrine por predominio:',
  '[{"text":"Linfonodal","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png"},{"text":"Parasimpatico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png"},{"text":"Simpatico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png"},{"text":"Venoso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png"}]'::jsonb,
  false, 15, 1, 45
),
(
  'd445739c-ffdf-524b-ad34-de6b43ee8bce',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'El control central autonomo depende de:',
  '[{"text":"Hipotalamo y tallo encefalico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Hueso","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Miocardio solo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Plasma","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  false, 16, 1, 45
),
(
  'dd4fbadc-e1e1-534d-ad17-fe4b4a4e54c0',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'mc',
  'Los reflejos viscerales actuan sobre:',
  '[{"text":"Solo musculo esqueletico","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Cartilago","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Epidermis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Musculo liso, cardiaco y glandulas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"}]'::jsonb,
  false, 17, 1, 45
),
(
  'dfd7477b-0473-54ec-ae53-16574324386f',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Selecciona componentes eferentes autonomos.',
  '[{"text":"Preganglionar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Ganglio autonomo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Posganglionar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Efector visceral","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Placa epifisaria","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  true, 18, 1, 60
),
(
  '2c963a23-27c0-505c-af67-d323f6b4b9a8',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Selecciona efectos simpaticos.',
  '[{"text":"Taquicardia","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Broncodilatacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Movilizacion energia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Menor digestion relativa","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"},{"text":"Miosis dominante","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png"}]'::jsonb,
  true, 19, 1, 60
),
(
  '20a73d6c-e695-521e-a282-d1c69600129f',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Selecciona efectos parasimpaticos.',
  '[{"text":"Menor frecuencia cardiaca","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Mayor motilidad digestiva","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Secrecion glandular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Constriccion pupilar","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"},{"text":"Adrenalina maxima","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png"}]'::jsonb,
  true, 20, 1, 60
),
(
  'bcc12d09-8e85-5dff-a151-417c9bc78e3b',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Selecciona transmisores/receptores autonomos.',
  '[{"text":"Acetilcolina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Norepinefrina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Nicotinicos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Muscarinicos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Hemoglobina","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  true, 21, 1, 60
),
(
  '42323b79-6c9a-565d-a136-bcf10fc61692',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Selecciona elementos del barorreflejo.',
  '[{"text":"Barorreceptores","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Aferente","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Centro bulbar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Eferente","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Corazon y vasos","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"},{"text":"Retina efector","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png"}]'::jsonb,
  true, 22, 1, 60
),
(
  '8220ebd2-3bb2-5555-a701-4d0954baf9a2',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'ms',
  'Selecciona organos con control autonomo.',
  '[{"text":"Corazon","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Bronquios","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Tubo digestivo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Iris","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Vasos","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"},{"text":"Esmalte","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png"}]'::jsonb,
  true, 23, 1, 60
),
(
  'af90c8aa-1a62-5417-aba0-20a9b3711bb4',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona ruta autonoma.',
  '[{"text":"Somatico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":17,"pinY":18},{"text":"Efector somatico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":88,"pinY":20},{"text":"Autonomo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":17,"pinY":58},{"text":"Ganglio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":52,"pinY":73},{"text":"Efector visceral","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_rutas_eferentes.png","pinX":88,"pinY":65}]'::jsonb,
  false, 24, 1, 75
),
(
  '64d6a63f-ed3b-5465-a244-40e6046c60f1',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona simpatico.',
  '[{"text":"Ojo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":76,"pinY":12},{"text":"Corazon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":72,"pinY":36},{"text":"Pulmon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":75,"pinY":49},{"text":"Higado","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":75,"pinY":58},{"text":"Intestino","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":76,"pinY":74},{"text":"Suprarrenal","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_simpatico_general.png","pinX":75,"pinY":82}]'::jsonb,
  false, 25, 1, 75
),
(
  'b770a5d8-210c-5a8a-a15c-83acc3d91e8b',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona parasimpatico.',
  '[{"text":"Ojo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":76,"pinY":14},{"text":"Corazon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":72,"pinY":35},{"text":"Pulmones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":73,"pinY":44},{"text":"Estomago","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":75,"pinY":55},{"text":"Colon","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":76,"pinY":72},{"text":"Vejiga","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_parasimpatico_general.png","pinX":70,"pinY":91}]'::jsonb,
  false, 26, 1, 75
),
(
  'bf170465-0b9a-5c2d-a1ab-aea77315c940',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona barorreflejo.',
  '[{"text":"Barorreceptores","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":68,"pinY":39},{"text":"Aferente","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":61,"pinY":29},{"text":"Centro bulbar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":40,"pinY":21},{"text":"Eferente vagal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":19,"pinY":48},{"text":"Corazon","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-reflejos-viscerales/rv_reflejo_barorreceptor.png","pinX":47,"pinY":68}]'::jsonb,
  false, 27, 1, 75
),
(
  '62688d43-4acb-5c3e-aa8f-afb4de3833ba',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona neurotransmisores.',
  '[{"text":"ACh","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":31,"pinY":16},{"text":"Nicotinico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":57,"pinY":13},{"text":"NE","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":71,"pinY":54},{"text":"Adrenergico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":82,"pinY":61},{"text":"Muscarinico","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_neurotransmisores.png","pinX":82,"pinY":91}]'::jsonb,
  false, 28, 1, 75
),
(
  '3eb5cc10-95a0-54ce-ad42-82d965937cf0',
  '4a2549a4-e070-34c8-2513-5cdada997302',
  'dnd',
  'Relaciona iris autonomo.',
  '[{"text":"Simpatico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":70,"pinY":24},{"text":"Parasimpatico III","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":67,"pinY":13},{"text":"Ganglio ciliar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":70,"pinY":38},{"text":"Pupila dilatada","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":32,"pinY":91},{"text":"Pupila constrenida","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/capitulo15-sistema-nervioso-autonomo/sna_iris_dual.png","pinX":80,"pinY":91}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8', 'Capitulo 16 Morfofuncion - organos de los sentidos', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar receptores, sentidos generales, gusto, olfato, audicion, equilibrio y vision desde Saladin.', 'OS16M', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 16: organos de los sentidos', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '109610d8-37f5-5202-a1be-8f69763e6844',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'La transduccion sensitiva es:',
  '[{"text":"Conversion de estimulo en senal electrica","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Coagulacion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Secrecion biliar","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Sistole","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'd88b2eab-e92c-5ec5-ae46-9174d85f656b',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Un receptor tonico:',
  '[{"text":"Se adapta de inmediato","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Libera esteroides","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Forma mielina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Responde de manera sostenida","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'c76a5c92-db9c-5e25-a7f7-3c53f7374795',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Un receptor fasico:',
  '[{"text":"Produce LCR","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Forma trombos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Se adapta rapido a estimulos constantes","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"No se adapta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '16088cfd-2b49-50d4-aa5e-ce587ce3e895',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Terminaciones libres detectan:',
  '[{"text":"Calcio","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Dolor y temperatura","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Color","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Presion arterial","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '47601079-f902-5779-a96e-2f1ac06116a5',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Corpusculos de Pacini detectan:',
  '[{"text":"Presion profunda y vibracion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Olor","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Glucosa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Tiroxina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '221f28cf-6e40-5c76-a824-a77e922f610b',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Botones gustativos son:',
  '[{"text":"Fotorreceptores","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Plaquetas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Valvulas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Quimiorreceptores del gusto","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '22f22c82-2ebc-5608-a216-8f551b76b396',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Epitelio olfatorio detecta:',
  '[{"text":"Sonido","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Calcio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Sustancias odorantes","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Presion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'f2797e70-adb7-5148-a510-9620d6f38fa3',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Membrana timpanica vibra hacia:',
  '[{"text":"Hipofisis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Huesecillos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Retina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Cristalino","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '158aefcd-3d7f-592d-ae61-f101d983c218',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'El estribo transmite a:',
  '[{"text":"Ventana oval","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Pupila","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Mitral","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Arteriola","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '91f0edc3-5ca2-50f6-a74d-baeb3049969d',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'La coclea participa en:',
  '[{"text":"Equilibrio estatico solo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Olfato","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Vision","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Audicion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'a8f5579c-428e-5286-ae80-158adecf85a5',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Conductos semicirculares detectan:',
  '[{"text":"Sabor","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Presion oncotica","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Aceleracion rotacional","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Color","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '2c90b814-6ddd-5d31-ac6d-350ddcc6f41e',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Utriculo y saculo detectan:',
  '[{"text":"TSH","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Equilibrio estatico y aceleracion lineal","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Coagulacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Gasto cardiaco","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'e860bfa7-6737-5f8a-a011-6ce6a5092c38',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'El cristalino sirve para:',
  '[{"text":"Enfocar imagen en retina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Producir LCR","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Formar plaquetas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Secretar bilis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '145c3f1c-f109-57d0-a2ef-267ab99ce6b9',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'En vision cercana el cristalino es:',
  '[{"text":"Mas plano","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Sin cambio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Opaco normal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Mas convexo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'ab8fc9b6-96ea-5a99-a610-59db4a0cce05',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Los bastones sirven para:',
  '[{"text":"Audicion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Olfato","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Baja iluminacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Color fino","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'c61037d5-bb6e-582a-a07e-32d912b13dd9',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'Los conos sirven para:',
  '[{"text":"Equilibrio","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Color y agudeza","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Dolor","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Vibracion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'bcc9dd51-fa5d-54af-a6bb-9d85d167fd4c',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'La retina envia por:',
  '[{"text":"Nervio optico","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Facial","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Vago","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Hipogloso","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '524a2f11-806f-5143-ad23-ac263495c92a',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'mc',
  'La catarata es:',
  '[{"text":"Anemia","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Meningitis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Cierre aortico","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Opacidad del cristalino","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'fa5e92c0-b225-5576-a6c1-b195e8ee9af3',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'ms',
  'Selecciona clases de receptores.',
  '[{"text":"Quimiorreceptores","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Fotorreceptores","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Mecanorreceptores","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Nociceptores","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Trombocitos","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'de9b9d4c-343c-5020-a67f-7779c6df8304',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'ms',
  'Selecciona sentidos especiales.',
  '[{"text":"Gusto","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Olfato","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Audicion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Equilibrio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Vision","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Hemostasia","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '295373b5-6989-59ff-aac8-29d42d6810d1',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'ms',
  'Selecciona huesecillos.',
  '[{"text":"Martillo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Yunque","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Estribo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Coclea","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'd9b55097-3217-5a3d-a79b-60a676028779',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'ms',
  'Selecciona estructuras visuales.',
  '[{"text":"Cristalino","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Retina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Bastones","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Conos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Trompa auditiva","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '858f18a8-95c1-52df-a3ba-f6f36f73c120',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'ms',
  'Selecciona equilibrio.',
  '[{"text":"Conductos semicirculares","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Utriculo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Saculo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Celulas pilosas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Fibrina","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'a8fc5bef-e9af-5f10-a399-6dac2abd01dc',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'ms',
  'Selecciona accesorios del ojo.',
  '[{"text":"Parpados","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Conjuntiva","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Aparato lagrimal","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Musculos extrinsecos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"},{"text":"Trombocitos","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  'eff063b1-f089-535a-a1e3-662fe2549abc',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'dnd',
  'Relaciona organos sensitivos.',
  '[{"text":"Receptor","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":13,"pinY":36},{"text":"Gusto","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":31,"pinY":36},{"text":"Olfato","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":50,"pinY":36},{"text":"Huesecillos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":70,"pinY":36},{"text":"Coclea","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":86,"pinY":36}]'::jsonb,
  false, 24, 1, 75
),
(
  '62d0b54d-180f-556e-a089-3ecbaaeeffe7',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'dnd',
  'Relaciona equilibrio y vision.',
  '[{"text":"Conductos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":23,"pinY":67},{"text":"Cristalino","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":43,"pinY":67},{"text":"Retina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":62,"pinY":67},{"text":"Nervio optico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":81,"pinY":67},{"text":"Coclea","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":86,"pinY":36}]'::jsonb,
  false, 25, 1, 75
),
(
  'fe8732f2-d467-5ede-a950-0a0d503d9e19',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'dnd',
  'Relaciona ruta auditiva.',
  '[{"text":"Timpano","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":62,"pinY":34},{"text":"Huesecillos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":70,"pinY":36},{"text":"Ventana oval","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":77,"pinY":39},{"text":"Coclea","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":86,"pinY":36},{"text":"Nervio VIII","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":86,"pinY":48}]'::jsonb,
  false, 26, 1, 75
),
(
  '5ff2ae39-7ec8-5f99-a1d0-e48ff160c608',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'dnd',
  'Relaciona vision.',
  '[{"text":"Cornea","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":36,"pinY":64},{"text":"Cristalino","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":43,"pinY":67},{"text":"Retina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":62,"pinY":67},{"text":"Nervio optico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":81,"pinY":67},{"text":"Fotorreceptores","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":62,"pinY":75}]'::jsonb,
  false, 27, 1, 75
),
(
  'd42d3321-e773-5208-a463-1a4fad4557ae',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'dnd',
  'Relaciona sentidos quimicos.',
  '[{"text":"Gusto","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":31,"pinY":36},{"text":"Papila","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":31,"pinY":44},{"text":"Olfato","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":50,"pinY":36},{"text":"Receptor olfatorio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":50,"pinY":44},{"text":"Via aferente","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":13,"pinY":36}]'::jsonb,
  false, 28, 1, 75
),
(
  '54da67b6-aa4c-5be5-a8c6-7c68e81c1072',
  'ffbb3e63-f63c-5b64-a68e-d0a2528d24b8',
  'dnd',
  'Relaciona receptores generales.',
  '[{"text":"Terminacion libre","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":13,"pinY":36},{"text":"Tactil","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":18,"pinY":47},{"text":"Laminar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":23,"pinY":58},{"text":"Propioceptor","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":28,"pinY":69},{"text":"Aferente","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap16_organos_sentidos.svg","pinX":33,"pinY":80}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25', 'Capitulo 17 Morfofuncion - sistema endocrino', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar glandulas endocrinas, hormonas, ejes hipofisarios, acciones hormonales y estres desde Saladin.', 'END17M', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 17: sistema endocrino', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '28106cbb-bf08-5de6-a5b7-8c2edc635a25';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'a51b3647-1b7f-59af-a38e-34dfdbffb2ae',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Una glandula endocrina secreta:',
  '[{"text":"Hormonas a intersticio y sangre","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Por conductos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Solo bilis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Solo LCR","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '8597698a-a4d6-55b5-a2f9-160b27f06bcd',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'El sistema endocrino suele ser:',
  '[{"text":"Instantaneo siempre","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Solo somatico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Sin receptores","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Mas lento y prolongado que nervioso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '58529ed3-2b1e-56c0-a960-22ac7cdf2510',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'El hipotalamo controla hipofisis por:',
  '[{"text":"Huesecillos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Capilares pulmonares","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Hormonas y vias nerviosas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Valvulas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '25f6e828-720a-567a-a823-54e46eb3e8c1',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'La neurohipofisis libera:',
  '[{"text":"T3","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"ADH y oxitocina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"TSH y ACTH","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Insulina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '415ac526-da9b-5d3a-aa4c-6a15a20c606c',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'La adenohipofisis produce:',
  '[{"text":"TSH, ACTH, FSH, LH, GH y prolactina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"ADH sola","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Calcitonina sola","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Adrenalina sola","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '0ac2fd0b-21fe-5c6e-a3d1-f5f1722fc8a7',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'T3/T4 aumentan:',
  '[{"text":"Coagulacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Audicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"LCR","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Metabolismo basal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '459ee7a4-022b-5132-a183-f56698c82fe2',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'La calcitonina tiende a:',
  '[{"text":"Elevar PA","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Contraer pupila","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Reducir calcio sanguineo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Aumentar glucosa","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '6023d123-63c5-5a4c-a39c-696e975038e8',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'La PTH tiende a:',
  '[{"text":"Conos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Aumentar calcio sanguineo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Bajar calcio siempre","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Plaquetas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '4a8645e6-6587-527b-ade1-09636232ae7b',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Corteza suprarrenal secreta:',
  '[{"text":"Corticosteroides","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Catecolaminas solo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Tiroxina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Melatonina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'fbbb666a-327c-5fa9-a314-5071f8fdd7ca',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Medula suprarrenal secreta:',
  '[{"text":"Insulina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"PTH","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"ADH","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Epinefrina y norepinefrina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '24634062-757d-5345-afc7-714bef7c3176',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Celulas beta secretan:',
  '[{"text":"Cortisol","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Tiroxina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Insulina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Glucagon","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '419ed4c2-7cb6-56ba-ab4d-3eb9d85af977',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Celulas alfa secretan:',
  '[{"text":"Oxitocina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Glucagon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Insulina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Calcitonina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'f2774324-7a97-55b4-a5cd-efa35d928b86',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Hormonas esteroideas actuan por:',
  '[{"text":"Receptores intracelulares","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Oido mecanico","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Fibrina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Hemoglobina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '919b6815-548c-52e8-ae49-21f94de42359',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Hormonas peptidicas actuan por:',
  '[{"text":"Sin receptor","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Eritrocitos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Coagulo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Receptores de membrana","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '9404b1ed-0f23-5bab-ad6c-4793a4301e3a',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'AMP ciclico es:',
  '[{"text":"Pigmento visual","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Valvula","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Segundo mensajero","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Proteina plasmatica","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '5f6ba73a-1a14-50f2-a701-e53f88692f60',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Regulacion a la baja causa:',
  '[{"text":"Bloqueo LCR","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Menor sensibilidad blanco","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Mas receptores siempre","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Mas eritrocitos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'd38fb9fe-a140-5852-a3e7-5ae58aaf7f52',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Permisividad hormonal es:',
  '[{"text":"Una hormona permite respuesta a otra","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Anulacion siempre","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Destruye receptor","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Sin blanco","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'db91a44a-e2b8-5fcf-af2d-beb928a29905',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'mc',
  'Estres prolongado involucra:',
  '[{"text":"Retina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Mitral","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Huesecillos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Eje hipotalamo-hipofisis-suprarrenal","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '39adab10-6a0c-5d71-a27f-dc028649aa0f',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'ms',
  'Selecciona glandulas endocrinas.',
  '[{"text":"Hipofisis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Tiroides","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Paratiroides","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Suprarrenales","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Pancreas","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Sudoripara como pura","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'b4077136-0108-58a3-a8c1-aaab9c59b18c',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'ms',
  'Selecciona adenohipofisis.',
  '[{"text":"TSH","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"ACTH","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"FSH","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"LH","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"GH","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Prolactina","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"ADH","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'b47e56a7-ca3b-5044-ae66-acca6b2f6b41',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'ms',
  'Selecciona neurohipofisis.',
  '[{"text":"ADH","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Oxitocina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"T3","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Cortisol","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '24a0c627-e393-58ff-aa96-9442190b231a',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'ms',
  'Selecciona pancreas endocrino.',
  '[{"text":"Insulina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Glucagon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Pepsina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Bilis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '68ee5c87-3751-5bc1-a19a-c23324ba2c4d',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'ms',
  'Selecciona clases hormonales.',
  '[{"text":"Esteroides","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Monoaminas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Peptidos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Eicosanoides","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Fibrina","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  'd728c96b-edf7-50ee-ac96-651c01088a45',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'ms',
  'Selecciona interacciones hormonales.',
  '[{"text":"Sinergismo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Permisividad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Antagonismo","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"},{"text":"Saltatoria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '35786a52-effd-512f-a34a-046eded31452',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'dnd',
  'Relaciona glandulas.',
  '[{"text":"Hipotalamo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":50,"pinY":25},{"text":"Hipofisis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":50,"pinY":38},{"text":"Tiroides","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":31,"pinY":47},{"text":"Paratiroides","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":69,"pinY":47},{"text":"Suprarrenal","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":23,"pinY":67},{"text":"Pancreas","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":41,"pinY":67},{"text":"Gonadas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":59,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '23e77f90-18d7-57e2-a035-4210d1c25cc6',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'dnd',
  'Relaciona eje hipofisario.',
  '[{"text":"Hipotalamo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":50,"pinY":25},{"text":"Hipofisis","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":50,"pinY":38},{"text":"Hormona trofica","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":50,"pinY":48},{"text":"Glandula","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":31,"pinY":47},{"text":"Celula blanco","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":77,"pinY":67}]'::jsonb,
  false, 25, 1, 75
),
(
  '094a03f5-7d67-5ba0-add9-aa5b31a58c41',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'dnd',
  'Relaciona pancreas.',
  '[{"text":"Pancreas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":41,"pinY":67},{"text":"Insulina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":47,"pinY":62},{"text":"Glucagon","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":47,"pinY":72},{"text":"Celula blanco","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":77,"pinY":67},{"text":"Glucosa","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":66,"pinY":57}]'::jsonb,
  false, 26, 1, 75
),
(
  'deb8767a-15e2-54af-a96e-8bacf9f3bfb5',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'dnd',
  'Relaciona suprarrenal.',
  '[{"text":"Suprarrenal","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":23,"pinY":67},{"text":"Corteza","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":23,"pinY":59},{"text":"Medula","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":23,"pinY":75},{"text":"ACTH","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":50,"pinY":38},{"text":"Estres","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":77,"pinY":67}]'::jsonb,
  false, 27, 1, 75
),
(
  '2f97336e-fd9f-5a05-a58c-6087bb9dfcc8',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'dnd',
  'Relaciona calcio.',
  '[{"text":"Tiroides","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":31,"pinY":47},{"text":"Calcitonina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":36,"pinY":54},{"text":"Paratiroides","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":69,"pinY":47},{"text":"PTH","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":69,"pinY":54},{"text":"Calcio","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":77,"pinY":67}]'::jsonb,
  false, 28, 1, 75
),
(
  '0130388b-7803-5a75-aea9-2cbd41259c6e',
  '28106cbb-bf08-5de6-a5b7-8c2edc635a25',
  'dnd',
  'Relaciona accion hormonal.',
  '[{"text":"Receptor membrana","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":77,"pinY":67},{"text":"Segundo mensajero","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":69,"pinY":58},{"text":"Receptor intracelular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":69,"pinY":76},{"text":"Enzima","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":59,"pinY":65},{"text":"Respuesta","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap17_sistema_endocrino.svg","pinX":77,"pinY":82}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  'a448765d-61bb-501a-a9ae-732c4e863af1', 'Capitulo 18 Morfofuncion - sangre', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar plasma, elementos formes, grupos sanguineos, leucocitos, trombocitos y hemostasia desde Saladin.', 'SAN18M', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 18: aparato circulatorio, la sangre', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = 'a448765d-61bb-501a-a9ae-732c4e863af1';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  '7b688840-d327-5462-a2e2-ddae662bc0d3',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'La sangre cumple:',
  '[{"text":"Transporte, regulacion y proteccion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Contraccion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"LCR","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Vision","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '399c0364-70e5-5681-a966-6bd8c8d7a488',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'El componente liquido es:',
  '[{"text":"Eritrocito","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Trombocito","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Fibrina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Plasma","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'e01c57b4-db8a-5b35-a6d2-4afc0cef7f47',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Proteina plasmatica mas abundante:',
  '[{"text":"Miosina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Colageno","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Albumina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Hemoglobina libre","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '48699718-e746-5a9f-aee7-d2e2c387f839',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Fibrinogeno participa en:',
  '[{"text":"Bilis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Coagulacion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Audicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Conduccion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  '515e249c-f906-56df-a12d-3d8bddc03665',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Hematopoyesis ocurre en:',
  '[{"text":"Medula osea roja","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Retina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Aorta","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Tallo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '544df433-f3cb-5503-afe1-bba1c0950e10',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Eritropoyetina estimula:',
  '[{"text":"Plaquetas solo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Sistole","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Saliva","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Produccion de eritrocitos","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '631dd75d-ea3c-5490-a053-befb967b5399',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Eritrocito transporta oxigeno por:',
  '[{"text":"Albumina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Insulina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Hemoglobina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Fibrina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '105bf0c0-6aa2-5e80-a4a5-da78d56c357d',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Forma biconcava favorece:',
  '[{"text":"Equilibrio","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Intercambio de gases","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Contraccion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Vision","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '13df5f7d-e9f1-519b-ad53-c7638469f8b8',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Anemia produce:',
  '[{"text":"Hipoxia tisular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Hiperoxia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Mas LCR","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Hipervision","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '296d06e2-9116-5f3a-a552-69b588dc7b77',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Antigenos ABO estan en:',
  '[{"text":"Cristalino","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Ganglio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Trompa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Membrana eritrocitaria","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'c7994508-6592-55c5-abe9-d0dc728fa242',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Rh positivo indica:',
  '[{"text":"Fibrinogeno","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Plaquetas","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Antigeno D","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Anti-A siempre","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '949b1443-308e-5fc8-a7ea-23ea632e22b6',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Leucocito mas abundante:',
  '[{"text":"Megacariocito","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Neutrofilo","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Basofilo","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Eosinofilo","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'e8b909df-203e-5983-a2d6-c9a2a1343016',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Eosinofilos aumentan en:',
  '[{"text":"Alergias y parasitosis","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Hipoxia simple","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Vision","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Bloqueo AV","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '53f5428d-205e-5a06-ae5d-1fd64680316a',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Basofilos liberan:',
  '[{"text":"Hemoglobina","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Tiroxina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Rodopsina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Histamina y heparina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'f5b99ebd-ee72-5091-abf8-39baf710387b',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Monocitos en tejidos son:',
  '[{"text":"Conos","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Miocitos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Macrofagos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Eritrocitos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  'e7fe6f81-159f-5f23-ad40-59a0541ce181',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Linfocitos son clave en:',
  '[{"text":"Bilis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Inmunidad especifica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Valvulas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Enfoque","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'dcc49bfb-f383-552c-a7bb-ff041b1a1d3a',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Trombocitos derivan de:',
  '[{"text":"Megacariocitos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Eritroblastos","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Conos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Beta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'd82591a6-dee8-5420-a690-849d8f0b7738',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'mc',
  'Hemostasia inicia con:',
  '[{"text":"Acomodacion","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Sinapsis","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"TSH","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Espasmo vascular y tapon plaquetario","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  'dec2ee21-2189-59ca-aacf-ef336d717310',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'ms',
  'Selecciona elementos formes.',
  '[{"text":"Eritrocitos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Leucocitos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Trombocitos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Albumina disuelta","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'f28106df-6f57-50a4-a9f0-d55b4639ad1e',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'ms',
  'Selecciona proteinas plasmaticas.',
  '[{"text":"Albumina","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Globulinas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Fibrinogeno","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Rodopsina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  '93ffb871-a89e-57a6-adc5-f1f8bf277ff0',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'ms',
  'Selecciona granulocitos.',
  '[{"text":"Neutrofilos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Eosinofilos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Basofilos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Monocitos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'df473af4-93ae-5c3e-a9eb-e31ea7d31797',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'ms',
  'Selecciona agranulocitos.',
  '[{"text":"Linfocitos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Monocitos","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Eosinofilos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '8ed1e510-20ad-5f41-a0b0-6646c78de2fc',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'ms',
  'Selecciona hemostasia.',
  '[{"text":"Espasmo vascular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Tapon plaquetario","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Coagulacion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Fibrinolisis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Acomodacion","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '1dcabe8d-0792-59ad-a67e-4cd520fedc7f',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'ms',
  'Selecciona rutas coagulatorias.',
  '[{"text":"Intrinseca","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Extrinseca","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Comun hacia trombina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"},{"text":"Olfatoria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  'b7aa5819-f711-569c-a944-32fc14be8871',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'dnd',
  'Relaciona sangre.',
  '[{"text":"Plasma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":17,"pinY":35},{"text":"Eritrocito","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":36,"pinY":35},{"text":"Leucocito","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":55,"pinY":35},{"text":"Trombocito","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":74,"pinY":35},{"text":"Albumina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":26,"pinY":67},{"text":"Fibrinogeno","correct":true,"color":"ac-green","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":45,"pinY":67}]'::jsonb,
  false, 24, 1, 75
),
(
  '40bb278a-8f27-5edf-a7a3-3bc3e58f2691',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'dnd',
  'Relaciona hemostasia.',
  '[{"text":"Trombocito","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":74,"pinY":35},{"text":"Tapon","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":63,"pinY":67},{"text":"Fibrinogeno","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":45,"pinY":67},{"text":"Fibrina","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":81,"pinY":67},{"text":"Coagulo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":86,"pinY":76}]'::jsonb,
  false, 25, 1, 75
),
(
  '6644cade-2186-5e5e-afbd-a83650c38780',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'dnd',
  'Relaciona defensas.',
  '[{"text":"Neutrofilo","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":55,"pinY":35},{"text":"Linfocito","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":50,"pinY":43},{"text":"Monocito","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":60,"pinY":43},{"text":"Eosinofilo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":50,"pinY":51},{"text":"Basofilo","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":60,"pinY":51}]'::jsonb,
  false, 26, 1, 75
),
(
  '6ec90a8e-cc55-55c9-a7d7-c649e4853e88',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'dnd',
  'Relaciona plasma.',
  '[{"text":"Plasma","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":17,"pinY":35},{"text":"Albumina","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":26,"pinY":67},{"text":"Osmolaridad","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":26,"pinY":76},{"text":"Globulinas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":35,"pinY":67},{"text":"Transporte","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":35,"pinY":76}]'::jsonb,
  false, 27, 1, 75
),
(
  '6f09d760-bf7a-5660-ab35-6f421d5487e5',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'dnd',
  'Relaciona eritrocito.',
  '[{"text":"Medula roja","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":20,"pinY":58},{"text":"Eritrocito","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":36,"pinY":35},{"text":"Hemoglobina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":36,"pinY":43},{"text":"Oxigeno","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":44,"pinY":35},{"text":"Reciclaje","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":44,"pinY":43}]'::jsonb,
  false, 28, 1, 75
),
(
  'cff7b329-b1c8-5fa8-aa7a-846db578966a',
  'a448765d-61bb-501a-a9ae-732c4e863af1',
  'dnd',
  'Relaciona coagulacion.',
  '[{"text":"Intrinseca","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":55,"pinY":58},{"text":"Extrinseca","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":63,"pinY":58},{"text":"Trombina","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":72,"pinY":58},{"text":"Fibrinogeno","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":45,"pinY":67},{"text":"Fibrina","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap18_sangre.svg","pinX":81,"pinY":67}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d', 'Capitulo 19 Morfofuncion - corazon', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar circuitos, anatomia cardiaca, valvulas, conduccion, ECG, ciclo cardiaco y gasto cardiaco desde Saladin.', 'COR19M', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 19: aparato circulatorio, el corazon', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '0ed4b2b7-52a1-515a-ab82-126ee06feb3d';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'b235413a-843d-5948-a79a-b13fd3e4e320',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Circuito pulmonar va:',
  '[{"text":"VD a pulmones a AI","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"VI a cuerpo","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Retina a hipofisis","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Medula a piel","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  '6c4ce3b7-e239-5777-a454-91935e8e0748',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Circuito sistemico va:',
  '[{"text":"VD a pulmon","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Solo coronarias","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Solo venas pulmonares","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"VI a tejidos a AD","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  '91af61a2-4c00-5142-a30d-d2aa1958816d',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Capa interna cardiaca:',
  '[{"text":"Miocardio","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Pericardio fibroso","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Endocardio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Epicardio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '7fafd7f4-57f7-5684-a534-11cac6e091f0',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Capa muscular cardiaca:',
  '[{"text":"Epidermis","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Miocardio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Endotelio","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Piamadre","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'bffbbea2-beea-57cd-aedf-8ad4050a76b5',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Tricuspide esta entre:',
  '[{"text":"AD y VD","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"AI y VI","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"VI y aorta","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"VD y pulmonar","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  '27683f53-5115-5ebf-ae11-249238308e8a',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Mitral esta entre:',
  '[{"text":"AD y VD","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"VD y pulmon","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Aorta y AD","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"AI y VI","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  'c27c1b3e-3ff1-5d04-a4ce-d71d31b70546',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Aortica evita retorno de:',
  '[{"text":"Pulmon a AI","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"AD a cava","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Aorta a VI","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Vena cava a AD","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  'ac1e2701-a72f-5183-abe8-263584a73b24',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Nodo SA es:',
  '[{"text":"Cuerda","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Marcapasos primario","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Valvula","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Coronaria","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  '7f710d00-3a43-54fc-a946-1ea95b47d3ab',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Despues de SA sigue:',
  '[{"text":"Nodo AV, haz AV y Purkinje","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Retina","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Coclea","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Hipofisis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  '517a5864-1f39-5463-af9f-50dcbee1444e',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Onda P representa:',
  '[{"text":"Repolarizacion ventricular","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"QRS","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Llenado","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Despolarizacion auricular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  'bd05bfaf-0e5e-5dbb-ac08-bbe01abb6a5f',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'QRS representa:',
  '[{"text":"Onda T sola","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Retorno venoso","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Despolarizacion ventricular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Onda P","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  '124cfae5-266f-5afe-a757-9136bcd28d65',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Onda T representa:',
  '[{"text":"Coronaria","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Repolarizacion ventricular","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Despolarizacion auricular","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Cierre AV","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  '6d771acf-8577-5d81-a3c0-55cd5efc861f',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Primer tono es cierre de:',
  '[{"text":"Valvulas AV","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Semilunares","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Cavas","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Coronarias","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  '165e7eec-7035-5f1c-a34c-50cacd364947',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Segundo tono es cierre de:',
  '[{"text":"Valvulas AV","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Tabique","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Venas pulmonares","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Valvulas semilunares","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  'd5da84bf-cf95-5fcb-ae53-8f5c094697bf',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Gasto cardiaco es:',
  '[{"text":"Hematocrito","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Vision por audicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Frecuencia por volumen sistolico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Presion por osmolaridad","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '5e60cd9c-6466-595e-a157-6d055062830d',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Volumen sistolico aumenta con:',
  '[{"text":"Valvulas cerradas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Precarga y contractilidad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Menor retorno siempre","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Bloqueo SA","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  '37bd7c8b-8cd9-5fc6-a951-47a6b21676dd',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Simpatico cardiaco:',
  '[{"text":"Aumenta frecuencia y contractilidad","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Disminuye a cero","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Cierra AV","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Coagula","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  '99c9db7b-831c-590f-ac07-e77fed6122ff',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'mc',
  'Vago parasimpatico:',
  '[{"text":"Aumenta maximo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Abre pupila","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Eleva eritrocitos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Disminuye frecuencia cardiaca","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '22ae4d14-3cbf-5aca-a91e-b36c54b921b8',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'ms',
  'Selecciona camaras.',
  '[{"text":"Auricula derecha","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Ventriculo derecho","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Auricula izquierda","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Ventriculo izquierdo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Ventriculo cerebral","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'a240596e-f8ad-54cf-a88a-9ab7c383be56',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'ms',
  'Selecciona valvulas.',
  '[{"text":"Tricuspide","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Mitral","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Pulmonar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Aortica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Pilorica","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'd399deb7-da78-5dfb-ae8b-7ab6338c985b',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'ms',
  'Selecciona conduccion.',
  '[{"text":"Nodo SA","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Nodo AV","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Haz AV","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Purkinje","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Huso muscular","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  'c324ff7b-d9a8-5629-a4e0-96541ce943e9',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'ms',
  'Selecciona ECG.',
  '[{"text":"Onda P","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Complejo QRS","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Onda T","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Onda fibrina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  'a2d63790-309e-5d53-af60-67b1f5f0f2c8',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'ms',
  'Selecciona ciclo cardiaco.',
  '[{"text":"Llenado","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Contraccion isovolumetrica","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Eyeccion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Relajacion isovolumetrica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Filtracion","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '8c576c02-aa86-551c-af1c-da8cbb3194b2',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'ms',
  'Selecciona gasto cardiaco.',
  '[{"text":"Frecuencia","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Volumen sistolico","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Precarga","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Contractilidad","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Poscarga","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"},{"text":"Color iris","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  'e59a7128-1abb-54b3-a1d9-da2411bb9dac',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'dnd',
  'Relaciona camaras.',
  '[{"text":"AD","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":21,"pinY":39},{"text":"VD","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":36,"pinY":54},{"text":"AI","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":64,"pinY":39},{"text":"VI","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":79,"pinY":54},{"text":"Valvulas AV","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":50,"pinY":28}]'::jsonb,
  false, 24, 1, 75
),
(
  'ed3b34a6-fbe7-537c-aeac-0452333cafc1',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'dnd',
  'Relaciona valvulas.',
  '[{"text":"Tricuspide","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":28,"pinY":46},{"text":"Mitral","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":71,"pinY":46},{"text":"Pulmonar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":42,"pinY":78},{"text":"Aortica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":58,"pinY":78},{"text":"Semilunares","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":50,"pinY":78}]'::jsonb,
  false, 25, 1, 75
),
(
  'e0ee9cda-1229-5da6-a424-8e70657253ae',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'dnd',
  'Relaciona conduccion.',
  '[{"text":"Nodo SA","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":21,"pinY":73},{"text":"Nodo AV","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":36,"pinY":73},{"text":"Haz AV","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":50,"pinY":73},{"text":"Ramas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":58,"pinY":73},{"text":"Purkinje","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":65,"pinY":73}]'::jsonb,
  false, 26, 1, 75
),
(
  '17aafcbf-b870-559b-adce-fe7557d354ab',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'dnd',
  'Relaciona ECG.',
  '[{"text":"Onda P","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":20,"pinY":22},{"text":"QRS","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":40,"pinY":22},{"text":"Onda T","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":60,"pinY":22},{"text":"Despol. ventr.","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":40,"pinY":30},{"text":"Repol. ventr.","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":60,"pinY":30}]'::jsonb,
  false, 27, 1, 75
),
(
  'a28a845c-6ef7-5ed5-ab97-4b113f699030',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'dnd',
  'Relaciona circuitos.',
  '[{"text":"Pulmonar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":36,"pinY":54},{"text":"Pulmones","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":50,"pinY":16},{"text":"AI","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":64,"pinY":39},{"text":"Sistemico","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":79,"pinY":54},{"text":"AD","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":21,"pinY":39}]'::jsonb,
  false, 28, 1, 75
),
(
  '5e85d2d9-1bd7-5abf-a02e-eedbd94bf7fa',
  '0ed4b2b7-52a1-515a-ab82-126ee06feb3d',
  'dnd',
  'Relaciona capas.',
  '[{"text":"Endocardio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":42,"pinY":62},{"text":"Miocardio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":50,"pinY":62},{"text":"Epicardio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":58,"pinY":62},{"text":"Pericardio","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":66,"pinY":62},{"text":"Cavidad pericardica","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap19_corazon.svg","pinX":74,"pinY":62}]'::jsonb,
  false, 29, 1, 75
);

insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo, publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
) values (
  '55ccdf39-c450-5656-a4fd-c59293dd3196', 'Capitulo 20 Morfofuncion - vasos y circulacion', 'MORFOFUNCION', 'Residencia', 'espanol', 'publica',
  'Repasar pared vascular, presion arterial, resistencia, intercambio capilar, retorno venoso y rutas circulatorias desde Saladin.', 'VAS20M', true, 'dd2eed5d-b917-4c4d-b0e7-aa6b1e57ef23', now(), now(), true,
  'Capitulo 20: vasos sanguineos y circulacion', 'test', '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
)
on conflict (id) do update set
  titulo = excluded.titulo, asignatura = excluded.asignatura, nivel = excluded.nivel, idioma = excluded.idioma,
  visibilidad = excluded.visibilidad, objetivo = excluded.objetivo, codigo = excluded.codigo, publicado = excluded.publicado,
  updated_at = now(), iniciado = excluded.iniciado, tema = excluded.tema, modo_sesion = excluded.modo_sesion, config_juego = excluded.config_juego;
delete from public.evaluacion_preguntas where evaluacion_id = '55ccdf39-c450-5656-a4fd-c59293dd3196';
insert into public.evaluacion_preguntas (id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador) values
(
  'e295b049-b0b8-5f91-ae64-c0439d4b0f5a',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Tunica intima incluye:',
  '[{"text":"Endotelio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Miocardio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Piamadre","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Epidermis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 0, 1, 45
),
(
  'd612030a-f5d8-55ca-a435-a6a07c43b349',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Tunica media contiene:',
  '[{"text":"Cartilago","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Neuroglia","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Eritrocitos","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Musculo liso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 1, 1, 45
),
(
  'c1c33867-b55b-539a-a410-52687f8f72c8',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Arterias elasticas ayudan a:',
  '[{"text":"LCR","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Luz","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Amortiguar pulsos","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Anticuerpos","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 2, 1, 45
),
(
  '88c440b6-caef-528e-ac17-e13fe7ba0a5f',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Arteriolas controlan:',
  '[{"text":"Plaquetas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Resistencia y flujo capilar","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Aire","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Hormonas","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 3, 1, 45
),
(
  'b8101e7b-8c81-55b9-a4df-cbf75f75b0ba',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Capilares son sitio de:',
  '[{"text":"Intercambio sangre-tejidos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"ECG","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Audicion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Bilis","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 4, 1, 45
),
(
  'd2f9c5e7-59e7-557a-a6ac-6f48165631e4',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Capilares fenestrados tienen:',
  '[{"text":"Valvulas","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Miocardio","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Mielina","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Poros permeables","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 5, 1, 45
),
(
  '0f76ba9c-11b5-56ac-a3bc-d0c55dffc25d',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Venas tienen:',
  '[{"text":"Sin luz","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Pared mas gruesa siempre","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Baja presion y valvulas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Alta presion siempre","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 6, 1, 45
),
(
  '2655efbe-cc86-5430-a99e-b3e6778ee6f3',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Sistolica ocurre durante:',
  '[{"text":"Hemostasia","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Contraccion ventricular","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Diastole","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Sueno","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 7, 1, 45
),
(
  'c64acf81-a9bd-5c15-a69e-cd4aac6cf5f8',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Diastolica ocurre durante:',
  '[{"text":"Relajacion ventricular","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Sistole maxima","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Contraccion auricular","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Coagulacion","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 8, 1, 45
),
(
  'b4e7d440-6862-52dc-a699-450fe4bc7ab1',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Resistencia aumenta si:',
  '[{"text":"Aumenta radio","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Baja viscosidad siempre","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Abren capilares","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Disminuye radio vascular","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 9, 1, 45
),
(
  '0307edd1-bd44-5d0b-a9d0-9898d563aa62',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Vasoconstriccion causa:',
  '[{"text":"Coagulo","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Audicion","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Menor flujo local y mayor resistencia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Mayor luz","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 10, 1, 45
),
(
  'c4be85ca-b692-53d4-a35d-9dade6565e22',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Vasodilatacion causa:',
  '[{"text":"LCR","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Mayor flujo local y menor resistencia","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Cierre total","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Mielina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 11, 1, 45
),
(
  'bb08117c-f737-5079-a429-8fcca55e4c42',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Filtracion capilar favorece:',
  '[{"text":"Presion hidrostatica capilar","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Oncotica sola","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Cristalino","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Nodo SA","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 12, 1, 45
),
(
  'e7e6b6c9-54bb-55ce-a162-9c508f29f6e3',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Reabsorcion capilar favorece:',
  '[{"text":"Hidrostatica maxima","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Onda T","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Acomodacion","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Presion coloidosmotica plasmatica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 13, 1, 45
),
(
  '4f769d0e-a91f-5a71-a3dd-9d0b02d1ee5e',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Retorno venoso depende de:',
  '[{"text":"Solo VI","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Solo LCR","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Bomba muscular, respiratoria y valvulas","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Solo gravedad","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 14, 1, 45
),
(
  '8b0dfe1a-6a47-5bca-a371-04c59249183c',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Choque circulatorio implica:',
  '[{"text":"Audicion maxima","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Perfusion tisular inadecuada","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Vision normal","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Filtracion estable","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 15, 1, 45
),
(
  'ab335940-1785-5d7e-ac8c-abd7cb6bb83a',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Circulacion cerebral exige control porque:',
  '[{"text":"Encefalo tolera poco hipoxia","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Almacena oxigeno","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"No usa glucosa","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"No tiene capilares","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 16, 1, 45
),
(
  'e539642c-a5ca-50bf-ab2e-ec66367cc237',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'mc',
  'Circulacion pulmonar trabaja a:',
  '[{"text":"Mayor que aorta","correct":false,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Cero","correct":false,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Igual a LCR","correct":false,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Menor presion que sistemica","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  false, 17, 1, 45
),
(
  '3d19b83c-4f07-5572-adac-3b5a590866d2',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'ms',
  'Selecciona capas vasculares.',
  '[{"text":"Tunica intima","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Tunica media","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Tunica externa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Endocardio","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  true, 18, 1, 60
),
(
  'cc98b5f2-0834-5d08-a951-7c305daefd58',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'ms',
  'Selecciona vasos.',
  '[{"text":"Arterias","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Arteriolas","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Capilares","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Venulas","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Venas","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Bronquiolos","correct":false,"color":"ac-green","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  true, 19, 1, 60
),
(
  'c116d05f-1dc4-5b0c-a73e-4008521c1631',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'ms',
  'Selecciona capilares.',
  '[{"text":"Continuos","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Fenestrados","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Sinusoides","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Valvulares","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  true, 20, 1, 60
),
(
  '856869dc-848e-5414-af38-d14e2e077b13',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'ms',
  'Selecciona factores de resistencia.',
  '[{"text":"Radio","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Viscosidad","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Longitud","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Color retina","correct":false,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  true, 21, 1, 60
),
(
  '3b923478-4da0-5b84-a038-959604e3505d',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'ms',
  'Selecciona intercambio capilar.',
  '[{"text":"Difusion","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Filtracion","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Reabsorcion","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Transcitosis","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Saltatoria","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  true, 22, 1, 60
),
(
  '4e66caba-d7d1-5331-aab0-d613778feb66',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'ms',
  'Selecciona retorno venoso.',
  '[{"text":"Valvulas","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Bomba muscular","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Bomba respiratoria","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Tono venoso","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"},{"text":"Acomodacion","correct":false,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg"}]'::jsonb,
  true, 23, 1, 60
),
(
  '44ddb51d-84e3-5e4a-aac8-948223b25eeb',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'dnd',
  'Relaciona pared y vasos.',
  '[{"text":"Intima","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":15,"pinY":38},{"text":"Media","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":32,"pinY":38},{"text":"Externa","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":49,"pinY":38},{"text":"Arteriola","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":69,"pinY":38},{"text":"Capilar","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":85,"pinY":38}]'::jsonb,
  false, 24, 1, 75
),
(
  '14018c28-23e5-53f4-a2fb-e936781a7e8d',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'dnd',
  'Relaciona retorno.',
  '[{"text":"Venula","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":24,"pinY":68},{"text":"Valvula","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":41,"pinY":68},{"text":"Bomba muscular","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":59,"pinY":68},{"text":"Vena al corazon","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":70,"pinY":68},{"text":"Retorno","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":80,"pinY":68}]'::jsonb,
  false, 25, 1, 75
),
(
  'dd05ada9-40a2-5ad2-a14f-cc26cfaf3670',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'dnd',
  'Relaciona intercambio.',
  '[{"text":"Arteriola","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":69,"pinY":38},{"text":"Capilar","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":85,"pinY":38},{"text":"Intercambio","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":76,"pinY":68},{"text":"Filtracion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":76,"pinY":58},{"text":"Reabsorcion","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":76,"pinY":78}]'::jsonb,
  false, 26, 1, 75
),
(
  '8705fd44-b3f4-509e-a5aa-1678a4e16906',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'dnd',
  'Relaciona presion.',
  '[{"text":"Presion arterial","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":20,"pinY":28},{"text":"Radio","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":32,"pinY":38},{"text":"Resistencia","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":44,"pinY":48},{"text":"Flujo","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":69,"pinY":38},{"text":"Lecho capilar","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":85,"pinY":38}]'::jsonb,
  false, 27, 1, 75
),
(
  '6fec8fb1-07e0-5a0b-a507-d2c47960949e',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'dnd',
  'Relaciona ruta vascular.',
  '[{"text":"Arteria","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":61,"pinY":38},{"text":"Arteriola","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":69,"pinY":38},{"text":"Capilar","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":85,"pinY":38},{"text":"Venula","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":24,"pinY":68},{"text":"Vena","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":41,"pinY":68}]'::jsonb,
  false, 28, 1, 75
),
(
  'd4abba94-a80d-5c1f-a51b-3ba91fde01d7',
  '55ccdf39-c450-5656-a4fd-c59293dd3196',
  'dnd',
  'Relaciona shock.',
  '[{"text":"Perfusion baja","correct":true,"color":"ac-blue","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":76,"pinY":68},{"text":"Barorreceptores","correct":true,"color":"ac-teal","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":20,"pinY":28},{"text":"Simpatico","correct":true,"color":"ac-yellow","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":44,"pinY":48},{"text":"Vasoconstriccion","correct":true,"color":"ac-pink","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":69,"pinY":38},{"text":"Retorno","correct":true,"color":"ac-purple","pregunta_imagen":"/juegos/assets/segundo-parcial-morfo/cap20_vasos_circulacion.svg","pinX":80,"pinY":68}]'::jsonb,
  false, 29, 1, 75
);
commit;
