export interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  image: string;
  description: string;
  tags: string[];
}

export interface VendorFilters {
  category: string | null;
  location: string | null;
  priceRange: [number, number] | null;
  rating: number | null;
  search: string;
}
