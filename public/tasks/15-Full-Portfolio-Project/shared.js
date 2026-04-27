/* =====================================================
   SHARED.JS — Scroll animations, Navbar scroll effect
   ===================================================== */

// ---- NAVBAR SCROLL ----
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ---- ACTIVE NAV LINK ----
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-gold').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ---- SCROLL REVEAL ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Don't unobserve so elements stay visible
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

// ---- COUNTER ANIMATION ----
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  counterObserver.observe(el);
});

// ---- SMOOTH PAGE TRANSITIONS ----
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (
    href && !href.startsWith('#') && !href.startsWith('http') &&
    !href.startsWith('mailto') && !href.startsWith('tel') &&
    href.endsWith('.html')
  ) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { window.location.href = href; }, 300);
    });
  }
});

// Fade in on load
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'none';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});
