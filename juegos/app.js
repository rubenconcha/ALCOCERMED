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
        var defaultPage = urlParams.get('page') || 'inicio';
        navigateTo(defaultPage);
        if (defaultPage !== 'inicio') {
            window.history.replaceState({}, document.title, window.location.pathname);
        }
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
                var nombreReal = currentUser.user_metadata && currentUser.user_metadata.full_name
                    ? currentUser.user_metadata.full_name
                    : (currentUser.email || '').split('@')[0];
                var nombreConAvatar = currentAvatar + '|' + nombreReal;
                
                client.from('evaluacion_participantes').upsert({
                    evaluacion_id: evaluacion.id,
                    user_id: currentUser.id,
                    nombre: nombreConAvatar,
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
var gameMusic = null;

// ═══ GAME MUSIC — Lo-fi chill beats ═══
function startGameMusic() {
    try {
        if (gameMusic && gameMusic._ctx) {
            if (gameMusic._ctx.state === 'suspended') gameMusic._ctx.resume();
            gameMusic._playing = true;
            return;
        }
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var master = ctx.createGain();
        master.gain.value = 0.15;
        master.connect(ctx.destination);

        var bpm = 75;
        var beat = 60 / bpm;
        var loopBars = 4;
        var loopLen = loopBars * 4 * beat;
        var playing = true;

        // Lo-fi chord progressions (Cmaj7 → Am7 → Fmaj7 → G7)
        var chords = [
            [261.63, 329.63, 392.00, 493.88],
            [220.00, 261.63, 329.63, 392.00],
            [174.61, 220.00, 261.63, 329.63],
            [196.00, 246.94, 293.66, 349.23]
        ];
        // Melody notes (C pentatonic higher octave)
        var melNotes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

        function playLofiLoop(t0) {
            // === Chord pads (warm sine) ===
            for (var c = 0; c < 4; c++) {
                var chord = chords[c];
                var cStart = t0 + c * 4 * beat;
                for (var n = 0; n < chord.length; n++) {
                    var o = ctx.createOscillator();
                    var g = ctx.createGain();
                    var f = ctx.createBiquadFilter();
                    o.type = 'sine';
                    o.frequency.value = chord[n];
                    f.type = 'lowpass';
                    f.frequency.value = 600 + Math.random() * 200;
                    g.gain.setValueAtTime(0, cStart);
                    g.gain.linearRampToValueAtTime(0.06, cStart + 0.3);
                    g.gain.setValueAtTime(0.06, cStart + 3.5 * beat);
                    g.gain.linearRampToValueAtTime(0, cStart + 4 * beat);
                    o.connect(f); f.connect(g); g.connect(master);
                    o.start(cStart); o.stop(cStart + 4 * beat + 0.1);
                }
            }

            // === Soft kick (2 & 4 feel) ===
            for (var k = 0; k < loopBars * 4; k++) {
                if (k % 4 === 0 || k % 4 === 2) {
                    var ko = ctx.createOscillator();
                    var kg = ctx.createGain();
                    ko.type = 'sine';
                    var kt = t0 + k * beat;
                    ko.frequency.setValueAtTime(80, kt);
                    ko.frequency.exponentialRampToValueAtTime(30, kt + 0.12);
                    kg.gain.setValueAtTime(0.35, kt);
                    kg.gain.exponentialRampToValueAtTime(0.001, kt + 0.2);
                    ko.connect(kg); kg.connect(master);
                    ko.start(kt); ko.stop(kt + 0.25);
                }
            }

            // === Snare on 2 and 4 (noise burst) ===
            for (var sn = 0; sn < loopBars * 4; sn++) {
                if (sn % 4 === 2) {
                    var snBuf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
                    var snD = snBuf.getChannelData(0);
                    for (var si = 0; si < snD.length; si++) snD[si] = (Math.random() * 2 - 1) * 0.2;
                    var snSrc = ctx.createBufferSource();
                    snSrc.buffer = snBuf;
                    var snG = ctx.createGain();
                    var snF = ctx.createBiquadFilter();
                    snF.type = 'bandpass'; snF.frequency.value = 3000; snF.Q.value = 1;
                    var snT = t0 + sn * beat;
                    snG.gain.setValueAtTime(0.18, snT);
                    snG.gain.exponentialRampToValueAtTime(0.001, snT + 0.1);
                    snSrc.connect(snF); snF.connect(snG); snG.connect(master);
                    snSrc.start(snT); snSrc.stop(snT + 0.12);
                }
            }

            // === Hi-hat shuffle ===
            for (var hh = 0; hh < loopBars * 8; hh++) {
                var hhBuf = ctx.createBuffer(1, ctx.sampleRate * 0.02, ctx.sampleRate);
                var hhD = hhBuf.getChannelData(0);
                for (var hi = 0; hi < hhD.length; hi++) hhD[hi] = (Math.random() * 2 - 1) * 0.15;
                var hhSrc = ctx.createBufferSource();
                hhSrc.buffer = hhBuf;
                var hhG = ctx.createGain();
                var hhFi = ctx.createBiquadFilter();
                hhFi.type = 'highpass'; hhFi.frequency.value = 9000;
                var hhT = t0 + hh * (beat / 2);
                var hhVol = (hh % 2 === 0) ? 0.08 : 0.04;
                hhG.gain.setValueAtTime(hhVol, hhT);
                hhG.gain.exponentialRampToValueAtTime(0.001, hhT + 0.03);
                hhSrc.connect(hhFi); hhFi.connect(hhG); hhG.connect(master);
                hhSrc.start(hhT); hhSrc.stop(hhT + 0.04);
            }

            // === Bass line (sub + warm) ===
            var bassRoots = [130.81, 110.00, 87.31, 98.00];
            for (var bl = 0; bl < 4; bl++) {
                var bo = ctx.createOscillator();
                var bg = ctx.createGain();
                var bf = ctx.createBiquadFilter();
                bo.type = 'triangle';
                bo.frequency.value = bassRoots[bl];
                bf.type = 'lowpass'; bf.frequency.value = 250;
                var bT = t0 + bl * 4 * beat;
                bg.gain.setValueAtTime(0, bT);
                bg.gain.linearRampToValueAtTime(0.22, bT + 0.05);
                bg.gain.setValueAtTime(0.22, bT + 3 * beat);
                bg.gain.exponentialRampToValueAtTime(0.001, bT + 3.8 * beat);
                bo.connect(bf); bf.connect(bg); bg.connect(master);
                bo.start(bT); bo.stop(bT + 4 * beat);
            }

            // === Melody (random pentatonic, sparse) ===
            for (var ml = 0; ml < 8; ml++) {
                if (Math.random() > 0.5) continue;
                var mNote = melNotes[Math.floor(Math.random() * melNotes.length)];
                var mo = ctx.createOscillator();
                var mg = ctx.createGain();
                var mf = ctx.createBiquadFilter();
                mo.type = 'sine';
                mo.frequency.value = mNote;
                mf.type = 'lowpass'; mf.frequency.value = 900 + Math.random() * 400;
                var mT = t0 + ml * 2 * beat + Math.random() * beat * 0.3;
                mg.gain.setValueAtTime(0, mT);
                mg.gain.linearRampToValueAtTime(0.07, mT + 0.04);
                mg.gain.exponentialRampToValueAtTime(0.001, mT + beat * 1.5);
                mo.connect(mf); mf.connect(mg); mg.connect(master);
                mo.start(mT); mo.stop(mT + beat * 2);
            }

            // === Vinyl crackle (ambient noise) ===
            var crklBuf = ctx.createBuffer(1, ctx.sampleRate * loopLen, ctx.sampleRate);
            var crklD = crklBuf.getChannelData(0);
            for (var ci = 0; ci < crklD.length; ci++) {
                crklD[ci] = Math.random() > 0.997 ? (Math.random() * 0.06 - 0.03) : 0;
            }
            var crklSrc = ctx.createBufferSource();
            crklSrc.buffer = crklBuf;
            var crklG = ctx.createGain();
            crklG.gain.value = 0.5;
            var crklF = ctx.createBiquadFilter();
            crklF.type = 'bandpass'; crklF.frequency.value = 4000; crklF.Q.value = 0.5;
            crklSrc.connect(crklF); crklF.connect(crklG); crklG.connect(master);
            crklSrc.start(t0); crklSrc.stop(t0 + loopLen);
        }

        function scheduleLoop() {
            if (!playing) return;
            playLofiLoop(ctx.currentTime + 0.1);
            setTimeout(scheduleLoop, loopLen * 1000 - 200);
        }
        scheduleLoop();

        gameMusic = {
            _ctx: ctx, _playing: true, _master: master,
            pause: function() { playing = false; this._playing = false; ctx.suspend(); },
            play: function() { playing = true; this._playing = true; ctx.resume(); scheduleLoop(); return Promise.resolve(); },
            stop: function() { playing = false; this._playing = false; ctx.close().catch(function(){}); },
            get paused() { return !this._playing; }
        };
    } catch (e) { console.log('Music error:', e); }
}

function stopGameMusic() {
    if (gameMusic) { gameMusic.stop(); gameMusic = null; }
}

function showWaitingRoom() {
    var wt = document.getElementById('quiz-waiting');
    if (wt) wt.style.display = 'flex';
    document.getElementById('quiz-container').style.display = 'none';

    var title = quizData.evaluacion.titulo || 'Evaluación';
    var wtTitle = document.getElementById('waiting-title');
    if (wtTitle) wtTitle.textContent = 'Esperando al profesor...';
    var wtSub = document.getElementById('waiting-subtitle');
    if (wtSub) wtSub.textContent = '"' + title + '" comenzará cuando el profesor presione EMPEZAR';

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

function showFeedbackAnimation(isCorrect) {
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '50%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translate(-50%, -50%) scale(0.5)';
    overlay.style.zIndex = '9999';
    overlay.style.background = isCorrect ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)';
    overlay.style.color = '#fff';
    overlay.style.padding = '20px 40px';
    overlay.style.borderRadius = '20px';
    overlay.style.fontSize = '2rem';
    overlay.style.fontWeight = '900';
    overlay.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';
    overlay.style.opacity = '0';
    overlay.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    overlay.innerHTML = isCorrect ? '🌟 ¡Correcto! 🎉' : '❌ Incorrecto';
    
    document.body.appendChild(overlay);
    
    if (isCorrect) playSuccessSound();
    else playErrorSound();
    
    // Animar
    setTimeout(function() {
        overlay.style.opacity = '1';
        overlay.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Desaparecer
    setTimeout(function() {
        overlay.style.opacity = '0';
        overlay.style.transform = 'translate(-50%, -50%) scale(1.2)';
        setTimeout(function() { if(overlay.parentNode) document.body.removeChild(overlay); }, 300);
    }, 1500);
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
    var timerEl = document.getElementById('quiz-timer-text');
    if (timerEl) timerEl.textContent = quizTimeLeft;

    quizTimerInterval = setInterval(function() {
        if (quizConfirmed) return; // Si ya confirmó, no hacer beeps
        
        quizTimeLeft--;
        if (timerEl) timerEl.textContent = quizTimeLeft;
        if (timerEl) timerEl.style.color = quizTimeLeft <= 5 ? '#EF4444' : '#E91E63';
        
        // Faltando 10 segundos: sonido de apuro (Mario)
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
                } else {
                    var hurryAudio = new Audio('./hurry_up.mp3');
                    hurryAudio.volume = 0.7;
                    hurryAudio.play().catch(function(e){});
                }
            } catch(e) {}
        }
        
        // Faltando 3 segundos: cuenta regresiva
        if (quizTimeLeft <= 3 && quizTimeLeft > 0) {
            playBeep(880, 'sine', 0.15);
        }

        if (quizTimeLeft <= 0) {
            clearInterval(quizTimerInterval);
            playBeep(440, 'square', 0.6); // Sonido final de tiempo
            if (!quizConfirmed) {
                // Si seleccionó algo pero no confirmó, auto-confirmar
                if (quizSelectedOption !== -1) {
                    confirmQuizAnswer();
                } else {
                    // No seleccionó nada
                    quizConfirmed = true;
                    quizAnswers.push({ pregunta_id: quizData.preguntas[quizCurrentQ].id, seleccionada: -1, correcta: false });
                    
                    showFeedbackAnimation(false);
                    
                    var nextBtn = document.getElementById('quiz-next-btn');
                    nextBtn.style.display = 'block';
                    nextBtn.textContent = quizCurrentQ >= quizData.preguntas.length - 1 ? '🏆 Ver resultados' : 'Siguiente →';
                }
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
    // Normal MC / TF / Poll — con botón confirmar para poder cambiar respuesta
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
        html += '<button id="quiz-confirm-answer" onclick="confirmQuizAnswer()" ' +
            'style="display:none;margin-top:12px;padding:14px 24px;background:linear-gradient(135deg,#2563EB,#1E40AF);' +
            'color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;width:100%;font-size:1rem;' +
            'transition:transform .15s;box-shadow:0 4px 16px rgba(37,99,235,.3)">' +
            '✓ Confirmar respuesta</button>';
    }

    document.getElementById('quiz-options-list').innerHTML = html;
    document.getElementById('quiz-next-btn').style.display = 'none';
    quizSelectedOption = -1;
    quizConfirmed = false;

    startQuestionTimer(timer);
}

var quizConfirmed = false;

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
    quizConfirmed = true;
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
    
    showFeedbackAnimation(allCorrect);
    
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
    quizConfirmed = true;
    ta.style.border = '2px solid #22C55E';
    ta.disabled = true;
    var pregunta = quizData.preguntas[quizCurrentQ];
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: answer, correcta: true });
    
    showFeedbackAnimation(true);
    
    var nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = quizCurrentQ >= quizData.preguntas.length - 1 ? '🏆 Ver resultados' : 'Siguiente →';
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
    
    showFeedbackAnimation(isCorrectAnswer);

    var nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = quizCurrentQ >= quizData.preguntas.length - 1 ? '🏆 Ver resultados' : 'Siguiente →';
}
window.confirmQuizAnswer = confirmQuizAnswer;

function quizNext() {
    quizCurrentQ++;
    if (quizCurrentQ >= quizData.preguntas.length) { showQuizResults(); }
    else { renderQuizQuestion(); }
}
window.quizNext = quizNext;

function showQuizResults() {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    stopGameMusic(); // Parar música al terminar
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

    var medals = ['🥇', '🥈', '🥉'];
    var colors = ['#FFD700', '#E2E8F0', '#F1A560']; // Oro, Plata, Bronce
    var textColors = ['#9A7B00', '#475569', '#8C511B'];
    var heights = [160, 120, 90];
    var bgGradients = [
        'linear-gradient(180deg, rgba(255,215,0,0.85) 0%, rgba(218,165,32,0.3) 100%)',
        'linear-gradient(180deg, rgba(226,232,240,0.85) 0%, rgba(148,163,184,0.3) 100%)',
        'linear-gradient(180deg, rgba(241,165,96,0.85) 0%, rgba(184,105,40,0.3) 100%)'
    ];

    // Podium pillars (order: 2nd, 1st, 3rd)
    var pillarOrder = [1, 0, 2];
    var pillarsHtml = '';

    for (var p = 0; p < 3; p++) {
        var idx = pillarOrder[p];
        if (idx >= entries.length) {
            pillarsHtml += '<div style="flex:1;max-width:140px"></div>';
            continue;
        }
        var e = entries[idx];
        var h = heights[idx];
        var delay = (p===1) ? 0.6 : (p===0 ? 0.3 : 0.9); // Orden de aparición: 2do, 1ro, 3ro

        pillarsHtml += '<div style="flex:1;max-width:140px;display:flex;flex-direction:column;align-items:center;animation:fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ' + delay + 's both">';
        
        // Avatar
        pillarsHtml += '<div style="width:60px;height:60px;border-radius:50%;background:' + colors[idx] + ';display:flex;align-items:center;justify-content:center;font-weight:900;font-size:32px;margin-bottom:12px;box-shadow:0 0 24px ' + colors[idx] + '80;border:3px solid #fff;position:relative;z-index:2">' + e.avatar + '</div>';
        
        // Name
        pillarsHtml += '<span style="font-size:14px;font-weight:800;color:#fff;margin-bottom:4px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;text-align:center;text-shadow:0 2px 4px rgba(0,0,0,0.5)">' + e.nombre + '</span>';
        
        // Score
        pillarsHtml += '<span style="font-size:12px;color:rgba(255,255,255,.9);margin-bottom:12px;font-weight:600;background:rgba(0,0,0,0.3);padding:2px 8px;border-radius:10px">' + e.puntaje + '/' + e.total + ' (' + e.porcentaje + '%)</span>';
        
        // Pillar (Glassmorphism + 3D feel)
        pillarsHtml += '<div style="width:100%;height:' + h + 'px;background:' + bgGradients[idx] + ';border-radius:16px 16px 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:16px;box-shadow:inset 0 2px 0 rgba(255,255,255,0.4), 0 -4px 30px rgba(0,0,0,.3);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,0.5);position:relative;overflow:hidden">';
        
        // Medal icon inside pillar
        pillarsHtml += '<div style="background:rgba(0,0,0,0.2);padding:6px 14px;border-radius:20px;font-size:24px;box-shadow:inset 0 2px 4px rgba(0,0,0,0.3);color:#fff">' + medals[idx] + '</div>';
        
        // Glow effect at bottom of pillar
        pillarsHtml += '<div style="position:absolute;bottom:0;left:0;right:0;height:50px;background:linear-gradient(0deg, ' + colors[idx] + '50, transparent)"></div>';
        
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
                (ev.publicado ? '<button onclick="window.location.href=\'editor.html?id=' + ev.id + '&results=true\'" style="padding:8px 14px;background:#8B5CF6;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;margin-left:4px" title="Resultados en vivo"><i class="fas fa-trophy"></i> Resultados</button>' : '') +
                (ev.publicado ? '<button onclick="showCustomAlert(\'Código: ' + (ev.codigo||'') + '\')" style="padding:8px 14px;background:#2563EB;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;margin-left:4px"><i class="fas fa-play"></i> Código</button>' : '') +
                '<button onclick="deleteQuiz(\'' + ev.id + '\')" style="padding:8px 14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;color:#DC2626;margin-left:4px" title="Borrar"><i class="fas fa-trash-alt"></i></button>' +
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
        var evalIds = evRes.data.map(function(e) { return e.id; });
        
        // Fetch results AND participants in parallel to get names
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
            
            // Create a lookup for participant names: { "evalId_userId": "Nombre" }
            var nameMap = {};
            if (!pRes.error && pRes.data) {
                for (var n = 0; n < pRes.data.length; n++) {
                    var p = pRes.data[n];
                    if (p.evaluacion_id && p.user_id) {
                        nameMap[p.evaluacion_id + '_' + p.user_id] = p.nombre;
                    }
                }
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
                
                // Sort results by porcentaje descending (Ranking)
                results.sort(function(a, b) {
                    if (b.porcentaje !== a.porcentaje) return b.porcentaje - a.porcentaje;
                    return b.puntaje - a.puntaje; // Tie breaker
                });
                
                var avgPct = 0;
                for (var k = 0; k < results.length; k++) avgPct += (results[k].porcentaje || 0);
                avgPct = Math.round(avgPct / results.length);
                var barColor = avgPct >= 70 ? '#22C55E' : avgPct >= 40 ? '#F59E0B' : '#EF4444';

                html += '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:20px;margin-bottom:16px">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">';
                html += '<div><h3 style="font-size:16px;font-weight:700">' + (ev.titulo || 'Sin título') + '</h3>';
                html += '<span style="font-size:12px;color:#64748B">' + results.length + ' participante(s) • Código: ' + (ev.codigo || '-') + '</span></div>';
                html += '<div style="text-align:right"><span style="font-size:24px;font-weight:800;color:' + barColor + '">' + avgPct + '%</span><br><span style="font-size:11px;color:#8E90A6">Promedio General</span></div></div>';
                
                // Progress bar (Average)
                html += '<div style="background:#E2E8F0;border-radius:20px;height:8px;margin-bottom:16px;overflow:hidden"><div style="height:100%;width:' + avgPct + '%;background:' + barColor + ';border-radius:20px"></div></div>';
                
                // Results Ranking table
                html += '<table style="width:100%;border-collapse:collapse;font-size:13px">';
                html += '<tr style="border-bottom:2px solid #E2E8F0;background:#F8FAFC"><th style="padding:10px 8px;color:#64748B;font-weight:700;width:40px;text-align:center">#</th><th style="text-align:left;padding:10px 8px;color:#64748B;font-weight:700">Estudiante</th><th style="padding:10px 8px;color:#64748B;font-weight:700;text-align:center">Respuestas Correctas</th><th style="padding:10px 8px;color:#64748B;font-weight:700;text-align:center">Precisión</th></tr>';
                
                for (var m = 0; m < results.length; m++) {
                    var r = results[m];
                    var pColor = r.porcentaje >= 70 ? '#22C55E' : r.porcentaje >= 40 ? '#F59E0B' : '#EF4444';
                    var studentName = nameMap[r.evaluacion_id + '_' + r.user_id] || (r.user_id ? r.user_id.substring(0, 8) + '...' : 'Anónimo');
                    
                    var rankIcon = (m + 1);
                    var rankStyle = 'color:#64748B;font-weight:700;';
                    if (m === 0) { rankIcon = '🥇'; rankStyle = 'font-size:16px;'; }
                    else if (m === 1) { rankIcon = '🥈'; rankStyle = 'font-size:16px;'; }
                    else if (m === 2) { rankIcon = '🥉'; rankStyle = 'font-size:16px;'; }
                    
                    html += '<tr style="border-bottom:1px solid #F1F5F9; transition: background .15s" onmouseover="this.style.background=\'#F8FAFC\'" onmouseout="this.style.background=\'transparent\'">';
                    html += '<td style="padding:12px 8px;text-align:center;' + rankStyle + '">' + rankIcon + '</td>';
                    html += '<td style="padding:12px 8px;font-weight:600;color:#334155"><i class="fas fa-user-circle" style="color:#94A3B8;margin-right:8px;font-size:15px"></i>' + studentName + '</td>';
                    html += '<td style="padding:12px 8px;text-align:center;font-weight:700;color:#475569">' + r.puntaje + ' / ' + r.total + '</td>';
                    html += '<td style="padding:12px 8px;text-align:center;font-weight:800;color:' + pColor + '"><div style="display:inline-block;padding:2px 8px;border-radius:12px;background:' + pColor + '15">' + r.porcentaje + '%</div></td>';
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
