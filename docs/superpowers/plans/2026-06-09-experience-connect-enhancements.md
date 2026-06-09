# Experience Stats & Connect Social Grid — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a stats bar to The Experience dark overlay and expand Connect With Us to a 3x2 grid of 6 social platforms.

**Architecture:** Two targeted edits in `src/app/about/page.tsx` — section 4 overlay (lines 398-403) and section 8 social links card (lines 579-617). No new files, imports, or dependencies.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, next/link, next/image

**Spec:** `docs/superpowers/specs/2026-06-09-experience-connect-enhancements-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/app/about/page.tsx` | Modify | Sections 4 and 8 only |

---

### Task 1: Add stats bar to The Experience overlay

**Files:**
- Modify: `src/app/about/page.tsx:398-403`

- [ ] **Step 1: Replace the dark overlay div**

Replace lines 398-403 (the overlay containing only the quote) with the expanded version:

```tsx
              {/* Overlay with quote + stats */}
              <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
                <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-white text-center px-6 italic leading-snug [text-shadow:0_2px_18px_rgba(0,0,0,0.8)]">
                  &ldquo;Every detail matters.<br />Every moment counts.&rdquo;
                </p>

                {/* Gold divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px w-16 bg-brand-gold/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/50" />
                  <div className="h-px w-16 bg-brand-gold/40" />
                </div>

                {/* Stats row */}
                <div className="flex gap-10 md:gap-14">
                  <div className="text-center">
                    <div className="font-serif text-2xl md:text-3xl text-brand-gold italic">200+</div>
                    <div className="text-white/50 text-[10px] tracking-[0.2em] uppercase mt-1">Events</div>
                  </div>
                  <div className="text-center">
                    <div className="font-serif text-2xl md:text-3xl text-brand-gold italic">8yr</div>
                    <div className="text-white/50 text-[10px] tracking-[0.2em] uppercase mt-1">Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="font-serif text-2xl md:text-3xl text-brand-gold italic">50+</div>
                    <div className="text-white/50 text-[10px] tracking-[0.2em] uppercase mt-1">Vendors</div>
                  </div>
                </div>
              </div>
```

**Key changes from original:**
- Overlay container: `flex items-center justify-center` → `flex flex-col items-center justify-center gap-6`
- Quote stays exactly as-is
- Gold divider line + dot added
- 3-stat row (Events, Experience, Vendors) below

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Successful build, `/about` route present.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: add stats bar inside The Experience dark overlay"
```

---

### Task 2: Expand Connect With Us to 3x2 social grid

**Files:**
- Modify: `src/app/about/page.tsx:579-617`

- [ ] **Step 1: Replace the social links card content**

Replace the social links div (lines 580-617 — the card content including all 3 existing Link elements) with the 3x2 grid:

```tsx
            <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl border border-brand-gold/10 shadow-lg shadow-brand-gold/5 p-10 md:p-14">
              {/* social links grid — 3x2 */}
              <div className="grid grid-cols-3 gap-6 md:gap-10">
                {/* Facebook */}
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex flex-col items-center gap-1.5 text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  <span className="text-[10px] tracking-[0.15em] uppercase">Facebook</span>
                </Link>

                {/* Instagram */}
                <Link
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex flex-col items-center gap-1.5 text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>
                  <span className="text-[10px] tracking-[0.15em] uppercase">Instagram</span>
                </Link>

                {/* TikTok */}
                <Link
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex flex-col items-center gap-1.5 text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                  <span className="text-[10px] tracking-[0.15em] uppercase">TikTok</span>
                </Link>

                {/* LinkedIn */}
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex flex-col items-center gap-1.5 text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span className="text-[10px] tracking-[0.15em] uppercase">LinkedIn</span>
                </Link>

                {/* X / Twitter */}
                <Link
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="flex flex-col items-center gap-1.5 text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
                  </svg>
                  <span className="text-[10px] tracking-[0.15em] uppercase">X</span>
                </Link>

                {/* Pinterest */}
                <Link
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Pinterest"
                  className="flex flex-col items-center gap-1.5 text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m8 22 4-14" />
                    <path d="M12 2a7.3 7.3 0 0 0-7 7c0 2.6 1.4 4.9 3.5 6" />
                    <path d="M12 2a7.3 7.3 0 0 1 7 7c0 2.6-1.4 4.9-3.5 6" />
                  </svg>
                  <span className="text-[10px] tracking-[0.15em] uppercase">Pinterest</span>
                </Link>
              </div>
            </div>
```

**Key changes from original:**
- `flex items-center justify-center gap-6` → `grid grid-cols-3 gap-6 md:gap-10`
- Each icon gets a `<span>` label below it
- 3 new platforms: Instagram, TikTok, Pinterest
- Icon size reduced from 24x24 to 22x22/20x20 for tighter fit
- Default color changed from `text-brand-taupe/50` to `text-brand-taupe/40` (label reads better)
- Each Link gets `flex flex-col items-center gap-1.5` for icon-stacked-on-label layout

- [ ] **Step 2: Verify build**

Run: `npx next build`
Expected: Successful build, `/about` route present.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: expand Connect With Us to 3x2 social grid with 6 platforms"
```

---

### Task 3: Final verification

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Build check**

Run: `npx next build`
Expected: All routes static, no warnings.

- [ ] **Step 3: Visual check**

Run: `npx next dev` and verify:
1. The Experience section shows quote, divider, and 3 stats inside the dark overlay
2. Connect With Us shows 6 icons in a 3x2 grid with labels
3. All 6 social icons have hover effects (scale + gold color)
4. No other sections changed

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "chore: verify experience stats and connect social grid"
```
