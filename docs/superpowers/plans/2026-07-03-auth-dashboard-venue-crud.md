# Auth + Dashboard Venue CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement real authentication (Lucia + Prisma + bcrypt) and add Venue CRUD to the dashboard with server-side pagination and inline package management.

**Architecture:** Lucia Auth v3 with Prisma adapter for database sessions. Next.js middleware protects `/dashboard/*` routes. New User + Session models added to Prisma schema. Dashboard gains a `/dashboard/venues` page with paginated table and inline package forms using react-hook-form useFieldArray.

**Tech Stack:** Lucia v3, @lucia-auth/adapter-prisma, bcrypt, oslo, Next.js 16 App Router, Prisma 7, shadcn/ui, react-hook-form + zod

---

### Task 1: Add User + Session Models

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add User and Session models to schema**

In `prisma/schema.prisma`, add after the existing models:

```prisma
model User {
  id           String    @id
  name         String
  email        String    @unique
  passwordHash String
  role         String    @default("couple")
  createdAt    DateTime  @default(now())
  sessions     Session[]
}

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

The full schema after the edit should contain: Venue, Package, User, Session.

- [ ] **Step 2: Run migration**

```bash
npx prisma migrate dev --name add-auth
```

Expected: Creates migration file, applies User + Session tables to MySQL.

- [ ] **Step 3: Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add User and Session models for authentication"
```

---

### Task 2: Install Auth Dependencies + Create Auth Library

**Files:**
- Modify: `package.json`
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Install dependencies**

```bash
npm install lucia @lucia-auth/adapter-prisma bcrypt @types/bcrypt oslo
```

- [ ] **Step 2: Create auth library**

Write `src/lib/auth.ts`:

```typescript
import { Lucia } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { cache } from "react";
import type { Session, User } from "lucia";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "sola-auth-session",
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (data) => ({
    name: data.name,
    email: data.email,
    role: data.role,
  }),
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  name: string;
  email: string;
  role: string;
}

export async function createSession(userId: string) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return session;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (sessionId) {
    await lucia.invalidateSession(sessionId);
    const blankCookie = lucia.createBlankSessionCookie();
    cookieStore.set(
      blankCookie.name,
      blankCookie.value,
      blankCookie.attributes
    );
  }
}

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value;
  if (!sessionId) return null;

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session) return null;

  // Refresh session if close to expiry
  if (session.expiresAt < new Date(Date.now() + 1000 * 60 * 60 * 24 * 15)) {
    const refreshedSession = await lucia.createSession(user.id, {});
    const refreshedCookie = lucia.createSessionCookie(refreshedSession.id);
    cookieStore.set(
      refreshedCookie.name,
      refreshedCookie.value,
      refreshedCookie.attributes
    );
  }

  return user;
});

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import("bcrypt");
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import("bcrypt");
  return bcrypt.compare(password, hash);
}

export function generateId(): string {
  const crypto = require("crypto") as typeof import("crypto");
  return crypto.randomBytes(16).toString("hex");
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/auth.ts package.json package-lock.json
git commit -m "feat: add Lucia auth library with session helpers"
```

---

### Task 3: Auth API Routes

**Files:**
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/auth/register/route.ts`
- Create: `src/app/api/auth/logout/route.ts`

- [ ] **Step 1: Create login route**

Write `src/app/api/auth/login/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await createSession(user.id);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Create register route**

Write `src/app/api/auth/register/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, hashPassword, generateId } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        id: generateId(),
        name,
        email,
        passwordHash,
        role: role || "couple",
      },
    });

    await createSession(user.id);

    return NextResponse.json(
      {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: Create logout route**

Write `src/app/api/auth/logout/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/auth/logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/auth/login/route.ts src/app/api/auth/register/route.ts src/app/api/auth/logout/route.ts
git commit -m "feat: add auth API routes (login, register, logout)"
```

---

### Task 4: Middleware for Dashboard Protection

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware**

Write `src/middleware.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("sola-auth-session")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
```

This protects all `/dashboard` sub-routes. If no session cookie exists, redirects to `/login?redirect=<original-path>`.

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add middleware to protect dashboard routes"
```

---

### Task 5: Wire Login/Register Pages to Real API

**Files:**
- Modify: `src/app/login/page.tsx`
- Modify: `src/app/register/page.tsx`

- [ ] **Step 1: Wire login page**

In `src/app/login/page.tsx`, replace the `onSubmit` function (lines 33-38):

Replace:
```typescript
  const onSubmit = async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast("Welcome back! You've been logged in successfully.");
    setIsLoading(false);
  };
```

With:
```typescript
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        toast(err.error || "Login failed");
        return;
      }
      toast("Welcome back! You've been logged in successfully.");
      window.location.href = "/dashboard";
    } catch {
      toast("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
```

Also add `useRouter` import and redirect. The simplest approach uses `window.location.href` for a full page reload (needed to refresh server components with the new session cookie).

- [ ] **Step 2: Wire register page**

In `src/app/register/page.tsx`, replace the `onSubmit` function (lines 38-43):

Replace:
```typescript
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast(`Account created! Welcome to Sola Planner, ${data.name}!`);
    setIsLoading(false);
  };
```

With:
```typescript
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        toast(err.error || "Registration failed");
        return;
      }
      toast(`Account created! Welcome to Sola Planner, ${data.name}!`);
      window.location.href = "/dashboard";
    } catch {
      toast("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
```

- [ ] **Step 3: Commit**

```bash
git add src/app/login/page.tsx src/app/register/page.tsx
git commit -m "feat: wire login and register pages to real auth API"
```

---

### Task 6: Add Server-Side Pagination to GET /api/venues

**Files:**
- Modify: `src/app/api/venues/route.ts`

- [ ] **Step 1: Add pagination to GET handler**

In `src/app/api/venues/route.ts`, replace the entire `GET` function:

Replace the GET function (lines 4-44) with:

```typescript
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get("search") || undefined;
    const location = searchParams.get("location") || undefined;
    const minCapacity = searchParams.get("minCapacity") || undefined;
    const maxCapacity = searchParams.get("maxCapacity") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("perPage") || "10")));

    const where = {
      ...(search && { name: { contains: search } }),
      ...(location && { location }),
      ...(minCapacity && { maxCapacity: { gte: Number(minCapacity) } }),
      ...(maxCapacity && { maxCapacity: { lte: Number(maxCapacity) } }),
    };

    const [venues, total] = await Promise.all([
      db.venue.findMany({
        where,
        include: {
          packages: {
            select: { price: true },
            orderBy: { price: "asc" },
          },
          _count: { select: { packages: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      db.venue.count({ where }),
    ]);

    const venuesWithCheapestPrice = venues.map((v) => ({
      ...v,
      images: JSON.parse(v.images) as string[],
      cheapestPrice: v.packages[0]?.price ? Number(v.packages[0].price) : null,
      packageCount: v._count.packages,
    }));

    return NextResponse.json({
      venues: venuesWithCheapestPrice,
      total,
      page,
      totalPages: Math.ceil(total / perPage),
    });
  } catch (error) {
    console.error("GET /api/venues error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

The POST handler (for creating venues) remains unchanged — just keep it after the GET function.

- [ ] **Step 2: Commit**

```bash
git add src/app/api/venues/route.ts
git commit -m "feat: add server-side pagination to GET /api/venues"
```

---

### Task 7: Add PUT/DELETE for Venues + Package CRUD Routes

**Files:**
- Modify: `src/app/api/venues/[slug]/route.ts`
- Create: `src/app/api/venues/[slug]/packages/route.ts`
- Create: `src/app/api/packages/[id]/route.ts`

- [ ] **Step 1: Add PUT and DELETE to /api/venues/[slug]**

Write `src/app/api/venues/[slug]/route.ts` (replaces existing file — keep the GET, add PUT and DELETE):

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const venue = await db.venue.findUnique({
      where: { slug },
      include: { packages: { orderBy: { price: "asc" } } },
    });
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }
    return NextResponse.json({
      venue: {
        ...venue,
        images: JSON.parse(venue.images) as string[],
        packages: venue.packages.map((pkg) => ({
          ...pkg,
          price: Number(pkg.price),
          features: JSON.parse(pkg.features) as string[],
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/venues/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, location, description, maxCapacity, images } = body;

    const venue = await db.venue.update({
      where: { slug },
      data: {
        ...(name && { name }),
        ...(location !== undefined && { location }),
        ...(description !== undefined && { description }),
        ...(maxCapacity !== undefined && { maxCapacity }),
        ...(images !== undefined && { images: JSON.stringify(images) }),
      },
    });

    return NextResponse.json({ venue });
  } catch (error) {
    console.error("PUT /api/venues/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await db.venue.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/venues/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create POST /api/venues/[slug]/packages**

Write `src/app/api/venues/[slug]/packages/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { name, pax, price, features, bookingUrl } = body;

    if (!name || !pax || !price) {
      return NextResponse.json(
        { error: "Name, pax, and price are required" },
        { status: 400 }
      );
    }

    const venue = await db.venue.findUnique({ where: { slug } });
    if (!venue) {
      return NextResponse.json({ error: "Venue not found" }, { status: 404 });
    }

    const pkg = await db.package.create({
      data: {
        venueId: venue.id,
        name,
        pax: Number(pax),
        price: BigInt(price),
        features: JSON.stringify(features || []),
        bookingUrl: bookingUrl || "",
      },
    });

    return NextResponse.json(
      { package: { ...pkg, price: Number(pkg.price), features: JSON.parse(pkg.features) } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/venues/[slug]/packages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create PUT/DELETE /api/packages/[id]**

Write `src/app/api/packages/[id]/route.ts`:

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
    const { name, pax, price, features, bookingUrl } = body;

    const pkgId = parseInt(id);
    if (isNaN(pkgId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    const pkg = await db.package.update({
      where: { id: pkgId },
      data: {
        ...(name && { name }),
        ...(pax !== undefined && { pax: Number(pax) }),
        ...(price !== undefined && { price: BigInt(price) }),
        ...(features !== undefined && { features: JSON.stringify(features) }),
        ...(bookingUrl !== undefined && { bookingUrl }),
      },
    });

    return NextResponse.json({
      package: { ...pkg, price: Number(pkg.price), features: JSON.parse(pkg.features) },
    });
  } catch (error) {
    console.error("PUT /api/packages/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pkgId = parseInt(id);
    if (isNaN(pkgId)) {
      return NextResponse.json({ error: "Invalid package ID" }, { status: 400 });
    }

    await db.package.delete({ where: { id: pkgId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/packages/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/api/venues/\[slug\]/route.ts src/app/api/venues/\[slug\]/packages/route.ts src/app/api/packages/\[id\]/route.ts
git commit -m "feat: add PUT/DELETE venues + package CRUD API routes"
```

---

### Task 8: Dashboard Venue Listing Page

**Files:**
- Create: `src/app/dashboard/venues/page.tsx`

- [ ] **Step 1: Create dashboard venue listing with server components**

Write `src/app/dashboard/venues/page.tsx`:

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";

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
```

- [ ] **Step 2: Create the client table component with pagination and delete**

Write `src/app/dashboard/venues/table.tsx`:

```typescript
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
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";

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
      // handle error
    } finally {
      setDeleting(false);
    }
  };

  const changePage = (newPage: number) => {
    router.push(
      `/dashboard/venues?search=${encodeURIComponent(search)}&page=${newPage}`
    );
  };

  return (
    <>
      {/* Search bar */}
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-brand-sand shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-serif text-brand-taupe">Nama</TableHead>
              <TableHead className="font-serif text-brand-taupe">Lokasi</TableHead>
              <TableHead className="font-serif text-brand-taupe">Kapasitas</TableHead>
              <TableHead className="font-serif text-brand-taupe">Paket</TableHead>
              <TableHead className="font-serif text-brand-taupe text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.venues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-brand-taupe/60">
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

      {/* Pagination */}
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

      {/* Delete confirmation dialog */}
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
```

- [ ] **Step 3: Commit**

```bash
git add src/app/dashboard/venues/page.tsx src/app/dashboard/venues/table.tsx
git commit -m "feat: add dashboard venue listing with server-side pagination"
```

---

### Task 9: Dashboard Venue Form (New + Edit) with Package Management

**Files:**
- Create: `src/app/dashboard/venues/new/page.tsx`
- Create: `src/app/dashboard/venues/[slug]/page.tsx`

- [ ] **Step 1: Create shared venue form component**

Write `src/app/dashboard/venues/form.tsx`:

```typescript
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
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
  pax: z.coerce.number().min(1, "Jumlah pax minimal 1"),
  price: z.coerce.number().min(1, "Harga wajib diisi"),
  features: z.array(z.string().min(1, "Fitur tidak boleh kosong")),
  bookingUrl: z.string().optional(),
});

const venueSchema = z.object({
  name: z.string().min(1, "Nama venue wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  location: z.string().min(1, "Lokasi wajib diisi"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  maxCapacity: z.coerce.number().min(1, "Kapasitas minimal 1"),
  images: z.array(z.string().url("URL gambar tidak valid")),
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

  const { fields: imageFields, append: addImage, remove: removeImage } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: packageFields,
    append: addPackage,
    remove: removePackage,
  } = useFieldArray({
    control,
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
        // Update venue
        const { packages: pkgData, ...venueData } = data;
        const res = await fetch(`/api/venues/${initialData!.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(venueData),
        });
        if (!res.ok) throw new Error("Failed");

        // Handle packages: create new, update existing, delete removed
        const existingIds = initialData!.packages.filter((p) => p.id).map((p) => p.id!);
        const keptIds = pkgData.filter((p) => p.id).map((p) => p.id!) as number[];

        // Delete removed packages
        for (const id of existingIds) {
          if (!keptIds.includes(id)) {
            await fetch(`/api/packages/${id}`, { method: "DELETE" });
          }
        }

        // Create new / update existing packages
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
        {/* Venue Fields */}
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
                {...register("maxCapacity")}
                className={cn("mt-1.5 bg-brand-cream border-brand-sand w-40", errors.maxCapacity && "border-red-400")}
              />
              {errors.maxCapacity && <p className="text-red-400 text-sm mt-1">{errors.maxCapacity.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
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

        {/* Packages */}
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
                      {...register(`packages.${pkgIndex}.pax`)}
                      className={cn("mt-1 bg-white border-brand-sand text-sm")}
                    />
                  </div>
                  <div>
                    <Label className="text-brand-taupe text-xs">Harga (IDR)</Label>
                    <Input
                      type="number"
                      {...register(`packages.${pkgIndex}.price`)}
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

                {/* Features for this package */}
                <div className="space-y-2">
                  <Label className="text-brand-taupe text-xs">Fitur</Label>
                  <PackageFeatures
                    control={control}
                    register={register}
                    pkgIndex={pkgIndex}
                    errors={errors}
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

function PackageFeatures({
  control,
  register,
  pkgIndex,
  errors,
}: {
  control: any;
  register: any;
  pkgIndex: number;
  errors: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `packages.${pkgIndex}.features`,
  });

  return (
    <div className="space-y-2">
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
```

- [ ] **Step 2: Create new venue page**

Write `src/app/dashboard/venues/new/page.tsx`:

```typescript
import { VenueForm } from "../form";

export default function NewVenuePage() {
  return <VenueForm mode="create" />;
}
```

- [ ] **Step 3: Create edit venue page**

Write `src/app/dashboard/venues/[slug]/page.tsx`:

```typescript
import { VenueForm } from "../form";

interface VenueData {
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
}

async function getVenue(slug: string): Promise<VenueData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/venues/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.venue;
}

export default async function EditVenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await getVenue(slug);

  if (!venue) {
    return (
      <div className="text-center py-20">
        <p className="text-brand-taupe/60">Venue tidak ditemukan.</p>
      </div>
    );
  }

  return <VenueForm mode="edit" initialData={venue} />;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/dashboard/venues/form.tsx src/app/dashboard/venues/new/page.tsx src/app/dashboard/venues/\[slug\]/page.tsx
git commit -m "feat: add dashboard venue form with inline package management"
```

---

### Task 10: Update Sidebar — Add Venues Nav Item

**Files:**
- Modify: `src/components/ui-custom/Sidebar.tsx`

- [ ] **Step 1: Add Venues to nav items**

In `src/components/ui-custom/Sidebar.tsx`, add `Building2` to the lucide-react imports (line 10):

Replace:
```typescript
import {
  LayoutDashboard,
  ClipboardCheck,
  DollarSign,
  Users,
  Settings,
  Heart,
  Menu,
} from "lucide-react";
```

With:
```typescript
import {
  LayoutDashboard,
  ClipboardCheck,
  DollarSign,
  Users,
  Building2,
  Settings,
  Heart,
  Menu,
} from "lucide-react";
```

Then add the Venues item to the `navItems` array (line 22, before Settings):

Replace:
```typescript
const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/dashboard/budget", label: "Budget", icon: DollarSign },
  { href: "/dashboard/guests", label: "Guest List", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
```

With:
```typescript
const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/checklist", label: "Checklist", icon: ClipboardCheck },
  { href: "/dashboard/budget", label: "Budget", icon: DollarSign },
  { href: "/dashboard/guests", label: "Guest List", icon: Users },
  { href: "/dashboard/venues", label: "Venues", icon: Building2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ui-custom/Sidebar.tsx
git commit -m "feat: add Venues nav item to dashboard sidebar"
```

---

### Task 11: Update Navbar — Auth State (Login/Logout)

**Files:**
- Modify: `src/components/ui-custom/Navbar.tsx`

- [ ] **Step 1: Add logout function and conditional rendering**

In `src/components/ui-custom/Navbar.tsx`, add `LogOut` icon and `LogoutButton` component. Replace the desktop auth buttons section (lines 76-87) and the mobile drawer Login/Start Planning section (lines 123-129).

Replace the `Navbar` component with this version (only the auth buttons section changes, everything else stays the same):

**Desktop auth section:** Replace lines 76-87:
```tsx
        <div className="hidden md:flex items-center gap-4">
          <LogoutButton />
        </div>
```

**Mobile drawer auth section:** Replace lines 123-129:
```tsx
                <hr className="border-brand-sand" />
                <LogoutButton />
```

Add `LogoutButton` as a separate client component at the top of the file, after the imports:

```typescript
import { LogOut } from "lucide-react";

function LogoutButton() {
  const [user, setUser] = React.useState<{ name: string } | null>(null);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/auth/login", { method: "GET" }).catch(() => {});
    setChecking(false);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (checking) return null;

  return (
    <>
      <Link href="/dashboard">
        <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300">
          Start Planning →
        </Button>
      </Link>
    </>
  );
}
```

Wait — the simpler approach for Navbar auth state: since the navbar is a client component that runs on every page, we can't easily check session on the server. The simplest approach is to just keep the static "Login" + "Start Planning" buttons for now, and use the middleware redirect for protection. The Navbar doesn't need to change — the middleware handles auth.

Actually, for a better UX, let's add a simple auth state check. The approach: create a small `GET /api/auth/me` endpoint that returns the current user if logged in, and have the Navbar check it via `useEffect`.

But to keep this simple and avoid complexity, let's skip the Navbar auth state for now (it's not in the spec as a blocking requirement). The middleware already handles dashboard protection.

Instead, just update the import to include `LogOut` and add the logout functionality. Here's the simpler version:

Replace the entire file content with the existing content, but modify the imports and add a `LogoutButton` component at the end of the desktop buttons section and mobile drawer.

**Simplest approach:** Keep the Navbar mostly as-is. Just add a `GET /api/auth/me` endpoint and a simple check in Navbar. Let me keep this task minimal.

Write `src/app/api/auth/me/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
```

Then in Navbar.tsx, update the auth section to conditionally show user or login:

Replace lines 76-87 (desktop auth buttons):
```tsx
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-brand-taupe hover:text-brand-gold">
              Login
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300">
              Start Planning →
            </Button>
          </Link>
        </div>
```

With:
```tsx
        <NavAuth />
```

And in mobile drawer, replace lines 123-129:
```tsx
                <hr className="border-brand-sand" />
                <Link href="/login" className="font-serif text-lg text-brand-taupe">
                  Login
                </Link>
                <Link href="/dashboard" className="w-full">
                  <Button className="w-full bg-brand-gold text-white">Start Planning</Button>
                </Link>
```

With:
```tsx
                <hr className="border-brand-sand" />
                <NavAuth mobile />
```

Add imports at top:
```typescript
import { LogOut, User as UserIcon } from "lucide-react";
```

Add `NavAuth` component above `Navbar()`:

```typescript
function NavAuth({ mobile }: { mobile?: boolean }) {
  const [user, setUser] = React.useState<{ name: string } | null | undefined>(undefined);

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (user === undefined) return null; // loading

  if (user) {
    return (
      <div className={mobile ? "flex flex-col gap-3" : "flex items-center gap-3"}>
        <span className={mobile ? "font-serif text-lg text-brand-taupe/60" : "text-sm text-brand-taupe/60"}>
          <UserIcon className="w-4 h-4 inline mr-1" />
          {user.name}
        </span>
        <Button
          variant="ghost"
          className={mobile ? "justify-start text-brand-taupe" : "text-brand-taupe hover:text-red-500"}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </div>
    );
  }

  if (mobile) {
    return (
      <>
        <Link href="/login" className="font-serif text-lg text-brand-taupe">Login</Link>
        <Link href="/dashboard" className="w-full">
          <Button className="w-full bg-brand-gold text-white">Start Planning</Button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button variant="ghost" className="text-brand-taupe hover:text-brand-gold">Login</Button>
      </Link>
      <Link href="/dashboard">
        <Button className="bg-brand-gold text-white hover:bg-brand-taupe hover:text-brand-cream transition-all duration-300">
          Start Planning →
        </Button>
      </Link>
    </>
  );
}
```

- [ ] **Step 2: Create GET /api/auth/me and commit**

```bash
git add src/app/api/auth/me/route.ts src/components/ui-custom/Navbar.tsx
git commit -m "feat: add auth state to navbar with login/logout"
```

---

### Task 12: Build Verification

**Files:**
- None

- [ ] **Step 1: Run Next.js build**

```bash
npx next build 2>&1 | tail -25
```

Expected: Build compiles successfully. Routes should include `/dashboard/venues`, `/dashboard/venues/new`, `/dashboard/venues/[slug]`, and auth API routes.

- [ ] **Step 2: Verify database migration**

```bash
npx prisma db push --accept-data-loss 2>&1
```

Expected: "Your database is now in sync with your schema."

- [ ] **Step 3: Test auth flow manually**

Start dev server (`npm run dev`), then:
1. Navigate to `/register` — create a test account
2. Verify redirect to `/dashboard` after registration
3. Navigate to `/dashboard` directly — verify access (session cookie set)
4. Clear cookies — navigate to `/dashboard` — verify redirect to `/login`
