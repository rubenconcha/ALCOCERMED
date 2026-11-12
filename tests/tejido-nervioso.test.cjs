const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('juegos/tejido-nervioso.js', 'utf8');
const bank = JSON.parse(fs.readFileSync('juegos/tejido-nervioso-41-50.json', 'utf8'));
const jhuly = JSON.parse(fs.readFileSync('juegos/tejido-nervioso-jhuly.json', 'utf8'));
const oldIds = ['71c3ac1c-7bda-5eaa-a449-d0b94ac33684', '243e1718-d7af-56bc-bf64-ea00346daa0d'];
function setup(topic) {
  const state = { cleared: 0, restored: [], navigation: [] };
  const els = {};
  const element = () => ({ textContent: '', classList: { add() {}, remove() {} } });
  const get = id => els[id] ||= element();
  const storage = new Map([['alcocer_nervioso_owner','student-1']]);
  const ctx = vm.createContext({
    URLSearchParams, location: { search: '?tema=' + topic },
    document: { getElementById: get },
    sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key,value) => storage.set(key,value) },
    currentUser: { id: 'student-1', user_metadata: { full_name: 'Ana Pérez' } },
    clearSelfSession: () => state.cleared++,
    restoreSelfStudy: (...args) => state.restored.push(args),
    navigateTo: (...args) => state.navigation.push(args),
  });
  vm.runInContext(source, ctx);
  return { ctx, state, get, storage };
}
(async () => {
  assert.equal(bank.questions.length, 10);
  assert.equal(new Set(bank.questions.map(q => q.id)).size, 10);
  bank.questions.forEach((q,i) => {
    assert.equal(q.order, i + 1); assert.ok(q.slide >= 41 && q.slide <= 50);
    assert.ok(q.correct.length > 0); assert.equal(new Set(q.correct).size, q.correct.length);
    q.correct.forEach(c => assert.ok(c >= 0 && c < q.options.length));
    assert.ok(['mc','ms','tf'].includes(q.type));
    assert.equal(q.type === 'ms', q.correct.length > 1);
    if(q.type === 'tf') assert.deepEqual(q.options, ['Verdadero','Falso']);
  });
  const sql = fs.readFileSync('juegos/SUPABASE_IMPORT_MORFO_TEJIDO_NERVIOSO_41_50_10.sql','utf8');
  assert.equal((sql.match(/insert into public.evaluacion_preguntas/g)||[]).length,10);
  assert.ok(sql.includes('"maxQuestions": 10'));
  assert.ok(!sql.match(/\bdelete\s+from\b|\btruncate\b/i));
  bank.questions.forEach(q => assert.ok(sql.includes(q.id)));
  assert.equal(jhuly.questions.length,20);
  assert.equal(new Set(jhuly.questions.map(q=>q.id)).size,20);
  assert.equal(jhuly.questions.filter(q=>q.difficulty==='fácil').length,20);
  assert.equal(jhuly.questions.filter(q=>q.difficulty==='intermedio').length,0);
  const imageContext=vm.createContext({});
  vm.runInContext(fs.readFileSync('juegos/tejido-nervioso-imagenes.js','utf8'),imageContext);
  assert.equal(new Set(jhuly.questions.map(q=>imageContext.nervousQuestionImages[q.id].src)).size,20);
  jhuly.questions.forEach(q=>assert.ok(fs.existsSync('.'+imageContext.nervousQuestionImages[q.id].src)));
  const jhulySql=fs.readFileSync('juegos/SUPABASE_TEJIDO_NERVIOSO_JHULY_20.sql','utf8');
  assert.equal((jhulySql.match(/insert into public.evaluacion_preguntas/gi)||[]).length,20);
  jhuly.questions.forEach((q,i)=>{
    assert.equal(q.order,i+1); assert.ok(q.slide>=51&&q.slide<=117);
    assert.equal(q.options.length,4); assert.ok(q.options.every(s=>s.trim().length>0));
    assert.equal(q.correct.length,1); assert.ok(q.correct[0]>=0&&q.correct[0]<4);
    assert.doesNotMatch(JSON.stringify(q),/memoria|alzheimer|parkinson/i);
    assert.ok(jhulySql.includes(q.id));
    assert.ok(imageContext.nervousQuestionImages[q.id]);
    assert.ok(imageContext.nervousQuestionHints[q.id]);
  });
  for (const topic of ['tejido-nervioso', bank.topic, jhuly.topic]) {
    const test = setup(topic); assert.equal(test.ctx.nervousClassMode,true);
    assert.deepEqual(Array.from(test.ctx.nervousClassIds),topic===jhuly.topic?[jhuly.evaluationId]:topic===bank.topic?[bank.evaluationId]:oldIds);
    assert.equal(test.ctx.enterNervousClassByName, undefined);
    test.storage.set('alcocer_quiz_code','SELF1234');
    test.storage.set('alcocer_self_evalid',test.ctx.nervousClassIds[0]);
    test.ctx.showNervousClass(); assert.equal(test.state.restored.length,1);
    test.storage.set('alcocer_self_evalid','unrelated-evaluation');
    test.ctx.showNervousClass(); assert.equal(test.state.restored.length,1);
    assert.equal(test.state.navigation.at(-1)[0],'nervioso');
    assert.equal(test.get('topbar-username').textContent,'Ana Pérez');
  }
  assert.equal(setup('otro-tema').ctx.nervousClassMode,false);
  console.log('OK: bancos de 10 y 20 preguntas; contenido excluido; imágenes y pistas; SQL; acceso con cuenta; rondas anteriores y restauración.');
})().catch(e=>{console.error(e);process.exitCode=1;});
