# Colonia Zacamil — Static Clone (design study)

A faithful, self-contained static rebuild of the Awwwards **Site of the Day** “Colonia Zacamil”.

- **Original site:** https://coloniazacamil.com/ (by Adoratorio Studio — Nuxt + Three.js + GSAP)
- **Awwwards page:** https://www.awwwards.com/sites/colonia-zacamil
- **Credit:** all design, copy, imagery and type belong to the original authors. This clone is a non-commercial study of layout, typography and motion. Real assets (aerial photo, fonts) were hot-linked from the original CDN into local `assets/`; everything else was recreated from scratch.

## How to open

No build step, no server, no APIs. Either:

1. Double-click / open `index.html` directly in a browser, or
2. Serve the folder statically, e.g. `python3 -m http.server` and visit `http://localhost:8000`.

Internet is needed **only** for the GSAP CDN (`gsap.min.js` + `ScrollTrigger.min.js`); if offline, the page still renders, minus entrance/scroll animation.

## What was faithfully reproduced

- Bone background `#EBE6E0`, exact font stack (**Heathergreen** display, **Reckless Neue** serif, **Roboto Mono** UI) with real `woff2` files in `assets/fonts/`.
- Hero composition from the reference screenshot: `FLY — TO — [aerial pill 1080/210, 18px radius] — [powered by CMS] ZACAMIL`, Discover pill button with dot, bottom serif tagline, fixed footer `[powered by CMS]` / `[en / es]`.
- The real aerial photograph (`assets/images/background.jpg`) as the pill image; real `after.png` chip; pixel-logo concept and custom crosshair cursor SVG.
- All 29 pins with real names, gold `#B48E46` clickable / lilac `#8D7CAB` archive / wine `#8D3A55` court-park colors, hover-expand pill behavior with the original `.645,.045,.355,1` curve.
- Tutorial overlay copy (swipe/click-drag, pinch/scroll, click-the-pins), day/night + present/past toggles, `en/es` language swap, detail drawer, preloader with counter → clip-path morph.
- GSAP + ScrollTrigger from CDN: staggered hero reveal, pill parallax scrub, batched story-card entrances, drawer/camera-style tweens.

## What was approximated

- The **real-time Three.js 3D model** (`model.glb`, ~MBs, plus per-mural videos) is replaced by a pannable/zoomable (drag + wheel + pinch) high-res aerial photo inside the expanding pill — same framing and interaction grammar, flat instead of volumetric.
- Pin positions are hand-placed `%` coordinates over the photo, not 3D projections; story texts are short study stand-ins, not the original CMS video content.
- Audio, Lenis smooth-scroll, iubenda/gtag scripts and the before/after image slider are represented by static or simplified equivalents (`past` mode = grayscale treatment).
- The below-fold “murals grid + about” section is an addition to demonstrate ScrollTrigger on a static page; the original is a single-screen app.

## Structure

```
index.html  css/tokens.css  css/base.css  css/hero.css  css/explore.css
js/data.js  js/app.js  assets/images/  assets/fonts/  source.html  screenshots/original.png
```
