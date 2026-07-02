"use client";

import { useState, useEffect, useRef } from "react";
import EmblaCarousel from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialData {
  id: string;
  coupleName: string;
  rating: number;
  quote: string;
}

export function TestimonialBlock({
  testimonial,
  photos,
}: {
  testimonial: TestimonialData;
  photos: string[];
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const emblaApiRef = useRef<ReturnType<typeof EmblaCarousel> | null>(null);
  const autoplayRef = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }));
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const emblaApi = EmblaCarousel(viewport, { loop: true, align: "center" }, [
      autoplayRef.current,
    ]);
    emblaApiRef.current = emblaApi;

    const onSelect = () => {
      setCurrent(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.destroy();
      emblaApiRef.current = null;
    };
  }, []);

  return (
    <div>
      {/* Carousel viewport */}
      <div className="relative max-w-3xl mx-auto">
        <div ref={viewportRef} className="overflow-hidden rounded-lg">
          <div className="flex">
            {photos.map((file, i) => (
              <div
                key={i}
                className="relative flex-[0_0_100%] min-w-0 aspect-[4/3]"
              >
                <Image
                  src={`/asset/testimonial/testimonial_${testimonial.id}/${file}`}
                  alt={`${testimonial.coupleName} wedding photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 48rem"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Prev/Next arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => emblaApiRef.current?.scrollPrev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-brand-taupe flex items-center justify-center shadow-md hover:bg-white transition-colors"
              aria-label="Previous photo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => emblaApiRef.current?.scrollNext()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm text-brand-taupe flex items-center justify-center shadow-md hover:bg-white transition-colors"
              aria-label="Next photo"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApiRef.current?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-brand-gold w-6"
                  : "bg-brand-taupe/20 hover:bg-brand-taupe/40 w-2"
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <div className="text-center mt-8 max-w-2xl mx-auto px-4">
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-brand-gold text-brand-gold"
            />
          ))}
        </div>
        <blockquote className="font-serif text-lg md:text-xl text-brand-taupe leading-relaxed mb-4 italic">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <p className="text-brand-taupe/50 text-sm">
          {testimonial.coupleName}
        </p>
      </div>
    </div>
  );
}
