// ═══ EDITOR DE EVALUACIONES — ALCOCERMED (Réplica Wayground) ═══
var SUPABASE_URL='https://asnwhddmurstzmghuyin.supabase.co';
var SUPABASE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';
var _sb=null;
function getSupabase(){if(!_sb)_sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);return _sb;}

// ═══ STATE ═══
var questions=[];
var currentQuestionIndex=-1;
var showingTypes=true;
var evaluacionId=null;
var currentUser=null;
var saving=false;
var sessionMode='clasico';
var pointsOptions=[0,1,2];var pointsIdx=1;
var timerOptions=[15,30,60,120,300];var timerIdx=1;

// ═══ CONFIG JUEGO (orden + comodines para estudiantes) ═══
var EDITOR_POWERUP_DEFS={
  x2:{name:'⚡ x2 Puntos',cat:'puntos'},x3r:{name:'🔥 x3/x5',cat:'puntos'},jack:{name:'💎 Jackpot',cat:'puntos'},
  myst:{name:'🎲 Misterioso',cat:'puntos'},speed:{name:'⏳ Velocidad',cat:'puntos'},
  elim:{name:'❌ Eliminar',cat:'ayuda'},time:{name:'⏱️ +10s',cat:'ayuda'},hint:{name:'👀 Pista',cat:'ayuda'},
  retry:{name:'🔄 2ª chance',cat:'ayuda'},
  chest:{name:'🎁 Caja',cat:'divertido'},sleep:{name:'💤 Dormido',cat:'divertido'},ultra:{name:'🤯 Ultra',cat:'divertido'},
  spy:{name:'🕵️ Espía',cat:'divertido'},swap:{name:'🌪️ Roba pts',cat:'divertido'}
};
var DEFAULT_POWERUP_KEYS=Object.keys(EDITOR_POWERUP_DEFS);
var EDITOR_POWERUP_ADMIN_META={
  x2:{name:'x2 Puntos',desc:'Duplica el puntaje de la pregunta.',cat:'puntos',icon:'bolt'},
  x3r:{name:'x3 / x5',desc:'Multiplicador alto al azar.',cat:'puntos',icon:'fire'},
  jack:{name:'Jackpot',desc:'Premio grande de puntos extra.',cat:'puntos',icon:'gem'},
  myst:{name:'Misterioso',desc:'Multiplicador sorpresa.',cat:'puntos',icon:'dice'},
  speed:{name:'Velocidad',desc:'Bonus si responde rapido.',cat:'puntos',icon:'stopwatch'},
  elim:{name:'Eliminar',desc:'Quita opciones incorrectas.',cat:'ayuda',icon:'times-circle'},
  time:{name:'+10 segundos',desc:'Agrega tiempo para pensar.',cat:'ayuda',icon:'clock'},
  hint:{name:'Pista',desc:'Muestra una ayuda corta.',cat:'ayuda',icon:'eye'},
  retry:{name:'2da chance',desc:'Permite intentar otra vez.',cat:'ayuda',icon:'redo'},
  chest:{name:'Caja sorpresa',desc:'Efecto aleatorio divertido.',cat:'divertido',icon:'box-open'},
  sleep:{name:'Dormido',desc:'Pausa o distrae en juego.',cat:'divertido',icon:'moon'},
  ultra:{name:'Ultra',desc:'Carta especial de impacto alto.',cat:'divertido',icon:'star'},
  spy:{name:'Espia',desc:'Da informacion estrategica.',cat:'divertido',icon:'user-secret'},
  swap:{name:'Roba puntos',desc:'Intercambia o roba ventaja.',cat:'divertido',icon:'shuffle'}
};
var EDITOR_POWERUP_CATS=[
  {id:'puntos',label:'Puntos',hint:'Suben el puntaje o multiplican la recompensa.'},
  {id:'ayuda',label:'Ayuda',hint:'Reducen dificultad o dan una segunda oportunidad.'},
  {id:'divertido',label:'Diversion',hint:'Efectos sorpresa para hacer mas dinamico el demo.'}
];
var gameConfig={maxQuestions:10,questionOrder:[],enabledPowerups:DEFAULT_POWERUP_KEYS.slice()};

function parseGameConfigFromEval(raw){
  if(!raw)return;
  if(typeof raw==='string'){try{raw=JSON.parse(raw);}catch(e){return;}}
  if(!raw||typeof raw!=='object')return;
  if(raw.maxQuestions)gameConfig.maxQuestions=Math.max(1,Math.min(50,Number(raw.maxQuestions)||10));
  if(raw.questionOrder&&raw.questionOrder.length)gameConfig.questionOrder=raw.questionOrder.slice();
  if(raw.enabledPowerups){
    gameConfig.enabledPowerups=raw.enabledPowerups.filter(function(k){return EDITOR_POWERUP_DEFS[k];});
  }
}
function syncGameConfigQuestionIds(){
  var ids=[];
  for(var i=0;i<questions.length;i++){if(questions[i].dbId)ids.push(questions[i].dbId);}
  if(gameConfig.questionOrder.length===0){gameConfig.questionOrder=ids.slice();return;}
  var kept=[];
  for(var j=0;j<gameConfig.questionOrder.length;j++){
    if(ids.indexOf(gameConfig.questionOrder[j])!==-1)kept.push(gameConfig.questionOrder[j]);
  }
  for(var k=0;k<ids.length;k++){if(kept.indexOf(ids[k])===-1)kept.push(ids[k]);}
  gameConfig.questionOrder=kept;
}
function collectGameConfigForSave(){
  syncGameConfigQuestionIds();
  var maxInp=document.getElementById('game-max-questions');
  if(maxInp)gameConfig.maxQuestions=Math.max(1,Math.min(50,parseInt(maxInp.value,10)||10));
  return{
    maxQuestions:gameConfig.maxQuestions,
    questionOrder:gameConfig.questionOrder.filter(function(id){return!!id;}),
    enabledPowerups:gameConfig.enabledPowerups.slice()
  };
}
function editorEscapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function getQuestionImage(q){
  return (q && q.options && q.options[0] && q.options[0].pregunta_imagen) ? q.options[0].pregunta_imagen : '';
}
function setQuestionImage(q,url){
  if(!q)return;
  if(!q.options)q.options=[];
  if(q.options.length===0)q.options.push({text:'',correct:false,color:'ac-blue'});
  for(var i=0;i<q.options.length;i++){
    q.options[i].pregunta_imagen=url||'';
  }
}
function renderGameConfigPanel(){
  syncGameConfigQuestionIds();
  var maxInp=document.getElementById('game-max-questions');
  if(maxInp)maxInp.value=gameConfig.maxQuestions;
  var listEl=document.getElementById('game-play-order-list');
  if(listEl){
    if(gameConfig.questionOrder.length===0){
      listEl.innerHTML='<p class="game-config-empty">Agrega preguntas y guarda la evaluación.</p>';
    }else{
      var html='',unsaved=0;
      for(var i=0;i<gameConfig.questionOrder.length;i++){
        var qid=gameConfig.questionOrder[i],label='(sin texto)',found=false;
        for(var q=0;q<questions.length;q++){
          if(questions[q].dbId===qid){
            found=true;
            var txt=(questions[q].text||'').replace(/<[^>]+>/g,'').trim();
            label=txt?(txt.length>48?txt.slice(0,48)+'…':txt):('Pregunta '+(q+1));
            break;
          }
        }
        if(!found)label='(guarda de nuevo)';
        html+='<div class="game-play-order-item"><span class="game-play-order-num">'+(i+1)+'º</span>'
          +'<span class="game-play-order-text">'+editorEscapeHtml(label)+'</span>'
          +'<div class="game-play-order-btns">'
          +'<button type="button" onclick="movePlayOrderItem('+i+',-1)"'+(i===0?' disabled':'')+'>↑</button>'
          +'<button type="button" onclick="movePlayOrderItem('+i+',1)"'+(i===gameConfig.questionOrder.length-1?' disabled':'')+'>↓</button>'
          +'</div></div>';
      }
      for(var u=0;u<questions.length;u++){if(!questions[u].dbId)unsaved++;}
      if(unsaved>0)html+='<p class="game-config-warn">'+unsaved+' pregunta(s) sin guardar — pulsa Guardar arriba.</p>';
      listEl.innerHTML=html;
    }
  }
  var grid=document.getElementById('game-powerups-grid');
  if(grid){
    var ghtml='';
    for(var key in EDITOR_POWERUP_DEFS){
      var def=EDITOR_POWERUP_DEFS[key],on=gameConfig.enabledPowerups.indexOf(key)!==-1;
      ghtml+='<label class="game-powerup-chip'+(on?' selected':'')+'" onclick="toggleEditorPowerup(\''+key+'\');return false;">'
        +'<input type="checkbox"'+(on?' checked':'')+'><span>'+def.name+'</span></label>';
    }
    grid.innerHTML=ghtml;
  }
}
function getAdminQuestionTypeLabel(type){
  var labels={mc:'Seleccion unica',ms:'Seleccion multiple',tf:'Verdadero/Falso',fb:'Completar',oa:'Abierta',poll:'Encuesta',dnd:'Identificar partes',cat:'Categorizar',ro:'Reordenar',mt:'Relacionar'};
  return labels[type]||'Pregunta';
}
function renderGameConfigPanel(){
  syncGameConfigQuestionIds();
  var maxInp=document.getElementById('game-max-questions');
  if(maxInp)maxInp.value=gameConfig.maxQuestions;
  var listEl=document.getElementById('game-play-order-list');
  if(listEl){
    if(gameConfig.questionOrder.length===0){
      listEl.innerHTML='<p class="game-config-empty">Agrega preguntas y guarda la evaluacion.</p>';
    }else{
      var html='',unsaved=0;
      for(var i=0;i<gameConfig.questionOrder.length;i++){
        var qid=gameConfig.questionOrder[i],label='(sin texto)',found=false,typeLabel='Pregunta',editorNum='P'+(i+1);
        for(var q=0;q<questions.length;q++){
          if(questions[q].dbId===qid){
            found=true;
            var txt=(questions[q].text||'').replace(/<[^>]+>/g,'').trim();
            label=txt||('Pregunta '+(q+1));
            if(label.length>92)label=label.slice(0,92)+'...';
            typeLabel=getAdminQuestionTypeLabel(questions[q].type||'mc');
            editorNum='P'+(q+1);
            break;
          }
        }
        if(!found){label='Guarda de nuevo para sincronizar esta pregunta';typeLabel='Pendiente';}
        html+='<div class="game-play-order-item">'
          +'<div class="game-play-order-num"><strong>'+String(i+1)+'</strong><span>orden</span></div>'
          +'<div class="game-play-order-main">'
          +'<div class="game-play-order-meta"><span>'+editorEscapeHtml(editorNum)+'</span><span>'+editorEscapeHtml(typeLabel)+'</span></div>'
          +'<div class="game-play-order-text">'+editorEscapeHtml(label)+'</div>'
          +'</div>'
          +'<div class="game-play-order-btns">'
          +'<button type="button" title="Subir" onclick="movePlayOrderItem('+i+',-1)"'+(i===0?' disabled':'')+'><i class="fas fa-arrow-up"></i></button>'
          +'<button type="button" title="Bajar" onclick="movePlayOrderItem('+i+',1)"'+(i===gameConfig.questionOrder.length-1?' disabled':'')+'><i class="fas fa-arrow-down"></i></button>'
          +'</div></div>';
      }
      for(var u=0;u<questions.length;u++){if(!questions[u].dbId)unsaved++;}
      if(unsaved>0)html+='<p class="game-config-warn">'+unsaved+' pregunta(s) sin guardar. Pulsa Guardar arriba.</p>';
      listEl.innerHTML=html;
    }
  }
  var grid=document.getElementById('game-powerups-grid');
  if(grid){
    var ghtml='';
    for(var c=0;c<EDITOR_POWERUP_CATS.length;c++){
      var cat=EDITOR_POWERUP_CATS[c];
      ghtml+='<div class="game-powerup-group"><div class="game-powerup-group-head"><strong>'+cat.label+'</strong><span>'+cat.hint+'</span></div>';
      for(var key in EDITOR_POWERUP_DEFS){
        var def=EDITOR_POWERUP_ADMIN_META[key]||EDITOR_POWERUP_DEFS[key];
        if(def.cat!==cat.id)continue;
        var on=gameConfig.enabledPowerups.indexOf(key)!==-1;
        ghtml+='<button type="button" class="game-powerup-card'+(on?' selected':'')+'" onclick="toggleEditorPowerup(\''+key+'\');return false;">'
          +'<span class="game-powerup-icon"><i class="fas fa-'+(def.icon||'bolt')+'"></i></span>'
          +'<span class="game-powerup-copy"><strong>'+editorEscapeHtml(def.name)+'</strong><small>'+editorEscapeHtml(def.desc||'Comodin disponible en juego')+'</small></span>'
          +'<span class="game-powerup-state">'+(on?'Activo':'Off')+'</span>'
          +'</button>';
      }
      ghtml+='</div>';
    }
    grid.innerHTML=ghtml;
  }
}
function resetPlayOrderFromSidebar(){
  gameConfig.questionOrder=[];
  syncGameConfigQuestionIds();
  renderGameConfigPanel();
}
function movePlayOrderItem(idx,delta){
  var arr=gameConfig.questionOrder,ni=idx+delta;
  if(ni<0||ni>=arr.length)return;
  var t=arr[idx];arr[idx]=arr[ni];arr[ni]=t;
  renderGameConfigPanel();
  markUnsavedChanges();
}
function toggleEditorPowerup(key){
  var i=gameConfig.enabledPowerups.indexOf(key);
  if(i===-1)gameConfig.enabledPowerups.push(key);
  else gameConfig.enabledPowerups.splice(i,1);
  renderGameConfigPanel();
  markUnsavedChanges();
}
function setAllEditorPowerups(on){
  gameConfig.enabledPowerups=on?DEFAULT_POWERUP_KEYS.slice():[];
  renderGameConfigPanel();
  markUnsavedChanges();
}
window.resetPlayOrderFromSidebar=resetPlayOrderFromSidebar;
window.movePlayOrderItem=movePlayOrderItem;
window.toggleEditorPowerup=toggleEditorPowerup;
window.setAllEditorPowerups=setAllEditorPowerups;
window.deleteQuestion=deleteQuestion;

// ═══ QUESTION TYPES ═══
var questionTypes={
  'Básico':[
    {id:'mc',name:'Selección única',icon:'☑️',css:'qi-mc'},
    {id:'ms',name:'Selección múltiple',icon:'✅',css:'qi-ms'},
    {id:'tf',name:'Verdadero o falso',icon:'🔴',css:'qi-tf'},
    {id:'fb',name:'Completa los espacios',icon:'✏️',css:'qi-fb'},
    {id:'oa',name:'Respuestas abiertas',icon:'📝',css:'qi-oa'},
    {id:'poll',name:'Encuesta',icon:'📊',css:'qi-poll'}
  ],
  'Interactivo y de orden superior':[
    {id:'dnd',name:'Identificar partes',icon:'🖐️',css:'qi-dnd'},
    {id:'cat',name:'Categorizar',icon:'📊',css:'qi-cat'},
    {id:'ro',name:'Reordenar',icon:'⬇️',css:'qi-ro'},
    {id:'mt',name:'Relacionar',icon:'🔗',css:'qi-mt'}
  ]
};

// ═══ AUTH ═══
function initEditorAuth(){
  var client=getSupabase();
  client.auth.getSession().then(function(r){
    if(r.data&&r.data.session&&r.data.session.user){
      currentUser=r.data.session.user;
      if(currentUser.email.toLowerCase().trim()!=='pichon4488@gmail.com'){
        alert('Solo el administrador puede crear evaluaciones');
        window.location.href='index.html';return;
      }
      initEditor();
    }else{alert('Debes iniciar sesión');window.location.href='index.html';}
  });
}

function initEditor(){
  var params=new URLSearchParams(window.location.search);
  var editId=params.get('id');
  var showRes=params.get('results');
  if(editId){loadExistingEvaluation(editId);}
  else{createNewEvaluation();}
  renderQuestionTypes();
  renderQuestionThumbs();
  renderGameConfigPanel();
  var activeSession=sessionStorage.getItem('alcocer_teacher_eval');
  if(showRes === 'true' && editId) {
    evaluacionId=editId;
    openTeacherResults(false);
  } else if(activeSession){
    evaluacionId=activeSession;
    openTeacherResults(true);
  }
}

// ═══ CREATE / LOAD EVALUATION ═══
function createNewEvaluation(){
  // Solo inicializar estado local — NO insertar en Supabase hasta que el usuario presione "Guardar"
  evaluacionId=null;
  questions=[];
  showToast('Nuevo borrador — Presiona Guardar para almacenar','success');
}

function loadExistingEvaluation(id){
  var client=getSupabase();evaluacionId=id;
  var titleLoaded=false, qLoaded=false, evCode=null, iniciado=false;

  function checkPlay(){
    if(titleLoaded && qLoaded && new URLSearchParams(window.location.search).get('play') === 'true') {
       if (evCode && !iniciado && !sessionStorage.getItem('alcocer_teacher_eval')) {
           showLobby(evCode);
       }
    }
  }

  client.from('evaluaciones').select('*').eq('id',id).single().then(function(r){
    if(r.error)return;
    document.getElementById('quiz-title-input').value=r.data.titulo||'Cuestionario sin título';
    evCode=r.data.codigo;
    iniciado=r.data.iniciado;
    if(document.getElementById('settings-subject')) document.getElementById('settings-subject').value=r.data.asignatura||'Otro';
    if(document.getElementById('settings-topic')) document.getElementById('settings-topic').value=r.data.tema||'';
    
    // Sync to side panel if exists
    if(document.getElementById('side-settings-subject')) document.getElementById('side-settings-subject').value=r.data.asignatura||'Otro';
    if(document.getElementById('side-settings-topic')) document.getElementById('side-settings-topic').value=r.data.tema||'';

    if(document.getElementById('settings-level')) document.getElementById('settings-level').value=r.data.nivel||'Seleccione el grado...';
    if(document.getElementById('settings-lang')) document.getElementById('settings-lang').value=r.data.idioma||'español, castellano';
    parseGameConfigFromEval(r.data.config_juego);
    titleLoaded=true; checkPlay();
  });
  client.from('evaluacion_preguntas').select('*').eq('evaluacion_id',id).order('orden').then(function(r){
    if(r.error||!r.data)return;
    questions=r.data.map(function(p){
      return{dbId:p.id,id:Date.now()+Math.random(),type:p.tipo,text:p.texto,options:p.opciones||[],multipleCorrect:p.multiple_correctas||false,points:p.puntos||1,timer:p.temporizador||30};
    });
    syncGameConfigQuestionIds();
    renderQuestionThumbs();updateStats();renderGameConfigPanel();
    if(questions.length>0)selectQuestion(0);
    qLoaded=true; checkPlay();
  });
}

function saveQuizTitle() {
  // Solo marcar que hay cambios pendientes — no auto-guardar
  markUnsavedChanges();
}

// ═══ RENDER QUESTION TYPES ═══
function renderQuestionTypes(){
  var c=document.getElementById('qtypes-container');if(!c)return;
  var html='';
  var cats=Object.keys(questionTypes);
  for(var i=0;i<cats.length;i++){
    var cat=cats[i],types=questionTypes[cat];
    html+='<div class="qtypes-section"><h3>'+cat+'</h3><div class="qtypes-grid">';
    for(var t=0;t<types.length;t++){
      var ty=types[t];
      html+='<div class="qtype-item" onclick="selectQuestionType(\''+ty.id+'\')"><div class="qi-icon '+ty.css+'">'+ty.icon+'</div><span>'+ty.name+'</span></div>';
    }
    html+='</div></div>';
  }
  c.innerHTML=html;
}

// ═══ SELECT QUESTION TYPE ═══
function selectQuestionType(typeId){
  var opts;
  var typeName = "Opción múltiple";
  var typeIcon = "☑️";

  if(typeId==='tf'){
    opts=[{text:'Verdadero',correct:false,color:'ac-blue'},{text:'Falso',correct:false,color:'ac-pink'}];
    typeName = "Verdadero/Falso"; typeIcon = "⚖️";
  }else if(typeId==='oa' || typeId==='open'){
    typeId = 'oa'; opts=[]; typeName = "Respuesta abierta"; typeIcon = "📝";
  }else if(typeId==='fb'){
    opts=[]; typeName = "Completa los espacios"; typeIcon = "✏️";
  }else if(typeId==='poll'){
    opts=[{text:'',correct:false,color:'ac-blue'},{text:'',correct:false,color:'ac-teal'}];
    typeName = "Encuesta"; typeIcon = "📊";
  }else{
    opts=[{text:'',correct:false,color:'ac-blue'},{text:'',correct:false,color:'ac-teal'},{text:'',correct:false,color:'ac-yellow'},{text:'',correct:false,color:'ac-pink'}];
  }
  
  // Update selector UI
  var labelEl = document.getElementById('type-selector-label');
  var iconEl = document.getElementById('type-selector-icon');
  if(labelEl) labelEl.textContent = typeName;
  if(iconEl) iconEl.textContent = typeIcon;

  var q={id:Date.now()+Math.random(),type:typeId,text:'',options:opts,multipleCorrect:false,points:1,timer:30};
  questions.push(q);currentQuestionIndex=questions.length-1;
  renderQuestionThumbs();updateStats();selectQuestion(currentQuestionIndex);
  document.getElementById('qtypes-panel').style.display='none';
  document.getElementById('question-editor').style.display='block';
}

function toggleTypeDropdown(e){
  if(e) e.stopPropagation();
  var dd = document.getElementById('type-dropdown');
  if(!dd) return;
  dd.classList.toggle('active');
}

// Close dropdown when clicking outside
window.addEventListener('click', function(){
  var dd = document.getElementById('type-dropdown');
  if(dd) dd.classList.remove('active');
});

function changeQuestionType(typeId){
  if(currentQuestionIndex === -1) return;
  var q = questions[currentQuestionIndex];
  if(typeId === 'open') typeId = 'oa';
  if(q.type === typeId) return;

  var typeName = "Selección única";
  var typeIcon = "☑️";
  var opts = q.options;

  if(typeId==='tf'){
    opts=[{text:'Verdadero',correct:false,color:'ac-blue'},{text:'Falso',correct:false,color:'ac-pink'}];
    typeName = "Verdadero/Falso"; typeIcon = "⚖️";
  } else if(typeId==='oa'){
    opts=[]; typeName = "Respuesta abierta"; typeIcon = "📝";
  } else if(typeId==='fb'){
    opts=[]; typeName = "Completa los espacios"; typeIcon = "✏️";
  } else if(typeId==='poll'){
    typeName = "Encuesta"; typeIcon = "📊";
  } else if(typeId==='dnd'){
    typeName = "Identificar partes"; typeIcon = "🖐️";
    if(q.type === 'tf' || q.type === 'oa' || q.type === 'fb') {
       opts=[{text:'',correct:true,color:'ac-blue'},{text:'',correct:true,color:'ac-teal'},{text:'',correct:true,color:'ac-yellow'},{text:'',correct:true,color:'ac-pink'}];
    } else {
       // Make sure all options are flagged correct (since they all represent matches!)
       opts.forEach(function(o){ o.correct = true; });
    }
  } else if(typeId==='ms'){
    typeName = "Selección múltiple"; typeIcon = "✅";
    q.multipleCorrect = true;
    var multiToggle = document.getElementById('multi-toggle');
    if(multiToggle) multiToggle.classList.add('on');
    if(q.type === 'tf' || q.type === 'oa' || q.type === 'fb') {
       opts=[{text:'',correct:false,color:'ac-blue'},{text:'',correct:false,color:'ac-teal'},{text:'',correct:false,color:'ac-yellow'},{text:'',correct:false,color:'ac-pink'}];
    }
  } else {
    typeId = 'mc';
    typeName = "Selección única"; typeIcon = "☑️";
    q.multipleCorrect = false;
    var multiToggle = document.getElementById('multi-toggle');
    if(multiToggle) multiToggle.classList.remove('on');
    if(q.type === 'tf' || q.type === 'oa' || q.type === 'fb') {
       opts=[{text:'',correct:false,color:'ac-blue'},{text:'',correct:false,color:'ac-teal'},{text:'',correct:false,color:'ac-yellow'},{text:'',correct:false,color:'ac-pink'}];
    }
  }

  q.type = typeId;
  q.options = opts;
  
  var labelEl = document.getElementById('type-selector-label');
  var iconEl = document.getElementById('type-selector-icon');
  if(labelEl) labelEl.textContent = typeName;
  if(iconEl) iconEl.textContent = typeIcon;

  renderAnswerOptions();
  renderQuestionThumbs();
  showToast('Tipo de pregunta cambiado', 'success');
}

function syncSideSettings(field) {
  var sideSubject = document.getElementById('side-settings-subject');
  var sideTopic = document.getElementById('side-settings-topic');
  var mainSubject = document.getElementById('settings-subject');
  var mainTopic = document.getElementById('settings-topic');

  // Solo sincronizar valores entre paneles — sin guardar a Supabase
  if(field === 'subject') {
    if(mainSubject && sideSubject) mainSubject.value = sideSubject.value;
  } else if(field === 'topic') {
    if(mainTopic && sideTopic) mainTopic.value = sideTopic.value;
  }
  markUnsavedChanges();
}

// ═══ SHOW EDITOR / TYPES ═══
function showEditor(){
  showingTypes=false;
  document.getElementById('qtypes-panel').style.display='none';
  var ed=document.getElementById('question-editor');ed.classList.add('active');
  var q=questions[currentQuestionIndex];
  // Show/hide elements based on type
  var addBtn=document.getElementById('add-option-btn');
  if(q.type==='oa'||q.type==='fb'){addBtn.style.display='none';}
  else{addBtn.style.display='flex';}
  renderAnswerOptions();
  // Update points/timer pills
  document.getElementById('points-label').textContent=q.points+' punto'+(q.points!==1?'s':'');
  document.getElementById('timer-label').textContent=formatTimer(q.timer);
  renderQuestionImagePreview();
}

function renderQuestionImagePreview(){
  var box=document.getElementById('question-image-preview');
  if(!box||currentQuestionIndex<0)return;
  var q=questions[currentQuestionIndex];
  var url=getQuestionImage(q);
  if(q.type==='dnd'){
    box.innerHTML='';
    box.style.display='none';
    return;
  }
  box.style.display='block';
  if(url){
    box.innerHTML='<div class="question-image-card"><img src="'+editorEscapeHtml(url)+'" alt="Imagen de la pregunta"><div class="question-image-actions"><button type="button" onclick="openQuestionImagePicker()"><i class="fas fa-sync-alt"></i> Cambiar</button><button type="button" class="danger" onclick="clearQuestionImage()"><i class="fas fa-trash-alt"></i> Quitar</button></div></div>';
  }else{
    box.innerHTML='<div class="question-image-empty" onclick="openQuestionImagePicker()"><i class="fas fa-image"></i><span>Agregar imagen a la pregunta</span></div>';
  }
}

function showTypesPanel(){
  showingTypes=true;
  document.getElementById('qtypes-panel').style.display='block';
  document.getElementById('question-editor').classList.remove('active');
}

function updateTypeLabel(typeId){
  var all=[];var cats=Object.keys(questionTypes);
  for(var i=0;i<cats.length;i++)all=all.concat(questionTypes[cats[i]]);
  for(var j=0;j<all.length;j++){
    if(all[j].id===typeId){
      document.getElementById('type-selector-label').textContent=all[j].name;
      document.getElementById('type-selector-icon').textContent=all[j].icon;
      break;
    }
  }
}

// ═══ RENDER ANSWER OPTIONS ═══
function renderAnswerOptions(){
  var c=document.getElementById('answer-options');
  if(!c||currentQuestionIndex<0)return;
  var q=questions[currentQuestionIndex];

  // Open ended — show text area preview
  if(q.type==='oa'){
    c.innerHTML = '<div class="oa-editor-preview">' +
      '<div class="oa-no-score-badge"><i class="fas fa-pen-nib"></i> Pregunta abierta — No suma ni resta puntos al puntaje</div>' +
      '<div class="oa-preview-field">' +
        '<div class="oa-preview-placeholder"><i class="fas fa-pencil-alt"></i> El estudiante escribirá su respuesta aquí...</div>' +
        '<div class="oa-preview-hint">3000 caracteres máximo · La respuesta queda registrada para revisión del docente</div>' +
      '</div>' +
      '<div class="oa-preview-footer">' +
        '<span class="oa-preview-footer-note"><i class="fas fa-info-circle"></i> Esta pregunta es de redacción libre — cualquier respuesta escrita es válida</span>' +
        '<button class="oa-preview-send-btn" disabled><i class="fas fa-paper-plane"></i> Enviar respuesta</button>' +
      '</div>' +
    '</div>';
    return;
  }
  // Identificar partes (Drag and Drop image labeling)
  if(q.type === 'dnd'){
    var imageVal = (q.options && q.options[0]) ? (q.options[0].pregunta_imagen || '') : '';
    var isLocatingAny = (activeLocatingOption !== -1);
    
    var html = '<div class="dnd-editor-root">';
    
    // ── STEP 1: IMAGE UPLOAD ZONE ──
    if(!imageVal){
      html += '<div class="dnd-upload-section">';
      html += '  <div class="dnd-step-header"><span class="dnd-step-number">1</span><span class="dnd-step-title">Sube o pega la imagen anatómica</span></div>';
      html += '  <div id="dnd-dropzone" class="dnd-dropzone" onclick="document.getElementById(\'dnd-file-input\').click()" ondragover="event.preventDefault();this.classList.add(\'dnd-dropzone-active\')" ondragleave="this.classList.remove(\'dnd-dropzone-active\')" ondrop="handleDndFileDrop(event)">';
      html += '    <input type="file" id="dnd-file-input" accept="image/*" style="display:none" onchange="handleDndFileSelect(event)">';
      html += '    <div class="dnd-dropzone-icon"><i class="fas fa-cloud-upload-alt"></i></div>';
      html += '    <div class="dnd-dropzone-title">Arrastra tu imagen aquí</div>';
      html += '    <div class="dnd-dropzone-subtitle">o haz clic para seleccionar un archivo</div>';
      html += '    <div class="dnd-dropzone-formats"><i class="fas fa-image"></i> JPG, PNG, GIF, WebP — Máx 5MB</div>';
      html += '  </div>';
      html += '  <div class="dnd-url-divider"><span>o pega una URL</span></div>';
      html += '  <div class="dnd-url-row">';
      html += '    <input type="text" id="dnd-image-input" placeholder="https://ejemplo.com/anatomia.jpg" class="dnd-url-input" onkeydown="if(event.key===\'Enter\')updateDndImage(this.value)">';
      html += '    <button onclick="updateDndImage(document.getElementById(\'dnd-image-input\').value)" class="dnd-url-btn"><i class="fas fa-arrow-right"></i></button>';
      html += '  </div>';
      html += '</div>';
    } else {
      // ── IMAGE LOADED: SHOW MAP + PIN PLACEMENT ──
      html += '<div class="dnd-loaded-section">';
      
      // Header with image info
      html += '  <div class="dnd-loaded-header">';
      html += '    <div class="dnd-step-header"><span class="dnd-step-number">1</span><span class="dnd-step-title">Imagen cargada</span><span class="dnd-img-badge"><i class="fas fa-check-circle"></i> Lista</span></div>';
      html += '    <button onclick="clearDndImage()" class="dnd-change-img-btn"><i class="fas fa-sync-alt"></i> Cambiar imagen</button>';
      html += '  </div>';
      
      // ── STEP 2: PIN PLACEMENT ──
      html += '  <div class="dnd-step-header" style="margin-top:20px"><span class="dnd-step-number">2</span><span class="dnd-step-title">Ubica cada parte en la imagen</span></div>';
      
      if(isLocatingAny) {
        var locatingName = q.options[activeLocatingOption] ? (q.options[activeLocatingOption].text || 'Opción ' + String.fromCharCode(65+activeLocatingOption)) : '';
        html += '  <div class="dnd-locating-banner"><i class="fas fa-crosshairs dnd-pulse-icon"></i> Haz clic en la imagen para ubicar: <strong>' + locatingName + '</strong></div>';
      } else {
        html += '  <div class="dnd-hint-banner"><i class="fas fa-info-circle"></i> Presiona <strong>"📍 Ubicar"</strong> en una opción y luego haz clic en la imagen donde corresponde.</div>';
      }
      
      // Map container
      html += '  <div class="dnd-map-wrapper">';
      html += '    <div id="dnd-map-container" class="dnd-map-container' + (isLocatingAny ? ' dnd-map-active' : '') + '">';
      html += '      <div class="dnd-image-stage" onclick="handleDndImageClick(event)">';
      html += '        <img src="' + imageVal + '" class="dnd-map-img" id="dnd-preview-img">';
      
      // Render placed pins
      for(var i=0; i<q.options.length; i++){
        var o = q.options[i];
        if(o.pinX !== undefined && o.pinY !== undefined){
          var pinColors = {
            'ac-blue': '#2563EB', 'ac-teal': '#0D9488', 'ac-yellow': '#D97706', 'ac-pink': '#DC2626', 'ac-purple': '#7C3AED', 'ac-green': '#059669'
          };
          var pinColor = pinColors[o.color] || '#E91E63';
          html += '        <div class="dnd-pin-anchor" style="--pin-x:' + o.pinX + '; --pin-y:' + o.pinY + '; left:' + o.pinX + '%; top:' + o.pinY + '%; background:' + pinColor + ';"></div>';
          html += '        <div class="dnd-pin-connector" style="--pin-x:' + o.pinX + '; --pin-y:' + o.pinY + '; left:' + o.pinX + '%; top:' + o.pinY + '%; background:linear-gradient(90deg,' + pinColor + ',rgba(255,255,255,0.12));"></div>';
          html += '        <div class="dnd-pin" style="--pin-x:' + o.pinX + '; --pin-y:' + o.pinY + '; left:' + o.pinX + '%; top:' + o.pinY + '%; background:' + pinColor + ';">';
          html += '        <span class="dnd-pin-letter">' + String.fromCharCode(65+i) + '</span>';
          html += '        <div class="dnd-pin-pulse" style="border-color:' + pinColor + '"></div>';
          if(o.text) html += '        <div class="dnd-pin-tooltip">' + o.text + '</div>';
          html += '      </div>';
        }
      }
      
      html += '      </div>';
      html += '    </div>';
      html += '  </div>';
      
      html += '</div>';
    }
    
    // ── STEP 3: LABELS LIST ──
    html += '<div class="dnd-labels-section">';
    html += '  <div class="dnd-step-header"><span class="dnd-step-number">3</span><span class="dnd-step-title">Nombres de las partes a identificar</span></div>';
    html += '  <div class="dnd-labels-list">';
    
    for(var i=0; i<q.options.length; i++){
      var o = q.options[i];
      var isLocating = (activeLocatingOption === i);
      var pinPlaced = (o.pinX !== undefined && o.pinY !== undefined);
      var labelColors = {
        'ac-blue': ['#2563EB','#1D4ED8'], 'ac-teal': ['#0D9488','#0F766E'], 'ac-yellow': ['#D97706','#B45309'],
        'ac-pink': ['#DC2626','#B91C1C'], 'ac-purple': ['#7C3AED','#6D28D9'], 'ac-green': ['#059669','#047857']
      };
      var lc = labelColors[o.color] || ['#6366F1','#4F46E5'];
      
      html += '    <div class="dnd-label-card" style="--label-color:' + lc[0] + '; --label-dark:' + lc[1] + ';">';
      html += '      <div class="dnd-label-left">';
      html += '        <div class="dnd-label-letter" style="background:' + lc[0] + '">' + String.fromCharCode(65+i) + '</div>';
      html += '        <input class="dnd-label-input" placeholder="Nombre de esta parte..." value="' + (o.text || '').replace(/"/g, '&quot;') + '" oninput="updateOption(' + i + ',this.value)">';
      html += '      </div>';
      html += '      <div class="dnd-label-right">';
      
      // Status indicator
      if(pinPlaced) {
        html += '        <div class="dnd-label-status dnd-status-ok"><i class="fas fa-check-circle"></i> Ubicado</div>';
      } else {
        html += '        <div class="dnd-label-status dnd-status-pending"><i class="fas fa-exclamation-circle"></i> Sin ubicar</div>';
      }
      
      // Locate button
      if(isLocating) {
        html += '        <button onclick="cancelDndLocate()" class="dnd-locate-btn dnd-locate-active"><i class="fas fa-times"></i> Cancelar</button>';
      } else {
        html += '        <button onclick="startDndLocate(' + i + ')" class="dnd-locate-btn' + (pinPlaced ? ' dnd-locate-remap' : '') + '"><i class="fas fa-map-marker-alt"></i> ' + (pinPlaced ? 'Reubicar' : 'Ubicar') + '</button>';
      }
      
      // Delete button
      html += '        <button class="dnd-label-delete" onclick="removeOption(' + i + ')"><i class="fas fa-trash-alt"></i></button>';
      html += '      </div>';
      html += '    </div>';
    }
    
    html += '  </div>';
    html += '</div>';
    
    html += '</div>';
    
    c.innerHTML = html;
    return;
  }
  // Fill in blanks
  if(q.type==='fb'){
    var fbAnswer = (q.options && q.options.length > 0) ? q.options[0].text : '';
    c.innerHTML='<div style="width:100%;background:#fff;border:1px solid #E4E6EF;border-radius:12px;padding:20px;text-align:center">'
      +'<p style="color:#555;font-size:14px;margin-bottom:12px">Escribe tu pregunta arriba y usa <button onclick="insertBlank()" style="background:#E91E63;color:#fff;border:none;padding:4px 12px;border-radius:6px;font-weight:600;cursor:pointer">+ Espacio</button> para agregar un espacio en blanco</p>'
      +'<div style="margin-top:20px;text-align:left;max-width:500px;margin-left:auto;margin-right:auto;">'
      +'<label style="font-weight:700;color:#334155;margin-bottom:8px;display:block;">Respuesta correcta (patrón de autoevaluación):</label>'
      +'<input type="text" value="'+fbAnswer.replace(/"/g,'&quot;')+'" placeholder="Escribe la palabra exacta..." style="width:100%;padding:12px;border-radius:8px;border:2px solid #E2E8F0;font-size:1rem;color:#0F172A;font-weight:600;" onchange="updateFbAnswer(this.value)">'
      +'<p style="color:#94A3B8;font-size:12px;margin-top:6px;">Si hay varias opciones aceptadas, sepáralas con comas (ej. <b>núcleo,nucleo,núcleos</b>).</p>'
      +'</div></div>';
    return;
  }

  var html='';
  for(var i=0;i<q.options.length;i++){
    var o=q.options[i];
    if(q.type==='tf'){
      html+='<div class="answer-card '+o.color+'"><span class="ac-input-display">'+o.text+'</span><button class="ac-correct '+(o.correct?'selected':'')+'" onclick="toggleCorrect('+i+')">✓</button></div>';
    }else{
      var isPoll=(q.type==='poll');
      html+='<div class="answer-card '+o.color+'">'
        +'<button class="ac-delete" onclick="removeOption('+i+')"><i class="fas fa-trash"></i></button>'
        +'<input class="ac-input" placeholder="Escriba la opción de respuesta aquí" value="'+(o.text||'').replace(/"/g,'&quot;')+'" oninput="updateOption('+i+',this.value)">'
        +(isPoll?'':'<button class="ac-correct '+(o.correct?'selected':'')+'" onclick="toggleCorrect('+i+')">✓</button>')
        +'</div>';
    }
  }
  c.innerHTML=html;
}

// ═══ ANSWER HELPERS ═══
function updateFbAnswer(val) {
   var q = questions[currentQuestionIndex];
   if (!q.options) q.options = [];
   if (q.options.length === 0) q.options.push({text: '', correct: true, color: 'ac-blue'});
   q.options[0].text = val;
   q.options[0].correct = true;
}

function toggleCorrect(idx){
  var q=questions[currentQuestionIndex];
  if(!q.multipleCorrect){for(var i=0;i<q.options.length;i++)q.options[i].correct=(i===idx);}
  else{q.options[idx].correct=!q.options[idx].correct;}
  renderAnswerOptions();
}
function updateOption(idx,val){questions[currentQuestionIndex].options[idx].text=val;}
function removeOption(idx){
  var q=questions[currentQuestionIndex];if(q.options.length<=2)return;
  q.options.splice(idx,1);renderAnswerOptions();
}
function addOption(){
  var q=questions[currentQuestionIndex];if(q.options.length>=6)return;
  var colors=['ac-blue','ac-teal','ac-yellow','ac-pink','ac-purple','ac-green'];
  q.options.push({text:'',correct:false,color:colors[q.options.length%6],pregunta_imagen:getQuestionImage(q)});
  renderAnswerOptions();
}
function toggleMultipleAnswers(){
  var q=questions[currentQuestionIndex];
  q.multipleCorrect=!q.multipleCorrect;
  if(q.type === 'mc' || q.type === 'ms') {
    q.type = q.multipleCorrect ? 'ms' : 'mc';
    updateTypeLabel(q.type);
  }
  document.getElementById('multi-toggle').classList.toggle('on',q.multipleCorrect);
  renderQuestionThumbs();
}
function insertBlank(){
  var inp=document.getElementById('q-text-input');
  var pos=inp.selectionStart;var val=inp.value;
  inp.value=val.substring(0,pos)+' _____ '+val.substring(pos);
  inp.focus();
}

// ═══ POINTS & TIMER ═══
function cyclePoints(){
  var q=questions[currentQuestionIndex];
  pointsIdx=(pointsIdx+1)%pointsOptions.length;
  q.points=pointsOptions[pointsIdx];
  document.getElementById('points-label').textContent=q.points+' punto'+(q.points!==1?'s':'');
}
function cycleTimer(){
  var q=questions[currentQuestionIndex];
  timerIdx=(timerIdx+1)%timerOptions.length;
  q.timer=timerOptions[timerIdx];
  document.getElementById('timer-label').textContent=formatTimer(q.timer);
}
function formatTimer(s){
  if(s<60)return s+' segundos';
  return Math.floor(s/60)+' minuto'+(s>=120?'s':'');
}

// ═══ QUESTION THUMBNAILS ═══
function renderQuestionThumbs(){
  var c=document.getElementById('question-thumbs-list');if(!c)return;
  var html='';
  for(var i=0;i<questions.length;i++){
    var q=questions[i];
    var typeColors={mc:'#2E7D32',ms:'#2E7D32',tf:'#C62828',fb:'#1565C0',oa:'#E65100',poll:'#7B1FA2',dnd:'#00838F',cat:'#2E7D32',ro:'#1565C0',mt:'#EF6C00'};
    html+='<div class="q-thumb '+(i===currentQuestionIndex?'active':'')+'" onclick="selectQuestion('+i+')">'
      +'<span>'+(i+1)+'</span>'
      +'<span class="thumb-type" style="background:'+(typeColors[q.type]||'#888')+'">'+(i+1)+'</span>'
      +'<button type="button" class="q-thumb-delete" title="Eliminar pregunta" onclick="deleteQuestion('+i+',event)"><i class="fas fa-trash-alt"></i></button>'
      +'</div>';
  }
  c.innerHTML=html;
  renderGameConfigPanel();
}

function selectQuestion(idx){
  currentQuestionIndex=idx;
  var q=questions[idx];
  
  // Align type with multipleCorrect
  if (q.type === 'mc' && q.multipleCorrect) {
    q.type = 'ms';
  } else if (q.type === 'ms' && !q.multipleCorrect) {
    q.type = 'mc';
  }
  
  showEditor();
  updateTypeLabel(q.type);
  document.getElementById('q-text-input').value=q.text||'';
  document.getElementById('multi-toggle').classList.toggle('on',q.multipleCorrect);
  renderQuestionThumbs();
}

function deleteQuestion(idx,event){
  if(event){event.preventDefault();event.stopPropagation();}
  if(idx<0||idx>=questions.length)return;
  var q=questions[idx];
  var title=(q.text||'').replace(/<[^>]+>/g,'').trim();
  if(title.length>80)title=title.slice(0,80)+'...';
  var msg='Eliminar la pregunta '+(idx+1)+(title?'\\n"'+title+'"':'')+'?\\n\\nEsta accion no se puede deshacer.';
  if(!window.confirm(msg))return;

  function removeLocal(){
    var deletedId=q.dbId;
    questions.splice(idx,1);
    if(deletedId){
      gameConfig.questionOrder=gameConfig.questionOrder.filter(function(id){return id!==deletedId;});
    }
    syncGameConfigQuestionIds();
    if(currentQuestionIndex>idx)currentQuestionIndex--;
    else if(currentQuestionIndex===idx)currentQuestionIndex=Math.min(idx,questions.length-1);

    renderQuestionThumbs();
    updateStats();
    renderGameConfigPanel();
    markUnsavedChanges();

    if(questions.length>0 && currentQuestionIndex>=0){
      selectQuestion(currentQuestionIndex);
    }else{
      currentQuestionIndex=-1;
      showTypesPanel();
    }
    showToast('Pregunta eliminada', 'success');
  }

  if(q.dbId){
    var client=getSupabase();
    client.from('evaluacion_preguntas').delete().eq('id',q.dbId).then(function(r){
      if(r.error){showToast('No se pudo eliminar: '+r.error.message,'error');return;}
      removeLocal();
    });
  }else{
    removeLocal();
  }
}

// ═══ UPDATE STATS ═══
function updateStats(){
  var pts=0,time=0;
  for(var i=0;i<questions.length;i++){pts+=(questions[i].points||1);time+=(questions[i].timer||30);}
  document.getElementById('stat-questions').textContent=questions.length+' Pregunta'+(questions.length!==1?'s':'');
  document.getElementById('stat-points').textContent=pts+' Punto'+(pts!==1?'s':'');
  var mins=Math.ceil(time/60);
  document.getElementById('stat-time').textContent=mins+' minuto'+(mins!==1?'s':'');
}

// ═══ SAVE QUESTION (validar y registrar localmente, luego guardar en DB si la evaluación existe) ═══
function saveQuestion(){
  if(saving)return;
  var q=questions[currentQuestionIndex];
  var inp=document.getElementById('q-text-input');
  if(inp)q.text=inp.value;
  if(!q.text||!q.text.trim()){showToast('Escribe el texto de la pregunta','error');return;}
  // Validate correct answer (except poll/oa/fb/dnd)
  if(q.type === 'dnd'){
    var imgVal = (q.options && q.options[0]) ? q.options[0].pregunta_imagen : '';
    if(!imgVal || !imgVal.trim()){showToast('Agrega la URL de la imagen para identificar partes','error');return;}
    for(var i=0; i<q.options.length; i++){
      if(q.options[i].pinX === undefined || q.options[i].pinY === undefined){
        showToast('Ubica la posición en la imagen para la opción ' + String.fromCharCode(65+i),'error');
        return;
      }
    }
  }
  if(q.type!=='poll'&&q.type!=='oa'&&q.type!=='fb'&&q.type!=='dnd'){
    var hasC=false;for(var i=0;i<q.options.length;i++){if(q.options[i].correct)hasC=true;}
    if(!hasC){showToast('Selecciona al menos una respuesta correcta','error');return;}
  }

  // Si la evaluación ya existe en DB, guardar la pregunta directamente
  if(evaluacionId){
    saving=true;
    var btn=document.querySelector('.save-question-btn');
    if(btn){btn.innerHTML='<i class="fas fa-spinner fa-spin"></i> Guardando...';btn.disabled=true;}

    var data={evaluacion_id:evaluacionId,tipo:q.type,texto:q.text.trim(),opciones:q.options,multiple_correctas:q.multipleCorrect,orden:currentQuestionIndex,puntos:q.points||1,temporizador:q.timer||30};
    var client=getSupabase();

    if(q.dbId){
      client.from('evaluacion_preguntas').update(data).eq('id',q.dbId).select().then(function(r){
        saving=false;if(btn){btn.innerHTML='<i class="fas fa-save"></i> Guardar pregunta';btn.disabled=false;}
        if(r.error){showToast('Error: '+r.error.message,'error');return;}
        showToast('✅ Pregunta '+(currentQuestionIndex+1)+' actualizada','success');
        showTypesPanel();renderQuestionThumbs();updateStats();
      });
    }else{
      client.from('evaluacion_preguntas').insert(data).select().then(function(r){
        saving=false;if(btn){btn.innerHTML='<i class="fas fa-save"></i> Guardar pregunta';btn.disabled=false;}
        if(r.error){showToast('Error: '+r.error.message,'error');return;}
        q.dbId=r.data[0].id;
        showToast('✅ Pregunta '+(currentQuestionIndex+1)+' guardada','success');
        showTypesPanel();renderQuestionThumbs();updateStats();
      });
    }
  } else {
    // Si la evaluación NO existe aún, solo validar localmente
    showToast('✅ Pregunta '+(currentQuestionIndex+1)+' lista — Presiona "Guardar" arriba para almacenar todo','success');
    showTypesPanel();renderQuestionThumbs();updateStats();
  }
}

// ═══ MARCAR CAMBIOS NO GUARDADOS ═══
var hasUnsavedChanges = false;
function markUnsavedChanges(){
  hasUnsavedChanges = true;
  var saveBtn = document.getElementById('save-quiz-btn');
  if(saveBtn){
    saveBtn.classList.add('btn-unsaved');
    saveBtn.title = 'Hay cambios sin guardar';
  }
}
function clearUnsavedChanges(){
  hasUnsavedChanges = false;
  var saveBtn = document.getElementById('save-quiz-btn');
  if(saveBtn){
    saveBtn.classList.remove('btn-unsaved');
    saveBtn.title = 'Guardar Evaluación';
  }
}

// ═══ GUARDAR EVALUACIÓN COMPLETA (BOTÓN "GUARDAR") ═══
function saveEvaluationTransaction(){
  if(saving) return;
  saving = true;

  var saveBtn = document.getElementById('save-quiz-btn');
  var originalHTML = saveBtn ? saveBtn.innerHTML : '';
  if(saveBtn){
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span class="install-text">Guardando...</span>';
    saveBtn.disabled = true;
  }

  // Recoger texto de pregunta actual si está abierta
  if(currentQuestionIndex >= 0 && currentQuestionIndex < questions.length){
    var inp = document.getElementById('q-text-input');
    if(inp) questions[currentQuestionIndex].text = inp.value;
  }

  var titulo = document.getElementById('quiz-title-input').value || 'Cuestionario sin título';
  var asignatura = (document.getElementById('settings-subject') || document.getElementById('side-settings-subject') || {}).value || 'Otro';
  var tema = (document.getElementById('settings-topic') || document.getElementById('side-settings-topic') || {}).value || '';
  var nivel = (document.getElementById('settings-level') || {}).value || '';
  var idioma = (document.getElementById('settings-lang') || {}).value || 'español, castellano';

  var client = getSupabase();

  function finishSave(err){
    saving = false;
    if(saveBtn){
      saveBtn.innerHTML = originalHTML;
      saveBtn.disabled = false;
    }
    if(err){
      showToast('Error al guardar: ' + err, 'error');
    } else {
      clearUnsavedChanges();
      showToast('✅ Evaluación guardada correctamente', 'success');
    }
  }

  function saveGameConfigToDb(done){
    syncGameConfigQuestionIds();
    var cfg = collectGameConfigForSave();
    client.from('evaluaciones').update({
      config_juego: cfg,
      updated_at: new Date().toISOString()
    }).eq('id', evaluacionId).then(function(r){
      if(r.error) done(r.error.message);
      else done(null);
    });
  }

  function saveAllQuestions(){
    if(questions.length === 0){
      if(!evaluacionId){ finishSave(null); return; }
      saveGameConfigToDb(function(cfgErr){ finishSave(cfgErr); });
      return;
    }
    var pending = questions.length;
    var anyError = null;

    for(var i = 0; i < questions.length; i++){
      (function(idx){
        var q = questions[idx];
        var data = {
          evaluacion_id: evaluacionId,
          tipo: q.type,
          texto: (q.text || '').trim(),
          opciones: q.options,
          multiple_correctas: q.multipleCorrect,
          orden: idx,
          puntos: q.points || 1,
          temporizador: q.timer || 30
        };

        if(q.dbId){
          client.from('evaluacion_preguntas').update(data).eq('id', q.dbId).select().then(function(r){
            if(r.error) anyError = r.error.message;
            pending--;
            if(pending <= 0){
              saveGameConfigToDb(function(cfgErr){
                finishSave(anyError || cfgErr);
              });
            }
          });
        } else {
          if(!data.texto){
            pending--;
            if(pending <= 0){
              saveGameConfigToDb(function(cfgErr){
                finishSave(anyError || cfgErr);
              });
            }
            return;
          }
          client.from('evaluacion_preguntas').insert(data).select().then(function(r){
            if(r.error){ anyError = r.error.message; }
            else { q.dbId = r.data[0].id; }
            pending--;
            if(pending <= 0){
              saveGameConfigToDb(function(cfgErr){
                finishSave(anyError || cfgErr);
              });
            }
          });
        }
      })(i);
    }
  }

  var evalData = {
    titulo: titulo,
    asignatura: asignatura,
    tema: tema,
    nivel: nivel,
    idioma: idioma,
    updated_at: new Date().toISOString()
  };

  if(evaluacionId){
    // Actualizar evaluación existente
    client.from('evaluaciones').update(evalData).eq('id', evaluacionId).then(function(r){
      if(r.error){ finishSave(r.error.message); return; }
      saveAllQuestions();
    });
  } else {
    // Crear nueva evaluación
    evalData.created_by = currentUser.id;
    evalData.publicado = false;
    client.from('evaluaciones').insert(evalData).select().then(function(r){
      if(r.error){ finishSave(r.error.message); return; }
      evaluacionId = r.data[0].id;
      // Actualizar URL sin recargar
      var newUrl = window.location.pathname + '?id=' + evaluacionId;
      window.history.replaceState({}, '', newUrl);
      saveAllQuestions();
    });
  }
}

// ═══ SETTINGS ═══
function openSettings(){document.getElementById('settings-overlay').classList.add('active');
  var t=document.getElementById('quiz-title-input').value;
  var n=document.getElementById('quiz-name-input');if(n)n.value=t;
}
function closeSettings(){document.getElementById('settings-overlay').classList.remove('active');}

function saveSettingsAndPublish(){
  if(!evaluacionId){
    closeSettings();
    showToast('Primero guarda la evaluación con el botón Guardar','error');
    return;
  }
  var nameInp=document.getElementById('quiz-name-input');
  var titulo=(nameInp&&nameInp.value)?nameInp.value:'Cuestionario sin título';
  document.getElementById('quiz-title-input').value=titulo;

  var vis='publica';
  var vos=document.querySelectorAll('.vis-option');
  for(var i=0;i<vos.length;i++){
    if(vos[i].classList.contains('selected')){
      var h4=vos[i].querySelector('h4');
      if(h4){var t=h4.textContent.toLowerCase();
        if(t.indexOf('restringido')!==-1)vis='restringido';
        else if(t.indexOf('organización')!==-1)vis='organizacion';
      }break;
    }
  }
  var obj='';var gc=document.querySelectorAll('.goal-chip.selected');
  if(gc.length>0)obj=gc[0].textContent;

  var client=getSupabase();
  client.from('evaluaciones').update({
    titulo:titulo,
    asignatura:(document.getElementById('settings-subject')||{}).value||'Otro',
    tema:(document.getElementById('settings-topic')||{}).value||'',
    nivel:(document.getElementById('settings-level')||{}).value||'',
    idioma:(document.getElementById('settings-lang')||{}).value||'Español',
    visibilidad:vis,objetivo:obj,updated_at:new Date().toISOString()
  }).eq('id',evaluacionId).then(function(r){
    if(r.error){showToast('Error al guardar ajustes','error');}
    else{showToast('✅ Ajustes guardados','success');}
  });
  closeSettings();
  // Proceed to publish
  publishQuiz();
}

// ═══ PUBLISH ═══
function publishQuiz(){
  if(!evaluacionId){showToast('Primero guarda la evaluación con el botón Guardar','error');return;}
  if(questions.length===0){showToast('Agrega al menos una pregunta','error');return;}
  var unsaved=[];
  for(var i=0;i<questions.length;i++){if(!questions[i].dbId)unsaved.push(i+1);}
  if(unsaved.length>0){showToast('Guarda la evaluación primero (botón Guardar)','error');return;}
  // Open session mode selector
  document.getElementById('session-overlay').classList.add('active');
}

function selectSessionMode(el,mode){
  sessionMode=mode;
  var all=document.querySelectorAll('.session-mode-card');
  for(var i=0;i<all.length;i++)all[i].classList.remove('selected');
  el.classList.add('selected');
}
function closeSessionModal(){document.getElementById('session-overlay').classList.remove('active');}

function generateQuizCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var i = 0; i < 6; i++) { code += chars.charAt(Math.floor(Math.random() * chars.length)); }
  return code;
}

function startLiveSession(){
  closeSessionModal();
  var client=getSupabase();

  var code = generateQuizCode();
  var isTest = sessionMode === 'test';

  // Limpiar participantes anteriores e insertar código en un solo paso
  // (evaluacion_resultados se mantiene intacto para preservar el historial)
  client.from('evaluacion_participantes').delete().eq('evaluacion_id', evaluacionId).then(function(delRes){
    // Ignoramos error de delete si es por RLS (puede que el admin no tenga política DELETE configurada aún)
    var updateData = {
      publicado: true,
      codigo: code,
      iniciado: isTest,
      modo_sesion: sessionMode,
      updated_at: new Date().toISOString()
    };
    client.from('evaluaciones').update(updateData).eq('id',evaluacionId).then(function(r){
      if(r.error){console.error('Update evaluaciones error:', JSON.stringify(r.error));showToast('Error al publicar: ' + (r.error.message||r.error.details||JSON.stringify(r.error)),'error');return;}
      if(isTest) {
        showTestModeActive(code);
      } else {
        showLobby(code);
      }
    });
  });
}

// ═══ MODO TEST — Panel de administración para examen a ritmo propio ═══
function showTestModeActive(code) {
  // Guardar sesión activa
  sessionStorage.setItem('alcocer_teacher_eval', evaluacionId);
  
  var title = document.getElementById('quiz-title-input').value;
  document.getElementById('lobby-quiz-title').textContent = title;
  document.getElementById('lobby-question-count').textContent = questions.length + ' preguntas';
  document.getElementById('lobby-code').textContent = code;
  document.getElementById('lobby-player-count').textContent = '0';
  document.getElementById('lobby-overlay').classList.add('active');

  // Generar QR
  generateLobbyQR(code);

  // Música del lobby
  startLobbyMusic();

  // Limpiar contenedor visualmente e iniciar polling inmediatamente
  var container = document.getElementById('lobby-players-list');
  if(container) container.innerHTML = '';
  document.getElementById('lobby-player-count').textContent = '0';
  pollLobbyParticipants();
  if(lobbyPollInterval) clearInterval(lobbyPollInterval);
  lobbyPollInterval = setInterval(pollLobbyParticipants, 3000);

  // Cambiar el botón EMPEZAR por "Ver Resultados" en modo test
  var startBtn = document.querySelector('.lobby-btn-start');
  if(startBtn) {
    startBtn.innerHTML = '<i class="fas fa-chart-bar"></i> VER RESULTADOS EN VIVO';
    startBtn.onclick = function() {
      startGameFromLobby();
    };
  }

  // Mostrar badge de modo test
  var lobbyBody = document.querySelector('.lobby-body');
  if(lobbyBody && !document.getElementById('test-mode-badge')) {
    var badge = document.createElement('div');
    badge.id = 'test-mode-badge';
    badge.style.cssText = 'text-align:center;padding:12px 20px;background:linear-gradient(135deg,rgba(37,99,235,0.2),rgba(37,99,235,0.05));border:1px solid rgba(37,99,235,0.3);border-radius:14px;margin:12px auto 0;max-width:400px;';
    badge.innerHTML = '<div style="display:flex;align-items:center;gap:10px;justify-content:center;">' +
      '<i class="fas fa-clipboard-check" style="color:#3B82F6;font-size:1.3rem;"></i>' +
      '<div style="text-align:left;">' +
      '<div style="color:#fff;font-weight:800;font-size:0.95rem;">📋 Modo Test Activo</div>' +
      '<div style="color:rgba(255,255,255,0.6);font-size:0.8rem;font-weight:500;">Los estudiantes comienzan al ingresar el código — Sin sala de espera</div>' +
      '</div></div>';
    lobbyBody.insertBefore(badge, lobbyBody.firstChild);
  }
}

// ═══ LOBBY ═══
var lobbyPollInterval=null;
var lobbyMusic=null;

function showLobby(code){
  var title=document.getElementById('quiz-title-input').value;
  document.getElementById('lobby-quiz-title').textContent=title;
  document.getElementById('lobby-question-count').textContent=questions.length+' preguntas';
  document.getElementById('lobby-code').textContent=code;
  document.getElementById('lobby-player-count').textContent='0';
  document.getElementById('lobby-overlay').classList.add('active');

  // Generar QR real
  generateLobbyQR(code);

  // Iniciar música del lobby
  startLobbyMusic();

  // Limpiar contenedor de participantes visualmente e iniciar polling
  var container=document.getElementById('lobby-players-list');
  if(container) container.innerHTML='';
  document.getElementById('lobby-player-count').textContent='0';
  // Ahora sí iniciar polling con tabla limpia
  pollLobbyParticipants();
  if(lobbyPollInterval)clearInterval(lobbyPollInterval);
  lobbyPollInterval=setInterval(pollLobbyParticipants,3000);
}

function generateLobbyQR(code){
  var qrContainer=document.getElementById('lobby-qr-canvas');
  if(!qrContainer) return;
  qrContainer.innerHTML='';
  // Build join URL dynamically from current host
  var baseUrl=window.location.origin+window.location.pathname.replace(/editor\.html.*$/,'index.html');
  var joinUrl=baseUrl+'?code='+code;
  var qrApiUrl='https://api.qrserver.com/v1/create-qr-code/?size=160x160&data='+encodeURIComponent(joinUrl)+'&bgcolor=ffffff&color=2D1B4E&margin=8';
  var img=document.createElement('img');
  img.src=qrApiUrl;
  img.alt='QR para unirse';
  img.style.cssText='width:140px;height:140px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.15);';
  img.onerror=function(){qrContainer.innerHTML='<div style="width:140px;height:140px;background:#F1F5F9;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#64748B;font-size:12px">QR no disponible</div>';};
  qrContainer.appendChild(img);
}

function startLobbyMusic(){
  try{
    if(lobbyMusic && lobbyMusic._ctx){
      // Resume existing
      lobbyMusic._ctx.resume();
      lobbyMusic._playing=true;
      return;
    }
    var ctx=new (window.AudioContext||window.webkitAudioContext)();
    var master=ctx.createGain();
    master.gain.value=0.25;
    master.connect(ctx.destination);

    // ═══ Catchy Lobby Beat Generator ═══
    // Uses pentatonic scale for a fun, upbeat game vibe
    var bpm=128;
    var beatLen=60/bpm;
    var notes=[261.63,293.66,329.63,392.00,440.00,523.25,587.33,659.25]; // C major pentatonic extended
    var bassNotes=[130.81,146.83,164.81,196.00]; // Bass C D E G
    var loopLen=8*beatLen; // 8 beats per loop
    var playing=true;

    function playBeat(startTime){
      // Kick drum (low frequency)
      for(var k=0;k<8;k++){
        if(k%2===0){
          var kickOsc=ctx.createOscillator();
          var kickGain=ctx.createGain();
          kickOsc.type='sine';
          kickOsc.frequency.setValueAtTime(150,startTime+k*beatLen);
          kickOsc.frequency.exponentialRampToValueAtTime(40,startTime+k*beatLen+0.08);
          kickGain.gain.setValueAtTime(0.6,startTime+k*beatLen);
          kickGain.gain.exponentialRampToValueAtTime(0.001,startTime+k*beatLen+0.15);
          kickOsc.connect(kickGain);
          kickGain.connect(master);
          kickOsc.start(startTime+k*beatLen);
          kickOsc.stop(startTime+k*beatLen+0.2);
        }
      }

      // Hi-hat pattern
      for(var h=0;h<16;h++){
        var noise=ctx.createBufferSource();
        var bufLen=ctx.sampleRate*0.03;
        var buf=ctx.createBuffer(1,bufLen,ctx.sampleRate);
        var data=buf.getChannelData(0);
        for(var s=0;s<bufLen;s++) data[s]=(Math.random()*2-1)*0.3;
        noise.buffer=buf;
        var hhGain=ctx.createGain();
        var hhTime=startTime+h*(beatLen/2);
        hhGain.gain.setValueAtTime(h%2===0?0.15:0.08,hhTime);
        hhGain.gain.exponentialRampToValueAtTime(0.001,hhTime+0.05);
        var hhFilter=ctx.createBiquadFilter();
        hhFilter.type='highpass';
        hhFilter.frequency.value=8000;
        noise.connect(hhFilter);
        hhFilter.connect(hhGain);
        hhGain.connect(master);
        noise.start(hhTime);
        noise.stop(hhTime+0.06);
      }

      // Bass line
      for(var b=0;b<4;b++){
        var bassOsc=ctx.createOscillator();
        var bassGain=ctx.createGain();
        bassOsc.type='sawtooth';
        bassOsc.frequency.value=bassNotes[b%bassNotes.length];
        var bassFilter=ctx.createBiquadFilter();
        bassFilter.type='lowpass';
        bassFilter.frequency.value=300;
        var bTime=startTime+b*beatLen*2;
        bassGain.gain.setValueAtTime(0.25,bTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001,bTime+beatLen*1.5);
        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(master);
        bassOsc.start(bTime);
        bassOsc.stop(bTime+beatLen*2);
      }

      // Melody (synth lead)
      var melodyPattern=[0,2,4,5,4,2,3,1]; // Index into notes array
      for(var m=0;m<8;m++){
        var noteIdx=melodyPattern[m];
        var mOsc=ctx.createOscillator();
        var mGain=ctx.createGain();
        mOsc.type='square';
        var mFilter=ctx.createBiquadFilter();
        mFilter.type='lowpass';
        mFilter.frequency.value=1200;
        mOsc.frequency.value=notes[noteIdx];
        var mTime=startTime+m*beatLen;
        mGain.gain.setValueAtTime(0.12,mTime);
        mGain.gain.setValueAtTime(0.12,mTime+beatLen*0.6);
        mGain.gain.exponentialRampToValueAtTime(0.001,mTime+beatLen*0.9);
        mOsc.connect(mFilter);
        mFilter.connect(mGain);
        mGain.connect(master);
        mOsc.start(mTime);
        mOsc.stop(mTime+beatLen);
      }

      // Chord pad (soft background)
      var padOsc1=ctx.createOscillator();
      var padOsc2=ctx.createOscillator();
      var padGain=ctx.createGain();
      padOsc1.type='sine';
      padOsc2.type='sine';
      padOsc1.frequency.value=261.63; // C
      padOsc2.frequency.value=329.63; // E
      padGain.gain.setValueAtTime(0.06,startTime);
      padOsc1.connect(padGain);
      padOsc2.connect(padGain);
      padGain.connect(master);
      padOsc1.start(startTime);
      padOsc2.start(startTime);
      padOsc1.stop(startTime+loopLen);
      padOsc2.stop(startTime+loopLen);
    }

    function scheduleLoop(){
      if(!playing) return;
      var now=ctx.currentTime;
      playBeat(now+0.05);
      setTimeout(scheduleLoop,loopLen*1000);
    }

    scheduleLoop();

    lobbyMusic={
      _ctx:ctx,
      _playing:true,
      _master:master,
      pause:function(){
        playing=false;
        this._playing=false;
        if(ctx.state==='running') ctx.suspend();
      },
      play:function(){
        playing=true;
        this._playing=true;
        ctx.resume();
        scheduleLoop();
        return Promise.resolve();
      },
      get paused(){return !this._playing;}
    };
  }catch(e){console.log('Music error:',e);}
}

function stopLobbyMusic(){
  if(lobbyMusic){
    if(lobbyMusic._ctx){
      lobbyMusic._ctx.close().catch(function(){});
    }
    lobbyMusic=null;
  }
}

function toggleLobbyMusic(){
  var btn=document.getElementById('lobby-music-btn');
  if(!lobbyMusic || !lobbyMusic._ctx){
    startLobbyMusic();
    if(btn) btn.innerHTML='<i class="fas fa-volume-up"></i>';
    return;
  }
  if(lobbyMusic._playing){
    lobbyMusic.pause();
    if(btn) btn.innerHTML='<i class="fas fa-volume-mute"></i>';
  }else{
    lobbyMusic.play().catch(function(){});
    if(btn) btn.innerHTML='<i class="fas fa-volume-up"></i>';
  }
}

function pollLobbyParticipants(){
  if(!evaluacionId)return;
  var client=getSupabase();
  client.from('evaluacion_participantes').select('nombre,joined_at').eq('evaluacion_id',evaluacionId).order('joined_at').then(function(r){
    if(r.error||!r.data){if(r.error)console.error('pollLobby error:',r.error.message);return;}
    var count=r.data.length;
    document.getElementById('lobby-player-count').textContent=count;
    // Mostrar nombres de participantes
    var container=document.getElementById('lobby-players-list');
    if(!container){
      // Crear contenedor de participantes si no existe
      var footer=document.querySelector('.lobby-footer');
      if(footer){
        container=document.createElement('div');
        container.id='lobby-players-list';
        container.style.cssText='display:flex;flex-wrap:wrap;gap:8px;padding:12px 24px;justify-content:center;max-height:120px;overflow-y:auto';
        footer.parentNode.insertBefore(container,footer);
      }
    }
    if(container){
      var html='';
      for(var i=0;i<r.data.length;i++){
        var name=r.data[i].nombre;
        var equipo=r.data[i].equipo||r.data[i].team||'';
        // Extract avatar if present
        var displayName=name;
        var avatarEmoji='';
        if(name.indexOf('|')!==-1){
          var parts=name.split('|');
          avatarEmoji=parts[0];
          displayName=parts[1];
        }
        var initial=avatarEmoji||displayName.charAt(0).toUpperCase();
        var colors=['#2563EB','#0D9488','#D97706','#DC2626','#7C3AED','#059669','#E91E63','#F59E0B'];
        var col=colors[i%colors.length];
        html+='<div style="display:flex;flex-direction:column;align-items:center;gap:4px;animation:fadeInUp .3s ease">';
        html+='<div style="width:40px;height:40px;border-radius:50%;background:'+col+';display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,.2)">'+initial+'</div>';
        html+='<span style="font-size:10px;color:rgba(255,255,255,.7);max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+displayName+'</span>';
        if(equipo && sessionMode==='equipo'){
          html+='<span style="font-size:8px;color:rgba(255,255,255,.4);max-width:70px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;">'+equipo+'</span>';
        }
        html+='</div>';
      }
      container.innerHTML=html;
    }
  });
}

function closeLobby(){
  document.getElementById('lobby-overlay').classList.remove('active');
  document.body.classList.remove('loading-lobby');
  if(lobbyPollInterval){clearInterval(lobbyPollInterval);lobbyPollInterval=null;}
  stopLobbyMusic();
}

function cancelLobby() {
  closeLobby();
  if (window.location.search.includes('play=true')) {
    window.location.href = '/juegos/biblioteca';
  }
}
function copyLobbyCode(){
  var code=document.getElementById('lobby-code').textContent;
  if(navigator.clipboard){navigator.clipboard.writeText(code).then(function(){showToast('Código copiado: '+code,'success');});}
}
function startGameFromLobby(){
  if(lobbyPollInterval){clearInterval(lobbyPollInterval);lobbyPollInterval=null;}
  stopLobbyMusic();
  var client=getSupabase();
  client.from('evaluaciones').update({iniciado:true,updated_at:new Date().toISOString()}).eq('id',evaluacionId).then(function(r){
    if(r.error){showToast('Error al iniciar: '+r.error.message,'error');return;}
    showToast('¡Sesión iniciada! Los estudiantes pueden responder ahora.','success');
    // Guardar sesión activa para persistir al recargar
    sessionStorage.setItem('alcocer_teacher_eval',evaluacionId);
    closeLobby();
    openTeacherResults(true);
  });
}

var teacherResultsPoll=null;
var cachedQuestions=null;


function openTeacherResults(isLive){
  isLive = isLive !== false; // true por defecto
  document.getElementById('teacher-results-overlay').classList.add('active');
  
  var liveBadge = document.getElementById('tr-live-badge');
  var refreshMsg = document.getElementById('tr-refresh-msg');
  if (liveBadge) liveBadge.style.display = isLive ? 'inline-block' : 'none';
  if (refreshMsg) refreshMsg.style.display = isLive ? 'block' : 'none';

  pollTeacherResults();
  loadQuestionReview(evaluacionId);
  if(teacherResultsPoll)clearInterval(teacherResultsPoll);
  if(isLive){
    teacherResultsPoll=setInterval(pollTeacherResults,5000);
  }
}

function loadQuestionReview(id) {
  if (cachedQuestions) {
    renderQuestionReviewWithAnswers(cachedQuestions);
    return;
  }
  var client = getSupabase();
  client.from('evaluacion_preguntas').select('*').eq('evaluacion_id', id).order('orden').then(function(r) {
    if (r.error || !r.data || r.data.length === 0) return;
    cachedQuestions = r.data;
    renderQuestionReviewWithAnswers(cachedQuestions);
  });
}

function renderQuestionReviewWithAnswers(qs) {
    var html = '';
    for (var i = 0; i < qs.length; i++) {
        var q = qs[i];
        var qText = q.texto || q.text || 'Pregunta sin texto';
        var qType = q.tipo || '';
        var opts = q.opciones || [];

        // Type badge colors
        var typeLabels = {
          'mc': '☑️ Selección única', 'ms': '✅ Selección múltiple', 'tf': '⚖️ V/F',
          'fb': '✏️ Completar', 'oa': '📝 Abierta', 'poll': '📊 Encuesta',
          'dnd': '🖐️ Identificar partes'
        };
        var typeLabel = typeLabels[qType] || qType;

        html += '<div style="margin-bottom:16px;padding:16px;background:rgba(255,255,255,0.05);border-radius:12px;border-left:4px solid #8B5CF6;">';
        html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">';
        html += '<span style="font-weight:700;color:#fff;font-size:1.05rem;">' + (i+1) + '. ' + qText + '</span>';
        html += '<span style="font-size:0.7rem;padding:3px 8px;border-radius:6px;background:rgba(139,92,246,0.2);color:#A78BFA;font-weight:700;white-space:nowrap;">' + typeLabel + '</span>';
        html += '</div>';

        // Check if poll is open response
        var isPollOpen = qType === 'poll' && 
            (!opts || !Array.isArray(opts) || opts.length === 0 || opts.every(function(o){ return !o || !o.text || !o.text.trim(); }));

        // Render options/instruction based on question type
        if (qType === 'oa') {
          html += '<div style="color:#A78BFA;font-weight:600;font-size:0.9rem;padding:8px 12px;background:rgba(124,58,237,0.1);border-radius:8px;border:1px dashed rgba(124,58,237,0.3);"><i class="fas fa-pen-nib" style="margin-right:8px"></i>Respuesta abierta — Se revisa manualmente (no puntúa)</div>';
        } else if (qType === 'fb') {
          var fbAnswer = (opts.length > 0 && opts[0].text) ? opts[0].text : '(sin patrón definido)';
          html += '<div style="color:#38BDF8;font-weight:600;font-size:0.9rem;padding:8px 12px;background:rgba(56,189,248,0.1);border-radius:8px;border:1px dashed rgba(56,189,248,0.3);"><i class="fas fa-spell-check" style="margin-right:8px"></i>Patrón de respuesta: <strong>' + fbAnswer + '</strong></div>';
        } else if (qType === 'dnd') {
          for (var j = 0; j < opts.length; j++) {
            var o = opts[j];
            var pinInfo = (o.pinX !== undefined && o.pinY !== undefined) ? ' <span style="color:rgba(255,255,255,0.3);font-size:0.8rem;">(' + Math.round(o.pinX) + '%, ' + Math.round(o.pinY) + '%)</span>' : '';
            html += '<div style="color:#22D3EE;font-weight:600;margin-bottom:6px;font-size:0.9rem;padding:6px 10px;border-radius:6px;background:rgba(34,211,238,0.08);"><i class="fas fa-map-marker-alt" style="margin-right:8px"></i>' + String.fromCharCode(65+j) + '. ' + (o.text || '(Sin nombre)') + pinInfo + '</div>';
          }
        } else if (qType === 'poll') {
           if (isPollOpen) {
             html += '<div style="color:#A78BFA;font-weight:600;font-size:0.9rem;padding:8px 12px;background:rgba(124,58,237,0.1);border-radius:8px;border:1px dashed rgba(124,58,237,0.3);"><i class="fas fa-comment-dots" style="margin-right:8px"></i>Encuesta abierta — Los estudiantes escribirán su respuesta (sin puntaje)</div>';
           } else {
             for (var j = 0; j < opts.length; j++) {
               html += '<div style="color:rgba(255,255,255,0.6);font-weight:500;margin-bottom:6px;font-size:0.9rem;padding:6px 10px;border-radius:6px;background:rgba(255,255,255,0.03);"><i class="fas fa-chart-bar" style="margin-right:8px;color:#A78BFA;"></i>' + String.fromCharCode(65+j) + '. ' + (opts[j].text || '(Opción vacía)') + '</div>';
             }
             html += '<div style="color:rgba(255,255,255,0.3);font-size:0.75rem;margin-top:4px;font-style:italic;"><i class="fas fa-info-circle" style="margin-right:4px;"></i>Encuesta — sin respuesta correcta</div>';
           }
        } else {
          // mc, ms, tf
          for (var j = 0; j < opts.length; j++) {
            var isCorrect = opts[j].correct;
            var color = isCorrect ? '#4ADE80' : 'rgba(255,255,255,0.5)';
            var bg = isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'transparent';
            var fw = isCorrect ? 'bold' : 'normal';
            var icon = isCorrect ? '<i class="fas fa-check-circle" style="margin-right:8px"></i>' : '<i class="far fa-circle" style="margin-right:8px"></i>';
            html += '<div style="color:'+color+';font-weight:'+fw+';margin-bottom:6px;font-size:0.95rem;padding:6px 10px;border-radius:6px;background:'+bg+';">' + icon + (opts[j].text || '(Opción vacía)') + '</div>';
          }
        }

        // Render live answers for open response / open poll questions
        if (qType === 'oa' || isPollOpen) {
            var responsesList = [];
            if (window.teacherResults && window.teacherResults.length > 0) {
                for (var k = 0; k < window.teacherResults.length; k++) {
                    var res = window.teacherResults[k];
                    var name = window.teacherNameMap ? (window.teacherNameMap[res.user_id] || 'Estudiante') : 'Estudiante';
                    if (name.indexOf('|') !== -1) name = name.split('|')[1];
                    var studentAnswersList = res.respuestas || [];
                    // Match by pregunta_id, fallback to index
                    var studentAns = studentAnswersList.find(function(sa) { return sa.pregunta_id === q.id; }) || studentAnswersList[i];
                    if (studentAns && studentAns.seleccionada !== undefined && studentAns.seleccionada !== '') {
                        responsesList.push({ name: name, text: studentAns.seleccionada });
                    }
                }
            }

            html += '<div style="margin-top:12px;background:rgba(0,0,0,0.25);border-radius:10px;padding:12px;border:1px solid rgba(255,255,255,0.08);">';
            html += '<div style="font-size:0.8rem;font-weight:800;color:rgba(255,255,255,0.5);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;"><i class="fas fa-comments" style="margin-right:6px;color:#A78BFA;"></i>Respuestas escritas (' + responsesList.length + ')</div>';
            if (responsesList.length > 0) {
                html += '<div style="display:flex;flex-direction:column;gap:6px;max-height:180px;overflow-y:auto;padding-right:4px;">';
                for (var rIdx = 0; rIdx < responsesList.length; rIdx++) {
                    var resp = responsesList[rIdx];
                    html += '<div style="font-size:0.85rem;line-height:1.4;background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:6px;border-left:3px solid #8B5CF6;text-align:left;">';
                    html += '<strong style="color:#A78BFA;margin-right:6px;">' + resp.name + ':</strong>';
                    html += '<span style="color:#fff;font-style:italic;">"' + resp.text + '"</span>';
                    html += '</div>';
                }
                html += '</div>';
            } else {
                html += '<div style="font-size:0.8rem;color:rgba(255,255,255,0.3);font-style:italic;"><i class="fas fa-info-circle"></i> Ningún estudiante ha respondido todavía.</div>';
            }
            html += '</div>';
        }

        html += '</div>';
    }
    var reviewEl = document.getElementById('tr-question-review-content');
    var reviewContainer = document.getElementById('tr-question-review');
    if (reviewEl && reviewContainer) {
        reviewEl.innerHTML = html;
        reviewContainer.style.display = 'block';
    }
}

function openTeacherReportDetail(userId, studentName) {
    if (!window.teacherResults) return;
    var r = window.teacherResults.find(function(x) { return x.user_id === userId; });
    if (!r) return;

    if (!document.getElementById('report-detail-animation-styles')) {
        var style = document.createElement('style');
        style.id = 'report-detail-animation-styles';
        style.innerHTML = '@keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }';
        document.head.appendChild(style);
    }

    var overlay = document.createElement('div');
    overlay.id = 'report-detail-modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.85);backdrop-filter:blur(8px);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;';

    var modal = document.createElement('div');
    modal.style.cssText = 'background:#fff;border-radius:24px;width:100%;max-width:600px;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 24px 64px rgba(0,0,0,.4);animation:popIn .3s cubic-bezier(.34,1.56,.64,1);overflow:hidden;';

    var header = document.createElement('div');
    header.style.cssText = 'padding:20px 24px;background:#F8FAFC;border-bottom:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center;';
    header.innerHTML = '<h2 style="font-size:1.15rem;font-weight:800;color:#1E293B;margin:0;display:flex;align-items:center;gap:8px;"><i class="fas fa-user-circle" style="color:#94A3B8;font-size:1.4rem;"></i>' + studentName + '</h2>' +
                       '<button onclick="document.body.removeChild(document.getElementById(\'report-detail-modal\'))" style="background:none;border:none;font-size:28px;color:#94A3B8;cursor:pointer;padding:0;line-height:1;transition:color 0.2s;">&times;</button>';
    modal.appendChild(header);

    var bodyContainer = document.createElement('div');
    bodyContainer.style.cssText = 'padding:24px;overflow-y:auto;flex:1;';
    bodyContainer.innerHTML = '<div style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:32px;color:#94A3B8;"></i></div>';
    modal.appendChild(bodyContainer);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    var client = getSupabase();
    client.from('evaluacion_preguntas').select('id, orden, texto, opciones, tipo').eq('evaluacion_id', evaluacionId).order('orden').then(function(qRes) {
        if (qRes.error || !qRes.data) {
            bodyContainer.innerHTML = '<div style="color:#EF4444;text-align:center;padding:20px;font-weight:700;"><i class="fas fa-exclamation-triangle"></i> Error cargando preguntas</div>';
            return;
        }
        var qs = qRes.data;
        var html = '';

        var correctCount = 0;
        var totalGradeableCount = 0;
        var ans = r.respuestas || [];

        // Build answer map by pregunta_id
        var ansMap = {};
        for (var ak = 0; ak < ans.length; ak++) {
            if (ans[ak] && ans[ak].pregunta_id) {
                ansMap[ans[ak].pregunta_id] = ans[ak];
            }
        }

        for (var aIndex = 0; aIndex < qs.length; aIndex++) {
            var qItem = qs[aIndex];
            var isExclude = qItem.tipo === 'oa' || qItem.tipo === 'poll' || qItem.tipo === 'encuesta';
            if (isExclude) continue;
            totalGradeableCount++;
            var aItem = ansMap[qItem.id] || ans[aIndex];
            if (aItem && aItem.correcta) {
                correctCount++;
            }
        }
        if (totalGradeableCount === 0) {
            totalGradeableCount = r.total || qs.length || 0;
            correctCount = Math.round(((r.porcentaje || 0) / 100) * totalGradeableCount);
        }

        html += '<div style="display:flex;gap:12px;margin-bottom:24px;">';
        html += '<div style="flex:1;background:#F0FDF4;padding:16px;border-radius:16px;text-align:center;border:2px solid #DCFCE7;"><div style="font-size:28px;font-weight:900;color:#166534;">'+correctCount+' / '+totalGradeableCount+'</div><div style="font-size:13px;color:#15803D;font-weight:800;">Correctas</div></div>';
        html += '<div style="flex:1;background:#EFF6FF;padding:16px;border-radius:16px;text-align:center;border:2px solid #DBEAFE;"><div style="font-size:28px;font-weight:900;color:#1E40AF;">'+r.porcentaje+'%</div><div style="font-size:13px;color:#1D4ED8;font-weight:800;">Precisión</div></div>';
        html += '</div>';

        for (var i = 0; i < qs.length; i++) {
            var q = qs[i];
            var a = ansMap[q.id] || ans[i];
            var isPoll = q.tipo === 'poll' || q.tipo === 'encuesta';
            var isCorrect = isPoll ? true : (a ? a.correcta : false);
            var qColor = isPoll ? '#7C3AED' : (isCorrect ? '#22C55E' : '#EF4444');
            var qBg = isPoll ? '#F5F3FF' : (isCorrect ? '#F0FDF4' : '#FEF2F2');
            var qIcon = isPoll ? 'fa-comment-dots' : (isCorrect ? 'fa-check-circle' : 'fa-times-circle');

            html += '<div style="background:'+qBg+';border:2px solid '+qColor+'40;border-radius:16px;padding:20px;margin-bottom:16px;text-align:left;">';
            html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">';
            html += '<div style="font-weight:800;color:#1E293B;font-size:1.05rem;line-height:1.4;flex:1;padding-right:12px;">' + (i+1) + '. ' + (q.texto||'') + '</div>';
            html += '<div style="color:'+qColor+';font-size:1.4rem;"><i class="fas '+qIcon+'"></i></div>';
            html += '</div>';

            var isPollOpenRes = (q.tipo === 'poll' || q.tipo === 'encuesta') &&
                (
                    (a && a.es_abierta) ||
                    !q.opciones || q.opciones.length === 0 ||
                    q.opciones.every(function(op){ return !op.text || !op.text.trim(); })
                );

            if (isPollOpenRes) {
                html += '<div style="margin-top:16px; padding:16px 20px; background:#F5F3FF; border:2px solid #DDD6FE; border-radius:12px;">';
                html += '  <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">';
                html += '    <i class="fas fa-comment-dots" style="color:#7C3AED; font-size:0.9rem;"></i>';
                html += '    <span style="font-weight:800; color:#6D28D9; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">Respuesta de encuesta — no afecta el puntaje</span>';
                html += '  </div>';
                html += '  <div style="font-weight:600; color:#1E293B; font-size:0.95rem; line-height:1.5; font-style:italic;">"' + (a && a.seleccionada ? a.seleccionada : '<span style=\'color:#94A3B8;\'>Sin responder</span>') + '"</div>';
                html += '</div>';
            } else if (q.tipo === 'oa') {
                html += '<div style="margin-top:16px; padding:16px 20px; background:#F5F3FF; border:2px solid #DDD6FE; border-radius:12px;">';
                html += '  <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">';
                html += '    <i class="fas fa-pen-nib" style="color:#7C3AED; font-size:0.9rem;"></i>';
                html += '    <span style="font-weight:800; color:#6D28D9; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.5px;">Respuesta abierta — no afecta el puntaje</span>';
                html += '  </div>';
                html += '  <div style="font-weight:600; color:#1E293B; font-size:0.95rem; line-height:1.5; font-style:italic;">"' + (a && a.seleccionada ? a.seleccionada : '<span style=\'color:#94A3B8;\'>Sin responder</span>') + '"</div>';
                html += '</div>';
            } else if (q.tipo === 'mc' || q.tipo === 'tf' || !q.tipo || q.tipo === 'ms' || q.tipo === 'poll' || q.tipo === 'encuesta') {
                var opts = q.opciones || [];
                html += '<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">';
                for (var o = 0; o < opts.length; o++) {
                    var isSelected = false;
                    if (q.tipo === 'ms') {
                        isSelected = a && a.seleccionada && a.seleccionada.indexOf(o) !== -1;
                    } else {
                        isSelected = a && a.seleccionada === o;
                    }
                    var isOptCorrect = !isPoll && opts[o].correct;
                    var oColor = isPoll ? (isSelected ? '#7C3AED' : '#475569') : (isOptCorrect ? '#166534' : (isSelected ? '#991B1B' : '#475569'));
                    var oBg = isPoll ? (isSelected ? '#F5F3FF' : '#FFFFFF') : (isOptCorrect ? '#DCFCE7' : (isSelected ? '#FEE2E2' : '#FFFFFF'));
                    var oBorder = isPoll ? (isSelected ? '#C084FC' : '#CBD5E1') : (isOptCorrect ? '#86EFAC' : (isSelected ? '#FECACA' : '#CBD5E1'));
                    var oIcon = isPoll ? (isSelected ? '<i class="fas fa-check"></i>' : '') : (isOptCorrect ? '<i class="fas fa-check"></i>' : (isSelected ? '<i class="fas fa-times"></i>' : ''));
                    var oWeight = (isOptCorrect || isSelected) ? '800' : '600';

                    html += '<div style="padding:10px 16px;background:'+oBg+';border:2px solid '+oBorder+';border-radius:12px;font-size:0.95rem;font-weight:'+oWeight+';color:'+oColor+';display:flex;justify-content:space-between;align-items:center;">';
                    html += '<span>' + (opts[o].text||'') + '</span>';
                    html += '<span style="font-size:1.1rem;">' + oIcon + '</span>';
                    html += '</div>';
                }
                html += '</div>';
            } else if (q.tipo === 'dnd') {
                var imgUrl = (q.opciones && q.opciones[0]) ? q.opciones[0].pregunta_imagen : '';
                html += '<div style="margin-top:16px; display:flex; flex-direction:column; gap:12px; align-items:center;">';
                html += '  <img src="' + imgUrl + '" style="max-width:100%; max-height:220px; border-radius:8px; border:2px solid #E2E8F0;">';
                html += '  <div style="display:flex; flex-direction:column; gap:6px; width:100%;">';
                var studentMatches = {};
                try {
                    studentMatches = JSON.parse(a.seleccionada);
                } catch(e) {
                    studentMatches = {};
                }
                var opts = q.opciones || [];
                for(var o=0; o<opts.length; o++) {
                    var matchIdx = studentMatches[o];
                    var isCorrectMatch = (matchIdx === o);
                    var matchedText = (matchIdx !== undefined && opts[matchIdx]) ? opts[matchIdx].text : 'Sin responder';
                    var matchColor = isCorrectMatch ? '#166534' : '#991B1B';
                    var matchBg = isCorrectMatch ? '#DCFCE7' : '#FEE2E2';
                    var matchBorder = isCorrectMatch ? '#86EFAC' : '#FECACA';
                    var matchIcon = isCorrectMatch ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>';
                    html += '<div style="padding:10px 16px;background:'+matchBg+';border:2px solid '+matchBorder+';border-radius:12px;font-size:0.95rem;font-weight:700;color:'+matchColor+';display:flex;justify-content:space-between;align-items:center;">';
                    html += '<span>Parte ' + String.fromCharCode(65+o) + ' (' + (opts[o].text||'') + '):</span>';
                    html += '<span>' + matchIcon + ' Tu respuesta: ' + matchedText + '</span>';
                    html += '</div>';
                }
                html += '  </div>';
                html += '</div>';
            } else {
                html += '<div style="margin-top:16px;padding:12px;background:#FFF;border:2px solid #E2E8F0;border-radius:12px;">';
                html += '<div style="font-size:0.85rem;color:#64748B;font-weight:800;margin-bottom:6px;">Respuesta del estudiante:</div>';
                html += '<div style="font-weight:700;color:#0F172A;font-size:1rem;">' + (a ? a.seleccionada : 'Sin responder') + '</div>';
                html += '<div style="font-size:0.85rem;color:#10B981;font-weight:800;margin-top:12px;margin-bottom:6px;">Respuesta correcta esperada:</div>';
                var respCorrecta = '';
                if (q.tipo === 'fb') {
                    respCorrecta = (q.opciones && q.opciones.length > 0 && q.opciones[0].text) ? q.opciones[0].text : 'Sin patrón';
                } else {
                    respCorrecta = q.respuesta_correcta || '';
                }
                html += '<div style="font-weight:700;color:#047857;font-size:1rem;">' + respCorrecta + '</div>';
                html += '</div>';
            }
            html += '</div>';
        }
        bodyContainer.innerHTML = html;
    });
}
window.openTeacherReportDetail = openTeacherReportDetail;

function closeTeacherResults(){
  document.getElementById('teacher-results-overlay').classList.remove('active');
  document.body.classList.remove('loading-results');
  if(teacherResultsPoll){clearInterval(teacherResultsPoll);teacherResultsPoll=null;}
  sessionStorage.removeItem('alcocer_teacher_eval');
  cachedQuestions = null;
  
  if (window.location.search.includes('results=true')) {
    window.location.href = '/juegos/biblioteca';
  }
}


// ═══ AVATAR RENDERING PARA RESULTADOS ═══
var editorAvatarsList = [
  { id: 'carlos',    src: './assets/avatars/carlos.png' },
  { id: 'lucia',     src: './assets/avatars/lucia.png' },
  { id: 'mateo',     src: './assets/avatars/mateo.png' },
  { id: 'sofia',     src: './assets/avatars/sofia.png' },
  { id: 'andres',    src: './assets/avatars/andres.png' },
  { id: 'valentina', src: './assets/avatars/valentina.png' },
  { id: 'diego',     src: './assets/avatars/diego.png' },
  { id: 'bruno',     src: './assets/avatars/bruno.png' },
  { id: 'sebastian', src: './assets/avatars/sebastian.png' },
  { id: 'camila',    src: './assets/avatars/camila.png' },
  { id: 'paula',     src: './assets/avatars/paula.png' },
  { id: 'emilia',    src: './assets/avatars/emilia.png' }
];
var editorAvatarMap = {};
for (var ei = 0; ei < editorAvatarsList.length; ei++) {
  editorAvatarMap[editorAvatarsList[ei].id] = editorAvatarsList[ei];
}
function editorIsEmoji(s) {
  if (!s || typeof s !== 'string' || s.length === 0) return false;
  if (s.indexOf('avatarcfg:') === 0) return false;
  if (s.length <= 2) return true;
  for (var ec = 0; ec < s.length; ec++) {
    if (s.charCodeAt(ec) >= 0xD800 && s.charCodeAt(ec) <= 0xDFFF) return true;
  }
  return false;
}
function editorAvatarHtml(avatarStr, name, podiumIdx) {
  if (!avatarStr) {
    var letter = name ? name.charAt(0).toUpperCase() : '?';
    var grads = ['linear-gradient(180deg,#FFD700,#FFA000)','linear-gradient(180deg,#E0E0E0,#9E9E9E)','linear-gradient(180deg,#CD7F32,#8B5E3C)'];
    var bd = ['#FFD700','#C0C0C0','#CD7F32'];
    var idx = podiumIdx != null ? podiumIdx : 0;
    return '<div class="podium-avatar" style="font-size:24px;width:48px;height:48px;border-radius:50%;background:' + grads[idx % 3] + ';display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;border:3px solid ' + bd[idx % 3] + ';box-shadow:0 4px 12px rgba(0,0,0,0.3)">' + letter + '</div>';
  }
  if (editorIsEmoji(avatarStr)) {
    return '<div class="podium-avatar">' + avatarStr + '</div>';
  }
  if (avatarStr.indexOf('avatarcfg:') === 0) {
    try {
      var parsed = JSON.parse(decodeURIComponent(avatarStr.slice(10)));
      var def = editorAvatarMap[parsed.base];
      if (def) {
        return '<div class="podium-avatar" style="width:72px;height:72px"><img src="' + def.src + '" alt="' + (name || '') + '"></div>';
      }
    } catch (e) {}
  }
  return '<div class="podium-avatar" style="font-size:20px">' + (name ? name.charAt(0).toUpperCase() : '?') + '</div>';
}
function editorAvatarRowHtml(avatarStr, name, size) {
  if (!avatarStr) return '';
  if (editorIsEmoji(avatarStr)) {
    return '<span style="font-size:' + (size || 20) + 'px;margin-right:8px">' + avatarStr + '</span>';
  }
  if (avatarStr.indexOf('avatarcfg:') === 0) {
    try {
      var parsed = JSON.parse(decodeURIComponent(avatarStr.slice(10)));
      var def = editorAvatarMap[parsed.base];
      if (def) {
        var s = size || 28;
        return '<img src="' + def.src + '" alt="" style="width:' + s + 'px;height:' + s + 'px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:8px;border:2px solid rgba(255,255,255,0.15);display:inline-block">';
      }
    } catch (e) {}
  }
  return '';
}

function pollTeacherResults(){
  if(!evaluacionId)return;
  var client=getSupabase();
  client.from('evaluacion_resultados').select('user_id,puntaje,total,porcentaje,respuestas').eq('evaluacion_id',evaluacionId).order('porcentaje',{ascending:false}).order('puntaje',{ascending:false}).then(function(r){
    if(r.error||!r.data){
      document.getElementById('tr-results-list').innerHTML='<div style="padding:40px 24px;text-align:center;color:#F87171;font-size:1rem;font-weight:600"><i class="fas fa-exclamation-triangle" style="font-size:32px;margin-bottom:16px;display:block"></i>Error al cargar los resultados.</div>';
      return;
    }
    if(r.data.length===0){
      document.getElementById('tr-results-list').innerHTML='<div style="padding:40px 24px;text-align:center;color:rgba(255,255,255,.6);font-size:1rem;font-weight:600"><i class="fas fa-inbox" style="font-size:32px;margin-bottom:16px;color:rgba(255,255,255,.3);display:block"></i>No hay resultados registrados todavía para esta evaluación.</div>';
      document.getElementById('tr-podium').innerHTML='<div style="width:100%;text-align:center;color:rgba(255,255,255,.4);padding:40px 0;font-style:italic">El podio aparecerá cuando haya resultados</div>';
      document.getElementById('tr-accuracy-msg').textContent='No hay datos suficientes';
      document.getElementById('tr-accuracy-pct').textContent='--%';
      document.getElementById('tr-accuracy-bar').style.width='0%';
      return;
    }

    // Get names
    client.from('evaluacion_participantes').select('user_id,nombre').eq('evaluacion_id',evaluacionId).then(function(pRes){
      var nameMap={};
      if(pRes.data){for(var n=0;n<pRes.data.length;n++){nameMap[pRes.data[n].user_id]=pRes.data[n].nombre;}}

      // Filtrar resultados para incluir solo a participantes de la sesión activa
      var activeResults = [];
      var entries=[];
      var totalPct=0;
      for(var k=0;k<r.data.length;k++){
        var userId = r.data[k].user_id;
        if (!nameMap[userId]) continue; // Omitir resultados de sesiones pasadas
        activeResults.push(r.data[k]);

        var fullNombre = nameMap[userId];
        var parts = fullNombre.split('|');
        var emoji = parts.length > 1 ? parts[0] : '';
        var nombreReal = parts.length > 1 ? parts[1] : fullNombre;
        entries.push({user_id: userId, emoji: emoji, nombre: nombreReal, puntaje: r.data[k].puntaje, total: r.data[k].total, porcentaje: r.data[k].porcentaje});
        totalPct+=r.data[k].porcentaje;
      }

      window.teacherResults = activeResults;
      window.teacherNameMap = nameMap;

      // Si no hay participantes activos con resultados
      if(entries.length===0){
        document.getElementById('tr-results-list').innerHTML='<div style="padding:40px 24px;text-align:center;color:rgba(255,255,255,.6);font-size:1rem;font-weight:600"><i class="fas fa-inbox" style="font-size:32px;margin-bottom:16px;color:rgba(255,255,255,.3);display:block"></i>Esperando que los participantes completen la evaluación...</div>';
        document.getElementById('tr-podium').innerHTML='<div style="width:100%;text-align:center;color:rgba(255,255,255,.4);padding:40px 0;font-style:italic">El podio aparecerá cuando haya resultados</div>';
        document.getElementById('tr-accuracy-msg').textContent='No hay datos suficientes';
        document.getElementById('tr-accuracy-pct').textContent='--%';
        document.getElementById('tr-accuracy-bar').style.width='0%';
        return;
      }

      // Update question review lists in real-time
      if (cachedQuestions) {
        renderQuestionReviewWithAnswers(cachedQuestions);
      }

      // Class accuracy
      var avgPct=Math.round(totalPct/entries.length);
      document.getElementById('tr-accuracy-bar').style.width=avgPct+'%';
      document.getElementById('tr-accuracy-pct').textContent=avgPct+'%';
      var accMsg=avgPct>=90?'¡Excelente rendimiento!':avgPct>=70?'¡Buen trabajo de la clase!':avgPct>=40?'Rendimiento moderado':'Necesitan más práctica';
      document.getElementById('tr-accuracy-msg').textContent=accMsg+' ('+entries.length+' estudiante'+(entries.length!==1?'s':'')+')';

      // Podium
      var bgGrads=['linear-gradient(180deg,#FFD700,#FFA000)','linear-gradient(180deg,#E0E0E0,#9E9E9E)','linear-gradient(180deg,#CD7F32,#8B5E3C)'];
      var bdColors=['#FFD700','#C0C0C0','#CD7F32'];
      var rankTexts=['1st','2nd','3rd'];
      var pillarOrder=[1,0,2];
      var ph='';
      
      // Check if it is the very first render to play standard animations
      var isFirstRender = !document.getElementById('tr-podium').innerHTML.trim() || document.getElementById('tr-podium').innerHTML.includes('El podio aparecerá');

      for(var p=0;p<3;p++){
        var idx=pillarOrder[p];
        if(idx>=entries.length){
          ph+='<div style="flex:1;max-width:130px"></div>';
          continue;
        }
        var e=entries[idx];
        var rankClass = idx === 0 ? 'rank-1' : (idx === 1 ? 'rank-2' : 'rank-3');
        var rankText = rankTexts[idx];
        
        var avatarContent = editorAvatarHtml(e.emoji, e.nombre, idx);

        var animStyle = isFirstRender 
          ? ('animation-delay:' + (p*0.15) + 's') 
          : 'animation: none !important; opacity: 1 !important; transform: translateY(0) !important;';

        ph+='<div class="podium-cylinder ' + rankClass + '" style="' + animStyle + '; cursor: pointer;" onclick="openTeacherReportDetail(\'' + e.user_id + '\', \'' + e.nombre.replace(/'/g, "\\'") + '\')">';
        
        // Avatar standing on top
        ph+='<div class="podium-avatar-wrapper">';
        ph+=avatarContent;
        ph+='<div class="podium-name">' + e.nombre + '</div>';
        ph+='<div class="podium-points">' + e.puntaje + '/' + e.total + '</div>';
        ph+='</div>';

        // The cylinder body
        ph+='<div class="cylinder-top"></div>';
        ph+='<div class="cylinder-body">';
        ph+='<div class="cylinder-rank">' + rankText + '</div>';
        ph+='</div>';
        
        ph+='</div>';
      }
      document.getElementById('tr-podium').innerHTML=ph;

      // Results table
      var lh='';
      for(var l=0;l<entries.length;l++){
        var en=entries[l];
        var rankColor=l===0?'#FFD700':l===1?'#C0C0C0':l===2?'#CD7F32':'rgba(255,255,255,.4)';
        // Adds a cascade delay for sequential slide-in row animation
        lh+='<div class="tr-row" style="animation-delay: ' + (l * 0.05) + 's; cursor: pointer;" onclick="openTeacherReportDetail(\'' + en.user_id + '\', \'' + en.nombre.replace(/'/g, "\\'") + '\')">';
        lh+='<span class="tr-col-rank" style="color:'+rankColor+'">'+(l+1)+'</span>';
        lh+='<span class="tr-col-name">'+editorAvatarRowHtml(en.emoji, en.nombre)+en.nombre+'</span>';
        lh+='<span class="tr-col-score">'+en.puntaje+'/'+en.total+'</span>';
        lh+='<span class="tr-col-acc" style="color:'+(en.porcentaje>=70?'#4ADE80':en.porcentaje>=40?'#FBBF24':'#F87171')+'">'+en.porcentaje+'%</span>';
        lh+='</div>';
      }
      document.getElementById('tr-results-list').innerHTML=lh;
    });
  });
}

// ═══ PREVIEW ═══
var pvIdx=0;
var pvAnswers=[];
var pvSelected=-1;
var pvTimerInterval=null;

function previewQuiz(){
  if(questions.length===0){showToast('Agrega al menos una pregunta para previsualizar','error');return;}
  // Check all questions have text
  for(var i=0;i<questions.length;i++){
    if(!questions[i].text||!questions[i].text.trim()){showToast('La pregunta '+(i+1)+' no tiene texto','error');return;}
  }
  pvIdx=0;pvAnswers=[];pvSelected=-1;
  document.getElementById('preview-quiz').style.display='block';
  document.getElementById('preview-result').style.display='none';
  document.getElementById('preview-overlay').classList.add('active');
  renderPvQuestion();
}

function renderPvQuestion(){
  if(pvIdx>=questions.length)return;
  var q=questions[pvIdx];
  var total=questions.length;
  var progress=(pvIdx/total)*100;
  var pts=q.points||1;
  var timer=q.timer||30;

  document.getElementById('pv-progress').style.width=progress+'%';
  document.getElementById('pv-qnum').textContent='Pregunta '+(pvIdx+1)+'/'+total;
  document.getElementById('pv-question').textContent=q.text;
  document.getElementById('pv-pts').textContent=pts+' punto'+(pts!==1?'s':'');
  document.getElementById('pv-timer').textContent=timer;
  document.getElementById('pv-timer').style.color='#E91E63';
  document.getElementById('pv-next-btn').style.display='none';
  pvSelected=-1;
  pvMultiSelections=[];

  var opts=q.options||[];
  var optColors=['#2563EB','#0D9488','#D97706','#DC2626','#7C3AED','#059669'];
  var html='';
  var qImg=getQuestionImage(q);
  if(qImg && q.type!=='dnd'){
    html+='<div class="pv-question-image-wrap"><img src="'+editorEscapeHtml(qImg)+'" alt="Imagen de la pregunta"></div>';
  }

  // Open-ended: show textarea
  if(q.type==='oa'){
    html+='<textarea id="pv-open-answer" placeholder="Escribe tu respuesta aquí..." '+
      'style="width:100%;min-height:120px;padding:16px;border:2px solid rgba(255,255,255,.2);border-radius:12px;'+
      'background:rgba(255,255,255,.08);color:#fff;font-size:.95rem;font-family:Inter,sans-serif;resize:vertical;outline:none"></textarea>';
    html+='<button onclick="pvSubmitOpen()" style="margin-top:12px;padding:12px 24px;background:linear-gradient(135deg,#E91E63,#C2185B);'+
      'color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;width:100%">Enviar respuesta</button>';
    document.getElementById('pv-options').innerHTML=html;
  }
  // Fill blanks: show text
  else if(q.type==='fb'){
    html+='<textarea id="pv-open-answer" placeholder="Completa los espacios en blanco..." '+
      'style="width:100%;min-height:80px;padding:16px;border:2px solid rgba(255,255,255,.2);border-radius:12px;'+
      'background:rgba(255,255,255,.08);color:#fff;font-size:.95rem;font-family:Inter,sans-serif;resize:vertical;outline:none"></textarea>';
    html+='<button onclick="pvSubmitOpen()" style="margin-top:12px;padding:12px 24px;background:linear-gradient(135deg,#E91E63,#C2185B);'+
      'color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;width:100%">Enviar respuesta</button>';
    document.getElementById('pv-options').innerHTML=html;
  }
  // Identificar partes:
  else if(q.type==='dnd'){
    var imgUrl = (opts && opts[0]) ? opts[0].pregunta_imagen : '';
    pvSelectedDndLabel = -1;
    pvDndMatches = {};
    
    html += '<div style="display:flex; flex-direction:column; align-items:center; gap:20px; width:100%;">';
    html += '  <p style="color:#fff; font-size:0.95rem; font-weight:800; text-align:center; background:rgba(255,255,255,0.08); padding:8px 16px; border-radius:10px;"><i class="fas fa-hand-pointer"></i> Vista Previa: Toca una etiqueta y luego haz clic en el círculo `?` en la imagen:</p>';
    
    html += '  <div class="pv-dnd-map-container" style="position:relative; display:inline-block; max-width:100%; border-radius:12px; overflow:visible; border:3px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.05);">';
    html += '    <div class="quiz-dnd-image-stage pv-dnd-image-stage">';
    html += '      <img class="pv-dnd-image quiz-dnd-image" src="' + editorEscapeHtml(imgUrl) + '" alt="Imagen de la pregunta">';
    for (var i = 0; i < opts.length; i++) {
        var o = opts[i];
        if (o.pinX !== undefined && o.pinY !== undefined) {
            html += '      <div class="pv-dnd-anchor" style="--pin-x:' + o.pinX + '; --pin-y:' + o.pinY + '; left:' + o.pinX + '%; top:' + o.pinY + '%;"></div>';
            html += '      <div class="pv-dnd-connector" style="--pin-x:' + o.pinX + '; --pin-y:' + o.pinY + '; left:' + o.pinX + '%; top:' + o.pinY + '%;"></div>';
            html += '      <div class="pv-dnd-slot" id="pv-slot-' + i + '" onclick="pvClickSlot(' + i + ')" ' +
                'style="--pin-x:' + o.pinX + '; --pin-y:' + o.pinY + '; position:absolute; left:' + o.pinX + '%; top:' + o.pinY + '%; transform:translate(-50%, -50%); ' +
                'width:30px; height:30px; border-radius:50%; background:#fff; border:2px solid #E2E8F0; ' +
                'color:#334155; display:flex; align-items:center; justify-content:center; font-weight:900; ' +
                'font-size:0.85rem; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.3); z-index:100;">?</div>';
        }
    }
    html += '    </div>';
    html += '  </div>';
    
    html += '  <div style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:8px;">';
    for (var j = 0; j < opts.length; j++) {
        var bg = optColors[j % optColors.length];
        html += '    <button class="pv-dnd-label-btn" id="pv-label-' + j + '" onclick="pvClickLabel(' + j + ')" ' +
            'style="padding:10px 14px; border:none; border-radius:8px; background:' + bg + '; color:#fff; text-align:center; ' +
            'font-size:0.9rem; font-weight:800; cursor:pointer; transition:all 0.2s;">' +
            String.fromCharCode(65 + j) + '. ' + (opts[j].text || '') + '</button>';
    }
    html += '  </div>';
    
    html += '  <button id="pv-confirm-dnd-btn" onclick="pvConfirmDnd()" disabled style="margin-top:12px; padding:12px 24px; ' +
        'background:#94A3B8; color:#fff; border:none; border-radius:10px; font-weight:800; cursor:not-allowed; font-size:1rem; width:100%; transition:all 0.2s;">';
    html += '✓ Enviar respuestas</button>';
    
    html += '</div>';
    
    document.getElementById('pv-options').innerHTML=html;
  }
  // Multiple selection: allow clicking multiple
  else if(q.type==='ms'){
    for(var i=0;i<opts.length;i++){
      var bg=optColors[i%optColors.length];
      html+='<button class="pv-opt" data-idx="'+i+'" onclick="pvToggleMulti('+i+')" '+
        'style="padding:14px 18px;border:2px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(255,255,255,.08);'+
        'text-align:left;font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px;color:#fff">'+
        '<span style="width:32px;height:32px;border-radius:8px;background:'+bg+';color:#fff;display:flex;'+
        'align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0">'+
        String.fromCharCode(65+i)+'</span>'+
        '<span>'+(opts[i].text||'(vacío)')+'</span></button>';
    }
    html+='<button id="pv-confirm-multi" onclick="pvConfirmMulti()" style="margin-top:12px;padding:12px 24px;'+
      'background:linear-gradient(135deg,#7C3AED,#6D28D9);color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;width:100%">'+
      '✓ Confirmar selección</button>';
    document.getElementById('pv-options').innerHTML=html;
  }
  // Normal MC / TF / Poll
  else{
    for(var j=0;j<opts.length;j++){
      var bg2=optColors[j%optColors.length];
      html+='<button class="pv-opt" data-idx="'+j+'" onclick="pvSelectOption('+j+')" '+
        'style="padding:14px 18px;border:2px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(255,255,255,.08);'+
        'text-align:left;font-size:.95rem;font-weight:600;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:12px;color:#fff">'+
        '<span style="width:32px;height:32px;border-radius:8px;background:'+bg2+';color:#fff;display:flex;'+
        'align-items:center;justify-content:center;font-weight:700;font-size:.85rem;flex-shrink:0">'+
        String.fromCharCode(65+j)+'</span>'+
        '<span>'+(opts[j].text||'(vacío)')+'</span></button>';
    }
    document.getElementById('pv-options').innerHTML=html;
  }

  // Start timer
  if(pvTimerInterval)clearInterval(pvTimerInterval);
  var timeLeft=timer;
  var timerEl=document.getElementById('pv-timer');
  pvTimerInterval=setInterval(function(){
    timeLeft--;
    timerEl.textContent=timeLeft;
    if(timeLeft<=5)timerEl.style.color='#EF4444';
    if(timeLeft<=0){
      clearInterval(pvTimerInterval);
      if(pvSelected===-1&&pvMultiSelections.length===0){
        pvAnswers.push({correcta:false});
        document.getElementById('pv-next-btn').style.display='block';
        document.getElementById('pv-next-btn').textContent=pvIdx>=questions.length-1?'🏆 Ver resultados':'Siguiente →';
      }
    }
  },1000);
}

// Multiple selection tracking
var pvMultiSelections=[];

function pvToggleMulti(idx){
  var pos=pvMultiSelections.indexOf(idx);
  var buttons=document.querySelectorAll('.pv-opt');
  if(pos===-1){
    pvMultiSelections.push(idx);
    buttons[idx].style.border='2px solid #7C3AED';
    buttons[idx].style.background='rgba(124,58,237,.25)';
  }else{
    pvMultiSelections.splice(pos,1);
    buttons[idx].style.border='2px solid rgba(255,255,255,.15)';
    buttons[idx].style.background='rgba(255,255,255,.08)';
  }
}

function pvConfirmMulti(){
  if(pvMultiSelections.length===0){showToast('Selecciona al menos una opción','error');return;}
  if(pvTimerInterval)clearInterval(pvTimerInterval);
  pvSelected=1;
  var q=questions[pvIdx];
  var opts=q.options||[];
  var buttons=document.querySelectorAll('.pv-opt');
  // Check if all correct were selected and no incorrect
  var allCorrect=true;
  for(var i=0;i<opts.length;i++){
    var isSel=pvMultiSelections.indexOf(i)!==-1;
    var isCorr=opts[i]&&opts[i].correct;
    if(isSel&&!isCorr)allCorrect=false;
    if(!isSel&&isCorr)allCorrect=false;
  }
  // Show feedback
  for(var j=0;j<buttons.length;j++){
    var sel=pvMultiSelections.indexOf(j)!==-1;
    if(sel){buttons[j].style.border=allCorrect?'2px solid #22C55E':'2px solid #F59E0B';buttons[j].style.background=allCorrect?'rgba(34,197,94,.2)':'rgba(245,158,11,.2)';}
    else{buttons[j].style.opacity='0.4';}
    buttons[j].style.pointerEvents='none';
  }
  var confirmBtn=document.getElementById('pv-confirm-multi');
  if(confirmBtn)confirmBtn.style.display='none';
  pvAnswers.push({correcta:allCorrect});
  document.getElementById('pv-next-btn').style.display='block';
  document.getElementById('pv-next-btn').textContent=pvIdx>=questions.length-1?'🏆 Ver resultados':'Siguiente →';
}

function pvSubmitOpen(){
  var ta=document.getElementById('pv-open-answer');
  var answer=ta?ta.value.trim():'';
  if(!answer){showToast('Escribe una respuesta','error');return;}
  if(pvTimerInterval)clearInterval(pvTimerInterval);
  pvSelected=1;
  var q=questions[pvIdx];
  
  var isCorrect = true;
  if (q.type === 'fb') {
      var correctPatterns = [];
      if (q.options && q.options.length > 0 && q.options[0].text) {
          correctPatterns = q.options[0].text.toLowerCase().split(',').map(function(s){ return s.trim(); });
      }
      var userAnswerLower = answer.toLowerCase().trim();
      
      isCorrect = false;
      if (correctPatterns.length > 0) {
          for (var p = 0; p < correctPatterns.length; p++) {
              if (correctPatterns[p] === userAnswerLower) {
                  isCorrect = true;
                  break;
              }
          }
      }
  }

  if (isCorrect) {
      ta.style.border = '2px solid #22C55E';
      ta.style.background = '#F0FDF4';
      ta.style.color = '#166534';
  } else {
      ta.style.border = '2px solid #EF4444';
      ta.style.background = '#FEF2F2';
      ta.style.color = '#991B1B';
  }
  
  ta.disabled=true;
  pvAnswers.push({correcta:isCorrect});
  document.getElementById('pv-next-btn').style.display='block';
  document.getElementById('pv-next-btn').textContent=pvIdx>=questions.length-1?'🏆 Ver resultados':'Siguiente →';
}

function pvSelectOption(idx){
  if(pvSelected!==-1)return;
  pvSelected=idx;
  if(pvTimerInterval)clearInterval(pvTimerInterval);

  var q=questions[pvIdx];
  var opts=q.options||[];
  var isPoll=q.type==='poll'||q.type==='encuesta';
  var isCorrect=isPoll?true:(opts[idx]&&opts[idx].correct);
  var buttons=document.querySelectorAll('.pv-opt');

  for(var i=0;i<buttons.length;i++){
    var isSel=(i===idx);
    if(isSel&&isPoll){buttons[i].style.border='2px solid #7C3AED';buttons[i].style.background='rgba(124,58,237,.25)';}
    else if(isSel&&isCorrect){buttons[i].style.border='2px solid #22C55E';buttons[i].style.background='rgba(34,197,94,.2)';}
    else if(isSel&&!isCorrect){buttons[i].style.border='2px solid #EF4444';buttons[i].style.background='rgba(239,68,68,.2)';}
    else{buttons[i].style.opacity='0.4';}
    buttons[i].style.cursor='default';buttons[i].style.pointerEvents='none';
  }

  pvAnswers.push({correcta:isCorrect});
  document.getElementById('pv-next-btn').style.display='block';
  document.getElementById('pv-next-btn').textContent=pvIdx>=questions.length-1?'🏆 Ver resultados':'Siguiente →';
}

function pvNext(){
  pvIdx++;
  if(pvIdx>=questions.length){showPvResults();}
  else{renderPvQuestion();}
}

function showPvResults(){
  if(pvTimerInterval)clearInterval(pvTimerInterval);
  document.getElementById('preview-quiz').style.display='none';
  document.getElementById('preview-result').style.display='block';

  var correctas=0;
  for(var i=0;i<pvAnswers.length;i++){if(pvAnswers[i].correcta)correctas++;}
  var total=questions.length;
  var pct=Math.round((correctas/total)*100);

  var emoji=pct>=90?'🏆':pct>=70?'⭐':pct>=40?'📝':'💪';
  var msg=pct>=90?'¡Excelente!':pct>=70?'¡Muy bien!':pct>=40?'¡Puedes mejorar!':'¡Sigue practicando!';
  document.getElementById('pv-emoji').textContent=emoji;
  document.getElementById('pv-result-title').textContent=msg;
  document.getElementById('pv-result-score').textContent=correctas+'/'+total+' correctas ('+pct+'%)';

  var fill=document.getElementById('pv-result-fill');
  fill.style.background=pct>=70?'linear-gradient(90deg,#22C55E,#16A34A)':pct>=40?'linear-gradient(90deg,#F59E0B,#D97706)':'linear-gradient(90deg,#EF4444,#DC2626)';
  setTimeout(function(){fill.style.width=pct+'%';},100);

  // Breakdown
  var bd=document.getElementById('pv-breakdown');
  var bh='';
  for(var j=0;j<pvAnswers.length;j++){
    var ok=pvAnswers[j].correcta;
    bh+='<div style="width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;'+
      'background:'+(ok?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)')+';color:'+(ok?'#22C55E':'#EF4444')+'">'+
      '<i class="fas fa-'+(ok?'check':'times')+'"></i></div>';
  }
  bd.innerHTML=bh;
}

function closePreview(){
  if(pvTimerInterval)clearInterval(pvTimerInterval);
  document.getElementById('preview-overlay').classList.remove('active');
}

// ═══ GO BACK ═══
function goBackFromEditor(){
  var unsaved=0;
  for(var i=0;i<questions.length;i++){if(!questions[i].dbId)unsaved++;}
  if(unsaved>0){if(!confirm('Tienes '+unsaved+' pregunta(s) sin guardar.\n¿Deseas salir?\nTu evaluación quedará como borrador.'))return;}
  if(evaluacionId)localStorage.setItem('alcocer_last_eval_id',evaluacionId);
  window.location.href='/juegos/biblioteca';
}

// ═══ FORMAT ═══
function toggleFormat(f){document.execCommand(f,false,null);}


// ═══ VISIBILITY / GOALS ═══
function selectVisibility(opt){
  var all=document.querySelectorAll('.vis-option');
  for(var i=0;i<all.length;i++)all[i].classList.remove('selected');
  opt.classList.add('selected');
}
function toggleGoalChip(chip){
  var all=document.querySelectorAll('.goal-chip');
  for(var i=0;i<all.length;i++)all[i].classList.remove('selected');
  chip.classList.add('selected');
}

// ═══ TOAST ═══
function showToast(msg,type){
  var ex=document.getElementById('editor-toast');if(ex)ex.remove();
  var t=document.createElement('div');t.id='editor-toast';
  t.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:14px 28px;border-radius:12px;font-size:14px;font-weight:600;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,.15);font-family:Inter,sans-serif;';
  if(type==='error'){t.style.background='#FEE2E2';t.style.color='#DC2626';t.style.border='1px solid #FECACA';}
  else{t.style.background='#DCFCE7';t.style.color='#166534';t.style.border='1px solid #BBF7D0';}
  t.textContent=msg;document.body.appendChild(t);
  setTimeout(function(){t.style.opacity='0';setTimeout(function(){t.remove();},300);},3000);
}

// ═══ NAME CHAR COUNT ═══
function setupCharCount(){
  var inp=document.getElementById('quiz-name-input');
  var cnt=document.getElementById('name-char-count');
  if(inp&&cnt){inp.addEventListener('input',function(){cnt.textContent=inp.value.length+'/64';});}
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded',function(){
  initEditorAuth();
  setupCharCount();
});

// ═══ PWA INSTALLATION ═══
var deferredPromptEditor;
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPromptEditor = e;
    var installBtn = document.getElementById('install-pwa-btn');
    if (installBtn) {
        installBtn.style.display = 'inline-block';
        installBtn.addEventListener('click', function() {
            installBtn.style.display = 'none';
            deferredPromptEditor.prompt();
            deferredPromptEditor.userChoice.then(function(choiceResult) {
                if (choiceResult.outcome === 'accepted') {
                    console.log('Admin aceptó la instalación de la PWA');
                } else {
                    console.log('Admin descartó la instalación de la PWA');
                }
                deferredPromptEditor = null;
            });
        });
    }
});

// ═══ DARK MODE TOGGLE ═══
function applyThemeEditor(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.add('games-app-theme');
    document.body.classList.remove('games-app-theme-light');
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', theme === 'dark' ? '#0f1629' : '#eef2ff');
    }
    updateThemeIconEditor(theme);
}
function initThemeEditor() {
    try {
        var theme = localStorage.getItem('alcocermed_theme') || 'dark';
        applyThemeEditor(theme);
    } catch(e) {}
}
function updateThemeIconEditor(theme) {
    try {
        var icon = document.querySelector('#theme-toggle-btn i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    } catch(e) {}
}
function toggleThemeEditor() {
    try {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        applyThemeEditor(next);
        localStorage.setItem('alcocermed_theme', next);
    } catch(e) {}
}
initThemeEditor();
(function() {
    var btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.addEventListener('click', toggleThemeEditor);
})();

// Aesthetic UI Test Route Hook
document.addEventListener('DOMContentLoaded', function() {
    initThemeEditor();
    
    if (window.location.search.indexOf('mock=true') !== -1) {
        setTimeout(function() {
            var overlay = document.getElementById('teacher-results-overlay');
            if (overlay) {
                overlay.classList.add('active');
                
                // Render gorgeous mock results
                var entries = [
                    { emoji: '🦁', nombre: 'Alejandro Cabrera', puntaje: 2400, total: 5, porcentaje: 100 },
                    { emoji: '🐼', nombre: 'Sofia Lopez', puntaje: 1800, total: 5, porcentaje: 80 },
                    { emoji: '🦊', nombre: 'David Vargas', puntaje: 1200, total: 5, porcentaje: 60 }
                ];
                
                var bgGrads = ['linear-gradient(180deg,#FFD700,#FFA000)', 'linear-gradient(180deg,#E0E0E0,#9E9E9E)', 'linear-gradient(180deg,#CD7F32,#8B5E3C)'];
                var bdColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
                var rankTexts = ['1st', '2nd', '3rd'];
                var pillarOrder = [1, 0, 2];
                var ph = '';
                
                for (var p = 0; p < 3; p++) {
                    var idx = pillarOrder[p];
                    var e = entries[idx];
                    var rankClass = idx === 0 ? 'rank-1' : (idx === 1 ? 'rank-2' : 'rank-3');
                    var rankText = rankTexts[idx];
                    
                    var avatarContent = editorAvatarHtml(e.emoji, e.nombre, idx);
                    
                    ph += '<div class="podium-cylinder ' + rankClass + '" style="animation-delay:' + (p * 0.15) + 's">';
                    ph += '  <div class="podium-avatar-wrapper">';
                    ph += '    ' + avatarContent;
                    ph += '    <div class="podium-name">' + e.nombre + '</div>';
                    ph += '    <div class="podium-points">' + e.puntaje + ' pts</div>';
                    ph += '  </div>';
                    ph += '  <div class="cylinder-top"></div>';
                    ph += '  <div class="cylinder-body">';
                    ph += '    <div class="cylinder-rank">' + rankText + '</div>';
                    ph += '  </div>';
                    ph += '</div>';
                }
                
                var podiumEl = document.getElementById('tr-podium');
                if (podiumEl) podiumEl.innerHTML = ph;
                
                // Mock accuracy
                var trBar = document.getElementById('tr-accuracy-bar');
                var trPct = document.getElementById('tr-accuracy-pct');
                var trMsg = document.getElementById('tr-accuracy-msg');
                if (trBar) trBar.style.width = '80%';
                if (trPct) trPct.textContent = '80%';
                if (trMsg) trMsg.textContent = '¡Buen trabajo de la clase! (3 estudiantes)';
                
                // Mock table rows
                var lh = '';
                for (var l = 0; l < entries.length; l++) {
                    var en = entries[l];
                    var rankColor = l === 0 ? '#FFD700' : l === 1 ? '#C0C0C0' : l === 2 ? '#CD7F32' : 'rgba(255,255,255,.4)';
                    lh += '<div class="tr-row" style="animation-delay: ' + (l * 0.1) + 's">';
                    lh += '  <span class="tr-col-rank" style="color:' + rankColor + '">' + (l + 1) + '</span>';
                    lh += '  <span class="tr-col-name">' + editorAvatarRowHtml(en.emoji, en.nombre) + en.nombre + '</span>';
                    lh += '  <span class="tr-col-score">' + en.puntaje + '</span>';
                    lh += '  <span class="tr-col-acc" style="color:' + (en.porcentaje >= 70 ? '#4ADE80' : en.porcentaje >= 40 ? '#FBBF24' : '#F87171') + '">' + en.porcentaje + '%</span>';
                    lh += '</div>';
                }
                var resultsList = document.getElementById('tr-results-list');
                if (resultsList) resultsList.innerHTML = lh;
            }
        }, 1500);
    }
});

// ═══ IDENTIFICAR PARTES (DND) HELPERS ═══
var activeLocatingOption = -1;

function openQuestionImagePicker(){
  if(currentQuestionIndex<0)return;
  var q=questions[currentQuestionIndex];
  if(q.type==='dnd'){
    showToast('Para identificar partes usa el cargador de imagen de esa seccion','error');
    return;
  }
  var input=document.getElementById('question-image-input');
  if(input){input.value='';input.click();}
}

function handleQuestionImageSelect(event){
  var files=event.target.files;
  if(files&&files.length>0)processQuestionImageFile(files[0]);
}

function clearQuestionImage(){
  if(currentQuestionIndex<0)return;
  setQuestionImage(questions[currentQuestionIndex],'');
  renderQuestionImagePreview();
  markUnsavedChanges();
}

function processQuestionImageFile(file){
  if(!file.type.startsWith('image/')){
    showToast('Solo se permiten archivos de imagen','error');
    return;
  }
  if(file.size>5*1024*1024){
    showToast('La imagen no debe superar 5MB','error');
    return;
  }
  var box=document.getElementById('question-image-preview');
  if(box)box.innerHTML='<div class="question-image-empty loading"><i class="fas fa-spinner fa-spin"></i><span>Subiendo imagen...</span></div>';
  var client=getSupabase();
  var ext=file.name.split('.').pop()||'jpg';
  var fileName='question_'+Date.now()+'_'+Math.random().toString(36).substr(2,6)+'.'+ext;
  client.storage.from('imagenes').upload(fileName,file,{cacheControl:'3600',upsert:false}).then(function(result){
    if(result.error){
      console.warn('Storage upload failed, using base64 fallback:',result.error.message);
      var reader=new FileReader();
      reader.onload=function(e){
        setQuestionImage(questions[currentQuestionIndex],e.target.result);
        renderQuestionImagePreview();
        markUnsavedChanges();
      };
      reader.readAsDataURL(file);
      return;
    }
    var urlResult=client.storage.from('imagenes').getPublicUrl(fileName);
    if(urlResult.data&&urlResult.data.publicUrl){
      setQuestionImage(questions[currentQuestionIndex],urlResult.data.publicUrl);
      renderQuestionImagePreview();
      markUnsavedChanges();
    }
  });
}

function updateDndImage(val){
  if(!val || !val.trim()) return;
  var q = questions[currentQuestionIndex];
  if(!q.options) q.options = [];
  q.options.forEach(function(o){
    o.pregunta_imagen = val.trim();
  });
  renderAnswerOptions();
}

function clearDndImage(){
  var q = questions[currentQuestionIndex];
  if(!q.options) q.options = [];
  q.options.forEach(function(o){
    o.pregunta_imagen = '';
    delete o.pinX;
    delete o.pinY;
  });
  activeLocatingOption = -1;
  renderAnswerOptions();
}

function startDndLocate(idx){
  activeLocatingOption = idx;
  renderAnswerOptions();
  // Scroll to map
  setTimeout(function(){
    var map = document.getElementById('dnd-map-container');
    if(map) map.scrollIntoView({behavior:'smooth', block:'center'});
  }, 100);
}

function cancelDndLocate(){
  activeLocatingOption = -1;
  renderAnswerOptions();
}

function handleDndImageClick(event){
  if(activeLocatingOption === -1) return;
  var img = document.getElementById('dnd-preview-img');
  if(!img) return;
  var rect = img.getBoundingClientRect();
  if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
  var x = ((event.clientX - rect.left) / rect.width) * 100;
  var y = ((event.clientY - rect.top) / rect.height) * 100;
  x = Math.round(x * 100) / 100;
  y = Math.round(y * 100) / 100;
  var q = questions[currentQuestionIndex];
  q.options[activeLocatingOption].pinX = x;
  q.options[activeLocatingOption].pinY = y;
  q.options[activeLocatingOption].correct = true;
  
  // Brief visual feedback
  var ripple = document.createElement('div');
  ripple.style.cssText = 'position:absolute;left:'+x+'%;top:'+y+'%;width:40px;height:40px;border-radius:50%;border:3px solid #22C55E;transform:translate(-50%,-50%) scale(0);animation:dnd-ripple .5s ease-out forwards;z-index:999;pointer-events:none;';
  var stage = img.parentNode;
  stage.appendChild(ripple);
  setTimeout(function(){ if(ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 600);
  
  activeLocatingOption = -1;
  renderAnswerOptions();
}

// ── FILE UPLOAD HANDLERS ──
function handleDndFileDrop(event){
  event.preventDefault();
  event.stopPropagation();
  var dropzone = document.getElementById('dnd-dropzone');
  if(dropzone) dropzone.classList.remove('dnd-dropzone-active');
  
  var files = event.dataTransfer ? event.dataTransfer.files : [];
  if(files.length > 0) processDndFile(files[0]);
}

function handleDndFileSelect(event){
  var files = event.target.files;
  if(files && files.length > 0) processDndFile(files[0]);
}

function processDndFile(file){
  if(!file.type.startsWith('image/')){
    showToast('Solo se permiten archivos de imagen','error');
    return;
  }
  if(file.size > 5 * 1024 * 1024){
    showToast('La imagen no debe superar 5MB','error');
    return;
  }
  
  // Show loading state
  var dropzone = document.getElementById('dnd-dropzone');
  if(dropzone){
    dropzone.innerHTML = '<div class="dnd-dropzone-icon" style="color:#7C3AED"><i class="fas fa-spinner fa-spin"></i></div><div class="dnd-dropzone-title" style="color:#7C3AED">Subiendo imagen...</div><div class="dnd-upload-progress"><div class="dnd-upload-bar" id="dnd-progress-bar"></div></div>';
  }
  
  // Upload to Supabase Storage
  var client = getSupabase();
  var ext = file.name.split('.').pop() || 'jpg';
  var fileName = 'dnd_' + Date.now() + '_' + Math.random().toString(36).substr(2,6) + '.' + ext;
  
  client.storage.from('imagenes').upload(fileName, file, {
    cacheControl: '3600',
    upsert: false
  }).then(function(result){
    if(result.error){
      // Fallback: use base64 if storage bucket doesn't exist
      console.warn('Storage upload failed, using base64 fallback:', result.error.message);
      var reader = new FileReader();
      reader.onload = function(e){
        updateDndImage(e.target.result);
      };
      reader.readAsDataURL(file);
      return;
    }
    // Get public URL
    var urlResult = client.storage.from('imagenes').getPublicUrl(fileName);
    if(urlResult.data && urlResult.data.publicUrl){
      updateDndImage(urlResult.data.publicUrl);
    }
  });
}

window.updateDndImage = updateDndImage;
window.clearDndImage = clearDndImage;
window.startDndLocate = startDndLocate;
window.cancelDndLocate = cancelDndLocate;
window.handleDndImageClick = handleDndImageClick;
window.handleDndFileDrop = handleDndFileDrop;
window.handleDndFileSelect = handleDndFileSelect;
window.openQuestionImagePicker = openQuestionImagePicker;
window.handleQuestionImageSelect = handleQuestionImageSelect;
window.clearQuestionImage = clearQuestionImage;

// ═══ DND PREVIEW (VISTA PREVIA) HELPERS ═══
var pvSelectedDndLabel = -1;
var pvDndMatches = {};

function pvClickLabel(idx) {
  var buttons = document.querySelectorAll('.pv-dnd-label-btn');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.filter = 'brightness(1.0)';
    buttons[i].style.transform = 'scale(1.0)';
  }
  pvSelectedDndLabel = idx;
  var btn = document.getElementById('pv-label-' + idx);
  if(btn) {
    btn.style.filter = 'brightness(1.2)';
    btn.style.transform = 'scale(1.06)';
  }
}

function pvClickSlot(slotIdx) {
  if (pvSelectedDndLabel === -1) return;
  var labelIdx = pvSelectedDndLabel;
  pvDndMatches[slotIdx] = labelIdx;
  
  var slotEl = document.getElementById('pv-slot-' + slotIdx);
  if(slotEl) {
    var optColors = ['#E91E63', '#2563EB', '#E6A15C', '#059669', '#7C3AED', '#0D9488'];
    var color = optColors[labelIdx % optColors.length];
    slotEl.style.background = color;
    slotEl.style.borderColor = '#fff';
    slotEl.style.color = '#fff';
    slotEl.textContent = String.fromCharCode(65 + labelIdx);
  }
  
  var q = questions[pvIdx];
  var slotsCount = 0;
  q.options.forEach(function(o){
    if(o.pinX !== undefined && o.pinY !== undefined) slotsCount++;
  });
  
  var filledCount = 0;
  for(var sIdx = 0; sIdx < q.options.length; sIdx++){
    if(pvDndMatches[sIdx] !== undefined) filledCount++;
  }
  
  var submitBtn = document.getElementById('pv-confirm-dnd-btn');
  if(submitBtn) {
    if(filledCount === slotsCount) {
      submitBtn.disabled = false;
      submitBtn.style.background = '#22C55E';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.disabled = true;
      submitBtn.style.background = '#94A3B8';
      submitBtn.style.cursor = 'not-allowed';
    }
  }
  
  var buttons = document.querySelectorAll('.pv-dnd-label-btn');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style.filter = 'brightness(1.0)';
    buttons[i].style.transform = 'scale(1.0)';
  }
  pvSelectedDndLabel = -1;
}

function pvConfirmDnd() {
  if(pvTimerInterval) clearInterval(pvTimerInterval);
  var q = questions[pvIdx];
  var opts = q.options || [];
  var allCorrect = true;
  
  for (var i = 0; i < opts.length; i++) {
    var slotEl = document.getElementById('pv-slot-' + i);
    if(!slotEl) continue;
    var isCorrect = (pvDndMatches[i] === i);
    if(!isCorrect) allCorrect = false;
    
    if (isCorrect) {
      slotEl.style.background = '#22C55E';
      slotEl.style.borderColor = '#fff';
      slotEl.innerHTML = '<i class="fas fa-check" style="font-size:0.7rem;"></i>';
    } else {
      slotEl.style.background = '#EF4444';
      slotEl.style.borderColor = '#fff';
      slotEl.innerHTML = '<i class="fas fa-times" style="font-size:0.7rem;"></i>';
    }
  }
  
  var labelBtns = document.querySelectorAll('.pv-dnd-label-btn');
  labelBtns.forEach(function(b){
    b.style.opacity = '0.4';
    b.style.pointerEvents = 'none';
  });
  
  var submitBtn = document.getElementById('pv-confirm-dnd-btn');
  if(submitBtn) submitBtn.style.display = 'none';
  
  pvAnswers.push({correcta:allCorrect});
  document.getElementById('pv-next-btn').style.display='block';
  document.getElementById('pv-next-btn').textContent=pvIdx>=questions.length-1?'🏆 Ver resultados':'Siguiente →';
}

window.pvClickLabel = pvClickLabel;
window.pvClickSlot = pvClickSlot;
window.pvConfirmDnd = pvConfirmDnd;
