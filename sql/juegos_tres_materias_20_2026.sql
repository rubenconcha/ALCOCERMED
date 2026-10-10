-- Ampliación aditiva de Juegos. Conserva todas las evaluaciones, preguntas y resultados previos.
-- Las 66 afirmaciones se basan en los capítulos ya importados de los tres PDF oficiales.
-- La imagen de cada afirmación se toma de la evaluación visual correspondiente.
begin;

with hechos(codigo, verdadero, falso) as (
  values
  ('BC01P1', 'La célula es la unidad estructural y funcional de los seres vivos.', 'Una célula procariota posee un núcleo rodeado por envoltura nuclear.'),
  ('BC02P1', 'La microscopía de fluorescencia permite localizar componentes marcados en una célula.', 'La centrifugación diferencial separa orgánulos según su secuencia de ADN.'),
  ('BC03P1', 'La bicapa lipídica contiene proteínas que participan en transporte y señalización.', 'En la membrana plasmática todas las proteínas atraviesan la bicapa por completo.'),
  ('BC04P1', 'El transporte activo puede mover sustancias contra su gradiente electroquímico.', 'La difusión simple consume ATP para transportar moléculas a favor de su gradiente.'),
  ('BC05P1', 'La endocitosis incorpora material mediante vesículas que se forman en la membrana.', 'La exocitosis introduce partículas del exterior al interior celular.'),
  ('BC06P1', 'Las uniones estrechas ayudan a sellar el espacio entre células vecinas.', 'Las integrinas no participan en la unión de la célula con la matriz extracelular.'),
  ('BC07P2', 'La cromatina está formada por ADN asociado a proteínas.', 'La replicación del ADN produce ARN mensajero en lugar de nuevas cadenas de ADN.'),
  ('BC08P2', 'El espliceosoma participa en la eliminación de intrones del pre-ARN mensajero.', 'La transcripción traduce directamente codones del ARN a aminoácidos.'),
  ('BC09P2', 'Los ribosomas leen el ARN mensajero durante la síntesis de proteínas.', 'Todos los aminoácidos de una proteína son codificados por el aparato de Golgi.'),
  ('BC10P2', 'El retículo endoplasmático rugoso participa en la síntesis de proteínas destinadas a secreción.', 'Los lisosomas son el sitio principal de transcripción del ADN nuclear.'),
  ('BC11P2', 'Las mitocondrias participan en la producción de ATP mediante fosforilación oxidativa.', 'Los peroxisomas contienen los ribosomas que traducen el ARN mensajero.'),
  ('BC12P2', 'Los microtúbulos forman parte del citoesqueleto y participan en el transporte intracelular.', 'Los filamentos intermedios son la principal estructura que separa el núcleo del citoplasma.'),

  ('SP01P1', 'La promoción de la salud busca que las personas aumenten el control sobre su salud.', 'La prevención primaria se ocupa exclusivamente de rehabilitar secuelas ya establecidas.'),
  ('SP02P1', 'Una política pública en salud orienta decisiones y acciones colectivas.', 'Una política de salud se limita a la consulta individual en un hospital.'),
  ('SP03P1', 'Los programas de salud organizan acciones para responder a problemas priorizados de la población.', 'Un programa de salud no necesita definir población destinataria ni objetivos.'),
  ('SP04P1', 'La investigación social epidemiológica considera procesos sociales relacionados con la salud.', 'La perspectiva social epidemiológica excluye los determinantes sociales de la salud.'),
  ('SP05P1', 'La investigación plantea un problema antes de escoger cómo recoger datos.', 'En un proceso de investigación, el análisis siempre ocurre antes de formular la pregunta.'),
  ('SP06P1', 'Una hipótesis propone una explicación que puede contrastarse con los datos.', 'El marco teórico sustituye la necesidad de definir el objeto de estudio.'),
  ('SP07P2', 'En un muestreo probabilístico cada integrante de la población tiene una probabilidad conocida de selección.', 'Una muestra por conveniencia garantiza por sí sola la misma probabilidad de selección para todos.'),
  ('SP08P2', 'El diseño metodológico describe cómo se obtendrán y analizarán los datos.', 'El diseño metodológico se decide después de publicar los resultados.'),
  ('SP09P2', 'Un diseño cuantitativo puede medir variables y analizar sus relaciones.', 'Los estudios cuantitativos nunca utilizan datos numéricos.'),
  ('SP10P2', 'La investigación cualitativa puede explorar experiencias y significados.', 'Una entrevista en profundidad es obligatoriamente una medición de laboratorio.'),
  ('SP11P2', 'Operacionalizar una variable permite definir cómo se observará o medirá.', 'Una variable nominal siempre expresa una cantidad con decimales.'),
  ('SP12P2', 'La muestra es una parte de la población seleccionada para el estudio.', 'La población de estudio se define únicamente después de terminar el análisis.'),

  ('C12M2', 'La mielina del sistema nervioso central la producen los oligodendrocitos.', 'Las células de Schwann forman la mielina de los axones dentro del encéfalo.'),
  ('CAP13M', 'La raíz dorsal de un nervio espinal conduce información sensitiva hacia la médula.', 'La raíz ventral de un nervio espinal contiene exclusivamente fibras sensitivas aferentes.'),
  ('PC14M', 'El tronco encefálico conecta el encéfalo con la médula espinal.', 'El cerebelo es la estructura que produce directamente todas las hormonas hipofisarias.'),
  ('SNA15M', 'La división simpática participa en la respuesta corporal ante situaciones de alerta.', 'La división parasimpática carece de relación con la actividad digestiva.'),
  ('OS16M', 'La retina contiene fotorreceptores sensibles a la luz.', 'Los conductos semicirculares son el órgano principal de la audición.'),
  ('END17M', 'Las glándulas endocrinas liberan hormonas hacia el medio interno.', 'La hipófisis secreta sus hormonas únicamente hacia conductos excretores.'),
  ('SAN18M', 'Los eritrocitos transportan gran parte del oxígeno de la sangre gracias a la hemoglobina.', 'Las plaquetas son las células encargadas de transportar la mayor parte del oxígeno.'),
  ('COR19M', 'La sangre pasa de la aurícula derecha al ventrículo derecho a través de la válvula tricúspide.', 'La válvula mitral separa la aurícula derecha del ventrículo derecho.'),
  ('VAS20M', 'Las arterias conducen sangre desde el corazón hacia los tejidos.', 'Todas las venas transportan sangre oxigenada hacia los tejidos.')
), afirmaciones as (
  select codigo, 1 numero, verdadero texto, true es_verdadero from hechos
  union all
  select codigo, 2 numero, falso texto, false es_verdadero from hechos
), preparadas as (
  select e.id evaluacion_id, a.codigo, a.numero, a.texto, a.es_verdadero,
         (select q.opciones->0->>'pregunta_imagen'
            from public.evaluacion_preguntas q
           where q.evaluacion_id = e.id and coalesce(q.opciones->0->>'pregunta_imagen','') <> ''
           order by q.orden limit 1) imagen,
         (select coalesce(max(q.orden),-1) from public.evaluacion_preguntas q where q.evaluacion_id=e.id) orden_base
    from afirmaciones a join public.evaluaciones e on e.codigo=a.codigo
   where e.publicado = true
)
insert into public.evaluacion_preguntas
  (id,evaluacion_id,tipo,texto,opciones,multiple_correctas,orden,puntos,temporizador)
select md5('juegos-tf-2026:' || codigo || ':' || numero)::uuid,
       evaluacion_id, 'tf', 'Verdadero o falso: ' || texto,
       jsonb_build_array(
         jsonb_build_object('text','Verdadero','correct',es_verdadero,'color','ac-blue','pregunta_imagen',imagen),
         jsonb_build_object('text','Falso','correct',not es_verdadero,'color','ac-teal','pregunta_imagen',imagen)
       ), false, orden_base + numero, 1, 35
  from preparadas
 where imagen is not null
on conflict (id) do nothing;

-- Cada partida oficial toma 20 preguntas variadas del banco visual. Los demos,
-- las rondas con orden manual y los juegos antiguos conservan su configuración.
update public.evaluaciones e
   set config_juego = coalesce(e.config_juego,'{}'::jsonb) || '{"maxQuestions":20}'::jsonb,
       updated_at = now()
 where e.publicado = true
   and e.asignatura in ('MORFOFUNCION','BIOLOGIA CELULAR','EDUCACION PARA LA SALUD')
   and coalesce((e.config_juego->>'maxQuestions')::integer,10) = 10
   and coalesce(e.config_juego->'questionOrder','[]'::jsonb) = '[]'::jsonb
   and e.titulo !~* '(^|[[:space:]])(demo|prueba gratis|muestra gratis)([[:space:]]|$)'
   and (select count(*) from public.evaluacion_preguntas q where q.evaluacion_id=e.id) >= 20;

-- Algunas preguntas conceptuales de los temas 1 y 2 de Morfofunción no
-- tenían una imagen asignada. Conservamos sus opciones y respuestas.
update public.evaluacion_preguntas q
   set opciones = (
     select jsonb_agg(o.value || jsonb_build_object('pregunta_imagen',
       case e.codigo
         when 'T1MORF' then '/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png'
         else '/juegos/assets/capitulo2-tema2-saladin/cap2_elementos_cuerpo_humano.png'
       end) order by o.ordinality)
       from jsonb_array_elements(q.opciones) with ordinality as o(value, ordinality)
   )
  from public.evaluaciones e
 where q.evaluacion_id=e.id
   and e.codigo in ('T1MORF','T2MORF')
   and jsonb_typeof(q.opciones)='array'
   and jsonb_array_length(q.opciones)>0
   and not exists (
     select 1 from jsonb_array_elements(q.opciones) o
      where coalesce(o->>'pregunta_imagen','')<>''
   );

commit;
