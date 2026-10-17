/* ==========================================================================
   Smooth scroll — a small, dependency-free stand-in for the Lenis instance
   the original site provides to its GSAP/ScrollTrigger timeline.
   Wheel input is eased toward a target offset; native scrolling (keyboard,
   touch, scrollbar) is left untouched and simply re-syncs the target.
   ========================================================================== */
(function () {
  "use strict";

  var main = document.getElementById("main");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  function maxScroll() {
    return Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );
  }

  function setScrollVar(value) {
    if (main) main.style.setProperty("--scroll", value + "px");
  }

  if (!finePointer || reduced) {
    /* no smoothing — just keep the --scroll custom property in sync */
    window.addEventListener(
      "scroll",
      function () {
        setScrollVar(window.scrollY || window.pageYOffset || 0);
      },
      { passive: true }
    );
    setScrollVar(window.scrollY || 0);
    return;
  }

  var current = window.scrollY || 0;
  var target = current;
  var ticking = false;
  var raf = 0;
  var EASE = 0.105;

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function loop() {
    var diff = target - current;
    if (Math.abs(diff) < 0.08) {
      current = target;
      ticking = false;
    } else {
      current += diff * EASE;
    }
    window.scrollTo(0, current);
    setScrollVar(current);
    if (ticking) raf = requestAnimationFrame(loop);
  }

  function start() {
    if (!ticking) {
      ticking = true;
      raf = requestAnimationFrame(loop);
    }
  }

  window.addEventListener(
    "wheel",
    function (e) {
      if (e.ctrlKey) return; /* browser zoom */
      if (e.defaultPrevented) return;
      e.preventDefault();
      var delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= window.innerHeight;
      target = clamp(target + delta, 0, maxScroll());
      start();
    },
    { passive: false }
  );

  /* external scroll (keyboard / touch / programmatic) re-syncs the model */
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        current = target = window.scrollY || 0;
        setScrollVar(current);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    target = current = clamp(current, 0, maxScroll());
    window.scrollTo(0, current);
  });

  setScrollVar(current);

  /* expose a tiny API for the page-transition helper */
  window.__smoothScroll = {
    stop: function () {
      cancelAnimationFrame(raf);
      ticking = false;
      target = current = window.scrollY || 0;
    },
  };
})();
