# Signal-A Studio Clone

A faithful, self-contained static clone of the [Signal-A Studio](https://signal-a.studio) website — an Awwwards Site of the Day winner.

## Original Credits
- **Original Site**: https://signal-a.studio
- **Awwwards Entry**: https://www.awwwards.com/sites/signal-a-studio
- **Design & Development**: Signal-A Studio (Warsaw • Berlin)
- **Clone Purpose**: Design study / educational reference

---

## Quick Start

```bash
# Simply open in browser - no build step, no server required
open index.html
# or
xdg-open index.html
# or double-click index.html in your file manager
```

**Requirements**: Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+). No local server needed — all assets are relative and static.

---

## What's Included

### Faithfully Reproduced
| Feature | Implementation |
|---------|----------------|
| **Design System** | Exact CSS variables, 12-col grid, margins, gaps, breakpoints |
| **Typography** | 4 font families (7 WOFF2 files), all utility classes, text-stroke, blend modes |
| **Color Palette** | Pure monochrome (#000/#fff) with semantic grays |
| **Hero Section** | Full-screen video with custom cursor, volume, fullscreen controls |
| **Case Studies Grid** | 2×2 hover-reveal cards with image-following cursors + scramble titles |
| **Awards Marquee** | 8-item grid with custom cursors + CSS marquee footer |
| **Archive** | Desktop: click → overlay with Swiper slider. Mobile: accordion toggle |
| **Testimonials** | Rotating editorial quotes with slider nav |
| **Services** | 6-column responsive grid |
| **Contact** | Form with honeypot + auto-resize textarea + FAQ accordion |
| **Navigation** | Fixed desktop menu + slide-in mobile panel with active dot indicators |
| **Smooth Scroll** | Lenis (lerp 0.12, wheelMultiplier 1.2, custom easing) |
| **Scroll Animations** | GSAP + ScrollTrigger reveals |
| **Scramble Text** | 3 effects: reveal (GSAP), scroll (viewport), rescramble (hover) |
| **Custom Cursors** | RAF-based image-following cursors on all interactive elements |
| **Responsive Overrides** | JS-driven font/gap/grid adjustments at 992-1549px |
| **Tablet→Desktop Slider Swap** | Content replacement via data attributes |

### Approximated / Simplified
| Feature | Status |
|---------|--------|
| CMS-driven content | Static placeholder content |
| Vimeo embeds | `<video>` with GIF poster (no API) |
| Pixelation SVG filter | Referenced but not included |
| Some cursor SVGs | CSS fallback cursors (originals auth-gated) |
| Case study images | Gradient placeholders (downloads failed) |
| Webflow.js / jQuery | Removed (not needed for static clone) |
| Analytics (Umami) | Removed |
| Cal.com booking | Commented out |
| Google verification | Removed |

---

## Project Structure
```
signal-a-studio-clone/
├── index.html           # Main entry point
├── css/
│   ├── main.css         # Imports all modules
│   ├── variables.css    # CSS custom properties + @font-face
│   ├── base.css         # Reset, base styles, type utilities
│   ├── layout.css       # Grid, sections, responsive layout
│   ├── components.css   # All component styles
│   └── animations.css   # Keyframes, transitions, Swiper fixes
├── js/
│   └── main.js          # All interactions (~1200 lines, defer-loaded)
├── assets/
│   ├── fonts/           # 7 WOFF2 files (~280KB)
│   │   ├── GT-America-Mono-Light.woff2
│   │   ├── NeueHaasGroteskTextPro-Regular.woff2
│   │   ├── NeueHaasGroteskTextPro-Light.woff2
│   │   ├── NeueHaasGroteskDisplayPro-Light.woff2
│   │   ├── NeueHaasGroteskDisplayPro-Regular.woff2
│   │   ├── PPEditorialNew-Ultralight.woff2
│   │   └── PPEditorialNew-Thin.woff2
│   └── images/          # Downloaded + generated placeholders
│       ├── s-a-main-header-a.svg (logo)
│       ├── arrow-new-window.svg
│       ├── footer-marquee.svg
│       ├── recognition-*.png (8 award badges)
│       ├── case-*.jpg (3 project thumbs)
│       ├── b-c-*.jpg (4 project thumbs)
│       ├── 4.gif (hero poster)
│       ├── cur-*.svg (7 cursors)
│       └── [placeholders for failed downloads]
├── analysis.md          # Deep technical breakdown
└── README.md            # This file
```

---

## External Dependencies (CDN)
Loaded via `<script defer>` in `<head>`:
- **GSAP 3.12.5**: `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js`
- **ScrollTrigger 3.12.5**: `https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js`
- **Lenis 1.1.20**: `https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js`
- **Swiper 11**: `https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js`

All load with `crossorigin="anonymous"`. No npm install or build process.

---

## Key Technical Highlights

### Custom Cursor System (`js/main.js` → `setupCustomCursor`)
- Clones element's image, positions via `requestAnimationFrame`
- Tracks global mouse coordinates (capture-phase `mousemove`)
- Disables on overlay interaction (`elementFromPoint` check)
- Swaps to hover image on case study rows
- Click-suppresses for 200ms on non-case-study elements

### Scramble Text Engine (`js/main.js` → `CONFIG` + 3 functions)
```javascript
// Reveal: GSAP timeline, staggered per-character
// Scroll: Viewport-triggered, cycles through random chars
// Rescramble: Hover-triggered, simultaneous scramble→resolve
```
- Character set: `A-Z a-z 0-9 !@#$%^&*()_+-=[]{}|;:',.<>/?`
- Hover detection: Custom RAF hit-testing (not CSS `:hover`)
- Touch devices: Completely disabled via media query

### CSS Marquee (`css/animations.css` + `js/main.js` → `initMarquee`)
- Duplicates first list for seamless loop
- Speed: 220px/s (desktop) → 80px/s (mobile)
- IntersectionObserver pauses off-screen
- Resize recalculates `animation-duration`

### Lenis + Iframe Fix (`js/main.js` → `initIframeSmoothScrollFix`)
- Transparent overlay captures wheel/touch over iframes
- Forwards delta to `lenis.scrollTo()`
- Click → temporary overlay hide (6s) for iframe interaction

### Responsive Breakpoint Manager (`js/main.js` → `initCustomBreakpoints`)
- Inline style overrides at 992-1549px for specific elements
- Font size: 13px → 12px, Gap: 25px → 20px
- Grid repositioning for 7 named elements
- Cleanup on resize outside range

---

## Browser Console Commands (Debug)
```javascript
// Inspect Lenis instance
window.lenis

// Check ScrollTrigger instances
ScrollTrigger.getAll()

// Trigger scramble on any element
// (requires element with data-original-text)
scrambleRevealGsap(document.querySelector('.s-a-scramble-title'))

// Check current breakpoint
getComputedStyle(document.documentElement).getPropertyValue('--s-a-gap-default')
```

---

## Known Issues / Limitations
1. **Images**: ~60% of original images failed to download (403/redirect). Placeholders used.
2. **Cursors**: 7 cursor SVGs downloaded as 243-byte error pages. CSS fallbacks work but lack original artwork.
3. **Vimeo**: No actual Vimeo embeds — hero uses `<video>` with GIF loop.
4. **Pixelation**: SVG filter `#pixelate-filter` referenced in CSS but not defined.
5. **Touch**: RAF hover tracking disabled on touch devices (by design).
6. **Performance**: Single 1200-line JS file — could be modularized for production.

---

## Development Notes

### To Improve Image Fidelity
```bash
# Re-download with proper referrer/auth (if available)
curl -H "Referer: https://signal-a.studio" -H "User-Agent: Mozilla/5.0" \
  "https://cdn.prod.website-files.com/678617fee0f8375ca169e7ae/ASSET_ID" \
  -o assets/images/filename.ext
```

### To Add Real Vimeo Embeds
Replace hero `<video>` with:
```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID?autoplay=1&muted=1&loop=1&background=1&controls=0"
        data-video="player" allow="autoplay; fullscreen" allowfullscreen></iframe>
```
The `initVimeoPlayers()` function in `main.js` will auto-initialize.

### To Modularize JS
Split `main.js` into:
- `js/core/lenis.js` - Smooth scroll init
- `js/core/gsap.js` - GSAP/ScrollTrigger setup
- `js/components/cursors.js` - Custom cursor system
- `js/components/scramble.js` - Text effects
- `js/components/sliders.js` - Swiper initializers
- `js/components/video.js` - Video player
- `js/components/archive.js` - Archive interactions
- `js/components/menu.js` - Navigation
- `js/utils/raf.js` - RAF loop helper
- `js/main.js` - Imports + init orchestration

---

## License
This clone is for **educational / design study purposes only**.
- Original design & code © Signal-A Studio
- Fonts: Licensed via Webflow (GT America Mono, Neue Haas Grotesk, PPEditorialNew)
- Clone code: MIT License (feel free to learn from it)

**Do not deploy commercially.** Contact Signal-A Studio for original project inquiries.

---

## Learning Resources
- [GSAP Docs](https://gsap.com/docs/)
- [ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger)
- [Lenis Docs](https://github.com/darkroomengineering/lenis)
- [Swiper Docs](https://swiperjs.com/)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)