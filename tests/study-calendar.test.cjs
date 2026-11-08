const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { buildSample, today, monday, move, kinds } = require('../study-calendar-data.js');
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
        assert.ok(items.some(item => item.show));
    }
    assert.equal(first.get('2026-11-08')[0].kind, 'rest');
    assert.equal(first.get('2026-11-14')[0].resource, 'simulation');
    assert.ok(first.get('2026-11-09').some(item => !item.show));
});

test('the authenticated campus and cache use the same calendar resources', () => {
    const html = read('campus.html');
    const script = read('script.js');
    const worker = read('sw.js');
    assert.match(html, /href="\/campus\?seccion=calendario"/);
    assert.match(html, /id="study-calendar-screen"/);
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
