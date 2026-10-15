const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const prefix=process.argv[2]||'blood';
const root=path.resolve(__dirname,'..'),campus=fs.readFileSync(path.join(root,'campus.html'),'utf8'),source=fs.readFileSync(path.join(root,'script.js'),'utf8');
const start=campus.indexOf('<section id="simulacro-screen"'),html=campus.slice(start,campus.indexOf('</section>',start)+10).replace('simulacro-section hidden','simulacro-section');
const code=source.slice(source.indexOf('function startSimTimer()'),source.indexOf('function guardarEnHistorial('));
(async()=>{const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
try{const page=await browser.newPage(),errors=[];let requests=0;page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
page.on('request',r=>{const u=new URL(r.url());
 if(u.pathname==='/qa')return r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"></head><body><main style="width:100%;box-sizing:border-box;padding:16px"><img src="/promo-ben-carson-tiktok/public/authentic/logo.png" alt="Preparatoria Ben Carson" style="width:60px">${html}</main><script>window.free=true;window.planVisits=0;window.CampusAccess={isFree:()=>free,unlock:()=>planVisits++};window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'qa'}}})}});window.simState={};window.showToast=m=>{throw Error(m)};window.campo=(r,k)=>r[k]??r[k.toUpperCase()];window.normalizeDbText=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();window.showSimScreen=id=>['sim-config','sim-exam','sim-result'].forEach(k=>document.getElementById(k).classList.toggle('hidden',k!==id));window.guardarEnHistorial=()=>{};window.guardarResultadoSimulacroEnNube=()=>{};window.confirm=()=>true;window.bancoComentario=q=>q.justificacion+' Fuente: '+q.fuente;${code}</script><script src="/study-assessments.js"></script><script src="/simulacro-ingreso.js"></script></body></html>`});
 if(u.pathname==='/api/mindmap'){requests++;assert.equal(r.headers().authorization,'Bearer qa');return r.respond({contentType:'application/json',body:fs.readFileSync(path.join(root,'api/_mindmaps',u.searchParams.get('id')+'.json'))});}
 const file=path.join(root,u.pathname.slice(1));if(fs.existsSync(file)&&fs.statSync(file).isFile())return r.respond({contentType:{'.js':'application/javascript','.css':'text/css','.png':'image/png'}[path.extname(file)]||'text/plain',body:fs.readFileSync(file)});r.respond({status:404,body:''});
});
await page.goto('http://127.0.0.1:8771/qa');await page.evaluate(k=>startTopicAssessment(k),prefix+'-depth-simulation');assert.equal(requests,0);assert.equal(await page.evaluate(()=>planVisits),1);await page.evaluate(()=>free=false);
const out=path.join(root,'output/study-depth-qa/independent-assessments',prefix);fs.mkdirSync(out,{recursive:true});
for(const width of [1440,390])for(const kind of ['simulation','evaluation']){
 await page.setViewport({width,height:1000});await page.evaluate(()=>showSimScreen('sim-config'));await page.evaluate(k=>selectEntranceExam(k),prefix+'-depth-'+kind);await page.click('#sim-start-btn');await page.waitForSelector('#sim-options button');
 assert.equal(await page.evaluate(()=>simState.secondsLeft<=480&&simState.secondsLeft>470),true);assert.equal(await page.$$eval('#sim-options button',n=>n.length),4);assert.equal(await page.$$eval('#sim-review-list .sim-review-item',n=>n.length),0);
 await page.screenshot({path:path.join(out,kind+'-exam-'+width+'.png')});
 for(let i=0;i<5;i++){await page.evaluate(i=>simGoTo(i),i);const answer=await page.evaluate(i=>{const q=simState.preguntas[i];return i<3?'ABCD'.indexOf(q.respuesta_correcta):('ABCD'.indexOf(q.respuesta_correcta)+1)%4;},i);await page.click('#sim-options button:nth-child('+(answer+1)+')');}
 await page.evaluate(()=>finalizarSimulacro());assert.match(await page.$eval('#sim-result-score',n=>n.textContent),/3 de 6 correctas.*50%/);assert.equal(await page.$$eval('#sim-review-list .sim-review-item',n=>n.length),6);
 assert.equal(await page.$$eval('.sim-rev-justif span',nodes=>nodes.every(n=>n.textContent.includes('A. ')&&n.textContent.includes('D. ')&&n.textContent.includes('Fuente:'))),true);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:path.join(out,kind+'-result-'+width+'.png')});
}
assert.deepEqual(errors,[]);console.log('PASS: free lock, authenticated independent sets, actual timer, answer selection, 3/6 scoring with wrong/unanswered items, complete final review, desktop/mobile.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});
