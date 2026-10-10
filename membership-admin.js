document.getElementById('membership-activation').addEventListener('submit',async event=>{
 event.preventDefault();
 const email=document.getElementById('membership-email').value.trim();
 const months=Number(document.getElementById('membership-months').value);
 if(!confirm('¿Ya verificaste el pago de '+email+'? Se activará su acceso por '+months+' meses desde hoy.')) return;
 const button=event.target.querySelector('button'),status=document.getElementById('membership-status');
 button.disabled=true;status.textContent='Activando…';
 try{
  const {error}=await getSupabase().rpc('campus_activate',{p_email:email,p_months:months});
  if(error) throw error;
  status.textContent='Acceso activado. El estudiante puede volver a entrar para ver todos sus recursos.';
 }catch(error){status.textContent=error.message || 'No se pudo activar. Intenta de nuevo.';}
 finally{button.disabled=false;}
});
