'use strict';
const bank = require('../_banco/curso.json');
const { freeSample } = require('../_past_exams/breakdown.cjs');
const catalog = require('../../content/past-exams/catalog.json');
const commentary = require('../_past_exams/commentaries.cjs');
const demo = require('../_simulations/demo.cjs');
const { evaluationCount } = require('../../campus-preview-policy.js');
const evaluations = [require('../_evaluations/morfo-01.json'), require('../_evaluations/biologia-01.json')];
const slugs = {
    MORFOFUNCION: 'morfofuncion', 'BIOLOGIA CELULAR': 'biologia-celular', 'SALUD PUBLICA': 'educacion-salud',
};
let cached;

async function build() {
    const pages = Object.fromEntries(Object.values(slugs).map(slug => [slug, new Set()]));
    const sampleIds = new Set(bank.sample);
    const past = await freeSample(catalog);
    const questions = [
        ...bank.questions.filter(question => sampleIds.has(question.content_id)),
        ...evaluations.flatMap(exam => exam.questions.slice(0, evaluationCount)),
        ...past.rows.map(row => commentary(row.question)),
    ];
    for (const question of questions) {
        const references = [
            ...(question.lecturas_comentario || []),
            ...(question.revision_docente?.afirmaciones || []).flatMap(item => item.lecturas || []),
        ];
        for (const { slug, page } of references) {
            if (Number.isInteger(page)) pages[slug]?.add(page);
        }
    }
    for (const question of demo(false).questions) {
        const slug = slugs[question.materia];
        for (const value of String(question.paginas_pdf || '').match(/\d+/g) || []) pages[slug]?.add(Number(value));
    }
    return Object.fromEntries(Object.entries(pages).map(([slug, entries]) => [slug, [...entries].sort((a, b) => a - b)]));
}

module.exports = () => cached ||= build().catch(error => { cached = null; throw error; });
