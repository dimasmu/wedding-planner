# Role-Based Dashboard + User Management + Venue Publish — Design Spec

**Date:** 2026-07-03
**Status:** Approved

---

## Overview

Add role-based access to the dashboard: admin (full CMS, manage users, publish venues), editor (CRUD venues but no publish/delete), and couple (wedding planning only). Introduce venue publish status so only published venues appear on the public catalog. Add user management page for admins to manage roles and delete users.

---

## Role Hierarchy

| Role | Source | Dashboard Access | Permissions |
|---|---|---|---|
| **admin** | Seed only | Full 8 items | CRUD venues, publish/unpublish, delete venues, manage users |
| **editor** | Register | 6 items (no Users) | CRUD venues (save draft only), no publish, no delete |
| **couple** | Register | 5 items (no Venues/Users) | Overview, Checklist, Budget, Guests, Settings |

Admin cannot be created via registration — only seeded.

---

## Database Changes

### Venue — Add `status` field

```prisma
model Venue {
  // ... existing fields
  status      String    @default("draft")  // "draft" | "published"
}
```

### User — Add `updatedAt` field

```prisma
model User {
  // ... existing fields
  updatedAt    DateTime  @updatedAt
}
```

---

## Register Page Changes

- Replace "I'm a Vendor" tab with "I'm an Editor"
- Role enum: `z.enum(["couple", "editor"])`
- Default role: `"couple"`

---

## Sidebar (Role-Based)

**Admin (8 items):**
```
Overview | Checklist | Budget | Guests | Venues | Users (NEW) | Settings
```

**Editor (6 items):**
```
Overview | Checklist | Budget | Guests | Venues | Settings
```

**Couple (5 items):**
```
Overview | Checklist | Budget | Guests | Settings
```

Sidebar fetches user role from `GET /api/auth/me` (already returns `role`). The `navItems` array filters based on role.

---

## Venue Publish Workflow

### Public catalog (`/venue`)
- `GET /api/venues` (public) filters `status: "published"` by default
- Draft venues never shown to public

### Dashboard venue listing (`/dashboard/venues`)
- Shows all venues with status badge (green "Published" / gray "Draft")
- Admin sees "Publish/Unpublish" action button per row
- Editor sees no publish controls

### Dashboard venue form (`/dashboard/venues/new`, `/[slug]`)
- Status toggle visible only to admin
- Editor saves always as draft
- New venues default to draft

### API changes
- `POST /api/venues` — accepts optional `status`, defaults to `"draft"`
- `PUT /api/venues/[slug]` — accepts `status` update
- Public `GET /api/venues` — always filters `status: "published"`
- Dashboard `GET /api/venues?page=1` — no status filter (shows all)

---

## User Management (`/dashboard/users`)

**Admin only** — page hidden from editor and couple.

**Layout:** Server component with paginated table + client interactions

| Name | Email | Role | Created | Actions |
|---|---|---|---|---|
| Admin User | admin@... | admin | Jul 3 | — (protected) |
| Editor Name | editor@... | editor | Jul 3 | Role dropdown / Delete |

**Features:**
- Change user role: dropdown select (editor / couple, cannot change admin)
- Delete user: confirmation dialog (cannot delete self, cannot delete admins if only one remains)
- Server-side pagination: `?page=1&search=`
- Search by name or email

**API:**
- `GET /api/users?page=1&search=` — paginated user list (admin only)
- `PUT /api/users/[id]` — update user role (admin only)
- `DELETE /api/users/[id]` — delete user (admin only, cannot delete self/last admin)

---

## Seed Data Update

Add two users to `prisma/seed.ts`:
- **Admin:** `admin@solaproject.com` / `admin123` / `"admin"`
- **Editor:** `editor@solaproject.com` / `editor123` / `"editor"`

Existing venue seed data sets all venues to `status: "published"`.

---

## Files to Create

| # | File | Purpose |
|---|---|---|
| 1 | `src/app/dashboard/users/page.tsx` | User management listing page |
| 2 | `src/app/api/users/route.ts` | GET paginated users |
| 3 | `src/app/api/users/[id]/route.ts` | PUT role, DELETE user |

## Files to Modify

| # | File | Change |
|---|---|---|
| 4 | `prisma/schema.prisma` | Add `status` to Venue, add `updatedAt` to User |
| 5 | `prisma/seed.ts` | Add admin + editor users, set venue status to published |
| 6 | `src/app/register/page.tsx` | Change "vendor" to "editor" |
| 7 | `src/components/ui-custom/Sidebar.tsx` | Role-based nav filtering, add Users item |
| 8 | `src/app/api/venues/route.ts` | Add status filter, accept status in POST |
| 9 | `src/app/api/venues/[slug]/route.ts` | Accept status in PUT |
| 10 | `src/app/dashboard/venues/page.tsx` | Show status badge |
| 11 | `src/app/dashboard/venues/table.tsx` | Add publish toggle (admin only), status column |
| 12 | `src/app/dashboard/venues/form.tsx` | Add status toggle (admin only) |

---

## States & Edge Cases

| Component | States |
|---|---|
| Venue status | Draft (default on create), Published, toggle animation |
| User table | Loading, empty (only admin), paginated, search filtered |
| User delete | Cannot delete self, cannot delete last admin, confirmation dialog |
| Sidebar | Loading (skeleton), admin view, editor view, couple view |
| Register | Couple tab active (default), Editor tab active, validation errors |
| Public catalog | Only published venues shown, draft count hidden |

---

## Not In Scope

- Admin creating users (register-only for now)
- Password change/reset
- Email verification
- Role-based API route protection (middleware already covers /dashboard)
