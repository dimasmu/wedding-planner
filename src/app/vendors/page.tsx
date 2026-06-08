"use client";

import { useState, useMemo } from "react";
import { VendorFilter } from "@/components/marketplace/VendorFilter";
import { VendorCard } from "@/components/marketplace/VendorCard";
import { VendorDetailDialog } from "@/components/marketplace/VendorDetailDialog";
import { vendors } from "@/lib/data/vendors";
import { Vendor, VendorFilters } from "@/lib/types/vendor";

export default function VendorsPage() {
  const [filters, setFilters] = useState<VendorFilters>({
    category: null, location: null, priceRange: null, rating: null, search: "",
  });
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (filters.search && !v.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category && v.category !== filters.category) return false;
      if (filters.location && v.location !== filters.location) return false;
      if (filters.rating && v.rating < filters.rating) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-brand-taupe mb-3">
            Find Your Perfect Vendor
          </h1>
          <p className="text-brand-taupe/60 max-w-lg">
            Browse our curated collection of trusted wedding professionals.
          </p>
        </div>

        <div className="flex gap-8">
          <VendorFilter filters={filters} onFilterChange={setFilters} />

          <div className="flex-1">
            <p className="text-sm text-brand-taupe/50 mb-6">
              Showing {filteredVendors.length} of {vendors.length} vendors
            </p>

            {filteredVendors.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-brand-taupe/60 font-serif text-lg">
                  No vendors match your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => (
                  <VendorCard
                    key={vendor.id}
                    vendor={vendor}
                    onClick={(v) => {
                      setSelectedVendor(v);
                      setDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <VendorDetailDialog
        vendor={selectedVendor}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
