const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const puppeteer=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),script=fs.readFileSync(path.join(root,'script.js'),'utf8'),campus=fs.readFileSync(path.join(root,'campus.html'),'utf8');
const slice=(start,end)=>script.slice(script.indexOf(start),script.indexOf(end,script.indexOf(start)));
const section=id=>{const start=campus.indexOf('<section id="'+id+'"');return campus.slice(start,campus.indexOf('</section>',start)+10);};
(async()=>{
 const browser=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
  page.on('request',r=>{
   const url=new URL(r.url());
   if(url.pathname==='/qa')return r.respond({contentType:'text/html',body:`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/study-depth.css"></head><body><main style="max-width:1000px;margin:auto;padding:16px">${section('study-area')}${section('banco-screen')}</main><script>
    window.free=false;window.CampusAccess={isFree:()=>free};window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'qa'}}})},from:()=>({select:()=>({order:()=>({range:async()=>({data:[],error:null})})})})});
    window.campo=(r,k)=>r[k]??r[k.toUpperCase()];window.flashcardsCache=null;window.bancoState={_cache:[],preguntas:[],answers:[],currentIdx:0};window.simState={};window.deck=[];window.currentIndex=0;
    window.actualizarProgreso=()=>{};window.renderBqDificultad=()=>{};window.updateBqCircles=()=>{};
    ${slice('async function loadFlashcards()','\nwindow.toggleMenu')}
    ${slice('let bancoQuestionsPromise = null;','async function preloadAppData()')}
    ${slice('function renderCard()','const SRS_INTERVALS')}
    ${slice('function renderBancoQuestion()','function selectBancoAnswer')}
    </script><script src="/study-depth.js"></script></body></html>`});
   if(url.pathname==='/api/mindmap'){assert.equal(r.headers().authorization,'Bearer qa');return r.respond({contentType:'application/json',body:fs.readFileSync(path.join(root,'api/_mindmaps',url.searchParams.get('id')+'.json'))});}
   const file=path.join(root,url.pathname.slice(1));if(fs.existsSync(file)&&fs.statSync(file).isFile())return r.respond({contentType:path.extname(file)==='.js'?'application/javascript':'text/css',body:fs.readFileSync(file)});r.respond({status:404,body:''});
  });
  fs.mkdirSync(path.join(root,'output/study-depth-qa'),{recursive:true});await page.goto('http://127.0.0.1:8771/qa');
  await page.evaluate(async()=>{deck=await loadFlashcards();bancoState.preguntas=await fetchAllBancoQuestions();});
  assert.equal(await page.evaluate(()=>deck.length),30);assert.equal(await page.evaluate(()=>bancoState.preguntas.length),18);
  for(const width of [1440,390]){
   await page.setViewport({width,height:1000});
   for(const index of [0,10,20]){
    await page.evaluate(index=>{currentIndex=index;document.getElementById('card-total').textContent=deck.length;document.getElementById('card-tema-name').textContent=deck[index].tema;document.getElementById('study-area').classList.remove('hidden');document.getElementById('banco-screen').classList.add('hidden');renderCard();document.getElementById('card').classList.add('flipped');},index);
    await new Promise(r=>setTimeout(r,600));assert.ok((await page.$eval('#a-text',n=>n.textContent)).includes('Fuente: Saladin'));
    await page.screenshot({path:path.join(root,'output/study-depth-qa',`flashcard-${index}-${width}.png`)});
    assert.equal(await page.$eval('.depth-card .back-text',n=>{n.scrollTop=n.scrollHeight;return n.querySelector('p').getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom+1;}),true,'the source at the end of long answers can be reached by scrolling');
   }
   for(let index=0;index<18;index++){
    await page.evaluate(index=>{document.getElementById('study-area').classList.add('hidden');document.getElementById('banco-screen').classList.remove('hidden');document.getElementById('banco-selector').classList.add('hidden');document.getElementById('banco-quiz').classList.remove('hidden');bancoState.currentIdx=index;bancoState.answers[index]={selected:0};renderBancoQuestion();document.getElementById('bq-comentario-body').classList.remove('hidden');},index);
    assert.equal(await page.$$eval('#bq-options button',n=>n.length),4);assert.ok((await page.$eval('#bq-comentario-text',n=>n.textContent)).includes('D. '));
    assert.equal(await page.$eval('.bq-option-text',n=>getComputedStyle(n).textTransform),'none');
    if(index===0||index===6)await page.screenshot({path:path.join(root,'output/study-depth-qa',`bank-${index}-${width}.png`)});
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  assert.deepEqual(errors,[]);console.log('PASS: main flashcard and bank renderers, 30 cards/18 questions, both chapters, desktop/mobile, all four feedback explanations.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
