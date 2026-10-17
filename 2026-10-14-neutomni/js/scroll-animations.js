document.addEventListener("DOMContentLoaded", function () {
  if (
    typeof gsap === "undefined" ||
    typeof ScrollTrigger === "undefined" ||
    typeof SplitText === "undefined"
  ) return;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const MOBILE_BP = 768;
  const DESKTOP_BP = 992;
  const DEFAULT_OFFSET = 0.2;

  const jumpState = {
    triggerId: null,
    label: null,
    until: 0
  };

  function setJumpLock(triggerId, label, duration) {
    jumpState.triggerId = triggerId || null;
    jumpState.label = label || null;
    jumpState.until = Date.now() + (duration || 1200);
  }

  function clearJumpLockLater(delay) {
    setTimeout(function () {
      if (Date.now() >= jumpState.until) {
        jumpState.triggerId = null;
        jumpState.label = null;
        jumpState.until = 0;
      }
    }, delay || 1300);
  }

  function setNavLight(isLight) {
    if (typeof $ !== "undefined") {
      $(".logo, .nav_link").toggleClass("light", !!isLight);
    } else {
      document.querySelectorAll(".logo, .nav_link").forEach(function (el) {
        el.classList.toggle("light", !!isLight);
      });
    }
  }

  /* Blur reveal */
  gsap.utils.toArray('[data-reveal="blur"]').forEach(function (text) {
    if (
      text.matches("a") ||
      text.closest("a") ||
      text.querySelector('a[href^="#"]')
    ) {
      return;
    }

    SplitText.create(text, {
      type: "lines",
      linesClass: "about-line",
      autoSplit: true,
      onSplit(self) {
        return gsap.fromTo(
          self.lines,
          {
            opacity: 0,
            filter: "blur(10px)",
            y: 15
          },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.4,
            ease: "power1.out",
            stagger: 0.12,
            overwrite: true,
            scrollTrigger: {
              trigger: text,
              start: "top 85%",
              toggleActions: "play none none none",
              jumpIgnore: true
            }
          }
        );
      }
    });
  });

/* Portfolio scroll - desktop only */
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
 
gsap.matchMedia().add("(min-width: 992px)", function () {
  const section = document.querySelector(".sticky_wrap");
  const pinEl = document.querySelector(".case_wrapper");
  if (!section || !pinEl) return;
 
  const items = gsap.utils.toArray(".work_item", pinEl);
  const masks = gsap.utils.toArray(".slide_mask", pinEl);
  const images = masks.map(function (m) {
    return m.querySelector("img");
  });
 
  if (
    !items.length ||
    !masks.length ||
    images.some(function (img) {
      return !img;
    })
  ) {
    console.warn("[Portfolio scroll] not started – check .work_item, .slide_mask and an <img> inside every .slide_mask");
    return;
  }
 
  /* ---- Animation ---- */
  const SCROLL_PER_SLIDE = 1;    // viewport heights of scrolling per image
  const SCRUB = 0.8;             // only used when Lenis isn't on the page
  const SCRUB_WITH_LENIS = true; // Lenis already smooths the scroll; 0.8 on top made the image trail behind. Try 0.3 for a softer feel.
  const TRANSITION = 0.9;
  const FADE = 0.28;
  const DIM = 0.28;
  const ZOOM_IN = 1.1;
  const ZOOM_OUT = 1.2;
  const START_REVEALED = false;
  const REVEAL_EASE = "power2.inOut";
 
  /* ---- Snapping ---- */
  const SNAP_FORWARD_AT = 0.1; // scrolling down: go to the next image once its reveal is 10% through
  const SNAP_BACK_AT = 0.9;    // scrolling up: go back once the reveal drops under 70%
  const SNAP_DELAY = 90;      // ms after you stop scrolling
  const SNAP_LERP = 0.1;       // how hard Lenis pulls to the snap point (higher = faster)
 
  const HIDDEN = "polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)";
  const FULL = "polygon(0% 0%, 100% 0%, 100% 101%, 0% 101%)";
 
  const STEP = 1;
  const OFFSET = START_REVEALED ? 0 : 1;
  const REVEAL_PART = TRANSITION / STEP; // each step = reveal (first 80%) + pause (last 20%)
 
  // Works with both versions of Smooth scroll: window.lenis or a global `lenis`
  const lenisRef = window.lenis || (typeof lenis !== "undefined" ? lenis : null);
  const smooth =
    lenisRef && typeof lenisRef.scrollTo === "function" && typeof lenisRef.on === "function"
      ? lenisRef
      : null;
 
  gsap.set(items, {
    opacity: DIM,
    willChange: "opacity"
  });
 
  gsap.set(masks, {
    clipPath: HIDDEN,
    willChange: "clip-path"
  });
 
  gsap.set(images, {
    scale: ZOOM_IN,
    transformOrigin: "50% 50%",
    force3D: true,
    willChange: "transform"
  });
 
  if (START_REVEALED) {
    gsap.set(masks[0], { clipPath: FULL });
    gsap.set(images[0], { scale: 1 });
    gsap.set(items[0], { opacity: 1 });
  }
 
  const tl = gsap.timeline({
    defaults: {
      duration: TRANSITION,
      ease: REVEAL_EASE
    }
  });
 
  if (!START_REVEALED) {
    tl.addLabel("top", 0)
      .to(masks[0], { clipPath: FULL }, 0)
      .to(images[0], { scale: 1, ease: "none" }, 0)
      .to(items[0], { opacity: 1, duration: FADE, ease: "none" }, 0);
  }
 
  tl.addLabel("s0", OFFSET * STEP);
 
  for (let i = 1; i < masks.length; i++) {
    const at = (i + OFFSET - 1) * STEP;
 
    tl.to(masks[i], { clipPath: FULL }, at)
      .to(images[i], { scale: 1, ease: "none" }, at)
      .to(images[i - 1], { scale: ZOOM_OUT, ease: "none" }, at)
      .to(items[i - 1], { opacity: DIM, duration: FADE, ease: "none" }, at)
      .to(items[i], { opacity: 1, duration: FADE, ease: "none" }, at)
      .addLabel("s" + i, (i + OFFSET) * STEP);
  }
 
  const END = (masks.length - 1 + OFFSET) * STEP;
 
  tl.to({}, { duration: 0.01 }, END - 0.01);
 
  const dur = tl.duration();
 
  const labelsAsc = Array.from(
    new Set(
      Object.values(tl.labels).map(function (t) {
        return t / dur;
      })
    )
  ).sort(function (a, b) {
    return a - b;
  });
 
  const revealEase = gsap.parseEase(REVEAL_EASE);
 
  /* Which label to snap to.
     progress: 0–1 over the whole section. dir: 1 down, -1 up, 0 unknown. */
  function pickLabel(progress, dir) {
    const p = gsap.utils.clamp(0, 1, progress);
 
    for (let i = 0; i < labelsAsc.length - 1; i++) {
      const lower = labelsAsc[i];
      const upper = labelsAsc[i + 1];
      if (p > upper) continue;
 
      const local = (p - lower) / (upper - lower);
      const revealed = revealEase(gsap.utils.clamp(0, 1, local / REVEAL_PART));
      const threshold = dir > 0 ? SNAP_FORWARD_AT : dir < 0 ? SNAP_BACK_AT : 0.5;
 
      return revealed >= threshold ? upper : lower;
    }
 
    return labelsAsc[labelsAsc.length - 1];
  }
 
  /* Jump links can force a label for a moment (jumpState lives in the GSAP block) */
  function forcedProgress() {
    const forced =
      typeof jumpState !== "undefined" &&
      jumpState.triggerId === "portfolio-scroll" &&
      jumpState.label &&
      Date.now() < jumpState.until;
 
    if (!forced) return null;
 
    const t = tl.labels[jumpState.label];
    return t !== undefined && dur > 0 ? t / dur : null;
  }
 
  const stVars = {
    id: "portfolio-scroll",
    animation: tl,
    trigger: section,
    start: "top top",
    end: function () {
      return "+=" + Math.round((END / STEP) * window.innerHeight * SCROLL_PER_SLIDE);
    },
    pin: pinEl,
    pinSpacing: true,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    scrub: smooth ? SCRUB_WITH_LENIS : SCRUB
  };
 
  // No Lenis: ScrollTrigger snaps, with the same rules
  if (!smooth) {
    stVars.snap = {
      snapTo: function (value, self) {
        const forced = forcedProgress();
        if (forced !== null) return forced;
        return pickLabel((self.scroll() - self.start) / (self.end - self.start), self.direction);
      },
      duration: { min: 0.45, max: 0.65 },
      delay: SNAP_DELAY / 1000,
      ease: "power1.inOut",
      inertia: false
    };
  }
 
  const st = ScrollTrigger.create(stVars);
 
  if (!smooth) return;
 
  /* ---- Snapping with Lenis ---- */
  let dir = 0;
  let lastY = st.scroll();
  let touching = false;
  let wheelTimer = null;
  let idleTimer = null;
 
  // Where the page will end up: Lenis's target while it glides, otherwise where it is now
  function heading() {
    return smooth.isScrolling === "smooth" && typeof smooth.targetScroll === "number"
      ? smooth.targetScroll
      : st.scroll();
  }
 
  function trySnap() {
    if (touching || smooth.isStopped) return;
 
    const range = st.end - st.start;
    if (range <= 0) return;
 
    const y = heading();
    if (y < st.start || y > st.end) return; // ending up outside the section: leave it alone
 
    const forced = forcedProgress();
    const p = forced !== null ? forced : pickLabel((y - st.start) / range, dir);
    const target = Math.round(st.start + range * p);
 
    if (Math.abs(target - y) < 2) return;
 
    smooth.scrollTo(target, { lerp: SNAP_LERP });
  }
 
  // Lenis scroll (also fires for keyboard, scrollbar and touch scrolling)
  function onScroll() {
    const y = st.scroll();
    if (y !== lastY) {
      dir = y > lastY ? 1 : -1;
      lastY = y;
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(trySnap, SNAP_DELAY);
  }
 
  // Mouse wheel / trackpad: snap as soon as input stops, even while Lenis still glides
  function onWheel(e) {
    if (e.ctrlKey) return; // pinch zoom
    if (e.deltaY) dir = e.deltaY > 0 ? 1 : -1;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(trySnap, SNAP_DELAY);
  }
 
  function onTouchStart() {
    touching = true;
    clearTimeout(idleTimer);
    clearTimeout(wheelTimer);
  }
 
  function onTouchEnd() {
    touching = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(trySnap, SNAP_DELAY);
  }
 
  const unsubscribe = smooth.on("scroll", onScroll);
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });
 
  // Runs when the window goes below 992px
  return function () {
    clearTimeout(idleTimer);
    clearTimeout(wheelTimer);
    if (typeof unsubscribe === "function") unsubscribe();
    else if (typeof smooth.off === "function") smooth.off("scroll", onScroll);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchend", onTouchEnd);
    window.removeEventListener("touchcancel", onTouchEnd);
  };
});
  
  /* Jump to section / label */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener(
      "click",
      function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;

        const targetId = href.slice(1);
        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();

        const isMobile = window.innerWidth < DESKTOP_BP;
        if (!isMobile) e.stopImmediatePropagation();

        const doJump = function () {
          document.documentElement.style.scrollBehavior = "auto";
          document.body.style.scrollBehavior = "auto";

          document.body.getBoundingClientRect();

          let destination;
          let st = null;

          if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh(true);

            const stId = target.dataset.scrollTriggerId;
            if (stId) {
              st = ScrollTrigger.getById(stId) || null;
            }

            if (!st) {
              const candidates = ScrollTrigger.getAll().filter(function (instance) {
                if (!instance || !instance.trigger) return false;
                if (instance.vars && instance.vars.jumpIgnore) return false;

                return (
                  target === instance.trigger ||
                  target.contains(instance.trigger) ||
                  instance.trigger.contains(target)
                );
              });

              st =
                candidates.find(function (instance) {
                  return instance.trigger === target;
                }) ||
                candidates.sort(function (a, b) {
                  const aLen = Math.abs((a.end || 0) - (a.start || 0));
                  const bLen = Math.abs((b.end || 0) - (b.start || 0));
                  return bLen - aLen;
                })[0] ||
                null;
            }
          }

          if (st) {
            const anim = st.animation;
            const namedLabel = target.dataset.scrollLabel;
            const stId = (st.vars && st.vars.id) ? st.vars.id : null;

            if (
              namedLabel &&
              anim &&
              anim.labels &&
              anim.labels[namedLabel] !== undefined &&
              typeof anim.duration === "function" &&
              anim.duration() > 0
            ) {
              const fraction = anim.labels[namedLabel] / anim.duration();

              if (stId) setJumpLock(stId, namedLabel, 1200);

              destination = st.start + (st.end - st.start) * fraction;

              if (namedLabel === "s0") {
                destination += 1;
              }
            } else {
              const pct = parseFloat(target.dataset.scrollOffset ?? DEFAULT_OFFSET);
              destination = st.start + (st.end - st.start) * pct;
            }
          } else {
            const pct = parseFloat(target.dataset.scrollOffset ?? DEFAULT_OFFSET);
            const scrollableHeight = Math.max(0, target.offsetHeight - window.innerHeight);

            destination =
              target.getBoundingClientRect().top +
              window.scrollY +
              scrollableHeight * pct;
          }

          window.scrollTo({
            top: Math.max(0, destination),
            behavior: "auto"
          });

          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              document.documentElement.style.scrollBehavior = "";
              document.body.style.scrollBehavior = "";

              if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh(true);
                ScrollTrigger.update();
              }

              if (window.innerWidth >= DESKTOP_BP && window.updateNavColorFromSections) {
                window.updateNavColorFromSections();
              }

              clearJumpLockLater(1300);
            });
          });
        };

        if (isMobile) {
          setTimeout(doJump, 700);
        } else {
          doJump();
        }
      },
      true
    );
  });

  /* Global refresh */
  window.addEventListener("load", function () {
    if (window.innerWidth >= DESKTOP_BP && window.updateNavColorFromSections) {
      window.updateNavColorFromSections();
    }

    ScrollTrigger.refresh(true);
  });

  let resizeTimer;

  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
      if (window.innerWidth >= DESKTOP_BP) {
        unlockScroll();
        window.updateNavColorFromSections();
      }

      ScrollTrigger.refresh(true);
    }, 200);
  });

  /* Lock scroll when mobile menu is open — tablet and below only */
  const menuOpen = document.querySelector('.menu_button.open');
  const menuClose = document.querySelector('.menu_button.close');

  function lockScroll() {
    if (window.innerWidth < DESKTOP_BP) {
      document.body.style.overflow = 'hidden';
      document.querySelector('.navbar').style.zIndex = '9000000';
    }
  }

  function unlockScroll() {
    document.body.style.overflow = '';
    document.querySelector('.navbar').style.zIndex = '800';
  }

  if (menuOpen) {
    menuOpen.addEventListener('click', lockScroll);
  }

  if (menuClose) {
    menuClose.addEventListener('click', unlockScroll);
  }

  document.querySelectorAll('.nav_link').forEach(function (link) {
    link.addEventListener('click', unlockScroll);
  });

});
