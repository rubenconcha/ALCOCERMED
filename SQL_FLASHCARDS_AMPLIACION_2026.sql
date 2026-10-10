-- Tarjetas originales, redactadas a partir de los tres PDF oficiales del curso.
-- SALUD PUBLICA es la clave histórica de la base de datos; la interfaz muestra Educación para la Salud.
-- Importación aditiva e idempotente: conserva las tarjetas y el progreso ya existentes.
BEGIN;

-- salud: páginas PDF 18-20 | SALUD PUBLICA / niveles de prevencion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'niveles de prevencion', 'Una persona está sana y recibe una vacuna. ¿Qué se intenta evitar?', 'Que la enfermedad aparezca; por eso es prevención primaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿En qué momento actúa la prevención primaria?', 'Antes de que aparezca la enfermedad, reduciendo la exposición a sus factores de riesgo.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'Si una comunidad mejora el acceso a agua segura para evitar infecciones, ¿qué prevención realiza?', 'Prevención primaria, porque actúa antes de que se produzca la enfermedad.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿Qué busca un programa de detección temprana del cáncer cervicouterino?', 'Encontrar la enfermedad a tiempo para tratarla antes de que progrese: prevención secundaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿Por qué un tamizaje no se considera prevención primaria?', 'Porque busca una enfermedad que ya podría estar presente, aunque todavía no cause síntomas.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'Una prueba de VIH permite iniciar tratamiento oportuno. ¿Qué nivel de prevención representa la detección?', 'Prevención secundaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'Una persona ya tuvo un infarto y empieza rehabilitación. ¿Cuál es el objetivo preventivo?', 'Reducir secuelas y recuperar funciones; es prevención terciaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿En qué se diferencia la prevención terciaria de la secundaria?', 'La secundaria busca detectar y tratar temprano; la terciaria limita complicaciones de una enfermedad ya establecida.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿Qué pretende la reinserción social tras una enfermedad mental?', 'Disminuir sus consecuencias y favorecer la recuperación funcional; corresponde a prevención terciaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'Un examen sin indicación puede iniciar tratamientos innecesarios. ¿Qué nivel de prevención pide detenerse?', 'La prevención cuaternaria, que busca evitar daños por exceso de intervención médica.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿Qué dos riesgos intenta reducir la prevención cuaternaria?', 'El sobrediagnóstico y el sobretratamiento.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿La prevención se limita a dar medicamentos?', 'No. También incluye reducir riesgos, detectar temprano y evitar secuelas o intervenciones dañinas.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿Qué pregunta te ayuda a distinguir prevención primaria de secundaria?', 'Si la enfermedad aún no ha aparecido, es primaria; si se busca detectarla temprano, es secundaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'Una citología cervical busca identificar lesiones tempranas. ¿A qué nivel corresponde?', 'A la prevención secundaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿Qué diferencia central hay entre promoción de la salud y prevención de una enfermedad?', 'La promoción fortalece condiciones y capacidades para el bienestar; la prevención se centra en riesgos y enfermedades.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'Si se busca reducir la discapacidad después de una enfermedad, ¿qué nivel se está aplicando?', 'Prevención terciaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', '¿Por qué la vacunación es un ejemplo clásico de prevención primaria?', 'Porque protege antes de que la persona contraiga la enfermedad que se quiere evitar.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 14-16 | SALUD PUBLICA / promocion de la salud
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'promocion de la salud', 'Según la Carta de Ottawa, ¿qué debe ganar una persona para mejorar su salud?', 'Mayor capacidad y medios para controlar los factores que influyen en ella.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿La promoción de la salud se dirige solo a personas enfermas?', 'No. Involucra a la población en su conjunto y a sus condiciones de vida.'),
    ('SALUD PUBLICA', 'promocion de la salud', 'Un barrio pide iluminación y espacios seguros para caminar. ¿Qué área de promoción refleja?', 'Crear ambientes que favorezcan la salud.'),
    ('SALUD PUBLICA', 'promocion de la salud', 'Si una comunidad decide sus prioridades sanitarias junto al equipo de salud, ¿qué se fortalece?', 'La acción comunitaria y la participación en las decisiones.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Qué pasa si un programa se diseña sin escuchar a la comunidad?', 'Puede perder participación real y convertirse en una acción asistencialista.'),
    ('SALUD PUBLICA', 'promocion de la salud', 'Un municipio revisa el efecto de sus decisiones de transporte sobre la salud. ¿Qué área aplica?', 'La construcción de políticas públicas saludables.'),
    ('SALUD PUBLICA', 'promocion de la salud', 'En una escuela enseñan habilidades para elegir alimentos saludables. ¿Qué área de promoción es?', 'Desarrollar habilidades personales.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Qué significa reorientar los servicios de salud en la Carta de Ottawa?', 'Dar más espacio a la promoción y a la atención primaria, además de la atención curativa.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Basta con repartir folletos para promover salud?', 'No. También hacen falta entornos favorables, participación, políticas y habilidades para actuar.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Por qué la educación y la legislación pueden trabajar juntas en promoción?', 'Porque la promoción combina métodos complementarios para cambiar capacidades y condiciones de vida.'),
    ('SALUD PUBLICA', 'promocion de la salud', 'Una familia no puede elegir agua segura si su barrio carece de ella. ¿Qué recuerda este caso?', 'Que la salud también depende de condiciones del entorno, no solo de decisiones individuales.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Qué papel tiene el personal de atención primaria en promoción de la salud?', 'Apoyar y facilitar que personas y comunidades mejoren sus condiciones de salud.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Cuál es el foco de la promoción cuando habla de determinantes?', 'Actuar sobre causas sociales, ambientales y conductuales que influyen en la salud.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Por qué la promoción requiere colaboración fuera del consultorio?', 'Porque educación, vivienda, trabajo y otros sectores también determinan las oportunidades de estar sano.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Qué busca la autoayuda comunitaria dentro de la promoción?', 'Que las personas participen y encuentren formas propias de mejorar la salud de su comunidad.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Qué cinco áreas de acción resume la Carta de Ottawa?', 'Políticas saludables, ambientes favorables, acción comunitaria, habilidades personales y reorientación de servicios.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 16-18 | SALUD PUBLICA / atencion primaria de salud
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Una familia consulta primero en su centro de salud cercano. ¿Qué función cumple la atención primaria?', 'Ser el primer contacto de la persona, la familia y la comunidad con el sistema de salud.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Qué pide Alma-Ata sobre la participación de la comunidad en atención primaria?', 'Que las personas y familias participen plenamente en una atención esencial y accesible.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Un servicio está lejos y el transporte es caro. ¿Qué atributo de atención primaria falla?', 'La accesibilidad, porque hay barreras geográficas y económicas.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'El centro de salud adapta la atención a la lengua de la familia. ¿Qué barrera está reduciendo?', 'Una barrera cultural de acceso.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Qué significa coordinación en la atención primaria?', 'Conectar acciones del equipo y de los distintos niveles para mantener la continuidad de la atención.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Un equipo atiende prevención, tratamiento y rehabilitación. ¿Qué atributo demuestra?', 'Integralidad.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Por qué ver a la misma familia a lo largo de los años aporta valor?', 'Favorece la longitudinalidad: conocer su historia y acompañar sus problemas en el tiempo.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Qué diferencia hay entre accesibilidad y longitudinalidad?', 'La primera permite llegar al servicio; la segunda mantiene el seguimiento a lo largo del tiempo.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Al evaluar un centro, ¿qué significa mirar su estructura?', 'Revisar recursos como personal, infraestructura, equipos e insumos.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Al evaluar un centro, ¿qué significa mirar su proceso?', 'Observar las actividades y procedimientos que realiza el equipo para brindar atención.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Al evaluar un centro, ¿qué significa mirar sus resultados?', 'Comprobar los efectos de la atención, como salud, satisfacción, equidad y uso de recursos.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Hay equipos, pero las derivaciones se pierden. ¿El problema principal es de estructura o proceso?', 'De proceso: falla la forma en que se coordinan las acciones de atención.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Por qué la atención primaria no equivale solo a curar enfermedades leves?', 'Porque también incluye promoción, prevención, rehabilitación y seguimiento integral.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Qué tres ámbitos se mencionan como primer contacto con la atención primaria?', 'El individuo, la familia y la comunidad.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Un paciente recibe una derivación y después continúa sus controles en el centro. ¿Qué se conserva?', 'La continuidad de la atención mediante coordinación entre niveles.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Qué cuatro atributos básicos debes reconocer en la atención primaria?', 'Accesibilidad, coordinación, integralidad y longitudinalidad.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 2-16 | SALUD PUBLICA / educacion en salud
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'educacion en salud', 'Después de una charla, un grupo sabe qué hacer pero no puede practicarlo. ¿Qué le falta a la educación en salud?', 'Ayudar a desarrollar habilidades y condiciones para convertir lo aprendido en prácticas sostenibles.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿A quiénes incluye la educación en salud además de cada paciente?', 'A las familias y a las comunidades.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Qué tres aspectos de la persona intenta transformar la educación en salud?', 'Conocimientos, actitudes y prácticas.'),
    ('SALUD PUBLICA', 'educacion en salud', 'Una estudiante explica el lavado de manos y luego practica con su comunidad. ¿Qué aporta la segunda parte?', 'Pasa de la información a una habilidad y una práctica concreta.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Por qué se habla de un proceso permanente de educación en salud?', 'Porque aprender y ajustar conductas saludables requiere continuidad y reflexión, no una sola charla.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Qué significa autogestionar la salud?', 'Tomar decisiones informadas y participar activamente en el cuidado propio, familiar y comunitario.'),
    ('SALUD PUBLICA', 'educacion en salud', 'Si una campaña ignora costumbres locales, ¿qué dimensión importante está dejando fuera?', 'El contexto cultural y social en el que las personas aprenden y toman decisiones.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Por qué la comunicación en educación para la salud debe ir en ambos sentidos?', 'Para escuchar dudas y experiencias de la comunidad, además de compartir información.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿La educación en salud puede por sí sola eliminar la pobreza o mejorar todas las viviendas?', 'No. Es una herramienta importante, pero esos determinantes exigen políticas y acciones sociales más amplias.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Qué enfoque reconoce factores biológicos, psicológicos y sociales al educar en salud?', 'El enfoque biopsicosocial.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Qué busca el empoderamiento de la comunidad en educación sanitaria?', 'Que pueda comprender opciones y participar en decisiones que afectan su bienestar.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Cómo se relaciona la educación en salud con la prevención?', 'Ayuda a reconocer riesgos y a adoptar prácticas que disminuyan la posibilidad de enfermar.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Cómo se relaciona la educación en salud con la promoción?', 'Fortalece capacidades personales y comunitarias para mejorar condiciones de bienestar.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Por qué enseñar una conducta saludable sin considerar el entorno puede fallar?', 'Porque la posibilidad de practicarla depende también de recursos, costumbres y condiciones de vida.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Qué nivel de vida busca sostener la educación para la salud en la persona y su entorno?', 'Un estilo de vida saludable con cuidado personal, familiar y comunitario.'),
    ('SALUD PUBLICA', 'educacion en salud', 'Una comunidad identifica sus problemas y propone soluciones con el equipo de salud. ¿Qué papel desempeña?', 'Participa activamente en su aprendizaje y en el cuidado colectivo de la salud.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 2-4 | SALUD PUBLICA / concepto de salud y determinantes
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Cómo veía la salud el enfoque biomédico clásico?', 'Principalmente como ausencia de enfermedad, con énfasis en diagnóstico y tratamiento.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Qué añadió el enfoque biopsicosocial a la idea de salud?', 'La interacción de factores biológicos, psicológicos y sociales.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', 'Según la definición de la OMS citada en el material, ¿qué tres dimensiones integran el bienestar?', 'La física, la mental y la social.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', 'Una persona tiene trabajo inseguro y mala vivienda. ¿Por qué eso importa para su salud?', 'Porque empleo y vivienda son determinantes sociales que condicionan cómo vive y enferma.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿En qué momentos de la vida influyen los determinantes sociales?', 'En las condiciones en que las personas nacen, crecen, trabajan y envejecen.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Qué diferencia hay entre un factor individual y uno ambiental?', 'El individual pertenece a la persona, como edad o genética; el ambiental corresponde al entorno, como aire, agua o vivienda.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿El hábito de fumar es un determinante conductual o político?', 'Conductual, porque forma parte de las prácticas de la persona.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Cómo puede una ley influir en la salud aunque no sea un tratamiento médico?', 'Puede modificar riesgos, servicios y condiciones de vida de toda la población.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Qué distingue una inequidad en salud de cualquier diferencia entre personas?', 'Que la inequidad es una diferencia injusta y evitable vinculada a condiciones desiguales.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', 'Un barrio tiene agua segura y otro no. ¿Qué medida apunta a la equidad?', 'Actuar sobre esa diferencia para que ambos tengan una oportunidad similar de mantenerse sanos.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Qué sucede con las enfermedades predominantes durante la transición epidemiológica descrita en el PDF?', 'Disminuye el peso relativo de infecciones y aumentan las enfermedades crónicas no transmisibles.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', 'Si la población vive más años y cambian las principales causas de muerte, ¿qué dos transiciones se relacionan?', 'La demográfica y la epidemiológica.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Por qué el aumento de enfermedades crónicas exige algo más que atención hospitalaria?', 'Requiere prevención, hábitos saludables y trabajo con los factores de riesgo de la comunidad.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Qué ejemplos da el material de condiciones de vida diarias que afectan la salud?', 'Vivienda, alimentación y acceso a servicios.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Qué ejemplos da de factores estructurales de la salud?', 'Políticas, distribución de la riqueza y educación.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Por qué la salud se considera también un derecho y no solo una condición biológica?', 'Porque todas las personas deben tener oportunidades y condiciones dignas para alcanzar bienestar.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 4-5 | SALUD PUBLICA / funciones de salud publica
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Cuál es la meta general de la salud pública según el material?', 'Proteger y mejorar la salud de las poblaciones mediante esfuerzos organizados.'),
    ('SALUD PUBLICA', 'funciones de salud publica', 'Un laboratorio informa un aumento inesperado de casos. ¿Qué función permite detectar la señal?', 'La vigilancia y el monitoreo de datos de salud.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Para qué se recogen y analizan datos en salud pública?', 'Para reconocer riesgos, brotes y prioridades antes de decidir acciones.'),
    ('SALUD PUBLICA', 'funciones de salud publica', 'Si se inspeccionan alimentos vendidos en una feria, ¿qué función se ejerce?', 'Protección de la salud mediante el control de riesgos sanitarios.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Qué riesgos ambientales menciona el material que deben controlarse?', 'Los relacionados con alimentos, agua y aire.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿La vacunación se ubica en protección, prevención o vigilancia?', 'En prevención de enfermedades.'),
    ('SALUD PUBLICA', 'funciones de salud publica', 'Un programa de control de vectores busca reducir nuevos casos. ¿Qué función cumple?', 'Prevención de enfermedades.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Qué diferencia la promoción de la prevención dentro de las funciones públicas?', 'La promoción crea condiciones y capacidades saludables; la prevención reduce riesgos o casos de enfermedad.'),
    ('SALUD PUBLICA', 'funciones de salud publica', 'Una ciudad crea parques accesibles para actividad física. ¿Qué función se ve principalmente?', 'Promoción de la salud mediante un entorno favorable.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Qué añade la participación comunitaria a la identificación de problemas?', 'La experiencia y las prioridades de quienes viven las condiciones de salud del lugar.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Quiénes pueden organizar acciones de salud pública según el material?', 'La sociedad, el Estado y las comunidades.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Por qué una sola consulta clínica no reemplaza la vigilancia poblacional?', 'Porque la consulta mira a una persona; la vigilancia identifica patrones y riesgos en grupos.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Qué función se activa cuando la comunidad participa en la toma de decisiones sanitarias?', 'Participación comunitaria y gobernanza.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Qué relación hay entre protección del agua y prevención de infecciones?', 'Controlar el agua elimina una exposición ambiental que podría causar enfermedad.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Qué cinco funciones esenciales resume el material?', 'Vigilancia, protección, prevención, promoción y participación comunitaria.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Por qué la salud pública necesita esfuerzo organizado?', 'Porque proteger a una población exige coordinar información, recursos, servicios y decisiones colectivas.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 581-613 | BIOLOGIA CELULAR / ciclo celular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Una célula se prepara para dividirse. ¿Qué tres tareas principales debe completar antes de producir dos hijas?', 'Crecer, duplicar su material genético y repartirlo durante la división.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué la interfase no es un descanso verdadero?', 'Porque la célula sintetiza moléculas y orgánulos, crece y replica su ADN.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué tres fases forman la interfase?', 'G1, S y G2.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿En qué orden transcurre un ciclo celular típico desde G1 hasta la división?', 'G1, S, G2 y fase M.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Una célula está fabricando proteínas y orgánulos antes de copiar el ADN. ¿En qué fase se encuentra?', 'En G1.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué significa la letra S del ciclo celular?', 'Síntesis: es la fase en que se replica el ADN.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Además de ADN, ¿qué proteínas se sintetizan durante la fase S para empaquetarlo?', 'Las histonas.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué estructura celular comienza a duplicarse en S para ayudar después al huso mitótico?', 'El centrosoma y sus centríolos.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Después de copiar su ADN, la célula termina de crecer y prepara la mitosis. ¿En qué fase está?', 'En G2.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué dos procesos se solapan en la fase M?', 'La cariocinesis o división nuclear y la citocinesis o división del citoplasma.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué sucede con el núcleo durante la cariocinesis?', 'Se divide para formar dos núcleos hijos con cromosomas equivalentes.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué separa físicamente a las dos células hijas?', 'La citocinesis, que reparte el citoplasma.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿En qué fase mitótica se alinean los cromosomas en el centro de la célula?', 'En la metafase.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Cuándo se separan las cromátidas hermanas hacia polos opuestos?', 'Durante la anafase.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Una nueva envoltura rodea cada grupo de cromosomas. ¿Qué etapa de la mitosis observas?', 'La telofase.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué estructura se contrae para dividir el citoplasma de una célula animal?', 'Un anillo de actina y miosina en la zona ecuatorial.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Antes de iniciar la fase S, ¿qué revisa el punto de control G1?', 'El estado del ADN, el tamaño celular y las condiciones del medio.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué puede hacer una célula si detecta un daño importante en un punto de control?', 'Detener el ciclo para intentar repararlo o activar muerte celular programada.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿En qué tres transiciones se sitúan los puntos de control principales?', 'Al final de G1, al final de G2 y durante la fase M.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué tejido se renueva constantemente y se considera lábil?', 'La piel, las mucosas o la médula ósea.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué el hígado se considera un tejido estable?', 'Porque suele estar quiescente, pero sus células pueden volver a dividirse tras un estímulo adecuado.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué caracteriza a un tejido permanente en cuanto a proliferación?', 'Sus células especializadas prácticamente no vuelven a dividirse.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Una célula sale del ciclo activo pero puede regresar tras un estímulo. ¿Qué estado es?', 'G0 o quiescencia reversible.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué son los orígenes de replicación?', 'Sitios del ADN donde empieza la apertura de la doble hélice para copiarla.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué abre la doble hélice y genera una horquilla de replicación?', 'Las helicasas del complejo Mcm.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué los telómeros se acortan en muchas células tras repetidas divisiones?', 'Porque la síntesis de la hebra retardada no completa del todo el extremo del cromosoma.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué le ocurre a una célula cuando el acortamiento telomérico limita nuevas divisiones?', 'Puede entrar en senescencia replicativa.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué significa Cdk en el control del ciclo celular?', 'Quinasa dependiente de ciclina.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué hacen las Cdk con muchas proteínas que regulan el ciclo?', 'Las fosforilan para cambiar su actividad y permitir la progresión celular.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Si una Cdk está presente pero inactiva, ¿qué proteína reguladora suele necesitar?', 'Una ciclina adecuada a la fase del ciclo.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué las ciclinas se llaman así?', 'Porque sus niveles suben y bajan de forma cíclica durante la vida de la célula.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué cambia en la Cdk cuando se une una ciclina?', 'Su conformación expone o activa el centro catalítico de la quinasa.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué complejo de Cdk y ciclina ayuda especialmente a iniciar la mitosis?', 'Cdk1 unida a ciclina B.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿En qué transición aumenta la actividad de Cdk1-ciclina B?', 'En el paso de G2 a la fase M.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué puede pasar si una ciclina se acumula sin degradarse cuando corresponde?', 'La célula puede mantener señales de avance que deberían apagarse.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué etiqueta molecular marca muchas ciclinas para su degradación?', 'La ubiquitina.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Dónde se degradan las ciclinas marcadas con ubiquitina?', 'En el proteasoma.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué complejo ayuda a degradar reguladores durante la mitosis y permite avanzar a anafase?', 'El complejo promotor de la anafase, APC/C.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué dos familias de proteínas inhibidoras de Cdk destaca el texto?', 'Ink4 y Cip/Kip.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué Cdk bloquean especialmente las proteínas de la familia Ink4?', 'Cdk4 y Cdk6.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué una Cdk no depende solo de la presencia de ciclina?', 'También se regula mediante fosforilación y proteínas inhibidoras.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué quinasa mantiene inactivo al complejo Cdk1-ciclina B durante parte de G2?', 'Wee1.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué podría pasar si Wee1 deja entrar prematuramente a una célula en mitosis?', 'La célula podría dividirse antes de alcanzar un tamaño adecuado.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué fosfatasa ayuda a activar Cdk1-ciclina B al final de G2?', 'Cdc25.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué evalúa el punto de control G2 antes de iniciar la mitosis?', 'Que el ADN se haya replicado adecuadamente y que la célula esté preparada para dividirse.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué proteína actúa como freno de la entrada en fase S al unirse a E2F?', 'La proteína de retinoblastoma, Rb.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué necesita E2F para activar genes de la fase S?', 'Liberarse de la inhibición de Rb.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Cómo se libera E2F del freno de Rb durante G1?', 'Por fosforilación de Rb a cargo de complejos Cdk-ciclina.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Una célula recibe señales de crecimiento y activa ciclina D. ¿Qué Cdk se asocian con ella?', 'Cdk4 y Cdk6.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué complejo G1/S aumenta la fosforilación de Rb al acercarse la fase S?', 'Cdk2-ciclina E.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué genes ayuda a activar E2F después de liberarse de Rb?', 'Genes necesarios para replicar ADN y avanzar por la fase S.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué el paso de G1 a S se considera una decisión importante?', 'Porque la célula se compromete a duplicar su material genético antes de dividirse.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué debe revisar una célula que recibió una señal de crecimiento antes de copiar el ADN?', 'Que tenga condiciones y tamaño suficientes y que su ADN no presente daño importante.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué hace un factor de crecimiento externo con la maquinaria del ciclo?', 'Puede activar señales que favorecen el avance, especialmente por G1.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Puede una célula volver de G0 al ciclo si recibe un estímulo adecuado?', 'Sí, si su quiescencia es reversible.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué situación bloquearía normalmente la transición G1/S?', 'Daño del ADN no reparado o condiciones desfavorables para duplicarlo.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué proteína une a las cromátidas hermanas antes de separarse?', 'El complejo de cohesinas.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué debe ocurrir con los cromosomas antes de que empiece la anafase?', 'Todos deben estar unidos correctamente al huso mitótico.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Si un cromosoma no se unió bien al huso, ¿qué punto de control debe frenar la división?', 'El punto M o control de ensamblaje del huso.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué pasaría si la célula separara cromátidas antes de revisar el huso?', 'Las células hijas podrían recibir números incorrectos de cromosomas.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué proteína mantiene inactiva a separasa antes de la anafase?', 'La segurina.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué hace APC/C con la segurina al iniciarse la anafase?', 'La marca para degradación y libera la actividad de separasa.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué corta separasa para permitir que las cromátidas hermanas se aparten?', 'Las cohesinas que las mantenían unidas.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué se degradan ciclinas mitóticas al finalizar la división?', 'Para apagar las señales de mitosis y permitir la salida hacia G1.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué quiere decir retrocontrol en el ciclo celular?', 'Revisar después de avanzar si hubo errores y detener el proceso si hace falta.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué dos grandes problemas detecta el retrocontrol descrito en el capítulo?', 'Errores de unión al huso mitótico y lesiones del ADN.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Si se rompe el ADN antes de mitosis, ¿por qué conviene detener el ciclo?', 'Para repararlo antes de transmitir la lesión a células hijas.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿En qué fases se revisa el estado del ADN antes de seguir?', 'En puntos de control como G1 y G2; una lesión también puede detener otras fases.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué proteína se activa frente a daño del ADN y puede frenar el ciclo?', 'p53.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué opciones tiene una célula con ADN dañado si la reparación fracasa?', 'Puede entrar en senescencia o activar apoptosis.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué p53 se considera protector frente a la transformación tumoral?', 'Porque limita la proliferación de células con daño genético.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué proteína mantiene baja la actividad de p53 cuando no hay daño?', 'Mdm2, que la inhibe y favorece su degradación.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué quinasas conectan sensores de lesión del ADN con la respuesta de control?', 'ATM y ATR.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué quinasas de control pueden inhibir a Cdc25 tras detectar daño?', 'Chk1 y Chk2.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué inhibidor de Cdk puede inducir p53 para detener G1/S?', 'p21.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué puede pasar si falla una ruta que detecta daño del ADN?', 'La célula podría seguir dividiéndose con alteraciones genéticas.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué distingue quiescencia de senescencia?', 'La quiescencia puede revertirse; la senescencia bloquea de modo duradero la proliferación.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Una célula senescente recibe factores de crecimiento. ¿Por qué no suele reanudar el ciclo?', 'Porque su bloqueo proliferativo es estable, a diferencia de G0 reversible.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué significa apoptosis como posible destino de una célula dañada?', 'Muerte celular programada y controlada.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué la división no es el único destino posible de una célula?', 'También puede diferenciarse, permanecer quiescente, adaptarse al estrés o morir.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué aporta la matriz extracelular al control de proliferación?', 'Señales que la célula recibe mediante receptores como las integrinas.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Las integrinas sirven solo para pegar una célula a su entorno?', 'No. También transmiten señales que influyen en crecimiento y supervivencia.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué otras señales del microambiente pueden promover o frenar la división?', 'Factores de crecimiento y citocinas.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué significa diferenciación celular?', 'Adquirir rasgos y funciones especializadas dentro de un tejido.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Si una célula aumenta de tamaño frente a una mayor demanda, ¿qué adaptación presenta?', 'Hipertrofia.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Si aumenta el número de células de un tejido, ¿cómo se llama la adaptación?', 'Hiperplasia.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Si un tejido pierde tamaño por menor actividad, ¿qué adaptación puede producirse?', 'Atrofia.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué significa metaplasia como respuesta adaptativa?', 'Cambio de un tipo celular diferenciado por otro ante condiciones persistentes.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué el estrés celular prolongado puede terminar en muerte?', 'Porque la célula puede superar su capacidad de adaptación y sufrir lesiones irreversibles.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué estructura protege los extremos cromosómicos mientras se replica el ADN?', 'Los telómeros.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué enzima puede compensar el acortamiento de los telómeros en ciertas células?', 'La telomerasa.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Por qué se forman horquillas de replicación durante la fase S?', 'Porque las dos hebras del ADN se separan y sirven de molde para copiarse.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué son los fragmentos de Okazaki?', 'Segmentos cortos que se sintetizan de forma discontinua en la hebra retardada.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué estructura organiza el huso que separará cromosomas?', 'El centrosoma duplicado.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué sucede con las cromátidas durante la profase y la metafase?', 'Se condensan y se organizan para ser repartidas con precisión.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Cuál es el resultado esperado de una mitosis normal en una célula somática?', 'Dos núcleos hijos con la misma información cromosómica que el núcleo progenitor.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 653-657 | BIOLOGIA CELULAR / biologia celular del cancer
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Por qué el cáncer se relaciona con genes aunque también influyan el ambiente y la edad?', 'Porque aparecen alteraciones genéticas y epigenéticas que cambian el control de la célula.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué equilibrio celular se altera cuando surge un tumor?', 'El que regula proliferación, diferenciación y muerte celular programada.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Todos los cánceres se originan y evolucionan de la misma manera?', 'No. Son enfermedades variadas con mecanismos comunes y rasgos propios de cada tipo.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Por qué la incidencia del cáncer suele aumentar con la edad según el texto?', 'Porque se acumulan alteraciones celulares a lo largo de la vida.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', 'Una célula produce sus propias señales de crecimiento. ¿Qué ventaja tumoral obtiene?', 'Puede mantener la proliferación sin depender de los controles habituales del tejido.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué ocurre cuando una célula tumoral evade los frenos de proliferación?', 'Continúa avanzando en el ciclo y multiplicándose pese a señales que deberían detenerla.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Cómo ayuda a un tumor evitar la apoptosis?', 'Permite que sobrevivan células alteradas que normalmente serían eliminadas.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', 'Si aumenta Bcl-2 y disminuyen proteínas proapoptóticas, ¿qué proceso se dificulta?', 'La apoptosis o muerte celular programada.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Por qué la inestabilidad genómica favorece la progresión tumoral?', 'Genera nuevas mutaciones entre las que pueden surgir ventajas de crecimiento o supervivencia.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué papel puede tener una inflamación crónica en ciertos tumores?', 'Modificar el microambiente y favorecer el desarrollo de células neoplásicas.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué significa que un tumor reprograme su metabolismo?', 'Que cambia el uso de nutrientes y energía para sostener su proliferación.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué sistema de defensa pueden evadir las células cancerosas?', 'La respuesta inmunitaria, incluida la acción de linfocitos y células NK.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Cuál es una diferencia clave entre tumor benigno y maligno?', 'El benigno permanece localizado; el maligno puede invadir tejidos y diseminarse.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', 'Un tumor atraviesa la membrana basal e invade el tejido vecino. ¿Qué comportamiento muestra?', 'Comportamiento maligno e invasivo.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Por qué se habla de evolución de las células dentro de un tumor?', 'Porque las alteraciones se acumulan y algunas células adquieren ventajas frente a otras.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué vías puede usar un tumor maligno para diseminarse a distancia?', 'La vía sanguínea, linfática o serosa, según el tipo de tumor.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 743-749 | MORFOFUNCION / corazon
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'corazon', '¿En qué región del tórax se encuentra el corazón?', 'En el mediastino, entre los pulmones y detrás del esternón.'),
    ('MORFOFUNCION', 'corazon', '¿Cómo se llama el extremo inferior del corazón que apunta hacia el diafragma?', 'El ápice.'),
    ('MORFOFUNCION', 'corazon', '¿Qué parte amplia y superior del corazón se relaciona con los grandes vasos?', 'La base.'),
    ('MORFOFUNCION', 'corazon', '¿Qué saco de doble pared rodea al corazón?', 'El pericardio.'),
    ('MORFOFUNCION', 'corazon', '¿Qué capa del corazón hace el trabajo muscular de bombeo?', 'El miocardio.'),
    ('MORFOFUNCION', 'corazon', '¿Qué capa recubre por dentro las cámaras cardíacas y las válvulas?', 'El endocardio.'),
    ('MORFOFUNCION', 'corazon', '¿Cómo se llama la capa superficial de la pared cardíaca?', 'El epicardio.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué el ventrículo izquierdo tiene una pared más gruesa que el derecho?', 'Porque debe bombear sangre a toda la circulación sistémica y realiza más trabajo.'),
    ('MORFOFUNCION', 'corazon', '¿Qué lado del corazón envía sangre hacia los pulmones?', 'El derecho.'),
    ('MORFOFUNCION', 'corazon', '¿Qué lado del corazón recibe la sangre oxigenada que viene de los pulmones?', 'El izquierdo.'),
    ('MORFOFUNCION', 'corazon', '¿Qué válvula separa la aurícula derecha del ventrículo derecho?', 'La tricúspide.'),
    ('MORFOFUNCION', 'corazon', '¿Qué válvula separa la aurícula izquierda del ventrículo izquierdo?', 'La mitral o bicúspide.'),
    ('MORFOFUNCION', 'corazon', '¿Cuántas valvas tiene la válvula tricúspide?', 'Tres.'),
    ('MORFOFUNCION', 'corazon', '¿Cuántas valvas tiene la válvula mitral?', 'Dos.'),
    ('MORFOFUNCION', 'corazon', '¿Para qué sirven las cuerdas tendinosas de las válvulas auriculoventriculares?', 'Conectan sus valvas con los músculos papilares y evitan que se inviertan durante la contracción.'),
    ('MORFOFUNCION', 'corazon', '¿Qué estructura de tejido conjuntivo sostiene las válvulas y las aberturas cardíacas?', 'El esqueleto fibroso del corazón.'),
    ('MORFOFUNCION', 'corazon', '¿Qué circuito lleva la sangre a los tejidos del cuerpo?', 'La circulación sistémica.'),
    ('MORFOFUNCION', 'corazon', '¿Qué circuito lleva la sangre del corazón a los pulmones y de regreso?', 'La circulación pulmonar.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué el corazón necesita válvulas en sus cámaras y grandes arterias?', 'Para mantener el flujo de sangre en una sola dirección.'),
    ('MORFOFUNCION', 'corazon', '¿Qué vasos reciben el nombre de grandes vasos por su diámetro?', 'Las arterias y venas mayores que entran y salen del corazón.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 883-920 | MORFOFUNCION / aparato respiratorio
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'aparato respiratorio', 'Antes de que el aire llegue a los pulmones, ¿qué tres cosas hace la nariz con él?', 'Lo calienta, lo humedece y ayuda a limpiarlo.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cómo se llaman las aberturas anteriores de la nariz por donde entra el aire?', 'Narinas u orificios nasales.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué estructura divide la cavidad nasal en dos fosas?', 'El tabique nasal.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué los cornetes nasales ayudan a acondicionar el aire?', 'Hacen turbulento su recorrido y aumentan el contacto con la mucosa.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'El aire pasa por debajo de un cornete nasal. ¿Cómo se llama ese pasaje?', 'Meato nasal.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué parte del techo de la cavidad nasal detecta olores?', 'El epitelio olfativo.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué estructura separa la cavidad nasal de la boca y permite respirar mientras masticas?', 'El paladar, especialmente su porción dura.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué cartílago de la laringe forma la prominencia conocida como manzana de Adán?', 'El cartílago tiroides.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué cartílago en forma de anillo conecta la laringe con la tráquea?', 'El cartílago cricoides.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué sucede cuando el aire pasa entre cuerdas vocales aproximadas?', 'Las hace vibrar y produce sonido.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Si las cuerdas vocales están más tensas, ¿el sonido tiende a ser agudo o grave?', 'Más agudo.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué la tráquea no colapsa fácilmente al inspirar?', 'Porque está reforzada por anillos de cartílago hialino en forma de C.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué los anillos traqueales están abiertos por detrás?', 'Para dejar espacio a la expansión del esófago cuando pasa un bolo alimenticio.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'El moco atrapa polvo en la tráquea. ¿Qué lo desplaza luego hacia la faringe?', 'Los cilios del epitelio respiratorio.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cómo se llama la limpieza que hacen el moco y los cilios en la vía aérea?', 'Transporte mucociliar.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿En qué dos conductos principales se bifurca la tráquea?', 'En los bronquios principales derecho e izquierdo.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué entra al pulmón por el hilio además del bronquio principal?', 'Vasos sanguíneos, vasos linfáticos y nervios.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cuántos lóbulos tiene el pulmón derecho?', 'Tres: superior, medio e inferior.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué pulmón tiene una escotadura relacionada con el corazón?', 'El izquierdo.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué ramas marcan el final de la zona conductora del árbol bronquial?', 'Los bronquiolos terminales.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cuántos lóbulos tiene el pulmón izquierdo?', 'Dos: superior e inferior.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué el pulmón izquierdo tiene menos espacio que el derecho?', 'Porque el corazón ocupa parte del lado izquierdo del mediastino.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué parte del pulmón descansa sobre el diafragma?', 'La base pulmonar.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cómo se llama la punta superior del pulmón que se proyecta hacia la clavícula?', 'El vértice.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué bronquios llevan aire a cada lóbulo pulmonar?', 'Los bronquios lobulares o secundarios.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Después de los bronquios lobulares, ¿qué ramas ventilan segmentos broncopulmonares?', 'Los bronquios segmentarios.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cuál es la diferencia funcional entre un bronquiolo terminal y uno respiratorio?', 'El terminal solo conduce aire; el respiratorio ya tiene alvéolos y participa en intercambio gaseoso.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué estructuras siguen a los bronquiolos respiratorios antes de los sacos alveolares?', 'Los conductos alveolares.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cuál es la unidad final donde el aire intercambia gases con los capilares?', 'El alvéolo.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué los alvéolos tienen paredes muy delgadas?', 'Para que oxígeno y dióxido de carbono difundan a corta distancia.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué células alveolares producen surfactante?', 'Los neumocitos de tipo II.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Para qué sirve el surfactante dentro de los alvéolos?', 'Reduce la tensión superficial y ayuda a que no colapsen al espirar.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué células limpian partículas que llegaron hasta los alvéolos?', 'Los macrófagos alveolares.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué dos lados separa la membrana respiratoria?', 'El aire alveolar y la sangre de los capilares pulmonares.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué capa de pleura está pegada a la superficie del pulmón?', 'La pleura visceral.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué capa de pleura reviste la pared de la cavidad torácica?', 'La pleura parietal.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué permite una fina película de líquido entre las pleuras?', 'Que ambas superficies se deslicen con poco rozamiento durante la respiración.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué diferencia hay entre zona conductora y zona respiratoria?', 'La conductora lleva y acondiciona aire; la respiratoria contiene alvéolos e intercambia gases.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Si un conducto carece de alvéolos, ¿esperas intercambio gaseoso importante en su pared?', 'No. Su función principal es conducir el aire.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué sangre llega a los capilares que rodean los alvéolos?', 'Sangre venosa procedente de las arterias pulmonares.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cómo se llama la entrada de aire a los pulmones?', 'Inspiración o inhalación.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cómo se llama la salida de aire desde los pulmones?', 'Espiración o exhalación.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué ocurre con el diafragma al contraerse durante la inspiración?', 'Desciende y aumenta el volumen de la cavidad torácica.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué ocurre con la presión intrapulmonar cuando aumenta el volumen torácico?', 'Disminuye y el aire puede entrar desde la atmósfera.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Si la presión dentro del pulmón supera la atmosférica, ¿hacia dónde fluye el aire?', 'Hacia fuera del pulmón.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué relación entre volumen y presión describe la ley de Boyle?', 'A temperatura constante, al aumentar el volumen de un gas disminuye su presión.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué no hay flujo de aire al final de una respiración tranquila?', 'Porque se igualan la presión atmosférica y la intrapulmonar.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿La espiración tranquila requiere una contracción muscular potente?', 'No. Predomina el retroceso elástico después de que se relajan los músculos inspiratorios.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué músculos además del diafragma ayudan a mover las costillas al respirar?', 'Los músculos intercostales.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué la espiración forzada puede necesitar músculos adicionales?', 'Porque debe reducir el volumen torácico con más fuerza que el retroceso elástico normal.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué cambio en los bronquiolos aumenta la resistencia al flujo de aire?', 'El estrechamiento de su diámetro.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Si los bronquiolos se dilatan, ¿qué pasa con la resistencia al paso del aire?', 'Disminuye.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué significa atelectasia?', 'Colapso de una parte o de todo el pulmón.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Una vía aérea queda obstruida y el aire distal se absorbe. ¿Qué puede ocurrir con esa región?', 'Puede colapsar y producir atelectasia.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué es el volumen corriente?', 'El aire que entra o sale durante una respiración tranquila.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué es el espacio muerto anatómico?', 'El volumen de aire que queda en vías conductoras y no llega a zonas de intercambio.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué la ventilación alveolar puede ser menor que el aire inhalado?', 'Porque una parte de cada inspiración permanece en el espacio muerto anatómico.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cómo se calcula de forma básica la ventilación alveolar por minuto?', 'Aire que llega a alvéolos por respiración multiplicado por respiraciones por minuto.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué es el volumen residual?', 'El aire que permanece en los pulmones incluso después de una espiración máxima.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Para qué se usa la espirometría?', 'Para medir volúmenes y flujos respiratorios y evaluar la ventilación pulmonar.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Si una enfermedad impide que el pulmón se expanda bien, ¿es obstructiva o restrictiva?', 'Restrictiva.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Si una enfermedad estrecha las vías y dificulta mover aire, ¿es obstructiva o restrictiva?', 'Obstructiva.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué ejemplo del texto causa obstrucción variable de las vías respiratorias?', 'El asma.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Dónde se localizan los centros automáticos principales de la respiración?', 'En el bulbo raquídeo y la protuberancia del tronco encefálico.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué grupo respiratorio del bulbo se describe como generador principal del ritmo?', 'El grupo respiratorio ventral.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué parte del encéfalo permite decidir contener la respiración o cantar?', 'La corteza motora, que aporta control voluntario.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué reflejo puede provocar el humo al estimular receptores de irritantes?', 'Tos, cambios en la respiración o broncoconstricción protectora.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué expresa la presión parcial de un gas en una mezcla?', 'La parte de la presión total que corresponde a ese gas.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué el aire alveolar tiene menos oxígeno que el aire recién inspirado?', 'Porque se humedece, se mezcla con aire residual e intercambia gases con la sangre.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Hacia dónde difunde el oxígeno en el alvéolo si su presión parcial es mayor en el aire que en la sangre?', 'Del aire alveolar hacia la sangre.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Hacia dónde difunde el dióxido de carbono en los capilares pulmonares?', 'De la sangre hacia el aire alveolar para ser exhalado.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué necesita un alvéolo además de ventilación para oxigenar sangre?', 'Perfusión: flujo de sangre por sus capilares.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Si una región pulmonar está mal ventilada, ¿qué ajuste local puede hacer su circulación?', 'Contraer sus vasos para desviar sangre a zonas mejor ventiladas.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cómo se llama el ajuste entre aire que llega y sangre que pasa por una región pulmonar?', 'Acoplamiento ventilación-perfusión.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿En qué molécula viaja la mayor parte del oxígeno sanguíneo?', 'Unida a la hemoglobina de los eritrocitos.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Cuántas moléculas de oxígeno puede transportar una hemoglobina completa?', 'Hasta cuatro, una en cada grupo hemo.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué ion del grupo hemo se une reversiblemente al oxígeno?', 'El hierro ferroso, Fe2+.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Toda la sangre transporta oxígeno disuelto en el plasma?', 'Sí, pero es una fracción pequeña frente a la unida a hemoglobina.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Cuando aumenta la presión parcial de oxígeno, ¿qué suele pasar con la saturación de hemoglobina?', 'Aumenta hasta acercarse a su capacidad máxima.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué el intercambio de oxígeno en tejidos activos puede aumentar?', 'Porque consumen más oxígeno y crean un gradiente que favorece su salida de la sangre.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿En qué forma viaja gran parte del dióxido de carbono en la sangre?', 'Como bicarbonato, después de reaccionar con agua.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué enzima del eritrocito acelera la formación de bicarbonato a partir de CO2 y agua?', 'La anhidrasa carbónica.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué intercambio iónico acompaña la salida de bicarbonato del eritrocito?', 'Entra cloruro a cambio; se conoce como desplazamiento de cloruro.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'Además de bicarbonato, ¿en qué otras formas puede transportarse el CO2?', 'Disuelto como gas y unido a proteínas en compuestos carbamino.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué ocurre con el CO2 de los tejidos al llegar a los pulmones?', 'Las reacciones se invierten, se libera CO2 y difunde hacia los alvéolos.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué una célula muscular en ejercicio recibe más oxígeno que una en reposo?', 'Porque su mayor actividad favorece la descarga local de oxígeno desde la hemoglobina.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué vigilan los quimiorreceptores para ajustar el ritmo respiratorio?', 'Cambios de pH y de gases en la sangre y el líquido cefalorraquídeo.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué el ejercicio puede aumentar la respiración antes de que cambien mucho los gases arteriales?', 'Porque órdenes motoras y señales de músculos y articulaciones estimulan los centros respiratorios.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué significa hipoxemia?', 'Concentración o presión de oxígeno anormalmente baja en la sangre.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué significa hipoxia?', 'Suministro insuficiente de oxígeno a los tejidos.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué coloración puede acompañar una oxigenación deficiente?', 'Cianosis, un tono azulado de piel o mucosas.'),
    ('MORFOFUNCION', 'aparato respiratorio', 'En el enfisema, ¿qué cambio dificulta la espiración?', 'La pérdida de elasticidad y el atrapamiento de aire en los pulmones.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué le hace la bronquitis crónica a las vías respiratorias?', 'Produce inflamación y secreciones que dificultan el flujo de aire.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Por qué fumar aumenta el riesgo de daño respiratorio y cáncer pulmonar?', 'Porque expone repetidamente el epitelio a irritantes y carcinógenos.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué dos tareas de todo el aparato respiratorio conectan pulmones y metabolismo?', 'Entregar oxígeno a los tejidos y retirar el dióxido de carbono que producen.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué otro equilibrio corporal ayuda a regular la eliminación de CO2?', 'El equilibrio ácido-base o pH.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 981-1022 | MORFOFUNCION / aparato digestivo
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'aparato digestivo', 'Al masticar una manzana, ¿qué tipo de digestión comienza primero?', 'La mecánica: los dientes fragmentan el alimento y aumentan su superficie.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Cuando una enzima rompe una molécula alimentaria, ¿qué tipo de digestión ocurre?', 'Digestión química, que descompone macromoléculas en unidades más pequeñas.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué cinco etapas generales atraviesa el alimento desde que entra hasta que se elimina?', 'Ingestión, digestión, absorción, compactación y defecación.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Los dientes pertenecen al tubo digestivo o son órganos accesorios?', 'Son órganos accesorios que ayudan a procesar el alimento.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cuál es el recorrido del alimento desde la boca hasta el estómago?', 'Boca, faringe, esófago y estómago.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué capa de la pared digestiva toca directamente el alimento?', 'La mucosa.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué capa de la pared digestiva contiene vasos y un plexo nervioso bajo la mucosa?', 'La submucosa.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué capa de la pared digestiva genera buena parte de sus movimientos?', 'La muscular externa.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo suele organizarse la muscular externa del tubo digestivo?', 'Con músculo circular interno y longitudinal externo.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué forma un engrosamiento de músculo circular en el tubo digestivo?', 'Un esfínter que regula el paso del contenido.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué plexo del sistema nervioso entérico coordina especialmente la motilidad intestinal?', 'El plexo mientérico.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué hacen los mesenterios además de sostener órganos abdominales?', 'Sirven de paso a vasos sanguíneos, linfáticos y nervios.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué epitelio protege al esófago del roce del bolo alimenticio?', 'Epitelio pavimentoso estratificado no queratinizado.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué estructura dura separa la boca de la cavidad nasal?', 'El paladar duro.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué movimientos permite la lengua durante la alimentación?', 'Manipular el alimento, formar el bolo y empujarlo para deglutir.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué piezas dentales cortan principalmente el alimento?', 'Los incisivos.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué piezas dentales son especialmente útiles para desgarrar?', 'Los caninos.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué piezas dentales muelen y trituran el alimento?', 'Los premolares y molares.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo se llama la parte del diente visible por encima de la encía?', 'La corona.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué tejido duro recubre la corona del diente?', 'El esmalte.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué tejido forma la mayor parte del diente debajo del esmalte?', 'La dentina.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué une la raíz del diente con el hueso que la rodea?', 'El ligamento periodontal.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Para qué sirve el moco de la saliva al formar el bolo?', 'Une y lubrica las partículas de alimento para facilitar la deglución.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué enzima de la saliva empieza a digerir el almidón?', 'La amilasa salival.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué tres pares de glándulas salivales grandes debes localizar?', 'Parótidas, submandibulares y sublinguales.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Si sientes ardor por ácido que vuelve del estómago al esófago, ¿qué está ocurriendo?', 'Reflujo ácido que puede producir pirosis.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué esfínter ayuda a impedir que el contenido del estómago suba al esófago?', 'El esfínter esofágico inferior.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Al tragar, ¿qué bloquea la entrada del alimento hacia la nariz?', 'El paladar blando o velo del paladar.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Al tragar, ¿qué ayuda a evitar que el bolo entre en la laringe?', 'La epiglotis.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Puede el peristaltismo llevar alimento al estómago aunque una persona no esté erguida?', 'Sí. Las contracciones esofágicas impulsan el bolo sin depender solo de la gravedad.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué diferencia hay entre el epitelio del esófago y el del estómago?', 'El esófago tiene epitelio estratificado protector; el estómago, epitelio cilíndrico secretor.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cuántas capas musculares principales tiene la pared del estómago?', 'Tres: oblicua interna, circular media y longitudinal externa.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué células gástricas secretan pepsinógeno?', 'Las células principales.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué células gástricas secretan ácido clorhídrico y factor intrínseco?', 'Las células parietales.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo pasa el pepsinógeno a ser pepsina activa?', 'El ambiente ácido elimina parte de la molécula y la activa.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué células renuevan el epitelio de las glándulas gástricas?', 'Las células regenerativas o citoblastos.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué tipo de células gástricas libera mensajeros que regulan la digestión?', 'Las células enteroendocrinas.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Si el estómago contiene ácido y pepsina, ¿qué ayuda a proteger su propia mucosa?', 'Una barrera de moco y bicarbonato que separa el epitelio del contenido ácido.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué nutriente empieza a degradar la pepsina en el estómago?', 'Las proteínas, que rompe en fragmentos más pequeños.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Por qué importa el factor intrínseco secretado por el estómago?', 'Porque permite la absorción de vitamina B12.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Una persona produce menos factor intrínseco por daño gástrico. ¿Qué absorción puede verse afectada?', 'La de vitamina B12.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué efecto tiene la gastrina sobre la actividad gástrica?', 'Estimula la secreción y favorece la función digestiva del estómago.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué mensajero local ayuda a estimular la secreción ácida del estómago?', 'La histamina.'),
    ('MORFOFUNCION', 'aparato digestivo', 'El olor de la comida activa el estómago antes de comer. ¿Qué fase es?', 'La fase cefálica, mediada en gran parte por el nervio vago.'),
    ('MORFOFUNCION', 'aparato digestivo', 'El alimento distiende el estómago y aumenta su secreción. ¿Qué fase de regulación es?', 'La fase gástrica.'),
    ('MORFOFUNCION', 'aparato digestivo', 'El duodeno ya recibió quimo y frena la entrada de más. ¿Qué fase predomina?', 'La fase intestinal, que reduce la secreción y la motilidad gástricas.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo se llama la mezcla semilíquida que sale del estómago hacia el duodeno?', 'Quimo.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Por qué llega al hígado sangre procedente del intestino por la vena porta?', 'Para que los hepatocitos procesen los nutrientes absorbidos antes de que pasen a la circulación general.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Además de sangre portal, ¿qué aporte llega al hígado por la arteria hepática?', 'Sangre arterial con oxígeno.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué células de los sinusoides hepáticos eliminan bacterias y desechos de la sangre?', 'Los macrófagos hepáticos o células de Kupffer.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Dónde vierten inicialmente los hepatocitos la bilis que producen?', 'En los canalículos biliares.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué conducto se forma al unirse el hepático común con el cístico?', 'El colédoco, que conduce bilis hacia el duodeno.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Entre comidas, ¿qué hace la vesícula biliar con la bilis?', 'La almacena y concentra al absorber parte de su agua y electrolitos.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué componente de la bilis ayuda especialmente a digerir y absorber grasas?', 'Los ácidos biliares, que participan en la emulsificación y formación de micelas.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿En qué parte del intestino se reabsorbe gran parte de los ácidos biliares?', 'En el íleon.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo se llama el recorrido de los ácidos biliares desde el hígado al intestino y de vuelta?', 'Circulación enterohepática.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué parte exocrina del páncreas secreta enzimas y sus precursores?', 'Los ácinos pancreáticos.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué aportan los conductos pancreáticos al jugo que llega al duodeno?', 'Bicarbonato, que ayuda a neutralizar el ácido del quimo.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Por qué el bicarbonato pancreático facilita el trabajo de las enzimas?', 'Porque eleva el pH duodenal hasta un rango más favorable para su actividad.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué enzima intestinal activa el tripsinógeno pancreático?', 'La enterocinasa de la mucosa del intestino delgado.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Una vez formada, ¿qué hace la tripsina con otros precursores de proteasas?', 'Los activa para continuar la digestión de proteínas.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué enzima pancreática continúa la digestión del almidón?', 'La amilasa pancreática.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué enzima pancreática realiza la mayor parte de la digestión de grasas?', 'La lipasa pancreática.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué hormona pancreática prepara el almacenamiento de nutrientes al favorecer la entrada de glucosa en tejidos?', 'La insulina.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué hormona pancreática ayuda a elevar la glucosa sanguínea entre comidas?', 'El glucagón.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Cuando llegan grasas al duodeno, ¿qué hormona favorece la contracción de la vesícula biliar?', 'La colecistocinina o CCK.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Cuando el quimo ácido llega al duodeno, ¿qué hormona favorece la secreción de bicarbonato pancreático?', 'La secretina.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cuál es el primer segmento del intestino delgado que recibe quimo del estómago?', 'El duodeno.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué segmento se sitúa entre el duodeno y el íleon?', 'El yeyuno.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cuál es el último segmento del intestino delgado antes del ciego?', 'El íleon.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué impide la válvula ileocecal además de regular el paso hacia el ciego?', 'Que el contenido del intestino grueso retroceda hacia el íleon.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Por qué las vellosidades son útiles para absorber nutrientes?', 'Aumentan el área de contacto de la mucosa con el contenido intestinal.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué forman las microvellosidades de las células intestinales?', 'El borde en cepillo, que amplía aún más la superficie de absorción.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Dentro de una vellosidad, ¿qué vaso recibe buena parte de los lípidos absorbidos?', 'El vaso quilífero linfático.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿A qué vasos de una vellosidad pasan muchos azúcares y aminoácidos absorbidos?', 'A los capilares sanguíneos.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué agrupaciones de tejido linfático destacan en el íleon?', 'Las placas o parches de Peyer.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo protegen las glándulas duodenales la mucosa frente al quimo ácido?', 'Secretan moco rico en bicarbonato que ayuda a neutralizarlo.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué secretan principalmente las criptas intestinales?', 'Jugo intestinal con agua y moco; gran parte de las enzimas actúa en el borde en cepillo o llega del páncreas.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Para qué sirven las contracciones de segmentación del intestino delgado?', 'Para mezclar el quimo con las secreciones y exponerlo a la mucosa.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Entre comidas, ¿qué patrón de movimiento ayuda a barrer el contenido residual del intestino delgado?', 'El complejo motor migratorio.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Si comes pan o arroz, ¿qué polisacárido digestible aportan en buena parte?', 'Almidón, cuya digestión empieza con amilasas y continúa en el intestino delgado.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Por qué la celulosa no se digiere como el almidón en el intestino delgado humano?', 'Porque nuestras enzimas digestivas no pueden romper sus enlaces de la misma manera.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Dónde empieza la digestión química de proteínas?', 'En el estómago, por acción de la pepsina.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo se llama en conjunto a las enzimas que rompen proteínas?', 'Proteasas o peptidasas.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué proteasas pancreáticas continúan rompiendo polipéptidos en el intestino?', 'Entre otras, la tripsina y la quimotripsina.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Dónde terminan de actuar muchas peptidasas antes de absorber aminoácidos?', 'En el borde en cepillo del intestino delgado.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué significa emulsificar una grasa antes de que actúe la lipasa?', 'Dividir el glóbulo en gotas pequeñas para aumentar la superficie disponible.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué estructuras biliares transportan lípidos hacia la superficie de absorción intestinal?', 'Las micelas.'),
    ('MORFOFUNCION', 'aparato digestivo', 'Tras absorber grasas, ¿cómo las empaqueta la célula intestinal para enviarlas a la linfa?', 'En quilomicrones.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué recupera principalmente el intestino grueso del residuo alimentario?', 'Agua y sales, con lo que ayuda a formar las heces.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo se llama la primera bolsa del intestino grueso, situada tras la válvula ileocecal?', 'El ciego.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué partes del colon siguen al ciego antes del recto?', 'Colon ascendente, transverso, descendente y sigmoide.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué segmento almacena las heces antes de la evacuación?', 'El recto.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Por qué algunas bacterias del colon pueden beneficiar a la persona?', 'Ayudan a aprovechar compuestos de la dieta y producen ciertas vitaminas.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué vitamina producida por bacterias intestinales es importante para la coagulación?', 'La vitamina K.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué esfínter anal funciona de modo involuntario y cuál puede controlarse voluntariamente?', 'El interno es involuntario; el externo está bajo control voluntario.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 20-22 | SALUD PUBLICA / factor de riesgo y salud comunitaria
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', 'Una persona fuma y tiene antecedentes familiares de cardiopatía. ¿Cuál de los dos riesgos puede cambiar?', 'El tabaquismo; los antecedentes familiares no se pueden modificar.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿La edad es un factor de riesgo modificable?', 'No. Es una característica que no puede cambiarse.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Qué tienen en común el sedentarismo y una dieta inadecuada como factores de riesgo?', 'Ambos pueden modificarse con apoyo e intervenciones adecuadas.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', 'Si alguien tiene hipertensión, ¿puede actuar sobre ese factor de riesgo?', 'Sí. La presión arterial puede controlarse mediante atención y cambios apropiados.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Por qué tener un factor de riesgo no significa que la enfermedad sea inevitable?', 'Porque aumenta la probabilidad de enfermar, pero no determina por sí solo el resultado.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Qué otras condiciones, además de las biológicas, pueden funcionar como factores de riesgo?', 'Las condiciones ambientales, los comportamientos y las exposiciones sociales.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', 'Un barrio crea un comité para vigilar la calidad del agua. ¿Qué enfoque está aplicando?', 'Salud comunitaria: la población participa en la solución de un problema propio.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', 'En salud comunitaria, ¿la población solo recibe instrucciones del personal sanitario?', 'No. Participa en la planificación, la gestión y el control de las acciones.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Qué puede aportar la comunidad al planificar una intervención de salud?', 'Su conocimiento de las necesidades, costumbres y condiciones del lugar.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', 'Una brigada de salud escolar organizada con las familias, ¿ilustra qué forma de trabajo?', 'Una acción de salud comunitaria.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Qué busca un programa comunitario de control de vectores?', 'Construir con la población una respuesta a un problema de salud del entorno.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Qué tres tipos de determinantes debe considerar una solución de salud comunitaria?', 'Los sociales, los culturales y los ambientales.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', 'Además de prevenir enfermedades, ¿qué deben hacer los servicios de salud según el texto?', 'Fomentar la salud, atender de forma integral y apoyar la rehabilitación.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', 'Una persona supera una enfermedad, pero necesita volver a sus actividades. ¿Qué función del servicio de salud entra en juego?', 'La rehabilitación y la reintegración social.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Qué prácticas cotidianas menciona el material como parte del fomento de la salud?', 'Higiene, actividad física, alimentación adecuada y autocuidado, entre otras.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Por qué el saneamiento ambiental también es una acción de fomento de la salud?', 'Porque crea condiciones que facilitan el bienestar de la comunidad.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 6-9 | SALUD PUBLICA / ods y cobertura sanitaria
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Hasta qué año orienta la agenda de los Objetivos de Desarrollo Sostenible?', 'Hasta 2030.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Qué plantea específicamente el ODS 3?', 'Garantizar una vida sana y promover el bienestar para todas las personas, a todas las edades.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Cuántas metas reúnen los 17 ODS según el material?', '169 metas.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', 'Si una meta dice qué se quiere lograr, ¿qué permite observar un indicador?', 'Si se está avanzando hacia esa meta con una medida comparable.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Por qué un profesional de salud debería conocer los ODS?', 'Porque relacionan los problemas sanitarios con prioridades sociales, económicas y ambientales.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', 'Una población tiene agua insegura. ¿Por qué esto importa a la agenda de salud?', 'Porque el agua y el saneamiento son determinantes de la salud.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Qué ayuda a identificar los ODS al comparar el acceso a salud entre grupos?', 'Las inequidades y las poblaciones vulnerables o marginadas.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Qué estrategia sanitaria destaca el texto para avanzar hacia la cobertura universal?', 'Fortalecer la Atención Primaria en Salud.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Cómo pueden los ODS orientar una investigación local en salud?', 'Vinculando una necesidad de la comunidad con metas e indicadores de la agenda global.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿La salud dentro de los ODS depende únicamente de los hospitales?', 'No. También depende de educación, vivienda, trabajo, ambiente y otras condiciones.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Qué significa trabajar de forma intersectorial por la salud?', 'Coordinar salud con sectores como educación, vivienda, trabajo y medio ambiente.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Qué hace posible que distintos países comparen sus avances en salud?', 'El seguimiento mediante indicadores globales.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', 'Si una política reduce barreras que afectan más a un grupo vulnerable, ¿qué objetivo de los ODS favorece?', 'La reducción de inequidades en salud.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Cuándo se adoptó la Agenda 2030 mencionada en el material?', 'En 2015.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Qué dimensiones integra la agenda de los ODS además de la sanitaria?', 'Dimensiones sociales, económicas, ambientales y de gobernanza.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Qué relación tiene la equidad de género con la salud en la agenda de los ODS?', 'Es una condición social que puede influir en el bienestar y el acceso a oportunidades de salud.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 10-14 | SALUD PUBLICA / salud en bolivia y modelo safci
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', 'Según el curso, ¿qué dos principios de acceso destacan para los servicios de salud en Bolivia?', 'La gratuidad y la universalidad.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué sistema boliviano se describe como financiado con recursos públicos y basado en la atención primaria?', 'El Sistema Único de Salud (SUS).'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', 'En el modelo SAFCI, ¿la familia queda fuera de las decisiones de salud?', 'No. La familia y la comunidad forman parte de la atención integral.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', 'Una comunidad consulta a sus médicos y a sus practicantes tradicionales. ¿Qué principio del SAFCI refleja?', 'La articulación intercultural entre saberes ancestrales y biomedicina.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Por qué el SAFCI debe adaptar la atención a la cultura local?', 'Para que sea pertinente y respete los saberes de la comunidad.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué pueden hacer los comités de salud en su territorio?', 'Participar en la planificación, vigilancia y evaluación de las acciones sanitarias.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué aporta un agente comunitario de salud?', 'Trabajo cercano al territorio para prevenir enfermedades y promover hábitos saludables.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Quién define las decisiones y estrategias de una política pública de salud?', 'El Estado, con el fin de garantizar el derecho a la salud y reducir inequidades.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', 'Si una norma asigna presupuesto y fija prioridades sanitarias, ¿hablamos de acción clínica o de política pública?', 'De política pública de salud.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', 'Si un equipo aplica una campaña de vacunación, ¿a qué campo de acción pertenece?', 'A la salud pública.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué papel tiene la participación social en la política sanitaria descrita?', 'Permite que comunidades y organizaciones ayuden a planificar y evaluar las acciones.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿En qué se concreta una política pública de salud?', 'En planes, programas y normas que guían los servicios de salud.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Por qué una política de salud debe colaborar con educación o medio ambiente?', 'Porque las condiciones de vida influyen en la salud y requieren respuestas entre sectores.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué misión de salud pública consiste en conocer problemas y prioridades de una población?', 'Evaluar y monitorizar su estado de salud.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', 'Después de identificar un problema de salud local, ¿qué debe hacer la salud pública?', 'Formular programas y políticas con la comunidad y las autoridades.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué debe comprobarse al garantizar servicios de salud?', 'Que la población acceda a servicios adecuados y que las intervenciones se evalúen.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 32-37 | SALUD PUBLICA / epidemiologia social
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué intenta explicar la epidemiología social cuando dos grupos tienen distinta esperanza de vida?', 'Cómo las desigualdades y condiciones sociales influyen en la salud de esos grupos.'),
    ('SALUD PUBLICA', 'epidemiologia social', 'Ante un brote en una escuela, ¿qué enfoque epidemiológico busca intervenir con rapidez en el lugar?', 'La epidemiología de campo.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿En qué tipo de espacios suele actuar la epidemiología de campo descrita en el texto?', 'En espacios concretos como escuelas, hospitales o asilos.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué escala de acción destaca en la epidemiología social?', 'La regional o nacional, incluida la orientación de políticas públicas.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Por qué estudiar solo el agente de una enfermedad puede dejar incompleto el análisis poblacional?', 'Porque puede pasar por alto pobreza, acceso a servicios y otras condiciones de vida.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué busca la epidemiología social entre la posición social y la salud?', 'Explicar las causas de las desigualdades sanitarias.'),
    ('SALUD PUBLICA', 'epidemiologia social', 'Si un estudio describe cuántos casos aparecen por lugar, tiempo y persona, ¿qué tipo de estudio observacional es?', 'Descriptivo.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Para qué puede servir un estudio descriptivo antes de probar una explicación?', 'Para reconocer la distribución de un problema y generar hipótesis.'),
    ('SALUD PUBLICA', 'epidemiologia social', 'Si un estudio compara grupos para evaluar una hipótesis sobre una causa, ¿es descriptivo o analítico?', 'Analítico.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué diferencia clave existe entre un estudio observacional y uno experimental?', 'En el experimental se manipula una variable bajo condiciones controladas; en el observacional no.'),
    ('SALUD PUBLICA', 'epidemiologia social', 'Un ensayo se realiza con comunidades completas. ¿Qué tipo de estudio experimental menciona el texto?', 'Un ensayo comunitario.'),
    ('SALUD PUBLICA', 'epidemiologia social', 'Un ensayo clínico del texto, ¿interviene principalmente sobre individuos o poblaciones enteras?', 'Sobre individuos.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué investiga la epidemiología sobre las necesidades de salud de una población?', 'Su frecuencia, distribución y determinantes.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué investiga el estudio de los sistemas de salud?', 'La respuesta social organizada frente a las condiciones de salud y enfermedad.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Por qué la salud pública necesita ciencias sociales y biológicas?', 'Porque la salud poblacional reúne procesos de ambas dimensiones.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué dato permite a la epidemiología de campo orientar decisiones urgentes durante un brote?', 'Información recogida en el terreno junto con la vigilancia de los casos.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 40-47 | SALUD PUBLICA / proceso de investigacion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'proceso de investigacion', 'Tienes una idea de investigación todavía vaga. ¿Qué paso ayuda a convertirla en un tema preciso?', 'Revisar antecedentes y analizar qué aspecto relevante falta estudiar.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿De dónde puede surgir una idea para investigar según el texto?', 'De la práctica, debates, publicaciones, noticias o vacíos del conocimiento, entre otras fuentes.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Cuáles son los tres grandes momentos de la investigación cuantitativa descritos?', 'Planificación, ejecución e informe final.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'Antes de recolectar datos, ¿en qué momento debes definir el problema y la metodología?', 'En la planificación.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Qué tres preguntas ordenan la planificación del estudio?', 'Qué se investigará, cuál es su base teórica y cómo se investigará.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Qué documento deja explícita una parte del plan de investigación?', 'El protocolo.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'Al construir la base teórica, ¿qué conviene revisar?', 'Conceptos, teorías, investigaciones previas y datos disponibles.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'Si defines población y muestra, ¿qué parte del proyecto estás preparando?', 'El diseño metodológico.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Qué debes elegir para obtener la información que responde tu pregunta?', 'Los métodos e instrumentos de recolección de datos.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'Una encuesta necesita encuestadores entrenados. ¿En qué parte del diseño se prevé esto?', 'En los procedimientos de recolección de información.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Para qué se prepara un plan de tabulación y análisis antes del trabajo de campo?', 'Para decidir cómo ordenar, presentar e interpretar los datos que se obtengan.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Qué actividades integran la ejecución del estudio?', 'Recolectar, procesar, analizar e interpretar los datos, y elaborar conclusiones y recomendaciones.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Por qué una mala recolección de datos afecta todo el estudio?', 'Porque los datos son la materia prima de los análisis y hallazgos posteriores.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'Después de reunir los datos, ¿qué pasos ayudan a presentarlos con claridad?', 'Ordenarlos, clasificarlos y tabularlos.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿En qué deben basarse las conclusiones y recomendaciones?', 'En los resultados obtenidos e interpretados, no en suposiciones ajenas al estudio.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Para qué se comunica el informe final?', 'Para aportar conocimiento o ayudar a resolver el problema que motivó la investigación.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'En una investigación cualitativa, ¿las preguntas siempre quedan fijas desde el inicio?', 'No. Pueden precisarse o cambiar mientras se conoce el fenómeno.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Qué busca comprender un estudio cualitativo en el ambiente natural?', 'Cómo vive, actúa y entiende la situación la gente involucrada.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Por qué el proceso de investigación no debe verse como una lista rígida de pasos?', 'Porque sus momentos se relacionan y pueden revisarse conforme avanza el estudio.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'Si la comunidad ayuda a identificar qué problema investigar, ¿qué enfoque se parece al descrito en el texto?', 'La investigación cualitativa participativa o investigación-acción.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 49-59 | SALUD PUBLICA / problema y objetivos de investigacion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Por qué elegir un tema amplio todavía no equivale a tener un problema de investigación?', 'Porque falta concretar qué se estudiará, en quiénes, dónde y con qué alcance.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', 'Si tu pregunta admite varias interpretaciones, ¿qué debes mejorar primero?', 'La claridad y precisión de la delimitación del problema.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué debe permitir comprobar un problema de investigación cuantitativa?', 'Sus variables o características mediante evidencia empírica.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Por qué conviene indicar el lugar y el periodo de un estudio?', 'Para fijar sus dimensiones espacial y temporal.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', 'Un proyecto dice ''estudiaré la salud de todos''. ¿Qué dato esencial de la pregunta falta definir?', 'La población concreta que será investigada.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Por qué se revisan tiempo, personal, dinero y equipo antes de elegir un problema?', 'Para comprobar que el proyecto sea viable.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué condición ética debe considerarse al estudiar personas?', 'Su aceptación de la investigación y sus procedimientos mediante consentimiento informado.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué relación debe existir entre el método elegido y el problema?', 'El método debe ser capaz de aportar datos para responder ese problema.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Por qué la urgencia de los resultados influye en el diseño del estudio?', 'Porque su duración debe permitir que los hallazgos sirvan para tomar decisiones a tiempo.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué se entiende por delimitar un problema?', 'Concentrar el estudio en una parte clara y abordable de un tema más amplio.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué riesgo existe si delimitas el problema hasta volverlo insignificante?', 'Perder su relación con el fenómeno general y su relevancia.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Para qué sirven los objetivos durante la investigación?', 'Para guiar sus fases y aclarar lo que el estudio pretende lograr.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué debe indicar un objetivo específico?', 'Una actividad o resultado concreto relacionado con el problema principal.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Por qué una pregunta de investigación puede ayudar más que una frase vaga?', 'Porque orienta de forma directa qué datos habrá que buscar para responderla.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', 'Si un estudio no explica por qué importa, ¿qué sección necesita fortalecer?', 'La justificación.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué debe explicar la justificación de un estudio?', 'Por qué conviene realizarlo, a quién puede beneficiar y para qué servirán sus resultados.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

COMMIT;
NOTIFY pgrst, 'reload schema';

-- 521 tarjetas, 17 temas, 3 materias.