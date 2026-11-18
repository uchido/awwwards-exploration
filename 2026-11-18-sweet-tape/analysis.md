# SweetTape Clone — Analysis

## Objective

Reproduce `https://sweet-tape.com/` as a self-contained offline design study in this directory. The clone keeps the original visual language, copy, asset names, and section order while replacing the original React/Three.js runtime with readable, dependency-light JavaScript.

## Source material

- `source.html` — saved homepage HTML used as the structural reference.
- `screenshots/original.png` — full-page reference, `1908 x 18620`.
- Extracted original JS chunks in temporary scratch storage used only for behavioural analysis:
  - `12brgdlqixjgb.js` — reveal constants, generic char/body reveal, hero mark, rail/tape interactions.
  - `09lfiv_61siim.js` — menu panel, rules/chars/arrows, WebAudio sound.
  - `2s0u9hio1067v.js` — tape slider state, rail rotation, background sweep, tags/copy/showcase updates.
  - `1bevjk_zfpi8k.js` / `337eeiph6mwz7.js` — sticky-note 3D model and scroll/parallax helpers.

## What was kept

- `index.html` remains very close to `source.html`: same section order, class names, glyph markup, and asset paths.
- `css/main.css`, `css/fonts.css`, and `css/words.css` are the original-derived styles, including the arc masks and glyph-mask rules.
- Missing local assets were redownloaded into `assets/`; 130 local references now resolve.
- Original copy, palette, typography, and credit/Awwwards badge are retained.

## Runtime reconstruction

The original bundle was replaced by five small modules:

1. `js/core.js`
   - Shared `window.ST` API.
   - Uses GSAP/ScrollTrigger when CDN scripts load; otherwise CSS transitions / `requestAnimationFrame` fallbacks.
   - Implements reveal primitives (`REVEAL`, `BODY_REVEAL`), visibility observers, frame loops, breakpoints, preload helpers, and the `sweettape:revealed` event.

2. `js/preloader.js`
   - Animates the six tape layers and sticker sheet.
   - Releases `html[data-loading]`, enables menu controls, and dispatches `sweettape:revealed`.
   - Has reduced-motion and safety-timeout paths.

3. `js/menu.js`
   - Reproduces the desktop-height / mobile-width panel reveal, rule/char/arrow stagger, outside-click and Escape close, ARIA state, and WebAudio tick.

4. `js/slider.js`
   - Keeps one `.tape-slide` in the DOM and rewrites its content in place on rail-button selection.
   - Handles shortest-path rail rotation, active ring state, wheel and keyboard navigation, background sweep, tag/copy/title colour changes, `data-word` glyph swaps, key visual, showcase images, and strip CSS variables.
   - Uses a `SHOWCASE` map for the two images per tape instead of expanding all slide markup.

5. `js/scroll.js`
   - Rebuilds post-reveal hero choreography, hero corner mark, parallax, scroll peels, hand note, wave text path, badge placement, giant-pinning timeline, make-it-stick, footer, and non-slider body reveals.
   - Draws the hero tape and sticky note on 2D canvases because the original GLB models are unavailable.

## Deviations and fallbacks

- No `assets/tapes/*.glb` models exist in the supplied assets, so the original Three.js hero tape and sticky note are approximated with animated canvas artwork. This keeps the page self-contained without inventing 3D binaries.
- GSAP and ScrollTrigger are loaded from CDN with full no-CDN fallbacks. If offline, the page still reveals, scrolls, and animates.
- The slider updates a single slide rather than mounting six simultaneous slides; visually it preserves the original interaction.
- Navigation links remain the original stubs (`/about`, `/products`, etc.); this is a static study, not a site clone with routing.
- `href`s to the live Awwwards page are retained for credit.
- Opening via `file://` works, but Chromium may log CORS warnings for CSS `mask-image` assets because `file://` is an opaque origin. Serving the folder over local HTTP gives a clean console.

## Validation performed

- `node --check` passed for all five JS modules.
- Local asset scan: 130 local references, 0 missing except the intentionally unused `.glb` model paths retained as data attributes.
- Headless Chromium CDP run after 9 s reported:
  - `hero: "live"`
  - slider body copy transform: `translate(0px, 0px)`
  - `loading: null`
  - preloader display: `none`
  - 2 canvases present
  - GSAP loaded
- Screenshots generated:
  - `screenshots/clone_top.png` — `1440 x 900` viewport after reveal.
  - `screenshots/clone_full.png` — full page, content height `14197` CSS px.
- Remaining console entries in direct `file://` mode are local-origin CORS warnings for font/mask preloads, not JavaScript exceptions.

## File map

- `index.html` — clone markup and script order.
- `css/main.css` — primary layout and component styles.
- `css/fonts.css` — self-hosted fonts and glyph masks.
- `css/words.css` — per-word glyph image rules.
- `js/` — five reconstruction modules described above.
- `assets/` — images, fonts, SVGs, textures, and word glyphs.
- `screenshots/` — original reference plus generated clone screenshots.
