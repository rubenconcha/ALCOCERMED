'use strict';
function openMobileMenu() {
    document.getElementById('v-mobile-menu').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.querySelector('.v-mobile-close').focus();
}
function closeMobileMenu() {
    document.getElementById('v-mobile-menu').classList.remove('active');
    document.body.style.overflow = '';
}
function openWhatsApp() {
    window.open('https://wa.me/59173752688?text=' + encodeURIComponent('Hola, quiero información sobre los planes de AlcocerMed: mensual Bs 200 o curso completo Bs 499.'), '_blank', 'noopener,noreferrer');
}
document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.getElementById('v-mobile-menu').classList.contains('active')) {
        closeMobileMenu();
        document.querySelector('.v-nav-hamburger').focus();
    }
});
