'use strict';

const withPastCommentary = require('../_past_exams/commentaries.cjs');

const books = {
    MORFOFUNCION: { slug: 'morfofuncion', label: 'Saladin', pages: 1251 },
    'BIOLOGIA CELULAR': { slug: 'biologia-celular', label: 'Calvo', pages: 829 },
    'SALUD PUBLICA': { slug: 'educacion-salud', label: 'Educación en Salud', pages: 232 },
};

function pageNumbers(value) {
    if (!/^\d+(?:,\s*\d+)*$/.test(value || '')) return [];
    return value.split(',').map(Number);
}

module.exports = function withGeneralReview(question) {
    // General simulations retain the text, choices and grading key of their
    // archival source. Authored replacements carry their own official citations.
    if (question.source_question_id && !question.justificacion) {
        return withPastCommentary(question, question.source_question_id);
    }
    if (question.lecturas_comentario?.length || question.coverage?.curriculum !== 'official-pdfs-2026-10-19') return question;
    const book = books[question.materia];
    const pages = pageNumbers(question.paginas_pdf);
    if (!book || !pages.length || pages.some(page => page < 1 || page > book.pages)) return question;
    const printed = pageNumbers(question.pagina_impresa);
    const section = question.fuente?.split(' · ').slice(3).join(' · ');
    return {
        ...question,
        lecturas_comentario: pages.map((page, i) => ({
            slug: book.slug,
            label: book.label,
            section,
            page,
            ...(printed.length === pages.length ? { printed: printed[i] } : {}),
        })),
    };
};
