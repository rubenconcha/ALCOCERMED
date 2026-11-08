'use strict';
(() => {
    const data = window.StudyCalendarData;
    const byId = id => document.getElementById(id);
    const screen = byId('study-calendar-screen');
    const board = byId('calendar-board');
    const overview = byId('calendar-overview');
    const dayPanel = byId('calendar-day');
    const dialog = byId('calendar-plan');
    const small = window.matchMedia('(max-width: 768px)');
    const scripts = new Map();
    const actions = {
        videos: ['Ver videoclases', () => window.openVideoclases()],
        summaries: ['Abrir resúmenes', () => window.openResumenes()],
        practice: ['Abrir práctica de suficiencia', () => showScreen('sufficiency-practice-screen')],
        questions: ['Abrir banco de preguntas', () => window.openBanco()],
        evaluation: ['Ver evaluaciones', () => window.openEvaluacion()],
        simulation: ['Ver simulacros', () => window.Sufficiency.open()],
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
                const color = data.kinds[item.kind].color;
                events.push({
                    id: item.id, title: item.title, start: date + 'T' + item.start,
                    end: item.end ? date + 'T' + item.end : undefined,
                    backgroundColor: color, borderColor: color, textColor: '#fff',
                    extendedProps: { date },
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

    async function initCalendar() {
        const reference = data.today();
        if (state.reference !== reference) {
            state.reference = reference;
            state.plan = data.buildSample(reference);
            calendar?.setOption('now', reference);
            calendar?.refetchEvents();
        }
        if (calendar || loading) return;
        setStatus('Cargando el calendario…');
        loading = (async () => {
            try {
                await loadScript('/vendor/fullcalendar/index.global.min.js');
                await loadScript('/vendor/fullcalendar/es.global.min.js');
                calendar = new window.FullCalendar.Calendar(board, {
                    locale: 'es', firstDay: 1, timeZone: 'UTC', now: state.reference,
                    initialView: defaultView(), initialDate: state.reference,
                    headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listWeek program' },
                    buttonText: { month: 'Mes', list: 'Agenda', today: 'Hoy' },
                    customButtons: { program: { text: 'Descargar programa', click: downloadProgram } },
                    height: small.matches ? 'auto' : '79vh', fixedWeekCount: true, dayMaxEvents: false,
                    eventDisplay: 'block', displayEventTime: false,
                    eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
                    views: { listWeek: { displayEventTime: true, displayEventEnd: true } },
                    noEventsText: 'No hay actividades de muestra para esta semana.',
                    navLinks: true,
                    navLinkDayClick: date => showDay(currentDateKey(date)),
                    dateClick: info => showDay(info.dateStr.slice(0, 10)),
                    eventClick: info => showDay(info.event.extendedProps.date, true, info.event.id),
                    eventDidMount: info => {
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
        if (item.kind === 'video') return '/assets/calendar-study-art.svg';
        if (item.subject === 'Morfofunción') return '/assets/study-art/morphology.png';
        if (item.subject === 'Biología celular') return '/assets/study-art/cell.png';
        if (item.subject === 'Educación para la Vida') return '/assets/study-art/health-education.png';
        return '/assets/calendar-study-art.svg';
    }

    function renderActivity() {
        const item = state.active;
        const target = byId('calendar-activity');
        byId('calendar-day-label').textContent = data.formatDay(state.date);
        byId('calendar-activity-title').textContent = item?.title || 'Estudio del día';
        target.classList.toggle('calendar-activity-empty', !item?.resource);
        target.replaceChildren();
        renderRating();
        if (!item?.resource) {
            target.append(element('strong', '', item ? item.title : 'Día sin actividades de muestra'),
                element('p', '', item?.description || 'Puedes consultar otra fecha en el cronograma.'));
            if (item) target.append(completionButton(item, 'calendar-outline calendar-complete-detail', false));
            return;
        }
        const copy = element('div', 'calendar-activity-copy');
        const kind = element('span', 'calendar-kind', data.kinds[item.kind].label);
        kind.dataset.kind = item.kind;
        const time = item.end ? item.start + ' – ' + item.end : item.start;
        const group = element('div', 'calendar-activity-actions');
        const [label, run] = actions[item.resource];
        group.append(button('calendar-primary', label, run), completionButton(item, 'calendar-outline calendar-complete-detail', false));
        copy.append(kind, element('h3', '', item.title), element('p', 'calendar-activity-time', time + ' · Plan de práctica de muestra'),
            element('p', '', item.description), group);
        const illustration = element('img', 'calendar-activity-art');
        illustration.alt = '';
        illustration.src = artwork(item);
        target.append(copy, illustration);
    }

    function renderPlan() {
        const date = byId('calendar-plan-date');
        date.dateTime = state.date;
        date.textContent = state.date.split('-').reverse().join('/');
        const list = byId('calendar-plan-list');
        list.replaceChildren();
        for (const item of activities()) {
            const row = element('li', 'calendar-plan-row');
            row.dataset.kind = item.kind;
            row.classList.toggle('is-selected', item.id === state.active?.id);
            const select = button('calendar-plan-item', '', () => {
                state.active = item;
                renderActivity();
                renderProgress();
                dialog.close();
                byId('calendar-open-plan').focus();
            });
            const times = element('span', 'calendar-plan-times', item.start);
            if (item.end) times.append(element('span', '', item.end));
            select.append(times, element('span', 'calendar-plan-item-label', item.title));
            row.append(select, completionButton(item, 'calendar-plan-complete'));
            list.append(row);
        }
        if (!list.children.length) list.append(element('li', 'calendar-plan-empty', 'Este día no tiene actividades de muestra.'));
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
            byId('calendar-open-plan').focus();
        }
    }

    function showOverview() {
        if (dialog.open) dialog.close();
        overview.hidden = false;
        dayPanel.hidden = true;
        if (calendar && !screen.classList.contains('hidden')) requestAnimationFrame(() => calendar.updateSize());
    }

    function screenChanged(active) {
        if (active) {
            if (calendar && !overview.hidden) requestAnimationFrame(() => calendar.updateSize());
        } else if (dialog.open) dialog.close();
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
    byId('calendar-open-plan').onclick = () => {
        renderPlan();
        dialog.showModal();
    };
    byId('calendar-plan-close').onclick = () => dialog.close();
    dialog.addEventListener('click', event => {
        if (event.target === dialog && (event.clientX > dialog.getBoundingClientRect().right ||
            event.clientX < dialog.getBoundingClientRect().left || event.clientY < dialog.getBoundingClientRect().top)) dialog.close();
    });
    byId('calendar-day-prev').onclick = () => showDay(data.move(state.date, -1), false);
    byId('calendar-day-next').onclick = () => showDay(data.move(state.date, 1), false);
    byId('calendar-back').onclick = showOverview;
    byId('calendar-retry').onclick = initCalendar;
    window.CampusCalendar = {
        open() {
            if (showScreen('study-calendar-screen') === false) return;
            showOverview();
            initCalendar();
        },
        openDate(date, activityId) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || showScreen('study-calendar-screen') === false) return;
            initCalendar();
            showDay(date, true, activityId);
        },
        screenChanged,
        setUser,
    };
})();
