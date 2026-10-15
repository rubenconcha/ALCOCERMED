const fs = require('node:fs');
const path = require('node:path');

const premiumFiles = new Set([
  'biologia-capitulo-3', 'biologia-capitulo-4', 'biologia-capitulo-5',
  'educacion-salud-tema-3', 'educacion-salud-tema-4', 'educacion-salud-tema-5',
  'morfofuncion-tema-3', 'morfofuncion-tema-4', 'morfofuncion-tema-5', 'morfofuncion-tema-6',
  'morfofuncion-sangre', 'morfofuncion-sentidos'
]);
const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') return res.status(405).end();
  const file = typeof req.query.file === 'string' ? req.query.file : '';
  if (!premiumFiles.has(file)) return res.status(404).end();
  const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1];
  if (!token) return res.status(401).end();

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/campus_access`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: '{}',
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return res.status(response.status === 401 ? 401 : 503).end();
    const access = await response.json();
    if (!access?.ready || !access.premium) return res.status(403).end();
  } catch (_) {
    return res.status(503).end();
  }

  const location = path.join(process.cwd(), 'api', '_pdf', `${file}.pdf`);
  let stat;
  try { stat = await fs.promises.stat(location); }
  catch (_) { return res.status(404).end(); }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Length', String(stat.size));
  res.setHeader('Content-Disposition', `inline; filename="${file}.pdf"`);
  const stream = fs.createReadStream(location);
  stream.on('error', () => { if (!res.headersSent) res.status(500).end(); else res.destroy(); });
  stream.pipe(res);
};
