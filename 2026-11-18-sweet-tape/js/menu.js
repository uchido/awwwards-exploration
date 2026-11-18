(() => {
  const ST = window.ST;
  const menu = ST.$('.site-menu');
  const tab = ST.$('.menu-tab');
  const panel = ST.$('.menu-panel', menu || document);
  const sheet = ST.$('.menu-sheet', menu || document);
  const sound = ST.$('.menu-sound');
  if (!menu || !tab || !panel || !sheet) return;

  const links = ST.$$('.menu-link', menu);
  const rules = ST.$$('.menu-rule', menu);
  const chars = ST.$$('.menu-label .char', menu);
  const arrows = ST.$$('.menu-arrow', menu);
  let current = null;
  let open = false;

  function targetSize() {
    const mobile = window.matchMedia('(max-width: 743px)').matches;
    return {
      mobile,
      height: Math.max(sheet.scrollHeight, panel.scrollHeight, 1),
      width: Math.max(sheet.scrollWidth, 1)
    };
  }

  function setInteractive(value) {
    links.forEach((link) => { link.tabIndex = value ? 0 : -1; });
    tab.setAttribute('aria-expanded', value ? 'true' : 'false');
    tab.setAttribute('aria-label', value ? 'Close menu' : 'Open menu');
  }

  function finalize(value) {
    panel.style.height = '';
    panel.style.width = '';
    panel.style.transition = '';
    ST.apply(sheet, { clearProps: 'transform' });
    sheet.style.transition = '';
    ST.apply(chars, { clearProps: 'transform' });
    chars.forEach((char) => { char.style.transition = ''; });
    ST.apply(rules, { clearProps: 'clipPath' });
    rules.forEach((rule) => { rule.style.transition = ''; });
    ST.apply(arrows, { clearProps: 'transform,opacity' });
    arrows.forEach((arrow) => { arrow.style.transition = ''; });
    menu.dataset.open = value ? 'true' : 'false';
    setInteractive(value);
  }

  function show() {
    if (open) return;
    open = true;
    if (current) current.kill();
    menu.dataset.open = 'true';
    setInteractive(true);
    const size = targetSize();
    const gsap = ST.gsap;

    if (gsap && !ST.reduced) {
      gsap.set(panel, { height: 0, width: size.mobile ? 0 : 'auto' });
      gsap.set(sheet, { yPercent: -100 });
      gsap.set(rules, { clipPath: 'inset(0 100% 0 0)' });
      gsap.set(chars, { yPercent: 130 });
      gsap.set(arrows, { scale: 0, opacity: 0 });
      current = gsap.timeline({ onComplete: () => finalize(true) });
      current.to(panel, {
        height: size.mobile ? 'auto' : size.height,
        width: size.mobile ? size.width : 'auto',
        duration: 0.7,
        ease: 'back.out(1.9)'
      }, 0)
        .to(sheet, { yPercent: 0, duration: 0.72, ease: 'back.out(1.9)' }, 0)
        .to(rules, { clipPath: 'inset(0 0% 0 0)', duration: 0.5, stagger: 0.05, ease: 'power2.out' }, 0.1)
        .to(chars, { yPercent: 0, duration: 0.6, stagger: 0.025, ease: ST.REVEAL.EASE }, 0.18)
        .to(arrows, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'back.out(2)' }, 0.32);
      return;
    }

    ST.apply(panel, { height: 0, width: size.mobile ? 0 : '' });
    ST.apply(sheet, { yPercent: -100 });
    ST.apply(rules, { clipPath: 'inset(0 100% 0 0)' });
    ST.apply(chars, { yPercent: 130 });
    ST.apply(arrows, { scale: 0, opacity: 0 });
    requestAnimationFrame(() => {
      panel.style.transition = 'height .7s cubic-bezier(.22,1,.36,1), width .7s cubic-bezier(.22,1,.36,1)';
      panel.style.height = size.mobile ? 'auto' : `${size.height}px`;
      panel.style.width = size.mobile ? `${size.width}px` : '';
      sheet.style.transition = 'transform .72s cubic-bezier(.22,1,.36,1)';
      ST.apply(sheet, { yPercent: 0 });
      rules.forEach((rule, index) => {
        rule.style.transition = `clip-path .5s ease ${index * 50}ms`;
        rule.style.clipPath = 'inset(0 0% 0 0)';
      });
      chars.forEach((char, index) => {
        char.style.transition = `transform .6s cubic-bezier(.22,1,.36,1) ${180 + index * 25}ms`;
        ST.apply(char, { yPercent: 0 });
      });
      arrows.forEach((arrow, index) => {
        arrow.style.transition = `transform .45s ease ${320 + index * 50}ms, opacity .45s ease ${320 + index * 50}ms`;
        ST.apply(arrow, { scale: 1, opacity: 1 });
      });
    });
    setTimeout(() => finalize(true), ST.reduced ? 0 : 900);
  }

  function hide() {
    if (!open) return;
    open = false;
    if (current) current.kill();
    const gsap = ST.gsap;

    if (gsap && !ST.reduced) {
      current = gsap.timeline({ onComplete: () => finalize(false) });
      current.to(arrows, { scale: 0, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0)
        .to(chars, { yPercent: 130, duration: 0.28, stagger: 0.012, ease: 'power2.in' }, 0)
        .to(rules, { clipPath: 'inset(0 100% 0 0)', duration: 0.25, stagger: 0.025, ease: 'power2.in' }, 0)
        .to(sheet, { yPercent: -100, duration: 0.45, ease: 'power3.inOut' }, 0.1)
        .to(panel, {
          height: 0,
          width: window.matchMedia('(max-width: 743px)').matches ? 0 : 'auto',
          duration: 0.5,
          ease: 'power3.inOut'
        }, 0.14);
      return;
    }

    panel.style.transition = 'height .45s cubic-bezier(.65,0,.35,1), width .45s cubic-bezier(.65,0,.35,1)';
    sheet.style.transition = 'transform .45s cubic-bezier(.65,0,.35,1)';
    ST.apply(sheet, { yPercent: -100 });
    panel.style.height = '0px';
    if (window.matchMedia('(max-width: 743px)').matches) panel.style.width = '0px';
    setTimeout(() => finalize(false), ST.reduced ? 0 : 540);
  }

  tab.addEventListener('click', () => { if (open) hide(); else show(); });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      hide();
      tab.focus();
    }
  });

  document.addEventListener('pointerdown', (event) => {
    if (open && !menu.contains(event.target) && event.target !== tab) hide();
  });

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.pathname && link.pathname.startsWith('/')) {
        event.preventDefault();
        hide();
      }
    });
  });

  function blip() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(660, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(990, context.currentTime + 0.08);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, context.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.12);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.13);
      setTimeout(() => context.close(), 200);
    } catch (error) {
      return;
    }
  }

  if (sound) {
    sound.addEventListener('click', () => {
      const pressed = sound.getAttribute('aria-pressed') === 'true';
      sound.setAttribute('aria-pressed', pressed ? 'false' : 'true');
      if (!pressed) blip();
    });
  }
})();
