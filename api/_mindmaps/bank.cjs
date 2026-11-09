'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');

const sources = [
    ['morfo_18_sangre__07', 'sangre', 18],
    ['morfo_16_organos_sentidos__07', 'organos de los sentidos', 16],
    ['morfo_16_organos_sentidos__08', 'organos de los sentidos', 16],
    ['morfo_18_sangre__08', 'sangre', 18],
    ['morfo_16_organos_sentidos__09', 'organos de los sentidos', 16],
    ['morfo_16_organos_sentidos__10', 'organos de los sentidos', 16],
    ['morfo_16_organos_sentidos__11', 'organos de los sentidos', 16],
    ['morfo_18_sangre__09', 'sangre', 18],
    ['morfo_18_sangre__10', 'sangre', 18],
    ['morfo_18_sangre__11', 'sangre', 18],
    ['morfo_18_sangre__12', 'sangre', 18],
    ['morfo_18_sangre__13', 'sangre', 18],
    ['morfo_18_sangre__14', 'sangre', 18],
    ['morfo_18_sangre__15', 'sangre', 18],
];

function identity(text) {
    let hash = 2166136261;
    for (const char of text) {
        hash ^= char.codePointAt(0);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
}

async function readQuestions([id, topic, chapter]) {
    const payload = JSON.parse(await fs.readFile(path.join(__dirname, id + '.json'), 'utf8'));
    const practice = payload.assets?.practice;
    if (payload.id !== id || !Array.isArray(practice?.questions)) throw new Error('Invalid bank source');
    if (practice.supplementary_reference) return [];
    const reference = 'Saladin, Anatomía y fisiología · capítulo ' + chapter;
    return practice.questions.map(q => ({
        MATERIA: 'MORFOFUNCION',
        TEMA: topic,
        PREGUNTA: q.question,
        RESPUESTA_CORRECTA: 'ABCD'[q.correct],
        EXPLICACION: q.reasons.map((reason, i) => 'ABCD'[i] + '. ' + reason).join('\n\n'),
        DIFICULTAD: 'medio',
        FUENTE: reference,
        PAGINAS_PDF: q.pdf_pages.join(', '),
        content_id: 'depth:' + id + ':q:' + identity(q.question),
        OPCION_A: q.options[0],
        OPCION_B: q.options[1],
        OPCION_C: q.options[2],
        OPCION_D: q.options[3],
    }));
}

let bank;
module.exports = function bankSupplement() {
    if (!bank) bank = Promise.all(sources.map(readQuestions))
        .then(packs => JSON.stringify(packs.flat()))
        .catch(error => { bank = null; throw error; });
    return bank;
};
