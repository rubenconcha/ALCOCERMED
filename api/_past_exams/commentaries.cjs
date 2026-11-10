'use strict';

const comments = require('./commentaries.json');
const anchors = require('./reading-anchors.json');

const books = {
    M: { slug: 'morfofuncion', label: 'Saladin', title: 'Saladin, Anatomía y fisiología. La unidad entre forma y función, 6.ª edición' },
    B: { slug: 'biologia-celular', label: 'Calvo', title: 'Calvo González, Biología celular biomédica' },
    S: { slug: 'educacion-salud', label: 'Educación en Salud', title: 'UMSS, Compendio de Educación en Salud e Investigación' },
};

function formatReference({ book, section, pdf, printed }) {
    return [books[book].title, section, printed ? 'pág. impresa ' + printed : '', 'pág. PDF ' + pdf]
        .filter(Boolean).join(' · ');
}

function withCommentary(question, sourceId = question.id) {
    const comment = comments[sourceId];
    if (!comment) return question;
    const citations = anchors[sourceId];
    return {
        ...question,
        justificacion: comment.text,
        fuente_comentario: comment.references.map(formatReference).join(' / '),
        ...(comment.references.length ? {
            lecturas_comentario: comment.references.map(({ book, section, pdf, printed }) => {
                const { slug, label } = books[book];
                const marks = citations?.[book + pdf];
                return { slug, label, section, page: pdf, printed, ...(marks ? { marks } : {}) };
            }),
        } : {}),
        ...(comment.status === 'd' ? { clave_en_discrepancia: true } : {}),
    };
}

module.exports = withCommentary;
