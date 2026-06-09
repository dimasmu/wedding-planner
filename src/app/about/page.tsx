"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
/* The ClientPartnerShowcase is rendered inline below with a light background
   so the marquee text stays readable within the page's cream/sand rhythm. */
import { ChevronDown } from "lucide-react";

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

function LogoMarquee({
  logos,
  direction,
}: {
  logos: string[];
  direction: "left" | "right";
}) {
  const anim =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  const copies = 3;
  return (
    <div className="overflow-hidden group">
      <div
        className={`flex shrink-0 gap-6 ${anim} group-hover:[animation-play-state:paused]`}
      >
        {Array.from({ length: copies }, (_, ci) =>
          logos.map((logo, i) => (
            <div
              key={`${ci}-${i}`}
              className="shrink-0 h-16 relative flex items-center"
            >
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
  {
    q: "What types of events does SOLA plan?",
    a: "We specialize in weddings, corporate events, private parties, anniversaries, and milestone celebrations. Whether it's an intimate gathering of 20 or a grand celebration of 500+, we have the experience and vendor network to bring your vision to life.",
  },
  {
    q: "How far in advance should I book SOLA?",
    a: "We recommend booking at least 6–12 months in advance for weddings and large-scale events. For smaller celebrations, 2–3 months is usually sufficient. That said, we always do our best to accommodate last-minute requests — just reach out and ask!",
  },
  {
    q: "Do you work with specific vendors or can I bring my own?",
    a: "We have a curated network of trusted vendors we've worked with for years, but we're also happy to collaborate with vendors you've already chosen. Our goal is flexibility — we adapt to your preferences while ensuring quality at every step.",
  },
  {
    q: "What is your pricing structure?",
    a: "Our pricing is fully transparent. We offer tiered packages based on event size, complexity, and services required. After our initial consultation, you'll receive a detailed proposal with no hidden fees. We believe you should know exactly what you're paying for.",
  },
  {
    q: "Can SOLA handle destination events?",
    a: "Yes! We love destination events. Our team is experienced in coordinating logistics across different cities and countries. We handle venue scouting, local vendor coordination, travel arrangements, and everything in between.",
  },
  {
    q: "What happens if something goes wrong on the event day?",
    a: "Every event has its surprises — and we're prepared for them. Our team always has backup plans for critical elements, and an on-site coordinator ensures any issues are resolved before you even notice them.",
  },
];

const storySteps = [
  {
    year: "2018",
    title: "A Passion Ignited",
    text: "SOLA began with a simple belief: every celebration deserves to be extraordinary. What started as helping friends and family plan their dream weddings — a favor born from passion — quickly revealed a calling.",
  },
  {
    year: "2020",
    title: "Growing Through Challenge",
    text: "Even when the world paused, we adapted. We helped couples reimagine their celebrations — intimate micro-weddings, virtual planning sessions, and creative pivots that turned constraints into beauty.",
  },
  {
    year: "2023",
    title: "Building a Team of Dreamers",
    text: "Our family grew. We brought together experienced planners, creative designers, and a trusted vendor network — all united by a commitment to excellence and a genuine love for what we do.",
  },
  {
    year: "2025",
    title: "Your Story, Our Mission",
    text: "Today, SOLA stands as a trusted planning partner, serving clients across the region. We don't just plan events — we build relationships, create memories, and turn moments into milestones.",
  },
];

/* ──────────────── Scroll Reveal ──────────────── */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ──────────────── Accordion ──────────────── */

function AccordionItem({
  question,
  answer,
  index,
}: {
  question: string;
  answer: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-brand-taupe/15">
      {/* divider between items */}
      {index > 0 && <div className="border-t border-brand-taupe/15" />}

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 py-5 px-4 text-left cursor-pointer group bg-brand-sand/40 hover:bg-brand-sand/80 transition-colors duration-200 rounded-sm"
        aria-expanded={open}
      >
        <span className="font-serif text-3xl text-brand-taupe/30 w-10 shrink-0 tabular-nums transition-colors duration-300 group-hover:text-brand-gold/40">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 font-sans text-base md:text-lg text-brand-taupe font-medium group-hover:text-brand-gold transition-colors duration-300">
          {question}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full border border-brand-taupe/30 flex items-center justify-center transition-all duration-300 ${
            open ? "bg-brand-gold border-brand-gold rotate-180" : ""
          }`}
        >
          <ChevronDown
            className={`h-4 w-4 transition-colors duration-300 ${
              open ? "text-brand-cream" : "text-brand-taupe/50"
            }`}
          />
        </span>
      </button>

      {/* answer content — only rendered when open */}
      {open && (
        <div className="pb-6 pl-14 pr-4">
          <p className="text-brand-taupe/70 leading-relaxed text-sm md:text-base">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

/* ──────────────── Inline Icons ──────────────── */

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

/* ──────────────── Section Wrapper ──────────────── */

function RevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`motion-safe:transition-all motion-safe:duration-1000 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 motion-safe:translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ──────────────── Shared Ornament ──────────────── */

function SectionOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 mb-6 ${className}`}>
      <div className="h-px w-8 bg-brand-gold/40" />
      <SparklesIcon className="w-4 h-4 text-brand-gold" />
      <div className="h-px w-8 bg-brand-gold/40" />
    </div>
  );
}

function SimpleOrnament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="h-px w-12 bg-brand-gold/40" />
      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/60" />
      <div className="h-px w-12 bg-brand-gold/40" />
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
        {/* rich dark overlay with warm center glow */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, rgba(30,30,30,0.15) 35%, rgba(30,30,30,0.6) 100%)",
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent" />

        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
          {/* ornamental line */}
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

          {/* scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
            <div className="w-6 h-10 rounded-full border-2 border-brand-cream/20 flex justify-center pt-2">
              <div className="w-1 h-2 rounded-full bg-brand-gold/60 animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Who We Are ──────────────────── */}
      <section className="py-32 md:py-40 relative overflow-hidden">
        {/* subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #3d3025 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <RevealSection>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center max-w-7xl mx-auto">
              {/* image — off-center, overlapping */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src="/asset/about_us/pexels-ekoagalarov-28745499.jpg"
                    alt="SOLA event planning team collaborating on event details"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </div>
                {/* decorative floating element */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-brand-gold/30 hidden lg:block" />
              </div>

              {/* text column */}
              <div className="lg:col-span-7 lg:pl-8">
                {/* logo */}
                <div className="mb-6">
                  <Image
                    src="/asset/about_us/Sola-Logo-2.png"
                    alt="SOLA Logo"
                    width={120}
                    height={40}
                    className="h-auto w-auto"
                  />
                </div>

                {/* label + ornamental detail */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-px w-12 bg-brand-gold/40" />
                  <span className="text-xs tracking-[0.2em] uppercase text-brand-taupe/60 font-medium">
                    Who We Are
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-brand-taupe leading-[1.15] mb-8">
                  Event Planner{" "}
                  <span className="text-brand-gold italic text-[1.3em]">&amp;</span>{" "}
                  Organizer
                </h2>

                <div className="space-y-5 max-w-xl">
                  <p className="text-brand-taupe/70 leading-relaxed text-lg font-light">
                    Turn your event dreams into reality with SOLA. We&rsquo;re a
                    passionate event planning and orchestration team, dedicated
                    to crafting unforgettable experiences tailored just for you.
                  </p>
                  <p className="text-brand-taupe/70 leading-relaxed">
                    From pinpointing the perfect venue to seamlessly coordinating
                    with vendors, we work hand-in-hand to understand your
                    preferences, budget, and the unique vibe you desire.
                  </p>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ─── 3. Our Story Timeline ────────────── */}
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

          {/* timeline */}
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-brand-gold/30" />

            <div className="space-y-20">
              {storySteps.map((step, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <RevealSection key={step.year}>
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                      {/* timeline dot */}
                      <div className="absolute left-[18px] md:left-1/2 md:-translate-x-1/2 top-2 w-4 h-4 rounded-full border-2 border-brand-gold bg-brand-sand z-10" />

                      {/* year badge */}
                      {isLeft ? (
                        <>
                          <div className="md:text-right md:pr-14 pt-0">
                            <span className="font-serif text-5xl text-brand-gold/20">
                              {step.year}
                            </span>
                          </div>
                          <div className="md:pl-14">
                            <h3 className="font-serif text-2xl text-brand-taupe mb-3">
                              {step.title}
                            </h3>
                            <p className="text-brand-taupe/70 leading-relaxed font-light">
                              {step.text}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="md:col-start-2 md:pl-14">
                            <span className="font-serif text-5xl text-brand-gold/20">
                              {step.year}
                            </span>
                          </div>
                          <div className="md:col-start-1 md:row-start-1 md:text-right md:pr-14">
                            <h3 className="font-serif text-2xl text-brand-taupe mb-3">
                              {step.title}
                            </h3>
                            <p className="text-brand-taupe/70 leading-relaxed font-light">
                              {step.text}
                            </p>
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
            <div className="relative rounded-sm overflow-hidden">
              {/* 3-image grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                {/* Left: large vertical image */}
                <div className="md:row-span-2 relative aspect-[2/3] md:aspect-auto">
                  <Image
                    src="/asset/about_us/pexels-rebornfilmes-35114152.jpg"
                    alt="Beautifully decorated wedding reception hall with elegant table settings"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                {/* Right top: square */}
                <div className="relative aspect-square md:col-span-2">
                  <Image
                    src="/asset/about_us/pexels-esma-nur-buyukguclu-112544374-35241391.jpg"
                    alt="Close-up of wedding reception floral centerpiece arrangement"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>

                {/* Right bottom: square */}
                <div className="relative aspect-square md:col-span-2">
                  <Image
                    src="/asset/about_us/StockSnap_NABNCHL6PX.jpg"
                    alt="Wedding celebration with champagne toast and elegant décor"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
              </div>

              {/* Overlay with quote */}
              <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-sm flex items-center justify-center">
                <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-white text-center px-6 italic leading-snug [text-shadow:0_2px_18px_rgba(0,0,0,0.8)]">
                  &ldquo;Every detail matters.<br />Every moment counts.&rdquo;
                </p>
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                num: "01",
                title: "Personal Touch",
                desc: "Every client gets a dedicated planner who knows your style, preferences, and story inside out. You're never just a number.",
              },
              {
                num: "02",
                title: "Vetted Vendors",
                desc: "We only work with thoroughly vetted professionals who share our obsession with quality and attention to detail.",
              },
              {
                num: "03",
                title: "Transparent Pricing",
                desc: "No hidden fees, no surprises. You receive a detailed proposal upfront so you know exactly what you're paying for.",
              },
              {
                num: "04",
                title: "Stress-Free Day",
                desc: "On-site coordination means you can relax and soak in every moment while we handle everything behind the scenes.",
              },
            ].map((item) => (
              <RevealSection key={item.num}>
                <div className="group p-8 md:p-10 hover:bg-brand-cream/60 transition-colors duration-500 rounded-sm cursor-pointer">
                  <span className="block font-serif text-5xl text-brand-gold/20 mb-4 group-hover:text-brand-gold/40 transition-colors duration-500">
                    {item.num}
                  </span>
                  <h3 className="font-serif text-2xl text-brand-taupe mb-3">
                    {item.title}
                  </h3>
                  <p className="text-brand-taupe/70 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. Beloved Clients & Trusted Partners ── */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{ backgroundColor: "#628E90" }}
      >
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <RevealSection>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-0">
              {/* Left: Clients */}
              <div className="overflow-hidden">
                <h3 className="font-serif text-2xl md:text-3xl text-white text-center mb-8">
                  Our Beloved Clients
                </h3>
                <div className="[mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
                  <LogoMarquee logos={clientLogos} direction="left" />
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent mx-8 self-stretch" />

              {/* Right: Partners */}
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
      <section className="py-32 md:py-40 bg-brand-dark relative overflow-hidden">
        {/* subtle grain */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        <div className="container mx-auto px-6 max-w-3xl relative z-10">
          <RevealSection>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-8 bg-brand-gold/20" />
                <span className="w-1 h-1 rounded-full bg-brand-gold/30" />
                <div className="h-px w-8 bg-brand-gold/20" />
              </div>
              <h2 className="font-serif text-4xl md:text-5xl text-brand-cream mb-4">
                Your Questions, Answered
              </h2>
              <p className="text-brand-cream/60 text-lg font-light">
                Everything you need to know
              </p>
            </div>
          </RevealSection>

          <div className="bg-brand-cream rounded-sm p-8 md:p-12">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.q}
                answer={faq.a}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. Connect With Us ──────────────── */}
      <section className="py-32 md:py-40 bg-brand-cream relative overflow-hidden">
        {/* background ornament — large faint gold circle */}
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

          <RevealSection>
            {/* card container */}
            <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl border border-brand-gold/10 shadow-lg shadow-brand-gold/5 p-10 md:p-14">
              {/* social links row */}
              <div className="flex items-center justify-center gap-6">
                <Link
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-brand-taupe/50 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-brand-taupe/50 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect width="4" height="12" x="2" y="9" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </Link>
                <Link
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-brand-taupe/50 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
                  </svg>
                </Link>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>
    </main>
  );
}
