# Package Interactive Cards + Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace static inline package cards on venue detail page with compact interactive cards that open a modal to show full package content.

**Architecture:** Create a new `PackageCard` client component that renders a summary card and a `Dialog` modal. The card shows name, price, pax, and a 3-line content preview. Clicking anywhere on the card opens the modal with full rich-text content. Existing `@base-ui/react/dialog` wrapper in `src/components/ui/dialog.tsx` is reused.

**Tech Stack:** React 19, Next.js 16, Tailwind CSS v4, @base-ui/react dialog, @tailwindcss/typography (prose)

**Files:**
- Create: `src/app/venue/[slug]/package-card.tsx`
- Modify: `src/app/venue/[slug]/page.tsx`

---

### Task 1: Create PackageCard client component

**Files:**
- Create: `src/app/venue/[slug]/package-card.tsx`

- [ ] **Step 1: Write the `PackageCard` component**

```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PackageData {
  id: number;
  name: string;
  pax: number;
  price: number;
  content: string;
  bookingUrl: string;
}

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function PackageCard({ pkg }: { pkg: PackageData }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Card */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-white rounded-2xl border border-brand-sand/60 p-6 md:p-8 hover:border-brand-gold/30 hover:shadow-md transition-all duration-300 flex flex-col text-left cursor-pointer w-full"
      >
        {/* Pax badge */}
        <div className="mb-5">
          <span className="text-xs text-brand-gold/70 font-medium bg-brand-gold/5 px-2.5 py-1 rounded-full">
            {pkg.pax} tamu
          </span>
        </div>

        {/* Name */}
        <h3 className="font-serif text-lg text-brand-taupe font-semibold mb-1">
          {pkg.name}
        </h3>

        {/* Price */}
        <p className="text-2xl font-bold text-brand-taupe mt-2 mb-4">
          {formatIDR(pkg.price)}
        </p>

        {/* Content preview — line-clamp + fade */}
        {pkg.content && (
          <div className="relative mb-4">
            <div
              className="prose prose-sm max-w-none line-clamp-3 text-brand-taupe/55 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-brand-taupe/60 [&_h3]:mb-1 [&_h3]:mt-2 [&_ul]:pl-4 [&_ul]:space-y-0.5 [&_ul]:my-1 [&_li]:text-brand-taupe/50 [&_li]:text-xs"
              dangerouslySetInnerHTML={{ __html: pkg.content }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        )}

        {/* CTA */}
        <span className="text-xs font-medium text-brand-gold/70 hover:text-brand-gold mt-auto inline-flex items-center gap-1">
          Lihat Detail
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>

      {/* Modal */}
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto bg-[#FDFBF7] border-brand-sand/40">
        <DialogHeader className="gap-3">
          <span className="text-xs text-brand-gold/70 font-medium bg-brand-gold/5 px-2.5 py-1 rounded-full w-fit">
            {pkg.pax} tamu
          </span>
          <DialogTitle className="font-serif text-xl text-brand-taupe">
            {pkg.name}
          </DialogTitle>
          <p className="text-2xl font-bold text-brand-taupe">
            {formatIDR(pkg.price)}
          </p>
        </DialogHeader>

        {pkg.content && (
          <div className="pt-4 border-t border-brand-sand/40">
            <div
              className="prose prose-sm max-w-none text-brand-taupe/65 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-brand-taupe/70 [&_h3]:mb-2 [&_h3]:mt-4 [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_li]:text-sm [&_li]:text-brand-taupe/55 [&_li]:marker:text-brand-gold/40"
              dangerouslySetInnerHTML={{ __html: pkg.content }}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/[slug]/package-card.tsx
git commit -m "feat: add PackageCard component with summary card and detail modal"
```

---

### Task 2: Wire PackageCard into venue detail page

**Files:**
- Modify: `src/app/venue/[slug]/page.tsx` (lines 142-174)

- [ ] **Step 1: Replace inline card markup with `<PackageCard>`**

Import the component at the top of `page.tsx`:

```tsx
import { PackageCard } from "./package-card";
```

Then replace lines 142-174 (the entire `<div className="grid...">` block with its children):

**Before (lines 142-174):**
```tsx
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-brand-sand/60 p-6 md:p-8 hover:border-brand-gold/30 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="mb-5">
                  <span className="text-xs text-brand-gold/70 font-medium bg-brand-gold/5 px-2.5 py-1 rounded-full">
                    {pkg.pax} tamu
                  </span>
                </div>
                <h3 className="font-serif text-lg text-brand-taupe font-semibold mb-1">
                  {pkg.name}
                </h3>
                <p className="text-2xl font-bold text-brand-taupe mt-2 mb-5">
                  {formatIDR(pkg.price)}
                </p>
                {pkg.content && (
                  <div
                    className="prose prose-sm max-w-none mb-6 flex-1 text-brand-taupe/55 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-brand-taupe/60 [&_h3]:mb-2 [&_h3]:mt-3 [&_ul]:pl-4 [&_ul]:space-y-1 [&_ul]:my-2 [&_li]:text-brand-taupe/50 [&_li]:text-sm"
                    dangerouslySetInnerHTML={{ __html: pkg.content }}
                  />
                )}
                <a
                  href={pkg.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-brand-gold text-white rounded-xl text-sm font-medium text-center hover:bg-brand-taupe transition-colors mt-auto"
                >
                  Pesan Sekarang
                </a>
              </div>
            ))}
          </div>
```

**After:**
```tsx
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
```

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/[slug]/page.tsx
git commit -m "refactor: replace inline package cards with PackageCard component"
```
