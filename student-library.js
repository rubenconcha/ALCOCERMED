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

    function stage(isTopics) {
        const picker = document.getElementById('library-subjects');
        const back = document.getElementById('library-back');
        const title = document.getElementById('library-title');
        const instruction = document.getElementById('library-instruction');
        if (instruction) instruction.textContent = isTopics ? 'Elige un tema para abrir sus flashcards.' : 'Selecciona una materia para ver sus temas.';
        if (picker) picker.hidden = isTopics;
        if (back) back.hidden = !isTopics;
        if (title) title.textContent = isTopics ? ({'MORFOFUNCION':'Morfofunción','BIOLOGIA CELULAR':'Biología celular','SALUD PUBLICA':'Educación para la Salud'}[subject] || subject) : 'Elige una materia';
        panel.hidden = !isTopics;
    }
    window.openStudyLibrary = function () {
        ++request;
        showScreen('study-library');
        stage(false);
    };
    window.backToStudyTopics = function () {
        showScreen('study-library');
        stage(Boolean(subject));
    };
    window.quickStartSubject = function (value) {
        showScreen('study-library');
        return chooseSubject(value);
    };

    function renderTopics() {
        const query = normalizeDbText(search.value);
        const visible = topics.filter(topic => normalizeDbText(topic.name).includes(query));
        list.replaceChildren();
        status.textContent = visible.length ? (window.CampusAccess?.isFree() ? 'Los temas con candado se desbloquean con un plan.' : 'Elige un tema para comenzar tu repaso.') : 'No se encontraron temas. Prueba otra búsqueda o materia.';
        visible.forEach(topic => {
            const row = document.createElement('article');
            row.className = topic.locked ? 'library-topic-row is-locked' : 'library-topic-row';
            const title = document.createElement('strong');
            title.textContent = topic.name.charAt(0).toLocaleUpperCase('es') + topic.name.slice(1);
            if (topic.locked) {
                const icon = document.createElement('span');
                icon.className = 'library-topic-lock-icon';
                icon.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i> Bloqueado';
                title.append(icon);
            }
            const action = document.createElement(topic.locked ? 'a' : 'button');
            action.className = topic.locked ? 'library-topic-action is-locked' : 'library-topic-action';
            action.textContent = topic.locked ? 'Desbloquear →' : 'Empezar';
            action.setAttribute('aria-label', topic.locked ? `Ver planes para desbloquear ${topic.name}` : `Empezar ${topic.name}`);
            if (topic.locked) action.href = '/planes?desde=campus#planes';
            else {
                action.type = 'button';
                action.addEventListener('click', () => startDeck(topic.name, subject, rows));
            }
            const info = document.createElement('div');
            info.className = 'library-topic-info';
            const count = document.createElement('span');
            count.className = 'library-topic-count' + (!topic.locked && topic.count < 10 ? ' is-small' : '');
            count.textContent = topic.locked ? 'Requiere un plan vigente' : topic.count + ' tarjetas en el tema' + (topic.count < 10 ? ' · colección breve' : '');
            info.append(title, count);
            row.append(info, action);
            list.append(row);
        });
    }

    async function chooseSubject(value) {
        const token = ++request;
        subject = value;
        stage(true);
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
            if (window.OfficialFlashcards) {
                const free = Boolean(window.CampusAccess?.isFree());
                topics = OfficialFlashcards.catalog().filter(t => normalizeDbText(t.materia) === normalizeDbText(value))
                    .map(t => ({name:t.tema,count:free?Number(t.free_count):Number(t.count),locked:Boolean(t.locked)}));
            } else if (window.CampusAccess && CampusAccess.isFree()) {
                const catalog = await CampusAccess.catalog();
                if (token !== request) return;
                topics = catalog.filter(t => normalizeDbText(t.materia) === normalizeDbText(value)).map(t => ({name:t.tema,count:Number(t.free_count),locked:!Number(t.free_count)}));
            }
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
