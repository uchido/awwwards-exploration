/* Full-viewport drag slider (approximates the original keen-slider carousel) */
(function () {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;
  const track = gallery.querySelector('.gallery__track');
  const slides = gallery.querySelectorAll('.gallery__slide');
  const count = slides.length;
  let index = 0;
  let offset = 0;          // live drag offset in px
  let startX = 0;
  let dragging = false;
  let moved = 0;
  let lastX = 0;
  let velocity = 0;

  function width() {
    return gallery.clientWidth;
  }

  function setTransform(animate) {
    if (window.gsap) {
      gsap.to(track, {
        x: -index * width() + offset,
        duration: animate ? 0.9 : 0,
        ease: 'expo.out',
        overwrite: true,
      });
    } else {
      track.style.transform = `translate3d(${-index * width() + offset}px,0,0)`;
    }
  }

  function goTo(i) {
    index = Math.max(0, Math.min(count - 1, i));
    offset = 0;
    setTransform(true);
  }

  gallery.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = 0;
    startX = lastX = e.clientX;
    velocity = 0;
    track.style.transition = 'none';
    gallery.setPointerCapture(e.pointerId);
  });

  gallery.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    moved = Math.abs(dx);
    velocity = e.clientX - lastX;
    lastX = e.clientX;
    // rubber-band at the ends
    let raw = dx;
    if ((index === 0 && dx > 0) || (index === count - 1 && dx < 0)) {
      raw = dx * 0.35;
    }
    offset = raw;
    setTransform(false);
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    const threshold = width() * 0.12;
    let next = index;
    if (offset < -threshold || velocity < -8) next = index + 1;
    else if (offset > threshold || velocity > 8) next = index - 1;
    // plain click (no drag) advances
    if (moved < 6) next = index + 1;
    if (next > count - 1) next = count - 1;
    if (next < 0) next = 0;
    goTo(next);
  }

  gallery.addEventListener('pointerup', endDrag);
  gallery.addEventListener('pointercancel', endDrag);
  gallery.addEventListener('dragstart', (e) => e.preventDefault());

  window.addEventListener('resize', () => setTransform(false));

  // Scroll-triggered entrance: subtle scale of the active image
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      gallery.querySelectorAll('.gallery__slide img'),
      { scale: 1.12 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: gallery,
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      }
    );
  }
})();
