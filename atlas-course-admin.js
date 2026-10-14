document.getElementById('atlas-course-activation').addEventListener('submit',async event=>{
 event.preventDefault();
 const p_email=document.getElementById('atlas-course-email').value.trim();
 const p_course=document.getElementById('atlas-course-name').value.trim();
 const p_mode=document.getElementById('atlas-course-mode').value;
 const p_active=document.getElementById('atlas-course-active').value==='true';
 if(!confirm((p_active?'¿Confirmaste la inscripción':'¿Desactivar la inscripción')+' de '+p_email+' al curso '+p_course+' ('+p_mode+')?'))return;
 const button=event.target.querySelector('button'),status=document.getElementById('atlas-course-status');
 button.disabled=true;status.textContent='Guardando inscripción…';
 try{
  const {error}=await getSupabase().rpc('campus_set_course_enrollment',{p_email,p_course,p_mode,p_active});
  if(error)throw error;
  status.textContent=p_active?'Inscripción confirmada. El estudiante ya puede verificar su acceso gratuito al atlas.':'Inscripción desactivada. Otra inscripción vigente a un curso conservará el acceso al atlas.';
 }catch(error){status.textContent=error.message || 'No se pudo guardar la inscripción.';}
 finally{button.disabled=false;}
});
