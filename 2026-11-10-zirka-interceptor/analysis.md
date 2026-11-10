# Zirka Interceptor — Awwwards Clone Analysis

## Stack

- **HTML structure**: Webflow export format with custom classes and data attributes. The page uses a standard HTML5 doctype with Webflow-specific markers (`data-wf-domain`, `data-wf-page`, `data-wf-site`).
- **CSS**: Custom styles ported from the original Webflow compiled CSS (`css/custom.css` ~1,165 lines) combined with a minimal Webflow reset (`css/webflow.min.css`). The original uses Webflow's CSS grid/flexbox layout system with CSS custom properties (`--black: #050505`, `--white: #ddd`, `--orange: #fc4f00`).
- **JavaScript**:
  - **GSAP 3** (`https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js`) — core animation engine
  - **ScrollTrigger** (`https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js`) — scroll-based triggers and timeline control
  - **Observer** (`https://cdn.jsdelivr.net/npm/gsap@3/dist/Observer.min.js`) — wheel/touch gesture tracking for the odometer counter
  - **Lenis** (`https://cdn.jsdelivr.net/npm/lenis@1.0.23/bundled/lenis.min.js`) — smooth scroll framework that syncs with ScrollTrigger via `lenis.on('scroll', ScrollTrigger.update)`
  - **Lottie** (`js/vendor/lottie.min.js`) — SVG renderer for JSON-based animations
  - **Custom scripts** (`js/main.js`, `js/frames.js`) — interaction logic ported from the original Webflow IX2 system

## Layout System

- **Primary container**: `.page-wrapper` wraps the entire page content
- **Header**: Fixed `.header` with `.container is-head` containing brand logo, navigation, and a progress bar (`.progress` with `.progress-fill`)
- **Hero section** (`.section-hero-h`): Full-height hero with:
  - Canvas-based frame sequence (`#canvasHero`) — desktop-only animated frames from pre-rendered WebP sequence
  - Hero video (`.hero-video-2`) — muted, looped, plays on scroll past threshold
  - Step features (`.step-2`): 5 interactive feature items with lottie animations and animated text numbers
  - Step-3 bottom text (`#effectiveness`): Odometer counter with regional text crossfade
- **Line text** (`.line-text`): Multi-line typed reveal animation using `data-text-fade-in` and `split-char`/`split-word` spans with incremental delays
- **Info sections** (`.info-v-wrap-h`): Vertical info strips with section names, automatic target detection, auto-guidance system, and combat-proven technology badges
- **Card section** (`.card-h` / `#threat`): 5 story cards with staggered text reveals and progress line animation
- **Footer area**: Noise texture, custom cursor, tracking readout (`traking-area` showing X/Y coordinates)

**Key layout techniques**:
- CSS `flexbox` for horizontal layout (header right side, card grid, step features)
- CSS `grid` for odometer digit slots (` .slot, .slot-leading, .slot-rolling, .slot-space, .slot-zero`)
- `position: fixed` for custom cursor, progress bar, and tracking area
- `will-change` properties for optimized animations (transform, opacity, clip-path)
- `vw`/`rem` based fluid typography with breakpoints at 767px and 991px
- `vh` units for full-height sections (`.section-hero-h`, `.step-1`, etc.)

## Typography

- **Font families**:
  - **InterDisplay-Medium.woff2** (preloaded in `<head>`) — display font for headings and hero text. Used with `.h2`, `.h1`, `.section-name-left`, `.bt-mono-2`, `.card-wr-left-bot-top-text-item-h`
  - **Geist Mono Regular.ttf** (preloaded in `<head>`) — monospace font for odometer digits (`#digits`, `.digits`, `.d`) and code-like text (`.bt-mono-2`, `.card-wr-left-top-num`)
- **Font sizes**: 
  - Hero display: `font-size: 3rem` with `line-height: 1.1` (variable depending on element)
  - Odometer: `font-size: 13rem` / `29vw` (mobile), `line-height: 13rem` / `29vw`
  - Body/text: `1rem` base with responsive adjustments via media queries
- **Text rendering**: `-webkit-font-smoothing: antialiased`, `-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`
- **Text splitting**: Custom `splitText()` function in `js/main.js` that splits text into `.split-word` (word-level) and `.split-char` (character-level) spans with `--word` and `--char` CSS custom properties for staggered animation delays

## Color Palette

| Variable | Value | Usage |
|---|---|---|
| `--black` | `#050505` | Dark background, text contrast |
| `--white` | `#ddd` | Light background, card backgrounds |
| `--orange` | `#fc4f00` | Primary accent color: progress bar fill, odometer color, hover states, links |

**Additional colors from custom.css**:
- `rgba(221, 221, 221, 0.2)` — progress bar track background (--white with 20% opacity)
- `#DDDDDD` — disabled/secondary state opacity (0.6)
- `rgba(252, 79, 0, 0.8)` / `0.6` / `0.2` — faded orange states in text-fade-in keyframes
- `#4d65ff` — focus ring color for keyboard navigation
- `#080808` — auto-fill input background override

**Color usage**:
- Progress bar: `background: rgba(221, 221, 221, 0.2)` with repeating-linear-gradient mask, `background: #fc4f00` for fill
- Odometer digits: `color: var(--orange)` / `#fc4f00`
- hover states: orange tint on `.header-btn` corners, flicker animation on `[link-hover]:hover`
- Focus outlines: `#4d65ff` `0.125rem` width with `0.125rem` offset

## Animation Techniques (GSAP Usage)

The site relies extensively on GSAP 3 with the following techniques:

### 1. Text Fade-In Reveal (`data-text-fade-in`)
- Uses `IntersectionObserver` to detect when elements enter the viewport
- Characters (`<span.split-char>`) animate via `text-fade-in` keyframe with `cubic-bezier(0.25, 1, 0.5, 1)` easing
- Delay calculation: `calc((var(--char) - 1) * 28ms + 0.125s)` — incremental per-character delays
- Word-level blink animation: `blink` keyframe with `cubic-bezier(0.25, 1, 0.5, 1)` easing, `calc((var(--word) - 1) * 39ms + 0.175s)`
- The `activateText()` function in `js/main.js` triggers the animation by adding `is-inview` class

### 2. Scroll-Animated Progress Bar
- `.progress-fill` width is updated on scroll: `(scrollY / (scrollHeight - innerHeight)) * 100%`
- Passive scroll event listener with ` { passive: true }`
- Continuous update on every scroll event

### 3. Lenis Smooth Scroll + ScrollTrigger Sync
- Lenis initialized with `lerp: 0.05`, `smoothWheel: true`, `wheelMultiplier: 0.7`, `normalizeWheel: true`
- `lenis.on('scroll', ScrollTrigger.update)` — makes Lenis the single source of truth for ScrollTrigger
- `gsap.ticker.add((time) => lenis.raf(time * 1000))` — connects GSAP ticker to Lenis RAF loop
- `ScrollTrigger.config({ ignoreMobileResize: true })` — prevents layout jumps on resize

### 4. Hero Canvas Frame Sequence
- Pre-rendered WebP frame sequence (`frameUrls5` — 199 frames from `assets/img/frames/hero/`)
- Only even-indexed frames drawn (`i % 2 === 0`) for performance
- Canvas width/height synchronized with client area
- Two-phase animation:
  - Phase 1 (progress 9-17%): Plays frames from mid-point to end (hero video build-up)
  - Phase 2 (progress 17.5%+): Triggers video `#video2` play()
- `gsap.to(seqObj, { frame: midFrame - 1, roundProps: 'frame', ease: 'none' })` — frame-by-frame animation

### 5. Lottie Step Features
- 3 lottie animations (`.lot-1`, `.lot-2`, `.lot-3`) with `data-src` pointing to `assets/lottie/` JSON files
- ScrollTrigger on hero section (`start: 'top top'`, `end: 'bottom bottom'`)
- On each progress segment, corresponding lottie plays via `anim.playSegments([0, totalFrames], true)`
- Feature text numbers fade in/out based on scroll progress: `gsap.to(t, { opacity: active ? 1 : 0, duration: 0.3 })`

### 6. Odometer Counter (Observer-based)
- Uses `GSAP Observer` to track wheel/touch gestures
- 5 spin rows of digits roll between states (e.g., `2 0 0 0` <-> `9 9 0 0`)
- Gesture threshold: `GESTURE_DISTANCE >= 180` pixels of scroll movement, `GESTURE_DELAY >= 250ms`
- Regional text crossfade: `#regionA`/`#regionB` and `#idxA`/`#idxB` fade in/out with `opacity` threshold `0.99`
- On section enter, state sets immediately; on gesture, animates strip `transform: translateY()` and slot widths
- `gsap.timeline({ scrollTrigger, scrub: 1 })` drives the digit roll animation

### 7. Progress Bar Animation on Scroll
- `.progress-2` and `.progress-1` bars animate to width based on `100 * Math.sqrt(valueK / 1000)`% 
- Value parsed from `.stat-grid-left-bot-bot-top-item-h-s` elements
- `once: true` ScrollTrigger ensures each bar animates only once

### 8. Card Section Step-Through Animation
- 5 story cards with `.card-wr-left-bot-top-text-item` and `.card-wr-right-item`
- ScrollTrigger on `.card-h` container (`start: 'top top'`, `end: 'bottom bottom'`)
- On each progress segment (`Math.min(Math.floor(p * 5), 4)`), shows/hides card content via `gsap.set()` opacity and height animations
- Line `.card-wr-left-right-line-active` grows to `p * 100%` height
- Date/time element fades in/out and moves vertically

### 9. Video Scrubbing (Canvas + Video)
- Info section canvas (`#canvas`) draws frame sequence based on ScrollTrigger scrub (`scrub: true`)
- Video `#video4` (or `#video2`) `currentTime` controlled based on scroll progress: `video.currentTime = time`
- Frame step: `const FRAME_STEP = 2`, `snap(v) = Math.round(v / 0.04) * 0.04`

### 10. Custom Cursor
- Fixed `.custom-cursor` element with `.image-8` img
- `mousemove` tracks cursor position with `0.15` easing: `cx += (mouseX - cx) * 0.15`
- Hover states: `rotate(90deg) scale(1.2)` on `a, button, .link`
- `mousedown`: `rotate(90deg) scale(1.35)`, `mouseup`: reset

### 11. Preloader Sequence
- GSAP timeline animating:
  - Left/right preloader texts sliding out
  - Orange preloader growing from small circle to large rectangle
  - Preloader sliding up and fading out
  - Text decryption animation (character-by-character character replacement with `[XO#*@!&?%ABR60$]` charset)
- `gsap.delayedCall(index * 0.06, ...)` — staggered text decryption

### 12. Flicker Animation
- `[link-hover]:hover` triggers `flicker` keyframe animation
- Random opacity transitions: `1 → 0 → 1 → 0.2 → 1 → 0.4 → 1 → 0.1 → 1`
- Duration: `0.45s linear`

## Notable Implementation Details

1. **Webflow export format**: The HTML retains Webflow-specific data attributes (`data-w-id`, `data-wf-page`, etc.) and embedded script blocks that were originally generated by Webflow. The clone strips the Webflow runtime but preserves the class names and data attributes needed for the custom JS to function.

2. **Lenis + ScrollTrigger synchronization**: The site uses Lenis for smooth scroll but ensures ScrollTrigger remains the authoritative state source via `lenis.on('scroll', ScrollTrigger.update)`. This is critical for scroll-based animations to trigger at the correct positions.

3. **Observer for odometer gestures**: The launches counter uses GSAP Observer for wheel/touch gesture tracking instead of standard scroll events. This enables the counter's unique "gesture-to-change-state" behavior where scrolling up/down within the section switches between `2 000` and `99 000` states.

4. **Canvas frame preloading**: The hero canvas sequence preloads all frame WebP images and draws them via `ctx.drawImage()`. Only every other frame is used (`i % 2 === 0`) to balance performance vs. fluidity. The canvas is desktop-only (`if (window.innerWidth > 767)`).

5. **Video-play-on-scroll trigger**: The hero video is muted and looped. It begins playing only when the user scrolls past a threshold (`progress >= 0.175`), ensuring autoplay is triggered by user interaction (browser autoplay policies).

6. **Responsive breakpoints**: Three main breakpoints: `767px` (mobile), `991px`, and `1919px` (large). Font size switches from `1rem` to `1vw` at `1920px`. Hero canvas and certain features are desktop-only (`window.innerWidth > 767`).

7. **Scrollbar hiding**: `::-webkit-scrollbar { display: none }` and `scrollbar-width: none` — the page never shows native scrollbars despite content scrolling via Lenis.

8. **Preconnect header**: `<link rel="preconnect" href="https://cdn.prod.website-files.com" crossorigin="anonymous">` — keeps the Webflow CDN connection warm for any embedded assets.

9. **Custom-cursor + tracking area**: The custom cursor follows the mouse with lag, and the tracking area permanently displays `X:` and `Y:` coordinates based on mouse position — a UX touchpoint that reflects the drone/tech theme.

10. **CSS custom properties for animation delays**: The text fade-in system uses `var(--char)` and `var(--word)` CSS custom properties set on individual span elements, allowing pure CSS animation delays without JavaScript timers for the basic reveal.