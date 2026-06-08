# Cetak Biru Implementasi: Rekonstruksi Platform Perencana Pernikahan (Sola-Inspired)

Dokumen ini berisi arsitektur siap pakai, konfigurasi gaya desain, serta instruksi implementasi langkah-demi-langkah berdasarkan PRD yang telah Anda buat. Gunakan ini sebagai referensi utama tim pengembang frontend Anda.

---

## 📅 Roadmap & Checklist Mingguan

### Fase 1: Fondasi Proyek & Landing Page (Minggu 1)
- [ ] **Setup Proyek & Tailwind:**
  - [ ] Inisialisasi Next.js (`npx create-next-app@latest --typescript --tailwind --eslint`)
  - [ ] Inisialisasi shadcn/ui (`npx shadcn-ui@latest init`)
  - [ ] Siapkan palet warna "Warm Chic & Elegant" di `tailwind.config.js`
- [ ] **Struktur Dasar & Layout:**
  - [ ] Bangun komponen `Navbar` global (responsif dengan blur backdrop & submenu dinamis).
  - [ ] Bangun `Footer` global dengan input newsletter.
- [ ] **Landing Page (Halaman Utama):**
  - [ ] Hero Section dengan slideshow transisi mulus (Framer Motion).
  - [ ] How It Works Section menggunakan grid `Card`.
  - [ ] Vendor Categories dengan `Carousel` modern.
  - [ ] Testimonials Carousel.
  - [ ] Pricing Sheet (3 Tiers).

### Fase 2: Marketplace Vendor & Autentikasi (Minggu 2)
- [ ] **Sistem Autentikasi:**
  - [ ] Desain halaman `/login` dan `/register` menggunakan shadcn `Tabs` dan `Form` + validasi Zod.
- [ ] **Manajemen Grid Vendor:**
  - [ ] Buat UI filter yang kolapsibel di desktop dan berupa laci (`Sheet`) di mobile.
  - [ ] Buat layout grid responsif untuk kartu vendor dengan transisi hover lift.
- [ ] **Interaktivitas Detail Vendor:**
  - [ ] Terapkan dialog detail vendor (`Dialog` shadcn) ketika kartu diklik.
  - [ ] Pasang formulir *Request Quote* di dalam dialog detail vendor dengan popup notifikasi toast saat dikirim.

### Fase 3: Dashboard Client & Alat Perencana (Minggu 3)
- [ ] **Layout Dashboard:**
  - [ ] Layout dashboard khusus client dengan navigasi samping (sidebar) yang adaptif di mobile menggunakan hamburger menu.
- [ ] **Fitur Checklist Pernikahan:**
  - [ ] Integrasikan progress bar di bagian atas dashboard client.
  - [ ] Hubungkan checkbox tugas dengan state global (Zustand/React Query) sehingga status progres terperbarui secara instan.
- [ ] **Alat Pelacak Anggaran (Budget Tracker):**
  - [ ] Visualisasikan alokasi anggaran dengan grafis pai menggunakan `recharts`.
  - [ ] Siapkan form input pengeluaran real-time.
- [ ] **Guest List Tracker:**
  - [ ] Buat tabel tamu interaktif dengan penyaringan status RSVP (Hadir/Tidak/Pending).

### Fase 4: Dashboard Vendor & Finishing (Minggu 4)
- [ ] **Dashboard Pengelola Vendor:**
  - [ ] Bangun halaman profil edit porto komprehensif.
  - [ ] Integrasikan tabel manajemen *Booking Requests* dengan label badge warna-warni berdasarkan status pemesanan.
- [ ] **Optimasi & Penyelesaian Akhir:**
  - [ ] Terapkan transisi halaman menggunakan Framer Motion.
  - [ ] Optimasi LCP & CLS gambar memakai `next/image` dengan aspek rasio tetap.
  - [ ] Lakukan uji coba ramah disabilitas (A11y) dan audit skor Lighthouse.

---

## 🎨 Konfigurasi Gaya Desain Sola-Inspired Theme (`tailwind.config.js`)

Palet warna Sola Project sangat menekankan nuansa hangat, mewah, tak lekang waktu (warm cream, soft taupe, dan gold-bronze). Berikut adalah modifikasi konfigurasi Tailwind CSS agar sesuai dengan estetika tersebut:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        brand: {
          cream: "#FDFBF7",      // Warna latar belakang utama yang hangat dan bersih
          taupe: "#4A3E3D",      // Warna teks tajam & aksen gelap
          gold: "#D3A27F",       // Warna aksen sekunder/sorotan (hover, tombol utama)
          sand: "#F5EFEB",       // Warna latar belakang grid ringan
          dark: "#1E1E1E",       // Warna teks gelap primer
        },
        primary: {
          DEFAULT: "var(--primary-gold)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "#4A3E3D",
          foreground: "#FDFBF7",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F5EFEB",
          foreground: "#706E6B",
        },
        accent: {
          DEFAULT: "#D3A27F",
          foreground: "#4A3E3D",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"], // Kombinasi Serif mewah untuk judul
        sans: ["var(--font-inter)", "sans-serif"], // Sans-serif bersih untuk keterbacaan tinggi
      },
    },
  },
}
```

---

## 🔑 Arsitektur Komponen Pilihan

### 1. Komponen Navbar Responsif (`/components/ui-custom/Navbar.tsx`)
Komponen ini mengombinasikan `NavigationMenu` untuk desktop dan `Sheet` (Drawer) untuk interaksi mobile.

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
      <div className="container flex h-16 items-center justify-between">
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
            <Button variant="ghost" className="text-brand-taupe hover:text-brand-gold">Login</Button>
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
                <Link href="/vendors" className="font-serif text-lg text-brand-taupe">Find Vendors</Link>
                <Link href="/inspiration" className="font-serif text-lg text-brand-taupe">Inspiration</Link>
                <Link href="/pricing" className="font-serif text-lg text-brand-taupe">Pricing</Link>
                <hr className="border-brand-sand" />
                <Link href="/login" className="font-serif text-lg text-brand-taupe">Login</Link>
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

### 2. State & UI Checklist Pernikahan (`/components/wedding/ChecklistContainer.tsx`)
Penerapan Zustand modern dikombinasikan dengan shadcn/ui Card dan Checkbox untuk menggerakkan indikator penyusunan rencana pernikahan secara otomatis.

**Definisi State Store (Zustand):**
```typescript
// /lib/store/useChecklistStore.ts
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

export const useChecklistStore = create<ChecklistState>((set, get) => ({
  tasks: [
    { id: "1", title: "Tentukan Anggaran Maksimal Pernikahan", completed: true, dueDate: "12 bln sebelum", category: "Planning" },
    { id: "2", title: "Pilih & Amankan Lokasi Gedung (Venue)", completed: false, dueDate: "10 bln sebelum", category: "Venue" },
    { id: "3", title: "Mulai Memilih Vendor Fotografi & Videografi", completed: false, dueDate: "9 bln sebelum", category: "Vendors" },
    { id: "4", title: "Fitting Baju Akad & Resepsi", completed: false, dueDate: "6 bln sebelum", category: "Attire" },
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

**Komponen Interface UI Dashboard Checklist:**
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
          <span>Progres Perencanaan Anda</span>
          <span className="text-brand-gold font-sans">{percentage}%</span>
        </CardTitle>
        <CardDescription>Buka dan selesaikan tenggat waktu langkah demi langkah menuju hari bahagia.</CardDescription>
        <Progress value={percentage} className="h-2 bg-brand-sand [&>div]:bg-brand-gold mt-4" />
      </CardHeader>
      <CardContent className="mt-4 flex flex-col gap-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start justify-between p-4 rounded-lg border transition-all ${
              task.completed 
                ? "bg-brand-cream/40 border-slate-100 opacity-60 line-through" 
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
                  className="font-medium text-brand-taupe cursor-pointer text-sm leading-none"
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

---

## 🚀 Panduan Kinerja & SEO
Guna menjamin perolehan skor tinggi (Core Web Vitals > 90) sesuai kebutuhan PRD Anda:

1. **LCP Optimization:** Hindari *lazy-loading* pada media di atas lipatan layar (*above-the-fold*). Pasang properti `priority` pada *hero banner*:
   ```tsx
   <Image 
     src="/images/hero-wedding.jpg"
     alt="Dream Wedding Inspiration"
     fill
     priority // Mencegah keterlambatan render LCP
     className="object-cover"
   />
   ```
2. **Metadata Dinamis:** Terapkan API metadata bawaan Next.js 14 di `/app/vendors/[id]/page.tsx` untuk kemudahan perayapan (crawler) SEO:
   ```typescript
   import { Metadata } from 'next'
   
   export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
     // Ambil data vendor
     const vendor = await getVendorDetail(params.id)
     return {
       title: `${vendor.name} - Vendor Pernikahan Profesional | Sola Planner`,
       description: `Pesan jasa ${vendor.name} di ${vendor.location}. Paket mulai dari ${vendor.priceFrom}.`,
     }
   }
   ```