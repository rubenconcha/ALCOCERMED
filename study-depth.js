/* Keep the bank supplement private and reuse concurrent requests for the same session. */
(() => {
    'use strict';
    let pending;
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .trim().toLowerCase().replace(/\s+/g, ' ');
    const key = row => ['materia', 'tema', 'pregunta'].map(field => normalize(row[field] ?? row[field.toUpperCase()])).join('|');

    async function readBank() {
        const { data } = await getSupabase().auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('Inicia sesión para cargar la ampliación de estudio.');
        if (pending?.token === token) return pending.promise;

        const promise = (async () => {
            const response = await fetch('/api/mindmap?id=banco-ampliado', {
                headers: { Authorization: 'Bearer ' + token },
                cache: 'no-store',
                signal: AbortSignal.timeout(15000),
            });
            if (!response.ok) throw new Error('No pudimos cargar la ampliación de estudio. Reintenta en unos momentos.');
            const bank = await response.json();
            if (!Array.isArray(bank)) throw new Error('La ampliación de estudio no está disponible.');
            const current = await getSupabase().auth.getSession();
            if (current.data.session?.access_token !== token || CampusAccess.isFree()) throw new Error('Tu sesión cambió. Vuelve a abrir el recurso.');
            return bank;
        })();
        pending = { token, promise };
        try { return await promise; }
        finally { if (pending?.promise === promise) pending = null; }
    }

    window.StudyDepth = {
        async merge(rows, kind) {
            if (kind === 'flashcards') {
                if (!window.OfficialFlashcards) throw new Error('La biblioteca oficial no está disponible.');
                return OfficialFlashcards.load();
            }
            if (!window.CampusAccess || CampusAccess.isFree()) return rows;
            if (kind !== 'bank') throw new Error('Recurso de estudio desconocido.');
            const [existing, supplement] = await Promise.all([rows, readBank()]);
            const seen = new Set(existing.map(key));
            return existing.concat(supplement.filter(row => {
                const id = key(row);
                if (seen.has(id)) return false;
                seen.add(id);
                return true;
            }));
        },
    };
})();
