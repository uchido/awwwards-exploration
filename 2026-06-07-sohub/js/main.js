/* ==========================================================================
   SOHub — clone interactions
   GSAP + ScrollTrigger recreating the original's motion language:
   masked letter reveal on the hero word, scroll parallax, section reveals,
   fullscreen menu, custom cursor.
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Hero intro: masked letter reveal ---- */
if (!prefersReduced) {
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .set('.hero-letter', { yPercent: 115 })
    .to('.hero-letter', { yPercent: 0, duration: 1.35, stagger: 0.075 }, 0.25)
    .from('.hero-robot', { scale: 0.86, y: 70, opacity: 0, duration: 1.5, ease: 'power3.out' }, 0.55)
    .from('.hero-tagline', { y: 34, opacity: 0, duration: 1 }, 0.95)
    .from('.site-header', { y: -24, opacity: 0, duration: 0.9 }, 0.35)
    .from('.scroll-hint', { opacity: 0, duration: 0.9 }, 1.5);

  /* ---- Hero scroll-away parallax ---- */
  gsap.to('.hero-word', {
    yPercent: 20, ease: 'none',
    scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-robot', {
    yPercent: -28, ease: 'none',
    scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-tagline', {
    yPercent: 40, opacity: 0.2, ease: 'none',
    scrollTrigger: { trigger: '.home-hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* Scroll hint pulse */
  gsap.to('.scroll-hint .line', {
    scaleY: 0.55, opacity: 0.6, duration: 1.1,
    ease: 'power1.inOut', yoyo: true, repeat: -1
  });

  /* ---- Floating chair parallax ---- */
  gsap.fromTo('.career-chair',
    { yPercent: 14, rotate: 3 },
    { yPercent: -14, rotate: -3, ease: 'none',
      scrollTrigger: { trigger: '.career', start: 'top bottom', end: 'bottom top', scrub: true } }
  );

  /* ---- Footer capsule drift ---- */
  gsap.fromTo('.footer-elem',
    { yPercent: 16 },
    { yPercent: 0, ease: 'none',
      scrollTrigger: { trigger: '.site-footer', start: 'top bottom', end: 'top 35%', scrub: true } }
  );
}

/* ---- Section reveals ---- */
gsap.utils.toArray('.reveal').forEach(function (el) {
  if (prefersReduced) return;
  gsap.from(el, {
    y: 48, opacity: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 86%' }
  });
});

/* Portfolio cards stagger in */
if (!prefersReduced) {
  gsap.from('.project-card', {
    y: 70, opacity: 0, duration: 1.05, ease: 'power3.out', stagger: 0.12,
    scrollTrigger: { trigger: '.projects-grid', start: 'top 82%' }
  });
  gsap.utils.toArray('.service-block').forEach(function (block) {
    gsap.from(block, {
      y: 90, opacity: 0, duration: 1.15, ease: 'power3.out',
      scrollTrigger: { trigger: block, start: 'top 84%' }
    });
  });
}

/* ---- Fullscreen menu ---- */
(function () {
  var overlay = document.querySelector('.menu-overlay');
  var menuBtn = document.querySelector('.btn-menu');
  if (!overlay || !menuBtn) return;

  var tl = gsap.timeline({ paused: true });
  tl.to(overlay, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power4.inOut' })
    .from('.menu-link', { yPercent: 115, duration: 0.95, ease: 'power4.out', stagger: 0.08 }, '-=0.35')
    .from('.menu-meta > *', { opacity: 0, y: 22, duration: 0.6, stagger: 0.06 }, '-=0.55');

  var open = false;
  menuBtn.addEventListener('click', function () {
    open = !open;
    var label = menuBtn.querySelector('.btn-menu-label');
    if (label) label.textContent = open ? 'CLOSE' : 'MENU';
    if (open) {
      overlay.classList.add('open');
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.5).reverse();
      overlay.classList.remove('open');
    }
  });

  /* Close when a menu link is clicked */
  overlay.querySelectorAll('.menu-link').forEach(function (link) {
    link.addEventListener('click', function () {
      if (!open) return;
      open = false;
      var label = menuBtn.querySelector('.btn-menu-label');
      if (label) label.textContent = 'MENU';
      tl.timeScale(1.5).reverse();
      overlay.classList.remove('open');
    });
  });
})();

/* ---- Go up ---- */
var goUp = document.querySelector('.go-up');
if (goUp) {
  goUp.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  });
}

/* ---- Custom cursor (difference-blend dot) ---- */
if (!prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  var cursor = document.querySelector('.cursor');
  if (cursor) {
    document.body.classList.add('has-cursor');
    var xTo = gsap.quickTo(cursor, 'x', { duration: 0.32, ease: 'power3' });
    var yTo = gsap.quickTo(cursor, 'y', { duration: 0.32, ease: 'power3' });
    window.addEventListener('mousemove', function (e) {
      xTo(e.clientX);
      yTo(e.clientY);
    });
    document.querySelectorAll('a, button, .project-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(cursor, { scale: 3.2, duration: 0.35, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(cursor, { scale: 1, duration: 0.35, ease: 'power3.out' });
      });
    });
  }
}