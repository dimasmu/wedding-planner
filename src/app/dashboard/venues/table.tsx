"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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

export function VenueTable({
  initialData,
  initialSearch,
  initialPage,
}: {
  initialData: PageData;
  initialSearch: string;
  initialPage: number;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [deleteTarget, setDeleteTarget] = useState<VenueRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<number | null>(null);

  const data = initialData;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard/venues?search=${encodeURIComponent(search)}&page=1`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/venues/${deleteTarget.slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      // handle error silently
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (venue: VenueRow) => {
    setToggling(venue.id);
    try {
      const newStatus = venue.status === "published" ? "draft" : "published";
      await fetch(`/api/venues/${venue.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      toast.success(newStatus === "published" ? "Venue dipublikasikan" : "Venue di-unpublish");
      router.refresh();
    } catch {
      toast("Gagal mengubah status");
    } finally {
      setToggling(null);
    }
  };

  const changePage = (newPage: number) => {
    router.push(
      `/dashboard/venues?search=${encodeURIComponent(search)}&page=${newPage}`
    );
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <Input
          placeholder="Cari venue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-brand-sand bg-white"
        />
        <Button type="submit" variant="outline" className="border-brand-sand text-brand-taupe">
          <Search className="w-4 h-4" />
        </Button>
      </form>

      <div className="bg-white rounded-xl border border-brand-sand shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-serif text-brand-taupe">Nama</TableHead>
              <TableHead className="font-serif text-brand-taupe">Lokasi</TableHead>
              <TableHead className="font-serif text-brand-taupe">Kapasitas</TableHead>
              <TableHead className="font-serif text-brand-taupe">Paket</TableHead>
              <TableHead className="font-serif text-brand-taupe">Status</TableHead>
              <TableHead className="font-serif text-brand-taupe text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.venues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-brand-taupe/60">
                  Belum ada venue. Tambah venue pertama Anda.
                </TableCell>
              </TableRow>
            ) : (
              data.venues.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell className="font-medium text-brand-taupe">
                    {venue.name}
                  </TableCell>
                  <TableCell className="text-brand-taupe/70">{venue.location}</TableCell>
                  <TableCell className="text-brand-taupe/70">{venue.maxCapacity}</TableCell>
                  <TableCell className="text-brand-taupe/70">{venue.packageCount}</TableCell>
                  <TableCell>
                    <Badge className={venue.status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}>
                      {venue.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/venues/${venue.slug}`}>
                        <Button variant="ghost" size="icon" className="text-brand-taupe/60 hover:text-brand-gold">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-brand-taupe/60 hover:text-brand-gold"
                        onClick={() => handleToggleStatus(venue)}
                        disabled={toggling === venue.id}
                        title={venue.status === "published" ? "Unpublish" : "Publish"}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-brand-taupe/60 hover:text-red-500"
                        onClick={() => setDeleteTarget(venue)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-brand-taupe/60">
            Menampilkan halaman {data.page} dari {data.totalPages} ({data.total} total)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-brand-sand text-brand-taupe"
              disabled={data.page <= 1}
              onClick={() => changePage(data.page - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === data.page ? "default" : "outline"}
                size="sm"
                className={
                  p === data.page
                    ? "bg-brand-gold text-white"
                    : "border-brand-sand text-brand-taupe"
                }
                onClick={() => changePage(p)}
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="border-brand-sand text-brand-taupe"
              disabled={data.page >= data.totalPages}
              onClick={() => changePage(data.page + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-white border-brand-sand">
          <DialogHeader>
            <DialogTitle className="font-serif text-brand-taupe">Hapus Venue</DialogTitle>
            <DialogDescription className="text-brand-taupe/60">
              Apakah Anda yakin ingin menghapus &quot;{deleteTarget?.name}&quot;? Semua paket yang terkait juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-brand-sand text-brand-taupe"
              onClick={() => setDeleteTarget(null)}
            >
              Batal
            </Button>
            <Button
              variant="default"
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
