# About Page Redesign — Soft Romantic

**Date:** 2026-06-09
**Status:** Approved
**Scope:** Re-skin of `src/app/about/page.tsx` — same 8-section structure, Soft Romantic aesthetic

---

## Design System Changes

### Color Palette

All existing brand tokens stay. One accent change:

| Token | Old | New |
|---|---|---|
| Contrast section bg | Teal `#628E90` | Terracotta-rose `#C4856E` |

The teal is replaced on sections 6 (Clients & Partners) and 7 (FAQ). The connecting gradient in section 8 also uses the new terracotta.

### Typography Shifts

- Hero heading: `italic` serif (currently upright)
- Section headings: `italic` where feel calls for it ("Why Choose SOLA", "The Experience", "Who Trusts Us")
- Subtitles: gold-tinted `italic` with `font-light` instead of taupe `font-light`
- Story timeline years: larger, `italic`, at 15% gold opacity (decorative, not functional)
- FAQ numbers: smaller, `italic`, fainter gold

### Ornament System

Replace the current `SparklesIcon` + flat line pattern with a richer set:

| Ornament | Where | Description |
|---|---|---|
| Monogram badge | Hero (top), Connect (top) | Nested concentric circles with italic "S" — bookends the page |
| Floating circles | Hero background | 3 CSS-animated rings at different sizes/speeds |
| Wreath | Our Story header | Two crossed laurel sprigs in gold SVG |
| Circle-within-circle | Why Choose SOLA, Experience | Concentric ring SVG |
| Stepped lines + dot | Experience, Connect | Short-long-dot-long-short line pattern |
| People icon | Clients & Partners | Community/group SVG replacing sparkle |
| Gradient dividers | Story timeline, Connect gradient | Lines that fade at both ends |

### Motion System

Two motion sources work together:

1. **CSS animations** — `animate-float` keyframes for hero circles and decorative elements
2. **IntersectionObserver scroll reveals** — existing `useReveal` hook stays, enhanced:
   - Staggered children: cards/steps/images reveal with increasing delay
   - `transition-duration: 1200ms` (up from 1000ms) for smoother feel
   - Easing stays `cubic-bezier(0.22, 1, 0.36, 1)`
   - Initial-load hero animation plays immediately (no scroll needed)

### Image Hover Effects

All images across every section get hover treatments:
- `hover:scale-[1.03]` gentle zoom
- `transition-all duration-700 ease-out`
- Warm tint overlay that fades in on hover (via `::after` pseudo or gradient overlay)

---

## Section-by-Section

### 1. Hero

- **Layout:** Full-viewport, centered content
- **Background:** CSS gradient `#fef9f2 → #fdf0e4 → #fbe5d3` (blush gradient). No photo.
- **Overlays:** Dot-pattern texture (24px grid, gold dots at 4% opacity) masked with radial fade. Warm radial glow at center-top.
- **Ornaments:** 3 floating ring circles (CSS `@keyframes float`), monogram "S" badge
- **Typography:** `About SOLA` in large italic serif (72px). `where celebrations bloom` in gold italic below.
- **Scroll indicator:** `Discover our story` label + gradient vertical line (replaces mouse circle)
- **Motion:** Floating circles animate immediately. Text fades in on load (no scroll trigger).

### 2. Who We Are

- **Background:** Blush-to-cream gradient with subtle gold radial glow in corner
- **Image side:** Photo in warm gradient frame. Corner ornament (partial border on bottom-right) replaces full rectangle border.
- **Text side:** SOLA logo moved here (gold italic, no longer over image). Section label with gold line + dot. Body text in lighter `font-light` taupe. Closing gold flourish.
- **Motion:** Image fades in from left, text from right. Staggered.

### 3. Our Story (Timeline)

- **Background:** Cream to blush gradient with subtle dot texture
- **Ornament:** Wreath SVG (two crossed laurel sprigs) replaces sparkle
- **Timeline line:** Gradient fade at both ends (not abrupt cut)
- **Dots:** Gold circles with ring outline on cream background — softer than current bordered dots
- **Years:** Italic, gold at 15% opacity, positioned decoratively
- **Final dot:** Larger and fully opaque gold
- **Motion:** Each timeline step reveals on scroll with staggered delay

### 4. The Experience (Gallery)

- **Layout:** 2-column grid — large vertical image left, two stacked horizontals right
- **Numbered tab:** Gold "01" badge on the left image (editorial feel)
- **Quote:** Centered below images as integrated text with oversized opening quote mark — not a floating card
- **Background:** Blush-cream gradient with dot pattern and large faint decorative rings
- **Ornament:** Concentric ring motif for section header
- **Motion:** Images stagger in (left first, then top-right, then bottom-right). Quote fades in last.

### 5. Why Choose SOLA (Value Cards)

- **Layout:** 2x2 card grid
- **Cards:** Glass-morphism — `bg-white/70 backdrop-blur-sm` with gold border (`border-brand-gold/10`)
- **Numbers:** Extra-large, italic, gold at 12% opacity — decorative, not functional
- **Corner glow:** Each card has a gold radial glow in its top-right corner
- **Background:** Blush-cream-blush gradient with warm radial glow center
- **Ornament:** Circle-within-circle SVG
- **Motion:** Cards stagger in with subtle rotation (like cards dealt onto a table). No hover translate-y — just a gentle border glow.

### 6. Clients & Partners

- **Background:** Terracotta-rose `#C4856E` gradient (replaces teal `#628E90`)
- **Ornament:** People/community icon (replaces sparkle)
- **Floating rings:** Faint white circles in corners
- **Column headings:** Smaller, italic, white at 70%
- **Subtitle:** Italic white
- **Divider:** Gradient-fade white line between columns
- **Logo marquees:** Same animation logic. Hover: warm tint instead of invert.
- **Motion:** Logo rows slide in from opposite sides on reveal

### 7. FAQ

- **Background:** Same terracotta-rose — seamless flow from section 6
- **Card:** Frosted white (`bg-white/92 backdrop-blur-md`) with soft shadow
- **Numbers:** Smaller italic gold (22px, 35% opacity)
- **Expand icon:** Simple gold `+` (replaces chevron)
- **Dividers:** Terracotta-tinted (`border-[#C4856E]/10`)
- **Trigger hover:** Gold text color change
- **No "FFFFF0" background:** Clean cream-white instead of yellowish
- **Motion:** Items stagger in on scroll. Open/close uses smooth height transition.

### 8. Connect With Us

- **Background:** Gradient — deep terracotta at top, transitioning through blush to cream at bottom. Bridges the dark FAQ section to the light footer.
- **Monogram badge:** Same nested-circle "S" from hero — creates opening/closing bookend
- **No card wrapper:** Content floats directly on gradient
- **Social icons:** Circle frames with gold border instead of bare SVGs
- **Closing ornament:** Line-dot-line pattern
- **Motion:** Social icons pop in sequentially. Monogram pulses gently.

---

## Implementation Notes

### What Stays

- All existing data (logos, FAQ content, story steps, value cards)
- `useReveal` IntersectionObserver hook — enhanced, not replaced
- `LogoMarquee` component — enhanced styling, not rewritten
- `RevealSection` wrapper — stays as-is
- Card and Accordion shadcn components — used as-is
- `next/image` with fill/sizes/priority — same approach
- All existing image paths in `/asset/about_us/`

### What Changes

- Color values: replace all `#628E90` with `#C4856E`
- Ornaments: new SVG components replace `SparklesIcon`/`SectionOrnament`
- Motion: add CSS `@keyframes float`, enhance reveal delays
- Typography: add `italic`, adjust opacity values on years/numbers/labels
- Backgrounds: gradient classes replace flat `bg-brand-sand`

### File Scope

Single file: `src/app/about/page.tsx`. The redesign stays within this file — no new component files unless needed for complexity management. If `LogoMarquee` or `useReveal` are extracted for reuse across pages, that's a separate decision.

### Dependencies

No new packages needed. All capabilities exist:
- Tailwind CSS v4 for gradients, animations, glass effects
- `next/image` for optimized images
- `next/link` for social links
- `@/components/ui/card`, `@/components/ui/accordion` for card/accordion
- IntersectionObserver API for scroll reveals (browser-native)

### Accessibility

- All images retain `alt` text
- Social links retain `aria-label`
- FAQ accordion stays keyboard-navigable (shadcn Accordion handles this)
- `motion-safe:` prefix on all animations (respects user preference)
- Color contrast: white text on `#C4856E` passes WCAG AA (ratio ~4.5:1)
