'use strict';
(() => {
    const panel = document.getElementById('library-topics-panel');
    const list = document.getElementById('library-topics');
    const status = document.getElementById('library-status');
    const search = document.getElementById('library-search');
    const buttons = [...document.getElementById('library-subjects').querySelectorAll('[data-subject]')];
    let request = 0;
    let topics = [];
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
        if (showScreen('study-library') === false) return;
        ++request;
        stage(false);
    };
    window.backToStudyTopics = function () {
        if (showScreen('study-library') === false) return;
        ++request;
        stage(Boolean(subject));
    };
    window.quickStartSubject = function (value) {
        if (showScreen('study-library') === false) return;
        return chooseSubject(value);
    };

    function renderTopics() {
        const query = normalizeDbText(search.value);
        const visible = topics.filter(topic => normalizeDbText(topic.name).includes(query));
        list.replaceChildren();
        status.textContent = visible.length ? 'Elige un tema para comenzar tu repaso.' : 'No se encontraron temas. Prueba otra búsqueda o materia.';
        visible.forEach(topic => {
            const row = document.createElement('article');
            row.className = 'library-topic-row';
            const title = document.createElement('strong');
            title.textContent = topic.name.charAt(0).toLocaleUpperCase('es') + topic.name.slice(1);
            const action = document.createElement('button');
            action.className = 'library-topic-action';
            action.textContent = 'Empezar';
            action.setAttribute('aria-label', `Empezar ${topic.name}`);
            action.type = 'button';
            action.addEventListener('click', () => openTopic(topic));
            const info = document.createElement('div');
            info.className = 'library-topic-info';
            const count = document.createElement('span');
            count.className = 'library-topic-count' + (topic.count < 10 ? ' is-small' : '');
            count.textContent = topic.count + ' tarjetas en el tema' + (topic.count < 10 ? ' · colección breve' : '');
            info.append(title, count);
            row.append(info, action);
            list.append(row);
        });
    }

    function chooseSubject(value) {
        const token = ++request;
        subject = value;
        stage(true);
        search.value = '';
        search.disabled = false;
        panel.hidden = false;
        buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.subject === value)));
        const belongs = row => normalizeDbText(row.materia) === normalizeDbText(value);
        const free = CampusAccess.isFree();
        const index = window.CampusCatalogs.flashcards.filter(belongs);
        topics = free ? [] : index.map(row => ({ name: row.tema, count: row.count }));
        renderTopics();
        if (free) {
            status.textContent = 'Cargando los temas de muestra…';
            return CampusAccess.catalog().then(policy => {
                if (token !== request || !CampusAccess.isFree()) return;
                const counts = new Map(policy.filter(belongs).map(row => [normalizeDbText(row.tema), Number(row.free_count)]));
                topics = index.map(row => ({
                    name: row.tema, count: Math.min(row.count, counts.get(normalizeDbText(row.tema)) || 0)
                })).filter(topic => topic.count > 0).slice(0, 2);
                renderTopics();
            }).catch(() => {
                if (token === request) status.textContent = 'No pudimos cargar la muestra. Vuelve a elegir la materia.';
            });
        }
    }

    async function openTopic(topic) {
        const matter = subject;
        const owner = currentUser?.id;
        const area = document.getElementById('study-area');
        area.setAttribute('data-deck-pending', '');
        if (showScreen('study-area') === false) {
            area.removeAttribute('data-deck-pending');
            return;
        }
        const token = ++request;
        const isCurrent = () => request === token && currentUser?.id === owner && currentCampusScreen === 'study-area';
        area.setAttribute('aria-busy', 'true');
        document.getElementById('current-subject').textContent = matter.toLowerCase().replace(/^salud pública$|^salud publica$/, 'educación para la salud');
        document.getElementById('card-tema-name').textContent = topic.name;
        document.getElementById('study-topic-message').textContent = 'Repaso por tema · ' + topic.count + ' tarjetas';
        try {
            const [cards] = await Promise.all([OfficialFlashcards.load(matter, topic.name), window.loadCampusAssets('flashcard-deck')]);
            if (!isCurrent()) return;
            if (!cards.length) {
                if (CampusAccess.isFree()) return CampusAccess.unlock();
                throw new Error('Este tema no tiene tarjetas disponibles.');
            }
            area.removeAttribute('data-deck-pending');
            startDeck(topic.name, matter, cards);
        } catch (_) {
            if (isCurrent()) document.getElementById('study-topic-message').textContent = 'No pudimos abrir las tarjetas. Vuelve a Temas para reintentar.';
        } finally {
            if (isCurrent()) area.removeAttribute('aria-busy');
        }
    }
    buttons.forEach(button => button.addEventListener('click', () => chooseSubject(button.dataset.subject)));
    search.addEventListener('input', renderTopics);
})();
