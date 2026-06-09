# The Experience & Connect With Us Enhancements

**Date:** 2026-06-09
**Status:** Approved
**Scope:** Modify sections 4 (The Experience) and 8 (Connect With Us) in `src/app/about/page.tsx`

---

## Section 4 — The Experience

### Current State
3-image grid with a dark overlay showing only the quote `"Every detail matters. Every moment counts."`

### Change
Add a stats bar inside the dark overlay, below the quote, separated by a gold divider.

**Overlay content structure:**
```
quote text (existing)
gold line + dot divider
stats row: 200+ Events  |  8yr Experience  |  50+ Vendors
```

**Stats data:**

| Value | Label |
|---|---|
| 200+ | Events |
| 8yr | Experience |
| 50+ | Vendors |

**Styling:**
- Quote: stays as-is (`font-serif italic`, white, text-shadow)
- Gold divider: `h-px w-16 bg-brand-gold/40` with a center dot `w-1.5 h-1.5 rounded-full bg-brand-gold/50`
- Stats container: `flex gap-12` centered
- Stat numbers: `font-serif italic text-brand-gold`, responsive sizing matching the overlay typography
- Stat labels: `text-white/50 text-[10px] tracking-[0.2em] uppercase`
- The overlay div changes from `flex items-center justify-center` (single child) to `flex flex-col items-center justify-center gap-6` (3-row stack)

### What Stays
- 3-image grid layout
- Dark overlay (`bg-brand-dark/95 backdrop-blur-sm`)
- Section background (`bg-brand-cream`)
- Section header, ornament, RevealSection
- All image sources and alt text

---

## Section 8 — Connect With Us

### Current State
Card with 3 social icons in a single row: Facebook, LinkedIn, X.

### Change
Replace with a 3x2 grid of 6 social icons, each showing an SVG icon with a small uppercase label below.

**New social platforms (added):**
- Instagram
- TikTok
- Pinterest

**Layout:**
- Grid: `grid grid-cols-3 gap-8` (3 columns, 2 rows)
- Each cell: flex column centered, icon on top, label below
- Icon: SVG element, `text-brand-taupe/40`, `hover:text-brand-gold hover:scale-110 transition-all duration-300`
- Label: `text-[10px] tracking-[0.15em] uppercase text-brand-taupe/30`

**Icons (SVGs):**

| Platform | SVG description | Link placeholder |
|---|---|---|
| Facebook | Existing Facebook SVG | `https://facebook.com` |
| Instagram | Camera/instagram SVG: `<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>` | `https://instagram.com` |
| TikTok | Music note SVG: `<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>` | `https://tiktok.com` |
| LinkedIn | Existing LinkedIn SVG | `https://linkedin.com` |
| X | Existing X/Twitter SVG | `https://x.com` |
| Pinterest | Pin SVG: `<circle cx="12" cy="12" r="10"/><path d="m8 22 4-14"/><path d="M12 2a7.3 7.3 0 0 0-7 7c0 2.6 1.4 4.9 3.5 6"/><path d="M12 2a7.3 7.3 0 0 1 7 7c0 2.6-1.4 4.9-3.5 6"/>` | `https://pinterest.com` |

**Labels:** FACEBOOK, INSTAGRAM, TIKTOK, LINKEDIN, X, PINTEREST

### What Stays
- Section background (`bg-brand-cream`)
- Card container with `bg-white/60 backdrop-blur-sm rounded-2xl border shadow-lg`
- Section header, ornament, subtitle, RevealSection
- `next/link` usage for all links with `target="_blank" rel="noopener noreferrer" aria-label`

---

## Implementation Notes

### File Scope
Single file: `src/app/about/page.tsx`. Only sections 4 and 8 change.

### Sections Not Affected
Sections 1, 2, 3, 5, 6, 7 remain unchanged.

### Accessibility
- All social links retain `aria-label`
- Stats text is decorative — no `aria-` needed (within visual overlay)
- `motion-safe:` already applied by `RevealSection`

### Verification
- `npx tsc --noEmit` — no type errors
- `npx next build` — successful static build
