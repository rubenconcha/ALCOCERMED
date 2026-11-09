/* Keep the bank supplement private and reuse concurrent requests for the same session. */
(() => {
    'use strict';
    let pending;
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .trim().toLowerCase().replace(/\s+/g, ' ');
    const field = (row, name) => row[name] ?? row[name.toUpperCase()];
    const key = row => ['materia', 'tema', 'pregunta'].map(name => normalize(field(row, name))).join('|');
    const letters = ['A', 'B', 'C', 'D'];
    const medicine = new Set(['morfofuncion', 'biologia celular', 'biologia celular y molecular',
        'salud publica', 'educacion para la salud', 'educacion en salud e investigacion']);

    function keepCourseQuestion(row) {
        if (!medicine.has(normalize(field(row, 'materia')))) return true;
        return !/\b(?:dificil|dificiles|avanzad[oa]|experto|hard)\b/.test(normalize(field(row, 'dificultad'))) &&
            !/https?:\/\/|ampliacion fisiologica/.test(normalize(field(row, 'fuente'))) &&
            !/^¿?cual es la diferencia entre una ley natural y una teoria cientifica\??$/.test(normalize(field(row, 'pregunta')));
    }

    function findTeaching(row, teaching) {
        const topic = normalize(field(row, 'tema'));
        const subject = normalize(field(row, 'materia'));
        if (topic === 'ciclo celular' && subject === 'biologia celular') {
            const cycle = teaching?.cycle;
            const question = field(row, 'pregunta');
            const guide = cycle && Object.hasOwn(cycle.questions, question) ? cycle.questions[question] : null;
            if (!guide) return null;
            const answer = String(field(row, 'respuesta_correcta')).trim().toUpperCase();
            const correct = letters.includes(answer) ? answer : letters[Number(answer) - 1];
            if (normalize(field(row, 'opcion_' + correct?.toLowerCase())) !== normalize(guide.answer)) return null;
            const { revision, explanation } = guide;
            const section = cycle.sections[guide.section];
            const compatible = revision?.previousOptions.every((option, i) =>
                normalize(option) === normalize(field(row, 'opcion_' + letters[i].toLowerCase())));
            return { explanation, reading: { ...section, slug: cycle.slug, book: cycle.book },
                revision: compatible ? revision : null };
        }
        const source = normalize(field(row, 'fuente'));
        if (subject !== 'morfofuncion' || !/^saladin,.+capitulo (16|18)$/.test(source)) return null;
        const pages = String(field(row, 'paginas_pdf') ?? '').replace(/[–—]/g, '-').replace(/\s+/g, '');
        const reading = teaching?.groups?.[topic + '|' + pages];
        return reading ? { reading } : null;
    }

    function prepareBankQuestion(row) {
        if (!row.bankTeaching) return row;
        const { explanation, reading, revision } = row.bankTeaching;
        const updated = { ...row, banco_lectura: reading, fuente_comentario: reading.book,
            paginas_pdf: reading.start === reading.end ? String(reading.start) : reading.start + '–' + reading.end,
            pagina_impresa: reading.printed || '' };
        if (explanation) updated.justificacion = explanation;
        if (revision?.prompt) updated.pregunta = revision.prompt;
        for (const [letter, option] of Object.entries(revision?.options || {})) updated['opcion_' + letter.toLowerCase()] = option;
        if (revision?.reasons) updated.comentarios_opciones = revision.reasons;
        return updated;
    }

    async function readBank() {
        const { data } = await getSupabase().auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('Inicia sesión para cargar la ampliación de estudio.');
        if (pending?.token === token) return pending.promise;

        const promise = (async () => {
            const response = await fetch('/api/mindmap?id=banco-ampliado&revision=docente', {
                headers: { Authorization: 'Bearer ' + token },
                cache: 'no-store',
                signal: AbortSignal.timeout(15000),
            });
            if (!response.ok) throw new Error('No pudimos cargar la ampliación de estudio. Reintenta en unos momentos.');
            const payload = await response.json();
            const bank = Array.isArray(payload) ? { questions: payload } : payload;
            if (!Array.isArray(bank?.questions)) throw new Error('La ampliación de estudio no está disponible.');
            const current = await getSupabase().auth.getSession();
            if (current.data.session?.access_token !== token || CampusAccess.isFree()) throw new Error('Tu sesión cambió. Vuelve a abrir el recurso.');
            return bank;
        })();
        pending = { token, promise };
        try { return await promise; }
        finally { if (pending?.promise === promise) pending = null; }
    }

    window.StudyDepth = {
        prepareBankQuestion,
        async merge(rows, kind) {
            if (kind === 'flashcards') {
                if (!window.OfficialFlashcards) throw new Error('La biblioteca oficial no está disponible.');
                return OfficialFlashcards.load();
            }
            if (!window.CampusAccess || CampusAccess.isFree()) return rows;
            if (kind !== 'bank') throw new Error('Recurso de estudio desconocido.');
            const [existing, { questions, teaching, reviewedQuestions = [] }] = await Promise.all([rows, readBank()]);
            const eligible = existing.filter(keepCourseQuestion);
            const seen = new Set(eligible.map(key));
            return eligible.concat(questions.filter(row => {
                const id = key(row);
                if (!keepCourseQuestion(row) || seen.has(id)) return false;
                seen.add(id);
                return true;
            })).map(row => {
                const bankTeaching = findTeaching(row, teaching);
                return bankTeaching ? { ...row, bankTeaching } : row;
            }).concat(reviewedQuestions);
        },
    };
})();
