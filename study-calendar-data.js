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
            morning: reading('morfofuncion', 'Histología', 'Capítulo 5', [144, 157], [172, 185], 'morfo-05', 'histología'),
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

    function buildSample(reference) {
        const start = move(monday(reference), -28);
        const plan = new Map();
        for (let index = 0; index < 77; index += 1) {
            const key = move(start, index);
            plan.set(key, day(key));
        }
        return plan;
    }

    return { zone, kinds, today, move, monday, formatDay, pageRange, buildSample };
});
