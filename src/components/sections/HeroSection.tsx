"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    image: "/asset/home_carousel/bride-groom-their-wedding-ceremony.jpg",
    title: "Your Dream Wedding, Effortlessly Planned",
    subtitle:
      "Connect with the finest vendors, manage your budget, and track every detail — all in one beautiful place.",
    cta: "Start Planning",
    href: "/register",
  },
  {
    id: 2,
    image:
      "/asset/home_carousel/front-view-elegant-bridegroom-suit-which-standing-embracing-bride-happy-woman-white-wedding-dress-holding-beautiful.jpg",
    title: "Handpicked Vendors You Can Trust",
    subtitle:
      "Browse curated wedding professionals with verified reviews and transparent pricing.",
    cta: "Explore Vendors",
    href: "/vendors",
  },
  {
    id: 3,
    image:
      "/asset/home_carousel/front-view-happy-bride-groom-holding-together-knife-concentrating-cutting-wedding-cake-while-standing-background.jpg",
    title: "Every Detail, Perfectly Tracked",
    subtitle:
      "From guest lists to vendor bookings — our smart dashboard keeps everything organized.",
    cta: "View Dashboard",
    href: "/dashboard",
  },
  {
    id: 4,
    image:
      "/asset/home_carousel/wedding-bands-hands-bride-groom-with-beautiful-wedding-bouquet-made-greenery-white-flowers.jpg",
    title: "Cherish Every Moment",
    subtitle:
      "From the rings to the bouquet — we help you curate the finest details for your celebration.",
    cta: "Get Started",
    href: "/register",
  },
  {
    id: 5,
    image: "/asset/home_carousel/young-wedding-couple-their-wedding.jpg",
    title: "Your Love Story, Beautifully Told",
    subtitle:
      "Join thousands of couples who trusted Sola Planner to bring their dream wedding to life.",
    cta: "Start Planning",
    href: "/register",
  },
];

export function HeroSection() {
  const autoplayRef = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [autoplayRef.current]
  );
  const [current, setCurrent] = useState(0);
  const apiRef = useRef(emblaApi);

  // Keep apiRef in sync
  useEffect(() => {
    apiRef.current = emblaApi;
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, []);

  const scrollTo = useCallback((index: number) => {
    apiRef.current?.scrollTo(index);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden bg-brand-dark">
      {/* Embla viewport */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="relative min-w-0 shrink-0 grow-0 basis-full h-full"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={slide.id === 1}
                className="object-cover"
                sizes="100vw"
              />
              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(30,30,30,0.5), rgba(30,30,30,0.2), rgba(30,30,30,0.6))",
                }}
              />
              {/* Text content */}
              <div className="absolute inset-0 z-10 container mx-auto px-4 flex flex-col justify-center items-start max-w-3xl">
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-xl drop-shadow-md">
                  {slide.subtitle}
                </p>
                <Link href={slide.href}>
                  <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 text-lg px-8 py-6 rounded-md">
                    {slide.cta} →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
              i === current
                ? "bg-brand-gold w-8"
                : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
