/* Full-screen map reader. The overlay is visible while loading; the same mark
   is baked into the rendered image and into the downloadable WebP. */
(function () {
    var currentUrl = null;
    var currentObjectUrl = null;
    var previousFocus = null;
    var loadToken = 0;
    var zoom = 1;
    var branchCount = 6;
    var branchOpen = [false, false, false, false, false, false];
    var branchColors = ['#60a92f', '#197ce5', '#8e37b4', '#f58224', '#16a9b8', '#e8495a'];
    function field(row, name) { return row && (row[name] ?? row[name.toUpperCase()]); }
    function labelsFor(map) {
        var file = (field(map, 'url_imagen') || '').split('/').pop();
        return (window.MINDMAP_BRANCH_LABELS && window.MINDMAP_BRANCH_LABELS[file]) || ['Rama 1','Rama 2','Rama 3','Rama 4','Rama 5','Rama 6'];
    }
    function thumbnail(url) {
        var match = /^mapas mentales\/([^/?#]+)\.(?:png|jpe?g|webp)$/i.exec(url || '');
        return match ? 'mapas mentales/thumbs/' + match[1] + '.webp' : url;
    }

    function releaseObjectUrl() {
        if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
    }

    function updateBranchControls() {
        var opened = branchOpen.filter(Boolean).length;
        var count = document.getElementById('mm-branch-count');
        if (count) count.textContent = opened + ' de ' + branchCount + ' ramas abiertas';
        for (var i = 0; i < 6; i++) {
            var open = branchOpen[i];
            var shortcut = document.querySelector('.mm-branch-shortcut[data-branch="' + i + '"]');
            var treeBranch = document.querySelector('.mm-tree-branch[data-branch="' + i + '"]');
            if (shortcut) {
                shortcut.hidden = i >= branchCount;
                shortcut.classList.toggle('is-open', open);
                shortcut.setAttribute('aria-pressed', String(open));
                shortcut.setAttribute('aria-label', (open ? 'Cerrar' : 'Abrir') + ' rama ' + (i + 1));
            }
            if (treeBranch) {
                treeBranch.classList.toggle('is-open', open);
                treeBranch.setAttribute('aria-expanded', String(open));
                treeBranch.setAttribute('aria-label', (open ? 'Cerrar' : 'Abrir') + ' rama ' + (i + 1));
                var symbol = treeBranch.querySelector('.mm-tree-toggle');
                if (symbol) symbol.textContent = open ? '−' : '+';
            }
        }
    }

    function setBranch(index, open) {
        branchOpen[index] = open;
        updateBranchControls();
    }

    function setAllBranches(open) {
        branchOpen = branchOpen.map(function () { return open; });
        updateBranchControls();
    }

    function setZoom(value) {
        zoom = Math.min(2.5, Math.max(.6, Math.round(value * 10) / 10));
        var stage = document.querySelector('.mm-lb-stage');
        var tree = document.getElementById('mm-tree');
        var readout = document.getElementById('mm-zoom-value');
        if (readout) readout.textContent = Math.round(zoom * 100) + '%';
        if (!stage || !tree || !tree.children.length) return;
        var fitWidth = Math.min(stage.clientWidth - 36, (stage.clientHeight - 24) * 1.85);
        tree.style.width = Math.round(fitWidth * zoom) + 'px';
        tree.style.height = Math.round(fitWidth / 1.85 * zoom) + 'px';
        tree.style.setProperty('--mobile-zoom', zoom);
        requestAnimationFrame(function () {
            if (window.matchMedia('(max-width:650px)').matches) {
                stage.scrollLeft = 0;
                stage.scrollTop = 0;
                return;
            }
            stage.scrollLeft = Math.max(0, (stage.scrollWidth - stage.clientWidth) / 2);
            stage.scrollTop = Math.max(0, (stage.scrollHeight - stage.clientHeight) / 2);
        });
    }

    function resetStudyTools() {
        zoom = 1;
        var readout = document.getElementById('mm-zoom-value');
        if (readout) readout.textContent = '100%';
        var tree = document.getElementById('mm-tree');
        if (tree) { tree.style.width = ''; tree.style.height = ''; }
    }

    function prepareStudyTools() {
        var stage = document.querySelector('.mm-lb-stage');
        var tree = document.getElementById('mm-tree');
        if (!stage || !tree) return;
        document.getElementById('mm-zoom-out').addEventListener('click', function () { setZoom(zoom - .2); });
        document.getElementById('mm-zoom-in').addEventListener('click', function () { setZoom(zoom + .2); });
        document.getElementById('mm-zoom-center').addEventListener('click', function () { setZoom(1); });
        document.getElementById('mm-true-fullscreen').addEventListener('click', function () {
            var viewer = document.getElementById('mm-lightbox');
            if (document.fullscreenElement === viewer) document.exitFullscreen();
            else if (viewer && viewer.requestFullscreen) viewer.requestFullscreen().catch(function () {});
        });
        stage.addEventListener('wheel', function (event) {
            if (!event.ctrlKey) return;
            event.preventDefault();
            setZoom(zoom + (event.deltaY < 0 ? .1 : -.1));
        }, { passive: false });
        var pan = null;
        tree.addEventListener('pointerdown', function (event) {
            if (event.button !== 0 || event.target.closest('button')) return;
            pan = { id: event.pointerId, x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop };
            tree.setPointerCapture(event.pointerId);
        });
        tree.addEventListener('pointermove', function (event) {
            if (!pan || event.pointerId !== pan.id) return;
            stage.scrollLeft = pan.left - (event.clientX - pan.x);
            stage.scrollTop = pan.top - (event.clientY - pan.y);
        });
        function endPan(event) { if (pan && event.pointerId === pan.id) pan = null; }
        tree.addEventListener('pointerup', endPan);
        tree.addEventListener('pointercancel', endPan);
        window.addEventListener('resize', function () {
            var viewer = document.getElementById('mm-lightbox');
            if (viewer && !viewer.classList.contains('hidden')) setZoom(zoom);
        });
    }

    function cropImage(image, region, maxWidth) {
        var canvas = document.createElement('canvas');
        var sw = Math.round(image.naturalWidth * region.w);
        var sh = Math.round(image.naturalHeight * region.h);
        canvas.width = Math.min(maxWidth, sw);
        canvas.height = Math.round(canvas.width * sh / sw);
        canvas.getContext('2d').drawImage(image,
            Math.round(image.naturalWidth * region.x), Math.round(image.naturalHeight * region.y), sw, sh,
            0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/webp', .9);
    }

    function buildInteractiveTree(image, map) {
        var tree = document.getElementById('mm-tree');
        if (!tree) return;
        tree.replaceChildren();
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'mm-tree-lines');
        svg.setAttribute('viewBox', '0 0 1000 540');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('aria-hidden', 'true');
        var paths = [
            'M 405 270 C 365 270 375 90 335 90', 'M 595 270 C 635 270 625 90 665 90',
            'M 405 270 C 370 270 370 270 335 270', 'M 595 270 C 630 270 630 270 665 270',
            'M 405 270 C 365 270 375 450 335 450', 'M 595 270 C 635 270 625 450 665 450'
        ];
        paths.slice(0, labelsFor(map).length).forEach(function (pathData, index) {
            var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', branchColors[index]);
            path.setAttribute('stroke-width', '3');
            path.setAttribute('stroke-linecap', 'round');
            svg.appendChild(path);
        });
        tree.appendChild(svg);
        var core = document.createElement('div');
        core.className = 'mm-tree-core';
        var coreTitle = document.createElement('strong');
        coreTitle.className = 'mm-tree-core-title';
        coreTitle.textContent = field(map, 'titulo') || 'Mapa mental';
        var coreImage = document.createElement('img');
        var file = (field(map, 'url_imagen') || '').split('/').pop();
        coreImage.src = cropImage(image, /^morfo_0[12]_/.test(file) ? { x: .42, y: .55, w: .16, h: .27 } : { x: .39, y: .48, w: .22, h: .29 }, 780);
        coreImage.alt = 'Idea central: ' + (field(map, 'titulo') || 'Mapa mental');
        core.appendChild(coreTitle);
        core.appendChild(coreImage);
        tree.appendChild(core);

        var labels = labelsFor(map);
        var sections = [
            { x: 0, y: 0, w: .28, h: .33 }, { x: .72, y: 0, w: .28, h: .33 },
            { x: 0, y: .34, w: .28, h: .32 }, { x: .72, y: .34, w: .28, h: .32 },
            { x: 0, y: .67, w: .28, h: .33 }, { x: .72, y: .67, w: .28, h: .33 }
        ];
        if (file === 'morfo_01_anatomia_y_fisiologia.webp') {
            sections[0] = { x: 0, y: .1, w: .28, h: .3 };
            sections[1] = { x: .57, y: .28, w: .43, h: .13 };
            sections[2] = { x: 0, y: .43, w: .28, h: .23 };
            sections[3] = { x: .68, y: .53, w: .32, h: .13 };
        } else if (file === 'morfo_02_quimica_de_la_vida.webp') {
            sections[1] = { x: .68, y: .04, w: .32, h: .36 };
            sections[3] = { x: .69, y: .45, w: .31, h: .55 };
            sections[4] = { x: .26, y: .72, w: .52, h: .28 };
        } else if (['lacelula.png', 'membranaplasmatica.png', 'nucleocelular.png'].includes(file)) {
            sections[2] = { x: .76, y: .31, w: .24, h: .32 };
            sections[3] = { x: .76, y: .64, w: .24, h: .27 };
            sections[4] = { x: 0, y: .62, w: .25, h: .29 };
            sections[5] = { x: 0, y: .31, w: .25, h: .30 };
        } else if (file === 'organeloscelulares.png') {
            sections[0] = { x: 0, y: .03, w: .24, h: .43 };
            sections[1] = { x: .77, y: .08, w: .23, h: .27 };
            sections[2] = { x: .77, y: .33, w: .23, h: .29 };
            sections[3] = { x: 0, y: .53, w: .25, h: .25 };
            sections[4] = { x: .77, y: .57, w: .23, h: .25 };
            sections[5] = { x: .28, y: .68, w: .44, h: .19 };
        }
        for (var index = 0; index < labels.length; index++) {
            (function (branch) {
                var button = document.createElement('button');
                button.type = 'button';
                button.className = 'mm-tree-branch';
                button.dataset.branch = branch;
                button.style.setProperty('--branch-color', branchColors[branch]);
                button.style.setProperty('--branch-order', branch + 1);
                var preview = document.createElement('span');
                preview.className = 'mm-tree-preview';
                preview.textContent = (branch + 1) + '  ' + labels[branch];
                var openLabel = document.createElement('span');
                openLabel.className = 'mm-tree-open-label';
                openLabel.textContent = labels[branch];
                var detail = document.createElement('img');
                detail.className = 'mm-tree-detail';
                detail.src = cropImage(image, sections[branch], 1150);
                detail.alt = '';
                var symbol = document.createElement('span');
                symbol.className = 'mm-tree-toggle';
                button.appendChild(preview);
                button.appendChild(openLabel);
                button.appendChild(detail);
                button.appendChild(symbol);
                button.addEventListener('click', function () { setBranch(branch, !branchOpen[branch]); });
                tree.appendChild(button);
            })(index);
        }
        updateBranchControls();
    }

    function prepareBranchControls() {
        var shortcuts = document.getElementById('mm-branch-shortcuts');
        if (!shortcuts || shortcuts.children.length) return;
        branchColors.forEach(function (color, index) {
            var shortcut = document.createElement('button');
            shortcut.type = 'button';
            shortcut.className = 'mm-branch-shortcut';
            shortcut.dataset.branch = index;
            shortcut.style.setProperty('--branch-color', color);
            shortcut.textContent = index + 1;
            shortcut.addEventListener('click', function () { setBranch(index, !branchOpen[index]); });
            shortcuts.appendChild(shortcut);
        });
        document.getElementById('mm-branch-all').addEventListener('click', function () { setAllBranches(true); });
        document.getElementById('mm-branch-none').addEventListener('click', function () { setAllBranches(false); });
        prepareStudyTools();
        updateBranchControls();
    }

    function watermarkImage(source) {
        return new Promise(function (resolve, reject) {
            var canvas = document.createElement('canvas');
            canvas.width = source.naturalWidth;
            canvas.height = source.naturalHeight;
            var ctx = canvas.getContext('2d');
            if (!ctx) return reject(new Error('No se pudo preparar la imagen.'));
            ctx.drawImage(source, 0, 0);

            var text = 'PREPA BEN CARSON';
            var size = Math.round(Math.min(canvas.width * 0.085, canvas.height * 0.18));
            ctx.font = '800 ' + size + 'px Arial, sans-serif';
            var width = ctx.measureText(text).width;
            if (width > canvas.width * 0.78) {
                size = Math.round(size * (canvas.width * 0.78 / width));
                ctx.font = '800 ' + size + 'px Arial, sans-serif';
            }
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = '#1c456c';
            ctx.fillText(text, 0, 0);
            ctx.restore();
            canvas.toBlob(function (blob) {
                if (blob) resolve(URL.createObjectURL(blob));
                else reject(new Error('No se pudo preparar la descarga.'));
            }, 'image/webp', 0.95);
        });
    }

    window.openMmLightbox = function (map) {
        if (window.CampusAccess && CampusAccess.isFree() && !field(map, 'acceso_gratis')) return openMmUnlockDialog(map);
        var viewer = document.getElementById('mm-lightbox');
        var image = document.getElementById('mm-lb-img');
        var figure = viewer && viewer.querySelector('.mm-lb-figure');
        var download = document.getElementById('mm-lb-download');
        var status = document.getElementById('mm-lb-status');
        if (!viewer || !image || !figure || !download || !status) return;

        var url = field(map, 'url_imagen') || field(map, 'url_image') || '';
        branchCount = labelsFor(map).length;
        branchOpen = Array(branchCount).fill(false);
        prepareBranchControls();
        setAllBranches(false);
        resetStudyTools();
        var token = ++loadToken;
        releaseObjectUrl();
        currentUrl = url;
        previousFocus = document.activeElement;
        figure.classList.remove('is-watermarked');
        image.dataset.fullUrl = url;
        image.src = thumbnail(url);
        var tree = document.getElementById('mm-tree');
        if (tree) tree.replaceChildren();
        image.alt = 'Mapa mental: ' + (field(map, 'titulo') || 'sin título');
        status.textContent = 'Preparando mapa…';
        download.disabled = true;
        download.dataset.filename = (url.split('/').pop() || 'mapa').replace(/\.[^.]+$/, '') + '-prepa-ben-carson.webp';
        document.getElementById('mm-lb-title').textContent = field(map, 'titulo') || 'Mapa mental';
        document.getElementById('mm-lb-materia').textContent = (field(map, 'materia') || '').toLowerCase();
        viewer.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        viewer.querySelector('.mm-lb-close').focus();

        var source = new Image();
        source.crossOrigin = 'anonymous';
        source.decoding = 'async';
        source.onload = function () {
            if (token !== loadToken || currentUrl !== url) return;
            try {
                var sampleCanvas = document.createElement('canvas');
                sampleCanvas.width = sampleCanvas.height = 1;
                var sampleContext = sampleCanvas.getContext('2d');
                sampleContext.drawImage(source, source.naturalWidth * .51, source.naturalHeight * .04, 1, 1, 0, 0, 1, 1);
                var paper = sampleContext.getImageData(0, 0, 1, 1).data;
                figure.style.setProperty('--map-paper', 'rgb(' + paper[0] + ',' + paper[1] + ',' + paper[2] + ')');
            } catch (_) { figure.style.setProperty('--map-paper', '#f5fbfc'); }
            watermarkImage(source).then(function (objectUrl) {
                if (token !== loadToken || currentUrl !== url) { URL.revokeObjectURL(objectUrl); return; }
                currentObjectUrl = objectUrl;
                image.onload = function () {
                    if (token !== loadToken) return;
                    figure.classList.add('is-watermarked');
                    status.textContent = '';
                    download.disabled = false;
                    buildInteractiveTree(image, map);
                    setZoom(1);
                };
                image.src = objectUrl;
            }).catch(function () {
                if (token !== loadToken) return;
                image.src = url;
                status.textContent = 'No se pudo preparar la descarga de este mapa.';
            });
        };
        source.onerror = function () {
            if (token === loadToken) status.textContent = 'No se pudo cargar el mapa.';
        };
        source.src = url;
    };

    window.closeMmLightbox = function (event) {
        var viewer = document.getElementById('mm-lightbox');
        if (!viewer) return;
        if (event && event.target !== viewer && !event.target.classList.contains('mm-lb-stage')) return;
        ++loadToken;
        viewer.classList.add('hidden');
        if (document.fullscreenElement === viewer) document.exitFullscreen().catch(function () {});
        document.body.style.overflow = '';
        document.getElementById('mm-lb-img').src = '';
        var tree = document.getElementById('mm-tree');
        if (tree) tree.replaceChildren();
        currentUrl = null;
        releaseObjectUrl();
        if (previousFocus && previousFocus.focus) previousFocus.focus();
    };

    document.addEventListener('DOMContentLoaded', function () {
        var download = document.getElementById('mm-lb-download');
        if (download) download.addEventListener('click', function () {
            if (!currentObjectUrl) return;
            var link = document.createElement('a');
            link.href = currentObjectUrl;
            link.download = download.dataset.filename || 'mapa-prepa-ben-carson.webp';
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
        document.addEventListener('keydown', function (event) {
            var viewer = document.getElementById('mm-lightbox');
            if (event.key === 'Escape' && viewer && !viewer.classList.contains('hidden')) closeMmLightbox();
            if (viewer && !viewer.classList.contains('hidden') && /^[1-6]$/.test(event.key) && Number(event.key) <= branchCount && !event.altKey && !event.ctrlKey && !event.metaKey) {
                var index = Number(event.key) - 1;
                setBranch(index, !branchOpen[index]);
            }
        });
    });
})();
