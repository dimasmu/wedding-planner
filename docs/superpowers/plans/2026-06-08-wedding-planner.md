# Wedding Planner Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-featured wedding planner platform (Sola-Inspired) with landing page, vendor marketplace, client dashboard, and vendor dashboard.

**Architecture:** Next.js 16 App Router with Tailwind CSS v4 (CSS-first @theme), shadcn/ui components, Motion for animations, Zustand v5 for state, recharts for charts, React Hook Form + Zod for forms. Brand colors defined as CSS custom properties in globals.css.

**Tech Stack:** Next.js 16.1, React 19.2, Tailwind CSS v4, shadcn/ui (latest), Motion 12.x, Zustand 5.x, recharts 3.8.x, React Hook Form + Zod, Playfair Display + Inter fonts

**Project root:** `D:/FE/wedding landing page`

**IMPORTANT:** All npm installs use `--registry https://registry.npmmirror.com` due to corporate network restrictions.

---

## Phase 1: Project Setup & Foundation

### Task 1: Install core dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install shadcn/ui CLI and init**

```bash
cd "D:/FE/wedding landing page" && npx shadcn@latest init --defaults --force --registry https://registry.npmmirror.com 2>&1
```
Expected: Creates `components.json` and `src/lib/utils.ts`

- [ ] **Step 2: Install shadcn/ui components**

```bash
cd "D:/FE/wedding landing page" && npx shadcn@latest add button card dialog sheet separator input label form toast checkbox progress badge tabs select avatar table dropdown-menu navigation-menu --overwrite --yes --registry https://registry.npmmirror.com 2>&1
```
Expected: Components created in `src/components/ui/`

- [ ] **Step 3: Install additional dependencies**

```bash
cd "D:/FE/wedding landing page" && npm install --registry https://registry.npmmirror.com motion zustand recharts react-hook-form @hookform/resolvers zod lucide-react next-themes 2>&1 | tail -5
```
Expected: All packages added successfully

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git init && git add -A && git commit -m "chore: install shadcn/ui, motion, zustand, recharts, and form dependencies"
```

---

### Task 2: Configure brand theme (Tailwind v4 CSS-first) and fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace globals.css with brand theme**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme inline {
  --color-brand-cream: #FDFBF7;
  --color-brand-taupe: #4A3E3D;
  --color-brand-gold: #D3A27F;
  --color-brand-sand: #F5EFEB;
  --color-brand-dark: #1E1E1E;

  --color-primary: var(--color-brand-gold);
  --color-primary-foreground: #FFFFFF;
  --color-secondary: #4A3E3D;
  --color-secondary-foreground: #FDFBF7;
  --color-muted: #F5EFEB;
  --color-muted-foreground: #706E6B;
  --color-accent: #D3A27F;
  --color-accent-foreground: #4A3E3D;
  --color-destructive: #EF4444;
  --color-destructive-foreground: #FFFFFF;
  --color-border: #F5EFEB;
  --color-input: #F5EFEB;
  --color-ring: #D3A27F;
  --color-background: #FDFBF7;
  --color-foreground: #4A3E3D;
  --color-card: #FFFFFF;
  --color-card-foreground: #4A3E3D;

  --font-serif: var(--font-playfair), serif;
  --font-sans: var(--font-inter), sans-serif;

  --radius: 0.625rem;
}

@layer base {
  * {
    border-color: var(--color-border);
  }
  body {
    background-color: var(--color-brand-cream);
    color: var(--color-brand-taupe);
    font-family: var(--font-sans);
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

- [ ] **Step 2: Update RootLayout with Playfair Display + Inter fonts**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sola Planner — Your Dream Wedding, Effortlessly Planned",
  description: "Plan your perfect wedding with trusted vendors, smart budgeting tools, and a guided checklist — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Delete unused default files**

```bash
rm -f "D:/FE/wedding landing page/sola-wedding/src/app/page.tsx" "D:/FE/wedding landing page/sola-wedding/src/app/favicon.ico" 2>/dev/null; echo "done"
```

- [ ] **Step 4: Verify build works**

```bash
cd "D:/FE/wedding landing page" && npm run build 2>&1 | tail -10
```
Expected: Build succeeds without errors

- [ ] **Step 5: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: configure brand theme with Tailwind v4 and Playfair/Inter fonts"
```

---

## Phase 2: Layout Components

### Task 3: Build Navbar component

**Files:**
- Create: `src/components/ui-custom/Navbar.tsx`
- Modify: `src/app/layout.tsx` (wrap children with Navbar + Footer placeholder)

- [ ] **Step 1: Create Navbar component**

Create `src/components/ui-custom/Navbar.tsx`:

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-sand bg-brand-cream/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-brand-gold fill-brand-gold" />
          <span className="font-serif text-xl font-bold tracking-wider text-brand-taupe">
            SOLA PLANNER
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/vendors" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Find Vendors
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/inspiration" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Inspiration
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-brand-taupe hover:text-brand-gold">
              Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300">
              Start Planning →
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-2 text-brand-taupe" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-cream w-[300px]">
              <nav className="flex flex-col gap-6 mt-10">
                <Link href="/vendors" className="font-serif text-lg text-brand-taupe">
                  Find Vendors
                </Link>
                <Link href="/inspiration" className="font-serif text-lg text-brand-taupe">
                  Inspiration
                </Link>
                <Link href="/pricing" className="font-serif text-lg text-brand-taupe">
                  Pricing
                </Link>
                <hr className="border-brand-sand" />
                <Link href="/login" className="font-serif text-lg text-brand-taupe">
                  Login
                </Link>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full bg-brand-gold text-white">Start Planning</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Update RootLayout to include Navbar**

Modify `src/app/layout.tsx` — replace the body content:

```tsx
import { Navbar } from "@/components/ui-custom/Navbar";

// Inside the <body>, replace {children} with:
<body className={`${playfair.variable} ${inter.variable} antialiased`}>
  <Navbar />
  <main className="min-h-screen">{children}</main>
</body>
```

- [ ] **Step 3: Verify build**

```bash
cd "D:/FE/wedding landing page" && npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add responsive Navbar with mobile drawer"
```

---

### Task 4: Build Footer component

**Files:**
- Create: `src/components/ui-custom/Footer.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create Footer component**

Create `src/components/ui-custom/Footer.tsx`:

```tsx
import Link from "next/link";
import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Heart className="h-5 w-5 text-brand-gold fill-brand-gold" />
              <span className="font-serif text-lg font-bold tracking-wider">
                SOLA PLANNER
              </span>
            </Link>
            <p className="text-brand-cream/60 text-sm leading-relaxed">
              Your dream wedding, effortlessly planned. Trusted by couples across the world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/vendors" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Find Vendors
              </Link>
              <Link href="/inspiration" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Inspiration
              </Link>
              <Link href="/pricing" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Pricing
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider">
              Account
            </h4>
            <nav className="flex flex-col gap-2">
              <Link href="/login" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Register
              </Link>
              <Link href="/dashboard" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-brand-gold mb-4 uppercase tracking-wider">
              Stay Inspired
            </h4>
            <p className="text-sm text-brand-cream/60 mb-3">
              Get wedding planning tips and vendor deals.
            </p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <Input
                type="email"
                placeholder="Your email"
                className="bg-brand-cream/10 border-brand-cream/20 text-brand-cream placeholder:text-brand-cream/40 text-sm h-9"
              />
              <Button
                type="submit"
                className="bg-brand-gold text-white hover:bg-brand-gold/80 text-sm h-9 px-4 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-brand-cream/10 mt-12 pt-8 text-center text-sm text-brand-cream/40">
          &copy; {new Date().getFullYear()} Sola Planner. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Update RootLayout to include Footer**

Modify `src/app/layout.tsx` — add Footer import and render:

```tsx
import { Footer } from "@/components/ui-custom/Footer";

// In body, after </main>, before </body>:
</main>
<Footer />
```

- [ ] **Step 3: Verify build**

```bash
cd "D:/FE/wedding landing page" && npm run build 2>&1 | tail -10
```

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Footer with newsletter signup"
```

---

## Phase 3: Landing Page

### Task 5: Build HeroSection with Motion slideshow

**Files:**
- Create: `src/components/sections/HeroSection.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create placeholder hero images**

```bash
mkdir -p "D:/FE/wedding landing page/sola-wedding/public/images"
```
Note: The HeroSection uses gradient overlays and placeholder divs — no actual images needed. The slideshow renders 3 slides with CSS gradient backgrounds.

- [ ] **Step 2: Create HeroSection**

Create `src/components/sections/HeroSection.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Your Dream Wedding, Effortlessly Planned",
    subtitle: "Connect with the finest vendors, manage your budget, and track every detail — all in one beautiful place.",
    cta: "Start Planning",
    href: "/register",
    gradient: "from-brand-taupe/80 via-brand-taupe/40 to-transparent",
    bg: "bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20",
  },
  {
    id: 2,
    title: "Handpicked Vendors You Can Trust",
    subtitle: "Browse curated wedding professionals with verified reviews and transparent pricing.",
    cta: "Explore Vendors",
    href: "/vendors",
    gradient: "from-brand-taupe/80 via-brand-taupe/40 to-transparent",
    bg: "bg-gradient-to-br from-brand-cream via-brand-sand to-brand-gold/30",
  },
  {
    id: 3,
    title: "Every Detail, Perfectly Tracked",
    subtitle: "From guest lists to vendor bookings — our smart dashboard keeps everything organized.",
    cta: "View Dashboard",
    href: "/dashboard",
    gradient: "from-brand-taupe/80 via-brand-taupe/40 to-transparent",
    bg: "bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={`absolute inset-0 ${slides[current].bg}`}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-taupe/30 via-transparent to-brand-taupe/20" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-brand-taupe leading-tight mb-6">
              {slides[current].title}
            </h1>
            <p className="text-lg md:text-xl text-brand-taupe/70 leading-relaxed mb-10 max-w-xl">
              {slides[current].subtitle}
            </p>
            <Link href={slides[current].href}>
              <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 text-lg px-8 py-6 rounded-md">
                {slides[current].cta} →
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === current ? "bg-brand-gold w-8" : "bg-brand-taupe/30 hover:bg-brand-taupe/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create Landing Page**

Create `src/app/page.tsx`:

```tsx
import { HeroSection } from "@/components/sections/HeroSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      {/* Additional sections added in subsequent tasks */}
    </>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
cd "D:/FE/wedding landing page" && npm run build 2>&1 | tail -10
```

- [ ] **Step 5: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add HeroSection with Motion slideshow"
```

---

### Task 6: Build HowItWorks section

**Files:**
- Create: `src/components/sections/HowItWorks.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create HowItWorks**

Create `src/components/sections/HowItWorks.tsx`:

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { Search, Heart, ClipboardCheck } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Vendor",
    description: "Browse our curated marketplace of trusted wedding professionals. Filter by category, location, and budget.",
    step: "01",
  },
  {
    icon: Heart,
    title: "Book With Confidence",
    description: "Request quotes, compare packages, and book vendors directly. Transparent pricing, no hidden fees.",
    step: "02",
  },
  {
    icon: ClipboardCheck,
    title: "Plan Seamlessly",
    description: "Track your checklist, manage your guest list, and monitor your budget — all from your dashboard.",
    step: "03",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            How It Works
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Three simple steps from dreaming to saying &ldquo;I do.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map(({ icon: Icon, title, description, step }) => (
            <Card
              key={step}
              className="bg-white border-brand-sand shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <CardContent className="p-8 text-center">
                <span className="font-serif text-5xl text-brand-gold/20 font-bold block mb-6 group-hover:text-brand-gold/30 transition-colors">
                  {step}
                </span>
                <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-serif text-xl text-brand-taupe mb-3">{title}</h3>
                <p className="text-brand-taupe/60 text-sm leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add HowItWorks to Landing Page**

Modify `src/app/page.tsx`:

```tsx
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorks } from "@/components/sections/HowItWorks";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
    </>
  );
}
```

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add HowItWorks section"
```

---

### Task 7: Build VendorCarousel section

**Files:**
- Create: `src/components/sections/VendorCarousel.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create VendorCarousel**

Create `src/components/sections/VendorCarousel.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion } from "motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Camera, Music, UtensilsCrossed, Flower2 } from "lucide-react";
import Link from "next/link";

const categories = [
  { icon: Camera, label: "Photography", count: 124, color: "bg-amber-50 text-amber-600" },
  { icon: Music, label: "Music & DJ", count: 89, color: "bg-rose-50 text-rose-600" },
  { icon: UtensilsCrossed, label: "Catering", count: 156, color: "bg-emerald-50 text-emerald-600" },
  { icon: Flower2, label: "Decoration", count: 98, color: "bg-purple-50 text-purple-600" },
  { icon: Camera, label: "Videography", count: 67, color: "bg-blue-50 text-blue-600" },
  { icon: Flower2, label: "Venue", count: 112, color: "bg-orange-50 text-orange-600" },
];

export function VendorCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-brand-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            Browse Vendor Categories
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Everything you need for your perfect day, curated and ready to book.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white border-brand-sand shadow-md hidden md:flex"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-brand-taupe" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map(({ icon: Icon, label, count, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -6 }}
                className="snap-start shrink-0 w-[220px]"
              >
                <Link href={`/vendors?category=${label.toLowerCase()}`}>
                  <Card className="bg-white border-brand-sand hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <h3 className="font-serif text-lg text-brand-taupe mb-1">{label}</h3>
                      <p className="text-sm text-brand-taupe/50">{count} vendors</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white border-brand-sand shadow-md hidden md:flex"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-brand-taupe" />
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add VendorCarousel to landing page**

Modify `src/app/page.tsx` — add import and render after HowItWorks.

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add VendorCarousel with category cards"
```

---

### Task 8: Build TestimonialCarousel section

**Files:**
- Create: `src/components/sections/TestimonialCarousel.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create TestimonialCarousel**

Create `src/components/sections/TestimonialCarousel.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Sola Planner made our wedding planning completely stress-free. We found an incredible photographer and the budget tracker kept us on track.",
    name: "Sarah & James",
    role: "Married June 2025",
    rating: 5,
  },
  {
    quote: "The vendor marketplace is a game-changer. We compared quotes from multiple caterers and saved over $2,000 on our reception.",
    name: "Maya & David",
    role: "Married March 2026",
    rating: 5,
  },
  {
    quote: "As someone who had no idea where to start, the checklist feature was a lifesaver. Every deadline, every detail — perfectly organized.",
    name: "Priya & Alex",
    role: "Married September 2025",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            Loved by Couples
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Real stories from real weddings planned with Sola.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-brand-sand rounded-xl p-10 md:p-12 shadow-sm text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <blockquote className="font-serif text-xl md:text-2xl text-brand-taupe leading-relaxed mb-6 italic">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>
              <p className="font-semibold text-brand-taupe">{testimonials[current].name}</p>
              <p className="text-sm text-brand-taupe/50">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-brand-gold w-6" : "bg-brand-taupe/20 hover:bg-brand-taupe/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add TestimonialCarousel to landing page**

Modify `src/app/page.tsx` — add import and render after VendorCarousel.

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add TestimonialCarousel"
```

---

### Task 9: Build PricingSection

**Files:**
- Create: `src/components/sections/PricingSection.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create PricingSection**

Create `src/components/sections/PricingSection.tsx`:

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Start planning your wedding at no cost.",
    features: [
      "Browse vendor marketplace",
      "Basic wedding checklist (10 tasks)",
      "Guest list tracker (up to 50 guests)",
      "Community support",
    ],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "$12",
    period: "/month",
    description: "Everything you need for a seamless planning experience.",
    features: [
      "Everything in Free",
      "Unlimited checklist tasks",
      "Budget tracker with charts",
      "Guest list (unlimited guests)",
      "RSVP management",
      "Priority vendor support",
    ],
    cta: "Start Premium",
    href: "/register?plan=premium",
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "Partner",
    price: "Custom",
    description: "For wedding planners and agencies managing multiple events.",
    features: [
      "Everything in Premium",
      "Multi-event management",
      "White-label client dashboard",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 bg-brand-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Choose the plan that fits your wedding planning needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative border-brand-sand shadow-sm ${
                tier.highlighted
                  ? "border-brand-gold ring-2 ring-brand-gold/20 shadow-lg scale-[1.02]"
                  : ""
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-white px-4">
                  {tier.badge}
                </Badge>
              )}
              <CardHeader className="text-center pb-0">
                <CardTitle className="font-serif text-xl text-brand-taupe">{tier.name}</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="font-serif text-4xl text-brand-taupe">{tier.price}</span>
                  {tier.period && (
                    <span className="text-brand-taupe/50 text-sm">{tier.period}</span>
                  )}
                </div>
                <CardDescription className="text-brand-taupe/60">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                      <span className="text-sm text-brand-taupe/70">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={tier.href}>
                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? "bg-brand-gold text-white hover:bg-brand-taupe"
                        : "bg-white border border-brand-gold text-brand-gold hover:bg-brand-gold/5"
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add PricingSection to landing page**

Modify `src/app/page.tsx` — add import and render after TestimonialCarousel.

Final `src/app/page.tsx`:

```tsx
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { VendorCarousel } from "@/components/sections/VendorCarousel";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";
import { PricingSection } from "@/components/sections/PricingSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <VendorCarousel />
      <TestimonialCarousel />
      <PricingSection />
    </>
  );
}
```

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add PricingSection — 3-tier pricing"
```

---

## Phase 4: Authentication

### Task 10: Build Login and Register pages

**Files:**
- Create: `src/app/login/page.tsx`
- Create: `src/app/register/page.tsx`

- [ ] **Step 1: Create Login page**

Create `src/app/login/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Welcome back!", description: "You've been logged in successfully." });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4">
      <Card className="w-full max-w-md border-brand-sand shadow-sm">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-brand-gold fill-brand-gold" />
            <span className="font-serif text-xl font-bold tracking-wider text-brand-taupe">
              SOLA PLANNER
            </span>
          </Link>
          <CardTitle className="font-serif text-2xl text-brand-taupe">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue planning your dream wedding.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-taupe">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="border-brand-sand"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand-taupe">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="border-brand-sand"
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-gold text-white hover:bg-brand-taupe transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-center text-sm text-brand-taupe/60 mt-6">
            Don&rsquo;t have an account?{" "}
            <Link href="/register" className="text-brand-gold hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Create Register page**

Create `src/app/register/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["couple", "vendor"]),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"couple" | "vendor">("couple");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "couple" },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast({ title: "Account created!", description: `Welcome to Sola Planner, ${data.name}!` });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-12">
      <Card className="w-full max-w-md border-brand-sand shadow-sm">
        <CardHeader className="text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-brand-gold fill-brand-gold" />
            <span className="font-serif text-xl font-bold tracking-wider text-brand-taupe">
              SOLA PLANNER
            </span>
          </Link>
          <CardTitle className="font-serif text-2xl text-brand-taupe">Create Your Account</CardTitle>
          <CardDescription>Start planning your dream wedding today.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={role}
            onValueChange={(v) => setRole(v as "couple" | "vendor")}
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2 bg-brand-sand">
              <TabsTrigger value="couple" className="data-[state=active]:bg-brand-gold data-[state=active]:text-white">
                I&rsquo;m a Couple
              </TabsTrigger>
              <TabsTrigger value="vendor" className="data-[state=active]:bg-brand-gold data-[state=active]:text-white">
                I&rsquo;m a Vendor
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("role")} value={role} />
            <div className="space-y-2">
              <Label htmlFor="name" className="text-brand-taupe">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                {...register("name")}
                className="border-brand-sand"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-brand-taupe">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                className="border-brand-sand"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-brand-taupe">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="border-brand-sand"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-brand-gold text-white hover:bg-brand-taupe transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-sm text-brand-taupe/60 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-gold hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Login and Register pages with Zod validation"
```

---

## Phase 5: Vendor Marketplace

### Task 11: Build VendorFilter and vendor types

**Files:**
- Create: `src/lib/types/vendor.ts`
- Create: `src/components/marketplace/VendorFilter.tsx`

- [ ] **Step 1: Create vendor types**

Create `src/lib/types/vendor.ts`:

```typescript
export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  image: string;
  description: string;
  tags: string[];
}

export interface VendorFilters {
  category: string | null;
  location: string | null;
  priceRange: [number, number] | null;
  rating: number | null;
  search: string;
}
```

- [ ] **Step 2: Create VendorFilter**

Create `src/components/marketplace/VendorFilter.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";
import { VendorFilters } from "@/lib/types/vendor";

interface VendorFilterProps {
  filters: VendorFilters;
  onFilterChange: (filters: VendorFilters) => void;
}

const CATEGORIES = ["Photography", "Videography", "Catering", "Decoration", "Venue", "Music & DJ"];
const LOCATIONS = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta", "Medan"];

export function VendorFilter({ filters, onFilterChange }: VendorFilterProps) {
  const hasActiveFilters =
    filters.category || filters.location || filters.rating || filters.search;

  const clearFilters = () => {
    onFilterChange({ category: null, location: null, priceRange: null, rating: null, search: "" });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-brand-taupe text-sm">Search</Label>
        <Input
          placeholder="Search vendors..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="mt-2 border-brand-sand"
        />
      </div>

      <Separator className="bg-brand-sand" />

      {/* Category */}
      <div>
        <Label className="text-brand-taupe text-sm font-semibold">Category</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={filters.category === cat ? "default" : "outline"}
              size="sm"
              className={
                filters.category === cat
                  ? "bg-brand-gold text-white text-xs"
                  : "border-brand-sand text-brand-taupe text-xs hover:border-brand-gold"
              }
              onClick={() =>
                onFilterChange({
                  ...filters,
                  category: filters.category === cat ? null : cat,
                })
              }
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-brand-sand" />

      {/* Location */}
      <div>
        <Label className="text-brand-taupe text-sm font-semibold">Location</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOCATIONS.map((loc) => (
            <Button
              key={loc}
              variant={filters.location === loc ? "default" : "outline"}
              size="sm"
              className={
                filters.location === loc
                  ? "bg-brand-gold text-white text-xs"
                  : "border-brand-sand text-brand-taupe text-xs hover:border-brand-gold"
              }
              onClick={() =>
                onFilterChange({
                  ...filters,
                  location: filters.location === loc ? null : loc,
                })
              }
            >
              {loc}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-brand-sand" />

      {/* Rating */}
      <div>
        <Label className="text-brand-taupe text-sm font-semibold">Minimum Rating</Label>
        <div className="mt-2 flex gap-2">
          {[4.5, 4, 3].map((r) => (
            <Button
              key={r}
              variant={filters.rating === r ? "default" : "outline"}
              size="sm"
              className={
                filters.rating === r
                  ? "bg-brand-gold text-white text-xs"
                  : "border-brand-sand text-brand-taupe text-xs hover:border-brand-gold"
              }
              onClick={() =>
                onFilterChange({
                  ...filters,
                  rating: filters.rating === r ? null : r,
                })
              }
            >
              {r}+ ★
            </Button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="text-brand-taupe/60 hover:text-red-500"
          onClick={clearFilters}
        >
          <X className="w-3 h-3 mr-1" /> Clear all filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: collapsible sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white border border-brand-sand rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-brand-taupe font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile: Sheet drawer */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-brand-sand text-brand-taupe gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-gold" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-brand-cream w-[300px]">
            <SheetHeader>
              <SheetTitle className="font-serif text-brand-taupe">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify build** — `npm run build` passes.

- [ ] **Step 3: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add VendorFilter with collapsible desktop / Sheet mobile"
```

---

### Task 12: Build VendorCard and VendorDetailDialog

**Files:**
- Create: `src/components/marketplace/VendorCard.tsx`
- Create: `src/components/marketplace/VendorDetailDialog.tsx`

- [ ] **Step 1: Create VendorCard**

Create `src/components/marketplace/VendorCard.tsx`:

```tsx
"use client";

import { motion } from "motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign } from "lucide-react";
import { Vendor } from "@/lib/types/vendor";

interface VendorCardProps {
  vendor: Vendor;
  onClick: (vendor: Vendor) => void;
}

export function VendorCard({ vendor, onClick }: VendorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className="bg-white border-brand-sand hover:shadow-lg cursor-pointer transition-shadow overflow-hidden"
        onClick={() => onClick(vendor)}
      >
        {/* Image placeholder */}
        <div className="h-48 bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
          <span className="font-serif text-5xl text-brand-gold/30">
            {vendor.name.charAt(0)}
          </span>
        </div>
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-serif text-lg text-brand-taupe font-semibold">
              {vendor.name}
            </h3>
            <Badge variant="outline" className="border-brand-gold text-brand-gold text-xs">
              {vendor.category}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-brand-taupe/60 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {vendor.location}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-brand-gold text-brand-gold" /> {vendor.rating} ({vendor.reviews})
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="w-3 h-3 text-brand-gold" />
            <span className="text-brand-taupe/70">From </span>
            <span className="font-semibold text-brand-taupe">
              ${vendor.priceFrom.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create VendorDetailDialog**

Create `src/components/marketplace/VendorDetailDialog.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion } from "motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, MapPin, DollarSign, Mail, Phone } from "lucide-react";
import { Vendor } from "@/lib/types/vendor";
import { useToast } from "@/hooks/use-toast";

interface VendorDetailDialogProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VendorDetailDialog({ vendor, open, onOpenChange }: VendorDetailDialogProps) {
  const { toast } = useToast();
  const [quoteMessage, setQuoteMessage] = useState("");

  if (!vendor) return null;

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Quote Request Sent!",
      description: `${vendor.name} will get back to you within 24 hours.`,
    });
    setQuoteMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="font-serif text-2xl text-brand-taupe">
                {vendor.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-brand-taupe/70">
                  <MapPin className="w-4 h-4" /> {vendor.location}
                </span>
                <span className="flex items-center gap-1 text-brand-gold">
                  <Star className="w-4 h-4 fill-brand-gold" /> {vendor.rating} ({vendor.reviews} reviews)
                </span>
              </DialogDescription>
            </div>
            <Badge className="bg-brand-gold text-white">{vendor.category}</Badge>
          </div>
        </DialogHeader>

        {/* Image */}
        <div className="h-56 bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 rounded-lg flex items-center justify-center">
          <span className="font-serif text-7xl text-brand-gold/20">{vendor.name.charAt(0)}</span>
        </div>

        {/* Description */}
        <p className="text-brand-taupe/70 leading-relaxed">{vendor.description}</p>

        {/* Pricing */}
        <div className="bg-brand-sand rounded-lg p-4 flex items-center justify-between">
          <span className="text-brand-taupe/70">Starting Price</span>
          <span className="font-serif text-2xl text-brand-taupe font-bold">
            ${vendor.priceFrom.toLocaleString()}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {vendor.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-brand-sand text-brand-taupe/60 text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Request Quote Form */}
        <form onSubmit={handleRequestQuote} className="space-y-4 border-t border-brand-sand pt-6">
          <h4 className="font-serif text-lg text-brand-taupe">Request a Quote</h4>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-brand-taupe">
              Describe your needs
            </Label>
            <Input
              id="message"
              placeholder="e.g., Wedding date, estimated guests, specific requirements..."
              value={quoteMessage}
              onChange={(e) => setQuoteMessage(e.target.value)}
              className="border-brand-sand"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-brand-gold text-white hover:bg-brand-taupe transition-all"
          >
            Send Quote Request
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add VendorCard and VendorDetailDialog with quote form"
```

---

### Task 13: Build Vendors page (grid with filters)

**Files:**
- Create: `src/lib/data/vendors.ts`
- Create: `src/app/vendors/page.tsx`

- [ ] **Step 1: Create vendor mock data**

Create `src/lib/data/vendors.ts`:

```typescript
import { Vendor } from "@/lib/types/vendor";

export const vendors: Vendor[] = [
  {
    id: "1", name: "Luminous Wedding Photography", category: "Photography",
    location: "Jakarta", rating: 4.9, reviews: 234, priceFrom: 2500,
    image: "", description: "Award-winning wedding photography capturing authentic moments with an editorial touch. 10+ years of experience with destination weddings.",
    tags: ["Photo", "Album", "Pre-wedding", "Drone"],
  },
  {
    id: "2", name: "Evergreen Catering Co.", category: "Catering",
    location: "Bandung", rating: 4.7, reviews: 189, priceFrom: 3200,
    image: "", description: "Farm-to-table wedding catering with customizable menus. Specializing in Indonesian and Western fusion cuisine.",
    tags: ["Food", "Buffet", "Plated", "Dessert"],
  },
  {
    id: "3", name: "Bloom & Petal Studio", category: "Decoration",
    location: "Bali", rating: 4.8, reviews: 156, priceFrom: 1800,
    image: "", description: "Luxury floral design and wedding styling. We transform venues into breathtaking experiences with sustainable, locally-sourced blooms.",
    tags: ["Flowers", "Styling", "Lighting", "Props"],
  },
  {
    id: "4", name: "Symphony Wedding Music", category: "Music & DJ",
    location: "Jakarta", rating: 4.6, reviews: 98, priceFrom: 1200,
    image: "", description: "From string quartets to DJ sets — we curate the perfect soundtrack for every moment of your celebration.",
    tags: ["Band", "DJ", "MC", "Sound System"],
  },
  {
    id: "5", name: "Cinematic Love Films", category: "Videography",
    location: "Surabaya", rating: 4.9, reviews: 112, priceFrom: 3000,
    image: "", description: "Cinematic wedding films that tell your love story. 4K, drone footage, and same-day edits available.",
    tags: ["Video", "Cinematic", "Drone", "Same-day"],
  },
  {
    id: "6", name: "The Grand Ballroom", category: "Venue",
    location: "Yogyakarta", rating: 4.5, reviews: 267, priceFrom: 5000,
    image: "", description: "Stunning heritage ballroom with capacity for 500 guests. Private garden, on-site catering, and bridal suite included.",
    tags: ["Indoor", "Outdoor", "Parking", "AC"],
  },
  {
    id: "7", name: "Golden Hour Photos", category: "Photography",
    location: "Bali", rating: 4.8, reviews: 145, priceFrom: 2200,
    image: "", description: "Bali-based wedding photographer specializing in golden hour and beach ceremonies. Natural, warm, and timeless.",
    tags: ["Photo", "Album", "Beach", "Film"],
  },
  {
    id: "8", name: "Spice Route Catering", category: "Catering",
    location: "Medan", rating: 4.4, reviews: 76, priceFrom: 2800,
    image: "", description: "Authentic Indonesian cuisine with modern presentation. Famous for our rendang and traditional dessert stations.",
    tags: ["Food", "Buffet", "Traditional", "Live Station"],
  },
];
```

- [ ] **Step 2: Create Vendors page**

Create `src/app/vendors/page.tsx`:

```tsx
"use client";

import { useState, useMemo } from "react";
import { VendorFilter } from "@/components/marketplace/VendorFilter";
import { VendorCard } from "@/components/marketplace/VendorCard";
import { VendorDetailDialog } from "@/components/marketplace/VendorDetailDialog";
import { vendors } from "@/lib/data/vendors";
import { Vendor, VendorFilters } from "@/lib/types/vendor";

export default function VendorsPage() {
  const [filters, setFilters] = useState<VendorFilters>({
    category: null, location: null, priceRange: null, rating: null, search: "",
  });
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (filters.search && !v.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category && v.category !== filters.category) return false;
      if (filters.location && v.location !== filters.location) return false;
      if (filters.rating && v.rating < filters.rating) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-3">
            Find Your Perfect Vendor
          </h1>
          <p className="text-brand-taupe/60 max-w-lg">
            Browse our curated collection of trusted wedding professionals.
          </p>
        </div>

        <div className="flex gap-8">
          <VendorFilter filters={filters} onFilterChange={setFilters} />

          <div className="flex-1">
            <p className="text-sm text-brand-taupe/50 mb-6">
              Showing {filteredVendors.length} of {vendors.length} vendors
            </p>

            {filteredVendors.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-brand-taupe/60 font-serif text-lg">
                  No vendors match your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onClick={(v) => {
                      setSelectedVendor(v);
                      setDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <VendorDetailDialog
        vendor={selectedVendor}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
```

- [ ] **Step 3: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Vendors page with filter grid and detail dialog"
```

---

## Phase 6: Client Dashboard

### Task 14: Build Sidebar navigation for dashboard

**Files:**
- Create: `src/components/ui-custom/Sidebar.tsx`
- Create: `src/app/dashboard/layout.tsx`

- [ ] **Step 1: Create Sidebar**

Create `src/components/ui-custom/Sidebar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardCheck,
  DollarSign,
  Users,
  Settings,
  Heart,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/dashboard/budget", label: "Budget", icon: DollarSign },
  { href: "/dashboard/guests", label: "Guest List", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all",
            pathname === href
              ? "bg-brand-gold/10 text-brand-gold font-medium"
              : "text-brand-taupe/70 hover:bg-brand-sand hover:text-brand-taupe"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-brand-sand bg-white min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Heart className="h-5 w-5 text-brand-gold fill-brand-gold" />
            <span className="font-serif text-lg font-bold tracking-wider text-brand-taupe">
              SOLA
            </span>
          </Link>
          <NavLinks />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-brand-sand px-4 py-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="text-brand-taupe gap-2">
              <Menu className="w-4 h-4" />
              {navItems.find((n) => n.href === pathname)?.label || "Menu"}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-white w-[260px]">
            <div className="mt-8">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create Dashboard Layout**

Create `src/app/dashboard/layout.tsx`:

```tsx
import { Sidebar } from "@/components/ui-custom/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 bg-brand-cream min-h-[calc(100vh-4rem)]">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Create Dashboard overview page**

Create `src/app/dashboard/page.tsx`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, DollarSign, Users, CalendarDays } from "lucide-react";

const stats = [
  { label: "Checklist Progress", value: "45%", icon: ClipboardCheck, color: "text-emerald-500" },
  { label: "Budget Spent", value: "62%", icon: DollarSign, color: "text-amber-500" },
  { label: "Guests Confirmed", value: "78/120", icon: Users, color: "text-blue-500" },
  { label: "Days to Wedding", value: "184", icon: CalendarDays, color: "text-rose-500" },
];

export default function DashboardOverview() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-white border-brand-sand shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-taupe/70">{label}</CardTitle>
              <Icon className={`w-4 h-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <span className="font-serif text-2xl font-bold text-brand-taupe">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify build** — `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Sidebar and Dashboard layout with overview stats"
```

---

### Task 15: Build Checklist store and ChecklistContainer

**Files:**
- Create: `src/lib/store/useChecklistStore.ts`
- Create: `src/components/dashboard/ChecklistContainer.tsx`
- Create: `src/app/dashboard/checklist/page.tsx`

- [ ] **Step 1: Create Zustand checklist store (v5 syntax)**

Create `src/lib/store/useChecklistStore.ts`:

```typescript
import { create } from "zustand";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  category: string;
}

interface ChecklistState {
  tasks: Task[];
  toggleTask: (id: string) => void;
  getCompletionPercentage: () => number;
}

export const useChecklistStore = create<ChecklistState>()((set, get) => ({
  tasks: [
    { id: "1", title: "Determine Your Maximum Wedding Budget", completed: true, dueDate: "12 months before", category: "Planning" },
    { id: "2", title: "Choose & Secure Your Venue", completed: false, dueDate: "10 months before", category: "Venue" },
    { id: "3", title: "Select Photography & Videography Vendors", completed: false, dueDate: "9 months before", category: "Vendors" },
    { id: "4", title: "Wedding Attire Fitting", completed: false, dueDate: "6 months before", category: "Attire" },
    { id: "5", title: "Send Save the Dates", completed: false, dueDate: "8 months before", category: "Guests" },
    { id: "6", title: "Book Catering & Finalize Menu", completed: false, dueDate: "7 months before", category: "Vendors" },
    { id: "7", title: "Hire Florist & Decorator", completed: false, dueDate: "6 months before", category: "Vendors" },
    { id: "8", title: "Finalize Guest List", completed: false, dueDate: "4 months before", category: "Guests" },
    { id: "9", title: "Book Hair & Makeup Artist", completed: false, dueDate: "4 months before", category: "Beauty" },
    { id: "10", title: "Send Final Invitations", completed: false, dueDate: "3 months before", category: "Guests" },
  ],
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),
  getCompletionPercentage: () => {
    const tasks = get().tasks;
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter((t) => t.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  },
}));
```

- [ ] **Step 2: Create ChecklistContainer**

Create `src/components/dashboard/ChecklistContainer.tsx`:

```tsx
"use client";

import { useChecklistStore } from "@/lib/store/useChecklistStore";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ChecklistContainer() {
  const { tasks, toggleTask, getCompletionPercentage } = useChecklistStore();
  const percentage = getCompletionPercentage();

  return (
    <Card className="shadow-sm border-brand-sand bg-white">
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-brand-taupe flex justify-between items-center">
          <span>Your Planning Progress</span>
          <span className="text-brand-gold font-sans text-lg">{percentage}%</span>
        </CardTitle>
        <CardDescription>
          Check off each step as you complete it. We&rsquo;ll track your progress automatically.
        </CardDescription>
        <Progress value={percentage} className="h-2 bg-brand-sand [&>div]:bg-brand-gold mt-4" />
      </CardHeader>
      <CardContent className="mt-4 flex flex-col gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start justify-between p-4 rounded-lg border transition-all ${
              task.completed
                ? "bg-brand-cream/40 border-slate-100"
                : "bg-white border-brand-sand hover:border-brand-gold/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <Checkbox
                id={task.id}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-0.5 border-brand-gold text-brand-gold focus-visible:ring-brand-gold"
              />
              <div className="flex flex-col gap-1">
                <label
                  htmlFor={task.id}
                  className={`font-medium text-brand-taupe cursor-pointer text-sm leading-none ${
                    task.completed ? "line-through opacity-60" : ""
                  }`}
                >
                  {task.title}
                </label>
                <span className="text-xs text-brand-taupe/60 italic">{task.dueDate}</span>
              </div>
            </div>
            <Badge variant="outline" className="border-brand-gold text-brand-gold capitalize text-xs">
              {task.category}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create Checklist page**

Create `src/app/dashboard/checklist/page.tsx`:

```tsx
import { ChecklistContainer } from "@/components/dashboard/ChecklistContainer";

export default function ChecklistPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-8">Wedding Checklist</h1>
      <ChecklistContainer />
    </div>
  );
}
```

- [ ] **Step 4: Verify build** — `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Zustand checklist store and ChecklistContainer"
```

---

### Task 16: Build Budget Tracker with recharts PieChart

**Files:**
- Create: `src/lib/store/useBudgetStore.ts`
- Create: `src/components/dashboard/BudgetTracker.tsx`
- Create: `src/app/dashboard/budget/page.tsx`

- [ ] **Step 1: Create budget store**

Create `src/lib/store/useBudgetStore.ts`:

```typescript
import { create } from "zustand";

export interface BudgetItem {
  id: string;
  category: string;
  allocated: number;
  spent: number;
}

interface BudgetState {
  items: BudgetItem[];
  totalBudget: number;
  updateSpent: (id: string, spent: number) => void;
  getTotalSpent: () => number;
  getRemaining: () => number;
}

export const useBudgetStore = create<BudgetState>()((set, get) => ({
  totalBudget: 30000,
  items: [
    { id: "1", category: "Venue", allocated: 10000, spent: 8000 },
    { id: "2", category: "Catering", allocated: 8000, spent: 4500 },
    { id: "3", category: "Photography", allocated: 4000, spent: 3000 },
    { id: "4", category: "Attire", allocated: 3000, spent: 2000 },
    { id: "5", category: "Decoration", allocated: 3000, spent: 1000 },
    { id: "6", category: "Music & Entertainment", allocated: 2000, spent: 500 },
  ],
  updateSpent: (id, spent) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, spent: Math.min(spent, item.allocated) } : item
      ),
    })),
  getTotalSpent: () => get().items.reduce((sum, item) => sum + item.spent, 0),
  getRemaining: () => get().totalBudget - get().getTotalSpent(),
}));
```

- [ ] **Step 2: Create BudgetTracker**

Create `src/components/dashboard/BudgetTracker.tsx`:

```tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBudgetStore } from "@/lib/store/useBudgetStore";

const COLORS = ["#D3A27F", "#4A3E3D", "#F5EFEB", "#8B7B77", "#C4A882", "#706E6B"];

export function BudgetTracker() {
  const { items, totalBudget, updateSpent, getTotalSpent, getRemaining } = useBudgetStore();
  const totalSpent = getTotalSpent();
  const remaining = getRemaining();

  const chartData = items.map((item) => ({
    name: item.category,
    value: item.spent,
  }));

  return (
    <div className="space-y-6">
      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-taupe/70">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-2xl font-bold text-brand-taupe">
              ${totalBudget.toLocaleString()}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-taupe/70">Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-2xl font-bold text-amber-500">
              ${totalSpent.toLocaleString()}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-brand-taupe/70">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <span className={`font-serif text-2xl font-bold ${remaining >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              ${remaining.toLocaleString()}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart + Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-brand-sand">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-brand-taupe">Spending Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Spent"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sand">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-brand-taupe">Budget Allocation</CardTitle>
            <CardDescription>Update your actual spending by category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <Label className="text-sm text-brand-taupe">{item.category}</Label>
                  <div className="flex justify-between text-xs text-brand-taupe/50">
                    <span>Spent</span>
                    <span>
                      ${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-brand-sand rounded-full h-2 mt-1">
                    <div
                      className="bg-brand-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(item.spent / item.allocated) * 100}%` }}
                    />
                  </div>
                </div>
                <Input
                  type="number"
                  value={item.spent}
                  onChange={(e) => updateSpent(item.id, Number(e.target.value))}
                  className="w-24 border-brand-sand text-sm"
                  min={0}
                  max={item.allocated}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create Budget page**

Create `src/app/dashboard/budget/page.tsx`:

```tsx
import { BudgetTracker } from "@/components/dashboard/BudgetTracker";

export default function BudgetPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-8">Budget Tracker</h1>
      <BudgetTracker />
    </div>
  );
}
```

- [ ] **Step 4: Verify build** — `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Budget Tracker with recharts PieChart"
```

---

### Task 17: Build Guest List Tracker

**Files:**
- Create: `src/lib/store/useGuestStore.ts`
- Create: `src/components/dashboard/GuestListTable.tsx`
- Create: `src/app/dashboard/guests/page.tsx`

- [ ] **Step 1: Create guest store**

Create `src/lib/store/useGuestStore.ts`:

```typescript
import { create } from "zustand";

export type RSVP = "confirmed" | "declined" | "pending";

export interface Guest {
  id: string;
  name: string;
  email: string;
  rsvp: RSVP;
  plusOne: boolean;
  mealPreference: string;
}

interface GuestState {
  guests: Guest[];
  updateRsvp: (id: string, rsvp: RSVP) => void;
  getStats: () => { confirmed: number; declined: number; pending: number; total: number };
}

export const useGuestStore = create<GuestState>()((set, get) => ({
  guests: [
    { id: "1", name: "Budi Santoso", email: "budi@email.com", rsvp: "confirmed", plusOne: true, mealPreference: "Regular" },
    { id: "2", name: "Siti Nurhaliza", email: "siti@email.com", rsvp: "confirmed", plusOne: false, mealPreference: "Vegetarian" },
    { id: "3", name: "Ahmad Fauzi", email: "ahmad@email.com", rsvp: "pending", plusOne: true, mealPreference: "Regular" },
    { id: "4", name: "Dewi Lestari", email: "dewi@email.com", rsvp: "declined", plusOne: false, mealPreference: "Regular" },
    { id: "5", name: "Rudi Hermawan", email: "rudi@email.com", rsvp: "confirmed", plusOne: true, mealPreference: "Halal" },
    { id: "6", name: "Anisa Rahma", email: "anisa@email.com", rsvp: "pending", plusOne: false, mealPreference: "Vegetarian" },
    { id: "7", name: "Hendra Gunawan", email: "hendra@email.com", rsvp: "confirmed", plusOne: false, mealPreference: "Regular" },
    { id: "8", name: "Ratna Sari", email: "ratna@email.com", rsvp: "pending", plusOne: true, mealPreference: "Regular" },
  ],
  updateRsvp: (id, rsvp) =>
    set((state) => ({
      guests: state.guests.map((guest) =>
        guest.id === id ? { ...guest, rsvp } : guest
      ),
    })),
  getStats: () => {
    const guests = get().guests;
    return {
      confirmed: guests.filter((g) => g.rsvp === "confirmed").length,
      declined: guests.filter((g) => g.rsvp === "declined").length,
      pending: guests.filter((g) => g.rsvp === "pending").length,
      total: guests.length,
    };
  },
}));
```

- [ ] **Step 2: Create GuestListTable**

Create `src/components/dashboard/GuestListTable.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGuestStore, RSVP } from "@/lib/store/useGuestStore";

const rsvpColors: Record<RSVP, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  declined: "bg-rose-100 text-rose-700 border-rose-200",
};

export function GuestListTable() {
  const { guests, updateRsvp, getStats } = useGuestStore();
  const stats = getStats();
  const [filter, setFilter] = useState<RSVP | "all">("all");

  const filteredGuests = filter === "all" ? guests : guests.filter((g) => g.rsvp === filter);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-brand-taupe/70 uppercase">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-xl font-bold text-brand-taupe">{stats.total}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-brand-taupe/70 uppercase">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-xl font-bold text-emerald-500">{stats.confirmed}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-brand-taupe/70 uppercase">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-xl font-bold text-amber-500">{stats.pending}</span>
          </CardContent>
        </Card>
        <Card className="bg-white border-brand-sand">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-brand-taupe/70 uppercase">Declined</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="font-serif text-xl font-bold text-rose-500">{stats.declined}</span>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-white border-brand-sand shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif text-lg text-brand-taupe">Guest List</CardTitle>
              <CardDescription>Manage RSVPs and meal preferences.</CardDescription>
            </div>
            <Select value={filter} onValueChange={(v) => setFilter(v as RSVP | "all")}>
              <SelectTrigger className="w-36 border-brand-sand text-sm">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Guests</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-brand-sand">
                <TableHead className="text-brand-taupe">Name</TableHead>
                <TableHead className="text-brand-taupe">Email</TableHead>
                <TableHead className="text-brand-taupe">+1</TableHead>
                <TableHead className="text-brand-taupe">Meal</TableHead>
                <TableHead className="text-brand-taupe">RSVP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuests.map((guest) => (
                <TableRow key={guest.id} className="border-brand-sand">
                  <TableCell className="font-medium text-brand-taupe">{guest.name}</TableCell>
                  <TableCell className="text-brand-taupe/60">{guest.email}</TableCell>
                  <TableCell className="text-brand-taupe/60">
                    {guest.plusOne ? "Yes" : "No"}
                  </TableCell>
                  <TableCell className="text-brand-taupe/60">{guest.mealPreference}</TableCell>
                  <TableCell>
                    <Select
                      value={guest.rsvp}
                      onValueChange={(v) => updateRsvp(guest.id, v as RSVP)}
                    >
                      <SelectTrigger className={`w-28 text-xs border ${rsvpColors[guest.rsvp]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
              {filteredGuests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-brand-taupe/50 py-10">
                    No guests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Create Guests page**

Create `src/app/dashboard/guests/page.tsx`:

```tsx
import { GuestListTable } from "@/components/dashboard/GuestListTable";

export default function GuestsPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-8">Guest List</h1>
      <GuestListTable />
    </div>
  );
}
```

- [ ] **Step 4: Verify build** — `npm run build` passes.

- [ ] **Step 5: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Guest List Tracker with RSVP filtering"
```

---

## Phase 7: Vendor Dashboard

### Task 18: Build Vendor Dashboard (portfolio & bookings)

**Files:**
- Create: `src/app/dashboard/vendor/page.tsx`

- [ ] **Step 1: Create Vendor Dashboard page**

Create `src/app/dashboard/vendor/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CalendarDays, Star, DollarSign, Image, Package, Settings, FileText } from "lucide-react";

const bookings = [
  { id: "B001", client: "Sarah & James", event: "Wedding Reception", date: "2026-08-15", status: "confirmed", amount: 3200 },
  { id: "B002", client: "Maya Putri", event: "Engagement Party", date: "2026-07-22", status: "pending", amount: 1500 },
  { id: "B003", client: "Dewi & Ahmad", event: "Full Wedding", date: "2026-09-10", status: "confirmed", amount: 5500 },
  { id: "B004", client: "Lisa Kumala", event: "Vow Renewal", date: "2026-10-05", status: "cancelled", amount: 2000 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  cancelled: "bg-rose-100 text-rose-700 border-rose-200",
};

const stats = [
  { label: "Total Bookings", value: "24", icon: CalendarDays },
  { label: "Average Rating", value: "4.8 ★", icon: Star },
  { label: "Revenue YTD", value: "$48,500", icon: DollarSign },
  { label: "Portfolio Views", value: "1,234", icon: Image },
];

export default function VendorDashboard() {
  const [selectedBooking, setSelectedBooking] = useState<(typeof bookings)[0] | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe">Vendor Dashboard</h1>
        <Button variant="outline" className="border-brand-gold text-brand-gold">
          <Settings className="w-4 h-4 mr-2" /> Edit Profile
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="bg-white border-brand-sand shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-brand-taupe/70">{label}</CardTitle>
              <Icon className="w-4 h-4 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <span className="font-serif text-2xl font-bold text-brand-taupe">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Portfolio Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white border-brand-sand shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-brand-taupe flex items-center gap-2">
              <Image className="w-4 h-4 text-brand-gold" /> Portfolio
            </CardTitle>
            <CardDescription>Manage your gallery and packages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brand-sand rounded-lg">
              <span className="text-brand-taupe text-sm">Wedding Package — Premium</span>
              <span className="font-semibold text-brand-taupe">$3,200</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-brand-sand rounded-lg">
              <span className="text-brand-taupe text-sm">Engagement Package — Standard</span>
              <span className="font-semibold text-brand-taupe">$1,500</span>
            </div>
            <Button variant="outline" className="w-full border-brand-sand text-brand-taupe">
              <Package className="w-4 h-4 mr-2" /> Add New Package
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sand shadow-sm">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-brand-taupe flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-gold" /> Recent Inquiries
            </CardTitle>
            <CardDescription>New quote requests from couples.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Sarah & James", event: "Wedding (Aug 2026)", time: "2 hours ago" },
              { name: "Putri & Rizky", event: "Pre-wedding (Jul 2026)", time: "5 hours ago" },
              { name: "Linda & Kevin", event: "Reception (Sep 2026)", time: "1 day ago" },
            ].map((inq) => (
              <div key={inq.name} className="flex items-center justify-between py-2 border-b border-brand-sand last:border-0">
                <div>
                  <p className="text-sm font-medium text-brand-taupe">{inq.name}</p>
                  <p className="text-xs text-brand-taupe/50">{inq.event}</p>
                </div>
                <span className="text-xs text-brand-taupe/40">{inq.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card className="bg-white border-brand-sand shadow-sm">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-brand-taupe">Booking Requests</CardTitle>
          <CardDescription>Manage your confirmed and pending bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-brand-sand">
                <TableHead className="text-brand-taupe">Booking ID</TableHead>
                <TableHead className="text-brand-taupe">Client</TableHead>
                <TableHead className="text-brand-taupe">Event</TableHead>
                <TableHead className="text-brand-taupe">Date</TableHead>
                <TableHead className="text-brand-taupe">Amount</TableHead>
                <TableHead className="text-brand-taupe">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  className="border-brand-sand cursor-pointer hover:bg-brand-sand/30"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <TableCell className="text-brand-gold font-medium">{booking.id}</TableCell>
                  <TableCell className="text-brand-taupe">{booking.client}</TableCell>
                  <TableCell className="text-brand-taupe/70">{booking.event}</TableCell>
                  <TableCell className="text-brand-taupe/70">{booking.date}</TableCell>
                  <TableCell className="font-medium text-brand-taupe">
                    ${booking.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusColors[booking.status]}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Booking Detail Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif text-brand-taupe">
              Booking {selectedBooking?.id}
            </DialogTitle>
            <DialogDescription>Client: {selectedBooking?.client}</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-brand-taupe/70 text-xs">Event</Label>
                  <p className="text-brand-taupe">{selectedBooking.event}</p>
                </div>
                <div>
                  <Label className="text-brand-taupe/70 text-xs">Date</Label>
                  <p className="text-brand-taupe">{selectedBooking.date}</p>
                </div>
                <div>
                  <Label className="text-brand-taupe/70 text-xs">Amount</Label>
                  <p className="text-brand-taupe font-semibold">
                    ${selectedBooking.amount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-brand-taupe/70 text-xs">Status</Label>
                  <Badge variant="outline" className={statusColors[selectedBooking.status]}>
                    {selectedBooking.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-brand-sand">
                <Button className="bg-brand-gold text-white hover:bg-brand-taupe flex-1">
                  Confirm
                </Button>
                <Button variant="outline" className="border-brand-sand text-brand-taupe/70 flex-1">
                  Decline
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

- [ ] **Step 2: Verify build** — `npm run build` passes.

- [ ] **Step 3: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Vendor Dashboard with bookings and portfolio"
```

---

## Phase 8: Inspiration & Pricing Pages + Polish

### Task 19: Build Inspiration page

**Files:**
- Create: `src/app/inspiration/page.tsx`

- [ ] **Step 1: Create Inspiration page**

Create `src/app/inspiration/page.tsx`:

```tsx
"use client";

import { motion } from "motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const galleries = [
  { title: "Classic Elegance", image: "", count: 24, gradient: "from-brand-sand via-brand-cream to-brand-gold/30" },
  { title: "Rustic Garden", image: "", count: 18, gradient: "from-brand-sand via-brand-cream to-emerald-100/50" },
  { title: "Modern Minimalist", image: "", count: 12, gradient: "from-brand-sand via-brand-cream to-neutral-200/50" },
  { title: "Beach Romance", image: "", count: 15, gradient: "from-brand-sand via-brand-cream to-sky-100/50" },
  { title: "Traditional Culture", image: "", count: 30, gradient: "from-brand-sand via-brand-cream to-amber-100/50" },
  { title: "Intimate Micro Wedding", image: "", count: 9, gradient: "from-brand-sand via-brand-cream to-rose-100/50" },
];

export default function InspirationPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-5xl text-brand-taupe mb-4">
            Wedding Inspiration
          </h1>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Curated galleries to spark your imagination for the perfect day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {galleries.map(({ title, count, gradient }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              className="cursor-pointer"
            >
              <Card className="bg-white border-brand-sand overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Heart className="w-12 h-12 text-brand-gold/30" />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-serif text-lg text-brand-taupe">{title}</h3>
                  <p className="text-sm text-brand-taupe/50 mt-1">{count} inspirations</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build** — `npm run build` passes.

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add Inspiration gallery page"
```

---

### Task 20: Build Pricing page and add page transitions

**Files:**
- Create: `src/app/pricing/page.tsx`

- [ ] **Step 1: Create standalone Pricing page**

Create `src/app/pricing/page.tsx`:

```tsx
import { PricingSection } from "@/components/sections/PricingSection";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-brand-cream pt-12">
      <PricingSection />
    </div>
  );
}
```

- [ ] **Step 2: Verify build** — `npm run build` passes.

- [ ] **Step 3: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "feat: add standalone Pricing page"
```

---

### Task 21: Final verification — build and lint

- [ ] **Step 1: Run full build**

```bash
cd "D:/FE/wedding landing page" && npm run build 2>&1
```
Expected: Build completes with no errors.

- [ ] **Step 2: Run lint**

```bash
cd "D:/FE/wedding landing page" && npm run lint 2>&1
```
Expected: No lint errors (or only minor warnings).

- [ ] **Step 3: Start dev server and verify**

```bash
cd "D:/FE/wedding landing page" && npm run dev 2>&1 &
```
Visit `http://localhost:3000` and verify:
- Landing page with all sections
- Navigation works (desktop + mobile)
- Auth pages load
- Vendor marketplace with filters
- Dashboard with checklist, budget, guests
- Vendor dashboard loads

- [ ] **Step 4: Commit**

```bash
cd "D:/FE/wedding landing page" && git add -A && git commit -m "chore: final verification — all pages functional"
```

---
