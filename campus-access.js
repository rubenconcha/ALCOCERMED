/* Server-authoritative campus entitlements. No paid state is read from user metadata. */
window.CampusAccess = (() => {
    let state = { premium: false, ready: false };
    let catalogPromise;
    function isPremium(access) {
        return access?.ready === true && access.premium === true && !access.trial &&
            (access.admin === true || !access.expires_at || Date.parse(access.expires_at) > Date.now());
    }
    /* A registered account without a paid pass may still open Inicio until it is activated. */
    function isRegisteredAccess(access) {
        return access?.ready === true || access?.code === 'PREMIUM_REQUIRED';
    }
    const isFree = () => !isPremium(state);
    const isRegistered = () => isRegisteredAccess(state);
    const canUseAtlas = () => !isFree() && state.atlas === true;
    const canUseVideos = () => !isFree();
    function updateAtlasLinks() {
        document.querySelectorAll('[data-atlas-access]').forEach(el => { el.hidden = !canUseAtlas(); });
    }
    function permits(screen) {
        if (!isRegisteredAccess(state)) return false;
        if (isFree()) return screen === 'home-screen';
        if (screen === 'atlas-screen') return canUseAtlas();
        if (screen === 'videoclases-screen') return canUseVideos();
        return true;
    }
    function unlock() {
        const dialog = document.getElementById('campus-unlock');
        if (!dialog) return;
        if (!dialog.open) dialog.showModal();
    }
    async function check(client) {
        const { data, error } = await client.rpc('campus_access');
        if (error) throw new Error('No pudimos verificar tu acceso. Intenta de nuevo.');
        return validated(data);
    }
    function accessError(access) {
        const code = access?.code || 'ACCESS_UNAVAILABLE';
        const messages = {
            PREMIUM_REQUIRED: 'Necesitas una inscripción Premium completa y vigente para ingresar. Solicita acceso por WhatsApp.',
            NOT_AUTHENTICATED: 'Tu sesión venció. Vuelve a iniciar sesión.',
            DEVICE_LIMIT: 'Confirma tu correo para usar este navegador.',
        };
        return Object.assign(new Error(messages[code] || 'No pudimos verificar tu acceso. Intenta de nuevo.'), { code });
    }
    function validated(access) {
        if (isRegisteredAccess(access)) return access;
        throw accessError(access);
    }
    function requirePremium(access) {
        if (isPremium(access)) return access;
        const denied = access?.ready ? { ...access, code: 'PREMIUM_REQUIRED' } : access;
        throw accessError(denied);
    }
    function apply(access) {
        state = validated(access);
        catalogPromise = null;
        render();
        return state;
    }
    function reset() {
        state = { premium: false, ready: false };
        catalogPromise = null;
        render();
    }
    function studentEmail() {
        try {
            if (window.CampusStudentEmail) return String(window.CampusStudentEmail);
            if (typeof currentUser !== 'undefined' && currentUser?.email) return String(currentUser.email);
        } catch (_) { /* El correo solo se usa para el mensaje de activación. */ }
        return '';
    }
    function renderBanner() {
        const email = studentEmail();
        const emailNode = document.getElementById('free-account-email');
        if (emailNode) emailNode.textContent = email || 'tu correo';
        const cta = document.getElementById('free-account-whatsapp');
        if (cta) {
            const message = email
                ? 'Hola, me registré en AlcocerMed con el correo ' + email + ' y quiero activar mi cuenta.'
                : 'Hola, me registré en AlcocerMed y quiero activar mi cuenta.';
            cta.href = 'https://wa.me/59177921731?text=' + encodeURIComponent(message);
        }
    }
    function render() {
        const pending = isFree() && isRegisteredAccess(state);
        document.body.classList.toggle('campus-free', pending);
        document.body.classList.toggle('campus-pending', pending);
        const banner = document.getElementById('free-account-banner');
        if (banner) {
            banner.hidden = !pending;
            if (pending) renderBanner();
        }
        document.querySelectorAll('[data-premium-label]').forEach(el => { el.hidden = canUseVideos(); });
        document.querySelectorAll('[data-premium-only]').forEach(el => { el.hidden = pending; });
        updateAtlasLinks();
        document.querySelectorAll('[data-free-lock]').forEach(el => { el.hidden = !pending; });
        window.dispatchEvent(new Event('campus-access-change'));
    }
    async function catalog() {
        requirePremium(state);
        if (!catalogPromise) catalogPromise = getSupabase().rpc('campus_catalog').then(({data,error}) => {
            if(error) { catalogPromise=null; throw error; }
            requirePremium(state);
            return data || [];
        });
        return catalogPromise;
    }
    async function resolve(client) { return apply(await check(client)); }

    async function refresh(client, isCurrent) {
        const { data: access, error } = await client.rpc('campus_access');
        if (!isCurrent()) return false;
        if (error) throw new Error('No pudimos verificar tu acceso. Intenta de nuevo.');
        try { requirePremium(access); }
        catch (denied) { reset(); throw denied; }
        if (['ready', 'premium', 'atlas', 'videos', 'expires_at'].some(key => access[key] !== state[key])) apply(access);
        return true;
    }

    return { check, requirePremium, apply, reset, resolve, refresh, isFree, isRegistered, canUseVideos, permits, unlock, catalog };
})();

// Retain the requested exam across Google's fixed, allow-listed /campus callback.
const googleSimulationReturnKey = 'alcocer_google_return_simulation';
// The SDK may remove OAuth callback parameters before it raises SIGNED_IN.
const googleSimulationReturnCallback = (() => {
    try {
        const initial = new URL(location.href);
        const fragment = new URLSearchParams(initial.hash.slice(1));
        return initial.pathname === '/campus' &&
            (initial.searchParams.has('code') || fragment.has('access_token'));
    } catch (_) { return false; }
})();
function rememberCampusGoogleSimulation() {
    try {
        sessionStorage.removeItem(googleSimulationReturnKey);
        const current = new URL(location.href);
        if (current.pathname === '/campus' && !current.searchParams.has('seccion') &&
            current.searchParams.get('simulacro') === 'semana5') {
            sessionStorage.setItem(googleSimulationReturnKey, JSON.stringify({ id: 'semana5', at: Date.now() }));
        }
    } catch (_) { /* OAuth must work even when storage is not available. */ }
}

window.restoreCampusGoogleSimulation = function(canUseSimulations) {
    try {
        const raw = sessionStorage.getItem(googleSimulationReturnKey);
        sessionStorage.removeItem(googleSimulationReturnKey);
        if (!raw || !canUseSimulations || !googleSimulationReturnCallback) return;
        const pending = JSON.parse(raw);
        const age = Date.now() - pending.at;
        if (pending.id !== 'semana5' || !Number.isFinite(age) || age < 0 || age > 15 * 60 * 1000) return;
        const target = new URL(location.href);
        if (target.pathname !== '/campus' || target.searchParams.has('seccion') ||
            target.searchParams.has('simulacro') || target.searchParams.has('mapa')) return;
        target.searchParams.set('simulacro', pending.id);
        history.replaceState(history.state, document.title, target);
    } catch (_) { /* Leave the normal campus landing screen available. */ }
};

window.continueWithGoogle = async function(button) {
    button.disabled=true;
    const output=document.getElementById('google-status');
    try {
        await ensureSupabaseSdk();
        const client=getSupabase();
        // Membership is verified after OAuth identifies the student.
        const response=await fetch(SUPABASE_URL+'/auth/v1/settings',{headers:{apikey:SUPABASE_KEY}});
        if(!response.ok) throw new Error('No pudimos conectar. Intenta de nuevo.');
        const settings=await response.json();
        if(!settings.external?.google) throw new Error('Google todavía no está habilitado. Entra con tu correo o usuario y contraseña.');
        rememberCampusGoogleSimulation();
        const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/campus',queryParams:{prompt:'select_account'}}});
        if(error) throw error;
    } catch(error) {
        try { sessionStorage.removeItem(googleSimulationReturnKey); } catch (_) {}
        output.textContent=error.message; button.disabled=false;
    }
};
