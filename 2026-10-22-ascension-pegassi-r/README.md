# Ascension — Pegassi (Static Clone)

A faithful, self-contained static clone of the [Awwwards Site of the Day](https://www.awwwards.com/sites/ascension-pegassi-r) for **Ascension** by Belgian electronic artist **Pegassi**.

## Original Site
- **Live URL**: https://ascension.pegassi.be/
- **Awwwards**: https://www.awwwards.com/sites/ascension-pegassi-r
- **Artist**: Pegassi (Sam Huybrecht)
- **Release**: Debut EP "Ascension" — 4 September 2026

## What This Clone Is
A pixel-perfect, dependency-free reconstruction built for design study and reference. It runs by opening `index.html` directly in a browser — no build step, no server, no external APIs.

## How to Open
```bash
# Simply open in browser
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```
Or drag `index.html` into any modern browser.

> **Note**: For smooth scroll (Lenis) and GSAP animations to work, you must serve via HTTP(S) — `file://` protocol blocks ES modules and some APIs. Quick local server:
> ```bash
> npx serve .          # or: python3 -m http.server 8080
> ```

---

## What Was Faithfully Reproduced

### ✅ Visual & Layout
- **Typography**: PP Neue Montreal (5 weights) — Book, Medium, Semibold, Bold, Mono Medium
- **Color palette**: Monochrome dark theme (`#0a0a0a` bg, `#fff` text, `rgba(255,255,255,0.1)` accents)
- **Grid system**: 12-col desktop (≥650px) / 4-col mobile, fluid gaps, `site-max` 1440px container
- **Hero section**: Wordmark drift parallax, feathered-mask stairs (`mask-composite: intersect`), "EP / 01 / Spotify" slide-ups
- **Tracklist**: Grid-aligned descriptions, cue highlights, track titles with raised superscripts
- **Video sections**: Autoplay-on-intersect clips with poster crossfade (Ascension Glitch, Twinflame Awakenings)
- **About section**: Two-column timeline + grid story cards + side video
- **Footer**: Grid-aligned credits, social links, Site Credits button, player floor lift
- **Header**: Fixed top nav with logo, links, EP info, Buy button, noise overlay
- **Film grain**: Fixed `noise-2.png` overlay (`z-index: -1`)

### ✅ Interactions & Animations
- **Line reveals**: Custom SplitText engine (`AscensionSplit`) — measures text via `Range.getClientRects()`, splits into masked lines, animates `yPercent: 100→0` with `expo.out` stagger
- **Hero parallax**: Wordmark vertical drift + stairs scroll/fade tied to ScrollTrigger
- **Track cues (desktop hover)**: Video preview panel + audio ducking + progress bar + text highlight on `[data-cue]` hover
- **Video clips**: IntersectionObserver play/pause with still-image fallback
- **Player dock**: Fixed bottom bar with play/pause, track title, EQ bars, expandable sheet
- **Player sheet**: 3D vinyl disc (CSS `transform-style: preserve-3d`, side flip on B-side), rotating platter, conic-gradient sheen
- **Audio**: Web Audio API gain-node ducking, analyser-driven EQ (3 bars), auto-advance playlist
- **Enter overlay**: Click-to-enter sleeve animation, triggers line reveals + hero slide-ups on dismiss
- **Idle easter egg**: 10s inactivity → random GIF follows cursor (desktop only)
- **Grid overlay**: `Shift+G` toggles 12/4-col grid visualization
- **Mobile menu**: Slide-up sheet with `--reveal` clip-path animation
- **Smooth scroll**: Lenis (`lerp: 0.1`) synced to GSAP ScrollTrigger

### ✅ Assets (All Local)
| Type | Files | Source |
|------|-------|--------|
| Fonts | 5 × WOFF2 | Downloaded from original `/_nuxt/` |
| Images | 7 (WebP/PNG/JPG) | Hero, cover, logo, noise, OG, record |
| Videos | 6 MP4 + 6 WebP posters | 2 section clips + 4 cue previews |
| Audio | 4 MP3 | Full tracks for player |
| GIFs | 8 | Idle easter egg |

---

## What Was Approximated / Simplified

| Feature | Original | Clone | Notes |
|---------|----------|-------|-------|
| **Page transitions** | Nuxt `<NuxtPage>` + custom mask transition | Enter overlay only | Multi-page routes (`/listen`, `/about`, etc.) not implemented |
| **Sequencer page** | Interactive step sequencer | Link only | External feature, out of scope |
| **Buy/Listen pages** | Full eCommerce/streaming | External links | Point to original domain |
| **Site Credits modal** | Dynamic component | Button only | No modal content replicated |
| **Analytics/SEO** | Nuxt meta, ld+json, robots | Static meta only | `ld+json` preserved in `<head>` |
| **Font `font-display`** | Nuxt auto | `swap` via `@font-face` | Equivalent behavior |
| **CSP/Headers** | Nuxt security headers | None | Static file limitation |
| **Service Worker** | None detected | None | Not in original |

---

## File Structure
```
.
├── index.html           # Main entry point
├── analysis.md          # Technical deep-dive (this repo)
├── README.md            # This file
├── css/
│   ├── entry.css        # Tailwind v4 + design tokens + utilities
│   └── components.css   # Component styles (hero, player, disc, cues, etc.)
├── js/
│   ├── main.js          # All behaviour (GSAP, Lenis, player, cues, etc.)
│   └── splitlines.js    # Line-reveal engine (AscensionSplit)
└── assets/
    ├── *.webp/.png/.jpg # Images
    ├── fonts/           # 5 × PP Neue Montreal WOFF2
    ├── videos/          # 6 MP4 + 6 WebP
    ├── music/           # 4 MP3
    └── idle/            # 8 GIFs
```

---

## Dependencies (Loaded via CDN)
```html
<!-- GSAP 3 + ScrollTrigger -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>

<!-- Lenis smooth scroll -->
<script src="https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js"></script>
```
All three are widely cached; no local copies needed.

---

## Browser Requirements
- Chrome 90+ / Firefox 88+ / Safari 15+ / Edge 90+
- ES2020 (`optional chaining`, `nullish coalescing`)
- `IntersectionObserver`, `CSS Grid`, `CSS Custom Properties`
- `Web Audio API` (for EQ — gracefully falls back to synthetic)
- `Range.getClientRects()` (for line-split measurement)

---

## Credits
- **Original Design & Development**: [Pegassi](https://ascension.pegassi.be/) team
- **Awwwards Recognition**: Site of the Day
- **Typeface**: [PP Neue Montreal](https://pangrampangram.com/products/pp-neue-montreal) by Pangram Pangram
- **Clone Author**: Study reconstruction for educational purposes

---

## License
This clone is for **personal study and reference only**. All visual design, assets, audio, and brand identity belong to Pegassi and their collaborators. Do not deploy publicly or use commercially.