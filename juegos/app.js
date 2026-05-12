// ═══════════════════════════════════════════════
// ALCOCERMED JUEGOS — APP.JS
// Student-first platform with admin gating
// ═══════════════════════════════════════════════

const SUPABASE_URL = 'https://asnwhddmurstzmghuyin.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzbndoZGRtdXJzdHptZ2h1eWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDcwODAsImV4cCI6MjA5MjA4MzA4MH0.bd3kz5Xji6gQknGVw_M2d80XUTwcKzLyOEqKQwfaTmo';
const ADMIN_EMAIL = 'pichon4488@gmail.com';

let sb = null;
let currentUser = null;
let isAdmin = false;

function getSupabase() {
  if (!sb) sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  return sb;
}

// ═══ AUTHENTICATION ═══

async function initAuth() {
  try {
    const client = getSupabase();
    const { data: { session } } = await client.auth.getSession();
    if (session && session.user) {
      currentUser = session.user;
      enterApp();
    } else {
      showLogin();
    }
  } catch (e) {
    console.error('Auth error:', e);
    showLogin();
  }

  getSupabase().auth.onAuthStateChange(function(event, session) {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      enterApp();
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      isAdmin = false;
      showLogin();
    }
  });
}

function showLogin() {
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('app-shell').classList.add('hidden');
  var emailEl = document.getElementById('login-email');
  var passEl = document.getElementById('login-password');
  if (emailEl) emailEl.value = '';
  if (passEl) passEl.value = '';
  hideLoginError();
}

function enterApp() {
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app-shell').classList.remove('hidden');

  // Check admin
  var email = (currentUser.email || '').toLowerCase().trim();
  isAdmin = (email === ADMIN_EMAIL);

  // Update UI with user info
  var name = currentUser.user_metadata && currentUser.user_metadata.full_name
    ? currentUser.user_metadata.full_name
    : email.split('@')[0];

  document.getElementById('topbar-username').textContent = name;
  document.getElementById('topbar-avatar').textContent = name.charAt(0).toUpperCase();

  var greetEl = document.getElementById('greeting-text');
  if (greetEl) greetEl.textContent = getGreeting() + ', ' + name + '!';

  // Show/hide admin sections
  document.querySelectorAll('.admin-only').forEach(function(el) {
    if (isAdmin) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });

  if (document.getElementById('admin-nav-section')) {
    if (isAdmin) {
      document.getElementById('admin-nav-section').classList.remove('hidden');
    } else {
      document.getElementById('admin-nav-section').classList.add('hidden');
    }
  }

  navigateTo('inicio');
}

window.handleLogin = async function(e) {
  e.preventDefault();
  hideLoginError();

  var email = document.getElementById('login-email').value.trim();
  var password = document.getElementById('login-password').value;

  if (!email || !password) { showLoginError('Completa todos los campos'); return; }
  if (password.length < 6) { showLoginError('La contraseña debe tener al menos 6 caracteres'); return; }

  setLoginLoading(true);
  try {
    var client = getSupabase();
    var result = await client.auth.signInWithPassword({ email: email, password: password });
    if (result.error) {
      console.error('Supabase login error:', result.error);
      var msg = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
      if (result.error.message.indexOf('Invalid login') !== -1) msg = 'Correo o contraseña incorrectos';
      else if (result.error.message.indexOf('Email not confirmed') !== -1) msg = 'Confirma tu correo antes de ingresar';
      else if (result.error.message.indexOf('Too many requests') !== -1) msg = 'Demasiados intentos, espera unos minutos';
      else if (result.error.message) msg = result.error.message;
      showLoginError(msg);
      return;
    }
    currentUser = result.data.user;
    enterApp();
  } catch (err) {
    console.error('Login error:', err);
    showLoginError('Error de conexión. Revisa tu internet e intenta de nuevo.');
  } finally {
    setLoginLoading(false);
  }
};

window.togglePasswordVisibility = function() {
  var input = document.getElementById('login-password');
  var icon = document.getElementById('login-eye-icon');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
  } else {
    input.type = 'password';
    if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
  }
};

function showLoginError(msg) {
  var el = document.getElementById('login-error');
  var txt = document.getElementById('login-error-text');
  if (el) el.classList.remove('hidden');
  if (txt) txt.textContent = msg;
}
function hideLoginError() {
  var el = document.getElementById('login-error');
  if (el) el.classList.add('hidden');
}
function setLoginLoading(loading) {
  var btn = document.getElementById('login-btn');
  var btnText = document.getElementById('login-btn-text');
  var btnLoading = document.getElementById('login-btn-loading');
  if (!btn) return;
  btn.disabled = loading;
  if (btnText) btnText.style.display = loading ? 'none' : '';
  if (btnLoading) { if (loading) btnLoading.classList.remove('hidden'); else btnLoading.classList.add('hidden'); }
}

// ═══ NAVIGATION ═══

let currentPage = 'inicio';

function navigateTo(page) {
  currentPage = page;

  // Hide all pages, show target
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  var target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  // Update sidebar nav
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(function(n) { n.classList.remove('active'); });
  var activeSidebar = document.querySelector('.sidebar-nav .nav-item[data-page="' + page + '"]');
  if (activeSidebar) activeSidebar.classList.add('active');

  // Update bottom nav
  document.querySelectorAll('.bnav-item').forEach(function(b) { b.classList.remove('active'); });
  var activeBottom = document.querySelector('.bnav-item[data-page="' + page + '"]');
  if (activeBottom) activeBottom.classList.add('active');

  closeSidebar();
}

// ═══ SIDEBAR ═══

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').classList.add('active');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
}

// ═══ JOIN BY CODE ═══

window.joinByCode = function() {
  var input = document.getElementById('join-code-input');
  var code = input ? input.value.trim() : '';
  if (!code) { alert('Ingresa un código'); return; }
  alert('Buscando evaluación con código: ' + code + '\n\nEsta función se conectará al sistema de evaluaciones en vivo.');
};

window.joinByCodeFull = function() {
  var input = document.getElementById('join-code-full');
  var code = input ? input.value.trim() : '';
  if (!code) {
    document.getElementById('join-error').classList.remove('hidden');
    document.getElementById('join-error-text').textContent = 'Ingresa un código válido';
    return;
  }
  document.getElementById('join-error').classList.add('hidden');
  alert('Buscando evaluación con código: ' + code + '\n\nEsta función se conectará al sistema de evaluaciones en vivo.');
};

// ═══ LOGOUT ═══

async function handleLogout() {
  try {
    await getSupabase().auth.signOut();
  } catch (e) {
    console.error('Logout error:', e);
  }
  currentUser = null;
  isAdmin = false;
  showLogin();
}

// ═══ HELPERS ═══

function getGreeting() {
  var h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

// ═══ INIT ═══

document.addEventListener('DOMContentLoaded', function() {
  // Auth
  initAuth();

  // Hamburger
  document.getElementById('hamburger-btn').addEventListener('click', openSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);
  var closeBtn = document.getElementById('sidebar-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);

  // Sidebar nav
  document.querySelectorAll('.sidebar-nav .nav-item').forEach(function(item) {
    if (item.dataset.page) {
      item.addEventListener('click', function() { navigateTo(item.dataset.page); });
    }
  });

  // Bottom nav
  document.querySelectorAll('.bnav-item').forEach(function(btn) {
    if (btn.dataset.page) {
      btn.addEventListener('click', function() { navigateTo(btn.dataset.page); });
    }
  });

  // Logout
  document.getElementById('logout-btn').addEventListener('click', handleLogout);
});
