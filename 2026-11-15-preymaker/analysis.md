# Preymaker — Site Analysis

Reference: <https://preymaker.com/>  
Analyzed from `source.html` (3.45 MB server-rendered Next.js document), the compiled
CSS in `css/`, the downloaded media in `assets/`, and a 1920×1080 reference
screenshot in `screenshots/original.png`.

## 1. What the original is

Preymaker is a creative-production studio site built as a single, long-scrolling
home page. The original is a Next.js App Router site with React Server
Components, Sanity-hosted image derivatives, CSS Modules, and a client runtime
combining GSAP with a Locomotive-style smooth scroller. All of the visual
content on the home page is media-led: full-bleed video, project stills and
previews, oversized typography, and very little chrome.

The home page is permanently wrapped in a dark theme. It does not expose a
light/dark switch.

## 2. Information architecture

The page is one continuous scroll inside `#scroll-wrapper` /`#scroll-content`:

| Section | Desktop height at 1920px | Purpose |
| --- | ---: | --- |
| Hero | 1080px | Full-screen wings video, main statement, scroll cue |
| Sticky work | 8493px | Three tall pinned project panels driven by scroll progress |
| Work cards | 2873px | Ten selected projects in an asymmetric grid |
| Large paragraph | 2395px | Large word-by-word studio statement |
| Partners | 1371px | 21-client logo list with hover-linked logo display |
| News | 820px | Three news items and “see all news” links |
| Footer | 1080px | Contact, credits, next-page media, sticky reveal |

The fixed UI sits outside the scroller: logo/nav, menu button, custom cursor,
cookie banner, full-screen menu, search, partners modal, and video modal.

## 3. Visual system

### Colour

The palette is almost entirely monochrome:

- `--black: #000000` — page and video backgrounds
- `--white: #f1f3f5` — primary type and dark-theme foreground
- `--pure-white: #ffffff` — cookie banner surface
- `--mid-grey-shade: #859099` — secondary text / copied state
- `--mid-grey` / `--grey-shade` / `--grey` — secondary cool greys

The visual hierarchy comes from scale, crop, motion, and contrast rather than
accent colour. The cookie banner is deliberately the only bright white surface.

### Typography

- Typeface: **NewGrotesk**, self-hosted in four weights (400, 500, 600, 700),
  with a local `NewGrotesk Fallback`.
- Grotesque, tightly set, negative tracking; display copy is uppercase
  (`heading-*`, `text-xl`) while body copy stays sentence case.
- Fluid root font size: `calc(100vw / 1440 * 10)` on the desktop breakpoint.
  At 1440px, `1rem = 10px`; at 1920px, `1rem ≈ 13.33px`.
- The `text-xl` hero statement is `4rem`: 40px at 1440 and ≈53.3px at 1920,
  with ≈1.05 line-height and ≈−0.02em tracking.
- Small labels/buttons are `1.2rem`–`1.4rem` and uppercase.

### Grid and spacing

- 12-column desktop grid, 4-column mobile grid.
- `--grid-margin: 1.2rem`, `--grid-gutter: 0.4rem`.
- Spacing steps: `0.2 / 0.4 / 0.8 / 1.2 / 2rem`.
- Asymmetric placements are common: project cards step across columns, section
  headings sit in narrow columns, footer links occupy a separate 12-column row.

### Media treatment

- Video is always muted, looped, inline, and object-fit: cover.
- Hover states swap stills for motion rather than adding colour or borders.
- Images use cover crops with slow scale/parallax driven by CSS custom
  properties (`--progress`, `--hero-entrance`).
- Posters are blurred low-resolution placeholders that sit behind video.

## 4. Section behaviour

### Hero

Full-viewport `wings-v8` video with a centred, four-line statement. On load the
hero title reveals line-by-line through overflow masks while the video scales
from a tighter crop. A small “Scroll Down” cue fades in after the entrance.
Scrolling updates `--progress` on `.hero_wrapper`, which scales and drifts the
video.

### Sticky work panels

Three articles stack inside a tall sticky section. Each panel is held while its
progress variable advances, producing slow media scale/translation. Panels use
`data-cursor="pointer"` and `data-content="View Work"` so the custom cursor
turns into a white “View Work” pill.

### Work cards

Ten `.work_cards_card` elements use `data-animation="slide-up"` and staggered
delays. Each card contains a title, category tag, and a still/video pair. The
videos are paused by default and play on hover. The grid alternates left, centre,
right, and sub-column placements.

### Large paragraph

A studio manifesto set at display size. Individual words sit inside clipped
wrappers and translate from below with a stagger, creating a soft wave rather
than a single block fade.

### Partners

A list of 21 brands on the left, a single large logo on the right. Hovering a
brand swaps the visible SVG logo and moves the logo strip vertically toward the
hovered row. The logo assets mix SVGs and transparent PNGs because several
brands only supplied raster marks.

### News

Three article cards with large stills. Figures start slightly low and transparent
and ease into place with per-card delays. Header and footer links use the same
masked text reveal as other headings.

### Footer

A 40vh contact/credits block followed by a 60vh sticky media panel. The media
panel is clipped to the footer width and pinned at `top: 40vh`; its image scales
from 1.3 to 1.0 as the footer completes its scroll progress. Contact email is a
copy-to-clipboard button with a temporary “Copied” label.

## 5. Interaction and motion inventory

1. **Preloader** — black overlay, masked Preymaker mark, character-masked
   “Loading…”, and a `000%`–`100%` counter. The page becomes visible as the
   overlay fades.
2. **Menu** — full-screen light panel revealed by a clip-path wipe. Page links
   and section labels rise line-by-line; horizontal rules scale in. Closes via
   the button, backdrop, or Escape.
3. **Custom cursor** — fixed, pointer-events: none, offset by 25%/50%; follows
   the pointer with `gsap.quickTo`. Contextual hover targets show a label.
4. **Scroll reveals** — `data-animation` elements get `.is-inview` when their
   trigger enters; CSS handles the actual transform/opacity transition.
5. **Scroll progress** — a Locomotive-compatible `--progress` custom property is
   written on `[data-scroll-css-progress]` elements for media parallax and
   scaling.
6. **Cookie banner** — fixed bottom-left white pill; opens from height 0 to its
   header height after load. “Manage” expands the settings copy; “Accept All”
   collapses and removes it.
7. **Copy email** — writes `hello@preymaker.com` to the clipboard and shows a
   temporary confirmation.
8. **Media playback** — hero video autoplays muted; in-view videos play/pause
   through IntersectionObserver; project cards also play on hover.

## 6. Clone implementation

### Approach

- Reused the original server-rendered markup from `source.html` so class names,
  accessibility attributes, media sources, and section order match the source.
- Rewrote Next/Sanity URLs to local `assets/` paths and internal routes to
  placeholder `#` links, since only the home page is in scope.
- Kept the original compiled CSS files unchanged and added `css/clone.css` only
  for text-split masks, the inlined preloader mask, and small integration fixes.
- Reimplemented the client runtime in `js/main.js` with vanilla JS plus
  GSAP/ScrollTrigger from jsDelivr.
- Used `#scroll-wrapper` as the ScrollTrigger scroller, matching the original
  overflow-scroller architecture.
- Replaced the Locomotive progress event with a small `requestAnimationFrame`
  scroll listener that writes `--progress` to the marked elements.
- Recreated the client-only preloader/menu/cookie/copy behaviour without React.

### Source observations

- The original CSS is minified into four files, so `wc -l` reports 0 lines even
  though the files contain tens of kilobytes. They are not empty.
- The client splits text into nested `div` wrappers at runtime; the server HTML
  contains plain text. The clone performs the same split before animations run.
- The preloader SVG mask is referenced from CSS. Under `file://`, Chrome blocks
  that mask fetch as a cross-origin request, so the clone inlines the same SVG
  as a base64 data URI.
- The original uses a dark home theme; the clone sets `data-theme="dark"` on the
  root at startup instead of toggling themes.
- The original’s `#scroll-wrapper` is an overflow scroller rather than the body.
  Window scroll listeners and default ScrollTrigger scrollers do not work; using
  the wrapper as the scroller is required for reveals and progress to update.

## 7. Differences and limitations

- **Single page only.** Case-study, showreel, people, and contact routes are not
  reproduced; internal links are inert placeholders.
- **No backend/CMS.** All content is static HTML; Sanity CDN transformations and
  RSC data fetching are removed.
- **Smooth scrolling is native.** The Locomotive/Lenis easing is approximated
  with native scrolling plus the progress engine. The scroll distance and
  pinned-section behaviour are preserved, but the inertia curve is not identical.
- **Partner/search/video modals** exist in the markup but are not populated with
  the original client-side lists; the partner button and disabled search control
  are left non-functional.
- **Media timing differs.** Video frames depend on network/disk speed, so
  pixel comparisons against the reference screenshot differ mainly inside video
  areas.
- **Some interaction states are approximations.** Nav, menu, cookie, reveal, and
  cursor timings were tuned by eye against the compiled CSS and reference
  screenshot rather than extracted frame-for-frame from the original runtime.

## 8. Verification performed

- Rendered at 1920×1080, 1440×900, and 390×844 in headless Chromium.
- No horizontal overflow at the tested widths.
- No broken local images after a full scroll sweep.
- No runtime exceptions and no missing local assets in the final pass.
- Cookie banner, menu open/close, footer image injection, and preloader
  completion were checked through CDP.
- Top-of-page pixel comparison against `screenshots/original.png` differs mainly
  in the hero video frame and unavoidable anti-aliasing.
