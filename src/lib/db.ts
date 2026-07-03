import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  adapter: PrismaMariaDb | undefined;
};

function createPrismaClient() {
  const adapter =
    globalForPrisma.adapter ??
    new PrismaMariaDb(process.env["DATABASE_URL"] ?? "");
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.adapter = adapter;
    globalForPrisma.prisma = client;
  }

  return client;
}

export const db = globalForPrisma.prisma ?? createPrismaClient();
