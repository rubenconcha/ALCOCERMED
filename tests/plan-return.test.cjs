const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key)
  };
}

test('al elegir un plan desde mapas se recuerda materia, búsqueda y posición', () => {
  const sessionStorage = storage();
  const elements = {
    'intocables-screen': { classList: { contains: () => false } },
    'mm-search-input': { value: 'mitocondrias' }
  };
  const window = {
    location: { href: '' },
    mmState: { currentTab: 'mapas', selectedMateria: 'Biología Celular' },
    scrollY: 420
  };
  const context = { window, sessionStorage, document: { getElementById: id => elements[id] } };
  vm.runInNewContext(fs.readFileSync('campus-access.js', 'utf8'), context);
  window.CampusAccess.unlock();
  assert.equal(window.location.href, '/planes?desde=campus');
  assert.deepEqual(JSON.parse(sessionStorage.getItem('alcocer_plan_return')), {
    screen: 'mapas', materia: 'Biología Celular', search: 'mitocondrias', scrollY: 420
  });
});

test('el enlace de planes dice volver a mapas mentales cuando corresponde', async () => {
  const sessionStorage = storage({ alcocer_plan_return: JSON.stringify({ screen: 'mapas' }) });
  const backLink = { href: '/', textContent: '', setAttribute(name, value) { this[name] = value; } };
  const context = {
    location: { search: '?desde=campus' },
    window: {},
    document: { documentElement: {}, querySelector: selector => selector === '.back-to-campus' ? backLink : null },
    sessionStorage,
    URLSearchParams
  };
  vm.runInNewContext(fs.readFileSync('sales-session.js', 'utf8'), context);
  assert.equal(backLink.href, '/campus?volver=campus');
  assert.match(backLink.textContent, /Volver a mapas mentales/);
});

test('al volver del pago se recupera el listado filtrado de mapas', async () => {
  const source = fs.readFileSync('script.js', 'utf8');
  const start = source.indexOf('async function restoreCampusAfterPlans()');
  const end = source.indexOf('/** handleLogin */', start);
  assert.ok(start >= 0 && end > start);
  const sessionStorage = storage({ alcocer_plan_return: JSON.stringify({ screen: 'mapas', materia: 'Biología Celular', search: 'mitocondrias', scrollY: 420 }) });
  const calls = [];
  const input = { value: '' };
  const context = {
    window: { location: { search: '?volver=campus', pathname: '/' }, scrollTo: (...args) => calls.push(['scroll', ...args]) },
    sessionStorage,
    document: { title: 'AlcocerMed', getElementById: id => id === 'mm-search-input' ? input : null },
    history: { replaceState: (...args) => calls.push(['replace', ...args]) },
    showScreen: id => calls.push(['screen', id]),
    switchIntocTab: tab => calls.push(['tab', tab]),
    loadMapasMentales: async () => calls.push(['load']),
    selectMmMateria: materia => calls.push(['materia', materia]),
    requestAnimationFrame: callback => callback(),
    URLSearchParams
  };
  await vm.runInNewContext(source.slice(start, end) + '\nrestoreCampusAfterPlans()', context);
  assert.equal(input.value, 'mitocondrias');
  assert.ok(calls.some(call => call[0] === 'screen' && call[1] === 'intocables-screen'));
  assert.ok(calls.some(call => call[0] === 'materia' && call[1] === 'Biología Celular'));
  assert.ok(calls.some(call => call[0] === 'scroll' && call[2] === 420));
  assert.equal(sessionStorage.getItem('alcocer_plan_return'), null);
});
