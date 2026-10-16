/* Intocables keeps metadata public and full sheets/lessons behind their existing access checks. */
window.IntocablesHub = (() => {
 let catalogue=[],lessons=new Map(),subject='',topic='',query='',format='sheets',initialized=false,requestId=0;
 let coverRevision=0,coverOwner=null,observer=null;const covers=new Map(),pending=new Set();
 const subjects=['Morfofunción','Biología celular','Educación para la Salud'];
 const $=id=>document.getElementById(id);
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const normal=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 function clearCovers(){coverRevision++;observer?.disconnect();observer=null;for(const url of covers.values())URL.revokeObjectURL(url);covers.clear();pending.clear();coverOwner=null;document.querySelectorAll('.itc-sheet-cover img[data-sheet-id]').forEach(img=>{img.removeAttribute('src');img.hidden=true;});}
 async function showCovers(){
  observer?.disconnect();if(window.CampusAccess?.isFree()||format!=='sheets')return;
  const revision=coverRevision,session=(await getSupabase().auth.getSession()).data.session,token=session?.access_token;if(!token||revision!==coverRevision||window.CampusAccess?.isFree())return;
  if(coverOwner&&coverOwner!==token){clearCovers();return;}coverOwner=token;
  const paint=(id,url)=>document.querySelectorAll('img[data-sheet-id]').forEach(img=>{if(img.dataset.sheetId===id){img.src=url;img.hidden=false;}});
  const fetchCover=async id=>{
   if(covers.has(id)){paint(id,covers.get(id));return;}if(pending.has(id))return;pending.add(id);
   try{
    const response=await fetch('/api/mindmap?id='+encodeURIComponent(id)+'&format=image',{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(15000)});if(!response.ok)return;
    const blob=await response.blob(),current=(await getSupabase().auth.getSession()).data.session;
    if(revision!==coverRevision||coverOwner!==token||current?.access_token!==token||window.CampusAccess?.isFree())return;
    const url=URL.createObjectURL(blob);covers.set(id,url);paint(id,url);
   }catch(_){/* Sheet opening remains available if a cover fails. */}finally{if(revision===coverRevision)pending.delete(id);}
  };
  const imgs=[...document.querySelectorAll('img[data-sheet-id]')];
  if(window.IntersectionObserver){
   // Observe the visible wrapper; hidden images do not intersect.
   observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){observer.unobserve(e.target);fetchCover(e.target.dataset.coverId);}}),{rootMargin:'240px'});document.querySelectorAll('[data-cover-id]').forEach(el=>observer.observe(el));
  }else imgs.forEach(img=>fetchCover(img.dataset.sheetId));
 }
 function topics(){const names=[...new Set(catalogue.filter(i=>i.kind===format&&(!subject||i.materia===subject)).map(i=>i.tema))];$('itc-topic').innerHTML='<option value="">Todos los temas</option>'+names.map(n=>`<option value="${esc(n)}">${esc(n)}</option>`).join('');$('itc-topic').value=topic;}
 function status(m){$('itc-status').hidden=!m;$('itc-status').textContent=m||'';}
 function render(){
  $('itc-subjects').innerHTML=['Todas',...subjects].map((n,i)=>{const v=i?n:'';return `<button type="button" data-subject="${esc(v)}" class="${subject===v?'active':''}" aria-pressed="${subject===v}">${esc(n)}</button>`;}).join('');topics();
  const filtered=catalogue.filter(i=>i.kind===format&&(!subject||i.materia===subject)&&(!topic||i.tema===topic)&&normal([i.titulo,i.tema,i.materia].join(' ')).includes(normal(query)));
  $('itc-count').textContent=filtered.length+' '+(format==='sheets'?'láminas':'fichas');
  $('itc-grid').innerHTML=filtered.length?filtered.map(i=>{const locked=!i.acceso_gratis&&window.CampusAccess?.isFree(),sheet=i.kind==='sheets';
   const cover=sheet?`<span class="itc-sheet-cover" data-cover-id="${esc(i.id)}"><span class="itc-cover-placeholder"><img src="/promo-ben-carson-tiktok/public/authentic/logo.png" alt=""><span>${locked?'Lámina protegida':'Lámina ilustrada'}</span></span><img data-sheet-id="${esc(i.id)}" alt="Vista de ${esc(i.titulo)}" hidden></span>`:'';
   return `<button type="button" class="itc-card ${sheet?'itc-sheet-card ':''}${locked?'is-locked':''}" data-id="${esc(i.id)}" aria-label="${locked?'Bloqueado: ':''}${esc(i.titulo)}">${cover}<span class="itc-card-top"><span class="itc-number">${sheet?'LÁMINA':String(i.orden).padStart(2,'0')}</span><span class="itc-card-symbol" aria-hidden="true">${locked?'🔒':'↗'}</span></span><span class="itc-card-middle"><span class="itc-card-subject">${esc(i.materia)}</span><strong>${esc(i.titulo)}</strong><span class="itc-card-topic">${esc(i.tema)}</span></span><span class="itc-card-bottom">${locked?'Disponible con un plan':sheet?'Abrir lámina':lessons.has(i.id)?'Abrir ficha':'Cargando ficha'} <span aria-hidden="true">→</span></span></button>`;}).join(''):'<div class="itc-empty">No hay material con estos filtros. Prueba con otro tema.</div>';
  showCovers().catch(()=>{});
 }
 async function load(){const current=++requestId;status('Cargando material…');try{
  if(!catalogue.length){const response=await fetch('/content/intocables_catalogo_2026.json',{cache:'no-store'});if(!response.ok)throw Error();const cards=await response.json();catalogue=cards.map(i=>({...i,kind:'cards'})).concat((window.MINDMAP_PREMIUM_CATALOG||[]).filter(m=>m.curated||m.section==='intocables').map((m,i)=>({...m,kind:'sheets',tema:m.id.startsWith('morfo_18_sangre__')?'Sangre':m.tema,orden:i+1,original:m})));}
  if(current!==requestId)return;render();if(format==='sheets'){status('');return;}
  await ensureSupabaseSdk();const {data,error}=await getSupabase().from('intocables_esenciales').select('*').order('orden');if(error)throw error;if(current!==requestId)return;lessons=new Map((data||[]).map(i=>[i.id,i]));status(lessons.size?'':'Inicia sesión para leer las fichas disponibles.');render();
 }catch(_){if(current===requestId){status('No pudimos cargar este material. Comprueba tu conexión y vuelve a entrar.');render();}}}
 function openSheet(id){const meta=(window.MINDMAP_PREMIUM_CATALOG||[]).find(m=>m.id===id&&(m.curated||m.section==='intocables'));if(!meta)return;if(window.CampusAccess?.isFree())return window.CampusAccess.unlock();return window.openMmLightbox({...meta,section:'intocables',format:'illustrated-sheet'});}
 function openLesson(id){const meta=catalogue.find(i=>i.id===id);if(!meta)return;if(!meta.acceso_gratis&&window.CampusAccess?.isFree())return window.CampusAccess.unlock();if(meta.kind==='sheets')return openSheet(id);const item=lessons.get(id);if(!item){status('La ficha aún no está disponible. Vuelve a intentarlo.');load();return;}
  $('itc-dialog-kicker').textContent=item.materia+' · '+item.tema;$('itc-dialog-title').textContent=item.titulo;for(const [id,key] of [['itc-key','clave'],['itc-explain','explicacion'],['itc-mistake','error_comun'],['itc-question','pregunta'],['itc-answer','respuesta']])$(id).textContent=item[key];$('itc-answer').hidden=true;$('itc-reveal').hidden=false;$('itc-source').textContent='Referencia: '+item.fuente;$('itc-dialog').showModal();
 }
 function init(){if(initialized)return;initialized=true;
  $('itc-formats').addEventListener('click',e=>{const b=e.target.closest('[data-format]');if(!b)return;format=b.dataset.format;topic='';$('itc-formats').querySelectorAll('button').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));load();});
  $('itc-subjects').addEventListener('click',e=>{const b=e.target.closest('[data-subject]');if(b){subject=b.dataset.subject;topic='';render();}});$('itc-topic').addEventListener('change',e=>{topic=e.target.value;render();});$('itc-search').addEventListener('input',e=>{query=e.target.value.trim();render();});$('itc-grid').addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(b)openLesson(b.dataset.id);});
  $('itc-close').onclick=()=>$('itc-dialog').close();$('itc-dialog').onclick=e=>{if(e.target===$('itc-dialog'))$('itc-dialog').close();};$('itc-reveal').onclick=()=>{$('itc-answer').hidden=false;$('itc-reveal').hidden=true;};
  window.addEventListener('campus-access-change',()=>{++requestId;lessons.clear();clearCovers();$('itc-dialog').close();['itc-key','itc-explain','itc-mistake','itc-question','itc-answer','itc-source'].forEach(id=>$(id).textContent='');if(!$('intocables-hub-screen').classList.contains('hidden'))load();});
  new MutationObserver(()=>{if($('intocables-hub-screen').classList.contains('hidden'))clearCovers();}).observe($('intocables-hub-screen'),{attributes:true,attributeFilter:['class']});
 }
 function open(){init();render();return load();}
 return {open,openSheet};
})();
