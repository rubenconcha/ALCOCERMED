'use strict';

// Ejercicios propios. La página PDF y la sección se revisaron en los textos guía
// 2026 de la Unidad de Admisión Facultativa de Medicina de la UMSA.
const questions = [];
const collections = {
    matematicas: { title: 'Matemática', offset: 9, chapters: [
        'Lógica proposicional', 'Conjuntos', 'Conceptos fundamentales del álgebra',
        'Exponentes y radicales', 'Productos y cocientes notables', 'Factorización',
        'Ecuaciones', 'Inecuaciones', 'Logaritmos', 'Introducción a la estadística'
    ] },
    fisica: { title: 'Física', offset: 10, chapters: [
        'Unidades y medidas', 'Vectores', 'Cinemática', 'Dinámica', 'Trabajo, energía y potencia',
        'Impulso, cantidad de movimiento y colisiones', 'Mecánica de fluidos', 'Temperatura y dilatación',
        'Calor', 'Sonido', 'Óptica', 'Electrostática y electrodinámica'
    ] },
    quimica: { title: 'Química', offset: 12, chapters: [
        'Química como herramienta para la vida', 'Interacción de la materia y la energía',
        'El modelo atómico actual y sus aplicaciones', 'Enlaces químicos e interacciones intermoleculares',
        'Nomenclatura y formulación inorgánica', 'Las reacciones químicas y sus ecuaciones',
        'Bioenergética y cinética química', 'Disoluciones', 'Equilibrio ácido base',
        'Química del carbono I', 'La química del carbono II', 'Biomoléculas'
    ] }
};

function add(subject, chapterNumber, pdfPage, section, difficulty, question, choices, basics, steps, mistake, check) {
    const {title, offset, chapters} = collections[subject];
    const topic = chapters[chapterNumber - 1];
    const n = questions.filter(q => q.subject === subject && q.source.chapterNumber === chapterNumber).length + 1;
    const correct = questions.length % 4, options = choices.slice(1);
    options.splice(correct, 0, choices[0]);
    const titles = ['Identifica los datos', 'Elige la regla', 'Aplica la regla', 'Obtén la respuesta'];
    questions.push({
        id: `umsa-2026-${subject}-${chapterNumber}-${n}`, subject, topic, difficulty,
        text: question, options, correct, explanation: steps[3],
        source: {
            collection: 'umsa-2026', institution: 'Universidad Mayor de San Andrés',
            document: `Texto guía para el examen de admisión 2026 · ${title}`,
            chapterNumber, chapter: topic, section, printedPages: [pdfPage - offset], pdfPages: [pdfPage],
            kind: 'Ejercicio original de AlcocerMed', original: false
        },
        solution: {
            version: 1, level: 'desde-cero', goal: question, basics,
            steps: steps.map((text, i) => ({title: titles[i], text})), mistake, check, answer: choices[0]
        }
    });
}

const m = (...row) => add('matematicas', ...row);
m(1, 13, 'Conjunción', 'facil', 'Si p es verdadera y q es falsa, ¿qué valor tiene p ∧ q?',
    ['Falsa', 'Verdadera', 'Depende de p solamente', 'No tiene valor de verdad'],
    'El símbolo ∧ representa la conjunción, que se lee «y».',
    ['Identifica p como verdadera.', 'Para que una conjunción sea verdadera, ambas proposiciones deben ser verdaderas.', 'q es falsa, así que no se cumplen ambas condiciones.', 'p ∧ q es falsa.'],
    'No uses la regla de la disyunción: «y» exige las dos proposiciones verdaderas.', 'La fila V, F de la tabla de conjunción da F.');
m(2, 34, 'Intersección', 'facil', 'Dados A = {2, 5, 7} y B = {1, 5, 7, 9}, ¿cuál es A ∩ B?',
    ['{5, 7}', '{1, 2, 5, 7, 9}', '{2}', '{1, 9}'],
    'La intersección reúne los elementos que pertenecen a ambos conjuntos.',
    ['Escribe los elementos de A: 2, 5 y 7.', 'Comprueba uno por uno si también pertenecen a B.', 'El 2 no aparece en B; el 5 y el 7 sí.', 'La intersección es {5, 7}.'],
    'No incluyas los elementos que aparecen en uno solo de los conjuntos.', 'Tanto 5 como 7 aparecen en A y en B.');
m(3, 48, 'Mínimo común múltiplo', 'intermedio', '¿Cuál es el mínimo común múltiplo de 18 y 24?',
    ['72', '36', '48', '144'],
    'Para hallar el mínimo común múltiplo mediante factores primos, se toma cada primo con el mayor exponente que aparezca.',
    ['Descompón 18 = 2 · 3² y 24 = 2³ · 3.', 'Elige la mayor potencia de 2 y de 3.', 'Multiplica 2³ · 3² = 8 · 9.', 'El mínimo común múltiplo es 72.'],
    'Elegir los exponentes menores de los factores comunes da el máximo común divisor.', '72 ÷ 18 = 4 y 72 ÷ 24 = 3.');
m(4, 64, 'Producto de potencias de igual base', 'facil', 'Simplifica x⁴ · x³.',
    ['x⁷', 'x¹²', 'x', '2x⁷'],
    'Cuando se multiplican potencias de la misma base, se suman sus exponentes.',
    ['La base es x en ambos factores.', 'Conserva la base y suma 4 + 3.', 'La suma de exponentes es 7.', 'El resultado es x⁷.'],
    'Multiplicar los exponentes corresponde a una potencia elevada a otra potencia.', 'Con x = 2, 16 · 8 = 128 = 2⁷.');
m(5, 79, 'Cuadrado de la suma', 'facil', '¿Cuál es el desarrollo de (x + 6)²?',
    ['x² + 12x + 36', 'x² + 36', 'x² + 6x + 36', 'x² − 12x + 36'],
    'El cuadrado de una suma incluye el doble producto de sus términos.',
    ['Identifica a = x y b = 6.', 'Usa a² + 2ab + b².', 'Calcula 2 · x · 6 = 12x y 6² = 36.', 'Obtienes x² + 12x + 36.'],
    'No omitas el doble producto al elevar un binomio al cuadrado.', 'Con x = 1, ambos lados valen 49.');
m(5, 80, 'Cuadrado de la diferencia', 'intermedio', 'Desarrolla (3y − 4)².',
    ['9y² − 24y + 16', '9y² − 16', '9y² + 24y + 16', '3y² − 24y + 16'],
    'Para (a − b)², el término del medio es −2ab y ambos cuadrados se suman.',
    ['Identifica a = 3y y b = 4.', 'Eleva los términos al cuadrado: 9y² y 16.', 'El doble producto con signo negativo es −2 · 3y · 4 = −24y.', 'El desarrollo es 9y² − 24y + 16.'],
    'El último término es positivo porque corresponde al cuadrado de 4.', 'Con y = 1, el binomio y el desarrollo dan 1.');
m(5, 81, 'Producto de la suma por la diferencia', 'intermedio', 'Simplifica (4z + 7)(4z − 7).',
    ['16z² − 49', '16z² + 49', '16z² − 56z + 49', '4z² − 49'],
    'Los binomios conjugados tienen los mismos términos y signos opuestos entre ellos.',
    ['Identifica los términos 4z y 7.', 'Usa (a + b)(a − b) = a² − b².', 'Calcula (4z)² = 16z² y 7² = 49.', 'La diferencia es 16z² − 49.'],
    'No apliques el cuadrado de un binomio: los términos cruzados aquí se cancelan.', 'Con z = 2, 15 · 1 = 15 y 64 − 49 = 15.');
m(5, 82, 'Cubo de la suma', 'intermedio', '¿Cuál es el desarrollo de (t + 3)³?',
    ['t³ + 9t² + 27t + 27', 't³ + 27', 't³ + 3t² + 9t + 27', 't³ + 9t² + 9t + 27'],
    'El cubo de una suma tiene cuatro términos: a³ + 3a²b + 3ab² + b³.',
    ['Toma a = t y b = 3.', 'Los extremos son t³ y 3³ = 27.', 'Los términos centrales son 3t² · 3 = 9t² y 3t · 9 = 27t.', 'El desarrollo es t³ + 9t² + 27t + 27.'],
    'En el tercer término se eleva b al cuadrado antes de multiplicar.', 'Con t = 1, la suma de los cuatro términos da 64, igual a 4³.');
m(5, 85, 'Cociente de la diferencia de cuadrados', 'intermedio', 'Para u ≠ −8, simplifica (u² − 64)/(u + 8).',
    ['u − 8', 'u + 8', 'u² − 8', 'u − 64'],
    'Una diferencia de cuadrados puede expresarse como producto de dos factores conjugados.',
    ['Reconoce 64 = 8².', 'Factoriza u² − 64 = (u + 8)(u − 8).', 'Cancela el factor u + 8, que no es cero en el dominio dado.', 'El cociente es u − 8.'],
    'Cancelar un factor no elimina la restricción del denominador original.', 'Con u = 0, −64/8 = −8.');
m(6, 101, 'Factor común monomio', 'facil', '¿Cuál es la factorización de 15x³ + 10x² por su mayor factor común monomio?',
    ['5x²(3x + 2)', '5x(3x + 2)', '5x²(3x² + 2)', '10x²(3x + 1)'],
    'Un factor común divide cada término del polinomio.',
    ['Los coeficientes son 15 y 10; su mayor factor común es 5.', 'El menor exponente de x es 2.', 'Divide los términos entre 5x²: quedan 3x y 2.', 'La factorización es 5x²(3x + 2).'],
    'Conserva la x que queda al dividir x³ entre x².', 'Al distribuir 5x² recuperas 15x³ + 10x².');
m(7, 117, 'Ecuación lineal con una incógnita', 'facil', 'Resuelve 5x + 7 = 32.',
    ['x = 5', 'x = 7', 'x = 8', 'x = 25'],
    'Aplicar la misma operación a ambos miembros conserva la igualdad.',
    ['Identifica el término que contiene x: 5x.', 'Resta 7 a ambos miembros.', 'Queda 5x = 25. Divide entre 5.', 'La solución es x = 5.'],
    'No confundas el valor de 5x con el de x.', 'Sustituye: 5 · 5 + 7 = 32.');
m(8, 145, 'Inecuaciones cuadráticas', 'intermedio', '¿Para qué valores de x se cumple (x − 2)(x − 7) < 0?',
    ['2 < x < 7', 'x < 2 o x > 7', '2 ≤ x ≤ 7', 'x > 7'],
    'Un producto de dos factores es negativo cuando estos tienen signos opuestos.',
    ['Los puntos que anulan los factores son 2 y 7.', 'Para x < 2 ambos factores son negativos; para x > 7 ambos son positivos.', 'Entre 2 y 7 el primer factor es positivo y el segundo es negativo.', 'Se cumple 2 < x < 7, sin incluir los extremos.'],
    'En los extremos el producto es cero y la desigualdad es estricta.', 'Con x = 4 se obtiene 2 · (−3) = −6.');
m(9, 155, 'Logaritmo de un producto', 'intermedio', 'Calcula log₃(9 · 27).',
    ['5', '6', '8', '243'],
    'El logaritmo de un producto de factores positivos es la suma de sus logaritmos en la misma base.',
    ['Identifica 9 = 3² y 27 = 3³.', 'Separa log₃(9 · 27) en log₃(9) + log₃(27).', 'Suma los exponentes 2 + 3.', 'El logaritmo vale 5.'],
    'No multipliques los logaritmos individuales.', '9 · 27 = 243 y 3⁵ = 243.');
m(10, 179, 'Media aritmética', 'facil', '¿Cuál es la media de 5, 8, 11 y 12?',
    ['9', '8', '10', '36'],
    'La media aritmética se obtiene dividiendo la suma de los datos entre la cantidad de datos.',
    ['Hay cuatro observaciones.', 'Suma 5 + 8 + 11 + 12.', 'La suma es 36 y debe dividirse entre 4.', 'La media es 9.'],
    'La suma de los datos todavía no es la media.', 'Cuatro datos con media 9 suman 36.');

const f = (...row) => add('fisica', ...row);
f(1, 19, 'Factores de conversión', 'facil', '¿Cuántos metros son 2,35 km?',
    ['2 350 m', '235 m', '23 500 m', '0,00235 m'],
    'Un kilómetro equivale a mil metros.',
    ['El dato original es 2,35 km.', 'Multiplica por 1 000 m/km.', 'Al cancelar km, queda 2,35 · 1 000 m.', 'Obtienes 2 350 m.'],
    'Al convertir kilómetros en metros se multiplica por 1 000.', '2 350 m ÷ 1 000 = 2,35 km.');
f(2, 32, 'Magnitud a partir de componentes', 'facil', 'Un vector de fuerza tiene componentes perpendiculares de 9 N y 12 N. ¿Cuál es su magnitud?',
    ['15 N', '21 N', '3 N', '225 N'],
    'Las componentes perpendiculares son los catetos de un triángulo rectángulo.',
    ['Toma las componentes 9 N y 12 N.', 'La magnitud es la raíz de la suma de sus cuadrados.', 'Calcula 9² + 12² = 81 + 144 = 225.', 'La raíz es 15 N.'],
    'No sumes directamente componentes que son perpendiculares.', '15² = 225.');
f(3, 54, 'Movimiento rectilíneo uniforme', 'facil', 'Una bicicleta avanza en línea recta a 7 m/s durante 18 s. ¿Qué distancia recorre?',
    ['126 m', '25 m', '7 m', '180 m'],
    'Con velocidad constante y sin cambio de sentido, la distancia es rapidez por tiempo.',
    ['La rapidez es 7 m/s.', 'El intervalo es 18 s.', 'Multiplica 7 · 18 y cancela los segundos.', 'La distancia es 126 m.'],
    'No sumes la rapidez y el tiempo: tienen unidades distintas.', '126 m ÷ 18 s = 7 m/s.');
f(4, 79, 'Segunda ley de Newton', 'facil', 'Una fuerza neta de 36 N actúa sobre una caja de 8 kg. ¿Cuál es su aceleración?',
    ['4,5 m/s²', '0,22 m/s²', '28 m/s²', '288 m/s²'],
    'La segunda ley relaciona fuerza neta, masa y aceleración mediante F = m · a.',
    ['Identifica F = 36 N y m = 8 kg.', 'Despeja a = F/m.', 'Calcula 36 ÷ 8.', 'La aceleración es 4,5 m/s².'],
    'Para hallar aceleración, divide la fuerza neta entre la masa.', '8 kg · 4,5 m/s² = 36 N.');
f(5, 95, 'Energía cinética', 'facil', 'Una mochila de 3 kg se desplaza a 6 m/s. ¿Cuál es su energía cinética?',
    ['54 J', '9 J', '18 J', '108 J'],
    'La energía cinética de traslación se calcula con K = m · v²/2.',
    ['Identifica la masa de 3 kg y la rapidez de 6 m/s.', 'Eleva al cuadrado la rapidez: 6² = 36.', 'Multiplica 3 · 36 y divide entre 2.', 'La energía cinética es 54 J.'],
    'El cuadrado se aplica a la rapidez, no a la masa.', 'El doble de 54 J coincide con m · v² = 108 J.');
f(6, 116, 'Impulso y cantidad de movimiento', 'intermedio', 'Una fuerza neta constante de 14 N actúa durante 0,5 s en la dirección del movimiento. ¿Cuál es el cambio de cantidad de movimiento?',
    ['7 kg·m/s', '28 kg·m/s', '14,5 kg·m/s', '14 kg·m/s'],
    'El impulso de la fuerza neta es igual al cambio de cantidad de movimiento.',
    ['La fuerza neta es 14 N y actúa durante 0,5 s.', 'Para una fuerza constante, J = F · Δt.', 'El impulso es 14 · 0,5 = 7 N·s.', 'El cambio es 7 kg·m/s en el sentido de la fuerza.'],
    'No dividas la fuerza entre el tiempo; el impulso es su producto.', 'N·s equivale a kg·m/s.');
f(7, 134, 'Principio de Pascal', 'intermedio', 'En una prensa hidráulica ideal, un pistón de 4 cm² recibe 36 N. Si el otro tiene 20 cm² y está a la misma altura, ¿qué fuerza ejerce?',
    ['180 N', '7,2 N', '36 N', '720 N'],
    'En el modelo ideal, el aumento de presión se transmite por igual: F₁/A₁ = F₂/A₂.',
    ['Anota F₁ = 36 N, A₁ = 4 cm² y A₂ = 20 cm².', 'La razón de áreas es 20/4 = 5.', 'Multiplica la fuerza de entrada por 5.', 'La fuerza de salida es 180 N.'],
    'Se igualan las presiones, no las fuerzas cuando las áreas son diferentes.', '36/4 = 180/20 = 9 N/cm².');
f(8, 150, 'Dilatación lineal', 'intermedio', 'Una barra de 1,5 m tiene α = 0,00002 °C⁻¹. ¿Cuánto aumenta su longitud si se calienta 50 °C?',
    ['1,5 mm', '0,15 mm', '15 mm', '150 mm'],
    'La variación de longitud es ΔL = α · L₀ · ΔT.',
    ['La longitud inicial es 1,5 m y el aumento térmico es 50 °C.', 'Sustituye en ΔL: 0,00002 · 1,5 · 50.', 'El resultado es 0,0015 m.', 'Multiplica por 1 000 para obtener 1,5 mm.'],
    'Se pide el incremento, no la longitud final de la barra.', '1,5 mm equivale a 0,0015 m.');
f(9, 156, 'Calor específico', 'intermedio', '¿Cuánto calor absorben 80 g de una sustancia con c = 0,25 cal/(g·°C) al calentarse 12 °C sin cambiar de estado?',
    ['240 cal', '20 cal', '960 cal', '3 840 cal'],
    'Sin cambio de estado, el calor sensible se calcula como Q = m · c · ΔT.',
    ['Identifica 80 g, 0,25 cal/(g·°C) y 12 °C.', 'Multiplica 80 · 0,25 = 20 cal/°C.', 'Multiplica 20 · 12.', 'El calor absorbido es 240 cal.'],
    'Usa el aumento de temperatura, no la temperatura final.', '240 cal ÷ 12 °C = 20 cal/°C.');
f(10, 168, 'Longitud de onda', 'facil', 'En una representación espacial de una onda sonora, dos crestas consecutivas están separadas 0,75 m. ¿Cuál es la longitud de onda?',
    ['0,75 m', '1,5 m', '0,375 m', '0,75 s'],
    'La longitud de onda mide un ciclo espacial completo.',
    ['Las crestas consecutivas corresponden a puntos en el mismo estado de oscilación.', 'De una cresta a la siguiente transcurre un ciclo espacial.', 'La distancia indicada para ese ciclo es 0,75 m.', 'La longitud de onda es 0,75 m.'],
    'No confundas longitud de onda con período, que se mide en segundos.', 'El dato es una distancia, por eso se expresa en metros.');
f(11, 179, 'Ley de la reflexión', 'facil', 'Un rayo incide sobre un espejo plano con un ángulo de 37° medido desde la normal. ¿Cuál es el ángulo de reflexión medido desde la normal?',
    ['37°', '53°', '74°', '90°'],
    'En la reflexión sobre una superficie plana, los ángulos de incidencia y reflexión se miden desde la normal y son iguales.',
    ['El ángulo dado está medido desde la normal.', 'Aplica igualdad entre el ángulo incidente y el reflejado.', 'Sustituye el valor de incidencia de 37°.', 'El ángulo reflejado mide 37°.'],
    '53° es el complementario, medido desde la superficie.', 'Ambos rayos forman 37° con la normal.');
f(12, 198, 'Ley de Ohm', 'facil', 'Una resistencia de 15 Ω tiene una diferencia de potencial de 9 V. ¿Qué corriente circula?',
    ['0,6 A', '1,67 A', '6 A', '135 A'],
    'Para una resistencia óhmica, V = I · R.',
    ['Identifica V = 9 V y R = 15 Ω.', 'Despeja I = V/R.', 'Divide 9 entre 15.', 'La corriente es 0,6 A.'],
    'No inviertas la razón: para hallar la corriente se divide el voltaje entre la resistencia.', '0,6 A · 15 Ω = 9 V.');

const q = (...row) => add('quimica', ...row);
q(1, 15, 'División de la química', 'facil', 'Un laboratorio estudia compuestos de un mineral como el cloruro de sodio. ¿Con qué rama se relaciona directamente este estudio?',
    ['Química inorgánica', 'Química orgánica', 'Anatomía', 'Estadística'],
    'La guía distingue ramas de la química por el tipo de materia y problemas que estudian.',
    ['Identifica que el objeto del estudio es un compuesto de origen mineral.', 'Ubica el estudio de compuestos minerales en la clasificación de la guía.', 'El ejemplo se ajusta a la química inorgánica.', 'La rama correspondiente es química inorgánica.'],
    'La procedencia mineral del compuesto no lo convierte en un compuesto orgánico.', 'El cloruro de sodio es una sal inorgánica.');
q(2, 50, 'Clasificación de la materia', 'facil', 'Se disuelve azúcar por completo en agua y se observa una sola fase. ¿Cómo se clasifica el líquido?',
    ['Mezcla homogénea', 'Mezcla heterogénea', 'Elemento', 'Compuesto puro'],
    'Una mezcla homogénea presenta composición uniforme y una sola fase en el ejemplo.',
    ['Identifica dos componentes: agua y azúcar.', 'El azúcar se disolvió por completo.', 'La disolución tiene una sola fase uniforme.', 'Se trata de una mezcla homogénea.'],
    'Una sola fase no implica que solo haya una sustancia.', 'El sistema contiene dos componentes distribuidos uniformemente.');
q(3, 72, 'Número de masa y número atómico', 'facil', 'Un isótopo tiene número de masa A = 31 y número atómico Z = 15. ¿Cuántos neutrones tiene?',
    ['16', '15', '31', '46'],
    'El número de masa cuenta protones más neutrones y Z indica los protones.',
    ['Identifica A = 31 y Z = 15.', 'Usa número de neutrones = A − Z.', 'Resta 31 − 15.', 'El núcleo tiene 16 neutrones.'],
    'Z cuenta protones, no neutrones.', '15 protones + 16 neutrones = 31 nucleones.');
q(4, 98, 'Enlace iónico', 'facil', '¿Qué tipo de enlace explica la atracción entre los iones K⁺ y Br⁻ de una sal?',
    ['Iónico', 'Covalente no polar', 'Metálico', 'Puente de hidrógeno'],
    'El enlace iónico se basa en la atracción electrostática entre iones de carga opuesta.',
    ['K⁺ es un catión.', 'Br⁻ es un anión.', 'Los signos opuestos permiten la atracción electrostática.', 'La unión corresponde a un enlace iónico.'],
    'No confundas la atracción entre iones con la compartición de electrones de un enlace covalente.', 'Los signos + y − muestran que son iones de carga opuesta.');
q(5, 127, 'Óxidos metálicos y no metálicos', 'intermedio', 'En un óxido formado por Li⁺ y O²⁻, ¿qué fórmula representa una unidad eléctricamente neutra?',
    ['Li₂O', 'LiO', 'LiO₂', 'Li₂O₃'],
    'La fórmula de un compuesto iónico debe equilibrar la carga positiva y la negativa.',
    ['El litio aporta +1 por ion y el óxido aporta −2.', 'Busca el menor número de iones que haga que la suma de cargas sea cero.', 'Se necesitan dos Li⁺ por cada O²⁻.', 'La fórmula es Li₂O.'],
    'Los subíndices cuentan iones: no se copian los signos de las cargas.', '2 · (+1) + (−2) = 0.');
q(6, 150, 'Balanceo por tanteo', 'intermedio', 'Balancea Al + O₂ → Al₂O₃. ¿Qué coeficientes enteros mínimos corresponden a Al, O₂ y Al₂O₃, en ese orden?',
    ['4, 3, 2', '2, 3, 1', '4, 2, 3', '2, 1, 2'],
    'Balancear significa igualar la cantidad de átomos de cada elemento sin cambiar las fórmulas.',
    ['El oxígeno aparece de dos en dos en O₂ y de tres en tres en Al₂O₃.', 'El mínimo múltiplo común de 2 y 3 es 6.', 'Usa 3 O₂ y 2 Al₂O₃; el producto contiene 4 átomos de Al.', 'Coloca 4 Al. Los coeficientes son 4, 3 y 2.'],
    'Ajusta coeficientes delante de las fórmulas, no subíndices.', 'Hay 4 Al y 6 O a ambos lados.');
q(7, 184, 'Catalizadores', 'facil', 'Si se añade un catalizador adecuado y las demás condiciones se mantienen, ¿qué efecto se busca sobre una reacción?',
    ['Que aumente su velocidad', 'Que se detenga por completo', 'Que se reduzca su velocidad', 'Que desaparezcan los reactivos antes de mezclarlos'],
    'La guía distingue los catalizadores, que aceleran reacciones, de los inhibidores.',
    ['El enunciado especifica que se agrega un catalizador adecuado.', 'La propiedad que se está comparando es la velocidad de reacción.', 'Un catalizador favorece que la reacción ocurra más rápido.', 'Se busca aumentar su velocidad.'],
    'No confundas un catalizador con un inhibidor.', 'El efecto planteado se refiere a la rapidez, no al nombre de los reactivos.');
q(8, 200, 'Molaridad', 'intermedio', 'Una disolución de volumen final 400 mL contiene 0,18 mol de soluto. ¿Cuál es su molaridad?',
    ['0,45 mol/L', '0,072 mol/L', '0,18 mol/L', '4,5 mol/L'],
    'La molaridad es la cantidad de moles de soluto por litro de disolución.',
    ['Hay 0,18 mol de soluto.', 'Convierte 400 mL en 0,400 L.', 'Divide 0,18 mol entre 0,400 L.', 'La molaridad es 0,45 mol/L.'],
    'El denominador usa litros de disolución, no mililitros ni litros de solvente.', '0,45 mol/L · 0,400 L = 0,18 mol.');
q(9, 219, 'Escala de pH y pOH', 'intermedio', 'Para una disolución diluida con [H₃O⁺] = 1 × 10⁻⁵ mol/L, ¿cuál es el pH según la aproximación de la guía?',
    ['5', '−5', '9', '10'],
    'Para este ejercicio se usa pH = −log₁₀[H₃O⁺].',
    ['La concentración dada corresponde a H₃O⁺.', 'El logaritmo decimal de 10⁻⁵ es −5.', 'Aplica el signo menos de la definición del pH.', 'El pH es 5.'],
    'El signo menos de la definición cambia −5 a +5.', '10⁻ᵖᴴ = 10⁻⁵ para pH = 5.');
q(10, 242, 'Alcanos', 'facil', '¿Cuál es la fórmula molecular de un alcano acíclico de nueve carbonos?',
    ['C₉H₂₀', 'C₉H₁₈', 'C₉H₁₆', 'C₉H₂₂'],
    'La fórmula general de los alcanos de cadena abierta es CₙH₂ₙ₊₂.',
    ['El número de carbonos es n = 9.', 'Calcula 2n + 2 para el número de hidrógenos.', '2 · 9 + 2 = 20.', 'La fórmula es C₉H₂₀.'],
    'No olvides sumar dos después de duplicar el número de carbonos.', 'El subíndice de H es 20 cuando n = 9.');
q(11, 256, 'Alcoholes', 'facil', '¿Qué grupo funcional permite clasificar CH₃CH₂CH₂OH como un alcohol?',
    ['Hidroxilo (−OH)', 'Carboxilo (−COOH)', 'Amino (−NH₂)', 'Carbonilo (>C=O)'],
    'Los alcoholes tienen un grupo hidroxilo unido a un carbono saturado.',
    ['Observa el extremo CH₂OH de la fórmula.', 'Identifica el grupo −OH unido al carbono de ese extremo.', 'Ese grupo es hidroxilo.', 'El hidroxilo permite clasificar el compuesto como alcohol.'],
    'No confundas −OH con −COOH: el carboxilo contiene también un carbonilo.', 'En la fórmula no aparece un enlace doble C=O.');
q(12, 278, 'Péptidos y enlace peptídico', 'facil', 'Un péptido lineal está formado por tres aminoácidos. ¿Cuántos enlaces peptídicos unen sus residuos?',
    ['2', '1', '3', '4'],
    'Cada unión entre dos residuos adyacentes de un péptido lineal es un enlace peptídico.',
    ['Numera los tres residuos: 1, 2 y 3.', 'Identifica la unión entre 1 y 2.', 'Identifica la unión entre 2 y 3.', 'El tripéptido lineal tiene dos enlaces peptídicos.'],
    'El número de residuos no es igual al número de uniones.', 'La cadena se puede representar como 1—2—3: hay dos uniones.');

module.exports = questions;
