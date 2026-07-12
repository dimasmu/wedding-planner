import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { VenueHero } from "./venue-hero";
import { ImageGallery } from "./image-gallery";
import { AboutSection } from "./about-section";
import { PackageCard } from "./package-card";
import { FooterCTA } from "./footer-cta";

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
  const bookingUrl = venue.packages[0]?.bookingUrl || "";

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <VenueHero
        name={venue.name}
        location={venue.location}
        description={venue.description}
        maxCapacity={venue.maxCapacity}
        cheapestPrice={price}
        image={venue.images[0] || null}
        bookingUrl={bookingUrl}
      />
      
      {/* About */}
      <AboutSection
        description={venue.description}
        location={venue.location}
        maxCapacity={venue.maxCapacity}
        cheapestPrice={price}
      />

      {/* Packages */}
      {venue.packages.length > 0 && (
        <section id="packages-section" className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="font-serif text-2xl md:text-3xl text-brand-taupe">
              Paket Wedding
            </h2>
            <p className="text-brand-taupe/45 text-sm mt-2">
              Pilih paket yang sesuai dengan kebutuhan Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {venue.packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {venue.packages.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center py-16">
            <p className="text-brand-taupe/40 font-serif text-lg">
              Belum ada paket tersedia untuk venue ini.
            </p>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <FooterCTA bookingUrl={bookingUrl} />

      {/* Bottom divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-brand-sand to-transparent" />
    </div>
  );
}
