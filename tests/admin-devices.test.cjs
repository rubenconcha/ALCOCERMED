const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const adminHtml = fs.readFileSync('admin.html', 'utf8');
const adminJs = fs.readFileSync('admin.js', 'utf8');
const sql = fs.readFileSync('sql/campus_admin_reset_dispositivos_2026.sql', 'utf8');

test('cada estudiante tiene un botón para restaurar su dispositivo', () => {
  assert.match(adminHtml, /admin\.js\?v=9/);
  assert.match(adminJs, /async function restaurarDispositivo\(email\)/);
  assert.match(adminJs, /window\.restaurarDispositivo = restaurarDispositivo/);
  assert.match(adminJs, /onclick="window\.restaurarDispositivo\('\$\{escapeAttr\(u\.email\)\}'\)"/);
});

test('la restauración llama a la función administrativa y avisa si falta el SQL', () => {
  assert.match(adminJs, /rpc\('campus_admin_reset_devices', \{ p_email: studentEmail \}\)/);
  assert.match(adminJs, /PGRST202/);
  assert.match(adminJs, /Falta aplicar el SQL de restauración en Supabase/);
  assert.match(adminJs, /Dispositivo restaurado para /);
});

test('el SQL desactiva el navegador autorizado y devuelve el cambio automático', () => {
  assert.match(sql, /CREATE OR REPLACE FUNCTION public\.campus_admin_reset_devices\(p_email text\)/);
  assert.match(sql, /IF NOT public\.campus_is_admin\(\) THEN/);
  assert.match(sql, /UPDATE public\.device_sessions[\s\S]{0,240}SET is_active = false, auth_session_id = NULL[\s\S]{0,240}WHERE user_id = student_id AND is_active;/);
  assert.match(sql, /DELETE FROM public\.campus_device_changes WHERE user_id = student_id;/);
  assert.match(sql, /GRANT EXECUTE ON FUNCTION public\.campus_admin_reset_devices\(text\) TO authenticated/);
});

test('el SQL incluye la restauración puntual solicitada para Luiztinta99', () => {
  assert.match(sql, /lower\('Luiztinta99@gmail\.com'\)/);
});
