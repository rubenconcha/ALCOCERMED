const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = {document:{addEventListener(){}}, Date, nervousQuestionImages:{}};
vm.createContext(context);
for (const path of ['juegos/acceso-noche.js','juegos/relacionar.js','juegos/encefalo-native-data.js']) vm.runInContext(fs.readFileSync(path,'utf8'),context);
assert.equal(context.isNightClassOpen(Date.parse('2026-09-30T23:59:00-04:00')),true);
assert.equal(context.isNightClassOpen(Date.parse('2026-10-01T05:59:59-04:00')),true);
assert.equal(context.isNightClassOpen(Date.parse('2026-10-01T06:00:00-04:00')),false);
assert.equal(context.isNightClassOpen(Date.parse('2026-10-02T00:00:00-04:00')),false);
assert.equal(context.isNightClassUser({user_metadata:{class_night:'2026-09-30'}}),true);
assert.equal(context.isNightClassUser({user_metadata:{demo_guest:true}}),false);
assert.equal(context.matchingAnswersCorrect(['0','1','2'], [{},{},{}]),true);
for(const answer of [['1','0','2'],['0','0','2'],['0','1'],['','1','2']]) assert.equal(context.matchingAnswersCorrect(answer,[{},{},{}]),false);
const sql=fs.readFileSync('juegos/SUPABASE_ENCEFALO_20.sql','utf8');
assert.equal((sql.match(/insert into public.evaluacion_preguntas /g)||[]).length,20);
assert.equal((sql.match(/insert into public.evaluaciones /g)||[]).length,2);
for(const evaluation of context.encefaloEvaluations){
  assert.equal(evaluation.questionIds.length,10);
  for(const id of evaluation.questionIds){assert(sql.includes(id));assert(fs.existsSync('.'+context.nervousQuestionImages[id].src));}
}
const index=fs.readFileSync('juegos/index.html','utf8');
for(const file of ['acceso-noche.js','relacionar.js','encefalo-native-data.js']) assert(index.includes(file));
assert(!index.includes('href="/juegos/encefalo.html"'));
console.log('OK: vencimiento único Bolivia, identidad invitada, corrección de relaciones, 20 preguntas y 20 imágenes integradas.');
