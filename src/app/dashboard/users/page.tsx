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
