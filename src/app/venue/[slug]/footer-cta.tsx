import { Sparkles } from "lucide-react";

interface FooterCTAProps {
  bookingUrl: string;
}

export function FooterCTA({ bookingUrl }: FooterCTAProps) {
  return (
    <section className="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-28 text-center">
      <Sparkles className="w-6 h-6 text-brand-gold/40 mx-auto mb-5" />
      <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-3">
        Siap Merencanakan Pernikahan Impian Anda?
      </h2>
      <p className="text-brand-taupe/50 mb-8 max-w-md mx-auto">
        Konsultasikan kebutuhan pernikahan Anda dengan tim kami dan dapatkan penawaran terbaik.
      </p>
      <a
        href={bookingUrl || "#"}
        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-gold text-white rounded-full text-sm font-medium hover:bg-brand-taupe transition-colors shadow-lg shadow-brand-gold/20"
      >
        Konsultasi Gratis
      </a>
    </section>
  );
}
