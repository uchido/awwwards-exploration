# Nick Ho — Awwwards Study Clone

Faithful static rebuild of **Nick Ho – Dutch Racing Driver** (Porsche Carrera Cup) for design study.

- Original: https://nickho-motorsports.nl/
- Awwwards: https://www.awwwards.com/sites/nick-ho
- Credit: all design, copy, and imagery © the original authors / Nick Ho Motorsports. This clone is a non-commercial study.

## How to open
No build step. Either:
1. Double-click / open `index.html` directly in a browser, or
2. Serve locally: `python3 -m http.server` in this folder → http://localhost:8000/

Internet is only needed for the GSAP CDN + Google Fonts; everything else (images, CSS, JS) is local.

## Structure
```
index.html  — rebuilt page
css/base.css, css/layout.css, css/animations.css
js/main.js (loader, nav, counters, countdown, cursor, gallery, form)
js/animations.js (GSAP + ScrollTrigger)
assets/*.avif, logo.png, favicon.png
source.html, screenshots/original.png (reference, not used at runtime)
```

## Faithfully reproduced
- Dark cinematic hero: layered bg + car + transparent driver cutout, giant ANTON "NICK HO", #98 numeral, stats (98 / 17 / 14), Rotterdam / 10+ / 21 meta, countdown bar, grid hairlines, mouse-depth parallax + scroll parallax.
- Yellow `#FED60A` system: loader count-up, marquee, tags, CTA, cursor pill, selection.
- Typography: Anton display + Helvetica/Inter body, uppercase kickers, fluid sizing.
- History sticky chapters (Foundation → Pole Position) with image swap on scroll.
- Media drag-row, 2026 calendar (10 races) with drifting car, sponsor wall, gallery switcher, black CONTACT footer with form.
- GSAP + ScrollTrigger via the required CDN; reveals, parallax, scrub effects.

## Approximated / simplified
- Original Three.js depth-map displacement + Bunny HLS video bg → static layered parallax (same composition, no WebGL/video).
- Custom odometer roller + SplitText + Lenis smooth scroll → CSS/GSAP counters, native scroll, countdown timer.
- Radial circular gallery slider → simplified grid + click-to-swap viewer.
- Sponsor SVGs → typographic badges (same grid/offsets); Webflow form → demo front-end-only form; Finsweet/Slater/gtag integrations omitted.
- Some responsive breakpoints and exact `rem` fluid coefficients simplified to `clamp()` equivalents.
