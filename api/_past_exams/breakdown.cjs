'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const index = require('./topic-index.json');
const withCommentary = require('./commentaries.cjs');

const pageSize = 24;
const files = new Map();
const normalize = value => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
const selected = value => new Set(typeof value === 'string' ? value.slice(0, 1024).split(',').filter(Boolean) : []);
const classification = code => index.topics[code]
    ? { subject: index.topics[code].subject, topic: code }
    : { subject: code || '', topic: '' };

function questionsFor(exam) {
    if (!files.has(exam.id)) {
        const request = fs.readFile(path.join(__dirname, exam.id + '.json'), 'utf8')
            .then(contents => {
                const paper = JSON.parse(contents);
                const assignments = index.exams[exam.id] || [];
                return paper.questions.map(question => {
                    return {
                        examId: exam.id, year: exam.year, type: exam.type,
                        ...classification(assignments[question.numero_original - 1]),
                        question,
                    };
                });
            })
            .catch(error => { files.delete(exam.id); throw error; });
        files.set(exam.id, request);
    }
    return files.get(exam.id);
}

function matchesSearch(row, search) {
    if (!search.length) return true;
    if (row.terms === undefined) {
        const q = row.question;
        row.terms = normalize([q.pregunta, q.opcion_a, q.opcion_b, q.opcion_c, q.opcion_d, q.opcion_e].join(' '));
    }
    return search.every(term => row.terms.includes(term));
}

async function breakdown(catalog, access, query) {
    const year = typeof query.year === 'string' ? query.year : '';
    const type = typeof query.type === 'string' ? query.type : '';
    const search = normalize(typeof query.search === 'string' ? query.search.slice(0, 120) : '').split(' ').filter(Boolean);
    const subjects = selected(query.subjects);
    const topics = selected(query.topics);
    const unconfirmed = query.unconfirmed === '1';
    const requested = Boolean(year || type || subjects.size || topics.size || unconfirmed || search.length || query.all === '1');
    const scope = catalog.exams.filter(exam => (!year || year === exam.year) && (!type || type === exam.type));
    const visible = scope.filter(exam => access.premium || exam.year === catalog.freeYear);
    const rows = requested
        ? (await Promise.all(visible.slice().reverse().map(questionsFor))).flat()
        : visible.flatMap(exam => (index.exams[exam.id] || []).filter(Boolean).map(classification));
    const subjectCounts = new Map();
    const topicCounts = new Map();
    for (const row of rows) {
        subjectCounts.set(row.subject, (subjectCounts.get(row.subject) || 0) + 1);
        if (row.topic) topicCounts.set(row.topic, (topicCounts.get(row.topic) || 0) + 1);
    }
    const filtered = requested ? rows.filter(row => (!subjects.size || subjects.has(row.subject))
        && (!topics.size || topics.has(row.topic)) && (!unconfirmed || !row.topic)
        && matchesSearch(row, search)) : [];
    const count = filtered.length;
    const pages = Math.max(1, Math.ceil(count / pageSize));
    const requestPage = typeof query.page === 'string' && /^\d{1,5}$/.test(query.page) ? Number(query.page) : 1;
    const page = Math.min(pages, Math.max(1, requestPage));
    return {
        requested, count, page, pages, pageSize, available: rows.length,
        unconfirmedCount: rows.filter(row => !row.topic).length,
        locked: scope.length > 0 && visible.length === 0,
        subjects: Object.entries(index.sources).filter(([id]) => subjectCounts.has(id) || subjects.has(id))
            .map(([id, source]) => ({ id, ...source, count: subjectCounts.get(id) || 0 })),
        topics: Object.entries(index.topics).filter(([id]) => topicCounts.has(id) || topics.has(id))
            .map(([id, topic]) => ({ id, ...topic, count: topicCounts.get(id) || 0,
                bibliography: index.sources[topic.source || topic.subject] })),
        questions: requested ? filtered.slice((page - 1) * pageSize, page * pageSize)
            .map(({ terms, question, ...row }) => ({ ...row, question: withCommentary(question) })) : [],
    };
}

module.exports = breakdown;
