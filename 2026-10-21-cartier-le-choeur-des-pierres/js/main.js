(function() {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    function initLenis() {
        if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
                smoothTouch: false,
                touchMultiplier: 2,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);

            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                lenis.on('scroll', ScrollTrigger.update);
                gsap.ticker.add((time) => {
                    lenis.raf(time * 1000);
                });
                gsap.ticker.lagSmoothing(0);
            }

            window.lenis = lenis;
            return lenis;
        }
        return null;
    }

    function initCustomCursor() {
        if (prefersReducedMotion || isMobile) return;

        const cursor = document.querySelector('.cursor');
        const cursorInner = document.querySelector('.cursor__inner');
        const cursorRing = document.querySelector('.cursor__ring');

        if (!cursor || !cursorInner || !cursorRing) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let ringX = 0;
        let ringY = 0;
        let isVisible = false;
        let animationId = null;

        const hoverElements = 'a, button, .theme-card, .creation-card, .gouaches__slide, .gouaches__btn, .gouaches__dot, .cta__btn, .header__logo, .header__search, .header__language, .header__menu-btn, .footer__nav-link, .footer__social-link, .footer__legal-link, .theme-card__link';

        function updateCursor() {
            currentX += (mouseX - currentX) * 0.2;
            currentY += (mouseY - currentY) * 0.2;
            ringX += (mouseX - ringX) * 0.1;
            ringY += (mouseY - ringY) * 0.1;

            cursorInner.style.transform = `translate(${currentX - 4}px, ${currentY - 4}px)`;
            cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;

            animationId = requestAnimationFrame(updateCursor);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isVisible) {
                cursor.classList.add('cursor--visible');
                isVisible = true;
                updateCursor();
            }
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--visible');
            isVisible = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        });

        document.addEventListener('mousedown', () => {
            cursor.classList.add('cursor--click');
        });

        document.addEventListener('mouseup', () => {
            cursor.classList.remove('cursor--click');
        });

        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest(hoverElements);
            if (target) {
                cursor.classList.add('cursor--hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest(hoverElements);
            if (target) {
                cursor.classList.remove('cursor--hover');
            }
        });
    }

    function initHeader() {
        const header = document.querySelector('.header');
        const menuBtn = document.querySelector('.header__menu-btn');
        const menu = document.querySelector('.header__menu');
        let lastScroll = 0;

        if (!header) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY || window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });

        if (menuBtn && menu) {
            menuBtn.addEventListener('click', () => {
                const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
                menuBtn.setAttribute('aria-expanded', !isExpanded);
                menu.classList.toggle('header__menu--open');
                document.body.style.overflow = isExpanded ? '' : 'hidden';
            });

            menu.querySelectorAll('.header__menu-link').forEach(link => {
                link.addEventListener('click', () => {
                    menuBtn.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('header__menu--open');
                    document.body.style.overflow = '';
                });
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menu.classList.contains('header__menu--open')) {
                    menuBtn.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('header__menu--open');
                    document.body.style.overflow = '';
                    menuBtn.focus();
                }
            });
        }
    }

    function initHeroAnimations() {
        if (typeof gsap === 'undefined' || prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        const titleWords = document.querySelectorAll('.hero__title-word');
        const subtitle = document.querySelector('.hero__subtitle');
        const scrollIndicator = document.querySelector('.hero__scroll');
        const progressBar = document.querySelector('.hero__progress-bar');

        if (titleWords.length) {
            gsap.to(titleWords, {
                y: 0,
                duration: 1.2,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.3
            });
        }

        if (subtitle) {
            gsap.to(subtitle, {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                delay: 1
            });
        }

        if (progressBar) {
            ScrollTrigger.create({
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                onUpdate: (self) => {
                    progressBar.style.width = `${self.progress * 100}%`;
                }
            });
        }

        const heroMedia = document.querySelector('.hero__media');
        const heroImage = document.querySelector('.hero__image');

        if (heroMedia && heroImage) {
            gsap.to(heroImage, {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    }

    function initScrollReveal() {
        if (typeof gsap === 'undefined' || prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        const revealElements = document.querySelectorAll('[data-animate]');

        revealElements.forEach((el, index) => {
            const delay = parseFloat(el.style.transitionDelay) || 0;
            const animationType = el.dataset.animate;

            let y = 60;
            let x = 0;

            if (animationType === 'reveal-left') x = -60;
            if (animationType === 'reveal-right') x = 60;

            gsap.fromTo(el,
                {
                    opacity: 0,
                    y: y,
                    x: x
                },
                {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    duration: 1,
                    delay: delay,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse',
                        once: true
                    }
                }
            );
        });
    }

    function initThemeCards() {
        if (typeof gsap === 'undefined' || prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        const themeCards = document.querySelectorAll('.theme-card');

        themeCards.forEach((card, index) => {
            const image = card.querySelector('.theme-card__image');
            const content = card.querySelector('.theme-card__content');

            if (image) {
                gsap.fromTo(image,
                    { scale: 1.1 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1
                        }
                    }
                );
            }
        });
    }

    function initCreationCards() {
        if (typeof gsap === 'undefined' || prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        const creationCards = document.querySelectorAll('.creation-card');

        creationCards.forEach((card) => {
            const image = card.querySelector('.creation-card__image');

            if (image) {
                gsap.fromTo(image,
                    { scale: 1.1 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1
                        }
                    }
                );
            }
        });
    }

    function initGouachesSlider() {
        const slider = document.querySelector('[data-slider]');
        if (!slider) return;

        const track = slider.querySelector('.gouaches__track');
        const slides = slider.querySelectorAll('.gouaches__slide');
        const prevBtn = slider.querySelector('.gouaches__btn--prev');
        const nextBtn = slider.querySelector('.gouaches__btn--next');
        const pagination = slider.querySelector('.gouaches__pagination');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let slideWidth = 0;
        let isAnimating = false;
        let autoplayInterval = null;

        function createPagination() {
            if (!pagination) return;
            pagination.innerHTML = '';
            slides.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.className = 'gouaches__dot' + (index === 0 ? ' gouaches__dot--active' : '');
                dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                dot.addEventListener('click', () => goToSlide(index));
                pagination.appendChild(dot);
            });
        }

        function updateSlideWidth() {
            const firstSlide = slides[0];
            if (firstSlide) {
                const style = getComputedStyle(firstSlide);
                const gap = parseFloat(getComputedStyle(track).gap) || 24;
                slideWidth = firstSlide.offsetWidth + gap;
            }
        }

        function goToSlide(index) {
            if (isAnimating) return;
            isAnimating = true;

            currentIndex = Math.max(0, Math.min(index, slides.length - 1));
            const scrollPosition = currentIndex * slideWidth;

            track.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });

            updatePagination();
            resetAutoplay();

            setTimeout(() => { isAnimating = false; }, 500);
        }

        function updatePagination() {
            if (!pagination) return;
            const dots = pagination.querySelectorAll('.gouaches__dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('gouaches__dot--active', index === currentIndex);
            });
        }

        function nextSlide() {
            goToSlide((currentIndex + 1) % slides.length);
        }

        function prevSlide() {
            goToSlide((currentIndex - 1 + slides.length) % slides.length);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
                autoplayInterval = null;
            }
        }

        function resetAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        track.addEventListener('scroll', () => {
            if (isAnimating) return;
            const newIndex = Math.round(track.scrollLeft / slideWidth);
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
                currentIndex = newIndex;
                updatePagination();
            }
        }, { passive: true });

        slider.addEventListener('mouseenter', stopAutoplay);
        slider.addEventListener('mouseleave', startAutoplay);
        slider.addEventListener('touchstart', stopAutoplay, { passive: true });
        slider.addEventListener('touchend', startAutoplay, { passive: true });

        window.addEventListener('resize', () => {
            updateSlideWidth();
            goToSlide(currentIndex);
        });

        updateSlideWidth();
        createPagination();
        startAutoplay();
    }

    function initCounters() {
        if (typeof gsap === 'undefined' || prefersReducedMotion) return;

        gsap.registerPlugin(ScrollTrigger);

        const counters = document.querySelectorAll('[data-animate="counter"] .craft__stat-number');

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target, 10);
            if (isNaN(target)) return;

            gsap.to(counter, {
                innerText: target,
                duration: 2,
                ease: 'power2.out',
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: counter.closest('.craft__stat'),
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                    once: true
                }
            });
        });
    }

    function initParallax() {
        if (typeof gsap === 'undefined' || prefersReducedMotion || isMobile) return;

        gsap.registerPlugin(ScrollTrigger);

        const parallaxElements = document.querySelectorAll('.intro__figure, .craft__figure');

        parallaxElements.forEach(el => {
            gsap.fromTo(el,
                { yPercent: 20 },
                {
                    yPercent: -20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                }
            );
        });
    }

    function initImageLoadAnimations() {
        const images = document.querySelectorAll('img[loading="lazy"]');

        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
            }
        });
    }

    function initSmoothAnchorScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    if (window.lenis) {
                        window.lenis.scrollTo(target, { offset: -80 });
                    } else {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    target.focus({ preventScroll: true });
                }
            });
        });
    }

    function initIntersectionObserverFallback() {
        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, {
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        });

        document.querySelectorAll('[data-animate]').forEach(el => {
            observer.observe(el);
        });
    }

    function initPageLoadSequence() {
        if (prefersReducedMotion) {
            document.querySelectorAll('[data-animate]').forEach(el => {
                el.classList.add('is-visible');
            });
            return;
        }

        const heroTitleWords = document.querySelectorAll('.hero__title-word');
        const heroSubtitle = document.querySelector('.hero__subtitle');
        const heroScroll = document.querySelector('.hero__scroll');

        if (heroTitleWords.length) {
            heroTitleWords.forEach((word, i) => {
                word.style.transitionDelay = `${0.3 + i * 0.1}s`;
            });
        }

        if (heroSubtitle) {
            heroSubtitle.style.transitionDelay = '1s';
        }
    }

    function init() {
        initLenis();
        initCustomCursor();
        initHeader();
        initHeroAnimations();
        initScrollReveal();
        initThemeCards();
        initCreationCards();
        initGouachesSlider();
        initCounters();
        initParallax();
        initImageLoadAnimations();
        initSmoothAnchorScroll();
        initIntersectionObserverFallback();
        initPageLoadSequence();

        document.body.classList.add('js-loaded');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', () => {
        document.body.classList.add('page-loaded');
    });
})();