// Relacionar dentro de las tarjetas, puntuación y podio del motor existente.
function renderQuizMatching(options) {
    var order = options.map(function(_, i) { return i; });
    for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    var html = '<div class="quiz-matching"><p>Relaciona cada elemento con su descripción.</p>';
    options.forEach(function(option, index) {
        html += '<label class="quiz-match-row"><span>' + escapeHtml(option.text) + '</span><select class="quiz-match-select" aria-label="Relacionar ' + escapeHtml(option.text) + '" data-pair="' + index + '"><option value="">Elige una respuesta</option>';
        order.forEach(function(k) { html += '<option value="' + k + '">' + escapeHtml(options[k].match) + '</option>'; });
        html += '</select></label>';
    });
    return html + '<button class="login-btn" id="quiz-confirm-match" onclick="confirmQuizMatching()">Enviar relaciones</button><p id="quiz-match-error" role="alert"></p></div>';
}
function matchingAnswersCorrect(selections, options) {
    return selections.length === options.length && selections.every(function(value, i) { return String(value) === String(i); });
}
function renderMatchingReview(question, answer) {
    return '<div class="quiz-matching">' + question.opciones.map(function(option, i) {
        var selected = answer && Array.isArray(answer.seleccionada) && question.opciones[Number(answer.seleccionada[i])];
        return '<div class="quiz-match-row"><strong>' + escapeHtml(option.text) + '</strong><span>Tu respuesta: ' + escapeHtml(selected ? selected.match : 'Sin responder') + '</span><span>Respuesta correcta: ' + escapeHtml(option.match) + '</span></div>';
    }).join('') + '</div>';
}
function confirmQuizMatching() {
    if (quizConfirmed) return;
    var controls = Array.from(document.querySelectorAll('.quiz-match-select'));
    var answers = controls.map(function(control) { return control.value; });
    if (answers.some(function(value) { return value === ''; })) {
        document.getElementById('quiz-match-error').textContent = 'Completa todas las relaciones.'; return;
    }
    document.getElementById('quiz-match-error').textContent = '';
    var question = quizData.preguntas[quizCurrentQ];
    var correct = matchingAnswersCorrect(answers, question.opciones);
    var points = getQuizPoints(correct, question);
    if (points === null) { clearInterval(quizTimerInterval); handleQuizRetry([]); return; }
    clearInterval(quizTimerInterval);
    quizConfirmed = true;
    quizSelectedOption = 1;
    controls.forEach(function(control, i) {
        control.disabled = true;
        control.style.borderColor = Number(answers[i]) === i ? '#22c55e' : '#ef4444';
        var feedback = document.createElement('small');
        feedback.textContent = 'Respuesta: ' + question.opciones[i].match;
        control.parentNode.appendChild(feedback);
    });
    document.getElementById('quiz-confirm-match').hidden = true;
    quizAnswers.push({pregunta_id:question.id,seleccionada:answers,correcta:correct,puntos_ganados:points});
    syncLiveQuizProgress();
    showFeedbackAnimation(correct, points);
}
