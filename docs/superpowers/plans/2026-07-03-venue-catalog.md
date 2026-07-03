# Venue Catalog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `/vendors` with a Venue Catalog at `/venue` using MySQL + Prisma backend, with listing page (filter sidebar + card grid), detail page (gallery, packages, comparison table), and WhatsApp booking.

**Architecture:** Prisma ORM with MySQL for data, Next.js API Route Handlers in `src/app/api/venues/`, server components for pages, client components for filters/comparison. Old vendor marketplace files deleted, navbar/footer updated.

**Tech Stack:** Next.js 16 App Router, Prisma ORM + MySQL, Tailwind CSS v4, shadcn/ui

---

### Task 1: Prisma + Database Setup

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `.env`
- Modify: `package.json`

- [ ] **Step 1: Install Prisma dependencies**

```bash
npm install prisma @prisma/client
```

- [ ] **Step 2: Create .env with database URL**

Write `.env`:

```env
DATABASE_URL="mysql://root:dimas1213@127.0.0.1:3306/sola_project"
```

- [ ] **Step 3: Create Prisma schema**

Write `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Venue {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  name        String
  location    String
  description String    @db.Text
  maxCapacity Int
  images      String    @db.Text
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  packages    Package[]
}

model Package {
  id         Int     @id @default(autoincrement())
  venueId    Int
  name       String
  pax        Int
  price      BigInt
  features   String  @db.Text
  bookingUrl String  @db.Text

  venue      Venue   @relation(fields: [venueId], references: [id], onDelete: Cascade)

  @@index([venueId])
}
```

- [ ] **Step 4: Run Prisma migration**

```bash
npx prisma migrate dev --name init
```

Expected: Creates `prisma/migrations/` directory, applies schema to MySQL `sola_project` database.

- [ ] **Step 5: Create Prisma client singleton**

Write `src/lib/db.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

- [ ] **Step 6: Commit**

```bash
git add prisma/schema.prisma src/lib/db.ts .env package.json package-lock.json
git commit -m "feat: add Prisma setup with Venue and Package schema + MySQL"
```

---

### Task 2: Seed Data

**Files:**
- Create: `prisma/seed.ts`
- Modify: `package.json`

- [ ] **Step 1: Add seed script to package.json**

In `package.json`, add to the `prisma` key (create if not exists):

```json
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
```

Also add `tsx` if not already installed:

```bash
npm install -D tsx
```

- [ ] **Step 2: Create seed script**

Write `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const venues = [
  {
    slug: "the-hermitage",
    name: "The Hermitage",
    location: "Jakarta",
    description:
      "The Hermitage menawarkan suasana elegan klasik Eropa di jantung Jakarta. Ballroom megah dengan kapasitas hingga 500 tamu, dikelilingi taman tropis yang asri. Sempurna untuk pernikahan grand dan intimate.",
    maxCapacity: 500,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Hermitage Intimate",
          pax: 100,
          price: BigInt(75000000),
          features: JSON.stringify([
            "Ballroom utama (6 jam)",
            "Catering 100 pax (buffet)",
            "Dekorasi bunga standar",
            "Sound system & microphone",
            "Ruang ganti pengantin",
            "Parkir 20 mobil",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Intimate di The Hermitage",
        },
        {
          name: "Hermitage Grand",
          pax: 200,
          price: BigInt(135000000),
          features: JSON.stringify([
            "Ballroom utama (8 jam)",
            "Catering 200 pax (buffet + welcome drink)",
            "Dekorasi bunga premium",
            "Sound system & microphone",
            "Lighting dasar",
            "Ruang ganti pengantin",
            "Parkir 40 mobil",
            "Wedding cake 3 tier",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Grand di The Hermitage",
        },
        {
          name: "Hermitage Royale",
          pax: 300,
          price: BigInt(210000000),
          features: JSON.stringify([
            "Ballroom utama + pre-function area (10 jam)",
            "Catering 300 pax (buffet + food station + welcome drink)",
            "Dekorasi bunga premium + pelaminan custom",
            "Sound system & microphone",
            "Lighting premium + dry ice",
            "Ruang ganti pengantin VIP",
            "Parkir valet 60 mobil",
            "Wedding cake 5 tier",
            "Photo booth",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Hermitage Royale di The Hermitage",
        },
      ],
    },
  },
  {
    slug: "rumah-imam-bonjol",
    name: "Rumah Imam Bonjol",
    location: "Bandung",
    description:
      "Bangunan heritage kolonial yang telah direstorasi dengan indah. Memadukan arsitektur klasik dengan sentuhan modern, menciptakan suasana romantis yang hangat di tengah udara sejuk Bandung.",
    maxCapacity: 300,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Bonjol Classic",
          pax: 100,
          price: BigInt(45000000),
          features: JSON.stringify([
            "Ruang utama (6 jam)",
            "Catering 100 pax (prasmanan)",
            "Dekorasi bunga lokal",
            "Sound system standar",
            "Ruang ganti",
            "Parkir 15 mobil",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Bonjol Classic di Rumah Imam Bonjol",
        },
        {
          name: "Bonjol Prestige",
          pax: 200,
          price: BigInt(85000000),
          features: JSON.stringify([
            "Ruang utama + taman (8 jam)",
            "Catering 200 pax (prasmanan + welcome drink)",
            "Dekorasi bunga premium",
            "Sound system + band akustik",
            "Lighting taman",
            "Ruang ganti pengantin",
            "Parkir 30 mobil",
            "Wedding cake 2 tier",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Bonjol Prestige di Rumah Imam Bonjol",
        },
      ],
    },
  },
  {
    slug: "tirtha-bridal",
    name: "Tirtha Bridal",
    location: "Bali",
    description:
      "Venue pernikahan ikonik di atas tebing dengan pemandangan Samudra Hindia. Kapel kaca yang memukau dan taman tropis yang terawat sempurna. Destinasi impian untuk wedding yang tak terlupakan.",
    maxCapacity: 400,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800",
      "https://images.unsplash.com/photo-1509927083803-4bd519298ac4?w=800",
      "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Tirtha Garden",
          pax: 150,
          price: BigInt(150000000),
          features: JSON.stringify([
            "Garden terrace (8 jam)",
            "Catering 150 pax (buffet internasional)",
            "Dekorasi tropis premium",
            "Sound system + DJ",
            "Lighting taman",
            "Ruang ganti pengantin",
            "Welcome drink bar",
            "Fotografer (4 jam)",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Garden di Tirtha Bridal",
        },
        {
          name: "Tirtha Sunset",
          pax: 250,
          price: BigInt(250000000),
          features: JSON.stringify([
            "Garden terrace + cliff deck (10 jam)",
            "Catering 250 pax (buffet + live station)",
            "Dekorasi tropis premium + flower arch",
            "Sound system + DJ + MC",
            "Lighting taman + fairy lights",
            "Ruang ganti pengantin VIP",
            "Welcome drink + signature cocktail bar",
            "Fotografer + videografer (8 jam)",
            "Fireworks (5 menit)",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Sunset di Tirtha Bridal",
        },
        {
          name: "Tirtha Ultimate",
          pax: 400,
          price: BigInt(400000000),
          features: JSON.stringify([
            "Seluruh venue (12 jam)",
            "Catering 400 pax (buffet + live station + dessert bar)",
            "Dekorasi tropis luxury + flower dome",
            "Sound system + DJ + MC + live band",
            "Premium lighting + fireworks display",
            "Ruang ganti pengantin presidential",
            "Welcome drink + premium open bar",
            "Fotografer + videografer (12 jam)",
            "Drone footage",
            "Wedding planner dedicated",
            "Transport shuttle tamu",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Tirtha Ultimate di Tirtha Bridal",
        },
      ],
    },
  },
  {
    slug: "sasana-budaya",
    name: "Gedung Sasana Budaya",
    location: "Yogyakarta",
    description:
      "Gedung pertemuan megah bernuansa Jawa klasik di pusat kota Yogyakarta. Arsitektur joglo yang megah dengan sentuhan modern, menciptakan harmoni sempurna antara tradisi dan kemewahan.",
    maxCapacity: 600,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
      "https://images.unsplash.com/photo-1478146059778-acee06e6a3f1?w=800",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Sasana Adiluhung",
          pax: 200,
          price: BigInt(55000000),
          features: JSON.stringify([
            "Pendopo utama (6 jam)",
            "Catering 200 pax (prasmanan Jawa)",
            "Dekorasi tradisional",
            "Sound system + gamelan",
            "Ruang ganti",
            "Parkir 30 mobil",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Sasana Adiluhung di Gedung Sasana Budaya",
        },
        {
          name: "Sasana Agung",
          pax: 400,
          price: BigInt(110000000),
          features: JSON.stringify([
            "Pendopo utama + pendopo VIP (8 jam)",
            "Catering 400 pax (prasmanan + live station)",
            "Dekorasi tradisional premium",
            "Sound system + gamelan + MC",
            "Lighting panggung",
            "Ruang ganti pengantin VIP",
            "Parkir valet 60 mobil",
            "Wedding cake 3 tier",
            "Tari penyambutan",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Sasana Agung di Gedung Sasana Budaya",
        },
      ],
    },
  },
  {
    slug: "le-meridien",
    name: "Le Meridien",
    location: "Jakarta",
    description:
      "Ballroom hotel bintang lima dengan akses langsung ke pusat bisnis Jakarta. Desain kontemporer yang sophisticated dengan teknologi terkini dan layanan bertaraf internasional.",
    maxCapacity: 350,
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800",
      "https://images.unsplash.com/photo-1574695141973-1a48c5783ed6?w=800",
    ]),
    packages: {
      create: [
        {
          name: "Meridien Classic",
          pax: 150,
          price: BigInt(95000000),
          features: JSON.stringify([
            "Ballroom (8 jam)",
            "Catering 150 pax (buffet internasional)",
            "Dekorasi bunga modern",
            "Sound system premium",
            "Basic lighting",
            "Ruang ganti pengantin",
            "Parkir valet 30 mobil",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Meridien Classic di Le Meridien",
        },
        {
          name: "Meridien Prestige",
          pax: 300,
          price: BigInt(175000000),
          features: JSON.stringify([
            "Grand Ballroom (10 jam)",
            "Catering 300 pax (buffet + live station + dessert bar)",
            "Dekorasi bunga premium",
            "Sound system + DJ + MC",
            "Premium lighting + LED screen",
            "Ruang ganti pengantin VIP",
            "Parkir valet 50 mobil",
            "Wedding cake 4 tier",
            "Photo booth + roaming photo",
            "Welcome drink bar",
          ]),
          bookingUrl: "https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket Meridien Prestige di Le Meridien",
        },
      ],
    },
  },
];

async function main() {
  console.log("Seeding database...");

  // Delete existing data
  await prisma.package.deleteMany();
  await prisma.venue.deleteMany();

  // Create venues with packages
  for (const venueData of venues) {
    await prisma.venue.create({ data: venueData });
    console.log(`Created venue: ${venueData.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 3: Run seed**

```bash
npx prisma db seed
```

Expected: Creates 5 venues with 12 packages. Console logs each venue name.

- [ ] **Step 4: Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: add seed script with 5 venues and 12 packages"
```

---

### Task 3: API Routes

**Files:**
- Create: `src/app/api/venues/route.ts`
- Create: `src/app/api/venues/[slug]/route.ts`

- [ ] **Step 1: Create GET/POST /api/venues route**

Write `src/app/api/venues/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search");
    const location = searchParams.get("location");
    const minCapacity = searchParams.get("minCapacity");
    const maxCapacity = searchParams.get("maxCapacity");

    const venues = await db.venue.findMany({
      where: {
        ...(search && { name: { contains: search } }),
        ...(location && { location }),
        ...(minCapacity && { maxCapacity: { gte: Number(minCapacity) } }),
        ...(maxCapacity && { maxCapacity: { lte: Number(maxCapacity) } }),
      },
      include: {
        packages: {
          select: { price: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const venuesWithCheapestPrice = venues.map((v) => ({
      ...v,
      images: JSON.parse(v.images) as string[],
      cheapestPrice: v.packages[0]?.price
        ? Number(v.packages[0].price)
        : null,
    }));

    return NextResponse.json({ venues: venuesWithCheapestPrice });
  } catch (error) {
    console.error("GET /api/venues error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, location, description, maxCapacity, images } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const venue = await db.venue.create({
      data: {
        name,
        slug,
        location: location || "",
        description: description || "",
        maxCapacity: maxCapacity || 0,
        images: JSON.stringify(images || []),
      },
    });

    return NextResponse.json({ venue }, { status: 201 });
  } catch (error) {
    console.error("POST /api/venues error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create GET /api/venues/[slug] route**

Write `src/app/api/venues/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const venue = await db.venue.findUnique({
      where: { slug },
      include: { packages: { orderBy: { price: "asc" } } },
    });

    if (!venue) {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      );
    }

    const venueWithParsed = {
      ...venue,
      images: JSON.parse(venue.images) as string[],
      packages: venue.packages.map((pkg) => ({
        ...pkg,
        price: Number(pkg.price),
        features: JSON.parse(pkg.features) as string[],
      })),
    };

    return NextResponse.json({ venue: venueWithParsed });
  } catch (error) {
    console.error("GET /api/venues/[slug] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/venues/route.ts src/app/api/venues/[slug]/route.ts
git commit -m "feat: add API routes for venues (list + detail)"
```

---

### Task 4: Venue Card + Venue Filter Components

**Files:**
- Create: `src/components/venue/VenueCard.tsx`
- Create: `src/components/venue/VenueFilter.tsx`

- [ ] **Step 1: Create VenueFilter component**

Write `src/components/venue/VenueFilter.tsx`:

```typescript
"use client";

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

export interface VenueFilters {
  search: string;
  location: string | null;
  minCapacity: string;
  maxCapacity: string;
  minPrice: string;
  maxPrice: string;
}

interface VenueFilterProps {
  filters: VenueFilters;
  locations: string[];
  onFilterChange: (filters: VenueFilters) => void;
}

const defaultFilters: VenueFilters = {
  search: "",
  location: null,
  minCapacity: "",
  maxCapacity: "",
  minPrice: "",
  maxPrice: "",
};

function FilterContent({
  filters,
  locations,
  onFilterChange,
}: VenueFilterProps) {
  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.minCapacity ||
    filters.maxCapacity ||
    filters.minPrice ||
    filters.maxPrice;

  const clearFilters = () => {
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-brand-taupe text-sm">Cari</Label>
        <Input
          placeholder="Cari venue..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="mt-2 border-brand-sand bg-white"
        />
      </div>

      <Separator className="bg-brand-sand" />

      <div>
        <Label className="text-brand-taupe text-sm font-semibold">
          Lokasi
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {locations.map((loc) => (
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

      <div>
        <Label className="text-brand-taupe text-sm font-semibold">
          Kapasitas Tamu
        </Label>
        <div className="mt-2 flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minCapacity}
            onChange={(e) =>
              onFilterChange({ ...filters, minCapacity: e.target.value })
            }
            className="border-brand-sand bg-white w-24"
          />
          <span className="text-brand-taupe/40">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxCapacity}
            onChange={(e) =>
              onFilterChange({ ...filters, maxCapacity: e.target.value })
            }
            className="border-brand-sand bg-white w-24"
          />
        </div>
      </div>

      <Separator className="bg-brand-sand" />

      <div>
        <Label className="text-brand-taupe text-sm font-semibold">
          Harga (Juta IDR)
        </Label>
        <div className="mt-2 flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, minPrice: e.target.value })
            }
            className="border-brand-sand bg-white w-24"
          />
          <span className="text-brand-taupe/40">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, maxPrice: e.target.value })
            }
            className="border-brand-sand bg-white w-24"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="text-brand-taupe/60 hover:text-red-500"
          onClick={clearFilters}
        >
          <X className="w-3 h-3 mr-1" /> Hapus semua filter
        </Button>
      )}
    </div>
  );
}

export function VenueFilter({
  filters,
  locations,
  onFilterChange,
}: VenueFilterProps) {
  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.minCapacity ||
    filters.maxCapacity ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white border border-brand-sand rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-brand-taupe font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </h3>
          </div>
          <FilterContent
            filters={filters}
            locations={locations}
            onFilterChange={onFilterChange}
          />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                className="border-brand-sand text-brand-taupe gap-2"
              />
            }
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
            )}
          </SheetTrigger>
          <SheetContent side="left" className="bg-brand-cream w-[300px]">
            <SheetHeader>
              <SheetTitle className="font-serif text-brand-taupe">
                Filter
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent
                filters={filters}
                locations={locations}
                onFilterChange={onFilterChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create VenueCard component**

Write `src/components/venue/VenueCard.tsx`:

```typescript
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Users } from "lucide-react";

interface VenueCardProps {
  slug: string;
  name: string;
  location: string;
  maxCapacity: number;
  cheapestPrice: number | null;
  image: string;
}

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function VenueCard({
  slug,
  name,
  location,
  maxCapacity,
  cheapestPrice,
  image,
}: VenueCardProps) {
  return (
    <Link href={`/venue/${slug}`}>
      <Card className="bg-white border-brand-sand hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300 overflow-hidden">
        <div className="relative h-48 w-full">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
              <span className="font-serif text-5xl text-brand-gold/30">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-5">
          <h3 className="font-serif text-lg text-brand-taupe font-semibold mb-2">
            {name}
          </h3>
          <div className="flex items-center gap-4 text-sm text-brand-taupe/60 mb-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {maxCapacity} pax
            </span>
          </div>
          {cheapestPrice && (
            <p className="text-sm">
              <span className="text-brand-taupe/60">Mulai dari </span>
              <span className="font-semibold text-brand-gold">
                {formatIDR(cheapestPrice)}
              </span>
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/venue/VenueCard.tsx src/components/venue/VenueFilter.tsx
git commit -m "feat: add VenueCard and VenueFilter components"
```

---

### Task 5: Venue Listing Page

**Files:**
- Create: `src/app/venue/page.tsx`

- [ ] **Step 1: Create listing page**

Write `src/app/venue/page.tsx`:

```typescript
import { VenueFilter } from "@/components/venue/VenueFilter";
import { VenueCard } from "@/components/venue/VenueCard";

interface VenueData {
  id: number;
  slug: string;
  name: string;
  location: string;
  maxCapacity: number;
  images: string[];
  cheapestPrice: number | null;
}

async function getVenues(): Promise<VenueData[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/venues`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.venues;
}

import { ClientVenueList } from "./client";

export default async function VenuePage() {
  const venues = await getVenues();
  const locations = [...new Set(venues.map((v) => v.location))].sort();

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-3">
            Katalog Venue
          </h1>
          <p className="text-brand-taupe/60 max-w-lg">
            Temukan venue impian Anda dari koleksi terkurasi kami.
          </p>
        </div>

        <ClientVenueList venues={venues} locations={locations} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create client-side filter wrapper**

Write `src/app/venue/client.tsx`:

```typescript
"use client";

import { useState, useMemo } from "react";
import { VenueFilter, type VenueFilters } from "@/components/venue/VenueFilter";
import { VenueCard } from "@/components/venue/VenueCard";

interface VenueData {
  id: number;
  slug: string;
  name: string;
  location: string;
  maxCapacity: number;
  images: string[];
  cheapestPrice: number | null;
}

const defaultFilters: VenueFilters = {
  search: "",
  location: null,
  minCapacity: "",
  maxCapacity: "",
  minPrice: "",
  maxPrice: "",
};

export function ClientVenueList({
  venues,
  locations,
}: {
  venues: VenueData[];
  locations: string[];
}) {
  const [filters, setFilters] = useState<VenueFilters>(defaultFilters);

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      if (
        filters.search &&
        !v.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.location && v.location !== filters.location) return false;
      if (filters.minCapacity && v.maxCapacity < Number(filters.minCapacity))
        return false;
      if (filters.maxCapacity && v.maxCapacity > Number(filters.maxCapacity))
        return false;
      if (filters.minPrice && (!v.cheapestPrice || v.cheapestPrice < Number(filters.minPrice) * 1_000_000))
        return false;
      if (filters.maxPrice && (!v.cheapestPrice || v.cheapestPrice > Number(filters.maxPrice) * 1_000_000))
        return false;
      return true;
    });
  }, [venues, filters]);

  return (
    <div className="flex gap-8">
      <VenueFilter
        filters={filters}
        locations={locations}
        onFilterChange={setFilters}
      />

      <div className="flex-1">
        <p className="text-sm text-brand-taupe/50 mb-6">
          Menampilkan {filtered.length} dari {venues.length} venue
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-taupe/60 font-serif text-lg mb-4">
              Tidak ada venue yang sesuai dengan filter Anda.
            </p>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="text-brand-gold hover:underline text-sm"
            >
              Hapus semua filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((venue) => (
              <VenueCard
                key={venue.id}
                slug={venue.slug}
                name={venue.name}
                location={venue.location}
                maxCapacity={venue.maxCapacity}
                cheapestPrice={venue.cheapestPrice}
                image={venue.images[0] || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/page.tsx src/app/venue/client.tsx
git commit -m "feat: add venue listing page with filter + card grid"
```

---

### Task 6: Venue Detail Page

**Files:**
- Create: `src/app/venue/[slug]/page.tsx`

- [ ] **Step 1: Create detail page**

Write `src/app/venue/[slug]/page.tsx`:

```typescript
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Users, Check, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

interface PackageData {
  id: number;
  name: string;
  pax: number;
  price: number;
  features: string[];
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/venues/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.venue;
}

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-16">
      <div className="h-px w-12 bg-brand-gold/40" />
      <div className="w-2 h-2 rounded-full bg-brand-gold/40" />
      <div className="h-px w-12 bg-brand-gold/40" />
    </div>
  );
}

import { PackageComparison } from "./comparison";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await getVenue(slug);

  if (!venue) notFound();

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/venue"
          className="inline-flex items-center gap-2 text-brand-taupe/60 hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 pt-8 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          {venue.images.map((img, i) => (
            <div
              key={i}
              className={`relative ${i === 0 ? "col-span-2 row-span-2" : ""} min-h-[200px]`}
            >
              <Image
                src={img}
                alt={`${venue.name} photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Venue Header */}
      <div className="container mx-auto px-4 pt-10 max-w-5xl">
        <h1 className="font-serif text-3xl md:text-5xl text-brand-taupe mb-4">
          {venue.name}
        </h1>
        <div className="flex items-center gap-6 text-brand-taupe/60 mb-8">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {venue.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Kapasitas {venue.maxCapacity} tamu
          </span>
        </div>
      </div>

      <SectionDivider />

      {/* About */}
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-6 text-center">
          Tentang Venue Ini
        </h2>
        <p className="text-brand-taupe/70 leading-relaxed text-base md:text-lg">
          {venue.description}
        </p>
      </div>

      <SectionDivider />

      {/* Packages */}
      <div className="container mx-auto px-4 max-w-5xl pb-20">
        <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-10 text-center">
          Paket Tersedia
        </h2>

        <PackageComparison venue={venue} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create package comparison client component**

Write `src/app/venue/[slug]/comparison.tsx`:

```typescript
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X as XIcon, Scale } from "lucide-react";

interface PackageData {
  id: number;
  name: string;
  pax: number;
  price: number;
  features: string[];
  bookingUrl: string;
}

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

export function PackageComparison({ venue }: { venue: { name: string; packages: PackageData[] } }) {
  const [selected, setSelected] = useState<number[]>([]);

  const togglePackage = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearComparison = () => setSelected([]);

  const selectedPackages = venue.packages.filter((p) =>
    selected.includes(p.id)
  );

  const allFeatures = [
    ...new Set(selectedPackages.flatMap((p) => p.features)),
  ];

  return (
    <>
      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {venue.packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`bg-white border-brand-sand shadow-sm transition-all duration-300 ${
              selected.includes(pkg.id)
                ? "ring-2 ring-brand-gold border-brand-gold"
                : ""
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif text-lg text-brand-taupe font-semibold">
                  {pkg.name}
                </h3>
                <Badge className="bg-brand-gold/10 text-brand-gold border-none">
                  {pkg.pax} Pax
                </Badge>
              </div>

              <p className="text-2xl font-bold text-brand-taupe mb-4">
                {formatIDR(pkg.price)}
              </p>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-brand-taupe/70"
                  >
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <a
                  href={pkg.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full bg-brand-gold text-white hover:bg-brand-taupe transition-colors">
                    Pesan
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full border-brand-sand ${
                    selected.includes(pkg.id)
                      ? "border-brand-gold text-brand-gold"
                      : "text-brand-taupe/60"
                  }`}
                  onClick={() => togglePackage(pkg.id)}
                >
                  <Scale className="w-3 h-3 mr-1" />
                  {selected.includes(pkg.id)
                    ? "Hapus dari perbandingan"
                    : "Bandingkan"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      {selectedPackages.length >= 2 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-xl text-brand-taupe">
              Perbandingan Paket
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-brand-taupe/60 hover:text-red-500"
              onClick={clearComparison}
            >
              <XIcon className="w-3 h-3 mr-1" /> Bersihkan Perbandingan
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-brand-sand shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-serif text-brand-taupe">
                    Fitur
                  </TableHead>
                  {selectedPackages.map((pkg) => (
                    <TableHead
                      key={pkg.id}
                      className="font-serif text-brand-taupe text-center"
                    >
                      {pkg.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-brand-taupe">
                    Pax
                  </TableCell>
                  {selectedPackages.map((pkg) => (
                    <TableCell
                      key={pkg.id}
                      className="text-center text-brand-taupe/70"
                    >
                      {pkg.pax}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-brand-taupe">
                    Harga
                  </TableCell>
                  {selectedPackages.map((pkg) => (
                    <TableCell
                      key={pkg.id}
                      className="text-center text-brand-gold font-semibold"
                    >
                      {formatIDR(pkg.price)}
                    </TableCell>
                  ))}
                </TableRow>
                {allFeatures.map((feature) => (
                  <TableRow key={feature}>
                    <TableCell className="text-brand-taupe/70">
                      {feature}
                    </TableCell>
                    {selectedPackages.map((pkg) => (
                      <TableCell key={pkg.id} className="text-center">
                        {pkg.features.includes(feature) ? (
                          <Check className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <XIcon className="w-4 h-4 text-red-300 mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/venue/\[slug\]/page.tsx src/app/venue/\[slug\]/comparison.tsx
git commit -m "feat: add venue detail page with gallery, packages, comparison"
```

---

### Task 7: Delete Old Vendor Files

**Files:**
- Delete: `src/app/vendors/page.tsx`
- Delete: `src/components/marketplace/VendorCard.tsx`
- Delete: `src/components/marketplace/VendorFilter.tsx`
- Delete: `src/components/marketplace/VendorDetailDialog.tsx`
- Delete: `src/lib/data/vendors.ts`
- Delete: `src/lib/types/vendor.ts`

- [ ] **Step 1: Delete old vendor files**

```bash
rm src/app/vendors/page.tsx
rm src/components/marketplace/VendorCard.tsx
rm src/components/marketplace/VendorFilter.tsx
rm src/components/marketplace/VendorDetailDialog.tsx
rm src/lib/data/vendors.ts
rm src/lib/types/vendor.ts
```

- [ ] **Step 2: Commit**

```bash
git add src/app/vendors/page.tsx src/components/marketplace/VendorCard.tsx src/components/marketplace/VendorFilter.tsx src/components/marketplace/VendorDetailDialog.tsx src/lib/data/vendors.ts src/lib/types/vendor.ts
git commit -m "chore: remove old vendor marketplace files"
```

---

### Task 8: Update Navbar, Footer, and VendorCarousel

**Files:**
- Modify: `src/components/ui-custom/Navbar.tsx`
- Modify: `src/components/ui-custom/Footer.tsx`
- Modify: `src/components/sections/VendorCarousel.tsx`

- [ ] **Step 1: Update Navbar — replace Find Vendors with Venue Catalog**

In `src/components/ui-custom/Navbar.tsx`, change the desktop link:

Replace:
```tsx
            <NavigationMenuItem>
              <Link href="/vendors" className={navigationMenuTriggerStyle()}>
                Find Vendors
              </Link>
            </NavigationMenuItem>
```

With:
```tsx
            <NavigationMenuItem>
              <Link href="/venue" className={navigationMenuTriggerStyle()}>
                Venue Catalog
              </Link>
            </NavigationMenuItem>
```

And in the mobile drawer, replace:
```tsx
                <Link href="/vendors" className="font-serif text-lg text-brand-taupe">
                  Find Vendors
                </Link>
```

With:
```tsx
                <Link href="/venue" className="font-serif text-lg text-brand-taupe">
                  Venue Catalog
                </Link>
```

- [ ] **Step 2: Update Footer — replace Find Vendors with Venue Catalog**

In `src/components/ui-custom/Footer.tsx`, change the Explore link:

Replace:
```tsx
              <Link href="/vendors" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Find Vendors
              </Link>
```

With:
```tsx
              <Link href="/venue" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Venue Catalog
              </Link>
```

- [ ] **Step 3: Update VendorCarousel — change links from /vendors to /venue**

In `src/components/sections/VendorCarousel.tsx`, change line 63:

Replace:
```tsx
                <Link href={`/vendors?category=${label.toLowerCase()}`}>
```

With:
```tsx
                <Link href={`/venue`}>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui-custom/Navbar.tsx src/components/ui-custom/Footer.tsx src/components/sections/VendorCarousel.tsx
git commit -m "feat: replace Find Vendors with Venue Catalog in nav, footer, carousel"
```

---

### Task 9: Build Verification

**Files:**
- None

- [ ] **Step 1: Run Next.js build**

```bash
npx next build 2>&1 | tail -25
```

Expected: Build compiles successfully. Route list should show `/venue` and no `/vendors`.

- [ ] **Step 2: Verify database connection**

```bash
npx prisma db push --accept-data-loss 2>&1
```

Expected: "Your database is now in sync with your schema."

- [ ] **Step 3: Verify API endpoints**

Start dev server (`npm run dev`), then test:

```bash
curl -s http://localhost:3000/api/venues | head -c 200
```

Expected: JSON array of 5 venues.
