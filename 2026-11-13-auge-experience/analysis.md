# AUGE Experience — Technical Breakdown (auge-xp.com)

Design study of the Awwwards Site of the Day **AUGE Experience** (https://auge-xp.com),
reproduced as a static clone in this directory. This document analyzes the *original*;
`README.md` describes what the clone reproduces.

## 1. Stack of the original

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router, Turbopack chunks, RSC flight payload in `self.__next_f.push`) |
| Styling | Tailwind CSS v4 (CSS-first tokens, `--text-content-*`, `--grid-*` custom props) |
| CMS | Prismic (`images.prismic.io/auge-xp/...` for covers, project metadata embedded in the flight payload) |
| Rendering | Heavy **WebGL** layer ("GL surface"): `data-gl-card`, `data-gl-clip`, `data-gl-image`, `data-gl-text`, `data-letter-push` attributes. DOM holds semantic/SEO copies; the visible imagery *and typography* of the hero are drawn to a canvas |
| Text / video media | Prismic-hosted JPG posters + Vimeo progressive MP4 (some cards are video thumbnails) |
| Analytics / consent | Google Analytics (`G-X86YG35VY7`), Cookiebot |
| Fallbacks | `data-surface-flat` retreat mode when `(hover:none)` / reduced-motion / repeated GL crashes; `data-rotate-lock` rotation gate for tablets |

The RSC payload reveals custom React providers: `SharedElementTransitionProvider`,
`PageReadyProvider`, `PageCurtainProvider`, `CursorLabelProvider`, `NavMenuProvider`,
`AccentSurfaceProvider`, `ScrollReset`, `ResizeReload` — i.e. a bespoke page-transition,
cursor-label and accent-surface system, plus WebGL-powered shared-element transitions.

## 2. Design tokens (extracted verbatim from the build CSS)

```css
--color-background: #edeee5;   /* warm bone/cream */
--color-foreground: #000000;   /* pure black ink  */
--color-accent:     #fdf48b;   /* pale yellow     */

--spacing-gutter-desktop: max(20px, 2.08333vw);   /* 40px @1920 */
--spacing-gutter-mobile:  20px;
--grid-gap-desktop:       max(10px, 1.04167vw);   /* 20px @1920 */
--grid-mobile:  repeat(4, minmax(0,1fr));
--grid-desktop: repeat(12, minmax(0,1fr));

--text-content-xs: 10px/1.3;  --text-content-sm: 13px/1.25;
--text-content-md: 18px/1.2;  --text-content-lg: 24px/1.25;
--text-content-xl: 58px/1.2;  --text-content-nav: 38px/1.2;
--content-shift-distance: 40px;
```

## 3. Typography

| Font | File (original) | Use |
|---|---|---|
| **Greed Bold** | `Greed_Bold-s.p.2gpcionblp7lf.woff2` | Display: giant `AUGE` wordmark, project titles (uppercase, `leading-[0.85]`, negative margin clip trick `-mt-[0.25em] -mb-[0.075em]` to avoid clipping glyph overshoot) |
| **PP Neue Montreal** Regular/Medium | `PPNeueMontreal_Regular/Medium-*.woff2` | UI/body: pitch paragraph, footer legal, categories |
| **Farnham Display Light Italic** | `FarnhamDisplay_LightItal-s.p.3gea0llkgbqgb.woff2` | The word "Experience" in the preloader (serif italic contrast against the grotesk) |

Each webfont ships with a metrics-matched `local(Arial)` fallback via
`ascent-override / descent-override / size-adjust` @font-face rules to kill CLS.

Notable: the visible `h1` on the home page literally contains `RCCS YFZVYTYHHV©` —
a **cipher of "AUGE EXPERIENCE©"** used as the scramble source; the real string is `sr-only`
for accessibility while the GL text decodes on screen. The same pattern is used for the
`AUGE` wordmark (`role="img"` + per-letter `data-letter-push` spans).

## 4. Layout system

* Full-viewport, **non-scrolling** page (`h-dvh overflow-hidden touch-none select-none`).
* Vertical split: **60vh** hero (project carousel) + **40vh** base (wordmark + pitch).
* Carousel: each `data-gl-card` is `absolute top-0 left-0` — the WebGL layer positions,
  widths and animates cards; the DOM is just a template. Images are wrapped in
  `data-gl-alpha` with a `-inset-x-[15%]` overscan used for soft alpha edge blending
  between adjacent covers.
* Captions: Greed Bold multi-line titles (one `data-gl-clip` mask per line,
  `translateY(var(--text-content-md))` = hidden state, revealed on load), plus an
  uppercase category line.
* Base band: 12-col grid; wordmark occupies cols 1–6 (`absolute bottom-0`, `leading-[0.75]`),
  pitch text sits at **col 8** (`col-start-8`, justify-end) — pitch column starts at x=1125 @1920.
* Chrome: logo top-right (`mix-blend-difference`, with 4 stacked duplicate layers for a
  GL flicker/echo effect), legal + sound toggle bottom-left, socials bottom-right,
  menu button (60×40 black rounded, 2 accent bars) above the socials.

## 5. Animation techniques

* **Infinite virtual-scroll carousel** — wheel/pointer driven, positions lerped in the GL
  render loop (no native scroll; `history.scrollRestoration = "manual"`). Cards wrap around
  the list (the DOM list is already duplicated ×2 by the server for seamless looping).
* **Arc-mask page transitions** — `--mask-arc` CSS var drives
  `border-radius: calc(var(--mask-arc) * 50%) / calc(var(--mask-arc) * 299px)` on both the
  loader mask and the `data-curtain` transition layer: an expanding ellipse "arc wipe".
* **Preloader** — black arc backdrop, `AUGE` (Greed, 58px) + `Experience` (Farnham italic,
  24px) center, percent counter bottom-center, all `mix-blend-difference`.
* **Text scramble/decode** — cipher → plain-text decode on load (see §3).
* **Per-letter hover physics** — `data-letter-push` spans on the wordmark and the logo
  echo layers (springy letter push).
* **Cursor system** — 11×11 accent diamond rotated 45° (`translate(-50%,-50%) rotate(45deg)`),
  difference blend, with a morphing label variant (`CursorLabelProvider`) that expands to
  a pill with text on interactive targets.
* **Accent hover wipes** — nav/footer links have a paired `bg-accent` element animated with
  `clip-path: inset(0 100% 0 0)` → horizontal wipe fill on hover.
* **Menu** — the 60×40 button container (`overflow-hidden`) expands in place into a panel
  containing the 38px nav (`Works / About / Let's talk`), links revealed with clipped
  translate stagger; `mix-blend-difference` everywhere keeps chrome legible over imagery.
* **Sound** — footer mute toggle animates wave/cross SVG groups.

## 6. Notable implementation details

* Everything visible is duplicated: semantic DOM (for SEO/a11y/flat-fallback) + GL canvas
  rendering. Attributes like `data-gl-clip`, `data-gl-text`, `data-reveal-root` let the GL
  layer find and take over elements.
* `data-page-content-dim` (black overlay, opacity 0) dims the page behind the open menu.
* Cookiebot consent + GA are injected before interactive; the cookie modal (visible in the
  reference screenshot) is third-party chrome, not part of the site design.
* The site is bilingual-ready (`/en` locale route in the RSC payload) with i18n message
  dictionaries (`footer.copyright`, `project.viewproject`, `rotation.↻|Rotate device`…).
* The clone keeps the GSAP dependency (CDN, as instructed) for the ticker, quickTo,
  timelines and easing, replacing the bespoke WebGL engine with DOM/CSS transforms
  (translate3d card positions, velocity skew, image parallax) that read the same.
