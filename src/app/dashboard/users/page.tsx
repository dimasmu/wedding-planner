import { db } from "@/lib/db";

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
  const perPage = 10;
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

  return {
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    })),
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  };
}

import { UserTable } from "./table";

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
