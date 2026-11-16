// Santalarch Clone - JS with GSAP + ScrollTrigger
// GSAP and ScrollTrigger loaded from CDN in index.html

document.addEventListener("DOMContentLoaded", function () {
  // Ticker animation
  const ticker = document.getElementById("ticker");
  if (ticker) {
    gsap.fromTo(
      ticker,
      { x: 0 },
      { x: -100, duration: 20, ease: "none", repeat: -1 }
    );
  }

  // Preloader hide
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.display = "none";
    }, 2500);
  }

  // Scroll-triggered reveals
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach((el) => {
    gsap.set(el, { opacity: 0, y: 50 });
    ScrollTrigger.trigger = el; // will be set below
    new ScrollTrigger({
      trigger: el,
      start: "top 80%",
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
      },
    });
  });

  // Hover effects for .button-inner .button-text:last-child
  const buttonTexts = document.querySelectorAll(".button-text:last-child");
  buttonTexts.forEach((el) => {
    el.style.clipPath = "inset(-50% 0 -50% 0)";
    el.addEventListener("mouseenter", () => {
      el.style.clipPath = "inset(-50% 100% -50% 0)";
    });
    el.addEventListener("mouseleave", () => {
      el.style.clipPath = "inset(-50% 0 -50% 0)";
    });
  });

  // Invert button rotation
  const invertButton = document.getElementById("invertButton");
  if (invertButton) {
    let isActive = false;
    invertButton.addEventListener("click", () => {
      isActive = !isActive;
      const dot = document.querySelector(".dot-orbit");
      if (dot) {
        dot.style.transform = isActive ? "rotate(180deg)" : "rotate(0deg)";
      }
    });
  }

  // Cookie consent buttons
  const cookieButtons = document.querySelectorAll(".cookies-action");
  cookieButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cookies = document.querySelector(".cookies");
      if (cookies) {
        cookies.style.opacity = "0";
        setTimeout(() => { cookies.style.display = "none"; }, 300);
      }
    });
  });

  // Mobile menu toggle
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      nav.classList.toggle("active");
    });
  }
});