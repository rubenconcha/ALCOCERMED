'use strict';
(() => {
    const texts = [
        { subject: 'Matemáticas', pages: 184, slug: 'matematicas', symbol: '∑' },
        { subject: 'Física', pages: 202, slug: 'fisica', symbol: 'F' },
        { subject: 'Química', pages: 296, slug: 'quimica', symbol: 'Q' },
        { subject: 'Biología', pages: 226, slug: 'biologia', symbol: 'B' },
        { subject: 'Lenguaje', pages: 239, slug: 'lenguaje', symbol: 'Aa' },
    ];
    const $ = id => document.getElementById(id);
    const dialog = $('official-texts-reader');
    const status = $('official-texts-status');
    const fallback = $('official-texts-fallback');
    const downloadUrl = text => '/api/texto-oficial?materia=' + text.slug;
    let reader, current, revision = 0;

    async function read(text) {
        const version = ++revision;
        current = text;
        $('official-texts-reader-title').textContent = 'Texto guía de ' + text.subject;
        $('official-texts-download').href = downloadUrl(text);
        status.textContent = 'Cargando PDF…';
        status.hidden = false;
        fallback.hidden = true;
        if (!dialog.open) dialog.showModal();
        try {
            reader ||= new SummaryPdfReader($('official-texts-pages'), { label: 'texto oficial', pageJump: true });
            await reader.open(downloadUrl(text));
            if (version === revision && dialog.open) status.hidden = true;
        } catch (_) {
            if (version !== revision || !dialog.open) return;
            reader?.destroy();
            status.textContent = 'No pudimos abrir el PDF. Puedes reintentar o consultar la publicación oficial.';
            fallback.hidden = false;
        }
    }

    function card(text) {
        const article = document.createElement('article');
        article.className = 'past-card campus-resource-card official-text-card';
        const badge = document.createElement('span');
        badge.className = 'campus-resource-symbol';
        badge.textContent = text.symbol;
        badge.setAttribute('aria-hidden', 'true');
        const heading = document.createElement('h3');
        heading.textContent = text.subject;
        const detail = document.createElement('p');
        detail.textContent = text.pages + ' páginas · PDF oficial';
        const actions = document.createElement('div');
        actions.className = 'campus-resource-actions';
        const open = document.createElement('button');
        open.type = 'button';
        open.className = 'btn-primary';
        open.textContent = 'Leer en el campus';
        open.setAttribute('aria-label', 'Leer la guía de ' + text.subject + ' en el campus');
        open.onclick = () => read(text);
        const download = document.createElement('a');
        download.className = 'campus-resource-secondary';
        download.href = downloadUrl(text);
        download.textContent = 'Descargar PDF';
        download.setAttribute('aria-label', 'Descargar la guía de ' + text.subject);
        actions.append(open, download);
        article.append(badge, heading, detail, actions);
        return article;
    }

    $('official-texts-grid').replaceChildren(...texts.map(card));
    $('official-texts-close').onclick = () => dialog.close();
    $('official-texts-retry').onclick = () => { if (current) read(current); };
    dialog.addEventListener('close', () => {
        if (dialog.open) return;
        ++revision;
        current = null;
        reader?.destroy();
    });
    window.OfficialTexts = {
        open: () => showScreen('official-texts-screen'),
        close: () => { if (dialog.open) dialog.close(); },
    };
})();
