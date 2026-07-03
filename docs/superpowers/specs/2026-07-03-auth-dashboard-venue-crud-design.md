# Authentication + Dashboard Venue CRUD — Design Spec

**Date:** 2026-07-03
**Status:** Approved

---

## Overview

Fix the currently mocked authentication system and add a Venue CRUD page to the dashboard with server-side pagination. The login/register flows will be wired to real API endpoints using Lucia Auth with database sessions. The dashboard will gain a new Venues management page with full create/read/update/delete for venues and inline package management.

**Goals:**
- Real authentication: register, login, logout with password hashing and database sessions
- Protected dashboard routes via Next.js middleware
- Venue CRUD in dashboard with server-side pagination table
- Inline package management within the venue edit form
- Navbar reflects login state (user name + logout when authenticated)

---

## Architecture

**Auth stack:** Lucia Auth v3 + Prisma adapter + bcrypt + oslo (session/crypto utilities)

**Auth flow:**
```
Login Page → POST /api/auth/login → bcrypt verify → Lucia create session → Set cookie
Register Page → POST /api/auth/register → bcrypt hash → create user → create session → Set cookie
Middleware checks session cookie on /dashboard/* → 302 redirect to /login if invalid
Dashboard reads session via lucia.validateSession()
```

**Database additions (Prisma):**

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

---

## Files to Create

| # | File | Purpose |
|---|------|---------|
| 1 | `src/lib/auth.ts` | Lucia instance, session validate function |
| 2 | `src/app/api/auth/login/route.ts` | POST: validate credentials, create session |
| 3 | `src/app/api/auth/register/route.ts` | POST: create user, hash password, create session |
| 4 | `src/app/api/auth/logout/route.ts` | POST: invalidate session, clear cookie |
| 5 | `src/middleware.ts` | Protect /dashboard routes, redirect to /login |
| 6 | `src/app/dashboard/venues/page.tsx` | Venue listing with server-side pagination table |
| 7 | `src/app/dashboard/venues/[slug]/page.tsx` | Edit venue form with inline package management |
| 8 | `src/app/dashboard/venues/new/page.tsx` | Create venue form (same form as edit) |
| 9 | `src/app/api/venues/[slug]/packages/route.ts` | POST: add package to venue |
| 10 | `src/app/api/packages/[id]/route.ts` | PUT/DELETE: update or delete a package |

## Files to Modify

| # | File | Change |
|---|------|--------|
| 11 | `prisma/schema.prisma` | Add User + Session models |
| 12 | `src/components/ui-custom/Sidebar.tsx` | Add Venues nav item (Building2 icon) |
| 13 | `src/components/ui-custom/Navbar.tsx` | Show user name + logout when authenticated |
| 14 | `src/app/login/page.tsx` | Wire form to real /api/auth/login API |
| 15 | `src/app/register/page.tsx` | Wire form to real /api/auth/register API |
| 16 | `src/app/api/venues/route.ts` | Add auth check, add pagination + search to GET |
| 17 | `package.json` | Add lucia, @lucia-auth/adapter-prisma, bcrypt |

---

## API Routes (Auth)

### `POST /api/auth/login`
Body: `{ email: string, password: string }`
Response: `{ user: { id, name, email, role } }` + sets session cookie
Error: 401 if invalid credentials

### `POST /api/auth/register`
Body: `{ name: string, email: string, password: string, role: string }`
Response: `{ user: { id, name, email, role } }` + sets session cookie
Error: 409 if email exists, 400 if validation fails

### `POST /api/auth/logout`
Body: none
Response: `{ success: true }` — clears session cookie

---

## API Routes (Venue CRUD — protected)

All venue management routes require auth (middleware already protects `/dashboard/*` and `/api/venues/*` for POST/PUT/DELETE). Public GET for listing and detail remains open.

### `GET /api/venues?page=1&perPage=10&search=`
Response: `{ venues: [...], total: number, page: number, totalPages: number }`
Server-side pagination. Returns paginated venue list.

### `POST /api/venues` (already exists — add auth)
Adds venue. Returns created venue with 201.

### `PUT /api/venues/[slug]`
Body: venue fields. Updates venue.

### `DELETE /api/venues/[slug]`
Deletes venue and cascaded packages.

### `POST /api/venues/[slug]/packages`
Body: `{ name, pax, price, features[], bookingUrl }`. Adds package to venue.

### `PUT /api/packages/[id]`
Body: package fields. Updates package.

### `DELETE /api/packages/[id]`
Deletes package.

---

## Dashboard Venue Pages

### `/dashboard/venues` — Listing

Server component fetching paginated data. Layout:
- Page header: "Kelola Venue" + "Tambah Venue" button
- Search input for name filtering
- Paginated table with columns: Name, Location, Capacity, Packages count, Actions
- Actions: Edit (link to `/dashboard/venues/[slug]`), Delete (confirmation dialog)
- Pagination controls: Previous/Next + page numbers
- Empty state: "Belum ada venue. Tambah venue pertama Anda."

### `/dashboard/venues/new` — Create
- Venue form: name, slug (auto from name), location, description, maxCapacity, images (dynamic URL inputs)
- Packages section below: add/edit/remove packages inline using `useFieldArray`
- Submit → POST to API

### `/dashboard/venues/[slug]` — Edit
- Same form as create, pre-filled with venue data
- Existing packages shown, can be modified or deleted
- New packages can be added
- Delete venue button (with confirmation dialog)

---

## Navbar Changes

- When session exists: show user name (greeting) + "Logout" button instead of "Login"
- When no session: show existing "Login" button
- "Start Planning" button always links to `/dashboard`

---

## Dependencies

```json
{
  "lucia": "^3.0.0",
  "@lucia-auth/adapter-prisma": "^4.0.0",
  "bcrypt": "^5.1.0",
  "oslo": "^1.0.0"
}
```

---

## States & Edge Cases

| Component | States |
|---|---|
| Login form | Idle, validating, loading (signing in), error (invalid credentials) |
| Register form | Idle, validating, loading, error (email exists) |
| Middleware | No cookie → redirect, expired session → redirect, valid session → pass |
| Venue table | Loading (skeleton), empty (no venues), filtered empty, paginated |
| Venue form | Create mode, edit mode (pre-filled), loading (saving), validation errors |
| Delete | Confirmation dialog, loading (deleting) |
| Packages | Add new row, remove row, modify existing |
| Navbar | Authenticated state (name + logout), unauthenticated (login link) |

---

## Not In Scope

- Email verification
- Password reset / forgot password
- Role-based access control (all authenticated users = admin for now)
- Image upload (URL inputs only — match existing pattern)
- OAuth / social login
