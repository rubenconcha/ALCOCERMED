'use strict';
(() => {
    const summaries = [
        { subject: 'Biología celular', topic: 'Tema 1', title: 'Introducción a la biología de las células', pages: 6, file: 'biologia-tema-1', kind: 'bio' },
        { subject: 'Biología celular', topic: 'Capítulo 2', title: 'Cómo se estudian las células', pages: 7, file: 'biologia-capitulo-2', kind: 'bio' },
        { subject: 'Biología celular', topic: 'Capítulo 3', title: 'Estructura de la membrana plasmática', pages: 6, file: 'biologia-capitulo-3', kind: 'bio' },
        { subject: 'Educación para la Salud', topic: 'Tema 1', title: 'Evolución del concepto de salud', pages: 2, file: 'educacion-salud-tema-1', kind: 'salud' },
        { subject: 'Educación para la Salud', topic: 'Tema 2', title: 'Determinantes de la salud', pages: 2, file: 'educacion-salud-tema-2', kind: 'salud' },
        { subject: 'Educación para la Salud', topic: 'Tema 3', title: 'Salud pública', pages: 1, file: 'educacion-salud-tema-3', kind: 'salud' },
        { subject: 'Morfofunción', topic: 'Tema 1', title: 'Temas principales de anatomía y fisiología', pages: 8, file: 'morfofuncion-tema-1', kind: 'morfo' },
        { subject: 'Morfofunción', topic: 'Tema 2', title: 'La química de la vida', pages: 8, file: 'morfofuncion-tema-2', kind: 'morfo' },
        { subject: 'Morfofunción', topic: 'Tema 3', title: 'Forma y función celulares', pages: 8, file: 'morfofuncion-tema-3', kind: 'morfo' },
        { subject: 'Morfofunción', topic: 'Tema 4', title: 'Genética y función celular', pages: 8, file: 'morfofuncion-tema-4', kind: 'morfo' }
    ];

    const grid = document.getElementById('resumenes-grid');
    if (!grid) return;

    summaries.forEach(item => {
        const article = document.createElement('article');
        article.className = `resumenes-card resumenes-card-${item.kind}`;

        const preview = document.createElement('div');
        preview.className = 'resumenes-card-image';
        const image = document.createElement('img');
        image.src = `/assets/resumenes-portadas/${item.file}.png`;
        image.alt = `Portada del resumen ${item.subject}, ${item.topic}`;
        image.loading = 'lazy';
        preview.append(image);

        const body = document.createElement('div');
        body.className = 'resumenes-card-body';
        const label = document.createElement('span');
        label.textContent = `${item.subject} · ${item.topic}`;
        const title = document.createElement('h3');
        title.textContent = item.title;
        const detail = document.createElement('p');
        detail.textContent = `${item.pages} páginas · PDF ilustrado`;
        const link = document.createElement('a');
        link.href = `/resumenes/${item.file}.pdf`;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Abrir PDF →';
        link.addEventListener('click', event => {
            if (window.CampusAccess && CampusAccess.isFree()) {
                event.preventDefault();
                CampusAccess.unlock();
            }
        });
        body.append(label, title, detail, link);
        article.append(preview, body);
        grid.append(article);
    });
})();
