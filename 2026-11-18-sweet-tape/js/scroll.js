(() => {
  const ST = window.ST;
  const gsap = ST.gsap;
  const ScrollTrigger = ST.ScrollTrigger;
  const reduced = ST.reduced;
  const clamp = ST.clamp;
  const number = ST.number;
  const $ = ST.$;
  const $$ = ST.$$;

  function documentTop(element) {
    let top = 0;
    for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
    return top;
  }

  function easePower1InOut(value) {
    const t = clamp(value, 0, 1);
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function makeCanvas(container, draw) {
    if (!container) return () => {};
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'width:100%;height:100%;display:block';
    container.appendChild(canvas);
    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    function resize() {
      const rect = container.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      context.setTransform(scale, 0, 0, scale, 0, 0);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    const stop = ST.onFrame((time) => draw(context, width, height, time));
    return () => {
      stop();
      window.removeEventListener('resize', resize);
      canvas.remove();
    };
  }

  function initHeroCanvases() {
    const tape = $('.hero-tape');
    const note = $('.sticky-note');
    let tapeImage = null;

    if (tape) {
      tapeImage = new Image();
      tapeImage.src = 'assets/sibling-opp-normal.webp';
      makeCanvas(tape, (context, width, height, time) => {
        context.clearRect(0, 0, width, height);
        const size = Math.min(width, height) * 1.16;
        const drift = Math.sin(time / 2600) * 0.05 + Math.sin(window.scrollY / 1400) * 0.12;
        context.save();
        context.translate(width / 2, height / 2);
        context.rotate(drift);
        if (tapeImage && tapeImage.complete && tapeImage.naturalWidth) {
          context.drawImage(tapeImage, -size / 2, -size / 2, size, size);
        } else {
          const gradient = context.createRadialGradient(0, 0, size * 0.12, 0, 0, size * 0.5);
          gradient.addColorStop(0, '#2b1b10');
          gradient.addColorStop(0.45, '#9a6b32');
          gradient.addColorStop(0.48, '#d3a860');
          gradient.addColorStop(0.52, '#8a5b2b');
          gradient.addColorStop(1, '#35200f');
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(0, 0, size * 0.5, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      });
    }

    if (note) {
      makeCanvas(note, (context, width, height, time) => {
        context.clearRect(0, 0, width, height);
        const inset = width * 0.035;
        const fold = width * 0.17;
        const sway = Math.sin(time / 1900) * width * 0.006;
        context.save();
        context.translate(sway, 0);
        context.shadowColor = 'rgba(0,0,0,.24)';
        context.shadowBlur = width * 0.05;
        context.shadowOffsetX = width * 0.025;
        context.shadowOffsetY = width * 0.04;
        context.fillStyle = '#fff7a8';
        context.beginPath();
        context.moveTo(inset, inset);
        context.lineTo(width - inset - fold, inset);
        context.lineTo(width - inset, inset + fold);
        context.lineTo(width - inset, height - inset);
        context.lineTo(inset, height - inset);
        context.closePath();
        context.fill();
        context.shadowColor = 'transparent';
        context.fillStyle = '#e8dd7d';
        context.beginPath();
        context.moveTo(width - inset - fold, inset);
        context.lineTo(width - inset, inset + fold);
        context.lineTo(width - inset - fold, inset + fold);
        context.closePath();
        context.fill();
        context.strokeStyle = 'rgba(1,57,0,.32)';
        context.lineWidth = Math.max(1, width * 0.006);
        context.lineCap = 'round';
        const lineStart = inset + width * 0.22;
        const lineEnd = width - inset - width * 0.1;
        for (let line = 0; line < 4; line++) {
          const y = lineStart + line * width * 0.13;
          context.beginPath();
          context.moveTo(inset + width * 0.1, y);
          context.quadraticCurveTo(width * 0.52, y + width * 0.018, lineEnd, y - width * 0.008);
          context.stroke();
        }
        context.restore();
      });
    }
  }

  function initHero() {
    const hero = $('.hero-section');
    if (!hero) return;
    const mark = $('.hero-mark', hero);
    const corner = $('.corner-perf', hero);

    ST.whenRevealed(() => {
      ST.revealChars(hero, { delay: 0.24, stagger: 0.012 });
      initHeroCanvases();
      if (!gsap || reduced) return;
      if (mark) {
        gsap.fromTo(mark, { yPercent: -170, autoAlpha: 0 }, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.85,
          delay: 0.45,
          ease: 'back.out(1.6)'
        });
      }
      if (corner) {
        gsap.fromTo(corner, { clipPath: 'inset(0 100% 0 0)' }, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.9,
          delay: 0.5,
          ease: 'power3.out'
        });
      }
    });
  }

  function initParallax() {
    const items = $$('[data-parallax]');
    if (!items.length || reduced) return;
    const state = items.map((element) => ({
      element,
      strength: number(element.dataset.parallax, -0.12),
      smoothing: number(element.dataset.parallaxEase, 9),
      current: 0,
      target: 0
    }));

    ST.onFrame(() => {
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      state.forEach((item) => {
        const rect = item.element.getBoundingClientRect();
        if (rect.bottom < -viewport || rect.top > viewport * 2) return;
        item.target = (rect.top + rect.height / 2 - viewport / 2) * item.strength;
        item.current += (item.target - item.current) * Math.min(0.2, item.smoothing / 60);
        item.element.style.transform = `translate3d(0,${item.current.toFixed(2)}px,0)`;
      });
    });
  }

  function initPeels() {
    const items = $$('[data-peel="scroll"]');
    if (!items.length || reduced) return;
    const state = items.map((element) => ({ element, progress: NaN, active: false, from: 0, to: 1 }));

    function measure() {
      const viewport = window.innerHeight || document.documentElement.clientHeight;
      state.forEach((item) => {
        const top = documentTop(item.element);
        const middle = top + item.element.offsetHeight / 2;
        item.from = top - viewport * number(item.element.dataset.peelIn, 0.92);
        item.to = middle - viewport * number(item.element.dataset.peelOut, 0.46);
        if (item.to <= item.from) item.to = item.from + 1;
      });
    }

    measure();
    window.addEventListener('resize', measure, { passive: true });
    state.forEach((item) => {
      ST.onVisible(item.element, (entry) => { item.active = entry.isIntersecting; }, { rootMargin: '15% 0px' });
    });

    ST.onFrame(() => {
      const scroll = window.scrollY || window.pageYOffset || 0;
      state.forEach((item) => {
        if (!item.active) return;
        const raw = clamp((scroll - item.from) / (item.to - item.from), 0, 1);
        const progress = easePower1InOut(raw);
        if (Math.abs(progress - item.progress) < 0.001) return;
        item.progress = progress;
        item.element.style.setProperty('--peel', String(Math.round(progress * 1000) / 1000));
      });
    });
  }

  function initHandNotes(root = document) {
    const notes = $$('.hand-note', root);
    if (!notes.length) return;
    notes.forEach((note) => {
      if (note.dataset.noteReady) return;
      note.dataset.noteReady = 'true';
      const rules = $$('.hand-rule', note);
      const lines = $$('.hand-line', note);
      if (!rules.length && !lines.length) return;
      if (reduced || !gsap) {
        rules.forEach((rule) => { rule.style.transform = 'none'; });
        lines.forEach((line) => { line.style.transform = 'none'; line.style.opacity = '1'; });
        return;
      }
      gsap.set(rules, { scaleX: 0, scaleY: 0, transformOrigin: '0% 50%' });
      gsap.set(lines, { y: 10, autoAlpha: 0 });
      ST.onVisible(note, () => {
        rules.forEach((rule) => {
          const vertical = rule.classList.contains('hand-rule--y');
          gsap.to(rule, {
            scaleX: vertical ? 1 : 1,
            scaleY: 1,
            duration: vertical ? 0.7 : 0.5,
            ease: 'none'
          });
        });
        gsap.to(lines, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.1, ease: 'power3.out', delay: 0.25 });
      }, { rootMargin: '0px 0px -22% 0px' });
    });
  }

  function initWave() {
    const section = $('.wave-band');
    if (!section) return;
    const textPath = $('textPath', section);
    const text = $('.band-text', section);
    const path = $('#wave-band-path', section);
    const badges = $$('.band-badge', section);
    if (!textPath || !text || !path) return;

    const head = section.dataset.head || '';
    const tail = section.dataset.tail || '';
    const space = '\u00a0'.repeat(6);
    const phrase = head + space + tail + '\u00a0\u00a0\u00a0';
    let wordLength = phrase.length * 140;
    let start = 3295;
    let badgeGap = wordLength * 0.4;

    function placeBadges(offset) {
      const total = path.getTotalLength ? path.getTotalLength() : 0;
      badges.forEach((badge, index) => {
        const at = offset + index * badgeGap;
        if (!total || at < 0 || at > total) {
          badge.style.visibility = 'hidden';
          return;
        }
        const point = path.getPointAtLength(at);
        const before = path.getPointAtLength(Math.max(at - 8, 0));
        const after = path.getPointAtLength(Math.min(at + 8, total));
        const angle = (180 * Math.atan2(after.y - before.y, after.x - before.x)) / Math.PI;
        badge.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
        badge.style.visibility = 'visible';
      });
    }

    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([ready, ST.wait(900)]).then(() => {
      try {
        wordLength = text.getSubStringLength(0, phrase.length);
        badgeGap = text.getSubStringLength(0, head.length) + text.getSubStringLength(head.length, space.length) / 2;
      } catch (error) {
        wordLength = phrase.length * 140;
        badgeGap = wordLength * 0.4;
      }
      try {
        const total = path.getTotalLength();
        let low = 0;
        let high = total;
        for (let index = 0; index < 40; index++) {
          const middle = (low + high) / 2;
          if (path.getPointAtLength(middle).x < 0) low = middle;
          else high = middle;
        }
        start = (low + high) / 2 + 40;
      } catch (error) {
        start = 3295;
      }
      textPath.setAttribute('startOffset', String(start));
      placeBadges(start + badgeGap);
      if (reduced) return;

      let progress = start;
      let speed = 0.9;
      let lastTime = performance.now();
      let lastScroll = window.scrollY;
      let visible = true;

      ST.onFrame((time) => {
        if (!visible) return;
        const delta = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;
        progress -= 120 * speed * delta;
        if (progress < start - wordLength) progress += wordLength;
        textPath.setAttribute('startOffset', String(progress));
        placeBadges(progress + badgeGap);
      });

      window.addEventListener('scroll', () => {
        const current = window.scrollY;
        const delta = current - lastScroll;
        lastScroll = current;
        const target = clamp(0.9 + 0.5 * delta, -4, 5);
        const amount = Math.abs(target - 0.9) > Math.abs(speed - 0.9) ? 0.12 : 0.03;
        speed += (target - speed) * amount;
      }, { passive: true });

      ST.onVisible(section, (entry) => { visible = entry.isIntersecting; }, { rootMargin: '600px 0px', onlyEnter: false });
    });
  }

  function smoothCornerStops(stops, ends, opens) {
    const result = { stops: [], ends: [], opens: opens.map((value, index) => index) };
    const sourceToResult = [];
    for (let index = 0; index < stops.length; index++) {
      const current = stops[index];
      const previous = stops[index - 1];
      const next = stops[index + 1];
      const add = () => {
        sourceToResult[index] = result.stops.length;
        result.stops.push(current);
        result.ends.push(ends[index]);
      };
      if (!previous || !next) {
        add();
        continue;
      }
      const inX = current.x - previous.x;
      const inY = current.y - previous.y;
      const outX = next.x - current.x;
      const outY = next.y - current.y;
      const inLength = Math.hypot(inX, inY);
      const outLength = Math.hypot(outX, outY);
      const dot = (inX * outX + inY * outY) / ((inLength * outLength) || 1);
      const angle = (180 * Math.acos(clamp(dot, -1, 1))) / Math.PI;
      if (inLength < 1 || outLength < 1 || angle < 70) {
        add();
        continue;
      }
      const amount = 0.13 * Math.min(inLength, outLength);
      const before = {
        x: current.x - (inX / inLength) * amount,
        y: current.y - (inY / inLength) * amount
      };
      const after = {
        x: current.x + (outX / outLength) * amount,
        y: current.y + (outY / outLength) * amount
      };
      sourceToResult[index] = result.stops.length;
      const segments = 4;
      for (let segment = 0; segment <= segments; segment++) {
        const t = segment / segments;
        const inv = 1 - t;
        result.stops.push({
          x: inv * inv * before.x + 2 * inv * t * current.x + t * t * after.x,
          y: inv * inv * before.y + 2 * inv * t * current.y + t * t * after.y
        });
        result.ends.push(segment === segments ? ends[index] : false);
      }
    }
    result.opens = opens.map((value) => sourceToResult[value] ?? value);
    return result;
  }

  function initGiant() {
    const section = $('.giant-pinning');
    if (!section) return;
    const rows = $$('.giant-row', section);
    const canvas = $('.giant-canvas', section);
    const wrapper = $('.wrapper', section);
    const title = $('.giant-canvas > .top-title', section);
    if (!rows.length || !canvas) return;

    if (reduced || !gsap || !ScrollTrigger) {
      section.dataset.reveal = 'live';
      $$('.giant-tape', section).forEach((tape) => tape.style.setProperty('--peel', '1'));
      initHandNotes(section);
      return;
    }

    section.dataset.reveal = 'live';

    function compute() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const inset = viewportWidth * number(ST.cssVar(section, '--giant-inset'), 0.045);
      const stops = [];
      const ends = [];
      const opens = [];

      rows.forEach((row) => {
        opens.push(stops.length);
        const left = row.offsetLeft;
        const width = row.offsetWidth;
        const viewportLeft = row.getBoundingClientRect().left;
        let extent = width;
        $$('.giant-prop', row).forEach((prop) => {
          extent = Math.max(extent, prop.getBoundingClientRect().right - viewportLeft);
        });
        const y = viewportHeight / 2 - (row.offsetTop + row.offsetHeight / 2);
        if (extent <= viewportWidth - inset * 2) {
          stops.push({ x: viewportWidth / 2 - (left + width / 2), y });
          ends.push(true);
        } else {
          stops.push({ x: inset - left, y });
          ends.push(false);
          const rightInset = extent > width ? inset * 2 : inset;
          stops.push({ x: viewportWidth - rightInset - (left + extent), y });
          ends.push(true);
        }
      });

      if (title) {
        const openAt = number(ST.cssVar(section, '--giant-open-at'), 0.5);
        stops.unshift({
          x: stops[0] ? stops[0].x : 0,
          y: viewportHeight * openAt - (title.offsetTop + title.offsetHeight / 2)
        });
        ends.unshift(true);
        for (let index = 0; index < opens.length; index++) opens[index] += 1;
      }

      return smoothCornerStops(stops, ends, opens);
    }

    const distances = (list) => list.slice(1).map((stop, index) => Math.hypot(stop.x - list[index].x, stop.y - list[index].y));
    let data = compute();
    let lengths = distances(data.stops);
    let totalDistance = lengths.reduce((sum, length) => sum + length, 0) || 1;
    let timeline = null;
    let pinTrigger = null;

    const setPosition = (index) => {
      const stop = data.stops[Math.min(index, data.stops.length - 1)];
      if (stop) gsap.set(canvas, { x: stop.x, y: stop.y });
    };
    setPosition(0);

    const chars = rows.map((row) => $$('.char', row));
    const indices = $$('.giant-index', section);
    const tapes = $$('.giant-tape', section).map((tape) => tape.parentElement).filter(Boolean);
    const arrows = $$('.diag-down-arrow, .diag-up-arrow', section).map((arrow) => ({
      line: $('.arrow-line', arrow),
      head: $('.arrow-head', arrow)
    })).filter((item) => item.line || item.head);

    gsap.set(chars.flat(), { yPercent: ST.REVEAL.HIDDEN });
    gsap.set(indices, { autoAlpha: 0 });
    $$('.giant-tape', section).forEach((tape) => tape.style.setProperty('--peel', '0'));
    arrows.forEach(({ line, head }) => {
      [line, head].filter(Boolean).forEach((pathItem) => {
        const length = pathItem.getTotalLength ? pathItem.getTotalLength() : 100;
        pathItem.style.strokeDasharray = `${length} ${length + 2}`;
        pathItem.style.strokeDashoffset = String(length + 1);
      });
    });

    const revealedRows = new Set();
    const revealedTapes = new Set();
    const revealedArrows = new Set();
    const revealedChars = new Set();

    function revealRow(index) {
      if (revealedRows.has(index)) return;
      revealedRows.add(index);
      const rowChars = chars[index] || [];
      const first = rowChars[0];
      if (first) {
        const giant = first.closest('.giant');
        const indexMark = giant && $('.giant-index', giant);
        if (indexMark) gsap.to(indexMark, { autoAlpha: 1, duration: ST.REVEAL.DURATION, ease: 'power1.out' });
      }
      gsap.to(rowChars, { yPercent: 0, duration: ST.REVEAL.DURATION, stagger: 0.055, ease: ST.REVEAL.EASE });
    }

    function revealTape(tape) {
      if (revealedTapes.has(tape)) return;
      revealedTapes.add(tape);
      const state = { value: 0 };
      gsap.to(state, {
        value: 1,
        duration: 0.75,
        delay: 0.3,
        ease: 'power2.inOut',
        onUpdate: () => tape.style.setProperty('--peel', String(state.value))
      });
    }

    function revealArrow(index) {
      if (revealedArrows.has(index)) return;
      revealedArrows.add(index);
      const item = arrows[index];
      if (!item) return;
      if (item.line) gsap.to(item.line, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' });
      if (item.head) gsap.to(item.head, { strokeDashoffset: 0, duration: 0.3, ease: 'power2.inOut', delay: 0.9 });
    }

    const charTargets = chars.flat().map((char) => char.closest('.clip') || char);
    charTargets.forEach((target) => {
      const char = $('.char', target) || (target.classList.contains('char') ? target : null);
      const rowIndex = chars.findIndex((list) => list.includes(char));
      ST.onVisible(target, () => revealRow(rowIndex), { rootMargin: '20% 20% 20% 20%' });
    });
    tapes.forEach((tape) => ST.onVisible(tape, () => revealTape(tape), { rootMargin: '15% 0px' }));
    arrows.forEach((item, index) => ST.onVisible(item.line || item.head, () => revealArrow(index), { rootMargin: '15% 0px' }));
    initHandNotes(section);

    function buildTimeline() {
      if (timeline) timeline.kill();
      if (pinTrigger) pinTrigger.kill();
      data = compute();
      lengths = distances(data.stops);
      totalDistance = lengths.reduce((sum, length) => sum + length, 0) || 1;
      setPosition(0);
      timeline = gsap.timeline();
      const scale = timeline.duration() || 0;
      const stops = data.stops;
      let elapsed = scale;
      for (let index = 1; index < stops.length; index++) {
        const duration = (lengths[index - 1] / totalDistance) * (stops.length - 1);
        timeline.to(canvas, {
          x: stops[index].x,
          y: stops[index].y,
          duration,
          ease: 'none'
        }, elapsed);
        elapsed += duration;
      }
      data.opens.forEach((sourceIndex, order) => {
        const at = Math.max(0, elapsedFor(sourceIndex) - 0.001);
        timeline.call(() => revealRow(order), null, at);
        if (order > 0) timeline.call(() => revealArrow(order - 1), null, Math.max(0, elapsedFor(sourceIndex) - 0.001));
      });
      pinTrigger = ScrollTrigger.create({
        trigger: wrapper || section,
        start: 'top top',
        end: () => `+=${Math.round(totalDistance * (timeline.duration() / (stops.length - 1 || 1)))}`,
        pin: wrapper || section,
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        animation: timeline
      });
    }

    function elapsedFor(index) {
      let elapsed = 0;
      for (let step = 1; step <= index && step < lengths.length; step++) elapsed += (lengths[step - 1] / totalDistance) * (data.stops.length - 1);
      return elapsed;
    }

    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fontsReady, ST.wait(700)]).then(() => {
      buildTimeline();
      ScrollTrigger.refresh();
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (pinTrigger) pinTrigger.kill();
        buildTimeline();
        ScrollTrigger.refresh();
      }, 180);
    }, { passive: true });
  }

  function initStickAndFooter() {
    const stick = $('.make-it-stick');
    if (stick) {
      ST.onVisible(stick, () => {
        ST.revealChars(stick, { delay: 0.05 });
        const sub = $('.stick-sub', stick);
        if (sub) ST.revealBody(sub, { delay: 0.35 });
      }, { rootMargin: '0px 0px -18% 0px' });
    }

    const footer = $('.site-footer');
    if (footer) {
      ST.onVisible(footer, () => {
        ST.revealChars(footer, { delay: 0.05, stagger: 0.018 });
      }, { rootMargin: '0px 0px -12% 0px' });
    }
  }

  function initBodyReveals() {
    const copies = $$('.body-copy').filter((copy) => !copy.closest('.tape-slider-parent') && !copy.closest('.make-it-stick'));
    copies.forEach((copy) => {
      const rises = $$('.body-rise', copy);
      if (!rises.length) return;
      if (gsap && !reduced) gsap.set(rises, { yPercent: ST.BODY_REVEAL.HIDDEN });
      else rises.forEach((rise) => ST.apply(rise, { yPercent: ST.BODY_REVEAL.HIDDEN }));
      ST.onVisible(copy, () => {
        ST.revealBody(copy, {
          delay: 0,
          stagger: 0.08,
          onComplete: () => { copy.dataset.arrived = ''; }
        });
      }, { rootMargin: '0px 0px -12% 0px' });
    });
  }

  initHero();
  initParallax();
  initPeels();
  initWave();
  initGiant();
  initStickAndFooter();
  initBodyReveals();
  initHandNotes(document);
})();
