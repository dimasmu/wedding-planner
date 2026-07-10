import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";

interface VenueRow {
  id: number;
  slug: string;
  name: string;
  location: string;
  maxCapacity: number;
  packageCount: number;
  status: string;
}

interface PageData {
  venues: VenueRow[];
  total: number;
  page: number;
  totalPages: number;
}

async function getVenues(page: number, search: string): Promise<PageData> {
  const perPage = 10;
  const where = search
    ? { name: { contains: search } }
    : {};

  const [venues, total] = await Promise.all([
    db.venue.findMany({
      where,
      include: {
        _count: { select: { packages: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    db.venue.count({ where }),
  ]);

  return {
    venues: venues.map((v) => ({
      id: v.id,
      slug: v.slug,
      name: v.name,
      location: v.location,
      maxCapacity: v.maxCapacity,
      packageCount: v._count.packages,
      status: v.status,
    })),
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  };
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
