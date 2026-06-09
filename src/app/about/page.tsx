"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* ──────────────── Data ──────────────── */

const clientLogos = [
  "/asset/client/187.png",
  "/asset/client/189.png",
  "/asset/client/190.png",
  "/asset/client/191.png",
  "/asset/client/192.png",
  "/asset/client/193.png",
  "/asset/client/Our-Clients-6 (1).png",
  "/asset/client/Our-Clients-6.png",
];

const partnerLogos = [
  "/asset/partner/154.png",
  "/asset/partner/179.png",
  "/asset/partner/181.png",
  "/asset/partner/183.png",
  "/asset/partner/184.png",
  "/asset/partner/185.png",
  "/asset/partner/186.png",
  "/asset/partner/196.png",
  "/asset/partner/197.png",
  "/asset/partner/199.png",
];

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
                className="h-16 w-auto object-contain opacity-80 hover:opacity-100 hover:scale-110 hover:invert transition-all duration-300"
                unoptimized
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const faqs = [
  { q: "What types of events does SOLA plan?", a: "We specialize in weddings, corporate events, private parties, anniversaries, and milestone celebrations. Whether it's an intimate gathering of 20 or a grand celebration of 500+, we have the experience and vendor network to bring your vision to life." },
  { q: "How far in advance should I book SOLA?", a: "We recommend booking at least 6–12 months in advance for weddings and large-scale events. For smaller celebrations, 2–3 months is usually sufficient. That said, we always do our best to accommodate last-minute requests — just reach out and ask!" },
  { q: "Do you work with specific vendors or can I bring my own?", a: "We have a curated network of trusted vendors we've worked with for years, but we're also happy to collaborate with vendors you've already chosen. Our goal is flexibility — we adapt to your preferences while ensuring quality at every step." },
  { q: "What is your pricing structure?", a: "Our pricing is fully transparent. We offer tiered packages based on event size, complexity, and services required. After our initial consultation, you'll receive a detailed proposal with no hidden fees. We believe you should know exactly what you're paying for." },
  { q: "Can SOLA handle destination events?", a: "Yes! We love destination events. Our team is experienced in coordinating logistics across different cities and countries. We handle venue scouting, local vendor coordination, travel arrangements, and everything in between." },
  { q: "What happens if something goes wrong on the event day?", a: "Every event has its surprises — and we're prepared for them. Our team always has backup plans for critical elements, and an on-site coordinator ensures any issues are resolved before you even notice them." },
];

const storySteps = [
  { year: "2018", title: "A Passion Ignited", text: "SOLA began with a simple belief: every celebration deserves to be extraordinary. What started as helping friends and family plan their dream weddings — a favor born from passion — quickly revealed a calling." },
  { year: "2020", title: "Growing Through Challenge", text: "Even when the world paused, we adapted. We helped couples reimagine their celebrations — intimate micro-weddings, virtual planning sessions, and creative pivots that turned constraints into beauty." },
  { year: "2023", title: "Building a Team of Dreamers", text: "Our family grew. We brought together experienced planners, creative designers, and a trusted vendor network — all united by a commitment to excellence and a genuine love for what we do." },
  { year: "2025", title: "Your Story, Our Mission", text: "Today, SOLA stands as a trusted planning partner, serving clients across the region. We don't just plan events — we build relationships, create memories, and turn moments into milestones." },
];

/* ──────────────── Scroll Reveal ──────────────── */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(node); } },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
}

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

/* ═══════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════ */

export default function AboutPage() {
  return (
    <main className="bg-brand-cream">
      {/* ─── 1. Hero ─────────────────────────── */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <Image
          src="/asset/about_us/pexels-rebornfilmes-32805118.jpg"
          alt="Elegant wedding reception setup with floral centerpieces"
          fill
          className="object-cover scale-105"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0 z-10"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(30,30,30,0.15) 35%, rgba(30,30,30,0.6) 100%)" }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent" />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-16 bg-brand-gold/50" />
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
            <div className="h-px w-16 bg-brand-gold/50" />
          </div>
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-brand-cream tracking-[0.02em] mb-6">
            About SOLA
          </h1>
          <p className="text-brand-cream/60 text-lg md:text-xl max-w-xl font-light tracking-wide">
            Where every celebration becomes a masterpiece
          </p>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
            <div className="w-6 h-10 rounded-full border-2 border-brand-cream/20 flex justify-center pt-2">
              <div className="w-1 h-2 rounded-full bg-brand-gold/60 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Who We Are ──────────────────── */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "radial-gradient(circle, #3d3025 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-7xl mx-auto">
              {/* Image */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
                  <Image
                    src="/asset/about_us/StockSnap_NABNCHL6PX.jpg"
                    alt="Elegant wedding champagne toast celebration"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-brand-gold/30 hidden lg:block" />
              </div>

              {/* Text */}
              <div className="lg:col-span-7 lg:pl-8">
                <div className="mb-6">
                  <Image
                    src="/asset/about_us/Sola-Logo-2.png"
                    alt="SOLA Logo"
                    width={120}
                    height={40}
                    className="h-auto w-auto"
                  />
                </div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px w-12 bg-brand-gold/40" />
                  <span className="text-xs tracking-[0.2em] uppercase text-brand-taupe/60 font-medium">
                    Who We Are
                  </span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-taupe leading-[1.15] mb-8">
                  Event Planner <span className="text-brand-gold italic text-[1.3em]">&amp;</span> Organizer
                </h2>
                <div className="space-y-5 max-w-xl">
                  <p className="text-brand-taupe/70 leading-relaxed text-lg font-light">
                    Turn your event dreams into reality with SOLA. We&rsquo;re a passionate event planning
                    and orchestration team, dedicated to crafting unforgettable experiences tailored just for you.
                  </p>
                  <p className="text-brand-taupe/70 leading-relaxed">
                    From pinpointing the perfect venue to seamlessly coordinating with vendors, we work
                    hand-in-hand to understand your preferences, budget, and the unique vibe you desire.
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ─── 3. Our Story ────────────────────── */}
      <section className="py-32 md:py-40 bg-brand-sand relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative z-10">
          <RevealSection>
            <div className="text-center mb-24">
              <SectionOrnament />
              <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe mb-4">
                The Story Between Us
              </h2>
              <p className="text-brand-taupe/70 text-lg font-light">
                How a passion became a purpose
              </p>
            </div>
          </RevealSection>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-brand-gold/30" />
            <div className="space-y-20">
              {storySteps.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <RevealSection key={step.year}>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      <div className="absolute left-[18px] md:left-1/2 md:-translate-x-1/2 top-2 w-4 h-4 rounded-full border-2 border-brand-gold bg-brand-sand z-10" />
                      {isLeft ? (
                        <>
                          <div className="md:text-right md:pr-14 pt-0">
                            <span className="font-serif text-5xl text-brand-gold/20">{step.year}</span>
                          </div>
                          <div className="md:pl-14">
                            <h3 className="font-serif text-2xl text-brand-taupe mb-3">{step.title}</h3>
                            <p className="text-brand-taupe/70 leading-relaxed font-light">{step.text}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="md:col-start-2 md:pl-14">
                            <span className="font-serif text-5xl text-brand-gold/20">{step.year}</span>
                          </div>
                          <div className="md:col-start-1 md:row-start-1 md:text-right md:pr-14">
                            <h3 className="font-serif text-2xl text-brand-taupe mb-3">{step.title}</h3>
                            <p className="text-brand-taupe/70 leading-relaxed font-light">{step.text}</p>
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

      {/* ─── 4. The Experience ──────────────── */}
      <section className="py-32 md:py-40 bg-brand-cream overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <RevealSection>
            <div className="text-center mb-16">
              <SectionOrnament />
              <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe mb-4">
                The Experience
              </h2>
              <p className="text-brand-taupe/70 text-lg font-light">
                See the moments we craft
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="relative">
              {/* 3-image editorial grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="md:row-span-2 relative aspect-[2/3] md:aspect-auto overflow-hidden rounded-sm">
                  <Image
                    src="/asset/about_us/pexels-rebornfilmes-35114152.jpg"
                    alt="Beautifully decorated wedding reception hall"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="relative aspect-square md:col-span-2 overflow-hidden rounded-sm">
                  <Image
                    src="/asset/about_us/pexels-esma-nur-buyukguclu-112544374-35241391.jpg"
                    alt="Wedding reception floral centerpiece"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
                <div className="relative aspect-square md:col-span-2 overflow-hidden rounded-sm">
                  <Image
                    src="/asset/about_us/StockSnap_NABNCHL6PX.jpg"
                    alt="Wedding celebration with champagne toast"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              </div>

              {/* Pull quote card pinned over the grid */}
              <Card className="absolute bottom-6 right-6 max-w-sm bg-white/90 backdrop-blur-sm border-brand-gold/20 shadow-xl shadow-brand-gold/5">
                <CardContent className="p-6">
                  <p className="font-serif text-xl md:text-2xl text-brand-taupe text-center italic leading-snug">
                    &ldquo;Every detail matters.<br />Every moment counts.&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <div className="h-px w-6 bg-brand-gold/30" />
                    <span className="w-1 h-1 rounded-full bg-brand-gold/40" />
                    <div className="h-px w-6 bg-brand-gold/30" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ─── 5. Why Choose SOLA ─────────────── */}
      <section className="py-32 md:py-40 bg-brand-sand relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <RevealSection>
            <div className="text-center mb-20">
              <SectionOrnament />
              <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe mb-4">
                Why Choose SOLA
              </h2>
              <p className="text-brand-taupe/70 text-lg font-light">
                What sets us apart from the rest
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { num: "01", title: "Personal Touch", desc: "Every client gets a dedicated planner who knows your style, preferences, and story inside out. You're never just a number." },
              { num: "02", title: "Vetted Vendors", desc: "We only work with thoroughly vetted professionals who share our obsession with quality and attention to detail." },
              { num: "03", title: "Transparent Pricing", desc: "No hidden fees, no surprises. You receive a detailed proposal upfront so you know exactly what you're paying for." },
              { num: "04", title: "Stress-Free Day", desc: "On-site coordination means you can relax and soak in every moment while we handle everything behind the scenes." },
            ].map((item) => (
              <RevealSection key={item.num}>
                <Card className="group h-full border-brand-gold/10 bg-white/60 backdrop-blur-sm hover:bg-white hover:shadow-lg hover:shadow-brand-gold/5 hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                  <CardHeader>
                    <span className="font-serif text-5xl text-brand-gold/20 group-hover:text-brand-gold/40 transition-colors duration-500">
                      {item.num}
                    </span>
                    <CardTitle className="font-serif text-2xl text-brand-taupe mt-2">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-brand-taupe/70 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Clients & Partners ───────────── */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#628E90" }}>
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <RevealSection>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-white/20" />
                <SparklesIcon className="w-4 h-4 text-white/70" />
                <div className="h-px w-8 bg-white/20" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                Who Trusts Us
              </h2>
              <p className="text-white/60 text-lg font-light max-w-xl mx-auto">
                The brands and partners who believe in the magic we create
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-0">
              <div className="overflow-hidden">
                <h3 className="font-serif text-2xl md:text-3xl text-white text-center mb-8">
                  Our Beloved Clients
                </h3>
                <div className="[mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
                  <LogoMarquee logos={clientLogos} direction="left" />
                </div>
              </div>
              <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent mx-8 self-stretch" />
              <div className="overflow-hidden">
                <h3 className="font-serif text-2xl md:text-3xl text-white text-center mb-8">
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

      {/* ─── 7. FAQ ─────────────────────────── */}
      <section
        className="py-32 md:py-40 relative overflow-hidden"
        style={{ backgroundColor: "#628E90" }}
      >
        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <RevealSection>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-white/20" />
                <SparklesIcon className="w-4 h-4 text-white/70" />
                <div className="h-px w-8 bg-white/20" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
                Your Questions, Answered
              </h2>
              <p className="text-white/60 text-lg font-light">
                Everything you need to know
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg">
              <CardContent className="p-6 md:p-8">
                <Accordion className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`} className="border-[#628E90]/10">
                      <AccordionTrigger
                        className="font-sans text-base md:text-lg text-brand-taupe font-medium hover:text-brand-gold transition-colors duration-300 hover:no-underline py-5 px-3 rounded-md"
                        style={{ backgroundColor: "#FFFFF0" }}
                      >
                        <span className="font-serif text-2xl text-brand-gold/40 w-10 shrink-0 tabular-nums mr-4">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-14 pr-3 pb-4" style={{ backgroundColor: "#FFFFF0" }}>
                          <p className="text-brand-taupe/70 leading-relaxed text-sm md:text-base">
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

      {/* ─── 8. Connect With Us ──────────────── */}
      <section className="py-32 md:py-40 bg-brand-sand relative overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, rgb(211 162 127) 0%, transparent 70%)" }}
        />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <RevealSection>
            <div className="text-center mb-16">
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

          <RevealSection>
            <Card className="max-w-md mx-auto bg-white/60 backdrop-blur-sm border-brand-gold/10">
              <CardContent className="p-10 flex flex-col items-center gap-6">
                <div className="flex items-center gap-6">
                  <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </Link>
                  <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </Link>
                  <Link href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
                    </svg>
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-brand-gold/15" />
                  <span className="w-1 h-1 rounded-full bg-brand-gold/20" />
                  <div className="h-px w-8 bg-brand-gold/15" />
                </div>
                <p className="text-brand-taupe/40 text-sm font-light italic">
                  Let&rsquo;s create something beautiful together
                </p>
              </CardContent>
            </Card>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
