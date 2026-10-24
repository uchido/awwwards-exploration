# ESR Bespoke — Technical Analysis

**Original site:** https://www.esrbespoke.au/  
**Awwwards page:** https://www.awwwards.com/sites/esr-bespoke  
**Site by:** [Nightjar](https://nightjar.co)  
**Analysis date:** 2026-10-24

---

## Stack & Build

- **Framework:** Next.js 14 (App Router) — evident from `_next/static/` asset paths, `data-n-g`/`data-n-p` stylesheet markers, and `__NEXT_DATA__` bootstrap script.
- **Styling:** Tailwind CSS v3 (JIT) — all utility classes in source HTML (`grid-layout`, `clip`, `mono`, `roll`, `h0`, `large-body`, aspect-ratio utilities, `md:`/`downMd:` responsive variants).
- **Fonts:** Self-hosted WOFF2 via `next/font` (preload links with `data-next-font="size-adjust"`).
- **Animation:** GSAP 3 + ScrollTrigger (loaded via CDN in clone; original likely bundled).
- **Smooth scroll:** Custom Lenis-style implementation (original uses `@studio-freight/lenis` or similar — `wheel` listener with `passive: false`, rAF lerp).
- **Carousel:** Keen-Slider or custom drag implementation (gallery section uses pointer drag with rubber-band).
- **Images:** Sanity CDN (`cdn.sanity.io/images/...`) with on-the-fly transforms (`rect=`, `w=`, `h=`, `auto=format`).
- **Deployment:** Vercel (standard for Next.js).

---

## Layout System

### Grid
- **Mobile (≤1023px):** 6-column grid, 1rem gap, 1.125rem (18px) gutter.
- **Desktop (≥1024px):** 12-column grid, 1rem gap, 2rem (32px) gutter.
- Implemented via CSS custom properties `--col-count` and `--gutter` on `:root` with media query override.
- `.grid-layout` utility: `display: grid; grid-template-columns: repeat(var(--col-count), minmax(0, 1fr)); gap: 1rem;`

### Section Rhythm
- Large vertical spacing between sections (e.g., `mb-8` → 2rem, `mb-14` → 3.5rem, `py-[17.375rem]` ≈ 278px).
- Footer pinned on desktop: `position: fixed; inset: 0; min-height: 100svh;` with internal grid layout.
- Hero: `min-height: 100svh`, content pinned to bottom via `padding-top: 44vh` (desktop) / `20vh` (mobile).
- Gallery: `aspect-ratio: 0.8` mobile, `height: 100svh` desktop.
- Marques body: `min-height: 100svh` desktop with sticky media column (`position: sticky; top: calc(50vh - 20%);`).

### Clipping & Overflow
- `.clip` utility: `clip-path: inset(0 0 0 0);` used on hero, gallery, marques, footer for clean edge masking during animations.
- `overflow-x: hidden` on body; `overflow: hidden` on body when menu open (`.is-locked`).

---

## Typography

### Font Families
| Role | Font | Source | Weights/Styles |
|------|------|--------|----------------|
| Body / UI | **FK Grotesk** (Fontfabric "FK" foundry) | Self-hosted WOFF2 | Regular, Italic, Medium, Medium Italic |
| Mono / Labels / UI | **Regular Book** | Self-hosted WOFF2 | Regular only |

### Type Scale (Tailwind-computed)
| Class | Mobile | Desktop | Line-height | Weight | Letter-spacing |
|-------|--------|---------|-------------|--------|----------------|
| `h1` / `.h1` | 2.375rem (38px) | 3.875rem (62px) | 0.95em / 1.11 | 500 | -0.01em |
| `.h0` (marque names) | 2.375rem | 5.75rem (92px) | 0.89em / 1.11 | 500 | -0.01em |
| `.mono` | 0.875rem (14px) | 0.875rem | 1 | 400 | 0.09em |
| `.large-body` | 1.25rem (20px) | 2.5rem (40px) | 1 | 300 | -0.01em |
| Body (default) | 1.125rem (18px) | 1.125rem | 1.3 | 300 | — |

### Text Treatments
- **Roll effect** (`.roll`): dual `.roll__inner` spans; hover rolls text up (`y: -100%` → `0`) with `cubic-bezier(0.19, 1, 0.22, 1)` ( `--ease-expo-out-2` ).
- **Clip reveals**: `clip-path: inset(0% 0% 100% 0%)` → `inset(0% 0% -12% 0%)` for large body; `inset(0% 0% -10% 0%)` for marque items.
- **Text-wrap: balance** on hero title, footer tagline, services list head.

---

## Color Palette

| Name | Value | Usage |
|------|-------|-------|
| `--foreground` | `#000000` | Primary text, icons, lines |
| `--background` | `#ffffff` | Page background, light sections |
| `--dark-grey` | `#191919` | Hero background |
| `--grey-menu` | `#2b2b2b` | Mobile contact pill, hamburger bg |
| `--border` | `rgba(0,0,0,0.1)` | Light section dividers |
| `--white-border` | `hsla(0,0%,100%,0.1)` | Dark section dividers (services) |

### Marque Accent Colors (background on `.marque-image`)
| Marque | Hex | Notes |
|--------|-----|-------|
| Porsche | `#99bcd6` | Pale blue |
| Bentley | `#070b14` | Near black |
| Ferrari | `#e20508` | Ferrari red |
| Rolls-Royce | `#787776` | Warm grey |
| Aston Martin | `#5c726a` | British racing green |
| Lamborghini | `#4ec208` | Lamborghini green |
| McLaren | `#484643` | Dark graphite |
| Mercedes-AMG | `#cacfd0` | Silver |
| BMW M | `#5f7ba9` | BMW blue |
| Audi RS | `#650506` | Audi red |
| Range Rover | `#040c09` | Dark green-black |
| Maserati | `#04040c` | Deep blue |

---

## Animation Techniques

### GSAP + ScrollTrigger Patterns

1. **Intro Timeline** (page load):
   - Intro logo fade + rise (`y: 30 → 0`, `opacity: 0 → 1`, 1s, expo.out)
   - Intro logo fade out (0.45s)
   - Page rises from `y: 100vh` → `0` (1.45s, expo.inOut)
   - Header roll items stagger (`yPercent: 110 → 0`, 0.9s, stagger 0.06)
   - Nav links fade + rise (`opacity: 0 → 1`, `y: 16 → 0`, stagger 0.05)
   - Hamburger fade in
   - Hero title lines clip-rise (`yPercent: 110 → 0`, stagger 0.09)
   - Hero aside + unmute fade up

2. **Scroll Reveals** (`reveals.js`):
   - Generic `[data-reveal]`: `y: 28, opacity: 0 → 0, 1` (1.1s, expo.out, `start: 'top 88%'`)
   - `[data-reveal="text"]`: clip-path bottom reveal (1.4s, expo.out, `start: 'top 85%'`)
   - Marque items: staggered clip rise (stagger 0.045, `start: 'top 80%'`)
   - Marques media: clip from top (1.2s, `start: 'top 70%'`)
   - Service rows: `x: -18 → 0`, stagger by index modulo 6

3. **Gallery Drag Slider** (`gallery.js`):
   - Pointer-based drag with `pointerdown`/`move`/`up`
   - Rubber-band at ends (0.35x resistance)
   - Velocity + threshold snap to next/prev
   - Click (no drag) advances
   - GSAP `expo.out` 0.9s animate to position
   - ScrollTrigger scrub: image scale `1.12 → 1` as gallery enters viewport

4. **Marques Hover Swap** (`marques.js`):
   - Instant `is-active` toggle on `mouseenter`/`focus` (CSS handles 0.45s cross-fade + scale/blur transition)

5. **Menu Overlay** (`menu.js`):
   - Open: shadow fade (0.5s), menu slide `y: -105% → 0%` (1s expo.out), links stagger rise (0.7s expo.out, stagger 0.05, delay 0.25)
   - Close: links stagger down (0.4s power2.in), menu slide up (0.8s expo.inOut), shadow fade
   - Nav dot follows hovered link (`transform: translateY()`)

6. **Cursor** (`cursor.js`):
   - Lerped dot (0.18 factor)
   - `mix-blend-mode: difference` default
   - `[data-cursor]` → grow to 56px (`.is-hover`)
   - `[data-cursor="drag"]` → grow to 84px, show "Drag" label, `mix-blend-mode: normal` (`.is-drag`)

7. **Anchor Navigation + Curtain** (`main.js`):
   - Click `#hash` → curtain flash (black overlay `opacity: 0 → 1 → 0`, 0.32s/0.5s power2.inOut) → smooth scroll via `__smoothScrollTo`

8. **Header Theme Switch** (`main.js`):
   - On scroll, probe 40px below top; if over `.hero`, `.services`, `.gallery` → header/hamburger turn white (`.is-light`)

9. **Newsletter Form** (`main.js`):
   - Focus → `.is-focused` expands underline (`transform: scaleX(0 → 1)`, 0.7s expo.out)
   - Submit → placeholder "Thank you", reset after 2.5s

### Easing
- `--ease-expo-out`: `cubic-bezier(0.16, 1, 0.3, 1)` — standard expo out
- `--ease-expo-out-2`: `cubic-bezier(0.19, 1, 0.22, 1)` — slightly sharper, used for rolls, hover transitions, curtain
- GSAP: `'expo.out'`, `'expo.inOut'`, `'power2.inOut'`, `'power2.in'`

---

## Notable Implementation Details

### Hero Video Dual-Layer
- Two `<video>` elements stacked:
  1. `.hero__video` — muted, autoplay, loop, `opacity: 0.8`, poster image
  2. `.hero__video--alt` — unmuted version (hidden initially), loads on demand
- "Unmute" button toggles `.is-unmuted` class → cross-fades videos, syncs `currentTime`

### Custom Cursor
- Single `div#cursor` with `mix-blend-mode: difference` for visibility on both light/dark
- Grows on `[data-cursor]` targets; "Drag" label appears on gallery
- Disabled on touch devices (`@media (pointer: coarse)`)

### Smooth Scroll (Lenis-style)
- `wheel` listener with `preventDefault()`, accumulates `target` scrollY
- rAF loop: `current += (target - current) * 0.095`
- Exposes `window.__smoothScrollTo(y)` for programmatic scroll (used by curtain nav)
- Disabled on `prefers-reduced-motion` or touch

### Responsive Breakpoints
- Single breakpoint: `1024px` (`md:` in Tailwind)
- Mobile-first CSS with `@media (min-width: 1024px)` overrides
- `downMd:` variant in original (Tailwind plugin) → converted to max-width queries in clone

### Accessibility
- `aria-label` on icon-only links
- `aria-expanded` / `aria-hidden` on menu
- `aria-hidden="true"` on decorative SVG sprite, intro screen, curtain, cursor
- Semantic heading hierarchy (`h1` → `h2`)
- Focus styles inherited from browser (could be enhanced)
- `prefers-reduced-motion` disables all animations

### Asset Optimization (Original)
- Images: Sanity CDN with `auto=format` (serves WebP/AVIF), `rect=` cropping, `w=`/`h=` resize
- Videos: MP4 + WebM sources, `preload="auto"` for hero, `preload="none"` for alt
- Fonts: `font-display: swap`, size-adjust via Next.js `next/font`

---

## Clone Fidelity Notes

### Faithfully Reproduced
- ✅ Complete HTML structure & semantic landmarks
- ✅ CSS custom properties for theme, grid, spacing
- ✅ All typography classes (`.h0`, `.h1`, `.mono`, `.large-body`, `.roll`)
- ✅ Grid layout system (6/12 col, gutter switching)
- ✅ Hero dual-video unmute toggle
- ✅ Gallery drag slider with rubber-band & scroll-triggered scale
- ✅ Marques hover image swap with blur/scale transition
- ✅ Menu overlay with staggered entrance, nav dot, image gallery
- ✅ Footer pinned layout (desktop) with newsletter form focus animation
- ✅ Intro timeline (logo → page rise → content reveals)
- ✅ Curtain page transitions on anchor navigation
- ✅ Custom cursor with blend modes & states
- ✅ Smooth scroll (Lenis-style) with ScrollTrigger compatibility
- ✅ Header/hamburger color switching over dark sections
- ✅ All original fonts (FK Grotesk, Regular Book) self-hosted
- ✅ All images & videos downloaded to `assets/`
- ✅ `prefers-reduced-motion` respected globally

### Approximated / Simplified
- ⚠️ **Smooth scroll**: Lenis replaced with minimal rAF lerp (no touchpad momentum, no `wheel` event normalization for high-res trackpads)
- ⚠️ **Gallery**: Original likely uses Keen-Slider with loop/infinite; clone is finite 4-slide drag with click-to-advance
- ⚠️ **Image optimization**: Clone uses static JPG/WebP; original uses Sanity transforms (responsive srcsets, auto format)
- ⚠️ **Video sync**: `currentTime` sync on unmute is best-effort (duration may differ)
- ⚠️ **ScrollTrigger refresh**: Called once after intro; no handling of dynamic layout shifts (images loading, font swap)
- ⚠️ **Focus management**: Menu close returns focus to hamburger; other traps not implemented
- ⚠️ **Performance**: No `IntersectionObserver`-based lazy loading for images (all eager)

### Known Gaps vs Original
- Original may have **page transitions** between routes (Next.js App Router + GSAP); clone is single-page
- Original likely has **view transitions** or **barba.js**-style SPA navigation; clone uses anchor scroll only
- **Sanity CMS content** (dynamic marques, services, gallery) is hardcoded in clone
- **Analytics/Tracking** (GA, Vercel Analytics) omitted
- **Cookie consent / GDPR** banner omitted
- **Service worker / PWA** manifest omitted

---

## File Map (Clone)

```
├── index.html                    # Main entry point
├── css/
│   ├── fonts.css                 # @font-face declarations
│   ├── base.css                  # Reset, variables, typography, utilities
│   ├── layout.css                # Header, menu, footer, page shell, cursor, intro
│   └── components.css            # Hero, fulltext, gallery, marques, services
├── js/
│   ├── smooth.js                 # Lenis-style smooth scroll
│   ├── cursor.js                 # Custom cursor (lerp, hover/drag states)
│   ├── menu.js                   # Fullscreen menu (GSAP timeline, nav dot, image swap)
│   ├── gallery.js                # Drag slider + ScrollTrigger scrub
│   ├── marques.js                # Hover image swap
│   ├── reveals.js                # ScrollTrigger reveals (clip, fade, stagger)
│   └── main.js                   # Intro timeline, unmute, curtain nav, form, theme switch
├── assets/
│   ├── fonts/
│   │   ├── fk-grotesk-regular.woff2
│   │   ├── fk-grotesk-italic.woff2
│   │   ├── fk-grotesk-medium.woff2
│   │   ├── fk-grotesk-medium-italic.woff2
│   │   └── regular-book.woff2
│   ├── img/
│   │   ├── gallery-1..4.jpg
│   │   ├── marque-*.jpg (12)
│   │   ├── menu-1..5.jpg
│   │   └── hero-poster.jpg
│   └── video/
│       ├── hero.mp4 / .webm
│       └── hero-full.mp4 / .webm
├── screenshots/
│   └── original.png              # Full-page reference (1920×7455)
├── source.html                   # Original live HTML (100KB+)
├── analysis.md                   # This file
└── README.md                     # Project documentation
```

---

## References

- [Nightjar — ESR Bespoke case study](https://nightjar.co/work/esr-bespoke)
- [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [Lenis smooth scroll](https://github.com/studio-freight/lenis)
- [Tailwind CSS v3 Grid](https://tailwindcss.com/docs/grid-template-columns)
- [FK Grotesk — Fontfabric](https://fontfabric.com/fonts/fk-grotesk/)