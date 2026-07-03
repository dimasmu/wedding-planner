import Image from "next/image";

const photos = [
  "pexels-doouglasma-18541917.jpg",
  "pexels-framesbygaurav-37380244.jpg",
  "pexels-juliano-goncalves-1623825-28123495.jpg",
  "pexels-kayaartsss-14788179.jpg",
  "pexels-nashkrys-1406374.jpg",
  "pexels-nguy-n-ti-n-th-nh-2150376175-32459250.jpg",
  "pexels-photography-maghradze-ph-1659410-29237413.jpg",
  "pexels-rebornfilmes-35114147.jpg",
] as const;

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

export function PhotoCollage() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-brand-dark">
      {/* Photo grid background */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-0">
        {/* Row 1 */}
        <div className="relative row-span-2">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[0]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[1]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative row-span-2">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[2]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[3]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        {/* Row 2 */}
        <div className="relative row-span-2">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[4]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative row-span-2">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[5]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[6]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <div className="relative">
          <Image
            src={`/asset/contact_us/collage_photo/${photos[7]}`}
            alt="Wedding moment"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-brand-dark/70" />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-brand-gold/40" />
          <SparklesIcon className="w-4 h-4 text-brand-gold" />
          <div className="h-px w-8 bg-brand-gold/40" />
        </div>
        <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">
          Moments We&rsquo;ve Created
        </h2>
        <p className="text-white/60 text-lg max-w-md mx-auto font-light">
          A glimpse into the weddings we&rsquo;ve had the honor of bringing to life
        </p>
      </div>
    </section>
  );
}
