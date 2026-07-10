import { VenueForm } from "../form";
import { db } from "@/lib/db";

interface VenueData {
  name: string;
  slug: string;
  location: string;
  description: string;
  maxCapacity: number;
  images: string[];
  packages: Array<{
    id?: number;
    name: string;
    pax: number;
    price: number;
    content: string;
    bookingUrl: string;
  }>;
}

async function getVenue(slug: string): Promise<VenueData | null> {
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

export default async function EditVenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await getVenue(slug);

  if (!venue) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-taupe/60">Venue tidak ditemukan.</p>
      </div>
    );
  }

  return <VenueForm mode="edit" initialData={venue} />;
}
