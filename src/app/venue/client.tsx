"use client";

import { useState, useMemo } from "react";
import { VenueFilter, type VenueFilters } from "@/components/venue/VenueFilter";
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

const defaultFilters: VenueFilters = {
  search: "",
  location: null,
  minCapacity: "",
  maxCapacity: "",
  minPrice: "",
  maxPrice: "",
};

export function ClientVenueList({
  venues,
  locations,
}: {
  venues: VenueData[];
  locations: string[];
}) {
  const [filters, setFilters] = useState<VenueFilters>(defaultFilters);

  const filtered = useMemo(() => {
    return venues.filter((v) => {
      if (
        filters.search &&
        !v.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.location && v.location !== filters.location) return false;
      if (filters.minCapacity && v.maxCapacity < Number(filters.minCapacity))
        return false;
      if (filters.maxCapacity && v.maxCapacity > Number(filters.maxCapacity))
        return false;
      if (filters.minPrice && (!v.cheapestPrice || v.cheapestPrice < Number(filters.minPrice) * 1_000_000))
        return false;
      if (filters.maxPrice && (!v.cheapestPrice || v.cheapestPrice > Number(filters.maxPrice) * 1_000_000))
        return false;
      return true;
    });
  }, [venues, filters]);

  return (
    <div className="flex gap-8">
      <VenueFilter
        filters={filters}
        locations={locations}
        onFilterChange={setFilters}
      />

      <div className="flex-1">
        <p className="text-sm text-brand-taupe/50 mb-6">
          Menampilkan {filtered.length} dari {venues.length} venue
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-taupe/60 font-serif text-lg mb-4">
              Tidak ada venue yang sesuai dengan filter Anda.
            </p>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="text-brand-gold hover:underline text-sm"
            >
              Hapus semua filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((venue) => (
              <VenueCard
                key={venue.id}
                slug={venue.slug}
                name={venue.name}
                location={venue.location}
                maxCapacity={venue.maxCapacity}
                cheapestPrice={venue.cheapestPrice}
                image={venue.images[0] || ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
