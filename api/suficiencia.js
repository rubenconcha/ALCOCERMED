const fs = require('node:fs');
const path = require('node:path');
const { validate } = require('../suficiencia-core.js');
const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex');
    if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
    if (req.query?.invalid) return res.status(404).end();
    const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1];
    if (!token) return res.status(401).end();
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/campus_access`, {
            method: 'POST', headers: { apikey: anonKey, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: '{}', signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) return res.status(response.status === 401 ? 401 : 503).end();
        const access = await response.json();
        if (!access?.ready || !access.premium || (access.expires_at && Date.parse(access.expires_at) <= Date.now())) return res.status(403).end();
        const bank = JSON.parse(await fs.promises.readFile(path.join(process.cwd(), 'api', '_sufficiency', 'bank.json'), 'utf8'));
        if (!validate(bank)) return res.status(503).end();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(200).end(JSON.stringify(bank));
    } catch (_) { return res.status(503).end(); }
};
