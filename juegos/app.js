// ═══════════════════════════════════════════════
// ALCOCERMED JUEGOS — APP.JS
// Student-first platform with admin gating
// ═══════════════════════════════════════════════

var SUPABASE_URL = 'https://asnwhddmurstzmghuyin.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';
var ADMIN_EMAIL = 'pichon4488@gmail.com';

var sb = null;
var currentUser = null;
var isAdmin = false;

// ═══ AUDIO GLOBAL Y AVATARES ═══
var globalAudioCtx = null;
var preloadedAudio = {};

var currentAvatar = 'avatarcfg:%7B%22base%22%3A%22carlos%22%2C%22outfitColor%22%3A%22%23ef4444%22%2C%22accessory%22%3A%22none%22%7D';
var availableAvatars = [
    { id: 'carlos',    label: 'Carlos',    gender: 'male',   src: './assets/avatars/carlos.png',    accent: '#ef4444', keyColor: '#cf2029', variantSrcs: { cap: './assets/avatars/carlos_cap.png', stethoscope: './assets/avatars/carlos_stethoscope.png' } },
    { id: 'lucia',     label: 'Lucía',     gender: 'female', src: './assets/avatars/lucia.png',     accent: '#8b5cf6', keyColor: '#6b2ec8', variantSrcs: { cap: './assets/avatars/lucia_cap.png', stethoscope: './assets/avatars/lucia_stethoscope.png' } },
    { id: 'mateo',     label: 'Mateo',     gender: 'male',   src: './assets/avatars/mateo.png',     accent: '#1d4ed8', keyColor: '#273866', variantSrcs: { cap: './assets/avatars/mateo_cap.png', stethoscope: './assets/avatars/mateo_stethoscope.png' } },
    { id: 'sofia',     label: 'Sofía',     gender: 'female', src: './assets/avatars/sofia.png',     accent: '#22c55e', keyColor: '#228d35', variantSrcs: { cap: './assets/avatars/sofia_cap.png', stethoscope: './assets/avatars/sofia_stethoscope.png' } },
    { id: 'andres',    label: 'Andrés',    gender: 'male',   src: './assets/avatars/andres.png',     accent: '#ec4899', keyColor: '#ef5ba7' },
    { id: 'valentina', label: 'Valentina', gender: 'female', src: './assets/avatars/valentina.png', accent: '#facc15', keyColor: '#dfaf1c' },
    { id: 'diego',     label: 'Diego',     gender: 'male',   src: './assets/avatars/diego.png',     accent: '#06b6d4', keyColor: '#0a9ca8' },
    { id: 'bruno',     label: 'Bruno',     gender: 'male',   src: './assets/avatars/bruno.png',     accent: '#f97316', keyColor: '#f08414' },
    { id: 'sebastian', label: 'Sebastián', gender: 'male',   src: './assets/avatars/sebastian.png', accent: '#38bdf8', keyColor: '#39a7ee' },
    { id: 'camila',    label: 'Camila',    gender: 'female', src: './assets/avatars/camila.png',    accent: '#c084fc', keyColor: '#b17ae8' },
    { id: 'paula',     label: 'Paula',     gender: 'female', src: './assets/avatars/paula.png',    accent: '#86efac', keyColor: '#9bd7c9' },
    { id: 'emilia',    label: 'Emilia',    gender: 'female', src: './assets/avatars/emilia.png',    accent: '#14b8a6', keyColor: '#09b0b3' }
];
var avatarLegacyPathMap = {
    'andres.png': 'andres',
    'bruno.png': 'bruno',
    'paula.png': 'paula',
    'sofia.png': 'sofia'
};
var avatarColorOptions = [
    { id: 'rojo',      label: 'Rojo',      value: '#ef4444' },
    { id: 'naranja',   label: 'Naranja',   value: '#f97316' },
    { id: 'amarillo',  label: 'Amarillo',  value: '#eab308' },
    { id: 'verde',     label: 'Verde',     value: '#22c55e' },
    { id: 'menta',     label: 'Menta',     value: '#2dd4bf' },
    { id: 'celeste',   label: 'Celeste',   value: '#38bdf8' },
    { id: 'azul',      label: 'Azul',      value: '#2563eb' },
    { id: 'morado',    label: 'Morado',    value: '#a855f7' },
    { id: 'rosa',      label: 'Rosa',      value: '#ec4899' },
    { id: 'blanco',    label: 'Blanco',    value: '#f3f4f6' }
];
var avatarAccessoryOptions = [
    { id: 'none',          label: 'Solo ropa' },
    { id: 'cap',           label: 'Con gorra' },
    { id: 'stethoscope',   label: 'Con estetoscopio' }
];
var selectableAvatars = availableAvatars.filter(avatarHasCompleteVariantSet);
var avatarFallbackPool = (selectableAvatars.length ? selectableAvatars : availableAvatars).map(function(item) { return item.id; });
var avatarFallbackPoolsByGender = {
    male: (selectableAvatars.length ? selectableAvatars : availableAvatars).filter(function(item) { return item.gender === 'male'; }).map(function(item) { return item.id; }),
    female: (selectableAvatars.length ? selectableAvatars : availableAvatars).filter(function(item) { return item.gender === 'female'; }).map(function(item) { return item.id; })
};
var avatarDraftConfig = null;
var avatarTintCache = {};
var avatarTintPending = {};
var avatarRenderObserver = null;
var avatarHydrateTimer = null;

function avatarIndexFromSeed(seed, pool) {
    pool = pool || avatarFallbackPool;
    var str = String(seed || 'alcocermed');
    var total = 0;
    for (var i = 0; i < str.length; i++) total += str.charCodeAt(i) * (i + 1);
    return total % pool.length;
}

function normalizeAvatarSeedName(seedName) {
    return String(seedName || '').trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zñ\s-]/g, ' ')
        .replace(/\s+/g, ' ');
}

function inferAvatarGender(seedName) {
    var cleaned = normalizeAvatarSeedName(seedName);
    var first = cleaned.split(/[\s-]+/)[0] || '';
    var femaleNames = {
        alejandra:1, alicia:1, ana:1, andrea:1, angela:1, antonella:1, belen:1, camila:1, carla:1,
        carolina:1, catalina:1, cecilia:1, clara:1, daniela:1, elena:1, emilia:1, fernanda:1,
        gabriela:1, isabel:1, julia:1, laura:1, lucia:1, luisa:1, maria:1, mariana:1,
        martina:1, natalia:1, paola:1, paula:1, romina:1, sarah:1, sofia:1, valentina:1,
        valeria:1, victoria:1
    };
    var maleNames = {
        alejandro:1, andres:1, antonio:1, bruno:1, carlos:1, cristian:1, daniel:1, david:1,
        diego:1, eduardo:1, emiliano:1, fernando:1, francisco:1, gabriel:1, javier:1,
        jose:1, juan:1, luis:1, manuel:1, mario:1, martin:1, mateo:1, matias:1,
        miguel:1, nicolas:1, pablo:1, pedro:1, rafael:1, ricardo:1, roberto:1,
        ruben:1, samuel:1, sebastian:1, sergio:1, victor:1
    };
    if (femaleNames[first]) return 'female';
    if (maleNames[first]) return 'male';
    if (first.length > 2 && /a$/.test(first) && !/ias$/.test(first)) return 'female';
    if (first.length > 2 && /(o|os|el|an|er|es|is|or)$/.test(first)) return 'male';
    return '';
}

function pickFallbackAvatarId(seedName) {
    var gender = inferAvatarGender(seedName);
    var pool = avatarFallbackPoolsByGender[gender] || avatarFallbackPool;
    return pool[avatarIndexFromSeed(seedName, pool)];
}

function findAvatarDef(value, seedName) {
    var raw = value == null ? '' : String(value).trim();
    if (raw) {
        var legacyName = (raw.split(/[\\/]/).pop() || '').split('?')[0].toLowerCase();
        if (avatarLegacyPathMap[legacyName]) raw = avatarLegacyPathMap[legacyName];
        for (var i = 0; i < availableAvatars.length; i++) {
            var item = availableAvatars[i];
            if (raw === item.id || raw === item.src || raw === ('/' + item.src).replace(/^\.\//,'' ) || raw.toLowerCase() === item.label.toLowerCase()) return item;
            if (raw.indexOf('/' + item.src.replace(/^\.\//,'')) !== -1) return item;
        }
    }
    return getAvatarDefById(pickFallbackAvatarId(seedName || raw));
}

function getAvatarDefById(id, seedName) {
    return findAvatarDef(id, seedName);
}

function safeHexColor(value, fallback) {
    var raw = String(value || '').trim();
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw;
    return fallback || '#6366f1';
}

function normalizeAvatarAccessory(accessory) {
    accessory = String(accessory || 'none');
    for (var i = 0; i < avatarAccessoryOptions.length; i++) {
        if (avatarAccessoryOptions[i].id === accessory) return accessory;
    }
    return 'none';
}

function ensureAvatarConfig(config, seedName) {
    var def = findAvatarDef(config && (config.base || config.src || config.id), seedName);
    return {
        base: def.id,
        outfitColor: safeHexColor(config && config.outfitColor, def.accent),
        accessory: normalizeAvatarAccessory(config && config.accessory)
    };
}

function encodeAvatarConfig(config, seedName) {
    var normalized = ensureAvatarConfig(config || {}, seedName);
    return 'avatarcfg:' + encodeURIComponent(JSON.stringify(normalized));
}

function decodeAvatarConfig(value, seedName) {
    var raw = value == null ? '' : String(value).trim();
    if (!raw || raw === '👤' || raw === '🧑‍🎓') {
        return ensureAvatarConfig({ base: pickFallbackAvatarId(seedName || raw) }, seedName);
    }
    if (raw.indexOf('avatarcfg:') === 0) {
        try {
            return ensureAvatarConfig(JSON.parse(decodeURIComponent(raw.slice(10))), seedName);
        } catch (e) {
            console.warn('Error parseando avatar config', e);
        }
    }
    var def = findAvatarDef(raw, seedName);
    if (def) return ensureAvatarConfig({ base: def.id }, seedName);
    return ensureAvatarConfig({ base: pickFallbackAvatarId(seedName || raw) }, seedName);
}

function normalizeAvatarValue(value, seedName) {
    return encodeAvatarConfig(decodeAvatarConfig(value, seedName), seedName);
}

function resolveAvatarSrc(value, seedName) {
    var cfg = decodeAvatarConfig(value, seedName);
    var def = getAvatarDefById(cfg.base, seedName);
    return getAvatarVariantSrc(def, cfg.accessory);
}

function getAvatarVariantSrc(def, accessory) {
    if (def && def.variantSrcs && def.variantSrcs[accessory]) return def.variantSrcs[accessory];
    return def.src;
}

function avatarHasCompleteVariantSet(def) {
    return !!(def && def.src && def.variantSrcs && def.variantSrcs.cap && def.variantSrcs.stethoscope);
}

function escapeHtml(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function accessorySvg(type) {
    if (type === 'cap') {
        return '<span class="avatar-accessory avatar-accessory-cap" aria-hidden="true"><svg viewBox="0 0 120 80" fill="none"><path d="M19 44c7-18 24-30 45-30 18 0 34 9 46 24-18 4-37 8-55 10-14 2-26 1-36-4z" fill="#ef4444"/><path d="M15 45c10 5 24 6 39 4 20-3 39-7 56-11 5 5 8 10 9 16-24 7-48 11-69 12-15 1-29-2-40-9 0-5 2-9 5-12z" fill="#dc2626"/><path d="M64 17c7 6 11 15 12 27" stroke="#991b1b" stroke-width="5" stroke-linecap="round"/><circle cx="88" cy="30" r="3" fill="#7f1d1d"/></svg></span>';
    }
    if (type === 'glasses') {
        return '<span class="avatar-accessory avatar-accessory-glasses" aria-hidden="true"><svg viewBox="0 0 120 42" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="10" rx="10" ry="10" width="34" height="22"/><rect x="76" y="10" rx="10" ry="10" width="34" height="22"/><path d="M44 20h32"/><path d="M4 18h6"/><path d="M110 18h6"/></svg></span>';
    }
    if (type === 'sunglasses') {
        return '<span class="avatar-accessory avatar-accessory-glasses avatar-accessory-sunglasses" aria-hidden="true"><svg viewBox="0 0 120 42" fill="none" stroke="#111827" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="10" rx="10" ry="10" width="34" height="22" fill="#111827"/><rect x="76" y="10" rx="10" ry="10" width="34" height="22" fill="#111827"/><path d="M44 20h32"/><path d="M4 18h6"/><path d="M110 18h6"/></svg></span>';
    }
    if (type === 'headphones') {
        return '<span class="avatar-accessory avatar-accessory-headphones" aria-hidden="true"><svg viewBox="0 0 120 80" fill="none"><path d="M18 46c0-24 18-40 42-40s42 16 42 40" stroke="#111827" stroke-width="8" stroke-linecap="round"/><rect x="10" y="40" width="18" height="24" rx="8" fill="#111827"/><rect x="92" y="40" width="18" height="24" rx="8" fill="#111827"/><path d="M24 50c0 9 3 15 10 18" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/><path d="M96 50c0 9-3 15-10 18" stroke="#4b5563" stroke-width="4" stroke-linecap="round"/></svg></span>';
    }
    if (type === 'stethoscope') {
        return '<span class="avatar-accessory avatar-accessory-stethoscope" aria-hidden="true"><svg viewBox="0 0 120 120" fill="none" stroke="#0f172a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M40 18v24c0 12 8 20 20 20s20-8 20-20V18"/><path d="M32 18h16"/><path d="M72 18h16"/><path d="M48 62v18c0 15 12 27 27 27h6"/><circle cx="89" cy="92" r="11" fill="#fff"/><path d="M89 81v-12"/></svg></span>';
    }
    return '';
}

function avatarMarkup(value, alt, extraClass) {
    var cfg = decodeAvatarConfig(value, alt);
    var def = getAvatarDefById(cfg.base, alt);
    var cls = extraClass || 'avatar-media';
    var renderSrc = getAvatarVariantSrc(def, cfg.accessory);
    var builtInAccessory = renderSrc !== def.src;
    return '<span class="avatar-render ' + cls + '" data-avatar-src="' + escapeHtml(renderSrc) + '" data-avatar-color="' + escapeHtml(cfg.outfitColor) + '" data-avatar-accessory="' + escapeHtml(cfg.accessory) + '" data-avatar-key-color="' + escapeHtml(def.keyColor || def.accent) + '"><img src="' + escapeHtml(renderSrc) + '" alt="' + escapeHtml(alt || 'Avatar') + '" class="avatar-render-base ' + cls + '">' + (builtInAccessory ? '' : '') + '</span>';
}

function scheduleAvatarHydration(root) {
    clearTimeout(avatarHydrateTimer);
    avatarHydrateTimer = setTimeout(function() { hydrateRenderedAvatars(root || document); }, 10);
}

function setAvatarContent(el, value, alt, extraClass) {
    if (!el) return;
    el.innerHTML = avatarMarkup(value, alt, extraClass);
    scheduleAvatarHydration(el);
}

function hexToRgb(hex) {
    var clean = safeHexColor(hex, '#6366f1').replace('#', '');
    return {
        r: parseInt(clean.slice(0,2), 16),
        g: parseInt(clean.slice(2,4), 16),
        b: parseInt(clean.slice(4,6), 16)
    };
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h, s: s, l: l };
}

function hslToRgb(h, s, l) {
    var r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function hueDistance(a, b) {
    var d = Math.abs(a - b);
    return Math.min(d, 1 - d);
}

function recolorAvatarToDataUrl(baseSrc, targetColor, keyColor, done) {
    var cacheKey = [baseSrc, targetColor, keyColor].join('|');
    if (avatarTintCache[cacheKey]) {
        done(avatarTintCache[cacheKey]);
        return;
    }
    if (avatarTintPending[cacheKey]) {
        avatarTintPending[cacheKey].push(done);
        return;
    }
    avatarTintPending[cacheKey] = [done];
    var img = new Image();
    img.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var keyRgb = hexToRgb(keyColor);
        var keyHsl = rgbToHsl(keyRgb.r, keyRgb.g, keyRgb.b);
        var targetRgb = hexToRgb(targetColor);
        var targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);
        for (var i = 0; i < data.length; i += 4) {
            var alpha = data[i + 3];
            if (alpha < 8) continue;
            var r = data[i], g = data[i + 1], b = data[i + 2];
            var rgbDist = Math.sqrt(Math.pow(r - keyRgb.r, 2) + Math.pow(g - keyRgb.g, 2) + Math.pow(b - keyRgb.b, 2));
            var hsl = rgbToHsl(r, g, b);
            var hueDiff = hueDistance(hsl.h, keyHsl.h);
            if ((rgbDist < 130 || (hueDiff < 0.10 && hsl.s > 0.2)) && hsl.l > 0.10 && hsl.l < 0.92) {
                var recolored = hslToRgb(targetHsl.h, Math.max(hsl.s, targetHsl.s * 0.75), hsl.l);
                data[i] = recolored.r;
                data[i + 1] = recolored.g;
                data[i + 2] = recolored.b;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        var dataUrl = canvas.toDataURL('image/png');
        avatarTintCache[cacheKey] = dataUrl;
        var queue = avatarTintPending[cacheKey] || [];
        delete avatarTintPending[cacheKey];
        for (var q = 0; q < queue.length; q++) queue[q](dataUrl);
    };
    img.onerror = function() {
        var queue = avatarTintPending[cacheKey] || [];
        delete avatarTintPending[cacheKey];
        avatarTintCache[cacheKey] = baseSrc;
        for (var q = 0; q < queue.length; q++) queue[q](baseSrc);
    };
    img.src = baseSrc;
}

function hydrateRenderedAvatars(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var renders = scope.querySelectorAll ? scope.querySelectorAll('.avatar-render') : [];
    for (var i = 0; i < renders.length; i++) {
        (function(node) {
            var img = node.querySelector('img');
            if (!img) return;
            var src = node.getAttribute('data-avatar-src') || img.getAttribute('src');
            var color = safeHexColor(node.getAttribute('data-avatar-color'), '#6366f1');
            var keyColor = safeHexColor(node.getAttribute('data-avatar-key-color'), color);
            recolorAvatarToDataUrl(src, color, keyColor, function(dataUrl) {
                img.setAttribute('src', dataUrl);
            });
        })(renders[i]);
    }
}

function initAvatarRenderObserver() {
    if (avatarRenderObserver || !document.body || typeof MutationObserver === 'undefined') {
        hydrateRenderedAvatars(document);
        return;
    }
    avatarRenderObserver = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                var node = mutations[i].addedNodes[j];
                if (node.nodeType === 1) scheduleAvatarHydration(node);
            }
        }
    });
    avatarRenderObserver.observe(document.body, { childList: true, subtree: true });
    hydrateRenderedAvatars(document);
}

function refreshCurrentAvatarUI() {
    var disp = document.getElementById('current-avatar-display');
    setAvatarContent(disp, currentAvatar, 'Tu avatar', 'avatar-choice-media');
    var topbarAvatar = document.getElementById('topbar-avatar');
    setAvatarContent(topbarAvatar, currentAvatar, 'Avatar de usuario', 'topbar-avatar-media');
}

function initAvatars() {
    if (currentUser && currentUser.user_metadata && currentUser.user_metadata.avatar) {
        currentAvatar = normalizeAvatarValue(currentUser.user_metadata.avatar, currentUser.user_metadata.full_name || currentUser.email || 'avatar');
    } else {
        currentAvatar = normalizeAvatarValue(currentAvatar, currentUser && (currentUser.user_metadata && currentUser.user_metadata.full_name || currentUser.email) || 'avatar');
    }
    refreshCurrentAvatarUI();
}

function avatarColorSwatchesHtml(selectedColor) {
    var html = '';
    for (var i = 0; i < avatarColorOptions.length; i++) {
        var item = avatarColorOptions[i];
        var selected = safeHexColor(selectedColor) === safeHexColor(item.value);
        html += '<button type="button" class="avatar-color-chip' + (selected ? ' selected' : '') + '" title="' + escapeHtml(item.label) + '" onclick="chooseAvatarColor(\'' + item.value + '\')">';
        html += '<span class="avatar-color-dot" style="background:' + item.value + '"></span>';
        html += '<span>' + escapeHtml(item.label) + '</span>';
        html += '</button>';
    }
    return html;
}

function avatarAccessoryOptionsHtml(selectedAccessory) {
    var html = '';
    for (var i = 0; i < avatarAccessoryOptions.length; i++) {
        var item = avatarAccessoryOptions[i];
        var selected = (selectedAccessory || 'none') === item.id;
        html += '<button type="button" class="avatar-accessory-chip' + (selected ? ' selected' : '') + '" onclick="chooseAvatarAccessory(\'' + item.id + '\')">';
        html += '<span>' + escapeHtml(item.label) + '</span>';
        html += '</button>';
    }
    return html;
}

function avatarVariantButtonHtml(item, accessory, selectedAccessory, isSelectedBase) {
    var selected = isSelectedBase && (selectedAccessory || 'none') === accessory;
    var cfg = { base: item.id, outfitColor: item.accent, accessory: accessory };
    return '<button type="button" class="avatar-variant-btn' + (selected ? ' selected' : '') + '" onclick="chooseAvatarVariant(\'' + item.id + '\', \'' + accessory + '\')" aria-label="Seleccionar variante de ' + escapeHtml(item.label) + '">' + avatarMarkup(encodeAvatarConfig(cfg), item.label, 'avatar-variant-thumb') + '</button>';
}

function avatarCardsHtml(selectedBase) {
    var html = '';
    var avatars = selectableAvatars.length ? selectableAvatars : availableAvatars;
    for (var i = 0; i < avatars.length; i++) {
        var item = avatars[i];
        if (!avatarHasCompleteVariantSet(item)) continue;
        var selected = selectedBase === item.id;
        var selectedAccessory = selected && avatarDraftConfig ? avatarDraftConfig.accessory : 'none';
        var selectedColor = selected && avatarDraftConfig ? avatarDraftConfig.outfitColor : item.accent;
        var cfg = { base: item.id, outfitColor: selectedColor, accessory: selectedAccessory };
        var cardLabel = selectedAccessory === 'cap' ? item.label + ' con gorra' : selectedAccessory === 'stethoscope' ? item.label + ' con estetoscopio' : item.label + ' solo ropa';
        html += '<article class="avatar-modal-card avatar-carousel-card' + (selected ? ' selected' : '') + '" style="--avatar-accent:' + item.accent + '">';
        html += '<div class="avatar-card-layout">';
        html += '<button type="button" class="avatar-card-select" onclick="chooseAvatarVariant(\'' + item.id + '\', \'' + selectedAccessory + '\')" aria-label="Seleccionar ' + escapeHtml(item.label) + '">';
        html += '<span class="avatar-modal-thumb-wrap">' + avatarMarkup(encodeAvatarConfig(cfg), cardLabel, 'avatar-modal-thumb') + '</span>';
        html += '</button>';
        html += '<div class="avatar-card-variants">';
        html += avatarVariantButtonHtml(item, 'none', selectedAccessory, selected);
        html += avatarVariantButtonHtml(item, 'cap', selectedAccessory, selected);
        html += avatarVariantButtonHtml(item, 'stethoscope', selectedAccessory, selected);
        html += '</div>';
        html += '</div>';
        html += '</article>';
    }
    return html;
}

function renderAvatarModal() {
    var modal = document.getElementById('avatar-modal');
    if (!modal || !avatarDraftConfig) return;
    var preview = document.getElementById('avatar-preview-stage');
    var grid = document.getElementById('avatar-grid');
    var colors = document.getElementById('avatar-color-options');
    var accessories = document.getElementById('avatar-accessory-options');
    if (preview) preview.innerHTML = avatarMarkup(encodeAvatarConfig(avatarDraftConfig), 'Vista previa', 'avatar-preview-media');
    if (grid) {
        grid.classList.add('avatar-carousel');
        grid.innerHTML = avatarCardsHtml(avatarDraftConfig.base);
    }
    if (colors) colors.innerHTML = '';
    if (accessories) accessories.innerHTML = '';
    scheduleAvatarHydration(modal);
}

window.openAvatarModal = function() {
    var modal = document.getElementById('avatar-modal');
    if (!modal) return;
    avatarDraftConfig = decodeAvatarConfig(currentAvatar, currentUser && ((currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email) || 'avatar');
    if (!avatarHasCompleteVariantSet(getAvatarDefById(avatarDraftConfig.base)) && selectableAvatars.length) {
        avatarDraftConfig = ensureAvatarConfig({
            base: selectableAvatars[0].id,
            outfitColor: selectableAvatars[0].accent,
            accessory: 'none'
        });
    }
    renderAvatarModal();
    modal.classList.remove('hidden');
};

window.closeAvatarModal = function() {
    var modal = document.getElementById('avatar-modal');
    if (modal) modal.classList.add('hidden');
};

window.chooseAvatarBase = function(baseId) {
    window.chooseAvatarVariant(baseId, 'none');
};

window.chooseAvatarVariant = function(baseId, accessory) {
    var def = getAvatarDefById(baseId);
    if (!avatarHasCompleteVariantSet(def) && selectableAvatars.length) def = selectableAvatars[0];
    var keepCurrentColor = avatarDraftConfig && avatarDraftConfig.base === baseId;
    avatarDraftConfig = ensureAvatarConfig({
        base: def.id,
        outfitColor: keepCurrentColor ? avatarDraftConfig.outfitColor : def.accent,
        accessory: normalizeAvatarAccessory(accessory)
    });
    renderAvatarModal();
};

window.chooseAvatarColor = function(color) {
    if (!avatarDraftConfig) avatarDraftConfig = decodeAvatarConfig(currentAvatar, 'avatar');
    avatarDraftConfig.outfitColor = safeHexColor(color, avatarDraftConfig.outfitColor);
    renderAvatarModal();
};

window.chooseAvatarAccessory = function(accessory) {
    if (!avatarDraftConfig) avatarDraftConfig = decodeAvatarConfig(currentAvatar, 'avatar');
    window.chooseAvatarVariant(avatarDraftConfig.base, accessory);
};

window.saveAvatarSelection = function() {
    currentAvatar = normalizeAvatarValue(avatarDraftConfig || currentAvatar, currentUser && ((currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email) || 'avatar');
    refreshCurrentAvatarUI();
    if (currentUser) {
        var client = getSupabase();
        client.auth.updateUser({ data: { avatar: currentAvatar } });
    }
    closeAvatarModal();
};

window.selectAvatar = function(a) {
    var cfg = decodeAvatarConfig(a, currentUser && ((currentUser.user_metadata && currentUser.user_metadata.full_name) || currentUser.email) || 'avatar');
    avatarDraftConfig = cfg;
    saveAvatarSelection();
};

function getAudioCtx() {
    if (!globalAudioCtx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        globalAudioCtx = new AC();
    }
    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }
    return globalAudioCtx;
}

function preloadAudio(name, url) {
    fetch(url).then(function(r) { return r.arrayBuffer(); })
              .then(function(buf) { return getAudioCtx().decodeAudioData(buf); })
              .then(function(decoded) { preloadedAudio[name] = decoded; })
              .catch(function(e) { console.warn('Error audio:', name, e); });
}

document.addEventListener('click', function() {
    getAudioCtx();
    if (!preloadedAudio['error']) preloadAudio('error', './error_sound.mp3');
    if (!preloadedAudio['hurry']) preloadAudio('hurry', './hurry_up.mp3');
}, { once: true });

window.showCustomConfirm = function(msg, callback) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.8);backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
    var modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:24px;width:100%;max-width:400px;padding:32px 24px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.4);animation:popIn .3s cubic-bezier(.34,1.56,.64,1)';
    var icon = document.createElement('div');
    icon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    icon.style.cssText = 'font-size:40px;color:#F59E0B;margin-bottom:16px';
    var text = document.createElement('p');
    text.style.cssText = 'font-size:1rem;font-weight:600;color:#1E293B;margin-bottom:24px;line-height:1.5;';
    text.textContent = msg;
    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:12px;justify-content:center';
    var cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.style.cssText = 'padding:12px 24px;background:#F1F5F9;color:#64748B;border:none;border-radius:12px;font-weight:700;cursor:pointer;flex:1;transition:background 0.2s';
    cancelBtn.onmouseover = function() { this.style.background = '#E2E8F0'; };
    cancelBtn.onmouseout = function() { this.style.background = '#F1F5F9'; };
    cancelBtn.onclick = function() { document.body.removeChild(overlay); };
    var confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Aceptar';
    confirmBtn.style.cssText = 'padding:12px 24px;background:#DC2626;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;flex:1;transition:background 0.2s';
    confirmBtn.onmouseover = function() { this.style.background = '#B91C1C'; };
    confirmBtn.onmouseout = function() { this.style.background = '#DC2626'; };
    confirmBtn.onclick = function() { document.body.removeChild(overlay); callback(); };
    btnRow.appendChild(cancelBtn); btnRow.appendChild(confirmBtn);
    modal.appendChild(icon); modal.appendChild(text); modal.appendChild(btnRow);
    overlay.appendChild(modal); document.body.appendChild(overlay);
};

window.showCustomAlert = function(msg) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.8);backdrop-filter:blur(8px);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
    var modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:24px;width:100%;max-width:400px;padding:32px 24px;text-align:center;box-shadow:0 24px 64px rgba(0,0,0,.4);animation:popIn .3s cubic-bezier(.34,1.56,.64,1)';
    var icon = document.createElement('div');
    icon.innerHTML = '<i class="fas fa-info-circle"></i>';
    icon.style.cssText = 'font-size:40px;color:#3B82F6;margin-bottom:16px';
    var text = document.createElement('p');
    text.style.cssText = 'font-size:1rem;font-weight:600;color:#1E293B;margin-bottom:24px;line-height:1.5;';
    text.textContent = msg;
    var confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Entendido';
    confirmBtn.style.cssText = 'padding:12px 24px;background:#2563EB;color:#fff;border:none;border-radius:12px;font-weight:700;cursor:pointer;width:100%;transition:background 0.2s';
    confirmBtn.onmouseover = function() { this.style.background = '#1D4ED8'; };
    confirmBtn.onmouseout = function() { this.style.background = '#2563EB'; };
    confirmBtn.onclick = function() { document.body.removeChild(overlay); };
    modal.appendChild(icon); modal.appendChild(text); modal.appendChild(confirmBtn);
    overlay.appendChild(modal); document.body.appendChild(overlay);
};

function getSupabase() {
    if (!sb) {
        if (typeof window.supabase === 'undefined' || !window.supabase.createClient) {
            console.error('Supabase library not loaded!');
            return null;
        }
        sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
    return sb;
}

// ═══ AUTHENTICATION ═══

function initAuth() {
    var client = getSupabase();
    if (!client) {
        console.error('Cannot init auth - Supabase not available');
        showLogin();
        return;
    }

    client.auth.getSession().then(function(result) {
        if (result.data && result.data.session && result.data.session.user) {
            currentUser = result.data.session.user;
            enterApp();
        } else {
            showLogin();
        }
    }).catch(function(err) {
        console.error('getSession error:', err);
        showLogin();
    });

    client.auth.onAuthStateChange(function(event, session) {
        if (event === 'SIGNED_IN' && session) {
            currentUser = session.user;
            enterApp();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            isAdmin = false;
            showLogin();
        }
    });
}

function exitQuizToHome() {
    if (window.studentLeaderboardInterval) {
        clearInterval(window.studentLeaderboardInterval);
        window.studentLeaderboardInterval = null;
    }
    // Restaurar header
    var header = document.getElementById('quiz-page-header');
    if (header) header.style.display = 'none';
    
    // Ocultar pantalla de quiz
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'none';
    
    // Limpiar variables de estado
    quizData = null;
    quizCurrentQ = 0;
    quizAnswers = [];
    quizScore = 0;
    quizStreak = 0;
    setQuizFocusMode(false);
    
    // Volver al inicio usando la navegación de la SPA
    navigateTo('inicio');
}
window.exitQuizToHome = exitQuizToHome;

function showLogin() {
    setQuizFocusMode(false);
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-shell').classList.add('hidden');
    var emailEl = document.getElementById('login-email');
    var passEl = document.getElementById('login-password');
    if (emailEl) emailEl.value = '';
    if (passEl) passEl.value = '';
    hideLoginError();
}

function enterApp() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-shell').classList.remove('hidden');

    var email = (currentUser.email || '').toLowerCase().trim();
    isAdmin = (email === ADMIN_EMAIL);

    var name = currentUser.user_metadata && currentUser.user_metadata.full_name
        ? currentUser.user_metadata.full_name
        : email.split('@')[0];

    var usernameEl = document.getElementById('topbar-username');
    var avatarEl = document.getElementById('topbar-avatar');
    var roleEl = document.getElementById('topbar-role');
    var greetEl = document.getElementById('greeting-text');

    if (usernameEl) usernameEl.textContent = name;
    currentAvatar = normalizeAvatarValue((currentUser.user_metadata && currentUser.user_metadata.avatar) || currentAvatar, name);
    setAvatarContent(avatarEl, currentAvatar, name, 'topbar-avatar-media');
    if (roleEl) roleEl.textContent = isAdmin ? 'Administrador' : 'Alumno';
    if (greetEl) greetEl.textContent = getGreeting() + ', ' + name + '!';

    // Show/hide admin sections
    var adminEls = document.querySelectorAll('.admin-only');
    for (var i = 0; i < adminEls.length; i++) {
        if (isAdmin) {
            adminEls[i].classList.remove('hidden');
        } else {
            adminEls[i].classList.add('hidden');
        }
    }
    
    // Show/hide student sections
    var studentEls = document.querySelectorAll('.student-only');
    for (var i = 0; i < studentEls.length; i++) {
        if (isAdmin) {
            studentEls[i].classList.add('hidden');
        } else {
            studentEls[i].classList.remove('hidden');
        }
    }
    
    initAvatars();

    var adminNav = document.getElementById('admin-nav-section');
    if (adminNav) {
        if (isAdmin) {
            adminNav.classList.remove('hidden');
        } else {
            adminNav.classList.add('hidden');
        }
    }

    // ═══ DEVICE GUARD (solo estudiantes, admin exento) ═══
    if (typeof DeviceGuard !== 'undefined' && !isAdmin) {
        var client = getSupabase();
        DeviceGuard.activateDevice(client, email).then(function(res) {
            if (!res.ok) {
                alert('⚠️ ' + (res.error || 'Dispositivo no autorizado'));
                handleLogout();
                return;
            }
            DeviceGuard.startChecking(client, function(reason) {
                alert('🔒 Sesión cerrada: ' + reason);
                handleLogout();
            });
        });
    }

    // Verificar si hay un código en la URL (desde QR)
    var urlParams = new URLSearchParams(window.location.search);
    var urlCode = urlParams.get('code');
    
    // Verificar si hay una sesión de quiz pendiente (por si recargó la página)
    var pendingCode = sessionStorage.getItem('alcocer_quiz_code');
    
    if (urlCode && !isAdmin) {
        // Limpiar el parámetro de la URL para evitar re-joins
        window.history.replaceState({}, document.title, window.location.pathname);
        searchAndStartQuiz(urlCode);
    } else if (pendingCode && !isAdmin) {
        // Si es sesión autodidacta, restaurar desde Supabase
        if (pendingCode.indexOf('SELF') === 0) {
            var savedEvalId = sessionStorage.getItem('alcocer_self_evalid');
            if (savedEvalId) {
                restoreSelfStudy(savedEvalId, pendingCode);
            } else {
                sessionStorage.removeItem('alcocer_quiz_code');
                navigateTo('jugar', true);
            }
        } else {
            searchAndStartQuiz(pendingCode);
        }
    } else {
        var pathParts = window.location.pathname.split('/');
        var pathPage = pathParts[pathParts.length - 1];
        if (pathPage === 'index.html' || pathPage === 'juegos' || pathPage === '') pathPage = 'inicio';
        
        var defaultPage = urlParams.get('page') || pathPage;
        // Students land on JUGAR by default
        if (defaultPage === 'inicio' && !isAdmin) defaultPage = 'jugar';
        if (window.location.pathname.includes('index.html') || urlParams.has('page')) {
            var cleanUrl = defaultPage === 'inicio' ? '/juegos/' : '/juegos/' + defaultPage;
            window.history.replaceState({page: defaultPage}, '', cleanUrl);
        } else {
            window.history.replaceState({page: defaultPage}, '', window.location.pathname);
        }
        navigateTo(defaultPage, true);
    }
}

// ═══ LOGIN HANDLER ═══

function handleLogin(e) {
    if (e) e.preventDefault();
    hideLoginError();

    var emailField = document.getElementById('login-email');
    var passField = document.getElementById('login-password');

    if (!emailField || !passField) {
        showLoginError('Error interno: campos no encontrados');
        return;
    }

    var email = emailField.value.trim();
    var password = passField.value;

    if (!email || !password) {
        showLoginError('Falta usuario o contraseña');
        return;
    }
    if (password.length < 6) {
        showLoginError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    var client = getSupabase();
    if (!client) {
        showLoginError('Error: servicio de autenticación no disponible. Recarga la página.');
        return;
    }

    setLoginLoading(true);

    client.auth.signInWithPassword({
        email: email,
        password: password
    }).then(function(result) {
        setLoginLoading(false);

        if (result.error) {
            console.error('Login error:', result.error.message, result.error);
            var msg = 'Credenciales incorrectas';
            var errMsg = result.error.message || '';
            if (errMsg.indexOf('Invalid login') !== -1) {
                msg = 'Usuario o contraseña incorrectos';
            } else if (errMsg.indexOf('Email not confirmed') !== -1) {
                msg = 'Confirma tu cuenta antes de entrar';
            } else if (errMsg.indexOf('Too many requests') !== -1) {
                msg = 'Demasiados intentos. Espera unos minutos.';
            } else if (errMsg.indexOf('Invalid API key') !== -1) {
                msg = 'Error de configuración del servidor';
            } else if (errMsg.length > 0) {
                msg = errMsg;
            }
            showLoginError(msg);
            return;
        }

        if (result.data && result.data.user) {
            currentUser = result.data.user;
            enterApp();
        } else {
            showLoginError('Respuesta inesperada del servidor. Intenta de nuevo.');
        }
    }).catch(function(err) {
        setLoginLoading(false);
        console.error('Login catch error:', err);
        showLoginError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    });
}

// Make handleLogin globally accessible
window.handleLogin = handleLogin;

function togglePasswordVisibility() {
    var input = document.getElementById('login-password');
    var icon = document.getElementById('login-eye-icon');
    if (!input) return;
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
    } else {
        input.type = 'password';
        if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
    }
}
window.togglePasswordVisibility = togglePasswordVisibility;

function showLoginError(msg) {
    var el = document.getElementById('login-error');
    var txt = document.getElementById('login-error-text');
    if (el) el.classList.remove('hidden');
    if (txt) txt.textContent = msg;
}

function hideLoginError() {
    var el = document.getElementById('login-error');
    if (el) el.classList.add('hidden');
}

function setLoginLoading(loading) {
    var btn = document.getElementById('login-btn');
    var btnText = document.getElementById('login-btn-text');
    var btnLoading = document.getElementById('login-btn-loading');
    if (!btn) return;
    btn.disabled = loading;
    if (btnText) btnText.style.display = loading ? 'none' : '';
    if (btnLoading) {
        if (loading) btnLoading.classList.remove('hidden');
        else btnLoading.classList.add('hidden');
    }
}

// ═══ NAVIGATION ═══

var currentPage = 'inicio';

function setQuizFocusMode(active) {
    if (document.body) {
        document.body.classList.toggle('quiz-focus-mode', !!active);
    }
    var appShell = document.getElementById('app-shell');
    if (appShell) {
        appShell.classList.toggle('quiz-focus-mode', !!active);
    }
}

function navigateTo(page, skipPush) {
    if (page === 'quiz' && typeof quizData === 'undefined' || (page === 'quiz' && !quizData)) {
        page = 'historial'; // Redirect to historial if reloading the quiz page without active session
    }
    currentPage = page;
    setQuizFocusMode(page === 'quiz');

    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) { pages[i].classList.remove('active'); }
    var target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    var sideItems = document.querySelectorAll('.sidebar-nav .nav-item');
    for (var j = 0; j < sideItems.length; j++) { sideItems[j].classList.remove('active'); }
    var activeSidebar = document.querySelector('.sidebar-nav .nav-item[data-page="' + page + '"]');
    if (activeSidebar) activeSidebar.classList.add('active');

    var bottomItems = document.querySelectorAll('.bnav-item');
    for (var k = 0; k < bottomItems.length; k++) { bottomItems[k].classList.remove('active'); }
    var activeBottom = document.querySelector('.bnav-item[data-page="' + page + '"]');
    if (activeBottom) activeBottom.classList.add('active');

    // Load data for specific pages
    if (page === 'biblioteca' && isAdmin) loadLibrary();
    if (page === 'informes' && isAdmin) loadReports();
    if (page === 'historial' && !isAdmin) loadStudentResults();
    if (page === 'jugar' && !isAdmin) { loadExploreSubjects(); loadTopEstudiantes(); }
    if (page === 'jugar' && isAdmin) { loadExploreSubjects(); loadTopEstudiantes(); }

    closeSidebar();

    // Update URL
    if (!skipPush) {
        var cleanUrl = page === 'inicio' ? '/juegos/' : '/juegos/' + page;
        window.history.pushState({page: page}, '', cleanUrl);
    }
}

window.addEventListener('popstate', function(event) {
    if (event.state && event.state.page) {
        navigateTo(event.state.page, true);
    } else {
        var pathParts = window.location.pathname.split('/');
        var pathPage = pathParts[pathParts.length - 1];
        if (pathPage === 'index.html' || pathPage === 'juegos' || pathPage === '') pathPage = 'inicio';
        navigateTo(pathPage, true);
    }
});
window.navigateTo = navigateTo;

// ═══ SIDEBAR ═══

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

// ═══ JOIN BY CODE ═══

// ═══ JOIN BY CODE — Buscar evaluación en Supabase ═══

var quizData = null;       // { evaluacion, preguntas[] }
var quizCurrentQ = 0;      // Índice de pregunta actual
var quizAnswers = [];       // Respuestas del estudiante
var quizSelectedOption = -1;
var quizSessionMode = 'clasico'; // 'clasico' | 'test' | 'equipo' | 'practica'
var quizTeamName = null; // Equipo asignado (modo equipo)
var quizConfirmed = false;
var quizStreakCount = 0;
var quizQuestionStartTime = Date.now();

// ═══ COMODINES / POWER-UPS ═══
var powerups = [];       // 3 comodines disponibles esta sesión
var activePowerup = null; // comodín activo en esta pregunta (ej: x2, eliminar)
var powerupUsedThisQ = false;

var POWERUP_DEFS = {
    // 🎯 PUNTOS
    x2:  { name:'⚡ x2 Puntos',    desc:'Duplica los puntos de esta pregunta',           cat:'puntos', effect:'multiply', value:2,  icon:'⚡', color:'#F59E0B' },
    x3r: { name:'🔥 x3 o x5 Puntos', desc:'Multiplica los puntos de esta pregunta por 3 o 5 al azar', cat:'puntos', effect:'streak_x3', value:0, icon:'🔥', color:'#EF4444' },
    jack: { name:'💎 Jackpot',      desc:'Pregunta aleatoria vale 500-1000 pts extra',   cat:'puntos', effect:'jackpot',   value:0,  icon:'💎', color:'#06B6D4' },
    myst: { name:'🎲 Misterioso',   desc:'Multiplicador aleatorio x2, x3 o x5',          cat:'puntos', effect:'random_mul', value:0, icon:'🎲', color:'#8B5CF6' },
    speed:{ name:'⏳ Bonus Velocidad', desc:'Si respondes en <5s, ganas +200 pts',       cat:'puntos', effect:'speed_bonus', value:200, icon:'⏳', color:'#10B981' },

    // 🛡️ AYUDA
    elim: { name:'❌ Eliminar',     desc:'Elimina una opción incorrecta',                cat:'ayuda',  effect:'remove_wrong', value:1, icon:'❌', color:'#3B82F6' },
    time: { name:'⏱️ +10 Segundos', desc:'Añade 10 segundos al temporizador',           cat:'ayuda',  effect:'add_time',   value:10, icon:'⏱️', color:'#6366F1' },
    hint: { name:'👀 Pista',        desc:'Muestra una pista sobre la respuesta',         cat:'ayuda',  effect:'show_hint',  value:0,  icon:'👀', color:'#EC4899' },
    free: { name:'🎁 Respuesta Gratis', desc:'Esta pregunta cuenta como correcta',       cat:'ayuda',  effect:'free_answer', value:0, icon:'🎁', color:'#22C55E' },
    retry:{ name:'🔄 2a Oportunidad', desc:'Si fallas, puedes intentarlo otra vez',      cat:'ayuda',  effect:'retry',     value:1,  icon:'🔄', color:'#E91E63' },

    // 😈 ATAQUE / DIVERTIDO
    chest:{ name:'🎁 Caja Misteriosa', desc:'¡50% x2, 30% x3, 20% trampa!',              cat:'divertido', effect:'mystery_box', value:0, icon:'🎁', color:'#F97316' },
    sleep:{ name:'💤 Dormido',       desc:'Las opciones se ven borrosas 3 segundos',     cat:'divertido', effect:'blur_options', value:3, icon:'💤', color:'#A78BFA' },
    ultra:{ name:'🤯 Ultra Instinto', desc:'Opciones incorrectas desaparecen lento',      cat:'divertido', effect:'fade_wrong', value:0, icon:'🤯', color:'#FFD700' },
    spy:  { name:'🕵️ Espía',         desc:'Ve qué porcentaje eligió cada opción',        cat:'divertido', effect:'spy_stats',  value:0, icon:'🕵️', color:'#64748B' },
    swap: { name:'🌪️ Roba Puntos',   desc:'Roba 100 pts al primer lugar del podio',      cat:'divertido', effect:'steal_points', value:100, icon:'🌪️', color:'#84CC16' }
};

function pickRandomPowerups() {
    var cats = { puntos: [], ayuda: [], divertido: [] };
    for (var key in POWERUP_DEFS) {
        var p = POWERUP_DEFS[key];
        cats[p.cat].push({ key: key, def: p });
    }
    powerups = [];
    for (var cat in cats) {
        if (cats[cat].length > 0) {
            var idx = Math.floor(Math.random() * cats[cat].length);
            powerups.push(cats[cat][idx]);
        }
    }
}

function renderPowerupBar() {
    var bar = document.getElementById('powerup-bar');
    if (!bar || powerups.length === 0) return;
    var html = '';
    for (var i = 0; i < powerups.length; i++) {
        var p = powerups[i];
        var used = (p._used) ? 'opacity:0.35;pointer-events:none;filter:grayscale(1);' : '';
        html += '<button class="powerup-btn" id="pw-btn-' + i + '" onclick="activatePowerup(' + i + ')" style="' + used + '" title="' + p.def.name + ': ' + p.def.desc + '">';
        html += '<span class="powerup-icon">' + p.def.icon + '</span>';
        html += '<span class="powerup-label">' + p.def.name + '</span>';
        html += '</button>';
    }
    bar.innerHTML = html;
    bar.style.display = 'flex';
}

function activatePowerup(idx) {
    if (idx < 0 || idx >= powerups.length || powerups[idx]._used || activePowerup) return;
    var p = powerups[idx];
    var def = p.def;

    // Marcar como usado (efecto inmediato se aplica, otros requieren activación en la pregunta)
    if (def.effect === 'add_time') {
        addQuizTime(def.value);
        flashPowerup('pw-btn-' + idx);
    } else if (def.effect === 'remove_wrong') {
        removeOneWrongOption();
        flashPowerup('pw-btn-' + idx);
    } else if (def.effect === 'show_hint') {
        showQuestionHint();
        flashPowerup('pw-btn-' + idx);
    } else if (def.effect === 'free_answer') {
        autoAnswerCorrect();
        flashPowerup('pw-btn-' + idx);
    } else if (def.effect === 'blur_options') {
        blurOptionsTemporarily(def.value);
        flashPowerup('pw-btn-' + idx);
    } else if (def.effect === 'fade_wrong') {
        fadeWrongOptions();
        flashPowerup('pw-btn-' + idx);
    } else if (def.effect === 'spy_stats') {
        showSpyStats();
        flashPowerup('pw-btn-' + idx);
    } else {
        // Modificadores que afectan la siguiente respuesta
        activePowerup = def;
        var btn = document.getElementById('pw-btn-' + idx);
        if (btn) btn.style.boxShadow = '0 0 20px ' + def.color + ', 0 0 40px ' + def.color;
        showPowerupToast(def.icon + ' ' + def.name + ' ACTIVADO', def.color);
    }
    powerups[idx]._used = true;
    powerupUsedThisQ = true;
    setTimeout(function() { renderPowerupBar(); }, 400);
}

function flashPowerup(btnId) {
    var btn = document.getElementById(btnId);
    if (!btn) return;
    btn.style.transform = 'scale(1.3)';
    btn.style.boxShadow = '0 0 30px gold';
    setTimeout(function() { if (btn) { btn.style.transform = ''; btn.style.boxShadow = ''; } }, 500);
}

function applyPowerupToAnswer(isCorrect, basePoints) {
    if (!activePowerup) return basePoints;
    var def = activePowerup;
    var pts = basePoints;
    if (def.effect === 'multiply' && isCorrect) {
        pts = basePoints * def.value;
        showPowerupToast(def.icon + ' ¡x' + def.value + '! ' + pts + ' puntos', def.color);
    } else if (def.effect === 'random_mul' && isCorrect) {
        var mults = [2, 3, 5];
        var m = mults[Math.floor(Math.random() * mults.length)];
        pts = basePoints * m;
        showPowerupToast('🎲 ¡x' + m + '! ' + pts + ' puntos', def.color);
    } else if (def.effect === 'jackpot' && isCorrect) {
        var bonus = Math.floor(Math.random() * 501) + 500;
        pts = basePoints + bonus;
        showPowerupToast('💎 ¡JACKPOT! +' + bonus + ' pts extra', def.color);
    } else if (def.effect === 'speed_bonus' && isCorrect) {
        var elapsed = (Date.now() - quizQuestionStartTime) / 1000;
        if (elapsed < 5) { pts = basePoints + def.value; showPowerupToast('⏳ ¡Veloz! +' + def.value + ' pts', def.color); }
        else showPowerupToast('⏳ Muy lento, sin bonus', def.color);
    } else if (def.effect === 'steal_points' && isCorrect) {
        pts = basePoints + def.value;
        showPowerupToast('🌪️ ¡Robaste +' + def.value + ' pts!', def.color);
    } else if (def.effect === 'streak_x3' && isCorrect) {
        var mult = Math.random() < 0.5 ? 3 : 5;
        pts = basePoints * mult;
        showPowerupToast('🔥 ¡Multiplicador x' + mult + '! ' + pts + ' pts', def.color);
    } else if (def.effect === 'mystery_box') {
        var r = Math.random();
        if (r < 0.5) { pts = isCorrect ? basePoints * 2 : 0; showPowerupToast('🎁 ¡Premio! x2 puntos', '#22C55E'); }
        else if (r < 0.8) { pts = isCorrect ? basePoints * 3 : 0; showPowerupToast('🎁 ¡JACKPOT! x3 puntos', '#F59E0B'); }
        else { pts = isCorrect ? Math.max(0, basePoints - 30) : 0; showPowerupToast('🎁 ¡Trampa! -30 pts', '#EF4444'); }
    } else if (def.effect === 'retry' && !isCorrect) {
        showPowerupToast('🔄 ¡Segunda oportunidad!', def.color);
        activePowerup = null;
        return null;
    }
    activePowerup = null;
    powerupUsedThisQ = false;
    return pts;
}

// === EFECTOS INMEDIATOS ===
function addQuizTime(secs) {
    quizTimeLeft += secs;
    var timerBar = document.getElementById('quiz-timer-bar');
    if (timerBar) {
        var totalTimer = 60 + secs;
        var pct = (quizTimeLeft / totalTimer) * 100;
        timerBar.style.transition = 'none';
        timerBar.style.width = pct + '%';
        timerBar.style.background = quizTimeLeft <= 5 ? '#EF4444' : '#22C55E';
        void timerBar.offsetWidth;
        timerBar.style.transition = 'width ' + quizTimeLeft + 's linear, background 0.3s';
    }
    var label = document.getElementById('quiz-timer-label');
    if (label) label.textContent = quizTimeLeft + 's';
    showPowerupToast('⏱️ +' + secs + ' segundos', '#6366F1');
    playBeep(600, 'sine', 0.3);
}

function removeOneWrongOption() {
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opts = pregunta.opciones || [];
    var wrongIndices = [];
    for (var i = 0; i < opts.length; i++) {
        if (!opts[i].correct && i !== quizSelectedOption) wrongIndices.push(i);
    }
    if (wrongIndices.length > 0) {
        var removeIdx = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
        var btn = document.querySelectorAll('.quiz-opt-btn')[removeIdx];
        if (btn) {
            btn.style.opacity = '0';
            btn.style.transform = 'scale(0)';
            btn.style.pointerEvents = 'none';
            btn.style.transition = 'all 0.4s ease';
            if (btn.querySelector('.opt-letter')) btn.querySelector('.opt-letter').textContent = '🚫';
        }
        showPowerupToast('❌ Opción incorrecta eliminada', '#3B82F6');
        playBeep(500, 'square', 0.2);
    }
}

function showQuestionHint() {
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opts = pregunta.opciones || [];
    var correctText = '';
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].correct) correctText = opts[i].text;
    }
    var hint = correctText ? correctText.substring(0, 3) + '...' : 'Pista no disponible';
    var hintEl = document.createElement('div');
    hintEl.style.cssText = 'text-align:center;padding:8px 16px;background:rgba(236,72,153,0.15);border:1px solid rgba(236,72,153,0.3);border-radius:10px;color:#EC4899;font-weight:700;font-size:0.85rem;margin-bottom:8px;animation:pulse 1s infinite';
    hintEl.textContent = '👀 Pista: ' + hint;
    var container = document.getElementById('quiz-question-card');
    if (container) container.appendChild(hintEl);
    setTimeout(function() { if (hintEl.parentNode) hintEl.parentNode.removeChild(hintEl); }, 4000);
    showPowerupToast('👀 Pista revelada', '#EC4899');
}

function autoAnswerCorrect() {
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opts = pregunta.opciones || [];
    for (var i = 0; i < opts.length; i++) {
        if (opts[i].correct) {
            quizSelectedOption = i;
            confirmQuizAnswer();
            return;
        }
    }
}

function blurOptionsTemporarily(secs) {
    var btns = document.querySelectorAll('.quiz-opt-btn');
    for (var i = 0; i < btns.length; i++) {
        btns[i].style.filter = 'blur(4px)';
        btns[i].style.transition = 'filter 3s ease';
    }
    setTimeout(function() {
        for (var i = 0; i < btns.length; i++) btns[i].style.filter = '';
    }, secs * 1000);
    showPowerupToast('💤 Opciones borrosas ' + secs + 's', '#A78BFA');
}

function fadeWrongOptions() {
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opts = pregunta.opciones || [];
    var btns = document.querySelectorAll('.quiz-opt-btn');
    for (var i = 0; i < opts.length; i++) {
        if (!opts[i].correct && btns[i]) {
            btns[i].style.opacity = '0.3';
            btns[i].style.transition = 'opacity 2s ease';
            setTimeout((function(btn) { return function() { btn.style.opacity = '0'; btn.style.pointerEvents = 'none'; }; })(btns[i]), 2000);
        }
    }
    showPowerupToast('🤯 Incorrectas se desvanecen...', '#FFD700');
}

function showSpyStats() {
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opts = pregunta.opciones || [];
    var btns = document.querySelectorAll('.quiz-opt-btn');
    for (var i = 0; i < opts.length; i++) {
        var pct = Math.floor(Math.random() * 60) + 10;
        if (opts[i].correct) pct = Math.floor(Math.random() * 30) + 50;
        if (btns[i]) {
            var badge = document.createElement('span');
            badge.style.cssText = 'position:absolute;top:-8px;right:-8px;background:rgba(0,0,0,0.8);color:#fff;font-size:0.65rem;padding:2px 8px;border-radius:10px;font-weight:700;z-index:10';
            badge.textContent = pct + '%';
            btns[i].style.position = 'relative';
            btns[i].appendChild(badge);
            setTimeout(function(b) { return function() { if (b.parentNode) b.parentNode.removeChild(b); }; }(badge), 5000);
        }
    }
    showPowerupToast('🕵️ Estadísticas reveladas 5s', '#64748B');
}

function showPowerupToast(msg, color) {
    var existing = document.getElementById('pw-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.id = 'pw-toast';
    toast.style.cssText = 'position:fixed;top:20%;left:50%;transform:translateX(-50%);z-index:5000;padding:16px 32px;border-radius:16px;font-weight:800;font-size:1.1rem;text-align:center;animation:popIn .4s cubic-bezier(.34,1.56,.64,1);box-shadow:0 8px 32px rgba(0,0,0,0.4);pointer-events:none';
    toast.style.background = 'rgba(15,23,42,0.95)';
    toast.style.border = '2px solid ' + color;
    toast.style.color = '#fff';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(function() { if (toast.parentNode) toast.remove(); }, 500);
    }, 2000);
}

function cleanupPowerupsForNextQ() {
    activePowerup = null;
    powerupUsedThisQ = false;
    var toast = document.getElementById('pw-toast');
    if (toast) toast.remove();
    // Si hay streak_x3 sin terminar, mantener
    if (quizStreakCount === undefined) quizStreakCount = 0;
}

// ═══ SELECCIÓN DIVERSA DE PREGUNTAS (garantiza mc, ms, fb, tf) ═══
function selectDiverseQuestions(allQuestions, total) {
    var shuffled = allQuestions.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = temp;
    }
    var byType = { mc:[], ms:[], fb:[], tf:[], oa:[], dnd:[], poll:[], other:[] };
    for (var i = 0; i < shuffled.length; i++) {
        var t = shuffled[i].tipo || 'mc';
        if (byType[t]) byType[t].push(shuffled[i]);
        else byType['other'].push(shuffled[i]);
    }
    var result = [];
    function takeFrom(type, min) {
        for (var i = 0; i < min && byType[type].length > 0; i++) {
            result.push(byType[type].shift());
        }
    }
    takeFrom('fb', 2);
    takeFrom('ms', 2);
    takeFrom('tf', 1);
    takeFrom('mc', 2);
    var remaining = [];
    for (var key in byType) {
        for (var k = 0; k < byType[key].length; k++) remaining.push(byType[key][k]);
    }
    for (var i = remaining.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = remaining[i]; remaining[i] = remaining[j]; remaining[j] = temp;
    }
    while (result.length < total && remaining.length > 0) {
        result.push(remaining.shift());
    }
    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = result[i]; result[i] = result[j]; result[j] = temp;
    }
    return result;
}

// ═══ SELECCIÓN DE COMODÍN CON TARJETAS VOLTEADAS (pregunta 4 y 8) ═══
var flippedCards = false;

function showPowerupCards() {
    flippedCards = false;
    var available = [];
    for (var key in POWERUP_DEFS) {
        var used = false;
        for (var u = 0; u < powerups.length; u++) {
            if (powerups[u].key === key && powerups[u]._used) { used = true; break; }
        }
        if (!used) available.push({ key: key, def: POWERUP_DEFS[key] });
    }

    var cats = { puntos: [], ayuda: [], divertido: [] };
    for (var i = 0; i < available.length; i++) {
        var c = available[i].def.cat;
        if (cats[c]) cats[c].push(available[i]);
    }
    var selected = [];
    for (var cat in cats) {
        if (cats[cat].length > 0) {
            var idx = Math.floor(Math.random() * cats[cat].length);
            selected.push(cats[cat][idx]);
        }
    }
    while (selected.length < 3 && available.length > selected.length) {
        var r = available[Math.floor(Math.random() * available.length)];
        if (selected.indexOf(r) === -1) selected.push(r);
    }

    var overlay = document.createElement('div');
    overlay.id = 'powerup-cards-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10000;background:radial-gradient(ellipse at 50% 30%,#1a1040,#0a0520 60%,#020010);backdrop-filter:blur(16px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;animation:fadeIn .4s ease';

    var html = '';
    // Partículas de fondo estilo campo de duelo
    html += '<div style="position:absolute;inset:0;overflow:hidden;pointer-events:none">';
    for (var p = 0; p < 20; p++) {
        var px = Math.random() * 100; var py = Math.random() * 100;
        var pd = 1 + Math.random() * 3;
        html += '<div style="position:absolute;left:' + px + '%;top:' + py + '%;width:' + pd + 'px;height:' + pd + 'px;background:rgba(139,90,43,0.6);border-radius:50%;animation:floatUp ' + (4+Math.random()*6) + 's linear infinite;animation-delay:' + (Math.random()*5) + 's"></div>';
    }
    html += '</div>';

    html += '<div style="text-align:center;margin-bottom:16px;position:relative;z-index:1">';
    html += '<h2 style="color:#fff;font-size:1.3rem;font-weight:900;margin:0 0 2px;text-shadow:0 0 20px rgba(168,85,247,0.6);letter-spacing:1px">⚡ TURNO DE COMODÍN ⚡</h2>';
    html += '<p style="color:rgba(255,255,255,0.4);font-size:0.75rem;margin:0">Selecciona una carta boca abajo</p>';
    html += '</div>';

    var colors = ['#C62828', '#1565C0', '#2E7D32'];
    var catNames = { puntos: '🎯 PUNTOS', ayuda: '🛡️ AYUDA', divertido: '😈 DIVERTIDO' };
    html += '<div style="display:flex;gap:24px;flex-wrap:wrap;justify-content:center;align-items:center;perspective:1400px;max-width:800px;margin:0 auto">';
    for (var s = 0; s < selected.length; s++) {
        var card = selected[s];
        var c = colors[s % colors.length];
        var stars = s === 0 ? '★★★★★' : s === 1 ? '★★★★' : '★★★';
        var rarityLabel = s === 0 ? 'ULTRA RARA' : s === 1 ? 'SÚPER RARA' : 'RARA';
        
        var isSpell = card.def.cat === 'ayuda';
        var isTrap = card.def.cat === 'divertido';
        var typeIcon = isSpell ? '🛡️' : isTrap ? '😈' : '⚡';
        var typeLabel = isSpell ? 'HABILIDAD' : isTrap ? 'EFECTO' : 'MEJORA';
        var catLabel = card.def.cat === 'puntos' ? '🎯 PUNTOS' : card.def.cat === 'ayuda' ? '🛡️ AYUDA' : '😈 DIVERTIDO';

        html += '<div class="powerup-flip-card ygo-card" id="pcard-' + s + '" onclick="choosePowerupCard(\'' + card.key + '\', ' + s + ')" style="width:210px;height:300px;cursor:pointer;animation:cardSlideIn .5s cubic-bezier(.34,1.56,.64,1) ' + (s * 0.12) + 's both" onmouseover="if(!flippedCards)this.style.transform=\'translateY(-16px) scale(1.03)\'" onmouseout="if(!flippedCards)this.style.transform=\'\'">';
        html += '<div class="powerup-flip-inner" id="pcinner-' + s + '">';

        // ═══ DORSO DE CARTA (BOCA ABAJO) ═══
        html += '<div class="powerup-flip-front ygo-card-back" style="background:linear-gradient(160deg,#3e2a14 0%,#2d1a08 30%,#1a0c04 60%,#3e2a14 100%);border:5px solid #b8860b;border-radius:14px;width:100%;height:100%;display:flex;align-items:center;justify-content:center;backface-visibility:hidden;position:absolute;inset:0;overflow:hidden;box-shadow:inset 0 0 60px rgba(139,105,20,0.15)">';
        html += '<div style="position:absolute;inset:6px;border:2px solid #8B6914;border-radius:10px"></div>';
        html += '<div style="position:absolute;inset:10px;border:1px solid #b8860b;border-radius:8px"></div>';
        html += '<div style="position:absolute;inset:14px;border:2px dotted #b8860b30;border-radius:7px"></div>';
        html += '<div style="position:absolute;z-index:3;color:rgba(184,134,11,0.25);font-size:10rem;font-weight:900;font-family:serif;line-height:1;text-shadow:0 0 40px rgba(184,134,11,0.3)">?</div>';
        html += '<div style="position:relative;z-index:4;color:#b8860b;font-size:3.5rem;font-weight:900;text-shadow:0 0 16px #b8860b80,0 0 32px #b8860b40;font-family:serif">?</div>';
        html += '<div style="position:absolute;top:22px;left:50%;transform:translateX(-50%);color:#8B6914;font-size:0.5rem;font-weight:900;letter-spacing:3px;z-index:5">ALCOCERMED</div>';
        html += '<div style="position:absolute;bottom:22px;left:50%;transform:translateX(-50%);color:#8B6914;font-size:0.48rem;font-weight:900;letter-spacing:4px;z-index:5">POWER-UP</div>';
        html += '</div>';

        // ═══ FRENTE DE CARTA (BOCA ARRIBA - REVELADA) ═══
        html += '<div class="powerup-flip-back ygo-card-front" style="border: 4px solid ' + c + '; box-shadow: 0 0 30px ' + c + '30, 0 0 60px ' + c + '10;">';
        html += '<div class="ygo-card-border-neon" style="border: 2px solid ' + c + '60;"></div>';
        html += '<div class="ygo-card-banner" style="background: linear-gradient(180deg,' + c + ' 0%,' + c + 'dd 100%); border-bottom: 2px solid rgba(255,255,255,0.3);">' + card.def.name + '</div>';
        html += '<div class="ygo-card-art-area" style="background: radial-gradient(ellipse at 50% 30%,' + c + '30,transparent 60%), radial-gradient(ellipse at 30% 70%,' + c + '15,transparent 50%);">';
        html += '<div class="ygo-card-icon" style="filter: drop-shadow(0 0 20px ' + c + '80) drop-shadow(2px 3px 6px rgba(0,0,0,0.5));">' + card.def.icon + '</div>';
        html += '<div class="ygo-card-category-circle" style="background: ' + c + '; box-shadow: 0 0 10px ' + c + '80;">' + typeIcon + '</div>';
        html += '</div>';
        html += '<div class="ygo-card-rarity-row" style="color: ' + c + '; border-top: 1px solid ' + c + '30; border-bottom: 1px solid ' + c + '30;">' + catLabel + ' • ' + rarityLabel + '</div>';
        html += '<div class="ygo-card-desc-box" style="border: 1px solid ' + c + '40;">' + card.def.desc + '</div>';
        html += '<div class="ygo-card-footer">';
        html += '<span>' + typeLabel + '</span>';
        html += '<span style="color:' + c + '">★ POWER UP</span>';
        html += '</div>';
        html += '<div style="position:absolute;bottom:0;left:10%;right:10%;height:2px;background:linear-gradient(90deg,transparent,' + c + '80,' + c + '80,transparent);z-index:2"></div>';
        html += '</div>';

        html += '</div>'; // flip-inner
        html += '</div>'; // flip-card
    }
    html += '</div>';

    html += '<button onclick="skipPowerupCards()" style="margin-top:20px;background:transparent;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.4);padding:6px 20px;border-radius:20px;cursor:pointer;font-size:0.75rem;transition:all .2s;margin-top:20px">Saltar →</button>';

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    var bar = document.getElementById('powerup-bar');
    if (bar) bar.style.display = 'none';
}

function choosePowerupCard(key, cardIdx) {
    if (flippedCards) return;
    flippedCards = true;

    var def = POWERUP_DEFS[key];
    if (!def) return;

    // Voltear solo la carta seleccionada
    var inner = document.getElementById('pcinner-' + cardIdx);
    if (inner) {
        inner.style.transition = 'transform 0.7s cubic-bezier(.34,1.56,.64,1)';
        inner.style.transform = 'rotateY(180deg)';
    }

    // Atenuar las otras 2 cartas
    for (var s = 0; s < 3; s++) {
        if (s !== cardIdx) {
            var other = document.getElementById('pcard-' + s);
            if (other) {
                other.style.opacity = '0.3';
                other.style.filter = 'grayscale(1)';
                other.style.transform = 'scale(0.9)';
                other.style.pointerEvents = 'none';
            }
        }
    }

    // Brillo dorado en la elegida
    setTimeout(function() {
        var chosen = document.getElementById('pcard-' + cardIdx);
        if (chosen) {
            chosen.style.transform = 'scale(1.05)';
            chosen.style.filter = 'drop-shadow(0 0 30px gold) drop-shadow(0 0 60px gold)';
        }
    }, 700);

    // Guardar para aplicar
    pendingPowerupKey = key;

    showPowerupToast(def.icon + ' ' + def.name + ' SELECCIONADO', '#FFD700');
    playBeep(880, 'sine', 0.3);
    setTimeout(function() { playBeep(1100, 'sine', 0.3); }, 150);

    setTimeout(function() {
        closePowerupCards();
    }, 5000);
}

function skipPowerupCards() {
    flippedCards = true;
    pendingPowerupKey = null;
    closePowerupCards();
}

var pendingPowerupKey = null;

function closePowerupCards() {
    var overlay = document.getElementById('powerup-cards-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s';
        setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 300);
    }
    if (quizCurrentQ >= quizData.preguntas.length) { showQuizResults(); return; }

    // Renderizar la pregunta
    renderQuizQuestion();

    // Aplicar el comodín elegido (efecto inmediato o diferido)
    setTimeout(function() {
        applyPendingPowerup();
    }, 100);
}

function applyPendingPowerup() {
    if (!pendingPowerupKey) return;
    var def = POWERUP_DEFS[pendingPowerupKey];
    pendingPowerupKey = null;
    if (!def) return;

    var isImmediate = (def.effect === 'add_time' || def.effect === 'remove_wrong' ||
        def.effect === 'show_hint' || def.effect === 'free_answer' ||
        def.effect === 'blur_options' || def.effect === 'fade_wrong' ||
        def.effect === 'spy_stats');

    if (def.effect === 'add_time') {
        addQuizTime(def.value);
    } else if (def.effect === 'remove_wrong') {
        removeOneWrongOption();
    } else if (def.effect === 'show_hint') {
        showQuestionHint();
    } else if (def.effect === 'free_answer') {
        autoAnswerCorrect();
    } else if (def.effect === 'blur_options') {
        blurOptionsTemporarily(def.value);
    } else if (def.effect === 'fade_wrong') {
        fadeWrongOptions();
    } else if (def.effect === 'spy_stats') {
        showSpyStats();
    } else {
        // Efectos diferidos: se aplican al confirmar la respuesta
        activePowerup = def;
        showPowerupToast(def.icon + ' ' + def.name + ' ACTIVO para esta pregunta', def.color);
    }

    if (isImmediate) {
        showPowerupToast(def.icon + ' ' + def.name + ' APLICADO', def.color);
    }
}

var exploreCurrentSubject = null;

// ═══ JUGAR — MODO AUTODIDACTA ═══
// ⚠️ LAS 3 MATERIAS OFICIALES DE ALCOCERMED. NO MODIFICAR.

var SUBJECTS = [
    { name: 'MORFOFUNCION',      color: '#EF4444', emoji: 'M' },
    { name: 'BIOLOGIA CELULAR', color: '#3B82F6', emoji: 'BC' },
    { name: 'EDUCACION PARA LA SALUD', color: '#10B981', emoji: 'ES' }
];

var DEMO_ACCESS_ONLY = true;

function normalizeDemoText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();
}

function isDemoEvaluation(ev) {
    var text = normalizeDemoText([
        ev && ev.titulo,
        ev && ev.tema,
        ev && ev.codigo,
        ev && ev.asignatura
    ].join(' '));
    return text.indexOf('PRUEBA') !== -1 || text.indexOf('DEMO') !== -1 || text.indexOf('MUESTRA') !== -1;
}

function canAccessEvaluation(ev) {
    return isAdmin || !DEMO_ACCESS_ONLY || isDemoEvaluation(ev);
}

function showLockedDemoNotice() {
    showCustomAlert('Contenido bloqueado por ahora.\n\nPara la demostracion del martes solo estan habilitadas las preguntas de prueba (DEMO). Cuando el estudiante compre el acceso, se desbloquearan las demas evaluaciones.');
}
window.showLockedDemoNotice = showLockedDemoNotice;

function subjectColor(name) {
    for (var i = 0; i < SUBJECTS.length; i++) {
        if (name.toUpperCase().indexOf(SUBJECTS[i].name) !== -1) return SUBJECTS[i].color;
    }
    return SUBJECTS[0].color; // fallback: MORFOFUNCION
}
function subjectEmoji(name) {
    for (var i = 0; i < SUBJECTS.length; i++) {
        if (name.toUpperCase().indexOf(SUBJECTS[i].name) !== -1) return SUBJECTS[i].emoji;
    }
    return SUBJECTS[0].emoji;
}
function subjectMatch(dbName, subjectName) {
    return dbName.toUpperCase().indexOf(subjectName) !== -1;
}

function adjustColor(hex, amount) {
    var num = parseInt(hex.replace('#',''), 16);
    var r = Math.min(255, Math.max(0, (num >> 16) + amount));
    var g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
    var b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return '#' + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function loadExploreSubjects() {
    var client = getSupabase();
    var grid = document.getElementById('explorar-subject-grid');
    if (!grid) return;
    
    document.getElementById('explorar-subject-grid').style.display = '';
    var evalList = document.getElementById('explorar-eval-list');
    if (evalList) evalList.style.display = 'none';
    var backBtn = document.getElementById('explorar-back-btn');
    if (backBtn) backBtn.style.display = 'none';
    exploreCurrentSubject = null;
    var h1 = document.querySelector('#page-jugar .page-header h1');
    if (h1) h1.innerHTML = '<i class="fas fa-gamepad"></i> JUGAR';
    var filterBar = document.getElementById('explorar-filter-bar');
    if (filterBar) filterBar.innerHTML = '';

    if (!client) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-exclamation-triangle" style="color:#F59E0B"></i><p>Error de conexión</p><small>Recarga la página e inicia sesión</small></div>';
        return;
    }

    grid.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6;grid-column:1/-1"><i class="fas fa-spinner fa-spin" style="font-size:28px"></i><p style="margin-top:12px">Cargando materias...</p></div>';

    client.from('evaluaciones').select('asignatura, id, titulo, tema, codigo').eq('publicado', true).then(function(r) {
        var counts = {};
        var demoCounts = {};
        for (var i = 0; i < SUBJECTS.length; i++) {
            counts[SUBJECTS[i].name] = 0;
            demoCounts[SUBJECTS[i].name] = 0;
        }
        
        if (r.data && r.data.length > 0) {
            for (var i = 0; i < r.data.length; i++) {
                var dbName = (r.data[i].asignatura || '').toUpperCase();
                var matched = false;
                for (var s = 0; s < SUBJECTS.length; s++) {
                    if (dbName.indexOf(SUBJECTS[s].name) !== -1) {
                        counts[SUBJECTS[s].name]++;
                        if (isDemoEvaluation(r.data[i])) demoCounts[SUBJECTS[s].name]++;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    counts[SUBJECTS[0].name]++; // default: MORFOFUNCION
                    if (isDemoEvaluation(r.data[i])) demoCounts[SUBJECTS[0].name]++;
                }
            }
        }

        var html = '';
        for (var s = 0; s < SUBJECTS.length; s++) {
            var subj = SUBJECTS[s];
            var cnt = counts[subj.name] || 0;
            var demoCnt = demoCounts[subj.name] || 0;
            var missionNo = s + 1;
            var progress = demoCnt > 0 ? 100 : (cnt > 0 ? 42 : 18);
            var statusText = demoCnt > 0 ? 'Demo' : (cnt > 0 ? 'Bloqueado' : 'Pronto');
            var lockClass = demoCnt > 0 ? '' : ' subject-mission-locked';
            html += '<div class="explorar-subject-card subject-mission-card' + lockClass + '" onclick="loadSubjectEvaluations(\'' + subj.name + '\')" style="--subject-color:' + subj.color + '">';
            html += '<div class="mission-shine"></div>';
            html += '<div class="mission-topline"><span>MISION ' + missionNo + '</span><strong>' + statusText + '</strong></div>';
            html += '<div class="mission-main">';
            html += '<div class="mission-orb"><span>' + subj.emoji + '</span></div>';
            html += '<div class="mission-copy"><h3>' + subj.name + '</h3><p>' + demoCnt + ' demo disponible' + (demoCnt !== 1 ? 's' : '') + (cnt > demoCnt ? ' • ' + (cnt - demoCnt) + ' con candado' : '') + '</p></div>';
            html += '<div class="mission-play"><i class="fas ' + (demoCnt > 0 ? 'fa-play' : 'fa-lock') + '"></i></div>';
            html += '</div>';
            html += '<div class="mission-progress"><span style="width:' + progress + '%"></span></div>';
            html += '</div>';
        }
        grid.innerHTML = html;
    }).catch(function(err) {
        grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-exclamation-triangle" style="color:#F59E0B"></i><p>Error al cargar</p><small>Intenta de nuevo más tarde</small></div>';
    });
}

function loadTopEstudiantes() {
    var listEl = document.getElementById('top-estudiantes-list');
    if (!listEl) return;
    listEl.innerHTML = '<div class="game-ranking-shell"><div style="text-align:center;padding:20px;color:#8E90A6"><i class="fas fa-spinner fa-spin"></i> Cargando ranking...</div></div>';

    var client = getSupabase();
    if (!client) {
        listEl.innerHTML = '<div class="game-ranking-shell"><div style="text-align:center;padding:12px;color:#EF4444">Error de conexión</div></div>';
        return;
    }

    client.from('evaluacion_resultados').select('user_id, puntaje, porcentaje').then(function(r) {
        if (r.error || !r.data || r.data.length === 0) {
            updateShowcasePodium([]);
            listEl.innerHTML = '<div class="game-ranking-shell"><div class="empty-state"><i class="fas fa-trophy" style="color:#FFD700"></i><p>Aún no hay resultados</p><small>¡Sé el primero en jugar!</small></div></div>';
            return;
        }

        var users = {};
        for (var i = 0; i < r.data.length; i++) {
            var uid = r.data[i].user_id;
            if (!users[uid]) users[uid] = { total: 0, count: 0, bestPct: 0 };
            users[uid].total += (r.data[i].puntaje || 0);
            users[uid].count++;
            if ((r.data[i].porcentaje || 0) > users[uid].bestPct) users[uid].bestPct = r.data[i].porcentaje;
        }

        var sorted = [];
        for (var uid in users) {
            sorted.push({ user_id: uid, total: users[uid].total, count: users[uid].count, bestPct: users[uid].bestPct });
        }
        sorted.sort(function(a, b) { return b.total - a.total; });
        sorted = sorted.slice(0, 10);

        var userIds = sorted.map(function(s) { return s.user_id; });
        client.from('evaluacion_participantes').select('user_id, nombre').in('user_id', userIds).then(function(nRes) {
            var nameMap = {};
            if (nRes.data) {
                for (var n = 0; n < nRes.data.length; n++) {
                    var raw = nRes.data[n].nombre || 'Estudiante';
                    var av = '';
                    var nm = raw;
                    if (raw.indexOf('|') !== -1) {
                        var parts = raw.split('|');
                        av = parts[0];
                        nm = parts.slice(1).join('|');
                    }
                    av = normalizeAvatarValue(av, nm);
                    if (!nameMap[nRes.data[n].user_id]) nameMap[nRes.data[n].user_id] = { nombre: nm, avatar: av };
                }
            }

            var decorated = [];
            for (var x = 0; x < sorted.length; x++) {
                var item = sorted[x];
                var info = nameMap[item.user_id] || { nombre: 'Estudiante', avatar: normalizeAvatarValue('', 'Estudiante ' + x) };
                decorated.push({
                    user_id: item.user_id,
                    nombre: info.nombre,
                    avatar: normalizeAvatarValue(info.avatar, info.nombre),
                    total: item.total,
                    bestPct: item.bestPct,
                    rank: x + 1
                });
            }

            updateShowcasePodium(decorated.slice(0, 3));

            var html = '<div class="game-ranking-shell">';
            html += '<div class="game-ranking-header"><div><h3>Ranking General</h3><p>Los estudiantes más destacados del momento</p></div><span class="game-ranking-chip">Top ' + decorated.length + '</span></div>';
            var listStart = decorated.length > 3 ? 3 : 0;
            html += '<div class="game-ranking-list">';
            for (var i = listStart; i < decorated.length; i++) {
                var s = decorated[i];
                var pctClass = s.bestPct >= 80 ? 'pct-high' : (s.bestPct >= 50 ? 'pct-mid' : 'pct-low');
                html += '<div class="game-rank-card">';
                html += '<div class="game-rank-number game-rank-number-plain">' + s.rank + '</div>';
                html += '<div class="game-rank-avatar">' + avatarMarkup(s.avatar, s.nombre, 'game-rank-avatar-media') + '</div>';
                html += '<div class="game-rank-info"><div class="game-rank-name">' + s.nombre + '</div>';
                html += '<div class="game-rank-meta">' + s.total + ' pts · <span class="game-rank-pct ' + pctClass + '">' + s.bestPct + '%</span></div></div>';
                html += '<div class="game-rank-arrow"><i class="fas fa-chevron-right"></i></div>';
                html += '</div>';
            }
            if (decorated.length <= 3) {
                html += '<div class="empty-state" style="padding:20px 12px"><i class="fas fa-stars"></i><p>El ranking se completará cuando más estudiantes jueguen.</p></div>';
            }
            html += '</div></div>';
            listEl.innerHTML = html;
        });
    }).catch(function() {
        updateShowcasePodium([]);
        listEl.innerHTML = '<div class="game-ranking-shell"><div style="text-align:center;padding:12px;color:#EF4444">Error al cargar ranking</div></div>';
    });
}

function updateShowcasePodium(entries) {
    var layout = [
        { selector: '.showcase-player-2', rank: 2, idx: 1 },
        { selector: '.showcase-player-1', rank: 1, idx: 0 },
        { selector: '.showcase-player-3', rank: 3, idx: 2 }
    ];

    for (var i = 0; i < layout.length; i++) {
        var slot = layout[i];
        var player = document.querySelector(slot.selector);
        if (!player) continue;
        var entry = entries[slot.idx];
        var avatarNode = player.querySelector('.showcase-avatar');
        var nameNode = player.querySelector('.showcase-name');
        var scoreNode = player.querySelector('.showcase-score');
        var rankNode = player.querySelector('.showcase-pillar strong');
        if (rankNode) rankNode.textContent = slot.rank;
        if (!entry) {
            player.classList.add('showcase-player-empty');
            if (avatarNode) avatarNode.innerHTML = '<span class="showcase-avatar-fallback">?</span>';
            if (nameNode) nameNode.textContent = 'Próximo';
            if (scoreNode) scoreNode.innerHTML = '0 pts<br><span>0%</span>';
            continue;
        }
        player.classList.remove('showcase-player-empty');
        if (avatarNode) avatarNode.innerHTML = avatarMarkup(entry.avatar, entry.nombre, 'showcase-avatar-media');
        if (nameNode) nameNode.textContent = entry.nombre;
        if (scoreNode) scoreNode.innerHTML = entry.total + ' pts<br><span>' + entry.bestPct + '%</span>';
    }
}

function loadSubjectEvaluations(subject) {
    exploreCurrentSubject = subject;
    var client = getSupabase();
    if (!client) return;
    var grid = document.getElementById('explorar-subject-grid');
    if (grid) grid.style.display = 'none';
    var backBtn = document.getElementById('explorar-back-btn');
    if (backBtn) backBtn.style.display = '';
    var color = subjectColor(subject);
    var emoji = subjectEmoji(subject);
    var h1 = document.querySelector('#page-jugar .page-header h1');
    if (h1) h1.innerHTML = '<i class="fas fa-arrow-left" style="cursor:pointer;margin-right:8px" onclick="loadExploreSubjects()"></i>' + emoji + ' ' + subject;
    var listEl = document.getElementById('explorar-eval-list');
    if (!listEl) return;
    listEl.style.display = '';
    listEl.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:28px"></i><p style="margin-top:12px">Cargando evaluaciones...</p></div>';

    // Buscar por coincidencia flexible con el nombre de la materia
    client.from('evaluaciones').select('id, titulo, tema, codigo, asignatura, created_at').eq('publicado', true).order('created_at', { ascending: false }).then(function(evRes) {
        if (evRes.error) {
            listEl.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar</p></div>';
            return;
        }
        // Filtrar manualmente: MORFOFUNCION recibe todo lo que no es de las otras 2 materias
        var matching = [];
        var isMorfo = (subject === 'MORFOFUNCION');
        for (var i = 0; i < evRes.data.length; i++) {
            var dbAsig = (evRes.data[i].asignatura || '').toUpperCase();
            if (isMorfo) {
                if (dbAsig.indexOf('BIOLOGIA CELULAR') === -1 && dbAsig.indexOf('EDUCACION PARA LA SALUD') === -1) {
                    matching.push(evRes.data[i]);
                }
            } else {
                if (subjectMatch(evRes.data[i].asignatura || '', subject)) {
                    matching.push(evRes.data[i]);
                }
            }
        }
        if (matching.length === 0) {
            listEl.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>Sin evaluaciones en ' + subject + '</p><small>Vuelve más tarde</small></div>';
            return;
        }

        // Query question count per evaluacion
        var evalIds = matching.map(function(e) { return e.id; });
        client.from('evaluacion_preguntas').select('evaluacion_id').in('evaluacion_id', evalIds).then(function(qRes) {
            var countMap = {};
            if (qRes.data) {
                for (var j = 0; j < qRes.data.length; j++) {
                    var eid = qRes.data[j].evaluacion_id;
                    countMap[eid] = (countMap[eid] || 0) + 1;
                }
            }

            var html = '';
            for (var i = 0; i < matching.length; i++) {
                var ev = matching[i];
                var preguntaCount = countMap[ev.id] || 0;
                var temaHtml = ev.tema ? ' • ' + ev.tema : '';
                var fecha = new Date(ev.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                var isDemo = isDemoEvaluation(ev);
                var isLocked = !canAccessEvaluation(ev);
                html += '<div class="explorar-eval-card' + (isLocked ? ' explorar-eval-locked' : '') + '" style="border-left:4px solid ' + color + '">';
                html += '<div style="flex:1;min-width:180px">';
                html += '<h4 style="font-size:1.05rem;font-weight:800;color:var(--text);margin:0 0 6px">' + (ev.titulo || 'Sin título') + (isDemo ? ' <span style="background:#FEF3C7;color:#92400E;font-size:0.65rem;padding:2px 8px;border-radius:8px;font-weight:700">🎯 DEMO</span>' : '') + '</h4>';
                html += '<div class="eval-meta" style="display:flex;flex-wrap:wrap;gap:10px;font-size:0.78rem;color:#94A3B8">';
                html += '<span><i class="fas fa-calendar"></i> ' + fecha + '</span>';
                if (ev.tema) html += '<span><i class="fas fa-tag"></i> ' + ev.tema + '</span>';
                html += '<span><i class="fas fa-question-circle"></i> ' + preguntaCount + ' preguntas</span>';
                if (isLocked) html += '<span class="locked-access-badge"><i class="fas fa-lock"></i> BLOQUEADO</span>';
                html += '</div></div>';
                if (isLocked) {
                    html += '<button class="explorar-btn-study explorar-btn-locked" onclick="event.stopPropagation();showLockedDemoNotice()" style="font-size:0.9rem;padding:14px 32px;border-radius:16px;font-weight:800;letter-spacing:0.5px"><i class="fas fa-lock"></i> DESBLOQUEAR</button>';
                } else {
                    html += '<button class="explorar-btn-study" onclick="event.stopPropagation();startSelfStudy(\'' + ev.id + '\')" style="background:linear-gradient(135deg,' + color + ', ' + adjustColor(color, -20) + ');font-size:0.9rem;padding:14px 32px;border-radius:16px;font-weight:800;letter-spacing:0.5px"><i class="fas fa-play"></i> JUGAR DEMO</button>';
                }
                html += '</div>';
            }
            listEl.innerHTML = html;
        });
    });
}

function startSelfStudy(evalId) {
    if (!currentUser) { alert('Inicia sesión primero'); return; }
    var client = getSupabase();
    if (!client) return;

    var code = 'SELF' + Math.random().toString(36).substring(2, 6).toUpperCase();
    sessionStorage.setItem('alcocer_quiz_code', code);
    sessionStorage.setItem('alcocer_self_evalid', evalId);
    sessionStorage.removeItem('alcocer_quiz_state_' + code);
    sessionStorage.removeItem('alcocer_quiz_qids_' + code);

    client.from('evaluaciones').select('*').eq('id', evalId).single().then(function(r) {
        if (r.error || !r.data) {
            alert('Evaluación no encontrada');
            sessionStorage.removeItem('alcocer_quiz_code');
            return;
        }
        var evaluacion = r.data;
        if (!canAccessEvaluation(evaluacion)) {
            showLockedDemoNotice();
            sessionStorage.removeItem('alcocer_quiz_code');
            sessionStorage.removeItem('alcocer_self_evalid');
            return;
        }
        evaluacion.codigo = code;
        evaluacion.publicado = true;

        client.from('evaluacion_preguntas').select('*').eq('evaluacion_id', evaluacion.id).order('orden').then(function(pResult) {
            if (pResult.error || !pResult.data || pResult.data.length === 0) {
                alert('Esta evaluación no tiene preguntas');
                sessionStorage.removeItem('alcocer_quiz_code');
                return;
            }

            var preguntas = pResult.data;
            preguntas = selectDiverseQuestions(preguntas, 10);
            var qids = preguntas.map(function(q) { return q.id; });
            sessionStorage.setItem('alcocer_quiz_qids_' + code, JSON.stringify(qids));

            quizData = { evaluacion: evaluacion, preguntas: preguntas };
            quizSessionMode = 'practica';
            quizTeamName = null;
            quizCurrentQ = 0;
            quizAnswers = [];
            quizSelectedOption = -1;
            quizConfirmed = false;

            sessionStorage.setItem('alcocer_quiz_state_' + code, JSON.stringify({ q: 0, a: [] }));
            sessionStorage.setItem('alcocer_quiz_code', code);

            // Usar el MISMO flujo que searchAndStartQuiz para modo test
            navigateTo('quiz');
            applyTestModeUI();
            document.getElementById('quiz-live-title').textContent = evaluacion.titulo || 'Autoestudio';
            document.getElementById('quiz-live-subtitle').textContent = preguntas.length + ' preguntas • Modo práctica';
            showSplashAndStart();
        });
    });
}

function restoreSelfStudy(evalId, code) {
    var client = getSupabase();
    if (!client) { navigateTo('jugar', true); return; }

    client.from('evaluaciones').select('*').eq('id', evalId).single().then(function(r) {
        if (r.error || !r.data) { clearSelfSession(); navigateTo('jugar', true); return; }
        var evaluacion = r.data;
        if (!canAccessEvaluation(evaluacion)) {
            clearSelfSession();
            showLockedDemoNotice();
            navigateTo('jugar', true);
            return;
        }
        evaluacion.codigo = code;
        evaluacion.publicado = true;

        client.from('evaluacion_preguntas').select('*').eq('evaluacion_id', evalId).order('orden').then(function(pResult) {
            if (pResult.error || !pResult.data || pResult.data.length === 0) { clearSelfSession(); navigateTo('jugar', true); return; }

            var preguntas = pResult.data;
            var savedQidsStr = sessionStorage.getItem('alcocer_quiz_qids_' + code);
            if (savedQidsStr) {
                try {
                    var savedQids = JSON.parse(savedQidsStr);
                    var ordered = [];
                    for (var qi = 0; qi < savedQids.length; qi++) {
                        var found = preguntas.find(function(q) { return q.id === savedQids[qi]; });
                        if (found) ordered.push(found);
                    }
                    if (ordered.length > 0) preguntas = ordered;
                } catch(e) {}
            }

            quizData = { evaluacion: evaluacion, preguntas: preguntas };
            quizSessionMode = 'practica';
            quizTeamName = null;

            var savedStateStr = sessionStorage.getItem('alcocer_quiz_state_' + code);
            if (savedStateStr) {
                try {
                    var st = JSON.parse(savedStateStr);
                    quizCurrentQ = st.q || 0;
                    quizAnswers = st.a || [];
                } catch(e) { quizCurrentQ = 0; quizAnswers = []; }
            } else { quizCurrentQ = 0; quizAnswers = []; }
            quizSelectedOption = -1;
            quizConfirmed = false;

            navigateTo('quiz');
            applyTestModeUI();
            document.getElementById('quiz-live-title').textContent = evaluacion.titulo || 'Autoestudio';
            document.getElementById('quiz-live-subtitle').textContent = preguntas.length + ' preguntas • Modo práctica';
            if (quizCurrentQ > 0) {
                if (quizCurrentQ >= preguntas.length) {
                    showQuizResults();
                } else {
                    document.getElementById('quiz-container').style.display = 'block';
                    if (quizSessionMode === 'practica') startGameMusic();
                    renderQuizQuestion();
                }
            } else {
                showSplashAndStart();
            }
        });
    });
}

function clearSelfSession() {
    var code = sessionStorage.getItem('alcocer_quiz_code');
    if (code) {
        sessionStorage.removeItem('alcocer_quiz_state_' + code);
        sessionStorage.removeItem('alcocer_quiz_qids_' + code);
    }
    sessionStorage.removeItem('alcocer_quiz_code');
    sessionStorage.removeItem('alcocer_self_evalid');
}

function joinByCode() {
    var input = document.getElementById('join-code-input');
    var code = input ? input.value.trim().replace(/\s/g, '') : '';
    if (!code) { alert('Ingresa un código'); return; }
    searchAndStartQuiz(code);
}
window.joinByCode = joinByCode;

function joinByCodeFull() {
    var input = document.getElementById('join-code-full');
    var code = input ? input.value.trim().replace(/\s/g, '') : '';
    if (!code) {
        document.getElementById('join-error').classList.remove('hidden');
        document.getElementById('join-error-text').textContent = 'Ingresa un código válido';
        return;
    }
    document.getElementById('join-error').classList.add('hidden');
    
    // UI de carga
    var btn = input.nextElementSibling || document.querySelector('button[onclick="joinByCodeFull()"]');
    var oldText = '';
    if (btn) {
        btn.disabled = true;
        oldText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Conectando...';
    }

    // Wrap the call to restore the button when done (we can't easily wait for the internal Promise, so we set a timeout or rely on the UI changing pages)
    // Actually searchAndStartQuiz handles page changes. If it fails, it shows an alert.
    // Let's modify searchAndStartQuiz to return a Promise or take a callback. Since we don't want to rewrite it all, we just restore it after 3 seconds if we're still on the join page.
    setTimeout(function() {
        if (btn && document.getElementById('page-unirse').style.display !== 'none') {
            btn.disabled = false;
            btn.innerHTML = oldText;
        }
    }, 2500);

    searchAndStartQuiz(code);
}
window.joinByCodeFull = joinByCodeFull;

function searchAndStartQuiz(code) {
    var client = getSupabase();
    if (!client) {
        sessionStorage.removeItem('alcocer_quiz_code');
        navigateTo(isAdmin ? 'inicio' : 'jugar');
        return;
    }

    // Buscar evaluación por código
    client.from('evaluaciones').select('*').eq('codigo', code).eq('publicado', true).single().then(function(result) {
        if (result.error || !result.data) {
            var dbError = result.error ? result.error.message : 'No existe o ya se cerró';
            // Limpiar sesión pendiente para evitar bucle infinito de reintento
            sessionStorage.removeItem('alcocer_quiz_code');
            sessionStorage.removeItem('alcocer_quiz_state_' + code);
            sessionStorage.removeItem('alcocer_quiz_qids_' + code);
            showCustomAlert('Código ' + code + ' no válido.\n\nEl profesor debe estar en la sala de espera AHORA MISMO. Si el profesor recargó la página, se generó un NUEVO código.');
            navigateTo(isAdmin ? 'inicio' : 'jugar');
            return;
        }

        var evaluacion = result.data;
        if (!canAccessEvaluation(evaluacion)) {
            sessionStorage.removeItem('alcocer_quiz_code');
            sessionStorage.removeItem('alcocer_quiz_state_' + code);
            sessionStorage.removeItem('alcocer_quiz_qids_' + code);
            showLockedDemoNotice();
            navigateTo(isAdmin ? 'inicio' : 'jugar');
            return;
        }

        // Cargar preguntas
        client.from('evaluacion_preguntas').select('*').eq('evaluacion_id', evaluacion.id).order('orden').then(function(pResult) {
            if (pResult.error || !pResult.data || pResult.data.length === 0) {
                sessionStorage.removeItem('alcocer_quiz_code');
                showCustomAlert('Esta evaluación no tiene preguntas todavía.');
                navigateTo(isAdmin ? 'inicio' : 'jugar');
                return;
            }

            var preguntas = pResult.data;

            // ═══ ALEATORIZAR Y LIMITAR A 10 PREGUNTAS ═══
            var savedQidsStr = sessionStorage.getItem('alcocer_quiz_qids_' + code);
            if (savedQidsStr) {
                try {
                    var savedQids = JSON.parse(savedQidsStr);
                    var ordered = [];
                    for (var qi = 0; qi < savedQids.length; qi++) {
                        var found = preguntas.find(function(q) { return q.id === savedQids[qi]; });
                        if (found) ordered.push(found);
                    }
                    if (ordered.length > 0) preguntas = ordered;
                } catch(e) {}
            } else {
                preguntas = selectDiverseQuestions(preguntas, 10);
                var qids = preguntas.map(function(q) { return q.id; });
                sessionStorage.setItem('alcocer_quiz_qids_' + code, JSON.stringify(qids));
            }

            quizData = {
                evaluacion: evaluacion,
                preguntas: preguntas
            };
            // ═══ Leer modo de sesión ═══
            quizSessionMode = evaluacion.modo_sesion || 'clasico';
            quizTeamName = sessionStorage.getItem('alcocer_quiz_team_' + code) || null;

            var savedStateStr = sessionStorage.getItem('alcocer_quiz_state_' + code);
            if (savedStateStr) {
                try {
                    var st = JSON.parse(savedStateStr);
                    quizCurrentQ = st.q || 0;
                    quizAnswers = st.a || [];
                } catch(e) {
                    quizCurrentQ = 0;
                    quizAnswers = [];
                }
            } else {
                quizCurrentQ = 0;
                quizAnswers = [];
            }
            quizSelectedOption = -1;
            quizConfirmed = false;

            // Registrar participante en el lobby (upsert para evitar duplicados)
            if (currentUser) {
                var nombreReal = currentUser.user_metadata && currentUser.user_metadata.full_name
                    ? currentUser.user_metadata.full_name
                    : (currentUser.email || '').split('@')[0];
                var nombreConAvatar = currentAvatar + '|' + nombreReal;
                
                client.from('evaluacion_participantes')
                    .select('user_id')
                    .eq('evaluacion_id', evaluacion.id)
                    .eq('user_id', currentUser.id)
                    .single()
                    .then(function(checkRes) {
                        var payload = {
                            evaluacion_id: evaluacion.id,
                            user_id: currentUser.id,
                            nombre: nombreConAvatar,
                            joined_at: new Date().toISOString()
                        };
                        // Agregar equipo si estamos en modo equipo
                        if (quizTeamName) payload.equipo = quizTeamName;

                        if (checkRes.data) {
                            client.from('evaluacion_participantes')
                                .update(payload)
                                .eq('evaluacion_id', evaluacion.id)
                                .eq('user_id', currentUser.id)
                                .then(function(pr) {
                                    if (pr.error) console.warn('No se pudo actualizar participante:', pr.error.message);
                                });
                        } else {
                            client.from('evaluacion_participantes')
                                .insert(payload)
                                .then(function(pr) {
                                    if (pr.error) console.warn('No se pudo insertar participante:', pr.error.message);
                                });
                        }
                    });
            }

            // Guardar código en sessionStorage para persistir al recargar
            sessionStorage.setItem('alcocer_quiz_code', code);

            // Mostrar la página de quiz y asegurar que el header sea visible
            document.getElementById('quiz-live-title').textContent = evaluacion.titulo || 'Evaluación';
            var subtitleSuffix = quizSessionMode === 'test' ? ' • 📋 Examen' : (quizSessionMode === 'equipo' ? ' • 👥 Equipo' : '');
            document.getElementById('quiz-live-subtitle').textContent = quizData.preguntas.length + ' preguntas • ' + (evaluacion.asignatura || '') + subtitleSuffix;
            document.getElementById('quiz-container').style.display = 'none';
            document.getElementById('quiz-result').style.display = 'none';
            var header = document.getElementById('quiz-page-header');
            if (header) header.style.display = 'none';

            // ═══ Modo Equipo: pedir equipo antes de continuar ═══
            if (quizSessionMode === 'equipo' && !quizTeamName) {
                navigateTo('quiz');
                showTeamPicker(evaluacion, code);
                return;
            }

            navigateTo('quiz');

            // ═══ Modo Test: el quiz ya está iniciado, sin sala de espera ═══
            if (quizSessionMode === 'test') {
                applyTestModeUI();
                if (quizCurrentQ > 0) {
                    if (quizCurrentQ >= quizData.preguntas.length) {
                        showQuizResults();
                    } else {
                        document.getElementById('quiz-container').style.display = 'block';
                        renderQuizQuestion();
                    }
                } else {
                    showSplashAndStart();
                }
            }
            // ═══ Modo Clásico / Equipo: flujo normal ═══
            else if (evaluacion.iniciado) {
                if (quizCurrentQ > 0) {
                    if (quizCurrentQ >= quizData.preguntas.length) {
                        showQuizResults();
                    } else {
                        document.getElementById('quiz-container').style.display = 'block';
                        renderQuizQuestion();
                    }
                } else {
                    showSplashAndStart();
                }
            } else {
                showWaitingRoom();
            }
        }).catch(function(err) {
            console.error('Error cargando preguntas:', err);
            sessionStorage.removeItem('alcocer_quiz_code');
            showCustomAlert('Error de conexión al cargar las preguntas. Intenta de nuevo.');
            navigateTo('inicio');
        });
    }).catch(function(err) {
        console.error('Error buscando evaluación:', err);
        sessionStorage.removeItem('alcocer_quiz_code');
        sessionStorage.removeItem('alcocer_quiz_state_' + code);
        sessionStorage.removeItem('alcocer_quiz_qids_' + code);
        showCustomAlert('Error de conexión. Verifica tu internet e intenta de nuevo.');
        navigateTo('inicio');
    });
}

var waitingPollInterval = null;
var gameMusic = null;

// ═══ GAME MUSIC — Background Audio Element ═══
function startGameMusic() {
    try {
        var audioEl = document.getElementById('quiz-bg-music');
        if (audioEl) {
            audioEl.volume = 0.3; // Volumen moderado para no tapar efectos
            var playPromise = audioEl.play();
            if (playPromise !== undefined) {
                playPromise.catch(function(e) {
                    console.log('Autoplay blocked for music, waiting for interaction:', e);
                });
            }
        }
    } catch (e) { console.log('Music error:', e); }
}

function stopGameMusic() {
    try {
        var audioEl = document.getElementById('quiz-bg-music');
        if (audioEl) {
            audioEl.pause();
            audioEl.currentTime = 0;
        }
    } catch(e) {}
}

function showWaitingRoom() {
    var wt = document.getElementById('quiz-waiting');
    if (wt) wt.style.display = 'flex';
    document.getElementById('quiz-container').style.display = 'none';

    var title = quizData.evaluacion.titulo || 'Evaluación';
    var wtTitle = document.getElementById('waiting-title');
    if (wtTitle) wtTitle.textContent = 'Esperando al profesor...';
    var wtSub = document.getElementById('waiting-subtitle');
    if (wtSub) wtSub.innerHTML = 'Estás en la sala de <b>' + title + '</b><br>El profesor iniciará el juego pronto.';

    // Iniciar música lo-fi
    startGameMusic();
    
    var wtAv = document.getElementById('waiting-avatar-icon');
    setAvatarContent(wtAv, currentAvatar, 'Tu avatar', 'waiting-avatar-media');

    // Poll cada 3 segundos para verificar si el admin inició
    if (waitingPollInterval) clearInterval(waitingPollInterval);
    waitingPollInterval = setInterval(function() {
        if (!quizData || !quizData.evaluacion) return;
        var client = getSupabase();
        client.from('evaluaciones').select('iniciado').eq('id', quizData.evaluacion.id).single().then(function(r) {
            if (r.data && r.data.iniciado) {
                clearInterval(waitingPollInterval);
                waitingPollInterval = null;
                // La música sigue sonando durante el examen
                var wt2 = document.getElementById('quiz-waiting');
                if (wt2) wt2.style.display = 'none';
                document.getElementById('quiz-container').style.display = 'block';
                showSplashAndStart();
            }
        });
    }, 3000);
}

// ═══ MODO TEST — Ajustes de interfaz para examen a ritmo propio ═══
function applyTestModeUI() {
    stopGameMusic();
    
    // Ocultar HUD competitivo solo en modo test real (examen), no en práctica
    if (quizSessionMode === 'test') {
        var scoreHud = document.getElementById('quiz-current-score');
        var streakHud = document.getElementById('quiz-current-streak');
        if (scoreHud && scoreHud.parentElement) scoreHud.parentElement.style.display = 'none';
        if (streakHud && streakHud.parentElement) streakHud.parentElement.style.display = 'none';
    }
    
    // Agregar badge de modo test en la barra superior
    var topBar = document.querySelector('#quiz-container > div:first-child');
    if (topBar && !document.getElementById('test-mode-student-badge')) {
        var badge = document.createElement('div');
        badge.id = 'test-mode-student-badge';
        badge.style.cssText = 'display:flex;align-items:center;gap:6px;background:rgba(37,99,235,0.25);border:1px solid rgba(37,99,235,0.4);padding:6px 12px;border-radius:8px;';
        badge.innerHTML = '<i class="fas fa-clipboard-check" style="color:#60A5FA;font-size:0.85rem;"></i><span style="color:#93C5FD;font-weight:700;font-size:0.8rem;">EXAMEN</span>';
        topBar.insertBefore(badge, topBar.firstChild);
    }
}

// ═══ MODO EQUIPO — Selector de equipos premium ═══
var teamColors = [
    { name: '🔴 Equipo Rojo',    color: '#EF4444', bg: 'linear-gradient(135deg,#EF4444,#DC2626)' },
    { name: '🔵 Equipo Azul',    color: '#3B82F6', bg: 'linear-gradient(135deg,#3B82F6,#2563EB)' },
    { name: '🟢 Equipo Verde',   color: '#22C55E', bg: 'linear-gradient(135deg,#22C55E,#16A34A)' },
    { name: '🟡 Equipo Dorado',  color: '#F59E0B', bg: 'linear-gradient(135deg,#F59E0B,#D97706)' },
    { name: '🟣 Equipo Morado',  color: '#8B5CF6', bg: 'linear-gradient(135deg,#8B5CF6,#7C3AED)' },
    { name: '🩷 Equipo Rosa',    color: '#EC4899', bg: 'linear-gradient(135deg,#EC4899,#DB2777)' }
];

function showTeamPicker(evaluacion, code) {
    // Crear overlay de selección de equipo
    var overlay = document.createElement('div');
    overlay.id = 'team-picker-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:linear-gradient(135deg,#1A0033,#2D1B4E,#0F172A);display:flex;align-items:center;justify-content:center;flex-direction:column;padding:24px;';

    var html = '<div style="max-width:480px;width:100%;text-align:center;">';
    html += '<div style="font-size:3rem;margin-bottom:12px;">👥</div>';
    html += '<h1 style="color:#fff;font-size:1.6rem;font-weight:900;margin-bottom:8px;">Elige tu Equipo</h1>';
    html += '<p style="color:rgba(255,255,255,0.5);font-size:0.9rem;margin-bottom:28px;font-weight:500;">' + (evaluacion.titulo || 'Evaluación') + ' • Modo Equipo</p>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">';
    
    for (var i = 0; i < teamColors.length; i++) {
        var t = teamColors[i];
        html += '<button onclick="selectTeamAndContinue(\'' + t.name + '\',\'' + code + '\')" ' +
            'style="padding:20px 16px;border:none;border-radius:16px;background:' + t.bg + ';' +
            'color:#fff;font-weight:800;font-size:1.05rem;cursor:pointer;box-shadow:inset 0 -4px 0 rgba(0,0,0,0.2), 0 6px 16px rgba(0,0,0,0.3);' +
            'transition:transform 0.1s,box-shadow 0.2s;" ' +
            'onmousedown="this.style.transform=\'scale(0.96)\'" onmouseup="this.style.transform=\'scale(1)\'" ' +
            'ontouchstart="this.style.transform=\'scale(0.96)\'" ontouchend="this.style.transform=\'scale(1)\'">' +
            t.name + '</button>';
    }
    html += '</div>';
    html += '</div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
}
window.showTeamPicker = showTeamPicker;

function selectTeamAndContinue(teamName, code) {
    quizTeamName = teamName;
    sessionStorage.setItem('alcocer_quiz_team_' + code, teamName);
    
    // Eliminar overlay
    var overlay = document.getElementById('team-picker-overlay');
    if (overlay) overlay.parentNode.removeChild(overlay);
    
    // Actualizar participante con equipo
    if (currentUser && quizData) {
        var client = getSupabase();
        client.from('evaluacion_participantes')
            .update({ equipo: teamName })
            .eq('evaluacion_id', quizData.evaluacion.id)
            .eq('user_id', currentUser.id)
            .then(function(r) {
                if (r.error) console.warn('No se pudo actualizar equipo:', r.error.message);
            });
    }

    // Continuar con el flujo normal
    if (quizData.evaluacion.iniciado) {
        if (quizCurrentQ > 0) {
            if (quizCurrentQ >= quizData.preguntas.length) {
                showQuizResults();
            } else {
                document.getElementById('quiz-container').style.display = 'block';
                renderQuizQuestion();
            }
        } else {
            showSplashAndStart();
        }
    } else {
        showWaitingRoom();
    }
}
window.selectTeamAndContinue = selectTeamAndContinue;

var quizTimerInterval = null;
var quizTimeLeft = 30;

function playBeep(freq, type, duration) {
    try {
        var ctx = getAudioCtx();
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = type;
        o.frequency.value = freq;
        var t = ctx.currentTime;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.1, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + duration);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + duration + 0.1);
    } catch(e) {}
}

function playSuccessSound() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        
        // Sonido de moneda clásico (Mario Bros)
        o.type = 'square';
        
        // Primera nota: Si 5 (B5) ~ 987.77 Hz
        o.frequency.setValueAtTime(987.77, ctx.currentTime);
        // Segunda nota: Mi 6 (E6) ~ 1318.51 Hz
        o.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
        
        // Control de volumen (Envolvente)
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
        g.gain.setValueAtTime(0.15, ctx.currentTime + 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.55);
    } catch(e) {}
}

function playErrorSound() {
    try {
        var ctx = getAudioCtx();
        if (preloadedAudio['error']) {
            var src = ctx.createBufferSource();
            src.buffer = preloadedAudio['error'];
            var g = ctx.createGain();
            g.gain.value = 0.5;
            src.connect(g); g.connect(ctx.destination);
            src.start(0);
        } else {
            var audio = new Audio('./error_sound.mp3');
            audio.volume = 0.5;
            audio.play().catch(function(e) { console.warn('Audio play failed', e); });
        }
    } catch(e) {}
}

function showFeedbackAnimation(isCorrect, ptsEarned, timedOut) {
    var pregunta = quizData.preguntas[quizCurrentQ];
    var isPoll = pregunta && (pregunta.tipo === 'poll' || pregunta.tipo === 'encuesta');
    var isOpenAnswer = pregunta && pregunta.tipo === 'oa';

    var banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.top = '-150px';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.zIndex = '9999';
    banner.style.background = timedOut ? '#EF4444' : (isPoll || isOpenAnswer) ? '#7C3AED' : (isCorrect ? '#10B981' : '#EF4444');
    banner.style.color = '#fff';
    banner.style.padding = '16px 32px';
    banner.style.borderRadius = '16px';
    banner.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    banner.style.display = 'flex';
    banner.style.alignItems = 'center';
    banner.style.gap = '20px';
    banner.style.transition = 'top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    var iconHtml = timedOut ? '<i class="fas fa-hourglass-end" style="font-size:2.5rem;"></i>' :
        (isPoll || isOpenAnswer) ? '<i class="fas fa-' + (isOpenAnswer ? 'pen-nib' : 'comment-dots') + '" style="font-size:2.5rem;"></i>' : 
        (isCorrect ? '<i class="fas fa-check-circle" style="font-size:2.5rem;"></i>' : '<i class="fas fa-times-circle" style="font-size:2.5rem;"></i>');
    var titleText = timedOut ? '¡TIEMPO AGOTADO!' : (isPoll || isOpenAnswer) ? '¡REGISTRADO!' : (isCorrect ? '¡CORRECTO!' : 'INCORRECTO');
    var textHtml = '<div style="display:flex; flex-direction:column;"><span style="font-size:1.5rem; font-weight:900;">' + titleText + '</span>';
    if(!isPoll && !isOpenAnswer && isCorrect && ptsEarned) {
        textHtml += '<span style="font-size:1.1rem; font-weight:700; opacity:0.9;">+' + ptsEarned + ' Puntos</span>';
        // Mostrar multiplicador de racha
        var currStreak = 0;
        for(var si=quizAnswers.length - 1; si >= 0; si--) {
            var spq = quizData.preguntas.find(function(q) { return q.id === quizAnswers[si].pregunta_id; });
            if (spq && (spq.tipo === 'oa' || spq.tipo === 'poll' || spq.tipo === 'encuesta')) continue;
            if(quizAnswers[si].correcta) currStreak++;
            else break;
        }
        if (currStreak >= 2) {
            var sm = Math.min(currStreak, 5);
            textHtml += '<span style="font-size:0.9rem; font-weight:900; color:#FFB74D;margin-top:2px">🔥 Racha x' + sm + '</span>';
        }
    } else if (isPoll) {
        textHtml += '<span style="font-size:1.1rem; font-weight:700; opacity:0.9;">¡Gracias por tu opinión!</span>';
    } else if (isOpenAnswer) {
        textHtml += '<span style="font-size:1.1rem; font-weight:700; opacity:0.9;">Respuesta abierta — no afecta el puntaje</span>';
    }
    textHtml += '</div>';

    banner.innerHTML = iconHtml + textHtml;
    document.body.appendChild(banner);
    
    if (isPoll || isOpenAnswer) playSuccessSound();
    else if (isCorrect) playSuccessSound();
    else if (!timedOut) playErrorSound();
    
    // Slide in
    setTimeout(function() {
        banner.style.top = '24px';
    }, 10);
    
    // Slide out and next
    setTimeout(function() {
        banner.style.top = '-150px';
        setTimeout(function() { 
            if(banner.parentNode) banner.parentNode.removeChild(banner); 
            quizNext();
        }, 400);
    }, 2000);
}

var splashInterval = null;

function showSplashAndStart() {
    // Asegurar que no se ejecute dos veces
    if (splashInterval) {
        clearInterval(splashInterval);
        splashInterval = null;
    }

    // Asegurar que la sala de espera se oculte (música sigue)
    var wt = document.getElementById('quiz-waiting');
    if (wt) wt.style.display = 'none';

    // Iniciar música si no estaba sonando (excepto en modo test — ambiente de examen)
    if (quizSessionMode !== 'test' && quizSessionMode !== 'practica') {
        startGameMusic();
    }

    var splash = document.getElementById('quiz-splash');
    var splashText = document.getElementById('splash-text');
    
    if (splash && splashText) {
        splash.style.display = 'flex';
        
        // Reset animación forzando reflow
        splashText.style.animation = 'none';
        splashText.offsetHeight; 
        splashText.style.animation = 'splashPulse 1s ease-in-out infinite';

        var count = 3;
        splashText.textContent = count;
        playBeep(440, 'sine', 0.5);
        
        splashInterval = setInterval(function() {
            count--;
            if (count > 0) {
                splashText.textContent = count;
                playBeep(440, 'sine', 0.5);
            } else if (count === 0) {
                splashText.textContent = '¡ADELANTE!';
                playBeep(880, 'square', 0.8);
            } else {
                clearInterval(splashInterval);
                splashInterval = null;
                splash.style.display = 'none';
                document.getElementById('quiz-container').style.display = 'block';
                if (quizSessionMode === 'practica') startGameMusic();
                renderQuizQuestion();
            }
        }, 1000);
    } else {
        document.getElementById('quiz-container').style.display = 'block';
        if (quizSessionMode === 'practica') startGameMusic();
        renderQuizQuestion();
    }
}

function startQuestionTimer(seconds) {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizTimeLeft = seconds;
    
    var timerBar = document.getElementById('quiz-timer-bar');
    if(timerBar) {
        timerBar.style.transition = 'width ' + seconds + 's linear, background 0.3s';
        setTimeout(function() {
            if(!quizConfirmed) timerBar.style.width = '0%';
        }, 50);
    }

    var label = document.getElementById('quiz-timer-label');
    if (label) { label.textContent = seconds + 's'; label.style.color = 'rgba(255,255,255,0.7)'; }

    quizTimerInterval = setInterval(function() {
        if (quizConfirmed) return;

        quizTimeLeft--;

        var label = document.getElementById('quiz-timer-label');
        if (label) label.textContent = quizTimeLeft + 's';

        if (quizTimeLeft <= 5 && timerBar) {
            timerBar.style.background = '#EF4444';
            if (label) label.style.color = '#EF4444';
        }
        
        // Faltando 10 segundos: sonido de apuro
        if (quizTimeLeft === 10) {
            try {
                var ctx = getAudioCtx();
                if (preloadedAudio['hurry']) {
                    var src = ctx.createBufferSource();
                    src.buffer = preloadedAudio['hurry'];
                    var g = ctx.createGain();
                    g.gain.value = 0.7;
                    src.connect(g); g.connect(ctx.destination);
                    src.start(0);
                }
            } catch(e) {}
        }
        
        if (quizTimeLeft <= 3 && quizTimeLeft > 0) {
            playBeep(880, 'sine', 0.15);
        }

        if (quizTimeLeft <= 0) {
            clearInterval(quizTimerInterval);
            quizTimerInterval = null;
            playBeep(440, 'square', 0.6);
            if (!quizConfirmed) {
                quizConfirmed = true;
                quizAnswers.push({ pregunta_id: quizData.preguntas[quizCurrentQ].id, seleccionada: -1, correcta: false, puntos_ganados: 0 });
                
                var buttons = document.querySelectorAll('.quiz-opt-btn');
                for(var b=0; b<buttons.length; b++){
                    buttons[b].style.opacity = '0.3';
                    buttons[b].style.pointerEvents = 'none';
                }
                showFeedbackAnimation(false, 0, true);
            }
        }
    }, 1000);
}

var quizMultiSelections = [];

function renderQuizQuestion() {
    if (!quizData || quizCurrentQ >= quizData.preguntas.length) return;

    quizQuestionStartTime = Date.now();

    var pregunta = quizData.preguntas[quizCurrentQ];
    var total = quizData.preguntas.length;
    var pts = pregunta.puntos || 1;
    var tipo = pregunta.tipo || 'mc';

    // Salvaguarda BLINDADA: si tipo es 'ms' pero solo tiene 0 o 1 respuestas correctas, SIEMPRE forzar a 'mc'
    // Esto funciona incluso si multiple_correctas no fue actualizado en la BD
    var correctCount = (pregunta.opciones || []).filter(function(o){ return o.correct === true || o.correct === 'true'; }).length;
    if (tipo === 'ms' && correctCount <= 1) {
        tipo = 'mc';
    }

    document.getElementById('quiz-question-number').textContent = (quizCurrentQ + 1) + ' / ' + total;
    document.getElementById('quiz-question-text').textContent = pregunta.texto || '';

    // Calculate score and streak
    var currentScore = 0;
    var currentStreak = 0;
    for(var i=quizAnswers.length - 1; i >= 0; i--) {
        var pq = quizData.preguntas.find(function(q) { return q.id === quizAnswers[i].pregunta_id; });
        if (pq && (pq.tipo === 'oa' || pq.tipo === 'poll' || pq.tipo === 'encuesta')) continue;
        if(quizAnswers[i].correcta) { currentStreak++; }
        else { break; }
    }
    for(var i=0; i<quizAnswers.length; i++){
        var pq = quizData.preguntas.find(function(q) { return q.id === quizAnswers[i].pregunta_id; });
        if (pq && (pq.tipo === 'oa' || pq.tipo === 'poll' || pq.tipo === 'encuesta')) continue;
        currentScore += (quizAnswers[i].puntos_ganados || 0);
    }
    var scoreEl = document.getElementById('quiz-current-score');
    if(scoreEl) scoreEl.textContent = currentScore;
    var streakEl = document.getElementById('quiz-current-streak');
    if(streakEl) {
        var streakMult = Math.min(currentStreak, 5);
        if (currentStreak >= 2) {
            streakEl.textContent = currentStreak + ' 🔥';
            streakEl.parentElement.style.background = 'rgba(255,152,0,0.25)';
            streakEl.parentElement.style.border = '1px solid rgba(255,152,0,0.4)';
            streakEl.style.color = '#FFB74D';
            var multBadge = document.getElementById('quiz-streak-mult');
            if (multBadge) { multBadge.style.display = 'inline-block'; multBadge.textContent = 'x' + streakMult; }
        } else {
            streakEl.textContent = currentStreak;
            streakEl.parentElement.style.background = 'rgba(255,255,255,0.1)';
            streakEl.parentElement.style.border = 'none';
            streakEl.style.color = '#fff';
            var multBadge = document.getElementById('quiz-streak-mult');
            if (multBadge) multBadge.style.display = 'none';
        }
    }
    // Update score parent style for high scores
    if(scoreEl && currentScore > 0) {
        scoreEl.parentElement.style.background = 'rgba(255,215,0,0.15)';
        scoreEl.style.color = '#FFD700';
    }

    var opciones = pregunta.opciones || [];
    var optColors = ['#E91E63', '#2563EB', '#E6A15C', '#059669', '#7C3AED', '#0D9488'];
    var html = '';
    quizMultiSelections = [];

    var optionsListEl = document.getElementById('quiz-options-list');
    if (optionsListEl) {
        optionsListEl.className = 'quiz-options-grid';
        if (tipo === 'dnd') optionsListEl.classList.add('quiz-options-dnd');
    }

    // Detectar encuesta sin opciones reales → tratar como pregunta abierta
    var isPollOpen = (tipo === 'poll' || tipo === 'encuesta') &&
        (opciones.length === 0 || opciones.every(function(o){ return !o.text || !o.text.trim(); }));

    // Open-ended, fill blanks, OR encuesta sin opciones: show textarea
    if (tipo === 'oa' || tipo === 'fb' || isPollOpen) {
        var isOpenStyle = (tipo === 'oa' || isPollOpen);
        var ph = isOpenStyle ? 'Escribe tu respuesta aquí...' : 'Completa los espacios en blanco...';
        if (isOpenStyle) {
            // Badge icon & text según el subtipo
            var badgeIcon = isPollOpen ? 'fa-comment-dots' : 'fa-pen-nib';
            var badgeText = isPollOpen
                ? 'Pregunta de encuesta — Tu respuesta será registrada sin afectar el puntaje'
                : 'Pregunta abierta — Tu respuesta será registrada sin afectar el puntaje';
            // Premium open answer UI with no-score badge
            html += '<div style="width:100%;display:flex;flex-direction:column;gap:12px;">';
            html += '  <div style="display:flex;align-items:center;gap:8px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:10px;padding:10px 14px;">';
            html += '    <i class="fas ' + badgeIcon + '" style="color:#A78BFA;font-size:1rem;"></i>';
            html += '    <span style="color:#C4B5FD;font-size:0.85rem;font-weight:700;">' + badgeText + '</span>';
            html += '  </div>';
            html += '  <textarea id="quiz-open-answer" placeholder="' + ph + '" ' +
                'style="width:100%;min-height:140px;padding:18px;border:2px solid rgba(255,255,255,0.15);border-radius:14px;' +
                'background:rgba(255,255,255,0.08);color:#fff;font-size:1.05rem;font-weight:600;resize:vertical;outline:none;' +
                'backdrop-filter:blur(4px);font-family:Inter,sans-serif;line-height:1.6;transition:border-color 0.2s;" ' +
                'onfocus="this.style.borderColor=\'rgba(167,139,250,0.6)\'" ' +
                'onblur="this.style.borderColor=\'rgba(255,255,255,0.15)\'"></textarea>';
            html += '  <button onclick="submitQuizOpen()" style="padding:16px 24px;background:linear-gradient(135deg,#7C3AED,#6D28D9);' +
                'color:#fff;border:none;border-radius:14px;font-weight:800;cursor:pointer;width:100%;font-size:1.1rem;' +
                'box-shadow:0 6px 0 #4C1D95;display:flex;align-items:center;justify-content:center;gap:10px;transition:transform 0.1s;" ' +
                'onmousedown="this.style.transform=\'translateY(3px)\'" onmouseup="this.style.transform=\'translateY(0)\'">' +
                '<i class="fas fa-paper-plane"></i> Enviar respuesta</button>';
            html += '</div>';
        } else {
            html += '<textarea id="quiz-open-answer" placeholder="' + ph + '" ' +
                'style="width:100%;min-height:120px;padding:16px;border:2px solid rgba(255,255,255,0.2);border-radius:12px;' +
                'background:rgba(255,255,255,0.9);color:#333;font-size:1.1rem;font-weight:700;resize:vertical;outline:none"></textarea>';
            html += '<button onclick="submitQuizOpen()" style="margin-top:16px;padding:16px 24px;background:#2563EB;' +
                'color:#fff;border:none;border-radius:14px;font-weight:800;cursor:pointer;width:100%;font-size:1.2rem;box-shadow:0 6px 0 #1D4ED8;">Enviar respuesta</button>';
        }
    }
    // Identificar partes (DND)
    else if (tipo === 'dnd') {
        var imgUrl = (opciones && opciones[0]) ? opciones[0].pregunta_imagen : '';
        quizSelectedDndLabel = -1;
        quizSelectedDndSlot = -1;
        quizDndMatches = {};
        
        html += '<div class="quiz-dnd-builder" style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;">';
        html += '  <p style="color:#fff; font-size:1.1rem; font-weight:800; text-align:center; background:rgba(0,0,0,0.3); padding:10px 20px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);"><i class="fas fa-link" style="color:#A78BFA; margin-right:8px;"></i> Relaciona las partes: toca una etiqueta y su círculo (o viceversa).</p>';
        
        html += '  <div style="position:relative; display:inline-block; max-width:100%; border-radius:16px; overflow:hidden; border:4px solid rgba(255,255,255,0.2); background:#2D1B4E; box-shadow:0 12px 36px rgba(0,0,0,0.4);" id="dnd-student-container">';
        html += '    <img class="quiz-dnd-image" src="' + imgUrl + '" style="max-width:100%; max-height:380px; display:block; user-select:none; pointer-events:none;">';
        
        for (var i = 0; i < opciones.length; i++) {
            var o = opciones[i];
            if (o.pinX !== undefined && o.pinY !== undefined) {
                html += '    <div class="quiz-dnd-slot" id="dnd-slot-' + i + '" data-idx="' + i + '" onclick="clickDndSlot(' + i + ')" ' +
                    'style="position:absolute; left:' + o.pinX + '%; top:' + o.pinY + '%; transform:translate(-50%, -50%); ' +
                    'width:36px; height:36px; border-radius:50%; background:#fff; border:3px solid #E2E8F0; ' +
                    'color:#334155; display:flex; align-items:center; justify-content:center; font-weight:900; ' +
                    'font-size:1rem; cursor:pointer; box-shadow:0 6px 16px rgba(0,0,0,0.35); transition:all 0.2s; z-index:100;">?</div>';
            }
        }
        html += '  </div>';
        
        html += '  <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; margin-top:12px;" id="dnd-labels-container">';
        for (var j = 0; j < opciones.length; j++) {
            var bgColor = optColors[j % optColors.length];
            html += '    <button class="quiz-opt-btn quiz-dnd-label-btn" id="dnd-label-' + j + '" data-idx="' + j + '" onclick="clickDndLabel(' + j + ')" ' +
                'style="padding:16px 20px; border:none; border-radius:12px; background:' + bgColor + '; color:#fff; text-align:center; ' +
                'font-size:1.05rem; font-weight:800; cursor:pointer; transition:all 0.2s; box-shadow:inset 0 -4px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.2);">' +
                String.fromCharCode(65 + j) + '. ' + (opciones[j].text || '') + '</button>';
        }
        html += '  </div>';
        
        html += '  <button id="quiz-confirm-dnd" onclick="confirmQuizDnd()" disabled style="margin-top:16px; padding:16px 32px; ' +
            'background:#94A3B8; color:#fff; border:none; border-radius:14px; font-weight:800; cursor:not-allowed; font-size:1.2rem; box-shadow:0 6px 0 #64748B; width:100%; transition:all 0.2s;">' +
            '✓ Enviar respuestas</button>';
        
        html += '</div>';
    }
    // Multiple selection
    else if (tipo === 'ms') {
        for (var i = 0; i < opciones.length; i++) {
            var bgColor = optColors[i % optColors.length];
            html += '<button class="quiz-opt-btn" data-idx="' + i + '" onclick="toggleQuizMulti(' + i + ')" ' +
                'style="padding:24px 20px;border:none;border-radius:16px;background:' + bgColor + ';color:#fff;text-align:center;' +
                'font-size:1.2rem;font-weight:800;cursor:pointer;transition:transform .1s, filter .2s;box-shadow:inset 0 -6px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3);">' +
                (opciones[i].text || '') + '</button>';
        }
        html += '<button id="quiz-confirm-multi" onclick="confirmQuizMulti()" style="grid-column: 1 / -1; margin-top:12px;padding:16px 24px;' +
            'background:#22C55E;color:#fff;border:none;border-radius:14px;font-weight:800;cursor:pointer;font-size:1.2rem;box-shadow:0 6px 0 #16A34A;">' +
            'Enviar selección</button>';
    }
    // Normal MC / TF / Poll
    else {
        for (var j = 0; j < opciones.length; j++) {
            var bgColor2 = optColors[j % optColors.length];
            html += '<button class="quiz-opt-btn" data-idx="' + j + '" onclick="confirmQuizAnswerInstant(' + j + ')" ' +
                'style="padding:24px 20px;border:none;border-radius:16px;background:' + bgColor2 + ';color:#fff;text-align:center;' +
                'font-size:1.2rem;font-weight:800;cursor:pointer;transition:transform .1s, filter .2s;box-shadow:inset 0 -6px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3);">' +
                (opciones[j].text || '') + '</button>';
        }
    }

    document.getElementById('quiz-options-list').innerHTML = html;
    document.getElementById('quiz-next-btn').style.display = 'none';
    quizSelectedOption = -1;
    quizConfirmed = false;

    // Reset timer bar color and width
    var tb = document.getElementById('quiz-timer-bar');
    if(tb) {
        tb.style.transition = 'none';
        tb.style.width = '100%';
        tb.style.background = '#22C55E';
        // force reflow
        void tb.offsetWidth;
    }

    startQuestionTimer(60);
}

var quizConfirmed = false;

function toggleQuizMulti(idx) {
    var pos = quizMultiSelections.indexOf(idx);
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    if (pos === -1) {
        quizMultiSelections.push(idx);
        buttons[idx].style.boxShadow = 'inset 0 0 0 6px rgba(255,255,255,0.7), 0 4px 10px rgba(0,0,0,0.3)';
        buttons[idx].style.transform = 'scale(0.98)';
    } else {
        quizMultiSelections.splice(pos, 1);
        buttons[idx].style.boxShadow = 'inset 0 -6px 0 rgba(0,0,0,0.2), 0 4px 10px rgba(0,0,0,0.3)';
        buttons[idx].style.transform = 'none';
    }
}
window.toggleQuizMulti = toggleQuizMulti;

function confirmQuizMulti() {
    if (quizMultiSelections.length === 0) return;
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizSelectedOption = 1;
    quizConfirmed = true;
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var allCorrect = true;
    
    // Strict boolean check for correctness
    for (var i = 0; i < opciones.length; i++) {
        var isSel = quizMultiSelections.indexOf(i) !== -1;
        var isCorr = opciones[i] && (opciones[i].correct === true || opciones[i].correct === 'true');
        if (isSel && !isCorr) allCorrect = false;
        if (!isSel && isCorr) allCorrect = false;
    }
    
    for (var j = 0; j < buttons.length; j++) {
        var sel = quizMultiSelections.indexOf(j) !== -1;
        var isCorrBtn = opciones[j] && (opciones[j].correct === true || opciones[j].correct === 'true');
        
        if (sel && isCorrBtn) {
            buttons[j].style.boxShadow = 'inset 0 0 0 6px #22C55E, 0 4px 10px rgba(0,0,0,0.3)';
            buttons[j].style.filter = 'brightness(1.2)';
        } else if (sel && !isCorrBtn) {
            buttons[j].style.boxShadow = 'inset 0 0 0 6px #EF4444, 0 4px 10px rgba(0,0,0,0.3)';
            buttons[j].style.filter = 'grayscale(0.5)';
        } else if (!sel && isCorrBtn) {
            buttons[j].style.boxShadow = 'inset 0 0 0 6px #22C55E, 0 4px 10px rgba(0,0,0,0.3)';
            buttons[j].style.filter = 'brightness(1.2)';
        } else {
            buttons[j].style.opacity = '0.3';
        }
        buttons[j].style.pointerEvents = 'none';
    }
    
    var confirmBtn = document.getElementById('quiz-confirm-multi');
    if (confirmBtn) confirmBtn.style.display = 'none';
    
    var pts = getQuizPoints(allCorrect, pregunta);
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: quizMultiSelections, correcta: allCorrect, puntos_ganados: pts });
    
    // Stop the timer bar
    var timerBar = document.getElementById('quiz-timer-bar');
    if(timerBar) {
        var computedWidth = window.getComputedStyle(timerBar).width;
        timerBar.style.transition = 'none';
        timerBar.style.width = computedWidth;
    }
    
    showFeedbackAnimation(allCorrect, pts);
}
window.confirmQuizMulti = confirmQuizMulti;

function submitQuizOpen() {
    var ta = document.getElementById('quiz-open-answer');
    var answer = ta ? ta.value.trim() : '';
    if (!answer) return;
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    quizSelectedOption = 1;
    quizConfirmed = true;
    ta.disabled = true;
    var pregunta = quizData.preguntas[quizCurrentQ];
    
    // ── RESPUESTA ABIERTA (oa) o ENCUESTA ABIERTA: no afecta puntaje ni porcentaje ──
    var isPoll = pregunta.tipo === 'poll' || pregunta.tipo === 'encuesta';
    if (pregunta.tipo === 'oa' || isPoll) {
        ta.style.border = '2px solid rgba(167,139,250,0.6)';
        ta.style.background = 'rgba(124,58,237,0.1)';
        ta.style.color = '#C4B5FD';
        // correcta = null → no suma ni resta al porcentaje; puntos_ganados = 0
        quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: answer, correcta: null, puntos_ganados: 0, es_abierta: true });
        showFeedbackAnimation(null, 0);
        return;
    }
    
    // ── COMPLETA ESPACIOS (fb): validar contra patrón ──
    var isCorrect = false;
    var correctPatterns = [];
    if (pregunta.opciones && pregunta.opciones.length > 0 && pregunta.opciones[0].text) {
        correctPatterns = pregunta.opciones[0].text.toLowerCase().split(',').map(function(s){ return s.trim(); });
    }
    var userAnswerLower = answer.toLowerCase().trim();
    if (correctPatterns.length > 0) {
        for (var p = 0; p < correctPatterns.length; p++) {
            if (correctPatterns[p] === userAnswerLower) {
                isCorrect = true;
                break;
            }
        }
    }

    if (isCorrect) {
        ta.style.border = '2px solid #22C55E';
        ta.style.background = '#F0FDF4';
        ta.style.color = '#166534';
    } else {
        ta.style.border = '2px solid #EF4444';
        ta.style.background = '#FEF2F2';
        ta.style.color = '#991B1B';
    }
    
    var pts = getQuizPoints(isCorrect, pregunta);
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: answer, correcta: isCorrect, puntos_ganados: pts });
    showFeedbackAnimation(isCorrect, pts);
}
window.submitQuizOpen = submitQuizOpen;

// Seleccionar opción SIN bloquear — permite cambiar antes de confirmar
function selectQuizOption(idx) {
    if (quizConfirmed) return; // Ya confirmó, no se puede cambiar
    quizSelectedOption = idx;

    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var optColors = ['#2563EB', '#0D9488', '#D97706', '#DC2626', '#7C3AED', '#059669'];

    // Resaltar solo la seleccionada, resetear las demás
    for (var i = 0; i < buttons.length; i++) {
        if (i === idx) {
            buttons[i].style.border = '3px solid #2563EB';
            buttons[i].style.background = '#EFF6FF';
            buttons[i].style.transform = 'scale(1.02)';
            buttons[i].style.boxShadow = '0 4px 16px rgba(37,99,235,.2)';
        } else {
            buttons[i].style.border = '2px solid #E2E8F0';
            buttons[i].style.background = '#fff';
            buttons[i].style.transform = 'scale(1)';
            buttons[i].style.boxShadow = 'none';
            buttons[i].style.opacity = '1';
        }
    }

    // Mostrar botón de confirmar
    var confirmBtn = document.getElementById('quiz-confirm-answer');
    if (confirmBtn) confirmBtn.style.display = 'block';
}
window.selectQuizOption = selectQuizOption;

// Confirmar respuesta — ahora sí bloquea y muestra correcto/incorrecto
function confirmQuizAnswer() {
    if (quizSelectedOption === -1 || quizConfirmed) return;
    quizConfirmed = true;
    if (quizTimerInterval) clearInterval(quizTimerInterval);

    var idx = quizSelectedOption;
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var isCorrectAnswer = opciones[idx] && opciones[idx].correct;

    for (var i = 0; i < buttons.length; i++) {
        var isSelected = (i === idx);
        if (isSelected && isCorrectAnswer) {
            buttons[i].style.border = '3px solid #22C55E';
            buttons[i].style.background = '#F0FDF4';
            buttons[i].style.boxShadow = '0 4px 16px rgba(34,197,94,.25)';
        } else if (isSelected && !isCorrectAnswer) {
            buttons[i].style.border = '3px solid #EF4444';
            buttons[i].style.background = '#FEF2F2';
            buttons[i].style.boxShadow = '0 4px 16px rgba(239,68,68,.25)';
        } else {
            buttons[i].style.opacity = '0.4';
            buttons[i].style.transform = 'scale(0.98)';
        }
        buttons[i].style.cursor = 'default';
        buttons[i].style.pointerEvents = 'none';
    }

    // Ocultar botón confirmar
    var confirmBtn = document.getElementById('quiz-confirm-answer');
    if (confirmBtn) confirmBtn.style.display = 'none';

    var pts = getQuizPoints(isCorrectAnswer, pregunta);
    if (pts === null) {
        // Segunda Oportunidad (Retry): rehabilitar opciones y marcar la fallada
        quizConfirmed = false;
        quizSelectedOption = -1;
        for (var r = 0; r < buttons.length; r++) {
            if (r === idx) {
                buttons[r].style.cursor = 'default';
                buttons[r].style.pointerEvents = 'none';
                buttons[r].style.opacity = '0.35';
                buttons[r].style.filter = 'grayscale(1)';
                buttons[r].style.border = '2px dashed #EF4444';
                buttons[r].style.background = '#FEF2F2';
                buttons[r].style.boxShadow = 'none';
                buttons[r].style.transform = 'scale(0.96)';
            } else {
                buttons[r].style.cursor = 'pointer';
                buttons[r].style.pointerEvents = 'auto';
                buttons[r].style.opacity = '1';
                buttons[r].style.filter = '';
                buttons[r].style.border = '2px solid #E2E8F0';
                buttons[r].style.background = '#fff';
                buttons[r].style.boxShadow = 'none';
                buttons[r].style.transform = 'scale(1)';
            }
        }
        if (confirmBtn) confirmBtn.style.display = '';
        startQuestionTimer(60);
        return;
    }
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: idx, correcta: isCorrectAnswer, puntos_ganados: pts });
    
    showFeedbackAnimation(isCorrectAnswer, pts);
}
window.confirmQuizAnswer = confirmQuizAnswer;

function getQuizPoints(isCorrect, pregunta) {
    if (pregunta.tipo === 'poll' || pregunta.tipo === 'encuesta') return 0;
    
    var base = 600;
    var timeRatio = Math.max(0, quizTimeLeft) / 60;
    var timePts = Math.round(timeRatio * 400);
    
    // Calcular racha actual (antes de esta respuesta)
    var prevStreak = 0;
    for(var i=quizAnswers.length - 1; i >= 0; i--) {
        var pq = quizData.preguntas.find(function(q) { return q.id === quizAnswers[i].pregunta_id; });
        if (pq && (pq.tipo === 'oa' || pq.tipo === 'poll' || pq.tipo === 'encuesta')) continue;
        if(quizAnswers[i].correcta) { prevStreak++; }
        else { break; }
    }
    var currentStreak = prevStreak + 1;

    // ═══ MULTIPLICADOR DE RACHA: x1, x2, x3, x4, x5 (máx) ═══
    var streakMult = Math.min(currentStreak, 5);
    var streakBonus = (streakMult - 1) * 150; // bonus extra por racha

    var raw = isCorrect ? Math.round((base + timePts + streakBonus) * (pregunta.puntos || 1) * streakMult) : 0;
    
    // Evaluar comodín activo tanto para respuestas correctas como incorrectas
    var finalPts = applyPowerupToAnswer(isCorrect, raw);
    if (finalPts === null) return null;
    return finalPts;
}

function confirmQuizAnswerInstant(idx) {
    if (quizConfirmed) return;
    quizConfirmed = true;
    if (quizTimerInterval) clearInterval(quizTimerInterval);

    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var buttons = document.querySelectorAll('.quiz-opt-btn');
    var isPoll = pregunta.tipo === 'poll' || pregunta.tipo === 'encuesta';
    var isCorrectAnswer = isPoll ? true : (opciones[idx] && opciones[idx].correct);

    for (var i = 0; i < buttons.length; i++) {
        var isSelected = (i === idx);
        if (isSelected && isCorrectAnswer) {
            buttons[i].style.filter = 'brightness(1.2)';
            buttons[i].style.border = '4px solid #fff';
        } else if (isSelected && !isCorrectAnswer) {
            buttons[i].style.filter = 'grayscale(0.5)';
            buttons[i].style.opacity = '0.7';
            buttons[i].style.border = '4px solid #EF4444';
        } else if (!isPoll && opciones[i] && opciones[i].correct) {
            buttons[i].style.filter = 'brightness(1.2)';
            buttons[i].style.border = '4px solid #22C55E';
        } else {
            buttons[i].style.opacity = '0.3';
        }
        buttons[i].style.cursor = 'default';
        buttons[i].style.pointerEvents = 'none';
    }

    var pts = getQuizPoints(isCorrectAnswer, pregunta);
    if (pts === null) {
        // Segunda Oportunidad (Retry) en modo click instantáneo
        quizConfirmed = false;
        for (var i = 0; i < buttons.length; i++) {
            if (i === idx) {
                buttons[i].style.cursor = 'default';
                buttons[i].style.pointerEvents = 'none';
                buttons[i].style.opacity = '0.35';
                buttons[i].style.filter = 'grayscale(1)';
                buttons[i].style.border = '2px dashed #EF4444';
            } else {
                buttons[i].style.cursor = 'pointer';
                buttons[i].style.pointerEvents = 'auto';
                buttons[i].style.opacity = '1';
                buttons[i].style.filter = '';
                buttons[i].style.border = '';
            }
        }
        startQuestionTimer(60);
        return;
    }
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: idx, correcta: isCorrectAnswer, puntos_ganados: pts });
    
    // Stop the timer bar
    var timerBar = document.getElementById('quiz-timer-bar');
    if(timerBar) {
        var computedWidth = window.getComputedStyle(timerBar).width;
        timerBar.style.transition = 'none';
        timerBar.style.width = computedWidth;
    }

    showFeedbackAnimation(isCorrectAnswer, pts);
}
window.confirmQuizAnswerInstant = confirmQuizAnswerInstant;

function quizNext() {
    cleanupPowerupsForNextQ();
    quizCurrentQ++;
    if (quizData && quizData.evaluacion && quizData.evaluacion.codigo) {
        sessionStorage.setItem('alcocer_quiz_state_' + quizData.evaluacion.codigo, JSON.stringify({
            q: quizCurrentQ,
            a: quizAnswers
        }));
    }
    // ═══ RONDA DE COMODINES: pregunta 4 (idx 3) y pregunta 8 (idx 7) ═══
    if (quizCurrentQ === 3 || quizCurrentQ === 7) {
        showPowerupCards();
        return;
    }

    if (quizCurrentQ >= quizData.preguntas.length) { showQuizResults(); }
    else { renderQuizQuestion(); }
}
window.quizNext = quizNext;
window.choosePowerupCard = choosePowerupCard;
window.skipPowerupCards = skipPowerupCards;
window.closePowerupCards = closePowerupCards;

function showQuizResults() {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    stopGameMusic();
    var pwBar = document.getElementById('powerup-bar');
    if (pwBar) pwBar.style.display = 'none';
    activePowerup = null;
    // Limpiar sesión pendiente — el quiz terminó
    sessionStorage.removeItem('alcocer_quiz_code');
    if (quizData && quizData.evaluacion) {
        sessionStorage.removeItem('alcocer_quiz_state_' + quizData.evaluacion.codigo);
        sessionStorage.removeItem('alcocer_quiz_qids_' + quizData.evaluacion.codigo);
    }
    var correctas = 0;
    var totalPoints = 0;
    var totalGradeable = 0; // Questions that actually count toward score
    for (var i = 0; i < quizAnswers.length; i++) {
        var ans = quizAnswers[i];
        var pq = quizData && quizData.preguntas ? quizData.preguntas.find(function(q) { return q.id === ans.pregunta_id; }) : null;
        var isExclude = false;
        if (pq) {
            isExclude = pq.tipo === 'oa' || pq.tipo === 'poll' || pq.tipo === 'encuesta';
        } else {
            isExclude = (ans.correcta === null && ans.es_abierta);
        }
        if (isExclude) continue;
        totalGradeable++;
        if (ans.correcta) correctas++;
        totalPoints += (ans.puntos_ganados || 0);
    }
    var total = quizData.preguntas.length;
    var pct = totalGradeable > 0 ? Math.round((correctas / totalGradeable) * 100) : 0;

    document.getElementById('quiz-container').style.display = 'none';
    var header = document.getElementById('quiz-page-header');
    if (header) header.style.display = 'none';
    document.getElementById('quiz-result').style.display = 'block';

    // Emoji and title based on score
    var emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 40 ? '📝' : '💪';
    var msg = pct >= 90 ? '¡Excelente!' : pct >= 70 ? '¡Muy bien!' : pct >= 40 ? '¡Puedes mejorar!' : '¡Sigue practicando!';
    var emojiEl = document.getElementById('quiz-result-emoji');
    if (emojiEl) {
        emojiEl.textContent = emoji;
        emojiEl.style.background = pct >= 70 ? 'linear-gradient(135deg,#22C55E,#16A34A)' :
                                  pct >= 40 ? 'linear-gradient(135deg,#F59E0B,#D97706)' :
                                              'linear-gradient(135deg,#EF4444,#DC2626)';
    }
    document.getElementById('quiz-result-title').textContent = msg;
    document.getElementById('quiz-result-score').textContent = correctas + '/' + totalGradeable + ' correctas • ' + pct + '%';
    var oaCount = total - totalGradeable;
    var detailEl = document.getElementById('quiz-result-detail');
    if (detailEl) {
        detailEl.textContent = totalPoints + ' puntos totales' + (oaCount > 0 ? ' • ' + oaCount + ' pregunta(s) abierta(s)' : '');
    }

    var fill = document.getElementById('quiz-result-fill');
    fill.style.background = pct >= 70 ? 'linear-gradient(90deg,#22C55E,#16A34A)' :
                             pct >= 40 ? 'linear-gradient(90deg,#F59E0B,#D97706)' :
                                         'linear-gradient(90deg,#EF4444,#DC2626)';
    setTimeout(function() { fill.style.width = pct + '%'; }, 100);

    // Per-question breakdown
    var breakdownEl = document.getElementById('quiz-result-breakdown');
    if (breakdownEl) {
        var bhtml = '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px">';
        for (var j = 0; j < quizAnswers.length; j++) {
            var pq = quizData.preguntas[j];
            var isPoll = pq && (pq.tipo === 'poll' || pq.tipo === 'encuesta');
            var isOA = pq && pq.tipo === 'oa';
            var ok = quizAnswers[j].correcta;
            
            var bg = (isPoll || isOA) ? '#F5F3FF' : (ok ? '#DCFCE7' : '#FEE2E2');
            var color = (isPoll || isOA) ? '#7C3AED' : (ok ? '#166534' : '#DC2626');
            var icon = isPoll ? 'comment-dots' : (isOA ? 'pen-nib' : (ok ? 'check' : 'times'));

            bhtml += '<div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;' +
                'background:' + bg + ';color:' + color + '">' +
                '<i class="fas fa-' + icon + '"></i></div>';
        }
        bhtml += '</div>';
        breakdownEl.innerHTML = bhtml;
    }

    // Mostrar Resumen de Preguntas detallado
    var reviewEl = document.getElementById('quiz-review-list');
    if(reviewEl) {
        var rhtml = '';
        for(var q=0; q<quizData.preguntas.length; q++) {
            var pq = quizData.preguntas[q];
            var ans = quizAnswers[q];
            var isPoll = pq.tipo === 'poll' || pq.tipo === 'encuesta';
            var isOA = pq.tipo === 'oa';
            var ok = (isPoll || isOA) ? null : (ans ? ans.correcta : false);
            var color = (isPoll || isOA) ? '#7C3AED' : (ok ? '#22C55E' : '#EF4444');
            var icon = isPoll ? 'fa-comment-dots' : (isOA ? 'fa-pen-nib' : (ok ? 'fa-check' : 'fa-times'));
            var scoreText = isPoll ? 'Encuesta' : (isOA ? 'Abierta' : (ok ? ('+' + (ans.puntos_ganados || 0) + ' pts') : '0 pts'));
            
            rhtml += '<div style="background:#fff; border-left:6px solid '+color+'; border-radius:12px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">';
            rhtml += '<div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">';
            rhtml += '<div style="font-weight:800; color:#1E293B; flex:1; padding-right:16px; font-size:1.1rem;">' + (q+1) + '. ' + (pq.texto||'') + '</div>';
            rhtml += '<div style="background:'+((isPoll||isOA)?'#F5F3FF':(ok?'#DCFCE7':'#FEE2E2'))+'; color:'+color+'; padding:6px 12px; border-radius:8px; font-weight:800; font-size:0.95rem; white-space:nowrap;"><i class="fas '+icon+'"></i> '+scoreText+'</div>';
            rhtml += '</div>';

            
            // Detectar encuesta/poll abierta: por flag es_abierta, o porque todas las opciones están vacías
            var isPollOpen2 = (pq.tipo === 'poll' || pq.tipo === 'encuesta') &&
                (
                    (ans && ans.es_abierta) ||
                    !pq.opciones || pq.opciones.length === 0 ||
                    pq.opciones.every(function(op){ return !op.text || !op.text.trim(); })
                );

            if (isPollOpen2) {
                // ═══ Encuesta/Poll abierta: mostrar respuesta de texto ═══
                rhtml += '<div style="margin-top:16px; padding:16px 20px; background:#F5F3FF; border:2px solid #DDD6FE; border-radius:12px;">';
                rhtml += '  <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">';
                rhtml += '    <i class="fas fa-comment-dots" style="color:#7C3AED; font-size:0.9rem;"></i>';
                rhtml += '    <span style="font-weight:800; color:#6D28D9; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">Respuesta de encuesta — no afecta el puntaje</span>';
                rhtml += '  </div>';
                rhtml += '  <div style="font-weight:600; color:#1E293B; font-size:0.95rem; line-height:1.5; font-style:italic;">"' + (ans && ans.seleccionada ? ans.seleccionada : '<span style=\'color:#94A3B8;\'>Sin responder</span>') + '"</div>';
                rhtml += '</div>';
            } else if(pq.tipo === 'mc' || pq.tipo === 'tf' || !pq.tipo || pq.tipo === 'ms' || pq.tipo === 'poll' || pq.tipo === 'encuesta') {
                var opts = pq.opciones || [];
                rhtml += '<div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">';
                for(var o=0; o<opts.length; o++) {
                    var isSelected = false;
                    if(pq.tipo === 'ms' && ans && ans.seleccionada && typeof ans.seleccionada.indexOf === 'function') {
                        isSelected = ans.seleccionada.indexOf(o) !== -1;
                    } else {
                        isSelected = ans && ans.seleccionada === o;
                    }
                    var isCorrect = !isPoll && opts[o].correct;
                    var optColor = isPoll ? (isSelected ? '#7C3AED' : '#E2E8F0') : (isCorrect ? '#22C55E' : (isSelected ? '#EF4444' : '#E2E8F0'));
                    var bg = isPoll ? (isSelected ? '#F5F3FF' : '#F8FAFC') : (isCorrect ? '#F0FDF4' : (isSelected ? '#FEF2F2' : '#F8FAFC'));
                    var fontWeight = (isCorrect || isSelected) ? '700' : '500';
                    var icon2 = isPoll ? (isSelected ? '✓' : '') : (isCorrect ? '✓' : (isSelected ? '✗' : ''));
                    rhtml += '<div style="padding:10px 16px; border:2px solid '+optColor+'; background:'+bg+'; border-radius:8px; color:#334155; font-weight:'+fontWeight+'; display:flex; justify-content:space-between;">';
                    rhtml += '<span>' + (opts[o].text||'') + '</span>';
                    rhtml += '<span style="color:'+optColor+'; font-weight:900;">' + icon2 + '</span>';
                    rhtml += '</div>';
                }
                rhtml += '</div>';
            } else if (pq.tipo === 'dnd') {
                var imgUrl = (pq.opciones && pq.opciones[0]) ? pq.opciones[0].pregunta_imagen : '';
                rhtml += '<div style="margin-top:16px; display:flex; flex-direction:column; gap:12px; align-items:center;">';
                rhtml += '  <img src="' + imgUrl + '" style="max-width:100%; max-height:220px; border-radius:8px; border:2px solid #E2E8F0;">';
                rhtml += '  <div style="display:flex; flex-direction:column; gap:6px; width:100%;">';
                var studentMatches = {};
                try {
                    studentMatches = JSON.parse(ans.seleccionada);
                } catch(e) {
                    studentMatches = {};
                }
                var opts = pq.opciones || [];
                for(var o=0; o<opts.length; o++) {
                    var matchIdx = studentMatches[o];
                    var isCorrectMatch = (matchIdx === o);
                    var matchedText = (matchIdx !== undefined && opts[matchIdx]) ? opts[matchIdx].text : 'Sin responder';
                    var matchColor = isCorrectMatch ? '#22C55E' : '#EF4444';
                    var matchBg = isCorrectMatch ? '#F0FDF4' : '#FEF2F2';
                    var matchBorder = isCorrectMatch ? '#86EFAC' : '#FECACA';
                    var matchIcon = isCorrectMatch ? 'fa-check' : 'fa-times';
                    rhtml += '    <div style="padding:10px 16px; border:2px solid '+matchBorder+'; background:'+matchBg+'; border-radius:8px; color:#334155; display:flex; justify-content:space-between; align-items:center;">';
                    rhtml += '      <span style="font-weight:700;">Parte ' + String.fromCharCode(65+o) + ' (' + (opts[o].text||'') + '):</span>';
                    rhtml += '      <span style="color:'+matchColor+'; font-weight:800;"><i class="fas '+matchIcon+'"></i> Tu respuesta: ' + matchedText + '</span>';
                    rhtml += '    </div>';
                }
                rhtml += '  </div>';
                rhtml += '</div>';
            } else if (pq.tipo === 'oa') {
                rhtml += '<div style="margin-top:16px; padding:16px 20px; background:#F5F3FF; border:2px solid #DDD6FE; border-radius:12px;">';
                rhtml += '  <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">';
                rhtml += '    <i class="fas fa-pen-nib" style="color:#7C3AED; font-size:0.9rem;"></i>';
                rhtml += '    <span style="font-weight:800; color:#6D28D9; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">Respuesta abierta — no afecta el puntaje</span>';
                rhtml += '  </div>';
                rhtml += '  <div style="font-weight:600; color:#1E293B; font-size:0.95rem; line-height:1.5; font-style:italic;">"' + (ans && ans.seleccionada ? ans.seleccionada : '<span style=\'color:#94A3B8;\'>Sin responder</span>') + '"</div>';
                rhtml += '</div>';
            } else if (pq.tipo === 'fb') {
                var correctaFb = (pq.opciones && pq.opciones[0]) ? pq.opciones[0].text : '';
                var studentAns = ans ? (ans.seleccionada || 'Sin responder') : 'Sin responder';
                var fbIsCorrect = ans && ans.correcta;
                rhtml += '<div style="margin-top:16px; padding:14px; background:' + (fbIsCorrect ? '#F0FDF4' : '#FEF2F2') + '; border:2px solid ' + (fbIsCorrect ? '#86EFAC' : '#FECACA') + '; border-radius:10px;">';
                rhtml += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">';
                rhtml += '<div style="font-weight:800; color:' + (fbIsCorrect ? '#166534' : '#DC2626') + '; font-size:0.85rem"><i class="fas fa-' + (fbIsCorrect ? 'check' : 'times') + '-circle"></i> ' + (fbIsCorrect ? '¡Correcto!' : 'Incorrecto') + '</div>';
                rhtml += '</div>';
                rhtml += '<div style="font-weight:700; color:#475569; font-size:0.8rem; margin-bottom:2px;">Tu respuesta:</div>';
                rhtml += '<div style="font-weight:600; color:#1E293B;background:#fff;padding:6px 10px;border-radius:6px;margin-bottom:8px">' + studentAns + '</div>';
                rhtml += '<div style="font-weight:700; color:#059669; font-size:0.8rem; margin-bottom:2px;">✅ Respuesta correcta:</div>';
                rhtml += '<div style="font-weight:700; color:#059669;background:#F0FDF4;padding:6px 10px;border-radius:6px">' + (correctaFb || 'No especificada') + '</div>';
                rhtml += '</div>';
            }
            rhtml += '</div>';
        }
        reviewEl.innerHTML = rhtml;
        document.getElementById('quiz-review-section').style.display = 'block';
    }

    // Guardar en Supabase y cargar leaderboard según modo
    var evalIdForBoard = quizData.evaluacion.id;
    var isTestMode = quizSessionMode === 'test';
    var isTeamMode = quizSessionMode === 'equipo';

    if (currentUser) {
        var client = getSupabase();
        client.from('evaluacion_resultados').insert({
            evaluacion_id: evalIdForBoard,
            user_id: currentUser.id,
            puntaje: totalPoints,
            total: total,
            porcentaje: pct,
            respuestas: quizAnswers
        }).then(function(r) {
            if (r.error) {
                console.warn('Insert resultado:', r.error.message);
                if (r.error.message && r.error.message.toLowerCase().includes('row-level security')) {
                    document.getElementById('quiz-result-breakdown').innerHTML += '<div style="color:red; margin-bottom: 10px;">⚠️ Tu nota no se guardó porque el profesor no ha habilitado los permisos en la base de datos.</div>';
                }
                
                client.from('evaluacion_resultados').update({
                    puntaje: totalPoints,
                    total: total,
                    porcentaje: pct,
                    respuestas: quizAnswers
                }).eq('evaluacion_id', evalIdForBoard).eq('user_id', currentUser.id).then(function() {
                    if (!isTestMode) {
                        if (isTeamMode) loadTeamLeaderboard(evalIdForBoard);
                        else loadLeaderboard(evalIdForBoard);
                    }
                }).catch(function() {
                    if (!isTestMode) loadLeaderboard(evalIdForBoard);
                });
            } else {
                if (!isTestMode) {
                    if (isTeamMode) loadTeamLeaderboard(evalIdForBoard);
                    else loadLeaderboard(evalIdForBoard);
                }
            }
        }).catch(function() {
            if (!isTestMode) loadLeaderboard(evalIdForBoard);
        });
    } else if (!isTestMode) {
        loadLeaderboard(evalIdForBoard);
    }

    // En modo test, mostrar mensaje de confirmación sin leaderboard
    if (isTestMode) {
        var podiumEl = document.getElementById('quiz-podium');
        if (podiumEl) {
            podiumEl.style.display = 'block';
            podiumEl.innerHTML = '<div style="text-align:center;padding:32px;background:rgba(37,99,235,0.1);border:2px solid rgba(37,99,235,0.25);border-radius:20px;margin-bottom:24px;">' +
                '<div style="font-size:3rem;margin-bottom:12px;">📋</div>' +
                '<h3 style="color:#fff;font-size:1.3rem;font-weight:900;margin-bottom:8px;">Examen Enviado</h3>' +
                '<p style="color:rgba(255,255,255,0.6);font-size:0.95rem;font-weight:500;margin:0;">Tu profesor revisará los resultados. ¡Buen trabajo!</p>' +
                '</div>';
        }
    }

    // En modo equipo, mostrar badge del equipo
    if (isTeamMode && quizTeamName) {
        var breakdownEl2 = document.getElementById('quiz-result-breakdown');
        if (breakdownEl2) {
            var teamBadge = '<div style="text-align:center;padding:12px 20px;background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3);border-radius:12px;margin-bottom:16px;display:inline-flex;align-items:center;gap:8px;font-weight:800;color:#A78BFA;font-size:1rem;">' +
                '<i class="fas fa-users"></i> ' + quizTeamName + '</div>';
            breakdownEl2.innerHTML = teamBadge + breakdownEl2.innerHTML;
        }
    }
}

function loadLeaderboard(evalId) {
    if (!window.studentLeaderboardInterval) {
        window.studentLeaderboardInterval = setInterval(function() {
            loadLeaderboard(evalId);
        }, 5000);
    }
    var client = getSupabase();
    console.log('Loading leaderboard for:', evalId);
    client.from('evaluacion_resultados').select('user_id,puntaje,total,porcentaje').eq('evaluacion_id', evalId).order('porcentaje', { ascending: false }).order('puntaje', { ascending: false }).then(function(r) {
        console.log('Leaderboard data:', r.data, 'Error:', r.error);
        if (r.error) { 
            console.warn('Leaderboard error:', r.error.message); 
            // Mostrar error visual si es por permisos (RLS)
            var podiumEl = document.getElementById('quiz-podium');
            if (podiumEl) {
                podiumEl.style.display = 'block';
                podiumEl.innerHTML = '<div style="padding:20px;background:rgba(255,0,0,0.2);color:#fff;border-radius:12px;margin-bottom:20px;border:2px solid red;"><b>⚠️ ERROR DE BASE DE DATOS</b><br>Las políticas RLS de Supabase están bloqueando a los estudiantes.<br>El profesor debe ir al panel de Supabase y ejecutar el código SQL de permisos.</div>';
            }
            return; 
        }
        if (!r.data || r.data.length === 0) { console.log('No results yet'); return; }

        // Get participant names
        var userIds = [];
        for (var i = 0; i < r.data.length; i++) {
            if (userIds.indexOf(r.data[i].user_id) === -1) userIds.push(r.data[i].user_id);
        }

        client.from('evaluacion_participantes').select('user_id,nombre').eq('evaluacion_id', evalId).then(function(pRes) {
            var nameMap = {};
            if (pRes.data) {
                for (var n = 0; n < pRes.data.length; n++) {
                    var raw = pRes.data[n].nombre || 'Estudiante';
                    var av = '👤';
                    var nm = raw;
                    if (raw.indexOf('|') !== -1) {
                        var parts = raw.split('|');
                        av = parts[0]; nm = parts[1];
                    }
                    av = normalizeAvatarValue(av, nm);
                    nameMap[pRes.data[n].user_id] = { nombre: nm, avatar: av };
                }
            }

            var results = r.data;
            // Build leaderboard entries
            var entries = [];
            for (var k = 0; k < results.length; k++) {
                var mapData = nameMap[results[k].user_id] || { nombre: 'Estudiante', avatar: normalizeAvatarValue('', 'Estudiante ' + k) };
                entries.push({
                    user_id: results[k].user_id,
                    nombre: mapData.nombre,
                    avatar: mapData.avatar,
                    puntaje: results[k].puntaje,
                    total: results[k].total,
                    porcentaje: results[k].porcentaje
                });
            }

            renderPodium(entries);
        });
    });
}

function renderPodium(entries) {
    var podiumEl = document.getElementById('quiz-podium');
    if (!podiumEl || entries.length === 0) return;
    podiumEl.style.display = 'block';

    if (!window._triumphPlayed) {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var o = ctx.createOscillator(); var o2 = ctx.createOscillator(); var g = ctx.createGain();
            o.type = 'square'; o2.type = 'triangle';
            var notes = [523.25, 659.25, 783.99, 1046.50]; var t = ctx.currentTime;
            for (var i = 0; i < notes.length; i++) {
                o.frequency.setValueAtTime(notes[i], t + i*0.15);
                o2.frequency.setValueAtTime(notes[i]/2, t + i*0.15);
            }
            g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(0.15, t+0.1);
            g.gain.setValueAtTime(0.15, t+0.5); g.gain.exponentialRampToValueAtTime(0.001, t+1.5);
            o.connect(g); o2.connect(g); g.connect(ctx.destination);
            o.start(t); o2.start(t); o.stop(t+1.6); o2.stop(t+1.6);
            window._triumphPlayed = true;
        } catch(e) {}
    }

    var currentDataStr = JSON.stringify(entries);
    if (window._lastPodiumData === currentDataStr) return;
    window._lastPodiumData = currentDataStr;

    var isFirstRender = !document.getElementById('podium-pillars').innerHTML.trim();
    var pillarOrder = [1, 0, 2];
    var pillarsHtml = '';

    for (var p = 0; p < 3; p++) {
        var idx = pillarOrder[p];
        if (idx >= entries.length) {
            pillarsHtml += '<div style="flex:1;max-width:136px"></div>';
            continue;
        }
        var e = entries[idx];
        var rankClass  = idx===0 ? 'rank-1' : (idx===1 ? 'rank-2' : 'rank-3');
        var rankText   = idx===0 ? '1'      : (idx===1 ? '2'      : '3');
        var animStyle  = isFirstRender
            ? ('animation-delay:' + (p*0.22) + 's')
            : 'animation:none!important;opacity:1!important;transform:translateY(0)!important;';

        pillarsHtml += '<div class="podium-cylinder ' + rankClass + '" style="' + animStyle + '">';
        
        // 1. Avatar Section (Above pedestal)
        pillarsHtml += '<div class="podium-avatar-wrapper">';
        if (idx === 0) pillarsHtml += '<div class="podium-crown">👑</div>';
        pillarsHtml += '<div class="podium-avatar-ring"></div>';
        pillarsHtml += '<div class="podium-avatar">' + avatarMarkup(e.avatar, e.nombre, 'podium-avatar-media') + '</div>';
        pillarsHtml += '<div class="podium-name">' + e.nombre + '</div>';
        pillarsHtml += '</div>';
        
        // 2. Pedestal Cylindrical Column
        pillarsHtml += '<div class="cylinder-top"></div>';
        pillarsHtml += '<div class="cylinder-body">';
        
        // Golden Laurels wrapping number 1 (Middle screen style)
        if (idx === 0) {
            pillarsHtml += '<div class="laurel-wreath-rank1-left">🌿</div>';
            pillarsHtml += '<div class="laurel-wreath-rank1-right">🌿</div>';
        }
        
        pillarsHtml += '<div class="cylinder-rank">' + rankText + '</div>';
        pillarsHtml += '</div>';
        
        // 3. Stats Badge sitting exactly at the bottom of the cylinder
        pillarsHtml += '<div class="podium-score-badge">';
        pillarsHtml += '<div class="score-pts">' + e.puntaje + ' pts</div>';
        pillarsHtml += '<div class="score-pct">' + e.porcentaje + '%</div>';
        pillarsHtml += '</div>';
        
        pillarsHtml += '</div>';
    }

    document.getElementById('podium-pillars').innerHTML = pillarsHtml;

    // Add perspective circular stage base if not already present
    var stageContainer = document.getElementById('podium-stage-base');
    if (!stageContainer) {
        var pillarsWrapper = document.getElementById('podium-pillars');
        if (pillarsWrapper) {
            var stageGlow = document.createElement('div');
            stageGlow.id = 'podium-stage-base';
            stageGlow.className = 'podium-stage-glow';
            pillarsWrapper.appendChild(stageGlow);
        }
    }

    if (currentUser) {
        var myRank = -1;
        for (var m = 0; m < entries.length; m++) {
            if (entries[m].user_id === currentUser.id) { myRank = m+1; break; }
        }
        if (myRank > 0) {
            var rankPill = document.getElementById('my-rank-pill');
            if (rankPill) {
                var medalHtml = '<div class="medal-ribbon-container">' +
                                '  <div class="ribbon-blue-left"></div>' +
                                '  <div class="ribbon-blue-right"></div>' +
                                '  <div class="medal-gold-circle">🏅</div>' +
                                '</div>';
                rankPill.innerHTML = medalHtml + '<div class="rank-pill-text-content">Tu posición: <strong>' + myRank + '°</strong> de ' + entries.length + ' estudiantes</div>';
                rankPill.style.display = 'flex';
            }
        }
    }

    var listHtml = '';
    for (var l = 0; l < entries.length; l++) {
        var isMe      = currentUser && entries[l].user_id === currentUser.id;
        var rClass    = l===0 ? 'tr-gold'   : l===1 ? 'tr-silver' : l===2 ? 'tr-bronze' : 'tr-normal';
        var rowAccent = l===0 ? 'row-gold'  : l===1 ? 'row-silver': l===2 ? 'row-bronze': '';
        var rankIcon  = l===0 ? '🥇' : l===1 ? '🥈' : l===2 ? '🥉' : (l+1);
        listHtml += '<tr class="' + rowAccent + (isMe ? ' is-me-row' : '') + '">';
        listHtml += '<td style="width:56px;"><div class="tr-rank-circle ' + rClass + '">' + rankIcon + '</div></td>';
        listHtml += '<td><div style="display:flex;align-items:center;gap:12px;">';
        listHtml += '<div class="podium-mini-avatar">' + avatarMarkup(entries[l].avatar, entries[l].nombre, 'podium-mini-avatar-media') + '</div>';
        listHtml += '<div class="player-name">' + entries[l].nombre + (isMe ? ' <span style="font-size:10px;background:#E91E63;color:#fff;padding:2px 7px;border-radius:6px;margin-left:5px;">TÚ</span>' : '') + '</div>';
        listHtml += '</div></td>';
        listHtml += '<td style="text-align:right;"><div class="player-score">' + entries[l].puntaje + ' <span>pts</span></div></td>';
        listHtml += '<td style="text-align:right;width:80px;"><div class="player-pct">' + entries[l].porcentaje + '%</div></td>';
        listHtml += '</tr>';
    }
    var fullListEl = document.getElementById('podium-full-list');
    if (fullListEl) fullListEl.innerHTML = listHtml;

    if (isFirstRender) spawnConfetti();
}
// ═══ MODO EQUIPO — Leaderboard por equipos ═══
function loadTeamLeaderboard(evalId) {
    if (!window.studentLeaderboardInterval) {
        window.studentLeaderboardInterval = setInterval(function() {
            loadTeamLeaderboard(evalId);
        }, 5000);
    }
    var client = getSupabase();
    
    // Cargar resultados + participantes con equipo
    Promise.all([
        client.from('evaluacion_resultados').select('user_id,puntaje,total,porcentaje').eq('evaluacion_id', evalId),
        client.from('evaluacion_participantes').select('user_id,nombre').eq('evaluacion_id', evalId)
    ]).then(function(results) {
        var resData = results[0].data || [];
        var partData = results[1].data || [];
        
        if (resData.length === 0) return;
        
        // Build name+team map
        var partMap = {};
        for (var p = 0; p < partData.length; p++) {
            var raw = partData[p].nombre || 'Estudiante';
            var av = '👤', nm = raw;
            if (raw.indexOf('|') !== -1) { var pts = raw.split('|'); av = pts[0]; nm = pts[1]; }
            av = normalizeAvatarValue(av, nm);
            partMap[partData[p].user_id] = { nombre: nm, avatar: av, equipo: partData[p].equipo || 'Sin equipo' };
        }
        
        // Group by team
        var teams = {};
        for (var r = 0; r < resData.length; r++) {
            var info = partMap[resData[r].user_id] || { nombre: 'Estudiante', avatar: normalizeAvatarValue('', 'Estudiante ' + r), equipo: 'Sin equipo' };
            var tName = info.equipo;
            if (!teams[tName]) teams[tName] = { members: [], totalPts: 0, totalPct: 0 };
            teams[tName].members.push({ nombre: info.nombre, avatar: info.avatar, puntaje: resData[r].puntaje, porcentaje: resData[r].porcentaje });
            teams[tName].totalPts += resData[r].puntaje;
            teams[tName].totalPct += resData[r].porcentaje;
        }
        
        // Sort teams by total points
        var teamEntries = [];
        for (var tKey in teams) {
            var t = teams[tKey];
            teamEntries.push({
                name: tKey,
                totalPts: t.totalPts,
                avgPct: Math.round(t.totalPct / t.members.length),
                members: t.members
            });
        }
        teamEntries.sort(function(a, b) { return b.totalPts - a.totalPts; });
        
        // Render team podium
        var podiumEl = document.getElementById('quiz-podium');
        if (!podiumEl || teamEntries.length === 0) return;
        podiumEl.style.display = 'block';

        // Triumph sound (only once)
        if (!window._triumphPlayed) {
            try {
                var ctx = new (window.AudioContext || window.webkitAudioContext)();
                var o = ctx.createOscillator();
                var g = ctx.createGain();
                o.type = 'square';
                var notes = [523.25, 659.25, 783.99, 1046.50];
                var ct = ctx.currentTime;
                for (var n = 0; n < notes.length; n++) { o.frequency.setValueAtTime(notes[n], ct + n * 0.15); }
                g.gain.setValueAtTime(0, ct); g.gain.linearRampToValueAtTime(0.15, ct + 0.1);
                g.gain.exponentialRampToValueAtTime(0.001, ct + 1.5);
                o.connect(g); g.connect(ctx.destination); o.start(ct); o.stop(ct + 1.6);
                window._triumphPlayed = true;
            } catch(e) {}
        }

        var currentDataStr = JSON.stringify(teamEntries);
        if (window._lastPodiumData === currentDataStr) return;
        window._lastPodiumData = currentDataStr;

        // Build team cards
        var tHtml = '<div class="stadium-podium-container"><div class="stadium-light-beam"></div>';
        tHtml += '<h3 style="font-size:1.4rem;font-weight:900;margin-bottom:20px;position:relative;z-index:10;color:#fff;text-shadow:0 2px 5px rgba(0,0,0,0.8);text-align:center;">';
        tHtml += '<i class="fas fa-users" style="color:#A78BFA;margin-right:8px;"></i> Ranking por Equipos</h3>';
        tHtml += '<div style="display:flex;flex-direction:column;gap:16px;max-width:500px;margin:0 auto;position:relative;z-index:10;">';
        
        var medals = ['🥇', '🥈', '🥉'];
        for (var ti = 0; ti < teamEntries.length; ti++) {
            var te = teamEntries[ti];
            var medalIcon = ti < 3 ? medals[ti] : (ti + 1) + '°';
            var borderColor = ti === 0 ? '#FFD700' : (ti === 1 ? '#C0C0C0' : (ti === 2 ? '#CD7F32' : 'rgba(255,255,255,0.15)'));
            var glowColor = ti === 0 ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)';
            
            tHtml += '<div style="background:rgba(255,255,255,0.06);border:2px solid ' + borderColor + ';border-radius:16px;padding:20px;backdrop-filter:blur(8px);box-shadow:0 4px 20px ' + glowColor + ';">';
            tHtml += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">';
            tHtml += '<div style="display:flex;align-items:center;gap:12px;">';
            tHtml += '<span style="font-size:1.8rem;">' + medalIcon + '</span>';
            tHtml += '<div><div style="color:#fff;font-weight:900;font-size:1.1rem;">' + te.name + '</div>';
            tHtml += '<div style="color:rgba(255,255,255,0.5);font-size:0.8rem;font-weight:600;">' + te.members.length + ' miembro' + (te.members.length > 1 ? 's' : '') + '</div></div>';
            tHtml += '</div>';
            tHtml += '<div style="text-align:right;"><div style="color:#FFD700;font-weight:900;font-size:1.3rem;">' + te.totalPts + ' pts</div>';
            tHtml += '<div style="color:rgba(255,255,255,0.4);font-size:0.8rem;font-weight:600;">' + te.avgPct + '% prom.</div></div>';
            tHtml += '</div>';
            
            // Team members
            tHtml += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
            for (var mi = 0; mi < te.members.length; mi++) {
                var mem = te.members[mi];
                tHtml += '<div style="display:flex;align-items:center;gap:4px;background:rgba(255,255,255,0.08);padding:4px 10px;border-radius:8px;font-size:0.8rem;">';
                tHtml += '<span class="team-member-avatar">' + avatarMarkup(mem.avatar, mem.nombre, 'team-member-avatar-media') + '</span>';
                tHtml += '<span style="color:rgba(255,255,255,0.7);font-weight:600;">' + mem.nombre + '</span>';
                tHtml += '<span style="color:#A78BFA;font-weight:800;margin-left:4px;">' + mem.puntaje + 'pts</span>';
                tHtml += '</div>';
            }
            tHtml += '</div></div>';
        }
        tHtml += '</div></div>';
        
        // My team
        if (quizTeamName) {
            var myTeamRank = -1;
            for (var mr = 0; mr < teamEntries.length; mr++) {
                if (teamEntries[mr].name === quizTeamName) { myTeamRank = mr + 1; break; }
            }
            if (myTeamRank > 0) {
                var rankPill = document.getElementById('my-rank-pill');
                if (rankPill) {
                    rankPill.innerHTML = '👥 Tu equipo: <strong style="font-size:1.1rem;margin:0 4px">' + quizTeamName + '</strong> — Posición: <strong>' + myTeamRank + '°</strong> de ' + teamEntries.length + ' equipos';
                    rankPill.style.display = 'inline-block';
                }
            }
        }
        
        // Hide individual table, replace with team view
        var tableEl = document.getElementById('total-ranking-table');
        if (tableEl) tableEl.style.display = 'none';
        
        var podiumPillars = document.getElementById('podium-pillars');
        if (podiumPillars) podiumPillars.innerHTML = '';
        
        // Insert team html  
        var existingTeamView = document.getElementById('team-ranking-view');
        if (existingTeamView) existingTeamView.innerHTML = tHtml;
        else {
            var teamDiv = document.createElement('div');
            teamDiv.id = 'team-ranking-view';
            teamDiv.innerHTML = tHtml;
            podiumEl.insertBefore(teamDiv, podiumEl.firstChild);
        }
    });
}

// ═══ ADMIN: BIBLIOTECA — Evaluaciones creadas ═══

function loadLibrary() {
    var container = document.getElementById('library-list');
    if (!container || !currentUser) return;
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:24px"></i><p style="margin-top:12px">Cargando biblioteca...</p></div>';

    var client = getSupabase();
    client.from('evaluaciones').select('*').order('created_at', {ascending: false}).then(function(r) {
        if (r.error || !r.data || r.data.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>No has creado evaluaciones aún</p><small>Haz clic en "Nueva evaluación" para empezar</small></div>';
            return;
        }
        var html = '';
        for (var i = 0; i < r.data.length; i++) {
            var ev = r.data[i];
            var statusBadge = ev.publicado
                ? '<span style="background:#DCFCE7;color:#166534;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700">Publicado</span>'
                : '<span style="background:#FEF3C7;color:#92400E;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700">Borrador</span>';
            var codeHtml = ev.codigo ? '<span style="font-family:monospace;font-size:13px;color:#2563EB;font-weight:700">Código: ' + ev.codigo + '</span>' : '';
            var fecha = new Date(ev.created_at).toLocaleDateString('es-ES', {day:'numeric',month:'short',year:'numeric'});
            html += '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:20px;margin-bottom:12px;display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;transition:box-shadow .2s" onmouseover="this.style.boxShadow=\'0 4px 16px rgba(0,0,0,.08)\'" onmouseout="this.style.boxShadow=\'none\'">' +
                '<div style="flex:1;min-width:200px">' +
                '<div style="display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:6px">' +
                '<h3 style="font-size:16px;font-weight:700;color:#1E293B;margin:0">' + (ev.titulo || 'Sin título') + '</h3>' +
                statusBadge + '</div>' +
                '<div style="display:flex;flex-wrap:wrap;gap:12px;font-size:12px;color:#64748B">' +
                '<span><i class="fas fa-book"></i> ' + (ev.asignatura || 'General') + (ev.tema ? ' - ' + ev.tema : '') + '</span>' +
                '<span><i class="fas fa-calendar"></i> ' + fecha + '</span>' +
                codeHtml + '</div></div>' +
                '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:flex-end">' +
                '<button onclick="window.location.href=\'editor.html?id=' + ev.id + 
                '\'" style="padding:8px 14px;background:#F0F1F3;border:1px solid #E2E8F0;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;color:#555"><i class="fas fa-edit"></i> Editar</button>' +
                (ev.publicado ? '<button onclick="window.location.href=\'editor.html?id=' + ev.id + '&results=true\'" style="padding:8px 14px;background:#8B5CF6;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;" title="Resultados en vivo"><i class="fas fa-trophy"></i> Resultados</button>' : '') +
                (ev.publicado ? '<button onclick="window.location.href=\'editor.html?id=' + ev.id + '&play=true\'" style="padding:8px 14px;background:#2563EB;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;" title="Abrir sala de juego"><i class="fas fa-play"></i> Jugar</button>' : '') +
                '<button onclick="deleteQuiz(\'' + ev.id + '\', event)" style="padding:8px 14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;font-weight:600;font-size:12px;cursor:pointer;color:#DC2626;" title="Borrar"><i class="fas fa-trash-alt"></i></button>' +
                '</div></div>';
        }
        container.innerHTML = html;
    });
}

window.deleteQuiz = function(id, e) {
    var btn = (e && e.currentTarget) ? e.currentTarget : null;
    showCustomConfirm('¿Estás seguro de que deseas borrar permanentemente esta evaluación? Todos los resultados e informes asociados también se perderán.', function() {
        if (btn) btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        var client = getSupabase();
        if (!client) { showCustomAlert('Error de conexión. Recarga la página.'); return; }

        Promise.all([
            client.from('evaluacion_preguntas').delete().eq('evaluacion_id', id),
            client.from('evaluacion_participantes').delete().eq('evaluacion_id', id),
            client.from('evaluacion_resultados').delete().eq('evaluacion_id', id)
        ]).catch(function(err) {
            console.warn('Alguna dependencia no se pudo borrar (posible RLS):', err);
        }).then(function() {
            client.from('evaluaciones').delete().eq('id', id).then(function(r) {
                if (r.error) {
                    showCustomAlert('Error al borrar: ' + r.error.message);
                    if (btn) btn.innerHTML = '<i class="fas fa-trash-alt"></i>';
                } else {
                    loadLibrary();
                    if (typeof loadReports === 'function') loadReports();
                }
            });
        });
    });
};

// ═══ ADMIN: INFORMES — Resultados de estudiantes ═══

window.adminReportsData = {};
window.adminReportsNameMap = {};

window.openReportDetail = function(evalId, userId) {
    if(!window.adminReportsData || !window.adminReportsData[evalId]) return;
    var r = window.adminReportsData[evalId].find(function(x) { return x.user_id === userId; });
    
    // Robust Fallback: If no exact user_id match (due to RLS column restrictions or device states)
    // and there is only 1 result inside the array, default to it as it represents the student's own score.
    if(!r && window.adminReportsData[evalId].length > 0) {
        r = window.adminReportsData[evalId][0];
    }
    
    if(!r) return;
    
    var overlay = document.createElement('div');
    overlay.id = 'report-detail-modal';
    overlay.className = 'report-detail-overlay';
    
    var modal = document.createElement('div');
    modal.className = 'report-detail-modal-box';
    
    var studentName = window.adminReportsNameMap ? (window.adminReportsNameMap[evalId+'_'+userId] || 'Estudiante') : 'Estudiante';
    var header = document.createElement('div');
    header.className = 'report-detail-header';
    header.innerHTML = '<h2 style="font-size:1.2rem;font-weight:800;color:#1E293B;margin:0;display:flex;align-items:center;gap:8px;"><i class="fas fa-user-circle" style="color:#94A3B8;"></i>' + studentName + '</h2>' +
                       '<button onclick="document.body.removeChild(document.getElementById(\'report-detail-modal\'))" style="background:none;border:none;font-size:28px;color:#94A3B8;cursor:pointer;padding:0;line-height:1;">&times;</button>';
    modal.appendChild(header);
    
    var bodyContainer = document.createElement('div');
    bodyContainer.style.cssText = 'padding:24px;overflow-y:auto;flex:1;';
    bodyContainer.innerHTML = '<div style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:32px;color:#94A3B8;"></i></div>';
    modal.appendChild(bodyContainer);
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    var client = getSupabase();
    client.from('evaluacion_preguntas').select('id, orden, texto, opciones, tipo').eq('evaluacion_id', evalId).order('orden').then(function(qRes) {
        if(qRes.error || !qRes.data) {
            bodyContainer.innerHTML = '<div style="color:#EF4444;text-align:center;padding:20px;font-weight:700;"><i class="fas fa-exclamation-triangle"></i> Error cargando preguntas</div>';
            return;
        }
        var qs = qRes.data;
        var html = '';
        html += '<div style="display:flex;gap:12px;margin-bottom:24px;">';
        var correctCount = 0;
        var totalGradeableCount = 0;
        var ans = r.respuestas || [];

        // Build answer map by pregunta_id for reliable matching
        var ansMap = {};
        for (var ak = 0; ak < ans.length; ak++) {
            if (ans[ak] && ans[ak].pregunta_id) {
                ansMap[ans[ak].pregunta_id] = ans[ak];
            }
        }

        // ═══ KEY FIX: Filter qs to only the questions the student actually answered ═══
        var answeredIds = Object.keys(ansMap);
        if (answeredIds.length > 0) {
            // We have pregunta_id references — filter bank to only those IDs
            var answeredIdSet = {};
            for (var ki = 0; ki < answeredIds.length; ki++) answeredIdSet[answeredIds[ki]] = true;
            qs = qs.filter(function(q) { return answeredIdSet[q.id] || answeredIdSet[String(q.id)]; });
        } else if (ans.length > 0 && ans.length < qs.length) {
            // No pregunta_id stored — answers are positional; cap qs to the answered count
            qs = qs.slice(0, ans.length);
        }
        // If ans is empty or qs already matches — keep qs as-is (nothing to filter)

        for (var aIndex = 0; aIndex < qs.length; aIndex++) {
            var qItem = qs[aIndex];
            var isExclude = qItem.tipo === 'oa' || qItem.tipo === 'poll' || qItem.tipo === 'encuesta';
            if (isExclude) continue;
            totalGradeableCount++;
            var aItem = ansMap[qItem.id] || ans[aIndex];
            if (aItem && aItem.correcta) {
                correctCount++;
            }
        }
        if (totalGradeableCount === 0) {
            totalGradeableCount = r.total || qs.length || 0;
            correctCount = Math.round(((r.porcentaje || 0) / 100) * totalGradeableCount);
        }
        
        html += '<div style="flex:1;background:#F0FDF4;padding:16px;border-radius:16px;text-align:center;border:2px solid #DCFCE7;"><div style="font-size:28px;font-weight:900;color:#166534;">'+correctCount+' / '+totalGradeableCount+'</div><div style="font-size:13px;color:#15803D;font-weight:800;">Correctas</div></div>';
        html += '<div style="flex:1;background:#EFF6FF;padding:16px;border-radius:16px;text-align:center;border:2px solid #DBEAFE;"><div style="font-size:28px;font-weight:900;color:#1E40AF;">'+r.porcentaje+'%</div><div style="font-size:13px;color:#1D4ED8;font-weight:800;">Precisión</div></div>';
        html += '</div>';
        
        for(var i=0; i<qs.length; i++) {
            var q = qs[i];
            // Match answer by pregunta_id first, then fall back to index
            var a = ansMap[q.id] || ans[i];
            var isPoll = q.tipo === 'poll' || q.tipo === 'encuesta';
            var isCorrect = isPoll ? true : (a ? a.correcta : false);
            var qColor = isPoll ? '#7C3AED' : (isCorrect ? '#22C55E' : '#EF4444');
            var qBg = isPoll ? '#F5F3FF' : (isCorrect ? '#F0FDF4' : '#FEF2F2');
            var qIcon = isPoll ? 'fa-comment-dots' : (isCorrect ? 'fa-check-circle' : 'fa-times-circle');
            
            html += '<div style="background:'+qBg+';border:2px solid '+qColor+'40;border-radius:16px;padding:20px;margin-bottom:16px;">';
            html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">';
            html += '<div style="font-weight:800;color:#1E293B;font-size:1.05rem;line-height:1.4;flex:1;padding-right:12px;">' + (i+1) + '. ' + (q.texto||'') + '</div>';
            html += '<div style="color:'+qColor+';font-size:1.4rem;"><i class="fas '+qIcon+'"></i></div>';
            html += '</div>';
            
            // Detectar encuesta/poll abierta: por flag es_abierta en la respuesta,
            // o porque todas las opciones están vacías
            var isPollOpenRes = (q.tipo === 'poll' || q.tipo === 'encuesta') &&
                (
                    (a && a.es_abierta) ||
                    !q.opciones || q.opciones.length === 0 ||
                    q.opciones.every(function(op){ return !op.text || !op.text.trim(); })
                );

            if (isPollOpenRes) {
                // ═══ Encuesta/Poll abierta: mostrar respuesta de texto ═══
                html += '<div style="margin-top:16px; padding:16px 20px; background:#F5F3FF; border:2px solid #DDD6FE; border-radius:12px;">';
                html += '  <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">';
                html += '    <i class="fas fa-comment-dots" style="color:#7C3AED; font-size:0.9rem;"></i>';
                html += '    <span style="font-weight:800; color:#6D28D9; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">Respuesta de encuesta — no afecta el puntaje</span>';
                html += '  </div>';
                html += '  <div style="font-weight:600; color:#1E293B; font-size:0.95rem; line-height:1.5; font-style:italic;">"' + (a && a.seleccionada ? a.seleccionada : '<span style=\'color:#94A3B8;\'>Sin responder</span>') + '"</div>';
                html += '</div>';
            } else if (q.tipo === 'oa') {
                // ═══ Respuesta abierta (oa): mostrar respuesta de texto ═══
                html += '<div style="margin-top:16px; padding:16px 20px; background:#F5F3FF; border:2px solid #DDD6FE; border-radius:12px;">';
                html += '  <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">';
                html += '    <i class="fas fa-pen-nib" style="color:#7C3AED; font-size:0.9rem;"></i>';
                html += '    <span style="font-weight:800; color:#6D28D9; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">Respuesta abierta — no afecta el puntaje</span>';
                html += '  </div>';
                html += '  <div style="font-weight:600; color:#1E293B; font-size:0.95rem; line-height:1.5; font-style:italic;">"' + (a && a.seleccionada ? a.seleccionada : '<span style=\'color:#94A3B8;\'>Sin responder</span>') + '"</div>';
                html += '</div>';
            } else if(q.tipo === 'mc' || q.tipo === 'tf' || !q.tipo || q.tipo === 'ms' || q.tipo === 'poll' || q.tipo === 'encuesta') {
                var opts = q.opciones || [];
                html += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">';
                for(var o=0; o<opts.length; o++) {
                    var isSelected = false;
                    if(q.tipo === 'ms' && a && a.seleccionada && typeof a.seleccionada.indexOf === 'function') {
                        isSelected = a.seleccionada.indexOf(o) !== -1;
                    } else {
                        isSelected = a && a.seleccionada === o;
                    }
                    var isOptCorrect = !isPoll && opts[o].correct;
                    var oColor = isPoll ? (isSelected ? '#7C3AED' : '#475569') : (isOptCorrect ? '#166534' : (isSelected ? '#991B1B' : '#475569'));
                    var oBg = isPoll ? (isSelected ? '#F5F3FF' : '#FFFFFF') : (isOptCorrect ? '#DCFCE7' : (isSelected ? '#FEE2E2' : '#FFFFFF'));
                    var oBorder = isPoll ? (isSelected ? '#C084FC' : '#CBD5E1') : (isOptCorrect ? '#86EFAC' : (isSelected ? '#FECACA' : '#CBD5E1'));
                    var oIcon = isPoll ? (isSelected ? '<i class="fas fa-check"></i>' : '') : (isOptCorrect ? '<i class="fas fa-check"></i>' : (isSelected ? '<i class="fas fa-times"></i>' : ''));
                    var oWeight = (isOptCorrect || isSelected) ? '800' : '600';
                    
                    html += '<div style="padding:10px 16px;background:'+oBg+';border:2px solid '+oBorder+';border-radius:12px;font-size:0.95rem;font-weight:'+oWeight+';color:'+oColor+';display:flex;justify-content:space-between;align-items:center;">';
                    html += '<span>' + (opts[o].text||'') + '</span>';
                    html += '<span style="font-size:1.1rem;">' + oIcon + '</span>';
                    html += '</div>';
                }
                html += '</div>';
            } else if (q.tipo === 'dnd') {
                var imgUrl = (q.opciones && q.opciones[0]) ? q.opciones[0].pregunta_imagen : '';
                html += '<div style="margin-top:16px; display:flex; flex-direction:column; gap:12px; align-items:center;">';
                html += '  <img src="' + imgUrl + '" style="max-width:100%; max-height:220px; border-radius:8px; border:2px solid #E2E8F0;">';
                html += '  <div style="display:flex; flex-direction:column; gap:6px; width:100%;">';
                var studentMatches = {};
                try {
                    studentMatches = JSON.parse(a.seleccionada);
                } catch(e) {
                    studentMatches = {};
                }
                var opts = q.opciones || [];
                for(var o=0; o<opts.length; o++) {
                    var matchIdx = studentMatches[o];
                    var isCorrectMatch = (matchIdx === o);
                    var matchedText = (matchIdx !== undefined && opts[matchIdx]) ? opts[matchIdx].text : 'Sin responder';
                    var matchColor = isCorrectMatch ? '#166534' : '#991B1B';
                    var matchBg = isCorrectMatch ? '#DCFCE7' : '#FEE2E2';
                    var matchBorder = isCorrectMatch ? '#86EFAC' : '#FECACA';
                    var matchIcon = isCorrectMatch ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
                    html += '<div style="padding:10px 16px;background:'+matchBg+';border:2px solid '+matchBorder+';border-radius:12px;font-size:0.95rem;font-weight:700;color:'+matchColor+';display:flex;justify-content:space-between;align-items:center;">';
                    html += '<span>Parte ' + String.fromCharCode(65+o) + ' (' + (opts[o].text||'') + '):</span>';
                    html += '<span>' + matchIcon + ' Tu respuesta: ' + matchedText + '</span>';
                    html += '</div>';
                }
                html += '  </div>';
                html += '</div>';
            } else {
                // ═══ Fallback inteligente: si tiene opciones con texto y la respuesta es un índice, renderizar como tarjetas ═══
                var fbOpts = q.opciones || [];
                var hasRealOpts = fbOpts.length > 0 && fbOpts.some(function(op){ return op && op.text && op.text.trim(); });
                var ansIsIndex = a && (typeof a.seleccionada === 'number');
                
                if (hasRealOpts && ansIsIndex) {
                    // Renderizar como opciones visuales (el tipo fue guardado mal o es fb con opciones)
                    html += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">';
                    for(var fo=0; fo<fbOpts.length; fo++) {
                        var foSelected = (a.seleccionada === fo);
                        var foCorrect = fbOpts[fo].correct;
                        var foColor = foCorrect ? '#166534' : (foSelected ? '#991B1B' : '#475569');
                        var foBg = foCorrect ? '#DCFCE7' : (foSelected ? '#FEE2E2' : '#FFFFFF');
                        var foBorder = foCorrect ? '#86EFAC' : (foSelected ? '#FECACA' : '#CBD5E1');
                        var foIcon = foCorrect ? '<i class="fas fa-check"></i>' : (foSelected ? '<i class="fas fa-times"></i>' : '');
                        var foWeight = (foCorrect || foSelected) ? '800' : '600';
                        html += '<div style="padding:10px 16px;background:'+foBg+';border:2px solid '+foBorder+';border-radius:12px;font-size:0.95rem;font-weight:'+foWeight+';color:'+foColor+';display:flex;justify-content:space-between;align-items:center;">';
                        html += '<span>' + (fbOpts[fo].text||'') + '</span>';
                        html += '<span style="font-size:1.1rem;">' + foIcon + '</span>';
                        html += '</div>';
                    }
                    html += '</div>';
                } else {
                    // Pregunta de texto (fb puro u otro tipo sin opciones visuales)
                    // SMART FALLBACK: Translate numeric index to option text if opciones exist
                    html += '<div style="margin-top:16px;padding:12px;background:#FFF;border:2px solid #E2E8F0;border-radius:12px;">';
                    html += '<div style="font-size:0.85rem;color:#64748B;font-weight:800;margin-bottom:6px;">Respuesta del estudiante:</div>';
                    var fallbackStudentAns = 'Sin responder';
                    if (a) {
                        var sel = a.seleccionada;
                        var fbOpciones = q.opciones || [];
                        var selIdx = (typeof sel === 'number') ? sel : (typeof sel === 'string' && !isNaN(sel) ? parseInt(sel) : -1);
                        if (selIdx >= 0 && fbOpciones[selIdx] && fbOpciones[selIdx].text) {
                            fallbackStudentAns = fbOpciones[selIdx].text;
                        } else if (sel !== null && sel !== undefined) {
                            fallbackStudentAns = String(sel);
                        }
                    }
                    html += '<div style="font-weight:700;color:#0F172A;font-size:1rem;">' + fallbackStudentAns + '</div>';
                    var respCorrecta = '';
                    if (q.tipo === 'fb') {
                        respCorrecta = (q.opciones && q.opciones.length > 0 && q.opciones[0].text) ? q.opciones[0].text : 'Sin patrón';
                    } else {
                        // First try to find correct option in opciones array
                        if (q.opciones && q.opciones.length > 0) {
                            var correctOpt = null;
                            for (var ci = 0; ci < q.opciones.length; ci++) {
                                if (q.opciones[ci] && q.opciones[ci].correct) { correctOpt = q.opciones[ci]; break; }
                            }
                            if (correctOpt && correctOpt.text) { respCorrecta = correctOpt.text; }
                        }
                        if (!respCorrecta) { respCorrecta = q.respuesta_correcta || ''; }
                    }
                    if (respCorrecta) {
                        html += '<div style="font-size:0.85rem;color:#10B981;font-weight:800;margin-top:12px;margin-bottom:6px;">Respuesta correcta esperada:</div>';
                        html += '<div style="font-weight:700;color:#047857;font-size:1rem;">' + respCorrecta + '</div>';
                    }
                    html += '</div>';
                }
            }
            html += '</div>';
        }
        bodyContainer.innerHTML = html;
    });
};

function loadReports() {
    var container = document.getElementById('reports-list');
    if (!container || !currentUser) return;
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:24px"></i><p style="margin-top:12px;font-weight:600;">Cargando informes...</p></div>';

    var client = getSupabase();
    client.from('evaluaciones').select('id, titulo, codigo').eq('publicado', true).then(function(evRes) {
        if (evRes.error || !evRes.data || evRes.data.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>No hay informes disponibles</p><small>Publica evaluaciones para ver los resultados</small></div>';
            return;
        }
        var evalIds = evRes.data.map(function(e) { return e.id; });
        
        Promise.all([
            client.from('evaluacion_resultados').select('*').in('evaluacion_id', evalIds),
            client.from('evaluacion_participantes').select('evaluacion_id, user_id, nombre').in('evaluacion_id', evalIds)
        ]).then(function(responses) {
            var rRes = responses[0];
            var pRes = responses[1];
            
            if (rRes.error || !rRes.data || rRes.data.length === 0) {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>Aún no hay resultados</p><small>Los resultados aparecerán cuando los estudiantes completen evaluaciones</small></div>';
                return;
            }
            
            window.adminReportsNameMap = {};
            window.adminStudentNames = {};
            if (!pRes.error && pRes.data) {
                for (var n = 0; n < pRes.data.length; n++) {
                    var p = pRes.data[n];
                    if (p.evaluacion_id && p.user_id) {
                        var nm = p.nombre;
                        if(nm && nm.indexOf('|') !== -1) nm = nm.split('|')[1];
                        window.adminReportsNameMap[p.evaluacion_id + '_' + p.user_id] = nm;
                        window.adminStudentNames[p.user_id] = nm;
                    }
                }
            }
            
            window.adminReportsData = {};
            var globalStats = {};
            for (var i = 0; i < rRes.data.length; i++) {
                var res = rRes.data[i];
                if (!window.adminReportsData[res.evaluacion_id]) window.adminReportsData[res.evaluacion_id] = [];
                window.adminReportsData[res.evaluacion_id].push(res);
                
                if (res.user_id) {
                    if (!globalStats[res.user_id]) {
                        globalStats[res.user_id] = { id: res.user_id, pts: 0, count: 0, pctSum: 0 };
                    }
                    globalStats[res.user_id].pts += (res.puntaje || 0);
                    globalStats[res.user_id].count++;
                    globalStats[res.user_id].pctSum += (res.porcentaje || 0);
                }
            }
            
            var globalArr = [];
            for (var uid in globalStats) {
                var st = globalStats[uid];
                st.name = window.adminStudentNames[uid] || (uid.substring(0,8) + '...');
                st.avgPct = Math.round(st.pctSum / st.count);
                globalArr.push(st);
            }
            globalArr.sort(function(a, b) {
                if (b.pts !== a.pts) return b.pts - a.pts;
                return b.avgPct - a.avgPct;
            });
            
            var html = '';
            
            if (globalArr.length > 0) {
                html += '<div style="background:linear-gradient(145deg, #1E293B, #020617); border-radius:16px; padding:24px; margin-bottom:32px; box-shadow:0 12px 30px rgba(0,0,0,0.15); color:#fff; position:relative; overflow:hidden;">';
                html += '<div style="position:absolute; top:-30px; right:-20px; opacity:0.05; font-size:140px; transform:rotate(-15deg); pointer-events:none;"><i class="fas fa-trophy"></i></div>';
                html += '<h2 style="font-size:22px; font-weight:900; margin-bottom:4px; display:flex; align-items:center; gap:10px;"><i class="fas fa-crown" style="color:#FBBF24; filter:drop-shadow(0 2px 4px rgba(251,191,36,0.3));"></i> Ranking Histórico Top 10</h2>';
                html += '<p style="font-size:13px; color:#94A3B8; margin-bottom:24px; font-weight:600;">Acumulado de puntos de todas tus evaluaciones</p>';
                
                html += '<div style="display:flex; flex-direction:column; gap:10px; position:relative; z-index:2;">';
                for (var g = 0; g < Math.min(globalArr.length, 10); g++) {
                    var st = globalArr[g];
                    var rankIcon = (g + 1);
                    var bg = 'rgba(30, 41, 59, 0.6)';
                    var border = '1px solid rgba(255,255,255,0.05)';
                    var rCol = '#94A3B8';
                    if (g === 0) { rankIcon = '🥇'; bg = 'linear-gradient(90deg, rgba(251, 191, 36, 0.15), rgba(30, 41, 59, 0.6))'; border = '1px solid rgba(251, 191, 36, 0.3)'; rCol = '#FBBF24'; }
                    else if (g === 1) { rankIcon = '🥈'; bg = 'linear-gradient(90deg, rgba(148, 163, 184, 0.15), rgba(30, 41, 59, 0.6))'; border = '1px solid rgba(148, 163, 184, 0.3)'; rCol = '#E2E8F0'; }
                    else if (g === 2) { rankIcon = '🥉'; bg = 'linear-gradient(90deg, rgba(217, 119, 6, 0.15), rgba(30, 41, 59, 0.6))'; border = '1px solid rgba(217, 119, 6, 0.3)'; rCol = '#D97706'; }
                    
                    var pColor = st.avgPct >= 70 ? '#4ADE80' : st.avgPct >= 40 ? '#FBBF24' : '#F87171';

                    html += '<div style="display:flex; align-items:center; padding:12px 16px; background:' + bg + '; border:' + border + '; border-radius:12px; transition:transform 0.2s;">';
                    html += '<div style="width:36px; font-weight:900; font-size:18px; color:' + rCol + '; text-align:center;">' + rankIcon + '</div>';
                    html += '<div style="flex:1; padding-left:12px;">';
                    html += '<div style="font-weight:800; font-size:15px; color:#F8FAFC;">' + st.name + '</div>';
                    html += '<div style="font-size:11px; color:#94A3B8; font-weight:600; margin-top:2px;">' + st.count + ' evaluación(es) completada(s)</div>';
                    html += '</div>';
                    
                    html += '<div style="text-align:right; padding-right:16px;">';
                    html += '<div style="font-weight:900; font-size:18px; color:#38BDF8;">' + (st.pts || 0).toLocaleString() + ' <span style="font-size:11px; color:#7DD3FC; font-weight:700;">pts</span></div>';
                    html += '</div>';
                    
                    html += '<div style="text-align:right;">';
                    html += '<div style="display:inline-block; padding:4px 8px; border-radius:8px; background:' + pColor + '20; color:' + pColor + '; font-weight:800; font-size:13px;">' + st.avgPct + '%</div>';
                    html += '</div>';
                    
                    html += '</div>';
                }
                html += '</div></div>';
                
                html += '<h2 style="font-size:18px; font-weight:800; margin-bottom:16px; color:#1E293B;"><i class="fas fa-layer-group" style="margin-right:8px; color:#64748B;"></i> Reportes por Evaluación</h2>';
            }
            for (var j = 0; j < evRes.data.length; j++) {
                var ev = evRes.data[j];
                var results = window.adminReportsData[ev.id] || [];
                if (results.length === 0) continue;
                
                results.sort(function(a, b) {
                    if (b.porcentaje !== a.porcentaje) return b.porcentaje - a.porcentaje;
                    return b.puntaje - a.puntaje;
                });
                
                var avgPct = 0;
                for (var k = 0; k < results.length; k++) avgPct += (results[k].porcentaje || 0);
                avgPct = Math.round(avgPct / results.length);
                var barColor = avgPct >= 70 ? '#22C55E' : avgPct >= 40 ? '#F59E0B' : '#EF4444';

                html += '<div style="background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:24px;margin-bottom:20px;box-shadow:0 4px 12px rgba(0,0,0,0.02)">';
                html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">';
                html += '<div><h3 style="font-size:18px;font-weight:800;color:#1E293B;margin-bottom:4px;">' + (ev.titulo || 'Sin título') + '</h3>';
                html += '<span style="font-size:13px;color:#64748B;font-weight:600;"><i class="fas fa-users" style="margin-right:4px;"></i>' + results.length + ' participante(s) • <i class="fas fa-key" style="margin-right:4px;margin-left:8px;"></i>' + (ev.codigo || '-') + '</span></div>';
                html += '<div style="text-align:right"><span style="font-size:28px;font-weight:900;color:' + barColor + '">' + avgPct + '%</span><br><span style="font-size:11px;color:#94A3B8;font-weight:700;text-transform:uppercase;">Promedio</span></div></div>';
                
                html += '<div style="background:#F1F5F9;border-radius:20px;height:10px;margin-bottom:20px;overflow:hidden"><div style="height:100%;width:' + avgPct + '%;background:' + barColor + ';border-radius:20px"></div></div>';
                
                html += '<table style="width:100%;border-collapse:collapse;font-size:14px">';
                html += '<tr style="border-bottom:2px solid #E2E8F0;background:#F8FAFC"><th style="padding:12px;color:#64748B;font-weight:800;width:40px;text-align:center;border-top-left-radius:12px;">#</th><th style="text-align:left;padding:12px;color:#64748B;font-weight:800">Estudiante</th><th style="padding:12px;color:#64748B;font-weight:800;text-align:center">Puntos</th><th style="padding:12px;color:#64748B;font-weight:800;text-align:center;border-top-right-radius:12px;">Precisión</th></tr>';
                
                for (var m = 0; m < results.length; m++) {
                    var r = results[m];
                    var pColor = r.porcentaje >= 70 ? '#22C55E' : r.porcentaje >= 40 ? '#F59E0B' : '#EF4444';
                    var studentName = window.adminReportsNameMap[ev.id + '_' + r.user_id] || (r.user_id ? r.user_id.substring(0, 8) + '...' : 'Anónimo');
                    
                    var rankIcon = (m + 1);
                    var rankStyle = 'color:#64748B;font-weight:800;';
                    if (m === 0) { rankIcon = '🥇'; rankStyle = 'font-size:18px;'; }
                    else if (m === 1) { rankIcon = '🥈'; rankStyle = 'font-size:18px;'; }
                    else if (m === 2) { rankIcon = '🥉'; rankStyle = 'font-size:18px;'; }
                    
                    html += '<tr onclick="openReportDetail(\'' + ev.id + '\', \'' + r.user_id + '\')" style="cursor:pointer;border-bottom:1px solid #F1F5F9;transition:background .2s" onmouseover="this.style.background=\'#F8FAFC\'" onmouseout="this.style.background=\'transparent\'">';
                    html += '<td style="padding:14px 12px;text-align:center;' + rankStyle + '">' + rankIcon + '</td>';
                    html += '<td style="padding:14px 12px;font-weight:700;color:#334155"><i class="fas fa-user-circle" style="color:#CBD5E1;margin-right:8px;font-size:18px;vertical-align:-2px;"></i>' + studentName + '</td>';
                    html += '<td style="padding:14px 12px;text-align:center;font-weight:800;color:#475569">' + (r.puntaje || 0).toLocaleString() + ' <span style="color:#94A3B8;font-size:12px;font-weight:600;">pts</span></td>';
                    html += '<td style="padding:14px 12px;text-align:center;font-weight:900;color:' + pColor + '"><div style="display:inline-block;padding:4px 10px;border-radius:12px;background:' + pColor + '15">' + r.porcentaje + '%</div></td>';
                    html += '</tr>';
                }
                html += '</table></div>';
            }
            container.innerHTML = html || '<div class="empty-state"><i class="fas fa-chart-line"></i><p>No hay resultados aún</p></div>';
        }).catch(function(err) {
            console.error(err);
            container.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Error al cargar informes</p></div>';
        });
    });
}

// ═══ STUDENT: MIS RESULTADOS ═══

function loadStudentResults() {
    var container = document.getElementById('results-list');
    if (!container || !currentUser) return;
    container.innerHTML = '<div style="text-align:center;padding:40px;color:#8E90A6"><i class="fas fa-spinner fa-spin" style="font-size:24px"></i></div>';

    var client = getSupabase();
    
    // Consultar únicamente las evaluaciones en vivo jugadas en esta sección
    client.from('evaluacion_resultados')
        .select('*')
        .eq('user_id', currentUser.id)
        .then(function(res) {
            if (res.error) {
                console.error('Error fetching student results:', res.error);
                container.innerHTML = '<div style="padding:20px;text-align:center;color:#EF4444;"><i class="fas fa-exclamation-triangle" style="font-size:24px;margin-bottom:8px"></i><br>Error al cargar resultados de Supabase.</div>';
                return;
            }

            var evResData = res.data || [];
            if (evResData.length === 0) {
                container.innerHTML = '<div class="empty-state"><i class="fas fa-chart-pie"></i><p>No tienes resultados todavía</p><small>Completa evaluaciones para ver tu progreso aquí.</small></div>';
                return;
            }

            var allResults = [];
            for (var i = 0; i < evResData.length; i++) {
                var r = evResData[i];
                allResults.push({
                    type: 'evaluacion',
                    id: r.id,
                    evaluacion_id: r.evaluacion_id,
                    titulo: 'Evaluación en Vivo',
                    materia: 'General',
                    porcentaje: r.porcentaje || 0,
                    correctas: 0, 
                    total: r.total || 0,
                    puntaje: r.puntaje || 0,
                    fecha: r.created_at || new Date().toISOString(),
                    original: r
                });
            }

            // Obtener ids de evaluaciones para consultar sus metadatos
            var evalIds = allResults.map(function(x) { return x.evaluacion_id; }).filter(Boolean);

            var evalPromise = Promise.resolve({ data: [] });
            if (evalIds.length > 0) {
                evalPromise = client.from('evaluaciones').select('id, titulo, asignatura').in('id', evalIds);
            }

            evalPromise.then(function(evQueryRes) {
                var evalMap = {};
                if (evQueryRes.data) {
                    for (var j = 0; j < evQueryRes.data.length; j++) {
                        evalMap[evQueryRes.data[j].id] = evQueryRes.data[j];
                    }
                }

                try {
                    // Ordenar por fecha de forma decreciente
                    allResults.sort(function(a, b) { return new Date(b.fecha) - new Date(a.fecha); });

                    var html = '';
                    window.adminReportsData = {};
                    window.adminReportsNameMap = {};

                    for (var i = 0; i < allResults.length; i++) {
                        var item = allResults[i];
                        var evalId = item.evaluacion_id || 'unknown';
                        var userId = currentUser.id || 'unknown';

                        if (!window.adminReportsData[evalId]) window.adminReportsData[evalId] = [];
                        window.adminReportsData[evalId].push(item.original);
                        window.adminReportsNameMap[evalId + '_' + userId] = 'Tu resultado';

                        var evObj = evalMap[evalId] || {};
                        item.titulo = evObj.titulo || 'Evaluación en Vivo';
                        item.materia = evObj.asignatura || 'General';

                        var pct = item.porcentaje || 0;
                        var barColor = pct >= 70 ? '#22C55E' : pct >= 40 ? '#F59E0B' : '#EF4444';
                        var emoji = pct >= 90 ? '🏆' : pct >= 70 ? '⭐' : pct >= 40 ? '📝' : '💪';

                        var fechaStr = '';
                        try {
                            fechaStr = item.fecha ? new Date(item.fecha).toLocaleDateString('es-ES', {day:'numeric',month:'short'}) : '';
                        } catch(e) { fechaStr = ''; }

                        var hits = item.correctas;
                        var res = item.original;
                        var studentAns = res.respuestas || [];
                        if (studentAns && studentAns.length > 0) {
                            for (var sa = 0; sa < studentAns.length; sa++) {
                                if (studentAns[sa] && studentAns[sa].correcta) hits++;
                            }
                        } else {
                            hits = Math.round((pct / 100) * item.total);
                        }

                        var clickHandler = 'onclick="openReportDetail(\'' + item.evaluacion_id + '\', \'' + currentUser.id + '\')"';
                        var hoverCursor = 'cursor:pointer;';
                        var typeTag = '<span style="font-size:10px;background:#EEF2F6;color:#475569;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:6px;">LIVECARD</span>';

                        html += '<div ' + clickHandler + ' style="' + hoverCursor + 'background:#fff;border:1px solid #E2E8F0;border-radius:14px;padding:16px 20px;margin-bottom:12px;display:flex;align-items:center;gap:16px;transition:all .2s;box-shadow:0 2px 8px rgba(0,0,0,0.02)"' + 
                            ' onmouseover="this.style.boxShadow=\'0 6px 20px rgba(0,0,0,0.08)\'; this.style.transform=\'translateY(-2px)\'"' +
                            ' onmouseout="this.style.boxShadow=\'0 2px 8px rgba(0,0,0,0.02)\'; this.style.transform=\'translateY(0)\'"' + '>';
                        html += '<div style="font-size:32px">' + emoji + '</div>';
                        html += '<div style="flex:1"><h4 style="font-size:15px;font-weight:800;color:#1E293B;margin-bottom:4px;display:flex;align-items:center;flex-wrap:wrap;gap:4px;">' + item.titulo + typeTag + '</h4>';
                        html += '<span style="font-size:12px;color:#64748B;font-weight:600;"><i class="fas fa-book" style="margin-right:4px;"></i>' + item.materia + (fechaStr ? ' • ' + fechaStr : '') + '</span></div>';
                        html += '<div style="text-align:right"><span style="font-size:22px;font-weight:900;color:' + barColor + '">' + pct + '%</span>';
                        html += '<div style="font-size:11px;color:#94A3B8;font-weight:700;margin-top:2px;">' + hits + ' / ' + item.total + ' correctas <span style="font-weight:500;opacity:0.85;">(' + item.puntaje + ' pts)</span></div></div></div>';
                    }
                    container.innerHTML = html;
                } catch(ex) {
                    console.error(ex);
                    container.innerHTML = '<div style="padding:20px;text-align:center;color:#EF4444;"><i class="fas fa-exclamation-triangle" style="font-size:24px;margin-bottom:8px"></i><br>Error al procesar los resultados históricos.</div>';
                }
            });
        }).catch(function(err) {
            console.error('Error fetching student results:', err);
            container.innerHTML = '<div style="padding:20px;text-align:center;color:#EF4444;"><i class="fas fa-wifi" style="font-size:24px;margin-bottom:8px"></i><br>Error de conexión. Inténtalo de nuevo.</div>';
        });
}

// ═══ LOGOUT ═══

function handleLogout() {
    var client = getSupabase();
    if (client) {
        client.auth.signOut().then(function() {
            currentUser = null;
            isAdmin = false;
            showLogin();
        }).catch(function(e) {
            console.error('Logout error:', e);
            currentUser = null;
            isAdmin = false;
            showLogin();
        });
    } else {
        showLogin();
    }
}

// ═══ HELPERS ═══

function getGreeting() {
    var h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
}

// ═══ INIT ═══

document.addEventListener('DOMContentLoaded', function() {
    // Auth
    initAuth();

    // Hamburger
    var hamburgerBtn = document.getElementById('hamburger-btn');
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openSidebar);
    var overlayEl = document.getElementById('sidebar-overlay');
    if (overlayEl) overlayEl.addEventListener('click', closeSidebar);
    var closeBtn = document.getElementById('sidebar-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

    // Sidebar nav
    var navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    for (var i = 0; i < navItems.length; i++) {
        (function(item) {
            if (item.dataset.page) {
                item.addEventListener('click', function() { navigateTo(item.dataset.page); });
            }
        })(navItems[i]);
    }

    // Bottom nav
    var bnavItems = document.querySelectorAll('.bnav-item');
    for (var j = 0; j < bnavItems.length; j++) {
        (function(btn) {
            if (btn.dataset.page) {
                btn.addEventListener('click', function() { navigateTo(btn.dataset.page); });
            }
        })(bnavItems[j]);
    }

    initUserMenu();
    initAvatarRenderObserver();
});

/** Menú desplegable del usuario (cerrar sesión) */
function initUserMenu() {
    var wrap = document.getElementById('user-menu-wrap');
    var btn = document.getElementById('user-menu-btn');
    var menu = document.getElementById('user-menu-dropdown');
    var avatarItem = document.getElementById('user-menu-avatar');
    var logoutItem = document.getElementById('user-menu-logout');
    if (!wrap || !btn || !menu) return;

    function setOpen(open) {
        if (open) {
            menu.classList.remove('hidden');
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        } else {
            menu.classList.add('hidden');
            wrap.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        }
    }

    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var opening = menu.classList.contains('hidden');
        setOpen(opening);
    });

    document.addEventListener('click', function() {
        setOpen(false);
    });
    menu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') setOpen(false);
    });


    if (avatarItem) {
        avatarItem.addEventListener('click', function() {
            setOpen(false);
            openAvatarModal();
        });
    }

    if (logoutItem) {
        logoutItem.addEventListener('click', function() {
            setOpen(false);
            handleLogout();
        });
    }
}

// ═══ PWA INSTALLATION ═══
var deferredPrompt;
function isIosDevice() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent || '') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function showInstallHelp(platform) {
    var iosMsg = 'En iPhone: abre esta pagina en Safari, toca Compartir y elige "Agregar a pantalla de inicio".';
    var androidMsg = 'En Android: abre esta pagina en Chrome y toca Instalar app o Agregar a pantalla principal.';
    var msg = (platform === 'ios' || isIosDevice()) ? iosMsg : androidMsg;
    if (typeof showCustomAlert === 'function') showCustomAlert(msg);
    else alert(msg);
}

function handlePwaInstallClick(platform) {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuario acepto la instalacion de la PWA');
            } else {
                console.log('Usuario descarto la instalacion de la PWA');
            }
            deferredPrompt = null;
        });
        return;
    }
    showInstallHelp(platform);
}
window.handlePwaInstallClick = handlePwaInstallClick;
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;
    var installBtn = document.getElementById('install-pwa-btn');
    if (installBtn) {
        installBtn.style.display = 'flex';
    }
});

// ═══ DARK MODE TOGGLE ═══
document.addEventListener('DOMContentLoaded', function() {
    var installTargets = document.querySelectorAll('.install-pwa-trigger, #install-pwa-btn');
    for (var i = 0; i < installTargets.length; i++) {
        (function(btn) {
            btn.addEventListener('click', function() {
                handlePwaInstallClick(btn.getAttribute('data-platform') || 'android');
            });
        })(installTargets[i]);
    }
});

function initTheme() {
    var theme = localStorage.getItem('alcocermed_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
    
    var themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('alcocermed_theme', next);
            updateThemeIcon(next);
        });
    }
}
function updateThemeIcon(theme) {
    var icon = document.querySelector('#theme-toggle-btn i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}
document.addEventListener('DOMContentLoaded', initTheme);

// ═══ IDENTIFICAR PARTES (DND) STUDENT GAMEPLAY HELPERS ═══
var quizSelectedDndLabel = -1;
var quizSelectedDndSlot = -1;
var quizDndMatches = {};

function clickDndLabel(idx) {
    if (quizConfirmed) return;
    
    // Si ya había una ranura (círculo) seleccionada, vincularlos inmediatamente
    if (quizSelectedDndSlot !== -1) {
        var slotIdx = quizSelectedDndSlot;
        quizDndMatches[slotIdx] = idx;
        applyMatchVisual(slotIdx, idx);
        
        resetDndSelections();
        checkDndCompletion();
        return;
    }
    
    // De lo contrario, seleccionar esta etiqueta
    quizSelectedDndLabel = idx;
    quizSelectedDndSlot = -1; // Resetear cualquier selección de slot
    
    // Actualizar estilo visual de las etiquetas
    var buttons = document.querySelectorAll('.quiz-dnd-label-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.filter = 'brightness(1.0)';
        buttons[i].style.transform = 'scale(1.0)';
        buttons[i].style.border = 'none';
        buttons[i].style.boxShadow = 'inset 0 -4px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.2)';
    }
    
    // Resetear ranuras no asignadas de su estado "activo/amarillo"
    var slots = document.querySelectorAll('.quiz-dnd-slot');
    slots.forEach(function(s) {
        var sIdx = parseInt(s.getAttribute('data-idx'));
        if (quizDndMatches[sIdx] === undefined) {
            s.style.background = '#fff';
            s.style.color = '#334155';
            s.style.borderColor = '#E2E8F0';
            s.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    });
    
    var activeBtn = document.getElementById('dnd-label-' + idx);
    if(activeBtn) {
        activeBtn.style.filter = 'brightness(1.2) saturate(1.2)';
        activeBtn.style.transform = 'scale(1.08)';
        activeBtn.style.border = '3px solid #fff';
        activeBtn.style.boxShadow = '0 0 12px rgba(255,255,255,0.6)';
    }
}

function clickDndSlot(slotIdx) {
    if (quizConfirmed) return;
    
    // Si ya había una etiqueta seleccionada, vincularlos inmediatamente
    if (quizSelectedDndLabel !== -1) {
        var labelIdx = quizSelectedDndLabel;
        quizDndMatches[slotIdx] = labelIdx;
        applyMatchVisual(slotIdx, labelIdx);
        
        resetDndSelections();
        checkDndCompletion();
        return;
    }
    
    // De lo contrario, seleccionar esta ranura (círculo)
    quizSelectedDndSlot = slotIdx;
    quizSelectedDndLabel = -1; // Resetear cualquier selección de etiqueta
    
    // Limpiar estilos visuales de etiquetas activas
    var buttons = document.querySelectorAll('.quiz-dnd-label-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.filter = 'brightness(1.0)';
        buttons[i].style.transform = 'scale(1.0)';
        buttons[i].style.border = 'none';
        buttons[i].style.boxShadow = 'inset 0 -4px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.2)';
    }
    
    // Resaltar la ranura seleccionada
    var slots = document.querySelectorAll('.quiz-dnd-slot');
    slots.forEach(function(s) {
        var sIdx = parseInt(s.getAttribute('data-idx'));
        if (sIdx === slotIdx) {
            s.style.background = '#F59E0B'; // Color ámbar premium para estado seleccionado
            s.style.borderColor = '#fff';
            s.style.color = '#fff';
            s.style.transform = 'translate(-50%, -50%) scale(1.25)';
            s.style.boxShadow = '0 0 15px #F59E0B';
        } else if (quizDndMatches[sIdx] === undefined) {
            // Círculos no asignados vuelven al estado por defecto
            s.style.background = '#fff';
            s.style.color = '#334155';
            s.style.borderColor = '#E2E8F0';
            s.style.transform = 'translate(-50%, -50%) scale(1)';
            s.style.boxShadow = '0 6px 16px rgba(0,0,0,0.35)';
        }
    });
    
    playBeep(500, 'sine', 0.08);
}

function applyMatchVisual(slotIdx, labelIdx) {
    var slotEl = document.getElementById('dnd-slot-' + slotIdx);
    if(slotEl) {
        var optColors = ['#E91E63', '#2563EB', '#E6A15C', '#059669', '#7C3AED', '#0D9488'];
        var color = optColors[labelIdx % optColors.length];
        
        slotEl.style.background = color;
        slotEl.style.borderColor = '#fff';
        slotEl.style.color = '#fff';
        slotEl.textContent = String.fromCharCode(65 + labelIdx);
        slotEl.style.transform = 'translate(-50%, -50%) scale(1.15)';
        slotEl.style.boxShadow = '0 4px 12px ' + color;
        setTimeout(function(){ slotEl.style.transform = 'translate(-50%, -50%) scale(1)'; }, 150);
    }
    playBeep(600, 'sine', 0.1);
}

function resetDndSelections() {
    quizSelectedDndLabel = -1;
    quizSelectedDndSlot = -1;
    
    var buttons = document.querySelectorAll('.quiz-dnd-label-btn');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.filter = 'brightness(1.0)';
        buttons[i].style.transform = 'scale(1.0)';
        buttons[i].style.border = 'none';
        buttons[i].style.boxShadow = 'inset 0 -4px 0 rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.2)';
    }
}

function checkDndCompletion() {
    var pregunta = quizData.preguntas[quizCurrentQ];
    var slotsCount = 0;
    pregunta.opciones.forEach(function(o){
        if(o.pinX !== undefined && o.pinY !== undefined) slotsCount++;
    });
    
    var filledCount = 0;
    for(var sIdx = 0; sIdx < pregunta.opciones.length; sIdx++){
        if(quizDndMatches[sIdx] !== undefined) filledCount++;
    }
    
    var submitBtn = document.getElementById('quiz-confirm-dnd');
    if(submitBtn) {
        if(filledCount === slotsCount) {
            submitBtn.disabled = false;
            submitBtn.style.background = '#22C55E';
            submitBtn.style.boxShadow = '0 6px 0 #16A34A';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.disabled = true;
            submitBtn.style.background = '#94A3B8';
            submitBtn.style.boxShadow = '0 6px 0 #64748B';
            submitBtn.style.cursor = 'not-allowed';
        }
    }
}

function confirmQuizDnd() {
    if(quizConfirmed) return;
    quizConfirmed = true;
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    
    var pregunta = quizData.preguntas[quizCurrentQ];
    var opciones = pregunta.opciones || [];
    var allCorrect = true;
    
    for (var i = 0; i < opciones.length; i++) {
        var slotEl = document.getElementById('dnd-slot-' + i);
        if(!slotEl) continue;
        
        var isCorrect = (quizDndMatches[i] === i);
        if(!isCorrect) allCorrect = false;
        
        if (isCorrect) {
            slotEl.style.background = '#22C55E';
            slotEl.style.borderColor = '#fff';
            slotEl.innerHTML = '<i class="fas fa-check" style="font-size:0.8rem;"></i>';
        } else {
            slotEl.style.background = '#EF4444';
            slotEl.style.borderColor = '#fff';
            slotEl.innerHTML = '<i class="fas fa-times" style="font-size:0.8rem;"></i>';
            
            var correctLetter = String.fromCharCode(65 + i);
            var helper = document.createElement('div');
            helper.style.position = 'absolute';
            helper.style.left = '50%';
            helper.style.top = '-20px';
            helper.style.transform = 'translateX(-50%)';
            helper.style.background = '#22C55E';
            helper.style.color = '#fff';
            helper.style.fontSize = '0.7rem';
            helper.style.fontWeight = '900';
            helper.style.padding = '2px 6px';
            helper.style.borderRadius = '4px';
            helper.style.whiteSpace = 'nowrap';
            helper.textContent = 'Es: ' + correctLetter;
            slotEl.appendChild(helper);
        }
    }
    
    var labelBtns = document.querySelectorAll('.quiz-dnd-label-btn');
    labelBtns.forEach(function(b){
        b.style.opacity = '0.4';
        b.style.pointerEvents = 'none';
    });
    
    var submitBtn = document.getElementById('quiz-confirm-dnd');
    if(submitBtn) {
        submitBtn.style.display = 'none';
    }
    
    var pts = getQuizPoints(allCorrect, pregunta);
    quizAnswers.push({ pregunta_id: pregunta.id, seleccionada: JSON.stringify(quizDndMatches), correcta: allCorrect, puntos_ganados: pts });
    
    var timerBar = document.getElementById('quiz-timer-bar');
    if(timerBar) {
        var computedWidth = window.getComputedStyle(timerBar).width;
        timerBar.style.transition = 'none';
        timerBar.style.width = computedWidth;
    }

    showFeedbackAnimation(allCorrect, pts);
}

window.clickDndLabel = clickDndLabel;
window.clickDndSlot = clickDndSlot;
window.confirmQuizDnd = confirmQuizDnd;

// ═══ CONFETTI BURST ═══
function spawnConfetti() {
    var container = document.querySelector('.stadium-podium-container');
    if (!container) return;
    var canvas = document.getElementById('podium-confetti');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'podium-confetti';
        canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;border-radius:24px;width:100%;height:100%;';
        container.insertBefore(canvas, container.firstChild);
    }
    var W = container.offsetWidth || 600;
    var H = container.offsetHeight || 320;
    canvas.width = W; canvas.height = H;
    var ctx2 = canvas.getContext('2d');
    var COLORS = ['#FFD700','#E91E63','#00BCD4','#4CAF50','#FF5722','#9C27B0','#fff','#FF9800'];
    var particles = [];
    for (var i = 0; i < 110; i++) {
        particles.push({
            x: W*0.3 + Math.random()*W*0.4, y: H*0.4,
            vx: (Math.random()-0.5)*9, vy: -Math.random()*11 - 4,
            w: Math.random()*8+4, h: Math.random()*4+3,
            color: COLORS[Math.floor(Math.random()*COLORS.length)],
            rot: Math.random()*360, rv: (Math.random()-0.5)*12, alpha: 1
        });
    }
    var frame = 0;
    function tick() {
        ctx2.clearRect(0,0,W,H);
        var alive = false;
        for (var j = 0; j < particles.length; j++) {
            var p2 = particles[j];
            p2.x += p2.vx; p2.y += p2.vy;
            p2.vy += 0.35; p2.vx *= 0.99; p2.rot += p2.rv; p2.alpha -= 0.013;
            if (p2.alpha <= 0) continue;
            alive = true;
            ctx2.save(); ctx2.globalAlpha = p2.alpha;
            ctx2.translate(p2.x, p2.y); ctx2.rotate(p2.rot * Math.PI/180);
            ctx2.fillStyle = p2.color;
            ctx2.fillRect(-p2.w/2, -p2.h/2, p2.w, p2.h);
            ctx2.restore();
        }
        frame++;
        if (alive && frame < 220) requestAnimationFrame(tick);
        else ctx2.clearRect(0,0,W,H);
    }
    tick();
}
