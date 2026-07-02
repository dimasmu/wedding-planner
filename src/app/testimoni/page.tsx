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
  const latestTestimonials = [...testimonials]
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
