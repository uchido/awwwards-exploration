/* Heron AI clone — interactions (GSAP + vanilla) */
(function () {
  "use strict";
  var hasGsap = typeof gsap !== "undefined";
  if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  /* ---------- loader ---------- */
  var tasks = ["001 Initialize core system","002 Load AI models","003 Configure data pipelines","004 Sync distributed nodes","005 Validate input streams","006 Optimize inference engine","007 Deploy test environment","008 Enable real-time processing","009 Run diagnostics","010 Start execution"];
  var pct = document.getElementById("loadPct"), bar = document.getElementById("loadBar"),
      task = document.getElementById("loadTask"), loader = document.getElementById("loader");
  var p = 0, ti = 0;
  var tick = setInterval(function () {
    p = Math.min(100, p + Math.random() * 14 + 4);
    if (pct) pct.textContent = Math.floor(p) + "%";
    if (bar) bar.style.transform = "scaleX(" + p / 100 + ")";
    if (task && Math.floor(p / 10) > ti && tasks[ti + 1]) { ti++; task.textContent = tasks[ti]; }
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(function () {
        loader.classList.add("done");
        heroIntro();
      }, 350);
    }
  }, 140);

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn"), nav = document.getElementById("nav");
  menuBtn.addEventListener("click", function () { nav.classList.toggle("open"); });

  /* ---------- cookie ---------- */
  var cookie = document.getElementById("cookie");
  document.getElementById("cookieOk").addEventListener("click", function () { cookie.classList.add("hide"); });

  /* ---------- hero intro ---------- */
  function heroIntro() {
    if (!hasGsap) return;
    gsap.from("[data-hero]", { scale: 0.94, opacity: 0, duration: 1.4, ease: "power3.out" });
    gsap.from("[data-lines]", { y: 60, opacity: 0, duration: 1.1, ease: "power3.out", delay: 0.15 });
  }

  /* ---------- scroll reveals ---------- */
  if (hasGsap && typeof ScrollTrigger !== "undefined") {
    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });
    /* hero image parallax */
    gsap.to("[data-hero]", {
      y: -60, ease: "none",
      scrollTrigger: { trigger: ".hero-stage", start: "top bottom", end: "bottom top", scrub: 1 }
    });
    /* headline scrub like original blueprint pin */
    gsap.to(".hero-title h1", {
      y: -20, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
  }

  /* ---------- header hide on scroll ---------- */
  var head = document.getElementById("siteHead"), lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    head.style.transform = y > 400 && y > lastY ? "translateY(-100%)" : "translateY(0)";
    head.style.transition = "transform .4s ease";
    lastY = y;
  }, { passive: true });

  /* ---------- violations widget ---------- */
  var data = [
    { code: "IBC 1015.3 — Guardrail required.", txt: "Low sill detected on level 02. Heron suggests adding a 42″ guard. Approve to apply the edit directly in your model.", img: "assets/solution-chat.jpg" },
    { code: "IBC 1011.11 — Handrails required.", txt: "Stair run missing continuous handrail. Heron proposes a code-compliant rail on both sides.", img: "assets/solution-dash.avif" },
    { code: "IBC 1017.2 — Exit travel distance.", txt: "Assembly layout exceeds the 75 ft limit without sprinklers. Heron redraws the exit path to comply.", img: "assets/og.jpg" },
    { code: "A117.1 §604 — Toilet clearance.", txt: "Restroom lacks a 60″ turning radius. Heron suggests shifting the partition 6″ to clear.", img: "assets/usecase-arch.jpg" }
  ];
  var tabs = document.querySelectorAll(".viol-tab");
  var vImg = document.getElementById("violImg"), vCode = document.getElementById("violCode"), vTxt = document.getElementById("violTxt");
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      var d = data[+t.dataset.i];
      if (hasGsap) gsap.fromTo(vImg, { opacity: 0.2, scale: 0.99 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
      vImg.src = d.img; vCode.textContent = d.code; vTxt.textContent = d.txt;
    });
  });
  document.getElementById("approveBtn").addEventListener("click", function () {
    vTxt.textContent = "Approved ✓ — edit applied in your model (demo).";
    if (hasGsap) gsap.fromTo("#violAlert", { backgroundColor: "#fff" }, { backgroundColor: "#e8f3e4", duration: 0.5 });
  });
  document.getElementById("dismissBtn").addEventListener("click", function () {
    vTxt.textContent = "Dismissed — Heron will keep watching quietly.";
  });

  /* ---------- hero drag-to-reveal (mirrors original hint) ---------- */
  var hero = document.querySelector("[data-hero]"), dragging = false, sx = 0;
  if (hero) {
    hero.style.cursor = "grab";
    hero.addEventListener("pointerdown", function (e) { dragging = true; sx = e.clientX; hero.style.cursor = "grabbing"; });
    window.addEventListener("pointerup", function () { dragging = false; if (hero) hero.style.cursor = "grab"; });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = Math.max(-30, Math.min(30, (e.clientX - sx) / 10));
      hero.style.transform = "translateX(" + dx + "px) scale(1.01)";
      hero.style.filter = "grayscale(0.2) contrast(1.05)";
    });
  }
})();
