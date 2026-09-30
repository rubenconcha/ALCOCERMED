// Ventana única de clase: 30/09/2026 hasta 01/10/2026 06:00 America/La_Paz.
var NIGHT_CLASS_END = '2026-10-01T10:00:00.000Z';
var nightAccountMode = false;
function isNightClassOpen(now) {
    var time = now === undefined ? Date.now() : now;
    return time >= Date.parse('2026-09-30T04:00:00Z') && time < Date.parse(NIGHT_CLASS_END);
}
function isNightClassUser(user) {
    return !!(user && user.user_metadata && user.user_metadata.class_night === '2026-09-30');
}
function configureNightLogin() {
    if (typeof nervousClassMode !== 'undefined' && nervousClassMode) return;
    var nameMode = isNightClassOpen() && !nightAccountMode;
    var email = document.getElementById('login-email');
    var password = document.getElementById('login-password');
    var label = document.querySelector('label[for="login-email"]');
    email.type = nameMode ? 'text' : 'email';
    email.autocomplete = nameMode ? 'name' : 'username';
    email.inputMode = nameMode ? 'text' : 'email';
    email.maxLength = nameMode ? 100 : 254;
    email.minLength = nameMode ? 3 : 1;
    email.placeholder = nameMode ? 'Nombre y apellidos' : '';
    label.innerHTML = '<i class="fas fa-user-astronaut"></i> ' + (nameMode ? 'nombre y apellidos' : 'usuario');
    password.required = !nameMode;
    password.closest('.login-field').hidden = nameMode;
    password.closest('.login-field').style.display = nameMode ? 'none' : '';
    document.getElementById('night-login-note').hidden = !nameMode;
    var toggle = document.getElementById('night-login-toggle');
    toggle.hidden = !isNightClassOpen();
    toggle.textContent = nameMode ? 'Entrar con mi cuenta / Profesor' : 'Entrar solo con mi nombre';
}
function toggleNightLogin() {
    nightAccountMode = !nightAccountMode;
    document.getElementById('login-email').value = '';
    configureNightLogin();
    hideLoginError();
}
async function enterNightClass(event) {
    event.preventDefault();
    if (!isNightClassOpen()) { configureNightLogin(); showLoginError('El acceso por nombre terminó. Usa tu cuenta habitual.'); return; }
    var name = document.getElementById('login-email').value.trim().replace(/\s+/g, ' ');
    if (name.length < 3 || name.length > 100) { showLoginError('Escribe tu nombre y apellidos (3 a 100 caracteres).'); return; }
    var button = document.getElementById('login-btn');
    button.disabled = true;
    hideLoginError();
    document.getElementById('login-btn-text').classList.add('hidden');
    document.getElementById('login-btn-loading').classList.remove('hidden');
    try {
        var client = getSupabase();
        // Reutiliza el alta automática de invitados ya habilitada en esta plataforma.
        // El estudiante no proporciona correo, contraseña ni necesita alta manual.
        var secret = Array.from(crypto.getRandomValues(new Uint8Array(32)), function(b) { return b.toString(16).padStart(2,'0'); }).join('');
        clearSelfSession();
        var result = await client.auth.signUp({
            email: 'clase.' + crypto.randomUUID() + '@' + DEMO_EVENT.emailDomain,
            password: secret,
            options: {data: {full_name:name, demo_guest:true, class_night:'2026-09-30', demo_expires_at:NIGHT_CLASS_END}}
        });
        if (result.error || !result.data || !result.data.session) throw new Error('No se pudo abrir tu entrada. Espera un momento e inténtalo nuevamente.');
        currentUser = result.data.user;
        enterApp();
    } catch (error) { showLoginError(error.message || 'No hay conexión. Intenta nuevamente.'); }
    finally {
        button.disabled = false;
        document.getElementById('login-btn-text').classList.remove('hidden');
        document.getElementById('login-btn-loading').classList.add('hidden');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    configureNightLogin();
    setInterval(function() {
        if (isNightClassOpen()) return;
        if (isNightClassUser(currentUser)) {
            clearSelfSession();
            handleLogout();
        }
        configureNightLogin();
    }, 15000);
});
