# Delta Cafés — Static Clone — Technical Analysis

## Stack

- **HTML5** with semantic markup and data-* attributes for component identification
- **CSS3** with custom properties (CSS variables) for theming, typography, and spacing
- **Vanilla JavaScript** (no build step, no frameworks) — the clone loads GSAP and ScrollTrigger from CDN
- **No PHP, Node, or backend** — fully static; works by opening `index.html` directly
- Assets (fonts, images, video) are embedded as static files referenced via relative paths

## Layout System

- **CSS Grid** for major sections: culture grid (2-col), journal grid (2-col with 3 card rows), footer panels (5-col sub-grid)
- **CSS Flexbox** for horizontal layouts: navigation, button groups, hero CTA cards, dropdown panels, sustainability images
- **Positioned absolute/relative** patterns for hero title overlay, product carousel, scatter items, D de Delta marquee
- **`clamp()`** for fluid typography and responsive constraints: `clamp(12px, 8.412px + 0.92vw, 24px)` grid margin, fluid type scales from 16px to 124px
- **`max-width: 1116px`** with `margin: 0 auto` or `transform: translateX(-50%)` for center-aligned content
- **Fixed header** (`position: fixed, inset: 0`) over scrolling content; inner elements have `pointer-events: auto` while header blocks pointer events by default
- **Overflow hidden** on `<body>` with custom horizontal scroll containers (`#products-track`, `#ddd-row-1/2`, `#quiz-bags`)
- **`aspect-ratio`** used for video containers and icon areas
- **`vw`-based units** extensively for responsive scaling (e.g., `11.98vw`, `67.7vw`, `84vh`)

## Typography

- **`--serif: 'Delta Season', Georgia, serif;`** — custom variable font with optical size adjustments via `font-variation-settings`
- **`--sans: 'Delta Season', Helvetica, Arial, sans-serif;`** — body text and navigation
- **`--display: 'Trade Gothic Cond', 'Arial Narrow', sans-serif;`** — uppercase display headlines
- **Variable font 'Delta Season'** with `font-variation-settings: 'SERF' 0, 'wght' 430` as the base weight
- **Heading scales** using `clamp()`:
  - `t-display`: `clamp(68px, 52.517px + 3.97vw, 120px)` — big uppercase display
  - `t-serif`: `clamp(44px, 20.171px + 6.11vw, 124px)` — hero/section serif display
  - `t-serif-md`: `clamp(40px, 32.863px + 1.83vw, 64px)` — medium serif
  - `t-body`: `clamp(16px, 14.791px + 0.31vw, 20px)` — body text
  - `t-label`: `13px` uppercase with `.02em` letter-spacing
- **`reveal-line` animation**: spans inside `.reveal-line` animate `yPercent` from 110% to 0 with stagger (.09s) via ScrollTrigger
- **Full-page video backgrounds** with `object-fit: cover`, tinted with CSS filters (grayscale, sepia, hue-rotate)

## Color Palette

| Variable | Hex | Usage |
|---|---|---|
| `--brown-300` | `#6b4f41` | subtle accents |
| `--brown-400` | `#4b352a` | medium accents |
| `--brown-500` | `#35221a` | primary background |
| `--brown-600` | `#2b1b14` | dark sections |
| `--brown-900` | `#20150e` | darkest areas |
| `--creme-50` | `#fff5f0` | card backgrounds, buttons |
| `--creme-100` | `#f8eae0` | subtle panels |
| `--creme-200` | `#f2dece` | hover states |
| `--creme-300` | `#edd1bd` | CTA backgrounds |
| `--oak-400` | `#a08b7f` | secondary text |
| `--yellow` | `#ffd300` | highlight / active states |
| `--red-bright` | `#e70025` | call-to-action accents |
| `--red-dark` | `#9e0212` | header/preloader |
| `--moss-800` | `#142115` | sustainability section |
| `--leaf` | `#d7f2c8` | sustainability green accent |

- **`::selection`**: yellow background with brown text
- **Preloader**: three animated paths in sequence (#9E0212, #E70025, #FFD300)
- **Header nav-bar**: `rgba(38, 24, 15, .5)` with backdrop-blur
- **Corner pills**: `rgba(24, 15, 10, .45)` with backdrop-blur

## Animation Techniques (GSAP & ScrollTrigger)

The site relies heavily on GSAP (loaded from `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js`) and ScrollTrigger (from `https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js`). All animations are vanilla JS — no custom animation runtime.

### Hero slider (`#hero-title`, `#hero-thumbs`)
- Auto-cycle every 6.5s via `setTimeout`
- Click thumbnails to jump to slide
- On slide change: `gsap.fromTo(h1, { yPercent: 8, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .9, ease: 'power3.out' })` — slides the H1 in
- Thumb progress bar: `animation: thumbProg 6.5s linear forwards` — fills a `<i>`-width bar

### Products marquee (`#products`)
- Infinite left-to-right auto-scroll: `gsap.to(proxy, { p: '+=1', duration: 55, ease: 'none', repeat: -1 })` with modifiers to wrap `p` mod 1
- Pointer drag to override and momentum release with `gsap.to({ duration: 1, ease: 'power2.out' })` then resume auto-scroll
- Click prevention after drag (`moved > 6` triggers `e.preventDefault()` + `e.stopPropagation()`)

### D de Delta marquee (`#ddd-row-1`, `#ddd-row-2`)
- Two mirrored rows: `gsap.to('#ddd-row-1', { xPercent: -50, duration: 80, ease: 'none', repeat: -1 })` and `gsap.to('#ddd-row-2', { xPercent: -50, duration: 80, ease: 'none', repeat: -1 })` with `timeScale(-1)` offset
- ScrollVelocity reaction: `ScrollTrigger.create({ onUpdate: { v = gsap.utils.clamp(-3, 3, self.getVelocity() / 900); gsap.to([t1, t2], { timeScale: (t2.timeScale() > 0 ? 1 : -1) * (1 + Math.abs(v)), duration: .3) } } })`

### Quiz bags (`#quiz-bags`)
- Inertia dragging: pointer events update `left`/`top` `%` values; on release, velocity decays (`velX *= .92`) via `requestAnimationFrame`
- Scroll-driven yPercent oscillation: `gsap.to(b, { yPercent: (i % 2 ? 8 : -8), ease: 'none', scrollTrigger: { trigger: '#quiz', start: 'top bottom', end: 'bottom top', scrub: 1.4 } })`

### Scroll reveals
- `.t-display[data-reveal]`: each `.reveal-line > span` animates `yPercent: 110 → 0` with `.09s` stagger, `scrub: 1.2`
- General `[data-reveal]`: `gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })`
- History `.hist-item`: `gsap.fromTo(it, { y: 0 }, { y: (i % 3 - 1) * -46, ease: 'none', scrollTrigger: { trigger: '#history', start: 'top bottom', end: 'bottom top', scrub: 1.2 } })`
- History `.curves path`: `strokeDasharray`/`strokeDashoffset` animation unrolling, `scrub: 1`
- Sustainability images: `gsap.from('#sustainability .s-img.left', { y: 90, rotate: -6, opacity: 0, duration: 1.2, ... })` and right variant
- Cycle label toggle: `ScrollTrigger.create({ onToggle: ... })` adds/removes `scrolled` class on `#cycle`
- Pre-footer video zoom: `gsap.fromTo('#pre-footer video', { scale: 1.12 }, { scale: 1, scrub: 1 })`

### Interactive widgets
- **Header dropdown**: toggle `open` class, show/hide `.drop-col` by `data-pane`
- **Language dropdown**: toggle `open` class on `.lang-drop`
- **Audio pill**: toggle `.playing` class, mute/unmute all `<video>` elements
- **Cookie banner**: `.hidden` class toggles `transform: translateY(110%)`
- **Floating quiz button**: ScrollTrigger `start: 'top -120%'` toggles `show` class
- **Menu mask**: SVG clipPath defines the curved dropdown mask shape

## Notable Implementation Details

- **`data-v-*` attributes** in source HTML indicate scoped CSS (Nuxt single-file components); the clone strips these and uses generic class/ID selectors
- **`pointer-events: none`** on `#site-header` with `pointer-events: auto` on children — allows header to block clicks while letting content behind it receive events
- **`clip-path`** on `.nav-bar` defines a complex curved shape (`M-2 -2H3V3H-2V-2Z...`) that mirrors the Awwwards visual style
- **`backdrop-filter: blur()`** on nav, pills, and dropdowns for frosted glass effect
- **`object-fit: cover`** extensively for video and image containers without distorting aspect ratios
- **`aspect-ratio`** used on video posters (`1920x1080`, `3840x2160`, `2400x1260`) and icon areas
- **`srcset`** on `<img>` tags for responsive image sizes, with `_vercel/image?url=...` proxied through Vercel
- **`playsinline`** on all `<video>` elements for iOS compatibility
- **`muted` + `loop`** on all auto-playing videos
- **`data-reveal`** attributes used as hooks for ScrollTrigger; the JS checks `hasGSAP` and `typeof ScrollTrigger !== 'undefined'` before attaching
- **Feature detection**: `var hasGSAP = typeof gsap !== 'undefined'; if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);` — animations gracefully degrade if GSAP is missing
- **`setTimeout` safety net** for preloader hide (`setTimeout(hidePreloader, 2500)`) in addition to `window.addEventListener('load', ...)`
- **`font-variation-settings: 'SERF' 0, 'wght' 430`** on `body` sets the default weight for the variable Delta Season font
- **`::selection`** styling with custom yellow/brown contrast
- **`min-height` constraints** on sections (`92.2vh`, `112.5vw`, `84vh`, `93.3vw`) to ensure video backgrounds always cover the viewport