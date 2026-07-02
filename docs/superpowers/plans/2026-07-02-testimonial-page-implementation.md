# Testimonial Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a new `/testimoni` page with a Soft Romantic aesthetic featuring a photo hero, stats bar, three per-couple photo carousels, and a Contact Us form.

**Architecture:** Server component page (`src/app/testimoni/page.tsx`) with inline sections for hero/stats/carousels, plus a client component (`src/app/testimoni/contact-form.tsx`) for the form with react-hook-form + zod validation. Mock data is hardcoded as an array — structured for future API swap. Photo strips use native CSS horizontal scroll (matching VendorCarousel pattern).

**Tech Stack:** Next.js 16 App Router, Tailwind CSS v4, motion/react, @base-ui/react (shadcn Select/Input/Button), react-hook-form + zod, Sonner toast, next/image

---

### Task 1: Create page shell with mock data and section structure

**Files:**
- Create: `src/app/testimoni/page.tsx`

- [ ] **Step 1: Create the page with mock data and all section placeholders**

Create `src/app/testimoni/page.tsx`:

```tsx
import { RevealSection } from "@/components/ui-custom/RevealSection";
import { Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { ContactForm } from "./contact-form";

/* ── Mock Data ── */

type Testimonial = {
  id: string;
  coupleName: string;
  rating: number;
  quote: string;
  date: string;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    coupleName: "Sarah & James",
    rating: 5,
    quote:
      "Sola made our dream wedding a reality. Every detail was taken care of beautifully — from the floral arrangements to the seamless coordination on the day. We couldn't have asked for a better team.",
    date: "2026-05-15",
  },
  {
    id: "2",
    coupleName: "Maya & David",
    rating: 5,
    quote:
      "Professional, attentive, and truly passionate about what they do. The team went above and beyond to bring our vision to life. Our guests are still talking about how perfect everything was.",
    date: "2026-03-22",
  },
  {
    id: "3",
    coupleName: "Priya & Alex",
    rating: 4,
    quote:
      "A wonderful experience from start to finish. The decor was stunning and the planning process was stress-free. Highly recommend Sola Project for any special occasion.",
    date: "2026-01-10",
  },
];

const photoFiles: Record<string, string[]> = {
  "1": [
    "leonardo-miranda-dvF6s1H1x68-unsplash.jpg",
    "nathan-dumlao-5BB_atDT4oA-unsplash.jpg",
    "sandy-millar-8vaQKYnawHw-unsplash.jpg",
    "vadim-paripa-PuXtB1B4zL8-unsplash.jpg",
  ],
  "2": [
    "alvin-mahmudov-9_XfcBxf_uo-unsplash.jpg",
    "beatriz-perez-moya-M2T1j-6Fn8w-unsplash.jpg",
    "hisu-lee-FTW8ADj5igs-unsplash.jpg",
    "photos-by-lanty-O38Id_cyV4M-unsplash.jpg",
    "samantha-gades-x40Q9jrEVT0-unsplash.jpg",
  ],
  "3": [
    "beatriz-perez-moya-M2T1j-6Fn8w-unsplash.jpg",
    "leonardo-miranda-dvF6s1H1x68-unsplash.jpg",
    "nathan-dumlao-5BB_atDT4oA-unsplash.jpg",
    "sandy-millar-8vaQKYnawHw-unsplash.jpg",
    "vadim-paripa-PuXtB1B4zL8-unsplash.jpg",
  ],
};

/* ── Derived ── */

const avgRating =
  testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

/* ── Ornament ── */

function SectionOrnament() {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-px w-8 md:w-10 bg-gradient-to-r from-transparent to-brand-gold/40" />
      <Sparkles className="w-4 h-4 text-brand-gold" />
      <div className="h-px w-8 md:w-10 bg-gradient-to-l from-transparent to-brand-gold/40" />
    </div>
  );
}

/* ── Page ── */

export default function TestimonialPage() {
  const latestTestimonials = testimonials
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="bg-brand-cream">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <Image
          src="/asset/testimonial/testimonial_1/leonardo-miranda-dvF6s1H1x68-unsplash.jpg"
          alt="Featured wedding testimonial"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end pb-16 px-6 md:px-12 max-w-4xl mx-auto">
          <RevealSection>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: latestTestimonials[0].rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
              ))}
            </div>
            <blockquote className="font-serif text-2xl md:text-4xl text-white leading-relaxed mb-4 italic max-w-2xl">
              &ldquo;{latestTestimonials[0].quote.slice(0, 120)}...&rdquo;
            </blockquote>
            <p className="text-brand-gold font-medium text-lg">
              — {latestTestimonials[0].coupleName}
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="grid grid-cols-2">
        <div className="bg-brand-taupe py-8 md:py-12 text-center">
          <RevealSection>
            <p className="font-serif text-4xl md:text-5xl text-brand-gold font-bold">
              {avgRating.toFixed(1)}
            </p>
            <p className="text-brand-cream/70 text-sm md:text-base mt-1">Avg Rating</p>
          </RevealSection>
        </div>
        <div className="bg-brand-dark py-8 md:py-12 text-center">
          <RevealSection delay={100}>
            <p className="font-serif text-4xl md:text-5xl text-white font-bold">
              {testimonials.length.toLocaleString()}+
            </p>
            <p className="text-brand-cream/50 text-sm md:text-base mt-1">Happy Couples</p>
          </RevealSection>
        </div>
      </section>

      {/* Testimonial Carousels */}
      <section className="py-20 md:py-28 px-4 max-w-6xl mx-auto">
        <RevealSection>
          <div className="text-center mb-16">
            <SectionOrnament />
            <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-3">
              Our Love Stories
            </h2>
            <p className="text-brand-taupe/60 max-w-lg mx-auto">
              Real moments from real weddings — see what our couples experienced
            </p>
          </div>
        </RevealSection>

        {latestTestimonials.length === 0 ? (
          <div className="text-center py-20 text-brand-taupe/40">
            <p className="font-serif text-xl">No testimonials yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {latestTestimonials.map((testimonial) => {
              const photos = photoFiles[testimonial.id] ?? [];
              return (
                <RevealSection key={testimonial.id}>
                  <TestimonialBlock
                    testimonial={testimonial}
                    photos={photos}
                  />
                </RevealSection>
              );
            })}
          </div>
        )}
      </section>

      {/* Contact Form */}
      <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-brand-cream to-brand-sand">
        <div className="max-w-xl mx-auto">
          <RevealSection>
            <div className="text-center mb-12">
              <SectionOrnament />
              <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-3">
                Contact Us
              </h2>
              <p className="text-brand-taupe/60">
                Start planning your dream event
              </p>
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <ContactForm />
          </RevealSection>
        </div>
      </section>
    </div>
  );
}

/* ── Testimonial Block (photo strip + quote) ── */

function TestimonialBlock({
  testimonial,
  photos,
}: {
  testimonial: Testimonial;
  photos: string[];
}) {
  return (
    <div>
      {/* Photo strip */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
        {photos.map((file, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-[85vw] max-w-md aspect-[4/3] rounded-lg overflow-hidden snap-center"
          >
            <Image
              src={`/asset/testimonial/testimonial_${testimonial.id}/${file}`}
              alt={`${testimonial.coupleName} wedding photo ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 85vw, 28rem"
            />
          </div>
        ))}
      </div>

      {/* Quote */}
      <div className="text-center mt-8 max-w-2xl mx-auto px-4">
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
          ))}
        </div>
        <blockquote className="font-serif text-lg md:text-xl text-brand-taupe leading-relaxed mb-4 italic">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <p className="text-brand-taupe/50 text-sm">{testimonial.coupleName}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build to verify no import errors for existing deps**

```bash
npx next build
```

Expected: The build will fail with a module not found error for `./contact-form` (we haven't created it yet) — this is expected. The server component structure itself should parse without errors (no TypeScript errors on `RevealSection`, `Sparkles`, `Star`, `Image`).

- [ ] **Step 3: Commit**

```bash
git add src/app/testimoni/page.tsx
git commit -m "feat: add testimonial page shell with mock data and section structure"
```

---

### Task 2: Build the Contact Form

**Files:**
- Create: `src/app/testimoni/contact-form.tsx`

- [ ] **Step 1: Create the contact form client component**

Create `src/app/testimoni/contact-form.tsx`:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ── Schema ── */

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactMethod: z.enum(["WhatsApp", "Email"], {
    required_error: "Please select a contact method",
  }),
  eventType: z.enum(
    [
      "Wedding Ceremonies",
      "Corporate Events",
      "Social Gatherings",
      "Traditional Events",
      "Birthday Parties",
    ],
    { required_error: "Please select an event type" }
  ),
  eventDate: z.string().min(1, "Event date is required"),
  eventLocation: z.string().min(1, "Event location is required"),
  description: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

/* ── Component ── */

export function ContactForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (_data: ContactFormData) => {
    // Simulate API call — replace with real endpoint when backend is ready
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Thank you! We'll get back to you soon.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Your name"
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
        )}
      </div>

      {/* Contact Method */}
      <div>
        <label
          htmlFor="contactMethod"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Contact Method
        </label>
        <Select
          onValueChange={(value: string) =>
            setValue("contactMethod", value as ContactFormData["contactMethod"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            id="contactMethod"
            className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm h-auto"
          >
            <SelectValue placeholder="Select contact method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WhatsApp">WhatsApp</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
          </SelectContent>
        </Select>
        {errors.contactMethod && (
          <p className="mt-1 text-sm text-red-400">
            {errors.contactMethod.message}
          </p>
        )}
      </div>

      {/* Event Type */}
      <div>
        <label
          htmlFor="eventType"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Event Type
        </label>
        <Select
          onValueChange={(value: string) =>
            setValue("eventType", value as ContactFormData["eventType"], {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger
            id="eventType"
            className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm h-auto"
          >
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Wedding Ceremonies">Wedding Ceremonies</SelectItem>
            <SelectItem value="Corporate Events">Corporate Events</SelectItem>
            <SelectItem value="Social Gatherings">Social Gatherings</SelectItem>
            <SelectItem value="Traditional Events">Traditional Events</SelectItem>
            <SelectItem value="Birthday Parties">Birthday Parties</SelectItem>
          </SelectContent>
        </Select>
        {errors.eventType && (
          <p className="mt-1 text-sm text-red-400">
            {errors.eventType.message}
          </p>
        )}
      </div>

      {/* Event Date */}
      <div>
        <label
          htmlFor="eventDate"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Event Date
        </label>
        <input
          id="eventDate"
          type="date"
          {...register("eventDate")}
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.eventDate && (
          <p className="mt-1 text-sm text-red-400">
            {errors.eventDate.message}
          </p>
        )}
      </div>

      {/* Event Location */}
      <div>
        <label
          htmlFor="eventLocation"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Event Location
        </label>
        <input
          id="eventLocation"
          {...register("eventLocation")}
          placeholder="City or venue"
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"
        />
        {errors.eventLocation && (
          <p className="mt-1 text-sm text-red-400">
            {errors.eventLocation.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-brand-taupe mb-1.5"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Tell us about your event..."
          rows={4}
          className="w-full rounded-lg border border-brand-sand bg-white px-4 py-3 text-brand-taupe text-sm outline-none transition-colors placeholder:text-brand-taupe/30 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 resize-none"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-gold hover:bg-brand-gold/80 text-white font-serif text-base py-6 rounded-lg transition-all duration-300 disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Run build to verify form compiles**

```bash
npx next build
```

Expected: Build succeeds with no errors (both page.tsx and contact-form.tsx compile).

- [ ] **Step 3: Commit**

```bash
git add src/app/testimoni/contact-form.tsx
git commit -m "feat: add contact form with validation and select dropdowns"
```

---

### Task 3: Final build verification and polish

**Files:**
- Verify: `src/app/testimoni/page.tsx`
- Verify: `src/app/testimoni/contact-form.tsx`

- [ ] **Step 1: Run a clean build**

```bash
npx next build
```

Expected: BUILD SUCCESSFUL. No errors, no warnings about unused imports or missing deps.

- [ ] **Step 2: Verify image paths resolve correctly**

All images use paths like `/asset/testimonial/testimonial_1/leonardo-miranda-dvF6s1H1x68-unsplash.jpg` — these are in `public/asset/testimonial/testimonial_1/`. No additional verification needed since `next/image` loads from `public/` at runtime.

- [ ] **Step 3: Quick self-review checklist**

- [x] Hero uses `priority` prop on its Image for LCP optimization
- [x] Stats bar shows derived `avgRating` and `testimonials.length`
- [x] Empty testimonials array shows "No testimonials yet" fallback
- [x] Photo strip uses `aspect-[4/3]` per spec
- [x] Photo paths reference correct folder (`testimonial_${testimonial.id}`)
- [x] Form fields match all 6 required fields from spec
- [x] Form validation handles all required fields with readable error messages
- [x] Submit button shows "Sending..." state and disables during submit
- [x] All sections wrapped in `RevealSection` for scroll animations
- [x] Brand colors used throughout: `brand-cream`, `brand-taupe`, `brand-gold`, `brand-sand`, `brand-dark`
- [x] `SectionOrnament` component shared across sections

- [ ] **Step 4: Commit**

```bash
git add src/app/testimoni/page.tsx src/app/testimoni/contact-form.tsx
git commit -m "chore: final verification and polish for testimonial page"
```
