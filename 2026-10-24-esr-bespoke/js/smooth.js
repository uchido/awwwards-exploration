/* Minimal Lenis-style wheel smoothing (rAF lerp on window.scrollY).
   Keeps native scroll position in sync so ScrollTrigger works untouched. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (reduce || coarse) return;

  let target = window.scrollY;
  let current = target;
  let running = false;

  const maxScroll = () =>
    Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

  function loop() {
    current += (target - current) * 0.095;
    if (Math.abs(target - current) < 0.35) {
      current = target;
      running = false;
    } else {
      requestAnimationFrame(loop);
    }
    window.scrollTo(0, current);
  }

  function start() {
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }

  window.addEventListener(
    'wheel',
    (e) => {
      if (document.body.classList.contains('is-locked')) return;
      if (e.ctrlKey) return;
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 18;
      else if (e.deltaMode === 2) delta *= window.innerHeight;
      target = Math.min(Math.max(target + delta, 0), maxScroll());
      start();
    },
    { passive: false }
  );

  window.addEventListener('scroll', () => {
    if (!running) {
      target = window.scrollY;
      current = target;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    target = window.scrollY;
    current = target;
  });

  window.__smoothScrollTo = function (y) {
    target = Math.min(Math.max(y, 0), maxScroll());
    start();
  };
})();
