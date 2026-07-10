import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Users, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

interface PackageData {
  id: number;
  name: string;
  pax: number;
  price: number;
  content: string;
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
  const venue = await db.venue.findUnique({
    where: { slug },
    include: { packages: { orderBy: { price: "asc" } } },
  });
  if (!venue) return null;
  return {
    ...venue,
    images: JSON.parse(venue.images) as string[],
    packages: venue.packages.map((pkg) => ({
      ...pkg,
      price: Number(pkg.price),
    })),
  };
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
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ── Hero ── */}
      <section className="relative h-[380px] md:h-[440px] overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-br from-brand-taupe via-brand-taupe/90 to-brand-dark" />
        )}
        <div className="absolute inset-0 bg-brand-dark/50" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FDFBF7] to-transparent" />

        {/* Back */}
        <div className="absolute top-6 left-4 md:left-8 z-20">
          <Link
            href="/venue"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-sm text-white/90 hover:bg-white/25 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Link>
        </div>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.15]">
            {venue.name}
          </h1>
        </div>
      </section>

      {/* ── Meta Info Bar ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-brand-taupe/55 text-sm md:text-base">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-gold/50" />
            {venue.location}
          </span>
          <span className="w-1 h-1 rounded-full bg-brand-gold/25" />
          <span className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-gold/50" />
            {venue.maxCapacity} tamu
          </span>
          {price && (
            <>
              <span className="w-1 h-1 rounded-full bg-brand-gold/25" />
              <span className="font-semibold text-brand-gold">{formatIDR(price)}</span>
            </>
          )}
        </div>
      </div>

      {/* ── Description ── */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brand-gold/25" />
          <Sparkles className="w-4 h-4 text-brand-gold/60" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brand-gold/25" />
        </div>
        <p className="text-brand-taupe/65 leading-relaxed text-base md:text-lg">
          {venue.description}
        </p>
      </section>

      {/* ── Packages ── */}
      {venue.packages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe">Paket Wedding</h2>
            <p className="text-brand-taupe/45 text-sm mt-1">
              Pilih paket yang sesuai dengan kebutuhan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border border-brand-sand/60 p-6 md:p-8 hover:border-brand-gold/30 hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <div className="mb-5">
                  <span className="text-xs text-brand-gold/70 font-medium bg-brand-gold/5 px-2.5 py-1 rounded-full">
                    {pkg.pax} tamu
                  </span>
                </div>
                <h3 className="font-serif text-lg text-brand-taupe font-semibold mb-1">
                  {pkg.name}
                </h3>
                <p className="text-2xl font-bold text-brand-taupe mt-2 mb-5">
                  {formatIDR(pkg.price)}
                </p>
                {pkg.content && (
                  <div
                    className="prose prose-sm max-w-none mb-6 flex-1 text-brand-taupe/55 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-brand-taupe/60 [&_h3]:mb-2 [&_h3]:mt-3 [&_ul]:pl-4 [&_ul]:space-y-1 [&_ul]:my-2 [&_li]:text-brand-taupe/50 [&_li]:text-sm"
                    dangerouslySetInnerHTML={{ __html: pkg.content }}
                  />
                )}
                <a
                  href={pkg.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-brand-gold text-white rounded-xl text-sm font-medium text-center hover:bg-brand-taupe transition-colors mt-auto"
                >
                  Pesan Sekarang
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state: no packages ── */}
      {venue.packages.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-20">
          <div className="text-center py-16">
            <p className="text-brand-taupe/40 font-serif text-lg">
              Belum ada paket tersedia untuk venue ini.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
