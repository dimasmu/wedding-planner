# Services Page Design Spec

**Date**: 2026-06-09
**Status**: Approved
**Framework**: Next.js 16.2.7 (App Router)

## Overview

A new `/services` page showcasing Sola Project's event planning services. Uses existing brand aesthetics with a video hero, flipping-card carousel for service categories, and supporting sections for process, social proof, and CTA.

## Design Decisions

| Decision | Choice |
|---|---|
| Aesthetic | Match existing brand (cream, taupe, gold, sand) |
| Hero | Video background from `public/asset/services/*.mp4` |
| Services section | Embla carousel with flipping cards |
| Flip interaction | Independent (multiple can stay flipped, toggle back) |
| Carousel nav | Arrow buttons + native swipe/scroll |
| Navigation | "Services" link in Navbar (after About) and Footer |

## Route

`/services` — `src/app/services/page.tsx`

## Page Structure (6 Sections)

### 1. Video Hero
- Full-viewport background video (autoplay, muted, loop)
- Dark overlay for text readability
- Headline: "From Concept to Celebration"
- Subheadline: "We turn your vision into a flawless reality — stress-free, with a personal touch"
- Primary CTA: "Plan Your Event" → `/dashboard`
- Secondary CTA: "View Services" → scroll anchor to services section

### 2. The Sola Promise
- Centered text section
- Heading: "We Make Magic Happen"
- Body: Philosophy text, mention of "limitless meetings"
- Lucide icon

### 3. Core Services Carousel
- Embla Carousel with 5 flip cards
- Front: `public/asset/services/kind_of_services/*.jpg` image + category name
- Back: Dark taupe card with bullet list of service details + "Learn More" link
- Flip: CSS 3D transform on click, independent per card, re-click to flip back
- Navigation: Prev/Next arrow buttons + Embla native scroll/swipe
- Cards: Wedding, Corporate, Social Gatherings, Traditional, Birthday

### 4. How We Work
- Reuse existing `HowItWorks` section component from homepage
- 3 steps: Concept → Plan → Execute

### 5. Testimonials
- Reuse existing `TestimonialCarousel` section component
- 3 placeholder quotes about reliability, execution, decor

### 6. Final CTA Banner
- Dark background with overlay image from `background_services.jpg`
- Text: "Ready to start planning? Let's talk about your event."
- Gold CTA button: "Let's Plan!" → `/dashboard`

## Files

| File | Action |
|---|---|
| `src/app/services/page.tsx` | New — server page composing sections |
| `src/components/sections/ServicesHero.tsx` | New — video hero |
| `src/components/sections/ServicesCarousel.tsx` | New — Embla + flip cards |
| `src/components/ui-custom/Navbar.tsx` | Edit — add Services link after About |
| `src/components/ui-custom/Footer.tsx` | Edit — add Services link in Explore |

## Assets Used

| Asset | Where |
|---|---|
| `public/asset/services/*.mp4` (3 videos) | Hero background |
| `public/asset/services/kind_of_services/*.jpg` (5 images) | Carousel card fronts |
| `public/asset/services/background_services.jpg` | Final CTA background |

## Dependencies

- `embla-carousel-react` + `embla-carousel-autoplay` (already installed)
- `motion` (already installed)
- `lucide-react` (already installed)
- `@/components/ui/button` (existing)
