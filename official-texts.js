'use strict';
(() => {
    const texts = [
        {
            subject: 'Morfofunción', slug: 'morfofuncion', art: 'morphology', pages: 1251,
            title: 'Anatomía y fisiología. La unidad entre forma y función',
            credit: 'Kenneth S. Saladin', edition: '6.ª edición · McGraw-Hill Interamericana',
        },
        {
            subject: 'Biología Celular y Molecular', slug: 'biologia-celular', art: 'cell', pages: 829, coverPage: 9,
            title: 'Biología celular biomédica',
            credit: 'Alfonso Calvo González', edition: '1.ª edición · Elsevier España · 2015',
        },
        {
            subject: 'Educación en Salud e Investigación', slug: 'educacion-salud', art: 'health-education', pages: 232,
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
    let reader, current, requestedPage, loaded, releaseTimer, revision = 0, opening, previewUrl, bookCoverUrl;

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
        if (bookCoverUrl) URL.revokeObjectURL(bookCoverUrl);
        bookCoverUrl = null;
    }

    async function prepareBook(text, headers, signal, page) {
        const response = await fetch(resourceUrl(text) + '&vista=portada', { headers, signal });
        if (!response.ok) return false;
        const grant = response.headers.get('X-Official-Reader');
        if (grant) headers['X-Official-Reader'] = grant;
        const starts = (response.headers.get('X-Official-Page-Starts') || '').split(',').map(Number);
        const blob = await response.blob();
        if (signal.aborted) return false;
        previewUrl = URL.createObjectURL(blob);
        preview.alt = 'Portada de ' + text.title;
        preview.src = previewUrl;
        preview.hidden = page !== (text.coverPage || 1);
        if (starts[0] !== 1 || !starts.every((page, i) => Number.isInteger(page) && page <= text.pages && (!i || page > starts[i - 1]))) return false;
        await preview.decode();
        if (signal.aborted) return false;
        const url = previewUrl;
        await reader.openBook({
            numPages: text.pages,
            starts,
            async fetchSegment(start, cancel) {
                const path = resourceUrl(text) + '&vista=tramo&desde=' + start;
                const signal = AbortSignal.any([cancel, AbortSignal.timeout(45000)]);
                let result = await fetch(path, { headers, signal });
                if (result.status === 401) {
                    Object.assign(headers, await authorization());
                    result = await fetch(path, { headers, signal });
                }
                if (!result.ok) throw new Error('No pudimos cargar estas páginas.');
                return new Uint8Array(await result.arrayBuffer());
            },
        }, { page: text.coverPage || 1, url, alt: preview.alt, width: preview.naturalWidth, height: preview.naturalHeight }, page);
        if (signal.aborted) return false;
        bookCoverUrl = url;
        previewUrl = null;
        return true;
    }

    async function openFullReader(text, headers, signal, page) {
        const url = resourceUrl(text) + '&vista=lector';
        if (!headers['X-Official-Reader']) {
            const response = await fetch(url, { method: 'POST', headers, signal });
            if (!response.ok) throw new Error('Lector no disponible');
            const { grant } = await response.json();
            if (typeof grant !== 'string') throw new Error('Lector no disponible');
            headers['X-Official-Reader'] = grant;
        }
        if (!signal.aborted) await reader.open(url, { headers, rangeOnly: true, initialPage: page });
    }

    async function read(text, page) {
        const version = ++revision;
        opening?.abort();
        clearPreview();
        clearTimeout(releaseTimer);
        current = text;
        requestedPage = page;
        $('official-texts-reader-title').textContent = text.title;
        readerDownloadStatus.hidden = true;
        fallback.hidden = true;
        if (!dialog.open) dialog.showModal();
        if (loaded === text) {
            if (page) reader.goToPage(page);
            return;
        }
        const initialPage = page ?? text.coverPage ?? 1;
        discardReader();
        const controller = opening = new AbortController();
        const { signal } = controller;
        status.textContent = 'Cargando PDF…';
        status.hidden = false;
        pages.inert = true;
        try {
            const headers = await authorization();
            if (version !== revision || !dialog.open) return;
            reader ||= new SummaryPdfReader(pages, { label: 'texto oficial', pageJump: true });
            const ready = await prepareBook(text, headers, signal, initialPage).catch(() => false);
            if (signal.aborted) return;
            if (!ready) await openFullReader(text, headers, signal, initialPage);
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
        const illustration = document.createElement('img');
        illustration.className = 'official-text-icon';
        illustration.src = '/assets/study-art/' + text.art + '.png';
        illustration.alt = '';
        illustration.width = illustration.height = 84;
        illustration.loading = 'lazy';
        illustration.decoding = 'async';
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
        article.append(illustration, subject, heading, credit, detail, actions);
        return article;
    }

    $('official-texts-grid').replaceChildren(...texts.map(card));
    $('official-texts-close').onclick = () => dialog.close();
    downloadButton.onclick = () => { if (current) return download(current, downloadButton, readerDownloadStatus); };
    $('official-texts-retry').onclick = () => { if (current) read(current, requestedPage); };
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
            return showScreen('official-texts-screen');
        },
        readPage(slug, page) {
            const text = texts.find(item => item.slug === slug);
            if (!text || !Number.isInteger(page) || page < 1 || page > text.pages) return;
            return read(text, page);
        },
        preload() {
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
