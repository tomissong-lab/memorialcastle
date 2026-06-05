/* ═══════════════════════════════════════════════════════════════
   위드엔딩 — Main JavaScript
   © 2026 위드엔딩. All rights reserved.
═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ─────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ── Mobile menu toggle ───────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });
    // Close on nav link click
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  /* ── Count-up animation for trust bar ────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el      = entry.target;
        const target  = parseFloat(el.dataset.count);
        const decimal = parseInt(el.dataset.decimal || '0');
        const span    = el.querySelector('.trust-number') || el;
        let current   = 0;
        const steps   = 60;
        const inc     = target / steps;
        const timer   = setInterval(() => {
          current += inc;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          span.textContent = decimal > 0
            ? current.toFixed(decimal)
            : Math.floor(current).toLocaleString('ko-KR');
        }, 25);
        observer.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach(el => observer.observe(el));
  }

  /* ── ROI bar animation ────────────────────────────── */
  const roiBar = document.getElementById('roiBar');
  if (roiBar) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => { roiBar.style.width = '87.5%'; }, 300);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(roiBar);
  }

  /* ── Smooth reveal on scroll ──────────────────────── */
  const revealEls = document.querySelectorAll('.diff-card, .review-card, .pkg-card, .mem-card, .director-card, .guide-card, .asset-service-card, .legacy-card');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 80);
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      revealObs.observe(el);
    });
  }

  /* ── Active nav link highlight ────────────────────── */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });
});
