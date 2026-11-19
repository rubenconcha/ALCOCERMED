const SUPABASE_URL=window.ALCOCER_CONFIG.SUPABASE_URL;
const SUPABASE_KEY=window.ALCOCER_CONFIG.SUPABASE_KEY;
let registrationClient;
function ensureSupabaseSdk(){ return window.supabase ? Promise.resolve(window.supabase) : Promise.reject(new Error('No pudimos conectar. Recarga la página.')); }
function getSupabase(){ return registrationClient || (registrationClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)); }
const previousSessionCleared = (async function clearPreviousSession(){
 try {
  await ensureSupabaseSdk();
  const client=getSupabase();
  const {data}=await client.auth.getSession();
  if(!data?.session) return;
  await client.auth.signOut({scope:'local'});
  const status=document.getElementById('register-status');
  if(status) status.textContent='Cerramos la sesión anterior para que puedas crear una cuenta nueva.';
 } catch(_){/* El registro sigue funcionando aunque no se pueda cerrar la sesión anterior. */}
})();
function registrationMessage(error){
 const message=String(error?.message||'');
 if(/already registered|already exists|user already/i.test(message))return 'Ese correo ya tiene una cuenta. Entra desde «Iniciar sesión».';
 if(/rate limit|too many/i.test(message))return 'Demasiados intentos. Espera unos minutos y vuelve a intentarlo.';
 if(/invalid email|email address/i.test(message))return 'Escribe un correo electrónico válido.';
 if(/password/i.test(message))return 'La contraseña debe tener al menos 8 caracteres.';
 return message || 'No pudimos crear la cuenta. Intenta de nuevo.';
}
document.getElementById('register-form').addEventListener('submit',async event=>{
 event.preventDefault();
 await previousSessionCleared;
 const button=document.getElementById('register-submit'),status=document.getElementById('register-status');
 const name=document.getElementById('register-name').value.trim();
 const email=document.getElementById('register-email').value.trim();
 const password=document.getElementById('register-password').value;
 if(!name||!email||!password){status.textContent='Completa todos los campos.';return;}
 button.disabled=true; status.textContent='Creando tu cuenta…';
 try {
  await ensureSupabaseSdk(); const client=getSupabase();
  // El registro es libre: solo crea la cuenta y guarda el correo para activarla después.
  const {data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+'/campus',data:{full_name:name}}});
  if(error) throw error;
  if(data.session) { location.assign('/campus'); return; }
  status.textContent='Revisa tu correo para confirmar la cuenta. Si ya estás registrado, entra desde «Iniciar sesión».';
 } catch(error){status.textContent=registrationMessage(error);}
 finally{button.disabled=false;}
});
