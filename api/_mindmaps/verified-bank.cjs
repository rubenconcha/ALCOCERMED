'use strict';

const source = require('./banco-verificado.json');
const letters = 'ABCD';

module.exports = source.map((entry, index) => {
    const correct = index % letters.length;
    const options = entry.distractors.slice();
    options.splice(correct, 0, entry.answer);
    return {
        content_id: entry.id,
        materia: entry.materia,
        tema: entry.tema,
        dificultad: 'dificil',
        pregunta: entry.prompt,
        ...Object.fromEntries(options.map((option, i) => ['opcion_' + letters[i].toLowerCase(), option])),
        respuesta_correcta: letters[correct],
        justificacion: entry.explanation,
        lecturas_comentario: entry.references,
    };
});
