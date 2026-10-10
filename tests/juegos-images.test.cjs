const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'juegos/app.js'), 'utf8');

function declaration(name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  assert(start >= 0, `${name} no existe`);
  const match = /\r?\n}\r?\n/.exec(source.slice(start));
  assert(match, `${name} no termina`);
  return source.slice(start, start + match.index + match[0].length);
}

const mapStart = source.indexOf('var contextualGameImages = {');
const mapMatch = /\r?\n};/.exec(source.slice(mapStart));
assert(mapStart >= 0 && mapMatch);
const mapDeclaration = source.slice(mapStart, mapStart + mapMatch.index + mapMatch[0].length);
const context = { morfoConceptImages: {}, getNervousQuestionIllustration: () => null };
vm.runInNewContext([
  declaration('isGameOverviewImage'),
  mapDeclaration,
  declaration('getQuizQuestionImage'),
].join('\n'), context);

for (const folder of ['biologia-celular-parciales', 'salud-publica-parciales', 'segundo-parcial-morfo']) {
  const generic = `/juegos/assets/${folder}/resumen.svg`;
  const question = { id: 'sin-ilustracion-propia', opciones: [{ pregunta_imagen: generic }] };
  assert.equal(context.getQuizQuestionImage(question, 'mc'), '', `MC debe ocultar ${folder}`);
  assert.equal(context.getQuizQuestionImage(question, 'ms'), '', `MS debe ocultar ${folder}`);
  assert.equal(context.getQuizQuestionImage(question, 'tf'), '', `TF debe ocultar ${folder}`);
  assert.equal(context.getQuizQuestionImage(question, 'dnd'), generic, `DND necesita su mapa de ${folder}`);
}

const bodyOverview = '/juegos/assets/capitulo1-tema1-saladin/cap1_regiones_corporales_anterior.png';
assert.equal(context.getQuizQuestionImage({ id: 'otra', opciones: [{ pregunta_imagen: bodyOverview }] }, 'mc'), '');
assert.equal(
  context.getQuizQuestionImage({ id: '601b9a75-345b-5de9-bd63-00da7fdf67ee', opciones: [{ pregunta_imagen: '/juegos/assets/biologia-celular-parciales/cap01_intro_biologia_celular.svg' }] }, 'mc'),
  '/juegos/assets/preguntas-contextuales/teoria-celular.svg'
);
assert.equal(context.getQuizQuestionImage({ id: 'otra', opciones: [{ pregunta_imagen: '/juegos/assets/sentidos-saladin/ojo-retina.png' }] }, 'mc'), '/juegos/assets/sentidos-saladin/ojo-retina.png');

for (const [id, image] of Object.entries(context.contextualGameImages)) {
  assert.match(id, /^[0-9a-f-]{36}$/);
  assert(fs.existsSync(path.join(root, image.src.replace(/^\//, ''))), `${image.src} falta`);
  assert(image.alt.length > 25, `${id} requiere descripción útil`);
}

console.log(`Juegos: láminas genéricas filtradas, ${Object.keys(context.contextualGameImages).length} ilustraciones contextuales verificadas.`);
