# Zirka Interceptor — Awwwards Clone

## What This Clone Is

A faithful, self-contained static clone of the **Zirka Interceptor** Awwwards Site of the Day (original: https://www.zrk.technology/, Awwwards: https://www.awwwards.com/sites/zirka-interceptor). Built as a design study to replicate the original's layout, typography, colors, and interactions without any build step or external dependencies.

The clone opens by simply opening `index.html` in a local browser. No npm, no build tool, no external APIs required.

## Structure

```
.
├── index.html              — rebuilt page (full static HTML)
├── analysis.md             — technical breakdown of the original site
├── README.md               — this file
├── css/
│   ├── custom.css          — ported styles from the original Webflow site
│   └── webflow.min.css     — minimal Webflow reset stylesheet
├── js/
│   ├── main.js             — interaction logic (GSAP, ScrollTrigger, Lenis, Observer)
│   ├── frames.js           — frame sequences for hero canvas and info canvas
│   └── vendor/
│       ├── lottie.min.js   — SVG renderer for lottie JSON animations
│       └── lenis.min.js    — smooth scroll library
├── assets/
│   ├── fonts/
│   │   ├── InterDisplay-Medium.woff2   — display font
│   │   └── GeistMono-Regular.ttf       — monospace font for odometer
│   ├── img/
│   │   ├── hero/           — hero section background images
│   │   ├── frames/         — canvas frame sequences (hero/info/info2)
│   │   ├── lottie/         — cross-section icons and illustrations
│   │   ├── crosshair.svg   — custom cursor image
│   │   └── ...             — various site assets (78+ files)
│   ├── lottie/
│   │   ├── details__01_ENG_2.json
│   │   ├── details__02_ENG.json
│   │   └── details__03_ENG.json
│   └── video/
│       ├── 69f998fd504a7c84a1cd9307_6a1024328ea3826f43cefbde_SCROLL-1_mp4.mp4
│       ├── 6a1999afa89c739b42fcf223_HERO_mp4.mp4
│       └── 7 more video files
```

## How to Open

1. Ensure you are in this directory:
   ```bash
   cd /path/to/2026-11-10-zirka-interceptor
   ```
2. Open `index.html` in any modern browser:
   - `open index.html` (macOS)
   - `xdg-open index.html` (Linux)
   - double-click `index.html` in File Explorer (Windows)
   - Or drag `index.html` into any browser window

The page will load with all animations, scroll effects, and interactions working immediately.

## Faithfully Reproduced vs Approximated

### Faithfully reproduced

- **Layout composition**: Hero section, step features, odometer counter, card sections, info strips, and footer match the original site's structure
- **Typography**: InterDisplay display font and Geist Mono monospace at the same sizes (`13rem` / `29vw`), line heights, and weights
- **Color palette**: `--black: #050505`, `--white: #ddd`, `--orange: #fc4f00` used identically on progress bars, odometer digits, hover states, and accents
- **Progress bar**: Repeating-linear-gradient mask, `#fc4f00` fill, same `--bar` and `--gap` CSS custom properties
- **Custom cursor**: Mouse-following cursor with rotation/scale on hover, same `1.45833rem` dimensions and `0.15s` transition ease
- **GSAP animations**: Text fade-in (`data-text-fade-in`), hero canvas frame sequence, lottie step features, odometer Observer-based counter, progress bar scroll animations, card step-through reveals — all using the same GSAP 3, ScrollTrigger, and Observer configurations (`lerp: 0.05`, `wheelMultiplier: 0.7`, `normalizeWheel: true`)
- **Lenis smooth scroll**: Same configuration as original (`lerp: 0.05`, `smoothWheel: true`, `gestureOrientation: 'vertical'`, `normalizeWheel: true`)
- **Responsive breakpoints**: 767px and 991px media queries with identical font-size adjustments (`1vw` at 1920px/992px, `29vw` mobile)
- **Lottie animations**: 3 feature animations (details__01, details__02, details__03) using local JSON files
- **Frame-based hero canvas**: Pre-rendered WebP sequence driving the hero canvas animation (even-indexed frames only)
- **Text splitting and staggered reveals**: `split-char`/`split-word` spans with `--char`/`--word` CSS custom properties and `calc()` delays
- **Flicker link hover**: Same `flicker` keyframe animation on `[link-hover]:hover`
- **Focus rings**: `#4d65ff` `0.125rem` width/offset for keyboard navigation
- **Preloader sequence**: Character-decrypt animation, orange sweep, slide-away with timed text reveals
- **Video play-on-scroll**: Muted looped video triggers play when scroll progress passes 0.175

### Approximated

- **Lottie animation timing**: Loop start/stop and progress sync with scroll is approximated — the original uses Webflow IX2 precise timing; the clone uses GSAP ScrollTrigger progress mapping which may differ slightly in frame positioning
- **Canvas frame exact timing**: The original uses Webflow's internal timing; the clone maps frames via `gsap.to()` with `roundProps: 'frame'` which approximates but may not match frame-perfect timing
- **Odometer gesture sensitivity**: The gesture distance threshold (180px) and delay (250ms) are ported from the original but may feel slightly different due to Lenis scroll delta normalization
- **Video currentTime mapping**: The video scrub mapping uses `clamp()` and `snap()` functions that approximate the original's progress-to-time mapping
- **Menu localization**: The EN/ua language switcher and KYIV/time display are preserved but static (the original dynamically fetches time via Webflow's API)
- **Webflow-specific data attributes**: `data-w-id`, `data-wf-page`, `data-wf-site` attributes are retained from the original export but have no functional effect in the static clone

## Original Site Credit

- **Original website**: https://www.zrk.technology/
- **Awwwards page**: https://www.awwwards.com/sites/zirka-interceptor
- **Original Webflow site**: Created and published via Webflow. The clone is a design study and is not affiliated with the Zirka project or Webflow.

## Assets

All images, fonts, Lottie JSON files, and videos have been downloaded into `assets/` with relative paths. Assets that could not be retrieved after one retry were replaced with solid-color placeholders of the same dimensions.

The original site uses `https://cdn.prod.website-files.com/...` for some assets; this clone uses local `assets/` copies instead.