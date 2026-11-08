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
    const add = (id, subject, kind, title, context, questions) => exercises.push({ id, subject, kind, title, context, questions });
    const q = (prompt, unit, answer, decimals, ...steps) => ({ prompt, unit, answer, decimals, steps });
    const kg = pounds => pounds * .4536;
    const cm = (feet, inches) => (12 * feet + inches) * 2.54;
    const celsius = degrees => (degrees - 32) * 5 / 9;
    const area = (weight, height) => Math.sqrt(height * weight / 3600);

    add('conversiones-rapidas', 'Física', 'Conversiones', 'Conversiones rápidas',
        'Seis mediciones independientes. Usa 1 h = 60 min, 1 mL = 1 cm³ y 1 lb ≈ 0,4536 kg para estos ejercicios.', [
        q('Un modelo asigna 500 µg por kilogramo y por minuto a una muestra de 6,5 kg. ¿Cuántos gramos corresponden a una hora?', 'g', 500 * 6.5 * 60 / 1e6, 3,
            'Multiplica 500 por 6,5 para obtener 3 250 µg/min.', 'Multiplica por 60 min y divide por 1 000 000 µg/g.'),
        q('Una solución homogénea contiene 500 mg de soluto en 250 mL. ¿Cuántos gramos hay en una alícuota de 12,5 mL?', 'g', 500 / 250 * 12.5 / 1000, 3,
            'Divide 500 mg entre 250 mL para obtener 2 mg/mL.', 'Multiplica por 12,5 mL. Los 25 mg resultantes equivalen a 0,025 g.'),
        q('Un equipo de simulación entrega gas a 4 L/min durante seis horas. ¿Qué volumen pasa en ese tiempo?', 'cm³', 4 * 60 * 6 * 1000, 0,
            'Convierte 6 h a 360 min y multiplica por 4 L/min.', 'Multiplica el resultado en litros por 1 000 cm³/L.'),
        q('Una muestra de 175 lb se procesa con 10 mg de marcador por cada 500 g de masa. ¿Cuántos gramos de marcador corresponden al modelo?', 'g', kg(175) * 1000 / 500 * 10 / 1000, 4,
            '175 × 0,4536 = 79,38 kg, que equivalen a 79 380 g.', 'Divide por 500 g y multiplica por 10 mg. Divide los miligramos resultantes por 1 000.'),
        q('Un tubo recoge 0,5 mL por minuto. ¿Cuántos litros reúne en 24 horas?', 'L', .5 * 24 * 60 / 1000, 2,
            'En 24 horas hay 1 440 minutos. Multiplica por 0,5 para obtener 720 mL.', 'Divide 720 entre 1 000 para expresar el volumen en litros.'),
        q('Un microconducto transporta 150 µL/s. ¿Cuál es el caudal en centímetros cúbicos por hora?', 'cm³/h', 150 * 3600 / 1000, 0,
            'Multiplica por 3 600 s/h para obtener 540 000 µL/h.', 'Divide por 1 000 µL/mL. Cada mL equivale a 1 cm³.'),
    ]);

    add('factores-si', 'Física', 'Conversiones', 'Factores de conversión del SI',
        'Consulta la tabla de referencia. Fíjate en el exponente de la unidad y en el significado de cada prefijo.', [
        q('¿A cuántos miligramos equivalen 240 µg?', 'mg', 240 / 1000, 3, 'Divide los microgramos entre 1 000 µg/mg.'),
        q('¿A cuántos centímetros equivalen 15 pulgadas?', 'cm', 15 * 2.54, 1, 'Multiplica por 2,54 cm/in.'),
        q('¿A cuántos centímetros cuadrados equivalen 0,36 m²?', 'cm²', .36 * 100 ** 2, 0, 'Cada metro tiene 100 cm. Para una superficie, eleva ese factor al cuadrado.'),
        q('¿A cuántos pies cuadrados equivale un acre?', 'ft²', 43560, 0, 'La equivalencia es 43 560 ft². Para pasar a metros cuadrados se usaría (0,3048 m/ft)².'),
        q('¿A cuántos ergios equivalen 2,5 J?', 'erg', 2.5 * 1e7, 0, 'Cada joule equivale a 10⁷ erg. Multiplica 2,5 por 10⁷.'),
        q('¿Cuántos pascales corresponden a 0,75 bar?', 'Pa', .75 * 1e5, 0, 'Multiplica 0,75 por 100 000 Pa/bar.'),
        q('Una cámara registra 25 °C. ¿Cuál es su temperatura en kelvin?', 'K', 25 + 273.15, 2, 'Suma 273,15 a la temperatura en Celsius.'),
        q('¿Cuántos vatios representan 0,48 kW?', 'W', .48 * 1000, 0, 'Kilo equivale a 10³. Multiplica 0,48 por 1 000.'),
    ]);

    const smallMass = (2 * 453.592 + 3 * 28.3495) / 1000;
    const volumeInVials = smallMass * 100 / 25;
    add('medicion-neonatal', 'Matemáticas', 'Casos aplicados', 'Medición neonatal y reparto en recipientes',
        'Una ficha de simulación registra 2 lb 3 oz y 14,5 in. Para la práctica usa 1 lb = 453,592 g, 1 oz = 28,3495 g y 1 in = 2,54 cm. El modelo asigna 100 mg de marcador por kg. La solución contiene 25 mg/mL y cada recipiente admite 1,5 mL.', [
        q('¿Cuál es la masa registrada en kilogramos?', 'kg', smallMass, 4, 'Suma (2 × 453,592) y (3 × 28,3495) en gramos.', 'Divide la suma entre 1 000.'),
        q('¿Cuánto mide la longitud en centímetros?', 'cm', 14.5 * 2.54, 2, 'Multiplica 14,5 in por 2,54 cm/in.'),
        q('¿Qué masa de marcador corresponde al modelo?', 'mg', smallMass * 100, 2, 'Multiplica la masa en kg, con todos sus decimales, por 100 mg/kg.'),
        q('¿Cuánto volumen contiene esa masa de marcador?', 'mL', volumeInVials, 3, 'Divide la masa en mg por la concentración de 25 mg/mL.'),
        q('¿Cuántos recipientes de 1,5 mL se necesitan para alcanzar ese volumen?', 'recipientes', Math.ceil(volumeInVials / 1.5), 0,
            'Divide el volumen necesario entre 1,5 mL por recipiente.', 'Redondea hacia arriba porque se usan recipientes completos.'),
        q('Una vez consumidos los dos primeros recipientes, ¿qué porcentaje del tercero queda sin usar?', '%', (4.5 - volumeInVials) / 1.5 * 100, 1,
            'Tres recipientes contienen 4,5 mL en total. Resta el volumen utilizado.', 'Divide el volumen restante entre 1,5 mL, la capacidad del tercer recipiente, y multiplica por 100.'),
        q('Una cámara de ensayo está a 72 °F. ¿Cuántos grados Celsius debe subir para alcanzar 37 °C?', '°C', 37 - celsius(72), 1,
            'Convierte primero 72 °F con (72 − 32) × 5/9.', 'Resta la temperatura convertida de 37 °C.'),
    ]);

    const area62 = area(kg(62), cm(4, 3));
    const marker62 = Math.min(area62 * 1.5, 2);
    add('superficie-limite', 'Matemáticas', 'Casos aplicados', 'Superficie calculada y límite del modelo',
        'Una ficha simulada registra 62 lb y 4 ft 3 in. Usa 0,4536 kg/lb y 2,54 cm/in. El índice de superficie S se calcula como √(masa en kg × altura en cm ÷ 3 600). Un marcador se calcula a 1,5 mg por m², con un máximo de 2 mg. La solución contiene 1 mg/mL.', [
        q('¿Cuál es la masa en kilogramos?', 'kg', kg(62), 2, 'Multiplica 62 por 0,4536 kg/lb.'),
        q('¿Cuál es la altura en centímetros?', 'cm', cm(4, 3), 2, 'Suma (4 × 12) + 3 pulgadas y multiplica por 2,54 cm/in.'),
        q('¿Cuál es el índice de superficie S?', 'm²', area62, 3, 'Multiplica la altura en cm por la masa en kg.', 'Divide el producto entre 3 600 y aplica la raíz cuadrada.'),
        q('¿Cuántos miligramos de marcador determina el modelo con el límite indicado?', 'mg', marker62, 3,
            'Multiplica S por 1,5 mg/m².', 'Compara con 2 mg y conserva el menor de los dos valores.'),
        q('¿Qué volumen de solución corresponde al marcador calculado?', 'µL', marker62 * 1000, 0,
            'Divide la masa en mg entre 1 mg/mL.', 'Multiplica el volumen en mL por 1 000 µL/mL y redondea al entero al final.'),
        q('Si la masa registrada aumenta a 67 lb y la altura se conserva, ¿cuánto aumenta S?', 'm²', area(kg(67), cm(4, 3)) - area62, 3,
            'Repite el cálculo de S con 67 lb convertidas a kg.', 'Resta el valor inicial calculado con 62 lb antes de redondear.'),
    ]);

    const volume198 = kg(198) * 70;
    add('volumen-porcentaje', 'Matemáticas', 'Casos aplicados', 'Volumen estimado, porcentajes y tiempo',
        'En un modelo de circulación se registran 198 lb. El volumen se estima en 70 mL por kg y el ejercicio considera una pérdida del 35 %. Usa 0,4536 kg/lb. Para el ensayo térmico, la temperatura pasa de 95 °F a 37 °C a un ritmo de 0,5 °C/min.', [
        q('¿A cuántos kilogramos equivalen 198 lb?', 'kg', kg(198), 2, 'Multiplica 198 por 0,4536 kg/lb.'),
        q('¿Cuál es el volumen total estimado en litros?', 'L', volume198 / 1000, 2, 'Multiplica los kg por 70 mL/kg.', 'Divide entre 1 000 para pasar de mL a L.'),
        q('¿Qué volumen en mL corresponde al 35 %?', 'mL', volume198 * .35, 2, 'Multiplica el volumen total en mL por 0,35. Conserva todos los decimales del cálculo anterior.'),
        q('¿Qué temperatura en Celsius representa 95 °F?', '°C', celsius(95), 1, 'Aplica (95 − 32) × 5/9.'),
        q('¿Qué aumento de temperatura se necesita para llegar a 37 °C?', '°C', 37 - celsius(95), 1, 'Resta la temperatura inicial en Celsius de 37 °C.'),
        q('¿En cuánto tiempo se alcanza el valor final?', 'min', (37 - celsius(95)) / .5, 1, 'Divide la diferencia de temperatura por 0,5 °C/min.'),
        q('Una mezcla de ensayo usa un recipiente de 275 mL, uno de 300 mL y uno de 350 mL. ¿Qué volumen total tienen los tres?', 'mL', 275 + 300 + 350, 0,
            'La relación 1:1:1 se refiere al número de recipientes. Suma los tres volúmenes indicados.'),
    ]);

    const mass1lb10oz = (453.592 + 10 * 28.3495) / 1000;
    const nutrientMass = mass1lb10oz * 3.5;
    const nutrientVolume = nutrientMass / (10 / 100);
    add('concentracion-aminoacidos', 'Química', 'Casos aplicados', 'Solución de aminoácidos al 10 %',
        'En un modelo de laboratorio se registra 1 lb 10 oz. Usa 453,592 g/lb y 28,3495 g/oz. El ensayo asigna 3,5 g por kg al día. La solución contiene 10 g de aminoácidos por cada 100 mL. El líquido parte de 96,8 °F y el equipo tiene una meta de 37 °C.', [
        q('¿Cuántos kilogramos corresponden a 1 lb 10 oz?', 'kg', mass1lb10oz, 4,
            'Convierte la libra y las diez onzas por separado a gramos.', 'Suma los gramos y divide el total por 1 000.'),
        q('¿Cuántos gramos de aminoácidos corresponden a las 24 horas del modelo?', 'g', nutrientMass, 3,
            'Multiplica la masa expresada en kg por la tasa de 3,5 g/kg al día.'),
        q('¿Qué volumen de solución contiene la cantidad calculada?', 'mL', nutrientVolume, 2,
            'La solución tiene 10 ÷ 100 = 0,1 g/mL.', 'Divide los gramos calculados entre 0,1 g/mL.'),
        q('Si el volumen se distribuye de forma uniforme en 24 horas, ¿cuál es su caudal?', 'µL/h', nutrientVolume * 1000 / 24, 0,
            'Divide el volumen en mL entre 24 h y convierte a µL/h multiplicando por 1 000.'),
        q('¿A cuántos grados Celsius equivalen 96,8 °F?', '°C', celsius(96.8), 1, 'Aplica (96,8 − 32) × 5/9.'),
        q('¿Cuántos grados debe aumentar el líquido para llegar a la meta de 37 °C?', '°C', 37 - celsius(96.8), 1,
            'Resta de 37 °C la temperatura inicial, ya convertida a Celsius.'),
    ]);

    const area48 = area(kg(48), cm(3, 9));
    const grams48 = 12 * area48;
    add('superficie-concentracion', 'Química', 'Casos aplicados', 'De la superficie al volumen de una solución',
        'Una ficha de simulación registra 48 lb y 3 ft 9 in. Usa 0,4536 kg/lb y 2,54 cm/in. Para el modelo, S = √(masa en kg × altura en cm ÷ 3 600). Un reactivo se calcula a razón de 12 g por m² y su solución contiene 25 mg/mL.', [
        q('¿Cuál es la masa en kilogramos?', 'kg', kg(48), 2, 'Multiplica 48 por 0,4536.'),
        q('¿Cuál es la altura en centímetros?', 'cm', cm(3, 9), 1, 'Suma (3 × 12) + 9 pulgadas y multiplica por 2,54.'),
        q('¿Cuánto vale S?', 'm²', area48, 4,
            'Usa los valores sin redondear. Multiplica 21,7728 kg por 114,3 cm, divide entre 3 600 y toma la raíz.'),
        q('¿Cuántos gramos de reactivo corresponden al índice S?', 'g', grams48, 2, 'Multiplica S, sin redondear, por 12 g/m².'),
        q('¿Cuántos miligramos corresponden a esa cantidad de reactivo?', 'mg', grams48 * 1000, 0, 'Multiplica la masa en gramos sin redondear por 1 000.'),
        q('¿Qué volumen de la solución contiene esa masa de reactivo?', 'mL', grams48 * 1000 / 25, 2,
            'Convierte los gramos de reactivo a mg y divide por 25 mg/mL.', 'Redondea el volumen al final.'),
    ]);

    const volume176 = kg(176) * 75;
    add('perdida-calentamiento', 'Física', 'Casos aplicados', 'Volumen y velocidad de calentamiento',
        'Un modelo registra 176 lb y estima un volumen a razón de 75 mL/kg. El ensayo mide una pérdida del 40 %. Usa 0,4536 kg/lb. Un dispositivo aumenta la temperatura de 92,3 °F hasta 37 °C a 0,4 °C/min.', [
        q('¿Cuál es la masa expresada en kg?', 'kg', kg(176), 2, 'Multiplica 176 lb por 0,4536 kg/lb.'),
        q('¿Cuál es el volumen estimado en litros?', 'L', volume176 / 1000, 2,
            'Multiplica la masa exacta del caso por 75 mL/kg y divide por 1 000 mL/L.'),
        q('¿Cuántos mL representan el 40 % del volumen?', 'mL', volume176 * .4, 2,
            'Usa el volumen estimado en mL sin redondear y multiplícalo por 0,40.'),
        q('¿Cuál es la temperatura de partida en °C?', '°C', celsius(92.3), 1, 'Aplica (92,3 − 32) × 5/9.'),
        q('¿Cuánto aumenta la temperatura hasta llegar a 37 °C?', '°C', 37 - celsius(92.3), 1, 'Resta la temperatura inicial en °C de 37 °C.'),
        q('¿Cuántos minutos tarda el calentamiento?', 'min', (37 - celsius(92.3)) / .4, 2, 'Divide la diferencia por 0,4 °C/min.'),
        q('¿A cuántos segundos equivale ese tiempo?', 's', (37 - celsius(92.3)) / .4 * 60, 0, 'Multiplica los minutos por 60 s/min.'),
    ]);

    const liters72 = kg(72) * .10;
    const units72 = kg(72) * .1;
    add('superficie-proporcion-flujo', 'Matemáticas', 'Casos aplicados', 'Superficie, proporciones y cambio térmico',
        'Una ficha simulada registra 72 lb y 4 ft 6 in. Usa 0,4536 kg/lb y 2,54 cm/in. Calcula S = √(masa en kg × altura en cm ÷ 3 600). El ensayo modela una pérdida del 10 % y asume 1 kg/L para el líquido. El marcador se asigna a 0,1 unidades por kg y por hora, con una concentración de 100 unidades/mL. El calentador parte de 93,2 °F, con meta de 37 °C y un aumento de 0,5 °C/min.', [
        q('¿Cuál es la masa en kg?', 'kg', kg(72), 2, 'Multiplica 72 por 0,4536 kg/lb.'),
        q('¿Cuál es la altura en cm?', 'cm', cm(4, 6), 2, 'Convierte 4 ft a 48 in y suma las 6 in restantes.', 'Multiplica las 54 in por 2,54 cm/in.'),
        q('¿Cuál es el índice S?', 'm²', area(kg(72), cm(4, 6)), 3,
            'Multiplica la masa por la altura, divide entre 3 600 y aplica la raíz cuadrada.'),
        q('¿Cuántos litros corresponden a la pérdida indicada, según la densidad asumida?', 'L', liters72, 3,
            'Calcula el 10 % de la masa en kg.', 'Divide esa masa por la densidad supuesta de 1 kg/L.'),
        q('¿Cuántas unidades de marcador corresponden a una hora?', 'unidades', units72, 3, 'Multiplica la masa en kg por 0,1 unidades/kg/h y toma una hora.'),
        q('¿Cuál es el caudal de la solución?', 'µL/h', units72 / 100 * 1000, 2,
            'Divide el resultado en unidades/h por 100 unidades/mL.', 'Multiplica los mL/h por 1 000.'),
        q('¿Cuál es la temperatura inicial en °C?', '°C', celsius(93.2), 1, 'Aplica (93,2 − 32) × 5/9.'),
        q('¿Cuánto tiempo tarda en alcanzar 37 °C?', 'min', (37 - celsius(93.2)) / .5, 1, 'Resta la temperatura inicial de 37 °C y divide por 0,5 °C/min.'),
    ]);

    const estimate185 = (140 - 68) * kg(185) / (72 * 4.2);
    const marker185 = 20 * kg(185);
    add('formula-caudal', 'Matemáticas', 'Casos aplicados', 'Sustitución en una fórmula y caudal',
        'Datos de simulación. Masa de 185 lb, altura de 5 ft 8 in, edad de 68 y parámetro c = 4,2. Usa 0,4536 kg/lb y 2,54 cm/in. Evalúa X = (140 − edad) × masa en kg ÷ (72 × c). Un ensayo usa 20 mg de marcador por kg y la solución se prepara con 1 g en un volumen final de 20 mL. El intervalo de ensayo es de 30 minutos.', [
        q('¿Cuál es la masa expresada en kg?', 'kg', kg(185), 2, 'Multiplica 185 por 0,4536.'),
        q('¿Cuánto mide la altura en cm?', 'cm', cm(5, 8), 2, 'Convierte 5 ft 8 in a 68 in y multiplica por 2,54 cm/in.'),
        q('¿Qué valor da la expresión X?', 'mL/min', estimate185, 2,
            'El numerador es (140 − 68) × 83,916. El denominador es 72 × 4,2.', 'Divide el numerador entre el denominador.'),
        q('¿Qué masa de marcador pide el ensayo?', 'mg', marker185, 2, 'Multiplica la masa en kg sin redondear por 20 mg/kg.'),
        q('¿Qué concentración tiene la solución?', 'mg/mL', 1000 / 20, 0, 'Convierte 1 g a 1 000 mg y divide por el volumen final de 20 mL.'),
        q('¿Qué volumen de solución contiene la masa del marcador?', 'mL', marker185 / 50, 2, 'Divide los mg calculados por 50 mg/mL.'),
        q('¿Qué caudal corresponde al intervalo de 30 minutos?', 'mL/h', marker185 / 50 / .5, 2,
            'Convierte 30 min a 0,5 h y divide el volumen sin redondear entre 0,5 h.'),
    ]);

    const volume132 = kg(132) * 5.5;
    add('distribucion-proporcional', 'Química', 'Casos aplicados', 'Distribución de un soluto y proporcionalidad',
        'Datos de simulación. Una ficha registra 132 lb, altura de 5 ft 1 in, edad de 75 y parámetro c = 2,5. Usa 0,4536 kg/lb y 2,54 cm/in. Para el índice S usa √(masa en kg × altura en cm ÷ 3 600). El índice ajustado X = (140 − edad) × masa en kg ÷ (72 × c) × 0,85. Se mezclan 3,5 mg de soluto A en un volumen que se estima con 5,5 L/kg. Para otra prueba se usan 76 mg de reactivo B por cada mg de A.', [
        q('¿Cuál es la masa en kg?', 'kg', kg(132), 2, 'Multiplica 132 lb por 0,4536 kg/lb.'),
        q('¿Cuál es la altura en cm?', 'cm', cm(5, 1), 2, 'Suma (5 × 12) + 1 pulgadas y multiplica por 2,54 cm/in.'),
        q('¿Cuánto vale S?', 'm²', area(kg(132), cm(5, 1)), 3,
            'Multiplica la altura por la masa en kg, divide por 3 600 y toma la raíz cuadrada.'),
        q('¿Qué valor da la expresión ajustada X?', 'mL/min', (140 - 75) * kg(132) / (72 * 2.5) * .85, 2,
            'Divide (140 − 75) × 59,8752 entre 72 × 2,5.', 'Multiplica el cociente por 0,85.'),
        q('¿Cuál es el volumen estimado para la mezcla?', 'L', volume132, 2, 'Multiplica 5,5 L/kg por la masa en kg sin redondear.'),
        q('¿Cuál es la concentración de A?', 'mg/L', 3.5 / volume132, 4,
            'Divide 3,5 mg entre el volumen estimado en litros.'),
        q('¿Cuántos miligramos de B se usan para 3,5 mg de A?', 'mg', 3.5 * 76, 0,
            'Multiplica los miligramos de A por la proporción de 76 mg de B por mg de A.'),
    ]);

    const flow210 = 5 * kg(210) / 1000;
    add('caudal-continuo', 'Física', 'Casos aplicados', 'Caudal continuo y temperatura ambiente',
        'Una ficha de simulación registra 210 lb y 5 ft 10 in. Usa 0,4536 kg/lb y 2,54 cm/in. El modelo trabaja con 5 µg de marcador por kg y por minuto. Se preparan 250 mg de marcador en un volumen final de 250 mL. La sala está a 68 °F.', [
        q('¿Cuál es la masa en kg?', 'kg', kg(210), 2, 'Multiplica 210 por 0,4536 kg/lb.'),
        q('¿Cuál es la altura en cm?', 'cm', cm(5, 10), 1, 'Convierte 5 ft 10 in a 70 in y multiplica por 2,54 cm/in.'),
        q('¿Cuántos microgramos por minuto corresponden a la tasa del modelo?', 'µg/min', flow210 * 1000, 2, 'Multiplica la masa sin redondear en kg por 5 µg/kg/min.'),
        q('¿Qué caudal representa esa tasa?', 'mL/min', flow210, 4,
            'Divide 250 mg entre 250 mL para obtener 1 mg/mL = 1 000 µg/mL.', 'Divide los µg/min calculados por 1 000 µg/mL.'),
        q('¿Cuál es el caudal por hora?', 'mL/h', flow210 * 60, 2, 'Multiplica los mL/min por 60 min/h antes de redondear.'),
        q('¿A cuántos grados Celsius equivalen 68 °F?', '°C', celsius(68), 1, 'Aplica (68 − 32) × 5/9.'),
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
