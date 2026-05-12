// ===== EVALUATION EDITOR LOGIC =====

let questions = [];
let currentQuestionIndex = -1;
let showingTypes = true;

// --- Question Types Data ---
const questionTypes = {
  basico: [
    { id: 'mc', name: 'Opción múltiple', icon: '☑️', css: 'qi-mc' },
    { id: 'ms', name: 'Selección múltiple', icon: '✅', css: 'qi-ms' },
    { id: 'tf', name: 'Verdadero o falso', icon: '🔴', css: 'qi-tf' },
    { id: 'fb', name: 'Completa los espacios en blanco', icon: '✏️', css: 'qi-fb' },
    { id: 'oa', name: 'Respuestas abiertas', icon: '📝', css: 'qi-oa' },
    { id: 'rd', name: 'Lectura', icon: '📖', css: 'qi-rd' }
  ],
  'interactivo y de orden superior': [
    { id: 'dnd', name: 'Arrastra y suelta', icon: '🖐️', css: 'qi-dnd' },
    { id: 'dd', name: 'Menú desplegable', icon: '🔽', css: 'qi-dd' },
    { id: 'cat', name: 'Categorizar', icon: '📊', css: 'qi-cat' },
    { id: 'ro', name: 'Reordenar', icon: '⬇️', css: 'qi-ro' },
    { id: 'mt', name: 'Relacionar', icon: '🔗', css: 'qi-mt' },
    { id: 'it', name: 'Texto interactivo', icon: '📋', css: 'qi-it', badge: 'NUEVO' }
  ],
  'aprendizaje visual': [
    { id: 'lb', name: 'Etiquetado', icon: '🏷️', css: 'qi-lb' },
    { id: 'hp', name: 'Punto clave', icon: '🎯', css: 'qi-hp' }
  ],
  'matemáticas': [
    { id: 'gr', name: 'Gráfica', icon: '📈', css: 'qi-gr' },
    { id: 'mr', name: 'Respuesta matemática', icon: 'ƒ(x)', css: 'qi-mr' }
  ],
  'respuestas abiertas': [
    { id: 'dr', name: 'Dibujar', icon: '🎨', css: 'qi-dr' },
    { id: 'vr', name: 'Respuesta en video', icon: '🎬', css: 'qi-vr' },
    { id: 'ar', name: 'Respuesta de audio', icon: '🔊', css: 'qi-ar' },
    { id: 'sv', name: 'Encuesta', icon: '📊', css: 'qi-sv' },
    { id: 'wc', name: 'Nube de palabras', icon: '☁️', css: 'qi-wc' }
  ]
};

// --- Render Question Types Grid ---
function renderQuestionTypes() {
  const container = document.getElementById('qtypes-container');
  if (!container) return;

  let html = '';
  for (const [category, types] of Object.entries(questionTypes)) {
    html += `<div class="qtypes-section">
      <h3>${category}${category === 'basico' ? '' : ''}<span class="hint">🖱️ Pase el cursor para obtener una vista previa</span></h3>
      <div class="qtypes-grid">`;
    types.forEach(t => {
      const badge = t.badge ? `<span class="qi-badge">${t.badge}</span>` : '';
      html += `<div class="qtype-item" onclick="selectQuestionType('${t.id}')">
        <div class="qi-icon ${t.css}">${t.icon}</div>
        <span>${t.name}${badge}</span>
      </div>`;
    });
    html += `</div></div>`;
  }
  container.innerHTML = html;
}

// --- Select Question Type ---
function selectQuestionType(typeId) {
  const newQ = {
    id: Date.now(),
    type: typeId,
    text: '',
    options: typeId === 'tf'
      ? [{ text: 'Verdadero', correct: false, color: 'ac-blue' }, { text: 'Falso', correct: false, color: 'ac-pink' }]
      : [
          { text: '', correct: false, color: 'ac-blue' },
          { text: '', correct: false, color: 'ac-teal' },
          { text: '', correct: false, color: 'ac-yellow' },
          { text: '', correct: false, color: 'ac-pink' }
        ],
    multipleCorrect: false
  };
  questions.push(newQ);
  currentQuestionIndex = questions.length - 1;
  showEditor(typeId);
  renderQuestionThumbs();
  updateTypeDropdown(typeId);
}

// --- Show Editor ---
function showEditor(typeId) {
  showingTypes = false;
  document.getElementById('qtypes-panel').style.display = 'none';
  const editor = document.getElementById('question-editor');
  editor.classList.add('active');
  renderAnswerOptions();
}

// --- Show Types Panel ---
function showTypesPanel() {
  showingTypes = true;
  document.getElementById('qtypes-panel').style.display = 'block';
  document.getElementById('question-editor').classList.remove('active');
}

// --- Update Type Dropdown Label ---
function updateTypeDropdown(typeId) {
  const allTypes = Object.values(questionTypes).flat();
  const found = allTypes.find(t => t.id === typeId);
  const label = document.getElementById('type-dropdown-label');
  if (found && label) {
    label.textContent = found.name;
  }
}

// --- Render Answer Options ---
function renderAnswerOptions() {
  const container = document.getElementById('answer-options');
  if (!container || currentQuestionIndex < 0) return;
  const q = questions[currentQuestionIndex];

  if (q.type === 'tf') {
    container.innerHTML = q.options.map((opt, i) => `
      <div class="answer-card ${opt.color}">
        <span class="ac-input" style="padding:24px;font-size:18px;font-weight:700;color:#fff;text-align:center;display:block">${opt.text}</span>
        <button class="ac-correct ${opt.correct ? 'selected' : ''}" onclick="toggleCorrect(${i})">✓</button>
      </div>
    `).join('');
  } else {
    container.innerHTML = q.options.map((opt, i) => `
      <div class="answer-card ${opt.color}">
        <input class="ac-input" placeholder="Escriba la opción de respuesta aquí" value="${opt.text}" oninput="updateOption(${i}, this.value)">
        <button class="ac-delete" onclick="removeOption(${i})">🗑️</button>
        <button class="ac-correct ${opt.correct ? 'selected' : ''}" onclick="toggleCorrect(${i})">✓</button>
      </div>
    `).join('');
  }
}

// --- Toggle Correct Answer ---
function toggleCorrect(index) {
  const q = questions[currentQuestionIndex];
  if (!q.multipleCorrect) {
    q.options.forEach((o, i) => o.correct = i === index);
  } else {
    q.options[index].correct = !q.options[index].correct;
  }
  renderAnswerOptions();
}

// --- Update Option Text ---
function updateOption(index, value) {
  questions[currentQuestionIndex].options[index].text = value;
}

// --- Remove Option ---
function removeOption(index) {
  const q = questions[currentQuestionIndex];
  if (q.options.length <= 2) return;
  q.options.splice(index, 1);
  renderAnswerOptions();
}

// --- Add Option ---
function addOption() {
  const q = questions[currentQuestionIndex];
  if (q.options.length >= 6) return;
  const colors = ['ac-blue', 'ac-teal', 'ac-yellow', 'ac-pink', 'ac-blue', 'ac-teal'];
  q.options.push({ text: '', correct: false, color: colors[q.options.length] });
  renderAnswerOptions();
}

// --- Toggle Multiple Answers ---
function toggleMultipleAnswers() {
  const q = questions[currentQuestionIndex];
  q.multipleCorrect = !q.multipleCorrect;
  const toggle = document.getElementById('multi-toggle');
  toggle.classList.toggle('on', q.multipleCorrect);
}

// --- Render Question Thumbnails ---
function renderQuestionThumbs() {
  const container = document.getElementById('question-thumbs');
  if (!container) return;

  let html = questions.map((q, i) => `
    <div class="q-thumb ${i === currentQuestionIndex ? 'active' : ''}" onclick="selectQuestion(${i})">
      <span>${i + 1}</span>
    </div>
  `).join('');
  html += `<div class="add-q-thumb" onclick="showTypesPanel()">+</div>`;
  container.innerHTML = html;
}

// --- Select Question ---
function selectQuestion(index) {
  currentQuestionIndex = index;
  const q = questions[index];
  showEditor(q.type);
  updateTypeDropdown(q.type);
  document.getElementById('q-text-input').value = q.text;
  renderQuestionThumbs();
}

// --- Save Question ---
function saveQuestion() {
  const q = questions[currentQuestionIndex];
  const input = document.getElementById('q-text-input');
  if (input) q.text = input.value;

  const hasCorrect = q.options.some(o => o.correct);
  if (!hasCorrect) {
    alert('Selecciona al menos una respuesta correcta');
    return;
  }

  showTypesPanel();
  renderQuestionThumbs();
}

// --- Settings Modal ---
function openSettings() {
  document.getElementById('settings-overlay').classList.add('active');
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('active');
}

function saveSettings() {
  const nameInput = document.getElementById('quiz-name-input');
  if (nameInput) {
    document.getElementById('quiz-title-input').value = nameInput.value || 'Cuestionario sin título';
  }
  closeSettings();
}

// --- Publish ---
function publishQuiz() {
  if (questions.length === 0) {
    alert('Agrega al menos una pregunta antes de publicar');
    return;
  }
  const incomplete = questions.filter(q => !q.options.some(o => o.correct));
  if (incomplete.length > 0) {
    alert(`Hay ${incomplete.length} pregunta(s) sin respuesta correcta`);
    return;
  }
  alert('¡Cuestionario publicado exitosamente! 🎉');
}

// --- Go Back ---
function goBackFromEditor() {
  if (questions.length > 0 && !confirm('¿Deseas salir? Los cambios no guardados se perderán.')) return;
  window.location.href = 'index.html';
}

// --- Format Buttons ---
function toggleFormat(format) {
  document.execCommand(format, false, null);
}

// --- Visibility Selection ---
function selectVisibility(option) {
  document.querySelectorAll('.vis-option').forEach(v => v.classList.remove('selected'));
  option.classList.add('selected');
}

// --- Goal Chip ---
function toggleGoalChip(chip) {
  document.querySelectorAll('.goal-chip').forEach(c => c.classList.remove('selected'));
  chip.classList.add('selected');
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  renderQuestionTypes();
  renderQuestionThumbs();
});
