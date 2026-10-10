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

-- salud: páginas PDF 97-105 | SALUD PUBLICA / muestreo
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'muestreo', '¿Para qué tomar una muestra en vez de estudiar a toda la población?', 'Para obtener información usando menos tiempo, personal y recursos.'),
    ('SALUD PUBLICA', 'muestreo', '¿Qué es la población en un estudio?', 'El conjunto total de elementos al que se refiere la pregunta de investigación.'),
    ('SALUD PUBLICA', 'muestreo', 'En el muestreo, ¿cómo llamas a la parte de la población que seleccionas para estudiar?', 'La muestra.'),
    ('SALUD PUBLICA', 'muestreo', 'Asignas un número a cada persona y eliges números al azar. ¿Qué método aplicas?', 'Muestreo aleatorio simple.'),
    ('SALUD PUBLICA', 'muestreo', 'En un muestreo sistemático, ¿cómo eliges los elementos después del punto inicial?', 'Tomándolos cada k posiciones en la lista.'),
    ('SALUD PUBLICA', 'muestreo', 'Si la población tiene N integrantes y deseas n, ¿cómo obtienes el intervalo k del muestreo sistemático?', 'Dividiendo N entre n.'),
    ('SALUD PUBLICA', 'muestreo', '¿Por qué el punto de partida del muestreo sistemático debe elegirse al azar?', 'Para que la selección no dependa de una preferencia del investigador.'),
    ('SALUD PUBLICA', 'muestreo', '¿Qué puede salir mal si la lista tiene una periodicidad que coincide con el intervalo de selección?', 'La muestra sistemática puede reflejar un patrón artificial y sesgarse.'),
    ('SALUD PUBLICA', 'muestreo', 'La población es heterogénea y quieres representar cada grupo. ¿Qué método conviene considerar?', 'El muestreo estratificado.'),
    ('SALUD PUBLICA', 'muestreo', 'Después de definir los estratos, ¿cómo se eligen los integrantes dentro de cada uno?', 'Con una selección aleatoria, como el muestreo aleatorio simple.'),
    ('SALUD PUBLICA', 'muestreo', '¿Qué significa afijación simple en una muestra estratificada?', 'Asignar el mismo número de personas a cada estrato.'),
    ('SALUD PUBLICA', 'muestreo', '¿Qué significa afijación proporcional?', 'Dar a cada estrato una parte de la muestra proporcional a su tamaño poblacional.'),
    ('SALUD PUBLICA', 'muestreo', 'El 70 % de estudiantes pertenece a colegios públicos. En una muestra proporcional de 600, ¿cuántos corresponden a ese estrato?', '420 estudiantes.'),
    ('SALUD PUBLICA', 'muestreo', '¿Qué considera la afijación óptima además del tamaño de cada estrato?', 'La variación o desviación típica dentro de los estratos.'),
    ('SALUD PUBLICA', 'muestreo', 'Si eliges municipios completos al azar para estudiar a quienes viven en ellos, ¿qué método empleas?', 'Muestreo por conglomerados.'),
    ('SALUD PUBLICA', 'muestreo', 'Primero eliges comunas, luego colegios y después alumnos. ¿Cómo se llama ese diseño?', 'Muestreo polietápico.'),
    ('SALUD PUBLICA', 'muestreo', 'Faltan personas en la lista desde la que sortearás la muestra. ¿Qué error aparece?', 'Error de cobertura: esas personas no tienen posibilidad de ser seleccionadas.'),
    ('SALUD PUBLICA', 'muestreo', 'Varias personas elegidas no contestan la encuesta. ¿Qué problema debes reconocer?', 'Sesgo o error de no respuesta.'),
    ('SALUD PUBLICA', 'muestreo', '¿Puede desaparecer por completo el error de muestreo cuando estudias solo una parte de la población?', 'No. Puede controlarse con un diseño adecuado, pero existe variación entre muestras.'),
    ('SALUD PUBLICA', 'muestreo', 'Una pregunta confusa induce respuestas imprecisas. ¿Qué tipo de error provoca?', 'Error de medición.'),
    ('SALUD PUBLICA', 'muestreo', 'Fijas cupos por edad y entrevistarás a los primeros que cumplan cada cupo. ¿Qué método es?', 'Muestreo no probabilístico por cuotas.'),
    ('SALUD PUBLICA', 'muestreo', 'Eliges deliberadamente participantes típicos que pueden informar sobre el problema. ¿Qué método es?', 'Muestreo intencional.'),
    ('SALUD PUBLICA', 'muestreo', 'Pides a un participante difícil de localizar que te presente a otros. ¿Qué método utilizas?', 'Muestreo de bola de nieve.'),
    ('SALUD PUBLICA', 'muestreo', '¿Por qué debes tener cuidado al generalizar resultados de una muestra no probabilística?', 'Porque los integrantes no tuvieron una probabilidad comparable de ser elegidos.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 109-138 | SALUD PUBLICA / frecuencias y graficos
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué haces primero para convertir muchas respuestas sueltas en una tabla?', 'Las ordenas por categorías o valores y cuentas cuántas hay de cada uno.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'En una encuesta de 40 personas, 10 eligen la opción A. ¿Cuál es su frecuencia absoluta?', '10 personas.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'En esa misma encuesta, 10 de 40 eligen A. ¿Cuál es su frecuencia relativa?', '10/40 = 0,25, es decir, 25 %.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Cuánto deben sumar las frecuencias absolutas de todas las categorías?', 'El total de observaciones.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Cuánto deben sumar aproximadamente los porcentajes de todas las categorías?', '100 %, salvo pequeñas diferencias por redondeo.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué indica que una tabla de frecuencias tenga un total distinto al número de encuestados?', 'Que falta alguna observación o existe un error de conteo.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué significa que la frecuencia acumulada sea 18 hasta una categoría?', 'Que 18 observaciones se reúnen hasta esa categoría, incluyéndola.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Por qué la frecuencia acumulada final debe coincidir con el total de datos?', 'Porque al llegar a la última categoría ya se incluyeron todas las observaciones.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'Si las categorías tienen un orden natural, ¿qué permite leer la frecuencia acumulada?', 'Cuántos casos se encuentran hasta cierto valor o intervalo.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'Tienes una variable cuantitativa con muchos valores. ¿Por qué agruparla en intervalos?', 'Para resumir su distribución y hacerla más fácil de interpretar.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'Si el valor mayor es 80 y el menor 50, ¿cuál es el rango?', 'El rango es 30.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué es la amplitud de un intervalo?', 'La distancia entre sus límites superior e inferior.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué es la marca de clase de un intervalo?', 'Su punto medio.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'Para el intervalo de 50 a 60, ¿cuál es la marca de clase?', 'La marca de clase es 55.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Por qué los intervalos de una tabla no deben solaparse?', 'Para que cada observación se cuente en una sola clase.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'En un histograma, ¿qué representa la altura de cada barra?', 'La frecuencia correspondiente a ese intervalo.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Por qué las barras de un histograma suelen tocarse?', 'Porque representan intervalos contiguos de una variable cuantitativa.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'Si quieres comparar respuestas como ''sí'', ''no'' y ''no sabe'', ¿qué gráfico resulta útil?', 'Un diagrama de barras.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué diferencia visual ayuda a distinguir un diagrama de barras de un histograma?', 'Las barras de categorías suelen separarse; las del histograma representan intervalos contiguos.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué representa un sector en un gráfico circular?', 'La parte del total correspondiente a una categoría.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'Si una categoría representa 25 % del total, ¿cuántos grados ocupa en un gráfico circular?', '90 grados, porque es una cuarta parte de 360.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Cuándo puede resultar poco claro un gráfico circular según el material?', 'Cuando hay demasiadas categorías; el texto desaconseja usarlo con más de cuatro.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Cómo se construye un polígono de frecuencias?', 'Uniendo los puntos que representan las frecuencias en las marcas de clase.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'Si necesitas mostrar cómo se acumulan los casos hasta cada intervalo, ¿qué gráfica eliges?', 'Una ojiva o curva de frecuencia acumulada.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué conviene hacer antes de elegir cualquier gráfica para una variable?', 'Clasificar la variable y construir su tabla de frecuencias.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Para qué sirve una gráfica además de adornar una tabla?', 'Para reconocer y comunicar el comportamiento o la distribución de los datos.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 147-158 | SALUD PUBLICA / medidas de tendencia central
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Qué intenta resumir una medida de tendencia central?', 'El valor alrededor del cual se reúnen los datos de un conjunto.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Cuáles son las tres medidas centrales que desarrolla el capítulo?', 'Media aritmética, mediana y moda.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Los tiempos son 2, 4, 3 y 5 horas. ¿Cuál es la media?', '3,5 horas.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Qué sucede con la media si añades un valor extremadamente alto?', 'Puede desplazarse hacia arriba, aunque los demás datos no cambien.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Si los datos están en una tabla de frecuencias, ¿cómo ayudas al cálculo de la media?', 'Multiplicas cada valor por su frecuencia, sumas los productos y divides entre el total.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Qué valor representa a cada intervalo cuando estimas la media de datos agrupados?', 'La marca de clase o punto medio del intervalo.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Antes de hallar la mediana, ¿qué debes hacer con los datos?', 'Ordenarlos de menor a mayor.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'En 3, 4, 5, 6 y 8, ¿cuál es la mediana?', '5, el valor central.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Si tienes un número par de observaciones, ¿cómo hallas la mediana?', 'Promedias los dos valores centrales de la lista ordenada.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'En 5, 7, 9 y 11, ¿cuál es la mediana?', '8, porque los valores centrales son 7 y 9.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Qué porcentaje de observaciones queda aproximadamente a cada lado de la mediana?', 'La mitad, 50 % a cada lado.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'En una tabla por intervalos, ¿qué columna ayuda a localizar el intervalo de la mediana?', 'La frecuencia absoluta acumulada.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Cuándo suele describir mejor el centro la mediana que la media?', 'Cuando hay valores extremos que alteran mucho el promedio.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Las edades son 16, 17, 17, 18 y 35. ¿Qué valor muestra mejor el centro típico: la mediana o la media?', 'La mediana, 17 años; la media sube por el valor extremo de 35.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Puede calcularse la moda de una categoría como color preferido?', 'Sí. Es la categoría que aparece más veces.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'En rojo, azul, azul y verde, ¿cuál es la moda?', 'Azul.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Qué significa que una distribución sea unimodal?', 'Que tiene una sola moda.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Si dos valores comparten la frecuencia máxima, ¿qué ocurre con la moda?', 'Hay dos modas; la distribución es bimodal.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Qué significa que un conjunto sea amodal?', 'Que no se identifica un valor con mayor frecuencia que los demás.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'En datos agrupados, ¿cómo localizas primero la clase modal?', 'Buscando el intervalo con mayor frecuencia absoluta.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Si todas las categorías tienen la misma frecuencia, ¿conviene decir que una sola está de moda?', 'No. Ninguna destaca por encima de las demás.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Cuál de las tres medidas centrales necesita datos numéricos para calcularse?', 'La media aritmética.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Cuál de las tres medidas permite resumir una variable cualitativa nominal?', 'La moda.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Si el promedio de hijos es 2, ¿significa que todas las personas tienen dos hijos?', 'No. Resume al grupo; los valores individuales pueden ser distintos.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 60-72 | SALUD PUBLICA / marco teorico e hipotesis
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Para qué sirve la fundamentación teórica después de formular un problema?', 'Para situarlo en el conocimiento existente y orientar su explicación y análisis.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué dos tareas centrales forman la construcción de un marco teórico?', 'Revisar la literatura y adoptar una teoría o desarrollar una perspectiva teórica.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', 'Al buscar antecedentes, ¿debes reunir cualquier lectura o las relacionadas con tu problema?', 'Las que se relacionen con el problema y los objetivos del estudio.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué ayuda a organizar un marco conceptual?', 'Definir y relacionar los conceptos básicos del objeto de estudio.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué distingue a un marco teórico de un marco conceptual más simple?', 'Integra proposiciones y relaciones teóricas de forma más estructurada para explicar el fenómeno.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Puede una investigación carecer por completo de marco de referencia?', 'No. Puede quedar implícito, pero siempre parte de alguna perspectiva conceptual.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Para qué puede servir una revisión bibliográfica además de citar autores?', 'Para reconocer conceptos, antecedentes y relaciones que fundamenten el estudio.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué hace una hipótesis con la relación entre variables?', 'Propone una explicación o relación posible que se pondrá a prueba.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Una hipótesis es ya un hecho demostrado?', 'No. Es una propuesta probable que debe contrastarse con la evidencia.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué aporta una hipótesis bien formulada al trabajo de campo?', 'Ayuda a enfocar qué información hay que recoger y analizar.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', 'En un estudio cualitativo, ¿el marco teórico tiene que estar totalmente cerrado antes de empezar?', 'No. Puede construirse y ajustarse conforme avanza la investigación.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Por qué un concepto abstracto necesita operacionalizarse?', 'Para relacionarlo con manifestaciones observables o medibles.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué es una dimensión al operacionalizar una variable?', 'Un aspecto de la variable que permite examinarla y medirla con mayor precisión.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué papel cumple un indicador dentro de una dimensión?', 'Representar una condición observable o medible de esa dimensión.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', 'Si el estudio compara exposición y resultado, ¿qué variable se considera explicativa?', 'La independiente; el resultado se considera dependiente.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué conviene hacer después de identificar variables y sus relaciones?', 'Plantear la hipótesis y construir un esquema que muestre esas relaciones.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 72-73 | SALUD PUBLICA / variables y medicion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'variables y medicion', 'En una investigación, ¿por qué la edad puede ser una variable?', 'Porque toma valores distintos entre personas o en diferentes momentos.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Qué variable se considera resultado cuando una hipótesis relaciona dos características?', 'La variable dependiente.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Cómo llamas a la variable que puede explicar un cambio en otra?', 'Variable independiente.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Qué es una variable interviniente?', 'Un elemento que puede influir indirectamente en la relación entre la independiente y la dependiente.'),
    ('SALUD PUBLICA', 'variables y medicion', 'Si comparas estudiar en grupo con la calificación final, ¿cuál es el resultado a explicar?', 'La calificación final.'),
    ('SALUD PUBLICA', 'variables y medicion', 'Si comparas estudiar en grupo con la calificación final, ¿cuál es la variable explicativa?', 'La forma de estudio: en grupo o individualmente.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Qué distingue a una variable cualitativa?', 'Clasifica en categorías o propiedades, en lugar de expresar una cantidad medida.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿La religión de una persona se registra como cantidad o categoría?', 'Como categoría; es una variable cualitativa.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Por qué el peso es una variable cuantitativa?', 'Porque su magnitud se expresa mediante una medida numérica.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Qué caracteriza a una variable cuantitativa continua?', 'Puede tomar valores intermedios dentro de un intervalo.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿La talla es continua o discreta?', 'Continua; puede medirse en metros, centímetros y subdivisiones menores.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Qué caracteriza a una variable cuantitativa discreta?', 'Se cuenta en valores separados, sin fracciones intermedias posibles para esa unidad.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Por qué el número de hijos se considera discreto?', 'Porque se cuentan hijos completos, no fracciones de un hijo.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿La temperatura medida en grados es un ejemplo de magnitud o categoría?', 'De magnitud numérica; es cuantitativa.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Puede una variable cambiar de valor en un mismo sujeto con el tiempo?', 'Sí. La definición admite variaciones entre sujetos o en diferentes momentos.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Para qué se especifican las variables en el marco teórico?', 'Para aclarar qué se estudiará y cómo se relacionan los elementos del problema.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 85-94 | SALUD PUBLICA / estadistica descriptiva
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Para qué se recogen, ordenan e interpretan datos en estadística?', 'Para responder preguntas y tomar decisiones fundamentadas.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', 'Una tabla resume las edades de los encuestados sin generalizar. ¿Qué rama estadística estás usando?', 'Estadística descriptiva.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué necesita la estadística inferencial para hablar de una población que no estudió completa?', 'Una muestra seleccionada con técnicas adecuadas.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué es la unidad de análisis de un estudio?', 'El elemento concreto que se investiga: persona, grupo, objeto o acontecimiento.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', 'Si investigas hospitales, ¿debe quedar claro si la unidad de análisis es cada hospital o cada paciente?', 'Sí. La unidad debe corresponder a la pregunta y evitar ambigüedades.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Cuándo se considera finita una población según el texto?', 'Cuando se conoce el número de elementos que la integran.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', 'Si estudias a todas las personas de la población, ¿cómo se llama ese estudio?', 'Un censo.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué diferencia hay entre un parámetro y un estadígrafo?', 'El parámetro describe a la población; el estadígrafo describe a la muestra.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Por qué una muestra debe representar bien a la población?', 'Para que sus resultados permitan estimar con sentido las características del conjunto.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Que una categoría tenga código 1 o 2 la vuelve cuantitativa?', 'No. Un número puede ser solo una etiqueta para una variable cualitativa.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué tipo de variable es contar cuántos artículos se venden?', 'Cuantitativa discreta.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué escala distingue categorías sin establecer un orden?', 'La nominal.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', 'Si clasificas salud como buena, regular y mala, ¿qué escala utilizas?', 'Ordinal, porque las categorías tienen un orden.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿La distancia entre dos niveles de una escala ordinal tiene que ser igual?', 'No. La escala ordena, pero no asegura distancias iguales.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué caracteriza a una escala de intervalo?', 'Sus distancias son comparables y el cero no significa ausencia de la característica.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Por qué una longitud medida en centímetros pertenece a escala de razón?', 'Porque tiene cero absoluto y permite comparar proporciones, como el doble de longitud.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 161-168 | SALUD PUBLICA / medidas de posicion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'medidas de posicion', '¿Qué otro nombre reciben las medidas de posición?', 'Cuantiles.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Qué medida de posición deja aproximadamente al 25 % de datos por debajo?', 'El primer cuartil, Q1.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Qué cuartil coincide con la mediana?', 'El segundo cuartil, Q2.'),
    ('SALUD PUBLICA', 'medidas de posicion', 'Si Q3 es 80 puntos, ¿cómo interpretas ese valor?', 'Aproximadamente el 75 % de observaciones está en 80 puntos o menos.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Cuántos puntos de corte separan los datos en cuatro partes?', 'Tres cuartiles: Q1, Q2 y Q3.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Qué porcentaje representa cada una de las cuatro partes separadas por cuartiles?', '25 % de los datos.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Cuántos deciles sirven de puntos de corte?', 'Nueve, del D1 al D9.'),
    ('SALUD PUBLICA', 'medidas de posicion', 'Si D3 es 40, ¿qué proporción queda aproximadamente en 40 o menos?', 'El 30 % de las observaciones.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿A qué percentil equivale el primer decil?', 'Al percentil 10, P10.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿A qué percentil equivale el tercer cuartil?', 'Al percentil 75, P75.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Qué medida es equivalente a Q2, D5 y P50?', 'La mediana.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Cuántos percentiles marcan los cortes entre cien partes de una distribución?', 'Noventa y nueve, de P1 a P99.'),
    ('SALUD PUBLICA', 'medidas de posicion', 'Si un alumno está en P90, ¿significa que respondió correctamente el 90 % de preguntas?', 'No necesariamente. Significa que su valor supera aproximadamente al 90 % de la distribución de referencia.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Por qué los cuantiles requieren ordenar los datos?', 'Porque dependen de la posición que ocupa cada observación.'),
    ('SALUD PUBLICA', 'medidas de posicion', 'Con datos agrupados, ¿qué columna ayuda a localizar la clase de un cuartil?', 'La frecuencia acumulada.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Qué diferencia principal hay entre cuartiles, deciles y percentiles?', 'Dividen los datos ordenados en cuatro, diez y cien partes, respectivamente.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 171-188 | SALUD PUBLICA / dispersion y forma de los datos
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Por qué conocer solo la media puede ocultar diferencias entre dos grupos?', 'Porque los grupos pueden tener el mismo centro y distinta variabilidad.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué limitación tiene el rango como medida de dispersión?', 'Solo usa los dos valores extremos e ignora cómo se distribuyen los demás.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Cómo calculas el rango intercuartil?', 'Restando Q1 de Q3.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué parte del conjunto describe el rango intercuartil?', 'La dispersión de la mitad central de los datos.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Por qué el rango intercuartil resiste mejor los valores extremos que el rango total?', 'Porque se apoya en Q1 y Q3, no en el mínimo y el máximo.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué compara la varianza de cada dato con la media?', 'La diferencia entre cada dato y la media, elevada al cuadrado.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Por qué se elevan al cuadrado las diferencias respecto de la media?', 'Para evitar que las desviaciones positivas y negativas se cancelen.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Por qué la varianza de una talla en centímetros se expresa en centímetros cuadrados?', 'Porque las desviaciones usadas para calcularla se elevan al cuadrado.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Cómo se obtiene la desviación estándar a partir de la varianza?', 'Tomando su raíz cuadrada positiva.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿En qué unidades se expresa la desviación estándar?', 'En las mismas unidades que la variable original.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué significa una desviación estándar mayor, si comparas datos de la misma clase?', 'Mayor dispersión alrededor de la media.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué relaciona el coeficiente de variación?', 'La desviación estándar con la media, expresada como porcentaje.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Por qué puede ayudar el coeficiente de variación al comparar dos conjuntos con medias diferentes?', 'Porque expresa la variabilidad relativa a cada media.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', 'Si la media es mayor que la mediana, ¿hacia qué lado apunta el sesgo descrito en el texto?', 'Hacia la derecha; es sesgo positivo.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', 'Si la media es menor que la mediana, ¿qué signo tiene la asimetría?', 'Negativo, o sesgo hacia la izquierda.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué indica un coeficiente de asimetría cercano a cero?', 'Una distribución aproximadamente simétrica.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué describe la curtosis?', 'El grado de concentración de los datos alrededor de los valores centrales.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', 'Una distribución muy puntiaguda alrededor del centro, ¿cómo se denomina?', 'Leptocúrtica.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', 'Una distribución más aplanada, ¿cómo se denomina?', 'Platicúrtica.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué significa mesocúrtica en la clasificación del material?', 'Una concentración central moderada, semejante a la distribución de referencia.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 191-225 | SALUD PUBLICA / analisis de datos en excel y spss
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué complemento de Excel menciona el material para abrir ''Análisis de datos''?', 'Herramientas para análisis.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'En Excel, ¿dónde compruebas si aparece la opción ''Análisis de datos''?', 'En la pestaña Datos.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué opción eliges dentro de ''Análisis de datos'' para resumir una columna numérica?', 'Estadística descriptiva.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'Al indicar un rango de entrada en Excel, ¿qué debes seleccionar?', 'La columna de datos que vas a analizar y, si corresponde, su título.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Cuándo marcas ''Rótulos en la primera fila'' en Excel?', 'Cuando el rango elegido incluye el nombre de la variable en su primera fila.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué opción de Excel solicita media, mediana y otras medidas en una sola salida?', 'Resumen de estadísticas dentro de Estadística descriptiva.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Puede la salida de Excel sustituir la interpretación del investigador?', 'No. Hay que explicar qué significan las medidas para el problema estudiado.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'En SPSS, ¿dónde defines nombre, tipo, valores y medida de una variable?', 'En Vista de variables.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'En SPSS, ¿dónde registras las respuestas de cada participante?', 'En Vista de datos.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'Si codificas ''sí'' como 1 y ''no'' como 2, ¿qué debes definir para leer la salida?', 'Etiquetas de valor para cada código.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Para qué se usa una etiqueta de variable en SPSS?', 'Para mostrar una descripción comprensible de la variable en los resultados.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Por qué debe señalarse un código como dato perdido en vez de tratarlo como respuesta real?', 'Para que no distorsione frecuencias y cálculos estadísticos.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'Una variable como ''género'' se registra como texto. ¿Qué tipo de dato configura el ejemplo del material?', 'Cadena, y su nivel de medida como nominal.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué menú de SPSS conduce a los procedimientos estadísticos?', 'Analizar.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'Para obtener tablas por categoría en SPSS, ¿qué opción descriptiva utiliza el capítulo?', 'Frecuencias.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué información muestra una tabla de frecuencias generada por SPSS?', 'Conteos, porcentajes y, cuando corresponde, porcentajes acumulados.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué debes revisar antes de elegir un gráfico en Excel o SPSS?', 'El tipo de variable y la pregunta que quieres responder.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'Si SPSS informa datos válidos y perdidos, ¿por qué importa esa diferencia?', 'Porque los cálculos se basan en respuestas disponibles y deben interpretarse conociendo cuántos faltan.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué tipo de variables puede resumirse con media y desviación estándar en SPSS?', 'Variables cuantitativas, cuando esas medidas son apropiadas para el análisis.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué debes hacer si la tabla muestra una cifra extraña que no coincide con la codificación prevista?', 'Revisar los datos y la definición de la variable antes de interpretar el resultado.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 34-52 | BIOLOGIA CELULAR / introduccion a la biologia celular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué estudia la biología celular además de la forma de una célula?', 'Su composición química, información genética y funcionamiento.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué instrumento hizo posible observar células por primera vez?', 'El microscopio.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Quién llamó ''células'' a las pequeñas cavidades que vio en el corcho?', 'Robert Hooke.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué observó Leeuwenhoek con sus microscopios simples?', 'Entre otros, células sanguíneas, protozoos, espermatozoides y bacterias.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué idea central formularon Schleiden y Schwann sobre los seres vivos?', 'Que están formados por células, unidades básicas de su estructura y función.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué añadió Virchow a la teoría celular?', 'Que toda célula proviene de otra célula.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Por qué fueron importantes las tinciones de Golgi y Ramón y Cajal?', 'Permitieron estudiar mejor la estructura del tejido nervioso.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué aportó el microscopio electrónico al estudio celular?', 'La posibilidad de observar estructuras internas con mucho más detalle.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué pueden revelar los datos del genoma humano sobre una enfermedad?', 'Alteraciones genéticas y mecanismos de regulación que afectan el funcionamiento celular.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Una bacteria y una levadura son organismos unicelulares?', 'Sí. Cada organismo está formado por una sola célula.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Una planta y un animal son organismos multicelulares?', 'Sí. Están formados por muchas células organizadas.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué capacidad distingue a un organismo vivo de una estructura celular aislada?', 'Realizar procesos metabólicos y reproducirse de manera autónoma dentro de su organización celular.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué estructura guarda el material genético en la célula eucariota?', 'El núcleo.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Para qué sirve la información del ADN de una célula?', 'Para dirigir la síntesis de proteínas necesarias para su estructura y actividad.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Cómo se organizan generalmente los cromosomas del núcleo eucariota?', 'En varios cromosomas lineales.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Cómo se organiza normalmente el cromosoma principal de una bacteria?', 'Como una molécula circular de ADN.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué separa físicamente el ADN eucariota del citoplasma?', 'La envoltura nuclear.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 'Si una célula tiene mitocondrias y aparato de Golgi, ¿a qué organización pertenece?', 'A la eucariota.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué maquinaria fabrica proteínas en el citoplasma de células eucariotas y procariotas?', 'Los ribosomas.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué tamaño de ribosoma cita el libro para el citoplasma eucariota?', '80 S.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué tamaño de ribosoma cita el libro para las bacterias?', '70 S.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Cómo se reproducen normalmente las bacterias según el capítulo?', 'Por fisión binaria.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Cómo puede dividirse una célula eucariota según su ciclo?', 'Mediante procesos como mitosis o meiosis.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué significa que un procariota no tenga orgánulos delimitados por membrana?', 'Que no posee compartimentos como núcleo, mitocondrias o retículo endoplasmático.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué dos dominios de procariotas menciona el capítulo?', 'Bacterias y arqueas.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Por qué algunos protozoos se estudian junto con las células eucariotas?', 'Porque son organismos unicelulares con organización eucariota.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Todos los protozoos causan enfermedad humana?', 'No. El capítulo señala que solo algunas especies son parásitas.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué protozoo menciona el texto como causante de malaria?', 'Plasmodium.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué insecto transmite Plasmodium al ser humano?', 'El mosquito Anopheles.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 'En el ciclo de Plasmodium, ¿qué órgano humano invade antes de pasar a la sangre?', 'El hígado.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 'Después de salir del hígado, ¿qué células sanguíneas invade Plasmodium?', 'Los eritrocitos.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Por qué se rompen eritrocitos durante la malaria descrita?', 'Porque los parásitos se alimentan y se replican en su interior.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Un hongo puede ser unicelular o pluricelular?', 'Sí. Las levaduras son unicelulares y muchos otros hongos son pluricelulares.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Cómo se llama un hongo unicelular de forma redondeada?', 'Levadura.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué son las hifas de un hongo?', 'Filamentos formados por células alargadas.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué estructura forman las hifas cuando crecen en conjunto?', 'Un micelio.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué aporta la pared de los hongos a sus células?', 'Protección y rigidez.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué polisacárido fibroso puede integrar la pared de un hongo?', 'Quitina.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Cómo se llaman las enfermedades causadas por hongos?', 'Micosis.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Por qué Candida puede vivir sin enfermar a una persona y luego causar infección?', 'Porque puede comportarse como comensal y aprovechar condiciones favorables, como la inmunodepresión.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué tipo de hongo es Candida albicans?', 'Una levadura.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué tipo de pacientes puede sufrir micosis oportunistas graves con mayor facilidad?', 'Los pacientes inmunodeprimidos.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué hongo filamentoso menciona el capítulo por su relevancia en infecciones pulmonares?', 'Aspergillus.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué levadura se utiliza como modelo de investigación y en la fabricación de pan y cerveza?', 'Saccharomyces cerevisiae.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué ventaja ofrece Saccharomyces como modelo de laboratorio?', 'Se cultiva fácilmente y permite estudiar replicación, transcripción, proteínas y división celular.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué estructura protege del exterior a muchas bacterias?', 'La pared celular.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué componente da rigidez a la pared bacteriana?', 'El peptidoglucano.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿La pared grampositiva tiene una capa de peptidoglucano gruesa o fina?', 'Gruesa.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué capa externa caracteriza a muchas bacterias gramnegativas?', 'Una membrana externa que contiene lipopolisacáridos.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué componente gramnegativo puede actuar como endotoxina?', 'El lipopolisacárido de la membrana externa.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué efectos puede desencadenar el lipopolisacárido al activar la respuesta del huésped?', 'Fiebre y señales de inflamación, entre otros.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué ventaja puede aportar una cápsula bacteriana?', 'Protección frente a desecación y fagocitosis, además de facilitar la adhesión.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Puede haber cápsula tanto en bacterias grampositivas como gramnegativas?', 'Sí, puede encontrarse en ambos grupos.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 'Si una bacteria tiene forma de esfera, ¿cómo se llama esa forma?', 'Coco.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 'Si una bacteria tiene forma de bastón, ¿cómo se llama esa forma?', 'Bacilo.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 'Si una bacteria tiene forma espiral, ¿qué término utiliza el capítulo?', 'Espirilo.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Dónde se encuentran las enzimas y los ribosomas bacterianos si no hay núcleo?', 'Distribuidos en el citoplasma.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué es un plásmido bacteriano?', 'Una pequeña molécula circular de ADN fuera del cromosoma principal.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué ventaja puede codificar un plásmido para una bacteria?', 'Resistencia a antibióticos o adaptación a ciertas condiciones.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Para qué puede servir un flagelo bacteriano?', 'Para desplazarse.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué bacteria ácido-alcohol resistente se cita como causa de tuberculosis?', 'Mycobacterium tuberculosis.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿En qué se basa la distinción entre bacterias grampositivas y gramnegativas?', 'En diferencias de la pared que producen distinta coloración con la tinción de Gram.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué virus necesita una célula huésped para multiplicarse?', 'Todos los virus descritos: son parásitos intracelulares obligados.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué dos componentes básicos forman una partícula viral?', 'Un genoma y una cubierta proteica.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Cómo se llama la cubierta proteica del genoma viral?', 'Cápside.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Cómo se llaman las unidades que forman una cápside?', 'Capsómeros.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Todos los virus tienen envoltura lipídica?', 'No. Solo algunos poseen una envoltura por encima de la cápside.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿De dónde procede la envoltura de un virus envuelto?', 'De la membrana de una célula huésped en la que se replicó.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué material puede constituir el genoma de un virus?', 'ADN o ARN, según el virus.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Puede un genoma viral ser de cadena simple o doble?', 'Sí. El capítulo describe ambas posibilidades.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué virus infecta bacterias?', 'Un bacteriófago.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué enzima sintetiza ADN a partir de ARN en algunos virus?', 'La transcriptasa inversa.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué grupo viral incluye al VIH según el capítulo?', 'Los retrovirus.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué virus de ADN se menciona como excepción que replica en el citoplasma?', 'Los poxvirus, como el de la viruela.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué tipo de ácido nucleico tiene el virus del papiloma humano descrito?', 'ADN circular de doble cadena.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿El virus del papiloma humano del texto tiene envoltura?', 'No. Tiene cápside, pero carece de envoltura lipídica.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué células suele infectar el virus del papiloma humano?', 'Células de epitelio escamoso de piel o mucosas.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué lesión benigna puede producir una infección por HPV?', 'Una verruga o papiloma.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué proteínas virales del HPV se relacionan con la inactivación de defensas antitumorales?', 'E6 y E7.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué proteínas celulares de protección tumoral se ven afectadas por E6 y E7?', 'p53 y Rb, respectivamente.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué dos proteínas destacan en la envoltura del virus de la gripe?', 'Hemaglutinina y neuraminidasa.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué ayuda a hacer la hemaglutinina de influenza?', 'Favorece la adhesión del virus a la célula huésped.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué ayuda a hacer la neuraminidasa de influenza?', 'Facilita la salida y diseminación de nuevas partículas virales.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Por qué pueden surgir nuevas variantes del virus de la gripe?', 'Por mutaciones y nuevas combinaciones de segmentos de su genoma.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué células reconoce el VIH por la presencia de CD4?', 'Entre otras, linfocitos T cooperadores y macrófagos.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Por qué la pérdida de células CD4 favorece infecciones oportunistas?', 'Porque debilita la coordinación de la respuesta inmunitaria.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué enzima del VIH integra el ADN viral en el genoma de la célula?', 'La integrasa.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué es un provirus en el ciclo del VIH descrito?', 'ADN de origen viral integrado en el genoma de la célula huésped.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué gen del VIH codifica enzimas como transcriptasa inversa e integrasa?', 'El gen pol.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué gen del VIH produce proteínas de la envoltura?', 'El gen env.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué diferencia a un viroide de un virus con cápside?', 'El viroide es ARN circular pequeño sin cubierta proteica.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿A qué organismos afectan los viroides descritos en el capítulo?', 'A plantas.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Codifica proteínas un viroide típico según el texto?', 'No parece codificar ninguna.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué es un prión patógeno en este capítulo?', 'Una proteína mal plegada capaz de inducir el mal plegamiento de otras.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿En qué tipo de tejido se expresa la proteína priónica normal mencionada?', 'En la superficie de neuronas, entre otros sitios del sistema nervioso.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué puede pasar cuando una proteína priónica patógena toca una normal?', 'Puede inducir un cambio de forma que convierte a la normal en patógena.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué clase de enfermedad se asocia con los priones mencionados?', 'Encefalopatías espongiformes transmisibles.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué enfermedad humana se cita como ejemplo de trastorno priónico?', 'La enfermedad de Creutzfeldt-Jakob.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 292-342 | BIOLOGIA CELULAR / nucleo y cromatina
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si dos células de tu cuerpo tienen el mismo ADN, ¿por qué pueden cumplir funciones distintas?', 'Porque activan y utilizan conjuntos diferentes de genes.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Dónde se encuentra la mayor parte del material genético de una célula eucariota?', 'En el núcleo.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué dos procesos relacionados con el ADN ocurren en el núcleo?', 'La replicación del ADN y la transcripción de genes.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué separa el contenido del núcleo del citoplasma?', 'La envoltura nuclear, formada por dos membranas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si observas ribosomas sobre una de las membranas nucleares, ¿cuál es?', 'La membrana nuclear externa.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Con qué orgánulo continúa la membrana externa del núcleo?', 'Con el retículo endoplasmático rugoso.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué estructura sostiene la membrana nuclear interna?', 'La lámina nuclear, una red de proteínas llamadas láminas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué la envoltura nuclear no es una barrera completamente cerrada?', 'Porque tiene poros que permiten un intercambio controlado con el citoplasma.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Puede cualquier proteína grande cruzar un poro nuclear sin reconocimiento?', 'No. El transporte de macromoléculas necesita señales y proteínas transportadoras.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Una proteína debe entrar al núcleo. ¿Qué señal indica su destino?', 'Una señal de localización nuclear reconocida por el sistema de importación.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué proteínas reconocen una carga destinada a entrar al núcleo?', 'Las importinas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué proteínas participan en la salida dirigida de moléculas del núcleo?', 'Las exportinas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué pequeña proteína ayuda a dar dirección al transporte nuclear?', 'Ran, que alterna entre formas unidas a GTP y a GDP.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Dónde predomina Ran unida a GTP en el transporte núcleo-citoplasma?', 'En el núcleo.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué una célula muy activa en síntesis de proteínas puede tener más poros nucleares?', 'Porque necesita intercambiar más ARN y proteínas entre el núcleo y el citoplasma.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'En interfase, ¿los cromosomas ocupan lugares totalmente aleatorios dentro del núcleo?', 'No. Se distribuyen en territorios cromosómicos.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué estructura nuclear se relaciona con la producción de ARN ribosómico?', 'El nucléolo.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿El nucléolo tiene una membrana propia que lo rodea?', 'No. Es una región densa del interior nuclear, sin membrana delimitante.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué incluye la cromatina además del ADN?', 'Proteínas, sobre todo histonas y también proteínas no histonas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si estiras todo el ADN nuclear de una célula humana, ¿por qué necesita empaquetarse?', 'Porque su longitud es enorme frente al espacio disponible dentro del núcleo.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cuál es la unidad básica del empaquetamiento de la cromatina?', 'El nucleosoma.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué ocurre con el ADN al formar un nucleosoma?', 'Se enrolla alrededor de un octámero de histonas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué histona ayuda a organizar el ADN entre nucleosomas?', 'La histona H1.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿A qué se parece la fibra de cromatina menos compactada al microscopio?', 'A cuentas en un collar: nucleosomas conectados por ADN.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué las histonas se unen con facilidad al ADN?', 'Porque sus cargas positivas favorecen la interacción con el ADN, de carga negativa.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué suele pasar con la cromatina cuando se acetilan las histonas?', 'Se vuelve más accesible y suele favorecer la transcripción.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué la acetilación de histonas puede facilitar la expresión de un gen?', 'Reduce la afinidad de la histona por el ADN y abre la cromatina.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Toda metilación de histonas activa la transcripción?', 'No. Su efecto depende del residuo modificado y del contexto de la cromatina.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si una región de ADN está muy condensada durante la interfase, ¿cómo se denomina?', 'Heterocromatina.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué tipo de cromatina suele teñirse más intensamente: la eucromatina o la heterocromatina?', 'La heterocromatina, porque está más compactada.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué cromatina suele ser más accesible para la transcripción?', 'La eucromatina.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cómo se llama la heterocromatina que permanece compacta en la mayoría de las células?', 'Heterocromatina constitutiva.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué ejemplo humano muestra una inactivación de cromatina durante el desarrollo?', 'La inactivación de uno de los cromosomas X en células con dos X.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'En una mujer, ¿se inactiva siempre el cromosoma X procedente del mismo progenitor?', 'No. La elección inicial puede ser paterna o materna y se mantiene en las células hijas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cómo se llama el cromosoma X condensado e inactivo que puede verse en el núcleo?', 'Corpúsculo de Barr.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Para qué ayuda la inactivación de un cromosoma X?', 'Para compensar la dosis de genes ligados al X entre células con distinto número de cromosomas X.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cuándo se distinguen mejor los cromosomas individuales al microscopio óptico?', 'Durante la división celular, especialmente en metafase.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué se condensan mucho los cromosomas antes de dividirse la célula?', 'Para facilitar el reparto ordenado del ADN a las células hijas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Después de copiarse el ADN, ¿cuántas cromátidas hermanas tiene un cromosoma metafásico?', 'Dos cromátidas hermanas unidas en la región del centrómero.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué estructura del cromosoma es esencial para separar las cromátidas en la división?', 'El centrómero, donde se organiza el cinetocoro.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué puede ocurrirle a un fragmento cromosómico sin centrómero durante la división?', 'Puede perderse porque no se segrega de manera normal.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si el centrómero está cerca de un extremo, ¿cómo se llama ese cromosoma?', 'Acrocéntrico.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si el centrómero está aproximadamente en la mitad, ¿cómo se llama ese cromosoma?', 'Metacéntrico.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué protege los extremos de los cromosomas?', 'Los telómeros.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué tienen en común los cromosomas homólogos?', 'Los mismos genes en las mismas posiciones, aunque pueden llevar alelos diferentes.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cuántos cromosomas hay normalmente en una célula somática humana?', '46, organizados en 23 pares.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cuántos pares de autosomas tiene normalmente una célula somática humana?', '22 pares; el par restante corresponde a los cromosomas sexuales.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Para qué sirve ordenar y observar los cromosomas en un cariotipo?', 'Para estudiar su número y detectar alteraciones grandes de su estructura.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué se usan células detenidas en metafase para un cariotipo?', 'Porque en metafase los cromosomas están muy condensados y se distinguen mejor.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si el informe dice 46,XY, ¿qué describe?', 'Un cariotipo con 46 cromosomas y cromosomas sexuales X e Y.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si el informe dice 46,XX, ¿qué describe?', 'Un cariotipo con 46 cromosomas y dos cromosomas sexuales X.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué aporta el patrón de bandas a un estudio cromosómico?', 'Permite identificar cromosomas y reconocer algunas alteraciones estructurales.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué técnica usa sondas fluorescentes para localizar secuencias concretas de ADN?', 'La hibridación fluorescente in situ, o FISH.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué es una aneuploidía?', 'Una alteración del número de cromosomas individuales, sin añadir un juego completo.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si hay tres copias de un cromosoma en vez de dos, ¿qué alteración es?', 'Una trisomía.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si falta una copia de un cromosoma de un par, ¿qué alteración es?', 'Una monosomía.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué significa que una persona sea mosaico cromosómico?', 'Que tiene dos o más poblaciones celulares con constituciones cromosómicas distintas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué diferencia una alteración cromosómica germinal de una somática?', 'La germinal puede transmitirse por gametos; la somática queda en las células derivadas de la afectada.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué estudia el genoma de un organismo?', 'El conjunto de su material genético.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Un gen incluye solo la parte que codifica una proteína?', 'No. También puede incluir secuencias necesarias para regular su producto, y algunos genes producen ARN funcional.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cómo se llaman los segmentos que permanecen en el ARN maduro tras el corte y empalme?', 'Exones.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cómo se llaman los segmentos que suelen retirarse del transcrito inicial?', 'Intrones.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Todo el ADN humano codifica proteínas?', 'No. Una gran parte es ADN no codificante, con funciones reguladoras o repetitivas, entre otras.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué es un microsatélite en el genoma?', 'Una secuencia corta de ADN repetida en tándem muchas veces.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué diferencia principal hay entre un microsatélite y un minisatélite?', 'El tamaño de la unidad de ADN que se repite.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué significa que una secuencia repetida esté dispersa por el genoma?', 'Que sus copias aparecen en lugares diferentes, no una detrás de otra.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué elementos repetidos largos pueden transponerse por sí mismos?', 'Los LINE, porque algunos codifican proteínas necesarias para su movilización.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿En qué fase de la interfase se duplica el ADN?', 'En la fase S.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué debe replicarse el ADN antes de una división celular?', 'Para que cada célula hija reciba una copia de la información genética.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué significa que la replicación del ADN sea semiconservativa?', 'Que cada doble hélice hija conserva una hebra original y contiene una hebra nueva.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Dónde comienza la copia de una molécula de ADN?', 'En uno o varios orígenes de replicación.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué el genoma eucariota usa muchos orígenes de replicación?', 'Porque sus moléculas de ADN son grandes y deben copiarse dentro de un tiempo limitado.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué enzima abre la doble hélice durante la replicación?', 'La helicasa.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué pieza corta necesita la ADN polimerasa para comenzar a sintetizar?', 'Un cebador que aporta un extremo 3'' disponible.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué enzima fabrica el cebador inicial de ARN?', 'La primasa.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿En qué dirección crece una nueva cadena de ADN?', 'De 5'' a 3'', al añadir nucleótidos a su extremo 3''.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué una hebra nueva se sintetiza por fragmentos?', 'Porque las dos hebras molde son antiparalelas y la polimerasa solo extiende en dirección 5'' a 3''.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Cómo se llaman los fragmentos de la hebra de síntesis discontinua?', 'Fragmentos de Okazaki.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué enzima une los fragmentos de ADN después de retirar los cebadores?', 'La ADN ligasa.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué problema aparece al copiar los extremos de cromosomas lineales?', 'La maquinaria de replicación no completa del todo un extremo, por lo que los telómeros tienden a acortarse.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué enzima puede alargar los telómeros?', 'La telomerasa.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué es una mutación del ADN?', 'Un cambio en la secuencia de nucleótidos o, en sentido amplio, en la organización cromosómica.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Una mutación somática se transmite necesariamente a los hijos?', 'No. La herencia a la descendencia requiere que afecte a la línea germinal.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué una mutación somática temprana puede afectar a muchos tejidos?', 'Porque muchas células del organismo descienden de la célula en la que ocurrió.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué es la recombinación homóloga durante la meiosis?', 'El intercambio de segmentos entre cromosomas homólogos, que genera nuevas combinaciones de alelos.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué la recombinación homóloga contribuye a que los hijos sean diferentes entre sí?', 'Porque crea combinaciones nuevas de material genético paterno y materno.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si durante la copia queda una base mal apareada, ¿qué sistema puede corregirla?', 'La reparación de bases desapareadas, o mismatch repair.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué reparación retira una base dañada sin eliminar un segmento largo de la hebra?', 'La reparación por escisión de bases, o BER.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué sistema repara daños que distorsionan la doble hélice, como los dímeros de pirimidina?', 'La reparación por escisión de nucleótidos, o NER.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si se rompen las dos hebras del ADN, ¿qué reparación puede usar una copia homóloga como molde?', 'La reparación por recombinación homóloga.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué reparación puede volver a unir directamente extremos de una rotura de doble cadena?', 'La unión de extremos no homólogos.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué la unión de extremos no homólogos puede introducir cambios en la secuencia?', 'Porque los extremos pueden procesarse antes de unirse, con pérdida o adición de nucleótidos.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué pasaría si fallan los mecanismos de reparación del ADN?', 'Se acumularían cambios genéticos que pueden alterar funciones celulares y favorecer enfermedades.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿La cromatina se mantiene igual de compacta durante todo el ciclo celular?', 'No. Su empaquetamiento cambia, y alcanza una gran condensación durante la división.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué no basta con saber la secuencia de un gen para saber si se está usando?', 'Porque su expresión también depende de la accesibilidad de la cromatina y de mecanismos reguladores.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿La información genética de una célula está limitada a las secuencias que producen proteínas?', 'No. También hay secuencias reguladoras y genes cuyo producto funcional es ARN.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué relación hay entre el centrómero y el cinetocoro?', 'El cinetocoro se organiza sobre la región centromérica y conecta el cromosoma con el aparato de segregación.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué estructura nuclear debe desmontarse y reorganizarse durante la división celular?', 'La envoltura nuclear.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si una célula no copiara un cromosoma antes de dividirse, ¿qué riesgo habría?', 'Que las células hijas no recibieran una dotación completa de información genética.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por qué el ADN necesita tanto empaquetamiento como accesibilidad?', 'Debe caber y protegerse en el núcleo, pero también abrirse para replicarse, repararse y expresarse.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 743-773 | MORFOFUNCION / corazon
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'corazon', 'Si sigues una gota de sangre desde la vena cava, ¿a qué cámara entra primero?', 'A la aurícula derecha.'),
    ('MORFOFUNCION', 'corazon', 'Después de salir del ventrículo derecho, ¿hacia dónde viaja la sangre?', 'Hacia los pulmones por el tronco y las arterias pulmonares.'),
    ('MORFOFUNCION', 'corazon', '¿Qué vasos devuelven al corazón la sangre que se oxigenó en los pulmones?', 'Las venas pulmonares, que desembocan en la aurícula izquierda.'),
    ('MORFOFUNCION', 'corazon', 'Después de pasar la válvula mitral, ¿a qué cámara llega la sangre?', 'Al ventrículo izquierdo.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué válvula pasa la sangre al salir del ventrículo izquierdo hacia la aorta?', 'Por la válvula aórtica.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué válvula sale la sangre del ventrículo derecho hacia el tronco pulmonar?', 'Por la válvula pulmonar.'),
    ('MORFOFUNCION', 'corazon', '¿En qué se diferencia una válvula semilunar de una auriculoventricular por su ubicación?', 'La semilunar está a la salida de un ventrículo; la auriculoventricular comunica aurícula y ventrículo.'),
    ('MORFOFUNCION', 'corazon', '¿Qué evita la válvula aórtica cuando el ventrículo izquierdo se relaja?', 'Que la sangre de la aorta regrese al ventrículo.'),
    ('MORFOFUNCION', 'corazon', '¿Qué evita la válvula pulmonar tras la contracción del ventrículo derecho?', 'Que la sangre del tronco pulmonar vuelva al ventrículo derecho.'),
    ('MORFOFUNCION', 'corazon', '¿Las válvulas del corazón se abren porque tienen músculos propios?', 'No. Se abren y cierran por diferencias de presión a ambos lados.'),
    ('MORFOFUNCION', 'corazon', '¿Qué hacen los músculos papilares cuando se contraen los ventrículos?', 'Tensan las cuerdas tendinosas y ayudan a impedir que las válvulas AV se inviertan.'),
    ('MORFOFUNCION', 'corazon', '¿Las cuerdas tendinosas abren activamente las válvulas AV?', 'No. Su función es evitar que las valvas protruyan hacia las aurículas.'),
    ('MORFOFUNCION', 'corazon', '¿Cuál es la ruta de una gota de sangre desde la aurícula derecha hasta la izquierda?', 'Aurícula derecha, válvula tricúspide, ventrículo derecho, válvula pulmonar, pulmones, venas pulmonares y aurícula izquierda.'),
    ('MORFOFUNCION', 'corazon', '¿Qué vasos nutren al músculo cardiaco con sangre oxigenada?', 'Las arterias coronarias.'),
    ('MORFOFUNCION', 'corazon', '¿De dónde nacen las arterias coronarias?', 'De la aorta ascendente, cerca de la válvula aórtica.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué el miocardio no depende de la sangre que pasa por las cámaras para nutrirse?', 'Porque la pared muscular recibe su propio riego a través de la circulación coronaria.'),
    ('MORFOFUNCION', 'corazon', '¿Qué rama de la coronaria izquierda desciende por el surco interventricular anterior?', 'La arteria interventricular anterior, también llamada descendente anterior.'),
    ('MORFOFUNCION', 'corazon', '¿Qué rama de la coronaria izquierda recorre el surco coronario hacia el lado izquierdo?', 'La rama circunfleja.'),
    ('MORFOFUNCION', 'corazon', '¿A dónde regresa gran parte de la sangre venosa del propio corazón?', 'Al seno coronario, que desemboca en la aurícula derecha.'),
    ('MORFOFUNCION', 'corazon', '¿En qué fase reciben más flujo las arterias coronarias del ventrículo izquierdo?', 'Durante la diástole, cuando el miocardio se relaja.'),
    ('MORFOFUNCION', 'corazon', 'Si se obstruye una arteria coronaria, ¿qué tejido queda en riesgo?', 'El miocardio que depende de esa arteria para recibir oxígeno.'),
    ('MORFOFUNCION', 'corazon', '¿Qué significa que el corazón sea miogénico?', 'Que el estímulo inicial del latido surge en el propio tejido cardiaco.'),
    ('MORFOFUNCION', 'corazon', '¿Necesita el corazón una orden nerviosa para iniciar cada latido?', 'No. El sistema nervioso modula su frecuencia y fuerza, pero el ritmo nace en el corazón.'),
    ('MORFOFUNCION', 'corazon', '¿Qué característica de las células cardiacas les permite contraerse como una red coordinada?', 'Su comunicación eléctrica por uniones intercelulares comunicantes.'),
    ('MORFOFUNCION', 'corazon', '¿Qué estructuras unen mecánicamente células del músculo cardiaco?', 'Componentes de los discos intercalares, como desmosomas y fascia adherente.'),
    ('MORFOFUNCION', 'corazon', '¿Qué permiten las uniones comunicantes de los discos intercalares?', 'El paso de corriente entre cardiocitos para propagar la excitación.'),
    ('MORFOFUNCION', 'corazon', '¿Qué estructura suele iniciar el impulso de un latido normal?', 'El nódulo sinoauricular, o SA.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué el nódulo SA se considera marcapasos natural?', 'Porque sus células generan impulsos espontáneos que normalmente fijan el ritmo.'),
    ('MORFOFUNCION', 'corazon', 'Después de extenderse por las aurículas, ¿a qué nódulo llega la señal eléctrica?', 'Al nódulo auriculoventricular, o AV.'),
    ('MORFOFUNCION', 'corazon', '¿Para qué sirve el retraso de la señal en el nódulo AV?', 'Permite que las aurículas terminen de vaciarse antes de que se contraigan los ventrículos.'),
    ('MORFOFUNCION', 'corazon', '¿Qué vía conduce la señal desde el nódulo AV hacia el tabique interventricular?', 'El haz auriculoventricular o haz de His.'),
    ('MORFOFUNCION', 'corazon', 'Después del haz de His, ¿por qué ramas baja el impulso?', 'Por las ramas derecha e izquierda del haz.'),
    ('MORFOFUNCION', 'corazon', '¿Qué fibras distribuyen rápidamente la excitación por el miocardio ventricular?', 'Las fibras de Purkinje.'),
    ('MORFOFUNCION', 'corazon', '¿Qué parte del corazón ayuda a aislar eléctricamente aurículas y ventrículos?', 'El esqueleto fibroso, de modo que la señal normal pasa por el sistema AV.'),
    ('MORFOFUNCION', 'corazon', 'Si falla el marcapasos SA, ¿pueden otras regiones generar un ritmo?', 'Sí. Otras células del sistema de conducción pueden actuar como marcapasos de escape.'),
    ('MORFOFUNCION', 'corazon', '¿Qué es el ritmo sinusal?', 'El ritmo cardiaco iniciado normalmente por el nódulo SA.'),
    ('MORFOFUNCION', 'corazon', '¿Qué ocurre primero en el ciclo eléctrico normal: excitación auricular o ventricular?', 'La auricular; luego la señal atraviesa el sistema AV y excita los ventrículos.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué la contracción del corazón no puede sostenerse como un tétanos continuo?', 'Porque su potencial de acción y período refractario son prolongados y permiten relajación entre latidos.'),
    ('MORFOFUNCION', 'corazon', '¿Qué ion contribuye a la meseta del potencial de acción del músculo cardiaco?', 'El calcio.'),
    ('MORFOFUNCION', 'corazon', '¿Qué registra un electrocardiograma?', 'Cambios eléctricos del corazón detectados desde la superficie corporal.'),
    ('MORFOFUNCION', 'corazon', 'En un ECG normal, ¿qué representa la onda P?', 'La despolarización de las aurículas.'),
    ('MORFOFUNCION', 'corazon', 'En un ECG normal, ¿qué representa el complejo QRS?', 'La despolarización de los ventrículos.'),
    ('MORFOFUNCION', 'corazon', 'En un ECG normal, ¿qué representa la onda T?', 'La repolarización de los ventrículos.'),
    ('MORFOFUNCION', 'corazon', '¿Se ve fácilmente la repolarización auricular como onda separada en el ECG?', 'No. Suele quedar oculta por el complejo QRS.'),
    ('MORFOFUNCION', 'corazon', '¿Un ECG muestra directamente cuánto bombea el corazón?', 'No. Muestra actividad eléctrica; el bombeo mecánico debe evaluarse con otros datos.'),
    ('MORFOFUNCION', 'corazon', '¿Cómo se llama la fase de contracción de una cámara cardiaca?', 'Sístole.'),
    ('MORFOFUNCION', 'corazon', '¿Cómo se llama la fase de relajación y llenado de una cámara cardiaca?', 'Diástole.'),
    ('MORFOFUNCION', 'corazon', 'Cuando la presión ventricular supera la auricular, ¿qué pasa con las válvulas AV?', 'Se cierran.'),
    ('MORFOFUNCION', 'corazon', 'Cuando la presión ventricular supera la de la aorta, ¿qué pasa con la válvula aórtica?', 'Se abre y permite la eyección.'),
    ('MORFOFUNCION', 'corazon', '¿Qué ocurre durante la contracción isovolumétrica ventricular?', 'Aumenta la presión con todas las válvulas cerradas y sin cambio de volumen.'),
    ('MORFOFUNCION', 'corazon', '¿Qué ocurre durante la relajación isovolumétrica ventricular?', 'La presión ventricular desciende con todas las válvulas cerradas y volumen casi constante.'),
    ('MORFOFUNCION', 'corazon', '¿Cuándo empiezan a llenarse los ventrículos tras la relajación isovolumétrica?', 'Cuando su presión cae por debajo de la auricular y se abren las válvulas AV.'),
    ('MORFOFUNCION', 'corazon', '¿Qué aporta la contracción de las aurículas al final del llenado ventricular?', 'Empuja una cantidad adicional de sangre hacia los ventrículos.'),
    ('MORFOFUNCION', 'corazon', '¿Qué significa volumen telediastólico?', 'La cantidad de sangre en un ventrículo al terminar su llenado.'),
    ('MORFOFUNCION', 'corazon', '¿Qué significa volumen telesistólico?', 'La sangre que queda en un ventrículo después de la eyección.'),
    ('MORFOFUNCION', 'corazon', '¿Cómo se obtiene el volumen sistólico a partir de los volúmenes ventriculares?', 'Restando el volumen telesistólico del telediastólico.'),
    ('MORFOFUNCION', 'corazon', '¿Qué produce principalmente el primer tono cardiaco, S1?', 'El cierre de las válvulas auriculoventriculares al comenzar la sístole ventricular.'),
    ('MORFOFUNCION', 'corazon', '¿Qué produce principalmente el segundo tono cardiaco, S2?', 'El cierre de las válvulas semilunares al terminar la eyección.'),
    ('MORFOFUNCION', 'corazon', '¿A qué momento del ciclo sigue el cierre de la válvula aórtica?', 'Al inicio de la relajación ventricular, cuando la presión aórtica supera la ventricular.'),
    ('MORFOFUNCION', 'corazon', 'Si una válvula no cierra bien y la sangre retrocede, ¿qué problema hay?', 'Insuficiencia o regurgitación valvular.'),
    ('MORFOFUNCION', 'corazon', 'Si una válvula se estrecha y dificulta el paso de sangre, ¿qué problema hay?', 'Estenosis valvular.'),
    ('MORFOFUNCION', 'corazon', '¿Qué es el gasto cardiaco?', 'La cantidad de sangre que bombea un ventrículo en un minuto.'),
    ('MORFOFUNCION', 'corazon', '¿Cómo calculas el gasto cardiaco si conoces frecuencia y volumen sistólico?', 'Multiplicas la frecuencia cardiaca por el volumen sistólico.'),
    ('MORFOFUNCION', 'corazon', 'Si aumenta la frecuencia pero cada latido expulsa menos sangre, ¿el gasto necesariamente sube?', 'No necesariamente; depende del producto de frecuencia y volumen sistólico.'),
    ('MORFOFUNCION', 'corazon', '¿Qué es la precarga del corazón?', 'El estiramiento del músculo ventricular antes de contraerse, relacionado con su llenado.'),
    ('MORFOFUNCION', 'corazon', 'Según Frank-Starling, ¿qué suele ocurrir cuando aumenta el llenado ventricular dentro de límites normales?', 'Aumenta la fuerza de contracción y el volumen expulsado.'),
    ('MORFOFUNCION', 'corazon', '¿Qué significa poscarga para el ventrículo?', 'La resistencia o presión que debe vencer para expulsar sangre.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué la hipertensión aumenta el trabajo del ventrículo izquierdo?', 'Porque debe generar más presión para eyectar sangre hacia la circulación sistémica.'),
    ('MORFOFUNCION', 'corazon', '¿Qué hace el sistema simpático con la frecuencia cardiaca?', 'Tiende a aumentarla.'),
    ('MORFOFUNCION', 'corazon', '¿Qué hace la estimulación parasimpática vagal con la frecuencia cardiaca?', 'Tiende a disminuirla.'),
    ('MORFOFUNCION', 'corazon', '¿El sistema autónomo crea el ritmo o modifica un ritmo que ya existe?', 'Modifica un ritmo que se genera espontáneamente en el corazón.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué una persona entrenada puede tener pocos latidos por minuto en reposo sin bajo gasto?', 'Porque suele expulsar más sangre en cada latido.'),
    ('MORFOFUNCION', 'corazon', '¿Qué es la reserva cardiaca?', 'La capacidad de aumentar el gasto cardiaco por encima del nivel de reposo.'),
    ('MORFOFUNCION', 'corazon', '¿Qué relación tiene el ejercicio con el gasto cardiaco?', 'Durante el ejercicio aumenta para llevar más oxígeno y nutrientes a los tejidos.'),
    ('MORFOFUNCION', 'corazon', '¿Qué pasa si el ventrículo izquierdo no bombea adecuadamente hacia el cuerpo?', 'La sangre puede acumularse detrás de él, en la circulación pulmonar.'),
    ('MORFOFUNCION', 'corazon', '¿Qué pasa si falla el bombeo del ventrículo derecho?', 'Puede acumularse sangre en la circulación sistémica y aparecer edema periférico.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué es importante conservar el flujo coronario durante cada latido?', 'El miocardio necesita suministro continuo de oxígeno para contraerse.'),
    ('MORFOFUNCION', 'corazon', '¿Qué puede producir una obstrucción mantenida de una arteria coronaria?', 'Isquemia y, si el daño progresa, infarto de miocardio.'),
    ('MORFOFUNCION', 'corazon', '¿Qué diferencia hay entre frecuencia cardiaca y volumen sistólico?', 'La frecuencia son latidos por minuto; el volumen sistólico es sangre expulsada por latido.'),
    ('MORFOFUNCION', 'corazon', '¿Qué secuencia de válvulas recorre la sangre desde la aurícula derecha hasta la aorta?', 'Tricúspide, pulmonar, mitral y aórtica.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué los ventrículos no deberían contraerse antes de vaciarse las aurículas?', 'Perderían parte del llenado que las aurículas aportan al final de la diástole.'),
    ('MORFOFUNCION', 'corazon', '¿Qué relación tienen sístole ventricular y apertura de las válvulas semilunares?', 'Al subir la presión ventricular por encima de la arterial, las válvulas semilunares se abren.'),
    ('MORFOFUNCION', 'corazon', '¿Qué relación tienen diástole ventricular y apertura de las válvulas AV?', 'Al caer la presión ventricular por debajo de la auricular, las válvulas AV se abren.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué el corazón se considera una bomba doble?', 'El lado derecho impulsa sangre al circuito pulmonar y el izquierdo al sistémico.'),
    ('MORFOFUNCION', 'corazon', '¿Qué cámara recibe la sangre de la vena cava superior e inferior?', 'La aurícula derecha.'),
    ('MORFOFUNCION', 'corazon', '¿Qué cámara impulsa directamente la sangre hacia el circuito sistémico?', 'El ventrículo izquierdo.'),
    ('MORFOFUNCION', 'corazon', '¿Qué cámara impulsa directamente la sangre hacia el circuito pulmonar?', 'El ventrículo derecho.'),
    ('MORFOFUNCION', 'corazon', '¿Qué estructura impide la mezcla directa de sangre entre ambos ventrículos?', 'El tabique interventricular.'),
    ('MORFOFUNCION', 'corazon', '¿Qué le ocurre a la presión ventricular justo antes de que se abra una válvula semilunar?', 'Sube hasta superar la presión de la arteria de salida.'),
    ('MORFOFUNCION', 'corazon', '¿Qué le ocurre al volumen ventricular durante la eyección?', 'Disminuye a medida que la sangre sale hacia la arteria.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué un ritmo excesivamente rápido puede reducir el llenado del ventrículo?', 'Porque acorta la diástole disponible para llenarse entre latidos.'),
    ('MORFOFUNCION', 'corazon', '¿Qué muestra un pulso arterial después de la contracción del ventrículo izquierdo?', 'La onda de presión generada por la eyección de sangre hacia la aorta.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué debe coordinarse la excitación eléctrica con las válvulas cardiacas?', 'Porque la contracción cambia presiones y esas diferencias abren o cierran las válvulas.'),
    ('MORFOFUNCION', 'corazon', '¿Qué mide la frecuencia cardiaca?', 'El número de latidos en un minuto.'),
    ('MORFOFUNCION', 'corazon', '¿Qué diferencia hay entre isquemia e infarto del miocardio?', 'La isquemia es aporte insuficiente de sangre; el infarto implica muerte de tejido por una isquemia mantenida.'),
    ('MORFOFUNCION', 'corazon', '¿La sangre oxigenada vuelve de los pulmones por arterias o por venas?', 'Por las venas pulmonares.'),
    ('MORFOFUNCION', 'corazon', '¿La sangre que va del corazón a los pulmones sale por arterias o por venas?', 'Por las arterias pulmonares.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué una arteria pulmonar puede transportar sangre pobre en oxígeno?', 'Porque arteria se define por salir del corazón, no por el contenido de oxígeno.'),
    ('MORFOFUNCION', 'corazon', '¿Por qué una vena pulmonar puede transportar sangre rica en oxígeno?', 'Porque vena se define por regresar al corazón, no por el contenido de oxígeno.')
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

-- 996 tarjetas, 29 temas, 3 materias.