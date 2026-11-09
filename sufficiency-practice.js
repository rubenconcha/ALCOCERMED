'use strict';
(() => {
    const { reference, exercises, parseNumber, isCorrect, formatAnswer } = window.SufficiencyPracticeContent;
    const $ = id => document.getElementById(id);
    const referencePanel = $('practice-reference');
    const catalog = $('sufficiency-practice-catalog');
    const session = $('practice-session');
    const subject = $('practice-subject');
    const kind = $('practice-kind');

    function element(tag, text, className) {
        const node = document.createElement(tag);
        if (text) node.textContent = text;
        if (className) node.className = className;
        return node;
    }

    function button(text, className, action) {
        const node = element('button', text, className);
        node.type = 'button';
        node.addEventListener('click', action);
        return node;
    }

    function referenceGroup(group) {
        const details = element('details');
        const table = element('table');
        table.append(element('caption', group.title));
        const header = table.createTHead().insertRow();
        for (const title of group.columns || ['Unidad', 'Equivalencia']) {
            const cell = element('th', title);
            cell.scope = 'col';
            header.append(cell);
        }
        const body = table.createTBody();
        for (const [unit, equivalent] of group.rows) {
            const name = element('th', unit);
            name.scope = 'row';
            body.insertRow().append(name, element('td', equivalent));
        }
        details.append(element('summary', group.title), table);
        return details;
    }

    function exerciseCard(exercise) {
        const article = element('article', '', 'past-card campus-resource-card practice-card');
        const start = button('Practicar →', 'btn-primary', () => startExercise(exercise, start));
        start.setAttribute('aria-label', 'Practicar ' + exercise.title);
        start.dataset.practiceExercise = exercise.id;
        article.append(
            element('span', exercise.subject + ' · ' + exercise.kind, 'entrance-eyebrow'),
            element('h3', exercise.title),
            element('p', exercise.questions.length + ' preguntas con pistas y pasos', 'past-card-note'),
            start
        );
        return article;
    }

    function renderCatalog() {
        const visible = exercises.filter(exercise =>
            (!subject.value || exercise.subject === subject.value) &&
            (!kind.value || exercise.kind === kind.value)
        );
        $('practice-grid').replaceChildren(...visible.map(exerciseCard));
        $('practice-count').textContent = visible.length + (visible.length === 1 ? ' bloque' : ' bloques');
        $('practice-empty').hidden = visible.length !== 0;
    }

    function questionForm(question, index, total, updateProgress) {
        const id = 'practice-answer-' + index;
        const form = element('form', '', 'practice-exercise');
        const header = element('div', '', 'practice-question-head');
        const title = element('h4', question.prompt);
        title.id = id + '-title';
        title.tabIndex = -1;
        header.append(element('span', 'Pregunta ' + (index + 1) + ' de ' + total, 'practice-question-number'), title);
        form.setAttribute('aria-labelledby', title.id);

        const data = element('div', '', 'practice-givens');
        const list = element('ul');
        list.append(...question.data.map(value => element('li', value)));
        data.append(element('h5', 'Datos que necesitas'), list);

        const guidance = element('aside', '', 'practice-guidance');
        const solution = element('details', '', 'practice-solution');
        const steps = element('ol');
        steps.append(...question.steps.map(step => element('li', step)));
        solution.append(
            element('summary', 'Ver el paso a paso'),
            steps,
            element('p', 'Resultado · ' + formatAnswer(question) + ' ' + question.unit, 'practice-result'),
            element('h5', 'Cómo comprobarlo'),
            element('p', question.check)
        );
        guidance.append(element('h5', 'Por dónde empezar'), element('p', question.hint));

        const response = element('div', '', 'practice-response');
        const label = element('label', 'Tu respuesta');
        label.htmlFor = id;
        const precision = question.decimals === 0 ? 'un número entero' : question.decimals + (question.decimals === 1 ? ' decimal' : ' decimales');
        const numberHelp = Math.abs(question.answer) >= 1000
            ? ' Separa los miles con un espacio.'
            : ' Puedes usar coma o punto decimal.';
        const hint = element('p', 'Responde en ' + question.unit + ' con ' + precision + '.' + numberHelp, 'practice-form-hint');
        hint.id = id + '-hint';
        const input = element('input');
        input.id = id;
        input.type = 'text';
        input.inputMode = 'decimal';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.setAttribute('aria-describedby', hint.id);
        const check = element('button', 'Comprobar', 'btn-primary');
        check.type = 'submit';
        const row = element('div', '', 'practice-answer-row');
        row.append(input, element('span', question.unit), check);
        const feedback = element('p', '', 'practice-feedback');
        feedback.setAttribute('role', 'status');
        feedback.hidden = true;
        response.append(label, hint, row, feedback);

        form.addEventListener('submit', event => {
            event.preventDefault();
            const valid = parseNumber(input.value) !== null;
            const correct = valid && isCorrect(input.value, question);
            input.setAttribute('aria-invalid', String(!valid));
            feedback.hidden = false;
            feedback.classList.toggle('is-correct', correct);
            if (!valid) {
                feedback.textContent = 'Escribe solo el número. La unidad ya está indicada al lado.';
                input.focus();
                return;
            }
            feedback.textContent = correct
                ? 'Correcto. Revisa cómo se comprueba el resultado.'
                : 'Todavía no coincide. Revisa la pista y las unidades o abre el paso a paso.';
            if (correct) solution.open = true;
            updateProgress(index, correct);
        });
        form.append(header, data, guidance, response, solution);
        return form;
    }

    function showReference() {
        referencePanel.open = true;
        referencePanel.querySelector('summary').focus();
        referencePanel.scrollIntoView({ block: 'start' });
    }

    function resetSession() {
        session.hidden = true;
        session.replaceChildren();
        catalog.hidden = false;
        $('practice-reference-return').hidden = true;
    }

    function startExercise(exercise, startButton) {
        const navigation = element('div', '', 'practice-session-nav');
        navigation.append(
            button('← Todos los ejercicios', 'campus-resource-secondary', () => {
                resetSession();
                startButton.focus();
            }),
            button('Tabla de unidades', 'campus-resource-secondary', showReference)
        );
        const heading = element('h3', exercise.title);
        heading.tabIndex = -1;
        const context = element('details', '', 'practice-case');
        context.append(
            element('summary', exercise.kind === 'Casos aplicados' ? 'Ver el caso completo' : 'Ver las instrucciones del bloque'),
            element('p', exercise.context)
        );

        const total = exercise.questions.length;
        const states = Array(total).fill(null);
        const progress = element('output', '', 'practice-progress');
        progress.setAttribute('aria-live', 'polite');
        const selector = element('nav', '', 'practice-question-picker');
        selector.setAttribute('aria-label', 'Preguntas del bloque');
        let current = 0;
        const numbers = exercise.questions.map((_, i) =>
            button(String(i + 1), 'practice-question-link', () => selectQuestion(i, true)));
        const updateProgress = (index, correct) => {
            states[index] = correct;
            renderProgress();
        };
        const forms = exercise.questions.map((question, i) => questionForm(question, i, total, updateProgress));
        const previous = button('← Anterior', 'campus-resource-secondary', () => selectQuestion(current - 1, true));
        const next = button('Siguiente →', 'campus-resource-secondary', () => selectQuestion(current + 1, true));

        function renderProgress() {
            progress.textContent = states.filter(value => value === true).length + ' de ' + total + ' correctas';
            numbers.forEach((control, i) => {
                const state = states[i];
                control.classList.toggle('is-correct', state === true);
                control.setAttribute('aria-label', 'Pregunta ' + (i + 1) + ' · ' +
                    (state === true ? 'Correcta' : state === false ? 'Por revisar' : 'Pendiente'));
            });
        }

        function selectQuestion(index, focus) {
            current = index;
            forms.forEach((form, i) => {
                form.hidden = i !== current;
                if (i === current) numbers[i].setAttribute('aria-current', 'step');
                else numbers[i].removeAttribute('aria-current');
            });
            previous.disabled = current === 0;
            next.disabled = current === total - 1;
            if (focus) forms[current].querySelector('h4').focus();
        }

        selector.append(...numbers);
        const picker = element('div', '', 'practice-session-head');
        picker.append(selector, progress);
        const paging = element('div', '', 'practice-paging');
        paging.append(previous, next);
        session.replaceChildren(
            navigation,
            element('p', exercise.subject + ' · ' + exercise.kind, 'practice-session-subject'),
            heading,
            element('p', exercise.route, 'practice-route'),
            context,
            picker,
            ...forms,
            paging
        );
        catalog.hidden = true;
        referencePanel.open = false;
        $('practice-reference-return').hidden = false;
        session.hidden = false;
        session.dataset.exercise = exercise.id;
        selectQuestion(0, false);
        renderProgress();
        heading.focus({ preventScroll: true });
        session.scrollIntoView({ block: 'nearest' });
    }

    $('practice-reference-open').onclick = showReference;
    $('practice-reference-return').onclick = () => {
        referencePanel.open = false;
        session.querySelector('.practice-exercise:not([hidden]) h4').focus();
    };

    $('practice-reference-groups').replaceChildren(...reference.map(referenceGroup));
    for (const [filter, field] of [[subject, 'subject'], [kind, 'kind']]) {
        const values = [...new Set(exercises.map(exercise => exercise[field]))].sort((a, b) => a.localeCompare(b, 'es'));
        for (const value of values) filter.add(new Option(value, value));
        filter.addEventListener('change', renderCatalog);
    }
    renderCatalog();
    window.SufficiencyPractice = {
        openExercise(id) {
            const exercise = exercises.find(item => item.id === id);
            if (!exercise) return;
            if (!session.hidden && session.dataset.exercise === id) {
                session.querySelector('h3').focus();
                return;
            }
            resetSession();
            subject.value = exercise.subject;
            kind.value = '';
            renderCatalog();
            catalog.querySelector('[data-practice-exercise="' + exercise.id + '"]').click();
        },
        reset() {
            resetSession();
            subject.value = kind.value = '';
            referencePanel.open = false;
            renderCatalog();
        },
    };
})();
