"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/asset/home_carousel/bride-groom-their-wedding-ceremony.jpg",
    title: "Your Dream Wedding, Effortlessly Planned",
    subtitle: "Connect with the finest vendors, manage your budget, and track every detail — all in one beautiful place.",
    cta: "Start Planning",
    href: "/register",
  },
  {
    id: 2,
    image: "/asset/home_carousel/front-view-elegant-bridegroom-suit-which-standing-embracing-bride-happy-woman-white-wedding-dress-holding-beautiful.jpg",
    title: "Handpicked Vendors You Can Trust",
    subtitle: "Browse curated wedding professionals with verified reviews and transparent pricing.",
    cta: "Explore Vendors",
    href: "/vendors",
  },
  {
    id: 3,
    image: "/asset/home_carousel/front-view-happy-bride-groom-holding-together-knife-concentrating-cutting-wedding-cake-while-standing-background.jpg",
    title: "Every Detail, Perfectly Tracked",
    subtitle: "From guest lists to vendor bookings — our smart dashboard keeps everything organized.",
    cta: "View Dashboard",
    href: "/dashboard",
  },
  {
    id: 4,
    image: "/asset/home_carousel/wedding-bands-hands-bride-groom-with-beautiful-wedding-bouquet-made-greenery-white-flowers.jpg",
    title: "Cherish Every Moment",
    subtitle: "From the rings to the bouquet — we help you curate the finest details for your celebration.",
    cta: "Get Started",
    href: "/register",
  },
  {
    id: 5,
    image: "/asset/home_carousel/young-wedding-couple-their-wedding.jpg",
    title: "Your Love Story, Beautifully Told",
    subtitle: "Join thousands of couples who trusted Sola Planner to bring their dream wedding to life.",
    cta: "Start Planning",
    href: "/register",
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
          className="absolute inset-0"
        >
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            priority={current === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/50 via-brand-dark/20 to-brand-dark/60" />

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-start max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 drop-shadow-lg">
              {slides[current].title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-xl drop-shadow-md">
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
              i === current ? "bg-brand-gold w-8" : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
