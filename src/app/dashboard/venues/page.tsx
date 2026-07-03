import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface VenueRow {
  id: number;
  slug: string;
  name: string;
  location: string;
  maxCapacity: number;
  packageCount: number;
}

interface PageData {
  venues: VenueRow[];
  total: number;
  page: number;
  totalPages: number;
}

async function getVenues(page: number, search: string): Promise<PageData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/venues?page=${page}&perPage=10&search=${encodeURIComponent(search || "")}`,
    { cache: "no-store" }
  );
  if (!res.ok) return { venues: [], total: 0, page: 1, totalPages: 1 };
  return res.json();
}

import { VenueTable } from "./table";

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const search = params.search || "";
  const data = await getVenues(page, search);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe">
            Kelola Venue
          </h1>
          <p className="text-brand-taupe/60 mt-1">
            Tambah, edit, atau hapus data venue dan paket.
          </p>
        </div>
        <Link href="/dashboard/venues/new">
          <Button className="bg-brand-gold text-white hover:bg-brand-taupe transition-colors">
            <Plus className="w-4 h-4 mr-2" /> Tambah Venue
          </Button>
        </Link>
      </div>

      <VenueTable
        initialData={data}
        initialSearch={search}
        initialPage={page}
      />
    </div>
  );
}
