const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('juegos/app.js', 'utf8');
const context = vm.createContext({});

function loadFunction(name) {
  const start = source.indexOf('function ' + name + '(');
  assert.ok(start >= 0, `No se encontró ${name}`);
  const end = source.indexOf('\n}', start) + 2;
  vm.runInContext(source.slice(start, end), context);
}

for (const name of ['normalizeDemoText', 'isDemoEvaluation', 'resolveEvaluationSubject', 'subjectMatch', 'sortSubjectEvaluations']) loadFunction(name);

assert.equal(context.isDemoEvaluation({ titulo: 'Tema 12: Población y muestra', tema: 'Población y muestra', codigo: 'SP12P2' }), false);
assert.equal(context.isDemoEvaluation({ titulo: 'Evaluación 1', asignatura: 'Otro' }), true);
assert.equal(context.isDemoEvaluation({ titulo: 'Prueba gratis de Morfofunción' }), true);
assert.equal(context.isDemoEvaluation({ titulo: 'Demo de Biología celular' }), true);
for (const code of ['DEMOMORFO26', 'DEMOBIO26', 'DEMOSALUD26']) {
  assert.equal(context.isDemoEvaluation({ titulo: 'Demo: materia', codigo: code }), true);
}
assert.equal(context.isDemoEvaluation({ codigo: 'SENTIDOS1' }), true);
assert.equal(context.isDemoEvaluation({ codigo: 'SENTIDOS2' }), true);
assert.equal(context.subjectMatch({ asignatura: 'Otro', titulo: 'Sistema Óseo' }, 'MORFOFUNCION'), true);
assert.equal(context.subjectMatch({ asignatura: 'Anatomía', titulo: 'Examen Tejido Muscular' }, 'MORFOFUNCION'), true);
assert.equal(context.subjectMatch({ asignatura: 'Biología Celular', titulo: 'Introducción a la biología celular' }, 'BIOLOGIA CELULAR'), true);
assert.equal(context.subjectMatch({ asignatura: 'BIOLOGIA CELULAR', tema: 'Capitulo 1: introduccion', titulo: 'Capitulo 1' }, 'BIOLOGIA CELULAR'), true);
const morfoGames = [
  { codigo: 'SENTIDOS1', titulo: 'Sentidos', created_at: '2026-01-02' },
  { codigo: 'DEMOMORFO26', titulo: 'Demo oficial', created_at: '2026-01-01' },
  { codigo: 'MORFO20', titulo: 'Juego de pago', created_at: '2026-01-03' }
];
context.sortSubjectEvaluations(morfoGames, 'MORFOFUNCION');
assert.equal(morfoGames[0].codigo, 'DEMOMORFO26');
