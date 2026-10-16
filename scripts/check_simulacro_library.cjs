const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),campus=fs.readFileSync(path.join(root,'campus.html'),'utf8'),source=fs.readFileSync(path.join(root,'script.js'),'utf8');
const start=campus.indexOf('<section id="simulacro-screen"'),html=campus.slice(start,campus.indexOf('</section>',start)+10).replace('simulacro-section hidden','simulacro-section');
const code=source.slice(source.indexOf('function startSimTimer()'),source.indexOf('function guardarEnHistorial('));
(async()=>{const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
page.on('request',r=>{const u=new URL(r.url());
 if(u.pathname==='/qa')return r.respond({contentType:'text/html',body:`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${['assets/mindmaps/fonts/outfit.css','styles.css','student-white.css','campus-theme.css','campus-topics.css','simulacro-library.css'].map(f=>'<link rel="stylesheet" href="/'+f+'">').join('')}</head><body><aside id="sidebar"></aside><div id="overlay"></div><main style="max-width:1100px;margin:auto;padding:24px">${html}</main><script>
 window.free=false;window.planVisits=0;window.CampusAccess={isFree:()=>free,unlock:()=>planVisits++};window.currentUser={id:'qa'};window.currentCampusScreen='simulacro-screen';window.simState={};window.toasts=[];window.showToast=m=>toasts.push(m);window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'qa'}}})}});window.campo=(r,k)=>r[k]??r[k.toUpperCase()];window.normalizeDbText=v=>String(v||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toUpperCase();window.showScreen=id=>currentCampusScreen=id;window.showSimScreen=id=>['sim-config','sim-exam','sim-result'].forEach(k=>document.getElementById(k).classList.toggle('hidden',k!==id));window.guardarEnHistorial=()=>{};window.guardarResultadoSimulacroEnNube=()=>{};window.confirm=()=>true;window.shuffleArray=r=>r;window.fetchAllBancoQuestions=async()=>{const r=await fetch('/content/banco_bibliografia_2026.json');return r.json()};window.bancoComentario=q=>(q.justificacion||q.comentario||'')+' Fuente: '+(q.fuente||'');window.goBack=()=>{};window.renderPastExamResult=()=>{};${code}</script><script src="/simulation-scope.js"></script><script src="/simulacro-ingreso.js"></script><script src="/simulacro-library.js"></script></body></html>`});
 if(u.pathname==='/api/simulation'){assert.equal(r.headers().authorization,'Bearer qa');requests.push(u.searchParams.get('id'));return r.respond({contentType:'application/json',body:fs.readFileSync(path.join(root,'api/_simulations',u.searchParams.get('id')+'.json'))});}
 if(u.pathname==='/api/past-exam'){assert.equal(r.headers().authorization,'Bearer qa');requests.push(u.searchParams.get('id'));return r.respond({contentType:'application/json',body:fs.readFileSync(path.join(root,'api/_past_exams',u.searchParams.get('id')+'.json'))});}
 const file=path.join(root,u.pathname.slice(1));if(fs.existsSync(file)&&fs.statSync(file).isFile())return r.respond({contentType:{'.js':'application/javascript','.json':'application/json','.css':'text/css','.woff2':'font/woff2','.ttf':'font/ttf','.png':'image/png'}[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});r.respond({status:404,body:''});
});
await page.setViewport({width:1440,height:1100});await page.goto('http://127.0.0.1:8771/qa');await page.evaluate(()=>openSimulacro());await page.waitForFunction(()=>document.querySelectorAll('#sim-library-list [data-exam-key]').length===8);
const out=path.join(root,'output/simulacro-library');fs.mkdirSync(out,{recursive:true});
assert.equal(await page.$('.sim-library-description'),null);assert.equal(await page.$('.sim-library-access'),null);
await page.type('#sim-library-search','Simulacro 2');assert.equal(await page.$$eval('[data-exam-key]',n=>n.length),1);
await page.$eval('#sim-library-search',n=>{n.value='';n.dispatchEvent(new Event('input'));});
for(const [scope,count] of [['first',1],['second',1],['final',6],['',8]]){await page.select('#sim-library-scope',scope);assert.equal(await page.$$eval('[data-exam-key]',n=>n.length),count);}
for(const width of [1440,390]){await page.setViewport({width,height:1100});await page.screenshot({path:path.join(out,'catalog-'+width+'.png'),fullPage:true});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
await page.evaluate(()=>{free=true;window.dispatchEvent(new Event('campus-access-change'));});
await page.click('[id="entrance-partial:first"] button');assert.equal(await page.evaluate(()=>planVisits),1);assert.equal(requests.length,0);
await page.evaluate(()=>{free=false;window.dispatchEvent(new Event('campus-access-change'));});
const entries=JSON.parse(fs.readFileSync(path.join(root,'content/simulacros-catalog.json'),'utf8')).entries;
for(const entry of entries){
 await page.evaluate(k=>{showSimScreen('sim-config');selectEntranceExam(k);return iniciarSimulacro();},entry.key);
 const result=await page.evaluate(()=>({count:simState.preguntas.length,counts:['MORFOFUNCION','BIOLOGIA CELULAR','SALUD PUBLICA'].map(s=>simState.preguntas.filter(q=>campo(q,'materia')===s).length),seconds:simState.secondsLeft,scope:simState.preguntas.map(q=>q.coverage)}));
 assert.equal(result.count,100);assert.deepEqual(result.counts,[50,30,20]);assert.ok(result.seconds>5990);
 const rules=require('../simulation-scope.js').rules[entry.scope];assert.ok(result.scope.every(c=>c.chapter>=rules[c.subject][0]&&c.chapter<=rules[c.subject][1]));
 await page.evaluate(()=>{simState.currentIdx=80;renderSimQuestion();});assert.equal(await page.$eval('#sim-exam-section',n=>n.textContent),'Educación para la Vida');
 await page.evaluate(()=>{simState.answers=simState.preguntas.map(q=>({selected:simAcceptedAnswerIndices(q)[0]}));finalizarSimulacro();});
 assert.match(await page.$eval('#sim-result-score',n=>n.textContent),/100 de 100 correctas.*100%/);
 assert.equal(await page.$$eval('#sim-review-list .sim-review-item',n=>n.length),100);
}
await page.evaluate(async()=>{showSimScreen('sim-config');selectEntranceExam('partial:second');await iniciarSimulacro();});
for(const width of [1440,390]){await page.setViewport({width,height:1100});await page.screenshot({path:path.join(out,'exam-'+width+'.png')});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
await page.evaluate(()=>{simState.answers=simState.preguntas.map(q=>({selected:simAcceptedAnswerIndices(q)[0]}));simState.endTimestamp=Date.now()-1000;});await page.waitForFunction(()=>simState.finalized);assert.equal(await page.evaluate(()=>simState.secondsLeft),0);
for(const width of [1440,390]){await page.setViewport({width,height:1100});await page.screenshot({path:path.join(out,'result-'+width+'.png')});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
assert.deepEqual(errors,[]);console.log('PASS: all eight launched models have 100 questions, actual 50/30/20, correct scope, 100/100 grading; clean cards; all/search/filter; access gates; mobile/desktop; strict timeout; no live writes.');

}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
