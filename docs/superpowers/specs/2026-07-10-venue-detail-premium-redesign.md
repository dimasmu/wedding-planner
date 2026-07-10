# Venue Detail Page Premium Redesign

**Date:** 2026-07-10
**Status:** Approved

## Summary

Redesign the venue detail page (`/venue/[slug]`) into a premium luxury layout. Cinematic hero, photo gallery, elegant about section, interactive package cards, and a closing CTA. All content from existing DB — no backend changes.

## Data Source

Venue fields used: `name`, `location`, `description`, `maxCapacity`, `images`, `packages`

## Sections

### 1. Hero

Desktop: two-column split (50/50).

**Left column:**
- Venue name — serif, text-5xl
- Location with MapPin icon
- Capacity with Users icon
- Starting price (cheapest package)
- Short description snippet (first ~120 chars)
- Two pill buttons: "Lihat Paket" (scrollTo packages), "Hubungi Kami" (WhatsApp via first package `bookingUrl`, fallback `tel:`)

**Right column:**
- Large featured image (images[0]), rounded-xl, soft shadow
- No dark overlay — clean image-forward design
- Back button (glassmorphism pill) floats over top-left

Mobile: stacked — image first full-width, then info below.

### 2. Info Chips

Beneath hero, a horizontal scrollable row of pills:
- Kapasitas: X (from maxCapacity)
- Location name (from location)
- Z Paket Tersedia (packages.length)
- Mulai dari Price (cheapestPrice)

Each chip: icon + label, rounded-full, soft border.

### 3. Image Gallery

Layout variations based on image count:
- **6+ images**: 1 large (2/3) + 4 small (2x2 grid) + "+N Foto" overlay on last thumbnail
- **2-5 images**: 1 large + remaining in grid
- **1 image**: full-width only
- **0 images**: hidden section

Click any image → open full gallery lightbox (shadcn Dialog). Mobile: featured image full-width, thumbnails in scrollable strip.

### 4. About

Centered column, max-w-3xl:
- Small decorative gold line
- "Tentang Venue" serif heading
- Description text, prose, leading-relaxed
- Stat pills below: capacity, location, price — each with icon

Scroll-triggered fade-up animation (motion).

### 5. Package Cards

Already built — `PackageCard` component unchanged. Section retains "Paket Wedding" heading and grid layout.

### 6. Footer CTA

Full-width cream section:
- "Siap Merencanakan Pernikahan Impian Anda?" serif heading
- Subtext
- Gold "Konsultasi Gratis" button → WhatsApp

Clean, no animation.

## Components

| Component | Type | Notes |
|-----------|------|-------|
| `VenueHero` | Client | Buttons need scroll/click handlers |
| `InfoChips` | Server | Pure display, derived from venue data |
| `ImageGallery` | Client | Lightbox modal state |
| `AboutSection` | Client | Motion scroll animation |
| `PackageCard` | Client | Already built |
| `FooterCTA` | Server | Static button link |

## Animation

- Use `motion` (Framer Motion, already installed)
- Sections: `whileInView` fade-up + slide-up (opacity 0→1, y 24→0)
- Cards: hover scale 1.02 + shadow increase
- Hero: staggered children animation for left column text
- Lightbox: standard Dialog open/close (already handled by shadcn)

## Color & Styling

- Existing brand tokens only (`brand-cream`, `brand-taupe`, `brand-gold`, `brand-sand`)
- Background: `bg-brand-cream`
- Cards: white, rounded-2xl, border-brand-sand/60
- Buttons: gold filled for primary, ghost for secondary
- Typography: Playfair (serif) for headings, Inter (sans) for body
- Spacing: generous whitespace, py-16 py-20 for sections

## No Changes

- No API modifications
- No database schema changes
- No new dependencies
- `getVenue()` data fetch unchanged
- `PackageCard` component unchanged
