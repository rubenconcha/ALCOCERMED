'use strict';
(() => {
    const data = window.StudyCalendarData;
    const byId = id => document.getElementById(id);
    const screen = byId('study-calendar-screen');
    const board = byId('calendar-board');
    const overview = byId('calendar-overview');
    const dayPanel = byId('calendar-day');
    const small = window.matchMedia('(max-width: 768px)');
    const compact = window.matchMedia('(max-width: 950px)');
    const plan = byId('calendar-plan');
    const planToggle = byId('calendar-show-schedule');
    const workspace = byId('calendar-activity');
    const tools = byId('calendar-workspace-tools');
    const scripts = new Map();
    const activityViews = { reading: 'study', questions: 'breakdown', evaluation: 'evaluation' };
    const viewTitles = { study: 'Estudio', orientation: 'Estudio', manual: 'Estudio', breakdown: 'Examen pasado', evaluation: 'Evaluación' };
    const actions = {
        practice: ['Abrir ejercicio', item => openStudyAsset(item, 'practice', () => {
            if (showScreen('sufficiency-practice-screen') !== false) window.SufficiencyPractice.openExercise(item.practice.id);
        })],
        simulation: ['Ver simulacros', () => window.openCampusSimulations()],
        results: ['Ver mis resultados', () => window.openStudentResults()],
        flashcards: ['Repasar con flashcards', () => window.openStudyLibrary()],
    };
    const state = { user: '', date: '', active: null, completed: new Set(), ratings: {}, plan: new Map(), reference: '' };
    let calendar;
    let loading;
    let lastBoardWidth = 0;
    let view, reading, releasePanel, lastEvaluation;
    let revision = 0;
    let examMounted = false;

    function element(tag, css, text) {
        const node = document.createElement(tag);
        if (css) node.className = css;
        if (text) node.textContent = text;
        return node;
    }

    function icon(name) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        svg.setAttribute('aria-hidden', 'true');
        use.setAttribute('href', '/assets/calendar-icons.svg#' + name);
        svg.append(use);
        return svg;
    }

    function button(css, text, handler) {
        const node = element('button', css, text);
        node.type = 'button';
        node.addEventListener('click', handler);
        return node;
    }

    async function openStudyAsset(item, group, open) {
        await window.loadCampusAssets(group);
        if (state.active === item && !dayPanel.hidden && !screen.classList.contains('hidden')) return open();
    }

    function loadScript(url) {
        if (!scripts.has(url)) {
            scripts.set(url, new Promise((resolve, reject) => {
                const node = document.createElement('script');
                node.src = url;
                node.onload = resolve;
                node.onerror = () => {
                    node.remove();
                    scripts.delete(url);
                    reject(new Error('Recurso del calendario no disponible'));
                };
                document.head.append(node);
            }));
        }
        return scripts.get(url);
    }

    function storageKey() {
        return 'alcocermed-calendar-v1:' + state.user;
    }

    function saveProgress() {
        if (!state.user) return;
        try {
            localStorage.setItem(storageKey(), JSON.stringify({ completed: [...state.completed], ratings: state.ratings }));
        } catch (_) { /* The current session can still use the calendar. */ }
    }

    function setUser(id = '') {
        if (state.user !== id) {
            state.user = id;
            state.date = '';
            state.active = null;
            lastEvaluation = null;
            state.completed = new Set();
            state.ratings = {};
            if (id) {
                try {
                    const saved = JSON.parse(localStorage.getItem(storageKey()) || '{}');
                    if (Array.isArray(saved.completed)) state.completed = new Set(saved.completed);
                    if (saved.ratings && typeof saved.ratings === 'object') state.ratings = saved.ratings;
                } catch (_) { /* Ignore storage from an incomplete session. */ }
            }
            showOverview();
        }
        if (!id) screenChanged(false);
    }

    function setStatus(text, retry = false) {
        const status = byId('calendar-load-status');
        status.textContent = text;
        status.hidden = !text;
        byId('calendar-retry').hidden = !retry;
    }

    function currentDateKey(date) {
        return date.toISOString().slice(0, 10);
    }

    function setActivityStyle(node, kind, readingSlug) {
        node.dataset.kind = kind;
        if (readingSlug) node.dataset.subject = readingSlug;
    }

    function getEvents(info, success) {
        const start = currentDateKey(info.start);
        const end = currentDateKey(info.end);
        const events = [];
        for (const [date, items] of state.plan) {
            if (date < start || date >= end) continue;
            const kindsShown = new Set();
            for (const item of items) {
                if (!item.show) continue;
                // Give each activity type a turn in the two monthly preview slots.
                const monthPriority = kindsShown.has(item.kind) ? 1 : 0;
                kindsShown.add(item.kind);
                events.push({
                    id: item.id, title: item.title, start: date + 'T' + item.start,
                    end: item.end ? date + 'T' + item.end : undefined,
                    extendedProps: { date, kind: item.kind, subject: item.reading?.slug, monthPriority },
                });
            }
        }
        success(events);
    }

    function decorateToolbar() {
        for (const [name, symbol] of [['dayGridMonth', 'calendar'], ['listWeek', 'agenda']]) {
            const control = board.querySelector('.fc-' + name + '-button');
            if (control && !control.querySelector('svg')) control.prepend(icon(symbol));
        }
    }

    function defaultView() {
        return small.matches ? 'listWeek' : 'dayGridMonth';
    }

    function calendarHeight() {
        return small.matches ? 'auto' : 'max(785px, calc(100dvh - var(--shell-top, 63px) - 74px))';
    }

    async function downloadProgram() {
        const control = board.querySelector('.fc-program-button');
        if (!calendar || control?.disabled) return;
        const start = currentDateKey(calendar.view.currentStart);
        const end = currentDateKey(calendar.view.currentEnd);
        if (control) control.disabled = true;
        setStatus('Preparando el programa…');
        try {
            await loadScript('/vendor/jspdf/jspdf.umd.min.js');
            const pdf = window.StudyCalendarPdf.create(window.jspdf.jsPDF, state.plan, start, end);
            pdf.save('AlcocerMed-programa-de-muestra-' + start + '.pdf');
            setStatus('');
        } catch (_) {
            setStatus('No se pudo preparar el programa. Vuelve a pulsar Descargar programa.');
        } finally {
            if (control) control.disabled = false;
        }
    }

    function updatePlan() {
        const reference = data.today();
        if (state.reference !== reference) {
            state.reference = reference;
            state.plan = data.buildSample(reference);
            calendar?.setOption('now', reference);
            calendar?.refetchEvents();
        }
    }

    async function initCalendar() {
        updatePlan();
        if (calendar || loading) return loading;
        setStatus('Cargando el calendario…');
        loading = (async () => {
            try {
                await loadScript('/vendor/fullcalendar/index.global.min.js');
                await loadScript('/vendor/fullcalendar/es.global.min.js');
                calendar = new window.FullCalendar.Calendar(board, {
                    locale: 'es', firstDay: 1, timeZone: 'UTC', now: state.reference,
                    initialView: defaultView(), initialDate: state.date || state.reference,
                    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek program' },
                    buttonText: { month: 'Mes', list: 'Agenda', today: 'Hoy' },
                    customButtons: { program: { text: 'Descargar programa', click: downloadProgram } },
                    height: calendarHeight(), fixedWeekCount: true, dayMaxEvents: 2,
                    eventDisplay: 'block', displayEventTime: false,
                    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
                    views: {
                        dayGridMonth: { eventOrder: 'monthPriority,start', eventOrderStrict: true },
                        listWeek: { displayEventTime: true, displayEventEnd: true },
                    },
                    noEventsText: 'No hay actividades de muestra para esta semana.',
                    navLinks: true,
                    navLinkDayClick: date => showDay(currentDateKey(date)),
                    dateClick: info => showDay(info.dateStr.slice(0, 10)),
                    eventClick: info => showDay(info.event.extendedProps.date, true, info.event.id),
                    eventDidMount: info => {
                        const { kind, subject } = info.event.extendedProps;
                        setActivityStyle(info.el, kind, subject);
                        const control = info.el.querySelector('.fc-list-event-title a') || info.el;
                        control.tabIndex = 0;
                        control.setAttribute('role', 'button');
                        control.setAttribute('aria-label', 'Abrir día · ' + info.event.title);
                        control.addEventListener('keydown', event => {
                            if (event.key !== 'Enter' && event.key !== ' ') return;
                            event.preventDefault();
                            showDay(info.event.extendedProps.date, true, info.event.id);
                        });
                    },
                    datesSet: () => requestAnimationFrame(decorateToolbar),
                    events: getEvents,
                });
                calendar.render();
                setStatus('');
            } catch (_) {
                calendar?.destroy();
                calendar = null;
                setStatus('No se pudo cargar el calendario.', true);
            } finally {
                loading = null;
            }
        })();
        return loading;
    }

    function activities() {
        return state.plan.get(state.date) || [];
    }

    function renderProgress() {
        const items = activities();
        const done = items.filter(item => state.completed.has(item.id)).length;
        const progress = byId('calendar-plan-progress');
        progress.max = items.length || 1;
        progress.value = done;
        byId('calendar-plan-count').textContent = done + ' de ' + items.length + ' actividades completadas';
        for (const control of screen.querySelectorAll('[data-calendar-complete]')) {
            const complete = state.completed.has(control.dataset.calendarComplete);
            control.setAttribute('aria-pressed', String(complete));
            if (control.classList.contains('calendar-complete-detail')) {
                control.textContent = complete ? 'Actividad completada' : 'Marcar como completada';
            }
        }
    }

    function completionButton(item, css, withIcon = true) {
        const control = button(css, '', () => {
            if (state.completed.has(item.id)) state.completed.delete(item.id);
            else state.completed.add(item.id);
            saveProgress();
            if (item === state.active && view === 'evaluation' && !examMounted) renderActivity();
            else renderProgress();
        });
        control.dataset.calendarComplete = item.id;
        control.setAttribute('aria-label', 'Completar ' + item.title);
        if (withIcon) control.append(icon('check'));
        return control;
    }

    function renderRating() {
        const group = byId('calendar-rating');
        const item = state.active;
        group.replaceChildren();
        group.hidden = !item?.resource || view === 'breakdown' || view === 'manual';
        if (group.hidden) return;
        const label = element('span', '', 'Valora esta actividad');
        group.append(label);
        for (let stars = 1; stars <= 5; stars += 1) {
            const control = button('calendar-star', '★', () => {
                state.ratings[item.id] = stars;
                for (const [index, star] of [...group.querySelectorAll('button')].entries()) {
                    star.setAttribute('aria-pressed', String(index < stars));
                }
                saveProgress();
            });
            control.setAttribute('aria-label', stars + (stars === 1 ? ' estrella' : ' estrellas'));
            control.setAttribute('aria-pressed', String(stars <= (state.ratings[item.id] || 0)));
            group.append(control);
        }
    }

    function clearPanel() {
        ++revision;
        releasePanel?.();
        releasePanel = null;
    }

    function dayIsVisible() {
        return !dayPanel.hidden && !screen.classList.contains('hidden');
    }

    function focusDay() {
        window.scrollTo({ top: 0, behavior: 'instant' });
        byId('calendar-day-title').focus({ preventScroll: true });
    }

    function setPlanOpen(open) {
        plan.hidden = !open;
        dayPanel.classList.toggle('calendar-plan-closed', !open);
        planToggle.setAttribute('aria-expanded', String(open));
        planToggle.setAttribute('aria-label', open ? 'Ocultar horario' : 'Mostrar horario');
    }

    function updateView(next, selectedReading = reading) {
        view = next;
        reading = selectedReading;
        renderActivity();
        focusDay();
    }

    function chooseTopic(next) {
        const resource = next === 'breakdown' ? 'questions' : 'evaluation';
        const scheduled = activities().find(item => item.resource === resource && item.topicLinks === reading.topicLinks);
        if (scheduled) selectActivity(scheduled);
        else updateView(next);
    }

    function tool(text, symbol, run) {
        const control = button('calendar-outline calendar-resource-tool', text, run);
        control.prepend(icon(symbol));
        return control;
    }

    function readingSource(book) {
        const source = element('div', 'calendar-reading-source');
        source.append(
            element('strong', '', book.title),
            element('span', '', book.credit + ' · ' + book.section),
            element('span', '', 'Páginas impresas ' + data.pageRange(book.printed) + ' · PDF ' + data.pageRange(book.pdf))
        );
        return source;
    }

    function renderStudy(item) {
        const card = element('section', 'calendar-study-card');
        const content = element('div', 'calendar-study-topic');
        const symbol = element('span', 'calendar-topic-symbol');
        symbol.append(icon('book'));
        const copy = element('div');
        copy.append(element('small', '', reading.subject + ' · ' + reading.section), element('h3', '', reading.topic));
        content.append(symbol, copy);
        const group = element('div', 'calendar-study-tools');
        group.append(
            tool('Manual', 'book', () => updateView('orientation')),
            tool('Examen pasado', 'agenda', () => chooseTopic('breakdown')),
            tool('Evaluación', 'practice', () => chooseTopic('evaluation'))
        );
        card.append(content, group, readingSource(reading), element('p', 'calendar-study-guide', item.description));
        workspace.append(card);
    }

    function manualNav() {
        const nav = element('nav', 'calendar-manual-nav');
        nav.setAttribute('aria-label', 'Lectura asignada');
        const back = button('calendar-manual-back', '', () => updateView('study'));
        back.setAttribute('aria-label', 'Volver a Estudio');
        back.append(icon('previous'));
        nav.append(back);
        for (const [id, label] of [['orientation', 'Orientación'], ['manual', 'Manual']]) {
            const tab = button('calendar-manual-tab', label, () => updateView(id));
            tab.setAttribute('aria-pressed', String(view === id));
            nav.append(tab);
        }
        return nav;
    }

    function message(host, text) {
        const status = element('p', 'calendar-workspace-status', text);
        status.setAttribute('role', 'status');
        host.append(status);
        return status;
    }

    function renderManual(item, isCurrent) {
        tools.append(manualNav());
        if (view === 'orientation') {
            const title = element('div', 'calendar-reading-heading');
            title.append(element('h3', '', reading.topic), element('p', '', reading.subject + ' · ' + reading.section));
            workspace.append(title);
            const card = element('section', 'calendar-orientation');
            card.append(element('h3', '', 'Orientación de la lectura'), element('p', '', item.description),
                readingSource(reading), button('calendar-primary', 'Abrir páginas del manual', () => updateView('manual')));
            workspace.append(card);
            return;
        }
        const book = reading;
        const host = element('div', 'calendar-reader-host');
        const status = message(host, 'Preparando el manual…');
        workspace.append(host);
        window.loadCampusAssets('texts').then(() => {
            if (!isCurrent()) return;
            releasePanel = () => window.OfficialTexts.closeInline();
            status.hidden = true;
            return window.OfficialTexts.readIn(host, book.slug, book.pdf, book.printed);
        }).catch(() => {
            if (!isCurrent()) return;
            status.hidden = false;
            status.textContent = 'No se pudo abrir el manual.';
            host.append(button('calendar-outline', 'Reintentar', () => updateView('manual')));
        });
    }

    function openBank(book) {
        return window.openBanco({ materia: book.bankSubject, tema: book.bankTopic });
    }

    async function renderBreakdown(isCurrent) {
        const readings = activities().filter(item => item.reading).map(item => item.reading);
        const select = element('select', 'calendar-topic-select');
        select.setAttribute('aria-label', 'Tema del examen pasado');
        readings.forEach((book, i) => select.add(new Option(book.subject + ' · ' + book.topic, String(i))));
        select.value = String(readings.indexOf(reading));
        select.onchange = () => updateView('breakdown', readings[Number(select.value)]);
        tools.append(select);

        const book = reading;
        const fallback = book.bankTopic ? () => openBank(book) : null;
        const status = message(workspace, 'Cargando preguntas del tema…');
        try {
            await window.loadCampusAssets('past');
            if (isCurrent()) {
                const release = await window.CampusPastExams.openAssigned(workspace, { filter: book.topicLinks.past, status, fallback, isCurrent });
                if (isCurrent()) releasePanel = release;
                else release?.();
            }
        } catch (_) {
            if (!isCurrent()) return;
            status.textContent = 'No pudimos cargar las preguntas del tema.';
            workspace.append(button('calendar-outline', 'Reintentar', () => updateView('breakdown', book)));
        }
    }

    function mountEvaluation() {
        const exam = byId('sim-exam');
        const result = byId('sim-result');
        const home = exam.parentElement;
        releasePanel?.();
        workspace.dataset.view = 'attempt';
        workspace.replaceChildren(exam, result);
        examMounted = true;
        releasePanel = () => {
            exam.classList.add('hidden');
            result.classList.add('hidden');
            home.append(exam, result);
            examMounted = false;
        };
    }

    function resultFor(book) {
        return lastEvaluation?.date === state.date && lastEvaluation.topic === book.topicLinks.evaluation
            && lastEvaluation.answers === simState.answers && !CampusAccess.isFree() ? lastEvaluation : null;
    }

    function renderEvaluation(item, isCurrent) {
        const card = element('section', 'calendar-evaluation-card');
        const status = message(card, 'Cargando evaluación del tema…');
        workspace.append(card);
        const book = reading;
        const controller = new AbortController();
        releasePanel = () => controller.abort();
        window.loadCampusAssets('evaluations').then(() => {
            if (isCurrent()) return window.TopicEvaluations.describe(book.topicLinks.evaluation);
        }).then(exam => {
            if (!isCurrent()) return;
            if (!exam) throw new Error('La evaluación de este tema aún no está disponible.');
            const result = resultFor(book);
            status.classList.add('calendar-evaluation-status');
            const marked = item.resource === 'evaluation' && state.completed.has(item.id);
            status.textContent = result ? 'Evaluación completada.'
                : marked ? 'Actividad marcada como completada.' : 'Tienes una evaluación pendiente.';
            const fields = element('dl', 'calendar-evaluation-fields');
            const values = [['Evaluación', exam.title], ['Preguntas', exam.count], ['Duración', exam.duration + ' minutos']];
            if (item.resource === 'evaluation') values.push(['Horario del plan', item.start + ' – ' + item.end]);
            if (result) {
                const time = new Intl.DateTimeFormat('es-BO', { timeZone: data.zone, hour: '2-digit', minute: '2-digit', hour12: false });
                values.push(['Iniciado', time.format(result.started)], ['Última actividad', time.format(result.finished)]);
            }
            for (const [label, value] of values) {
                fields.append(element('dt', '', label), element('dd', '', String(value)));
            }
            const group = element('div', 'calendar-study-tools');
            if (result) group.append(button('calendar-primary', 'Revisar respuestas', () => {
                mountEvaluation();
                showSimScreen('sim-result');
                focusDay();
            }));
            const label = CampusAccess.isFree() ? 'Desbloquear evaluación' : result ? 'Repetir evaluación' : 'Iniciar evaluación';
            const start = button('calendar-evaluation-start', label, () =>
                window.TopicEvaluations.startAssigned(exam, start, { isCurrent, signal: controller.signal, mount: mountEvaluation }));
            group.append(start);
            card.append(fields, group);
        }).catch(error => {
            if (!isCurrent()) return;
            status.textContent = error.message;
            card.append(button('calendar-outline', 'Reintentar', () => updateView('evaluation')));
        });
    }

    function evaluationFinished() {
        if (!examMounted || !reading || simState.topicEvaluationId !== reading.topicLinks.evaluation) return;
        lastEvaluation = {
            date: state.date, topic: simState.topicEvaluationId, answers: simState.answers,
            started: simState.startTimestamp, finished: Date.now(),
        };
        const scheduled = activities().find(item => item.resource === 'evaluation' && item.topicLinks === reading.topicLinks);
        if (scheduled) {
            state.completed.add(scheduled.id);
            saveProgress();
            renderProgress();
        }
    }

    function returnFromEvaluation() {
        if (!examMounted) return false;
        updateView('evaluation');
        return true;
    }

    function renderDefault(item) {
        const card = element('section', 'calendar-info-card');
        const body = element('div');
        const title = item?.title || 'Día sin actividades de muestra';
        const detail = item?.description || 'Usa las flechas del horario para consultar otro día.';
        card.append(icon('info'), body);
        body.append(element('h3', '', title), element('p', '', detail));
        const action = actions[item?.resource];
        if (action) {
            const [label, run] = action;
            const control = button('calendar-primary', label, async () => {
                control.disabled = true;
                try {
                    await run(item);
                } catch (_) {
                    showToast('No pudimos abrir esta actividad. Vuelve a intentarlo.', 'error');
                } finally {
                    control.disabled = false;
                }
            });
            const group = element('div', 'calendar-study-tools');
            group.append(control, completionButton(item, 'calendar-outline calendar-complete-detail', false));
            body.append(group);
        }
        workspace.append(card);
    }

    function renderActivity() {
        clearPanel();
        const version = revision;
        const isCurrent = () => version === revision && dayIsVisible();
        const item = state.active;
        workspace.replaceChildren();
        workspace.dataset.view = view || '';
        tools.replaceChildren();
        byId('calendar-day-title').textContent = viewTitles[view] && reading
            ? viewTitles[view] + ' · ' + reading.topic
            : item?.title || 'Estudio del día';
        byId('calendar-day-label').textContent = data.formatDay(state.date) + ' · Plan de muestra';
        if (view === 'study') renderStudy(item);
        else if (view === 'manual' || view === 'orientation') renderManual(item, isCurrent);
        else if (view === 'breakdown') renderBreakdown(isCurrent);
        else if (view === 'evaluation') renderEvaluation(item, isCurrent);
        else renderDefault(item);
        renderRating();
        renderProgress();
    }

    function canLeaveActivity() {
        if (!examMounted || !simState.timerInterval) return true;
        if (!confirm('¿Salir de la evaluación? Se descartarán tus respuestas.')) return false;
        window.TopicEvaluations.clear();
        return true;
    }

    function setActivity(item) {
        state.active = item || null;
        view = activityViews[item?.resource];
        reading = item?.reading || (item?.topicLinks && activities().find(entry => entry.reading?.topicLinks === item.topicLinks)?.reading);
    }

    function selectActivity(item) {
        if (!canLeaveActivity()) return;
        setActivity(item);
        if (compact.matches) setPlanOpen(false);
        renderActivity();
        updateSelection();
        focusDay();
    }

    function updateSelection() {
        for (const select of byId('calendar-plan-list').querySelectorAll('[data-calendar-activity]')) {
            const selected = select.dataset.calendarActivity === state.active?.id;
            select.setAttribute('aria-current', String(selected));
            select.parentElement.classList.toggle('is-selected', selected);
        }
    }

    function renderPlan() {
        const date = byId('calendar-plan-date');
        date.dateTime = state.date;
        date.textContent = state.date.split('-').reverse().join('/');
        const list = byId('calendar-plan-list');
        list.replaceChildren();
        for (const item of activities()) {
            const row = element('li', 'calendar-plan-row');
            setActivityStyle(row, item.kind, item.reading?.slug);
            const select = button('calendar-plan-item', '', () => selectActivity(item));
            select.dataset.calendarActivity = item.id;
            const times = element('span', 'calendar-plan-times', item.start);
            if (item.end) times.append(element('span', '', item.end));
            select.append(times, element('span', 'calendar-plan-item-label', item.title));
            row.append(select, completionButton(item, 'calendar-plan-complete'));
            list.append(row);
        }
        if (!list.children.length) list.append(element('li', 'calendar-plan-empty', 'Este día no tiene actividades de muestra.'));
        updateSelection();
        renderProgress();
    }

    function showDay(date, focus = true, activityId = '') {
        if (!canLeaveActivity()) return;
        const entering = dayPanel.hidden;
        state.date = date;
        const items = activities();
        setActivity(items.find(item => item.id === activityId) || items[0]);
        overview.hidden = true;
        dayPanel.hidden = false;
        if (entering) setPlanOpen(!compact.matches || !activityId);
        renderActivity();
        renderPlan();
        if (focus) focusDay();
    }

    function showOverview() {
        clearPanel();
        overview.hidden = false;
        dayPanel.hidden = true;
        if (calendar && !screen.classList.contains('hidden')) requestAnimationFrame(() => calendar.updateSize());
    }

    function screenChanged(active) {
        if (!active && !dayPanel.hidden) {
            clearPanel();
        } else if (active && calendar && !overview.hidden) {
            requestAnimationFrame(() => calendar.updateSize());
        } else if (active && !dayPanel.hidden) {
            const version = revision;
            requestAnimationFrame(() => {
                if (version === revision && dayIsVisible() && !examMounted) renderActivity();
            });
        }
    }

    small.addEventListener('change', () => {
        if (!calendar) return;
        calendar.setOption('height', calendarHeight());
        calendar.changeView(defaultView());
    });
    new ResizeObserver(([entry]) => {
        const width = Math.round(entry.contentRect.width);
        if (!width || width === lastBoardWidth) return;
        lastBoardWidth = width;
        if (calendar && !overview.hidden) requestAnimationFrame(() => calendar.updateSize());
    }).observe(board);
    compact.addEventListener('change', () => setPlanOpen(!compact.matches));
    planToggle.onclick = () => setPlanOpen(plan.hidden);
    byId('calendar-day-prev').onclick = () => showDay(data.move(state.date, -1), false);
    byId('calendar-day-next').onclick = () => showDay(data.move(state.date, 1), false);
    byId('calendar-back').onclick = () => {
        if (!canLeaveActivity()) return;
        showOverview();
        if (calendar) calendar.gotoDate(state.date);
        initCalendar();
    };
    byId('calendar-retry').onclick = initCalendar;
    window.addEventListener('campus-access-change', () => {
        if (CampusAccess.isFree()) lastEvaluation = null;
        if (dayIsVisible() && view === 'evaluation' && (!examMounted || CampusAccess.isFree())) renderActivity();
    });
    window.CampusCalendar = {
        open() {
            if (!canLeaveActivity() || showScreen('study-calendar-screen') === false) return;
            showOverview();
            initCalendar();
        },
        openDate(date, activityId) {
            const value = new Date(date + 'T00:00:00Z');
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(value.getTime()) || currentDateKey(value) !== date) return false;
            if (showScreen('study-calendar-screen') === false) return false;
            updatePlan();
            showDay(date, true, activityId);
            return true;
        },
        screenChanged,
        setUser,
        evaluationFinished,
        returnFromEvaluation,
    };
})();
