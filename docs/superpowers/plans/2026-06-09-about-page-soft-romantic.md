# About Page Soft Romantic Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the About page (`src/app/about/page.tsx`) with the Soft Romantic aesthetic — warm blush gradients, new ornaments, italic typography, glass-effect cards, terracotta accent color, and lively entrance animations.

**Architecture:** Single-file rewrite of `about/page.tsx` that replaces ornaments, backgrounds, typography, and motion while preserving all data and `next/image` usage. Adds one CSS keyframe (`animate-float`) to `globals.css`. No new dependencies. The existing `useReveal` hook is enhanced with stagger support. `LogoMarquee` gets gentler hover styling.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4 (@theme in globals.css), shadcn/ui (Card, Accordion), next/image, IntersectionObserver API

**Spec:** `docs/superpowers/specs/2026-06-09-about-page-soft-romantic-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/app/globals.css` | Modify | Add `@keyframes float` and `animate-float` theme token |
| `src/app/about/page.tsx` | Rewrite | Full Soft Romantic redesign |

---

### Task 1: Add float animation to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add the `animate-float` theme token and keyframes**

Add to the `@theme inline` block (after the marquee animations):
```css
  --animate-float: float 6s ease-in-out infinite;
```

Add after the marquee keyframes (before `@layer base`):
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
```

- [ ] **Step 2: Verify globals.css is valid**

Run: `npx tailwindcss --help` (or just check syntax via dev server startup in next task)

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add float animation keyframe for soft romantic hero"
```

---

### Task 2: Replace ornament components and enhance RevealSection

**Files:**
- Modify: `src/app/about/page.tsx` (lines 111-129 and 99-109)

- [ ] **Step 1: Replace the `SparklesIcon` and `SectionOrnament` functions**

Replace the entire "Ornaments" comment block (lines 111-129) with new ornament components:

```tsx
/* ──────────────── Ornaments ──────────────── */

/** Nested concentric circles monogram badge — used on hero and connect section */
function MonogramBadge() {
  return (
    <div className="inline-block border border-brand-gold/25 rounded-full p-[5px]">
      <div className="w-[50px] h-[50px] border border-brand-gold/15 rounded-full flex items-center justify-center">
        <span className="font-serif text-xl text-brand-gold italic">S</span>
      </div>
    </div>
  );
}

/** Crossed laurel wreath divider */
function WreathDivider() {
  return (
    <div className="flex items-center justify-center gap-8 mb-6">
      <div className="h-px w-10 bg-gradient-to-r from-transparent to-brand-gold/40" />
      <svg width="18" height="18" viewBox="0 0 32 32" fill="none" stroke="currentColor" className="text-brand-gold/50" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4c-4 3-5 8-3 12-2-4-0-9 3-12Z" />
        <path d="M16 4c4 3 5 8 3 12 2-4 0-9-3-12Z" />
        <path d="M8 11c4 2 9 0 12-3" />
        <path d="M24 11c-4 2-9 0-12-3" />
      </svg>
      <div className="h-px w-10 bg-gradient-to-l from-transparent to-brand-gold/40" />
    </div>
  );
}

/** Circle-within-circle ornament */
function ConcentricRings() {
  return (
    <div className="flex items-center justify-center gap-8 mb-6">
      <div className="h-px w-8 bg-gradient-to-r from-transparent to-brand-gold/30" />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-brand-gold/50" strokeWidth="1">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" strokeWidth="0.8" />
      </svg>
      <div className="h-px w-8 bg-gradient-to-l from-transparent to-brand-gold/30" />
    </div>
  );
}

/** Stepped lines + dot ornament */
function SteppedLinesDot() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="h-px w-7 bg-gradient-to-r from-transparent to-brand-gold/30" />
      <div className="h-px w-3 bg-brand-gold/40" />
      <div className="w-1 h-1 rounded-full bg-brand-gold/40" />
      <div className="h-px w-3 bg-brand-gold/40" />
      <div className="h-px w-7 bg-gradient-to-l from-transparent to-brand-gold/30" />
    </div>
  );
}

/** Simple line + dot divider */
function SimpleLineDotDivider() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="h-px w-6 bg-gradient-to-r from-transparent to-brand-gold/30" />
      <div className="w-1 h-1 rounded-full bg-brand-gold/30" />
      <div className="h-px w-6 bg-gradient-to-l from-transparent to-brand-gold/30" />
    </div>
  );
}

/** Community/people icon for Clients & Partners */
function PeopleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/** Gradient divider for light backgrounds (timeline, closing ornaments) */
function GradientDivider() {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      <div className="h-px w-8 bg-gradient-to-r from-transparent to-brand-gold/30" />
      <div className="w-1 h-1 rounded-full bg-brand-gold/30" />
      <div className="h-px w-8 bg-gradient-to-l from-transparent to-brand-gold/30" />
    </div>
  );
}
```

- [ ] **Step 2: Enhance `RevealSection` with stagger delay support**

Replace the `RevealSection` function (lines 99-109) with:

```tsx
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`motion-safe:transition-all motion-safe:duration-1200 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? "opacity-100 translate-y-0" : "opacity-0 motion-safe:translate-y-12"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Verify the file still compiles**

Run: `npx tsc --noEmit src/app/about/page.tsx`

Expected: No type errors (the file references new components that exist within the same file, so it should compile).

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "refactor: replace ornaments and enhance RevealSection with stagger support"
```

---

### Task 3: Rewrite Section 1 — Hero

**Files:**
- Modify: `src/app/about/page.tsx` (lines 138-172)

- [ ] **Step 1: Replace the Hero section**

Replace the entire Hero section (from `{/* ─── 1. Hero ─── */}` through the closing `</section>`) with:

```tsx
      {/* ─── 1. Hero ─────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden" style={{ background: "linear-gradient(180deg, #fef9f2 0%, #fdf0e4 35%, #fbe5d3 70%, #faebd7 100%)" }}>
        {/* Floating circles */}
        <div className="absolute top-[12%] right-[15%] w-20 h-20 border border-brand-gold/15 rounded-full animate-float" />
        <div className="absolute bottom-[25%] left-[10%] w-12 h-12 border border-brand-gold/10 rounded-full animate-float [animation-delay:2s]" />
        <div className="absolute top-[40%] right-[8%] w-8 h-8 border border-brand-gold/10 rounded-full animate-float [animation-delay:1s]" />

        {/* Dot pattern — radial masked */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(211,162,127,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 60% 40% at 50% 50%, black 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 60% 40% at 50% 50%, black 0%, transparent 100%)",
          }}
        />

        {/* Warm center glow */}
        <div
          className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[400px] h-[300px]"
          style={{ background: "radial-gradient(ellipse, rgba(211,162,127,0.1) 0%, transparent 70%)" }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="mb-6">
            <MonogramBadge />
          </div>
          <SimpleLineDotDivider />
          <h1 className="font-serif text-5xl sm:text-7xl md:text-[72px] text-brand-taupe italic tracking-[-0.01em] mb-4 leading-[1.1]">
            About SOLA
          </h1>
          <p className="text-brand-gold/80 text-base md:text-lg font-light italic tracking-wide">
            where celebrations bloom
          </p>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.2em] uppercase text-brand-gold/50">Discover our story</span>
            <div className="w-px h-8 bg-gradient-to-b from-brand-gold/40 to-transparent" />
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Run the dev server to verify visual output**

Run: `npx next dev` and open the about page in the browser.
Expected: Hero shows blush gradient background with floating circles, monogram badge, italic heading, and scroll indicator. No photo.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: soft romantic hero with blush gradient and floating ornaments"
```

---

### Task 4: Rewrite Section 2 — Who We Are

**Files:**
- Modify: `src/app/about/page.tsx` (the "Who We Are" section)

- [ ] **Step 1: Replace the "Who We Are" section**

Replace the entire section 2 (from `{/* ─── 2. Who We Are ─── */}` through its closing `</section>`) with:

```tsx
      {/* ─── 2. Who We Are ──────────────────── */}
      <section className="py-32 md:py-40 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #fdf0e4 0%, #fef9f2 100%)" }}>
        <div
          className="absolute top-0 right-0 w-80 h-80 opacity-[0.04]"
          style={{ background: "radial-gradient(circle, rgb(211 162 127) 0%, transparent 70%)" }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-7xl mx-auto">
              {/* Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm group">
                  <Image
                    src="/asset/about_us/StockSnap_NABNCHL6PX.jpg"
                    alt="Elegant wedding champagne toast celebration"
                    fill
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-taupe/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                {/* Corner ornament — softer */}
                <div className="absolute -bottom-6 -right-6 w-20 h-20 border-r border-b border-brand-gold/20 hidden lg:block" />
              </div>

              {/* Text */}
              <div className="lg:col-span-7 lg:pl-8">
                {/* SOLA logo — moved to text side */}
                <div className="mb-4">
                  <span className="font-serif text-3xl text-brand-gold italic tracking-wider">SOLA</span>
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-brand-gold/40" />
                  <span className="text-[11px] tracking-[0.2em] uppercase text-brand-gold/60 font-medium">
                    Who We Are
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-taupe leading-[1.15] mb-8">
                  Event Planner <span className="text-brand-gold italic text-[1.3em]">&amp;</span> Organizer
                </h2>
                <div className="space-y-5 max-w-xl">
                  <p className="text-brand-taupe/65 leading-relaxed text-lg font-light">
                    Turn your event dreams into reality with SOLA. We&rsquo;re a passionate event planning
                    and orchestration team, dedicated to crafting unforgettable experiences tailored just for you.
                  </p>
                  <p className="text-brand-taupe/65 leading-relaxed font-light">
                    From pinpointing the perfect venue to seamlessly coordinating with vendors, we work
                    hand-in-hand to understand your preferences, budget, and the unique vibe you desire.
                  </p>
                </div>
                {/* Closing flourish */}
                <div className="flex items-center gap-2 mt-8">
                  <div className="h-px w-6 bg-gradient-to-r from-transparent to-brand-gold/30" />
                  <div className="w-1 h-1 rounded-full bg-brand-gold/30" />
                  <div className="h-px w-6 bg-gradient-to-l from-transparent to-brand-gold/30" />
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: soft romantic Who We Are section with blush gradient and image hover"
```

---

### Task 5: Rewrite Section 3 — Our Story (Timeline)

**Files:**
- Modify: `src/app/about/page.tsx` (the "Our Story" section)

- [ ] **Step 1: Replace the "Our Story" section**

Replace the entire section 3 (from `{/* ─── 3. Our Story ─── */}` through its closing `</section>`) with:

```tsx
      {/* ─── 3. Our Story ────────────────────── */}
      <section className="py-32 md:py-40 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #fef9f2 0%, #fef4ee 100%)" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(211,162,127,0.04) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <RevealSection>
            <div className="text-center mb-24">
              <WreathDivider />
              <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe mb-4">
                The Story Between Us
              </h2>
              <p className="text-brand-gold/70 text-lg font-light italic">
                How a passion became a purpose
              </p>
            </div>
          </RevealSection>

          <div className="relative">
            {/* Gradient center line */}
            <div
              className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px"
              style={{ background: "linear-gradient(180deg, transparent 0%, rgba(211,162,127,0.25) 10%, rgba(211,162,127,0.25) 90%, transparent 100%)" }}
            />
            <div className="space-y-24">
              {storySteps.map((step, i) => {
                const isLeft = i % 2 === 0;
                const isLast = i === storySteps.length - 1;
                return (
                  <RevealSection key={step.year} delay={i * 100}>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* Timeline dot — larger and solid on last item */}
                      <div className={`absolute left-[22px] md:left-1/2 md:-translate-x-1/2 top-2 rounded-full border-2 border-brand-gold bg-[#fef4ee] z-10 ${isLast ? "w-3.5 h-3.5 bg-brand-gold" : "w-2.5 h-2.5 bg-brand-gold/50"}`} />
                      {isLeft ? (
                        <>
                          <div className="md:text-right md:pr-14 pt-0">
                            <span className="font-serif text-5xl italic text-brand-gold/[0.15]">{step.year}</span>
                          </div>
                          <div className="md:pl-14">
                            <h3 className="font-serif text-2xl text-brand-taupe mb-3">{step.title}</h3>
                            <p className="text-brand-taupe/60 leading-relaxed font-light">{step.text}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="md:col-start-2 md:pl-14">
                            <span className="font-serif text-5xl italic text-brand-gold/[0.15]">{step.year}</span>
                          </div>
                          <div className="md:col-start-1 md:row-start-1 md:text-right md:pr-14">
                            <h3 className="font-serif text-2xl text-brand-taupe mb-3">{step.title}</h3>
                            <p className="text-brand-taupe/60 leading-relaxed font-light">{step.text}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </RevealSection>
                );
              })}
            </div>
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: soft romantic Our Story timeline with wreath ornament and gradient line"
```

---

### Task 6: Rewrite Section 4 — The Experience (Gallery)

**Files:**
- Modify: `src/app/about/page.tsx` (the "The Experience" section)

- [ ] **Step 1: Replace the "The Experience" section**

Replace the entire section 4 (from `{/* ─── 4. The Experience ─── */}` through its closing `</section>`) with:

```tsx
      {/* ─── 4. The Experience ──────────────── */}
      <section className="py-32 md:py-40 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #fef4ee 0%, #fdf0e4 100%)" }}>
        {/* Decorative rings */}
        <div className="absolute -top-16 -right-10 w-[200px] h-[200px] border border-brand-gold/[0.06] rounded-full" />
        <div className="absolute -bottom-10 -left-5 w-[140px] h-[140px] border border-brand-gold/[0.05] rounded-full" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(211,162,127,0.04) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <RevealSection>
            <div className="text-center mb-16">
              <ConcentricRings />
              <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe italic mb-4">
                The Experience
              </h2>
              <p className="text-brand-gold/60 text-lg font-light">
                See the moments we craft
              </p>
            </div>
          </RevealSection>

          {/* 2-column editorial grid */}
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {/* Left: large vertical image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm group">
                <Image
                  src="/asset/about_us/pexels-rebornfilmes-35114152.jpg"
                  alt="Beautifully decorated wedding reception hall"
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-taupe/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {/* Editor's tab */}
                <div className="absolute bottom-4 -left-2 bg-brand-gold text-white text-[10px] tracking-[0.2em] uppercase py-1 px-3 rounded-r-sm opacity-80">
                  01
                </div>
              </div>

              {/* Right: two stacked horizontals */}
              <div className="flex flex-col gap-2 md:gap-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm group">
                  <Image
                    src="/asset/about_us/pexels-esma-nur-buyukguclu-112544374-35241391.jpg"
                    alt="Wedding reception floral centerpiece"
                    fill
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-taupe/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm group">
                  <Image
                    src="/asset/about_us/StockSnap_NABNCHL6PX.jpg"
                    alt="Wedding celebration with champagne toast"
                    fill
                    className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-taupe/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </div>
            </div>

            {/* Integrated quote */}
            <div className="text-center mt-14">
              <span className="font-serif text-6xl text-brand-gold/[0.12] italic leading-none">&ldquo;</span>
              <p className="font-serif text-2xl md:text-3xl text-brand-taupe italic leading-snug -mt-3">
                Every detail matters.<br />Every moment counts.
              </p>
              <div className="flex items-center justify-center gap-2 mt-5">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-brand-gold/30" />
                <div className="w-1 h-1 rounded-full bg-brand-gold/40" />
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-brand-gold/30" />
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: soft romantic Experience gallery with 2-column layout and integrated quote"
```

---

### Task 7: Rewrite Section 5 — Why Choose SOLA

**Files:**
- Modify: `src/app/about/page.tsx` (the "Why Choose SOLA" section)

- [ ] **Step 1: Replace the section**

Replace the entire section 5 (from `{/* ─── 5. Why Choose SOLA ─── */}` through its closing `</section>`) with:

```tsx
      {/* ─── 5. Why Choose SOLA ─────────────── */}
      <section className="py-32 md:py-40 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #fdf0e4 0%, #fef9f2 60%, #fef4ee 100%)" }}>
        {/* Center glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px]"
          style={{ background: "radial-gradient(ellipse, rgba(211,162,127,0.05) 0%, transparent 70%)" }}
        />
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <RevealSection>
            <div className="text-center mb-20">
              <ConcentricRings />
              <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe italic mb-4">
                Why Choose SOLA
              </h2>
              <p className="text-brand-gold/60 text-lg font-light">
                What sets us apart from the rest
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { num: "01", title: "Personal Touch", desc: "Every client gets a dedicated planner who knows your style, preferences, and story inside out. You're never just a number." },
              { num: "02", title: "Vetted Vendors", desc: "We only work with thoroughly vetted professionals who share our obsession with quality and attention to detail." },
              { num: "03", title: "Transparent Pricing", desc: "No hidden fees, no surprises. You receive a detailed proposal upfront so you know exactly what you're paying for." },
              { num: "04", title: "Stress-Free Day", desc: "On-site coordination means you can relax and soak in every moment while we handle everything behind the scenes." },
            ].map((item, i) => (
              <RevealSection key={item.num} delay={i * 100}>
                <Card className="group h-full bg-white/70 backdrop-blur-sm border-brand-gold/10 hover:border-brand-gold/20 transition-all duration-500 relative overflow-hidden">
                  {/* Corner glow */}
                  <div
                    className="absolute top-0 right-0 w-16 h-16"
                    style={{ background: "radial-gradient(circle at 100% 0%, rgba(211,162,127,0.06) 0%, transparent 70%)" }}
                  />
                  <CardHeader className="relative z-10">
                    <span className="font-serif text-5xl italic text-brand-gold/[0.12]">
                      {item.num}
                    </span>
                    <CardTitle className="font-serif text-xl md:text-2xl text-brand-taupe mt-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-brand-taupe/55 leading-relaxed font-light text-sm md:text-base">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: soft romantic Why Choose SOLA with glass-effect cards and corner glows"
```

---

### Task 8: Rewrite Section 6 — Clients & Partners

**Files:**
- Modify: `src/app/about/page.tsx` (the "Clients & Partners" section)

- [ ] **Step 1: Update LogoMarquee hover behavior**

Replace the `LogoMarquee` function's Image className (line 54) with the new hover treatment:

```tsx
function LogoMarquee({ logos, direction }: { logos: string[]; direction: "left" | "right" }) {
  const anim = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  const copies = 3;
  return (
    <div className="overflow-hidden group">
      <div className={`flex shrink-0 gap-6 ${anim} group-hover:[animation-play-state:paused]`}>
        {Array.from({ length: copies }, (_, ci) =>
          logos.map((logo, i) => (
            <div key={`${ci}-${i}`} className="shrink-0 h-16 relative flex items-center">
              <Image
                src={logo}
                alt={`Logo ${i + 1}`}
                width={120}
                height={64}
                className="h-16 w-auto object-contain opacity-60 hover:opacity-100 hover:scale-110 transition-all duration-500"
                unoptimized
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Replace the "Clients & Partners" section**

Replace the entire section 6 (from `{/* ─── 6. Clients & Partners ─── */}` through its closing `</section>`) with:

```tsx
      {/* ─── 6. Clients & Partners ───────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #b87562 0%, #C4856E 30%, #C4856E 70%, #b07560 100%)" }}>
        {/* Decorative rings */}
        <div className="absolute -top-10 left-[10%] w-[120px] h-[120px] border border-white/[0.06] rounded-full" />
        <div className="absolute -bottom-8 right-[15%] w-[80px] h-[80px] border border-white/[0.05] rounded-full" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <RevealSection>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/15" />
                <PeopleIcon />
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/15" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-white italic mb-4">
                Who Trusts Us
              </h2>
              <p className="text-white/50 text-lg font-light italic max-w-xl mx-auto">
                The brands and partners who believe in the magic we create
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-0">
              <div className="overflow-hidden">
                <h3 className="font-serif text-lg md:text-xl text-white/70 italic text-center mb-8">
                  Our Beloved Clients
                </h3>
                <div className="[mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
                  <LogoMarquee logos={clientLogos} direction="left" />
                </div>
              </div>
              <div className="hidden md:block w-px mx-8 self-stretch" style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent)" }} />
              <div className="overflow-hidden">
                <h3 className="font-serif text-lg md:text-xl text-white/70 italic text-center mb-8">
                  Our Trusted Partners
                </h3>
                <div className="[mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
                  <LogoMarquee logos={partnerLogos} direction="right" />
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
```

- [ ] **Step 3: Verify build compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: soft romantic Clients & Partners with terracotta background and warmer logo hover"
```

---

### Task 9: Rewrite Section 7 — FAQ

**Files:**
- Modify: `src/app/about/page.tsx` (the "FAQ" section)

- [ ] **Step 1: Replace the "FAQ" section**

Replace the entire section 7 (from `{/* ─── 7. FAQ ─── */}` through its closing `</section>`) with:

```tsx
      {/* ─── 7. FAQ ─────────────────────────── */}
      <section className="py-32 md:py-40 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #b07560 0%, #C4856E 20%, #C4856E 100%)" }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        <div className="container mx-auto px-6 max-w-2xl relative z-10">
          <RevealSection>
            <div className="text-center mb-16">
              <SimpleLineDotDivider />
              <h2 className="font-serif text-4xl md:text-5xl text-white italic mb-4">
                Your Questions, Answered
              </h2>
              <p className="text-white/45 text-lg font-light italic">
                Everything you need to know
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <Card className="bg-white/95 backdrop-blur-md border-none shadow-lg shadow-black/5 rounded-lg">
              <CardContent className="p-6 md:p-8">
                <Accordion className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-[#C4856E]/10">
                      <AccordionTrigger className="font-sans text-base md:text-lg text-brand-taupe font-medium hover:text-brand-gold transition-colors duration-300 hover:no-underline py-5 px-2 rounded-md bg-transparent">
                        <span className="font-serif text-xl italic text-brand-gold/35 w-8 shrink-0 mr-3 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-left">{faq.q}</span>
                        <span className="ml-auto text-brand-gold/40 text-xl font-light">+</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-12 pr-4 pb-5">
                          <p className="text-brand-taupe/65 leading-relaxed text-sm md:text-base">
                            {faq.a}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </RevealSection>
        </div>
      </section>
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: soft romantic FAQ with terracotta background, frosted card, and italic numbers"
```

---

### Task 10: Rewrite Section 8 — Connect With Us

**Files:**
- Modify: `src/app/about/page.tsx` (the "Connect With Us" section)

- [ ] **Step 1: Replace the "Connect With Us" section**

Replace the entire section 8 (from `{/* ─── 8. Connect With Us ─── */}` through its closing `</section>`) with:

```tsx
      {/* ─── 8. Connect With Us ──────────────── */}
      <section className="py-32 md:py-40 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #C4856E 0%, #a06a56 30%, #fef4ee 50%, #fef9f2 100%)" }}>
        {/* Decorative rings */}
        <div className="absolute top-[20%] right-[15%] w-[180px] h-[180px] border border-white/[0.06] rounded-full" />
        <div className="absolute bottom-[30%] left-[10%] w-[100px] h-[100px] border border-brand-gold/[0.08] rounded-full" />
        <div className="container mx-auto px-6 max-w-lg relative z-10">
          <RevealSection>
            <div className="text-center mb-14">
              <div className="mb-6">
                <MonogramBadge />
              </div>
              <SteppedLinesDot />
              <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe italic mb-4">
                Connect With Us
              </h2>
              <p className="text-brand-gold/60 text-lg font-light italic max-w-md mx-auto">
                Stay inspired — follow our journey and see the magic we create every day
              </p>
            </div>
          </RevealSection>

          <RevealSection delay={200}>
            {/* Social icons — circle frames */}
            <div className="flex justify-center gap-5 mb-8">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-11 h-11 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold/40 hover:text-brand-gold hover:border-brand-gold/40 hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-11 h-11 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold/40 hover:text-brand-gold hover:border-brand-gold/40 hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
              <Link href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="w-11 h-11 rounded-full border border-brand-gold/20 flex items-center justify-center text-brand-gold/40 hover:text-brand-gold hover:border-brand-gold/40 hover:scale-110 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
                </svg>
              </Link>
            </div>

            {/* Closing ornament */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-6 bg-gradient-to-r from-transparent to-brand-gold/15" />
              <div className="w-1 h-1 rounded-full bg-brand-gold/20" />
              <div className="h-px w-6 bg-gradient-to-l from-transparent to-brand-gold/15" />
            </div>

            <p className="text-brand-gold/40 text-sm font-light italic text-center">
              Let&rsquo;s create something beautiful together
            </p>
          </RevealSection>
        </div>
      </section>
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: soft romantic Connect With Us with gradient bridge and circle social icons"
```

---

### Task 11: Final verification and cleanup

**Files:**
- Modify: `src/app/about/page.tsx` (main element)

- [ ] **Step 1: Remove `bg-brand-cream` from the `<main>` tag**

The `<main>` element at line 137 should not have `bg-brand-cream` since each section now has its own gradient background:

```tsx
  return (
    <main>
```

(Change `<main className="bg-brand-cream">` to `<main>`)

- [ ] **Step 2: Full type check**

Run: `npx tsc --noEmit`

Expected: No errors anywhere in the project.

- [ ] **Step 3: Build check**

Run: `npx next build`

Expected: Successful build with no warnings about the about page.

- [ ] **Step 4: Visual check**

Run: `npx next dev` and verify:
1. Hero shows blush gradient with floating circles and monogram badge
2. All sections have warm gradient backgrounds (no flat sand)
3. Terracotta replaces teal on sections 6 and 7
4. All images have hover zoom + warm overlay
5. Ornaments are the new set (wreath, concentric rings, people icon, stepped lines)
6. Scroll reveals work with stagger delays
7. Timeline has gradient line and italic years
8. FAQ numbers are italic and use `+` expander
9. Connect section has gradient bridge from dark to light

- [ ] **Step 5: Commit completion**

```bash
git add src/app/about/page.tsx
git commit -m "feat: finalize soft romantic about page redesign"
```

---

### Dependency Order

```
Task 1 (CSS keyframes)
  └── Task 2 (ornaments + RevealSection) ─── all subsequent tasks depend on this
        ├── Task 3 (Hero) ─── uses MonogramBadge, SimpleLineDotDivider, animate-float
        ├── Task 4 (Who We Are)
        ├── Task 5 (Our Story) ─── uses WreathDivider, RevealSection delay
        ├── Task 6 (Experience) ─── uses ConcentricRings, RevealSection
        ├── Task 7 (Why Choose SOLA) ─── uses ConcentricRings, RevealSection delay
        ├── Task 8 (Clients & Partners) ─── uses PeopleIcon, updated LogoMarquee
        ├── Task 9 (FAQ) ─── uses SimpleLineDotDivider, RevealSection
        ├── Task 10 (Connect) ─── uses MonogramBadge, SteppedLinesDot
        └── Task 11 (cleanup + verify)
```
