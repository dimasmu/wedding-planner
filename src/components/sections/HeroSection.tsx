"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    id: 1,
    title: "Your Dream Wedding, Effortlessly Planned",
    subtitle: "Connect with the finest vendors, manage your budget, and track every detail — all in one beautiful place.",
    cta: "Start Planning",
    href: "/register",
    bg: "bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20",
  },
  {
    id: 2,
    title: "Handpicked Vendors You Can Trust",
    subtitle: "Browse curated wedding professionals with verified reviews and transparent pricing.",
    cta: "Explore Vendors",
    href: "/vendors",
    bg: "bg-gradient-to-br from-brand-cream via-brand-sand to-brand-gold/30",
  },
  {
    id: 3,
    title: "Every Detail, Perfectly Tracked",
    subtitle: "From guest lists to vendor bookings — our smart dashboard keeps everything organized.",
    cta: "View Dashboard",
    href: "/dashboard",
    bg: "bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20",
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={`absolute inset-0 ${slides[current].bg}`}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-brand-taupe/30 via-transparent to-brand-taupe/20" />

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-brand-taupe leading-tight mb-6">
              {slides[current].title}
            </h1>
            <p className="text-lg md:text-xl text-brand-taupe/70 leading-relaxed mb-10 max-w-xl">
              {slides[current].subtitle}
            </p>
            <Link href={slides[current].href}>
              <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 text-lg px-8 py-6 rounded-md">
                {slides[current].cta} →
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === current ? "bg-brand-gold w-8" : "bg-brand-taupe/30 hover:bg-brand-taupe/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
