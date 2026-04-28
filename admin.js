/* ═══════════════════════════════════════════════
   ALCOCERMED — PANEL DE CONTROL ADMIN PRO
   Muestra progreso de estudiantes sin usar SQL Editor.
   ═══════════════════════════════════════════════ */

const CONFIG = window.ALCOCER_CONFIG || {
  SUPABASE_URL: 'https://asnwhddmurstzmghuyin.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo',
  ADMIN_EMAILS: ['admin@alcocermed.com', 'admin@bencarson.com', 'rubenconcha@example.com', 'pichon4488@gmail.com']
};

const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_KEY;
const ADMIN_EMAILS = (CONFIG.ADMIN_EMAILS || []).map(e => String(e).toLowerCase());

let _supabase = null;
let currentAdmin = null;
let cachedData = {
  devices: [],
  sims: [],
  banco: [],
  videos: [],
  estudiantes: [],
  userMap: {},
  errors: []
};

function getSupabase() {
  if (!_supabase) _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return _supabase;
}

/* ═══════════════════════════════════════════════
   AUTH ADMIN
   ═══════════════════════════════════════════════ */
async function handleAdminLogin(e) {
  e.preventDefault();
  const email = getValue('admin-email').trim().toLowerCase();
  const password = getValue('admin-password');
  const btn = document.getElementById('admin-login-btn');
  const btnText = document.getElementById('admin-login-btn-text');
  const btnLoad = document.getElementById('admin-login-btn-loading');
  const errBox = document.getElementById('admin-login-error');
  const errText = document.getElementById('admin-login-error-text');

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showLoginError('formato de correo inválido');
    return;
  }
  if (!password || password.length < 6) {
    showLoginError('la contraseña debe tener al menos 6 caracteres');
    return;
  }

  errBox.classList.add('hidden');
  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoad.classList.remove('hidden');

  try {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (!ADMIN_EMAILS.includes(email)) {
      await sb.auth.signOut();
      throw new Error('esta cuenta no tiene permisos de administrador');
    }

    currentAdmin = data.user;
    document.getElementById('admin-user-name').textContent = email.split('@')[0];
    showAdminApp();
    showToast('bienvenido al panel de control', 'success');
    await refreshAdminData();
  } catch (err) {
    console.error('[Admin] Login error:', err);
    errText.textContent = err.message || 'credenciales incorrectas o sin permisos de administrador';
    errBox.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoad.classList.add('hidden');
  }
}

function showLoginError(msg) {
  const errBox = document.getElementById('admin-login-error');
  const errText = document.getElementById('admin-login-error-text');
  if (errText) errText.textContent = msg;
  if (errBox) errBox.classList.remove('hidden');
}

async function adminLogout() {
  try {
    await getSupabase().auth.signOut();
  } catch (err) {
    console.warn('[Admin] error cerrando sesión:', err);
  }
  currentAdmin = null;
  cachedData = { devices: [], sims: [], banco: [], videos: [], estudiantes: [], userMap: {}, errors: [] };
  document.getElementById('admin-login-screen').classList.remove('hidden');
  document.getElementById('admin-app').style.display = 'none';
  const form = document.getElementById('admin-login-form');
  if (form) form.reset();
  showToast('sesión cerrada', 'info');
}

function showAdminApp() {
  document.getElementById('admin-login-screen').classList.add('hidden');
  const app = document.getElementById('admin-app');
  app.style.display = 'flex';
  app.classList.remove('hidden');
  ensureRefreshButton();
}

(async function initAdmin() {
  try {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    const email = session && session.user && session.user.email ? session.user.email.toLowerCase() : '';
    if (session && session.user && ADMIN_EMAILS.includes(email)) {
      currentAdmin = session.user;
      document.getElementById('admin-user-name').textContent = email.split('@')[0];
      showAdminApp();
      await refreshAdminData();
    }
  } catch (err) {
    console.error('[Admin] init error:', err);
  }
})();

/* ═══════════════════════════════════════════════
   NAVEGACIÓN
   ═══════════════════════════════════════════════ */
const SECTION_TITLES = {
  dashboard: ['dashboard', 'resumen general de la plataforma'],
  estudiantes: ['estudiantes', 'seguimiento individual de cada alumno'],
  simulacros: ['simulacros', 'resultados y rendimiento de exámenes'],
  evaluaciones: ['evaluaciones', 'historial del banco de preguntas'],
  videoclases: ['videoclases', 'tracking de visualización de contenido'],
  contenido: ['gestión de contenido', 'administra flashcards, banco, videos y simulacros']
};

function showSection(id) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');

  document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
  const section = document.getElementById('section-' + id);
  if (section) section.classList.add('active');

  const [title, subtitle] = SECTION_TITLES[id] || [id, ''];
  setText('page-title', title);
  setText('page-subtitle', subtitle);

  renderCurrentSection(id);
}

function showContentTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
  const tab = document.getElementById(tabId);
  if (tab) tab.style.display = 'block';
  loadContenido(getSupabase());
}

async function refreshAdminData() {
  const active = document.querySelector('.admin-section.active');
  setText('last-updated', 'actualizando...');
  await loadAllData();
  renderCurrentSection(active ? active.id.replace('section-', '') : 'dashboard');
}

function renderCurrentSection(section) {
  if (section === 'dashboard') renderDashboard();
  else if (section === 'estudiantes') renderEstudiantes(cachedData.estudiantes);
  else if (section === 'simulacros') renderSimulacros(cachedData.sims);
  else if (section === 'evaluaciones') renderEvaluaciones(cachedData.banco);
  else if (section === 'videoclases') renderVideoclases(cachedData.videos);
  else if (section === 'contenido') loadContenido(getSupabase());
}

/* ═══════════════════════════════════════════════
   CARGA CENTRALIZADA DE PROGRESO
   ═══════════════════════════════════════════════ */
async function loadAllData() {
  const sb = getSupabase();
  cachedData.errors = [];

  const [devices, sims, banco, videos, directory] = await Promise.all([
    safeSelect(sb, 'user_devices', '*'),
    safeSelect(sb, 'resultados_simulacros', '*'),
    safeSelect(sb, 'resultados_banco', '*'),
    safeSelect(sb, 'progreso_videoclases', '*'),
    getUserDirectory(sb)
  ]);

  cachedData.devices = sortByDate(devices, ['updated_at', 'last_login', 'created_at']);
  cachedData.sims = sortByDate(sims, ['created_at']);
  cachedData.banco = sortByDate(banco, ['created_at']);
  cachedData.videos = sortByDate(videos, ['fecha_visto', 'created_at']);
  cachedData.userMap = buildUserMap(directory, cachedData);
  cachedData.estudiantes = buildStudentRows(cachedData);

  setText('last-updated', 'actualizado: ' + new Date().toLocaleTimeString());
  return cachedData;
}

async function safeSelect(sb, table, select, options = {}) {
  try {
    let query = sb.from(table).select(select);
    if (options.limit) query = query.limit(options.limit);
    const { data, error } = await query;
    if (error) {
      cachedData.errors.push({ table, message: error.message });
      console.warn(`[Admin] ${table}:`, error.message);
      return [];
    }
    return Array.isArray(data) ? data : [];
  } catch (err) {
    cachedData.errors.push({ table, message: err.message });
    console.error(`[Admin] ${table}:`, err);
    return [];
  }
}

async function getUserDirectory(sb) {
  const rows = [];

  // 1) RPC opcional si existe en Supabase: devuelve user_id, email, nombre.
  try {
    const { data, error } = await sb.rpc('admin_list_users');
    if (!error && Array.isArray(data)) rows.push(...data);
  } catch (err) {
    console.warn('[Admin] admin_list_users RPC no disponible:', err.message);
  }

  // 2) Tablas de perfiles opcionales, si existen.
  for (const table of ['user_profiles', 'profiles', 'usuarios']) {
    try {
      const { data, error } = await sb.from(table).select('*');
      if (!error && Array.isArray(data)) rows.push(...data);
    } catch (err) {
      console.warn(`[Admin] ${table} no disponible:`, err.message);
    }
  }

  return rows;
}

function buildUserMap(directory, data) {
  const map = {};

  function add(id, info = {}) {
    if (!id) return;
    const uid = String(id);
    if (!map[uid]) map[uid] = { user_id: uid, email: '', name: '', last_seen: null };
    if (info.email && !map[uid].email) map[uid].email = String(info.email).toLowerCase();
    if (info.name && !map[uid].name) map[uid].name = String(info.name);
    if (info.last_seen && (!map[uid].last_seen || new Date(info.last_seen) > new Date(map[uid].last_seen))) map[uid].last_seen = info.last_seen;
  }

  directory.forEach(r => {
    const id = r.user_id || r.id || r.uid || r.auth_user_id;
    add(id, {
      email: r.email || r.user_email || r.correo,
      name: r.full_name || r.nombre || r.name || r.display_name,
      last_seen: r.last_seen || r.updated_at || r.created_at
    });
  });

  [...data.devices, ...data.sims, ...data.banco, ...data.videos].forEach(r => {
    const id = r.user_id || r.uid || r.auth_user_id;
    add(id, {
      email: r.email || r.user_email || r.student_email || r.correo,
      name: r.user_name || r.nombre || r.name || r.display_name,
      last_seen: r.updated_at || r.last_login || r.created_at || r.fecha_visto
    });
  });

  return map;
}

function buildStudentRows(data) {
  const ids = new Set();
  [...data.devices, ...data.sims, ...data.banco, ...data.videos].forEach(r => {
    if (r.user_id) ids.add(String(r.user_id));
  });

  return [...ids].map(userId => {
    const sims = data.sims.filter(r => String(r.user_id) === userId);
    const bancos = data.banco.filter(r => String(r.user_id) === userId);
    const vids = data.videos.filter(r => String(r.user_id) === userId);
    const devs = data.devices.filter(r => String(r.user_id) === userId);
    const info = data.userMap[userId] || { user_id: userId };
    const simAvg = avg(sims.map(r => number(r.porcentaje ?? r.score)));
    const bancoAvg = avg(bancos.map(r => number(r.porcentaje ?? pct(r.correctas, r.total))));
    const best = sims.length ? Math.max(...sims.map(r => number(r.porcentaje ?? r.score))) : 0;
    const lastSeen = latestDate([
      ...sims.map(r => r.created_at),
      ...bancos.map(r => r.created_at),
      ...vids.map(r => r.fecha_visto || r.created_at),
      ...devs.map(r => r.updated_at || r.last_login || r.created_at),
      info.last_seen
    ]);
    return {
      user_id: userId,
      email: info.email || '',
      name: info.name || '',
      label: studentLabel(userId),
      display: info.name || info.email || studentLabel(userId),
      sub: info.email || 'correo no disponible · id ' + shortId(userId),
      devices: devs.length,
      last_seen: lastSeen,
      sims: sims.length,
      bancos: bancos.length,
      videos: vids.length,
      simAvg,
      bancoAvg,
      best,
      activity: sims.length + bancos.length + vids.length
    };
  }).sort((a, b) => new Date(b.last_seen || 0) - new Date(a.last_seen || 0));
}

/* ═══════════════════════════════════════════════
   DASHBOARD
   ═══════════════════════════════════════════════ */
function renderDashboard() {
  const users = cachedData.estudiantes;
  const sims = cachedData.sims;
  const bancos = cachedData.banco;
  const vids = cachedData.videos;
  const allScores = [...sims.map(r => number(r.porcentaje ?? r.score)), ...bancos.map(r => number(r.porcentaje ?? pct(r.correctas, r.total)))].filter(n => n > 0);

  setText('dash-total-users', users.length);
  setText('dash-total-sims', sims.length);
  setText('dash-promedio', (allScores.length ? Math.round(avg(allScores)) : 0) + '%');
  setText('dash-videos', vids.length);
  setText('dash-users-delta', (knownEmailsCount() ? `${knownEmailsCount()} con correo visible` : 'estudiantes con actividad'));
  setText('dash-sims-delta', `${countThisMonth(sims, 'created_at')} este mes`);
  setText('dash-promedio-delta', `${bancos.length} bancos + ${sims.length} simulacros`);
  setText('dash-videos-delta', `${unique(vids.map(v => v.user_id)).length} estudiantes activos`);

  renderMateriaPerformance();
  renderDifficultTopics();
  renderRecentActivity();
  renderDataStatus();
}

function renderMateriaPerformance() {
  const el = document.getElementById('dash-materias-chart');
  if (!el) return;
  const grouped = {};
  [...cachedData.sims, ...cachedData.banco].forEach(r => {
    const materia = normalText(r.materia || r.MATERIA || 'general');
    const score = number(r.porcentaje ?? r.score ?? pct(r.correctas, r.total));
    if (!grouped[materia]) grouped[materia] = [];
    grouped[materia].push(score);
  });
  const rows = Object.entries(grouped)
    .map(([materia, values]) => ({ materia, avg: Math.round(avg(values)), count: values.length }))
    .sort((a, b) => b.count - a.count || b.avg - a.avg)
    .slice(0, 8);
  if (!rows.length) {
    el.innerHTML = emptyState('fa-chart-bar', 'sin datos aún', 'cuando los estudiantes completen simulacros o bancos, se verá el rendimiento por materia.');
    return;
  }
  el.innerHTML = rows.map(r => progressItem(r.materia, `${r.avg}% · ${r.count} intentos`, r.avg, scoreColorClass(r.avg))).join('');
}

function renderDifficultTopics() {
  const el = document.getElementById('dash-dificiles-chart');
  if (!el) return;
  const grouped = {};
  cachedData.banco.forEach(r => {
    const tema = normalText(r.tema || 'sin tema');
    if (!grouped[tema]) grouped[tema] = { total: 0, correctas: 0 };
    grouped[tema].total += number(r.total || 0);
    grouped[tema].correctas += number(r.correctas || 0);
  });
  const rows = Object.entries(grouped)
    .map(([tema, v]) => ({ tema, error: Math.max(0, Math.round(100 - pct(v.correctas, v.total))), total: v.total }))
    .filter(r => r.total > 0)
    .sort((a, b) => b.error - a.error)
    .slice(0, 8);
  if (!rows.length) {
    el.innerHTML = emptyState('fa-fire', 'sin datos de errores', 'cuando usen el banco de preguntas, aquí aparecerán los temas más difíciles.');
    return;
  }
  el.innerHTML = rows.map(r => progressItem(r.tema, `${r.error}% error · ${r.total} preguntas`, r.error, 'danger')).join('');
}

function renderRecentActivity() {
  const el = document.getElementById('dash-actividad-list');
  if (!el) return;
  const recent = [
    ...cachedData.sims.map(r => ({ tipo: 'simulacro', fecha: r.created_at, user_id: r.user_id, detail: `${r.simulacro_titulo || 'simulacro'} · ${number(r.porcentaje ?? r.score)}%` })),
    ...cachedData.banco.map(r => ({ tipo: 'banco', fecha: r.created_at, user_id: r.user_id, detail: `${r.materia || 'banco'} · ${r.tema || 'sin tema'} · ${number(r.porcentaje ?? pct(r.correctas, r.total))}%` })),
    ...cachedData.videos.map(r => ({ tipo: 'video', fecha: r.fecha_visto || r.created_at, user_id: r.user_id, detail: `${r.video_titulo || 'videoclase'} · ${number(r.progreso_pct)}%` }))
  ].filter(r => r.fecha).sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 12);

  if (!recent.length) {
    el.innerHTML = emptyState('fa-history', 'sin actividad reciente', 'los estudiantes aún no registraron simulacros, bancos ni videos vistos.');
    return;
  }
  el.innerHTML = `<table><tbody>${recent.map(r => {
    const st = getStudent(r.user_id);
    return `<tr>
      <td><span class="tag ${r.tipo === 'simulacro' ? 'tag-info' : r.tipo === 'banco' ? 'tag-warning' : 'tag-success'}">${escapeHtml(r.tipo)}</span></td>
      <td><strong>${escapeHtml(st.display)}</strong><br><span class="user-cell-email">${escapeHtml(st.sub)}</span></td>
      <td>${escapeHtml(r.detail)}</td>
      <td style="white-space:nowrap;color:var(--text-medium);">${formatDateShort(r.fecha)}</td>
    </tr>`;
  }).join('')}</tbody></table>`;
}

function renderDataStatus() {
  const section = document.getElementById('section-dashboard');
  if (!section) return;
  let box = document.getElementById('admin-data-status');
  if (!box) {
    box = document.createElement('div');
    box.id = 'admin-data-status';
    box.className = 'chart-card';
    section.appendChild(box);
  }
  const emailNote = knownEmailsCount()
    ? `<span class="tag tag-success"><i class="fas fa-envelope"></i> ${knownEmailsCount()} correos visibles</span>`
    : `<span class="tag tag-warning"><i class="fas fa-envelope-open-text"></i> correos protegidos por Supabase</span>`;
  const errors = cachedData.errors.length
    ? `<p style="margin-top:8px;color:var(--warning);font-size:0.85rem;"><i class="fas fa-triangle-exclamation"></i> algunas tablas no se pudieron leer: ${cachedData.errors.map(e => escapeHtml(e.table)).join(', ')}. Si el panel aparece vacío, revisa políticas RLS para admin.</p>`
    : '';
  box.innerHTML = `<div class="chart-title"><i class="fas fa-database" style="color:var(--info);"></i> estado de datos del panel</div>
    <p style="margin:8px 0;color:var(--text-medium);font-size:0.9rem;">El administrador está leyendo directamente las tablas de progreso: simulacros, banco de preguntas, videoclases y dispositivos.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;">${emailNote}<span class="tag tag-info">${cachedData.sims.length} simulacros</span><span class="tag tag-info">${cachedData.banco.length} bancos</span><span class="tag tag-info">${cachedData.videos.length} videos</span></div>${errors}`;
}

/* ═══════════════════════════════════════════════
   ESTUDIANTES
   ═══════════════════════════════════════════════ */
function renderEstudiantes(list) {
  const tbody = document.getElementById('tabla-estudiantes');
  if (!tbody) return;
  const rows = Array.isArray(list) ? list : [];
  if (!rows.length) {
    tbody.innerHTML = `<tr><td colspan="8">${emptyState('fa-users', 'sin estudiantes con progreso', 'cuando un alumno entre o termine actividades, aparecerá aquí.')}</td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map(u => `
    <tr>
      <td>${studentCell(u)}</td>
      <td>${formatDateShort(u.last_seen)}</td>
      <td><span class="tag tag-info">${u.sims}</span></td>
      <td>${renderScore(u.simAvg || u.bancoAvg || 0)}</td>
      <td><span class="tag tag-success">${u.videos}</span></td>
      <td><span class="tag tag-warning">${u.bancos}</span></td>
      <td>${u.activity > 0 ? '<span class="tag tag-success">activo</span>' : '<span class="tag tag-muted">sin actividad</span>'}</td>
      <td><button class="btn btn-sm btn-secondary" onclick="window.verDetalleEstudiante('${escapeAttr(u.user_id)}')"><i class="fas fa-eye"></i> ver progreso</button></td>
    </tr>`).join('');
}

function filterEstudiantes() {
  const q = getValue('search-estudiantes').toLowerCase();
  const rows = cachedData.estudiantes.filter(u => [u.display, u.sub, u.user_id].join(' ').toLowerCase().includes(q));
  renderEstudiantes(rows);
}

/* ═══════════════════════════════════════════════
   SIMULACROS
   ═══════════════════════════════════════════════ */
function renderSimulacros(rows) {
  const tbody = document.getElementById('tabla-simulacros');
  if (!tbody) return;
  const sims = Array.isArray(rows) ? rows : [];
  setText('sim-total', sims.length);
  setText('sim-promedio', (sims.length ? Math.round(avg(sims.map(r => number(r.porcentaje ?? r.score)))) : 0) + '%');
  setText('sim-tiempo', formatTime(sims.reduce((a, r) => a + number(r.tiempo_segundos), 0)));

  if (!sims.length) {
    tbody.innerHTML = `<tr><td colspan="9">${emptyState('fa-clipboard-list', 'sin simulacros', 'cuando los estudiantes terminen simulacros, se verán aquí con calificación y fecha.')}</td></tr>`;
    return;
  }
  tbody.innerHTML = sims.map(r => {
    const st = getStudent(r.user_id);
    return `<tr>
      <td>${studentCell(st)}</td>
      <td>${escapeHtml(r.simulacro_titulo || r.titulo || '—')}</td>
      <td><span class="tag tag-info">${escapeHtml(r.materia || 'general')}</span></td>
      <td>${renderScore(number(r.porcentaje ?? r.score))}</td>
      <td>${number(r.correctas)}</td>
      <td>${number(r.incorrectas)}</td>
      <td>${number(r.sin_respuesta)}</td>
      <td>${formatTime(number(r.tiempo_segundos))}</td>
      <td>${formatDateShort(r.created_at)}</td>
    </tr>`;
  }).join('');
}

function filterSimulacros() {
  const q = getValue('search-simulacros').toLowerCase();
  const rows = cachedData.sims.filter(r => {
    const st = getStudent(r.user_id);
    return [st.display, st.sub, r.simulacro_titulo, r.materia, r.user_id].join(' ').toLowerCase().includes(q);
  });
  renderSimulacros(rows);
}

/* ═══════════════════════════════════════════════
   BANCO DE PREGUNTAS / EVALUACIONES
   ═══════════════════════════════════════════════ */
function renderEvaluaciones(rows) {
  const tbody = document.getElementById('tabla-evaluaciones');
  if (!tbody) return;
  const banco = Array.isArray(rows) ? rows : [];
  renderEvaluacionCharts(banco);

  if (!banco.length) {
    tbody.innerHTML = `<tr><td colspan="8">${emptyState('fa-database', 'sin historial de banco', 'cuando los estudiantes practiquen banco de preguntas, verás materia, tema y porcentaje.')}</td></tr>`;
    return;
  }
  tbody.innerHTML = banco.map(r => {
    const st = getStudent(r.user_id);
    const percent = number(r.porcentaje ?? pct(r.correctas, r.total));
    return `<tr>
      <td>${studentCell(st)}</td>
      <td><span class="tag tag-info">${escapeHtml(r.materia || '—')}</span></td>
      <td>${escapeHtml(r.tema || '—')}</td>
      <td>${number(r.total)}</td>
      <td>${number(r.correctas)}</td>
      <td>${number(r.incorrectas)}</td>
      <td>${renderScore(percent)}</td>
      <td>${formatDateShort(r.created_at)}</td>
    </tr>`;
  }).join('');
}

function renderEvaluacionCharts(banco) {
  const difChart = document.getElementById('eval-dificultad-chart');
  const temaChart = document.getElementById('eval-temas-chart');
  if (!difChart || !temaChart) return;

  if (!banco.length) {
    difChart.innerHTML = emptyState('fa-layer-group', 'sin evaluaciones', 'todavía no hay intentos registrados.');
    temaChart.innerHTML = emptyState('fa-book-medical', 'sin evaluaciones', 'todavía no hay temas practicados.');
    return;
  }

  const byDif = {};
  banco.forEach(r => {
    const dif = normalText(r.dificultad || 'sin dificultad');
    if (!byDif[dif]) byDif[dif] = [];
    byDif[dif].push(number(r.porcentaje ?? pct(r.correctas, r.total)));
  });
  difChart.innerHTML = Object.entries(byDif).map(([d, vals]) => {
    const p = Math.round(avg(vals));
    return progressItem(d, `${p}% · ${vals.length} intentos`, p, scoreColorClass(p));
  }).join('');

  const byTema = {};
  banco.forEach(r => {
    const tema = normalText(r.tema || 'sin tema');
    if (!byTema[tema]) byTema[tema] = [];
    byTema[tema].push(number(r.porcentaje ?? pct(r.correctas, r.total)));
  });
  temaChart.innerHTML = Object.entries(byTema)
    .map(([tema, vals]) => ({ tema, p: Math.round(avg(vals)), n: vals.length }))
    .sort((a, b) => b.n - a.n || a.p - b.p)
    .slice(0, 8)
    .map(r => progressItem(r.tema, `${r.p}% · ${r.n} intentos`, r.p, scoreColorClass(r.p)))
    .join('');
}

function filterEvaluaciones() {
  const q = getValue('search-evaluaciones').toLowerCase();
  const rows = cachedData.banco.filter(r => {
    const st = getStudent(r.user_id);
    return [st.display, st.sub, r.materia, r.tema, r.dificultad, r.user_id].join(' ').toLowerCase().includes(q);
  });
  renderEvaluaciones(rows);
}

/* ═══════════════════════════════════════════════
   VIDEOCLASES
   ═══════════════════════════════════════════════ */
function renderVideoclases(rows) {
  const tbody = document.getElementById('tabla-videoclases');
  if (!tbody) return;
  const vids = Array.isArray(rows) ? rows : [];
  setText('vc-total', unique(vids.map(v => v.video_id)).length);
  setText('vc-views', vids.length);
  setText('vc-active', unique(vids.map(v => v.user_id)).length);

  if (!vids.length) {
    tbody.innerHTML = `<tr><td colspan="6">${emptyState('fa-video', 'sin visualizaciones', 'cuando los estudiantes vean videoclases, aparecerá el progreso aquí.')}</td></tr>`;
    return;
  }
  tbody.innerHTML = vids.map(v => {
    const st = getStudent(v.user_id);
    const progress = number(v.progreso_pct);
    return `<tr>
      <td>${escapeHtml(v.video_titulo || v.titulo || '—')}</td>
      <td><span class="tag tag-info">${escapeHtml(v.materia || '—')}</span></td>
      <td>${studentCell(st)}</td>
      <td><span class="mini-bar"><span class="mini-bar-fill" style="width:${Math.min(progress, 100)}%"></span></span> ${progress}%</td>
      <td>${v.visto ? '<span class="tag tag-success">sí</span>' : '<span class="tag tag-warning">en progreso</span>'}</td>
      <td>${formatDateShort(v.fecha_visto || v.created_at)}</td>
    </tr>`;
  }).join('');
}

function filterVideoclases() {
  const q = getValue('search-videoclases').toLowerCase();
  const rows = cachedData.videos.filter(v => {
    const st = getStudent(v.user_id);
    return [st.display, st.sub, v.video_titulo, v.materia, v.user_id].join(' ').toLowerCase().includes(q);
  });
  renderVideoclases(rows);
}

/* ═══════════════════════════════════════════════
   GESTIÓN DE CONTENIDO
   ═══════════════════════════════════════════════ */
async function loadContenido(sb) {
  await Promise.all([
    loadContentTable(sb, 'flashcards', 'tabla-content-flashcards', rowFlashcard, 5),
    loadContentTable(sb, 'banco_preguntas', 'tabla-content-banco', rowPregunta, 6),
    loadContentTable(sb, 'videoclases', 'tabla-content-videos', rowVideo, 5),
    loadContentTable(sb, 'simulacros', 'tabla-content-sim', rowSimulacro, 6)
  ]);
}

async function loadContentTable(sb, table, tbodyId, rowBuilder, colspan) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  try {
    const { data, error } = await sb.from(table).select('*').limit(50);
    if (error) throw error;
    if (!data || !data.length) {
      tbody.innerHTML = `<tr><td colspan="${colspan}">${emptyState('fa-folder-open', 'sin datos', `no hay registros en ${table}.`)}</td></tr>`;
      return;
    }
    tbody.innerHTML = data.map(rowBuilder).join('');
  } catch (err) {
    console.warn(`[Admin] ${table}:`, err.message);
    tbody.innerHTML = `<tr><td colspan="${colspan}">${emptyState('fa-circle-exclamation', 'no se pudo leer', `${table}: ${escapeHtml(err.message)}`)}</td></tr>`;
  }
}

function rowFlashcard(f) {
  return `<tr><td><span class="tag tag-info">${escapeHtml(f.materia || f.MATERIA || '—')}</span></td><td>${escapeHtml(f.tema || f.TEMA || '—')}</td><td>${clip(f.pregunta || f.PREGUNTA)}</td><td>${clip(f.respuesta || f.RESPUESTA)}</td><td><button class="btn btn-sm btn-secondary" onclick="showToast('edición próximamente','info')"><i class="fas fa-edit"></i></button></td></tr>`;
}
function rowPregunta(b) {
  return `<tr><td><span class="tag tag-info">${escapeHtml(b.materia || b.MATERIA || '—')}</span></td><td>${escapeHtml(b.tema || b.TEMA || '—')}</td><td>${clip(b.pregunta || b.PREGUNTA)}</td><td><span class="tag tag-warning">${escapeHtml(b.dificultad || b.DIFICULTAD || '—')}</span></td><td>${escapeHtml(b.respuesta || b.RESPUESTA || '—')}</td><td><button class="btn btn-sm btn-secondary" onclick="showToast('edición próximamente','info')"><i class="fas fa-edit"></i></button></td></tr>`;
}
function rowVideo(v) {
  return `<tr><td><span class="tag tag-info">${escapeHtml(v.materia || v.MATERIA || '—')}</span></td><td>${escapeHtml(v.titulo || v.TITULO || '—')}</td><td>${clip(v.url_video || v.URL_VIDEO || v.url || v.URL || '')}</td><td>${clip(v.descripcion || v.DESCRIPCION || '')}</td><td><button class="btn btn-sm btn-secondary" onclick="showToast('edición próximamente','info')"><i class="fas fa-edit"></i></button></td></tr>`;
}
function rowSimulacro(s) {
  return `<tr><td>${escapeHtml(s.titulo || s.TITULO || '—')}</td><td><span class="tag tag-info">${escapeHtml(s.materia || s.MATERIA || '—')}</span></td><td>${escapeHtml(s.numero_preguntas || s.NUMERO_PREGUNTAS || '—')}</td><td>${escapeHtml(s.duracion || s.DURACION || '—')} min</td><td>${formatDateShort(s.created_at || s.CREADO)}</td><td><button class="btn btn-sm btn-secondary" onclick="showToast('edición próximamente','info')"><i class="fas fa-edit"></i></button></td></tr>`;
}

/* ═══════════════════════════════════════════════
   DETALLE INDIVIDUAL
   ═══════════════════════════════════════════════ */
async function verDetalleEstudiante(userId) {
  const modal = document.getElementById('modal-estudiante');
  const body = document.getElementById('modal-est-body');
  const st = getStudent(userId);
  setText('modal-est-name', 'progreso de ' + st.display);
  if (modal) modal.classList.add('open');
  if (body) body.innerHTML = '<div class="loading-overlay"><i class="fas fa-spinner fa-spin"></i> cargando detalle...</div>';

  try {
    const sims = cachedData.sims.filter(r => String(r.user_id) === String(userId));
    const bancos = cachedData.banco.filter(r => String(r.user_id) === String(userId));
    const vids = cachedData.videos.filter(r => String(r.user_id) === String(userId));
    const simAvg = sims.length ? Math.round(avg(sims.map(r => number(r.porcentaje ?? r.score)))) : 0;
    const bancoAvg = bancos.length ? Math.round(avg(bancos.map(r => number(r.porcentaje ?? pct(r.correctas, r.total))))) : 0;

    body.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;">
        <div class="user-cell-avatar" style="width:46px;height:46px;">${avatarText(st)}</div>
        <div><div style="font-weight:800;font-size:1.05rem;">${escapeHtml(st.display)}</div><div class="user-cell-email">${escapeHtml(st.sub)}</div></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px;">
        ${miniStat('simulacros', sims.length)}
        ${miniStat('banco', bancos.length)}
        ${miniStat('videos', vids.length)}
        ${miniStat('promedio', Math.round(avg([simAvg, bancoAvg].filter(Boolean)) || 0) + '%')}
      </div>
      <div style="margin-bottom:18px;">
        <div class="chart-title" style="margin-bottom:10px;"><i class="fas fa-chart-line" style="color:var(--orange);"></i> rendimiento individual</div>
        <div class="progress-list">
          ${progressItem('simulacros', `${simAvg}% · ${sims.length} intentos`, simAvg, scoreColorClass(simAvg))}
          ${progressItem('banco de preguntas', `${bancoAvg}% · ${bancos.length} intentos`, bancoAvg, scoreColorClass(bancoAvg))}
          ${progressItem('videoclases', `${vids.filter(v => v.visto).length} vistas de ${vids.length}`, vids.length ? Math.round(vids.filter(v => v.visto).length / vids.length * 100) : 0, 'purple')}
        </div>
      </div>
      ${detailTable('últimos simulacros', ['examen','materia','nota','fecha'], sims.slice(0,8).map(r => [r.simulacro_titulo || '—', r.materia || 'general', renderScore(number(r.porcentaje ?? r.score)), formatDateShort(r.created_at)]))}
      ${detailTable('banco de preguntas', ['materia','tema','correctas','nota','fecha'], bancos.slice(0,8).map(r => [r.materia || '—', r.tema || '—', `${number(r.correctas)}/${number(r.total)}`, renderScore(number(r.porcentaje ?? pct(r.correctas, r.total))), formatDateShort(r.created_at)]))}
      ${detailTable('videoclases', ['video','materia','progreso','estado','fecha'], vids.slice(0,8).map(v => [v.video_titulo || '—', v.materia || '—', `${number(v.progreso_pct)}%`, v.visto ? '<span class="tag tag-success">vista</span>' : '<span class="tag tag-warning">en progreso</span>', formatDateShort(v.fecha_visto || v.created_at)]))}
    `;
  } catch (err) {
    console.error('[Admin] detalle estudiante:', err);
    body.innerHTML = emptyState('fa-exclamation-circle', 'error cargando detalle', err.message || 'no se pudo obtener el detalle');
  }
}

function closeModal(e) {
  if (!e || !e.target || e.target.id === 'modal-estudiante' || e.currentTarget?.classList?.contains('modal-close')) {
    const modal = document.getElementById('modal-estudiante');
    if (modal) modal.classList.remove('open');
  }
}

/* ═══════════════════════════════════════════════
   UTILIDADES
   ═══════════════════════════════════════════════ */
function ensureRefreshButton() {
  const bar = document.querySelector('.top-bar-right');
  if (!bar || document.getElementById('admin-refresh-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'admin-refresh-btn';
  btn.className = 'btn btn-secondary btn-sm';
  btn.innerHTML = '<i class="fas fa-rotate"></i> actualizar';
  btn.onclick = refreshAdminData;
  bar.insertBefore(btn, bar.firstChild);
}

function getStudent(userId) {
  const id = String(userId || '');
  return cachedData.estudiantes.find(u => String(u.user_id) === id) || {
    user_id: id,
    display: studentLabel(id),
    sub: 'correo no disponible · id ' + shortId(id),
    email: '',
    name: '',
    sims: 0,
    bancos: 0,
    videos: 0
  };
}
function studentLabel(userId) { return 'estudiante …' + shortId(userId); }
function shortId(userId) { return String(userId || '??????').slice(-6); }
function avatarText(u) { const source = (u.name || u.email || u.display || u.user_id || 'AL').toString(); return source.slice(0,2).toUpperCase(); }
function studentCell(u) {
  const st = typeof u === 'string' ? getStudent(u) : u;
  return `<div class="user-cell"><div class="user-cell-avatar">${escapeHtml(avatarText(st))}</div><div class="user-cell-info"><span class="user-cell-name">${escapeHtml(st.display)}</span><span class="user-cell-email">${escapeHtml(st.sub)}</span></div></div>`;
}
function miniStat(label, value) { return `<div class="stat-card" style="padding:14px;"><div class="stat-label">${escapeHtml(label)}</div><div class="stat-value" style="font-size:1.25rem;">${escapeHtml(String(value))}</div></div>`; }
function detailTable(title, headers, rows) {
  if (!rows.length) return '';
  return `<div style="margin-bottom:18px;"><div class="chart-title" style="margin-bottom:10px;"><i class="fas fa-table" style="color:var(--info);"></i> ${escapeHtml(title)}</div><div class="table-wrap"><table><thead><tr>${headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}
function progressItem(label, value, pctValue, cls) {
  const safePct = Math.max(0, Math.min(100, number(pctValue)));
  const className = cls === 'danger' ? '' : cls;
  const style = cls === 'danger' ? 'background:linear-gradient(90deg,#ef4444,#f87171)' : '';
  return `<div class="progress-item"><div class="progress-meta"><span class="label">${escapeHtml(label)}</span><span class="value">${escapeHtml(value)}</span></div><div class="progress-track"><div class="progress-fill ${className}" style="width:${safePct}%;${style}"></div></div></div>`;
}
function renderScore(score) {
  const n = number(score);
  const cls = n >= 80 ? 'score-high' : (n >= 60 ? 'score-mid' : 'score-low');
  return `<span class="score-badge ${cls}">${n}%</span>`;
}
function scoreColorClass(score) { const n = number(score); return n >= 80 ? 'green' : (n >= 60 ? 'orange' : 'danger'); }
function emptyState(icon, title, text) { return `<div class="empty-state"><i class="fas ${icon}"></i><h4>${escapeHtml(title)}</h4><p>${escapeHtml(text)}</p></div>`; }
function getValue(id) { const el = document.getElementById(id); return el ? String(el.value || '') : ''; }
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }
function number(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
function pct(correct, total) { const t = number(total); return t ? Math.round(number(correct) / t * 100) : 0; }
function avg(values) { const nums = values.map(number).filter(n => Number.isFinite(n)); return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0; }
function unique(arr) { return [...new Set((arr || []).filter(Boolean).map(String))]; }
function latestDate(dates) { return (dates || []).filter(Boolean).sort((a, b) => new Date(b) - new Date(a))[0] || null; }
function sortByDate(rows, fields) { return [...(rows || [])].sort((a, b) => new Date(firstDate(b, fields) || 0) - new Date(firstDate(a, fields) || 0)); }
function firstDate(row, fields) { return fields.map(f => row && row[f]).find(Boolean); }
function countThisMonth(rows, field) { const now = new Date(); return (rows || []).filter(r => { const d = new Date(r[field]); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length; }
function normalText(v) { return String(v || '—').trim() || '—'; }
function clip(v, len = 90) { const s = escapeHtml(String(v || '—')); return s.length > len ? s.slice(0, len) + '…' : s; }
function knownEmailsCount() { return cachedData.estudiantes.filter(u => u.email).length; }
function escapeHtml(v) { return String(v ?? '').replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c])); }
function escapeAttr(v) { return String(v ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' '); }
function formatDateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}
function formatTime(seconds) {
  const s = number(seconds);
  if (!s) return '0 min';
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m} min`;
}
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${escapeHtml(msg)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, type === 'error' ? 5000 : 3000);
}

// Exports para handlers inline del HTML
window.handleAdminLogin = handleAdminLogin;
window.adminLogout = adminLogout;
window.showSection = showSection;
window.showContentTab = showContentTab;
window.refreshAdminData = refreshAdminData;
window.filterEstudiantes = filterEstudiantes;
window.filterSimulacros = filterSimulacros;
window.filterEvaluaciones = filterEvaluaciones;
window.filterVideoclases = filterVideoclases;
window.verDetalleEstudiante = verDetalleEstudiante;
window.closeModal = closeModal;
window.showToast = showToast;
