# Testimonial Page Design Spec

**Date**: 2026-07-02
**Status**: Approved
**Framework**: Next.js 16.2.7 (App Router)

## Overview

A new `/testimoni` page showcasing Sola Project's client testimonials with wedding photography galleries and a Contact Us form for new inquiries. Uses the existing Soft Romantic brand aesthetic (cream, gold, taupe, Playfair serif).

## Design Decisions

| Decision | Choice |
|---|---|
| Aesthetic | Soft Romantic — matches existing brand |
| Layout | Balanced Narrative: hero → stats → carousels → contact form |
| Data | Hardcoded mock data in a `Testimonial` interface, structured for future API swap |
| Photo source | Static images from `public/asset/testimonial/testimonial_{1,2,3}/` |
| Form direction | Contact Us form (not testimonial submission) |
| Carousel library | Embla Carousel (matches existing project pattern) |
| Animations | `RevealSection` wrappers + `motion/react` for transitions |
| Admin panel | Out of scope |

## Route

`/testimoni` — `src/app/testimoni/page.tsx`

## Page Structure (4 Sections + Hero)

### 1. Hero Section

- Full-width featured wedding photo with dark gradient overlay for text readability
- Featured quote from a couple (italic, Playfair serif, white text on overlay)
- Gold star rating (★★★★★) above the quote
- Couple name in gold below the quote
- Photo sourced from `/asset/testimonial/testimonial_1/` (pick the best image)

### 2. Stats Bar

- Compact dual-card strip directly below the hero, no gap
- **Left card** (taupe `#4A3E3D` background): "4.9" in gold serif + "Avg Rating" label
- **Right card** (dark `#1E1E1E` background): "120+" in white serif + "Happy Couples" label
- Responsive: full-width cards on mobile, inline flex on desktop

### 3. Testimonial Carousels

Three testimonial sections, each representing one couple from the three photo folders. Each section contains:

- **Section ornament**: gold sparkle divider pattern (matches about/services page convention)
- **Photo strip**: horizontal scrollable row of all photos from that testimonial's folder
  - Uses Embla carousel (or native scroll with hidden scrollbar)
  - Peek effect: shows ~1.5 photos visible at a time on mobile
  - Photos display at 4:3 aspect ratio
- **Quote block** (below photos):
  - Gold star rating
  - Italic quote text in Playfair serif, taupe color
  - Couple name in smaller muted text

**Data model** (`Testimonial` interface):
```ts
interface Testimonial {
  id: string;
  coupleName: string;
  rating: number;          // 1-5
  quote: string;
  date: string;            // ISO date for sorting
  photoFolder: string;     // e.g., "testimonial_1"
}
```

**Display logic**: Array sorted by `date` descending, sliced to first 3. When a backend is added, only the data source changes.

**Mock data** (3 entries):
- Sarah & James — 4 photos (`testimonial_1/`)
- Maya & David — 5 photos (`testimonial_2/`)
- Priya & Alex — 5 photos (`testimonial_3/`)

### 4. Contact Us Form

- Sand-gradient background section (`#FDFBF7` → `#F5EFEB`)
- Section ornament header matching the pattern above
- Heading: "Contact Us" (Playfair serif)
- Subtitle: "Start planning your dream event"
- **6 form fields**:

| Field | Type | Details |
|---|---|---|
| Name | text input | Required |
| Contact Method | dropdown | Options: "WhatsApp", "Email" |
| Event Type | dropdown | Options: "Wedding Ceremonies", "Corporate Events", "Social Gatherings", "Traditional Events", "Birthday Parties" |
| Event Date | date input | Required |
| Event Location | text input | Required |
| Description | textarea | Optional, placeholder: "Tell us about your event..." |

- Submit button: "Send Message" with gold background, white text, rounded
- Form validation via `react-hook-form` + `zod`
- Submit shows a success toast (Sonner): "Thank you! We'll get back to you soon."
- No backend call — submit handler is a no-op with simulated success

### 5. Empty State (Future-proofing)

- If the testimonial array is empty, show a graceful empty state: centered text "No testimonials yet" with muted styling — prevents page breakage when backend returns `[]`

## Components

| Component | File | Purpose |
|---|---|---|
| `TestimonialPage` | `src/app/testimoni/page.tsx` | Server component, composes all sections |
| `TestimonialHero` | Inline in page (or `src/components/sections/TestimonialHero.tsx`) | Hero with photo, quote, stars |
| `StatsBar` | Inline in page | Rating + count dual-card strip |
| `TestimonialCarousel` | `src/components/sections/TestimonialCarousel.tsx` (extend existing) | Per-couple photo strip + quote |
| `ContactForm` | Inline in page or `src/app/testimoni/contact-form.tsx` | Contact Us form with validation |

**Decision**: Keep sections inline in `page.tsx` (matching the About page pattern) rather than separate files, unless a section grows large enough to warrant extraction.

## Data Flow

```
Mock Data Array (3 Testimonial objects)
  → sorted by date (desc)
  → sliced to first 3
  → rendered as TestimonialCarousel sections
```

```
Contact Form
  → react-hook-form manages state
  → zod validates on submit
  → on success: Sonner toast "Thank you!"
  → (future: POST to /api/contact)
```

## Photo Assets

| Folder | Count | Images |
|---|---|---|
| `testimonial_1/` | 4 | leonardo-miranda, nathan-dumlao, sandy-millar, vadim-paripa |
| `testimonial_2/` | 5 | alvin-mahmudov, beatriz-perez-moya, hisu-lee, photos-by-lanty, samantha-gades |
| `testimonial_3/` | 5 | beatriz-perez-moya, leonardo-miranda, nathan-dumlao, sandy-millar, vadim-paripa |

## Edge Cases

- **Empty testimonial array**: Graceful empty state with muted text
- **Image load failure**: `next/image` handles this with built-in error boundaries
- **Form validation errors**: Inline field-level error messages in muted red
- **Responsive**: All carousels use Embla with `align: "start"` for natural scroll on touch devices; stats bar stacks horizontally on mobile
- **Performance**: Photos use `next/image` with lazy loading; carousel defers to Embla's built-in lazy loading
