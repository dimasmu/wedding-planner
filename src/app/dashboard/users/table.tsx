"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface PageData {
  users: UserRow[];
  total: number;
  page: number;
  totalPages: number;
}

const roleColors: Record<string, string> = {
  admin: "bg-brand-gold/10 text-brand-gold",
  editor: "bg-blue-50 text-blue-600",
  couple: "bg-gray-100 text-gray-600",
};

export function UserTable({
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
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const data = initialData;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/dashboard/users?search=${encodeURIComponent(search)}&page=1`);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        toast(err.error || "Gagal menghapus pengguna");
        return;
      }
      toast.success("Pengguna berhasil dihapus");
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast("Gagal menghapus pengguna");
    } finally {
      setDeleting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast(err.error || "Gagal mengubah peran");
        return;
      }
      toast.success("Peran berhasil diubah");
      router.refresh();
    } catch {
      toast("Gagal mengubah peran");
    }
  };

  const changePage = (newPage: number) => {
    router.push(`/dashboard/users?search=${encodeURIComponent(search)}&page=${newPage}`);
  };

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <Input
          placeholder="Cari nama atau email..."
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
              <TableHead className="font-serif text-brand-taupe">Email</TableHead>
              <TableHead className="font-serif text-brand-taupe">Peran</TableHead>
              <TableHead className="font-serif text-brand-taupe text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-brand-taupe">{user.name}</TableCell>
                <TableCell className="text-brand-taupe/70">{user.email}</TableCell>
                <TableCell>
                  <Badge className={roleColors[user.role] || ""}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Select
                      value={user.role}
                      onValueChange={(v) => handleRoleChange(user.id, v)}
                    >
                      <SelectTrigger className="w-28 h-8 text-xs border-brand-sand">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="couple">Couple</SelectItem>
                        {user.role === "admin" && <SelectItem value="admin">Admin</SelectItem>}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-brand-taupe/60 hover:text-red-500"
                      onClick={() => setDeleteTarget(user)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-brand-taupe/60">
            Halaman {data.page} dari {data.totalPages} ({data.total} total)
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-brand-sand" disabled={data.page <= 1} onClick={() => changePage(data.page - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === data.page ? "default" : "outline"}
                size="sm"
                className={p === data.page ? "bg-brand-gold text-white" : "border-brand-sand text-brand-taupe"}
                onClick={() => changePage(p)}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="border-brand-sand" disabled={data.page >= data.totalPages} onClick={() => changePage(data.page + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="bg-white border-brand-sand">
          <DialogHeader>
            <DialogTitle className="font-serif text-brand-taupe">Hapus Pengguna</DialogTitle>
            <DialogDescription className="text-brand-taupe/60">
              Apakah Anda yakin ingin menghapus &quot;{deleteTarget?.name}&quot;? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="border-brand-sand text-brand-taupe" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="default" className="bg-red-500 text-white hover:bg-red-600" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
