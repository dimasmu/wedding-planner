# TipTap Rich Text for Package Content — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat feature arrays with rich HTML content edited via TipTap WYSIWYG in the dashboard, displayed on public pages.

**Architecture:** TipTap editor component with shadcn toolbar replaces useFieldArray feature inputs. Package `features` column renamed to `content` (HTML string). API endpoints updated to handle raw HTML. Seed rewritten with categorized section HTML.

**Tech Stack:** @tiptap/react, @tiptap/starter-kit, Next.js 16, shadcn/ui

---

### Task 1: Install Dependencies + Create RichTextEditor

**Files:**
- Modify: `package.json`
- Create: `src/components/ui/rich-text-editor.tsx`

- [ ] **Step 1: Install TipTap**

```bash
npm install @tiptap/react @tiptap/starter-kit
```

- [ ] **Step 2: Create RichTextEditor component**

Write `src/components/ui/rich-text-editor.tsx`:

```typescript
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Pilcrow,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className={cn(
      "h-8 w-8 p-0 rounded-md",
      active
        ? "bg-brand-gold/20 text-brand-gold"
        : "text-brand-taupe/60 hover:text-brand-taupe hover:bg-brand-cream"
    )}
    onClick={onClick}
  >
    {children}
  </Button>
);

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } })],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[200px] px-4 py-3 focus:outline-none text-brand-taupe",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-brand-sand rounded-md overflow-hidden bg-brand-cream">
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-brand-sand bg-white">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <span className="w-px h-4 bg-brand-sand mx-1" />
        <ToolbarButton
          active={editor.isActive("heading")}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading2 className="w-3.5 h-3.5" />
        </ToolbarButton>
        <span className="w-px h-4 bg-brand-sand mx-1" />
        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarButton>
        <span className="flex-1" />
      </div>
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/rich-text-editor.tsx package.json package-lock.json
git commit -m "feat: add TipTap RichTextEditor component"
```

---

### Task 2: Schema Migration + Seed Rewrite

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Rename features to content in schema**

In `prisma/schema.prisma`, change the `Package` model. Replace:
```prisma
  features   String  @db.Text
```
With:
```prisma
  content    String  @db.Text
```

Run migration:
```bash
npx prisma migrate dev --name rename-features-to-content
```

- [ ] **Step 2: Rewrite seed data with HTML content**

In `prisma/seed.ts`, replace all `features: JSON.stringify([...])` on package objects with `content: "<h3>...</h3><ul>...</ul>"` HTML strings. Here's the full replacement for all 12 packages:

For Hermitage Intimate:
```
content: "<h3>🍴 Food & Beverages</h3><ul><li>Buffet 100 pax (6 jam)</li><li>Soft drinks & free-flow water</li><li>Welcome drink</li></ul><h3>🏨 Venue</h3><ul><li>Ballroom utama (6 jam)</li><li>Ruang ganti pengantin</li><li>Parkir 20 mobil</li></ul><h3>✨ Dekorasi</h3><ul><li>Dekorasi bunga standar</li><li>Sound system & microphone</li></ul>"
```

Repeat for all 12 packages with appropriate content. Each package should have 3-6 sections matching the reference page style (emoji headings + bullet lists).

- [ ] **Step 3: Re-seed**

```bash
npx prisma db seed
```

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts prisma/migrations/
git commit -m "feat: rename features to content, rewrite seed with HTML"
```

---

### Task 3: Update API Routes

**Files:**
- Modify: `src/app/api/venues/[slug]/route.ts`
- Modify: `src/app/api/venues/[slug]/packages/route.ts`
- Modify: `src/app/api/packages/[id]/route.ts`

- [ ] **Step 1: Update GET /api/venues/[slug]**

In the GET handler, replace the package mapping. Change:
```typescript
        features: JSON.parse(pkg.features) as string[],
```
To:
```typescript
        content: pkg.content,
```

- [ ] **Step 2: Update POST /api/venues/[slug]/packages**

Replace the destructuring and create data. Change:
```typescript
    const { name, pax, price, features, bookingUrl } = body;
```
To:
```typescript
    const { name, pax, price, content, bookingUrl } = body;
```

And the create data from:
```typescript
        features: JSON.stringify(features || []),
```
To:
```typescript
        content: content || "",
```

And the response from:
```typescript
      { package: { ...pkg, price: Number(pkg.price), features: JSON.parse(pkg.features) } },
```
To:
```typescript
      { package: { ...pkg, price: Number(pkg.price), content: pkg.content } },
```

- [ ] **Step 3: Update PUT /api/packages/[id]**

Replace features with content in update data:
```typescript
        ...(content !== undefined && { content }),
```

And response:
```typescript
      package: { ...pkg, price: Number(pkg.price), content: pkg.content },
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/venues/\[slug\]/route.ts src/app/api/venues/\[slug\]/packages/route.ts src/app/api/packages/\[id\]/route.ts
git commit -m "feat: update API routes for content field instead of features"
```

---

### Task 4: Update Dashboard Form

**Files:**
- Modify: `src/app/dashboard/venues/form.tsx`

- [ ] **Step 1: Remove features from schema, add content**

In the package schema, replace:
```typescript
  features: z.array(z.string().min(1, "Fitur tidak boleh kosong")),
```
With:
```typescript
  content: z.string().optional().default(""),
```

Remove the `PackageFeatures` sub-component entirely (the function and its export).

- [ ] **Step 2: Remove feature FieldArray, add RichTextEditor**

In the package card section, remove the features FieldArray (the `PackageFeatures` component usage) and replace it with the RichTextEditor:

Find the `<PackageFeatures>` usage and replace with:
```tsx
                <div>
                  <Label className="text-brand-taupe text-xs mb-2 block">Konten Paket</Label>
                  <RichTextEditor
                    content={watch(`packages.${pkgIndex}.content`) || ""}
                    onChange={(html) => setValue(`packages.${pkgIndex}.content`, html)}
                    placeholder="Tulis detail paket di sini..."
                  />
                </div>
```

Add the import:
```typescript
import { RichTextEditor } from "@/components/ui/rich-text-editor";
```

- [ ] **Step 3: Update form submit — remove features, add content**

In the `onSubmit` function, update the edit mode package loops. Change:
```typescript
            await fetch(`/api/packages/${pkg.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pkg),
            });
```
The `pkg` object now has `content` instead of `features` — this flows through from the schema automatically.

For the new package creation:
```typescript
          const { packages: pkgData, ...venueData } = data;
```
`pkgData` packages now have `content` field — sent as-is to the API.

- [ ] **Step 4: Remove unused imports**

Remove `useFieldArray` from the react-hook-form import (it's still used for images and packages, so keep it). Only remove features-related dead code.

Actually, `useFieldArray` is still used for `images` and `packages`, so keep the import. Just remove `PackageFeatures` function.

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard/venues/form.tsx
git commit -m "feat: replace feature inputs with RichTextEditor in venue form"
```

---

### Task 5: Update Public Display

**Files:**
- Modify: `src/app/venue/[slug]/page.tsx`

- [ ] **Step 1: Replace feature list with HTML rendering**

In the package cards, replace the `<ul>` with features mapping:
```tsx
                <ul className="space-y-2 mb-5 flex-1">
                  {pkg.features.slice(0, 5).map((feature, fi) => (...))}
                </ul>
```

With:
```tsx
                {pkg.content && (
                  <div
                    className="prose prose-sm max-w-none mb-5 flex-1 text-brand-taupe/55 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-brand-taupe/70 [&_h3]:mb-2 [&_ul]:pl-4 [&_ul]:space-y-1 [&_li]:text-brand-taupe/55"
                    dangerouslySetInnerHTML={{ __html: pkg.content }}
                  />
                )}
```

Update the `PackageData` interface to use `content: string` instead of `features: string[]`.

- [ ] **Step 2: Commit**

```bash
git add "src/app/venue/[slug]/page.tsx"
git commit -m "feat: render package rich HTML content on venue detail"
```

---

### Task 6: Build Verification

**Files:**
- None

- [ ] **Step 1: Run build**

```bash
npx prisma generate && npx next build 2>&1 | tail -10
```

Expected: No errors. All routes compile.

- [ ] **Step 2: Re-seed and test**

```bash
npx prisma db seed
```

Expected: 5 venues with HTML content in packages. Public page shows formatted sections.
