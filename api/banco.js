'use strict';
const { createHash } = require('node:crypto');
const bank = require('./_banco/curso.json');

const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';
const validId = /^(?:db:[0-9a-f-]+|lib:[a-z0-9:_-]+)$/i;

const rows = new Map(bank.questions.map(row => {
    // Negative IDs keep the reviewed content distinct from rows in banco_preguntas.
    const id = -1 - (createHash('sha256').update(row.content_id).digest().readUInt32BE(0) >>> 1);
    return ['lib:' + id, { ...row, id }];
}));
if (rows.size !== bank.questions.length) throw new Error('Duplicate bank question ID');
const freeRows = new Map([...rows].filter(([, row]) => bank.sample.includes(row.content_id)));

function index(available) {
    const groups = new Map();
    for (const [id, { materia, tema, dificultad }] of available) {
        const groupKey = JSON.stringify([materia, tema, dificultad]);
        if (!groups.has(groupKey)) groups.set(groupKey, { materia, tema, dificultad, ids: [] });
        groups.get(groupKey).ids.push(id);
    }
    return JSON.stringify({ groups: [...groups.values()] });
}

const fullIndex = index(rows);
const freeIndex = index(freeRows);

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).end();
    const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1];
    if (!token) return res.status(401).end();
    const ids = req.body?.ids;
    if (req.method === 'POST' && (!Array.isArray(ids) || !ids.length || ids.length > 50 ||
        ids.some(id => typeof id !== 'string' || id.length > 160 || !validId.test(id)) ||
        new Set(ids).size !== ids.length)) return res.status(400).end();

    const headers = { apikey: anonKey, Authorization: 'Bearer ' + token };
    try {
        const response = await fetch(supabaseUrl + '/rest/v1/rpc/campus_access', {
            method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
            body: '{}', signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) return res.status(response.status === 401 ? 401 : 503).end();
        const access = await response.json();
        if (!access?.ready) return res.status(403).end();
        const premium = access.premium && (!access.expires_at || Date.parse(access.expires_at) > Date.now());
        const available = premium ? rows : freeRows;
        if (req.method === 'POST') {
            if (ids.some(id => !rows.has(id))) return res.status(409).end();
            if (ids.some(id => !available.has(id))) return res.status(403).end();
        }
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(200).end(req.method === 'GET' ? (premium ? fullIndex : freeIndex)
            : JSON.stringify({ questions: ids.map(id => available.get(id)) }));
    } catch (_) {
        return res.status(503).end();
    }
};
