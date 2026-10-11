-- Biología Celular, tema 2: imágenes específicas para 26 preguntas de selección.
-- Mantiene las preguntas, respuestas y puntuaciones. Reejecutable.
begin;
with imagenes(id, ruta) as (
  values
    ('cedc6bfe-450a-5fcb-bb1e-448e6eb70c85'::uuid, '/juegos/assets/preguntas-premium/bc02-microscopia-optica.webp'),
    ('deaf69a0-a4ff-5768-bc14-34a8dddd73cb'::uuid, '/juegos/assets/preguntas-premium/bc02-microscopia-electronica.webp'),
    ('51d675b9-73a4-5cc9-bb23-2087210be822'::uuid, '/juegos/assets/preguntas-premium/bc02-fijacion.webp'),
    ('41c1741e-9424-5cfe-b929-65bbbfb54d3c'::uuid, '/juegos/assets/preguntas-premium/bc02-pcr.webp'),
    ('322f0b43-ef86-53a9-bc05-4d48310ef1dd'::uuid, '/juegos/assets/preguntas-premium/bc02-electroforesis.webp'),
    ('cb2fe2d0-d72e-528f-b0af-c05e5656c94c'::uuid, '/juegos/assets/preguntas-premium/bc02-secuenciacion.webp'),
    ('4448f6f2-4044-5fe7-b888-f0db7a35859e'::uuid, '/juegos/assets/preguntas-premium/bc02-fish.webp'),
    ('f2446921-4afe-55de-be15-f97e59b0b082'::uuid, '/juegos/assets/preguntas-premium/bc02-elisa.webp'),
    ('4cc3b1c8-437f-55c5-ba0e-92937fb56d11'::uuid, '/juegos/assets/preguntas-premium/bc02-citometria.webp'),
    ('417cd8c5-0e01-522d-be87-dbb054b1e5b4'::uuid, '/juegos/assets/preguntas-premium/bc02-cultivo-celular.webp'),
    ('69984a9f-9020-54b0-bdbc-053552803526'::uuid, '/juegos/assets/preguntas-premium/bc02-centrifugacion.webp'),
    ('81166499-3d0b-5ae9-b3b3-31faf5383eee'::uuid, '/juegos/assets/preguntas-premium/bc02-elisa.webp'),
    ('0817a368-845d-5216-b53a-494bd6c823b5'::uuid, '/juegos/assets/preguntas-premium/bc02-inmunofluorescencia.webp'),
    ('bf6441c1-eae7-5d90-b79e-ce39b8578bcc'::uuid, '/juegos/assets/preguntas-premium/bc02-knockout.webp'),
    ('55e70315-f9a8-5172-b5e5-9ed4a0e7df9b'::uuid, '/juegos/assets/preguntas-premium/bc02-microarray.webp'),
    ('4e5aa591-5caa-52f1-b13d-7a429a92b2a3'::uuid, '/juegos/assets/preguntas-premium/bc02-terapia-genica.webp'),
    ('ea2643ca-937d-5cc9-b719-11c9190c0e2f'::uuid, '/juegos/assets/preguntas-premium/bc02-centrifugacion.webp'),
    ('74398344-f6b3-5876-b285-a2e6286897c2'::uuid, '/juegos/assets/preguntas-premium/bc02-cuantificacion-adn.webp'),
    ('d61d8d45-60ca-52f2-bf12-ad60d09d7c83'::uuid, '/juegos/assets/preguntas-premium/bc02-microscopia-electronica.webp'),
    ('21063b24-6af8-5f47-b494-2728b3e1a649'::uuid, '/juegos/assets/preguntas-premium/bc02-tecnicas-adn.webp'),
    ('f099c1c3-2947-505b-b036-6d6f750d3666'::uuid, '/juegos/assets/preguntas-premium/bc02-elisa.webp'),
    ('add83ea1-40e2-5a18-b52e-a263e62088e6'::uuid, '/juegos/assets/preguntas-premium/bc02-cultivo-celular.webp'),
    ('47c37b87-f83c-5f48-bd34-b1d7aa697c36'::uuid, '/juegos/assets/preguntas-premium/bc02-centrifugacion.webp'),
    ('3550e672-2be8-555e-b5b1-e818cfcdf6ee'::uuid, '/juegos/assets/preguntas-premium/bc02-knockout.webp'),
    ('fefcd6f3-68ae-fca7-bade-6c210e9f1214'::uuid, '/juegos/assets/preguntas-premium/bc02-inmunofluorescencia.webp'),
    ('748d278c-a85a-e851-f3e5-974ad4edf71f'::uuid, '/juegos/assets/preguntas-premium/bc02-centrifugacion.webp')
)
update public.evaluacion_preguntas as q
set opciones = (
  select jsonb_agg(jsonb_set(item.opcion, '{pregunta_imagen}', to_jsonb(imagenes.ruta), true) order by item.posicion)
  from jsonb_array_elements(q.opciones) with ordinality as item(opcion, posicion)
)
from imagenes
where q.id = imagenes.id
  and q.tipo in ('mc', 'ms', 'tf')
  and jsonb_typeof(q.opciones) = 'array'
  and jsonb_array_length(q.opciones) > 0;
commit;
