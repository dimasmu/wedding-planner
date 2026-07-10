import { db } from "@/lib/db";
import { VenueCard } from "@/components/venue/VenueCard";

interface VenueData {
  id: number;
  slug: string;
  name: string;
  location: string;
  maxCapacity: number;
  images: string[];
  cheapestPrice: number | null;
}

async function getVenues(): Promise<VenueData[]> {
  const venues = await db.venue.findMany({
    where: { status: "published" },
    include: {
      packages: {
        select: { price: true },
        orderBy: { price: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return venues.map((v) => ({
    id: v.id,
    slug: v.slug,
    name: v.name,
    location: v.location,
    maxCapacity: v.maxCapacity,
    images: JSON.parse(v.images) as string[],
    cheapestPrice: v.packages[0]?.price ? Number(v.packages[0].price) : null,
  }));
}

import { ClientVenueList } from "./client";

export default async function VenuePage() {
  const venues = await getVenues();
  const locations = [...new Set(venues.map((v) => v.location))].sort();

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-3">
            Katalog Venue
          </h1>
          <p className="text-brand-taupe/60 max-w-lg">
            Temukan venue impian Anda dari koleksi terkurasi kami.
          </p>
        </div>

        <ClientVenueList venues={venues} locations={locations} />
      </div>
    </div>
  );
}
