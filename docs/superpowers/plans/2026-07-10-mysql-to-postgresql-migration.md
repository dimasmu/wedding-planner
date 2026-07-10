# MySQL to PostgreSQL Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the database from MySQL/MariaDB to PostgreSQL using `@prisma/adapter-pg`, with zero data migration (fresh start).

**Architecture:** Swap the Prisma adapter from `PrismaMariaDb` to `PrismaPg`, change the schema provider to `postgresql`, regenerate migrations, and re-seed. Only two code files change (`src/lib/db.ts`, `prisma/seed.ts`), plus schema and packages.

**Tech Stack:** Prisma 7, `@prisma/adapter-pg`, `pg`, Neon (preview), VPS PostgreSQL (production)

---

### Task 1: Set up `.env` with PostgreSQL connection

**Files:**
- Create: `.env`

- [ ] **Step 1: Create `.env` file with the Neon connection string**

```env
DATABASE_URL=postgresql://neondb_owner:npg_eJdlCXitGT62@ep-broad-bonus-aoft2yjl-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require
```

- [ ] **Step 2: Verify the connection works**

Run: `npx prisma db pull --force`
Expected: Prisma introspects the empty Neon database without errors. It will overwrite the schema — that's fine, we'll fix it in the next task.

---

### Task 2: Change Prisma provider to PostgreSQL

**Files:**
- Modify: `prisma/schema.prisma:5-7`

- [ ] **Step 1: Change the datasource provider**

Replace line 5-7 in `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
}
```

That's it. The `@db.Text` annotations on `Venue.description`, `Venue.images`, `Package.content`, and `Package.bookingUrl` are valid in both MySQL and PostgreSQL providers — Prisma maps them to `text` in both dialects. No need to touch them.

- [ ] **Step 2: Verify the schema parses**

Run: `npx prisma validate`
Expected: "The Prisma schema is valid."

---

### Task 3: Delete old MySQL migrations

**Files:**
- Delete: `prisma/migrations/` (entire directory)

- [ ] **Step 1: Remove the old MySQL migrations folder**

Run: `rm -rf prisma/migrations`

This removes:
- `prisma/migrations/20260703071449_init/`
- `prisma/migrations/20260703085729_add_auth/`
- `prisma/migrations/20260703094526_add_status_and_updatedat/`
- `prisma/migrations/20260703094641_make_user_updatedat_optional/`
- `prisma/migrations/migration_lock.toml`

---

### Task 4: Swap packages — remove MariaDB adapter, add pg adapter

**Files:**
- Modify: `package.json:16`

- [ ] **Step 1: Update `package.json` — replace the mariadb adapter with pg adapter, add scripts**

Remove `@prisma/adapter-mariadb` from dependencies. Add `@prisma/adapter-pg` and `pg`.

The diff for `dependencies`:
```diff
- "@prisma/adapter-mariadb": "^7.8.0",
+ "@prisma/adapter-pg": "^7.8.0",
```

Add `pg` as a new dependency:
```json
"pg": "^8.13.0",
```

Add convenience scripts in the `"scripts"` block:
```json
"db:migrate": "prisma migrate deploy",
"db:push": "prisma db push",
"db:seed": "prisma db seed"
```

- [ ] **Step 2: Install the new packages and remove the old one**

Run: `npm install`
Expected: Installs `@prisma/adapter-pg` and `pg`, removes `@prisma/adapter-mariadb`.

---

### Task 5: Swap the adapter in `src/lib/db.ts`

**Files:**
- Modify: `src/lib/db.ts:2,7`

- [ ] **Step 1: Replace the import**

```diff
- import { PrismaMariaDb } from "@prisma/adapter-mariadb";
+ import { PrismaPg } from "@prisma/adapter-pg";
```

Also update the type on line 6:

```diff
  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
-   adapter: PrismaMariaDb | undefined;
+   adapter: PrismaPg | undefined;
  };
```

- [ ] **Step 2: Replace the adapter instantiation**

```diff
- new PrismaMariaDb(process.env["DATABASE_URL"] ?? "")
+ new PrismaPg(process.env["DATABASE_URL"] ?? "")
```

- [ ] **Step 3: Verify the file compiles**

Run: `npx tsc --noEmit src/lib/db.ts`
Expected: No type errors.

---

### Task 6: Swap the adapter in `prisma/seed.ts`

**Files:**
- Modify: `prisma/seed.ts:2,5`

- [ ] **Step 1: Replace the import**

```diff
- import { PrismaMariaDb } from "@prisma/adapter-mariadb";
+ import { PrismaPg } from "@prisma/adapter-pg";
```

- [ ] **Step 2: Replace the adapter instantiation**

```diff
- const adapter = new PrismaMariaDb(process.env["DATABASE_URL"] ?? "");
+ const adapter = new PrismaPg(process.env["DATABASE_URL"] ?? "");
```

---

### Task 7: Generate Prisma client and create PostgreSQL migration

- [ ] **Step 1: Generate the Prisma client with the new PostgreSQL provider**

Run: `npx prisma generate`
Expected: "Generated Prisma Client" — no errors.

- [ ] **Step 2: Create the initial PostgreSQL migration**

Run: `npx prisma migrate dev --name init`
Expected: Creates a new `prisma/migrations/` directory with a PostgreSQL SQL migration file, and applies it to the Neon database.

- [ ] **Step 3: Verify migration was applied**

Run: `npx prisma migrate status`
Expected: "Database is up to date" — 1 migration applied.

---

### Task 8: Seed the database

- [ ] **Step 1: Run the seed script**

Run: `npx prisma db seed`
Expected:
```
Seeding database...
Created admin user
Created editor user
Created venue: The Hermitage
Created venue: Rumah Imam Bonjol
Created venue: Tirtha Bridal
Created venue: Gedung Sasana Budaya
Created venue: Le Meridien
Seeding complete!
```

---

### Task 9: Verify the app works end-to-end

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: Server starts without database connection errors.

- [ ] **Step 2: Test a public page — venues list API**

Run: `curl http://localhost:3000/api/venues`
Expected: Returns JSON array with 5 venues.

- [ ] **Step 3: Test a venue detail page**

Run: `curl http://localhost:3000/api/venues/the-hermitage`
Expected: Returns JSON with The Hermitage venue and its packages.

- [ ] **Step 4: Test auth — login**

Run:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@solaproject.com","password":"admin123"}'
```
Expected: Returns 200 with user data (no password hash).

- [ ] **Step 5: Test packages endpoint**

Run: `curl http://localhost:3000/api/venues/the-hermitage/packages`
Expected: Returns 3 packages for The Hermitage (This may be a POST-only route — if it returns 405, that's fine, the GET listing is part of the venue detail response verified in step 3).

---

### Task 10: Commit

- [ ] **Step 1: Stage and commit all changes**

```bash
git add .
git commit -m "feat: migrate database from MySQL to PostgreSQL

- Replace @prisma/adapter-mariadb with @prisma/adapter-pg + pg driver
- Change Prisma provider from mysql to postgresql
- Generate fresh PostgreSQL migration
- Add db:migrate, db:push, db:seed convenience scripts

Co-Authored-By: Claude <noreply@anthropic.com>"
```
