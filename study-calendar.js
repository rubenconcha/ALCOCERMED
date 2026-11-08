'use strict';
(() => {
    const data = window.StudyCalendarData;
    const byId = id => document.getElementById(id);
    const screen = byId('study-calendar-screen');
    const board = byId('calendar-board');
    const overview = byId('calendar-overview');
    const dayPanel = byId('calendar-day');
    const small = window.matchMedia('(max-width: 768px)');
    const scripts = new Map();
    const actions = {
        reading: ['Abrir lectura en el campus', item => openStudyAsset(item, 'texts',
            () => window.OfficialTexts.readPage(item.reading.slug, item.reading.pdf[0]))],
        questions: ['Abrir preguntas del tema', item => window.openBanco({ materia: item.bankSubject, tema: item.bankTopic })],
        practice: ['Abrir ejercicio', item => openStudyAsset(item, 'practice', () => {
            if (showScreen('sufficiency-practice-screen') !== false) window.SufficiencyPractice.openExercise(item.practice.id);
        })],
        simulation: ['Ver simulacros', () => window.openSimulacro()],
        results: ['Ver mis resultados', () => window.openStudentResults()],
        flashcards: ['Repasar con flashcards', () => window.openStudyLibrary()],
    };
    const state = { user: '', date: '', active: null, completed: new Set(), ratings: {}, plan: new Map(), reference: '' };
    let calendar;
    let loading;
    let lastBoardWidth = 0;

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

    function getEvents(info, success) {
        const start = currentDateKey(info.start);
        const end = currentDateKey(info.end);
        const events = [];
        for (const [date, items] of state.plan) {
            if (date < start || date >= end) continue;
            for (const item of items) {
                if (!item.show) continue;
                events.push({
                    id: item.id, title: item.title, start: date + 'T' + item.start,
                    end: item.end ? date + 'T' + item.end : undefined,
                    extendedProps: { date, kind: item.kind },
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
                    height: small.matches ? 'auto' : '79vh', fixedWeekCount: true, dayMaxEvents: 2,
                    eventDisplay: 'block', displayEventTime: false,
                    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
                    views: { listWeek: { displayEventTime: true, displayEventEnd: true } },
                    noEventsText: 'No hay actividades de muestra para esta semana.',
                    navLinks: true,
                    navLinkDayClick: date => showDay(currentDateKey(date)),
                    dateClick: info => showDay(info.dateStr.slice(0, 10)),
                    eventClick: info => showDay(info.event.extendedProps.date, true, info.event.id),
                    eventDidMount: info => {
                        info.el.dataset.kind = info.event.extendedProps.kind;
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
            renderProgress();
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
        group.hidden = !item?.resource;
        if (!item?.resource) return;
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

    function artwork(item) {
        if (item.kind === 'exam') return '/assets/study-art/quiz.png';
        if (item.kind === 'free') return '/assets/study-art/cards.png';
        switch (item.reading?.slug) {
            case 'morfofuncion': return '/assets/study-art/morphology.png';
            case 'biologia-celular': return '/assets/study-art/cell.png';
            case 'educacion-salud': return '/assets/study-art/health-education.png';
            default: return '/assets/calendar-study-art.svg';
        }
    }

    function renderActivity() {
        const item = state.active;
        const target = byId('calendar-activity');
        target.classList.toggle('calendar-activity-empty', !item?.resource);
        const heading = element('h3', '', item?.title || 'Día sin actividades de muestra');
        heading.id = 'calendar-activity-title';
        target.replaceChildren();
        renderRating();

        if (!item) {
            target.append(heading, element('p', '', 'Usa las flechas del horario para consultar otro día.'));
            return;
        }

        const copy = element('div', 'calendar-activity-copy');
        const kind = element('span', 'calendar-kind', data.kinds[item.kind].label);
        kind.dataset.kind = item.kind;
        const time = item.end ? item.start + ' – ' + item.end : item.start;
        copy.append(kind, heading, element('p', 'calendar-activity-time', time), element('p', '', item.description));

        if (item.reading) {
            const { title, credit, section, printed, pdf } = item.reading;
            const source = element('div', 'calendar-reading-source');
            source.append(
                element('strong', '', title),
                element('span', '', credit + ' · ' + section),
                element('span', '', 'Páginas impresas ' + data.pageRange(printed) + ' · PDF ' + data.pageRange(pdf))
            );
            copy.append(source);
        }

        const group = element('div', 'calendar-activity-actions');
        const action = actions[item.resource];
        if (action) {
            const [label, run] = action;
            const launch = button('calendar-primary', label, async () => {
                launch.disabled = true;
                try {
                    await run(item);
                } catch (_) {
                    showToast('No pudimos abrir esta actividad. Vuelve a intentarlo.', 'error');
                } finally {
                    launch.disabled = false;
                }
            });
            group.append(launch);
        }
        group.append(completionButton(item, 'calendar-outline calendar-complete-detail', false));
        copy.append(group);

        const topicLinks = item.reading?.topicLinks || item.topicLinks;
        if (topicLinks) {
            const resources = element('div', 'calendar-topic-actions');
            resources.setAttribute('role', 'group');
            resources.setAttribute('aria-label', 'Práctica de este tema');
            resources.append(
                button('calendar-outline', 'Evaluación del tema', () => window.openEvaluacion(topicLinks.evaluation)),
                button('calendar-outline', 'Exámenes pasados del tema', () => window.openPastExams(true, topicLinks.past))
            );
            copy.append(resources);
        }
        target.append(copy);
        if (item.resource) {
            const illustration = element('img', 'calendar-activity-art');
            illustration.alt = '';
            illustration.loading = 'lazy';
            illustration.src = artwork(item);
            target.append(illustration);
        }
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
        byId('calendar-day-label').textContent = data.formatDay(state.date);
        const list = byId('calendar-plan-list');
        list.replaceChildren();
        for (const item of activities()) {
            const row = element('li', 'calendar-plan-row');
            row.dataset.kind = item.kind;
            const select = button('calendar-plan-item', '', () => {
                state.active = item;
                renderActivity();
                updateSelection();
                renderProgress();
                if (small.matches) byId('calendar-activity').focus();
            });
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
        state.date = date;
        const items = activities();
        state.active = items.find(item => item.id === activityId) || items[0] || null;
        overview.hidden = true;
        dayPanel.hidden = false;
        renderActivity();
        renderPlan();
        if (focus) {
            window.scrollTo(0, 0);
            byId('calendar-day-title').focus({ preventScroll: true });
        }
    }

    function showOverview() {
        overview.hidden = false;
        dayPanel.hidden = true;
        if (calendar && !screen.classList.contains('hidden')) requestAnimationFrame(() => calendar.updateSize());
    }

    function screenChanged(active) {
        if (active && calendar && !overview.hidden) requestAnimationFrame(() => calendar.updateSize());
    }

    small.addEventListener('change', () => {
        if (!calendar) return;
        calendar.setOption('height', small.matches ? 'auto' : '79vh');
        calendar.changeView(defaultView());
    });
    new ResizeObserver(([entry]) => {
        const width = Math.round(entry.contentRect.width);
        if (!width || width === lastBoardWidth) return;
        lastBoardWidth = width;
        if (calendar && !overview.hidden) requestAnimationFrame(() => calendar.updateSize());
    }).observe(board);
    byId('calendar-show-schedule').onclick = () => {
        const selected = byId('calendar-plan-list').querySelector('[aria-current="true"]');
        (selected || byId('calendar-day-prev')).focus();
    };
    byId('calendar-day-prev').onclick = () => showDay(data.move(state.date, -1), false);
    byId('calendar-day-next').onclick = () => showDay(data.move(state.date, 1), false);
    byId('calendar-back').onclick = () => {
        showOverview();
        if (calendar) calendar.gotoDate(state.date);
        initCalendar();
    };
    byId('calendar-retry').onclick = initCalendar;
    window.CampusCalendar = {
        open() {
            if (showScreen('study-calendar-screen') === false) return;
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
    };
})();
