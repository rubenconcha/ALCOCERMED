-- Tarjetas originales, redactadas a partir de los tres PDF oficiales del curso.
-- SALUD PUBLICA es la clave histórica de la base de datos; la interfaz muestra Educación para la Salud.
-- Importación aditiva e idempotente: conserva las tarjetas y el progreso ya existentes.
BEGIN;

-- morfo: páginas PDF 29-69 | MORFOFUNCION / temas principales de anatomia y fisiologia
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'temas principales de anatomia y fisiologia', 'Si te preguntan por la forma de un órgano, ¿estás hablando de anatomía o de fisiología?', 'De anatomía. La fisiología se ocupa de cómo funciona ese órgano.'),
    ('MORFOFUNCION', 'temas principales de anatomia y fisiologia', '¿Qué busca conservar el cuerpo cuando mantiene estables sus condiciones internas?', 'La homeostasis: una estabilidad relativa del medio interno pese a los cambios del entorno.'),
    ('MORFOFUNCION', 'temas principales de anatomia y fisiologia', 'Cuando sube la temperatura corporal y sudas para bajarla, ¿qué tipo de retroalimentación actúa?', 'Retroalimentación negativa, porque la respuesta se opone al cambio inicial.'),
    ('MORFOFUNCION', 'temas principales de anatomia y fisiologia', 'En posición anatómica, ¿hacia dónde miran las palmas de las manos?', 'Hacia delante, con el cuerpo erguido y los brazos a los lados.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 70-105 | MORFOFUNCION / la quimica de la vida
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'la quimica de la vida', 'Un átomo pierde un electrón. ¿Qué carga adquiere el ion resultante?', 'Positiva; al perder una carga negativa queda con más protones que electrones.'),
    ('MORFOFUNCION', 'la quimica de la vida', '¿Qué te indica un pH más bajo: mayor o menor concentración de H+?', 'Mayor concentración de H+; por eso la solución es más ácida.'),
    ('MORFOFUNCION', 'la quimica de la vida', '¿Qué hacen las enzimas para acelerar una reacción sin consumirse?', 'Disminuyen la energía de activación necesaria para que la reacción ocurra.'),
    ('MORFOFUNCION', 'la quimica de la vida', '¿Por qué el agua es tan útil como medio de las reacciones del cuerpo?', 'Su polaridad le permite disolver muchas sustancias y facilitar sus interacciones.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 106-141 | MORFOFUNCION / forma y funcion celulares
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'forma y funcion celulares', 'Una célula se hincha al entrar agua. ¿Qué proceso explica ese movimiento a través de la membrana?', 'La ósmosis: el agua se desplaza a través de una membrana selectivamente permeable.'),
    ('MORFOFUNCION', 'forma y funcion celulares', '¿Qué estructura separa el interior celular del líquido que la rodea y regula intercambios?', 'La membrana plasmática.'),
    ('MORFOFUNCION', 'forma y funcion celulares', 'Si una célula necesita fabricar mucho ATP, ¿qué organelo será especialmente importante?', 'La mitocondria, donde ocurre gran parte de la respiración aeróbica.'),
    ('MORFOFUNCION', 'forma y funcion celulares', '¿Qué función cumplen las microvellosidades de la superficie celular?', 'Aumentan el área de superficie para procesos como la absorción.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 142-170 | MORFOFUNCION / genetica y funcion celular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'genetica y funcion celular', '¿Qué molécula conserva las instrucciones hereditarias de la célula?', 'El ADN.'),
    ('MORFOFUNCION', 'genetica y funcion celular', 'Si una célula copia la información de un gen a ARN, ¿cómo se llama ese paso?', 'Transcripción.'),
    ('MORFOFUNCION', 'genetica y funcion celular', '¿Qué hace un ribosoma con la información del ARN mensajero?', 'La traduce en una secuencia de aminoácidos para formar una proteína.'),
    ('MORFOFUNCION', 'genetica y funcion celular', 'Antes de que una célula se divida, ¿qué debe ocurrir con su ADN?', 'Debe duplicarse para repartir la información genética a las células hijas.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 171-207 | MORFOFUNCION / histologia
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'histologia', '¿Qué tejido forma una cubierta y reviste cavidades del cuerpo?', 'El tejido epitelial.'),
    ('MORFOFUNCION', 'histologia', '¿Qué tejido suele tener células separadas por abundante matriz extracelular?', 'El tejido conjuntivo.'),
    ('MORFOFUNCION', 'histologia', '¿Qué cuatro grandes clases de tejido debes reconocer en una lámina?', 'Epitelial, conjuntivo, muscular y nervioso.'),
    ('MORFOFUNCION', 'histologia', 'Si una muestra tiene células especializadas en contraerse, ¿qué clase de tejido es?', 'Tejido muscular.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 208-233 | MORFOFUNCION / sistema tegumentario
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'sistema tegumentario', '¿Cuál es la capa más superficial de la piel?', 'La epidermis, un epitelio estratificado queratinizado.'),
    ('MORFOFUNCION', 'sistema tegumentario', '¿Qué capa de la piel contiene vasos, nervios y abundante tejido conjuntivo?', 'La dermis.'),
    ('MORFOFUNCION', 'sistema tegumentario', 'Cuando sudas para perder calor, ¿qué anexo cutáneo está trabajando?', 'Las glándulas sudoríparas.'),
    ('MORFOFUNCION', 'sistema tegumentario', '¿Qué células producen el pigmento que contribuye al color de la piel?', 'Los melanocitos producen melanina.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 234-260 | MORFOFUNCION / tejido oseo
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'tejido oseo', 'En un hueso en crecimiento, ¿qué célula deposita nueva matriz ósea?', 'El osteoblasto.'),
    ('MORFOFUNCION', 'tejido oseo', '¿Qué célula retira matriz durante la remodelación del hueso?', 'El osteoclasto.'),
    ('MORFOFUNCION', 'tejido oseo', '¿Cómo se llama la célula ósea madura alojada en una laguna de la matriz?', 'Osteocito.'),
    ('MORFOFUNCION', 'tejido oseo', '¿Por qué el esqueleto también participa en la regulación de minerales?', 'Porque el hueso almacena y libera minerales, especialmente calcio y fosfato.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 261-305 | MORFOFUNCION / el sistema oseo
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'el sistema oseo', '¿Qué estructuras pertenecen al esqueleto axial?', 'Cráneo, columna vertebral y caja torácica.'),
    ('MORFOFUNCION', 'el sistema oseo', '¿Qué incluye el esqueleto apendicular?', 'Las cinturas escapular y pélvica y los huesos de las extremidades.'),
    ('MORFOFUNCION', 'el sistema oseo', '¿Qué protege principalmente el cráneo?', 'El encéfalo, además de sostener estructuras de la cara.'),
    ('MORFOFUNCION', 'el sistema oseo', 'Si observas el cuerpo alargado de un hueso largo, ¿cómo se llama esa región?', 'Diáfisis.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 306-339 | MORFOFUNCION / articulaciones
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'articulaciones', 'Una articulación permite mucho movimiento y contiene una cavidad con líquido. ¿De qué tipo es?', 'Sinovial.'),
    ('MORFOFUNCION', 'articulaciones', '¿Qué estructura une un hueso con otro y ayuda a estabilizar la articulación?', 'Un ligamento.'),
    ('MORFOFUNCION', 'articulaciones', '¿Para qué sirve el cartílago articular en una articulación sinovial?', 'Reduce la fricción y ayuda a repartir las cargas entre las superficies óseas.'),
    ('MORFOFUNCION', 'articulaciones', '¿Qué diferencia básica hay entre una sutura craneal y una rodilla?', 'La sutura es una articulación fibrosa con muy poco movimiento; la rodilla es sinovial y móvil.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 340-428 | MORFOFUNCION / el sistema muscular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'el sistema muscular', 'Cuando flexionas el codo, ¿cómo se llama el músculo que produce principalmente ese movimiento?', 'Agonista o motor principal.'),
    ('MORFOFUNCION', 'el sistema muscular', '¿Qué hace un músculo antagonista durante un movimiento?', 'Se opone o controla la acción del agonista y permite el movimiento contrario.'),
    ('MORFOFUNCION', 'el sistema muscular', '¿Cómo se llama un conjunto de fibras musculares agrupadas dentro de un músculo?', 'Fascículo.'),
    ('MORFOFUNCION', 'el sistema muscular', '¿Qué extremo de un músculo suele moverse más durante una contracción: origen o inserción?', 'La inserción suele ser el extremo más móvil.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 429-466 | MORFOFUNCION / tejido muscular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'tejido muscular', '¿Cuál es la unidad contráctil que se acorta dentro de una miofibrilla?', 'El sarcómero.'),
    ('MORFOFUNCION', 'tejido muscular', '¿Qué ion permite que actina y miosina inicien la contracción del músculo estriado?', 'El calcio; al unirse a troponina deja disponibles los sitios de unión de actina.'),
    ('MORFOFUNCION', 'tejido muscular', '¿Para qué necesita ATP el ciclo de puentes entre actina y miosina?', 'Entre otras funciones, para separar la cabeza de miosina de la actina y preparar un nuevo ciclo.'),
    ('MORFOFUNCION', 'tejido muscular', '¿Qué tipo de músculo forma la pared del intestino y se contrae de modo involuntario?', 'Músculo liso.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 467-505 | MORFOFUNCION / tejido nervioso
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'tejido nervioso', '¿Qué parte de una neurona suele recibir señales de otras células?', 'Las dendritas.'),
    ('MORFOFUNCION', 'tejido nervioso', '¿Por qué la mielina acelera la conducción en muchos axones?', 'Porque el impulso se regenera principalmente en los nodos de Ranvier y salta entre ellos.'),
    ('MORFOFUNCION', 'tejido nervioso', '¿Cómo se llama la unión funcional donde una neurona transmite información a otra célula?', 'Sinapsis.'),
    ('MORFOFUNCION', 'tejido nervioso', '¿Qué ocurre al inicio de un potencial de acción típico cuando se abren canales de sodio dependientes de voltaje?', 'Entra Na+ y la membrana se despolariza rápidamente.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 506-538 | MORFOFUNCION / medula espinal y reflejos
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'medula espinal y reflejos', '¿Por qué raíz entra la información sensitiva a la médula espinal?', 'Por la raíz dorsal o posterior.'),
    ('MORFOFUNCION', 'medula espinal y reflejos', '¿Por qué raíz salen las fibras motoras de un nervio raquídeo?', 'Por la raíz ventral o anterior.'),
    ('MORFOFUNCION', 'medula espinal y reflejos', 'Tocas algo muy caliente y retiras la mano antes de pensarlo. ¿Qué circuito lo explica?', 'Un arco reflejo medular, que integra una respuesta rápida sin esperar una decisión consciente.'),
    ('MORFOFUNCION', 'medula espinal y reflejos', 'En un corte medular, ¿dónde se sitúa la sustancia gris respecto de la blanca?', 'La gris ocupa la zona central; la blanca la rodea.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 539-588 | MORFOFUNCION / encefalo y pares craneales
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'encefalo y pares craneales', '¿Qué parte del encéfalo afina la coordinación y el equilibrio de los movimientos?', 'El cerebelo.'),
    ('MORFOFUNCION', 'encefalo y pares craneales', '¿Qué estructura del tronco encefálico contiene centros vitales relacionados con respiración y circulación?', 'El bulbo raquídeo.'),
    ('MORFOFUNCION', 'encefalo y pares craneales', '¿Qué papel cumple el tálamo para muchas señales sensitivas?', 'Actúa como estación de relevo antes de que lleguen a la corteza cerebral.'),
    ('MORFOFUNCION', 'encefalo y pares craneales', '¿Qué líquido circula por los ventrículos y alrededor del encéfalo y la médula?', 'El líquido cefalorraquídeo.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 589-609 | MORFOFUNCION / sistema nervioso autonomo
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'sistema nervioso autonomo', 'En una situación de alerta, ¿qué división autónoma suele elevar la frecuencia cardiaca?', 'La simpática.'),
    ('MORFOFUNCION', 'sistema nervioso autonomo', 'Después de comer, ¿qué división favorece la digestión y el reposo?', 'La parasimpática.'),
    ('MORFOFUNCION', 'sistema nervioso autonomo', '¿Cuántas neuronas motoras suelen intervenir entre el sistema nervioso central y un órgano visceral?', 'Dos: una preganglionar y otra posganglionar, conectadas en un ganglio.'),
    ('MORFOFUNCION', 'sistema nervioso autonomo', '¿Qué es un reflejo visceral?', 'Una respuesta automática de un órgano interno ante un estímulo, coordinada por circuitos del sistema nervioso autónomo.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 610-660 | MORFOFUNCION / organos de los sentidos
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'organos de los sentidos', 'Si un receptor responde a presión sobre la piel, ¿qué tipo de estímulo detecta?', 'Un estímulo mecánico; es un mecanorreceptor.'),
    ('MORFOFUNCION', 'organos de los sentidos', '¿Qué receptores advierten daño real o posible y participan en la percepción del dolor?', 'Los nociceptores.'),
    ('MORFOFUNCION', 'organos de los sentidos', '¿Por qué gusto y olfato se consideran sentidos químicos?', 'Porque sus receptores responden a moléculas químicas.'),
    ('MORFOFUNCION', 'organos de los sentidos', '¿Qué estructura del oído interno detecta el movimiento de la cabeza para el equilibrio?', 'El aparato vestibular, que incluye conductos semicirculares y órganos otolíticos.'),
    ('MORFOFUNCION', 'organos de los sentidos', '¿Qué células de la retina permiten ver mejor con poca luz?', 'Los bastones.'),
    ('MORFOFUNCION', 'organos de los sentidos', '¿Qué células de la retina aportan visión de color y gran detalle?', 'Los conos.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 661-705 | MORFOFUNCION / sistema endocrino
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'sistema endocrino', '¿Cómo llegan las hormonas de una glándula endocrina a órganos lejanos?', 'Se liberan a la sangre y viajan hasta células con receptores adecuados.'),
    ('MORFOFUNCION', 'sistema endocrino', '¿Qué diferencia a una glándula exocrina de una endocrina?', 'La exocrina vierte su producto por conductos; la endocrina libera hormonas al líquido intersticial y la sangre.'),
    ('MORFOFUNCION', 'sistema endocrino', 'Tras una comida sube la glucosa. ¿Qué hormona pancreática favorece su descenso?', 'La insulina.'),
    ('MORFOFUNCION', 'sistema endocrino', 'Si baja la glucosa entre comidas, ¿qué hormona pancreática ayuda a elevarla?', 'El glucagón.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 706-741 | MORFOFUNCION / sangre
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'sangre', '¿Qué componente líquido de la sangre transporta solutos y proteínas?', 'El plasma.'),
    ('MORFOFUNCION', 'sangre', '¿Qué llevan principalmente los eritrocitos gracias a la hemoglobina?', 'Oxígeno desde los pulmones hacia los tejidos.'),
    ('MORFOFUNCION', 'sangre', '¿Qué células sanguíneas participan de manera importante en la defensa del organismo?', 'Los leucocitos o glóbulos blancos.'),
    ('MORFOFUNCION', 'sangre', '¿Qué fragmentos celulares ayudan a formar el tapón inicial cuando se lesiona un vaso?', 'Las plaquetas.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 742-776 | MORFOFUNCION / corazon
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'corazon', '¿A dónde envía sangre el circuito pulmonar desde el lado derecho del corazón?', 'A los pulmones para el intercambio de gases.'),
    ('MORFOFUNCION', 'corazon', '¿Qué evita que la sangre retroceda dentro del corazón cuando cambia la presión?', 'Las válvulas cardíacas.'),
    ('MORFOFUNCION', 'corazon', '¿Qué estructura inicia normalmente cada latido como marcapasos del corazón?', 'El nodo sinoauricular.'),
    ('MORFOFUNCION', 'corazon', '¿Qué cavidad impulsa sangre hacia la circulación sistémica?', 'El ventrículo izquierdo.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 777-835 | MORFOFUNCION / vasos sanguineos y circulacion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'vasos sanguineos y circulacion', '¿Qué diferencia básica hay entre arterias y venas según la dirección del flujo?', 'Las arterias llevan sangre desde el corazón; las venas la devuelven al corazón.'),
    ('MORFOFUNCION', 'vasos sanguineos y circulacion', '¿En qué vasos ocurre la mayor parte del intercambio con los tejidos?', 'En los capilares, por sus paredes muy delgadas.'),
    ('MORFOFUNCION', 'vasos sanguineos y circulacion', '¿Por qué muchas venas de las extremidades tienen válvulas?', 'Para dificultar el retroceso de la sangre mientras retorna al corazón.'),
    ('MORFOFUNCION', 'vasos sanguineos y circulacion', 'Si una arteriola se estrecha, ¿qué ocurre con la resistencia al paso de la sangre?', 'Aumenta la resistencia vascular.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 836-881 | MORFOFUNCION / sistema linfatico e inmunidad
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'sistema linfatico e inmunidad', '¿Qué pasa con el líquido intersticial que recogen los vasos linfáticos?', 'Se convierte en linfa y acaba regresando a la circulación sanguínea.'),
    ('MORFOFUNCION', 'sistema linfatico e inmunidad', '¿Qué función tienen los ganglios linfáticos en el trayecto de la linfa?', 'La filtran y facilitan el encuentro de células inmunitarias con antígenos.'),
    ('MORFOFUNCION', 'sistema linfatico e inmunidad', '¿Qué tipo de defensa actúa rápido y sin reconocer un antígeno concreto?', 'La defensa innata o inespecífica.'),
    ('MORFOFUNCION', 'sistema linfatico e inmunidad', '¿Qué órgano filtra sangre y participa en respuestas inmunitarias frente a antígenos sanguíneos?', 'El bazo.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 882-922 | MORFOFUNCION / aparato respiratorio
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'aparato respiratorio', 'Al inspirar tranquilamente, ¿qué músculo aumenta el volumen del tórax al contraerse?', 'El diafragma.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Dónde difunden oxígeno y dióxido de carbono entre el aire y la sangre?', 'En la membrana respiratoria de los alvéolos y sus capilares.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué tubo conduce aire desde la laringe hacia los bronquios?', 'La tráquea.'),
    ('MORFOFUNCION', 'aparato respiratorio', '¿Qué recubre los pulmones y ayuda a que se deslicen contra la pared torácica?', 'La pleura, con sus hojas visceral y parietal y una fina película de líquido entre ellas.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 923-957 | MORFOFUNCION / aparato urinario
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'aparato urinario', '¿Cómo se llama la unidad funcional del riñón que filtra y modifica el líquido tubular?', 'Nefrona.'),
    ('MORFOFUNCION', 'aparato urinario', '¿Qué ocurre primero con el plasma cuando atraviesa el glomérulo renal?', 'Se filtra parte de su agua y solutos hacia la cápsula glomerular.'),
    ('MORFOFUNCION', 'aparato urinario', '¿Qué significa reabsorción tubular?', 'Que una sustancia pasa del filtrado de la nefrona de vuelta a la sangre.'),
    ('MORFOFUNCION', 'aparato urinario', 'Si el cuerpo necesita conservar agua, ¿qué hormona aumenta su reabsorción en el riñón?', 'La vasopresina u hormona antidiurética, ADH.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 958-980 | MORFOFUNCION / equilibrio hidrico y acidobasico
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'equilibrio hidrico y acidobasico', '¿Dónde está la mayor parte del agua corporal: dentro o fuera de las células?', 'Dentro de las células, en el compartimiento intracelular.'),
    ('MORFOFUNCION', 'equilibrio hidrico y acidobasico', '¿Qué ion predomina en el líquido extracelular: sodio o potasio?', 'El sodio; el potasio predomina dentro de las células.'),
    ('MORFOFUNCION', 'equilibrio hidrico y acidobasico', '¿Qué sistema amortiguador sanguíneo usa ácido carbónico y bicarbonato?', 'El sistema bicarbonato, importante para mantener el pH.'),
    ('MORFOFUNCION', 'equilibrio hidrico y acidobasico', 'Si cambia la concentración de CO2, ¿qué órgano ajusta con rapidez su eliminación?', 'Los pulmones, al modificar la ventilación.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 981-1027 | MORFOFUNCION / aparato digestivo
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'aparato digestivo', '¿Cómo se llama la onda muscular que impulsa el alimento por el tubo digestivo?', 'Peristaltismo.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué órgano produce bilis, útil para la digestión de grasas?', 'El hígado; la vesícula biliar la almacena y concentra.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿En qué segmento del tubo digestivo ocurre la mayor parte de la absorción de nutrientes?', 'En el intestino delgado.'),
    ('MORFOFUNCION', 'aparato digestivo', '¿Qué secreción del estómago ayuda a activar la pepsina y dificulta la supervivencia de microorganismos?', 'El ácido clorhídrico.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 1028-1061 | MORFOFUNCION / nutricion y metabolismo
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'nutricion y metabolismo', '¿Qué molécula usa la célula como fuente inmediata de energía para muchos trabajos?', 'El ATP.'),
    ('MORFOFUNCION', 'nutricion y metabolismo', '¿Qué nutriente aporta aminoácidos para fabricar proteínas corporales?', 'Las proteínas de la dieta.'),
    ('MORFOFUNCION', 'nutricion y metabolismo', '¿Qué ocurre en la glucólisis antes de entrar al ciclo de Krebs?', 'La glucosa se transforma en piruvato y se obtiene una pequeña cantidad de ATP.'),
    ('MORFOFUNCION', 'nutricion y metabolismo', '¿Qué significa estar en equilibrio energético?', 'Que la energía ingerida se aproxima a la energía gastada durante un período.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 1062-1091 | MORFOFUNCION / aparato reproductor masculino
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'aparato reproductor masculino', '¿Dónde se forman los espermatozoides?', 'En los túbulos seminíferos de los testículos.'),
    ('MORFOFUNCION', 'aparato reproductor masculino', '¿En qué conducto maduran y se almacenan temporalmente los espermatozoides?', 'En el epidídimo.'),
    ('MORFOFUNCION', 'aparato reproductor masculino', '¿Qué células testiculares producen principalmente testosterona?', 'Las células intersticiales o de Leydig.'),
    ('MORFOFUNCION', 'aparato reproductor masculino', '¿Por qué la meiosis es importante para producir gametos?', 'Reduce a la mitad la dotación cromosómica antes de la fecundación.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 1092-1129 | MORFOFUNCION / aparato reproductor femenino
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'aparato reproductor femenino', '¿Qué estructura del ovario contiene al ovocito en desarrollo?', 'El folículo ovárico.'),
    ('MORFOFUNCION', 'aparato reproductor femenino', '¿Qué hormona desencadena la ovulación cuando presenta un aumento brusco?', 'La hormona luteinizante, LH.'),
    ('MORFOFUNCION', 'aparato reproductor femenino', '¿Qué tejido del útero cambia a lo largo del ciclo menstrual y se desprende en la menstruación?', 'El endometrio.'),
    ('MORFOFUNCION', 'aparato reproductor femenino', '¿Qué hormona del cuerpo lúteo ayuda a mantener preparado el endometrio tras la ovulación?', 'La progesterona.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- morfo: páginas PDF 1130-1164 | MORFOFUNCION / desarrollo humano y envejecimiento
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('MORFOFUNCION', 'desarrollo humano y envejecimiento', '¿Qué se forma al unirse un espermatozoide y un ovocito?', 'Un cigoto, la primera célula del nuevo organismo.'),
    ('MORFOFUNCION', 'desarrollo humano y envejecimiento', '¿Cómo se llama la fijación inicial del blastocisto al endometrio?', 'Implantación.'),
    ('MORFOFUNCION', 'desarrollo humano y envejecimiento', '¿Qué órgano permite el intercambio de nutrientes, gases y desechos entre madre y feto?', 'La placenta.'),
    ('MORFOFUNCION', 'desarrollo humano y envejecimiento', '¿Cuáles son las tres capas germinales que originan los tejidos del embrión?', 'Ectodermo, mesodermo y endodermo.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 33-53 | BIOLOGIA CELULAR / introduccion a la biologia celular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 'Si una célula tiene el ADN dentro de un núcleo delimitado, ¿es procariota o eucariota?', 'Eucariota. La envoltura nuclear separa su ADN del citoplasma.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Qué rasgo te ayuda a reconocer una célula procariota frente a una eucariota?', 'La procariota no tiene un núcleo delimitado por membrana; su material genético ocupa una región llamada nucleoide.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', 'Un virus está fuera de una célula hospedadora. ¿Puede reproducirse por sí solo?', 'No. Necesita la maquinaria de una célula para producir nuevos virus.'),
    ('BIOLOGIA CELULAR', 'introduccion a la biologia celular', '¿Por qué un prion no se clasifica como una célula?', 'Es una proteína infecciosa mal plegada, sin organización celular ni ácido nucleico propio.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 54-119 | BIOLOGIA CELULAR / metodos y tecnicas basicas en biologia celular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'metodos y tecnicas basicas en biologia celular', 'Quieres ver la organización interna muy fina de una célula. ¿Qué microscopía elegirías?', 'La microscopía electrónica, porque permite distinguir detalles más pequeños que la microscopía óptica.'),
    ('BIOLOGIA CELULAR', 'metodos y tecnicas basicas en biologia celular', 'En una muestra hay poquísimo ADN de interés. ¿Qué técnica permite multiplicar esa secuencia?', 'La reacción en cadena de la polimerasa, o PCR, amplifica una secuencia específica de ADN.'),
    ('BIOLOGIA CELULAR', 'metodos y tecnicas basicas en biologia celular', '¿Para qué sirve marcar una proteína con un anticuerpo en una muestra de tejido?', 'Para localizarla en las células o en el tejido mediante una técnica inmunológica, como la inmunohistoquímica.'),
    ('BIOLOGIA CELULAR', 'metodos y tecnicas basicas en biologia celular', 'Si separas los componentes de una célula según su tamaño y densidad, ¿qué técnica estás usando?', 'El fraccionamiento celular mediante centrifugación diferencial.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 120-166 | BIOLOGIA CELULAR / estructura de la membrana plasmatica
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'estructura de la membrana plasmatica', '¿Por qué los fosfolípidos forman una bicapa cuando están en agua?', 'Sus cabezas hidrófilas miran al agua y sus colas hidrófobas quedan orientadas hacia el interior de la bicapa.'),
    ('BIOLOGIA CELULAR', 'estructura de la membrana plasmatica', '¿Qué quiere decir que la membrana sigue el modelo de mosaico fluido?', 'Que los lípidos y muchas proteínas se distribuyen en una bicapa dinámica, con movilidad lateral.'),
    ('BIOLOGIA CELULAR', 'estructura de la membrana plasmatica', '¿Dónde encuentras el glucocáliz: mirando al citoplasma o al exterior de la célula?', 'En la cara externa de la membrana; está formado por cadenas de glúcidos unidas a lípidos y proteínas.'),
    ('BIOLOGIA CELULAR', 'estructura de la membrana plasmatica', '¿Qué molécula ayuda a modular la fluidez de la membrana de células animales?', 'El colesterol, intercalado entre los fosfolípidos.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 167-213 | BIOLOGIA CELULAR / transporte a traves de la membrana plasmatica
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'transporte a traves de la membrana plasmatica', 'Una molécula cruza la membrana a favor de su gradiente y sin gastar ATP. ¿Qué tipo de transporte es?', 'Transporte pasivo; puede ocurrir por difusión simple o con ayuda de un canal o transportador.'),
    ('BIOLOGIA CELULAR', 'transporte a traves de la membrana plasmatica', '¿Qué hace la bomba sodio-potasio con cada ciclo de ATP?', 'Expulsa tres iones Na+ e introduce dos iones K+; mantiene gradientes importantes para la excitabilidad celular.'),
    ('BIOLOGIA CELULAR', 'transporte a traves de la membrana plasmatica', 'El oxígeno atraviesa la bicapa sin un transportador. ¿Cómo se llama ese paso?', 'Difusión simple a través de la membrana.'),
    ('BIOLOGIA CELULAR', 'transporte a traves de la membrana plasmatica', '¿Qué diferencia al transporte activo del pasivo?', 'El activo mueve sustancias contra su gradiente y requiere energía directa o indirectamente; el pasivo sigue el gradiente.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 214-255 | BIOLOGIA CELULAR / macrotransporte a traves de la membrana plasmatica
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'macrotransporte a traves de la membrana plasmatica', 'La célula rodea una partícula grande y la introduce. ¿Qué proceso observas?', 'Fagocitosis, una forma de endocitosis para incorporar partículas grandes.'),
    ('BIOLOGIA CELULAR', 'macrotransporte a traves de la membrana plasmatica', '¿Qué ocurre con la membrana cuando una vesícula libera su contenido al exterior?', 'La vesícula se fusiona con la membrana plasmática y descarga su contenido por exocitosis.'),
    ('BIOLOGIA CELULAR', 'macrotransporte a traves de la membrana plasmatica', '¿Por qué la endocitosis mediada por receptor es selectiva?', 'Porque la carga se une primero a receptores específicos de la superficie celular.'),
    ('BIOLOGIA CELULAR', 'macrotransporte a traves de la membrana plasmatica', 'En una sinapsis, ¿por qué proceso sale el neurotransmisor de la terminal presináptica?', 'Por exocitosis de vesículas sinápticas tras fusionarse con la membrana.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 256-290 | BIOLOGIA CELULAR / especializaciones de la membrana plasmatica
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'especializaciones de la membrana plasmatica', 'Una célula intestinal necesita absorber más. ¿Qué estructura aumenta su superficie apical?', 'Las microvellosidades aumentan la superficie disponible para la absorción.'),
    ('BIOLOGIA CELULAR', 'especializaciones de la membrana plasmatica', '¿Qué unión evita que el material pase libremente entre dos células epiteliales vecinas?', 'La unión estrecha, que sella el espacio entre ellas.'),
    ('BIOLOGIA CELULAR', 'especializaciones de la membrana plasmatica', '¿Qué unión aporta resistencia mecánica cuando un tejido sufre tirones?', 'El desmosoma, que conecta el citoesqueleto de células vecinas.'),
    ('BIOLOGIA CELULAR', 'especializaciones de la membrana plasmatica', '¿Qué puede pasarle a una célula que necesita anclaje si pierde contacto con la matriz extracelular?', 'Puede activar anoikis, una forma de apoptosis provocada por la falta de adhesión.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 291-349 | BIOLOGIA CELULAR / nucleo y cromatina
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Por dónde intercambia el núcleo moléculas con el citoplasma?', 'A través de los complejos de poro de la envoltura nuclear.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', '¿Qué proteínas sirven de soporte para empaquetar el ADN en nucleosomas?', 'Las histonas; el ADN se enrolla alrededor de ellas.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Si una región de cromatina está poco compactada y suele transcribirse, ¿cómo se llama?', 'Eucromatina.'),
    ('BIOLOGIA CELULAR', 'nucleo y cromatina', 'Antes de dividirse, ¿qué debe hacer la célula con su ADN?', 'Replicarlo para que cada célula hija reciba una copia de la información genética.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 350-384 | BIOLOGIA CELULAR / transcripcion y maduracion del arn
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'transcripcion y maduracion del arn', '¿Qué se fabrica cuando se transcribe un gen?', 'Una molécula de ARN a partir de la información contenida en el ADN.'),
    ('BIOLOGIA CELULAR', 'transcripcion y maduracion del arn', '¿Qué se retira del pre-ARN mensajero durante el corte y empalme?', 'Los intrones; los exones se unen para formar el ARN mensajero maduro.'),
    ('BIOLOGIA CELULAR', 'transcripcion y maduracion del arn', '¿Qué función cumple el nucléolo en la célula?', 'Participa en la producción de ARN ribosómico y en el ensamblaje inicial de subunidades ribosómicas.'),
    ('BIOLOGIA CELULAR', 'transcripcion y maduracion del arn', '¿Por qué el ARN mensajero debe madurar antes de salir del núcleo?', 'Porque necesita procesarse, entre otros pasos con corte y empalme, para poder dirigir correctamente la síntesis de proteínas.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 385-419 | BIOLOGIA CELULAR / sintesis y modificacion de proteinas
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'sintesis y modificacion de proteinas', '¿Qué lee el ribosoma para ordenar los aminoácidos de una proteína?', 'Los codones del ARN mensajero.'),
    ('BIOLOGIA CELULAR', 'sintesis y modificacion de proteinas', '¿Qué molécula lleva cada aminoácido hasta el ribosoma?', 'El ARN de transferencia, cuyo anticodón reconoce el codón del ARN mensajero.'),
    ('BIOLOGIA CELULAR', 'sintesis y modificacion de proteinas', 'Una proteína ya se tradujo, pero aún no funciona bien. ¿Qué proceso puede faltarle?', 'Plegamiento o modificaciones postraduccionales que le den su estructura y actividad finales.'),
    ('BIOLOGIA CELULAR', 'sintesis y modificacion de proteinas', '¿Dónde se sintetizan las proteínas destinadas a secreción o membranas?', 'En ribosomas asociados al retículo endoplasmático rugoso.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 420-455 | BIOLOGIA CELULAR / reticulo endoplasmatico golgi y lisosomas
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'reticulo endoplasmatico golgi y lisosomas', 'Si una célula fabrica muchas proteínas para secretarlas, ¿qué organelo suele tener muy desarrollado?', 'El retículo endoplasmático rugoso, con ribosomas unidos a su superficie.'),
    ('BIOLOGIA CELULAR', 'reticulo endoplasmatico golgi y lisosomas', '¿Qué fabrica principalmente el retículo endoplasmático liso?', 'Lípidos, que también sirven para formar membranas celulares.'),
    ('BIOLOGIA CELULAR', 'reticulo endoplasmatico golgi y lisosomas', '¿Qué hace el aparato de Golgi con muchas proteínas que recibe del retículo?', 'Las modifica, clasifica y dirige hacia su destino.'),
    ('BIOLOGIA CELULAR', 'reticulo endoplasmatico golgi y lisosomas', '¿Para qué sirven los lisosomas?', 'Para degradar y reciclar material mediante enzimas digestivas.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 456-490 | BIOLOGIA CELULAR / mitocondrias y peroxisomas
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'mitocondrias y peroxisomas', '¿En qué organelo se produce gran parte del ATP mediante metabolismo oxidativo?', 'En las mitocondrias.'),
    ('BIOLOGIA CELULAR', 'mitocondrias y peroxisomas', '¿Cómo se llaman los pliegues de la membrana interna mitocondrial?', 'Crestas mitocondriales; amplían la superficie de esa membrana.'),
    ('BIOLOGIA CELULAR', 'mitocondrias y peroxisomas', '¿Qué particularidad genética tienen las mitocondrias?', 'Poseen ADN propio, aunque muchas de sus proteínas se codifican en el núcleo.'),
    ('BIOLOGIA CELULAR', 'mitocondrias y peroxisomas', '¿Qué organelo participa en reacciones oxidativas y en la degradación del peróxido de hidrógeno?', 'El peroxisoma, que contiene enzimas como la catalasa.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 491-535 | BIOLOGIA CELULAR / citoesqueleto
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'citoesqueleto', '¿Cuáles son las tres grandes piezas del citoesqueleto?', 'Microtúbulos, microfilamentos de actina y filamentos intermedios.'),
    ('BIOLOGIA CELULAR', 'citoesqueleto', 'Una vesícula se desplaza por una vía de tubulina. ¿Qué estructura le sirve de riel?', 'Un microtúbulo.'),
    ('BIOLOGIA CELULAR', 'citoesqueleto', '¿Qué proteína forma los microfilamentos implicados en movimiento y forma celular?', 'La actina.'),
    ('BIOLOGIA CELULAR', 'citoesqueleto', '¿Qué componente del citoesqueleto destaca por dar resistencia mecánica a la célula?', 'Los filamentos intermedios.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 536-579 | BIOLOGIA CELULAR / senalizacion celular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'senalizacion celular', 'Una célula libera una señal que actúa sobre sus vecinas. ¿Cómo se llama esa comunicación?', 'Señalización paracrina.'),
    ('BIOLOGIA CELULAR', 'senalizacion celular', 'Una hormona viaja por la sangre hasta un tejido distante. ¿Qué tipo de señalización es?', 'Señalización endocrina.'),
    ('BIOLOGIA CELULAR', 'senalizacion celular', '¿Por qué una célula responde a una señal y otra quizá no?', 'Porque la respuesta depende, entre otras cosas, de que tenga el receptor adecuado para reconocer esa señal.'),
    ('BIOLOGIA CELULAR', 'senalizacion celular', '¿Qué hace un segundo mensajero dentro de la célula?', 'Transmite y puede amplificar la señal iniciada cuando un mensajero externo se une a su receptor.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 580-617 | BIOLOGIA CELULAR / ciclo celular
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿En qué fase del ciclo celular se duplica el ADN?', 'En la fase S de la interfase.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Qué sucede en G1 antes de que la célula copie su ADN?', 'La célula crece y se prepara para entrar en la fase S.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', '¿Para qué sirven los puntos de control del ciclo celular?', 'Para comprobar que las condiciones y el ADN sean adecuados antes de avanzar a la siguiente fase.'),
    ('BIOLOGIA CELULAR', 'ciclo celular', 'Una célula deja temporalmente de dividirse. ¿En qué estado puede permanecer?', 'En G0, un estado de reposo o quiescencia fuera del ciclo de división activo.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 618-649 | BIOLOGIA CELULAR / division celular y muerte programada
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'division celular y muerte programada', '¿Qué resultado esperas de una mitosis de una célula somática?', 'Dos células hijas con la misma dotación cromosómica que la célula de partida.'),
    ('BIOLOGIA CELULAR', 'division celular y muerte programada', '¿Para qué sirve la meiosis en la formación de gametos?', 'Reduce la dotación cromosómica y genera células haploides.'),
    ('BIOLOGIA CELULAR', 'division celular y muerte programada', 'Si una célula se elimina de forma ordenada y controlada, ¿qué proceso ocurre?', 'Apoptosis, una forma de muerte celular programada.'),
    ('BIOLOGIA CELULAR', 'division celular y muerte programada', '¿Qué distingue en general a la necrosis de la apoptosis?', 'La necrosis suele seguir a un daño externo con ruptura celular; la apoptosis es un programa celular regulado.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 650-696 | BIOLOGIA CELULAR / biologia celular del cancer
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué pasa cuando una célula tumoral deja de obedecer las señales que frenan la división?', 'Puede proliferar de manera descontrolada, una característica central del cáncer.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué es la angiogénesis en el crecimiento de un tumor?', 'La formación de nuevos vasos sanguíneos que aportan oxígeno y nutrientes al tumor.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Qué significa que un cáncer haya hecho metástasis?', 'Que células tumorales se han diseminado y han formado lesiones en otro sitio del organismo.'),
    ('BIOLOGIA CELULAR', 'biologia celular del cancer', '¿Cómo contribuye la pérdida de función de un gen supresor tumoral?', 'Elimina un freno normal del crecimiento o de la supervivencia celular.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 697-737 | BIOLOGIA CELULAR / respuesta inmunitaria
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'respuesta inmunitaria', '¿Cuál responde primero de forma general ante muchos microorganismos: la inmunidad innata o la adaptativa?', 'La inmunidad innata; actúa con rapidez y reconoce patrones generales.'),
    ('BIOLOGIA CELULAR', 'respuesta inmunitaria', '¿Qué ventaja aporta la memoria de la inmunidad adaptativa?', 'Permite una respuesta más eficaz cuando el organismo vuelve a encontrar el mismo antígeno.'),
    ('BIOLOGIA CELULAR', 'respuesta inmunitaria', '¿Qué célula puede producir anticuerpos después de activarse y diferenciarse?', 'El linfocito B, al convertirse en célula plasmática.'),
    ('BIOLOGIA CELULAR', 'respuesta inmunitaria', '¿Qué busca una vacuna al presentar antígenos sin causar la enfermedad?', 'Activar una respuesta protectora y memoria inmunitaria frente al agente real.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- biologia: páginas PDF 738-771 | BIOLOGIA CELULAR / celulas madre y aplicaciones terapeuticas
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('BIOLOGIA CELULAR', 'celulas madre y aplicaciones terapeuticas', '¿Qué dos capacidades definen a una célula madre?', 'Autorrenovarse durante mucho tiempo y diferenciarse hacia células especializadas.'),
    ('BIOLOGIA CELULAR', 'celulas madre y aplicaciones terapeuticas', '¿Qué puede formar una célula madre totipotente que una pluripotente no forma por sí sola?', 'Tejidos extraembrionarios, como los de la placenta.'),
    ('BIOLOGIA CELULAR', 'celulas madre y aplicaciones terapeuticas', '¿Qué pueden producir las células madre pluripotentes?', 'Tipos celulares derivados de las tres capas embrionarias, pero no tejido placentario por sí solas.'),
    ('BIOLOGIA CELULAR', 'celulas madre y aplicaciones terapeuticas', '¿Cómo suele ser el potencial de una célula madre multipotente adulta?', 'Más restringido: genera varios tipos celulares relacionados con el tejido o linaje al que pertenece.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 2-3 | SALUD PUBLICA / educacion en salud
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'educacion en salud', '¿Qué busca la educación en salud además de transmitir información?', 'Que las personas desarrollen habilidades y adopten prácticas saludables de manera sostenida.'),
    ('SALUD PUBLICA', 'educacion en salud', 'Si una comunidad aprende a decidir cómo cuidar su salud, ¿qué está ganando?', 'Capacidad de autogestión y mayor control sobre los factores que afectan su bienestar.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Por qué una charla aislada no basta para cambiar la salud de una población?', 'Porque los hábitos también dependen del entorno y de condiciones sociales; la educación debe acompañarse de acciones más amplias.'),
    ('SALUD PUBLICA', 'educacion en salud', '¿Con qué dos grandes tareas sanitarias se relaciona la educación en salud?', 'Con la promoción de la salud y la prevención de enfermedades.')
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
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Por qué decir que salud es solo ''no estar enfermo'' resulta incompleto?', 'Porque el bienestar también incluye dimensiones psicológicas, sociales y la capacidad de adaptarse al entorno.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', 'Dos barrios tienen distinta calidad de agua y vivienda. ¿Qué concepto ayuda a explicar sus diferencias de salud?', 'Los determinantes sociales y ambientales de la salud.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Qué factores personales no modificables aparecen entre los determinantes de salud?', 'Entre otros, edad, sexo y herencia genética.'),
    ('SALUD PUBLICA', 'concepto de salud y determinantes', '¿Qué significa buscar equidad en salud?', 'Actuar sobre diferencias evitables e injustas para que todas las personas tengan oportunidades de bienestar.')
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
    ('SALUD PUBLICA', 'funciones de salud publica', 'Una ciudad analiza datos para detectar un brote. ¿Qué función de salud pública está realizando?', 'Vigilancia y monitoreo de la salud.'),
    ('SALUD PUBLICA', 'funciones de salud publica', 'Controlar la calidad del agua potable, ¿a qué función de salud pública contribuye?', 'A la protección de la salud frente a riesgos ambientales.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Por qué la población debe participar al definir problemas sanitarios?', 'Porque la participación comunitaria ayuda a reconocer necesidades y a tomar decisiones pertinentes.'),
    ('SALUD PUBLICA', 'funciones de salud publica', '¿Qué diferencia a una intervención poblacional de atender solo a un paciente?', 'Busca proteger o mejorar la salud de grupos y comunidades mediante acciones organizadas.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 5-19 | SALUD PUBLICA / niveles de prevencion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'niveles de prevencion', 'Vacunar para evitar que aparezca una enfermedad, ¿qué nivel de prevención es?', 'Prevención primaria.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'Un tamizaje detecta una enfermedad cuando aún no da síntomas. ¿Qué nivel de prevención es?', 'Prevención secundaria: busca detección y tratamiento oportunos.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'La rehabilitación después de un infarto, ¿qué nivel de prevención representa?', 'Prevención terciaria, porque intenta reducir secuelas de una enfermedad establecida.'),
    ('SALUD PUBLICA', 'niveles de prevencion', 'Evitar pruebas o tratamientos innecesarios que puedan dañar al paciente, ¿qué prevención es?', 'Prevención cuaternaria.')
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
    ('SALUD PUBLICA', 'promocion de la salud', '¿En qué se centra la promoción de la salud cuando mira más allá de la enfermedad?', 'En crear condiciones y capacidades que favorezcan el bienestar de la población.'),
    ('SALUD PUBLICA', 'promocion de la salud', 'Si una escuela y el municipio crean espacios seguros para actividad física, ¿solo están dando información?', 'No. También están creando un entorno que facilita una conducta saludable.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Qué pide la Carta de Ottawa respecto a las políticas públicas?', 'Que se construyan políticas saludables y se consideren los efectos de las decisiones sobre la salud.'),
    ('SALUD PUBLICA', 'promocion de la salud', '¿Por qué la participación comunitaria importa en la promoción?', 'Porque la población identifica sus necesidades y ayuda a decidir y sostener las acciones.')
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
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Qué nivel de atención es normalmente el primer contacto de la persona con el sistema de salud?', 'La atención primaria de salud.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Un centro de salud coordina una derivación y recibe la información de regreso. ¿Qué atributo de la atención primaria muestra?', 'Coordinación entre profesionales y niveles de atención.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', '¿Qué significa longitudinalidad en atención primaria?', 'Acompañar a la persona o familia a lo largo del tiempo, no solo en una consulta aislada.'),
    ('SALUD PUBLICA', 'atencion primaria de salud', 'Si un servicio aborda promoción, prevención, tratamiento y rehabilitación, ¿qué atributo demuestra?', 'Integralidad de la atención.')
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
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Qué es un factor de riesgo?', 'Una característica o exposición que aumenta la probabilidad de una enfermedad o lesión, sin ser necesariamente una causa directa.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', 'Entre edad y tabaquismo, ¿cuál es un factor de riesgo modificable?', 'El tabaquismo, porque puede reducirse o eliminarse mediante intervenciones y cambios de conducta.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Qué aporta la salud comunitaria a una intervención sanitaria?', 'La participación activa de la comunidad en reconocer problemas y buscar soluciones.'),
    ('SALUD PUBLICA', 'factor de riesgo y salud comunitaria', '¿Por qué no basta con culpar al individuo por todos sus riesgos?', 'Porque también influyen condiciones sociales, económicas y ambientales que limitan sus opciones.')
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
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Cuántos Objetivos de Desarrollo Sostenible reúne la Agenda 2030 descrita en el texto?', 'Diecisiete objetivos.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Para qué sirven las metas e indicadores de los ODS?', 'Para fijar objetivos y seguir el progreso de forma medible.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Por qué la salud se relaciona con educación, ambiente y pobreza dentro de los ODS?', 'Porque el bienestar depende de condiciones sociales y ambientales, no solo de la atención médica.'),
    ('SALUD PUBLICA', 'ods y cobertura sanitaria', '¿Qué persigue la cobertura sanitaria universal?', 'Que las personas puedan recibir servicios de salud necesarios sin quedar excluidas por barreras de acceso.')
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
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué reconoce la Constitución boliviana sobre la salud según el material del curso?', 'La reconoce como un derecho fundamental y una responsabilidad del Estado.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué significan las siglas SAFCI?', 'Salud Familiar Comunitaria Intercultural.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Qué busca el enfoque intercultural del modelo SAFCI?', 'Articular la atención con la familia y la comunidad, respetando saberes y prácticas culturales.'),
    ('SALUD PUBLICA', 'salud en bolivia y modelo safci', '¿Por qué un programa de salud debe tener metas e indicadores?', 'Para evaluar si sus acciones mejoran la cobertura y los resultados sanitarios.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 32-39 | SALUD PUBLICA / epidemiologia social
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué observa la epidemiología social además de contar casos de enfermedad?', 'Las desigualdades, condiciones de vida y determinantes sociales que influyen en la salud de poblaciones.'),
    ('SALUD PUBLICA', 'epidemiologia social', 'Si un barrio concentra más enfermedad por falta de agua segura, ¿qué pregunta haría la epidemiología social?', 'Cómo las condiciones de vida y las decisiones colectivas contribuyen a esa diferencia.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Qué estudia la epidemiología de campo ante un brote?', 'La distribución de los casos y las posibles fuentes o vías de transmisión para orientar el control.'),
    ('SALUD PUBLICA', 'epidemiologia social', '¿Por qué conviene comparar poblaciones y no solo describir a un paciente?', 'Porque permite reconocer patrones y factores que afectan la salud colectiva.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 40-48 | SALUD PUBLICA / proceso de investigacion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'proceso de investigacion', 'Antes de recoger datos, ¿qué debes dejar claro en un proyecto de investigación?', 'Qué problema estudiarás, por qué importa y qué objetivos persigues.'),
    ('SALUD PUBLICA', 'proceso de investigacion', '¿Para qué sirve el diseño de un estudio?', 'Para organizar cómo se obtendrán y analizarán datos capaces de responder la pregunta de investigación.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'Si observas sin modificar las condiciones del fenómeno, ¿qué tipo general de estudio realizas?', 'Un estudio observacional.'),
    ('SALUD PUBLICA', 'proceso de investigacion', 'Si el investigador interviene y compara resultados, ¿qué tipo general de estudio es?', 'Un estudio experimental.')
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
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué gana una investigación al delimitar bien su problema?', 'Una pregunta más precisa, viable y susceptible de estudiarse con datos.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Cómo debería escribirse un objetivo de investigación para orientar el trabajo?', 'Con una acción clara y un resultado observable o medible.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Qué diferencia hay entre objetivo general y objetivos específicos?', 'El general expresa la meta principal; los específicos la descomponen en pasos concretos.'),
    ('SALUD PUBLICA', 'problema y objetivos de investigacion', '¿Por qué los objetivos deben corresponder al problema planteado?', 'Porque cada objetivo debe aportar evidencia para responder la pregunta central.')
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
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Para qué revisas literatura antes de formular una hipótesis?', 'Para conocer lo que ya se sabe y fundamentar la relación que vas a estudiar.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Qué es una hipótesis de investigación?', 'Una explicación o relación tentativa que puede contrastarse con observaciones.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', 'Si planteas que el tabaquismo influye en un resultado de salud, ¿cuál suele ser la variable independiente?', 'La exposición al tabaquismo; el resultado de salud sería la variable dependiente.'),
    ('SALUD PUBLICA', 'marco teorico e hipotesis', '¿Por qué una hipótesis debe usar conceptos claros?', 'Para poder definir variables y comprobarla con datos sin ambigüedad.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 72-76 | SALUD PUBLICA / variables y medicion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'variables y medicion', '¿Qué es una variable dentro de una investigación?', 'Una característica de las unidades de estudio que puede tomar distintos valores o categorías.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿La ocupación se registra como variable cualitativa o cuantitativa?', 'Cualitativa: clasifica a las personas en categorías.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿La talla medida en centímetros es cualitativa o cuantitativa?', 'Cuantitativa; expresa una magnitud numérica.'),
    ('SALUD PUBLICA', 'variables y medicion', '¿Por qué conviene definir cómo medirás cada variable antes de recoger datos?', 'Para que todos los registros se hagan con el mismo criterio y puedan compararse.')
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
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué hace la estadística descriptiva con un conjunto de datos?', 'Los organiza y resume con tablas, gráficos y medidas numéricas.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', 'Si quieres sacar conclusiones sobre una población usando una muestra, ¿qué rama de la estadística utilizas?', 'Estadística inferencial.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué es la población de un estudio?', 'El conjunto de unidades sobre las que se quiere conocer una característica.'),
    ('SALUD PUBLICA', 'estadistica descriptiva', '¿Qué es una muestra?', 'Una parte de la población seleccionada para observarla o medirla.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 95-108 | SALUD PUBLICA / muestreo
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'muestreo', 'Si todos los integrantes tienen una probabilidad conocida de ser elegidos, ¿qué tipo de muestreo usas?', 'Muestreo probabilístico.'),
    ('SALUD PUBLICA', 'muestreo', 'Divides la población en grupos y seleccionas personas de cada uno. ¿Qué muestreo es?', 'Muestreo estratificado.'),
    ('SALUD PUBLICA', 'muestreo', 'Eliges grupos completos, como aulas, y estudias a sus integrantes. ¿Qué muestreo es?', 'Muestreo por conglomerados.'),
    ('SALUD PUBLICA', 'muestreo', 'Si los seleccionados no representan bien a la población, ¿qué problema aparece?', 'Sesgo de selección o de cobertura, que puede distorsionar los resultados.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 109-139 | SALUD PUBLICA / frecuencias y graficos
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué expresa la frecuencia absoluta de una categoría?', 'Cuántas observaciones pertenecen a esa categoría.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué expresa la frecuencia relativa?', 'La proporción o porcentaje del total que corresponde a una categoría.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', 'Si quieres mostrar la distribución de una variable cuantitativa agrupada en intervalos, ¿qué gráfico usarías?', 'Un histograma.'),
    ('SALUD PUBLICA', 'frecuencias y graficos', '¿Qué muestra una frecuencia acumulada?', 'Cuántas observaciones, o qué proporción, se han reunido hasta cierto valor o intervalo.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 145-160 | SALUD PUBLICA / medidas de tendencia central
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'medidas de tendencia central', '¿Cómo calculas la media aritmética de varios valores?', 'Sumas los valores y divides entre el número de observaciones.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Ordenas las edades de menor a mayor. ¿Qué medida ocupa el centro de la lista?', 'La mediana.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'En una lista de respuestas, ¿cómo llamas al valor que aparece más veces?', 'Moda.'),
    ('SALUD PUBLICA', 'medidas de tendencia central', 'Si unos pocos valores son extremadamente altos, ¿qué medida central suele resistir mejor su efecto?', 'La mediana.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 161-170 | SALUD PUBLICA / medidas de posicion
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'medidas de posicion', '¿En cuántas partes dividen los cuartiles un conjunto de datos ordenados?', 'En cuatro partes.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Qué representa el percentil 75?', 'Un valor por debajo del cual se encuentra aproximadamente el 75 % de las observaciones.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿En cuántas partes dividen los deciles los datos ordenados?', 'En diez partes.'),
    ('SALUD PUBLICA', 'medidas de posicion', '¿Por qué primero debes ordenar los datos antes de ubicar un cuartil?', 'Porque las medidas de posición dependen del lugar que ocupa cada valor en la distribución.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 171-190 | SALUD PUBLICA / dispersion y forma de los datos
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'dispersion y forma de los datos', 'Dos grupos tienen la misma media, pero uno varía mucho más. ¿Qué clase de medida necesitas para distinguirlos?', 'Una medida de dispersión, como la desviación estándar.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué es el rango de un conjunto de datos?', 'La diferencia entre el valor máximo y el mínimo.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', '¿Qué mide la desviación estándar?', 'Cuánto se alejan típicamente los valores de la media.'),
    ('SALUD PUBLICA', 'dispersion y forma de los datos', 'Si una distribución tiene una cola más larga hacia un lado, ¿qué propiedad describes?', 'Su asimetría o sesgo.')
)
INSERT INTO public.flashcards (materia, tema, pregunta, respuesta)
SELECT i.materia, i.tema, i.pregunta, i.respuesta FROM incoming AS i
WHERE NOT EXISTS (
  SELECT 1 FROM public.flashcards AS f
  WHERE lower(btrim(f.materia)) = lower(btrim(i.materia))
    AND lower(btrim(f.tema)) = lower(btrim(i.tema))
    AND lower(btrim(f.pregunta)) = lower(btrim(i.pregunta))
);

-- salud: páginas PDF 191-226 | SALUD PUBLICA / analisis de datos en excel y spss
WITH incoming (materia, tema, pregunta, respuesta) AS (
  VALUES
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'Antes de pedir resultados estadísticos a un programa, ¿qué debes revisar en tu tabla de datos?', 'Que cada variable esté definida y los registros sean consistentes, sin valores mal codificados.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Para qué puede servir la herramienta de estadística descriptiva de Excel?', 'Para resumir datos con medidas como media, mediana y dispersión.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', 'En SPSS, ¿por qué conviene asignar etiquetas a las categorías de una variable?', 'Para interpretar las salidas sin depender de códigos numéricos poco claros.'),
    ('SALUD PUBLICA', 'analisis de datos en excel y spss', '¿Qué debes hacer después de obtener una tabla o un gráfico de cualquier programa?', 'Interpretarlo en relación con la pregunta de investigación; el programa calcula, pero no explica por sí solo el problema.')
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

-- 274 tarjetas, 68 temas, 3 materias.