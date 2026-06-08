"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

const galleries = [
  { title: "Classic Elegance", count: 24, gradient: "from-brand-sand via-brand-cream to-brand-gold/30" },
  { title: "Rustic Garden", count: 18, gradient: "from-brand-sand via-brand-cream to-emerald-100/50" },
  { title: "Modern Minimalist", count: 12, gradient: "from-brand-sand via-brand-cream to-neutral-200/50" },
  { title: "Beach Romance", count: 15, gradient: "from-brand-sand via-brand-cream to-sky-100/50" },
  { title: "Traditional Culture", count: 30, gradient: "from-brand-sand via-brand-cream to-amber-100/50" },
  { title: "Intimate Micro Wedding", count: 9, gradient: "from-brand-sand via-brand-cream to-rose-100/50" },
];

export default function InspirationPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-5xl text-brand-taupe mb-4">
            Wedding Inspiration
          </h1>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Curated galleries to spark your imagination for the perfect day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {galleries.map(({ title, count, gradient }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              className="cursor-pointer"
            >
              <Card className="bg-white border-brand-sand overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Heart className="w-12 h-12 text-brand-gold/30" />
                </div>
                <CardContent className="p-5">
                  <h3 className="font-serif text-lg text-brand-taupe">{title}</h3>
                  <p className="text-sm text-brand-taupe/50 mt-1">{count} inspirations</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
