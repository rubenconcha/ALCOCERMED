\n/* ================= WAYGROUND JS ================= */\n// ===== WAYGROUND ADMIN REPLICA - APP.JS =====

// --- DATA ---
const resourceData = [
  { name: 'enVision Mathematics', color: '#4CAF50' },
  { name: 'Big Ideas Math', color: '#2196F3' },
  { name: 'Illustrative Mathematics', color: '#FF9800' },
  { name: 'Reveal Math', color: '#E91E63' },
  { name: 'Into Math', color: '#9C27B0' },
  { name: 'Bluebonnet Learning', color: '#00BCD4' }
];

const standardResources = [
  { name: 'Ratios & Proportions', color: '#FF5722' },
  { name: 'Expressions & Equations', color: '#3F51B5' },
  { name: 'Geometry Basics', color: '#009688' },
  { name: 'Statistics & Probability', color: '#795548' }
];

const myActivities = [
  { name: 'clase 1', type: 'Presentación', questions: '1 P', subject: 'Otro', grade: 'Universidad', time: '35 minutos', icon: '📊' }
];

const reportData = [
  { name: 'Preguntas', type: 'Assessment', mode: 'Desafío', pct: 69, color: '#F59E0B', date: 'abr 14, 2020' },
  { name: 'Geografía', type: 'Assessment', mode: 'Desafío', pct: 100, color: '#22C55E', date: 'abr 14, 2020' },
  { name: 'Los Vengadores', type: 'Assessment', mode: 'Desafío', pct: 80, color: '#6C2EB9', date: 'abr 14, 2020' },
  { name: 'Coronavirus', type: 'Assessment', mode: 'Desafío', pct: 66, color: '#F59E0B', date: 'abr 14, 2020' },
  { name: 'Identifica los muebles', type: 'Assessment', mode: 'Desafío', pct: 67, color: '#F59E0B', date: 'abr 14, 2020' },
  { name: 'Fotosíntesis - Nivel Básico', type: 'Assessment', mode: 'Desafío', pct: 87, color: '#6C2EB9', date: 'abr 14, 2020' }
];

const searchResults = [
  { name: 'matem.2', grade: '1er grado', questions: 17, type: 'Evaluación' },
  { name: 'matem-2019', grade: '5to grado', questions: 16, type: 'Evaluación' },
  { name: 'matem 10-6', grade: '5to grado', questions: 11, type: 'Evaluación' },
  { name: 'matem 10-4', grade: '1er grado', questions: 19, type: 'Evaluación' }
];

// --- NAVIGATION ---
let currentPage = 'explorar';

function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('wg-page-' + page);
  if (target) target.classList.add('active');

  // Update bottom nav
  document.querySelectorAll('.bnav-item').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.bnav-item[data-page="${page}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update sidebar nav
  document.querySelectorAll('.sidebar .nav-item').forEach(n => n.classList.remove('active'));
  const activeSidebar = document.querySelector(`.sidebar .nav-item[data-page="${page}"]`);
  if (activeSidebar) activeSidebar.classList.add('active');

  closeSidebar();
}

// --- SIDEBAR ---
function openSidebar() {
  document.getElementById('wg-sidebar').classList.add('open');
  document.getElementById('wg-sidebar-overlay').classList.add('active');
}

function closeSidebar() {
  document.getElementById('wg-sidebar').classList.remove('open');
  document.getElementById('wg-sidebar-overlay').classList.remove('active');
}

// --- HERO TABS ---
function switchHeroTab(tab) {
  document.querySelectorAll('.hero-action').forEach(a => a.classList.remove('active'));
  const el = document.querySelector(`.hero-action[data-tab="${tab}"]`);
  if (el) el.classList.add('active');

  document.querySelectorAll('.hero-tab-content').forEach(c => c.classList.remove('active'));
  const content = document.getElementById('hero-content-' + tab);
  if (content) content.classList.add('active');
}

// --- RENDER FUNCTIONS ---
function renderResourceCards() {
  const grid1 = document.getElementById('resource-grid-1');
  const grid2 = document.getElementById('resource-grid-2');
  if (!grid1) return;

  grid1.innerHTML = resourceData.map(r => `
    <div class="resource-card">
      <span class="rc-name">${r.name}</span>
      <div class="rc-img" style="background:${r.color}20">
        <span style="font-size:24px;color:${r.color}">📚</span>
      </div>
    </div>
  `).join('');

  if (grid2) {
    grid2.innerHTML = standardResources.map(r => `
      <div class="resource-card">
        <span class="rc-name">${r.name}</span>
        <div class="rc-img" style="background:${r.color}20">
          <span style="font-size:24px;color:${r.color}">📐</span>
        </div>
      </div>
    `).join('');
  }
}

function renderActivities() {
  const container = document.getElementById('activity-list');
  if (!container) return;

  if (myActivities.length === 0) {
    container.innerHTML = `<div class="empty-state"><i>📁</i><p>No hay actividades creadas aún</p></div>`;
    return;
  }

  container.innerHTML = myActivities.map(a => `
    <div class="activity-row">
      <div class="ar-icon">${a.icon}</div>
      <div class="ar-info">
        <h4>${a.name}</h4>
        <div class="ar-meta">
          <span class="badge-type" style="background:#DCFCE7;color:#16A34A">✓</span>
          <span>${a.questions}</span>
          <span>•</span>
          <span>${a.subject}</span>
          <span>•</span>
          <span>${a.grade}</span>
        </div>
      </div>
      <span class="ar-time">${a.time} hace</span>
    </div>
  `).join('');
}

function renderReports() {
  const container = document.getElementById('report-list');
  if (!container) return;

  container.innerHTML = reportData.map(r => {
    const circumference = 2 * Math.PI * 12;
    const offset = circumference - (r.pct / 100) * circumference;
    return `
    <div class="report-item">
      <div class="ri-progress">
        <div class="progress-ring">
          <svg viewBox="0 0 32 32">
            <circle class="bg" cx="16" cy="16" r="12" />
            <circle cx="16" cy="16" r="12" stroke="${r.color}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" />
          </svg>
          <span class="pct" style="color:${r.color}">${r.pct}%</span>
        </div>
      </div>
      <div class="ri-info">
        <h4>${r.name}</h4>
        <div class="ri-meta">
          <span class="badge-assess">✓ ${r.type}</span>
          <span>•</span>
          <span>${r.mode}</span>
        </div>
      </div>
      <span class="ri-date">${r.date}</span>
      <div class="ri-menu">⋮</div>
    </div>
  `;
  }).join('');
}

function renderSearchResults() {
  const container = document.getElementById('search-results');
  if (!container) return;

  const emojis = ['📝', '📊', '🎯', '✏️'];
  container.innerHTML = searchResults.map((r, i) => `
    <div class="search-result-card">
      <div class="src-thumb">
        <span style="font-size:28px">${emojis[i % emojis.length]}</span>
      </div>
      <div class="src-info">
        <h4>${r.name}</h4>
        <div class="src-meta">${r.grade} • ${r.questions} Preguntas</div>
      </div>
    </div>
  `).join('');
}

// --- SEARCH ---
function handleSearch(e) {
  if (e.key === 'Enter' || e.type === 'click') {
    const input = document.getElementById('wg-main-search-input');
    const val = input ? input.value.trim() : '';
    if (val) {
      document.getElementById('search-query-display').textContent = val;
      navigateTo('buscar');
    }
  }
}

function handleGlobalSearch(e) {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    if (val) {
      document.getElementById('wg-main-search-input') && (document.getElementById('wg-main-search-input').value = val);
      document.getElementById('search-query-display').textContent = val;
      navigateTo('buscar');
    }
  }
}

// --- BIBLIOTECA SUB-NAV ---
function switchBiblioTab(tab) {
  document.querySelectorAll('.biblio-sidebar .bsb-item').forEach(i => i.classList.remove('active'));
  const el = document.querySelector(`.bsb-item[data-btab="${tab}"]`);
  if (el) el.classList.add('active');
}

// --- SEARCH TABS ---
function switchSearchTab(tab) {
  document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
  const el = document.querySelector(`.search-tab[data-stab="${tab}"]`);
  if (el) el.classList.add('active');
}

// --- GREETING ---
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  // Set greeting
  const greetEl = document.getElementById('greeting-text');
  if (greetEl) greetEl.textContent = `${getGreeting()}, ruben 👋 Comencemos.`;

  // Render content
  renderResourceCards();
  renderActivities();
  renderReports();
  renderSearchResults();

  // Event listeners
  document.getElementById('wg-hamburger-btn').addEventListener('click', openSidebar);
  document.getElementById('wg-sidebar-overlay').addEventListener('click', closeSidebar);

  // Bottom nav
  document.querySelectorAll('.bnav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.page));
  });

  // Sidebar nav
  document.querySelectorAll('.sidebar .nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });

  // Hero tabs
  document.querySelectorAll('.hero-action').forEach(action => {
    action.addEventListener('click', () => switchHeroTab(action.dataset.tab));
  });

  // Search
  const mainSearch = document.getElementById('wg-main-search-input');
  if (mainSearch) mainSearch.addEventListener('keydown', handleSearch);
  const searchBtn = document.getElementById('search-submit-btn');
  if (searchBtn) searchBtn.addEventListener('click', handleSearch);
  const globalSearch = document.getElementById('wg-global-search-input');
  if (globalSearch) globalSearch.addEventListener('keydown', handleGlobalSearch);

  // Biblioteca sub-nav
  document.querySelectorAll('.bsb-item').forEach(item => {
    item.addEventListener('click', () => switchBiblioTab(item.dataset.btab));
  });

  // Search tabs
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => switchSearchTab(tab.dataset.stab));
  });

  // Navigate to explorar
  navigateTo('explorar');
});
\n\n/* ================= EDITOR JS ================= */\n// ===== EVALUATION EDITOR LOGIC =====

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
