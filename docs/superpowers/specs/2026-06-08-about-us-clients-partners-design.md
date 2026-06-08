# About Us & Clients/Partners Sections — Design Spec

**Date**: 2026-06-08
**Status**: Approved

## Overview

Add two new sections to the landing page between Hero and HowItWorks:
1. **About Us** — image + text split introducing SOLA
2. **Clients & Partners** — two-column auto-scrolling logo marquees

## Placement

New page order:
```
Hero (dark) → About Us (cream) → Clients & Partners (sand) → HowItWorks (cream) → ...
```

This preserves the existing cream/sand alternating background pattern.

---

## Section 1: About Us

### Structure
- Two-column grid: image left (50%), text right (50%)
- On mobile: stack vertically (image on top)

### Content
- **Image**: `/asset/about_us/StockSnap_NABNCHL6PX.jpg`
- **Label**: Small gold badge: "About Us"
- **Heading**: "Crafting Unforgettable Moments, Together" (serif)
- **Body**: Full provided text (6 sentences)
- **No CTA button** (text-only, no link to other page)

### Visual Design
- Background: `bg-brand-cream`
- Image frame: `rounded-2xl`, subtle gold-tinted border, soft shadow
- Uses `next/image` with `priority`, `width`/`height` props (not `fill`)
- Text accent: gold label badge with `bg-brand-gold/10 text-brand-gold`
- Spacing: standard section padding `py-24`

### Technical Notes
- Server component (no interactivity needed)
- Image is 29MB — Next.js Image optimization handles this automatically
- Existing component patterns: use same container/heading styles as HowItWorks, PricingSection

---

## Section 2: Clients & Partners

### Structure
- Two-column layout: clients left | vertical divider | partners right
- On mobile: stack vertically with divider becoming horizontal
- Each column has a label and a horizontal auto-scrolling logo row

### Content
- **Left column label**: "Our Beloved Clients"
- **Left column logos**: all 9 PNGs from `/asset/client/` (187.png through Our-Clients-6.png)
- **Right column label**: "Our Trusted Partners"
- **Right column logos**: all 10 PNGs from `/asset/partner/` (154.png through 199.png)
- **Center**: vertical gold ornamental divider line

### Visual Design
- Background: `bg-brand-sand`
- Logo rendering: `<img>` tags (not `next/image` — these are small PNGs, simpler render)
- Logos: grayscale by default (`grayscale opacity-60`), color on hover (`grayscale-0 opacity-100`)
- Logo size: `h-12` or `h-14` with auto width, consistent within each row
- Gap between logos: `gap-12` or similar

### Auto-scroll (CSS Marquee)
- **Mechanism**: Pure CSS `@keyframes` with `translateX` — no JavaScript
- **Clients row**: scrolls left (`translateX(-50%)` loop)
- **Partners row**: scrolls right (`translateX(0% → 50%)` loop — reversed)
- **Speed**: ~25–30s per full cycle
- **Seamless loop**: each logo row rendered twice (duplicated set for infinite loop)
- **Pause on hover**: `animation-play-state: paused` on parent hover
- Client component required (`"use client"`) only for the hover pause; the animation itself is CSS

### Technical Notes
- `overflow-hidden` on the section container to clip the marquee
- Each marquee track: `flex shrink-0` with `animate-marquee-left` / `animate-marquee-right`
- Custom keyframes defined in `globals.css` or `tailwind.config`
- Desktop: side-by-side columns; Mobile: stacked with horizontal divider

---

## Files to Create
1. `src/components/sections/AboutUs.tsx` — server component
2. `src/components/sections/ClientPartnerShowcase.tsx` — client component (marquee)

## Files to Modify
1. `src/app/page.tsx` — import and add both sections between Hero and HowItWorks
2. `src/app/globals.css` — add marquee keyframe animations

## Out of Scope
- CTA button on About Us (not requested)
- Individual alt text per logo (use generic "Client logo" / "Partner logo")
- Pagination or carousel dots (marquee handles all logos)
