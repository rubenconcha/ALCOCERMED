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

for (const name of ['normalizeDemoText', 'isDemoEvaluation', 'isLegacyClassEvaluation']) loadFunction(name);

assert.equal(context.isDemoEvaluation({ titulo: 'Tema 12: Población y muestra', tema: 'Población y muestra', codigo: 'SP12P2' }), false);
assert.equal(context.isDemoEvaluation({ titulo: 'Evaluación 1', asignatura: 'Otro' }), true);
assert.equal(context.isDemoEvaluation({ titulo: 'Prueba gratis de Morfofunción' }), true);
assert.equal(context.isDemoEvaluation({ titulo: 'Demo de Biología celular' }), true);
assert.equal(context.isLegacyClassEvaluation({ asignatura: 'Otro', titulo: 'Sistema Óseo' }), true);
assert.equal(context.isLegacyClassEvaluation({ asignatura: 'Anatomía', titulo: 'Examen Tejido Muscular' }), true);
assert.equal(context.isLegacyClassEvaluation({ asignatura: 'Biología Celular', titulo: 'Introducción a la biología celular' }), true);
assert.equal(context.isLegacyClassEvaluation({ asignatura: 'MORFOFUNCION', codigo: 'NEURO26R1' }), true);
assert.equal(context.isLegacyClassEvaluation({ asignatura: 'MORFOFUNCION', codigo: 'SENTIDOS1' }), true);
assert.equal(context.isLegacyClassEvaluation({ asignatura: 'BIOLOGIA CELULAR', tema: 'Capitulo 1: introduccion', titulo: 'Capitulo 1' }), false);
