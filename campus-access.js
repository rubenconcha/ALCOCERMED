/* Server-authoritative campus entitlements. No paid state is read from user metadata. */
window.CampusAccess = (() => {
    let state = { premium: false, ready: false };
    let catalogPromise;
    const isFree = () => !state.premium;
    const canUseAtlas = () => state.atlas ?? Boolean(state.premium);
    const canUseVideos = () => state.videos ?? Boolean(state.premium);
    function updateAtlasLinks() {
        document.querySelectorAll('[data-atlas-access]').forEach(el => { el.hidden = !canUseAtlas(); });
    }
    function permits(screen) {
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
        if (error || !data?.ready) throw new Error('No pudimos verificar tu acceso. Intenta de nuevo.');
        return data;
    }
    function apply(access) {
        state = access;
        catalogPromise = null;
        document.body.classList.toggle('campus-free', Boolean(isFree()));
        const banner = document.getElementById('free-account-banner');
        banner.hidden = !isFree();
        const accessLabel = banner.querySelector?.('small');
        if (accessLabel) accessLabel.textContent = canUseVideos() ? 'TUS VIDEOCLASES ESTÁN ACTIVAS' : 'TU CUENTA GRATUITA';
        document.querySelectorAll('[data-premium-label]').forEach(el => { el.hidden = canUseVideos(); });
        document.querySelectorAll('[data-premium-only]').forEach(el => { el.hidden = isFree(); });
        updateAtlasLinks();
        document.querySelectorAll('[data-free-lock]').forEach(el => { el.hidden = !isFree(); });
        window.dispatchEvent(new Event('campus-access-change'));
        if (access.ready && !access.premium && typeof access.atlas !== 'boolean' && typeof getSupabase === 'function') {
            Promise.resolve(getSupabase().rpc('campus_atlas_access')).then(({ data, error }) => {
                if (state !== access || error || data?.allowed !== true) return;
                state = { ...access, atlas: true };
                updateAtlasLinks();
            }).catch(() => {});
        }
        return state;
    }
    async function catalog() {
        if (!catalogPromise) catalogPromise = getSupabase().rpc('campus_catalog').then(({data,error}) => {
            if(error) { catalogPromise=null; throw error; }
            return (data || []).filter(topic => !isFree() || Number(topic.free_count) > 0);
        });
        return catalogPromise;
    }
    async function resolve(client) { return apply(await check(client)); }

    async function refresh(client, isCurrent) {
        const access = await check(client);
        if (!isCurrent()) return false;
        if (['ready', 'premium', 'atlas', 'videos', 'expires_at'].some(key => access[key] !== state[key])) apply(access);
        return true;
    }

    return { check, apply, resolve, refresh, isFree, canUseVideos, permits, unlock, catalog };
})();

window.continueWithGoogle = async function(button) {
    button.disabled=true;
    const output=document.getElementById('google-status');
    try {
        await ensureSupabaseSdk();
        const client=getSupabase();
        const access=await client.rpc('campus_access');
        if(access.error || (!access.data?.ready && access.data?.code !== 'DEVICE_LIMIT')) {
            throw new Error('No pudimos comprobar el acceso. Intenta de nuevo.');
        }
        const response=await fetch(SUPABASE_URL+'/auth/v1/settings',{headers:{apikey:SUPABASE_KEY}});
        if(!response.ok) throw new Error('No pudimos conectar. Intenta de nuevo.');
        const settings=await response.json();
        if(!settings.external?.google) throw new Error('Google todavía no está habilitado. Entra con tu correo o usuario y contraseña.');
        const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/campus',queryParams:{prompt:'select_account'}}});
        if(error) throw error;
    } catch(error) { output.textContent=error.message; button.disabled=false; }
};
