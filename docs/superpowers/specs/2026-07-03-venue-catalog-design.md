# Venue Catalog Page — Design Spec

**Date:** 2026-07-03
**Route:** `/venue`
**Status:** Approved

---

## Overview

Replace the existing Find Vendors (`/vendors`) page with a Venue Catalog at `/venue`. Users can browse, filter, and search venues, view detailed information and packages for each venue, and compare packages side-by-side. Unlike the old static-data approach, this feature uses a MySQL database with Prisma ORM and Next.js API routes.

**Goals:**
- Provide a searchable, filterable venue catalog with cards (matching Find Vendors UI pattern)
- Detail page per venue with photo gallery, description, and package cards
- Package comparison table for side-by-side evaluation
- "Pesan" (book) buttons linking to WhatsApp with pre-filled messages

---

## Architecture

**Stack additions:**
- **Prisma ORM** — schema, migrations, type-safe client for MySQL
- **MySQL** — `sola_project` database (credentials in `.env`)
- **Next.js API Route Handlers** — `src/app/api/venues/` for data access

**Routes:**

| Route | Type | Method | Purpose |
|---|---|---|---|
| `/venue` | Server Component | GET | Listing page: filter sidebar + card grid |
| `/venue/[slug]` | Server Component | GET | Detail page: gallery, description, packages |
| `/api/venues` | API Route | GET | List venues (query params: search, location, capacity, price) |
| `/api/venues` | API Route | POST | Create venue (seed/admin) |
| `/api/venues/[slug]` | API Route | GET | Single venue with packages |

**Data flow:**
```
MySQL → Prisma Client → API Route Handler → Server Component → HTML (SSR)
                                                    ↓
                              Client component for real-time filter/search
```

---

## Database Schema (Prisma)

```prisma
model Venue {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  name        String
  location    String
  description String    @db.Text
  maxCapacity Int
  images      String    @db.Text   // JSON array of image URLs
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  packages    Package[]
}

model Package {
  id         Int     @id @default(autoincrement())
  venueId    Int
  name       String
  pax        Int
  price      BigInt
  features   String  @db.Text   // JSON array of feature strings
  bookingUrl String  @db.Text

  venue      Venue   @relation(fields: [venueId], references: [id], onDelete: Cascade)

  @@index([venueId])
}
```

**Notes:**
- `images` and `features` stored as JSON-stringified `TEXT` (MySQL lacks native JSON arrays)
- `price` uses `BigInt` (IDR amounts, no floating-point)
- `onDelete: Cascade` — deleting a venue removes its packages
- `slug` is unique for URL routing (`/venue/the-hermitage`)

---

## Seed Data

Prisma seed script (`prisma/seed.ts`) with 5 venues, each having 2-3 packages:

| Venue | Location | Max Capacity | Packages |
|---|---|---|---|
| The Hermitage | Jakarta | 500 | 100 Pax, 200 Pax, 300 Pax |
| Rumah Imam Bonjol | Bandung | 300 | 100 Pax, 200 Pax |
| Tirtha Bridal | Bali | 400 | 150 Pax, 250 Pax, 400 Pax |
| Gedung Sasana Budaya | Yogyakarta | 600 | 200 Pax, 400 Pax |
| Le Meridien | Jakarta | 350 | 150 Pax, 300 Pax |

Each package includes realistic pricing (IDR 20M–150M range) and 5-8 features (catering, decoration, photography, entertainment, etc.).

---

## Page: `/venue` — Listing

**Layout (Desktop):**
```
┌──────────────────────────────────────────────┐
│  Filter Sidebar (w-64, sticky)  │  Card Grid │
│  ┌────────────────────┐  │  ┌─────┐ ┌─────┐ │
│  │ Search (input)     │  │  │Card │ │Card │ │
│  ├────────────────────┤  │  └─────┘ └─────┘ │
│  │ Location           │  │  ┌─────┐ ┌─────┐ │
│  │ □ Jakarta (2)      │  │  │Card │ │Card │ │
│  │ □ Bandung (1)      │  │  └─────┘ └─────┘ │
│  │ □ Bali (1)         │  │                   │
│  │ □ Yogyakarta (1)   │  │ 3-col grid        │
│  ├────────────────────┤  │                   │
│  │ Capacity Range     │  │                   │
│  │ [slider/inputs]    │  │                   │
│  ├────────────────────┤  │                   │
│  │ Price Range        │  │                   │
│  │ [slider/inputs]    │  │                   │
│  ├────────────────────┤  │                   │
│  │ [Clear Filters]    │  │                   │
│  └────────────────────┘  └───────────────────┘
└──────────────────────────────────────────────┘
```

**Mobile:** Filter becomes a `Sheet` drawer triggered by a top toggle button (matching Find Vendors mobile pattern).

**Venue Card contents:**
- Cover image (first from `images` array, Next.js `<Image>`)
- Venue name (Playfair serif)
- Location with `MapPin` icon
- Max capacity with `Users` icon
- Starting price from cheapest package ("Mulai dari Rp 50.000.000")
- Entire card is a `<Link>` to `/venue/[slug]`

**Filter behavior:**
- `search` — text match against venue name
- `location` — checkbox list of unique locations (counts shown)
- `capacity` — min/max number inputs
- `price` — min/max number inputs (in millions IDR)
- "Clear all filters" button when any filter active

**Implementation:** Page is a server component that fetches initial data. A child client component handles filter state and re-filters in-memory (venues loaded once, filtered client-side for instant response).

**Empty state:** Centered message "Tidak ada venue yang sesuai dengan filter Anda." with clear-filters button.

---

## Page: `/venue/[slug]` — Detail

**Server Component** fetching single venue + packages from `/api/venues/[slug]`.

**Sections (top to bottom):**

1. **Back button** — `← Kembali ke Katalog`

2. **Image Gallery** — Horizontal scrollable row or 3-4 photo grid. Uses Next.js `<Image>`.

3. **Venue Header**
   - Name (Playfair, 3xl–5xl)
   - Location + map pin icon
   - Max capacity badge

4. **About This Venue** — Description text block with section ornament heading

5. **Available Packages** — Card grid (2-3 columns depending on count):
   - Package name
   - Pax count
   - Price (formatted IDR: "Rp 50.000.000")
   - Feature list with bullet/checkmark
   - "Pesan" button → `https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket [package name] di [venue name]...`
   - Checkbox "Bandingkan"

6. **Package Comparison** (toggle section):
   - Shows when 2+ packages selected
   - Side-by-side table using shadcn `Table`
   - Columns: Feature | Package A | Package B
   - Rows: Pax, Price, then each feature with ✓ if present, ✗ if not
   - "Bersihkan Perbandingan" button to reset

---

## API Routes

### `GET /api/venues`
Query params (all optional): `search`, `location`, `minCapacity`, `maxCapacity`, `minPrice`, `maxPrice`
Returns: `{ venues: VenueWithCheapestPackage[] }`

### `GET /api/venues/[slug]`
Returns: `{ venue: Venue & { packages: Package[] } }` — 404 if slug not found

### `POST /api/venues`
Body: venue data (used for seeding/admin)
Returns: created venue — protected by simple admin check

---

## Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `prisma/schema.prisma` | Venue + Package models |
| 2 | `prisma/seed.ts` | Seed 5 venues + ~12 packages |
| 3 | `src/app/venue/page.tsx` | Listing page (server + client components) |
| 4 | `src/app/venue/[slug]/page.tsx` | Detail page (server component) |
| 5 | `src/app/api/venues/route.ts` | GET/POST venues |
| 6 | `src/app/api/venues/[slug]/route.ts` | GET single venue |
| 7 | `src/components/venue/VenueCard.tsx` | Card for listing grid |
| 8 | `src/components/venue/VenueFilter.tsx` | Filter sidebar + mobile sheet |

## Files to Modify

| # | File | Change |
|---|------|--------|
| 9 | `src/components/ui-custom/Navbar.tsx` | Replace "Find Vendors" link with "Venue Catalog" → `/venue` |
| 10 | `src/components/ui-custom/Footer.tsx` | Replace "Find Vendors" link with "Venue Catalog" |
| 11 | `src/components/sections/VendorCarousel.tsx` | Change links from `/vendors` to `/venue` |
| 12 | `package.json` | Add `prisma`, `@prisma/client` |
| 13 | `.env` | Add `DATABASE_URL` |

## Files to Delete

| # | File | Reason |
|---|------|--------|
| 14 | `src/app/vendors/page.tsx` | Replaced by `/venue` |
| 15 | `src/components/marketplace/VendorCard.tsx` | Replaced by `VenueCard.tsx` |
| 16 | `src/components/marketplace/VendorFilter.tsx` | Replaced by `VenueFilter.tsx` |
| 17 | `src/components/marketplace/VendorDetailDialog.tsx` | Replaced by detail page |
| 18 | `src/lib/data/vendors.ts` | Static data replaced by DB |
| 19 | `src/lib/types/vendor.ts` | Type replaced by Prisma types |

---

## Environment

```env
DATABASE_URL="mysql://root:dimas1213@127.0.0.1:3306/sola_project"
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sola_project
DB_USERNAME=root
DB_PASSWORD=dimas1213
```

---

## States & Edge Cases

| Component | States |
|---|---|
| Venue Listing | Loading (skeleton cards), empty results, filtered empty, error (fetch failed) |
| Venue Card | Image loading (blur placeholder), hover animation |
| Filter | Active filter indicators, "no results" state |
| Detail Page | Loading (skeleton), venue not found (404), packages empty, single package (no compare) |
| Package Card | Compare checkbox interaction |
| Comparison Table | 0 selected (hidden), 1 selected (hidden), 2+ selected (visible) |

---

## Not In Scope

- Admin CRUD UI for venues/packages (only seed data + manual API calls)
- User authentication/authorization
- Payment or booking system (WhatsApp redirect only)
- Image upload (use external URLs in seed data)
- Server-side search/filter (client-side after initial fetch)
