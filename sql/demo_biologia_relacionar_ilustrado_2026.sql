-- Sustituye las dos láminas genéricas del demo de Biología Celular.
-- Cada pin apunta a un objeto visible de la nueva ilustración.
-- Reejecutable: no cambia resultados ni otras preguntas.
begin;
with cambios(id, enunciado, imagen, etiquetas) as (
  values
  (
    'a851e479-0f22-02ec-f4f3-0b837aa69da8'::uuid,
    'Identifica cada concepto en las seis imágenes.',
    '/juegos/assets/preguntas-premium/demo-biologia-conceptos.webp',
    '[
      {"text":"División celular","pinX":17,"pinY":24,"color":"ac-blue","correct":true},
      {"text":"Célula procariota","pinX":50,"pinY":24,"color":"ac-teal","correct":true},
      {"text":"Célula eucariota","pinX":83,"pinY":24,"color":"ac-yellow","correct":true},
      {"text":"Virus","pinX":17,"pinY":74,"color":"ac-pink","correct":true},
      {"text":"Prion","pinX":50,"pinY":74,"color":"ac-purple","correct":true},
      {"text":"ADN","pinX":83,"pinY":74,"color":"ac-green","correct":true}
    ]'::jsonb
  ),
  (
    '776bf600-09c8-1379-375b-d2684147f830'::uuid,
    'Ubica las células y sus estructuras genéticas.',
    '/juegos/assets/preguntas-premium/demo-biologia-adn-celulas.webp',
    '[
      {"text":"Célula procariota","pinX":10,"pinY":41,"color":"ac-blue","correct":true},
      {"text":"Nucleoide","pinX":25,"pinY":33,"color":"ac-teal","correct":true},
      {"text":"Célula eucariota","pinX":91,"pinY":41,"color":"ac-yellow","correct":true},
      {"text":"Núcleo","pinX":74,"pinY":31,"color":"ac-pink","correct":true},
      {"text":"ADN","pinX":50,"pinY":78,"color":"ac-purple","correct":true}
    ]'::jsonb
  )
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
