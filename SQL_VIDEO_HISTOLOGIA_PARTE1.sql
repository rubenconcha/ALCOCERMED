-- Ejecutar después de verificar Bunny y el despliegue del reproductor protegido.
-- Idempotente por ruta interna; conserva todas las videoclases anteriores.
insert into public.videoclases
 ("TITULO","DESCRIPCION","URL_VIDEO","MATERIA","TEMA","DURACION","MINIATURA")
select
 'Clasificación de tejidos · Parte 1',
 'Clasificación del tejido epitelial · Videoclase de Preparatoria Ben Carson.',
 '/api/flashcards?bc_histologia_playback=1',
 'MORFOFUNCIÓN',
 'Histología',
 '9:50',
 '/assets/video-thumbnails/histologia-clasificacion-parte1.jpg'
where not exists (
 select 1 from public.videoclases where "URL_VIDEO"='/api/flashcards?bc_histologia_playback=1'
)
returning id,"TITULO","MATERIA","TEMA","DURACION";
