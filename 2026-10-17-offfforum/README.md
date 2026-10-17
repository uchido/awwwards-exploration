# OFFFORUM — Awwwards SOTD clone (2026-10-17)

Static, self-contained clone of [offforum.com](https://www.offforum.com/) — Awwwards Site of the Day on 2026-10-17 ([Awwwards page](https://www.awwwards.com/sites/offfforum)). Built automatically by the daily clone pipeline (OpenCode free models), with design tokens extracted verbatim from the original's compiled Tailwind v4 stylesheet.

> This is a design study. All design, branding, fonts, video and imagery belong to the original creators.

## How to open

Open `index.html` directly in a browser (double-click or `file://`). No build step, no server, no external APIs. GSAP loads from CDN with a vendored local fallback, so it also works offline.

## Contents

- `index.html` — the rebuilt page (DOM mirrors the original)
- `css/` — tokens, base, utilities, typography, components, header, hero, footer, consent, transitions
- `js/` — `main.js` (GSAP bootstrap, footer reveal, drawer, consent, transitions, video guard), `smooth-scroll.js`
- `assets/` — real fonts (Baikal SemiBold, Forvm Roman), hero video + poster/thumb, icons, vendored GSAP
- `screenshots/` — `original.png` (live site) and `clone.png` (this clone), both 1920px full-page
- `source.html` — the live HTML captured for reference

## Faithfully reproduced

- Layout & metrics — pixel-verified at 1920×1080 against the live site (see `analysis.md`)
- Complete design-token set (fonts, type scale, colors, easings, spacing) from the original stylesheet
- Footer wordmark ScrollTrigger reveal with the original's trigger mapping
- Header mobile drawer, cookie consent manager, page transitions
- Hero video with poster fallback and autoplay guard
- Real fonts, video and icon assets downloaded from the live site

## Approximated

- Smooth scroll: a dependency-free lerp wheel smoother stands in for Lenis (same `--scroll` variable contract)
- Multi-page routing: only the home route is rebuilt; internal links are inert
- Analytics/consent backends: the consent dialog is visual-only, nothing is stored