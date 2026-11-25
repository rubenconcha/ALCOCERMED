'use strict';
(function(root) {
 const reactions = [ ['like','👍','Me gusta'], ['love','♥','Me encanta'], ['fun','😄','Me divierte'], ['excellent','⭐','Excelente'] ];
 function coverageTracker() {
  let previous = null, duration = 0, ranges = [];
  return { observe(seconds, total) {
   seconds = Number(seconds); total = Number(total);
   if (!Number.isFinite(seconds) || !Number.isFinite(total) || total <= 0 || seconds < 0 || seconds > total+1) return this.percent();
   duration = total;
   if (previous !== null && seconds > previous && seconds-previous <= 5) {
    ranges.push([previous, Math.min(seconds,total)]);
    ranges.sort((a,b)=>a[0]-b[0]);
    const merged = [];
    ranges.forEach(r => { const last=merged[merged.length-1]; if(last && r[0]<=last[1]) last[1]=Math.max(last[1],r[1]); else merged.push([...r]); });
    ranges = merged;
   }
   previous = seconds;
   return this.percent();
  }, percent() { return duration ? Math.min(100,Math.floor(ranges.reduce((sum,r)=>sum+r[1]-r[0],0)/duration*100)) : 0; } };
 }
 function playerMessage(event,frame,url) {
  try {
   const parsed=new URL(url);
   if(parsed.protocol!=='https:' || !['player.mediadelivery.net','iframe.mediadelivery.net'].includes(parsed.hostname) || event.origin!==parsed.origin || event.source!==frame.contentWindow) return null;
   const message=typeof event.data==='string'?JSON.parse(event.data):event.data;
   return message?.context==='player.js'?message:null;
  } catch(_){return null;}
 }
 const api={reactions,coverageTracker,playerMessage};
 if(typeof module!=='undefined' && module.exports)module.exports=api;
 root.VideoCommunity=api;
 if(typeof document==='undefined')return;
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!=null)n.textContent=text;if(cls)n.className=cls;return n;};
 const button=(text,fn,cls)=>{const n=el('button',text,cls);n.type='button';n.onclick=fn;return n;};
 const date=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?'':d.toLocaleString('es-BO',{dateStyle:'medium',timeStyle:'short'});};
 let active=null, adminRequest=0;
 api.close=()=>{active?.dispose();active=null;};
 api.mount=function({host,sb,user,videoId,isCurrent,frame,playerUrl}) {
  api.close();
  const panel=el('section',null,'vc-community');panel.setAttribute('aria-label','Reacciones y comentarios de la videoclase');host.append(panel);
  const controller=new AbortController(); let disposed=false, mine=null, busy=false, commentsBusy=false, offset=0, commentsRequest=0, counts={}, shown=new Set();
  const alive=()=>!disposed && isCurrent();
  const request=q=>typeof q.abortSignal==='function'?q.abortSignal(controller.signal):q;
  const title=el('h4','¿Qué te pareció esta clase?');
  const row=el('div',null,'vc-reactions');row.setAttribute('role','group');row.setAttribute('aria-label','Tu reacción a la clase');
  const status=el('p','', 'vc-community-status');status.setAttribute('role','status');
  const retry=button('Reintentar',()=>{status.textContent='';retry.hidden=true;loadReactions();loadComments(true);},'vc-community-link');retry.hidden=true;
  const note=el('p','Solo dentro de la plataforma. Tus compañeros verán tu nombre en los comentarios.','vc-community-note');
  const heading=el('h4','Conversación de la clase');
  const form=el('form',null,'vc-comment-form'), label=el('label','Comparte qué aprendiste o deja una pregunta');label.htmlFor='vc-community-comment';
  const input=el('textarea');input.id='vc-community-comment';input.rows=2;input.maxLength=1500;input.required=true;input.placeholder='Escribe tu comentario…';
  const submit=el('button','Publicar comentario','vc-comment-submit');submit.type='submit';
  const list=el('div',null,'vc-comment-list');list.setAttribute('aria-live','polite');
  const more=button('Ver más comentarios',()=>loadComments(false),'vc-community-link');more.hidden=true;
  panel.append(title,row,status,retry,note,heading,form,list,more);form.append(label,input,submit);
  function fail(message){if(!alive())return;status.textContent=message;retry.hidden=false;}
  function drawReactions(){
   row.replaceChildren(...reactions.map(([key,icon,text])=>{
    const b=button('',()=>react(key),'vc-reaction');b.setAttribute('aria-pressed',String(key===mine));b.disabled=busy;
    const symbol=el('span',icon,'vc-reaction-icon');symbol.setAttribute('aria-hidden','true');
    b.append(symbol,el('span',text),el('span',String(counts[key]||0),'vc-reaction-count'));return b;
   }));
  }
  async function loadReactions(){
   try {const {data,error}=await request(sb.rpc('campus_video_reaction_summary',{p_video:videoId}));if(!alive())return;if(error)throw error;
    counts=data?.counts||{};mine=data?.mine||null;drawReactions();
   }catch(_){fail('No pudimos cargar las reacciones. Puedes reintentar.');}
  }
  async function react(key){
   if(!alive()||busy)return;busy=true;drawReactions();status.textContent='';retry.hidden=true;
   try {
    const old=mine;const {error}=await request(old===key?sb.from('campus_video_reactions').delete().eq('video_id',videoId).eq('user_id',user.id):
     sb.from('campus_video_reactions').upsert({video_id:videoId,user_id:user.id,reaction:key},{onConflict:'video_id,user_id'}));
    if(!alive())return;if(error)throw error;
    if(old)counts[old]=Math.max(0,(counts[old]||0)-1);mine=old===key?null:key;if(mine)counts[mine]=(counts[mine]||0)+1;
    status.textContent=mine?'Tu reacción quedó guardada.':'Quitaste tu reacción.';
    await loadReactions();
   }catch(_){fail('No se guardó tu reacción. Intenta de nuevo.');}finally{if(alive()){busy=false;drawReactions();}}
  }
  function commentNode(comment){
   const article=el('article',null,'vc-comment');article.append(el('strong',comment.author_name||'Estudiante'),el('time',date(comment.created_at)),el('p',comment.body));
   if(comment.user_id===user.id){article.append(button('Eliminar',async()=>{
    if(!alive()||commentsBusy)return;commentsBusy=true;
    try {const {error}=await request(sb.from('campus_video_comments').delete().eq('id',comment.id).eq('user_id',user.id));if(!alive())return;if(error)throw error;await loadComments(true);}
    catch(_){fail('No pudimos eliminar el comentario.');}finally{commentsBusy=false;}
   },'vc-community-link'));}
   return article;
  }
  async function loadComments(reset){
   const sequence=++commentsRequest, start=reset?0:offset;more.disabled=true;
   try {const {data,error}=await request(sb.from('campus_video_comments').select('id,user_id,author_name,body,created_at').eq('video_id',videoId).order('created_at',{ascending:false}).order('id',{ascending:false}).range(start,start+19));
    if(!alive()||sequence!==commentsRequest)return;if(error)throw error;
    if(reset){list.replaceChildren();shown=new Set();}const rows=data||[];
    rows.forEach(c=>{if(!shown.has(c.id)){shown.add(c.id);list.append(commentNode(c));}});offset=start+rows.length;
    if(!shown.size)list.append(el('p','Sé el primero en comentar.','vc-community-note'));more.hidden=rows.length<20;
   }catch(_){fail('No pudimos cargar los comentarios. Puedes reintentar.');}finally{if(alive()&&sequence===commentsRequest)more.disabled=false;}
  }
  form.onsubmit=async e=>{
   e.preventDefault();const body=input.value.trim();if(!alive()||commentsBusy||!body||body.length>1500)return;
   commentsBusy=true;submit.disabled=true;status.textContent='';retry.hidden=true;
   try {const {error}=await request(sb.from('campus_video_comments').insert({video_id:videoId,user_id:user.id,body}));if(!alive())return;if(error)throw error;
    input.value='';status.textContent='Comentario publicado.';await loadComments(true);
   }catch(_){fail('No se publicó tu comentario. Tu texto sigue aquí para reintentar.');}finally{if(alive()){commentsBusy=false;submit.disabled=false;}}
  };
  const coverage=coverageTracker();let saved=-1, writing=false, pending=0, progressError=false;
  async function saveProgress(pct){
   pending=Math.max(pending,pct);if(writing||!alive()||pending<=saved)return;writing=true;
   const sent=pending;
   try{const {error}=await request(sb.rpc('campus_record_video_activity',{p_video:videoId,p_progress:sent}));if(error)throw error;saved=sent;progressError=false;}
   catch(_){if(alive()&&!progressError){status.textContent='No pudimos sincronizar el progreso. Las reacciones y comentarios siguen disponibles.';progressError=true;}}
   finally{writing=false;if(alive()&&saved>=sent&&pending>saved)saveProgress(pending);}
  }
  function subscribe(){
   let origin;try{origin=new URL(playerUrl).origin;}catch(_){return;}
   if(!['https://player.mediadelivery.net','https://iframe.mediadelivery.net'].includes(origin))return;
   for(const name of ['timeupdate','ended'])frame.contentWindow?.postMessage(JSON.stringify({context:'player.js',version:'0.0.11',method:'addEventListener',value:name,listener:'alcocermed-community-'+name}),origin);
  }
  frame?.addEventListener('load',subscribe,{signal:controller.signal});
  root.addEventListener('message',event=>{
   if(!alive()||!frame)return;const m=playerMessage(event,frame,playerUrl);if(!m)return;
   if(m.event==='ready')subscribe();
   if(m.event==='timeupdate'){
    let timing;try{timing=typeof m.value==='string'?JSON.parse(m.value):m.value;}catch(_){return;}
    const pct=coverage.observe(timing?.seconds,timing?.duration);
    if(pct>=saved+5)saveProgress(pct);
   }
   if(m.event==='ended'){title.textContent='¡Terminaste la clase! ¿Qué te pareció?';saveProgress(coverage.percent());}
  },{signal:controller.signal});
  active={dispose(){disposed=true;controller.abort();panel.remove();}};
  drawReactions();loadReactions();loadComments(true);subscribe();saveProgress(0);
  return active;
 };
 api.clearAdmin=()=>{++adminRequest;document.getElementById('vc-community-admin')?.remove();};
 api.mountAdmin=async function({host,sb,isCurrent,student}){
  const request=++adminRequest;let panel=document.getElementById('vc-community-admin');
  if(!panel){panel=el('section',null,'vc-community vc-community-admin');panel.id='vc-community-admin';host.append(panel);}
  panel.replaceChildren(el('h3','Reacciones y comentarios de videoclases'));
  const refresh=button('Actualizar',()=>api.mountAdmin({host,sb,isCurrent,student}),'vc-community-link');panel.append(refresh);
  const status=el('p','', 'vc-community-note');panel.append(status);
  try {
   const results=await Promise.all([
    sb.from('campus_video_reactions').select('video_id,user_id,author_name,reaction,created_at').order('created_at',{ascending:false}).limit(300),
    sb.from('campus_video_comments').select('id,video_id,user_id,author_name,body,created_at').order('created_at',{ascending:false}).limit(300)
   ]);
   if(request!==adminRequest||!isCurrent())return;
   if(results.some(r=>r.error))throw new Error('load');
   const [rs,cs]=results.map(r=>r.data||[]);status.textContent='Hasta 300 participaciones recientes de cada tipo. Las reacciones no acreditan haber completado la clase.';
   const search=el('input');search.type='search';search.placeholder='Buscar estudiante, clase o comentario';search.setAttribute('aria-label','Buscar participación');panel.append(search);
   const list=el('div',null,'vc-comment-list');panel.append(list);
   const name=id=>{const person=student(id);return person?.display||person?.email||'';};
   const all=[...rs.map(r=>({...r,text:reactions.find(x=>x[0]===r.reaction)?.[2]||r.reaction})),...cs.map(c=>({...c,text:c.body,comment:true}))].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
   const render=()=>{list.replaceChildren();const q=search.value.trim().toLocaleLowerCase('es');
    const rows=all.filter(r=>[name(r.user_id),r.author_name,r.video_id,r.text].join(' ').toLocaleLowerCase('es').includes(q));
    if(!rows.length)list.append(el('p','Todavía no hay participaciones para mostrar.','vc-community-note'));
    rows.forEach(r=>{const card=el('article',null,'vc-comment');card.append(el('strong',name(r.user_id)||r.author_name),el('time',date(r.created_at)),el('small',r.video_id==='ben-carson-5050'?'Temas principales de anatomía y fisiología':'Videoclase '+r.video_id),el('p',r.text));
     if(r.comment)card.append(button('Eliminar comentario',async e=>{
      if(!isCurrent()||request!==adminRequest)return;const control=e.currentTarget;control.disabled=true;
      try {
       const {error}=await sb.from('campus_video_comments').delete().eq('id',r.id);
       if(!isCurrent()||request!==adminRequest)return;if(error)throw error;
       all.splice(all.indexOf(r),1);render();
      } catch(_){if(isCurrent()&&request===adminRequest){status.textContent='No pudimos eliminar el comentario.';control.disabled=false;}}
     },'vc-community-link'));list.append(card);
    });
   };search.oninput=render;render();
  }catch(_){if(request===adminRequest&&isCurrent())status.textContent='No pudimos cargar la participación. Pulsa Actualizar para reintentar.';}
 };
})(typeof window==='undefined'?globalThis:window);
