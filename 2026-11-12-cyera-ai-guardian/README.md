# Cyera AI Guardian — Static Design Study Clone

## What This Clone Is

A faithful, self-contained static clone of the **Awwwards Site of the Day**: [secure-the-unknown.cyera.com](https://secure-the-unknown.cyera.com).  
Rebuilt for design study purposes, replicating the visual design, typography, color palette, layout, and scroll-driven animations of the original.

The clone is written entirely in HTML/CSS/JS with no build step, no build-time dependencies, and no external API calls. It works by opening `index.html` directly in a browser.

## Original Site Credit

- **Original website**: [secure-the-unknown.cyera.com](https://secure-the-unknown.cyera.com)
- **Awwwards page**: [https://www.awwwards.com/sites/cyera-ai-guardian](https://www.awwwards.com/sites/cyera-ai-guardian)
- **Original built on**: Hydrax (Cyera's internal page builder), with GSAP/ScrollTrigger for animations

## How to Open

1. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge).
2. The page will show a loader animation, then transition into the full experience.
3. Scroll down to progress through the discrete "steps" (Landing → Worlds → Discover → Govern → Protect → Decide → Reading → Finish → Contact).
4. Use mouse wheel, arrow keys, Page Up/Down, Space, or touch swipe to navigate between steps.
5. Interact with the minigames: Constellation (connect stars), Compass (stop the needle), Shield Defend (protect the crystal), and Decide (approve/block AI actions).

## File Structure

```
.
├── index.html              — Root HTML markup with all sections, loader, HUD, footer
├── analysis.md             — Technical breakdown of the original site stack/layout/typography/animations
├── README.md               — This file
├── css/
│   ├── base.css            — Design tokens (colors, fonts, spacing), base resets, shared styles
│   ├── fonts.css           — @font-face declarations for Haffer & Mix Season (variable fonts)
│   ├── loader.css          — Loader animation styles and keyframes
│   ├── ui.css              — HUD, chapter rail, watermark, buttons, modals, footers
│   └── games.css           — Minigame CSS (constellation, compass, shield, decide)
├── js/
│   ├── data.js             — CLONE_DATA (steps, watermarks, constellation stars, crystal shapes, decide rows)
│   ├── loader.js           — GSAP loader timeline (bar scale, ray wipe, logo settle)
│   ├── scene.js            — Starfield canvas, crystal field, watermark, nebula parallax
│   ├── games.js            — Minigames: ConstellationDraw, CompassStop, ShieldDefend, Decide UI
│   ├── nav.js              — Step transitions, ScrollTrigger integration, navigation controls
│   └── main.js             — Boot sequence: split text, loader hand-off, scene init, scroll setup
└── assets/
    ├── fonts/
    │   ├── HafferUprightsVF.woff2   — Haffer variable font (100–900)
    │   ├── HafferUprightsVF.woff    — Haffer WOFF fallback
    │   ├── SeasonMixUprightsVF.woff2 — Season Mix variable font (100–900)
    │   └── SeasonMixUprightsVF.woff  — Season Mix WOFF fallback
    ├── images/
    │   ├── loader/
    │   │   ├── ray.png          — Small loader ray image
    │   │   └── ray_big.png      — Big loader ray image
    │   ├── titles/
    │   │   ├── horizon.png      — Dusk watermark title
    │   │   ├── dusk.png         — Dusk watermark title
    │   │   └── space.png        — Space watermark title
    │   ├── atlasses/          — Sprite/atlas images for decorative elements
    │   ├── social/
    │   │   └── og.png           — Open Graph preview image
    │   └── favicon/
    │       └── favicon.svg      — Site favicon (SVG)
    └── images/atlas*.png      — Decorative atlas/sprite sheets
```

## Faithfully Reproduced vs Approximated

### Faithfully reproduced (pixel-level or frame-accurate)

- **Loader animation**: GSAP timeline matching the original bar scale, ray wipe, and logo zoom/settle sequence
- **Color palette**: All 15+ design tokens (`--ink`, `--paper`, `--void`, `--grape`, `--orchid`, `--mint`, `--danger`, etc.) extracted from the original and used consistently
- **Typography**: Haffer and Mix Season variable fonts with exact weight/italic mapping; `clamp()`-based responsive type sizes matching the original
- **Step-based scroll layout**: Fixed-height steps navigation via `vh`-scrolled proxy + ScrollTrigger, including rail dots, watermark per-chapter updates, and theme activation
- **Word-level split reveals**: `[data-split]` elements are split into `.word` spans and staggered via GSAP on enter/exit — matching the original's typographic reveal effect
- **Minigame architectures**: Constellation (star-connecting with lines and hover highlights), Compass (needle spinning + stop zone), Shield Defend (canvas-based threat avoidance), Decide (approve/block decision cards) — all four mini-games structurally identical to original
- **Background layering**: Nebula gradients, starfield canvas, grain overlay, vignette, planet horizon — all present and animating
- **CSS `clamp()` responsive values**: Padding, font sizes, and widths using the same `clamp(min, vm, max)` pattern as the original
- **Hover/button interactions**: Solid/ghost buttons with `::before` pseudo-animations, pill inputs, and focus states
- **Keyboard navigation**: Arrow keys, Page Up/Down, Home, End, Escape key menu closing — all working
- **Touch swipe navigation**: Swipe up/down to advance steps, with hit-testing to skip interactive elements
- **SVG defs and watermark mask**: The Cyera wordmark SVG with luminance mask, used in both loader and HUD

### Approximated (closest practical replication)

- **Starfield canvas**: Particle count, size, and tint logic approximated; the original may have slightly different density/color filtering
- **Crystal field floating crystals**: Randomized vertical drift + rotation via GSAP — same conceptual motion, individual timing varies
- **Nebula parallax speeds**: `ScrollTrigger`-driven `xPercent`/`yPercent` values are approximated to match the original's visual feel rather than exact pixel offsets
- **Gesture swipe thresholds**: `60px` minimum drag distance for step advancement — a reasonable approximation of the original's touch behavior
- **Minigame details**: Individual game logic (e.g., exact star click order tolerance, compass zone boundaries, shield hitboxes) is close but may differ in edge-case behavior
- **Form submissions**: The contact form has no backend — `action` is removed; submitting will reset or show validation notes depending on browser
- **GTM/gtag/Mixpanel scripts**: Omitted from the static clone (present in original only for tracking)
- **`clip: rect(0 0 0 0)` accessibility hack**: Not carried forward; content is visible and interactive from load
- **`will-change` on all animated elements**: Present on key elements (nebulae, watermark, crystals) but not necessarily on every transient animatee as in the original

## Technical Notes for Further Development

- All GSAP animations load from CDN: `https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js` and `https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js`
- The clone is **fully static** — no build step, no Node, no npm install required. Open `index.html` in a browser and it works.
- Fonts are served from `assets/fonts/` as variable font WOFF2/WOFF files. If the fonts fail to load, the `sans-serif` fallback is used.
- The `document.fonts.then(() => body.classList.add('fonts-ready'))` guard removes the JS flicker protection once Haffer/Season are ready.
- Resize the browser window to see responsive adaptations (max-width 900px and 768px media queries adjust grid columns, logo sizes, and layout reordering).