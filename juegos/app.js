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

// ═══ AUDIO GLOBAL Y AVATARES ═══
var globalAudioCtx = null;
var preloadedAudio = {};
var currentAvatar = '👤';
var availableAvatars = ['🦊','🐼','🦁','🐯','🐰','🐶','🐱','🦄','🦖','🐙','🦋','🦅'];

function getAudioCtx() {
    if (!globalAudioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        globalAudioCtx = new AC();
    }
    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }
    return globalAudioCtx;
}

function preloadAudio(name, url) {
    fetch(url).then(function(r) { return r.arrayBuffer(); })
              .then(function(buf) { return getAudioCtx().decodeAudioData(buf); })
              .then(function(decoded) { preloadedAudio[name] = decoded; })
              .catch(function(e) { console.warn('Error audio:', name, e); });
}

document.addEventListener('click', function() {
    getAudioCtx();
    if (!preloadedAudio['error']) preloadAudio('error', './error_sound.mp3');
    if (!preloadedAudio['hurry']) preloadAudio('hurry', './hurry_up.mp3');
}, { once: true });

function initAvatars() {
    if (currentUser && currentUser.user_metadata && currentUser.user_metadata.avatar) {
        currentAvatar = currentUser.user_metadata.avatar;
    }
    var disp = document.getElementById('current-avatar-display');
    if (disp) disp.textContent = currentAvatar;
}

window.openAvatarModal = function() {
    var modal = document.getElementById('avatar-modal');
    var grid = document.getElementById('avatar-grid');
    if (!modal || !grid) return;
    var html = '';
    for (var i=0; i<availableAvatars.length; i++) {
        var a = availableAvatars[i];
        var isSel = (a === currentAvatar);
        html += '<div onclick="selectAvatar(\'' + a + '\')" style="height:64px;border-radius:16px;background:' + (isSel ? '#E0E7FF' : '#F8FAFC') + ';border:2px solid ' + (isSel ? '#6366F1' : '#E2E8F0') + ';display:flex;align-items:center;justify-content:center;font-size:32px;cursor:pointer;transition:transform .15s;transform:' + (isSel ? 'scale(1.05)' : 'none') + '">' + a + '</div>';
    }
    grid.innerHTML = html;
    modal.classList.remove('hidden');
};

window.closeAvatarModal = function() {
    var modal = document.getElementById('avatar-modal');
    if (modal) modal.classList.add('hidden');
};

window.selectAvatar = function(a) {
    currentAvatar = a;
    var disp = document.getElementById('current-avatar-display');
    if (disp) disp.textContent = currentAvatar;
    if (currentUser) {
        var client = getSupabase();
        client.auth.updateUser({ data: { avatar: a } });
    }
    closeAvatarModal();
};

window.showCustomConfirm = function(msg, callback) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.8);backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
    var modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:24px;width:100%;max-width:400px;padding:32px 24px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.4);animation:popIn .3s cubic-bezier(.34,1.56,.64,1)';
    var icon = document.createElement('div');
    icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    icon.style.cssText = 'font-size:40px;color:#F59E0B;margin-bottom:16px';
    var text = document.createElement('p');
    text.style.cssText = 'font-size:1rem;font-weight:600;color:#1E293B;margin-bottom:24px;line-height:1.5;';
    text.textContent = msg;
    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:12px;justify-content:center';
    var cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.style.cssText = 'padding:12px 24px;background:#F1F5F9;color:#64748B;border:none;border-radius:12px;font-weight:700;cursor:pointer;flex:1;transition:background 0.2s';
    cancelBtn.onmouseover = function() { this.style.background = '#E2E8F0'; };
    cancelBtn.onmouseout = function() { this.style.background = '#F1F5F9'; };
    cancelBtn.onclick = function() { document.body.removeChild(overlay); };
    var confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Aceptar';
    confirmBtn.style.cssText = 'padding:12px 24px;background:#DC2626;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;flex:1;transition:background 0.2s';
    confirmBtn.onmouseover = function() { this.style.background = '#B91C1C'; };
    confirmBtn.onmouseout = function() { this.style.background = '#DC2626'; };
    confirmBtn.onclick = function() { document.body.removeChild(overlay); callback(); };
    btnRow.appendChild(cancelBtn); btnRow.appendChild(confirmBtn);
    modal.appendChild(icon); modal.appendChild(text); modal.appendChild(btnRow);
    overlay.appendChild(modal); document.body.appendChild(overlay);
};

window.showCustomAlert = function(msg) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.8);backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
    var modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:24px;width:100%;max-width:400px;padding:32px 24px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.4);animation:popIn .3s cubic-bezier(.34,1.56,.64,1)';
    var icon = document.createElement('div');
    icon.innerHTML = '<i class="fas fa-info-circle"></i>';
    icon.style.cssText = 'font-size:40px;color:#3B82F6;margin-bottom:16px';
    var text = document.createElement('p');
    text.style.cssText = 'font-size:1rem;font-weight:600;color:#1E293B;margin-bottom:24px;line-height:1.5;';
    text.textContent = msg;
    var confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Entendido';
    confirmBtn.style.cssText = 'padding:12px 24px;background:#2563EB;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;width:100%;transition:background 0.2s';
    confirmBtn.onmouseover = function() { this.style.background = '#1D4ED8'; };
    confirmBtn.onmouseout = function() { this.style.background = '#2563EB'; };
    confirmBtn.onclick = function() { document.body.removeChild(overlay); };
    modal.appendChild(icon); modal.appendChild(text); modal.appendChild(confirmBtn);
    overlay.appendChild(modal); document.body.appendChild(overlay);
};

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

function exitQuizToHome() {
    if (window.studentLeaderboardInterval) {
        clearInterval(window.studentLeaderboardInterval);
        window.studentLeaderboardInterval = null;
    }
    // Restaurar header
    var header = document.getElementById('quiz-page-header');
    if (header) header.style.display = 'none';
    
    // Ocultar pantalla de quiz
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    
    // Limpiar variables de estado
    quizData = null;
    quizCurrentQ = 0;
    quizAnswers = [];
    quizScore = 0;
    quizStreak = 0;
    
    // Volver al inicio usando la navegación de la SPA
    navigateTo('inicio');
}
window.exitQuizToHome = exitQuizToHome;

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
    var roleEl = document.getElementById('topbar-role');
    var greetEl = document.getElementById('greeting-text');

    if (usernameEl) usernameEl.textContent = name;
    if (avatarEl) avatarEl.textContent = name.charAt(0).toUpperCase();
    if (roleEl) roleEl.textContent = isAdmin ? 'Administrador' : 'Alumno';
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
    
    // Show/hide student sections
    var studentEls = document.querySelectorAll('.student-only');
    for (var i = 0; i < studentEls.length; i++) {
        if (isAdmin) {
            studentEls[i].classList.add('hidden');
        } else {
            studentEls[i].classList.remove('hidden');
        }
    }
    
    initAvatars();

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

    // Verificar si hay un código en la URL (desde QR)
    var urlParams = new URLSearchParams(window.location.search);
    var urlCode = urlParams.get('code');
    
    // Verificar si hay una sesión de quiz pendiente (por si recargó la página)
    var pendingCode = sessionStorage.getItem('alcocer_quiz_code');
    
    if (urlCode && !isAdmin) {
        // Limpiar el parámetro de la URL para evitar re-joins
        window.history.replaceState({}, document.title, window.location.pathname);
        searchAndStartQuiz(urlCode);
    } else if (pendingCode && !isAdmin) {
        searchAndStartQuiz(pendingCode);
    } else {
        var pathParts = window.location.pathname.split('/');
        var pathPage = pathParts[pathParts.length - 1];
        if (pathPage === 'index.html' || pathPage === 'juegos' || pathPage === '') pathPage = 'inicio';
        
        var defaultPage = urlParams.get('page') || pathPage;
        if (window.location.pathname.includes('index.html') || urlParams.has('page')) {
            var cleanUrl = defaultPage === 'inicio' ? '/juegos/' : '/juegos/' + defaultPage;
            window.history.replaceState({page: defaultPage}, '', cleanUrl);
        } else {
            window.history.replaceState({page: defaultPage}, '', window.location.pathname);
        }
        navigateTo(defaultPage, true); // true to avoid pushing duplicate state
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
        showLoginError('Falta usuario o contraseña');
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
                msg = 'Usuario o contraseña incorrectos';
            } else if (errMsg.indexOf('Email not confirmed') !== -1) {
                msg = 'Confirma tu cuenta antes de entrar';
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

function navigateTo(page, skipPush) {
    if (page === 'quiz' && typeof quizData === 'undefined' || (page === 'quiz' && !quizData)) {
        page = 'historial'; // Redirect to historial if reloading the quiz page without active session
    }
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

    // Update URL
    if (!skipPush) {
        var cleanUrl = page === 'inicio' ? '/juegos/' : '/juegos/' + page;
        window.history.pushState({page: page}, '', cleanUrl);
    }
}

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        navigateTo(event.state.page, true);
    } else {
        var pathParts = window.location.pathname.split('/');
        var pathPage = pathParts[pathParts.length - 1];
        if (pathPage === 'index.html' || pathPage === 'juegos' || pathPage === '') pathPage = 'inicio';
        navigateTo(pathPage, true);
    }
});
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
    
    // UI de carga
    var btn = input.nextElementSibling || document.querySelector('button[onclick="joinByCodeFull()"]');
    var oldText = '';
    if (btn) {
        btn.disabled = true;
        oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
    }

    // Wrap the call to restore the button when done (we can't easily wait for the internal Promise, so we set a timeout or rely on the UI changing pages)
    // Actually searchAndStartQuiz handles page changes. If it fails, it shows an alert.
    // Let's modify searchAndStartQuiz to return a Promise or take a callback. Since we don't want to rewrite it all, we just restore it after 3 seconds if we're still on the join page.
    setTimeout(function() {
        if (btn && document.getElementById('page-unirse').style.display !== 'none') {
            btn.disabled = false;
            btn.innerHTML = oldText;
        }
    }, 2500);

    searchAndStartQuiz(code);
}
window.joinByCodeFull = joinByCodeFull;

function searchAndStartQuiz(code) {
    var client = getSupabase();

    // Buscar evaluación por código
    client.from('evaluaciones').select('*').eq('codigo', code).eq('publicado', true).single().then(function(result) {
        if (result.error || !result.data) {
            var dbError = result.error ? result.error.message : 'No existe o ya se cerró';
            alert('❌ Código ' + code + ' no válido.\n\nEl profesor debe estar en la sala de espera AHORA MISMO. Si el profesor recargó la página, se generó un NUEVO código.\n\nDetalle técnico: ' + dbError);
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
            var savedStateStr = sessionStorage.getItem('alcocer_quiz_state_' + code);
            if (savedStateStr) {
                try {
                    var st = JSON.parse(savedStateStr);
                    quizCurrentQ = st.q || 0;
                    quizAnswers = st.a || [];
                } catch(e) {
                    quizCurrentQ = 0;
                    quizAnswers = [];
                }
            } else {
                quizCurrentQ = 0;
                quizAnswers = [];
            }
            quizSelectedOption = -1;
            quizConfirmed = false;

            // Registrar participante en el lobby (upsert para evitar duplicados)
            if (currentUser) {
                var nombreReal = currentUser.user_metadata && currentUser.user_metadata.full_name
                    ? currentUser.user_metadata.full_name
                    : (currentUser.email || '').split('@')[0];
                var nombreConAvatar = currentAvatar + '|' + nombreReal;
                
                client.from('evaluacion_participantes')
                    .select('user_id')
                    .eq('evaluacion_id', evaluacion.id)
                    .eq('user_id', currentUser.id)
                    .single()
                    .then(function(checkRes) {
                        var payload = {
                            evaluacion_id: evaluacion.id,
                            user_id: currentUser.id,
                            nombre: nombreConAvatar,
                            joined_at: new Date().toISOString()
                        };
                        if (checkRes.data) {
                            // Update existing
                            client.from('evaluacion_participantes')
                                .update(payload)
                                .eq('evaluacion_id', evaluacion.id)
                                .eq('user_id', currentUser.id)
                                .then(function(pr) {
                                    if (pr.error) console.warn('No se pudo actualizar participante:', pr.error.message);
                                });
                        } else {
                            // Insert new
                            client.from('evaluacion_participantes')
                                .insert(payload)
                                .then(function(pr) {
                                    if (pr.error) console.warn('No se pudo insertar participante:', pr.error.message);
                                });
                        }
                    });
            }

            // Guardar código en sessionStorage para persistir al recargar
            sessionStorage.setItem('alcocer_quiz_code', code);

            // Mostrar la página de quiz y asegurar que el header sea visible
            document.getElementById('quiz-live-title').textContent = evaluacion.titulo || 'Evaluación';
            document.getElementById('quiz-live-subtitle').textContent = quizData.preguntas.length + ' preguntas • ' + (evaluacion.asignatura || '');
            document.getElementById('quiz-container').style.display = 'none';
            document.getElementById('quiz-result').style.display = 'none';
            var header = document.getElementById('quiz-page-header');
            if (header) header.style.display = 'none';

            navigateTo('quiz');

            // Si el admin ya inició, empezar directamente
            if (evaluacion.iniciado) {
                if (quizCurrentQ > 0) {
                    // Restoring a session that was already started
                    if (quizCurrentQ >= quizData.preguntas.length) {
                        showQuizResults();
                    } else {
                        renderQuizQuestion();
                    }
                } else {
                    showSplashAndStart();
                }
            } else {
                // Mostrar sala de espera y esperar a que el admin inicie
                showWaitingRoom();
            }
        });
    });
}

var waitingPollInterval = null;
var gameMusic = null;

// ═══ GAME MUSIC — Background Audio Element ═══
function startGameMusic() {
    try {
        var audioEl = document.getElementById('quiz-bg-music');
        if (audioEl) {
            audioEl.volume = 0.3; // Volumen moderado para no tapar efectos
            var playPromise = audioEl.play();
            if (playPromise !== undefined) {
                playPromise.catch(function(e) {
                    console.log('Autoplay blocked for music, waiting for interaction:', e);
                });
            }
        }
    } catch (e) { console.log('Music error:', e); }
}

function stopGameMusic() {
    try {
        var audioEl = document.getElementById('quiz-bg-music');
        if (audioEl) {
            audioEl.pause();
            audioEl.currentTime = 0;
        }
    } catch(e) {}
}

function showWaitingRoom() {
    var wt = document.getElementById('quiz-waiting');
    if (wt) wt.style.display = 'flex';
    document.getElementById('quiz-container').style.display = 'none';

    var title = quizData.evaluacion.titulo || 'Evaluación';
    var wtTitle = document.getElementById('waiting-title');
    if (wtTitle) wtTitle.textContent = 'Esperando al profesor...';
    var wtSub = document.getElementById('waiting-subtitle');
    if (wtSub) wtSub.innerHTML = 'Estás en la sala de <b>' + title + '</b><br>El profesor iniciará el juego pronto.';

    // Iniciar música lo-fi
    startGameMusic();
    
    var wtAv = document.getElementById('waiting-avatar-icon');
    if (wtAv) wtAv.textContent = currentAvatar;

    // Poll cada 3 segundos para verificar si el admin inició
    if (waitingPollInterval) clearInterval(waitingPollInterval);
    waitingPollInterval = setInterval(function() {
        if (!quizData || !quizData.evaluacion) return;
        var client = getSupabase();
        client.from('evaluaciones').select('iniciado').eq('id', quizData.evaluacion.id).single().then(function(r) {
            if (r.data && r.data.iniciado) {
                clearInterval(waitingPollInterval);
                waitingPollInterval = null;
                // La música sigue sonando durante el examen
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

function playBeep(freq, type, duration) {
    try {
        var ctx = getAudioCtx();
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        var t = ctx.currentTime;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.1, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + duration);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + duration + 0.1);
    } catch(e) {}
}

function playSuccessSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        
        // Sonido de moneda clásico (Mario Bros)
        o.type = 'square';
        
        // Primera nota: Si 5 (B5) ~ 987.77 Hz
        o.frequency.setValueAtTime(987.77, ctx.currentTime);
        // Segunda nota: Mi 6 (E6) ~ 1318.51 Hz
        o.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
        
        // Control de volumen (Envolvente)
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
        g.gain.setValueAtTime(0.15, ctx.currentTime + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.55);
    } catch(e) {}
}

function playErrorSound() {
    try {
        var ctx = getAudioCtx();
        if (preloadedAudio['error']) {
            var src = ctx.createBufferSource();
            src.buffer = preloadedAudio['error'];
            var g = ctx.createGain();
            g.gain.value = 0.5;
            src.connect(g); g.connect(ctx.destination);
            src.start(0);
        } else {
            var audio = new Audio('./error_sound.mp3');
            audio.volume = 0.5;
            audio.play().catch(function(e) { console.warn('Audio play failed', e); });
        }
    } catch(e) {}
}

function showFeedbackAnimation(isCorrect, ptsEarned) {
    var banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '-150px'; // start hidden
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.zIndex = '9999';
    banner.style.background = isCorrect ? '#10B981' : '#EF4444';
    banner.style.color = '#fff';
    banner.style.padding = '16px 32px';
    banner.style.borderRadius = '16px';
    banner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.gap = '20px';
    banner.style.transition = 'top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    var iconHtml = isCorrect ? '<i class="fas fa-check-circle" style="font-size:2.5rem;"></i>' : '<i class="fas fa-times-circle" style="font-size:2.5rem;"></i>';
    var textHtml = '<div style="display:flex; flex-direction:column;"><span style="font-size:1.5rem; font-weight:900;">' + (isCorrect ? '¡CORRECTO!' : 'INCORRECTO') + '</span>';
    if(isCorrect && ptsEarned) {
        textHtml += '<span style="font-size:1.1rem; font-weight:700; opacity:0.9;">+' + ptsEarned + ' Puntos</span>';
    }
    textHtml += '</div>';

    banner.innerHTML = iconHtml + textHtml;
    document.body.appendChild(banner);
    
    if (isCorrect) playSuccessSound();
    else playErrorSound();
    
    // Slide in
    setTimeout(function() {
        banner.style.top = '24px';
    }, 10);
    
    // Slide out and next
    setTimeout(function() {
        banner.style.top = '-150px';
        setTimeout(function() { 
            if(banner.parentNode) banner.parentNode.removeChild(banner); 
            quizNext();
        }, 400);
    }, 2000);
}

var splashInterval = null;

function showSplashAndStart() {
    // Asegurar que no se ejecute dos veces
    if (splashInterval) {
        clearInterval(splashInterval);
        splashInterval = null;
    }

    // Asegurar que la sala de espera se oculte (música sigue)
    var wt = document.getElementById('quiz-waiting');
    if (wt) wt.style.display = 'none';

    // Iniciar música si no estaba sonando (ej. cuando admin ya inició y estudiante entra)
    startGameMusic();

    var splash = document.getElementById('quiz-splash');
    var splashText = document.getElementById('splash-text');
    
    if (splash && splashText) {
        splash.style.display = 'flex';
        
        // Reset animación forzando reflow
        splashText.style.animation = 'none';
        splashText.offsetHeight; 
        splashText.style.animation = 'splashPulse 1s ease-in-out infinite';

        var count = 3;
        splashText.textContent = count;
        playBeep(440, 'sine', 0.5);
        
        splashInterval = setInterval(function() {
            count--;
            if (count > 0) {
                splashText.textContent = count;
                playBeep(440, 'sine', 0.5);
            } else if (count === 0) {
                splashText.textContent = '¡ADELANTE!';
                playBeep(880, 'square', 0.8);
            } else {
                clearInterval(splashInterval);
                splashInterval = null;
                splash.style.display = 'none';
                document.getElementById('quiz-container').style.display = 'block';
                renderQuizQuestion();
            }
        }, 1000);
    } else {
        document.getElementById('quiz-container').style.display = 'block';
        renderQuizQuestion();
    }
}

function startQuestionTimer(seconds) {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizTimeLeft = seconds;
    
    var timerBar = document.getElementById('quiz-timer-bar');
    if(timerBar) {
        timerBar.style.transition = 'width ' + seconds + 's linear, background 0.3s';
        setTimeout(function() {
            if(!quizConfirmed) timerBar.style.width = '0%';
        }, 50);
    }

    quizTimerInterval = setInterval(function() {
        if (quizConfirmed) return; // Si ya confirmó, parar logica timer
        
        quizTimeLeft--;
        
        if (quizTimeLeft <= 5 && timerBar) {
            timerBar.style.background = '#EF4444';
        }
        
        // Faltando 10 segundos: sonido de apuro
        if (quizTimeLeft === 10) {
            try {
                var ctx = getAudioCtx();
                if (preloadedAudio['hurry']) {
                    var src = ctx.createBufferSource();
                    src.buffer = preloadedAudio['hurry'];
                    var g = ctx.createGain();
                    g.gain.value = 0.7;
                    src.connect(g); g.connect(ctx.destination);
                    src.start(0);
                }
            } catch(e) {}
        }
        
        if (quizTimeLeft <= 3 && quizTimeLeft > 0) {
            playBeep(880, 'sine', 0.15);
        }

        if (quizTimeLeft <= 0) {
            clearInterval(quizTimerInterval);
            playBeep(440, 'square', 0.6);
            if (!quizConfirmed) {
                // Time up! Auto-submit
                quizConfirmed = true;
                quizAnswers.push({ pregunta_id: quizData.preguntas[quizCurrentQ].id, seleccionada: -1, correcta: false, puntos_ganados: 0 });
                
                // Show wrong answers on buttons
                var buttons = document.querySelectorAll('.quiz-opt-btn');
                for(var b=0; b<buttons.length; b++){
                    buttons[b].style.opacity = '0.3';
                    buttons[b].style.pointerEvents = 'none';
                }
                showFeedbackAnimation(false, 0);
            }
        }
    }, 1000);
}

var quizMultiSelections = [];

function renderQuizQuestion() {
    if (!quizData || quizCurrentQ >= quizData.preguntas.length) return;

    var pregunta = quizData.preguntas[quizCurrentQ];
    var total = quizData.preguntas.length;
    var pts = pregunta.puntos || 1;
    var timer = pregunta.temporizador || 30;
    var tipo = pregunta.tipo || 'mc';

    document.getElementById('quiz-question-number').textContent = (quizCurrentQ + 1) + ' / ' + total;
    document.getElementById('quiz-question-text').textContent = pregunta.texto || '';

    // Calculate score
    var currentScore = 0;
    var currentStreak = 0;
    for(var i=0; i<quizAnswers.length; i++){
        if(quizAnswers[i].correcta) {
            currentScore += (quizAnswers[i].puntos_ganados || 0);
            currentStreak++;
        } else {
            currentStreak = 0;
        }
    }
    var scoreEl = document.getElementById('quiz-current-score');
    if(scoreEl) scoreEl.textContent = currentScore;
    var streakEl = document.getElementById('quiz-current-streak');
    if(streakEl) streakEl.textContent = currentStreak;

    var opciones = pregunta.opciones || [];
    var optColors = ['#E91E63', '#2563EB', '#E6A15C', '#059669', '#7C3AED', '#0D9488'];
    var html = '';
    quizMultiSelections = [];

    // Open-ended or fill blanks: show textarea
    if (tipo === 'oa' || tipo === 'fb') {
        var ph = tipo === 'oa' ? 'Escribe tu respuesta aquí...' : 'Completa los espacios en blanco...';
        html += '<textarea id="quiz-open-answer" placeholder="' + ph + '" ' +
            'style="width:100%;min-height:120px;padding:16px;border:2px solid rgba(255,255,255,0.2);border-radius:12px;' +
            'background:rgba(255,255,255,0.9);color:#333;font-size:1.1rem;font-weight:700;resize:vertical;outline:none"></textarea>';
        html += '<button onclick="submitQuizOpen()" style="margin-top:16px;padding:16px 24px;background:#2563EB;' +
            'color:#fff;border:none;border-radius:14px;font-weight:800;cursor:pointer;width:100%;font-size:1.2rem;box-shadow:0 6px 0 #1D4ED8;">Enviar respuesta</button>';
    }
    // Multiple selection
    else if (tipo === 'ms') {
        for (var i = 0; i < opciones.length; i++) {
            var bgColor = optColors[i % optColors.length];
            html += '<button class="quiz-opt-btn" data-idx="' + i + '" onclick="toggleQuizMulti(' + i + ')" ' +
                'style="padding:24px 20px;border:none;border-radius:16px;background:' + bgColor + ';color:#fff;text-align:center;' +
                'font-size:1.2rem;font-weight:800;cursor:pointer;transition:transform .1s, filter .2s;box-shadow:inset 0 -6px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3);">' +
                (opciones[i].text || '') + '</button>';
        }
        html += '<button id="quiz-confirm-multi" onclick="confirmQuizMulti()" style="grid-column: 1 / -1; margin-top:12px;padding:16px 24px;' +
            'background:#22C55E;color:#fff;border:none;border-radius:14px;font-weight:800;cursor:pointer;font-size:1.2rem;box-shadow:0 6px 0 #16A34A;">' +
            'Enviar selección</button>';
    }
    // Normal MC / TF / Poll
    else {
        for (var j = 0; j < opciones.length; j++) {
            var bgColor2 = optColors[j % optColors.length];
            html += '<button class="quiz-opt-btn" data-idx="' + j + '" onclick="confirmQuizAnswerInstant(' + j + ')" ' +
                'style="padding:24px 20px;border:none;border-radius:16px;background:' + bgColor2 + ';color:#fff;text-align:center;' +
                'font-size:1.2rem;font-weight:800;cursor:pointer;transition:transform .1s, filter .2s;box-shadow:inset 0 -6px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3);">' +
                (opciones[j].text || '') + '</button>';
        }
    }

    document.getElementById('quiz-options-list').innerHTML = html;
    document.getElementById('quiz-next-btn').style.display = 'none';
    quizSelectedOption = -1;
    quizConfirmed = false;

    // Reset timer bar color and width
    var tb = document.getElementById('quiz-timer-bar');
    if(tb) {
        tb.style.transition = 'none';
        tb.style.width = '100%';
        tb.style.background = '#22C55E';
        // force reflow
        void tb.offsetWidth;
    }

    startQuestionTimer(timer);
}

var quizConfirmed = false;

function toggleQuizMulti(idx) {
    var pos = quizMultiSelections.indexOf(idx);
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    if (pos === -1) {
        quizMultiSelections.push(idx);
        buttons[idx].style.boxShadow = 'inset 0 0 0 6px rgba(255,255,255,0.7), 0 4px 10px rgba(0,0,0,0.3)';
        buttons[idx].style.transform = 'scale(0.98)';
    } else {
        quizMultiSelections.splice(pos, 1);
        buttons[idx].style.boxShadow = 'inset 0 -6px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3)';
        buttons[idx].style.transform = 'none';
    }
}
window.toggleQuizMulti = toggleQuizMulti;

function confirmQuizMulti() {
    if (quizMultiSelections.length === 0) return;
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizSelectedOption = 1;
    quizConfirmed = true;
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var allCorrect = true;
    
    // Strict boolean check for correctness
    for (var i = 0; i < opciones.length; i++) {
        var isSel = quizMultiSelections.indexOf(i) !== -1;
        var isCorr = opciones[i] && (opciones[i].correct === true || opciones[i].correct === 'true');
        if (isSel && !isCorr) allCorrect = false;
        if (!isSel && isCorr) allCorrect = false;
    }
    
    for (var j = 0; j < buttons.length; j++) {
        var sel = quizMultiSelections.indexOf(j) !== -1;
        var isCorrBtn = opciones[j] && (opciones[j].correct === true || opciones[j].correct === 'true');
        
        if (sel && isCorrBtn) {
            buttons[j].style.boxShadow = 'inset 0 0 0 6px #22C55E, 0 4px 10px rgba(0,0,0,0.3)';
            buttons[j].style.filter = 'brightness(1.2)';
        } else if (sel && !isCorrBtn) {
            buttons[j].style.boxShadow = 'inset 0 0 0 6px #EF4444, 0 4px 10px rgba(0,0,0,0.3)';
            buttons[j].style.filter = 'grayscale(0.5)';
        } else if (!sel && isCorrBtn) {
            buttons[j].style.boxShadow = 'inset 0 0 0 6px #22C55E, 0 4px 10px rgba(0,0,0,0.3)';
            buttons[j].style.filter = 'brightness(1.2)';
        } else {
            buttons[j].style.opacity = '0.3';
        }
        buttons[j].style.pointerEvents = 'none';
    }
    
    var confirmBtn = document.getElementById('quiz-confirm-multi');
    if (confirmBtn) confirmBtn.style.display = 'none';
    
    var pts = getQuizPoints(allCorrect, pregunta);
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: quizMultiSelections, correcta: allCorrect, puntos_ganados: pts });
    
    // Stop the timer bar
    var timerBar = document.getElementById('quiz-timer-bar');
    if(timerBar) {
        var computedWidth = window.getComputedStyle(timerBar).width;
        timerBar.style.transition = 'none';
        timerBar.style.width = computedWidth;
    }
    
    showFeedbackAnimation(allCorrect, pts);
}
window.confirmQuizMulti = confirmQuizMulti;

function submitQuizOpen() {
    var ta = document.getElementById('quiz-open-answer');
    var answer = ta ? ta.value.trim() : '';
    if (!answer) return;
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizSelectedOption = 1;
    quizConfirmed = true;
    ta.style.border = '2px solid #22C55E';
    ta.disabled = true;
    var pregunta = quizData.preguntas[quizCurrentQ];
    
    var isCorrect = true; // Por defecto true para Preguntas Abiertas (oa)
    if (pregunta.tipo === 'fb') {
        var correctPatterns = [];
        if (pregunta.opciones && pregunta.opciones.length > 0 && pregunta.opciones[0].text) {
            correctPatterns = pregunta.opciones[0].text.toLowerCase().split(',').map(function(s){ return s.trim(); });
        }
        var userAnswerLower = answer.toLowerCase().trim();
        
        isCorrect = false;
        if (correctPatterns.length > 0) {
            for (var p = 0; p < correctPatterns.length; p++) {
                if (correctPatterns[p] === userAnswerLower) {
                    isCorrect = true;
                    break;
                }
            }
        }
    }

    if (isCorrect) {
        ta.style.border = '2px solid #22C55E';
        ta.style.background = '#F0FDF4';
        ta.style.color = '#166534';
    } else {
        ta.style.border = '2px solid #EF4444';
        ta.style.background = '#FEF2F2';
        ta.style.color = '#991B1B';
    }
    
    var pts = isCorrect ? ((pregunta.puntos || 1) * 600) : 0;
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: answer, correcta: isCorrect, puntos_ganados: pts });
    
    showFeedbackAnimation(isCorrect, pts);
}
window.submitQuizOpen = submitQuizOpen;

// Seleccionar opción SIN bloquear — permite cambiar antes de confirmar
function selectQuizOption(idx) {
    if (quizConfirmed) return; // Ya confirmó, no se puede cambiar
    quizSelectedOption = idx;

    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var optColors = ['#2563EB', '#0D9488', '#D97706', '#DC2626', '#7C3AED', '#059669'];

    // Resaltar solo la seleccionada, resetear las demás
    for (var i = 0; i < buttons.length; i++) {
        if (i === idx) {
            buttons[i].style.border = '3px solid #2563EB';
            buttons[i].style.background = '#EFF6FF';
            buttons[i].style.transform = 'scale(1.02)';
            buttons[i].style.boxShadow = '0 4px 16px rgba(37,99,235,.2)';
        } else {
            buttons[i].style.border = '2px solid #E2E8F0';
            buttons[i].style.background = '#fff';
            buttons[i].style.transform = 'scale(1)';
            buttons[i].style.boxShadow = 'none';
            buttons[i].style.opacity = '1';
        }
    }

    // Mostrar botón de confirmar
    var confirmBtn = document.getElementById('quiz-confirm-answer');
    if (confirmBtn) confirmBtn.style.display = 'block';
}
window.selectQuizOption = selectQuizOption;

// Confirmar respuesta — ahora sí bloquea y muestra correcto/incorrecto
function confirmQuizAnswer() {
    if (quizSelectedOption === -1 || quizConfirmed) return;
    quizConfirmed = true;
    if (quizTimerInterval) clearInterval(quizTimerInterval);

    var idx = quizSelectedOption;
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var isCorrectAnswer = opciones[idx] && opciones[idx].correct;

    for (var i = 0; i < buttons.length; i++) {
        var isSelected = (i === idx);
        if (isSelected && isCorrectAnswer) {
            buttons[i].style.border = '3px solid #22C55E';
            buttons[i].style.background = '#F0FDF4';
            buttons[i].style.boxShadow = '0 4px 16px rgba(34,197,94,.25)';
        } else if (isSelected && !isCorrectAnswer) {
            buttons[i].style.border = '3px solid #EF4444';
            buttons[i].style.background = '#FEF2F2';
            buttons[i].style.boxShadow = '0 4px 16px rgba(239,68,68,.25)';
        } else {
            buttons[i].style.opacity = '0.4';
            buttons[i].style.transform = 'scale(0.98)';
        }
        buttons[i].style.cursor = 'default';
        buttons[i].style.pointerEvents = 'none';
    }

    // Ocultar botón confirmar
    var confirmBtn = document.getElementById('quiz-confirm-answer');
    if (confirmBtn) confirmBtn.style.display = 'none';

    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: idx, correcta: isCorrectAnswer });
    
    showFeedbackAnimation(isCorrectAnswer, isCorrectAnswer ? (pregunta.puntos || 1) * 600 : 0);
}
window.confirmQuizAnswer = confirmQuizAnswer;

function getQuizPoints(isCorrect, pregunta) {
    if(!isCorrect) return 0;
    var base = 600;
    var totalTimer = pregunta.temporizador || 30;
    var timeRatio = Math.max(0, quizTimeLeft) / totalTimer;
    var timePts = Math.round(timeRatio * 400); // Hasta 400 pts por tiempo
    
    var currentStreak = 0;
    for(var i=0; i<quizAnswers.length; i++) {
        if(quizAnswers[i].correcta) currentStreak++;
        else currentStreak = 0;
    }
    // Bonus de racha como Quizizz
    var streakBonus = currentStreak >= 2 ? Math.min(300, currentStreak * 50) : 0;
    
    return Math.round((base + timePts + streakBonus) * (pregunta.puntos || 1));
}

function confirmQuizAnswerInstant(idx) {
    if (quizConfirmed) return;
    quizConfirmed = true;
    if (quizTimerInterval) clearInterval(quizTimerInterval);

    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var isCorrectAnswer = opciones[idx] && opciones[idx].correct;

    for (var i = 0; i < buttons.length; i++) {
        var isSelected = (i === idx);
        if (isSelected && isCorrectAnswer) {
            buttons[i].style.filter = 'brightness(1.2)';
            buttons[i].style.border = '4px solid #fff';
        } else if (isSelected && !isCorrectAnswer) {
            buttons[i].style.filter = 'grayscale(0.5)';
            buttons[i].style.opacity = '0.7';
            buttons[i].style.border = '4px solid #EF4444';
        } else if (opciones[i] && opciones[i].correct) {
            buttons[i].style.filter = 'brightness(1.2)';
            buttons[i].style.border = '4px solid #22C55E';
        } else {
            buttons[i].style.opacity = '0.3';
        }
        buttons[i].style.cursor = 'default';
        buttons[i].style.pointerEvents = 'none';
    }

    var pts = getQuizPoints(isCorrectAnswer, pregunta);
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: idx, correcta: isCorrectAnswer, puntos_ganados: pts });
    
    // Stop the timer bar
    var timerBar = document.getElementById('quiz-timer-bar');
    if(timerBar) {
        var computedWidth = window.getComputedStyle(timerBar).width;
        timerBar.style.transition = 'none';
        timerBar.style.width = computedWidth;
    }

    showFeedbackAnimation(isCorrectAnswer, pts);
}
window.confirmQuizAnswerInstant = confirmQuizAnswerInstant;

function quizNext() {
    quizCurrentQ++;
    if (quizData && quizData.evaluacion && quizData.evaluacion.codigo) {
        sessionStorage.setItem('alcocer_quiz_state_' + quizData.evaluacion.codigo, JSON.stringify({
            q: quizCurrentQ,
            a: quizAnswers
        }));
    }
    if (quizCurrentQ >= quizData.preguntas.length) { showQuizResults(); }
    else { renderQuizQuestion(); }
}
window.quizNext = quizNext;

function showQuizResults() {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    stopGameMusic(); // Parar música al terminar
    // Limpiar sesión pendiente — el quiz terminó
    sessionStorage.removeItem('alcocer_quiz_code');
    if (quizData && quizData.evaluacion) {
        sessionStorage.removeItem('alcocer_quiz_state_' + quizData.evaluacion.codigo);
    }
    var correctas = 0;
    var totalPoints = 0;
    for (var i = 0; i < quizAnswers.length; i++) { 
        if (quizAnswers[i].correcta) correctas++; 
        totalPoints += (quizAnswers[i].puntos_ganados || 0);
    }
    var total = quizData.preguntas.length;
    var pct = Math.round((correctas / total) * 100);

    document.getElementById('quiz-container').style.display = 'none';
    var header = document.getElementById('quiz-page-header');
    if (header) header.style.display = 'none';
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
        breakdownEl.innerHTML = bhtml;
    }

    // Mostrar Resumen de Preguntas detallado
    var reviewEl = document.getElementById('quiz-review-list');
    if(reviewEl) {
        var rhtml = '';
        for(var q=0; q<quizData.preguntas.length; q++) {
            var pq = quizData.preguntas[q];
            var ans = quizAnswers[q];
            var ok = ans ? ans.correcta : false;
            var color = ok ? '#22C55E' : '#EF4444';
            var icon = ok ? 'fa-check' : 'fa-times';
            var scoreText = ok ? ('+' + (ans.puntos_ganados || 0) + ' pts') : '0 pts';
            
            rhtml += '<div style="background:#fff; border-left:6px solid '+color+'; border-radius:12px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">';
            rhtml += '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">';
            rhtml += '<div style="font-weight:800; color:#1E293B; flex:1; padding-right:16px; font-size:1.1rem;">' + (q+1) + '. ' + (pq.texto||'') + '</div>';
            rhtml += '<div style="background:'+(ok?'#DCFCE7':'#FEE2E2')+'; color:'+color+'; padding:6px 12px; border-radius:8px; font-weight:800; font-size:0.95rem; white-space:nowrap;"><i class="fas '+icon+'"></i> '+scoreText+'</div>';
            rhtml += '</div>';
            
            if(pq.tipo === 'mc' || !pq.tipo || pq.tipo === 'ms') {
                var opts = pq.opciones || [];
                rhtml += '<div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">';
                for(var o=0; o<opts.length; o++) {
                    var isSelected = false;
                    if(pq.tipo === 'ms') {
                        isSelected = ans && ans.seleccionada && ans.seleccionada.indexOf(o) !== -1;
                    } else {
                        isSelected = ans && ans.seleccionada === o;
                    }
                    var isCorrect = opts[o].correct;
                    var optColor = isCorrect ? '#22C55E' : (isSelected ? '#EF4444' : '#E2E8F0');
                    var bg = isCorrect ? '#F0FDF4' : (isSelected ? '#FEF2F2' : '#F8FAFC');
                    var fontWeight = (isCorrect || isSelected) ? '700' : '500';
                    var icon2 = isCorrect ? '✓' : (isSelected ? '✗' : '');
                    rhtml += '<div style="padding:10px 16px; border:2px solid '+optColor+'; background:'+bg+'; border-radius:8px; color:#334155; font-weight:'+fontWeight+'; display:flex; justify-content:space-between;">';
                    rhtml += '<span>' + (opts[o].text||'') + '</span>';
                    rhtml += '<span style="color:'+optColor+'; font-weight:900;">' + icon2 + '</span>';
                    rhtml += '</div>';
                }
                rhtml += '</div>';
            } else if (pq.tipo === 'oa' || pq.tipo === 'fb') {
                rhtml += '<div style="margin-top:16px; padding:12px; background:#F8FAFC; border:2px solid #E2E8F0; border-radius:8px;">';
                rhtml += '<div style="font-weight:700; color:#475569; font-size:0.85rem; margin-bottom:4px;">Tu respuesta:</div>';
                rhtml += '<div style="font-weight:600; color:#1E293B;">' + (ans ? ans.seleccionada : 'Sin responder') + '</div>';
                rhtml += '</div>';
            }
            rhtml += '</div>';
        }
        reviewEl.innerHTML = rhtml;
        document.getElementById('quiz-review-section').style.display = 'block';
    }

    // Guardar en Supabase y cargar leaderboard
    var evalIdForBoard = quizData.evaluacion.id;
    if (currentUser) {
        var client = getSupabase();
        client.from('evaluacion_resultados').insert({
            evaluacion_id: evalIdForBoard,
            user_id: currentUser.id,
            puntaje: totalPoints, // Actualizado a PUNTOS reales (Quizizz style)
            total: total,
            porcentaje: pct,
            respuestas: quizAnswers
        }).then(function(r) {
            if (r.error) {
                console.warn('Insert resultado:', r.error.message);
                // Mostrar alerta en pantalla si es error de RLS para el estudiante
                if (r.error.message && r.error.message.toLowerCase().includes('row-level security')) {
                    document.getElementById('quiz-result-breakdown').innerHTML += '<div style="color:red; margin-bottom: 10px;">⚠️ Tu nota no se guardó porque el profesor no ha habilitado los permisos en la base de datos.</div>';
                }
                
                // Si falla por duplicado, intentar update
                client.from('evaluacion_resultados').update({
                    puntaje: totalPoints, // Actualizado a PUNTOS reales
                    total: total,
                    porcentaje: pct,
                    respuestas: quizAnswers
                }).eq('evaluacion_id', evalIdForBoard).eq('user_id', currentUser.id).then(function() {
                    loadLeaderboard(evalIdForBoard);
                }).catch(function() {
                    loadLeaderboard(evalIdForBoard);
                });
            } else {
                loadLeaderboard(evalIdForBoard);
            }
        }).catch(function() {
            loadLeaderboard(evalIdForBoard);
        });
    } else {
        // Sin usuario, aún mostrar leaderboard
        loadLeaderboard(evalIdForBoard);
    }
}

function loadLeaderboard(evalId) {
    if (!window.studentLeaderboardInterval) {
        window.studentLeaderboardInterval = setInterval(function() {
            loadLeaderboard(evalId);
        }, 5000);
    }
    var client = getSupabase();
    console.log('Loading leaderboard for:', evalId);
    client.from('evaluacion_resultados').select('user_id,puntaje,total,porcentaje').eq('evaluacion_id', evalId).order('porcentaje', { ascending: false }).order('puntaje', { ascending: false }).then(function(r) {
        console.log('Leaderboard data:', r.data, 'Error:', r.error);
        if (r.error) { 
            console.warn('Leaderboard error:', r.error.message); 
            // Mostrar error visual si es por permisos (RLS)
            var podiumEl = document.getElementById('quiz-podium');
            if (podiumEl) {
                podiumEl.style.display = 'block';
                podiumEl.innerHTML = '<div style="padding:20px;background:rgba(255,0,0,0.2);color:#fff;border-radius:12px;margin-bottom:20px;border:2px solid red;"><b>⚠️ ERROR DE BASE DE DATOS</b><br>Las políticas RLS de Supabase están bloqueando a los estudiantes.<br>El profesor debe ir al panel de Supabase y ejecutar el código SQL de permisos.</div>';
            }
            return; 
        }
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
                    var raw = pRes.data[n].nombre || 'Estudiante';
                    var av = '👤';
                    var nm = raw;
                    if (raw.indexOf('|') !== -1) {
                        var parts = raw.split('|');
                        av = parts[0]; nm = parts[1];
                    }
                    nameMap[pRes.data[n].user_id] = { nombre: nm, avatar: av };
                }
            }

            var results = r.data;
            // Build leaderboard entries
            var entries = [];
            for (var k = 0; k < results.length; k++) {
                var mapData = nameMap[results[k].user_id] || { nombre: 'Estudiante', avatar: '👤' };
                entries.push({
                    user_id: results[k].user_id,
                    nombre: mapData.nombre,
                    avatar: mapData.avatar,
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

    // Reproducir sonido triunfal (solo una vez)
    if (!window._triumphPlayed) {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var o = ctx.createOscillator();
            var o2 = ctx.createOscillator();
            var g = ctx.createGain();
            o.type = 'square'; o2.type = 'triangle';
            var notes = [523.25, 659.25, 783.99, 1046.50]; // Fanfarria: C5, E5, G5, C6
            var t = ctx.currentTime;
            for (var i = 0; i < notes.length; i++) {
                o.frequency.setValueAtTime(notes[i], t + i * 0.15);
                o2.frequency.setValueAtTime(notes[i]/2, t + i * 0.15); // Octava baja
            }
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(0.15, t + 0.1);
            g.gain.setValueAtTime(0.15, t + 0.5);
            g.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
            o.connect(g); o2.connect(g); g.connect(ctx.destination);
            o.start(t); o2.start(t); o.stop(t + 1.6); o2.stop(t + 1.6);
            window._triumphPlayed = true;
        } catch(e) {}
    }

    // Evitar re-renders innecesarios o repeticiones de animación molestas
    var currentDataStr = JSON.stringify(entries);
    if (window._lastPodiumData === currentDataStr) {
        return; 
    }
    window._lastPodiumData = currentDataStr;

    var isFirstRender = !document.getElementById('podium-pillars').innerHTML.trim();

    // Top 3 Stadium Podium
    var pillarOrder = [1, 0, 2];
    var pillarsHtml = '';
    
    for (var p = 0; p < 3; p++) {
        var idx = pillarOrder[p];
        if (idx >= entries.length) {
            pillarsHtml += '<div style="flex:1;max-width:120px"></div>';
            continue;
        }
        var e = entries[idx];
        var rankClass = idx === 0 ? 'rank-1' : (idx === 1 ? 'rank-2' : 'rank-3');
        var rankText = idx === 0 ? '1st' : (idx === 1 ? '2nd' : '3rd');
        
        var animStyle = isFirstRender 
            ? ('animation-delay:' + (p*0.2) + 's') 
            : 'animation: none !important; opacity: 1 !important; transform: translateY(0) !important;';
            
        pillarsHtml += '<div class="podium-cylinder ' + rankClass + '" style="' + animStyle + '">';
        
        // Avatar standing on top
        pillarsHtml += '<div class="podium-avatar-wrapper">';
        pillarsHtml += '<div class="podium-avatar">' + e.avatar + '</div>';
        pillarsHtml += '<div class="podium-name">' + e.nombre + '</div>';
        pillarsHtml += '</div>';

        // The cylinder body
        pillarsHtml += '<div class="cylinder-top"></div>';
        pillarsHtml += '<div class="cylinder-body">';
        pillarsHtml += '<div class="cylinder-rank">' + rankText + '</div>';
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
            if(rankPill) {
                rankPill.innerHTML = '🎯 Tu posición: <strong style="font-size:1.1rem;margin:0 4px">' + myRank + '°</strong> de ' + entries.length + ' estudiantes';
                rankPill.style.display = 'inline-block';
            }
        }
    }

    // Full list table
    var listHtml = '';
    for (var l = 0; l < entries.length; l++) {
        var isMe = currentUser && entries[l].user_id === currentUser.id;
        var rClass = l === 0 ? 'tr-gold' : (l === 1 ? 'tr-silver' : (l === 2 ? 'tr-bronze' : 'tr-normal'));
        
        listHtml += '<tr' + (isMe ? ' style="background:rgba(233,30,99,.05);"' : '') + '>';
        
        // Rank
        listHtml += '<td style="width:60px;"><div class="tr-rank-circle ' + rClass + '">' + (l + 1) + '</div></td>';
        
        // Player
        listHtml += '<td><div style="display:flex;align-items:center;gap:12px;">';
        listHtml += '<div style="font-size:24px;">' + entries[l].avatar + '</div>';
        listHtml += '<div style="font-weight:700;color:var(--text-dark);">' + entries[l].nombre + (isMe ? ' <span style="font-size:10px;background:#E91E63;color:#fff;padding:2px 6px;border-radius:4px;margin-left:4px;">TÚ</span>' : '') + '</div>';
        listHtml += '</div></td>';
        
        // Score
        listHtml += '<td style="text-align:right;"><div style="font-weight:800;color:var(--text-dark);font-size:1.1rem;">' + entries[l].puntaje + ' <span style="font-size:0.8rem;color:var(--text-mid);font-weight:600;">pts</span></div></td>';
        
        // Percentage
        listHtml += '<td style="text-align:right;width:80px;"><div style="font-weight:700;color:var(--blue);">' + entries[l].porcentaje + '%</div></td>';
        
        listHtml += '</tr>';
    }
    
    var fullListEl = document.getElementById('podium-full-list');
    if(fullListEl) fullListEl.innerHTML = listHtml;
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
            html += '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:20px;margin-bottom:12px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;transition:box-shadow .2s" onmouseover="this.style.boxShadow=\'0 4px 16px rgba(0,0,0,.08)\'" onmouseout="this.style.boxShadow=\'none\'">' +
                '<div style="flex:1;min-width:200px">' +
                '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:6px">' +
                '<h3 style="font-size:16px;font-weight:700;color:#1E293B;margin:0">' + (ev.titulo || 'Sin título') + '</h3>' +
                statusBadge + '</div>' +
                '<div style="display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:#64748B">' +
                '<span><i class="fas fa-book"></i> ' + (ev.asignatura || 'General') + (ev.tema ? ' - ' + ev.tema : '') + '</span>' +
                '<span><i class="fas fa-calendar"></i> ' + fecha + '</span>' +
                codeHtml + '</div></div>' +
                '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end">' +
                '<button onclick="window.location.href=\'editor.html?id=' + ev.id + 
                '\'" style="padding:8px 14px;background:#F0F1F3;border:1px solid #E2E8F0;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;color:#555"><i class="fas fa-edit"></i> Editar</button>' +
                (ev.publicado ? '<button onclick="window.location.href=\'editor.html?id=' + ev.id + '&results=true\'" style="padding:8px 14px;background:#8B5CF6;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;" title="Resultados en vivo"><i class="fas fa-trophy"></i> Resultados</button>' : '') +
                (ev.publicado ? '<button onclick="window.location.href=\'editor.html?id=' + ev.id + '&play=true\'" style="padding:8px 14px;background:#2563EB;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;" title="Abrir sala de juego"><i class="fas fa-play"></i> Jugar</button>' : '') +
                '<button onclick="deleteQuiz(\'' + ev.id + '\')" style="padding:8px 14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;color:#DC2626;" title="Borrar"><i class="fas fa-trash-alt"></i></button>' +
                '</div></div>';
        }
        container.innerHTML = html;
    });
}

window.deleteQuiz = function(id) {
    var btn = event.currentTarget;
    showCustomConfirm('¿Estás seguro de que deseas borrar permanentemente esta evaluación? Todos los resultados e informes asociados también se perderán.', function() {
        if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        var client = getSupabase();
        
        // Primero intentamos borrar dependencias (por si la BD no tiene ON DELETE CASCADE configurado)
        Promise.all([
            client.from('evaluacion_preguntas').delete().eq('evaluacion_id', id),
            client.from('evaluacion_participantes').delete().eq('evaluacion_id', id),
            client.from('evaluacion_resultados').delete().eq('evaluacion_id', id)
        ]).then(function() {
            // Finalmente borramos la evaluación padre
            client.from('evaluaciones').delete().eq('id', id).then(function(r) {
                if (r.error) {
                    showCustomAlert('Error al borrar: ' + r.error.message);
                    if (btn) btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                } else {
                    loadLibrary();
                    if (typeof loadReports === 'function') loadReports();
                }
            });
        });
    });
};

// ═══ ADMIN: INFORMES — Resultados de estudiantes ═══

window.adminReportsData = {};
window.adminReportsNameMap = {};

window.openReportDetail = function(evalId, userId) {
    if(!window.adminReportsData || !window.adminReportsData[evalId]) return;
    var r = window.adminReportsData[evalId].find(function(x) { return x.user_id === userId; });
    
    // Robust Fallback: If no exact user_id match (due to RLS column restrictions or device states)
    // and there is only 1 result inside the array, default to it as it represents the student's own score.
    if(!r && window.adminReportsData[evalId].length > 0) {
        r = window.adminReportsData[evalId][0];
    }
    
    if(!r) return;
    
    var overlay = document.createElement('div');
    overlay.id = 'report-detail-modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.8);backdrop-filter:blur(8px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    var modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:24px;width:100%;max-width:600px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.4);animation:popIn .3s cubic-bezier(.34,1.56,.64,1);overflow:hidden;';
    
    var studentName = window.adminReportsNameMap ? (window.adminReportsNameMap[evalId+'_'+userId] || 'Estudiante') : 'Estudiante';
    var header = document.createElement('div');
    header.style.cssText = 'padding:24px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center;';
    header.innerHTML = '<h2 style="font-size:1.2rem;font-weight:800;color:#1E293B;margin:0;"><i class="fas fa-user-circle" style="color:#94A3B8;margin-right:8px;"></i>' + studentName + '</h2>' +
                       '<button onclick="document.body.removeChild(document.getElementById(\'report-detail-modal\'))" style="background:none;border:none;font-size:28px;color:#94A3B8;cursor:pointer;padding:0;line-height:1;">&times;</button>';
    modal.appendChild(header);
    
    var bodyContainer = document.createElement('div');
    bodyContainer.style.cssText = 'padding:24px;overflow-y:auto;flex:1;';
    bodyContainer.innerHTML = '<div style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:32px;color:#94A3B8;"></i></div>';
    modal.appendChild(bodyContainer);
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    var client = getSupabase();
    client.from('evaluacion_preguntas').select('orden, texto, opciones, tipo').eq('evaluacion_id', evalId).order('orden').then(function(qRes) {
        if(qRes.error || !qRes.data) {
            bodyContainer.innerHTML = '<div style="color:#EF4444;text-align:center;padding:20px;font-weight:700;"><i class="fas fa-exclamation-triangle"></i> Error cargando preguntas</div>';
            return;
        }
        var qs = qRes.data;
        var html = '';
        html += '<div style="display:flex;gap:12px;margin-bottom:24px;">';
        var correctCount = 0;
        var ans = r.respuestas || [];
        if (ans && ans.length > 0) {
            for (var aIndex = 0; aIndex < ans.length; aIndex++) {
                if (ans[aIndex] && ans[aIndex].correcta) {
                    correctCount++;
                }
            }
        } else {
            correctCount = Math.round(((r.porcentaje || 0) / 100) * (r.total || 0));
        }
        
        var totalCount = r.total || qs.length || 0;
        html += '<div style="flex:1;background:#F0FDF4;padding:16px;border-radius:16px;text-align:center;border:2px solid #DCFCE7;"><div style="font-size:28px;font-weight:900;color:#166534;">'+correctCount+' / '+totalCount+'</div><div style="font-size:13px;color:#15803D;font-weight:800;">Correctas</div></div>';
        html += '<div style="flex:1;background:#EFF6FF;padding:16px;border-radius:16px;text-align:center;border:2px solid #DBEAFE;"><div style="font-size:28px;font-weight:900;color:#1E40AF;">'+r.porcentaje+'%</div><div style="font-size:13px;color:#1D4ED8;font-weight:800;">Precisión</div></div>';
        html += '</div>';
        
        var ans = r.respuestas || [];
        for(var i=0; i<qs.length; i++) {
            var q = qs[i];
            var a = ans[i];
            var isCorrect = a ? a.correcta : false;
            var qColor = isCorrect ? '#22C55E' : '#EF4444';
            var qBg = isCorrect ? '#F0FDF4' : '#FEF2F2';
            var qIcon = isCorrect ? 'fa-check-circle' : 'fa-times-circle';
            
            html += '<div style="background:'+qBg+';border:2px solid '+qColor+'40;border-radius:16px;padding:20px;margin-bottom:16px;">';
            html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">';
            html += '<div style="font-weight:800;color:#1E293B;font-size:1.05rem;line-height:1.4;flex:1;padding-right:12px;">' + (i+1) + '. ' + (q.texto||'') + '</div>';
            html += '<div style="color:'+qColor+';font-size:1.4rem;"><i class="fas '+qIcon+'"></i></div>';
            html += '</div>';
            
            if(q.tipo === 'mc' || !q.tipo || q.tipo === 'ms') {
                var opts = q.opciones || [];
                html += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">';
                for(var o=0; o<opts.length; o++) {
                    var isSelected = false;
                    if(q.tipo === 'ms') {
                        isSelected = a && a.seleccionada && a.seleccionada.indexOf(o) !== -1;
                    } else {
                        isSelected = a && a.seleccionada === o;
                    }
                    var isOptCorrect = opts[o].correct;
                    var oColor = isOptCorrect ? '#166534' : (isSelected ? '#991B1B' : '#475569');
                    var oBg = isOptCorrect ? '#DCFCE7' : (isSelected ? '#FEE2E2' : '#FFFFFF');
                    var oBorder = isOptCorrect ? '#86EFAC' : (isSelected ? '#FECACA' : '#CBD5E1');
                    var oIcon = isOptCorrect ? '<i class="fas fa-check"></i>' : (isSelected ? '<i class="fas fa-times"></i>' : '');
                    var oWeight = (isOptCorrect || isSelected) ? '800' : '600';
                    
                    html += '<div style="padding:10px 16px;background:'+oBg+';border:2px solid '+oBorder+';border-radius:12px;font-size:0.95rem;font-weight:'+oWeight+';color:'+oColor+';display:flex;justify-content:space-between;align-items:center;">';
                    html += '<span>' + (opts[o].text||'') + '</span>';
                    html += '<span style="font-size:1.1rem;">' + oIcon + '</span>';
                    html += '</div>';
                }
                html += '</div>';
            } else {
                html += '<div style="margin-top:16px;padding:12px;background:#FFF;border:2px solid #E2E8F0;border-radius:12px;">';
                html += '<div style="font-size:0.85rem;color:#64748B;font-weight:800;margin-bottom:6px;">Respuesta del estudiante:</div>';
                html += '<div style="font-weight:700;color:#0F172A;font-size:1rem;">' + (a ? a.seleccionada : 'Sin responder') + '</div>';
                html += '<div style="font-size:0.85rem;color:#10B981;font-weight:800;margin-top:12px;margin-bottom:6px;">Respuesta correcta esperada:</div>';
                var respCorrecta = '';
                if (q.tipo === 'fb') {
                    respCorrecta = (q.opciones && q.opciones.length > 0 && q.opciones[0].text) ? q.opciones[0].text : 'Sin patrón';
                } else if (q.tipo === 'oa') {
                    respCorrecta = 'Criterio abierto (Evaluado por el profesor)';
                } else {
                    respCorrecta = q.respuesta_correcta || '';
                }
                html += '<div style="font-weight:700;color:#047857;font-size:1rem;">' + respCorrecta + '</div>';
                html += '</div>';
            }
            html += '</div>';
        }
        bodyContainer.innerHTML = html;
    });
};

function loadReports() {
    var container = document.getElementById('reports-list');
    if (!container || !currentUser) return;
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:24px"></i><p style="margin-top:12px;font-weight:600;">Cargando informes...</p></div>';

    var client = getSupabase();
    client.from('evaluaciones').select('id, titulo, codigo').eq('created_by', currentUser.id).eq('publicado', true).then(function(evRes) {
        if (evRes.error || !evRes.data || evRes.data.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>No hay informes disponibles</p><small>Publica evaluaciones para ver los resultados</small></div>';
            return;
        }
        var evalIds = evRes.data.map(function(e) { return e.id; });
        
        Promise.all([
            client.from('evaluacion_resultados').select('*').in('evaluacion_id', evalIds),
            client.from('evaluacion_participantes').select('evaluacion_id, user_id, nombre').in('evaluacion_id', evalIds)
        ]).then(function(responses) {
            var rRes = responses[0];
            var pRes = responses[1];
            
            if (rRes.error || !rRes.data || rRes.data.length === 0) {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>Aún no hay resultados</p><small>Los resultados aparecerán cuando los estudiantes completen evaluaciones</small></div>';
                return;
            }
            
            window.adminReportsNameMap = {};
            window.adminStudentNames = {};
            if (!pRes.error && pRes.data) {
                for (var n = 0; n < pRes.data.length; n++) {
                    var p = pRes.data[n];
                    if (p.evaluacion_id && p.user_id) {
                        var nm = p.nombre;
                        if(nm && nm.indexOf('|') !== -1) nm = nm.split('|')[1];
                        window.adminReportsNameMap[p.evaluacion_id + '_' + p.user_id] = nm;
                        window.adminStudentNames[p.user_id] = nm;
                    }
                }
            }
            
            window.adminReportsData = {};
            var globalStats = {};
            for (var i = 0; i < rRes.data.length; i++) {
                var res = rRes.data[i];
                if (!window.adminReportsData[res.evaluacion_id]) window.adminReportsData[res.evaluacion_id] = [];
                window.adminReportsData[res.evaluacion_id].push(res);
                
                if (res.user_id) {
                    if (!globalStats[res.user_id]) {
                        globalStats[res.user_id] = { id: res.user_id, pts: 0, count: 0, pctSum: 0 };
                    }
                    globalStats[res.user_id].pts += (res.puntaje || 0);
                    globalStats[res.user_id].count++;
                    globalStats[res.user_id].pctSum += (res.porcentaje || 0);
                }
            }
            
            var globalArr = [];
            for (var uid in globalStats) {
                var st = globalStats[uid];
                st.name = window.adminStudentNames[uid] || (uid.substring(0,8) + '...');
                st.avgPct = Math.round(st.pctSum / st.count);
                globalArr.push(st);
            }
            globalArr.sort(function(a, b) {
                if (b.pts !== a.pts) return b.pts - a.pts;
                return b.avgPct - a.avgPct;
            });
            
            var html = '';
            
            if (globalArr.length > 0) {
                html += '<div style="background:linear-gradient(145deg, #1E293B, #020617); border-radius:16px; padding:24px; margin-bottom:32px; box-shadow:0 12px 30px rgba(0,0,0,0.15); color:#fff; position:relative; overflow:hidden;">';
                html += '<div style="position:absolute; top:-30px; right:-20px; opacity:0.05; font-size:140px; transform:rotate(-15deg); pointer-events:none;"><i class="fas fa-trophy"></i></div>';
                html += '<h2 style="font-size:22px; font-weight:900; margin-bottom:4px; display:flex; align-items:center; gap:10px;"><i class="fas fa-crown" style="color:#FBBF24; filter:drop-shadow(0 2px 4px rgba(251,191,36,0.3));"></i> Ranking Histórico Top 10</h2>';
                html += '<p style="font-size:13px; color:#94A3B8; margin-bottom:24px; font-weight:600;">Acumulado de puntos de todas tus evaluaciones</p>';
                
                html += '<div style="display:flex; flex-direction:column; gap:10px; position:relative; z-index:2;">';
                for (var g = 0; g < Math.min(globalArr.length, 10); g++) {
                    var st = globalArr[g];
                    var rankIcon = (g + 1);
                    var bg = 'rgba(30, 41, 59, 0.6)';
                    var border = '1px solid rgba(255,255,255,0.05)';
                    var rCol = '#94A3B8';
                    if (g === 0) { rankIcon = '🥇'; bg = 'linear-gradient(90deg, rgba(251, 191, 36, 0.15), rgba(30, 41, 59, 0.6))'; border = '1px solid rgba(251, 191, 36, 0.3)'; rCol = '#FBBF24'; }
                    else if (g === 1) { rankIcon = '🥈'; bg = 'linear-gradient(90deg, rgba(148, 163, 184, 0.15), rgba(30, 41, 59, 0.6))'; border = '1px solid rgba(148, 163, 184, 0.3)'; rCol = '#E2E8F0'; }
                    else if (g === 2) { rankIcon = '🥉'; bg = 'linear-gradient(90deg, rgba(217, 119, 6, 0.15), rgba(30, 41, 59, 0.6))'; border = '1px solid rgba(217, 119, 6, 0.3)'; rCol = '#D97706'; }
                    
                    var pColor = st.avgPct >= 70 ? '#4ADE80' : st.avgPct >= 40 ? '#FBBF24' : '#F87171';

                    html += '<div style="display:flex; align-items:center; padding:12px 16px; background:' + bg + '; border:' + border + '; border-radius:12px; transition:transform 0.2s;">';
                    html += '<div style="width:36px; font-weight:900; font-size:18px; color:' + rCol + '; text-align:center;">' + rankIcon + '</div>';
                    html += '<div style="flex:1; padding-left:12px;">';
                    html += '<div style="font-weight:800; font-size:15px; color:#F8FAFC;">' + st.name + '</div>';
                    html += '<div style="font-size:11px; color:#94A3B8; font-weight:600; margin-top:2px;">' + st.count + ' evaluación(es) completada(s)</div>';
                    html += '</div>';
                    
                    html += '<div style="text-align:right; padding-right:16px;">';
                    html += '<div style="font-weight:900; font-size:18px; color:#38BDF8;">' + (st.pts || 0).toLocaleString() + ' <span style="font-size:11px; color:#7DD3FC; font-weight:700;">pts</span></div>';
                    html += '</div>';
                    
                    html += '<div style="text-align:right;">';
                    html += '<div style="display:inline-block; padding:4px 8px; border-radius:8px; background:' + pColor + '20; color:' + pColor + '; font-weight:800; font-size:13px;">' + st.avgPct + '%</div>';
                    html += '</div>';
                    
                    html += '</div>';
                }
                html += '</div></div>';
                
                html += '<h2 style="font-size:18px; font-weight:800; margin-bottom:16px; color:#1E293B;"><i class="fas fa-layer-group" style="margin-right:8px; color:#64748B;"></i> Reportes por Evaluación</h2>';
            }
            for (var j = 0; j < evRes.data.length; j++) {
                var ev = evRes.data[j];
                var results = window.adminReportsData[ev.id] || [];
                if (results.length === 0) continue;
                
                results.sort(function(a, b) {
                    if (b.porcentaje !== a.porcentaje) return b.porcentaje - a.porcentaje;
                    return b.puntaje - a.puntaje;
                });
                
                var avgPct = 0;
                for (var k = 0; k < results.length; k++) avgPct += (results[k].porcentaje || 0);
                avgPct = Math.round(avgPct / results.length);
                var barColor = avgPct >= 70 ? '#22C55E' : avgPct >= 40 ? '#F59E0B' : '#EF4444';

                html += '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:24px;margin-bottom:20px;box-shadow:0 4px 12px rgba(0,0,0,0.02)">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">';
                html += '<div><h3 style="font-size:18px;font-weight:800;color:#1E293B;margin-bottom:4px;">' + (ev.titulo || 'Sin título') + '</h3>';
                html += '<span style="font-size:13px;color:#64748B;font-weight:600;"><i class="fas fa-users" style="margin-right:4px;"></i>' + results.length + ' participante(s) • <i class="fas fa-key" style="margin-right:4px;margin-left:8px;"></i>' + (ev.codigo || '-') + '</span></div>';
                html += '<div style="text-align:right"><span style="font-size:28px;font-weight:900;color:' + barColor + '">' + avgPct + '%</span><br><span style="font-size:11px;color:#94A3B8;font-weight:700;text-transform:uppercase;">Promedio</span></div></div>';
                
                html += '<div style="background:#F1F5F9;border-radius:20px;height:10px;margin-bottom:20px;overflow:hidden"><div style="height:100%;width:' + avgPct + '%;background:' + barColor + ';border-radius:20px"></div></div>';
                
                html += '<table style="width:100%;border-collapse:collapse;font-size:14px">';
                html += '<tr style="border-bottom:2px solid #E2E8F0;background:#F8FAFC"><th style="padding:12px;color:#64748B;font-weight:800;width:40px;text-align:center;border-top-left-radius:12px;">#</th><th style="text-align:left;padding:12px;color:#64748B;font-weight:800">Estudiante</th><th style="padding:12px;color:#64748B;font-weight:800;text-align:center">Puntos</th><th style="padding:12px;color:#64748B;font-weight:800;text-align:center;border-top-right-radius:12px;">Precisión</th></tr>';
                
                for (var m = 0; m < results.length; m++) {
                    var r = results[m];
                    var pColor = r.porcentaje >= 70 ? '#22C55E' : r.porcentaje >= 40 ? '#F59E0B' : '#EF4444';
                    var studentName = window.adminReportsNameMap[ev.id + '_' + r.user_id] || (r.user_id ? r.user_id.substring(0, 8) + '...' : 'Anónimo');
                    
                    var rankIcon = (m + 1);
                    var rankStyle = 'color:#64748B;font-weight:800;';
                    if (m === 0) { rankIcon = '🥇'; rankStyle = 'font-size:18px;'; }
                    else if (m === 1) { rankIcon = '🥈'; rankStyle = 'font-size:18px;'; }
                    else if (m === 2) { rankIcon = '🥉'; rankStyle = 'font-size:18px;'; }
                    
                    html += '<tr onclick="openReportDetail(\'' + ev.id + '\', \'' + r.user_id + '\')" style="cursor:pointer;border-bottom:1px solid #F1F5F9;transition:background .2s" onmouseover="this.style.background=\'#F8FAFC\'" onmouseout="this.style.background=\'transparent\'">';
                    html += '<td style="padding:14px 12px;text-align:center;' + rankStyle + '">' + rankIcon + '</td>';
                    html += '<td style="padding:14px 12px;font-weight:700;color:#334155"><i class="fas fa-user-circle" style="color:#CBD5E1;margin-right:8px;font-size:18px;vertical-align:-2px;"></i>' + studentName + '</td>';
                    html += '<td style="padding:14px 12px;text-align:center;font-weight:800;color:#475569">' + (r.puntaje || 0).toLocaleString() + ' <span style="color:#94A3B8;font-size:12px;font-weight:600;">pts</span></td>';
                    html += '<td style="padding:14px 12px;text-align:center;font-weight:900;color:' + pColor + '"><div style="display:inline-block;padding:4px 10px;border-radius:12px;background:' + pColor + '15">' + r.porcentaje + '%</div></td>';
                    html += '</tr>';
                }
                html += '</table></div>';
            }
            container.innerHTML = html || '<div class="empty-state"><i class="fas fa-chart-line"></i><p>No hay resultados aún</p></div>';
        }).catch(function(err) {
            console.error(err);
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar informes</p></div>';
        });
    });
}

// ═══ STUDENT: MIS RESULTADOS ═══

function loadStudentResults() {
    var container = document.getElementById('results-list');
    if (!container || !currentUser) return;
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:24px"></i></div>';

    var client = getSupabase();
    client.from('evaluacion_resultados').select('*, evaluaciones(titulo, asignatura)').eq('user_id', currentUser.id).order('created_at', {ascending: false})
    .then(function(r) {
        if (r.error || !r.data || r.data.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-pie"></i><p>No tienes resultados todavía</p><small>Participa en evaluaciones para ver tu progreso aquí</small></div>';
            return;
        }
        
        try {
            var html = '';
            window.adminReportsData = {};
            window.adminReportsNameMap = {};
            
            for (var i = 0; i < r.data.length; i++) {
                var res = r.data[i];
                if (!res) continue;
                
                var evalId = res.evaluacion_id || 'unknown';
                var userId = currentUser.id || 'unknown';
                
                if (!window.adminReportsData[evalId]) window.adminReportsData[evalId] = [];
                window.adminReportsData[evalId].push(res);
                window.adminReportsNameMap[evalId + '_' + userId] = 'Tu resultado';

                var titulo = (res.evaluaciones && res.evaluaciones.titulo) ? res.evaluaciones.titulo : 'Evaluación';
                var asig = (res.evaluaciones && res.evaluaciones.asignatura) ? res.evaluaciones.asignatura : '';
                var pct = res.porcentaje || 0;
                var barColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#F59E0B' : '#EF4444';
                var emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 40 ? '📝' : '💪';
                
                var fechaStr = '';
                try {
                    fechaStr = res.created_at ? new Date(res.created_at).toLocaleDateString('es-ES', {day:'numeric',month:'short'}) : '';
                } catch(e) { fechaStr = ''; }

                var punt = res.puntaje !== undefined ? res.puntaje : 0;
                var tot = res.total !== undefined ? res.total : 0;
                
                var hits = 0;
                var studentAns = res.respuestas || [];
                if (studentAns && studentAns.length > 0) {
                    for (var sa = 0; sa < studentAns.length; sa++) {
                        if (studentAns[sa] && studentAns[sa].correcta) hits++;
                    }
                } else {
                    hits = Math.round((pct / 100) * tot);
                }

                html += '<div onclick="openReportDetail(\'' + evalId + '\', \'' + userId + '\')" style="cursor:pointer;background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:16px 20px;margin-bottom:12px;display:flex;align-items:center;gap:16px;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,0.02)" onmouseover="this.style.boxShadow=\'0 6px 20px rgba(0,0,0,0.08)\'; this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.boxShadow=\'0 2px 8px rgba(0,0,0,0.02)\'; this.style.transform=\'translateY(0)\'">';
                html += '<div style="font-size:32px">' + emoji + '</div>';
                html += '<div style="flex:1"><h4 style="font-size:15px;font-weight:800;color:#1E293B;margin-bottom:4px">' + titulo + '</h4>';
                html += '<span style="font-size:12px;color:#64748B;font-weight:600;"><i class="fas fa-book" style="margin-right:4px;"></i>' + asig + (fechaStr ? ' • ' + fechaStr : '') + '</span></div>';
                html += '<div style="text-align:right"><span style="font-size:22px;font-weight:900;color:' + barColor + '">' + pct + '%</span>';
                html += '<div style="font-size:11px;color:#94A3B8;font-weight:700;margin-top:2px;">' + hits + ' / ' + tot + ' correctas <span style="font-weight:500;opacity:0.85;">(' + punt + ' pts)</span></div></div></div>';
            }
            container.innerHTML = html || '<div class="empty-state"><i class="fas fa-chart-pie"></i><p>No tienes resultados todavía</p></div>';
        } catch(ex) {
            console.error(ex);
            container.innerHTML = '<div style="padding:20px;text-align:center;color:#EF4444;"><i class="fas fa-exclamation-triangle" style="font-size:24px;margin-bottom:8px"></i><br>Error al procesar resultados.</div>';
        }
    })
    .catch(function(err) {
        console.error('Error fetching student results:', err);
        container.innerHTML = '<div style="padding:20px;text-align:center;color:#EF4444;"><i class="fas fa-wifi" style="font-size:24px;margin-bottom:8px"></i><br>Error de conexión. Inténtalo de nuevo.</div>';
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

    initUserMenu();
});

/** Menú desplegable del usuario (cerrar sesión) */
function initUserMenu() {
    var wrap = document.getElementById('user-menu-wrap');
    var btn = document.getElementById('user-menu-btn');
    var menu = document.getElementById('user-menu-dropdown');
    var logoutItem = document.getElementById('user-menu-logout');
    if (!wrap || !btn || !menu) return;

    function setOpen(open) {
        if (open) {
            menu.classList.remove('hidden');
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        } else {
            menu.classList.add('hidden');
            wrap.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        }
    }

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var opening = menu.classList.contains('hidden');
        setOpen(opening);
    });

    document.addEventListener('click', function() {
        setOpen(false);
    });
    menu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') setOpen(false);
    });

    if (logoutItem) {
        logoutItem.addEventListener('click', function() {
            setOpen(false);
            handleLogout();
        });
    }
}

// ═══ PWA INSTALLATION ═══
var deferredPrompt;
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    var installBtn = document.getElementById('install-pwa-btn');
    if (installBtn) {
        installBtn.style.display = 'flex';
        installBtn.addEventListener('click', function() {
            installBtn.style.display = 'none';
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function(choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Usuario aceptó la instalación de la PWA');
                } else {
                    console.log('Usuario descartó la instalación de la PWA');
                }
                deferredPrompt = null;
            });
        });
    }
});

// ═══ DARK MODE TOGGLE ═══
function initTheme() {
    var theme = localStorage.getItem('alcocermed_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    
    var themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('alcocermed_theme', next);
            updateThemeIcon(next);
        });
    }
}
function updateThemeIcon(theme) {
    var icon = document.querySelector('#theme-toggle-btn i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}
document.addEventListener('DOMContentLoaded', initTheme);
