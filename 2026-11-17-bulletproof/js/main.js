/* ============================================================
   Bulletproof clone — interactions (GSAP + ScrollTrigger)
   Reproduces: hero reveal, scroll-driven case slider,
   client-list poster preview, news drag-scroll, locations
   marquees + hover details, footer parallax, button micro-hovers
   ============================================================ */

(function () {
  'use strict';

  if (window.gsap) gsap.registerPlugin(ScrollTrigger);

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- cookie banner ---------------- */
  var banner = $('#cookie-banner');
  if (banner) {
    var hide = function () { banner.classList.add('is-hidden'); };
    $('#cookie-close').addEventListener('click', hide);
    $('#cookie-accept').addEventListener('click', hide);
    $('#cookie-decline').addEventListener('click', hide);
  }

  /* ---------------- anchor buttons ---------------- */
  $$('[data-scroll-to]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var target = $(el.getAttribute('data-scroll-to'));
      if (target) {
        var y = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ---------------- locations data ---------------- */
  var LOCATIONS = {
    'New York':  ['257 Park Ave South, NY 10010', 'helloNYC@wearebulletproof.com', '+1 (212) 488 8288'],
    'Singapore': ['33-43 Tanjong Pagar Road, 088464', 'helloSGP@wearebulletproof.com', '+65 68177300'],
    'Dubai':     ['', 'helloUAE@wearebulletproof.com', ''],
    'London':    ['10 Bedford Street, London, WC2E 9HE', 'helloLDN@wearebulletproof.com', '+44 (0)20 7395 3636'],
    'Amsterdam': ['Herengracht 576-A, 1017 CJ', 'helloAMS@wearebulletproof.com', '+31 20 240 24 87'],
    'Shanghai':  ['Room 1283, No.100, Lane 130, Taopu Road', 'helloSHA@wearebulletproof.com', '+86 21 5178 2507'],
    'Sydney':    ['52 Reservoir Street, Surry Hills, NSW 2010', 'helloSYD@wearebulletproof.com', ''],
    'Melbourne': ['Central House, 101 Moray Street, VIC 3205', 'helloMEL@wearebulletproof.com', '']
  };

  /* build marquee rows (5 rows, alternating direction, staggered content) */
  var ROW_ORDER = [
    ['New York', 'Singapore', 'Dubai', 'London', 'Amsterdam', 'Shanghai', 'Sydney', 'Melbourne'],
    ['Amsterdam', 'Shanghai', 'Sydney', 'Melbourne', 'New York', 'Singapore', 'Dubai', 'London'],
    ['Shanghai', 'Sydney', 'Melbourne', 'New York', 'Singapore', 'Dubai', 'London', 'Amsterdam'],
    ['Dubai', 'London', 'Amsterdam', 'Shanghai', 'Sydney', 'Melbourne', 'New York', 'Singapore'],
    ['Melbourne', 'New York', 'Singapore', 'Dubai', 'London', 'Amsterdam', 'Shanghai', 'Sydney']
  ];
  var list = $('#locList');
  if (list) {
    $$('.loc_row', list).forEach(function (row, i) {
      var names = ROW_ORDER[i % ROW_ORDER.length];
      var html = '';
      for (var rep = 0; rep < 2; rep++) {
        names.forEach(function (n) {
          html += '<div class="loc_title-wrap"><div class="loc_title" data-loc="' + n + '">' + n + '</div></div>';
        });
      }
      row.innerHTML = html;
    });
  }

  /* hover: dim others + show office details */
  var locTitles = $$('.loc_title', list || document);
  var details = $('#locDetails');
  var detailsTitle = $('#locDetailsTitle');
  var detailsBody = $('#locDetailsBody');
  locTitles.forEach(function (t) {
    t.addEventListener('mouseenter', function () {
      list.classList.add('is-hovering');
      t.classList.add('is-current');
      var data = LOCATIONS[t.getAttribute('data-loc')];
      if (data && details) {
        detailsTitle.textContent = t.getAttribute('data-loc');
        detailsBody.innerHTML =
          '<p>' + (data[0] || '') + '</p>' +
          '<p><a href="mailto:' + data[1] + '">' + data[1] + '</a></p>' +
          (data[2] ? '<p>' + data[2] + '</p>' : '');
        details.classList.add('is-open');
      }
    });
    t.addEventListener('mouseleave', function () {
      list.classList.remove('is-hovering');
      t.classList.remove('is-current');
      if (details) details.classList.remove('is-open');
    });
  });

  /* footer studio list */
  var footerLocs = $('#footerLocs');
  if (footerLocs) {
    var COUNTRIES = { 'London': 'UK', 'New York': 'US', 'Singapore': 'SG', 'Amsterdam': 'NL', 'Sydney': 'AU', 'Shanghai': 'CN', 'Melbourne': 'AU', 'Dubai': 'UAE' };
    Object.keys(LOCATIONS).forEach(function (city) {
      var el = document.createElement('div');
      el.className = 'bpf_locations';
      el.innerHTML =
        '<div class="bpf_country"><div class="body-10 is-white is--loc">' + COUNTRIES[city] + '</div></div>' +
        '<div class="bpf_city"><h6 class="h-h6 is-small is-white is-footer">' + city + '</h6></div>';
      footerLocs.appendChild(el);
    });
  }

  /* ---------------- hero entrance ---------------- */
  if (window.gsap && !reduceMotion) {
    var heroTl = gsap.timeline({ defaults: { ease: 'cubic-bezier(0.19, 1, 0.22, 1)' } });
    heroTl
      .from('.hero_grad', { scaleY: 0, duration: 1.4, ease: 'power2.out' }, 0.2)
      .from('.hero_wrap .h-h1', {
        yPercent: 120, duration: 1.2, stagger: 0.12, ease: 'expo.out',
        onComplete: function () {}
      }, 0.35)
      .from('.hero_bg img', { scale: 1.15, duration: 2.4, ease: 'power2.out' }, 0);
  }

  /* ---------------- ken-burns on hero ---------------- */
  if (window.gsap && !reduceMotion) {
    gsap.to('.hero_kenburns', { scale: 1.08, duration: 18, ease: 'none', yoyo: true, repeat: -1 });
  }

  /* ---------------- reveal-line animations (intro etc.) ---------------- */
  if (window.gsap && !reduceMotion) {
    $$('[data-reveal-line]').forEach(function (el) {
      var inner = el.querySelector('span') || el;
      gsap.set(inner, { yPercent: 110 });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: function () {
          gsap.to(inner, { yPercent: 0, duration: 1, ease: 'expo.out' });
        }
      });
    });
  }

  /* ---------------- navbar theme swap over dark/light sections ---------------- */
  var navbar = $('.navbar');
  if (navbar && window.ScrollTrigger) {
    $$('.section.intro, .section.is-home__work').forEach(function (sec) {
      ScrollTrigger.create({
        trigger: sec, start: 'top 3vw', end: 'bottom 3vw',
        onToggle: function (self) {
          navbar.classList.toggle('is-light-mode', self.isActive);
        }
      });
    });
  }

  /* ---------------- pinned case slider ---------------- */
  var slider = $('.work-slider');
  if (slider && window.gsap && window.ScrollTrigger && !reduceMotion) {
    var slides = $$('.wfb_slide', slider);
    var imgs = $$('.wfb-parallax', slider);
    gsap.set(imgs, { scale: 1.15 });

    ScrollTrigger.create({
      trigger: slider,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: function (self) {
        var idx = Math.min(slides.length - 1, Math.floor(self.progress * slides.length));
        slides.forEach(function (s, i) {
          var active = i === idx;
          s.classList.toggle('active', active);
          if (active && !s._shown) {
            s._shown = true;
            gsap.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: 'power2.out' });
          } else if (!active) {
            s._shown = false;
          }
        });
        imgs.forEach(function (img, i) {
          var d = idx - i;
          gsap.to(img, { yPercent: d * 6, scale: 1.15 - (i === idx ? 0.15 : 0), duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
        });
      }
    });
  }

  /* ---------------- work list: poster preview ---------------- */
  var poster = $('#workPoster');
  var posterImg = $('#posterImg');
  var posterClient = $('#posterClient');
  var posterStamp1 = $('#posterStamp1');
  var posterStamp2 = $('#posterStamp2');
  var workItems = $$('.work-list-item');
  workItems.forEach(function (item) {
    item.addEventListener('mouseenter', function () {
      if (!poster) return;
      posterImg.src = item.getAttribute('data-poster');
      posterClient.textContent = item.getAttribute('data-client');
      posterStamp1.textContent = item.getAttribute('data-stamp1');
      posterStamp2.innerHTML = '<em>' + item.getAttribute('data-stamp2') + '</em>';
      poster.classList.add('open');
    });
    item.addEventListener('mouseleave', function () {
      if (poster) poster.classList.remove('open');
    });
  });

  /* list/grid toggle (visual state only — list is the faithful default) */
  $$('.filter-button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.filter-button').forEach(function (b) { b.classList.toggle('inactive', b !== btn); });
    });
  });

  /* ---------------- work list reveal on scroll ---------------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.from('.work-list-item', {
      opacity: 0, yPercent: 40, stagger: 0.05, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#work-list', start: 'top 60%', once: true }
    });
  }

  /* ---------------- news heading reveal + drag scroll ---------------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.from('.more-content-h span', {
      yPercent: 110, stagger: 0.1, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: '.more-content', start: 'top 70%', once: true }
    });
    gsap.from('.news_slider-item', {
      opacity: 0, y: 60, stagger: 0.08, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.news_slider', start: 'top 80%', once: true }
    });
  }
  var newsSlider = $('#newsSlider');
  if (newsSlider) {
    var isDown = false, startX = 0, startScroll = 0;
    newsSlider.addEventListener('mousedown', function (e) {
      isDown = true; startX = e.pageX; startScroll = newsSlider.scrollLeft;
      newsSlider.classList.add('dragging');
    });
    window.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      newsSlider.scrollLeft = startScroll - (e.pageX - startX) * 1.4;
    });
    window.addEventListener('mouseup', function () {
      isDown = false;
      newsSlider.classList.remove('dragging');
    });
  }

  /* ---------------- footer parallax reveal ---------------- */
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    gsap.fromTo('#footer', { y: '-12vw' }, {
      y: '0vw', ease: 'none',
      scrollTrigger: {
        trigger: '.footer_wrapper', start: 'top bottom', end: 'bottom bottom', scrub: true
      }
    });
    gsap.to('.footer-b-box img', {
      yPercent: -14, ease: 'none',
      scrollTrigger: { trigger: '.footer_wrapper', start: 'top bottom', end: 'bottom bottom', scrub: true }
    });
  }

  /* ---------------- refresh trigger after assets load ---------------- */
  if (window.ScrollTrigger) {
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  }
})();
