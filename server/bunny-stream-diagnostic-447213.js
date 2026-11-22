'use strict';

// One temporary vendor diagnostic, not a public player or general signing endpoint.
const { createHash, timingSafeEqual } = require('node:crypto');
const HOST = 'www.alcocermed.com';
const QUERY = 'bcdiag_447213';
const LIBRARY = '817157';
const TTL_SECONDS = 180;
const MAX_WINDOW_SECONDS = 12 * 60 * 60;
const HEX_64 = /^[a-f0-9]{64}$/;
const GUID = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const CONFIG = Object.freeze({
  syntheticGuid: '244a00c4-c9ad-44f1-91a3-697f87bc5c13',
  capabilityHash: '16ba3bce6ca89e30bb4bade18c1c5d4b988f46b9d370823fb98a059406f3f791',
  opensAt: Number('1795313146'),
  closesAt: Number('1795356346'),
});

function createHandler({ config = CONFIG, env = process.env, now = Date.now } = {}) {
  const { syntheticGuid, capabilityHash, opensAt, closesAt } = config;
  const validConfig = typeof syntheticGuid === 'string' && GUID.test(syntheticGuid) &&
    typeof capabilityHash === 'string' && HEX_64.test(capabilityHash) &&
    Number.isSafeInteger(opensAt) && Number.isSafeInteger(closesAt) &&
    closesAt > opensAt && closesAt - opensAt <= MAX_WINDOW_SECONDS;
  const expected = validConfig ? Buffer.from(capabilityHash, 'hex') : null;
  return function streamDiagnostic(req, res) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    res.setHeader('CDN-Cache-Control', 'no-store');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'origin');
    res.setHeader('Content-Security-Policy',
      "default-src 'none'; frame-src https://player.mediadelivery.net; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    const plain = (status, text) => {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(status).send(text);
    };
    const missing = () => plain(404, 'Not found');
    const unavailable = () => plain(503, 'Diagnostic unavailable');
    if (req.method !== 'GET' || env.VERCEL_ENV !== 'production' || req.headers.host !== HOST || !expected) return missing();
    const query = req.query || {};
    const cap = query[QUERY];
    // This route has exactly one opaque input. Repeated query params resolve to an array and are rejected.
    if (Object.keys(query).length !== 1 || typeof cap !== 'string' || !HEX_64.test(cap)) return missing();
    const epoch = Math.floor(now() / 1000);
    const expires = epoch + TTL_SECONDS;
    if (epoch < opensAt || expires > closesAt) return missing();
    const observed = createHash('sha256').update(cap, 'ascii').digest();
    if (!timingSafeEqual(observed, expected)) return missing();
    const liveGuid = env.ALCOCERMED_BC5050_BUNNY_VIDEO_GUID;
    const signingKey = env.ALCOCERMED_BC5050_BUNNY_EMBED_TOKEN_KEY;
    if (typeof liveGuid !== 'string' || !GUID.test(liveGuid) ||
        syntheticGuid.toLowerCase() === liveGuid.toLowerCase() ||
        typeof signingKey !== 'string' || !signingKey) return unavailable();
    // No inputs are accepted as a target, host, library, or expiry. Env never supplies a target.
    const token = createHash('sha256').update(signingKey + syntheticGuid + expires, 'utf8').digest('hex');
    const src = 'https://player.mediadelivery.net/embed/' + LIBRARY + '/' + syntheticGuid +
      '?token=' + token + '&amp;expires=' + expires + '&amp;autoplay=false';
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(
      '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>Bunny Stream synthetic diagnostic</title></head><body>' +
      '<h1>Bunny Stream synthetic diagnostic</h1><p>Ticket 447213. This page plays only a synthetic test clip; no campus account is needed.</p>' +
      '<iframe title="Synthetic test clip" width="320" height="180" referrerpolicy="origin" ' +
      'allow="fullscreen" allowfullscreen src="' + src + '"></iframe>' +
      '<p>If the iframe reports a token or authorization error, record the result and UTC time. ' +
      'Do not copy the player URL or share the token.</p></body></html>'
    );
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
