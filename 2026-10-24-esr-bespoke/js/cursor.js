/* Custom cursor — lerped dot, grows on hover targets, "Drag" state over gallery */
(function () {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let x = -100, y = -100, cx = -100, cy = -100;
  let visible = false;

  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    if (!visible) {
      visible = true;
      cx = x; cy = y;
    }
  });

  function loop() {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    cursor.style.transform =
      `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('[data-cursor]').forEach((el) => {
    const mode = el.getAttribute('data-cursor');
    el.addEventListener('mouseenter', () => {
      cursor.classList.add(mode === 'drag' ? 'is-drag' : 'is-hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('is-hover', 'is-drag');
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
})();
