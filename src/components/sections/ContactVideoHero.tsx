"use client";

import { Button } from "@/components/ui/button";

export function ContactVideoHero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-brand-dark">
      {/* Single looping video (not playlist — no ended listener needed) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/asset/contact_us/background_video/8503119-uhd_3840_2160_24fps.mp4"
          type="video/mp4"
        />
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
            Get in Touch
          </span>
          <div className="h-px w-12 bg-brand-gold/40" />
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white leading-[1.1] mb-6 max-w-4xl tracking-tight">
          Let&rsquo;s Create Your Dream Wedding
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed">
          We&rsquo;d love to hear from you. Reach out and let&rsquo;s start planning.
        </p>

        <Button
          onClick={() => {
            document
              .getElementById("contact-content")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300 text-base px-8 py-6 rounded-md"
        >
          Contact Us &darr;
        </Button>

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
