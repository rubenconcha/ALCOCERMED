'use strict';

const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { createHmac, timingSafeEqual } = require('node:crypto');

const subjects = new Set(['morfofuncion', 'biologia-celular', 'educacion-salud']);
const library = 'https://ln3dltv3md2wx5wh.private.blob.vercel-storage.com/umss/curso-basico-2025-2026/';
const campusAccess = 'https://asnwhddmurstzmghuyin.supabase.co/rest/v1/rpc/campus_access';
const anonKey = process.env.SUPABASE_ANON_KEY || require('./_flashcards/config.json').anonKey;
const grantLifetime = 120;

function signature(secret, subject, expires) {
    return createHmac('sha256', secret).update('texto-oficial:' + subject + ':' + expires).digest('base64url');
}

function validDownload(secret, subject, grant) {
    if (!secret || typeof grant !== 'string' || !/^\d{10}\.[\w-]{43}$/.test(grant)) return false;
    const [expires, proof] = grant.split('.');
    return Number(expires) > Math.floor(Date.now() / 1000)
        && timingSafeEqual(Buffer.from(proof), Buffer.from(signature(secret, subject, expires)));
}

async function authorize(header) {
    if (typeof header !== 'string' || !/^Bearer [\w.-]+$/i.test(header)) return 401;
    const access = await fetch(campusAccess, {
        method: 'POST',
        headers: { apikey: anonKey, Authorization: header, 'Content-Type': 'application/json' },
        body: '{}',
        signal: AbortSignal.timeout(8000),
    });
    if (access.status === 401 || access.status === 403) return access.status;
    if (!access.ok) return 503;
    return (await access.json()).ready === true ? 200 : 403;
}

module.exports = async function handler(req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    if (!['GET', 'HEAD', 'POST'].includes(req.method)) {
        res.setHeader('Allow', 'GET, HEAD, POST');
        res.statusCode = 405;
        return res.end();
    }
    const subject = req.query.materia;
    if (!subjects.has(subject)) {
        res.statusCode = 404;
        return res.end();
    }

    const secret = process.env.BLOB_READ_WRITE_TOKEN;
    const download = req.method !== 'POST' && validDownload(secret, subject, req.query.descarga);
    try {
        if (!download) {
            const access = await authorize(req.headers.authorization);
            if (access !== 200) {
                res.statusCode = access;
                return res.end();
            }
        }
    } catch (_) {
        res.statusCode = 503;
        return res.end();
    }
    if (!secret) {
        res.statusCode = 503;
        return res.end();
    }
    if (req.method === 'POST') {
        const expires = Math.floor(Date.now() / 1000) + grantLifetime;
        const grant = expires + '.' + signature(secret, subject, expires);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ grant }));
    }

    const upstream = new URL(subject + '.pdf', library);
    const headers = { Authorization: 'Bearer ' + secret, 'Accept-Encoding': 'identity' };
    const range = req.headers.range;
    if (typeof range === 'string' && /^bytes=(?:\d+-\d*|-\d+)$/.test(range)) headers.Range = range;
    try {
        const pdf = await fetch(upstream, { method: req.method, headers, redirect: 'error', signal: AbortSignal.timeout(45000) });
        if (pdf.status === 416) {
            const size = pdf.headers.get('content-range');
            if (size) res.setHeader('Content-Range', size);
            res.statusCode = 416;
            return res.end();
        }
        if (!pdf.ok || !/^(application\/(pdf|octet-stream))(?:;|$)/i.test(pdf.headers.get('content-type') || '')) {
            await pdf.body?.cancel();
            res.statusCode = 502;
            return res.end();
        }
        res.statusCode = pdf.status;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="UMSS-2025-2026-${subject}.pdf"`);
        for (const header of ['Accept-Ranges', 'Content-Length', 'Content-Range']) {
            const value = pdf.headers.get(header);
            if (value) res.setHeader(header, value);
        }
        if (req.method === 'HEAD') return res.end();
        await pipeline(Readable.fromWeb(pdf.body), res);
    } catch (_) {
        if (res.destroyed) return;
        if (res.headersSent) return res.destroy();
        res.statusCode = 502;
        res.end();
    }
};
