'use strict';

const comments = require('./commentaries.json');

const books = {
    M: { slug: 'morfofuncion', label: 'Saladin', title: 'Saladin, Anatomía y fisiología. La unidad entre forma y función, 6.ª edición' },
    B: { slug: 'biologia-celular', label: 'Calvo', title: 'Calvo González, Biología celular biomédica' },
    S: { slug: 'educacion-salud', label: 'Educación en Salud', title: 'UMSS, Compendio de Educación en Salud e Investigación' },
};

function formatReference({ book, section, pdf, printed }) {
    return [books[book].title, section, printed ? 'pág. impresa ' + printed : '', 'pág. PDF ' + pdf]
        .filter(Boolean).join(' · ');
}

function withCommentary(question) {
    const comment = comments[question.id];
    if (!comment) return question;
    return {
        ...question,
        justificacion: comment.text,
        fuente_comentario: comment.references.map(formatReference).join(' / '),
        ...(comment.references.length ? {
            lecturas_comentario: comment.references.map(({ book, section, pdf, printed }) => {
                const { slug, label } = books[book];
                return { slug, label, section, page: pdf, printed };
            }),
        } : {}),
        ...(comment.status === 'd' ? { clave_en_discrepancia: true } : {}),
    };
}

module.exports = withCommentary;
