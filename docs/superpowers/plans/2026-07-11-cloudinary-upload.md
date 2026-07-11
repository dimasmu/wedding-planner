# Cloudinary Upload Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace local filesystem uploads with direct client-to-Cloudinary unsigned uploads so image upload works on Vercel.

**Architecture:** Delete the `/api/upload` route. Modify the venue form's `ImageUploadRow` component to POST directly to Cloudinary's upload API using an unsigned upload preset. The returned `secure_url` replaces the old local path — all downstream components (hero, gallery, card) render whatever URL is in the `images` array and need no changes.

**Tech Stack:** Next.js 16, React, TypeScript, Cloudinary Upload API (unsigned), react-hook-form

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/api/upload/route.ts` | Delete | No longer needed — uploads go direct to Cloudinary |
| `src/app/dashboard/venues/form.tsx` | Modify:66-76 | `ImageUploadRow.handleFileChange` — swap fetch target and response field |

---

### Task 1: Swap upload to Cloudinary in the venue form

**Files:**
- Modify: `src/app/dashboard/venues/form.tsx:66-76`
- Delete: `src/app/api/upload/route.ts`

- [ ] **Step 1: Delete the old upload route**

```bash
rm src/app/api/upload/route.ts
```

- [ ] **Step 2: Update the upload fetch call in form.tsx**

Replace lines 66-76 in `src/app/dashboard/venues/form.tsx`.

**Current code (lines 66-76):**
```typescript
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
```

**Replace with:**
```typescript
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "sola_venue_upload");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/gm3kcifb/image/upload",
        { method: "POST", body: formData }
      );
      if (!res.ok) {
        const err = await res.json();
        setUploadError(err.error?.message || "Upload gagal");
        return;
      }
      const data = await res.json();
      onChange(data.secure_url);
```

- [ ] **Step 3: Verify the build compiles**

```bash
npx tsc --noEmit
```

Expected: No type errors. Exit code 0.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/upload/route.ts src/app/dashboard/venues/form.tsx
git commit -m "feat: replace local upload with Cloudinary unsigned uploads

- Delete /api/upload route (no longer needed)
- Post images directly to Cloudinary via unsigned upload preset
- Store secure_url instead of local path

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Pre-deploy Checklist (manual, one-time)

Before deploying to Vercel, create the unsigned upload preset in the Cloudinary console:

1. Go to https://console.cloudinary.com/app/settings/upload
2. Under "Upload presets", click "Add upload preset"
3. Set **Preset name** to `sola_venue_upload`
4. Set **Signing Mode** to **Unsigned**
5. Under **Upload options**, set **Folder** to `sola-wedding/venues`
6. Under **Upload options**, set **Allowed formats** to `jpg, png, webp`
7. Click **Save**

Verify the preset works from your browser console:

```javascript
const formData = new FormData();
formData.append("file", new File(["test"], "test.jpg", { type: "image/jpeg" }));
formData.append("upload_preset", "sola_venue_upload");
const res = await fetch("https://api.cloudinary.com/v1_1/gm3kcifb/image/upload", {
  method: "POST", body: formData
});
console.log(await res.json());
```

Expected: Response includes `secure_url` pointing to a Cloudinary-hosted image.
