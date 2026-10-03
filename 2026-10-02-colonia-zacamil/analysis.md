# Technical Analysis — coloniazacamil.com (Awwwards Site of the Day)

Original: https://coloniazacamil.com/ · Awwwards: https://www.awwwards.com/sites/colonia-zacamil
Study date: 2026-10-03. Source: `source.html` (live SSR HTML) + `_nuxt/entry.t46wWHdU.css` + `_nuxt/DkhZ0TVB.js`.

## 1. Stack

- **Nuxt 3 (Vue 3, SSR)** — `#___nuxt`, `window.__NUXT__`, `_payload.json`, `_nuxt/*.js` chunks, `data-v-*` scoped styles. App version string in JS: `Sixtyfps app version 2.0.1`.
- **Three.js (r155+ lighting)** bundled into the main chunk — full custom WebGL scene: aerial 3D model of the Zacamil blocks (`/models/compressed/model.glb`), texture/mask assets (`/textures/modes/murals-building-mask.webp`), day/night backgrounds, pencil/post-processing shader (`uBackgroundColor`, `uModProgress`, `uNightProgress`, `uSceneAppear`).
- **GSAP (gsap.com, standard license)** bundled — timelines for loader, camera hotspot moves (`Camera_Startup`), background-color tweens, `power2.inOut` / `expo` easings everywhere.
- **Lenis smooth scroll** (`html.lenis`, `.lenis-smooth` styles) + i18n (`en`/`es`, cookie `zacamil_language`, `loader.flyTo`, `global.poweredBy`, `global.CMS`, `global.discover`, `global.present/past` keys).
- Analytics/consent: Google gtag `G-Z1JPMLC026`, iubenda embeds widget.
- CDN assets: `https://cdn.adoratorio.app/zacamil/...` (images, per-mural videos `videos/{id}/pins`, `series`, `univers/{n}/slideshow`).

## 2. Layout system

Single-screen **fixed WebGL stage** (`div.webgl`) with overlaid UI layers, no native page scroll:

1. `#loader` — fixed full-viewport intro. Children: `.background-w` (fullscreen aerial photo w/ `clip-path: inset(var(--inset) round 18px)` morph), `.logo-w` (pixel-art "ZACAMIL" SVG, tablet + mobile variants), `.introduction` (hero), `.tutorial` (how-to overlay).
2. `.introduction .title` — flex row: `textLeft` ("fly to") + `.picture-w` (aspect `1080/210` desktop, `330/150` mobile; a masked window onto the 3D scene) + `textRight` ("[powered by CMS] Zacamil").
3. `.button-with-circle` (Discover pill, `--width` var, inner `.button-circle` dot) anchored `bottom:min(5vh,50px)`.
4. `.description` — bottom-centered serif line.
5. `#pins-w` — absolute overlay hosting ~29 pins (`Pin_1..25` + `Pin_Cancha`, `Pin_Park`, `Pin_Pot/Statue/Trash` scale-effect empties). Clickable pins: circle SVG + uppercase Roboto Mono label; `max-width:32→36px` collapsed, expands to `--width` on hover with `scale(.5)→scale(1)` pill and delayed label fade. Non-clickable pins: diamond SVG, `#8d7cab` fill.
6. `#modes-wrapper` — day/night toggle (sun SVG) + present/past before-after slider (`mod/after.png` vs `mod/before.png`).
7. `footer` — fixed bottom bar: left `[powered by CMS → cms.foundation]`, right `[en / es]`.
8. `#cursor` — custom crosshair ring (154px SVG) following the pointer over the canvas.
9. `#teleports` + detail/popin layers (`popin-detail`, `popin-object` transitions: `translate3d(120%,20%) rotate(10deg)`, staggered `[data-opacity-y]` rises, line scaleX/scaleY draws).

Responsive: `.tablet` (≥768px) / `.mobile` split assets, `picture` with `src-tablet`, coarse-pointer (`touch`) vs fine-pointer (`notouch`) tutorial copy (swipe vs click-drag, pinch vs scroll).

## 3. Typography

| Role | Family | Usage |
|---|---|---|
| Display | **Heathergreen** (custom condensed) | `fly to … Zacamil`, `font-size:min(200px,23.7vh)` / `13vw` mobile, uppercase, tight leading |
| Serif | **Reckless Neue Regular** | description/tutorial (`24px/28px`, `letter-spacing:-.009em`), story body |
| Mono/UI | **Roboto Mono Regular** | pins (14px uppercase), buttons, footer, `[powered by CMS]` (`10px`) |

All three self-hosted as `/_nuxt/*.woff2` with `font-display:swap`.

## 4. Color palette (from CSS)

- `--bone` `#EBE6E0` — page background, loader, pin strokes, text on dark.
- `#000` ink — title, buttons, tutorial icons.
- `#B48E46` gold — clickable pins, tutorial dot.
- `#8D3A55` wine — Cancha/Park pins; `#8d7cab` lilac — archive (non-clickable) pins.
- `#fff` dot centers; `#D9D9D9` era arrows; `#545454` diamond markers; `#0000001a` hairline separators.
- 3D scene `dayBackground #29334`… (decimal `29334` ≈ `#007226`-ish dark green) tweened to night `#000000` via GSAP on `scene.background`.

## 5. Animation techniques (GSAP usage)

- Loader timeline: progress counter → `clip-path: inset()` photo morph (`1.3s var(--ease)`), logo translate, `textLeft/pictureW/textRight` staggered entrances, Discover fade.
- Camera system: named hotspots (`Camera_Startup`, per-pin targets); `gsap.timeline({delay})` chaining `camera.hotspots.set(...)` calls with transition-color uniform flash (`uTransitionColor #EBE6E0`).
- Scroll/drag-driven: Lenis + GSAP; `uModProgress`/`uNightProgress` 0→1 tweens (2s `power2.inOut`) crossfade day/night and past/present.
- Micro-interactions: pin hover uses pure CSS transitions with the signature `.645,.045,.355,1` curve; plus `popin`, `fade-children` (0–.25s stagger), `translate-bottom-top`, icon loops (`scale/swipe 10s`, `scaleScroll 4s`, `pinchTranslate 4s` keyframes).
- State machine events (`PINS_UPDATE/SHOW/HIDE`, `LOADER_PROGRESS`, `APP_LOADED`, `GOING_TO_HOTSPOT`, `PIP_ACTIVE`, `SOUND_MUTED`, map-mod store keys) orchestrated through a central store watched by Vue components.

## 6. Notable implementation details

- Pins are **3D-anchored HTML**: JS projects 3D positions each frame into `#pins-w`; `data-effect="scale"` pins scale meshes (`Pot`, `Statue`, `Trash`) instead of opening content.
- `video-preview` (296×165, bottom-right) previews per-mural video on pin hover (desktop).
- `data-lenis-prevent` islands, `pointer-events:none` pin layer with `pointer-events:all` pins and 15px extended hit-area (`:after`).
- Pixel-logo SVGs are literal rect-path mosaics (1182×165 tablet, 579×349 mobile) filled `#EBE6E0`.
- `?skiploader` query param skips the intro delay (`.8s → 0`).
- i18n via `$t()` keys; locale switch re-renders `loader.flyTo` word spans.
