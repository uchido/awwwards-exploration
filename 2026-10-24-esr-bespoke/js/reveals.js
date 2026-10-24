/* Scroll reveals (GSAP + ScrollTrigger) */
(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Generic fade/rise reveals for mono labels & small blocks
  gsap.utils.toArray('[data-reveal]:not([data-reveal="text"])').forEach((el) => {
    gsap.fromTo(el,
      { y: 28, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
      });
  });

  // Large body copy — clip reveal from the bottom
  gsap.utils.toArray('[data-reveal="text"]').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0% 0% 100% 0%)', y: 30 },
      {
        clipPath: 'inset(0% 0% -12% 0%)',
        y: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
  });

  // Marque names — staggered clip rise
  const marqueeItems = gsap.utils.toArray('.marques__item');
  if (marqueeItems.length) {
    gsap.fromTo(marqueeItems,
      { clipPath: 'inset(0% 0% 100% 0%)', y: 40 },
      {
        clipPath: 'inset(0% 0% -10% 0%)',
        y: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.045,
        scrollTrigger: { trigger: '.marques__list', start: 'top 80%' },
      });
  }

  // Sticky marquee image pop
  gsap.fromTo('.marques__media',
    { clipPath: 'inset(100% 0% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.marques__body', start: 'top 70%' },
    });

  // Service rows
  gsap.utils.toArray('.service-row').forEach((row, i) => {
    gsap.fromTo(row,
      { x: -18, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'expo.out',
        delay: (i % 6) * 0.04,
        scrollTrigger: { trigger: row, start: 'top 92%' },
      });
  });

  // Footer newsletter reveal
  ScrollTrigger.create({
    trigger: '.site-footer',
    start: 'top 60%',
    once: true,
    onEnter: () => {
      const row = document.querySelector('.newsletter__row');
      if (row) row.classList.add('is-visible');
    },
  });
})();
