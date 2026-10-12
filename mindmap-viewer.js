/* Native concept map. Original raster maps are used only for downloads. */
(function () {
 var activeMap=null,objectUrl=null,sourceImage=null,previousFocus=null,previousOverflow='',token=0;
 var zoom=1,selectedBranch=0,branchOpen=[],showAllMobile=false,wired=false,fitPending=false;
 var colors=['#429243','#267dd0','#8c59b0','#e58929','#209caa','#d76387'];
 var $=function(id){return document.getElementById(id);};
 function field(map,name){return map&&(map[name]??map[name.toUpperCase()]);}
 function fileFor(map){return (field(map,'url_imagen')||field(map,'url_image')||'').split('/').pop().split('?')[0];}
 function detailsFor(map){return (window.MINDMAP_DETAILED_CONTENT||{})[fileFor(map)];}
 function assetsFor(map){return (window.MINDMAP_ASSETS||{})[fileFor(map)]||{};}
 function labelsFor(map){var detailed=detailsFor(map);return detailed?detailed.map(function(section){return section.title;}):window.MINDMAP_BRANCH_LABELS[fileFor(map)]||[];}
 function el(tag,cls,text){var node=document.createElement(tag);node.className=cls;if(text)node.textContent=text;return node;}
 function release(){if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=null;if(sourceImage){sourceImage.onload=null;sourceImage.onerror=null;sourceImage.src='';sourceImage=null;}}
 function redraw(){
  var tree=$('mm-tree'),svg=tree.querySelector('.mm-concept-lines');if(!svg||!tree.offsetWidth)return;
  var rect=tree.getBoundingClientRect(),scale=rect.width/tree.offsetWidth,width=tree.offsetWidth,height=tree.offsetHeight;
  svg.setAttribute('viewBox','0 0 '+width+' '+height);svg.replaceChildren();
  function bounds(node){var r=node.getBoundingClientRect();return {x:(r.left-rect.left)/scale,y:(r.top-rect.top)/scale,w:r.width/scale,h:r.height/scale};}
  function connect(from,to,color,vertical){
   var a=bounds(from),b=bounds(to),x1,y1,x2,y2,path;
   if(vertical){
    if(showAllMobile&&from.classList.contains('mm-concept-root')){x1=a.x+14;y1=a.y+a.h;x2=b.x;y2=b.y+b.h/2;path='M '+x1+' '+y1+' L '+0+' '+y1+' L '+0+' '+y2+' L '+x2+' '+y2;}
    else if(from.classList.contains('mm-concept-root')){x1=a.x+a.w/2;y1=a.y+a.h;x2=b.x+b.w/2;y2=b.y;path='M '+x1+' '+y1+' L '+x2+' '+y2;}
    else{x1=a.x+14;y1=a.y+a.h;x2=b.x;y2=b.y+b.h/2;path='M '+x1+' '+y1+' L '+x1+' '+y2+' L '+x2+' '+y2;}
   }
   else{var left=b.x<a.x;x1=left?a.x:a.x+a.w;y1=a.y+a.h/2;x2=left?b.x+b.w:b.x;y2=b.y+b.h/2;var midpoint=(x1+x2)/2;path='M '+x1+' '+y1+' C '+midpoint+' '+y1+' '+midpoint+' '+y2+' '+x2+' '+y2;}
   var p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',path);p.setAttribute('stroke',color);svg.appendChild(p);
  }
  var root=tree.querySelector('.mm-concept-root');
  tree.querySelectorAll('.mm-concept-group').forEach(function(group){if(!group.offsetWidth)return;var branch=group.querySelector('.mm-concept-branch'),color=colors[Number(group.dataset.branch)];connect(root,branch,color,false);if(branchOpen[Number(group.dataset.branch)])group.querySelectorAll('.mm-concept-leaf').forEach(function(leaf){if(!leaf.closest('.mm-detail-nodes')&&leaf.offsetWidth)connect(branch,leaf,color,false);});});
  var space=$('mm-map-space');space.style.width=Math.ceil(width*zoom)+'px';space.style.height=Math.ceil(height*zoom)+'px';space.style.marginTop=Math.max(0,(document.querySelector('.mm-lb-stage').clientHeight-48-height*zoom)/2)+'px';
 }
 function scheduleDraw(){requestAnimationFrame(function(){redraw();requestAnimationFrame(redraw);});}
 function update(){
  $('mm-tree').classList.toggle('show-all',showAllMobile);
  $('mm-branch-count').textContent=branchOpen.filter(Boolean).length+' de '+branchOpen.length+' ramas abiertas';
  document.querySelectorAll('.mm-concept-group').forEach(function(group){var i=Number(group.dataset.branch),button=group.querySelector('.mm-concept-branch');group.classList.toggle('is-open',branchOpen[i]);group.classList.toggle('is-selected',i===selectedBranch);button.setAttribute('aria-expanded',String(branchOpen[i]));button.querySelector('.mm-node-toggle').textContent=branchOpen[i]?'−':'+';group.querySelector('.mm-concept-children').hidden=!branchOpen[i];});
  $('mm-branch-shortcuts').querySelectorAll('button').forEach(function(button){var i=Number(button.dataset.branch);button.classList.toggle('is-selected',i===selectedBranch);button.setAttribute('aria-pressed',String(i===selectedBranch));});scheduleDraw();
 }
 function setBranch(index,open){branchOpen[index]=open;selectedBranch=index;update();}
 function selectBranch(index){showAllMobile=false;selectedBranch=index;branchOpen[index]=true;update();var stage=document.querySelector('.mm-lb-stage');stage.scrollTop=0;stage.scrollLeft=0;}
 function setAll(open){showAllMobile=false;branchOpen=branchOpen.map(function(){return open;});update();}
 function setZoom(value,center){
  zoom=Math.max(.05,Math.min(2.5,Math.round(value*100)/100));var tree=$('mm-tree');tree.style.transform='scale('+zoom+')';$('mm-zoom-value').textContent=Math.round(zoom*100)+'%';redraw();
  if(center)requestAnimationFrame(function(){var stage=document.querySelector('.mm-lb-stage');stage.scrollLeft=Math.max(0,(stage.scrollWidth-stage.clientWidth)/2);stage.scrollTop=Math.max(0,(stage.scrollHeight-stage.clientHeight)/2);});
 }
 function fit(){
  if(!activeMap)return;var stage=document.querySelector('.mm-lb-stage'),tree=$('mm-tree'),style=getComputedStyle(stage);tree.style.width='1360px';
  var rect=tree.getBoundingClientRect(),scale=rect.width/tree.offsetWidth,left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
  tree.querySelectorAll('.mm-concept-root,.mm-concept-branch,.mm-concept-leaf').forEach(function(node){if(!node.offsetWidth||!node.offsetHeight)return;var r=node.getBoundingClientRect();left=Math.min(left,(r.left-rect.left)/scale);top=Math.min(top,(r.top-rect.top)/scale);right=Math.max(right,(r.right-rect.left)/scale);bottom=Math.max(bottom,(r.bottom-rect.top)/scale);});
  var width=stage.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight),height=stage.clientHeight-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
  setZoom(Math.min(1,width/(right-left+24),height/(bottom-top+24)),false);
  requestAnimationFrame(function(){var canvas=tree.getBoundingClientRect(),viewport=stage.getBoundingClientRect();stage.scrollLeft+=canvas.left+(left+right)*zoom/2-(viewport.left+stage.clientWidth/2);stage.scrollTop+=canvas.top+(top+bottom)*zoom/2-(viewport.top+stage.clientHeight/2);});
 }

 function detailLeaf(title,text){
  var leaf=el('button','mm-concept-leaf');leaf.type='button';leaf.setAttribute('aria-expanded','false');var heading=el('span','mm-leaf-heading');heading.appendChild(el('span','mm-leaf-dot'));heading.appendChild(el('strong','',title));heading.appendChild(el('span','mm-leaf-toggle','+'));leaf.appendChild(heading);
  var explanation=el('span','mm-leaf-explanation',text);explanation.hidden=true;leaf.appendChild(explanation);
  leaf.addEventListener('click',function(){var open=leaf.getAttribute('aria-expanded')!=='true';leaf.setAttribute('aria-expanded',String(open));leaf.classList.toggle('is-expanded',open);explanation.hidden=!open;leaf.querySelector('.mm-leaf-toggle').textContent=open?'−':'+';scheduleDraw();});return leaf;
 }
 function buildDetails(children,section,index){
  section.groups.forEach(function(item,groupIndex){
   var block=el('div','mm-detail-group'),parent=el('button','mm-concept-leaf mm-detail-heading');parent.type='button';parent.setAttribute('aria-expanded','false');var id='mm-detail-'+index+'-'+groupIndex;parent.setAttribute('aria-controls',id);
   var heading=el('span','mm-leaf-heading');heading.appendChild(el('span','mm-leaf-dot'));heading.appendChild(el('strong','',item.title));heading.appendChild(el('span','mm-leaf-toggle','+'));parent.appendChild(heading);
   var nodes=el('div','mm-detail-nodes');nodes.id=id;nodes.hidden=true;
   item.items.forEach(function(concept){nodes.appendChild(detailLeaf(concept.title,concept.text));});
   parent.onclick=function(){var open=parent.getAttribute('aria-expanded')!=='true';parent.setAttribute('aria-expanded',String(open));parent.classList.toggle('is-expanded',open);parent.querySelector('.mm-leaf-toggle').textContent=open?'−':'+';nodes.hidden=!open;scheduleDraw();};block.append(parent,nodes);children.appendChild(block);
  });
  if(section.note){var note=detailLeaf('Aclaración del texto',section.note);note.classList.add('mm-detail-note');children.appendChild(note);}
 }
 function build(map){
  var tree=$('mm-tree'),labels=labelsFor(map),detailed=detailsFor(map),content=window.MINDMAP_CONTENT[fileFor(map)]||[];tree.replaceChildren();tree.className='mm-tree mm-concept-map';
  var svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','mm-concept-lines');svg.setAttribute('aria-hidden','true');tree.appendChild(svg);
  var mark=el('span','mm-concept-watermark','PREPA BEN CARSON');mark.setAttribute('aria-hidden','true');tree.appendChild(mark);
  var root=el('div','mm-concept-root'),icon=el('span','mm-concept-icon');
  icon.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 8h12v10h10v12H30v10H18V30H8V18h10z" fill="currentColor"/><circle cx="38" cy="10" r="4" fill="#ffb833"/></svg>';
  var title=(field(map,'root_title')||field(map,'titulo')||'Mapa mental').replace(/^Temas principales de /i,'');title=title.charAt(0).toUpperCase()+title.slice(1);
  if(detailed){root.classList.add('mm-detailed-root');root.appendChild(el('strong','mm-concept-title',title));var anatomy=el('img','mm-root-anatomy');var asset=assetsFor(map);anatomy.src=asset.image||'/assets/mindmaps/encefalo/anatomia.webp';anatomy.alt=asset.alt||'Aspecto medial del encéfalo, figura 14.2a de Saladin';anatomy.decoding='async';anatomy.onload=scheduleDraw;root.appendChild(anatomy);tree.classList.add('mm-detailed-map');}
  else{root.appendChild(icon);root.appendChild(el('span','mm-concept-kicker','IDEA CENTRAL'));root.appendChild(el('strong','mm-concept-title',title));}tree.appendChild(root);
  var nav=$('mm-branch-shortcuts');nav.replaceChildren();
  labels.forEach(function(label,index){
   var group=el('section','mm-concept-group');group.dataset.branch=index;group.style.setProperty('--branch-color',colors[index]);
   var parent=el('button','mm-concept-branch');parent.type='button';parent.setAttribute('aria-controls','mm-children-'+index);parent.appendChild(el('span','mm-node-number',String(index+1)));parent.appendChild(el('span','mm-node-label',label));parent.appendChild(el('span','mm-node-toggle','+'));parent.addEventListener('click',function(){setBranch(index,!branchOpen[index]);});group.appendChild(parent);
   var children=el('div','mm-concept-children');children.id='mm-children-'+index;
   if(detailed)buildDetails(children,detailed[index],index);else (content[index]||[]).forEach(function(item){
    var leaf=el('button','mm-concept-leaf');leaf.type='button';leaf.setAttribute('aria-expanded',String(index===0));leaf.classList.toggle('is-expanded',index===0);var heading=el('span','mm-leaf-heading');heading.appendChild(el('span','mm-leaf-dot'));heading.appendChild(el('strong','',item[0]));heading.appendChild(el('span','mm-leaf-toggle',index===0?'−':'+'));leaf.appendChild(heading);
    var explanation=el('span','mm-leaf-explanation',item[1]);explanation.hidden=index!==0;leaf.appendChild(explanation);
    leaf.addEventListener('click',function(){var open=leaf.getAttribute('aria-expanded')!=='true';leaf.setAttribute('aria-expanded',String(open));leaf.classList.toggle('is-expanded',open);explanation.hidden=!open;leaf.querySelector('.mm-leaf-toggle').textContent=open?'−':'+';scheduleDraw();});children.appendChild(leaf);
   });
   group.appendChild(children);tree.appendChild(group);var tab=el('button','mm-topic-tab',label);tab.type='button';tab.dataset.branch=index;tab.style.setProperty('--branch-color',colors[index]);tab.addEventListener('click',function(){selectBranch(index);});nav.appendChild(tab);
  });update();fit();
 }
 function wire(){
  if(wired)return;wired=true;
  $('mm-zoom-out').addEventListener('click',function(){setZoom(zoom-.15,true);});$('mm-zoom-in').addEventListener('click',function(){setZoom(zoom+.15,true);});$('mm-zoom-center').addEventListener('click',fit);
  $('mm-branch-all').addEventListener('click',function(){setAll(true);});$('mm-branch-none').addEventListener('click',function(){setAll(false);});
  $('mm-tools-toggle').addEventListener('click',function(){var bar=$('mm-lightbox').querySelector('.mm-branch-bar'),open=!bar.classList.contains('is-expanded');bar.classList.toggle('is-expanded',open);$('mm-tools-toggle').setAttribute('aria-expanded',String(open));fit();});
  $('mm-true-fullscreen').addEventListener('click',function(){var viewer=$('mm-lightbox');if(document.fullscreenElement===viewer)document.exitFullscreen();else if(viewer.requestFullscreen)viewer.requestFullscreen().catch(function(){});});
  $('mm-lb-download').addEventListener('click',async function(){if(field(activeMap,'premium')){var button=$('mm-lb-download');button.disabled=true;try{await MindmapPremium.download(activeMap);}catch(error){$('mm-lb-status').textContent=error.message;}finally{if(activeMap)button.disabled=false;}return;}if(!objectUrl&&!detailsFor(activeMap))return;var asset=assetsFor(activeMap),link=el('a','');link.href=detailsFor(activeMap)?asset.download||'/assets/mindmaps/encefalo/mapa-completo.png?v=2':objectUrl;link.download=detailsFor(activeMap)?asset.filename||'Encefalo-y-pares-craneales-Ben-Carson.png':fileFor(activeMap).replace(/\.[^.]+$/,'')+'-prepa-ben-carson.webp';document.body.appendChild(link);link.click();link.remove();});
  var stage=document.querySelector('.mm-lb-stage'),pan=null;
  stage.addEventListener('wheel',function(event){if(!event.ctrlKey)return;event.preventDefault();setZoom(zoom+(event.deltaY<0?.1:-.1),true);},{passive:false});
  stage.addEventListener('pointerdown',function(event){if(event.pointerType!=='mouse'||event.button!==0||event.target.closest('button'))return;pan={id:event.pointerId,x:event.clientX,y:event.clientY,left:stage.scrollLeft,top:stage.scrollTop};stage.setPointerCapture(event.pointerId);stage.classList.add('is-panning');});
  stage.addEventListener('pointermove',function(event){if(!pan||event.pointerId!==pan.id)return;stage.scrollLeft=pan.left-(event.clientX-pan.x);stage.scrollTop=pan.top-(event.clientY-pan.y);});
  function end(event){if(pan&&event.pointerId===pan.id){pan=null;stage.classList.remove('is-panning');}}
  stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);
  var pinch=null;
  function touchCenter(touches){return{x:(touches[0].clientX+touches[1].clientX)/2,y:(touches[0].clientY+touches[1].clientY)/2};}
  function touchDistance(touches){return Math.hypot(touches[0].clientX-touches[1].clientX,touches[0].clientY-touches[1].clientY);}
  stage.addEventListener('touchstart',function(event){if(event.touches.length!==2)return;var center=touchCenter(event.touches),rect=$('mm-tree').getBoundingClientRect();pinch={distance:touchDistance(event.touches),zoom:zoom,x:(center.x-rect.left)/zoom,y:(center.y-rect.top)/zoom};},{passive:true});
  stage.addEventListener('touchmove',function(event){if(!pinch||event.touches.length!==2)return;event.preventDefault();var center=touchCenter(event.touches);setZoom(pinch.zoom*touchDistance(event.touches)/Math.max(1,pinch.distance),false);var rect=$('mm-tree').getBoundingClientRect();stage.scrollLeft+=rect.left+pinch.x*zoom-center.x;stage.scrollTop+=rect.top+pinch.y*zoom-center.y;},{passive:false});
  function endPinch(event){if(event.touches.length<2)pinch=null;}
  stage.addEventListener('touchend',endPinch,{passive:true});stage.addEventListener('touchcancel',endPinch,{passive:true});

  window.addEventListener('resize',function(){if(!activeMap||fitPending)return;fitPending=true;requestAnimationFrame(function(){fitPending=false;update();fit();});});
  if(window.ResizeObserver)new ResizeObserver(function(){if(activeMap)scheduleDraw();}).observe($('mm-tree'));
  document.addEventListener('keydown',function(event){
   if(!activeMap)return;if(event.key==='Escape'){window.closeMmLightbox();return;}
   if(/^[1-6]$/.test(event.key)&&Number(event.key)<=branchOpen.length&&!event.ctrlKey&&!event.metaKey&&!event.altKey){var i=Number(event.key)-1;setBranch(i,!branchOpen[i]);}
   if(event.key==='Tab'){var buttons=Array.from($('mm-lightbox').querySelectorAll('button:not(:disabled)')).filter(function(node){return node.offsetWidth&&node.offsetHeight;});var first=buttons[0],last=buttons[buttons.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
 }
 function watermark(source){return new Promise(function(resolve,reject){var canvas=document.createElement('canvas');canvas.width=source.naturalWidth;canvas.height=source.naturalHeight;var context=canvas.getContext('2d');context.drawImage(source,0,0);var size=Math.round(canvas.width*.075);context.font='800 '+size+'px Arial';var width=context.measureText('PREPA BEN CARSON').width;if(width>canvas.width*.8){size=Math.round(size*canvas.width*.8/width);context.font='800 '+size+'px Arial';}context.textAlign='center';context.textBaseline='middle';context.fillStyle='rgba(28,69,108,.08)';context.fillText('PREPA BEN CARSON',canvas.width/2,canvas.height/2);canvas.toBlob(function(blob){if(blob)resolve(URL.createObjectURL(blob));else reject(new Error('Descarga no disponible'));},'image/webp',.95);});}
 window.openMmLightbox=async function(map){
  if(window.CampusAccess&&CampusAccess.isFree()&&!field(map,'acceso_gratis'))return openMmUnlockDialog(map);if(!$('mm-lightbox'))return;
  if(field(map,'premium')){var loadingRevision=++token;wire();release();activeMap=map;$('mm-lightbox').classList.remove('hidden');previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';$('mm-tree').replaceChildren();$('mm-lb-title').textContent=field(map,'titulo');$('mm-lb-materia').textContent=field(map,'tema');$('mm-lb-status').textContent='Cargando mapa…';$('mm-lb-download').disabled=true;try{await MindmapPremium.load(map);}catch(error){if(loadingRevision===token){$('mm-lb-status').textContent=error.message;if(error.status===403){closeMmLightbox();if(CampusAccess.isFree())openMmUnlockDialog(map);else CampusAccess.unlock();}}return;}if(loadingRevision!==token)return;$('mm-lightbox').classList.add('hidden');document.body.style.overflow=previousOverflow;activeMap=null;}
  wire();release();activeMap=map;selectedBranch=0;showAllMobile=false;branchOpen=labelsFor(map).map(function(_,i){return detailsFor(map)?false:i===0;});var current=++token;previousFocus=document.activeElement;previousOverflow=document.body.style.overflow;
  $('mm-lb-title').textContent=field(map,'titulo')||'Mapa mental';$('mm-lb-materia').textContent=field(map,'materia')||'';$('mm-lightbox').classList.remove('hidden');document.body.style.overflow='hidden';$('mm-lb-download').disabled=true;$('mm-lb-status').textContent='';
  build(map);$('mm-lightbox').querySelector('.mm-lb-close').focus();
  if(detailsFor(map)){$('mm-lb-download').disabled=false;return;}
  var source=new Image();sourceImage=source;source.crossOrigin='anonymous';source.onload=function(){if(current!==token)return;try{watermark(source).then(function(url){if(current!==token){URL.revokeObjectURL(url);return;}objectUrl=url;$('mm-lb-download').disabled=false;}).catch(function(){if(current===token)$('mm-lb-status').textContent='La descarga no está disponible en este momento.';});}catch(_){if(current===token)$('mm-lb-status').textContent='La descarga no está disponible en este momento.';}};source.onerror=function(){if(current===token)$('mm-lb-status').textContent='La descarga no está disponible en este momento.';};source.src=field(map,'url_imagen')||field(map,'url_image')||'';
 };
 window.closeMmLightbox=function(){if(!activeMap)return;++token;activeMap=null;$('mm-lightbox').classList.add('hidden');document.body.style.overflow=previousOverflow;if(document.fullscreenElement===$('mm-lightbox'))document.exitFullscreen().catch(function(){});$('mm-tree').replaceChildren();$('mm-branch-shortcuts').replaceChildren();release();if(previousFocus&&previousFocus.isConnected)previousFocus.focus();};
 var requestedMapOpened=false;
 window.openRequestedMindmap=async function(){
  var requested=new URLSearchParams(location.search).get('mapa');if(requestedMapOpened||!requested)return;
  requestedMapOpened=true;await window.openMindMaps();if(requested==='todos'){window.clearMmFilters();return;}var map=mmState.allMapas.find(function(item){var key=fileFor(item);return requested==='encefalo'?key==='morfo_14_encefalo_pares_craneales.png':key.replace(/\.[^.]+$/,'')===requested;});if(!map)return;
  window.selectMmMateria(field(map,'materia'));var topic=mmTopicKey(map),select=$('mm-tema-select');if(select)select.value=topic;window.selectMmTema(topic);window.openMmLightbox(map);
 };
})();
