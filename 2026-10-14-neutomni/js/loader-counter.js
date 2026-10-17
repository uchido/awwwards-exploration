(function() {
    const DIGIT_H = 20;
    const ONES_STEP = 5;

    function buildStrip(el, digits) {
      digits.forEach(d => {
        const span = document.createElement('div');
        span.className = 'digit-char';
        span.textContent = d;
        el.appendChild(span);
      });
    }

    const onesDigits = [];
    for (let i = 0; i < 12; i++) [0, 5].forEach(d => onesDigits.push(d));
    const tensDigits = [];
    for (let i = 0; i < 12; i++) for (let d = 0; d <= 9; d++) tensDigits.push(d);

    buildStrip(document.getElementById('strip-h'), [0, 1]);
    buildStrip(document.getElementById('strip-t'), tensDigits);
    buildStrip(document.getElementById('strip-o'), onesDigits);

    window.addEventListener('DOMContentLoaded', function() {
      const proxy = { val: 0 };
      const stripH = document.getElementById('strip-h');
      const stripT = document.getElementById('strip-t');
      const stripO = document.getElementById('strip-o');

      gsap.set([stripH, stripT, stripO], { y: 0 });

      gsap.to(proxy, {
        val: 100,
        duration: 3,
        ease: 'power2.inOut',
        onUpdate() {
          const v = proxy.val;
          gsap.set(stripH, { y: -(v / 100) * DIGIT_H });
          gsap.set(stripT, { y: -(v / 10) * DIGIT_H });
          gsap.set(stripO, { y: -(v / ONES_STEP) * DIGIT_H });
        }
      });
    });
  })();
