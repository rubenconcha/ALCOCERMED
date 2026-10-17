const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'juegos', 'app.js'), 'utf8');
assert.doesNotMatch(source, /SUBJECT_MINI_GAMES|startSubjectMiniGame|subjectMiniGameCards/);

function functionSource(name, nextName) {
  const start = source.indexOf(`function ${name}(`);
  const end = source.indexOf(`function ${nextName}(`, start);
  assert(start >= 0 && end > start, `${name} exists before ${nextName}`);
  return source.slice(start, end);
}

const nodes = {
  'explorar-subject-grid': { innerHTML: '', style: {} },
  'explorar-back-btn': { style: {} },
  'explorar-eval-list': { innerHTML: '', style: {} }
};
const h1 = { innerHTML: '' };
const saved = new Map();
const subjects = [
  { name: 'MORFOFUNCION', color: '#EF4444', emoji: 'M' },
  { name: 'BIOLOGIA CELULAR', color: '#3B82F6', emoji: 'BC' },
  { name: 'EDUCACION PARA LA SALUD', color: '#10B981', emoji: 'ES' }
];
let rows = [];
const context = vm.createContext({
  document: {
    getElementById: id => nodes[id],
    querySelector: () => h1
  },
  getSupabase: () => ({
    rpc: name => {
      assert.equal(name, 'campus_game_catalog');
      return Promise.resolve({ data: rows, error: null });
    }
  }),
  GameRounds: require('../juegos/game-rounds.js'),
  SUBJECTS: subjects,
  exploreCurrentSubject: null,
  isAdmin: false,
  isLegacyClassEvaluation: () => false,
  subjectMatch: (ev, subject) => ev.asignatura === subject,
  resolveEvaluationSubject: ev => ev.asignatura,
  sortSubjectEvaluations: list => list.sort((a, b) => Number(b.codigo.startsWith('DEMO')) - Number(a.codigo.startsWith('DEMO'))),
  subjectColor: () => '#EF4444',
  subjectEmoji: () => 'M',
  isDemoEvaluation: ev => ev.codigo.startsWith('DEMO'),
  canAccessEvaluation: ev => ev.codigo.startsWith('DEMO'),
  adjustColor: () => '#A00000',
  escapeHtml: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
  sessionStorage: { setItem: (key, value) => saved.set(key, value) },
  clearSelfSession: () => saved.delete('alcocer_quiz_code'),
  navigateTo: (page, skipPush, replaceCurrent) => {
    assert.equal(page, 'jugar');
    assert.equal(skipPush, true);
    assert.equal(replaceCurrent, true);
  },
  Promise
});

vm.runInContext(functionSource('renderSubjectMissions', 'loadExploreSubjects'), context);
vm.runInContext(functionSource('rememberSubjectPlanReturn', 'startSelfStudy'), context);
context.renderSubjectMissions(nodes['explorar-subject-grid']);
assert.equal((nodes['explorar-subject-grid'].innerHTML.match(/class="explorar-subject-card/g) || []).length, 3);

(async () => {
  for (const subject of subjects) {
    rows = [
      { id: 'paid-id', codigo: 'T1', titulo: 'Tema completo', tema: 'Anatomía', asignatura: subject.name },
      { id: 'demo-id', codigo: 'DEMO26', titulo: 'Muestra', tema: 'Primer tema', asignatura: subject.name }
    ];
    context.gameCatalogRows = null;
    context.loadSubjectEvaluations(subject.name);
    await new Promise(resolve => setImmediate(resolve));
    const html = nodes['explorar-eval-list'].innerHTML;
    assert.match(html, /startSelfStudy\('demo-id',1\)/, 'The original quiz engine opens the demo');
    assert.match(html, /JUGAR DEMO/);
    assert.match(html, /Tema completo/);
    assert.match(html, /Desbloquear/);
    assert.match(html, /href="\/planes\?desde=campus#planes"/);
    assert.doesNotMatch(html, /Partida de muestra|Cinco preguntas más|startSubjectMiniGame/);
    context.rememberSubjectPlanReturn(subject.name);
    assert.deepEqual(JSON.parse(saved.get('alcocer_plan_return')), { screen: 'juegos', subject: subject.name });
  }

  rows = [];
  context.gameCatalogRows = null;
  context.loadSubjectEvaluations('MORFOFUNCION');
  await new Promise(resolve => setImmediate(resolve));
  assert.match(nodes['explorar-eval-list'].innerHTML, /Aún no hay partidas publicadas/);
  assert.doesNotMatch(nodes['explorar-eval-list'].innerHTML, /startSelfStudy|Partida de muestra/);
  console.log('OK: three subjects use published evaluations and the original quiz engine; no duplicate mini-game.');
})().catch(err => { console.error(err); process.exitCode = 1; });
