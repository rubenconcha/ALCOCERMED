(function (root, factory) {
    const data = factory();
    if (typeof module === 'object' && module.exports) module.exports = data;
    else root.StudyCalendarData = data;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    const zone = 'America/La_Paz';
    const kinds = {
        video: { label: 'Videoclase', color: '#8950fc' },
        study: { label: 'Estudio', color: '#f3a31b' },
        exam: { label: 'Práctica y evaluación', color: '#d74c50' },
        rest: { label: 'Descanso', color: '#27aa5c' },
        free: { label: 'Libre estudio', color: '#3786d2' },
    };
    const units = [
        ['Morfofunción', 'Anatomía y fisiología'],
        ['Biología celular', 'Introducción a la biología celular'],
        ['Morfofunción', 'Sistema óseo'],
        ['Educación para la Vida', 'Educación en salud'],
        ['Suficiencia académica', 'Conversiones y unidades'],
        ['Biología celular', 'Membrana y transporte celular'],
        ['Morfofunción', 'Histología'],
        ['Suficiencia académica', 'Concentración y proporcionalidad'],
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

    function day(key) {
        const date = toDate(key);
        const weekday = date.getUTCDay();
        const week = Math.floor(date.getTime() / (86400000 * 7));
        const index = ((week + weekday) % units.length + units.length) % units.length;
        const [subject, topic] = units[index];
        const sufficient = subject === 'Suficiencia académica';
        const make = (id, kind, start, end, title, resource, show, description) => ({
            id: key + '-' + id, date: key, kind, start, end, title, resource, show, subject, description,
        });
        if (weekday === 0) {
            return [make('descanso', 'rest', '08:00', '', 'Descanso', '', true,
                'Reserva este día para descansar o reorganizar tu próxima semana de estudio.')];
        }
        if (weekday === 6) {
            return [
                make('simulacro', 'exam', '09:00', '10:40', 'Simulacro de práctica', 'simulation', true,
                    'Elige un simulacro del campus y resuélvelo con el tiempo indicado en la actividad.'),
                make('revision', 'exam', '11:00', '11:35', 'Corrección del simulacro', 'results', false,
                    'Revisa tus respuestas y anota los temas que necesitas repasar.'),
                make('libre', 'free', '15:00', '16:00', 'Libre estudio', 'flashcards', true,
                    'Elige un tema pendiente y repásalo con flashcards.'),
            ];
        }
        return [
            make('video', 'video', '09:00', '09:25', 'Videoclase de apoyo · ' + subject, 'videos', weekday === 2 || weekday === 4,
                'Abre las videoclases del campus y elige el material disponible para tu tema.'),
            make('estudio', 'study', '09:25', '10:40', 'Estudio · ' + topic, sufficient ? 'practice' : 'summaries', true,
                'Revisa el material del tema y anota las ideas que quieres practicar.'),
            make('pausa', 'rest', '10:40', '11:00', 'Descanso', '', false,
                'Toma una pausa breve antes de continuar con las preguntas.'),
            make('preguntas', 'exam', '11:00', '11:35', 'Banco de preguntas · ' + subject, sufficient ? 'practice' : 'questions', weekday === 3,
                'Selecciona tu materia y practica las preguntas del tema.'),
            make('evaluacion', 'exam', '11:35', '12:00', 'Evaluación por tema', 'evaluation', false,
                'Pon a prueba lo aprendido con una evaluación del campus.'),
            make('libre', 'free', '15:00', '16:00', 'Libre estudio', 'flashcards', weekday === 1 || weekday === 5,
                'Repasa a tu ritmo y vuelve a los puntos que quedaron pendientes.'),
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

    return { zone, kinds, today, move, monday, formatDay, buildSample };
});
