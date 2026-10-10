'use strict';
const membershipPlans = {
    mensual: { name: 'Plan mensual', price: 'Bs 200', duration: '1 mes de acceso a todo el contenido' },
    curso: { name: 'Curso completo', price: 'Bs 499', duration: 'Acceso hasta finalizar el curso o gestión' }
};
const purchaseDialog = document.getElementById('purchase-dialog');
let purchaseTrigger = null;
document.querySelectorAll('[data-plan]').forEach(button => button.addEventListener('click', () => {
    const plan = membershipPlans[button.dataset.plan];
    if (!plan) return;
    purchaseTrigger = button;
    document.getElementById('purchase-title').textContent = plan.name;
    document.getElementById('purchase-price').textContent = plan.price;
    document.getElementById('purchase-duration').textContent = plan.duration;
    const message = `Hola, quiero contratar ${plan.name} de AlcocerMed por ${plan.price}. ${plan.duration}. ¿Me envían el QR de pago y los pasos para activar mi cuenta?`;
    document.getElementById('purchase-whatsapp').href = 'https://wa.me/59173752688?text=' + encodeURIComponent(message);
    purchaseDialog.showModal();
}));
document.getElementById('purchase-close').addEventListener('click', () => purchaseDialog.close());
purchaseDialog.addEventListener('click', event => { if (event.target === purchaseDialog) { const r=purchaseDialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom) purchaseDialog.close(); } });
purchaseDialog.addEventListener('close', () => { if (purchaseTrigger) purchaseTrigger.focus(); });
