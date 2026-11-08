'use strict';

const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');

// Public study guides linked by the UMSA Unidad de Admisión Facultativa.
const files = new Map([
    ['matematicas', '1IRuuJCW8oBAOqL2uqwHZv4eWSVtZkwqF'],
    ['fisica', '1L1z3zmyHNpzaB4HGrlJNEjMs6QWF7XUz'],
    ['quimica', '1kVK0xS3ULILT3oB98-RCbH2aRV4ffqWA'],
    ['biologia', '1EjyMndGgCLuD3x0xJdr9PRle3ZUj9D4b'],
    ['lenguaje', '16KQPhGZ1xcbllZMX_iiSDnGpypI5rOTT'],
]);

module.exports = async function handler(req, res) {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.setHeader('Allow', 'GET, HEAD');
        res.statusCode = 405;
        return res.end();
    }
    const subject = req.query.materia;
    const id = files.get(subject);
    if (!id) {
        res.statusCode = 404;
        return res.end();
    }

    const upstream = new URL('https://drive.usercontent.google.com/download');
    upstream.searchParams.set('id', id);
    upstream.searchParams.set('export', 'download');
    const headers = { 'Accept-Encoding': 'identity' };
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
        res.setHeader('Content-Disposition', `attachment; filename="UMSA-2026-${subject}.pdf"`);
        res.setHeader('Cache-Control', pdf.status === 200 ? 'public, max-age=3600, s-maxage=86400' : 'private, max-age=3600');
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
