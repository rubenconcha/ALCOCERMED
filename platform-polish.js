'use strict';
// Make the existing quick-access cards usable without a mouse.
document.querySelectorAll('.home-grid .home-card[onclick]').forEach(card => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); }
    });
});
const passwordToggle = document.querySelector('.login-eye-btn');
if (passwordToggle) {
    passwordToggle.setAttribute('aria-label', 'Mostrar contraseña');
    passwordToggle.setAttribute('aria-pressed', 'false');
    passwordToggle.addEventListener('click', () => {
        const visible = document.getElementById('login-password').type === 'text';
        passwordToggle.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
        passwordToggle.setAttribute('aria-pressed', String(visible));
    });
}
