/* Server-authoritative campus entitlements. No paid state is read from user metadata. */
window.CampusAccess = (() => {
    let state = { premium: false, ready: false };
    let catalogPromise;
    function isPremium(access) {
        return access?.ready === true && access.premium === true && !access.trial &&
            (access.admin === true || !access.expires_at || Date.parse(access.expires_at) > Date.now());
    }
    const isFree = () => !isPremium(state);
    const canUseAtlas = () => !isFree() && state.atlas === true;
    const canUseVideos = () => !isFree();
    function updateAtlasLinks() {
        document.querySelectorAll('[data-atlas-access]').forEach(el => { el.hidden = !canUseAtlas(); });
    }
    function permits(screen) {
        if (isFree()) return false;
        if (screen === 'atlas-screen') return canUseAtlas();
        if (screen === 'videoclases-screen') return canUseVideos();
        return !['study-calendar-screen', 'game-quiz', 'game-hangman'].includes(screen) || !isFree();
    }
    function unlock() {
        const dialog = document.getElementById('campus-unlock');
        if (!dialog) return;
        if (!dialog.open) dialog.showModal();
    }
    async function check(client) {
        const { data, error } = await client.rpc('campus_access');
        if (error) throw new Error('No pudimos verificar tu acceso. Intenta de nuevo.');
        return requirePremium(data);
    }
    function requirePremium(access) {
        if (isPremium(access)) return access;
        const code = access?.code || (access?.ready ? 'PREMIUM_REQUIRED' : 'ACCESS_UNAVAILABLE');
        const messages = {
            PREMIUM_REQUIRED: 'Necesitas una inscripción Premium completa y vigente para ingresar. Solicita acceso por WhatsApp.',
            NOT_AUTHENTICATED: 'Tu sesión venció. Vuelve a iniciar sesión.',
            DEVICE_LIMIT: 'Confirma tu correo para usar este navegador.',
        };
        throw Object.assign(new Error(messages[code] || 'No pudimos verificar tu acceso. Intenta de nuevo.'), { code });
    }
    function apply(access) {
        state = requirePremium(access);
        catalogPromise = null;
        render();
        return state;
    }
    function reset() {
        state = { premium: false, ready: false };
        catalogPromise = null;
        render();
    }
    function render() {
        document.body.classList.toggle('campus-free', false);
        const banner = document.getElementById('free-account-banner');
        if (banner) banner.hidden = true;
        document.querySelectorAll('[data-premium-label]').forEach(el => { el.hidden = canUseVideos(); });
        document.querySelectorAll('[data-premium-only]').forEach(el => { el.hidden = isFree(); });
        updateAtlasLinks();
        document.querySelectorAll('[data-free-lock]').forEach(el => { el.hidden = true; });
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

    return { check, requirePremium, apply, reset, resolve, refresh, isFree, canUseVideos, permits, unlock, catalog };
})();

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
        const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/campus',queryParams:{prompt:'select_account'}}});
        if(error) throw error;
    } catch(error) { output.textContent=error.message; button.disabled=false; }
};
