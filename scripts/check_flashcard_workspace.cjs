const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const p=require('C:/Users/PC/AppData/Local/npm-cache/_npx/110f701c48e68d66/node_modules/puppeteer-core');
const root=path.resolve(__dirname,'..'),src=fs.readFileSync(path.join(root,'script.js'),'utf8'),html=fs.readFileSync(path.join(root,'campus.html'),'utf8');
const slice=(a,b)=>src.slice(src.indexOf(a),src.indexOf(b,src.indexOf(a)));
const section=id=>{const m=html.match(new RegExp('<section[^>]*id="'+id+'"'));if(!m)throw Error(id);const n=m.index;return html.slice(n,html.indexOf('</section>',n)+10);};
const seed=JSON.parse(fs.readFileSync(path.join(root,'content/flashcards_morfo_2026.json'))).groups.find(g=>g.tema==='tejido nervioso').cards.map(([pregunta,respuesta],i)=>({id:900+i,materia:'MORFOFUNCION',tema:'tejido nervioso',pregunta,respuesta}));
(async()=>{const b=await p.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--no-sandbox']});
 try{const page=await b.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setRequestInterception(true);
 page.on('request',r=>{const u=new URL(r.url());
  if(u.pathname==='/qa-flashcards')return r.respond({contentType:'text/html',body:`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${['assets/mindmaps/fonts/outfit.css','styles.css','student-white.css','campus-theme.css','campus-topics.css','study-depth.css','flashcard-workspace.css'].map(f=>'<link rel="stylesheet" href="/'+f+'">').join('')}</head><body><aside id="sidebar"></aside><div id="overlay"></div><main style="max-width:1050px;margin:auto;padding:20px">${section('study-library')}${section('study-area')}</main><script>
  window.free=false;window.CampusAccess={isFree:()=>free};window.currentUser={id:'qa-user'};window.deck=[];window.currentIndex=0;window.flashcardTopicCards=[];window.flashcardReviewTimer=null;window.flashcardRatingPending=false;window.currentCampusScreen='study-library';window.flashcardsCache=null;window.ultimaMateria='';window.temasVistos=new Set();window.totalReviews=0;window.DAILY_GOAL=20;
  window.normalizeDbText=v=>String(v||'').normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').toUpperCase().trim();window.campo=(r,k)=>r[k]??r[k.toUpperCase()]??'';window.shuffleArray=a=>a;
  window.showScreen=id=>{currentCampusScreen=id;for(const s of ['study-library','study-area'])document.getElementById(s).classList.toggle('hidden',s!==id);};window.actualizarProgreso=()=>{};window.showToast=()=>{};window.playFlashcardRatingSound=()=>{};window.incrementDailyCount=()=>1;window.updateStreak=()=>{};window.sincronizarFlashcardsEnNube=()=>{throw Error('No live persistence allowed');};
  window.getSupabase=()=>({auth:{getSession:async()=>({data:{session:{access_token:'qa'}}})},from:()=>({select:()=>({order:()=>({range:async()=>({data:${JSON.stringify(seed)},error:null})})})})});
  ${slice('async function loadFlashcards()','\nwindow.toggleMenu')}
  ${slice('function startDeck(','const SRS_INTERVALS =')}
  ${slice('const SRS_INTERVALS =','const DAILY_GOAL =')}
  ${slice('window.rateCard =','function actualizarProgreso()')}
  document.getElementById('btn-reveal').onclick=()=>{document.getElementById('card').classList.add('flipped');document.getElementById('btn-reveal').classList.add('hidden');document.getElementById('anki-buttons').classList.remove('hidden');};
  </script><script src="/study-depth.js"></script><script src="/student-library.js"></script><script src="/flashcard-workspace.js"></script></body></html>`});
  if(u.pathname==='/api/mindmap'){assert.equal(r.headers().authorization,'Bearer qa');return r.respond({contentType:'application/json',body:fs.readFileSync(path.join(root,'api/_mindmaps',u.searchParams.get('id')+'.json'))});}
  const f=path.join(root,u.pathname.slice(1));if(fs.existsSync(f)&&fs.statSync(f).isFile())return r.respond({contentType:{'.js':'application/javascript','.css':'text/css','.png':'image/png','.woff2':'font/woff2','.ttf':'font/ttf'}[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});r.respond({status:404,body:''});
 });
 const folder=path.join(root,'output/flashcard-workspace');fs.mkdirSync(folder,{recursive:true});await page.setViewport({width:1440,height:1150});await page.goto('http://127.0.0.1:8771/qa-flashcards');
 await page.evaluate(()=>openStudyLibrary());await page.click('[data-subject="MORFOFUNCION"]');await page.waitForSelector('.library-topic-row');
 assert.match(await page.$eval('#library-topics',n=>n.innerText),/52 tarjetas en el tema/);
 await page.screenshot({path:path.join(folder,'library-desktop.png')});
 await page.click('[aria-label="Empezar tejido nervioso"]');assert.equal(await page.$eval('#card-total',n=>n.textContent), '52');
 assert.match(await page.$eval('#flashcard-inventory',n=>n.textContent),/52 tarjetas en el tema/);
 // Preserve one future review, then prove browse mode neither hides it nor writes a review.
 await page.evaluate(()=>saveSrs(deck[0],86400000));
 await page.select('#flashcard-mode','all');assert.equal(await page.$eval('#card-total',n=>n.textContent),'52');
 const saved=await page.evaluate(()=>JSON.stringify({...localStorage}));
 await page.evaluate(()=>rateCard(2));assert.equal(await page.evaluate(()=>JSON.stringify({...localStorage})),saved);
 await page.select('#flashcard-subtopic','Potencial de acción');assert.equal(await page.$eval('#card-total',n=>n.textContent),'9');
 for(const width of [1440,390]){
  await page.setViewport({width,height:1100});
  await page.select('#flashcard-subtopic','Organización neuronal');await page.click('#btn-reveal');await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('#card .front')).opacity)<0.001&&Number(getComputedStyle(document.querySelector('#card .back')).opacity)>0.999);
  assert.equal(await page.$$eval('.depth-brand',n=>n.length),2);
  assert.equal(await page.$eval('.anki-rating-row',n=>getComputedStyle(n).display),'none');
  await page.screenshot({path:path.join(folder,`answer-${width}.png`)});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await page.$eval('.back-text',n=>{n.scrollTop=n.scrollHeight;return n.querySelector('p').getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom+2;}),true);
 }
 await page.select('#flashcard-subtopic','');await page.select('#flashcard-mode','due');assert.equal(await page.$eval('#card-total',n=>n.textContent),'51');
 await page.click('#btn-reveal');assert.notEqual(await page.$eval('.anki-rating-row',n=>getComputedStyle(n).display),'none');
 assert.equal(await page.evaluate(()=>totalReviews),0);
 await page.evaluate(()=>{FlashcardWorkspace.clear();currentUser={id:'another-account'};deck=[];});
 await page.click('#flashcard-shuffle');assert.equal(await page.evaluate(()=>deck.length),0,'cleared private cards cannot restart in another account');
 assert.deepEqual(errors,[]);
 console.log('PASS: real library shows 52, subject/subtopic filters, 51 due vs 52 total, browse keeps saved dates, original IDs, desktop/mobile layout, logos and readable answers.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
