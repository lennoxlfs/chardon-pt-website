/* Chardon Performance Therapy — core UI interactions */
(function () {
  'use strict';

  /* ---------- Header hide on scroll ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    let lastY = 0;
    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const y = window.scrollY;
          if (y > 120 && y > lastY + 8) {
            header.classList.add('is-hidden');
          } else if (y < lastY - 8 || y < 120) {
            header.classList.remove('is-hidden');
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Mobile menu toggle ---------- */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      const open = menu.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal, .stagger').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('[data-faq]').forEach(function (faq) {
    const btn = faq.querySelector('.faq__q');
    const answer = faq.querySelector('.faq__a');
    if (!btn || !answer) return;
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      const open = faq.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Scroll depth (75%) ---------- */
  let scrolled75 = false;
  window.addEventListener('scroll', function () {
    if (scrolled75) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const pct = window.scrollY / scrollable;
    if (pct >= 0.75) {
      scrolled75 = true;
      if (window.CPTAnalytics && typeof window.CPTAnalytics.track === 'function') {
        window.CPTAnalytics.track('scroll_75', { page_path: location.pathname });
      }
    }
  }, { passive: true });

  /* ---------- Hero video fade-in ---------- */
  const heroVideo = document.querySelector('.hero__media video');
  if (heroVideo) {
    const showVideo = function () {
      heroVideo.style.opacity = '1';
    };
    if (heroVideo.readyState >= 3) {
      showVideo();
    } else {
      heroVideo.addEventListener('loadeddata', showVideo, { once: true });
      heroVideo.addEventListener('playing', showVideo, { once: true });
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
    }
  }

  /* ---------- Sticky mobile action bar ---------- */
  const mobileBar = document.querySelector('.mobile-action-bar');
  if (mobileBar && window.innerWidth < 768) {
    document.body.classList.add('has-mobile-bar');
    let shown = false;
    window.addEventListener('scroll', function () {
      if (window.scrollY > 320) {
        if (!shown) {
          mobileBar.classList.add('is-visible');
          shown = true;
        }
      } else if (shown) {
        mobileBar.classList.remove('is-visible');
        shown = false;
      }
    }, { passive: true });
  }

  /* ---------- Contact form ---------- */
  const form = document.querySelector('form[data-contact-form]');
  if (form) {
    const status = form.querySelector('.form__status');
    const submitBtn = form.querySelector('button[type="submit"]');
    const setStatus = function (kind, message) {
      if (!status) return;
      status.className = 'form__status is-visible form__status--' + kind;
      status.textContent = message;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const honey = form.querySelector('input[name="company"]');
      if (honey && honey.value) return;

      const endpoint = form.getAttribute('action');
      const hasBackend = endpoint && endpoint.length > 0 && !endpoint.includes('REPLACE_ON_LAUNCH');
      const data = new FormData(form);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
      }

      if (hasBackend) {
        fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        }).then(function (response) {
          if (response.ok) {
            form.reset();
            setStatus('success', 'Thanks — your message is on its way. We typically reply within 1 business day.');
            if (window.CPTAnalytics) window.CPTAnalytics.track('form_submit', { form_name: form.dataset.formName || 'contact', form_location: location.pathname });
          } else {
            return response.json().then(function (body) {
              const msg = body && body.errors ? body.errors.map(function (x) { return x.message; }).join(', ') : 'Something went wrong. Please email team@chardonpt.com or call (440) 299-7171.';
              setStatus('error', msg);
            });
          }
        }).catch(function () {
          setStatus('error', 'Network error — please email team@chardonpt.com or call (440) 299-7171.');
        }).finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
          }
        });
      } else {
        // Graceful fallback: open mailto
        const subject = encodeURIComponent('New Website Inquiry — ' + (data.get('name') || ''));
        const bodyLines = [];
        data.forEach(function (val, key) {
          if (key === 'company') return;
          bodyLines.push(key + ': ' + val);
        });
        const body = encodeURIComponent(bodyLines.join('\n'));
        window.location.href = 'mailto:team@chardonpt.com?subject=' + subject + '&body=' + body;
        setStatus('success', 'Opening your email client — if it does not open, please email team@chardonpt.com directly.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
        }
      }
    });
  }

  /* ---------- Mark active nav link ---------- */
  const path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  document.querySelectorAll('[data-nav-link]').forEach(function (link) {
    const href = link.getAttribute('href') || '';
    const normalized = href.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    if (normalized !== '/' && (path === normalized || path.indexOf(normalized + '/') === 0)) {
      link.classList.add('is-active');
    }
    if (normalized === '/' && path === '/') {
      link.classList.add('is-active');
    }
  });

  /* ---------- Current year in footer ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
