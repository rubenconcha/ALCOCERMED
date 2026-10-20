(function(root){
 'use strict';
 function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
 function merge(original,extra){
  var ids=new Set(original.map(function(q){return q.id;})),texts=new Set(original.map(function(q){return norm(q.texto);}));
  return original.concat(extra.filter(function(q){
   if(!q||!q.id||!q.texto||q.tipo!=='mc'||!Array.isArray(q.opciones)||q.opciones.length!==4||q.opciones.filter(function(o){return o.correct===true;}).length!==1)return false;
   var text=norm(q.texto);if(ids.has(q.id)||texts.has(text))return false;ids.add(q.id);texts.add(text);return true;
  }));
 }
 async function load(client,ev,original,code,restore){
  var key='alcocer_self_extra_'+code,extra;
  if(restore){try{extra=JSON.parse(sessionStorage.getItem(key)||'null');}catch(_){}if(Array.isArray(extra))return merge(original,extra);if(extra&&Array.isArray(extra.questions))return extra.replace?merge([],extra.questions):merge(original,extra.questions);}
  try{
   if(!client.auth||!client.auth.getSession)return original;
   var session=await client.auth.getSession(),token=session.data&&session.data.session&&session.data.session.access_token;
   if(!token)return original;
   var response=await fetch('/api/game-practice?id='+encodeURIComponent(ev.id),{headers:{Authorization:'Bearer '+token},cache:'no-store',signal:AbortSignal.timeout(12000)});
   if(!response.ok)return original;
   var data=await response.json();extra=Array.isArray(data.questions)?data.questions:[];
   var combined=data.replace===true&&extra.length?merge([],extra):merge(original,extra);
   try{sessionStorage.setItem(key,JSON.stringify({replace:data.replace===true&&extra.length>0,questions:extra}));}catch(_){}
   return combined;
  }catch(_){return original;}
 }
 var api={norm:norm,merge:merge,load:load};root.GamePractice=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
