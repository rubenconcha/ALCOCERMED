-- Ejecutar tras verificar el video en Bunny y el despliegue del reproductor protegido.
-- Idempotente; conserva la parte 1 y todas las clases anteriores.
insert into public.videoclases
 ("TITULO","DESCRIPCION","URL_VIDEO","MATERIA","TEMA","DURACION","MINIATURA")
select
 'Clasificación de tejidos · Parte 2',
 'Epitelios cúbico simple, cilíndrico simple y pseudoestratificado · Preparatoria Ben Carson.',
 '/api/flashcards?bc_histologia2_playback=1',
 'MORFOFUNCIÓN',
 'Histología',
 '10:28',
 '/assets/video-thumbnails/histologia-clasificacion-parte2.jpg'
where not exists (
 select 1 from public.videoclases where "URL_VIDEO"='/api/flashcards?bc_histologia2_playback=1'
)
returning id,"TITULO","MATERIA","TEMA","DURACION";
