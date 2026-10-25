# Technical Analysis: brandonyasin.com (Awwwards Site of the Day)

## Stack
- **Framework/Approach:** Static HTML/CSS/JS (original appears to be built with Nuxt.js/Vue given data-v-* attributes and structure), heavily relying on client-side animations
- **Animation Library:** GSAP 3 with ScrollTrigger (core animations, timelines, eases)
- **Custom Easing:** Custom cubic-bezier implementations registered via `gsap.registerEase()` for gallery-specific motions
- **Build:** No build step in this clone - fully static, works by opening index.html directly

## Layout System
- **Grid/Flexbox:** CSS Grid and Flexbox used throughout (header uses CSS Grid, gallery uses Flexbox)
- **Responsive Design:** Extensive use of media queries with breakpoints around 768px, 1025px, 1438px
- **Viewport Units:** Uses vw/vh with custom properties like `--lvh`, `--svh` for better mobile viewport handling
- **Container System:** Custom container classes with responsive widths

## Typography
- **Primary Font:** Neue Haas Unica Pro (weights/styles as defined)
- **Secondary Font:** Helvetica Now Variable
- **Font Loading:** `font-display: swap` for performance
- **Typographic Scale:** Extensive utility classes (.font-headline-1 through .font-headline-4, .font-body-*, etc.) with responsive sizing using clamp() and vw units

## Color Palette
The site features a dynamic time-based theme system that interpolates colors throughout the day:

### Background Colors (by time)
- Night/Dawn (0-4): `#2C2922` (very dark)
- Early morning (5): `#60594C`
- Morning (6): `#857C6A`
- Mid morning (7): `#A59D8A`
- Late morning (8): `#CEC9BB`
- Day (9-16): `#F8F6F2` (light cream)
- Evening (17-18): transitions back through warm tones
- Night (19-21): transitions to dark

### Text Colors
- Night: UI `#C3BEB1` with selection `rgba(255, 238, 194, 0.2)`
- Yellow/Golden hour: UI `#F1C345` with selection `rgba(68, 48, 0, 0.2)`
- Day: UI `#111111` with selection `rgba(68, 48, 0, 0.2)`

### CSS Variables
- `--color-main`: Primary text color (dynamic)
- `--color-bg`: Background color (dynamic)
- `--img-over-opacity`: Overlay opacity on images (dynamic)
- `--bg-brightness`: Background brightness filter (dynamic)

## Animation Techniques (GSAP Usage)

### Core Animations
1. **Intro Sequences:** Complex timelines orchestrating logo reveal, SVG path drawing, nav items, and gallery animations
2. **SVG Path Animation:** Stroke-dasharray technique used to animate SVG paths (simulating DrawSVG plugin)
3. **Gallery Wheel/Drag:** Custom implementation with momentum scrolling, lerp interpolation, and velocity-based scaling
4. **Image Reveals:** Clip-path animations for staged reveals with scale transforms
5. **Scroll Animations:** GSAP ScrollTrigger used for scroll-based animations (about page process section)
6. **Time-based Theme Transitions:** Smooth color interpolation using GSAP tweens
7. **Hover Effects:** Stacked text swap animations and image parallax on hover

### Custom Implementations
- **Cubic-bezier ease factory:** Custom implementation to create named eases without needing GSAP's premium CustomEase plugin
- **Time interpolation:** Custom color interpolation functions for smooth theme transitions
- **Momentum scrolling:** Custom wheel/drag handling with velocity calculations
- **SVG drawing:** Stroke-dasharray manipulation to simulate drawing animations

## Notable Implementation Details
1. **Time Travel Easter Egg:** Interactive clock in header that allows dragging to change time of day, affecting the entire theme
2. **Paper Texture Overlay:** Fixed pseudo-element with paper background image for tactile feel
3. **Menu System:** Overlay menu with preview tiles
4. **Archive Gallery:** Horizontal scrolling gallery with video/image items
5. **About Page:** Complex scroll-driven animations for process section
6. **Contact Modal:** Multi-step form with tabbed interface
7. **Performance:** Uses `will-change`, transforms for GPU acceleration, lazy loading considerations
8. **Accessibility:** ARIA attributes, focus states, keyboard navigation support
