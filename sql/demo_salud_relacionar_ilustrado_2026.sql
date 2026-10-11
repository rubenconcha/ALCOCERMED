-- Demo y tema 1 de Educación para la Salud: láminas y puntos específicos.
-- Reejecutable. Conserva el orden, la puntuación y el tipo de pregunta.
begin;
with cambios(id, enunciado, imagen, etiquetas) as (
  values
    ('0e799f9f-4d1b-2aec-a58a-18da85ea4359'::uuid, 'Relaciona cada escena con su acción de salud pública.', '/juegos/assets/preguntas-premium/demo-salud-prevencion.webp', '[{"text":"Salud pública","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Promoción de la salud","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"Prevención primaria","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Prevención secundaria","pinX":17,"pinY":75,"color":"ac-pink","correct":true},{"text":"Prevención terciaria","pinX":50,"pinY":75,"color":"ac-purple","correct":true},{"text":"Prevención cuaternaria","pinX":83,"pinY":75,"color":"ac-green","correct":true}]'::jsonb),
    ('813370fb-850e-5be3-c117-3cc97e3cd903'::uuid, 'Relaciona cada escena con su acción de salud pública.', '/juegos/assets/preguntas-premium/demo-salud-prevencion.webp', '[{"text":"Salud pública","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Promoción de la salud","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"Prevención primaria","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Prevención secundaria","pinX":17,"pinY":75,"color":"ac-pink","correct":true},{"text":"Prevención terciaria","pinX":50,"pinY":75,"color":"ac-purple","correct":true},{"text":"Prevención cuaternaria","pinX":83,"pinY":75,"color":"ac-green","correct":true}]'::jsonb),
    ('2fe32dbc-9da5-dbe8-35bb-82d39a50ee58'::uuid, 'Identifica los enfoques de salud representados en cada escena.', '/juegos/assets/preguntas-premium/demo-salud-aplicaciones.webp', '[{"text":"Prevención secundaria","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Prevención terciaria","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"Prevención cuaternaria","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Atención primaria de salud","pinX":17,"pinY":75,"color":"ac-pink","correct":true},{"text":"Determinantes sociales","pinX":50,"pinY":75,"color":"ac-purple","correct":true},{"text":"Carta de Ottawa","pinX":83,"pinY":75,"color":"ac-green","correct":true}]'::jsonb),
    ('54a5a1b9-61cf-58b9-cb37-b02c3dbda08b'::uuid, 'Identifica los enfoques de salud representados en cada escena.', '/juegos/assets/preguntas-premium/demo-salud-aplicaciones.webp', '[{"text":"Prevención secundaria","pinX":17,"pinY":25,"color":"ac-blue","correct":true},{"text":"Prevención terciaria","pinX":50,"pinY":25,"color":"ac-teal","correct":true},{"text":"Prevención cuaternaria","pinX":83,"pinY":25,"color":"ac-yellow","correct":true},{"text":"Atención primaria de salud","pinX":17,"pinY":75,"color":"ac-pink","correct":true},{"text":"Determinantes sociales","pinX":50,"pinY":75,"color":"ac-purple","correct":true},{"text":"Carta de Ottawa","pinX":83,"pinY":75,"color":"ac-green","correct":true}]'::jsonb)
)
update public.evaluacion_preguntas as q
set texto = c.enunciado,
    opciones = (
      select jsonb_agg(o.etiqueta || jsonb_build_object('pregunta_imagen', c.imagen) order by o.posicion)
      from jsonb_array_elements(c.etiquetas) with ordinality as o(etiqueta, posicion)
    )
from cambios c
where q.id = c.id and q.tipo = 'dnd';
commit;
