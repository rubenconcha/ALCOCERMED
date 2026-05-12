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

// ═══ QUESTION TYPES ═══
var questionTypes={
  'Básico':[
    {id:'mc',name:'Opción múltiple',icon:'☑️',css:'qi-mc'},
    {id:'ms',name:'Selección múltiple',icon:'✅',css:'qi-ms'},
    {id:'tf',name:'Verdadero o falso',icon:'🔴',css:'qi-tf'},
    {id:'fb',name:'Completa los espacios',icon:'✏️',css:'qi-fb'},
    {id:'oa',name:'Respuestas abiertas',icon:'📝',css:'qi-oa'},
    {id:'poll',name:'Encuesta',icon:'📊',css:'qi-poll'}
  ],
  'Interactivo y de orden superior':[
    {id:'dnd',name:'Arrastra y suelta',icon:'🖐️',css:'qi-dnd'},
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
  if(editId){loadExistingEvaluation(editId);}
  else{createNewEvaluation();}
  renderQuestionTypes();
  renderQuestionThumbs();
}

// ═══ CREATE / LOAD EVALUATION ═══
function createNewEvaluation(){
  var client=getSupabase();
  client.from('evaluaciones').insert({titulo:'Cuestionario sin título',created_by:currentUser.id,publicado:false}).select().then(function(r){
    if(r.error){console.error(r.error);showToast('Error al crear evaluación','error');return;}
    evaluacionId=r.data[0].id;
    showToast('Borrador creado','success');
  });
}

function loadExistingEvaluation(id){
  var client=getSupabase();evaluacionId=id;
  client.from('evaluaciones').select('*').eq('id',id).single().then(function(r){
    if(r.error)return;
    document.getElementById('quiz-title-input').value=r.data.titulo||'Cuestionario sin título';
  });
  client.from('evaluacion_preguntas').select('*').eq('evaluacion_id',id).order('orden').then(function(r){
    if(r.error||!r.data)return;
    questions=r.data.map(function(p){
      return{dbId:p.id,id:Date.now()+Math.random(),type:p.tipo,text:p.texto,options:p.opciones||[],multipleCorrect:p.multiple_correctas||false,points:p.puntos||1,timer:p.temporizador||30};
    });
    renderQuestionThumbs();updateStats();
    if(questions.length>0)selectQuestion(0);
  });
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
  if(typeId==='tf'){
    opts=[{text:'Verdadero',correct:false,color:'ac-blue'},{text:'Falso',correct:false,color:'ac-pink'}];
  }else if(typeId==='oa'){
    opts=[];
  }else if(typeId==='fb'){
    opts=[];
  }else{
    opts=[{text:'',correct:false,color:'ac-blue'},{text:'',correct:false,color:'ac-teal'},{text:'',correct:false,color:'ac-yellow'},{text:'',correct:false,color:'ac-pink'}];
  }
  var q={id:Date.now(),dbId:null,type:typeId,text:'',options:opts,multipleCorrect:(typeId==='ms'||typeId==='poll'),points:1,timer:30};
  questions.push(q);
  currentQuestionIndex=questions.length-1;
  document.getElementById('q-text-input').value='';
  showEditor();
  renderQuestionThumbs();
  updateTypeLabel(typeId);
  updateStats();
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
    c.innerHTML='<div style="display:flex;gap:16px;width:100%"><div style="flex:1;background:#2D1B4E;border-radius:12px;min-height:120px;display:flex;align-items:center;justify-content:center;padding:20px"><span style="color:rgba(255,255,255,.4);font-size:14px">Escriba la pregunta aquí</span></div><div style="flex:1;background:#fff;border:1px solid #E4E6EF;border-radius:12px;min-height:120px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px"><span style="color:#8E90A6;font-size:14px">Estudiantes escribirán su respuesta aquí</span><span style="color:#CCC;font-size:11px;margin-top:8px">3000 límite de caracteres</span></div></div>';
    return;
  }
  // Fill in blanks
  if(q.type==='fb'){
    c.innerHTML='<div style="width:100%;background:#fff;border:1px solid #E4E6EF;border-radius:12px;padding:20px;text-align:center"><p style="color:#555;font-size:14px;margin-bottom:12px">Escribe tu pregunta arriba y usa <button onclick="insertBlank()" style="background:#E91E63;color:#fff;border:none;padding:4px 12px;border-radius:6px;font-weight:600;cursor:pointer">+ Espacio</button> para agregar un espacio en blanco</p><p style="color:#999;font-size:12px">Los estudiantes completarán los espacios</p></div>';
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
  q.options.push({text:'',correct:false,color:colors[q.options.length%6]});
  renderAnswerOptions();
}
function toggleMultipleAnswers(){
  var q=questions[currentQuestionIndex];q.multipleCorrect=!q.multipleCorrect;
  document.getElementById('multi-toggle').classList.toggle('on',q.multipleCorrect);
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
      +'</div>';
  }
  c.innerHTML=html;
}

function selectQuestion(idx){
  currentQuestionIndex=idx;
  var q=questions[idx];
  showEditor();
  updateTypeLabel(q.type);
  document.getElementById('q-text-input').value=q.text||'';
  document.getElementById('multi-toggle').classList.toggle('on',q.multipleCorrect);
  renderQuestionThumbs();
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

// ═══ SAVE QUESTION TO SUPABASE ═══
function saveQuestion(){
  if(saving)return;
  var q=questions[currentQuestionIndex];
  var inp=document.getElementById('q-text-input');
  if(inp)q.text=inp.value;
  if(!q.text||!q.text.trim()){showToast('Escribe el texto de la pregunta','error');return;}
  // Validate correct answer (except poll/oa/fb)
  if(q.type!=='poll'&&q.type!=='oa'&&q.type!=='fb'){
    var hasC=false;for(var i=0;i<q.options.length;i++){if(q.options[i].correct)hasC=true;}
    if(!hasC){showToast('Selecciona al menos una respuesta correcta','error');return;}
  }
  if(!evaluacionId){showToast('Error: evaluación no inicializada','error');return;}

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
}

// ═══ SETTINGS ═══
function openSettings(){document.getElementById('settings-overlay').classList.add('active');
  var t=document.getElementById('quiz-title-input').value;
  var n=document.getElementById('quiz-name-input');if(n)n.value=t;
}
function closeSettings(){document.getElementById('settings-overlay').classList.remove('active');}

function saveSettingsAndPublish(){
  if(!evaluacionId){closeSettings();return;}
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
  if(questions.length===0){showToast('Agrega al menos una pregunta','error');return;}
  var unsaved=[];
  for(var i=0;i<questions.length;i++){if(!questions[i].dbId)unsaved.push(i+1);}
  if(unsaved.length>0){showToast('Guarda las preguntas '+unsaved.join(', ')+' primero','error');return;}
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

function startLiveSession(){
  closeSessionModal();
  var client=getSupabase();
  client.rpc('generate_quiz_code').then(function(cr){
    if(cr.error){showToast('Error generando código','error');return;}
    var code=cr.data;
    client.from('evaluaciones').update({publicado:true,codigo:code,iniciado:false,updated_at:new Date().toISOString()}).eq('id',evaluacionId).then(function(r){
      if(r.error){showToast('Error al publicar','error');return;}
      showLobby(code);
    });
  });
}

// ═══ LOBBY ═══
var lobbyPollInterval=null;

function showLobby(code){
  var title=document.getElementById('quiz-title-input').value;
  document.getElementById('lobby-quiz-title').textContent=title;
  document.getElementById('lobby-question-count').textContent=questions.length+' preguntas';
  document.getElementById('lobby-code').textContent=code;
  document.getElementById('lobby-player-count').textContent='0';
  document.getElementById('lobby-overlay').classList.add('active');

  // Limpiar participantes anteriores
  var client=getSupabase();
  client.from('evaluacion_participantes').delete().eq('evaluacion_id',evaluacionId).then(function(){});

  // Iniciar polling de participantes cada 3 segundos
  pollLobbyParticipants();
  if(lobbyPollInterval)clearInterval(lobbyPollInterval);
  lobbyPollInterval=setInterval(pollLobbyParticipants,3000);
}

function pollLobbyParticipants(){
  if(!evaluacionId)return;
  var client=getSupabase();
  client.from('evaluacion_participantes').select('nombre,joined_at').eq('evaluacion_id',evaluacionId).order('joined_at').then(function(r){
    if(r.error||!r.data)return;
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
        var initial=name.charAt(0).toUpperCase();
        var colors=['#2563EB','#0D9488','#D97706','#DC2626','#7C3AED','#059669','#E91E63','#F59E0B'];
        var col=colors[i%colors.length];
        html+='<div style="display:flex;flex-direction:column;align-items:center;gap:4px;animation:fadeInUp .3s ease">';
        html+='<div style="width:40px;height:40px;border-radius:50%;background:'+col+';display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,.2)">'+initial+'</div>';
        html+='<span style="font-size:10px;color:rgba(255,255,255,.7);max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+name+'</span>';
        html+='</div>';
      }
      container.innerHTML=html;
    }
  });
}

function closeLobby(){
  document.getElementById('lobby-overlay').classList.remove('active');
  if(lobbyPollInterval){clearInterval(lobbyPollInterval);lobbyPollInterval=null;}
}
function copyLobbyCode(){
  var code=document.getElementById('lobby-code').textContent;
  if(navigator.clipboard){navigator.clipboard.writeText(code).then(function(){showToast('Código copiado: '+code,'success');});}
}
function startGameFromLobby(){
  if(lobbyPollInterval){clearInterval(lobbyPollInterval);lobbyPollInterval=null;}
  // Marcar la evaluación como iniciada en Supabase
  var client=getSupabase();
  client.from('evaluaciones').update({iniciado:true,updated_at:new Date().toISOString()}).eq('id',evaluacionId).then(function(r){
    if(r.error){showToast('Error al iniciar: '+r.error.message,'error');return;}
    showToast('¡Sesión iniciada! Los estudiantes pueden responder ahora.','success');
    closeLobby();
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
  ta.style.border='2px solid #22C55E';
  ta.disabled=true;
  pvAnswers.push({correcta:true}); // open-ended always counted
  document.getElementById('pv-next-btn').style.display='block';
  document.getElementById('pv-next-btn').textContent=pvIdx>=questions.length-1?'🏆 Ver resultados':'Siguiente →';
}

function pvSelectOption(idx){
  if(pvSelected!==-1)return;
  pvSelected=idx;
  if(pvTimerInterval)clearInterval(pvTimerInterval);

  var q=questions[pvIdx];
  var opts=q.options||[];
  var isCorrect=opts[idx]&&opts[idx].correct;
  var buttons=document.querySelectorAll('.pv-opt');

  for(var i=0;i<buttons.length;i++){
    var isSel=(i===idx);
    if(isSel&&isCorrect){buttons[i].style.border='2px solid #22C55E';buttons[i].style.background='rgba(34,197,94,.2)';}
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
  window.location.href='index.html';
}

// ═══ FORMAT ═══
function toggleFormat(f){document.execCommand(f,false,null);}
function toggleTypeDropdown(){/* future */}

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
