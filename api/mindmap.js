const fs = require('node:fs');
const path = require('node:path');
const catalog = require('../content/mindmaps-premium-catalog.json');
const restrictedGeneral = require('../content/mindmaps-restricted-general.json');
const ids = new Set(catalog.concat(restrictedGeneral).map(map => map.id));
const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Robots-Tag', 'noindex');
  if (req.method !== 'GET') return res.status(405).end();
  const id = typeof req.query.id === 'string' ? req.query.id : '';
  const format = req.query.format || 'json';
  if (!ids.has(id) || !['json', 'image'].includes(format)) return res.status(404).end();
  const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1];
  if (!token) return res.status(401).end();
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/campus_access`, {
      method: 'POST', headers: { apikey: anonKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}', signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) return res.status(response.status === 401 ? 401 : 503).end();
    const access = await response.json();
    if (!access?.ready || !access.premium) return res.status(403).end();
  } catch (_) { return res.status(503).end(); }
  const ext = format === 'image' ? 'webp' : 'json';
  const location = path.join(process.cwd(), 'api', '_mindmaps', `${id}.${ext}`);
  let stat;
  try { stat = await fs.promises.stat(location); } catch (_) { return res.status(404).end(); }
  res.setHeader('Content-Type', format === 'image' ? 'image/webp' : 'application/json; charset=utf-8');
  res.setHeader('Content-Length', String(stat.size));
  if (format === 'image') res.setHeader('Content-Disposition', `attachment; filename="${id}-Prepa-Ben-Carson.webp"`);
  const stream = fs.createReadStream(location);
  stream.on('error', () => { if (!res.headersSent) res.status(500).end(); else res.destroy(); });
  stream.pipe(res);
};
