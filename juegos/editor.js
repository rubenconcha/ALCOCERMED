// ═══════════════════════════════════════════════════════
// EDITOR DE EVALUACIONES — ALCOCERMED
// Conectado a Supabase: evaluaciones + evaluacion_preguntas
// ═══════════════════════════════════════════════════════

var SUPABASE_URL = 'https://asnwhddmurstzmghuyin.supabase.co';
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';

var _sb = null;
function getSupabase() {
    if (!_sb) _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    return _sb;
}

// ═══ STATE ═══
var questions = [];
var currentQuestionIndex = -1;
var showingTypes = true;
var evaluacionId = null; // UUID de la evaluación actual en Supabase
var currentUser = null;
var saving = false;

// ═══ QUESTION TYPES ═══
var questionTypes = {
    basico: [
        { id: 'mc', name: 'Opción múltiple', icon: '☑️', css: 'qi-mc' },
        { id: 'ms', name: 'Selección múltiple', icon: '✅', css: 'qi-ms' },
        { id: 'tf', name: 'Verdadero o falso', icon: '🔴', css: 'qi-tf' },
        { id: 'fb', name: 'Completa los espacios', icon: '✏️', css: 'qi-fb' },
        { id: 'oa', name: 'Respuestas abiertas', icon: '📝', css: 'qi-oa' }
    ],
    'interactivo': [
        { id: 'dnd', name: 'Arrastra y suelta', icon: '🖐️', css: 'qi-dnd' },
        { id: 'cat', name: 'Categorizar', icon: '📊', css: 'qi-cat' },
        { id: 'ro', name: 'Reordenar', icon: '⬇️', css: 'qi-ro' },
        { id: 'mt', name: 'Relacionar', icon: '🔗', css: 'qi-mt' }
    ]
};

// ═══ AUTH — Verificar que el admin está logueado ═══
function initEditorAuth() {
    var client = getSupabase();
    client.auth.getSession().then(function(result) {
        if (result.data && result.data.session && result.data.session.user) {
            currentUser = result.data.session.user;
            // Verificar que sea admin
            if (currentUser.email.toLowerCase().trim() !== 'pichon4488@gmail.com') {
                alert('Solo el administrador puede crear evaluaciones');
                window.location.href = 'index.html';
                return;
            }
            initEditor();
        } else {
            alert('Debes iniciar sesión para crear evaluaciones');
            window.location.href = 'index.html';
        }
    }).catch(function(err) {
        console.error('Auth error:', err);
        window.location.href = 'index.html';
    });
}

// ═══ INIT EDITOR ═══
function initEditor() {
    // Verificar si se está editando una evaluación existente
    var params = new URLSearchParams(window.location.search);
    var editId = params.get('id');

    if (editId) {
        loadExistingEvaluation(editId);
    } else {
        createNewEvaluation();
    }

    renderQuestionTypes();
    renderQuestionThumbs();
}

// ═══ CREAR NUEVA EVALUACIÓN EN SUPABASE ═══
function createNewEvaluation() {
    var client = getSupabase();
    client.from('evaluaciones').insert({
        titulo: 'Cuestionario sin título',
        created_by: currentUser.id,
        publicado: false
    }).select().then(function(result) {
        if (result.error) {
            console.error('Error creando evaluación:', result.error);
            showToast('Error al crear la evaluación', 'error');
            return;
        }
        evaluacionId = result.data[0].id;
        console.log('Evaluación creada:', evaluacionId);
        showToast('Borrador creado', 'success');
    });
}

// ═══ CARGAR EVALUACIÓN EXISTENTE ═══
function loadExistingEvaluation(id) {
    var client = getSupabase();
    evaluacionId = id;

    // Cargar datos de la evaluación
    client.from('evaluaciones').select('*').eq('id', id).single().then(function(result) {
        if (result.error) {
            console.error('Error cargando evaluación:', result.error);
            showToast('No se pudo cargar la evaluación', 'error');
            return;
        }
        var eval_ = result.data;
        document.getElementById('quiz-title-input').value = eval_.titulo || 'Cuestionario sin título';

        // Cargar los selects de settings
        var nameInput = document.getElementById('quiz-name-input');
        if (nameInput) nameInput.value = eval_.titulo || '';
        var subjectSelect = document.getElementById('settings-subject');
        if (subjectSelect) subjectSelect.value = eval_.asignatura || 'Otro';
        var levelSelect = document.getElementById('settings-level');
        if (levelSelect) levelSelect.value = eval_.nivel || '';
    });

    // Cargar preguntas
    client.from('evaluacion_preguntas').select('*').eq('evaluacion_id', id).order('orden').then(function(result) {
        if (result.error) {
            console.error('Error cargando preguntas:', result.error);
            return;
        }
        questions = result.data.map(function(p) {
            return {
                dbId: p.id,
                id: Date.now() + Math.random(),
                type: p.tipo,
                text: p.texto,
                options: p.opciones || [],
                multipleCorrect: p.multiple_correctas || false
            };
        });
        renderQuestionThumbs();
        if (questions.length > 0) {
            selectQuestion(0);
        }
    });
}

// ═══ RENDER QUESTION TYPES GRID ═══
function renderQuestionTypes() {
    var container = document.getElementById('qtypes-container');
    if (!container) return;

    var html = '';
    var categories = Object.keys(questionTypes);
    for (var c = 0; c < categories.length; c++) {
        var category = categories[c];
        var types = questionTypes[category];
        html += '<div class="qtypes-section"><h3>' + category + '</h3><div class="qtypes-grid">';
        for (var t = 0; t < types.length; t++) {
            var type = types[t];
            var badge = type.badge ? '<span class="qi-badge">' + type.badge + '</span>' : '';
            html += '<div class="qtype-item" onclick="selectQuestionType(\'' + type.id + '\')">' +
                '<div class="qi-icon ' + type.css + '">' + type.icon + '</div>' +
                '<span>' + type.name + badge + '</span></div>';
        }
        html += '</div></div>';
    }
    container.innerHTML = html;
}

// ═══ SELECT QUESTION TYPE ═══
function selectQuestionType(typeId) {
    var defaultOptions;
    if (typeId === 'tf') {
        defaultOptions = [
            { text: 'Verdadero', correct: false, color: 'ac-blue' },
            { text: 'Falso', correct: false, color: 'ac-pink' }
        ];
    } else {
        defaultOptions = [
            { text: '', correct: false, color: 'ac-blue' },
            { text: '', correct: false, color: 'ac-teal' },
            { text: '', correct: false, color: 'ac-yellow' },
            { text: '', correct: false, color: 'ac-pink' }
        ];
    }

    var newQ = {
        id: Date.now(),
        dbId: null, // Se asigna al guardar en Supabase
        type: typeId,
        text: '',
        options: defaultOptions,
        multipleCorrect: false
    };

    questions.push(newQ);
    currentQuestionIndex = questions.length - 1;
    document.getElementById('q-text-input').value = '';
    showEditor(typeId);
    renderQuestionThumbs();
    updateTypeDropdown(typeId);
}

// ═══ SHOW EDITOR / TYPES PANEL ═══
function showEditor(typeId) {
    showingTypes = false;
    document.getElementById('qtypes-panel').style.display = 'none';
    var editor = document.getElementById('question-editor');
    editor.classList.add('active');
    renderAnswerOptions();
}

function showTypesPanel() {
    showingTypes = true;
    document.getElementById('qtypes-panel').style.display = 'block';
    document.getElementById('question-editor').classList.remove('active');
}

function updateTypeDropdown(typeId) {
    var allTypes = [];
    var cats = Object.keys(questionTypes);
    for (var i = 0; i < cats.length; i++) {
        allTypes = allTypes.concat(questionTypes[cats[i]]);
    }
    var found = null;
    for (var j = 0; j < allTypes.length; j++) {
        if (allTypes[j].id === typeId) { found = allTypes[j]; break; }
    }
    var label = document.getElementById('type-dropdown-label');
    if (found && label) label.textContent = found.name;
}

// ═══ RENDER ANSWER OPTIONS ═══
function renderAnswerOptions() {
    var container = document.getElementById('answer-options');
    if (!container || currentQuestionIndex < 0) return;
    var q = questions[currentQuestionIndex];

    var html = '';
    for (var i = 0; i < q.options.length; i++) {
        var opt = q.options[i];
        if (q.type === 'tf') {
            html += '<div class="answer-card ' + opt.color + '">' +
                '<span class="ac-input" style="padding:24px;font-size:18px;font-weight:700;color:#fff;text-align:center;display:block">' + opt.text + '</span>' +
                '<button class="ac-correct ' + (opt.correct ? 'selected' : '') + '" onclick="toggleCorrect(' + i + ')">✓</button></div>';
        } else {
            html += '<div class="answer-card ' + opt.color + '">' +
                '<input class="ac-input" placeholder="Escriba la opción de respuesta aquí" value="' + (opt.text || '').replace(/"/g, '&quot;') + '" oninput="updateOption(' + i + ', this.value)">' +
                '<button class="ac-delete" onclick="removeOption(' + i + ')">🗑️</button>' +
                '<button class="ac-correct ' + (opt.correct ? 'selected' : '') + '" onclick="toggleCorrect(' + i + ')">✓</button></div>';
        }
    }
    container.innerHTML = html;
}

// ═══ TOGGLE CORRECT / UPDATE / REMOVE / ADD ═══
function toggleCorrect(index) {
    var q = questions[currentQuestionIndex];
    if (!q.multipleCorrect) {
        for (var i = 0; i < q.options.length; i++) q.options[i].correct = (i === index);
    } else {
        q.options[index].correct = !q.options[index].correct;
    }
    renderAnswerOptions();
}

function updateOption(index, value) {
    questions[currentQuestionIndex].options[index].text = value;
}

function removeOption(index) {
    var q = questions[currentQuestionIndex];
    if (q.options.length <= 2) return;
    q.options.splice(index, 1);
    renderAnswerOptions();
}

function addOption() {
    var q = questions[currentQuestionIndex];
    if (q.options.length >= 6) return;
    var colors = ['ac-blue', 'ac-teal', 'ac-yellow', 'ac-pink', 'ac-blue', 'ac-teal'];
    q.options.push({ text: '', correct: false, color: colors[q.options.length] });
    renderAnswerOptions();
}

function toggleMultipleAnswers() {
    var q = questions[currentQuestionIndex];
    q.multipleCorrect = !q.multipleCorrect;
    var toggle = document.getElementById('multi-toggle');
    if (toggle) toggle.classList.toggle('on', q.multipleCorrect);
}

// ═══ RENDER QUESTION THUMBNAILS ═══
function renderQuestionThumbs() {
    var container = document.getElementById('question-thumbs');
    if (!container) return;

    var html = '';
    for (var i = 0; i < questions.length; i++) {
        html += '<div class="q-thumb ' + (i === currentQuestionIndex ? 'active' : '') + '" onclick="selectQuestion(' + i + ')">' +
            '<span>' + (i + 1) + '</span></div>';
    }
    html += '<div class="add-q-thumb" onclick="showTypesPanel()">+</div>';
    container.innerHTML = html;
}

function selectQuestion(index) {
    currentQuestionIndex = index;
    var q = questions[index];
    showEditor(q.type);
    updateTypeDropdown(q.type);
    document.getElementById('q-text-input').value = q.text || '';
    renderQuestionThumbs();
}

// ═══ GUARDAR PREGUNTA EN SUPABASE ═══
function saveQuestion() {
    if (saving) return;
    var q = questions[currentQuestionIndex];
    var input = document.getElementById('q-text-input');
    if (input) q.text = input.value;

    // Validaciones
    if (!q.text || q.text.trim() === '') {
        showToast('Escribe el texto de la pregunta', 'error');
        return;
    }
    var hasCorrect = false;
    for (var i = 0; i < q.options.length; i++) {
        if (q.options[i].correct) { hasCorrect = true; break; }
    }
    if (!hasCorrect) {
        showToast('Selecciona al menos una respuesta correcta', 'error');
        return;
    }

    if (!evaluacionId) {
        showToast('Error: evaluación no inicializada', 'error');
        return;
    }

    saving = true;
    var saveBtn = document.querySelector('.save-question-btn');
    if (saveBtn) { saveBtn.textContent = '⏳ Guardando...'; saveBtn.disabled = true; }

    var client = getSupabase();
    var preguntaData = {
        evaluacion_id: evaluacionId,
        tipo: q.type,
        texto: q.text.trim(),
        opciones: q.options,
        multiple_correctas: q.multipleCorrect,
        orden: currentQuestionIndex
    };

    if (q.dbId) {
        // Actualizar pregunta existente
        client.from('evaluacion_preguntas').update(preguntaData).eq('id', q.dbId).select().then(function(result) {
            saving = false;
            if (saveBtn) { saveBtn.textContent = '💾 Guardar pregunta'; saveBtn.disabled = false; }
            if (result.error) {
                console.error('Error actualizando:', result.error);
                showToast('Error al actualizar: ' + result.error.message, 'error');
                return;
            }
            showToast('✅ Pregunta ' + (currentQuestionIndex + 1) + ' actualizada', 'success');
            showTypesPanel();
            renderQuestionThumbs();
        });
    } else {
        // Insertar nueva pregunta
        client.from('evaluacion_preguntas').insert(preguntaData).select().then(function(result) {
            saving = false;
            if (saveBtn) { saveBtn.textContent = '💾 Guardar pregunta'; saveBtn.disabled = false; }
            if (result.error) {
                console.error('Error guardando:', result.error);
                showToast('Error al guardar: ' + result.error.message, 'error');
                return;
            }
            q.dbId = result.data[0].id;
            showToast('✅ Pregunta ' + (currentQuestionIndex + 1) + ' guardada en Supabase', 'success');
            showTypesPanel();
            renderQuestionThumbs();
        });
    }
}

// ═══ SETTINGS ═══
function openSettings() {
    document.getElementById('settings-overlay').classList.add('active');
    // Sincronizar nombre
    var titleInput = document.getElementById('quiz-title-input');
    var nameInput = document.getElementById('quiz-name-input');
    if (titleInput && nameInput) nameInput.value = titleInput.value;
}

function closeSettings() {
    document.getElementById('settings-overlay').classList.remove('active');
}

function saveSettings() {
    if (!evaluacionId) { closeSettings(); return; }

    var nameInput = document.getElementById('quiz-name-input');
    var subjectSelect = document.getElementById('settings-subject');
    var levelSelect = document.getElementById('settings-level');
    var langSelect = document.getElementById('settings-lang');

    var titulo = (nameInput && nameInput.value) ? nameInput.value : 'Cuestionario sin título';

    // Actualizar título visual
    document.getElementById('quiz-title-input').value = titulo;

    // Determinar visibilidad seleccionada
    var visibilidad = 'publica';
    var visOptions = document.querySelectorAll('.vis-option');
    for (var i = 0; i < visOptions.length; i++) {
        if (visOptions[i].classList.contains('selected')) {
            var h4 = visOptions[i].querySelector('h4');
            if (h4) {
                var text = h4.textContent.toLowerCase();
                if (text.indexOf('restringido') !== -1) visibilidad = 'restringido';
                else if (text.indexOf('organización') !== -1 || text.indexOf('organizacion') !== -1) visibilidad = 'organizacion';
            }
            break;
        }
    }

    // Determinar objetivo
    var objetivo = '';
    var goalChips = document.querySelectorAll('.goal-chip.selected');
    if (goalChips.length > 0) objetivo = goalChips[0].textContent;

    var updateData = {
        titulo: titulo,
        asignatura: subjectSelect ? subjectSelect.value : 'Otro',
        nivel: levelSelect ? levelSelect.value : '',
        idioma: langSelect ? langSelect.value : 'Español',
        visibilidad: visibilidad,
        objetivo: objetivo,
        updated_at: new Date().toISOString()
    };

    var client = getSupabase();
    client.from('evaluaciones').update(updateData).eq('id', evaluacionId).then(function(result) {
        if (result.error) {
            console.error('Error guardando ajustes:', result.error);
            showToast('Error al guardar ajustes', 'error');
        } else {
            showToast('✅ Ajustes guardados', 'success');
        }
    });

    closeSettings();
}

// ═══ PUBLICAR EVALUACIÓN ═══
function publishQuiz() {
    if (questions.length === 0) {
        showToast('Agrega al menos una pregunta antes de publicar', 'error');
        return;
    }

    // Verificar que todas las preguntas están guardadas
    var unsaved = [];
    for (var i = 0; i < questions.length; i++) {
        if (!questions[i].dbId) unsaved.push(i + 1);
    }
    if (unsaved.length > 0) {
        showToast('Guarda las preguntas ' + unsaved.join(', ') + ' antes de publicar', 'error');
        return;
    }

    // Verificar respuestas correctas
    var incomplete = [];
    for (var j = 0; j < questions.length; j++) {
        var hasCorrect = false;
        for (var k = 0; k < questions[j].options.length; k++) {
            if (questions[j].options[k].correct) { hasCorrect = true; break; }
        }
        if (!hasCorrect) incomplete.push(j + 1);
    }
    if (incomplete.length > 0) {
        showToast('Pregunta(s) ' + incomplete.join(', ') + ' sin respuesta correcta', 'error');
        return;
    }

    if (!confirm('¿Publicar esta evaluación con ' + questions.length + ' pregunta(s)?\nLos estudiantes podrán unirse con un código.')) return;

    var client = getSupabase();

    // Generar código único
    client.rpc('generate_quiz_code').then(function(codeResult) {
        if (codeResult.error) {
            console.error('Error generando código:', codeResult.error);
            showToast('Error al generar código', 'error');
            return;
        }
        var codigo = codeResult.data;

        // Actualizar evaluación como publicada
        client.from('evaluaciones').update({
            publicado: true,
            codigo: codigo,
            updated_at: new Date().toISOString()
        }).eq('id', evaluacionId).then(function(result) {
            if (result.error) {
                console.error('Error publicando:', result.error);
                showToast('Error al publicar: ' + result.error.message, 'error');
                return;
            }

            // Mostrar modal de éxito con el código
            showPublishSuccess(codigo);
        });
    });
}

// ═══ MODAL DE ÉXITO AL PUBLICAR ═══
function showPublishSuccess(codigo) {
    var overlay = document.createElement('div');
    overlay.className = 'settings-overlay active';
    overlay.id = 'publish-success-overlay';
    overlay.innerHTML = '<div class="settings-modal" style="text-align:center;max-width:420px">' +
        '<div style="font-size:48px;margin-bottom:16px">🎉</div>' +
        '<h2 style="margin-bottom:8px;color:#2E7D32">¡Evaluación publicada!</h2>' +
        '<p style="color:#666;margin-bottom:24px">Los estudiantes pueden unirse con este código:</p>' +
        '<div style="background:#f0f4ff;border:3px solid #2563EB;border-radius:16px;padding:20px;margin-bottom:24px">' +
        '<span style="font-size:36px;font-weight:900;letter-spacing:8px;color:#2563EB">' + codigo + '</span></div>' +
        '<p style="font-size:13px;color:#999;margin-bottom:20px">Comparte este código con tus estudiantes</p>' +
        '<div style="display:flex;gap:12px;justify-content:center">' +
        '<button onclick="copyCode(\'' + codigo + '\')" style="padding:12px 24px;background:#2563EB;color:#fff;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-size:14px">📋 Copiar código</button>' +
        '<button onclick="document.getElementById(\'publish-success-overlay\').remove();window.location.href=\'index.html\'" style="padding:12px 24px;background:#e5e7eb;color:#333;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:14px">Volver al inicio</button>' +
        '</div></div>';
    document.body.appendChild(overlay);
}

function copyCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(function() {
            showToast('Código copiado: ' + code, 'success');
        });
    } else {
        var temp = document.createElement('input');
        document.body.appendChild(temp);
        temp.value = code;
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        showToast('Código copiado: ' + code, 'success');
    }
}

// ═══ TOAST NOTIFICATIONS ═══
function showToast(msg, type) {
    // Remover toast anterior
    var existing = document.getElementById('editor-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.id = 'editor-toast';
    toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);' +
        'padding:14px 28px;border-radius:12px;font-size:14px;font-weight:600;z-index:10000;' +
        'box-shadow:0 8px 32px rgba(0,0,0,.15);transition:opacity .3s;font-family:Inter,sans-serif;';

    if (type === 'error') {
        toast.style.background = '#FEE2E2';
        toast.style.color = '#DC2626';
        toast.style.border = '1px solid #FECACA';
    } else {
        toast.style.background = '#DCFCE7';
        toast.style.color = '#166534';
        toast.style.border = '1px solid #BBF7D0';
    }

    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(function() {
        toast.style.opacity = '0';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

// ═══ GO BACK ═══
function goBackFromEditor() {
    // Contar preguntas sin guardar en Supabase
    var unsaved = 0;
    for (var i = 0; i < questions.length; i++) {
        if (!questions[i].dbId) unsaved++;
    }
    if (unsaved > 0) {
        if (!confirm('Tienes ' + unsaved + ' pregunta(s) sin guardar.\n¿Deseas salir sin guardarlas?\n\nTu evaluación quedará guardada como borrador y podrás editarla desde la Biblioteca.')) return;
    }
    // Guardar el ID de evaluación para poder reanudar
    if (evaluacionId) {
        localStorage.setItem('alcocer_last_eval_id', evaluacionId);
    }
    window.location.href = 'index.html';
}

// ═══ FORMAT BUTTONS ═══
function toggleFormat(format) {
    document.execCommand(format, false, null);
}

// ═══ VISIBILITY SELECTION ═══
function selectVisibility(option) {
    var all = document.querySelectorAll('.vis-option');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
    option.classList.add('selected');
}

// ═══ GOAL CHIP ═══
function toggleGoalChip(chip) {
    var all = document.querySelectorAll('.goal-chip');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('selected');
    chip.classList.add('selected');
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', function() {
    initEditorAuth();
});
