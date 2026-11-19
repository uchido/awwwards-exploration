(() => {
  const cursor = document.getElementById('custom-cursor');
  const cursorHoverText = document.getElementById('cursor-hover-text');
  let activeHoverTarget = null;
  let isCursorHoldActive = false;
  let textRevealFrame = 0;

  const cursorMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cursorFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  // Don't show custom cursor on touch/coarse pointers
  if (!cursorFinePointer.matches) {
    if (cursor) cursor.remove();
    return;
  }

  const interactiveSelector = 'a, button, [role="button"], [hide-custom-cursor-on-hover], .directors__list__item, .w-nav-button, .menu-toggle, .menu__close, [custom-cursor-hover-state]';

  const hideHoverText = () => {
    cancelAnimationFrame(textRevealFrame);
    textRevealFrame = 0;
    if (cursorHoverText) cursorHoverText.classList.remove('is-revealed');
  };

  const showHoverText = (text) => {
    const value = String(text || '').trim();
    if (!value || isCursorHoldActive || (cursorHoverText && cursorHoverText.classList.contains('is-suppressed'))) {
      hideHoverText();
      return;
    }
    if (cursorHoverText && cursorHoverText.textContent === value && (cursorHoverText.classList.contains('is-revealed') || textRevealFrame)) return;
    hideHoverText();
    if (cursorHoverText) {
      cursorHoverText.replaceChildren(
        ...Array.from(value, (character) => {
          const wrapper = document.createElement('span');
          const inner = document.createElement('span');
          wrapper.className = 'cursor-char';
          inner.textContent = character;
          wrapper.appendChild(inner);
          return wrapper;
        }),
      );
    }
    textRevealFrame = requestAnimationFrame(() => {
      textRevealFrame = requestAnimationFrame(() => {
        textRevealFrame = 0;
        if (cursorHoverText) cursorHoverText.classList.add('is-revealed');
      });
    });
  };

  const updateCursorTarget = (target) => {
    if (!cursor) return;
    cursor.classList.toggle('is-interactive', !!target?.closest(interactiveSelector));
    cursor.classList.toggle('is-suppressed', !!target?.closest('[hide-cursor], input, textarea, select, [contenteditable="true"]'));
    const mobileBrands = target?.closest('.home__brands') && window.matchMedia('(max-width: 991px), (hover: none), (pointer: coarse)').matches;
    const nextTarget = mobileBrands || target?.closest('.home__hero__projects-lists, .home__hero__projects-current, .home__brands__list') ? null : target?.closest('[data-hover-text]') || null;
    activeHoverTarget = nextTarget;
    if (nextTarget) showHoverText(nextTarget.getAttribute('data-hover-text'));
    else hideHoverText();
  };

  const positionCursor = (x, y) => {
    if (!cursor) return;
    cursor.style.left = '0px';
    cursor.style.top = '0px';
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const renderCursor = (time) => {
    if (!cursor) return;
    cursorFrame = 0;
    const elapsed = cursorLastTime ? Math.min(time - cursorLastTime, 64) : 1000 / 60;
    cursorLastTime = time;
    const follow = cursorMotionPreference.matches ? 1 : 1 - Math.pow(0.9, elapsed / (1000 / 60));
    cursorPosition.textX += (cursorPosition.x - cursorPosition.textX) * follow;
    cursorPosition.textY += (cursorPosition.y - cursorPosition.textY) * follow;
    if (!cursor.classList.contains('is-hold-morphing')) {
      positionCursor(cursorPosition.x, cursorPosition.y);
    }
    if (cursorHoverText) {
      cursorHoverText.style.transform = `translate3d(${cursorPosition.textX - cursorPosition.x}px, ${cursorPosition.textY - cursorPosition.y}px, 0)`;
    }
    if (Math.abs(cursorPosition.x - cursorPosition.textX) + Math.abs(cursorPosition.y - cursorPosition.textY) > 0.05) {
      cursorFrame = requestAnimationFrame(renderCursor);
    } else cursorLastTime = 0;
  };

  const setCursorHoldActive = (isActive) => {
    isCursorHoldActive = isActive;

    if (isActive) {
      hideHoverText();
      return;
    }

    if (cursorPosition) {
      positionCursor(cursorPosition.x, cursorPosition.y);
      cursorPosition.textX = cursorPosition.x;
      cursorPosition.textY = cursorPosition.y;
    }
    if (cursorHoverText) cursorHoverText.style.transform = 'translate3d(0, 0, 0)';
    if (cursor) updateCursorTarget(document.elementFromPoint(cursorPosition.x, cursorPosition.y));
  };

  if (!cursor) return;

  window.pspCursor = {
    position: positionCursor,
    setHoldActive: setCursorHoldActive,
    isInteractive: (target) => !!target.closest(interactiveSelector),
  };

  cursorPosition = { x: 0, y: 0, textX: 0, textY: 0, initialized: false };
  cursorFrame = 0;
  cursorLastTime = 0;
  let textRevealFrame = 0;

  window.addEventListener(
    'pointermove',
    (event) => {
      if (!cursorFinePointer.matches || event.pointerType === 'touch') return;
      cursorPosition.x = event.clientX;
      cursorPosition.y = event.clientY;
      if (!cursorPosition.initialized) {
        cursorPosition.textX = event.clientX;
        cursorPosition.textY = event.clientY;
        cursorPosition.initialized = true;
      }
      cursor.classList.add('is-visible');
      updateCursorTarget(event.target);
      if (!cursorFrame) cursorFrame = requestAnimationFrame(renderCursor);
    },
    { passive: true },
  );

  document.addEventListener('pointerover', (event) => updateCursorTarget(event.target));
  window.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch' && cursor.classList.contains('is-interactive')) {
      cursor.classList.add('is-pressed');
    }
  });
  window.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'));
  window.addEventListener('pointercancel', () => cursor.classList.remove('is-pressed'));
  window.addEventListener(
    'scroll',
    () => {
      if (cursorPosition && cursorPosition.initialized) updateCursorTarget(document.elementFromPoint(cursorPosition.x, cursorPosition.y));
    },
    { passive: true },
  );

  const hideCursor = () => {
    if (cursor) {
      cursor.classList.remove('is-visible', 'is-interactive', 'is-pressed');
      activeHoverTarget = null;
      if (cursorPosition) cursorPosition.initialized = false;
      cursorFrame = 0;
      cursorLastTime = 0;
      hideHoverText();
    }
  };
  document.documentElement.addEventListener('pointerleave', hideCursor);
  window.addEventListener('blur', hideCursor);
  cursorFinePointer.addEventListener('change', hideCursor);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hideCursor();
  });
})();