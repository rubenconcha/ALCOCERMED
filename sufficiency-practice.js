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
            element('p', exercise.questions.length + ' preguntas con resolución', 'past-card-note'),
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

    function questionForm(question, index, updateProgress) {
        const id = 'practice-answer-' + index;
        const form = element('form', '', 'practice-exercise');
        const label = element('label', (index + 1) + '. ' + question.prompt);
        label.htmlFor = id;
        const precision = question.decimals === 0 ? 'al entero' : 'a ' + question.decimals + (question.decimals === 1 ? ' decimal' : ' decimales');
        const hint = element('p', 'Responde en ' + question.unit + ' y redondea ' + precision + '.', 'practice-form-hint');
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
        const solution = element('details', '', 'practice-solution');
        const steps = element('ol');
        steps.append(...question.steps.map(step => element('li', step)));
        solution.append(
            element('summary', 'Ver resolución'),
            steps,
            element('p', 'Resultado · ' + formatAnswer(question) + ' ' + question.unit)
        );

        form.addEventListener('submit', event => {
            event.preventDefault();
            const valid = parseNumber(input.value) !== null;
            const correct = valid && isCorrect(input.value, question);
            input.setAttribute('aria-invalid', String(!valid));
            feedback.hidden = false;
            feedback.classList.toggle('is-correct', correct);
            if (!valid) {
                feedback.textContent = 'Escribe un número. Puedes usar coma o punto decimal.';
                input.focus();
                return;
            }
            feedback.textContent = correct
                ? '¡Correcto!'
                : 'Revisa el cálculo y las unidades. Puedes volver a intentarlo o ver la resolución.';
            if (correct) solution.open = true;
            updateProgress(index, correct);
        });
        form.append(label, hint, row, feedback, solution);
        return form;
    }

    function resetSession() {
        session.hidden = true;
        session.replaceChildren();
        catalog.hidden = false;
    }

    function startExercise(exercise, startButton) {
        const head = element('div', '', 'practice-session-head');
        const navigation = element('div', '', 'practice-session-nav');
        navigation.append(
            button('← Volver a los ejercicios', 'campus-resource-secondary', () => {
                resetSession();
                startButton.focus();
            }),
            button('Consultar tabla', 'campus-resource-secondary', () => {
                referencePanel.open = true;
                referencePanel.querySelector('summary').focus();
                referencePanel.scrollIntoView({ block: 'start' });
            })
        );
        const progress = element('output', '0 de ' + exercise.questions.length + ' correctas');
        head.append(navigation, progress);
        const heading = element('h3', exercise.title);
        heading.tabIndex = -1;
        const solved = new Set();
        const updateProgress = (index, correct) => {
            if (correct) solved.add(index);
            else solved.delete(index);
            progress.textContent = solved.size + ' de ' + exercise.questions.length + ' correctas';
        };
        session.replaceChildren(
            head,
            heading,
            element('p', exercise.context, 'practice-context'),
            element('p', 'Usa coma o punto decimal. Para separar miles usa espacios. Conserva los decimales hasta el último paso.'),
            ...exercise.questions.map((question, index) => questionForm(question, index, updateProgress))
        );
        catalog.hidden = true;
        session.hidden = false;
        session.dataset.exercise = exercise.id;
        heading.focus({ preventScroll: true });
        session.scrollIntoView({ block: 'nearest' });
    }

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
