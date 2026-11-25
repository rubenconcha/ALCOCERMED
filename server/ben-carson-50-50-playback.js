// Protected lesson signer. Routed through the existing /api/flashcards function.
// No production secrets in source; no service role; no cluster or policy changes.
const { createHash } = require('node:crypto');
const SUPABASE = 'https://asnwhddmurstzmghuyin.supabase.co';
const LIBRARY = '817157';
const TTL_SECONDS = 180;
const PRODUCTION_ORIGINS = new Set(['https://www.alcocermed.com', 'https://alcocermed.com']);
function isAllowedOrigin(origin, env) {
  // Preview and production are mutually exclusive. Exact canonical branch alias, never *.vercel.app.
  if (env.VERCEL_ENV === 'preview') {
    const preview = env.ALCOCERMED_BC5050_PREVIEW_ORIGIN;
    return typeof preview === 'string' && /^https:\/\/alcocermed-git-[a-z0-9-]+-pichon4488-2410s-projects\.vercel\.app$/.test(preview) &&
      origin === preview;
  }
  return env.VERCEL_ENV === 'production' && PRODUCTION_ORIGINS.has(origin);
}
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function createHandler({ fetcher = fetch, env = process.env, now = Date.now, defaultPublishableKey, videoGuid } = {}) {
  return async function playback(req, res) {
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    function send(status, payload) { return res.status(status).json(payload); }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return send(405, { error: 'method_not_allowed' });
    }
    if (!isAllowedOrigin(req.headers.origin, env)) return send(403, { error: 'origin_not_allowed' });
    const bearer = req.headers.authorization;
    if (typeof bearer !== 'string' || bearer.length > 8192 ||
        !/^Bearer [A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(bearer)) {
      return send(401, { error: 'sign_in_required' });
    }
    const key = env.ALCOCERMED_SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || defaultPublishableKey;
    // Optional server-selected lesson. Never read a Bunny GUID from the client request.
    const guid = videoGuid || env.ALCOCERMED_BC5050_BUNNY_VIDEO_GUID;
    const signingKey = env.ALCOCERMED_BC5050_BUNNY_EMBED_TOKEN_KEY;
    if (!key || !GUID.test(guid || '') || !signingKey) {
      return send(503, { error: 'playback_unavailable' });
    }
    const claimsKey = key.split('.');
    if (key.startsWith('sb_secret_')) return send(503, { error: 'playback_unavailable' });
    if (claimsKey.length === 3) {
      try {
        const claims = JSON.parse(Buffer.from(claimsKey[1], 'base64url').toString('utf8'));
        if (claims.role !== 'anon' || claims.ref !== 'asnwhddmurstzmghuyin') return send(503, { error: 'playback_unavailable' });
      } catch { return send(503, { error: 'playback_unavailable' }); }
    } else if (!key.startsWith('sb_publishable_')) {
      return send(503, { error: 'playback_unavailable' });
    }
    try {
      // Same real user JWT on both trusted calls. No locally trusted claim or client-supplied video ID.
      const headers = { apikey: key, Authorization: bearer, 'Content-Type': 'application/json' };
      const options = { headers, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(5000) };
      const auth = await fetcher(SUPABASE + '/auth/v1/user', options);
      if (auth.status === 401 || auth.status === 403) return send(401, { error: 'sign_in_required' });
      if (!auth.ok) return send(503, { error: 'playback_unavailable' });
      const user = await auth.json();
      if (!GUID.test(user?.id || '')) return send(401, { error: 'sign_in_required' });

      const access = await fetcher(SUPABASE + '/rest/v1/rpc/campus_has_video_access', {
        ...options, method: 'POST', body: '{}', signal: AbortSignal.timeout(5000)
      });
      if (access.status === 401) return send(401, { error: 'sign_in_required' });
      if (access.status === 403 || access.ok && await access.json() !== true) {
        return send(403, { error: 'membership_or_device_required' });
      }
      if (!access.ok) return send(503, { error: 'playback_unavailable' });

      const expires = Math.floor(now() / 1000) + TTL_SECONDS;
      // Bunny Stream Embed View Token, not Pull Zone CDN token or Bunny API key.
      const token = createHash('sha256').update(signingKey + guid + expires, 'utf8').digest('hex');
      const url = new URL('https://player.mediadelivery.net/embed/' + LIBRARY + '/' + guid);
      url.searchParams.set('token', token);
      url.searchParams.set('expires', String(expires));
      url.searchParams.set('autoplay', 'false');
      return send(200, { embedUrl: url.href, expiresAt: expires });
    } catch {
      // Keep Bearer/signing key/provider request/response bodies out of error logs.
      return send(503, { error: 'playback_unavailable' });
    }
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
