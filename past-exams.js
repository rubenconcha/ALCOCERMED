'use strict';
(() => {
    let catalogPromise, selected, loading = false, patternUrl, freeYear;
    const examCache = new Map();
    const $ = id => document.getElementById(id);
    const readableError = () => 'No se pudo cargar el examen. Intenta de nuevo.';

    async function catalog() {
        if (!catalogPromise) catalogPromise = fetch('/content/past-exams/catalog.json?v=2')
            .then(response => { if (!response.ok) throw new Error(readableError()); return response.json(); })
            .then(data => { freeYear = data.freeYear; return data; })
            .catch(error => { catalogPromise = null; throw error; });
        return catalogPromise;
    }
    async function requestExam(id, pattern = false) {
        const { data } = await getSupabase().auth.getSession();
        const token = data?.session?.access_token;
        if (!token) throw new Error('Vuelve a iniciar sesión para abrir el examen.');
        const response = await fetch('/api/past-exam?id=' + encodeURIComponent(id) + (pattern ? '&pattern=1' : ''), {
            headers: { Authorization: 'Bearer ' + token }, cache: 'no-store'
        });
        if (response.status === 403) { CampusAccess.unlock(); return null; }
        if (response.status === 401) throw new Error('Tu sesión venció. Vuelve a iniciar sesión.');
        if (!response.ok) throw new Error(readableError());
        return pattern ? response.blob() : response.json();
    }
    const isLocked = exam => CampusAccess.isFree() && exam.year !== freeYear;
    function sourceNotes(exam) {
        const notes = [];
        if (exam.missingNumbers.length) notes.push('En el Word original faltan las preguntas ' + exam.missingNumbers.join(', ') + '.');
        (exam.excludedQuestions || []).forEach(question => notes.push('Pregunta ' + question.numero_original + ': ' + question.reason + ' No se incluye en la calificación.'));
        return notes.join(' ');
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
        const year = $('past-year').value, type = $('past-type').value;
        const exams = data.exams.filter(exam => (!year || exam.year === year) && (!type || exam.type === type));
        const root = $('past-grid'); root.replaceChildren();
        $('past-count').textContent = exams.length + (exams.length === 1 ? ' examen' : ' exámenes');
        exams.slice().reverse().forEach(exam => {
            const locked = isLocked(exam);
            const card = document.createElement('article'); card.className = 'past-card' + (locked ? ' past-card-locked' : '');
            const eyebrow = document.createElement('span'); eyebrow.className = 'entrance-eyebrow'; eyebrow.textContent = 'GESTIÓN ' + exam.year;
            const title = document.createElement('h3'); title.textContent = exam.type;
            const meta = document.createElement('p'); meta.textContent = exam.count + ' preguntas · ' + exam.duration + ' minutos';
            const note = document.createElement('p'); note.className = 'past-card-note';
            note.textContent = sourceNotes(exam) ? 'Con observaciones del documento original' : 'Preguntas y patrón original';
            const button = document.createElement('button'); button.type = 'button'; button.className = 'btn-primary'; button.textContent = locked ? 'Desbloquear' : 'Realizar examen →';
            button.addEventListener('click', () => { if (isLocked(exam)) CampusAccess.unlock(); else selectExam(exam); });
            const heading = document.createElement('div'); heading.className = 'past-card-heading'; heading.append(eyebrow);
            if (locked) {
                const badge = document.createElement('span'); badge.className = 'past-lock-badge';
                const icon = document.createElement('i'); icon.className = 'fas fa-lock'; icon.setAttribute('aria-hidden', 'true');
                badge.append(icon, document.createTextNode(' Bloqueado')); heading.append(badge);
            }
            card.append(heading, title, meta, note, button); root.append(card);
        });
        $('past-empty').hidden = exams.length !== 0;
    }
    function selectExam(exam) {
        selected = exam;
        $('past-list').hidden = true; $('past-detail').hidden = false;
        $('past-detail-title').textContent = exam.title;
        $('past-detail-meta').textContent = exam.count + ' preguntas · ' + exam.duration + ' minutos';
        $('past-source-notes').textContent = sourceNotes(exam);
        $('past-source-notes').hidden = !sourceNotes(exam);
        $('past-back').innerHTML = '<i class="fas fa-arrow-left" aria-hidden="true"></i> Volver a los exámenes';
        $('past-start').textContent = isLocked(exam) ? 'Desbloquear' : 'Comenzar examen';
    }
    window.openPastExams = async function () {
        if (simState.timerInterval) {
            if (!confirm('Hay un examen en curso. ¿Deseas salir y descartar las respuestas?')) return;
            clearInterval(simState.timerInterval); simState.timerInterval = null;
        }
        selected = null;
        showScreen('past-exams-screen');
        $('past-list').hidden = false; $('past-detail').hidden = true;
        $('past-back').innerHTML = '<i class="fas fa-arrow-left" aria-hidden="true"></i> Volver';
        $('past-status').textContent = 'Cargando exámenes…';
        try {
            const data = await catalog();
            if ($('past-year').options.length === 1) [...new Set(data.exams.map(exam => exam.year))].reverse().forEach(year => {
                const option = document.createElement('option'); option.value = year; option.textContent = year; $('past-year').append(option);
            });
            try {
                const filters = JSON.parse(sessionStorage.getItem('past-exam-filters:' + (currentUser?.id || '')) || 'null');
                if (filters) { $('past-year').value = filters.year; $('past-type').value = filters.type; }
            } catch (_) { /* Filters remain usable when storage is unavailable. */ }
            await renderList(); $('past-status').textContent = '';
        } catch (error) { $('past-status').textContent = error.message; }
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
            // Keep each loaded paper only for the current signed-in account.
            const cacheKey = accountId + ':' + exam.id;
            let paper = examCache.get(cacheKey);
            if (!paper) { paper = await requestExam(exam.id); if (!paper) return; examCache.set(cacheKey, paper); }
            if (currentCampusScreen !== 'past-exams-screen' || selected?.id !== exam.id || (currentUser?.id || '') !== accountId) return;
            releasePattern();
            simState.mode = 'pasado'; simState.selectedExamen = paper.title; simState.pastExamId = paper.id;
            simState.duracion = paper.duration; simState.nPreguntas = paper.questions.length;
            simState.preguntas = paper.questions; simState.answers = paper.questions.map(() => ({ selected: null }));
            simState.currentIdx = 0; simState.finalized = false; simState.secondsLeft = paper.duration * 60;
            simState.startTimestamp = Date.now(); simState.endTimestamp = simState.startTimestamp + simState.secondsLeft * 1000;
            $('sim-exam-materia').textContent = paper.title;
            $('sim-exam-nq-info').textContent = paper.questions.length + ' preguntas'; $('sim-total-num').textContent = paper.questions.length;
            $('sim-another-exam').textContent = 'Elegir otro examen pasado';
            showScreen('simulacro-screen'); showSimScreen('sim-exam'); buildSimCircles(); renderSimQuestion(); startSimTimer();
        } catch (error) { showToast(error.message, 'error'); }
        finally { loading = false; $('past-start').disabled = false; $('past-start').textContent = isLocked(exam) ? 'Desbloquear' : 'Comenzar examen'; }
    };
    window.returnToExamSelection = function () {
        if (simState.mode === 'pasado') {
            // Remove the completed attempt from the campus back stack.
            if (campusScreenHistory.at(-1) === 'past-exams-screen') campusScreenHistory.pop();
            currentCampusScreen = 'past-exams-screen';
            window.openPastExams();
        } else openSimulacro();
    };
    window.showPastExamPattern = async function () {
        if (simState.mode !== 'pasado' || !simState.finalized) return;
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
        const historical = simState.mode === 'pasado';
        $('past-result-tools').hidden = !historical;
        if (historical) $('past-result-title').textContent = simState.selectedExamen;
    };
    function filterChanged() {
        try { sessionStorage.setItem('past-exam-filters:' + (currentUser?.id || ''), JSON.stringify({ year: $('past-year').value, type: $('past-type').value })); } catch (_) { /* Optional filter memory. */ }
        renderList().catch(error => { $('past-status').textContent = error.message; });
    }
    $('past-year').addEventListener('change', filterChanged);
    $('past-type').addEventListener('change', filterChanged);
    window.addEventListener('campus-access-change', () => { examCache.clear(); releasePattern(); });
})();
