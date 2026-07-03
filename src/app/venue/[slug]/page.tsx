import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Users, ImageIcon } from "lucide-react";
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
  const res = await fetch(`${baseUrl}/api/venues/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.venue;
}

function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-16">
      <div className="h-px w-12 bg-brand-gold/40" />
      <div className="w-2 h-2 rounded-full bg-brand-gold/40" />
      <div className="h-px w-12 bg-brand-gold/40" />
    </div>
  );
}

import { PackageComparison } from "./comparison";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await getVenue(slug);

  if (!venue) notFound();

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Back button */}
      <div className="container mx-auto px-4 pt-8">
        <Link
          href="/venue"
          className="inline-flex items-center gap-2 text-brand-taupe/60 hover:text-brand-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </Link>
      </div>

      {/* Image Gallery */}
      <div className="container mx-auto px-4 pt-8 max-w-5xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden">
          {venue.images.length > 0 ? (
            venue.images.map((img, i) => (
              <div
                key={i}
                className={`relative ${i === 0 ? "col-span-2 row-span-2" : ""} min-h-[200px]`}
              >
                <Image
                  src={img}
                  alt={`${venue.name} photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full min-h-[250px] bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center rounded-2xl">
              <ImageIcon className="w-16 h-16 text-brand-gold/30" />
            </div>
          )}
        </div>
      </div>

      {/* Venue Header */}
      <div className="container mx-auto px-4 pt-10 max-w-5xl">
        <h1 className="font-serif text-3xl md:text-5xl text-brand-taupe mb-4">
          {venue.name}
        </h1>
        <div className="flex items-center gap-6 text-brand-taupe/60 mb-8">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> {venue.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-4 h-4" /> Kapasitas {venue.maxCapacity} tamu
          </span>
        </div>
      </div>

      <SectionDivider />

      {/* About */}
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-6 text-center">
          Tentang Venue Ini
        </h2>
        <p className="text-brand-taupe/70 leading-relaxed text-base md:text-lg">
          {venue.description}
        </p>
      </div>

      <SectionDivider />

      {/* Packages */}
      <div className="container mx-auto px-4 max-w-5xl pb-20">
        <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe mb-10 text-center">
          Paket Tersedia
        </h2>

        <PackageComparison venue={venue} />
      </div>
    </div>
  );
}
