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


test('daily schedule keeps the unpinned navigation rail clear without changing the full menu',()=>{
 const css=fs.readFileSync('study-calendar.css','utf8');
 assert.match(css,/@media \(min-width: 769px\)/);
 assert.ok(css.includes('.campus-shell:not(.campus-menu-pinned):has(#home-screen:not(.hidden), #study-calendar-screen:not(.hidden) #calendar-day:not([hidden])) #sidebar { width: var(--shell-rail) }'));
});


test('daily exercises are constrained to the assigned subject and exact existing topic, with separate study hours',()=>{
 const bank=require('../api/_sufficiency/bank.json');
 for(let date=data.classCalendar.start;date<=data.classCalendar.end;date=data.move(date,1)){
  for(const group of ['virtual','presencial_1','presencial_2']){
   const rows=data.groupDay(date,group).filter(item=>item.resource==='sufficiency');
   for(const item of rows){
    const selected=data.practiceQuestions(bank.questions,item.assignment);
    assert.ok(selected.length<=20);
    for(const q of selected){assert.equal(q.subject,item.assignment.subject);assert.ok(item.assignment.topics.includes(q.topic));assert.ok(!q.source?.collection);}
   }
   if(group==='virtual'&&rows.length===2){
    const first=data.practiceQuestions(bank.questions,rows[0].assignment),second=data.practiceQuestions(bank.questions,rows[1].assignment);
    if(first.length+second.length>2)assert.ok(first.every(q=>!second.some(r=>r.id===q.id)));
   }
  }
 }
 const physics=data.practiceQuestions(bank.questions,data.practiceFor('2026-11-24',0));
 assert.ok(physics.length>0);assert.ok(physics.some(q=>q.topic==='Magnitudes'));
 assert.ok(!physics.some(q=>/circuit|lente|onda|movimiento/i.test(q.topic)));
 assert.deepEqual(data.practiceQuestions(bank.questions,data.practiceFor('2026-12-15',0)),[]);
});
