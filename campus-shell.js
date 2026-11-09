'use strict';
(() => {
    const byId = id => document.getElementById(id);
    const data = window.StudyCalendarData;
    const mobile = matchMedia('(max-width: 768px)');
    const sidebar = byId('sidebar');
    const menu = byId('campus-menu');
    const sidebarToggle = byId('sidebar-toggle-btn');
    const theme = byId('campus-theme');
    const fullscreen = byId('campus-fullscreen');
    const navLinks = [...sidebar.querySelectorAll('[data-campus-screen]')];
    const moodButtons = [...document.querySelectorAll('[data-mood]')];
    const moodDialog = byId('campus-mood-dialog');
    const noticesDialog = byId('campus-notices-dialog');
    const profileDialog = byId('campus-profile-dialog');
    const monthDays = byId('campus-month-days');
    const planList = byId('campus-plan-preview');
    const monthFormat = new Intl.DateTimeFormat('es-BO', { month: 'long', year: 'numeric', timeZone: 'UTC' });
    const actions = {
        calendar: () => window.openStudyCalendar(),
        texts: () => window.openOfficialTexts(),
        practice: () => window.showScreen('sufficiency-practice-screen'),
        results: () => window.openStudentResults(),
        logout: () => window.handleLogout(),
    };
    let userId = '';
    let today = '';
    let selectedDate = '';
    let month = '';
    let plan = new Map();
    let pendingMood = null;
    let savedMood = null;

    function setUse(button, symbol) {
        button.querySelector('use').setAttribute('href', '/assets/calendar-icons.svg#' + symbol);
    }

    function storage(key, value) {
        try {
            if (value === undefined) return localStorage.getItem(key);
            if (value === null) localStorage.removeItem(key);
            else localStorage.setItem(key, value);
        } catch (_) { /* Browser settings can disable local storage. */ }
        return null;
    }

    function setDark(dark) {
        document.body.classList.toggle('campus-dark', dark);
        const label = dark ? 'Activar modo claro' : 'Activar modo oscuro';
        setUse(theme, dark ? 'sun' : 'moon');
        theme.setAttribute('aria-pressed', String(dark));
        theme.setAttribute('aria-label', label);
        theme.title = label;
    }

    function syncMenu(moveFocus = false) {
        const isMobile = mobile.matches;
        const expanded = isMobile ? sidebar.classList.contains('open') : document.body.classList.contains('campus-menu-pinned');
        sidebar.inert = isMobile && !expanded;
        menu.setAttribute('aria-expanded', String(expanded));
        menu.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
        const sidebarLabel = isMobile ? 'Cerrar menú' : expanded ? 'Desfijar menú' : 'Fijar menú';
        sidebarToggle.setAttribute('aria-label', sidebarLabel);
        sidebarToggle.title = sidebarLabel;
        if (isMobile && moveFocus) (expanded ? sidebarToggle : menu).focus();
    }

    function restoreMenu() {
        document.body.classList.toggle('campus-menu-pinned', storage('alcocermed-campus-menu') === 'open');
        syncMenu();
    }

    function toggleMenu() {
        if (mobile.matches) return window.toggleSidebar();
        const pinned = document.body.classList.toggle('campus-menu-pinned');
        storage('alcocermed-campus-menu', pinned ? 'open' : 'rail');
        syncMenu();
    }

    function moodKey() { return 'alcocermed-campus-mood:' + userId; }

    function paintMood() {
        const current = savedMood?.date === today ? moodButtons[savedMood.index] : null;
        moodButtons.forEach(button => button.setAttribute('aria-pressed', String(button === current)));
        byId('campus-mood-status').hidden = !current;
        byId('campus-mood-message').textContent = current ? 'Hoy elegiste: ' + current.textContent.trim() + '.' : '';
    }

    function showMood(index) {
        if (!userId) return;
        pendingMood = index;
        const isChoice = index !== null;
        const preview = byId('campus-mood-preview');
        preview.hidden = !isChoice;
        if (isChoice) preview.dataset.portrait = index;
        byId('campus-mood-save').hidden = !isChoice;
        byId('campus-mood-cancel').textContent = isChoice ? 'Cancelar' : 'Entendido';
        byId('campus-mood-dialog-title').textContent = isChoice ? 'Confirmar cómo te sientes' : 'Tus avatares de ánimo';
        byId('campus-mood-description').textContent = isChoice
            ? 'Elegiste «' + moodButtons[index].textContent.trim() + '». Puedes cambiar o quitar tu selección durante el día.'
            : 'Elige un avatar que represente cómo te sientes hoy. Tu selección se guarda en este navegador para tu cuenta y puedes quitarla cuando quieras.';
        moodDialog.returnValue = 'cancel';
        moodDialog.showModal();
        byId('campus-mood-cancel').focus();
    }

    function monthOffset(date, offset) {
        const value = new Date(date.slice(0, 7) + '-01T00:00:00Z');
        value.setUTCMonth(value.getUTCMonth() + offset);
        return value.toISOString().slice(0, 10);
    }

    function renderDay() {
        byId('campus-plan-date').textContent = data.formatDay(selectedDate);
        const activities = (plan.get(selectedDate) || []).filter(item => item.show);
        planList.replaceChildren();
        for (const item of activities) {
            const row = document.createElement('li');
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'campus-plan-item';
            button.style.setProperty('--activity-accent', data.kinds[item.kind].color);
            const time = document.createElement('time');
            time.textContent = item.end ? item.start + ' – ' + item.end : item.start;
            const title = document.createElement('span');
            title.textContent = item.title;
            button.append(time, title);
            button.onclick = () => window.openStudyCalendar(selectedDate, item.id);
            row.append(button);
            planList.append(row);
        }
        if (!activities.length) {
            const empty = document.createElement('li');
            empty.className = 'campus-plan-empty';
            empty.textContent = 'Este día no tiene actividades de muestra.';
            planList.append(empty);
        }
    }

    function renderMonth(focus = false) {
        byId('campus-month-label').textContent = monthFormat.format(new Date(month + 'T00:00:00Z'));
        monthDays.replaceChildren();
        const end = monthOffset(month, 1);
        const dates = [...plan.keys()];
        const min = dates[0];
        const max = dates.at(-1);
        byId('campus-month-prev').disabled = month <= min;
        byId('campus-month-next').disabled = end > max;
        const active = selectedDate >= month && selectedDate < end ? selectedDate : month;
        for (let date = data.monday(month); date < end || date !== data.monday(date); date = data.move(date, 1)) {
            const inMonth = date >= month && date < end;
            const cell = document.createElement(inMonth ? 'button' : 'span');
            cell.textContent = String(Number(date.slice(8)));
            if (!inMonth) {
                cell.setAttribute('aria-hidden', 'true');
                monthDays.append(cell);
                continue;
            }
            const day = date;
            cell.type = 'button';
            cell.dataset.date = day;
            cell.tabIndex = day === active ? 0 : -1;
            cell.setAttribute('aria-label', data.formatDay(day));
            cell.setAttribute('aria-pressed', String(day === selectedDate));
            if (day === today) cell.setAttribute('aria-current', 'date');
            cell.onclick = () => chooseDate(day);
            monthDays.append(cell);
        }
        if (focus) monthDays.querySelector('[tabindex="0"]')?.focus();
    }

    function chooseDate(date) {
        selectedDate = date;
        month = monthOffset(date, 0);
        renderMonth(true);
        renderDay();
    }

    function refreshHome() {
        const current = data.today();
        if (current === today) return;
        today = current;
        selectedDate = today;
        month = monthOffset(today, 0);
        plan = data.buildSample(today);
        if (savedMood && savedMood.date !== today) {
            savedMood = null;
            if (userId) storage(moodKey(), null);
        }
        renderMonth();
        renderDay();
        paintMood();
    }

    function setUser(id = '', name = '') {
        if (userId !== id) {
            pendingMood = null;
            for (const dialog of [moodDialog, noticesDialog, profileDialog]) if (dialog.open) dialog.close();
            userId = id;
            byId('campus-contact-form').reset();
            savedMood = null;
            today = '';
            if (id) {
                try { savedMood = JSON.parse(storage(moodKey()) || 'null'); } catch (_) {}
            }
        }
        const names = name.trim().split(/\s+/).filter(Boolean);
        const initials = (names.slice(0, 2).map(word => [...word][0]).join('') || 'A').toLocaleUpperCase('es');
        byId('campus-avatar').textContent = initials;
        byId('campus-profile-initials').textContent = initials;
        byId('campus-profile-name').textContent = names.join(' ') || 'Estudiante';
        if (id) refreshHome();
        else paintMood();
    }

    function screenChanged(screenId) {
        const game = screenId === 'resource-browser' ? byId('resource-tool').textContent : '';
        const parent = game === 'Quiz relámpago' ? 'game-quiz' : game === 'Ahorcado médico' ? 'game-hangman' : screenId;
        const hadSidebarFocus = mobile.matches && sidebar.contains(document.activeElement);
        for (const link of navLinks) {
            const active = link.dataset.campusScreen.split(' ').includes(parent);
            link.closest('.nav-item').classList.toggle('nav-item-active', active);
            if (active) {
                link.setAttribute('aria-current', 'page');
                const group = link.closest('.campus-nav-group');
                if (group) group.open = true;
            } else link.removeAttribute('aria-current');
        }
        if (screenId === 'home-screen') refreshHome();
        syncMenu();
        if (hadSidebarFocus && sidebar.inert) menu.focus();
    }

    function openNotices() {
        const notices = [...byId('campus-notice-list').children].map(item => item.cloneNode(true));
        byId('campus-notices-dialog-list').replaceChildren(...notices);
        byId('campus-notice-search').value = '';
        byId('campus-notices-empty').hidden = true;
        noticesDialog.showModal();
    }

    menu.onclick = toggleMenu;
    theme.onclick = () => {
        const dark = !document.body.classList.contains('campus-dark');
        setDark(dark);
        storage('alcocermed-campus-theme', dark ? 'dark' : 'light');
    };
    const previousCalendarTheme = storage('alcocermed-calendar-dark');
    const storedTheme = storage('alcocermed-campus-theme') || (previousCalendarTheme === null
        ? storage('alcocermed_theme') : previousCalendarTheme === '1' ? 'dark' : 'light');
    setDark(storedTheme === 'dark');
    fullscreen.hidden = !document.fullscreenEnabled;
    fullscreen.onclick = async () => {
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await document.documentElement.requestFullscreen();
        } catch (_) { /* Fullscreen may be unavailable in embedded contexts. */ }
    };
    document.addEventListener('fullscreenchange', () => {
        const label = document.fullscreenElement ? 'Salir de pantalla completa' : 'Pantalla completa';
        fullscreen.setAttribute('aria-label', label);
        fullscreen.title = label;
    });
    byId('campus-open-notices').onclick = openNotices;
    document.querySelector('[data-campus-notices]').onclick = openNotices;
    byId('campus-notice-search').oninput = event => {
        const search = event.target.value.trim().toLocaleLowerCase('es');
        const notices = [...byId('campus-notices-dialog-list').children];
        for (const notice of notices) notice.hidden = !notice.textContent.toLocaleLowerCase('es').includes(search);
        byId('campus-notices-empty').hidden = notices.some(notice => !notice.hidden);
    };
    byId('campus-contact-form').onsubmit = event => {
        event.preventDefault();
        const fields = event.currentTarget.elements;
        const subject = fields.namedItem('subject').value.trim();
        const message = fields.namedItem('message').value.trim();
        if (!userId || !subject || !message) return;
        const link = new URL(document.querySelector('.support-float').href);
        link.searchParams.set('text', 'Hola, soy estudiante de AlcocerMed.\n' +
            fields.namedItem('category').value + ' · ' + subject + '\n\n' + message);
        window.open(link.href, '_blank', 'noopener,noreferrer');
    };
    byId('campus-profile').onclick = () => profileDialog.showModal();
    byId('campus-mood-help').onclick = () => showMood(null);
    moodButtons.forEach((button, index) => { button.onclick = () => showMood(index); });
    moodDialog.addEventListener('close', () => {
        if (userId && pendingMood !== null && moodDialog.returnValue === 'save') {
            refreshHome();
            savedMood = { date: today, index: pendingMood };
            storage(moodKey(), JSON.stringify(savedMood));
            paintMood();
        }
        pendingMood = null;
    });
    byId('campus-mood-clear').onclick = () => {
        moodButtons[savedMood?.index]?.focus();
        savedMood = null;
        if (userId) storage(moodKey(), null);
        paintMood();
    };
    byId('campus-open-calendar').onclick = actions.calendar;
    byId('campus-open-day').onclick = () => window.openStudyCalendar(selectedDate);
    for (const [id, offset] of [['campus-month-prev', -1], ['campus-month-next', 1]]) {
        byId(id).onclick = () => {
            month = monthOffset(month, offset);
            renderMonth();
        };
    }
    monthDays.addEventListener('keydown', event => {
        const offsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
        if (!event.target.dataset.date || !Object.hasOwn(offsets, event.key)) return;
        event.preventDefault();
        const target = data.move(event.target.dataset.date, offsets[event.key]);
        if (target >= month && target < monthOffset(month, 1)) chooseDate(target);
    });
    document.addEventListener('click', event => {
        const action = event.target.closest('[data-campus-action]')?.dataset.campusAction;
        if (!userId || !action || !Object.hasOwn(actions, action)) return;
        if (noticesDialog.open) noticesDialog.close();
        if (profileDialog.open) profileDialog.close();
        actions[action]();
    });
    function warmSection(event) {
        if (!userId || navigator.connection?.saveData) return;
        const group = event.target.closest('[data-campus-load]')?.dataset.campusLoad;
        if (group) window.loadCampusAssets(group).catch(() => {});
    }
    document.addEventListener('pointerover', event => {
        if (event.pointerType === 'mouse') warmSection(event);
    });
    document.addEventListener('pointerdown', warmSection);
    document.addEventListener('focusin', warmSection);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && mobile.matches && sidebar.classList.contains('open') && !document.querySelector('dialog[open]')) {
            window.toggleSidebar();
        }
    });
    mobile.addEventListener('change', () => {
        if (!mobile.matches && sidebar.classList.contains('open')) window.toggleSidebar();
        syncMenu();
    });
    window.addEventListener('focus', () => { if (userId) refreshHome(); });
    window.CampusShell = { setUser, screenChanged, syncMenu, restoreMenu, toggleMenu };
    syncMenu();
    screenChanged('home-screen');
})();
