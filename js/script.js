/* ============================================================
   HARMONY FAMILY CLINIC — script.js
   Pure Vanilla JavaScript | No external libraries
   Uses: Intersection Observer API, CSS keyframes, rAF
   ============================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   1. LOADING SCREEN
────────────────────────────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  // Hide after CSS animation (~2.3s) + small buffer
  setTimeout(() => {
    loader.classList.add('done');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 2400);
})();


/* ──────────────────────────────────────────────────────────────
   2. SMOOTH SCROLL HELPER
────────────────────────────────────────────────────────────── */
function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const offset = 80; // sticky nav height
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
// Expose globally so onclick attributes in HTML work
window.scrollToSection = scrollToSection;


/* ──────────────────────────────────────────────────────────────
   3. NAVBAR — sticky + scroll-based styling
────────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    showFloatingCTA(window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Smooth-scroll all anchor-links in navbar
  navbar.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        scrollToSection(href);
      }
    });
  });

  // Book appointment buttons in nav
  const navBookBtn = document.getElementById('nav-book-btn');
  if (navBookBtn) navBookBtn.addEventListener('click', () => scrollToSection('#book'));
})();


/* ──────────────────────────────────────────────────────────────
   4. MOBILE MENU
────────────────────────────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const overlay     = document.getElementById('mobile-overlay');
  const closeBtn    = document.getElementById('mobile-close');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const mobileBook  = document.getElementById('mobile-book-btn');
  if (!hamburger || !mobileMenu) return;

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
  );
  if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
  if (overlay)   overlay.addEventListener('click',  closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href !== '#') {
        e.preventDefault();
        closeMenu();
        setTimeout(() => scrollToSection(href), 300);
      }
    });
  });

  if (mobileBook) {
    mobileBook.addEventListener('click', () => {
      closeMenu();
      setTimeout(() => scrollToSection('#book'), 300);
    });
  }

  // Close on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });
})();


/* ──────────────────────────────────────────────────────────────
   5. HERO — CTA buttons
────────────────────────────────────────────────────────────── */
(function initHero() {
  const heroBook = document.getElementById('hero-book-btn');
  if (heroBook) heroBook.addEventListener('click', () => scrollToSection('#book'));

  // All other scroll-to links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        scrollToSection(href);
      }
    });
  });

  document.getElementById('logo-home')?.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ──────────────────────────────────────────────────────────────
   6. INTERSECTION OBSERVER — reveal animations
────────────────────────────────────────────────────────────── */
(function initReveal() {
  const elements = document.querySelectorAll('.reveal-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────────────────
   7. ANIMATED COUNTERS (Stats section)
────────────────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 4);

  function animateCounter(el) {
    const target  = parseInt(el.dataset.target, 10);
    const suffix  = el.dataset.suffix || '';
    const duration = 1800;
    let start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────────────────────
   8. DOCTOR SEARCH
────────────────────────────────────────────────────────────── */
(function initDoctorSearch() {
  const input    = document.getElementById('doctor-search');
  const grid     = document.getElementById('doctors-grid');
  const noResult = document.getElementById('no-results');
  if (!input || !grid) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    const cards = grid.querySelectorAll('.doctor-card');
    let visibleCount = 0;

    cards.forEach(card => {
      const name  = card.dataset.name  || '';
      const spec  = card.dataset.spec  || '';
      const match = !q || name.includes(q) || spec.includes(q);
      card.hidden = !match;
      if (match) visibleCount++;
    });

    if (noResult) noResult.hidden = visibleCount > 0;
  });
})();


/* ──────────────────────────────────────────────────────────────
   9. FAQ ACCORDION
────────────────────────────────────────────────────────────── */
(function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn   = item.querySelector('.accordion-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.accordion-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ──────────────────────────────────────────────────────────────
   10. TESTIMONIALS SLIDER
────────────────────────────────────────────────────────────── */
(function initTestimonials() {
  const track    = document.getElementById('testimonials-track');
  const prevBtn  = document.getElementById('testi-prev');
  const nextBtn  = document.getElementById('testi-next');
  const dotsWrap = document.getElementById('testi-dots');
  if (!track) return;

  const cards  = Array.from(track.querySelectorAll('.testimonial-card'));
  const total  = cards.length;
  let current  = 0;
  let autoplay;

  // Build dots
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    track.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';

    if (dotsWrap) {
      dotsWrap.querySelectorAll('.testi-dot').forEach((d, i) =>
        d.classList.toggle('active', i === current)
      );
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); resetAuto(); }
  });

  // Autoplay
  function startAuto() {
    autoplay = setInterval(next, 5000);
  }
  function resetAuto() {
    clearInterval(autoplay);
    startAuto();
  }

  // Style the track for slider
  track.style.display = 'flex';
  track.style.flexWrap = 'nowrap';
  track.style.overflow = 'hidden';

  startAuto();
  // Pause on hover
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', startAuto);
})();


/* ──────────────────────────────────────────────────────────────
   11. BOOK APPOINTMENT FORM VALIDATION
────────────────────────────────────────────────────────────── */
(function initBookForm() {
  const form    = document.getElementById('book-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  // Set minimum date to today
  const dateInput = document.getElementById('f-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  function showError(inputId, errId, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (input) input.classList.add('error');
    if (err)   err.textContent = msg;
    return false;
  }
  function clearError(inputId, errId) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errId);
    if (input) input.classList.remove('error');
    if (err)   err.textContent = '';
  }

  function validateForm() {
    let valid = true;
    const name    = document.getElementById('f-name');
    const phone   = document.getElementById('f-phone');
    const service = document.getElementById('f-service');
    const date    = document.getElementById('f-date');

    clearError('f-name',    'err-name');
    clearError('f-phone',   'err-phone');
    clearError('f-service', 'err-service');
    clearError('f-date',    'err-date');

    if (!name || !name.value.trim()) {
      showError('f-name', 'err-name', 'Please enter your full name.'); valid = false;
    }
    if (!phone || !phone.value.trim()) {
      showError('f-phone', 'err-phone', 'Please enter your phone number.'); valid = false;
    }
    if (!service || !service.value) {
      showError('f-service', 'err-service', 'Please select a service.'); valid = false;
    }
    if (!date || !date.value) {
      showError('f-date', 'err-date', 'Please choose a preferred date.'); valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate async submission
    if (submitBtn) submitBtn.classList.add('loading');

    setTimeout(() => {
      form.hidden = true;
      if (success) success.hidden = false;
      if (submitBtn) submitBtn.classList.remove('loading');
    }, 1400);
  });

  // Real-time error clear on input
  ['f-name','f-phone','f-service','f-date'].forEach((id, i) => {
    const errIds = ['err-name','err-phone','err-service','err-date'];
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => clearError(id, errIds[i]));
  });
})();


/* ──────────────────────────────────────────────────────────────
   12. CONTACT FORM
────────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = 'Message Sent!';
      btn.style.background = 'hsl(145,60%,38%)';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    }
  });
})();


/* ──────────────────────────────────────────────────────────────
   13. FLOATING CTA
────────────────────────────────────────────────────────────── */
function showFloatingCTA(visible) {
  const cta = document.getElementById('floating-cta');
  if (!cta) return;
  cta.classList.toggle('show', visible);
}


/* ──────────────────────────────────────────────────────────────
   14. SET FOOTER YEAR
────────────────────────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ──────────────────────────────────────────────────────────────
   15. PARALLAX BLOBS via rAF (subtle, performance-safe)
────────────────────────────────────────────────────────────── */
(function initParallax() {
  const blobs = document.querySelectorAll('.blob');
  if (!blobs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        blobs.forEach((blob, i) => {
          const speed = (i + 1) * 0.035;
          blob.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();


/* ──────────────────────────────────────────────────────────────
   16. CARD HOVER — 3D tilt for service cards
────────────────────────────────────────────────────────────── */
(function initCardTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if ('ontouchstart' in window) return; // skip on touch devices

  document.querySelectorAll('.service-card').forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();


/* ──────────────────────────────────────────────────────────────
   17. SECTION ACTIVE LINK HIGHLIGHTING
────────────────────────────────────────────────────────────── */
(function initActiveLinks() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();
