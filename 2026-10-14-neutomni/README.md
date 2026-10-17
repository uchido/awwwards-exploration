# Neutomni — Awwwards SOTD clone (2026-10-14)

Static, self-contained clone of [neutomni.com](https://neutomni.com/) — "Digital Design & Webflow Studio", Awwwards Site of the Day on 2026-10-14 ([Awwwards page](https://www.awwwards.com/sites/neutomni)). Built automatically by the daily clone pipeline (OpenCode free models).

> This is a design study. All design, branding, fonts, video and imagery belong to Neutomni and the original creators.

## How to open

Open `index.html` directly in a browser (`file://` works). No build step. All libraries are vendored in `js/vendor/`, so the page works offline.

## Contents

- `index.html` — rebuilt page (~130KB, mirrors the Webflow export DOM)
- `css/` — 01-base → 05-responsive (~102KB)
- `js/` — 13 behavior scripts + `vendor/` (jQuery, Webflow runtime, GSAP + SplitText/ScrollTrigger/ScrollToPlugin/Observer/MorphSVGPlugin, Lenis, SplitType, CircleType)
- `assets/` — 79 files: images (png/webp/avif/svg), Editorial New + Fira Code + Vazirmatn fonts, 46MB `scene2` video, Lottie scenes
- `screenshots/` — `original.png` (live site, 1920×25247 full page) and `clone.png` (this clone)
- `source.html` — the live HTML captured for reference

## Faithfully reproduced

- Full DOM structure of the Webflow export, including `data-w-id` interaction attributes
- Loader sequence, hero text reveal, scroll-triggered section animations
- CTA SVG morph (MorphSVGPlugin), process wheel with circular text, work slider
- All fonts, the hero/process video, Lottie scenes, and image assets from the live site
- Responsive behavior via the dedicated `05-responsive.css` sheet
- Layout metrics verified against the live site with an automated browser probe (see `analysis.md`)

## Approximated

- GSAP club plugins are vendored copies captured from the live site's public bundles; behavior matches but licensing belongs to the original
- Webflow's own interactions runtime is included, but any CMS-driven content (work items) is frozen as static markup
- Smooth-scroll feel is Lenis with default config; exact damping parameters were not extracted