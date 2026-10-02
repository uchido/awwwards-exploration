# SOHub Website Analysis

**URL:** https://sohub.digital  
**Date Analyzed:** 2026-06-07  
**Award:** Awwwards Site of the Day

---

## Technical Stack

### Framework & Build
- **Framework:** Next.js (React-based)
- **Rendering:** SSR/SSG (Server-side rendering with static generation)
- **Deployment:** Vercel
- **CDN:** Cloudflare

### Styling
- **CSS Framework:** Tailwind CSS (heavily customized)
- **Animations:** GSAP (GreenSock Animation Platform)
  - GSAP Core
  - ScrollTrigger plugin
  - Custom timeline animations

### Fonts
- **Primary:** Inter (variable font, woff2 format)
- **Secondary:** Publica Play Regular (custom font)
- Font loading optimized with preload

### CMS & Content
- **Headless CMS:** Sanity.io
- **Image CDN:** cdn.sanity.io for optimized image delivery
- **Image optimization:** Next.js Image component with responsive srcsets

---

## Design Analysis

### Color Palette
- **Primary Background:** `#F0F6F8` (Soft white/grey)
- **Dark Background:** `#0C1016` (Deep black/navy)
- **Secondary Background:** `#1E232C` (Dark grey)
- **Accent Color:** `#27b7a5` (Teal - theme color)
- **Soft Grey:** `#D9E0E3`
- **Text Primary:** `#0C1016` (Black)
- **Text Light:** `#F0F6F8` (White)

### Typography
- **Headings:** Bold, large scale (3xl-5xl on desktop)
- **Body:** Medium weight, clean
- **Letter spacing:** Custom tracking for brand feel
- **Font smoothing:** Antialiased

### Layout Structure
- **Container:** Full viewport width with controlled inner containers
- **Padding:** Responsive (px-4 mobile, px-12 desktop)
- **Spacing:** Generous whitespace, breathing room
- **Grid:** Flexible, responsive grid system

---

## Page Sections

### 1. Loader Animation
- **Element:** Full-screen loader with animated SOHub logo
- **Animation:** Scale + rotate transformation
- **Duration:** ~2-3 seconds
- **Colors:** Dark background with white logo
- **Exit:** Fade out with scale animation

### 2. Header/Navigation
- **Position:** Fixed, always visible
- **Layout:** Logo left, CTA + Menu button right
- **Logo:** Animated on hover
- **CTA Button:** "Chat with SOHub" (rounded pill design)
- **Menu Button:** Animated toggle (Menu ↔ Close)
- **Mobile Menu:** Slide-down overlay with navigation links
- **Z-index:** High (997+) to stay on top

### 3. Hero Section
- **Height:** Full viewport (100vh desktop, 40vh mobile)
- **Content:** Large hero image with 3D render
- **Animation:** Parallax scroll effect
- **Image:** Pre-loaded for performance
- **Text overlay:** Minimal, let image speak

### 4. Introduction/About
- **Layout:** Text-heavy section with animated entrance
- **Typography:** Large, impactful headlines
- **Animation:** Fade-in on scroll
- **Content:** Agency description and value proposition

### 5. Featured Projects Grid
- **Layout:** Card-based grid
- **Items:** 6 featured projects
- **Card Design:** 
  - Featured image
  - Project title
  - Brief description
  - Accent color per project
  - Hover effects (scale, parallax)
- **Animation:** 
  - Staggered entrance
  - Hover parallax on images
  - Smooth transitions
- **Projects:**
  1. 1UP Nova (Pink accent #f2a2cc)
  2. Razer (Green accent #66B933)
  3. Themis (Neon green #60FF00)
  4. AEVA Team (Red accent #ff3600)
  5. CHR Innovations (Dark #161111)
  6. Profit Saloon (Yellow #E9FF54)

### 6. Services/Capabilities
- **Layout:** Multi-column informational section
- **Content:** What SOHub offers
- **Animation:** Reveal on scroll

### 7. Career Section
- **Visual:** Large chair image (symbolic)
- **CTA:** Join the team message
- **Link:** Careers page

### 8. Footer
- **Layout:** Multi-section
  - Company info
  - Navigation links
  - Social media links
  - Contact CTA
- **Design:** Extended footer with rounded corners
- **Animation:** Footer "extension" reveal on scroll
- **Social Links:** LinkedIn, Instagram, Twitter (X)
- **Additional CTAs:** Studio, Work, Contact buttons

---

## Key Interactions & Animations

### GSAP Animations

#### 1. **Smooth Scrollbar**
- Custom scrollbar implementation
- Right-side positioned
- Smooth scroll physics
- Drag-enabled thumb

#### 2. **Loader Sequence**
```javascript
Timeline:
- Logo scales from 0.75 to 1
- Logo rotates from 120deg to 0deg
- Logo opacity 0 to 1
- Loader fades out
- Main content reveals
```

#### 3. **Menu Toggle**
```javascript
Open state:
- Menu dropdown slides down
- "Menu" text slides up, "Close" slides in
- Button icon rotates 90deg

Close state: Reverse animations
```

#### 4. **Scroll-Triggered Animations**
- Hero parallax (image moves slower than scroll)
- Section fade-ins (opacity 0 → 1)
- Staggered project card reveals
- Footer extension on scroll proximity

#### 5. **Hover Interactions**
- Button scale on hover (1.0 → 1.1)
- Icon translations (slide effects)
- Project card parallax
- Link arrow animations

#### 6. **Scroll-to-Top Button**
- Appears on scroll down
- "Go Up" button in footer
- Smooth scroll animation back to top

### Micro-interactions
- **Button Icons:** Slide-out/slide-in on hover
- **Navigation Links:** Width expansion on hover (arrow reveals)
- **Social Icons:** Scale + background color change
- **Rotating Star SVG:** Continuous rotation animation

---

## Performance Optimizations

### Image Handling
- **Preloading:** Critical images preloaded in `<head>`
- **Responsive Images:** Multiple srcsets (1x, 2x)
- **Lazy Loading:** Below-fold images lazy loaded
- **Format:** WebP with PNG fallback
- **Optimization:** Sanity.io CDN handles resizing and compression

### JavaScript
- **Code Splitting:** Next.js automatic code splitting
- **Async Loading:** Non-critical scripts loaded async
- **GSAP:** Modular imports (only needed plugins)

### CSS
- **Critical CSS:** Inlined for above-fold content
- **Purging:** Tailwind purges unused styles
- **Minification:** Production builds minified

### Fonts
- **Format:** WOFF2 (best compression)
- **Preload:** Font files preloaded
- **Display:** `font-display: swap` for FOIT prevention

---

## Accessibility Features

- **Skip to Content:** Link for keyboard users
- **Screen Reader:** Semantic HTML5 elements
- **ARIA Labels:** On interactive elements
- **Focus States:** Visible focus indicators
- **Alt Text:** Images have descriptive alt attributes
- **Keyboard Navigation:** Full keyboard support
- **Color Contrast:** WCAG compliant ratios

---

## Responsive Breakpoints

```css
Mobile: < 640px (sm)
Tablet: 640px - 1024px (md - lg)
Desktop: > 1024px (lg, xl, 2xl)
```

### Mobile Adaptations
- Reduced padding and spacing
- Single column layouts
- Hamburger menu replaces desktop nav
- Smaller typography scales
- Touch-optimized button sizes

---

## Key Technical Patterns

### Component Architecture
- React functional components
- Server components for static content
- Client components for interactivity
- Reusable button/link components

### State Management
- React hooks for local state
- Context for theme/menu state
- No external state library (Next.js patterns)

### Routing
- Next.js App Router
- Dynamic routes for projects: `/work/[slug]`
- Static pages: `/`, `/studio`, `/work`, `/contact`

### SEO
- Complete meta tags (Open Graph, Twitter Cards)
- Canonical URLs
- Structured data (JSON-LD)
- Sitemap generation
- Robots.txt

---

## Animation Timing Functions

### Custom Easings
```css
cubic-bezier(.22, .68, 0, 1)     /* Smooth deceleration */
cubic-bezier(.22, .68, 0, 1.5)   /* Bounce effect */
cubic-bezier(.22, .68, 0, 1.2)   /* Slight overshoot */
```

### Duration Standards
- **Quick:** 200ms (hover states)
- **Medium:** 500ms (transitions)
- **Slow:** 1000ms+ (page transitions)

---

## Summary

SOHub.digital is a masterclass in modern web design combining:
1. **Performance:** Fast load times, optimized assets
2. **Animation:** Sophisticated GSAP-powered interactions
3. **Design:** Clean, bold, memorable visual language
4. **UX:** Smooth, intuitive navigation and interactions
5. **Accessibility:** Thoughtful inclusive design
6. **Technical Excellence:** Modern React/Next.js patterns

The site successfully balances visual impact with technical performance, creating an engaging experience that showcases the agency's capabilities while maintaining excellent Core Web Vitals scores.
