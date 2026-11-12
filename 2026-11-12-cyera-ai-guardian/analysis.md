# Technical Analysis: Cyera AI Guardian (Site of the Day)

## Stack

- **HTML5** with semantic sectioning (`<section class="step">`) for each page/Chapter
- **CSS3** with custom properties (CSS variables) for design tokens, `clamp()` for responsive typography/spacing, and `rgba/linear-gradient/radial-gradient` for backgrounds
- **GSAP 3** + **ScrollTrigger** (via CDN) for all animations, scroll-driven triggers, and timeline sequencing
- **Vanilla JS** for interavigation: split text, scroll snapping, step transitions, minigames (constellation, compass, shield, decide), event handling
- **Canvas API** for starfield rendering and shield defense mini-game
- **SVG** for logos, decorative elements, and minigame assets
- **Google Tag Manager** and **gtag.js** (present in original, omitted in clone)
- **Mixpanel** integration (present in original, omitted in clone)

## Layout System

The page uses a **fixed-height step-based layout** driven by viewport height (`vh`). Key characteristics:

- `#Stage` is `position: fixed; inset: 0` — the viewport-scoped canvas
- `.step` elements are `position: absolute; inset: 0` — each fills the full viewport
- Scroll progression maps to virtual pages: `idx = Math.round(window.scrollY / vh)` where `vh = window.innerHeight`
- A hidden `#scroll-space` spacer div sets `height: (steps.length * 100)vh` to enable continuous scroll scrubbing
- **ScrollTrigger** is bound to `#scroll-space` with `start: 'top top'` / `end: 'bottom bottom'` for parallax effects on background nebulae, planet horizon, and watermark
- **Scroll-driven snapping**: `gsap.to(proxy, { y: target, ease: 'power3.inOut', onUpdate: () => window.scrollTo(0, proxy.y) })` — smooth scroll between steps with keyboard/wheel/touch navigation
- **`clamp()`** is used extensively for responsive values: `clamp(24px, 5vw, 88px)` for horizontal padding, `clamp(15px, 1.15vw, 18px)` for body font size, etc.
- **Grid-based chapter layouts**: `grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr)` for chapter-grid, `repeat(3, 1fr)` for world-cards/reading-cards, `1fr 1fr` for games-row
- **Fade/reveal disorientation**: `[data-reveal]` starts at `opacity: 0`, GSAP animates `opacity: 1` on enter, `opacity: 0` on exit

## Typography

- **Primary font: Haffer** (variable 100–900, `font-family: Haffer, sans-serif`)
  - Downloaded from `assets/fonts/HafferUprightsVF.woff2` / `.woff`
  - Used for all headings and body text (`--stage-font`)
  - Weights implied by variable axis; `font-weight: 420`, `560`, `520`, `600` referenced in CSS custom properties
- **Accent font: Season Mix** (variable 100–900, `font-family: Season, Haffer, sans-serif`)
  - Used for italic emphasis: `.em.season`, menu links `counter()`, watermark labels
  - Downloaded from `assets/fonts/SeasonMixUprightsVF.woff2` / `.woff`
- **System font fallback: sans-serif**
- **Font loading guard**: `document.fonts.then(() => body.classList.add('fonts-ready'))` — removes the JS flicker protection once Haffer/Season are ready
- **Text rendering**: `-webkit-font-smoothing: antialiased`, `font-synthesis: none`, `-webkit-text-size-adjust: none`
- **Typographic scale** using `clamp()`:
  - `display: clamp(46px, 7.2vw, 108px)` — main headline
  - `h1: clamp(36px, 4.6vw, 68px)` — section headings
  - `h2: clamp(30px, 3.8vw, 56px)` — subsection headings
  - `body: clamp(15px, 1.15vw, 18px)` — paragraph text
  - `kicker: 12px` — uppercase tracking `.22em`
  - `quote: 13.5px` — blockquote
  - `stat: 15px` — statistics with left-border accent
  - `caption/small`: `11.5px` — footnotes, labels

**Text elements and their classes:**
- `.kicker` — uppercase, `.22em` tracking, color `var(--orchid)` — chapter intro
- `.display` / `.h1` / `.h2` — variable size with `clamp()`, `line-height: 1.02–1.08`
- `.body` — `1.65` line-height, `rgba(251,251,251,.78)` color
- `.stat` — left-border `2px solid var(--orchid)`, `font-weight: 560`
- `.quote` — left-border accent, `rgba(251,251,251,.62)`
- `.question-chip` — pill-styled interactive question
- `.em.season` — italic, variable accent font, color `var(--lav)`

## Color Palette

| Variable | Value | Usage |
|---|---|---|
| `--ink` | `#160923` | Primary text color |
| `--paper` | `#FBFBFB` | Off-white/background contrast |
| `--cream` | `#F6F5F1` | Subtle background fill |
| `--grey` | `#524E56` | Secondary text |
| `--void` | `#090117` | Deepest space background |
| `--void-2` | `#190c1d` | Darker overlay |
| `--plum` | `#241136` | Dark accent |
| `--grape` | `#6D2D93` | Loader background, primary brand purple |
| `--violet` | `#aa59d8` | Secondary purple |
| `--orchid` | `#D28EFF` | Loader bar track, chip borders, `color: var(--orchid)` |
| `--lilac` | `#F3BFFF` | Hover states, lighter purple |
| `--magenta` | `#E574FF` | Particle/accents |
| `--lav` | `#D390FF` | Accent font color |
| `--mint` | `#BFFFA2` | Success/allowed state |
| `--lime` | `#7BF583` | Win/confirmed state |
| `--danger` | `#e15b5b` | Error/wrong state |
| --pear | `#C5FF9E` | Secondary success |

**Background composition (layered via `position: absolute; inset: 0; z-index: 0/1`):**
- `#bg-space` fixed inset with nebula `.nebula` elements (radial gradients, blur)
- `#stars-canvas` — real-time 2D canvas particle field
- `.grain` overlay with SVG turbulence noise, `opacity: .07`, `mix-blend-mode: overlay`
- `.vignette` — radial + linear gradient border fade
- `#planet-horizon` — curved horizon SVG at bottom
- `#crystal-field` — inset container for floating crystal SVGs

**Step themes** activated via `body[data-theme="..."]`:
- `grape` — default, purple-leaning nebulae
- `horizon` — blue/cyan palette
- `dusk` — pink/magenta palette
- `space` — teal/green palette

## Animation Techniques (GSAP Usage)

**Loader timeline** (`js/loader.js`):
- Bar scale-in: `gsap.to(bar, { scaleX: 1, duration: 2.1, ease: 'power2.inOut' })`
- Ray wipe: `gsap.fromTo(rays, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power3.in' })`
- Logo zoom: `gsap.fromTo(logo, { scale: 1 }, { scale: 1.04, duration: 2.1, ease: 'power1.inOut' })`
- Bar drain + logo exit + particle collapse + ray collapse — sequential `gsap.timeline` with precise offsets (0, 1.0, 2.25, 2.35, 2.45, 2.55, 3.35)
- Final hand-off: `loader.classList.add('is-done')` + `loader.style.display = 'none'`

**Step enter transitions** (`js/nav.js:enterStep`):
- Stage scale: `fromTo({ scale: 1.03 }, { scale: 1 }, { duration: .9, ease: 'power3.out' })`
- Word/stagger reveal: `fromTo({ yPercent: 115, rotate: 4 }, { yPercent: 0, rotate: 0 }, { duration: .9, stagger: .018, ease: 'power4.out' })`
- Reveal elements: `fromTo({ opacity: 0, y: 26 }, { opacity: 1, y: 0 }, { duration: .7, ease: 'power3.out' })` — staggered by `.06s` per element
- Watermark fade-in: `gsap.fromTo(wm, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' })`

**Step exit transitions** (`js/nav.js:exitStep`):
- Words/reveals: `opacity: 0, y: -34, stagger: .012, ease: 'power2.in'`
- Step container: `opacity: 0, scale: .985, ease: 'power2.in'`
- Timeline `onComplete` hides step (`visibility: hidden`) and unloads content

**Scroll/parallax animations** (`js/nav.js:init` + `scene.js`):
- **Stars**: 2D canvas with per-star sine-wave pulsing `a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.s + s.p))`
- **Crystals**: `gsap.to(el, { y: '+=(' + (12 + Math.random() * 26) + ')', rotation: (Math.random() - 0.5) * 14, duration: 4 + Math.random() * 5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: -Math.random() * 5 })`
- **Watermark parallax** (ScrollTrigger): `gsap.set('#watermark', { yPercent: -8 * p })` where `p` is scroll progress
- **Nebula parallax** (ScrollTrigger): `gsap.set('.nebula-a', { xPercent: 6 * p, yPercent: -10 * p })`, `gsap.set('.nebula-b', { xPercent: -8 * p, yPercent: 6 * p })`
- **Planet horizon**: `gsap.set('#planet-horizon', { yPercent: -30 * p, rotate: 0 })`
- **Hint bounce**: `@keyframes hint-bounce` + `animation: hint-bounce 1.8s var(--ease) infinite`

**Minigame animations** (`js/games.js`):
- **Constellation**: `gsap.to(line, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' })`, `gsap.fromTo(starEls[i], { scale: 1.5 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' })`
- **Compass**: `gsap.to(needle, { rotation: '+=360', duration: 2.2, ease: 'none', repeat: -1 })`, `gsap.fromTo(dial, { scale: 1 }, { scale: 1.06, duration: 0.35, yoyo: true, repeat: 1, ease: 'power2.out' })`
- **Shield**: `gsap.fromTo(canvas, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)') }` on breach
- **Decide**: button hover `transition: background .3s var(--ease), color .3s var(--ease)`, `gsap.to(badge, { scale: state[key] ? 1 : 0, duration: .6, ease: 'back.out(2)' })`

**Easing function**: `--ease: cubic-bezier(0.645, 0.045, 0.355, 1)` — used globally for most CSS transitions; GSAP defaults to `'power2.inOut'` or `'power3.inOut'`

## Notable Implementation Details

1. **Preloader hand-off**: The loader timeline has a hand-off pattern where the bar drains, the logo zooms through an overshoot (`scale: 1.04` → `scale: 8`), particles collapse, and rays expand — all sequenced with exact offsets so the total duration is deterministic (~3.35s)

2. **Scroll snapping via proxy**: Instead of `scroll-snap`, the code uses a `proxy` object with `gsap.to()` that writes `window.scrollTo(0, proxy.y)` on every update. This gives GSAP-controlled smooth scrolling that responds to wheel, keyboard, and touch inputs.

3. **SplitText integration**: All `[data-split]` elements are walked and split into `.word` spans by `js/navInit.splitText()`. This enables the staggered word-level reveals on step entry/exit.

4. **Theme activation via `body[data-theme]`**: CSS rules target `body[data-theme="grape"]`, `body[data-theme="horizon"]`, etc. to swap nebula gradients, opacities, and accent colors without JavaScript class toggling.

5. **Rail dot navigation**: Chapter buttons (`rail-dot`) are generated from `steps` array in `js/nav.js`. Active/done states are toggled on enterStep. Clicking a dot calls `goTo(i)`.

6. **Menu system**: `#menu-overlay` with `.open` class toggles visibility. Menu links have large clamp-based type (`clamp(34px, 5.4vw, 72px)`) and accent-font italic `em` prefixes. Escape key closes the menu.

7. **Toast notifications**: `gsap.fromTo(toast, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .45, ease: 'power3.out' })` then delayed fade out. Used for game completions ("Discover Complete", "Governance Complete", etc.)

8. **Decide game logic**: Four decision rows with "Approve"/"Block" buttons. Correct/wrong calls are recorded visually. `setComplete('protect')` fires when all 4 decisions are made.

9. **Shield defense mini-game**: Canvas-based with pointer-driven shield movement, radial gradient crystal, incoming threats, and integrity tracking. `setComplete('govern')` fires when 10 threats are blocked.

10. **`clip: rect(0 0 0 0)` / `.GLA11y`**: The original uses an accessibility hack `.GLA11y { clip: rect(0 0 0 0); width: 0; height: 100%; position: absolute; overflow: hidden }` to visually hide content while keeping it accessible — present in the source `<style>` block but not carried forward in the clone's CSS.

11. **`touch-action: none`** on `#shield-canvas` and `#Stage` to prevent browser scrolling/zooming during interactive segments.

12. **`will-change` usage** on animated elements (`.nebula`, `#planet-horizon`, `#watermark`, `.crystal`) to optimize GPU-accelerated transform/opacity changes.

13. **`overscroll-behavior: none`** is not explicitly set but the `passive: true` on scroll events and the `snapping` guard prevent double-scrolling interference.

14. **Responsive breakpoints**: `@media (max-width: 900px)` and `@media (max-width: 768px)` adjust grid columns, orb sizes, logo dimensions, and layout reordering (e.g., `.chapter-grid` → `1fr`, `.world-cards` → `1fr`, `.landing-side` → static positioning).