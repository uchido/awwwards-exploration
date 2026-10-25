# Brandon Yasin - Awwwards Clone

This is a faithful, self-contained static clone of [brandonyasin.com](https://brandonyasin.com), the Awwwards Site of the Day (October 24, 2026).

## Original Site
- **URL:** [https://brandonyasin.com](https://brandonyasin.com)
- **Awwwards:** [https://www.awwwards.com/sites/brandon-yasin](https://www.awwwards.com/sites/brandon-yasin)

## What's Included
- `index.html` - Main HTML file with all sections (Home, Menu overlay with Archive/About/Contact)
- `css/` - All stylesheets organized by component
- `js/` - All JavaScript files for animations and interactions
- `assets/` - Images, fonts, and video assets
- `analysis.md` - Technical breakdown of the original site
- `README.md` - This file

## How to Open
This is a fully static site - no build step required. Simply open `index.html` in a modern web browser.

For best results, use a local server:
```bash
python3 -m http.server 8000
# Then open http://localhost:8000
```

## What Was Faithfully Reproduced
- ✅ Time-based dynamic theming (color changes throughout the day)
- ✅ GSAP-powered animations and transitions
- ✅ Interactive gallery with wheel/drag scrolling on homepage
- ✅ Header intro animation sequence
- ✅ SVG path animations
- ✅ Rotating award badge
- ✅ Time travel easter egg (drag the clock ring)
- ✅ Typography system (Neue Haas Unica Pro, Helvetica Now Variable)
- ✅ Paper texture background overlay
- ✅ Responsive layout
- ✅ Menu overlay structure
- ✅ Archive and About page layouts
- ✅ Contact modal structure

## What Was Approximated
- ⚠️ Some complex scroll-triggered animations may differ slightly in timing
- ⚠️ Some micro-interactions simplified for vanilla JS implementation
- ⚠️ 3D/motion effects approximated without premium GSAP plugins
- ⚠️ Form submission is client-side only (no backend)
- ⚠️ Some video autoplay behaviors may vary by browser
