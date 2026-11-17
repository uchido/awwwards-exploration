# Bulletproof Site Clone — Technical Analysis

## Original Site: https://www.wearebulletproof.com/
### Awwwards Page: https://www.awwwards.com/sites/bulletproof

## Stack

The original site is built on **Webflow**, a visual web design and development platform. Evidence from the source HTML includes:

- Webflow-specific data attributes: `data-wf-domain`, `data-wf-page`, `data-wf-site`
- Webified asset CDN paths: `https://cdn.prod.website-files.com/6655d17bde45e7c5345bbc05/...`
- Webfont embedding via Webflow's asset management
- Embedded third-party scripts (Google Tag Manager, Meta Pixel, LinkedIn Insight, Twitter/X Pixel, cookie consent)
- CMS-driven dynamic lists (`w-dyn-list`, `w-dyn-items`, `w-dyn-item`)
- Interactions and animations configured within the Webflow Designer, exported as minified CSS and JS
- The `webflow.js` script (`https://cdn.prod.website-files.com/.../bulletproof-2024.webflow.shared.c70006e34.min.css`) is the core Webflow runtime

For this clone, all Webflow-specific infrastructure has been stripped away and replaced with a **fully static HTML/CSS/JS implementation** using GSAP for animations and ScrollTrigger for scroll-driven triggers, loaded from CDN.

## Layout System

The layout is based on a **flexbox/grid hybrid system** with the following characteristics:

- **Viewport-relative typography**: Most sizes use `vw` units (e.g., `15vw` for h1, `6vw` for h4, `2vw` for body text), allowing type to scale with window width
- **Mixed fixed/scalable containers**: Some elements use fixed `vw` widths (e.g., `.work-poster` width: `25vw`), while others use percentage-based widths
- **Sticky positioning**: The work section uses `position: sticky` with `top: 0` and `height: 100vh` to create a pinned navigation effect
- **Full-viewport height sections**: `height: 100vh` and `height: 100dvh` are used for hero and intro sections
- **CSS Clip Path**: The hero background uses `clip-path: inset(100% 0px 0px 0px)` and other clip-path effects for reveal animations
- **Marquee animations**: Location titles use CSS `animation` with `transform: translateX()` for infinite scrolling marquees
- **Aspect-ratio grids**: The work grid uses `aspect-ratio` values (4/3, 1/1, 1.85/1) with `nth-child(8n+X)` selectors to distribute styles
- **Overscroll/scroll behavior**: `overscroll-behavior: none` and `-ms-scroll-chaining: none` prevent scroll chaining; `scrollbar-width: none` hides scrollbars

The clone replicates this using standard CSS flexbox, with `position: sticky` for the work slider pin, and GSAP/ScrollTrigger driving scroll-based animations instead of Webflow's built-in interactions.

## Typography

**Primary font: `Sequel Sans`** (a display/sans-serif typeface), with `Mixta Pro` for body text. Font faces are defined via `@font-face` with WOFF2 format and `font-display: swap`.

Key typography scales extracted from the original:

| Element | Font Family | Size | Line-Height | Notes |
|---------|------------|------|-----------|-------|
| `h-h1` | Sequel Sans Book | `15vw` (desktop) / `14vw` (mobile) / `8.4vw` (md) / `10vw` (tablet) / `37vw` (mobile) | `.7` / `.8` | `font-weight: 400`; `letter-spacing: -.09em`; `text-transform: uppercase` |
| `h-h1.default` | Sequel Sans Book | `7.6vw` / `8.4vw` / `10vw` | `.8` | Slightly smaller; `letter-spacing: -.09em` |
| `h-h2` | Sequel Sans | `8.5vw` / `9.5vw` / `7.4vw` / `4.4vw` | `.825` | `letter-spacing: -.01em`; `text-transform: uppercase` |
| `h-h3` / `h-h6` | Sequel Sans / Mixta Pro | `2vw` / `2.6vw` / `4vw` / `1.8vw` / `2.2vw` / `3vw` | varies | Mixta Pro Light Italic for body text; `letter-spacing: -.07em` to `-.04em` |
| `h-h4` | Sequel Sans Book | `6vw` / `7vw` / `10vw` / `3.4vw` | `4.3vw` / `7vw` / `5vw` | `letter-spacing: -.08em`; `text-transform: uppercase`; `.is--pink` variant uses `#e995a3` |
| Body text | Sequel Sans Book | `14px` / `1.5vw` / `3vw` | `20px` / `1.4` / `1.5vw` | `line-height: 20px` base; `letter-spacing: -.02em` |
| Eyebrow | Sequel Sans Medium | `.8vw` / `3.4vw` / `1vw` / `1.6vw` | `1vw` | `letter-spacing: -.02em`; `text-transform: uppercase` |

The clone uses identical font families, sizes, line-heights, letter-spacing, and text-transform values. The `font-display: swap` ensures no FOUC (Flash of Unstyled Text).

**Color-treated text**: `.h-h4.is--pink` uses `--craft-pink: #e995a3`; `.is-white` variants switch to `--analog-white: #f1f1f1`.

## Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--real-black` | `#181713` | Primary background text; navbar dark mode; button borders |
| `--analog-white` | `#f1f1f1` | Light text; button backgrounds; placeholder color |
| `--craft-pink` | `#e995a3` | Accent color for `.is--pink` variants; CTA highlights |
| `--m-grey` | `#646464` | Muted text color; hover states |
| `--white` | `#fff` | Standard white text |
| `--light-slate` | `#eee` | Light border/subtle backgrounds |
| `--footer-size` | `54vw` | Footer height factor |
| `--nav-h` | `2vw` | Navbar height |

The `html { background-color: #1D1D1B }` from the original is approximated by the body's `--real-black` (#181713), which is the dark base used across most of the site. The slight difference (~0.5% luminance) is imperceptible in context.

All colors are defined as CSS custom properties (variables) in `:root` for easy theming and consistency.

## Animation Techniques (GSAP & ScrollTrigger)

The original site uses a combination of **Webflow native animations** and **GSAP** for more complex sequences. This clone replaces Webflow's runtime with direct GSAP + ScrollTrigger from CDN.

### GSAP Usage in the Original (inferred from source HTML/CSS)

- **Timelines**: The hero entrance uses a GSAP timeline (`heroTl`) sequencing multiple reveals: gradient scale, heading fade/translate, background image scale
- **Ken-burns/parallax**: `.hero_kenburns` gets `gsap.to()` with `scale: 1.08`, `duration: 18`, `yoyo: true`, `repeat: -1` for a slow zoom effect
- **ScrollTrigger reveals**: Elements with `data-reveal-line` are animated from `yPercent: 110` to `0` when scrolling past `top 88%`, using `once: true`
- **Section-based theme swapping**: ScrollTrigger toggles `.navbar.is-light-mode` based on scroll position relative to `.section.intro` and `.section.is-home__work`
- **Pinned slider**: The work slider (`#work-slider`) is pinned via `ScrollTrigger.create({ trigger: slider, start: 'top top', end: 'bottom bottom' })`; slides toggle `.active` class based on progress, and parallax `yPercent` shifts are applied to background images
- **Staggered reveals**: Work list items and news cards use `gsap.from()` with `stagger: 0.05`/`0.08` and `scrollTrigger: { trigger: ..., start: 'top 60%', once: true }`
- **Footer parallax**: `gsap.fromTo()` with `scrub: true` links `#footer` and `.footer-b-box img` y-position to scroll position
- **Drag scroll**: News slider uses manual `mousedene/mousemove/mouseup` to control `scrollLeft` with a `1.4x` velocity multiplier
- **Marquee CSS**: Location marquees use `@keyframes` with `transform: translateX(-50%)` and `linear` infinite animation
- **Hover transitions**: `.lisiting-item:hover .cover_img` uses `transform: scale(1.05)` and `filter: saturate(0)` over `800ms` with `cubic-bezier(0.19, 1, 0.22, 1)`

### GSAP Configuration in the Clone

The clone's `js/main.js` replicates the key behaviors:

- `gsap.registerPlugin(ScrollTrigger)` at load
- `reduceMotion` check via `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Hero timeline with custom easings matching the site's `cubic-bezier(0.19, 1, 0.22, 1)` transition function
- ScrollTrigger-pinned work slider with active slide tracking and parallax image shifts
- Reveal-line animations using ScrollTrigger `once: true`
- Navbar light/dark theme swapping on scroll
- Work-list poster preview on mouseenter/mouseleave
- News drag-scroll with manual control
- Footer parallax reveals with `scrub: true`
- ScrollTrigger.refresh() on window `load` event

A notable difference: the original uses Webflow's built-in animation system for some effects (modals, button hovers, etc.), while this clone reimplements the most visible/impactful scroll-driven and entrance animations using GSAP/ScrollTrigger directly.

## Notable Implementation Details

1. **Clip-path reveals**: The hero background uses `clip-path: inset(100% 0px 0px 0px)` animated via GSAP; the intro video has `.bg-img-wrap{clip-path:inset(40vh 41vw)}` and `.hero_bg-img:first-of-type img{clip-path:inset(100% 0px 0px 0px)}` — these create the distinctive "unmasking" entrance effects

2. **Color-mix & blend modes**: The navbar uses `mix-blend-mode: difference` on the logo; location backgrounds use `mix-blend-mode: soft-light`; stamp elements use `mix-blend-mode: difference` for the white-on-dark contrast

3. **Responsive image techniques**: `srcset` with multiple `p-x` variants for hero images; `aspect-ratio` rules for work grid items (`8n+2` = 4/3, `8n+3` = 1/1, `8n+4` = 1/1, `8n+7` = 1.85/1)

4. **CSS-only focus states**: `input:focus, button:focus` get `outline: 2px solid transparent; box-shadow: 0 0 0 2px rgba(0,0,0,0.2)` — subtle accessibility focus ring

5. **Selection styling**: `::selection` uses `background: var(--analog-white); color: var(--real-black)` — a deliberate accent contrast

6. **Cookie consent strategy**: The original loads third-party tags (GTM, Meta, LinkedIn, Twitter) only on first user interaction (pointer/key/touch/scroll) or after 4s `window.load` timeout. This clone omits tracking scripts entirely per the static clone requirement, but the cookie banner UI is retained

7. **Image preloading & lazy loading**: The Webflow source uses `loading="lazy"` on images and `preconnect` to `cdn.prod.website-files.com`; the clone uses standard `<img>` tags without lazy loading (all images are inline in the single page)

8. **Safari disable class**: `.safari-disable { display: none }` suggests there were Safari-specific fallbacks that were disabled

9. **Barba.js not used**: Despite the site being a single-page feel, the source HTML does not use Barba.js for page transitions. The "page wipe" effect (`<div class="page-wipe"></div>`) is purely decorative CSS

10. **GSAP 3 + ScrollTrigger 3**: The clone explicitly loads `gsap@3` and `ScrollTrigger.min.js` from CDN, registering the plugin conditionally: `if (window.gsap) gsap.registerPlugin(ScrollTrigger);` — this avoids errors if GSAP fails to load