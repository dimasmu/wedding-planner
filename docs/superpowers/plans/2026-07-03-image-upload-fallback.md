# Image Upload + Default No-Image Fallback — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace URL-based image inputs with file upload in the venue form and show a Building2 icon fallback wherever venue images are displayed.

**Architecture:** New `POST /api/upload` endpoint saves files to `public/uploads/venues/`. Venue form replaces URL inputs with auto-upload file inputs. Fallback icon component shared across all image display locations. Seed data updated to empty image arrays.

**Tech Stack:** Next.js 16, shadcn/ui, lucide-react

---

### Task 1: Upload API

**Files:**
- Create: `src/app/api/upload/route.ts`
- Create: `public/uploads/venues/.gitkeep`

- [ ] **Step 1: Create upload directory and API route**

Create directory:
```bash
mkdir -p public/uploads/venues
```

Write `src/app/api/upload/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, and WebP files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File must be less than 5MB" },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const filepath = path.join(process.cwd(), "public", "uploads", "venues", filename);

    await writeFile(filepath, buffer);

    return NextResponse.json({ url: `/uploads/venues/${filename}` });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create .gitkeep**

```bash
touch public/uploads/venues/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/upload/route.ts public/uploads/venues/.gitkeep
git commit -m "feat: add image upload API endpoint"
```

---

### Task 2: Venue Form — File Upload Inputs

**Files:**
- Modify: `src/app/dashboard/venues/form.tsx`

- [ ] **Step 1: Replace URL inputs with file upload in the Images card**

Read the current Images section and replace the URL input rows. The changes:

Replace the entire Images Card section with file-upload-based inputs:

```tsx
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
            {imageFields.map((field, index) => {
              const imageUrl = watch(`images.${index}`);
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
                  setValue(`images.${index}`, data.url);
                } catch {
                  setUploadError("Upload gagal");
                } finally {
                  setUploading(false);
                }
              };

              return (
                <div key={field.id} className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="flex-1 bg-brand-cream border-brand-sand text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-brand-gold/10 file:text-brand-taupe"
                    />
                    {imageUrl ? (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-brand-cream shrink-0">
                        <Image
                          src={imageUrl}
                          alt="Preview"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full p-0"
                          onClick={() => setValue(`images.${index}`, "")}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center shrink-0">
                        <ImageIcon className="w-6 h-6 text-brand-gold/30" />
                      </div>
                    )}
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
                  {uploading && <p className="text-xs text-brand-gold">Mengupload...</p>}
                  {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
                </div>
              );
            })}
          </CardContent>
        </Card>
```

Add the missing import at the top of the file:
```typescript
import Image from "next/image";
import { ImageIcon } from "lucide-react";
```

Add `useState` to the React imports if not already there (it likely is).

**Note:** Since each `imageFields.map` callback now uses hooks (`useState`), you need to extract the image row into a separate component. Add this above the `VenueForm` component:

```typescript
function ImageUploadRow({
  index,
  value,
  onChange,
  onRemove,
  canRemove,
  register,
}: {
  index: number;
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  register: any;
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
```

Then inside the Images Card, replace the map body with:
```tsx
            {imageFields.map((field, index) => (
              <ImageUploadRow
                key={field.id}
                index={index}
                value={watch(`images.${index}`)}
                onChange={(url) => setValue(`images.${index}`, url)}
                onRemove={() => removeImage(index)}
                canRemove={imageFields.length > 1}
                register={register}
              />
            ))}
```

Also add `ImageIcon` to the lucide-react import:
```typescript
import { ArrowLeft, Plus, Trash2, Loader2, ImageIcon } from "lucide-react";
```

And add `Image` import:
```typescript
import Image from "next/image";
```

- [ ] **Step 2: Commit**

```bash
git add src/app/dashboard/venues/form.tsx
git commit -m "feat: replace URL inputs with file upload in venue form"
```

---

### Task 3: Fallback Icon — All Image Display Components

**Files:**
- Modify: `src/components/venue/VenueCard.tsx`
- Modify: `src/components/sections/PhotoCollage.tsx`
- Modify: `src/app/venue/[slug]/page.tsx`

- [ ] **Step 1: Create shared fallback component**

Write `src/components/venue/NoImageFallback.tsx`:

```typescript
import { ImageIcon } from "lucide-react";

export function NoImageFallback({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center ${className}`}>
      <ImageIcon className="w-10 h-10 text-brand-gold/30" />
    </div>
  );
}
```

- [ ] **Step 2: Update VenueCard**

In `src/components/venue/VenueCard.tsx`, replace the fallback div (lines 23-28, the `: (` no-image branch) with the component. Replace:
```tsx
            <div className="h-full bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
              <span className="font-serif text-5xl text-brand-gold/30">
                {name.charAt(0)}
              </span>
            </div>
```
With:
```tsx
            <div className="h-full bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-brand-gold/30" />
            </div>
```

Add import: `import { MapPin, Users, ImageIcon } from "lucide-react";`

- [ ] **Step 3: Update PhotoCollage**

In `src/components/sections/PhotoCollage.tsx`, wrap each `<Image>` with conditional rendering. Instead of always showing Image, add the fallback. The images come from the `images[]` array which is from the JSON field. If the array is empty after parsing, the grid won't show images.

Since PhotoCollage uses a hardcoded photo list, add a fallback: if `photo` exists, show Image; otherwise show fallback. Since we're changing seed data to empty, the existing photos from seed will be gone. The grid will become all fallback icons until images are uploaded.

Replace the Image in the map:
```tsx
          <div
            key={photo}
            className={`relative aspect-[3/4] ${collageLayout[i].span}`}
          >
            {photo ? (
              <Image
                src={`/asset/contact_us/collage_photo/${photo}`}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-brand-gold/30" />
              </div>
            )}
          </div>
```

Add import: `import { Sparkles, ImageIcon } from "lucide-react";`

- [ ] **Step 4: Update Venue Detail Page Gallery**

In `src/app/venue/[slug]/page.tsx`, wrap the Image in the gallery grid with a conditional fallback:

```tsx
              <div
                key={i}
                className={`relative ${i === 0 ? "col-span-2 row-span-2" : ""} min-h-[200px]`}
              >
                {venue.images[i] ? (
                  <Image
                    src={venue.images[i]}
                    alt={`${venue.name} photo ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-sand via-brand-cream to-brand-gold/20 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-brand-gold/30" />
                  </div>
                )}
              </div>
```

Add import: `import { ArrowLeft, MapPin, Users, ImageIcon } from "lucide-react";`

- [ ] **Step 5: Commit**

```bash
git add src/components/venue/NoImageFallback.tsx src/components/venue/VenueCard.tsx src/components/sections/PhotoCollage.tsx src/app/venue/\[slug\]/page.tsx
git commit -m "feat: add Building2/ImageIcon fallback for no-image states"
```

---

### Task 4: Seed Data — Remove External URLs

**Files:**
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Empty all image arrays in seed data**

In `prisma/seed.ts`, replace all `images: JSON.stringify([...])` values with `images: JSON.stringify([])` for all 5 venues.

For example, change:
```typescript
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
      ...
    ]),
```
To:
```typescript
    images: JSON.stringify([]),
```

Do this for all 5 venue objects.

- [ ] **Step 2: Re-seed**

```bash
npx prisma db seed
```

Expected: All venues now have empty images arrays, public catalog shows fallback icons.

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "refactor: remove external image URLs from seed data"
```

---

### Task 5: Build Verification

- [ ] **Step 1: Run build**

```bash
npx next build 2>&1 | tail -20
```

Expected: No errors. All routes compile.

- [ ] **Step 2: Verify upload endpoint**

```bash
curl -s -X POST http://localhost:3000/api/upload -F "file=@/path/to/test.jpg" 2>&1
```

Expected: Returns `{ url: "/uploads/venues/..." }`
