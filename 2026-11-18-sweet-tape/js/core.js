(() => {
  const gsap = window.gsap || null;
  const ScrollTrigger = window.ScrollTrigger || null;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const REVEALED_EVENT = 'sweettape:revealed';
  let revealed = false;

  if (gsap && ScrollTrigger && gsap.registerPlugin) gsap.registerPlugin(ScrollTrigger);

  const REVEAL = Object.freeze({
    HIDDEN: 130,
    DURATION: 0.6,
    STAGGER: 0.025,
    DELAY: 0.3,
    EASE: 'power3.out'
  });

  const BODY_REVEAL = Object.freeze({
    HIDDEN: 110,
    DURATION: 0.72,
    STAGGER: 0.09,
    EASE: 'power3.out',
    START: 'clamp(top 88%)'
  });

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const lerp = (a, b, t) => a + (b - a) * t;
  const number = (value, fallback = 0) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const cssVar = (element, name) => getComputedStyle(element).getPropertyValue(name).trim();
  const px = (value) => (typeof value === 'number' ? `${value}px` : String(value));
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

  const EASES = {
    'none': 'linear',
    'linear': 'linear',
    'power1.in': 'cubic-bezier(0.32,0,0.67,0)',
    'power1.out': 'cubic-bezier(0.33,1,0.68,1)',
    'power1.inOut': 'cubic-bezier(0.65,0,0.35,1)',
    'power2.in': 'cubic-bezier(0.55,0,0.85,0.3)',
    'power2.out': 'cubic-bezier(0.22,0.61,0.36,1)',
    'power2.inOut': 'cubic-bezier(0.55,0,0.45,1)',
    'power3.in': 'cubic-bezier(0.5,0,0.89,0.2)',
    'power3.out': 'cubic-bezier(0.22,1,0.36,1)',
    'power3.inOut': 'cubic-bezier(0.65,0,0.35,1)',
    'sine.inOut': 'cubic-bezier(0.37,0,0.63,1)',
    'back.in(0.9)': 'cubic-bezier(0.3,0,0.8,0.15)',
    'back.out(1.4)': 'cubic-bezier(0.34,1.4,0.64,1)',
    'back.out(1.6)': 'cubic-bezier(0.34,1.56,0.64,1)',
    'back.out(1.9)': 'cubic-bezier(0.34,1.7,0.64,1)',
    'back.out(2)': 'cubic-bezier(0.34,1.75,0.64,1)'
  };

  function easing(name) {
    if (!name) return EASES['power3.out'];
    if (EASES[name]) return EASES[name];
    const back = String(name).match(/^back\.out\(([\d.]+)\)$/);
    if (back) return `cubic-bezier(0.34,${1 + number(back[1], 1.7) * 0.3},0.64,1)`;
    const power = String(name).match(/^power(\d)\.out$/);
    if (power) return EASES[`power${power[1]}.out`] || EASES['power3.out'];
    return EASES['power3.out'];
  }

  function toArray(targets) {
    if (!targets) return [];
    if (Array.isArray(targets)) return targets.filter(Boolean);
    if (targets instanceof NodeList || targets instanceof HTMLCollection) return Array.from(targets);
    return [targets];
  }

  function transformFor(vars) {
    const parts = [];
    if (vars.x !== undefined) parts.push(`translateX(${px(vars.x)})`);
    if (vars.y !== undefined) parts.push(`translateY(${px(vars.y)})`);
    if (vars.xPercent !== undefined) parts.push(`translateX(${vars.xPercent}%)`);
    if (vars.yPercent !== undefined) parts.push(`translateY(${vars.yPercent}%)`);
    if (vars.skewX !== undefined) parts.push(`skewX(${number(vars.skewX)}deg)`);
    if (vars.skewY !== undefined) parts.push(`skewY(${number(vars.skewY)}deg)`);
    if (vars.rotationX !== undefined) parts.push(`rotateX(${number(vars.rotationX)}deg)`);
    if (vars.rotationY !== undefined) parts.push(`rotateY(${number(vars.rotationY)}deg)`);
    if (vars.rotation !== undefined) parts.push(`rotate(${number(vars.rotation)}deg)`);
    if (vars.rotate !== undefined) parts.push(`rotate(${number(vars.rotate)}deg)`);
    if (vars.scaleX !== undefined || vars.scaleY !== undefined) {
      parts.push(`scale(${number(vars.scaleX, 1)},${number(vars.scaleY, 1)})`);
    }
    if (vars.scale !== undefined) parts.push(`scale(${vars.scale})`);
    return parts.join(' ');
  }

  const STYLE_KEYS = [
    'opacity', 'visibility', 'height', 'width', 'background', 'backgroundColor', 'color',
    'clipPath', 'transformOrigin', 'strokeDasharray', 'strokeDashoffset', 'zIndex',
    'left', 'right', 'top', 'bottom', 'borderRadius', 'filter', 'mixBlendMode'
  ];

  function apply(element, vars) {
    toArray(element).forEach((el) => {
      if (!el || !el.style) return;
      const transform = transformFor(vars);
      if (transform) el.style.transform = transform;
      else if (vars.transform) el.style.transform = vars.transform;
      if (Object.prototype.hasOwnProperty.call(vars, 'autoAlpha')) {
        el.style.opacity = String(vars.autoAlpha);
        el.style.visibility = Number(vars.autoAlpha) > 0 ? 'visible' : 'hidden';
      }
      STYLE_KEYS.forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(vars, key)) {
          el.style[key] = typeof vars[key] === 'number' && key !== 'opacity' && key !== 'zIndex'
            ? `${vars[key]}px`
            : String(vars[key]);
        }
      });
      if (vars.attr) {
        Object.entries(vars.attr).forEach(([name, value]) => el.setAttribute(name, String(value)));
      }
      if (vars.css) {
        Object.entries(vars.css).forEach(([name, value]) => el.style.setProperty(name, String(value)));
      }
    });
  }

  function fallbackTween(targets, from, to, vars = {}) {
    const elements = toArray(targets);
    const duration = Math.max(0, number(vars.duration, 0.6)) * 1000;
    const delay = number(vars.delay, 0) * 1000;
    const stagger = typeof vars.stagger === 'number' ? vars.stagger * 1000 : 0;
    const curve = easing(vars.ease);
    const transition = `transform ${duration}ms ${curve} ${delay}ms, opacity ${duration}ms ${curve} ${delay}ms, visibility ${duration}ms ${curve} ${delay}ms, clip-path ${duration}ms ${curve} ${delay}ms, height ${duration}ms ${curve} ${delay}ms, width ${duration}ms ${curve} ${delay}ms, stroke-dashoffset ${duration}ms ${curve} ${delay}ms`;

    return Promise.all(elements.map((el, index) => new Promise((resolve) => {
      const start = delay + index * stagger;
      apply(el, from || {});
      requestAnimationFrame(() => {
        el.style.transition = transition;
        apply(el, to);
        setTimeout(() => {
          el.style.transition = '';
          resolve();
        }, start + duration + 30);
      });
    }))).then(() => {
      if (typeof vars.onComplete === 'function') vars.onComplete();
      return undefined;
    });
  }

  function tween(targets, vars) {
    const finalVars = vars || {};
    if (reduced) {
      apply(targets, finalVars);
      if (typeof finalVars.onComplete === 'function') finalVars.onComplete();
      return Promise.resolve();
    }
    if (gsap) return gsap.to(targets, finalVars);
    return fallbackTween(targets, null, finalVars, finalVars);
  }

  function fromTo(targets, from, to) {
    const finalTo = to || {};
    if (reduced) {
      apply(targets, finalTo);
      if (typeof finalTo.onComplete === 'function') finalTo.onComplete();
      return Promise.resolve();
    }
    if (gsap) return gsap.fromTo(targets, from, finalTo);
    return fallbackTween(targets, from, finalTo, finalTo);
  }

  function set(targets, vars) {
    if (gsap && !reduced) gsap.set(targets, vars);
    else apply(targets, vars);
    return targets;
  }

  function delayedCall(seconds, fn) {
    if (gsap && !reduced) return gsap.delayedCall(seconds, fn);
    const id = setTimeout(fn, seconds * 1000);
    return { kill: () => clearTimeout(id) };
  }

  function batchStagger(index, count, stagger, duration) {
    return index * stagger + (count > 1 ? 0 : duration);
  }

  function revealChars(root, options = {}) {
    if (!root) return;
    const chars = $$('.char', root);
    if (!chars.length) {
      root.dataset.reveal = 'live';
      return;
    }
    const opts = {
      hidden: number(options.hidden, REVEAL.HIDDEN),
      duration: number(options.duration, REVEAL.DURATION),
      stagger: number(options.stagger, REVEAL.STAGGER),
      delay: number(options.delay, REVEAL.DELAY),
      ease: options.ease || REVEAL.EASE,
      onComplete: options.onComplete
    };
    if (reduced) {
      root.dataset.reveal = 'live';
      if (opts.onComplete) opts.onComplete();
      return;
    }
    if (gsap) {
      set(chars, { y: 0, yPercent: opts.hidden });
      gsap.to(chars, {
        yPercent: 0,
        duration: opts.duration,
        stagger: opts.stagger,
        delay: opts.delay,
        ease: opts.ease,
        overwrite: 'auto',
        onComplete: () => {
          root.dataset.reveal = 'live';
          if (opts.onComplete) opts.onComplete();
        }
      });
      return;
    }
    const curve = easing(opts.ease);
    chars.forEach((char) => {
      char.style.transition = 'none';
      apply(char, { yPercent: opts.hidden });
    });
    void root.offsetHeight;
    chars.forEach((char, index) => {
      setTimeout(() => {
        char.style.transition = `transform ${opts.duration}s ${curve}`;
        apply(char, { yPercent: 0 });
      }, (opts.delay + index * opts.stagger) * 1000);
    });
    setTimeout(() => {
      chars.forEach((char) => { char.style.transition = ''; });
      root.dataset.reveal = 'live';
      if (opts.onComplete) opts.onComplete();
    }, (opts.delay + chars.length * opts.stagger + opts.duration) * 1000 + 50);
  }

  function revealBody(root, options = {}) {
    if (!root) return;
    const rises = $$('.body-rise', root);
    root.dataset.reveal = 'live';
    const opts = {
      hidden: number(options.hidden, BODY_REVEAL.HIDDEN),
      duration: number(options.duration, BODY_REVEAL.DURATION),
      stagger: number(options.stagger, BODY_REVEAL.STAGGER),
      delay: number(options.delay, 0),
      ease: options.ease || BODY_REVEAL.EASE,
      onComplete: options.onComplete
    };
    if (!rises.length) {
      if (opts.onComplete) opts.onComplete();
      return;
    }
    if (reduced) {
      if (opts.onComplete) opts.onComplete();
      return;
    }
    if (gsap) {
      set(rises, { yPercent: opts.hidden });
      gsap.to(rises, {
        yPercent: 0,
        duration: opts.duration,
        stagger: opts.stagger,
        delay: opts.delay,
        ease: opts.ease,
        overwrite: 'auto',
        onComplete: opts.onComplete
      });
      return;
    }
    const curve = easing(opts.ease);
    rises.forEach((rise) => {
      rise.style.transition = 'none';
      apply(rise, { yPercent: opts.hidden });
    });
    void root.offsetHeight;
    rises.forEach((rise, index) => {
      setTimeout(() => {
        rise.style.transition = `transform ${opts.duration}s ${curve}`;
        apply(rise, { yPercent: 0 });
      }, (opts.delay + index * opts.stagger) * 1000);
    });
    setTimeout(() => {
      rises.forEach((rise) => { rise.style.transition = ''; });
      if (opts.onComplete) opts.onComplete();
    }, (opts.delay + rises.length * opts.stagger + opts.duration) * 1000 + 50);
  }

  function bodyLines(rises) {
    const sorted = rises
      .map((rise) => ({ rise, top: (rise.parentElement || rise).offsetTop }))
      .sort((a, b) => a.top - b.top);
    const gap = Math.max(4, (((sorted[0] && sorted[0].rise.parentElement) || sorted[0]?.rise).offsetHeight || 16) / 2);
    const groups = [];
    let current = [];
    let last = -Infinity;
    sorted.forEach(({ rise, top }) => {
      if (top - last > gap) {
        current = [];
        groups.push(current);
      }
      current.push(rise);
      last = top;
    });
    return groups;
  }

  function onVisible(element, callback, options = {}) {
    if (!element) return () => {};
    if (!('IntersectionObserver' in window)) {
      callback({ isIntersecting: true, target: element });
      return () => {};
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting || options.onlyEnter === false) callback(entry);
      });
    }, {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold === undefined ? 0 : options.threshold
    });
    observer.observe(element);
    return () => observer.disconnect();
  }

  function onFrame(callback) {
    let active = true;
    const loop = (time) => {
      if (!active) return;
      callback(time);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => { active = false; };
  }

  function scrollProgress(element, start = 'top bottom', end = 'bottom top') {
    if (!element) return 0;
    const rect = element.getBoundingClientRect();
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const startValue = start.startsWith('top') ? viewport : 0;
    const endValue = end.startsWith('bottom') ? -rect.height : viewport;
    const current = start.startsWith('top') ? rect.top : rect.bottom;
    if (startValue === endValue) return 0;
    return clamp((startValue - current) / (startValue - endValue), 0, 1);
  }

  function preloadImages(sources) {
    return Promise.all(Array.from(new Set(sources.filter(Boolean))).map((src) => new Promise((resolve) => {
      const image = new Image();
      image.onload = image.onerror = () => resolve(image);
      image.src = src;
    })));
  }

  function breakpoints(onChange) {
    const media = window.matchMedia('(max-width: 743px)');
    const handler = () => onChange(media.matches);
    if (media.addEventListener) media.addEventListener('change', handler);
    else media.addListener(handler);
    handler();
    return () => {
      if (media.removeEventListener) media.removeEventListener('change', handler);
      else media.removeListener(handler);
    };
  }

  function whenRevealed(callback) {
    if (revealed) {
      requestAnimationFrame(callback);
      return () => {};
    }
    window.addEventListener(REVEALED_EVENT, callback, { once: true });
    return () => window.removeEventListener(REVEALED_EVENT, callback);
  }

  function dispatchRevealed() {
    if (revealed) return;
    revealed = true;
    delete document.documentElement.dataset.loading;
    window.dispatchEvent(new Event(REVEALED_EVENT));
  }

  window.ST = {
    gsap,
    ScrollTrigger,
    reduced,
    REVEAL,
    BODY_REVEAL,
    REVEALED_EVENT,
    $,
    $$,
    clamp,
    lerp,
    number,
    cssVar,
    px,
    wait,
    nextFrame,
    toArray,
    transformFor,
    apply,
    tween,
    fromTo,
    set,
    delayedCall,
    batchStagger,
    revealChars,
    revealBody,
    bodyLines,
    onVisible,
    onFrame,
    scrollProgress,
    preloadImages,
    breakpoints,
    whenRevealed,
    dispatchRevealed,
    easing
  };
})();
