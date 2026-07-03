"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const packageSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nama paket wajib diisi"),
  pax: z.number().min(1, "Jumlah pax minimal 1"),
  price: z.number().min(1, "Harga wajib diisi"),
  features: z.array(z.string().min(1, "Fitur tidak boleh kosong")),
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
      features: string[];
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
    resolver: zodResolver(venueSchema),
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

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-8">
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
                <Plus className="w-3 h-3 mr-1" /> Tambah URL
              </Button>
            </div>
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-start">
                <Input
                  {...register(`images.${index}`)}
                  placeholder="https://images.unsplash.com/..."
                  className={cn("flex-1 bg-brand-cream border-brand-sand", errors.images?.[index] && "border-red-400")}
                />
                {imageFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-500 shrink-0"
                    onClick={() => removeImage(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
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
                  addPackage({ name: "", pax: 0, price: 0, features: [""], bookingUrl: "" })
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

                <PackageFeatures
                  control={control}
                  register={register}
                  pkgIndex={pkgIndex}
                />
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

function PackageFeatures({
  control,
  register,
  pkgIndex,
}: {
  control: any;
  register: any;
  pkgIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control: control as any,
    name: `packages.${pkgIndex}.features`,
  });

  return (
    <div className="space-y-2">
      <Label className="text-brand-taupe text-xs">Fitur</Label>
      {fields.map((field, featIndex) => (
        <div key={field.id} className="flex gap-2 items-start">
          <Input
            {...register(`packages.${pkgIndex}.features.${featIndex}`)}
            placeholder="Fasilitas..."
            className="flex-1 bg-white border-brand-sand text-sm"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-red-400 hover:text-red-500 shrink-0"
            onClick={() => remove(featIndex)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-brand-gold text-xs"
        onClick={() => append("")}
      >
        <Plus className="w-3 h-3 mr-1" /> Tambah Fitur
      </Button>
    </div>
  );
}
