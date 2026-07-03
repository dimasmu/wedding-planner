# Role-Based Dashboard + User Management + Venue Publish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3-role access control (admin/editor/couple), venue publish workflow (draft/published), and admin user management page.

**Architecture:** Prisma schema extended with `status` on Venue and `updatedAt` on User. Register page changed to couple/editor. Sidebar dynamically filters navItems by role from `/api/auth/me`. Public venue API filters by `status: "published"`. New `/dashboard/users` page with server-side pagination for admins only.

**Tech Stack:** Prisma 7, Next.js 16, shadcn/ui, Lucia Auth, react-hook-form

---

### Task 1: Schema Changes + Seed Update

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Add status to Venue and updatedAt to User**

In `prisma/schema.prisma`, add after `maxCapacity` in the Venue model:
```prisma
  status      String    @default("draft")
```

Add after `createdAt` in the User model:
```prisma
  updatedAt   DateTime  @updatedAt
```

Run migration:
```bash
npx prisma migrate dev --name add-status-and-updatedat
```

- [ ] **Step 2: Update seed — add admin + editor users**

In `prisma/seed.ts`, after the `const prisma = ...` line, add a user seeding function. At the top of the file, add:
```typescript
import bcrypt from "bcrypt";
```

At the end of the `main()` function, BEFORE the venue seeding loop, add:
```typescript
  // Seed users
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const editorPasswordHash = await bcrypt.hash("editor123", 10);

  // Upsert admin (avoid duplicate on re-seed)
  await prisma.user.upsert({
    where: { email: "admin@solaproject.com" },
    update: {},
    create: {
      id: Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      name: "Admin",
      email: "admin@solaproject.com",
      passwordHash: adminPasswordHash,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { email: "editor@solaproject.com" },
    update: {},
    create: {
      id: Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      name: "Editor",
      email: "editor@solaproject.com",
      passwordHash: editorPasswordHash,
      role: "editor",
    },
  });

  console.log("Seeded users: admin + editor");
```

Set all existing venues to published — in the venue create loop, add `status: "published"` to each venue object. For each venue in the array, add:
```typescript
    status: "published",
```
right after the `maxCapacity` field.

- [ ] **Step 3: Re-seed**

```bash
npx prisma db seed
```

Expected: Seeds admin + editor users, updates venues with published status.

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts prisma/migrations/
git commit -m "feat: add venue status, user updatedAt, seed admin+editor users"
```

---

### Task 2: Register Page — Vendor to Editor

**Files:**
- Modify: `src/app/register/page.tsx`

- [ ] **Step 1: Change role enum and labels**

In `src/app/register/page.tsx`, make these changes:

Schema (line 20):
```typescript
  role: z.enum(["couple", "editor"]),
```

State type (line 27):
```typescript
  const [role, setRole] = useState<"couple" | "editor">("couple");
```

Default values (line 35):
```typescript
    defaultValues: { role: "couple" },
```

Tab labels (lines 65-70):
```tsx
              <TabsTrigger value="couple" className="data-[state=active]:bg-brand-gold data-[state=active]:text-white">
                I&rsquo;m a Couple
              </TabsTrigger>
              <TabsTrigger value="editor" className="data-[state=active]:bg-brand-gold data-[state=active]:text-white">
                I&rsquo;m an Editor
              </TabsTrigger>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/register/page.tsx
git commit -m "feat: change register role from vendor to editor"
```

---

### Task 3: Role-Based Sidebar

**Files:**
- Modify: `src/components/ui-custom/Sidebar.tsx`

- [ ] **Step 1: Add role-based filtering + Users nav item**

Rewrite `src/components/ui-custom/Sidebar.tsx`:

```typescript
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ClipboardCheck,
  DollarSign,
  Users,
  Building2,
  UserCog,
  Settings,
  Heart,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const allNavItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["admin", "editor", "couple"] },
  { href: "/dashboard/checklist", label: "Checklist", icon: ClipboardCheck, roles: ["admin", "editor", "couple"] },
  { href: "/dashboard/budget", label: "Budget", icon: DollarSign, roles: ["admin", "editor", "couple"] },
  { href: "/dashboard/guests", label: "Guest List", icon: Users, roles: ["admin", "editor", "couple"] },
  { href: "/dashboard/venues", label: "Venues", icon: Building2, roles: ["admin", "editor"] },
  { href: "/dashboard/users", label: "Users", icon: UserCog, roles: ["admin"] },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["admin", "editor", "couple"] },
];

function NavLinks({ pathname, role }: { pathname: string; role: string | null }) {
  const navItems = allNavItems.filter((item) => role && item.roles.includes(role));

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all",
            pathname === href
              ? "bg-brand-gold/10 text-brand-gold font-medium"
              : "text-brand-taupe/70 hover:bg-brand-sand hover:text-brand-taupe"
          )}
        >
          <Icon className="w-4 h-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setRole(data?.user?.role || null))
      .catch(() => setRole(null));
  }, []);

  const activeLabel = allNavItems.find((n) => n.href === pathname)?.label || "Menu";

  return (
    <>
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-brand-sand bg-white min-h-[calc(100vh-4rem)]">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Heart className="h-5 w-5 text-brand-gold fill-brand-gold" />
            <span className="font-serif text-lg font-bold tracking-wider text-brand-taupe">
              SOLA
            </span>
          </Link>
          <NavLinks pathname={pathname} role={role} />
        </div>
      </aside>

      <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-brand-sand px-4 py-2">
        <Sheet>
          <SheetTrigger
            render={<Button variant="ghost" className="text-brand-taupe gap-2" />}
          >
            <Menu className="w-4 h-4" />
            {activeLabel}
          </SheetTrigger>
          <SheetContent side="left" className="bg-white w-[260px]">
            <div className="mt-8">
              <NavLinks pathname={pathname} role={role} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
```

Key changes:
- `allNavItems` with `roles` field — filters which items each role can see
- Added `UserCog` icon for Users page
- NavLinks accepts `role` prop, filters items by role
- Sidebar fetches role from `/api/auth/me` on mount
- Admin: 8 items, Editor: 6, Couple: 5

- [ ] **Step 2: Commit**

```bash
git add src/components/ui-custom/Sidebar.tsx
git commit -m "feat: add role-based sidebar filtering with Users nav item"
```

---

### Task 4: User API Routes

**Files:**
- Create: `src/app/api/users/route.ts`
- Create: `src/app/api/users/[id]/route.ts`

- [ ] **Step 1: Create GET /api/users**

Write `src/app/api/users/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") || "10")));

    const where = search
      ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create PUT/DELETE /api/users/[id]**

Write `src/app/api/users/[id]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !["admin", "editor", "couple"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent demoting the last admin
    if (user.role === "admin" && role !== "admin") {
      const adminCount = await db.user.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot change role of the last admin" },
          { status: 400 }
        );
      }
    }

    const updated = await db.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting last admin
    if (user.role === "admin") {
      const adminCount = await db.user.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin" },
          { status: 400 }
        );
      }
    }

    await db.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/users/route.ts src/app/api/users/\[id\]/route.ts
git commit -m "feat: add user management API routes (list, update role, delete)"
```

---

### Task 5: User Management Page

**Files:**
- Create: `src/app/dashboard/users/page.tsx`

- [ ] **Step 1: Create user management page**

Write `src/app/dashboard/users/page.tsx`:

```typescript
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTable } from "./table";

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

async function getUsers(page: number, search: string): Promise<PageData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(
    `${baseUrl}/api/users?page=${page}&perPage=10&search=${encodeURIComponent(search || "")}`,
    { cache: "no-store" }
  );
  if (!res.ok) return { users: [], total: 0, page: 1, totalPages: 1 };
  return res.json();
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1"));
  const search = params.search || "";
  const data = await getUsers(page, search);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl md:text-3xl text-brand-taupe">
          Kelola Pengguna
        </h1>
        <p className="text-brand-taupe/60 mt-1">
          Atur peran dan hapus pengguna.
        </p>
      </div>

      <UserTable initialData={data} initialSearch={search} initialPage={page} />
    </div>
  );
}
```

- [ ] **Step 2: Create user table client component**

Write `src/app/dashboard/users/table.tsx`:

```typescript
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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/users/page.tsx src/app/dashboard/users/table.tsx
git commit -m "feat: add user management page with role change and delete"
```

---

### Task 6: Venue API — Status Filter + Publish

**Files:**
- Modify: `src/app/api/venues/route.ts`
- Modify: `src/app/api/venues/[slug]/route.ts`

- [ ] **Step 1: Add status filter to public GET, accept status in POST/PUT**

In `src/app/api/venues/route.ts`, add `status` to the GET `where` clause. Change the `where` block in GET to:
```typescript
    const isDashboard = searchParams.get("all") === "true";
    const where = {
      ...(search && { name: { contains: search } }),
      ...(location && { location }),
      ...(minCapacity && { maxCapacity: { gte: Number(minCapacity) } }),
      ...(maxCapacity && { maxCapacity: { lte: Number(maxCapacity) } }),
      ...(!isDashboard && { status: "published" }),
    };
```

In the POST handler, add `status` to the create data:
```typescript
        status: status || "draft",
```

In `src/app/api/venues/[slug]/route.ts`, the PUT handler already accepts `{ name, location, description, maxCapacity, images }` — add `status`:
```typescript
    const { name, location, description, maxCapacity, images, status } = body;
```
And in the update data:
```typescript
        ...(status !== undefined && { status }),
```

- [ ] **Step 2: Update dashboard venue listing to pass all=true**

In `src/app/dashboard/venues/page.tsx`, update the fetch URL:
```typescript
    `${baseUrl}/api/venues?page=${page}&perPage=10&search=${encodeURIComponent(search || "")}&all=true`,
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/venues/route.ts src/app/api/venues/\[slug\]/route.ts src/app/dashboard/venues/page.tsx
git commit -m "feat: add venue status filter, publish workflow in API"
```

---

### Task 7: Venue Table — Status Badge + Publish Toggle

**Files:**
- Modify: `src/app/dashboard/venues/page.tsx`
- Modify: `src/app/dashboard/venues/table.tsx`

- [ ] **Step 1: Update table to show status and publish toggle**

In `src/app/dashboard/venues/page.tsx`, update the `VenueRow` interface to include `status`:
```typescript
interface VenueRow {
  id: number;
  slug: string;
  name: string;
  location: string;
  maxCapacity: number;
  packageCount: number;
  status: string;
}
```

In `src/app/dashboard/venues/table.tsx`, update `VenueRow` interface similarly. Add a new table header column "Status" after "Paket", and add status badge in the cell. Add publish/unpublish button in the actions column.

Add to table header after the Paket column:
```tsx
              <TableHead className="font-serif text-brand-taupe">Status</TableHead>
```

In the table body, add status cell after the packageCount cell:
```tsx
                  <TableCell>
                    <Badge className={venue.status === "published" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"}>
                      {venue.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
```

Add publish toggle in the actions column (after the edit/delete buttons). Add imports at top:
```typescript
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
```

Add state near other state declarations:
```typescript
  const [toggling, setToggling] = useState<number | null>(null);
```

Add toggle handler:
```typescript
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
```

Add publish button after the delete button inside the actions cell. Later, this should be conditional on admin role, but for now render it for all dashboard users:
```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/app/dashboard/venues/page.tsx src/app/dashboard/venues/table.tsx
git commit -m "feat: add venue status badge and publish toggle to dashboard"
```

---

### Task 8: Build Verification

**Files:**
- None

- [ ] **Step 1: Run build**

```bash
npx next build 2>&1 | tail -30
```

Expected: Compiles with no errors. Routes include `/api/users`, `/api/users/[id]`, `/dashboard/users`.

- [ ] **Step 2: Re-seed and verify**

```bash
npx prisma db seed
```

- [ ] **Step 3: Test flow**

1. Start dev server
2. Login as `admin@solaproject.com` / `admin123` — should see all 8 sidebar items
3. Visit `/dashboard/users` — should see admin + editor users
4. Register as editor — should see 6 sidebar items (no Users)
5. Register as couple — should see 5 sidebar items (no Venues, no Users)
