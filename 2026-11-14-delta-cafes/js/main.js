/* ============================================================
   Delta Cafés — static clone (design study)
   main.js — interactions: hero slider, marquees, reveals,
   draggable bags, menu, cookie banner, widgets
   ============================================================ */
(function () {
  'use strict';

  var hasGSAP = typeof gsap !== 'undefined';
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Preloader ---------------- */
  function hidePreloader() {
    var pl = document.getElementById('preloader');
    if (pl) setTimeout(function () { pl.classList.add('done'); }, 350);
  }
  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 2500); // safety

  /* ---------------- Hero slider ---------------- */
  var slides = Array.prototype.slice.call(document.querySelectorAll('#hero-title .slide'));
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('#hero-thumbs .thumb'));
  var current = 0, timer = null;

  function goSlide(i, restartTimer) {
    i = (i + slides.length) % slides.length;
    if (i === current && restartTimer !== 'first') { schedule(); return; }
    current = i;
    slides.forEach(function (s, k) { s.classList.toggle('active', k === i); });
    thumbs.forEach(function (t, k) {
      t.classList.remove('active');
      if (k === i) {
        // reflow so the progress animation restarts
        var bar = t.querySelector('.t-bar');
        bar.innerHTML = '<i></i>';
        void bar.offsetWidth;
        t.classList.add('active');
      }
    });
    if (hasGSAP) {
      var lines = slides[i].querySelectorAll('h1 br');
      var h1 = slides[i].querySelector('h1');
      if (h1) {
        gsap.fromTo(h1, { yPercent: 8, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, ease: 'power3.out' });
      }
    }
    schedule();
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () { goSlide(current + 1); }, 6500);
  }
  thumbs.forEach(function (t) {
    t.addEventListener('click', function () { goSlide(+t.getAttribute('data-i')); });
  });
  goSlide(0, 'first');

  /* ---------------- Products marquee (draggable) ---------------- */
  (function () {
    var strip = document.getElementById('products');
    var track = document.getElementById('products-track');
    if (!strip || !track || !hasGSAP) return;

    var proxy = { p: 0 };
    var apply = function () {
      track.style.transform = 'translateX(' + (-proxy.p * 50) + '%)';
    };
    var loop = gsap.to(proxy, {
      p: '+=1', duration: 55, ease: 'none', repeat: -1,
      modifiers: {
        p: function (p) { return ((parseFloat(p) % 1) + 1) % 1; }
      },
      onUpdate: apply
    });

    var dragging = false, startX = 0, startP = 0, moved = 0;
    function px2p(dx) {
      var half = track.scrollWidth * 0.5 || 1;
      return dx / half;
    }
    strip.addEventListener('pointerdown', function (e) {
      dragging = true; moved = 0;
      startX = e.clientX; startP = proxy.p;
      loop.pause();
      strip.classList.add('dragging');
      strip.setPointerCapture(e.pointerId);
    });
    strip.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      var p = startP + px2p(dx);
      proxy.p = ((p % 1) + 1) % 1;
      apply();
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      strip.classList.remove('dragging');
      // ease out to nearest continue point, then resume auto-scroll
      gsap.to(proxy, {
        p: '+=0.02', duration: 1, ease: 'power2.out',
        modifiers: { p: function (p) { return ((parseFloat(p) % 1) + 1) % 1; } },
        onUpdate: apply,
        onComplete: function () { loop.resume(); }
      });
    }
    strip.addEventListener('pointerup', release);
    strip.addEventListener('pointercancel', release);
    // prevent card click after a real drag
    track.addEventListener('click', function (e) {
      if (moved > 6) { e.preventDefault(); e.stopPropagation(); moved = 0; }
    }, true);
  })();

  /* ---------------- DDD rows ---------------- */
  (function () {
    var row1 = ['2f098cd19fd85ebe3af420bf92e778cc3cf2ba3b-440x630.jpg', 'b8cc96c1ee7eceb172136cf852a381f743490ffd-440x630.jpg', '19ba32117828c96d389a3b3679626ae8188c598b-440x630.jpg', '2d692ec563d59f492e29fd7cd0116005fba270ea-440x630.jpg', 'b562905c66d1ea28f85cad3229944180506dee4f-440x630.jpg', '6a0fb810927ab4afa56229925b099557d2a64bd2-440x630.jpg', '63da04340cd540da1584bfddd73da03ef7a73282-440x630.jpg', '98672e02ff0965fa58e8ec156cbb57c73f794b7f-440x630.jpg', '066cbf09a72d0746adcd8da1af077deed1ded168-440x630.jpg', '1976772bcafa43ca9d45a8e8e96581d50b8a2f89-440x630.jpg', '25b9a9c778a386c8fcaf7c1aa3cf874097e14e6d-440x630.jpg', '377a4a27863726b29c9815130d2f85dfe7acdfcb-440x630.jpg'];
    var row2 = ['0c175bcfe3c957bcbd59bc921d4a5efb845d1c89-440x630.jpg', 'ce237b7c21145e4b87c3d1d5feebf1bd97f3cbcb-440x630.jpg', '5f5f8330ceb7f04c0423a6949f1838d7de559545-440x630.jpg', '99554a987e1c59320cbf2a0b4ec39e3bab613960-440x630.jpg', '27480712ac54f96be7398457bfc483aa2c0989cb-440x630.jpg', 'c401d7dced354e7e30664e88d2014f45180bfbe5-440x630.jpg', '00b849fff9fea61784f290f83811a62ea0d5880c-440x630.jpg', '45ebd12e51f5987dbb8370f9510f02723a828584-440x630.jpg', '54131f5c5225c34b5e37184b377be29956410c36-440x630.jpg', '660609afa319fcfc87512ccd2f13fb13535284d4-440x630.jpg', '854fc15085e9692d25585abf3afde9748af330cf-440x630.jpg', '9363237a5593e6ee265d422ec43a4c66bb363522-440x630.jpg'];
    var alt = 'D de Delta portrait';
    function fill(id, list) {
      var el = document.getElementById(id);
      if (!el) return;
      var html = '';
      for (var r = 0; r < 2; r++) {
        for (var i = 0; i < list.length; i++) {
          html += '<div class="ddd-item"><img loading="lazy" src="assets/img/' + list[i] + '" alt="' + alt + '"></div>';
        }
      }
      el.innerHTML = html;
    }
    fill('ddd-row-1', row1);
    fill('ddd-row-2', row2);
    if (!hasGSAP) return;
    var t1 = gsap.to('#ddd-row-1', { xPercent: -50, duration: 80, ease: 'none', repeat: -1 });
    var t2 = gsap.to('#ddd-row-2', { xPercent: -50, duration: 80, ease: 'none', repeat: -1 });
    t2.timeScale(-1);
    t2.progress(0.5); // offset the mirrored row
    if (typeof ScrollTrigger !== 'undefined') {
      // rows react to scroll velocity
      ScrollTrigger.create({
        trigger: '#ddd', start: 'top bottom', end: 'bottom top',
        onUpdate: function (self) {
          var v = gsap.utils.clamp(-3, 3, self.getVelocity() / 900);
          gsap.to([t1, t2], { timeScale: (t2.timeScale() > 0 ? 1 : -1) * (1 + Math.abs(v)) , duration: .3, overwrite: true });
        }
      });
    }
  })();

  /* ---------------- Quiz bags ---------------- */
  (function () {
    var wrap = document.getElementById('quiz-bags');
    if (!wrap) return;
    var bags = [
      ['cc80cdfcde4a1f4b870fdb7ddf82bcdeee290a16-532x652.png', 'Chávena', 38.2, 16.5, -4],
      ['b7c9fb6b4bb9f707b45a9931f561af76d34af6ae-532x652.png', 'Brazil', 49.8, 13.2, 3],
      ['646bc4149f0dca782b015c657bdc5c4037c8ee8b-532x652.png', 'Timor', 61.4, 16.5, -3],
      ['a59d12bc818e95eb7e654af833fdcd8278f7eb89-532x652.png', 'Vietnam', 27.9, 21.7, 5],
      ['3d12868a6ddf06d001ad67224b41cd79a90a6dcd-532x652.png', 'Angola', 72.2, 21.7, -5],
      ['5bf7ae776f3b58af2031c266fa9d99dba5688556-532x652.png', 'Colombia', 20.2, 27.5, 3],
      ['b46986173d3e49922e9a867d20eaa515695deb04-532x652.png', 'Cuba', 79.9, 27.5, -3],
      ['7cce7ac0f51041c61b69b34c3c1e7bfc4a8f69a2-532x652.png', 'Ethiopia', 16.1, 33.0, -6],
      ['7ba5d7606e3ea4fc5264fa69416e6fd9420bb451-532x652.png', 'Roast Portugal', 84.0, 33.0, 6],
      ['7ba5d7606e3ea4fc5264fa69416e6fd9420bb451-532x652.png', 'Roast Portugal', 16.1, 50.0, 5],
      ['7cce7ac0f51041c61b69b34c3c1e7bfc4a8f69a2-532x652.png', 'Ethiopia', 84.0, 50.0, -5],
      ['b46986173d3e49922e9a867d20eaa515695deb04-532x652.png', 'Cuba', 20.2, 57.5, -4],
      ['5bf7ae776f3b58af2031c266fa9d99dba5688556-532x652.png', 'Colombia', 79.9, 57.5, 4],
      ['3d12868a6ddf06d001ad67224b41cd79a90a6dcd-532x652.png', 'Angola', 27.9, 63.0, 6],
      ['a59d12bc818e95eb7e654af833fdcd8278f7eb89-532x652.png', 'Vietnam', 72.2, 63.0, -6],
      ['646bc4149f0dca782b015c657bdc5c4037c8ee8b-532x652.png', 'Timor', 38.2, 68.5, 4],
      ['cc80cdfcde4a1f4b870fdb7ddf82bcdeee290a16-532x652.png', 'Chávena', 61.7, 68.5, -4],
      ['b7c9fb6b4bb9f707b45a9931f561af76d34af6ae-532x652.png', 'Brazil', 49.8, 70.0, 3]
    ];
    var html = '';
    bags.forEach(function (b, i) {
      html += '<div class="quiz-bag" data-i="' + i + '" style="left:' + b[2] + '%;top:' + b[3] + '%;transform:rotate(' + b[4] + 'deg)" aria-label="' + b[1] + '"><img loading="lazy" draggable="false" src="assets/img/' + b[0] + '" alt="' + b[1] + ' coffee bag"></div>';
    });
    wrap.innerHTML = html;

    // simple pointer dragging with a little inertia
    var el = null, offX = 0, offY = 0, velX = 0, velY = 0, lastX = 0, lastY = 0, raf = null;
    function onDown(e) {
      var t = e.target.closest('.quiz-bag');
      if (!t) return;
      el = t;
      var r = el.getBoundingClientRect(), pr = wrap.getBoundingClientRect();
      offX = e.clientX - r.left; offY = e.clientY - r.top;
      // store position relative to wrap
      el.dataset.l = ((r.left - pr.left) / pr.width * 100);
      el.dataset.t = ((r.top - pr.top) / pr.height * 100);
      velX = velY = 0; lastX = e.clientX; lastY = e.clientY;
      el.style.left = el.dataset.l + '%';
      el.style.top = el.dataset.t + '%';
      el.style.transform = getComputedStyle(el).transform;
      wrap.setPointerCapture(e.pointerId);
      e.preventDefault();
    }
    function onMove(e) {
      if (!el) return;
      var pr = wrap.getBoundingClientRect();
      var x = ((e.clientX - offX - pr.left) / pr.width * 100);
      var y = ((e.clientY - offY - pr.top) / pr.height * 100);
      velX = e.clientX - lastX; velY = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      el.style.left = x + '%';
      el.style.top = y + '%';
      el.dataset.l = x; el.dataset.t = y;
    }
    function inertia() {
      if (!el) return;
      if (Math.abs(velX) < .15 && Math.abs(velY) < .15) { el = null; return; }
      velX *= .92; velY *= .92;
      var pr = wrap.getBoundingClientRect();
      var x = parseFloat(el.dataset.l) + velX / pr.width * 100;
      var y = parseFloat(el.dataset.t) + velY / pr.height * 100;
      el.dataset.l = x; el.dataset.t = y;
      el.style.left = x + '%'; el.style.top = y + '%';
      raf = requestAnimationFrame(inertia);
    }
    function onUp() {
      if (!el) return;
      cancelAnimationFrame(raf);
      inertia();
    }
    wrap.addEventListener('pointerdown', onDown);
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerup', onUp);
    wrap.addEventListener('pointercancel', onUp);

    if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
      document.querySelectorAll('.quiz-bag').forEach(function (b, i) {
        gsap.to(b, {
          yPercent: (i % 2 ? 8 : -8),
          ease: 'none',
          scrollTrigger: { trigger: '#quiz', start: 'top bottom', end: 'bottom top', scrub: 1.4 }
        });
      });
    }
  })();

  /* ---------------- Scroll reveals ---------------- */
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') {
    document.querySelectorAll('.t-display[data-reveal]').forEach(function (t) {
      var lines = t.querySelectorAll('.reveal-line > span');
      if (lines.length) {
        gsap.set(t, { opacity: 1, y: 0 });
        gsap.set(lines, { yPercent: 110 });
        gsap.to(lines, {
          yPercent: 0, duration: 1.1, ease: 'power4.out', stagger: .09,
          scrollTrigger: { trigger: t, start: 'top 85%' }
        });
        t.dataset.revealed = '1';
      }
    });
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      if (el.dataset.revealed) return;
      gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    /* history: parallax drift on scattered items + curve drawing */
    document.querySelectorAll('.hist-item').forEach(function (it, i) {
      gsap.fromTo(it, { y: 0 }, {
        y: (i % 3 - 1) * -46, ease: 'none',
        scrollTrigger: { trigger: '#history', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    });
    document.querySelectorAll('#history .curves path').forEach(function (p) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      gsap.to(p, {
        strokeDashoffset: 0, ease: 'none',
        scrollTrigger: { trigger: '#history', start: 'top 70%', end: 'bottom 60%', scrub: 1 }
      });
    });
    /* sustainability images */
    gsap.from('#sustainability .s-img.left', {
      y: 90, rotate: -6, opacity: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#sustainability', start: 'top 70%' }
    });
    gsap.from('#sustainability .s-img.right', {
      y: 120, rotate: 8, opacity: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '#sustainability', start: 'top 60%' }
    });
    /* cycle labels */
    ScrollTrigger.create({
      trigger: '#cycle', start: 'top 45%', end: 'bottom 20%',
      onToggle: function (self) { document.getElementById('cycle').classList.toggle('scrolled', self.isActive); }
    });
    /* pre-footer video subtle zoom */
    gsap.fromTo('#pre-footer video', { scale: 1.12 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '#pre-footer', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  } else {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
  }

  /* ---------------- Header menu dropdown ---------------- */
  (function () {
    var drop = document.getElementById('menu-drop');
    var btns = document.querySelectorAll('.nav-item[data-drop]');
    var openPane = null;
    function setOpen(pane, btn) {
      drop.classList.toggle('open', !!pane);
      btns.forEach(function (b) { b.classList.toggle('open', b === btn && !!pane); });
      openPane = pane;
      if (pane) {
        drop.querySelectorAll('.drop-col').forEach(function (c) {
          c.style.display = (c.getAttribute('data-pane') === pane) ? '' : 'none';
        });
      }
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var pane = b.getAttribute('data-drop');
        setOpen(openPane === pane ? null : pane, b);
      });
    });
    document.addEventListener('click', function (e) {
      if (drop.classList.contains('open') && !drop.contains(e.target)) setOpen(null, null);
    });
    // preview swap on hover
    var imgs = drop.querySelectorAll('.drop-media img');
    drop.querySelectorAll('.drop-col a[data-img]').forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        var key = a.getAttribute('data-img');
        imgs.forEach(function (im) { im.classList.toggle('show', im.getAttribute('data-img') === key); });
      });
    });
  })();

  /* ---------------- Language dropdown ---------------- */
  (function () {
    var pill = document.getElementById('lang-pill');
    var drop = document.getElementById('lang-drop');
    pill.addEventListener('click', function (e) { e.stopPropagation(); drop.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (!drop.contains(e.target) && e.target !== pill) drop.classList.remove('open');
    });
    drop.querySelectorAll('li').forEach(function (li) {
      li.addEventListener('click', function () {
        drop.querySelectorAll('li').forEach(function (x) { x.classList.remove('active'); });
        li.classList.add('active');
        drop.classList.remove('open');
      });
    });
  })();

  /* ---------------- Audio pill ---------------- */
  (function () {
    var pill = document.getElementById('audio-pill');
    var vids = document.querySelectorAll('video');
    pill.addEventListener('click', function () {
      var playing = pill.classList.toggle('playing');
      vids.forEach(function (v) { v.muted = !playing; });
    });
  })();

  /* ---------------- Cookie banner ---------------- */
  (function () {
    var banner = document.getElementById('cookie-banner');
    banner.querySelectorAll('[data-consent]').forEach(function (b) {
      b.addEventListener('click', function () { banner.classList.add('hidden'); });
    });
    banner.querySelectorAll('.cookie-toggle .switch').forEach(function (s) {
      if (s.classList.contains('on')) return; // necessary cookies stay on
      s.addEventListener('click', function () { s.classList.toggle('on'); });
    });
  })();

  /* ---------------- Floating quiz button ---------------- */
  (function () {
    var f = document.getElementById('quiz-float');
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        start: 'top -120%',
        onToggle: function (self) { f.classList.toggle('show', self.isActive); }
      });
    }
  })();
})();
