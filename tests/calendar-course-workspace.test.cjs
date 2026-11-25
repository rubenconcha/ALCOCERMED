const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const data=require('../study-calendar-data.js');

test('the selected presencial group preserves every class slot from the supplied photos',()=>{
 const expected={presencial_1:[['bio','mate','morfo'],['bio','morfo','fis'],['salud','quim','morfo'],['bio','morfo','mate'],['bio','fis','morfo']],
 presencial_2:[['morfo','bio','mate'],['fis','bio','morfo'],['morfo','salud','quim'],['mate','bio','morfo'],['morfo','bio','fis']]};
 for(const [group,days] of Object.entries(expected))for(let i=0;i<5;i++){
  const rows=data.groupDay(data.move('2026-11-23',i),group);
  assert.deepEqual(rows.map(r=>r.subject),days[i]);
  assert.deepEqual(rows.map(r=>[r.start,r.end]),[['08:30','10:00'],['10:05','11:30'],['11:35','13:00']]);
  assert.ok(rows.every(r=>r.officialClass));
 }
});
test('course plans never fall back to unrelated sample topics, weekends or dates outside the course',()=>{
 for(const group of ['presencial_1','presencial_2','virtual']){
  const plan=data.buildGroupPlan('2026-11-24',group);
  assert.equal(plan.size,40);
  assert.equal(plan.has('2026-11-21'),false);assert.equal(plan.has('2027-01-16'),false);
  for(const day of plan.keys())assert.ok(day>='2026-11-23'&&day<='2027-01-15');
 }
 assert.equal(data.buildGroupPlan('2026-11-24','').size,0);
 assert.deepEqual(data.groupDay('2026-11-28','virtual'),[]);
 assert.deepEqual(data.groupDay('2027-01-18','presencial_1'),[]);
});
test('only confirmed weekly Medicine alternatives are offered and all three tools share the selected chapter',()=>{
 for(const group of ['presencial_1','presencial_2','virtual']){
  const rows=data.groupDay('2026-11-24',group);
  const morfo=rows.find(r=>r.readingGroup==='morfofuncion');
  const bio=rows.find(r=>r.readingGroup==='biologia-celular');
  assert.deepEqual(morfo.readingOptions.map(r=>r.topicLinks.evaluation),['morfo-05','morfo-06']);
  assert.deepEqual(bio.readingOptions.map(r=>r.topicLinks.evaluation),['biologia-03','biologia-05']);
  for(const r of [...morfo.readingOptions,...bio.readingOptions])assert.deepEqual(r.topicLinks.past.topics,[r.topicLinks.evaluation]);
  assert.ok(data.groupDay('2026-11-30',group).every(r=>!r.readingOptions?.length));
 }
});
test('virtual suggested study and official evening classes remain separate',()=>{
 const rows=data.groupDay('2026-11-24','virtual');
 assert.equal(rows.length,11);
 const live=rows.find(r=>r.id.endsWith('-clases'));
 assert.equal(live.start,'17:00');assert.equal(live.end,'21:00');
 assert.match(live.description,/17:00–18:00 · Biología Celular/);
 assert.match(live.description,/18:05–19:20 · Morfofunción/);
 assert.match(live.description,/19:30–21:00 · Física/);
 assert.ok(rows.every(r=>!r.title.includes('Desglose')));
});
test('calendar entry opens the daily workspace and leaves the monthly calendar as secondary navigation',()=>{
 const js=fs.readFileSync('study-calendar.js','utf8');
 const entry=js.slice(js.indexOf('window.CampusCalendar ='),js.indexOf('openDate(date'));
 assert.match(entry,/showDay\(data.today\(\)\)/);assert.doesNotMatch(entry,/showOverview\(/);
 assert.match(js,/data.buildGroupPlan\(reference, groupSelect.value\)/);
 assert.doesNotMatch(js,/data.buildSample\(/);
 assert.match(js,/plan.prepend\(groupControl\)/);
 assert.match(js,/tool\('Manual', 'book', \(\) => updateView\('manual'\)\)/);
 assert.match(js,/tool\('Examen pasado'/);assert.match(js,/tool\('Evaluación'/);
});
