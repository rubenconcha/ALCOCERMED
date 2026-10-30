/* Suficiencia académica: contenido privado, respuestas y progreso por estudiante. */
(function () {
    'use strict';
    const C = window.SufficiencyCore, labels = C.subjects;
    const openTopicSimulacro = window.openSimulacro;
    const root = document.getElementById('suficiencia-screen');
    let bank = null, owner = null, attempt = null, questions = [], clock = null, generation = 0, area = 'matematicas', level = 'facil', catalogueArea = 'matematicas', catalogueMode = 'levels', ending = false, starting = false, pendingConfirmation = null, renderedPassage = null, cataloguePage = 0, catalogueQuery = '';
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const key = id => 'alcocermed:suficiencia:v1:' + id;
    const user = () => typeof currentUser !== 'undefined' ? currentUser?.id : null;
    const title = value => {
        const p = C.paper(bank, value);
        if (p) return p.difficulty ? `${labels[p.subject] || 'Completo'} · ${C.levels[p.difficulty]} · ${p.title}` : p.title;
        return labels[value] || (value.startsWith('texto:') ? bank?.passages.find(p => p.id === value.slice(6))?.title : 'Simulacro');
    };
    const button = (action, text, extra = '') => `<button type="button" class="sf-button ${extra}" data-sf="${action}">${text}</button>`;
    const header = () => `<div class="sim-header sf-heading"><button type="button" class="btn-back-game" data-sf="home" aria-label="Volver al inicio"><i class="fas fa-arrow-left" aria-hidden="true"></i></button><div><h1 class="sim-title">Simulacro</h1><p class="sim-subtitle">${bank?.statistics ? `${bank.statistics.questions} preguntas · resolución paso a paso en cada una` : 'Elige una materia y un nivel para practicar.'}</p></div></div>`;
    function stopClock() { clearInterval(clock); clock = null; }
    function clear() {
        generation++; stopClock(); if (pendingConfirmation) pendingConfirmation(false);
        bank = null; owner = null; attempt = null; questions = []; level = 'facil'; catalogueArea = 'matematicas'; catalogueMode = 'levels'; ending = false; starting = false; renderedPassage = null;
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
    function sourceText(source) {
        const pages = 'pág. PDF ' + source.pdfPages.join(', ');
        if (source.kind === 'variante de práctica') return `Práctica nueva de AlcocerMed, basada en el documento ABP de La Paz · ${pages} · ejercicio de referencia ${source.question}.`;
        if (source.document === 'MEDICINA EXÁMENES PASADOS ABP.pdf') return `Exámenes pasados ABP · UMSA · ${pages} · pregunta ${source.question}. ${source.kind === 'adaptada' ? 'Adaptada para la práctica.' : 'Notación normalizada.'}`;
        return `${source.author || 'Kenneth S. Saladin'}, ${source.edition || '6.ª edición'} · ${source.chapter || 'cap. 1'} · ${pages}${source.printedPages ? ' · pág. impresa ' + source.printedPages.join(', ') : ''}. Texto adaptado para lectura comprensiva.`;
    }
    async function load() {
        const request = ++generation;
        const client = getSupabase();
        const { data, error } = await client.auth.getSession();
        if (error || !data.session || data.session.user.id !== user()) throw new Error('Vuelve a iniciar sesión para abrir esta sección.');
        const id = data.session.user.id;
        const response = await fetch('/api/suficiencia', { headers: { Authorization: 'Bearer ' + data.session.access_token }, cache: 'no-store', signal: AbortSignal.timeout(20000) });
        if (!response.ok) throw new Error(response.status === 403 ? 'Necesitas una suscripción activa para practicar.' : 'No pudimos cargar las preguntas. Intenta de nuevo.');
        const content = await response.json();
        if (request !== generation || user() !== id) return false;
        if (!C.validate(content)) throw new Error('El banco está en revisión. Intenta de nuevo más tarde.');
        bank = content; owner = id;
        if (!attempt) {
            try { attempt = C.restore(JSON.parse(localStorage.getItem(key(id))), bank, id); } catch (_) { attempt = null; }
            if (attempt) questions = attempt.ids.map(qid => bank.questions.find(q => q.id === qid));
        }
        return true;
    }
    async function open(next = 'matematicas') {
        if (next === 'completos') next = 'integral';
        if (!labels[next] && next !== 'integral' && next !== 'completos') next = 'matematicas';
        if (window.CampusAccess?.isFree()) return typeof openTopicSimulacro === 'function' ? openTopicSimulacro() : window.CampusAccess.unlock();
        if (typeof showScreen === 'function' && showScreen('suficiencia-screen') === false) return;
        area = next; catalogueArea = next; catalogueMode = 'levels'; cataloguePage = 0; catalogueQuery = '';
        document.getElementById('nav-simulacro')?.classList.add('nav-item-active');
        root.innerHTML = header() + '<p role="status" class="sf-notice">Cargando preguntas…</p>';
        try {
            if (owner !== user()) { clear(); root.innerHTML = header() + '<p role="status">Cargando preguntas…</p>'; }
            if (!await load()) return;
            area = next; catalogueArea = next;
            catalogue();
            if (attempt && !attempt.finished) startClock();
        } catch (error) {
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
        records[selected.id] = { owner, paperId: selected.id, percent: score.percent, correct: score.correct, total: score.total, at: attempt.finishedAt };
        try { localStorage.setItem(key(owner) + ':papers', JSON.stringify(records)); } catch (_) { /* Last attempt remains available even if history cannot be saved. */ }
    }
    function filteredPapers() {
        const normalized = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const query = normalized(catalogueQuery).trim();
        const papers = catalogueMode === 'levels' ? bank.levelPapers : bank.papers;
        return (papers || []).filter(p => (catalogueMode === 'levels' ? p.subject === area && p.difficulty === level : area === 'integral' || (area === 'completos' ? p.subject === 'integral' : p.subject === area)) &&
            (!query || normalized(p.title + ' ' + p.description + ' ' + (labels[p.subject] || 'completo') + ' ' + (C.levels[p.difficulty] || '')).includes(query)));
    }
    function selectionControls() {
        if (catalogueMode === 'legacy') return `<div class="sf-legacy-heading"><h2>Simulacros anteriores</h2>${button('levels', 'Volver a materias y niveles')}</div>`;
        const subjects = { ...labels, integral: 'Completo' }, symbols = { matematicas:'∑', fisica:'F', quimica:'H₂O', lectura:'Aa', integral:'✓' };
        return `<section class="sf-selection" aria-label="Materia y dificultad"><h2>Elige la materia</h2><div class="sf-matter-grid">${Object.entries(subjects).map(([id,label]) => `<button type="button" data-sf="subject" data-area="${id}" class="sf-matter-button ${area === id ? 'is-active' : ''}" aria-pressed="${area === id}"><span class="sf-matter-symbol" aria-hidden="true">${symbols[id]}</span><span>${label}</span></button>`).join('')}</div><h2>Nivel de dificultad</h2><div class="sf-level-options" role="group" aria-label="Nivel de dificultad">${Object.entries(C.levels).map(([id,label]) => `<button type="button" data-sf="level" data-level="${id}" class="sf-level-button sf-level-${id} ${level === id ? 'is-active' : ''}" aria-pressed="${level === id}"><span>${label}</span><small>${{facil:'Para empezar',intermedio:'Para aplicar',dificil:'Para profundizar'}[id]}</small></button>`).join('')}</div><p class="sf-level-description">${area === 'lectura' ? {facil:'Lecturas de introducción para identificar ideas, datos y palabras en contexto.',intermedio:'Relaciona las ideas del texto y distingue sus matices.',dificil:'Analiza textos con conceptos y relaciones más complejos.'}[level] : {facil:'Empieza con conceptos, conteos y cuentas directas.',intermedio:'Practica fórmulas, conversiones y problemas con pasos previos.',dificil:'Resuelve ejercicios que combinan varias ideas y operaciones.'}[level]}</p></section>`;
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
    function catalogue() {
        stopClock();
        root.innerHTML = header() +
            (attempt ? `<aside class="sf-resume"><div><strong>${attempt.finished ? 'Tu último resultado' : 'Continúa donde te quedaste'}</strong><p>${esc(title(attempt.area))} · ${attempt.ids.length} preguntas${attempt.finished ? '' : ' · el tiempo sigue corriendo'}</p></div>${button('resume', attempt.finished ? 'Ver resultado y comentarios' : 'Continuar')}</aside>` : '') +
            selectionControls() +
            `<div class="sf-catalogue-filter">${catalogueMode === 'legacy' ? `<label for="sf-area-filter">Materia<select id="sf-area-filter"><option value="integral">Todos los anteriores</option>${Object.entries(labels).map(([id,name])=>`<option value="${id}" ${area===id?'selected':''}>${name}</option>`).join('')}</select></label>` : ''}<label for="sf-search">Buscar simulacro<input id="sf-search" type="search" placeholder="Nombre o número" value="${esc(catalogueQuery)}"></label><p data-sf-status role="status" aria-live="polite"></p></div>` +
            '<div class="sf-catalogue" data-sf-cards></div><nav class="sf-pagination" data-sf-pagination aria-label="Páginas de simulacros"></nav>' +
            (area === 'lectura' && catalogueMode === 'levels' ? `<details class="sf-single-reading"><summary>Practicar una lectura por separado</summary><label for="sf-reading-choice">Elige una lectura de nivel ${esc(C.levels[level])}</label><select id="sf-reading-choice">${bank.passages.filter(p=>p.difficulty===level).map((p,i)=>`<option value="${esc(p.id)}">${String(i+1).padStart(2,'0')} · ${esc(p.title)}</option>`).join('')}</select>${button('chosen-passage','Leer y responder')}</details>` : '') +
            (catalogueMode === 'levels' ? `<div class="sf-previous-catalogue"><p>Conservamos los simulacros y resultados anteriores.</p>${button('legacy','Ver simulacros anteriores')}</div>` : '') +
            (typeof openTopicSimulacro === 'function' ? `<div class="sf-previous-catalogue"><p>Biología celular, morfofisiología y salud pública</p>${button('topics', 'Ver los simulacros por temas →')}</div>` : '') +
            `<details class="sf-sources"><summary>Sobre el material</summary><p>980 preguntas: 260 de matemáticas, 260 de física, 260 de química y 200 de lectura. Se incluyen 180 ejercicios básicos nuevos, con sus pasos y referencias. La dificultad se organiza por los conceptos y las operaciones que requiere cada ejercicio; en lectura se mantiene cada texto completo.</p><p>Las preguntas de las tres primeras materias siguen el documento ABP de La Paz facilitado a la plataforma: 92 preguntas revisadas y 688 variantes de práctica. Las 40 lecturas y sus preguntas son adaptaciones de los capítulos 1 y 2 de Saladin, 6.ª edición. Las referencias se conservan en la revisión. No se recibió un patrón oficial de respuestas. Los simulacros por nivel reutilizan este banco; no se cuentan como preguntas nuevas cada vez que aparecen en un simulacro.</p></details>`;
        renderCatalogueCards(); root.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    async function start(selectedArea) {
        if (starting) return;
        starting = true;
        if (attempt && !attempt.finished && !await ask('Hay una práctica en curso. ¿Quieres reemplazarla por una nueva?')) { starting = false; return; }
        const startButton = root.querySelector('[data-sf="start"]'); if (startButton) startButton.disabled = true;
        try {
            if (!await load()) return;
            area = selectedArea || area;
            const chosen = C.paper(bank, area);
            if (chosen) { catalogueArea = chosen.subject; if (chosen.difficulty) level = chosen.difficulty; }
            const seed = crypto.getRandomValues(new Uint32Array(1))[0];
            questions = C.select(bank, area, seed);
            if (!questions.length) throw new Error('Esta lectura no está disponible.');
            const minutes = C.paper(bank, area)?.minutes || (area === 'integral' ? 60 : Math.ceil(questions.length * 1.5));
            attempt = { owner, version: bank.version, area, seed, ids: questions.map(q => q.id), answers: {}, flags: [], index: 0, deadline: Date.now() + minutes * 60000, startedAt: Date.now(), finished: false };
            renderedPassage = null; save(); renderQuestion(); root.scrollIntoView({ block: 'start', behavior: 'instant' }); startClock();
        } catch (e) {
            const notice = document.createElement('p'); notice.className = 'sf-notice'; notice.setAttribute('role', 'alert'); notice.textContent = e.message; root.prepend(notice);
            if (startButton) startButton.disabled = false;
        } finally { starting = false; }
    }
    function passage(q) {
        const p = bank.passages.find(p => p.id === q.passageId);
        return p ? `<article class="sf-passage"><span class="sf-eyebrow">LEE EL TEXTO</span><h2>${esc(p.title)}</h2>${p.text.split('\n\n').map(t => `<p>${esc(t)}</p>`).join('')}<small>${esc(sourceText(p.source))}</small></article>` : '';
    }
    function helpBlock(q) {
        const expanded = attempt.helpOpen?.includes(q.id) === true;
        return `<div class="sf-question-help"><button type="button" class="sf-button sf-help-button" data-sf="help" aria-expanded="${expanded}" aria-controls="sf-current-help">${expanded ? 'Ocultar la resolución' : 'Ver resolución paso a paso'}</button><p class="sf-help-caption">Puedes consultar los pasos y después elegir tu respuesta.</p><div id="sf-current-help"${expanded ? '' : ' hidden'}>${expanded ? `${C.solutionHtml(q)}<p class="sf-help-answer"><b>Respuesta del ejercicio:</b> ${esc(String.fromCharCode(65 + q.correct) + '. ' + C.optionText(q, q.correct))}</p>${button('hide-help', 'Volver a las respuestas')}` : ''}</div></div>`;
    }
    function renderQuestion(focus = false) {
        if (!attempt || attempt.finished) return;
        const q = questions[attempt.index], answered = Object.keys(attempt.answers).length;
        root.innerHTML = `<div class="sf-exam-top"><div><span class="sf-eyebrow">${esc(title(attempt.area))}</span><h1>Pregunta ${attempt.index + 1} <small>de ${questions.length}</small></h1></div><div class="sf-timer" role="timer" aria-label="Tiempo restante" id="sf-timer"></div></div><div class="sf-progress" role="progressbar" aria-label="Preguntas respondidas" aria-valuenow="${answered}" aria-valuemin="0" aria-valuemax="${questions.length}"><span style="width:${answered / questions.length * 100}%"></span></div><p class="sf-progress-label">${answered} de ${questions.length} respondidas <span data-save-status></span></p><div class="sf-exam-layout"><div>${passage(q)}<section class="sf-question"><div class="sf-question-meta">${esc(labels[q.subject])} · ${esc(q.topic)}${q.difficulty ? `<span class="sf-level-badge sf-level-${q.difficulty}">${esc(C.levels[q.difficulty])}</span>` : ''}</div>${C.promptHtml(q)}${helpBlock(q)}<fieldset class="sf-options"><legend class="sf-sr-only">Elige una respuesta</legend>${q.options.map((option, i) => `<label class="${attempt.answers[q.id] === i ? 'is-selected' : ''}"><input type="radio" name="sf-answer" value="${i}" ${attempt.answers[q.id] === i ? 'checked' : ''}><span class="sf-letter">${String.fromCharCode(65 + i)}</span><span>${esc(C.optionText(q, i))}</span></label>`).join('')}</fieldset><div class="sf-question-tools">${button('flag', attempt.flags.includes(q.id) ? '★ Marcada para revisar' : '☆ Marcar para revisar')}${button('erase', 'Borrar respuesta')}</div><div class="sf-bottom-nav">${button('prev', '← Anterior').replace('data-sf="prev"', `data-sf="prev" ${attempt.index === 0 ? 'disabled' : ''}`)}${attempt.index < questions.length - 1 ? button('next', 'Siguiente →', 'sf-primary') : button('finish', 'Terminar y corregir', 'sf-primary')}</div></section></div><aside class="sf-question-nav"><h3>Tus preguntas</h3><div class="sf-number-grid">${questions.map((item, index) => `<button type="button" data-sf="jump" data-index="${index}" class="${attempt.answers[item.id] !== undefined ? 'is-answered' : ''} ${attempt.flags.includes(item.id) ? 'is-flagged' : ''}" ${index === attempt.index ? 'aria-current="step"' : ''} aria-label="Pregunta ${index + 1}${attempt.answers[item.id] !== undefined ? ', respondida' : ', pendiente'}${attempt.flags.includes(item.id) ? ', marcada' : ''}">${index + 1}</button>`).join('')}</div><p>Las preguntas respondidas aparecen en azul. ★ indica una pregunta marcada.</p>${button('finish', 'Terminar y corregir')}${button('catalogue', 'Volver a las materias')}</aside></div>`;
        const changedReading = q.passageId && q.passageId !== renderedPassage;
        renderedPassage = q.passageId || null;
        tick();
        if (changedReading) root.scrollIntoView({ block: 'start', behavior: 'instant' });
        else if (focus) root.querySelector('#sf-question-title')?.focus();
    }
    function tick() {
        if (!attempt || attempt.finished) return stopClock();
        if (owner !== user() || window.CampusAccess?.isFree()) { clear(); return; }
        const seconds = Math.max(0, Math.ceil((attempt.deadline - Date.now()) / 1000));
        const el = root.querySelector('#sf-timer');
        if (el) { el.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`; el.classList.toggle('sf-time-low', seconds <= 300); }
        if (!seconds) finish(true);
    }
    function startClock() { stopClock(); tick(); if (attempt && !attempt.finished) clock = setInterval(tick, 1000); }
    async function finish(timed = false) {
        if (!attempt || attempt.finished) return;
        if (ending && !timed) return;
        ending = true;
        const pending = questions.length - Object.keys(attempt.answers).length;
        if (!timed && !await ask(pending ? `Te faltan ${pending} preguntas por responder. ¿Quieres terminar y corregir?` : '¿Quieres terminar y ver tu resultado?')) { ending = false; return; }
        if (!attempt || attempt.finished) { ending = false; return; }
        if (pendingConfirmation) pendingConfirmation(false);
        attempt.finished = true; attempt.timedOut = timed; attempt.finishedAt = Date.now(); stopClock(); save(); rememberResult(); results(); ending = false;
    }
    function results(filter = 'all') {
        const score = C.grade(questions, attempt.answers);
        root.innerHTML = header() + `<section class="sf-result"><div class="sf-score">${score.percent}<small>%</small></div><div><h2>Así te fue</h2><p>${attempt.timedOut ? 'Se terminó el tiempo. ' : ''}${score.correct} ${score.correct === 1 ? 'correcta' : 'correctas'} · ${score.wrong} ${score.wrong === 1 ? 'incorrecta' : 'incorrectas'} · ${score.skipped} sin responder.</p><p>Revisa las explicaciones y vuelve a practicar lo que te costó.</p></div></section><div class="sf-breakdown">${Object.entries(score.subjects).map(([s, result]) => `<div><strong>${labels[s]}</strong><span>${result.correct} / ${result.total}</span></div>`).join('')}</div><div class="sf-result-actions">${button('catalogue', 'Volver a las materias', 'sf-primary')}${button('start', 'Practicar otra vez')}</div><h2 class="sf-section-title">Respuestas y comentarios</h2><div class="sf-tabs">${button('review-all', 'Todas (' + score.total + ')').replace('data-sf="review-all"', `data-sf="review-all" ${filter === 'all' ? 'aria-current="page"' : ''}`)}${button('review-errors', 'Incorrectas y pendientes (' + (score.wrong + score.skipped) + ')').replace('data-sf="review-errors"', `data-sf="review-errors" ${filter === 'errors' ? 'aria-current="page"' : ''}`)}</div><div class="sf-review-list">${questions.map((q, i) => {
            const a = attempt.answers[q.id], right = a === q.correct;
            if (filter === 'errors' && right) return '';
            return `<details class="sf-review ${right ? 'sf-correct' : 'sf-incorrect'}" ${i === 0 ? 'open' : ''}><summary><span>${right ? '✓' : a === undefined ? '—' : '✕'} ${i + 1}. ${esc(q.text)}</span><small>${esc(labels[q.subject])}</small></summary>${passage(q)}<p><b>Tu respuesta:</b> ${a === undefined ? 'Sin responder' : esc(String.fromCharCode(65 + a) + '. ' + q.options[a])}</p><p class="sf-answer"><b>Respuesta correcta:</b> ${esc(String.fromCharCode(65 + q.correct) + '. ' + q.options[q.correct])}</p>${C.solutionHtml(q)}<small class="sf-reference">${esc(sourceText(q.source))}${q.source.note ? '<br>' + esc(q.source.note) : ''}</small></details>`;
        }).join('') || '<p class="sf-notice">¡Todas tus respuestas fueron correctas!</p>'}</div><p class="sf-disclaimer">Resultado de práctica, sin penalización por error. Claves razonadas; no es una calificación oficial de admisión. Guardado solo para tu cuenta en este navegador.</p>`;
        root.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    function resume() {
        if (!attempt) return;
        area = attempt.area;
        const selected = C.paper(bank, area);
        if (selected) { catalogueArea = selected.subject; if (selected.difficulty) level = selected.difficulty; }
        if (attempt.finished) results(); else { renderQuestion(true); startClock(); }
    }
    root.addEventListener('input', event => {
        if (event.target.id === 'sf-search') { catalogueQuery = event.target.value; cataloguePage = 0; renderCatalogueCards(); }
    });
    root.addEventListener('change', event => {
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
        if (action === 'subject' || action === 'level' || action === 'legacy' || action === 'levels') {
            if (action === 'subject' && (labels[target.dataset.area] || target.dataset.area === 'integral')) catalogueArea = target.dataset.area;
            if (action === 'level' && C.levels[target.dataset.level]) level = target.dataset.level;
            catalogueMode = action === 'legacy' ? 'legacy' : 'levels';
            area = catalogueMode === 'legacy' ? 'integral' : catalogueArea;
            cataloguePage = 0; catalogueQuery = ''; catalogue();
            if (attempt && !attempt.finished) startClock();
            return;
        }
        if (action === 'reload') return open(area);
        if (action === 'home') return typeof goHome === 'function' && goHome();
        if (action === 'topics') return typeof openTopicSimulacro === 'function' && openTopicSimulacro();
        if (action === 'page-prev' || action === 'page-next') { cataloguePage += action === 'page-next' ? 1 : -1; renderCatalogueCards(); root.querySelector('[data-sf-cards]')?.scrollIntoView({ block: 'start', behavior: 'instant' }); return; }
        if (action === 'chosen-passage') return start('texto:' + root.querySelector('#sf-reading-choice').value);
        if (action === 'run') { target.disabled = true; return start(target.dataset.area).finally(() => { target.disabled = false; }); }
        if (action === 'start') return start();
        if (action === 'passage') return start('texto:' + target.dataset.passage);
        if (action === 'resume') return resume();
        if (action === 'catalogue') { area = catalogueArea; catalogue(); if (attempt && !attempt.finished) startClock(); return; }
        if (!attempt) return;
        if (action === 'review-all') return results('all');
        if (action === 'review-errors') return results('errors');
        if (attempt.finished) return;
        if (attempt.deadline <= Date.now()) return finish(true);
        const q = questions[attempt.index];
        if (action === 'finish') return finish();
        if (action === 'help' || action === 'hide-help') {
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
    window.Sufficiency = { open, beforeLeave() {
        if (pendingConfirmation) pendingConfirmation(false);
        document.getElementById('nav-simulacro')?.classList.remove('nav-item-active');
        return true;
    } };
    ensureSupabaseSdk().then(() => getSupabase().auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT' || (owner && session?.user.id !== owner)) clear();
    })).catch(() => { /* The campus login reports SDK connectivity errors. */ });
    window.openSimulacro = () => open();
    const requested = new URLSearchParams(location.search).get('seccion');
    if (requested === 'suficiencia') {
        const wait = setInterval(() => { if (user() && !window.CampusAccess?.isFree()) { clearInterval(wait); open(); } }, 500);
        setTimeout(() => clearInterval(wait), 30000);
    }
})();
