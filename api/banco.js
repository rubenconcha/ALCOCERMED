'use strict';
const loadSupplement = require('./_mindmaps/bank.cjs');
const teaching = require('./_mindmaps/banco-docente.json');
const reviewedQuestions = require('./_mindmaps/verified-bank.cjs');
const { mergeBankRows, keepCourseQuestion, withBankTeaching } = require('../study-depth.js');

const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';
const pageSize = 1000;
const indexFields = 'id,MATERIA,TEMA,DIFICULTAD,PREGUNTA,FUENTE';
const field = (row, name) => row[name] ?? row[name.toUpperCase()];
const databaseKey = row => 'db:' + row.id;
const supplementKey = row => 'lib:' + row.content_id;
const validId = /^(?:db:[0-9a-f-]+|lib:[a-z0-9:_-]+)$/i;

let editorial;
function getEditorial() {
    if (!editorial) {
        editorial = loadSupplement().then(raw => ({ questions: JSON.parse(raw), reviewedQuestions }))
            .catch(error => { editorial = null; throw error; });
    }
    return editorial;
}

async function queryDatabase(headers, filters) {
    const response = await fetch(supabaseUrl + '/rest/v1/banco_preguntas?' + new URLSearchParams(filters), {
        headers, signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Bank request failed');
    return response.json();
}

async function readIndex(headers, bank) {
    const rows = [];
    for (let offset = 0; ; offset += pageSize) {
        const page = await queryDatabase(headers, { select: indexFields, order: 'id.asc', limit: pageSize, offset });
        rows.push(...page);
        if (page.length < pageSize) break;
    }

    const groups = new Map();
    for (const row of mergeBankRows(rows, bank)) {
        const materia = field(row, 'materia');
        if (!materia) continue;
        const tema = field(row, 'tema') || '';
        const dificultad = field(row, 'dificultad') || '';
        const id = row.id == null ? supplementKey(row) : databaseKey(row);
        const groupKey = JSON.stringify([materia, tema, dificultad]);
        if (!groups.has(groupKey)) groups.set(groupKey, { materia, tema, dificultad, ids: [] });
        groups.get(groupKey).ids.push(id);
    }
    return { groups: [...groups.values()] };
}

async function readQuestions(headers, bank, ids) {
    const dbIds = ids.filter(id => id.startsWith('db:')).map(id => id.slice(3));
    const rows = dbIds.length ? await queryDatabase(headers, { select: '*', id: 'in.(' + dbIds.join(',') + ')' }) : [];
    const questions = new Map(rows.filter(keepCourseQuestion).map(row => [databaseKey(row), withBankTeaching(row, teaching)]));
    for (const row of bank.questions) {
        if (keepCourseQuestion(row)) questions.set(supplementKey(row), withBankTeaching(row, teaching));
    }
    for (const row of bank.reviewedQuestions) questions.set(supplementKey(row), row);
    return ids.map(id => questions.get(id)).filter(Boolean);
}

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
        if (!access?.ready || !access.premium || (access.expires_at && Date.parse(access.expires_at) <= Date.now())) {
            return res.status(403).end();
        }

        const bank = await getEditorial();
        const data = req.method === 'GET' ? await readIndex(headers, bank) : { questions: await readQuestions(headers, bank, ids) };
        if (ids && data.questions?.length !== ids.length) return res.status(409).end();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(200).end(JSON.stringify(data));
    } catch (_) {
        return res.status(503).end();
    }
};
