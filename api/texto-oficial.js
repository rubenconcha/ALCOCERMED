'use strict';

const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { createHmac, timingSafeEqual } = require('node:crypto');
const books = require('./_official_texts/segments.json');
const samplePages = require('./_official_texts/sample-pages.cjs');

const subjects = new Set(['morfofuncion', 'biologia-celular', 'educacion-salud']);
const library = 'https://ln3dltv3md2wx5wh.private.blob.vercel-storage.com/umss/curso-basico-2025-2026/';
const campusAccess = 'https://asnwhddmurstzmghuyin.supabase.co/rest/v1/rpc/campus_access';
const anonKey = process.env.SUPABASE_ANON_KEY || require('./_flashcards/config.json').anonKey;
const downloadLifetime = 120;
const readerLifetime = 300;

function signature(secret, subject, expires, reader) {
    const scope = reader ? 'lector-oficial-v2:' : 'texto-oficial-v2:';
    return createHmac('sha256', secret).update(scope + subject + ':' + expires).digest('base64url');
}

function validGrant(secret, subject, grant, reader = false) {
    if (!secret || typeof grant !== 'string' || !/^\d{10}\.[\w-]{43}$/.test(grant)) return false;
    const [expires, proof] = grant.split('.');
    return Number(expires) > Math.floor(Date.now() / 1000)
        && timingSafeEqual(Buffer.from(proof), Buffer.from(signature(secret, subject, expires, reader)));
}

function issueGrant(secret, subject, reader) {
    const expires = Math.floor(Date.now() / 1000) + (reader ? readerLifetime : downloadLifetime);
    return expires + '.' + signature(secret, subject, expires, reader);
}

async function authorize(header) {
    if (typeof header !== 'string' || !/^Bearer [\w.-]+$/i.test(header)) return { status: 401 };
    const access = await fetch(campusAccess, {
        method: 'POST',
        headers: { apikey: anonKey, Authorization: header, 'Content-Type': 'application/json' },
        body: '{}',
        signal: AbortSignal.timeout(8000),
    });
    if (access.status === 401 || access.status === 403) return { status: access.status };
    if (!access.ok) return { status: 503 };
    const data = await access.json();
    return { status: data.ready === true ? 200 : 403, premium: data.premium === true };
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

    const view = req.query.vista;
    if (view !== undefined && !['lector', 'portada', 'tramo'].includes(view)) {
        res.statusCode = 404;
        return res.end();
    }
    const cover = view === 'portada';
    const segmented = view === 'tramo';
    if ((cover && req.method === 'POST') || (segmented && req.method !== 'GET')) {
        res.setHeader('Allow', cover ? 'GET, HEAD' : 'GET');
        res.statusCode = 405;
        return res.end();
    }
    const book = books[subject];
    const start = req.query.desde;
    const segment = segmented && typeof start === 'string' && /^[1-9]\d{0,3}$/.test(start) && book.segments[start];
    if (segmented && !segment) {
        res.statusCode = 404;
        return res.end();
    }
    const secret = process.env.BLOB_READ_WRITE_TOKEN;
    const download = !view && req.method !== 'POST' && validGrant(secret, subject, req.query.descarga);
    const reading = Boolean(view) && req.method !== 'POST' && validGrant(secret, subject, req.headers['x-official-reader'], true);
    const starts = Object.keys(book.segments);
    let availablePages;
    try {
        if (!download && !reading) {
            const access = await authorize(req.headers.authorization);
            if (access.status !== 200) {
                res.statusCode = access.status;
                return res.end();
            }
            if (!access.premium) {
                if (!cover && !segmented) {
                    res.statusCode = 403;
                    return res.end();
                }
                availablePages = (await samplePages())[subject];
                if (segmented) {
                    const end = Number(starts[starts.indexOf(start) + 1]) || Infinity;
                    if (!availablePages.some(page => page >= Number(start) && page < end)) {
                        res.statusCode = 403;
                        return res.end();
                    }
                }
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
        const grant = issueGrant(secret, subject, Boolean(view));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ grant }));
    }

    const extension = cover ? 'webp' : 'pdf';
    const objectPath = segmented ? 'lector/tramos-v1/' + subject + '.bin' : (view ? 'lector/' : '') + subject + '.' + extension;
    const upstream = new URL(objectPath, library);
    const contentType = cover ? 'image/webp' : 'application/pdf';
    const allowedType = cover ? /^(image\/webp|application\/octet-stream)(?:;|$)/i : /^application\/(pdf|octet-stream)(?:;|$)/i;
    const headers = { Authorization: 'Bearer ' + secret, 'Accept-Encoding': 'identity' };
    const range = req.headers.range;
    let expectedRange;
    if (segment) {
        const [offset, length] = segment;
        headers.Range = `bytes=${offset}-${offset + length - 1}`;
        expectedRange = `bytes ${offset}-${offset + length - 1}/${book.bytes}`;
    } else if (typeof range === 'string' && /^bytes=(?:\d+-\d*|-\d+)$/.test(range)) headers.Range = range;
    try {
        const pdf = await fetch(upstream, { method: req.method, headers, redirect: 'error', signal: AbortSignal.timeout(45000) });
        if (!segment && pdf.status === 416) {
            const size = pdf.headers.get('content-range');
            if (size) res.setHeader('Content-Range', size);
            res.statusCode = 416;
            return res.end();
        }
        if (!pdf.ok || !allowedType.test(pdf.headers.get('content-type') || '') ||
            (segment && (pdf.status !== 206 || pdf.headers.get('content-range') !== expectedRange))) {
            await pdf.body?.cancel();
            res.statusCode = 502;
            return res.end();
        }
        res.statusCode = segment ? 200 : pdf.status;
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="UMSS-2025-2026-${subject}.${extension}"`);
        if (cover) {
            if (availablePages) res.setHeader('X-Official-Preview-Pages', availablePages.join(','));
            else res.setHeader('X-Official-Reader', reading ? req.headers['x-official-reader'] : issueGrant(secret, subject, true));
            res.setHeader('X-Official-Page-Starts', starts.join(','));
        }
        for (const header of segment ? ['Content-Length'] : ['Accept-Ranges', 'Content-Length', 'Content-Range']) {
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
