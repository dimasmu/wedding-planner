import Image from "next/image";
import { Sparkles } from "lucide-react";

const photos = [
  "pexels-doouglasma-18541917.jpg",
  "pexels-framesbygaurav-37380244.jpg",
  "pexels-juliano-goncalves-1623825-28123495.jpg",
  "pexels-kayaartsss-14788179.jpg",
  "pexels-nashkrys-1406374.jpg",
  "pexels-nguy-n-ti-n-th-nh-2150376175-32459250.jpg",
  "pexels-photography-maghradze-ph-1659410-29237413.jpg",
  "pexels-rebornfilmes-35114147.jpg",
];

const collageLayout = [
  { span: "row-span-2" },
  { span: "" },
  { span: "row-span-2" },
  { span: "" },
  { span: "row-span-2" },
  { span: "row-span-2" },
  { span: "" },
  { span: "" },
] as const;

export function PhotoCollage() {
  return (
    <section className="relative py-32 md:py-40 overflow-hidden bg-brand-dark">
      {/* Photo grid background */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-0">
        {photos.map((photo, i) => (
          <div
            key={photo}
            className={`relative aspect-[3/4] ${collageLayout[i].span}`}
          >
            <Image
              src={`/asset/contact_us/collage_photo/${photo}`}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-brand-dark/70" />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-8 bg-brand-gold/40" />
          <Sparkles className="w-4 h-4 text-brand-gold" />
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
