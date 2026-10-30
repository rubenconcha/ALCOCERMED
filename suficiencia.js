/* Suficiencia académica: contenido privado, respuestas y progreso por estudiante. */
(function () {
    'use strict';
    const C = window.SufficiencyCore, labels = C.subjects;
    const openTopicSimulacro = window.openSimulacro;
    const root = document.getElementById('suficiencia-screen');
    let bank = null, owner = null, attempt = null, questions = [], clock = null, generation = 0, area = 'integral', ending = false, starting = false, pendingConfirmation = null, renderedPassage = null, cataloguePage = 0, catalogueQuery = '';
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const key = id => 'alcocermed:suficiencia:v1:' + id;
    const user = () => typeof currentUser !== 'undefined' ? currentUser?.id : null;
    const title = value => C.paper(bank, value)?.title || labels[value] || (value.startsWith('texto:') ? bank?.passages.find(p => p.id === value.slice(6))?.title : 'Simulacro');
    const button = (action, text, extra = '') => `<button type="button" class="sf-button ${extra}" data-sf="${action}">${text}</button>`;
    const header = () => `<div class="sim-header sf-heading"><button type="button" class="btn-back-game" data-sf="home" aria-label="Volver al inicio"><i class="fas fa-arrow-left" aria-hidden="true"></i></button><div><h1 class="sim-title">Simulacro</h1><p class="sim-subtitle">${bank?.statistics ? `${bank.statistics.questions} preguntas comentadas · 20 simulacros completos · 40 por materia` : 'Elige un simulacro y revisa sus comentarios al terminar.'}</p></div></div>`;
    function stopClock() { clearInterval(clock); clock = null; }
    function clear() {
        generation++; stopClock(); if (pendingConfirmation) pendingConfirmation(false);
        bank = null; owner = null; attempt = null; questions = []; ending = false; starting = false; renderedPassage = null;
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
    async function open(next = 'integral') {
        if (!labels[next] && next !== 'integral' && next !== 'completos') next = 'integral';
        if (window.CampusAccess?.isFree()) return typeof openTopicSimulacro === 'function' ? openTopicSimulacro() : window.CampusAccess.unlock();
        if (typeof showScreen === 'function' && showScreen('suficiencia-screen') === false) return;
        area = next; cataloguePage = 0; catalogueQuery = '';
        document.getElementById('nav-simulacro')?.classList.add('nav-item-active');
        root.innerHTML = header() + '<p role="status" class="sf-notice">Cargando preguntas…</p>';
        try {
            if (owner !== user()) { clear(); root.innerHTML = header() + '<p role="status">Cargando preguntas…</p>'; }
            if (!await load()) return;
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
        return bank.papers.filter(p => (area === 'integral' || (area === 'completos' ? p.subject === 'integral' : p.subject === area)) && (!query || normalized(p.title + ' ' + p.description + ' ' + (labels[p.subject] || 'completo')).includes(query)));
    }
    function renderCatalogueCards() {
        const grid = root.querySelector('[data-sf-cards]'); if (!grid) return;
        const matches = filteredPapers(), pages = Math.max(1, Math.ceil(matches.length / 12));
        cataloguePage = Math.max(0, Math.min(cataloguePage, pages - 1));
        const scores = previousScores();
        grid.innerHTML = matches.slice(cataloguePage * 12, cataloguePage * 12 + 12).map(p => {
            const result = scores[p.id], icon = p.subject === 'integral' ? 'exam' : p.subject === 'lectura' ? 'summary' : 'bank';
            return `<article class="sim-library-card sf-catalogue-card" data-paper="${p.id}"><div class="sf-card-top"><span class="sim-library-stage">${p.subject === 'integral' ? 'CUATRO ÁREAS' : esc(labels[p.subject])}</span><svg aria-hidden="true"><use href="/assets/study-tools.svg?v=2#${icon}"></use></svg></div><h2>${esc(p.title)}</h2><p class="sim-library-description">${esc(p.description)}</p><div class="sf-card-meta"><span><i class="far fa-file-alt" aria-hidden="true"></i> ${p.questionCount} preguntas</span><span><i class="far fa-clock" aria-hidden="true"></i> ${p.minutes} min</span></div><span class="sf-comment-label">Con comentario en cada pregunta</span>${result ? `<span class="sf-completed">Último resultado: ${result.correct}/${result.total} · ${result.percent}%</span>` : ''}${button('run', result ? 'Volver a practicar' : 'Empezar', 'sf-primary btn-primary').replace('data-sf="run"', `data-sf="run" data-area="simulacro:${p.id}"`)}</article>`;
        }).join('') || '<p class="sf-notice">No encontramos simulacros con esa búsqueda.</p>';
        const status = root.querySelector('[data-sf-status]');
        if (status) status.textContent = matches.length + ' simulacros' + (matches.length ? ` · ${cataloguePage * 12 + 1}–${Math.min(matches.length, (cataloguePage + 1) * 12)}` : '');
        const pager = root.querySelector('[data-sf-pagination]');
        if (pager) pager.innerHTML = pages > 1 ? `${button('page-prev', '← Anterior').replace('data-sf="page-prev"', `data-sf="page-prev" ${cataloguePage === 0 ? 'disabled' : ''}`)}<span>Página ${cataloguePage + 1} de ${pages}</span>${button('page-next', 'Siguiente →').replace('data-sf="page-next"', `data-sf="page-next" ${cataloguePage === pages - 1 ? 'disabled' : ''}`)}` : '';
    }
    function catalogue() {
        stopClock();
        root.innerHTML = header() +
            (attempt ? `<aside class="sf-resume"><div><strong>${attempt.finished ? 'Tu último resultado' : 'Continúa donde te quedaste'}</strong><p>${esc(title(attempt.area))} · ${attempt.ids.length} preguntas${attempt.finished ? '' : ' · el tiempo sigue corriendo'}</p></div>${button('resume', attempt.finished ? 'Ver resultado y comentarios' : 'Continuar')}</aside>` : '') +
            `<div class="sf-catalogue-filter"><label for="sf-area-filter">Tipo o materia<select id="sf-area-filter" aria-label="Tipo o materia"><option value="integral" ${area === 'integral' ? 'selected' : ''}>Todos los simulacros</option><option value="completos" ${area === 'completos' ? 'selected' : ''}>Simulacros completos</option>${Object.entries(labels).map(([id, name]) => `<option value="${id}" ${area === id ? 'selected' : ''}>${name}</option>`).join('')}</select></label><label for="sf-search">Buscar<input id="sf-search" type="search" placeholder="Nombre, número o materia" value="${esc(catalogueQuery)}"></label><p data-sf-status role="status" aria-live="polite"></p></div>` +
            '<div class="sf-catalogue" data-sf-cards></div><nav class="sf-pagination" data-sf-pagination aria-label="Páginas de simulacros"></nav>' +
            (area === 'lectura' ? `<details class="sf-single-reading"><summary>Practicar una lectura por separado</summary><p>40 textos con cinco preguntas cada uno.</p><label for="sf-reading-choice">Elige una lectura</label><select id="sf-reading-choice">${bank.passages.map((p, i) => `<option value="${esc(p.id)}">${String(i + 1).padStart(2, '0')} · ${esc(p.title)}</option>`).join('')}</select>${button('chosen-passage', 'Leer y responder')}</details>` : '') +
            (typeof openTopicSimulacro === 'function' ? `<div class="sf-previous-catalogue"><p>Biología celular, morfofisiología y salud pública</p>${button('topics', 'Ver los simulacros por temas →')}</div>` : '') +
            `<details class="sf-sources"><summary>Sobre el material</summary><p>Práctica comentada basada en el documento de exámenes ABP de La Paz (UMSA) que se facilitó a la plataforma. Incluye 92 preguntas revisadas del documento y 508 ejercicios nuevos que siguen sus tipos de problemas. Las nuevas variantes están identificadas al revisar. Las claves son razonadas; no se recibió un patrón oficial.</p><p>Lectura comprensiva: 40 textos y 200 preguntas adaptados de los capítulos 1 y 2 de <em>Anatomía y fisiología: la unidad entre forma y función</em>, Kenneth S. Saladin, 6.ª edición. Estas lecturas son material didáctico adicional; no pertenecen al documento ABP.</p><p>Los 20 simulacros completos distribuyen las 800 preguntas sin repetirlas entre ellos. Los 40 por materia reúnen ese mismo banco para repaso dirigido. Cada simulacro tiene un conjunto fijo de preguntas y comentarios de resolución.</p><p>La distribución, el tiempo y la nota son de práctica, sin penalización por error. No representan una prueba ni un criterio oficial de admisión. El avance y los resultados se guardan para tu cuenta en este navegador.</p></details>`;
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
    function renderQuestion(focus = false) {
        if (!attempt || attempt.finished) return;
        const q = questions[attempt.index], answered = Object.keys(attempt.answers).length;
        root.innerHTML = `<div class="sf-exam-top"><div><span class="sf-eyebrow">${esc(title(attempt.area))}</span><h1>Pregunta ${attempt.index + 1} <small>de ${questions.length}</small></h1></div><div class="sf-timer" role="timer" aria-label="Tiempo restante" id="sf-timer"></div></div><div class="sf-progress" role="progressbar" aria-label="Preguntas respondidas" aria-valuenow="${answered}" aria-valuemin="0" aria-valuemax="${questions.length}"><span style="width:${answered / questions.length * 100}%"></span></div><p class="sf-progress-label">${answered} de ${questions.length} respondidas <span data-save-status></span></p><div class="sf-exam-layout"><div>${passage(q)}<section class="sf-question"><div class="sf-question-meta">${esc(labels[q.subject])} · ${esc(q.topic)}</div><h2 id="sf-question-title" tabindex="-1">${esc(q.text)}</h2><fieldset class="sf-options"><legend class="sf-sr-only">Elige una respuesta</legend>${q.options.map((option, i) => `<label class="${attempt.answers[q.id] === i ? 'is-selected' : ''}"><input type="radio" name="sf-answer" value="${i}" ${attempt.answers[q.id] === i ? 'checked' : ''}><span class="sf-letter">${String.fromCharCode(65 + i)}</span><span>${esc(option)}</span></label>`).join('')}</fieldset><div class="sf-question-tools">${button('flag', attempt.flags.includes(q.id) ? '★ Marcada para revisar' : '☆ Marcar para revisar')}${button('erase', 'Borrar respuesta')}</div><div class="sf-bottom-nav">${button('prev', '← Anterior').replace('data-sf="prev"', `data-sf="prev" ${attempt.index === 0 ? 'disabled' : ''}`)}${attempt.index < questions.length - 1 ? button('next', 'Siguiente →', 'sf-primary') : button('finish', 'Terminar y corregir', 'sf-primary')}</div></section></div><aside class="sf-question-nav"><h3>Tus preguntas</h3><div class="sf-number-grid">${questions.map((item, index) => `<button type="button" data-sf="jump" data-index="${index}" class="${attempt.answers[item.id] !== undefined ? 'is-answered' : ''} ${attempt.flags.includes(item.id) ? 'is-flagged' : ''}" ${index === attempt.index ? 'aria-current="step"' : ''} aria-label="Pregunta ${index + 1}${attempt.answers[item.id] !== undefined ? ', respondida' : ', pendiente'}${attempt.flags.includes(item.id) ? ', marcada' : ''}">${index + 1}</button>`).join('')}</div><p>Las preguntas respondidas aparecen en azul. ★ indica una pregunta marcada.</p>${button('finish', 'Terminar y corregir')}${button('catalogue', 'Volver a las materias')}</aside></div>`;
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
            return `<details class="sf-review ${right ? 'sf-correct' : 'sf-incorrect'}" ${i === 0 ? 'open' : ''}><summary><span>${right ? '✓' : a === undefined ? '—' : '✕'} ${i + 1}. ${esc(q.text)}</span><small>${esc(labels[q.subject])}</small></summary>${passage(q)}<p><b>Tu respuesta:</b> ${a === undefined ? 'Sin responder' : esc(String.fromCharCode(65 + a) + '. ' + q.options[a])}</p><p class="sf-answer"><b>Respuesta correcta:</b> ${esc(String.fromCharCode(65 + q.correct) + '. ' + q.options[q.correct])}</p><div class="sf-worked-comment"><h3>Comentario</h3><p>${esc(q.explanation)}</p></div><small class="sf-reference">${esc(sourceText(q.source))}${q.source.note ? '<br>' + esc(q.source.note) : ''}</small></details>`;
        }).join('') || '<p class="sf-notice">¡Todas tus respuestas fueron correctas!</p>'}</div><p class="sf-disclaimer">Resultado de práctica, sin penalización por error. Claves razonadas; no es una calificación oficial de admisión. Guardado solo para tu cuenta en este navegador.</p>`;
        root.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
    function resume() {
        if (!attempt) return;
        area = attempt.area;
        if (attempt.finished) results(); else { renderQuestion(true); startClock(); }
    }
    root.addEventListener('input', event => {
        if (event.target.id === 'sf-search') { catalogueQuery = event.target.value; cataloguePage = 0; renderCatalogueCards(); }
    });
    root.addEventListener('change', event => {
        if (event.target.id === 'sf-area-filter') return open(event.target.value);
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
        if (action === 'reload') return open(area);
        if (action === 'home') return typeof goHome === 'function' && goHome();
        if (action === 'topics') return typeof openTopicSimulacro === 'function' && openTopicSimulacro();
        if (action === 'page-prev' || action === 'page-next') { cataloguePage += action === 'page-next' ? 1 : -1; renderCatalogueCards(); root.querySelector('[data-sf-cards]')?.scrollIntoView({ block: 'start', behavior: 'instant' }); return; }
        if (action === 'chosen-passage') return start('texto:' + root.querySelector('#sf-reading-choice').value);
        if (action === 'run') { target.disabled = true; return start(target.dataset.area).finally(() => { target.disabled = false; }); }
        if (action === 'start') return start();
        if (action === 'passage') return start('texto:' + target.dataset.passage);
        if (action === 'resume') return resume();
        if (action === 'catalogue') { area = labels[area] ? area : 'integral'; catalogue(); if (attempt && !attempt.finished) startClock(); return; }
        if (!attempt) return;
        if (action === 'review-all') return results('all');
        if (action === 'review-errors') return results('errors');
        if (attempt.finished) return;
        if (attempt.deadline <= Date.now()) return finish(true);
        const q = questions[attempt.index];
        if (action === 'finish') return finish();
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
