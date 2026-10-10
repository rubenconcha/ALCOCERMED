-- Revisión visual de Juegos. Mantiene preguntas, opciones, respuestas, pines
-- de relacionar y resultados ya registrados. Se puede ejecutar varias veces.
-- Las láminas-resumen de capítulo no deben acompañar preguntas conceptuales:
-- distraen, a veces revelan la respuesta y no representan el enunciado.
begin;

update public.evaluacion_preguntas as q
set opciones = (
  select jsonb_agg(item.opcion - 'pregunta_imagen' order by item.posicion)
  from jsonb_array_elements(q.opciones) with ordinality as item(opcion, posicion)
)
where q.tipo <> 'dnd'
  and jsonb_typeof(q.opciones) = 'array'
  and jsonb_array_length(q.opciones) > 0
  and (
    q.opciones->0->>'pregunta_imagen' like '/juegos/assets/biologia-celular-parciales/%'
    or q.opciones->0->>'pregunta_imagen' like '/juegos/assets/salud-publica-parciales/%'
    or q.opciones->0->>'pregunta_imagen' like '/juegos/assets/segundo-parcial-morfo/%'
    or q.opciones->0->>'pregunta_imagen' = '/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png'
  );

-- Ilustraciones de una sola idea, vinculadas a preguntas concretas.
-- Las ocho de Morfofunción sustituyen la fotografía de cuerpo completo.
with ilustraciones(id, ruta) as (
  values
    ('601b9a75-345b-5de9-bd63-00da7fdf67ee'::uuid, '/juegos/assets/preguntas-contextuales/teoria-celular.svg'),
    ('292fea5d-ca1a-5eef-b886-55ee9b5351af'::uuid, '/juegos/assets/preguntas-contextuales/procariota.svg'),
    ('10ab6dbf-b090-53ce-b612-c56dda7c2824'::uuid, '/juegos/assets/preguntas-contextuales/eucariota.svg'),
    ('9fc43d6e-c558-5623-bf5a-c7f5fce73527'::uuid, '/juegos/assets/preguntas-contextuales/adn.svg'),
    ('39e58e2b-b97a-500f-b98b-6f0ad929b692'::uuid, '/juegos/assets/preguntas-contextuales/arn.svg'),
    ('d248e289-f0e8-5cb6-b6c6-e2188226b542'::uuid, '/juegos/assets/preguntas-contextuales/virus.svg'),
    ('3bea9399-4e1c-569e-c9fb-4e174e02278e'::uuid, '/juegos/assets/preguntas-contextuales/salud-colectiva.svg'),
    ('c6c88e9a-65b9-5d04-cf43-1c4408bc0bbb'::uuid, '/juegos/assets/preguntas-contextuales/promocion-salud.svg'),
    ('652123b7-fe82-51d7-c4cd-aa74239aaf46'::uuid, '/juegos/assets/preguntas-contextuales/prevencion.svg'),
    ('cdb01b7f-bc1c-5bac-892f-f4845682b3d8'::uuid, '/juegos/assets/demo-morfo/anatomia.svg'),
    ('33968fe3-4086-56a1-bda5-98c755dae66d'::uuid, '/juegos/assets/demo-morfo/fisiologia.svg'),
    ('960a5cdf-518c-547e-b197-9b071f87b2f3'::uuid, '/juegos/assets/demo-morfo/radiologia.svg'),
    ('45e95ab8-e181-5647-8d11-0e31d6091ddb'::uuid, '/juegos/assets/demo-morfo/metodo-cientifico.svg'),
    ('832f8e4b-0d55-56a5-9d08-2bc9d8125b11'::uuid, '/juegos/assets/demo-morfo/evolucion.svg'),
    ('7ec65f72-704f-546d-94a7-e16c9104042b'::uuid, '/juegos/assets/demo-morfo/microscopia.svg'),
    ('8ab550d2-326f-58bc-9844-44f923ccea85'::uuid, '/juegos/assets/demo-morfo/historia.svg'),
    ('2a98c39a-21ef-5658-831d-405968f64bd4'::uuid, '/juegos/assets/demo-morfo/hipotesis.svg'),
    ('4c7575e3-7a3e-a1ba-accb-1292b18d6d2f'::uuid, '/juegos/assets/demo-morfo/anatomia.svg'),
    ('40cef129-87ff-9565-d95f-613814957367'::uuid, '/juegos/assets/demo-morfo/fisiologia.svg'),
    ('e5b6f657-3e7e-b17f-5c2b-79e5532a704e'::uuid, '/juegos/assets/demo-morfo/radiologia.svg'),
    ('d8cbb57d-16f5-7511-89ce-ecbc467df1fd'::uuid, '/juegos/assets/demo-morfo/metodo-cientifico.svg'),
    ('48d1642b-f519-da67-593c-d4c38812689f'::uuid, '/juegos/assets/demo-morfo/evolucion.svg'),
    ('66345056-5fa5-a12c-4379-c5a4e005b390'::uuid, '/juegos/assets/demo-morfo/microscopia.svg'),
    ('e39f7b12-f4e9-6659-c2ed-f152312eefab'::uuid, '/juegos/assets/demo-morfo/historia.svg'),
    ('d5a3aa1e-bc91-174c-4c5d-0a2bd21f3570'::uuid, '/juegos/assets/demo-morfo/hipotesis.svg')
)
update public.evaluacion_preguntas as q
set opciones = (
  select jsonb_agg(jsonb_set(item.opcion, '{pregunta_imagen}', to_jsonb(ilustraciones.ruta), true) order by item.posicion)
  from jsonb_array_elements(q.opciones) with ordinality as item(opcion, posicion)
)
from ilustraciones
where q.id = ilustraciones.id
  and q.tipo <> 'dnd'
  and jsonb_typeof(q.opciones) = 'array'
  and jsonb_array_length(q.opciones) > 0;

commit;
