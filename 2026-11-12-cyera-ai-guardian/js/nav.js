/* Navigation: native scroll + ScrollTrigger parallax + discrete step transitions */
(function () {
    const D = window.CLONE_DATA;
    let steps = [], current = -1, transitioning = false, snapping = false, vh = window.innerHeight;
    let wm, railDots = [], shieldCtl = null;
    const proxy = { y: 0 };

    /* ---------- splitting ---------- */
    function splitText(el) {
        if (el.dataset.splitDone) return el.querySelectorAll('.word');
        const walk = (node) => {
            [...node.childNodes].forEach((child) => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
                        const w = document.createElement('span');
                        w.className = 'word';
                        w.textContent = part;
                        frag.appendChild(w);
                    });
                    node.replaceChild(frag, child);
                } else if (child.nodeType === 1 && child.tagName !== 'BR' && child.tagName !== 'A') {
                    walk(child);
                }
            });
        };
        walk(el);
        el.dataset.splitDone = '1';
        return el.querySelectorAll('.word');
    }

    /* ---------- rail ---------- */
    function buildRail() {
        const rail = document.getElementById('chapter-rail');
        steps.forEach((s, i) => {
            const dot = document.createElement('button');
            dot.className = 'rail-dot';
            dot.innerHTML = '<span class="rail-label">' + s.dataset.title + '</span>';
            dot.addEventListener('click', () => goTo(i));
            rail.appendChild(dot);
            railDots.push(dot);
        });
    }

    /* ---------- toast ---------- */
    function toast(msg, ms = 2600) {
        const el = document.getElementById('chapter-toast');
        el.textContent = msg;
        gsap.killTweensOf(el);
        gsap.fromTo(el, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' });
        gsap.to(el, { opacity: 0, y: -12, duration: .45, delay: ms / 1000, ease: 'power2.in' });
    }

    /* ---------- step transitions ---------- */
    function enterStep(i, instant) {
        const s = steps[i];
        if (!s) return;
        s.classList.add('active');
        gsap.set(s, { visibility: 'visible', opacity: 1 });

        const words = s.querySelectorAll('.word');
        const reveals = s.querySelectorAll('[data-reveal]');
        const tl = gsap.timeline();
        if (instant) tl.progress(1);

        tl.fromTo(s, { scale: instant ? 1 : 1.03 }, { scale: 1, duration: .9, ease: 'power3.out' }, 0);
        if (words.length) {
            gsap.set(words, { yPercent: 115, rotate: 4 });
            tl.to(words, { yPercent: 0, rotate: 0, duration: .9, stagger: .018, ease: 'power4.out' }, .05);
        }
        reveals.forEach((el, k) => {
            tl.fromTo(el, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: .7, ease: 'power3.out' }, .18 + k * .06);
        });

        /* watermark per chapter */
        const chapter = s.dataset.chapter;
        if (chapter) wm.set(chapter); else wm.set(null);

        /* theme */
        document.body.dataset.theme = s.dataset.theme || 'grape';

        /* rail */
        railDots.forEach((d, k) => {
            d.classList.toggle('active', k === i);
            if (k < i) d.classList.add('done'); else d.classList.remove('done');
        });

        /* shield lifecycle */
        if (shieldCtl) {
            if (s.dataset.chapter === 'govern' && s.classList.contains('step-games')) shieldCtl.activate();
            else shieldCtl.deactivate();
        }
        updateHint();
    }

    function exitStep(i) {
        const s = steps[i];
        if (!s) return;
        const tl = gsap.timeline({
            onComplete: () => {
                s.classList.remove('active');
                gsap.set(s, { visibility: 'hidden', opacity: 0 });
            }
        });
        tl.to(s.querySelectorAll('.word, [data-reveal]'), {
            opacity: 0, y: -34, duration: .45, stagger: .012, ease: 'power2.in'
        }, 0)
            .to(s, { opacity: 0, scale: .985, duration: .5, ease: 'power2.in' }, 0);
    }

    function goTo(i, instant) {
        i = Math.max(0, Math.min(steps.length - 1, i));
        if (i === current) {
            if (!instant) snapTo(i);
            return;
        }
        const prev = current;
        current = i;
        transitioning = true;
        clearTimeout(goTo._t);
        goTo._t = setTimeout(() => { transitioning = false; }, 1000);
        if (instant) {
            if (prev >= 0) exitStepInstant(prev);
            enterStep(i, true);
        } else {
            if (prev >= 0) exitStep(prev);
            enterStep(i, false);
        }
        snapTo(i, instant);
    }

    function exitStepInstant(i) {
        const s = steps[i];
        s.classList.remove('active');
        gsap.set(s, { visibility: 'hidden', opacity: 0 });
    }

    /* ---------- scrolling ---------- */
    function snapTo(i, immediate) {
        const target = i * vh;
        if (Math.abs(window.scrollY - target) < 2) return;
        gsap.killTweensOf(proxy);
        if (immediate) { window.scrollTo(0, target); return; }
        proxy.y = window.scrollY;
        snapping = true;
        gsap.to(proxy, {
            y: target, duration: .8, ease: 'power3.inOut',
            onUpdate: () => window.scrollTo(0, proxy.y),
            onComplete: () => { snapping = false; }
        });
    }

    function onScroll() {
        if (snapping) return;
        const idx = Math.max(0, Math.min(steps.length - 1, Math.round(window.scrollY / vh)));
        if (idx !== current) goTo(idx);
        /* debounce-snap */
        clearTimeout(onScroll._t);
        onScroll._t = setTimeout(() => { if (!snapping) snapTo(Math.round(window.scrollY / vh)); }, 160);
    }

    /* wheel nudge: small wheels advance a step (original behaviour) */
    function onWheel(e) {
        if (e.target.closest('#contact-form, .decide-card, #shield-canvas')) return;
        if (document.getElementById('menu-overlay').classList.contains('open')) { e.preventDefault(); return; }
        e.preventDefault();
        if (transitioning || snapping) return;
        const dir = e.deltaY > 0 ? 1 : -1;
        goTo(current + dir);
    }

    function onKey(e) {
        if (e.target.closest('input, textarea')) return;
        if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goTo(current + 1); }
        if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); goTo(current - 1); }
        if (e.key === 'Home') { e.preventDefault(); goTo(0); }
        if (e.key === 'End') { e.preventDefault(); goTo(steps.length - 1); }
        if (e.key === 'Escape') closeMenu();
    }

    /* touch swipe */
    let touchY = null;
    function onTouchStart(e) { touchY = e.touches[0].clientY; }
    function onTouchEnd(e) {
        if (touchY === null) return;
        const dy = touchY - e.changedTouches[0].clientY;
        touchY = null;
        if (Math.abs(dy) < 60) return;
        if (e.target.closest('#shield-canvas, #contact-form, .decide-card')) return;
        const nearest = Math.round(window.scrollY / vh);
        if (nearest === current) goTo(current + (dy > 0 ? 1 : -1));
    }

    /* ---------- menu ---------- */
    function openMenu() { document.getElementById('menu-overlay').classList.add('open'); }
    function closeMenu() { document.getElementById('menu-overlay').classList.remove('open'); }

    /* ---------- public ---------- */
    function refreshButtons() {
        const state = window.CloneChapters.state;
        document.querySelectorAll('.world-completed').forEach((badge) => {
            const key = badge.dataset.done;
            gsap.to(badge, { scale: state[key] ? 1 : 0, duration: .6, ease: 'back.out(2)' });
        });
        document.querySelectorAll('[data-next]').forEach((btn) => {
            const section = btn.closest('.step');
            const key = section.dataset.chapter;
            const done = !key || state[key];
            if (done) {
                btn.removeAttribute('data-disabled');
                btn.setAttribute('data-nav', String(steps.indexOf(section) + 1));
            }
        });
        updateHint();
    }

    function updateHint() {
        const hint = document.getElementById('scroll-hint');
        const last = current >= steps.length - 1;
        hint.classList.toggle('hidden', last);
    }

    function init() {
        steps = [...document.querySelectorAll('.step')];
        vh = window.innerHeight;
        wm = window.CloneScene.initWatermark();
        buildRail();
        shieldCtl = window.CloneGames.initShield();
        window.CloneGames.initConstellation();
        window.CloneGames.initCompass();
        window.CloneGames.initDecide();

        /* scroll spacer */
        const spacer = document.createElement('div');
        spacer.id = 'scroll-space';
        spacer.style.height = (steps.length * 100) + 'vh';
        spacer.style.pointerEvents = 'none';
        document.body.appendChild(spacer);

        /* ScrollTrigger: continuous parallax driven by the virtual scroll */
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.create({
            trigger: '#scroll-space',
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                const p = self.progress;
                gsap.set('#planet-horizon', { yPercent: -30 * p, rotate: 0 });
                gsap.set('.nebula-a', { xPercent: 6 * p, yPercent: -10 * p });
                gsap.set('.nebula-b', { xPercent: -8 * p, yPercent: 6 * p });
                gsap.set('#watermark', { yPercent: -8 * p });
            }
        });

        /* events */
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('keydown', onKey);
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        window.addEventListener('resize', () => { vh = window.innerHeight; snapTo(current, true); });

        document.getElementById('menu-button').addEventListener('click', openMenu);
        document.getElementById('menu-close').addEventListener('click', closeMenu);
        document.addEventListener('click', (e) => {
            const nav = e.target.closest('[data-nav]');
            if (nav) {
                e.preventDefault();
                closeMenu();
                goTo(+nav.dataset.nav);
                return;
            }
            const next = e.target.closest('[data-next]');
            if (next && !next.hasAttribute('data-disabled')) {
                const section = next.closest('.step');
                goTo(steps.indexOf(section) + 1);
                return;
            }
            const skip = e.target.closest('[data-skip]');
            if (skip) {
                window.CloneChapters.setComplete(skip.dataset.skip);
                toast('Game skipped');
                refreshButtons();
                return;
            }
            const replay = e.target.closest('[data-replay]');
            if (replay) goTo(0);
        });

        window.CloneChapters.onComplete(() => refreshButtons());
        refreshButtons();
        window.CloneNav = { toast, goTo, refreshButtons, get current() { return current; }, set current(v) { current = v; } };

        /* start at landing */
        goTo(0, true);
        ScrollTrigger.refresh();
    }

    window.CloneNavInit = { init, splitText };
})();
