const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const review=require('../question-review.js');
const read=(q,key)=>q[key]??q[key.toUpperCase()];
test('snapshot preserves the options actually presented, chosen answer, source and original number',()=>{
 const question={id:7,numero_original:12,PREGUNTA:'Pregunta de prueba',opcion_a:'Opción 1',opcion_b:'Opción 2',justificacion:'Explicación almacenada',fuente:'Fuente del material',paginas_pdf:'10'};
 const payload=review.snapshot([question],[{selected:0}],read,()=>[1]);question.opcion_a='Modificada después';
 assert.equal(payload.items[0].options[0],'Opción 1');assert.equal(payload.items[0].number,12);assert.equal(payload.items[0].source,'Fuente del material');assert.equal(review.inspect(payload)[0].status,'wrong');
});
test('bank and saved reviews preserve the existing rationale for each alternative and both page numbers',()=>{
 const q={OPCION_A:'Primera',OPCION_B:'Segunda',EXPLICACION:'A. Motivo de A.\n\nB. Motivo de B.',FUENTE:'Texto de estudio',PAGINAS_PDF:'45',PAGINA_IMPRESA:'17'};
 const detail=review.snapshot([q],[{selected:1}],read,()=>[0]).items[0];
 assert.equal(detail.explanation,'');assert.deepEqual(detail.option_explanations,['Motivo de A.','Motivo de B.']);
 assert.equal(detail.pdf_page,'45');assert.equal(detail.printed_page,'17');
 q.EXPLICACION='A. Solo una explicación general.';
 assert.equal(review.commentaryData(q,read).explanation,q.EXPLICACION);
});
test('review distinguishes accepted alternatives, wrong answers, omissions and malformed detail',()=>{
 const item={options:['A','B','C'],accepted:[0,2]};
 const result=review.inspect({version:1,items:[{...item,selected:0},{...item,selected:2},{...item,selected:1},{...item,selected:null},{...item,selected:9}]});
 assert.deepEqual(result.map(q=>q.status),['correct','correct','wrong','unanswered','unknown']);
 assert.equal(review.inspect(null),null);assert.equal(review.inspect({version:0,items:[]}),null);
});
test('new native deliveries save review snapshots and admin fetches them only when requested',()=>{
 const script=fs.readFileSync('script.js','utf8'),admin=fs.readFileSync('admin.js','utf8'),html=fs.readFileSync('campus.html','utf8'),viewer=fs.readFileSync('question-review.js','utf8');
 assert.match(fs.readFileSync('campus-exam-engine.js','utf8'),/snapshot\(simState.preguntas,simState.answers/);assert.match(script,/snapshot\(bancoState.preguntas,bancoState.answers/);assert.equal((script.match(/question_review: resultado.questionReview/g)||[]).length,2);
 assert.ok(html.indexOf('question-review.js')<html.indexOf('script.js?v='));assert.match(viewer,/select\('question_review'\)/);assert.ok(!viewer.includes('.innerHTML'));assert.ok(!admin.includes("safeSelect(sb, 'resultados_simulacros', '*'"));
});
test('both cloud writers send the captured review in the same insert as the grade',async()=>{
 const vm=require('node:vm'),src=fs.readFileSync('script.js','utf8'),calls=[];
 const context={currentUser:{id:'actor',email:'actor@example.invalid',user_metadata:{}},console,getSupabase:()=>({from:table=>({insert:payload=>{calls.push({table,payload});return Promise.resolve({error:null});}})})};
 vm.createContext(context);vm.runInContext(src.slice(src.indexOf('async function guardarResultadoSimulacroEnNube('),src.indexOf('async function registrarVideoVistoEnNube(')),context);
 const payload={version:1,items:[{selected:0,accepted:[1],options:['A','B']}]};
 await context.guardarResultadoSimulacroEnNube({questionReview:payload,titulo:'Prueba',menuSection:'evaluaciones',porcentaje:0});
 await context.guardarResultadoBancoEnNube({questionReview:payload,total:1,correctas:0,incorrectas:1,porcentaje:0});
 assert.equal(calls.length,2);assert.deepEqual(calls.map(c=>c.table),['resultados_simulacros','resultados_banco']);calls.forEach(c=>{assert.equal(c.payload.question_review,payload);assert.equal(c.payload.porcentaje,0);assert.equal(c.payload.user_id,'actor');});
});
