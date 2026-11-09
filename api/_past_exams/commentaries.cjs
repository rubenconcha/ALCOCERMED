'use strict';

const comments = require('./commentaries.json');

const books = {
    M: 'Saladin, Anatomía y fisiología. La unidad entre forma y función, 6.ª edición',
    B: 'Calvo González, Biología celular biomédica',
    S: 'UMSS, Compendio de Educación en Salud e Investigación',
};

function formatReference({ book, section, pdf, printed }) {
    return [books[book], section, printed ? 'pág. impresa ' + printed : '', 'pág. PDF ' + pdf]
        .filter(Boolean).join(' · ');
}

function withCommentary(question) {
    const comment = comments[question.id];
    if (!comment) return question;
    return {
        ...question,
        justificacion: comment.text,
        fuente_comentario: comment.references.map(formatReference).join(' / '),
        ...(comment.status === 'd' ? { clave_en_discrepancia: true } : {}),
    };
}

module.exports = withCommentary;
