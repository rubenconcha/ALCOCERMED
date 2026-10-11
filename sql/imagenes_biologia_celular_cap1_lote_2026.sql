-- Lote 1: Biología Celular, capítulo 1. Una ilustración específica por pregunta de selección.
-- No cambia enunciados, opciones ni respuestas. Reejecutable.
begin;
with imagenes(id, ruta) as (
  values
    ('601b9a75-345b-5de9-bd63-00da7fdf67ee'::uuid, '/juegos/assets/preguntas-contextuales/teoria-celular.svg'),
    ('292fea5d-ca1a-5eef-b886-55ee9b5351af'::uuid, '/juegos/assets/preguntas-contextuales/procariota.svg'),
    ('10ab6dbf-b090-53ce-b612-c56dda7c2824'::uuid, '/juegos/assets/preguntas-contextuales/eucariota.svg'),
    ('9fc43d6e-c558-5623-bf5a-c7f5fce73527'::uuid, '/juegos/assets/preguntas-contextuales/adn.svg'),
    ('39e58e2b-b97a-500f-b98b-6f0ad929b692'::uuid, '/juegos/assets/preguntas-contextuales/arn.svg'),
    ('d248e289-f0e8-5cb6-b6c6-e2188226b542'::uuid, '/juegos/assets/preguntas-contextuales/virus.svg'),
    ('2cfc368e-e886-5e68-ba06-fc3e9c432aec'::uuid, '/juegos/assets/preguntas-contextuales/prion.svg'),
    ('a37e37be-9471-565a-b9a0-6ec6fc063ebc'::uuid, '/juegos/assets/preguntas-contextuales/modelo-biologico.svg'),
    ('5636f2ce-e839-5a8b-bb06-81cd68df2ae1'::uuid, '/juegos/assets/preguntas-contextuales/bacterias-modelo.svg'),
    ('6176e8b1-2d77-5880-b4b0-833891c5957f'::uuid, '/juegos/assets/preguntas-contextuales/biomedicina-celular.svg'),
    ('99e5ba20-e484-5148-b3cf-418855e8d935'::uuid, '/juegos/assets/preguntas-contextuales/membrana-plasmatica.svg'),
    ('12b56476-959a-5789-b4f4-1de8afe09c49'::uuid, '/juegos/assets/preguntas-contextuales/citoplasma.svg'),
    ('cbd26dda-6172-58f0-b158-74f2093bde05'::uuid, '/juegos/assets/preguntas-contextuales/nucleo.svg'),
    ('91df616b-e0c6-5aeb-bfb7-49c0364e88ae'::uuid, '/juegos/assets/preguntas-contextuales/homeostasis-celular.svg'),
    ('fa35c17d-1848-5da3-b300-a8daf84a776d'::uuid, '/juegos/assets/preguntas-contextuales/expresion-genica.svg'),
    ('9b8547c8-c185-5795-b868-47de442b550d'::uuid, '/juegos/assets/preguntas-contextuales/proteina-funcion.svg'),
    ('b02971c9-38cc-538a-bb0c-b314dc6ae96b'::uuid, '/juegos/assets/preguntas-contextuales/evolucion-celular.svg'),
    ('882bb4f9-ea7e-5eca-b531-cb92a8569966'::uuid, '/juegos/assets/preguntas-contextuales/comparacion-celulas.svg'),
    ('b16d067c-1ab4-5515-b327-dd7fa40b4d86'::uuid, '/juegos/assets/preguntas-contextuales/componentes-celulares.svg'),
    ('7ebe4ae6-ba42-5a4e-bb22-3dfc5a7d24a9'::uuid, '/juegos/assets/preguntas-contextuales/sistemas-acelulares.svg'),
    ('65f9d4b1-ccd3-50c2-bd43-1e9f3e7642ca'::uuid, '/juegos/assets/preguntas-contextuales/rasgos-eucariotas.svg'),
    ('85f2b751-8a61-54b2-b8d5-25ac31f83c87'::uuid, '/juegos/assets/preguntas-contextuales/funciones-proteinas.svg'),
    ('f2ff6cd6-e56c-56ac-b390-1e796f1a6d01'::uuid, '/juegos/assets/preguntas-contextuales/conceptos-introductorios.svg'),
    ('a643d1b7-10af-5d25-b50c-4f9a73b69120'::uuid, '/juegos/assets/preguntas-contextuales/niveles-informacion.svg')
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
