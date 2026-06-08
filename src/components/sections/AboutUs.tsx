import Image from "next/image";

export function AboutUs() {
  return (
    <section className="py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-brand-gold/20 shadow-lg shadow-brand-gold/5">
            <Image
              src="/asset/about_us/StockSnap_NABNCHL6PX.jpg"
              alt="SOLA event planning team at work"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-5 mb-6">
              <Image
                src="/asset/about_us/sola-logo-2.png"
                alt="SOLA"
                width={200}
                height={120}
                className="h-[4.5rem] md:h-[5.5rem] lg:h-[7.5rem] w-auto shrink-0"
              />
              <div className="font-serif text-3xl md:text-4xl lg:text-5xl text-brand-taupe leading-tight">
                EVENT PLANNER
                <br />
                &amp; ORGANIZER
              </div>
            </div>
            <p className="text-brand-taupe/70 leading-relaxed text-base md:text-lg">
              Turn your event dreams into reality with SOLA! We&rsquo;re a
              passionate event planning and orchestration team, dedicated to
              crafting unforgettable experiences tailored just for you. Whether
              you envision a grand celebration or an intimate gathering, we
              handle every detail with meticulous care and professionalism. From
              pinpointing the perfect venue to seamlessly coordinating with
              vendors, we&rsquo;ll work hand-in-hand to understand your
              preferences, budget, and the unique vibe you desire. Let SOLA
              orchestrate your next event &ndash; it&rsquo;ll be nothing short
              of extraordinary!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
