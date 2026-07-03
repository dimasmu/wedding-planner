# TipTap Rich Text for Package Content — Design Spec

**Date:** 2026-07-03
**Status:** Approved

---

## Overview

Replace the flat `features: string[]` array on packages with rich HTML content edited via a TipTap WYSIWYG editor in the dashboard. Package content is stored as HTML and rendered on the public venue detail page.

---

## Data Model

### Prisma Migration

Rename `features` column on `Package` model to `content`:

```prisma
model Package {
  // ...
  content    String  @db.Text  // was: features
  // ...
}
```

New migration: rename column, keeping existing data. Old features arrays become plain text in the new column (handled by seed re-run).

### API Changes

- `GET /api/venues/[slug]` — return `content` as-is (HTML string), remove `features` parsing
- `POST/PUT` — accept `content` instead of `features`
- `POST /api/venues/[slug]/packages` — accept `content`
- `PUT /api/packages/[id]` — accept `content`

---

## TipTap Editor Component

**File:** `src/components/ui/rich-text-editor.tsx`

Features:
- `@tiptap/react` + `@tiptap/starter-kit` (bold, italic, heading, bullet list, ordered list, paragraph)
- Shadcn-styled toolbar: `bg-brand-cream`, active buttons `bg-brand-gold/20 text-brand-gold`, borders `border-brand-sand`
- Props: `content: string`, `onChange: (html: string) => void`
- `min-h-[200px]`, scrollable content area, styled border matching form inputs
- No image upload support (text-only for v1)

```tsx
<RichTextEditor content={value} onChange={setValue} />
```

---

## Dashboard Form Changes

**File:** `src/app/dashboard/venues/form.tsx`

- Remove `useFieldArray` for features
- Remove `PackageFeatures` sub-component
- Package schema: `features: z.array(...)` → `content: z.string()`
- Each package card gets one `<RichTextEditor>` instead of feature list inputs
- Package form fields: name, pax, price, bookingUrl, content (no features)

---

## Public Display

**File:** `src/app/venue/[slug]/page.tsx`

- Replace feature `<ul>` with `<div dangerouslySetInnerHTML={{ __html: pkg.content }} />`
- Add prose styling to rendered HTML (headings, lists, spacing)

---

## Seed Data

Rewrite package content as structured HTML with 6 sections per package:

```html
<h3>🍴 Food & Beverages</h3>
<ul><li>Buffet 100 pax</li><li>...</li></ul>
<h3>🏨 Venue</h3>
<ul><li>...</li></ul>
```

---

## Dependencies

```json
{
  "@tiptap/react": "^2.x",
  "@tiptap/starter-kit": "^2.x"
}
```

---

## Files to Create

| # | File | Purpose |
|---|---|---|
| 1 | `src/components/ui/rich-text-editor.tsx` | TipTap WYSIWYG component |

## Files to Modify

| # | File | Change |
|---|---|---|
| 2 | `prisma/schema.prisma` | Rename features → content on Package |
| 3 | `prisma/seed.ts` | Replace features arrays with HTML content |
| 4 | `src/app/dashboard/venues/form.tsx` | Replace feature inputs with RichTextEditor |
| 5 | `src/app/api/venues/[slug]/route.ts` | Return content, remove features parsing |
| 6 | `src/app/api/venues/[slug]/packages/route.ts` | Accept content instead of features |
| 7 | `src/app/api/packages/[id]/route.ts` | Accept content instead of features |
| 8 | `package.json` | Add @tiptap/react, @tiptap/starter-kit |

---

## States

| Scenario | Behavior |
|---|---|
| Empty content | Editor shows empty placeholder, public page shows nothing |
| Existing features data | Renamed column keeps old data as plain text, re-seed overwrites |
| Editor loading | Simple spinner, editor initializes in ~100ms |
| Long content | Scrollable editor, no height limit |
