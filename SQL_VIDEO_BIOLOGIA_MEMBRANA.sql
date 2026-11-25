-- Ejecutar después de publicar el reproductor protegido y verificar el video en Bunny.
-- Idempotente por la ruta interna; no modifica la videoclase previa.
insert into public.videoclases
 ("TITULO","DESCRIPCION","URL_VIDEO","MATERIA","TEMA","DURACION","MINIATURA")
select
 'Modelos estructurales de la membrana plasmática',
 'Videoclase de Biología Celular · Preparatoria Ben Carson.',
 '/api/flashcards?bc_biologia_playback=1',
 'BIOLOGÍA CELULAR',
 'Estructura de la membrana plasmática',
 '8:39',
 '/assets/video-thumbnails/biologia-membrana.jpg'
where not exists (
 select 1 from public.videoclases where "URL_VIDEO"='/api/flashcards?bc_biologia_playback=1'
)
returning id,"TITULO","MATERIA","TEMA","DURACION";
