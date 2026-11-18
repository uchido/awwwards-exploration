(() => {
  const ST = window.ST;
  const preloader = ST.$('.site-preloader');
  if (!preloader) {
    ST.dispatchRevealed();
    return;
  }

  const layers = [ST.$('.preloader-sheet', preloader), ...ST.$$('.preloader-layer', preloader)].filter(Boolean);
  const mark = ST.$('.preloader-mark', preloader);
  let finished = false;

  if (ST.reduced) {
    preloader.style.display = 'none';
    ST.dispatchRevealed();
    return;
  }

  if (!window.location.hash) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  if (mark && mark.dataset.sticker) {
    const image = document.createElement('img');
    image.src = mark.dataset.sticker;
    image.alt = '';
    image.style.cssText = 'width:100%;height:100%;object-fit:contain;display:block';
    mark.appendChild(image);
  }

  function release() {
    if (finished) return;
    finished = true;
    preloader.style.display = 'none';
    ST.dispatchRevealed();
  }

  function start() {
    if (finished) return;
    const gsap = ST.gsap;

    if (gsap) {
      const timeline = gsap.timeline();
      if (mark) {
        gsap.set(mark, { autoAlpha: 0, scale: 0.62, rotationX: -78, y: (mark.clientWidth || 200) * 0.064 });
        timeline.to(mark, { autoAlpha: 1, duration: 0.26, ease: 'none' }, 0.12)
          .to(mark, { scale: 1, duration: 0.92, ease: 'back.out(2.8)' }, 0.12)
          .to(mark, { rotationX: 0, duration: 0.92, ease: 'back.out(2.24)' }, 0.12)
          .to(mark, { y: 0, duration: 0.9, ease: 'power3.out' }, 0.12)
          .to(mark, { autoAlpha: 0, duration: 0.24, ease: 'power1.in' }, 1.08);
      }
      layers.forEach((layer, index) => {
        timeline.to(layer, {
          yPercent: -100,
          duration: 0.68,
          ease: 'power3.inOut'
        }, 1.08 + index * 0.06);
      });
      timeline.call(release, null, 1.08 + (layers.length - 1) * 0.06 + 0.7);
      return;
    }

    if (mark) {
      mark.style.visibility = 'visible';
      mark.style.opacity = '0';
      mark.style.transform = `scale(0.62) rotateX(-78deg) translateY(${(mark.clientWidth || 200) * 0.064}px)`;
      requestAnimationFrame(() => {
        mark.style.transition = 'opacity .26s linear, transform .92s cubic-bezier(.22,1,.36,1)';
        mark.style.opacity = '1';
        mark.style.transform = 'scale(1) rotateX(0deg) translateY(0)';
      });
      setTimeout(() => { mark.style.opacity = '0'; }, 1080);
    }
    layers.forEach((layer, index) => {
      setTimeout(() => {
        layer.style.transition = 'transform .68s cubic-bezier(.65,0,.35,1)';
        layer.style.transform = 'translateY(-100%)';
      }, 1080 + index * 60);
    });
    setTimeout(release, 1080 + (layers.length - 1) * 60 + 700);
  }

  const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([ready, ST.wait(1200)]).then(start);
  setTimeout(release, 5000);
})();
