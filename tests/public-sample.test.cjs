const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
test('sample uses exact production tool markup and shared visual styles', () => {
  const app = read('campus.html'), sample = read('muestra.html');
  const section = app.match(/<section id="study-area"[\s\S]*?<\/section>/)[0];
  assert.ok(sample.includes(section));
  for (const file of ['styles.css', 'student-white.css', 'campus-theme.css']) {
    const asset = app.split('"').find(value => value.startsWith(file + '?v='));
    assert.ok(asset && sample.includes(asset), file);
  }
});
test('public sample contains no auth, database, persistence or ranking code', () => {
  const scripts = read('sample-engine.js') + read('sample-runtime.js');
  assert.doesNotMatch(scripts, /supabase\s*[.(]|localStorage|sessionStorage|fetch\(|XMLHttpRequest|sendBeacon/i);
  const html = read('muestra.html');
  assert.doesNotMatch(html, /src="(?:script|config|device_guard)\.js/);
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'mapas mentales/lacelula.png')));
});
test('the public sample offers flashcards and a map and leaves games for paid plans', () => {
  const html = read('muestra.html');
  assert.match(html, /id="study-area"/);
  assert.match(html, /id="sample-maps"/);
  assert.doesNotMatch(html + read('sample-engine.js') + read('sample-runtime.js'), /startQuiz|startHangman|game-quiz|game-hangman|\/juegos\//);
});

