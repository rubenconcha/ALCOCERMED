document.getElementById('membership-activation').addEventListener('submit',async event=>{
 event.preventDefault();
 const email=document.getElementById('membership-email').value.trim();
 const months=Number(document.getElementById('membership-months').value);
 const duration=months===0?'de por vida, sin vencimiento':'por '+months+' meses desde hoy';
 if(!confirm('¿Ya verificaste el pago de '+email+'? Se activará su acceso '+duration+'.')) return;
 const button=event.target.querySelector('button'),status=document.getElementById('membership-status');
 button.disabled=true;status.textContent='Activando…';
 try{
  const {error}=await getSupabase().rpc('campus_activate',{p_email:email,p_months:months});
  if(error) throw error;
  status.textContent='Acceso activado. El estudiante puede volver a entrar para ver todos sus recursos.';
 }catch(error){status.textContent=error.message || 'No se pudo activar. Intenta de nuevo.';}
 finally{button.disabled=false;}
});

for(const option of document.querySelectorAll('#membership-months option')){
 const id={1:'monthly',6:'semester',0:'lifetime'}[option.value],plan=window.MembershipOffer?.getPlan(id);
 if(plan)option.textContent=(option.value==='0'?'De por vida':option.value+' '+(option.value==='1'?'mes':'meses'))+' · Bs '+plan.price;
}
