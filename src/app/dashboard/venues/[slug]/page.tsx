import { VenueForm } from "../form";

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
  const res = await fetch(`/api/venues/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.venue;
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
