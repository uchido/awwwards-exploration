# Heron AI — Technical Analysis (heronaiapp.com)

Original: https://heronaiapp.com/ · Awwwards: https://www.awwwards.com/sites/heron-ai
Snapshot studied: Webflow publish Mon Sep 21 2026. Concept credit on-site: Bearplus agency.

## 1. Stack
- **Webflow** (`data-wf-page`, `heronai.webflow.shared.*.min.css`, Webflow Interactions runtime). No Next.js/React.
- **CDN assets** on `cdn.prod.website-files.com` (images: WebP/AVIF/JPG, SVG deco, woff2 fonts).
- **Third-party scripts**: Google Tag Manager (`G-N1KKXK6ZR5`), Mixpanel (autocapture, session replay 10%), Microsoft Clarity (`xxzxds4q6a`), Lenis smooth-scroll (`lenis-smooth`), GSAP + ScrollTrigger via jsdelivr/unpkg, Barba.js page transitions (`data-barba="wrapper"`), Bearplus analytics (`cdnwf-prod.bear.plus`).
- **SEO**: JSON-LD `SoftwareApplication` schema, OG/Twitter meta, sitemap-style subpages (`/pricing`, `/heron-chat-widget`, `/heron-dashboard`, `/resources`).

## 2. Layout system
- Root font hack: `html { font-size: 0.5787vw }` desktop (≈ 8.3px at 1440w), `1.199vw` tablet, `2.54vw` mobile — so all `rem` spacing/type scales fluidly with viewport (classic Bearplus/Webflow technique).
- 12-col Webflow grid via `.w-container` / `.container.grid`, max-width ≈ 1720px.
- **Blueprint frame motif**: fixed `.main-deco` 1px lines + corner `+` marks + dashed ruler strips (`repeating-linear-gradient`) around hero; `--trans-percent`/`--size--line` CSS vars animate frame lines on scroll.
- Sections separated by hairline borders (`--size--border: max(1px, .1rem)`), color `var(--content--border) #B3B3AF`.
- Sticky/pinned storytelling: `.home-map-main { height: 700dvh }` pinned scrollytelling for violation cards; `.home-why-sticky-item` alternating grid columns.

## 3. Typography
- **Display: BT Grotesk** (Regular/Medium/SemiBold/Bold + italics, self-hosted woff2) — tight grotesk, uppercase headlines, `letter-spacing: -.02em`.
  - Scale (desktop rem at 0.578vw base): h1 5.6rem, h2 4.8rem, h3 4.0rem, h4 3.2rem, h5 2.8rem, h6 2.4rem, body 1.6rem/1.3.
- **Mono labels: GeistMono Medium** — eyebrows, nav, coordinates (`X: 1131 PX`), buttons (`txt-14` = 1.4rem uppercase).
- Trimming trick: `.trim-textbox` uses `lh`/`em` negative margins + `::before/::after` tables to optically crop line-box whitespace.

## 4. Color palette
| Token | Value | Use |
|---|---|---|
| `--content--primary` | `#282828` | ink, text, lines |
| `--content--secondary` | `#414140` | soft ink |
| `--content--terriary` | `#282828B8` | body text |
| `--content--surface` | `#72726F` | muted |
| `--content--disable` | `#B4B4B0` | disabled |
| `--content--border` | `#B3B3AF` | hairlines |
| `--content--brand` | `#FA3600` | accent (CTAs, active codes, selection `#E15C46` variant) |
| paper bg | `#EDECE4–#F4F3EC` + grain SVG `bg.svg` tile | page texture |
| grid deco | `bg-deco.svg` 6.4rem grid | hover overlays |

## 5. Animation techniques (GSAP focus)
- **GSAP 3 + ScrollTrigger** (CDN) drives: line-mask headline reveals (`.bp-mask-line-mask` overflow + y-translate per line), image clip-path wipes (`--img-clippath: inset()`), pinned map/violation sequence (700dvh scrub, cards fade/slide, `home-map-number` hotspots), parallax hero sketch layers, marquee tickers (also pure-CSS `marqueeLeft/Right 30s linear infinite` fallback).
- **SVG draw-on**: problem-section icons use `stroke-dasharray: var(--path-length)` + `--dash-delay/--dash-step` staggered dash animations (`manual/automation/blind/slow` groups, ~36s custom keyframes).
- **Button micro-interactions** (pure CSS): `.btn-fill` dual-label roll (`label-top`/`-bot` translateY), sliding `::after` fill, diagonal arrow icons swapping quadrants; `hover-un` underline scaleX; FAQ plus-icon `rotate-icon steps(1)` loop.
- **Loading sequence**: JS-driven percent + task list (`001 INITIALIZE…010 START EXECUTION`), logo hexagon `stroke-dasharray` draw, then Barba transition + Lenis start. Mobile (`≤767px`) disables most init (`[df-init] opacity:1` fallback).
- **Custom cursor** (`.cursor-main`) lerped via rAF; magnetic hover on CTAs; displacement hover filters (`#sharedDisplacementFilter` feTurbulence + feDisplacementMap) on imagery.

## 6. Notable implementation details
- Mask-image button fills (`-webkit-mask-image` 2000% sprite) for grainy wipe effect.
- `mix-blend-mode: multiply` on sketch imagery so black linework fuses with paper grain.
- Filter `#path-filter` (fractalNoise displacement scale 2) roughens vector edges for hand-drawn feel.
- Cookie banner is a custom Webflow component (`#heron-cookie-root`), not OneTrust.
- Accessibility gaps in original: tiny mono labels, low-contrast muted text, drag-only hint — preserved visually but buttons given real `<button>` semantics in clone.
