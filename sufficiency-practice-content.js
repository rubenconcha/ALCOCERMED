(function (root, factory) {
    const content = factory();
    if (typeof module === 'object' && module.exports) module.exports = content;
    else root.SufficiencyPracticeContent = content;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const reference = [
        {
            title: 'Prefijos del Sistema Internacional',
            rows: [
                ['exa (E)', '10¹⁸'], ['peta (P)', '10¹⁵'], ['tera (T)', '10¹²'], ['giga (G)', '10⁹'],
                ['mega (M)', '10⁶'], ['kilo (k)', '10³'], ['hecto (h)', '10²'], ['deca (da)', '10¹'],
                ['deci (d)', '10⁻¹'], ['centi (c)', '10⁻²'], ['mili (m)', '10⁻³'], ['micro (µ)', '10⁻⁶'],
                ['nano (n)', '10⁻⁹'], ['pico (p)', '10⁻¹²'], ['femto (f)', '10⁻¹⁵'], ['atto (a)', '10⁻¹⁸'],
            ],
            columns: ['Prefijo y símbolo', 'Factor'],
        },
        {
            title: 'Magnitudes y unidades',
            rows: [
                ['Longitud', 'metro (m)'], ['Masa', 'kilogramo (kg)'], ['Tiempo', 'segundo (s)'],
                ['Temperatura termodinámica', 'kelvin (K)'], ['Corriente eléctrica', 'amperio (A)'],
                ['Intensidad luminosa', 'candela (cd)'], ['Cantidad de sustancia', 'mol (mol)'],
                ['Ángulo plano', 'radián (rad)'], ['Ángulo sólido', 'estereorradián (sr)'],
                ['1 vuelta', '360° = 2π rad'],
            ],
            columns: ['Magnitud o unidad', 'Unidad o equivalencia'],
        },
        {
            title: 'Longitud y superficie',
            rows: [
                ['1 km', '1 000 m'], ['1 m', '100 cm = 1 000 mm'], ['1 cm', '10 mm'],
                ['1 pulgada (in)', '2,54 cm'], ['1 pie (ft)', '12 in = 30,48 cm'], ['1 yarda (yd)', '3 ft = 91,44 cm'],
                ['1 milla terrestre', '5 280 ft = 1,609344 km'], ['1 milla náutica', '1,852 km'],
                ['1 año luz', '≈ 9,461 × 10¹⁵ m'], ['1 pársec', '≈ 3,086 × 10¹⁶ m'],
                ['1 µm', '10⁻⁶ m = 10⁻³ mm'], ['1 Å', '10⁻¹⁰ m = 0,1 nm'], ['1 mil (milésima de pulgada)', '0,001 in = 0,0254 mm'],
                ['1 m²', '10 000 cm²'], ['1 ft²', '144 in²'], ['1 hectárea', '10 000 m² ≈ 2,471 acres'],
                ['1 acre', '43 560 ft² ≈ 4 047 m²'],
            ],
        },
        {
            title: 'Masa',
            rows: [
                ['1 kg', '1 000 g ≈ 2,20462 lb'], ['1 g', '1 000 mg'], ['1 mg', '1 000 µg'],
                ['1 libra (lb)', '453,59237 g'], ['1 onza (oz)', '≈ 28,3495 g'], ['1 onza troy', '≈ 31,1035 g'],
                ['1 tonelada métrica', '1 000 kg'], ['1 tonelada larga', '2 240 lb'], ['1 tonelada corta', '2 000 lb'],
                ['1 slug', '≈ 14,59 kg'], ['1 quintal de 100 lb', '4 arrobas de 25 lb'],
            ],
        },
        {
            title: 'Volumen y tiempo',
            rows: [
                ['1 mL', '1 cm³ = 1 000 µL'], ['1 L', '1 000 mL = 1 dm³'], ['1 m³', '1 000 L'],
                ['1 ft³', '≈ 28,317 L'], ['1 galón líquido de EE. UU.', '≈ 3,785 L'], ['1 galón imperial', '≈ 4,546 L'],
                ['1 barril de petróleo', '42 galones de EE. UU. ≈ 159 L'], ['1 pinta líquida de EE. UU.', '≈ 0,473 L'],
                ['1 min', '60 s'], ['1 h', '60 min = 3 600 s'], ['1 día', '24 h = 1 440 min'],
            ],
        },
        {
            title: 'Fuerza y energía',
            rows: [
                ['1 N', '1 kg·m/s² = 10⁵ dinas ≈ 0,2248 lbf'], ['1 dina', '1 g·cm/s² = 10⁻⁵ N'],
                ['1 lbf', '≈ 4,448 N'], ['1 kgf', '9,80665 N ≈ 2,205 lbf'], ['1 poundal', '≈ 0,1383 N'],
                ['1 J', '1 N·m = 10⁷ erg'], ['1 erg', '10⁻⁷ J'], ['1 cal a 15 °C', '≈ 4,186 J'],
                ['1 BTU (tabla internacional)', '≈ 1 055 J'], ['1 ft·lbf', '≈ 1,356 J'],
                ['1 kWh', '3,6 × 10⁶ J'], ['1 eV', '≈ 1,602 × 10⁻¹⁹ J'],
            ],
        },
        {
            title: 'Potencia, presión y viscosidad',
            rows: [
                ['1 W', '1 J/s'], ['1 kW', '1 000 W'], ['1 hp mecánico', '≈ 746 W'],
                ['1 CV', '≈ 735,5 W'], ['1 BTU/h (tabla internacional)', '≈ 0,293 W'],
                ['1 Pa', '1 N/m²'], ['1 bar', '100 000 Pa'], ['1 atm', '101 325 Pa = 760 Torr'],
                ['1 psi', '1 lbf/in² ≈ 6 895 Pa'], ['1 ksi', '1 000 psi'],
                ['1 Torr', '≈ 133,322 Pa'], ['1 mmHg', '≈ 133,322 Pa'], ['1 kgf/cm²', '≈ 98 066,5 Pa'],
                ['1 poise (P)', '1 g/(cm·s) = 0,1 Pa·s'],
            ],
        },
        {
            title: 'Temperatura',
            rows: [
                ['De °F a °C', '(°F − 32) × 5/9'], ['De °C a °F', '(°C × 9/5) + 32'],
                ['De °C a K', '°C + 273,15'], ['De °F a °R (Rankine)', '°F + 459,67'],
                ['Una diferencia de 1 °C', 'Una diferencia de 1 K'],
            ],
            columns: ['Conversión', 'Operación o equivalencia'],
        },
    ];

    const exercises = [];
    const add = (id, subject, kind, title, route, context, questions) =>
        exercises.push({ id, subject, kind, title, route, context, questions });
    const q = (prompt, unit, answer, decimals, support) => ({ prompt, unit, answer, decimals, ...support });
    const guide = (data, hint, steps, check) => ({ data, hint, steps, check });
    const number = value => new Intl.NumberFormat('es-BO', { maximumFractionDigits: 9 })
        .formatToParts(value).map(part => part.type === 'group' ? ' ' : part.value).join('');
    const kg = pounds => pounds * .4536;
    const cm = (feet, inches) => (12 * feet + inches) * 2.54;
    const celsius = degrees => (degrees - 32) * 5 / 9;
    const area = (weight, height) => Math.sqrt(height * weight / 3600);

    function poundsGuide(pounds) {
        const weight = number(pounds);
        const mass = number(kg(pounds));
        return guide(
            ['Masa de la ficha · ' + weight + ' lb', 'Factor del caso · 0,4536 kg por cada lb'],
            'Pon las libras abajo en el factor para que se cancelen con las de la ficha.',
            [
                'Escribe el factor como 0,4536 kg/lb.',
                weight + ' lb × (0,4536 kg/lb) = ' + mass + ' kg. Conserva esta cifra para las siguientes preguntas.',
            ],
            'Cada libra equivale a menos de 1 kg en el caso. El número en kilogramos tiene que ser menor que ' + weight + '.'
        );
    }

    function mixedMassGuide(pounds, ounces) {
        const lb = number(pounds * 453.592);
        const oz = number(ounces * 28.3495);
        const sum = pounds * 453.592 + ounces * 28.3495;
        return guide(
            ['Masa de la ficha · ' + pounds + ' lb y ' + ounces + ' oz', '1 lb = 453,592 g · 1 oz = 28,3495 g · 1 kg = 1 000 g'],
            'Para sumar las dos partes de la masa, exprésalas primero en la misma unidad.',
            [
                pounds + ' lb × 453,592 g/lb = ' + lb + ' g.',
                ounces + ' oz × 28,3495 g/oz = ' + oz + ' g.',
                lb + ' g + ' + oz + ' g = ' + number(sum) + ' g.',
                number(sum) + ' g ÷ (1 000 g/kg) = ' + number(sum / 1000) + ' kg. Redondea solo al escribir tu respuesta.',
            ],
            'Antes de redondear, multiplica los kilogramos por 1 000. Debes recuperar la suma en gramos.'
        );
    }

    function feetGuide(feet, inches) {
        const total = 12 * feet + inches;
        return guide(
            ['Longitud de la ficha · ' + feet + ' ft y ' + inches + ' in', '1 ft = 12 in · 1 in = 2,54 cm'],
            'Pasa los pies a pulgadas para poder sumar las dos partes. Luego cambia toda la longitud a centímetros.',
            [
                feet + ' ft × 12 in/ft = ' + (12 * feet) + ' in.',
                12 * feet + ' in + ' + inches + ' in = ' + total + ' in.',
                total + ' in × 2,54 cm/in = ' + number(cm(feet, inches)) + ' cm.',
            ],
            'Si divides los centímetros obtenidos entre 2,54, recuperas las ' + total + ' pulgadas totales.'
        );
    }

    function fahrenheitGuide(degrees) {
        const initial = number(degrees);
        return guide(
            ['Temperatura de partida · ' + initial + ' °F', 'Conversión de la tabla · °C = (°F − 32) × 5/9'],
            'Primero resta 32 para ajustar el punto de partida de las dos escalas. Luego aplica el factor 5/9.',
            [
                initial + ' − 32 = ' + number(degrees - 32) + '.',
                number(degrees - 32) + ' × 5/9 = ' + number(celsius(degrees)) + ' °C.',
            ],
            'Haz la conversión inversa. Multiplica los grados Celsius por 9/5 y suma 32 para recuperar los ' + initial + ' °F.'
        );
    }

    function surfaceGuide(pounds, feet, inches, decimals) {
        const mass = kg(pounds);
        const height = cm(feet, inches);
        const product = mass * height;
        const index = area(mass, height);
        return guide(
            ['Masa y altura de las preguntas 1 y 2, antes de redondear', 'Fórmula del caso · S = √(masa en kg × altura en cm ÷ 3 600)'],
            'Completa primero el cálculo dentro de la raíz. La fórmula pide kilogramos y centímetros.',
            [
                'Sustituye la masa de ' + number(mass) + ' kg y la altura de ' + number(height) + ' cm.',
                number(mass) + ' × ' + number(height) + ' ÷ 3 600 ≈ ' + number(product / 3600) + '.',
                'Aplica la raíz cuadrada. S ≈ ' + number(index) + ' m². Escribe el resultado con ' + decimals + ' decimales.',
            ],
            'Si elevas S al cuadrado antes de redondear, recuperas el cociente que quedó dentro de la raíz.'
        );
    }

    add('conversiones-rapidas', 'Física', 'Conversiones', 'Conversiones rápidas',
        'Practica seis conversiones independientes. En cada una, decide qué unidad debe quedar antes de calcular.',
        'Seis mediciones independientes. Usa 1 h = 60 min, 1 mL = 1 cm³ y 1 lb ≈ 0,4536 kg para estos ejercicios.', [
        q('Un modelo asigna 500 µg por kilogramo y por minuto a una muestra de 6,5 kg. ¿Cuántos gramos corresponden a una hora?', 'g', 500 * 6.5 * 60 / 1e6, 3, guide(
            ['500 µg por kg y por min', 'Masa de la muestra · 6,5 kg', '1 h = 60 min · 1 g = 1 000 000 µg'],
            'Primero averigua cuántos microgramos corresponden a toda la muestra en un minuto. Después pasa de un minuto a una hora.',
            ['500 µg/(kg·min) × 6,5 kg = 3 250 µg/min.', '3 250 µg/min × 60 min = 195 000 µg.', '195 000 µg ÷ (1 000 000 µg/g) = 0,195 g.'],
            'Al multiplicar se cancelan los kg y luego los min. La última conversión deja únicamente gramos.'
        )),
        q('Una solución homogénea contiene 500 mg de soluto en 250 mL. ¿Cuántos gramos hay en una alícuota de 12,5 mL?', 'g', 500 / 250 * 12.5 / 1000, 3, guide(
            ['500 mg en 250 mL de solución', 'Porción que se extrae · 12,5 mL', '1 g = 1 000 mg'],
            'Como la mezcla es homogénea, primero calcula cuántos miligramos hay en cada mililitro.',
            ['500 mg ÷ 250 mL = 2 mg/mL.', '2 mg/mL × 12,5 mL = 25 mg.', '25 mg ÷ (1 000 mg/g) = 0,025 g.'],
            '12,5 mL son la vigésima parte de 250 mL. Por eso la porción contiene la vigésima parte de 500 mg.'
        )),
        q('Un equipo de simulación entrega gas a 4 L/min durante seis horas. ¿Qué volumen pasa en ese tiempo?', 'cm³', 4 * 60 * 6 * 1000, 0, guide(
            ['Caudal · 4 L/min', 'Duración · 6 h', '1 h = 60 min · 1 L = 1 000 cm³'],
            'La tasa está por minuto. Expresa primero el tiempo en minutos para que esas unidades se cancelen.',
            ['6 h × 60 min/h = 360 min.', '4 L/min × 360 min = 1 440 L.', '1 440 L × 1 000 cm³/L = 1 440 000 cm³.'],
            'Cada hora pasan 240 L. Seis horas deben dar 1 440 L antes de convertir.'
        )),
        q('Una muestra de 175 lb se procesa con 10 mg de marcador por cada 500 g de masa. ¿Cuántos gramos de marcador corresponden al modelo?', 'g', kg(175) * 1000 / 500 * 10 / 1000, 4, guide(
            ['Masa de la muestra · 175 lb', '0,4536 kg por lb', '10 mg de marcador por 500 g de muestra'],
            'Expresa la masa en gramos para saber cuántas porciones de 500 g equivalen a la muestra.',
            ['175 lb × 0,4536 kg/lb = 79,38 kg = 79 380 g.', '79 380 g ÷ 500 g = 158,76 porciones equivalentes.', '158,76 × 10 mg = 1 587,6 mg. Al dividir por 1 000 mg/g se obtienen 1,5876 g.'],
            'Por cada kilogramo se usan dos porciones de 500 g, equivalentes a 20 mg. Multiplicar 79,38 × 20 recupera los miligramos.'
        )),
        q('Un tubo recoge 0,5 mL por minuto. ¿Cuántos litros reúne en 24 horas?', 'L', .5 * 24 * 60 / 1000, 2, guide(
            ['Caudal · 0,5 mL/min', 'Duración · 24 h', '1 L = 1 000 mL'],
            'Multiplica la cantidad de cada minuto por el número de minutos del día.',
            ['24 h × 60 min/h = 1 440 min.', '0,5 mL/min × 1 440 min = 720 mL.', '720 mL ÷ (1 000 mL/L) = 0,72 L.'],
            'En una hora se recogen 30 mL. Multiplica por 24 y compara con el total en mL.'
        )),
        q('Un microconducto transporta 150 µL/s. ¿Cuál es el caudal en centímetros cúbicos por hora?', 'cm³/h', 150 * 3600 / 1000, 0, guide(
            ['Caudal · 150 µL/s', '1 h = 3 600 s · 1 mL = 1 000 µL · 1 mL = 1 cm³'],
            'Calcula lo que pasa en los 3 600 segundos de una hora. Después cambia la unidad de volumen.',
            ['150 µL/s × 3 600 s/h = 540 000 µL/h.', '540 000 µL/h ÷ (1 000 µL/mL) = 540 mL/h.', 'Cambia mL por cm³ usando la equivalencia 1 a 1. Obtienes 540 cm³/h.'],
            'Los segundos se cancelan en el primer paso y las horas quedan en el denominador.'
        )),
    ]);

    add('factores-si', 'Física', 'Conversiones', 'Factores de conversión del SI',
        'Usa una equivalencia a la vez. Presta atención a la unidad que se cancela y a los casos de superficie o temperatura.',
        'Consulta la tabla de referencia. Fíjate en el exponente de la unidad y en el significado de cada prefijo.', [
        q('¿A cuántos miligramos equivalen 240 µg?', 'mg', 240 / 1000, 3, guide(
            ['Cantidad · 240 µg', '1 mg = 1 000 µg'],
            'Un miligramo reúne 1 000 microgramos. Busca cuántos grupos de 1 000 hay en 240.',
            ['Escribe el factor como 1 mg / 1 000 µg.', '240 µg × (1 mg / 1 000 µg) = 0,240 mg.'],
            'El número debe ser menor que 1 porque hay menos de 1 000 µg.'
        )),
        q('¿A cuántos centímetros equivalen 15 pulgadas?', 'cm', 15 * 2.54, 1, guide(
            ['Longitud · 15 in', '1 in = 2,54 cm'],
            'Multiplica por un factor que deje centímetros arriba y pulgadas abajo.',
            ['Escribe la equivalencia como 2,54 cm/in.', '15 in × 2,54 cm/in = 38,1 cm.'],
            'Al dividir 38,1 cm por 2,54 cm/in recuperas las 15 pulgadas.'
        )),
        q('¿A cuántos centímetros cuadrados equivalen 0,36 m²?', 'cm²', .36 * 100 ** 2, 0, guide(
            ['Superficie · 0,36 m²', 'Longitud · 1 m = 100 cm'],
            'Una superficie tiene dos dimensiones. Convierte cada una con el mismo factor.',
            ['(1 m)² = (100 cm)² = 10 000 cm².', '0,36 m² × (10 000 cm²/m²) = 3 600 cm².'],
            'Usar solo 100 convertiría una longitud. El exponente 2 debe aparecer también en el factor.'
        )),
        q('¿A cuántos pies cuadrados equivale un acre?', 'ft²', 43560, 0, guide(
            ['Superficie · 1 acre', 'Equivalencia en la tabla de longitud y superficie'],
            'Ubica la fila del acre y elige la equivalencia expresada en pies cuadrados.',
            ['Busca «1 acre» en la tabla. La equivalencia que usa ft² es 43 560 ft² por acre.', '1 acre × 43 560 ft²/acre = 43 560 ft².'],
            'La otra equivalencia de la tabla está en m². La unidad solicitada aquí es ft².'
        )),
        q('¿A cuántos ergios equivalen 2,5 J?', 'erg', 2.5 * 1e7, 0, guide(
            ['Energía · 2,5 J', '1 J = 10⁷ erg'],
            'Cada joule corresponde a diez millones de ergios. Multiplica por ese factor.',
            ['Escribe el factor como 10 000 000 erg/J.', '2,5 J × 10 000 000 erg/J = 25 000 000 erg.'],
            'Divide la cifra en ergios por 10⁷. Debe volver a 2,5 J.'
        )),
        q('¿Cuántos pascales corresponden a 0,75 bar?', 'Pa', .75 * 1e5, 0, guide(
            ['Presión · 0,75 bar', '1 bar = 100 000 Pa'],
            '0,75 bar representa tres cuartos de la presión de un bar.',
            ['Plantea 0,75 bar × 100 000 Pa/bar.', 'Multiplica 0,75 × 100 000. Los bar se cancelan y quedan 75 000 Pa.'],
            '75 000 Pa es menor que 100 000 Pa, como corresponde a una fracción de un bar.'
        )),
        q('Una cámara registra 25 °C. ¿Cuál es su temperatura en kelvin?', 'K', 25 + 273.15, 2, guide(
            ['Temperatura · 25 °C', 'Conversión de la tabla · K = °C + 273,15'],
            'Aquí cambia el punto de partida de la escala. Usa una suma.',
            ['Sustituye 25 en la expresión K = °C + 273,15.', '25 + 273,15 = 298,15 K.'],
            'Al restar 273,15 al resultado recuperas los 25 °C.'
        )),
        q('¿Cuántos vatios representan 0,48 kW?', 'W', .48 * 1000, 0, guide(
            ['Potencia · 0,48 kW', '1 kW = 1 000 W'],
            'El prefijo kilo indica 1 000 unidades. Cada kW aporta 1 000 W.',
            ['Escribe el factor como 1 000 W/kW.', '0,48 kW × 1 000 W/kW = 480 W.'],
            '0,48 kW es un poco menos de medio kilovatio. El resultado debe quedar un poco por debajo de 500 W.'
        )),
    ]);

    const smallMass = (2 * 453.592 + 3 * 28.3495) / 1000;
    const volumeInVials = smallMass * 100 / 25;
    add('medicion-neonatal', 'Matemáticas', 'Casos aplicados', 'Medición neonatal y reparto en recipientes',
        'Convierte las medidas. Usa la masa para calcular el marcador, su volumen y los recipientes. Resuelve la temperatura por separado.',
        'Una ficha de simulación registra 2 lb 3 oz y 14,5 in. Para la práctica usa 1 lb = 453,592 g, 1 oz = 28,3495 g y 1 in = 2,54 cm. El modelo asigna 100 mg de marcador por kg. La solución contiene 25 mg/mL y cada recipiente admite 1,5 mL.', [
        q('¿Cuál es la masa registrada en kilogramos?', 'kg', smallMass, 4, mixedMassGuide(2, 3)),
        q('¿Cuánto mide la longitud en centímetros?', 'cm', 14.5 * 2.54, 2, guide(
            ['Longitud de la ficha · 14,5 in', '1 in = 2,54 cm'],
            'Multiplica por los centímetros que corresponden a una pulgada.',
            ['Escribe el factor como 2,54 cm/in.', '14,5 in × 2,54 cm/in = 36,83 cm.'],
            'Divide 36,83 cm por 2,54 cm/in. Debes obtener 14,5 in.'
        )),
        q('¿Qué masa de marcador corresponde al modelo?', 'mg', smallMass * 100, 2, guide(
            ['Masa obtenida en la pregunta 1, antes de redondear', 'Regla del modelo · 100 mg de marcador por cada kg'],
            'La regla dice cuántos miligramos corresponden a un kilogramo. Multiplícala por la masa total en kg.',
            ['Recupera 0,9922325 kg de la primera pregunta.', '0,9922325 kg × 100 mg/kg = 99,22325 mg. Redondea a 2 decimales al responder.'],
            'Como la masa es un poco menor que 1 kg, el resultado debe quedar un poco por debajo de 100 mg.'
        )),
        q('¿Cuánto volumen contiene esa masa de marcador?', 'mL', volumeInVials, 3, guide(
            ['Cantidad de marcador de la pregunta 3, sin redondear', 'Concentración · 25 mg en cada mL'],
            'Piensa cuántos grupos de 25 mg hay en la cantidad requerida. Cada grupo ocupa 1 mL.',
            ['Plantea volumen = cantidad de marcador ÷ concentración.', '99,22325 mg ÷ (25 mg/mL) = 3,96893 mL. Los mg se cancelan.'],
            'Antes de redondear, multiplica el volumen por 25 mg/mL. Debe recuperarse la masa de marcador.'
        )),
        q('¿Cuántos recipientes de 1,5 mL se necesitan para alcanzar ese volumen?', 'recipientes', Math.ceil(volumeInVials / 1.5), 0, guide(
            ['Volumen de la pregunta 4, antes de redondear', 'Capacidad · 1,5 mL por recipiente'],
            'Compara la capacidad de dos recipientes con la de tres. Necesitas el menor número entero que alcance.',
            ['3,96893 mL ÷ (1,5 mL por recipiente) ≈ 2,65 recipientes.', 'Como dos no alcanzan, sube al siguiente entero. Se necesitan 3 recipientes.'],
            'Dos recipientes contienen 3 mL y tres contienen 4,5 mL. El volumen pedido queda entre esas capacidades.'
        )),
        q('Una vez consumidos los dos primeros recipientes, ¿qué porcentaje del tercero queda sin usar?', '%', (4.5 - volumeInVials) / 1.5 * 100, 1, guide(
            ['Volumen requerido de la pregunta 4', 'Capacidad del tercero · 1,5 mL', 'Los dos primeros aportan 3 mL'],
            'El porcentaje se refiere solo al tercer recipiente. Toma su capacidad como el 100 %.',
            ['Del tercero se usan 3,96893 mL − 3 mL = 0,96893 mL.', 'En el tercero quedan 1,5 mL − 0,96893 mL = 0,53107 mL.', '(0,53107 mL ÷ 1,5 mL) × 100 ≈ 35,4047 %.'],
            'La mitad del tercer recipiente serían 0,75 mL. Como sobra menos, el porcentaje debe ser menor que 50 %.'
        )),
        q('Una cámara de ensayo está a 72 °F. ¿Cuántos grados Celsius debe subir para alcanzar 37 °C?', '°C', 37 - celsius(72), 1, guide(
            ['Temperatura inicial · 72 °F', 'Meta · 37 °C', 'Conversión · °C = (°F − 32) × 5/9'],
            'Para restar dos temperaturas, exprésalas primero en la misma escala.',
            ['(72 − 32) × 5/9 = 200/9 °C ≈ 22,2222 °C.', 'Calcula el aumento con el valor sin redondear. 37 − 200/9 = 133/9 °C ≈ 14,7778 °C.'],
            'Si sumas el aumento sin redondear a la temperatura inicial en °C, recuperas la meta de 37 °C.'
        )),
    ]);

    const area62 = area(kg(62), cm(4, 3));
    const marker62 = Math.min(area62 * 1.5, 2);
    add('superficie-limite', 'Matemáticas', 'Casos aplicados', 'Superficie calculada y límite del modelo',
        'Convierte la masa y la estatura. Luego calcula la superficie y compara la cantidad obtenida con el límite del ejercicio.',
        'Una ficha simulada registra 62 lb y 4 ft 3 in. Usa 0,4536 kg/lb y 2,54 cm/in. El índice de superficie S se calcula como √(masa en kg × altura en cm ÷ 3 600). Un marcador se calcula a 1,5 mg por m², con un máximo de 2 mg. La solución contiene 1 mg/mL.', [
        q('¿Cuál es la masa en kilogramos?', 'kg', kg(62), 2, poundsGuide(62)),
        q('¿Cuál es la altura en centímetros?', 'cm', cm(4, 3), 2, feetGuide(4, 3)),
        q('¿Cuál es el índice de superficie S?', 'm²', area62, 3, surfaceGuide(62, 4, 3, 3)),
        q('¿Cuántos miligramos de marcador determina el modelo con el límite indicado?', 'mg', marker62, 3, guide(
            ['Superficie de la pregunta 3, sin redondear', 'Cantidad del modelo 1,5 mg/m²', 'Límite de 2 mg'],
            'Calcula la cantidad para esa superficie y compárala con el máximo permitido por el modelo.',
            ['Multiplica la superficie por 1,5 mg/m². Al cancelar m² quedan mg.', 'Con los valores sin redondear, 1,005965… × 1,5 ≈ 1,508948 mg.', 'Como 1,508948 mg es menor que 2 mg, usa la cantidad calculada.'],
            'Dividir la cantidad calculada por la superficie devuelve 1,5 mg/m².'
        )),
        q('¿Qué volumen de solución corresponde al marcador calculado?', 'µL', marker62 * 1000, 0, guide(
            ['Cantidad de la pregunta 4, sin redondear', 'Concentración de 1 mg/mL', '1 mL equivale a 1 000 µL'],
            'Averigua primero cuántos mililitros contienen esa cantidad y después cambia de unidad.',
            ['Divide 1,508948… mg entre 1 mg/mL. Los mg se cancelan y quedan aproximadamente 1,508948 mL.', 'Multiplica por 1 000 µL/mL para obtener aproximadamente 1 508,948 µL y redondea a la unidad.'],
            'Si divides los microlitros sin redondear entre 1 000, recuperas el volumen en mL.'
        )),
        q('Si la masa registrada aumenta a 67 lb y la altura se conserva, ¿cuánto aumenta S?', 'm²', area(kg(67), cm(4, 3)) - area62, 3, guide(
            ['Nueva masa de 67 lb', '1 lb equivale a 0,4536 kg', 'Misma estatura de la pregunta 2', 'Superficie inicial de la pregunta 3'],
            'Calcula otra vez la superficie con la nueva masa y resta la superficie inicial.',
            ['Convierte la masa nueva: 67 × 0,4536 = 30,3912 kg. La estatura sigue siendo 129,54 cm.', 'Con la fórmula del caso, calcula √(129,54 × 30,3912 ÷ 3 600) ≈ 1,045742 m².', 'Resta las superficies sin redondear: 1,045742… − 1,005965… ≈ 0,039777 m².'],
            'La altura se mantiene y la masa aumenta. La diferencia de superficie debe ser positiva.'
        )),
    ]);

    const volume198 = kg(198) * 70;
    add('volumen-porcentaje', 'Matemáticas', 'Casos aplicados', 'Volumen estimado, porcentajes y tiempo',
        'Calcula el volumen del modelo y toma el porcentaje pedido. Después trabaja con la temperatura y suma los tres volúmenes de forma independiente.',
        'En un modelo de circulación se registran 198 lb. El volumen se estima en 70 mL por kg y el ejercicio considera una pérdida del 35 %. Usa 0,4536 kg/lb. Para el ensayo térmico, la temperatura pasa de 95 °F a 37 °C a un ritmo de 0,5 °C/min.', [
        q('¿A cuántos kilogramos equivalen 198 lb?', 'kg', kg(198), 2, poundsGuide(198)),
        q('¿Cuál es el volumen total estimado en litros?', 'L', volume198 / 1000, 2, guide(
            ['Masa en kg de la pregunta 1', 'Factor del modelo de 70 mL/kg', '1 L equivale a 1 000 mL'],
            'Multiplica para hallar el volumen en mL y luego exprésalo en litros.',
            ['Multiplica 89,8128 kg × 70 mL/kg = 6 286,896 mL. Los kg se cancelan.', 'Divide 6 286,896 mL entre 1 000 mL/L para obtener 6,286896 L. Redondea al final.'],
            'El total supera 6 000 mL y queda por debajo de 7 000 mL, así que debe estar entre 6 y 7 L.'
        )),
        q('¿Qué volumen en mL corresponde al 35 %?', 'mL', volume198 * .35, 2, guide(
            ['Volumen total de la pregunta 2, sin redondear', 'Porcentaje solicitado de 35 %'],
            'Usa el volumen total en mL y calcula solamente la fracción solicitada.',
            ['Divide 35 entre 100: 35 % = 0,35.', 'Multiplica 6 286,896 mL × 0,35 = 2 200,4136 mL. Redondea a dos decimales.'],
            'Como el porcentaje es menor que 50 %, el resultado tiene que ser menor que la mitad del total.'
        )),
        q('¿Qué temperatura en Celsius representa 95 °F?', '°C', celsius(95), 1, fahrenheitGuide(95)),
        q('¿Qué aumento de temperatura se necesita para llegar a 37 °C?', '°C', 37 - celsius(95), 1, guide(
            ['Temperatura en °C de la pregunta 4', 'Meta del modelo de 37 °C'],
            'Resta la temperatura actual de la meta para obtener la diferencia.',
            ['Toma la meta de 37 °C y la temperatura obtenida de 35 °C.', 'Calcula 37 − 35 = 2 °C.'],
            'Suma la diferencia a la temperatura inicial: 35 + 2 = 37 °C.'
        )),
        q('¿En cuánto tiempo se alcanza el valor final?', 'min', (37 - celsius(95)) / .5, 1, guide(
            ['Diferencia de temperatura de la pregunta 5', 'Incremento del modelo de 0,5 °C por minuto'],
            'Divide el incremento que falta por lo que se gana en un minuto.',
            ['Usa el incremento pendiente de 2 °C.', 'Divide 2 °C entre 0,5 °C/min. Los grados se cancelan y resultan 4 min.'],
            'En 4 minutos el aumento sería 4 × 0,5 °C = 2 °C.'
        )),
        q('Una mezcla de ensayo usa un recipiente de 275 mL, uno de 300 mL y uno de 350 mL. ¿Qué volumen total tienen los tres?', 'mL', 275 + 300 + 350, 0, guide(
            ['Volúmenes de 275 mL, 300 mL y 350 mL'],
            'Los tres datos están en la misma unidad y se pueden sumar directamente.',
            ['Suma los dos primeros volúmenes: 275 + 300 = 575 mL.', 'Añade el último: 575 + 350 = 925 mL.'],
            'Si restas 350 mL del total, recuperas los 575 mL de los dos primeros.'
        )),
    ]);

    const mass1lb10oz = (453.592 + 10 * 28.3495) / 1000;
    const nutrientMass = mass1lb10oz * 3.5;
    const nutrientVolume = nutrientMass / (10 / 100);
    add('concentracion-aminoacidos', 'Química', 'Casos aplicados', 'Solución de aminoácidos al 10 %',
        'Pasa la masa a kilogramos y úsala para calcular la cantidad del caso, el volumen y el caudal. Resuelve la temperatura por separado.',
        'En un modelo de laboratorio se registra 1 lb 10 oz. Usa 453,592 g/lb y 28,3495 g/oz. El ensayo asigna 3,5 g por kg al día. La solución contiene 10 g de aminoácidos por cada 100 mL. El líquido parte de 96,8 °F y el equipo tiene una meta de 37 °C.', [
        q('¿Cuántos kilogramos corresponden a 1 lb 10 oz?', 'kg', mass1lb10oz, 4, mixedMassGuide(1, 10)),
        q('¿Cuántos gramos de aminoácidos corresponden a las 24 horas del modelo?', 'g', nutrientMass, 3, guide(
            ['Masa en kg de la pregunta 1', 'Cantidad del modelo de 3,5 g/(kg·día)', 'Periodo de 1 día'],
            'Multiplica por la masa y por el periodo pedido. Fíjate en qué unidades se cancelan.',
            ['Multiplica 0,737087 kg × 3,5 g/(kg·día) = 2,5798045 g/día.', 'Multiplica por 1 día para obtener 2,5798045 g. Redondea a tres decimales.'],
            'El caso usa una masa menor que 1 kg, por lo que la cantidad diaria debe ser menor que 3,5 g.'
        )),
        q('¿Qué volumen de solución contiene la cantidad calculada?', 'mL', nutrientVolume, 2, guide(
            ['Cantidad de la pregunta 2, sin redondear', 'La solución del caso contiene 10 g en 100 mL'],
            'Calcula primero cuántos gramos hay por mililitro. Usa esa concentración para encontrar el volumen.',
            ['Divide 10 g entre 100 mL: la concentración es 0,1 g/mL.', 'Divide 2,5798045 g entre 0,1 g/mL. Los gramos se cancelan y quedan 25,798045 mL.'],
            'Multiplica el volumen por 0,1 g/mL para recuperar los 2,5798045 g.'
        )),
        q('Si el volumen se distribuye de forma uniforme en 24 horas, ¿cuál es su caudal?', 'µL/h', nutrientVolume * 1000 / 24, 0, guide(
            ['Volumen de la pregunta 3, sin redondear', 'Periodo de 24 h', '1 mL equivale a 1 000 µL'],
            'Reparte el volumen entre las 24 horas y luego convierte a microlitros por hora.',
            ['Divide 25,798045 mL entre 24 h ≈ 1,0749185 mL/h.', 'Multiplica por 1 000 µL/mL: ≈ 1 074,9185 µL/h. Redondea a la unidad.'],
            'El resultado está un poco por encima de 1 000 µL/h, que equivale a 1 mL/h.'
        )),
        q('¿A cuántos grados Celsius equivalen 96,8 °F?', '°C', celsius(96.8), 1, fahrenheitGuide(96.8)),
        q('¿Cuántos grados debe aumentar el líquido para llegar a la meta de 37 °C?', '°C', 37 - celsius(96.8), 1, guide(
            ['Temperatura en °C de la pregunta 5', 'Meta del modelo de 37 °C'],
            'Compara las temperaturas una vez expresadas en la misma escala.',
            ['Usa los 36 °C de la conversión anterior.', 'Resta la temperatura actual de la meta: 37 − 36 = 1 °C.'],
            'Al sumar 1 °C a la temperatura inicial se alcanza la meta de 37 °C.'
        )),
    ]);

    const area48 = area(kg(48), cm(3, 9));
    const grams48 = 12 * area48;
    add('superficie-concentracion', 'Química', 'Casos aplicados', 'De la superficie al volumen de una solución',
        'Convierte las medidas y calcula la superficie. Úsala para obtener la cantidad pedida y luego el volumen de la mezcla.',
        'Una ficha de simulación registra 48 lb y 3 ft 9 in. Usa 0,4536 kg/lb y 2,54 cm/in. Para el modelo, S = √(masa en kg × altura en cm ÷ 3 600). Un reactivo se calcula a razón de 12 g por m² y su solución contiene 25 mg/mL.', [
        q('¿Cuál es la masa en kilogramos?', 'kg', kg(48), 2, poundsGuide(48)),
        q('¿Cuál es la altura en centímetros?', 'cm', cm(3, 9), 1, feetGuide(3, 9)),
        q('¿Cuánto vale S?', 'm²', area48, 4, surfaceGuide(48, 3, 9, 4)),
        q('¿Cuántos gramos de reactivo corresponden al índice S?', 'g', grams48, 2, guide(
            ['Superficie de la pregunta 3, sin redondear', 'Cantidad por superficie de 12 g/m²'],
            'Por cada metro cuadrado corresponden 12 gramos. Multiplica esa relación por la superficie.',
            ['Sustituye la superficie sin redondear: 0,831436… m² × 12 g/m².', 'Al cancelar m², quedan aproximadamente 9,977236 g. Redondea a dos decimales.'],
            'La superficie es menor que 1 m², así que la cantidad tiene que ser menor que 12 g.'
        )),
        q('¿Cuántos miligramos corresponden a esa cantidad de reactivo?', 'mg', grams48 * 1000, 0, guide(
            ['Cantidad en gramos de la pregunta 4, sin redondear', '1 g equivale a 1 000 mg'],
            'Para pasar a una unidad más pequeña, se necesitan más unidades para representar la misma cantidad.',
            ['Multiplica 9,977236… g × 1 000 mg/g para obtener aproximadamente 9 977,236 mg.', 'Redondea al miligramo más cercano.'],
            'Si divides el valor sin redondear por 1 000 mg/g, recuperas los gramos de la pregunta 4.'
        )),
        q('¿Qué volumen de la solución contiene esa masa de reactivo?', 'mL', grams48 * 1000 / 25, 2, guide(
            ['Cantidad en mg de la pregunta 5, sin redondear', 'Concentración de 25 mg/mL'],
            'Cada mililitro contiene 25 mg. Divide la cantidad que buscas por los mg que hay en un mililitro.',
            ['Usa los 9 977,236… mg sin redondear.', 'Divide entre 25 mg/mL. Los mg se cancelan y quedan aproximadamente 399,089447 mL.'],
            'Con 400 mL habría 10 000 mg. Como necesitas ligeramente menos, el volumen debe quedar apenas por debajo de 400 mL.'
        )),
    ]);

    const volume176 = kg(176) * 75;
    add('perdida-calentamiento', 'Física', 'Casos aplicados', 'Volumen y velocidad de calentamiento',
        'Calcula el volumen y su fracción. Después convierte la temperatura, halla cuánto falta para la meta y expresa ese tiempo en minutos y segundos.',
        'Un modelo registra 176 lb y estima un volumen a razón de 75 mL/kg. El ensayo mide una pérdida del 40 %. Usa 0,4536 kg/lb. Un dispositivo aumenta la temperatura de 92,3 °F hasta 37 °C a 0,4 °C/min.', [
        q('¿Cuál es la masa expresada en kg?', 'kg', kg(176), 2, poundsGuide(176)),
        q('¿Cuál es el volumen estimado en litros?', 'L', volume176 / 1000, 2, guide(
            ['Masa en kg de la pregunta 1', 'Factor de 75 mL/kg', '1 L equivale a 1 000 mL'],
            'El factor te da mL por cada kg. Multiplica antes de convertir a litros.',
            ['Multiplica 79,8336 kg × 75 mL/kg = 5 987,52 mL.', 'Divide entre 1 000 mL/L: 5,98752 L. Redondea a dos decimales.'],
            'El volumen en mL está un poco por debajo de 6 000, por lo que en litros debe quedar justo por debajo de 6.'
        )),
        q('¿Cuántos mL representan el 40 % del volumen?', 'mL', volume176 * .4, 2, guide(
            ['Volumen total de la pregunta 2, sin redondear', 'Fracción de 40 %'],
            'Trabaja en mL desde el principio y multiplica por la fracción equivalente al porcentaje.',
            ['Convierte el porcentaje: 40 ÷ 100 = 0,4.', 'Multiplica 5 987,52 mL × 0,4 = 2 395,008 mL. Redondea a dos decimales.'],
            'El 40 % es menos de la mitad. El resultado debe ser menor que 2 993,76 mL.'
        )),
        q('¿Cuál es la temperatura de partida en °C?', '°C', celsius(92.3), 1, fahrenheitGuide(92.3)),
        q('¿Cuánto aumenta la temperatura hasta llegar a 37 °C?', '°C', 37 - celsius(92.3), 1, guide(
            ['Temperatura de la pregunta 4', 'Meta del modelo de 37 °C'],
            'Resta la temperatura actual de la meta una vez que ambas están en °C.',
            ['Usa 33,5 °C como temperatura inicial.', 'Calcula 37 − 33,5 = 3,5 °C.'],
            'Si sumas 3,5 °C a 33,5 °C, llegas a 37 °C.'
        )),
        q('¿Cuántos minutos tarda el calentamiento?', 'min', (37 - celsius(92.3)) / .4, 2, guide(
            ['Diferencia de temperatura de la pregunta 5', 'Incremento de 0,4 °C/min'],
            'Divide los grados que faltan por los grados que se ganan en un minuto.',
            ['Parte de los 3,5 °C que faltan.', 'Divide 3,5 °C ÷ 0,4 °C/min = 8,75 min. Los °C se cancelan.'],
            'En 8 minutos el incremento sería de 3,2 °C y en 9 minutos de 3,6 °C. El tiempo debe quedar entre 8 y 9 minutos.'
        )),
        q('¿A cuántos segundos equivale ese tiempo?', 's', (37 - celsius(92.3)) / .4 * 60, 0, guide(
            ['Tiempo de la pregunta 6', '1 min equivale a 60 s'],
            'Expresa la misma duración en segundos. Cada minuto aporta 60 segundos.',
            ['Usa el tiempo de 8,75 min sin redondear a minutos enteros.', 'Multiplica 8,75 min × 60 s/min = 525 s.'],
            '8 minutos son 480 segundos y 0,75 minutos son 45 segundos. Su suma también da 525 s.'
        )),
    ]);

    const liters72 = kg(72) * .10;
    const units72 = kg(72) * .1;
    add('superficie-proporcion-flujo', 'Matemáticas', 'Casos aplicados', 'Superficie, proporciones y cambio térmico',
        'Obtén la masa y la superficie. Luego usa las proporciones del caso para hallar el volumen y el caudal. La temperatura se calcula aparte.',
        'Una ficha simulada registra 72 lb y 4 ft 6 in. Usa 0,4536 kg/lb y 2,54 cm/in. Calcula S = √(masa en kg × altura en cm ÷ 3 600). El ensayo modela una pérdida del 10 % y asume 1 kg/L para el líquido. El marcador se asigna a 0,1 unidades por kg y por hora, con una concentración de 100 unidades/mL. El calentador parte de 93,2 °F, con meta de 37 °C y un aumento de 0,5 °C/min.', [
        q('¿Cuál es la masa en kg?', 'kg', kg(72), 2, poundsGuide(72)),
        q('¿Cuál es la altura en cm?', 'cm', cm(4, 6), 2, feetGuide(4, 6)),
        q('¿Cuál es el índice S?', 'm²', area(kg(72), cm(4, 6)), 3, surfaceGuide(72, 4, 6, 3)),
        q('¿Cuántos litros corresponden a la pérdida indicada, según la densidad asumida?', 'L', liters72, 3, guide(
            ['Masa de la pregunta 1', 'Fracción de 10 %', 'Relación del modelo de 1 kg/L'],
            'Primero halla la parte de la masa pedida. Después conviértela en volumen con la relación del caso.',
            ['Calcula 10 % de 32,6592 kg: 32,6592 × 0,10 = 3,26592 kg.', 'Divide 3,26592 kg entre 1 kg/L. Los kg se cancelan y quedan 3,26592 L.'],
            'Con el factor del ejercicio, los litros deben tener el mismo valor numérico que los kg de esa fracción.'
        )),
        q('¿Cuántas unidades de marcador corresponden a una hora?', 'unidades', units72, 3, guide(
            ['Masa de la pregunta 1', 'Tasa de 0,1 unidades/(kg·h)', 'Periodo de 1 h'],
            'Usa la masa total en kg y el periodo de una hora.',
            ['Multiplica 32,6592 kg × 0,1 unidades/(kg·h) = 3,26592 unidades/h.', 'Multiplica por 1 h: 3,26592 unidades. Redondea al final.'],
            'El ejercicio cubre exactamente una hora, así que la cantidad en esa hora tiene el mismo valor numérico que la tasa por hora.'
        )),
        q('¿Cuál es el caudal de la solución?', 'µL/h', units72 / 100 * 1000, 2, guide(
            ['Tasa de la pregunta 5, sin redondear', 'Concentración de 100 unidades/mL', '1 mL equivale a 1 000 µL'],
            'Divide la tasa por la concentración para obtener mL/h. Cambia el volumen a µL sin cambiar las horas.',
            ['Divide 3,26592 unidades/h entre 100 unidades/mL: 0,0326592 mL/h.', 'Multiplica 0,0326592 mL/h × 1 000 µL/mL = 32,6592 µL/h.'],
            'Convierte el caudal a mL/h y multiplícalo por 100 unidades/mL. Recuperas la tasa del modelo.'
        )),
        q('¿Cuál es la temperatura inicial en °C?', '°C', celsius(93.2), 1, fahrenheitGuide(93.2)),
        q('¿Cuánto tiempo tarda en alcanzar 37 °C?', 'min', (37 - celsius(93.2)) / .5, 1, guide(
            ['Temperatura de la pregunta 7', 'Meta del modelo de 37 °C', 'Incremento de 0,5 °C/min'],
            'Calcula la diferencia de temperatura antes de dividirla por el aumento por minuto.',
            ['Resta 37 − 34 = 3 °C para obtener el incremento pendiente.', 'Divide 3 °C ÷ 0,5 °C/min = 6 min.'],
            'En 6 minutos se ganan 6 × 0,5 = 3 °C, justo lo que falta para la meta.'
        )),
    ]);

    const estimate185 = (140 - 68) * kg(185) / (72 * 4.2);
    const marker185 = 20 * kg(185);
    add('formula-caudal', 'Matemáticas', 'Casos aplicados', 'Sustitución en una fórmula y caudal',
        'Convierte las medidas y aplica la expresión del caso. Luego encadena cantidad, concentración, volumen y caudal.',
        'Datos de simulación. Masa de 185 lb, altura de 5 ft 8 in, edad de 68 y parámetro c = 4,2. Usa 0,4536 kg/lb y 2,54 cm/in. Evalúa X = (140 − edad) × masa en kg ÷ (72 × c). Un ensayo usa 20 mg de marcador por kg y la solución se prepara con 1 g en un volumen final de 20 mL. El intervalo de ensayo es de 30 minutos.', [
        q('¿Cuál es la masa expresada en kg?', 'kg', kg(185), 2, poundsGuide(185)),
        q('¿Cuánto mide la altura en cm?', 'cm', cm(5, 8), 2, feetGuide(5, 8)),
        q('¿Qué valor da la expresión X?', 'mL/min', estimate185, 2, guide(
            ['Masa en kg de la pregunta 1', 'Valor de edad de 68 en la expresión', 'Expresión del caso: (140 − edad) × masa ÷ (72 × 4,2)'],
            'Resuelve primero los dos paréntesis. Después divide el numerador por el denominador.',
            ['Calcula el numerador: (140 − 68) × 83,916 = 72 × 83,916 = 6 041,952.', 'Calcula el denominador: 72 × 4,2 = 302,4.', 'Divide 6 041,952 entre 302,4. El resultado de la expresión del caso es 19,98 mL/min.'],
            'El factor 72 aparece arriba y abajo. Al cancelarlo, 83,916 ÷ 4,2 vuelve a dar 19,98.'
        )),
        q('¿Qué masa de marcador pide el ensayo?', 'mg', marker185, 2, guide(
            ['Masa de la pregunta 1', 'Factor del modelo de 20 mg/kg'],
            'Multiplica la cantidad por kilogramo por el número de kilogramos.',
            ['Plantea 83,916 kg × 20 mg/kg. Los kg se cancelan.', 'El producto es 1 678,32 mg.'],
            'Divide 1 678,32 mg entre 83,916 kg. Recuperas los 20 mg/kg del caso.'
        )),
        q('¿Qué concentración tiene la solución?', 'mg/mL', 1000 / 20, 0, guide(
            ['La mezcla contiene 1 g en 20 mL', '1 g equivale a 1 000 mg'],
            'Pasa la cantidad a miligramos antes de calcular cuánto hay en un mililitro.',
            ['Convierte 1 g a 1 000 mg.', 'Divide 1 000 mg entre 20 mL: 50 mg/mL.'],
            'Multiplica 50 mg/mL × 20 mL. Recuperas 1 000 mg.'
        )),
        q('¿Qué volumen de solución contiene la masa del marcador?', 'mL', marker185 / 50, 2, guide(
            ['Cantidad de la pregunta 4', 'Concentración de la pregunta 5'],
            'Divide la cantidad por lo que cabe en un mililitro. Observa que la unidad que queda es mL.',
            ['Usa 1 678,32 mg y 50 mg/mL.', 'Divide 1 678,32 mg entre 50 mg/mL: 33,5664 mL. Redondea al final.'],
            'Multiplica el volumen sin redondear por 50 mg/mL para recuperar los 1 678,32 mg.'
        )),
        q('¿Qué caudal corresponde al intervalo de 30 minutos?', 'mL/h', marker185 / 50 / .5, 2, guide(
            ['Volumen de la pregunta 6, sin redondear', 'Tiempo de 30 min', '1 h equivale a 60 min'],
            'Convierte los 30 minutos a horas antes de dividir. Así el caudal quedará en mL/h.',
            ['Convierte 30 min ÷ 60 min/h = 0,5 h.', 'Divide 33,5664 mL entre 0,5 h: 67,1328 mL/h.'],
            'El periodo es media hora. El caudal por hora debe ser el doble del volumen entregado en ese periodo.'
        )),
    ]);

    const volume132 = kg(132) * 5.5;
    add('distribucion-proporcional', 'Química', 'Casos aplicados', 'Distribución de un soluto y proporcionalidad',
        'Convierte las medidas y obtén la superficie. Luego trabaja por separado con la expresión de caudal, la concentración y la proporción entre sustancias.',
        'Datos de simulación. Una ficha registra 132 lb, altura de 5 ft 1 in, edad de 75 y parámetro c = 2,5. Usa 0,4536 kg/lb y 2,54 cm/in. Para el índice S usa √(masa en kg × altura en cm ÷ 3 600). El índice ajustado X = (140 − edad) × masa en kg ÷ (72 × c) × 0,85. Se mezclan 3,5 mg de soluto A en un volumen que se estima con 5,5 L/kg. Para otra prueba se usan 76 mg de reactivo B por cada mg de A.', [
        q('¿Cuál es la masa en kg?', 'kg', kg(132), 2, poundsGuide(132)),
        q('¿Cuál es la altura en cm?', 'cm', cm(5, 1), 2, feetGuide(5, 1)),
        q('¿Cuánto vale S?', 'm²', area(kg(132), cm(5, 1)), 3, surfaceGuide(132, 5, 1, 3)),
        q('¿Qué valor da la expresión ajustada X?', 'mL/min', (140 - 75) * kg(132) / (72 * 2.5) * .85, 2, guide(
            ['Masa de la pregunta 1', 'Valor de edad de 75 en la expresión', 'Expresión del caso: (140 − edad) × masa ÷ (72 × 2,5), con factor final 0,85'],
            'Calcula el cociente primero. Aplica el factor 0,85 al resultado, al final.',
            ['Calcula el numerador: (140 − 75) × 59,8752 = 65 × 59,8752 = 3 891,888.', 'Calcula el denominador: 72 × 2,5 = 180. Divide 3 891,888 entre 180 para obtener 21,6216.', 'Aplica el factor: 21,6216 × 0,85 = 18,37836 mL/min. Redondea a dos decimales.'],
            'El factor 0,85 conserva el 85 % del cociente, así que el resultado debe ser menor que 21,6216 mL/min.'
        )),
        q('¿Cuál es el volumen estimado para la mezcla?', 'L', volume132, 2, guide(
            ['Masa de la pregunta 1', 'Factor del modelo de 5,5 L/kg'],
            'Multiplica los kg por los litros que corresponden a cada kg.',
            ['Plantea 59,8752 kg × 5,5 L/kg. Los kg se cancelan.', 'El producto es 329,3136 L. Redondea a dos decimales.'],
            'Con 60 kg resultarían 330 L. El resultado debe quedar ligeramente por debajo.'
        )),
        q('¿Cuál es la concentración de A?', 'mg/L', 3.5 / volume132, 4, guide(
            ['Cantidad de 3,5 mg de la sustancia A', 'Volumen de la pregunta 5, sin redondear'],
            'La concentración pedida es cantidad por litro. Divide los mg entre los litros.',
            ['Usa 3,5 mg y 329,3136 L.', 'Divide 3,5 ÷ 329,3136 ≈ 0,01062817 mg/L. Redondea a cuatro decimales.'],
            'Multiplica la concentración sin redondear por el volumen. Recuperas aproximadamente 3,5 mg.'
        )),
        q('¿Cuántos miligramos de B se usan para 3,5 mg de A?', 'mg', 3.5 * 76, 0, guide(
            ['Cantidad de 3,5 mg de A', 'Por cada 1 mg de A corresponden 76 mg de B'],
            'Escala la cantidad de B por cada mg de A usando la relación del caso.',
            ['Escribe la relación como 76 mg de B por cada mg de A.', 'Multiplica 3,5 mg de A × 76 mg de B/mg de A = 266 mg de B.'],
            'Si divides 266 mg de B entre los 3,5 mg de A, recuperas la relación de 76.'
        )),
    ]);

    const flow210 = 5 * kg(210) / 1000;
    add('caudal-continuo', 'Física', 'Casos aplicados', 'Caudal continuo y temperatura ambiente',
        'Convierte la masa y la estatura. Luego calcula cuánta sustancia corresponde por minuto y traduce esa tasa a mL/min y a mL/h.',
        'Una ficha de simulación registra 210 lb y 5 ft 10 in. Usa 0,4536 kg/lb y 2,54 cm/in. El modelo trabaja con 5 µg de marcador por kg y por minuto. Se preparan 250 mg de marcador en un volumen final de 250 mL. La sala está a 68 °F.', [
        q('¿Cuál es la masa en kg?', 'kg', kg(210), 2, poundsGuide(210)),
        q('¿Cuál es la altura en cm?', 'cm', cm(5, 10), 1, feetGuide(5, 10)),
        q('¿Cuántos microgramos por minuto corresponden a la tasa del modelo?', 'µg/min', flow210 * 1000, 2, guide(
            ['Masa en kg de la pregunta 1', 'Tasa del modelo de 5 µg/(kg·min)'],
            'Multiplica por la masa. Se cancelan los kilogramos y queda una cantidad por minuto.',
            ['Plantea 95,256 kg × 5 µg/(kg·min).', 'El producto es 476,28 µg/min.'],
            'Con una masa de 100 kg la tasa sería 500 µg/min, así que el resultado debe estar algo por debajo.'
        )),
        q('¿Qué caudal representa esa tasa?', 'mL/min', flow210, 4, guide(
            ['Tasa de la pregunta 3', '250 mg de sustancia en 250 mL de mezcla', '1 mg equivale a 1 000 µg'],
            'Expresa la concentración en µg/mL para usar la misma unidad que la tasa.',
            ['Divide 250 mg entre 250 mL: 1 mg/mL.', 'Convierte a 1 000 µg/mL. Divide 476,28 µg/min entre 1 000 µg/mL.', 'Quedan 0,47628 mL/min. Redondea a cuatro decimales.'],
            'La mitad de un mililitro contiene 500 µg. Para 476,28 µg hace falta un poco menos de medio mililitro.'
        )),
        q('¿Cuál es el caudal por hora?', 'mL/h', flow210 * 60, 2, guide(
            ['Caudal de la pregunta 4, sin redondear', '1 h equivale a 60 min'],
            'Para saber cuántos mililitros pasan en una hora, multiplica lo que pasa por minuto por 60.',
            ['Plantea 0,47628 mL/min × 60 min/h. Los minutos se cancelan.', 'El producto es 28,5768 mL/h. Redondea a dos decimales.'],
            'Divide el caudal por hora sin redondear entre 60 para recuperar 0,47628 mL/min.'
        )),
        q('¿A cuántos grados Celsius equivalen 68 °F?', '°C', celsius(68), 1, fahrenheitGuide(68)),
    ]);

    function parseNumber(value) {
        let number = String(value).trim().replace(/(\d)[ \u00a0\u202f](?=\d{3}(?:\D|$))/g, '$1').replaceAll('−', '-');
        if (/^[+-]?\d{1,3}(?:\.\d{3})+(?:,\d+)$/.test(number) || /^[+-]?\d{1,3}(?:\.\d{3}){2,}$/.test(number)) {
            number = number.replaceAll('.', '');
        }
        number = number.replace(',', '.');
        if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[+-]?\d+)?$/i.test(number)) return null;
        const parsed = Number(number);
        return Number.isFinite(parsed) ? parsed : null;
    }

    function isCorrect(value, question) {
        const parsed = parseNumber(value);
        if (parsed === null || (question.decimals === 0 && !Number.isInteger(parsed))) return false;
        const tolerance = .5 * 10 ** -question.decimals + Number.EPSILON * Math.max(1, Math.abs(question.answer)) * 8;
        return Math.abs(parsed - question.answer) <= tolerance;
    }

    function formatAnswer(question) {
        return new Intl.NumberFormat('es-BO', {
            minimumFractionDigits: question.decimals, maximumFractionDigits: question.decimals,
        }).formatToParts(question.answer).map(part => part.type === 'group' ? ' ' : part.value).join('');
    }

    return { reference, exercises, parseNumber, isCorrect, formatAnswer };
});
