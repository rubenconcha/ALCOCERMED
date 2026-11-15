'use strict';
(() => {
    const panel = document.getElementById('campus-information-screen');
    const dialog = document.getElementById('campus-information-reader');
    if (!panel || !dialog) return;
    const title = document.getElementById('info-reader-title');
    const status = document.getElementById('info-reader-status');
    const pages = document.getElementById('info-reader-pages');
    const controls = document.getElementById('info-reader-controls');
    const download = document.getElementById('info-reader-download');
    const native = document.getElementById('info-reader-native');
    const retry = document.getElementById('info-reader-retry');
    let reader, current, revision = 0;

    function clear() {
        ++revision;
        reader?.destroy();
        document.body.classList.remove('info-document-open');
    }

    function close() {
        clear();
        if (dialog.open) dialog.close();
    }

    async function open(link) {
        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin || !/^\/documentos\/umss-2027\/[a-z0-9-]+\.pdf$/.test(url.pathname)) return;
        const request = ++revision;
        current = link;
        reader?.destroy();
        title.textContent = link.dataset.infoDocument;
        download.href = native.href = url.href;
        download.download = url.pathname.split('/').pop();
        status.textContent = 'Cargando documento…';
        status.hidden = false;
        retry.hidden = true;
        controls.inert = pages.inert = true;
        document.body.classList.add('info-document-open');
        if (!dialog.open) dialog.showModal();
        try {
            await window.loadCampusAssets('reader');
            if (request !== revision || !dialog.open) return;
            reader ||= new SummaryPdfReader(pages, { label: 'documento', pageJump: true, toolbarHost: controls });
            await reader.open(url.href, { rangeOnly: true });
            if (request !== revision || !dialog.open) return;
            status.hidden = true;
            controls.inert = pages.inert = false;
        } catch (_) {
            if (request !== revision || !dialog.open) return;
            reader?.destroy();
            status.textContent = 'No pudimos cargar el lector. Reintenta o usa «Abrir PDF» o «Descargar PDF».';
            retry.hidden = false;
        }
    }

    panel.addEventListener('click', event => {
        const link = event.target.closest('a[data-info-document]');
        if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        open(link);
    });
    retry.onclick = () => { if (current) open(current); };
    document.getElementById('info-reader-close').onclick = close;
    dialog.addEventListener('close', () => { if (!dialog.open) clear(); });
    window.CampusInformation = { close };
})();
