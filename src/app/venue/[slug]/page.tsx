import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Users, Sparkles, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-brand-dark">
      {/* ── Hero Banner ── */}
      <section className="relative h-[480px] md:h-[520px] overflow-hidden rounded-b-[24px]">
        {/* Background Image */}
        {venue.images[0] ? (
          <>
            <Image
              src={venue.images[0]}
              alt={venue.name}
              fill
              className="object-cover scale-105 animate-[heroZoom_8s_ease-out_forwards]"
              priority
              sizes="100vw"
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-taupe via-brand-taupe/90 to-brand-dark" />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-brand-dark/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/30 to-transparent" />

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent" />

        {/* ── Back Navigation ── */}
        <div className="absolute top-8 left-4 md:left-8 z-20">
          <Link
            href="/venue"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-sm text-white/90 hover:bg-white/20 hover:border-white/20 transition-all duration-300"
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
            <div className="flex items-center justify-center gap-3 text-white/70 text-sm md:text-base mb-6">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-gold/70" />
                {venue.location}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-gold/70" />
                {venue.maxCapacity} Pax
              </span>
            </div>

            {/* Category Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-[11px] px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 rounded-full font-medium">Ballroom</span>
              <span className="text-[11px] px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 rounded-full font-medium">Indoor</span>
              <span className="text-[11px] px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 rounded-full font-medium">Luxury</span>
              <span className="text-[11px] px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 rounded-full font-medium">Hotel</span>
            </div>

            {/* Starting Price */}
            {price && (
              <p className="text-white/90 text-sm md:text-base mb-4">
                <span className="text-white/50">Mulai dari </span>
                <span className="font-semibold text-brand-gold">{formatIDR(price)}</span>
              </p>
            )}

            {/* Description */}
            <p className="text-white/60 text-sm md:text-base leading-relaxed max-w-lg mx-auto mb-8 line-clamp-2">
              {venue.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#packages"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-gold text-white rounded-xl text-sm font-medium hover:bg-brand-gold/90 transition-all duration-300 shadow-lg shadow-brand-gold/20"
              >
                Lihat Paket Wedding
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href="/contact-us"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl text-sm font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300"
              >
                Hubungi Planner
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Placeholder anchor for "View Packages" scroll ── */}
      <div id="packages" className="pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8 bg-brand-gold/40" />
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <div className="h-px w-8 bg-brand-gold/40" />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-white mb-2">Paket Wedding</h2>
            <p className="text-white/40 text-sm">Pilih paket yang sesuai dengan kebutuhan Anda</p>
          </div>

          {venue.packages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {venue.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-serif text-lg text-white font-semibold mb-1">{pkg.name}</h3>
                      <span className="text-xs px-2.5 py-0.5 bg-brand-gold/20 text-brand-gold rounded-full font-medium">
                        <Users className="w-3 h-3 inline mr-1" /> {pkg.pax} Pax
                      </span>
                    </div>
                    <span className="text-xl font-bold text-brand-gold">{formatIDR(pkg.price)}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-2 text-sm text-white/60">
                        <Sparkles className="w-3.5 h-3.5 text-brand-gold/60 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={pkg.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-brand-gold text-white rounded-xl text-sm font-medium text-center hover:bg-brand-gold/90 transition-colors"
                  >
                    Pesan Sekarang
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
