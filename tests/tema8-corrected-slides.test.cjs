const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),{execFileSync}=require('node:child_process');
const paper=require('../api/_evaluations/morfo-08.json'),bank=require('../api/_game-practice/bank.json'),source=require('../api/_flashcards/sources/morfo.json'),audit=require('../quality/tema8-slide-alignment.json');
const baseline=file=>JSON.parse(execFileSync('git',['show','36d7444:'+file],{encoding:'utf8',maxBuffer:25*1024*1024}));
test('Only skeleton practice changes; tissues and every other topic remain intact',()=>{
 assert.deepEqual(require('../api/_evaluations/morfo-05.json'),baseline('api/_evaluations/morfo-05.json'));
 assert.deepEqual(require('../api/_evaluations/morfo-07.json'),baseline('api/_evaluations/morfo-07.json'));
 assert.deepEqual(source.chapters.filter(c=>c.number!==8),baseline('api/_flashcards/sources/morfo.json').chapters.filter(c=>c.number!==8));
 assert.deepEqual(bank.filter(c=>c.id!=='morfo-08'),baseline('api/_game-practice/bank.json').filter(c=>c.id!=='morfo-08'));
});
test('Every question and flashcard traces to visible text in the corrected 47-slide deck',()=>{
 assert.equal(paper.content_revision,4);assert.equal(paper.lecture_slide_count,47);assert.equal(audit.tissues_included,false);assert.deepEqual(audit.rounds,[10,10]);
 const cards=source.chapters.find(c=>c.number===8).cards,questions=paper.questions,game=bank.find(c=>c.id==='morfo-08');
 assert.equal(cards.length,20);assert.equal(questions.length,20);assert.equal(game.questions.length,20);
 for(const row of [...cards,...questions,...game.questions]){const p=row.presentation_source;assert.equal(p.file,'Alcocermed_Sistema_Oseo_Corregido.pptx');assert.equal(p.scope,'visible_slide_text_only');assert.equal(p.sha256,paper.presentation_source.sha256);assert.equal(p.slide_count,47);assert.ok(p.slides.length>0);assert.ok(p.slides.every(s=>s.number>=2&&s.number<=46&&s.text.length>40));}
 assert.deepEqual(game.questions.map(q=>q.text),questions.map(q=>q.pregunta));
 assert.ok(!JSON.stringify([...cards,...questions]).toLowerCase().includes('pisiforme'));
});
test('All mind-map explanations are attached to the corrected slides and preserve native format',()=>{
 for(let i=1;i<=7;i++){const m=require('../api/_mindmaps/morfo_08_sistema_oseo__'+String(i).padStart(2,'0')+'.json');assert.equal(m.content_revision,4);assert.equal(m.lecture_slide_count,47);for(const item of m.sections.flatMap(s=>s.groups.flatMap(g=>g.items))){assert.equal(item.presentation_source.file,'Alcocermed_Sistema_Oseo_Corregido.pptx');assert.equal(item.presentation_source.scope,'visible_slide_text_only');assert.ok(item.presentation_source.quote.length>50);assert.deepEqual(item.lecture_slides,[item.presentation_source.slide]);}}
});
