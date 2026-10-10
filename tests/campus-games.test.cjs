const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const script = fs.readFileSync('script.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const start = script.indexOf('const QUIZ_QUESTIONS = [');
const end = script.indexOf('window.startQuiz =', start);
const context = {
    normalizeDbText: value => String(value || '').trim().toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    campo: (row, name) => row[name] ?? row[name.toUpperCase()] ?? ''
};
vm.runInNewContext(script.slice(start, end) + '\nglobalThis.gameData = { quiz: QUIZ_QUESTIONS, words: HANGMAN_WORDS, preview: freePracticeRows(), map: quizQuestionFromBanco };', context);

test('the campus game menu includes the subject games platform', () => {
    assert.match(script, /name: 'Juegos por materias'/);
    assert.match(script, /window\.location\.href = '\/juegos\/'/);
    assert.match(html, /href="\/juegos\/" data-tooltip="juegos por materias"/);
});

test('hangman covers all three official subjects with enough terms for a demo and more paid play', () => {
    for (const subject of ['morfofunción', 'biología celular', 'educación para la salud']) {
        const entries = context.gameData.words.filter(item => item.category === subject);
        assert.ok(entries.length >= 15, `${subject}: ${entries.length} terms`);
        assert.ok(entries.every(item => item.word && item.hint));
    }
});

test('bibliographic bank questions map into paid quiz play while free preview stays fixed', () => {
    const row = {
        MATERIA: 'SALUD PUBLICA', FUENTE: 'Educación en Salud e Investigación CB24-25',
        PREGUNTA: '¿Qué acción ayuda a prevenir enfermedades?',
        OPCION_A: 'Vacunación', OPCION_B: 'Ninguna', OPCION_C: 'Otra', OPCION_D: 'Todas',
        RESPUESTA_CORRECTA: 'A'
    };
    const mapped = context.gameData.map(row);
    assert.equal(mapped.subject, 'educación para la salud');
    assert.equal(mapped.answer, 0);
    assert.equal(mapped.opts[0], 'Vacunación');
    assert.equal(context.gameData.map({...row, FUENTE: ''}), null);
    assert.equal(context.gameData.preview.length, 9);
    assert.ok(context.gameData.quiz.filter(q => q.subject === 'educación para la salud').length >= 5);
});
