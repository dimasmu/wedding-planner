# Contact Us Page — Design Spec

**Date:** 2026-07-03
**Route:** `/contact-us`
**Status:** Approved

---

## Overview

A dedicated Contact Us page for Sola Project (Wedding Organizer) that consolidates all communication channels into one screen. Features a video hero, photo collage background section, two-column contact layout (info + form), FAQ accordion, and social media section.

**Goals:**
- Increase incoming inquiries through the form and direct contact channels
- Provide a structured, easy contact experience with FAQ
- Build trust through visual portfolio (collage), complete contact info, and active social media

---

## Section Order (Page Flow)

1. **Video Hero** — Full-viewport video loop (85vh) with overlay, heading, and WhatsApp CTA
2. **Photo Collage** — Full-width grid of 8 wedding photos as decorative background section
3. **Contact Info + Form** — Two-column on desktop, stacked on mobile
4. **FAQ Accordion** — 5 questions, shadcn Accordion, single-open
5. **Social Media** — Instagram, TikTok, YouTube icons (modeled after About page)

---

## Section Details

### 1. Video Hero (`ContactVideoHero.tsx`)

**New component.** Adapts the pattern from `ServicesHero.tsx` but uses a single looping video.

- **Container:** `h-[85vh] min-h-[600px]`, `relative`, `overflow-hidden`, `bg-brand-dark`
- **Video:** Single `<video>` with `autoPlay muted loop playsInline`, `absolute inset-0 w-full h-full object-cover`
- **Overlays:**
  - `absolute inset-0 bg-brand-dark/60`
  - Radial vignette: `radial-gradient(ellipse 60% 50% at 50% 40%, transparent 0%, rgba(30,30,30,0.35) 70%, rgba(30,30,30,0.7) 100%)`
- **Bottom edge:** Gold gradient line `bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent` height 1px
- **Content (centered, `z-10`):**
  - Heading: "Let's Create Your Dream Wedding" in Playfair serif, large
  - Subtitle: "We'd love to hear from you. Reach out and let's start planning."
  - CTA Button: "Chat via WhatsApp" → `https://wa.me/62xxxxxxxx`
  - Scroll indicator: bouncing dot (matching ServicesHero)
- **Asset:** `public/asset/contact_us/background_video/8503119-uhd_3840_2160_24fps.mp4`
- Client component (`"use client"`) — video event handling

### 2. Photo Collage (`PhotoCollage.tsx`)

**New component.** Full-width decorative background section between video hero and contact area.

- **Layout:**
  - Grid: `grid-cols-2 md:grid-cols-4`, gaps with varied row spans for organic feel
  - 8 photos, each with `aspect-ratio` + `object-cover`
  - Section height not full viewport (content-driven, substantial padding)
- **Overlay:** `absolute inset-0 bg-brand-dark/70` over the grid for readability
- **Content overlay (centered, `z-10`):**
  - Section ornament: gold line + icon + gold line
  - Heading: "Moments We've Created" (Playfair serif)
  - Subtitle: "A glimpse into the weddings we've had the honor of bringing to life"
- **Assets:** 8 JPEGs from `public/asset/contact_us/collage_photo/`
  - `pexels-doouglasma-18541917.jpg`
  - `pexels-framesbygaurav-37380244.jpg`
  - `pexels-juliano-goncalves-1623825-28123495.jpg`
  - `pexels-kayaartsss-14788179.jpg`
  - `pexels-nashkrys-1406374.jpg`
  - `pexels-nguy-n-ti-n-th-nh-2150376175-32459250.jpg`
  - `pexels-photography-maghradze-ph-1659410-29237413.jpg`
  - `pexels-rebornfilmes-35114147.jpg`
- **Tech:** Next.js `<Image>`, lazy loading for all 8 photos
- Wrapped in `<RevealSection>`

### 3. Contact Info + Form — Two-Column Layout

#### Left Column: Contact Info (`ContactInfoSection.tsx`)

**New component.** Displays all direct contact channels.

- **WhatsApp CTA:** WhatsApp icon + "Chat via WhatsApp" text, styled as a prominent button (`bg-brand-gold text-white hover:bg-brand-taupe`), opens `https://wa.me/62xxxxxxxx`
- **Email:** Mail icon + email address, `<a href="mailto:...">` link, `text-brand-taupe hover:text-brand-gold`
- **Address:** Map pin icon + full office address text
- **Social Icons:** Compact row of Instagram, TikTok, YouTube — circle icon buttons, `text-brand-taupe/40 hover:text-brand-gold`
- **Visual:** `bg-white rounded-2xl p-8 shadow-xl`, gold accent on borders
- Wrapped in `<RevealSection>`

#### Right Column: Contact Form (`ContactFormSection.tsx`)

**New component.** Simplified form per PRD — Name, Email, Message only.

- **Fields:**
  - Name — text input, required, non-empty
  - Email — email input, required, valid format
  - Message — textarea, required, minimum 10 characters
- **Validation:** zod schema + react-hook-form
  ```ts
  {
    name: z.string().min(1, "Nama wajib diisi"),
    email: z.string().email("Format email tidak valid"),
    message: z.string().min(10, "Pesan minimal 10 karakter"),
  }
  ```
- **States:**
  - **Idle:** Form ready, "Kirim Pesan" button (gold)
  - **Loading:** Button shows spinner + "Mengirim...", all fields disabled
  - **Success:** Form replaced by success card — "Terima kasih! Pesan Anda sudah kami terima." with "Kirim Pesan Lain" link to reset
  - **Error:** sonner toast notification
- **Submit:** Simulated for now (frontend only). In future, POST to Web3Forms or similar.
- **Components:** shadcn Input, Label, Textarea, Button
- Client component (`"use client"`) — react-hook-form state
- Wrapped in `<RevealSection>`

**Mobile behavior:** Contact info stacks on top, form below. Single column.

### 4. FAQ Accordion (`FAQAccordion.tsx`)

**New component.** Uses shadcn Accordion component.

- **Accordion config:** `type="single" collapsible` (one question open at a time)
- **Layout:** `max-w-3xl mx-auto`
- **Questions:**
  1. "Berapa lama persiapan sebelum acara?" — 3-6 bulan recommended
  2. "Apakah bisa request custom dekorasi?" — Yes, fully custom per client
  3. "Bagaimana cara booking?" — Contact via WhatsApp/form, response within 24h
  4. "Apakah bisa mengunjungi kantor?" — Mon-Fri 09.00-17.00, by appointment
  5. "Berapa biaya paket wedding?" — Custom pricing, free initial consultation
- **Trigger styling:** Playfair serif for question, chevron icon rotates on expand
- **Content styling:** Inter sans for answer text, `text-brand-taupe/70`
- Wrapped in `<RevealSection>`

### 5. Social Media (`ConnectWithUs` section — inline or copied to Contact page)

**Copied from** `src/app/about/page.tsx` "Connect With Us" section, adapted for Contact Us.

- **Background:** `bg-brand-cream`, faint gold radial circle ornament (`opacity-3`)
- **Header:** Ornament line + SparklesIcon + "Connect With Us" heading
- **Subtitle:** "Stay inspired — follow our journey and see the magic we create every day"
- **Icons:** 3-column grid (`grid-cols-3`):
  - Instagram — SVG icon, text label, `hover:text-brand-gold hover:scale-110`
  - TikTok — SVG icon, text label
  - YouTube — SVG icon, text label
- **Card wrapper:** `bg-white/60 backdrop-blur-sm rounded-2xl border border-brand-gold/10 shadow-lg max-w-2xl mx-auto p-10 md:p-14`
- Wrapped in `<RevealSection>`

---

## Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `src/app/contact-us/page.tsx` | Page orchestrator, composes all sections |
| 2 | `src/components/sections/ContactVideoHero.tsx` | Video hero (single looping video) |
| 3 | `src/components/sections/PhotoCollage.tsx` | 8-photo background grid |
| 4 | `src/components/sections/ContactInfoSection.tsx` | WhatsApp, email, address, social icons |
| 5 | `src/components/sections/ContactFormSection.tsx` | Name/Email/Message form |
| 6 | `src/components/sections/FAQAccordion.tsx` | 5-question accordion |

## Files to Modify

| # | File | Change |
|---|------|--------|
| 7 | `src/components/ui-custom/Navbar.tsx` | Add "Contact Us" nav link between Testimonials and Find Vendors in desktop nav + mobile drawer |
| 8 | `src/components/ui-custom/Footer.tsx` | Add "Contact Us" to the Explore links |

---

## Tech Stack

- Next.js 16 App Router (file-based routing, `/contact-us`)
- React 19, TypeScript 5
- Tailwind CSS v4
- shadcn/ui (Button, Input, Label, Textarea, Accordion)
- react-hook-form + @hookform/resolvers + zod v4
- lucide-react (icons)
- motion (framer-motion) via RevealSection wrapper

## Data Flow

- All page content is **static** — defined as constants within page/section files
- Assets loaded from `public/asset/contact_us/`
- Form state managed entirely client-side via react-hook-form
- Submit path: validate → show loading → show success (simulated, no external API)

## States & Edge Cases

| Component | States |
|-----------|--------|
| Video Hero | Loading (video buffering), playing, loop |
| Photo Collage | Images loading (Next/Image blur-up or skeleton) |
| Contact Form | Idle, validating (field-level errors), loading (submitting), success, error toast |
| FAQ Accordion | All closed (initial), one expanded, expand/collapse animation |
| Social Media | Static (no loading states needed) |
| Mobile | Single column everywhere; video hero shorter; collage 1-col; nav in drawer |

## Not In Scope

- Backend form submission (future: Web3Forms or Formspree)
- Admin dashboard integration
- Lightbox for collage photos
- Google Maps embed for address
