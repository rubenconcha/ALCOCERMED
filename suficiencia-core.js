(function (root, factory) {
    const core = factory();
    if (typeof module === 'object' && module.exports) module.exports = core;
    else root.SufficiencyCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';
    const subjects = { matematicas: 'Matemáticas', fisica: 'Física', quimica: 'Química', lectura: 'Lectura comprensiva' };
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    function validSolution(q, bank) {
        const s = q.solution;
        if (!s || s.version !== 1 || s.level !== 'desde-cero' || s.answer !== q.options[q.correct]) return false;
        if (!['goal', 'basics', 'mistake', 'check'].every(k => typeof s[k] === 'string' && s[k].trim())) return false;
        if (!Array.isArray(s.steps) || s.steps.length < 4 || s.steps.length > 12) return false;
        return s.steps.every(row => {
            if (!row || !['title', 'text'].every(k => typeof row[k] === 'string' && row[k].trim())) return false;
            if (row.formula !== undefined && typeof row.formula !== 'string') return false;
            if (row.quote !== undefined) {
                const text = bank.passages.find(p => p.id === q.passageId)?.text;
                if (typeof row.quote !== 'string' || !row.quote.trim() || !Number.isInteger(row.paragraph) || row.paragraph < 1 || !text?.split('\n\n')[row.paragraph - 1]?.includes(row.quote)) return false;
            }
            return true;
        }) && (q.subject !== 'lectura' || s.steps.some(row => row.quote));
    }
    function solutionHtml(q) {
        const s = q.solution, esc = escapeHtml;
        if (!s) return `<section class="sf-worked-comment"><h3>Explicación</h3><p>${esc(q.explanation)}</p></section>`;
        return `<section class="sf-worked-comment sf-lesson" aria-label="Explicación paso a paso"><h3>Paso a paso</h3><p class="sf-lesson-goal">${esc(s.goal)}</p><div class="sf-basics"><h4>Antes de empezar</h4><p>${esc(s.basics)}</p></div><ol class="sf-steps">${s.steps.map(row => `<li><div><h4>${esc(row.title)}</h4><p>${esc(row.text)}</p>${row.formula ? `<div class="sf-formula">${esc(row.formula)}</div>` : ''}${row.quote ? `<blockquote>${esc(row.quote)}</blockquote><small class="sf-evidence-label">Párrafo ${esc(row.paragraph)} de la lectura</small>` : ''}</div></li>`).join('')}</ol><div class="sf-lesson-note"><h4>Ojo con esto</h4><p>${esc(s.mistake)}</p></div><div class="sf-lesson-check"><h4>Comprueba tu respuesta</h4><p>${esc(s.check)}</p></div></section>`;
    }
    function validate(bank) {
        if (!bank || !Array.isArray(bank.questions) || !Array.isArray(bank.passages)) return false;
        const ids = new Set(), passages = new Set(bank.passages.map(p => p.id));
        const validQuestions = bank.questions.length > 0 && bank.questions.every(q => {
            if (!q.id || ids.has(q.id)) return false;
            ids.add(q.id);
            return subjects[q.subject] && typeof q.text === 'string' && q.text.length > 0 &&
                Array.isArray(q.options) && [4, 5].includes(q.options.length) && q.options.every(o => typeof o === 'string' && o.trim()) &&
                new Set(q.options).size === q.options.length && Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.options.length &&
                typeof q.explanation === 'string' && q.explanation.length > 0 && q.source?.pdfPages?.length > 0 &&
                (q.subject !== 'lectura' || passages.has(q.passageId)) &&
                (!bank.teachingRevision || validSolution(q, bank));
        }) && Object.keys(subjects).every(s => bank.questions.some(q => q.subject === s)) &&
            bank.passages.every(p => typeof p.text === 'string' && p.text.length > 100 && p.source?.pdfPages?.length > 0);
        if (!validQuestions) return false;
        if (!bank.papers) return true;
        if (!Array.isArray(bank.papers) || !bank.papers.length) return false;
        const paperIds = new Set(), lookup = new Map(bank.questions.map(q => [q.id, q]));
        return bank.papers.every(p => {
            if (!p.id || paperIds.has(p.id) || !p.title || !['integral', ...Object.keys(subjects)].includes(p.subject)) return false;
            paperIds.add(p.id);
            if (!Array.isArray(p.questionIds) || p.questionIds.length !== p.questionCount || new Set(p.questionIds).size !== p.questionCount || !Number.isFinite(p.minutes) || p.minutes <= 0 || p.minutes > 180) return false;
            const rows = p.questionIds.map(id => lookup.get(id));
            if (rows.some(q => !q || (p.subject !== 'integral' && q.subject !== p.subject))) return false;
            if (p.subject === 'integral' && (p.questionCount !== 40 || Object.keys(subjects).some(s => rows.filter(q => q.subject === s).length !== 10))) return false;
            const reading = rows.filter(q => q.subject === 'lectura');
            return [...new Set(reading.map(q => q.passageId))].every(id => reading.filter(q => q.passageId === id).length === bank.questions.filter(q => q.passageId === id).length);
        });
    }
    function random(seed) {
        let n = Number(seed) >>> 0;
        return () => { n = (Math.imul(1664525, n) + 1013904223) >>> 0; return n / 4294967296; };
    }
    function shuffle(items, rng) {
        const out = items.slice();
        for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
        return out;
    }
    function select(bank, area, seed) {
        if (!validate(bank)) throw new Error('Banco incompleto');
        const rng = random(seed);
        if (area.startsWith('simulacro:')) {
            const selected = paper(bank, area);
            if (!selected) throw new Error('Simulacro no encontrado');
            const lookup = new Map(bank.questions.map(q => [q.id, q]));
            return selected.questionIds.map(id => lookup.get(id));
        }
        if (area === 'integral') {
            const questions = ['matematicas', 'fisica', 'quimica'].flatMap(s => shuffle(bank.questions.filter(q => q.subject === s), rng).slice(0, 10));
            const texts = shuffle(bank.passages, rng).slice(0, 2);
            return questions.concat(texts.flatMap(p => bank.questions.filter(q => q.passageId === p.id)));
        }
        if (area.startsWith('texto:')) return bank.questions.filter(q => q.passageId === area.slice(6));
        if (!subjects[area]) throw new Error('Materia desconocida');
        if (area === 'lectura') return shuffle(bank.passages, rng).flatMap(p => bank.questions.filter(q => q.passageId === p.id));
        return shuffle(bank.questions.filter(q => q.subject === area), rng);
    }
    function grade(questions, answers) {
        const result = { correct: 0, wrong: 0, skipped: 0, total: questions.length, subjects: {} };
        questions.forEach(q => {
            const row = result.subjects[q.subject] ||= { correct: 0, wrong: 0, skipped: 0, total: 0 };
            row.total++;
            const a = answers[q.id];
            const key = !Number.isInteger(a) || a < 0 || a >= q.options.length ? 'skipped' : a === q.correct ? 'correct' : 'wrong';
            result[key]++; row[key]++;
        });
        result.percent = result.total ? Math.round(result.correct / result.total * 100) : 0;
        return result;
    }
    function restore(saved, bank, owner) {
        if (!saved || saved.owner !== owner || saved.version !== bank.version || !Array.isArray(saved.ids) || !saved.ids.length || new Set(saved.ids).size !== saved.ids.length || !Number.isFinite(saved.deadline) || saved.deadline <= 0) return null;
        const lookup = new Map(bank.questions.map(q => [q.id, q]));
        if (!saved.ids.every(id => lookup.has(id))) return null;
        const answers = {};
        for (const id of saved.ids) {
            const value = saved.answers?.[id];
            if (Number.isInteger(value) && value >= 0 && value < lookup.get(id).options.length) answers[id] = value;
        }
        return { ...saved, answers, flags: Array.isArray(saved.flags) ? saved.flags.filter(id => saved.ids.includes(id)) : [], index: Math.max(0, Math.min(saved.ids.length - 1, Number.isInteger(saved.index) ? saved.index : 0)), finished: saved.finished === true };
    }
    function paper(bank, area) { return bank?.papers?.find(p => 'simulacro:' + p.id === area) || null; }
    return { subjects, validate, select, grade, restore, paper, solutionHtml };
});
