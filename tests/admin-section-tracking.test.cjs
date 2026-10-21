const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const model=require('../admin-section-tracking.js');
test('menu sections preserve tool attribution and ambiguous history',()=>{
 const rows=model.records({sims:[{user_id:'a',simulacro_titulo:'Evaluación: Tema 1',porcentaje:0},{user_id:'a',simulacro_titulo:'Primer parcial',menu_section:'examenes',porcentaje:90},{user_id:'a',simulacro_titulo:'Primer parcial',porcentaje:80}],flashcards:[{user_id:'a',repasos_totales:30}],games:[{user_id:'guest-id',evaluacion_id:1,porcentaje:85}],gameCatalog:[{id:1,titulo:'Ronda',asignatura:'MORFOFUNCION'}]});
 assert.deepEqual(rows.map(r=>r.section),['evaluaciones','examenes','historico','flashcards','juegos']);assert.equal(rows[0].grade,0);assert.match(rows[3].topic,/sin desglose/);assert.equal(rows[4].user_id,'guest-id');
});
test('visits, reviews and completions are separate evidence',()=>{
 const rows=model.records({activity:[{user_id:'a',section:'mapas',action:'opened',resource_key:'menu'},{user_id:'a',section:'mapas',action:'opened',topic:'T1'},{user_id:'a',section:'flashcards',action:'reviewed',topic:'T2'},{user_id:'a',section:'quiz',action:'completed',grade:0},{section:'bad',user_id:'a'}]});
 assert.deepEqual(rows.map(r=>r.action),['Sección visitada','Recurso abierto','Tarjeta repasada','Intento finalizado']);assert.equal(rows[3].grade,0);
});
test('client never writes another user ID and does not queue across accounts',async()=>{
 const calls=[],context={window:{},currentUser:null,crypto:{randomUUID:()=> 'event-1'},getSupabase:()=>({rpc:(name,args)=>{calls.push({name,args});return Promise.resolve({});}})};vm.createContext(context);vm.runInContext(fs.readFileSync('campus-section-tracking.js','utf8'),context);
 context.window.CampusTracking.record('mapas','opened');assert.equal(calls.length,0);context.currentUser={id:'a'};context.window.CampusTracking.record('flashcards','reviewed','materia','tema');await Promise.resolve();assert.equal(calls.length,1);assert.equal(calls[0].args.topic_name,'tema');assert.ok(!('user_id' in calls[0].args));
});
test('new activity is protected by own-or-admin RLS and server actor/time',()=>{
 const sql=fs.readFileSync('SQL_CAMPUS_SECTION_TRACKING.sql','utf8');assert.match(sql,/enable row level security/);assert.match(sql,/user_id=auth.uid\(\) or public.campus_is_admin\(\)/);assert.match(sql,/values\(event_id,auth.uid\(\)/);assert.match(sql,/revoke all .* from public,anon/);assert.match(sql,/on conflict\(id\) do nothing/);assert.doesNotMatch(sql,/disable row level|grant .* to anon;/);
});
