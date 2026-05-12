// ═══════════════════════════════════════
//  VENTAS.JS — Prepa Bencarson Sales Page
// ═══════════════════════════════════════

const WSP_NUMBER = '59173752688';
const WSP_BASE = `https://wa.me/${WSP_NUMBER}`;

// ── Supabase Client ──
const { SUPABASE_URL, SUPABASE_KEY } = window.ALCOCER_CONFIG || {};
let sbClient = null;
if (SUPABASE_URL && SUPABASE_KEY && window.supabase) {
    sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

// ── Nav scroll effect ──
const nav = document.querySelector('.v-nav');
window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile menu ──
function openMobileMenu() {
    document.getElementById('v-mobile-menu')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
    document.getElementById('v-mobile-menu')?.classList.remove('active');
    document.body.style.overflow = '';
}

// ── Scroll animations ──
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.v-fade-up').forEach(el => observer.observe(el));
}

// ── FAQ accordion ──
function toggleFaq(el) {
    const item = el.closest('.v-faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.v-faq-item.active').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

// ── WhatsApp helpers ──
function openWhatsApp(plan) {
    let msg = '¡Hola! Estoy interesado en la plataforma Prepa Bencarson para el propedéutico de Medicina en la UMSS';
    if (plan) msg += ` (plan ${plan})`;
    msg += '. Me gustaría recibir más información.';
    window.open(`${WSP_BASE}?text=${encodeURIComponent(msg)}`, '_blank');
}

function wspFromForm(name, plan) {
    const msg = `¡Hola! Soy ${name}, estoy interesado en el plan ${plan} de Prepa Bencarson para prepararme para el propedéutico de Medicina UMSS. ¿Me pueden dar más detalles?`;
    window.open(`${WSP_BASE}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ── Lead form modal ──
function openLeadModal(planName) {
    const modal = document.getElementById('v-lead-modal');
    const planInput = document.getElementById('lead-plan');
    if (planInput) planInput.value = planName || 'general';
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeLeadModal() {
    document.getElementById('v-lead-modal')?.classList.remove('active');
    document.body.style.overflow = '';
    // Reset form
    const form = document.getElementById('lead-form');
    const msg = document.getElementById('lead-msg');
    if (form) form.reset();
    if (msg) { msg.className = 'v-form-msg'; msg.textContent = ''; }
}

async function submitLead(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.v-form-submit');
    const msg = document.getElementById('lead-msg');
    const name = form.querySelector('#lead-name').value.trim();
    const email = form.querySelector('#lead-email').value.trim();
    const phone = form.querySelector('#lead-phone').value.trim();
    const plan = form.querySelector('#lead-plan').value;

    if (!name || !phone) {
        msg.className = 'v-form-msg error';
        msg.textContent = 'Por favor completa al menos tu nombre y teléfono.';
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        // Save to Supabase if available
        if (sbClient) {
            await sbClient.from('leads_ventas').insert([{
                nombre: name,
                email: email || null,
                telefono: phone,
                plan: plan,
                fecha: new Date().toISOString(),
                estado: 'nuevo'
            }]);
        }

        msg.className = 'v-form-msg success';
        msg.textContent = '¡Registro exitoso! Te redirigimos a WhatsApp...';

        setTimeout(() => {
            wspFromForm(name, plan);
            closeLeadModal();
        }, 1500);

    } catch (err) {
        console.error('Lead error:', err);
        // Even if DB fails, redirect to WhatsApp
        msg.className = 'v-form-msg success';
        msg.textContent = 'Te redirigimos a WhatsApp...';
        setTimeout(() => {
            wspFromForm(name, plan);
            closeLeadModal();
        }, 1200);
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fab fa-whatsapp"></i> Inscribirme por WhatsApp';
    }
}

// ── Smooth scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMobileMenu();
        }
    });
});

// ── Counter animation ──
function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current.toLocaleString() + suffix;
        }, 30);
    });
}

// ── Init on load ──
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    // Animate counters when hero stats are visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) { animateCounters(); statsObserver.disconnect(); }
        });
    }, { threshold: 0.3 });
    const heroStats = document.querySelector('.v-hero-stats');
    if (heroStats) statsObserver.observe(heroStats);
});
