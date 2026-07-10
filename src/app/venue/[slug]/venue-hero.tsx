"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, Users, ArrowLeft, ChevronDown } from "lucide-react";

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

interface VenueHeroProps {
  name: string;
  location: string;
  description: string;
  maxCapacity: number;
  cheapestPrice: number | null;
  image: string | null;
  bookingUrl: string;
}

export function VenueHero({
  name,
  location,
  description,
  maxCapacity,
  cheapestPrice,
  image,
  bookingUrl,
}: VenueHeroProps) {
  const shortDesc = description.length > 120 ? description.slice(0, 120) + "\u2026" : description;

  const scrollToPackages = () => {
    document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left column — text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-brand-taupe tracking-tight leading-[1.1] mb-6">
              {name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-taupe/55 mb-5">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-gold/60" />
                {location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-brand-gold/60" />
                {maxCapacity} tamu
              </span>
              {cheapestPrice !== null && (
                <span className="font-semibold text-brand-gold">
                  {formatIDR(cheapestPrice)}
                </span>
              )}
            </div>

            <p className="text-brand-taupe/60 leading-relaxed mb-8 max-w-md">
              {shortDesc}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToPackages}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-gold text-white rounded-full text-sm font-medium hover:bg-brand-taupe transition-colors"
              >
                Lihat Paket
                <ChevronDown className="w-4 h-4" />
              </button>
              <a
                href={bookingUrl || "tel:"}
                className="inline-flex items-center gap-2 px-6 py-3 border border-brand-sand rounded-full text-sm font-medium text-brand-taupe/70 hover:border-brand-gold/40 hover:text-brand-taupe transition-colors"
              >
                Hubungi Kami
              </a>
            </div>
          </motion.div>

          {/* Right column — image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-1 md:order-2 relative"
          >
            <div className="relative aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-brand-taupe/10">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-taupe/20 via-brand-gold/10 to-brand-cream" />
              )}
            </div>

            {/* Back button */}
            <Link
              href="/venue"
              className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-sm text-brand-taupe/70 hover:bg-white hover:text-brand-taupe transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
