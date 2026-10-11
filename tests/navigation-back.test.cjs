const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

test('salir de una partida cancela la sesión y no permite recuperarla con Adelante', () => {
  const source = fs.readFileSync('juegos/app.js', 'utf8');
  const start = source.indexOf('function navigateTo(page, skipPush, replaceCurrent)');
  const end = source.indexOf('window.navigateTo = navigateTo;', start);
  assert.ok(start >= 0 && end > start);
  const calls = [];
  const emptyClassList = { remove() {}, add() {} };
  const context = {
    window: {
      addEventListener() {},
      history: {
        pushState: (...args) => calls.push(['push', ...args]),
        replaceState: (...args) => calls.push(['replace', ...args])
      },
      location: { pathname: '/juegos/quiz' }
    },
    document: {
      querySelectorAll: () => [],
      querySelector: () => null,
      getElementById: () => ({ classList: emptyClassList, remove() {} })
    },
    currentPage: 'quiz', quizData: { evaluacion: {} }, quizTimerInterval: null,
    splashInterval: null, powerupCloseTimeout: null, isAdmin: false,
    clearSelfSession: () => calls.push(['cancel']),
    stopGameMusic: () => calls.push(['stopMusic']),
    setQuizFocusMode: () => {}, closeSidebar: () => {},
    loadExploreSubjects: () => calls.push(['subjects']),
    loadTopEstudiantes: () => {}, loadStudentResults: () => {}, loadRankingGeneral: () => {}
  };
  vm.runInNewContext(source.slice(start, end + 'window.navigateTo = navigateTo;'.length), context);
  context.navigateTo('jugar', false, true);
  assert.ok(calls.some(call => call[0] === 'cancel'));
  assert.equal(context.quizData, null);
  assert.ok(calls.some(call => call[0] === 'replace' && call[3] === '/juegos/jugar'));
  calls.length = 0;
  context.navigateTo('quiz', true);
  assert.equal(context.currentPage, 'jugar');
  assert.ok(calls.some(call => call[0] === 'replace' && call[3] === '/juegos/jugar'));
});

test('los botones Volver del campus regresan por el recorrido y Volver al inicio reinicia la ruta', () => {
  const source = fs.readFileSync('script.js', 'utf8');
  const start = source.indexOf("let currentCampusScreen = 'home-screen';");
  const end = source.indexOf('function updateHomeStats()', start);
  assert.ok(start >= 0 && end > start);
  const visible = new Set(['home-screen']);
  const ids = ['home-screen', 'resource-browser', 'game-quiz'];
  const elements = Object.fromEntries(ids.map(id => [id, {
    classList: {
      add: () => visible.delete(id),
      remove: () => visible.add(id)
    }
  }]));
  const context = {
    window: { scrollTo() {}, innerWidth: 1200 },
    document: { getElementById: id => elements[id] || null },
    closeMobileSidebar() {}, quizTimer: null, flashcardReviewTimer: null, bancoState: null,
    updateHomeStats() {}, confirm: () => true
  };
  vm.runInNewContext(source.slice(start, end), context);
  context.showScreen('resource-browser');
  context.showScreen('game-quiz');
  context.window.goBack();
  assert.ok(visible.has('resource-browser'));
  context.window.goBack();
  assert.ok(visible.has('home-screen'));
  context.showScreen('resource-browser');
  context.window.goHome();
  context.window.goBack();
  assert.ok(visible.has('home-screen'));
});
