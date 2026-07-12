"use client";

import { motion } from "motion/react";
import { MapPin, Users, Banknote } from "lucide-react";

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

interface AboutSectionProps {
  description: string;
  location: string;
  maxCapacity: number;
  cheapestPrice: number | null;
}

export function AboutSection({
  description,
  location,
  maxCapacity,
  cheapestPrice,
}: AboutSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24"
    >
      {/* Decorative line */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-gold/20" />
        <div className="w-2 h-2 rounded-full bg-brand-gold/40" />
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-gold/20" />
      </div>

      <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe text-center mb-6">
        Tentang Venue
      </h2>

      <p className="text-brand-taupe/60 leading-relaxed text-base md:text-lg text-center mb-10">
        {description}
      </p>
      
    </motion.section>
  );
}
