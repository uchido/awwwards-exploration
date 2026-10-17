/* ==========================================================================
   OFFFORUM — homepage behaviour
   1. GSAP loader (CDN with a vendored local fallback)
   2. Footer wordmark scroll reveal (identical ScrollTrigger mapping to the
      original Vue component)
   3. Header mobile drawer
   4. Cookie consent manager
   5. Page (route) transitions
   6. Hero video autoplay guard
   ========================================================================== */
(function () {
  "use strict";

  /* ─────────────────────────── 1. GSAP bootstrap ────────────────────────── */
  var GSAP_CDN = "https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js";
  var ST_CDN = "https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js";
  var GSAP_LOCAL = "assets/vendor/gsap.min.js";
  var ST_LOCAL = "assets/vendor/ScrollTrigger.min.js";

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function ensureGsap() {
    if (window.gsap && window.ScrollTrigger) return Promise.resolve();
    if (window.gsap && !window.ScrollTrigger) {
      return loadScript(ST_CDN).catch(function () {
        return loadScript(ST_LOCAL);
      });
    }
    return loadScript(GSAP_CDN)
      .catch(function () {
        return loadScript(GSAP_LOCAL);
      })
      .then(function () {
        return loadScript(ST_CDN).catch(function () {
          return loadScript(ST_LOCAL);
        });
      });
  }

  /* ───────────────────────── 2. Footer wordmark reveal ──────────────────── */
  function initFooterLogo() {
    var footer = document.querySelector("footer");
    if (!footer || !window.gsap) return;

    var logoFull = footer.querySelector(".logo-full");
    var logoOfff = footer.querySelector(".logo-offf");
    var logoForum = footer.querySelector(".logo-forum");
    if (!logoFull || !logoOfff || !logoForum) return;

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    /* start state: both halves of the mark are pushed out of the viewBox */
    gsap.set([logoOfff, logoForum], { y: "100%" });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: logoFull,
          start: "20% bottom",
          endTrigger: footer,
          end: "bottom bottom",
        },
      })
      .to(logoOfff, { y: 0, duration: 1, ease: "power3.out" }, 0)
      .to(logoForum, { y: 0, duration: 1, ease: "power3.out", delay: 0.2 }, 0);

    /* the custom smooth scroller writes to --scroll; keep ST in sync */
    window.addEventListener("scroll", function () {
      window.ScrollTrigger.update();
    });
  }

  /* ───────────────────────────── 3. Mobile drawer ───────────────────────── */
  function initHeader() {
    var header = document.getElementById("header");
    if (!header) return;
    var burger = header.querySelector(".header__burger");
    var backdrop = header.querySelector(".header__backdrop");

    function toggle(force) {
      var open = typeof force === "boolean" ? force : !header.classList.contains("open");
      header.classList.toggle("open", open);
      if (window.__smoothScroll) {
        if (open) window.__smoothScroll.stop();
      }
      document.documentElement.style.overflow = open ? "hidden" : "";
    }

    if (burger) burger.addEventListener("click", function () { toggle(); });
    if (backdrop) backdrop.addEventListener("click", function () { toggle(false); });
    header.querySelectorAll(".header__mobile-menu a").forEach(function (a) {
      a.addEventListener("click", function () { toggle(false); });
    });
  }

  /* ─────────────────────────── 4. Consent manager ───────────────────────── */
  function initConsent() {
    var root = document.getElementById("consent");
    if (!root) return;
    var simple = document.getElementById("consent-simple");
    var thorough = document.getElementById("consent-thorough");
    var KEY = "storedConsentLocale";

    function hideAll() {
      simple.classList.remove("--visible");
      thorough.classList.remove("--visible");
      setTimeout(function () {
        simple.classList.add("--hidden");
        thorough.classList.add("--hidden");
        root.classList.add("invisible");
      }, 320);
    }

    function showSimple() {
      root.classList.remove("invisible");
      thorough.classList.remove("--visible");
      simple.classList.add("--hidden");
      requestAnimationFrame(function () {
        simple.classList.remove("--hidden");
        simple.classList.add("--visible");
      });
    }

    function showThorough() {
      simple.classList.remove("--visible");
      thorough.classList.add("--hidden");
      requestAnimationFrame(function () {
        thorough.classList.remove("--hidden");
        thorough.classList.add("--visible");
      });
    }

    root.querySelectorAll("[data-consent]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var action = btn.getAttribute("data-consent");
        if (action === "manage") return showThorough();
        if (action === "back") return showSimple();

        var value =
          action === "all"
            ? { ad_storage: true, analytics_storage: true, functionality_storage: true, personalization_storage: true, security_storage: true }
            : { ad_storage: false, analytics_storage: false, functionality_storage: false, personalization_storage: false, security_storage: true };
        try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (e) { /* private mode */ }
        hideAll();
      });
    });

    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (e) { /* ignore */ }
    if (!stored) setTimeout(showSimple, 500);
    else root.classList.add("invisible");
  }

  /* ─────────────────────────── 5. Page transitions ──────────────────────── */
  function initPageTransitions() {
    var page = document.querySelector(".page");
    if (!page) return;

    function run(callback) {
      page.classList.add("page-leave-active");
      /* force a reflow so the base state is committed */
      void page.offsetWidth;
      page.classList.add("page-leave-to");
      setTimeout(function () {
        page.classList.remove("page-leave-active", "page-leave-to");
        if (callback) callback();
        page.classList.add("page-enter-active", "page-enter-from");
        void page.offsetWidth;
        page.classList.remove("page-enter-from");
        page.classList.add("page-enter-to");
        setTimeout(function () {
          page.classList.remove("page-enter-active", "page-enter-to");
        }, 1100);
      }, 1100);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || href === "#" || href === "#top") return;
      a.addEventListener("click", function (e) {
        e.preventDefault();
        if (window.__smoothScroll) window.__smoothScroll.stop();
        run();
      });
    });
  }

  /* ─────────────────────────── 6. Hero video guard ──────────────────────── */
  function initVideo() {
    var video = document.querySelector(".hero__video");
    if (!video) return;
    video.muted = true;
    var p = video.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () {
        /* autoplay blocked — the poster frame remains visible */
      });
    }
    document.addEventListener(
      "visibilitychange",
      function () {
        if (!document.hidden && video.paused) video.play().catch(function () {});
      },
      { passive: true }
    );
  }

  /* ─────────────────────────────── boot ─────────────────────────────────── */
  function boot() {
    initHeader();
    initConsent();
    initPageTransitions();
    initVideo();
    ensureGsap().then(initFooterLogo).catch(function () {
      /* no GSAP → the footer wordmark simply stays in its resting position */
      document.querySelectorAll(".logo-offf, .logo-forum").forEach(function (el) {
        el.style.transform = "";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
