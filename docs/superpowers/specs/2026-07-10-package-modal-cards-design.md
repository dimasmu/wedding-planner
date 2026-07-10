# Package Interactive Cards + Modal — Venue Detail Page

**Date:** 2026-07-10
**Status:** Approved

## Summary

Redesign the package section on the venue detail page (`/venue/[slug]`). Replace the current static inline cards with compact interactive cards that open a modal showing the full package content.

## Design

### Package Card (compact)

Each card in the grid shows a summary only:
- **Pax badge** — small pill (`"X tamu"`)
- **Package name** — serif heading
- **Price** — bold, prominent
- **Content preview** — first ~3 lines of the TipTap HTML rendered with a `line-clamp-3` truncation and a bottom fade gradient to indicate more content
- **"Lihat Detail"** — subtle link/CTA at the bottom

The entire card is clickable. Clicking anywhere opens the modal. Cards remain in the same responsive grid (1 col mobile, 2 col tablet, 3 col desktop).

### Modal (on click)

A centered dialog overlay (client component, rendered via `useState` + `dialog` or a custom overlay):
- **Header**: package name as title
- **Metadata row**: pax badge + formatted price
- **Divider**
- **Body**: full rich-text HTML content, styled with the `prose` + typography plugin classes (same as current — bullets, headings, spacing all work)
- **Close**: X icon button, top-right corner. Clicking the backdrop also closes.
- **Animation**: fade + slight scale on open, same on close

### Behavior

- Click card → open modal
- Click close button or backdrop → close modal
- Modal scrolls independently if content is taller than viewport
- `body` scroll locked when modal is open
- Accessible: Escape key closes, focus trapped inside modal

## What stays the same

- Grid layout classes unchanged
- "Belum ada paket" empty state unchanged
- Data fetching (`getVenue`) unchanged
- `PackageData` interface unchanged
- No changes to form/editor — this is display only

## Architecture

```
PackageCard (new client component)
  └─ shows summary, click handler → opens modal

PackageModal (new client component)
  └─ renders full package content in overlay

venue/[slug]/page.tsx
  └─ maps packages → <PackageCard /> instead of inline divs
```

## Files

| File | Action |
|------|--------|
| `src/app/venue/[slug]/page.tsx` | Replace inline package cards with `<PackageCard>` |
| `src/app/venue/[slug]/package-card.tsx` | New — card + modal, client component |
| `src/components/ui/dialog.tsx` | May need if no existing dialog (check) |
