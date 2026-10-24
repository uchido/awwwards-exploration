/* Fullscreen menu — slide down/up, hover image swap, nav-dot, scroll-lock */
(function () {
  const menu = document.getElementById('menu');
  const hamburger = document.querySelector('.hamburger');
  const shadow = document.querySelector('.menu-shadow');
  const links = document.querySelectorAll('.menu-overlay__link');
  const images = document.querySelectorAll('.menu-image');
  if (!menu || !hamburger) return;

  let open = false;
  let animating = false;

  function lockScroll(lock) {
    if (lock) {
      const sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbarWidth', sbw + 'px');
      document.body.classList.add('is-locked');
    } else {
      document.body.classList.remove('is-locked');
    }
  }

  function setOpen(next) {
    if (animating || open === next) return;
    animating = true;
    open = next;
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
    lockScroll(open);

    if (window.gsap) {
      if (open) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.timeline({ onComplete: () => { animating = false; } })
          .to(shadow, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 0)
          .fromTo(menu,
            { y: '-105%' },
            { y: '0%', duration: 1, ease: 'expo.out' }, 0)
          .fromTo(links,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out' }, 0.25);
      } else {
        gsap.timeline({ onComplete: () => { animating = false; gsap.set(menu, { visibility: 'hidden' }); } })
          .to(links, { y: 40, opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power2.in' }, 0)
          .to(menu, { y: '-105%', duration: 0.8, ease: 'expo.inOut' }, 0.1)
          .to(shadow, { opacity: 0, duration: 0.5 }, 0.3);
      }
    } else {
      menu.style.transform = open ? 'translate3d(0,0,0)' : 'translate3d(0,-105%,0)';
      menu.style.visibility = open ? 'visible' : 'hidden';
      shadow.style.opacity = open ? '1' : '0';
      animating = false;
    }
  }

  hamburger.addEventListener('click', () => setOpen(!open));

  // Hover big links → swap right-hand image
  links.forEach((link, i) => {
    link.addEventListener('mouseenter', () => {
      images.forEach((img, j) => img.classList.toggle('is-active', j === i));
    });
  });
  menu.querySelector('.menu-overlay__left')?.addEventListener('mouseleave', () => {
    images.forEach((img, j) => img.classList.toggle('is-active', j === 0));
  });

  // Close when navigating
  links.forEach((link) => {
    link.addEventListener('click', () => {
      if (open) setOpen(false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setOpen(false);
  });

  // Nav dot follows hover (header + footer nav)
  document.querySelectorAll('.header-nav').forEach((nav) => {
    const dot = nav.querySelector('.header-nav__dot');
    if (!dot) return;
    nav.querySelectorAll('.header-nav__link').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const top = item.offsetTop + item.offsetHeight / 2 - dot.offsetHeight / 2;
        dot.style.transform = `translateY(${top}px)`;
        dot.style.opacity = '1';
      });
    });
    nav.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
    });
  });
})();
