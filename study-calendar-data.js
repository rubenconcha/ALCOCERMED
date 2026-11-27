(function (root, factory) {
    const data = factory();
    if (typeof module === 'object' && module.exports) module.exports = data;
    else root.StudyCalendarData = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const zone = 'America/La_Paz';
    const kinds = {
        study: { label: 'Lectura', color: '#f3a31b' },
        exam: { label: 'Preguntas y evaluación', color: '#d74c50' },
        rest: { label: 'Descanso', color: '#27aa5c' },
        practice: { label: 'Ejercicios de suficiencia', color: '#4c57b4' },
        free: { label: 'Libre estudio', color: '#3786d2' },
    };
    const books = {
        morfofuncion: {
            subject: 'Morfofunción', bankSubject: 'MORFOFUNCION',
            title: 'Anatomía y fisiología. La unidad entre forma y función', credit: 'Kenneth S. Saladin · 6.ª edición',
        },
        'biologia-celular': {
            subject: 'Biología celular', bankSubject: 'BIOLOGIA CELULAR',
            title: 'Biología celular biomédica', credit: 'Alfonso Calvo González · 1.ª edición',
        },
        'educacion-salud': {
            subject: 'Salud',
            title: 'Educación en Salud e Investigación', credit: 'Facultad de Medicina, UMSS · Curso Básico 2025–2026',
        },
    };

    function reading(slug, topic, section, printed, pdf, topicId, bankTopic, pastTopics = [topicId]) {
        const topicLinks = { evaluation: topicId, past: { subject: topicId.split('-')[0], topics: pastTopics } };
        return { slug, topic, section, printed, pdf, bankTopic, topicLinks, ...books[slug] };
    }

    const health = (topic, first, last, topicId, pastTopics) =>
        reading('educacion-salud', topic, 'Parte 1 · Educación en Salud', [first, last], [first + 1, last + 1], topicId, undefined, pastTopics);

    const firstStudyWeek = '2026-11-09';
    const units = [
        {
            morning: reading('morfofuncion', 'Sangre', 'Capítulo 18', [679, 695], [707, 723], 'morfo-18', 'sangre'),
            health: health('Educación en salud', 1, 2, 'salud-01'),
            practice: { id: 'medicion-neonatal', subject: 'Matemáticas', topic: 'Medición neonatal y reparto en recipientes' },
        },
        {
            morning: reading('biologia-celular', 'Organización celular', 'Capítulo 1', [37, 45], [37, 45], 'biologia-01', 'introducción a la biología celular'),
            health: health('Salud pública', 3, 4, 'salud-03'),
            practice: { id: 'factores-si', subject: 'Física', topic: 'Factores de conversión del SI' },
        },
        {
            morning: reading('morfofuncion', 'Histología', 'Capítulo 5', [143, 157], [171, 185], 'morfo-05', 'histología'),
            health: health('Niveles de prevención', 4, 5, 'salud-04'),
            practice: { id: 'volumen-porcentaje', subject: 'Matemáticas', topic: 'Volumen estimado, porcentajes y tiempo' },
        },
        {
            morning: reading('biologia-celular', 'Estructura de la membrana plasmática', 'Capítulo 3', [121, 138], [121, 138], 'biologia-03', 'estructura de la membrana plasmática'),
            health: health('Políticas públicas de salud', 10, 12, 'salud-03'),
            practice: { id: 'concentracion-aminoacidos', subject: 'Química', topic: 'Solución de aminoácidos al 10 %' },
        },
        {
            morning: reading('morfofuncion', 'El sistema óseo', 'Capítulo 8', [234, 246], [262, 274], 'morfo-08', 'el sistema óseo'),
            health: health('Promoción de la salud', 13, 15, 'salud-05'),
            practice: { id: 'superficie-limite', subject: 'Matemáticas', topic: 'Superficie calculada y límite del modelo' },
        },
        {
            morning: reading('morfofuncion', 'El corazón', 'Capítulo 19', [715, 726], [743, 754], 'morfo-19', 'corazón'),
            health: health('Atención primaria de salud', 15, 18, 'salud-06'),
            practice: { id: 'formula-caudal', subject: 'Matemáticas', topic: 'Sustitución en una fórmula y caudal' },
        },
        {
            morning: reading('biologia-celular', 'Métodos y técnicas de estudio celular', 'Capítulo 2', [56, 66], [56, 66], 'biologia-02', 'métodos y técnicas básicas en biología celular'),
            health: health('Promoción de la salud y prevención de la enfermedad', 19, 20, 'salud-04', ['salud-04', 'salud-05']),
            practice: { id: 'conversiones-rapidas', subject: 'Física', topic: 'Conversiones rápidas' },
        },
        {
            morning: reading('morfofuncion', 'Tejido óseo', 'Capítulo 7', [207, 216], [235, 244], 'morfo-07', 'tejido óseo'),
            health: health('Salud comunitaria', 21, 21, 'salud-07'),
            practice: { id: 'superficie-proporcion-flujo', subject: 'Matemáticas', topic: 'Superficie, proporciones y cambio térmico' },
        },
        {
            morning: reading('biologia-celular', 'Microtransporte por la membrana plasmática', 'Capítulo 4', [168, 180], [168, 180], 'biologia-04', 'transporte a través de la membrana plasmática'),
            health: health('Programas de salud en Bolivia', 22, 24, 'salud-09'),
            practice: { id: 'distribucion-proporcional', subject: 'Química', topic: 'Distribución de un soluto y proporcionalidad' },
        },
        {
            morning: reading('morfofuncion', 'Sistema endocrino', 'Capítulo 17', [634, 643], [662, 671], 'morfo-17', 'sistema endocrino'),
            health: health('Problemas de salud en vigilancia prioritaria en Bolivia', 25, 29, 'salud-09',
                ['salud-22', 'salud-23', 'salud-24', 'salud-25', 'salud-26']),
            practice: { id: 'caudal-continuo', subject: 'Física', topic: 'Caudal continuo y temperatura ambiente' },
        },
    ];
    const dayFormat = new Intl.DateTimeFormat('es-BO', {
        timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
    const dateFormat = new Intl.DateTimeFormat('en-CA', {
        timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
    });

    function today(now = new Date()) {
        const parts = Object.fromEntries(dateFormat.formatToParts(now).map(part => [part.type, part.value]));
        return parts.year + '-' + parts.month + '-' + parts.day;
    }

    function toDate(key) {
        return new Date(key + 'T00:00:00Z');
    }

    function move(key, days) {
        const date = toDate(key);
        date.setUTCDate(date.getUTCDate() + days);
        return date.toISOString().slice(0, 10);
    }

    function monday(key) {
        return move(key, -((toDate(key).getUTCDay() + 6) % 7));
    }

    function formatDay(key) {
        return dayFormat.format(toDate(key));
    }

    function pageRange(pages) {
        return pages[0] === pages[1] ? String(pages[0]) : pages.join('–');
    }

    function day(key) {
        const weekday = toDate(key).getUTCDay();
        const make = (id, kind, start, end, title, description, details = {}) => ({
            id: key + '-' + id, date: key, kind, start, end, title, description, show: true, ...details,
        });
        if (weekday === 0) {
            return [make('descanso', 'rest', '08:00', '', 'Descanso',
                'Reserva este día para descansar o reorganizar tu próxima semana de estudio.')];
        }
        if (weekday === 6) {
            return [
                make('simulacro', 'exam', '09:00', '10:40', 'Simulacro de práctica',
                    'Elige un simulacro del campus y resuélvelo con el tiempo indicado en la actividad.', { resource: 'simulation' }),
                make('revision', 'exam', '11:00', '11:35', 'Corrección del simulacro',
                    'Revisa tus respuestas y anota los temas que necesitas repasar.', { resource: 'results' }),
                make('libre', 'free', '15:00', '16:00', 'Libre estudio',
                    'Elige un tema pendiente y repásalo con flashcards.', { resource: 'flashcards' }),
            ];
        }

        const weeks = (toDate(monday(key)) - toDate(firstStudyWeek)) / (7 * 86400000);
        const slot = weeks * 5 + weekday - 1;
        const { morning, health: healthReading, practice } = units[(slot % units.length + units.length) % units.length];
        return [
            make('lectura-principal', 'study', '08:00', '10:00', morning.subject + ' · ' + morning.topic,
                'Lee las páginas indicadas y anota las ideas que quieras comprobar en el bloque de preguntas.',
                { resource: 'reading', reading: morning }),
            make('repaso-preguntas', 'exam', '10:00', '11:00', 'Examen pasado · ' + morning.topic,
                'Practica las preguntas de ingreso del tema y comprueba tus respuestas con el comentario.',
                { resource: 'questions', bankSubject: morning.bankSubject, bankTopic: morning.bankTopic, topicLinks: morning.topicLinks }),
            make('lectura-salud', 'study', '11:00', '12:00', 'Salud · ' + healthReading.topic,
                'Lee el tramo indicado y resume las ideas principales con tus propias palabras.',
                { resource: 'reading', reading: healthReading }),
            make('pausa-mediodia', 'rest', '12:00', '13:00', 'Descanso',
                'Haz una pausa y retoma el estudio a las 13:00 con el bloque de ejercicios.'),
            make('ejercicios-tarde', 'practice', '13:00', '16:00', practice.subject + ' · ' + practice.topic,
                'Resuelve el ejercicio del campus, comprueba tus respuestas y repite los pasos que te costaron.',
                { resource: 'practice', practice }),
            make('evaluacion-tema', 'exam', '16:00', '16:30', 'Evaluación · ' + morning.topic,
                'Comprueba lo que aprendiste en la evaluación cronometrada del tema.',
                { resource: 'evaluation', topicLinks: morning.topicLinks }),
        ];
    }

    let sampleStart, sample;
    function buildSample(reference) {
        const start = move(monday(reference), -28);
        if (sampleStart === start) return sample;
        const plan = new Map();
        for (let index = 0; index < 77; index += 1) {
            const key = move(start, index);
            plan.set(key, day(key));
        }
        sampleStart = start;
        sample = plan;
        return plan;
    }

    // Reference: three Ben Carson group timetables and the eight-week PREU contents calendar.
    const classCalendar = {
        start: '2026-11-23',
        end: '2027-01-15',
        weekdays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        subjects: { bio: 'Biología Celular', morfo: 'Morfofunción', salud: 'Educación para la Salud',
            mate: 'Matemáticas', fis: 'Física', quim: 'Química' },
        groups: {
            presencial_1: { location: 'MED-1 PSA · Aula 403', times: ['08:30–10:00', '10:05–11:30', '11:35–13:00'],
                days: [['bio','mate','morfo'], ['bio','morfo','fis'], ['salud','quim','morfo'], ['bio','morfo','mate'], ['bio','fis','morfo']] },
            presencial_2: { location: 'MED-2 PSA · Aula 405', times: ['08:30–10:00', '10:05–11:30', '11:35–13:00'],
                days: [['morfo','bio','mate'], ['fis','bio','morfo'], ['morfo','salud','quim'], ['mate','bio','morfo'], ['morfo','bio','fis']] },
            virtual: { location: 'Grupo Virtual', times: ['17:00–18:00', '18:05–19:20', '19:30–21:00'],
                days: [['bio','morfo','mate'], ['bio','morfo','fis'], ['morfo','morfo','quim'], ['bio','salud','mate'], ['bio','morfo','fis']] },
        },
        virtualMfq: ['2026-12-25', '2026-12-31', '2027-01-01'],
        topics: [
            ['Números reales, operaciones y notación científica', 'Cifras significativas, magnitudes y unidades', 'Compuestos binarios: óxidos, hidruros y nomenclatura', 'Razones, proporciones y porcentajes', 'Conversiones, errores de medición y vectores'],
            ['Expresiones algebraicas y productos notables', 'Vectores: componentes y operaciones', 'Compuestos ternarios: hidróxidos, oxoácidos y sales', 'Factorización y fracciones algebraicas', 'Movimiento, MRU y gráficos'],
            ['Ecuaciones de primer grado y despejes', 'MRUV y aceleración', 'Tabla periódica, estructura atómica y configuración electrónica', 'Sistemas de ecuaciones lineales', 'Caída libre y movimiento vertical'],
            ['Ecuaciones cuadráticas y sus métodos', 'Movimiento parabólico', 'Enlaces químicos, reacciones y balanceo', 'Desigualdades e inecuaciones', 'Movimiento circular uniforme y variado'],
            ['Potencias, radicales y logaritmos', 'Estática y leyes de Newton', 'Mol, masas molares y cálculos estequiométricos', 'Funciones y ecuaciones exponenciales', 'Dinámica, rozamiento y gravitación'],
            ['Sucesiones y progresiones', 'Trabajo, energía y potencia', 'Leyes de los gases y soluciones: concentración y dilución', 'Lógica, conjuntos y análisis combinatorio', 'Impulso y cantidad de movimiento'],
            ['Trigonometría: razones e identidades', 'Hidrostática e hidrodinámica', 'Equilibrio químico; ácidos, bases y pH', 'Triángulos y ecuaciones trigonométricas', 'Calor, temperatura, ondas y óptica'],
            ['Geometría analítica y cónicas', 'Electrostática, campo y potencial', 'Química orgánica: hidrocarburos y funciones orgánicas', 'Introducción a límites, derivadas e integrales', 'Circuitos, ley de Ohm y electromagnetismo'],
        ],
    };

    // Exact existing exercise topics for each day of the supplied eight-week plan.
    // Empty lists deliberately show an unavailable state instead of an unrelated exercise.
    const practiceTopics = [
        [
            ['Aritmética','Números racionales','Expresiones decimales','Números primos','Notación científica','Potencias de diez','Múltiplos positivos'],
            ['Unidades','Medición','Magnitudes','Prefijos','Centímetros a metros','Minutos a segundos'],
            ['Nomenclatura'],
            ['Razones algebraicas','Dividir dos valores'],
            ['Unidades','Medición','Prefijos','Centímetros a metros','Minutos a segundos','Vectores','Suma de vectores'],
        ],
        [
            ['Expresiones algebraicas','Identidades algebraicas','Polinomios','Operaciones con polinomios','Productos notables'],
            ['Vectores','Suma de vectores'],
            [],
            ['Factorización','División algebraica','División de polinomios','Ecuaciones racionales'],
            ['Cinemática','Movimiento relativo','Movimiento en dos etapas','Encuentros y posición','Rapidez constante','Cinemática y unidades','Rapidez con conversión de longitud'],
        ],
        [
            [],
            ['Movimiento uniformemente acelerado','Aceleración desde el reposo'],
            ['Estructura atómica','Capacidad de orbitales','Masa atómica','Unidad de masa atómica','Elementos diferentes'],
            ['Sistemas de ecuaciones','Sistemas lineales'],
            ['Caída libre','Tiro vertical'],
        ],
        [
            ['Ecuaciones cuadráticas'],
            [],
            ['Enlaces químicos','Tipos de reacción','Balance de ecuaciones','Relación molar y balance','Balance y proporciones molares','Descomposición y coeficientes'],
            ['Inecuaciones','Inecuaciones cuadráticas'],
            [],
        ],
        [
            ['Potencias y radicales','Logaritmos','Logaritmos con base variable','Potencias de diez'],
            ['Segunda ley de Newton','Fuerza neta','Peso de un cuerpo','Dinámica','Plano inclinado','Plano inclinado sin rozamiento'],
            ['Masa molar','Cantidad de sustancia','Moles y moléculas','Masa de un átomo','Masa y número de átomos','Moles y número de átomos','De moles a gramos','De gramos a moles','Masa desde moles'],
            [],
            ['Dinámica','Segunda ley de Newton','Fuerza neta','Peso de un cuerpo'],
        ],
        [
            [],
            ['Energía','Energía cinética','Energía cinética básica','Trabajo','Potencia y rendimiento'],
            [],
            ['Lógica','Lógica proposicional','Conjuntos','Operaciones con conjuntos','Intersección de conjuntos','Contar elementos','Unir dos listas','Números comunes','Quitar elementos'],
            [],
        ],
        [
            [], [],
            ['Ácidos y bases','Neutralización ácido-base'],
            [],
            ['Temperatura','Dilatación','Dilatación lineal','Escalas de temperatura','Ondas','Rapidez de una onda','Óptica','Lentes convergentes','Lentes divergentes'],
        ],
        [
            [],
            ['Campo eléctrico','Campo eléctrico y distancia','Definición de campo eléctrico','Carga eléctrica'],
            [], [],
            ['Circuitos','Resistencias en paralelo','Corriente eléctrica','Corriente y carga eléctrica','Ley de Ohm y serie','Ley de Ohm básica'],
        ],
    ];
    function practiceFor(key, block = 0) {
        const day = toDate(key).getUTCDay() - 1;
        if (key < classCalendar.start || key > classCalendar.end || day < 0 || day > 4) return null;
        const week = Math.floor((toDate(monday(key)) - toDate(classCalendar.start)) / 604800000);
        return { subject:['matematicas','fisica','quimica','matematicas','fisica'][day],
            topics:practiceTopics[week]?.[day] || [], block };
    }
    function practiceQuestions(questions, assignment) {
        if (!assignment || !Array.isArray(questions)) return [];
        const pool = questions.filter(q => q.subject === assignment.subject && !q.source?.collection && assignment.topics.includes(q.topic));
        // Two study hours use separate question sets instead of reopening the same exercise.
        const half = Math.ceil(pool.length / 2);
        return (assignment.block === 1 ? (pool.slice(half).length ? pool.slice(half) : pool) : assignment.block === 0 ? pool.slice(0, half) : pool).slice(0, 20);
    }

    // Verified against the three teacher-supplied PDF files (26 November 2026).
    // Printed numbering restarts inside these compilations; only PDF page numbers are used.
    const mfqSections = {
        reales:['matematicas','Números reales y operaciones',52,56],
        notacion:['fisica','Notación científica y redondeo',2,3],
        razones:['matematicas','Razones, proporciones y porcentajes',32,38],
        algebra:['matematicas','Expresiones y operaciones algebraicas',57,76],
        productos:['matematicas','Productos y cocientes notables',101,110],
        factores:['matematicas','Factorización',111,118],
        fracciones:['matematicas','Fracciones algebraicas',118,125],
        ecuaciones:['matematicas','Ecuaciones de primer grado y despejes',77,84],
        sistemas:['matematicas','Sistemas de ecuaciones lineales',138,143],
        cuadraticas:['matematicas','Ecuaciones de segundo grado',149,154],
        inecuaciones:['matematicas','Desigualdades e inecuaciones',154,160],
        potencias:['matematicas','Potencias y radicales',125,130],
        logaritmos:['matematicas','Logaritmos',160,163],
        exponenciales:['matematicas','Funciones y ecuaciones exponenciales',163,167],
        progresiones:['matematicas','Sucesiones y progresiones',167,176],
        logica:['matematicas','Lógica y proposiciones',182,188],
        conjuntos:['matematicas','Conjuntos',276,280],
        combinatoria:['matematicas','Análisis combinatorio',195,197],
        razonesTrig:['matematicas','Razones y funciones trigonométricas',206,214],
        identidades:['matematicas','Identidades trigonométricas',225,230],
        triangulos:['matematicas','Resolución de triángulos',215,225],
        ecuacionesTrig:['matematicas','Ecuaciones trigonométricas',230,233],
        recta:['matematicas','Geometría analítica y recta',243,249],
        circunferencia:['matematicas','Circunferencia',249,255],
        parabola:['matematicas','Parábola',255,263],
        elipse:['matematicas','Elipse',263,270],
        hiperbola:['matematicas','Hipérbola',270,276],
        limites:['matematicas','Funciones y límites',281,288],
        derivadas:['matematicas','Derivadas',289,291],
        integrales:['matematicas','Integrales',292,293],
        medicion:['fisica','Cifras significativas, magnitudes y unidades',2,6],
        errores:['fisica','Precisión, exactitud y errores',7,9],
        vectores:['fisica','Magnitudes vectoriales y operaciones',12,18],
        mru:['fisica','Movimiento y MRU',30,34],
        mruv:['fisica','MRUV y aceleración',35,38],
        vertical:['fisica','Caída libre y movimiento vertical',38,43],
        parabolico:['fisica','Movimiento parabólico',43,49],
        circular:['fisica','Movimiento circular uniforme y variado',49,57],
        estatica:['fisica','Estática y condiciones de equilibrio',58,63],
        newton:['fisica','Leyes de Newton y rozamiento',63,66],
        gravitacion:['fisica','Dinámica circular y gravitación',68,72],
        trabajo:['fisica','Trabajo mecánico',72,75],
        energia:['fisica','Energía mecánica',76,82],
        potencia:['fisica','Potencia mecánica',83,85],
        impulso:['fisica','Impulso y cantidad de movimiento',85,90],
        hidrostatica:['fisica','Hidrostática',90,95],
        hidrodinamica:['fisica','Hidrodinámica, Bernoulli y Torricelli',95,99],
        temperatura:['fisica','Temperatura y dilatación térmica',26,29],
        ondas:['fisica','Ondas y sonido',19,20],
        optica:['fisica','Luz y óptica',21,26],
        electrostatica:['fisica','Electrostática y ley de Coulomb',100,105],
        campo:['fisica','Campo eléctrico',106,110],
        potencial:['fisica','Potencial eléctrico',111,115],
        ohm:['fisica','Corriente, resistencia y ley de Ohm',116,124],
        circuitos:['fisica','Circuitos y leyes de Kirchhoff',125,128],
        magnetismo:['fisica','Electromagnetismo',128,131],
        binarios:['quimica','Compuestos binarios: óxidos e hidruros',2,7],
        ternarios:['quimica','Hidróxidos y oxoácidos',8,13],
        sales:['quimica','Sales inorgánicas y nomenclatura',14,23],
        periodica:['quimica','Tabla periódica',24,28],
        atomica:['quimica','Estructura atómica y configuración electrónica',29,35],
        enlaces:['quimica','Enlaces químicos',36,39],
        reacciones:['quimica','Reacciones químicas',40,42],
        balanceo:['quimica','Balanceo de ecuaciones',43,49],
        mol:['quimica','Átomos, moles y moléculas',50,55],
        estequiometria:['quimica','Estequiometría y leyes gravimétricas',56,68],
        gases:['quimica','Leyes de los gases',62,70],
        soluciones:['quimica','Concentración y dilución de soluciones',70,78],
        equilibrio:['quimica','Cinética y equilibrio químico',85,89],
        ph:['quimica','Equilibrio, ácidos, bases y pH',90,94],
        organica:['quimica','Carbono e hidrocarburos',95,109],
        oxigenadas:['quimica','Funciones orgánicas oxigenadas',110,122],
        nitrogenadas:['quimica','Funciones nitrogenadas y sales orgánicas',123,129],
    };
    const mfqSchedule = [
        [['reales','notacion'],['medicion'],['binarios'],['razones'],['medicion','errores','vectores']],
        [['algebra','productos'],['vectores'],['ternarios','sales'],['factores','fracciones'],['mru']],
        [['ecuaciones'],['mruv'],['periodica','atomica'],['sistemas'],['vertical']],
        [['cuadraticas'],['parabolico'],['enlaces','reacciones','balanceo'],['inecuaciones'],['circular']],
        [['potencias','logaritmos'],['estatica','newton'],['mol','estequiometria'],['exponenciales'],['newton','gravitacion']],
        [['progresiones'],['trabajo','energia','potencia'],['gases','soluciones'],['logica','conjuntos','combinatoria'],['impulso']],
        [['razonesTrig','identidades'],['hidrostatica','hidrodinamica'],['equilibrio','ph'],['triangulos','ecuacionesTrig'],['temperatura','ondas','optica']],
        [['recta','circunferencia','parabola','elipse','hiperbola'],['electrostatica','campo','potencial'],['organica','oxigenadas','nitrogenadas'],['limites','derivadas','integrales'],['ohm','circuitos','magnetismo']],
    ];
    function mfqReadings(key) {
        if (key < classCalendar.start || key > classCalendar.end) return [];
        const index = toDate(key).getUTCDay() - 1;
        const week = Math.floor((toDate(monday(key)) - toDate(classCalendar.start)) / 604800000);
        return (mfqSchedule[week]?.[index] || []).map(id => {
            const [slug,topic,first,last] = mfqSections[id];
            const label = {matematicas:'Matemática',fisica:'Física',quimica:'Química'}[slug];
            return {id:'mfq-'+id,slug,topic,section:label+' · 2027',subject:label,
                title:label+' · Texto integrado · Medicina UMSS 2027',credit:'Preparatoria Ben Carson',
                pdf:[first,last],printed:[]};
        });
    }
    function mfqStudy(key, block = -1) {
        const readingOptions = mfqReadings(key);
        const assignment = practiceFor(key,block);
        return {resource:'sufficiency',assignment,reading:readingOptions[0],readingOptions,
            readingSlug:assignment?.subject,readingGroup:'mfq-'+key};
    }

    const weeklyReadings = {
        '2026-11-23': {
            morfofuncion: [
                reading('morfofuncion', 'Histología', 'Capítulo 5', [143,179], [171,207], 'morfo-05', 'histología'),
                reading('morfofuncion', 'Sistema tegumentario', 'Capítulo 6', [180,205], [208,233], 'morfo-06', 'sistema tegumentario'),
            ],
            'biologia-celular': [
                reading('biologia-celular', 'Estructura de la membrana plasmática', 'Capítulo 3', [121,166], [121,166], 'biologia-03', 'estructura de la membrana plasmática'),
                reading('biologia-celular', 'Macrotransporte', 'Capítulo 5', [215,255], [215,255], 'biologia-05', 'macrotransporte a través de la membrana plasmática'),
            ],
        },
    };
    function virtualStudy(key, group) {
        if (group !== 'virtual' || key < classCalendar.start || key > classCalendar.end) return [];
        const dayIndex = toDate(key).getUTCDay() - 1;
        if (dayIndex < 0 || dayIndex > 4) return [];
        const week = Math.round((toDate(monday(key)) - toDate(classCalendar.start)) / 604800000);
        const weekly = weeklyReadings[monday(key)] || {};
        const rows = [];
        const add = (id, kind, start, end, title, description, details = {}) => rows.push({
            id: key + '-virtual-' + id, date:key, kind, start, end, title, description, show:true, ...details,
        });
        const topic = (id, slug, kind, start, end, title, resource, guide) => {
            const options = weekly[slug] || [];
            add(id, kind, start, end, title, options.length ? guide : 'Los temas sugeridos para esta semana aún no están definidos en el cronograma.',
                options.length ? { resource, reading:options[0], readingOptions:options, readingGroup:slug } : {});
        };
        const mfqId = ['mate','fis','quim','mate','fis'][dayIndex];
        const mfq = classCalendar.subjects[mfqId] + ' · ' + classCalendar.topics[week][dayIndex];
        const one = 'Elige un tema de la semana. No tienes que estudiar todos el mismo día.';
        topic('morfo-estudio','morfofuncion','study','07:00','09:00','Morfofunción','reading',one);
        topic('morfo-desglose','morfofuncion','exam','09:00','10:00','Examen pasado · Morfofunción','questions',one);
        topic('morfo-simulacro','morfofuncion','exam','10:00','11:00','Evaluación · Morfofunción','evaluation',one);
        add('suficiencia-1','practice','11:00','12:00',mfq,'Practica el tema de suficiencia del día.',mfqStudy(key,0));
        add('almuerzo','rest','12:00','13:00','Almuerzo y descanso','Haz una pausa antes de retomar el estudio.');
        add('suficiencia-2','practice','13:00','14:00',mfq,'Segunda hora de práctica de suficiencia.',mfqStudy(key,1));
        topic('bio-estudio','biologia-celular','study','14:00','16:00','Biología Celular','reading',one);
        topic('bio-desglose','biologia-celular','exam','16:00','17:00','Examen pasado · Biología Celular','questions',one);
        const virtual = classCalendar.groups.virtual;
        const lesson = virtual.days[dayIndex].map((id,i)=>virtual.times[i] + ' · ' + classCalendar.subjects[id]);
        add('clases','free','17:00','21:00','Clases virtuales en vivo',lesson.join(' | '), {studyLinks:mfqReadings(key)});
        add('descanso','rest','21:00','21:30','Descanso','Pausa después de clases.');
        add('libre','free','22:00','00:00','Estudio libre','Opcional: repasa Digestivo, Respiratorio, Urinario, Linfático o Reproductor.',{resource:'flashcards'});
        return rows;
    }

    function presencialStudy(key, groupId) {
        const weekly = weeklyReadings[monday(key)] || {};
        const rows = [];
        const add = (id, kind, start, end, title, description, details = {}) => rows.push({
            id: key + '-' + groupId + '-' + id, date:key, kind, start, end, title, description, show:true, ...details,
        });
        const topic = (id, slug, kind, start, end, title, resource) => {
            const options = weekly[slug] || [];
            add(id, kind, start, end, title, options.length
                ? 'Continúa con el tema de la semana que elegiste para estudiar.'
                : 'El tema de esta semana aún no está publicado en el cronograma.',
                options.length ? {resource, reading:options[0], readingOptions:options, readingGroup:slug} : {});
        };
        add('almuerzo','rest','13:00','15:00','Almuerzo y descanso','Pausa después de las clases presenciales.');
        topic('morfo-estudio','morfofuncion','study','15:00','17:00','Morfofunción','reading');
        topic('morfo-examen','morfofuncion','exam','17:00','18:00','Examen pasado · Morfofunción','questions');
        topic('morfo-simulacro','morfofuncion','exam','18:00','19:00','Simulacro · Morfofunción','simulation');
        add('cena','rest','19:00','20:00','Cena y descanso','Haz una pausa antes del estudio de Biología Celular.');
        topic('bio-estudio','biologia-celular','study','20:00','22:00','Biología Celular','reading');
        topic('bio-preguntas','biologia-celular','exam','22:00','23:00','Examen pasado · Biología Celular','questions');
        const assignment = practiceFor(key,-1);
        const day = toDate(key).getUTCDay()-1;
        const week = Math.floor((toDate(monday(key))-toDate(classCalendar.start))/604800000);
        const subject = ['mate','fis','quim','mate','fis'][day];
        add('suficiencia','practice','23:00','00:30',classCalendar.subjects[subject]+' · '+classCalendar.topics[week][day],
            'Practica el tema del día. Termina a las 00:30 del día siguiente; puedes extenderlo hasta la 01:00.',
            {...mfqStudy(key,-1),endDayOffset:1});
        return rows;
    }

    // Official class slots come from the three supplied timetable photos. Study chapters
    // are only offered when the teacher confirmed them for this particular week.
    function groupDay(key, groupId) {
        const group = classCalendar.groups[groupId];
        if (!group || key < classCalendar.start || key > classCalendar.end) return [];
        if (groupId === 'virtual') return virtualStudy(key, groupId);
        const index = toDate(key).getUTCDay() - 1;
        if (index < 0 || index > 4) return [];
        const week = Math.floor((toDate(monday(key)) - toDate(classCalendar.start)) / 604800000);
        const weekly = weeklyReadings[monday(key)] || {};
        const slugs = {morfo:'morfofuncion', bio:'biologia-celular', salud:'educacion-salud'};
        const classes = group.days[index].map((subject, slot) => {
            const [start,end] = group.times[slot].split('–');
            const options = weekly[slugs[subject]] || [];
            const mfq = ['mate','fis','quim'].includes(subject);
            const virtualClass = mfq && classCalendar.virtualMfq.includes(key);
            return {
                id:key+'-'+groupId+'-clase-'+slot, date:key, kind:mfq?'practice':'study',
                start:virtualClass?'Por confirmar':start, end:virtualClass?'':end, show:true,
                title:classCalendar.subjects[subject], subject, readingSlug:slugs[subject], officialClass:true,
                description:(virtualClass?'Clase virtual: confirma el horario con la preparatoria. ':'Clase de '+group.location+'. ') +
                    (options.length?'Elige qué tema confirmado de esta semana quieres repasar; son alternativas de estudio.':
                     mfq?classCalendar.topics[week][index]:'El tema de esta clase aún no está publicado.'),
                ...(options.length?{resource:'reading',reading:options[0],readingOptions:options,readingGroup:slugs[subject]}:
                   mfq?mfqStudy(key,-1):{}),
            };
        });
        return classes.concat(presencialStudy(key,groupId));
    }
    function buildGroupPlan(reference, groupId) {
        const plan = new Map();
        if (!Object.prototype.hasOwnProperty.call(classCalendar.groups,groupId)) return plan;
        for (let key=classCalendar.start; key<=classCalendar.end; key=move(key,1)) {
            const items=groupDay(key,groupId);
            if(items.length)plan.set(key,items);
        }
        return plan;
    }
    return { zone, kinds, today, move, monday, formatDay, pageRange, buildSample, classCalendar, virtualStudy, groupDay, buildGroupPlan, practiceFor, practiceQuestions, mfqReadings };
});
