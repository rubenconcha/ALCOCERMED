'use strict';
// One deadline for every visitor; reloading never restarts the promotion.
window.MembershipOffer = (() => {
 const endsAt = Date.parse('2026-10-15T02:12:43Z');
 const plans = {
  monthly: {name:'Plan mensual', price:100, regularPrice:200, duration:'1 mes'},
  semester: {name:'Plan semestral', price:200, regularPrice:499, duration:'6 meses'},
  lifetime: {name:'Acceso de por vida', price:500, regularPrice:500, duration:'por vida'}
 };
 const active = () => Date.now() < endsAt;
 const getPlan = id => plans[id] ? {...plans[id], price:active()?plans[id].price:plans[id].regularPrice} : null;
 function render(){
  const on=active(),seconds=Math.max(0,Math.floor((endsAt-Date.now())/1000));
  const timer=document.getElementById('offer-countdown');
  if(timer)timer.textContent=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(' : ');
  const title=document.getElementById('offer-title');if(title)title.textContent=on?'Oferta por 48 horas':'La oferta ha finalizado';
  const label=document.getElementById('offer-timer-label');if(label)label.textContent=on?'La oferta termina en':'Plazo cerrado';
  for(const card of document.querySelectorAll('.membership-card')){
   const id=card.querySelector('[data-plan]')?.dataset.plan,plan=getPlan(id);if(!plan)continue;
   card.querySelector('.membership-price strong').textContent=plan.price;
   const discount=card.querySelector('.membership-discount');if(discount)discount.hidden=!on;
  }
  const faq=document.getElementById('plans-price-faq');if(faq)faq.textContent=`El plan mensual cuesta Bs ${getPlan('monthly').price} por un mes. El semestral cuesta Bs ${getPlan('semester').price} por 6 meses. El acceso de por vida cuesta Bs 500 en un solo pago, sin renovaciones. El acceso comienza cuando activamos tu cuenta.`;
  // Keep an open purchase dialog consistent when the offer closes.
  const dialog=document.getElementById('planDialog');if(dialog?.open&&dialog.dataset.plan)updatePurchase(dialog.dataset.plan);
 }
 function updatePurchase(id){
  const plan=getPlan(id);if(!plan)return;
  document.getElementById('dialogTitle').textContent=plan.name+' · Bs '+plan.price;
  document.getElementById('dialogText').textContent=plan.duration==='por vida'?'Bs 500 en un solo pago. Acceso de por vida, sin renovaciones.':`Bs ${plan.price} por ${plan.duration} de acceso completo. Tu vigencia comienza cuando activamos tu cuenta.`;
  document.getElementById('planWhatsApp').href='https://wa.me/59173752688?text='+encodeURIComponent(`Hola, quiero el ${plan.name} de AlcocerMed: Bs ${plan.price}, acceso ${plan.duration==='por vida'?'de por vida':'por '+plan.duration}. ¿Me envían los datos de pago y los pasos para activar mi cuenta?`);
 }
 if(document.getElementById('offer-countdown')){render();setInterval(render,1000);document.addEventListener('visibilitychange',render)}
 return {endsAt,active,getPlan,updatePurchase};
})();
