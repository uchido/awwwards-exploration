/* Loader — mirrors the original Hydrax loader (bar scale + ray wipe + logo settle) */
(function () {
    const loader = document.getElementById('loader-container');
    const bar = document.getElementById('loader-bar');
    const logo = document.getElementById('loader-logo');
    const barWrap = document.getElementById('loader-bar-container');
    const particles = document.getElementById('loader-particles');
    const rays = document.getElementById('ray-container');

    function run(onDone) {
        gsap.set(barWrap, { xPercent: -50 });
        gsap.set(particles, { xPercent: -50, yPercent: -50 });
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

        tl.to(bar, { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, 0)
            .fromTo(rays, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power3.in' }, 1.0)
            .fromTo(logo, { scale: 1 }, { scale: 1.04, duration: 2.1, ease: 'power1.inOut' }, 0)
            // hand-off: bar drains, logo zooms through, rays collapse
            .to(barWrap, { scaleX: 0, duration: 0.5, ease: 'power3.in' }, 2.25)
            .to(logo, { scale: 8, opacity: 0, duration: 0.85, ease: 'power3.in' }, 2.35)
            .to(particles, { opacity: 0, scale: 0.6, duration: 0.6, ease: 'power2.in' }, 2.45)
            .to(rays, { scaleX: 2.4, opacity: 0, duration: 0.9, ease: 'power2.in' }, 2.55)
            .add(() => {
                loader.classList.add('is-done');
                loader.style.display = 'none';
                onDone && onDone();
            }, 3.35);
    }

    window.CloneLoader = { run: run };
})();
