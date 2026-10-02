# SOHub — Awwwards Site of the Day clone

Static study clone of **sohub.digital**, Awwwards Site of the Day on 2026-06-07.
Rebuilt by hand from the live rendered site: real HTML structure inspected in a headless
browser, design tokens extracted from the actual stylesheet, real copy and assets
downloaded from the original CDN/Sanity sources, and motion recreated with GSAP.

- Original: https://sohub.digital
- Awwwards: https://www.awwwards.com/sites/sohub
- Cloned for design study only — all credit to SOHub Digital.

## How to open

Open `index.html` directly in a browser (no build step, no server needed).
GSAP + ScrollTrigger load from CDN.

## Structure

    index.html          page markup (all sections of the original home page)
    css/main.css        styles, design tokens extracted from the original
    js/main.js          GSAP interactions & scroll animations
    assets/images/      real images downloaded from the original
    assets/fonts/       Publica Play Regular (woff2) from the original
    screenshots/        original.png (live site) + clone.png (this clone)
    analysis.md         technical breakdown of the original
    source.html         raw HTML snapshot of the original (reference only)

## Faithfully reproduced

- All sections and the exact copy: hero "sohub" word + robot render + tagline,
  Work grid (6 projects), four service blocks with tags and asterisk paragraphs,
  floating career chair, "Don't be shy" CTA, full footer with 3D capsule element
- Real color tokens from the original stylesheet:
  --sohub-white #f0f6f8, --sohub-grey #a5abad, --sohub-soft-grey #d9e0e3,
  --sohub-black #0c1016, --sohub-dark-grey #1e232c
- Real assets: all 6 project images, home render, career chair, footer element,
  Publica Play Regular font
- Typography scale (clamp-based, Inter + Publica Play), tight letter-spacing,
  rounded dark containers on light background

## Approximated

- The hero robot is a static PNG render with GSAP entrance/parallax instead of the
  original's interactive 3D (they use a WebGL/model-driven hero)
- Menu is a fullscreen clip-path overlay with GSAP link reveals (the original's
  menu transitions are recreated as closely as possible without their framework)
- Project cards link to anchors, not real case-study subpages
- Custom cursor is a difference-blend dot (simplified version of theirs)