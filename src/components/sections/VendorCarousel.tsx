"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Camera, Music, UtensilsCrossed, Flower2 } from "lucide-react";
import Link from "next/link";

const categories = [
  { icon: Camera, label: "Photography", count: 124 },
  { icon: Music, label: "Music & DJ", count: 89 },
  { icon: UtensilsCrossed, label: "Catering", count: 156 },
  { icon: Flower2, label: "Decoration", count: 98 },
  { icon: Camera, label: "Videography", count: 67 },
  { icon: Flower2, label: "Venue", count: 112 },
];

export function VendorCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-brand-sand">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            Browse Vendor Categories
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Everything you need for your perfect day, curated and ready to book.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white border-brand-sand shadow-md hidden md:flex"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-brand-taupe" />
          </Button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map(({ icon: Icon, label, count }) => (
              <motion.div
                key={label}
                whileHover={{ y: -6 }}
                className="snap-start shrink-0 w-[220px]"
              >
                <Link href={`/vendors?category=${label.toLowerCase()}`}>
                  <Card className="bg-white border-brand-sand hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-7 h-7 text-brand-gold" />
                      </div>
                      <h3 className="font-serif text-lg text-brand-taupe mb-1">{label}</h3>
                      <p className="text-sm text-brand-taupe/50">{count} vendors</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white border-brand-sand shadow-md hidden md:flex"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-brand-taupe" />
          </Button>
        </div>
      </div>
    </section>
  );
}
