// ═══════════════════════════════════════════════════════
// DEVICE GUARD — Control de dispositivos AlcocerMed
// Máximo 3 dispositivos registrados por estudiante, los 3 pueden estar activos.
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
        if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
            if (/iPhone/i.test(ua)) return 'iPhone';
            if (/iPad/i.test(ua)) return 'iPad';
            if (/Android/i.test(ua)) return 'Android';
            return 'Móvil';
        }
        if (/Windows/i.test(ua)) return 'PC Windows';
        if (/Mac/i.test(ua)) return 'Mac';
        if (/Linux/i.test(ua)) return 'PC Linux';
        return 'Navegador';
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
                return { ok: false, error: result.error.message || 'Error al activar dispositivo' };
            }
            var data = result.data;
            if (!data || data.ok !== true) {
                return { ok: false, error: data && data.error || 'No pudimos verificar este dispositivo.', code: data && data.code };
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
                    _onKicked(data.reason || 'Tu sesión se abrió en otro dispositivo');
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

    // API pública
    return {
        getDeviceId: getDeviceId,
        getDeviceName: getDeviceName,
        activateDevice: activateDevice,
        startChecking: startChecking,
        stopChecking: stopChecking
    };
})();
