// Acceso de la clase. Usa las evaluaciones y el motor de juegos existentes.
var nervousClassMode = new URLSearchParams(location.search).get('tema') === 'tejido-nervioso';
var nervousClassIds = ['71c3ac1c-7bda-5eaa-a449-d0b94ac33684', '243e1718-d7af-56bc-bf64-ea00346daa0d'];

function initNervousClass() {
    document.body.classList.add('nervous-class');
    // Sesión separada: no reemplaza la cuenta habitual de este navegador.
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { storageKey: 'alcocermed-tejido-nervioso-2026' }
    });
    var card = document.querySelector('#login-screen .login-card');
    card.querySelectorAll('form,.login-mode-tabs').forEach(function(el) { el.hidden = true; el.style.display = 'none'; });
    var form = document.createElement('form');
    form.className = 'login-form';
    form.innerHTML = '<h1 style="font-size:1.5rem">Sistema nervioso</h1>' +
        '<div class="login-field"><label class="login-label" for="class-name">Nombre y apellidos</label>' +
        '<input id="class-name" class="login-input" autocomplete="name" minlength="3" maxlength="100" required></div>' +
        '<p>Tu nombre aparecerá junto a tu resultado. Usa el mismo dispositivo para continuar.</p>' +
        '<p id="class-error" role="alert"></p>' +
        '<button class="login-btn" type="submit">Jugar</button>';
    card.appendChild(form);
    form.addEventListener('submit', enterNervousClassByName);
    var section = document.createElement('section');
    section.id = 'page-nervioso'; section.className = 'page';
    section.innerHTML = '<h1 class="page-title">Tejido nervioso</h1><p id="class-greeting" class="page-subtitle"></p>' +
        '<p>Completa la primera ronda y después continúa con la segunda.</p>' +
        '<div class="class-rounds"><button class="class-round" data-round="0">Ronda 1 <small>Organización y neuronas · 15 preguntas</small></button>' +
        '<button class="class-round" data-round="1">Ronda 2 <small>Neuroglía y mielina · 15 preguntas</small></button></div>' +
        '<button id="class-change-name" class="class-round">Entrar con otro nombre</button>';
    document.getElementById('page-quiz').parentNode.appendChild(section);
    section.querySelectorAll('[data-round]').forEach(function(button) {
        button.onclick = function() { startSelfStudy(nervousClassIds[Number(button.dataset.round)]); };
    });
    document.getElementById('class-change-name').onclick = async function() {
        await sb.auth.signOut();
        clearSelfSession();
        sessionStorage.removeItem('alcocer_nervioso_owner');
        currentUser = null; showLogin();
        document.getElementById('class-name').focus();
    };
    sb.auth.getSession().then(function(result) {
        var user = result.data && result.data.session && result.data.session.user;
        if (user && user.user_metadata && user.user_metadata.class_topic === 'tejido-nervioso') {
            currentUser = user; enterApp();
        }
    }).catch(function() { showLogin(); });
}

async function enterNervousClassByName(event) {
    event.preventDefault();
    var name = document.getElementById('class-name').value.trim().replace(/\s+/g, ' ');
    var error = document.getElementById('class-error');
    var button = event.currentTarget.querySelector('button');
    error.textContent = '';
    if (name.length < 3 || name.length > 100) { error.textContent = 'Escribe tu nombre y apellidos (3 a 100 caracteres).'; return; }
    button.disabled = true; button.textContent = 'Preparando tu entrada…';
    try {
        var ready = await sb.from('evaluaciones').select('id').in('id', nervousClassIds).eq('publicado', true);
        if (ready.error || !ready.data || ready.data.length !== 2) {
            throw new Error('El profesor todavía está habilitando las dos rondas. Intenta nuevamente en unos minutos.');
        }
        var bytes = crypto.getRandomValues(new Uint8Array(32));
        var secret = Array.from(bytes, function(b) { return b.toString(16).padStart(2, '0'); }).join('');
        var result = await sb.auth.signUp({
            email: 'neuro.' + crypto.randomUUID() + '@' + DEMO_EVENT.emailDomain,
            password: secret,
            options: { data: { full_name: name, demo_guest: true, class_topic: 'tejido-nervioso' } }
        });
        if (result.error) throw new Error('No se pudo crear tu entrada. Espera un momento e inténtalo otra vez.');
        if (!result.data || !result.data.session) throw new Error('No se pudo iniciar la sesión. Avísale al profesor.');
        currentUser = result.data.user; enterApp();
    } catch (err) {
        error.textContent = err.message || 'No hay conexión. Intenta nuevamente.';
    } finally { button.disabled = false; button.textContent = 'Jugar'; }
}

function showNervousClass() {
    isAdmin = false;
    if (sessionStorage.getItem('alcocer_nervioso_owner') !== currentUser.id) {
        clearSelfSession();
        sessionStorage.setItem('alcocer_nervioso_owner', currentUser.id);
    }
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');
    var name = currentUser.user_metadata.full_name || 'Estudiante';
    document.getElementById('topbar-username').textContent = name;
    document.getElementById('class-greeting').textContent = '¡Hola, ' + name + '!';
    var pending = sessionStorage.getItem('alcocer_quiz_code');
    var evalId = sessionStorage.getItem('alcocer_self_evalid');
    if (pending && pending.indexOf('SELF') === 0 && nervousClassIds.indexOf(evalId) !== -1) {
        restoreSelfStudy(evalId, pending);
    } else { navigateTo('nervioso', true); }
}
