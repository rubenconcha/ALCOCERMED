function startSimTimer() {
    clearInterval(simState.timerInterval);
    updateSimTimerDisplay();
    simState.timerInterval = setInterval(function () {
        var remaining = Math.ceil((simState.endTimestamp - Date.now()) / 1000);
        simState.secondsLeft = simState.mode === 'pasado' && !simState.strictTiming ? remaining : Math.max(0, remaining);
        updateSimTimerDisplay();
        if (simState.secondsLeft <= 0 && (simState.mode !== 'pasado' || simState.strictTiming)) {
            clearInterval(simState.timerInterval);
            simState.timerInterval = null;
            showToast('⏰ tiempo agotado — finalizando simulacro', 'info');
            finalizarSimulacro();
        }
    }, 1000);
}

function updateSimTimerDisplay() {
    var overtime = simState.mode === 'pasado' && !simState.strictTiming && simState.secondsLeft < 0;
    var s = overtime ? Math.abs(simState.secondsLeft) : Math.max(0, simState.secondsLeft);
    var m = Math.floor(s / 60);
    var sec = s % 60;
    var txt = (overtime ? '+' : '') + (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    var el = document.getElementById('sim-timer-display');
    var wrap = document.getElementById('sim-timer-wrap');
    if (el) el.textContent = txt;
    if (wrap) {
        wrap.classList.toggle('sim-timer-danger', simState.mode !== 'pasado' && s <= 120);
        wrap.title = simState.mode === 'pasado' && !simState.strictTiming ? '100 minutos de referencia. Puedes seguir respondiendo después; el signo + indica tiempo adicional.' : '';
    }
}

function isWeeklySimQuestion(q) {
    return /^semana(?:2-testb|3-virtual)-/.test(q.id || '');
}

function renderSimQuestion() {
    var idx = simState.currentIdx;
    var q = simState.preguntas[idx];
    var ans = simState.answers[idx];

    document.getElementById('sim-cur-num').textContent = idx + 1;
    document.getElementById('sim-exam-section').textContent = ({
        MORFOFUNCION: 'Morfofunción', 'BIOLOGIA CELULAR': 'Biología celular',
        'SALUD PUBLICA': 'Educación para la Vida'
    })[normalizeDbText(campo(q, 'materia'))] ||
        (simState.mode === 'tema' ? campo(q, 'materia') : simState.mode === 'pasado' ? 'Examen pasado' : 'Simulacro');
    document.getElementById('sim-answered-count').textContent =
        simState.answers.filter(function (answer) { return answer.selected !== null; }).length +
        ' de ' + simState.preguntas.length + ' respondidas';
    document.getElementById('sim-num-badge').textContent = 'N° ' + (q.numero_original || idx + 1);
    const questionText = document.getElementById('sim-question-text');
    questionText.textContent = campo(q, 'pregunta') || '';
    questionText.style.whiteSpace = questionText.textContent.includes('\n') ? 'pre-line' : '';
    if (q.passage || document.getElementById('sim-passage')?.dataset?.passage) renderPracticePassage('sim', q.passage);
    window.StudyMedia?.render(document.getElementById('sim-question-text'),q.study_image);
    renderBqDificultad_sim(campo(q, 'dificultad') || 'facil');

    var optsEl = document.getElementById('sim-options');
    optsEl.innerHTML = '';
    var opciones = [
        campo(q, 'opcion_a'), campo(q, 'opcion_b'),
        campo(q, 'opcion_c'), campo(q, 'opcion_d'),
        campo(q, 'opcion_e')
    ].filter(function (o) { return o && o.toString().trim() !== ''; });

    var letras = ['a', 'b', 'c', 'd', 'e'];
    opciones.forEach(function (opcion, i) {
        var btn = document.createElement('button');
        btn.className = 'bq-option-btn sim-opt-btn' + (ans.selected === i ? ' sim-opt-selected' : '');
        var letter = document.createElement('span');
        letter.className = 'bq-option-letter';
        letter.textContent = letras[i];
        var label = document.createElement('span');
        label.className = 'bq-option-text';
        label.textContent = opcion;
        btn.append(letter, label);
        btn.onclick = function () { selectSimAnswer(i); };
        optsEl.appendChild(btn);
    });

    var prevBtn = document.getElementById('sim-btn-prev');
    var nextBtn = document.getElementById('sim-btn-next');
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === simState.preguntas.length - 1;

    updateSimCircles();
}

function renderBqDificultad_sim(dificultad) {
    var el = document.getElementById('sim-dificultad');
    if (!el) return;
    el.innerHTML = '';
    const hideDifficulty = simState.entranceOrigin || simState.mode === 'pasado' || (simState.mode === 'tema' && !simState.topicEvaluationId?.startsWith('suf-'));
    el.hidden = hideDifficulty;
    const label = document.querySelector('#sim-exam .bq-dificultad-label');
    if (label) label.hidden = hideDifficulty;
    if (hideDifficulty) return;
    var d = (dificultad || 'facil').toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    var isFacil = d === 'facil' || d.startsWith('fac');
    var isMedio = d === 'medio' || d === 'media' || d.startsWith('med');
    var isDificil = d === 'dificil' || d.startsWith('dif');
    var levels = [
        { cls: isFacil ? 'active-facil' : '' },
        { cls: isFacil ? 'active-facil' : (isMedio ? 'active-medio' : '') },
        { cls: isDificil ? 'active-dificil' : (isMedio ? 'active-medio' : '') },
        { cls: isDificil ? 'active-dificil' : '' },
        { cls: isDificil ? 'active-dificil' : '' }
    ];
    levels.forEach(function (lvl) {
        var dot = document.createElement('span');
        dot.className = 'bq-dot ' + lvl.cls;
        el.appendChild(dot);
    });
}

function selectSimAnswer(selectedIdx) {
    simState.answers[simState.currentIdx].selected = selectedIdx;
    var btns = document.querySelectorAll('#sim-options .bq-option-btn');
    btns.forEach(function (b, i) {
        b.classList.toggle('sim-opt-selected', i === selectedIdx);
    });
    updateSimCircles();
    document.getElementById('sim-answered-count').textContent =
        simState.answers.filter(function (answer) { return answer.selected !== null; }).length +
        ' de ' + simState.preguntas.length + ' respondidas';
}

function buildSimCircles() {
    var container = document.getElementById('sim-circles');
    if (!container) return;
    container.innerHTML = '';
    var labels = { MORFOFUNCION: 'Morfofunción', 'BIOLOGIA CELULAR': 'Biología celular', 'SALUD PUBLICA': 'Educación para la Vida' };
    var currentSubject = '';
    simState.preguntas.forEach(function (question, i) {
        var subject = normalizeDbText(campo(question, 'materia'));
        if (subject !== currentSubject) {
            currentSubject = subject;
            var heading = document.createElement('div');
            heading.className = 'entrance-nav-heading';
            heading.textContent = labels[subject] || campo(question, 'materia') || subject;
            container.appendChild(heading);
        }
        var btn = document.createElement('button');
        btn.className = 'bq-circle';
        btn.textContent = question.numero_original || i + 1;
        btn.onclick = function () { simGoTo(i); };
        container.appendChild(btn);
    });
}

function updateSimCircles() {
    var circles = document.querySelectorAll('#sim-circles .bq-circle');
    circles.forEach(function (c, i) {
        c.className = 'bq-circle';
        if (simState.answers[i] && simState.answers[i].selected !== null) {
            c.classList.add('bq-circle-correct'); // marcada (azul en sim)
        }
        if (i === simState.currentIdx) c.classList.add('bq-circle-active');
    });
}

window.simGoTo = function (idx) {
    simState.currentIdx = idx;
    renderSimQuestion();
};

window.simNavigate = function (dir) {
    var newIdx = simState.currentIdx + dir;
    if (newIdx < 0 || newIdx >= simState.preguntas.length) return;
    simState.currentIdx = newIdx;
    renderSimQuestion();
};

window.confirmarSalirSimulacro = function () {
    if (!confirm(simState.mode === 'tema' ? '¿Salir de la evaluación? Se descartarán tus respuestas.' : '¿salir del simulacro? perderás todo tu progreso.')) return;
    clearInterval(simState.timerInterval);
    simState.timerInterval = null;
    if (simState.mode === 'pasado' || simState.mode === 'tema') { simState.preguntas = []; simState.answers = []; returnToExamSelection(); }
    else showSimScreen('sim-config');
};

window.finalizarSimulacro = function () {
    if (simState.finalized) return;
    simState.finalized = true;
    clearInterval(simState.timerInterval);
    simState.timerInterval = null;

    var tiempoUsado = simState.mode === 'pasado'
        ? Math.max(0, Math.floor((Date.now() - simState.startTimestamp) / 1000))
        : simState.duracion * 60 - Math.max(0, simState.secondsLeft);
    var totalMin = Math.floor(tiempoUsado / 60);
    var totalSec = tiempoUsado % 60;

    var total = simState.preguntas.length;
    var correctas = 0, incorrectas = 0, sinResponder = 0;

    simState.answers.forEach(function (ans, i) {
        if (ans.selected === null) {
            sinResponder++;
        } else {
            var q = simState.preguntas[i];
            var correctaRaw = (campo(q, 'respuesta_correcta') || 'A').toString().trim().toUpperCase();
            var letrasMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
            var correctIdx = letrasMap[correctaRaw] !== undefined ? letrasMap[correctaRaw] : parseInt(correctaRaw) - 1;
            simState.answers[i].correct = correctIdx;
            if (simAcceptedAnswerIndices(q).includes(ans.selected)) correctas++; else incorrectas++;
        }
    });

    var pct = total > 0 ? Math.round((correctas / total) * 100) : 0;
    var emoji = '😅', title = 'sigue practicando';
    if (pct >= 80) { emoji = '🏆'; title = '¡excelente dominio!'; }
    else if (pct >= 60) { emoji = '👏'; title = '¡muy bien!'; }
    else if (pct >= 40) { emoji = '📚'; title = 'puedes mejorar'; }

    document.getElementById('sim-result-emoji').textContent = emoji;
    document.getElementById('sim-result-title').textContent = simState.mode === 'oficial' && simState.independentScope
        ? (pct >= 80 ? 'Buen resultado en este bloque' : 'Revisa los mecanismos de este bloque') : title;
    document.getElementById('sim-result-score').textContent =
        correctas + ' de ' + total + ' correctas · ' + pct + '% de acierto' +
        (simState.preguntas.every(isWeeklySimQuestion) ? ' · ' + correctas + '/' + total + ' puntos' : '');
    document.getElementById('sim-rs-correct').textContent = correctas;
    document.getElementById('sim-rs-wrong').textContent = incorrectas;
    document.getElementById('sim-rs-pending').textContent = sinResponder;
    document.getElementById('sim-rs-time').textContent =
        (totalMin < 10 ? '0' : '') + totalMin + ':' + (totalSec < 10 ? '0' : '') + totalSec;

    var gradBar = document.getElementById('sim-grade-bar');
    var gradPct = document.getElementById('sim-grade-pct');
    if (gradBar) gradBar.style.width = pct + '%';
    if (gradPct) gradPct.textContent = pct + '%';
    if (gradBar) {
        gradBar.style.background = pct >= 70
            ? 'linear-gradient(90deg,#22c55e,#16a34a)'
            : pct >= 40
                ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                : 'linear-gradient(90deg,#ef4444,#dc2626)';
    }

    if (window.renderEntranceBreakdown) window.renderEntranceBreakdown();

    // Revisión pregunta a pregunta
    var reviewList = document.getElementById('sim-review-list');
    if (reviewList) {
        const historical = simState.mode === 'pasado';
        reviewList.replaceChildren();
        simState.preguntas.forEach(function (q, i) {
            const selected = simState.answers[i].selected;
            const accepted = simAcceptedAnswerIndices(q);
            const disputedKey = historical && q.clave_en_discrepancia;
            const review = { ...QuestionReview.commentaryData(q, campo), selected, accepted };
            const isCorrect = accepted.includes(selected);
            const unanswered = selected === null;

            const item = document.createElement('article');
            item.className = 'sim-review-item qr-container' + (isCorrect ? ' sim-rev-ok' : unanswered ? ' sim-rev-pending' : ' sim-rev-fail');
            const header = document.createElement('div');
            header.className = 'sim-rev-header';
            const number = document.createElement('span');
            number.className = 'sim-rev-num';
            number.textContent = 'N° ' + (q.numero_original || i + 1);
            const badge = document.createElement('span');
            badge.className = 'sim-rev-badge';
            badge.textContent = unanswered ? '— Sin responder' : disputedKey
                ? (isCorrect ? '✓ Coincide con la clave' : '✗ La clave marca otra opción')
                : (isCorrect ? '✓ Correcta' : '✗ Incorrecta');
            header.append(number, badge);

            const layout = document.createElement('div');
            layout.className = 'qr-layout';
            const questionSide = document.createElement('div');
            questionSide.className = 'qr-question';
            const question = document.createElement('p');
            question.className = 'sim-rev-question';
            question.textContent = campo(q, 'pregunta') || '';
            questionSide.append(question);
            if (q.passage) {
                const passage = document.createElement('details');
                passage.className = 'bq-passage sim-rev-passage';
                const heading = document.createElement('summary');
                heading.textContent = q.passage.title;
                const text = document.createElement('p');
                text.textContent = q.passage.text;
                passage.append(heading, text);
                questionSide.append(passage);
            }
            questionSide.append(QuestionReview.showOptions(review, disputedKey ? 'Clave original' : undefined));
            layout.append(questionSide, QuestionReview.showCommentary(review, { compactSource: historical }));
            item.append(header, layout);
            reviewList.append(item);
        });
    }

    // Guardar en historial local
    guardarEnHistorial(pct, correctas, total, tiempoUsado,
        (simState.mode === 'materia' || simState.mode === 'tema') ? simState.selectedMateria : 'todas');

    // Sincronizar con la nube para el Panel de Admin
    guardarResultadoSimulacroEnNube({
        questionReview: window.QuestionReview?.snapshot(simState.preguntas,simState.answers,campo,simAcceptedAnswerIndices) || null,
        menuSection: simState.mode === 'tema' ? 'evaluaciones' : simState.mode === 'pasado' && !simState.entranceOrigin ? 'examenes' : 'simulacros',
        titulo: (simState.mode === 'oficial' || simState.mode === 'pasado' || simState.mode === 'tema') ? (simState.selectedExamen || 'Simulacro preparado') : 'Simulacro personalizado',
        materia: (simState.mode === 'materia' || simState.mode === 'tema') ? simState.selectedMateria :
            simState.mode === 'oficial' ? (simState._oficialesCache.find(function (r) { return r.nombre === simState.selectedExamen; }) || {}).materia || 'todas' : 'todas',
        porcentaje: pct,
        correctas: correctas,
        incorrectas: incorrectas,
        sinRespuesta: sinResponder,
        tiempoSegundos: tiempoUsado
    });

    if (window.renderPastExamResult) window.renderPastExamResult();
    showSimScreen('sim-result');
    window.CampusCalendar?.evaluationFinished();
};
