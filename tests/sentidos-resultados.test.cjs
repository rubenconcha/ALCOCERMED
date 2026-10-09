const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={nervousClassIds:['r1','r2'],parseParticipantAvatarName:raw=>({nombre:raw.split('|').slice(1).join('|')})};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('juegos/sentidos-resultados.js','utf8'),ctx);
const answers=[{correcta:true},{correcta:false}];
const rows=ctx.buildSentidosLiveRows([
 {evaluacion_id:'r1',user_id:'a',puntaje:9000,total:20,respuestas:[{correcta:true}],created_at:'2026-10-09T10:00:00Z'},
 {evaluacion_id:'r1',user_id:'a',puntaje:1000,total:20,respuestas:answers,created_at:'2026-10-09T11:00:00Z'},
 {evaluacion_id:'r2',user_id:'a',puntaje:500,total:20,respuestas:[],created_at:'2026-10-09T11:01:00Z'}
],[{evaluacion_id:'r1',user_id:'a',nombre:'avatar|Ana Pérez'},{evaluacion_id:'r2',user_id:'a',nombre:'avatar|Ana Pérez'}]);
assert.equal(rows[0].length,1);assert.equal(rows[1].length,1);
assert.equal(rows[0][0].points,1000);assert.equal(rows[0][0].name,'Ana Pérez');
assert.equal(rows[0][0].answered,2);assert.equal(rows[0][0].correct,1);
assert.equal(rows[1][0].answered,0);
console.log('OK: último intento por persona y ronda; avance y aciertos independientes.');
