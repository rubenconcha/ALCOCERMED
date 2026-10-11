const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../content/past-exams/catalog.json');
const ids = new Set(catalog.exams.map(exam => exam.id));
const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') return res.status(405).end();
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  if (!ids.has(id)) return res.status(404).end();
  const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1];
  if (!token) return res.status(401).end();
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/campus_access`, {
      method: 'POST', headers: { apikey: anonKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}', signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return res.status(response.status === 401 ? 401 : 503).end();
    const access = await response.json();
    if (!access?.ready) return res.status(403).end();
    if (!access.premium && id !== '2021-1') return res.status(403).end();
  } catch (_) { return res.status(503).end(); }
  const pattern = req.query.pattern === '1';
  const file = path.join(process.cwd(), 'api', '_past_exams', id + (pattern ? '-pattern.webp' : '.json'));
  try {
    const bytes = await fs.promises.readFile(file);
    res.setHeader('Content-Type', pattern ? 'image/webp' : 'application/json; charset=utf-8');
    return res.status(200).end(bytes);
  } catch (_) { return res.status(404).end(); }
};
