/* LPAS study clone — preloader, nav, GSAP scroll animations, blob cursor */
(function () {
  "use strict";
  var hasGsap = typeof gsap !== "undefined";
  if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  /* ---------- preloader (Listen / Plan / Analyze / Shape) ---------- */
  var pre = document.getElementById("preloader");
  var words = Array.prototype.slice.call(document.querySelectorAll("#preWords span"));
  var bar = document.getElementById("preBar");
  var idx = 0;
  function cycle() {
    words.forEach(function (w) { w.classList.remove("on"); });
    if (idx < words.length) {
      words[idx].classList.add("on");
      if (bar) bar.style.transform = "scaleX(" + ((idx + 1) / (words.length + 1)) + ")";
      idx++;
      setTimeout(cycle, 380);
    } else {
      if (bar) bar.style.transform = "scaleX(1)";
      setTimeout(function () {
        pre.classList.add("done");
        document.body.classList.add("loaded");
        heroIntro();
        setTimeout(function () { pre.style.display = "none"; }, 1000);
      }, 350);
    }
  }
  // Failsafe: never trap the user
  setTimeout(function () {
    if (!pre.classList.contains("done")) { pre.classList.add("done"); pre.style.display = "none"; heroIntro(); }
  }, 4500);
  cycle();

  /* ---------- nav overlay ---------- */
  var btn = document.getElementById("menuBtn");
  var head = document.getElementById("siteHead");
  btn.addEventListener("click", function () {
    var open = document.body.classList.toggle("nav-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.querySelectorAll(".nav-overlay a").forEach(function (a) {
    a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
  });

  /* header: solid after hero, hide on scroll down */
  var lastY = 0;
  var hero = document.querySelector(".hero");
  function onScroll() {
    var y = window.scrollY || 0;
    var past = hero ? y > hero.offsetHeight - 120 : y > 300;
    head.classList.toggle("solid", past && !document.body.classList.contains("nav-open"));
    if (y > lastY && y > 500 && !document.body.classList.contains("nav-open")) head.classList.add("hide");
    else head.classList.remove("hide");
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- cursor blob on market images ---------- */
  var blob = document.getElementById("blob");
  var fine = window.matchMedia && window.matchMedia("(pointer:fine)").matches;
  if (fine) {
    document.addEventListener("mousemove", function (e) {
      blob.style.left = e.clientX + "px";
      blob.style.top = e.clientY + "px";
    });
    document.querySelectorAll("[data-blob]").forEach(function (el) {
      el.addEventListener("mouseenter", function () { blob.classList.add("show"); });
      el.addEventListener("mouseleave", function () { blob.classList.remove("show"); });
    });
  }

  document.getElementById("toTop").addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.getElementById("eyeBtn").addEventListener("click", function () {
    document.getElementById("markets").scrollIntoView({ behavior: "smooth" });
  });

  /* ---------- GSAP animations ---------- */
  function heroIntro() {
    if (!hasGsap) return;
    gsap.to(".hero .line-mask > span", { y: 0, duration: 1.1, stagger: 0.12, ease: "power4.out",
      startAt: { y: "110%" } });
    gsap.to("#heroBg", { scale: 1, duration: 1.8, ease: "power2.out" });
    gsap.fromTo("[data-hero-fade]", { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.3 });
  }
  // set initial state immediately (before preloader lifts)
  if (hasGsap) gsap.set(".hero .line-mask > span", { y: "110%" });

  if (hasGsap && typeof ScrollTrigger !== "undefined") {
    // hero parallax: bg drifts + title lifts on scroll
    gsap.to("#heroBg", { yPercent: 14, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero__inner", { yPercent: -8, opacity: 0.25, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // market bands: panel slides in, photo parallax
    document.querySelectorAll(".market").forEach(function (m) {
      gsap.fromTo(m.querySelector(".market__panel"),
        { xPercent: -6, opacity: 0.4 }, { xPercent: 0, opacity: 1, ease: "none",
          scrollTrigger: { trigger: m, start: "top 92%", end: "top 45%", scrub: true } });
      var img = m.querySelector(".market__img img");
      gsap.fromTo(img, { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1.15, ease: "none",
        scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true } });
    });

    // generic reveals
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" } });
    });

    // project image de-zoom on enter
    document.querySelectorAll(".proj__img img").forEach(function (img) {
      gsap.to(img, { scale: 1, duration: 1.2, ease: "power2.out",
        scrollTrigger: { trigger: img, start: "top 85%" } });
    });

    // footer backdrop scale
    gsap.fromTo("#footerBg", { scale: 1.35 }, { scale: 1, ease: "none",
      scrollTrigger: { trigger: ".footer__hero", start: "top bottom", end: "center center", scrub: true } });
  } else {
    // no-GSAP fallback: show everything
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = 1; el.style.transform = "none";
    });
  }

  /* split intro title into animated words (progressive enhancement) */
  var t = document.getElementById("introTitle");
  if (t && hasGsap && typeof ScrollTrigger !== "undefined") {
    var parts = t.textContent.trim().split(/\s+/);
    t.innerHTML = parts.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    gsap.fromTo("#introTitle .w", { opacity: 0.12 }, { opacity: 1, stagger: 0.06, ease: "none",
      scrollTrigger: { trigger: t, start: "top 80%", end: "bottom 45%", scrub: true } });
  }
})();
