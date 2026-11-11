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

    const pdfOptions = {
        cMapUrl: '/vendor/pdfjs/cmaps/', cMapPacked: true,
        standardFontDataUrl: '/vendor/pdfjs/standard_fonts/',
        wasmUrl: '/vendor/pdfjs/wasm/',
        isEvalSupported: false
    };

    function segmentedDocument({ numPages, starts, fetchSegment }) {
        const segments = new Map();
        let worker;
        function dispose(segment) {
            if (segment.controller.signal.aborted) return;
            segment.controller.abort();
            return segment.task?.destroy();
        }
        return {
            numPages,
            async getPage(number) {
                const start = starts.findLast(page => page <= number);
                let segment = segments.get(start);
                if (segment) segments.delete(start);
                else {
                    const controller = new AbortController();
                    segment = { controller };
                    segment.result = Promise.all([loadLibrary(), fetchSegment(start, controller.signal)])
                        .then(([pdfjs, data]) => {
                            controller.signal.throwIfAborted();
                            worker ||= pdfjs.PDFWorker.create();
                            segment.task = pdfjs.getDocument({ ...pdfOptions, data, worker });
                            return segment.task.promise;
                        }).catch(error => {
                            if (segments.get(start) === segment) segments.delete(start);
                            dispose(segment)?.catch(() => {});
                            throw error;
                        });
                }
                segments.set(start, segment);
                if (segments.size > 5) {
                    const oldest = segments.keys().next().value;
                    dispose(segments.get(oldest))?.catch(() => {});
                    segments.delete(oldest);
                }
                const pdf = await segment.result;
                return pdf.getPage(number - start + 1);
            },
            destroy() {
                Promise.allSettled(Array.from(segments.values(), dispose)).then(() => worker?.destroy());
                segments.clear();
            },
        };
    }

    // Render PDF pages ourselves: Android browsers may replace embedded PDFs with an Open button.
    class SummaryPdfReader {
        static preload() { return loadLibrary(); }
        static usesPagePicker(citations) { return citations?.length > 4; }

        constructor(host, { label = 'resumen', pageJump = false, toolbarHost } = {}) {
            this.host = host;
            this.label = label;
            this.revision = 0;
            this.entries = [];
            this.entriesByPage = new Map();
            this.selection = null;
            this.highlights = new Map();
            this.highlightedEntries = new Set();
            this.zoom = 1;
            this.currentPage = 1;
            this.focusedPage = null;
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
            this.fit.className = 'summary-pdf-fit';
            const fitLabel = document.createElement('span');
            fitLabel.textContent = this.fit.textContent;
            const fitIcon = document.createElement('span');
            fitIcon.className = 'summary-pdf-fit-icon';
            fitIcon.setAttribute('aria-hidden', 'true');
            fitIcon.textContent = '↔';
            this.fit.replaceChildren(fitLabel, fitIcon);
            this.counter = document.createElement('span');
            this.counter.className = 'summary-pdf-counter';
            this.counter.setAttribute('aria-live', 'polite');
            toolbar.append(this.less, this.percent, this.more, this.fit);
            if (pageJump) {
                const form = document.createElement('form');
                form.className = 'summary-pdf-page-jump';
                this.pageJump = form;
                this.pageInput = document.createElement('input');
                this.pageInput.type = 'number';
                this.pageInput.inputMode = 'numeric';
                this.pageInput.min = '1';
                this.pageInput.step = '1';
                this.pageInput.required = true;
                this.pageInput.setAttribute('aria-label', 'Número de página');
                this.jump = document.createElement('button');
                this.jump.type = 'submit';
                this.jump.textContent = 'Ir';
                this.jump.setAttribute('aria-label', 'Ir a la página');
                form.append(this.pageInput, this.jump);
                form.addEventListener('submit', event => {
                    event.preventDefault();
                    this.goToPage(this.pageInput.valueAsNumber);
                });
                toolbar.append(form);
                this.pagePicker = document.createElement('select');
                this.pagePicker.className = 'summary-pdf-page-picker';
                this.pagePicker.setAttribute('aria-label', 'Ir a una página citada');
                this.pagePicker.addEventListener('change', () => this.goToPage(Number(this.pagePicker.value), true));
                toolbar.append(this.pagePicker);
            }
            toolbar.append(this.counter);
            this.pages = document.createElement('div');
            this.pages.className = 'summary-pdf-scroll';
            this.pages.tabIndex = 0;
            this.pages.setAttribute('role', 'region');
            this.pages.setAttribute('aria-label', `Páginas del ${this.label}. Desliza para leer.`);
            this.host.replaceChildren(this.pages);
            (toolbarHost || this.host).prepend(toolbar);
            const resumeScrolling = () => { this.focusedPage = null; };
            this.pages.addEventListener('wheel', resumeScrolling, { passive: true });
            this.pages.addEventListener('pointerdown', resumeScrolling, { passive: true });
            this.pages.addEventListener('keydown', event => {
                if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) resumeScrolling();
            });
            this.pages.addEventListener('scroll', () => {
                if (!this.scrollFrame) this.scrollFrame = requestAnimationFrame(() => {
                    this.scrollFrame = null;
                    this.updateCurrentPage();
                    this.releaseDistantPages();
                });
            }, { passive: true });
            this.resizeObserver = new ResizeObserver(() => {
                if (this.pdf && this.pages.clientWidth > 0 && Math.abs(this.pages.clientWidth - this.lastWidth) > 2) {
                    clearTimeout(this.resizeTimer);
                    this.resizeTimer = setTimeout(() => this.layout(), 120);
                }
            });
            this.resizeObserver.observe(this.pages);
            this.updateControls();
        }

        async open(url, { headers, rangeOnly = false, initialPage = 1, citations = null } = {}) {
            this.destroy();
            const revision = this.revision;
            this.host.hidden = false;
            this.setReading(citations);
            const pdfjs = await loadLibrary();
            if (revision !== this.revision) return;
            this.loading = pdfjs.getDocument({
                ...pdfOptions,
                url,
                httpHeaders: headers,
                disableStream: rangeOnly,
                disableAutoFetch: rangeOnly,
                rangeChunkSize: rangeOnly ? 256 * 1024 : undefined,
            });
            const pdf = await this.loading.promise;
            if (revision !== this.revision) return;
            this.pdf = pdf;
            const first = await pdf.getPage(initialPage);
            if (revision !== this.revision) return;
            this.pageSize = first.getViewport({ scale: 1 });
            this.zoom = 1;
            this.currentPage = initialPage;
            this.layout();
            await this.renderPage(initialPage, this.revision);
        }

        async openBook(book, cover, initialPage = cover?.page ?? 1, citations = null) {
            this.destroy();
            const revision = this.revision;
            this.host.hidden = false;
            this.setReading(citations);
            this.pdf = this.book = segmentedDocument(book);
            this.cover = cover;
            const first = cover ? null : await this.pdf.getPage(initialPage);
            if (revision !== this.revision) return;
            this.pageSize = cover || first.getViewport({ scale: 1 });
            this.currentPage = initialPage;
            this.layout();
            await this.renderPage(initialPage, this.revision);
        }

        setReading(citations, page) {
            const previous = this.selection;
            const samePages = previous === citations || Boolean(previous && citations &&
                previous.length === citations.length && citations.every((ref, i) =>
                    ref.page === previous[i].page && ref.printed === previous[i].printed));
            this.selection = citations;
            this.setHighlights(citations || []);
            if (!this.pdf) return;
            if (samePages) {
                if (page) this.goToPage(page, true);
                return;
            }
            this.currentPage = page ?? citations?.[0]?.page ?? this.currentPage;
            this.layout();
        }

        setHighlights(citations) {
            for (const entry of this.highlightedEntries) entry.el.querySelector('.summary-pdf-highlights')?.remove();
            this.highlightedEntries.clear();
            this.highlights = new Map(citations.filter(ref => ref.marks?.length).map(ref => [ref.page, ref.marks]));
            for (const number of this.highlights.keys()) {
                const entry = this.entriesByPage.get(number);
                if (entry?.canvas) this.paintHighlights(entry);
            }
        }

        paintHighlights(entry) {
            const marks = this.highlights.get(entry.number);
            if (!marks) return;
            const overlay = document.createElement('div');
            overlay.className = 'summary-pdf-highlights';
            overlay.setAttribute('aria-hidden', 'true');
            for (const [x, y, width, height] of marks) {
                const mark = document.createElement('span');
                mark.style.left = x * 100 + '%';
                mark.style.top = y * 100 + '%';
                mark.style.width = width * 100 + '%';
                mark.style.height = height * 100 + '%';
                overlay.append(mark);
            }
            entry.el.append(overlay);
            this.highlightedEntries.add(entry);
        }

        goToPage(number, focus = false) {
            const page = this.entriesByPage.get(number);
            if (!page) return;
            this.focusedPage = focus && this.selection ? number : null;
            this.positionPage(page, focus);
            this.currentPage = page.number;
            this.updateControls();
        }

        positionPage(page, focus) {
            const box = page.el.getBoundingClientRect();
            const view = this.pages.getBoundingClientRect();
            const mark = focus && this.highlights.get(page.number)?.[0];
            const context = Math.min(200, this.pages.clientHeight * .27);
            const offset = mark ? Math.max(0, mark[1] * box.height - context) : 0;
            this.pages.scrollTop += box.top - view.top - 12 + offset;
            if (mark && box.width > this.pages.clientWidth) {
                const left = box.left + mark[0] * box.width;
                const right = left + mark[2] * box.width;
                if (left < view.left || right > view.right) {
                    this.pages.scrollLeft += left - view.left - this.pages.clientWidth * .25;
                }
            }
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
            this.entriesByPage.clear();
            const usePicker = this.pagePicker && SummaryPdfReader.usesPagePicker(this.selection);
            const pageOptions = usePicker ? document.createDocumentFragment() : null;
            const fragment = document.createDocumentFragment();
            const count = this.selection?.length ?? this.pdf.numPages;
            for (let index = 0; index < count; index++) {
                const ref = this.selection?.[index];
                const number = ref?.page ?? index + 1;
                const label = ref ? (ref.printed ? `Página ${ref.printed}` : `Página PDF ${number}`) : `Página ${number}`;
                const el = document.createElement('section');
                el.className = 'summary-pdf-page';
                el.dataset.page = String(number);
                el.setAttribute('aria-label', ref ? label : `${label} de ${count}`);
                el.style.width = this.pageWidth + 'px'; el.style.height = height + 'px';
                const placeholder = document.createElement('span');
                placeholder.className = 'summary-pdf-placeholder';
                placeholder.textContent = label;
                el.append(placeholder);
                fragment.append(el);
                const entry = { el, placeholder, number, label, index };
                this.entries.push(entry);
                this.entriesByPage.set(number, entry);
                if (pageOptions) {
                    const option = document.createElement('option');
                    option.value = number;
                    option.textContent = label;
                    pageOptions.append(option);
                }
            }
            if (this.pagePicker) this.pagePicker.replaceChildren(...(pageOptions ? [pageOptions] : []));
            this.pages.replaceChildren(fragment);
            this.pages.scrollLeft = 0;
            this.goToPage(pageNumber, true);
            this.observer = new IntersectionObserver(records => {
                for (const record of records) {
                    if (record.isIntersecting) this.renderPage(Number(record.target.dataset.page), revision)
                        .catch(() => { /* The page itself exposes a retry button. */ });
                }
            }, { root: this.pages, rootMargin: '200px 0px' });
            this.entries.forEach(entry => this.observer.observe(entry.el));
        }

        async renderPage(number, revision) {
            const entry = this.entriesByPage.get(number);
            if (!entry || revision !== this.revision || entry.canvas || entry.preview) return;
            if (entry.pending) return entry.pending;
            if (number === this.cover?.page && this.zoom === 1) {
                const image = document.createElement('img');
                image.src = this.cover.url;
                image.alt = this.cover.alt;
                image.style.width = '100%';
                image.style.height = '100%';
                image.style.objectFit = 'contain';
                entry.el.replaceChildren(image);
                entry.preview = true;
                return;
            }
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
                canvas.setAttribute('aria-label', `${entry.label} del ${this.label}`);
                const measuredHeight = viewport.height + 'px';
                if (entry.el.style.height !== measuredHeight) {
                    entry.el.style.height = measuredHeight;
                    const target = this.entriesByPage.get(this.focusedPage);
                    if (target) this.positionPage(target, true);
                }
                entry.task = page.render({ canvasContext: canvas.getContext('2d', { alpha: false }), viewport,
                    transform: [density, 0, 0, density, 0, 0] });
                await entry.task.promise;
                if (revision !== this.revision) return;
                entry.page = page; entry.canvas = canvas;
                entry.el.replaceChildren(canvas);
                this.paintHighlights(entry);
                const text = await page.getTextContent().catch(() => null);
                if (!text || revision !== this.revision || entry.canvas !== canvas) return;
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
            const entry = this.entriesByPage.get(this.currentPage);
            if (!this.pdf) this.counter.textContent = '';
            else if (this.selection && entry) {
                const label = entry.label.replace('Página', 'Pág.');
                this.counter.textContent = this.selection.length === 1 ? label
                    : `${label} · ${entry.index + 1} de ${this.selection.length}`;
            } else this.counter.textContent = `${this.currentPage} / ${this.pdf.numPages}`;
            if (this.pageInput) {
                this.pageJump.hidden = Boolean(this.selection);
                this.pageInput.disabled = this.jump.disabled = !this.pdf || this.pageJump.hidden;
                this.pageInput.max = this.pdf?.numPages || 1;
                if (document.activeElement !== this.pageInput) this.pageInput.value = this.pdf ? this.currentPage : '';
                this.pagePicker.hidden = !SummaryPdfReader.usesPagePicker(this.selection);
                if (!this.pagePicker.hidden) this.pagePicker.value = this.currentPage;
            }
        }

        updateCurrentPage() {
            if (!this.entries.length || this.focusedPage !== null) return;
            const top = this.pages.getBoundingClientRect().top + 30;
            let first = 0, last = this.entries.length;
            while (first < last) {
                const mid = Math.floor((first + last) / 2);
                if (this.entries[mid].el.getBoundingClientRect().bottom <= top) first = mid + 1;
                else last = mid;
            }
            const remaining = this.pages.scrollHeight - this.pages.clientHeight;
            const atEnd = this.selection && remaining > 2 && this.pages.scrollTop >= remaining - 2;
            const current = atEnd ? this.entries.at(-1) : this.entries[first];
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
            const current = this.entriesByPage.get(this.currentPage)?.index;
            for (const entry of this.entries) {
                if (entry.canvas && Math.abs(entry.index - current) > 2) {
                    entry.canvas.width = 0; entry.canvas.height = 0;
                    entry.canvas = null;
                    entry.el.replaceChildren(entry.placeholder);
                    this.highlightedEntries.delete(entry);
                    if (entry.page) entry.page.cleanup();
                    entry.page = null;
                }
            }
        }

        cancelRendering() {
            if (this.observer) this.observer.disconnect();
            this.highlightedEntries.clear();
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
            this.book?.destroy();
            this.book = null; this.cover = null;
            this.selection = null;
            this.focusedPage = null;
            this.highlights.clear();
            this.entries = [];
            this.entriesByPage.clear();
            this.pages.replaceChildren();
            this.zoom = 1; this.currentPage = 1;
            this.updateControls();
            if (loading) loading.destroy().catch(() => {});
        }
    }
    window.SummaryPdfReader = SummaryPdfReader;
})();
