const fs = require('node:fs');
const path = require('node:path');
const { validate } = require('../simulation-scope.js');
const catalog = require('../content/simulacros-catalog.json');
const withGeneralReview = require('./_simulations/general-review.cjs');
const scopes = new Map([['semana2-testb-virtual','semana2-testb-virtual'],['mini-foundations','mini-foundations'],['partial-first','first'],['partial-second','second'],...['9','10'].map(n=>['partial-first-'+n,'first']),...['11','12'].map(n=>['partial-second-'+n,'second']),...['3','4','5','6','8','13','14'].map(n=>['final-'+n,'final'])]);
const week3Id = 'semana3-grupo-virtual-2';
scopes.set(week3Id, week3Id);
const prepa = new Map(catalog.entries.filter(entry => entry.scope === 'prepa').map(entry => [entry.curatedId, entry]));
for (const id of prepa.keys()) scopes.set(id, 'prepa');
const prepaStorage = 'https://ln3dltv3md2wx5wh.private.blob.vercel-storage.com/simulacros/preparatoria-v3/';
const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

async function loadWeek3(headers) {
  const format = catalog.entries.find(entry => entry.curatedId === week3Id);
  const query = new URLSearchParams({
    select: 'numero_pregunta,pregunta,opcion_a,opcion_b,opcion_c,opcion_d,opcion_e,respuesta_correcta,justificacion,dificultad,tema',
    nombre: 'eq.Semana 3 - Grupo Virtual 2',
    order: 'numero_pregunta.asc',
    limit: String(format.questionCount + 1)
  });
  const response = await fetch(`${supabaseUrl}/rest/v1/simulacros?${query}`, { headers, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('No se pudo cargar el simulacro de la semana 3.');
  const rows = await response.json();
  const questions = rows.map(row => {
    const number = row.numero_pregunta;
    const statements = [row.opcion_a, row.opcion_b];
    const negative = number === 32;
    const options = [negative ? '1 es incorrecto' : '1 es correcto', negative ? '2 es incorrecto' : '2 es correcto'];
    if (number <= 30) {
      statements.push(row.opcion_c);
      options.push('3 es correcto', 'Todos son correctos', 'Ninguno es correcto');
    } else {
      options.push(negative ? 'Ambos son incorrectos' : 'Ambos son correctos', negative ? 'Ninguno es incorrecto' : 'Ninguno es correcto');
    }
    const [materia, tema] = row.tema.split(' · ');
    return {
      id: `semana3-virtual-${number}`,
      numero_pregunta: number,
      numero_original: number,
      pregunta: [row.pregunta, ...statements].join('\n'),
      ...Object.fromEntries(options.map((text, i) => ['opcion_' + 'abcde'[i], text])),
      respuesta_correcta: row.respuesta_correcta,
      respuestas_aceptadas: [row.respuesta_correcta],
      justificacion: row.justificacion || `Clave ${row.respuesta_correcta} según el patrón docente.`,
      puntos: 1,
      dificultad: row.dificultad,
      materia,
      tema
    };
  });
  return { id: week3Id, scope: week3Id, title: format.title, duration: format.minutes, total_points: format.questionCount, questions };
}

async function loadPrepa(id) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('Private simulation storage unavailable');
  const response = await fetch(prepaStorage + id + '.json', {
    headers: { Authorization: 'Bearer ' + token },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error('Private simulation unavailable');
  return response.json();
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') return res.status(405).end();
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!scopes.has(id)) return res.status(404).end();
  const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1];
  if (!token) return res.status(401).end();
  const headers = { apikey: anonKey, Authorization: `Bearer ${token}` };
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/campus_access`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: '{}', signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return res.status(response.status === 401 ? 401 : 503).end();
    const access = await response.json();
    if (!access?.ready) return res.status(403).end();
    if (!access.premium) return res.status(403).end();
  } catch (_) { return res.status(503).end(); }
  try {
    const file = path.join(process.cwd(), 'api', '_simulations', id + '.json');
    let paper;
    if (id === week3Id) paper = await loadWeek3(headers);
    else if (prepa.has(id)) paper = await loadPrepa(id);
    else paper = JSON.parse(await fs.promises.readFile(file, 'utf8'));
    if (paper.id !== id || !validate(paper, scopes.get(id), prepa.get(id))) return res.status(503).end();
    if (['first', 'second', 'final'].includes(paper.scope)) {
      paper.questions = paper.questions.map(withGeneralReview);
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.status(200).end(JSON.stringify(paper));
  } catch (_) { return res.status(503).end(); }
};
