# Venue Detail Premium Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the venue detail page with cinematic hero, image gallery, elegant about section, and premium layout using only existing DB data.

**Architecture:** Server component (`page.tsx`) fetches venue data, passes it as props to section components. Client components handle interactivity: hero scroll-to button, gallery lightbox, motion scroll animations. PackageCard unchanged.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, motion (Framer Motion), @base-ui/react dialog, lucide-react, @tailwindcss/typography

**Files created:** `info-chips.tsx`, `image-gallery.tsx`, `venue-hero.tsx`, `about-section.tsx`, `footer-cta.tsx` — all in `src/app/venue/[slug]/`

**Files modified:** `page.tsx`

**Files unchanged:** `package-card.tsx`, all API routes, DB schema

---

### Task 1: Create InfoChips component

**Files:**
- Create: `src/app/venue/[slug]/info-chips.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { MapPin, Users, Package2, Banknote } from "lucide-react";

function formatIDR(amount: number): string {
  return "Rp " + (amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1) + " jt";
}

interface InfoChipsProps {
  location: string;
  maxCapacity: number;
  packageCount: number;
  cheapestPrice: number | null;
}

export function InfoChips({ location, maxCapacity, packageCount, cheapestPrice }: InfoChipsProps) {
  const chips = [
    { icon: MapPin, label: location },
    { icon: Users, label: `${maxCapacity} tamu` },
    { icon: Package2, label: `${packageCount} paket` },
    ...(cheapestPrice !== null ? [{ icon: Banknote, label: `Mulai ${formatIDR(cheapestPrice)}` }] : []),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-brand-sand/60 bg-white text-sm text-brand-taupe/70 shrink-0 hover:border-brand-gold/30 transition-colors"
          >
            <chip.icon className="w-4 h-4 text-brand-gold/60" />
            <span>{chip.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/[slug]/info-chips.tsx
git commit -m "feat: add InfoChips component for venue detail"
```

---

### Task 2: Create ImageGallery component

**Files:**
- Create: `src/app/venue/[slug]/image-gallery.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  venueName: string;
}

export function ImageGallery({ images, venueName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const featured = images[0];
  const thumbnails = images.slice(1, 5);
  const remaining = images.length - 5;

  const openLightbox = (index: number) => setSelectedIndex(index);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
        {/* Featured image */}
        <div
          className="md:col-span-2 relative aspect-[4/3] cursor-pointer group overflow-hidden rounded-2xl md:rounded-none md:rounded-l-2xl"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={featured}
            alt={venueName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Thumbnails grid */}
        <div className="grid grid-cols-2 gap-3">
          {thumbnails.map((img, i) => (
            <div
              key={i}
              className="relative aspect-square cursor-pointer group overflow-hidden rounded-2xl md:rounded-none md:last:rounded-br-2xl"
              onClick={() => openLightbox(i + 1)}
            >
              <Image
                src={img}
                alt={`${venueName} ${i + 2}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 50vw, 16vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              {remaining > 0 && i === thumbnails.length - 1 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-sm font-medium flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    +{remaining} Foto
                  </span>
                </div>
              )}
            </div>
          ))}
          {/* Fill empty slots if fewer than 4 thumbnails — only show what exists */}
        </div>
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Dialog open onOpenChange={() => setSelectedIndex(null)}>
          <DialogContent className="sm:max-w-4xl p-1 bg-black/95 border-0" showCloseButton={true}>
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={images[selectedIndex]}
                alt={`${venueName} ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <p className="text-center text-white/70 text-xs px-2 pb-1">
              {selectedIndex + 1} / {images.length}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/[slug]/image-gallery.tsx
git commit -m "feat: add ImageGallery component with lightbox for venue detail"
```

---

### Task 3: Create VenueHero component

**Files:**
- Create: `src/app/venue/[slug]/venue-hero.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, Users, ArrowLeft, ChevronDown } from "lucide-react";

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

interface VenueHeroProps {
  name: string;
  location: string;
  description: string;
  maxCapacity: number;
  cheapestPrice: number | null;
  image: string | null;
  bookingUrl: string;
}

export function VenueHero({
  name,
  location,
  description,
  maxCapacity,
  cheapestPrice,
  image,
  bookingUrl,
}: VenueHeroProps) {
  const shortDesc = description.length > 120 ? description.slice(0, 120) + "…" : description;

  const scrollToPackages = () => {
    document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left column — text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-brand-taupe tracking-tight leading-[1.1] mb-6">
              {name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-taupe/55 mb-5">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-gold/60" />
                {location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-gold/60" />
                {maxCapacity} tamu
              </span>
              {cheapestPrice !== null && (
                <span className="font-semibold text-brand-gold">
                  {formatIDR(cheapestPrice)}
                </span>
              )}
            </div>

            <p className="text-brand-taupe/60 leading-relaxed mb-8 max-w-md">
              {shortDesc}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={scrollToPackages}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-white rounded-full text-sm font-medium hover:bg-brand-taupe transition-colors"
              >
                Lihat Paket
                <ChevronDown className="w-4 h-4" />
              </button>
              <a
                href={bookingUrl || "tel:"}
                className="inline-flex items-center gap-2 px-6 py-3 border border-brand-sand rounded-full text-sm font-medium text-brand-taupe/70 hover:border-brand-gold/40 hover:text-brand-taupe transition-colors"
              >
                Hubungi Kami
              </a>
            </div>
          </motion.div>

          {/* Right column — image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-1 md:order-2 relative"
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-brand-taupe/10">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-taupe/20 via-brand-gold/10 to-brand-cream" />
              )}
            </div>

            {/* Back button */}
            <Link
              href="/venue"
              className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-sm text-brand-taupe/70 hover:bg-white hover:text-brand-taupe transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/[slug]/venue-hero.tsx
git commit -m "feat: add premium VenueHero component with animations"
```

---

### Task 4: Create AboutSection component

**Files:**
- Create: `src/app/venue/[slug]/about-section.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { motion } from "motion/react";
import { MapPin, Users, Banknote } from "lucide-react";

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

interface AboutSectionProps {
  description: string;
  location: string;
  maxCapacity: number;
  cheapestPrice: number | null;
}

export function AboutSection({
  description,
  location,
  maxCapacity,
  cheapestPrice,
}: AboutSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto px-4 md:px-8 py-16 md:py-24"
    >
      {/* Decorative line */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-gold/20" />
        <div className="w-2 h-2 rounded-full bg-brand-gold/40" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-gold/20" />
      </div>

      <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe text-center mb-6">
        Tentang Venue
      </h2>

      <p className="text-brand-taupe/60 leading-relaxed text-base md:text-lg text-center mb-10">
        {description}
      </p>

      {/* Stat pills */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-brand-sand/60 shadow-sm">
          <MapPin className="w-4 h-4 text-brand-gold/60" />
          <span className="text-sm text-brand-taupe/70">{location}</span>
        </div>
        <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-brand-sand/60 shadow-sm">
          <Users className="w-4 h-4 text-brand-gold/60" />
          <span className="text-sm text-brand-taupe/70">{maxCapacity} tamu</span>
        </div>
        {cheapestPrice !== null && (
          <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-full border border-brand-gold/30 shadow-sm">
            <Banknote className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-medium text-brand-gold">{formatIDR(cheapestPrice)}</span>
          </div>
        )}
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/[slug]/about-section.tsx
git commit -m "feat: add AboutSection component with scroll animation"
```

---

### Task 5: Create FooterCTA component

**Files:**
- Create: `src/app/venue/[slug]/footer-cta.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { Sparkles } from "lucide-react";

interface FooterCTAProps {
  bookingUrl: string;
}

export function FooterCTA({ bookingUrl }: FooterCTAProps) {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
      <Sparkles className="w-6 h-6 text-brand-gold/40 mx-auto mb-5" />
      <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-3">
        Siap Merencanakan Pernikahan Impian Anda?
      </h2>
      <p className="text-brand-taupe/50 mb-8 max-w-md mx-auto">
        Konsultasikan kebutuhan pernikahan Anda dengan tim kami dan dapatkan penawaran terbaik.
      </p>
      <a
        href={bookingUrl || "#"}
        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-white rounded-full text-sm font-medium hover:bg-brand-taupe transition-colors shadow-lg shadow-brand-gold/20"
      >
        Konsultasi Gratis
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/[slug]/footer-cta.tsx
git commit -m "feat: add FooterCTA component"
```

---

### Task 6: Rewrite page.tsx to compose all sections

**Files:**
- Modify: `src/app/venue/[slug]/page.tsx`

- [ ] **Step 1: Replace the page with the new composition**

```tsx
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { VenueHero } from "./venue-hero";
import { InfoChips } from "./info-chips";
import { ImageGallery } from "./image-gallery";
import { AboutSection } from "./about-section";
import { PackageCard } from "./package-card";
import { FooterCTA } from "./footer-cta";

interface PackageData {
  id: number;
  name: string;
  pax: number;
  price: number;
  content: string;
  bookingUrl: string;
}

interface VenueDetail {
  id: number;
  name: string;
  location: string;
  description: string;
  maxCapacity: number;
  images: string[];
  packages: PackageData[];
}

async function getVenue(slug: string): Promise<VenueDetail | null> {
  const venue = await db.venue.findUnique({
    where: { slug },
    include: { packages: { orderBy: { price: "asc" } } },
  });
  if (!venue) return null;
  return {
    ...venue,
    images: JSON.parse(venue.images) as string[],
    packages: venue.packages.map((pkg) => ({
      ...pkg,
      price: Number(pkg.price),
    })),
  };
}

function cheapestPrice(packages: PackageData[]): number | null {
  if (packages.length === 0) return null;
  return Math.min(...packages.map((p) => p.price));
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await getVenue(slug);
  if (!venue) notFound();

  const price = cheapestPrice(venue.packages);
  const bookingUrl = venue.packages[0]?.bookingUrl || "";

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <VenueHero
        name={venue.name}
        location={venue.location}
        description={venue.description}
        maxCapacity={venue.maxCapacity}
        cheapestPrice={price}
        image={venue.images[0] || null}
        bookingUrl={bookingUrl}
      />

      {/* Info Chips */}
      <InfoChips
        location={venue.location}
        maxCapacity={venue.maxCapacity}
        packageCount={venue.packages.length}
        cheapestPrice={price}
      />

      {/* Image Gallery */}
      <ImageGallery images={venue.images} venueName={venue.name} />

      {/* About */}
      <AboutSection
        description={venue.description}
        location={venue.location}
        maxCapacity={venue.maxCapacity}
        cheapestPrice={price}
      />

      {/* Packages */}
      {venue.packages.length > 0 && (
        <section id="packages-section" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe">
              Paket Wedding
            </h2>
            <p className="text-brand-taupe/45 text-sm mt-2">
              Pilih paket yang sesuai dengan kebutuhan Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {venue.packages.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center py-16">
            <p className="text-brand-taupe/40 font-serif text-lg">
              Belum ada paket tersedia untuk venue ini.
            </p>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <FooterCTA bookingUrl={bookingUrl} />

      {/* Bottom divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-sand to-transparent" />
    </div>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/[slug]/page.tsx
git commit -m "refactor: premium redesign of venue detail page with new components"
```
