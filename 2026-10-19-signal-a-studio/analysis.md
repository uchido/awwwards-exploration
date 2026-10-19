# Signal-A Studio Clone - Technical Analysis

## Original Site
- **URL**: https://signal-a.studio
- **Awwwards**: https://www.awwwards.com/sites/signal-a-studio
- **Stack**: Webflow (CMS), GSAP 3.15.0, ScrollTrigger, Lenis 1.1.20, Swiper 11, jQuery 3.5.1

---

## Technology Stack

### Core Technologies
- **CMS**: Webflow (evident from `data-wf-*` attributes, Webflow.js chunks)
- **Animation**: GSAP 3.15.0 + ScrollTrigger (loaded from Webflow CDN)
- **Smooth Scroll**: Lenis 1.1.20 (loaded from unpkg)
- **Sliders**: Swiper 11 (loaded from jsDelivr CDN)
- **Utilities**: jQuery 3.5.1 (Webflow dependency)

### Fonts (Self-hosted via Webflow CDN)
| Font Family | Weights | Format |
|-------------|---------|--------|
| GT America Mono | 300 (Light) | WOFF2 |
| Neue Haas Grotesk Text Pro | 300 (Light), 400 (Regular) | WOFF2 |
| Neue Haas Grotesk Display Pro | 300 (Light), 400 (Regular) | WOFF2 |
| PPEditorialNew | 100 (Thin), 200 (Ultralight) | WOFF2 |

### CSS Architecture
- **CSS Variables** (defined in `:root`):
  - `--s-a-black: #000`
  - `--s-a-white: #fff`
  - `--s-a-mono-font-default: 13px`
  - `--s-a-site-margin-default: 40px`
  - `--s-a-gap-default: 25px`
  - `--s-a-mono-font-gap-default: 5px`
  - `--s-a-stroke-width-default: 1px`
  - `--s-a-case-study-color-variable: #fff`
  - `--s-a-line-height-mono-default: 130%`
  - `--s-a-menu-back-height-px: 39px`
  - `--s-a-social-buttons-hover: 0px`
  - `--s-a-case-study-color-variable-overwrite: transparent`
  - `--s-a-menu-back-height: 39%`
  - `--s-a-default-text: 19px`

- **Responsive Breakpoints** (via JS + CSS):
  - Desktop: ≥ 992px
  - Tablet: 768px - 991px
  - Mobile Landscape: 480px - 767px
  - Mobile: ≤ 479px
  - Large Desktop adjustment: 992px - 1549px (font/gap overrides)

---

## Layout System

### Grid
- **12-column CSS Grid** with `gap: var(--s-a-gap-default)`
- Site margins: `var(--s-a-site-margin-default)` (40px desktop, 24px tablet, 16px mobile)
- Key grid classes:
  - `.s-a-grid` - base grid container
  - `.s-a-grid-1-row` / `.s-a-grid-2-rows` - row configurations
  - Elements positioned via `grid-column: span N` and `grid-column-start`

### Section Structure
1. **Hero** (`.s-a-hero`) - Full-screen video/showreel with custom cursor
2. **Case Studies** (`.s-a-case-studies`) - 2x2 grid of project cards
3. **Awards** (`.s-a-awards`) - 8-item award showcase grid
4. **About** (`.s-a-about`) - Split layout with editorial typography
5. **Testimonials** (`.s-a-testimonials`) - Rotating quote slider
6. **Services** (`.s-a-services`) - 6-column service grid
7. **Archive** (`.s-a-archive`) - Expandable project rows with Swiper sliders
8. **Contact** (`.s-a-contact`) - Form + FAQ accordion
9. **Footer** (`.s-a-footer`) - Marquee + links + social

---

## Typography System

### Font Assignments
| Class | Font | Weight | Use Case |
|-------|------|--------|----------|
| `.s-a-mono` | GT America Mono | 300 | UI labels, meta, buttons, navigation |
| `.s-a-text` / `.s-a-default-text` | Neue Haas Grotesk Text Pro | 400 | Body copy, descriptions |
| `.s-a-text-light` | Neue Haas Grotesk Text Pro | 300 | Lighter body text |
| `.s-a-display` | Neue Haas Grotesk Display Pro | 300 | Large headlines, titles |
| `.s-a-display-regular` | Neue Haas Grotesk Display Pro | 400 | Medium headlines |
| `.s-a-editorial` | PPEditorialNew | 200 | Hero subheaders, testimonials, large quotes |
| `.s-a-editorial-thin` | PPEditorialNew | 100 | Ultra-light display text |

### Text Effects
- **`-webkit-text-stroke`**: 1px stroke on mono text (menu buttons)
- **`mix-blend-mode: difference`**: White text on images (case study titles)
- **Scramble animations**: Character-by-character reveal/rescramble on hover/scroll

---

## Color Palette

| Variable | Value | Usage |
|----------|-------|-------|
| `--s-a-black` | `#000` | Primary text, borders, strokes |
| `--s-a-black-persistent` | `black` | Text stroke (persists in forced colors) |
| `--s-a-white` | `#fff` | Background, inverted text |
| `#9e9e9e` | Muted gray | Archive scope tags |
| `#666` | Medium gray | Secondary meta text |
| `#0000000d` | 5% black overlay | Subtle backgrounds |

**Scheme**: Monochrome (black/white only) with occasional grays for hierarchy.

---

## Animation Techniques

### 1. GSAP + ScrollTrigger
- **Scroll-triggered reveals**: `.scramble-viewport` elements animate on intersection
- **Timeline-based sequences**: Coordinated multi-element animations
- **Scrub animations**: Properties tied to scroll position (limited usage)

### 2. Custom Scramble Text System (`general-scramble` embed)
Three distinct effects:
- **Reveal** (`scrambleRevealGsap`): Characters scramble then settle to final text (GSAP timeline)
- **Scroll** (`scrambleText`): Viewport-triggered, characters cycle through random chars
- **Rescramble** (`scrambleTextCs`): Hover-triggered, all chars scramble simultaneously then resolve

**Configuration**:
```javascript
reveal: { duration: 400ms, charScrambleDuration: 20ms, charTotalLifetime: 60ms }
scroll: { duration: 400ms, cycles: 20, charScrambleDuration: 60ms }
rescramble: { duration: 400ms, charTotalLifetime: 20ms }
```

**Hover Detection**: RAF-based custom hit-testing (not CSS `:hover`) for precision
- Global mouse tracking via `mousemove` (capture phase)
- `elementFromPoint()` for overlay detection
- Disabled on touch devices (`(hover: none) and (pointer: coarse)`)

### 3. Custom Cursor System (`hover-animations` embed)
- **Image-following cursor**: Clones element's image, follows mouse at 60fps via RAF
- **Applies to**: `.s-a-card`, `.s-a-home-award-item`, `.s-a-home-case-study-row`, `.s-a-case-study-page-row`, `.s-a-archive-row`, `.s-a-case-studies-more-item`
- **Hover image swap**: Shows alternate image (`.s-a-image-cursor-hover`) on case study rows
- **Overlay awareness**: Disables when mouse over `.s-a-archive-overlay`, `.s-a-archive-close-wrapper`, `.s-a-menu`
- **Click suppression**: Temporary disable on click (200ms) for non-case-study elements

### 4. CSS Marquee (`footer-marquee`)
- **Dual-list duplication**: Clones first list for seamless loop
- **Speed by breakpoint**: 220px/s (desktop) → 80px/s (mobile)
- **IntersectionObserver**: Pauses when off-screen
- **Resize handling**: Recalculates duration on viewport change

### 5. Lenis Smooth Scroll
- **Config**: `lerp: 0.12`, `wheelMultiplier: 1.2`, `easing: cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **RAF loop**: `requestAnimationFrame` driven
- **Iframe fix**: Overlay captures wheel/touch over iframes, forwards to Lenis

### 6. Swiper Sliders (3 instances)
| Slider | Breakpoints | Navigation |
|--------|-------------|------------|
| Shelf (`#shelf-slider-wrap`) | 6/4/2.5/1.5 | Prev/Next buttons |
| Archive (`.s-a-archive-slider`) | 4/2.5/1.5 | Bottom-line buttons |
| Image Grid (`[data-slider-image="wrapper"]`) | 3.5/2.5/1.5 | None (touch only) |

### 7. Video Player (`video-player-with-pause`)
- **Custom cursors**: Play ▶ / Pause ⏸ / Fullscreen [CLOSE]
- **Muted mode**: `data-muted` attribute forces volume=0
- **Interaction states**: First click unmutes + plays; subsequent toggles play/pause
- **Fullscreen**: Landscape lock on mobile, custom exit cursor
- **Volume slider**: Custom styled `<input type="range">` with visual track

---

## Interaction Details

### Navigation
- **Desktop**: Fixed top menu (`.s-a-menu`) with 3 groups: Home/Case Studies/Archive/About/Contact | Social | Sublogo
- **Mobile**: Slide-in panel (`.s-a-menu`) with links + social
- **Active state**: Dot indicator (`.s-a-menu-dot`) via `.hovered`/`.clicked`/`.active` classes

### Archive Rows
- **Desktop**: Click row → shows overlay (`.s-a-archive-overlay`) with Swiper slider + close button
- **Tablet/Mobile**: Accordion toggle (`.s-a-archive-row-tablet` with `data-accordion-status`)
- **Viewed badge**: Appears on row click (`.s-a-archive-viewed`)

### Form
- **Honeypot**: Hidden `#work-email` field disables submit if filled
- **Auto-resize textarea**: Grows with content, max-height constrained

### Responsive Overrides (JS-driven)
- **Font scaling**: `--s-a-mono-font-default` 13px → 12px (992-1549px)
- **Gap scaling**: `--s-a-gap-default` 25px → 20px (992-1549px)
- **Grid repositioning**: Specific elements repositioned via inline styles at 992-1549px
- **Tablet→Desktop slider replacement**: `data-slider-tablet`/`data-slider-desktop` content swap

---

## Notable Implementation Details

### 1. Webflow-Specific Patterns
- `data-wf-*` attributes for Webflow identification
- `w-dyn-item` for CMS collection items
- `w-inline-block` / `w-hidden` utility classes
- Variant classes: `w-variant-*` for A/B testing

### 2. Accessibility
- Semantic HTML5 (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- ARIA labels on icon-only buttons
- `aria-current="page"` on active nav
- Focus-visible outlines (browser default)
- Reduced motion not explicitly handled

### 3. Performance
- **Font display: swap** on all `@font-face`
- **Lazy loading**: `loading="lazy"` on images
- **Preconnect**: `cdn.prod.website-files.com`, `cdn.jsdelivr.net`
- **Iframe lazy-load**: `data-src` swapped on archive open

### 4. Mobile Touch Handling
- `touch-action: auto` on interactive iframes
- Accordion instead of hover on tablet
- Touch-first detection disables RAF hover tracking
- Swiper `grabCursor` + `preventClicksPropagation`

### 5. Unique Visual Effects
- **Difference blend mode**: White text on images remains readable
- **Pixelation filter**: `filter: url(#pixelate-filter)` (SVG filter reference)
- **Stroke text**: `-webkit-text-stroke: 1px black` on mono navigation
- **Justified mobile subheader**: `text-align-last: justify` + `::after` pseudo-element

---

## Asset Inventory

### Images (from `cdn.prod.website-files.com/678617fee0f8375ca169e7ae/`)
| File | Purpose |
|------|---------|
| `67862431b4b58ba355ca9252_` | Main logo (SVG) |
| `67c74d53498606ca0783df22_arrow-new-window.` | External link arrow (SVG) |
| `6800023133dde14e0bd02836_footer-marquee.` | Footer marquee icon (SVG) |
| `67fe14ac4aef6079b5dfd869_recognition-red-dot.png` | Red Dot Award |
| `67fe14ac4bf7ef688cf29e74_recognition-behance.png` | Behance badge |
| `67fe14ac61b39022f91cef7f_recognition-if.png` | IF Design Award |
| `67fe14acb846a5e471ec1c13_recognition-behance2.png` | Behance badge 2 |
| `67fe14ad3a20ca65fe0c8d3b_recognition-ca.png` | Communication Arts |
| `67fe15e783f9afb64593224d_recognition` | Awwwards badge |
| `67fe16a2db7ca2597ae087b1_awwward` | Awwwards logo |
| `67fe16a9bd13e3bb118523e0_recognition-awwward` | Awwwards recognition |
| `67cdfe3e6027fcffa3d25652_tran` | Project thumbnail |
| `68120dd4bd8873ca1d842c87_4.gif` | Hero showreel poster |
| `681686d596c820f30ae6cd6e_b-c` | Project B-C 1 |
| `681686d59a37f0d3f5215ff3_b-c` | Project B-C 2 |
| `681686d5cda64534a02f540d_b-c` | Project B-C 3 |
| `68179238cda64534a0ae7ca3_b-c` | Project B-C 4 |
| `67c08dc2c398f1519dfc388d_` | Case study 1 |
| `678647420591fa3fa98d5609_` | Case study 2 |
| `67c9f65b9975e48b5995f9a1_` | Case study 3 |
| `67fe06b30d981a7b05a44ea1_cur` | Cursor 1 (SVG) |
| `67fe06b3bb72e35d9291029a_cur` | Cursor 2 (SVG) |
| `6800deb413a461efe97654e3_cur` | Cursor 3 (SVG) |
| `6825eff30e695993f1c0900a_cur` | Cursor 4 (SVG) |
| `685669b447e246c21e97ee83_cur` | Cursor 5 (SVG) |
| `68566aa87ab8a96457168e0d_cur` | Cursor 6 (SVG) |
| `6856702f8a7368e7b9b0376f_cur` | Cursor 7 (SVG) |

### Fonts (7 WOFF2 files, ~280KB total)

---

## Clone Implementation Notes

### Faithfully Reproduced
✅ CSS variable system with exact values
✅ Font stack with local WOFF2 files
✅ 12-column grid layout with responsive margins/gaps
✅ All typography classes and text effects
✅ Monochrome color palette
✅ Custom cursor system with RAF tracking
✅ Three scramble text effects (reveal/scroll/rescramble)
✅ CSS marquee with speed breakpoints
✅ Lenis smooth scroll config
✅ Three Swiper instances with matching breakpoints
✅ Video player with custom cursors, volume, fullscreen
✅ Archive desktop overlay + mobile accordion
✅ Mobile menu slide-in
✅ Menu hover/click dot indicators
✅ Social hover height animation
✅ Form honeypot + auto-resize textarea
✅ Time component with blinking colon
✅ Responsive font/gap overrides (992-1549px)
✅ Tablet→Desktop slider content replacement

### Approximated / Simplified
⚠️ **Webflow CMS data**: Static content replaces dynamic collections
⚠️ **Vimeo embeds**: Placeholder video element (no actual Vimeo iframes)
⚠️ **Pixelation filter**: SVG filter referenced but not included
⚠️ **Some cursor SVGs**: Downloaded as tiny files (likely auth-gated), using placeholders
⚠️ **Case study images**: Most downloaded as 243-byte error pages, using placeholders
⚠️ **Webflow.js**: Not included (handles forms, interactions natively)
⚠️ **Umami analytics**: Removed
⚠️ **Cal.com embed**: Commented out
⚠️ **Google site verification**: Removed
⚠️ **Webflow badge**: Removed

### Placeholder Strategy
- Failed image downloads → colored gradient placeholders matching aspect ratios
- Missing cursor SVGs → simple CSS-rendered cursors
- Vimeo videos → `<video>` with GIF poster, muted autoplay loop

---

## File Structure
```
├── index.html          # Main HTML document
├── css/
│   ├── main.css        # Imports all CSS modules
│   ├── variables.css   # CSS custom properties + @font-face
│   ├── base.css        # Reset, base styles, typography utilities
│   ├── layout.css      # Grid, sections, responsive overrides
│   ├── components.css  # All component styles (header, cards, archive, etc.)
│   └── animations.css  # Keyframes, transitions, Swiper overrides
├── js/
│   └── main.js         # All interactions (single file, ~1200 lines)
├── assets/
│   ├── fonts/          # 7 WOFF2 font files
│   └── images/         # Downloaded + placeholder images
├── analysis.md         # This file
└── README.md           # Project documentation
```

---

## Browser Support
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Requires**: CSS Grid, CSS Variables, IntersectionObserver, RAF, ES6 modules
- **Polyfills needed for**: IE11 (not supported)

---

## Performance Metrics (Target)
- **Fonts**: ~280KB (7 WOFF2, font-display: swap)
- **CSS**: ~45KB (modular, minifiable)
- **JS**: ~55KB (single file, defer-loaded)
- **Images**: Variable (optimized WebP/AVIF recommended for production)
- **Total**: < 500KB initial load (excluding images)