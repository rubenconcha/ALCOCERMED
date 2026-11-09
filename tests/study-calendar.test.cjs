const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { buildSample, today, monday, move, kinds, pageRange } = require('../study-calendar-data.js');
const { exercises } = require('../sufficiency-practice-content.js');
const evaluationCatalog = require('../content/topic-evaluations/catalog.json');
const pastIndex = require('../api/_past_exams/topic-index.json');
const { archivos } = require('../referencias-oficiales/manifest.json');
const bookPages = {
    morfofuncion: archivos.find(book => book.archivo.startsWith('morfofisiliologia')).paginas_pdf,
    'biologia-celular': archivos.find(book => book.archivo.startsWith('Biologia_Celular')).paginas_pdf,
    'educacion-salud': archivos.find(book => book.archivo.startsWith('EDUCACION')).paginas_pdf,
};
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');

test('the sample calendar uses the Bolivian civil date and weeks starting on Monday', () => {
    assert.equal(today(new Date('2026-11-09T02:00:00Z')), '2026-11-08');
    assert.equal(today(new Date('2026-11-09T04:00:00Z')), '2026-11-09');
    assert.equal(monday('2026-11-08'), '2026-11-02');
    assert.equal(monday('2026-11-09'), '2026-11-09');
    assert.equal(move('2026-12-31', 1), '2027-01-01');
});

test('month, agenda and day use the same sample plan with stable, ordered activities', () => {
    const first = buildSample('2026-11-08');
    const next = buildSample('2026-11-09');
    assert.equal(first.size, 77);
    const dates = [...first.keys()];
    assert.equal(dates[0], '2026-10-05');
    assert.equal(dates.at(-1), '2026-12-20');
    assert.deepEqual(first.get('2026-11-09'), next.get('2026-11-09'));
    const entries = [...first.values()].flat();
    assert.equal(entries.length, new Set(entries.map(item => item.id)).size);
    assert.deepEqual(new Set(entries.filter(item => item.show).map(item => item.kind)), new Set(Object.keys(kinds)));
    assert.ok(entries.every(item => Object.hasOwn(kinds, item.kind)));
    assert.ok(entries.every(item => !item.end || item.end > item.start));
    for (const items of first.values()) {
        assert.deepEqual(items.map(item => item.start), items.map(item => item.start).sort());
        assert.ok(items.every(item => item.show));
        assert.ok(items.every((item, i) => !i || item.start >= items[i - 1].end));
    }
    assert.equal(first.get('2026-11-08')[0].kind, 'rest');
    assert.equal(first.get('2026-11-14')[0].resource, 'simulation');
});

test('weekdays assign the example blocks and rotate verified readings and existing exercises', () => {
    const plan = buildSample('2026-11-09');
    const monday = plan.get('2026-11-09');
    assert.deepEqual(monday.map(({ start, end }) => [start, end]), [
        ['08:00', '10:00'], ['10:00', '11:00'], ['11:00', '12:00'], ['12:00', '13:00'], ['13:00', '16:00'], ['16:00', '16:30'],
    ]);
    assert.deepEqual(monday.map(item => item.resource), ['reading', 'questions', 'reading', undefined, 'practice', 'evaluation']);
    assert.match(monday[0].title, /Morfofunción · Sangre/);
    assert.equal(monday[0].reading.section, 'Capítulo 18');
    assert.equal(pageRange(monday[0].reading.printed), '679–695');
    assert.equal(pageRange(monday[0].reading.pdf), '707–723');
    assert.equal(monday[1].bankTopic, 'sangre');
    assert.deepEqual(monday[0].reading.topicLinks, {
        evaluation: 'morfo-18',
        past: { subject: 'morfo', topics: ['morfo-18'] },
    });
    assert.deepEqual(monday[1].topicLinks, monday[0].reading.topicLinks);
    assert.equal(monday[2].reading.slug, 'educacion-salud');
    assert.equal(monday[4].practice.subject, 'Matemáticas');

    for (const items of plan.values()) {
        if (items[0].resource !== 'reading') continue;
        assert.deepEqual(items[1].topicLinks, items[0].reading.topicLinks);
        assert.equal(items[1].title, 'Examen pasado · ' + items[0].reading.topic);
        assert.equal(items[5].resource, 'evaluation');
        assert.deepEqual(items[5].topicLinks, items[0].reading.topicLinks);
    }
    const evaluations = new Map(evaluationCatalog.exams.map(exam => [exam.id, exam]));
    const expectedSubjects = { morfofuncion: 'MORFOFUNCION', 'biologia-celular': 'BIOLOGIA CELULAR', 'educacion-salud': 'SALUD PUBLICA' };
    for (const { reading } of [...plan.values()].flat().filter(item => item.reading)) {
        const { evaluation, past } = reading.topicLinks;
        assert.equal(evaluations.get(evaluation)?.subject, expectedSubjects[reading.slug], reading.topic);
        assert.ok(past.topics.length && past.topics.every(id => pastIndex.topics[id]?.subject === past.subject), reading.topic);
    }

    const weekdayStarts = [...plan.values()].filter(items => items[0].resource === 'reading').map(items => items[0].title);
    assert.equal(new Set(weekdayStarts).size, 10);
    assert.notEqual(plan.get('2026-11-16')[0].title, monday[0].title);
    for (const item of [...plan.values()].flat()) {
        if (item.reading) {
            const [first, last] = item.reading.pdf;
            assert.ok(first >= 1 && first <= last && last <= bookPages[item.reading.slug], item.title);
        }
        if (item.practice) {
            const exercise = exercises.find(exercise => exercise.id === item.practice.id);
            assert.equal(exercise?.title, item.practice.topic);
            assert.equal(exercise.subject, item.practice.subject);
        }
    }
});

test('the authenticated campus and cache use the same calendar resources', () => {
    const html = read('campus.html');
    const script = read('script.js');
    const worker = read('sw.js');
    assert.match(html, /href="\/campus\?seccion=calendario"/);
    assert.match(html, /id="study-calendar-screen"/);
    assert.match(html, /<aside id="calendar-plan"/);
    assert.match(script, /campusParams\.get\('dia'\)/);
    assert.match(html, /Plan de práctica de muestra/);
    assert.match(script, /section === 'calendario'/);
    assert.match(script, /CampusCalendar\?\.setUser\(\)/);
    for (const asset of ['study-calendar.css', 'study-calendar-data.js', 'study-calendar-pdf.js', 'study-calendar.js', 'campus-shell.css', 'campus-shell.js']) {
        const loaded = html.match(new RegExp(asset.replace(/\./g, '\\.') + '\\?v=\\d+'))?.[0];
        assert.ok(loaded, asset);
        assert.ok(worker.includes('./' + loaded), asset);
    }
    for (const asset of ['vendor/fullcalendar/index.global.min.js', 'vendor/fullcalendar/es.global.min.js', 'vendor/jspdf/jspdf.umd.min.js']) {
        assert.ok(worker.includes('./' + asset), asset);
        assert.ok(fs.statSync(path.join(__dirname, '..', asset)).size > 500, asset);
    }
});
