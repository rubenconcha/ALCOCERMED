const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const formatQuizCopy = require('../juegos/quiz-copy.js');
const page = fs.readFileSync(path.join(__dirname, '../juegos/index.html'), 'utf8');
assert(page.indexOf('quiz-copy.js?v=1') > 0 && page.indexOf('quiz-copy.js?v=1') < page.indexOf('app.js?v=95'));

assert.equal(
  formatQuizCopy('Segun el tema 1, la anatomia se ocupa principalmente de:', 'question'),
  '¿De qué se ocupa principalmente la anatomía?'
);
assert.equal(
  formatQuizCopy('En el capitulo 5, Endocitosis se relaciona mejor con:', 'question'),
  '¿Con qué se relaciona mejor endocitosis?'
);
assert.equal(
  formatQuizCopy('En Tema 1: Generalidades, bases normativas y politicas internacionales, identifica el concepto relacionado con: acciones colectivas para proteger la salud poblacional', 'question'),
  '¿Qué concepto se describe aquí: «acciones colectivas para proteger la salud poblacional»?'
);
assert.equal(
  formatQuizCopy('Relaciona los huesos del antebrazo senalados en la imagen.', 'question'),
  'Relaciona los huesos del antebrazo señalados en la imagen.'
);
assert.equal(formatQuizCopy('La funcion experimental de los organos', 'option'), 'La función experimental de los órganos');
assert.equal(formatQuizCopy('Vesalius realizo disecciones y publico ilustraciones anatomicas', 'option'), 'Vesalius realizó disecciones y publicó ilustraciones anatómicas');
assert.equal(formatQuizCopy('Salud publica y politica publica', 'option'), 'Salud pública y política pública');
assert.equal(formatQuizCopy('Segun la escala de pH, una solucion es acida:', 'question'), 'Según la escala de pH, una solución es ácida:');

const imports = fs.readdirSync(path.join(__dirname, '../juegos')).filter((name) => /^SUPABASE_IMPORT.*\.sql$/.test(name));
let checked = 0;
let checkedOptions = 0;
for (const name of imports) {
  const source = fs.readFileSync(path.join(__dirname, '../juegos', name), 'utf8');
  const rows = source.matchAll(/\(\s*'([0-9a-f-]{36})',\s*'([0-9a-f-]{36})',\s*'(?:mc|ms|tf|dnd|open)',\s*'((?:''|[^'])*)'/gi);
  for (const [, id, , raw] of rows) {
    const copy = formatQuizCopy(raw, 'question');
    assert(!/\b(?:capitulo|capítulo)\s*\d+|\b(?:en|del)\s+(?:el\s+)?(?:capitulo|capítulo)|\bsenalad[oa]s?\b|\bEn Tema\s+\d+\b/i.test(copy), `${name} ${id}: ${copy}`);
    checked++;
  }
  for (const [, raw] of source.matchAll(/"text"\s*:\s*"([^"\\]*)"/g)) {
    assert.equal(formatQuizCopy(raw, 'option'), raw, `${name}: opción sin revisar: ${raw}`);
    checkedOptions++;
  }
}
assert(checked > 1000, `solo se revisaron ${checked} preguntas`);
assert(checkedOptions > 5000, `solo se revisaron ${checkedOptions} opciones`);
console.log(`Juegos: referencias y grafías revisadas en ${checked} enunciados y ${checkedOptions} opciones importadas.`);
