/* Intocables: the public catalogue contains titles only; lesson bodies live behind Supabase RLS. */
window.IntocablesHub = (() => {
    let catalogue = [], lessons = new Map(), subject = '', topic = '', query = '';
    let initialized = false, requestId = 0;
    const subjects = ['Morfofunción', 'Biología celular', 'Educación para la Salud'];
    const $ = id => document.getElementById(id);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
    const normal = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

    function topics() {
        const names = [...new Set(catalogue.filter(item => !subject || item.materia === subject).map(item => item.tema))];
        $('itc-topic').innerHTML = '<option value="">Todos los temas</option>' + names.map(name => `<option value="${esc(name)}">${esc(name)}</option>`).join('');
        $('itc-topic').value = topic;
    }
    function renderSubjects() {
        $('itc-subjects').innerHTML = ['Todas', ...subjects].map((name, index) => {
            const value = index ? name : '';
            const active = subject === value;
            return `<button type="button" data-subject="${esc(value)}" class="${active ? 'active' : ''}" aria-pressed="${active}">${esc(name)}</button>`;
        }).join('');
    }
    function status(message) {
        $('itc-status').hidden = !message;
        $('itc-status').textContent = message || '';
    }
    function render() {
        renderSubjects(); topics();
        const filtered = catalogue.filter(item => (!subject || item.materia === subject) && (!topic || item.tema === topic) && normal([item.titulo,item.tema,item.materia].join(' ')).includes(normal(query)));
        $('itc-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'ficha' : 'fichas'}`;
        $('itc-grid').innerHTML = filtered.length ? filtered.map(item => {
            const locked = !item.acceso_gratis && window.CampusAccess?.isFree();
            const loaded = lessons.has(item.id);
            const number = String(item.orden).padStart(2,'0');
            return `<button type="button" class="itc-card ${locked ? 'is-locked' : ''}" data-id="${esc(item.id)}" aria-label="${locked ? 'Bloqueado: ' : ''}${esc(item.titulo)}"><span class="itc-card-top"><span class="itc-number">${number}</span><span class="itc-card-symbol" aria-hidden="true">${locked ? '🔒' : '↗'}</span></span><span class="itc-card-middle"><span class="itc-card-subject">${esc(item.materia)}</span><strong>${esc(item.titulo)}</strong><span class="itc-card-topic">${esc(item.tema)}</span></span><span class="itc-card-bottom">${locked ? 'Disponible con un plan' : loaded ? 'Abrir ficha' : 'Cargando ficha'} <span aria-hidden="true">→</span></span></button>`;
        }).join('') : '<div class="itc-empty">No hay fichas con estos filtros. Prueba con otro tema.</div>';
    }
    async function load() {
        const current = ++requestId;
        status('Cargando fichas…');
        try {
            if (!catalogue.length) {
                const response = await fetch('/content/intocables_catalogo_2026.json', {cache:'no-store'});
                if (!response.ok) throw new Error('No se pudo cargar el catálogo.');
                catalogue = await response.json();
                catalogue.sort((a,b) => a.orden - b.orden);
            }
            render();
            await ensureSupabaseSdk();
            const {data,error} = await getSupabase().from('intocables_esenciales').select('*').order('orden');
            if (error) throw error;
            if (current !== requestId) return;
            lessons = new Map((data || []).map(item => [item.id,item]));
            status(lessons.size ? '' : 'Inicia sesión para leer las fichas disponibles.');
            render();
        } catch (error) {
            if (current !== requestId) return;
            status('No se pudieron cargar las fichas. Comprueba tu conexión e inténtalo de nuevo.');
            render();
        }
    }
    function openLesson(id) {
        const meta = catalogue.find(item => item.id === id);
        if (!meta) return;
        if (!meta.acceso_gratis && window.CampusAccess?.isFree()) { window.CampusAccess.unlock(); return; }
        const item = lessons.get(id);
        if (!item) { status('La ficha aún no está disponible. Inténtalo de nuevo en un momento.'); load(); return; }
        $('itc-dialog-kicker').textContent = `${item.materia} · ${item.tema}`;
        $('itc-dialog-title').textContent = item.titulo;
        $('itc-key').textContent = item.clave;
        $('itc-explain').textContent = item.explicacion;
        $('itc-mistake').textContent = item.error_comun;
        $('itc-question').textContent = item.pregunta;
        $('itc-answer').textContent = item.respuesta;
        $('itc-answer').hidden = true;
        $('itc-reveal').hidden = false;
        $('itc-reveal').textContent = 'Ver respuesta';
        $('itc-source').textContent = `Referencia: ${item.fuente}`;
        $('itc-dialog').showModal();
    }
    function init() {
        if (initialized) return;
        initialized = true;
        $('itc-subjects').addEventListener('click', event => {
            const button = event.target.closest('button[data-subject]');
            if (!button) return;
            subject = button.dataset.subject; topic = ''; render();
        });
        $('itc-topic').addEventListener('change', event => {topic = event.target.value; render();});
        $('itc-search').addEventListener('input', event => {query = event.target.value.trim(); render();});
        $('itc-grid').addEventListener('click', event => {const card = event.target.closest('[data-id]'); if (card) openLesson(card.dataset.id);});
        $('itc-close').addEventListener('click', () => $('itc-dialog').close());
        $('itc-dialog').addEventListener('click', event => {if (event.target === $('itc-dialog')) $('itc-dialog').close();});
        $('itc-reveal').addEventListener('click', () => {$('itc-answer').hidden = false; $('itc-reveal').hidden = true;});
        window.addEventListener('campus-access-change', () => { if (!$('intocables-hub-screen').classList.contains('hidden')) load(); });
    }
    function open() { init(); render(); load(); }
    return {open};
})();
