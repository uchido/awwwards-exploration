# Technical Analysis — Neutomni (neutomni.com)

Awwwards Site of the Day, 2026-10-14. Analysis based on the live HTML (`source.html`, Webflow export published 2026-10-08) and the downloaded vendor/runtime libraries.

## Stack

- **Webflow** — `data-wf-domain`/`data-wf-page` attributes, jQuery + the Webflow runtime (vendored as `js/vendor/wf1-4.js`), and Webflow interactions markup (`data-w-id`) throughout `index.html`.
- **GSAP family** — `gsap.min.js` + ScrollTrigger, SplitText, ScrollToPlugin, Observer, and MorphSVGPlugin (club plugin, vendored), plus SplitType and CircleType for text effects, and Lenis for smooth scrolling.

## Layout system

Single long-scroll page (~25,247px tall at 1920px, per the reference screenshot), composed of alternating light/dark sections:

1. Intro section (`section light _30vh_mobile`) — loader + hero
2. Dark video section (`section dark video`) — 46MB `scene2` background video
3. `#process` — process wheel with rotating/circular text (CircleType)
4. Desktop work grid (`section light desktop_version`) / mobile variant (`#our_work`)
5. `#pricing` — dark section above, ScrollTrigger-pinned (`data-scroll-offset="0.6"`)
6. `#hover-section` — light hover-driven showcase

Hero headline: *"We build websites for people who care"*.

## Typography

Fonts downloaded from the live site into `assets/fonts/`:

- **Editorial New** (regular + PP Editorial New italic) — display serif, the site's headline voice (`editorialnewregular.otf`, `ppeditorialnewitalic.woff2`)
- **Fira Code** — monospace (light/regular/medium/semibold + variable)
- **Vazirmatn** — variable weight, secondary text

Local `@font-face` names (`Editorial new Local`, `Firacode Local`, `Italic Local`, `Vazirmatn Local`) are declared in `css/01-base.css`.

## Color & styling

Styles split into five sheets (`css/01-base` → `05-responsive`, ~102KB total), mirroring the Webflow export structure: base/reset, layout, components, per-section styling, and breakpoint overrides. The design alternates near-white light sections with black dark sections; exact values are preserved in the CSS files as exported.

## Animation & interaction techniques

Each behavior has its own script in `js/`:

- **Loader** — counter loader (`loader-counter.js`) + Slater-style preloader (`slater-loader.js`)
- **Hero reveal** — SplitType/SplitText-style staggered text reveal (`hero-reveal.js`)
- **Scroll animations** — central ScrollTrigger orchestration for section entrances, parallax and pinning (`scroll-animations.js`)
- **CTA morph** — SVG shape morph on hover using MorphSVGPlugin (`cta-morph.js`, the largest custom script at ~14KB)
- **Process wheel** — rotating circular-text wheel (`process-wheel.js` + `circle-text.js`)
- **Work slider** — draggable/horizontal work showcase (`work-slider.js`)
- **Misc** — timezone-aware clock (`clock.js`, `timezone.js`), window/viewport helpers (`windows.js`), Lenis smooth scroll (`smooth-scroll.js`)

Lottie scenes are included in `assets/lottie/` (2 JSON files).

## QA note

The cloning run verified the rebuilt DOM against the live site with a Playwright probe: `getBoundingClientRect` output for the service card tree was byte-for-byte identical between clone and live. Residual pixel diffs in full-page comparison were capture-timing artifacts (transitions in flight), not layout errors.