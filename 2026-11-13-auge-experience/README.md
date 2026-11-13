# AUGE Experience — Static Clone

A faithful, fully static, self-contained rebuild of the homepage of
**[AUGE Experience](https://auge-xp.com/)** — independent digital experience studio,
*Awwwards Site of the Day* — created for design study only. No build step, no external
APIs, no tracking: open `index.html` directly in a browser.

> All credit for the design, imagery, copy and fonts belongs to
> **AUGE Experience** (https://www.auge-xp.com/). This clone was produced purely as a
> technical/design study and should not be published or used commercially.

## How to open

Open `index.html` in any modern browser (double-click, or `python3 -m http.server` and
visit `http://localhost:8000`). Fonts, images and GSAP (CDN) are the only external
references; the page also works offline except for the GSAP CDN scripts.

```
index.html          the rebuilt page
css/main.css        tokens + layout + components (values extracted from the live build)
js/main.js          GSAP-driven loader, carousel, scramble, menu, cursor
assets/fonts/       real woff2 fonts downloaded from the original build
assets/img/         real project covers downloaded from the original Prismic CDN
assets/logo.svg     real logo mark
analysis.md         technical breakdown of the original site
source.html         captured live HTML of the original (reference)
screenshots/        reference full-page screenshot of the original
```

## What was faithfully reproduced

* **Design tokens verbatim** from the original Next.js build CSS:
  `#edeee5` background, `#000` ink, `#fdf48b` accent, `max(20px, 2.08333vw)` gutters,
  `max(10px, 1.04167vw)` grid gap, the full `--text-content-*` type scale.
* **Real fonts** — Greed Bold, PP Neue Montreal Regular/Medium, Farnham Display Light Italic
  (woff2 files served by the original).
* **Layout measured off the live 1920×1080 render**: 60vh card carousel / 40vh base band,
  uniform 29vw × 42vh cards, caption metrics (37px Greed titles, line pitch 32px),
  pitch column at grid column 8 (x = 1125 @1920), wordmark baseline 106px above the
  viewport bottom, legal/social rows, 60×40 menu button position.
* **All seven projects** with correct names, line breaks, categories and real cover images
  (Viru Group, Maison AUGE, AC40 Lunarossa, Don Molinico, Mr. Mold, Il Capo Production,
  Maxima Ferrarelle).
* **Preloader**: black arc backdrop, `AUGE` (Greed) + `Experience` (Farnham italic),
  percent counter, ellipse "arc-wipe" reveal (`border-radius: 50% / 299px` mask scaled out).
* **Infinite virtual-scroll carousel** (wheel + pointer drag + inertia, seamless wrap of a
  duplicated list, velocity skew + image parallax), like the original's GL-driven loop.
* **Text scramble decode**: the DOM cipher `RCCS YFZVYTYHHV©` resolves to
  `AUGE EXPERIENCE©` on load.
* **Reveal choreography**: masked title/category line reveals, image scale settle,
  wordmark letter rise, pitch fade-up.
* **Expanding menu**: the 60×40 accent-bar button grows into a black panel with 38px
  `Works / About / Let's talk` links, staggered clip reveal, yellow hover wipe, close ✕.
* **Custom cursor**: 11px accent diamond (45°, `mix-blend-difference`), magnetic follow,
  scale on interactive targets; native cursor hidden on fine pointers only.
* **Letter-push hover** on the giant AUGE wordmark; **sound toggle** (wave/cross icon
  states) in the legal row; difference-blend logo.
* Semantics kept from the original: `sr-only` real heading + visible cipher, `role="img"`
  wordmark, footer texts (`© 2026 - P.IVA 14298400962 | PRIVACY | COOKIES`).

## What was approximated

* **WebGL rendering** → DOM/CSS transforms. The original draws cards, captions, wordmark
  and even footer text on a WebGL canvas with custom shaders (soft alpha edges between
  covers, GL text scramble, shared-element page transitions). The clone reproduces the
  visual result with `translate3d`, GSAP eases and clip-paths instead of a GL engine.
* The carousel's exact physics constants (lerp factor, drag gain) and per-card alpha edge
  blending are approximations tuned by eye.
* Project **videos** (Vimeo progressive MP4 thumbnails for some cards) → static poster
  images, as on first paint of the original.
* Page-transition **curtain + shared-element morph** to subpages is out of scope (single
  page clone); the arc-mask mechanism is implemented for the preloader only. Links to
  `/works`, `/about`, `/contacts` are inert.
* Cookiebot consent banner, Google Analytics, GA/rotate-gate scripts are intentionally
  omitted (third-party chrome, not part of the design).
* The loader's exact percent-curve and the logo's 4-layer GL flicker echo are simplified.
* `prefers-reduced-motion` and touch/flat fallbacks are respected but simplified.
