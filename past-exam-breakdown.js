'use strict';
window.createPastExamBreakdown = function (request, scope) {
    const $ = id => document.getElementById(id);
    const topicPicker = $('past-topic-picker');
    const subjectPicker = $('past-subject-picker');
    const topicSearch = $('past-topic-search');
    const questionSearch = $('past-question-search');
    const unconfirmed = $('past-unconfirmed');
    const answers = new Map();
    let data, controller, active = false, showAll = false, cursor = 0, search = '';
    let subjects = new Set(), topics = new Set(), draftSubjects = new Set(), draftTopics = new Set();
    const fold = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    function node(tag, text, className) {
        const result = document.createElement(tag);
        if (text) result.textContent = text;
        if (className) result.className = className;
        return result;
    }

    function selectedCount(id, values) {
        const count = $(id);
        count.textContent = values.size || '';
        count.hidden = !values.size;
    }

    function option(item, choices) {
        const label = node('label', '', 'past-picker-option');
        const input = node('input');
        input.type = 'checkbox';
        input.value = item.id;
        input.checked = choices.has(item.id);
        input.onchange = () => input.checked ? choices.add(item.id) : choices.delete(item.id);
        label.append(input, node('span', item.label || item.title), node('small', String(item.count)));
        return label;
    }

    function renderSubjects() {
        const options = data?.subjects || [];
        $('past-subject-options').replaceChildren(...(options.length
            ? options.map(item => option(item, draftSubjects))
            : [node('p', 'No hay materias en esta selección.', 'past-picker-empty')]));
    }

    function renderTopics() {
        const input = fold(topicSearch.value.trim());
        const root = $('past-topic-options');
        const available = (data?.topics || []).filter(item => (!subjects.size || subjects.has(item.subject))
            && (!input || fold(item.title + ' ' + item.section).includes(input)));
        root.replaceChildren();
        for (const subject of data?.subjects || []) {
            const group = available.filter(item => item.subject === subject.id);
            if (!group.length) continue;
            const fieldset = node('fieldset');
            fieldset.append(node('legend', subject.label), ...group.map(item => option(item, draftTopics)));
            root.append(fieldset);
        }
        if (!root.children.length) root.append(node('p', 'No hay temas que coincidan.', 'past-picker-empty'));
    }

    function updatePickerLabels() {
        selectedCount('past-subject-count', subjects);
        selectedCount('past-topic-count', topics);
        if (subjectPicker.open) renderSubjects();
        if (topicPicker.open) renderTopics();
    }

    function reference(topic, subject) {
        const target = $('past-bibliography-copy');
        if (!topic || !subject) {
            target.replaceChildren(node('p', 'Esta pregunta histórica todavía no tiene un tema confirmado en la bibliografía vigente.'));
            return;
        }
        const print = topic.printedPage ? ' · pág. impresa ' + topic.printedPage : '';
        target.replaceChildren(
            node('strong', subject.title),
            node('p', subject.credit),
            node('p', topic.section + ' · ' + topic.title),
            node('p', 'Inicio de la sección · pág. ' + topic.pdfPage + ' del PDF' + print)
        );
    }

    function renderQuestion(focus = false) {
        const row = data.questions[cursor];
        const question = row.question;
        const state = answers.get(question.id);
        const subject = data.subjects.find(item => item.id === row.subject);
        const topic = data.topics.find(item => item.id === row.topic);
        const accepted = simAcceptedAnswerIndices(question);
        const ordinal = (data.page - 1) * data.pageSize + cursor + 1;
        const checked = Boolean(state?.checked);
        const meta = [row.type + ' · ' + row.year, subject?.label, topic?.title || 'Sin tema confirmado'].filter(Boolean);
        $('past-question-meta').replaceChildren(...meta.map(text => node('span', text)));
        $('past-question-title').textContent = 'Pregunta original ' + question.numero_original;
        $('past-question-stem').textContent = question.pregunta;
        const options = $('past-answer-options');
        options.replaceChildren(node('legend', 'Elige una alternativa'));
        for (const [position, letter] of [...'ABCDE'].entries()) {
            const content = question['opcion_' + letter.toLowerCase()];
            if (!content) continue;
            const label = node('label', '', 'past-answer-option');
            const radio = node('input');
            radio.type = 'radio';
            radio.name = 'past-answer';
            radio.value = position;
            radio.checked = state?.selected === position;
            radio.disabled = checked;
            radio.onchange = () => {
                answers.set(question.id, { selected: position });
                $('past-check-answer').disabled = !accepted.length;
            };
            if (checked) {
                if (accepted.includes(position)) label.classList.add('is-correct');
                else if (radio.checked) label.classList.add('is-incorrect');
            }
            label.append(radio, node('b', letter), node('span', content));
            options.append(label);
        }
        const check = $('past-check-answer');
        check.textContent = checked ? 'Volver a responder' : 'Comprobar respuesta';
        check.disabled = !accepted.length || state?.selected == null;
        const feedback = $('past-answer-feedback');
        feedback.hidden = !checked && Boolean(accepted.length);
        feedback.classList.toggle('is-correct', checked && accepted.includes(state.selected));
        const keys = accepted.map(i => 'ABCDE'[i]).filter(Boolean).join(', ');
        const result = checked ? (accepted.includes(state.selected) ? 'Respuesta correcta. ' : 'Revisa tu respuesta. ') : '';
        feedback.textContent = accepted.length ? result + 'Patrón original · ' + keys
            : 'Esta pregunta no tiene una clave utilizable en el patrón.';
        reference(topic, topic?.bibliography);
        $('past-bibliography').open = false;
        $('past-question-position').textContent = ordinal + ' de ' + data.count;
        $('past-question-prev').disabled = ordinal <= 1;
        $('past-question-next').disabled = ordinal >= data.count;
        $('past-page-prev').disabled = data.page <= 1;
        $('past-page-next').disabled = data.page >= data.pages;
        $('past-question-pages').hidden = data.pages <= 1;
        $('past-page-label').textContent = 'Página ' + data.page + ' de ' + data.pages;
        $('past-question-numbers').replaceChildren(...data.questions.map((item, i) => {
            const number = node('button', String((data.page - 1) * data.pageSize + i + 1));
            number.type = 'button';
            number.setAttribute('aria-label', 'Pregunta ' + number.textContent + ' de los resultados. Original ' +
                item.question.numero_original + ' · ' + item.year + ' · ' + item.type);
            if (i === cursor) number.setAttribute('aria-current', 'true');
            const attempt = answers.get(item.question.id);
            if (attempt?.checked) number.classList.add(simAcceptedAnswerIndices(item.question).includes(attempt.selected)
                ? 'is-correct' : 'is-incorrect');
            number.onclick = () => { cursor = i; renderQuestion(true); };
            return number;
        }));
        if (focus) $('past-question-title').focus();
    }

    function empty(title, copy, actionLabel, action) {
        $('past-breakdown-results').hidden = true;
        $('past-breakdown-empty').hidden = false;
        $('past-breakdown-empty-title').textContent = title;
        $('past-breakdown-empty-copy').textContent = copy;
        const button = $('past-breakdown-empty-action');
        button.hidden = !actionLabel;
        button.textContent = actionLabel || '';
        button.onclick = action || null;
    }

    function parameters(page) {
        const current = scope();
        return { ...current, page: String(page), subjects: [...subjects].join(','), topics: [...topics].join(','),
            search, all: showAll ? '1' : '', unconfirmed: unconfirmed.checked ? '1' : '' };
    }

    async function load(page = 1, last = false, focus = false) {
        if (!active) return;
        controller?.abort();
        const next = new AbortController();
        controller = next;
        $('past-status').textContent = 'Cargando preguntas…';
        $('past-count').textContent = '';
        $('past-breakdown-results').hidden = true;
        $('past-breakdown-empty').hidden = true;
        try {
            const result = await request(parameters(page), next.signal);
            if (!active || next.signal.aborted || !result) return;
            data = result;
            updatePickerLabels();
            $('past-status').textContent = '';
            const count = data.requested ? data.count : data.available;
            $('past-count').textContent = count + (count === 1 ? ' pregunta' : ' preguntas') + (data.requested ? '' : ' disponibles');
            if (data.locked) {
                empty('Gestión reservada', 'Elige una gestión disponible o consulta los planes para practicar esta selección.',
                    'Consultar planes', () => CampusAccess.unlock());
            } else if (!data.requested) {
                empty('Elige qué quieres practicar', 'Selecciona la gestión, el parcial, una materia o un tema. También puedes buscar por texto.',
                    'Ver todas las preguntas disponibles', () => { showAll = true; load(); });
            } else if (!data.questions.length) {
                empty('No hay preguntas con estos filtros', 'Prueba con otro tema o amplía la gestión.');
            } else {
                cursor = last ? data.questions.length - 1 : 0;
                $('past-breakdown-results').hidden = false;
                renderQuestion(focus);
            }
        } catch (error) {
            if (next.signal.aborted || !active) return;
            $('past-status').textContent = '';
            empty('No se pudo cargar el desglose', error.message, 'Reintentar', () => load(page, last, focus));
        }
    }

    function resetFilters() {
        subjects = new Set();
        topics = new Set();
        search = '';
        showAll = false;
        questionSearch.value = '';
        unconfirmed.checked = false;
        subjectPicker.open = false;
        topicPicker.open = false;
        updatePickerLabels();
    }

    function step(delta) {
        const next = cursor + delta;
        if (next >= 0 && next < data.questions.length) { cursor = next; renderQuestion(true); }
        else load(data.page + delta, delta < 0, true);
    }

    subjectPicker.addEventListener('toggle', () => {
        if (!subjectPicker.open) return;
        topicPicker.open = false;
        draftSubjects = new Set(subjects);
        renderSubjects();
    });
    topicPicker.addEventListener('toggle', () => {
        if (!topicPicker.open) return;
        subjectPicker.open = false;
        draftTopics = new Set(topics);
        topicSearch.value = '';
        renderTopics();
    });
    topicSearch.oninput = renderTopics;
    $('past-subject-apply').onclick = () => {
        subjects = draftSubjects || new Set();
        if (subjects.size) topics = new Set([...topics].filter(id => subjects.has(data?.topics.find(t => t.id === id)?.subject)));
        subjectPicker.open = false;
        subjectPicker.querySelector('summary').focus({ preventScroll: true });
        updatePickerLabels();
        load();
    };
    $('past-topic-apply').onclick = () => {
        topics = draftTopics || new Set();
        if (topics.size) unconfirmed.checked = false;
        topicPicker.open = false;
        topicPicker.querySelector('summary').focus({ preventScroll: true });
        updatePickerLabels();
        load();
    };
    $('past-subject-clear').onclick = () => { draftSubjects = new Set(); renderSubjects(); };
    $('past-topic-clear').onclick = () => { draftTopics = new Set(); renderTopics(); };
    $('past-question-filters').onsubmit = event => {
        event.preventDefault();
        search = questionSearch.value.trim();
        load();
    };
    $('past-reset-filters').onclick = () => {
        $('past-year').value = '';
        $('past-type').value = '';
        resetFilters();
        $('past-year').dispatchEvent(new Event('change'));
    };
    unconfirmed.onchange = () => {
        if (unconfirmed.checked) topics.clear();
        updatePickerLabels();
        load();
    };
    $('past-answer-form').onsubmit = event => {
        event.preventDefault();
        const id = data.questions[cursor].question.id;
        const answer = answers.get(id);
        if (answer?.checked) answers.delete(id);
        else if (answer) answer.checked = true;
        renderQuestion();
        $('past-check-answer').focus();
    };
    $('past-question-prev').onclick = () => step(-1);
    $('past-question-next').onclick = () => step(1);
    $('past-page-prev').onclick = () => load(data.page - 1, false, true);
    $('past-page-next').onclick = () => load(data.page + 1, false, true);
    $('past-question-index').open = !matchMedia('(max-width: 768px)').matches;
    document.addEventListener('click', event => {
        if (event.target.closest('.past-picker')) return;
        subjectPicker.open = false;
        topicPicker.open = false;
    });
    document.addEventListener('keydown', event => {
        if (!active || event.key !== 'Escape') return;
        for (const picker of [subjectPicker, topicPicker]) {
            if (!picker.open) continue;
            picker.open = false;
            picker.querySelector('summary').focus();
        }
    });

    return {
        show(enabled) {
            if (active === enabled) return;
            active = enabled;
            if (enabled) load();
            else {
                controller?.abort();
                subjectPicker.open = false;
                topicPicker.open = false;
            }
        },
        refresh: () => load(),
        resetFilters,
        clear() {
            controller?.abort();
            answers.clear();
            data = null;
            resetFilters();
            $('past-question-stem').textContent = '';
            $('past-answer-options').replaceChildren();
            $('past-question-numbers').replaceChildren();
            $('past-breakdown-results').hidden = true;
        },
    };
};
