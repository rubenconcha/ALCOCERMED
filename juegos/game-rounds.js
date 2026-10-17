// Presentation and deterministic practice rounds. Original evaluation IDs stay intact.
(function (root) {
    'use strict';
    function cleanTitle(value) {
        return String(value || '').replace(/\(\s*\d+\s+preguntas?(?:\s+f[aá]ciles?)?\s*\)/gi, '')
            .replace(/\s*[·•]\s*\d+\s+preguntas?(?:\s+f[aá]ciles?)?/gi, '').replace(/\s{2,}/g, ' ').trim();
    }
    function existingRound(ev) {
        var match = /\bRonda\s+(\d+)\b/i.exec(ev && ev.titulo || '');
        return match ? Number(match[1]) : 0;
    }
    function roundNumber(value) { return Number(value) === 1 || Number(value) === 2 ? Number(value) : 0; }
    function questions(ev, all, round) {
        round = roundNumber(round);
        if (!round) return all.slice();
        var config = ev && ev.config_juego || {};
        if (typeof config === 'string') { try { config = JSON.parse(config); } catch (_) { config = {}; } }
        var priority = new Map((config.questionOrder || []).map(function (id, i) { return [id, i]; }));
        var ordered = all.slice().sort(function (a, b) {
            var pa = priority.has(a.id) ? priority.get(a.id) : Infinity;
            var pb = priority.has(b.id) ? priority.get(b.id) : Infinity;
            if (pa !== pb) return pa - pb;
            return (Number(a.orden) || 0) - (Number(b.orden) || 0) || String(a.id).localeCompare(String(b.id));
        });
        // Alternate within each modality, balancing total size too. Both rounds
        // retain a mix of MC, multiple selection, true/false and image dragging.
        var groups = {}, halves = [[], []];
        ordered.forEach(function (q) { (groups[q.tipo || 'mc'] || (groups[q.tipo || 'mc'] = [])).push(q); });
        Object.keys(groups).forEach(function (type) {
            var first = halves[0].length <= halves[1].length ? 0 : 1;
            groups[type].forEach(function (q, i) { halves[(first + i) % 2].push(q); });
        });
        var selected = new Set(halves[round - 1].map(function (q) { return q.id; }));
        return ordered.filter(function (q) { return selected.has(q.id); });
    }
    function displayTitle(ev) {
        var title = cleanTitle(ev && ev.titulo || 'Sin título');
        return roundNumber(ev && ev._practiceRound) ? title + ' — Ronda ' + ev._practiceRound : title;
    }
    var api = { cleanTitle: cleanTitle, existingRound: existingRound, roundNumber: roundNumber, questions: questions, displayTitle: displayTitle };
    root.GameRounds = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
