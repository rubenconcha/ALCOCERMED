/* Server-authoritative campus entitlements. No paid state is read from user metadata. */
window.CampusAccess = (() => {
    let state = { premium: false, ready: false };
    let catalogPromise;
    const isFree = () => !state.premium;
    function unlock() {
        try {
            const mapsScreen = document.getElementById('intocables-screen');
            const viewingMaps = mapsScreen && !mapsScreen.classList.contains('hidden') &&
                (!window.mmState || window.mmState.currentTab === 'mapas');
            const state = viewingMaps ? {
                screen: 'mapas',
                materia: window.mmState?.selectedMateria || null,
                tema: window.mmState?.selectedTema || null,
                search: document.getElementById('mm-search-input')?.value || '',
                scrollY: window.scrollY || 0
            } : { screen: 'inicio' };
            sessionStorage.setItem('alcocer_plan_return', JSON.stringify(state));
        } catch (_) { /* La navegación al plan debe funcionar aunque el navegador limite el almacenamiento. */ }
        window.location.href = '/planes?desde=campus';
    }
    async function resolve(client) {
        const { data, error } = await client.rpc('campus_access');
        if (error || !data?.ready) throw new Error('No pudimos verificar tu acceso. Intenta de nuevo.');
        state = data;
        catalogPromise = null;
        document.body.classList.toggle('campus-free', Boolean(isFree()));
        document.getElementById('free-account-banner').hidden = !isFree();
        document.querySelectorAll('[data-premium-label]').forEach(el => { el.hidden = !isFree(); });
        document.querySelectorAll('[data-premium-only]').forEach(el => { el.hidden = isFree(); });
        document.querySelectorAll('[data-free-lock]').forEach(el => { el.hidden = !isFree(); });
        window.dispatchEvent(new Event('campus-access-change'));
        return state;
    }
    async function catalog() {
        if (!catalogPromise) catalogPromise = getSupabase().rpc('campus_catalog').then(({data,error}) => {
            if(error) { catalogPromise=null; throw error; } return data || [];
        });
        return catalogPromise;
    }
    async function appendLocks(container, subject) {
        if (!isFree()) return;
        try {
            const topics = (await catalog()).filter(t => normalizeDbText(t.materia) === normalizeDbText(subject) && !Number(t.free_count));
            topics.forEach(topic => {
                const li=document.createElement('li'), link=document.createElement('a');
                link.href='/planes?desde=campus'; link.className='campus-topic-lock'; link.textContent='🔒 '+topic.tema;
                link.addEventListener('click', event => { event.preventDefault(); unlock(); });
                li.append(link); container.append(li);
            });
        } catch (_) { /* Existing sample remains usable when catalogue is unavailable. */ }
    }
    return { resolve, isFree, unlock, catalog, appendLocks };
})();

window.continueWithGoogle = async function(button) {
    button.disabled=true;
    const output=document.getElementById('google-status');
    try {
        await ensureSupabaseSdk();
        const client=getSupabase();
        const access=await client.rpc('campus_access');
        if(access.error || !access.data?.ready) throw new Error('El registro está en preparación. Prueba la muestra mientras tanto.');
        const response=await fetch(SUPABASE_URL+'/auth/v1/settings',{headers:{apikey:SUPABASE_KEY}});
        if(!response.ok) throw new Error('No pudimos conectar. Intenta de nuevo.');
        const settings=await response.json();
        if(!settings.external?.google) throw new Error('Google todavía no está habilitado. Puedes registrarte con tu correo y contraseña.');
        const {error}=await client.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+'/',queryParams:{prompt:'select_account'}}});
        if(error) throw error;
    } catch(error) { output.textContent=error.message; button.disabled=false; }
};
