-- Imágenes de alta calidad para preguntas de demostración y sus equivalentes oficiales.
-- No modifica enunciados, opciones de respuesta, pines DND ni resultados.
-- Reejecutable.
begin;
with imagenes(id, ruta) as (
  values
    ('8927e7c4-15c6-d230-8c12-c52018a86268'::uuid, '/juegos/assets/preguntas-premium/teoria-celular.webp'),
    ('a78aef55-039e-a399-2eb5-e024fdf23abb'::uuid, '/juegos/assets/preguntas-premium/teoria-celular.webp'),
    ('601b9a75-345b-5de9-bd63-00da7fdf67ee'::uuid, '/juegos/assets/preguntas-premium/teoria-celular.webp'),
    ('01078577-e2a3-8f02-7344-30a895c50fe4'::uuid, '/juegos/assets/preguntas-premium/procariota.webp'),
    ('292fea5d-ca1a-5eef-b886-55ee9b5351af'::uuid, '/juegos/assets/preguntas-premium/procariota.webp'),
    ('3dab16a9-225a-1ef3-1ad2-2dc45886f134'::uuid, '/juegos/assets/preguntas-premium/eucariota.webp'),
    ('10ab6dbf-b090-53ce-b612-c56dda7c2824'::uuid, '/juegos/assets/preguntas-premium/eucariota.webp'),
    ('4c838dd8-c35a-7362-74e8-948c45f4c162'::uuid, '/juegos/assets/preguntas-premium/adn.webp'),
    ('9fc43d6e-c558-5623-bf5a-c7f5fce73527'::uuid, '/juegos/assets/preguntas-premium/adn.webp'),
    ('3d13a3cd-9100-772a-869a-e6e4730f9d1b'::uuid, '/juegos/assets/preguntas-premium/arn.webp'),
    ('39e58e2b-b97a-500f-b98b-6f0ad929b692'::uuid, '/juegos/assets/preguntas-premium/arn.webp'),
    ('41f1b78e-6402-26fc-e7d2-a0a57a8a3414'::uuid, '/juegos/assets/preguntas-premium/componentes-celulares.webp'),
    ('b16d067c-1ab4-5515-b327-dd7fa40b4d86'::uuid, '/juegos/assets/preguntas-premium/componentes-celulares.webp'),
    ('9044b770-281c-3ac2-a802-7d11680c105b'::uuid, '/juegos/assets/preguntas-premium/sistemas-acelulares.webp'),
    ('7ebe4ae6-ba42-5a4e-bb22-3dfc5a7d24a9'::uuid, '/juegos/assets/preguntas-premium/sistemas-acelulares.webp'),
    ('5faddffe-d6c0-a18f-c7c5-81ad6724476d'::uuid, '/juegos/assets/preguntas-premium/salud-colectiva.webp'),
    ('3bea9399-4e1c-569e-c9fb-4e174e02278e'::uuid, '/juegos/assets/preguntas-premium/salud-colectiva.webp'),
    ('ffab2682-510e-dd3d-eb5d-e92b728ce187'::uuid, '/juegos/assets/preguntas-premium/promocion-salud.webp'),
    ('50c050a9-5f50-81c9-1cd6-4d82ab51df3f'::uuid, '/juegos/assets/preguntas-premium/promocion-salud.webp'),
    ('c6c88e9a-65b9-5d04-cf43-1c4408bc0bbb'::uuid, '/juegos/assets/preguntas-premium/promocion-salud.webp'),
    ('2f801b9a-0ea8-1d9a-da16-68164a9f4730'::uuid, '/juegos/assets/preguntas-premium/prevencion-primaria.webp'),
    ('652123b7-fe82-51d7-c4cd-aa74239aaf46'::uuid, '/juegos/assets/preguntas-premium/prevencion-primaria.webp'),
    ('e3da4cce-df6f-cade-adde-6489142acb91'::uuid, '/juegos/assets/preguntas-premium/prevencion-secundaria.webp'),
    ('bca1cf09-4190-2250-ebb3-d8a57fe8317c'::uuid, '/juegos/assets/preguntas-premium/prevencion-terciaria.webp'),
    ('d5384ea1-013e-7925-1a6e-f84f11568be8'::uuid, '/juegos/assets/preguntas-premium/salud-conceptos.webp'),
    ('5e10757a-8d22-c3c8-d218-5418aa5fd5a6'::uuid, '/juegos/assets/preguntas-premium/salud-acciones.webp'),
    ('4c7575e3-7a3e-a1ba-accb-1292b18d6d2f'::uuid, '/juegos/assets/preguntas-premium/anatomia.webp'),
    ('cdb01b7f-bc1c-5bac-892f-f4845682b3d8'::uuid, '/juegos/assets/preguntas-premium/anatomia.webp'),
    ('40cef129-87ff-9565-d95f-613814957367'::uuid, '/juegos/assets/preguntas-premium/fisiologia.webp'),
    ('33968fe3-4086-56a1-bda5-98c755dae66d'::uuid, '/juegos/assets/preguntas-premium/fisiologia.webp'),
    ('e5b6f657-3e7e-b17f-5c2b-79e5532a704e'::uuid, '/juegos/assets/preguntas-premium/radiologia.webp'),
    ('960a5cdf-518c-547e-b197-9b071f87b2f3'::uuid, '/juegos/assets/preguntas-premium/radiologia.webp'),
    ('d8cbb57d-16f5-7511-89ce-ecbc467df1fd'::uuid, '/juegos/assets/preguntas-premium/metodo-cientifico.webp'),
    ('45e95ab8-e181-5647-8d11-0e31d6091ddb'::uuid, '/juegos/assets/preguntas-premium/metodo-cientifico.webp'),
    ('48d1642b-f519-da67-593c-d4c38812689f'::uuid, '/juegos/assets/preguntas-premium/evolucion.webp'),
    ('832f8e4b-0d55-56a5-9d08-2bc9d8125b11'::uuid, '/juegos/assets/preguntas-premium/evolucion.webp'),
    ('66345056-5fa5-a12c-4379-c5a4e005b390'::uuid, '/juegos/assets/preguntas-premium/microscopia.webp'),
    ('7ec65f72-704f-546d-94a7-e16c9104042b'::uuid, '/juegos/assets/preguntas-premium/microscopia.webp'),
    ('e39f7b12-f4e9-6659-c2ed-f152312eefab'::uuid, '/juegos/assets/preguntas-premium/historia-medicina.webp'),
    ('8ab550d2-326f-58bc-9844-44f923ccea85'::uuid, '/juegos/assets/preguntas-premium/historia-medicina.webp'),
    ('d5a3aa1e-bc91-174c-4c5d-0a2bd21f3570'::uuid, '/juegos/assets/preguntas-premium/hipotesis.webp'),
    ('2a98c39a-21ef-5658-831d-405968f64bd4'::uuid, '/juegos/assets/preguntas-premium/hipotesis.webp')
)
update public.evaluacion_preguntas as q
set opciones = (
  select jsonb_agg(jsonb_set(item.opcion, '{pregunta_imagen}', to_jsonb(imagenes.ruta), true) order by item.posicion)
  from jsonb_array_elements(q.opciones) with ordinality as item(opcion, posicion)
)
from imagenes
where q.id = imagenes.id
  and q.tipo in ('mc','ms','tf')
  and jsonb_typeof(q.opciones) = 'array'
  and jsonb_array_length(q.opciones) > 0;
commit;
