const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const adminHtml = fs.readFileSync('admin.html', 'utf8');
const subscriptions = fs.readFileSync('membership-admin.js', 'utf8');
const adminJs = fs.readFileSync('admin.js', 'utf8');

test('el panel ofrece elegir el correo registrado en lugar de escribirlo', () => {
  assert.match(adminHtml, /<datalist id="registered-emails"><\/datalist>/);
  assert.match(adminHtml, /id="registered-students"/);
  assert.match(adminHtml, /id="registered-students-list"/);
  assert.match(adminHtml, /id="registered-count"/);
  const inputs = adminHtml.match(/<input[^>]*name="email"[^>]*>/g) || [];
  assert.equal(inputs.length, 3);
  for (const input of inputs) {
    assert.match(input, /list="registered-emails"/);
    assert.match(input, /autocomplete="off"/);
  }
});

test('los correos registrados se cargan y se muestran para activar con un toque', () => {
  assert.match(adminJs, /window\.AdminSubscriptions\?\.setRegisteredEmails\?\.\(cachedData\.estudiantes\)/);
  assert.match(subscriptions, /function setRegisteredEmails\(students\)/);
  assert.match(subscriptions, /return \{ load, loadAccessCounts, currentStudents, clear, setRegisteredEmails \}/);
  assert.match(subscriptions, /function fillActivationEmail\(email\)/);
  assert.match(subscriptions, /function renderRegistered\(\)/);
  assert.match(subscriptions, /button\.addEventListener\('click', \(\) => fillActivationEmail\(row\.email\)\)/);
});

test('un correo incompleto se detecta antes de activar y se explica el error', () => {
  assert.match(subscriptions, /function validEmail\(value\)/);
  assert.match(subscriptions, /function emailValidated\(form\)/);
  assert.match(subscriptions, /Debe incluir el dominio completo/);
  assert.match(subscriptions, /!datesInOrder\(form\) \|\| !emailValidated\(form\)/);
  assert.match(subscriptions, /if \(!emailValidated\(removal\)\) return;/);
});

test('si el servidor no encuentra el correo se sugiere el registrado más parecido', () => {
  assert.match(subscriptions, /function closestRegisteredEmail\(typed\)/);
  assert.match(subscriptions, /candidate\.split\('@'\)\[0\] === local/);
  assert.match(subscriptions, /error\?\.code === 'P0002'/);
  assert.match(subscriptions, /form\.elements\.email\.value = suggestion/);
  assert.match(subscriptions, /Colocamos el correo registrado más parecido:/);
});


test('el panel avisa el motivo real si la activación queda bloqueada por nómina o cuenta suspendida', () => {
  const {runInNewContext} = require('node:vm');
  const source = subscriptions.match(/function messageFor\(error, fallback\) \{[\s\S]*?\n  \}/)?.[0];
  assert.ok(source);
  const messageFor = runInNewContext('(' + source + ')');
  for (const text of [
    'Este correo no está en la nómina autorizada. No se guardó la suscripción.',
    'Las fechas elegidas exceden la vigencia autorizada en la nómina. No se guardó la suscripción.',
    'Esta cuenta está suspendida. No se guardó la suscripción.',
  ]) {
    assert.equal(messageFor({code:'22023',message:text},'Falló'),text);
  }
  assert.match(subscriptions, /messageFor\(error, 'No pudimos guardar el cambio\. Vuelve a intentarlo\.'\), 'error'\)/);
});

test('el panel separa los accesos vigentes de todas las cuentas registradas', () => {
  assert.match(adminHtml, /<option value="active" selected>Estudiantes vigentes<\/option>/);
  assert.match(subscriptions, /rpc\('campus_admin_access_counts'\)/);
  assert.match(subscriptions, /counts\.active_students/);
  assert.match(subscriptions, /Sin incluir personal ni accesos históricos/);
  assert.match(subscriptions, /blocked: \['Sin acceso efectivo'/);
  assert.doesNotMatch(adminJs, /setText\('dash-total-users', users\.length\)/);
});

test('las vistas de gestión omiten historial sin quitar la búsqueda para activar', () => {
  const {runInNewContext} = require('node:vm');
  const statusSource = subscriptions.match(/const manageableStatuses = [^;]+;/)?.[0];
  const statuses = runInNewContext(statusSource + ' manageableStatuses;');
  assert.equal(statuses.has('active'), true);
  assert.equal(statuses.has('scheduled'), true);
  assert.equal(statuses.has('expired'), false);
  assert.equal(statuses.has('cancelled'), false);
  assert.match(subscriptions, /subscriptions\.filter\(row => manageableStatuses\.has\(row\.status\)\)/);
  assert.match(subscriptions, /row\.scope === 'full' && row\.status === 'active'/);
  assert.match(adminJs, /access\.emails\.has\(/);
  assert.doesNotMatch(adminHtml, /<option value="(?:expired|cancelled)">/);
  assert.match(adminHtml, /Buscar correo para activar/);
});
