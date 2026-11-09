// Configuracion compartida. Se carga desde config.js cuando esta disponible.
const CONFIG = window.ALCOCER_CONFIG || {
    SUPABASE_URL: 'https://asnwhddmurstzmghuyin.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo',
    ADMIN_EMAILS: ['admin@alcocermed.com', 'admin@bencarson.com', 'rubenconcha@example.com', 'pichon4488@gmail.com']
};
const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_KEY;
const ADMIN_EMAILS = (CONFIG.ADMIN_EMAILS || []).map(function(e) { return String(e).toLowerCase(); });

let _supabase = null;
let _supabaseSdkPromise = null;
const scriptRequests = new Map();

function loadScriptOnce(src, ordered = false) {
    const url = new URL(src, document.baseURI).href;
    if (scriptRequests.has(url)) return scriptRequests.get(url);
    const request = new Promise(function(resolve, reject) {
        const existing = Array.from(document.scripts).find(function(script) { return script.src === url; });
        if (existing && existing.dataset.loaded === '1') {
            resolve();
            return;
        }

        const script = existing || document.createElement('script');
        let done = false;
        const timer = setTimeout(function() {
            if (done) return;
            done = true;
            if (!existing) script.remove();
            reject(new Error('timeout cargando ' + src));
        }, existing ? 8000 : 25000);

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
            if (!existing) script.remove();
            reject(new Error('no se pudo cargar ' + src));
        };

        if (!existing) {
            script.src = url;
            script.async = !ordered;
            document.head.appendChild(script);
        }
    }).catch(error => { scriptRequests.delete(url); throw error; });
    scriptRequests.set(url, request);
    return request;
}

const campusAssetRequests = new Map();
const campusAssetStyles = new Map();
let pastExamCatalogRequest;

window.loadPastExamCatalog = () => {
    if (window.CampusCatalogs?.past) return Promise.resolve(window.CampusCatalogs.past);
    if (!pastExamCatalogRequest) {
        pastExamCatalogRequest = fetch('/content/past-exams/catalog.json?v=examenes-umss')
            .then(response => {
                if (!response.ok) throw new Error('No se pudo cargar el catálogo de exámenes. Intenta de nuevo.');
                return response.json();
            }).catch(error => {
                pastExamCatalogRequest = null;
                throw error;
            });
    }
    return pastExamCatalogRequest;
};

function loadCampusStyle(url) {
    if (campusAssetStyles.has(url)) return campusAssetStyles.get(url);
    const request = new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        const timeout = setTimeout(() => link.onerror(), 25000);
        link.onload = () => { clearTimeout(timeout); resolve(); };
        link.onerror = () => {
            clearTimeout(timeout);
            link.remove();
            reject(new Error('No se pudo cargar ' + url));
        };
        document.head.insertBefore(link, document.getElementById('campus-shell-style'));
    }).catch(error => { campusAssetStyles.delete(url); throw error; });
    campusAssetStyles.set(url, request);
    return request;
}

window.loadCampusAssets = function (group) {
    if (group === 'past') window.loadPastExamCatalog().catch(() => {});
    if (campusAssetRequests.has(group)) return campusAssetRequests.get(group);
    const template = document.getElementById('campus-section-assets');
    if (!template) return Promise.resolve();
    const nodes = template.content.querySelectorAll(`[data-campus-assets~="${group}"]`);
    const request = Promise.all(Array.from(nodes, node => node.localName === 'link'
        ? loadCampusStyle(node.getAttribute('href'))
        : loadScriptOnce(node.getAttribute('src'), true)))
        .catch(error => { campusAssetRequests.delete(group); throw error; });
    campusAssetRequests.set(group, request);
    return request;
};

async function ensureSupabaseSdk() {
    if (window.supabase && window.supabase.createClient) return window.supabase;
    if (!_supabaseSdkPromise) {
        _supabaseSdkPromise = loadScriptOnce('/assets/vendor/supabase.js?v=2.118.0')
            .catch(function() {
                return loadScriptOnce('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0');
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

    const login = document.getElementById('login-screen');
    try {
        const project = new URL(SUPABASE_URL).hostname.split('.')[0];
        if (localStorage.getItem('sb-' + project + '-auth-token')) window.loadCampusAssets('campus').catch(() => {});
    } catch (_) { /* Sign-in also works with browser storage disabled. */ }
    try {
        await ensureSupabaseSdk();
        var client = getSupabase();
        if (!client) throw new Error('Supabase client failed to initialize');
        var res = await client.auth.getSession();
        var session = res.data.session;

        if (session?.user && !currentUser) {
            if (login) login.inert = true;
            currentUser = session.user;
            await enterApp(currentUser);
        }
    } catch (e) {
        console.error('Error verificando sesión:', e);
        showLoginScreen();
        // Mostrar error visual si es un fallo de inicialización
        if (e.message.includes('Supabase')) {
             setTimeout(function() { showLoginError('error al conectar con el servidor. revisa tu internet.'); }, 500);
        }
    } finally {
        if (login) login.inert = false;
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

function showLoginScreen() {
    window.CampusStudy?.reset();
    document.body.classList.add('login-active');
    var loginScreen = document.getElementById('login-screen');
    if (loginScreen) loginScreen.classList.remove('hidden');
    var emailEl = document.getElementById('login-email');
    var passEl = document.getElementById('login-password');
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
    hideLoginError();
}

let campusEntry = null;
let verifiedCampusUserId = null;
async function verifyCampusDevice(client, user) {
    if (!user.email || ADMIN_EMAILS.includes(user.email.toLowerCase())) return;
    if (typeof DeviceGuard === 'undefined') throw new Error('No pudimos verificar tus dispositivos. Recarga la página.');
    const device = await DeviceGuard.activateDevice(client, user.email);
    if (device.ok) return;
    if (device.code === 'DEVICE_LIMIT' && currentUser?.id === user.id) {
        await client.auth.signOut({ scope: 'local' });
        if (currentUser?.id === user.id) currentUser = null;
    }
    throw new Error(device.error || 'No pudimos verificar este dispositivo.');
}
function enterApp(user) {
    if (!user || currentUser?.id !== user.id) return Promise.resolve();
    if (verifiedCampusUserId === user?.id && !document.body.classList.contains('login-active')) return Promise.resolve();
    if (campusEntry?.owner === user.id) return campusEntry.promise;
    const entry = { owner: user.id };
    campusEntry = entry;
    entry.promise = (async function () {
        try {
            const client = getSupabase();
            const [, access] = await Promise.all([
                verifyCampusDevice(client, user),
                CampusAccess.check(client),
                window.loadCampusAssets('campus'),
            ]);
            if (campusEntry !== entry || currentUser?.id !== user.id) return;
            window.CampusStudy.activate(user, access);
        } catch (error) {
            if (campusEntry === entry) {
                showLoginScreen();
                showLoginError(error.message);
            }
        } finally { if (campusEntry === entry) campusEntry = null; }
    })();
    return entry.promise;
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
    window.loadCampusAssets('campus').catch(() => {});
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

/** Toggle visibilidad contraseña */
window.togglePasswordVisibility = function () {
    const input = document.getElementById('login-password');
    const icon = document.getElementById('login-eye-icon');
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        icon?.setAttribute('href', '#login-eye-slash');
    } else {
        input.type = 'password';
        icon?.setAttribute('href', '#login-eye');
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


initAuth();
