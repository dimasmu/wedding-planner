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
import { VendorFilters } from "@/lib/types/vendor";

interface VendorFilterProps {
  filters: VendorFilters;
  onFilterChange: (filters: VendorFilters) => void;
}

const CATEGORIES = ["Photography", "Videography", "Catering", "Decoration", "Venue", "Music & DJ"];
const LOCATIONS = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta", "Medan"];

interface FilterContentProps {
  filters: VendorFilters;
  onFilterChange: (filters: VendorFilters) => void;
}

function FilterContent({ filters, onFilterChange }: FilterContentProps) {
  const hasActiveFilters =
    filters.category || filters.location || filters.rating || filters.search;

  const clearFilters = () => {
    onFilterChange({ category: null, location: null, priceRange: null, rating: null, search: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-brand-taupe text-sm">Search</Label>
        <Input
          placeholder="Search vendors..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="mt-2 border-brand-sand"
        />
      </div>

      <Separator className="bg-brand-sand" />

      <div>
        <Label className="text-brand-taupe text-sm font-semibold">Category</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={filters.category === cat ? "default" : "outline"}
              size="sm"
              className={
                filters.category === cat
                  ? "bg-brand-gold text-white text-xs"
                  : "border-brand-sand text-brand-taupe text-xs hover:border-brand-gold"
              }
              onClick={() =>
                onFilterChange({
                  ...filters,
                  category: filters.category === cat ? null : cat,
                })
              }
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-brand-sand" />

      <div>
        <Label className="text-brand-taupe text-sm font-semibold">Location</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {LOCATIONS.map((loc) => (
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
        <Label className="text-brand-taupe text-sm font-semibold">Minimum Rating</Label>
        <div className="mt-2 flex gap-2">
          {[4.5, 4, 3].map((r) => (
            <Button
              key={r}
              variant={filters.rating === r ? "default" : "outline"}
              size="sm"
              className={
                filters.rating === r
                  ? "bg-brand-gold text-white text-xs"
                  : "border-brand-sand text-brand-taupe text-xs hover:border-brand-gold"
              }
              onClick={() =>
                onFilterChange({
                  ...filters,
                  rating: filters.rating === r ? null : r,
                })
              }
            >
              {r}+ ★
            </Button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="text-brand-taupe/60 hover:text-red-500"
          onClick={clearFilters}
        >
          <X className="w-3 h-3 mr-1" /> Clear all filters
        </Button>
      )}
    </div>
  );
}

export function VendorFilter({ filters, onFilterChange }: VendorFilterProps) {
  const hasActiveFilters =
    filters.category || filters.location || filters.rating || filters.search;

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white border border-brand-sand rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-brand-taupe font-semibold flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
          </div>
          <FilterContent filters={filters} onFilterChange={onFilterChange} />
        </div>
      </aside>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" className="border-brand-sand text-brand-taupe gap-2" />
            }
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-brand-gold" />
            )}
          </SheetTrigger>
          <SheetContent side="left" className="bg-brand-cream w-[300px]">
            <SheetHeader>
              <SheetTitle className="font-serif text-brand-taupe">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent filters={filters} onFilterChange={onFilterChange} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
