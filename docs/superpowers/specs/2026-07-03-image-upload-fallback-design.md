# Image Upload + Default No-Image Fallback — Design Spec

**Date:** 2026-07-03
**Status:** Approved

---

## Overview

Replace URL-based image inputs in the venue dashboard form with file upload. Add an API endpoint to handle multipart uploads. Show a default Building2 icon as fallback wherever venue images are displayed when no image exists or loading fails.

---

## Upload API

### `POST /api/upload`

- Accepts `multipart/form-data` with field `file`
- Validates file type: JPEG, PNG, WebP only
- Max size: 5MB
- Saves to `public/uploads/venues/` with a unique filename (timestamp + random)
- Returns `{ url: "/uploads/venues/1710000000-a1b2c3.jpg" }`
- Error responses: 400 (invalid type), 413 (too large), 500

---

## Dashboard Venue Form Changes

**Images section** — replace URL text inputs with file upload:

- Each row: file input + upload button + thumbnail preview (or remove button for existing)
- Upload triggers `POST /api/upload` on file select
- On upload success: shows 100x100 thumbnail preview, stores returned URL
- On upload error: shows red error text inline
- Existing images show preview immediately (from stored URL)
- "Tambah Gambar" adds a new empty upload row

**Form data:** Stores array of URL strings in `images[]` (same format as before, just sourced from upload instead of manual URL entry).

---

## Default No-Image Fallback

**Applied everywhere** images are displayed:

```
┌──────────────────┐
│                  │
│     🏛️ (icon)    │  Building2 from lucide-react
│                  │  bg-gradient: sand → cream → gold/20
└──────────────────┘
```

Components updated:
- `VenueCard.tsx` — property listing card
- `PhotoCollage.tsx` — public collage section
- `/venue/[slug]` detail page gallery
- `/dashboard/venues/table.tsx` — optional small thumbnail column

Logic: `{image ? <Image /> : <Fallback />}`

---

## Seed Data

- Remove all external Unsplash URLs from `prisma/seed.ts`
- Set `images` to empty arrays `[]`
- All venues start with no images → show fallback icon on public pages
- Users upload images via dashboard after creation

---

## Files to Create

| # | File | Purpose |
|---|---|---|
| 1 | `src/app/api/upload/route.ts` | File upload handler |

## Files to Modify

| # | File | Change |
|---|---|---|
| 2 | `src/app/dashboard/venues/form.tsx` | Replace URL inputs with file upload rows |
| 3 | `src/components/venue/VenueCard.tsx` | Add Building2 fallback for no image |
| 4 | `src/components/sections/PhotoCollage.tsx` | Add Building2 fallback for no image |
| 5 | `src/app/venue/[slug]/page.tsx` | Add fallback in gallery grid |
| 6 | `prisma/seed.ts` | Remove Unsplash URLs, set empty image arrays |

## Files to Create (Directory)

| # | Directory | Purpose |
|---|---|---|
| 7 | `public/uploads/venues/` | Storage for uploaded venue images |

---

## States & Edge Cases

| Scenario | Behavior |
|---|---|
| File selected (valid) | Auto-upload, show thumbnail on success |
| File too large (>5MB) | Show inline error, don't upload |
| Invalid file type | Show inline error |
| Upload fails (network) | Show error, allow retry |
| No images on venue | Show Building2 fallback icon |
| Image URL 404/broken | Next.js `onError` → show fallback |
| Existing URL images (legacy) | Still display normally |

---

## Not In Scope

- Image cropping/resizing
- Drag-and-drop upload
- Multiple file upload
- Image optimization/CDN
