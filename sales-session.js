'use strict';

// El campus y esta página comparten origen y almacenamiento de sesión.
// Leer la sesión aquí solo adapta la navegación: nunca cierra ni modifica el acceso.
(async () => {
    const fromCampus = new URLSearchParams(location.search).get('desde') === 'campus';
    const root = document.documentElement;
    const backLink = document.querySelector('.back-to-campus');
    if (backLink) {
        backLink.href = '/?volver=campus';
        try {
            const saved = JSON.parse(sessionStorage.getItem('alcocer_plan_return') || 'null');
            if (saved?.screen === 'mapas') {
                backLink.textContent = '← Volver a mapas mentales';
                backLink.setAttribute('aria-label', 'Volver a mapas mentales en el campus');
            }
        } catch (_) { /* Mantener el regreso general al campus. */ }
    }
    try {
        const config = window.ALCOCER_CONFIG;
        if (!config || !window.supabase?.createClient) return;
        const client = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        const { data, error } = await client.auth.getSession();
        if (error) throw error;
        if (data.session) {
            root.classList.add('session-active');
            document.querySelector('.campus-session-note').textContent = 'Tu sesión sigue activa. Al elegir un plan, conservarás tu cuenta y tu avance.';
        } else if (fromCampus) {
            document.querySelector('.campus-session-note').textContent = 'Elige tu plan y vuelve a tu material desde el botón superior.';
        }
    } catch (error) {
        // Un fallo de red no debe sacar al estudiante de su cuenta.
        console.warn('No se pudo comprobar la sesión en la página de planes.', error);
        if (!fromCampus) root.classList.remove('session-active');
    }

    if (root.classList.contains('campus-entry') || root.classList.contains('session-active')) {
        requestAnimationFrame(() => window.scrollTo(0, 0));
    }
})();
