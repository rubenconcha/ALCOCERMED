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

    // Verificar si hay una sesión de quiz pendiente (por si recargó la página)
    var pendingCode = sessionStorage.getItem('alcocer_quiz_code');
    if (pendingCode && !isAdmin) {
        searchAndStartQuiz(pendingCode);
    } else {
        navigateTo('inicio');
    }
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

    // Load data for specific pages
    if (page === 'biblioteca' && isAdmin) loadLibrary();
    if (page === 'informes' && isAdmin) loadReports();
    if (page === 'historial' && !isAdmin) loadStudentResults();

    closeSidebar();
}
window.navigateTo = navigateTo;

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

            // Registrar participante en el lobby (upsert para evitar duplicados)
            if (currentUser) {
                var nombre = currentUser.user_metadata && currentUser.user_metadata.full_name
                    ? currentUser.user_metadata.full_name
                    : (currentUser.email || '').split('@')[0];
                client.from('evaluacion_participantes').upsert({
                    evaluacion_id: evaluacion.id,
                    user_id: currentUser.id,
                    nombre: nombre,
                    joined_at: new Date().toISOString()
                }, { onConflict: 'evaluacion_id,user_id' }).then(function(pr) {
                    if (pr.error) console.warn('No se pudo registrar participante:', pr.error.message);
                });
            }

            // Guardar código en sessionStorage para persistir al recargar
            sessionStorage.setItem('alcocer_quiz_code', code);

            // Mostrar la página de quiz
            document.getElementById('quiz-live-title').textContent = evaluacion.titulo || 'Evaluación';
            document.getElementById('quiz-live-subtitle').textContent = quizData.preguntas.length + ' preguntas • ' + (evaluacion.asignatura || '');
            document.getElementById('quiz-container').style.display = 'none';
            document.getElementById('quiz-result').style.display = 'none';

            navigateTo('quiz');

            // Si el admin ya inició, empezar directamente
            if (evaluacion.iniciado) {
                showSplashAndStart();
            } else {
                // Mostrar sala de espera y esperar a que el admin inicie
                showWaitingRoom();
            }
        });
    });
}

var waitingPollInterval = null;

function showWaitingRoom() {
    var wt = document.getElementById('quiz-waiting');
    if (wt) wt.style.display = 'flex';
    document.getElementById('quiz-container').style.display = 'none';

    var title = quizData.evaluacion.titulo || 'Evaluación';
    var wtTitle = document.getElementById('waiting-title');
    if (wtTitle) wtTitle.textContent = 'Esperando al profesor...';
    var wtSub = document.getElementById('waiting-subtitle');
    if (wtSub) wtSub.textContent = '"' + title + '" comenzará cuando el profesor presione EMPEZAR';

    // Poll cada 3 segundos para verificar si el admin inició
    if (waitingPollInterval) clearInterval(waitingPollInterval);
    waitingPollInterval = setInterval(function() {
        if (!quizData || !quizData.evaluacion) return;
        var client = getSupabase();
        client.from('evaluaciones').select('iniciado').eq('id', quizData.evaluacion.id).single().then(function(r) {
            if (r.data && r.data.iniciado) {
                clearInterval(waitingPollInterval);
                waitingPollInterval = null;
                var wt2 = document.getElementById('quiz-waiting');
                if (wt2) wt2.style.display = 'none';
                document.getElementById('quiz-container').style.display = 'block';
                showSplashAndStart();
            }
        });
    }, 3000);
}

var quizTimerInterval = null;
var quizTimeLeft = 30;

function showSplashAndStart() {
    // Asegurar que la sala de espera se oculte
    var wt = document.getElementById('quiz-waiting');
    if (wt) wt.style.display = 'none';

    var splash = document.getElementById('quiz-splash');
    if (splash) {
        splash.style.display = 'flex';
        setTimeout(function() {
            splash.style.display = 'none';
            // Mostrar el contenedor de preguntas
            document.getElementById('quiz-container').style.display = 'block';
            renderQuizQuestion();
        }, 2000);
    } else {
        document.getElementById('quiz-container').style.display = 'block';
        renderQuizQuestion();
    }
}

function startQuestionTimer(seconds) {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizTimeLeft = seconds;
    var timerEl = document.getElementById('quiz-timer-text');
    if (timerEl) timerEl.textContent = quizTimeLeft;

    quizTimerInterval = setInterval(function() {
        quizTimeLeft--;
        if (timerEl) timerEl.textContent = quizTimeLeft;
        if (timerEl) timerEl.style.color = quizTimeLeft <= 5 ? '#EF4444' : '#E91E63';
        if (quizTimeLeft <= 0) {
            clearInterval(quizTimerInterval);
            // Auto-select wrong if no answer
            if (quizSelectedOption === -1) {
                quizAnswers.push({ pregunta_id: quizData.preguntas[quizCurrentQ].id, seleccionada: -1, correcta: false });
                var nextBtn = document.getElementById('quiz-next-btn');
                nextBtn.style.display = 'block';
                nextBtn.textContent = quizCurrentQ >= quizData.preguntas.length - 1 ? '🏆 Ver resultados' : 'Siguiente →';
            }
        }
    }, 1000);
}

var quizMultiSelections = [];

function renderQuizQuestion() {
    if (!quizData || quizCurrentQ >= quizData.preguntas.length) return;

    var pregunta = quizData.preguntas[quizCurrentQ];
    var total = quizData.preguntas.length;
    var progress = ((quizCurrentQ) / total) * 100;
    var pts = pregunta.puntos || 1;
    var timer = pregunta.temporizador || 30;
    var tipo = pregunta.tipo || 'mc';

    document.getElementById('quiz-progress-bar').style.width = progress + '%';
    document.getElementById('quiz-question-number').textContent = 'Pregunta ' + (quizCurrentQ + 1) + '/' + total;
    document.getElementById('quiz-question-text').textContent = pregunta.texto || '';
    var ptsEl = document.getElementById('quiz-question-points');
    if (ptsEl) ptsEl.textContent = pts + ' punto' + (pts !== 1 ? 's' : '');

    var opciones = pregunta.opciones || [];
    var optColors = ['#2563EB', '#0D9488', '#D97706', '#DC2626', '#7C3AED', '#059669'];
    var html = '';
    quizMultiSelections = [];

    // Open-ended or fill blanks: show textarea
    if (tipo === 'oa' || tipo === 'fb') {
        var ph = tipo === 'oa' ? 'Escribe tu respuesta aquí...' : 'Completa los espacios en blanco...';
        html += '<textarea id="quiz-open-answer" placeholder="' + ph + '" ' +
            'style="width:100%;min-height:120px;padding:16px;border:2px solid #E2E8F0;border-radius:12px;' +
            'background:#fff;color:#333;font-size:.95rem;font-family:Inter,sans-serif;resize:vertical;outline:none"></textarea>';
        html += '<button onclick="submitQuizOpen()" style="margin-top:12px;padding:14px 24px;background:linear-gradient(135deg,#E91E63,#C2185B);' +
            'color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;width:100%;font-size:1rem">Enviar respuesta</button>';
    }
    // Multiple selection: allow multiple clicks + confirm
    else if (tipo === 'ms') {
        for (var i = 0; i < opciones.length; i++) {
            var bgColor = optColors[i % optColors.length];
            html += '<button class="quiz-opt-btn" data-idx="' + i + '" onclick="toggleQuizMulti(' + i + ')" ' +
                'style="padding:16px 20px;border:2px solid #E2E8F0;border-radius:14px;background:#fff;text-align:left;' +
                'font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px">' +
                '<span style="width:32px;height:32px;border-radius:8px;background:' + bgColor + ';color:#fff;display:flex;' +
                'align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0">' +
                String.fromCharCode(65 + i) + '</span>' +
                '<span>' + (opciones[i].text || '') + '</span></button>';
        }
        html += '<button id="quiz-confirm-multi" onclick="confirmQuizMulti()" style="margin-top:12px;padding:14px 24px;' +
            'background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;width:100%;font-size:1rem">' +
            '✓ Confirmar selección</button>';
    }
    // Normal MC / TF / Poll
    else {
        for (var j = 0; j < opciones.length; j++) {
            var bgColor2 = optColors[j % optColors.length];
            html += '<button class="quiz-opt-btn" data-idx="' + j + '" onclick="selectQuizOption(' + j + ')" ' +
                'style="padding:16px 20px;border:2px solid #E2E8F0;border-radius:14px;background:#fff;text-align:left;' +
                'font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px">' +
                '<span style="width:32px;height:32px;border-radius:8px;background:' + bgColor2 + ';color:#fff;display:flex;' +
                'align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0">' +
                String.fromCharCode(65 + j) + '</span>' +
                '<span>' + (opciones[j].text || '') + '</span></button>';
        }
    }

    document.getElementById('quiz-options-list').innerHTML = html;
    document.getElementById('quiz-next-btn').style.display = 'none';
    quizSelectedOption = -1;

    startQuestionTimer(timer);
}

function toggleQuizMulti(idx) {
    var pos = quizMultiSelections.indexOf(idx);
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    if (pos === -1) {
        quizMultiSelections.push(idx);
        buttons[idx].style.border = '2px solid #7C3AED';
        buttons[idx].style.background = '#F3E8FF';
    } else {
        quizMultiSelections.splice(pos, 1);
        buttons[idx].style.border = '2px solid #E2E8F0';
        buttons[idx].style.background = '#fff';
    }
}
window.toggleQuizMulti = toggleQuizMulti;

function confirmQuizMulti() {
    if (quizMultiSelections.length === 0) return;
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizSelectedOption = 1;
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var allCorrect = true;
    for (var i = 0; i < opciones.length; i++) {
        var isSel = quizMultiSelections.indexOf(i) !== -1;
        var isCorr = opciones[i] && opciones[i].correct;
        if (isSel && !isCorr) allCorrect = false;
        if (!isSel && isCorr) allCorrect = false;
    }
    for (var j = 0; j < buttons.length; j++) {
        var sel = quizMultiSelections.indexOf(j) !== -1;
        if (sel) { buttons[j].style.border = allCorrect ? '2px solid #22C55E' : '2px solid #F59E0B'; buttons[j].style.background = allCorrect ? '#F0FDF4' : '#FEF3C7'; }
        else { buttons[j].style.opacity = '0.5'; }
        buttons[j].style.pointerEvents = 'none';
    }
    var confirmBtn = document.getElementById('quiz-confirm-multi');
    if (confirmBtn) confirmBtn.style.display = 'none';
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: quizMultiSelections, correcta: allCorrect });
    var nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = quizCurrentQ >= quizData.preguntas.length - 1 ? '🏆 Ver resultados' : 'Siguiente →';
}
window.confirmQuizMulti = confirmQuizMulti;

function submitQuizOpen() {
    var ta = document.getElementById('quiz-open-answer');
    var answer = ta ? ta.value.trim() : '';
    if (!answer) return;
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizSelectedOption = 1;
    ta.style.border = '2px solid #22C55E';
    ta.disabled = true;
    var pregunta = quizData.preguntas[quizCurrentQ];
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: answer, correcta: true });
    var nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = quizCurrentQ >= quizData.preguntas.length - 1 ? '🏆 Ver resultados' : 'Siguiente →';
}
window.submitQuizOpen = submitQuizOpen;

function selectQuizOption(idx) {
    if (quizSelectedOption !== -1) return;
    quizSelectedOption = idx;
    if (quizTimerInterval) clearInterval(quizTimerInterval);

    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var isCorrectAnswer = opciones[idx] && opciones[idx].correct;

    for (var i = 0; i < buttons.length; i++) {
        var isSelected = (i === idx);
        if (isSelected && isCorrectAnswer) {
            buttons[i].style.border = '2px solid #22C55E';
            buttons[i].style.background = '#F0FDF4';
        } else if (isSelected && !isCorrectAnswer) {
            buttons[i].style.border = '2px solid #EF4444';
            buttons[i].style.background = '#FEF2F2';
        } else {
            buttons[i].style.opacity = '0.5';
        }
        buttons[i].style.cursor = 'default';
        buttons[i].style.pointerEvents = 'none';
    }

    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: idx, correcta: isCorrectAnswer });

    var nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = quizCurrentQ >= quizData.preguntas.length - 1 ? '🏆 Ver resultados' : 'Siguiente →';
}
window.selectQuizOption = selectQuizOption;

function quizNext() {
    quizCurrentQ++;
    if (quizCurrentQ >= quizData.preguntas.length) { showQuizResults(); }
    else { renderQuizQuestion(); }
}
window.quizNext = quizNext;

function showQuizResults() {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    // Limpiar sesión pendiente — el quiz terminó
    sessionStorage.removeItem('alcocer_quiz_code');
    var correctas = 0;
    for (var i = 0; i < quizAnswers.length; i++) { if (quizAnswers[i].correcta) correctas++; }
    var total = quizData.preguntas.length;
    var pct = Math.round((correctas / total) * 100);

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';

    // Emoji and title based on score
    var emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 40 ? '📝' : '💪';
    var msg = pct >= 90 ? '¡Excelente!' : pct >= 70 ? '¡Muy bien!' : pct >= 40 ? '¡Puedes mejorar!' : '¡Sigue practicando!';
    var emojiEl = document.getElementById('quiz-result-emoji');
    if (emojiEl) emojiEl.textContent = emoji;
    document.getElementById('quiz-result-title').textContent = msg;
    document.getElementById('quiz-result-score').textContent = correctas + '/' + total + ' correctas (' + pct + '%)';

    var fill = document.getElementById('quiz-result-fill');
    fill.style.background = pct >= 70 ? 'linear-gradient(90deg,#22C55E,#16A34A)' :
                             pct >= 40 ? 'linear-gradient(90deg,#F59E0B,#D97706)' :
                                         'linear-gradient(90deg,#EF4444,#DC2626)';
    setTimeout(function() { fill.style.width = pct + '%'; }, 100);

    // Per-question breakdown
    var breakdownEl = document.getElementById('quiz-result-breakdown');
    if (breakdownEl) {
        var bhtml = '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px">';
        for (var j = 0; j < quizAnswers.length; j++) {
            var ok = quizAnswers[j].correcta;
            bhtml += '<div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;' +
                'background:' + (ok ? '#DCFCE7' : '#FEE2E2') + ';color:' + (ok ? '#166534' : '#DC2626') + '">' +
                '<i class="fas fa-' + (ok ? 'check' : 'times') + '"></i></div>';
        }
        bhtml += '</div>';
        bhtml += '<p style="font-size:12px;color:#8E90A6;text-align:center">Q1-Q' + total + ' • Verde = correcta, Rojo = incorrecta</p>';
        breakdownEl.innerHTML = bhtml;
    }

    // Guardar en Supabase y cargar leaderboard
    var evalIdForBoard = quizData.evaluacion.id;
    if (currentUser) {
        var client = getSupabase();
        client.from('evaluacion_resultados').insert({
            evaluacion_id: evalIdForBoard,
            user_id: currentUser.id,
            puntaje: correctas,
            total: total,
            porcentaje: pct,
            respuestas: quizAnswers
        }).then(function(r) {
            if (r.error) {
                console.warn('Insert resultado:', r.error.message);
                // Si falla por duplicado, intentar update
                client.from('evaluacion_resultados').update({
                    puntaje: correctas,
                    total: total,
                    porcentaje: pct,
                    respuestas: quizAnswers
                }).eq('evaluacion_id', evalIdForBoard).eq('user_id', currentUser.id).then(function() {
                    loadLeaderboard(evalIdForBoard);
                });
            } else {
                loadLeaderboard(evalIdForBoard);
            }
        });
    } else {
        // Sin usuario, aún mostrar leaderboard
        loadLeaderboard(evalIdForBoard);
    }
}

function loadLeaderboard(evalId) {
    var client = getSupabase();
    console.log('Loading leaderboard for:', evalId);
    client.from('evaluacion_resultados').select('user_id,puntaje,total,porcentaje').eq('evaluacion_id', evalId).order('porcentaje', { ascending: false }).order('puntaje', { ascending: false }).then(function(r) {
        console.log('Leaderboard data:', r.data, 'Error:', r.error);
        if (r.error) { console.warn('Leaderboard error:', r.error.message); return; }
        if (!r.data || r.data.length === 0) { console.log('No results yet'); return; }

        // Get participant names
        var userIds = [];
        for (var i = 0; i < r.data.length; i++) {
            if (userIds.indexOf(r.data[i].user_id) === -1) userIds.push(r.data[i].user_id);
        }

        client.from('evaluacion_participantes').select('user_id,nombre').eq('evaluacion_id', evalId).then(function(pRes) {
            var nameMap = {};
            if (pRes.data) {
                for (var n = 0; n < pRes.data.length; n++) {
                    nameMap[pRes.data[n].user_id] = pRes.data[n].nombre;
                }
            }

            var results = r.data;
            // Build leaderboard entries
            var entries = [];
            for (var k = 0; k < results.length; k++) {
                entries.push({
                    user_id: results[k].user_id,
                    nombre: nameMap[results[k].user_id] || 'Estudiante',
                    puntaje: results[k].puntaje,
                    total: results[k].total,
                    porcentaje: results[k].porcentaje
                });
            }

            renderPodium(entries);
        });
    });
}

function renderPodium(entries) {
    var podiumEl = document.getElementById('quiz-podium');
    if (!podiumEl || entries.length === 0) return;
    podiumEl.style.display = 'block';

    var medals = ['🥇', '🥈', '🥉'];
    var colors = ['#FFD700', '#C0C0C0', '#CD7F32'];
    var heights = [140, 110, 90];
    var bgGradients = [
        'linear-gradient(180deg,#FFD700,#FFA000)',
        'linear-gradient(180deg,#E0E0E0,#9E9E9E)',
        'linear-gradient(180deg,#CD7F32,#8B5E3C)'
    ];

    // Podium pillars (order: 2nd, 1st, 3rd)
    var pillarOrder = [1, 0, 2];
    var pillarsHtml = '';

    for (var p = 0; p < 3; p++) {
        var idx = pillarOrder[p];
        if (idx >= entries.length) {
            pillarsHtml += '<div style="flex:1;max-width:120px"></div>';
            continue;
        }
        var e = entries[idx];
        var h = heights[idx];
        var initial = e.nombre.charAt(0).toUpperCase();

        pillarsHtml += '<div style="flex:1;max-width:120px;display:flex;flex-direction:column;align-items:center;animation:fadeInUp .5s ease ' + (p * 0.2) + 's both">';
        // Avatar
        pillarsHtml += '<div style="width:48px;height:48px;border-radius:50%;background:' + bgGradients[idx] + ';display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px;color:#fff;margin-bottom:8px;box-shadow:0 4px 16px rgba(0,0,0,.3);border:3px solid ' + colors[idx] + '">' + initial + '</div>';
        // Name
        pillarsHtml += '<span style="font-size:11px;font-weight:700;color:#fff;margin-bottom:4px;max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block">' + e.nombre + '</span>';
        // Score
        pillarsHtml += '<span style="font-size:10px;color:rgba(255,255,255,.5);margin-bottom:6px">' + e.puntaje + '/' + e.total + ' (' + e.porcentaje + '%)</span>';
        // Pillar
        pillarsHtml += '<div style="width:100%;height:' + h + 'px;background:' + bgGradients[idx] + ';border-radius:12px 12px 0 0;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;box-shadow:0 -4px 20px rgba(0,0,0,.2)">';
        pillarsHtml += '<span style="text-shadow:0 2px 8px rgba(0,0,0,.3)">' + medals[idx] + '</span>';
        pillarsHtml += '</div>';
        pillarsHtml += '</div>';
    }

    document.getElementById('podium-pillars').innerHTML = pillarsHtml;

    // My rank
    if (currentUser) {
        var myRank = -1;
        for (var m = 0; m < entries.length; m++) {
            if (entries[m].user_id === currentUser.id) { myRank = m + 1; break; }
        }
        if (myRank > 0) {
            var rankPill = document.getElementById('my-rank-pill');
            var suffix = myRank === 1 ? 'er' : myRank === 2 ? 'do' : myRank === 3 ? 'er' : 'to';
            rankPill.innerHTML = '🎯 Tu posición: <strong style="font-size:1.1rem;color:#fff;margin:0 4px">' + myRank + '°</strong> de ' + entries.length + ' estudiantes';
            rankPill.style.display = 'block';
        }
    }

    // Full list (beyond top 3)
    if (entries.length > 3) {
        var listHtml = '<div style="border-top:1px solid rgba(255,255,255,.1);padding-top:12px">';
        for (var l = 3; l < entries.length; l++) {
            var isMe = currentUser && entries[l].user_id === currentUser.id;
            listHtml += '<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;' + (isMe ? 'background:rgba(233,30,99,.15);' : '') + 'margin-bottom:4px">';
            listHtml += '<span style="font-weight:800;color:rgba(255,255,255,.4);font-size:14px;width:24px">' + (l + 1) + '</span>';
            listHtml += '<span style="font-weight:600;flex:1;color:' + (isMe ? '#E91E63' : '#fff') + ';font-size:13px">' + entries[l].nombre + (isMe ? ' (tú)' : '') + '</span>';
            listHtml += '<span style="font-size:12px;color:rgba(255,255,255,.5)">' + entries[l].porcentaje + '%</span>';
            listHtml += '</div>';
        }
        listHtml += '</div>';
        document.getElementById('podium-full-list').innerHTML = listHtml;
    }
}

// ═══ ADMIN: BIBLIOTECA — Evaluaciones creadas ═══

function loadLibrary() {
    var container = document.getElementById('library-list');
    if (!container || !currentUser) return;
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:24px"></i><p style="margin-top:12px">Cargando biblioteca...</p></div>';

    var client = getSupabase();
    client.from('evaluaciones').select('*').eq('created_by', currentUser.id).order('created_at', {ascending: false}).then(function(r) {
        if (r.error || !r.data || r.data.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>No has creado evaluaciones aún</p><small>Haz clic en "Crear evaluación" para empezar</small></div>';
            return;
        }
        var html = '';
        for (var i = 0; i < r.data.length; i++) {
            var ev = r.data[i];
            var statusBadge = ev.publicado
                ? '<span style="background:#DCFCE7;color:#166534;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700">Publicado</span>'
                : '<span style="background:#FEF3C7;color:#92400E;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700">Borrador</span>';
            var codeHtml = ev.codigo ? '<span style="font-family:monospace;font-size:13px;color:#2563EB;font-weight:700">Código: ' + ev.codigo + '</span>' : '';
            var fecha = new Date(ev.created_at).toLocaleDateString('es-ES', {day:'numeric',month:'short',year:'numeric'});
            html += '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:20px;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;transition:box-shadow .2s" onmouseover="this.style.boxShadow=\'0 4px 16px rgba(0,0,0,.08)\'" onmouseout="this.style.boxShadow=\'none\'">' +
                '<div style="flex:1">' +
                '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">' +
                '<h3 style="font-size:16px;font-weight:700;color:#1E293B">' + (ev.titulo || 'Sin título') + '</h3>' +
                statusBadge + '</div>' +
                '<div style="display:flex;gap:16px;font-size:12px;color:#64748B">' +
                '<span><i class="fas fa-book"></i> ' + (ev.asignatura || 'General') + '</span>' +
                '<span><i class="fas fa-calendar"></i> ' + fecha + '</span>' +
                codeHtml + '</div></div>' +
                '<div style="display:flex;gap:8px">' +
                '<button onclick="window.location.href=\'editor.html?id=' + ev.id + 
                '\'" style="padding:8px 14px;background:#F0F1F3;border:1px solid #E2E8F0;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;color:#555"><i class="fas fa-edit"></i> Editar</button>' +
                (ev.publicado ? '<button onclick="alert(\'Código: ' + (ev.codigo||'') + '\')" style="padding:8px 14px;background:#2563EB;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer"><i class="fas fa-play"></i> Código</button>' : '') +
                '</div></div>';
        }
        container.innerHTML = html;
    });
}

// ═══ ADMIN: INFORMES — Resultados de estudiantes ═══

function loadReports() {
    var container = document.getElementById('reports-list');
    if (!container || !currentUser) return;
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:24px"></i><p style="margin-top:12px">Cargando informes...</p></div>';

    var client = getSupabase();
    // Get all published evaluations by admin
    client.from('evaluaciones').select('id, titulo, codigo').eq('created_by', currentUser.id).eq('publicado', true).then(function(evRes) {
        if (evRes.error || !evRes.data || evRes.data.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>No hay informes disponibles</p><small>Publica evaluaciones para ver los resultados</small></div>';
            return;
        }
        // Get results for these evaluations
        var evalIds = evRes.data.map(function(e) { return e.id; });
        client.from('evaluacion_resultados').select('*').in('evaluacion_id', evalIds).order('created_at', {ascending: false}).then(function(rRes) {
            if (rRes.error || !rRes.data || rRes.data.length === 0) {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>Aún no hay resultados</p><small>Los resultados aparecerán cuando los estudiantes completen evaluaciones</small></div>';
                return;
            }
            // Group by evaluation
            var grouped = {};
            for (var i = 0; i < rRes.data.length; i++) {
                var res = rRes.data[i];
                if (!grouped[res.evaluacion_id]) grouped[res.evaluacion_id] = [];
                grouped[res.evaluacion_id].push(res);
            }
            // Build HTML
            var html = '';
            for (var j = 0; j < evRes.data.length; j++) {
                var ev = evRes.data[j];
                var results = grouped[ev.id] || [];
                if (results.length === 0) continue;
                var avgPct = 0;
                for (var k = 0; k < results.length; k++) avgPct += (results[k].porcentaje || 0);
                avgPct = Math.round(avgPct / results.length);
                var barColor = avgPct >= 70 ? '#22C55E' : avgPct >= 40 ? '#F59E0B' : '#EF4444';

                html += '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:20px;margin-bottom:16px">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">';
                html += '<div><h3 style="font-size:16px;font-weight:700">' + (ev.titulo || 'Sin título') + '</h3>';
                html += '<span style="font-size:12px;color:#64748B">' + results.length + ' participante(s) • Código: ' + (ev.codigo || '-') + '</span></div>';
                html += '<div style="text-align:right"><span style="font-size:24px;font-weight:800;color:' + barColor + '">' + avgPct + '%</span><br><span style="font-size:11px;color:#8E90A6">Promedio</span></div></div>';
                // Progress bar
                html += '<div style="background:#E2E8F0;border-radius:20px;height:8px;margin-bottom:16px;overflow:hidden"><div style="height:100%;width:' + avgPct + '%;background:' + barColor + ';border-radius:20px"></div></div>';
                // Results table
                html += '<table style="width:100%;border-collapse:collapse;font-size:13px">';
                html += '<tr style="border-bottom:1px solid #E2E8F0"><th style="text-align:left;padding:8px;color:#64748B;font-weight:600">Estudiante</th><th style="padding:8px;color:#64748B;font-weight:600">Puntaje</th><th style="padding:8px;color:#64748B;font-weight:600">Precisión</th></tr>';
                for (var m = 0; m < results.length; m++) {
                    var r = results[m];
                    var pColor = r.porcentaje >= 70 ? '#22C55E' : r.porcentaje >= 40 ? '#F59E0B' : '#EF4444';
                    html += '<tr style="border-bottom:1px solid #F1F5F9">';
                    html += '<td style="padding:8px"><i class="fas fa-user-circle" style="color:#94A3B8;margin-right:6px"></i>' + (r.user_id ? r.user_id.substring(0, 8) + '...' : 'Anónimo') + '</td>';
                    html += '<td style="padding:8px;text-align:center;font-weight:700">' + r.puntaje + '/' + r.total + '</td>';
                    html += '<td style="padding:8px;text-align:center;font-weight:700;color:' + pColor + '">' + r.porcentaje + '%</td>';
                    html += '</tr>';
                }
                html += '</table></div>';
            }
            container.innerHTML = html || '<div class="empty-state"><i class="fas fa-chart-line"></i><p>No hay resultados aún</p></div>';
        });
    });
}

// ═══ STUDENT: MIS RESULTADOS ═══

function loadStudentResults() {
    var container = document.getElementById('results-list');
    if (!container || !currentUser) return;
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:24px"></i></div>';

    var client = getSupabase();
    client.from('evaluacion_resultados').select('*, evaluaciones(titulo, asignatura)').eq('user_id', currentUser.id).order('created_at', {ascending: false}).then(function(r) {
        if (r.error || !r.data || r.data.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-pie"></i><p>No tienes resultados todavía</p><small>Participa en evaluaciones para ver tu progreso aquí</small></div>';
            return;
        }
        var html = '';
        for (var i = 0; i < r.data.length; i++) {
            var res = r.data[i];
            var titulo = (res.evaluaciones && res.evaluaciones.titulo) ? res.evaluaciones.titulo : 'Evaluación';
            var asig = (res.evaluaciones && res.evaluaciones.asignatura) ? res.evaluaciones.asignatura : '';
            var pct = res.porcentaje || 0;
            var barColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#F59E0B' : '#EF4444';
            var emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 40 ? '📝' : '💪';
            var fecha = new Date(res.created_at).toLocaleDateString('es-ES', {day:'numeric',month:'short'});

            html += '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:16px 20px;margin-bottom:10px;display:flex;align-items:center;gap:16px">';
            html += '<div style="font-size:28px">' + emoji + '</div>';
            html += '<div style="flex:1"><h4 style="font-size:14px;font-weight:700;margin-bottom:2px">' + titulo + '</h4>';
            html += '<span style="font-size:11px;color:#64748B">' + asig + ' • ' + fecha + '</span></div>';
            html += '<div style="text-align:right"><span style="font-size:20px;font-weight:800;color:' + barColor + '">' + pct + '%</span>';
            html += '<div style="font-size:11px;color:#8E90A6">' + res.puntaje + '/' + res.total + '</div></div></div>';
        }
        container.innerHTML = html;
    });
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
