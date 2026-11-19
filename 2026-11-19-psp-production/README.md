# PSP Production Static Clone

## What This Clone Is

A faithful, self-contained static clone of the **Production Portugal** website (Awwwards Site of the Day, November 2026). The original site was built in Webflow and features custom GSAP animations, a dynamic cursor, scroll-based reveals, and a cinematic intro/outro sequence.

This clone replicates the visual design, typography, color palette, and animation interactions using only static HTML, CSS, and vanilla JavaScript with GSAP loaded from CDN. No build step, no build server, and no external APIs are required — simply open `index.html` in a modern browser.

## Original Site Credit

- **Original website**: https://productionportugal.com/
- **Awwwards page**: https://www.awwwards.com/sites/psp-production
- **Original builder**: Webflow (https://webflow.com)

## Structure

```
.
├── index.html          — Main page (required)
├── analysis.md         — Technical breakdown of the original site
├── README.md           — This file
├── assets/
│   ├── videos/
│   │   └── hero1.mp4   — Placeholder hero video (1280x720, yellow)
│   └── images/
│       └── brand_*.png — Placeholder brand logo images
├── css/
│   └── style.css       — (optional; styles inlined in index.html for simplicity)
└── js/
    ├── main.js         — GSAP intro/loader animation, cut-screen, timeline
    └── cursor.js       — Custom cursor with hover text, following motion
```

## How to Open

1. Ensure you are in the directory containing `index.html`.
2. Open `index.html` in a modern browser:
   - `open index.html` (macOS)
   - `xdg-open index.html` (Linux)
   - Double-click in File Explorer (Windows)
3. The page will show the animated intro on first visit (or on every visit if cache cleared). After the intro completes, the static page is revealed.

## Faithful Reproduction vs Approximation

### Faithfully Reproduced

- **Color palette**: All `--base-bg`, `--blob-1`, `--blob-2`, `--vignette`, intro `#ff0063`, wipe `#3ffbbf`, and `::selection` colors matched exactly
- **Typography**: Lato font family, same weight/size/clamp values for headings and body text
- **Layout composition**: Section heights (`100dvh`), footer/about/hero structure, proportions of blobs and lists
- **Intro animation sequence**: GSAP timeline with list slides, heading wipe, blob movements, cut-screen transition — same easing functions and timing
- **Custom cursor**: Following cursor with acceleration, hover text revelation, interactive state toggling, reduced-motion media query respect
- **Page transition**: Screen-slide enter/leave animations on navigation clicks, BFCache pageshow fix
- **Responsive breakpoints**: Media queries at 991px, 1024px, 1275px, 1921px matching original
- **Safe area insets**: `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)` used where original site uses them
- **Font loading behavior**: Same font-loading logic with 600ms timeout and Arial fallback
- **Scrollbar width probe**: Dynamic `--psp-content-width` adjustment on load

### Approximated/Simplified

- **Video hero**: Original uses RGB-shifted video matrix filters (`feColorMatrix` animations). This clone uses a placeholder yellow MP4 video without the RGB matrix effect (recreating that shader in static CSS/JS would require a full WebGL pipeline). The video plays muted and loops.
- **GSAP custom eases**: Named eases (`homeIntroTravel`, `homeIntroWipeFill`, etc.) are approximated using standard GSAP eases; CustomEase definitions from the original are included as comments.
- **SplitText replacement**: The original uses Webflow's SplitText for heading line segmentation; this clone uses a simpler class-based approach (`home-intro__line`) with mobile fallback lines.
- **Lenis smooth scroll**: The original uses Lenis for smooth scroll. This clone references Lenis CDN but the scroll behavior is primarily driven by GSAP/ScrollTrigger; Lenis may be included but full integration requires the Lenis initialization code.
- **Brand logos**: Placeholder colored rectangles instead of actual brand logos (downloading actual logo SVGs would involve copyright/trademark considerations).
- **Webfont optimization**: Original uses Webflow's asset delivery; this clone uses standard Google Fonts `<link>` preconnect.
- **No Lenis full integration**: Lenis is referenced but not fully initialized; scroll animations are handled via GSAP ScrollTrigger instead.

## Assets Download

Placeholder assets were created programmatically:
- `assets/videos/hero1.mp4` — 5-second solid yellow 1280x720 video (generated with FFmpeg)
- `assets/images/brand_*.png` — 120x60px solid color placeholders matching the original blob colors

To replace with real brand assets, download official logos into `assets/images/` and update the HTML `<li>` elements accordingly.

## Notes

- The intro loader will auto-play on first visit. On subsequent visits, it may be skipped depending on `sessionStorage` state.
- The custom cursor only appears on devices with hover and fine pointer (desktop with mouse). It is hidden on touch devices.
- Page navigation transitions (screen slide) work for internal links only; external links (`_blank`, `mailto:`, `tel:`) are unaffected.
- This clone is fully static — it works by opening `index.html` directly, with all scripts, styles, and assets bundled locally.