-- Sustituye la fotografía de regiones corporales por ilustraciones pertinentes
-- en las ocho preguntas conceptuales del demo gratuito y del banco original.
-- Conserva opciones, respuestas, explicaciones y resultados de los alumnos.
-- Puede ejecutarse de nuevo sin duplicar preguntas.
begin;

with imagenes(id, ruta) as (
  values
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
update public.evaluacion_preguntas as pregunta
set opciones = (
  select jsonb_agg(
    jsonb_set(opcion, '{pregunta_imagen}', to_jsonb(imagenes.ruta), true)
    order by posicion
  )
  from jsonb_array_elements(pregunta.opciones) with ordinality as item(opcion, posicion)
)
from imagenes
where pregunta.id = imagenes.id
  and pregunta.evaluacion_id in (
    '0a8ea035-007e-5aaf-b891-e43f5402fa56'::uuid,
    'a7d3b295-dc3a-6c7a-6cc4-743cdd9724ae'::uuid
  );

commit;
