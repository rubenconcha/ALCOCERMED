const assert = require('node:assert/strict');
const fs = require('node:fs');
const data = JSON.parse(fs.readFileSync('juegos/encefalo-preguntas.json','utf8'));
assert.equal(data.rounds.length,2);
const ids=new Set();
for(const round of data.rounds){
 assert.equal(round.questions.length,10);
 assert.deepEqual([...new Set(round.questions.map(q=>q.type))].sort(),['match','mc','ms','tf']);
 for(const q of round.questions){
  assert(!ids.has(q.id));ids.add(q.id);
  assert(fs.existsSync('juegos/'+q.image));assert(q.alt && q.explanation && q.slides);
  if(q.type==='match'){assert(q.pairs.length>=3);assert.equal(new Set(q.pairs.map(p=>p[1])).size,q.pairs.length);}
  else{assert(q.correct.length>0);assert.equal(new Set(q.correct).size,q.correct.length);q.correct.forEach(i=>assert(i>=0&&i<q.options.length));if(q.type!=='ms')assert.equal(q.correct.length,1);}
 }
}
for(let i=1;i<=2;i++){const csv=fs.readFileSync(`juegos/encefalo-anki-${i}.csv`,'utf8');assert.equal(csv.split(/\r?\n/).filter(l=>l&&!l.startsWith('#')).length,10);assert(csv.startsWith('#separator:Comma'));}
console.log('Encéfalo: 20 preguntas, 4 modalidades en cada ronda, imágenes existentes y 20 tarjetas Anki.');
