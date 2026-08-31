(function () {
  'use strict';

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  updateThemeIcon();

  function updateThemeIcon() {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
    themeBtn.innerHTML =
      theme === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      updateThemeIcon();
    });
  }

  /* ---------- Header scroll behavior ---------- */
  const header = document.getElementById('siteHeader');
  let lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    const y = window.scrollY;
    if (y > 40) header.classList.add('header--scrolled');
    else header.classList.remove('header--scrolled');

    if (y > lastY && y > 160) header.classList.add('header--hidden');
    else header.classList.remove('header--hidden');
    lastY = y;
  }, { passive: true });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');

  function openNav() {
    mobileNav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    mobileNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (navToggle) navToggle.addEventListener('click', openNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeNav);
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  /* ---------- Generic accordion helper (FAQ, process steps, value cards) ---------- */
  function initAccordionGroup(itemSelector, questionSelector, answerSelector, exclusive) {
    const items = document.querySelectorAll(itemSelector);
    items.forEach(function (item) {
      const btn = item.querySelector(questionSelector);
      const answer = item.querySelector(answerSelector);
      if (!btn || !answer) return;
      btn.addEventListener('click', function () {
        const isOpen = item.classList.contains('is-open');
        if (exclusive) {
          items.forEach(function (openItem) {
            if (openItem !== item && openItem.classList.contains('is-open')) {
              openItem.classList.remove('is-open');
              const openBtn = openItem.querySelector(questionSelector);
              const openAnswer = openItem.querySelector(answerSelector);
              if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
              if (openAnswer) openAnswer.style.maxHeight = '0px';
            }
          });
        }
        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0px';
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  initAccordionGroup('.faq-item', '.faq-question', '.faq-answer', true);

  /* ---------- Made-Easy Process accordion (4 steps) ---------- */
  initAccordionGroup('.step-item', '.step-question', '.step-answer', false);

  /* ---------- What We Stand For value cards ---------- */
  initAccordionGroup('.value-pop-card', '.value-pop-question', '.value-pop-answer', false);

  /* ---------- Count-up stats on scroll into view ---------- */
  const countEls = document.querySelectorAll('[data-count-to]');
  const countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      countObserver.unobserve(el);
      const target = parseInt(el.getAttribute('data-count-to'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 900;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  countEls.forEach(function (el) { countObserver.observe(el); });

  /* ---------- Quote form validation + success state ---------- */
  const form = document.getElementById('quoteForm');
  const success = document.getElementById('formSuccess');

  function setError(field, hasError) {
    field.classList.toggle('has-error', hasError);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const nameField = document.getElementById('fullName').closest('.field');
      const phoneField = document.getElementById('phone').closest('.field');
      const emailField = document.getElementById('email').closest('.field');
      const cityField = document.getElementById('city').closest('.field');
      const zipEl = document.getElementById('zip');
      const zipField = zipEl ? zipEl.closest('.field') : null;

      const nameOk = document.getElementById('fullName').value.trim().length > 1;
      const phoneOk = document.getElementById('phone').value.trim().length > 6;
      const emailOk = isValidEmail(document.getElementById('email').value.trim());
      const cityOk = document.getElementById('city').value.trim().length > 1;
      const zipOk = !zipEl || /^\d{5}$/.test(zipEl.value.trim());

      setError(nameField, !nameOk); if (!nameOk) valid = false;
      setError(phoneField, !phoneOk); if (!phoneOk) valid = false;
      setError(emailField, !emailOk); if (!emailOk) valid = false;
      setError(cityField, !cityOk); if (!cityOk) valid = false;
      if (zipField) { setError(zipField, !zipOk); if (!zipOk) valid = false; }

      if (!valid) {
        form.querySelector('.has-error input, .has-error select')?.focus();
        return;
      }

      form.style.display = 'none';
      success.classList.add('is-visible');
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        const field = el.closest('.field');
        if (field && field.classList.contains('has-error')) field.classList.remove('has-error');
      });
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header color inversion on scroll (Maine-Pointe-inspired) ---------- */
  const darkSections = document.querySelectorAll('[data-header-theme="dark"]');
  if (header && darkSections.length) {
    const headerObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            header.classList.add('header--on-dark');
          } else {
            const stillOverlapping = Array.from(darkSections).some(function (s) {
              const r = s.getBoundingClientRect();
              return r.top < 90 && r.bottom > 10;
            });
            if (!stillOverlapping) header.classList.remove('header--on-dark');
          }
        });
      },
      { rootMargin: '-80px 0px -85% 0px', threshold: 0 }
    );
    darkSections.forEach(function (s) { headerObserver.observe(s); });
  }

  /* ---------- Floating consultation widget ---------- */
  const floatingCta = document.querySelector('.floating-cta');
  const ctaTarget = document.getElementById('quote') || document.getElementById('contact');
  if (floatingCta) {
    window.addEventListener(
      'scroll',
      function () {
        const y = window.scrollY;
        let nearTarget = false;
        if (ctaTarget) {
          const r = ctaTarget.getBoundingClientRect();
          nearTarget = r.top < window.innerHeight * 0.5;
        }
        if (y < 260 || nearTarget) floatingCta.classList.add('is-hidden');
        else floatingCta.classList.remove('is-hidden');
      },
      { passive: true }
    );
  }

  /* ---------- Active nav link highlight ---------- */
  const currentPage = (window.location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('is-active');
    }
  });
})();
