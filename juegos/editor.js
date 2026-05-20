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
    titleLoaded=true; checkPlay();
  });
  client.from('evaluacion_preguntas').select('*').eq('evaluacion_id',id).order('orden').then(function(r){
    if(r.error||!r.data)return;
    questions=r.data.map(function(p){
      return{dbId:p.id,id:Date.now()+Math.random(),type:p.tipo,text:p.texto,options:p.opciones||[],multipleCorrect:p.multiple_correctas||false,points:p.puntos||1,timer:p.temporizador||30};
    });
    renderQuestionThumbs();updateStats();
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
      html += '    <div id="dnd-map-container" class="dnd-map-container' + (isLocatingAny ? ' dnd-map-active' : '') + '" onclick="handleDndImageClick(event)">';
      html += '      <img src="' + imageVal + '" class="dnd-map-img" id="dnd-preview-img">';
      
      // Render placed pins
      for(var i=0; i<q.options.length; i++){
        var o = q.options[i];
        if(o.pinX !== undefined && o.pinY !== undefined){
          var pinColors = {
            'ac-blue': '#2563EB', 'ac-teal': '#0D9488', 'ac-yellow': '#D97706', 'ac-pink': '#DC2626', 'ac-purple': '#7C3AED', 'ac-green': '#059669'
          };
          var pinColor = pinColors[o.color] || '#E91E63';
          html += '      <div class="dnd-pin" style="left:' + o.pinX + '%; top:' + o.pinY + '%; background:' + pinColor + ';">';
          html += '        <span class="dnd-pin-letter">' + String.fromCharCode(65+i) + '</span>';
          html += '        <div class="dnd-pin-pulse" style="border-color:' + pinColor + '"></div>';
          if(o.text) html += '        <div class="dnd-pin-tooltip">' + o.text + '</div>';
          html += '      </div>';
        }
      }
      
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
  q.options.push({text:'',correct:false,color:colors[q.options.length%6]});
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
      +'</div>';
  }
  c.innerHTML=html;
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

  function saveAllQuestions(){
    if(questions.length === 0){ finishSave(null); return; }
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
            if(pending <= 0) finishSave(anyError);
          });
        } else {
          if(!data.texto){
            pending--;
            if(pending <= 0) finishSave(anyError);
            return;
          }
          client.from('evaluacion_preguntas').insert(data).select().then(function(r){
            if(r.error){ anyError = r.error.message; }
            else { q.dbId = r.data[0].id; }
            pending--;
            if(pending <= 0) finishSave(anyError);
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

  // Limpiar participantes y resultados anteriores antes de empezar a hacer polling
  var client=getSupabase();
  Promise.all([
    client.from('evaluacion_participantes').delete().eq('evaluacion_id',evaluacionId),
    client.from('evaluacion_resultados').delete().eq('evaluacion_id',evaluacionId)
  ]).then(function(){
    // Limpiar contenedor de participantes visualmente
    var container=document.getElementById('lobby-players-list');
    if(container) container.innerHTML='';
    document.getElementById('lobby-player-count').textContent='0';
    // Ahora sí iniciar polling con tabla limpia
    pollLobbyParticipants();
    if(lobbyPollInterval)clearInterval(lobbyPollInterval);
    lobbyPollInterval=setInterval(pollLobbyParticipants,3000);
  });
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
  var client = getSupabase();
  client.from('evaluacion_preguntas').select('*').eq('evaluacion_id', id).order('orden').then(function(r) {
    if (r.error || !r.data || r.data.length === 0) return;
    var qs = r.data;
    var html = '';
    for (var i = 0; i < qs.length; i++) {
       var q = qs[i];
       html += '<div style="margin-bottom:16px;padding:16px;background:rgba(255,255,255,0.05);border-radius:12px;border-left:4px solid #8B5CF6;">';
       html += '<div style="font-weight:700;color:#fff;margin-bottom:12px;font-size:1.05rem;">' + (i+1) + '. ' + (q.text || 'Pregunta sin texto') + '</div>';
       if (q.tipo === 'ms') {
          var opts = q.opciones || [];
          for (var j = 0; j < opts.length; j++) {
              var isCorrect = opts[j].correct;
              var color = isCorrect ? '#4ADE80' : 'rgba(255,255,255,0.5)';
              var bg = isCorrect ? 'rgba(74, 222, 128, 0.1)' : 'transparent';
              var fw = isCorrect ? 'bold' : 'normal';
              var icon = isCorrect ? '<i class="fas fa-check-circle" style="margin-right:8px"></i>' : '<i class="far fa-circle" style="margin-right:8px"></i>';
              html += '<div style="color:'+color+';font-weight:'+fw+';margin-bottom:6px;font-size:0.95rem;padding:6px 10px;border-radius:6px;background:'+bg+';">' + icon + (opts[j].text || '(Opción vacía)') + '</div>';
          }
       } else if (q.tipo === 'oa' || q.tipo === 'fb') {
          html += '<div style="color:#4ADE80;font-weight:bold;font-size:0.95rem;padding:6px 10px;background:rgba(74, 222, 128, 0.1);border-radius:6px;"><i class="fas fa-check-double" style="margin-right:8px"></i>Respuesta libre o abierta (Se revisa manualmente)</div>';
       }
       html += '</div>';
    }
    var reviewEl = document.getElementById('tr-question-review-content');
    var reviewContainer = document.getElementById('tr-question-review');
    if (reviewEl && reviewContainer) {
        reviewEl.innerHTML = html;
        reviewContainer.style.display = 'block';
    }
  });
}

function closeTeacherResults(){
  document.getElementById('teacher-results-overlay').classList.remove('active');
  document.body.classList.remove('loading-results');
  if(teacherResultsPoll){clearInterval(teacherResultsPoll);teacherResultsPoll=null;}
  sessionStorage.removeItem('alcocer_teacher_eval');
  
  if (window.location.search.includes('results=true')) {
    window.location.href = '/juegos/biblioteca';
  }
}

function pollTeacherResults(){
  if(!evaluacionId)return;
  var client=getSupabase();
  client.from('evaluacion_resultados').select('user_id,puntaje,total,porcentaje').eq('evaluacion_id',evaluacionId).order('porcentaje',{ascending:false}).order('puntaje',{ascending:false}).then(function(r){
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

      var entries=[];
      var totalPct=0;
      for(var k=0;k<r.data.length;k++){
        var fullNombre = nameMap[r.data[k].user_id] || 'Estudiante';
        var parts = fullNombre.split('|');
        var emoji = parts.length > 1 ? parts[0] : '';
        var nombreReal = parts.length > 1 ? parts[1] : fullNombre;
        entries.push({emoji: emoji, nombre: nombreReal, puntaje: r.data[k].puntaje, total: r.data[k].total, porcentaje: r.data[k].porcentaje});
        totalPct+=r.data[k].porcentaje;
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
        
        var avatarContent = e.emoji 
          ? '<div class="podium-avatar">' + e.emoji + '</div>'
          : '<div class="podium-avatar" style="font-size:24px;width:48px;height:48px;border-radius:50%;background:'+bgGrads[idx]+';display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;border:3px solid '+bdColors[idx]+';box-shadow:0 4px 12px rgba(0,0,0,0.3)">'+e.nombre.charAt(0).toUpperCase()+'</div>';

        var animStyle = isFirstRender 
          ? ('animation-delay:' + (p*0.15) + 's') 
          : 'animation: none !important; opacity: 1 !important; transform: translateY(0) !important;';

        ph+='<div class="podium-cylinder ' + rankClass + '" style="' + animStyle + '">';
        
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
        lh+='<div class="tr-row" style="animation-delay: ' + (l * 0.05) + 's">';
        lh+='<span class="tr-col-rank" style="color:'+rankColor+'">'+(l+1)+'</span>';
        lh+='<span class="tr-col-name">'+(en.emoji?'<span>'+en.emoji+'</span>':'')+en.nombre+'</span>';
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
    
    html += '  <div style="position:relative; display:inline-block; max-width:100%; border-radius:12px; overflow:hidden; border:3px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.05);">';
    html += '    <img src="' + imgUrl + '" style="max-width:100%; max-height:260px; display:block; user-select:none; pointer-events:none;">';
    
    for (var i = 0; i < opts.length; i++) {
        var o = opts[i];
        if (o.pinX !== undefined && o.pinY !== undefined) {
            html += '  <div class="pv-dnd-slot" id="pv-slot-' + i + '" onclick="pvClickSlot(' + i + ')" ' +
                'style="position:absolute; left:' + o.pinX + '%; top:' + o.pinY + '%; transform:translate(-50%, -50%); ' +
                'width:30px; height:30px; border-radius:50%; background:#fff; border:2px solid #E2E8F0; ' +
                'color:#334155; display:flex; align-items:center; justify-content:center; font-weight:900; ' +
                'font-size:0.85rem; cursor:pointer; box-shadow:0 4px 10px rgba(0,0,0,0.3); z-index:100;">?</div>';
        }
    }
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
function initThemeEditor() {
    var theme = localStorage.getItem('alcocermed_theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIconEditor(theme);
    
    var themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            var current = document.documentElement.getAttribute('data-theme');
            var next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('alcocermed_theme', next);
            updateThemeIconEditor(next);
        });
    }
}
function updateThemeIconEditor(theme) {
    var icon = document.querySelector('#theme-toggle-btn i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

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
                    
                    var avatarContent = e.emoji 
                        ? '<div class="podium-avatar">' + e.emoji + '</div>'
                        : '<div class="podium-avatar" style="font-size:24px;width:48px;height:48px;border-radius:50%;background:'+bgGrads[idx]+';display:flex;align-items:center;justify-content:center;font-weight:800;color:#fff;border:3px solid '+bdColors[idx]+';box-shadow:0 4px 12px rgba(0,0,0,0.3)">'+e.nombre.charAt(0).toUpperCase()+'</div>';
                    
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
                    lh += '  <span class="tr-col-name">' + en.emoji + ' ' + en.nombre + '</span>';
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
document.addEventListener('DOMContentLoaded', initThemeEditor);

// ═══ IDENTIFICAR PARTES (DND) HELPERS ═══
var activeLocatingOption = -1;

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
  var container = document.getElementById('dnd-map-container');
  if(!container) return;
  var rect = container.getBoundingClientRect();
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
  container.appendChild(ripple);
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

