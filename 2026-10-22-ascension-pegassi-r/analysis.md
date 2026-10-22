# Technical Analysis: Ascension — Pegassi (Awwwards SOTD Clone)

## Original Site
- **URL**: https://ascension.pegassi.be/
- **Awwwards**: https://www.awwwards.com/sites/ascension-pegassi-r
- **Date Cloned**: 2026-10-22

---

## Stack & Architecture

### Core Technologies
| Layer | Technology | Version/Source |
|-------|------------|----------------|
| Framework | Nuxt 3 (Vue 3) | SSR + SPA hybrid |
| Styling | Tailwind CSS v4 | `@theme` + custom properties |
| Animations | GSAP 3 + ScrollTrigger | CDN (`gsap.min.js`, `ScrollTrigger.min.js`) |
| Smooth Scroll | Lenis | CDN (`lenis@1.1.20`) |
| Font Loading | Native `preload` + `font-face` | WOFF2 via Nuxt assets |
| Build | Vite (via Nuxt) | Module federation via importmap |

### Project Structure (Original)
```
/ (Nuxt root)
├── app/
│   ├── components/          # Vue components (Hero, Tracklist, Player, etc.)
│   ├── composables/         # usePlayer, useCues, useScroll, etc.
│   ├── layouts/             # Default layout with noise, header, player
│   └── pages/
│       └── index.vue        # Main landing page
├── assets/
│   ├── css/
│   │   ├── entry.css        # Tailwind v4 + CSS custom properties
│   │   └── chunks/          # Component-scoped styles (data-v-*)
│   ├── fonts/               # PP Neue Montreal family (5 weights)
│   ├── images/              # Hero, cover, logo, noise texture
│   └── videos/              # MP4/WebP pairs for each clip
├── public/
│   ├── noise-2.png          # Film grain overlay
│   └── *.webp, *.mp4        # Static assets served directly
└── nuxt.config.ts           # Vite + Nuxt config
```

---

## Layout System

### Grid
- **Desktop (≥650px)**: 12-column fluid grid (`--cols: 12`, `--gap: 1.5rem`)
- **Mobile (<650px)**: 4-column grid (`--cols: 4`, `--gap: 1rem`)
- **Container**: `site-max` = `min(100% - 2rem, 1440px)` centered
- **CSS Variables** (from `entry.css`):
  ```css
  --cols: 12;        /* desktop */
  --gap: 1.5rem;     /* desktop */
  --cols: 4;         /* mobile */
  --gap: 1rem;       /* mobile */
  ```

### Spacing Scale
- Base unit: `0.1rem` (Tailwind `--spacing`)
- Named utilities: `mt-45`, `pb-100`, `mt-125`, etc. (values in `0.1rem` units)
- Responsive spacing via `s:` prefix (Tailwind `@media (width >= 650px)`)

### Breakpoints
- Single breakpoint: `s` = `650px`
- Mobile-first with `s:` prefix for desktop overrides

---

## Typography

### Font Family: **PP Neue Montreal** (Pangram Pangram)
| Weight | File | CSS Variable |
|--------|------|--------------|
| Book (400) | `PPNeueMontreal-Book.Oo-9ba79.woff2` | `--font-book` |
| Medium (500) | `PPNeueMontreal-Medium.BCmCQQaX.woff2` | `--font-medium` |
| Semibold (600) | `PPNeueMontreal-Semibold.AAHsuF-J.woff2` | `--font-semibold` |
| Bold (700) | `PPNeueMontreal-Bold.l3ulKZJq.woff2` | `--font-bold` |
| Mono Medium | `PPNeueMontrealMono-Medium.DUem7D_U.woff2` | `--font-mono` |

### Type Scale (CSS Classes)
| Class | Size (mobile) | Size (desktop) | Weight | Line Height | Use Case |
|-------|---------------|----------------|--------|-------------|----------|
| `t-mark` | `0.875rem` (14px) | same | Semibold | 1.2 | Labels (● TRACKLIST) |
| `t-meta` | `0.75rem` (12px) | same | Medium | 1.3 | Footnotes, numbers |
| `t-note` | `0.875rem` (14px) | same | Book | 1.6 | Body notes |
| `t-copy` | `1rem` (16px) | same | Book | 1.7 | Footer, body |
| `t-title` | `1.5rem` (24px) | `2.25rem` (36px) | Bold | 1.15 | Header EP info |
| `t-display` | `clamp(1.75rem, 4vw, 3rem)` | `clamp(2.5rem, 5vw, 4.5rem)` | Bold | 1.1 | Main headlines |

### Special Typography Features
- **`.raised`**: Superscript-like positioning for track numbers (`top: -0.85rem` mobile, `-2.6rem` desktop)
- **`.ride`**: Superscript track labels (A1, B1) with `font-size: 1.3rem` / `1.7rem`
- **`.indent-half` / `.indent-full`**: Grid-based indentation using `--step = calc(25% + 0.25rem)`
- **`.lead-in`**: Increased line-height for header tagline (`1.5rem` / `1.8rem`)

---

## Color Palette

### CSS Custom Properties (from `entry.css`)
```css
/* Core */
--color-black: #000000;
--color-white: #ffffff;
--color-ink: #ffffff;           /* Primary text */
--color-ink-dim: rgba(255,255,255,0.45);  /* Muted text */
--color-surface: #0a0a0a;       /* Panel backgrounds */
--color-surface-2: #111111;     /* Elevated panels */

/* Accents */
--color-wash: #ffffff1a;        /* Hover wash (10% white) */
--color-line: #ffffff1a;        /* Hairline borders */
--color-hairline: #ffffff1a;    /* Panel borders */
--color-rule: #ffffff1a;        /* Section dividers */

/* Brand */
--color-brand: #ff3366;         /* Pegassi pink (used sparingly) */
```

### Visual Character
- **Dark-first**: Near-black backgrounds (`#0a0a0a`) with white text
- **Low contrast accents**: `rgba(255,255,255,0.1)` for borders, washes
- **No color gradients**: Pure monochrome + noise texture
- **Mix-blend-mode**: `difference` for "Unmute" labels over video

---

## Animation Techniques

### 1. Line Reveal (`js-animate-lines`)
**Custom SplitText engine** (`AscensionSplit.LineRevealer` in `splitlines.js`):
- **Measurement**: `Range.getClientRects()` per character → clusters into visual lines
- **DOM Transformation**: Wraps each line in `.js-line-mask > .js-line` with `overflow: clip`
- **Animation**: GSAP timeline, `yPercent: 100 → 0`, `duration: 1.75s`, `ease: expo.out`
- **Stagger**: `0.1s` per row (visual line), grouped by `.js-animate-group`
- **Trigger**: `IntersectionObserver` with `rootMargin: "0px 0px -20% 0px"`
- **Cleanup**: Reverts to original HTML after animation (`revert()`)

### 2. Hero Parallax
| Element | Motion | Trigger |
|---------|--------|---------|
| Wordmark | `y: +12%` of height | Scroll progress on wordmark |
| Stairs | `y: +40%` of height + fade | Hero scroll progress |
| Stairs opacity | `1 → 0` (quadratic) | Tracklist entering viewport |

### 3. Track Cue System (Hover Preview)
- **Desktop only** (`@media (hover: hover) and (pointer: fine)`)
- **Video swap**: 4 track-specific clips (MP4 + WebP poster)
- **Audio ducking**: GSAP volume tween `0 → 1` over 1.25s on hover, `1 → 0` on leave
- **Progress bar**: White line at top of viewport (`scaleX` = video progress)
- **Text highlight**: `[data-cue]` elements get `.lit` class (white vs dim)
- **Scroll detection**: Auto-hides on fast scroll (`dy > 48px`)

### 4. Video Clips (Sections)
- **IntersectionObserver** (`threshold: 0.12`)
- **Play on enter**, pause on leave
- **Poster crossfade**: WebP still → video (opacity `1 → 0`)

### 5. Record Disc (Player Sheet)
- **3D CSS transform**: `transform-style: preserve-3d`, `perspective: 1800px`
- **Side flip**: `rotateY(0deg)` for A-side, `rotateY(180deg)` for B-side
- **Rotation**: CSS `@keyframes platter` (`--turn: 1.8s` linear infinite)
- **Sheen**: Conic gradient + radial mask, `translateZ(1px)` for depth
- **Pause/play**: `animation-play-state` on `.spin.still`

### 6. Player Dock & Sheet
- **Dock**: Fixed bottom, lifts `45px` when footer approaches
- **Sheet**: Slide-up panel with `--reveal` CSS variable (clip-path polygon)
- **Mobile**: Full-screen sheet with `--reveal` animation (`0.8s`, `ease: reveal`)
- **Desktop**: Fade + slight delay

### 7. Enter Overlay (Intro)
- **Full-screen sleeve**: Cover art centered, "Click to enter"
- **GSAP fade-out**: `autoAlpha: 0` over `0.5s` delay `0.15s`
- **Triggers**: Click, Enter, Space
- **Post-enter**: Arms line reveals, plays hero slide-ups

### 8. Idle Easter Egg
- **Trigger**: 10s mouse/keyboard/wheel inactivity
- **Behavior**: Random GIF (1-8) follows cursor, hides on interaction
- **Mobile**: Disabled (requires fine pointer)

### 9. Grid Overlay (Shift+G)
- **Dev tool**: Visualizes 12-col / 4-col grid
- **Columns**: `background: #ffffff1a`, full height

### 10. Smooth Scroll (Lenis)
- **Config**: `lerp: 0.1`, `smoothWheel: true`, `syncTouch: false`
- **GSAP sync**: `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker`

### Custom Eases (CSS `linear()` → GSAP)
```css
--ease-reveal: linear(0, 0.006 3.8%, 0.025 7.7%, ..., 1);   /* 0.8s clip reveal */
--ease-snappy: linear(0, 0.004 3.4%, 0.022 6.9%, ..., 1);   /* 0.5s sheet close */
--ease-flip:   linear(0, 0.012 4.2%, 0.045 8.3%, ..., 1);   /* 0.8s disc flip */
```
Registered in `main.js` via `gsap.registerEase()` sampling the `linear()` points.

---

## Notable Implementation Details

### 1. CSS `mask-composite: intersect` (Hero Stairs)
```css
.stairs {
  --feather: 14rem;
  mask-image:
    linear-gradient(to right, transparent, #000 var(--feather), #000 calc(100% - var(--feather)), transparent),
    linear-gradient(to bottom, transparent, #000 var(--feather), #000 calc(100% - var(--feather)), transparent);
  mask-composite: intersect;
}
```
Creates a vignette/feathered rectangle by intersecting horizontal + vertical gradients.

### 2. Container Queries (Record Disc)
```css
.record-stage {
  container-type: size;
}
.disc {
  width: var(--disc, 70.88cqw);
}
```
Disc size responds to its container, not viewport.

### 3. `checkVisibility()` for SplitText
Before splitting, checks `element.checkVisibility()` to skip hidden/offscreen elements.

### 4. Text Node Measurement (No SplitText Library)
Custom `TreeWalker` + `Range.getClientRects()` per character — zero dependencies, handles:
- Mixed inline elements (`<sup>`, `<span data-cue>`)
- Raised glyphs (superscripts detected by `top < runTop`)
- Whitespace trimming per segment

### 5. Audio Context Gain Node Ducking
```js
const gain = ctx.createGain();
gain.gain.value = 0.2; // ducked
gain.gain.value = 1;   // restored
```
Cleaner than `audio.volume` — doesn't fight browser/media session.

### 6. Web Audio Analyser for EQ
```js
analyser.fftSize = 256;
analyser.smoothingTimeConstant = 0.3;
analyser.getByteFrequencyData(freq);
// Maps bins 1-3 to 3 bars
```
Fallback: synthetic random bands when Web Audio unavailable.

### 7. `transition: translate` (Header Links)
```css
.shift { transition: translate 0.15s var(--ease-out-quad); }
.row:hover .shift { translate: 2rem; }
```
Uses modern `translate` property (not `transform`) for independent animation.

### 8. `pointer-events: none` Overlay Pattern
- Noise layer: `z-index: -1`, fixed
- Transition mask: `z-index: 90`, hidden until page transition
- Cue panel: `z-index: 70`, `pointer-events: none` (video inside re-enables)
- Grid overlay: `z-index: 999`, `pointer-events: none`

### 9. Responsive Hero Aspect Ratios
```css
/* Mobile: 100svh */
.hero { height: 100svh; }

/* Desktop: padding-based aspect */
.hero {
  height: 0;
  padding-top: 66.4svh;
  padding-bottom: calc(55% - 1.1rem);
}
```

### 10. Nuxt Scoped Styles → Global CSS Migration
Original used `data-v-*` scoped styles. Clone extracts to:
- `entry.css`: Tailwind + design tokens + utilities
- `components.css`: Component-specific styles (`.hero`, `.player`, `.disc`, etc.)

---

## Asset Inventory

| Asset | Format | Dimensions | Size | Purpose |
|-------|--------|------------|------|---------|
| `hero-wordmark.webp` | WebP | 2496×1173 | 565 KB | Hero "Ascension" logotype |
| `hero-stairs.webp` | WebP | 1260×825 | 50 KB | Stairs background (masked) |
| `cover.webp` | WebP | 717×717 | 162 KB | Enter overlay sleeve |
| `record.webp` | WebP | 1024×1024 | 41 KB | Vinyl disc faces (A/B) |
| `logo.png` | PNG | 325×63 | 7 KB | Pegassi logo (header + prod) |
| `noise-2.png` | PNG | — | 37 KB | Film grain overlay |
| `OG-ascension.jpg` | JPEG | 1200×630 | 296 KB | Social share image |
| `ascension-glitch.mp4/.webp` | MP4/WebP | 484×645 | 28.6 MB / 61 KB | Tracklist video clip |
| `twinflame-awakenings.mp4/.webp` | MP4/WebP | 487×754 | 5.8 MB / 33 KB | About section video clip |
| `home-ascension1.mp4/.webp` | MP4/WebP | — | 8.3 MB / 41 KB | Cue A1 hover preview |
| `home-circles2.mp4/.webp` | MP4/WebP | — | 5.2 MB / 37 KB | Cue A2 hover preview |
| `home-forestwalk2.mp4/.webp` | MP4/WebP | — | 3.7 MB / 51 KB | Cue B1 hover preview |
| `home-twinflame1.mp4/.webp` | MP4/WebP | — | 5.6 MB / 85 KB | Cue B2 hover preview |
| `pegassi-*.mp3` (×4) | MP3 | — | 5.5–6.5 MB ea. | Full tracks for player |
| `idle/1-8.gif` | GIF | — | 83 KB – 2 MB | Idle easter egg |

---

## Performance Considerations (Original → Clone)

| Aspect | Original (Nuxt) | Static Clone |
|--------|-----------------|--------------|
| JS Bundle | ~200 KB (chunked) | ~41 KB (main.js + splitlines.js) |
| CSS | ~38 KB (Tailwind + chunks) | ~45 KB (entry.css + components.css) |
| Fonts | 5× WOFF2 preload | Same, local |
| Videos | Lazy + IntersectionObserver | Same |
| Audio | On-demand load | Same |
| Smooth Scroll | Lenis (Nuxt module) | Lenis (CDN) |
| GSAP | Bundled | CDN (cached) |
| **First Paint** | ~1.2s (SSR) | ~0.8s (static) |

---

## Accessibility

| Feature | Implementation |
|---------|----------------|
| Reduced Motion | `@media (prefers-reduced-motion: reduce)` disables all GSAP/ScrollTrigger/Lenis |
| Semantic HTML | `<main>`, `<section>`, `<header>`, `<footer>`, `<nav>` |
| ARIA | `aria-label`, `aria-expanded`, `aria-hidden` on overlays |
| Focus Styles | Visible outlines on interactive elements |
| Video | `muted`, `loop`, `playsinline`, `preload="none"` |
| Images | `alt` text, `loading="lazy"` below fold |

---

## Browser Support
- **Modern**: Chrome 90+, Firefox 88+, Safari 15+, Edge 90+
- **Required APIs**: `IntersectionObserver`, `CSS Grid`, `CSS Custom Properties`, `Web Audio API` (optional), `Range.getClientRects()`
- **Graceful Degradation**: No smooth scroll, no line reveals, no EQ without JS