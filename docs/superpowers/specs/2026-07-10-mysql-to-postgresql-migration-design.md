# MySQL to PostgreSQL Migration

**Date**: 2026-07-10
**Status**: Approved

## Context

The app currently uses MySQL/MariaDB via `@prisma/adapter-mariadb`. We're migrating to PostgreSQL because the target production stack uses a VPS with PostgreSQL installed. For preview/staging on Vercel, a Neon PostgreSQL database is used. The same adapter and connection string format works across both environments.

Data migration is not needed — a fresh start with re-seeding is acceptable.

## Design

### Package Changes

| Action | Package |
|--------|---------|
| Remove | `@prisma/adapter-mariadb` |
| Add | `@prisma/adapter-pg` |
| Add | `pg` (peer dependency of `@prisma/adapter-pg`) |

### Code Changes

**`src/lib/db.ts`** and **`prisma/seed.ts`** — the two files that instantiate the database adapter:

```diff
- import { PrismaMariaDb } from "@prisma/adapter-mariadb";
+ import { PrismaPg } from "@prisma/adapter-pg";

- new PrismaMariaDb(process.env["DATABASE_URL"] ?? "")
+ new PrismaPg(process.env["DATABASE_URL"] ?? "")
```

**`prisma/schema.prisma`** — provider change only:

```diff
- provider = "mysql"
+ provider = "postgresql"
```

### Migration Strategy

1. Delete the existing `prisma/migrations/` folder (contains MySQL SQL)
2. Run `npx prisma migrate dev --name init` to generate a fresh PostgreSQL migration
3. The migration lock auto-updates from `mysql` to `postgresql`

### Convenience Scripts (added to `package.json`)

```json
"db:migrate": "prisma migrate deploy",
"db:push": "prisma db push",
"db:seed": "prisma db seed"
```

### Environment

Single variable needed across all environments:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

| Environment | Value |
|-------------|-------|
| Local dev | Local PostgreSQL connection string |
| Vercel preview | Neon connection string |
| VPS production | VPS PostgreSQL connection string |

### Models

All 4 Prisma models remain unchanged:
- `Venue` — Int autoincrement PK, slugs, descriptions, images (JSON in Text)
- `Package` — Int autoincrement PK, `venueId` FK, BigInt prices
- `User` — String PK (hex), name, email, password hash, role
- `Session` — String PK, `userId` FK, expiresAt (Lucia v3 auth)

Prisma handles the SQL dialect differences between MySQL and PostgreSQL for all field types used here (`Int`, `String`, `Text`, `BigInt`, `DateTime`, `Boolean`, `autoincrement()`).

### Seed File

`prisma/seed.ts` uses the Prisma adapter directly (like the app). It needs the same migration from `PrismaMariaDb` to `PrismaPg`. The seed data remains identical.

## Verification

1. `npx prisma migrate dev` succeeds and generates PostgreSQL SQL
2. `npm run db:seed` populates the database without errors
3. `npm run dev` — app starts, all pages load, data queries work
4. Auth flows work (register, login, session)
5. Vercel preview deploy succeeds with `postinstall: prisma generate`
