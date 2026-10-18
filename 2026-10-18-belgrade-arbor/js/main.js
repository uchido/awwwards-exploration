/* ============================================================
   main.js — Belgrade Arbor clone
   Loader, Lenis smooth scroll, GSAP ScrollTrigger choreography
   ============================================================ */

(function () {
  "use strict";

  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = typeof window.ScrollTrigger !== "undefined";
  var hasLenis = typeof window.Lenis !== "undefined";

  if (hasGSAP && hasST) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ----------------------------------------------------------
     Smooth scrolling (Lenis)
     ---------------------------------------------------------- */
  var lenis = null;

  function initLenis() {
    if (!hasLenis) return;
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
      touchMultiplier: 1.5
    });

    if (hasGSAP && hasST) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* ----------------------------------------------------------
     Anchor links
     ---------------------------------------------------------- */
  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        if (lenis) {
          lenis.scrollTo(target, { offset: 0, duration: 1.6 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Lazy videos — play when near viewport
     ---------------------------------------------------------- */
  function initVideos() {
    var videos = document.querySelectorAll("video[data-src]");
    if (!videos.length) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            if (!v.getAttribute("src")) {
              v.src = v.getAttribute("data-src");
              v.load();
            }
            v.muted = true;
            v.play().catch(function () {});
          } else {
            v.pause();
          }
        });
      },
      { rootMargin: "400px" }
    );

    videos.forEach(function (v) {
      io.observe(v);
    });
  }

  /* ----------------------------------------------------------
     Nav / menu
     ---------------------------------------------------------- */
  var menuBtn = document.getElementById("menuBtn");
  var navPanel = document.getElementById("navPanel");

  function closeMenu() {
    if (!menuBtn || !navPanel) return;
    menuBtn.setAttribute("aria-expanded", "false");
    navPanel.classList.remove("is-open");
    if (lenis) lenis.start();
  }

  function initMenu() {
    if (!menuBtn || !navPanel) return;

    // Staggered link reveal delays
    var links = navPanel.querySelectorAll(".nav__link");
    links.forEach(function (l, i) {
      l.style.transitionDelay = 80 + i * 45 + "ms";
    });

    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", open ? "false" : "true");
      navPanel.classList.toggle("is-open", !open);
      if (lenis) {
        open ? lenis.start() : lenis.stop();
      }
      if (hasST) ScrollTrigger.refresh();
    });
  }

  /* ----------------------------------------------------------
     Footer form (demo only)
     ---------------------------------------------------------- */
  function initForm() {
    var form = document.getElementById("footerForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("formStatus");
      if (status) status.hidden = false;
      form.reset();
    });
  }

  /* ----------------------------------------------------------
     Loader + hero intro
     ---------------------------------------------------------- */
  function initLoader(onDone) {
    var loader = document.getElementById("loader");
    var fill = document.getElementById("loaderFill");
    var num = document.getElementById("loaderNum");
    var heroVideo = document.getElementById("heroVideo");
    var titleWrap = document.getElementById("heroTitleWrap");

    if (!loader) {
      onDone();
      return;
    }

    document.documentElement.style.overflow = "hidden";

    var state = { value: 0 };

    function finish() {
      if (heroVideo) {
        heroVideo.play().catch(function () {});
      }

      var tl = hasGSAP ? gsap.timeline() : null;

      if (tl) {
        tl.to(loader, {
          yPercent: -100,
          duration: 1.1,
          ease: "power4.inOut",
          onComplete: function () {
            loader.style.display = "none";
            document.documentElement.style.overflow = "";
            onDone();
          }
        });
        if (titleWrap) {
          tl.to(
            titleWrap,
            { opacity: 1, duration: 1.6, ease: "power2.out" },
            "-=0.45"
          );
        }
      } else {
        loader.style.display = "none";
        document.documentElement.style.overflow = "";
        if (titleWrap) titleWrap.style.opacity = "1";
        onDone();
      }
    }

    if (hasGSAP) {
      gsap.to(state, {
        value: 100,
        duration: 1.8,
        ease: "power2.inOut",
        onUpdate: function () {
          var v = Math.round(state.value);
          if (num) num.textContent = v;
          if (fill) fill.style.width = v + "%";
        },
        onComplete: function () {
          gsap.delayedCall(0.15, finish);
        }
      });
    } else {
      var v = 0;
      var t = setInterval(function () {
        v += 4;
        if (v >= 100) {
          v = 100;
          clearInterval(t);
          setTimeout(finish, 150);
        }
        if (num) num.textContent = v;
        if (fill) fill.style.width = v + "%";
      }, 30);
    }
  }

  /* ----------------------------------------------------------
     Intro (desktop) — 900vh scrubbed sequence
     ---------------------------------------------------------- */
  function initIntroDesktop() {
    if (!hasGSAP || !hasST) return;
    var scroller = document.querySelector(".section-intro .scroller");
    if (!scroller) return;
    if (window.matchMedia("(max-width: 850px)").matches) return;

    var sticky = scroller.querySelector(".intro-sticky");
    var screen1 = scroller.querySelector(".screen1");
    var screen2 = scroller.querySelector(".screen2");
    var screen3 = scroller.querySelector(".screen3");
    var frame1 = scroller.querySelector("#frame1");
    var frame2 = scroller.querySelector("#frame2");
    var imgA1 = scroller.querySelector(".morph1ImgA");
    var imgB1 = scroller.querySelector(".morph1ImgB");
    var imgA2 = scroller.querySelector(".morph2ImgA");
    var imgB2 = scroller.querySelector(".morph2ImgB");
    var leafs = scroller.querySelector(".leafs");
    var fill = scroller.querySelector(".progress-fill");
    var nums = scroller.querySelectorAll(".progress-nums span");
    var button1 = scroller.querySelector(".button1Wrap");
    var button2 = scroller.querySelector(".button2Wrap");
    var para1 = scroller.querySelector(".paragraph1");

    gsap.set([screen2, screen3], { opacity: 0 });
    gsap.set(screen2, { y: 120 });
    gsap.set(screen3, { y: 160 });
    if (para1) gsap.set(para1, { y: 60, opacity: 0 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });

    // Progress bar spans the entire scroll
    tl.to(fill, { width: "100%", ease: "none", duration: 10 }, 0);

    // Leafs slow drift
    if (leafs) {
      tl.fromTo(
        leafs,
        { scale: 1.2, rotation: 0 },
        { scale: 1.32, rotation: 3, ease: "none", duration: 10 },
        0
      );
    }

    // Frame parallax
    if (frame1) tl.fromTo(frame1, { y: 0 }, { y: -140, ease: "none", duration: 10 }, 0);
    if (frame2) tl.fromTo(frame2, { y: 60 }, { y: -220, ease: "none", duration: 10 }, 0);

    // Screen 1 → crossfade morph images
    tl.to(screen1, { opacity: 0, y: -120, duration: 1.4 }, 2.4);
    if (imgA1) tl.to(imgA1, { opacity: 0, duration: 1.2 }, 2.4);
    if (imgB1) tl.to(imgB1, { opacity: 1, duration: 1.2 }, 2.4);
    if (imgA2) tl.to(imgA2, { opacity: 0, duration: 1.2 }, 2.6);
    if (imgB2) tl.to(imgB2, { opacity: 1, duration: 1.2 }, 2.6);

    // Screen 2
    tl.to(screen2, { opacity: 1, y: 0, duration: 1.4 }, 3.2);
    tl.to(screen2, { opacity: 0, y: -140, duration: 1.4 }, 6.2);

    // Screen 3
    tl.to(screen3, { opacity: 1, y: 0, duration: 1.6 }, 7);
    if (para1) tl.to(para1, { y: 0, opacity: 1, duration: 1.2 }, 7.6);

    // Button reveals tied to their screens
    if (button1) {
      gsap.set(button1, { opacity: 0, y: 40 });
      tl.to(button1, { opacity: 1, y: 0, duration: 1 }, 0.8);
      tl.to(button1, { opacity: 0, duration: 0.6 }, 2.4);
    }
    if (button2) {
      gsap.set(button2, { opacity: 0, y: 40 });
      tl.to(button2, { opacity: 1, y: 0, duration: 1 }, 3.6);
      tl.to(button2, { opacity: 0, duration: 0.6 }, 6.2);
    }

    // Progress numbers
    function setNum(n) {
      nums.forEach(function (el, i) {
        gsap.to(el, { opacity: i === n ? 1 : 0, duration: 0.3 });
      });
    }
    ScrollTrigger.create({
      trigger: scroller,
      start: "top top",
      end: "bottom bottom",
      onUpdate: function (self) {
        var p = self.progress;
        setNum(p < 0.33 ? 0 : p < 0.66 ? 1 : 2);
      }
    });
  }

  /* ----------------------------------------------------------
     Intro (mobile) — 600vh sequence
     ---------------------------------------------------------- */
  function initIntroMobile() {
    if (!hasGSAP || !hasST) return;
    var scroller = document.querySelector(".section-intro-mobile .scroller-mobile");
    if (!scroller) return;

    var screens = [
      scroller.querySelector(".mobile-screen1"),
      scroller.querySelector(".mobile-screen2"),
      scroller.querySelector(".mobile-screen3"),
      scroller.querySelector(".mobile-screen4"),
      scroller.querySelector(".mobile-screen5")
    ].filter(Boolean);

    var nums = scroller.querySelectorAll(".progress-nums span");
    var fill = scroller.querySelector(".progress-fill");
    var cta = scroller.querySelector(".mobile-intro-cta");

    screens.forEach(function (s, i) {
      gsap.set(s, { opacity: i === 0 ? 1 : 0 });
    });
    if (cta) gsap.set(cta, { opacity: 0 });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5
      }
    });

    tl.to(fill, { width: "100%", ease: "none", duration: 5 }, 0);

    for (var i = 1; i < screens.length; i++) {
      tl.to(screens[i - 1], { opacity: 0, duration: 0.4 }, i - 0.3);
      tl.to(screens[i], { opacity: 1, duration: 0.4 }, i - 0.1);
    }
    if (cta) tl.to(cta, { opacity: 1, duration: 0.4 }, 4.2);

    ScrollTrigger.create({
      trigger: scroller,
      start: "top top",
      end: "bottom bottom",
      onUpdate: function (self) {
        var idx = Math.min(4, Math.floor(self.progress * 5));
        nums.forEach(function (el, j) {
          el.style.opacity = j === idx ? "1" : "0";
        });
      }
    });
  }

  /* ----------------------------------------------------------
     Rise sections (Location / Residences / Business / Amenities)
     ---------------------------------------------------------- */
  function initRise() {
    if (!hasGSAP || !hasST) return;

    document.querySelectorAll(".section-rise").forEach(function (section) {
      var bg = section.querySelector(".background");
      var videoWrap = section.querySelector(".videoWrap");
      var heading = section.querySelector(".hero");
      var paragraphs = section.querySelectorAll(
        ".rise__p, .rise__paragraph-col .paragraph, .business__paragraph-col .paragraph, .amenities__p"
      );

      if (bg) {
        gsap.fromTo(
          bg,
          { yPercent: -55 },
          {
            yPercent: -45,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }

      if (videoWrap) {
        gsap.fromTo(
          videoWrap,
          { y: 180, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            ease: "power3.out",
            duration: 1.4,
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (heading) {
        gsap.fromTo(
          heading,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            duration: 1.2,
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      if (paragraphs.length) {
        gsap.fromTo(
          paragraphs,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            duration: 1,
            stagger: 0.12,
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });
  }

  /* ----------------------------------------------------------
     Around — hover interaction
     ---------------------------------------------------------- */
  function initAround() {
    var list = document.getElementById("aroundList");
    var details = document.getElementById("aroundDetails");
    var image = document.getElementById("aroundImage");
    if (!list) return;

    var items = list.querySelectorAll(".around__item");
    var detailEls = details ? details.querySelectorAll(".around__detail") : [];
    var imgs = image ? image.querySelectorAll("img") : [];
    var marker = document.getElementById("aroundMarker");

    function activate(index) {
      items.forEach(function (it, i) {
        it.classList.toggle("is-active", i === index);
      });
      detailEls.forEach(function (d, i) {
        d.classList.toggle("is-active", i === index);
      });
      imgs.forEach(function (im, i) {
        im.classList.toggle("is-active", i === index);
      });

      if (marker && items[index]) {
        var itemTop = items[index].offsetTop;
        var itemH = items[index].offsetHeight;
        marker.style.height = itemH + "px";
        marker.style.transform = "translateY(" + itemTop + "px)";
        marker.style.opacity = "1";
      }
    }

    items.forEach(function (item, i) {
      item.addEventListener("mouseenter", function () {
        activate(i);
      });
    });

    activate(0);

    if (hasGSAP && hasST) {
      var section = document.querySelector(".section-around");
      var imgWrap = section ? section.querySelector(".around__image") : null;
      var content = section ? section.querySelector(".around__list-col") : null;

      if (imgWrap) {
        gsap.fromTo(
          imgWrap,
          { clipPath: "inset(0 0 0 100%)" },
          {
            clipPath: "inset(0 0 0 0%)",
            ease: "power3.inOut",
            duration: 1.4,
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
      if (content) {
        gsap.fromTo(
          content,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "power3.out",
            duration: 1.1,
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    }
  }

  /* ----------------------------------------------------------
     Residence options — scrubbed step switcher (500vh)
     ---------------------------------------------------------- */
  function initResopt() {
    if (!hasGSAP || !hasST) return;
    var root = document.getElementById("resopt");
    if (!root) return;

    var names = root.querySelectorAll(".resopt__name");
    var frames = root.querySelectorAll(".resopt__frame");
    var countEl = document.getElementById("resoptCount");
    var numEl = document.getElementById("resoptNum");
    var counts = [80, 64, 48, 26, 14];

    function show(index) {
      names.forEach(function (n, i) {
        n.classList.toggle("is-active", i === index);
      });
      frames.forEach(function (f, i) {
        f.classList.toggle("is-active", i === index);
      });
      if (countEl) {
        gsap.to(counts, {
          duration: 0.6,
          ease: "power2.out",
          onUpdate: function () {
            /* simple counter */
          }
        });
        countEl.textContent = counts[index];
      }
      if (numEl) numEl.textContent = "0" + (index + 1);
    }

    show(0);

    ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: function (self) {
        var idx = Math.min(counts.length - 1, Math.floor(self.progress * counts.length));
        show(idx);
      }
    });

    // Stage entrance
    var stage = root.querySelector(".resopt__stage");
    var info = root.querySelector(".resopt__info");
    if (stage) {
      gsap.fromTo(
        stage,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
    if (info) {
      gsap.fromTo(
        info,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }

  /* ----------------------------------------------------------
     Business / amenities option lists
     ---------------------------------------------------------- */
  function initOptionLists() {
    if (!hasGSAP || !hasST) return;

    var busopt = document.querySelector(".busopt");
    if (busopt) {
      gsap.fromTo(
        busopt.querySelectorAll(".busopt__item"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: busopt,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    var amenopt = document.querySelector(".amenopt");
    if (amenopt) {
      gsap.fromTo(
        amenopt.querySelectorAll(".amenopt__card"),
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: amenopt,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }

  /* ----------------------------------------------------------
     Roots — parallax collage (desktop)
     ---------------------------------------------------------- */
  function initRoots() {
    if (!hasGSAP || !hasST) return;
    var section = document.querySelector(".section-roots .roots");
    if (!section) return;
    if (window.matchMedia("(max-width: 850px)").matches) return;

    var img3 = document.getElementById("rootsImg3");
    var img2 = document.getElementById("rootsImg2");
    var img1 = document.getElementById("rootsImg1");
    var title = section.querySelector(".roots__title");
    var paragraph = section.querySelector(".roots__paragraph");

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=160%",
        scrub: 0.6,
        pin: false
      }
    });

    if (img3) tl.fromTo(img3, { y: 160 }, { y: -160, ease: "none" }, 0);
    if (img2) tl.fromTo(img2, { y: 220 }, { y: -220, ease: "none" }, 0);
    if (img1) tl.fromTo(img1, { y: 300 }, { y: -120, ease: "none" }, 0);
    if (title) {
      gsap.fromTo(
        title,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
    if (paragraph) {
      gsap.fromTo(
        paragraph,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: paragraph,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }

  /* ----------------------------------------------------------
     Roots (mobile)
     ---------------------------------------------------------- */
  function initRootsMobile() {
    if (!hasGSAP || !hasST) return;
    var scroller = document.querySelector(".roots-scroller");
    if (!scroller) return;

    var s1 = scroller.querySelector(".roots-screen1");
    var s2 = scroller.querySelector(".roots-screen2");
    var fill = scroller.querySelector(".progress-fill");

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5
      }
    });

    tl.to(fill, { width: "100%", ease: "none", duration: 2 }, 0);
    tl.to(s1, { opacity: 0, duration: 0.5 }, 1.2);
    tl.to(s2, { opacity: 1, duration: 0.5 }, 1.4);
  }

  /* ----------------------------------------------------------
     Horizontal panorama
     ---------------------------------------------------------- */
  function initHorizontal() {
    if (!hasGSAP || !hasST) return;
    var section = document.querySelector(".section-horizontal .horizontal");
    if (!section) return;

    var img = section.querySelector(".horizontal-image");
    var markers = section.querySelector(".horizontal-markers");
    var left = section.querySelector(".horizontal__reveal--left");
    var right = section.querySelector(".horizontal__reveal--right");
    var heading = section.querySelector(".horizontal__heading-wrap");

    // Curtain-open reveal on enter
    var intro = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });
    if (left) intro.to(left, { xPercent: -100, duration: 1.4, ease: "power4.inOut" }, 0);
    if (right) intro.to(right, { xPercent: 100, duration: 1.4, ease: "power4.inOut" }, 0);
    if (heading) intro.fromTo(heading, { opacity: 0 }, { opacity: 1, duration: 1 }, 0.6);

    // Pinned horizontal pan
    function pan() {
      if (!img) return;
      var distance = Math.max(0, img.offsetWidth - window.innerWidth);
      gsap.to(img, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=" + Math.max(window.innerHeight * 2, distance),
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      if (markers) {
        gsap.to(markers, {
          x: -distance * 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=" + Math.max(window.innerHeight * 2, distance),
            scrub: 0.5,
            invalidateOnRefresh: true
          }
        });
      }
    }

    if (img.complete) {
      pan();
    } else {
      img.addEventListener("load", pan, { once: true });
    }
  }

  /* ----------------------------------------------------------
     Installment
     ---------------------------------------------------------- */
  function initInstallment() {
    if (!hasGSAP || !hasST) return;
    var section = document.querySelector(".section-installment .installment");
    if (!section) return;

    var image = section.querySelector(".installment-reveal-image");
    var card = section.querySelector(".installment__card");
    var parallax = section.querySelectorAll(".installment-parallax");

    if (image) {
      gsap.fromTo(
        image,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "power3.inOut",
          duration: 1.5,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    if (card) {
      gsap.fromTo(
        card,
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    if (parallax.length) {
      parallax.forEach(function (p) {
        gsap.fromTo(
          p,
          { y: "-42%" },
          {
            y: "-58%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      });
    }
  }

  /* ----------------------------------------------------------
     Footer reveals + scene parallax
     ---------------------------------------------------------- */
  function initFooter() {
    var footer = document.querySelector(".footer");
    if (!footer) return;

    var fades = footer.querySelectorAll(".fadeElement");
    if (hasGSAP && hasST && fades.length) {
      gsap.to(fades, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footer.querySelector(".footer__content"),
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });
    } else {
      fades.forEach(function (f) {
        f.classList.add("is-visible");
      });
    }

    if (!hasGSAP || !hasST) return;

    var front = footer.querySelector(".footer__scene .front");
    var treeL = footer.querySelector(".footer__tree-l");
    var treeR = footer.querySelector(".footer__tree-r");
    var scene = footer.querySelector(".footer__scene");

    if (front && scene) {
      gsap.fromTo(
        front,
        { y: 120 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
          }
        }
      );
    }
    if (treeL) {
      gsap.fromTo(
        treeL,
        { y: 200 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
          }
        }
      );
    }
    if (treeR) {
      gsap.fromTo(
        treeR,
        { y: 240 },
        {
          y: -20,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true
          }
        }
      );
    }
  }

  /* ----------------------------------------------------------
     Boot
     ---------------------------------------------------------- */
  function boot() {
    initLenis();
    initAnchors();
    initVideos();
    initMenu();
    initForm();

    initLoader(function () {
      initIntroDesktop();
      initIntroMobile();
      initRise();
      initAround();
      initResopt();
      initOptionLists();
      initRoots();
      initRootsMobile();
      initHorizontal();
      initInstallment();
      initFooter();
      if (hasST) {
        requestAnimationFrame(function () {
          ScrollTrigger.refresh();
        });
      }
    });

    window.addEventListener("load", function () {
      if (hasST) ScrollTrigger.refresh();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
