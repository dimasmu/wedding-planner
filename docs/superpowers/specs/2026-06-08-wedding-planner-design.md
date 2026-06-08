# Wedding Planner Platform — Design Spec

**Date:** 2026-06-08
**Source:** PRD — "Wedding Planner Revamp: Interactive Implementation Guide & Checklist"

## Tech Stack (Final — June 2026)

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack default) | 16.2.x |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) | 4.3.x |
| UI Components | shadcn/ui (Radix primitives) | Latest |
| Animation | Motion (formerly Framer Motion) | 12.x |
| State | Zustand | 5.x |
| Charts | recharts | 3.8.x |
| Forms | React Hook Form + Zod | Latest |
| Fonts | Playfair Display (serif) + Inter (sans) via next/font | — |
| Runtime | Node.js 24 LTS | 24.x |

### Key Adaptations from PRD

1. **Tailwind v3 → v4:** `tailwind.config.js` eliminated. Brand colors defined via `@theme` directive in `globals.css`. CSS-first configuration.
2. **shadcn/ui CLI:** `npx shadcn@latest init` (was `npx shadcn-ui init`).
3. **Framer Motion → Motion:** Package renamed to `motion`, import from `"motion"`.
4. **Zustand v4 → v5:** `create<T>()((set, get) => ({}))` double-parentheses syntax.
5. **Next.js 16:** Turbopack enabled by default, no `--turbopack` flag needed.

## Routing

```
/                          → Landing Page
/login                     → Login Page
/register                  → Register Page
/vendors                   → Vendor Marketplace (grid + filters)
/vendors/[id]              → Vendor Detail
/inspiration               → Inspiration Gallery
/pricing                   → Pricing Page
/dashboard                 → Client Dashboard (checklist, budget, guests)
/dashboard/vendor          → Vendor Dashboard (portfolio, bookings)
```

## Component Architecture

### Layout Components
- `Navbar.tsx` — sticky header, desktop NavigationMenu, mobile Sheet drawer
- `Footer.tsx` — newsletter input, nav links
- `Sidebar.tsx` — dashboard side navigation

### Landing Page Sections
- `HeroSection.tsx` — image slideshow with Motion AnimatePresence
- `HowItWorks.tsx` — 3-step grid with Cards
- `VendorCarousel.tsx` — category carousel
- `TestimonialCarousel.tsx` — quote cards with autoplay
- `PricingSection.tsx` — 3-tier pricing comparison

### Marketplace Components
- `VendorFilter.tsx` — collapsible desktop / Sheet mobile
- `VendorCard.tsx` — hover-lift card with image
- `VendorDetailDialog.tsx` — Dialog with Request Quote form + toast

### Dashboard Components
- `ChecklistContainer.tsx` — Progress + Checkbox task list
- `BudgetPieChart.tsx` — recharts PieChart
- `GuestListTable.tsx` — RSVP filterable table
- `BookingTable.tsx` — vendor booking management

## Data Flow

- **Zustand stores:** checklist, budget tracker, guest list, vendor filters
- **Forms:** React Hook Form + Zod validation
- **Auth flow:** login/register pages with Tabs + Form components
- **Animations:** Motion for page transitions, scroll reveals, hover effects, hero slideshow

## Color Palette (Warm Chic & Elegant)

| Token | Value | Usage |
|---|---|---|
| `brand-cream` | `#FDFBF7` | Main background |
| `brand-taupe` | `#4A3E3D` | Text & dark accents |
| `brand-gold` | `#D3A27F` | Accent, buttons, highlights |
| `brand-sand` | `#F5EFEB` | Secondary backgrounds |
| `brand-dark` | `#1E1E1E` | Primary dark text |

## Scope

Full platform — all 4 phases:
1. Landing page (hero, how it works, vendors, testimonials, pricing)
2. Vendor marketplace + auth (login, register, vendor grid, detail, quote)
3. Client dashboard (checklist, budget tracker, guest list)
4. Vendor dashboard (portfolio, bookings) + optimization
