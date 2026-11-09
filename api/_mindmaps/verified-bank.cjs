'use strict';

const source = require('./banco-verificado.json');
const letters = 'ABCDE';

module.exports = source.map((entry, index) => {
    const first = index % entry.claims.length;
    const claims = entry.claims.slice(first).concat(entry.claims.slice(0, first));
    const count = claims.filter(claim => claim.correct).length;
    const options = claims.map((_, i) => 'Solo la afirmación ' + (i + 1) + ' es correcta');
    options.push(claims.length === 2 ? 'Ambas afirmaciones son correctas' : 'Todas las afirmaciones son correctas');
    options.push('Ninguna afirmación es correcta');
    const correct = count === 0 ? options.length - 1 : count === claims.length ? options.length - 2
        : count === 1 ? claims.findIndex(claim => claim.correct) : -1;
    if (correct < 0) throw new Error('No valid answer for ' + entry.id);
    return {
        content_id: entry.id,
        materia: entry.materia,
        tema: entry.tema,
        dificultad: 'dificil',
        pregunta: ['Identifica cuáles afirmaciones son correctas.', ...claims.map((claim, i) => (i + 1) + '. ' + claim.text)].join('\n'),
        ...Object.fromEntries(options.map((option, i) => ['opcion_' + letters[i].toLowerCase(), option])),
        respuesta_correcta: letters[correct],
        revision_docente: { afirmaciones: claims.map(claim => ({
            estado: claim.correct ? 'correcta' : 'incorrecta', comentario: claim.reason,
        })) },
        lecturas_comentario: entry.references,
    };
});
