"use client";

import Image from "next/image";

const clientLogos = [
  "/asset/client/187.png",
  "/asset/client/189.png",
  "/asset/client/190 (1).png",
  "/asset/client/190.png",
  "/asset/client/191.png",
  "/asset/client/192.png",
  "/asset/client/193.png",
  "/asset/client/Our-Clients-6 (1).png",
  "/asset/client/Our-Clients-6.png",
];

const partnerLogos = [
  "/asset/partner/154.png",
  "/asset/partner/179.png",
  "/asset/partner/181.png",
  "/asset/partner/183.png",
  "/asset/partner/184.png",
  "/asset/partner/185.png",
  "/asset/partner/186.png",
  "/asset/partner/196.png",
  "/asset/partner/197.png",
  "/asset/partner/199.png",
];

function LogoMarquee({ logos, direction }: { logos: string[]; direction: "left" | "right" }) {
  const animationClass =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="overflow-hidden group">
      <div
        className={`flex shrink-0 gap-10 ${animationClass} group-hover:[animation-play-state:paused]`}
      >
        {logos.map((logo, i) => (
          <div key={`a-${i}`} className="shrink-0 h-20 w-auto relative flex items-center">
            <Image
              src={logo}
              alt={`Logo ${i + 1}`}
              width={160}
              height={80}
              className="h-20 w-auto object-contain invert opacity-70 hover:invert-0 hover:opacity-100 transition-all duration-300"
              unoptimized
            />
          </div>
        ))}
        {/* Duplicate set for seamless loop */}
        {logos.map((logo, i) => (
          <div key={`b-${i}`} className="shrink-0 h-20 w-auto relative flex items-center">
            <Image
              src={logo}
              alt={`Logo ${i + 1}`}
              width={160}
              height={80}
              className="h-20 w-auto object-contain invert opacity-70 hover:invert-0 hover:opacity-100 transition-all duration-300"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClientPartnerShowcase() {
  return (
    <section className="py-24 bg-[#628E90] overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-0 max-w-6xl mx-auto">
          {/* Left: Clients */}
          <div className="overflow-hidden">
            <h3 className="font-serif text-2xl md:text-3xl text-white text-center mb-8">
              Our Beloved Clients
            </h3>
            <div className="[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
              <LogoMarquee logos={clientLogos} direction="left" />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent mx-8 self-stretch" />

          {/* Right: Partners */}
          <div className="overflow-hidden">
            <h3 className="font-serif text-2xl md:text-3xl text-white text-center mb-8">
              Our Trusted Partners
            </h3>
            <div className="[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
              <LogoMarquee logos={partnerLogos} direction="right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
