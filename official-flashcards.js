/* This catalogue replaces legacy flashcards; a failed load never restores old decks. */
(function () {
    'use strict';
    let pending = null;
    let catalog = [];
    let generation = 0;
    function clear() { generation++; pending = null; catalog = []; }
    async function load() {
        const client = getSupabase();
        const { data } = await client.auth.getSession();
        const token = data.session?.access_token;
        if (!token) throw new Error('Inicia sesión para abrir tus flashcards.');
        if (pending?.token === token) return pending.promise;
        const ownerGeneration = generation;
        const promise = (async () => {
            const response = await fetch('/api/flashcards', {
                headers: { Authorization: 'Bearer ' + token }, cache: 'no-store',
                signal: AbortSignal.timeout(20000)
            });
            if (!response.ok) throw new Error('No pudimos cargar las flashcards oficiales. Vuelve a intentarlo.');
            const payload = await response.json();
            const current = await client.auth.getSession();
            if (current.data.session?.access_token !== token || generation !== ownerGeneration) throw new Error('Tu sesión cambió. Vuelve a abrir las flashcards.');
            if (payload.schema !== 'official-flashcards-v1' || !Array.isArray(payload.cards) || !Array.isArray(payload.catalog)) {
                throw new Error('La biblioteca oficial no está disponible.');
            }
            if (payload.cards.some(card => !card.id || !card.pregunta || !card.respuesta || !card.chapter_title || !card.reference || !card.official_source)) {
                throw new Error('La biblioteca oficial tiene una referencia incompleta.');
            }
            catalog = payload.catalog;
            return payload.cards;
        })();
        pending = { token, promise };
        try { return await promise; } finally { if (pending?.promise === promise) pending = null; }
    }
    window.OfficialFlashcards = { load, clear, catalog: () => catalog.slice() };
    window.addEventListener('campus-access-change', clear);
})();
