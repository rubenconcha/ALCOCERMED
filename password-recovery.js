(function () {
    'use strict';
    const el = id => document.getElementById(id);
    const params = new URLSearchParams(window.location.hash.slice(1));
    const isRecoveryLink = params.get('type') === 'recovery';
    const resetRequested = isRecoveryLink || new URLSearchParams(window.location.search).has('restablecer');
    let client;
    let recoverySession = false;
    let sending = false;
    let saving = false;

    function status(message, error) {
        el('recovery-status').textContent = message;
        el('recovery-status').dataset.error = String(Boolean(error));
    }
    function showReset() {
        recoverySession = true;
        el('recovery-request').hidden = true;
        el('recovery-reset').hidden = false;
        el('recovery-save').disabled = false;
        el('recovery-title').textContent = 'Crea tu nueva contraseña';
        el('recovery-description').textContent = 'Elige una contraseña de al menos 8 caracteres y repítela para confirmarla.';
        status('');
    }
    function expired() {
        recoverySession = false;
        el('recovery-reset').hidden = true;
        el('recovery-request').hidden = false;
        el('recovery-title').textContent = 'Solicita un enlace nuevo';
        el('recovery-description').textContent = 'Puedes volver a pedir un correo para recuperar tu contraseña.';
        status('El enlace no es válido o ya venció. Solicita otro e inténtalo de nuevo.', true);
    }
    function errorText(error) {
        if (error && (error.status === 429 || /rate|too many|seconds/i.test(error.message || ''))) {
            return 'Demasiados intentos. Espera unos minutos antes de volver a intentarlo.';
        }
        return 'No se pudo completar la solicitud. Revisa tu conexión y vuelve a intentarlo.';
    }

    el('recovery-request').addEventListener('submit', async function (event) {
        event.preventDefault();
        if (sending) return;
        const email = el('recovery-email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            status('Escribe un correo electrónico válido.', true);
            return;
        }
        if (!client) { status('No se pudo conectar. Recarga la página e inténtalo de nuevo.', true); return; }
        sending = true;
        el('recovery-send').disabled = true;
        el('recovery-send').textContent = 'Enviando…';
        status('');
        try {
            const redirectTo = new URL('/recuperar.html?restablecer=1', window.location.origin).href;
            const {error} = await client.auth.resetPasswordForEmail(email, {redirectTo});
            if (error) { status(errorText(error), true); return; }
            status('Si hay una cuenta asociada a ese correo, recibirás un enlace para cambiar tu contraseña. Revisa tu bandeja de entrada y spam.');
        } catch (error) { status(errorText(error), true); }
        finally {
            sending = false;
            el('recovery-send').disabled = false;
            el('recovery-send').textContent = 'Enviar enlace de recuperación';
        }
    });

    el('recovery-reset').addEventListener('submit', async function (event) {
        event.preventDefault();
        if (saving) return;
        if (!client || !recoverySession) { expired(); return; }
        const password = el('recovery-password').value;
        if (password.length < 8) { status('La contraseña debe tener al menos 8 caracteres.', true); return; }
        if (password !== el('recovery-confirm').value) { status('Las contraseñas no coinciden.', true); return; }
        saving = true;
        el('recovery-save').disabled = true;
        el('recovery-save').textContent = 'Guardando…';
        try {
            const {error} = await client.auth.updateUser({password});
            if (error) {
                if (error.status === 401 || error.status === 403 || /session|expired|token/i.test(error.message || '')) { expired(); return; }
                status(error.code === 'same_password' ? 'Elige una contraseña diferente de la anterior.' : error.code === 'weak_password' ? 'Elige una contraseña más segura: combina letras, números y símbolos.' : errorText(error), true);
                return;
            }
            recoverySession = false;
            el('recovery-reset').reset();
            el('recovery-reset').hidden = true;
            el('recovery-title').textContent = 'Contraseña actualizada';
            el('recovery-description').textContent = 'Ya puedes iniciar sesión con tu contraseña nueva.';
            status('Tu contraseña se guardó correctamente.');
            try { await client.auth.signOut({scope: 'local'}); } catch (_) { /* La contraseña ya se guardó. */ }
        } catch (error) { status(errorText(error), true); }
        finally {
            saving = false;
            el('recovery-save').disabled = !recoverySession;
            el('recovery-save').textContent = 'Guardar nueva contraseña';
        }
    });

    async function init() {
        if (resetRequested) {
            el('recovery-request').hidden = true;
            status('Verificando enlace…');
        }
        try {
            if (!window.supabase || !window.ALCOCER_CONFIG) throw new Error('SDK unavailable');
            const config = window.ALCOCER_CONFIG;
            client = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
            client.auth.onAuthStateChange(function (event, session) {
                if (event === 'PASSWORD_RECOVERY' && session && session.user) showReset();
            });
            const {data, error} = await client.auth.getSession();
            if (resetRequested || params.has('error')) {
                if (!error && !params.has('error') && data.session && (isRecoveryLink || recoverySession)) showReset();
                else expired();
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (_) {
            el('recovery-request').hidden = false;
            status('No se pudo verificar la conexión. Recarga la página e inténtalo de nuevo.', true);
        }
    }
    init();
}());
