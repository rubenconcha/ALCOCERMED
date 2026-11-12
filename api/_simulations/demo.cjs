'use strict';
const { full } = require('./demo-2026.json');
const { simulation } = require('../../campus-preview-policy.js');
const subjects = ['MORFOFUNCION', 'BIOLOGIA CELULAR', 'SALUD PUBLICA'];
const sample = subjects.flatMap((subject, index) =>
    full.filter(question => question.materia === subject).slice(0, simulation.split[index]));

module.exports = premium => {
    const questions = premium ? full : sample;
    return {
        id: 'demo-2026', scope: 'final', title: premium ? 'Simulacro 7' : simulation.title,
        preview: !premium, duration: premium ? 100 : simulation.minutes,
        total_points: questions.length, questions,
    };
};
