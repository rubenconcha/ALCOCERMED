// ===== WAYGROUND ADMIN REPLICA - APP.JS =====

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
  const target = document.getElementById('page-' + page);
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
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('active');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
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
    const input = document.getElementById('main-search-input');
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
      document.getElementById('main-search-input') && (document.getElementById('main-search-input').value = val);
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
  document.getElementById('hamburger-btn').addEventListener('click', openSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

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
  const mainSearch = document.getElementById('main-search-input');
  if (mainSearch) mainSearch.addEventListener('keydown', handleSearch);
  const searchBtn = document.getElementById('search-submit-btn');
  if (searchBtn) searchBtn.addEventListener('click', handleSearch);
  const globalSearch = document.getElementById('global-search-input');
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
