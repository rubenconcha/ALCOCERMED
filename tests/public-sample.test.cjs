const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
test('sample uses exact production tool markup and shared visual styles', () => {
  const app = read('index.html'), sample = read('muestra.html');
  for (const id of ['study-area', 'game-quiz', 'game-hangman']) {
    const section = app.match(new RegExp(`<section id="${id}"[\\s\\S]*?</section>`))[0];
    assert.ok(sample.includes(section), `${id} must match the actual platform`);
  }
  for (const file of ['styles.css?v=20', 'student-white.css?v=2', 'campus-theme.css?v=2']) {
    assert.ok(sample.includes(file)); assert.ok(app.includes(file));
  }
});
test('public sample contains no auth, database, persistence or ranking code', () => {
  const scripts = read('sample-engine.js') + read('sample-runtime.js');
  assert.doesNotMatch(scripts, /supabase\s*[.(]|localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/i);
  const html = read('muestra.html');
  assert.doesNotMatch(html, /src="(?:script|config|device_guard)\.js/);
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'mapas mentales/lacelula.png')));
});
test('sample game engines remain the production engines', () => {
  const source = read('script.js'), sample = read('sample-engine.js');
  const quiz = source.slice(source.indexOf('let quizQuestions = []'), source.indexOf('let hmWord ='));
  const hangman = source.slice(source.indexOf('let hmWord ='), source.indexOf('let _toastTimer ='));
  assert.ok(sample.includes(quiz)); assert.ok(sample.includes(hangman));
});

