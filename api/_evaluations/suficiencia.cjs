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
    const questions = entry.questions.map((q, index) => {
        const row = { ...core.toQuestionRow(q, bank), numero_pregunta: index + 1 };
        if (q.id === 'abp-05-01') {
            const data = [...q.text.matchAll(/([UABCD])=(\{[^}]+\})/g)];
            if (data.length === 5) {
                const sets = data.map(([, name, values]) => name + ' = ' + values.replace(/,/g, ', '));
                row.pregunta = '¿Qué números de estos conjuntos cumplen las tres condiciones?\n'
                    + '1. Están en C o en D.\n2. No están en A.\n3. También están en B.\n\n'
                    + sets.join('\n');
            }
        }
        return row;
    });
    return { ...entry.exam, questions };
}

module.exports = { metadata, paper };
