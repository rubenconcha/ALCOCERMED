'use strict';
(() => {
    const summaries = [
        { subject: 'Biología celular', topic: 'Tema 1', title: 'Introducción a la biología de las células', pages: 6, file: 'biologia-tema-1', kind: 'bio', free: true },
        { subject: 'Biología celular', topic: 'Capítulo 2', title: 'Cómo se estudian las células', pages: 7, file: 'biologia-capitulo-2', kind: 'bio', free: true },
        { subject: 'Biología celular', topic: 'Capítulo 3', title: 'Estructura de la membrana plasmática', pages: 6, file: 'biologia-capitulo-3', kind: 'bio' },
        { subject: 'Biología celular', topic: 'Capítulo 4', title: 'Microtransporte a través de la membrana plasmática', pages: 8, file: 'biologia-capitulo-4', kind: 'bio' },
        { subject: 'Biología celular', topic: 'Capítulo 5', title: 'Macrotransporte a través de la membrana plasmática', pages: 8, file: 'biologia-capitulo-5', kind: 'bio' },
        { subject: 'Educación para la Salud', topic: 'Tema 1', title: 'Evolución del concepto de salud', pages: 2, file: 'educacion-salud-tema-1', kind: 'salud', free: true },
        { subject: 'Educación para la Salud', topic: 'Tema 2', title: 'Determinantes de la salud', pages: 2, file: 'educacion-salud-tema-2', kind: 'salud', free: true },
        { subject: 'Educación para la Salud', topic: 'Tema 3', title: 'Salud pública', pages: 1, file: 'educacion-salud-tema-3', kind: 'salud' },
        { subject: 'Educación para la Salud', topic: 'Tema 4', title: 'Enfoques y paradigmas de intervención en salud', pages: 2, file: 'educacion-salud-tema-4', kind: 'salud' },
        { subject: 'Educación para la Salud', topic: 'Tema 5', title: 'Bases normativas y políticas internacionales', pages: 2, file: 'educacion-salud-tema-5', kind: 'salud' },
        { subject: 'Morfofunción', topic: 'Tema 1', title: 'Temas principales de anatomía y fisiología', pages: 8, file: 'morfofuncion-tema-1', kind: 'morfo', free: true },
        { subject: 'Morfofunción', topic: 'Tema 2', title: 'La química de la vida', pages: 8, file: 'morfofuncion-tema-2', kind: 'morfo', free: true },
        { subject: 'Morfofunción', topic: 'Tema 3', title: 'Forma y función celulares', pages: 8, file: 'morfofuncion-tema-3', kind: 'morfo' },
        { subject: 'Morfofunción', topic: 'Tema 4', title: 'Genética y función celular', pages: 8, file: 'morfofuncion-tema-4', kind: 'morfo' },
        { subject: 'Morfofunción', topic: 'Tema 5', title: 'Histología', pages: 8, file: 'morfofuncion-tema-5', kind: 'morfo' },
        { subject: 'Morfofunción', topic: 'Tema 6', title: 'El sistema tegumentario', pages: 8, file: 'morfofuncion-tema-6', kind: 'morfo' },
        { subject: 'Morfofunción', topic: 'Capítulo 16', title: 'Órganos de los sentidos', pages: 10, file: 'morfofuncion-sentidos', kind: 'morfo', revision: 2 },
        { subject: 'Morfofunción', topic: 'Capítulo 18', title: 'Sangre', pages: 14, file: 'morfofuncion-sangre', kind: 'morfo', revision: 3 },
    ];

    const grid = document.getElementById('resumenes-grid');
    if (!grid) return;
    const search = document.getElementById('resumenes-search');
    const subject = document.getElementById('resumenes-subject');
    const topic = document.getElementById('resumenes-topic');
    const count = document.getElementById('resumenes-count');
    const empty = document.getElementById('resumenes-empty');
    const dialog = document.getElementById('resumenes-viewer');
    const frame = document.getElementById('resumenes-frame');
    const loading = document.getElementById('resumenes-loading');
    const download = document.getElementById('resumenes-download');
    const pdfVersion = '20261011';
    const pdfCache = new Map();
    let pendingRequest = null;
    let openRevision = 0;

    function clearPdfCache() {
        pdfCache.forEach(url => URL.revokeObjectURL(url));
        pdfCache.clear();
    }

    function showPdf(url, item) {
        frame.src = url;
        download.href = url;
        download.download = `${item.file}.pdf`;
        download.hidden = false;
    }

    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const isLocked = item => !item.free && (!window.CampusAccess || CampusAccess.isFree());

    function fillTopics() {
        const previous = topic.value;
        const available = summaries.filter(item => !subject.value || item.subject === subject.value);
        topic.replaceChildren(new Option('Todos los temas', ''));
        available.forEach(item => topic.add(new Option(`${item.topic} · ${item.title}`, item.file)));
        topic.value = available.some(item => item.file === previous) ? previous : '';
    }

    function createCard(item) {
        const locked = isLocked(item);
        const article = document.createElement('article');
        article.className = `resumenes-card resumenes-card-${item.kind}${locked ? ' resumenes-card-locked' : ''}`;
        const preview = document.createElement('div');
        preview.className = 'resumenes-card-image';
        const image = document.createElement('img');
        image.src = `/assets/resumenes-portadas/${item.file}.png${item.revision ? `?v=${item.revision}` : ''}`;
        image.alt = `Portada de ${item.subject}, ${item.topic}`;
        image.loading = 'lazy';
        preview.append(image);
        if (locked) {
            const lock = document.createElement('span');
            lock.className = 'resumenes-lock';
            lock.textContent = '🔒 Con un plan';
            preview.append(lock);
        }
        const body = document.createElement('div');
        body.className = 'resumenes-card-body';
        const label = document.createElement('span');
        label.textContent = `${item.subject} · ${item.topic}`;
        const title = document.createElement('h3');
        title.textContent = item.title;
        const detail = document.createElement('p');
        detail.textContent = `${item.pages} páginas · PDF`;
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = locked ? 'Ver planes →' : 'Leer PDF →';
        button.addEventListener('click', () => locked ? CampusAccess.unlock() : openSummary(item));
        body.append(label, title, detail, button);
        article.append(preview, body);
        return article;
    }

    function render() {
        const query = normalize(search.value.trim());
        const visible = summaries.filter(item =>
            (!subject.value || item.subject === subject.value) &&
            (!topic.value || item.file === topic.value) &&
            (!query || normalize(`${item.subject} ${item.topic} ${item.title}`).includes(query))
        );
        grid.replaceChildren(...visible.map(createCard));
        count.textContent = `${visible.length} ${visible.length === 1 ? 'resumen' : 'resúmenes'}`;
        empty.hidden = visible.length !== 0;
    }

    async function openSummary(item) {
        if (isLocked(item)) return CampusAccess.unlock();
        const revision = ++openRevision;
        if (pendingRequest) pendingRequest.abort();
        pendingRequest = null;
        frame.removeAttribute('src');
        document.getElementById('resumenes-viewer-subject').textContent = `${item.subject} · ${item.topic}`;
        document.getElementById('resumenes-viewer-title').textContent = item.title;
        download.hidden = true;
        loading.textContent = 'Cargando PDF…';
        loading.hidden = false;
        dialog.showModal();
        // Let the browser stream public PDFs and reuse its HTTP cache.
        if (item.free) {
            showPdf(`/resumenes/${item.file}.pdf?v=${pdfVersion}`, item);
            return;
        }
        const controller = new AbortController();
        pendingRequest = controller;
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
            const { data } = await getSupabase().auth.getSession();
            if (revision !== openRevision || !dialog.open) return;
            if (!data.session?.access_token) throw new Error('Inicia sesión para abrir este resumen.');
            const key = `${data.session.user.id}:${item.file}`;
            if (pdfCache.has(key)) {
                const url = pdfCache.get(key);
                pdfCache.delete(key);
                pdfCache.set(key, url);
                showPdf(url, item);
                return;
            }
            const response = await fetch(`/api/resumen?file=${encodeURIComponent(item.file)}`, {
                headers: { Authorization: `Bearer ${data.session.access_token}` },
                cache: 'no-store', signal: controller.signal
            });
            if (!response.ok) throw new Error(response.status === 403 ? 'Este resumen requiere una suscripción activa.' : 'No se pudo cargar el PDF. Intenta otra vez.');
            const blob = await response.blob();
            if (!blob.type.includes('pdf')) throw new Error('El archivo no se recibió como PDF.');
            if (revision !== openRevision || !dialog.open) return;
            const url = URL.createObjectURL(blob);
            pdfCache.set(key, url);
            if (pdfCache.size > 3) {
                const oldest = pdfCache.keys().next().value;
                URL.revokeObjectURL(pdfCache.get(oldest));
                pdfCache.delete(oldest);
            }
            showPdf(url, item);
        } catch (error) {
            if (revision === openRevision && dialog.open) {
                loading.textContent = error.name === 'AbortError' ? 'La conexión está tardando. Cierra y vuelve a abrir el resumen.' : error.message;
            }
        } finally {
            clearTimeout(timeout);
            if (pendingRequest === controller) pendingRequest = null;
        }
    }

    frame.addEventListener('load', () => {
        if (frame.getAttribute('src')) loading.hidden = true;
    });

    search.addEventListener('input', render);
    subject.addEventListener('change', () => { fillTopics(); render(); });
    topic.addEventListener('change', render);
    document.getElementById('resumenes-clear').addEventListener('click', () => {
        search.value = '';
        subject.value = '';
        topic.value = '';
        fillTopics();
        render();
        search.focus();
    });
    document.getElementById('resumenes-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
        ++openRevision;
        if (pendingRequest) pendingRequest.abort();
        pendingRequest = null;
        frame.removeAttribute('src');
    });
    window.addEventListener('campus-access-change', () => { clearPdfCache(); render(); });
    window.addEventListener('pagehide', clearPdfCache);
    fillTopics();
    render();
})();
