import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Users, ImageIcon, Sparkles, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PackageComparison } from "./comparison";

interface PackageData {
  id: number;
  name: string;
  pax: number;
  price: number;
  features: string[];
  bookingUrl: string;
}

interface VenueDetail {
  id: number;
  name: string;
  location: string;
  description: string;
  maxCapacity: number;
  images: string[];
  packages: PackageData[];
}

async function getVenue(slug: string): Promise<VenueDetail | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/venues/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.venue;
}

function formatIDR(amount: number): string {
  return "Rp " + amount.toLocaleString("id-ID");
}

function cheapestPrice(packages: PackageData[]): number | null {
  if (packages.length === 0) return null;
  return Math.min(...packages.map((p) => p.price));
}

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await getVenue(slug);
  if (!venue) notFound();

  const price = cheapestPrice(venue.packages);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ── Back Navigation ── */}
      <div className="absolute top-24 left-4 md:left-8 z-20">
        <Link
          href="/venue"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm text-brand-taupe/70 hover:text-brand-taupe shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative h-[360px] md:h-[420px] overflow-hidden">
        {venue.images[0] ? (
          <Image
            src={venue.images[0]}
            alt={venue.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-taupe via-brand-taupe/80 to-brand-dark" />
        )}
        <div className="absolute inset-0 bg-brand-dark/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 via-transparent to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-white/40" />
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <div className="h-px w-8 bg-white/40" />
          </div>
          <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white mb-3 tracking-tight">
            {venue.name}
          </h1>
          <p className="text-white/70 text-sm md:text-base flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {venue.location}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {venue.maxCapacity} Pax
            </span>
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF8F5] to-transparent" />
      </section>

      {/* ── Floating Info Card ── */}
      <div className="relative z-10 -mt-16 max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-3xl shadow-2xl shadow-brand-dark/5 border border-brand-sand/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Image */}
            <div className="lg:col-span-2 relative min-h-[280px] lg:min-h-full">
              {venue.images[0] ? (
                <Image
                  src={venue.images[0]}
                  alt={venue.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-brand-gold/20" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:col-span-3 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full font-medium">Ballroom</span>
                <span className="text-xs px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full font-medium">Indoor</span>
                <span className="text-xs px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full font-medium">Luxury</span>
                <span className="text-xs px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full font-medium">Hotel</span>
              </div>

              <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-3">
                {venue.name}
              </h2>

              <div className="flex flex-wrap items-center gap-5 text-sm text-brand-taupe/60 mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-gold" /> {venue.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-gold" /> {venue.maxCapacity} Pax
                </span>
                {price && (
                  <span className="font-semibold text-brand-gold">
                    Mulai dari {formatIDR(price)}
                  </span>
                )}
              </div>

              <p className="text-brand-taupe/60 text-sm md:text-base leading-relaxed line-clamp-3">
                {venue.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Sections ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 space-y-20">
        {/* Gallery */}
        {venue.images.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-brand-gold/40" />
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <div className="h-px w-8 bg-brand-gold/40" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe">Galeri</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {venue.images.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-2xl group ${
                    i === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <div className="aspect-[4/3] md:aspect-auto md:h-full md:min-h-[240px]">
                    <Image
                      src={img}
                      alt={`${venue.name} gallery ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                  <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/10 transition-colors duration-300 rounded-2xl" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        <section>
          <div className="bg-white rounded-3xl shadow-lg shadow-brand-dark/3 border border-brand-sand/50 p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-brand-gold/40" />
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <div className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-6">Tentang Venue Ini</h2>
            <p className="text-brand-taupe/70 leading-relaxed text-base md:text-lg max-w-3xl">
              {venue.description}
            </p>
          </div>
        </section>

        {/* Packages */}
        {venue.packages.length > 0 && (
          <section>
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-brand-gold/40" />
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <div className="h-px w-8 bg-brand-gold/40" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-2">Paket Wedding</h2>
              <p className="text-brand-taupe/50 text-sm">Pilih paket yang sesuai dengan kebutuhan Anda</p>
            </div>
            <PackageComparison venue={venue} />
          </section>
        )}
      </div>
    </div>
  );
}
