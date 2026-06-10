import { ServicesHero } from "@/components/sections/ServicesHero";
import { ServicesCarousel } from "@/components/sections/ServicesCarousel";
import { RevealSection } from "@/components/ui-custom/RevealSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Palette, ClipboardCheck, PartyPopper } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const processSteps = [
  {
    icon: Palette,
    title: "Concept & Moodboard",
    description:
      "We create a visual moodboard based on your brief, capturing the aesthetic, color palette, and atmosphere you envision for your event.",
    step: "01",
  },
  {
    icon: Sparkles,
    title: "Plan & Pitch",
    description:
      "Limitless meetings, detailed budgeting, and pitching the best vendors in Jabodetabek. We refine every detail until it's perfect.",
    step: "02",
  },
  {
    icon: ClipboardCheck,
    title: "Execution",
    description:
      "We run the show while you enjoy the moment. Our team handles every detail on the day so you can be fully present.",
    step: "03",
  },
];

const servicesTestimonials = [
  {
    quote:
      "SOLA handled our annual corporate gala with such professionalism. Every detail was flawless — from the stage design to the catering. Our CEO was genuinely impressed.",
    name: "Amanda Kusuma",
    role: "HR Director, TechCorp Indonesia",
    rating: 5,
  },
  {
    quote:
      "Our wedding was everything we dreamed of and more. The team worked tirelessly behind the scenes and the decor was absolutely breathtaking. We couldn't have asked for a smoother day.",
    name: "Dewi & Rizky",
    role: "Married February 2026",
    rating: 5,
  },
  {
    quote:
      "I've worked with many event planners over the years, but SOLA's attention to detail and reliability is unmatched. They genuinely care about making your event extraordinary.",
    name: "Budi Santoso",
    role: "Marketing Manager, Global Brands Ltd",
    rating: 5,
  },
];

/* ── Inline Testimonial Section (services-specific) ── */
import { TestimonialSlider } from "./testimonial-slider";

const whatYouGetItems = [
  {
    title: "Moodboard with Visual Concept",
    desc: "As per your brief and preference",
  },
  {
    title: "Limitless Engagement Meetings & Consultation",
    desc: "Engage with us as much as you need",
  },
  {
    title: "Event Planning & Budgeting",
    desc: "Tailored to your needs. Pitching the best vendors",
  },
  {
    title: "On-the-Day Event Management",
    desc: "1 Project Manager + professional crew on the day (number of crew adjusted to the size of the event)",
  },
];

function WhatYouGet() {
  return (
    <section className="py-32 bg-brand-cream">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-start">
          {/* Left — Heading */}
          <div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-taupe italic leading-[1.1]">
              What
              <br />
              You
              <br />
              Get
            </h2>
            <div className="h-px w-12 bg-brand-gold/40 mt-6" />
          </div>

          {/* Right — Bullet list */}
          <div className="space-y-6 pt-2">
            {whatYouGetItems.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-gold mt-2.5 shrink-0" />
                <div>
                  <h3 className="text-base md:text-lg text-brand-taupe font-medium mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-brand-taupe/55 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="py-28 bg-brand-sand/50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-brand-gold/40" />
            <Palette className="w-4 h-4 text-brand-gold" />
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-brand-gold/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            From Vision to Reality
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Three simple steps to bring your event to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processSteps.map(({ icon: Icon, title, description, step }) => (
            <Card
              key={step}
              className="bg-white border-brand-sand shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <CardContent className="p-8 text-center">
                <span className="font-serif text-5xl text-brand-gold/15 font-bold block mb-6 group-hover:text-brand-gold/25 transition-colors">
                  {step}
                </span>
                <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-serif text-xl text-brand-taupe mb-3">
                  {title}
                </h3>
                <p className="text-brand-taupe/60 text-sm leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden bg-brand-dark">
      <Image
        src="/asset/services/background_services.jpg"
        alt=""
        fill
        className="object-cover opacity-20"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-brand-dark/80" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-10 bg-gradient-to-r from-transparent to-brand-gold/40" />
          <PartyPopper className="w-5 h-5 text-brand-gold" />
          <div className="h-px w-10 bg-gradient-to-l from-transparent to-brand-gold/40" />
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-6">
          Ready to start planning?
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-md mx-auto font-light">
          Let&rsquo;s talk about your event. We&rsquo;d love to hear your
          vision and make it unforgettable.
        </p>
        <Link href="/dashboard">
          <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 text-lg px-10 py-7 rounded-md">
            Let&rsquo;s Plan! &rarr;
          </Button>
        </Link>
      </div>
    </section>
  );
}

function ServicesTestimonials() {
  return (
    <section className="py-28 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-brand-gold/40" />
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-brand-gold/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            What Our Clients Say
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Trusted by corporate leaders and families alike
          </p>
        </div>
        <TestimonialSlider testimonials={servicesTestimonials} />
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />

      <RevealSection>
        <WhatYouGet />
      </RevealSection>

      <RevealSection>
        <section id="core-services" className="py-28 bg-brand-cream overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-brand-gold/40" />
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-brand-gold/40" />
              </div>
              <h2 className="font-serif text-3xl md:text-5xl text-brand-taupe mb-4">
                What We Do Best
              </h2>
              <p className="text-brand-taupe/60 max-w-lg mx-auto">
                From corporate galas to intimate gatherings — we craft events that leave a lasting impression
              </p>
            </div>
            <ServicesCarousel />
          </div>
        </section>
      </RevealSection>

      <RevealSection>
        <ProcessSection />
      </RevealSection>

      <RevealSection>
        <ServicesTestimonials />
      </RevealSection>

      <RevealSection>
        <FinalCTA />
      </RevealSection>
    </>
  );
}
