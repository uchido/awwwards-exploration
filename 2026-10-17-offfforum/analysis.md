# Technical Analysis — OFFFORUM (offforum.com)

Awwwards Site of the Day, 2026-10-17. Analysis based on the live HTML (`source.html`, 451 KB Nuxt-rendered document) and the original compiled stylesheet captured during cloning.

## Stack

- **Nuxt 3 (Vue)** — asset paths like `/_nuxt/entry.CI2s3_W4.css` and hashed JS chunks in `.work/js/` confirm a Vite-built Nuxt SPA.
- **Tailwind CSS v4** — the compiled `entry` stylesheet is a Tailwind v4 build; all design tokens were extracted from it verbatim into `css/tokens.css`.
- **GSAP + ScrollTrigger** — loaded from CDN with a vendored local fallback (`assets/vendor/`).

## Layout system

Single-page layout, 1608px total scroll height at 1920×1080:

- Hero: full-viewport (1080px) background video with poster fallback.
- Footer: 528px block with the oversized wordmark revealed on scroll.
- Root font-size is **62.5%**, so `1rem === 10px`; the original uses `--spacing: 0.1rem` (i.e. 1px) as its base spacing unit.
- Gutters: 4px mobile, doubling to 8px at ≥1024px. Header height is fluid on ≥768px: `calc(6.42755vw + 27.8864px)`.

## Typography

Two families, both downloaded from the live site:

- **Baikal** (SemiBold 600, sans) — display/body voice. `Baikal-SemiBold.woff2`.
- **Forvm** (Roman 400, serif) — buttons, tags, and the "FORUM" headings. `Forvm-Roman.woff2`.

Full scale reproduced in `css/tokens.css`: e.g. desktop H1 OFFF 8rem/7.7rem at −0.04em, desktop H1 FORUM 7.6rem/7.3rem at −0.02em, body 2.4rem/2.6rem.

## Color palette

From the original tokens: `#000` (black), `#fff` (white), `#ee3338` (red accent), `#c5c5c5` (grey).

## Animation & interaction techniques

- **Footer wordmark reveal** — GSAP + ScrollTrigger scrub, mapped to the same trigger start/end as the original Vue component (`js/main.js`).
- **Smooth scroll** — the original uses Lenis to drive ScrollTrigger; the clone substitutes a dependency-free lerp wheel smoother that keeps a `--scroll` CSS custom property in sync (`js/smooth-scroll.js`), skipped for touch/reduced-motion users.
- **Page (route) transitions** — CSS keyframe transitions reproduced in `css/transitions.css`.
- **Cookie consent manager** — bottom-right dialog, rebuilt in `css/consent.css` with the original's pill dimensions (`--box-radius: 100px` etc.).
- **Hero video autoplay guard** — play() is promise-guarded and a poster image covers browsers that block autoplay.
- Easing tokens preserved: `cubic-bezier(0.76, 0, 0.24, 1)` (quart), `(0.87, 0, 0.13, 1)` (expo), `(0.32, 0.94, 0.6, 1)` (power2-out-ish).

## QA results (from the cloning run)

Measured at 1920×1080 against the live site:

- `scrollHeight` 1608 (identical), hero 1080, footer top at 1080.
- Element boxes within ~1px of the original (e.g. content box 314.7×138 vs original 314×137).
- Full-page pixel diff: overall MAE 20.36; bands y0–1320 MAE 1.6–7.6 (excellent match). The y1320–1560 band diffs (~106–131) is explained by the original capture being mid-animation on the footer logo reveal.