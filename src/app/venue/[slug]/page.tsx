import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Users, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

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
    <div className="min-h-screen bg-brand-cream">
      {/* ── Hero Banner ── */}
      <section className="relative h-[480px] md:h-[520px] overflow-hidden rounded-b-[24px]">
        {/* Background Image */}
        {venue.images[0] ? (
          <Image
            src={venue.images[0]}
            alt={venue.name}
            fill
            className="object-cover scale-105 animate-[heroZoom_8s_ease-out_forwards]"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-taupe via-brand-taupe/90 to-brand-dark" />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-brand-dark/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-brand-dark/20 to-transparent" />

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-cream to-transparent" />

        {/* ── Back Navigation ── */}
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <Link
            href="/venue"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-full text-sm text-white hover:bg-white/30 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
          </Link>
        </div>

        {/* ── Hero Content ── */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-2xl mx-auto">
            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-brand-gold/50" />
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-brand-gold/50" />
            </div>

            {/* Hotel Name */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white mb-5 tracking-tight leading-[1.1]">
              {venue.name}
            </h1>

            {/* Location + Capacity */}
            <div className="flex items-center justify-center gap-3 text-white/80 text-sm md:text-base mb-6">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-gold/70" />
                {venue.location}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-gold/70" />
                {venue.maxCapacity} Pax
              </span>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
              <span className="text-[11px] px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/15 text-white/90 rounded-full font-medium">Ballroom</span>
              <span className="text-[11px] px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/15 text-white/90 rounded-full font-medium">Indoor</span>
              <span className="text-[11px] px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/15 text-white/90 rounded-full font-medium">Luxury</span>
              <span className="text-[11px] px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/15 text-white/90 rounded-full font-medium">Hotel</span>
            </div>

            {/* Starting Price */}
            {price && (
              <p className="text-white/90 text-sm md:text-base">
                <span className="text-white/60">Mulai dari </span>
                <span className="font-semibold text-brand-gold">{formatIDR(price)}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Description ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-brand-dark/5 border border-brand-sand/50 p-8 md:p-10">
          <p className="text-brand-taupe/70 leading-relaxed text-base md:text-lg">
            {venue.description}
          </p>
        </div>
      </div>

      {/* ── Packages ── */}
      {venue.packages.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-20">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-brand-gold/40" />
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <div className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-2">Paket Wedding</h2>
            <p className="text-brand-taupe/50 text-sm">Pilih paket yang sesuai dengan kebutuhan Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venue.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl shadow-lg shadow-brand-dark/3 border border-brand-sand/50 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-serif text-lg text-brand-taupe font-semibold mb-1">{pkg.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 bg-brand-gold/10 text-brand-gold rounded-full font-medium">
                      <Users className="w-3 h-3 inline mr-1" /> {pkg.pax} Pax
                    </span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-brand-taupe mb-6">{formatIDR(pkg.price)}</p>
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-brand-taupe/65">
                      <Sparkles className="w-3.5 h-3.5 text-brand-gold/60 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={pkg.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-brand-gold text-white rounded-xl text-sm font-medium text-center hover:bg-brand-taupe transition-colors"
                >
                  Pesan Sekarang
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
