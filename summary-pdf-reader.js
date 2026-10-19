'use strict';
(() => {
    let library;
    function loadLibrary() {
        if (!library) {
            library = import('/vendor/pdfjs/pdf.min.mjs').then(pdfjs => {
                pdfjs.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.mjs';
                return pdfjs;
            }).catch(error => { library = null; throw error; });
        }
        return library;
    }

    // Render PDF pages ourselves: Android browsers may replace embedded PDFs with an Open button.
    class SummaryPdfReader {
        constructor(host) {
            this.host = host;
            this.revision = 0;
            this.entries = [];
            this.zoom = 1;
            this.currentPage = 1;
            this.host.classList.add('summary-pdf-reader');
            const toolbar = document.createElement('div');
            toolbar.className = 'summary-pdf-toolbar';
            toolbar.setAttribute('role', 'toolbar');
            toolbar.setAttribute('aria-label', 'Controles de lectura');
            const button = (label, text, action) => {
                const el = document.createElement('button');
                el.type = 'button'; el.textContent = text;
                el.setAttribute('aria-label', label);
                el.addEventListener('click', action);
                return el;
            };
            this.less = button('Reducir zoom', '−', () => this.setZoom(this.zoom - .25));
            this.more = button('Aumentar zoom', '+', () => this.setZoom(this.zoom + .25));
            this.percent = document.createElement('output');
            this.percent.setAttribute('aria-label', 'Nivel de zoom');
            this.fit = button('Ajustar al ancho', 'Al ancho', () => this.setZoom(1));
            this.counter = document.createElement('span');
            this.counter.className = 'summary-pdf-counter';
            this.counter.setAttribute('aria-live', 'polite');
            toolbar.append(this.less, this.percent, this.more, this.fit, this.counter);
            this.pages = document.createElement('div');
            this.pages.className = 'summary-pdf-scroll';
            this.pages.tabIndex = 0;
            this.pages.setAttribute('role', 'region');
            this.pages.setAttribute('aria-label', 'Páginas del resumen. Desliza para leer.');
            this.host.replaceChildren(toolbar, this.pages);
            this.pages.addEventListener('scroll', () => {
                if (!this.scrollFrame) this.scrollFrame = requestAnimationFrame(() => {
                    this.scrollFrame = null;
                    this.updateCurrentPage();
                    this.releaseDistantPages();
                });
            }, { passive: true });
            this.resizeObserver = new ResizeObserver(() => {
                if (this.pdf && Math.abs(this.pages.clientWidth - this.lastWidth) > 2) {
                    clearTimeout(this.resizeTimer);
                    this.resizeTimer = setTimeout(() => this.layout(), 120);
                }
            });
            this.resizeObserver.observe(this.pages);
            this.updateControls();
        }

        async open(url) {
            this.destroy();
            const revision = this.revision;
            this.host.hidden = false;
            const pdfjs = await loadLibrary();
            if (revision !== this.revision) return;
            this.loading = pdfjs.getDocument({
                url,
                cMapUrl: '/vendor/pdfjs/cmaps/', cMapPacked: true,
                standardFontDataUrl: '/vendor/pdfjs/standard_fonts/',
                wasmUrl: '/vendor/pdfjs/wasm/',
                isEvalSupported: false
            });
            const pdf = await this.loading.promise;
            if (revision !== this.revision) return;
            this.pdf = pdf;
            const first = await pdf.getPage(1);
            if (revision !== this.revision) return;
            this.pageSize = first.getViewport({ scale: 1 });
            this.zoom = 1;
            this.currentPage = 1;
            this.layout();
            await this.renderPage(1, this.revision);
        }

        layout() {
            if (!this.pdf || !this.pageSize) return;
            const pageNumber = this.currentPage;
            this.cancelRendering();
            const revision = ++this.revision;
            this.lastWidth = this.pages.clientWidth;
            this.pageWidth = Math.max(200, Math.min(900, this.lastWidth - 24)) * this.zoom;
            const height = this.pageWidth * this.pageSize.height / this.pageSize.width;
            this.entries = [];
            const fragment = document.createDocumentFragment();
            for (let number = 1; number <= this.pdf.numPages; number++) {
                const el = document.createElement('section');
                el.className = 'summary-pdf-page';
                el.dataset.page = String(number);
                el.setAttribute('aria-label', `Página ${number} de ${this.pdf.numPages}`);
                el.style.width = this.pageWidth + 'px'; el.style.height = height + 'px';
                const placeholder = document.createElement('span');
                placeholder.className = 'summary-pdf-placeholder';
                placeholder.textContent = `Página ${number}`;
                el.append(placeholder);
                fragment.append(el);
                this.entries.push({ el, placeholder, number });
            }
            this.pages.replaceChildren(fragment);
            this.pages.scrollTop = (pageNumber - 1) * (height + 16);
            this.pages.scrollLeft = 0;
            this.queue = Promise.resolve();
            this.observer = new IntersectionObserver(records => {
                for (const record of records) {
                    if (record.isIntersecting) {
                        const number = Number(record.target.dataset.page);
                        this.queue = this.queue.then(() => {
                            if (revision === this.revision) return this.renderPage(number, revision);
                        }).catch(() => { /* The page itself exposes a retry button. */ });
                    }
                }
            }, { root: this.pages, rootMargin: '200px 0px' });
            this.entries.forEach(entry => this.observer.observe(entry.el));
            this.updateControls();
        }

        async renderPage(number, revision) {
            const entry = this.entries[number - 1];
            if (!entry || revision !== this.revision || entry.canvas) return;
            if (entry.pending) return entry.pending;
            const pdf = this.pdf;
            entry.pending = (async () => {
                const page = await pdf.getPage(number);
                if (revision !== this.revision) return;
                const viewport = page.getViewport({ scale: this.pageWidth / page.getViewport({ scale: 1 }).width });
                // Bound canvas memory on phones even at 300% zoom.
                const density = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(2000000 / (viewport.width * viewport.height)));
                const canvas = document.createElement('canvas');
                canvas.width = Math.ceil(viewport.width * density);
                canvas.height = Math.ceil(viewport.height * density);
                canvas.style.width = viewport.width + 'px'; canvas.style.height = viewport.height + 'px';
                canvas.setAttribute('role', 'img');
                canvas.setAttribute('aria-label', `Página ${number} del resumen`);
                entry.el.style.height = viewport.height + 'px';
                entry.task = page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport,
                    transform: [density, 0, 0, density, 0, 0] });
                await entry.task.promise;
                if (revision !== this.revision) return;
                entry.page = page; entry.canvas = canvas;
                entry.el.replaceChildren(canvas);
                const text = await page.getTextContent();
                if (revision !== this.revision || entry.canvas !== canvas) return;
                const accessible = document.createElement('p');
                accessible.className = 'summary-pdf-accessible';
                accessible.textContent = text.items.map(item => item.str || '').join(' ');
                canvas.setAttribute('aria-hidden', 'true');
                entry.el.append(accessible);
                this.releaseDistantPages();
            })().catch(error => {
                if (revision !== this.revision || error.name === 'RenderingCancelledException') return;
                const retry = document.createElement('button');
                retry.type = 'button'; retry.className = 'summary-pdf-page-retry';
                retry.textContent = `Reintentar página ${number}`;
                retry.addEventListener('click', () => this.renderPage(number, this.revision).catch(() => {}));
                entry.el.replaceChildren(retry);
                throw error;
            }).finally(() => { entry.pending = null; entry.task = null; });
            return entry.pending;
        }

        updateControls() {
            this.percent.value = Math.round(this.zoom * 100) + '%';
            this.less.disabled = !this.pdf || this.zoom <= 1;
            this.more.disabled = !this.pdf || this.zoom >= 3;
            this.fit.disabled = !this.pdf;
            this.counter.textContent = this.pdf ? `${this.currentPage} / ${this.pdf.numPages}` : '';
        }

        updateCurrentPage() {
            if (!this.entries.length) return;
            const top = this.pages.getBoundingClientRect().top + 30;
            const current = this.entries.find(entry => entry.el.getBoundingClientRect().bottom > top);
            if (current && current.number !== this.currentPage) {
                this.currentPage = current.number;
                this.updateControls();
            }
        }

        setZoom(value) {
            value = Math.min(3, Math.max(1, value));
            if (!this.pdf || value === this.zoom) return;
            this.zoom = value;
            this.layout();
        }

        releaseDistantPages() {
            for (const entry of this.entries) {
                if (entry.canvas && Math.abs(entry.number - this.currentPage) > 2) {
                    entry.canvas.width = 0; entry.canvas.height = 0;
                    entry.canvas = null;
                    entry.el.replaceChildren(entry.placeholder);
                    if (entry.page) entry.page.cleanup();
                    entry.page = null;
                }
            }
        }

        cancelRendering() {
            if (this.observer) this.observer.disconnect();
            for (const entry of this.entries) {
                if (entry.task) entry.task.cancel();
                if (entry.canvas) { entry.canvas.width = 0; entry.canvas.height = 0; }
            }
        }

        destroy() {
            ++this.revision;
            clearTimeout(this.resizeTimer);
            if (this.scrollFrame) cancelAnimationFrame(this.scrollFrame);
            this.scrollFrame = null;
            this.cancelRendering();
            const loading = this.loading;
            this.loading = null; this.pdf = null; this.pageSize = null;
            this.entries = []; this.pages.replaceChildren();
            this.zoom = 1; this.currentPage = 1;
            this.updateControls();
            if (loading) loading.destroy().catch(() => {});
        }
    }
    window.SummaryPdfReader = SummaryPdfReader;
})();
