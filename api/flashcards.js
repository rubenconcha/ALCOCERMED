const fs = require('node:fs');
const path = require('node:path');
const supabaseUrl = 'https://asnwhddmurstzmghuyin.supabase.co';
const { SUPABASE_ANON_KEY: configuredKey } = process.env;
// Public key, shared with the browser configuration. Membership is checked by the RPC.
const anonKey = configuredKey || require('./_flashcards/config.json').anonKey;
let libraryRequest;

function loadLibrary() {
    libraryRequest ||= fs.promises.readFile(path.join(__dirname, '_flashcards', 'library.json'), 'utf8')
        .then(JSON.parse)
        .catch(error => { libraryRequest = null; throw error; });
    return libraryRequest;
}

module.exports = async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Robots-Tag', 'noindex');
    if (req.method !== 'GET') return res.status(405).end();
    const { materia, tema } = req.query || {};
    const scoped = materia !== undefined || tema !== undefined;
    if (scoped && (typeof materia !== 'string' || typeof tema !== 'string' ||
        !materia.trim() || !tema.trim() || materia.length > 150 || tema.length > 240)) return res.status(400).end();
    const token = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '')?.[1];
    if (!token) return res.status(401).end();
    let access;
    try {
        const response = await fetch(supabaseUrl + '/rest/v1/rpc/campus_access', {
            method: 'POST', headers: { apikey: anonKey, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: '{}', signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) return res.status(response.status === 401 ? 401 : 503).end();
        access = await response.json();
        if (!access?.ready) return res.status(403).end();
    } catch (_) { return res.status(503).end(); }
    try {
        const library = await loadLibrary();
        const premium = Boolean(access.premium);
        const freeCounts = new Map();
        const topicKey = topic => [topic.materia, topic.tema].map(value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()).join('|');
        const key = scoped ? topicKey({ materia, tema }) : null;
        if (!premium) {
            // Preserve the existing free-topic policy; only the educational content changes.
            const policy = await fetch(supabaseUrl + '/rest/v1/rpc/campus_catalog', {
                method: 'POST', headers: { apikey: anonKey, Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: '{}', signal: AbortSignal.timeout(8000)
            });
            if (!policy.ok) return res.status(503).end();
            for (const topic of await policy.json()) freeCounts.set(topicKey(topic), Math.max(0, Math.floor(Number(topic.free_count) || 0)));
        }
        const used = new Map();
        const candidates = key ? library.cards.filter(card => topicKey(card) === key) : library.cards;
        const cards = premium ? candidates : candidates.filter(card => {
            const group = topicKey(card), count = used.get(group) || 0;
            used.set(group, count + 1);
            return count < (freeCounts.get(group) || 0);
        });
        const catalog = library.catalog.filter(topic => (!key || topicKey(topic) === key) &&
            (premium || freeCounts.get(topicKey(topic)) > 0)).map(topic => {
            const free_count = Math.min(topic.count, freeCounts.get(topicKey(topic)) || 0);
            return { ...topic, free_count, locked: !premium && !free_count };
        });
        return res.status(200).json({ schema: library.schema, version: library.version, cards, catalog });
    } catch (_) { return res.status(503).end(); }
};
