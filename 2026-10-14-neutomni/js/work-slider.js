(function () {
  document.addEventListener('DOMContentLoaded', function () {
    if (typeof gsap === 'undefined') return;

    document.querySelectorAll('.swiper').forEach(function(el) {
      if (el.swiper) el.swiper.destroy(true, true);
    });

    document.querySelectorAll('.swiper-wrapper, .swiper-slide, .slides-stack').forEach(function(el) {
      el.removeAttribute('style');
    });

    var stack = document.querySelector('.slides-stack');
    if (!stack) return;

    var HIDDEN = 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)';
    var FULL   = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

    var slides  = gsap.utils.toArray(stack.querySelectorAll('.swiper-slide'));
    var masks   = gsap.utils.toArray(stack.querySelectorAll('.slider_mask'));
    var images  = gsap.utils.toArray(stack.querySelectorAll('.slide_img'));
    var texts   = gsap.utils.toArray(stack.querySelectorAll('.slide_content_wrap'));
    var countEl = document.querySelector('.pagination_count');
    var prevBtn = document.querySelector('.swiper-button-prev');
    var nextBtn = document.querySelector('.swiper-button-next');

    if (!masks.length || !images.length || !texts.length || !countEl || !prevBtn || !nextBtn) return;

    var current = 0;
    var total = masks.length;
    var animating = false;
    var pad = function(n) { return String(n).padStart(2, '0'); };

    gsap.set(masks,  { clipPath: HIDDEN });
    gsap.set(images, { scale: 1 });
    gsap.set(texts,  { opacity: 0 });
    gsap.set(slides, { visibility: 'hidden' });

    gsap.set(slides[0], { visibility: 'visible' });
    gsap.set(masks[0],  { clipPath: FULL });
    gsap.set(images[0], { scale: 1.2 });
    gsap.set(texts[0],  { opacity: 1 });

    countEl.textContent = pad(1);
    gsap.set(stack, { visibility: 'visible' });

    function updateCount(idx) {
      gsap.to(countEl, {
        opacity: 0,
        duration: 0.12,
        onComplete: function() {
          countEl.textContent = pad(idx + 1);
          gsap.to(countEl, { opacity: 1, duration: 0.12 });
        }
      });
    }

    function updateButtons() {
      gsap.set(prevBtn, { opacity: current <= 0 ? 0.3 : 1 });
      gsap.set(nextBtn, { opacity: current >= total - 1 ? 0.3 : 1 });
    }

    function goNext() {
      if (animating || current >= total - 1) return;

      animating = true;

      var prev = current;
      var next = current + 1;

      gsap.set(slides[next], { visibility: 'visible' });

      var tl = gsap.timeline({
        onComplete: function() {
          current = next;
          animating = false;
          gsap.set(slides[prev], { visibility: 'hidden' });
          updateButtons();
        }
      });

      tl.to(masks[next],  { clipPath: FULL, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.to(images[next], { scale: 1.2, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.to(images[prev], { scale: 1.4, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.to(texts[prev],  { opacity: 0, duration: 0.3, ease: 'power1.out' }, 0);
      tl.to(texts[next],  { opacity: 1, duration: 0.3, ease: 'power1.in' }, 0.2);

      updateCount(next);
    }

    function goPrev() {
      if (animating || current <= 0) return;

      animating = true;

      var cur = current;
      var prev = current - 1;

      gsap.set(slides[prev], { visibility: 'visible' });

      var tl = gsap.timeline({
        onComplete: function() {
          current = prev;
          animating = false;
          gsap.set(images[cur], { scale: 1 });
          gsap.set(slides[cur], { visibility: 'hidden' });
          updateButtons();
        }
      });

      tl.to(masks[cur],   { clipPath: HIDDEN, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.to(images[cur],  { scale: 1, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.to(images[prev], { scale: 1.2, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.to(texts[cur],   { opacity: 0, duration: 0.3, ease: 'power1.out' }, 0);
      tl.to(texts[prev],  { opacity: 1, duration: 0.3, ease: 'power1.in' }, 0.2);

      updateCount(prev);
    }

    updateButtons();

    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);

    var startX = 0;
    var startY = 0;
    var threshold = 50;

    stack.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    stack.addEventListener('touchend', function(e) {
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
        if (dx < 0) goNext();
        if (dx > 0) goPrev();
      }
    }, { passive: true });
  });
})();
