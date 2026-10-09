const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const bank = JSON.parse(fs.readFileSync('juegos/sentidos-preguntas.json','utf8'));
const ctx = {nervousQuestionImages:{}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('juegos/sentidos-imagenes.js','utf8'),ctx);
const sql = fs.readFileSync('juegos/SUPABASE_SENTIDOS_SALADIN_40.sql','utf8');
assert.equal(bank.rounds.length,2);
assert.equal((sql.match(/insert into public.evaluaciones /g)||[]).length,2);
assert.equal((sql.match(/insert into public.evaluacion_preguntas /g)||[]).length,40);
const ids = new Set(), prompts = new Set();
bank.rounds.forEach((r,ri)=>{
  assert.equal(r.questions.length,20);
  assert.deepEqual([...new Set(r.questions.map(q=>q.type))].sort(),['match','mc','ms','tf']);
  assert.deepEqual(Array.from(ctx.sentidosEvaluations[ri].questionIds),r.questions.map(q=>q.id));
  for(const q of r.questions){
    assert(!ids.has(q.id)); ids.add(q.id);
    assert(!prompts.has(q.prompt)); prompts.add(q.prompt);
    assert(q.slide>=1&&q.slide<=140);
    assert.equal(q.difficulty,'fácil');
    const im=ctx.nervousQuestionImages[q.id];
    assert(im&&im.alt&&fs.existsSync('.'+im.src));
    assert(sql.includes(q.id)&&sql.includes(im.src));
    if(q.type==='match'){
      assert(q.pairs.length>=2);
      assert.equal(new Set(q.pairs.map(p=>p[1])).size,q.pairs.length);
    } else {
      assert(q.correct.every(i=>i>=0&&i<q.options.length));
      assert.equal(new Set(q.correct).size,q.correct.length);
      if(q.type==='ms') assert(q.correct.length>1&&q.correct.length<q.options.length);
      else assert.equal(q.correct.length,1);
      if(q.type==='tf') assert.deepEqual(q.options,['Verdadero','Falso']);
    }
  }
});
assert.equal(new Set(Object.values(ctx.nervousQuestionImages).map(x=>x.src)).size,40);
const app=fs.readFileSync('juegos/app.js','utf8');
for(const name of ['parseEvalGameConfig','resolveQuizQuestionsForEval']){
  const start=app.indexOf('function '+name+'('),end=app.indexOf('\n}',start)+2;
  vm.runInContext(app.slice(start,end),ctx);
}
for(const r of bank.rounds){
  const e={config_juego:{maxQuestions:20,questionOrder:r.questions.map(q=>q.id)}};
  assert.equal(ctx.resolveQuizQuestionsForEval(e,[...r.questions].reverse()).length,20);
  assert.deepEqual(Array.from(ctx.resolveQuizQuestionsForEval(e,[...r.questions].reverse()),q=>q.id),r.questions.map(q=>q.id));
}
console.log('OK: 2 × 20 preguntas, 40 imágenes distintas, cuatro modalidades, respuestas válidas y orden completo del motor.');
const entry=fs.readFileSync('juegos/tejido-nervioso.js','utf8');
for(const [pathname,search,expected] of [['/juegos/','',true],['/juegos','',true],['/juegos/index.html','',true],['/juegos/','?tema=sentidos-saladin',true],['/juegos/','?cuenta=1',false],['/juegos/','?tema=tejido-nervioso',false]]){
  const c={URLSearchParams,location:{pathname,search}};vm.createContext(c);vm.runInContext(entry,c);
  assert.equal(c.sentidosClassMode,expected);
  if(expected)assert.deepEqual(Array.from(c.nervousClassIds),Array.from(ctx.sentidosEvaluations,e=>e.id));
}
console.log('OK: entrada por nombre en /juegos/, dos rondas correctas y acceso habitual preservado.');
