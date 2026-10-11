const SUPABASE_URL=window.ALCOCER_CONFIG.SUPABASE_URL;
const SUPABASE_KEY=window.ALCOCER_CONFIG.SUPABASE_KEY;
let registrationClient;
function ensureSupabaseSdk(){ return window.supabase ? Promise.resolve(window.supabase) : Promise.reject(new Error('No pudimos conectar. Recarga la página.')); }
function getSupabase(){ return registrationClient || (registrationClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)); }
document.getElementById('register-form').addEventListener('submit',async event=>{
 event.preventDefault();
 const button=document.getElementById('register-submit'),status=document.getElementById('register-status');
 button.disabled=true; status.textContent='Creando tu cuenta…';
 try {
  await ensureSupabaseSdk(); const client=getSupabase();
  const access=await client.rpc('campus_access');
  if(access.error || !access.data?.ready) throw new Error('El registro está en preparación. Puedes probar la muestra sin registro.');
  const {data,error}=await client.auth.signUp({email:document.getElementById('register-email').value.trim(),password:document.getElementById('register-password').value,options:{emailRedirectTo:location.origin+'/campus',data:{full_name:document.getElementById('register-name').value.trim()}}});
  if(error) throw error;
  if(data.session) { location.assign('/campus'); return; }
  status.textContent='Revisa tu correo para confirmar la cuenta. Si ya estás registrado, entra desde «Iniciar sesión».';
 } catch(error){status.textContent=error.message || 'No pudimos crear la cuenta. Intenta de nuevo.';}
 finally{button.disabled=false;}
});
