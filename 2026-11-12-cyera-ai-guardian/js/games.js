/* Minigames recreated from the original: ConstellationDraw, CompassStop, ShieldDefend + real-time decide UI */
(function () {
    const D = window.CLONE_DATA;
    const chapters = { discover: false, govern: false, protect: false };
    const listeners = [];
    function setComplete(key) {
        if (chapters[key]) return;
        chapters[key] = true;
        document.body.setAttribute('data-' + key + '-done', '1');
        listeners.forEach((fn) => fn(key));
    }
    function onComplete(fn) { listeners.push(fn); }
    window.CloneChapters = { state: chapters, setComplete, onComplete };

    const toast = (msg, ms) => window.CloneNav && window.CloneNav.toast(msg, ms);

    /* ============ 1 · Constellation (connect the stars) ============ */
    function initConstellation() {
        const svg = document.getElementById('constellation');
        const status = document.getElementById('constellation-status');
        if (!svg) return;
        const NS = 'http://www.w3.org/2000/svg';
        const stars = D.constellationStars;

        const core = document.createElementNS(NS, 'circle');
        core.setAttribute('class', 'data-core');
        core.setAttribute('cx', 160); core.setAttribute('cy', 148);
        core.setAttribute('r', 34);
        svg.appendChild(core);
        const lbl = document.createElementNS(NS, 'text');
        lbl.setAttribute('class', 'data-label');
        lbl.setAttribute('x', 160); lbl.setAttribute('y', 152);
        lbl.textContent = 'AI Data';
        svg.appendChild(lbl);

        let clicked = [];
        const starEls = stars.map(([x, y], i) => {
            const g = document.createElementNS(NS, 'g');
            g.setAttribute('class', 'star');
            const halo = document.createElementNS(NS, 'circle');
            halo.setAttribute('class', 'halo');
            halo.setAttribute('cx', x); halo.setAttribute('cy', y);
            halo.setAttribute('r', 11);
            const c = document.createElementNS(NS, 'circle');
            c.setAttribute('class', 'core');
            c.setAttribute('cx', x); c.setAttribute('cy', y);
            c.setAttribute('r', 5.5);
            g.appendChild(halo); g.appendChild(c);
            svg.appendChild(g);
            g.addEventListener('click', () => hit(i));
            return g;
        });

        function markNext() {
            starEls.forEach((el, i) => el.classList.toggle('next', clicked.length && i !== clicked[clicked.length - 1] && !clicked.includes(i)));
        }
        function hit(i) {
            if (clicked.includes(i)) return;
            const prev = clicked[clicked.length - 1];
            clicked.push(i);
            if (prev !== undefined) {
                const line = document.createElementNS(NS, 'line');
                line.setAttribute('x1', stars[prev][0]); line.setAttribute('y1', stars[prev][1]);
                line.setAttribute('x2', stars[i][0]); line.setAttribute('y2', stars[i][1]);
                svg.insertBefore(line, svg.firstChild);
                gsap.to(line, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' });
            }
            gsap.fromTo(starEls[i], { scale: 1.5 }, { scale: 1, duration: 0.5, ease: 'back.out(3)', transformOrigin: 'center' });
            if (clicked.length === stars.length) {
                markNext();
                svg.classList.add('won');
                status.textContent = 'Data secured — Discover Complete';
                status.classList.add('win');
                setComplete('discover');
                toast('Discover Complete');
                window.CloneNav && window.CloneNav.refreshButtons();
            } else {
                status.textContent = (stars.length - clicked.length) + ' stars left';
                markNext();
            }
        }
        markNext();
    }

    /* ============ 2 · Compass (stop the needle) ============ */
    function initCompass() {
        const dial = document.querySelector('.compass-dial');
        const needle = document.querySelector('.compass-needle');
        const btn = document.getElementById('compass-stop');
        const status = document.getElementById('compass-status');
        const attemptsEl = document.getElementById('compass-attempts');
        if (!dial) return;
        let attempts = 0, spinning = false, spin = null, frozen = false;

        function startSpin() {
            spinning = true;
            spin = gsap.to(needle, { rotation: '+=360', duration: 2.2, ease: 'none', repeat: -1 });
        }
        function stop() {
            if (!spinning || frozen) return;
            spinning = false;
            spin.kill();
            attempts++;
            attemptsEl.textContent = attempts;
            const r = gsap.getProperty(needle, 'rotation') % 360;
            const inZone = r <= 44 || r >= 344;
            if (inZone) {
                frozen = true;
                status.textContent = 'Locked on — Compass complete';
                status.classList.add('win');
                gsap.fromTo(dial, { scale: 1 }, { scale: 1.06, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' });
                setComplete('discover');
                toast('Discover Complete');
                window.CloneNav && window.CloneNav.refreshButtons();
            } else {
                status.textContent = 'Keep trying — stop in the green zone';
                status.classList.remove('win');
                gsap.fromTo(needle, { rotation: r }, { rotation: r + 360, duration: 2.2, ease: 'none', repeat: -1,
                    onStart: () => { spinning = true; } });
            }
        }
        dial.addEventListener('click', stop);
        btn.addEventListener('click', stop);
        startSpin();
    }

    /* ============ 3 · Shield Defend ============ */
    function initShield() {
        const canvas = document.getElementById('shield-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const status = document.getElementById('shield-status');
        const scoreEl = document.getElementById('shield-score');
        const integrityEl = document.getElementById('shield-integrity');
        const integrityWrap = integrityEl.closest('.integrity');
        const TOTAL = 10;
        const W = canvas.width, H = canvas.height;
        let running = false, won = false;
        let shieldX = W / 2, threats = [], score = 0, integrity = 100, spawnT = 0, burst = [];

        const crystal = { x: W / 2, y: H - 54, r: 26 };

        function reset() {
            threats = []; burst = [];
            score = 0; integrity = 100; spawnT = 0;
            scoreEl.textContent = '0';
            integrityEl.textContent = '100%';
            integrityWrap.classList.remove('low');
            status.textContent = 'Move your pointer to steer the shield';
            status.classList.remove('win');
        }

        function spawn() {
            threats.push({ x: 40 + Math.random() * (W - 80), y: -16, vy: 2.2 + Math.random() * 1.6, vx: (Math.random() - .5) * 0.8, r: 8 + Math.random() * 4 });
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            /* crystal */
            const g = ctx.createRadialGradient(crystal.x - 8, crystal.y - 10, 4, crystal.x, crystal.y, crystal.r * 1.6);
            g.addColorStop(0, '#C5FF9E'); g.addColorStop(1, '#2A6B2E');
            ctx.beginPath();
            ctx.moveTo(crystal.x, crystal.y - crystal.r * 1.4);
            ctx.lineTo(crystal.x + crystal.r, crystal.y);
            ctx.lineTo(crystal.x, crystal.y + crystal.r);
            ctx.lineTo(crystal.x - crystal.r, crystal.y);
            ctx.closePath();
            ctx.fillStyle = g; ctx.fill();
            ctx.strokeStyle = '#160923'; ctx.lineWidth = 2.5; ctx.stroke();

            /* shield arc */
            ctx.beginPath();
            ctx.arc(shieldX, H - 96, 46, Math.PI * 1.15, Math.PI * 1.85);
            ctx.strokeStyle = '#7BF583';
            ctx.lineWidth = 7; ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(123,245,131,.8)'; ctx.shadowBlur = 14;
            ctx.stroke();
            ctx.shadowBlur = 0;

            /* threats */
            for (const t of threats) {
                ctx.beginPath();
                ctx.moveTo(t.x, t.y - t.r);
                ctx.lineTo(t.x + t.r, t.y);
                ctx.lineTo(t.x, t.y + t.r);
                ctx.lineTo(t.x - t.r, t.y);
                ctx.closePath();
                ctx.fillStyle = '#E574FF';
                ctx.strokeStyle = '#160923'; ctx.lineWidth = 2;
                ctx.fill(); ctx.stroke();
            }

            /* bursts */
            for (const b of burst) {
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(191,255,162,' + b.a + ')';
                ctx.fill();
            }
        }

        function step() {
            if (!running) return;
            spawnT -= 1;
            if (spawnT <= 0 && !won) { spawn(); spawnT = 46; }
            for (let i = threats.length - 1; i >= 0; i--) {
                const t = threats[i];
                t.y += t.vy; t.x += t.vx;
                const sy = H - 96;
                if (t.y >= sy - 6 && t.y <= sy + 10 && Math.abs(t.x - shieldX) < 52) {
                    burst.push({ x: t.x, y: t.y, r: 6, a: 1, grow: true });
                    threats.splice(i, 1);
                    score++;
                    scoreEl.textContent = score;
                    continue;
                }
                if (t.y >= H - 46) {
                    threats.splice(i, 1);
                    integrity -= 25;
                    integrityEl.textContent = integrity + '%';
                    integrityWrap.classList.toggle('low', integrity <= 50);
                    if (integrity <= 0) {
                        reset();
                        status.textContent = 'The crystal was breached — keep defending!';
                        gsap.fromTo(canvas, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' });
                    }
                }
            }
            for (let i = burst.length - 1; i >= 0; i--) {
                const b = burst[i];
                b.r += 1.6; b.a -= 0.06;
                if (b.a <= 0) burst.splice(i, 1);
            }
            draw();
            if (score >= TOTAL && !won) {
                won = true;
                running = false;
                status.textContent = 'All threats blocked — Governance Complete';
                status.classList.add('win');
                setComplete('govern');
                toast('Governance Complete');
                window.CloneNav && window.CloneNav.refreshButtons();
                return;
            }
            requestAnimationFrame(step);
        }

        function activate() {
            if (won) { draw(); return; }
            reset();
            running = true;
            requestAnimationFrame(step);
        }

        function moveX(clientX) {
            const rect = canvas.getBoundingClientRect();
            shieldX = Math.max(56, Math.min(W - 56, (clientX - rect.left) / rect.width * W));
        }
        canvas.addEventListener('pointermove', (e) => moveX(e.clientX));
        canvas.addEventListener('touchmove', (e) => { moveX(e.touches[0].clientX); e.preventDefault(); }, { passive: false });

        return { activate, deactivate: () => { running = false; } };
    }

    /* ============ 4 · Decide (approve / block) ============ */
    function initDecide() {
        const list = document.getElementById('decide-list');
        const status = document.getElementById('decide-status');
        if (!list) return;
        let made = 0;
        D.decideRows.forEach((row, i) => {
            const el = document.createElement('div');
            el.className = 'decide-row';
            el.innerHTML =
                '<div class="d-info"><span class="d-label">' + row.label + '</span><span class="d-sub">' + row.sub + '</span></div>' +
                '<div class="decide-btns"><button class="allow" data-i="' + i + '">Approve</button><button class="block" data-i="' + i + '">Block</button></div>';
            list.appendChild(el);
        });
        list.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn || btn.closest('.resolved')) return;
            const i = +btn.dataset.i;
            const row = D.decideRows[i];
            const el = btn.closest('.decide-row');
            const allowed = btn.classList.contains('allow');
            const correct = allowed === row.allow;
            el.classList.add('resolved', allowed ? 'allowed' : 'blocked');
            el.querySelector('.decide-btns').outerHTML =
                '<span class="verdict">' + (allowed ? 'Approved' : 'Blocked') + (correct ? '' : ' · wrong call') + '</span>';
            made++;
            status.textContent = made + ' / ' + D.decideRows.length + ' decisions made';
            if (made === D.decideRows.length) {
                status.textContent = 'Guardrails enforced — Protect Complete';
                status.classList.add('win');
                setComplete('protect');
                toast('Protect Complete');
                window.CloneNav && window.CloneNav.refreshButtons();
            }
        });
    }

    window.CloneGames = { initConstellation, initCompass, initShield, initDecide };
})();
