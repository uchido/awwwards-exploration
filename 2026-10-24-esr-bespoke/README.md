# ESR Bespoke — Awwwards Clone

A faithful, self-contained static clone of the [ESR Bespoke](https://www.esrbespoke.au/) website — [Awwwards Site of the Day](https://www.awwwards.com/sites/esr-bespoke) by [Nightjar](https://nightjar.co).

## What This Is

This is a **design study clone** built for educational purposes. It replicates the visual design, interactions, and animation system of the original ESR Bespoke website as a single static HTML page with vanilla CSS/JS — no build step, no framework, no external APIs required.

**Original site:** https://www.esrbespoke.au/  
**Awwwards page:** https://www.awwwards.com/sites/esr-bespoke  
**Design & development:** [Nightjar](https://nightjar.co)  
**Clone created:** 2026-10-24

---

## How to Open

Simply open `index.html` in any modern browser:

```bash
# Option 1: Double-click index.html in your file manager

# Option 2: Serve locally (recommended for video autoplay)
cd /path/to/2026-10-24-esr-bespoke
python3 -m http.server 8080
# Then open http://localhost:8080
```

> **Note:** Video autoplay policies require a local server for the hero video to play automatically. Opening `index.html` directly via `file://` may block autoplay.

---

## What Was Faithfully Reproduced

### Visual Design
- ✅ **Typography system** — FK Grotesk (body) + Regular Book (mono/labels) with exact type scale, line heights, letter-spacing
- ✅ **Color palette** — Black/white primary, dark grey hero, marque-specific accent colors
- ✅ **Grid layout** — 6-col mobile / 12-col desktop with responsive gutter switching
- ✅ **Spacing rhythm** — Section margins, padding, vertical rhythm matching original
- ✅ **All assets** — Fonts, images, videos downloaded and served locally

### Components & Sections
- ✅ **Header** — Logo roll link, "Automotive Group / since 1989" dual-text roll, nav with animated dot
- ✅ **Hero** — Full-screen video background, clip-reveal title, aside copy, "Our story" link with dot hover, unmute toggle
- ✅ **Fullwidth text** — Porsche Certified Collision Centre copy with clip reveal
- ✅ **Gallery** — 4-image drag slider (pointer drag, rubber-band, click-to-advance, scroll-triggered scale)
- ✅ **Marques** — 12-brand list with hover/focus image swap (sticky on desktop), blur/scale transition
- ✅ **Services** — 6 service rows with staggered entrance
- ✅ **Footer** — Pinned layout (desktop), brand roll, tagline with TM symbol, nav, newsletter form with focus underline, contact columns, social/privacy links

### Interactions & Animations
- ✅ **Intro timeline** — Logo fade/rise → page rise from 100vh → staggered header/hero reveals (GSAP)
- ✅ **Scroll reveals** — Generic fade/rise, clip-path text reveals, staggered marque items, sticky media clip, service rows
- ✅ **Custom cursor** — Lerped dot, `mix-blend-mode: difference`, grows on `[data-cursor]`, "Drag" label on gallery
- ✅ **Menu overlay** — Slide down/up (GSAP), staggered links, hover image gallery, nav dot, ESC/outside click to close
- ✅ **Anchor navigation** — Curtain flash (black overlay) + smooth scroll
- ✅ **Hero unmute** — Cross-fades to unmuted video, syncs playhead
- ✅ **Header theme switch** — White/black based on scroll position over dark sections
- ✅ **Newsletter form** — Focus underline animation, submit feedback
- ✅ **Smooth scroll** — Lenis-style rAF lerp (wheel-driven), ScrollTrigger compatible
- ✅ **Reduced motion** — All animations disabled via `prefers-reduced-motion`

### Technical
- ✅ **Zero dependencies** (except GSAP + ScrollTrigger from CDN)
- ✅ **Self-contained** — All fonts, images, videos in `assets/`
- ✅ **Static** — Works by opening `index.html` directly
- ✅ **Semantic HTML** — Proper landmarks, ARIA labels, heading hierarchy
- ✅ **Responsive** — Single breakpoint (1024px), mobile-first

---

## What Was Approximated or Simplified

| Feature | Original | Clone |
|---------|----------|-------|
| **Smooth scroll** | Lenis (full momentum, touchpad normalization, RAF sync) | Minimal rAF lerp (0.095 factor), no momentum |
| **Gallery slider** | Keen-Slider (infinite loop, touch swipe, autoplay?) | Finite 4-slide drag, click advances, no loop |
| **Image delivery** | Sanity CDN (auto WebP/AVIF, responsive srcset, crop transforms) | Static JPG, no srcset |
| **Video sync** | Likely frame-accurate | Best-effort `currentTime` sync on unmute |
| **SPA navigation** | Next.js App Router + GSAP page transitions | Anchor scroll only (single page) |
| **Content** | Sanity CMS (dynamic) | Hardcoded in HTML |
| **Lazy loading** | Next.js Image + IntersectionObserver | Eager loading (all assets in HTML) |
| **Analytics** | Vercel Analytics, GA | None |
| **PWA/Service Worker** | Likely present | None |

---

## Project Structure

```
2026-10-24-esr-bespoke/
├── index.html              # Main page
├── css/
│   ├── fonts.css           # @font-face declarations
│   ├── base.css            # Reset, variables, typography, utilities
│   ├── layout.css          # Header, menu, footer, page shell, cursor, intro
│   └── components.css      # Hero, fulltext, gallery, marques, services
├── js/
│   ├── smooth.js           # Lenis-style smooth scroll
│   ├── cursor.js           # Custom cursor
│   ├── menu.js             # Fullscreen menu
│   ├── gallery.js          # Drag slider + ScrollTrigger
│   ├── marques.js          # Hover image swap
│   ├── reveals.js          # ScrollTrigger reveals
│   └── main.js             # Intro, unmute, curtain nav, form, theme
├── assets/
│   ├── fonts/              # 5 WOFF2 files
│   ├── img/                # 26 JPG images
│   └── video/              # 4 WebM/MP4 videos
├── screenshots/
│   └── original.png        # Reference screenshot (1920×7455)
├── source.html             # Original live HTML
├── analysis.md             # Technical breakdown
└── README.md               # This file
```

---

## Credits

- **Original design & development:** [Nightjar](https://nightjar.co) — exceptional work
- **Original site:** [ESR Bespoke](https://www.esrbespoke.au/)
- **Awwwards recognition:** [Site of the Day](https://www.awwwards.com/sites/esr-bespoke)
- **Fonts:** FK Grotesk by [Fontfabric](https://fontfabric.com/fonts/fk-grotesk/), Regular Book
- **Animation:** GSAP 3 + ScrollTrigger by [GreenSock](https://gsap.com/)
- **Smooth scroll reference:** Lenis by [Studio Freight](https://github.com/studio-freight/lenis)

---

## License

This clone is for **educational/study purposes only**. All design, content, images, videos, and fonts belong to their respective owners (ESR Bespoke, Nightjar, Fontfabric, Sanity CDN sources). Do not use commercially.

If you're the rights holder and would like this removed, please open an issue.

---

## Analysis

See [`analysis.md`](analysis.md) for a deep technical breakdown of the original site's stack, layout system, typography, color palette, animation techniques, and implementation details.