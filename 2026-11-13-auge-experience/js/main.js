/* ============================================================
   AUGE Experience — static clone
   Recreates the original's GSAP-driven behaviours:
   loader + arc reveal, infinite virtual-scroll carousel,
   text scramble decode, reveal animations, expanding menu,
   custom diamond cursor, letter-push hover, sound toggle.
   ============================================================ */

(function () {
  "use strict";

  if (window.gsap) gsap.registerPlugin(window.ScrollTrigger);

  /* ------------------------------------------------------------
     Data (from the original Prismic payload)
  ------------------------------------------------------------ */
  const PROJECTS = [
    { slug: "viru-group",     lines: ["Viru", "Group"],          category: "Website",      img: "assets/img/viru.jpg" },
    { slug: "maison-auge",    lines: ["Maison", "AUGE"],         category: "Website",      img: "assets/img/maison.jpg" },
    { slug: "ac40-lunarossa", lines: ["AC40", "Lunarossa"],      category: "Installation", img: "assets/img/lunarossa.jpg" },
    { slug: "don-molinico",   lines: ["Don", "Molinico"],        category: "Website",      img: "assets/img/don-molinico.jpg" },
    { slug: "mr-mold",        lines: ["Mr. Mold"],               category: "Website",      img: "assets/img/mr-mold.jpg" },
    { slug: "il-capo",        lines: ["Il Capo", "Production"],  category: "Website",      img: "assets/img/il-capo.jpg" },
    { slug: "maxima",         lines: ["Maxima", "Ferrarelle"],   category: "Installation", img: "assets/img/maxima.jpg" }
  ];

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (finePointer) document.documentElement.classList.add("fine-pointer");

  /* ------------------------------------------------------------
     Build carousel cards (7 projects x2 for the seamless loop)
  ------------------------------------------------------------ */
  const track = document.getElementById("track");
  const CARD_COUNT = PROJECTS.length * 2;
  const cards = [];

  for (let i = 0; i < CARD_COUNT; i++) {
    const p = PROJECTS[i % PROJECTS.length];
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.slug = p.slug;
    card.setAttribute("aria-hidden", i >= PROJECTS.length ? "true" : "false");

    const clip = document.createElement("div");
    clip.className = "card-clip";
    const img = document.createElement("img");
    img.className = "card-img";
    img.src = p.img;
    img.alt = "";
    img.draggable = false;
    clip.appendChild(img);

    const caption = document.createElement("div");
    caption.className = "card-caption";
    const title = document.createElement("h3");
    title.className = "card-title";
    p.lines.forEach((line) => {
      const row = document.createElement("div");
      row.className = "card-line";
      const span = document.createElement("span");
      span.textContent = line;
      row.appendChild(span);
      title.appendChild(row);
    });
    const cat = document.createElement("div");
    cat.className = "card-category";
    const catSpan = document.createElement("span");
    catSpan.textContent = p.category;
    cat.appendChild(catSpan);
    caption.appendChild(title);
    caption.appendChild(cat);

    card.appendChild(clip);
    card.appendChild(caption);
    track.appendChild(card);
    cards.push({ el: card, img: img });
  }

  /* ------------------------------------------------------------
     Infinite virtual-scroll carousel (wheel + drag + inertia)
  ------------------------------------------------------------ */
  const carousel = {
    pos: 0,
    target: 0,
    vel: 0,
    cardW: 0,
    trackW: 0,
    dragging: false,
    lastX: 0,
    dragVel: 0
  };

  function measure() {
    carousel.cardW = cards[0].el.offsetWidth || window.innerWidth * 0.29;
    carousel.trackW = PROJECTS.length * carousel.cardW;
    layout(true);
  }

  function layout(snap) {
    const wrapW = carousel.trackW;
    const buffer = carousel.cardW * 1.5;
    const vw = window.innerWidth;
    for (let i = 0; i < CARD_COUNT; i++) {
      let x = ((i * carousel.cardW + carousel.pos) % wrapW + wrapW) % wrapW;
      if (x > vw + buffer) x -= wrapW;
      if (x < -buffer) x += wrapW;
      cards[i].el.style.transform = "translate3d(" + x + "px,0,0)";
      cards[i].el.style.visibility = x > vw + buffer || x < -buffer ? "hidden" : "visible";
    }
    if (snap) carousel.target = carousel.pos;
  }

  function tick() {
    if (!carousel.dragging) {
      carousel.target += carousel.dragVel;
      carousel.dragVel *= 0.94;
      if (Math.abs(carousel.dragVel) < 0.02) carousel.dragVel = 0;
    }
    const prev = carousel.pos;
    carousel.pos += (carousel.target - carousel.pos) * 0.09;
    carousel.vel = carousel.pos - prev;

    // wrap into [0, trackW)
    if (carousel.pos >= carousel.trackW) { carousel.pos -= carousel.trackW; carousel.target -= carousel.trackW; }
    if (carousel.pos < 0) { carousel.pos += carousel.trackW; carousel.target += carousel.trackW; }

    layout();

    const skew = gsap.utils.clamp(-6, 6, carousel.vel * 0.02);
    const par = gsap.utils.clamp(-24, 24, carousel.vel * -0.35);
    for (let i = 0; i < CARD_COUNT; i++) {
      cards[i].img.style.transform = "translate3d(" + par + "px,0,0) scale(1.1)";
    }
    track.style.transform = "skewX(" + skew + "deg)";
  }

  window.addEventListener("wheel", (e) => {
    e.preventDefault();
    carousel.target += e.deltaY * 1.1;
  }, { passive: false });

  window.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".menu, .legal, .socials, a, button")) return;
    carousel.dragging = true;
    carousel.lastX = e.clientX;
  });

  window.addEventListener("pointermove", (e) => {
    if (!carousel.dragging) return;
    const dx = e.clientX - carousel.lastX;
    carousel.lastX = e.clientX;
    carousel.target -= dx * 1.6;
    carousel.dragVel = -dx * 0.28;
  });

  window.addEventListener("pointerup", () => { carousel.dragging = false; });
  window.addEventListener("pointercancel", () => { carousel.dragging = false; });

  window.addEventListener("resize", measure);
  measure();

  /* ------------------------------------------------------------
     Text scramble decode ("RCCS YFZVYTYHHV©" -> "AUGE EXPERIENCE©")
  ------------------------------------------------------------ */
  const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ@#%&*+=<>/\\";
  function scramble(el, finalText, duration) {
    const start = el.textContent;
    const len = Math.max(start.length, finalText.length);
    const obj = { p: 0 };
    return gsap.to(obj, {
      p: 1,
      duration: duration,
      ease: "power2.inOut",
      onUpdate() {
        let out = "";
        for (let i = 0; i < len; i++) {
          const a = start[i] || "";
          const b = finalText[i] || "";
          if (a === b) { out += b; continue; }
          const reveal = i / len < obj.p;
          if (reveal) out += b;
          else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
      },
      onComplete() { el.textContent = finalText; }
    });
  }

  /* ------------------------------------------------------------
     Sound toggle
  ------------------------------------------------------------ */
  const soundBtn = document.querySelector(".sound-btn");
  const wave = document.querySelector("[data-sound-wave]");
  const cross = document.querySelector("[data-sound-cross]");
  let muted = true;
  soundBtn.addEventListener("click", () => {
    muted = !muted;
    soundBtn.setAttribute("aria-pressed", String(!muted));
    soundBtn.setAttribute("aria-label", muted ? "Unmute sound" : "Mute sound");
    wave.style.display = muted ? "none" : "";
    cross.style.display = muted ? "" : "none";
  });

  /* ------------------------------------------------------------
     Expanding menu
  ------------------------------------------------------------ */
  const menu = document.getElementById("menu");
  const panel = menu.querySelector("[data-menu-panel]");
  const nav = menu.querySelector("[data-menu-nav]");
  const openBtn = menu.querySelector("[data-menu-open]");
  const closeBtn = menu.querySelector("[data-menu-close]");
  const links = menu.querySelectorAll("[data-menu-link] span");
  let menuOpen = false;
  let menuTween = null;

  function navSize() {
    const w = nav.scrollWidth + 20;
    const h = nav.scrollHeight;
    return { w: Math.max(w, 60), h: Math.max(h, 40) };
  }

  function toggleMenu(open) {
    if (menuOpen === open) return;
    menuOpen = open;
    menu.classList.toggle("is-open", open);
    openBtn.setAttribute("aria-expanded", String(open));
    if (menuTween) menuTween.kill();

    if (open) {
      const { w, h } = navSize();
      nav.style.visibility = "visible";
      gsap.set(panel, { width: 60, height: 40 });
      menuTween = gsap.timeline()
        .to(panel, { width: w, height: h, duration: 0.7, ease: "expo.inOut" })
        .to(closeBtn, { autoAlpha: 1, duration: 0.3 }, 0.25)
        .to(links, { y: 0, duration: 0.7, ease: "expo.out", stagger: 0.06 }, 0.3);
    } else {
      menuTween = gsap.timeline()
        .to(links, { y: "110%", duration: 0.4, ease: "power3.in", stagger: 0.03 })
        .to(closeBtn, { autoAlpha: 0, duration: 0.2 }, 0)
        .to(panel, { width: 60, height: 40, duration: 0.6, ease: "expo.inOut" }, 0.15)
        .set(nav, { visibility: "hidden" });
    }
  }

  openBtn.addEventListener("click", () => toggleMenu(true));
  closeBtn.addEventListener("click", () => toggleMenu(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleMenu(false); });

  /* ------------------------------------------------------------
     Custom diamond cursor
  ------------------------------------------------------------ */
  const cursor = document.querySelector("[data-cursor]");
  if (finePointer) {
    const cx = gsap.quickTo(cursor, "x", { duration: 0.25, ease: "power3" });
    const cy = gsap.quickTo(cursor, "y", { duration: 0.25, ease: "power3" });
    window.addEventListener("pointermove", (e) => {
      gsap.to(cursor, { opacity: 1, duration: 0.2, overwrite: "auto" });
      cx(e.clientX); cy(e.clientY);
    });
    document.addEventListener("mouseleave", () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
    document.addEventListener("mouseenter", () => gsap.to(cursor, { opacity: 1, duration: 0.3 }));

    document.querySelectorAll(".card, a, button").forEach((t) => {
      t.addEventListener("mouseenter", () => gsap.to(cursor.querySelector(".cursor-diamond"), { scale: 2.4, duration: 0.35, ease: "power3.out" }));
      t.addEventListener("mouseleave", () => gsap.to(cursor.querySelector(".cursor-diamond"), { scale: 1, duration: 0.35, ease: "power3.out" }));
    });
  }

  /* ------------------------------------------------------------
     Wordmark letter-push hover
  ------------------------------------------------------------ */
  document.querySelectorAll("[data-letter-push]").forEach((l) => {
    l.addEventListener("mouseenter", () => {
      gsap.fromTo(l, { yPercent: 0 }, { yPercent: -9, duration: 0.25, ease: "power2.out", overwrite: true,
        onComplete: () => gsap.to(l, { yPercent: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" }) });
    });
  });

  /* ------------------------------------------------------------
     Intro sequence: loader percent -> arc reveal -> content
  ------------------------------------------------------------ */
  function intro() {
    const percent = document.querySelector("[data-loader-percent]");
    const counter = { p: 0 };

    const tl = gsap.timeline();
    tl.to("[data-loader-backdrop]", { scale: 1.001, duration: 0.1 }) // force layer
      // percent counter
      .to(counter, {
        p: 100, duration: reduceMotion ? 0.2 : 1.5, ease: "power2.inOut",
        onUpdate: () => { percent.textContent = String(Math.round(counter.p)).padStart(3, "0"); }
      }, 0)
      .to(percent.parentElement, { opacity: 1, duration: 0.3 }, 0)
      // loader lines in
      .to(".loader-line > span", { y: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.1)
      .to(".loader-bottom", { opacity: 1, duration: 0.3 }, 0.2)
      // hold, then arc-wipe reveal
      .to(".loader-line > span", { y: "-110%", duration: 0.7, ease: "expo.in", stagger: 0.06 }, 1.7)
      .to(percent.parentElement, { opacity: 0, duration: 0.3 }, 1.7)
      .to("[data-loader-backdrop]", {
        scale: 30, transformOrigin: "50% 50%", duration: 1.3, ease: "expo.inOut"
      }, 1.9)
      .set(".loader", { display: "none" }, 3.2)
      // content reveals
      .to(".card-line span", { y: 0, duration: 1, ease: "expo.out", stagger: { each: 0.05, from: "start" } }, 2.35)
      .to(".card-category span", { y: 0, duration: 1, ease: "expo.out", stagger: 0.05 }, 2.5)
      .from(".card-clip", { scale: 1.18, duration: 1.6, ease: "expo.out", clearProps: "scale,transform" }, 2.35)
      .to(".pitch-title .clip-inner", { y: 0, duration: 0.9, ease: "expo.out" }, 2.55)
      .add(() => {
        const el = document.querySelector("[data-scramble]");
        scramble(el, el.dataset.text, 1.2);
      }, 2.55)
      .to(".pitch-text", { y: 0, opacity: 1, duration: 1, ease: "expo.out" }, 2.75)
      .from(".wordmark-letter", { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.07 }, 2.6);

    // loop the carousel
    gsap.ticker.add(tick);
  }

  if (document.readyState === "complete") intro();
  else window.addEventListener("load", intro);

  /* Make project cards keyboard-focusable links (original links to /works) */
  cards.forEach(({ el }, i) => {
    if (i < PROJECTS.length) {
      el.tabIndex = 0;
      el.setAttribute("role", "link");
      el.setAttribute("aria-label", PROJECTS[i].lines.join(" ") + " — " + PROJECTS[i].category);
    }
  });
})();
