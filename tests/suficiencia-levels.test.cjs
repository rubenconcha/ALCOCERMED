const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const C=require('../suficiencia-core.js'),bank=require('../api/_sufficiency/bank.json');
const report=require('../api/_sufficiency/beginner-checks.json');
const fmt=n=>String(Number(Number(n).toFixed(6))).replace('.',',').replace('-','−');
const set=a=>'{'+[...new Set(a)].sort((a,b)=>a-b).join(', ')+'}';
const sum=a=>a.reduce((x,y)=>x+y,0),gcd=(a,b)=>b?gcd(b,a%b):a;

test('all 180 introductory answers match independent arithmetic from their recorded inputs',()=>{
 assert.equal(report.checks.length,180);
 const count={};
 for(const r of report.checks){
  const q=bank.questions.find(q=>q.id===r.id),d=r.inputs;assert.ok(q,r.id);assert.equal(q.difficulty,'facil');
  count[r.subject]=(count[r.subject]||0)+1;
  let value,unit='',text;
  if(r.subject==='matematicas')switch(r.family){
   case 'contar':value=new Set(d.values).size;break;
   case 'union':text=set([...d.A,...d.B]);break;
   case 'interseccion':text=set(d.A.filter(x=>d.B.includes(x)));break;
   case 'complemento':text=set(d.U.filter(x=>!d.A.includes(x)));break;
   case 'media':value=sum(d.values)/d.values.length;break;
   case 'dato-faltante':value=3*d.mean-d.a-d.b;break;
   case 'razon-directa':{const g=gcd(d.x,d.y);text=d.y/g===1?String(d.x/g):`${d.x/g}/${d.y/g}`;break;}
   case 'division-simple':text=(d.raw/d.divisor)+'x';break;
   case 'potencia-diez':value=d.coefficient*10**d.power;break;
   case 'multiplo':value=d.number*d.position;break;
   default:assert.fail(r.family);
  }
  else if(r.subject==='fisica')switch(r.family){
   case 'centimetros':value=d.cm/100;unit='m';break;
   case 'segundos':value=d.minutes*60;unit='s';break;
   case 'rapidez':value=d.distance/d.time;unit='m/s';break;
   case 'aceleracion':value=(d.finalVelocity-d.initialVelocity)/d.time;unit='m/s²';break;
   case 'fuerza':value=d.mass*d.acceleration;unit='N';break;
   case 'peso':value=d.mass*d.g;unit='N';break;
   case 'energia':value=d.mass*d.speed**2/2;unit='J';break;
   case 'onda':value=d.frequency*d.wavelength;unit='m/s';break;
   case 'carga':value=d.current*d.time;unit='C';break;
   case 'voltaje':value=d.current*d.resistance;unit='V';break;
   default:assert.fail(r.family);
  }
  else switch(r.family){
   case 'elementos':value=Object.keys(d.composition).length;break;
   case 'atomos-formula':value=sum(Object.values(d.composition));break;
   case 'masa-molar-basica':if(d.composition){value=sum(Object.entries(d.composition).map(([e,n])=>n*d.atomicMasses[e]));unit='g/mol';}else{value=d.moles*d.M;unit='g';}break;
   case 'moles-a-masa':value=d.moles*d.M;unit='g';break;
   case 'masa-a-moles':value=d.grams/d.M;unit='mol';break;
   case 'orbitales-basicos':value=d.orbitals*d.capacity;unit='electrones';break;
   case 'hgo-basico':value=d.hgoMoles/2;unit='mol de O₂';break;
   case 'agua-basica':value=d.acidMoles*2;unit='mol de H₂O';break;
   case 'mg-basico':value=d.magnesiumMoles;unit='mol de H₂';break;
   case 'unidades-formula':value=d.units*d.atomsPerUnit;unit='átomos';break;
   default:assert.fail(r.family);
  }
  const expected=text===undefined?fmt(value)+(unit?' '+unit:''):text;
  assert.equal(q.options[q.correct],expected,r.id);
  assert.equal(q.solution.answer,expected,r.id);
  assert.equal(q.source.original,false);assert.ok(q.source.parentId.startsWith('abp-'));
 }
 assert.deepEqual(count,{matematicas:60,fisica:60,quimica:60});
 assert.equal(new Set(report.checks.map(r=>r.subject+':'+r.family)).size,30);
});

test('every level paper contains only its stated difficulty and complete reading passages',()=>{
 const coverage=new Map(),combinations=new Set();
 for(const p of bank.levelPapers){
  const rows=C.select(bank,'simulacro:'+p.id,4);
  assert.equal(rows.length,p.questionCount);assert.equal(new Set(rows.map(q=>q.id)).size,rows.length);
  assert.ok(rows.every(q=>q.difficulty===p.difficulty),p.id);
  if(p.subject==='integral')for(const s of Object.keys(C.subjects))assert.equal(rows.filter(q=>q.subject===s).length,10);
  else{
   combinations.add(p.subject+':'+p.difficulty);
   assert.ok(rows.every(q=>q.subject===p.subject));
   for(const q of rows)coverage.set(q.id,(coverage.get(q.id)||0)+1);
  }
  for(const id of new Set(rows.filter(q=>q.subject==='lectura').map(q=>q.passageId))){
   assert.equal(rows.filter(q=>q.passageId===id).length,5);
   assert.equal(bank.passages.find(p=>p.id===id).difficulty,p.difficulty);
  }
 }
 assert.equal(combinations.size,12);assert.equal(coverage.size,980);assert.ok([...coverage.values()].every(n=>n===1));
 assert.equal(C.select(bank,'simulacro:nivel-matematicas-facil-01',0)[0].id,'basico-matematicas-contar-01');
});

test('level validation rejects mixed levels, duplicated questions, missing coverage and invalid time',()=>{
 for(const mutate of [
  b=>{b.levelPapers[0].difficulty='dificil';},
  b=>{b.levelPapers[0].questionIds[1]=b.levelPapers[0].questionIds[0];},
  b=>{b.levelPapers.shift();},
  b=>{b.levelPapers[0].minutes=0;},
  b=>{b.questions[0].difficulty='unknown';}
 ]){const broken=structuredClone(bank);mutate(broken);assert.equal(C.validate(broken),false);}
});

test('the catalogue defaults to easy mathematics and switches subject and level without reloading content',async()=>{
 const handlers={},storage=new Map();let loads=0;
 const root={innerHTML:'',classList:{contains:()=>false,add(){},remove(){}},addEventListener:(e,fn)=>{handlers[e]=fn;},replaceChildren(){this.innerHTML='';},scrollIntoView(){},querySelector:()=>null};
 const context={currentUser:{id:'levels-fixture'},document:{getElementById:()=>root,addEventListener(){}},location:{search:''},URLSearchParams,Uint32Array,AbortSignal,Date,
  crypto:{getRandomValues:a=>a},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setInterval:()=>1,clearInterval(){},setTimeout(){},
  showScreen:()=>true,ensureSupabaseSdk:async()=>{},fetch:async()=>{loads++;return{ok:true,json:async()=>structuredClone(bank)};}};
 context.window={SufficiencyCore:C,CampusAccess:{isFree:()=>false},addEventListener(){}};
 context.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{user:context.currentUser,access_token:'fixture'}}}),onAuthStateChange:()=>{}}});
 vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../suficiencia.js'),'utf8'),context);
 await context.window.Sufficiency.open();assert.match(root.innerHTML,/Elige la materia/);
 assert.match(root.innerHTML,/data-area="matematicas"[^>]*aria-pressed="true"/);
 assert.match(root.innerHTML,/data-level="facil"[^>]*aria-pressed="true"/);
 const click=(sf,extra={})=>handlers.click({target:{closest:()=>({disabled:false,dataset:{sf,...extra}})}});
 click('subject',{area:'quimica'});click('level',{level:'dificil'});
 assert.match(root.innerHTML,/data-area="quimica"[^>]*aria-pressed="true"/);
 assert.match(root.innerHTML,/data-level="dificil"[^>]*aria-pressed="true"/);
 assert.equal(loads,1);
 await click('run',{area:'simulacro:nivel-quimica-dificil-01'});
 const saved=JSON.parse(storage.get('alcocermed:suficiencia:v1:levels-fixture'));
 assert.ok(saved.ids.every(id=>bank.questions.find(q=>q.id===id).subject==='quimica'&&bank.questions.find(q=>q.id===id).difficulty==='dificil'));
 click('catalogue');assert.match(root.innerHTML,/data-area="quimica"[^>]*aria-pressed="true"/);
 assert.match(root.innerHTML,/data-level="dificil"[^>]*aria-pressed="true"/);
});
