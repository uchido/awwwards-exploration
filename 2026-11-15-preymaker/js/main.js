/* ==========================================================================
   Preymaker — static clone behaviors
   Recreates the original site's client-side runtime (Next.js + Locomotive
   Scroll + GSAP) with vanilla JS + GSAP/ScrollTrigger from CDN.
   ========================================================================== */
(function () {
  'use strict';

  var html = document.documentElement;
  var gsapOK = typeof window.gsap !== 'undefined';
  var scroller = document.getElementById('scroll-wrapper') || window;

  /* The original home page is wrapped with theme="dark" */
  html.setAttribute('data-theme', 'dark');

  if (gsapOK && typeof window.ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.defaults({ scroller: scroller });
  }

  /* ------------------------------------------------------------------ *
   * 1. Text splitting (original splits words client-side for masked
   *    slide-up reveals; chars for small titles)
   * ------------------------------------------------------------------ */
  function splitText(el, mode) {
    var text = el.textContent;
    el.textContent = '';
    var units = mode === 'chars' ? text.split('') : text.split(' ');
    var index = 0;
    units.forEach(function (unit) {
      if (unit === '' && mode !== 'chars') return;
      var outer = document.createElement('div');
      var inner = document.createElement('div');
      inner.textContent = unit === ' ' ? '\u00A0' : unit;
      inner.style.setProperty('--index', index);
      outer.appendChild(inner);
      el.appendChild(outer);
      index++;
      if (mode !== 'chars' && index < units.length) {
        el.appendChild(document.createTextNode(' '));
      }
    });
    return el;
  }

  document.querySelectorAll('[data-animation="text"]').forEach(function (el) {
    splitText(el, 'words');
  });
  document.querySelectorAll('[data-animation="title"]').forEach(function (el) {
    splitText(el, 'chars');
  });
  document.querySelectorAll('.preloader_preloader__Bt96D p').forEach(function (p) {
    splitText(p, 'chars');
  });

  var heroTitle = document.querySelector('.hero_hero__Sbbfz h1');
  if (heroTitle) splitText(heroTitle, 'words');

  var largeParagraph = document.querySelector('.large-paragraph_large_paragraph__D05t_ h2');
  if (largeParagraph) splitText(largeParagraph, 'words');

  /* ------------------------------------------------------------------ *
   * 2. Videos: muted/looping, play while in viewport
   * ------------------------------------------------------------------ */
  var videos = Array.prototype.slice.call(document.querySelectorAll('video'));
  videos.forEach(function (v) {
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.preload = 'auto';
  });

  function playInView(el, play) {
    var vids = el.querySelectorAll('video');
    Array.prototype.forEach.call(vids, function (v) {
      if (play) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }

  if ('IntersectionObserver' in window) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var article = entry.target.closest('article, section, figure');
        playInView(entry.target, entry.isIntersecting && (article ? isLarge(article) : true));
      });
    }, { threshold: 0.15 });
    function isLarge(el) {
      var r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    }
    document.querySelectorAll('section .media video, .hero_figure video').forEach(function (v) {
      videoObserver.observe(v);
    });
  }

  /* work card videos: play on hover like the original */
  document.querySelectorAll('.work_cards_card__F5PyU').forEach(function (card) {
    card.addEventListener('mouseenter', function () { playInView(card, true); });
    card.addEventListener('mouseleave', function () { playInView(card, false); });
  });

  /* ------------------------------------------------------------------ *
   * 3. Locomotive-style `--progress` engine
   *    data-scroll-css-progress: sets --progress 0→1 as the element
   *    traverses the viewport (drives parallax/scale in the compiled CSS)
   * ------------------------------------------------------------------ */
  var progressEls = Array.prototype.slice.call(
    document.querySelectorAll('[data-scroll-css-progress]'));

  function updateProgress() {
    var vh = window.innerHeight;
    progressEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p;
      var footer = el.closest('.footer_footer__1m2ab');
      if (footer) {
        var fr = footer.getBoundingClientRect();
        p = (vh - fr.top) / fr.height;
      } else if (r.bottom < 0) p = 1;
      else if (r.top > vh) p = 0;
      else p = (vh - r.top) / (vh + r.height);
      p = Math.min(1, Math.max(0, p));
      el.style.setProperty('--progress', p.toFixed(4));
    });
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () {
        updateProgress();
        ticking = false;
      });
    }
  }
  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ------------------------------------------------------------------ *
   * 4. Theme
   *    The home page is permanently wrapped in theme="dark" on the
   *    original; each route owns its own theme. Keep it fixed here.
   * ------------------------------------------------------------------ */
  html.setAttribute('data-theme', 'dark');

  /* ------------------------------------------------------------------ *
   * 5. Reveal-on-scroll (is-inview), like Locomotive data-scroll-class
   * ------------------------------------------------------------------ */
  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll('[data-animation]'));

  function reveal(el) { el.classList.add('is-inview'); }

  if (gsapOK && window.ScrollTrigger) {
    revealEls.forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: el.closest('.hero_hero__Sbbfz') ? 'top 60%' : 'top 88%',
        scroller: scroller,
        once: true,
        onEnter: function () { reveal(el); }
      });
    });
    if (largeParagraph) {
      ScrollTrigger.create({
        trigger: largeParagraph,
        start: 'top 85%',
        scroller: scroller,
        once: true,
        onEnter: function () { reveal(largeParagraph); }
      });
    }
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(reveal);
  }

  /* news figures: soft appear with per-figure delay */
  document.querySelectorAll('.news_article__AtJAj figure').forEach(function (fig, i) {
    if (!gsapOK) return;
    fig.style.opacity = '0';
    fig.style.transform = 'translateY(40px)';
    ScrollTrigger.create({
      trigger: fig,
      start: 'top 90%',
      scroller: scroller,
      once: true,
      onEnter: function () {
        gsap.to(fig, {
          opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
          delay: parseFloat(fig.getAttribute('delay')) || i * 0.1
        });
      }
    });
  });

  /* ------------------------------------------------------------------ *
   * 6. Custom cursor with contextual label
   * ------------------------------------------------------------------ */
  var cursor = document.querySelector('.cursor_cursor__APDHc');
  var cursorInner = cursor ? cursor.querySelector('.cursor_inner__nNFnQ') : null;
  var cursorTag = cursor ? cursor.querySelector('.text-tag') : null;
  if (cursor && cursorInner && !('ontouchstart' in window)) {
    html.classList.add('has-custom-cursor');
    var xTo, yTo;
    if (gsapOK) {
      gsap.set(cursorInner, { xPercent: 25, yPercent: 50 });
      xTo = gsap.quickTo(cursorInner, 'x', { duration: 0.45, ease: 'power3' });
      yTo = gsap.quickTo(cursorInner, 'y', { duration: 0.45, ease: 'power3' });
    }
    window.addEventListener('mousemove', function (e) {
      cursor.style.opacity = '1';
      if (xTo) { xTo(e.clientX); yTo(e.clientY); }
      else {
        cursorInner.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)';
      }
    });
    document.addEventListener('mouseleave', function () {
      cursor.style.opacity = '0';
    });
    document.querySelectorAll('[data-cursor="pointer"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        if (cursorTag) {
          cursorTag.style.opacity = '1';
          var p = cursorInner.querySelector('p');
          if (p) p.textContent = el.getAttribute('data-content') || '';
        }
      });
      el.addEventListener('mouseleave', function () {
        if (cursorTag) {
          cursorTag.style.opacity = '0';
          var p = cursorInner.querySelector('p');
          if (p) p.textContent = '';
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 7. Menu open / close
   * ------------------------------------------------------------------ */
  var menu = document.querySelector('.menu_menu__hCC2l');
  var menuInner = menu ? menu.querySelector('.menu_inner__aro3m') : null;
  var menuBg = menu ? menu.querySelector('.menu_background__L0HgD') : null;
  var menuBtn = document.querySelector('nav button[aria-label="Open menu"]');
  var menuClose = menu ? menu.querySelector('button[aria-label="Close menu"]') : null;
  var menuOpen = false;

  function menuTimeline(open) {
    if (!gsapOK || !menu) {
      if (menu) menu.style.display = open ? 'block' : 'none';
      return;
    }
    var titles = menu.querySelectorAll('[data-animation="title"] > div > div, [data-animation="title"] > div');
    var lines = menu.querySelectorAll('.menu_line__UUm4M');
    if (open) {
      menu.style.display = 'block';
      var tl = gsap.timeline();
      tl.fromTo(menuBg, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .fromTo(menuInner,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'power4.inOut' }, 0)
        .fromTo(titles, { yPercent: 125 }, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.02 }, 0.45)
        .fromTo(lines, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power4.out', stagger: 0.08 }, 0.5);
    } else {
      var tl2 = gsap.timeline({
        onComplete: function () { menu.style.display = 'none'; }
      });
      tl2.to(titles, { yPercent: -125, duration: 0.5, ease: 'power3.in', stagger: 0.015 }, 0)
        .to(lines, { scaleX: 0, duration: 0.4, ease: 'power3.in' }, 0)
        .to(menuInner, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'power4.inOut' }, 0.15)
        .to(menuBg, { opacity: 0, duration: 0.4 }, 0.5);
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (menuOpen) return;
      menuOpen = true;
      menuBtn.setAttribute('aria-expanded', 'true');
      menuTimeline(true);
    });
  }
  if (menuClose) {
    menuClose.addEventListener('click', function () {
      if (!menuOpen) return;
      menuOpen = false;
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      menuTimeline(false);
    });
  }
  if (menuBg) {
    menuBg.addEventListener('click', function () {
      if (!menuOpen) return;
      menuOpen = false;
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      menuTimeline(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) {
      menuOpen = false;
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      menuTimeline(false);
    }
  });

  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* nav needs to become visible after load (opacity:0 in base CSS) */
  var nav = document.querySelector('nav.navigation_nav__44WQU');

  /* ------------------------------------------------------------------ *
   * 8. Partners: hover a list item → swap logo + lift the logo strip
   * ------------------------------------------------------------------ */
  var partnerLogos = document.querySelectorAll('.partners_logo___RJAm img');
  var partnerItems = document.querySelectorAll('.partners_item__n5l9o');
  var partnerFigure = document.querySelector('.partners_logo___RJAm figure');
  var partnerLogoY = null;
  if (gsapOK && partnerFigure) {
    partnerLogoY = gsap.quickTo(partnerFigure, 'y', { duration: 0.35, ease: 'power3.out' });
  }
  var firstPartner = partnerItems[0];
  partnerItems.forEach(function (item) {
    function activate() {
      var i = parseInt(item.getAttribute('data-index'), 10);
      partnerLogos.forEach(function (img, j) {
        if (j === i) img.classList.add('partners_active__v3RdA');
        else img.classList.remove('partners_active__v3RdA');
        if (!firstPartner) return;
        var offset = item.getBoundingClientRect().top - firstPartner.getBoundingClientRect().top;
        if (partnerLogoY) partnerLogoY(offset);
      });
      item.style.opacity = '1';
    }
    function deactivate() {
      item.style.opacity = '0.7';
    }
    item.addEventListener('mouseenter', activate);
    item.addEventListener('mouseleave', deactivate);
  });

  /* ------------------------------------------------------------------ *
   * 9. Footer: inject next-page media, copy-email button
   * ------------------------------------------------------------------ */
  var footerFig = document.querySelector('.footer_bottom__GUCpH figure');
  if (footerFig && !footerFig.querySelector('img')) {
    var img = document.createElement('img');
    img.src = 'assets/images/2c4e607572f312f55b90932bea200efc233971e4-1920x1080.jpg';
    img.alt = 'Next page preview';
    img.loading = 'lazy';
    footerFig.appendChild(img);
  }

  var copyBtn = document.querySelector('button[aria-label="Copy email address"]');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = 'hello@preymaker.com';
      var span = copyBtn.querySelector('span');
      function done() {
        if (span) {
          span.className = 'footer_copied__I3XYU';
          span.textContent = 'Copied';
          setTimeout(function () { span.textContent = ''; span.className = ''; }, 2000);
        }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, done);
      } else { done(); }
    });
  }

  /* ------------------------------------------------------------------ *
   * 10. Cookie banner
   *     The original animates the fixed white pill from height:0 to
   *     auto shortly after the page becomes visible.
   * ------------------------------------------------------------------ */
  var cookieBanner = document.querySelector('.cookie-banner_cookie_banner__CJ8LS');
  var cookieOpen = false;

  function setCookieHeight(open) {
    if (!cookieBanner) return;
    var header = cookieBanner.querySelector('.cookie-banner_header__83vYQ');
    var content = cookieBanner.querySelector('.cookie-banner_content__ev3Mq');
    var h = header ? header.offsetHeight : 50;
    if (open && content) h += content.offsetHeight;
    if (gsapOK) gsap.to(cookieBanner, { height: h, duration: 0.8, ease: 'power3.out' });
    else cookieBanner.style.height = h + 'px';
    cookieOpen = open;
  }

  function dismissCookie() {
    if (!cookieBanner) return;
    if (gsapOK) {
      gsap.to(cookieBanner, {
        height: 0, opacity: 0, duration: 0.5, ease: 'power3.in',
        onComplete: function () { cookieBanner.style.display = 'none'; }
      });
    } else {
      cookieBanner.style.display = 'none';
    }
  }

  if (cookieBanner) {
    if (!cookieBanner.querySelector('.cookie-banner_content__ev3Mq')) {
      var content = document.createElement('div');
      content.className = 'cookie-banner_content__ev3Mq';
      content.innerHTML =
        '<div class="cookie-banner_inner__7SfV0">' +
          '<span class="cookie-banner_line__FEeqH"></span>' +
          '<p class="text-s">We use cookies to ensure that you have the best experience on our website. ' +
          'View our <a class="underline" href="#">Privacy Policy</a>.</p>' +
        '</div>';
      cookieBanner.appendChild(content);
      var rules = 'height:0;overflow:hidden;';
      content.setAttribute('style', rules);
    }

    setTimeout(function () { setCookieHeight(false); }, 450);

    ['cookie-manage', 'cookie-accept'].forEach(function (id) {
      var b = document.getElementById(id);
      if (!b) return;
      b.addEventListener('click', function () {
        var contentEl = cookieBanner.querySelector('.cookie-banner_content__ev3Mq');
        if (id === 'cookie-manage') {
          if (contentEl) contentEl.style.height = cookieOpen ? '0' : 'auto';
          setCookieHeight(!cookieOpen);
        } else {
          dismissCookie();
        }
      });
    });
  }

  /* ------------------------------------------------------------------ *
   * 11. Preloader + entrance timeline
   * ------------------------------------------------------------------ */
  var preloader = document.querySelector('.preloader_preloader__Bt96D');
  var counterEl = document.querySelector('.preloader-number');

  function startEntrance() {
    html.classList.add('loaded');
    html.classList.add('visible');
    updateProgress();
    if (gsapOK && window.ScrollTrigger) ScrollTrigger.refresh();

    if (gsapOK) {
      var heroFig = document.querySelector('.hero_hero__Sbbfz figure');
      if (heroFig) {
        gsap.fromTo(heroFig, { '--hero-entrance': 0 }, { '--hero-entrance': 1, duration: 2.4, ease: 'power2.out' });
      }
      if (heroTitle) {
        var words = heroTitle.querySelectorAll('div > div');
        gsap.fromTo(words,
          { yPercent: 125 },
          { yPercent: 0, duration: 1.5, ease: 'power4.out', stagger: 0.06, delay: 0.1 });
      }
      var scrollHint = document.querySelector('.hero_scroll__jtd6L');
      if (scrollHint) gsap.fromTo(scrollHint, { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.2 });
      if (nav) gsap.to(nav, { opacity: 1, duration: 1, delay: 0.4, ease: 'power2.out' });
    } else {
      if (nav) nav.style.opacity = '1';
    }
    playInView(document.querySelector('.hero_hero__Sbbfz') || document.body, true);
  }

  function runPreloader() {
    if (!preloader) { startEntrance(); return; }
    if (!gsapOK) {
      preloader.style.opacity = '1';
      if (counterEl) counterEl.textContent = '100%';
      setTimeout(function () {
        preloader.style.display = 'none';
        startEntrance();
      }, 600);
      return;
    }
    var loading = preloader.querySelector('.preloader_inner__ge5Dm p:not(.preloader-number)');
    var counterWords = counterEl ? counterEl.querySelectorAll('div > div') : [];
    var state = { n: 0 };

    var tl = gsap.timeline({
      onComplete: function () {
        preloader.style.display = 'none';
      }
    });
    tl.to(preloader, { opacity: 1, duration: 0.35, ease: 'power2.out' })
      .fromTo(loading ? loading.querySelectorAll('div > div') : [],
        { yPercent: 125 }, { yPercent: 0, duration: 0.55, ease: 'power4.out', stagger: 0.015 }, 0.1)
      .fromTo(counterWords,
        { yPercent: 125 }, { yPercent: 0, duration: 0.55, ease: 'power4.out', stagger: 0.025 }, 0.15)
      .to(state, {
        n: 100, duration: 1.35, ease: 'power2.inOut',
        onUpdate: function () {
          if (counterEl) {
            counterEl.textContent = String(Math.round(state.n)).padStart(3, '0') + '%';
          }
        }
      }, 0.2)
      .to(preloader, {
        opacity: 0, duration: 0.7, ease: 'power2.inOut', delay: 0.15,
        onStart: startEntrance
      });
  }

  var preloaderStarted = false;
  function bootOnce() {
    if (preloaderStarted) return;
    preloaderStarted = true;
    runPreloader();
  }

  function boot() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bootOnce, { once: true });
    } else {
      bootOnce();
    }
    /* safety: never let the overlay trap the page */
    setTimeout(bootOnce, 2500);
  }

  boot();
})();
