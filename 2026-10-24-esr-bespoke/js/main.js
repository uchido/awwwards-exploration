/* Main — intro timeline, hero unmute, anchor navigation w/ curtain, form */
(function () {
  const page = document.getElementById('page-content');
  const intro = document.querySelector('.intro');
  const introLogo = document.querySelector('.intro__logo');
  const curtain = document.getElementById('curtain');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Intro / page reveal ---------- */
  function revealInstant() {
    if (page) page.style.transform = 'none';
    if (intro) intro.style.display = 'none';
    if (window.gsap) {
      gsap.set('.hero__title .line__inner', { y: 0, yPercent: 0 });
      gsap.set('.site-header .roll__inner > span', { y: 0, yPercent: 0 });
      gsap.set('.header-nav__link', { opacity: 1, y: 0 });
      gsap.set('.hamburger', { opacity: 1 });
    } else {
      document.querySelectorAll('.hero__title .line__inner').forEach((el) => {
        el.style.transform = 'none';
      });
    }
    document.querySelectorAll('.hero__aside, .hero__unmute').forEach((el) => {
      el.style.opacity = '1';
      el.style.visibility = 'visible';
    });
  }

  function runIntro() {
    if (!window.gsap) { revealInstant(); return; }
    if (reduce) { revealInstant(); return; }

    gsap.registerPlugin(ScrollTrigger);

    // initial states (clear CSS %-translate first so yPercent owns the value)
    gsap.set('.site-header .roll__inner > span', { y: 0, yPercent: 110 });
    gsap.set('.header-nav__link', { opacity: 0, y: 16 });
    gsap.set('.hamburger', { opacity: 0 });
    gsap.set('.hero__title .line__inner', { y: 0, yPercent: 110 });

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

    tl.fromTo(introLogo,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 }, 0.15)
      .to(introLogo, { opacity: 0, duration: 0.45, ease: 'power2.inOut' }, 1.35)
      .to(page, { y: 0, duration: 1.45, ease: 'expo.inOut',
        onStart: () => { page.style.transform = ''; } }, 1.45)
      .add(() => { if (intro) intro.style.display = 'none'; ScrollTrigger.refresh(); }, 2.6)
      // header
      .to('.site-header .roll__inner > span', { yPercent: 0, duration: 0.9, stagger: 0.06 }, 2.0)
      .to('.header-nav__link', { opacity: 1, y: 0, duration: 0.7, stagger: 0.05 }, 2.1)
      .to('.hamburger', { opacity: 1, duration: 0.6 }, 2.2)
      // hero content
      .to('.hero__title .line__inner', { yPercent: 0, duration: 1.2, stagger: 0.09 }, 2.15)
      .fromTo('.hero__aside',
        { opacity: 0, visibility: 'hidden', y: 24 },
        { opacity: 1, visibility: 'visible', y: 0, duration: 1 }, 2.45)
      .fromTo('.hero__unmute',
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.8 }, 2.6);

    // page starts translated 100vh via CSS; GSAP animates transform to 0
    gsap.set(page, { y: '100vh' });
  }

  if (document.readyState === 'complete') runIntro();
  else window.addEventListener('load', runIntro);

  // Fallback if load never fires quickly
  setTimeout(() => {
    if (page && getComputedStyle(page).transform !== 'none' &&
        page.getBoundingClientRect().top > window.innerHeight * 0.9) {
      // intro still pending after 4s — force reveal
      revealInstant();
    }
  }, 4000);

  /* ---------- Hero unmute ---------- */
  const hero = document.querySelector('.hero');
  const unmuteBtn = document.querySelector('.hero__unmute');
  const altVideo = document.querySelector('.hero__video--alt');
  const mainVideo = document.querySelector('.hero__video:not(.hero__video--alt)');

  if (unmuteBtn && hero) {
    unmuteBtn.addEventListener('click', () => {
      const on = hero.classList.toggle('is-unmuted');
      unmuteBtn.textContent = on ? 'Mute' : 'Unmute';
      if (altVideo) {
        if (on) {
          if (!altVideo.src && altVideo.querySelector('source')) {
            // ensure load on first use
            altVideo.load();
          }
          altVideo.muted = false;
          if (mainVideo) altVideo.currentTime = mainVideo.currentTime % (altVideo.duration || mainVideo.currentTime + 1 || 1);
          altVideo.play().catch(() => {});
        } else {
          altVideo.pause();
        }
      }
    });
  }

  // Keep muted hero video playing when possible
  if (mainVideo) {
    mainVideo.play().catch(() => {});
  }

  /* ---------- Anchor navigation with curtain flash ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      const scrollIt = () => {
        const top = target.getBoundingClientRect().top + window.scrollY;
        if (window.__smoothScrollTo) window.__smoothScrollTo(top);
        else window.scrollTo({ top, behavior: 'smooth' });
      };

      if (window.gsap && curtain && !reduce) {
        gsap.timeline()
          .set(curtain, { visibility: 'visible', opacity: 0 })
          .to(curtain, { opacity: 1, duration: 0.32, ease: 'power2.inOut' })
          .add(scrollIt)
          .to(curtain, { opacity: 0, duration: 0.5, ease: 'power2.inOut', delay: 0.08 })
          .set(curtain, { visibility: 'hidden' });
      } else {
        scrollIt();
      }
    });
  });

  /* ---------- Newsletter form ---------- */
  const form = document.querySelector('.newsletter__form');
  if (form) {
    const input = form.querySelector('input');
    input?.addEventListener('focus', () => form.classList.add('is-focused'));
    input?.addEventListener('blur', () => {
      if (!input.value) form.classList.remove('is-focused');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (input && input.value) {
        input.value = '';
        input.placeholder = 'Thank you';
        form.classList.remove('is-focused');
        setTimeout(() => { input.placeholder = 'Enter your email'; }, 2500);
      }
    });
  }

  /* ---------- Header/hamburger theme switching over dark sections ---------- */
  const hamburger = document.querySelector('.hamburger');
  const header = document.querySelector('.site-header');
  const darkSections = Array.from(document.querySelectorAll('.hero, .services, .gallery'));

  function updateTheme() {
    if (!darkSections.length) return;
    const probeY = 40; // header baseline
    let onDark = false;
    for (const sec of darkSections) {
      const r = sec.getBoundingClientRect();
      if (r.top <= probeY && r.bottom >= probeY) { onDark = true; break; }
    }
    const heroVisible = (() => {
      const h = document.querySelector('.hero');
      if (!h) return false;
      const r = h.getBoundingClientRect();
      return r.top <= probeY && r.bottom >= probeY;
    })();
    if (header) header.style.color = onDark ? '#ffffff' : '#000000';
    if (hamburger) hamburger.style.color = onDark ? '#ffffff' : '#000000';
    if (hamburger) hamburger.classList.toggle('is-light', heroVisible || onDark);
  }

  updateTheme();
  window.addEventListener('scroll', updateTheme, { passive: true });
  window.addEventListener('resize', updateTheme);
})();
