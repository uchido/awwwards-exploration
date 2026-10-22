/* ============================================================
   Ascension — Pegassi | static clone behaviour
   Vanilla JS + GSAP/ScrollTrigger (CDN) + Lenis (CDN, optional)
   ============================================================ */
(function () {
  "use strict";

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var hasGsap = !!gsap;
  if (hasGsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     Custom eases: read the site's CSS linear() easings and
     register them with GSAP so timelines match the original.
     --------------------------------------------------------- */
  function registerLinearEase(name, cssValue) {
    if (!hasGsap || !cssValue) return;
    var m = /linear\(([^)]+)\)/.exec(cssValue);
    if (!m) return;
    var pts = m[1].split(",").map(function (v) {
      return parseFloat(v);
    });
    if (pts.length < 2) return;
    gsap.registerEase(name, function (p) {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      var x = p * (pts.length - 1);
      var i = Math.min(pts.length - 2, Math.floor(x));
      var f = x - i;
      return pts[i] + (pts[i + 1] - pts[i]) * f;
    });
  }
  if (hasGsap) {
    var cs = getComputedStyle(document.documentElement);
    registerLinearEase("reveal", cs.getPropertyValue("--ease-reveal"));
    registerLinearEase("snappy", cs.getPropertyValue("--ease-snappy"));
    registerLinearEase("flip", cs.getPropertyValue("--ease-flip"));
  }

  /* ---------------------------------------------------------
     Grain
     --------------------------------------------------------- */
  (function grain() {
    var img = new Image();
    function ready() {
      document.documentElement.classList.add("grain-ready");
    }
    img.onload = ready;
    img.onerror = ready;
    img.src = "assets/noise-2.png";
    if (img.complete) ready();
  })();

  /* ---------------------------------------------------------
     Smooth scroll (Lenis)
     --------------------------------------------------------- */
  var lenis = null;
  function setupLenis() {
    if (reduced || !window.Lenis) return;
    lenis = new window.Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false
    });
    if (hasGsap && ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* ---------------------------------------------------------
     Line reveals (js-animate-lines)
     --------------------------------------------------------- */
  var revealer = null;
  function setupReveals() {
    if (!hasGsap || !window.AscensionSplit || reduced) return;
    revealer = new window.AscensionSplit.LineRevealer();
    revealer.split(document);
  }

  /* ---------------------------------------------------------
     Hero slide-ups (js-slide-up)
     --------------------------------------------------------- */
  var slideEls = [];
  function setupSlideUps() {
    slideEls = $$(".js-slide-up");
    if (!hasGsap || reduced || !slideEls.length) return;
    gsap.set(slideEls, { yPercent: 110 });
  }
  function playSlideUps(delay) {
    if (!hasGsap || reduced || !slideEls.length) return;
    gsap.to(slideEls, {
      yPercent: 0,
      duration: 1.25,
      ease: "expo.out",
      stagger: 0.1,
      delay: delay || 0
    });
  }

  /* ---------------------------------------------------------
     Hero parallax (wordmark drift + stairs scroll/fade)
     --------------------------------------------------------- */
  function setupHero() {
    if (!hasGsap || !ScrollTrigger || reduced) return;
    var wordmark = $("[data-wordmark]");
    var stairs = $("[data-stairs]");
    var hero = $(".hero");
    var tracklist = $("[data-tracklist]");
    if (!wordmark || !stairs || !hero) return;

    var state = { p: 0, o: 1 };
    var apply = function () {
      gsap.set(stairs, {
        y: stairs.offsetHeight * 0.4 * state.p,
        opacity: state.o
      });
    };

    ScrollTrigger.create({
      trigger: wordmark,
      start: "clamp(top bottom)",
      end: "clamp(bottom top)",
      onUpdate: function (self) {
        gsap.set(wordmark, {
          y: wordmark.offsetHeight * 0.12 * self.progress
        });
      }
    });

    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      onUpdate: function (self) {
        state.p = self.progress;
        apply();
      }
    });

    if (tracklist) {
      ScrollTrigger.create({
        trigger: tracklist,
        start: "top bottom",
        end: "top top",
        onUpdate: function (self) {
          state.o = Math.pow(1 - self.progress, 2);
          apply();
        }
      });
    }
  }

  /* ---------------------------------------------------------
     Section video clips
     --------------------------------------------------------- */
  function setupClips() {
    var clips = $$("[data-clip]");
    if (!clips.length) return;
    clips.forEach(function (clip) {
      var video = clip.querySelector("video");
      var still = clip.querySelector("[data-clip-still]");
      if (!video) return;
      if (reduced) return;
      var io = new IntersectionObserver(
        function (records) {
          records.forEach(function (rec) {
            if (rec.isIntersecting) {
              video.play().then(
                function () {
                  if (still) still.style.opacity = "0";
                },
                function () {}
              );
            } else {
              video.pause();
              if (still) still.style.opacity = "1";
            }
          });
        },
        { threshold: 0.12 }
      );
      io.observe(clip);
    });
  }

  /* ---------------------------------------------------------
     Track cues (hover video preview + audio ducking)
     --------------------------------------------------------- */
  var CUE_MAP = {
    A1: "home-ascension1",
    A2: "home-circles2",
    B1: "home-forestwalk2",
    B2: "home-twinflame1"
  };

  function setupCues(player) {
    var root = $("[data-tracklist]");
    var panel = $("[data-cue-panel]");
    var video = $("[data-cue-video]");
    var bar = $("[data-cue-bar]");
    if (!root || !panel || !video) return;

    var current = null;
    var vol = { v: 0 };
    var lastY = window.scrollY;
    var scrolling = false;
    var scrollTimer = 0;

    /* preload stills like the original */
    if (finePointer) {
      Object.keys(CUE_MAP).forEach(function (key) {
        var img = new Image();
        img.src = "assets/videos/" + CUE_MAP[key] + ".webp";
      });
    }

    function fadeVolume(target, duration, onComplete) {
      if (!hasGsap) {
        video.volume = target;
        if (onComplete) onComplete();
        return;
      }
      gsap.killTweensOf(vol);
      gsap.to(vol, {
        v: target,
        duration: duration,
        ease: "none",
        onUpdate: function () {
          video.volume = vol.v;
        },
        onComplete: onComplete
      });
    }

    function showCue(key) {
      if (!finePointer || scrolling) return;
      if (current === key) return;
      if (!CUE_MAP[key]) return;
      current = key;
      root.classList.add("cued");
      $$("[data-cue]", root).forEach(function (el) {
        el.classList.toggle("lit", el.getAttribute("data-cue") === key);
      });
      panel.style.display = "";
      if (bar) bar.style.display = "";
      var src = "assets/videos/" + CUE_MAP[key] + ".mp4";
      var still = "assets/videos/" + CUE_MAP[key] + ".webp";
      if (!video.src.endsWith(src)) {
        video.src = src;
        video.poster = still;
        video.currentTime = 0;
      }
      video.muted = false;
      video.volume = 0;
      video.play().catch(function () {
        video.muted = true;
        video.play().catch(function () {});
      });
      fadeVolume(1, 1.25);
      if (player) player.duck("cue");
    }

    function hideCue() {
      if (!current) return;
      current = null;
      root.classList.remove("cued");
      $$("[data-cue]", root).forEach(function (el) {
        el.classList.remove("lit");
      });
      fadeVolume(0, 0.5, function () {
        video.pause();
        video.muted = true;
        panel.style.display = "none";
        if (bar) {
          bar.style.display = "none";
          bar.style.transform = "scaleX(0)";
        }
      });
      if (player) player.restore("cue");
    }

    if (finePointer) {
      root.addEventListener("mouseover", function (ev) {
        var hit = ev.target && ev.target.closest ? ev.target.closest("[data-cue]") : null;
        if (hit) showCue(hit.getAttribute("data-cue"));
        else hideCue();
      });
      root.addEventListener("mouseleave", hideCue);

      var onScroll = function () {
        var y = window.scrollY;
        var dy = Math.abs(y - lastY);
        lastY = y;
        var fast = dy > 48;
        if (fast !== scrolling) {
          scrolling = fast;
          root.classList.toggle("scrolling", fast);
          if (fast) hideCue();
        }
        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(function () {
          scrolling = false;
          root.classList.remove("scrolling");
        }, 180);
        if (bar && current && video.duration) {
          bar.style.display = "";
          bar.style.transform = "scaleX(" + (video.currentTime / video.duration || 0) + ")";
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      if (lenis) lenis.on("scroll", onScroll);
    }
  }

  /* ---------------------------------------------------------
     Section video clips' still fade (CSS hook)
     --------------------------------------------------------- */

  /* ---------------------------------------------------------
     Player (dock + sheet + audio + EQ)
     --------------------------------------------------------- */
  var TRACKS = [
    { title: "Ascension", side: "a", pos: 1, src: "assets/music/pegassi-ascension.mp3", label: "03:01" },
    { title: "Circles", side: "a", pos: 2, src: "assets/music/pegassi-circles.mp3", label: "03:19" },
    { title: "Forest Walk", side: "b", pos: 1, src: "assets/music/pegassi-forest-walk.mp3", label: "03:10" },
    { title: "Twinflame", side: "b", pos: 2, src: "assets/music/pegassi-twinflame.mp3", label: "02:45" }
  ];
  var DISPLAY_ORDER = [0, 1, 3, 2];

  function fmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var s = Math.floor(sec);
    var m = Math.floor(s / 60);
    var r = s % 60;
    return String(m).padStart(2, "0") + ":" + String(r).padStart(2, "0");
  }

  function createPlayer() {
    var root = $("[data-player]");
    if (!root) return null;
    var sheet = $("[data-player-sheet]", root);
    var bar = $("[data-player-bar]", root);
    var toggleBtn = $("[data-player-toggle]", root);
    var expandBtn = $("[data-player-expand]", root);
    var rowsHost = $("[data-player-rows]", root);
    var disc = $("[data-disc]", root);
    var discSpin = $("[data-disc-spin]", root);
    var iconPlay = $("[data-icon-play]", root);
    var iconEq = $("[data-icon-eq]", root);

    var audio = new Audio();
    audio.preload = "metadata";
    var state = {
      index: 0,
      playing: false,
      open: false,
      ducked: 0
    };
    var bands = [0, 0, 0];
    var bandTargets = [0.4, 0.5, 0.45];
    var bandNext = [0, 0, 0];
    var analyser = null;
    var freq = null;

    var eqBars = iconEq ? $$("i", iconEq) : [];
    var rowEqBars = [];

    function track() {
      return TRACKS[state.index];
    }

    /* --- rows --- */
    var rowEls = [];
    function buildRows() {
      if (!rowsHost) return;
      rowsHost.innerHTML = "";
      rowEls = [];
      DISPLAY_ORDER.forEach(function (ti) {
        var t = TRACKS[ti];
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "row hoverable flex items-center w-full h-45 pr-10 text-left";
        btn.setAttribute("data-track", String(ti));
        var mark = document.createElement("span");
        mark.className = "mark absolute left-15 top-1/2 -translate-y-1/2";
        mark.innerHTML =
          '<svg class="h-12 w-auto -scale-x-100" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 7.5C3.52941 5.14706 10.8706 0.352941 12 0V15L0 7.5Z" fill="currentColor"></path></svg>';
        var eq = document.createElement("span");
        eq.className = "eq flex items-end gap-2 h-15 ml-15";
        eq.style.display = "none";
        eq.innerHTML =
          '<i class="w-2 bg-white" style="height:0.8rem"></i>' +
          '<i class="w-2 bg-white" style="height:1.5rem"></i>' +
          '<i class="w-2 bg-white" style="height:1rem"></i>';
        var title = document.createElement("span");
        title.className = "ml-15 shift";
        title.textContent = t.title;
        var dur = document.createElement("span");
        dur.className = "ml-auto";
        dur.textContent = "(" + t.label + ")";
        btn.appendChild(mark);
        btn.appendChild(eq);
        btn.appendChild(title);
        btn.appendChild(dur);
        btn.addEventListener("click", function () {
          select(ti, true);
        });
        rowsHost.appendChild(btn);
        rowEls.push({ el: btn, mark: mark, eq: eq, title: title, bars: $$("i", eq), ti: ti });
      });
    }

    function renderRows() {
      rowEls.forEach(function (row) {
        var active = row.ti === state.index;
        row.el.classList.toggle("bg-surface-2", active);
        if (active) {
          row.el.classList.remove("border-b", "border-line");
        } else {
          row.el.classList.add("border-b", "border-line");
        }
        row.mark.style.display = active ? "none" : "";
        row.eq.style.display = active ? "" : "none";
        row.title.className = active ? "ml-9" : "ml-15 shift";
      });
    }

    function renderBar() {
      var t = track();
      if (expandBtn) expandBtn.textContent = t.title + " - Pegassi®";
      if (toggleBtn) toggleBtn.setAttribute("aria-label", state.playing ? "Pause" : "Play");
      if (iconPlay) iconPlay.style.display = state.playing ? "none" : "";
      if (iconEq) iconEq.style.display = state.playing ? "" : "none";
      if (bar) bar.classList.toggle("bg-surface-2", state.open);
      renderDisc();
    }

    function renderDisc() {
      if (!disc) return;
      var flip = track().side === "b" ? 180 : 0;
      disc.style.transform = "rotateY(" + flip + "deg)";
      if (discSpin) discSpin.classList.toggle("still", !state.playing);
    }

    /* --- audio --- */
    function ensureSrc() {
      var t = track();
      if (!audio.src.endsWith(t.src)) {
        audio.src = t.src;
        audio.load();
      }
    }

    function ensureAnalyser() {
      if (analyser) return;
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        var ctx = new Ctx();
        var node = ctx.createMediaElementSource(audio);
        var gain = ctx.createGain();
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.3;
        analyser.minDecibels = -80;
        analyser.maxDecibels = -5;
        node.connect(gain);
        gain.connect(analyser);
        analyser.connect(ctx.destination);
        freq = new Uint8Array(analyser.frequencyBinCount);
        ensureAnalyser.gainNode = gain;
        ensureAnalyser.ctx = ctx;
      } catch (err) {
        analyser = null;
      }
    }

    function duckVolume(v) {
      if (ensureAnalyser.gainNode) {
        try {
          ensureAnalyser.gainNode.gain.value = v;
          return;
        } catch (err) {}
      }
      audio.volume = v;
    }

    function play() {
      ensureSrc();
      ensureAnalyser();
      if (ensureAnalyser.ctx && ensureAnalyser.ctx.state === "suspended") {
        ensureAnalyser.ctx.resume().catch(function () {});
      }
      var p = audio.play();
      if (p && p.then) {
        p.then(
          function () {
            state.playing = true;
            renderBar();
          },
          function () {
            state.playing = false;
            renderBar();
          }
        );
      } else {
        state.playing = true;
        renderBar();
      }
    }

    function pause() {
      audio.pause();
      state.playing = false;
      renderBar();
    }

    function toggle() {
      if (state.playing) pause();
      else play();
    }

    function select(i, autoplay) {
      var same = i === state.index;
      state.index = i;
      if (!same) {
        audio.pause();
        audio.currentTime = 0;
        ensureSrc();
        state.playing = false;
      }
      renderBar();
      if (autoplay) play();
      else renderRows();
    }

    var duckSet = {};
    function duck(reason) {
      duckSet[reason || "x"] = true;
      state.duckned = 0;
      state.duckCount = Object.keys(duckSet).length;
      if (!state.playing) return;
      if (hasGsap) {
        var o = { v: audio.volume };
        gsap.killTweensOf(o);
        gsap.to(o, {
          v: 0,
          duration: 0.5,
          ease: "none",
          onUpdate: function () {
            duckVolume(o.v);
          }
        });
      } else duckVolume(0);
    }

    function restore(reason) {
      delete duckSet[reason || "x"];
      if (Object.keys(duckSet).length) return;
      if (!state.playing) return;
      if (hasGsap) {
        var o = { v: audio.volume };
        gsap.killTweensOf(o);
        gsap.to(o, {
          v: 1,
          duration: 0.5,
          ease: "none",
          onUpdate: function () {
            duckVolume(o.v);
          }
        });
      } else duckVolume(1);
    }

    /* --- sheet --- */
    function openSheet() {
      if (!sheet || state.open) return;
      state.open = true;
      expandBtn.setAttribute("aria-expanded", "true");
      renderBar();
      if (window.innerWidth < 650 && hasGsap) {
        sheet.style.display = "";
        gsap.fromTo(
          sheet,
          { "--reveal": 0, autoAlpha: 1 },
          { "--reveal": 1, duration: 0.8, ease: "reveal" }
        );
      } else {
        sheet.style.display = "";
        if (hasGsap) gsap.fromTo(sheet, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, delay: 0.35, ease: "power1" });
        else sheet.style.opacity = "1";
      }
    }

    function closeSheet() {
      if (!sheet || !state.open) return;
      state.open = false;
      expandBtn.setAttribute("aria-expanded", "false");
      renderBar();
      var done = function () {
        sheet.style.display = "none";
      };
      if (window.innerWidth < 650 && hasGsap) {
        gsap.to(sheet, { "--reveal": 0, duration: 0.5, ease: "snappy", onComplete: done });
      } else if (hasGsap) {
        gsap.to(sheet, { autoAlpha: 0, duration: 0.35, ease: "power1", onComplete: done });
      } else done();
    }

    function toggleSheet() {
      if (state.open) closeSheet();
      else openSheet();
    }

    /* --- EQ animation --- */
    function bandValue(i) {
      if (state.playing && analyser && freq) {
        analyser.getByteFrequencyData(freq);
        var slice = [1, 3];
        var n = 0;
        for (var j = slice[0]; j < slice[1]; j++) if (freq[j] > n) n = freq[j];
        var e = n / 255;
        bands[i] += (e - bands[i]) * 0.2;
        return Math.min(1, bands[i]);
      }
      if (state.playing) {
        var now = performance.now();
        if (now > bandNext[i]) {
          bandTargets[i] = 0.3 + Math.random() * 0.55;
          bandNext[i] = now + 110 + Math.random() * 150;
        }
        bands[i] += (bandTargets[i] - bands[i]) * 0.18;
        return bands[i];
      }
      bands[i] += (0 - bands[i]) * 0.1;
      return bands[i];
    }

    function tick() {
      for (var i = 0; i < 3; i++) {
        var t = [0.8, 1.5, 1][i];
        var h = state.playing ? t * (0.2 + 0.8 * bandValue(i)) : t * 0.001;
        if (eqBars[i]) eqBars[i].style.height = h + "rem";
      }
      rowEls.forEach(function (row) {
        if (row.ti !== state.index) return;
        for (var i = 0; i < 3; i++) {
          var t = [0.8, 1.5, 1][i];
          var h = state.playing ? t * (0.2 + 0.8 * bandValue(i)) : t * 0.001;
          if (row.bars[i]) row.bars[i].style.height = h + "rem";
        }
      });
    }

    audio.addEventListener("ended", function () {
      select((state.index + 1) % TRACKS.length, true);
    });
    audio.addEventListener("play", function () {
      state.playing = true;
      renderBar();
    });
    audio.addEventListener("pause", function () {
      state.playing = false;
      renderBar();
    });

    buildRows();
    renderRows();
    renderBar();
    if (toggleBtn) toggleBtn.addEventListener("click", toggle);
    if (expandBtn) expandBtn.addEventListener("click", toggleSheet);

    if (hasGsap) gsap.ticker.add(tick);
    else setInterval(tick, 100);

    return {
      root: root,
      duck: duck,
      restore: restore,
      toggle: toggle,
      select: select
    };
  }

  /* ---------------------------------------------------------
     Player floor lift
     --------------------------------------------------------- */
  function setupFloor() {
    var floor = $("[data-player-floor]");
    var player = $("[data-player]");
    if (!floor || !player) return;
    var update = function () {
      var top = floor.getBoundingClientRect().top + window.scrollY;
      var lift = Math.max(0, window.innerHeight - (top - window.scrollY));
      lift = Math.min(lift, 45);
      player.style.translate = "0 " + -lift + "px";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  function setupMenu() {
    var toggle = $("[data-menu-toggle]");
    var sheet = $("[data-menu-sheet]");
    if (!toggle || !sheet) return;
    var open = false;
    var setOpen = function (next) {
      open = next;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.classList.toggle("bg-surface-2", open);
      var done = function () {
        if (!open) sheet.style.display = "none";
      };
      if (open) {
        sheet.style.display = "";
        if (hasGsap) gsap.fromTo(sheet, { "--reveal": 0, autoAlpha: 1 }, { "--reveal": 1, duration: 0.8, ease: "reveal" });
      } else if (hasGsap) {
        gsap.to(sheet, { "--reveal": 0, duration: 0.5, ease: "snappy", onComplete: done });
      } else done();
    };
    toggle.addEventListener("click", function () {
      setOpen(!open);
    });
  }

  /* ---------------------------------------------------------
     Idle easter-egg gif
     --------------------------------------------------------- */
  function setupIdle() {
    if (reduced || !finePointer) return;
    var el = $("[data-idle]");
    if (!el) return;
    var COUNT = 8;
    var TIMEOUT = 10000;
    var order = [];
    var last = 0;
    var timer = 0;
    var visible = false;
    var mx = 0;
    var my = 0;
    var hidden = false;

    function shuffle() {
      order = [];
      for (var i = 1; i <= COUNT; i++) order.push(i);
      for (var j = order.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = order[j];
        order[j] = order[k];
        order[k] = tmp;
      }
      if (order.length > 1 && order[order.length - 1] === last) {
        order.unshift(order.pop());
      }
    }
    shuffle();

    function place(x, y) {
      var fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 12;
      var w = el.offsetWidth || 0;
      var h = el.offsetHeight || 0;
      var pad = fs;
      var left = Math.min(Math.max(pad, x), window.innerWidth - w - pad);
      var top = Math.min(Math.max(pad, y - h / 2), window.innerHeight - h - pad);
      el.style.left = left + "px";
      el.style.top = top + "px";
    }

    function show(x, y) {
      if (!order.length) shuffle();
      last = order.pop();
      el.src = "assets/idle/" + last + ".gif";
      place(x, y);
      el.style.display = "";
      visible = true;
      requestAnimationFrame(function () {
        el.classList.remove("is-out");
        el.classList.add("is-in");
      });
      if (!order.length) shuffle();
    }

    function hide() {
      if (!visible) return;
      visible = false;
      el.classList.remove("is-in");
      el.classList.add("is-out");
      window.setTimeout(function () {
        if (!visible) el.style.display = "none";
      }, 400);
    }

    function bump(x, y) {
      if (typeof x === "number") {
        mx = x;
        my = y;
      }
      hide();
      window.clearTimeout(timer);
      if (!hidden) timer = window.setTimeout(function () {
        show(mx, my);
      }, TIMEOUT);
    }

    window.addEventListener(
      "mousemove",
      function (ev) {
        mx = ev.clientX;
        my = ev.clientY;
        if (visible) place(mx, my);
        bump();
      },
      { passive: true }
    );
    window.addEventListener("pointerdown", bump, { passive: true });
    window.addEventListener("keydown", bump);
    window.addEventListener("wheel", bump, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () {
      hidden = true;
      hide();
      window.clearTimeout(timer);
    });
    document.documentElement.addEventListener("mouseenter", function () {
      hidden = false;
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        hide();
        window.clearTimeout(timer);
      } else if (!hidden) {
        bump();
      }
    });
    el.addEventListener("load", function () {
      if (visible) place(mx, my);
    });
  }

  /* ---------------------------------------------------------
     Grid overlay (shift + G)
     --------------------------------------------------------- */
  function setupGrid() {
    var overlay = $("[data-grid-overlay]");
    if (!overlay) return;
    var host = overlay.querySelector(".site-grid");
    for (var i = 0; i < 12; i++) {
      var col = document.createElement("div");
      col.className = "col";
      host.appendChild(col);
    }
    window.addEventListener("keydown", function (ev) {
      if (!ev.shiftKey || ev.code !== "KeyG") return;
      var t = ev.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      var on = overlay.style.display === "none";
      overlay.style.display = on ? "" : "none";
    });
  }

  /* ---------------------------------------------------------
     Enter overlay
     --------------------------------------------------------- */
  function setupEnter(onEnter) {
    var sheet = $("[data-enter-sheet]");
    var backdrop = $("[data-enter-backdrop]");
    if (!sheet) {
      onEnter();
      return;
    }
    var entered = false;
    var enter = function () {
      if (entered) return;
      entered = true;
      sheet.classList.remove("is-hot");
      var fade = 0.5;
      if (hasGsap && !reduced) {
        gsap.to([sheet, backdrop].filter(Boolean), {
          autoAlpha: 0,
          duration: fade,
          delay: 0.15,
          ease: "power1",
          onComplete: function () {
            sheet.remove();
            if (backdrop) backdrop.remove();
          }
        });
      } else {
        sheet.remove();
        if (backdrop) backdrop.remove();
      }
      onEnter(0.55 + 0.15);
    };
    sheet.classList.add("is-hot");
    sheet.addEventListener("click", enter);
    window.addEventListener(
      "keydown",
      function (ev) {
        if (ev.key === "Enter" || ev.key === " ") enter();
      },
      { once: true }
    );
    return enter;
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    document.documentElement.classList.add("anim-ready");
    setupLenis();
    setupReveals();
    setupSlideUps();
    setupHero();
    setupClips();
    var player = createPlayer();
    setupCues(player);
    setupFloor();
    setupMenu();
    setupIdle();
    setupGrid();

    setupEnter(function (delay) {
      if (revealer) {
        revealer.arm(delay || 0);
        /* safety: nothing left parked forever */
        window.setTimeout(function () {
          revealer.playVisible(0);
        }, 2500);
      }
      playSlideUps(delay || 0);
    });
  }

  function whenReady(cb) {
    var done = false;
    var run = function () {
      if (done) return;
      done = true;
      cb();
    };
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(run);
    }
    window.setTimeout(run, 1500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      whenReady(boot);
    });
  } else {
    whenReady(boot);
  }
})();
