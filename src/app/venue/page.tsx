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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/venues`, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.venues;
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
