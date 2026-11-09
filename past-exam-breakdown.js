'use strict';
window.createPastExamBreakdown = function (request, scope) {
    const $ = id => document.getElementById(id);
    const topicPicker = $('past-topic-picker');
    const subjectPicker = $('past-subject-picker');
    const topicSearch = $('past-topic-search');
    const questionSearch = $('past-question-search');
    const unconfirmed = $('past-unconfirmed');
    const answers = new Map();
    const recent = new Map();
    let data, controller, assigned, active = false, showAll = false, cursor = 0, search = '';
    let subjects = new Set(), topics = new Set(), draftSubjects = new Set(), draftTopics = new Set();
    const fold = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    function node(tag, text, className) {
        const result = document.createElement(tag);
        if (text) result.textContent = text;
        if (className) result.className = className;
        return result;
    }

    function pickerLabel(id, values, items, fallback, plural) {
        const item = items?.find(entry => values.has(entry.id));
        $(id).textContent = values.size > 1 ? values.size + ' ' + plural : item?.label || item?.title || fallback;
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
        pickerLabel('past-subject-value', subjects, data?.subjects, 'Todas las materias', 'materias');
        pickerLabel('past-topic-value', topics, data?.topics, 'Todos los temas', 'temas');
        if (subjectPicker.open) renderSubjects();
        if (topicPicker.open) renderTopics();
    }

    function renderQuestion(focus = false) {
        const row = data.questions[cursor];
        const question = row.question;
        const state = answers.get(question.id);
        const accepted = simAcceptedAnswerIndices(question);
        const ordinal = (data.page - 1) * data.pageSize + cursor + 1;
        const checked = Boolean(state?.checked);
        $('past-question-meta').textContent = row.type + ' · ' + row.year;
        $('past-question-title').replaceChildren(document.createTextNode('Pregunta '),
            node('span', String(question.numero_original), 'past-question-badge'));
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
            label.append(radio, node('span', letter, 'past-option-letter'), node('span', content));
            options.append(label);
        }
        const check = $('past-check-answer');
        check.textContent = checked ? 'Volver a responder' : 'Comprobar respuesta';
        check.classList.toggle('is-retry', checked);
        check.disabled = !accepted.length || state?.selected == null;
        const feedback = $('past-answer-feedback');
        feedback.hidden = !checked;
        const correct = checked && accepted.includes(state.selected);
        feedback.classList.toggle('is-correct', correct);
        feedback.classList.toggle('is-incorrect', checked && !correct);
        if (checked) {
            const result = question.clave_en_discrepancia
                ? (correct ? 'Coincide con la clave original.' : 'La clave original marca otra opción.')
                : (correct ? 'Respuesta correcta.' : 'Revisa tu respuesta.');
            feedback.replaceChildren(node('strong', result));
        }
        const commentary = checked
            ? { ...QuestionReview.commentaryData(question, campo), selected: state.selected, accepted }
            : {};
        $('past-commentary').replaceChildren(QuestionReview.showCommentary(commentary, {
            compactSource: true,
            lockedMessage: checked ? '' : accepted.length
                ? 'Comprueba tu respuesta para ver el comentario.'
                : 'Selecciona otra pregunta para continuar.',
        }));
        $('past-question-position').textContent = ordinal + ' de ' + data.count;
        $('past-question-prev').disabled = ordinal <= 1;
        $('past-question-next').disabled = ordinal >= data.count;
        $('past-page-prev').disabled = data.page <= 1;
        $('past-page-next').disabled = data.page >= data.pages;
        $('past-question-pages').hidden = data.pages <= 1;
        $('past-page-label').textContent = 'Página ' + data.page + ' de ' + data.pages;
        const buttons = data.questions.map((item, i) => {
            const position = (data.page - 1) * data.pageSize + i + 1;
            const number = node('button', String(assigned ? item.question.numero_original : position));
            number.type = 'button';
            const attempt = answers.get(item.question.id);
            let status = 'Pendiente';
            if (attempt?.checked) {
                const correct = simAcceptedAnswerIndices(item.question).includes(attempt.selected);
                number.classList.add(correct ? 'is-correct' : 'is-incorrect');
                status = correct ? 'Correcta' : 'Incorrecta';
            }
            number.setAttribute('aria-label', 'Pregunta ' + position + ' de los resultados. Original ' +
                item.question.numero_original + ' · ' + item.year + ' · ' + item.type + ' · ' + status);
            if (i === cursor) number.setAttribute('aria-current', 'true');
            number.onclick = () => { cursor = i; renderQuestion(true); };
            return number;
        });
        const numbers = $('past-question-numbers');
        if (assigned) {
            const groups = new Map();
            for (const [index, item] of data.questions.entries()) {
                const exam = item.year + ' · ' + item.type;
                if (!groups.has(exam)) {
                    const group = node('div', '', 'calendar-question-year');
                    group.append(node('span', exam));
                    groups.set(exam, group);
                }
                groups.get(exam).append(buttons[index]);
            }
            numbers.replaceChildren(...groups.values());
        } else {
            numbers.replaceChildren(...buttons);
        }
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
        if (assigned) {
            const { subject, topics } = assigned.filter;
            return { year: '', type: '', page: String(page), subjects: subject, topics: topics.join(','), search: '', all: '', unconfirmed: '' };
        }
        const current = scope();
        return { ...current, page: String(page), subjects: [...subjects].join(','), topics: [...topics].join(','),
            search, all: showAll ? '1' : '', unconfirmed: unconfirmed.checked ? '1' : '' };
    }

    async function load(page = 1, last = false, focus = false) {
        if (!active) return;
        controller?.abort();
        const next = new AbortController();
        controller = next;
        const query = parameters(page);
        const status = assigned?.status || $('past-status');
        const total = assigned ? null : $('past-count');
        const key = JSON.stringify(query);
        const cached = recent.get(key);
        const saved = cached && cached.expires > Date.now() ? cached.result : null;
        if (!saved) {
            status.textContent = 'Cargando preguntas…';
            if (total) total.textContent = '';
            $('past-breakdown-results').hidden = true;
            $('past-breakdown-empty').hidden = true;
        }
        try {
            const result = saved || await request(query, next.signal);
            if (!active || next.signal.aborted || !result) return;
            if (!saved) {
                recent.set(key, { result, expires: Date.now() + 90000 });
                if (recent.size > 12) recent.delete(recent.keys().next().value);
            }
            data = result;
            if (!assigned) updatePickerLabels();
            status.textContent = '';
            const count = data.requested ? data.count : data.available;
            if (total) total.textContent = count + (count === 1 ? ' pregunta' : ' preguntas') + (data.requested ? '' : ' disponibles');
            if (data.locked) {
                empty('Gestión reservada', 'Elige una gestión disponible o consulta los planes para practicar esta selección.',
                    'Consultar planes', () => CampusAccess.unlock());
            } else if (!data.requested) {
                empty('Elige qué quieres practicar', 'Selecciona la gestión, el parcial, una materia o un tema. También puedes buscar por texto.',
                    'Ver todas las preguntas disponibles', () => { showAll = true; load(); });
            } else if (!data.questions.length) {
                if (assigned) {
                    empty('Sin preguntas originales para este tema', 'Puedes elegir otro tema del horario.',
                        assigned.fallback ? 'Practicar en el banco' : '', assigned.fallback);
                } else if (topics.size && !query.year && !query.type && !query.search) {
                    empty('No hay preguntas de esta selección', 'En las gestiones disponibles para tu cuenta no hay preguntas originales de los temas seleccionados.');
                } else {
                    empty('No hay preguntas con estos filtros', 'Prueba con otro tema o amplía la gestión.');
                }
            } else {
                cursor = last ? data.questions.length - 1 : 0;
                $('past-breakdown-empty').hidden = true;
                $('past-breakdown-results').hidden = false;
                renderQuestion(focus);
            }
        } catch (error) {
            if (next.signal.aborted || !active) return;
            status.textContent = '';
            empty('No se pudieron cargar las preguntas', error.message, 'Reintentar', () => load(page, last, focus));
        }
    }

    function resetFilters({ subject, topics: selectedTopics = [] } = {}) {
        subjects = new Set(subject ? [subject] : []);
        topics = new Set(selectedTopics);
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
        $('past-check-answer').focus({ preventScroll: Boolean(assigned) });
    };
    $('past-question-prev').onclick = () => step(-1);
    $('past-question-next').onclick = () => step(1);
    $('past-page-prev').onclick = () => load(data.page - 1, false, true);
    $('past-page-next').onclick = () => load(data.page + 1, false, true);
    $('past-toggle-filters').onclick = event => {
        const button = event.currentTarget;
        const open = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!open));
        button.textContent = open ? 'Mostrar filtros' : 'Ocultar filtros';
    };
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

    function show(enabled) {
        if (active === enabled) return;
        active = enabled;
        if (enabled) load();
        else {
            controller?.abort();
            subjectPicker.open = false;
            topicPicker.open = false;
        }
    }

    function openAssigned(host, context) {
        show(false);
        const panel = $('past-breakdown');
        const index = $('past-question-index');
        const home = panel.parentElement;
        const wasOpen = index.open;
        assigned = context;
        host.append(panel);
        index.open = false;
        panel.hidden = false;
        show(true);
        return () => {
            show(false);
            assigned = null;
            panel.hidden = true;
            home.append(panel);
            index.open = wasOpen;
        };
    }

    return {
        show,
        openAssigned,
        isAssigned: () => Boolean(assigned),
        refresh: () => load(),
        resetFilters,
        clear() {
            controller?.abort();
            answers.clear();
            recent.clear();
            data = null;
            resetFilters();
            $('past-question-stem').textContent = '';
            $('past-answer-options').replaceChildren();
            $('past-question-numbers').replaceChildren();
            $('past-breakdown-results').hidden = true;
        },
    };
};
