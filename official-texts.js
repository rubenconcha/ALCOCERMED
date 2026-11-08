'use strict';
(() => {
    const texts = [
        {
            subject: 'Morfofunción', slug: 'morfofuncion', symbol: 'M', pages: 1251,
            title: 'Anatomía y fisiología. La unidad entre forma y función',
            credit: 'Kenneth S. Saladin', edition: '6.ª edición · McGraw-Hill Interamericana',
        },
        {
            subject: 'Biología Celular y Molecular', slug: 'biologia-celular', symbol: 'B', pages: 829, coverPage: 9,
            title: 'Biología celular biomédica',
            credit: 'Alfonso Calvo González', edition: '1.ª edición · Elsevier España · 2015',
        },
        {
            subject: 'Educación en Salud e Investigación', slug: 'educacion-salud', symbol: 'E', pages: 232,
            title: 'Compendio de Educación en Salud e Investigación',
            credit: 'Departamento de Medicina Social y Familiar · Facultad de Medicina, UMSS',
            edition: '1.ª edición · 2025',
        },
    ];
    const $ = id => document.getElementById(id);
    const dialog = $('official-texts-reader');
    const status = $('official-texts-status');
    const fallback = $('official-texts-fallback');
    const preview = $('official-texts-preview');
    const pages = $('official-texts-pages');
    const downloadButton = $('official-texts-download');
    const readerDownloadStatus = $('official-texts-reader-download-status');
    const resourceUrl = text => '/api/texto-oficial?materia=' + text.slug;
    let reader, current, loaded, releaseTimer, revision = 0, opening, previewUrl;

    async function authorization() {
        const { data } = await getSupabase().auth.getSession();
        if (!data?.session?.access_token) throw new Error('Inicia sesión para acceder a los textos.');
        return { Authorization: 'Bearer ' + data.session.access_token };
    }

    function clearPreview() {
        preview.hidden = true;
        preview.removeAttribute('src');
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = null;
    }

    function discardReader() {
        clearTimeout(releaseTimer);
        loaded = null;
        reader?.destroy();
    }

    async function showPreview(text, headers, signal) {
        const response = await fetch(resourceUrl(text) + '&vista=portada', { headers, signal });
        if (!response.ok) return;
        const blob = await response.blob();
        if (signal.aborted) return;
        previewUrl = URL.createObjectURL(blob);
        preview.alt = 'Portada de ' + text.title;
        preview.src = previewUrl;
        preview.hidden = false;
    }

    async function read(text) {
        const version = ++revision;
        opening?.abort();
        clearPreview();
        clearTimeout(releaseTimer);
        current = text;
        $('official-texts-reader-title').textContent = text.title;
        readerDownloadStatus.hidden = true;
        fallback.hidden = true;
        if (!dialog.open) dialog.showModal();
        if (loaded === text) return;
        discardReader();
        const controller = opening = new AbortController();
        const { signal } = controller;
        status.textContent = 'Cargando PDF…';
        status.hidden = false;
        pages.inert = true;
        try {
            const headers = await authorization();
            if (version !== revision || !dialog.open) return;
            const url = resourceUrl(text) + '&vista=lector';
            const response = await fetch(url, { method: 'POST', headers, signal });
            if (!response.ok) throw new Error('Lector no disponible');
            const { grant } = await response.json();
            if (signal.aborted) return;
            if (typeof grant !== 'string') throw new Error('Lector no disponible');
            headers['X-Official-Reader'] = grant;
            showPreview(text, headers, signal).catch(() => { /* The PDF stays usable without a preview. */ });
            reader ||= new SummaryPdfReader(pages, { label: 'texto oficial', pageJump: true });
            await reader.open(url, { headers, rangeOnly: true, initialPage: text.coverPage });
            if (version !== revision || !dialog.open) return;
            controller.abort();
            clearPreview();
            loaded = text;
            pages.inert = false;
            status.hidden = true;
        } catch (_) {
            if (version !== revision || !dialog.open) return;
            reader?.destroy();
            status.textContent = 'No pudimos abrir el PDF. Puedes reintentar o consultar la publicación oficial.';
            fallback.hidden = false;
        }
    }

    async function download(text, button, feedback) {
        button.disabled = true;
        feedback.textContent = 'Preparando descarga…';
        feedback.hidden = false;
        try {
            const response = await fetch(resourceUrl(text), { method: 'POST', headers: await authorization() });
            if (!response.ok) throw new Error('Descarga no disponible');
            const { grant } = await response.json();
            if (typeof grant !== 'string') throw new Error('Descarga no disponible');
            const link = document.createElement('a');
            link.href = resourceUrl(text) + '&descarga=' + encodeURIComponent(grant);
            link.download = 'UMSS-2025-2026-' + text.slug + '.pdf';
            document.body.append(link);
            link.click();
            link.remove();
            feedback.hidden = true;
        } catch (_) {
            feedback.textContent = 'No pudimos iniciar la descarga. Vuelve a intentarlo.';
        } finally {
            button.disabled = false;
        }
    }

    function card(text) {
        const article = document.createElement('article');
        article.className = 'past-card campus-resource-card official-text-card';
        const badge = document.createElement('span');
        badge.className = 'campus-resource-symbol';
        badge.textContent = text.symbol;
        badge.setAttribute('aria-hidden', 'true');
        const subject = document.createElement('p');
        subject.className = 'official-text-area';
        subject.textContent = text.subject;
        const heading = document.createElement('h3');
        heading.textContent = text.title;
        const credit = document.createElement('p');
        credit.className = 'official-text-credit';
        credit.textContent = text.credit;
        const detail = document.createElement('p');
        detail.className = 'official-text-edition';
        detail.textContent = text.edition + ' · ' + text.pages + ' páginas del PDF';
        const actions = document.createElement('div');
        actions.className = 'campus-resource-actions';
        const open = document.createElement('button');
        open.type = 'button';
        open.className = 'btn-primary';
        open.textContent = 'Leer en el campus';
        open.setAttribute('aria-label', 'Leer ' + text.title + ' en el campus');
        open.onclick = () => read(text);
        const save = document.createElement('button');
        save.type = 'button';
        save.className = 'campus-resource-secondary';
        save.textContent = 'Descargar PDF';
        save.setAttribute('aria-label', 'Descargar ' + text.title);
        save.onclick = () => download(text, save, $('official-texts-download-status'));
        actions.append(open, save);
        article.append(badge, subject, heading, credit, detail, actions);
        return article;
    }

    $('official-texts-grid').replaceChildren(...texts.map(card));
    $('official-texts-close').onclick = () => dialog.close();
    downloadButton.onclick = () => { if (current) return download(current, downloadButton, readerDownloadStatus); };
    $('official-texts-retry').onclick = () => { if (current) read(current); };
    dialog.addEventListener('close', () => {
        if (dialog.open) return;
        ++revision;
        current = null;
        opening?.abort();
        clearPreview();
        if (loaded) releaseTimer = setTimeout(discardReader, 120000);
        else discardReader();
    });
    window.OfficialTexts = {
        open() {
            if (showScreen('official-texts-screen') === false) return;
            if (!navigator.connection?.saveData) SummaryPdfReader.preload().catch(() => {});
        },
        close() {
            ++revision;
            opening?.abort();
            discardReader();
            if (dialog.open) dialog.close();
        },
    };
})();
