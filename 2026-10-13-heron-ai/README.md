# Heron AI — Static Study Clone

A faithful, self-contained static rebuild of **Heron AI — "An AI agent that works inside your design tools"** (https://heronaiapp.com/), created for design study. Original concept credited on-site to **Bearplus agency**; all design/content credit belongs to Heron AI / Bearplus. This clone is an independent educational reconstruction, not affiliated.

## How to open
No build step, no server, no APIs. Just:
1. Open `index.html` directly in a browser (double-click), **or** serve the folder: `python3 -m http.server` → `http://localhost:8000`.
2. GSAP loads from CDN (`cdn.jsdelivr.net`); everything else is local. Without network, animations gracefully degrade (content still visible).

## Structure
```
index.html        — rebuilt page
css/fonts.css     — @font-face (local woff2)
css/base.css      — tokens, reset, type scale
css/main.css      — all layout/components/sections
js/main.js        — loader, reveals, parallax, violations widget, drag, menu
assets/           — real downloaded images/fonts/SVGs (relative paths)
screenshots/original.png — reference screenshot
source.html       — live HTML studied
analysis.md       — technical breakdown
```

## Faithfully reproduced
- Paper-grain background (`bg.svg` tile), ink `#282828`, accent `#FA3600`, hairline `#B3B3AF`.
- Real fonts: BT Grotesk (400–700) + GeistMono for mono labels.
- Header bar with nav + orange Contact; blueprint frame with `+` corners, dashed rulers, coordinates, hero sketch (`hero-building.webp`, multiply blend).
- Hero bottom 3-column row: giant uppercase headline / description with Bearplus link / orange Discover-more + marquee ticker.
- Section order & copy: manifesto strip, Problems ×4, violation tabs (IBC codes), Chat + Dashboard cards, Why-us ×4, 8 use-cases, CTA sketch, dark footer.
- Real imagery where downloadable: hero building, chat/dashboard solutions, CTA sketch, 2 use-case photos, OG image.
- GSAP + ScrollTrigger via CDN: loader %, scroll reveals, hero parallax, header hide-on-scroll, dual-label buttons, CSS marquees, violation switcher, drag-on-hero.

## Approximated / simplified
- Original's 700dvh pinned violation scrollytelling → compact tabbed widget (same content, less scroll choreography).
- SVG draw-on problem icons, Lenis smooth scroll, Barba transitions, custom cursor, displacement hover filters → omitted; replaced with CSS hovers + GSAP reveals.
- woff2 files downloaded are small subsets — fall back to Arial/Helvetica/Menlo if glyphs missing.
- Rulers/coordinates are CSS gradients, not the original's JS-measured rulers; mobile menu simplified.
- Forms (subscribe/demo) reduced to `mailto:` CTA; cookie banner is a static dismissible replica.
