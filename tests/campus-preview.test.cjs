const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const script = fs.readFileSync('script.js', 'utf8');
const start = script.indexOf('const QUIZ_QUESTIONS = [');
const end = script.indexOf('let quizQuestions = []', start);

test('la práctica gratuita tiene preguntas válidas de las tres materias', () => {
  assert.ok(start >= 0 && end > start);
  const context = {};
  vm.runInNewContext(script.slice(start, end) + '\nglobalThis.preview = freePracticeRows();', context);
  const groups = new Map();
  for (const row of context.preview) {
    groups.set(row.materia, (groups.get(row.materia) || 0) + 1);
    assert.ok(row.pregunta && row.opcion_a && row.opcion_b && row.opcion_c && row.opcion_d);
    assert.match(row.respuesta_correcta, /^[A-D]$/);
  }
  assert.deepEqual([...groups.values()], [3, 3, 3]);
});
