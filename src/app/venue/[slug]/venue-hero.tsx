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
  const shortDesc = description.length > 150 ? description.slice(0, 150) + "\u2026" : description;

  const scrollToPackages = () => {
    document.getElementById("packages-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[75vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      {image ? (
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-taupe via-brand-taupe/90 to-brand-dark" />
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-dark/50" />

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-cream to-transparent" />

      {/* Back button */}
      <Link
        href="/venue"
        className="absolute top-6 left-4 md:left-8 z-20 inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-sm text-white/90 hover:bg-white/25 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-4 max-w-2xl mx-auto py-20"
      >
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.15] mb-6">
          {name}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/60 mb-5">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-gold/70" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-gold/70" />
            {maxCapacity} tamu
          </span>
          {cheapestPrice !== null && (
            <span className="font-semibold text-brand-gold">
              {formatIDR(cheapestPrice)}
            </span>
          )}
        </div>

        <p className="text-white/55 leading-relaxed mb-8 max-w-lg mx-auto text-sm md:text-base">
          {shortDesc}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
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
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-sm font-medium text-white/90 hover:bg-white/25 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </motion.div>
    </section>
  );
}
