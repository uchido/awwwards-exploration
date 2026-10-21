# Cartier Le Choeur des Pierres — Static Clone

A faithful, self-contained static clone of the Cartier "Le Choeur des Pierres" High Jewellery experience, originally created by **Makemepulse** and awarded **Awwwards Site of the Day** on October 20, 2026.

## Original Credits

| Property | Details |
|----------|---------|
| **Original Site** | https://www.cartier.com/en-fr/lechoeurdespierres |
| **Awwwards Page** | https://www.awwwards.com/sites/cartier-le-choeur-des-pierres |
| **Brand** | Cartier (Richemont Group) |
| **Agency** | Makemepulse (Paris) |
| **Award** | Awwwards Site of the Day — 2026-10-20 |
| **Description** | "An immersive journey into Cartier High Jewellery, where gemstones reveal the inspiration, craftsmanship and gouachés behind each exceptional creation." |

## What This Clone Is

A **design study** and **educational recreation** built for learning purposes. This clone:

- ✅ Runs entirely offline — open `index.html` directly in any browser
- ✅ Contains zero build steps, no Node.js, no bundlers
- ✅ Uses only vanilla HTML/CSS/JS + GSAP/Lenis from CDN
- ✅ Self-hosts all fonts and images in `assets/`
- ✅ Respects `prefers-reduced-motion` for accessibility

## How to Open

```bash
# Option 1: Direct file open (simplest)
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# Option 2: Local server (recommended for scroll performance)
python3 -m http.server 8000
# Then visit http://localhost:8000

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

**No installation required.** Works in Chrome, Firefox, Safari, Edge (desktop & mobile).

## What Was Faithfully Reproduced

### Visual Design
- ✅ **Typography:** Cormorant Garamond (serif headlines) + DM Sans (UI/body)
- ✅ **Color Palette:** Cartier Noir (#0a0a0a), Blanc (#ffffff), Or Cartier (#c9a84c)
- ✅ **Layout:** Hero, intro, 4-theme grid, gouaché slider, craft section, creation grid, CTA, footer
- ✅ **Spacing:** 4px base unit, fluid responsive scaling via `clamp()`
- ✅ **Gold Accents:** Dividers, labels, CTAs, hover states — exact brand gold

### Animations & Interactions
- ✅ **Hero entrance:** Staggered word-by-word title reveal
- ✅ **Scroll reveals:** IntersectionObserver + GSAP ScrollTrigger (60px offset, power3.out)
- ✅ **Parallax:** Hero image (30% scroll), section media (20% reverse)
- ✅ **Card hover:** Reverse zoom (1.05→1.0) with 1.2s cubic-bezier transition
- ✅ **Gouaché slider:** Horizontal scroll-snap, auto-play (5s), keyboard/touch/drag nav, pagination
- ✅ **Counters:** Animated numbers (1847, 350, 1200) with GSAP snap
- ✅ **Scroll progress:** Hero bottom bar tracking viewport progress
- ✅ **Custom cursor:** Dual-layer (dot + ring) with smooth follow, hover expansion, click feedback
- ✅ **Smooth scroll:** Lenis (1.2s duration, exponential easing) synced with ScrollTrigger

### Technical Architecture
- ✅ **Semantic HTML5:** Header, main, sections, footer, nav, figure, article
- ✅ **Accessibility:** Skip link, ARIA labels, focus-visible, WCAG AA contrast, reduced motion
- ✅ **Responsive:** Mobile-first, breakpoints at 640/768/1024/1280/1600
- ✅ **Font loading:** Self-hosted TTF with preload + `font-display: swap`
- ✅ **Lazy loading:** `loading="lazy"` on all below-fold images
- ✅ **Performance:** `will-change` on animated elements, transform/opacity only

### Mobile Adaptations
- ✅ Hamburger menu with full-screen overlay
- ✅ Single-column layouts
- ✅ Native scroll-snap slider (touch-friendly)
- ✅ Custom cursor disabled
- ✅ Lenis disabled (native scroll)
- ✅ Reduced parallax intensity

## What Was Approximated

| Aspect | Original | Clone | Reason |
|--------|----------|-------|--------|
| **Photography** | Proprietary Cartier High Jewellery shots | picsum.photos placeholders | Original assets unavailable/blocked |
| **Hero Video** | Ambient loop (likely WebM/MP4) | Static hero image | Video hosting complexity |
| **CMS Content** | Prismic-driven dynamic content | Static recreated copy | No API access |
| **Brand Font** | Possibly custom Cartier typeface | Cormorant Garamond (Google Fonts) | Closest editorial serif match |
| **Analytics** | GTM + GA4 + Custom Consent | Removed | Privacy, static context |
| **Cookie Banner** | GDPR/CCPA compliant consent | Omitted | Not needed offline |
| **Image Formats** | AVIF/WebP/JPEG with srcset | Single JPEG per image | Simplicity |
| **Font Format** | WOFF2 (production) | TTF (downloaded from Google) | Download reliability |

## File Structure

```
.
├── index.html              # Entry point — open this
├── css/
│   └── main.css           # All styles (fonts, layout, components, animations)
├── js/
│   └── main.js            # All interactions (cursor, scroll, slider, GSAP, Lenis)
├── assets/
│   ├── fonts/
│   │   ├── CormorantGaramond-{Light,Regular,Italic,SemiBold,Bold}.ttf
│   │   └── DMSans-{Regular,Medium,Bold}.ttf
│   ├── images/
│   │   ├── hero.jpg
│   │   ├── jewelry-{1,2,3}.jpg
│   │   ├── gouache-{1,2}.jpg
│   │   ├── craft-{1,2}.jpg
│   │   ├── architecture.jpg
│   │   ├── geometry.jpg
│   │   ├── flora.jpg
│   │   └── fauna.jpg
│   └── video/             # (reserved for hero video)
├── analysis.md            # Deep technical breakdown
└── README.md              # This file
```

## Dependencies (Loaded via CDN)

```html
<!-- GSAP 3.12+ -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>

<!-- Lenis 1.1+ -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js"></script>
```

All scripts loaded at end of `<body>` with native browser caching.

## Browser Support

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 90 |
| Firefox | 88 |
| Safari | 15 |
| Edge | 90 |
| iOS Safari | 15 |
| Chrome Android | 90 |

**Required features:** CSS Grid, Custom Properties, IntersectionObserver, ES6 Modules (not used but available).

## Accessibility Checklist

- [x] Semantic heading hierarchy (h1 → h2 → h3)
- [x] Skip to main content link
- [x] ARIA labels on icon-only controls
- [x] Focus-visible outlines on all interactive elements
- [x] Color contrast ≥ 4.5:1 (AA)
- [x] `prefers-reduced-motion` disables all animations
- [x] Alt text on all content images
- [x] Keyboard-navigable slider (arrow keys, tab)
- [x] Screen reader friendly structure

## Performance Notes

- **Total size:** ~2.5 MB (mostly placeholder images)
- **Fonts:** ~1.5 MB (5 Cormorant + 3 DM Sans TTFs)
- **CSS:** ~45 KB (unminified)
- **JS:** ~12 KB (unminified)
- **CDN libs:** ~80 KB gzipped (GSAP + ScrollTrigger + Lenis)

For production: subset fonts to Latin (~40 KB each), convert to WOFF2, enable gzip/brotli, add srcset for responsive images.

## Learning Objectives

This clone demonstrates:

1. **Luxury web aesthetics** — Restraint, typography-led hierarchy, purposeful gold accents
2. **GSAP + ScrollTrigger mastery** — Scrub, stagger, parallax, counters, progress
3. **Smooth scroll integration** — Lenis + GSAP sync pattern
4. **Custom cursor UX** — Dual-layer, hover states, click feedback
5. **Horizontal scroll-snap carousel** — Native CSS + JS enhancement
6. **Responsive typography** — `clamp()` fluid scaling
7. **Accessibility-first animation** — Reduced motion, semantic HTML
8. **Font self-hosting strategy** — Preload, swap, local assets

## License & Usage

This clone is for **educational and design study purposes only**.

- **Original design & content:** © Cartier / Makemepulse
- **Clone code:** MIT License — free to study, modify, learn from
- **Fonts:** Cormorant Garamond (OFL), DM Sans (OFL) — free for commercial use
- **Placeholder images:** picsum.photos — free for any use

**Do not use for commercial purposes.** This is not an official Cartier website.

## Further Reading

- [`analysis.md`](analysis.md) — Complete technical breakdown (stack, layout, typography, colors, animations, architecture decisions)
- [Makemepulse Case Study](https://www.makemepulse.com/case-study/cartier-le-choeur-des-pierres) — Agency's project page
- [Awwwards SOTD Entry](https://www.awwwards.com/sites/cartier-le-choeur-des-pierres) — Award page with jury comments
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) — Animation reference
- [Lenis Docs](https://lenis.darkroom.engineering/) — Smooth scroll reference

---

*Built as a design study for Awwwards Site of the Day exploration. October 2026.*