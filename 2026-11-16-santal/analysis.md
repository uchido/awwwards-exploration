# Santalarch Clone - Technical Analysis

## Original Site: https://santalarch.com
## Awwwards Page: https://www.awwwards.com/sites/santal

## Layout System

The original site is built with **Nuxt.js** (Vue framework) and uses a CSS variable-based design system. Key layout characteristics:

- **Fixed-position UI elements**: Preloader, cookie consent banner, and invert color button are all `position: fixed`, layered above the main content with high `z-index` values (`--z-preloader: 9999`, `--z-header: 9998`).
- **Full-viewport preloader**: The preloader sets `height: 100lvh` and `width: calc(100% + var(--scrollbar-width, 0px))`, covering the entire viewport during initial load.
- **Responsive media queries**: Breakpoints at `1024px` (tablet/min) and `1023px` (mobile/max), with different layout behaviors for each.
- **CSS custom properties (variables)**: Defined in the `:root` selector with a complete design system including colors, spacing, and transition timings.
- **Grid-based layout**: Projects use a `grid` template with `auto-fit` minmax columns; sections use `max-width: 1200px` centered container.

## Typography

- **Font family**: `"Helvetica", sans-serif` (loaded from Google Fonts with weight variations 400, 500, 700)
- **Base size**: `clamp()`-based responsive sizing for headings and text
- **Heading hierarchy**: `clamp(2rem, 5vw, 3.5rem)` for main headings, `clamp(1.5rem, 4vw, 2.5rem)` for taglines
- **Text colors**: `--c-base-light-primary: #f0f0f0` on `--c-base-dark-primary: #0f0f0f` background
- **Secondary text**: `--c-light-secondary: #f2f0f066` (60% opacity light gray)
- **Line-height**: `1` globally, allowing tight control over vertical rhythm

## Color Palette

| Variable | Value | Description |
|---|---|---|
| `--c-base-light-primary` | `#f0f0f0` | Light primary (used on dark background) |
| `--c-base-dark-primary` | `#0f0f0f` | Dark primary (main background) |
| `--c-light-primary` | `var(--c-base-light-primary)` | Alias for light primary |
| `--c-light-secondary` | `#f2f0f066` | Subtle light accent ( ~10% opacity) |
| `--c-base-line-dark-bg` | `#f2f0f00d` | Very subtle line/divider color |
| `--c-base-line-highlight` | `#f2f0f033` | Highlight/accent overlay color |
| `--c-dark-primary` | `var(--c-base-dark-primary)` | Alias for dark primary |
| `--c-dark-secondary` | `#0f0f0f66` | Dark accent (~10% opacity) |
| `--c-error` | `#8f2424` | Error state color |
| `--c-pure-black` | `#000` | Pure black |
| `--c-pure-white` | `#fff` | Pure white |

## Animation Techniques (GSAP)

The site uses **GSAP 3** with **ScrollTrigger** for all scroll-based animations. Key implementations:

- **Ticker animation**: Keyframe `ticker-a72922c5` animates a flex span from `x: 0` to `x: -100%` creating a scrolling marquee effect. Running with `ease: "none"` and `repeat: -1` for continuous loop.
- **Preloader ticker**: Similar keyframe-driven animation during page load period (2.5s timeout before fade-out).
- **Scroll reveals**: Elements with `.reveal` class are initially set to `opacity: 0, y: 50` and animated in on scroll entry using `ScrollTrigger.start: "top 80%"` with `power3.out` easing.
- **Button hover effects**: `.button-text:last-child` uses `clip-path` animation on hover, expanding from `inset(-50% 0 -50% 0)` to `inset(-50% 100% -50% 0)` to reveal underlying text.
- **Invert button**: Click toggles `.dot-orbit` transform `rotate(180deg)` with `transition: var(--transition-slow)` (0.8s cubic-bezier).
- **Cookie banner**: Fade-out on accept/decline button click.
- **CSS custom properties for transitions**: `--transition: .5s var(--ease-out)`, `--transition-fast: .3s var(--ease-out)`, `--transition-slow: .8s var(--ease-out)` where `--ease-out: cubic-bezier(.25,1,.5,1)`.

## Notable Implementation Details

1. **Nuxt.js framework**: The original uses `__nuxt` div and loads `/_nuxt/DrgmgFce.js` as a module script, indicating server-rendered Vue with client-side hydration.

2. **CSS-scoped attributes**: All section elements use `data-v-*` attribute hashes for CSS scoping (e.g., `data-v-a72922c5`, `data-v-fd5224ce`), typical of Nuxt/CSS-in-JS workflow.

3. **Property declarations**: Several CSS custom properties are declared with `@property` rules for typed CSS colors (e.g., `--c-light-primary`, `--c-dark-primary`).

4. **Image loading**: Project images use `is-loading` class with `crossorigin="anonymous"`, suggesting a transition from loading state to displayed state.

5. **Swiper carousel**: Works/projects section uses Swiper library with `swiper-slide` and `swiper-media` classes for responsive carousels.

6. **Video backgrounds**: Multiple MP4 videos in `assets/videos/` (grid.mp4, room.mp4, watch_black.mp4, watch_white.mp4) suggest video-bg or hero section usage.

7. **Icon system**: SVG sprites prefetched via `/_nuxt/ad.*.svg` patterns, indicating an inline SVG icon system.

8. **Cookie consent**: Fixed-position banner at bottom with accept/decline buttons using customized underline text decoration via CSS custom properties (`--underline-color`, `--underline-offset`).

9. **Responsive behavior**: The cookie banner shifts from horizontal layout (desktop) to column layout (mobile), with the form centered at `left: 50%` with `transform: translateX(-50%)`.

10. **Invert color mechanism**: Uses `mix-blend: difference` on the button with a `.dot-orbit` SVG element that rotates on click, creating a color-inversion visual effect.