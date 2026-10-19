(() => {
  'use strict';

  const HAS_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  let globalMouseX = -1000;
  let globalMouseY = -1000;
  let isOverArchiveOverlay = false;

  document.addEventListener('mousemove', (e) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;

    const elAtPoint = document.elementFromPoint(globalMouseX, globalMouseY);
    isOverArchiveOverlay = !!(elAtPoint && elAtPoint.closest('.s-a-archive-overlay'));
  }, { passive: true, capture: true });

  function isCursorInsideElement(el, mouseX, mouseY) {
    const rect = el.getBoundingClientRect();
    return mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom;
  }

  function setupCustomCursor(container, imageSelector) {
    const isArchiveRow = container.classList.contains('s-a-archive-row');
    const isCaseStudyRow = container.classList.contains('s-a-home-case-study-row') || container.classList.contains('s-a-case-study-page-row');
    const isArchiveRowTablet = container.classList.contains('s-a-archive-row-tablet');
    const isCaseStudiesMoreItem = container.classList.contains('s-a-case-studies-more-item');
    const isHomeAwardItem = container.classList.contains('s-a-home-award-item');
    const isCard = container.classList.contains('s-a-card');

    const originalImg = container.querySelector(imageSelector);
    if (!originalImg && !isArchiveRow && !isCaseStudyRow && !isArchiveRowTablet && !isCaseStudiesMoreItem && !isHomeAwardItem && !isCard) return;

    let customCursorImg = null;
    if (originalImg) {
      customCursorImg = originalImg.cloneNode(true);
      customCursorImg.classList.add('custom-cursor');
      customCursorImg.style.position = 'fixed';
      customCursorImg.style.top = '0';
      customCursorImg.style.left = '0';
      customCursorImg.style.opacity = '0';
      customCursorImg.style.pointerEvents = 'none';
      customCursorImg.style.zIndex = '5000';
      customCursorImg.style.display = 'block';
      customCursorImg.style.willChange = 'transform';
      customCursorImg.style.transform = 'translate3d(-1000px, -1000px, 0)';
    }

    let isVisible = false;
    let isForceDisabled = false;

    let isHoveredClassOn = false;
    function setHoveredClass(on) {
      if (!isArchiveRow && !isArchiveRowTablet) return;
      if (on && !isHoveredClassOn) {
        container.classList.add('is-hovered');
        isHoveredClassOn = true;
      } else if (!on && isHoveredClassOn) {
        container.classList.remove('is-hovered');
        isHoveredClassOn = false;
      }
    }

    let hoverImg = null;
    if (isCaseStudyRow || isCaseStudiesMoreItem) {
      hoverImg = container.querySelector('.s-a-image-cursor-hover') || document.querySelector('.s-a-image-cursor-hover');
      if (hoverImg) {
        hoverImg.style.pointerEvents = 'none';
        hoverImg.style.setProperty('display', 'none', 'important');
      }
    }

    let isHoverImageVisible = false;
    function setHoverImage(on) {
      if (!hoverImg) return;
      if (on && !isHoverImageVisible) {
        hoverImg.style.setProperty('display', 'block', 'important');
        isHoverImageVisible = true;
      } else if (!on && isHoverImageVisible) {
        hoverImg.style.setProperty('display', 'none', 'important');
        isHoverImageVisible = false;
      }
    }

    function enableCursor() {
      if (!customCursorImg) return;
      if (isVisible || isForceDisabled) return;

      container.style.cursor = 'none';
      if (originalImg) originalImg.style.visibility = 'hidden';

      const rect = originalImg.getBoundingClientRect();
      if (rect.width && rect.height) {
        customCursorImg.style.width = rect.width + 'px';
        customCursorImg.style.height = rect.height + 'px';
      }

      customCursorImg.style.opacity = '1';
      if (!document.body.contains(customCursorImg)) {
        document.body.appendChild(customCursorImg);
      }
      isVisible = true;
    }

    function disableCursor() {
      if (!customCursorImg) return;
      if (!isVisible) return;

      container.style.cursor = 'default';
      if (originalImg) originalImg.style.visibility = 'visible';
      customCursorImg.style.opacity = '0';

      isVisible = false;
    }

    function updatePosition() {
      if (!customCursorImg) return;
      customCursorImg.style.transform = `translate3d(${globalMouseX}px, ${globalMouseY}px, 0) translate(-50%, -50%)`;
    }

    function checkFrame() {
      if (!document.body.contains(container)) {
        setHoveredClass(false);
        setHoverImage(false);
        disableCursor();
        return;
      }

      if (isOverArchiveOverlay) {
        setHoveredClass(false);
        setHoverImage(false);
        disableCursor();
        return;
      }

      const isInside = isCursorInsideElement(container, globalMouseX, globalMouseY);

      if (isInside && !isForceDisabled) {
        const elUnderMouse = document.elementFromPoint(globalMouseX, globalMouseY);
        const isOverlay = elUnderMouse && elUnderMouse.closest('.s-a-archive-overlay, .s-a-archive-close-wrapper, .s-a-menu');

        if (isOverlay) {
          setHoveredClass(false);
          setHoverImage(false);
          disableCursor();
        } else {
          enableCursor();
          updatePosition();
          setHoveredClass(true);
          setHoverImage(true);
        }
      } else {
        setHoveredClass(false);
        setHoverImage(false);
        disableCursor();
      }
    }

    if (!isCaseStudyRow && !isCaseStudiesMoreItem) {
      container.addEventListener('click', function() {
        disableCursor();
        setHoveredClass(false);
        setHoverImage(false);
        isForceDisabled = true;
        setTimeout(() => { isForceDisabled = false; }, 200);
      });
    }

    window.addEventListener('blur', () => {
      setHoveredClass(false);
      setHoverImage(false);
      disableCursor();
    });

    requestAnimationFrame(function loop() {
      checkFrame();
      requestAnimationFrame(loop);
    });
  }

  function initCustomCursors() {
    document.querySelectorAll('.s-a-card').forEach(card => {
      setupCustomCursor(card, '.s-a-card-img-wrapper');
    });

    document.querySelectorAll('.s-a-home-award-item').forEach(awardItem => {
      setupCustomCursor(awardItem, '.s-a-award-image-b');
    });

    document.querySelectorAll('.s-a-home-case-study-row, .s-a-case-study-page-row').forEach(row => {
      setupCustomCursor(row, '.s-a-image-cursor');
    });

    document.querySelectorAll('.s-a-archive-row').forEach(row => {
      setupCustomCursor(row, '.s-a-archive-cursor');
    });

    document.querySelectorAll('.s-a-case-studies-more-item').forEach(item => {
      setupCustomCursor(item, '.s-a-case-study-more-cursor');
    });
  }

  const CONFIG = {
    scrambleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:\',.<>/?`~',
    reveal: { duration: 400, charScrambleDuration: 20, charTotalLifetime: 60 },
    scroll: { duration: 400, cycles: 20, charScrambleDuration: 60 },
    rescramble: { duration: 400, charTotalLifetime: 20 },
  };

  const getRandomChar = () => CONFIG.scrambleChars.charAt(Math.floor(Math.random() * CONFIG.scrambleChars.length));

  function scrambleRevealGsap(el) {
    const originalText = el.getAttribute('data-original-text') || el.textContent;
    el.setAttribute('data-original-text', originalText);
    const chars = originalText.split('');
    el.innerHTML = '';
    el.style.whiteSpace = 'nowrap';
    el.style.visibility = 'visible';

    const spans = chars.map((char) => {
      const span = document.createElement('span');
      span.textContent = '';
      span.style.pointerEvents = 'none';
      el.appendChild(span);
      return span;
    });

    if (el._scrambleTimeline) el._scrambleTimeline.kill();

    const timeline = gsap.timeline({
      onComplete: () => { el.style.whiteSpace = ''; }
    });
    el._scrambleTimeline = timeline;

    const { duration, charScrambleDuration, charTotalLifetime } = CONFIG.reveal;
    const n = spans.length;
    const maxDelay = duration - charTotalLifetime;
    const letterStagger = n > 1 ? maxDelay / (n - 1) : 0;

    spans.forEach((span, i) => {
      const delay = i * letterStagger;
      const scrambleCount = Math.floor(charTotalLifetime / charScrambleDuration);

      for (let j = 0; j < scrambleCount; j++) {
        timeline.add(() => { span.textContent = getRandomChar(); }, (delay + j * charScrambleDuration) / 1000);
      }

      timeline.add(() => { span.textContent = chars[i]; }, (delay + charTotalLifetime) / 1000);
    });

    setTimeout(() => { el.style.whiteSpace = ''; }, duration + 100);
  }

  function scrambleText(el) {
    const original = el.getAttribute('data-original-text') || el.textContent;
    el.setAttribute('data-original-text', original);
    const chars = original.split('');
    el.innerHTML = '';

    chars.forEach((c, i) => {
      const span = document.createElement('span');
      span.style.whiteSpace = 'pre';
      span.style.pointerEvents = 'none';
      span.textContent = i === 0 || c === ' ' ? c : '';
      el.appendChild(span);
    });

    const spans = el.querySelectorAll('span');
    const { duration, cycles } = CONFIG.scroll;
    const interval = duration / (cycles + 1);
    const n = spans.length;

    spans.forEach((span, i) => {
      const c = chars[i];
      if (c === ' ' || i === 0) return;
      const delay = (i / (n - 1)) * (duration / 1000);

      gsap.timeline({ delay })
        .to({}, {
          duration: interval / 1000,
          repeat: cycles,
          onRepeat: () => { span.textContent = getRandomChar(); }
        })
        .call(() => { span.textContent = c; });
    });
  }

  function scrambleTextCs(el) {
    const original = el.getAttribute('data-original-text') || el.textContent;
    el.setAttribute('data-original-text', original);
    const chars = original.split('');
    el.innerHTML = '';

    const spans = chars.map((char) => {
      const span = document.createElement('span');
      span.style.whiteSpace = 'pre';
      span.style.pointerEvents = 'none';
      span.textContent = getRandomChar();
      el.appendChild(span);
      return span;
    });

    const { duration, charTotalLifetime } = CONFIG.rescramble;
    const n = spans.length;
    const firstEnd = duration / 2;
    const stagger = n > 1 ? (duration - firstEnd) / (n - 1) : 0;
    const endTimes = spans.map((_, i) => firstEnd + i * stagger);
    const active = new Array(n).fill(true);
    const startTime = performance.now();

    const interval = setInterval(() => {
      const now = performance.now();
      const elapsed = now - startTime;

      spans.forEach((span, i) => {
        if (!active[i]) return;
        if (elapsed >= endTimes[i]) {
          span.textContent = chars[i];
          active[i] = false;
        } else {
          span.textContent = getRandomChar();
        }
      });

      if (elapsed >= duration + 10) {
        clearInterval(interval);
        spans.forEach((span, i) => { span.textContent = chars[i]; });
      }
    }, charTotalLifetime);

    if (!el._scrambleIntervals) el._scrambleIntervals = [];
    el._scrambleIntervals.push(interval);
  }

  function killScramble(el) {
    if (el._scrambleTimeline) {
      el._scrambleTimeline.kill();
      el._scrambleTimeline = null;
    }
    if (el._scrambleIntervals) {
      el._scrambleIntervals.forEach(clearInterval);
      el._scrambleIntervals = [];
    }
    const original = el.getAttribute('data-original-text');
    if (original) el.textContent = original;
    el.style.whiteSpace = '';
    el.style.visibility = '';
  }

  function registerHoverElement(el, onEnter, onLeave) {
    if (!HAS_HOVER) return;

    let isHovered = false;

    function check() {
      if (isOverArchiveOverlay) {
        if (isHovered) {
          isHovered = false;
          onLeave(el);
        }
        return;
      }

      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        if (isHovered) {
          isHovered = false;
          onLeave(el);
        }
        return;
      }

      const isInside = globalMouseX >= rect.left && globalMouseX <= rect.right && globalMouseY >= rect.top && globalMouseY <= rect.bottom;

      if (isInside && !isHovered) {
        isHovered = true;
        onEnter(el);
      } else if (!isInside && isHovered) {
        isHovered = false;
        onLeave(el);
      }
    }

    requestAnimationFrame(function loop() {
      check();
      requestAnimationFrame(loop);
    });
  }

  function initScrambleAnimations() {
    if (HAS_HOVER) {
      document.querySelectorAll('.s-a-home-case-study-row').forEach(row => {
        registerHoverElement(row,
          (el) => {
            const titles = el.querySelectorAll('.s-a-scramble-title');
            titles.forEach(t => {
              t.style.setProperty('display', 'block', 'important');
              t.style.visibility = 'hidden';
            });
            requestAnimationFrame(() => {
              titles.forEach(target => {
                if (!target.classList.contains('s-a-off')) scrambleRevealGsap(target);
              });
              el.querySelectorAll('.cs-rescramble').forEach(target => {
                if (!target.classList.contains('s-a-off')) scrambleTextCs(target);
              });
            });
          },
          (el) => {
            el.querySelectorAll('.s-a-scramble-title, .cs-rescramble').forEach(killScramble);
            el.querySelectorAll('.s-a-scramble-title').forEach(t => {
              t.style.setProperty('display', 'none', 'important');
            });
          }
        );
      });

      document.querySelectorAll('.s-a-case-study-page-row').forEach(row => {
        registerHoverElement(row,
          (el) => {
            el.querySelectorAll('.cs-rescramble').forEach(target => {
              if (!target.classList.contains('s-a-off')) scrambleTextCs(target);
            });
          },
          (el) => {
            el.querySelectorAll('.cs-rescramble').forEach(killScramble);
          }
        );
      });

      document.querySelectorAll('.s-a-menu-button').forEach(button => {
        const menuTextEl = button.querySelector('.menu-button-text');
        if (!menuTextEl) return;
        registerHoverElement(button,
          () => scrambleTextCs(menuTextEl),
          () => killScramble(menuTextEl)
        );
        menuTextEl.addEventListener('click', () => scrambleTextCs(menuTextEl));
      });

      document.querySelectorAll('.scramble-hover').forEach(parent => {
        registerHoverElement(parent,
          (el) => {
            el.querySelectorAll('.scramble-target, .cs-rescramble').forEach(scrambleTextCs);
          },
          () => {}
        );
      });
    }

    document.querySelectorAll('.scramble-viewport').forEach(el => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(en => {
          if (en.isIntersecting) {
            gsap.delayedCall(0.1, () => scrambleText(el));
          }
        });
      }, { threshold: 0.1 });
      observer.observe(el);
    });
  }

  function initMarquee() {
    const marquees = document.querySelectorAll('[data-css-marquee]');
    const MARQUEE_SPEED_SETTINGS = { desktop: 220, tablet: 200, mobileLandscape: 120, mobile: 80 };
    const MARQUEE_BREAKPOINTS = { mobile: 480, mobileLandscape: 768, tablet: 1024 };

    function getCurrentPixelsPerSecond() {
      const width = window.innerWidth;
      if (width <= MARQUEE_BREAKPOINTS.mobile) return MARQUEE_SPEED_SETTINGS.mobile;
      if (width <= MARQUEE_BREAKPOINTS.mobileLandscape) return MARQUEE_SPEED_SETTINGS.mobileLandscape;
      if (width <= MARQUEE_BREAKPOINTS.tablet) return MARQUEE_SPEED_SETTINGS.tablet;
      return MARQUEE_SPEED_SETTINGS.desktop;
    }

    function calculateAndApplySpeed(listElement, pixelsPerSecond) {
      if (listElement.offsetWidth && listElement.offsetWidth > 0 && pixelsPerSecond > 0) {
        listElement.style.animationDuration = (listElement.offsetWidth / pixelsPerSecond) + 's';
      } else if (listElement.offsetWidth && listElement.offsetWidth > 0) {
        listElement.style.animationDuration = (listElement.offsetWidth / 50) + 's';
      }
    }

    marquees.forEach(marquee => {
      const lists = marquee.querySelectorAll('[data-css-marquee-list]');
      let firstList = null;
      lists.forEach((list, index) => {
        if (index === 0) firstList = list;
        else list.remove();
      });
      if (firstList) {
        const duplicate = firstList.cloneNode(true);
        marquee.appendChild(duplicate);
        firstList.style.animationPlayState = 'paused';
        duplicate.style.animationPlayState = 'paused';
      }
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const listsToAnimate = entry.target.querySelectorAll('[data-css-marquee-list]');
        const currentPixelsPerSecond = getCurrentPixelsPerSecond();
        if (entry.isIntersecting) {
          listsToAnimate.forEach(list => {
            calculateAndApplySpeed(list, currentPixelsPerSecond);
            list.style.animationPlayState = 'running';
          });
        } else {
          listsToAnimate.forEach(list => { list.style.animationPlayState = 'paused'; });
        }
      });
    }, { threshold: 0.01 });

    marquees.forEach(marquee => observer.observe(marquee));

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentPixelsPerSecond = getCurrentPixelsPerSecond();
        marquees.forEach(marquee => {
          marquee.querySelectorAll('[data-css-marquee-list]').forEach(list => {
            calculateAndApplySpeed(list, currentPixelsPerSecond);
          });
        });
      }, 250);
    });
  }

  function initMobileMenu() {
    const mobileMenu = document.querySelector('.s-a-mobile-menu');
    const openBtn = document.querySelector('.s-a-mobile-menu-open-wrapper');
    const closeBtn = document.querySelector('.s-a-mobile-menu-close-wrapper');

    if (!mobileMenu || !openBtn || !closeBtn) return;

    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  function initMenuHover() {
    document.querySelectorAll('.s-a-menu-button').forEach(button => {
      button.addEventListener('mouseenter', () => button.classList.add('hovered'));
      button.addEventListener('mouseleave', () => button.classList.remove('hovered'));
      button.addEventListener('click', () => {
        document.querySelectorAll('.s-a-menu-button.clicked').forEach(btn => btn.classList.remove('clicked'));
        button.classList.add('clicked');
      });
    });

    const activeButton = document.getElementById('s-a-menu-home');
    if (activeButton) {
      const activeDot = activeButton.querySelector('.s-a-menu-dot');
      if (activeDot) activeDot.classList.add('active');
    }
  }

  function initSocialHover() {
    const root = document.documentElement;
    const original = getComputedStyle(root).getPropertyValue('--s-a-menu-back-height-px').trim();
    document.querySelectorAll('.s-a-menu-button-social-wrapper').forEach(wrapper => {
      wrapper.addEventListener('mouseenter', () => root.style.setProperty('--s-a-menu-back-height-px', '119px'));
      wrapper.addEventListener('mouseleave', () => root.style.setProperty('--s-a-menu-back-height-px', original));
    });
  }

  function initArchiveViewed() {
    document.querySelectorAll('.s-a-archive-row').forEach(row => {
      row.addEventListener('click', () => {
        const viewedDiv = row.querySelector('.s-a-archive-viewed');
        if (viewedDiv) viewedDiv.style.display = 'block';
      });
    });
  }

  function initArchiveOverlay() {
    document.querySelectorAll('.s-a-archive-row').forEach(row => {
      row.addEventListener('click', () => {
        const overlay = row.querySelector('.s-a-archive-overlay');
        if (overlay) overlay.style.display = 'block';
      });
    });
    document.querySelectorAll('.s-a-archive-close-wrapper').forEach(closeBtn => {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const overlay = closeBtn.closest('.s-a-archive-overlay');
        if (overlay) overlay.style.display = 'none';
      });
    });
  }

  function initArchiveAccordion() {
    function initMobileAccordion() {
      const isDesktop = window.innerWidth >= 992;
      document.querySelectorAll('.s-a-archive-row-tablet').forEach(row => {
        if (isDesktop) {
          row.setAttribute('data-accordion-status', 'not-active');
        } else {
          if (!row.hasAttribute('data-accordion-status')) {
            row.setAttribute('data-accordion-status', 'not-active');
          }
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (window.innerWidth >= 992) return;
      const closeBtn = e.target.closest('.archive-close-image, .s-a-archive-close-wrapper');
      if (closeBtn) {
        const row = closeBtn.closest('.s-a-archive-row-tablet');
        if (row) row.setAttribute('data-accordion-status', 'not-active');
        return;
      }
      const row = e.target.closest('.s-a-archive-row-tablet');
      if (row && !e.target.closest('.s-a-archive-content-wrapper')) {
        const isActive = row.getAttribute('data-accordion-status') === 'active';
        document.querySelectorAll('.s-a-archive-row-tablet[data-accordion-status="active"]').forEach(openRow => {
          if (openRow !== row) openRow.setAttribute('data-accordion-status', 'not-active');
        });
        row.setAttribute('data-accordion-status', isActive ? 'not-active' : 'active');
      }
    });

    initMobileAccordion();
    window.addEventListener('resize', initMobileAccordion);
  }

  function initVideoPlayer() {
    const videoWrapper = document.querySelector('[data-video="wrapper"]');
    const videoOverlay = document.querySelector('[data-video="overlay"]');
    const videoPlayer = document.querySelector('[data-video="player"]');
    const volumeSlider = document.querySelector('[data-volume="slider"]');
    const volumeTrack = document.querySelector('[data-volume="track"]');
    const fullscreenButton = document.querySelector('.fullscreen-button');
    const volumeContainer = document.querySelector('.volume-slider-container');
    const cursorContainer = document.querySelector('[data-video="cursor-container"]');

    if (!videoPlayer) return;

    const isMutedMode = videoOverlay?.hasAttribute('data-muted') || videoPlayer?.hasAttribute('data-muted');

    function updateVolumeTrack() {
      if (volumeSlider && volumeTrack) {
        if (volumeSlider.offsetWidth > 0) {
          const percent = parseFloat(volumeSlider.value);
          const thumbWidth = 13;
          const trackPadding = 6.5;
          const availableWidth = volumeSlider.offsetWidth - thumbWidth;
          const trackWidth = (percent * availableWidth) + trackPadding;
          volumeTrack.style.width = `${Math.max(trackPadding, Math.min(trackWidth, volumeSlider.offsetWidth))}px`;
        } else {
          volumeTrack.style.width = `${parseFloat(volumeSlider.value) * 100}%`;
        }
      }
    }

    function enforceMutedVolume() {
      if (!videoPlayer) return;
      videoPlayer.volume = 0;
      videoPlayer.muted = true;
      if (volumeSlider) volumeSlider.value = 0;
      updateVolumeTrack();
    }

    if (fullscreenButton) fullscreenButton.style.display = 'none';
    if (cursorContainer) { cursorContainer.style.display = 'none'; cursorContainer.style.transform = 'none'; }

    videoPlayer.muted = true;
    if (isMutedMode) {
      enforceMutedVolume();
      videoPlayer.addEventListener('volumechange', enforceMutedVolume);
    }

    videoPlayer.play().catch(() => { console.log('Initial autoplay failed'); });

    let hasInteracted = false;
    let isMouseOverVideo = false;
    let isFullscreen = false;
    let lastMouseX = 0, lastMouseY = 0;

    if (videoWrapper) videoWrapper.style.cursor = 'none';
    if (videoOverlay) videoOverlay.style.cursor = 'none';

    function restartVideo() { if (videoPlayer) { videoPlayer.currentTime = 0; videoPlayer.play().catch(() => {}); } }

    function updateFullscreenButtonVisibility() {
      if (!fullscreenButton) return;
      if (isFullscreen) fullscreenButton.style.display = 'none';
      else if (hasInteracted) fullscreenButton.style.display = 'block';
    }

    function showFullscreenButton() {
      if (hasInteracted && fullscreenButton && !isFullscreen) fullscreenButton.style.display = 'block';
    }

    function updateCursor() {
      if (!cursorContainer) return;
      if (isMouseOverVideo || isFullscreen) cursorContainer.style.display = 'block';
      else cursorContainer.style.display = 'none';
    }

    function toggleFullscreen() {
      if (!videoWrapper) return;
      if (!isFullscreen) {
        (videoWrapper.requestFullscreen || videoWrapper.webkitRequestFullscreen || videoWrapper.msRequestFullscreen)?.call(videoWrapper);
      } else {
        (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
      }
    }

    function handleFirstInteraction() {
      if (!hasInteracted) {
        hasInteracted = true;
        showFullscreenButton();
      }
    }

    function handleFullscreenChange() {
      isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
      if (fullscreenButton) fullscreenButton.textContent = isFullscreen ? '[  CLOSE  ]' : '[  FULLSCREEN  ]';
      updateFullscreenButtonVisibility();
      updateCursor();
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    if (videoPlayer) {
      videoPlayer.addEventListener('ended', restartVideo);
      videoPlayer.addEventListener('play', updateCursor);
      videoPlayer.addEventListener('pause', updateCursor);
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', (e) => { e.stopPropagation(); toggleFullscreen(); });
    }

    if (videoOverlay) {
      const moveHandler = (e) => {
        isMouseOverVideo = true;
        if (!videoWrapper) return;
        const rect = videoWrapper.getBoundingClientRect();
        lastMouseX = e.clientX; lastMouseY = e.clientY;
        if (cursorContainer) {
          cursorContainer.style.left = (e.clientX - rect.left) + 'px';
          cursorContainer.style.top = (e.clientY - rect.top) + 'px';
          cursorContainer.style.display = 'block';
          updateCursor();
        }
      };
      videoOverlay.addEventListener('mousemove', moveHandler);
      videoOverlay.addEventListener('mouseenter', moveHandler);
      videoOverlay.addEventListener('mouseleave', () => { isMouseOverVideo = false; if (cursorContainer && !isFullscreen) cursorContainer.style.display = 'none'; });

      videoOverlay.addEventListener('click', () => {
        if (!videoPlayer) return;
        if (isFullscreen) { toggleFullscreen(); return; }
        if (isMutedMode) { handleFirstInteraction(); videoPlayer.paused ? videoPlayer.play().catch(() => {}) : videoPlayer.pause(); enforceMutedVolume(); updateCursor(); return; }
        if (!hasInteracted) { handleFirstInteraction(); const initialVolume = 0.5; videoPlayer.volume = initialVolume; if (volumeSlider) volumeSlider.value = initialVolume; updateVolumeTrack(); videoPlayer.muted = false; restartVideo(); }
        else { videoPlayer.paused ? videoPlayer.play().catch(() => {}) : videoPlayer.pause(); }
      });
    }

    window.addEventListener('scroll', () => {
      if (isMouseOverVideo && cursorContainer && videoWrapper) {
        const rect = videoWrapper.getBoundingClientRect();
        cursorContainer.style.left = (lastMouseX - rect.left) + 'px';
        cursorContainer.style.top = (lastMouseY - rect.top) + 'px';
      }
    });

    if (volumeContainer && volumeSlider && videoPlayer) {
      const setVolumeFromEvent = (e) => {
        if (isMutedMode) { enforceMutedVolume(); return; }
        const rect = volumeContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.min(Math.max(x / rect.width, 0), 1);
        volumeSlider.value = percent;
        volumeSlider.dispatchEvent(new Event('input', { bubbles: true }));
      };
      volumeContainer.addEventListener('mousedown', (e) => {
        if (isMutedMode) { e.preventDefault(); enforceMutedVolume(); return; }
        if (e.target === volumeSlider) return;
        e.preventDefault(); setVolumeFromEvent(e);
        const move = ev => setVolumeFromEvent(ev);
        const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
        window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
      });
    }

    if (volumeSlider && videoPlayer) {
      volumeSlider.addEventListener('input', () => {
        if (isMutedMode) { enforceMutedVolume(); return; }
        const volume = parseFloat(volumeSlider.value);
        videoPlayer.volume = volume;
        updateVolumeTrack();
        if (!hasInteracted && volume > 0) { handleFirstInteraction(); videoPlayer.muted = false; if (videoPlayer.paused) videoPlayer.play().catch(() => {}); }
        else if (volume > 0) { videoPlayer.muted = false; }
      });
    }

    function handleResizeOrOrientationChange() { updateVolumeTrack(); handleFullscreenChange(); updateCursor(); }
    window.addEventListener('resize', handleResizeOrOrientationChange);
    window.addEventListener('orientationchange', handleResizeOrOrientationChange);

    handleFullscreenChange(); updateVolumeTrack(); updateCursor(); if (isMutedMode) enforceMutedVolume();
  }

  function initLenIs() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({ smooth: true, lerp: 0.12, wheelMultiplier: 1.2, infinite: false, easing: t => (--t) * t * t + 1 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    window.lenis = lenis;
  }

  function initGSAP() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
    }
  }

  function initTestimonialSlider() {
    const testimonials = Array.from(document.querySelectorAll('.s-a-b-testimonial-container .s-a-tstmnl'));
    let currentIndex = 0;
    if (!testimonials.length) return;
    testimonials.forEach((el, i) => el.style.setProperty('display', i === 0 ? 'flex' : 'none', 'important'));
    function updateVisibility() { testimonials.forEach((el, i) => el.style.setProperty('display', i === currentIndex ? 'flex' : 'none', 'important')); }
    document.addEventListener('click', (e) => {
      if (e.target.closest('.s-a-slider-button-right')) { currentIndex = (currentIndex + 1) % testimonials.length; updateVisibility(); }
      else if (e.target.closest('.s-a-slider-button-left')) { currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length; updateVisibility(); }
    });
  }

  function initTimeComponent() {
    const elements = document.querySelectorAll('[data-time]');
    let showColon = true;
    function updateTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const sep = showColon ? ':' : ' ';
      const timeStr = `${hours}${sep}${minutes}`;
      elements.forEach(el => { el.innerText = timeStr; });
      showColon = !showColon;
    }
    updateTime();
    setInterval(updateTime, 1000);
  }

  function initFormHoneypot() {
    const submit = document.querySelector('#submit');
    const honeypot = document.querySelector('#work-email');
    if (submit && honeypot) {
      honeypot.oninput = function() { submit.disabled = honeypot.value.length > 0; };
    }
  }

  function initSwiperShelf() {
    if (typeof Swiper === 'undefined') return;
    const shelfSliderWrap = document.getElementById('shelf-slider-wrap');
    if (!shelfSliderWrap) return;
    const bookCards = shelfSliderWrap.querySelectorAll('.div-block-28');
    if (!bookCards.length) return;
    const swiperContainer = document.createElement('div');
    swiperContainer.className = 'swiper book-shelf-swiper';
    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';
    bookCards.forEach(card => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.appendChild(card.cloneNode(true));
      swiperWrapper.appendChild(slide);
    });
    swiperContainer.appendChild(swiperWrapper);
    shelfSliderWrap.innerHTML = '';
    shelfSliderWrap.appendChild(swiperContainer);
    const nextButton = document.querySelector('#shelf-slider-right');
    const prevButton = document.querySelector('#shelf-slider-left');
    const computedStyle = getComputedStyle(document.documentElement);
    const gapValue = computedStyle.getPropertyValue('--s-a-gap-default') || '20px';
    const spaceBetween = gapValue.endsWith('px') ? parseInt(gapValue) : gapValue;
    try {
      new Swiper('.book-shelf-swiper', {
        slidesPerView: 'auto', spaceBetween, grabCursor: true, watchOverflow: false,
        preventClicks: true, preventClicksPropagation: true,
        navigation: { nextEl: '#shelf-slider-right', prevEl: '#shelf-slider-left', disabledClass: 'disabled', lockClass: 'disabled', hiddenClass: 'disabled' },
        breakpoints: { 1400: { slidesPerView: 6, slidesPerGroup: 1 }, 992: { slidesPerView: 4, slidesPerGroup: 1 }, 768: { slidesPerView: 2.5, slidesPerGroup: 1 }, 320: { slidesPerView: 1.5, slidesPerGroup: 1 } },
        on: {
          init: function() { if (this.isBeginning && prevButton) prevButton.classList.add('disabled'); if (this.isEnd && nextButton) nextButton.classList.add('disabled'); },
          slideChange: function() {
            if (prevButton) { if (this.isBeginning) prevButton.classList.add('disabled'); else prevButton.classList.remove('disabled'); }
            if (nextButton) { if (this.isEnd) nextButton.classList.add('disabled'); else nextButton.classList.remove('disabled'); }
          }
        }
      });
    } catch (error) { console.warn('Swiper init error:', error); }
  }

  function initArchiveSliders() {
    if (typeof Swiper === 'undefined') return;
    setTimeout(() => {
      const computedStyle = getComputedStyle(document.documentElement);
      const gapValue = computedStyle.getPropertyValue('--s-a-gap-default') || '20px';
      const spaceBetween = gapValue.endsWith('px') ? parseInt(gapValue) : gapValue;
      const sliderWraps = document.querySelectorAll('[data-slider="wrap"]');
      sliderWraps.forEach((sliderWrap, index) => {
        const sliderContainer = sliderWrap.querySelector('.s-a-archive-slider');
        if (!sliderContainer) return;
        const navWrapper = sliderWrap.querySelector('.s-a-archive-slider-nav');
        if (!navWrapper) return;
        const prevButton = navWrapper.querySelector('.s-a-slider-button-left-bottom-line');
        const nextButton = navWrapper.querySelector('.s-a-slider-button-right-bottom-line');
        const uniqueClass = `archive-swiper-${index}`;
        const swiperContainer = document.createElement('div');
        swiperContainer.className = `swiper ${uniqueClass}`;
        const swiperWrapper = document.createElement('div');
        swiperWrapper.className = 'swiper-wrapper';
        const sliderItems = Array.from(sliderContainer.children);
        sliderItems.forEach(item => {
          const slide = document.createElement('div');
          slide.className = 'swiper-slide';
          const isVideo = item.tagName.toLowerCase() === 'video' || item.tagName.toLowerCase() === 'iframe' || item.classList.contains('video-embed') || item.querySelector('iframe, video');
          if (isVideo) slide.classList.add('video-slide');
          slide.appendChild(item.cloneNode(true));
          swiperWrapper.appendChild(slide);
        });
        if (sliderItems.length === 0) {
          const images = sliderContainer.querySelectorAll('img');
          const videoEmbeds = sliderContainer.querySelectorAll('.video-embed');
          images.forEach(img => { const slide = document.createElement('div'); slide.className = 'swiper-slide'; slide.appendChild(img.cloneNode(true)); swiperWrapper.appendChild(slide); });
          videoEmbeds.forEach(embed => { const slide = document.createElement('div'); slide.className = 'swiper-slide video-slide'; slide.appendChild(embed.cloneNode(true)); swiperWrapper.appendChild(slide); });
        }
        swiperContainer.appendChild(swiperWrapper);
        sliderContainer.innerHTML = '';
        sliderContainer.appendChild(swiperContainer);
        const isThreeItems = sliderWrap.classList.contains('is-3-items');
        try {
          new Swiper(`.${uniqueClass}`, {
            slidesPerView: 'auto', spaceBetween, grabCursor: true, watchOverflow: false,
            preventClicks: true, preventClicksPropagation: true,
            navigation: { nextEl: nextButton, prevEl: prevButton, disabledClass: 'disabled', lockClass: 'disabled', hiddenClass: 'disabled' },
            breakpoints: { 992: { slidesPerView: isThreeItems ? 3 : 4, slidesPerGroup: 1 }, 768: { slidesPerView: 2.5, slidesPerGroup: 1 }, 320: { slidesPerView: 1.5, slidesPerGroup: 1 } },
            on: {
              init: function() { if (this.isBeginning && prevButton) prevButton.classList.add('disabled'); if (this.isEnd && nextButton) nextButton.classList.add('disabled'); },
              slideChange: function() {
                if (prevButton) { if (this.isBeginning) prevButton.classList.add('disabled'); else prevButton.classList.remove('disabled'); }
                if (nextButton) { if (this.isEnd) nextButton.classList.add('disabled'); else nextButton.classList.remove('disabled'); }
              }
            }
          });
        } catch (error) { console.error('Swiper initialization error:', error); }
      });
    }, 1000);
  }

  function initImageSliders() {
    if (typeof Swiper === 'undefined') return;
    if (window.innerWidth >= 992) return;
    const computedStyle = getComputedStyle(document.documentElement);
    const gapValue = computedStyle.getPropertyValue('--s-a-gap-default') || '20px';
    const spaceBetween = gapValue.endsWith('px') ? parseInt(gapValue) : gapValue;
    const sliderWraps = document.querySelectorAll('[data-slider-image="wrapper"]');
    sliderWraps.forEach((sliderWrap, index) => {
      const images = Array.from(sliderWrap.querySelectorAll('[data-slider-image]'));
      if (!images.length) return;
      const uniqueClass = `image-grid-swiper-${index}`;
      const swiperContainer = document.createElement('div');
      swiperContainer.className = `swiper ${uniqueClass}`;
      const swiperWrapper = document.createElement('div');
      swiperWrapper.className = 'swiper-wrapper';
      images.forEach(img => { const slide = document.createElement('div'); slide.className = 'swiper-slide'; slide.appendChild(img.cloneNode(true)); swiperWrapper.appendChild(slide); });
      swiperContainer.appendChild(swiperWrapper);
      sliderWrap.innerHTML = '';
      sliderWrap.appendChild(swiperContainer);
      try {
        new Swiper(`.${uniqueClass}`, { slidesPerView: 'auto', spaceBetween, grabCursor: true, watchOverflow: true, preventClicks: true, preventClicksPropagation: true, navigation: false, breakpoints: { 768: { slidesPerView: 3.5, slidesPerGroup: 1 }, 480: { slidesPerView: 2.5, slidesPerGroup: 1 }, 320: { slidesPerView: 1.5, slidesPerGroup: 1 } } });
      } catch (error) { console.warn('Image slider init error:', error); }
    });
  }

  function initCustomBreakpoints() {
    function adjustIntroPosition() {
      const introA = document.getElementById('s-a-26-intro-a');
      const introB = document.getElementById('s-a-26-intro-b');
      const slider = document.getElementById('s-a-b-testimonial-container');
      const shelf = document.getElementById('slider-shelf');
      const shelfbtnleft = document.getElementById('26testimonial-btn-left');
      const shelfbtnright = document.getElementById('26testimonial-btn-right');
      const footer = document.getElementById('footer-height');
      const services = document.getElementById('s-a-26-awards-info');
      const strobo = document.getElementById('s-a-26-about-strobo');
      const titles = document.querySelectorAll('.s-a-case-study-page-title');
      const largeTitles = document.querySelectorAll('.s-a-home-case-study-large-title');
      const homeCaseRows = document.querySelectorAll('.s-a-home-case-study-row');
      const CasePageRows = document.querySelectorAll('.s-a-case-study-page-title-row');
      const CaseStudyHeader = document.querySelectorAll('.s-a-case-study-header');
      const root = document.documentElement;
      const w = window.innerWidth;

      if (w >= 992 && w < 1550) {
        if (introA) { introA.style.setProperty('grid-column', '2 / 6', 'important'); introA.style.setProperty('grid-row', '1 / 2', 'important'); }
        if (introB) { introB.style.setProperty('grid-column', '7 / 11', 'important'); introB.style.setProperty('grid-row', '2 / 3', 'important'); }
        if (slider) slider.style.setProperty('grid-column', '3 / 11', 'important');
        if (shelf) shelf.style.setProperty('grid-column', '1 / 7', 'important');
        if (shelfbtnleft) shelfbtnleft.style.setProperty('grid-column', '3 / 7', 'important');
        if (shelfbtnright) shelfbtnright.style.setProperty('grid-column', '7 / 11', 'important');
        if (footer) footer.style.setProperty('height', '230px', 'important');
        if (services) services.style.setProperty('grid-column', '7 / 11', 'important');
        if (strobo) strobo.style.setProperty('grid-column', '3 / 12', 'important');
        titles.forEach(el => el.style.setProperty('font-size', '45px', 'important'));
        largeTitles.forEach(el => el.style.setProperty('font-size', '100px', 'important'));
        CasePageRows.forEach(el => el.style.setProperty('font-size', '50px', 'important'));
        CaseStudyHeader.forEach(el => el.style.setProperty('font-size', '10vh', 'important'));
        homeCaseRows.forEach(el => { el.style.setProperty('height', '300px', 'important'); el.style.setProperty('min-height', '300px', 'important'); });
        root.style.setProperty('--s-a-default-text', '17px', 'important');
        root.style.setProperty('--s-a-gap-default', '20px', 'important');
      } else {
        [introA, introB, slider, shelf, shelfbtnleft, shelfbtnright, footer, services, strobo].forEach(el => { if (el) { el.style.removeProperty('grid-column'); el.style.removeProperty('grid-row'); el.style.removeProperty('height'); } });
        [titles, largeTitles, CasePageRows, CaseStudyHeader, homeCaseRows].forEach(arr => arr.forEach(el => { el.style.removeProperty('font-size'); el.style.removeProperty('height'); el.style.removeProperty('min-height'); }));
        root.style.removeProperty('--s-a-default-text');
        root.style.removeProperty('--s-a-gap-default');
      }
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', adjustIntroPosition);
    else adjustIntroPosition();
    window.addEventListener('resize', adjustIntroPosition);

    function adjustMonoFontVar() {
      const w = window.innerWidth;
      const largerEls = document.querySelectorAll('.larger');
      const subheaders = document.querySelectorAll('.s-a-home-subheader');
      if (w >= 992 && w < 1550) {
        document.documentElement.style.setProperty('--s-a-mono-font-default', '12px', 'important');
        largerEls.forEach(el => el.style.setProperty('font-size', '15px', 'important'));
      } else {
        document.documentElement.style.removeProperty('--s-a-mono-font-default');
        largerEls.forEach(el => el.style.removeProperty('font-size'));
      }
      if (w >= 992 && w <= 1330) subheaders.forEach(el => el.style.setProperty('font-size', '13px', 'important'));
      else if (w < 600) subheaders.forEach(el => el.style.setProperty('font-size', '11px', 'important'));
      else subheaders.forEach(el => el.style.removeProperty('font-size'));
    }
    adjustMonoFontVar();
    window.addEventListener('resize', adjustMonoFontVar);
  }

  function initReplaceTabletSliders() {
    function replaceTabletWithDesktop() {
      for (let i = 1; i <= 10; i++) {
        const tabletElement = document.querySelector(`[data-slider-tablet="${i}"]`);
        if (!tabletElement) continue;
        const desktopElement = document.querySelector(`[data-slider-desktop="${i}"]`);
        if (!desktopElement) continue;
        tabletElement.innerHTML = desktopElement.innerHTML;
      }
      const emptyTabletElement = document.querySelector('[data-slider-tablet=""]');
      if (emptyTabletElement) {
        const emptyDesktopElement = document.querySelector('[data-slider-desktop=""]');
        if (emptyDesktopElement) emptyTabletElement.innerHTML = emptyDesktopElement.innerHTML;
      }
    }
    replaceTabletWithDesktop();
    window.addEventListener('resize', replaceTabletWithDesktop);
  }

  function initVimeoPlayers() {
    if (!window.Vimeo) {
      const tag = document.createElement('script');
      tag.src = 'https://player.vimeo.com/api/player.js';
      tag.onload = initializeVimeoPlayers;
      document.body.appendChild(tag);
    } else {
      initializeVimeoPlayers();
    }
    function initializeVimeoPlayers() {
      const vimeoIframes = document.querySelectorAll('iframe[src*="vimeo.com"]');
      vimeoIframes.forEach(iframe => {
        if (iframe.hasAttribute('data-vimeo-initialized')) return;
        iframe.setAttribute('data-vimeo-initialized', 'true');
        let src = iframe.getAttribute('src');
        if (src) {
          src = src.replace(/([?&])(autoplay|muted|loop|background|controls)=\d/g, '');
          const connector = src.includes('?') ? '&' : '?';
          src += `${connector}autoplay=1&muted=1&background=1&controls=0`;
          iframe.setAttribute('src', src);
          iframe.addEventListener('load', () => {
            try {
              if (window.Vimeo && window.Vimeo.Player) {
                const player = new Vimeo.Player(iframe);
                player.setVolume(0).then(() => player.setLoop(true)).then(() => player.play()).catch(e => console.warn('Vimeo setup error:', e));
                player.on('ended', () => player.play().catch(e => console.warn('Replay error:', e)));
              }
            } catch (e) { console.error('Error initializing Vimeo player:', e); }
          });
        }
      });
    }
  }

  function initIframeLoader() {
    document.addEventListener('DOMContentLoaded', () => {
      const TRIGGER_SELECTOR = '.s-a-archive-row';
      const IFRAME_SELECTOR = '.s-a-lazy-video';
      const CLOSE_SELECTOR = '.s-a-archive-close-wrapper';
      const triggers = document.querySelectorAll(TRIGGER_SELECTOR);
      triggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
          const parentItem = trigger.closest('.w-dyn-item') || trigger.parentNode;
          if (!parentItem) return;
          const iframes = parentItem.querySelectorAll(IFRAME_SELECTOR);
          iframes.forEach(iframe => { if (iframe.dataset.src && iframe.src !== iframe.dataset.src) iframe.src = iframe.dataset.src; });
        });
      });
      document.body.addEventListener('click', (e) => {
        const closeBtn = e.target.closest(CLOSE_SELECTOR);
        if (!closeBtn) return;
        const parentItem = closeBtn.closest('.w-dyn-item') || closeBtn.closest('.s-a-archive-overlay').parentNode;
        if (parentItem) {
          const iframes = parentItem.querySelectorAll(IFRAME_SELECTOR);
          iframes.forEach(iframe => { iframe.src = 'about:blank'; });
        }
      });
    });
  }

  function initIframeSmoothScrollFix() {
    const lenis = window.lenis || window.LenisInstance || window.lenisInstance || null;
    const INTERACTIVE_CLASS = 'lenis-iframe-interactive';
    const overlays = new WeakMap();

    function forwardScroll(deltaY) {
      if (lenis && typeof lenis.scrollTo === 'function') {
        const current = (lenis.actualScroll != null) ? lenis.actualScroll : window.scrollY;
        lenis.scrollTo(current + deltaY, { immediate: false, lock: false });
      } else { window.scrollBy({ top: deltaY, behavior: 'auto' }); }
    }

    function makeOverlay(iframe) {
      const wrap = iframe.parentElement;
      if (!wrap) return;
      const cs = getComputedStyle(wrap);
      if (cs.position === 'static') wrap.style.position = 'relative';
      const ov = document.createElement('div');
      ov.className = 'lenis-iframe-overlay';
      ov.setAttribute('aria-hidden', 'true');
      ov.addEventListener('wheel', (e) => { e.preventDefault(); forwardScroll(e.deltaY); }, { passive: false });
      let lastY = null;
      ov.addEventListener('touchstart', (e) => { lastY = e.touches[0].clientY; }, { passive: true });
      ov.addEventListener('touchmove', (e) => { if (lastY == null) return; const y = e.touches[0].clientY; const dy = lastY - y; lastY = y; e.preventDefault(); forwardScroll(dy); }, { passive: false });
      ov.addEventListener('click', () => {
        ov.classList.add('is-hidden');
        iframe.classList.add(INTERACTIVE_CLASS);
        if (lenis && typeof lenis.stop === 'function') lenis.stop();
        clearTimeout(iframe.__lenisIframeTimer);
        iframe.__lenisIframeTimer = setTimeout(() => {
          iframe.classList.remove(INTERACTIVE_CLASS);
          ov.classList.remove('is-hidden');
          if (lenis && typeof lenis.start === 'function') lenis.start();
        }, 6000);
      });
      wrap.appendChild(ov);
      overlays.set(iframe, ov);
    }

    function init() { document.querySelectorAll('iframe').forEach(ifr => { if (!overlays.has(ifr)) makeOverlay(ifr); }); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
    const mo = new MutationObserver(init);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.utils.toArray('[data-gsap]').forEach(el => {
      const animation = el.dataset.gsap;
      const trigger = el.dataset.gsapTrigger || el;
      const start = el.dataset.gsapStart || 'top 80%';
      const end = el.dataset.gsapEnd || 'bottom 20%';
      const scrub = el.dataset.gsapScrub !== undefined ? parseFloat(el.dataset.gsapScrub) : false;
      gsap.fromTo(el, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0,
        scrollTrigger: { trigger, start, end, scrub, toggleActions: 'play none none reverse' }
      });
    });
  }

  function initHoverAnimations() {
    document.querySelectorAll('.s-a-link-button, .s-a-arrow-new-page-wrapper, .s-a-slider-button-left, .s-a-slider-button-right, .s-a-slider-button-left-bottom-line, .s-a-slider-button-right-bottom-line, .s-a-submit-button, .s-a-social-link, .s-a-footer-link').forEach(el => {
      el.addEventListener('mouseenter', () => el.style.opacity = '0.6');
      el.addEventListener('mouseleave', () => el.style.opacity = '');
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initGSAP();
    initLenIs();
    initCustomCursors();
    initScrambleAnimations();
    initMarquee();
    initMobileMenu();
    initMenuHover();
    initSocialHover();
    initArchiveViewed();
    initArchiveOverlay();
    initArchiveAccordion();
    initVideoPlayer();
    initTestimonialSlider();
    initTimeComponent();
    initFormHoneypot();
    initSwiperShelf();
    initArchiveSliders();
    initImageSliders();
    initCustomBreakpoints();
    initReplaceTabletSliders();
    initVimeoPlayers();
    initIframeLoader();
    initIframeSmoothScrollFix();
    initScrollAnimations();
    initHoverAnimations();
  });
})();