-- Muestras gratuitas de las tres materias, copiadas de los bancos visuales oficiales.
-- No modifica ni elimina los juegos anteriores. Reejecutable sin duplicados.
begin;

with fuentes(codigo_origen, codigo_demo, titulo) as (
  values
    ('T1MORF', 'DEMOMORFO26', 'Demo: Anatomía y fisiología'),
    ('BC01P1', 'DEMOBIO26', 'Demo: Biología celular'),
    ('SP01P1', 'DEMOSALUD26', 'Demo: Educación para la Salud')
)
insert into public.evaluaciones (
  id, titulo, asignatura, nivel, idioma, visibilidad, objetivo, codigo,
  publicado, created_by, created_at, updated_at, iniciado, tema, modo_sesion, config_juego
)
select md5('alcocer-demo-2026:' || f.codigo_demo)::uuid, f.titulo, e.asignatura,
       e.nivel, e.idioma, e.visibilidad,
       'Prueba gratuita de diez preguntas visuales sobre ' || e.tema,
       f.codigo_demo, true, e.created_by, now(), now(), true, e.tema, 'test',
       '{"maxQuestions":10,"questionOrder":[],"enabledPowerups":["x2","time","hint","retry"]}'::jsonb
  from fuentes f join public.evaluaciones e on e.codigo=f.codigo_origen
 where e.publicado=true
on conflict (id) do nothing;

with fuentes(codigo_origen, codigo_demo) as (
  values
    ('T1MORF', 'DEMOMORFO26'),
    ('BC01P1', 'DEMOBIO26'),
    ('SP01P1', 'DEMOSALUD26')
), candidatos as (
  select f.codigo_demo, q.*,
         row_number() over(partition by f.codigo_demo, q.tipo order by q.orden, q.id) numero_tipo
    from fuentes f join public.evaluaciones e on e.codigo=f.codigo_origen
         join public.evaluacion_preguntas q on q.evaluacion_id=e.id
   where q.tipo in ('mc','ms','tf','dnd','match')
     and coalesce(q.opciones->0->>'pregunta_imagen','')<>''
), elegidas as (
  select c.*,
         row_number() over(partition by c.codigo_demo order by
           case c.tipo when 'mc' then 1 when 'ms' then 2 when 'tf' then 3 else 4 end,
           c.orden, c.id)-1 orden_demo
    from candidatos c
   where (c.tipo='mc' and c.numero_tipo<=5)
      or (c.tipo='ms' and c.numero_tipo<=2)
      or (c.tipo='tf' and c.numero_tipo<=1)
      or (c.tipo in ('dnd','match') and c.numero_tipo<=2)
)
insert into public.evaluacion_preguntas (
  id, evaluacion_id, tipo, texto, opciones, multiple_correctas, orden, puntos, temporizador
)
select md5('alcocer-demo-question-2026:' || d.id::text)::uuid,
       e.id, d.tipo, d.texto, d.opciones, d.multiple_correctas,
       d.orden_demo, d.puntos, d.temporizador
  from elegidas d join public.evaluaciones e on e.codigo=d.codigo_demo
on conflict (id) do nothing;

commit;
