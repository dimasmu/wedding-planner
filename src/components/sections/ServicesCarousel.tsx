"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import EmblaCarousel from "embla-carousel";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
  {
    id: "wedding",
    title: "Wedding Ceremonies",
    image: "/asset/services/kind_of_services/wedding_service.jpg",
    items: [
      "Intimate Receptions",
      "Grand Receptions",
      "International Weddings",
      "Traditional Ceremonies",
      "Custom Rituals & Themes",
    ],
  },
  {
    id: "corporate",
    title: "Corporate Events",
    image: "/asset/services/kind_of_services/corporate_event.jpg",
    items: [
      "Meetings & Seminars",
      "Office Gatherings",
      "Team Building Events",
      "Company Anniversaries",
      "Marketing & Exhibitions",
    ],
  },
  {
    id: "social",
    title: "Social Gatherings",
    image: "/asset/services/kind_of_services/gathering_service.jpg",
    items: [
      "Reunions",
      "Graduation Proms",
      "Birthday Parties",
      "Anniversary Dinners",
      "Family Celebrations",
    ],
  },
  {
    id: "traditional",
    title: "Traditional Events",
    image: "/asset/services/kind_of_services/traditional_service.jpg",
    items: [
      "Custom Ceremonies",
      "Cultural Rituals",
      "Traditional Decor",
      "Vendor Coordination",
      "End-to-End Consulting",
    ],
  },
  {
    id: "birthday",
    title: "Birthday Parties",
    image: "/asset/services/kind_of_services/birthday_service.jpg",
    items: [
      "Kids' Birthdays",
      "Adult Celebrations",
      "Milestone Birthdays",
      "Themed Parties",
      "Entertainment & Decor",
    ],
  },
];

function FlipCard({
  service,
  flipped,
  onFlip,
}: {
  service: (typeof services)[number];
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div
      className="[perspective:1000px] cursor-pointer select-none"
      onClick={(e) => {
        e.stopPropagation();
        onFlip();
      }}
    >
      <div
        className={cn(
          "relative w-[280px] sm:w-[320px] h-[400px] transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front — Image */}
        <div className="absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] shadow-lg shadow-brand-dark/10">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            sizes="320px"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
          {/* Title */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-serif text-2xl text-white mb-2">
              {service.title}
            </h3>
            <span className="text-sm text-brand-gold/80">
              Click to explore &rarr;
            </span>
          </div>
        </div>

        {/* Back — Details */}
        <div className="absolute inset-0 rounded-xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] bg-brand-taupe shadow-lg shadow-brand-dark/10 flex flex-col">
          <div className="flex-1 p-6 flex flex-col justify-center">
            <h3 className="font-serif text-xl text-brand-gold mb-6">
              {service.title}
            </h3>
            <ul className="space-y-3">
              {service.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-brand-cream/80 text-sm"
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-6 pb-6">
            <div className="text-center text-brand-cream/30 text-xs">
              &larr; Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServicesCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const emblaApiRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const onSelect = useCallback(() => {
    const api = emblaApiRef.current;
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const emblaApi = EmblaCarousel(viewport, {
      align: "center",
      containScroll: "trimSnaps",
      dragFree: false,
    });

    emblaApiRef.current = emblaApi;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.destroy();
      emblaApiRef.current = null;
    };
  }, [onSelect]);

  const scrollPrev = () => emblaApiRef.current?.scrollPrev();
  const scrollNext = () => emblaApiRef.current?.scrollNext();

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="relative">
      {/* Viewport */}
      <div className="overflow-hidden" ref={viewportRef}>
        <div className="flex">
          {services.map((service) => (
            <div
              key={service.id}
              className="min-w-0 shrink-0 grow-0 basis-[300px] sm:basis-[340px] flex justify-center px-3"
            >
              <FlipCard
                service={service}
                flipped={flippedCards.has(service.id)}
                onFlip={() => toggleFlip(service.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow navigation */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
          canScrollPrev
            ? "bg-white/90 text-brand-taupe hover:bg-white shadow-lg shadow-brand-dark/10 hover:scale-105"
            : "bg-white/30 text-brand-taupe/20 cursor-not-allowed"
        )}
        aria-label="Previous service"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
          canScrollNext
            ? "bg-white/90 text-brand-taupe hover:bg-white shadow-lg shadow-brand-dark/10 hover:scale-105"
            : "bg-white/30 text-brand-taupe/20 cursor-not-allowed"
        )}
        aria-label="Next service"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
