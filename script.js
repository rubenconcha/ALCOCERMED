// Configuracion compartida. Se carga desde config.js cuando esta disponible.
const CONFIG = window.ALCOCER_CONFIG || {
    SUPABASE_URL: 'https://asnwhddmurstzmghuyin.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo',
    ADMIN_EMAILS: ['admin@alcocermed.com', 'admin@bencarson.com', 'rubenconcha@example.com', 'pichon4488@gmail.com']
};
const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_KEY;
const ADMIN_EMAILS = (CONFIG.ADMIN_EMAILS || []).map(function(e) { return String(e).toLowerCase(); });

// Utilidad: barajar array (Fisher-Yates)
function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
}

let _supabase = null;
function getSupabase() {
    if (!_supabase) _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _supabase;
}

// ══════════════════════════════════════════════
// ██  AUTENTICACIÓN SUPABASE  ██
// ══════════════════════════════════════════════

let currentUser = null;

// Si la URL contiene logout=1, forzar showLoginScreen apenas cargue
if (new URLSearchParams(window.location.search).get("logout") === "1") {
    document.addEventListener("DOMContentLoaded", function() {
        showLoginScreen();
        // Eliminar parámetro de la URL sin recargar
        try {
            history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {}
    });
}

// ── initAuth ────────────────────────────────────
async function initAuth() {
    document.body.classList.add('login-active');

    var checker = document.createElement('div');
    checker.className = 'login-checking';
    checker.innerHTML = '<div class="login-checking-spinner"></div>' +
        '<span class="login-checking-text">verificando sesión...</span>';
    document.body.appendChild(checker);

    try {
        var client = getSupabase();
        if (!client) throw new Error('Supabase client failed to initialize');
        var res = await client.auth.getSession();
        var session = res.data.session;

        if (session && session.user) {
            currentUser = session.user;
            enterApp(currentUser);
        } else {
            showLoginScreen();
        }
    } catch (e) {
        console.error('Error verificando sesión:', e);
        showLoginScreen();
        // Mostrar error visual si es un fallo de inicialización
        if (e.message.includes('Supabase')) {
             setTimeout(function() { showLoginError('error al conectar con el servidor. revisa tu internet.'); }, 500);
        }
    } finally {
        checker.classList.add('fade-out');
        setTimeout(function () { checker.remove(); }, 350);
    }

    getSupabase().auth.onAuthStateChange(function (event, session) {
        if (event === 'INITIAL_SESSION') return;
        if (event === 'SIGNED_IN' && session && session.user) {
            currentUser = session.user;
            enterApp(currentUser);
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            showLoginScreen();
        }
    });
}

/** Muestra login y oculta app */
function showLoginScreen() {
    document.body.classList.add('login-active');
    var loginScreen = document.getElementById('login-screen');
    if (loginScreen) loginScreen.classList.remove('hidden');
    var emailEl = document.getElementById('login-email');
    var passEl = document.getElementById('login-password');
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
    hideLoginError();
    setAdminSectionVisible(false);
}

function setAdminSectionVisible(visible) {
    var adminSec = document.getElementById('admin-nav-section');
    if (adminSec) adminSec.style.display = visible ? 'block' : 'none';
}

/** Oculta login y muestra app */
function enterApp(user) {
    document.body.classList.remove('login-active');
    var loginScreen = document.getElementById('login-screen');
    if (loginScreen) loginScreen.classList.add('hidden');

    var nameEl = document.getElementById('sidebar-user-name');
    if (nameEl && user) {
        var display = (user.user_metadata && user.user_metadata.full_name)
            ? user.user_metadata.full_name
            : user.email.split('@')[0];
        nameEl.textContent = display.toLowerCase();
    }

    setAdminSectionVisible(Boolean(user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())));
    restoreSidebarState();
    updateHomeStats();
    updateDailyGoalUI();
    setTimeout(testConnection, 800);
    setTimeout(preloadAppData, 1200);
    setTimeout(sincronizarPerfilEnNube, 2000);
}

/** handleLogin */
window.handleLogin = async function (e) {
    e.preventDefault();
    hideLoginError();

    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;

    if (!email || !password) { showLoginError('completa todos los campos'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showLoginError('formato de correo invalido'); return; }
    if (password.length < 6) { showLoginError('la contrasena debe tener al menos 6 caracteres'); return; }

    setLoginLoading(true);
    try {
        var client = getSupabase();
        var result = await client.auth.signInWithPassword({ email: email, password: password });

        if (result.error) {
            var msg = 'credenciales incorrectas. verifica tu correo y contraseña.';
            if (result.error.message.indexOf('Invalid login') !== -1) msg = 'correo o contraseña incorrectos.';
            else if (result.error.message.indexOf('Email not confirmed') !== -1) msg = 'confirma tu correo antes de ingresar.';
            else if (result.error.message.indexOf('Too many requests') !== -1) msg = 'demasiados intentos. espera unos minutos.';
            showLoginError(msg);
            return;
        }

        currentUser = result.data.user;
        enterApp(currentUser);
    } catch (err) {
        console.error('Error de login:', err);
        showLoginError('error de conexión. revisa tu internet.');
    } finally {
        setLoginLoading(false);
    }
};

/** handleLogout */
window.handleLogout = function() {
    // 1. Limpiar datos locales inmediatamente
    localStorage.clear();
    sessionStorage.clear();
    
    // 2. Intentar cerrar sesión en Supabase
    try { 
        getSupabase().auth.signOut(); 
    } catch(e) { 
        console.warn('signOut:', e); 
    }
    
    // 3. Reset estado local
    currentUser = null;
    
    // 4. Mostrar pantalla de login instantáneamente (evita el parpadeo de recarga)
    showLoginScreen();
    
    // 5. Limpiar la URL (opcional, para estética)
    try {
        history.replaceState({}, document.title, window.location.origin + window.location.pathname);
    } catch (e) {}
};


/** Toggle visibilidad contraseña */
window.togglePasswordVisibility = function () {
    const input = document.getElementById('login-password');
    const icon = document.getElementById('login-eye-icon');
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    } else {
        input.type = 'password';
        if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
    }
};

// ── Helpers UI Login ──────────────────────────
function showLoginError(msg) {
    const el = document.getElementById('login-error');
    const textEl = document.getElementById('login-error-text');
    if (el) el.classList.remove('hidden');
    if (textEl) textEl.textContent = msg;
    if (el) { el.style.animation = 'none'; el.offsetHeight; el.style.animation = ''; }
}
function hideLoginError() {
    const el = document.getElementById('login-error');
    if (el) el.classList.add('hidden');
}
function setLoginLoading(loading) {
    const btn = document.getElementById('login-btn');
    const btnText = document.getElementById('login-btn-text');
    const btnLoading = document.getElementById('login-btn-loading');
    if (!btn) return;
    btn.disabled = loading;
    if (btnText) btnText.classList.toggle('hidden', loading);
    if (btnLoading) btnLoading.classList.toggle('hidden', !loading);
}

// ──────────────────────────────────────────────
// HELPER: acceder a campos con mayúsculas o minúsculas
// La BD de Supabase tiene columnas en MAYÚSCULAS
// ──────────────────────────────────────────────
function campo(row, nombre) {
    if (!row) return '';
    // Primero intenta minúsculas, luego mayúsculas
    if (row[nombre] !== undefined && row[nombre] !== null) return row[nombre];
    const upper = nombre.toUpperCase();
    if (row[upper] !== undefined && row[upper] !== null) return row[upper];
    const lower = nombre.toLowerCase();
    if (row[lower] !== undefined && row[lower] !== null) return row[lower];
    return '';
}

// ──────────────────────────────────────────────
// ESTADO GLOBAL
// ──────────────────────────────────────────────
let deck = [];
let currentIndex = 0;
let totalReviews = 0;
let temasVistos = new Set();
let ultimaMateria = '—';
let gamesPlayed = 0;

// ──────────────────────────────────────────────
// TIPS DE ESTUDIO
// ──────────────────────────────────────────────
const tips = [
    'repasa los temas difíciles justo antes de dormir; el sueño consolida la memoria a largo plazo.',
    'la técnica alcocer funciona mejor cuando verbalizas las respuestas en voz alta.',
    'si una tarjeta te cuesta, márcala como "difícil" para verla más veces en la sesión.',
    'estudia en bloques de 25 minutos con descansos de 5 — técnica pomodoro.',
    'conectar conceptos nuevos con lo que ya sabes acelera la retención hasta un 40%.',
    'el quiz relámpago entrena tu cerebro bajo presión, igual que en el examen real.',
    'morfofunción y biología celular están conectadas: estudia sus relaciones, no solo los datos aislados.',
    'para la salud pública, enfócate en los indicadores epidemiológicos más preguntados en el examen.',
];

// ──────────────────────────────────────────────
// NAVEGACIÓN ENTRE PANTALLAS
// ──────────────────────────────────────────────
function showScreen(screenId) {
    const screens = ['home-screen', 'study-area', 'game-quiz', 'game-hangman', 'banco-screen', 'simulacro-screen', 'evaluacion-screen', 'videoclases-screen', 'intocables-screen'];
    screens.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) {
            if (id === screenId) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}

window.goHome = function () {
    const bancoEnProgreso = bancoState && bancoState.preguntas.length > 0 &&
        !bancoState.finalized &&
        bancoState.answers.some(function (a) { return a.selected !== null; });
    if (bancoEnProgreso) {
        if (!confirm('¿salir del banco? perderás tu progreso.')) return;
    }
    showScreen('home-screen');
    updateHomeStats();
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
};

function updateHomeStats() {
    const elR = document.getElementById('home-repasos');
    const elC = document.getElementById('home-cards');
    const elT = document.getElementById('home-temas');
    const elG = document.getElementById('home-games');
    if (elR) elR.textContent = totalReviews;
    if (elC) elC.textContent = Math.min(currentIndex, deck.length);
    if (elT) elT.textContent = temasVistos.size;
    if (elG) elG.textContent = gamesPlayed;

    // Tip aleatorio
    const tipEl = document.getElementById('tip-text');
    if (tipEl) tipEl.textContent = tips[Math.floor(Math.random() * tips.length)];
}

// ──────────────────────────────────────────────
// TOGGLE PADRE: abre/cierra el menú "flashcards"
// ──────────────────────────────────────────────
window.toggleFlashcards = function () {
    const submenu = document.getElementById('menu-flashcards');
    const arrow = document.getElementById('arrow-flashcards');
    if (!submenu) return;

    const isOpen = submenu.classList.contains('active');
    submenu.classList.toggle('active');
    arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
};

// ──────────────────────────────────────────────
// TOGGLE MATERIA: carga temas desde Supabase
// ──────────────────────────────────────────────
window.toggleMenu = async function (asignatura) {
    const key = asignatura.replace(/ /g, '-');
    const submenu = document.getElementById('menu-' + key);
    const arrow = document.getElementById('arrow-' + key);

    if (!submenu) return;

    if (submenu.classList.contains('active')) {
        submenu.classList.remove('active');
        arrow.style.transform = 'rotate(0deg)';
        return;
    }

    submenu.innerHTML = '<li><span class="loading">cargando temas...</span></li>';
    submenu.classList.add('active');
    arrow.style.transform = 'rotate(90deg)';

    try {
        const client = getSupabase();
        // select('*') y filtrar client-side — compatible con MAY/min en nombres de columnas
        let { data, error } = await client
            .from('flashcards')
            .select('*');

        if (error) throw error;

        // Filtrar por materia usando campo() que detecta MAYÚSCULAS o minúsculas
        data = data.filter(function (r) {
            return campo(r, 'materia') === asignatura;
        });

        const temas = new Set();
        for (let i = 0; i < data.length; i++) {
            const temaVal = campo(data[i], 'tema');
            if (temaVal) temas.add(temaVal);
        }

        submenu.innerHTML = '';

        if (temas.size === 0) {
            submenu.innerHTML = '<li><span class="loading">sin temas aún</span></li>';
            return;
        }

        temas.forEach(function (t) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#';
            a.textContent = t.toLowerCase();
            a.onclick = function (e) {
                e.preventDefault();
                startDeck(t, asignatura, data);
            };
            li.appendChild(a);
            submenu.appendChild(li);
        });

    } catch (e) {
        console.error('Error cargando temas de flashcards:', e);
        submenu.innerHTML = '<li><span class="loading" style="color:#f87171;">error: ' + e.message + '</span></li>';
    }
};

// ──────────────────────────────────────────────
// INICIO RÁPIDO DESDE HOME (carga temas de materia)
// ──────────────────────────────────────────────
window.quickStartSubject = async function (asignatura) {
    // Abrir sidebar si está en mobile
    // Abrir submenu flashcards
    const flashcardSubmenu = document.getElementById('menu-flashcards');
    const flashArrow = document.getElementById('arrow-flashcards');
    if (flashcardSubmenu && !flashcardSubmenu.classList.contains('active')) {
        flashcardSubmenu.classList.add('active');
        if (flashArrow) flashArrow.style.transform = 'rotate(90deg)';
    }
    // Llamar toggleMenu para esa materia
    await toggleMenu(asignatura);
};

// ──────────────────────────────────────────────
// INICIAR MAZO
// ──────────────────────────────────────────────
function startDeck(tema, asignatura, data) {
    deck = [];
    for (let i = 0; i < data.length; i++) {
        // Soportar columna TEMA en mayúsculas o minúsculas
        const temaVal = campo(data[i], 'tema');
        if (temaVal === tema) deck.push(data[i]);
    }
    // Aleatorizar el mazo en cada revisión (Fix: orden aleatorio)
    deck = shuffleArray(deck);
    currentIndex = 0;
    ultimaMateria = asignatura.toLowerCase();

    document.getElementById('current-subject').innerText = asignatura.toLowerCase();
    document.getElementById('card-tema-name').innerText = tema.toLowerCase();
    document.getElementById('card-total').innerText = deck.length;

    temasVistos.add(tema);
    actualizarProgreso();

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    showScreen('study-area');
    renderCard();
}

// ──────────────────────────────────────────────
// RENDER TARJETA
// ──────────────────────────────────────────────
function renderCard() {
    const card = document.getElementById('card');
    const btnReveal = document.getElementById('btn-reveal');
    const ankiBtns = document.getElementById('anki-buttons');
    const qText = document.getElementById('q-text');
    const aText = document.getElementById('a-text');

    if (currentIndex >= deck.length) {
        card.classList.remove('flipped');
        qText.innerText = '¡terminaste este tema! 🎉';
        aText.innerText = '';
        btnReveal.classList.add('hidden');
        ankiBtns.classList.add('hidden');
        document.getElementById('card-num').innerText = deck.length;
        actualizarProgreso();
        return;
    }

    // Soportar columnas en MAYÚSCULAS o minúsculas
    qText.innerText = campo(deck[currentIndex], 'pregunta');
    aText.innerText = '';

    if (card.classList.contains('flipped')) {
        card.style.transition = 'none';
        card.classList.remove('flipped');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                card.style.transition = '';
                aText.innerText = campo(deck[currentIndex], 'respuesta');
            });
        });
    } else {
        aText.innerText = campo(deck[currentIndex], 'respuesta');
    }

    ankiBtns.classList.add('hidden');
    btnReveal.classList.remove('hidden');
    document.getElementById('card-num').innerText = currentIndex + 1;

    actualizarProgreso();
}

// ──────────────────────────────────────────────
// REVELAR RESPUESTA
// ──────────────────────────────────────────────


// ──────────────────────────────────────────────
// SISTEMA DE REPETICION ESPACIADA (SRS)
// ──────────────────────────────────────────────
const SRS_INTERVALS = {
    1: 10 * 60 * 1000,          // difícil  → 10 min
    2: 12 * 60 * 60 * 1000,     // bien     → 12 horas
    3: 24 * 60 * 60 * 1000      // fácil    → 1 día
};

function getSrsKey(card) {
    // Clave única por usuario + contenido de la tarjeta
    const uid = (currentUser && currentUser.id) ? currentUser.id.substring(0, 8) : 'anon';
    const raw = (campo(card, 'materia') + '|' + campo(card, 'tema') + '|' + campo(card, 'pregunta')).substring(0, 90);
    // Simple hash: encodeURI + take 24 chars
    const h = encodeURIComponent(raw).replace(/%/g, '').substring(0, 24);
    return 'srs_' + uid + '_' + h;
}

function saveSrs(card, intervalMs) {
    try {
        localStorage.setItem(getSrsKey(card), (Date.now() + intervalMs).toString());
    } catch (e) { /* storage lleno — ignorar */ }
}

function isCardDue(card) {
    try {
        const stored = localStorage.getItem(getSrsKey(card));
        return !stored || Date.now() >= parseInt(stored);
    } catch (e) { return true; }
}

function getCardNextReviewLabel(card) {
    try {
        const stored = localStorage.getItem(getSrsKey(card));
        if (!stored) return null;
        const ms = parseInt(stored) - Date.now();
        if (ms <= 0) return null;
        if (ms < 60000) return Math.ceil(ms / 1000) + 's';
        if (ms < 3600000) return Math.ceil(ms / 60000) + 'min';
        if (ms < 86400000) return Math.ceil(ms / 3600000) + 'h';
        return Math.ceil(ms / 86400000) + 'd';
    } catch (e) { return null; }
}

// ──────────────────────────────────────────────
// META DIARIA — TRACKING
// ──────────────────────────────────────────────
const DAILY_GOAL = 20; // tarjetas objetivo por día

function getDailyKey() {
    const uid = (currentUser && currentUser.id) ? currentUser.id.substring(0, 8) : 'anon';
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    return 'daily_' + uid + '_' + today;
}

function getStreakKey() {
    return 'streak_' + ((currentUser && currentUser.id) ? currentUser.id.substring(0, 8) : 'anon');
}

function getDailyCount() {
    try { return parseInt(localStorage.getItem(getDailyKey()) || '0'); } catch (e) { return 0; }
}

function incrementDailyCount() {
    try {
        const key = getDailyKey();
        const prev = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, (prev + 1).toString());
        return prev + 1;
    } catch (e) { return 0; }
}

function updateStreak() {
    try {
        const sKey = getStreakKey();
        const stored = JSON.parse(localStorage.getItem(sKey) || '{"streak":0,"best":0,"lastDate":""}');
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

        if (stored.lastDate === today) {
            return stored; // ya contabilizado hoy
        } else if (stored.lastDate === yesterday) {
            stored.streak++;
        } else {
            stored.streak = 1; // se rompió la racha o es nuevo
        }
        stored.best = Math.max(stored.best, stored.streak);
        stored.lastDate = today;
        localStorage.setItem(sKey, JSON.stringify(stored));
        return stored;
    } catch (e) { return { streak: 0, best: 0 }; }
}

function getStreakData() {
    try {
        return JSON.parse(localStorage.getItem(getStreakKey()) || '{"streak":0,"best":0,"lastDate":""}');
    } catch (e) { return { streak: 0, best: 0 }; }
}

/** Actualiza la UI de la meta diaria */
function updateDailyGoalUI() {
    const done = getDailyCount();
    const pct = Math.min(100, Math.round((done / DAILY_GOAL) * 100));
    const streak = getStreakData();

    // Contadores
    const doneEl = document.getElementById('daily-done');
    const goalEl = document.getElementById('daily-goal-num');
    if (doneEl) doneEl.textContent = done;
    if (goalEl) goalEl.textContent = DAILY_GOAL;

    // Barra
    const fill = document.getElementById('daily-bar-fill');
    const glow = document.getElementById('daily-bar-glow');
    if (fill) fill.style.width = pct + '%';
    if (glow) {
        glow.style.display = pct > 0 ? '' : 'none';
        glow.style.left = Math.min(98, Math.max(0, pct - 1)) + '%';
    }

    // Mensaje motivacional
    const msgEl = document.getElementById('daily-goal-msg');
    if (msgEl) {
        if (pct === 0) msgEl.textContent = '¡empieza tu sesión de hoy!';
        else if (pct < 25) msgEl.textContent = '¡buen comienzo, sigue así!';
        else if (pct < 50) msgEl.textContent = '¡vas muy bien, no pares!';
        else if (pct < 75) msgEl.textContent = '¡más de la mitad! ¡tú puedes!';
        else if (pct < 100) msgEl.textContent = '¡casi llegas a tu meta!';
        else msgEl.textContent = '🏆 ¡meta cumplida! ¡excelente!';
    }

    // Hitos alcanzados
    [[25, 'ms-25'], [50, 'ms-50'], [75, 'ms-75'], [100, 'ms-100']].forEach(function (m) {
        const el = document.getElementById(m[1]);
        if (el) {
            if (pct >= m[0]) el.classList.add('ms-reached');
            else el.classList.remove('ms-reached');
        }
    });

    // Racha
    const streakEl = document.getElementById('streak-count');
    if (streakEl) streakEl.textContent = streak.streak;

    const bestWrap = document.getElementById('streak-best-wrap');
    const bestEl = document.getElementById('streak-best');
    if (bestWrap && bestEl) {
        if (streak.best > 1) {
            bestWrap.style.display = '';
            bestEl.textContent = streak.best;
        } else {
            bestWrap.style.display = 'none';
        }
    }

    // Color de la barra según progreso
    if (fill) {
        if (pct >= 100) fill.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
        else if (pct >= 75) fill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
        else fill.style.background = 'linear-gradient(90deg, #ff8c00, #ff4500)';
    }
}

// ──────────────────────────────────────────────
// CALIFICAR (SRS)
// ──────────────────────────────────────────────
window.rateCard = function (score) {
    totalReviews++;
    document.getElementById('repasos-count').innerText = totalReviews;

    const card = deck[currentIndex];

    if (score === 0) {
        // "otra vez" — vuelve en ~3 tarjetas (< 1 min de estudio)
        deck.splice(currentIndex, 1);
        const insertAt = Math.min(currentIndex + 3, deck.length);
        deck.splice(insertAt, 0, card);
        // No avanzar currentIndex — la siguiente tarjeta ya está en currentIndex
    } else if (score === 1) {
        // "difícil" — guardar 10 min y poner al final de la sesión
        saveSrs(card, SRS_INTERVALS[1]);
        deck.splice(currentIndex, 1);
        deck.push(card);
        // No avanzar — siguiente carta ahora en currentIndex
    } else if (score === 2) {
        // "bien" — guardar 12 hrs y avanzar
        saveSrs(card, SRS_INTERVALS[2]);
        currentIndex++;
    } else if (score === 3) {
        // "fácil" — guardar 1 día y avanzar
        saveSrs(card, SRS_INTERVALS[3]);
        currentIndex++;
    }

    // Registrar en meta diaria y sincronizar con la nube cada 5 cartas
    const newCount = incrementDailyCount();
    if (newCount === DAILY_GOAL) {
        updateStreak();
        showToast('🏆 ¡meta diaria cumplida! ¡increíble esfuerzo!', 'success');
    }

    renderCard();
    actualizarProgreso();
};

// ──────────────────────────────────────────────
// NAVEGACIÓN TARJETAS
// ──────────────────────────────────────────────
window.goNextCard = function () {
    if (currentIndex < deck.length - 1) { currentIndex++; renderCard(); }
};

window.prevCard = function () {
    if (currentIndex > 0) { currentIndex--; renderCard(); }
};

// ──────────────────────────────────────────────
// ACTUALIZAR PANEL MI PROGRESO
// ──────────────────────────────────────────────
function actualizarProgreso() {
    const elRep = document.getElementById('prog-repasos');
    if (elRep) elRep.textContent = totalReviews;

    const elCards = document.getElementById('prog-cards');
    if (elCards) elCards.textContent = Math.min(currentIndex, deck.length);

    const elTemas = document.getElementById('prog-temas');
    if (elTemas) elTemas.textContent = temasVistos.size;

    const elMateria = document.getElementById('prog-materia-label');
    if (elMateria) elMateria.textContent = ultimaMateria !== '—' ? ultimaMateria : 'sin actividad aún';

    const total = deck.length || 0;
    const vistas = Math.min(currentIndex, total);
    const pct = total > 0 ? Math.round((vistas / total) * 100) : 0;

    const bar = document.getElementById('prog-bar');

    if (bar) bar.style.width = pct + '%';

    const barText = document.getElementById('prog-bar-text');
    if (barText) barText.textContent = vistas + ' / ' + total + ' tarjetas completadas';

    const pctEl = document.getElementById('prog-pct');
    if (pctEl) pctEl.textContent = pct + '%';

    // Actualizar meta diaria cada vez que hay actividad
    updateDailyGoalUI();
}

// ──────────────────────────────────────────────
// SIDEBAR MOBILE
// ──────────────────────────────────────────────
window.toggleSidebar = function () {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    document.body.classList.toggle('sidebar-open', sidebar.classList.contains('open'));
};

// Función unificada: mobile cierra sidebar, desktop colapsa
window.handleSidebarToggle = function () {
    if (window.innerWidth <= 768) {
        window.toggleSidebar();
    } else {
        window.toggleSidebarDesktop();
    }
};

// Desktop: colapsar/expandir sidebar (rail)
window.toggleSidebarDesktop = function () {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const isCollapsed = sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
    const main = document.querySelector('.main-content');
    if (main) main.classList.toggle('main-expanded', isCollapsed);
    const btn = document.getElementById('sidebar-toggle-btn');
    if (btn) btn.title = isCollapsed ? 'Expandir menú' : 'Colapsar menú';
    try { localStorage.setItem('bc_sidebar_collapsed', isCollapsed ? '1' : '0'); } catch (e) { console.warn('No se pudo guardar estado del sidebar:', e); }
};

// Restaurar estado guardado del sidebar al entrar a la app
function restoreSidebarState() {
    if (window.innerWidth <= 768) return;
    try {
        if (localStorage.getItem('bc_sidebar_collapsed') === '1') {
            const sidebar = document.getElementById('sidebar');
            const main = document.querySelector('.main-content');
            if (sidebar) sidebar.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
            if (main) main.classList.add('main-expanded');
        }
    } catch (e) { console.warn('No se pudo restaurar estado del sidebar:', e); }
}

// ══════════════════════════════════════════════
// ██  JUEGOS  ██
// ══════════════════════════════════════════════

window.openGame = function (gameType) {
    if (gameType === 'quiz') {
        showScreen('game-quiz');
        startQuiz();
    } else if (gameType === 'hangman') {
        showScreen('game-hangman');
        startHangman();
    }
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }
};

// ──────────────────────────────────────────────
// BANCO DE PREGUNTAS PARA LOS JUEGOS
// ──────────────────────────────────────────────
const QUIZ_QUESTIONS = [
    // Biología Celular
    { q: '¿cuál es la función principal del ribosoma?', opts: ['síntesis de proteínas', 'digestión celular', 'producción de ATP', 'transporte de lípidos'], answer: 0, subject: 'biología celular' },
    { q: '¿qué orgánulo es conocido como "la central energética" de la célula?', opts: ['núcleo', 'retículo endoplasmático', 'mitocondria', 'aparato de golgi'], answer: 2, subject: 'biología celular' },
    { q: '¿qué tipo de división celular produce gametos?', opts: ['mitosis', 'amitosis', 'meiosis', 'fisión binaria'], answer: 2, subject: 'biología celular' },
    { q: '¿cuál es el componente principal de la membrana celular?', opts: ['proteínas globulares', 'bicapa fosfolipídica', 'colesterol únicamente', 'carbohidratos'], answer: 1, subject: 'biología celular' },
    { q: '¿en qué fase del ciclo celular se replica el ADN?', opts: ['fase G1', 'fase S', 'fase G2', 'fase M'], answer: 1, subject: 'biología celular' },
    { q: '¿qué estructura controla el paso de sustancias al núcleo?', opts: ['membrana plasmática', 'poro nuclear', 'nucleolo', 'centrosoma'], answer: 1, subject: 'biología celular' },
    { q: 'los lisosomas contienen principalmente:', opts: ['ARN mensajero', 'enzimas hidrolíticas', 'lípidos de reserva', 'glucógeno'], answer: 1, subject: 'biología celular' },
    { q: '¿cuál es la unidad funcional del ADN que codifica una proteína?', opts: ['codón', 'gen', 'cromosoma', 'alelo'], answer: 1, subject: 'biología celular' },
    { q: 'el retículo endoplasmático rugoso se caracteriza por tener:', opts: ['mitocondrias adheridas', 'ribosomas en su superficie', 'membranas sin lípidos', 'poros grandes'], answer: 1, subject: 'biología celular' },
    { q: '¿qué proceso ocurre en la cresta mitocondrial?', opts: ['glicolisis', 'síntesis de ADN', 'fosforilación oxidativa', 'traducción del ARN'], answer: 2, subject: 'biología celular' },
    // Morfofunción
    { q: '¿cuántos huesos tiene el cuerpo humano adulto?', opts: ['180', '206', '230', '196'], answer: 1, subject: 'morfofunción' },
    { q: '¿qué tipo de músculo forma el corazón?', opts: ['músculo liso', 'músculo esquelético', 'músculo cardíaco', 'músculo estriado voluntario'], answer: 2, subject: 'morfofunción' },
    { q: '¿cuál es el hueso más largo del cuerpo humano?', opts: ['húmero', 'tibia', 'fémur', 'peroné'], answer: 2, subject: 'morfofunción' },
    { q: '¿qué nervio inerva el diafragma?', opts: ['nervio vago', 'nervio frénico', 'nervio intercostal', 'nervio hipogástrico'], answer: 1, subject: 'morfofunción' },
    { q: '¿en qué cavidad se encuentra el corazón?', opts: ['cavidad abdominal', 'cavidad pleural', 'mediastino', 'cavidad pericárdica'], answer: 2, subject: 'morfofunción' },
    { q: '¿qué arteria irriga principalmente el cerebro desde la carótida interna?', opts: ['arteria cerebral media', 'arteria basilar', 'arteria vertebral', 'arteria cerebral posterior'], answer: 0, subject: 'morfofunción' },
    { q: '¿cuántas vértebras cervicales tiene el ser humano?', opts: ['5', '7', '12', '8'], answer: 1, subject: 'morfofunción' },
    { q: 'el tendón de aquiles conecta los músculos de la pantorrilla con:', opts: ['el peroné', 'la tibia', 'el calcáneo', 'el astrágalo'], answer: 2, subject: 'morfofunción' },
    { q: '¿qué cámara del corazón bombea sangre a la circulación sistémica?', opts: ['aurícula derecha', 'ventrículo derecho', 'aurícula izquierda', 'ventrículo izquierdo'], answer: 3, subject: 'morfofunción' },
    { q: 'la articulación de la rodilla es de tipo:', opts: ['esferoidea', 'gínglimo (bisagra)', 'trocoidea', 'elipsoidea'], answer: 1, subject: 'morfofunción' },
    // Salud Pública
    { q: '¿qué mide la tasa de mortalidad infantil?', opts: ['muertes de menores de 5 años por cada 100k hab.', 'muertes de menores de 1 año por cada 1000 nacidos vivos', 'muertes maternas por cada 100k nacidos', 'fallecidos en hospitales por año'], answer: 1, subject: 'salud pública' },
    { q: 'la epidemiología estudia principalmente:', opts: ['las enfermedades individuales', 'la distribución y determinantes de la salud en poblaciones', 'la anatomía patológica', 'el tratamiento farmacológico'], answer: 1, subject: 'salud pública' },
    { q: '¿cuál es el indicador que mide los años de vida ajustados por discapacidad?', opts: ['AVISA (DALY)', 'AVPP', 'tasa de incidencia', 'índice de Gini'], answer: 0, subject: 'salud pública' },
];

const HANGMAN_WORDS = [
    // Biología Celular
    { word: 'MITOCONDRIA', hint: 'orgánulo productor de energía (ATP)', category: 'biología celular' },
    { word: 'RIBOSOMA', hint: 'sintetiza proteínas a partir del ARN mensajero', category: 'biología celular' },
    { word: 'NUCLEO', hint: 'centro de control de la célula, contiene el ADN', category: 'biología celular' },
    { word: 'LISOSOMA', hint: 'orgánulo con enzimas digestivas', category: 'biología celular' },
    { word: 'MEMBRANA', hint: 'bicapa fosfolipídica que delimita la célula', category: 'biología celular' },
    { word: 'CROMOSOMA', hint: 'estructura que contiene el material genético compactado', category: 'biología celular' },
    { word: 'CITOESQUELETO', hint: 'red de filamentos proteicos que da forma a la célula', category: 'biología celular' },
    { word: 'MEIOSIS', hint: 'división celular que produce gametos haploides', category: 'biología celular' },
    { word: 'MITOSIS', hint: 'división celular somática, produce células idénticas', category: 'biología celular' },
    { word: 'PEROXISOMA', hint: 'desintoxica la célula, neutraliza peróxido de hidrógeno', category: 'biología celular' },
    // Morfofunción
    { word: 'DIAFRAGMA', hint: 'músculo principal de la respiración', category: 'morfofunción' },
    { word: 'FEMUR', hint: 'hueso más largo del cuerpo humano', category: 'morfofunción' },
    { word: 'CORAZON', hint: 'órgano central del sistema circulatorio', category: 'morfofunción' },
    { word: 'NEFRONA', hint: 'unidad funcional del riñón', category: 'morfofunción' },
    { word: 'SINOVIA', hint: 'líquido que lubrica las articulaciones', category: 'morfofunción' },
    { word: 'CALCÁNEO', hint: 'hueso del talón, el más grande del tarso', category: 'morfofunción' },
    { word: 'HIPOFISIS', hint: 'glándula maestra del sistema endocrino', category: 'morfofunción' },
    { word: 'PANCREAS', hint: 'produce insulina y enzimas digestivas', category: 'morfofunción' },
    { word: 'TRÁQUEA', hint: 'conducto aéreo entre laringe y bronquios', category: 'morfofunción' },
    { word: 'CEREBELO', hint: 'coordina el equilibrio y el movimiento fino', category: 'morfofunción' },
];

// ══════════════════════════════════════════════
// QUIZ RELÁMPAGO
// ══════════════════════════════════════════════
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizTimer = null;
let quizTimeLeft = 15;
let quizAnswered = false;

window.startQuiz = function () {
    // Mezclar y tomar 10 preguntas
    quizQuestions = shuffleArray(QUIZ_QUESTIONS.slice()).slice(0, 10);
    quizIndex = 0;
    quizScore = 0;
    quizAnswered = false;

    document.getElementById('quiz-result').classList.add('hidden');
    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('quiz-score').textContent = quizScore;
    document.getElementById('quiz-qtotal').textContent = quizQuestions.length;

    gamesPlayed++;
    renderQuizQuestion();
};

function renderQuizQuestion() {
    if (quizIndex >= quizQuestions.length) {
        showQuizResult();
        return;
    }

    const q = quizQuestions[quizIndex];
    quizAnswered = false;

    document.getElementById('quiz-qnum').textContent = quizIndex + 1;
    document.getElementById('quiz-question-text').textContent = q.q;
    document.getElementById('quiz-subject-tag').textContent = q.subject;
    document.getElementById('quiz-feedback').classList.add('hidden');

    // Opciones
    const optsEl = document.getElementById('quiz-options');
    optsEl.innerHTML = '';
    const shuffledOpts = shuffleOptions(q.opts, q.answer);

    shuffledOpts.opts.forEach(function (opt, i) {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt-btn';
        btn.textContent = opt;
        btn.setAttribute('data-correct', shuffledOpts.newCorrect === i ? '1' : '0');
        btn.onclick = function () { selectQuizAnswer(btn, shuffledOpts.newCorrect, i, shuffledOpts); };
        optsEl.appendChild(btn);
    });

    // Timer
    clearInterval(quizTimer);
    quizTimeLeft = 15;
    updateTimerDisplay();
    quizTimer = setInterval(function () {
        quizTimeLeft--;
        updateTimerDisplay();
        if (quizTimeLeft <= 0) {
            clearInterval(quizTimer);
            if (!quizAnswered) {
                quizAnswered = true;
                highlightCorrect(shuffledOpts.newCorrect);
                showFeedback(false, '⏰ tiempo agotado');
                setTimeout(function () {
                    quizIndex++;
                    renderQuizQuestion();
                }, 1800);
            }
        }
    }, 1000);
}

function selectQuizAnswer(btn, correctIndex, selectedIndex, shuffledOpts) {
    if (quizAnswered) return;
    quizAnswered = true;
    clearInterval(quizTimer);

    const isCorrect = selectedIndex === correctIndex;

    if (isCorrect) {
        btn.classList.add('opt-correct');
        quizScore += 10 + Math.max(0, quizTimeLeft);
        document.getElementById('quiz-score').textContent = quizScore;
        showFeedback(true, '✓ ¡correcto! +' + (10 + Math.max(0, quizTimeLeft)) + ' pts');
    } else {
        btn.classList.add('opt-wrong');
        highlightCorrect(correctIndex);
        showFeedback(false, '✗ incorrecto');
    }

    setTimeout(function () {
        quizIndex++;
        renderQuizQuestion();
    }, 1800);
}

function highlightCorrect(correctIndex) {
    const btns = document.querySelectorAll('.quiz-opt-btn');
    if (btns[correctIndex]) btns[correctIndex].classList.add('opt-correct');
}

function showFeedback(correct, msg) {
    const el = document.getElementById('quiz-feedback');
    el.textContent = msg;
    el.className = 'quiz-feedback ' + (correct ? 'feedback-ok' : 'feedback-fail');
    el.classList.remove('hidden');
}

function updateTimerDisplay() {
    const el = document.getElementById('quiz-timer');
    const box = document.getElementById('quiz-timer-box');
    if (el) el.textContent = quizTimeLeft;
    if (box) {
        box.className = 'quiz-timer-box' + (quizTimeLeft <= 5 ? ' timer-danger' : '');
    }
}

function showQuizResult() {
    clearInterval(quizTimer);
    document.getElementById('quiz-options').innerHTML = '';
    document.getElementById('quiz-feedback').classList.add('hidden');
    document.getElementById('quiz-timer-box').classList.remove('timer-danger');

    const resultEl = document.getElementById('quiz-result');
    const maxScore = quizQuestions.length * (10 + 15);
    const pct = Math.round((quizScore / maxScore) * 100);

    let emoji = '😅';
    let title = 'sigue practicando';
    if (pct >= 80) { emoji = '🏆'; title = '¡excelente dominio!'; }
    else if (pct >= 60) { emoji = '👏'; title = '¡muy bien!'; }
    else if (pct >= 40) { emoji = '📚'; title = 'puedes mejorar'; }

    document.getElementById('result-emoji').textContent = emoji;
    document.getElementById('result-title').textContent = title;
    document.getElementById('result-score-text').textContent =
        'obtuviste ' + quizScore + ' puntos (' + pct + '% del máximo posible)';

    resultEl.classList.remove('hidden');
}

// ══════════════════════════════════════════════
// AHORCADO MÉDICO
// ══════════════════════════════════════════════
let hmWord = '';
let hmGuessed = [];
let hmErrors = 0;
const HM_MAX_ERRORS = 6;
const HM_PARTS = ['hm-head', 'hm-body', 'hm-larm', 'hm-rarm', 'hm-lleg', 'hm-rleg'];

window.startHangman = function () {
    const entry = HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];
    hmWord = entry.word.toUpperCase();
    hmGuessed = [];
    hmErrors = 0;
    gamesPlayed++;

    document.getElementById('hm-hint').textContent = 'pista: ' + entry.hint;
    document.getElementById('hm-category').textContent = entry.category;
    document.getElementById('hm-errors').textContent = hmErrors;
    document.getElementById('hm-result').classList.add('hidden');

    // Ocultar partes del cuerpo
    HM_PARTS.forEach(function (cls) {
        const els = document.querySelectorAll('.' + cls);
        els.forEach(function (el) { el.style.opacity = '0'; });
    });

    renderHmWord();
    buildHmKeyboard();
};

function renderHmWord() {
    const wordEl = document.getElementById('hm-word');
    if (!wordEl) return;
    wordEl.innerHTML = '';
    for (let i = 0; i < hmWord.length; i++) {
        const ch = hmWord[i];
        const span = document.createElement('span');
        span.className = 'hm-letter';
        if (ch === ' ') {
            span.textContent = ' ';
            span.className += ' hm-space';
        } else {
            span.textContent = hmGuessed.includes(ch) ? ch : '_';
            if (hmGuessed.includes(ch)) span.classList.add('hm-revealed');
        }
        wordEl.appendChild(span);
    }
}

function buildHmKeyboard() {
    const kb = document.getElementById('hm-keyboard');
    if (!kb) return;
    kb.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÑ'.split('');
    letters.forEach(function (l) {
        const btn = document.createElement('button');
        btn.textContent = l.toLowerCase();
        btn.className = 'hm-key';
        btn.onclick = function () { guessLetter(l, btn); };
        kb.appendChild(btn);
    });
}

function guessLetter(letter, btn) {
    if (hmGuessed.includes(letter)) return;
    hmGuessed.push(letter);
    btn.disabled = true;

    if (hmWord.includes(letter)) {
        btn.classList.add('hm-key-correct');
    } else {
        btn.classList.add('hm-key-wrong');
        hmErrors++;
        document.getElementById('hm-errors').textContent = hmErrors;
        // Mostrar parte del cuerpo
        const partCls = HM_PARTS[hmErrors - 1];
        if (partCls) {
            const els = document.querySelectorAll('.' + partCls);
            els.forEach(function (el) { el.style.opacity = '1'; });
        }
    }

    renderHmWord();
    checkHmEnd();
}

function checkHmEnd() {
    // ¿Ganó?
    const allRevealed = hmWord.split('').every(function (ch) {
        return ch === ' ' || hmGuessed.includes(ch);
    });

    const resultEl = document.getElementById('hm-result');
    const resultText = document.getElementById('hm-result-text');

    if (allRevealed) {
        resultEl.classList.remove('hidden');
        resultText.innerHTML = '🎉 <strong>¡lo lograste!</strong> la palabra era: <strong>' + hmWord.toLowerCase() + '</strong>';
        disableHmKeyboard();
    } else if (hmErrors >= HM_MAX_ERRORS) {
        resultEl.classList.remove('hidden');
        resultText.innerHTML = '💀 <strong>fallaste.</strong> la palabra era: <strong>' + hmWord.toLowerCase() + '</strong>';
        disableHmKeyboard();
    }
}

function disableHmKeyboard() {
    const keys = document.querySelectorAll('.hm-key');
    keys.forEach(function (k) { k.disabled = true; });
}

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────
function shuffleOptions(opts, correctIdx) {
    const indexed = opts.map(function (o, i) { return { text: o, isCorrect: i === correctIdx }; });
    shuffleArray(indexed);
    return {
        opts: indexed.map(function (o) { return o.text; }),
        newCorrect: indexed.findIndex(function (o) { return o.isCorrect; })
    };
}

// ──────────────────────────────────────────────
// TOAST DE CONEXIÓN / NOTIFICACIONES
// ──────────────────────────────────────────────
let _toastTimer = null;
function showToast(msg, type) {
    // type: 'success' | 'error' | 'info'
    let toast = document.getElementById('db-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'db-toast';
        toast.className = 'db-toast';
        toast.innerHTML = '<span class="db-toast-dot"></span><span class="db-toast-msg"></span>';
        document.body.appendChild(toast);
    }
    toast.className = 'db-toast ' + (type || 'info');
    toast.querySelector('.db-toast-msg').textContent = msg;
    toast.classList.add('show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(function () {
        toast.classList.remove('show');
    }, type === 'error' ? 5000 : 3000);
}

// ──────────────────────────────────────────────
// PRUEBA DE CONEXIÓN A SUPABASE
// ──────────────────────────────────────────────
async function testConnection() {
    try {
        const client = getSupabase();
        // Consulta mínima para verificar conexión
        const { error } = await client
            .from('banco_preguntas')
            .select('MATERIA', { count: 'exact', head: true });
        if (error) throw error;
        // Conectado — no mostrar toast de éxito (menos ruido)
        console.log('[DB] conexión verificada OK');
    } catch (e) {
        // Si falla con MATERIA mayúscula, intentar con materia minúscula
        try {
            const client = getSupabase();
            const { error } = await client
                .from('banco_preguntas')
                .select('materia', { count: 'exact', head: true });
            if (error) throw error;
            console.log('[DB] conexión verificada OK (fallback)');
        } catch (e2) {
            console.warn('Aviso de conexión:', e2.message);
            showToast('⚠ verifica tu conexión a internet', 'error');
        }
    }
}

// ──────────────────────────────────────────────
// PROTECCIÓN ANTI-COPIA EN CARDS
// ──────────────────────────────────────────────
// Inicialización unificada al cargar el DOM
document.addEventListener('DOMContentLoaded', function () {
    // Botón revelar respuesta
    const btnReveal = document.getElementById('btn-reveal');
    if (btnReveal) {
        btnReveal.addEventListener('click', function () {
            document.getElementById('card').classList.add('flipped');
            document.getElementById('btn-reveal').classList.add('hidden');
            document.getElementById('anki-buttons').classList.remove('hidden');
        });
    }

    // Protección anti-copia en tarjetas
    const cc = document.querySelector('.card-container');
    if (cc) {
        cc.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
        cc.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && ['c', 'C', 'a', 'A'].includes(e.key)) e.preventDefault();
        });
        cc.addEventListener('selectstart', function (e) { e.preventDefault(); return false; });
    }

    // Inicializar autenticación (gestiona sesión, login y acceso a la app)
    initAuth();
});

document.addEventListener('copy', function (e) {
    const sel = window.getSelection();
    if (!sel) return;
    const node = sel.anchorNode;
    const cc = document.querySelector('.card-container');
    if (cc && node && cc.contains(node)) {
        e.preventDefault();
        if (e.clipboardData) e.clipboardData.setData('text/plain', '');
    }
});


// ──────────────────────────────────────────────
// PRECARGA DE DATOS (mejora velocidad de apertura)
// Carga banco_preguntas en background al iniciar la app
// así cuando el usuario abre banco/simulacro ya está en caché
// ──────────────────────────────────────────────
async function preloadAppData() {
    if (bancoState._cache && bancoState._cache.length > 0) return; // ya cargado
    try {
        var client = getSupabase();
        var res = await client.from('banco_preguntas').select('*').limit(1000);
        if (res.error) return;
        bancoState._cache = res.data || [];
        simState._cache = bancoState._cache;
        console.log('[Preload] banco_preguntas cargado:', bancoState._cache.length, 'preguntas');
    } catch (e) {
        console.warn('[Preload] error:', e.message);
    }
}
// ══════════════════════════════════════════════════════
// ██  BANCO DE PREGUNTAS  ██
// ══════════════════════════════════════════════════════

// Estado del banco
let bancoState = {
    materias: [],
    temas: [],
    selectedMateria: null,
    selectedTema: null,       // null = todas
    selectedDificultad: null, // null = todas | 'facil' | 'medio' | 'dificil'
    allPreguntas: [],
    preguntas: [],            // las 50 (o menos) mezcladas
    currentIdx: 0,
    answers: [],              // { selected: null|idx, correct: idx }
    finalized: false,
    _cache: []                // caché de todas las filas (evita re-queries)
};

// ──────────────────────────────────────────────
// ABRIR BANCO (pantalla selector)
// ──────────────────────────────────────────────
window.openBanco = async function () {
    // Advertir si hay banco en progreso
    const enProgreso = bancoState.preguntas.length > 0 && !bancoState.finalized &&
        bancoState.answers.some(function (a) { return a.selected !== null; });
    if (enProgreso) {
        if (!confirm('¿salir del banco actual? perderás tu progreso.')) return;
    }
    // Reset estado
    bancoState.selectedMateria = null;
    bancoState.selectedTema = null;
    bancoState.selectedDificultad = null;
    bancoState.allPreguntas = [];
    bancoState.preguntas = [];
    bancoState.answers = [];
    bancoState.currentIdx = 0;
    bancoState.finalized = false;
    // No limpiar caché si ya hay datos precargados (acelera apertura)
    // bancoState._cache = []; // desactivado: se mantiene caché entre aperturas

    // Reset UI selector
    document.getElementById('banco-materia-text').textContent = 'seleccionar materia';
    document.getElementById('banco-materia-btn').classList.remove('open');
    document.getElementById('banco-tema-text').textContent = 'primero selecciona una materia';
    document.getElementById('banco-tema-btn').classList.add('banco-select-disabled');
    document.getElementById('banco-tema-btn').classList.remove('open');
    document.getElementById('banco-start-btn').disabled = true;
    document.getElementById('banco-count-display').textContent = '—';
    document.getElementById('banco-summary-filter-row').classList.add('hidden');

    // Reset dificultad buttons a "todos"
    resetBancoDificultadUI();

    // Cerrar dropdowns
    document.getElementById('banco-materia-dropdown').classList.add('hidden');
    document.getElementById('banco-tema-dropdown').classList.add('hidden');

    // Mostrar sección
    showBancoScreen('banco-selector');
    showScreen('banco-screen');

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    // Cargar materias y preguntas difíciles personalizadas
    await loadBancoMaterias();
    loadPreguntasDificiles(); // no await: carga en paralelo sin bloquear
};

async function loadBancoMaterias() {
    const ddEl = document.getElementById('banco-materia-dropdown');

    // Si hay caché, construir UI inmediatamente (Fix: velocidad de apertura)
    let data = bancoState._cache || [];
    if (data.length === 0) {
        ddEl.innerHTML = '<div class="banco-loading-opts"><i class="fas fa-spinner fa-spin"></i> cargando materias...</div>';
        try {
            const client = getSupabase();
            const { data: fetched, error } = await client
                .from('banco_preguntas')
                .select('*')
                .limit(1000);
            if (error) throw error;
            data = fetched;
            bancoState._cache = data;
        } catch (e) {
            console.error('Error cargando materias del banco:', e);
            ddEl.innerHTML = '<div class="banco-loading-opts" style="color:#ef4444;"><i class="fas fa-exclamation-triangle"></i> error al conectar: ' + e.message + '</div>';
            showToast('⚠ error al cargar materias', 'error');
            return;
        }
    }

    try {
        // Obtener materias únicas usando campo() que detecta MAYÚSCULAS/minúsculas
        const materiasSet = new Set();
        data.forEach(function (r) {
            const m = campo(r, 'materia');
            if (m) materiasSet.add(m);
        });
        bancoState.materias = Array.from(materiasSet).sort();
        // Guardar todos los datos en caché para evitar re-queries
        bancoState._cache = data;

        ddEl.innerHTML = '';
        if (bancoState.materias.length === 0) {
            ddEl.innerHTML = '<div class="banco-loading-opts">sin materias disponibles</div>';
            return;
        }

        bancoState.materias.forEach(function (m) {
            const btn = document.createElement('button');
            btn.className = 'banco-dropdown-item';
            btn.textContent = m.toLowerCase();
            btn.onclick = function () { selectBancoMateria(m); };
            ddEl.appendChild(btn);
        });

        // Silenciar toast de éxito (menos ruido)
    } catch (e) {
        console.error('Error cargando materias del banco:', e);
        ddEl.innerHTML = '<div class="banco-loading-opts" style="color:#ef4444;"><i class="fas fa-exclamation-triangle"></i> error al conectar: ' + e.message + '</div>';
        showToast('⚠ error al cargar materias', 'error');
    }
}

// (fallback eliminado, ahora siempre usamos select('*'))


// ──────────────────────────────────────────────
// SELECCIONAR MATERIA
// ──────────────────────────────────────────────
window.selectBancoMateria = async function (materia) {
    bancoState.selectedMateria = materia;
    bancoState.selectedTema = null;

    // Actualizar UI materia
    document.getElementById('banco-materia-text').textContent = materia.toLowerCase();
    document.getElementById('banco-materia-dropdown').classList.add('hidden');
    document.getElementById('banco-materia-btn').classList.remove('open');

    // Highlight item seleccionado
    document.querySelectorAll('#banco-materia-dropdown .banco-dropdown-item').forEach(function (el) {
        el.classList.toggle('selected', el.textContent === materia.toLowerCase());
    });

    // Habilitar select tema
    const temaBtnEl = document.getElementById('banco-tema-btn');
    temaBtnEl.classList.remove('banco-select-disabled');
    document.getElementById('banco-tema-text').textContent = 'todos los temas';

    // Cargar temas de esa materia
    await loadBancoTemas(materia);
    // Cargar preguntas para actualizar contador
    await loadBancoPreguntas();
};

async function loadBancoTemas(materia) {
    const ddEl = document.getElementById('banco-tema-dropdown');
    ddEl.innerHTML = '<div class="banco-loading-opts"><i class="fas fa-spinner fa-spin"></i> cargando temas...</div>';

    try {
        // Usar caché si está disponible para evitar re-query
        let rows = bancoState._cache || [];
        let usandoCache = rows.length > 0;

        if (!usandoCache) {
            const client = getSupabase();
            const { data, error } = await client
                .from('banco_preguntas')
                .select('*')
                .limit(1000);
            if (error) throw error;
            rows = data || [];
            bancoState._cache = rows;
        }

        // Filtrar por la materia seleccionada
        const temasSet = new Set();
        rows.forEach(function (r) {
            const m = campo(r, 'materia');
            if (m && m === materia) {
                const t = campo(r, 'tema');
                if (t) temasSet.add(t);
            }
        });
        bancoState.temas = Array.from(temasSet).sort();

        ddEl.innerHTML = '';

        // Opción "todos"
        const allBtn = document.createElement('button');
        allBtn.className = 'banco-dropdown-item all-option selected';
        allBtn.textContent = 'todos los temas';
        allBtn.onclick = function () { selectBancoTema(null); };
        ddEl.appendChild(allBtn);

        bancoState.temas.forEach(function (t) {
            const btn = document.createElement('button');
            btn.className = 'banco-dropdown-item';
            btn.textContent = t.toLowerCase();
            btn.onclick = function () { selectBancoTema(t); };
            ddEl.appendChild(btn);
        });

    } catch (e) {
        console.error('Error cargando temas:', e);
        ddEl.innerHTML = '<div class="banco-loading-opts" style="color:#ef4444;">error: ' + e.message + '</div>';
    }
}

// ──────────────────────────────────────────────
// SELECCIONAR TEMA
// ──────────────────────────────────────────────
window.selectBancoTema = async function (tema) {
    bancoState.selectedTema = tema;

    document.getElementById('banco-tema-text').textContent = tema ? tema.toLowerCase() : 'todos los temas';
    document.getElementById('banco-tema-dropdown').classList.add('hidden');
    document.getElementById('banco-tema-btn').classList.remove('open');

    // Highlight
    document.querySelectorAll('#banco-tema-dropdown .banco-dropdown-item').forEach(function (el) {
        const isAll = (el.textContent === 'todos los temas' && tema === null);
        const isThis = tema && el.textContent === tema.toLowerCase();
        el.classList.toggle('selected', isAll || isThis);
    });

    await loadBancoPreguntas();
};

// ──────────────────────────────────────────────
// CARGAR PREGUNTAS Y ACTUALIZAR CONTADOR
// ──────────────────────────────────────────────
async function loadBancoPreguntas() {
    if (!bancoState.selectedMateria) return;

    try {
        // Usar caché para filtrar (ya cargado en loadBancoMaterias)
        let rows = bancoState._cache || [];

        // Si no hay caché, hacer query completa
        if (rows.length === 0) {
            const client = getSupabase();
            const { data, error } = await client
                .from('banco_preguntas')
                .select('*')
                .limit(1000);
            if (error) throw error;
            rows = data || [];
            bancoState._cache = rows;
        }

        // Filtrar por materia y tema usando campo()
        let filtradas = rows.filter(function (r) {
            return campo(r, 'materia') === bancoState.selectedMateria;
        });

        if (bancoState.selectedTema) {
            filtradas = filtradas.filter(function (r) {
                return campo(r, 'tema') === bancoState.selectedTema;
            });
        }

        // Filtrar por dificultad si está seleccionada
        if (bancoState.selectedDificultad) {
            filtradas = filtradas.filter(function (r) {
                const d = normalizarDificultad(campo(r, 'dificultad'));
                return d === bancoState.selectedDificultad;
            });
        }

        bancoState.allPreguntas = filtradas;
        const count = Math.min(filtradas.length, 50);
        document.getElementById('banco-count-display').textContent = count;

        // Mostrar filtro activo
        const filterRow = document.getElementById('banco-summary-filter-row');
        const filterText = document.getElementById('banco-summary-filter-text');
        const difLabel = bancoState.selectedDificultad
            ? ' · nivel: ' + bancoState.selectedDificultad
            : '';
        if (bancoState.selectedTema) {
            filterRow.classList.remove('hidden');
            filterText.textContent = 'tema: ' + bancoState.selectedTema.toLowerCase() + difLabel;
        } else {
            filterRow.classList.remove('hidden');
            filterText.textContent = 'materia: ' + bancoState.selectedMateria.toLowerCase() + ' · todos los temas' + difLabel;
        }

        // Habilitar botón start si hay preguntas
        const startBtn = document.getElementById('banco-start-btn');
        startBtn.disabled = count === 0;

    } catch (e) {
        console.error('Error cargando preguntas:', e);
        showToast('⚠ error al filtrar preguntas', 'error');
    }
}


// ──────────────────────────────────────────────
// TOGGLE DROPDOWNS
// ──────────────────────────────────────────────
window.toggleBancoDropdown = function (which) {
    const ddMateria = document.getElementById('banco-materia-dropdown');
    const ddTema = document.getElementById('banco-tema-dropdown');
    const btnMateria = document.getElementById('banco-materia-btn');
    const btnTema = document.getElementById('banco-tema-btn');

    if (which === 'materia') {
        if (btnTema.classList.contains('banco-select-disabled')) {
            // cerrar tema si está abierto (disabled = no hace nada)
        }
        // Cerrar tema
        ddTema.classList.add('hidden');
        btnTema.classList.remove('open');

        const isOpen = !ddMateria.classList.contains('hidden');
        if (isOpen) {
            ddMateria.classList.add('hidden');
            btnMateria.classList.remove('open');
        } else {
            ddMateria.classList.remove('hidden');
            btnMateria.classList.add('open');
        }
    } else {
        // Tema — solo si no está disabled
        if (btnTema.classList.contains('banco-select-disabled')) return;

        // Cerrar materia
        ddMateria.classList.add('hidden');
        btnMateria.classList.remove('open');

        const isOpen = !ddTema.classList.contains('hidden');
        if (isOpen) {
            ddTema.classList.add('hidden');
            btnTema.classList.remove('open');
        } else {
            ddTema.classList.remove('hidden');
            btnTema.classList.add('open');
        }
    }
};

// Cerrar dropdowns al hacer click fuera
document.addEventListener('click', function (e) {
    const wrappers = document.querySelectorAll('.banco-custom-select');
    let inside = false;
    wrappers.forEach(function (w) { if (w.contains(e.target)) inside = true; });
    if (!inside) {
        const dds = document.querySelectorAll('.banco-dropdown');
        const btns = document.querySelectorAll('.banco-select-btn');
        dds.forEach(function (d) { d.classList.add('hidden'); });
        btns.forEach(function (b) { b.classList.remove('open'); });
    }
});

// ──────────────────────────────────────────────
// INICIAR BANCO
// ──────────────────────────────────────────────
window.startBanco = function () {
    if (!bancoState.allPreguntas.length) return;

    // Mezclar y limitar a 50
    const shuffled = shuffleArray(bancoState.allPreguntas.slice());
    bancoState.preguntas = shuffled.slice(0, 50);
    bancoState.currentIdx = 0;
    bancoState.finalized = false;

    // Inicializar answers
    bancoState.answers = bancoState.preguntas.map(function () {
        return { selected: null };
    });

    // Actualizar meta header
    document.getElementById('bq-materia').textContent = bancoState.selectedMateria.toLowerCase();
    document.getElementById('bq-tema').textContent = bancoState.selectedTema
        ? bancoState.selectedTema.toLowerCase()
        : 'todos los temas';
    document.getElementById('bq-total').textContent = bancoState.preguntas.length;

    // Ocultar resultado
    document.getElementById('bq-result').classList.add('hidden');

    // Construir círculos
    buildBqCircles();

    // Mostrar pantalla quiz
    showBancoScreen('banco-quiz');

    // Renderizar primera pregunta
    renderBancoQuestion();
};

// ──────────────────────────────────────────────
// RENDERIZAR PREGUNTA
// ──────────────────────────────────────────────
function renderBancoQuestion() {
    const idx = bancoState.currentIdx;
    const q = bancoState.preguntas[idx];
    const ans = bancoState.answers[idx];

    // Número de pregunta
    document.getElementById('bq-num').textContent = idx + 1;
    document.getElementById('bq-num-badge').textContent = 'N° ' + (idx + 1);

    // Texto de pregunta — soportar columnas en MAYÚSCULAS o minúsculas
    document.getElementById('bq-question-text').textContent = campo(q, 'pregunta') || campo(q, 'PREGUNTA') || '';

    // Dificultad — normalizar a minúsculas para comparación
    renderBqDificultad(campo(q, 'dificultad') || 'facil');

    // Opciones
    const optsEl = document.getElementById('bq-options');
    optsEl.innerHTML = '';

    const opciones = [
        campo(q, 'opcion_a'),
        campo(q, 'opcion_b'),
        campo(q, 'opcion_c'),
        campo(q, 'opcion_d')
    ].filter(function (o) { return o && o.toString().trim() !== ''; });

    // Determinar índice de respuesta correcta
    const correctaRaw = (campo(q, 'respuesta_correcta') || 'A').toString().trim().toUpperCase();
    const letrasMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
    const correctIdx = letrasMap[correctaRaw] !== undefined ? letrasMap[correctaRaw] : parseInt(correctaRaw) - 1;

    const letras = ['a', 'b', 'c', 'd'];
    opciones.forEach(function (opcion, i) {
        const btn = document.createElement('button');
        btn.className = 'bq-option-btn';
        btn.innerHTML =
            '<span class="bq-option-letter">' + letras[i] + '</span>' +
            '<span class="bq-option-text">' + opcion + '</span>' +
            '<span class="bq-option-check"><i class="fas ' + (i === correctIdx ? 'fa-check' : 'fa-times') + '"></i></span>';

        // Si ya fue respondida
        if (ans.selected !== null || bancoState.finalized) {
            btn.disabled = true;
            if (i === correctIdx) {
                btn.classList.add('bq-correct');
            } else if (i === ans.selected) {
                btn.classList.add('bq-wrong');
            }
        } else {
            btn.onclick = function () { selectBancoAnswer(i, correctIdx); };
        }
        optsEl.appendChild(btn);
    });

    // Comentario / Justificación (soporta: JUSTIFICACION, justificacion, EXPLICACION, explicacion, COMENTARIO)
    const comentarioWrap = document.getElementById('bq-comentario-wrap');
    const comentarioText = document.getElementById('bq-comentario-text');
    const comentario = campo(q, 'justificacion')
        || campo(q, 'explicacion')
        || campo(q, 'comentario')
        || '';

    if (ans.selected !== null || bancoState.finalized) {
        comentarioWrap.classList.remove('hidden');
        comentarioText.textContent = comentario || 'sin comentario para esta pregunta.';
    } else {
        comentarioWrap.classList.add('hidden');
        // Cerrar el body si estaba abierto
        var cbody = document.getElementById('bq-comentario-body');
        var carrow = document.getElementById('bq-comentario-arrow');
        var ctoggle = document.querySelector('.bq-comentario-toggle');
        if (cbody) cbody.classList.add('hidden');
        if (ctoggle) ctoggle.classList.remove('open');
        if (carrow) carrow.style.transform = '';
    }

    // Círculo activo
    updateBqCircles();

    // Botones nav
    const prevBtn = document.getElementById('bq-btn-prev');
    const nextBtn = document.getElementById('bq-btn-next');
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === bancoState.preguntas.length - 1;
}

// ──────────────────────────────────────────────
// SELECCIONAR RESPUESTA
// ──────────────────────────────────────────────
function selectBancoAnswer(selectedIdx, correctIdx) {
    const idx = bancoState.currentIdx;
    bancoState.answers[idx].selected = selectedIdx;
    bancoState.answers[idx].correct = correctIdx;

    // Deshabilitar todos los botones y marcar
    const btns = document.querySelectorAll('.bq-option-btn');
    btns.forEach(function (btn, i) {
        btn.disabled = true;
        if (i === correctIdx) {
            btn.classList.add('bq-correct');
        } else if (i === selectedIdx) {
            btn.classList.add('bq-wrong');
        }
    });

    // Mostrar comentario con el texto de JUSTIFICACION
    const q = bancoState.preguntas[idx];
    const comentario = campo(q, 'justificacion')
        || campo(q, 'explicacion')
        || campo(q, 'comentario')
        || '';
    const comentarioWrap = document.getElementById('bq-comentario-wrap');
    const comentarioText = document.getElementById('bq-comentario-text');
    comentarioWrap.classList.remove('hidden');
    if (comentarioText) {
        comentarioText.textContent = comentario || 'sin justificación para esta pregunta.';
    }

    // Registrar respuesta y recargar panel de seguimiento en background
    registrarRespuestaBanco(q, selectedIdx === correctIdx).then(function () {
        // Recargar panel silenciosamente después de guardar
        var panel = document.getElementById('banco-dificiles-panel');
        if (panel) loadPreguntasDificiles();
    });

    // Actualizar círculo
    updateBqCircles();
}

// ──────────────────────────────────────────────
// DIFICULTAD DOTS
// ──────────────────────────────────────────────
function renderBqDificultad(dificultad) {
    const el = document.getElementById('bq-dificultad');
    el.innerHTML = '';
    const d = normalizarDificultad(dificultad);
    const isFacil = d === 'facil';
    const isMedio = d === 'medio';
    const isDificil = d === 'dificil';

    const levels = [
        { cls: isFacil ? 'active-facil' : '' },
        { cls: isFacil ? 'active-facil' : (isMedio ? 'active-medio' : '') },
        { cls: isDificil ? 'active-dificil' : (isMedio ? 'active-medio' : '') },
        { cls: isDificil ? 'active-dificil' : '' },
        { cls: isDificil ? 'active-dificil' : '' }
    ];

    levels.forEach(function (lvl) {
        const dot = document.createElement('span');
        dot.className = 'bq-dot ' + lvl.cls;
        el.appendChild(dot);
    });
}

// ──────────────────────────────────────────────
// CÍRCULOS DE NAVEGACIÓN
// ──────────────────────────────────────────────
function buildBqCircles() {
    const container = document.getElementById('bq-circles');
    container.innerHTML = '';
    bancoState.preguntas.forEach(function (_, i) {
        const btn = document.createElement('button');
        btn.className = 'bq-circle';
        btn.textContent = i + 1;
        btn.onclick = function () { goToBqQuestion(i); };
        container.appendChild(btn);
    });
}

function updateBqCircles() {
    const circles = document.querySelectorAll('.bq-circle');
    circles.forEach(function (c, i) {
        c.className = 'bq-circle';
        const ans = bancoState.answers[i];
        if (ans && ans.selected !== null) {
            const isCorrect = ans.selected === ans.correct;
            c.classList.add(isCorrect ? 'bq-circle-correct' : 'bq-circle-wrong');
        }
        if (i === bancoState.currentIdx) {
            c.classList.add('bq-circle-active');
        }
    });
}

window.goToBqQuestion = function (idx) {
    bancoState.currentIdx = idx;
    renderBancoQuestion();
};

// ──────────────────────────────────────────────
// NAVEGACIÓN SIGUIENTE / ANTERIOR
// ──────────────────────────────────────────────
window.bqNavigate = function (dir) {
    const newIdx = bancoState.currentIdx + dir;
    if (newIdx < 0 || newIdx >= bancoState.preguntas.length) return;
    bancoState.currentIdx = newIdx;
    renderBancoQuestion();
};

// ──────────────────────────────────────────────
// TOGGLE COMENTARIO
// ──────────────────────────────────────────────
window.toggleComentario = function () {
    const body = document.getElementById('bq-comentario-body');
    const arrow = document.getElementById('bq-comentario-arrow');
    const toggle = document.querySelector('.bq-comentario-toggle');
    const isHidden = body.classList.contains('hidden');
    body.classList.toggle('hidden');
    if (toggle) toggle.classList.toggle('open', isHidden);
    if (arrow) arrow.style.transform = isHidden ? 'rotate(180deg)' : '';
};

// ──────────────────────────────────────────────
// FINALIZAR BANCO
// ──────────────────────────────────────────────
window.finalizarBanco = function () {
    bancoState.finalized = true;
    const total = bancoState.preguntas.length;
    let correctas = 0;
    let incorrectas = 0;
    let sinResponder = 0;

    bancoState.answers.forEach(function (ans, i) {
        if (ans.selected === null) {
            sinResponder++;
        } else {
            const q = bancoState.preguntas[i];
            // Usar campo() para soportar MAYÚSCULAS o minúsculas
            const correctaRaw = (campo(q, 'respuesta_correcta') || 'A').toString().trim().toUpperCase();
            const letrasMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
            const correctIdx = letrasMap[correctaRaw] !== undefined ? letrasMap[correctaRaw] : parseInt(correctaRaw) - 1;
            if (ans.selected === correctIdx) {
                correctas++;
                bancoState.answers[i].correct = correctIdx;
            } else {
                incorrectas++;
                bancoState.answers[i].correct = correctIdx;
            }
        }
    });

    const pct = total > 0 ? Math.round((correctas / total) * 100) : 0;
    let emoji = '😅';
    let title = 'sigue practicando';
    if (pct >= 80) { emoji = '🏆'; title = '¡excelente dominio!'; }
    else if (pct >= 60) { emoji = '👏'; title = '¡muy bien!'; }
    else if (pct >= 40) { emoji = '📚'; title = 'puedes mejorar'; }

    document.getElementById('bq-result-emoji').textContent = emoji;
    document.getElementById('bq-result-title').textContent = title;
    document.getElementById('bq-result-score').textContent =
        correctas + ' de ' + total + ' correctas · ' + pct + '% de acierto';
    document.getElementById('bq-rs-correct').textContent = correctas;
    document.getElementById('bq-rs-wrong').textContent = incorrectas;
    document.getElementById('bq-rs-pending').textContent = sinResponder;

    document.getElementById('bq-result').classList.remove('hidden');
    updateBqCircles();

    // Guardar en historial de evaluaciones (Fix: banco se refleja en mis evaluaciones)
    guardarEnHistorial(
        pct,
        correctas,
        total,
        0, // banco no tiene timer
        bancoState.selectedMateria || 'todas'
    );

    // Sincronizar con la nube para el Panel de Admin
    guardarResultadoBancoEnNube({
        materia: bancoState.selectedMateria || 'todas',
        tema: 'práctica general',
        dificultad: bancoState.selectedDificultad || 'todos',
        total: total,
        correctas: correctas,
        incorrectas: incorrectas,
        porcentaje: pct
    });
};

// ──────────────────────────────────────────────
// SALIR DEL BANCO
// ──────────────────────────────────────────────
window.exitBanco = function () {
    const enProgreso = bancoState.preguntas.length > 0 && !bancoState.finalized &&
        bancoState.answers.some(function (a) { return a.selected !== null; });
    if (enProgreso) {
        if (!confirm('¿salir del banco? perderás tu progreso.')) return;
    }
    showBancoScreen('banco-selector');
};

// ──────────────────────────────────────────────
// HELPER: alternar sub-pantallas del banco
// ──────────────────────────────────────────────
function showBancoScreen(which) {
    document.getElementById('banco-selector').classList.toggle('hidden', which !== 'banco-selector');
    document.getElementById('banco-quiz').classList.toggle('hidden', which !== 'banco-quiz');
}

// ──────────────────────────────────────────────
// NORMALIZAR DIFICULTAD (quita tildes, lowercase)
// ──────────────────────────────────────────────
function normalizarDificultad(raw) {
    if (!raw) return 'facil';
    const d = raw.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (d.startsWith('fac')) return 'facil';
    if (d.startsWith('med')) return 'medio';
    if (d.startsWith('dif')) return 'dificil';
    return 'facil';
}

// ──────────────────────────────────────────────
// SELECTOR DIFICULTAD
// ──────────────────────────────────────────────
function resetBancoDificultadUI() {
    ['todos', 'facil', 'medio', 'dificil'].forEach(function (k) {
        var btn = document.getElementById('banco-dif-' + k);
        if (!btn) return;
        btn.classList.remove('banco-dif-active', 'active-selected');
    });
    var todosBtn = document.getElementById('banco-dif-todos');
    if (todosBtn) todosBtn.classList.add('banco-dif-active');
}

window.selectBancoDificultad = async function (nivel) {
    bancoState.selectedDificultad = nivel;

    // Reset todos los botones
    ['todos', 'facil', 'medio', 'dificil'].forEach(function (k) {
        var btn = document.getElementById('banco-dif-' + k);
        if (!btn) return;
        btn.classList.remove('banco-dif-active', 'active-selected');
    });

    if (nivel === null) {
        var todosBtn = document.getElementById('banco-dif-todos');
        if (todosBtn) todosBtn.classList.add('banco-dif-active');
    } else {
        var selBtn = document.getElementById('banco-dif-' + nivel);
        if (selBtn) selBtn.classList.add('active-selected');
    }

    // Recargar contador de preguntas
    if (bancoState.selectedMateria) {
        await loadBancoPreguntas();
    }
};

// ──────────────────────────────────────────────
// TRACKING DE ERRORES (guarda en Supabase)
// Tabla: banco_errores
// Columnas: user_id, pregunta_id, pregunta_texto, materia, tema,
//           intentos, errores, ultima_vez (timestamp)
// ──────────────────────────────────────────────
async function registrarRespuestaBanco(preguntaRow, acerto) {
    if (!currentUser) return;
    try {
        var client = getSupabase();

        // campo() maneja columnas en MAYUSCULAS o minusculas
        var pregId = campo(preguntaRow, 'id');
        if (!pregId) {
            console.warn('[BancoTracking] pregunta sin id, no se registra');
            return;
        }

        var pregTexto = (campo(preguntaRow, 'pregunta') || '').substring(0, 200);
        var materia   = campo(preguntaRow, 'materia') || '';
        var tema      = campo(preguntaRow, 'tema') || '';
        var now       = new Date().toISOString();

        // Fetch del registro actual para hacer el incremento correcto
        var { data: existing, error: fetchErr } = await client
            .from('banco_errores')
            .select('id, intentos, errores')
            .eq('user_id', currentUser.id)
            .eq('pregunta_id', String(pregId))
            .maybeSingle();

        if (fetchErr) { console.warn('[BancoTracking] fetch error:', fetchErr.message); return; }

        if (existing) {
            var { error: updErr } = await client
                .from('banco_errores')
                .update({
                    intentos:   (existing.intentos || 0) + 1,
                    errores:    (existing.errores  || 0) + (acerto ? 0 : 1),
                    ultima_vez: now
                })
                .eq('id', existing.id);
            if (updErr) console.warn('[BancoTracking] update error:', updErr.message);
        } else {
            var { error: insErr } = await client
                .from('banco_errores')
                .insert({
                    user_id:        currentUser.id,
                    pregunta_id:    String(pregId),
                    pregunta_texto: pregTexto,
                    materia:        materia,
                    tema:           tema,
                    intentos:       1,
                    errores:        acerto ? 0 : 1,
                    ultima_vez:     now
                });
            if (insErr) console.warn('[BancoTracking] insert error:', insErr.message);
        }
    } catch (e) {
        console.warn('[BancoTracking] excepcion:', e.message);
    }
}

// ──────────────────────────────────────────────
// PREGUNTAS DIFÍCILES PERSONALIZADAS
// ──────────────────────────────────────────────
async function loadPreguntasDificiles() {
    var panel = document.getElementById('banco-dificiles-panel');
    var loadingEl = document.getElementById('banco-dificiles-loading');
    var emptyEl = document.getElementById('banco-dificiles-empty');
    var listEl = document.getElementById('banco-dificiles-list');
    var practicarBtn = document.getElementById('banco-dificiles-practica-btn');

    if (!panel || !currentUser) return;

    // Estado inicial: loading
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (emptyEl) emptyEl.classList.add('hidden');
    if (listEl) listEl.classList.add('hidden');
    if (practicarBtn) practicarBtn.style.display = 'none';

    try {
        var client = getSupabase();
        // Traer todas las preguntas con al menos 1 error, sin mínimo de intentos
        var { data, error } = await client
            .from('banco_errores')
            .select('pregunta_id, pregunta_texto, materia, tema, intentos, errores, ultima_vez')
            .eq('user_id', currentUser.id)
            .gt('errores', 0)
            .order('ultima_vez', { ascending: false })
            .limit(20);

        if (error) throw error;

        if (loadingEl) loadingEl.classList.add('hidden');

        var conErrores = data || [];

        // Ordenar por tasa de error descendente (más falladas primero)
        conErrores.sort(function (a, b) {
            var rateA = a.intentos > 0 ? a.errores / a.intentos : 0;
            var rateB = b.intentos > 0 ? b.errores / b.intentos : 0;
            if (rateB !== rateA) return rateB - rateA;
            return b.errores - a.errores; // desempate: más errores absolutos
        });

        conErrores = conErrores.slice(0, 10); // top 10

        if (conErrores.length === 0) {
            if (emptyEl) emptyEl.classList.remove('hidden');
            return;
        }

        // Render list
        if (listEl) {
            listEl.classList.remove('hidden');
            listEl.innerHTML = '';
            conErrores.forEach(function (r, i) {
                var pct = r.intentos > 0 ? Math.round(((r.intentos - r.errores) / r.intentos) * 100) : 0;
                var rankClass = i === 0 ? '' : (i === 1 ? ' rank-2' : (i === 2 ? ' rank-3' : ' rank-n'));
                var pctClass = pct >= 70 ? 'rate-ok' : (pct >= 40 ? 'rate-med' : '');
                var lastDate = r.ultima_vez ? new Date(r.ultima_vez).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }) : '';

                var item = document.createElement('div');
                item.className = 'banco-dificil-item';
                item.innerHTML =
                    '<div class="banco-dificil-rank' + rankClass + '">' + (i + 1) + '</div>' +
                    '<div class="banco-dificil-body">' +
                    '<div class="banco-dificil-pregunta">' + (r.pregunta_texto || 'pregunta sin texto') + '</div>' +
                    '<div class="banco-dificil-meta">' +
                    (r.materia ? '<span><i class="fas fa-book-medical"></i>' + r.materia.toLowerCase() + '</span>' : '') +
                    (r.tema ? '<span><i class="fas fa-tag"></i>' + r.tema.toLowerCase() + '</span>' : '') +
                    (lastDate ? '<span><i class="fas fa-clock"></i>' + lastDate + '</span>' : '') +
                    '</div>' +
                    '</div>' +
                    '<div class="banco-dificil-rate">' +
                    '<span class="banco-dificil-pct ' + pctClass + '">' + pct + '%</span>' +
                    '<span class="banco-dificil-label">acierto</span>' +
                    '</div>';
                listEl.appendChild(item);
            });
        }

        // Guardar IDs para el botón "practicar"
        bancoState._preguntasDificilesIds = conErrores.map(function (r) { return r.pregunta_id; }); // stored as-is (uuid string)
        if (practicarBtn) practicarBtn.style.display = 'flex';

    } catch (e) {
        console.warn('[PreguntasDificiles] error:', e.message);
        if (loadingEl) loadingEl.classList.add('hidden');
        if (emptyEl) emptyEl.classList.remove('hidden');
    }
}

// ──────────────────────────────────────────────
// PRACTICAR PREGUNTAS DIFÍCILES
// ──────────────────────────────────────────────
window.practicarPreguntasDificiles = async function () {
    var ids = bancoState._preguntasDificilesIds;
    if (!ids || ids.length === 0) return;

    try {
        var client = getSupabase();
        var rows = bancoState._cache || [];

        // Normalizar ids a string para comparacion segura (uuid o int)
        var idsStr = ids.map(String);

        // Si no hay cache completo, traer las preguntas por ID desde Supabase
        if (rows.length === 0) {
            var { data, error } = await client
                .from('banco_preguntas')
                .select('*')
                .in('id', ids);
            if (error) throw error;
            rows = data || [];
        } else {
            // Filtrar del cache comparando como strings
            rows = rows.filter(function (r) {
                var rid = campo(r, 'id');
                return rid !== '' && idsStr.includes(String(rid));
            });
        }

        if (rows.length === 0) {
            showToast('⚠ no se encontraron las preguntas en la base de datos', 'error');
            return;
        }

        // Configurar banco con estas preguntas
        bancoState.selectedMateria = 'seguimiento personalizado';
        bancoState.selectedTema = null;
        bancoState.preguntas = shuffleArray(rows.slice());
        bancoState.currentIdx = 0;
        bancoState.finalized = false;
        bancoState.answers = bancoState.preguntas.map(function () { return { selected: null }; });

        document.getElementById('bq-materia').textContent = '🧠 seguimiento personalizado';
        document.getElementById('bq-tema').textContent = 'preguntas que más te costaron';
        document.getElementById('bq-total').textContent = bancoState.preguntas.length;
        document.getElementById('bq-result').classList.add('hidden');

        buildBqCircles();
        showBancoScreen('banco-quiz');
        renderBancoQuestion();

        showToast('🎯 modo seguimiento: ' + rows.length + ' preguntas cargadas', 'success');
    } catch (e) {
        console.error('[PracticarDificiles] error:', e);
        showToast('⚠ error al cargar las preguntas', 'error');
    }
};


// ══════════════════════════════════════════════════════
// ██  SIMULACRO  ██
// ══════════════════════════════════════════════════════

var simState = {
    mode: 'oficial',        // 'oficial' | 'completo' | 'materia'
    selectedMateria: null,
    selectedExamen: null,   // nombre del examen oficial
    duracion: 60,           // minutos
    nPreguntas: 30,
    preguntas: [],
    answers: [],            // { selected: null|idx }
    currentIdx: 0,
    timerInterval: null,
    secondsLeft: 3600,
    startTimestamp: null,
    finalized: false,
    _cache: [],
    _oficialesCache: []     // caché de la tabla simulacros
};

// ── Abrir pantalla de configuración ──
window.openSimulacro = async function () {
    if (simState.timerInterval) {
        if (!confirm('hay un simulacro en curso. ¿deseas descartarlo?')) return;
        clearInterval(simState.timerInterval);
        simState.timerInterval = null;
    }
    simState.finalized = false;
    showSimScreen('sim-config');
    showScreen('simulacro-screen');
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }
    await loadSimOficiales();
    await loadSimMaterias();
};

async function loadSimOficiales() {
    var ddEl = document.getElementById('sim-oficial-dropdown');
    if (!ddEl) return;
    ddEl.innerHTML = '<div class="banco-loading-opts"><i class="fas fa-spinner fa-spin"></i> cargando exámenes...</div>';
    try {
        var client = getSupabase();
        // Obtener nombres únicos de exámenes de la nueva tabla
        var { data, error } = await client.from('simulacros').select('nombre, materia').order('nombre');
        if (error) throw error;

        simState._oficialesCache = data || [];
        var nombresSet = new Set();
        data.forEach(function (r) { if (r.nombre) nombresSet.add(r.nombre); });
        var nombres = Array.from(nombresSet);

        ddEl.innerHTML = '';
        if (nombres.length === 0) {
            ddEl.innerHTML = '<div class="banco-loading-opts">no hay exámenes cargados aún</div>';
            document.getElementById('sim-oficial-text').textContent = 'sin exámenes';
            return;
        }

        nombres.forEach(function (n) {
            var btn = document.createElement('button');
            btn.className = 'banco-dropdown-item';
            btn.textContent = n.toLowerCase();
            btn.onclick = function () { selectSimOficial(n); };
            ddEl.appendChild(btn);
        });

        // Seleccionar el primero por defecto si no hay uno
        if (!simState.selectedExamen) selectSimOficial(nombres[0]);

    } catch (e) {
        console.warn('Error loadSimOficiales:', e);
        ddEl.innerHTML = '<div class="banco-loading-opts" style="color:#ef4444;">error al cargar</div>';
    }
}

window.toggleSimOficialDropdown = function () {
    var dd = document.getElementById('sim-oficial-dropdown');
    var btn = document.getElementById('sim-oficial-btn');
    var isOpen = !dd.classList.contains('hidden');
    dd.classList.toggle('hidden', isOpen);
    btn.classList.toggle('open', !isOpen);
};

window.selectSimOficial = function (nombre) {
    simState.selectedExamen = nombre;
    document.getElementById('sim-oficial-text').textContent = nombre.toLowerCase();
    document.getElementById('sim-oficial-dropdown').classList.add('hidden');
    document.getElementById('sim-oficial-btn').classList.remove('open');
    document.getElementById('sim-sum-materia').textContent = nombre.toLowerCase();

    // Buscar materia de este examen para el resumen
    var found = simState._oficialesCache.find(function (r) { return r.nombre === nombre; });
    if (found && found.materia) {
        // Opcional: mostrar materia también
    }
};

// ── Cargar materias desde caché del banco o desde Supabase ──
async function loadSimMaterias() {
    var ddEl = document.getElementById('sim-materia-dropdown');
    if (!ddEl) return;
    ddEl.innerHTML = '<div class="banco-loading-opts"><i class="fas fa-spinner fa-spin"></i> cargando materias...</div>';
    try {
        var rows = bancoState._cache || [];
        if (rows.length === 0) {
            var client = getSupabase();
            var res = await client.from('banco_preguntas').select('*').limit(1000);
            if (res.error) throw res.error;
            rows = res.data || [];
            bancoState._cache = rows;
        }
        simState._cache = rows;
        var materiasSet = new Set();
        rows.forEach(function (r) {
            var m = campo(r, 'materia');
            if (m) materiasSet.add(m);
        });
        ddEl.innerHTML = '';
        materiasSet.forEach(function (m) {
            var btn = document.createElement('button');
            btn.className = 'banco-dropdown-item';
            btn.textContent = m.toLowerCase();
            btn.onclick = function () { selectSimMateria(m); };
            ddEl.appendChild(btn);
        });
    } catch (e) {
        ddEl.innerHTML = '<div class="banco-loading-opts" style="color:#ef4444;"><i class="fas fa-exclamation-triangle"></i> error: ' + e.message + '</div>';
    }
}

window.toggleSimDropdown = function () {
    var dd = document.getElementById('sim-materia-dropdown');
    var btn = document.getElementById('sim-materia-btn');
    var isOpen = !dd.classList.contains('hidden');
    dd.classList.toggle('hidden', isOpen);
    btn.classList.toggle('open', !isOpen);
};

window.selectSimMateria = function (materia) {
    simState.selectedMateria = materia;
    document.getElementById('sim-materia-text').textContent = materia.toLowerCase();
    document.getElementById('sim-materia-dropdown').classList.add('hidden');
    document.getElementById('sim-materia-btn').classList.remove('open');
    document.getElementById('sim-sum-materia').textContent = materia.toLowerCase();
};

window.setSimMode = function (mode) {
    simState.mode = mode;
    var btnOficial = document.getElementById('sim-mode-oficial');
    var btnCompleto = document.getElementById('sim-mode-completo');
    var btnMateria = document.getElementById('sim-mode-materia');

    if (btnOficial) btnOficial.classList.toggle('sim-mode-active', mode === 'oficial');
    if (btnCompleto) btnCompleto.classList.toggle('sim-mode-active', mode === 'completo');
    if (btnMateria) btnMateria.classList.toggle('sim-mode-active', mode === 'materia');

    var oGroup = document.getElementById('sim-oficial-group');
    var mGroup = document.getElementById('sim-materia-group');

    if (oGroup) oGroup.classList.toggle('hidden', mode !== 'oficial');
    if (mGroup) mGroup.classList.toggle('hidden', mode !== 'materia');

    if (mode === 'completo') {
        simState.selectedMateria = null;
        simState.selectedExamen = null;
        document.getElementById('sim-sum-materia').textContent = 'aleatorio';
    } else if (mode === 'oficial') {
        if (simState.selectedExamen) document.getElementById('sim-sum-materia').textContent = simState.selectedExamen.toLowerCase();
    }
};

window.setSimDuracion = function (min) {
    simState.duracion = min;
    [30, 60, 90, 120].forEach(function (m) {
        var btn = document.getElementById('sim-dur-' + m);
        if (btn) btn.classList.toggle('sim-dur-active', m === min);
    });
    document.getElementById('sim-sum-tiempo').textContent = min + ' min';
};

window.updateSimNQ = function () {
    var val = parseInt(document.getElementById('sim-nq-slider').value);
    simState.nPreguntas = val;
    document.getElementById('sim-nq-value').textContent = val;
    document.getElementById('sim-sum-nq').textContent = val;
};

// ── Iniciar simulacro ──
window.iniciarSimulacro = async function () {
    if (simState.mode === 'materia' && !simState.selectedMateria) {
        showToast('⚠ selecciona una materia primero', 'error');
        return;
    }
    if (simState.mode === 'oficial' && !simState.selectedExamen) {
        showToast('⚠ selecciona un examen primero', 'error');
        return;
    }

    setLoginLoading(true); // Reusar spinner para carga
    try {
        var client = getSupabase();
        var filtradas = [];

        if (simState.mode === 'oficial') {
            // Cargar preguntas específicas del examen oficial ordenadas
            var { data, error } = await client
                .from('simulacros')
                .select('*')
                .eq('nombre', simState.selectedExamen)
                .order('numero_pregunta', { ascending: true });
            if (error) throw error;
            filtradas = data || [];
        } else {
            var rows = simState._cache || bancoState._cache || [];
            if (rows.length === 0) {
                var res = await client.from('banco_preguntas').select('*').limit(1000);
                if (res.error) throw res.error;
                rows = res.data || [];
                bancoState._cache = rows;
            }
            filtradas = rows;
            if (simState.mode === 'materia' && simState.selectedMateria) {
                filtradas = rows.filter(function (r) {
                    return campo(r, 'materia') === simState.selectedMateria;
                });
            }
            // Mezclar si es aleatorio
            filtradas = shuffleArray(filtradas.slice()).slice(0, Math.min(simState.nPreguntas, filtradas.length));
        }

        if (filtradas.length === 0) {
            showToast('⚠ no hay preguntas disponibles', 'error');
            return;
        }

        simState.preguntas = filtradas;
        simState.answers = simState.preguntas.map(function () { return { selected: null }; });
        simState.currentIdx = 0;
        simState.finalized = false;
        simState.secondsLeft = simState.duracion * 60;
        simState.startTimestamp = Date.now();

        // Actualizar header
        document.getElementById('sim-exam-materia').textContent =
            simState.mode === 'oficial' ? simState.selectedExamen.toLowerCase() :
                (simState.mode === 'materia' ? simState.selectedMateria.toLowerCase() : 'simulacro aleatorio');

        document.getElementById('sim-exam-nq-info').textContent = simState.preguntas.length + ' preguntas';
        document.getElementById('sim-total-num').textContent = simState.preguntas.length;

        buildSimCircles();
        showSimScreen('sim-exam');
        renderSimQuestion();
        startSimTimer();

    } catch (e) {
        console.error('Error iniciarSimulacro:', e);
        showToast('⚠ error al cargar el simulacro', 'error');
    } finally {
        setLoginLoading(false);
    }
};

function startSimTimer() {
    clearInterval(simState.timerInterval);
    updateSimTimerDisplay();
    simState.timerInterval = setInterval(function () {
        simState.secondsLeft--;
        updateSimTimerDisplay();
        if (simState.secondsLeft <= 0) {
            clearInterval(simState.timerInterval);
            simState.timerInterval = null;
            showToast('⏰ tiempo agotado — finalizando simulacro', 'info');
            finalizarSimulacro();
        }
    }, 1000);
}

function updateSimTimerDisplay() {
    var s = Math.max(0, simState.secondsLeft);
    var m = Math.floor(s / 60);
    var sec = s % 60;
    var txt = (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    var el = document.getElementById('sim-timer-display');
    var wrap = document.getElementById('sim-timer-wrap');
    if (el) el.textContent = txt;
    if (wrap) {
        wrap.classList.toggle('sim-timer-danger', s <= 120);
    }
}

function renderSimQuestion() {
    var idx = simState.currentIdx;
    var q = simState.preguntas[idx];
    var ans = simState.answers[idx];

    document.getElementById('sim-cur-num').textContent = idx + 1;
    document.getElementById('sim-num-badge').textContent = 'N° ' + (idx + 1);
    document.getElementById('sim-question-text').textContent = campo(q, 'pregunta') || '';
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
        btn.innerHTML =
            '<span class="bq-option-letter">' + letras[i] + '</span>' +
            '<span class="bq-option-text">' + opcion + '</span>';
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
}

function buildSimCircles() {
    var container = document.getElementById('sim-circles');
    if (!container) return;
    container.innerHTML = '';
    simState.preguntas.forEach(function (_, i) {
        var btn = document.createElement('button');
        btn.className = 'bq-circle';
        btn.textContent = i + 1;
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
    if (!confirm('¿salir del simulacro? perderás todo tu progreso.')) return;
    clearInterval(simState.timerInterval);
    simState.timerInterval = null;
    showSimScreen('sim-config');
};

window.finalizarSimulacro = function () {
    if (simState.finalized) return;
    simState.finalized = true;
    clearInterval(simState.timerInterval);
    simState.timerInterval = null;

    var tiempoUsado = simState.duracion * 60 - Math.max(0, simState.secondsLeft);
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
            if (ans.selected === correctIdx) correctas++; else incorrectas++;
        }
    });

    var pct = total > 0 ? Math.round((correctas / total) * 100) : 0;
    var emoji = '😅', title = 'sigue practicando';
    if (pct >= 80) { emoji = '🏆'; title = '¡excelente dominio!'; }
    else if (pct >= 60) { emoji = '👏'; title = '¡muy bien!'; }
    else if (pct >= 40) { emoji = '📚'; title = 'puedes mejorar'; }

    document.getElementById('sim-result-emoji').textContent = emoji;
    document.getElementById('sim-result-title').textContent = title;
    document.getElementById('sim-result-score').textContent =
        correctas + ' de ' + total + ' correctas · ' + pct + '% de acierto';
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

    // Revisión pregunta a pregunta
    var reviewList = document.getElementById('sim-review-list');
    if (reviewList) {
        reviewList.innerHTML = '';
        simState.preguntas.forEach(function (q, i) {
            var ans = simState.answers[i];
            var correctaRaw = (campo(q, 'respuesta_correcta') || 'A').toString().trim().toUpperCase();
            var letrasMap = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4 };
            var correctIdx = letrasMap[correctaRaw] !== undefined ? letrasMap[correctaRaw] : parseInt(correctaRaw) - 1;
            var opciones = [
                campo(q, 'opcion_a'), campo(q, 'opcion_b'),
                campo(q, 'opcion_c'), campo(q, 'opcion_d'),
                campo(q, 'opcion_e')
            ].filter(function (o) { return o && o.toString().trim() !== ''; });
            var isCorrect = ans.selected !== null && ans.selected === correctIdx;
            var sinResp = ans.selected === null;
            var justif = campo(q, 'justificacion') || campo(q, 'explicacion') || campo(q, 'comentario') || '';

            var item = document.createElement('div');
            item.className = 'sim-review-item' + (isCorrect ? ' sim-rev-ok' : sinResp ? ' sim-rev-pending' : ' sim-rev-fail');
            item.innerHTML =
                '<div class="sim-rev-header">' +
                '<span class="sim-rev-num">N° ' + (i + 1) + '</span>' +
                '<span class="sim-rev-badge">' + (isCorrect ? '✓ correcta' : sinResp ? '— sin responder' : '✗ incorrecta') + '</span>' +
                '</div>' +
                '<p class="sim-rev-question">' + (campo(q, 'pregunta') || '') + '</p>' +
                (ans.selected !== null && opciones[ans.selected] ?
                    '<p class="sim-rev-tu-resp">tu respuesta: <strong>' + opciones[ans.selected] + '</strong></p>' : '') +
                '<p class="sim-rev-correcta">respuesta correcta: <strong>' + (opciones[correctIdx] || '—') + '</strong></p>' +
                (justif ? '<p class="sim-rev-justif"><i class="fas fa-lightbulb"></i> ' + justif + '</p>' : '');
            reviewList.appendChild(item);
        });
    }

    // Guardar en historial local
    guardarEnHistorial(pct, correctas, total, tiempoUsado,
        simState.mode === 'materia' ? simState.selectedMateria : 'todas');

    // Sincronizar con la nube para el Panel de Admin
    guardarResultadoSimulacroEnNube({
        titulo: simState.mode === 'oficial' ? (simState.selectedOficial || 'Simulacro Oficial') : 'Simulacro Personalizado',
        materia: simState.mode === 'materia' ? simState.selectedMateria : 'todas',
        porcentaje: pct,
        correctas: correctas,
        incorrectas: incorrectas,
        sinRespuesta: sinResponder,
        tiempoSegundos: tiempoUsado
    });

    showSimScreen('sim-result');
};

function guardarEnHistorial(pct, correctas, total, tiempoSeg, materia) {
    var historial = JSON.parse(localStorage.getItem('pb_historial') || '[]');
    historial.unshift({
        fecha: new Date().toISOString(),
        pct: pct,
        correctas: correctas,
        total: total,
        tiempoSeg: tiempoSeg,
        materia: materia || 'todas'
    });
    if (historial.length > 50) historial = historial.slice(0, 50);
    localStorage.setItem('pb_historial', JSON.stringify(historial));
}

function showSimScreen(which) {
    var screens = ['sim-config', 'sim-exam', 'sim-result'];
    screens.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', id !== which);
    });
}


// ══════════════════════════════════════════════════════
// ██  EVALUACIÓN  ██
// ══════════════════════════════════════════════════════

window.openEvaluacion = function () {
    showScreen('evaluacion-screen');
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }
    renderEvaluacion();
};

function renderEvaluacion() {
    var historial = JSON.parse(localStorage.getItem('pb_historial') || '[]');

    // Métricas globales
    var totalSims = historial.length;
    var mejor = totalSims > 0 ? Math.max.apply(null, historial.map(function (h) { return h.pct; })) : null;
    var promedio = totalSims > 0
        ? Math.round(historial.reduce(function (acc, h) { return acc + h.pct; }, 0) / totalSims)
        : null;
    var tiempoTotal = historial.reduce(function (acc, h) { return acc + (h.tiempoSeg || 0); }, 0);
    var tiempoMin = Math.round(tiempoTotal / 60);

    document.getElementById('eval-total-sims').textContent = totalSims;
    document.getElementById('eval-mejor').textContent = mejor !== null ? mejor + '%' : '—%';
    document.getElementById('eval-promedio').textContent = promedio !== null ? promedio + '%' : '—%';
    document.getElementById('eval-tiempo-total').textContent = tiempoMin + ' min';

    // Rendimiento por materia
    var materiasMap = {};
    historial.forEach(function (h) {
        var m = h.materia || 'todas';
        if (!materiasMap[m]) materiasMap[m] = { pcts: [], total: 0, correctas: 0 };
        materiasMap[m].pcts.push(h.pct);
        materiasMap[m].total += h.total || 0;
        materiasMap[m].correctas += h.correctas || 0;
    });

    var matList = document.getElementById('eval-materias-list');
    if (Object.keys(materiasMap).length === 0) {
        matList.innerHTML = '<p class="eval-empty"><i class="fas fa-inbox"></i> aún no hay evaluaciones registradas.<br>completa un simulacro o banco de preguntas.</p>';
    } else {
        matList.innerHTML = '';
        Object.keys(materiasMap).forEach(function (m) {
            var data = materiasMap[m];
            var avgPct = Math.round(data.pcts.reduce(function (a, b) { return a + b; }, 0) / data.pcts.length);
            var color = avgPct >= 70 ? '#22c55e' : avgPct >= 40 ? '#f59e0b' : '#ef4444';
            var item = document.createElement('div');
            item.className = 'eval-materia-item';
            item.innerHTML =
                '<div class="eval-materia-top">' +
                '<span class="eval-materia-name">' + m.toLowerCase() + '</span>' +
                '<span class="eval-materia-pct" style="color:' + color + '">' + avgPct + '%</span>' +
                '</div>' +
                '<div class="eval-materia-bar-wrap">' +
                '<div class="eval-materia-bar" style="width:' + avgPct + '%;background:' + color + '"></div>' +
                '</div>' +
                '<span class="eval-materia-sub">' + data.pcts.length + ' sesión(es) · ' +
                data.correctas + ' de ' + data.total + ' correctas</span>';
            matList.appendChild(item);
        });
    }

    // Historial de sesiones
    var histEl = document.getElementById('eval-historial');
    if (historial.length === 0) {
        histEl.innerHTML = '<p class="eval-empty"><i class="fas fa-inbox"></i> sin sesiones registradas todavía.</p>';
    } else {
        histEl.innerHTML = '';
        historial.forEach(function (h, i) {
            var fecha = new Date(h.fecha);
            var fechaStr = fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
            var horaStr = fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            var color = h.pct >= 70 ? '#22c55e' : h.pct >= 40 ? '#f59e0b' : '#ef4444';
            var minUsados = Math.round((h.tiempoSeg || 0) / 60);
            var card = document.createElement('div');
            card.className = 'eval-hist-card';
            card.innerHTML =
                '<div class="eval-hist-left">' +
                '<span class="eval-hist-num">#' + (i + 1) + '</span>' +
                '<div>' +
                '<span class="eval-hist-materia">' + (h.materia || 'todas').toLowerCase() + '</span>' +
                '<span class="eval-hist-fecha">' + fechaStr + ' · ' + horaStr + '</span>' +
                '</div>' +
                '</div>' +
                '<div class="eval-hist-right">' +
                '<span class="eval-hist-pct" style="color:' + color + '">' + h.pct + '%</span>' +
                '<span class="eval-hist-detail">' + h.correctas + '/' + h.total + (h.tiempoSeg > 0 ? ' · ' + minUsados + ' min' : ' · banco') + '</span>' +
                '</div>';
            histEl.appendChild(card);
        });
    }
}


// ══════════════════════════════════════════════════════
// ██  SIDEBAR DESKTOP TOGGLE  ██  (consolidated — do not duplicate)
// ══════════════════════════════════════════════════════


// ══════════════════════════════════════════════════════
// ██  VIDEOCLASES  ██
// Tabla Supabase: videoclases
// Columnas: TITULO, DESCRIPCION, URL_VIDEO, MATERIA, TEMA, DURACION, MINIATURA
// ══════════════════════════════════════════════════════

var vcState = {
    allVideos: [],
    filteredVideos: [],
    selectedMateria: null
};

window.openVideoclases = function () {
    showScreen('videoclases-screen');
    closeMobileSidebar();
    loadVideoclases();
};

async function loadVideoclases() {
    setVcState('loading');
    try {
        var client = getSupabase();
        var res = await client.from('videoclases').select('*').order('MATERIA', { ascending: true });
        if (res.error) throw res.error;
        vcState.allVideos = res.data || [];
        populateVcMaterias();
        filterVideoclases();
    } catch (e) {
        setVcState('empty');
        console.warn('[Videoclases] Error:', e.message);
    }
}

function populateVcMaterias() {
    var dd = document.getElementById('vc-materia-dropdown');
    if (!dd) return;
    var materias = new Set();
    vcState.allVideos.forEach(function (v) {
        var m = campo(v, 'materia');
        if (m) materias.add(m);
    });
    dd.innerHTML = '';
    var allBtn = document.createElement('button');
    allBtn.className = 'banco-dropdown-item all-option';
    allBtn.textContent = 'todas las materias';
    allBtn.onclick = function () { selectVcMateria(null); };
    dd.appendChild(allBtn);
    materias.forEach(function (m) {
        var btn = document.createElement('button');
        btn.className = 'banco-dropdown-item';
        btn.textContent = m.toLowerCase();
        btn.onclick = function () { selectVcMateria(m); };
        dd.appendChild(btn);
    });
}

window.toggleVcDropdown = function () {
    var dd = document.getElementById('vc-materia-dropdown');
    var btn = document.getElementById('vc-materia-btn');
    if (!dd || !btn) return;
    var isOpen = !dd.classList.contains('hidden');
    dd.classList.toggle('hidden', isOpen);
    btn.classList.toggle('open', !isOpen);
};

window.selectVcMateria = function (materia) {
    vcState.selectedMateria = materia;
    var el = document.getElementById('vc-materia-text');
    if (el) el.textContent = materia ? materia.toLowerCase() : 'todas las materias';
    var dd = document.getElementById('vc-materia-dropdown');
    var btn = document.getElementById('vc-materia-btn');
    if (dd) dd.classList.add('hidden');
    if (btn) btn.classList.remove('open');
    filterVideoclases();
};

window.filterVideoclases = function () {
    var q = ((document.getElementById('vc-search-input') || {}).value || '').toLowerCase();
    vcState.filteredVideos = vcState.allVideos.filter(function (v) {
        var matchMat = !vcState.selectedMateria || campo(v, 'materia') === vcState.selectedMateria;
        var titulo = (campo(v, 'titulo') || '').toLowerCase();
        var desc = (campo(v, 'descripcion') || '').toLowerCase();
        var matchQ = !q || titulo.includes(q) || desc.includes(q);
        return matchMat && matchQ;
    });
    renderVcGrid();
};

function renderVcGrid() {
    setVcState(vcState.filteredVideos.length === 0 ? 'empty' : 'grid');
    var grid = document.getElementById('vc-grid');
    if (!grid || vcState.filteredVideos.length === 0) return;
    grid.innerHTML = '';
    vcState.filteredVideos.forEach(function (v) {
        var titulo = campo(v, 'titulo') || 'Sin título';
        var desc = campo(v, 'descripcion') || '';
        var materia = campo(v, 'materia') || '';
        var tema = campo(v, 'tema') || '';
        var duracion = campo(v, 'duracion') || '';
        var miniatura = campo(v, 'miniatura') || '';
        var urlVideo = campo(v, 'url_video') || '';
        var thumbSrc = miniatura || getYtThumbnail(urlVideo);

        var card = document.createElement('div');
        card.className = 'vc-card';
        card.onclick = function () { openVcModal(v); };
        card.innerHTML =
            '<div class="vc-thumb-wrap">' +
            (thumbSrc
                ? '<img class="vc-thumb" src="' + thumbSrc + '" alt="' + titulo + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                '<div class="vc-thumb-placeholder" style="display:none"><i class="fas fa-play-circle"></i></div>'
                : '<div class="vc-thumb-placeholder"><i class="fas fa-play-circle"></i></div>') +
            '<div class="vc-play-overlay"><i class="fas fa-play"></i></div>' +
            (duracion ? '<span class="vc-duration">' + duracion + '</span>' : '') +
            '</div>' +
            '<div class="vc-card-body">' +
            (materia ? '<span class="vc-card-materia">' + materia.toLowerCase() + '</span>' : '') +
            '<h3 class="vc-card-title">' + titulo + '</h3>' +
            (desc ? '<p class="vc-card-desc">' + desc + '</p>' : '') +
            (tema ? '<span class="vc-card-tema"><i class="fas fa-tag"></i> ' + tema.toLowerCase() + '</span>' : '') +
            '</div>';
        grid.appendChild(card);
    });
}

function getYtThumbnail(url) {
    if (!url) return '';
    // Bunny.net: no necesita thumbnail desde URL (se usa campo MINIATURA)
    if (url.includes('mediadelivery.net') || url.includes('b-cdn.net')) return '';
    var m = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return (m && m[1]) ? 'https://img.youtube.com/vi/' + m[1] + '/hqdefault.jpg' : '';
}

function getEmbedUrl(url) {
    if (!url) return '';
    // Bunny.net: pasar la URL de embed tal cual (iframe.mediadelivery.net)
    if (url.includes('iframe.mediadelivery.net') || url.includes('mediadelivery.net/embed')) return url;
    // Bunny HLS / CDN directa → convertir a embed
    var bunnyId = url.match(/b-cdn\.net\/([a-f0-9\-]{36})/);
    if (bunnyId && bunnyId[1]) return 'https://iframe.mediadelivery.net/embed/643021/' + bunnyId[1];
    // YouTube embed ya listo
    if (url.includes('youtube.com/embed/') || url.includes('drive.google.com')) return url;
    // YouTube watch URL
    var m = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return (m && m[1]) ? 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1' : url;
}

// Alias para retrocompatibilidad
var getYtEmbedUrl = getEmbedUrl;

window.openVcModal = function (v) {
    var modal = document.getElementById('vc-modal');
    if (!modal) return;
    document.getElementById('vc-modal-title').textContent = campo(v, 'titulo') || '';
    document.getElementById('vc-modal-desc').textContent = campo(v, 'descripcion') || '';
    document.getElementById('vc-modal-materia').textContent = (campo(v, 'materia') || '').toLowerCase();
    var embedUrl = getEmbedUrl(campo(v, 'url_video') || '');
    var iframe = document.getElementById('vc-iframe');
    if (iframe) {
        iframe.src = embedUrl;
        // Bunny.net requiere allow="autoplay" para reproducción automática
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Registrar visualización en la nube (asumimos 100% de progreso al abrirlo)
    registrarVideoVistoEnNube(
        campo(v, 'id') || campo(v, 'url_video') || campo(v, 'titulo'), 
        campo(v, 'titulo') || 'Video sin título', 
        campo(v, 'materia') || 'General', 
        100 
    );

};

window.closeVcModal = function (e) {
    var modal = document.getElementById('vc-modal');
    if (!modal) return;
    if (e && e.target !== modal) return;
    modal.classList.add('hidden');
    var iframe = document.getElementById('vc-iframe');
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
};

function setVcState(state) {
    var loading = document.getElementById('vc-loading');
    var grid = document.getElementById('vc-grid');
    var empty = document.getElementById('vc-empty');
    if (loading) loading.classList.toggle('hidden', state !== 'loading');
    if (grid) grid.classList.toggle('hidden', state !== 'grid');
    if (empty) empty.classList.toggle('hidden', state !== 'empty');
}


// ══════════════════════════════════════════════════════
// ██  INTOCABLES + MAPAS MENTALES  ██
// Tabla Supabase: mapas_mentales
// Columnas: TITULO, MATERIA, URL_IMAGEN, DESCRIPCION, FECHA
// ══════════════════════════════════════════════════════

var mmState = {
    allMapas: [],
    filteredMapas: [],
    selectedMateria: null,
    currentTab: 'mapas'
};

window.openIntocables = function () {
    showScreen('intocables-screen');
    closeMobileSidebar();
    switchIntocTab('mapas');
    loadMapasMentales();
};

window.switchIntocTab = function (tab) {
    mmState.currentTab = tab;
    ['mapas', 'conceptos', 'formulas'].forEach(function (t) {
        var btn = document.getElementById('tab-' + t);
        var panel = document.getElementById('intoc-panel-' + t);
        if (btn) btn.classList.toggle('intoc-tab-active', t === tab);
        if (panel) panel.classList.toggle('hidden', t !== tab);
    });
};

async function loadMapasMentales() {
    setMmState('loading');
    try {
        var client = getSupabase();
        var res = await client.from('mapas_mentales').select('*').order('MATERIA', { ascending: true });
        if (res.error) throw res.error;
        mmState.allMapas = res.data || [];
        populateMmMaterias();
        updateIntocStats();
        filterMapas();
    } catch (e) {
        setMmState('empty');
        console.warn('[MapasMentales] Error:', e.message);
    }
}

function populateMmMaterias() {
    var dd = document.getElementById('mm-materia-dropdown');
    if (!dd) return;
    var materias = new Set();
    mmState.allMapas.forEach(function (m) {
        var mat = campo(m, 'materia');
        if (mat) materias.add(mat);
    });
    dd.innerHTML = '';
    var allBtn = document.createElement('button');
    allBtn.className = 'banco-dropdown-item all-option';
    allBtn.textContent = 'todas las materias';
    allBtn.onclick = function () { selectMmMateria(null); };
    dd.appendChild(allBtn);
    materias.forEach(function (m) {
        var btn = document.createElement('button');
        btn.className = 'banco-dropdown-item';
        btn.textContent = m.toLowerCase();
        btn.onclick = function () { selectMmMateria(m); };
        dd.appendChild(btn);
    });
}

window.toggleMmDropdown = function () {
    var dd = document.getElementById('mm-materia-dropdown');
    var btn = document.getElementById('mm-materia-btn');
    if (!dd || !btn) return;
    var isOpen = !dd.classList.contains('hidden');
    dd.classList.toggle('hidden', isOpen);
    btn.classList.toggle('open', !isOpen);
};

window.selectMmMateria = function (materia) {
    mmState.selectedMateria = materia;
    var el = document.getElementById('mm-materia-text');
    if (el) el.textContent = materia ? materia.toLowerCase() : 'todas las materias';
    var dd = document.getElementById('mm-materia-dropdown');
    var btn = document.getElementById('mm-materia-btn');
    if (dd) dd.classList.add('hidden');
    if (btn) btn.classList.remove('open');
    filterMapas();
};

window.filterMapas = function () {
    var q = ((document.getElementById('mm-search-input') || {}).value || '').toLowerCase();
    mmState.filteredMapas = mmState.allMapas.filter(function (m) {
        var matchMat = !mmState.selectedMateria || campo(m, 'materia') === mmState.selectedMateria;
        var titulo = (campo(m, 'titulo') || '').toLowerCase();
        var matchQ = !q || titulo.includes(q);
        return matchMat && matchQ;
    });
    renderMmGrid();
};

function renderMmGrid() {
    setMmState(mmState.filteredMapas.length === 0 ? 'empty' : 'grid');
    var grid = document.getElementById('mm-grid');
    if (!grid || mmState.filteredMapas.length === 0) return;
    grid.innerHTML = '';
    mmState.filteredMapas.forEach(function (m) {
        var titulo = campo(m, 'titulo') || 'Sin título';
        var materia = campo(m, 'materia') || '';
        var urlImg = campo(m, 'url_imagen') || campo(m, 'url_image') || '';
        var desc = campo(m, 'descripcion') || '';

        var card = document.createElement('div');
        card.className = 'mm-card';
        card.onclick = function () { openMmLightbox(m); };
        card.innerHTML =
            '<div class="mm-card-thumb">' +
            (urlImg
                ? '<img src="' + urlImg + '" alt="' + titulo + '" class="mm-card-img" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'">' +
                '<div class="mm-card-img-placeholder" style="display:none"><i class="fas fa-project-diagram"></i></div>'
                : '<div class="mm-card-img-placeholder"><i class="fas fa-project-diagram"></i></div>') +
            '<div class="mm-zoom-overlay"><i class="fas fa-expand"></i></div>' +
            '</div>' +
            '<div class="mm-card-body">' +
            (materia ? '<span class="mm-card-materia">' + materia.toLowerCase() + '</span>' : '') +
            '<h3 class="mm-card-title">' + titulo + '</h3>' +
            (desc ? '<p class="mm-card-desc">' + desc + '</p>' : '') +
            '</div>';
        grid.appendChild(card);
    });

}
function updateIntocStats() {
    var mapasEl = document.getElementById('intoc-stat-mapas');
    var matEl = document.getElementById('intoc-stat-materias');
    if (mapasEl) mapasEl.textContent = mmState.allMapas.length;
    if (matEl) {
        var mats = new Set(mmState.allMapas.map(function (m) { return campo(m, 'materia'); }).filter(Boolean));
        matEl.textContent = mats.size;
    }
}

window.openMmLightbox = function (m) {
    var lb = document.getElementById('mm-lightbox');
    if (!lb) return;
    var urlImg = campo(m, 'url_imagen') || campo(m, 'url_image') || '';
    document.getElementById('mm-lb-img').src = urlImg;
    document.getElementById('mm-lb-title').textContent = campo(m, 'titulo') || '';
    document.getElementById('mm-lb-materia').textContent = (campo(m, 'materia') || '').toLowerCase();
    document.getElementById('mm-lb-desc').textContent = campo(m, 'descripcion') || '';
    var dlLink = document.getElementById('mm-lb-download');
    if (dlLink) dlLink.href = urlImg;
    lb.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeMmLightbox = function (e) {
    var lb = document.getElementById('mm-lightbox');
    if (!lb) return;
    if (e && e.target !== lb) return;
    lb.classList.add('hidden');
    document.body.style.overflow = '';
};

function setMmState(state) {
    var loading = document.getElementById('mm-loading');
    var grid = document.getElementById('mm-grid');
    var empty = document.getElementById('mm-empty');
    if (loading) loading.classList.toggle('hidden', state !== 'loading');
    if (grid) grid.classList.toggle('hidden', state !== 'grid');
    if (empty) empty.classList.toggle('hidden', state !== 'empty');
}

// Cerrar sidebar en mobile (helper compartido)
function closeMobileSidebar() {
    if (window.innerWidth <= 768) {
        var s = document.getElementById('sidebar');
        var o = document.getElementById('overlay');
        if (s) s.classList.remove('open');
        if (o) o.classList.remove('active');
        document.body.classList.remove('sidebar-open');
}
    }

// ══════════════════════════════════════════════
// ██  ARRANQUE DE LA APLICACIÓN  ██
// ══════════════════════════════════════════════
// initAuth() se llama dentro del DOMContentLoaded principal (arriba).
// NOTA: NO duplicar aquí — causaría doble listener onAuthStateChange.

// ══════════════════════════════════════════════════════
// ██  SINCRONIZACIÓN CON PANEL DE ADMINISTRADOR  ██
// ══════════════════════════════════════════════════════

async function guardarResultadoSimulacroEnNube(resultado) {
    if (!currentUser) return;
    try {
        const sb = getSupabase();
        const { error } = await sb.from('resultados_simulacros').insert({
            user_id: currentUser.id,
            user_email: currentUser.email,
            user_name: (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email.split('@')[0],
            simulacro_titulo: resultado.titulo,
            materia: resultado.materia,
            porcentaje: resultado.porcentaje,
            correctas: resultado.correctas,
            incorrectas: resultado.incorrectas,
            sin_respuesta: resultado.sinRespuesta,
            tiempo_segundos: resultado.tiempoSegundos
        });
        if (error) console.error('[Simulacro] Error guardando resultado:', error.message);
    } catch (e) {
        console.warn('[Simulacro] Error fatal en la nube:', e);
    }
}

async function guardarResultadoBancoEnNube(resultado) {
    if (!currentUser) return;
    try {
        const sb = getSupabase();
        const { error } = await sb.from('resultados_banco').insert({
            user_id: currentUser.id,
            user_email: currentUser.email,
            user_name: (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email.split('@')[0],
            materia: resultado.materia,
            tema: resultado.tema,
            dificultad: resultado.dificultad,
            total: resultado.total,
            correctas: resultado.correctas,
            incorrectas: resultado.incorrectas,
            porcentaje: resultado.porcentaje
        });
        if (error) console.error('[Banco] Error guardando resultado:', error.message);
    } catch (e) {
        console.warn('[Banco] Error fatal en la nube:', e);
    }
}

async function registrarVideoVistoEnNube(videoId, titulo, materia, progresoPct) {
    if (!currentUser || !videoId) return;
    try {
        const sb = getSupabase();
        const { error } = await sb.from('progreso_videoclases').upsert({
            user_id: currentUser.id,
            user_email: currentUser.email,
            user_name: (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email.split('@')[0],
            video_id: videoId,
            video_titulo: titulo,
            materia: materia,
            progreso_pct: progresoPct,
            visto: progresoPct >= 90,
            fecha_visto: new Date().toISOString()
        }, { onConflict: 'user_id,video_id' }); 
        if (error) console.error('[Videoclases] Error guardando progreso:', error.message);
    } catch (e) {
        console.warn('[Videoclases] Error fatal en la nube:', e);
    }
}

async function sincronizarPerfilEnNube() {
    if (!currentUser) return;
    try {
        const sb = getSupabase();
        const name = (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email.split('@')[0];
        
        // Intentar registrar/actualizar en una tabla de perfiles que el admin pueda leer
        // Probamos con 'user_profiles' que es la que el admin.js busca primero
        const { error } = await sb.from('user_profiles').upsert({
            user_id: currentUser.id,
            email: currentUser.email,
            full_name: name,
            last_seen: new Date().toISOString()
        }, { onConflict: 'user_id' });
        
        if (error) {
            // Si falla user_profiles, intentar en 'profiles' (fallback)
            await sb.from('profiles').upsert({
                id: currentUser.id,
                email: currentUser.email,
                full_name: name,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
        }
    } catch (e) {
        console.warn('[Auth] Error sincronizando perfil:', e);
    }
}









