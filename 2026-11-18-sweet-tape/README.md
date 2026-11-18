# SweetTape Design Study

Offline visual/interaction clone of `https://sweet-tape.com/` built for design-study purposes. All artwork, copy, and fonts belong to SweetTape / SB Tape Group Sdn Bhd; the live Awwwards page is credited in the badge.

## Run

Open `index.html` in a modern browser.

For a clean console without `file://` CORS warnings, serve the folder locally:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/`.

No build step, package install, or API keys are required. GSAP and ScrollTrigger are loaded from CDN; the local JS falls back to CSS transitions and `requestAnimationFrame` if they are unavailable.

## Controls

- **PULL ME** tab — open/close the menu. Escape and outside-click also close it.
- **Sound** button — toggle a small WebAudio tick.
- **Tape rail** — click a tape roll to switch the slide. Wheel and arrow keys also work when the slider is active.
- **Scroll** — reveals the giant pinning sequence, parallax layers, peels, hand note, wave band, and footer.

## Structure

```text
index.html          Clone markup
css/
  main.css          Layout and component styles
  fonts.css         Self-hosted fonts and glyph masks
  words.css         Word glyph image rules
js/
  core.js           Shared ST helpers and GSAP/fallback layer
  preloader.js      Preloader and reveal dispatch
  menu.js           Menu and sound
  slider.js         Tape rail, slide content, sweep, showcase
  scroll.js         Hero canvases, parallax, pinning, reveals
assets/             Images, fonts, SVGs, textures, word glyphs
screenshots/        Original reference and generated clone screenshots
analysis.md         Reconstruction notes and validation
```

## Notes

- The supplied asset set has no `.glb` models. The original tape and sticky-note 3D pieces are therefore drawn as animated 2D canvas approximations.
- Navigation links are preserved as static stubs; there is no routing.
- See `analysis.md` for the full reconstruction and validation record.
