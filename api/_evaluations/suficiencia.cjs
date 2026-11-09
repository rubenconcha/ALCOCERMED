const core = require('../../suficiencia-core.js');
const maxQuestions = 30;
let compiled;

function evaluations() {
    if (compiled) return compiled;
    const base = require('../_sufficiency/bank.json');
    const guides = require('../_sufficiency/umsa-2026.cjs');
    const bank = { ...base, questions: base.questions.concat(guides) };
    if (!core.validate(bank)) throw new Error('Banco de Suficiencia incompleto.');

    const entries = new Map();
    for (const [subject, subjectLabel] of Object.entries(core.subjects)) {
        const groups = new Map();
        for (const question of bank.questions.filter(q => q.subject === subject)) {
            const key = core.topicFor(question, bank).key;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(question);
        }
        for (const topic of core.topics(bank, subject)) {
            const questions = groups.get(topic.key);
            if (!questions) continue;
            const official = core.isOfficial(questions[0]);
            const title = topic.label;
            // Repartir el tema en partes equilibradas permite ofrecer todo el banco con intentos de hasta 30 preguntas.
            const parts = Array.from({ length: Math.ceil(questions.length / maxQuestions) }, () => []);
            questions.forEach((question, i) => parts[i % parts.length].push(question));
            parts.forEach((part, i) => {
                const id = 'suf-' + subject + '-' + topic.key.replace(':', '-') + '-' + (i + 1);
                const exam = {
                    id, subject: subjectLabel, subjectLabel, topic: topic.label,
                    title: parts.length > 1 ? title + ' · Parte ' + (i + 1) : title,
                    ...(official ? { number: topic.chapter } : {}),
                    count: part.length, duration: part.length * 2,
                };
                entries.set(id, { exam, questions: part });
            });
        }
    }
    compiled = { entries, bank };
    return compiled;
}

function metadata() {
    return Array.from(evaluations().entries.values(), entry => entry.exam);
}

function paper(id) {
    const { entries, bank } = evaluations();
    const entry = entries.get(id);
    if (!entry) return null;
    return { ...entry.exam, questions: entry.questions.map(q => core.toQuestionRow(q, bank)) };
}

module.exports = { metadata, paper };
