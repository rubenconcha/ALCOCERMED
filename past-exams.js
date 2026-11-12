'use strict';
(() => {
    let catalogPromise, selected, patternUrl, scopeOwner;
    let loading = false, topicsMode = false, opening = false, openRequest = 0;
    let breakdown, modeRequest = 0;
    const examCache = new Map();
    const $ = id => document.getElementById(id);
    const readableError = () => 'No se pudo cargar el examen. Intenta de nuevo.';

    async function catalog() {
        if (window.loadPastExamCatalog) return window.loadPastExamCatalog();
        if (!catalogPromise) catalogPromise = fetch('/content/past-exams/catalog.json?v=examenes-umss')
            .then(response => { if (!response.ok) throw new Error(readableError()); return response.json(); })
            .catch(error => { catalogPromise = null; throw error; });
        return catalogPromise;
    }
    async function requestExam(id, pattern = false, filters = {}, signal, background = false) {
        const { data } = await getSupabase().auth.getSession();
        const token = data?.session?.access_token;
        if (!token) throw new Error('Vuelve a iniciar sesión para abrir el examen.');
        const params = new URLSearchParams({ id, ...filters });
        if (pattern) params.set('pattern', '1');
        const response = await fetch('/api/past-exam?' + params, {
            headers: { Authorization: 'Bearer ' + token }, cache: 'no-store', signal
        });
        if (response.status === 403) {
            if (background) throw Object.assign(new Error(readableError()), { status: 403 });
            CampusAccess.unlock(); return null;
        }
        if (response.status === 401) throw new Error('Tu sesión venció. Vuelve a iniciar sesión.');
        if (!response.ok) throw new Error(readableError());
        return pattern ? response.blob() : response.json();
    }
    const scope = () => ({ year: $('past-year').value, type: $('past-type').value });
    async function loadBreakdown() {
        await window.loadCampusAssets?.('past-topics');
        return breakdown ||= window.createPastExamBreakdown?.((filters, signal) => requestExam('desglose', false, filters, signal), scope);
    }
    const isLocked = () => CampusAccess.isFree();
    function prepareExam(exam) {
        const key = (currentUser?.id || '') + ':' + exam.id;
        const cached = examCache.get(key);
        if (cached?.expires > Date.now()) return cached.pending;
        const pending = requestExam(exam.id, false, {}, AbortSignal.timeout(15000), true)
            .catch(error => { if (examCache.get(key)?.pending === pending) examCache.delete(key); throw error; });
        examCache.set(key, { expires: Date.now() + 120000, pending });
        if (examCache.size > 4) examCache.delete(examCache.keys().next().value);
        return pending;
    }
    function releasePattern() {
        if (patternUrl) URL.revokeObjectURL(patternUrl);
        patternUrl = null;
        $('past-pattern-image').removeAttribute('src');
        $('past-result-tools').hidden = true;
        $('past-pattern-image').hidden = true;
    }
    async function renderList() {
        const data = await catalog();
        if (topicsMode) return;
        const { year, type } = scope();
        const exams = data.exams.filter(exam => (!year || exam.year === year) && (!type || exam.type === type));
        const root = $('past-grid'); root.replaceChildren();
        $('past-count').textContent = exams.length + (exams.length === 1 ? ' examen' : ' exámenes');
        exams.slice().reverse().forEach(exam => {
            const locked = isLocked(exam);
            const card = document.createElement('article'); card.className = 'past-card' + (locked ? ' past-card-locked' : '');
            const eyebrow = document.createElement('span'); eyebrow.className = 'entrance-eyebrow'; eyebrow.textContent = 'GESTIÓN ' + exam.year;
            const title = document.createElement('h3'); title.textContent = exam.type;
            const meta = document.createElement('p'); meta.textContent = exam.count + ' preguntas · ' + exam.duration + ' minutos';
            const button = document.createElement('button'); button.type = 'button'; button.className = 'btn-primary'; button.textContent = locked ? 'Desbloquear' : 'Realizar examen →';
            button.addEventListener('click', () => { if (isLocked(exam)) CampusAccess.unlock(); else selectExam(exam); });
            const heading = document.createElement('div'); heading.className = 'past-card-heading'; heading.append(eyebrow);
            if (locked) {
                const badge = document.createElement('span'); badge.className = 'past-lock-badge';
                const icon = document.createElement('i'); icon.className = 'fas fa-lock'; icon.setAttribute('aria-hidden', 'true');
                badge.append(icon, document.createTextNode(' Bloqueado')); heading.append(badge);
            }
            card.append(heading, title, meta, button); root.append(card);
        });
        $('past-empty').hidden = exams.length !== 0;
    }
    function selectExam(exam) {
        selected = exam;
        $('past-list').hidden = true; $('past-detail').hidden = false;
        $('past-detail-title').textContent = exam.title;
        $('past-detail-meta').textContent = exam.count + ' preguntas · ' + exam.duration + ' minutos';
        $('past-back-label').textContent = 'Volver a los exámenes';
        $('past-start').textContent = isLocked(exam) ? 'Desbloquear' : 'Comenzar examen';
        if (!isLocked(exam) && !window.navigator?.connection?.saveData) {
            prepareExam(exam).catch(() => {});
            window.loadCampusAssets?.('exam-engine').catch(() => {});
        }
    }
    function showList() {
        $('past-list').hidden = false; $('past-detail').hidden = true;
        $('past-back-label').textContent = 'Volver';
    }
    async function showMode(enabled, filter) {
        enabled = Boolean(enabled || CampusAccess.isFree());
        const mode = ++modeRequest;
        if (enabled) {
            try {
                await loadBreakdown();
                if (mode !== modeRequest || (typeof currentCampusScreen !== 'undefined' && currentCampusScreen !== 'past-exams-screen')) return;
                if (filter) breakdown?.resetFilters(filter);
            } catch (_) {
                if (mode === modeRequest) $('past-status').textContent = 'No pudimos abrir las preguntas por tema. Vuelve a intentarlo.';
                return;
            }
        }
        topicsMode = Boolean(enabled && breakdown);
        $('past-mode-exams').setAttribute('aria-pressed', String(!topicsMode));
        $('past-mode-topics').setAttribute('aria-pressed', String(topicsMode));
        $('past-exam-cards').hidden = topicsMode;
        $('past-breakdown-pickers').hidden = !topicsMode;
        $('past-question-filters').hidden = !topicsMode;
        $('past-breakdown').hidden = !topicsMode;
        breakdown?.show(topicsMode);
    }
    function showFullExams() {
        if (CampusAccess.isFree()) return showMode(true);
        $('past-status').textContent = '';
        renderList().catch(error => { $('past-status').textContent = error.message; });
    }
    window.openPastExams = async function (openTopics, topicFilter) {
        if (simState.timerInterval) {
            if (!confirm('Hay un examen en curso. ¿Deseas salir y descartar las respuestas?')) return;
            clearInterval(simState.timerInterval); simState.timerInterval = null;
        }
        selected = null;
        opening = true;
        const allowed = showScreen('past-exams-screen');
        opening = false;
        if (allowed === false) return;
        breakdown?.show(false);
        const account = currentUser?.id;
        const request = ++openRequest;
        const isCurrent = () => request === openRequest && currentUser?.id === account &&
            (typeof currentCampusScreen === 'undefined' || currentCampusScreen === 'past-exams-screen');
        showList();
        $('past-status').textContent = '';
        try {
            if (CampusAccess.isFree()) {
                $('past-year').value = '';
                $('past-type').value = '';
                await showMode(true, {});
                return;
            }
            const data = await catalog();
            if (!isCurrent()) return;
            if ($('past-year').options.length === 1) [...new Set(data.exams.map(exam => exam.year))].reverse().forEach(year => {
                const option = document.createElement('option'); option.value = year; option.textContent = year; $('past-year').append(option);
            });
            if (topicFilter) {
                $('past-year').value = '';
                $('past-type').value = '';
            } else if (scopeOwner !== account) {
                try {
                    const filters = JSON.parse(sessionStorage.getItem('past-exam-filters:' + (account || '')) || 'null');
                    $('past-year').value = filters?.year || '';
                    $('past-type').value = filters?.type || '';
                } catch (_) { /* Filters remain usable when storage is unavailable. */ }
            }
            scopeOwner = account;
            const wantsTopics = typeof openTopics === 'boolean' ? openTopics : topicsMode;
            await showMode(wantsTopics, topicFilter);
            if (isCurrent() && !topicsMode) {
                await renderList();
                if (isCurrent()) $('past-status').textContent = '';
            }
        } catch (error) { if (isCurrent()) $('past-status').textContent = error.message; }
    };
    window.pastExamsBack = function () {
        if (selected) { selected = null; window.openPastExams(); }
        else goBack();
    };
    window.startPastExam = async function () {
        if (!selected || loading) return;
        const exam = selected;
        if (isLocked(exam)) return CampusAccess.unlock();
        const accountId = currentUser?.id || '';
        loading = true; $('past-start').disabled = true; $('past-start').textContent = 'Preparando preguntas…';
        try {
            const [paper] = await Promise.all([prepareExam(exam), window.loadCampusAssets?.('exam-engine')]);
            if (currentCampusScreen !== 'past-exams-screen' || selected?.id !== exam.id || (currentUser?.id || '') !== accountId) return;
            releasePattern();
            simState.mode = 'pasado'; simState.selectedExamen = paper.title; simState.pastExamId = paper.id;
            simState.strictTiming = false; simState.entranceOrigin = false;
            simState.duracion = paper.duration; simState.nPreguntas = paper.questions.length;
            simState.preguntas = paper.questions; simState.answers = paper.questions.map(() => ({ selected: null }));
            simState.currentIdx = 0; simState.finalized = false; simState.secondsLeft = paper.duration * 60;
            simState.startTimestamp = Date.now(); simState.endTimestamp = simState.startTimestamp + simState.secondsLeft * 1000;
            $('sim-exam-materia').textContent = paper.title;
            $('sim-exam-nq-info').textContent = paper.questions.length + ' preguntas'; $('sim-total-num').textContent = paper.questions.length;
            $('sim-another-exam').textContent = 'Elegir otro examen pasado';
            showScreen('simulacro-screen'); showSimScreen('sim-exam'); buildSimCircles(); renderSimQuestion(); startSimTimer();
        } catch (error) {
            if (currentCampusScreen !== 'past-exams-screen' || selected?.id !== exam.id || (currentUser?.id || '') !== accountId) return;
            if (error.status === 403) CampusAccess.unlock();
            else showToast(error.message, 'error');
        }
        finally { loading = false; $('past-start').disabled = false; $('past-start').textContent = isLocked(exam) ? 'Desbloquear' : 'Comenzar examen'; }
    };
    window.returnToExamSelection = function () {
        if (simState.entranceOrigin) { window.openCampusSimulations(); return; }
        if (simState.mode === 'pasado') {
            // Remove the completed attempt from the campus back stack.
            if (campusScreenHistory.at(-1) === 'past-exams-screen') campusScreenHistory.pop();
            currentCampusScreen = 'past-exams-screen';
            window.openPastExams();
        } else window.openCampusSimulations();
    };
    window.showPastExamPattern = async function () {
        if (simState.mode !== 'pasado' || !simState.finalized) return;
        if (CampusAccess.isFree()) return CampusAccess.unlock();
        const button = $('past-pattern-button'); button.disabled = true;
        const examId = simState.pastExamId;
        try {
            if (!patternUrl) {
                const blob = await requestExam(examId, true); if (!blob || simState.mode !== 'pasado' || simState.pastExamId !== examId || !simState.finalized) return;
                patternUrl = URL.createObjectURL(blob); $('past-pattern-image').src = patternUrl;
            }
            $('past-pattern-image').hidden = false;
        } catch (error) { showToast(error.message, 'error'); }
        finally { button.disabled = false; }
    };
    window.renderPastExamResult = function () {
        const historical = simState.mode === 'pasado' && Boolean(simState.pastExamId);
        $('past-result-tools').hidden = !historical;
        if (historical) $('past-result-title').textContent = simState.selectedExamen;
    };
    function rememberScope() {
        try { sessionStorage.setItem('past-exam-filters:' + (currentUser?.id || ''), JSON.stringify(scope())); } catch (_) { /* Optional filter memory. */ }
    }
    function filterChanged() {
        rememberScope();
        if (topicsMode) breakdown.refresh();
        else showFullExams();
    }
    $('past-year').addEventListener('change', filterChanged);
    $('past-type').addEventListener('change', filterChanged);
    $('past-mode-exams').addEventListener('click', () => { showMode(false); showFullExams(); });
    $('past-mode-topics').addEventListener('click', () => showMode(true));
    $('past-topics-from-exam').hidden = false;
    $('past-topics-from-exam').addEventListener('click', async () => {
        if (!selected) return;
        $('past-year').value = selected.year;
        $('past-type').value = selected.type;
        selected = null;
        rememberScope();
        showList();
        await showMode(true, {});
        if (topicsMode) $('past-mode-topics').focus();
    });
    function clear() {
        scopeOwner = undefined;
        examCache.clear();
        releasePattern();
        breakdown?.clear();
        if (breakdown?.isAssigned?.()) {
            breakdown.refresh();
            return;
        }
        showMode(false);
    }
    window.CampusPastExams = {
        clear,
        async openAssigned(host, context) {
            const view = await loadBreakdown();
            if (context.isCurrent?.() === false) return;
            return view.openAssigned(host, context);
        },
        screenChanged(visible) {
            if (!opening && !breakdown?.isAssigned?.()) breakdown?.show(visible && topicsMode);
        },
    };
    window.addEventListener('campus-access-change', clear);
})();
