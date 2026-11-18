(() => {
  const ST = window.ST;
  const root = ST.$('.tape-slider-parent');
  if (!root) return;

  const buttons = ST.$$('.rail-track button[data-index]', root);
  if (!buttons.length) return;

  const rail = ST.$('.rail-track', root);
  const rings = buttons.map((button) => ST.$('.roll-ring', button));
  const rollParent = ST.$('.roll-parent', root);
  const rollLabel = ST.$('.roll-it', root);
  const navButtons = ST.$$('.tape-nav button[data-step]', root);
  const overlay = ST.$('.bg-overlay', root);
  const baseLayer = ST.$('.bg-layer--base', root);
  const nextLayer = ST.$('.bg-layer--next', root);
  const sweep = ST.$('.sweep-paint', root);
  const sweepInner = ST.$('.sweep-inner', root);
  const sweepLabel = ST.$('.subhead--next', root);
  const subhead = ST.$('.subhead:not(.subhead--next)', root);
  const slide = ST.$('.tape-slide', root);
  const wrapper = ST.$('.tape-slide .wrapper', root);
  const heading = ST.$('.tape-slide h2.sr-only', root);
  const left = ST.$('.tape-slide .left', root);
  const tagsContainer = ST.$('.tape-slide .tags', root);
  const copy = ST.$('.tape-slide .body-copy', root);
  const topTitle = ST.$('.tape-slide .top-title', root);
  const bottomTitle = ST.$('.tape-slide .bottom-title', root);
  const glyphs = ST.$$('.tape-slide .bottom-title .glyph img', root);
  const titleImages = ST.$$('.tape-slide .top-title img', root);
  const explore = ST.$('.tape-slide .explore-button', root);
  const exploreText = ST.$('.tape-slide .button-text', root);
  const keyVisual = ST.$('.tape-slide .key-visual img', root);
  const showcases = ST.$$('.tape-slide .showcase', root);
  const showcaseImages = showcases.map((item) => ST.$(':scope > img', item));
  const showcaseTapes = showcases.map((item) => ST.$('.showcase-tape', item));

  const SHOWCASE = {
    masking: ['assets/media/img-masking-tape-2.webp', 'assets/media/img-masking-tape-1.webp'],
    double: ['assets/media/img-double-sided-tape-2.webp', 'assets/media/img-double-sided-tape-4.webp'],
    stationery: ['assets/media/img-stationery-tape-3.webp', 'assets/media/img-stationery-tape-2.webp'],
    cloth: ['assets/media/img-cloth-tape-3.webp', 'assets/media/img-cloth-tape-5.webp'],
    opp: ['assets/media/opp-tape-shot-1.webp', 'assets/media/opp-shot-2.webp'],
    'opp-quiet': ['assets/media/img-opp-no-noise-tape-2.webp', 'assets/media/opp-quiet-shot-2.webp']
  };

  let active = 0;
  let rotation = 180;
  let radius = 0;
  let busy = false;
  let valueTween = null;

  const step = 360 / buttons.length;
  const css = (element, name) => ST.cssVar(element, name);
  const stopTween = () => { if (valueTween) valueTween(); valueTween = null; };

  function numericEase(name, value) {
    const t = ST.clamp(value, 0, 1);
    if (name === 'none' || name === 'linear') return t;
    if (name === 'sine.inOut') return -(Math.cos(Math.PI * t) - 1) / 2;
    if (name === 'power2.in') return t * t * t;
    if (name === 'power2.out') return 1 - Math.pow(1 - t, 3);
    if (name === 'power3.inOut') return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    if (name === 'power3.in') return t * t * t * t;
    return 1 - Math.pow(1 - t, 4);
  }

  function animateValue(from, to, duration, ease, onUpdate, onComplete) {
    stopTween();
    if (ST.reduced || duration <= 0) {
      onUpdate(to);
      if (onComplete) onComplete();
      return;
    }
    const start = performance.now();
    const frame = (now) => {
      const progress = ST.clamp((now - start) / (duration * 1000), 0, 1);
      onUpdate(from + (to - from) * numericEase(ease, progress));
      if (progress < 1) {
        valueTween = () => { activeFrame = false; };
        let activeFrame = true;
        requestAnimationFrame((next) => { if (activeFrame) frame(next); });
      } else if (onComplete) {
        valueTween = null;
        onComplete();
      }
    };
    valueTween = () => {};
    requestAnimationFrame(frame);
  }

  function measure() {
    radius = rail.getBoundingClientRect().width / 2;
    placeRail();
  }

  function placeRail() {
    buttons.forEach((button, index) => {
      const angle = (index * step + rotation) * Math.PI / 180;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (ST.gsap && !ST.reduced) ST.gsap.set(button, { xPercent: -50, yPercent: -50, x, y });
      else ST.apply(button, { xPercent: -50, yPercent: -50, x, y });
    });
  }

  function markActive(index) {
    buttons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === index;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      if (ST.gsap && !ST.reduced) {
        ST.gsap.set(button, { zIndex: isActive ? 2 : 1 });
        ST.gsap.to(rings, { scale: 0, opacity: 0, duration: 0.4, overwrite: 'auto' });
        if (isActive) ST.gsap.to(rings[buttonIndex], { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.6)', overwrite: 'auto' });
      } else {
        button.style.zIndex = isActive ? '2' : '1';
        rings.forEach((ring) => ST.apply(ring, { scale: 0, opacity: 0 }));
        if (isActive) ST.apply(rings[buttonIndex], { scale: 1, opacity: 1 });
      }
    });
  }

  function copyWords(text) {
    if (!copy) return [];
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    const fragment = document.createDocumentFragment();
    words.forEach((word, index) => {
      if (index) fragment.appendChild(document.createTextNode(' '));
      const clip = document.createElement('span');
      clip.className = 'body-clip';
      const rise = document.createElement('span');
      rise.className = 'body-rise';
      rise.textContent = word;
      clip.appendChild(rise);
      fragment.appendChild(clip);
    });
    copy.replaceChildren(fragment);
    copy.dataset.reveal = 'live';
    return ST.$$('.body-rise', copy);
  }

  function setTags(tags, animate) {
    if (!tagsContainer) return;
    const values = String(tags || '').split('|').filter(Boolean);
    const existing = ST.$$('.tag', tagsContainer);
    const count = Math.max(values.length, existing.length);
    const items = [];
    for (let index = 0; index < count; index++) {
      let tag = existing[index];
      if (!tag) {
        tag = document.createElement('div');
        tag.className = 'tag';
        const heading = document.createElement('h6');
        heading.className = 'h6';
        tag.appendChild(heading);
        tagsContainer.appendChild(tag);
      }
      tag.style.display = index < values.length ? '' : 'none';
      ST.$('h6', tag).textContent = values[index] || '';
      items.push(tag);
    }
    if (!animate || ST.reduced) {
      items.forEach((tag) => { tag.style.transform = ''; tag.style.opacity = ''; });
      return;
    }
    if (ST.gsap) {
      ST.gsap.fromTo(items, { x: -(left?.getBoundingClientRect().right || 300) + 40, opacity: 0 }, {
        x: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.07,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    } else {
      items.forEach((tag, index) => {
        tag.style.transition = 'none';
        ST.apply(tag, { x: -320, opacity: 0 });
        setTimeout(() => {
          tag.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1), opacity .5s ease';
          ST.apply(tag, { x: 0, opacity: 1 });
        }, index * 70);
      });
    }
  }

  function setStrip(button) {
    const values = String(button.dataset.strip || '').split('|');
    const [src, back, width, height, blend = 'normal'] = values;
    if (!src || !back || !width || !height) return;
    showcaseTapes.forEach((tape) => {
      if (!tape) return;
      tape.style.setProperty('--peel-w', width);
      tape.style.setProperty('--peel-h', height);
      tape.style.setProperty('--peel-back', `url(#${back})`);
      tape.style.setProperty('--strip-blend', blend);
      ST.$$('img', tape).forEach((image) => { image.src = src; });
    });
  }

  function setShowcase(button) {
    const images = SHOWCASE[button.dataset.index] || String(button.dataset.showcase || '').split('|').filter(Boolean);
    showcaseImages.forEach((image, index) => {
      if (image && images[index]) image.src = images[index];
    });
    setStrip(button);
  }

  function setContent(index, animate) {
    const button = buttons[index];
    if (!button) return;
    const id = button.dataset.index;
    const word = button.dataset.word || id;
    const bg = css(button, '--bg') || '#034102';
    const wordColour = css(button, '--word') || '#b6fe00';
    const ink = css(button, '--ink') || wordColour;

    if (wrapper) wrapper.id = word;
    if (bottomTitle) bottomTitle.dataset.word = word;
    if (heading) heading.textContent = `THE ${word.toUpperCase()}`;
    if (explore) explore.setAttribute('href', `/products/${id}`);
    if (exploreText) exploreText.textContent = 'EXPLORE';
    if (rollParent) rollParent.style.setProperty('--ink', ink);
    if (topTitle) topTitle.style.setProperty('--word-colour', wordColour);
    if (bottomTitle) bottomTitle.style.setProperty('--word-colour', wordColour);
    if (glyphs.length) glyphs.forEach((glyph) => glyph.style.setProperty('--word-colour', wordColour));
    if (subhead) subhead.textContent = 'MEET THE ONE WHO STICKS';
    if (sweepLabel) sweepLabel.textContent = 'MEET THE ONE WHO STICKS';

    if (!animate) {
      if (baseLayer) baseLayer.style.background = bg;
      if (root) root.style.setProperty('--stage-bg', bg);
    }
    if (navButtons.length) {
      navButtons.forEach((nav) => {
        nav.style.setProperty('--nav-face', css(button, '--ring'));
        nav.style.setProperty('--nav-ink', wordColour);
      });
    }

    if (keyVisual) {
      keyVisual.src = button.dataset.card || '';
      keyVisual.style.visibility = 'visible';
    }
    setShowcase(button);
    setTags(button.dataset.tags, animate);
    const rises = copyWords(button.dataset.copy);

    if (animate && !ST.reduced) {
      if (ST.gsap) {
        const timeline = ST.gsap.timeline();
        timeline.fromTo(titleImages, { yPercent: 0 }, { yPercent: 42, duration: 0.32, ease: 'power2.in' }, 0)
          .to(titleImages, { yPercent: 0, duration: 0.45, ease: 'power3.out' }, 0.32)
          .fromTo(glyphs, { yPercent: 0 }, { yPercent: 48, duration: 0.32, ease: 'power2.in' }, 0.04)
          .to(glyphs, { yPercent: 0, duration: 0.48, ease: 'power3.out' }, 0.36)
          .fromTo(showcases, { rotationY: -90, z: -55 }, { rotationY: 0, z: 0, duration: 0.78, ease: 'power3.out', stagger: 0.08 }, 0.1);
      } else {
        [...titleImages, ...glyphs].forEach((image) => {
          image.style.transition = 'none';
          ST.apply(image, { yPercent: 45 });
          setTimeout(() => {
            image.style.transition = 'transform .45s cubic-bezier(.22,1,.36,1)';
            ST.apply(image, { yPercent: 0 });
          }, 330);
        });
        showcases.forEach((item, itemIndex) => {
          item.style.transition = 'none';
          ST.apply(item, { rotationY: -90 });
          setTimeout(() => {
            item.style.transition = 'transform .78s cubic-bezier(.22,1,.36,1)';
            ST.apply(item, { rotationY: 0 });
          }, 100 + itemIndex * 80);
        });
      }
      ST.revealBody(copy, { delay: 0.18 });
    } else {
      [...titleImages, ...glyphs].forEach((image) => ST.apply(image, { yPercent: 0 }));
      showcases.forEach((item) => ST.apply(item, { rotationY: 0 }));
      if (rises.length) rises.forEach((rise) => { rise.style.transform = 'none'; });
    }
  }

  function runSweep(button) {
    const bg = css(button, '--bg') || '#034102';
    if (!overlay || !nextLayer || !baseLayer) {
      if (baseLayer) baseLayer.style.background = bg;
      if (root) root.style.setProperty('--stage-bg', bg);
      return;
    }
    const rect = overlay.getBoundingClientRect();
    const arc = rect.width * (150.5 / 1456);
    const total = rect.height + arc + 2;

    if (nextLayer) {
      nextLayer.style.height = `${total}px`;
      nextLayer.style.background = bg;
      nextLayer.style.setProperty('--arc-h', `${arc}px`);
      nextLayer.style.transform = `translateY(${-total}px)`;
    }
    if (sweep) {
      sweep.style.height = `${total}px`;
      sweep.style.setProperty('--arc-h', `${arc}px`);
      sweep.style.transform = `translateY(${-total}px)`;
    }
    if (sweepInner) {
      sweepInner.style.height = `${rect.height}px`;
      sweepInner.style.transform = `translateY(${total}px)`;
    }
    if (sweepLabel) sweepLabel.style.color = wordColourOf(button);

    animateValue(0, 1, 0.85, 'power2.out', (progress) => {
      const offset = (progress - 1) * total;
      if (nextLayer) nextLayer.style.transform = `translateY(${offset}px)`;
      if (sweep) sweep.style.transform = `translateY(${offset}px)`;
      if (sweepInner) sweepInner.style.transform = `translateY(${-offset}px)`;
    }, () => {
      baseLayer.style.background = bg;
      if (root) root.style.setProperty('--stage-bg', bg);
      if (nextLayer) nextLayer.style.transform = 'translateY(-100%)';
      if (sweep) sweep.style.transform = 'translateY(-100%)';
    });
  }

  function wordColourOf(button) {
    return css(button, '--word') || '#b6fe00';
  }

  function change(index) {
    const next = (index + buttons.length) % buttons.length;
    if (next === active || busy) return;
    busy = true;
    const previous = active;
    active = next;
    const button = buttons[next];

    markActive(next);
    if (explore) explore.setAttribute('href', `/products/${button.dataset.index}`);
    root.dispatchEvent(new CustomEvent('sweettape:slide', { bubbles: true, detail: { index: next, id: button.dataset.index } }));

    const delta = ((180 - next * step - rotation) % 360 + 540) % 360 - 180;
    const target = rotation + delta;
    const ringTargets = rings;
    const gsap = ST.gsap;

    if (gsap && !ST.reduced) {
      ST.gsap.to(ringTargets, { scale: 0, opacity: 0, duration: 0.42, ease: 'back.in(0.9)', overwrite: 'auto' });
      const spin = { value: rotation };
      ST.gsap.to(spin, {
        value: target,
        duration: 0.85,
        ease: 'sine.inOut',
        onUpdate: () => { rotation = spin.value; placeRail(); },
        onComplete: () => { rotation = target; placeRail(); }
      });
      ST.gsap.to(rings[next], { scale: 1, opacity: 1, duration: 0.55, delay: 0.62, ease: 'back.out(1.6)', overwrite: 'auto' });
    } else if (!ST.reduced) {
      rings.forEach((ring) => ST.apply(ring, { scale: 0, opacity: 0 }));
      animateValue(rotation, target, 0.85, 'sine.inOut', (value) => {
        rotation = value;
        placeRail();
      }, () => {
        rotation = target;
        placeRail();
        ST.apply(rings[next], { scale: 1, opacity: 1 });
      });
    } else {
      rotation = target;
      placeRail();
    }

    runSweep(button);
    setContent(next, true);
    ST.delayedCall(1.1, () => { busy = false; });
    if (previous === active) busy = false;
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => change(index));
  });
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const direction = ST.number(button.dataset.step, 1);
      change(active + direction);
    });
  });
  rail.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = active + (event.key === 'ArrowRight' ? 1 : -1);
    change(next);
    buttons[(next + buttons.length) % buttons.length].focus();
  });

  let wheelLocked = false;
  rail.addEventListener('wheel', (event) => {
    if (wheelLocked || Math.abs(event.deltaY) < 8) return;
    event.preventDefault();
    wheelLocked = true;
    change(active + (event.deltaY > 0 ? 1 : -1));
    setTimeout(() => { wheelLocked = false; }, 700);
  }, { passive: false });

  if (explore) {
    explore.addEventListener('click', (event) => {
      if (explore.pathname && explore.pathname.startsWith('/')) event.preventDefault();
    });
  }

  window.addEventListener('resize', measure, { passive: true });
  measure();
  buttons.forEach((button, index) => {
    button.style.transformOrigin = '50% 50%';
    button.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
  });
  setContent(0, false);
  markActive(0);
  if (rollLabel) rollLabel.style.setProperty('--ink', css(buttons[0], '--ink'));
  rail.classList.add('is-ready');

  ST.whenRevealed(() => {
    measure();
    markActive(0);
    if (ST.gsap && !ST.reduced) {
      ST.gsap.fromTo(showcases, { rotationY: -90, z: -55 }, { rotationY: 0, z: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1, delay: 0.35 });
      ST.gsap.fromTo(rings[0], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.55, delay: 0.4, ease: 'back.out(1.6)' });
    } else {
      showcases.forEach((item) => ST.apply(item, { rotationY: 0 }));
      ST.apply(rings[0], { scale: 1, opacity: 1 });
    }
    ST.revealBody(copy, { delay: 0.25 });
  });
})();
