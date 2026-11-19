(() => {
  const DURATION = {
    listStart: 0.2,
    listDuration: 3.4,
    itemStagger: 0.024,
    headingStart: 0.75,
    wipeFillDuration: 0.46,
    wipeRevealDuration: 0.4,
    wipeStagger: 0.065,
    entryPause: 1.2,
    listsFade: 2.65,
    textureFade: 2.95,
    cutStart: 3.6,
    handoffDuration: 0.2,
    cutScale: 4.15,
    zoomDuration: 0.9,
    zoomFade: 4.8,
    complete: 5.2,
  };

  const COLORS = {
    wipe: '#3ffbbf',
    background: '#ff0063',
  };

  const SELECTORS = {
    loader: '.home__loader',
    leftList: '.home__loader-commercial .collection-list',
    rightList: '.home__loader-long-format .collection-list',
    regularHeading: '.home__loader-heading.regular-heading',
    cutHeading: '.home__loader-heading.cut-heading',
    blobs: '.home__loader .blobs',
    blobItems: '.home__loader .blob',
    loaderGrid: '.home__loader .d-container',
    heroSection: '.home__hero',
    heroVideos: 'video.home__hero__video',
    heroItems: '.home__hero__projects-list-item',
    heroCurrent: '.home__hero__projects-current',
    heroTitle: '.home__hero__projects-current__title',
    heroMadeBy: '.home__hero__projects-current__made-by',
    heroDirector: '.home__hero__projects-current__director',
    aboutSection: '.home__about',
    brandsSection: '.home__brands',
    footer: '.footer',
    customCursor: '#custom-cursor',
    cursorFrame: '.cursor-frame',
    cursorHoverText: '#cursor-hover-text',
    cursorHoverTiming: '#cursor-hover-timing',
    transition: '.transition',
    transitionLines: '.transition__line',
    interactiveSelector: 'a, button, [role="button"], [hide-custom-cursor-on-hover], .directors__list__item, .w-nav-button, .menu-toggle, .menu__close, [custom-cursor-hover-state]',
  };

  const MOBILE_HEADING_LINES = [
    'We believe happiness&mdash;ours',
    'and yours&mdash;comes from',
    'clarity, calm, and clever',
    'problem-solving. That&rsquo;s',
    'something <span class="text-span-8">you</span>&rsquo;ll feel on set.',
  ];

  const createElement = (tagName, className, text = '') => {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  };

  const cleanText = (value) => value.replace(/\s+/g, ' ').trim();

  const formatCount = (value) => `[${String(value).padStart(2, '0')}]`;

  const getItems = (list) => Array.from(list.children).filter((item) => item.matches('[role="listitem"], .w-dyn-item'));

  const renderListItem = (item, title, count, side) => {
    const number = createElement('span', 'home-intro__count', formatCount(count));
    const label = createElement('span', 'home-intro__title', title);
    item.textContent = '';
    item.classList.add('home-intro__item', `home-intro__item--${side}`);
    if (side === 'right') {
      item.append(label, number);
      return;
    }
    item.append(number, label);
  };

  const prepareList = (list, side) => {
    const sourceItems = getItems(list);
    const templates = sourceItems
      .map((item) => ({
        node: item.cloneNode(false),
        title: cleanText(item.textContent),
      }))
      .filter((template) => template.title);

    if (!templates.length) return null;

    list.textContent = '';

    const appendItem = (template) => {
      const item = template.node.cloneNode(false);
      item.dataset.homeIntroTitle = template.title;
      list.appendChild(item);
      renderListItem(item, template.title, 1, side);
    };

    templates.forEach(appendItem);

    const minHeight = Math.max(window.innerHeight * 1.12, 620);
    let index = 0;

    const rowHeights = getItems(list).map((item) => item.getBoundingClientRect().height);
    const rowGap = parseFloat(getComputedStyle(list).rowGap) || 0;
    let height = list.scrollHeight;
    const additionalItems = document.createDocumentFragment();

    while (height < minHeight && index < templates.length * 12) {
      const templateIndex = index % templates.length;
      const template = templates[templateIndex];
      const item = template.node.cloneNode(false);
      item.dataset.homeIntroTitle = template.title;
      renderListItem(item, template.title, 1, side);
      additionalItems.appendChild(item);
      height += rowHeights[templateIndex] + rowGap;
      index += 1;
    }
    list.appendChild(additionalItems);

    const items = getItems(list);
    const total = items.length;

    items.forEach((item, itemIndex) => {
      renderListItem(item, item.dataset.homeIntroTitle, total - itemIndex, side);
    });

    return {
      element: list,
      items,
      height: list.scrollHeight,
    };
  };

  const createMask = (color) => {
    const mask = createElement('span', 'home-intro__mask');
    mask.style.setProperty('--home-intro-mask', color || COLORS.wipe);
    return mask;
  };

  const wrapWipeLine = (line) => {
    const existingContent = Array.from(line.children).find((child) => child.classList.contains('home-intro__content'));
    const existingMask = Array.from(line.children).find((child) => child.classList.contains('home-intro__mask'));

    if (existingContent && existingMask) {
      return { line, content: existingContent, mask: existingMask };
    }

    const content = createElement('span', 'home-intro__content');
    while (line.firstChild) {
      content.appendChild(line.firstChild);
    }

    const mask = createMask();
    line.classList.add('home-intro__line');
    line.append(content, mask);

    return { line, content, mask };
  };

  const prepareHeadingWipe = (heading) => {
    if (!heading) return [];

    if (window.innerWidth < 768) {
      heading.innerHTML = '';
      return MOBILE_HEADING_LINES.map((lineHtml) => {
        const line = createElement('span', 'home-intro__line');
        line.innerHTML = lineHtml;
        heading.appendChild(line);
        return wrapWipeLine(line);
      });
    }

    const existingLines = Array.from(heading.children).filter((child) => child.classList.contains('home-intro__line'));

    if (existingLines.length) {
      return existingLines.map(wrapWipeLine);
    }

    if (window.SplitText) {
      const split = new SplitText(heading, {
        type: 'lines',
        linesClass: 'home-intro__line',
      });
      return split.lines.map(wrapWipeLine);
    }

    return [wrapWipeLine(heading)];
  };

  const getListEndY = (listHeight) => {
    const overflow = Math.max(0, listHeight - window.innerHeight);
    return -(overflow + window.innerHeight * 0.025);
  };

  const revealItems = (timeline, items, position, stagger) => {
    timeline.to(items, { autoAlpha: 1, duration: 0.28, ease: 'power1.inOut', stagger }, position);
  };

  const queueWipe = (timeline, items, position) => {
    const masks = items.map((item) => item.mask);
    const contents = items.map((item) => item.content);

    timeline
      .to(
        masks,
        {
          scaleX: 1,
          transformOrigin: 'right center',
          duration: DURATION.wipeFillDuration,
          ease: 'homeIntroWipeFill',
          stagger: DURATION.wipeStagger,
        },
        position,
      )
      .set(contents, { autoAlpha: 1, stagger: DURATION.wipeStagger }, position + DURATION.wipeFillDuration)
      .to(
        masks,
        {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: DURATION.wipeRevealDuration,
          ease: 'homeIntroWipeReveal',
          stagger: DURATION.wipeStagger,
        },
        position + DURATION.wipeFillDuration,
      );

    return position + DURATION.wipeFillDuration + DURATION.wipeRevealDuration + (items.length - 1) * DURATION.wipeStagger;
  };

  const awaitProceed = (loader, onProceed) => {
    if (state.entry) return;

    const entry = createElement('div', 'home-intro__entry');
    const button = createElement('button', 'home-intro__proceed', '[ Tap to roll the camera ]');
    button.type = 'button';
    button.setAttribute('aria-label', 'Roll camera — tap to enter the website');
    entry.append(button);
    loader.append(entry);
    state.entry = entry;
    state.inertElements = Array.from(document.body.children).filter((element) => element !== loader && !element.inert && !element.matches('script, style, link'));
    state.inertElements.forEach((element) => {
      element.inert = true;
    });

    if (window.gsap) {
      gsap.fromTo(
        button,
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          force3D: true,
          duration: reducedMotion ? 0 : 0.65,
          ease: 'power2.out',
        },
      );
    }

    entry.addEventListener(
      'click',
      () => {
        state.entered = true;
        window.homeIntroEntered = true;
        document.dispatchEvent(new Event('home-intro-enter'));
        button.disabled = true;
        if (window.gsap) {
          gsap.to(button, {
            autoAlpha: 0,
            y: -4,
            force3D: true,
            duration: 0.3,
            ease: 'power2.in',
            overwrite: true,
            onComplete: () => entry.remove(),
          });
        } else {
          entry.remove();
        }
        onProceed();
      },
      { once: true },
    );
  };

  const finishIntro = () => {
    state.entry?.remove();
    state.entry = null;
    state.inertElements.forEach((element) => {
      element.inert = false;
    });
    state.inertElements = [];
    document.documentElement.classList.remove('home-intro-pending');
    unlockScroll();
    if (!window.homeIntroExiting) {
      window.homeIntroExiting = true;
      document.dispatchEvent(new Event('home-intro-exit'));
    }
    if (!window.homeHeroReady) {
      window.homeHeroReady = true;
      document.dispatchEvent(new Event('home-hero-ready'));
    }
    document.dispatchEvent(new Event('home-intro-complete'));
  };

  const markIntroSeen = () => {
    try {
      sessionStorage.setItem('psp-home-intro-seen', '1');
    } catch (e) {}
  };
  document.addEventListener('home-intro-exit', markIntroSeen, { once: true });

  // State
  const state = {
    timeline: null,
    cutScreen: null,
    entered: false,
    entry: null,
    inertElements: [],
    scrollLocked: false,
    scrollNormalizer: null,
  };

  const requiresTap = window.matchMedia('(max-width: 991px)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const scrollKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

  const preventScrollInput = (event) => {
    if (event.cancelable) event.preventDefault();
  };

  const preventScrollKey = (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey || !scrollKeys.has(event.key)) return;
    if (event.key === ' ' && event.target.closest?.('button')) return;
    preventScrollInput(event);
  };

  const keepIntroAtTop = () => {
    if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
  };

  const pauseScrollEngine = () => {
    if (!state.scrollLocked) return;
    window.lenis?.stop();
    const normalizer = window.ScrollTrigger?.normalizeScroll?.();
    if (normalizer) {
      state.scrollNormalizer = normalizer;
      normalizer.disable();
    }
    keepIntroAtTop();
  };

  const lockScroll = () => {
    if (state.scrollLocked) return;
    state.scrollLocked = true;
    document.documentElement.classList.add('home-intro-lock');
    document.body.classList.add('home-intro-lock');
    window.scrollTo(0, 0);
    window.addEventListener('wheel', preventScrollInput, { passive: false, capture: true });
    window.addEventListener('touchmove', preventScrollInput, { passive: false, capture: true });
    window.addEventListener('keydown', preventScrollKey, true);
    window.addEventListener('scroll', keepIntroAtTop, { passive: true });
    document.addEventListener('home-content-ready', pauseScrollEngine);
    pauseScrollEngine();
  };

  const unlockScroll = () => {
    if (!state.scrollLocked) return;
    state.scrollLocked = false;
    window.removeEventListener('wheel', preventScrollInput, true);
    window.removeEventListener('touchmove', preventScrollInput, true);
    window.removeEventListener('keydown', preventScrollKey, true);
    window.removeEventListener('scroll', keepIntroAtTop);
    document.removeEventListener('home-content-ready', pauseScrollEngine);
    document.documentElement.classList.remove('home-intro-lock');
    document.body.classList.remove('home-intro-lock');
    window.scrollTo(0, 0);
    window.ScrollTrigger?.refresh();
    window.lenis?.resize();
    window.lenis?.scrollTo(0, { immediate: true, force: true });
    window.ScrollTrigger?.update();
    state.scrollNormalizer?.enable();
    state.scrollNormalizer = null;
    window.lenis?.start();
    window.ScrollTrigger?.update();
  };

  const primeIntro = () => {
    const loader = document.querySelector(SELECTORS.loader);
    if (!loader) return;

    const leftList = loader.querySelector('.home__loader-commercial .collection-list');
    const rightList = loader.querySelector('.home__loader-long-format .collection-list');
    const regularHeading = loader.querySelector(SELECTORS.regularHeading);
    const cutHeading = loader.querySelector(SELECTORS.cutHeading);
    const blobs = document.querySelector(SELECTORS.blobs);
    const blobItems = gsap.utils.toArray(SELECTORS.blobItems);
    const loaderGrid = document.querySelector(SELECTORS.loaderGrid);

    if (!leftList || !rightList || !regularHeading || !cutHeading || !blobs) return;

    lockScroll();

    if (!window.gsap) {
      loader.style.display = 'block';
      loader.style.opacity = '1';
      loader.style.visibility = 'visible';
      [leftList, rightList, regularHeading, cutHeading, ...blobItems, loaderGrid].filter(Boolean).forEach((element) => {
        element.style.opacity = '0';
        element.style.visibility = 'hidden';
      });
      return;
    }

    gsap.set(loader, { autoAlpha: 1, display: 'block' });
    gsap.set([leftList, rightList, regularHeading, cutHeading, ...blobItems, loaderGrid].filter(Boolean), {
      autoAlpha: 0,
    });

    if (blobs) {
      gsap.set(blobs, {
        autoAlpha: 1,
        '--home-intro-vignette-opacity': 1,
      });
    }

    // Animate blobs
    if (blobItems.length) {
      gsap.to(blobItems, {
        y: 0,
        opacity: 0.85,
        duration: 2,
        ease: 'power2.out',
        stagger: 0.4,
        delay: 0.3,
      });
    }

    // Animate lists
    const left = prepareList(leftList, 'left');
    const right = prepareList(rightList, 'right');

    if (!left || !right) {
      showStaticPage(loader);
      return;
    }

    // Create wipe lines from heading
    const wipeItems = prepareHeadingWipe(regularHeading);

    // Setup timeline
    state.timeline?.kill();

    const waitForTap = requiresTap && !state.entered;
    const exitTimeline = waitForTap ? gsap.timeline({ paused: true, onComplete: finishIntro }) : null;
    state.timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: waitForTap ? undefined : finishIntro,
    });

    const tl = state.timeline;
    const exit = exitTimeline || tl;
    const exitAt = (time) => (waitForTap ? time - DURATION.textureFade : time);

    // Start lists animation
    tl.to(
      left.element,
      {
        y: getListEndY(left.height),
        duration: DURATION.listDuration,
        ease: 'homeIntroTravel',
        force3D: true,
      },
      DURATION.listStart,
    ).to(
      right.element,
      {
        y: getListEndY(right.height),
        duration: DURATION.listDuration,
        ease: 'homeIntroTravel',
        force3D: true,
      },
      DURATION.listStart + 0.05,
    );

    revealItems(tl, left.items, DURATION.listStart + 0.05, DURATION.itemStagger);
    revealItems(tl, right.items, DURATION.listStart + 0.12, DURATION.itemStagger);

    const headingEnd = queueWipe(tl, wipeItems, DURATION.headingStart);

    if (waitForTap) {
      tl.call(
        () =>
          awaitProceed(loader, () => {
            tl.kill();
            exitTimeline.play();
          }),
        null,
        headingEnd + DURATION.entryPause,
      );
    }

    tl.to(
      [left.element, right.element],
      {
        autoAlpha: 0,
        duration: 0.95,
        ease: 'power2.out',
      },
      DURATION.listsFade,
    );

    if (waitForTap) {
      exit.to([left.element, right.element], { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0);
    }

    if (blobs && wipeItems.length) {
      tl.to(
        blobs,
        {
          '--home-intro-vignette-opacity': 0,
          duration: 0.62,
          ease: 'power2.inOut',
        },
        exitAt(DURATION.textureFade),
      );
    }

    exit
      .call(
        () => {
          window.homeIntroExiting = true;
          document.dispatchEvent(new Event('home-intro-exit'));
        },
        null,
        exitAt(DURATION.cutScale - 0.4),
      )
      .call(() => state.cutScreen?.sync(), null, exitAt(DURATION.cutStart))
      .call(() => state.cutScreen?.setScale(4.15), null, exitAt(DURATION.cutStart))
      .set(regularHeading, { autoAlpha: 0 }, exitAt(DURATION.cutStart + DURATION.handoffDuration))
      .set(loader, { autoAlpha: 0 }, exitAt(DURATION.cutStart + DURATION.handoffDuration))

      .to(
        { opening: 0 },
        {
          opening: 1,
          duration: DURATION.cutScale - DURATION.cutStart - DURATION.handoffDuration,
          ease: 'power2.inOut',
          onUpdate() {
            state.cutScreen?.setOpening(this.targets()[0].opening);
          },
        },
        exitAt(DURATION.cutStart + DURATION.handoffDuration),
      )

      .to(
        { progress: 0 },
        {
          progress: 1,
          duration: DURATION.zoomDuration,
          ease: 'homeIntroScale',
          onUpdate() {
            const endScale = window.innerWidth < 768 ? 800 : 1200;
            state.cutScreen?.setScale(endScale * this.targets()[0].progress);
          },
        },
        exitAt(DURATION.cutScale),
      )

      .to(
        state.cutScreen.canvas,
        {
          autoAlpha: 0,
          duration: DURATION.complete - DURATION.zoomFade,
          ease: 'power2.inOut',
        },
        exitAt(DURATION.zoomFade),
      )

      .add(() => {
        state.cutScreen?.destroy();
        state.cutScreen = null;
      })

      .call(
        () => {
          window.homeHeroReady = true;
          document.dispatchEvent(new Event('home-hero-ready'));
        },
        null,
        exitAt(DURATION.zoomFade),
      )

      .set(loader, { display: 'none' }, exitAt(DURATION.complete));
  };

  const showStaticPage = (loader) => {
    if (requiresTap && !state.entered) {
      document.documentElement.classList.remove('home-intro-pending');
      const heading = loader.querySelector(SELECTORS.regularHeading);
      if (heading) {
        heading.style.opacity = '1';
        heading.style.visibility = 'visible';
      }
      awaitProceed(loader, () => showStaticPage(loader));
      return;
    }

    finishIntro();

    if (window.gsap) {
      gsap.set(loader, { autoAlpha: 0, display: 'none' });
      return;
    }

    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    loader.style.display = 'none';
  };

  const init = () => {
    const loader = document.querySelector(SELECTORS.loader);
    const leftList = loader?.querySelector(SELECTORS.leftList);
    const rightList = loader?.querySelector(SELECTORS.rightList);
    const regularHeading = loader?.querySelector(SELECTORS.regularHeading);
    const cutHeading = loader?.querySelector(SELECTORS.cutHeading);

    if (!loader || !leftList || !rightList || !regularHeading || !cutHeading) return;

    const gsap = window.gsap;

    if (!gsap || reducedMotion) {
      showStaticPage(loader);
      return;
    }

    const left = prepareList(leftList, 'left');
    const right = prepareList(rightList, 'right');
    const wipeItems = prepareHeadingWipe(regularHeading);

    const blobs = document.querySelector(SELECTORS.blobs);
    const blobItems = gsap.utils.toArray(SELECTORS.blobItems);
    const loaderGrid = document.querySelector(SELECTORS.loaderGrid);
    const textureItems = [...blobItems, loaderGrid].filter(Boolean);

    if (!left || !right || !wipeItems.length) {
      showStaticPage(loader);
      return;
    }

    // Custom easing
    if (window.CustomEase) {
      CustomEase.create('homeIntroTravel', 'M0,0 C0.42,0 0.3,1 1,1');
      CustomEase.create('homeIntroWipeFill', 'M0,0 C0.76,0 0.24,1 1,1');
      CustomEase.create('homeIntroWipeReveal', 'M0,0 C0.16,1 0.3,1 1,1');
      CustomEase.create('homeIntroScale', 'M0,0 C0.55,0 0.75,0.35 1,1');
    }

    lockScroll();

    state.cutScreen?.destroy();
    state.cutScreen = createCutScreen(regularHeading, blobs);

    gsap.set(loader, { autoAlpha: 1, display: 'block' });
    gsap.set(regularHeading, { autoAlpha: 1 });

    if (blobs) {
      gsap.set(blobs, { '--home-intro-vignette-opacity': 1 });
    }

    gsap.set(textureItems, { autoAlpha: 1 });

    gsap.set([left.element, right.element], {
      autoAlpha: 1,
      y: window.innerHeight + 24,
      force3D: true,
    });

    gsap.set([...left.items, ...right.items], {
      autoAlpha: 0,
      display: 'flex',
    });

    gsap.set(
      wipeItems.map((item) => item.content),
      { autoAlpha: 0 },
    );

    gsap.set(
      wipeItems.map((item) => item.mask),
      {
        scaleX: 0,
        transformOrigin: 'right center',
      },
    );

    gsap.set(cutHeading, { autoAlpha: 0 });
    gsap.set(state.cutScreen.canvas, { autoAlpha: 0 });

    state.timeline?.kill();

    const waitForTap = requiresTap && !state.entered;
    const exitTimeline = waitForTap ? gsap.timeline({ paused: true, onComplete: finishIntro }) : null;
    state.timeline = gsap.timeline({
      defaults: { overwrite: 'auto' },
      onComplete: waitForTap ? undefined : finishIntro,
    });

    const tl = state.timeline;
    const exit = exitTimeline || tl;
    const exitAt = (time) => (waitForTap ? time - DURATION.textureFade : time);

    tl.to(
      left.element,
      {
        y: getListEndY(left.height),
        duration: DURATION.listDuration,
        ease: 'homeIntroTravel',
        force3D: true,
      },
      DURATION.listStart,
    ).to(
      right.element,
      {
        y: getListEndY(right.height),
        duration: DURATION.listDuration,
        ease: 'homeIntroTravel',
        force3D: true,
      },
      DURATION.listStart + 0.05,
    );

    revealItems(tl, left.items, DURATION.listStart + 0.05, DURATION.itemStagger);
    revealItems(tl, right.items, DURATION.listStart + 0.12, DURATION.itemStagger);
    const headingEnd = queueWipe(tl, wipeItems, DURATION.headingStart);

    if (waitForTap) {
      tl.call(
        () =>
          awaitProceed(loader, () => {
            tl.kill();
            exitTimeline.play();
          }),
        null,
        headingEnd + DURATION.entryPause,
      );
    }

    tl.to(
      [left.element, right.element],
      {
        autoAlpha: 0,
        duration: 0.95,
        ease: 'power2.out',
      },
      DURATION.listsFade,
    );

    if (waitForTap) {
      exit.to([left.element, right.element], { autoAlpha: 0, duration: 0.3, ease: 'power2.out' }, 0);
    }

    if (textureItems.length) {
      exit.to(
        textureItems,
        {
          autoAlpha: 0,
          duration: 0.62,
          ease: 'power2.inOut',
        },
        exitAt(DURATION.textureFade),
      );
    }

    if (blobs) {
      exit.to(
        blobs,
        {
          '--home-intro-vignette-opacity': 0,
          duration: 0.62,
          ease: 'power2.inOut',
        },
        exitAt(DURATION.textureFade),
      );
    }

    exit
      .call(
        () => {
          window.homeIntroExiting = true;
          document.dispatchEvent(new Event('home-intro-exit'));
        },
        null,
        exitAt(DURATION.cutScale - 0.4),
      )
      .call(() => state.cutScreen?.sync(), null, exitAt(DURATION.cutStart))
      .call(() => state.cutScreen?.setScale(4.15), null, exitAt(DURATION.cutStart))
      .set(regularHeading, { autoAlpha: 0 }, exitAt(DURATION.cutStart + DURATION.handoffDuration))
      .set(loader, { autoAlpha: 0 }, exitAt(DURATION.cutStart + DURATION.handoffDuration))

      .to(
        { opening: 0 },
        {
          opening: 1,
          duration: DURATION.cutScale - DURATION.cutStart - DURATION.handoffDuration,
          ease: 'power2.inOut',
          onUpdate() {
            state.cutScreen?.setOpening(this.targets()[0].opening);
          },
        },
        exitAt(DURATION.cutStart + DURATION.handoffDuration),
      )

      .to(
        { progress: 0 },
        {
          progress: 1,
          duration: DURATION.zoomDuration,
          ease: 'homeIntroScale',
          onUpdate() {
            const endScale = window.innerWidth < 768 ? 800 : 1200;
            state.cutScreen?.setScale(endScale * this.targets()[0].progress);
          },
        },
        exitAt(DURATION.cutScale),
      )

      .to(
        state.cutScreen.canvas,
        {
          autoAlpha: 0,
          duration: DURATION.complete - DURATION.zoomFade,
          ease: 'power2.inOut',
        },
        exitAt(DURATION.zoomFade),
      )

      .add(() => {
        state.cutScreen?.destroy();
        state.cutScreen = null;
      })

      .call(
        () => {
          window.homeHeroReady = true;
          document.dispatchEvent(new Event('home-hero-ready'));
        },
        null,
        exitAt(DURATION.zoomFade),
      )

      .set(loader, { display: 'none' }, exitAt(DURATION.complete));
  };

  const finishIntro = () => {
    state.entry?.remove();
    state.entry = null;
    state.inertElements.forEach((element) => {
      element.inert = false;
    });
    state.inertElements = [];
    document.documentElement.classList.remove('home-intro-pending');
    unlockScroll();
    if (!window.homeIntroExiting) {
      window.homeIntroExiting = true;
      document.dispatchEvent(new Event('home-intro-exit'));
    }
    if (!window.homeHeroReady) {
      window.homeHeroReady = true;
      document.dispatchEvent(new Event('home-hero-ready'));
    }
    document.dispatchEvent(new Event('home-intro-complete'));
  };

  const createCutScreen = (heading, colorSource) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const textCanvas = document.createElement('canvas');
    const textContext = textCanvas.getContext('2d');
    const cutState = {
      scale: 1,
      opening: 0,
      textBlend: getComputedStyle(heading).mixBlendMode === 'difference' ? 'difference' : 'source-over',
      dpr: 1,
      fragments: [],
      originX: 0,
      originY: 0,
      baseColor: getBackgroundColor(colorSource, '#ff0080'),
    };

    canvas.className = 'home-intro__cut-screen';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.willChange = 'opacity';
    document.body.appendChild(canvas);

    const drawText = (operation, opacity) => {
      context.globalCompositeOperation = operation;
      context.globalAlpha = opacity;
      context.drawImage(textCanvas, 0, 0, canvas.clientWidth, canvas.clientHeight);
    };

    const draw = () => {
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.setTransform(cutState.dpr, 0, 0, cutState.dpr, 0, 0);
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = cutState.baseColor;
      context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      context.save();
      context.translate(cutState.originX, cutState.originY);
      context.scale(cutState.scale, cutState.scale);
      context.translate(-cutState.originX, -cutState.originY);
      drawText(cutState.textBlend, 1);
      if (cutState.opening > 0) drawText('destination-out', cutState.opening);
      context.restore();
    };

    const sync = () => {
      const target = heading.querySelector('.text-span-8:last-of-type');
      const rect = (target || heading).getBoundingClientRect();
      cutState.originX = rect.left + rect.width * (target ? 0.14 : 0.5);
      cutState.originY = rect.top + rect.height * (target ? 0.4 : 0.5);
      cutState.dpr = Math.min(window.devicePixelRatio || 1, 2);
      cutState.fragments = getTextFragments(heading);
      cutState.baseColor = getBackgroundColor(colorSource, cutState.baseColor);
      canvas.width = Math.ceil(canvas.clientWidth * cutState.dpr);
      canvas.height = Math.ceil(canvas.clientHeight * cutState.dpr);
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;
      textContext.setTransform(cutState.dpr, 0, 0, cutState.dpr, 0, 0);
      textContext.textBaseline = 'alphabetic';
      textContext.fillStyle = '#fff';
      cutState.fragments.forEach((fragment) => {
        textContext.font = fragment.font;
        textContext.letterSpacing = fragment.letterSpacing === 'normal' ? '0px' : fragment.letterSpacing;
        textContext.fontKerning = fragment.kerning;
        textContext.fillText(fragment.text, fragment.x, fragment.y);
      });
      draw();
    };

    const setScale = (scale) => {
      cutState.scale = scale;
      draw();
    };

    const setOpening = (opening) => {
      cutState.opening = opening;
      draw();
    };

    let resizeFrame = 0;
    const queueSync = () => {
      if (resizeFrame) return;
      resizeFrame = requestAnimationFrame(() => {
        resizeFrame = 0;
        sync();
      });
    };
    const resizeObserver = new ResizeObserver(queueSync);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', queueSync, { passive: true });
    document.addEventListener('home-viewport-resize', queueSync);
    sync();

    const destroy = () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', queueSync);
      document.removeEventListener('home-viewport-resize', queueSync);
      canvas.remove();
    };

    return { canvas, sync, setScale, setOpening, destroy };
  };

  const getBackgroundColor = (element, fallback) => {
    if (!element) return fallback;
    const color = window.getComputedStyle(element).backgroundColor;
    return color && color !== 'rgba(0, 0, 0, 0)' ? color : fallback;
  };

  const getCanvasFont = (style) => [style.fontStyle, style.fontVariant, style.fontWeight, style.fontSize, style.fontFamily].filter(Boolean).join(' ');

  const getTransformedText = (text, style) => {
    const normalized = text.replace(/\s+/g, ' ');

    if (style.textTransform === 'uppercase') return normalized.toUpperCase();
    if (style.textTransform === 'lowercase') return normalized.toLowerCase();
    if (style.textTransform === 'capitalize') {
      return normalized.replace(/\b\p{L}/gu, (letter) => letter.toUpperCase());
    }

    return normalized;
  };

  const getTextFragments = (heading) => {
    const fragments = [];
    const baselines = new Map();
    const getBaseline = (font) => {
      if (baselines.has(font)) return baselines.get(font);
      const probe = document.createElement('span');
      const marker = document.createElement('span');
      Object.assign(probe.style, { position: 'fixed', visibility: 'hidden', whiteSpace: 'nowrap', font });
      Object.assign(marker.style, { display: 'inline-block', width: '0', height: '0', verticalAlign: 'baseline' });
      probe.append(document.createTextNode('Hg'), marker);
      document.body.appendChild(probe);
      const range = document.createRange();
      range.selectNodeContents(probe.firstChild);
      const baseline = marker.getBoundingClientRect().top - range.getBoundingClientRect().top;
      probe.remove();
      baselines.set(font, baseline);
      return baseline;
    };
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.textContent || '';
      const matches = Array.from(text.matchAll(/\S+\s*/g));

      matches.forEach((match) => {
        const value = match[0];
        const start = match.index;
        const end = start + value.length;
        const range = document.createRange();

        range.setStart(node, start);
        range.setEnd(node, end);

        const rect = range.getBoundingClientRect();
        range.detach();

        if (!rect.width || !rect.height) return;

        const style = window.getComputedStyle(node.parentElement || heading);

        const font = getCanvasFont(style);
        fragments.push({
          text: getTransformedText(value, style),
          x: rect.left,
          y: rect.top + getBaseline(font),
          font,
          letterSpacing: style.letterSpacing,
          kerning: style.fontKerning,
        });
      });
    }

    return fragments;
  };

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    // Skip intro if already seen
    if (window.homeIntroSkip) {
      const loader = document.querySelector(SELECTORS.loader);
      if (loader) showStaticPage(loader);
      return;
    }

    // Check if we should skip for iOS
    const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    let skip = false;
    try {
      skip = !isIOS && sessionStorage.getItem('psp-home-intro-seen') === '1';
    } catch (e) {}
    window.homeIntroSkip = skip;
    document.documentElement.classList.add(skip ? 'home-intro-skip' : 'home-intro-pending');

    primeIntro();
    let started = false;
    const startIntro = () => {
      if (started) return;
      started = true;
      init();
      document.documentElement.classList.remove('home-intro-pending');
    };

    const waitForFonts = () => {
      const fontDeadline = setTimeout(() => {
        const loader = document.querySelector(SELECTORS.loader);
        if (loader) loader.classList.add('home-intro-font-fallback');
        startIntro();
      }, 600);
      const elements = [SELECTORS.leftList, SELECTORS.rightList, SELECTORS.regularHeading].map((s) => document.querySelector(s)).filter(Boolean);
      elements.push(...document.querySelectorAll(`${SELECTORS.regularHeading} .text-span-8`));
      const fonts = new Set(
        elements.map((element) => {
          const style = window.getComputedStyle(element);
          return `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        }),
      );
      Promise.all(Array.from(fonts, (font) => document.fonts?.load(font)))
        .then(() => {
          clearTimeout(fontDeadline);
          startIntro();
        })
        .catch(() => {
          clearTimeout(fontDeadline);
          startIntro();
        });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', waitForFonts, { once: true });
    } else {
      waitForFonts();
    }
  });
})();