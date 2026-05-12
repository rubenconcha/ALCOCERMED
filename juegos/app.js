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

            // Registrar participante en el lobby
            if (currentUser) {
                var nombre = currentUser.user_metadata && currentUser.user_metadata.full_name
                    ? currentUser.user_metadata.full_name
                    : (currentUser.email || '').split('@')[0];
                client.from('evaluacion_participantes').insert({
                    evaluacion_id: evaluacion.id,
                    user_id: currentUser.id,
                    nombre: nombre
                }).then(function(pr) {
                    if (pr.error) console.warn('No se pudo registrar participante:', pr.error.message);
                });
            }

            // Mostrar la página de quiz
            document.getElementById('quiz-live-title').textContent = evaluacion.titulo || 'Evaluación';
            document.getElementById('quiz-live-subtitle').textContent = quizData.preguntas.length + ' preguntas • ' + (evaluacion.asignatura || '');
            document.getElementById('quiz-container').style.display = 'block';
            document.getElementById('quiz-result').style.display = 'none';

            navigateTo('quiz');
            showSplashAndStart();
        });
    });
}

var quizTimerInterval = null;
var quizTimeLeft = 30;

function showSplashAndStart() {
    var splash = document.getElementById('quiz-splash');
    if (splash) {
        splash.style.display = 'flex';
        setTimeout(function() { splash.style.display = 'none'; renderQuizQuestion(); }, 2000);
    } else { renderQuizQuestion(); }
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

function renderQuizQuestion() {
    if (!quizData || quizCurrentQ >= quizData.preguntas.length) return;

    var pregunta = quizData.preguntas[quizCurrentQ];
    var total = quizData.preguntas.length;
    var progress = ((quizCurrentQ) / total) * 100;
    var pts = pregunta.puntos || 1;
    var timer = pregunta.temporizador || 30;

    document.getElementById('quiz-progress-bar').style.width = progress + '%';
    document.getElementById('quiz-question-number').textContent = 'Pregunta ' + (quizCurrentQ + 1) + '/' + total;
    document.getElementById('quiz-question-text').textContent = pregunta.texto || '';
    var ptsEl = document.getElementById('quiz-question-points');
    if (ptsEl) ptsEl.textContent = pts + ' punto' + (pts !== 1 ? 's' : '');

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

    startQuestionTimer(timer);
}

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
            // Respuesta correcta → verde
            buttons[i].style.border = '2px solid #22C55E';
            buttons[i].style.background = '#F0FDF4';
        } else if (isSelected && !isCorrectAnswer) {
            // Respuesta incorrecta → rojo (NO revelar la correcta)
            buttons[i].style.border = '2px solid #EF4444';
            buttons[i].style.background = '#FEF2F2';
        } else {
            // Las demás se desactivan sin revelar nada
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

    // Guardar en Supabase
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
