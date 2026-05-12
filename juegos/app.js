// ═══════════════════════════════════════════════
// ALCOCERMED JUEGOS — APP.JS
// Student-first platform with admin gating
// ═══════════════════════════════════════════════

var SUPABASE_URL = 'https://asnwhddmurstzmghuyin.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';
var ADMIN_EMAIL = 'pichon4488@gmail.com';

var sb = null;
var currentUser = null;
var isAdmin = false;

function getSupabase() {
    if (!sb) {
        if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
            console.error('Supabase library not loaded!');
            return null;
        }
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return sb;
}

// ═══ AUTHENTICATION ═══

function initAuth() {
    var client = getSupabase();
    if (!client) {
        console.error('Cannot init auth - Supabase not available');
        showLogin();
        return;
    }

    client.auth.getSession().then(function(result) {
        if (result.data && result.data.session && result.data.session.user) {
            currentUser = result.data.session.user;
            enterApp();
        } else {
            showLogin();
        }
    }).catch(function(err) {
        console.error('getSession error:', err);
        showLogin();
    });

    client.auth.onAuthStateChange(function(event, session) {
        if (event === 'SIGNED_IN' && session) {
            currentUser = session.user;
            enterApp();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            isAdmin = false;
            showLogin();
        }
    });
}

function showLogin() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-shell').classList.add('hidden');
    var emailEl = document.getElementById('login-email');
    var passEl = document.getElementById('login-password');
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
    hideLoginError();
}

function enterApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');

    var email = (currentUser.email || '').toLowerCase().trim();
    isAdmin = (email === ADMIN_EMAIL);

    var name = currentUser.user_metadata && currentUser.user_metadata.full_name
        ? currentUser.user_metadata.full_name
        : email.split('@')[0];

    var usernameEl = document.getElementById('topbar-username');
    var avatarEl = document.getElementById('topbar-avatar');
    var greetEl = document.getElementById('greeting-text');

    if (usernameEl) usernameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    if (greetEl) greetEl.textContent = getGreeting() + ', ' + name + '!';

    // Show/hide admin sections
    var adminEls = document.querySelectorAll('.admin-only');
    for (var i = 0; i < adminEls.length; i++) {
        if (isAdmin) {
            adminEls[i].classList.remove('hidden');
        } else {
            adminEls[i].classList.add('hidden');
        }
    }

    var adminNav = document.getElementById('admin-nav-section');
    if (adminNav) {
        if (isAdmin) {
            adminNav.classList.remove('hidden');
        } else {
            adminNav.classList.add('hidden');
        }
    }

    // ═══ DEVICE GUARD (solo estudiantes, admin exento) ═══
    if (typeof DeviceGuard !== 'undefined' && !isAdmin) {
        var client = getSupabase();
        DeviceGuard.activateDevice(client, email).then(function(res) {
            if (!res.ok) {
                alert('⚠️ ' + (res.error || 'Dispositivo no autorizado'));
                handleLogout();
                return;
            }
            DeviceGuard.startChecking(client, function(reason) {
                alert('🔒 Sesión cerrada: ' + reason);
                handleLogout();
            });
        });
    }

    navigateTo('inicio');
}

// ═══ LOGIN HANDLER ═══

function handleLogin(e) {
    if (e) e.preventDefault();
    hideLoginError();

    var emailField = document.getElementById('login-email');
    var passField = document.getElementById('login-password');

    if (!emailField || !passField) {
        showLoginError('Error interno: campos no encontrados');
        return;
    }

    var email = emailField.value.trim();
    var password = passField.value;

    if (!email || !password) {
        showLoginError('Completa todos los campos');
        return;
    }
    if (password.length < 6) {
        showLoginError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    var client = getSupabase();
    if (!client) {
        showLoginError('Error: servicio de autenticación no disponible. Recarga la página.');
        return;
    }

    setLoginLoading(true);

    client.auth.signInWithPassword({
        email: email,
        password: password
    }).then(function(result) {
        setLoginLoading(false);

        if (result.error) {
            console.error('Login error:', result.error.message, result.error);
            var msg = 'Credenciales incorrectas';
            var errMsg = result.error.message || '';
            if (errMsg.indexOf('Invalid login') !== -1) {
                msg = 'Correo o contraseña incorrectos';
            } else if (errMsg.indexOf('Email not confirmed') !== -1) {
                msg = 'Confirma tu correo antes de ingresar';
            } else if (errMsg.indexOf('Too many requests') !== -1) {
                msg = 'Demasiados intentos. Espera unos minutos.';
            } else if (errMsg.indexOf('Invalid API key') !== -1) {
                msg = 'Error de configuración del servidor';
            } else if (errMsg.length > 0) {
                msg = errMsg;
            }
            showLoginError(msg);
            return;
        }

        if (result.data && result.data.user) {
            currentUser = result.data.user;
            enterApp();
        } else {
            showLoginError('Respuesta inesperada del servidor. Intenta de nuevo.');
        }
    }).catch(function(err) {
        setLoginLoading(false);
        console.error('Login catch error:', err);
        showLoginError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    });
}

// Make handleLogin globally accessible
window.handleLogin = handleLogin;

function togglePasswordVisibility() {
    var input = document.getElementById('login-password');
    var icon = document.getElementById('login-eye-icon');
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    } else {
        input.type = 'password';
        if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
    }
}
window.togglePasswordVisibility = togglePasswordVisibility;

function showLoginError(msg) {
    var el = document.getElementById('login-error');
    var txt = document.getElementById('login-error-text');
    if (el) el.classList.remove('hidden');
    if (txt) txt.textContent = msg;
}

function hideLoginError() {
    var el = document.getElementById('login-error');
    if (el) el.classList.add('hidden');
}

function setLoginLoading(loading) {
    var btn = document.getElementById('login-btn');
    var btnText = document.getElementById('login-btn-text');
    var btnLoading = document.getElementById('login-btn-loading');
    if (!btn) return;
    btn.disabled = loading;
    if (btnText) btnText.style.display = loading ? 'none' : '';
    if (btnLoading) {
        if (loading) btnLoading.classList.remove('hidden');
        else btnLoading.classList.add('hidden');
    }
}

// ═══ NAVIGATION ═══

var currentPage = 'inicio';

function navigateTo(page) {
    currentPage = page;

    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) { pages[i].classList.remove('active'); }
    var target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    var sideItems = document.querySelectorAll('.sidebar-nav .nav-item');
    for (var j = 0; j < sideItems.length; j++) { sideItems[j].classList.remove('active'); }
    var activeSidebar = document.querySelector('.sidebar-nav .nav-item[data-page="' + page + '"]');
    if (activeSidebar) activeSidebar.classList.add('active');

    var bottomItems = document.querySelectorAll('.bnav-item');
    for (var k = 0; k < bottomItems.length; k++) { bottomItems[k].classList.remove('active'); }
    var activeBottom = document.querySelector('.bnav-item[data-page="' + page + '"]');
    if (activeBottom) activeBottom.classList.add('active');

    closeSidebar();
}

// ═══ SIDEBAR ═══

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// ═══ JOIN BY CODE ═══

// ═══ JOIN BY CODE — Buscar evaluación en Supabase ═══

var quizData = null;       // { evaluacion, preguntas[] }
var quizCurrentQ = 0;      // Índice de pregunta actual
var quizAnswers = [];       // Respuestas del estudiante
var quizSelectedOption = -1;

function joinByCode() {
    var input = document.getElementById('join-code-input');
    var code = input ? input.value.trim().replace(/\s/g, '') : '';
    if (!code) { alert('Ingresa un código'); return; }
    searchAndStartQuiz(code);
}
window.joinByCode = joinByCode;

function joinByCodeFull() {
    var input = document.getElementById('join-code-full');
    var code = input ? input.value.trim().replace(/\s/g, '') : '';
    if (!code) {
        document.getElementById('join-error').classList.remove('hidden');
        document.getElementById('join-error-text').textContent = 'Ingresa un código válido';
        return;
    }
    document.getElementById('join-error').classList.add('hidden');
    searchAndStartQuiz(code);
}
window.joinByCodeFull = joinByCodeFull;

function searchAndStartQuiz(code) {
    var client = getSupabase();

    // Buscar evaluación por código
    client.from('evaluaciones').select('*').eq('codigo', code).eq('publicado', true).single().then(function(result) {
        if (result.error || !result.data) {
            alert('❌ No se encontró ninguna evaluación con el código: ' + code + '\n\nVerifica que el código sea correcto.');
            return;
        }

        var evaluacion = result.data;

        // Cargar preguntas
        client.from('evaluacion_preguntas').select('*').eq('evaluacion_id', evaluacion.id).order('orden').then(function(pResult) {
            if (pResult.error || !pResult.data || pResult.data.length === 0) {
                alert('Esta evaluación no tiene preguntas todavía.');
                return;
            }

            quizData = {
                evaluacion: evaluacion,
                preguntas: pResult.data
            };
            quizCurrentQ = 0;
            quizAnswers = [];
            quizSelectedOption = -1;

            // Mostrar la página de quiz
            document.getElementById('quiz-live-title').textContent = evaluacion.titulo || 'Evaluación';
            document.getElementById('quiz-live-subtitle').textContent = quizData.preguntas.length + ' preguntas • ' + (evaluacion.asignatura || '');
            document.getElementById('quiz-container').style.display = 'block';
            document.getElementById('quiz-result').style.display = 'none';

            navigateTo('quiz');
            renderQuizQuestion();
        });
    });
}

function renderQuizQuestion() {
    if (!quizData || quizCurrentQ >= quizData.preguntas.length) return;

    var pregunta = quizData.preguntas[quizCurrentQ];
    var total = quizData.preguntas.length;
    var progress = ((quizCurrentQ) / total) * 100;

    document.getElementById('quiz-progress-bar').style.width = progress + '%';
    document.getElementById('quiz-question-number').textContent = 'Pregunta ' + (quizCurrentQ + 1) + '/' + total;
    document.getElementById('quiz-question-text').textContent = pregunta.texto || '';

    var opciones = pregunta.opciones || [];
    var optColors = ['#2563EB', '#0D9488', '#D97706', '#DC2626', '#7C3AED', '#059669'];
    var html = '';

    for (var i = 0; i < opciones.length; i++) {
        var bgColor = optColors[i % optColors.length];
        html += '<button class="quiz-opt-btn" data-idx="' + i + '" onclick="selectQuizOption(' + i + ')" ' +
            'style="padding:16px 20px;border:2px solid #E2E8F0;border-radius:14px;background:#fff;text-align:left;' +
            'font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px">' +
            '<span style="width:32px;height:32px;border-radius:8px;background:' + bgColor + ';color:#fff;display:flex;' +
            'align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0">' +
            String.fromCharCode(65 + i) + '</span>' +
            '<span>' + (opciones[i].text || '') + '</span></button>';
    }

    document.getElementById('quiz-options-list').innerHTML = html;
    document.getElementById('quiz-next-btn').style.display = 'none';
    quizSelectedOption = -1;
}

function selectQuizOption(idx) {
    if (quizSelectedOption !== -1) return; // Ya seleccionó
    quizSelectedOption = idx;

    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');

    // Marcar correcta e incorrecta
    for (var i = 0; i < buttons.length; i++) {
        var isCorrect = opciones[i] && opciones[i].correct;
        var isSelected = (i === idx);

        if (isCorrect) {
            buttons[i].style.border = '2px solid #22C55E';
            buttons[i].style.background = '#F0FDF4';
        } else if (isSelected && !isCorrect) {
            buttons[i].style.border = '2px solid #EF4444';
            buttons[i].style.background = '#FEF2F2';
        }
        buttons[i].style.cursor = 'default';
    }

    // Registrar respuesta
    var isCorrectAnswer = opciones[idx] && opciones[idx].correct;
    quizAnswers.push({
        pregunta_id: pregunta.id,
        seleccionada: idx,
        correcta: isCorrectAnswer
    });

    // Mostrar botón siguiente
    var nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'block';
    if (quizCurrentQ >= quizData.preguntas.length - 1) {
        nextBtn.textContent = '🏆 Ver resultados';
    } else {
        nextBtn.textContent = 'Siguiente →';
    }
}
window.selectQuizOption = selectQuizOption;

function quizNext() {
    quizCurrentQ++;
    if (quizCurrentQ >= quizData.preguntas.length) {
        showQuizResults();
    } else {
        renderQuizQuestion();
    }
}
window.quizNext = quizNext;

function showQuizResults() {
    var correctas = 0;
    for (var i = 0; i < quizAnswers.length; i++) {
        if (quizAnswers[i].correcta) correctas++;
    }
    var total = quizData.preguntas.length;
    var pct = Math.round((correctas / total) * 100);

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-result-score').textContent = 'Obtuviste ' + correctas + '/' + total + ' correctas (' + pct + '%)';

    var fill = document.getElementById('quiz-result-fill');
    fill.style.background = pct >= 70 ? 'linear-gradient(90deg,#22C55E,#16A34A)' :
                             pct >= 40 ? 'linear-gradient(90deg,#F59E0B,#D97706)' :
                                         'linear-gradient(90deg,#EF4444,#DC2626)';
    setTimeout(function() { fill.style.width = pct + '%'; }, 100);

    // Guardar resultado en Supabase (opcional, para historial)
    if (currentUser) {
        var client = getSupabase();
        client.from('evaluacion_resultados').insert({
            evaluacion_id: quizData.evaluacion.id,
            user_id: currentUser.id,
            puntaje: correctas,
            total: total,
            porcentaje: pct,
            respuestas: quizAnswers
        }).then(function(r) {
            if (r.error) console.warn('No se pudo guardar resultado:', r.error.message);
        });
    }
}

// ═══ LOGOUT ═══

function handleLogout() {
    var client = getSupabase();
    if (client) {
        client.auth.signOut().then(function() {
            currentUser = null;
            isAdmin = false;
            showLogin();
        }).catch(function(e) {
            console.error('Logout error:', e);
            currentUser = null;
            isAdmin = false;
            showLogin();
        });
    } else {
        showLogin();
    }
}

// ═══ HELPERS ═══

function getGreeting() {
    var h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
}

// ═══ INIT ═══

document.addEventListener('DOMContentLoaded', function() {
    // Auth
    initAuth();

    // Hamburger
    var hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
    var overlayEl = document.getElementById('sidebar-overlay');
    if (overlayEl) overlayEl.addEventListener('click', closeSidebar);
    var closeBtn = document.getElementById('sidebar-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    // Sidebar nav
    var navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    for (var i = 0; i < navItems.length; i++) {
        (function(item) {
            if (item.dataset.page) {
                item.addEventListener('click', function() { navigateTo(item.dataset.page); });
            }
        })(navItems[i]);
    }

    // Bottom nav
    var bnavItems = document.querySelectorAll('.bnav-item');
    for (var j = 0; j < bnavItems.length; j++) {
        (function(btn) {
            if (btn.dataset.page) {
                btn.addEventListener('click', function() { navigateTo(btn.dataset.page); });
            }
        })(bnavItems[j]);
    }

    // Logout
    var logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
});
