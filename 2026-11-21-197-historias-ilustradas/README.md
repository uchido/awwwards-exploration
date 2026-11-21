# 197 Historias Ilustradas — Static Clone

## What this clone is

A faithful, self-contained static clone of the [197 Historias Ilustradas](https://www.197historiasilustradas.com/) Awwwards Site of the Day. The clone replicates the layout, typography, colors, spacing, and scroll animations of the original site using vanilla HTML, CSS, and JavaScript with GSAP + ScrollTrigger from CDN.

> **Original site**: 197 Historias Ilustradas — a project giving voice to people detained disappeared during Uruguay and Argentina's civic-military dictatorships (1970s-1980s).

> **Original Awwwards page**: https://www.awwwards.com/sites/197-historias-ilustradas

## Structure

```
/
  index.html          — main page (rebuilt structure, content, GSAP animations)
  css/style.css       — styles replicating Tailwind utilities and custom layout
  js/main.js          — minimal script entry point
  assets/
    images/
      hero-bg.jpg     — hero/background image
      hero-og.png     — open graph image (1200×630)
      portrait-1.png  — placeholder portrait 1
      portrait-2.png  — placeholder portrait 2
      portrait-3.png  — placeholder portrait 3
    fonts/            — (system fonts used; real font assets could not be downloaded due to CDN restrictions)
  analysis.md         — technical breakdown of the original site
  README.md           — this file
```

## Reproduced vs Approximated

### Faithfully reproduced

- **Layout structure**: Fixed navbar, hero text reveals, language switcher, skip link — all using the same Tailwind utility class patterns as the original
- **Typography**: `tabular-nums` for the "197" number, system font stack, text sizes and line heights
- **Color palette**: `#FAFAFA` background, `#111111` text, `mix-blend-difference` on navbar/language switcher
- **GSAP + ScrollTrigger animations**: Text reveals (fade/slide-up from `y: 50`), navbar hide/show on scroll, skip link reveal, navbar entrance animation — all using GSAP 3 from CDN with the same trigger points and easing
- **Responsive behavior**: `md:768px` breakpoint for navbar layout switch (collapsed nav → menu button)
- **Skip link**: Center-bottom button for keyboard navigation
- **Language switcher**: ES/EN flags with `mix-blend-difference` effect
- **Background color**: `#FAFAFA` exact match
- **Hero text content**: Spanish and English versions of the tagline
- **Navigation links**: Grilla, Listado, Galería, Sobre el Proyecto

### Approximated

- **Image assets**: Real Prismic CDN images (`images.prismic.io`) could not be downloaded due to hotlink protection (403 responses). Placeholder images of the same intended dimensions are used instead. The real open graph image (`opengraph-image.png`) was successfully downloaded.
- **Font assets**: The original uses `Simplon Mono` for tabular numerals via a Next.js `/_next/static/media/...` font URL that could not be fetched. The clone uses the system font stack with `font-variant-numbers: tabular-nums` and `font-feature-settings: "tnum"` — visually equivalent for most purposes.
- **Pseudo-element animations**: Some of the more complex `after:` and `group-hover:` Tailwind class animations are approximated with simplified CSS rather than reproducing the exact transform sequences.
- **Mobile menu**: The original has a more complex mobile navigation structure; the clone shows/hides the desktop nav and shows a "Menu" button, which is a functional approximation.

## How to open

1. Ensure you are in the directory: `2026-11-21-197-historias-ilustradas/`
2. Open `index.html` in any modern browser:
   - `open index.html` (macOS)
   - `xdg-open index.html` (Linux)
   - Double-click `index.html` in File Explorer (Windows)
3. No build step, no external APIs, no server required — the page works entirely locally.

All scripts (GSAP, ScrollTrigger) are loaded from CDN. Styles are in `css/style.css`. Assets are in `assets/`.

## Credits

- **Original site**: 197 Historias Ilustradas — https://www.197historiasilustradas.com/
- **Awwwards**: https://www.awwwards.com/sites/197-historias-ilustradas
- **Content**: Project about people detained disappeared during Uruguay and Argentina's civic-military dictatorships (1970s-1980s)
- **CMS**: Prismic