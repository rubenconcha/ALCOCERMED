-- Biología Celular, tema 2: seis láminas específicas para relacionar.
-- Cada punto coincide con un objeto visible; preserva las respuestas correctas. Reejecutable.
begin;
with cambios(id, enunciado, imagen, etiquetas) as (
  values
    ('cdea344d-1dd6-5f90-beed-8d34a7bb945e'::uuid, 'Identifica cada técnica en el equipo que la realiza.', '/juegos/assets/preguntas-premium/bc02-relacionar-tecnicas.webp', '[{"text":"Microscopía óptica","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Microscopía electrónica","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"PCR","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Secuenciación","pinX":17,"pinY":75,"color":"ac-pink","correct":true},{"text":"Citometría de flujo","pinX":50,"pinY":75,"color":"ac-purple","correct":true},{"text":"Centrifugación","pinX":83,"pinY":75,"color":"ac-green","correct":true}]'::jsonb),
    ('ba6c9d3a-25a1-560d-beec-28be6d6d5b9a'::uuid, 'Ubica los materiales y métodos de biología molecular.', '/juegos/assets/preguntas-premium/bc02-relacionar-molecular.webp', '[{"text":"PCR","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"ADN molde","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"Secuenciación","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Nucleótidos","pinX":25,"pinY":75,"color":"ac-pink","correct":true},{"text":"Hibridación in situ","pinX":75,"pinY":75,"color":"ac-purple","correct":true}]'::jsonb),
    ('5688e93f-8915-58ce-be87-25dbb3e70323'::uuid, 'Reconoce los componentes de las técnicas inmunológicas.', '/juegos/assets/preguntas-premium/bc02-relacionar-inmuno.webp', '[{"text":"Antígeno","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Anticuerpo","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"ELISA","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Inmunofluorescencia","pinX":25,"pinY":75,"color":"ac-pink","correct":true},{"text":"Citometría de flujo","pinX":75,"pinY":75,"color":"ac-purple","correct":true}]'::jsonb),
    ('32812aa2-fa83-5872-bc69-0b64a54caaf7'::uuid, 'Sigue las piezas del fraccionamiento celular.', '/juegos/assets/preguntas-premium/bc02-relacionar-fraccionamiento.webp', '[{"text":"Homogeneizado","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Centrifugación","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"Núcleo","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Mitocondria","pinX":25,"pinY":75,"color":"ac-pink","correct":true},{"text":"Microsomas","pinX":75,"pinY":75,"color":"ac-purple","correct":true}]'::jsonb),
    ('8ee00116-a053-5b21-b7fd-4696bc68d2a9'::uuid, 'Distingue cómo se obtienen estas imágenes microscópicas.', '/juegos/assets/preguntas-premium/bc02-relacionar-microscopia.webp', '[{"text":"Microscopía óptica","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Luz visible","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"Microscopía electrónica","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Haz de electrones","pinX":25,"pinY":75,"color":"ac-pink","correct":true},{"text":"Alta resolución","pinX":75,"pinY":75,"color":"ac-purple","correct":true}]'::jsonb),
    ('ab65b469-e058-5eba-be6e-ba7fe29af7ef'::uuid, 'Identifica el material usado para cultivar y estudiar células.', '/juegos/assets/preguntas-premium/bc02-relacionar-cultivo.webp', '[{"text":"Cultivo celular","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Medio nutritivo","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"Incubador","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Línea celular","pinX":25,"pinY":75,"color":"ac-pink","correct":true},{"text":"Ensayo de viabilidad","pinX":75,"pinY":75,"color":"ac-purple","correct":true}]'::jsonb)
)
update public.evaluacion_preguntas as q
set texto = c.enunciado,
    opciones = (
      select jsonb_agg(o.etiqueta || jsonb_build_object('pregunta_imagen', c.imagen) order by o.posicion)
      from jsonb_array_elements(c.etiquetas) with ordinality as o(etiqueta, posicion)
    )
from cambios as c
where q.id = c.id and q.tipo = 'dnd';
commit;
