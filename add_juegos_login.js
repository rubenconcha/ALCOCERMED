const fs = require('fs');

// Get login screen HTML from main index.html
const mainHtml = fs.readFileSync('index.html', 'utf8');
const loginMatch = mainHtml.match(/<div id="login-screen" class="login-screen">[\s\S]*?<\/div>\s*<!-- ================= FIN LOGIN ================= -->/);
const loginHtml = loginMatch ? loginMatch[0] : '';

// Get Alcocer config from main script.js
const scriptJs = fs.readFileSync('script.js', 'utf8');
const configMatch = scriptJs.match(/const CONFIG = window\.ALCOCER_CONFIG || {[\s\S]*?};/);
const configStr = configMatch ? configMatch[0] : '';

// Add auth logic to juegos/app.js or inline in juegos/index.html
const authScript = `
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  ${configStr}
  const supabaseClient = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
  
  document.addEventListener('DOMContentLoaded', async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
          document.getElementById('login-screen').classList.add('hidden');
      } else {
          document.getElementById('login-screen').classList.remove('hidden');
      }
  });

  async function handleLogin(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const errorEl = document.getElementById('login-error');
      const errorText = document.getElementById('login-error-text');
      
      if (!email || !password) return;
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      
      if (error) {
          errorEl.classList.remove('hidden');
          errorText.textContent = 'Credenciales incorrectas';
      } else {
          errorEl.classList.add('hidden');
          document.getElementById('login-screen').classList.add('hidden');
      }
  }

  function togglePasswordVisibility() {
      const input = document.getElementById('login-password');
      if (input.type === 'password') input.type = 'text';
      else input.type = 'password';
  }
</script>
`;

// Insert into juegos/index.html
let juegosHtml = fs.readFileSync('juegos/index.html', 'utf8');
juegosHtml = juegosHtml.replace('<body>', `<body>\n${loginHtml}`);
juegosHtml = juegosHtml.replace('</body>', `${authScript}\n</body>`);

// Include the login CSS in juegos/styles.css
const stylesCss = fs.readFileSync('styles.css', 'utf8');
const loginCssMatch = stylesCss.match(/\/\* ═══════════════════════════════════════\s*LOGIN SCREEN\s*═══════════════════════════════════════ \*\/[\s\S]*?\/\* ═══════════════════════════════════════\s*SIDEBAR/);
const loginCss = loginCssMatch ? loginCssMatch[0].replace(/\/\* ═══════════════════════════════════════\s*SIDEBAR/, '') : '';

let juegosCss = fs.readFileSync('juegos/styles.css', 'utf8');
fs.writeFileSync('juegos/styles.css', juegosCss + '\n' + loginCss);

fs.writeFileSync('juegos/index.html', juegosHtml);
console.log('Added login to juegos!');
