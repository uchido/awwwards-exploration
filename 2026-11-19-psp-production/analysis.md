# Analysis: PSP Production (Production Portugal) Clone

## Stack

- **Framework**: Webflow (site built in Webflow, HTML output contains Webflow-specific classes like `w-dyn-item`, `w-embed`, `w-script`)
- **JS Animation**: GSAP 3 (primary animation engine) + ScrollTrigger for scroll-based animations
- **Smooth Scroll**: Lenis (loaded via CDN: `https://cdn.jsdelivr.net/npm/lenis@1.2.3/dist/lenis.min.js`)
- **Google Analytics**: gtag.js (`G-QT33TQ9S9L`)
- **Fonts**: Lato (Google Fonts) - used for the loader lists and body text
- **CSS**: Custom properties (`:root` vars for viewport height, stage heights, colors), media queries, `@supports` for `100lvh`

## Layout System

- **Viewport-based heights**: `--psp-viewport-height` and `--psp-stage-height` CSS variables drive the height of hero, about, brands, and footer sections (`100dvh` or `100vh`). Uses `@supports (height: 100lvh)` fallback for Safari.
- **Master pin wrap**: `overflow: hidden` on a wrapper element locks scrolling during the intro.
- **Content width**: A scrollbar width probe (`--psp-content-width`) dynamically adjusts for the actual scrollbar width on page load.
- **Responsive breakpoints**: Media queries at `991px`, `1024px`, `1275px`, `1921px` adjust padding, font sizes, and layout dimensions.
- **Safe area insets**: `env(safe-area-inset-top`, `env(safe-area-inset-bottom)` used for iPhone notch/compensation.
- **Flexbox-based layout**: Throughout the page (loader blobs in a column flex container, project lists, footer columns).

## Typography

- **Primary font**: Lato (`font-family: Lato, Arial, sans-serif`) loaded from Google Fonts
- **Weights**: 400, 700, 900 used across the site
- **Class naming convention**: `typography-body-bold`, `typography-heading-bold`, `typography-heading-light`, `typography-sub-heading-uppercase`, `typography-sub-heading`, `typography-body-light`
- **Font sizes**: 
  - Body: `clamp(14px, 0.87vw, 16px)` or `16px` base
  - Heading-bold: `clamp(30px, 2.78vw, 40px)` (intro heading), `64px` (desktop), `6vw` (1921px+)
  - Sub-heading: `2.75rem` (1921px+), `1.5vw` for about paragraph
  - Loader list text: `clamp(8px, 0.72vw, 13px)` (uppercase, 900 weight)
- **Line heights**: Varies by section — `1` for body, `0.9` for intro heading, `100%` for about, `normal` for brands

## Color Palette

| Variable | Value | Usage |
|---|---|---|
| `--base-bg` | `#ff0080` | Blob 1 background color |
| `--blob-1` | `#ff126f` | Primary blob color (bright pink/red) |
| `--blob-2` | `#a3003f` | Secondary blob color (darker red) |
| `--vignette` | `#590224d9` | Dark vignette overlay on blobs (90% opacity) |
| Intro background | `#ff0063` | Full-page intro screen background |
| Wipe color | `#3ffbbf` | Cyan-green wipe effect over heading text |
| `::selection` | `#ce0758` / `#72f9c8` | Highlight selection colors (pink/teal) |
| Footer text | `#fff` (light on dark) | Footer text color |
| Cursor accents | `#ff004d` | Cursor corner border color, `#3ffbbf` timing indicator |

## Animation Techniques (GSAP Usage)

### Intro Loader Timeline

The intro follows a strict sequencing using a master `gsap.timeline` with `overwrite: 'auto'`:

1. **List animation** (starts at 0.2s): Left and right logo lists slide in from below (`y: getListEndY(height)`) using the custom ease `homeIntroTravel` (Cubic ease: `M0,0 C0.42,0 0.3,1 1,1`). Items fade in with stagger (`0.024s` spacing).

2. **Heading wipe** (starts at 0.75s): The main "PSP" heading is revealed line-by-line using a wipe animation. Masks slide in from the right (`homeIntroWipeFill` ease: `M0,0 C0.76,0 0.24,1 1,1`), contents fade in, then masks slide out left (`homeIntroWipeReveal` ease: `M0,0 C0.16,1 0.3,1 1,1`).

3. **Blob animation**: 5 blobs animate with `sweep` and `fig8` keyframes, moving across the viewport with varying durations (25s, 15s, 8s, 20s, 11s) and delays.

4. **Cut screen transition** (starts ~3.6s): A canvas-based cut-screen effect reveals the heading text via a composite of text fragments drawn onto a canvas, with a mask that animates outward. The scale animation (`homeIntroScale`: `M0,0 C0.55,0 0.75,0.35 1,1`) zooms the cut screen up from 0 to final size.

5. **Exit / handoff**: After the wipe, elements fade out, the cut screen scales up and fades, then destroys itself. Triggers `home-hero-ready` event so the static page can be shown.

### Key GSAP Features Used

- **`gsap.fromTo()`** and **`gsap.to()`** for property animations
- **`gsap.timeline()`** with `defaults: { overwrite: 'auto' }` for sequenced animations
- **CustomEase** creation via `CustomEase.create()` for named eases (`homeIntroTravel`, `homeIntroWipeFill`, `homeIntroWipeReveal`, `homeIntroScale`)
- **`gsap.utils.toArray()`** for querying node lists
- **`gsap.set()`** for initial state positioning (`autoAlpha`, `y`, `scaleX`, `display`)
- **`will-change`** property on animated elements (`transform`, `opacity`)
- **`force3D: true`** for GPU-accelerated animations
- **Stagger animations** with precise control over spacing and sequence
- **Timeline callbacks** (`onComplete`, `onUpdate`) for state management and event dispatching

### Scroll Animations (ScrollTrigger)

- Lenis provides smooth scroll synced with ScrollTrigger
- ScrollTrigger.normalizeScroll() disables during intro to prevent scroll input
- Project navigation and brand list progress bars are driven by video progress and ScrollTrigger scrubbing

### Custom Cursor

- GSAP-driven following cursor with acceleration smoothing (`1 - Math.pow(0.9, elapsed / (1000 / 60))`)
- Hover text revelation with `SplitText`-style character animation
- Reduced-motion media query respect (`prefers-reduced-motion`)
- Interactive state toggling based on hover targets (`a, button, [custom-cursor-hover-state]`)
- Hold-morph state for click interactions

### Page Transition

- Fixed `.transition` overlay with 5 `.transition__line` elements
- **Enter**: Lines animate `slideOutToLeft` (cubic-bezier `0.4, 0, 0.2, 1`) with staggered delays
- **Leave**: Lines animate `slideInFromRight` with staggered delays
- Triggered on all `a` clicks (except external, mailto, tel, ctrl/cmd click)
- Browser back/forward (`pageshow` event) fixes BFCache flicker

## Notable Implementation Details

1. **Intro skip logic**: iOS always shows tap-to-start gate; non-iOS visitors are skipped on return visits via `sessionStorage.getItem('psp-home-intro-seen')`

2. **Font loading**: `document.fonts.load()` used to wait for Lato to load before starting intro; fallback to Arial if fonts fail to load within 600ms

3. **Video deferral**: Autoplay videos are paused on load (`video.autoplay = false; video.preload = 'none'`), then source is deferred until user interaction

4. **Cut screen canvas**: Text is rendered onto a canvas using `feColorMatrix` RGB shift filters. Text fragments are extracted by probing computed fonts and baselines. The canvas is synced on resize and during the intro timeline.

5. **RGB Matrix video filter**: A series of `feColorMatrix` transformations shift video colors through `violetCitron` → `citronViolet` → `mintMagenta` → `violetCitron` → identity, driven by progress along the timeline.

6. **Scrollbar width probe**: A `div` with `overflow: scroll` measures the actual browser scrollbar width and sets `--psp-content-width` CSS var to adjust content padding.

7. **Master pin wrapping**: `overflow: hidden` on `.master-pin-wrap` + `home-intro-lock` on `html/body` prevents any scroll during the intro, even if Lenis/ScrollTrigger is active.

8. **Respect for `prefers-reduced-motion`**: Intro skips GSAP animations entirely; cursor transitions are disabled; reduced-motion-friendly easing applied.