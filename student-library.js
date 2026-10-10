'use strict';
(() => {
    const panel = document.getElementById('library-topics-panel');
    const list = document.getElementById('library-topics');
    const status = document.getElementById('library-status');
    const search = document.getElementById('library-search');
    const buttons = [...document.querySelectorAll('[data-subject]')];
    let request = 0;
    let topics = [];
    let rows = [];
    let subject = '';

    window.openStudyLibrary = function () {
        document.getElementById('study-library').scrollIntoView({ behavior: 'smooth', block: 'start' });
        buttons[0].focus({ preventScroll: true });
    };

    function renderTopics() {
        const query = normalizeDbText(search.value);
        const visible = topics.filter(topic => normalizeDbText(topic.name).includes(query));
        list.replaceChildren();
        status.textContent = visible.length ? `${visible.length} temas disponibles · Elige uno para empezar.` : 'No se encontraron temas. Prueba otra búsqueda o materia.';
        visible.forEach(topic => {
            const button = document.createElement('button');
            button.type = 'button';
            const title = document.createElement('strong');
            title.textContent = topic.name;
            const detail = document.createElement('span');
            detail.textContent = `${topic.count} tarjetas · Empezar →`;
            button.append(title, detail);
            button.addEventListener('click', () => startDeck(topic.name, subject, rows));
            list.append(button);
        });
    }

    async function chooseSubject(value) {
        const token = ++request;
        subject = value;
        topics = [];
        rows = [];
        search.value = '';
        search.disabled = true;
        panel.hidden = false;
        list.replaceChildren();
        status.textContent = 'Cargando tus temas…';
        buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.subject === value)));
        try {
            const data = await loadFlashcards();
            if (token !== request) return;
            rows = data.filter(row => normalizeDbText(campo(row, 'materia')) === normalizeDbText(value));
            const groups = new Map();
            rows.forEach(row => {
                const name = String(campo(row, 'tema') || '').trim();
                if (!name) return;
                const key = normalizeDbText(name);
                const group = groups.get(key) || { name, count: 0 };
                group.count++;
                groups.set(key, group);
            });
            topics = [...groups.values()].sort((a, b) => a.name.localeCompare(b.name, 'es', { numeric: true }));
            search.disabled = false;
            renderTopics();
        } catch (error) {
            if (token !== request) return;
            status.textContent = 'No pudimos cargar los temas. Revisa tu conexión y vuelve a intentar.';
            const retry = document.createElement('button');
            retry.type = 'button';
            retry.textContent = 'Volver a intentar';
            retry.addEventListener('click', () => chooseSubject(value));
            list.append(retry);
        }
    }
    buttons.forEach(button => button.addEventListener('click', () => chooseSubject(button.dataset.subject)));
    search.addEventListener('input', renderTopics);
})();
