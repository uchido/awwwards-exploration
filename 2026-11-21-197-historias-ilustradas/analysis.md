# Analysis: 197 Historias Ilustradas

## Stack

The original site is built with **Next.js** (React framework) and uses **Tailwind CSS** for styling. The source HTML is a single compiled page with inline `_next/static` asset references. Key technologies:

- **Next.js** (Server-Side Rendering / Static Generation)
- **React** for component composition
- **Tailwind CSS** for utility-first styling
- **GSAP** (GreenSock Animation Platform) for scroll animations and transitions
- **ScrollTrigger** (GSAP plugin) for scroll-based triggers
- **Prismic CMS** for content management (images, person records)
- **cloudfront/images.prismic.io** for image delivery

## Layout System

The layout is primarily **flexbox and CSS Grid** with a mobile-first approach:

- **Navbar**: Fixed position (`fixed top-0 right-0 left-0 z-9999`), uses a `grid grid-cols-[1fr_auto]` layout for the logo and navigation links. On mobile (`md:hidden`), the navigation is collapsed and a menu button is shown.
- **Hero/Main content**: Full-height background (`fixed inset-0 bg-[#FAFAFA]`). Text reveal elements use `position: absolute; inset: 0; flex items-center justify-center text-center` to center text absolutely over the background.
- **Language switcher**: Fixed positioned at `right-4 bottom-5 z-9000` for bottom-right placement.
- **Skip link**: Positioned at `bottom-20 left-1/2 -translate-x-1/2` for center-bottom access.
- **Grid columns**: The navbar uses `grid-cols-[1fr_auto]` with a `md:grid-cols-3` breakpoint for larger screens.
- **Max-width**: Content limited to `54ch` for optimal line length.

The site does not use a traditional CSS framework's grid system beyond Tailwind's utility classes. All layout is handled through Tailwind's `grid`, `flex`, `gap`, and positioning utilities.

## Typography

- **Font family**: System UI stack (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`) with Tailwind `text-sm` (0.875rem) base size.
- **Tabular numerals**: The `tabular-nums` class applies `font-variant-numbers: tabular-nums` and `font-feature-settings: "tnum"` — this ensures numbers align vertically in columns (e.g., the "197" header). This is applied to the span rendering the number "197" in the navbar.
- **Text sizes**: `text-sm` (0.875rem) for body/navbar text, `text-xs` implied for smaller elements.
- **Line height**: Inherits browser default via `line-height-1.6` in the reset.
- **Transforms**: Various `group-hover` and transition effects on text elements.

## Color Palette

- **Background**: `#FAFAFA` (light gray/off-white) — used as the full-page background and navbar background.
- **Text/foreground**: `#111111` (dark charcoal) — the primary text color, referenced via the CSS variable `--text-color` and the Tailwind `text-background` utility.
- **Accent/highlight**: Used sparingly — the skip link background is `#111111` with white text.
- **mix-blend-difference**: Applied to the navbar (`mix-blend-difference`) and language switcher (`mix-blend-difference`), creating an inverse color interaction with the background.
- **Opacity transitions**: The navbar starts with `opacity-0` and transitions to `opacity-1` on scroll, using `transition-opacity duration-1000` (1s) or `duration-500` (0.5s).

## Animation Techniques (GSAP Usage)

The site heavily uses **GSAP 3** with **ScrollTrigger** for scroll-based animations. Key implementations:

1. **Text reveal animations** (`.px-global.invisible` elements): 
   - Each of the three paragraph reveals uses `gsap.fromTo()` with `autoAlpha` from `0` to `1` and `y: 50` to `y: 0`.
   - Duration: 1s with `power2.out` ease.
   - ScrollTrigger triggers each element with `start: 'top 80%' end: 'bottom 20%'` and `toggleActions: 'play none none reverse'`.
   - The `invisible` class sets `opacity: 0` initially; GSAP's `autoAlpha` animates both opacity and visibility.

2. **Navbar hide/show on scroll**:
   - Tracks scroll direction (`prevScroll` comparison).
   - When scrolling down past 100px, navbar fades out (`opacity: 0`).
   - When scrolling up, navbar fades in (`opacity: 1`).
   - Uses `requestAnimationFrame` with passive scroll listener for performance.
   - Adds/removes the `hidden` class after the animation completes.

3. **Skip link reveal**:
   - `gsap.fromTo()` from `autoAlpha: 0, y: 20` to `autoAlpha: 1, y: 0`.
   - ScrollTrigger with `start: 'top 100%' end: 'bottom 100%'`.
   - `toggleActions: 'play none none reverse'`.

4. **Navbar entrance animation**:
   - `gsap.fromTo()` from `autoAlpha: 0, y: -20` to `autoAlpha: 1, y: 0`.
   - ScrollTrigger with `start: 'top top'` and `toggleActions: 'play none none reverse'`.

5. **Hover interactions**:
   - Navbar links have `after::before` pseudo-element animations for underlines on hover.
   - Language switcher links use `group-hover:after:scale-x-100` to animate an underline expand effect.
   - Navigation arrows/buttons use `transition-colors` and `after:scale-x-100` transforms on hover.

## Notable Implementation Details

- **Responsive breakpoints**: The site uses `md:768px` as the primary breakpoint for switching between mobile and desktop layouts. The navbar collapses into a menu button on mobile (`md:hidden` on nav, `group uppercase user-select-none text-white` on the menu button).
- **CMS-driven content**: All person data, images, and metadata are managed via Prismic CMS. The HTML source contains Next.js runtime metadata (`self.__next_f.push`) for data fetching, localization, and metadata injection.
- **Favicons**: Three favicon assets (`favicon.ico`, `favicon-dark.svg`, `favicon-light.svg`) support both light and dark mode preferences via the `theme-color` meta tag (`#ffffff` for light).
- **Open Graph & Twitter cards**: Properly configured with og:image (`https://www.197historiasilustradas.com/opengraph-image.png`), og:title, og:description, and twitter:card setups.
- **Accessibility**: sr-only heading (`<h1 class="sr-only">197 Historias Ilustradas</h1>`), skip link for keyboard navigation, `user-select-none` on interactive elements.
- **Prismic image URLs**: Follow the pattern `https://images.prismic.io/197historiasilustradas/{uid}_{figure-id}_{name}_{name2}.jpg?auto=format&compress` — images are delivered via Prismic's CDN with automatic format optimization and compression.
- **Performance**: The page uses `scroll-behavior: smooth` on html, passive scroll listeners for the navbar, and `transition-duration-500/1000` for controlled animation timing.