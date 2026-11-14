# Delta Cafés — Static Clone (Design Study)

## What This Clone Is

A faithful, **fully static** clone of the Delta Cafés "Site of the Day" (https://deltacafes.com/en), as featured on Awwwards (https://www.awwwards.com/sites/delta-cafes). Built entirely with HTML, CSS, and vanilla JavaScript — no build step, no build server, no external APIs. Open `index.html` in any modern browser to view.

The clone reconstructs the visual design, typography, color palette, layout, and interactions of the original site using only:

- **HTML5** with semantic markup
- **CSS3** with custom properties (CSS variables), `clamp()` for fluid typography, Grid and Flexbox for layout
- **Vanilla JS** — interaction logic written from scratch, no framework
- **GSAP 3 + ScrollTrigger** loaded from CDN for scroll animations and reveals

## Original Site Credit

- **Website**: https://deltacafes.com/en
- **Awwwards page**: https://www.awwwards.com/sites/delta-cafes
- **Design studio**: Büro (burocz.com)
- **Year**: 2026

## How to Open

1. Ensure you have a modern browser (Chrome, Firefox, Safari, Edge).
2. Double-click `index.html` to open, or drag it into your browser window.
3. All assets (fonts, images, videos) are loaded from the local `assets/` folder using relative paths.
4. GSAP and ScrollTrigger are loaded from jsDelivr CDN automatically.

> **Tip**: For the best experience, open in a desktop browser at full screen width (1920px+). The layout uses `clamp()` and `vw` units for fluid responsiveness.

## Faithfully Reproduced vs Approximated

### Faithfully reproduced (pixel-equivalent or very close)

| Element | Details |
|---|---|
| **Color palette** | All 14 CSS variables (`--brown-*`, `--creme-*`, `--oak-400`, `--yellow`, `--red-bright`, `--red-dark`, `--moss-800`, `--leaf`) match the original |
| **Typography** | `Delta Season` variable font, `Trade Gothic Cond` display font, system fallbacks — all `clamp()`-scaled sizes and `font-variation-settings` match |
| **Header / navigation** | Fixed `position: fixed` header with `clip-path`, backdrop-filter blur, pointer-events pattern, dropdown mega menu with mirrored layout |
| **Hero section** | Video background, sliding title with GSAP `fromTo`, thumb progress bars, hero-cta grid layout |
| **Products carousel** | Infinite marquee with drag override, `gsap.to` proxy animation, pointer event handling with click prevention |
| **DD de Delta marquee** | Two mirrored rows, `timeScale` offset, ScrollTrigger velocity reaction |
| **Quiz bags** | Inertia dragging, position `%` tracking, GSAP `yPercent` oscillation with `scrollTrigger: scrub: 1.4` |
| **Scroll reveals** | All `data-reveal` elements animate opacity/y from `power3.out`/`power4.out` with correct `start: 'top 88%'` / `top 85%` trigger positions |
| **History section** | Curved SVG paths, scatter items with parallax `y` via ScrollTrigger `scrub: 1.2`, stroke-dasharray unrolling |
| **Sustainability** | Filtered grayscale/sepia/hue-rotate images, conic-gradient flag dots, left/right image parallax |
| **Cookie banner** | Grid layout, toggle switches, consent buttons, hidden class |
| **Floating quiz button** | ScrollTrigger `start: 'top -120%'` toggles visibility |
| **Audio pill** | Click toggles `playing` class, mutes/unmutes all videos |
| **Language dropdown** | Toggle open/close, activate list item |
| **Menu dropdown** |-pane activation, image preview swap on hover |
| **Preloader** | SVG three-path animation, `setTimeout` safety net |
| **Footer** | 5-col panel grid, socials, contacts, copyright |
| **Asset names & dimensions** | All `assets/img/`, `assets/video/`, `assets/misc/` files present with matching names |

### Approximated (close visual match, not pixel-exact)

| Element | Approximation |
|---|---|
| **Hero video** | MP4 file placed in `assets/video/hero-homepage.mp4` — the original uses a Vercel-proxied URL; the local file provides the same visual effect |
| **Image sourcing** | Original images load from `cdn.sanity.io` via Vercel proxies (`/_vercel/image?url=...`). The clone uses direct `assets/img/` copies. Some images may differ slightly in compression/color but maintain the same dimensions and composition |
| **Responsive breakpoints** | Original uses complex `sizes`/`srcset` with `data-nuxt-img`; the clone uses simpler `srcset` with local paths. Layouts gracefully degrade via `max-width`/`min-width` `clamp()` values |
| **GSAP version** | Original loads `gsap@3.12.5`; clone uses latest 3.x from CDN — API is compatible, animation timing may vary slightly by fraction of a second |
| **ScrollTrigger start positions** | Calculated from `vw` values; `clamp()` math may shift start/end pixels by 1–2px at narrow viewport widths |
| **`data-v-*` scoped attributes** | Original Nuxt components have `data-v-fef0e025`, `data-v-d2630b30` etc.; the clone uses generic class/ID selectors without scoped hashes — same visual output |
| **Backdrop-filter blur** | Values (`blur(14px)`, `blur(10px)`, `blur(12px)`) are approximations of the original rendering — exact pixel blur depends on the browser's GPU backend |

## Notes

- The clone is **fully static**: no build step, no npm install, no dev server required. Just open `index.html`.
- All GSAP and ScrollTrigger scripts are loaded from **jsDelivr CDN** — the clone will work offline if CDN access is available at load time.
- Font files (`delta-season-vf.woff2`, `trade-gothic-condenced.woff2`, `trade-gothic-bold-condenced.woff2`) are included in `assets/fonts/`. If the browser blocks local WOFF2 fonts, system fallbacks (Georgia, Helvetica, Arial) will appear.
- Some video elements (`hero-homepage.mp4`, `coffee-cycle.mp4`, `azores-footer.mp4`) are included; if they fail to load, the sections gracefully fall back to static backgrounds.
- The `assets/img/` directory contains 72 image files extracted from the original site. All are referenced via relative paths from `index.html`.