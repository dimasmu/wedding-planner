import { ContactVideoHero } from "@/components/sections/ContactVideoHero";
import { PhotoCollage } from "@/components/sections/PhotoCollage";
import { ContactInfoSection } from "@/components/sections/ContactInfoSection";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { RevealSection } from "@/components/ui-custom/RevealSection";
import Link from "next/link";

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29.94 29.94 0 0 0 1 12a29.94 29.94 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29.94 29.94 0 0 0 23 12a29.94 29.94 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
      </svg>
    ),
  },
];

export default function ContactUsPage() {
  return (
    <>
      {/* 1. Video Hero */}
      <ContactVideoHero />

      {/* 2. Photo Collage */}
      <RevealSection>
        <PhotoCollage />
      </RevealSection>

      {/* 3. Contact Info + Form — Two Columns */}
      <section className="py-28 bg-brand-cream">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <RevealSection>
              <ContactInfoSection />
            </RevealSection>
            <RevealSection delay={100}>
              <ContactFormSection />
            </RevealSection>
          </div>
        </div>
      </section>

      {/* 4. FAQ Accordion */}
      <RevealSection>
        <FAQAccordion />
      </RevealSection>

      {/* 5. Social Media — Connect With Us */}
      <RevealSection>
        <section className="py-32 md:py-40 bg-brand-cream relative overflow-hidden">
          {/* Background ornament */}
          <div
            className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.03]"
            style={{
              background:
                "radial-gradient(circle, rgb(211 162 127) 0%, transparent 70%)",
            }}
          />

          <div className="container mx-auto px-6 max-w-5xl relative z-10">
            <RevealSection>
              <div className="text-center mb-20">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-8 bg-brand-gold/40" />
                  <SparklesIcon className="w-4 h-4 text-brand-gold" />
                  <div className="h-px w-8 bg-brand-gold/40" />
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-brand-taupe mb-4">
                  Connect With Us
                </h2>
                <p className="text-brand-taupe/70 text-lg font-light max-w-md mx-auto">
                  Stay inspired — follow our journey and see the magic we create every day
                </p>
              </div>
            </RevealSection>

            <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl border border-brand-gold/10 shadow-lg shadow-brand-gold/5 p-10 md:p-14">
              <div className="grid grid-cols-3 gap-6 md:gap-10">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex flex-col items-center gap-1.5 text-brand-taupe/40 hover:text-brand-gold hover:scale-110 transition-all duration-300"
                  >
                    {social.icon}
                    <span className="text-[10px] tracking-[0.15em] uppercase">
                      {social.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>
    </>
  );
}
