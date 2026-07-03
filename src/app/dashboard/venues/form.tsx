"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Loader2, ImageIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

const packageSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nama paket wajib diisi"),
  pax: z.number().min(1, "Jumlah pax minimal 1"),
  price: z.number().min(1, "Harga wajib diisi"),
  content: z.string().optional().default(""),
  bookingUrl: z.string().optional(),
});

const venueSchema = z.object({
  name: z.string().min(1, "Nama venue wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  maxCapacity: z.number().min(1, "Kapasitas minimal 1"),
  images: z.array(z.string().min(1, "URL gambar tidak boleh kosong")),
  packages: z.array(packageSchema),
});

type VenueFormData = z.infer<typeof venueSchema>;

function ImageUploadRow({
  value,
  onChange,
  onRemove,
  canRemove,
}: {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File terlalu besar (maks 5MB)");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        setUploadError(err.error || "Upload gagal");
        return;
      }
      const data = await res.json();
      onChange(data.url);
    } catch {
      setUploadError("Upload gagal");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <Input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="flex-1 bg-brand-cream border-brand-sand text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-brand-gold/10 file:text-brand-taupe"
        />
        {value ? (
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-brand-cream shrink-0">
            <Image src={value} alt="Preview" fill className="object-cover" sizes="80px" />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full p-0"
              onClick={() => onChange("")}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center shrink-0">
            <ImageIcon className="w-6 h-6 text-brand-gold/30" />
          </div>
        )}
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-500 shrink-0"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      {uploading && <p className="text-xs text-brand-gold">Mengupload...</p>}
      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
    </div>
  );
}

interface VenueFormProps {
  mode: "create" | "edit";
  initialData?: {
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
  };
}

export function VenueForm({ mode, initialData }: VenueFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VenueFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(venueSchema) as any,
    defaultValues: initialData || {
      name: "",
      slug: "",
      location: "",
      description: "",
      maxCapacity: 0,
      images: [""],
      packages: [],
    },
  });

  // useFieldArray narrowed by resolver type — safe cast for dynamic arrays
  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control: control as any,
    name: "images",
  });

  const {
    fields: packageFields,
    append: addPackage,
    remove: removePackage,
  } = useFieldArray({
    control: control as any,
    name: "packages",
  });

  const nameValue = watch("name");

  const autoSlug = () => {
    if (mode === "create" && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug);
    }
  };

  const onSubmit = async (data: VenueFormData) => {
    setSaving(true);
    try {
      if (mode === "create") {
        const res = await fetch("/api/venues", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed");
      } else {
        const { packages: pkgData, ...venueData } = data;
        const res = await fetch(`/api/venues/${initialData!.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(venueData),
        });
        if (!res.ok) throw new Error("Failed");

        const existingIds = initialData!.packages.filter((p) => p.id).map((p) => p.id!);
        const keptIds = pkgData.filter((p) => p.id).map((p) => p.id!) as number[];

        for (const id of existingIds) {
          if (!keptIds.includes(id)) {
            await fetch(`/api/packages/${id}`, { method: "DELETE" });
          }
        }

        for (const pkg of pkgData) {
          if (pkg.id) {
            await fetch(`/api/packages/${pkg.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pkg),
            });
          } else {
            await fetch(`/api/venues/${initialData!.slug}/packages`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pkg),
            });
          }
        }
      }

      toast.success(mode === "create" ? "Venue berhasil dibuat!" : "Venue berhasil diperbarui!");
      router.push("/dashboard/venues");
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan venue. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/venues" className="text-brand-taupe/60 hover:text-brand-gold">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe">
          {mode === "create" ? "Tambah Venue Baru" : "Edit Venue"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-white border-brand-sand shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-serif text-xl text-brand-taupe mb-4">Informasi Venue</h2>

            <div>
              <Label className="text-brand-taupe">Nama Venue</Label>
              <Input
                {...register("name")}
                placeholder="Nama venue"
                className={cn("mt-1.5 bg-brand-cream border-brand-sand", errors.name && "border-red-400")}
                onBlur={autoSlug}
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label className="text-brand-taupe">Slug</Label>
              <Input
                {...register("slug")}
                placeholder="nama-venue"
                className={cn("mt-1.5 bg-brand-cream border-brand-sand", errors.slug && "border-red-400")}
              />
              {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <Label className="text-brand-taupe">Lokasi</Label>
              <Input
                {...register("location")}
                placeholder="Jakarta, Bandung, Bali..."
                className={cn("mt-1.5 bg-brand-cream border-brand-sand", errors.location && "border-red-400")}
              />
              {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <Label className="text-brand-taupe">Deskripsi</Label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Deskripsi venue..."
                className={cn(
                  "mt-1.5 flex w-full rounded-md border bg-brand-cream px-3 py-2 text-sm text-brand-taupe placeholder:text-brand-taupe/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  errors.description ? "border-red-400" : "border-brand-sand"
                )}
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <Label className="text-brand-taupe">Kapasitas Maksimal</Label>
              <Input
                type="number"
                {...register("maxCapacity", { valueAsNumber: true })}
                className={cn("mt-1.5 bg-brand-cream border-brand-sand w-40", errors.maxCapacity && "border-red-400")}
              />
              {errors.maxCapacity && <p className="text-red-400 text-sm mt-1">{errors.maxCapacity.message}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sand shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-brand-taupe">Gambar</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-brand-sand text-brand-taupe"
                onClick={() => addImage("")}
              >
                <Plus className="w-3 h-3 mr-1" /> Tambah Gambar
              </Button>
            </div>
            {imageFields.map((field, index) => (
              <ImageUploadRow
                key={field.id}
                value={watch(`images.${index}`)}
                onChange={(url) => setValue(`images.${index}`, url)}
                onRemove={() => removeImage(index)}
                canRemove={imageFields.length > 1}
              />
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white border-brand-sand shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-brand-taupe">Paket</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-brand-sand text-brand-taupe"
                onClick={() =>
                  addPackage({ name: "", pax: 0, price: 0, content: "", bookingUrl: "" })
                }
              >
                <Plus className="w-3 h-3 mr-1" /> Tambah Paket
              </Button>
            </div>

            {packageFields.map((field, pkgIndex) => (
              <div key={field.id} className="border border-brand-sand rounded-lg p-4 space-y-3 bg-brand-cream/50">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-brand-taupe font-medium">Paket #{pkgIndex + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-500"
                    onClick={() => removePackage(pkgIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-brand-taupe text-xs">Nama Paket</Label>
                    <Input
                      {...register(`packages.${pkgIndex}.name`)}
                      placeholder="Nama paket"
                      className={cn("mt-1 bg-white border-brand-sand text-sm")}
                    />
                  </div>
                  <div>
                    <Label className="text-brand-taupe text-xs">Pax</Label>
                    <Input
                      type="number"
                      {...register(`packages.${pkgIndex}.pax`, { valueAsNumber: true })}
                      className={cn("mt-1 bg-white border-brand-sand text-sm")}
                    />
                  </div>
                  <div>
                    <Label className="text-brand-taupe text-xs">Harga (IDR)</Label>
                    <Input
                      type="number"
                      {...register(`packages.${pkgIndex}.price`, { valueAsNumber: true })}
                      className={cn("mt-1 bg-white border-brand-sand text-sm")}
                    />
                  </div>
                  <div>
                    <Label className="text-brand-taupe text-xs">Booking URL</Label>
                    <Input
                      {...register(`packages.${pkgIndex}.bookingUrl`)}
                      placeholder="https://wa.me/..."
                      className={cn("mt-1 bg-white border-brand-sand text-sm")}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-brand-taupe text-xs mb-2 block">Konten Paket</Label>
                  <RichTextEditor
                    content={watch(`packages.${pkgIndex}.content`) || ""}
                    onChange={(html) => setValue(`packages.${pkgIndex}.content`, html)}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={saving}
          className="bg-brand-gold text-white hover:bg-brand-taupe transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...
            </>
          ) : mode === "create" ? (
            "Buat Venue"
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </form>
    </div>
  );
}

