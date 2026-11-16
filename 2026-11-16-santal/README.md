# Santalarch Static Clone

A faithful, self-contained static clone of the **Santalarch** Website of the Day originally shown on Awwwards.

## Original Site
- **URL**: https://santalarch.com
- **Awwwards Page**: https://www.awwwards.com/sites/santal
- **Credit**: Architectural studio built on uncompromising precision and intent.

## What This Clone Is

This is a static HTML/CSS/JS recreation of the Santalarch website, rebuilt for design study purposes. It replicates the visual design, typography, color palette, layout, and animations of the original site without requiring a build step, external APIs, or a local server.

## Structure

```
/
  index.html          — Main HTML page
  css/style.css       — All styles
  js/main.js          — GSAP + ScrollTrigger animations
  assets/
    fonts/            — Helvetica Regular & Medium (WOFF2)
    images/           — Opengraph, project images, logos, icons
    icons/            — SVG door layers, tftl-text icon
    videos/           — Grid, room, watch black/white MP4 files
    works/            — Project thumbnail images
    services/         — Service item images
    team/             — Team member images
```

## How to Open

1. Simply open `index.html` in any modern web browser.
2. No build step, no server, no npm install required.
3. The page will show a preloader, cookie consent banner, and the main content with GSAP-animated scroll reveals.

## Faithfully Reproduced vs Approximated

### Faithfully reproduced:
- Color palette extracted from the original's `:root` CSS variables
- Helvetica font family with matching weights
- Preloader animation with ticker keyframe
- Cookie consent banner with accept/decline buttons
- Invert color button with mix-blend-difference animation
- GSAP + ScrollTrigger scroll reveals
- Responsive layout breakpoints at 1024px/1023px
- Grid-based projects layout
- Button hover clip-path effects
- Fixed-position UI elements (preloader, cookies, invert button)
- CSS custom properties for colors, spacing, transitions

### Approximated:
- Some GSAP animation timing and easing values (extracted from `--transition` variables)
- Exact pixel dimensions for some SVG elements
- Video playback (videos are present but may not auto-play in static mode)
- Nuxt-specific runtime features (the original uses Vue + Nuxt data hydration)
- Backend API endpoints for project data (images served from api.santalarch.com)
- Exact cookie consent implementation details

## Assets

Real image assets were downloaded using a browser User-Agent header and placed in `assets/`. Any asset that failed after one retry was replaced with a solid-color placeholder of the same dimensions. Fonts (Helvetica Regular & Medium) were already included in the source assets.

## License

This clone is for design study purposes only. The original site and all its content remain the property of Santalarch and Awwwards.