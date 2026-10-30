// ═══════════════════════════════════════════════════════
// DEVICE GUARD — Control de dispositivos AlcocerMed
// Máximo 2 navegadores autorizados por estudiante.
// Compartido entre página principal y /juegos
// ═══════════════════════════════════════════════════════

var DeviceGuard = (function() {
    var STORAGE_KEY = 'alcocer_device_id';
    var CHECK_INTERVAL = 10000; // Verificar cada 10 segundos
    var _checkTimer = null;
    var _supabaseClient = null;
    var _onKicked = null;

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

    // Activar este dispositivo después del login
    function activateDevice(supabaseClient, userEmail) {
        _supabaseClient = supabaseClient;

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
                if (data && data.code === 'DEVICE_LIMIT') showDeviceLimit(supabaseClient, userEmail, data.limit);
                return { ok: false, error: data && data.code === 'DEVICE_LIMIT' ? 'Confirma tu correo para usar este navegador.' : 'No pudimos verificar este navegador. Vuelve a intentarlo.', code: data && data.code };
            }
            return { ok: true, limit: data && data.limit, registered: data && data.registered };
        }).catch(function(err) {
            console.error('activate_device catch:', err);
            return { ok: false, error: 'Error de conexión al verificar dispositivo' };
        });
    }

    // Verificar que este dispositivo sigue activo
    function checkStillActive() {
        if (!_supabaseClient) return;

        var deviceId;
        try { deviceId = getDeviceId(); }
        catch (_) {
            stopChecking();
            if (typeof _onKicked === 'function') _onKicked('Permite el almacenamiento de este navegador para continuar.');
            return;
        }

        _supabaseClient.rpc('check_device_active', {
            p_device_id: deviceId
        }).then(function(result) {
            if (result.error) {
                console.warn('check_device error:', result.error);
                return;
            }
            var data = result.data;
            if (data && data.active === false) {
                console.warn('Dispositivo desactivado:', data.reason);
                stopChecking();
                if (typeof _onKicked === 'function') {
                    _onKicked('Tu cuenta se abrió en otro navegador. Vuelve a iniciar sesión.');
                }
            }
        }).catch(function(err) {
            console.warn('check_device catch:', err);
        });
    }

    // Iniciar verificación periódica
    function startChecking(supabaseClient, onKickedCallback) {
        _supabaseClient = supabaseClient;
        _onKicked = onKickedCallback;
        stopChecking();
        _checkTimer = setInterval(checkStillActive, CHECK_INTERVAL);
    }

    // Detener verificación
    function stopChecking() {
        if (_checkTimer) {
            clearInterval(_checkTimer);
            _checkTimer = null;
        }
    }

    function showDeviceLimit(client, email, limit) {
        var previous = document.getElementById('device-limit-dialog');
        if (previous) previous.remove();
        var dialog = document.createElement('dialog');
        dialog.id = 'device-limit-dialog'; dialog.className = 'device-limit-dialog';
        dialog.setAttribute('aria-labelledby', 'device-limit-title');
        dialog.innerHTML = '<h2 id="device-limit-title">Ya usas tu cuenta en 2 dispositivos</h2><p>¿Cambiaste de celular o de navegador? Confirma tu correo con un código de 6 dígitos para reemplazar uno.</p><button type="button" class="device-limit-send">Cambiar con código</button><button type="button" class="device-limit-cancel">Volver</button><p class="device-limit-status" role="status" aria-live="polite"></p>';
        dialog.querySelector('h2').textContent = limit === 1 ? 'Tu cuenta permite un solo dispositivo' : 'Ya usas tu cuenta en 2 dispositivos';
        var send = dialog.querySelector('.device-limit-send');
        var message = dialog.querySelector('.device-limit-status');
        dialog.querySelector('.device-limit-cancel').onclick = function () { dialog.close(); };
        send.onclick = function () {
            try { sessionStorage.setItem('alcocer_device_change_email', email || ''); }
            catch (_) { /* The email can also be entered on the verification page. */ }
            location.assign('/dispositivos.html');
        };
        dialog.addEventListener('close', function () { dialog.remove(); });
        document.body.appendChild(dialog); dialog.showModal();
    }

    // API pública
    return {
        getDeviceId: getDeviceId,
        getDeviceName: getDeviceName,
        activateDevice: activateDevice,
        startChecking: startChecking,
        stopChecking: stopChecking
    };
})();
