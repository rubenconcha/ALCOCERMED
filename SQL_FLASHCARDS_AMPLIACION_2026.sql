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

-- biologia: páginas PDF 581-590 | BIOLOGIA CELULAR / ciclo celular
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
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué le ocurre a una célula cuando el acortamiento telomérico limita nuevas divisiones?', 'Puede entrar en senescencia replicativa.')
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

-- morfo: páginas PDF 883-891 | MORFOFUNCION / aparato respiratorio
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
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué ramas marcan el final de la zona conductora del árbol bronquial?', 'Los bronquiolos terminales.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 981-997 | MORFOFUNCION / aparato digestivo
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
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué tipo de células gástricas libera mensajeros que regulan la digestión?', 'Las células enteroendocrinas.')
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

-- 217 tarjetas, 11 temas, 3 materias.