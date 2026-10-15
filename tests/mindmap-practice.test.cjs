const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
test('practice covers five protected maps with full per-option feedback and traceable sources',()=>{
 const prompts=new Set();
 for(const id of ['morfo_18_sangre__07','morfo_16_organos_sentidos__07','morfo_16_organos_sentidos__08','morfo_18_sangre__08','morfo_16_organos_sentidos__09']){
  const payload=JSON.parse(fs.readFileSync('api/_mindmaps/'+id+'.json','utf8')),practice=payload.assets.practice;
  assert.equal(practice.flashcards.length,10);assert.equal(practice.questions.length,6);
  assert.equal(payload.review.doctor_approved,false);
  for(const card of practice.flashcards){assert.ok(card.answer.split(/\s+/).length>=35);assert.ok(card.pdf_pages.length);assert.ok(!prompts.has(card.question));prompts.add(card.question);}
  const positions=new Set();
  for(const q of practice.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.reasons.length,4);assert.ok(q.correct>=0&&q.correct<4);positions.add(q.correct);assert.ok(q.pdf_pages.every(p=>Number.isInteger(p)));assert.ok(q.reasons.every(r=>r.length>60));assert.match(q.reasons[q.correct],/^Correcto:/);assert.ok(!prompts.has(q.question));prompts.add(q.question);}
  assert.ok(positions.size>=3);
 }
 const blood=JSON.parse(fs.readFileSync('api/_mindmaps/morfo_18_sangre__07.json','utf8')).assets.practice;
 const calculation=blood.questions[0];assert.equal(calculation.options[calculation.correct],'5 200 neutrófilos/µl');assert.equal(8000*.65,5200);
 const retina=JSON.parse(fs.readFileSync('api/_mindmaps/morfo_16_organos_sentidos__07.json','utf8')).assets.practice;
 assert.match(retina.questions[0].options[retina.questions[0].correct],/GMPc baja.*hiperpolarización/);
 assert.match(retina.flashcards[8].answer,/420, 531 y 558/);
});
