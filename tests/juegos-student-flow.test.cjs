const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'juegos', 'app.js'), 'utf8');
const from = source.indexOf('var SUBJECT_MINI_GAMES =');
const to = source.indexOf('function loadSubjectEvaluations(', from);
assert(from !== -1 && to > from, 'The subject game module exists');

let rendered = '';
const list = {
  get innerHTML() { return rendered; },
  set innerHTML(value) { rendered = value; },
  scrollIntoView() {}
};
const saved = new Map();
const context = vm.createContext({
  document: { getElementById: id => id === 'explorar-eval-list' ? list : null },
  escapeHtml: value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
  isAdmin: false,
  DEMO_ACCESS_ONLY: true,
  currentUser: { id: 'student' },
  isDemoGuestUser: () => false,
  sessionStorage: { setItem: (key, value) => saved.set(key, value) },
  Math
});
vm.runInContext(source.slice(from, to), context);

const subjectStart = source.indexOf('function renderSubjectMissions(');
const subjectEnd = source.indexOf('function loadExploreSubjects(', subjectStart);
assert(subjectStart !== -1 && subjectEnd > subjectStart);
context.SUBJECTS = [
  { name: 'MORFOFUNCION', color: '#EF4444', emoji: 'M' },
  { name: 'BIOLOGIA CELULAR', color: '#3B82F6', emoji: 'BC' },
  { name: 'EDUCACION PARA LA SALUD', color: '#10B981', emoji: 'ES' }
];
vm.runInContext(source.slice(subjectStart, subjectEnd), context);
const grid = { innerHTML: '' };
context.renderSubjectMissions(grid);
assert.equal((grid.innerHTML.match(/class="explorar-subject-card/g) || []).length, 3);
assert.doesNotMatch(grid.innerHTML, /Demo y planes|Juegos de clase|Con plan|fa-lock/i);

for (const subject of ['MORFOFUNCION', 'BIOLOGIA CELULAR', 'EDUCACION PARA LA SALUD']) {
  const freeCards = context.subjectMiniGameCards(subject);
  assert.match(freeCards, /Jugar ahora/);
  assert.match(freeCards, /href="\/planes\?desde=campus#planes"/);
  assert.match(freeCards, /Desbloquear/);
  context.rememberSubjectPlanReturn(subject);
  assert.deepEqual(JSON.parse(saved.get('alcocer_plan_return')), { screen: 'juegos', subject });

  context.startSubjectMiniGame(subject, 'premium');
  assert.equal(context.subjectMiniGameState, null, 'The paid challenge stays locked');

  context.startSubjectMiniGame(subject, 'demo');
  for (let i = 0; i < 5; i++) {
    assert.match(rendered, new RegExp(`${i + 1} \/ 5`));
    const answer = context.subjectMiniGameState;
    const correct = context.SUBJECT_MINI_GAMES[subject].demo[i].correct;
    assert.equal(answer.orders[i].length, 3);
    context.chooseSubjectMiniGameAnswer(correct);
    assert.match(rendered, /¡Correcto!/);
    context.nextSubjectMiniGameQuestion();
  }
  assert.match(rendered, /5 de 5 respuestas correctas/);
  context.subjectMiniGameState = null;
}

context.DEMO_ACCESS_ONLY = false;
assert.doesNotMatch(context.subjectMiniGameCards('MORFOFUNCION'), /href="\/planes\?desde=campus#planes"/);
context.startSubjectMiniGame('MORFOFUNCION', 'premium');
assert.equal(context.subjectMiniGameState.level, 'premium');
console.log('OK: three free subject demos, paid challenges locked/unlocked, quiz completion.');
