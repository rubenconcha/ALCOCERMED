-- Corrige rutas de imagenes del Capitulo 13 ya importado en Supabase.
-- Ejecuta esto despues de desplegar/subir las imagenes a:
-- /juegos/assets/capitulo13-morfo/

update public.evaluacion_preguntas
set opciones = (
  select jsonb_agg(
    jsonb_set(
      elem,
      '{pregunta_imagen}',
      to_jsonb(replace(elem->>'pregunta_imagen', './assets/capitulo13-morfo', '/juegos/assets/capitulo13-morfo'))
    )
  )
  from jsonb_array_elements(opciones::jsonb) elem
)
where evaluacion_id = '132d4d35-4a39-4dfc-8b87-5e9f30d13f01'
  and opciones::text like '%./assets/capitulo13-morfo%';
