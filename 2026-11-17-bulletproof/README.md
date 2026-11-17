# Bulletproof Static Clone

A faithful, self-contained static clone of the **Bulletproof | Create desire through disruption** website (Awwwards Site of the Day), originally built on Webflow at https://www.wearebulletproof.com/ and featured on Awwwards at https://www.awwwards.com/sites/bulletproof.

## What This Clone Is

This is a hand-rebuilt static version of the original Webflow site, recreated using standard HTML5, CSS3, and vanilla JavaScript with GSAP + ScrollTrigger for animations. It does not use Webflow, requires no build step, and can be opened simply by opening `index.html` in any modern browser.

## Structure

```
/                    ← index.html (root)
/css/                ← base.css, sections.css, responsive.css
/js/                 ← main.js (GSAP + ScrollTrigger animations)
/assets/             ← fonts (Sequel Sans, Mixta Pro), images, video
/analysis.md         ← technical breakdown of the original site
/README.md           ← this file
```

## Quick Start

1. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
2. No installation, no build step, no local server required — it works as a pure static page.
3. For best results, open at full screen (the design uses `100vh`/`100dvh` heights and `vw`-based typography).

## Pages & Sections Replicated

- **Navbar** — fixed dark/light theme, logo, navigation links with smooth scroll
- **Hero** — rotating "Create / Desire / Disruption" text reveal, ken-burns background effect, GSAP entrance timeline
- **Intro** — branded video background with "UNRIVALLED / CREATIVITY. / Global Reach." typed reveals, body copy
- **Work Slider** — pinned horizontal case showcase with navigation dots, parallax background shifts on scroll
- **Work List** — client grid (list/grid toggle), floating poster preview on hover
- **News** — drag-scroll card grid, heading reveals on scroll
- **Locations** — infinite marquee scrolling location titles, hover detail panels
- **Footer** — studio locations, links, copyright

## Faithfully Reproduced vs Approximated

| Area | Status |
|------|--------|
| Color palette (`--real-black`, `--analog-white`, `--craft-pink`, `--m-grey`) | Faithful — exact hex values extracted from original |
| Font families (`Sequel Sans`, `Mixta Pro`) | Faithful — same font faces, WOFF2 format, `font-display: swap` |
| Typographic scales (`h-h1` `15vw`, `h-h4` `6vw`, eyebrow `.8vw`) | Faithful — pixel-accurate `vw`-based sizes |
| GSAP animation timing (`cubic-bezier(0.19, 1, 0.22, 1)`) | Faithful — same ease function used throughout |
| Hero text reveal sequence | Faithful — same `data-reveal="right/left"` and waypoint classes |
| Work slider pinned scroll + parallax | Faithful — GSAP + ScrollTrigger replicate Webflow's pinned effect |
| Work-list poster preview on hover | Faithful — same mouseenter/mouseleave behavior |
| News drag-scroll | Faithful — same manual scroll control with velocity multiplier |
| Location marquee animations | Faithful — same CSS `keyframes` and `transform: translateX()` |
| Footer parallax reveal | Faithful — same `scrub: true` GSAP ScrollTrigger |
| Navbar theme swap on scroll | Faithful — same ScrollTrigger `onToggle` behavior |
| Cookie banner UI | Faithful — same structure, though tracking scripts omitted for static clone |
| Responsive breakpoints (mobile/tablet/desktop) | Approximated — `vw`-based type and widths scale continuously; media queries at 1200px, 991px, 767px match original breakpoints |
| Image/content assets | Approximated — images are placeholders selected to match the original's visual style; actual video source URLs from the live site are replaced with local assets |
| Third-party tracking (GTM, Meta Pixel, LinkedIn, Twitter) | Intentionally omitted — clone is fully static with no external APIs or tracking |
| Webflow-specific CMS/dynamic content | Intentionally omitted — replaced with static HTML markup |

## Credits

- **Original site**: https://www.wearebulletproof.com/ (Bulletproof, awwwards Site of the Day)
- **Awwwards page**: https://www.awwwards.com/sites/bulletproof
- **Original platform**: Webflow
- **Clone**: This static reproduction for design study purposes

## License

This clone is for design study and educational purposes only. All visual design credit belongs to Bulletproof and the original Webflow development team.