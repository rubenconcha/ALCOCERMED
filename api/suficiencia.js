const fs = require('node:fs');
const path = require('node:path');
const { validate, officialCollection, biomedicalCollection, isBiomedical } = require('../suficiencia-core.js');
const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

const banks = new Map();
let studyBank;
function loadBank(collection) {
    if (!banks.has(collection)) {
        const medical = collection === biomedicalCollection;
        const request = fs.promises.readFile(path.join(__dirname, '_sufficiency', medical ? 'medicina-oficial.json' : 'bank.json'), 'utf8')
            .then(contents => {
                const bank = JSON.parse(contents);
                if (collection === officialCollection) bank.questions.push(...require('./_sufficiency/umsa-2026.cjs'));
                if (medical) bank.questions.push(
                    ...require('./_sufficiency/articulaciones-examen.json'),
                    ...require('./_sufficiency/medicina-preguntas-por-tema.json'),
                );
                if (medical ? bank.collection !== biomedicalCollection || !bank.questions?.length || !bank.questions.every(isBiomedical) : !validate(bank)) {
                    throw new Error('Invalid question bank');
                }
                return bank;
            }).catch(error => { banks.delete(collection); throw error; });
        banks.set(collection, request);
    }
    return banks.get(collection);
}

function studyResources() {
    if (!studyBank) studyBank = Promise.all([loadBank(officialCollection), loadBank(biomedicalCollection)])
        .then(([official, medical]) => {
            const questions = official.questions.concat(medical.questions);
            const { version, introPaper, papers, levelPapers, passages } = official;
            const index = {
                view: 'catalogo', version, introPaper, papers, levelPapers,
                passages: passages.map(({ id, title }) => ({ id, title })),
                questions: questions.map(({ id, subject, topic, difficulty, passageId, options, source }) => ({
                    id, subject, topic, difficulty, passageId, optionCount: options.length,
                    source: source.collection ? {
                        collection: source.collection, topicId: source.topicId, chapterNumber: source.chapterNumber,
                    } : undefined,
                })),
            };
            return { catalogue: JSON.stringify(index), questions: new Map(questions.map(q => [q.id, q])), passages, version };
        }).catch(error => { studyBank = null; throw error; });
    return studyBank;
}

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex');
    const view = req.query?.vista;
    const pack = view === 'preguntas';
    if (req.method !== (pack ? 'POST' : 'GET')) { res.setHeader('Allow', pack ? 'POST' : 'GET'); return res.status(405).end(); }
    if (req.query?.invalid) return res.status(404).end();
    const collection = req.query?.collection;
    if (collection !== undefined && collection !== officialCollection && collection !== biomedicalCollection) return res.status(404).end();
    if (view !== undefined && (collection !== officialCollection || !['catalogo', 'preguntas'].includes(view))) return res.status(404).end();
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
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        if (!view) return res.status(200).end(JSON.stringify(await loadBank(collection)));
        const library = await studyResources();
        if (!pack) return res.status(200).end(library.catalogue);
        const ids = req.body?.ids;
        if (!Array.isArray(ids) || !ids.length || ids.length > 1000 || new Set(ids).size !== ids.length ||
            !ids.every(id => library.questions.has(id))) return res.status(400).end();
        const questions = ids.map(id => library.questions.get(id));
        const passageIds = new Set(questions.map(q => q.passageId));
        return res.status(200).end(JSON.stringify({
            version: library.version, questions, passages: library.passages.filter(p => passageIds.has(p.id)),
        }));
    } catch (_) { return res.status(503).end(); }
};
