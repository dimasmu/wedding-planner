"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

export interface VenueFilters {
  search: string;
  location: string | null;
  minCapacity: string;
  maxCapacity: string;
  minPrice: string;
  maxPrice: string;
}

interface VenueFilterProps {
  filters: VenueFilters;
  locations: string[];
  onFilterChange: (filters: VenueFilters) => void;
}

const defaultFilters: VenueFilters = {
  search: "",
  location: null,
  minCapacity: "",
  maxCapacity: "",
  minPrice: "",
  maxPrice: "",
};

function FilterContent({
  filters,
  locations,
  onFilterChange,
}: VenueFilterProps) {
  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.minCapacity ||
    filters.maxCapacity ||
    filters.minPrice ||
    filters.maxPrice;

  const clearFilters = () => {
    onFilterChange(defaultFilters);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-brand-taupe text-sm">Cari</Label>
        <Input
          placeholder="Cari venue..."
          value={filters.search}
          onChange={(e) =>
            onFilterChange({ ...filters, search: e.target.value })
          }
          className="mt-2 border-brand-sand bg-white"
        />
      </div>

      <Separator className="bg-brand-sand" />

      <div>
        <Label className="text-brand-taupe text-sm font-semibold">
          Lokasi
        </Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {locations.map((loc) => (
            <Button
              key={loc}
              variant={filters.location === loc ? "default" : "outline"}
              size="sm"
              className={
                filters.location === loc
                  ? "bg-brand-gold text-white text-xs"
                  : "border-brand-sand text-brand-taupe text-xs hover:border-brand-gold"
              }
              onClick={() =>
                onFilterChange({
                  ...filters,
                  location: filters.location === loc ? null : loc,
                })
              }
            >
              {loc}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-brand-sand" />

      <div>
        <Label className="text-brand-taupe text-sm font-semibold">
          Kapasitas Tamu
        </Label>
        <div className="mt-2 flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minCapacity}
            onChange={(e) =>
              onFilterChange({ ...filters, minCapacity: e.target.value })
            }
            className="border-brand-sand bg-white w-24"
          />
          <span className="text-brand-taupe/40">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxCapacity}
            onChange={(e) =>
              onFilterChange({ ...filters, maxCapacity: e.target.value })
            }
            className="border-brand-sand bg-white w-24"
          />
        </div>
      </div>

      <Separator className="bg-brand-sand" />

      <div>
        <Label className="text-brand-taupe text-sm font-semibold">
          Harga (Juta IDR)
        </Label>
        <div className="mt-2 flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, minPrice: e.target.value })
            }
            className="border-brand-sand bg-white w-24"
          />
          <span className="text-brand-taupe/40">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, maxPrice: e.target.value })
            }
            className="border-brand-sand bg-white w-24"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="text-brand-taupe/60 hover:text-red-500"
          onClick={clearFilters}
        >
          <X className="w-3 h-3 mr-1" /> Hapus semua filter
        </Button>
      )}
    </div>
  );
}

export function VenueFilter({
  filters,
  locations,
  onFilterChange,
}: VenueFilterProps) {
  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.minCapacity ||
    filters.maxCapacity ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white border border-brand-sand rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-brand-taupe font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </h3>
          </div>
          <FilterContent
            filters={filters}
            locations={locations}
            onFilterChange={onFilterChange}
          />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                className="border-brand-sand text-brand-taupe gap-2"
              />
            }
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
            )}
          </SheetTrigger>
          <SheetContent side="left" className="bg-brand-cream w-[300px]">
            <SheetHeader>
              <SheetTitle className="font-serif text-brand-taupe">
                Filter
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent
                filters={filters}
                locations={locations}
                onFilterChange={onFilterChange}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
