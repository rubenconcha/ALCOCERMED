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
    const marksByPage = anchors[sourceId] || {};
    const sourcesByPage = new Map(comment.references.map(ref => [ref.book + ref.pdf, ref]));
    const citations = Object.keys(marksByPage).map(key => sourcesByPage.get(key)).filter(Boolean);
    function readings(marks = {}) {
        return Object.entries(marks).flatMap(([key, boxes]) => {
            const ref = sourcesByPage.get(key);
            if (!ref || !boxes.length) return [];
            const { slug, label } = books[ref.book];
            return [{ slug, label, section: ref.section, page: ref.pdf, printed: ref.printed, marks: boxes }];
        });
    }
    return {
        ...question,
        justificacion: comment.text,
        fuente_comentario: citations.map(formatReference).join(' / '),
        lectura_revision: 4,
        ...(citations.length ? { lecturas_comentario: readings(marksByPage) } : {}),
        ...(comment.afirmaciones?.length ? {
            revision_docente: {
                clave: comment.clave,
                afirmaciones: comment.afirmaciones.map(({ estado, comentario }, i) => ({
                    estado, comentario, lecturas: readings(marksByPage.incisos?.[i]),
                })),
            },
        } : {}),
        ...(comment.status === 'd' ? { clave_en_discrepancia: true } : {}),
    };
}

module.exports = withCommentary;
