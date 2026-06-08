"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Sola Planner made our wedding planning completely stress-free. We found an incredible photographer and the budget tracker kept us on track.",
    name: "Sarah & James",
    role: "Married June 2025",
    rating: 5,
  },
  {
    quote: "The vendor marketplace is a game-changer. We compared quotes from multiple caterers and saved over $2,000 on our reception.",
    name: "Maya & David",
    role: "Married March 2026",
    rating: 5,
  },
  {
    quote: "As someone who had no idea where to start, the checklist feature was a lifesaver. Every deadline, every detail — perfectly organized.",
    name: "Priya & Alex",
    role: "Married September 2025",
    rating: 5,
  },
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-4">
            Loved by Couples
          </h2>
          <p className="text-brand-taupe/60 max-w-lg mx-auto">
            Real stories from real weddings planned with Sola.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-brand-sand rounded-xl p-10 md:p-12 shadow-sm text-center"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-gold text-brand-gold" />
                ))}
              </div>
              <blockquote className="font-serif text-xl md:text-2xl text-brand-taupe leading-relaxed mb-6 italic">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>
              <p className="font-semibold text-brand-taupe">{testimonials[current].name}</p>
              <p className="text-sm text-brand-taupe/50">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-brand-gold w-6" : "bg-brand-taupe/20 hover:bg-brand-taupe/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
