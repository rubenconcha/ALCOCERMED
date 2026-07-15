-- Limpia las imagenes de las evaluaciones Saladin de Morfofuncion (Temas 1 y 2).
-- Conserva solamente diagramas, esquemas, modelos o fotografias que aportan a la pregunta.
-- Elimina capturas de paginas, tablas y parrafos usados como si fueran imagenes didacticas.

begin;

-- Tema 1: partir de un banco sin imagenes y volver a agregar solo recursos visuales validos.
update public.evaluacion_preguntas
set opciones = (
  select jsonb_agg(item - 'pregunta_imagen' order by ord)
  from jsonb_array_elements(opciones) with ordinality as items(item, ord)
)
where evaluacion_id = '0a8ea035-007e-5aaf-b891-e43f5402fa56';

with visuales(orden, ruta) as (
  values
    (16, '/juegos/assets/capitulo1-tema1-saladin/cap1_planos_cortes.png'),
    (17, '/juegos/assets/capitulo1-tema1-saladin/cap1_antebrazo_radio_cubito.png'),
    (18, '/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png'),
    (19, '/juegos/assets/capitulo1-tema1-saladin/cap1_antebrazo_radio_cubito.png'),
    (20, '/juegos/assets/capitulo1-tema1-saladin/cap1_planos_cortes.png'),
    (22, '/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png'),
    (23, '/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png'),
    (24, '/juegos/assets/capitulo1-tema1-saladin/cap1_cuadrantes_abdominales.png'),
    (25, '/juegos/assets/capitulo1-tema1-saladin/cap1_nueve_regiones_abdominales.png'),
    (26, '/juegos/assets/capitulo1-tema1-saladin/cap1_cavidades_corporales.png'),
    (27, '/juegos/assets/capitulo1-tema1-saladin/cap1_cavidades_corporales.png')
)
update public.evaluacion_preguntas as pregunta
set opciones = (
  select jsonb_agg(
    item || jsonb_build_object('pregunta_imagen', visuales.ruta)
    order by ord
  )
  from jsonb_array_elements(pregunta.opciones) with ordinality as items(item, ord)
)
from visuales
where pregunta.evaluacion_id = '0a8ea035-007e-5aaf-b891-e43f5402fa56'
  and pregunta.orden = visuales.orden;

-- Tema 2: estas cuatro imagenes eran tablas o parrafos, no apoyos visuales.
update public.evaluacion_preguntas
set opciones = (
  select jsonb_agg(item - 'pregunta_imagen' order by ord)
  from jsonb_array_elements(opciones) with ordinality as items(item, ord)
)
where evaluacion_id = 'a19f2789-872e-5f1e-9682-e16448dbee05'
  and orden in (0, 4, 13, 29);

update public.evaluacion_preguntas
set texto = 'Cuales son los seis elementos principales que representan cerca del 98.5% del peso corporal?'
where evaluacion_id = 'a19f2789-872e-5f1e-9682-e16448dbee05'
  and orden = 0;

commit;

-- Resultado esperado: Tema 1 = 11 preguntas visuales; Tema 2 = 26.
select
  evaluacion_id,
  count(*)::int as total_preguntas,
  count(*) filter (
    where exists (
      select 1
      from jsonb_array_elements(opciones) as opcion
      where opcion ? 'pregunta_imagen'
    )
  )::int as preguntas_con_imagen_visual,
  count(*) filter (
    where opciones::text ~ 'tema1_page_|cap2_elementos_cuerpo_humano|cap2_electrolitos_tabla|cap2_metabolismo_oxidacion_reduccion|cap2_acidos_nucleicos_texto'
  )::int as referencias_no_visuales
from public.evaluacion_preguntas
where evaluacion_id in (
  '0a8ea035-007e-5aaf-b891-e43f5402fa56',
  'a19f2789-872e-5f1e-9682-e16448dbee05'
)
group by evaluacion_id
order by evaluacion_id;
