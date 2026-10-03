/* Colonia Zacamil — static clone interactions (vanilla + GSAP) */
(function(){
  "use strict";
  gsap.registerPlugin(ScrollTrigger);

  var body = document.body;
  var lang = "en";
  var exploring = false;
  var night = false, past = false;

  /* ---------- Build pins ---------- */
  var pinsEl = document.getElementById("pins");
  var PINS = window.ZACAMIL_PINS || [];
  var pinEls = [];
  var svgDot = '<svg width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="1.6" stroke-width="2" stroke="#EBE6E0" fill="none"/><circle cx="18" cy="18" r="16" stroke-width="1" stroke="#EBE6E0" fill="none"/></svg>';
  var svgDia = '<svg width="36" height="36" viewBox="0 0 36 36"><path d="M18 8 26 18 18 28 10 18Z" fill="#545454"/></svg>';

  PINS.forEach(function(p, i){
    var el = document.createElement("div");
    el.className = "pin" + (p.dim ? " dim" : "");
    el.style.left = p.x + "%";
    el.style.top = p.y + "%";
    el.style.setProperty("--color", p.color || "#B48E46");
    el.setAttribute("data-title", p.title);
    el.innerHTML = "<div>" + (p.dim ? svgDia : svgDot) + "<span>" + p.title + "</span></div>";
    if (!p.dim) {
      el.addEventListener("click", function(ev){ ev.stopPropagation(); openDetail(i); });
      el.addEventListener("mouseenter", function(){ cursorBig(true); });
      el.addEventListener("mouseleave", function(){ cursorBig(false); });
    }
    pinsEl.appendChild(el);
    pinEls.push(el);
  });

  /* ---------- Stories grid ---------- */
  var grid = document.getElementById("storiesGrid");
  PINS.filter(function(p){ return !p.dim; }).forEach(function(p, i){
    var card = document.createElement("article");
    card.className = "story-card";
    // varied crop of the same aerial photo as placeholder, matching dimensions
    card.innerHTML =
      '<div class="img-w"><img loading="lazy" src="assets/images/background.jpg" alt="' + p.title + '" style="object-position:' + p.x + '% ' + p.y + '%"></div>' +
      '<div class="txt"><h3>' + p.title + "</h3><p>Mural — " + String(i+1).padStart(2,"0") + " · Zacamil</p></div>";
    card.addEventListener("click", function(){
      if (!exploring) enterExplore(true);
      openDetail(i);
      document.getElementById("map").scrollIntoView({behavior:"smooth", block:"center"});
    });
    grid.appendChild(card);
  });

  /* ---------- Preloader (fake progress, GSAP) ---------- */
  var pre = document.getElementById("preloader");
  var preCount = document.getElementById("preCount");
  var preBar = document.getElementById("preBar");
  body.classList.add("locked");
  var prog = { v: 0 };
  var introTl = gsap.timeline();

  gsap.to(prog, {
    v: 100, duration: 1.6, ease: "power2.inOut",
    onUpdate: function(){
      var n = Math.round(prog.v);
      preCount.textContent = (n < 10 ? "0" : "") + n;
      preBar.style.width = n + "%";
    },
    onComplete: revealSite
  });
  gsap.to("#preloader .pre-bg img", { scale: 1.18, duration: 1.8, ease: "power1.out" });

  function revealSite(){
    gsap.set(".hero-word .w-split", { yPercent: 110 });
    introTl
      .to("#preloader .pre-inner", { yPercent: -30, opacity: 0, duration: .5, ease: "power2.in" })
      .to("#preloader", {
        clipPath: "inset(38% 30% 38% 30% round 24px)", duration: 1.1, ease: "power4.inOut",
        onComplete: function(){ pre.style.display = "none"; body.classList.remove("locked"); }
      }, "-=.1")
      .to(".hero-word .w-split", { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: .09 }, "-=.9")
      .to("#heroPill", { scaleX: 1, duration: 1.2, ease: "expo.out" }, "-=1")
      .from("#pillImg img", { scale: 1.6, duration: 1.6, ease: "expo.out" }, "<")
      .from("#discover", { y: 30, opacity: 0, duration: .8, ease: "power3.out" }, "-=.8")
      .from(".hero-desc, .hero-hint, #siteFooter", { opacity: 0, y: 14, duration: .7, stagger: .08 }, "-=.6");
  }

  /* ---------- Custom cursor ---------- */
  var cursor = document.getElementById("cursor");
  var cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy, big = false;
  addEventListener("mousemove", function(e){ tx = e.clientX; ty = e.clientY; });
  (function loop(){
    cx += (tx - cx) * .16; cy += (ty - cy) * .16;
    cursor.style.transform = "translate(" + cx + "px," + cy + "px) scale(" + (big ? 1.6 : 1) + ")";
    requestAnimationFrame(loop);
  })();
  function cursorBig(v){ big = v; }

  /* ---------- Discover / explore ---------- */
  var discoverBtn = document.getElementById("discover");
  var tutorial = document.getElementById("tutorial");
  discoverBtn.addEventListener("click", function(){
    discoverBtn.classList.add("clicked");
    if (!exploring) { tutorial.classList.add("open"); }
    else { exitExplore(); }
  });
  document.getElementById("tutClose").addEventListener("click", function(){
    tutorial.classList.remove("open");
    enterExplore(false);
  });

  var pill = document.getElementById("heroPill");
  var mapInner = document.getElementById("mapInner");

  function enterExplore(instant){
    exploring = true;
    body.classList.add("exploring");
    discoverBtn.querySelector("span").textContent = "Close ✕";
    var tl = gsap.timeline();
    tl.to("#wordLeft", { xPercent: -30, opacity: 0, duration: .8, ease: "power3.inOut" }, 0)
      .to("#wordRight", { xPercent: 30, opacity: 0, duration: .8, ease: "power3.inOut" }, 0)
      .to("#discover", { y: 0, duration: .5 }, 0)
      .to(pill, {
        width: "94vw", aspectRatio: "16/8.2", duration: 1.1, ease: "expo.inOut",
        onUpdate: function(){ ScrollTrigger.refresh(); }
      }, .1)
      .fromTo(pinEls.filter(function(e){return !e.classList.contains("dim");}),
        { scale: .4, opacity: 0 },
        { scale: 1, opacity: 1, duration: .7, stagger: { each: .04, from: "random" }, ease: "back.out(1.6)",
          onStart: function(){ pinEls.forEach(function(e){ e.style.opacity = 1; }); } }, "-=.4");
    gsap.to(mapInner, { scale: zoom, x: panX, y: panY, duration: .6 });
  }

  function exitExplore(){
    exploring = false;
    body.classList.remove("exploring");
    discoverBtn.classList.remove("clicked");
    discoverBtn.querySelector("span").textContent = window.ZACAMIL_I18N[lang].discover;
    closeDetail();
    gsap.timeline()
      .to(pill, { width: "", aspectRatio: "", duration: 1, ease: "expo.inOut" })
      .to("#wordLeft, #wordRight", { xPercent: 0, opacity: 1, duration: .9, ease: "power3.out" }, "-=.7");
  }

  /* ---------- Map pan / zoom (drag + wheel + touch) ---------- */
  var zoom = 1, panX = 0, panY = 0, dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
  var map = document.getElementById("map");
  map.addEventListener("pointerdown", function(e){
    if (!exploring) return;
    dragging = true; sx = e.clientX; sy = e.clientY; ox = panX; oy = panY;
    map.setPointerCapture(e.pointerId); map.style.cursor = "grabbing";
  });
  map.addEventListener("pointermove", function(e){
    if (!dragging) return;
    panX = clamp(ox + (e.clientX - sx), -260*zoom, 260*zoom);
    panY = clamp(oy + (e.clientY - sy), -140*zoom, 140*zoom);
    applyMap();
  });
  ["pointerup","pointercancel","pointerleave"].forEach(function(ev){
    map.addEventListener(ev, function(){ dragging = false; map.style.cursor = "grab"; });
  });
  map.addEventListener("wheel", function(e){
    if (!exploring) return;
    e.preventDefault();
    zoom = clamp(zoom + (e.deltaY < 0 ? .15 : -.15), 1, 2.6);
    applyMap();
  }, { passive: false });
  // touch pinch
  var pinchD = 0;
  map.addEventListener("touchmove", function(e){
    if (e.touches.length === 2) {
      e.preventDefault();
      var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      if (pinchD) zoom = clamp(zoom + (d - pinchD) * .004, 1, 2.6);
      pinchD = d; applyMap();
    }
  }, { passive: false });
  map.addEventListener("touchend", function(){ pinchD = 0; });
  function applyMap(){ gsap.to(mapInner, { scale: zoom, x: panX, y: panY, duration: .35, ease: "power2.out", overwrite: "auto" }); }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  /* ---------- Detail drawer ---------- */
  var detail = document.getElementById("detail");
  function openDetail(i){
    var p = PINS.filter(function(x){return !x.dim;})[i];
    if (!p) return;
    document.getElementById("detailKicker").textContent = "Mural — " + String(i+1).padStart(2,"0");
    document.getElementById("detailTitle").textContent = p.title;
    document.getElementById("detailText").textContent = p.text;
    document.getElementById("detailEra").textContent = past ? "[past]" : "[present]";
    detail.classList.add("open");
    detail.setAttribute("aria-hidden", "false");
    // focus the matching pin
    pinEls.forEach(function(e){ e.style.zIndex = (e.getAttribute("data-title") === p.title) ? 6 : ""; });
    gsap.fromTo(detail, { x: 80, rotate: 2 }, { x: 0, rotate: 0, duration: .7, ease: "expo.out" });
  }
  function closeDetail(){ detail.classList.remove("open"); detail.setAttribute("aria-hidden", "true"); }
  document.getElementById("detailClose").addEventListener("click", closeDetail);
  addEventListener("keydown", function(e){ if (e.key === "Escape"){ closeDetail(); tutorial.classList.remove("open"); } });

  /* ---------- Mode toggles ---------- */
  document.getElementById("dayNight").addEventListener("click", function(){
    night = !night; body.classList.toggle("night", night);
    gsap.fromTo("#mapImg", { opacity: .4 }, { opacity: 1, duration: .8 });
  });
  document.getElementById("eraChip").addEventListener("click", function(){
    past = !past; body.classList.toggle("past", past);
    document.getElementById("eraLabel").textContent = past ? "[past]" : "[present]";
    gsap.fromTo("#mapImg", { filter: "grayscale(1)" }, { filter: "grayscale(0)", duration: .1 });
  });

  /* ---------- Language ---------- */
  document.querySelectorAll(".lang").forEach(function(btn){
    btn.addEventListener("click", function(){
      lang = btn.getAttribute("data-lang");
      document.querySelectorAll(".lang").forEach(function(b){ b.classList.toggle("active", b === btn); });
      var d = window.ZACAMIL_I18N[lang];
      document.querySelector("[data-i18n='discover']").textContent = exploring ? "Close ✕" : d.discover;
      document.querySelector("[data-i18n='tagline']").textContent = d.tagline;
      document.getElementById("wordLeft").innerHTML = d.flyTo.map(function(w){ return '<span class="w-split" style="transform:none">' + w + "</span>"; }).join('<span class="w-split ghost" style="transform:none">&nbsp;</span>');
      document.getElementById("tutClose").textContent = d.start;
      document.documentElement.lang = lang;
    });
  });

  /* ---------- Scroll effects (ScrollTrigger) ---------- */
  gsap.to("#pillImg img", {
    yPercent: 10, ease: "none",
    scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
  });
  ScrollTrigger.batch(".story-card", {
    start: "top 88%",
    onEnter: function(els){ gsap.to(els, { y: 0, opacity: 1, duration: .9, stagger: .08, ease: "power3.out", overwrite: true }); }
  });
  gsap.from(".stories-title", {
    yPercent: 30, opacity: 0, duration: 1, ease: "power3.out",
    scrollTrigger: { trigger: ".stories-head", start: "top 85%" }
  });
  document.getElementById("backTop").addEventListener("click", function(){
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Subtle hero parallax on mouse ---------- */
  document.getElementById("hero").addEventListener("mousemove", function(e){
    if (exploring) return;
    var dx = (e.clientX / innerWidth - .5), dy = (e.clientY / innerHeight - .5);
    gsap.to("#heroTitle", { x: dx * 18, y: dy * 12, duration: .8, ease: "power2.out", overwrite: "auto" });
  });
})();
