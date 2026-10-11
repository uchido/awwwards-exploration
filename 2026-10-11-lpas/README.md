# LPAS — Static Study Clone

A faithful, self-contained static rebuild of the **LPAS Architecture + Interiors** homepage (Awwwards Site of the Day study), built from `source.html` + `screenshots/original.png` in this directory.

- **Original site:** https://lpas.com/ — © LPAS Architecture. All imagery, copy and brand belong to LPAS. This clone is for **design study / education only**, not affiliated with LPAS.
- **Awwwards page:** https://www.awwwards.com/sites/lpas

## How to open
No build step, no APIs. Just open it:
1. Double-click `index.html`, **or**
2. Serve locally: `python3 -m http.server 8000` → http://localhost:8000/ (recommended so fonts/video resolve identically), **or**
3. Any static host (drag this folder).

GSAP + ScrollTrigger load from jsDelivr CDN (required for the scroll animations); everything else (CSS, JS, images, fonts) is local and relative.

## Structure
```
index.html        — rebuilt page
css/fonts.css     — Aeonik @font-face (local woff2)
css/base.css      — tokens, reset, type scale, header/nav, preloader, cursor
css/sections.css  — hero, markets, intro, work, latest, footer
js/main.js        — preloader, menu, header state, GSAP reveals/parallax, blob cursor
assets/           — 14 jpgs (hero, 5 markets, 6 projects, footer) + 3 Aeonik woff2 + favicon
source.html       — live original HTML (reference only)
screenshots/original.png — full-page reference (reference only)
analysis.md       — technical breakdown of the original
```

## Faithfully reproduced
- Overall composition from the reference screenshot: dark full-viewport hero with meta row + giant headline → 5 color-banded market rows (72/28 split, sublinks, counts, clipped thumbs) → "Clear Process…" statement block → "A selection of our work" + focus-case counts + staggered 6-project grid → 6-row "Latest updates" list → full-bleed footer image panel + dark contact bar.
- Real copy (headlines, market names/counts, project names/locations, news excerpts, footer contacts).
- Real design tokens extracted from the original CSS: Aeonik type scale (`3XL/XXL/XL/L/M/S/XS`), off-black `#262626`, greys, and all five market colors (`housing 98,86,83 · interiors 146,84,52 · higherEd 201,211,223 · civic 112,117,105 · commercial 227,193,170`).
- Real downloaded assets (1280px crops + originals) referenced relatively.
- Interactions: LPAS-word preloader, fullscreen menu wipe, sticky hero + parallax, scroll reveals, image de-zoom, footer bg scale, "Explore" hover blob, back-to-top — recreated with GSAP + ScrollTrigger like the original.

## Approximated / simplified
- Desktop horizontal pinned market scroller reduced to the stacked-band layout seen in the reference screenshot (same content/order, responsive).
- Vimeo hero video replaced with its poster still (`assets/hero-poster.jpg`) + slow Ken Burns drift (no autoplay video to stay fully static/offline-safe).
- Original WordPress/Swup/Lenis routing (portfolio, market, article pages) collapsed to single-page anchors; filter pills and "All projects" are visual.
- SVG icon sprite redrawn with minimal inline glyphs (◉ → ↑ ↓); form/search, GDPR, and CMS chrome omitted.
- E-mail links shown as text (original obfuscates via Cloudflare).
