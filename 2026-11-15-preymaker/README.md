# Preymaker — Home Page Clone

A static, single-page recreation of <https://preymaker.com/> built from the
original server-rendered markup, compiled CSS, and locally downloaded media.

## Run it

```bash
cd /home/ubuntu/awwwards-exploration/2026-11-15-preymaker
python3 -m http.server 8000
```

Open <http://localhost:8000>.

You can also open `index.html` directly. GSAP and ScrollTrigger load from
jsDelivr, so an internet connection is required for animation; all fonts,
images, and videos are local.

## Files

```text
.
├── index.html          reconstructed home page
├── css/
│   ├── afade79bd7afe4ba.css
│   ├── f58c8dd3f26b04a5.css
│   ├── d7921f59479d00d1.css
│   ├── cb502bc9667dcd29.css
│   └── clone.css       split-text masks and integration fixes
├── js/
│   └── main.js         preloader, scroll, menus, cursor, media, cookie
├── assets/
│   ├── fonts/          NewGrotesk woff2 files
│   ├── icons/
│   ├── images/         project stills, partner logos, posters
│   └── videos/         hero, project, showreel previews
├── screenshots/
│   └── original.png    1920×1080 reference capture
├── source.html         original downloaded document for comparison
├── analysis.md         design/technical analysis
└── README.md
```

The four original compiled stylesheets are kept unmodified. `clone.css` only
adds runtime-generated text wrapping styles, the inlined preloader mask, and a
few integration shims.

## Interactions

- Preloader with percentage counter and logo mask
- Word/line masked reveals and scroll-triggered section entrances
- Sticky project panels and scroll-driven media scaling
- Work-card videos play on hover
- Full-screen menu (button, backdrop, or Escape to close)
- Custom cursor with “View Work” context label
- Partners list with logo-swapping hover state
- Expandable cookie banner
- Copy-email feedback in the footer

## Notes

- One page only: case-study, showreel, people, and contact pages are not
  included. Internal links are placeholders.
- The original uses a dark home theme; the clone fixes the theme to dark.
- Scrolling happens inside `#scroll-wrapper`, matching the original layout.
  ScrollTrigger and scroll-progress listeners target that element.
- The reference screenshot is viewport-sized (1920×1080), not full-page.
- See `analysis.md` for the full design and implementation breakdown.

## Credits

Design and content: Preymaker. Site by Dash Digital Studio; development by
Mathis Humbert. This copy is for study/reference purposes only.
