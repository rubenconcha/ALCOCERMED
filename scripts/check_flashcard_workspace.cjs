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
 // Visit every delivered official topic through the real library and real session controls.
 const audited=[],designAudit=[];
 for(const subject of ['MORFOFUNCION','BIOLOGIA CELULAR','SALUD PUBLICA']){
  await page.evaluate(s=>quickStartSubject(s),subject);
  const names=await page.$$eval('.library-topic-action',buttons=>buttons.map(n=>n.getAttribute('aria-label').replace(/^Empezar /,'')));
  for(const name of names){
   await page.evaluate(()=>backToStudyTopics());
   await page.click('[aria-label='+JSON.stringify('Empezar '+name)+']');
   await page.select('#flashcard-mode','all');
   const snapshot=await page.evaluate(()=>({size:deck.length,subject:deck.every(c=>normalizeDbText(campo(c,'materia'))===normalizeDbText(ultimaMateria)),sources:deck.filter(c=>c.source_reviewed).every(c=>c.fuente&&c.paginas_pdf),subtopics:document.getElementById('flashcard-subtopic').options.length-1}));
   assert.ok(snapshot.size>=20,name);assert.equal(snapshot.subject,true,name);assert.equal(snapshot.sources,true,name);assert.ok(snapshot.subtopics>=2,name);
   await page.evaluate(()=>{currentIndex=deck.reduce((best,c,i)=>String(campo(c,'respuesta')).length>String(campo(deck[best],'respuesta')).length?i:best,0);renderCard();});
   for(const width of [1440,390,320]){
    await page.setViewport({width,height:1100});
    const layout=await page.evaluate(()=>{
     const rect=s=>document.querySelector(s).getBoundingClientRect();
     const q=rect('#q-text'),f=rect('#card .front'),b=rect('#card .front .depth-brand'),w=rect('#card .front .fc-brand-wordmark'),label=rect('#card .front .card-face-label');
     return {fits:q.left>=f.left&&q.right<=f.right&&q.bottom<=f.bottom,headerClear:w.right<label.left,brandAbove:b.bottom<q.top,sourceHidden:!document.querySelector('#card .front .fc-answer-source'),overflow:document.documentElement.scrollWidth>innerWidth};
    });
    assert.equal(layout.fits,true,name+' question '+width);assert.equal(layout.headerClear,true,name+' brand '+width);assert.equal(layout.brandAbove,true,name+' question under brand '+width);assert.equal(layout.sourceHidden,true);assert.equal(layout.overflow,false);
    designAudit.push({subject,topic:name,width,...layout});
    if(name===names[0])await page.screenshot({path:path.join(folder,'question-'+subject.replaceAll(' ','-')+'-'+width+'.png')});
   }
   await page.click('#btn-reveal');await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('#card .back')).opacity)>0.999);
   for(const width of [1440,390]){
    await page.setViewport({width,height:1100});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,name+' '+width);
    assert.equal(await page.$eval('.back-text',n=>{n.scrollTop=n.scrollHeight;return n.querySelector('p').getBoundingClientRect().bottom<=n.getBoundingClientRect().bottom+2;}),true,name+' source '+width);
    if(name===names[0])await page.screenshot({path:path.join(folder,'expanded-'+subject.replaceAll(' ','-')+'-'+width+'.png')});
   }
   const options=await page.$$eval('#flashcard-subtopic option',nodes=>nodes.map(n=>n.value).filter(Boolean));
   await page.select('#flashcard-subtopic',options[options.length-1]);
   assert.ok(Number(await page.$eval('#card-total',n=>n.textContent))>0,name+' subtopic opens');
   audited.push({subject,topic:name,count:snapshot.size,subtopics:snapshot.subtopics});
  }
 }
 assert.equal(audited.length,68);fs.writeFileSync(path.join(folder,'all-topics.json'),JSON.stringify(audited,null,2));
 fs.writeFileSync(path.join(folder,'design-audit.json'),JSON.stringify(designAudit,null,2));
 await page.evaluate(()=>quickStartSubject('MORFOFUNCION'));
 const sensesName=await page.$$eval('.library-topic-action',nodes=>nodes.map(n=>n.getAttribute('aria-label').replace(/^Empezar /,'')).find(n=>/sentidos/.test(n)));
 await page.click('[aria-label='+JSON.stringify('Empezar '+sensesName)+']');await page.select('#flashcard-mode','all');
 const samples=await page.evaluate(()=>{
  const selected=new Map();
  deck.forEach((card,i)=>{currentIndex=i;renderCard();const art=document.querySelector('.fc-context-art');if(art&&!selected.has(art.textContent))selected.set(art.textContent,i);});
  const basilar=deck.findIndex(c=>/relación hay entre posición en la membrana basilar/.test(c.pregunta));
  if(basilar>=0)selected.set('membrana-basilar',basilar);
  return [...selected.entries()];
 });
 assert.ok(samples.length>=6,'six distinct sensory contexts');
 for(const [label,index] of samples){
  for(const width of [1440,390]){
   await page.setViewport({width,height:1100});await page.evaluate(index=>{currentIndex=index;renderCard();},index);
   await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('#card .front')).opacity)>.999);
   const art=await page.$eval('.fc-sense-illustration',n=>({position:n.style.backgroundPosition,background:getComputedStyle(n).backgroundImage}));
   assert.match(art.background,/sentidos-contexto.png/);
   const basename=label.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-');
   await page.screenshot({path:path.join(folder,'sentidos-'+basename+'-'+width+'.png')});
   await page.click('#btn-reveal');await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('#card .back')).opacity)>.999);
   assert.equal(await page.$eval('.back-text',n=>n.scrollTop),0,'a newly revealed answer starts at the top');
   assert.equal(await page.$eval('.fc-answer-lead',n=>getComputedStyle(n).textTransform),'none','preserve medical capitalization');
   await page.screenshot({path:path.join(folder,'sentidos-'+basename+'-respuesta-inicio-'+width+'.png')});
   await page.$eval('.back-text',n=>n.scrollTop=n.scrollHeight);
   await page.screenshot({path:path.join(folder,'sentidos-'+basename+'-respuesta-'+width+'.png')});
  }
 }
 await page.evaluate(()=>{FlashcardWorkspace.clear();currentUser={id:'another-account'};deck=[];});
 await page.click('#flashcard-shuffle');assert.equal(await page.evaluate(()=>deck.length),0,'cleared private cards cannot restart in another account');
 assert.deepEqual(errors,[]);
 console.log('PASS: all 68 official decks open with >=20 cards, correct subject and sources; subtopic controls, longest answers at 390/1440, logos; 51 due vs 52 total; browse preserves dates and cleared caches cannot cross accounts.');
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
