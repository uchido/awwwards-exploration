/* ==========================================================================
   Zirka — interceptor site clone
   Interaction layer ported from the original inline scripts of zrk.technology
   (Webflow + GSAP + Lenis). Local, dependency-light, order matters.
   ========================================================================== */

/* --------------------------------------------------------------------------
   0. Wait for libs
   -------------------------------------------------------------------------- */
function whenReady(fn) {
  if (document.readyState !== 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

/* --------------------------------------------------------------------------
   1. Smooth scroll (Lenis) + ScrollTrigger wiring
   -------------------------------------------------------------------------- */
function initLenis() {
  if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    lerp: 0.05,
    smoothWheel: true,
    wheelMultiplier: 0.7,
    gestureOrientation: 'vertical',
    normalizeWheel: true,
    smoothTouch: false,
  });
  window.lenis = lenis;

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });

  window.addEventListener('load', () => {
    if (window.innerWidth > 767) setTimeout(() => lenis.scrollTo(0, { immediate: true }), 0);
  });
}

/* --------------------------------------------------------------------------
   2. Header scroll progress bar
   -------------------------------------------------------------------------- */
function initHeaderProgress() {
  const fill = document.querySelector('.progress-fill');
  if (!fill) return;
  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    fill.style.width = (scrollTop / docHeight) * 100 + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   3. Kyiv clock(s)
   -------------------------------------------------------------------------- */
function initKyivTime() {
  function fmt(opts) {
    return new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: 'Europe/Kyiv' }, opts)).format(new Date());
  }
  const el = document.querySelector('.time');
  if (el) {
    const tick = () => { el.textContent = fmt({ hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); };
    tick(); setInterval(tick, 1000);
  }
  const dateEl = document.querySelector('.date');
  const timeEl = document.querySelector('.time-w');
  const utcEl = document.querySelector('.time-utc');
  if (dateEl && timeEl) {
    const tick2 = () => {
      const now = new Date();
      const parts = Object.fromEntries(
        new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', day: '2-digit', month: '2-digit', year: 'numeric' })
          .formatToParts(now).map((p) => [p.type, p.value])
      );
      dateEl.textContent = `${parts.day} ${parts.month} ${parts.year}`;
      const tp = Object.fromEntries(
        new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Kyiv', hour: '2-digit', minute: '2-digit', hour12: false })
          .formatToParts(now).map((p) => [p.type, p.value])
      );
      timeEl.textContent = `${tp.hour} ${tp.minute}`;
      const kyiv = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Kyiv' }));
      const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const off = Math.round((kyiv.getTime() - utc.getTime()) / 3600000);
      if (utcEl) utcEl.textContent = `UTC ${off >= 0 ? '+' : ''}${off}`;
    };
    tick2(); setInterval(tick2, 1000);
  }
}

/* --------------------------------------------------------------------------
   4. Custom cursor + tracking readout
   -------------------------------------------------------------------------- */
function initCursor() {
  const cursor = document.querySelector('.custom-cursor');
  if (!cursor) return;
  const img = cursor.querySelector('img');
  let mouseX = 0, mouseY = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
  (function animate() {
    cx += (mouseX - cx) * 0.15;
    cy += (mouseY - cy) * 0.15;
    cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  })();
  document.querySelectorAll('a, button, .link').forEach((el) => {
    el.addEventListener('mouseenter', () => { img.style.transform = 'rotate(90deg) scale(1.2)'; });
    el.addEventListener('mouseleave', () => { img.style.transform = 'rotate(0deg) scale(1)'; });
  });
  document.addEventListener('mousedown', () => { img.style.transform = 'rotate(90deg) scale(1.35)'; });
  document.addEventListener('mouseup', () => { img.style.transform = 'rotate(0deg) scale(1)'; });
}

function initTracking() {
  const xEl = document.querySelector('.traking-area .x');
  const yEl = document.querySelector('.traking-area .y');
  if (!xEl || !yEl) return;
  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  (function render() {
    xEl.textContent = mx; yEl.textContent = my;
    requestAnimationFrame(render);
  })();
}

/* --------------------------------------------------------------------------
   5. Footer glow follows the mouse
   -------------------------------------------------------------------------- */
function initFooterGlow() {
  const footer = document.querySelector('.footer-2');
  const glow = footer && footer.querySelector('.footer-glow');
  if (!footer || !glow) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const SMOOTH = 0.04;
  footer.addEventListener('mouseenter', (e) => {
    const r = footer.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
    cx = tx; cy = ty;
    glow.style.opacity = '1';
  });
  footer.addEventListener('mousemove', (e) => {
    const r = footer.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top;
  });
  footer.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  (function loop() {
    cx += (tx - cx) * SMOOTH; cy += (ty - cy) * SMOOTH;
    glow.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();
}

/* --------------------------------------------------------------------------
   6. Text splitting helpers
   -------------------------------------------------------------------------- */
function splitText(el) {
  if (!el || el.dataset.splitted === 'true') return;
  el.dataset.splitted = 'true';
  const originalText = el.dataset.originalText || el.textContent.trim();
  el.dataset.originalText = originalText;
  el.innerHTML = '';
  const words = originalText.split(' ');
  words.forEach((word, wIndex) => {
    const wordSpan = document.createElement('span');
    wordSpan.classList.add('split-word');
    wordSpan.style.setProperty('--word', wIndex + 1);
    [...word].forEach((char, cIndex) => {
      const charSpan = document.createElement('span');
      charSpan.classList.add('split-char');
      charSpan.style.setProperty('--char', cIndex + 1);
      charSpan.textContent = char;
      wordSpan.appendChild(charSpan);
    });
    el.appendChild(wordSpan);
    el.appendChild(document.createTextNode(' '));
  });
}

function activateText(el) {
  if (!el) return;
  splitText(el);
  el.setAttribute('data-text-fade-in', '');
  void el.offsetWidth;
  requestAnimationFrame(() => el.classList.add('is-inview'));
}

function resetText(el) {
  if (!el) return;
  el.removeAttribute('data-text-fade-in');
  el.classList.remove('is-inview');
  el.dataset.splitted = 'false';
  if (el.dataset.originalText) el.textContent = el.dataset.originalText;
}

/* --------------------------------------------------------------------------
   7. data-text-fade-in scroll observer (typed reveal)
   -------------------------------------------------------------------------- */
function initTextFadeReveals() {
  const els = document.querySelectorAll('[data-text-fade-in]');
  let lastScroll = window.scrollY;
  let scrollDir = 'down';
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    scrollDir = current > lastScroll ? 'down' : 'up';
    lastScroll = current;
  }, { passive: true });

  els.forEach((el) => {
    const delay = String(el.getAttribute('delay') || '0').replace(',', '.') || '0';
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          clearTimeout(el.delayTimeout);
          el.delayTimeout = setTimeout(() => el.classList.add('is-inview'), parseFloat(delay) * 1000);
        } else if (scrollDir === 'up') {
          clearTimeout(el.delayTimeout);
          el.classList.remove('is-inview');
        }
      });
    }, { threshold: 0.3 });
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   8. Preloader: percent counter, decrypt, orange sweep, slide away
   -------------------------------------------------------------------------- */
function initPreloader() {
  if (typeof gsap === 'undefined') return;
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;

  const left = preloader.querySelector('.preloader-center-left');
  const right = preloader.querySelector('.preloader-center-right');
  const orange = preloader.querySelector('.orange-preloader');
  const percent = preloader.querySelector('.percent');
  const textWrap = document.querySelector('.step-1-top-text-wrap');
  const sectionName = document.querySelector('.section-name');
  const textDivs = textWrap ? [...textWrap.querySelectorAll('div')] : [];

  gsap.set(preloader, { yPercent: 0, backgroundColor: '#050505', opacity: 1 });
  if (orange) gsap.set(orange, { width: '0.55556rem', height: '0.55556rem' });
  if (sectionName) gsap.set(sectionName, { opacity: 0 });
  textDivs.forEach((div) => { div.dataset.original = div.textContent; });

  const counter = { value: 0 };
  if (percent) {
    gsap.to(counter, {
      value: 100, duration: 3.2, ease: 'none',
      onUpdate: () => { percent.textContent = `${Math.floor(counter.value)}%`; },
    });
  }

  const tl = gsap.timeline();
  if (left && right) {
    tl.to(left, { x: '-21vw', duration: 0.7, ease: 'power3.inOut' }, 1);
    tl.to(right, { x: '21vw', duration: 0.7, ease: 'power3.inOut' }, 1);
    tl.to(left, { x: '-43.7vw', duration: 0.9, ease: 'power4.inOut' }, 2);
    tl.to(right, { x: '42vw', duration: 0.9, ease: 'power4.inOut' }, 2);
  }
  if (orange) {
    tl.to(orange, { width: '28rem', height: '28rem', duration: 0.55, ease: 'power2.inOut' }, 2.35);
    tl.to(orange, { width: '65rem', height: '50rem', duration: 0.6, ease: 'power2.out' }, 2.95);
    tl.to(orange, { width: '100rem', height: '65rem', duration: 0.75, ease: 'power3.out' }, 3.6);
  }
  tl.to(preloader, { backgroundColor: 'rgba(5,5,5,1)', duration: 0.1, ease: 'power2.out' }, 3.7);

  let isSequencePlayed = false;

  tl.to(preloader, {
    yPercent: -280, duration: 2.35, ease: 'power3.inOut',
    onStart: () => {
      if (textDivs.length) gsap.delayedCall(1, () => startTextDecrypt(textDivs));
      if (sectionName) gsap.delayedCall(1, () => gsap.to(sectionName, { opacity: 1, duration: 1, ease: 'power2.out' }));
    },
    onUpdate: function () {
      if (window.innerWidth > 767 && this.progress() >= 0.45 && !isSequencePlayed) {
        isSequencePlayed = true;
        if (typeof window.playSequenceFirstHalf === 'function') window.playSequenceFirstHalf();
      }
    },
    onComplete: () => { preloader.style.display = 'none'; },
  }, 3.7);

  function startTextDecrypt(divs) {
    const chars = 'XO#*@!&?%ABR60$';
    divs.forEach((div, index) => {
      const finalText = div.dataset.original;
      gsap.delayedCall(index * 0.06, () => {
        let iteration = 0;
        const interval = setInterval(() => {
          div.textContent = finalText
            .split('')
            .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < iteration) return finalText[i];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          iteration += 1;
          if (iteration >= finalText.length) { clearInterval(interval); div.textContent = finalText; }
        }, 18);
      });
    });
  }
}

/* --------------------------------------------------------------------------
   9. Hero: canvas frame scrub + video2 trigger
   -------------------------------------------------------------------------- */
function initHeroSequence() {
  const section = document.querySelector('.section-hero-h');
  const canvasWrapper = document.querySelector('.canvas-wrapper-hero');
  const canvas = canvasWrapper && canvasWrapper.querySelector('canvas');
  const video2 = document.getElementById('video2');
  if (typeof gsap === 'undefined') return;

  if (video2) {
    video2.preload = 'auto';
    video2.pause();
    video2.loop = true;
  }

  const isDesktop = window.innerWidth > 767;
  let images = [], totalFrames = 0, midFrame = 0, currentFrame = 0, ctx = null;

  if (canvas && isDesktop && typeof frameUrls5 !== 'undefined') {
    const optimizedFrames = frameUrls5.filter((_, i) => i % 2 === 0);
    totalFrames = optimizedFrames.length;
    midFrame = Math.floor(totalFrames / 2);
    ctx = canvas.getContext('2d');

    window.drawSequenceFrame = function (index) {
      if (!ctx || !images[index] || !images[index].complete) return;
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const img = images[index];
      const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * ratio) / 2;
      const y = (canvas.height - img.height * ratio) / 2;
      ctx.drawImage(img, x, y, img.width * ratio, img.height * ratio);
    };

    optimizedFrames.forEach((src) => {
      const img = new Image();
      img.src = src;
      images.push(img);
    });
    images[0].onload = () => window.drawSequenceFrame(0);
  }

  window.playSequenceFirstHalf = function () {
    if (!canvas || !isDesktop || totalFrames === 0) return;
    const seqObj = { frame: 0 };
    gsap.to(seqObj, {
      frame: midFrame - 1,
      roundProps: 'frame',
      duration: 2,
      ease: 'none',
      onUpdate: () => { currentFrame = seqObj.frame; window.drawSequenceFrame(currentFrame); },
    });
  };

  if (!section || !video2) return;

  let video2Started = false;
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  function update(scrollY) {
    const vh = window.innerHeight;
    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const height = rect.height;
    const passed = scrollY + vh - top;
    const progress = clamp(passed / (height + vh), 0, 1);

    const v1Start = 0.09, v1End = 0.17;
    if (isDesktop && canvas && totalFrames > 0 && progress >= v1Start && progress <= v1End) {
      const p = (progress - v1Start) / (v1End - v1Start);
      const targetFrame = midFrame + Math.round(p * (totalFrames - 1 - midFrame));
      if (targetFrame !== currentFrame) { currentFrame = targetFrame; window.drawSequenceFrame(currentFrame); }
    }

    const v2Start = 0.175;
    if (progress >= v2Start && !video2Started) {
      video2.currentTime = 0;
      video2.play();
      video2Started = true;
    }
  }

  function waitForLenis(cb) {
    if (window.lenis && window.lenis.on) return cb(window.lenis);
    requestAnimationFrame(() => waitForLenis(cb));
  }
  if (window.lenis && window.lenis.on) waitForLenis((lenis) => lenis.on('scroll', ({ scroll }) => update(scroll)));
  else window.addEventListener('scroll', () => update(window.scrollY), { passive: true });
}

/* --------------------------------------------------------------------------
   10. Hero step-2 spec rows + lotties (replaces Webflow IX2 targets)
   -------------------------------------------------------------------------- */
function initHeroSteps() {
  const hero = document.querySelector('.section-hero-h');
  if (!hero || typeof gsap === 'undefined') return;

  const rows = [1, 2, 3, 4, 5].map((n) => ({
    texts: [...document.querySelectorAll(`.step-item-text.step_${n}`)],
    lottie: document.querySelector(`.lot-${n}`),
  }));

  let anims = [];
  if (typeof lottie !== 'undefined') {
    rows.forEach((row) => {
      if (!row.lottie) return;
      const anim = lottie.loadAnimation({
        container: row.lottie,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: row.lottie.dataset.src,
      });
      anims.push(anim);
    });
  }

  rows.forEach((row) => { row.texts.forEach((t) => gsap.set(t, { opacity: 0.25 })); });

  const rowsScroll = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      rows.forEach((row, i) => {
        const start = 0.14 + i * 0.165;
        const end = start + 0.165;
        const active = p >= start && p < end;
        row.texts.forEach((t) => gsap.to(t, { opacity: active ? 1 : 0, duration: 0.3, overwrite: 'auto' }));
        const anim = anims[i];
        if (anim && active) anim.playSegments([0, anim.totalFrames || 180], true);
        else if (anim && !active) anim.goToAndStop(0, true);
      });
    },
  });
}

/* --------------------------------------------------------------------------
   11. bg-v-st: circular clip reveal of the background video
   -------------------------------------------------------------------------- */
function initBgVideoReveal() {
  const el = document.querySelector('.bg-v-st');
  if (!el || typeof gsap === 'undefined') return;
  let isOpen = false, animating = false;
  gsap.set(el, { opacity: 0, clipPath: 'circle(0% at 50% 50%)', willChange: 'clip-path, opacity' });

  function openReveal() {
    if (animating) return;
    animating = true; isOpen = true;
    gsap.to(el, { opacity: 1, duration: 0.8 });
    gsap.to(el, {
      clipPath: 'circle(150% at 50% 50%)', duration: 2.2, ease: 'power4.inOut',
      onComplete: () => { animating = false; },
    });
  }
  function resetReveal() {
    if (animating) return;
    isOpen = false;
    gsap.set(el, { clipPath: 'circle(0% at 50% 50%)', opacity: 0 });
  }

  /* the element itself is position:fixed, so anchor the trigger to the
     hero section that precedes it in the document flow (as IX2 did) */
  const anchor = document.querySelector('.section-hero-h') || el;
  ScrollTrigger.create({
    trigger: anchor,
    start: 'bottom 55%',
    end: '+=120vh',
    onToggle: (self) => { self.isActive ? (!isOpen && openReveal()) : (isOpen && resetReveal()); },
  });
}

/* --------------------------------------------------------------------------
   12. Vertical lines grow over the video layer
   -------------------------------------------------------------------------- */
function initLineWrap() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.line-wrap').forEach((wrap) => {
    const items = [...wrap.querySelectorAll('.line-wrap-item')];
    const shuffled = gsap.utils.shuffle(items);
    gsap.set(items, { height: '0vh', transformOrigin: 'bottom center' });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrap, start: 'top 85%', end: 'bottom 100%', scrub: 1 },
    });
    shuffled.forEach((item, i) => {
      tl.to(item, { height: '100vh', ease: 'none', duration: 1 }, i * 0.08 + Math.random() * 0.2);
    });
  });
}

/* --------------------------------------------------------------------------
   13. [scrub] text scramble decode
   -------------------------------------------------------------------------- */
function initScrubScramble() {
  if (typeof gsap === 'undefined') return;
  const chars = 'XO#*@!&?%ABR60$';
  document.querySelectorAll('[scrub]').forEach((el) => {
    const originalText = el.textContent;
    const length = originalText.length;
    if (!length) return;
    const state = { progress: 0 };
    const tween = gsap.to(state, {
      progress: 1, duration: 0.8, ease: 'power1.out', paused: true,
      onUpdate: () => {
        const revealCount = Math.floor(length * state.progress);
        let output = '';
        for (let i = 0; i < length; i++) {
          output += i < revealCount ? originalText[i] : chars[Math.floor(Math.random() * chars.length)];
        }
        el.textContent = output;
      },
      onComplete: () => { el.textContent = originalText; },
    });
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => tween.play(0),
      onEnterBack: () => tween.play(0),
      onLeave: () => tween.progress(1),
      onLeaveBack: () => { tween.progress(0); el.textContent = originalText; },
    });
  });
}

/* --------------------------------------------------------------------------
   14. Launches odometer: 2 000 <-> 99 000 with regional text crossfade
   -------------------------------------------------------------------------- */
function initLaunchesCounter() {
  if (typeof gsap === 'undefined' || typeof Observer === 'undefined') return;
  gsap.registerPlugin(Observer);

  const sectionWrap = document.querySelector('.number-sec-wrap');
  const section = sectionWrap && sectionWrap.querySelector('.number-sec');
  const digits = sectionWrap && sectionWrap.querySelector('#digits');
  if (!sectionWrap || !digits) return;

  const SPIN_ROWS = 5, ROLL_DURATION = 1.05, COLUMN_STAGGER = 0.06;
  const OPACITY_THRESHOLD = 0.99;
  const SLOT_PADDING_DESKTOP = 6, SLOT_PADDING_MOBILE = 5;
  const TEXT_OUT_DURATION = 0.35, TEXT_IN_START = 0.2, TEXT_IN_DURATION = 0.65;
  const GESTURE_DISTANCE = 180, GESTURE_DELAY = 250;
  const TEXT_SPLIT_START = TEXT_IN_START + TEXT_IN_DURATION * 0.03;

  const columns = [];
  let widths = null;
  let currentState = 1;
  let isAnimating = false;
  let releasedUntilOutside = false;
  let resizeTimer = null;
  let previousScrollY = window.scrollY;
  let scrollDirection = 1;
  let gestureDistance = 0, gestureDirection = 0, observerEnabledAt = 0;

  const regionA = sectionWrap.querySelector('#regionA');
  const regionB = sectionWrap.querySelector('#regionB');
  const indexA = sectionWrap.querySelector('#idxA');
  const indexB = sectionWrap.querySelector('#idxB');
  const textPairs = [[regionB, regionA], [indexB, indexA]];

  function isMobile() { return window.innerWidth <= 767; }

  function createDigit(character) {
    const digit = document.createElement('div');
    digit.className = 'd';
    digit.textContent = character;
    return digit;
  }
  function resetGestureProgress() { gestureDistance = 0; gestureDirection = 0; }

  function measureDigits() {
    const styles = getComputedStyle(digits);
    const probe = document.createElement('span');
    probe.setAttribute('aria-hidden', 'true');
    Object.assign(probe.style, {
      position: 'fixed', top: '-9999px', left: '-9999px', display: 'inline-block',
      width: 'max-content', margin: '0', padding: '0', border: '0',
      visibility: 'hidden', pointerEvents: 'none', whiteSpace: 'pre',
      fontFamily: styles.fontFamily, fontSize: styles.fontSize, fontWeight: styles.fontWeight,
      fontStyle: styles.fontStyle, fontStretch: styles.fontStretch, fontVariant: styles.fontVariant,
      fontFeatureSettings: styles.fontFeatureSettings, letterSpacing: styles.letterSpacing,
      lineHeight: styles.lineHeight,
    });
    document.body.appendChild(probe);
    const measure = (t) => { probe.textContent = t; return probe.getBoundingClientRect().width; };
    const w0 = measure('0'), w9 = measure('9'), w2 = measure('2');
    const measuredSpace = measure('0 0') - w0 - w0;
    const padding = isMobile() ? SLOT_PADDING_MOBILE : SLOT_PADDING_DESKTOP;
    const result = { w0: w0 + padding, w9: w9 + padding, w2: w2 + padding, space: Math.max(measuredSpace, 0) };
    probe.remove();
    return result;
  }

  function getRowHeight() {
    const lh = parseFloat(getComputedStyle(digits).lineHeight);
    return Number.isFinite(lh) ? lh : digits.getBoundingClientRect().height;
  }

  function buildOdometer() {
    widths = measureDigits();
    digits.innerHTML = '';
    columns.length = 0;
    function makeSlot(width, className = '') {
      const slot = document.createElement('div');
      slot.className = `slot${className ? ` ${className}` : ''}`;
      slot.style.width = `${width}px`;
      return slot;
    }
    function addColumn(slot, state1, state2) {
      const strip = document.createElement('div');
      strip.className = 'strip';
      slot.appendChild(strip);
      columns.push({ slot, strip, state1, state2 });
    }
    const leadingSlot = makeSlot(widths.w9, 'slot-leading');
    addColumn(leadingSlot, '', '9');
    const rollingSlot = makeSlot(widths.w2, 'slot-rolling');
    addColumn(rollingSlot, '2', '9');
    const spaceSlot = makeSlot(widths.space, 'slot-space');
    digits.append(leadingSlot, rollingSlot, spaceSlot);
    for (let index = 0; index < 3; index++) {
      const zeroSlot = makeSlot(widths.w0, 'slot-zero');
      addColumn(zeroSlot, '0', '0');
      digits.appendChild(zeroSlot);
    }
    setStateImmediately(currentState);
  }

  function setRestingDigit(column, value) {
    column.strip.innerHTML = '';
    column.strip.appendChild(createDigit(value));
    gsap.set(column.strip, { y: 0 });
  }

  function setStateImmediately(stateNumber) {
    currentState = stateNumber;
    columns.forEach((column) => setRestingDigit(column, stateNumber === 1 ? column.state1 : column.state2));
    if (stateNumber === 1) {
      gsap.set(columns[0].slot, { width: 0 });
      gsap.set(columns[1].slot, { width: widths.w2 });
    } else {
      gsap.set(columns[0].slot, { width: widths.w9 });
      gsap.set(columns[1].slot, { width: widths.w9 });
    }
    textPairs.forEach(([first, second]) => {
      if (!first || !second) return;
      resetText(first); resetText(second);
      gsap.set([first, second], { yPercent: 0 });
      if (stateNumber === 1) {
        gsap.set(first, { opacity: 1 });
        gsap.set(second, { opacity: 0 });
      } else {
        gsap.set(first, { opacity: 0 });
        gsap.set(second, { opacity: 1 });
      }
    });
  }

  function fillStrip(column, from, to, direction) {
    const randomDigits = [];
    for (let i = 0; i < SPIN_ROWS; i++) randomDigits.push(String(Math.floor(Math.random() * 10)));
    const sequence = direction > 0 ? [from, ...randomDigits, to] : [to, ...randomDigits, from];
    column.strip.innerHTML = '';
    sequence.forEach((character) => column.strip.appendChild(createDigit(character)));
    const rowHeight = getRowHeight();
    const travel = (sequence.length - 1) * rowHeight;
    gsap.set(column.strip, { y: direction > 0 ? 0 : -travel });
    return direction > 0 ? -travel : 0;
  }

  function transition(direction) {
    const targetState = direction > 0 ? 2 : 1;
    if (isAnimating || currentState === targetState) return;
    resetGestureProgress();
    isAnimating = true;
    const timeline = gsap.timeline({
      onComplete() {
        currentState = targetState;
        columns.forEach((column) => setRestingDigit(column, targetState === 1 ? column.state1 : column.state2));
        resetGestureProgress();
        isAnimating = false;
      },
    });
    columns.forEach((column, index) => {
      const from = targetState === 2 ? column.state1 : column.state2;
      const to = targetState === 2 ? column.state2 : column.state1;
      const targetY = fillStrip(column, from, to, direction);
      const order = direction > 0 ? index : columns.length - 1 - index;
      timeline.to(column.strip, { y: targetY, duration: ROLL_DURATION, ease: 'expo.out' }, order * COLUMN_STAGGER);
    });
    if (targetState === 2) {
      timeline.to(columns[0].slot, { width: widths.w9, duration: ROLL_DURATION, ease: 'power2.inOut' }, 0);
      timeline.to(columns[1].slot, { width: widths.w9, duration: ROLL_DURATION, ease: 'power2.inOut' }, 0);
    } else {
      timeline.to(columns[0].slot, { width: 0, duration: ROLL_DURATION, ease: 'power2.inOut' }, 0);
      timeline.to(columns[1].slot, { width: widths.w2, duration: ROLL_DURATION, ease: 'power2.inOut' }, 0);
    }
    textPairs.forEach(([first, second]) => {
      if (!first || !second) return;
      const outgoing = targetState === 2 ? first : second;
      const incoming = targetState === 2 ? second : first;
      resetText(incoming);
      gsap.set([outgoing, incoming], { yPercent: 0 });
      gsap.set(incoming, { opacity: 0 });
      timeline.to(outgoing, { opacity: 0, duration: TEXT_OUT_DURATION, ease: 'power2.out' }, 0);
      timeline.to(incoming, { opacity: 1, duration: TEXT_IN_DURATION, ease: 'power2.out' }, TEXT_IN_START);
      timeline.call(() => activateText(incoming), null, TEXT_SPLIT_START);
      timeline.call(() => { resetText(outgoing); gsap.set(outgoing, { opacity: 0, yPercent: 0 }); }, null,
        Math.max(TEXT_OUT_DURATION, TEXT_SPLIT_START));
    });
  }

  function releaseScroll(direction) {
    releasedUntilOutside = true;
    resetGestureProgress();
    scrollObserver.disable();
    window.scrollBy({ top: direction * Math.min(window.innerHeight * 0.18, 160), behavior: 'smooth' });
  }

  function handleGesture(direction) {
    if (isAnimating) return;
    if (currentState === 1 && direction < 0) return releaseScroll(-1);
    if (currentState === 2 && direction > 0) return releaseScroll(1);
    transition(direction);
  }

  const scrollObserver = Observer.create({
    target: window, type: 'wheel,touch', tolerance: 10, preventDefault: true,
    onChangeY(self) {
      if (isAnimating) { resetGestureProgress(); return; }
      const direction = self.deltaY > 0 ? 1 : -1;
      if (gestureDirection !== direction) { gestureDirection = direction; gestureDistance = 0; }
      gestureDistance += Math.abs(self.deltaY);
      const delayPassed = performance.now() - observerEnabledAt >= GESTURE_DELAY;
      if (delayPassed && gestureDistance >= GESTURE_DISTANCE) {
        resetGestureProgress();
        handleGesture(direction);
      }
    },
  });
  scrollObserver.disable();

  function sectionIsActive() {
    const wrapOpacity = parseFloat(getComputedStyle(sectionWrap).opacity);
    const sectionOpacity = section ? parseFloat(getComputedStyle(section).opacity) : 1;
    const rect = sectionWrap.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const inside = rect.top <= center && rect.bottom >= center;
    return wrapOpacity >= OPACITY_THRESHOLD && sectionOpacity >= OPACITY_THRESHOLD && inside;
  }

  function monitorSection() {
    const active = sectionIsActive();
    if (!active && releasedUntilOutside) releasedUntilOutside = false;
    if (active && !releasedUntilOutside && !scrollObserver.isEnabled) {
      setStateImmediately(scrollDirection > 0 ? 1 : 2);
      resetGestureProgress();
      observerEnabledAt = performance.now();
      scrollObserver.enable();
    }
    if (!active && scrollObserver.isEnabled) { resetGestureProgress(); scrollObserver.disable(); }
    requestAnimationFrame(monitorSection);
  }

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    const diff = current - previousScrollY;
    if (Math.abs(diff) > 1) scrollDirection = diff > 0 ? 1 : -1;
    previousScrollY = current;
  }, { passive: true });

  document.fonts && document.fonts.ready
    ? document.fonts.ready.then(buildOdometer).then(monitorSection)
    : (buildOdometer(), monitorSection());

  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (!isAnimating) buildOdometer(); }, 200);
  });
}

/* --------------------------------------------------------------------------
   15. Info section canvas scrub + video4 scrub
   -------------------------------------------------------------------------- */
function initInfoCanvas() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (window.innerWidth < 768) return;

  const FRAME_STEP = 2;
  if (typeof frameUrls1 === 'undefined' || typeof frameUrls2 === 'undefined') return;
  const frames = [...frameUrls1, ...frameUrls2].filter((_, index) => index % FRAME_STEP === 0);

  const canvas = document.querySelector('#canvas');
  const context = canvas && canvas.getContext('2d');
  if (!canvas) return;

  const imageSequence = { frame: 0 };
  const images = frames.map((src) => { const img = new Image(); img.src = src; return img; });

  function resizeCanvas() {
    const wrapper = document.querySelector('.canvas-wrapper');
    if (wrapper) {
      canvas.width = wrapper.offsetWidth;
      canvas.height = wrapper.offsetHeight;
      render();
    }
  }
  window.addEventListener('resize', resizeCanvas);

  function render() {
    const img = images[Math.round(imageSequence.frame)];
    if (!img || !img.complete) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width - img.width * scale) / 2;
    const y = (canvas.height - img.height * scale) / 2;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }

  images[0].onload = () => {
    resizeCanvas();
    gsap.to(imageSequence, {
      frame: images.length - 1,
      ease: 'none',
      snap: 'frame',
      onUpdate: render,
      scrollTrigger: { trigger: '#features', start: 'top top', end: 'bottom bottom', scrub: true },
    });
  };
}

function initVideo4Scrub() {
  const section = document.querySelector('.info-v-wrap-h');
  const video = document.getElementById('video4');
  if (!section || !video || typeof gsap === 'undefined') return;
  video.preload = 'auto';
  video.pause();
  video.loop = true;

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
  const START = 0.23, END = 0.77, DURATION = 8;
  let lastTime = -1;

  function update(scrollY) {
    const vh = window.innerHeight;
    const rect = section.getBoundingClientRect();
    const top = rect.top + scrollY;
    const passed = scrollY + vh - top;
    const progress = clamp(passed / (rect.height + vh), 0, 1);
    if (progress < START || progress > END) return;
    const p = (progress - START) / (END - START);
    const time = snap(p * DURATION);
    if (Math.abs(time - lastTime) > 0.01) { lastTime = time; video.currentTime = time; }
  }
  function snap(v) { return Math.round(v / 0.04) * 0.04; }

  if (window.lenis && window.lenis.on) window.lenis.on('scroll', ({ scroll }) => update(scroll));
  else window.addEventListener('scroll', () => update(window.scrollY), { passive: true });
}

/* --------------------------------------------------------------------------
   16. Card ("Threat") section: step through 5 story cards
   -------------------------------------------------------------------------- */
function initCardSection() {
  const holder = document.querySelector('.card-h');
  if (!holder || typeof gsap === 'undefined') return;

  const leftItems = [...document.querySelectorAll('.card-wr-left-bot-top-text-item')];
  const rightItems = [...document.querySelectorAll('.card-wr-right-item')];
  const topNums = [...document.querySelectorAll('.card-wr-left-top-num')];
  const botNums = [...document.querySelectorAll('.num-1, .num-2, .num-3, .num-4, .num-5')];
  const lineActive = document.querySelector('.card-wr-left-right-line-active');
  const dateTime = document.querySelector('.date-time-wrap');

  const all = [...rightItems, ...leftItems, ...topNums, ...botNums];
  gsap.set(rightItems, { opacity: 0 });
  if (rightItems[0]) gsap.set(rightItems[0], { opacity: 1 });
  leftItems.forEach((el, i) => gsap.set(el, { opacity: i === 0 ? 1 : 0 }));
  topNums.forEach((el, i) => {
    gsap.set(el, { opacity: i === 0 ? 1 : 0 });
    gsap.set(botNums[i], { opacity: i === 0 ? 1 : 0 });
  });
  if (dateTime) gsap.set(dateTime, { opacity: 0, y: 20 });

  const groups = [0, 1, 2, 3, 4].map((i, idx, arr) => ({
    left: leftItems[i], right: rightItems[i], top: topNums[i], bot: botNums[i],
  }));

  ScrollTrigger.create({
    trigger: holder,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const p = self.progress;
      const idx = Math.min(Math.floor(p * 5), 4);
      const local = (p * 5) % 1;
      groups.forEach((g, i) => {
        const op = i === idx ? (i === 0 ? 1 : Math.min(1, local * 3)) : i < idx ? 0 : 0;
        if (g.left) gsap.set(g.left, { opacity: i === 0 && idx === 0 ? 1 : op });
        if (g.right) gsap.set(g.right, { opacity: i === 0 && idx === 0 ? 1 : op });
        if (g.top) gsap.set(g.top, { opacity: i <= idx ? 1 : 0, duration: 0.3 });
        if (g.bot) gsap.set(g.bot, { opacity: i <= idx ? 1 : 0 });
      });
      if (lineActive) gsap.set(lineActive, { height: `${p * 100}%` });
      if (dateTime) gsap.set(dateTime, { opacity: p > 0.02 ? 1 : 0, y: p > 0.02 ? 0 : 20 });
    },
  });

  splitCardTexts();
}

function splitCardTexts() {
  /* headings/paragraphs animate when their item becomes visible (opacity-gated) */
  document.querySelectorAll('.card-wr-left-bot-top-text-item-h').forEach((el) => {
    splitText(el);
    const item = el.closest('.card-wr-left-bot-top-text-item') || el;
    let wasVisible = false;
    const check = () => {
      const op = parseFloat(getComputedStyle(item).opacity);
      if (op >= 0.25 && !wasVisible) el.classList.add('is-inview');
      else if (op < 0.25 && wasVisible) el.classList.remove('is-inview');
      wasVisible = op >= 0.25;
    };
    check();
    new MutationObserver(check).observe(item, { attributes: true, attributeFilter: ['style'] });
  });

  document.querySelectorAll('[scrub]').forEach((el) => {
    const parent = el.closest('.card-wr-right-item') || el;
    let frameRequest, frame = 0;
    const totalFrames = 60;
    const chars = 'XO#*@!&?%ABR60$';
    const originalText = el.textContent;
    let wasVisible = false;

    const render = (progress) => {
      const revealCount = Math.floor(originalText.length * progress);
      let output = '';
      for (let i = 0; i < originalText.length; i++) {
        const char = originalText[i];
        output += char === ' ' ? ' ' : (i < revealCount ? char : chars[Math.floor(Math.random() * chars.length)]);
      }
      el.textContent = output;
    };
    const animateIn = () => {
      cancelAnimationFrame(frameRequest); frame = 0;
      (function loop() {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        render(progress);
        if (progress < 1) frameRequest = requestAnimationFrame(loop);
        else el.textContent = originalText;
      })();
    };
    const check = () => {
      const op = parseFloat(getComputedStyle(parent).opacity);
      if (op >= 0.25 && !wasVisible) animateIn();
      wasVisible = op >= 0.25;
    };
    check();
    new MutationObserver(check).observe(parent, { attributes: true, attributeFilter: ['style'] });
  });
}

/* --------------------------------------------------------------------------
   17. Stat section: bars + counters
   -------------------------------------------------------------------------- */
function initStatSection() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* bars scale as the square root of the weapon cost, 1M = full */
  function parsePriceK(text) {
    if (!text) return null;
    const m = text.replace(/\u00A0/g, ' ').match(/\$\s*(\d+(?:[.,]\d+)?)K?\+?/);
    if (!m) return null;
    let v = parseFloat(m[1].replace(',', '.'));
    if (/M\+?$/.test(text)) v *= 1000;
    return v;
  }
  document.querySelectorAll('.progress-2, .progress-1').forEach((p) => {
    const fill = p.querySelector('[class*="progress-fill"]');
    const item = p.closest('.stat-grid-right-bot-item') || p.closest('.stat-grid-left-bot-bot') || p.parentElement;
    let valueK = null;
    if (item) {
      for (const el of item.querySelectorAll('.stat-grid-left-bot-bot-top-item-h-s, .stat-grid-left-bot-bot-top-item-h')) {
        valueK = parsePriceK(el.textContent);
        if (valueK) break;
      }
    }
    const target = valueK ? `${Math.max(3, Math.min(100, 100 * Math.sqrt(valueK / 1000)))}%` : '5%';
    ScrollTrigger.create({
      trigger: fill,
      start: 'top 92%',
      once: true,
      onEnter: () => gsap.to(fill, { width: target, duration: 1.2, ease: 'power2.out' }),
    });
  });

  /* mouse-follow on the chart image */
  const statGrid2 = document.querySelector('.stat-grid._2');
  const moveImg = document.querySelector('#move') || statGrid2 && statGrid2.querySelector('.image-11');
  if (statGrid2 && moveImg && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const moveX = gsap.quickTo(moveImg, 'x', { duration: 0.8, ease: 'power3.out' });
    const moveY = gsap.quickTo(moveImg, 'y', { duration: 0.8, ease: 'power3.out' });
    statGrid2.addEventListener('mousemove', (event) => {
      const r = statGrid2.getBoundingClientRect();
      const x = ((event.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((event.clientY - r.top) / r.height - 0.5) * 2;
      moveX(x * 20); moveY(y * 20);
    });
    statGrid2.addEventListener('mouseleave', () => { moveX(0); moveY(0); });
  }
}

/* --------------------------------------------------------------------------
   18. new-sec: split fade + abs overlay choreography
   -------------------------------------------------------------------------- */
function initNewSec() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const wrap = document.querySelector('.new-sec');
  if (!wrap) return;

  gsap.set(wrap, { opacity: 0 });
  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 45%',
    end: 'bottom 55%',
    onToggle: (self) => gsap.to(wrap, { opacity: self.isActive ? 1 : 0, duration: 0.6 }),
  });

  const abs = wrap.querySelector('.abs-new-wrap');
  const heading = wrap.querySelector('.abs-new-wrap-top-heading');
  const image = wrap.querySelector('.abs-new-wrap-top-img');
  const topTexts = abs ? [...abs.querySelectorAll('.abs-new-wrap-center > .bt-mono-1.white.op-4.max-w-13')] : [];
  const line = abs && abs.querySelector('.top-line-new-sec');
  const bottomItems = abs ? [...abs.querySelectorAll('.abs-new-wrap-bot-item')] : [];

  if (!abs || !heading) return;
  splitText(heading);

  let started = false, timeouts = [], animations = [];
  const ease = 'cubic-bezier(0.22, 1, 0.36, 1)';

  function clearAll() {
    timeouts.forEach(clearTimeout);
    timeouts = [];
    animations.forEach((a) => { try { a.cancel(); } catch (e) {} });
    animations = [];
  }
  function addTimeout(cb, delay) { timeouts.push(setTimeout(cb, delay)); }
  function animateEl(element, duration, delay = 0, from = { opacity: 0, transform: 'translateY(30px)' }) {
    if (!element) return;
    const a = element.animate([{ ...from }, { opacity: 1, transform: 'translateY(0)' }],
      { duration, delay, easing: ease, fill: 'forwards' });
    animations.push(a);
  }
  function reset() {
    clearAll(); started = false;
    if (image) { image.style.opacity = '0'; image.style.transform = 'translateY(40px)'; }
    heading.classList.remove('is-inview');
    topTexts.forEach((t) => { t.style.opacity = '0'; t.style.transform = 'translateY(30px)'; });
    if (line) line.style.width = '0%';
    bottomItems.forEach((item) => {
      const text = item.querySelector('.bt-mono-1.white');
      const num = item.querySelector('.abs-new-wrap-bot-item-num');
      const itemLine = item.querySelector('.abs-new-wrap-bot-item-line');
      if (text) { text.style.opacity = '0'; text.style.transform = 'translateY(20px)'; }
      if (itemLine) itemLine.style.height = '0.1rem';
      if (num) { num.style.opacity = '0'; num.style.transform = 'translateY(40px)'; }
    });
  }
  function start() {
    if (started) return;
    started = true;
    heading.classList.add('is-inview');
    if (image) {
      animations.push(image.animate(
        [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 1200, easing: ease, fill: 'forwards' }));
    }
    addTimeout(() => {
      if (line) animations.push(line.animate([{ width: '0%' }, { width: '100%' }],
        { duration: 1100, easing: ease, fill: 'forwards' }));
      topTexts.forEach((text, i) => animateEl(text, 1000, i * 150));
    }, 500);
    addTimeout(() => {
      bottomItems.forEach((item, i) => {
        const delay = i * 200;
        const text = item.querySelector('.bt-mono-1.white');
        const itemLine = item.querySelector('.abs-new-wrap-bot-item-line');
        const num = item.querySelector('.abs-new-wrap-bot-item-num');
        if (text) animations.push(text.animate(
          [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 900, delay, easing: ease, fill: 'forwards' }));
        if (itemLine) animations.push(itemLine.animate(
          [{ height: '0.1rem' }, { height: '6.67rem' }],
          { duration: 1000, delay: delay + 100, easing: ease, fill: 'forwards' }));
        if (num) animations.push(num.animate(
          [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 1100, delay: delay + 200, easing: ease, fill: 'forwards' }));
      });
    }, 800);
  }

  function check() {
    const op = parseFloat(getComputedStyle(abs).opacity);
    (op >= 0.15) ? start() : reset();
  }
  reset(); check();
  new MutationObserver(check).observe(abs, { attributes: true, attributeFilter: ['style'] });
}

/* --------------------------------------------------------------------------
   19. ppo: marquee speed control + video autoplay
   -------------------------------------------------------------------------- */
function initPpo() {
  const ppoWrap = document.querySelector('.ppo-wrap');
  const animatedItems = [...document.querySelectorAll('.ppo-text-item')];
  if (!ppoWrap || !animatedItems.length) return;

  const BASE_SPEED = 1, MAX_SPEED = 6, SPEED_MULTIPLIER = 2.5, SCROLL_TIMEOUT = 120, SMOOTHNESS = 0.08;
  let lastScrollY = window.scrollY, lastEventTime = performance.now(), lastScrollTime = 0;
  let direction = 1, currentRate = BASE_SPEED, targetRate = BASE_SPEED, sectionIsVisible = false;

  requestAnimationFrame(() => {
    animatedItems.flatMap((item) => item.getAnimations()).forEach((animation) => {
      const duration = Number(animation.effect && animation.effect.getTiming().duration);
      if (Number.isFinite(duration) && duration > 0) {
        animation.currentTime = duration * 1000 + (Number(animation.currentTime) || 0);
      }
    });
  });

  window.addEventListener('scroll', () => {
    const now = performance.now();
    const diff = window.scrollY - lastScrollY;
    const dt = Math.max(now - lastEventTime, 1);
    if (Math.abs(diff) > 1) {
      direction = diff > 0 ? 1 : -1;
      const velocity = Math.abs(diff) / dt;
      targetRate = direction * Math.min(BASE_SPEED + velocity * SPEED_MULTIPLIER, MAX_SPEED);
      lastScrollTime = now;
    }
    lastScrollY = window.scrollY;
    lastEventTime = now;
  }, { passive: true });

  (function updateSpeed() {
    if (performance.now() - lastScrollTime > SCROLL_TIMEOUT) targetRate = direction * BASE_SPEED;
    currentRate += (targetRate - currentRate) * SMOOTHNESS;
    if (sectionIsVisible) {
      animatedItems.flatMap((i) => i.getAnimations()).forEach((a) => {
        a.updatePlaybackRate ? a.updatePlaybackRate(currentRate) : (a.playbackRate = currentRate);
      });
    }
    requestAnimationFrame(updateSpeed);
  })();

  new IntersectionObserver(([entry]) => {
    sectionIsVisible = entry.isIntersecting;
    ppoWrap.classList.toggle('is-playing', sectionIsVisible);
  }, { threshold: 0.1 }).observe(ppoWrap);

  const ppo = ppoWrap.querySelector('.ppo') || ppoWrap;
  const video = document.querySelector('#video-story');
  if (video) {
    let hasPlayed = false;
    video.loop = true;
    video.muted = true;
    const checkOpacity = () => {
      const op = parseFloat(getComputedStyle(ppo).opacity);
      if (!hasPlayed && op > 0.3) { hasPlayed = true; video.play().catch(() => {}); }
    };
    setInterval(checkOpacity, 200);
  }
}

/* --------------------------------------------------------------------------
   20. Hover area: system component autoplay
   -------------------------------------------------------------------------- */
function initHoverArea() {
  const container = document.querySelector('.hover-area-wrap-bot');
  const items = Array.from(document.querySelectorAll('.hover-area-wrap-bot-item'));
  const images = document.querySelectorAll("[class*='image-h-']");
  const topBlock = document.querySelector('.info-v-info-wrap-top.set-2');
  if (typeof gsap === 'undefined') return;

  let activeIndex = 0, autoplay = null, progressTween = null, isActive = false;

  function getImages(index) {
    const setNum = index + 1;
    const desktop = document.querySelector(`.image-h-${setNum}:not(.mob)`);
    const mobile = document.querySelector(`.image-h-${setNum}.mob`);
    return [desktop, mobile].filter(Boolean);
  }
  function clearItemState(item) {
    if (!item) return;
    const icon = item.querySelector('.hover-area-wrap-bot-item-icon.hover');
    const line = item.querySelector('.system-progress-line');
    gsap.killTweensOf([icon, line]);
    gsap.set(icon, { opacity: 0 });
    gsap.set(line, { height: '0%' });
  }
  function resetUI() {
    gsap.killTweensOf('*');
    gsap.to(items, { opacity: 1, duration: 0.4, overwrite: true });
    gsap.to('.hover-area-wrap-bot-item .hover-area-wrap-bot-item-icon.hover', { opacity: 0, duration: 0.3 });
    gsap.to(images, { opacity: 0, duration: 0.4, overwrite: true });
  }
  function setActive(index) {
    const prevItem = items[activeIndex];
    if (prevItem && prevItem !== items[index]) clearItemState(prevItem);
    activeIndex = index;
    const item = items[index];
    const others = items.filter((_, i) => i !== index);
    const line = item.querySelector('.system-progress-line');
    const targetImages = getImages(index);
    resetUI();
    gsap.to(others, { opacity: 0.6, duration: 0.4 });
    gsap.to(item, { opacity: 1, duration: 0.4 });
    items.forEach((el) => {
      const i = el.querySelector('.hover-area-wrap-bot-item-icon.hover');
      if (i) gsap.to(i, { opacity: el === item ? 1 : 0, duration: 0.25, overwrite: true });
    });
    gsap.to(images, { opacity: 0, duration: 0.4 });
    targetImages.forEach((img) => gsap.to(img, { opacity: 1, duration: 0.5 }));
    if (container && window.innerWidth <= 991) {
      const scrollPos = item.offsetLeft - container.clientWidth / 2 + item.clientWidth / 2;
      container.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
    gsap.set(line, { height: '0%' });
    if (progressTween) progressTween.kill();
    progressTween = gsap.to(line, { height: '100%', duration: 3, ease: 'none' });
  }
  function next() { setActive((activeIndex + 1) % items.length); }
  function startAutoplay() { stopAutoplay(); autoplay = setInterval(next, 3000); }
  function stopAutoplay() { if (autoplay) clearInterval(autoplay); autoplay = null; }

  function watchVisibility() {
    if (!topBlock) return;
    const observer = new MutationObserver(() => {
      const opacity = parseFloat(getComputedStyle(topBlock).opacity);
      if (opacity === 1 && !isActive) { isActive = true; setActive(0); startAutoplay(); }
      if (opacity < 1 && isActive) { isActive = false; stopAutoplay(); }
    });
    observer.observe(topBlock, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      stopAutoplay();
      setActive(index);
      startAutoplay();
    });
  });

  watchVisibility();
}

/* --------------------------------------------------------------------------
   21. hover-area / wrapper / stat fades that Webflow IX2 used to drive
   -------------------------------------------------------------------------- */
function initSectionFades() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const blocks = [
    { sel: '.hover-area-wrapper', start: 'top 55%', end: 'bottom 15%' },
    { sel: '.stat-wrap', start: 'top 70%', end: 'bottom 30%' },
    { sel: '.number-sec-wrap', start: 'top 60%', end: 'bottom 40%' },
    { sel: '.card-h', start: 'top 20%', end: 'bottom 80%' },
  ];
  blocks.forEach(({ sel, start, end }) => {
    document.querySelectorAll(sel).forEach((el) => {
      const parent = el.classList.contains('number-sec-wrap') ? el : el.querySelector(':scope > div') || el;
      gsap.set(parent, { opacity: 0 });
      ScrollTrigger.create({
        trigger: el, start, end,
        onToggle: (self) => gsap.to(parent, { opacity: self.isActive ? 1 : 0, duration: 0.7, ease: 'power2.out' }),
      });
    });
  });
}

/* --------------------------------------------------------------------------
   22. shuffle-word text init for ppo subheading & card paragraphs
   -------------------------------------------------------------------------- */
function shuffleWord(word) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

function initShuffleIn(el, parentSel) {
  const text = el.textContent.trim();
  const words = text.split(' ');
  el.innerHTML = '';
  const state = words.map((word) => ({ original: word }));
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.classList.add('shuffle-word');
    span.style.setProperty('--word', i + 1);
    span.textContent = shuffleWord(word);
    el.appendChild(span);
    el.appendChild(document.createTextNode(' '));
  });
  const opacityParent = el.closest(parentSel) || el;
  let wasVisible = false, frame = 0, raf;

  function reset() {
    cancelAnimationFrame(raf); frame = 0;
    el.querySelectorAll('.shuffle-word').forEach((node, i) => {
      node.textContent = shuffleWord(state[i].original);
    });
  }
  function animate() {
    cancelAnimationFrame(raf); frame = 0;
    const nodes = el.querySelectorAll('.shuffle-word');
    (function loop() {
      raf = requestAnimationFrame(loop);
      frame++;
      const progress = Math.min(frame / 60, 1);
      nodes.forEach((node, i) => {
        const original = state[i].original;
        let result = '';
        for (let c = 0; c < original.length; c++) {
          result += Math.random() < progress ? original[c] : shuffleWord(original)[c];
        }
        node.textContent = result;
      });
      if (progress >= 1) {
        cancelAnimationFrame(raf);
        nodes.forEach((node, i) => { node.textContent = state[i].original; });
      }
    })();
  }
  function check() {
    const op = parseFloat(getComputedStyle(opacityParent).opacity);
    if (op >= 0.25 && !wasVisible) animate();
    if (op < 0.25 && wasVisible) reset();
    wasVisible = op >= 0.25;
  }
  check();
  new MutationObserver(check).observe(opacityParent, { attributes: true, attributeFilter: ['style'] });
}

/* --------------------------------------------------------------------------
   BOOT
   -------------------------------------------------------------------------- */
whenReady(() => {
  initLenis();
  initHeaderProgress();
  initKyivTime();
  initCursor();
  initTracking();
  initFooterGlow();
  initTextFadeReveals();
  initPreloader();
  initHeroSequence();
  initHeroSteps();
  initBgVideoReveal();
  initLineWrap();
  initScrubScramble();
  initLaunchesCounter();
  initInfoCanvas();
  initVideo4Scrub();
  initCardSection();
  initStatSection();
  initNewSec();
  initPpo();
  initHoverArea();
  initSectionFades();

  /* shuffle texts */
  document.querySelectorAll('.full-block-item-2 .bt-mono-1.white.set-ppo').forEach((el) => {
    initShuffleIn(el, '.full-block-item-2');
  });
});
