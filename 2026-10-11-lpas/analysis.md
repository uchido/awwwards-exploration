# LPAS (lpas.com) — Technical Breakdown

Original: **LPAS Architecture + Interiors** — `https://lpas.com/` (WordPress homepage, "We’re a process driven architecture and interior design studio").

## 1. Stack
- **CMS:** WordPress (body classes `wp-singular`, `page-template-page-home`, theme slug `lpas`, `wp-theme-lpas`). Yoast SEO v28.6 (meta/OG/JSON-LD, canonical, `og:image` = `Contact-LPAS.jpg` 2500×985).
- **Theme build:** custom theme `lpas` ("Forest" asset handle). Vite-style hashed bundles in `/wp-content/themes/lpas/dist/assets/`:
  - `main-DN-9Dm9S.css` (~158 KB, all site CSS)
  - `main-DWS2mxMG.js` (site runtime), `swup-config-DoT-9FzL.js`, `preloader-CQAQSTAa.js`, `lenisSmooth-BjXMsNId.js` — all loaded as ES modules (`type="...-module"`, Cloudflare Rocket Loader in front).
- **Page transitions:** Swup (`swup-config`, `data-swup-animation`, `data-swup-preload`, `data-swup-parallel`, `data-history-back` close button) — prefetches internal links (`/*` except `/wp-*`, uploads, query strings).
- **Smooth scroll:** Lenis (`lenisSmooth` module; `overflow-x:clip` on body, sticky/pinned sections imply Lenis + ScrollTrigger pairing).
- **Animation:** GSAP + ScrollTrigger pattern throughout (sticky hero, `will-change:transform,opacity`, parallax `data-imageanimate`, clip-path reveals, `data-showblob` cursor, `data-btnhover`/`data-buttonarrow-hover` hovers). The main bundle contains the GSAP usage; markup exposes ~40 `data-color`, `data-open`, `data-control` (Preloader, NavigationMain, BlockIntroGeneral, PortfolioFilter, HighlightedButton, NavigationFooter) hooks for a small component framework.
- **Video:** hero/preloader background is a Vimeo progressive MP4 redirect (`player.vimeo.com/progressive_redirect/playback/1147329730/rendition/1080p/…mp4`, poster `LPAS-office-thumbnail.jpg`, `autoplay muted loop playsinline`).
- **Images:** WordPress responsive pipeline — every photo shipped as `<picture>` with `.webp` + `.jpg` `srcset` at 375 / 678 / 992 / 1280px (`-…-c-default` crops), `sizes=auto`, `contain-intrinsic-size:3000px 1500px` to avoid CLS.

## 2. Layout system
- Fl builders: CSS grid with named lines — mobile `repeat(4,100px)`, → 6 → 12 → 20 columns (`repeat(20,minmax(50px,80px))`) with `full/main` areas, `--row-gap:0; --column-gap:1rem`, page capped ~1600–1760px with `minmax(1.5rem→4rem,1fr)` gutters.
- **Hero (`homeHero`):** `100svh` sticky stage (`grid-template-rows:100svh auto`). Top meta row (`homeHero__detail--one/two/three`: "Architecture + Interiors / A Market-Focused Approach / Swipe up to explore"), giant `h1.font-3XL` bottom-left with circular `+ / eye` button (`buttonCircle--plus`). Below the fold: 5 market cards (`homeHero__card`), each `72% color panel / 28% image` on the reference viewport — color panel holds sub-page links, title, subtitle, count (`1/5…5/5`), clipped thumbnail (`clip-path` corner cut `--cut:2rem`); right side full-height photo with `brightness(.7)` and an "Explore" blob cursor (`data-showblob="Explore"`).
- **Intro (`blockIntroGeneral`):** `h2.font-XXL` statement + `h3.font-S` tagline + paragraph + `buttonArrow` link ("More about us").
- **Work (`blockProjectsHighlight`):** header (`font-L` + "All projects" pill `buttonArrow--icon`), filter bar (`portfolioFilter`: Housing 30 / Interiors 17 / Higher Education 13 / Civic 6 / Commercial …), then two staggered layouts (`layoutOne`: 1 large + 2 small; `layoutTwo`: 3 small + offsets) — editorial overlapping grid with large top margins.
- **Latest (`globalLatestOverview`):** 6 `listItem` rows (source · excerpt · date `05.12.26` · circular arrow `buttonArrow--no-title`), hover underline/slide, plus hidden hover image column (`globalLatestOverview__images`).
- **Footer (`navigationFooter`):** full-viewport image panel (`navigationFooter__topSection`, bg photo `scale(1.4)` + dark overlay, "Our Focus" menu + "Explore our Portfolio") over a sticky dark bar (`#262626`, contacts Sacramento/Oakland, socials, bottom menu marquee, "Back to top", `© 2026 … Website by Naam`).

## 3. Typography
- **Face:** `Aeonik` (self-hosted woff + woff2: Light 300 / Regular 400 / SemiBold 600 + italics, `font-display:fallback`).
- **Scale:** `font-3XL clamp(4.6rem,.25rem+5.66vw,7.5rem)/100%` (hero + preloader words), `font-XXL clamp(4.4rem,….+5.36vw,5.6rem)/110%` (statements), `XL/L/M/S/XS` down to `XS 1.15rem uppercase`. Root `font-size:62.5%` (1.6rem body). Tight tracking (`letter-spacing:0`), sentence-case headlines, uppercase micro-labels.
- Logo is an SVG sprite (`#icon-logo` via `<use>`), icons (`eye, close, Arrow`) same sprite system.

## 4. Color palette
- Base: white `#fff` page, ink `#262626` (off-black), `#595656 coal`, `#747474 grey`, `#a3a3a3 stone`, `#d6d6d6 slate`, `#ececec mist`, `#f8f8f8 wash`, sky `#abcff9`.
- **Market system** via `[data-marketcolor]` CSS vars (`--marketMainColor / --marketSecondaryColor / --marketContentColor / --marketContentContrast`):
  - housing `rgb(98,86,83)` / white text; interiors `rgb(146,84,52)` / white; higherEducation `rgb(201,211,223)` / dark; civic `rgb(112,117,105)` / white; commercial `rgb(227,193,170)` / dark; sand `rgb(202,159,122)` / dark.
- Cards, footer bar, menu pills and filter counts inherit the active market's vars — the whole chrome re-themes per market.

## 5. Animation techniques (GSAP usage)
- **Preloader:** LPAS acronym unfolds (Listen/Plan/Analyze/Shape, `preloader__wordFl/Rl` split letters), progress image (`preloader__imageWrapper` video), then curtain `translateY(-101%)` reveal.
- **Hero:** background `scale(1.12→1)` + `brightness(.5)`, title line-mask slide-ups, meta fade; on scroll the stage stays `sticky` while market cards scroll over / pin with scrub parallax (`yPercent` on images, panels `xPercent`).
- **Scroll reveals:** every section uses ScrollTrigger starts like `top 88%`/`top 80%`: fade-up text, `scale(1.12→1)` + `clip-path` image unveils, word-by-word statement scrub (`Clear Process. Creative Results…`), footer bg `scale(1.4→1)` scrub.
- **Hovers:** magnetic/underline links (`buttonLine` dual-line wipe), arrow buttons with twin sliding arrows (`icon--Arrow1/2`), card image zoom `scale(1.06)`, footer menu blur-others (`filter:blur(.2rem)` on siblings), circular `buttonCircle` fill wipe (`buttonCircle__background`).
- **Nav:** hamburger morphs Menu↔Close, overlay `clip-path:inset()` wipe with staggered link entrances; `marketsMenu` "Shift your focus" dropdown re-tints via market vars.

## 6. Notable implementation details
- `data-grid="grid-template"` + subgrid footers; `contain:paint` on image wrappers; `backface-visibility:hidden; transform:translateZ(0)` on all sliding photos (compositor promotion).
- Accessibility touches: `aria-label`s on logo/cards/video, `aria-expanded/controls` menu, `focus-visible` dashed outlines, `prefers-reduced-motion` would gate the above (clone adds it via GSAP guard).
- Favicon set: `cropped-icon-{32,180,192,270}.png`.
- Robots: `index,follow`; RSS `/feed/`; sitemap via Yoast; contact e-mails Cloudflare-obfuscated.
