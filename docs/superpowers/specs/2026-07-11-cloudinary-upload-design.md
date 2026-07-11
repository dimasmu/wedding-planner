# Cloudinary Upload Integration Design

**Date:** 2026-07-11
**Status:** Approved

## Problem

`POST /api/upload` writes files to `public/uploads/venues/` using `fs.writeFile`. On Vercel's serverless platform, the filesystem is read-only except for `/tmp`, causing `EROFS` errors. No cloud storage integration exists.

## Solution

Replace local filesystem upload with direct client-to-Cloudinary unsigned uploads.

### Architecture

**Before:** `Browser → POST /api/upload → writeFile to disk → return local URL`

**After:** `Browser → POST to Cloudinary API → return Cloudinary URL`

The `/api/upload` route is deleted. The venue form uploads directly to Cloudinary via unsigned upload preset, then stores the returned `secure_url` in the form state (same format as before).

### Data Flow

1. User selects a file in the venue form
2. Client posts FormData directly to `https://api.cloudinary.com/v1_1/gm3kcifb/image/upload`
3. Cloudinary returns `{ secure_url, public_id, width, height, ... }`
4. Client stores `secure_url` in the form's `images` array
5. On venue save, the Cloudinary URL gets persisted to Neon DB (no change)

### Authentication (Unsigned Uploads)

Client uses an **unsigned upload preset** — no API secret in browser code.

**Cloudinary console setup (one-time):**
1. Settings → Upload → Upload presets
2. Create preset named `sola_venue_upload`
3. Signing mode: Unsigned
4. Folder: `sola-wedding/venues`
5. Allowed formats: jpg, png, webp

### File Changes

| File | Change | Description |
|------|--------|-------------|
| `src/app/api/upload/route.ts` | **Delete** | No longer needed |
| `src/app/dashboard/venues/form.tsx` | **Modify** | Swap fetch from `/api/upload` to Cloudinary endpoint |

### Code Change (form.tsx)

Upload call changes from:
```typescript
const formData = new FormData();
formData.append("file", file);
const res = await fetch("/api/upload", { method: "POST", body: formData });
const data = await res.json();
// data.url = "/uploads/venues/abc.jpg"
```

To:
```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", "sola_venue_upload");
const res = await fetch(
  "https://api.cloudinary.com/v1_1/gm3kcifb/image/upload",
  { method: "POST", body: formData }
);
const data = await res.json();
// data.secure_url = "https://res.cloudinary.com/gm3kcifb/image/upload/v123/venues/abc.jpg"
```

### Error Handling

- Cloudinary errors surface via response status check — show toast on failure
- Client-side 5MB check stays as UX guard
- File type validation moves to Cloudinary (enforced by preset's allowed formats)
- Upload progress spinner preserved from existing code

### What Does NOT Change

- Database schema (`Venue.images` stores URLs as JSON string, same as before)
- All consumer components: VenueHero, VenueCard, ImageGallery (they render whatever URL is in `images[]`)
- API routes for venue CRUD
- Dashboard layout, styling, UX
- Image preview after upload (extract `secure_url` from response, same pattern)

### Backwards Compatibility

Venues with old `/uploads/venues/...` URLs will show broken images in production since those local files don't exist on Vercel. This is acceptable because production never had working uploads — the error prevented any real data from being created with local URLs.

### Rollback

If Cloudinary upload fails in production:
1. Revert the form.tsx upload call back to `/api/upload`
2. Ensure `route.ts` exists
3. Local filesystem uploads will work on local dev, still won't work on Vercel
