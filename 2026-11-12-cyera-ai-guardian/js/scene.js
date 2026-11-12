/* Scene: starfield canvas, crystal field, watermark, nebula parallax */
(function () {
    const D = window.CLONE_DATA;

    /* ---------- Starfield ---------- */
    function initStars() {
        const canvas = document.getElementById('stars-canvas');
        const ctx = canvas.getContext('2d');
        let stars = [];
        let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

        function resize() {
            w = canvas.clientWidth; h = canvas.clientHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const count = Math.round((w * h) / 9000);
            stars = [];
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 1.3 + 0.3,
                    p: Math.random() * Math.PI * 2,
                    s: Math.random() * 1.4 + 0.4,
                    tint: Math.random() < 0.18
                });
            }
        }
        resize();
        window.addEventListener('resize', resize);

        let t = 0;
        (function frame() {
            t += 0.016;
            ctx.clearRect(0, 0, w, h);
            for (const s of stars) {
                const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.s + s.p));
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = s.tint ? 'rgba(210,142,255,' + a + ')' : 'rgba(251,251,251,' + a * 0.8 + ')';
                ctx.fill();
            }
            requestAnimationFrame(frame);
        })();
    }

    /* ---------- Crystals ---------- */
    function initCrystals() {
        const field = document.getElementById('crystal-field');
        const nodes = [];
        D.crystals.forEach((c, i) => {
            const el = document.createElement('div');
            el.className = 'crystal';
            el.style.cssText =
                'left:' + c.x + '%;top:' + c.y + '%;width:' + c.size + 'px;height:' + c.size + 'px;' +
                (c.opacity ? 'opacity:' + c.opacity + ';' : '');
            el.innerHTML = '<svg viewBox="0 0 48 48" style="width:100%;height:100%"><use href="#' + c.shape + '"/></svg>';
            field.appendChild(el);
            nodes.push({ el, depth: c.depth, i });

            gsap.to(el, {
                y: '+=' + (12 + Math.random() * 26),
                rotation: (Math.random() - 0.5) * 14,
                duration: 4 + Math.random() * 5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: -1,
                delay: -Math.random() * 5
            });
        });

        /* mouse parallax */
        let mx = 0, my = 0, cx = 0, cy = 0;
        window.addEventListener('pointermove', (e) => {
            mx = (e.clientX / window.innerWidth - 0.5) * 2;
            my = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        (function parallax() {
            cx += (mx - cx) * 0.04;
            cy += (my - cy) * 0.04;
            nodes.forEach((n, i) => {
                const d = n.depth * 14;
                n.el.style.translate = (-cx * d) + 'px ' + (-cy * d * 0.6) + 'px';
            });
            requestAnimationFrame(parallax);
        })();

        return nodes;
    }

    /* ---------- Watermark ---------- */
    function initWatermark() {
        const wm = document.getElementById('watermark');
        const cache = {};
        function set(key, instant) {
            if (!key) {
                delete wm.dataset.key;
                gsap.to(wm, { opacity: 0, duration: instant ? 0 : .6, scale: .96 });
                return;
            }
            if (wm.dataset.key === key) return;
            wm.dataset.key = key;
            let node = cache[key];
            if (!node) {
                if (D.watermarks[key]) {
                    node = document.createElement('img');
                    node.src = D.watermarks[key];
                    node.alt = '';
                } else {
                    node = document.createElement('span');
                    node.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                }
                cache[key] = node;
                wm.innerHTML = '';
                wm.appendChild(node);
            } else {
                wm.innerHTML = '';
                wm.appendChild(node);
            }
            gsap.fromTo(wm, { opacity: instant ? 0 : 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' });
        }
        return { set };
    }

    window.CloneScene = { initStars, initCrystals, initWatermark };
})();
