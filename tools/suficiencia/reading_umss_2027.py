"""Lecturas originales de práctica: temario PSA UMSS 2027 y Saladin, 6.ª ed.

No reproduce preguntas oficiales. Las lecturas son adaptaciones didácticas.
Cada pregunta se responde con el pasaje, sin exigir memorizar anatomía.
"""
from pathlib import Path
import argparse
import hashlib
import json
import random

ROOT = Path(__file__).resolve().parents[2]
PREFIX = 'lectura-umss2027-'
SKILLS = [
    'Reconocimiento textual',
    'Información explícita mediante sinónimos y paráfrasis',
    'Nivel inferencial',
    'Determinación de significados de un texto',
    'Síntesis de ideas centrales',
    'Jerarquía de ideas',
    'Función del elemento textual',
]
BASICS = [
    'Reconoce cómo se organiza el texto y qué tarea realiza: explicar, comparar, describir o narrar. El tema por sí solo no determina su organización.',
    'Una paráfrasis expresa la misma información con otras palabras. Debe conservar quién realiza la acción y las relaciones que afirma el pasaje.',
    'Una inferencia une datos del texto para obtener una conclusión respaldada. No agrega condiciones que el pasaje no ofrece.',
    'Interpreta la palabra o expresión dentro de su oración. Un significado posible en otro contexto puede ser incorrecto en esta lectura.',
    'La síntesis reúne la idea que organiza el conjunto. Un ejemplo verdadero no basta si deja fuera la relación central del texto.',
    'Distingue la idea general de las explicaciones, causas y ejemplos que dependen de ella. No todos los datos tienen la misma función.',
    'Pregunta qué aporta la expresión al razonamiento: ejemplifica, contrasta, explica una causa, aclara un límite o concluye.',
]
MISTAKES = [
    'No confundas la presencia de términos científicos con una instrucción para realizar un procedimiento.',
    'Repetir palabras del pasaje no garantiza conservar su sentido: revisa las relaciones entre ellas.',
    'No conviertas una posibilidad o una condición concreta en una conclusión universal.',
    'No elijas el significado más conocido si no encaja en esta oración.',
    'No sustituyas la idea central por un detalle, aunque ese detalle sea verdadero.',
    'No sitúes un ejemplo al mismo nivel que la afirmación general que explica.',
    'No describas solamente el tema de la expresión; identifica para qué se usa allí.',
]
passages, questions = [], []
answer_positions = list(range(4)) * 15
random.Random('umss-2027-lectura').shuffle(answer_positions)

def q(skill, prompt, answer, wrong, reason, evidence):
    return skill, prompt, answer, wrong, reason, evidence

def reading(slug, title, text, pages, section, items, difficulty, chapter=5):
    pid = PREFIX + slug
    source = {
        'document': 'Anatomía y fisiología: la unidad entre forma y función',
        'author': 'Kenneth S. Saladin', 'edition': '6.ª edición',
        'chapter': f'{chapter}. ' + ('Histología' if chapter == 5 else 'El sistema tegumentario'),
        'section': section, 'pdfPages': pages, 'printedPages': [p - 28 for p in pages],
        'kind': 'adaptación didáctica para lectura comprensiva; práctica propia de AlcocerMed',
        'original': False, 'syllabus': 'PSA Medicina UMSS 2027 · Comprensión lectora',
        'syllabusPdfPage': 2,
    }
    reference = (f"Lectura adaptada de Kenneth S. Saladin, {source['document']}, "
                 f"{source['edition']}, capítulo {source['chapter']}, {section}; "
                 f"páginas impresas {', '.join(map(str, source['printedPages']))} "
                 f"(páginas PDF {', '.join(map(str, pages))}). "
                 'Preguntas de práctica propias de AlcocerMed.')
    assert len(items) == 5 and len(text.split()) >= 110
    passages.append({'id': pid, 'title': 'UMSS 2027 · ' + title, 'text': text, 'source': source, 'difficulty': difficulty})
    for n, (skill, prompt, answer, wrong, reason, evidence) in enumerate(items, 1):
        assert len(wrong) == 3 and answer not in wrong and len(set(wrong)) == 3
        options = list(wrong)
        position = answer_positions[len(questions)]
        options.insert(position, answer)
        evidence = [evidence] if isinstance(evidence, int) else evidence
        steps = [{'title': 'Identifica lo que se pregunta', 'text': BASICS[skill]}]
        for paragraph in evidence:
            steps.append({'title': f'Localiza la evidencia en el párrafo {paragraph}',
                          'text': 'Lee el fragmento y conserva sus condiciones y relaciones.',
                          'quote': text.split('\n\n')[paragraph - 1], 'paragraph': paragraph})
        steps.append({'title': 'Relaciona la evidencia con las alternativas', 'text': reason})
        steps.append({'title': 'Comprueba la respuesta', 'text': 'La alternativa respaldada por la lectura es: ' + answer})
        steps.append({'title': 'Referencia de la lectura', 'text': reference})
        questions.append({
            'id': f'{pid}-{n}', 'subject': 'lectura', 'topic': SKILLS[skill],
            'passageId': pid, 'text': prompt, 'options': options, 'correct': position,
            'explanation': reason, 'source': source, 'difficulty': difficulty,
            'difficultyReason': {'facil': 'Relaciones explícitas y una inferencia directa.',
                                 'intermedio': 'Comparación de mecanismos y relaciones de causa y consecuencia.',
                                 'dificil': 'Integración de condiciones y límites de una interpretación.'}[difficulty],
            'solution': {'version': 1, 'level': 'desde-cero',
                         'goal': f'Resolver la pregunta a partir de «{title}».',
                         'basics': BASICS[skill], 'steps': steps, 'mistake': MISTAKES[skill],
                         'check': 'Vuelve al pasaje y comprueba que la alternativa mantiene su sentido, sin añadir datos externos.',
                         'answer': answer},
        })

reading('tejidos', 'Las células también necesitan organización',
'''Un órgano no se comprende únicamente contando sus células. Estas se especializan en tareas y se organizan en tejidos; además, entre ellas existe material extracelular, llamado matriz. Las funciones del órgano dependen tanto de las células como de la forma en que se relacionan. Un órgano reúne dos o más tipos de tejido, de modo que una misma estructura integra componentes con trabajos diferentes.

Los tejidos adultos se agrupan en cuatro grandes clases: epitelial, conjuntivo, nervioso y muscular. Para distinguirlos se consideran sus células, sus funciones y las características y cantidad de matriz. En los epitelios y músculos las células están muy próximas, mientras que en muchos tejidos conjuntivos la matriz ocupa una proporción mayor del espacio.

Esta clasificación permite ordenar una gran diversidad sin afirmar que todos los tejidos sean iguales. La histología estudia los tejidos y su organización en órganos. Por eso, identificar una célula ofrece información valiosa, pero no reemplaza observar cómo se integra con las demás y con el material que la rodea.''',
[172], '5.1 El estudio de los tejidos; las principales clases de tejidos', [
q(0, '¿Cómo se organiza principalmente esta lectura?', 'Explica una clasificación y la relaciona con la organización de los órganos.', ['Relata el descubrimiento histórico de cuatro tipos de células.', 'Indica los pasos para preparar una muestra microscópica.', 'Compara resultados de un experimento con dos órganos.'], 'El pasaje presenta células, tejidos y órganos; después explica los criterios de clasificación. No narra un descubrimiento ni describe un experimento.', [1, 2]),
q(1, '¿Qué opción reformula la información sobre la matriz?', 'Es material situado fuera de las células cuya proporción varía entre tejidos.', ['Es un componente interno que ocupa igual espacio en cada célula.', 'Es el nombre del conjunto de órganos que cumplen una función.', 'Es una característica utilizada solo para reconocer el tejido muscular.'], 'El primer párrafo la identifica como material extracelular y el segundo compara su proporción. La paráfrasis conserva ambas afirmaciones.', [1, 2]),
q(2, 'Si se reconoce un tipo de célula de un órgano, ¿qué falta para comprender mejor su organización?', 'Examinar cómo se relaciona con otros componentes del tejido.', ['Asignar el órgano a una sola clase de tejido.', 'Suponer que las células vecinas cumplen la misma tarea.', 'Tomar la cantidad de células como explicación suficiente.'], 'El cierre afirma que identificar una célula no reemplaza estudiar su integración. La inferencia se apoya también en que el órgano reúne varios tejidos.', 3),
q(3, 'En «integra componentes con trabajos diferentes», ¿qué significa «integra»?', 'Reúne componentes en una misma organización.', ['Convierte cada componente en un órgano separado.', 'Asigna una función idéntica a todos los componentes.', 'Enumera componentes sin relacionarlos.'], 'Integrar se usa para explicar cómo un órgano reúne tejidos distintos; no implica borrar sus diferencias funcionales.', 1),
q(4, '¿Cuál es la mejor síntesis del pasaje?', 'La organización de células y matriz en tejidos ayuda a comprender los órganos.', ['La histología consiste principalmente en contar las células de los órganos.', 'La mayor cantidad de matriz determina por sí sola la función de cualquier órgano.', 'Los órganos se distinguen porque cada uno contiene una única clase de tejido.'], 'La síntesis reúne organización, células, matriz y órganos. Las otras opciones reducen el análisis a un criterio o contradicen la variedad de tejidos.', [1, 3]),
], 'facil')

reading('epitelio', 'Una cubierta que depende de su base',
'''El epitelio está formado por células muy próximas entre sí. Recubre superficies y cavidades y participa en funciones como proteger, secretar o absorber. Aunque sus células necesitan nutrientes, el propio tejido epitelial carece de vasos sanguíneos. Habitualmente descansa sobre tejido conjuntivo que sí dispone de vasos y desde el cual recibe materiales.

Entre ambos tejidos se encuentra la membrana basal, que participa en su unión y en la regulación del intercambio. La superficie de la célula orientada hacia esa membrana se llama basal; la que queda hacia el espacio libre se denomina apical. Estos nombres describen posiciones diferentes, no dos clases independientes de epitelio.

Así, la ausencia de vasos dentro del epitelio no significa ausencia de nutrición. Su relación con el tejido subyacente permite entender cómo se mantiene. Estudiar solo la cubierta sin considerar su base dejaría incompleta la explicación: el tejido que protege una superficie también depende de materiales procedentes de otro tejido.''',
[175], '5.2 Tejido epitelial; membrana basal', [
q(4, '¿Qué idea resume la lectura?', 'El epitelio realiza sus funciones en relación con el tejido que lo sostiene y nutre.', ['El epitelio obtiene sus nutrientes de vasos situados entre sus propias células.', 'La posición apical explica por sí sola todas las funciones del epitelio.', 'La membrana basal convierte al epitelio en una clase de tejido conjuntivo.'], 'El texto describe la cubierta, la membrana basal y el aporte desde el tejido subyacente como partes de una misma relación.', [1, 3]),
q(1, '¿Qué alternativa conserva el sentido de «carece de vasos sanguíneos»?', 'No contiene vasos sanguíneos en su propio tejido.', ['No necesita recibir materiales para mantenerse.', 'No puede situarse cerca de un tejido vascularizado.', 'No permite intercambio con el tejido de su base.'], 'La ausencia se refiere a vasos dentro del epitelio. El pasaje afirma que recibe materiales de otro tejido y que existe intercambio.', 1),
q(2, '¿Qué conclusión se puede obtener sobre un epitelio sin vasos propios?', 'Su nutrición puede depender del aporte desde un tejido vecino.', ['Su funcionamiento depende de no consumir nutrientes.', 'Sus células basales y apicales pertenecen a tejidos sin contacto.', 'Su relación con la base es solo una cuestión de nombres.'], 'El texto diferencia no contener vasos de no recibir nutrición; la fuente de materiales está en el tejido conjuntivo subyacente.', [1, 3]),
q(5, '¿Qué relación hay entre la idea central y los términos «basal» y «apical»?', 'Los términos aportan un detalle espacial dentro de la explicación general del epitelio.', ['Los términos son dos conclusiones que sustituyen la idea de nutrición.', 'La posición apical es la idea general y la nutrición es un ejemplo de ella.', 'Los términos presentan una clasificación completa de los tejidos adultos.'], 'El segundo párrafo precisa posiciones celulares. Ese detalle ayuda a entender la relación entre cubierta y base, pero no reemplaza el tema general.', 2),
q(6, '¿Qué función cumple «no significa ausencia de nutrición»?', 'Corrige una conclusión que podría extraerse de la falta de vasos propios.', ['Introduce una segunda causa por la que el epitelio pierde sus vasos.', 'Niega que el tejido conjuntivo tenga vasos sanguíneos.', 'Explica cómo se eligió el nombre de la superficie apical.'], 'La frase limita una interpretación equivocada: no tener vasos en el tejido no equivale a quedar sin aporte de nutrientes.', 3),
], 'facil')

reading('barrera', 'Proteger también es conservar agua',
'''La piel constituye una barrera entre el organismo y el entorno. Sus células superficiales, sus uniones y la queratina contribuyen a resistir agresiones. La superficie cutánea también presenta condiciones que limitan el crecimiento de microorganismos, como una ligera acidez. La protección, por tanto, se relaciona con varias características y no solo con la existencia de una cubierta visible.

Otra función de esa barrera es evitar una pérdida excesiva de agua. Al pensar en una cubierta puede destacarse lo que impide entrar; en este caso también importa lo que ayuda a conservar dentro del cuerpo. La epidermis, además, limita el paso de muchas sustancias y de parte de la radiación ultravioleta.

Sin embargo, una barrera no equivale aquí a un cierre absoluto. Algunas sustancias pueden atravesar la piel. Reconocer ese límite permite describir su protección sin atribuirle una impermeabilidad total. El pasaje presenta la piel como una frontera funcional que restringe intercambios y protege, no como una separación que elimina cualquier relación con el exterior.''',
[209], '6.1 Piel y tejido subcutáneo; funciones de la piel', [
q(0, '¿Cuál es la intención principal de esta lectura?', 'Explicar varias funciones protectoras de la piel y precisar su alcance.', ['Dar instrucciones para aplicar una sustancia sobre la piel.', 'Narrar las etapas de aparición de una lesión cutánea.', 'Defender que las uniones celulares son la única forma de protección.'], 'El pasaje expone funciones y añade una limitación. No contiene pasos de tratamiento ni una secuencia de lesión.', [1, 3]),
q(1, '¿Qué opción expresa con otras palabras una función mencionada?', 'La barrera cutánea contribuye a reducir la salida excesiva de agua.', ['La barrera cutánea evita principalmente la producción de agua en el organismo.', 'La epidermis mantiene el agua separada de todas sus células.', 'La acidez de la piel aumenta necesariamente la pérdida de agua.'], 'El segundo párrafo afirma la prevención de una pérdida excesiva; no explica producción de agua ni atribuye esa pérdida a la acidez.', 2),
q(2, 'Si cierta sustancia atraviesa la piel, ¿qué conclusión es compatible con el texto?', 'Ese paso no demuestra que la piel carezca de función protectora.', ['Ese paso elimina la protección frente a cualquier microorganismo.', 'Esa sustancia debe ser agua que sale del organismo.', 'La epidermis deja de funcionar como cubierta en ese momento.'], 'La lectura admite el paso de algunas sustancias y mantiene la función de barrera. No se puede generalizar un caso a todos los intercambios.', 3),
q(3, '¿Qué expresa «frontera funcional» en el cierre?', 'Un límite que protege y restringe intercambios sin eliminarlos todos.', ['Una línea cuya única función es separar visualmente dos espacios.', 'Una cubierta que permite el mismo paso a todas las sustancias.', 'Un borde que existe solamente cuando se pierde agua.'], 'El sentido se explica en la misma oración: la frontera restringe y protege, pero no suprime toda relación con el exterior.', 3),
q(4, '¿Cuál es el resumen más completo?', 'La piel protege mediante varias propiedades, conserva agua y no es una barrera absoluta.', ['La función central de la piel es impedir la entrada de agua desde el ambiente.', 'La protección depende de una superficie visible sin relación con sus células.', 'El paso de algunas sustancias hace innecesario hablar de barrera cutánea.'], 'La respuesta recoge los tres párrafos y mantiene el matiz final. Las otras opciones invierten una función o niegan la protección descrita.', [2, 3]),
], 'facil', 6)

reading('renovacion', 'Una superficie que se reemplaza',
'''La superficie de la epidermis pierde células de forma continua. Para mantenerla, se producen queratinocitos en sus zonas profundas y las células nuevas empujan a otras hacia el exterior. El estrato basal participa en esa producción. La cercanía a la dermis permite a las células profundas recibir los materiales necesarios para dividirse.

Al desplazarse hacia la superficie, los queratinocitos cambian: se aplanan y acumulan componentes relacionados con la queratina y con la barrera frente al agua. Finalmente, el estrato córneo está formado por células muertas y sus fragmentos. Estas células superficiales se desprenden y son reemplazadas por otras que han avanzado desde abajo.

La continuidad de la cubierta depende, así, de un proceso de reemplazo. Que haya células muertas en su superficie no significa que toda la epidermis sea inactiva. La producción profunda, la transformación durante el recorrido y la pérdida superficial son partes relacionadas de una renovación, no tres hechos sin conexión.''',
[211, 212, 213], '6.1 Células y capas de la epidermis; la vida de un queratinocito', [
q(4, '¿Qué idea integra mejor el pasaje?', 'La epidermis conserva su cubierta mediante producción, transformación y reemplazo celular.', ['La epidermis permanece igual porque sus células superficiales no se desprenden.', 'La formación de queratina ocurre sin relación con el desplazamiento celular.', 'La presencia de células muertas explica toda la actividad de la epidermis.'], 'La síntesis une las tres fases descritas y evita confundir la situación de la superficie con la del tejido completo.', [1, 3]),
q(1, '¿Qué paráfrasis corresponde a «son reemplazadas por otras que han avanzado desde abajo»?', 'Las células que llegan desde zonas profundas ocupan el lugar de las que se desprenden.', ['Las células que se desprenden regresan al estrato basal para dividirse.', 'Los fragmentos superficiales se transforman directamente en células de la dermis.', 'Las células de la superficie se mantienen sin intercambio con capas profundas.'], 'El desplazamiento descrito va de profundidad a superficie. Las otras opciones cambian su dirección o suprimen el reemplazo.', 2),
q(2, '¿Por qué observar células muertas en la superficie no basta para llamar inactiva a toda la epidermis?', 'Porque en las capas profundas se producen células que sostienen la renovación.', ['Porque las células superficiales muertas se dividen con mayor rapidez.', 'Porque la dermis sustituye por completo a la epidermis durante el proceso.', 'Porque las células del estrato córneo permanecen vivas mientras se desprenden.'], 'La lectura distingue la superficie con células muertas de las regiones profundas que producen queratinocitos.', [1, 3]),
q(5, '¿Qué lugar ocupa la cercanía a la dermis dentro de la explicación?', 'Es un dato que explica el aporte de materiales para la división de células profundas.', ['Es la conclusión general que hace innecesaria la idea de renovación.', 'Es una etapa posterior al desprendimiento de las células superficiales.', 'Es un ejemplo de cómo las células muertas vuelven al interior.'], 'Ese dato apoya una parte del proceso, la producción profunda. No es la idea que resume toda la lectura.', 1),
q(6, '¿Para qué se utiliza «así» al comenzar el último párrafo?', 'Para introducir una conclusión apoyada en las fases explicadas antes.', ['Para contradecir la producción de células en profundidad.', 'Para presentar una comparación con un tejido diferente.', 'Para señalar que empieza una etapa posterior al reemplazo.'], 'El conector enlaza las fases descritas con la conclusión sobre la continuidad de la cubierta; no añade una nueva fase.', 3),
], 'facil', 6)

reading('fibras', 'Resistir y recuperar la forma',
'''Las fibras del tejido conjuntivo no se comprenden solo por su presencia, sino también por sus propiedades y disposición. Las fibras de colágeno resisten el estiramiento. Las elásticas pueden deformarse y favorecen la recuperación de la forma previa cuando se retira la tensión. En este uso, elasticidad destaca el retorno después de la deformación, no únicamente la capacidad de alargarse.

La orientación también importa. En tendones y ligamentos, las fibras de colágeno del tejido denso regular se organizan aproximadamente en paralelo, en relación con tensiones de dirección previsible. En el tejido denso irregular los haces siguen direcciones diversas, lo que permite resistir tensiones procedentes de distintas orientaciones.

Por eso, encontrar colágeno en dos muestras no basta para asignarles un comportamiento idéntico. La composición aporta una parte de la explicación y la organización añade otra. Comparar ambos criterios permite entender por qué materiales semejantes participan en tejidos con respuestas mecánicas diferentes.''',
[182, 183, 184], '5.3 Tejido conjuntivo fibroso; fibras y tejido denso', [
q(0, '¿Qué organización predomina en la lectura?', 'Compara propiedades y disposiciones para explicar diferencias funcionales.', ['Ordena cronológicamente la formación de dos tejidos durante la vida.', 'Presenta un procedimiento para medir la tensión de un tendón.', 'Enumera lesiones sin relacionarlas con las fibras.'], 'Primero se contrastan colágeno y fibras elásticas; luego se compara su orientación y se explica la consecuencia funcional.', [1, 2]),
q(1, '¿Qué reformulación conserva el sentido de «tensiones de dirección previsible»?', 'Fuerzas cuya orientación suele poder anticiparse.', ['Fuerzas que aparecen solo después de una lesión.', 'Fuerzas cuya magnitud es siempre idéntica.', 'Fuerzas que actúan sin una orientación definida.'], 'Previsible califica la dirección, no la magnitud ni la aparición de una lesión. La paráfrasis conserva ese alcance.', 2),
q(2, 'Dos tejidos contienen colágeno, pero sus fibras siguen orientaciones distintas. ¿Qué permite concluir el pasaje?', 'No basta compartir colágeno para asegurar la misma respuesta mecánica.', ['La orientación sustituye toda influencia de la composición.', 'Ambos deben clasificarse como tejido denso regular.', 'Las fibras de uno de ellos han perdido necesariamente su resistencia.'], 'El cierre pide considerar composición y disposición. No afirma que una anule a la otra ni permite diagnosticar pérdida de resistencia.', [2, 3]),
q(3, '¿Qué aspecto destaca «elasticidad» según la explicación del primer párrafo?', 'La recuperación de la forma al retirarse la tensión.', ['La cantidad de colágeno que contiene un tejido.', 'La facilidad para conservar una deformación permanente.', 'La organización paralela de todas las fibras.'], 'El propio pasaje precisa el significado y lo distingue de la sola posibilidad de alargarse.', 1),
q(4, '¿Cuál es la síntesis más adecuada?', 'Las propiedades y la disposición de las fibras ayudan a explicar la respuesta de los tejidos.', ['La presencia de colágeno determina una respuesta idéntica en todos los tejidos.', 'La orientación de las fibras sirve principalmente para nombrar órganos.', 'Las fibras elásticas se definen por impedir cualquier deformación.'], 'La respuesta integra los dos criterios desarrollados. Las otras opciones simplifican o contradicen la explicación.', [1, 3]),
], 'intermedio')

reading('cartilago', 'Una matriz que sostiene y condiciona',
'''El cartílago posee una matriz relativamente firme y flexible. Esa matriz contribuye al sostén, pero también constituye el medio que deben atravesar las sustancias que llegan a sus células o salen de ellas. Los condrocitos se sitúan en pequeñas cavidades llamadas lagunas y dependen del intercambio a través del material que los rodea.

La nutrición del cartílago no cuenta con una red capilar distribuida por su interior. Incluso cuando un vaso atraviesa alguno de estos tejidos, su paso no equivale a formar capilares que nutran directamente a cada zona. Los nutrientes y desechos se desplazan por difusión a través de la matriz. Este intercambio es lento y se relaciona con una actividad metabólica y división celular bajas.

La reparación lenta del cartílago lesionado se comprende dentro de esa cadena de relaciones. No basta afirmar que la matriz es resistente; también importa cómo condiciona el intercambio. El mismo elemento que contribuye al soporte forma parte de las condiciones en las que viven y se renuevan las células.''',
[187], '5.3 Cartílago', [
q(4, '¿Qué idea reúne las partes de la lectura?', 'La matriz del cartílago participa en el sostén y condiciona el intercambio y la reparación.', ['Las lagunas hacen innecesario el aporte de nutrientes a los condrocitos.', 'La resistencia de la matriz garantiza por sí sola una reparación rápida.', 'El paso de un vaso convierte cualquier cartílago en una red de capilares.'], 'El pasaje enlaza propiedades, nutrición por difusión, actividad celular y reparación; no limita su explicación al sostén.', [1, 3]),
q(1, '¿Qué expresa con otras palabras la aclaración sobre los vasos?', 'Que un vaso lo atraviese no implica que exista una red capilar nutritiva en su interior.', ['Que cualquier vaso presente alimenta directamente todas las lagunas.', 'Que la difusión ocurre únicamente dentro de vasos sanguíneos.', 'Que el cartílago elimina desechos sin atravesar su matriz.'], 'La aclaración distingue atravesar un tejido de ramificarse en capilares que lo nutran. Las otras opciones borran esa diferencia.', 2),
q(2, '¿Qué dato ayudaría a explicar la lentitud de reparación descrita?', 'El intercambio lento a través de la matriz y la baja división celular.', ['La posición de las lagunas fuera de todo tejido.', 'La ausencia de cualquier función de sostén.', 'La llegada directa de sangre a cada condrocito.'], 'El segundo párrafo ofrece la cadena que el tercero utiliza para explicar la reparación. No se requiere añadir otra causa.', [2, 3]),
q(5, '¿Cómo se relaciona el dato «actividad metabólica y división celular bajas» con el argumento?', 'Es un eslabón explicativo entre el intercambio lento y la reparación lenta.', ['Es un ejemplo sin relación con la nutrición descrita.', 'Es la definición de laguna y sustituye la idea de matriz.', 'Es una afirmación que contradice la conclusión sobre reparación.'], 'La lectura sitúa la actividad celular dentro de una secuencia causal, no como una observación aislada.', 2),
q(6, '¿Qué función cumple «No basta afirmar que la matriz es resistente»?', 'Amplía el análisis para incluir cómo se realiza el intercambio.', ['Niega que la matriz contribuya al sostén.', 'Introduce una instrucción para modificar el cartílago.', 'Descarta las condiciones de vida de los condrocitos.'], 'La frase no rechaza la resistencia: señala que ese dato es insuficiente y lo complementa con el intercambio y la renovación.', 3),
], 'intermedio')

reading('sudor', 'Secreciones que no siguen la misma ruta',
'''Las glándulas sudoríparas merocrinas y apocrinas producen secreciones, pero no tienen la misma organización. Las merocrinas conducen el sudor hacia un poro de la superficie y contribuyen principalmente al enfriamiento corporal. Las apocrinas se relacionan con folículos pilosos y su secreción es más espesa. Distinguir el trayecto del conducto ayuda a no confundir ambos tipos.

En las dos existen células mioepiteliales, capaces de contraerse y favorecer el desplazamiento de la secreción por el conducto. Esa característica compartida no elimina las diferencias anteriores. Dos glándulas pueden disponer de un mecanismo de expulsión semejante y, aun así, diferir en el lugar de salida y en las características de su producto.

El sudor puede evaporarse con tanta rapidez que apenas se advierta en la superficie. Por ello, no observar humedad evidente no permite concluir que no haya secreción. Una descripción cuidadosa diferencia la producción, el recorrido y lo que finalmente se percibe sobre la piel.''',
[223, 224], '6.3 Glándulas cutáneas; glándulas sudoríparas', [
q(0, '¿Qué hace principalmente el texto?', 'Compara dos tipos de glándulas y distingue secreción de humedad perceptible.', ['Describe un único recorrido común a todas las glándulas de la piel.', 'Relata la primera observación histórica de las células mioepiteliales.', 'Propone un método para detener la producción de sudor.'], 'El pasaje compara trayectos y mecanismos y después aclara una diferencia entre producir sudor y observarlo.', [1, 3]),
q(1, '¿Qué paráfrasis conserva la función atribuida a las células mioepiteliales?', 'Su contracción ayuda a impulsar la secreción por el conducto.', ['Su contracción transforma el sudor merocrino en secreción apocrina.', 'Son las responsables de que todos los conductos desemboquen en folículos.', 'Detienen la salida de la secreción cuando se contraen.'], 'El segundo párrafo atribuye a la contracción el desplazamiento de la secreción, no un cambio de tipo ni de destino del conducto.', 2),
q(2, '¿Qué conclusión es razonable si no se observa humedad evidente en la piel?', 'Podría haber sudor que se evapora rápidamente.', ['Las glándulas merocrinas han dejado de funcionar.', 'Solo pueden estar activas las glándulas apocrinas.', 'Las células mioepiteliales no están presentes.'], 'La última parte ofrece la evaporación como explicación posible. No permite decidir qué glándulas funcionan ni si existen ciertas células.', 3),
q(3, '¿Qué significa «se percibe» en el último enunciado?', 'Se advierte u observa.', ['Se produce en la parte profunda de la glándula.', 'Se desplaza a través del conducto.', 'Se modifica dentro del folículo piloso.'], 'El cierre distingue percibir de producir y transportar. En ese contexto se refiere a notar la secreción sobre la superficie.', 3),
q(4, '¿Cuál es la mejor síntesis?', 'Para interpretar la sudoración se distinguen el tipo glandular, su recorrido y su manifestación visible.', ['Compartir células contráctiles vuelve equivalentes a todas las glándulas sudoríparas.', 'La humedad visible basta para conocer el trayecto de cualquier conducto.', 'La evaporación demuestra que no se produjo una secreción.'], 'La síntesis recoge los tres planos del texto; las otras opciones confunden semejanza con identidad o percepción con producción.', [2, 3]),
], 'intermedio', 6)

reading('sebo', 'Una secreción que requiere reemplazo',
'''Las glándulas sebáceas producen sebo, una secreción oleosa que ayuda a evitar que la piel y el pelo se resequen y se vuelvan quebradizos. Sus conductos suelen desembocar en folículos pilosos, aunque algunos se abren directamente sobre la piel. El destino habitual de la secreción no debe confundirse con una regla sin excepciones.

Estas glándulas son holocrinas: su producto incluye células que se desintegran. La producción implica, por tanto, la pérdida de células secretoras. En la base de la glándula se generan por mitosis células que reemplazan a las que se han deshecho. Expulsar el producto y renovar sus células son procesos vinculados en este modo de secreción.

Así, la secreción oleosa no se explica únicamente por la presencia de un conducto. También exige considerar cómo se forma el producto y cómo se mantiene el tejido que lo produce. Seguir la relación entre pérdida y reemplazo ayuda a comprender la continuidad de la actividad glandular.''',
[223, 224], '6.3 Glándulas cutáneas; glándulas sebáceas', [
q(4, '¿Qué idea resume el texto?', 'La secreción sebácea relaciona la formación de su producto con la renovación de células.', ['El sebo se forma únicamente por el paso de líquido a través de un poro.', 'Todos los conductos sebáceos llegan obligatoriamente al mismo destino.', 'La desintegración de células detiene de forma definitiva la glándula.'], 'La idea central une producto, pérdida celular y reemplazo; el conducto es una parte de la descripción, no su explicación completa.', [2, 3]),
q(1, '¿Qué expresión equivale a «suelen desembocar en folículos pilosos»?', 'Habitualmente vierten su producto en folículos, aunque existen otras salidas.', ['Abren sus conductos en folículos en todos los casos.', 'Producen folículos pilosos cuando sus células se dividen.', 'Solo vierten el producto sobre la superficie sin pasar por folículos.'], 'Suelen expresa una situación frecuente, y la oración siguiente explicita una excepción. La paráfrasis debe conservarla.', 1),
q(2, 'Según el pasaje, ¿por qué el reemplazo celular es relevante para la continuidad de esta secreción?', 'Porque la formación del producto implica que se pierdan células.', ['Porque el sebo impide toda división en la base glandular.', 'Porque cada conducto se convierte periódicamente en un folículo.', 'Porque las células desintegradas conservan indefinidamente su función.'], 'La conexión se construye en el segundo párrafo: desintegración y mitosis están vinculadas para mantener el tejido secretor.', 2),
q(5, '¿Qué relación existe entre la mitosis basal y la idea central?', 'La mitosis es el mecanismo de reemplazo que apoya la explicación de continuidad.', ['La mitosis es el nombre general que incluye todas las funciones del sebo.', 'La mitosis es un ejemplo independiente de la pérdida de células.', 'La mitosis describe exclusivamente la ubicación de los conductos.'], 'La división basal explica cómo se renuevan las células perdidas. Es una parte del mecanismo que sostiene el argumento general.', 2),
q(6, '¿Para qué se añade «aunque algunos se abren directamente sobre la piel»?', 'Para limitar una generalización sobre el destino de los conductos.', ['Para contradecir que el sebo sea una secreción oleosa.', 'Para presentar el paso posterior a la desintegración celular.', 'Para concluir que los folículos no intervienen en la salida del sebo.'], 'Aunque introduce una excepción al destino habitual; no elimina la regla general ni explica el modo de formación del producto.', 1),
], 'intermedio', 6)

reading('cortes', 'Una imagen plana de una estructura con volumen',
'''Un corte histológico presenta en dos dimensiones parte de una estructura tridimensional. Su aspecto depende del plano y de la profundidad del corte. Un tubo curvado, por ejemplo, puede aparecer como varios perfiles separados si el plano lo atraviesa en distintos puntos. Contar esos perfiles como si fueran tubos independientes añadiría una conclusión que la imagen aislada no garantiza.

La preparación de la muestra también influye en lo que se observa. Los cortes delgados permiten el paso de la luz y reducen la superposición de capas; las tinciones destacan componentes que sin ese tratamiento resultarían poco visibles. El color de una preparación, por tanto, debe interpretarse teniendo en cuenta que puede haber sido introducido durante su elaboración.

La ausencia de una parte en un corte tampoco demuestra su ausencia en la estructura completa: un corte superficial de un huevo puede no incluir la yema. Esta comparación sirve para entender una limitación del muestreo espacial. Interpretar la imagen exige relacionar lo que muestra con el modo en que se obtuvo y con el volumen del objeto del que procede.''',
[173, 174], '5.1 Interpretación de cortes de tejidos; figuras 5.1 y 5.2', [
q(0, '¿Cómo desarrolla el texto su explicación?', 'Presenta límites de una imagen y los aclara mediante mecanismos y ejemplos.', ['Enumera los órganos según el número de perfiles que presentan.', 'Narra un experimento que prueba que las tinciones son innecesarias.', 'Describe únicamente el procedimiento para cortar un huevo.'], 'El tubo, las tinciones y el huevo apoyan la explicación de cómo interpretar una imagen parcial; no son un catálogo ni una receta.', [1, 3]),
q(1, '¿Qué reformulación conserva «la imagen aislada no garantiza»?', 'La imagen por sí sola no basta para asegurar esa conclusión.', ['La imagen es necesariamente incorrecta en todos sus detalles.', 'La imagen permite conocer la totalidad del objeto sin contexto.', 'La imagen impide que se obtenga cualquier información útil.'], 'La afirmación limita una conclusión concreta sobre independencia de tubos. No declara falsa o inútil toda la imagen.', 1),
q(2, 'Si dos perfiles separados aparecen en un corte, ¿qué posibilidad debe mantenerse abierta?', 'Que ambos correspondan a partes de una misma estructura curvada.', ['Que cada perfil sea necesariamente un órgano completo.', 'Que las tinciones hayan creado nuevos tubos en el tejido.', 'Que el objeto original solo tenga dos dimensiones.'], 'El ejemplo inicial explica cómo un tubo puede atravesar varias veces el plano. Por ello no se deduce independencia a partir de separación visual.', 1),
q(3, '¿Qué significa «muestreo espacial» en el tercer párrafo?', 'Examinar una parte del volumen mediante un plano de corte.', ['Escoger un color de tinción según su intensidad.', 'Calcular cuántos tejidos existen en todo el organismo.', 'Ordenar fotografías por la fecha de su preparación.'], 'El ejemplo del huevo relaciona la parte visible con el nivel del corte; no trata del tiempo ni de la selección de colores.', 3),
q(4, '¿Cuál es la mejor síntesis?', 'La interpretación histológica requiere considerar el corte, la preparación y la estructura de origen.', ['Los perfiles separados siempre representan estructuras independientes.', 'La falta de una parte en la imagen permite descartar que exista en el objeto.', 'El color de la preparación describe sin cambios el aspecto natural del tejido.'], 'La síntesis integra las tres precauciones desarrolladas. Las otras opciones son justamente las conclusiones que el texto limita.', [2, 3]),
], 'dificil')

reading('clasificar-piel', 'El criterio importa más que el nombre',
'''La piel incluye epidermis y dermis. El espesor total depende de ambas capas y puede variar entre regiones. Sin embargo, la clasificación histológica en piel gruesa y delgada atiende al grosor relativo de la epidermis, en especial a su estrato córneo. El nombre de la categoría no debe confundirse con una medición de toda la piel.

La piel gruesa se encuentra en palmas, plantas y superficies correspondientes de los dedos. Posee glándulas sudoríparas, pero carece de folículos pilosos y glándulas sebáceas. La piel delgada cubre el resto del cuerpo y presenta una epidermis más fina; allí se encuentran folículos y glándulas sebáceas además de las sudoríparas.

Para clasificar una muestra conviene mantener separado el dato observado del criterio utilizado. Una medición que sume epidermis y dermis no permite, por sí sola, decidir la categoría histológica. Los ejemplos de localización y estructuras asociadas complementan la explicación, mientras que el criterio principal sigue siendo la capa definida al comienzo.''',
[209], '6.1 Piel y tejido subcutáneo; piel gruesa y delgada', [
q(4, '¿Cuál es la idea central?', 'Clasificar la piel exige distinguir el espesor total del criterio centrado en la epidermis.', ['Las localizaciones sustituyen cualquier criterio histológico para clasificar la piel.', 'La presencia de glándulas sudoríparas permite distinguir por sí sola ambos tipos.', 'El grosor de la dermis determina la categoría de piel gruesa en todos los casos.'], 'La lectura organiza los detalles alrededor de una distinción de criterios; las localizaciones y estructuras son información complementaria.', [1, 3]),
q(1, '¿Qué paráfrasis mantiene el criterio señalado?', 'La categoría se establece considerando el espesor epidérmico, especialmente su capa córnea.', ['La categoría se obtiene sumando sin distinción el espesor de todas las capas.', 'La categoría depende de cuál región tenga el mayor grosor de dermis.', 'La categoría se define por la cantidad de sudor sobre la superficie.'], 'El primer párrafo delimita el componente que se considera y lo diferencia del espesor total.', 1),
q(2, 'Si solo se conoce el espesor total de una muestra, ¿qué conclusión está justificada?', 'Falta conocer el criterio epidérmico para asignar la categoría histológica.', ['La muestra pertenece necesariamente a piel gruesa.', 'No es posible que la muestra contenga glándulas sebáceas.', 'La epidermis representa toda la medida obtenida.'], 'La suma de capas no permite saber el grosor de la epidermis por sí sola. Las otras opciones añaden información no disponible.', [1, 3]),
q(5, '¿Qué jerarquía de ideas refleja el pasaje?', 'Criterio de clasificación; después, localizaciones y características que lo ilustran.', ['Lista de localizaciones; después, negación de todo criterio de clasificación.', 'Glándulas sudoríparas como idea principal; epidermis como ejemplo sin importancia.', 'Espesor total como regla; criterio epidérmico como excepción ocasional.'], 'El primer párrafo fija la regla y el segundo ofrece rasgos asociados. El cierre reafirma esa jerarquía.', [1, 3]),
q(6, '¿Qué función cumple «Sin embargo» en el primer párrafo?', 'Contrasta el espesor total con el criterio usado para nombrar los tipos de piel.', ['Introduce la causa de que la dermis pierda espesor.', 'Enumera otra región donde aparece piel gruesa.', 'Presenta una conclusión de igualdad entre todas las mediciones.'], 'El conector marca un cambio desde el grosor del conjunto al de la capa que se utiliza en la clasificación.', 1),
], 'dificil', 6)

reading('reserva', 'Una reserva puede mantenerse mientras cambia',
'''El tejido adiposo constituye un importante depósito de energía. Sus células almacenan triglicéridos, pero almacenar no significa mantener inmóviles las mismas moléculas. Mientras se sintetizan y guardan nuevos triglicéridos, otros se descomponen y se liberan. La reserva participa en un intercambio continuo entre energía almacenada y energía utilizada.

Una cantidad almacenada relativamente estable puede coexistir con esa renovación. Como comparación didáctica, un depósito de agua puede conservar un nivel parecido si las entradas y salidas se equilibran, aunque el agua que contiene cambie. La comparación no convierte al tejido en un recipiente literal: ayuda a separar la cantidad presente de los movimientos que la mantienen.

También se debe distinguir el tejido vivo de su apariencia en una preparación histológica. Muchos fijadores disuelven los triglicéridos, de modo que los adipocitos pueden parecer vacíos en la muestra. Esa apariencia no prueba que no almacenaran lípidos. Tanto al interpretar la estabilidad de una reserva como al observar una imagen, importa conocer el proceso que produjo el resultado visible.''',
[184], '5.3 Tejido adiposo; renovación de triglicéridos y preparación histológica', [
q(0, '¿Cómo avanza principalmente el argumento?', 'Relaciona dos casos en los que una apariencia debe interpretarse atendiendo al proceso.', ['Ordena las fases del crecimiento del tejido adiposo durante la infancia.', 'Indica cómo construir un depósito de agua para medir energía.', 'Compara alimentos según su contenido de triglicéridos.'], 'La estabilidad de la reserva y el aspecto vacío de la muestra ilustran el mismo criterio interpretativo: considerar cómo se obtiene lo observado.', [2, 3]),
q(1, '¿Qué paráfrasis conserva «una cantidad almacenada relativamente estable puede coexistir con esa renovación»?', 'El total puede variar poco aunque se sustituyan las moléculas que lo componen.', ['Las mismas moléculas permanecen porque el total no cambia mucho.', 'La renovación requiere que desaparezca toda la reserva.', 'Una reserva estable deja de participar en el uso de energía.'], 'La frase distingue cantidad y composición a lo largo del tiempo. Estabilidad relativa del total no equivale a ausencia de intercambio.', 2),
q(2, 'Un adipocito parece vacío tras fijar la muestra. ¿Qué se puede concluir a partir del texto?', 'La preparación pudo eliminar lípidos que estaban presentes en la célula viva.', ['La célula nunca tuvo capacidad para almacenar energía.', 'La reserva de todo el organismo estaba agotada.', 'El tejido pertenece necesariamente a una clase distinta del adiposo.'], 'El último párrafo da una causa de la apariencia vacía. No autoriza conclusiones sobre toda la historia de la célula ni de las reservas del organismo.', 3),
q(3, '¿Qué significa «inmóviles» en «mantener inmóviles las mismas moléculas»?', 'Sin entrar en procesos de reemplazo y utilización.', ['Situadas en una posición fija dentro de una fotografía.', 'Incapaces de ocupar espacio en una célula.', 'Separadas físicamente de cualquier tejido vecino.'], 'El contexto se refiere a síntesis, almacenamiento y descomposición, no a movimiento visible en una imagen.', 1),
q(4, '¿Cuál es la síntesis más precisa?', 'Una reserva estable o una imagen aparentemente vacía requieren conocer los procesos que las explican.', ['La estabilidad de la reserva demuestra que no hay utilización de triglicéridos.', 'Las imágenes histológicas permiten ignorar cómo se prepararon las muestras.', 'El tejido adiposo funciona exactamente como un depósito artificial de agua.'], 'La respuesta integra los dos ejemplos y conserva los límites de la analogía. Las otras opciones convierten las apariencias o la comparación en conclusiones absolutas.', [2, 3]),
], 'dificil')

reading('reparacion', 'Reparar no siempre equivale a restituir',
'''La reparación de un tejido dañado puede incluir regeneración y fibrosis. En la regeneración, las células perdidas se reemplazan por otras del mismo tipo y se recupera la función normal. En la fibrosis, el lugar dañado se ocupa con tejido cicatricial, compuesto principalmente por colágeno producido por fibroblastos. La cicatriz contribuye a mantener unido el órgano, pero no restablece del mismo modo su funcionamiento.

Ambos procesos pueden participar en una misma herida cutánea. Las células epiteliales se multiplican y migran hacia el área lesionada, mientras en el tejido conjuntivo subyacente se deposita colágeno. La recuperación de la cubierta y la formación de tejido cicatricial son acontecimientos relacionados, aunque no describen el mismo tipo de reemplazo.

Por eso, decir que una zona ha sido reparada requiere precisar qué se restauró. La continuidad de una estructura no demuestra por sí sola que todas sus funciones originales hayan vuelto. Distinguir el tipo de tejido que reemplaza al perdido permite interpretar la reparación sin confundir cierre, sostén y recuperación funcional.''',
[200, 201], 'Reparación tisular; regeneración y fibrosis', [
q(4, '¿Qué idea sintetiza la lectura?', 'La reparación puede mantener la estructura sin recuperar de igual manera su función original.', ['La regeneración y la fibrosis nombran un único mecanismo de reemplazo.', 'La formación de una cicatriz restaura por sí sola todas las funciones previas.', 'Los procesos de reparación no pueden coexistir dentro de una herida.'], 'El texto diferencia mecanismos y sus resultados, y después explica su coexistencia. Reparación no se presenta como sinónimo de restitución funcional completa.', [1, 3]),
q(1, '¿Qué opción reformula correctamente la fibrosis descrita?', 'El tejido dañado es sustituido por tejido cicatricial rico en colágeno.', ['Las células perdidas son siempre reemplazadas por otras del mismo tipo.', 'La superficie se restituye sin intervención de material extracelular.', 'El órgano desaparece para que se forme otro sin cicatriz.'], 'La fibrosis se define por el reemplazo cicatricial. La segunda opción corresponde a regeneración y las demás no aparecen en el pasaje.', 1),
q(2, 'Si una herida ha recuperado continuidad, ¿qué no queda demostrado solo con ese dato?', 'Que todas las funciones originales se hayan restablecido.', ['Que exista alguna forma de unión en la zona reparada.', 'Que sea posible diferenciar mecanismos de reparación.', 'Que el término reparación pueda aplicarse al proceso.'], 'El cierre separa continuidad y recuperación funcional. No niega la unión ni la posibilidad de describir el proceso como reparación.', 3),
q(5, '¿Qué relación tiene el ejemplo de la herida cutánea con la distinción inicial?', 'Muestra que dos mecanismos diferentes pueden actuar en partes de una misma lesión.', ['Demuestra que la diferencia entre regeneración y fibrosis era solo de vocabulario.', 'Sustituye la distinción por una clasificación de tipos de colágeno.', 'Presenta un caso que obliga a descartar la fibrosis como reparación.'], 'El segundo párrafo aplica la distinción a epitelio y tejido conjuntivo. Su coexistencia no elimina sus diferencias.', [1, 2]),
q(6, '¿Qué función cumple la pregunta implícita «qué se restauró»?', 'Invita a precisar el resultado antes de equiparar reparación y recuperación completa.', ['Introduce una nueva clasificación de las células epiteliales.', 'Niega que una cicatriz contribuya a mantener unido el órgano.', 'Ordena evaluar únicamente el aspecto externo de la herida.'], 'La expresión orienta a distinguir cierre, sostén y función; justamente evita limitar la interpretación a la apariencia externa.', 3),
], 'dificil')

def build():
    assert len(passages) == 12 and len(questions) == 60
    path = ROOT / 'api/_sufficiency/bank.json'
    bank = json.loads(path.read_text(encoding='utf8'))
    # Repetir el generador no duplica ni reemplaza contenidos previos.
    bank['questions'] = [q for q in bank['questions'] if not q['id'].startswith(PREFIX)] + questions
    bank['passages'] = [p for p in bank['passages'] if not p['id'].startswith(PREFIX)] + passages
    papers = []
    titles = ['Tejidos y epitelios', 'La piel y su renovación', 'Sostén e intercambio',
              'Glándulas de la piel', 'Interpretar imágenes y clasificaciones', 'Reservas y reparación']
    for i in range(6):
        pair = passages[i * 2:i * 2 + 2]
        ids = [q['id'] for q in questions if q['passageId'] in {p['id'] for p in pair}]
        skills = {q['topic'] for q in questions if q['id'] in ids}
        assert skills == set(SKILLS)
        difficulty = pair[0]['difficulty']
        papers.append({'id': f'nivel-lectura-umss2027-{i + 1:02}',
                       'title': f'UMSS 2027 · Lectura {i + 1:02} · {titles[i]}',
                       'subject': 'lectura', 'difficulty': difficulty, 'questionIds': ids,
                       'questionCount': 10, 'minutes': {'facil': 20, 'intermedio': 25, 'dificil': 30}[difficulty],
                       'description': 'Dos lecturas completas · Siete habilidades del temario PSA 2027 · Respuestas comentadas.',
                       'type': 'por-nivel', 'commented': True})
    bank['levelPapers'] = papers + [p for p in bank['levelPapers'] if not p['id'].startswith('nivel-lectura-umss2027-')]
    bank['readingExpansion2027'] = {'passages': 12, 'questions': 60, 'papers': 6,
                                    'skills': SKILLS, 'syllabusPdf': '/documentos/umss-2027/temario-oficial.pdf',
                                    'syllabusPdfPage': 2, 'officialExamQuestions': False}
    bank['contentRevision'] = 4
    stats = bank['statistics']
    stats.update(questions=len(bank['questions']), uniqueQuestionCount=len(bank['questions']),
                 passages=len(bank['passages']), readingQuestions=260, newPractice=918,
                 levelSimulations=len(bank['levelPapers']))
    for subject in stats['perSubject']:
        rows = [q for q in bank['questions'] if q['subject'] == subject]
        stats['perSubject'][subject] = len(rows)
        stats['perDifficulty'][subject] = {level: sum(q['difficulty'] == level for q in rows)
                                           for level in ['facil', 'intermedio', 'dificil']}
    pages = sorted({n for p in bank['passages'] for n in p['source']['pdfPages']})
    bank['readingSource'].update(pdfPages=pages, printedPages=[n - 28 for n in pages], chapters=[1, 2, 5, 6])
    path.write_text(json.dumps(bank, ensure_ascii=False, indent=2) + '\n', encoding='utf8', newline='\n')
    audit = {'source': {'document': passages[0]['source']['document'], 'author': 'Kenneth S. Saladin',
                        'edition': '6.ª edición', 'sha256': 'e00074c7105c10052637b1c2a82f2b8959cf7c4cb9a91c4abd058ce958e58148'},
             'syllabus': {'sha256': '985e76262979ac3d1dc7586097d14ac61c34fe46412d89abb1b2cc7900014fc7', 'pdfPage': 2},
             'practice': 'Adaptaciones y preguntas propias de AlcocerMed, no preguntas oficiales de admisión.',
             'passages': [{'id': p['id'], 'title': p['title'], 'chapter': p['source']['chapter'],
                           'section': p['source']['section'], 'pdfPages': p['source']['pdfPages'],
                           'printedPages': p['source']['printedPages'],
                           'skills': [q['topic'] for q in questions if q['passageId'] == p['id']]} for p in passages]}
    (ROOT / 'api/_sufficiency/reading-umss-2027-audit.json').write_text(json.dumps(audit, ensure_ascii=False, indent=2) + '\n', encoding='utf8', newline='\n')
    print(f'{len(papers)} simulacros, {len(passages)} lecturas y {len(questions)} preguntas añadidas.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-pdf', type=Path, required=True)
    args = parser.parse_args()
    expected = 'e00074c7105c10052637b1c2a82f2b8959cf7c4cb9a91c4abd058ce958e58148'
    if hashlib.sha256(args.source_pdf.read_bytes()).hexdigest() != expected:
        raise SystemExit('El PDF no coincide con la edición oficial verificada.')
    build()
