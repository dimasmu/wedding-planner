"use client";

import Image from "next/image";

const clientLogos = [
  "/asset/client/187.png",
  "/asset/client/189.png",
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
  const anim =
    direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  const copies = 3;

  return (
    <div className="overflow-hidden group">
      <div
        className={`flex shrink-0 gap-6 ${anim} group-hover:[animation-play-state:paused]`}
      >
        {Array.from({ length: copies }, (_, ci) =>
          logos.map((logo, i) => (
            <div key={`${ci}-${i}`} className="shrink-0 h-16 relative flex items-center">
              <Image
                src={logo}
                alt={`Logo ${i + 1}`}
                width={120}
                height={64}
                className="h-16 w-auto object-contain opacity-80 hover:opacity-100 hover:scale-110 hover:invert transition-all duration-300"
                unoptimized
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ClientPartnerShowcase() {
  return (
    <section
      className="py-24 overflow-hidden"
      style={{ backgroundColor: "#628E90" }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start gap-0 max-w-6xl mx-auto">
          {/* Left: Clients */}
          <div className="overflow-hidden">
            <h3 className="font-serif text-3xl md:text-4xl text-white text-center mb-8">
              Our Beloved Clients
            </h3>
            <div className="[mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
              <LogoMarquee logos={clientLogos} direction="left" />
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/30 to-transparent mx-8 self-stretch" />

          {/* Right: Partners */}
          <div className="overflow-hidden">
            <h3 className="font-serif text-3xl md:text-4xl text-white text-center mb-8">
              Our Trusted Partners
            </h3>
            <div className="[mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_15%,#000_85%,transparent)]">
              <LogoMarquee logos={partnerLogos} direction="right" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
