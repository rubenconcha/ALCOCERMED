/* ═══════════════════════════════════════════════
   ALCOCERMED — PANEL DE CONTROL (ADMIN JS)
   ═══════════════════════════════════════════════ */

const CONFIG = window.ALCOCER_CONFIG || {
  SUPABASE_URL: 'https://asnwhddmurstzmghuyin.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo',
  ADMIN_EMAILS: ['admin@alcocermed.com', 'rubenconcha@example.com', 'pichon4488@gmail.com']
};
const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_KEY;
let _supabase = null;
function getSupabase() {
  if (!_supabase) _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return _supabase;
}

// ── CONFIGURACION DE ADMINS ──
const ADMIN_EMAILS = CONFIG.ADMIN_EMAILS || ['admin@alcocermed.com', 'rubenconcha@example.com', 'pichon4488@gmail.com'];

let currentAdmin = null;
let cachedData = {};

// ══════════════════════════════════════════════
// ██  AUTH  ██
// ══════════════════════════════════════════════

async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value.trim().toLowerCase();
  const password = document.getElementById('admin-password').value;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const errBox = document.getElementById('admin-login-error');
    const errText = document.getElementById('admin-login-error-text');
    errText.textContent = 'formato de correo invalido';
    errBox.classList.remove('hidden');
    return;
  }
  if (!password || password.length < 6) {
    const errBox = document.getElementById('admin-login-error');
    const errText = document.getElementById('admin-login-error-text');
    errText.textContent = 'la contrasena debe tener al menos 6 caracteres';
    errBox.classList.remove('hidden');
    return;
  }
  const btn = document.getElementById('admin-login-btn');
  const btnText = document.getElementById('admin-login-btn-text');
  const btnLoad = document.getElementById('admin-login-btn-loading');
  const errBox = document.getElementById('admin-login-error');
  const errText = document.getElementById('admin-login-error-text');

  errBox.classList.add('hidden');
  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoad.classList.remove('hidden');

  try {
    const sb = getSupabase();
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Verificar que sea admin
    if (!ADMIN_EMAILS.includes(email)) {
      await sb.auth.signOut();
      throw new Error('esta cuenta no tiene permisos de administrador');
    }

    currentAdmin = data.user;
    document.getElementById('admin-user-name').textContent = currentAdmin.email.split('@')[0];
    showAdminApp();
    showToast('bienvenido al panel de control', 'success');
    await loadAllData();
  } catch (err) {
    console.error('Admin login error:', err);
    errText.textContent = err.message || 'credenciales incorrectas o sin permisos de administrador';
    errBox.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoad.classList.add('hidden');
  }
}

async function adminLogout() {
  const sb = getSupabase();
  await sb.auth.signOut();
  currentAdmin = null;
  cachedData = {};
  document.getElementById('admin-login-screen').classList.remove('hidden');
  document.getElementById('admin-app').style.display = 'none';
  document.getElementById('admin-login-form').reset();
  showToast('sesión cerrada', 'info');
}

function showAdminApp() {
  document.getElementById('admin-login-screen').classList.add('hidden');
  const app = document.getElementById('admin-app');
  app.style.display = 'flex';
  app.classList.remove('hidden');
}

// Verificar sesión al cargar
(async function initAdmin() {
  try {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();
    if (session && session.user && ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
      currentAdmin = session.user;
      document.getElementById('admin-user-name').textContent = currentAdmin.email.split('@')[0];
      showAdminApp();
      await loadAllData();
    }
  } catch (err) {
    console.error('Init admin error:', err);
  }
})();

// ══════════════════════════════════════════════
// ██  NAVEGACIÓN  ██
// ══════════════════════════════════════════════

const SECTION_TITLES = {
  dashboard: ['dashboard', 'resumen general de la plataforma'],
  estudiantes: ['estudiantes', 'seguimiento individual de cada alumno'],
  simulacros: ['simulacros', 'resultados y rendimiento de exámenes'],
  evaluaciones: ['evaluaciones', 'historial del banco de preguntas'],
  videoclases: ['videoclases', 'tracking de visualización de contenido'],
  contenido: ['gestión de contenido', 'administra flashcards, banco, videos y simulacros']
};

function showSection(id) {
  // Nav items
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');

  // Sections
  document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
  document.getElementById('section-' + id).classList.add('active');

  // Titles
  const [title, subtitle] = SECTION_TITLES[id] || [id, ''];
  document.getElementById('page-title').textContent = title;
  document.getElementById('page-subtitle').textContent = subtitle;

  // Cargar datos específicos si no están cacheados
  loadSectionData(id);
}

function showContentTab(btn, tabId) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
  loadSectionData('contenido');
}

// ══════════════════════════════════════════════
// ██  CARGA DE DATOS  ██
// ══════════════════════════════════════════════

async function loadAllData() {
  await loadSectionData('dashboard');
}

async function loadSectionData(section) {
  const sb = getSupabase();

  try {
    if (section === 'dashboard') {
      await loadDashboard(sb);
    } else if (section === 'estudiantes') {
      await loadEstudiantes(sb);
    } else if (section === 'simulacros') {
      await loadSimulacros(sb);
    } else if (section === 'evaluaciones') {
      await loadEvaluaciones(sb);
    } else if (section === 'videoclases') {
      await loadVideoclases(sb);
    } else if (section === 'contenido') {
      await loadContenido(sb);
    }
  } catch (err) {
    console.error('[Admin] Error cargando ' + section + ':', err);
  }

  document.getElementById('last-updated').textContent = 'actualizado: ' + new Date().toLocaleTimeString();
}

// ── DASHBOARD ──
async function loadDashboard(sb) {
  // Total de usuarios desde user_devices (inferidos)
  const { data: devices } = await sb.from('user_devices').select('user_id');
  const uniqueUsers = devices ? [...new Set(devices.map(d => d.user_id))] : [];
  document.getElementById('dash-total-users').textContent = uniqueUsers.length || '0';

  // Resultados simulacros
  const { data: simResults } = await sb.from('resultados_simulacros').select('*');
  const sims = simResults || [];
  document.getElementById('dash-total-sims').textContent = sims.length;

  // Promedio global
  const avg = sims.length
    ? Math.round(sims.reduce((s, r) => s + (r.porcentaje || r.score || 0), 0) / sims.length)
    : 0;
  document.getElementById('dash-promedio').textContent = avg + '%';

  // Videos vistos
  const { data: vidProgress } = await sb.from('progreso_videoclases').select('*');
  const vids = vidProgress || [];
  document.getElementById('dash-videos').textContent = vids.length;

  // Rendimiento por materia
  const { data: banco } = await sb.from('banco_preguntas').select('MATERIA');
  const materias = {};
  if (banco) {
    banco.forEach(b => { materias[b.MATERIA] = (materias[b.MATERIA] || 0) + 1; });
  }
  const materiaChart = document.getElementById('dash-materias-chart');
  if (sims.length === 0 && Object.keys(materias).length === 0) {
    materiaChart.innerHTML = '<div class="empty-state"><i class="fas fa-chart-bar"></i><h4>sin datos aún</h4><p>los estudiantes deben completar simulacros o bancos para generar estadísticas.</p></div>';
  } else {
    // Agrupar simulacros por materia
    const byMat = {};
    sims.forEach(s => {
      const m = s.materia || 'general';
      if (!byMat[m]) byMat[m] = { total: 0, count: 0 };
      byMat[m].total += (s.porcentaje || s.score || 0);
      byMat[m].count++;
    });
    materiaChart.innerHTML = Object.entries(byMat).map(([m, v]) => {
      const pct = Math.round(v.total / v.count);
      return `
        <div class="progress-item">
          <div class="progress-meta"><span class="label">${m}</span><span class="value">${pct}% · ${v.count} intentos</span></div>
          <div class="progress-track"><div class="progress-fill orange" style="width:${pct}%"></div></div>
        </div>`;
    }).join('');
  }

  // Temas más difíciles: si hay historial de banco_resultados
  const { data: bancoRes } = await sb.from('resultados_banco').select('*');
  const dificilChart = document.getElementById('dash-dificiles-chart');
  if (!bancoRes || bancoRes.length === 0) {
    dificilChart.innerHTML = '<div class="empty-state"><i class="fas fa-fire"></i><h4>sin datos de errores</h4><p>se necesita la tabla <code>resultados_banco</code> para calcular temas difíciles.</p></div>';
  } else {
    // Calcular porcentaje de error por tema
    const byTema = {};
    bancoRes.forEach(r => {
      const t = r.tema || 'sin tema';
      if (!byTema[t]) byTema[t] = { correct: 0, total: 0 };
      byTema[t].total += (r.total || 1);
      byTema[t].correct += (r.correctas || 0);
    });
    const sorted = Object.entries(byTema)
      .map(([t, v]) => ({ tema: t, error: Math.round(100 - (v.correct / v.total * 100)) }))
      .sort((a, b) => b.error - a.error)
      .slice(0, 6);
    dificilChart.innerHTML = sorted.map(s => `
      <div class="progress-item">
        <div class="progress-meta"><span class="label">${s.tema}</span><span class="value">${s.error}% error</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${Math.min(s.error,100)}%;background:linear-gradient(90deg,#ef4444,#f87171)"></div></div>
      </div>
    `).join('');
  }

  // Actividad reciente (últimos simulacros y evaluaciones)
  const actList = document.getElementById('dash-actividad-list');
  const recent = [
    ...(sims.slice(-5).map(s => ({ tipo: 'simulacro', user: s.user_id?.slice(0,8)||'—', fecha: s.created_at, detail: `obtuvo ${s.porcentaje||s.score||0}%` }))),
    ...(vids.slice(-5).map(v => ({ tipo: 'video', user: v.user_id?.slice(0,8)||'—', fecha: v.fecha_visto, detail: `vió ${v.video_titulo||'un video'}` })))
  ].sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0)).slice(0, 8);

  if (recent.length === 0) {
    actList.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><h4>sin actividad reciente</h4><p>los estudiantes aún no han interactuado con la plataforma.</p></div>';
  } else {
    actList.innerHTML = '<table style="border-collapse:collapse;"><tbody>' + recent.map(r => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid var(--border-light);">
          <span class="tag ${r.tipo==='simulacro'?'tag-info':'tag-success'}">${r.tipo}</span>
        </td>
        <td style="padding:10px;border-bottom:1px solid var(--border-light);font-weight:600;">estudiante …${r.user}</td>
        <td style="padding:10px;border-bottom:1px solid var(--border-light);color:var(--text-medium);">${r.detail}</td>
        <td style="padding:10px;border-bottom:1px solid var(--border-light);color:var(--text-medium);font-size:0.78rem;text-align:right;white-space:nowrap;">${formatDateShort(r.fecha)}</td>
      </tr>
    `).join('') + '</tbody></table>';
  }
}

// ── ESTUDIANTES ──
async function loadEstudiantes(sb) {
  // Obtener dispositivos únicos como proxy de estudiantes
  const { data: devices } = await sb.from('user_devices').select('*');
  const userMap = {};
  (devices || []).forEach(d => {
    if (!userMap[d.user_id]) userMap[d.user_id] = { user_id: d.user_id, devices: 0, last_seen: d.updated_at || d.created_at };
    userMap[d.user_id].devices++;
    const t = d.updated_at || d.created_at;
    if (t && new Date(t) > new Date(userMap[d.user_id].last_seen || 0)) userMap[d.user_id].last_seen = t;
  });

  // Obtener resultados para cruzar datos
  const { data: simRes } = await sb.from('resultados_simulacros').select('*');
  const { data: bancoRes } = await sb.from('resultados_banco').select('*');
  const { data: vidRes } = await sb.from('progreso_videoclases').select('*');

  const users = Object.values(userMap).map(u => {
    const sims = (simRes || []).filter(r => r.user_id === u.user_id);
    const banks = (bancoRes || []).filter(r => r.user_id === u.user_id);
    const vids = (vidRes || []).filter(r => r.user_id === u.user_id);
    const avg = sims.length ? Math.round(sims.reduce((s, r) => s + (r.porcentaje || r.score || 0), 0) / sims.length) : 0;
    return { ...u, sims: sims.length, banks: banks.length, vids: vids.length, avg };
  });

  cachedData.estudiantes = users;
  renderEstudiantes(users);
}

function renderEstudiantes(list) {
  const tbody = document.getElementById('tabla-estudiantes');
  if (!tbody) return;

  if (!list || !list.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fas fa-users"></i><h4>no hay estudiantes registrados</h4><p>cuando los alumnos inicien sesión aparecerán aquí.</p></div></td></tr>';
    return;
  }

  tbody.innerHTML = list.map(u => {
    const uid = String(u.user_id || '??');
    const safeUid = uid.replace(/'/g, '');
    const devices = Number(u.devices || 0);
    return `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-cell-avatar">${uid.slice(0,2).toUpperCase()}</div>
            <div class="user-cell-info">
              <span class="user-cell-name">usuario …${uid.slice(-6)}</span>
              <span class="user-cell-email">${devices} dispositivo${devices!==1?'s':''}</span>
            </div>
          </div>
        </td>
        <td>${formatDateShort(u.last_seen)}</td>
        <td><span class="tag tag-info">${u.sims || 0}</span></td>
        <td>${renderScore(u.avg || 0)}</td>
        <td>${u.vids || 0}</td>
        <td>—</td>
        <td><span class="tag tag-success">activo</span></td>
        <td><button class="btn btn-sm btn-secondary" onclick="verDetalleEstudiante('${safeUid}')"><i class="fas fa-eye"></i> ver</button></td>
      </tr>`;
  }).join('');
}


function filterEstudiantes() {
  const q = document.getElementById('search-estudiantes').value.toLowerCase();
  const list = cachedData.estudiantes || [];
  const filtered = list.filter(u => (u.user_id || '').toLowerCase().includes(q));
  renderEstudiantes(filtered);
}

// ── SIMULACROS ──
async function loadSimulacros(sb) {
  const { data: sims } = await sb.from('resultados_simulacros').select('*').order('created_at', { ascending: false });
  const list = sims || [];
  cachedData.simulacros = list;

  // Stats
  document.getElementById('sim-total').textContent = list.length;
  const avg = list.length ? Math.round(list.reduce((s, r) => s + (r.porcentaje || r.score || 0), 0) / list.length) : 0;
  document.getElementById('sim-promedio').textContent = avg + '%';
  const totalTime = list.reduce((s, r) => s + (r.tiempo_segundos || r.tiempo || 0), 0);
  document.getElementById('sim-tiempo').textContent = formatTime(totalTime);

  renderSimulacros(list);
}

function renderSimulacros(list) {
  const tbody = document.getElementById('tabla-simulacros');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="9"><div class="empty-state"><i class="fas fa-clipboard-list"></i><h4>sin simulacros aún</h4><p>los estudiantes aún no han completado simulacros.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = list.map(s => `
    <tr>
      <td><span class="user-cell-name">…${(s.user_id||'').slice(-6)}</span></td>
      <td>${s.simulacro_titulo || s.examen || 'simulacro'}</td>
      <td>${s.materia || '—'}</td>
      <td>${renderScore(s.porcentaje || s.score || 0)}</td>
      <td><span class="tag tag-success">${s.correctas || 0}</span></td>
      <td><span class="tag tag-danger">${s.incorrectas || 0}</span></td>
      <td><span class="tag tag-muted">${s.sin_respuesta || 0}</span></td>
      <td>${formatTime(s.tiempo_segundos || s.tiempo || 0)}</td>
      <td style="font-size:0.78rem;color:var(--text-medium);white-space:nowrap;">${formatDateShort(s.created_at)}</td>
    </tr>
  `).join('');
}

function filterSimulacros() {
  const q = document.getElementById('search-simulacros').value.toLowerCase();
  const list = cachedData.simulacros || [];
  const filtered = list.filter(s =>
    (s.user_id || '').toLowerCase().includes(q) ||
    (s.materia || '').toLowerCase().includes(q) ||
    (s.simulacro_titulo || '').toLowerCase().includes(q)
  );
  renderSimulacros(filtered);
}

// ── EVALUACIONES ──
async function loadEvaluaciones(sb) {
  const { data: banks } = await sb.from('resultados_banco').select('*').order('created_at', { ascending: false });
  const list = banks || [];
  cachedData.evaluaciones = list;

  // Charts
  const difChart = document.getElementById('eval-dificultad-chart');
  const temaChart = document.getElementById('eval-temas-chart');

  if (!list.length) {
    difChart.innerHTML = '<div class="empty-state"><i class="fas fa-layer-group"></i><h4>sin evaluaciones</h4><p>crea la tabla <code>resultados_banco</code> y registra intentos.</p></div>';
    temaChart.innerHTML = '<div class="empty-state"><i class="fas fa-book-medical"></i><h4>sin evaluaciones</h4><p>crea la tabla <code>resultados_banco</code> y registra intentos.</p></div>';
  } else {
    // Por dificultad (necesitamos cruzar con banco_preguntas o guardar dificultad en resultados)
    difChart.innerHTML = '<div class="empty-state"><i class="fas fa-info-circle"></i><h4>próximamente</h4><p>agrega la columna <code>dificultad</code> a <code>resultados_banco</code> para ver este gráfico.</p></div>';

    // Por tema
    const byTema = {};
    list.forEach(r => {
      const t = r.tema || 'sin tema';
      if (!byTema[t]) byTema[t] = { total: 0, correct: 0 };
      byTema[t].total += (r.total || 1);
      byTema[t].correct += (r.correctas || 0);
    });
    const sorted = Object.entries(byTema).map(([t, v]) => ({ tema: t, pct: Math.round(v.correct / v.total * 100) })).sort((a, b) => b.pct - a.pct).slice(0, 8);
    temaChart.innerHTML = sorted.map(t => `
      <div class="progress-item">
        <div class="progress-meta"><span class="label">${t.tema}</span><span class="value">${t.pct}% acierto</span></div>
        <div class="progress-track"><div class="progress-fill green" style="width:${t.pct}%"></div></div>
      </div>
    `).join('');
  }

  renderEvaluaciones(list);
}

function renderEvaluaciones(list) {
  const tbody = document.getElementById('tabla-evaluaciones');
  if (!list.length) {
    tbody.innerHTML = '<tr><td colspan="8"><div class="empty-state"><i class="fas fa-database"></i><h4>sin evaluaciones aún</h4><p>los estudiantes aún no han completado bancos de preguntas.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = list.map(e => {
    const pct = Math.round((e.correctas || 0) / (e.total || 1) * 100);
    return `
    <tr>
      <td><span class="user-cell-name">…${(e.user_id||'').slice(-6)}</span></td>
      <td>${e.materia || '—'}</td>
      <td>${e.tema || '—'}</td>
      <td>${e.total || 0}</td>
      <td><span class="tag tag-success">${e.correctas || 0}</span></td>
      <td><span class="tag tag-danger">${(e.total||0)-(e.correctas||0)}</span></td>
      <td>${renderScore(pct)}</td>
      <td style="font-size:0.78rem;color:var(--text-medium);white-space:nowrap;">${formatDateShort(e.created_at)}</td>
    </tr>
  `}).join('');
}

function filterEvaluaciones() {
  const q = document.getElementById('search-evaluaciones').value.toLowerCase();
  const list = cachedData.evaluaciones || [];
  const filtered = list.filter(e =>
    (e.user_id || '').toLowerCase().includes(q) ||
    (e.materia || '').toLowerCase().includes(q) ||
    (e.tema || '').toLowerCase().includes(q)
  );
  renderEvaluaciones(filtered);
}

// ── VIDEOCLASES ──
async function loadVideoclases(sb) {
  const { data: videos } = await sb.from('videoclases').select('*');
  const { data: progreso } = await sb.from('progreso_videoclases').select('*');
  const vids = videos || [];
  const prog = progreso || [];
  cachedData.videoclases = prog;

  document.getElementById('vc-total').textContent = vids.length;
  document.getElementById('vc-views').textContent = prog.length;
  const uniqueWatchers = new Set(prog.map(p => p.user_id)).size;
  document.getElementById('vc-active').textContent = uniqueWatchers;

  const tbody = document.getElementById('tabla-videoclases');
  if (!prog.length) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="fas fa-video"></i><h4>sin visualizaciones aún</h4><p>los estudiantes aún no han visto videoclases, o falta la tabla <code>progreso_videoclases</code>.</p></div></td></tr>';
    return;
  }
  tbody.innerHTML = prog.map(p => `
    <tr>
      <td>${p.video_titulo || '—'}</td>
      <td>${p.materia || '—'}</td>
      <td><span class="user-cell-name">…${(p.user_id||'').slice(-6)}</span></td>
      <td>
        <div class="progress-track" style="width:120px;display:inline-block;vertical-align:middle;">
          <div class="progress-fill orange" style="width:${Math.min(p.progreso_pct||0,100)}%"></div>
        </div>
        <span style="font-size:0.78rem;color:var(--text-medium);">${p.progreso_pct||0}%</span>
      </td>
      <td><span class="tag ${p.visto?'tag-success':'tag-muted'}">${p.visto?'sí':'no'}</span></td>
      <td style="font-size:0.78rem;color:var(--text-medium);white-space:nowrap;">${formatDateShort(p.fecha_visto)}</td>
    </tr>
  `).join('');
}

function filterVideoclases() {
  const q = document.getElementById('search-videoclases').value.toLowerCase();
  const list = cachedData.videoclases || [];
  const filtered = list.filter(v =>
    (v.video_titulo || '').toLowerCase().includes(q) ||
    (v.materia || '').toLowerCase().includes(q) ||
    (v.user_id || '').toLowerCase().includes(q)
  );
  const tbody = document.getElementById('tabla-videoclases');
  if (!filtered.length) {
    tbody.innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="fas fa-search"></i><h4>sin resultados</h4></div></td></tr>';
    return;
  }
  tbody.innerHTML = filtered.map(p => `
    <tr>
      <td>${p.video_titulo || '—'}</td>
      <td>${p.materia || '—'}</td>
      <td><span class="user-cell-name">…${(p.user_id||'').slice(-6)}</span></td>
      <td>
        <div class="progress-track" style="width:120px;display:inline-block;vertical-align:middle;">
          <div class="progress-fill orange" style="width:${Math.min(p.progreso_pct||0,100)}%"></div>
        </div>
        <span style="font-size:0.78rem;color:var(--text-medium);">${p.progreso_pct||0}%</span>
      </td>
      <td><span class="tag ${p.visto?'tag-success':'tag-muted'}">${p.visto?'sí':'no'}</span></td>
      <td style="font-size:0.78rem;color:var(--text-medium);white-space:nowrap;">${formatDateShort(p.fecha_visto)}</td>
    </tr>
  `).join('');
}

// ── CONTENIDO ──
async function loadContenido(sb) {
  // Flashcards
  const { data: flash } = await sb.from('flashcards').select('*').limit(50);
  const tbodyFlash = document.getElementById('tabla-content-flashcards');
  if (flash && flash.length) {
    tbodyFlash.innerHTML = flash.map(f => `
      <tr>
        <td><span class="tag tag-info">${f.MATERIA||'—'}</span></td>
        <td>${f.TEMA||'—'}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.PREGUNTA||'—'}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.RESPUESTA||'—'}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="showToast('edición próximamente','info')"><i class="fas fa-edit"></i></button></td>
      </tr>
    `).join('');
  } else {
    tbodyFlash.innerHTML = '<tr><td colspan="5"><div class="empty-state"><i class="fas fa-layer-group"></i><h4>sin flashcards</h4></div></td></tr>';
  }

  // Banco
  const { data: banco } = await sb.from('banco_preguntas').select('*').limit(50);
  const tbodyBanco = document.getElementById('tabla-content-banco');
  if (banco && banco.length) {
    tbodyBanco.innerHTML = banco.map(b => `
      <tr>
        <td><span class="tag tag-info">${b.MATERIA||'—'}</span></td>
        <td>${b.TEMA||'—'}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${b.PREGUNTA||'—'}</td>
        <td><span class="tag ${(b.DIFICULTAD||'').toLowerCase()==='facil'?'tag-success':((b.DIFICULTAD||'').toLowerCase()==='dificil'?'tag-danger':'tag-warning')}">${b.DIFICULTAD||'—'}</span></td>
        <td>${b.RESPUESTA||'—'}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="showToast('edición próximamente','info')"><i class="fas fa-edit"></i></button></td>
      </tr>
    `).join('');
  } else {
    tbodyBanco.innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="fas fa-database"></i><h4>sin preguntas en el banco</h4></div></td></tr>';
  }

  // Videos
  const { data: vids } = await sb.from('videoclases').select('*').limit(50);
  const tbodyVids = document.getElementById('tabla-content-videos');
  if (vids && vids.length) {
    tbodyVids.innerHTML = vids.map(v => `
      <tr>
        <td><span class="tag tag-info">${v.MATERIA||'—'}</span></td>
        <td>${v.TITULO||'—'}</td>
        <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"><a href="${v.URL_VIDEO||v.URL_IMAGEN||'#'}" target="_blank" style="color:var(--info);text-decoration:none;">${v.URL_VIDEO||v.URL_IMAGEN||'—'}</a></td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${v.DESCRIPCION||'—'}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="showToast('edición próximamente','info')"><i class="fas fa-edit"></i></button></td>
      </tr>
    `).join('');
  } else {
    tbodyVids.innerHTML = '<tr><td colspan="5"><div class="empty-state"><i class="fas fa-play-circle"></i><h4>sin videoclases</h4></div></td></tr>';
  }

  // Simulacros (tabla simulacros)
  const { data: sims } = await sb.from('simulacros').select('*').limit(50);
  const tbodySim = document.getElementById('tabla-content-sim');
  if (sims && sims.length) {
    tbodySim.innerHTML = sims.map(s => `
      <tr>
        <td>${s.TITULO||s.titulo||'—'}</td>
        <td><span class="tag tag-info">${s.MATERIA||s.materia||'—'}</span></td>
        <td>${s.NUMERO_PREGUNTAS||s.numero_preguntas||'—'}</td>
        <td>${s.DURACION||s.duracion||'—'} min</td>
        <td style="font-size:0.78rem;color:var(--text-medium);white-space:nowrap;">${formatDateShort(s.created_at||s.CREADO)}</td>
        <td><button class="btn btn-sm btn-secondary" onclick="showToast('edición próximamente','info')"><i class="fas fa-edit"></i></button></td>
      </tr>
    `).join('');
  } else {
    tbodySim.innerHTML = '<tr><td colspan="6"><div class="empty-state"><i class="fas fa-clipboard-list"></i><h4>sin simulacros registrados</h4></div></td></tr>';
  }
}

// ══════════════════════════════════════════════
// ██  MODAL DETALLE ESTUDIANTE  ██
// ══════════════════════════════════════════════

async function verDetalleEstudiante(userId) {
  const modal = document.getElementById('modal-estudiante');
  const body = document.getElementById('modal-est-body');
  document.getElementById('modal-est-name').textContent = 'detalle del estudiante …' + userId.slice(-6);
  modal.classList.add('open');
  body.innerHTML = '<div class="loading-overlay"><i class="fas fa-spinner fa-spin"></i> cargando detalle...</div>';

  const sb = getSupabase();
  try {
    const [{ data: sims }, { data: banks }, { data: vids }] = await Promise.all([
      sb.from('resultados_simulacros').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      sb.from('resultados_banco').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      sb.from('progreso_videoclases').select('*').eq('user_id', userId).order('fecha_visto', { ascending: false })
    ]);

    const s = sims || [];
    const b = banks || [];
    const v = vids || [];

    const simAvg = s.length ? Math.round(s.reduce((a, r) => a + (r.porcentaje || r.score || 0), 0) / s.length) : 0;
    const bancoAvg = b.length ? Math.round(b.reduce((a, r) => a + ((r.correctas || 0) / (r.total || 1) * 100), 0) / b.length) : 0;

    body.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px;">
        <div class="stat-card" style="padding:16px;"><div class="stat-label">simulacros</div><div class="stat-value" style="font-size:1.4rem;">${s.length}</div></div>
        <div class="stat-card" style="padding:16px;"><div class="stat-label">bancos</div><div class="stat-value" style="font-size:1.4rem;">${b.length}</div></div>
        <div class="stat-card" style="padding:16px;"><div class="stat-label">videos</div><div class="stat-value" style="font-size:1.4rem;">${v.length}</div></div>
      </div>
      <div style="margin-bottom:16px;">
        <div class="chart-title" style="margin-bottom:10px;"><i class="fas fa-chart-pie" style="color:var(--orange);"></i> promedios</div>
        <div class="progress-list">
          <div class="progress-item"><div class="progress-meta"><span class="label">simulacros</span><span class="value">${simAvg}%</span></div><div class="progress-track"><div class="progress-fill orange" style="width:${simAvg}%"></div></div></div>
          <div class="progress-item"><div class="progress-meta"><span class="label">banco de preguntas</span><span class="value">${bancoAvg}%</span></div><div class="progress-track"><div class="progress-fill green" style="width:${bancoAvg}%"></div></div></div>
        </div>
      </div>
      ${s.length ? `<div style="margin-bottom:16px;"><div class="chart-title" style="margin-bottom:10px;"><i class="fas fa-clipboard-list" style="color:var(--info);"></i> últimos simulacros</div>
        <table style="width:100%;font-size:0.82rem;border-collapse:collapse;"><thead><tr style="background:var(--bg-soft);"><th style="padding:8px;text-align:left;">examen</th><th style="padding:8px;text-align:left;">nota</th><th style="padding:8px;text-align:left;">fecha</th></tr></thead><tbody>
        ${s.slice(0,5).map(x => `<tr style="border-bottom:1px solid var(--border-light);"><td style="padding:8px;">${x.simulacro_titulo||'—'}</td><td style="padding:8px;">${renderScore(x.porcentaje||x.score||0)}</td><td style="padding:8px;color:var(--text-medium);white-space:nowrap;">${formatDateShort(x.created_at)}</td></tr>`).join('')}
        </tbody></table></div>` : ''}
      ${v.length ? `<div><div class="chart-title" style="margin-bottom:10px;"><i class="fas fa-play-circle" style="color:var(--purple);"></i> videoclases vistas</div>
        <table style="width:100%;font-size:0.82rem;border-collapse:collapse;"><thead><tr style="background:var(--bg-soft);"><th style="padding:8px;text-align:left;">video</th><th style="padding:8px;text-align:left;">progreso</th><th style="padding:8px;text-align:left;">fecha</th></tr></thead><tbody>
        ${v.slice(0,5).map(x => `<tr style="border-bottom:1px solid var(--border-light);"><td style="padding:8px;">${x.video_titulo||'—'}</td><td style="padding:8px;">${x.progreso_pct||0}%</td><td style="padding:8px;color:var(--text-medium);white-space:nowrap;">${formatDateShort(x.fecha_visto)}</td></tr>`).join('')}
        </tbody></table></div>` : ''}
    `;
  } catch (err) {
    console.error('Error cargando detalle de estudiante:', err);
    body.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h4>error cargando datos</h4><p>' + (err.message || 'no se pudo obtener el detalle') + '</p></div>';
  }
}

function closeModal(e) {
  if (!e || e.target.id === 'modal-estudiante') {
    document.getElementById('modal-estudiante').classList.remove('open');
  }
}

// ══════════════════════════════════════════════
// ██  UTILIDADES  ██
// ══════════════════════════════════════════════

function renderScore(score) {
  const cls = score >= 80 ? 'score-high' : (score >= 60 ? 'score-mid' : 'score-low');
  return `<span class="score-badge ${cls}">${score}%</span>`;
}

function formatDateShort(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
}

function formatTime(seconds) {
  if (!seconds) return '0 min';
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m} min`;
}

function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) {
    console.warn('showToast: no existe #toast-container');
    return;
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${String(msg || '')}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, type === 'error' ? 5000 : 3000);
}



// Exports senior-safe para handlers inline del HTML
window.handleAdminLogin = handleAdminLogin;
window.adminLogout = adminLogout;
window.showSection = showSection;
window.filterEstudiantes = filterEstudiantes;
window.filterSimulacros = filterSimulacros;
window.filterEvaluaciones = filterEvaluaciones;
window.filterVideoclases = filterVideoclases;
window.showContentTab = showContentTab;
window.verDetalleEstudiante = verDetalleEstudiante;
window.closeModal = closeModal;
window.showToast = showToast;
