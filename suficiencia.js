/* Suficiencia académica: contenido privado, respuestas y progreso por estudiante. */
(function () {
    'use strict';
    const C = window.SufficiencyCore, labels = C.practiceSubjects;
    const examLevel = 'dificil';
    const openEntranceLibrary = window.openCampusSimulations || window.openSimulacro;
    const root = document.getElementById('suficiencia-screen');
    let bank = null, hasMedicine = false, owner = null, attempt = null, questions = [], clock = null, generation = 0, area = 'matematicas', level = 'facil', catalogueArea = 'matematicas', catalogueMode = 'config', configSubject = '', configTopic = '', ending = false, starting = false, pendingConfirmation = null, renderedPassage = null, cataloguePage = 0, catalogueQuery = '';
    let catalogueRequest = null, viewRevision = 0;
    let preparation, preparationTimer;
    const details = new Map(), pendingPacks = new Map();
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const key = id => 'alcocermed:suficiencia:v1:' + id;
    const user = () => typeof currentUser !== 'undefined' ? currentUser?.id : null;
    const title = value => {
        if (value === 'config') return C.configurationLabel(bank, attempt?.configuration);
        const p = C.paper(bank, value);
        if (p) return p.difficulty ? `${labels[p.subject] || 'Completo'} · ${C.levels[p.difficulty]} · ${p.title}` : p.title;
        return labels[value] || (value.startsWith('texto:') ? bank?.passages.find(p => p.id === value.slice(6))?.title : 'Simulacro');
    };
    const button = (action, text, extra = '') => `<button type="button" class="sf-button ${extra}" data-sf="${action}">${text}</button>`;
    const header = () => `<div class="banco-header sf-heading"><button type="button" class="btn-back-game" data-sf="topics" aria-label="Volver a simulacros"><i class="fas fa-arrow-left" aria-hidden="true"></i> volver</button><div><h1 class="banco-title"><svg class="study-tool-icon" aria-hidden="true"><use href="/assets/study-tools.svg?v=2#bank"></use></svg> Práctica por materia</h1><p class="banco-subtitle">Elige materia y tema. La prueba usa preguntas difíciles y la revisión se abre al terminar.</p></div></div>`;
    function stopClock() { clearInterval(clock); clock = null; }
    function cancelPreparation() {
        if (preparationTimer) clearTimeout(preparationTimer);
        preparationTimer = null;
        preparation = null;
    }
    function clear() {
        generation++; stopClock(); cancelPreparation(); if (pendingConfirmation) pendingConfirmation(false);
        bank = null; hasMedicine = false; owner = null; attempt = null; questions = []; level = 'facil'; catalogueArea = 'matematicas'; catalogueMode = 'config'; configSubject = ''; configTopic = ''; ending = false; starting = false; renderedPassage = null;
        catalogueRequest = null; details.clear(); pendingPacks.clear();
        root.replaceChildren();
    }
    function ask(message) {
        if (pendingConfirmation) pendingConfirmation(false);
        return new Promise(resolve => {
            const overlay = document.createElement('div'); overlay.className = 'sf-confirm-overlay';
            overlay.innerHTML = `<section class="sf-confirm" role="alertdialog" aria-modal="true" aria-labelledby="sf-confirm-title"><h2 id="sf-confirm-title">${esc(message)}</h2><div>${button('cancel-confirm', 'Seguir practicando')}${button('accept-confirm', 'Sí, continuar', 'sf-primary')}</div></section>`;
            const previousFocus = document.activeElement;
            pendingConfirmation = answer => { overlay.remove(); pendingConfirmation = null; previousFocus?.focus(); resolve(answer); };
            overlay.addEventListener('keydown', event => {
                if (event.key === 'Escape') { event.preventDefault(); pendingConfirmation?.(false); }
                if (event.key === 'Tab') {
                    const buttons = overlay.querySelectorAll('button');
                    if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[1].focus(); }
                    else if (!event.shiftKey && document.activeElement === buttons[1]) { event.preventDefault(); buttons[0].focus(); }
                }
            });
            root.append(overlay); overlay.querySelector('button').focus();
        });
    }
    function save() {
        if (!attempt || user() !== owner) return;
        try { localStorage.setItem(key(owner), JSON.stringify(attempt)); }
        catch (_) { const notice = root.querySelector('[data-save-status]'); if (notice) notice.textContent = 'Este navegador no permite guardar el avance. Mantén la página abierta.'; }
    }
    async function requestResources(view, ids) {
        const { data, error } = await getSupabase().auth.getSession();
        const session = data?.session;
        if (error || !session || session.user.id !== user() || session.user.id !== owner) throw new Error('Vuelve a iniciar sesión para abrir esta sección.');
        const headers = { Authorization: 'Bearer ' + session.access_token };
        if (ids) headers['Content-Type'] = 'application/json';
        const response = await fetch('/api/suficiencia?collection=' + C.officialCollection + '&vista=' + view, {
            headers, cache: 'no-store', signal: AbortSignal.timeout(20000),
            ...(ids ? { method: 'POST', body: JSON.stringify({ ids }) } : {}),
        });
        if (!response.ok) throw new Error(response.status === 403 ? 'Necesitas una suscripción activa para practicar.' : 'No pudimos cargar las preguntas. Intenta de nuevo.');
        return response.json();
    }
    function load() {
        const id = user();
        if (!id) return Promise.reject(new Error('Vuelve a iniciar sesión para abrir esta sección.'));
        if (owner !== id) { clear(); owner = id; }
        if (bank) return Promise.resolve(true);
        if (catalogueRequest) return catalogueRequest;
        const revision = generation;
        const request = requestResources('catalogo').then(content => {
            if (revision !== generation || user() !== id) return false;
            const compact = content?.view === 'catalogo';
            if (compact ? !Array.isArray(content.questions) || !Array.isArray(content.passages) : !C.validate(content)) {
                throw new Error('El banco está en revisión. Intenta de nuevo más tarde.');
            }
            if (!compact) for (const question of content.questions) details.set(question.id, question);
            bank = content;
            hasMedicine = content.questions.some(C.isBiomedical);
            try { attempt = C.restore(JSON.parse(localStorage.getItem(key(id))), bank, id); } catch (_) { attempt = null; }
            if (attempt?.ids.every(qid => details.has(qid))) questions = attempt.ids.map(qid => details.get(qid));
            return true;
        }).finally(() => { if (catalogueRequest === request) catalogueRequest = null; });
        catalogueRequest = request;
        return request;
    }
    async function questionPack(ids) {
        if (owner !== user() || window.CampusAccess?.isFree()) return [];
        const needed = ids.filter(id => !details.has(id));
        if (needed.length) {
            const revision = generation, requestKey = needed.join(',');
            if (!pendingPacks.has(requestKey)) {
                const request = requestResources('preguntas', needed).then(content => {
                    if (revision !== generation || owner !== user()) return;
                    if (content.version !== bank.version || !Array.isArray(content.questions) ||
                        content.questions.length !== needed.length || !content.questions.every((q, i) => q?.id === needed[i] && Array.isArray(q.options)) ||
                        !Array.isArray(content.passages)) throw new Error('No pudimos abrir estas preguntas. Intenta de nuevo.');
                    for (const q of content.questions) details.set(q.id, q);
                    for (const passage of content.passages) {
                        const index = bank.passages.findIndex(p => p.id === passage.id);
                        if (index >= 0) bank.passages[index] = passage;
                    }
                }).finally(() => { if (pendingPacks.get(requestKey) === request) pendingPacks.delete(requestKey); });
                pendingPacks.set(requestKey, request);
            }
            await pendingPacks.get(requestKey);
            if (revision !== generation || owner !== user()) return [];
        }
        return ids.map(id => details.get(id));
    }
    async function open(next = 'matematicas') {
        if (next === 'completos') next = 'integral';
        if (!labels[next] && next !== 'integral' && next !== 'completos') next = 'matematicas';
        if (window.CampusAccess?.isFree()) return window.CampusAccess.unlock();
        if (typeof showScreen === 'function' && showScreen('suficiencia-screen') === false) return;
        const revision = ++viewRevision;
        area = next; catalogueArea = next; catalogueMode = 'config'; cataloguePage = 0; catalogueQuery = '';
        document.getElementById('nav-simulacro')?.classList.add('nav-item-active');
        try {
            const loading = load();
            if (!bank) catalogue();
            if (!await loading || revision !== viewRevision) return;
            area = next; catalogueArea = next;
            const focused = document.activeElement?.id;
            catalogue(false);
            if (focused === 'sf-config-subject') root.querySelector('#sf-config-subject')?.focus({ preventScroll: true });
            prepareConfiguration();
            const saved = attempt;
            if (saved && !saved.finished) questionPack(saved.ids).then(restored => {
                if (restored.length && attempt === saved && revision === viewRevision) { questions = restored; startClock(); }
            }).catch(() => { /* Continuing the attempt offers another chance to load its questions. */ });
        } catch (error) {
            if (revision !== viewRevision) return;
            if (!user()) return clear();
            root.innerHTML = header() + `<div class="sf-notice" role="alert">${esc(error.message)}</div>` + button('reload', 'Volver a intentar');
        }
    }
    function previousScores() {
        try {
            const records = JSON.parse(localStorage.getItem(key(owner) + ':papers')) || {};
            return Object.fromEntries(Object.entries(records).filter(([id, result]) => result && result.owner === owner && result.paperId === id && Number.isFinite(result.percent) && result.percent >= 0 && result.percent <= 100 && Number.isInteger(result.correct) && Number.isInteger(result.total) && result.correct >= 0 && result.correct <= result.total && result.total === C.paper(bank, 'simulacro:' + id)?.questionCount));
        } catch (_) { return {}; }
    }
    function rememberResult() {
        const selected = C.paper(bank, attempt.area);
        if (!selected || owner !== user()) return;
        const score = C.grade(questions, attempt.answers), records = previousScores();
        records[selected.id] = { owner, paperId: selected.id, percent: score.percent, correct: score.correct, total: score.total, at: attempt.finishedAt, ...(attempt.result_snapshot || {}) };
        try { localStorage.setItem(key(owner) + ':papers', JSON.stringify(records)); } catch (_) { /* Last attempt remains available even if history cannot be saved. */ }
    }
    function filteredPapers() {
        const normalized = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const query = normalized(catalogueQuery).trim();
        const papers = catalogueMode === 'levels' ? bank.levelPapers : [...bank.levelPapers, ...bank.papers];
        return (papers || []).filter(p => (catalogueMode === 'levels' ? p.subject === area && p.difficulty === level : area === 'integral' || (area === 'completos' ? p.subject === 'integral' : p.subject === area)) &&
            (!query || normalized(p.title + ' ' + p.description + ' ' + (labels[p.subject] || 'completo') + ' ' + (C.levels[p.difficulty] || '')).includes(query)));
    }
    const configuration = () => ({ subject: configSubject, topic: configTopic, level: examLevel });
    function prepareConfiguration() {
        cancelPreparation();
        if (!bank || !configTopic || window.navigator?.connection?.saveData) return;
        const config = configuration();
        const seed = crypto.getRandomValues(new Uint32Array(1))[0];
        const selection = C.selectConfiguredRows(bank, config, seed);
        if (!selection.length) return;
        const planned = preparation = { key: JSON.stringify(config), seed };
        preparationTimer = setTimeout(() => {
            if (preparation === planned) questionPack(selection.map(q => q.id)).catch(() => {});
        }, 200);
    }
    function subjectOptions() {
        const option = ([id,label]) => `<option value="${id}" ${configSubject===id?'selected':''} ${bank&&Object.hasOwn(C.biomedicalSubjects,id)&&!hasMedicine?'disabled':''}>${esc(label)}</option>`;
        return '<optgroup label="Materias de Medicina">' + Object.entries(C.biomedicalSubjects).map(option).join('') +
            '</optgroup><optgroup label="Suficiencia académica">' + Object.entries({...C.subjects,integral:'Completo · cuatro materias'}).map(option).join('') + '</optgroup>';
    }
    function configurationControls() {
        const cfg=configuration(),count=bank ? C.configurationCount(bank,cfg) : 0,options=bank && configSubject ? C.topics(bank,configSubject) : [];
        const topicLabel = configSubject ? (bank ? 'seleccionar tema' : 'cargando temas…') : 'primero selecciona una materia';
        const official = options.filter(t=>t.key.startsWith(C.officialTopicPrefix));
        const optionHtml = t => `<option value="${esc(t.key)}" ${configTopic===t.key?'selected':''}>${esc(t.label)}</option>`;
        const topicOptions = options.filter(t=>!t.key.startsWith(C.officialTopicPrefix)).map(optionHtml).join('') +
            (official.length ? '<optgroup label="Capítulos por tema">' + official.map(optionHtml).join('') + '</optgroup>' : '');
        const summary = !configSubject || !configTopic ? 'Elige una materia y un tema para ver las preguntas disponibles.' :
            count ? 'La prueba tiene <strong>' + count + '</strong> ' + (count === 1 ? 'pregunta difícil' : 'preguntas difíciles') + '.' :
                'Este tema todavía no tiene preguntas difíciles. Elige otro tema.';
        return `<section class="banco-config-card sf-bank-config" aria-label="Elegir tema para la práctica">
            <div class="banco-selects-row">
                <div class="banco-select-group">
                    <label class="banco-select-label" for="sf-config-subject"><i class="fas fa-book-medical" aria-hidden="true"></i> MATERIA</label>
                    <select id="sf-config-subject" class="banco-select-btn sf-bank-select"><option value="">seleccionar materia</option>${subjectOptions()}</select>
                </div>
                <div class="banco-select-group">
                    <label class="banco-select-label" for="sf-config-topic"><i class="fas fa-tag" aria-hidden="true"></i> TEMA</label>
                    <select id="sf-config-topic" class="banco-select-btn sf-bank-select" ${bank && configSubject ? '' : 'disabled'}>
                        <option value="">${topicLabel}</option>${bank && configSubject && configSubject !== 'integral' ?
                            `<option value="*" ${configTopic === '*' ? 'selected' : ''}>Todos los temas</option>` : ''}${topicOptions}
                    </select>
                </div>
            </div>
            <div class="banco-config-summary" role="status" aria-live="polite"><div class="banco-summary-item">
                <i class="fas fa-question-circle" aria-hidden="true"></i><span>${summary}</span>
            </div></div>
            <button type="button" data-sf="run" data-area="config" class="btn-primary banco-start-btn sf-bank-start" ${count ? '' : 'disabled'}>
                <i class="fas fa-play" aria-hidden="true"></i> Iniciar prueba
            </button>
        </section>`;
    }
    function progressPanel() {
        const snapshot = attempt?.result_snapshot;
        const savedScore = snapshot && snapshot.owner === owner && ['correct', 'total', 'percent'].every(key => Number.isInteger(snapshot[key])) ? snapshot : null;
        const score = attempt?.finished ? (questions.length ? C.grade(questions, attempt.answers) : savedScore) : null;
        return `<section class="banco-dificiles-panel sf-bank-progress" aria-label="Tu seguimiento"><div class="banco-dificiles-header"><div class="banco-dificiles-title-row"><div class="banco-dificiles-icon"><i class="fas fa-brain" aria-hidden="true"></i></div><div><h2 class="banco-dificiles-title">tu seguimiento personalizado</h2><p class="banco-dificiles-subtitle">tu última práctica y las respuestas que puedes repasar</p></div></div></div><div class="banco-dificiles-state">${attempt?`<strong>${attempt.finished?'Tu último resultado':'Continúa donde te quedaste'}</strong><p>${esc(title(attempt.area))}</p><p>${score?score.correct+' de '+score.total+' correctas · '+score.percent+'%':Object.keys(attempt.answers).length+' de '+attempt.ids.length+' respondidas'}</p>${button('resume',attempt.finished?'Ver resultado y explicaciones':'Continuar simulacro')}`:`<i class="fas fa-bullseye" aria-hidden="true"></i><strong>¡Tu seguimiento empieza aquí!</strong><p>Responde un simulacro y aquí podrás consultar tu resultado<br>y revisar las explicaciones de lo que te costó.</p>`}</div></section>`;
    }
    function renderCatalogueCards() {
        const grid = root.querySelector('[data-sf-cards]'); if (!grid) return;
        const matches = filteredPapers(), pages = Math.max(1, Math.ceil(matches.length / 12));
        cataloguePage = Math.max(0, Math.min(cataloguePage, pages - 1));
        const scores = previousScores();
        grid.innerHTML = matches.slice(cataloguePage * 12, cataloguePage * 12 + 12).map(p => {
            const result = scores[p.id], icon = p.subject === 'integral' ? 'exam' : p.subject === 'lectura' ? 'summary' : 'bank';
            return `<article class="sim-library-card sf-catalogue-card" data-paper="${p.id}"><div class="sf-card-top"><span class="sim-library-stage">${p.subject === 'integral' ? 'CUATRO MATERIAS' : esc(labels[p.subject])}${p.difficulty ? ' · ' + esc(C.levels[p.difficulty]) : ''}</span><svg aria-hidden="true"><use href="/assets/study-tools.svg?v=2#${icon}"></use></svg></div><h2>${esc(p.title)}</h2><p class="sim-library-description">${esc(p.description)}</p><div class="sf-card-meta"><span><i class="far fa-file-alt" aria-hidden="true"></i> ${p.questionCount} preguntas</span><span><i class="far fa-clock" aria-hidden="true"></i> ${p.minutes} min</span></div><span class="sf-comment-label">Con explicación paso a paso</span>${result ? `<span class="sf-completed">Último resultado: ${result.correct}/${result.total} · ${result.percent}%</span>` : ''}${button('run', result ? 'Volver a practicar' : 'Empezar', 'sf-primary btn-primary').replace('data-sf="run"', `data-sf="run" data-area="simulacro:${p.id}"`)}</article>`;
        }).join('') || '<p class="sf-notice">No encontramos simulacros con esa búsqueda.</p>';
        const status = root.querySelector('[data-sf-status]');
        if (status) status.textContent = matches.length + ' simulacros' + (catalogueMode === 'levels' && area !== 'integral' ? ' · ' + new Set(matches.flatMap(p => p.questionIds)).size + ' preguntas' : '') + (matches.length ? ` · ${cataloguePage * 12 + 1}–${Math.min(matches.length, (cataloguePage + 1) * 12)}` : '');
        const pager = root.querySelector('[data-sf-pagination]');
        if (pager) pager.innerHTML = pages > 1 ? `${button('page-prev', '← Anterior').replace('data-sf="page-prev"', `data-sf="page-prev" ${cataloguePage === 0 ? 'disabled' : ''}`)}<span>Página ${cataloguePage + 1} de ${pages}</span>${button('page-next', 'Siguiente →').replace('data-sf="page-next"', `data-sf="page-next" ${cataloguePage === pages - 1 ? 'disabled' : ''}`)}` : '';
    }
    function catalogue(scroll = true) {
        stopClock();
        if(catalogueMode==='config') {
            root.classList.add?.('sf-bank-layout');
            if (!bank) {
                root.innerHTML = header() + configurationControls() + '<p role="status" class="sf-notice">Cargando temas y progreso…</p>';
                return;
            }
            const medicineNotice = hasMedicine ? '' : `<div class="sf-notice" role="status">No pudimos cargar las materias de Medicina. ${button('reload','Volver a cargar')}</div>`;
            root.innerHTML=header()+configurationControls()+medicineNotice+progressPanel()+`<div class="sf-bank-links">${button('legacy','Ver simulacros anteriores')}${typeof openEntranceLibrary==='function'?button('topics','Simulacros completos y semanales'):''}</div>`;
        } else {
            root.classList.remove?.('sf-bank-layout');
            root.innerHTML=header()+`<div class="sf-legacy-heading"><h2>Simulacros anteriores</h2>${button('config','Volver al selector')}</div><div class="sf-catalogue-filter"><label for="sf-area-filter">Materia<select id="sf-area-filter"><option value="integral">Todos</option>${Object.entries(C.subjects).map(([id,name])=>`<option value="${id}" ${area===id?'selected':''}>${name}</option>`).join('')}</select></label><label for="sf-search">Buscar simulacro<input id="sf-search" type="search" placeholder="Nombre o número" value="${esc(catalogueQuery)}"></label><p data-sf-status role="status" aria-live="polite"></p></div><div class="sf-catalogue" data-sf-cards></div><nav class="sf-pagination" data-sf-pagination aria-label="Páginas de simulacros"></nav>`;
            renderCatalogueCards();
        }
        if(scroll)root.scrollIntoView({block:'start',behavior:'instant'});
    }
    async function start(selectedArea) {
        if (starting) return;
        const target = selectedArea || area;
        const configured = target === 'config' ? { ...(selectedArea ? configuration() : attempt?.configuration || configuration()), level: examLevel } : null;
        if (configured && (!bank || !C.configurationCount(bank, configured))) {
            if (!selectedArea) showLoadError(new Error('Este tema todavía no tiene preguntas difíciles. Elige otro tema.'));
            return;
        }
        const revision = generation, view = viewRevision;
        starting = true;
        if (attempt && !attempt.finished && !await ask('Hay una práctica en curso. ¿Quieres reemplazarla por una nueva?')) { starting = false; return; }
        const startButton = root.querySelector('[data-sf="start"]'); if (startButton) startButton.disabled = true;
        try {
            if (!await load() || view !== viewRevision) return;
            const seed = configured && preparation?.key === JSON.stringify(configured)
                ? preparation.seed : crypto.getRandomValues(new Uint32Array(1))[0];
            cancelPreparation();
            const selection = configured ? C.selectConfiguredRows(bank, configured, seed) : C.selectRows(bank, target, seed);
            if (!selection.length) throw new Error('No hay preguntas disponibles para esta selección.');
            const prepared = await questionPack(selection.map(q => q.id));
            if (!prepared.length || view !== viewRevision || revision !== generation) return;
            questions = prepared; area = target;
            const chosen = C.paper(bank, area);
            if (chosen) { catalogueArea = chosen.subject; if (chosen.difficulty) level = chosen.difficulty; }
            const minutes = configured ? questions.length * 3 : C.paper(bank, area)?.minutes || (area === 'integral' ? 60 : Math.ceil(questions.length * 1.5));
            attempt = { owner, version: bank.version, area, seed, ...(configured ? {configuration: configured} : {}), ids: questions.map(q => q.id), answers: {}, flags: [], index: 0, deadline: Date.now() + minutes * 60000, startedAt: Date.now(), finished: false };
            renderedPassage = null; save(); renderQuestion(); root.scrollIntoView({ block: 'start', behavior: 'instant' }); startClock();
        } catch (e) {
            if (view === viewRevision && revision === generation) showLoadError(e);
            if (startButton) startButton.disabled = false;
        } finally { if (revision === generation) starting = false; }
    }
    function showLoadError(error) {
        const notice = document.createElement('p'); notice.className = 'sf-notice'; notice.setAttribute('role', 'alert'); notice.textContent = error.message; root.prepend(notice);
    }
    function passage(q) {
        const p = bank.passages.find(p => p.id === q.passageId);
        return p ? `<article class="sf-passage"><span class="sf-eyebrow">LEE EL TEXTO</span><h2>${esc(p.title)}</h2>${p.text.split('\n\n').map(t => `<p>${esc(t)}</p>`).join('')}</article>` : '';
    }
    function helpBlock(q) {
        const expanded = attempt.helpOpen?.includes(q.id) === true;
        const medical = C.isBiomedical(q);
        const show = medical ? 'Ver explicación' : 'Ver resolución paso a paso';
        const hide = medical ? 'Ocultar la explicación' : 'Ocultar la resolución';
        const caption = medical ? 'Puedes consultar la explicación y después elegir tu respuesta.' : 'Puedes consultar los pasos y después elegir tu respuesta.';
        return `<div class="sf-question-help"><button type="button" class="sf-button sf-help-button" data-sf="help" aria-expanded="${expanded}" aria-controls="sf-current-help">${expanded ? hide : show}</button><p class="sf-help-caption">${caption}</p><div id="sf-current-help"${expanded ? '' : ' hidden'}>${expanded ? `${C.solutionHtml(q)}<p class="sf-help-answer"><b>Respuesta del ejercicio:</b> ${esc(String.fromCharCode(65 + q.correct) + '. ' + C.optionText(q, q.correct))}</p>${button('hide-help', 'Volver a las respuestas')}` : ''}</div></div>`;
    }
    function renderQuestion(focus = false) {
        if (!attempt || attempt.finished) return;
        root.classList.remove?.('sf-bank-layout');
        const q = questions[attempt.index], answered = Object.keys(attempt.answers).length;
        root.innerHTML = `<div class="sf-exam-top"><div><span class="sf-eyebrow">${esc(title(attempt.area))}</span><h1>Pregunta ${attempt.index + 1} <small>de ${questions.length}</small></h1></div><div class="sf-timer" role="timer" aria-label="Tiempo restante" id="sf-timer"></div></div><div class="sf-progress" role="progressbar" aria-label="Preguntas respondidas" aria-valuenow="${answered}" aria-valuemin="0" aria-valuemax="${questions.length}"><span style="width:${answered / questions.length * 100}%"></span></div><p class="sf-progress-label">${answered} de ${questions.length} respondidas <span data-save-status></span></p><div class="sf-exam-layout"><div>${passage(q)}<section class="sf-question"><div class="sf-question-meta">${esc(labels[q.subject])} · ${esc(q.topic)}${q.difficulty ? `<span class="sf-level-badge sf-level-${q.difficulty}">${esc(C.levels[q.difficulty])}</span>` : ''}</div>${C.promptHtml(q)}${attempt.area === 'config' ? '' : helpBlock(q)}<fieldset class="sf-options"><legend class="sf-sr-only">Elige una respuesta</legend>${q.options.map((option, i) => `<label class="${attempt.answers[q.id] === i ? 'is-selected' : ''}"><input type="radio" name="sf-answer" value="${i}" ${attempt.answers[q.id] === i ? 'checked' : ''}><span class="sf-letter">${String.fromCharCode(65 + i)}</span><span>${esc(C.optionText(q, i))}</span></label>`).join('')}</fieldset><div class="sf-question-tools">${button('flag', attempt.flags.includes(q.id) ? '★ Marcada para revisar' : '☆ Marcar para revisar')}${button('erase', 'Borrar respuesta')}</div><div class="sf-bottom-nav">${button('prev', '← Anterior').replace('data-sf="prev"', `data-sf="prev" ${attempt.index === 0 ? 'disabled' : ''}`)}${attempt.index < questions.length - 1 ? button('next', 'Siguiente →', 'sf-primary') : button('finish', 'Terminar y corregir', 'sf-primary')}</div></section></div><aside class="sf-question-nav"><h3>Tus preguntas</h3><div class="sf-number-grid">${questions.map((item, index) => `<button type="button" data-sf="jump" data-index="${index}" class="${attempt.answers[item.id] !== undefined ? 'is-answered' : ''} ${attempt.flags.includes(item.id) ? 'is-flagged' : ''}" ${index === attempt.index ? 'aria-current="step"' : ''} aria-label="Pregunta ${index + 1}${attempt.answers[item.id] !== undefined ? ', respondida' : ', pendiente'}${attempt.flags.includes(item.id) ? ', marcada' : ''}">${index + 1}</button>`).join('')}</div><p>Las preguntas respondidas aparecen en azul. ★ indica una pregunta marcada.</p>${button('finish', 'Terminar y corregir')}${button('catalogue', 'Volver a las materias')}</aside></div>`;
        const changedReading = q.passageId && q.passageId !== renderedPassage;
        renderedPassage = q.passageId || null;
        tick();
        if (changedReading) root.scrollIntoView({ block: 'start', behavior: 'instant' });
        else if (focus) root.querySelector('#sf-question-title')?.focus();
    }
    function tick() {
        if (!attempt || attempt.finished || !questions.length) return stopClock();
        if (owner !== user() || window.CampusAccess?.isFree()) { clear(); return; }
        const seconds = Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 1000));
        const el = root.querySelector('#sf-timer');
        if (el) { el.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; el.classList.toggle('sf-time-low', seconds <= 300); }
        if (!seconds) finish(true);
    }
    function startClock() { stopClock(); tick(); if (attempt && !attempt.finished && questions.length) clock = setInterval(tick, 1000); }
    async function finish(timed = false) {
        if (!attempt || attempt.finished) return;
        if (ending && !timed) return;
        ending = true;
        const pending = questions.length - Object.keys(attempt.answers).length;
        if (!timed && !await ask(pending ? `Te faltan ${pending} preguntas por responder. ¿Quieres terminar y corregir?` : '¿Quieres terminar y ver tu resultado?')) { ending = false; return; }
        if (!attempt || attempt.finished) { ending = false; return; }
        if (pendingConfirmation) pendingConfirmation(false);
        attempt.finished = true; attempt.timedOut = timed; attempt.finishedAt = Date.now(); attempt.result_snapshot = window.StudentResultsModel?.freezeSufficiency(questions, attempt, bank, C, title(attempt.area)) || null; stopClock(); save(); rememberResult(); results(); ending = false;
    }
    function results(filter = 'all') {
        root.classList.remove?.('sf-bank-layout');
        const score = C.grade(questions, attempt.answers);
        const visible = questions.map((q, i) => i).filter(i => filter !== 'errors' || attempt.answers[questions[i].id] !== questions[i].correct);
        root.innerHTML = header() + `<section class="sf-result"><div class="sf-score">${score.percent}<small>%</small></div><div><h2>Así te fue</h2><p>${attempt.timedOut ? 'Se terminó el tiempo. ' : ''}${score.correct} ${score.correct === 1 ? 'correcta' : 'correctas'} · ${score.wrong} ${score.wrong === 1 ? 'incorrecta' : 'incorrectas'} · ${score.skipped} sin responder.</p><p>Revisa las explicaciones y vuelve a practicar lo que te costó.</p></div></section><div class="sf-breakdown">${Object.entries(score.subjects).map(([s, result]) => `<div><strong>${labels[s]}</strong><span>${result.correct} / ${result.total}</span></div>`).join('')}</div><div class="sf-result-actions">${button('catalogue', 'Volver a las materias', 'sf-primary')}${button('start', 'Practicar otra vez')}</div><h2 class="sf-section-title">Respuestas y comentarios</h2><div class="sf-tabs">${button('review-all', 'Todas (' + score.total + ')').replace('data-sf="review-all"', `data-sf="review-all" ${filter === 'all' ? 'aria-current="page"' : ''}`)}${button('review-errors', 'Incorrectas y pendientes (' + (score.wrong + score.skipped) + ')').replace('data-sf="review-errors"', `data-sf="review-errors" ${filter === 'errors' ? 'aria-current="page"' : ''}`)}</div><div class="sf-review-list">${visible.map((i, position) => {
            const q = questions[i], answer = attempt.answers[q.id], right = answer === q.correct;
            return `<details class="sf-review qr-container ${right ? 'sf-correct' : 'sf-incorrect'}" ${position === 0 ? 'open' : ''}><summary><span>${right ? '✓' : answer === undefined ? '—' : '✕'} ${i + 1}. ${esc(q.text)}</span><small>${esc(labels[q.subject])}</small></summary><div class="qr-layout" data-sf-review="${i}"><div class="qr-question">${passage(q)}</div></div></details>`;
        }).join('') || '<p class="sf-notice">¡Todas tus respuestas fueron correctas!</p>'}</div><p class="sf-disclaimer">Resultado de práctica, sin penalización por error. Claves razonadas; no es una calificación oficial de admisión. Guardado solo para tu cuenta en este navegador.</p>`;
        root.querySelectorAll('[data-sf-review]').forEach(layout => {
            const q = questions[Number(layout.dataset.sfReview)];
            const review = {
                options: q.options.map((_, i) => C.optionText(q, i)),
                selected: attempt.answers[q.id] ?? null,
                accepted: [q.correct],
                explanation: q.explanation,
                option_explanations: q.options.map((_, i) => q.comentarios_opciones?.['ABCDE'[i]]),
            };
            const question = layout.firstElementChild;
            if (review.selected === null) {
                const notice = document.createElement('p');
                notice.className = 'qr-commentary-muted';
                notice.textContent = 'Dejaste esta pregunta sin responder.';
                question.append(notice);
            }
            question.append(QuestionReview.showOptions(review));
            const solution = document.createElement('template');
            if (q.solution) solution.innerHTML = C.solutionHtml(q);
            layout.append(QuestionReview.showCommentary(review, {
                workedSolution: solution.content.firstElementChild,
            }));
        });
        root.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    async function resume() {
        if (!attempt) return;
        const saved = attempt, view = viewRevision;
        try {
            const prepared = await questionPack(saved.ids);
            if (!prepared.length || attempt !== saved || view !== viewRevision) return;
            questions = prepared;
        } catch (error) {
            if (attempt === saved && view === viewRevision) showLoadError(error);
            return;
        }
        area = attempt.area;
        if (attempt.configuration) { configSubject = attempt.configuration.subject; configTopic = attempt.configuration.topic; }
        const selected = C.paper(bank, area);
        if (selected) { catalogueArea = selected.subject; if (selected.difficulty) level = selected.difficulty; }
        if (attempt.finished) results(); else { renderQuestion(true); startClock(); }
    }
    root.addEventListener('input', event => {
        if (event.target.id === 'sf-search') { catalogueQuery = event.target.value; cataloguePage = 0; renderCatalogueCards(); }
    });
    root.addEventListener('change', event => {
        if(event.target.id==='sf-config-subject' || event.target.id==='sf-config-topic') {
            const id=event.target.id;
            if(id==='sf-config-subject') { configSubject=event.target.value; configTopic=''; }
            else configTopic=event.target.value;
            catalogue(false); root.querySelector('#'+id)?.focus({preventScroll:true});
            prepareConfiguration();
            if(attempt&&!attempt.finished)startClock();
            return;
        }
        if (event.target.id === 'sf-area-filter') { area = event.target.value; cataloguePage = 0; renderCatalogueCards(); return; }
        if (!event.target.matches('input[name="sf-answer"]') || !attempt || attempt.finished || owner !== user()) return;
        if (attempt.deadline <= Date.now()) return finish(true);
        const index = Number(event.target.value), q = questions[attempt.index];
        if (!Number.isInteger(index) || index < 0 || index >= q.options.length) return;
        attempt.answers[q.id] = index; save(); renderQuestion();
        root.querySelector(`input[name="sf-answer"][value="${index}"]`)?.focus({ preventScroll: true });
    });
    root.addEventListener('click', event => {
        const target = event.target.closest('[data-sf]'); if (!target || target.disabled) return;
        const action = target.dataset.sf;
        if (action === 'cancel-confirm') return pendingConfirmation?.(false);
        if (action === 'accept-confirm') return pendingConfirmation?.(true);
        if (owner && owner !== user()) return clear();
        if (action === 'area') return open(target.dataset.area);
        if (action === 'config') {
            catalogueMode = 'config';
            catalogue();
            prepareConfiguration();
            if(attempt&&!attempt.finished)startClock();
            return;
        }
        if (action === 'legacy') {
            cancelPreparation();
            catalogueMode='legacy';area='integral';cataloguePage=0;catalogueQuery='';catalogue();
            if(attempt&&!attempt.finished)startClock();
            return;
        }
        if (action === 'reload') return open(area);
        if (action === 'topics') return typeof openEntranceLibrary === 'function' && openEntranceLibrary();
        if (action === 'page-prev' || action === 'page-next') { cataloguePage += action === 'page-next' ? 1 : -1; renderCatalogueCards(); root.querySelector('[data-sf-cards]')?.scrollIntoView({ block: 'start', behavior: 'instant' }); return; }
        if (action === 'chosen-passage') return start('texto:' + root.querySelector('#sf-reading-choice').value);
        if (action === 'run') { target.disabled = true; return start(target.dataset.area).finally(() => { target.disabled = false; }); }
        if (action === 'start') return start();
        if (action === 'passage') return start('texto:' + target.dataset.passage);
        if (action === 'resume') { target.disabled = true; return resume().finally(() => { target.disabled = false; }); }
        if (action === 'catalogue') { area = catalogueArea; catalogueMode = 'config'; catalogue(); if (attempt && !attempt.finished) startClock(); return; }
        if (!attempt) return;
        if (action === 'review-all') return results('all');
        if (action === 'review-errors') return results('errors');
        if (attempt.finished) return;
        if (attempt.deadline <= Date.now()) return finish(true);
        const q = questions[attempt.index];
        if (action === 'finish') return finish();
        if (attempt.area !== 'config' && (action === 'help' || action === 'hide-help')) {
            const open = Array.isArray(attempt.helpOpen) ? attempt.helpOpen : [];
            const closing = action === 'hide-help' || open.includes(q.id);
            attempt.helpOpen = closing ? open.filter(id => id !== q.id) : open.concat(q.id);
            save(); renderQuestion();
            root.querySelector(closing ? '.sf-options input' : '.sf-help-button')?.focus({ preventScroll: !closing });
            return;
        }
        if (action === 'prev') attempt.index = Math.max(0, attempt.index - 1);
        if (action === 'next') attempt.index = Math.min(questions.length - 1, attempt.index + 1);
        if (action === 'jump') { const n = Number(target.dataset.index); if (Number.isInteger(n) && n >= 0 && n < questions.length) attempt.index = n; }
        if (action === 'erase') delete attempt.answers[q.id];
        if (action === 'flag') attempt.flags = attempt.flags.includes(q.id) ? attempt.flags.filter(id => id !== q.id) : attempt.flags.concat(q.id);
        save(); renderQuestion(['prev', 'next', 'jump'].includes(action));
    });
    document.addEventListener('visibilitychange', () => { if (!document.hidden && attempt && !attempt.finished) tick(); });
    window.addEventListener('pagehide', save);
    window.addEventListener('storage', event => {
        if (owner && event.key === key(owner)) {
            try {
                const updated = C.restore(JSON.parse(event.newValue), bank, owner);
                if (updated && updated.startedAt === attempt?.startedAt) { attempt = updated; if (!root.classList.contains('hidden')) resume(); }
                else if (attempt && !attempt.finished) { stopClock(); attempt = null; questions = []; if (!root.classList.contains('hidden')) catalogue(); }
            } catch (_) { /* Ignore storage values from older versions. */ }
        }
    });
    window.Sufficiency = { open, clear, async readIndex() {
        if (window.CampusAccess?.isFree() || !await load() || owner !== user()) throw new Error('Acceso a Suficiencia no disponible.');
        return bank;
    }, async readQuestions(ids) {
        const loaded = await questionPack(ids);
        if (!loaded.length || loaded.length !== ids.length || owner !== user()) throw new Error('Acceso a Suficiencia no disponible.');
        return { questions: loaded, passages: bank.passages };
    }, beforeLeave() {
        viewRevision++;
        cancelPreparation();
        if (pendingConfirmation) pendingConfirmation(false);
        document.getElementById('nav-simulacro')?.classList.remove('nav-item-active');
        return true;
    } };
    window.addEventListener('campus-access-change', clear);
    ensureSupabaseSdk().then(() => getSupabase().auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || (owner && session?.user.id !== owner)) clear();
    })).catch(() => { /* The campus login reports SDK connectivity errors. */ });
    const requested = new URLSearchParams(location.search).get('seccion');
    if (requested === 'suficiencia') {
        const wait = setInterval(() => { if (user() && !window.CampusAccess?.isFree()) { clearInterval(wait); open(); } }, 500);
        setTimeout(() => clearInterval(wait), 30000);
    }
})();
