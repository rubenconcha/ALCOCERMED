const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const paper=require('../api/_evaluations/morfo-08.json'),cards=require('../api/_flashcards/library.json').cards.filter(c=>c.tema==='el sistema oseo'&&c.official_source==='morfo'),{selectQuestions}=require('../api/_game-practice/select.cjs');
test('Skeleton questions are standalone, direct, and use no slide/editor wording',()=>{
 const banned=/diapositiv|presentaci[oó]n|accidente|coincide con|se muestra|asociaci[oó]n entre/i;
 assert.equal(paper.content_revision,5);for(const q of paper.questions){assert.ok(!banned.test(q.pregunta));assert.ok(!banned.test(q.justificacion));assert.ok(Object.values(q.comentarios_opciones).every(x=>!banned.test(x)));}for(const c of cards)assert.ok(!banned.test(c.pregunta+' '+c.respuesta));assert.equal(paper.questions[0].pregunta,'¿Cómo se clasifica el esqueleto humano?');assert.equal(paper.questions[2].pregunta,'¿Qué estructura ósea aloja la raíz de un diente?');
});
test('Fourteen anatomical figures persist through flashcard, evaluation and game APIs',()=>{
 const game=selectQuestions({id:'22222222-2222-2222-2222-222222222222',codigo:'T8MORF',asignatura:'MORFOFUNCION',tema:'El sistema óseo',titulo:'Sistema óseo'});
 for(const rows of [cards,paper.questions,game]){assert.equal(rows.length,20);assert.equal(rows.filter(q=>q.study_image).length,14);for(const q of rows.filter(q=>q.study_image)){assert.match(q.study_image.src,/^\/assets\/study\/oseo\//);assert.ok(fs.statSync('.'+q.study_image.src).size>1000);assert.ok(q.study_image.alt.length>10);}}
});
test('Native game image selector renders the attached anatomy instead of unrelated fallback art',()=>{
 const text=fs.readFileSync('juegos/app.js','utf8'),code=text.slice(text.indexOf('function getQuizQuestionImage('),text.indexOf('function getNervousQuestionIllustration('));const context={};vm.createContext(context);vm.runInContext(code,context);const q={study_image:paper.questions[0].study_image};assert.equal(context.getQuizQuestionImage(q,'mc'),q.study_image.src);
});
test('An old skeleton session cannot restore the obsolete slide-worded questions',async()=>{
 const practice=require('../juegos/game-practice.js'),oldFetch=global.fetch,oldStorage=global.sessionStorage,memory=new Map([['alcocer_self_extra_old-round',JSON.stringify({replace:true,questions:[{id:'obsolete',texto:'Diapositivas'}]})]]);
 const ev={id:'22222222-2222-2222-2222-222222222222',codigo:'T8MORF',asignatura:'MORFOFUNCION',tema:'El sistema óseo',titulo:'Sistema óseo'},expected=selectQuestions(ev);let calls=0;
 try{global.sessionStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};global.fetch=async()=>{calls++;return {ok:true,json:async()=>({replace:true,questions:expected})}};const client={auth:{getSession:async()=>({data:{session:{access_token:'local-only'}}})}};assert.deepEqual(await practice.load(client,ev,[],'old-round',true),expected);assert.equal(calls,1);global.fetch=async()=>{throw Error('offline')};assert.deepEqual(await practice.load(client,ev,[],'old-round',true),expected);}finally{global.fetch=oldFetch;global.sessionStorage=oldStorage;}
});
