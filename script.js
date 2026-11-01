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
let _supabaseSdkPromise = null;

function loadScriptOnce(src) {
    return new Promise(function(resolve, reject) {
        const existing = Array.from(document.scripts).find(function(script) { return script.src === src; });
        if (existing && existing.dataset.loaded === '1') {
            resolve();
            return;
        }

        const script = existing || document.createElement('script');
        let done = false;
        const timer = setTimeout(function() {
            if (done) return;
            done = true;
            reject(new Error('timeout cargando ' + src));
        }, 8000);

        script.onload = function() {
            if (done) return;
            done = true;
            clearTimeout(timer);
            script.dataset.loaded = '1';
            resolve();
        };
        script.onerror = function() {
            if (done) return;
            done = true;
            clearTimeout(timer);
            reject(new Error('no se pudo cargar ' + src));
        };

        if (!existing) {
            script.src = src;
            script.async = true;
            document.head.appendChild(script);
        }
    });
}

async function ensureSupabaseSdk() {
    if (window.supabase && window.supabase.createClient) return window.supabase;
    if (!_supabaseSdkPromise) {
        _supabaseSdkPromise = loadScriptOnce('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2')
            .catch(function() {
                return loadScriptOnce('https://unpkg.com/@supabase/supabase-js@2');
            })
            .then(function() {
                if (!window.supabase || !window.supabase.createClient) {
                    throw new Error('Supabase SDK no disponible');
                }
                return window.supabase;
            });
    }
    return _supabaseSdkPromise;
}

function getSupabase() {
    if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Supabase config incompleta');
    if (!window.supabase || !window.supabase.createClient) throw new Error('Supabase SDK no cargado');
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
    if (new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery") {
        window.location.replace("/recuperar.html" + window.location.hash);
        return;
    }
    document.body.classList.add('login-active');

    var checker = document.createElement('div');
    checker.className = 'login-checking';
    checker.innerHTML = '<div class="login-checking-spinner"></div>' +
        '<span class="login-checking-text">verificando sesión...</span>';
    document.body.appendChild(checker);

    try {
        await ensureSupabaseSdk();
        var client = getSupabase();
        if (!client) throw new Error('Supabase client failed to initialize');
        var res = await client.auth.getSession();
        var session = res.data.session;

        if (session && session.user) {
            currentUser = session.user;
            await enterApp(currentUser);
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

    try {
        getSupabase().auth.onAuthStateChange(function (event, session) {
            if (event === 'INITIAL_SESSION') return;
            if (event === 'SIGNED_IN' && session && session.user) {
                currentUser = session.user;
                setTimeout(function () { enterApp(currentUser); }, 0);
            } else if (event === 'SIGNED_OUT') {
                currentUser = null;
                showLoginScreen();
            }
        });
    } catch (e) {
        console.warn('No se pudo registrar auth listener:', e.message);
    }
}

/** Muestra login y oculta app */
function showLoginScreen() {
    window.StudentResults?.clear();
    if (window.OfficialFlashcards) OfficialFlashcards.clear();
    if (window.FlashcardWorkspace) FlashcardWorkspace.clear();
    verifiedCampusUserId = null;
    if (flashcardReviewTimer) clearTimeout(flashcardReviewTimer);
    flashcardReviewTimer = null;
    flashcardTopicCards = [];
    deck = [];
    currentIndex = 0;
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
let campusEntry = null;
let verifiedCampusUserId = null;
function enterApp(user) {
    if (!user || currentUser?.id !== user.id) return Promise.resolve();
    if (verifiedCampusUserId === user?.id && !document.body.classList.contains('login-active')) return Promise.resolve();
    if (campusEntry) return campusEntry;
    campusEntry = (async function () {
        try {
            var client = getSupabase();
            var isStudent = Boolean(user && user.email && !ADMIN_EMAILS.includes(user.email.toLowerCase()));
            if (isStudent) {
                if (typeof DeviceGuard === 'undefined') throw new Error('No pudimos verificar tus dispositivos. Recarga la página.');
                var device = await DeviceGuard.activateDevice(client, user.email);
                if (!device.ok) {
                    if (device.code === 'DEVICE_LIMIT') {
                        await client.auth.signOut({ scope: 'local' });
                        currentUser = null;
                    }
                    throw new Error(device.error || 'No pudimos verificar este dispositivo.');
                }
            }
            await CampusAccess.resolve(client);
            if (currentUser?.id !== user.id) return;
            flashcardsCache = null;
            bancoState._cache = [];
            bancoState.allPreguntas = [];
            bancoState.preguntas = [];
            simState._cache = [];
            simState._oficialesCache = [];
            simState.preguntas = [];
            showScreen('home-screen');
            enterVerifiedApp(user);
        } catch (error) {
            showLoginScreen();
            showLoginError(error.message);
        } finally { campusEntry = null; }
    })();
    return campusEntry;
}
function enterVerifiedApp(user) {
    verifiedCampusUserId = user.id;
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

    if (new URLSearchParams(window.location.search).get('seccion') === 'atlas' && typeof openAtlas === 'function') openAtlas();
    else if (new URLSearchParams(window.location.search).get('simulacro') && window.openRequestedSimulation) window.openRequestedSimulation().catch(function(error) { showToast(error.message, 'error'); });
    else restoreCampusAfterPlans();
    if (window.openRequestedMindmap) window.openRequestedMindmap().catch(function(error) { console.warn("No se pudo abrir el mapa solicitado", error); });


    // ═══ DEVICE GUARD: ya se verificó antes de mostrar el campus ═══
    var _isAdmin = Boolean(user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()));
    if (typeof DeviceGuard !== 'undefined' && user && user.email && !_isAdmin) {
        var dgClient = getSupabase();
        DeviceGuard.startChecking(dgClient, function(reason) {
            alert('🔒 Sesión cerrada: ' + reason);
            window.handleLogout();
        });
    }
}

async function restoreCampusAfterPlans() {
    if (new URLSearchParams(window.location.search).get('volver') !== 'campus') return;
    var saved = null;
    try {
        saved = JSON.parse(sessionStorage.getItem('alcocer_plan_return') || 'null');
        sessionStorage.removeItem('alcocer_plan_return');
        history.replaceState({}, document.title, window.location.pathname);
    } catch (_) { return; }
    if (!saved) return;
    if (saved.screen !== 'mapas') {
        const destinations = {
            'resumenes-screen': () => openResumenes(),
            'study-library': () => openStudyLibrary(),
            'resource-browser': () => openGameMenu(),
            'banco-screen': () => openBanco(),
            'past-exams-screen': () => openPastExams(),
            'simulacro-screen': () => openSimulacro(),
            'intocables-hub-screen': () => openIntocables()
        };
        if (destinations[saved.screen]) await destinations[saved.screen]();
        return;
    }
    showScreen('intocables-screen');
    switchIntocTab('mapas');
    await loadMapasMentales();
    var search = document.getElementById('mm-search-input');
    if (search) search.value = saved.search || '';
    selectMmMateria(saved.materia || null);
    if (saved.tema) selectMmTema(saved.tema);
    requestAnimationFrame(function () {
        requestAnimationFrame(function () { window.scrollTo(0, Math.max(0, Number(saved.scrollY) || 0)); });
    });
}

/** handleLogin */
window.handleLogin = async function (e) {
    e.preventDefault();
    hideLoginError();

    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;

    if (!email || !password) { showLoginError('completa todos los campos'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showLoginError('formato de correo inválido'); return; }
    if (password.length < 6) { showLoginError('la contraseña debe tener al menos 6 caracteres'); return; }

    setLoginLoading(true);
    try {
        await ensureSupabaseSdk();
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
        await enterApp(currentUser);
    } catch (err) {
        console.error('Error de login:', err);
        showLoginError('error de conexión. revisa tu internet.');
    } finally {
        setLoginLoading(false);
    }
};

/** handleLogout */
window.handleLogout = function() {
        // 0. Detener verificación de dispositivo
    if (typeof DeviceGuard !== 'undefined') DeviceGuard.stopChecking();

    // 1. Limpiar datos locales inmediatamente
    // Conservar las fechas de repaso, separadas por cuenta, al cerrar sesión.
    Object.keys(localStorage).forEach(function (key) {
        if (key !== 'alcocer_device_id' && !key.startsWith('srs_v2_')) localStorage.removeItem(key);
    });
    sessionStorage.clear();

    // 2. Intentar cerrar sesión en Supabase
    try {
        getSupabase().auth.signOut({ scope: 'local' });
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
function normalizeDbText(value) {
    return String(value || '').trim().toUpperCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');
}

function isMissingSupabaseTableError(error) {
    const msg = String((error && (error.message || error.details || error.hint)) || '').toLowerCase();
    return error && (
        error.code === '42P01' ||
        error.code === 'PGRST205' ||
        msg.indexOf('could not find the table') !== -1 ||
        msg.indexOf('does not exist') !== -1 ||
        msg.indexOf('schema cache') !== -1
    );
}

let deck = [];
let currentIndex = 0;
let flashcardTopicCards = [];
let flashcardReviewTimer = null;
let flashcardRatingPending = false;
let totalReviews = 0;
let temasVistos = new Set();
let ultimaMateria = '—';
let gamesPlayed = 0;
let flashcardsCache = null;
const missingCloudTables = {};

// ──────────────────────────────────────────────
// TIPS DE ESTUDIO
// ──────────────────────────────────────────────
const tips = [
    'Antes de revelar una tarjeta, intenta decir la respuesta completa con tus propias palabras.',
    'Si dudas entre dos respuestas, anota la diferencia y compruébala en el material del tema.',
    'Después de un simulacro, abre Mis evaluaciones y elige una materia para volver a practicar.',
    'Abre un mapa, cierra la imagen e intenta explicar cómo se relacionan sus ramas.',
    'Al terminar un tema, prueba unas preguntas para comprobar qué puedes responder sin mirar.'
];

// ──────────────────────────────────────────────
// NAVEGACIÓN ENTRE PANTALLAS
// ──────────────────────────────────────────────
let currentCampusScreen = 'home-screen';
const campusScreenHistory = [];
function showScreen(screenId, fromBack) {
    if (screenId !== 'suficiencia-screen' && window.Sufficiency?.beforeLeave() === false) return false;
    if (screenId !== 'simulacro-screen' && typeof simState !== 'undefined' && simState && simState.timerInterval) {
        if (!confirm('Hay un examen en curso. ¿Deseas salir y descartar las respuestas?')) return false;
        clearInterval(simState.timerInterval); simState.timerInterval = null;
        simState.preguntas = []; simState.answers = [];
    }
    if (screenId !== currentCampusScreen) {
        if (!fromBack) campusScreenHistory.push(currentCampusScreen);
        currentCampusScreen = screenId;
    }
    const trackingSections = {'suficiencia-screen':'suficiencia','study-library':'flashcards','intocables-screen':'mapas','atlas-screen':'atlas','resumenes-screen':'resumenes','intocables-hub-screen':'intocables','banco-screen':'banco','past-exams-screen':'examenes','simulacro-screen':'simulacros','evaluacion-screen':'evaluaciones','game-quiz':'quiz','game-hangman':'ahorcado'};
    if (trackingSections[screenId]) window.CampusTracking?.record(trackingSections[screenId],'opened','','','menu');
    closeMobileSidebar();
    if (screenId !== 'study-area' && flashcardReviewTimer) {
        clearTimeout(flashcardReviewTimer);
        flashcardReviewTimer = null;
    }
    if (screenId !== 'game-quiz' && quizTimer) clearInterval(quizTimer);
    window.scrollTo({top:0,behavior:'instant'});
    const screens = ['student-results-screen', 'suficiencia-screen', 'home-screen', 'study-library', 'resource-browser', 'study-area', 'game-quiz', 'game-hangman', 'banco-screen', 'simulacro-screen', 'evaluacion-screen', 'videoclases-screen', 'intocables-screen', 'intocables-hub-screen', 'resumenes-screen', 'past-exams-screen', 'atlas-screen'];
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
    if (screenId === 'study-area') refreshFlashcardReviews();
    return true;
}

window.openResumenes = function () {
    showScreen('resumenes-screen');
};

window.goHome = function () {
    const bancoEnProgreso = bancoState && bancoState.preguntas.length > 0 &&
        !bancoState.finalized &&
        bancoState.answers.some(function (a) { return a.selected !== null; });
    if (bancoEnProgreso) {
        if (!confirm('¿salir del banco? perderás tu progreso.')) return;
    }
    if (showScreen('home-screen', true) === false) return;
    campusScreenHistory.length = 0;
    updateHomeStats();
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
};

window.goBack = function () {
    const bancoEnProgreso = currentCampusScreen === 'banco-screen' && bancoState &&
        bancoState.preguntas.length > 0 && !bancoState.finalized &&
        bancoState.answers.some(function (a) { return a.selected !== null; });
    if (bancoEnProgreso && !confirm('¿salir del banco? perderás tu progreso.')) return;
    const previous = campusScreenHistory.at(-1) || 'home-screen';
    if (showScreen(previous, true) === false) return;
    campusScreenHistory.pop();
    if (previous === 'home-screen') updateHomeStats();
};

function updateHomeStats() {
    const welcome = document.getElementById('welcome-name');
    const profile = document.getElementById('sidebar-user-name');
    if (welcome && profile) welcome.textContent = profile.textContent.trim().split(/\s+/)[0] || 'bienvenido';
    const elR = document.getElementById('home-repasos');
    const elC = document.getElementById('home-cards');
    const elT = document.getElementById('home-temas');
    const elG = document.getElementById('home-games');
    if (elR) elR.textContent = totalReviews;
    if (elC) elC.textContent = Math.min(currentIndex, deck.length);
    if (elT) elT.textContent = temasVistos.size;
    if (elG) elG.textContent = gamesPlayed;
    const progressFill = document.getElementById('study-progress-fill');
    if (progressFill) {
        const total = Math.max(deck.length, 1);
        const pct = Math.min(100, Math.round((Math.min(currentIndex + 1, deck.length) / total) * 100));
        progressFill.style.width = pct + '%';
        const progressPct = document.getElementById('study-progress-percent');
        if (progressPct) progressPct.textContent = pct + '%';
    }

    // Tip aleatorio
    const tipEl = document.getElementById('tip-text');
    if (tipEl) tipEl.textContent = tips[Math.floor(Math.random() * tips.length)];
}

// ──────────────────────────────────────────────
// TOGGLE PADRE: abre/cierra el menú "flashcards"
// ──────────────────────────────────────────────
window.toggleFlashcards = function () { openStudyLibrary(); };

// ──────────────────────────────────────────────
// TOGGLE MATERIA: carga temas desde Supabase
// ──────────────────────────────────────────────
async function loadFlashcards() {
    if (!window.OfficialFlashcards) throw new Error('La biblioteca oficial no está disponible.');
    flashcardsCache = await OfficialFlashcards.load();
    return flashcardsCache;
}

window.toggleMenu = async function (asignatura) {
    const key = asignatura.replace(/ /g, '-');
    const submenu = document.getElementById('menu-' + key);
    const arrow = document.getElementById('arrow-' + key);

    if (!submenu) return;

    if (submenu.classList.contains('active')) {
        submenu.classList.remove('active');
        if (arrow) arrow.style.transform = 'rotate(0deg)';
        return;
    }

    submenu.innerHTML = '<li><span class="loading">cargando temas...</span></li>';
    submenu.classList.add('active');
    if (arrow) arrow.style.transform = 'rotate(90deg)';

    try {
        let data = await loadFlashcards();
        // select('*') y filtrar client-side — compatible con MAY/min en nombres de columnas

        // Filtrar por materia usando campo() que detecta MAYÚSCULAS o minúsculas
        data = data.filter(function (r) {
            return normalizeDbText(campo(r, 'materia')) === normalizeDbText(asignatura);
        });

        const temas = new Set();
        for (let i = 0; i < data.length; i++) {
            const temaVal = campo(data[i], 'tema');
            if (temaVal) temas.add(temaVal);
        }

        submenu.innerHTML = '';

        if (temas.size === 0) {
            submenu.innerHTML = '';
            if (CampusAccess.isFree()) await CampusAccess.appendLocks(submenu, asignatura);
            else submenu.innerHTML = '<li><span class="loading">sin temas aún</span></li>';
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
        await CampusAccess.appendLocks(submenu, asignatura);

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
    if (flashcardReviewTimer) clearTimeout(flashcardReviewTimer);
    flashcardReviewTimer = null;
    flashcardRatingPending = false;
    flashcardTopicCards = [];
    for (let i = 0; i < data.length; i++) {
        // Soportar columna TEMA en mayúsculas o minúsculas
        const temaVal = campo(data[i], 'tema');
        if (normalizeDbText(temaVal) === normalizeDbText(tema) && normalizeDbText(campo(data[i], 'materia')) === normalizeDbText(asignatura)) flashcardTopicCards.push(data[i]);
    }
    if (flashcardTopicCards.length === 0) {
        showToast('no se encontraron tarjetas para este tema', 'error');
        return;
    }
    if (window.FlashcardWorkspace) flashcardTopicCards = FlashcardWorkspace.prepare(tema, asignatura, flashcardTopicCards);
    // La exploración no cambia las fechas guardadas del repaso programado.
    deck = shuffleArray(window.FlashcardWorkspace?.isExploring() ? flashcardTopicCards.slice() : flashcardTopicCards.filter(isCardDue));
    currentIndex = 0;
    ultimaMateria = asignatura.toLowerCase();

    document.getElementById('current-subject').innerText = asignatura.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
    document.getElementById('card-tema-name').innerText = tema.toLowerCase();
    document.getElementById('card-total').innerText = deck.length;

    temasVistos.add(tema);
    actualizarProgreso();

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }

    showScreen('study-area');
    window.CampusTracking?.record('flashcards','opened',asignatura,tema,'deck');
    renderCard();
    scheduleFlashcardReview();
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
    const isDepthCard = currentIndex < deck.length;
    card.classList.toggle('depth-card', isDepthCard);
    card.querySelectorAll('.depth-brand').forEach(function(logo){logo.remove();});
    if (isDepthCard) card.querySelectorAll('.face').forEach(function(face){
        const logo = document.createElement('img');
        logo.className = 'depth-brand'; logo.src = '/promo-ben-carson-tiktok/public/authentic/logo.png';
        logo.alt = 'Preparatoria Ben Carson'; face.appendChild(logo);
    });
    aText.parentElement.tabIndex = isDepthCard ? 0 : -1;
    const counter = document.querySelector('#study-area .study-progress-row');
    if (counter) counter.hidden = currentIndex >= deck.length;

    if (currentIndex >= deck.length) {
        card.classList.remove('flipped');
        qText.innerText = '¡Estás al día con este tema! Tus tarjetas volverán cuando toque repasarlas.';
        aText.innerText = '';
        btnReveal.classList.add('hidden');
        ankiBtns.classList.add('hidden');
        document.getElementById('card-num').innerText = deck.length;
        if (window.FlashcardWorkspace) FlashcardWorkspace.render(null);
        actualizarProgreso();
        return;
    }

    // Keep a pending flip tied to this card and this account.
    const renderingCard = deck[currentIndex];
    const renderingOwner = typeof currentUser === 'undefined' ? null : currentUser?.id;
    qText.innerText = campo(renderingCard, 'pregunta');
    aText.innerText = '';

    if (card.classList.contains('flipped')) {
        card.style.transition = 'none';
        card.classList.remove('flipped');
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                card.style.transition = '';
                if (deck[currentIndex] !== renderingCard || (typeof currentUser === 'undefined' ? null : currentUser?.id) !== renderingOwner) return;
                aText.innerText = campo(renderingCard, 'respuesta');
                if (window.FlashcardWorkspace?.renderAnswer) FlashcardWorkspace.renderAnswer(aText, renderingCard);
            });
        });
    } else {
        aText.innerText = campo(renderingCard, 'respuesta');
        if (window.FlashcardWorkspace?.renderAnswer) FlashcardWorkspace.renderAnswer(aText, renderingCard);
    }

    ankiBtns.classList.add('hidden');
    btnReveal.classList.remove('hidden');
    document.getElementById('card-num').innerText = currentIndex + 1;
    if (window.FlashcardWorkspace) FlashcardWorkspace.render(deck[currentIndex]);

    actualizarProgreso();
}

// ──────────────────────────────────────────────
// REVELAR RESPUESTA
// ──────────────────────────────────────────────


// ──────────────────────────────────────────────
// SISTEMA DE REPETICION ESPACIADA (SRS)
// ──────────────────────────────────────────────
const SRS_INTERVALS = {
    0: 60 * 1000,               // mal      -> 1 min
    1: 10 * 60 * 1000,          // regular  -> 10 min
    2: 24 * 60 * 60 * 1000,     // bien     -> 1 día
    3: 3 * 24 * 60 * 60 * 1000  // fácil    -> 3 días
};

function getSrsKey(card) {
    const uid = (currentUser && currentUser.id) ? currentUser.id : 'anon';
    const id = campo(card, 'id');
    const identity = id != null && id !== '' ? 'id:' + id : JSON.stringify([
        campo(card, 'materia'), campo(card, 'tema'), campo(card, 'pregunta')
    ]);
    // La clave anterior truncaba el texto y mezclaba fechas de distintas tarjetas.
    return 'srs_v2_' + uid + '_' + encodeURIComponent(identity);
}

function getCardReviewTime(card) {
    try {
        const value = Number(localStorage.getItem(getSrsKey(card)));
        return Number.isFinite(value) && value > 0 ? value : null;
    } catch (e) { return null; }
}

function saveSrs(card, intervalMs) {
    try {
        localStorage.setItem(getSrsKey(card), (Date.now() + intervalMs).toString());
    } catch (e) { /* storage lleno — ignorar */ }
}

function isCardDue(card) {
    const dueAt = getCardReviewTime(card);
    return dueAt === null || Date.now() >= dueAt;
}

function enqueueDueFlashcards(insertionIndex) {
    const queued = new Set(deck.slice(currentIndex).map(getSrsKey));
    const due = flashcardTopicCards.filter(function (card) {
        const dueAt = getCardReviewTime(card);
        return dueAt !== null && dueAt <= Date.now() && !queued.has(getSrsKey(card));
    }).sort(function (a, b) { return getCardReviewTime(a) - getCardReviewTime(b); });
    if (due.length) {
        deck.splice(insertionIndex, 0, ...due);
        document.getElementById('card-total').innerText = deck.length;
    }
    return due.length;
}

function refreshFlashcardReviews() {
    if (window.FlashcardWorkspace?.isExploring()) return;
    if (currentCampusScreen !== 'study-area') return;
    const waiting = currentIndex >= deck.length;
    // No interrumpir la pregunta actual: lo vencido va inmediatamente después.
    const added = enqueueDueFlashcards(waiting ? currentIndex : currentIndex + 1);
    if (waiting && added) renderCard();
    scheduleFlashcardReview();
}

function scheduleFlashcardReview() {
    if (flashcardReviewTimer) clearTimeout(flashcardReviewTimer);
    flashcardReviewTimer = null;
    if (window.FlashcardWorkspace?.isExploring()) return;
    if (currentCampusScreen !== 'study-area') return;
    const now = Date.now();
    const future = flashcardTopicCards.map(getCardReviewTime).filter(function (time) { return time !== null && time > now; });
    if (future.length) {
        flashcardReviewTimer = setTimeout(refreshFlashcardReviews, Math.min(Math.min(...future) - now, 2147483647));
    }
}

document.addEventListener('visibilitychange', function () {
    if (!document.hidden) refreshFlashcardReviews();
});

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
        if (pct === 0) msgEl.textContent = 'Responde una tarjeta para empezar.';
        else if (pct < 50) msgEl.textContent = 'Cada respuesta cuenta para tu meta de hoy.';
        else if (pct < 100) msgEl.textContent = 'Te faltan ' + Math.max(0, DAILY_GOAL - done) + ' tarjetas para completar tu meta.';
        else msgEl.textContent = 'Meta de hoy completada.';
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
let flashcardAudioContext = null;

function playFlashcardRatingSound() {
    try {
        const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextCtor) return;

        if (!flashcardAudioContext) flashcardAudioContext = new AudioContextCtor();
        const ctx = flashcardAudioContext;
        if (ctx.state === 'suspended') ctx.resume().catch(function () { });

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(980, now);
        osc.frequency.exponentialRampToValueAtTime(1420, now + 0.045);
        osc.frequency.exponentialRampToValueAtTime(760, now + 0.105);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1150, now);
        filter.Q.setValueAtTime(5.5, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.055, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
    } catch (e) {
        // El audio es decorativo; nunca debe bloquear la respuesta.
    }
}

window.rateCard = function (score) {
    if (window.FlashcardWorkspace?.isExploring()) return;
    if (!deck.length || currentIndex >= deck.length || flashcardRatingPending || !SRS_INTERVALS[score]) return;
    flashcardRatingPending = true;
    playFlashcardRatingSound();
    const selectedButton = window.event && window.event.currentTarget && window.event.currentTarget.classList
        ? window.event.currentTarget
        : null;
    if (selectedButton) selectedButton.classList.add('is-selected');

    totalReviews++;
    const repasosCount = document.getElementById('repasos-count');
    if (repasosCount) repasosCount.innerText = totalReviews;

    const card = deck[currentIndex];
    window.CampusTracking?.record('flashcards','reviewed',document.getElementById('current-subject')?.textContent,document.getElementById('card-tema-name')?.textContent,String(card.id || ''));
    const interval = SRS_INTERVALS[score];
    if (interval) saveSrs(card, interval);

    currentIndex++;
    while (currentIndex < deck.length && !isCardDue(deck[currentIndex])) currentIndex++;
    enqueueDueFlashcards(currentIndex);
    scheduleFlashcardReview();

    // Registrar en meta diaria y sincronizar con la nube cada 5 cartas
    const newCount = incrementDailyCount();
    if (newCount === DAILY_GOAL) {
        updateStreak();
        showToast('🏆 ¡meta diaria cumplida! ¡increíble esfuerzo!', 'success');
    }

    const finishRatingUi = function () {
        flashcardRatingPending = false;
        renderCard();
        actualizarProgreso();
        if (selectedButton) selectedButton.classList.remove('is-selected');

        // Sincronizar flashcards con la nube cada 3 repasos para no saturar
        if (totalReviews % 3 === 0) {
            sincronizarFlashcardsEnNube();
        }
    };

    if (selectedButton) setTimeout(finishRatingUi, 210);
    else finishRatingUi();
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
    if (elMateria) elMateria.textContent = ultimaMateria !== '—' ? String(ultimaMateria).replace(/^salud p[úu]blica$/i, 'Educación para la Salud') : 'Elige un tema para empezar';

    const total = deck.length || 0;
    const vistas = Math.min(currentIndex, total);
    const pct = total > 0 ? Math.round((vistas / total) * 100) : 0;
    document.querySelector('.dashboard-progress')?.classList.toggle('has-topic-progress', total > 0);

    const bar = document.getElementById('prog-bar');

    if (bar) bar.style.width = pct + '%';

    const barText = document.getElementById('prog-bar-text');
    if (barText) barText.textContent = total > 0 ? vistas + ' / ' + total + ' tarjetas completadas' : 'Tu avance por tema aparecerá aquí';

    const pctEl = document.getElementById('prog-pct');
    if (pctEl) pctEl.textContent = total > 0 ? pct + '%' : '';

    const studyFill = document.getElementById('study-progress-fill');
    const studyPctEl = document.getElementById('study-progress-percent');
    const activeCard = total > 0 ? Math.min(currentIndex + 1, total) : 0;
    const studyPct = total > 0 ? Math.round((activeCard / total) * 100) : 0;
    if (studyFill) studyFill.style.width = studyPct + '%';
    if (studyPctEl) studyPctEl.textContent = studyPct + '%';

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

let selectedGameSubject = '';
function resourceChooser(tool, names, select, description) {
    showScreen('resource-browser');
    document.getElementById('resource-tool').textContent = tool;
    document.getElementById('resource-title').textContent = tool === 'Juegos' ? 'Elige un juego' : tool === 'Intocables' ? 'Elige un recurso' : 'Elige una materia';
    document.getElementById('resource-description').textContent = description || 'Selecciona el contenido que quieres practicar.';
    const options = document.getElementById('resource-options');
    options.replaceChildren();
    options.classList.toggle('games-chooser', tool === 'Juegos');
    names.forEach(name => {
        const button = document.createElement('button');
        button.type = 'button';
        const img = document.createElement('img');
        img.src = '/assets/study-art/' + (/quiz/i.test(name) ? 'quiz' : /ahorcado/i.test(name) ? 'word' : /biolog|c[eé]lul/i.test(name) ? 'cell' : /salud/i.test(name) ? 'health-education' : 'morphology') + '.png';
        img.alt = '';
        const label = document.createElement('strong');
        label.textContent = name.replace(/salud p[úu]blica/i, 'Educación para la Salud');
        button.append(img, label);
        button.onclick = () => select(name);
        options.append(button);
    });
}
window.openGameMenu = function () {
    const games = [
        { name: 'Quiz relámpago', description: 'Responde contra reloj con preguntas de las tres materias.', action: () => openGame('quiz') },
        { name: 'Ahorcado médico', description: 'Adivina conceptos de Morfofunción, Biología celular y Salud.', action: () => openGame('hangman') },
        { name: 'Juegos por materias', description: 'Entra a AlcocerMed Juegos: evaluaciones, ranking y demos por materia.', action: () => { window.location.href = '/juegos/'; } }
    ];
    resourceChooser('Juegos', games.map(game => game.name), name => games.find(game => game.name === name).action(), 'Tres formas de practicar. Si tienes una cuenta gratuita, podrás jugar las versiones demo.');
    document.querySelectorAll('#resource-options button').forEach((button, index) => {
        const game = games[index];
        if (index === 2) {
            const art = button.querySelector('img');
            art.outerHTML = '<svg class="study-tool-icon" aria-hidden="true"><use href="/assets/study-tools.svg?v=2#gamepad"></use></svg>';
        }
        const details = document.createElement('small');
        details.textContent = game.description;
        button.append(details);
        const footer = document.createElement('span');
        footer.className = 'game-choice-action';
        footer.textContent = index === 2 ? 'Entrar a Juegos →' : 'Elegir materia →';
        button.append(footer);
    });
};
window.openGame = function (gameType) {
    const source = gameType === 'quiz' ? QUIZ_QUESTIONS : HANGMAN_WORDS;
    const key = gameType === 'quiz' ? 'subject' : 'category';
    resourceChooser(gameType === 'quiz' ? 'Quiz relámpago' : 'Ahorcado médico', [...new Set(source.map(q => q[key]))], name => {
        selectedGameSubject = name;
        showScreen(gameType === 'quiz' ? 'game-quiz' : 'game-hangman');
        if (gameType === 'quiz') startQuiz(); else startHangman();
    });
    if (window.CampusAccess && CampusAccess.isFree()) {
        const locked = document.createElement('button');
        locked.type = 'button';
        locked.className = 'resource-locked-option';
        locked.innerHTML = '<i class="fas fa-lock" aria-hidden="true"></i><strong>Más contenido del juego</strong><small>Disponible con un plan</small>';
        locked.onclick = () => CampusAccess.unlock();
        document.getElementById('resource-options').append(locked);
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
    // Educación para la Salud
    { q: '¿qué mide la tasa de mortalidad infantil?', opts: ['muertes de menores de 5 años por cada 100k hab.', 'muertes de menores de 1 año por cada 1000 nacidos vivos', 'muertes maternas por cada 100k nacidos', 'fallecidos en hospitales por año'], answer: 1, subject: 'educación para la salud' },
    { q: 'la epidemiología estudia principalmente:', opts: ['las enfermedades individuales', 'la distribución y determinantes de la salud en poblaciones', 'la anatomía patológica', 'el tratamiento farmacológico'], answer: 1, subject: 'educación para la salud' },
    { q: '¿cuál es el indicador que mide los años de vida ajustados por discapacidad?', opts: ['AVISA (DALY)', 'AVPP', 'tasa de incidencia', 'índice de Gini'], answer: 0, subject: 'educación para la salud' },
    { q: 'Si se organiza una campaña de vacunación, ¿qué función de salud pública se está reforzando?', opts: ['prevención de enfermedades', 'diagnóstico por imágenes', 'cirugía de urgencia', 'rehabilitación física'], answer: 0, subject: 'educación para la salud' },
    { q: '¿Qué aporta la comunidad cuando participa en las decisiones sobre su salud?', opts: ['sus experiencias y prioridades', 'solo datos de laboratorio', 'únicamente financiamiento', 'el reemplazo de la vigilancia sanitaria'], answer: 0, subject: 'educación para la salud' },
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
    { word: 'CITOPLASMA', hint: 'región celular entre la membrana y el núcleo', category: 'biología celular' },
    { word: 'NUCLEOLO', hint: 'región del núcleo donde se forman subunidades ribosómicas', category: 'biología celular' },
    { word: 'CROMATINA', hint: 'ADN asociado a proteínas dentro del núcleo', category: 'biología celular' },
    { word: 'CITOSOL', hint: 'porción líquida del citoplasma', category: 'biología celular' },
    { word: 'CENTRIOLO', hint: 'estructura cilíndrica de microtúbulos del centrosoma', category: 'biología celular' },
    { word: 'MICROTUBULO', hint: 'filamento del citoesqueleto que forma el huso mitótico', category: 'biología celular' },
    { word: 'ENDOCITOSIS', hint: 'entrada de material a la célula mediante vesículas', category: 'biología celular' },
    { word: 'EXOCITOSIS', hint: 'salida de material celular mediante fusión de vesículas', category: 'biología celular' },
    { word: 'FOSFOLIPIDO', hint: 'molécula anfipática que forma la bicapa de la membrana', category: 'biología celular' },
    { word: 'OSMOSIS', hint: 'movimiento de agua a través de una membrana selectiva', category: 'biología celular' },
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
    { word: 'HOMEOSTASIS', hint: 'mantenimiento de condiciones internas relativamente estables', category: 'morfofunción' },
    { word: 'FISIOLOGIA', hint: 'estudia cómo funciona el cuerpo', category: 'morfofunción' },
    { word: 'ANATOMIA', hint: 'estudia la estructura del cuerpo', category: 'morfofunción' },
    { word: 'EPIDERMIS', hint: 'capa más superficial de la piel', category: 'morfofunción' },
    { word: 'DERMIS', hint: 'capa de la piel bajo la epidermis', category: 'morfofunción' },
    { word: 'HEMOGLOBINA', hint: 'proteína de los eritrocitos que transporta oxígeno', category: 'morfofunción' },
    { word: 'ALVEOLO', hint: 'pequeña estructura pulmonar donde ocurre el intercambio gaseoso', category: 'morfofunción' },
    { word: 'NEURONA', hint: 'célula especializada en transmitir señales nerviosas', category: 'morfofunción' },
    { word: 'ARTERIA', hint: 'vaso que conduce sangre desde el corazón', category: 'morfofunción' },
    { word: 'TENDON', hint: 'tejido que une un músculo con un hueso', category: 'morfofunción' },
    // Educación para la Salud
    { word: 'PREVENCION', hint: 'acciones para reducir el riesgo o los casos de enfermedad', category: 'educación para la salud' },
    { word: 'PROMOCION', hint: 'crea condiciones y capacidades para cuidar la salud', category: 'educación para la salud' },
    { word: 'VIGILANCIA', hint: 'seguimiento de datos para reconocer riesgos y brotes', category: 'educación para la salud' },
    { word: 'COMUNIDAD', hint: 'grupo que participa en decisiones sobre su salud', category: 'educación para la salud' },
    { word: 'VACUNACION', hint: 'medida preventiva que protege frente a enfermedades', category: 'educación para la salud' },
    { word: 'EPIDEMIOLOGIA', hint: 'estudia la distribución de problemas de salud en poblaciones', category: 'educación para la salud' },
    { word: 'INCIDENCIA', hint: 'medida de casos nuevos durante un periodo', category: 'educación para la salud' },
    { word: 'PREVALENCIA', hint: 'medida de personas que viven con una condición en un momento o periodo', category: 'educación para la salud' },
    { word: 'POBLACION', hint: 'conjunto de personas cuya salud se observa o protege', category: 'educación para la salud' },
    { word: 'SANEAMIENTO', hint: 'medidas para mantener agua y entorno en condiciones saludables', category: 'educación para la salud' },
    { word: 'ENTREVISTA', hint: 'técnica para recoger información directamente de una persona', category: 'educación para la salud' },
    { word: 'ENCUESTA', hint: 'instrumento con preguntas para reunir datos de un grupo', category: 'educación para la salud' },
    { word: 'MUESTRA', hint: 'parte de una población seleccionada para un estudio', category: 'educación para la salud' },
    { word: 'VARIABLE', hint: 'característica que puede tomar distintos valores en una investigación', category: 'educación para la salud' },
    { word: 'HIPOTESIS', hint: 'explicación provisional que se somete a comprobación', category: 'educación para la salud' },
];

// Preguntas de práctica visibles en la cuenta gratuita. No consulta el banco de pago.
function freePracticeRows() {
    const perSubject = {};
    return QUIZ_QUESTIONS.filter(q => (perSubject[q.subject] = (perSubject[q.subject] || 0) + 1) <= 3)
        .map(q => ({
            materia: q.subject, tema: 'Práctica inicial', pregunta: q.q,
            opcion_a: q.opts[0], opcion_b: q.opts[1], opcion_c: q.opts[2], opcion_d: q.opts[3],
            respuesta_correcta: 'ABCD'[q.answer], dificultad: 'facil'
        }));
}

// ══════════════════════════════════════════════
// QUIZ RELÁMPAGO
// ══════════════════════════════════════════════
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;
let quizTimer = null;
let quizTimeLeft = 15;
let quizAnswered = false;

function quizQuestionFromBanco(row) {
    if (!campo(row, 'fuente')) return null;
    const subjectCode = normalizeDbText(campo(row, 'materia'));
    const subject = { 'MORFOFUNCION': 'morfofunción', 'BIOLOGIA CELULAR': 'biología celular', 'SALUD PUBLICA': 'educación para la salud' }[subjectCode];
    const answer = 'ABCD'.indexOf(String(campo(row, 'respuesta_correcta')).trim().toUpperCase());
    const opts = ['a', 'b', 'c', 'd'].map(letter => campo(row, 'opcion_' + letter));
    const question = campo(row, 'pregunta');
    if (!subject || !question || opts.some(option => !option || !String(option).trim()) || answer < 0) return null;
    return { q: String(question), opts: opts.map(String), answer, subject };
}

window.startQuiz = async function () {
    const requestedSubject = selectedGameSubject;
    const isFree = window.CampusAccess && CampusAccess.isFree();
    let available = QUIZ_QUESTIONS.filter(q => !requestedSubject || q.subject === requestedSubject);
    if (!isFree) {
        document.getElementById('quiz-question-text').textContent = 'Preparando preguntas...';
        document.getElementById('quiz-options').replaceChildren();
        try {
            const banco = (await fetchAllBancoQuestions()).map(quizQuestionFromBanco).filter(Boolean);
            const matching = banco.filter(q => !requestedSubject || q.subject === requestedSubject);
            if (matching.length) available = matching;
        } catch (error) {
            console.warn('No se pudo cargar el banco para Quiz relámpago:', error);
        }
    }
    if (selectedGameSubject !== requestedSubject || document.getElementById('game-quiz').classList.contains('hidden')) return;
    quizQuestions = shuffleArray((isFree ? available.slice(0, 5) : available).slice()).slice(0, 10);
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
    window.CampusTracking?.record('quiz','completed','','Ronda de quiz relámpago','quiz',pct);
}

// ══════════════════════════════════════════════
// AHORCADO MÉDICO
// ══════════════════════════════════════════════
let hmWord = '';
let hmGuessed = [];
let hmErrors = 0;
const hangmanRemaining = new Map();
const HM_MAX_ERRORS = 6;
const HM_PARTS = ['hm-head', 'hm-body', 'hm-larm', 'hm-rarm', 'hm-lleg', 'hm-rleg'];

window.startHangman = function () {
    const available = HANGMAN_WORDS.filter(q => !selectedGameSubject || q.category === selectedGameSubject);
    const words = window.CampusAccess && CampusAccess.isFree() ? available.slice(0,5) : available;
    const poolKey = selectedGameSubject + (window.CampusAccess && CampusAccess.isFree() ? ':demo' : ':full');
    let remaining = hangmanRemaining.get(poolKey);
    if (!remaining || !remaining.length) remaining = shuffleArray(words.slice());
    const entry = remaining.pop();
    hangmanRemaining.set(poolKey, remaining);
    hmWord = entry.word.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
        window.CampusTracking?.record('ahorcado','completed','','Ronda de ahorcado médico','hangman',100);
        disableHmKeyboard();
    } else if (hmErrors >= HM_MAX_ERRORS) {
        resultEl.classList.remove('hidden');
        resultText.innerHTML = '💀 <strong>fallaste.</strong> la palabra era: <strong>' + hmWord.toLowerCase() + '</strong>';
        window.CampusTracking?.record('ahorcado','completed','','Ronda de ahorcado médico','hangman',0);
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

// PWA / instalacion de la app principal
let deferredPwaInstallPrompt = null;

function isStandalonePwa() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function getPwaInstallFallbackMessage() {
    const ua = navigator.userAgent || '';
    if (/iphone|ipad|ipod/i.test(ua)) {
        return 'En iPhone: toca compartir y luego "Agregar a pantalla de inicio".';
    }
    return 'Si no aparece la instalacion, abre el menu del navegador y elige "Instalar app" o "Agregar a pantalla de inicio".';
}

function setPwaInstallButtonsHidden(hidden) {
    document.querySelectorAll('.pwa-install-trigger').forEach(function (btn) {
        btn.classList.toggle('is-hidden', hidden);
    });
}

async function handlePwaInstallClick() {
    if (isStandalonePwa()) {
        showToast('la app ya esta instalada', 'success');
        setPwaInstallButtonsHidden(true);
        return;
    }

    if (!deferredPwaInstallPrompt) {
        showToast(getPwaInstallFallbackMessage(), 'info');
        return;
    }

    deferredPwaInstallPrompt.prompt();
    try {
        await deferredPwaInstallPrompt.userChoice;
    } catch (e) {
        console.warn('[PWA] instalacion cancelada o no disponible:', e);
    }
    deferredPwaInstallPrompt = null;
}

function initPwaInstall() {
    document.querySelectorAll('.pwa-install-trigger').forEach(function (btn) {
        btn.addEventListener('click', handlePwaInstallClick);
    });

    if (isStandalonePwa()) {
        setPwaInstallButtonsHidden(true);
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(function (error) {
            console.warn('[PWA] no se pudo registrar el service worker:', error);
        });
    }
}

window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPwaInstallPrompt = event;
    setPwaInstallButtonsHidden(false);
});

window.addEventListener('appinstalled', function () {
    deferredPwaInstallPrompt = null;
    setPwaInstallButtonsHidden(true);
    showToast('app instalada correctamente', 'success');
});

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
    initPwaInstall();

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
let bancoQuestionsPromise = null;

// Supabase entrega como máximo 1.000 filas por petición. Cargar por páginas
// evita que desaparezcan materias o temas al crecer la bibliografía.
async function fetchAllBancoQuestions() {
    if (bancoState._cache && bancoState._cache.length) return bancoState._cache;
    if (bancoQuestionsPromise) return bancoQuestionsPromise;
    bancoQuestionsPromise = (async function () {
        const client = getSupabase();
        const rows = [];
        const pageSize = 500;
        for (let offset = 0; ; offset += pageSize) {
            const { data, error } = await client.from('banco_preguntas')
                .select('*').order('id', { ascending: true })
                .range(offset, offset + pageSize - 1);
            if (error) throw error;
            rows.push(...(data || []));
            if (!data || data.length < pageSize) break;
        }
        const completeRows = typeof StudyDepth !== 'undefined' ? await StudyDepth.merge(rows, 'bank') : rows;
        bancoState._cache = completeRows;
        simState._cache = completeRows;
        return completeRows;
    })();
    try {
        return await bancoQuestionsPromise;
    } finally {
        bancoQuestionsPromise = null;
    }
}

async function preloadAppData() {
    if (CampusAccess.isFree()) return;
    if (bancoState._cache && bancoState._cache.length > 0) return; // ya cargado
    try {
        await fetchAllBancoQuestions();
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
    if (!CampusAccess.isFree()) loadPreguntasDificiles();
};

async function loadBancoMaterias() {
    const ddEl = document.getElementById('banco-materia-dropdown');

    // Si hay caché, construir UI inmediatamente (Fix: velocidad de apertura)
    let data = CampusAccess.isFree() ? freePracticeRows() : (bancoState._cache || []);
    if (!CampusAccess.isFree() && data.length === 0) {
        ddEl.innerHTML = '<div class="banco-loading-opts"><i class="fas fa-spinner fa-spin"></i> cargando materias...</div>';
        try {
            data = await fetchAllBancoQuestions();
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
        if (!CampusAccess.isFree()) bancoState._cache = data;

        ddEl.innerHTML = '';
        if (bancoState.materias.length === 0) {
            ddEl.innerHTML = '<div class="banco-loading-opts">sin materias disponibles</div>';
            return;
        }

        bancoState.materias.forEach(function (m) {
            const btn = document.createElement('button');
            btn.className = 'banco-dropdown-item';
            btn.textContent = m.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
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
    document.getElementById('banco-materia-text').textContent = materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
    document.getElementById('banco-materia-dropdown').classList.add('hidden');
    document.getElementById('banco-materia-btn').classList.remove('open');

    // Highlight item seleccionado
    document.querySelectorAll('#banco-materia-dropdown .banco-dropdown-item').forEach(function (el) {
        el.classList.toggle('selected', el.textContent === materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud'));
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

// Orden de los capítulos del curso. Salud reúne sus módulos en una secuencia continua.
const BANCO_TOPIC_ORDER = {
    "MORFOFUNCION": [
        "temas principales de anatomia y fisiologia",
        "la quimica de la vida",
        "forma y funcion celulares",
        "genetica y funcion celular",
        "histologia",
        "sistema tegumentario",
        "tejido oseo",
        "el sistema oseo",
        "articulaciones",
        "el sistema muscular",
        "tejido muscular",
        "tejido nervioso",
        "medula espinal y reflejos",
        "encefalo y pares craneales",
        "sistema nervioso autonomo",
        "organos de los sentidos",
        "sistema endocrino",
        "sangre",
        "corazon",
        "vasos sanguineos y circulacion",
        "sistema linfatico e inmunidad",
        "aparato respiratorio",
        "aparato urinario",
        "equilibrio hidrico y acidobasico",
        "aparato digestivo",
        "nutricion y metabolismo",
        "aparato reproductor masculino",
        "aparato reproductor femenino",
        "desarrollo humano y envejecimiento"
    ],
    "BIOLOGIA CELULAR": [
        "introduccion a la biologia celular",
        "metodos y tecnicas basicas en biologia celular",
        "estructura de la membrana plasmatica",
        "transporte a traves de la membrana plasmatica",
        "macrotransporte a traves de la membrana plasmatica",
        "especializaciones de la membrana plasmatica",
        "nucleo y cromatina",
        "transcripcion y maduracion del arn",
        "sintesis y modificacion de proteinas",
        "reticulo endoplasmatico golgi y lisosomas",
        "mitocondrias y peroxisomas",
        "citoesqueleto",
        "senalizacion celular",
        "ciclo celular",
        "division celular y muerte programada",
        "biologia celular del cancer",
        "respuesta inmunitaria",
        "celulas madre y aplicaciones terapeuticas"
    ],
    "SALUD PUBLICA": [
        "educacion en salud",
        "concepto de salud y determinantes",
        "funciones de salud publica",
        "niveles de prevencion",
        "promocion de la salud",
        "atencion primaria de salud",
        "factor de riesgo y salud comunitaria",
        "ods y cobertura sanitaria",
        "salud en bolivia y modelo safci",
        "epidemiologia social",
        "proceso de investigacion",
        "problema y objetivos de investigacion",
        "marco teorico e hipotesis",
        "variables y medicion",
        "estadistica descriptiva",
        "muestreo",
        "frecuencias y graficos",
        "medidas de tendencia central",
        "medidas de posicion",
        "dispersion y forma de los datos",
        "analisis de datos en excel y spss"
    ]
};

function bancoTopicChapter(materia, tema) {
    const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase().replace(/\s+/g, ' ');
    const subject = Object.keys(BANCO_TOPIC_ORDER).find(key => normalize(key) === normalize(materia));
    const index = subject ? BANCO_TOPIC_ORDER[subject].findIndex(topic => normalize(topic) === normalize(tema)) : -1;
    return index < 0 ? null : index + 1;
}

function bancoTopicLabel(materia, tema) {
    const chapter = bancoTopicChapter(materia, tema);
    return chapter ? 'Capítulo ' + chapter + ' · ' + String(tema).toLowerCase() : String(tema).toLowerCase();
}

function sortBancoTopics(materia, topics) {
    return topics.slice().sort((a, b) => {
        const chapterA = bancoTopicChapter(materia, a) ?? Infinity;
        const chapterB = bancoTopicChapter(materia, b) ?? Infinity;
        return chapterA - chapterB || a.localeCompare(b, 'es', { numeric: true });
    });
}
// Fin del orden de capítulos del banco.

async function loadBancoTemas(materia) {
    const ddEl = document.getElementById('banco-tema-dropdown');
    ddEl.innerHTML = '<div class="banco-loading-opts"><i class="fas fa-spinner fa-spin"></i> cargando temas...</div>';

    try {
        // Usar caché si está disponible para evitar re-query
        let rows = CampusAccess.isFree() ? freePracticeRows() : (bancoState._cache || []);
        let usandoCache = rows.length > 0;

        if (!usandoCache) {
            rows = await fetchAllBancoQuestions();
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
        bancoState.temas = sortBancoTopics(materia, Array.from(temasSet));

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
            btn.textContent = bancoTopicLabel(materia, t);
            btn.dataset.tema = t;
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

    document.getElementById('banco-tema-text').textContent = tema ? bancoTopicLabel(bancoState.selectedMateria, tema) : 'todos los temas';
    document.getElementById('banco-tema-dropdown').classList.add('hidden');
    document.getElementById('banco-tema-btn').classList.remove('open');

    // Highlight
    document.querySelectorAll('#banco-tema-dropdown .banco-dropdown-item').forEach(function (el) {
        const isAll = (el.textContent === 'todos los temas' && tema === null);
        const isThis = tema && el.dataset.tema === tema;
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
        let rows = CampusAccess.isFree() ? freePracticeRows() : (bancoState._cache || []);

        // Si no hay caché, hacer query completa
        if (rows.length === 0) {
            rows = await fetchAllBancoQuestions();
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
            filterText.textContent = 'tema: ' + bancoTopicLabel(bancoState.selectedMateria, bancoState.selectedTema) + difLabel;
        } else {
            filterRow.classList.remove('hidden');
            filterText.textContent = 'materia: ' + bancoState.selectedMateria.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud') + ' · todos los temas' + difLabel;
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
    document.getElementById('bq-materia').textContent = bancoState.selectedMateria.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
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
    document.getElementById('banco-quiz').classList.toggle('bq-depth', Boolean(q.content_id));
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
        const letter = document.createElement('span');
        letter.className = 'bq-option-letter';
        letter.textContent = letras[i];
        const label = document.createElement('span');
        label.className = 'bq-option-text';
        label.textContent = opcion;
        const mark = document.createElement('span');
        mark.className = 'bq-option-check';
        const icon = document.createElement('i');
        icon.className = 'fas ' + (i === correctIdx ? 'fa-check' : 'fa-times');
        mark.appendChild(icon);
        btn.append(letter, label, mark);

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
    const comentario = bancoComentario(q);

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

function bancoComentario(q) {
    const explicacion = campo(q, 'justificacion') || campo(q, 'explicacion') || campo(q, 'comentario') || '';
    const fuente = campo(q, 'fuente');
    const paginas = campo(q, 'paginas_pdf');
    return explicacion + (fuente ? '\nFuente: ' + fuente + (paginas ? ' · páginas ' + paginas + ' del PDF' : '') : '');
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
    const comentario = bancoComentario(q);
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
        questionReview: window.QuestionReview?.snapshot(bancoState.preguntas,bancoState.answers,campo,function(q){const raw=String(campo(q,'respuesta_correcta')||'A').trim().toUpperCase();return [/^[A-E]$/.test(raw)?'ABCDE'.indexOf(raw):parseInt(raw,10)-1];}) || null,
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
    if (CampusAccess.isFree() && (nivel === 'medio' || nivel === 'dificil')) return CampusAccess.unlock();
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
    if (!campo(preguntaRow, 'id')) return; // la práctica gratuita local no tiene fila en el banco de pago
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
                    (r.materia ? '<span><i class="fas fa-book-medical"></i>' + r.materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud') + '</span>' : '') +
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
    endTimestamp: null,
    finalized: false,
    _cache: [],
    _oficialesCache: []     // catálogo de simulacros con número de preguntas
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
    if (CampusAccess.isFree()) {
        simState._cache = freePracticeRows();
        simState.selectedExamen = null;
        setSimMode('completo');
        setSimDuracion(30);
        const slider = document.getElementById('sim-nq-slider');
        slider.min = 5; slider.max = simState._cache.length; slider.step = 1;
        slider.value = simState._cache.length;
        updateSimNQ();
    } else {
        const slider = document.getElementById('sim-nq-slider');
        slider.min = 10; slider.max = 50; slider.step = 5;
        slider.value = 30;
        updateSimNQ();
        setSimMode('oficial');
    }
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('overlay').classList.remove('active');
    }
    await Promise.all([loadSimOficiales(), loadSimMaterias()]);
};

async function loadSimOficiales() {
    var ddEl = document.getElementById('sim-oficial-dropdown');
    if (!ddEl) return;
    if (CampusAccess.isFree()) {
        ddEl.textContent = 'Los exámenes pasados se abren con un plan.';
        return;
    }
    ddEl.innerHTML = '<div class="banco-loading-opts"><i class="fas fa-spinner fa-spin"></i> cargando exámenes...</div>';
    try {
        var client = getSupabase();
        // PostgREST limita las filas por petición; recorrer todas evita ocultar los últimos simulacros.
        var catalogo = new Map();
        for (var from = 0; ; from += 500) {
            var { data, error } = await client.from('simulacros')
                .select('nombre,materia,numero_pregunta')
                .order('nombre').order('numero_pregunta')
                .range(from, from + 499);
            if (error) throw error;
            (data || []).forEach(function (r) {
                var item = catalogo.get(r.nombre) || { nombre: r.nombre, materia: r.materia, count: 0 };
                item.count++;
                catalogo.set(r.nombre, item);
            });
            if (!data || data.length < 500) break;
        }
        simState._oficialesCache = Array.from(catalogo.values());

        ddEl.innerHTML = '';
        if (catalogo.size === 0) {
            ddEl.innerHTML = '<div class="banco-loading-opts">no hay exámenes cargados aún</div>';
            document.getElementById('sim-oficial-text').textContent = 'sin exámenes';
            return;
        }

        var grupos = [
            { label: 'Simulacro integral', rows: [] },
            { label: 'Morfofunción', rows: [] },
            { label: 'Biología celular', rows: [] },
            { label: 'Educación para la Salud', rows: [] },
            { label: 'Muestras anteriores', rows: [] }
        ];
        simState._oficialesCache.forEach(function (item) {
            var group = grupos[4];
            if (item.nombre.startsWith('Práctica bibliográfica')) {
                if (item.nombre.includes('Integral')) group = grupos[0];
                else if (item.materia === 'MORFOFUNCION') group = grupos[1];
                else if (item.materia === 'BIOLOGIA CELULAR') group = grupos[2];
                else if (item.materia === 'SALUD PUBLICA') group = grupos[3];
            }
            group.rows.push(item);
        });
        grupos.forEach(function (group) {
            if (!group.rows.length) return;
            var heading = document.createElement('div');
            heading.className = 'sim-dropdown-heading';
            heading.textContent = group.label;
            ddEl.appendChild(heading);
            group.rows.forEach(function (item) {
                var btn = document.createElement('button');
                btn.className = 'banco-dropdown-item sim-dropdown-item';
                var title = document.createElement('span');
                title.textContent = item.nombre;
                var count = document.createElement('small');
                count.textContent = item.count + ' preguntas';
                btn.append(title, count);
                btn.onclick = function () { selectSimOficial(item.nombre); };
                ddEl.appendChild(btn);
            });
        });

        if (!catalogo.has(simState.selectedExamen)) {
            selectSimOficial(grupos.find(function (g) { return g.rows.length; }).rows[0].nombre);
        } else if (simState.mode === 'oficial') {
            selectSimOficial(simState.selectedExamen);
        }

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
    document.getElementById('sim-oficial-text').textContent = nombre;
    document.getElementById('sim-oficial-dropdown').classList.add('hidden');
    document.getElementById('sim-oficial-btn').classList.remove('open');
    if (simState.mode === 'oficial') document.getElementById('sim-sum-materia').textContent = nombre;
    var found = simState._oficialesCache.find(function (r) { return r.nombre === nombre; });
    if (found && simState.mode === 'oficial') {
        simState.nPreguntas = found.count;
        document.getElementById('sim-nq-value').textContent = found.count;
        document.getElementById('sim-sum-nq').textContent = found.count;
    }
};

// ── Cargar materias desde caché del banco o desde Supabase ──
async function loadSimMaterias() {
    var ddEl = document.getElementById('sim-materia-dropdown');
    if (!ddEl) return;
    ddEl.innerHTML = '<div class="banco-loading-opts"><i class="fas fa-spinner fa-spin"></i> cargando materias...</div>';
    try {
        var rows = CampusAccess.isFree() ? freePracticeRows() : (bancoState._cache || []);
        if (!CampusAccess.isFree() && rows.length === 0) {
            rows = await fetchAllBancoQuestions();
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
            btn.textContent = m.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
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
    document.getElementById('sim-materia-text').textContent = materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
    document.getElementById('sim-materia-dropdown').classList.add('hidden');
    document.getElementById('sim-materia-btn').classList.remove('open');
    document.getElementById('sim-sum-materia').textContent = materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
    if (CampusAccess.isFree()) {
        var disponibles = simState._cache.filter(function (r) { return campo(r, 'materia') === materia; }).length;
        var slider = document.getElementById('sim-nq-slider');
        slider.min = 1;
        slider.max = Math.max(1, disponibles);
        slider.step = 1;
        slider.value = Math.max(1, disponibles);
        updateSimNQ();
    }
};

window.setSimMode = function (mode) {
    if (mode === 'oficial' && CampusAccess.isFree()) return CampusAccess.unlock();
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
    var slider = document.getElementById('sim-nq-slider');
    var note = document.getElementById('sim-nq-note');
    if (slider) {
        slider.disabled = mode === 'oficial';
        slider.hidden = mode === 'oficial';
    }
    document.getElementById('sim-nq-card').classList.toggle('sim-fixed-nq', mode === 'oficial');
    if (note) note.textContent = mode === 'oficial'
        ? 'Este simulacro usa todas sus preguntas; puedes elegir el tiempo.'
        : 'Elige cuántas preguntas quieres resolver.';

    if (mode === 'completo') {
        simState.selectedMateria = null;
        document.getElementById('sim-sum-materia').textContent = 'aleatorio';
        if (CampusAccess.isFree() && slider) {
            slider.min = 1;
            slider.max = Math.max(1, simState._cache.length);
            slider.step = 1;
            slider.value = Math.max(1, simState._cache.length);
        }
    } else if (mode === 'oficial') {
        if (simState.selectedExamen) selectSimOficial(simState.selectedExamen);
    } else if (mode === 'materia') {
        document.getElementById('sim-sum-materia').textContent = simState.selectedMateria
            ? simState.selectedMateria.toLowerCase() : 'por materia';
    }
    if (mode !== 'oficial' && slider) {
        updateSimNQ();
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
    if (simState.mode === 'oficial') return;
    var val = parseInt(document.getElementById('sim-nq-slider').value);
    simState.nPreguntas = val;
    document.getElementById('sim-nq-value').textContent = val;
    document.getElementById('sim-sum-nq').textContent = val;
};

// ── Iniciar simulacro ──
window.iniciarSimulacro = async function () {
    if (CampusAccess.isFree() && simState.mode === 'oficial') return CampusAccess.unlock();
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
                rows = await fetchAllBancoQuestions();
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
        simState.endTimestamp = simState.startTimestamp + simState.secondsLeft * 1000;

        // Actualizar header
        document.getElementById('sim-exam-materia').textContent =
            simState.mode === 'oficial' ? simState.selectedExamen.toLowerCase() :
                (simState.mode === 'materia' ? simState.selectedMateria.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud') : 'simulacro aleatorio');

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
        var remaining = Math.ceil((simState.endTimestamp - Date.now()) / 1000);
        simState.secondsLeft = simState.mode === 'pasado' && !simState.strictTiming ? remaining : Math.max(0, remaining);
        updateSimTimerDisplay();
        if (simState.secondsLeft <= 0 && (simState.mode !== 'pasado' || simState.strictTiming)) {
            clearInterval(simState.timerInterval);
            simState.timerInterval = null;
            showToast('⏰ tiempo agotado — finalizando simulacro', 'info');
            finalizarSimulacro();
        }
    }, 1000);
}

function updateSimTimerDisplay() {
    var overtime = simState.mode === 'pasado' && !simState.strictTiming && simState.secondsLeft < 0;
    var s = overtime ? Math.abs(simState.secondsLeft) : Math.max(0, simState.secondsLeft);
    var m = Math.floor(s / 60);
    var sec = s % 60;
    var txt = (overtime ? '+' : '') + (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
    var el = document.getElementById('sim-timer-display');
    var wrap = document.getElementById('sim-timer-wrap');
    if (el) el.textContent = txt;
    if (wrap) {
        wrap.classList.toggle('sim-timer-danger', simState.mode !== 'pasado' && s <= 120);
        wrap.title = simState.mode === 'pasado' && !simState.strictTiming ? '100 minutos de referencia. Puedes seguir respondiendo después; el signo + indica tiempo adicional.' : '';
    }
}

function renderSimQuestion() {
    var idx = simState.currentIdx;
    var q = simState.preguntas[idx];
    var ans = simState.answers[idx];

    document.getElementById('sim-cur-num').textContent = idx + 1;
    document.getElementById('sim-exam-section').textContent = ({
        MORFOFUNCION: 'Morfofunción', 'BIOLOGIA CELULAR': 'Biología celular',
        'SALUD PUBLICA': 'Educación para la Vida'
    })[normalizeDbText(campo(q, 'materia'))] || (simState.mode === 'pasado' ? 'Examen pasado' : 'Simulacro');
    document.getElementById('sim-answered-count').textContent =
        simState.answers.filter(function (answer) { return answer.selected !== null; }).length +
        ' de ' + simState.preguntas.length + ' respondidas';
    document.getElementById('sim-num-badge').textContent = 'N° ' + (q.numero_original || idx + 1);
    document.getElementById('sim-question-text').textContent = campo(q, 'pregunta') || '';
    document.getElementById('sim-question-text').style.whiteSpace = q.id?.startsWith('semana2-testb-') ? 'pre-line' : '';
    window.StudyMedia?.render(document.getElementById('sim-question-text'),q.study_image);
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
        var letter = document.createElement('span');
        letter.className = 'bq-option-letter';
        letter.textContent = letras[i];
        var label = document.createElement('span');
        label.className = 'bq-option-text';
        label.textContent = opcion;
        btn.append(letter, label);
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
    const pastPaper = simState.mode === 'pasado' || simState.mode === 'tema';
    el.hidden = pastPaper;
    const label = document.querySelector('#sim-exam .bq-dificultad-label');
    if (label) label.hidden = pastPaper;
    if (pastPaper) return;
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
    document.getElementById('sim-answered-count').textContent =
        simState.answers.filter(function (answer) { return answer.selected !== null; }).length +
        ' de ' + simState.preguntas.length + ' respondidas';
}

function buildSimCircles() {
    var container = document.getElementById('sim-circles');
    if (!container) return;
    container.innerHTML = '';
    var labels = { MORFOFUNCION: 'Morfofunción', 'BIOLOGIA CELULAR': 'Biología celular', 'SALUD PUBLICA': 'Educación para la Vida' };
    var currentSubject = '';
    simState.preguntas.forEach(function (question, i) {
        var subject = normalizeDbText(campo(question, 'materia'));
        if (subject !== currentSubject) {
            currentSubject = subject;
            var heading = document.createElement('div');
            heading.className = 'entrance-nav-heading';
            heading.textContent = labels[subject] || subject;
            container.appendChild(heading);
        }
        var btn = document.createElement('button');
        btn.className = 'bq-circle';
        btn.textContent = question.numero_original || i + 1;
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
    if (!confirm(simState.mode === 'tema' ? '¿Salir de la evaluación? Se descartarán tus respuestas.' : '¿salir del simulacro? perderás todo tu progreso.')) return;
    clearInterval(simState.timerInterval);
    simState.timerInterval = null;
    if (simState.mode === 'pasado' || simState.mode === 'tema') { simState.preguntas = []; simState.answers = []; returnToExamSelection(); }
    else showSimScreen('sim-config');
};

function simAcceptedAnswerIndices(q) {
    var values = Array.isArray(q.respuestas_aceptadas) && q.respuestas_aceptadas.length ? q.respuestas_aceptadas : [campo(q, 'respuesta_correcta') || 'A'];
    return values.map(function (value) {
        var key = String(value).trim().toUpperCase();
        return /^[A-E]$/.test(key) ? 'ABCDE'.indexOf(key) : parseInt(key, 10) - 1;
    }).filter(function (index) { return Number.isInteger(index) && index >= 0 && index < 5; });
}

window.finalizarSimulacro = function () {
    if (simState.finalized) return;
    simState.finalized = true;
    clearInterval(simState.timerInterval);
    simState.timerInterval = null;

    var tiempoUsado = simState.mode === 'pasado'
        ? Math.max(0, Math.floor((Date.now() - simState.startTimestamp) / 1000))
        : simState.duracion * 60 - Math.max(0, simState.secondsLeft);
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
            if (simAcceptedAnswerIndices(q).includes(ans.selected)) correctas++; else incorrectas++;
        }
    });

    var pct = total > 0 ? Math.round((correctas / total) * 100) : 0;
    var emoji = '😅', title = 'sigue practicando';
    if (pct >= 80) { emoji = '🏆'; title = '¡excelente dominio!'; }
    else if (pct >= 60) { emoji = '👏'; title = '¡muy bien!'; }
    else if (pct >= 40) { emoji = '📚'; title = 'puedes mejorar'; }

    document.getElementById('sim-result-emoji').textContent = emoji;
    document.getElementById('sim-result-title').textContent = simState.mode === 'oficial' && simState.independentScope
        ? (pct >= 80 ? 'Buen resultado en este bloque' : 'Revisa los mecanismos de este bloque') : title;
    document.getElementById('sim-result-score').textContent =
        correctas + ' de ' + total + ' correctas · ' + pct + '% de acierto' + (simState.selectedExamen === 'Simulacro Semana 2 – Test B – Grupo Virtual' ? ' · ' + correctas + '/50 puntos' : '');
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

    if (window.renderEntranceBreakdown) window.renderEntranceBreakdown();

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
            var isCorrect = ans.selected !== null && simAcceptedAnswerIndices(q).includes(ans.selected);
            var sinResp = ans.selected === null;
            var justif = simState.mode === 'tema' ? campo(q, 'justificacion') : bancoComentario(q);

            var item = document.createElement('div');
            item.className = 'sim-review-item' + (isCorrect ? ' sim-rev-ok' : sinResp ? ' sim-rev-pending' : ' sim-rev-fail');
            var header = document.createElement('div');
            header.className = 'sim-rev-header';
            var number = document.createElement('span');
            number.className = 'sim-rev-num';
            number.textContent = 'N° ' + (q.numero_original || i + 1);
            var badge = document.createElement('span');
            badge.className = 'sim-rev-badge';
            badge.textContent = isCorrect ? '✓ correcta' : sinResp ? '— sin responder' : '✗ incorrecta';
            header.append(number, badge);
            item.appendChild(header);
            var question = document.createElement('p');
            question.className = 'sim-rev-question';
            question.textContent = campo(q, 'pregunta') || '';
            if (q.id?.startsWith('semana2-testb-')) question.style.whiteSpace = 'pre-line';
            item.appendChild(question);
            if (ans.selected !== null && opciones[ans.selected]) {
                var selected = document.createElement('p');
                selected.className = 'sim-rev-tu-resp';
                selected.textContent = 'tu respuesta: ';
                var selectedAnswer = document.createElement('strong');
                selectedAnswer.textContent = opciones[ans.selected];
                selected.appendChild(selectedAnswer);
                item.appendChild(selected);
            }
            var correct = document.createElement('p');
            correct.className = 'sim-rev-correcta';
            correct.textContent = 'respuesta correcta: ';
            var correctAnswer = document.createElement('strong');
            correctAnswer.textContent = simAcceptedAnswerIndices(q).map(function (index) { return 'ABCDE'[index] + '. ' + (opciones[index] || '—'); }).join(' / ');
            correct.appendChild(correctAnswer);
            item.appendChild(correct);
            if (justif) {
                var explanation = document.createElement('p');
                explanation.className = 'sim-rev-justif';
                var explanationIcon = document.createElement('i');
                explanationIcon.className = 'fas fa-lightbulb';
                var explanationText = document.createElement('span');
                explanationText.textContent = justif;
                explanation.append(explanationIcon, explanationText);
                item.appendChild(explanation);
            }
            // Keep feedback in the existing review, after submission. Each option
            // explains its reasoning without revealing answers during the exam.
            if (simState.mode === 'tema' && q.comentarios_opciones) {
                var optionComments = document.createElement('div');
                optionComments.className = 'sim-rev-option-comments';
                opciones.forEach(function (option, optionIndex) {
                    var letter = 'ABCDE'[optionIndex];
                    var comment = q.comentarios_opciones[letter];
                    if (!comment) return;
                    var optionBlock = document.createElement('div');
                    optionBlock.className = 'sim-rev-option-comment';
                    var optionTitle = document.createElement('strong');
                    optionTitle.textContent = letter + '. ' + option;
                    var optionReason = document.createElement('p');
                    optionReason.textContent = comment;
                    optionBlock.append(optionTitle, optionReason);
                    optionComments.appendChild(optionBlock);
                });
                item.appendChild(optionComments);
            }
            if (q.fuente) {
                var source = document.createElement('p');
                source.className = 'sim-rev-source';
                source.textContent = 'Fuente: ' + q.fuente + (q.pagina_impresa ? ' · páginas impresas ' + q.pagina_impresa : '') + (q.paginas_pdf ? ' · páginas PDF ' + q.paginas_pdf : '');
                item.appendChild(source);
            }
            reviewList.appendChild(item);
        });
    }

    // Guardar en historial local
    guardarEnHistorial(pct, correctas, total, tiempoUsado,
        (simState.mode === 'materia' || simState.mode === 'tema') ? simState.selectedMateria : 'todas');

    // Sincronizar con la nube para el Panel de Admin
    guardarResultadoSimulacroEnNube({
        questionReview: window.QuestionReview?.snapshot(simState.preguntas,simState.answers,campo,simAcceptedAnswerIndices) || null,
        menuSection: simState.mode === 'tema' ? 'evaluaciones' : simState.mode === 'pasado' && !simState.entranceOrigin ? 'examenes' : 'simulacros',
        titulo: (simState.mode === 'oficial' || simState.mode === 'pasado' || simState.mode === 'tema') ? (simState.selectedExamen || 'Simulacro preparado') : 'Simulacro personalizado',
        materia: (simState.mode === 'materia' || simState.mode === 'tema') ? simState.selectedMateria :
            simState.mode === 'oficial' ? (simState._oficialesCache.find(function (r) { return r.nombre === simState.selectedExamen; }) || {}).materia || 'todas' : 'todas',
        porcentaje: pct,
        correctas: correctas,
        incorrectas: incorrectas,
        sinRespuesta: sinResponder,
        tiempoSegundos: tiempoUsado
    });

    if (window.renderPastExamResult) window.renderPastExamResult();
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

async function renderEvaluacion() {
    var historial = JSON.parse(localStorage.getItem('pb_historial') || '[]');

    if (currentUser) {
        var histMap = {};
        historial.forEach(function (h) {
            var key = h.materia + '|' + h.fecha;
            histMap[key] = h;
        });

        try {
            var sb = getSupabase();
            var [simRes, bancoRes] = await Promise.all([
                sb.from('resultados_simulacros')
                    .select('materia,created_at,porcentaje,correctas,incorrectas,sin_respuesta,tiempo_segundos')
                    .eq('user_id', currentUser.id)
                    .order('created_at', { ascending: false })
                    .limit(100),
                sb.from('resultados_banco')
                    .select('materia,created_at,porcentaje,correctas,total')
                    .eq('user_id', currentUser.id)
                    .order('created_at', { ascending: false })
                    .limit(100)
            ]);

            (simRes.data || []).forEach(function (r) {
                var total = (r.correctas || 0) + (r.incorrectas || 0) + (r.sin_respuesta || 0);
                var entry = {
                    fecha: r.created_at,
                    pct: r.porcentaje || 0,
                    correctas: r.correctas || 0,
                    total: total,
                    tiempoSeg: r.tiempo_segundos || 0,
                    materia: (r.materia || 'todas').toLowerCase()
                };
                var key = entry.materia + '|' + entry.fecha;
                if (!histMap[key]) { histMap[key] = entry; historial.push(entry); }
            });

            (bancoRes.data || []).forEach(function (r) {
                var entry = {
                    fecha: r.created_at,
                    pct: r.porcentaje || 0,
                    correctas: r.correctas || 0,
                    total: r.total || 0,
                    tiempoSeg: 0,
                    materia: (r.materia || 'todas').toLowerCase()
                };
                var key = entry.materia + '|' + entry.fecha;
                if (!histMap[key]) { histMap[key] = entry; historial.push(entry); }
            });

            historial.sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
            if (historial.length > 100) historial = historial.slice(0, 100);
        } catch (e) {
            console.warn('Error cargando historial de la nube:', e);
        }
    }

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
                '<span class="eval-materia-name">' + m.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud') + '</span>' +
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
                '<span class="eval-hist-materia">' + (h.materia || 'todas').toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud') + '</span>' +
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
    if (CampusAccess.isFree()) return CampusAccess.unlock();
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
        btn.textContent = m.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
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
    if (el) el.textContent = materia ? materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud') : 'todas las materias';
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
            (materia ? '<span class="vc-card-materia">' + materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud') + '</span>' : '') +
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
    selectedTema: null,
    currentTab: 'mapas'
};

window.openMindMaps = async function () {
    showScreen('intocables-screen');
    switchIntocTab('mapas');
    mmState.selectedMateria = null;
    mmState.selectedTema = null;
    document.getElementById('mm-materia-text').textContent = 'Todas las materias';
    document.getElementById('mm-search-input').value = '';
    await loadMapasMentales();
    closeMobileSidebar();
};
window.openIntocables = function () {
    showScreen('intocables-hub-screen');
    if (window.IntocablesHub) window.IntocablesHub.open();
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
        var localMapas = [
            { titulo: 'Temas principales de anatomía y fisiología', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_01_anatomia_y_fisiologia.webp', descripcion: 'Anatomía, fisiología, organización del cuerpo y homeostasis. Basado en el capítulo 1 de Saladin.', acceso_gratis: true, fecha: new Date().toISOString() },
            { titulo: 'La química de la vida', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_02_quimica_de_la_vida.webp', descripcion: 'Átomos, agua, metabolismo, biomoléculas y ATP. Basado en el capítulo 2 de Saladin.', acceso_gratis: true, fecha: new Date().toISOString() },
            { titulo: 'Forma y función celulares', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_03_forma_y_funcion_celulares.png', descripcion: 'Teoría celular, superficie, transporte, interior, síntesis y energía. Basado en el capítulo 3 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Genética y función celular', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_04_genetica_y_funcion_celular.png', descripcion: 'ADN, ARN, código genético, síntesis de proteínas, mitosis y herencia. Basado en el capítulo 4 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Histología', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_05_histologia.png', descripcion: 'Tejidos epitelial, conjuntivo, nervioso y muscular, y reparación tisular. Basado en el capítulo 5 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Sistema tegumentario', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_06_sistema_tegumentario.png', descripcion: 'Capas, funciones, células, anexos y lesiones de la piel. Basado en el capítulo 6 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Tejido óseo', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_07_tejido_oseo.png', descripcion: 'Células, matriz, crecimiento y remodelación ósea. Basado en el capítulo 7 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Sistema óseo', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_08_sistema_oseo.png', descripcion: 'Esqueleto axial y apendicular y sus principales regiones. Basado en el capítulo 8 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Articulaciones', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_09_articulaciones.png', descripcion: 'Tipos de articulaciones, movimientos y estabilidad. Basado en el capítulo 9 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Sistema muscular', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_10_sistema_muscular.png', descripcion: 'Organización y músculos principales de cabeza, tronco y extremidades. Basado en el capítulo 10 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Tejido muscular', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_11_tejido_muscular.png', descripcion: 'Tipos de músculo, unión neuromuscular, contracción y energía. Basado en el capítulo 11 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Tejido nervioso', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_12_tejido_nervioso.png', descripcion: 'Neuronas, neuroglía, impulsos, sinapsis e integración. Basado en el capítulo 12 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Médula espinal y reflejos', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_13_medula_reflejos.png', descripcion: 'Médula, nervios raquídeos, plexos y reflejos somáticos. Basado en el capítulo 13 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Encéfalo y pares craneales', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_14_encefalo_pares_craneales.png', descripcion: 'Protección, regiones del encéfalo y pares craneales. Basado en el capítulo 14 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Sistema nervioso autónomo', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_15_sistema_nervioso_autonomo.png', descripcion: 'Divisiones simpática, parasimpática y entérica y reflejos viscerales. Basado en el capítulo 15 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Órganos de los sentidos', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_16_organos_sentidos.png', descripcion: 'Receptores, sentidos generales, gusto, olfato, audición, equilibrio y visión. Basado en el capítulo 16 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Sistema endocrino', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_17_sistema_endocrino.png', descripcion: 'Hormonas, glándulas y control de la secreción. Basado en el capítulo 17 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'La sangre', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_18_sangre.png', descripcion: 'Plasma, eritrocitos, leucocitos, grupos sanguíneos y hemostasia. Basado en el capítulo 18 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'El corazón', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_19_corazon.png', descripcion: 'Circuitos, cámaras, válvulas, conducción y ciclo cardiaco. Basado en el capítulo 19 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Vasos sanguíneos y circulación', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_20_circulacion.png', descripcion: 'Vasos, presión, intercambio capilar y retorno venoso. Basado en el capítulo 20 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Sistema linfático e inmunitario', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_21_sistema_linfatico_inmunitario.png', descripcion: 'Red linfática, órganos, defensa innata e inmunidad específica. Basado en el capítulo 21 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Aparato respiratorio', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_22_aparato_respiratorio.png', descripcion: 'Vías aéreas, ventilación, intercambio y transporte gaseoso. Basado en el capítulo 22 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Aparato urinario', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_23_aparato_urinario.png', descripcion: 'Riñones, nefrona, filtración y formación de orina. Basado en el capítulo 23 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Equilibrio hídrico, electrolítico y acidobásico', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_24_equilibrio_hidrico_acidobasico.png', descripcion: 'Agua corporal, electrolitos, pH y regulación. Basado en el capítulo 24 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Aparato digestivo', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_25_aparato_digestivo.png', descripcion: 'Procesos digestivos y funciones de cada órgano. Basado en el capítulo 25 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Nutrición y metabolismo', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_26_nutricion_metabolismo.png', descripcion: 'Nutrientes, ATP, rutas metabólicas y temperatura. Basado en el capítulo 26 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Aparato reproductor masculino', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_27_reproductor_masculino.png', descripcion: 'Órganos, espermatogénesis y control hormonal. Basado en el capítulo 27 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Aparato reproductor femenino', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_28_reproductor_femenino.png', descripcion: 'Órganos, ciclos, embarazo y lactancia. Basado en el capítulo 28 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Desarrollo humano y envejecimiento', materia: 'Morfofunción', url_imagen: 'mapas mentales/morfo_29_desarrollo_envejecimiento.png', descripcion: 'Fecundación, etapas prenatal y neonatal y envejecimiento. Basado en el capítulo 29 de Saladin.', fecha: new Date().toISOString() },
            { titulo: 'Introducción a la biología celular', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_01_introduccion.png', descripcion: 'Origen de la biología celular, teoría celular, niveles de organización y células procariotas y eucariotas. Capítulo 1.', acceso_gratis: true, fecha: new Date().toISOString() },
            { titulo: 'Métodos y técnicas en biología celular', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_02_metodos_y_tecnicas.png', descripcion: 'Microscopía, preparación de muestras, cultivos celulares y análisis molecular. Capítulo 2.', acceso_gratis: true, fecha: new Date().toISOString() },
            { titulo: 'Estructura de la membrana plasmática', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_03_membrana_estructura.png', descripcion: 'Bicapa lipídica, proteínas de membrana y sus funciones. Capítulo 3.', fecha: new Date().toISOString() },
            { titulo: 'Microtransporte de membrana', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_04_microtransporte.png', descripcion: 'Difusión, canales, transportadores y bombas de membrana. Capítulo 4.', fecha: new Date().toISOString() },
            { titulo: 'Endocitosis y exocitosis', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_05_endocitosis_exocitosis.png', descripcion: 'Entrada y salida de material mediante vesículas. Capítulo 5.', fecha: new Date().toISOString() },
            { titulo: 'La célula y su entorno', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_06_entorno_celular.png', descripcion: 'Especializaciones de membrana, adhesión y matriz extracelular. Capítulo 6.', fecha: new Date().toISOString() },
            { titulo: 'Núcleo, cromatina y ADN', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_07_nucleo_cromatina_adn.png', descripcion: 'Organización de la cromatina y conservación de la información genética. Capítulo 7.', fecha: new Date().toISOString() },
            { titulo: 'Transcripción y ARN', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_08_transcripcion_arn.png', descripcion: 'Transcripción, maduración del ARN y nucléolo. Capítulo 8.', fecha: new Date().toISOString() },
            { titulo: 'Síntesis de proteínas', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_09_sintesis_proteinas.png', descripcion: 'Código genético, ribosomas, traducción y destino de las proteínas. Capítulo 9.', fecha: new Date().toISOString() },
            { titulo: 'Sistema de endomembranas', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_10_endomembranas.png', descripcion: 'Retículo endoplasmático, Golgi, vesículas y lisosomas. Capítulo 10.', fecha: new Date().toISOString() },
            { titulo: 'Mitocondrias y peroxisomas', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_11_mitocondrias_peroxisomas.png', descripcion: 'Estructura y función mitocondrial, bioenergética y peroxisomas. Capítulo 11.', fecha: new Date().toISOString() },
            { titulo: 'El citoesqueleto', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_12_citoesqueleto.png', descripcion: 'Microtúbulos, microfilamentos, filamentos intermedios y proteínas motoras. Capítulo 12.', fecha: new Date().toISOString() },
            { titulo: 'Señalización celular', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_13_senales.png', descripcion: 'Señales, receptores, transducción y respuestas celulares. Capítulo 13.', fecha: new Date().toISOString() },
            { titulo: 'Ciclo celular', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_14_ciclo_celular.png', descripcion: 'Fases, regulación, puntos de control y destinos celulares. Capítulo 14.', fecha: new Date().toISOString() },
            { titulo: 'División y muerte celular', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_15_division_muerte.png', descripcion: 'Mitosis, meiosis, citocinesis, apoptosis y equilibrio tisular. Capítulo 15.', fecha: new Date().toISOString() },
            { titulo: 'Biología celular del cáncer', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_16_cancer.png', descripcion: 'Origen, proliferación, diseminación y tratamiento del cáncer. Capítulo 16.', fecha: new Date().toISOString() },
            { titulo: 'Respuesta inmunitaria', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_17_respuesta_inmunitaria.png', descripcion: 'Defensa innata y adaptativa, linfocitos y regulación. Capítulo 17.', fecha: new Date().toISOString() },
            { titulo: 'Células madre', materia: 'Biología Celular', url_imagen: 'mapas mentales/biocel_18_celulas_madre.png', descripcion: 'Autorrenovación, diferenciación y aplicaciones terapéuticas. Capítulo 18.', fecha: new Date().toISOString() },
            { titulo: 'Citoesqueleto', materia: 'Biología Celular', url_imagen: 'mapas mentales/citoesqueleto.png', descripcion: 'Estructura y función del citoesqueleto: microtúbulos, microfilamentos y filamentos intermedios.', fecha: new Date().toISOString() },
            { titulo: 'La Célula', materia: 'Biología Celular', url_imagen: 'mapas mentales/lacelula.png', descripcion: 'Visión general de la célula: tipos, organelos y funciones fundamentales.', acceso_gratis: true, fecha: new Date().toISOString() },
            { titulo: 'Membrana Plasmática', materia: 'Biología Celular', url_imagen: 'mapas mentales/membranaplasmatica.png', descripcion: 'Composición y funciones de la membrana celular: bicapa lipídica, proteínas y transporte.', fecha: new Date().toISOString() },
            { titulo: 'Núcleo Celular', materia: 'Biología Celular', url_imagen: 'mapas mentales/nucleocelular.png', descripcion: 'Estructura nuclear: envoltura nuclear, cromatina, nucléolo y funciones del núcleo.', fecha: new Date().toISOString() },
            { titulo: 'Organelos Celulares', materia: 'Biología Celular', url_imagen: 'mapas mentales/organeloscelulares.png', descripcion: 'Principales organelos: retículo endoplásmico, aparato de Golgi, mitocondrias, lisosomas y más.', fecha: new Date().toISOString() },
            { titulo: 'Educación en salud', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_01_educacion_en_salud.png', descripcion: 'Propósito, personas y comunidades, promoción, prevención. PDF pp. 2–3 de Educación en Salud e Investigación.', acceso_gratis: true, fecha: new Date().toISOString() },
            { titulo: 'Determinantes de la salud', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_02_determinantes.png', descripcion: 'condiciones de vida, factores sociales, entorno, persona. PDF pp. 3–4 de Educación en Salud e Investigación.', acceso_gratis: true, fecha: new Date().toISOString() },
            { titulo: 'Promoción y prevención', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_03_promocion_prevencion.png', descripcion: 'promoción, prevención primaria, prevención secundaria, prevención terciaria. PDF pp. 5, 18–20 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Marcos internacionales de salud', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_04_marcos_internacionales.png', descripcion: 'ottawa, políticas, entornos, participación. PDF pp. 6–9 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Salud pública en Bolivia', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_05_salud_publica_bolivia.png', descripcion: 'derecho a la salud, sus, safci, participación. PDF p. 10, 23 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Políticas públicas de salud', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_06_politicas_salud.png', descripcion: 'qué son, objetivos, principios, instrumentos. PDF pp. 11–15 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Educación para la salud', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_07_educacion_para_salud.png', descripcion: 'proceso, conocimientos, actitudes, prácticas. PDF pp. 16–18 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Factores de riesgo', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_08_factores_riesgo.png', descripcion: 'qué son, no modificables, modificables, sociales. PDF p. 21 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Salud comunitaria', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_09_salud_comunitaria.png', descripcion: 'comunidad, planificación, gestión, control. PDF p. 22 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Programas de salud en Bolivia', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_10_programas_salud.png', descripcion: 'función, promoción, prevención, atención. PDF pp. 23–25 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Vigilancia de salud prioritaria', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_11_vigilancia_prioritaria.png', descripcion: 'propósito, vectoriales, zoonóticas, vacunación. PDF pp. 26–31 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Epidemiología social', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_12_epidemiologia_social.png', descripcion: 'pregunta, determinantes, desigualdades, proceso. PDF pp. 32–38 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Proceso investigativo', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_13_proceso_investigativo.png', descripcion: 'inicio, planificar, diseño, recolección. PDF pp. 39–50 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Problema y objetivos de investigación', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_14_problema_investigacion.png', descripcion: 'observar, delimitar, pregunta, objetivos. PDF pp. 50–59 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Marco teórico e hipótesis', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_15_marco_teorico_hipotesis.png', descripcion: 'buscar, organizar, marco teórico, hipótesis. PDF pp. 60–74 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Conceptos generales de estadística', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_16_conceptos_estadistica.png', descripcion: 'estadística, población, muestra, unidad. PDF pp. 85–96 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Tipos de muestreo', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_17_muestreo.png', descripcion: 'propósito, probabilístico, aleatorio simple, estratificado. PDF pp. 97–107 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Tabulación de datos', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_18_tabulacion_datos.png', descripcion: 'ordenar, rango, clases, amplitud. PDF pp. 108–118 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Distribución de frecuencias', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_19_frecuencias.png', descripcion: 'tabla, absoluta, relativa, acumulada. PDF pp. 119–126 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Gráficas de datos', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_20_graficas_datos.png', descripcion: 'propósito, histograma, polígono, ojiva. PDF pp. 127–138 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Tablas cruzadas', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_21_tablas_cruzadas.png', descripcion: 'dos variables, contingencia, por fila, por columna. PDF pp. 139–146 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Tendencia central', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_22_tendencia_central.png', descripcion: 'propósito, media, mediana, moda. PDF pp. 147–160 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Medidas de posición', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_23_medidas_posicion.png', descripcion: 'ordenar, cuartiles, deciles, percentiles. PDF pp. 161–170 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Medidas de dispersión', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_24_dispersion.png', descripcion: 'idea, rango, intercuartil, varianza. PDF pp. 171–182 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Medidas de forma', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_25_medidas_forma.png', descripcion: 'propósito, simetría, asimetría positiva, asimetría negativa. PDF pp. 183–190 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Estadística con Excel', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_26_estadistica_excel.png', descripcion: 'preparar, herramienta, selección, resultados. PDF pp. 191–200 de Educación en Salud e Investigación.', fecha: new Date().toISOString() },
            { titulo: 'Estadística con SPSS', materia: 'Educación para la Salud', url_imagen: 'mapas mentales/salud_27_estadistica_spss.png', descripcion: 'preparar, ingresar, revisar, analizar. PDF pp. 201–232 de Educación en Salud e Investigación.', fecha: new Date().toISOString() }
        ];
        localMapas.forEach(function(m){
            m.acceso_gratis=true;m.tema=m.titulo;
            var restricted=/\/(morfo_16_organos_sentidos|morfo_18_sangre)\.png$/.exec(m.url_imagen);
            if(restricted){
                m.id=restricted[1];m.general=true;m.premium=true;m.acceso_gratis=false;
                m.preview='/assets/mindmaps/previews/'+m.id+'.webp';
                m.url_imagen='private/'+m.id+'.json';
            }
        });
        mmState.allMapas = localMapas.concat((window.MINDMAP_PREMIUM_CATALOG || []).filter(m => !m.curated && m.section !== 'intocables'));
        populateMmMaterias();
        populateMmTemas();
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
        btn.textContent = m.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud');
        btn.onclick = function () { selectMmMateria(m); };
        dd.appendChild(btn);
    });
}

function mmTopicKey(m) {
    return (campo(m, 'materia') || '') + '\u001f' + (campo(m, 'tema') || campo(m, 'titulo') || '');
}

function populateMmTemas() {
    var select = document.getElementById('mm-tema-select');
    if (!select) return;
    var previous = mmState.selectedTema;
    var rows = mmState.allMapas.filter(function (m) {
        return (!campo(m, 'premium') || campo(m, 'general')) && (!mmState.selectedMateria || campo(m, 'materia') === mmState.selectedMateria);
    });
    select.replaceChildren(new Option('Todos los temas', ''));
    rows.sort(function (a, b) {
        return (campo(a, 'titulo') || '').localeCompare(campo(b, 'titulo') || '', 'es');
    }).forEach(function (m) {
        var title = campo(m, 'titulo') || 'Sin título';
        var label = mmState.selectedMateria ? title : title + ' · ' + (campo(m, 'materia') || '');
        select.add(new Option(label, mmTopicKey(m)));
    });
    select.value = rows.some(function (m) { return mmTopicKey(m) === previous; }) ? previous : '';
    mmState.selectedTema = select.value || null;
}

window.toggleMmDropdown = function () {
    var dd = document.getElementById('mm-materia-dropdown');
    var btn = document.getElementById('mm-materia-btn');
    if (!dd || !btn) return;
    var isOpen = !dd.classList.contains('hidden');
    dd.classList.toggle('hidden', isOpen);
    btn.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
};

window.selectMmMateria = function (materia) {
    mmState.selectedMateria = materia;
    mmState.selectedTema = null;
    var el = document.getElementById('mm-materia-text');
    if (el) el.textContent = materia ? materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud') : 'Todas las materias';
    var dd = document.getElementById('mm-materia-dropdown');
    var btn = document.getElementById('mm-materia-btn');
    if (dd) dd.classList.add('hidden');
    if (btn) { btn.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    populateMmTemas();
    filterMapas();
};

window.selectMmTema = function (tema) {
    mmState.selectedTema = tema || null;
    filterMapas();
};

window.clearMmFilters = function () {
    document.getElementById('mm-search-input').value = '';
    selectMmMateria(null);
};

function normalizeMmText(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

window.filterMapas = function () {
    var q = normalizeMmText(((document.getElementById('mm-search-input') || {}).value || '').trim());
    mmState.filteredMapas = mmState.allMapas.filter(function (m) {
        var matchMat = !mmState.selectedMateria || campo(m, 'materia') === mmState.selectedMateria;
        var matchTema = !mmState.selectedTema || mmTopicKey(m) === mmState.selectedTema;
        var searchable = normalizeMmText((campo(m, 'titulo') || '') + ' ' + (campo(m, 'descripcion') || '') + ' ' + (campo(m, 'tema') || ''));
        var matchQ = !q || searchable.includes(q);
        return matchMat && matchTema && matchQ;
    });
    if (window.CampusAccess && CampusAccess.isFree()) {
        mmState.filteredMapas.sort(function (a, b) {
            return Number(Boolean(campo(b, 'acceso_gratis'))) - Number(Boolean(campo(a, 'acceso_gratis')));
        });
    }
    var count = document.getElementById('mm-results-count');
    if (count) count.textContent = mmState.filteredMapas.length + (mmState.filteredMapas.length === 1 ? ' mapa' : ' mapas');
    var emptyTitle = document.getElementById('mm-empty-title');
    var emptyText = document.getElementById('mm-empty-text');
    if (emptyTitle) emptyTitle.textContent = mmState.allMapas.length ? 'No hay mapas para estos filtros' : 'Aún no hay mapas mentales';
    if (emptyText) emptyText.textContent = mmState.allMapas.length ? 'Prueba otra materia, tema o palabra.' : 'Los mapas se irán publicando poco a poco.';
    renderMmGrid();
};

function renderMmGrid() {
    setMmState(mmState.filteredMapas.length === 0 ? 'empty' : 'grid');
    var grid = document.getElementById('mm-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (mmState.filteredMapas.length === 0) return;
    mmState.filteredMapas.forEach(function (m, index) {
        var titulo = campo(m, 'titulo') || 'Sin título';
        var materia = campo(m, 'materia') || '';
        var urlImg = campo(m, 'url_imagen') || campo(m, 'url_image') || '';
        var desc = campo(m, 'descripcion') || '';
        var locked = window.CampusAccess && CampusAccess.isFree() && !campo(m, 'acceso_gratis');
        var safeTitle = escapeMmText(titulo);
        var safeMateria = escapeMmText(materia.toLowerCase().replace(/^salud p[úu]blica$/, 'educación para la salud'));
        var safeDesc = escapeMmText(desc);
        var safeUrl = escapeMmText(urlImg);
        var previewUrl = campo(m, 'preview') || getMmThumbnailUrl(urlImg);
        var safePreviewUrl = escapeMmText(previewUrl);
        var fallbackAttr = !campo(m, 'premium') && previewUrl !== urlImg ? ' data-fallback="' + safeUrl + '"' : '';
        var loadingAttr = index < 3 ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';

        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'mm-card' + (locked ? ' mm-card-locked' : '');
        card.setAttribute('aria-label', locked ? 'Desbloquear mapa ' + titulo : 'Abrir mapa ' + titulo);
        card.onclick = function () { if (locked) openMmUnlockDialog(m); else openMmLightbox(m); };
        card.innerHTML =
            '<div class="mm-card-thumb">' +
            (urlImg
                ? '<img src="' + safePreviewUrl + '"' + fallbackAttr + ' alt="' + (locked ? '' : safeTitle) + '"' + loadingAttr + ' decoding="async" class="mm-card-img' + (locked ? ' mm-card-img-locked' : '') + '" onerror="fallbackMmPreview(this)">' +
                '<div class="mm-card-img-placeholder" style="display:none"><i class="fas fa-project-diagram"></i></div>'
                : '<div class="mm-card-img-placeholder"><i class="fas fa-project-diagram"></i></div>') +
            (urlImg ? '<span class="mm-card-watermark" aria-hidden="true">PREPA BEN CARSON</span>' : '') +
            (locked ? '<span class="mm-preview-scrim" aria-hidden="true"><span class="mm-preview-label"><i class="fas fa-lock"></i> Vista previa</span></span>' : '<div class="mm-zoom-overlay"><i class="fas fa-expand"></i></div>') +
            '</div>' +
            '<div class="mm-card-body">' +
            (materia ? '<span class="mm-card-materia">' + safeMateria + '</span>' : '') +
            (locked ? '<span class="mm-card-access"><i class="fas fa-lock" aria-hidden="true"></i> Con plan</span>' : campo(m, 'premium') && !campo(m, 'general') ? '' : '<span class="mm-card-access">Mapa general</span>') +
            '<h3 class="mm-card-title">' + safeTitle + '</h3>' +
            (locked ? '<span class="mm-card-preview-action">Desbloquear</span>' : desc ? '<p class="mm-card-desc">' + safeDesc + '</p>' : '') +
            '</div>';
        grid.appendChild(card);
    });

}
function getMmThumbnailUrl(url) {
    var key = (url || '').split('/').pop().split('?')[0];
    var asset = (window.MINDMAP_ASSETS || {})[key];
    if (asset && asset.thumbnail) return asset.thumbnail;
    var match = /^mapas mentales\/([^/?#]+)\.(?:png|jpe?g|webp)$/i.exec(url || '');
    return match ? 'mapas mentales/thumbs/' + match[1] + '.webp' : url;
}

window.fallbackMmPreview = function (image) {
    if (image.dataset.fallback) {
        var original = image.dataset.fallback;
        delete image.dataset.fallback;
        image.src = original;
        return;
    }
    image.style.display = 'none';
    if (image.nextElementSibling) image.nextElementSibling.style.display = 'flex';
};

function escapeMmText(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
}

window.openMmUnlockDialog = function (m) {
    if (!window.CampusAccess || !CampusAccess.isFree()) return openMmLightbox(m);
    var dialog = document.getElementById('mm-unlock-dialog');
    if (!dialog) return;
    document.getElementById('mm-unlock-title').textContent = campo(m, 'titulo') || 'Mapa mental';
    var image = document.getElementById('mm-unlock-image');
    var originalUrl = campo(m, 'url_imagen') || campo(m, 'url_image') || '';
    var previewUrl = campo(m, 'preview') || getMmThumbnailUrl(originalUrl);
    image.style.display = '';
    image.dataset.fallback = !campo(m, 'premium') && previewUrl !== originalUrl ? originalUrl : '';
    image.onerror = function () { fallbackMmPreview(image); };
    image.src = previewUrl;
    if (!dialog.open) dialog.showModal();
};

window.closeMmUnlockDialog = function () {
    var dialog = document.getElementById('mm-unlock-dialog');
    if (dialog && dialog.open) dialog.close();
};

window.confirmMmUnlock = function () {
    closeMmUnlockDialog();
    CampusAccess.unlock();
};

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
    if (window.CampusAccess && CampusAccess.isFree() && !campo(m, 'acceso_gratis')) return openMmUnlockDialog(m);
    var lb = document.getElementById('mm-lightbox');
    if (!lb) return;
    var urlImg = campo(m, 'url_imagen') || campo(m, 'url_image') || '';
    var image = document.getElementById('mm-lb-img');
    var previewUrl = campo(m, 'preview') || getMmThumbnailUrl(urlImg);
    image.dataset.fullUrl = urlImg;
    image.src = previewUrl;
    if (previewUrl !== urlImg) {
        var fullImage = new Image();
        fullImage.decoding = 'async';
        fullImage.onload = function () {
            if (image.dataset.fullUrl === urlImg) image.src = urlImg;
        };
        fullImage.src = urlImg;
    }
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
        const payload = {
            user_id: currentUser.id,
            user_email: currentUser.email,
            user_name: (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email.split('@')[0],
            simulacro_titulo: String(resultado.titulo || 'Simulacro'),
            materia: String(resultado.materia || 'General'),
            porcentaje: Math.round(Number(resultado.porcentaje || 0)),
            correctas: Math.round(Number(resultado.correctas || 0)),
            incorrectas: Math.round(Number(resultado.incorrectas || 0)),
            sin_respuesta: Math.round(Number(resultado.sinRespuesta || 0)),
            tiempo_segundos: Math.round(Number(resultado.tiempoSegundos || 0)),
            menu_section: resultado.menuSection || 'simulacros',
            question_review: resultado.questionReview || null
        };
        let { error } = await sb.from('resultados_simulacros').insert(payload);
        if (error?.code === 'PGRST204' && /menu_section/.test(error.message)) { delete payload.menu_section; ({error} = await sb.from('resultados_simulacros').insert(payload)); }
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
            materia: String(resultado.materia || 'General'),
            tema: String(resultado.tema || 'Práctica'),
            dificultad: String(resultado.dificultad || 'Normal'),
            total: Math.round(Number(resultado.total || 0)),
            correctas: Math.round(Number(resultado.correctas || 0)),
            incorrectas: Math.round(Number(resultado.incorrectas || 0)),
            porcentaje: Math.round(Number(resultado.porcentaje || 0)),
            question_review: resultado.questionReview || null
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

async function sincronizarFlashcardsEnNube() {
    if (!currentUser || missingCloudTables.progreso_flashcards) return;
    try {
        const sb = getSupabase();
        const { error } = await sb.from('progreso_flashcards').upsert({
            user_id: currentUser.id,
            user_email: currentUser.email,
            user_name: (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email.split('@')[0],
            repasos_totales: totalReviews,
            ultima_sesion: new Date().toISOString()
        }, { onConflict: 'user_id' });
        if (error) {
            if (isMissingSupabaseTableError(error)) {
                missingCloudTables.progreso_flashcards = true;
                console.info('[Flashcards] progreso_flashcards no existe; progreso local activo.');
                return;
            }
            console.error('[Flashcards] Error sincronizando:', error.message);
        }
    } catch (e) {
        console.warn('[Flashcards] Error fatal en la nube:', e);
    }
}

async function sincronizarPerfilEnNube() {
    if (!currentUser) return;
    try {
        const sb = getSupabase();
        const name = (currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email.split('@')[0];

        if (!missingCloudTables.user_profiles) {
            const { error } = await sb.from('user_profiles').upsert({
                user_id: currentUser.id,
                email: currentUser.email,
                full_name: name,
                last_seen: new Date().toISOString()
            }, { onConflict: 'user_id' });

            if (!error) return;
            if (!isMissingSupabaseTableError(error)) {
                console.warn('[Auth] Error sincronizando user_profiles:', error.message);
                return;
            }
            missingCloudTables.user_profiles = true;
            console.info('[Auth] user_profiles no existe; probando profiles.');
        }

        if (!missingCloudTables.profiles) {
            const { error } = await sb.from('profiles').upsert({
                id: currentUser.id,
                email: currentUser.email,
                full_name: name,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

            if (error) {
                if (isMissingSupabaseTableError(error)) {
                    missingCloudTables.profiles = true;
                    console.info('[Auth] profiles no existe; perfil local activo.');
                    return;
                }
                console.warn('[Auth] Error sincronizando profiles:', error.message);
            }
        }
    } catch (e) {
        console.warn('[Auth] Error sincronizando perfil:', e);
    }
}

// ══════════════════════════════════════════════
// MINI CALENDAR
// ══════════════════════════════════════════════
(function() {
    var calMonth = new Date().getMonth();
    var calYear = new Date().getFullYear();
    var months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

    function renderCalendar() {
        var label = document.getElementById('cal-month-label');
        var grid = document.getElementById('cal-days-grid');
        if (!label || !grid) return;

        label.textContent = months[calMonth] + ' ' + calYear;

        var firstDay = new Date(calYear, calMonth, 1).getDay();
        firstDay = firstDay === 0 ? 6 : firstDay - 1;
        var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
        var daysInPrev = new Date(calYear, calMonth, 0).getDate();

        var today = new Date();
        var html = '';

        for (var i = firstDay - 1; i >= 0; i--) {
            html += '<span class="cal-day other-month">' + (daysInPrev - i) + '</span>';
        }
        for (var d = 1; d <= daysInMonth; d++) {
            var isToday = (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear());
            html += '<span class="cal-day' + (isToday ? ' today' : '') + '">' + d + '</span>';
        }
        var totalCells = firstDay + daysInMonth;
        var remaining = (7 - (totalCells % 7)) % 7;
        for (var r = 1; r <= remaining; r++) {
            html += '<span class="cal-day other-month">' + r + '</span>';
        }
        grid.innerHTML = html;
    }

    document.addEventListener('DOMContentLoaded', function() {
        renderCalendar();
        var prevBtn = document.getElementById('cal-prev');
        var nextBtn = document.getElementById('cal-next');
        if (prevBtn) prevBtn.addEventListener('click', function() {
            calMonth--;
            if (calMonth < 0) { calMonth = 11; calYear--; }
            renderCalendar();
        });
        if (nextBtn) nextBtn.addEventListener('click', function() {
            calMonth++;
            if (calMonth > 11) { calMonth = 0; calYear++; }
            renderCalendar();
        });
    });
})();
