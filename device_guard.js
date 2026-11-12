// ═══════════════════════════════════════════════════════
// DEVICE GUARD — Control de dispositivos AlcocerMed
// El servidor autoriza el navegador y valida su sesión.
// Compartido entre página principal y /juegos
// ═══════════════════════════════════════════════════════

var DeviceGuard = (function() {
    var STORAGE_KEY = 'alcocer_device_id';
    var RETURN_KEY = 'alcocer_device_change_return';
    var CHECK_INTERVAL = 10000; // Verificar cada 10 segundos
    var monitor = null;

    // Generar o recuperar ID único de este dispositivo
    function getDeviceId() {
        var id = localStorage.getItem(STORAGE_KEY);
        if (!id) {
            id = 'dev_' + (window.crypto && crypto.randomUUID
                ? crypto.randomUUID()
                : Date.now() + '_' + Math.random().toString(36).substr(2, 9));
            localStorage.setItem(STORAGE_KEY, id);
        }
        return id;
    }

    // Detectar nombre del dispositivo
    function getDeviceName() {
        var ua = navigator.userAgent || '';
        var browser = /Edg|EdgiOS|EdgA/i.test(ua) ? 'Edge' : /OPR|OPiOS/i.test(ua) ? 'Opera' : /Firefox|FxiOS/i.test(ua) ? 'Firefox' : /Chrome|CriOS/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : 'Navegador';
        if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
            if (/iPhone/i.test(ua)) return 'iPhone · ' + browser;
            if (/iPad/i.test(ua)) return 'iPad · ' + browser;
            if (/Android/i.test(ua)) return 'Android · ' + browser;
            return 'Móvil · ' + browser;
        }
        if (/Windows/i.test(ua)) return 'PC Windows · ' + browser;
        if (/Mac/i.test(ua)) return 'Mac · ' + browser;
        if (/Linux/i.test(ua)) return 'PC Linux · ' + browser;
        return 'Navegador · ' + browser;
    }

    function sessionClaims(session) {
        try {
            return JSON.parse(atob(session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        } catch (_) { return {}; }
    }

    function getSessionId(session) {
        return sessionClaims(session).session_id || null;
    }

    function hasEmailProof(session) {
        var amr = sessionClaims(session).amr;
        return Array.isArray(amr) && amr.some(function (method) { return method?.method === 'otp'; });
    }

    function deviceChangeReturn(value) {
        try {
            var target = new URL(value || sessionStorage.getItem(RETURN_KEY), location.origin);
            if (target.origin === location.origin &&
                (/^\/campus(?:\.html)?$/.test(target.pathname) || /^\/juegos(?:\/|$)/.test(target.pathname))) {
                return target.pathname + target.search;
            }
        } catch (_) {}
        return '/campus';
    }

    // Activar este dispositivo después del login
    function activateDevice(supabaseClient, userEmail, promptOnLimit = true) {
        var deviceId;
        try { deviceId = getDeviceId(); }
        catch (_) { return Promise.resolve({ ok: false, error: 'Permite el almacenamiento de este navegador para registrar tu dispositivo.' }); }
        var deviceName = getDeviceName();

        return supabaseClient.rpc('activate_device', {
            p_device_id: deviceId,
            p_device_name: deviceName
        }).then(function(result) {
            if (result.error) {
                console.error('activate_device RPC error:', result.error);
                return { ok: false, error: 'No pudimos verificar este navegador. Vuelve a intentarlo.' };
            }
            var data = result.data;
            if (!data || data.ok !== true) {
                var code = data?.code;
                if (code === 'DEVICE_LIMIT' && promptOnLimit) showDeviceLimit(userEmail, data.limit);
                return { ok: false, limit: data?.limit, code: code, error: code === 'DEVICE_LIMIT'
                    ? 'Confirma tu correo para usar este navegador.'
                    : code === 'NOT_AUTHENTICATED' ? 'Tu sesión venció. Vuelve a iniciar sesión.'
                    : 'No pudimos verificar este navegador. Vuelve a intentarlo.' };
            }
            return { ok: true, limit: data.limit, registered: data.registered, access: data.access };
        }).catch(function(err) {
            console.error('activate_device catch:', err);
            return { ok: false, error: 'Error de conexión al verificar dispositivo' };
        });
    }

    // Verificar que este dispositivo sigue activo
    async function checkStillActive() {
        var active = monitor;
        if (!active || active.pending || document.visibilityState === 'hidden') return;
        var deviceId;
        try { deviceId = getDeviceId(); }
        catch (_) {
            stopChecking();
            active.onKicked?.('Permite el almacenamiento de este navegador para continuar.');
            return;
        }
        active.pending = true;
        try {
            var result = await active.client.rpc('check_device_active', { p_device_id: deviceId });
            if (monitor !== active) return;
            if (result.error && result.status !== 401) {
                console.warn('check_device error:', result.error);
                return;
            }
            if (result.status !== 401 && result.data?.active !== false) return;
            // Una respuesta de una sesión anterior no debe cerrar la que acaba de entrar.
            if (active.sessionId) {
                var sessionResult = await active.client.auth.getSession();
                var session = sessionResult.data?.session;
                if (monitor !== active || (session && getSessionId(session) !== active.sessionId)) return;
            }
            stopChecking();
            active.onKicked?.(result.status === 401 || result.data?.reason === 'No autenticado'
                ? 'Tu sesión venció. Vuelve a iniciar sesión.'
                : 'Tu cuenta se abrió en otro navegador. Vuelve a iniciar sesión.');
        } catch (error) {
            console.warn('check_device catch:', error);
        } finally {
            active.pending = false;
        }
    }

    // Iniciar verificación periódica
    function startChecking(supabaseClient, onKickedCallback, sessionId) {
        stopChecking();
        monitor = { client: supabaseClient, onKicked: onKickedCallback, sessionId: sessionId,
            timer: setInterval(checkStillActive, CHECK_INTERVAL), pending: false };
        document.addEventListener('visibilitychange', checkStillActive);
        window.addEventListener('pageshow', checkStillActive);
        window.addEventListener('focus', checkStillActive);
    }

    // Detener verificación
    function stopChecking() {
        if (!monitor) return;
        clearInterval(monitor.timer);
        monitor = null;
        document.removeEventListener('visibilitychange', checkStillActive);
        window.removeEventListener('pageshow', checkStillActive);
        window.removeEventListener('focus', checkStillActive);
    }

    function showDeviceLimit(email, limit) {
        var previous = document.getElementById('device-limit-dialog');
        if (previous) previous.remove();
        var dialog = document.createElement('dialog');
        dialog.id = 'device-limit-dialog'; dialog.className = 'device-limit-dialog';
        dialog.setAttribute('aria-labelledby', 'device-limit-title');
        dialog.innerHTML = '<h2 id="device-limit-title">Ya tienes un dispositivo autorizado</h2><p>Confirma tu correo con un código de 6 dígitos para autorizar este navegador. Al confirmar, se cerrará el acceso del navegador que reemplaces.</p><button type="button" class="device-limit-send">Cambiar con código</button><button type="button" class="device-limit-cancel">Volver</button>';
        if (limit > 1) dialog.querySelector('h2').textContent = 'Alcanzaste el límite de dispositivos';
        var send = dialog.querySelector('.device-limit-send');
        dialog.querySelector('.device-limit-cancel').onclick = function () {
            if (typeof dialog.close === 'function') dialog.close();
            else dialog.remove();
        };
        send.onclick = function () {
            try {
                sessionStorage.setItem('alcocer_device_change_email', email || '');
                sessionStorage.setItem(RETURN_KEY, deviceChangeReturn(location.pathname + location.search));
            }
            catch (_) { /* The email can also be entered on the verification page. */ }
            location.assign('/dispositivos.html');
        };
        dialog.addEventListener('close', function () { dialog.remove(); });
        document.body.appendChild(dialog);
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
    }

    // API pública
    return {
        getDeviceId: getDeviceId,
        getDeviceName: getDeviceName,
        getSessionId: getSessionId,
        hasEmailProof: hasEmailProof,
        deviceChangeReturn: deviceChangeReturn,
        showDeviceLimit: showDeviceLimit,
        activateDevice: activateDevice,
        startChecking: startChecking,
        stopChecking: stopChecking
    };
})();
