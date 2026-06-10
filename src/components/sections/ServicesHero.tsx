"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const videos = [
  "/asset/services/14620283_3840_2160_30fps.mp4",
  "/asset/services/8502878-uhd_3840_2160_24fps.mp4",
  "/asset/services/8503159-uhd_3840_2160_24fps.mp4",
];

export function ServicesHero() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [currentVideo]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {});
  }, [currentVideo]);

  const scrollToServices = () => {
    const el = document.getElementById("core-services");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-brand-dark">
      {/* Video background */}
      <video
        ref={videoRef}
        key={videos[currentVideo]}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-dark/60" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, transparent 0%, rgba(30,30,30,0.35) 70%, rgba(30,30,30,0.7) 100%)",
        }}
      />

      {/* Gold gradient line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-12 bg-brand-gold/40" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-brand-gold/70 font-medium">
            Our Services
          </span>
          <div className="h-px w-12 bg-brand-gold/40" />
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6 max-w-4xl tracking-tight">
          From Concept to<br className="sm:hidden" /> Celebration
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed">
          We turn your vision into a flawless reality&mdash;whether it&rsquo;s a
          corporate gala or an intimate wedding. 100% stress-free, with a
          personal touch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 text-base px-8 py-6 rounded-md">
              Plan Your Event &rarr;
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={scrollToServices}
            className="text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-base px-8 py-6 rounded-md"
          >
            View Services &darr;
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="w-6 h-10 rounded-full border-2 border-white/15 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-brand-gold/60 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
