# Contact Us Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full Contact Us page at `/contact-us` with video hero, photo collage, two-column contact layout (info + form), FAQ accordion, and social media section.

**Architecture:** Six new section components composed in a single page file. ContactFormSection uses react-hook-form + zod for validation with simulated submission (no backend). Navbar and Footer get a new "Contact Us" link.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui (Button, Input, Label, Textarea, Accordion), react-hook-form + zod v4, lucide-react, motion (framer-motion via RevealSection)

---

### Task 1: ContactVideoHero Component

**Files:**
- Create: `src/components/sections/ContactVideoHero.tsx`

- [ ] **Step 1: Create ContactVideoHero component**

Write `src/components/sections/ContactVideoHero.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

export function ContactVideoHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-brand-dark">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/asset/contact_us/background_video/8503119-uhd_3840_2160_24fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-dark/60" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, transparent 0%, rgba(30,30,30,0.35) 70%, rgba(30,30,30,0.7) 100%)",
        }}
      />

      {/* Gold gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-12 bg-brand-gold/40" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-brand-gold/70 font-medium">
            Get in Touch
          </span>
          <div className="h-px w-12 bg-brand-gold/40" />
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6 max-w-4xl tracking-tight">
          Let&rsquo;s Create Your Dream Wedding
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed">
          We&rsquo;d love to hear from you. Reach out and let&rsquo;s start planning.
        </p>

        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 text-base px-8 py-6 rounded-md">
            Chat via WhatsApp &rarr;
          </Button>
        </a>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="w-6 h-10 rounded-full border-2 border-white/15 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-brand-gold/60 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/ContactVideoHero.tsx
git commit -m "feat: add ContactVideoHero component with looping video"
```

---

### Task 2: PhotoCollage Component

**Files:**
- Create: `src/components/sections/PhotoCollage.tsx`

- [ ] **Step 1: Create PhotoCollage component**

Write `src/components/sections/PhotoCollage.tsx`:

```tsx
import Image from "next/image";

const photos = [
  "pexels-doouglasma-18541917.jpg",
  "pexels-framesbygaurav-37380244.jpg",
  "pexels-juliano-goncalves-1623825-28123495.jpg",
  "pexels-kayaartsss-14788179.jpg",
  "pexels-nashkrys-1406374.jpg",
  "pexels-nguy-n-ti-n-th-nh-2150376175-32459250.jpg",
  "pexels-photography-maghradze-ph-1659410-29237413.jpg",
  "pexels-rebornfilmes-35114147.jpg",
] as const;

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

export function PhotoCollage() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-brand-dark">
      {/* Photo grid background */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-0">
        {/* Row 1 */}
        <div className="relative row-span-2">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[0]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[1]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative row-span-2">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[2]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[3]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        {/* Row 2 */}
        <div className="relative row-span-2">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[4]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative row-span-2">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[5]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[6]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[7]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-brand-dark/70" />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-brand-gold/40" />
          <SparklesIcon className="w-4 h-4 text-brand-gold" />
          <div className="h-px w-8 bg-brand-gold/40" />
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">
          Moments We&rsquo;ve Created
        </h2>
        <p className="text-white/60 text-lg max-w-md mx-auto font-light">
          A glimpse into the weddings we&rsquo;ve had the honor of bringing to life
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/PhotoCollage.tsx
git commit -m "feat: add PhotoCollage component with 8-photo background grid"
```

---

### Task 3: ContactInfoSection Component

**Files:**
- Create: `src/components/sections/ContactInfoSection.tsx`

- [ ] **Step 1: Create ContactInfoSection component**

Write `src/components/sections/ContactInfoSection.tsx`:

```tsx
import { MessageCircle, Mail, MapPin } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

export function ContactInfoSection() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-brand-gold/10">
      <h3 className="font-serif text-2xl text-brand-taupe mb-6">
        Contact Information
      </h3>

      {/* WhatsApp */}
      <a
        href="https://wa.me/6281234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors duration-300 mb-5 group"
      >
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="font-medium text-brand-taupe">Chat via WhatsApp</p>
          <p className="text-sm text-brand-taupe/60">+62 812-3456-7890</p>
        </div>
      </a>

      {/* Email */}
      <a
        href="mailto:hello@solaplanner.com"
        className="flex items-center gap-4 p-4 rounded-xl hover:bg-brand-sand/50 transition-colors duration-300 mb-2 group"
      >
        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold/20 transition-colors duration-300">
          <Mail className="w-5 h-5 text-brand-gold" />
        </div>
        <div>
          <p className="font-medium text-brand-taupe">Email Us</p>
          <p className="text-sm text-brand-taupe/60">hello@solaplanner.com</p>
        </div>
      </a>

      {/* Address */}
      <div className="flex items-start gap-4 p-4 rounded-xl mb-6">
        <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-brand-gold" />
        </div>
        <div>
          <p className="font-medium text-brand-taupe mb-1">Visit Our Office</p>
          <p className="text-sm text-brand-taupe/60 leading-relaxed">
            Jl. Sudirman No. 123, Suite 456<br />
            Jakarta Selatan, 12190<br />
            Indonesia
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-brand-sand/50 mb-6" />

      {/* Social icons */}
      <p className="text-sm text-brand-taupe/60 mb-4">Follow Us</p>
      <div className="flex items-center gap-4">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="w-10 h-10 rounded-full border border-brand-sand flex items-center justify-center text-brand-taupe/50 hover:text-brand-gold hover:border-brand-gold/30 hover:scale-110 transition-all duration-300"
          >
            {social.icon}
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/ContactInfoSection.tsx
git commit -m "feat: add ContactInfoSection with WhatsApp, email, address, social icons"
```

---

### Task 4: ContactFormSection Component

**Files:**
- Create: `src/components/sections/ContactFormSection.tsx`

- [ ] **Step 1: Create ContactFormSection component**

Write `src/components/sections/ContactFormSection.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactFormSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    setStatus("loading");
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("success");
  };

  const handleReset = () => {
    setStatus("idle");
    reset();
  };

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-brand-gold/10 flex flex-col items-center justify-center text-center min-h-[400px]">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h3 className="font-serif text-2xl text-brand-taupe mb-2">
          Terima kasih!
        </h3>
        <p className="text-brand-taupe/60 mb-6">
          Pesan Anda sudah kami terima. Tim kami akan menghubungi Anda dalam
          1x24 jam.
        </p>
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-brand-gold/30 text-brand-taupe hover:bg-brand-gold/5"
        >
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-brand-gold/10">
      <h3 className="font-serif text-2xl text-brand-taupe mb-6">
        Send Us a Message
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-brand-taupe">
            Nama <span className="text-red-400">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Nama lengkap Anda"
            {...register("name")}
            className={cn(
              "mt-1.5 bg-brand-cream border-brand-sand text-brand-taupe placeholder:text-brand-taupe/40",
              errors.name && "border-red-400 focus-visible:ring-red-400"
            )}
          />
          {errors.name && (
            <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-brand-taupe">
            Email <span className="text-red-400">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="email@anda.com"
            {...register("email")}
            className={cn(
              "mt-1.5 bg-brand-cream border-brand-sand text-brand-taupe placeholder:text-brand-taupe/40",
              errors.email && "border-red-400 focus-visible:ring-red-400"
            )}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <Label htmlFor="message" className="text-brand-taupe">
            Pesan <span className="text-red-400">*</span>
          </Label>
          <textarea
            id="message"
            rows={5}
            placeholder="Ceritakan tentang acara yang ingin Anda rencanakan..."
            {...register("message")}
            className={cn(
              "mt-1.5 flex w-full rounded-md border bg-brand-cream px-3 py-2 text-sm text-brand-taupe placeholder:text-brand-taupe/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              errors.message
                ? "border-red-400 focus-visible:ring-red-400"
                : "border-brand-sand focus-visible:ring-brand-gold/30"
            )}
          />
          {errors.message && (
            <p className="text-red-400 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 py-6 text-base rounded-md"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Mengirim...
            </>
          ) : (
            "Kirim Pesan"
          )}
        </Button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/ContactFormSection.tsx
git commit -m "feat: add ContactFormSection with react-hook-form + zod validation"
```

---

### Task 5: FAQAccordion Component

**Files:**
- Create: `src/components/sections/FAQAccordion.tsx`

- [ ] **Step 1: Create FAQAccordion component**

Write `src/components/sections/FAQAccordion.tsx`:

```tsx
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "q1",
    question: "Berapa lama persiapan sebelum acara?",
    answer:
      "Kami merekomendasikan booking minimal 3-6 bulan sebelum hari H untuk memastikan semua detail tertata dengan sempurna. Timeline bisa lebih fleksibel tergantung skala acara Anda.",
  },
  {
    id: "q2",
    question: "Apakah bisa request custom dekorasi?",
    answer:
      "Tentu! Setiap dekorasi kami desain khusus sesuai tema dan keinginan Anda. Tidak ada paket yang benar-benar sama — visi Anda adalah prioritas kami.",
  },
  {
    id: "q3",
    question: "Bagaimana cara booking?",
    answer:
      "Hubungi kami via WhatsApp atau isi form di halaman ini. Tim kami akan merespons dalam 1x24 jam untuk konsultasi awal gratis.",
  },
  {
    id: "q4",
    question: "Apakah bisa mengunjungi kantor?",
    answer:
      "Bisa! Kantor kami buka Senin-Jumat pukul 09.00-17.00 WIB. Sebaiknya buat janji dulu via WhatsApp agar tim kami siap menyambut Anda.",
  },
  {
    id: "q5",
    question: "Berapa biaya paket wedding?",
    answer:
      "Setiap pernikahan unik, jadi biaya disesuaikan dengan kebutuhan dan skala acara Anda. Konsultasi awal gratis — kami akan bantu susun estimasi yang sesuai budget Anda tanpa tekanan.",
  },
];

function SectionOrnament() {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <div className="h-px w-8 bg-brand-gold/40" />
      <HelpCircle className="w-4 h-4 text-brand-gold" />
      <div className="h-px w-8 bg-brand-gold/40" />
    </div>
  );
}

export function FAQAccordion() {
  return (
    <section className="py-28 bg-brand-cream">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <SectionOrnament />
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-brand-taupe/60 max-w-md mx-auto">
            Ada pertanyaan? Kami punya jawabannya
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              id={faq.id}
              className="bg-white rounded-xl border border-brand-sand/50 shadow-sm overflow-hidden not-last:border-b not-last:border-brand-sand/50"
            >
              <AccordionTrigger className="px-6 py-5 font-serif text-base md:text-lg text-brand-taupe text-left hover:no-underline hover:bg-brand-sand/30 transition-colors duration-200 data-[slot=accordion-trigger-icon]:text-brand-gold data-[slot=accordion-trigger-icon]:size-5 cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-6 pb-5 text-brand-taupe/70 text-sm md:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sections/FAQAccordion.tsx
git commit -m "feat: add FAQAccordion component with 5 questions"
```

---

### Task 6: Contact Us Page Orchestrator

**Files:**
- Create: `src/app/contact-us/page.tsx`

- [ ] **Step 1: Create the page file**

Write `src/app/contact-us/page.tsx`:

```tsx
import { ContactVideoHero } from "@/components/sections/ContactVideoHero";
import { PhotoCollage } from "@/components/sections/PhotoCollage";
import { ContactInfoSection } from "@/components/sections/ContactInfoSection";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { RevealSection } from "@/components/ui-custom/RevealSection";
import Link from "next/link";

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

export default function ContactUsPage() {
  return (
    <>
      {/* 1. Video Hero */}
      <ContactVideoHero />

      {/* 2. Photo Collage */}
      <RevealSection>
        <PhotoCollage />
      </RevealSection>

      {/* 3. Contact Info + Form — Two Columns */}
      <section className="py-28 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <RevealSection>
              <ContactInfoSection />
            </RevealSection>
            <RevealSection delay={100}>
              <ContactFormSection />
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 4. FAQ Accordion */}
      <RevealSection>
        <FAQAccordion />
      </RevealSection>

      {/* 5. Social Media — Connect With Us */}
      <RevealSection>
        <section className="py-32 md:py-40 bg-brand-cream relative overflow-hidden">
          {/* Background ornament */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.03]"
            style={{
              background:
                "radial-gradient(circle, rgb(211 162 127) 0%, transparent 70%)",
            }}
          />

          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <RevealSection>
              <div className="text-center mb-20">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-8 bg-brand-gold/40" />
                  <SparklesIcon className="w-4 h-4 text-brand-gold" />
                  <div className="h-px w-8 bg-brand-gold/40" />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe mb-4">
                  Connect With Us
                </h2>
                <p className="text-brand-taupe/70 text-lg font-light max-w-md mx-auto">
                  Stay inspired — follow our journey and see the magic we create every day
                </p>
              </div>
            </RevealSection>

            <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl border border-brand-gold/10 shadow-lg shadow-brand-gold/5 p-10 md:p-14">
              <div className="grid grid-cols-3 gap-6 md:gap-10">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex flex-col items-center gap-1.5 text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                  >
                    {social.icon}
                    <span className="text-[10px] tracking-[0.15em] uppercase">
                      {social.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/contact-us/page.tsx
git commit -m "feat: add Contact Us page with video hero, collage, form, FAQ, social"
```

---

### Task 7: Add Contact Us to Navbar

**Files:**
- Modify: `src/components/ui-custom/Navbar.tsx`

- [ ] **Step 1: Add Contact Us link in desktop navigation menu**

In `src/components/ui-custom/Navbar.tsx`, locate the Testimonials `NavigationMenuItem` (around line 48-52) and insert Contact Us after it:

```tsx
            <NavigationMenuItem>
              <Link href="/testimoni" className={navigationMenuTriggerStyle()}>
                Testimonials
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/contact-us" className={navigationMenuTriggerStyle()}>
                Contact Us
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/vendors" className={navigationMenuTriggerStyle()}>
                Find Vendors
              </Link>
            </NavigationMenuItem>
```

- [ ] **Step 2: Add Contact Us link in mobile navigation drawer**

In the same file, locate the mobile Testimonials link (around line 103-105) and insert Contact Us after it:

```tsx
                <Link href="/testimoni" className="font-serif text-lg text-brand-taupe">
                  Testimonials
                </Link>
                <Link href="/contact-us" className="font-serif text-lg text-brand-taupe">
                  Contact Us
                </Link>
                <Link href="/vendors" className="font-serif text-lg text-brand-taupe">
                  Find Vendors
                </Link>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui-custom/Navbar.tsx
git commit -m "feat: add Contact Us link to navbar (desktop + mobile)"
```

---

### Task 8: Add Contact Us to Footer

**Files:**
- Modify: `src/components/ui-custom/Footer.tsx`

- [ ] **Step 1: Add Contact Us link to footer Explore section**

In `src/components/ui-custom/Footer.tsx`, locate the Explore links nav (around lines 29-42) and add the Contact Us link:

```tsx
            <nav className="flex flex-col gap-2">
              <Link href="/contact-us" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Contact Us
              </Link>
              <Link href="/vendors" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Find Vendors
              </Link>
              <Link href="/inspiration" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Inspiration
              </Link>
              <Link href="/services" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Services
              </Link>
              <Link href="/pricing" className="text-sm text-brand-cream/60 hover:text-brand-gold transition-colors">
                Pricing
              </Link>
            </nav>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui-custom/Footer.tsx
git commit -m "feat: add Contact Us link to footer Explore section"
```

---

### Task 9: Build Verification

**Files:**
- None

- [ ] **Step 1: Run the Next.js dev server and check for build errors**

```bash
npx next build 2>&1 | tail -30
```

Expected: Build compiles successfully with no TypeScript errors. The `/contact-us` route should be generated.

- [ ] **Step 2: Verify the page renders**

Start the dev server and navigate to `http://localhost:3000/contact-us`. Confirm:
- Video hero section loads and plays on loop
- Photo collage section renders all 8 photos with overlay
- Two-column layout: contact info on left, form on right
- FAQ accordion opens/closes on click
- Social media section renders at bottom with 3 icons
- Navbar shows "Contact Us" between Testimonials and Find Vendors
- Footer shows "Contact Us" in Explore section
