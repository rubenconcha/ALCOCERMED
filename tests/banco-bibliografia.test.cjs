const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('el banco bibliográfico cubre las tres materias y conserva cuatro opciones válidas', () => {
  const rows = JSON.parse(fs.readFileSync('content/banco_bibliografia_2026.json', 'utf8'));
  const subjects = new Map();
  const questions = new Set();
  for (const row of rows) {
    if (!subjects.has(row.MATERIA)) subjects.set(row.MATERIA, new Set());
    subjects.get(row.MATERIA).add(row.TEMA);
    const key = `${row.MATERIA}:${row.PREGUNTA.toLowerCase()}`;
    assert.ok(!questions.has(key), `Pregunta duplicada: ${key}`);
    questions.add(key);
    const options = 'ABCD'.split('').map((letter) => row[`OPCION_${letter}`]);
    assert.equal(new Set(options.map((value) => value.toLowerCase())).size, 4, key);
    assert.match(row.RESPUESTA_CORRECTA, /^[A-D]$/);
    assert.ok(row.PREGUNTA && row.EXPLICACION && row.FUENTE && row.PAGINAS_PDF);
    assert.equal(options['ABCD'.indexOf(row.RESPUESTA_CORRECTA)], row.EXPLICACION);
  }
  assert.deepEqual(Object.fromEntries([...subjects].map(([subject, topics]) => [subject, topics.size])), {
    'SALUD PUBLICA': 21,
    'BIOLOGIA CELULAR': 18,
    MORFOFUNCION: 29,
  });
  assert.equal(rows.length, 1375);
});

test('la carga del banco sigue leyendo después de la primera página de Supabase', async () => {
  const script = fs.readFileSync('script.js', 'utf8');
  const start = script.indexOf('let bancoQuestionsPromise = null;');
  const end = script.indexOf('async function preloadAppData()', start);
  assert.ok(start >= 0 && end > start);
  const records = Array.from({ length: 1375 }, (_, i) => ({ id: i + 1 }));
  const ranges = [];
  const context = {
    bancoState: { _cache: [] },
    simState: { _cache: [] },
    getSupabase: () => ({
      from: (table) => {
        assert.equal(table, 'banco_preguntas');
        return {
          select: () => ({
            order: () => ({
              range: async (first, last) => {
                ranges.push([first, last]);
                return { data: records.slice(first, last + 1), error: null };
              },
            }),
          }),
        };
      },
    }),
  };
  vm.runInNewContext(script.slice(start, end) + '\nglobalThis.load = fetchAllBancoQuestions;', context);
  const result = await context.load();
  assert.equal(result.length, 1375);
  assert.deepEqual(ranges, [[0, 499], [500, 999], [1000, 1499]]);
  await context.load();
  assert.equal(ranges.length, 3, 'la segunda lectura reutiliza la caché');
});
