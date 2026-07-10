import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  adapter: PrismaPg | undefined;
};

function createPrismaClient() {
  const adapter =
    globalForPrisma.adapter ??
    new PrismaPg(process.env["DATABASE_URL"] ?? "");
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.adapter = adapter;
    globalForPrisma.prisma = client;
  }

  return client;
}

export const db = globalForPrisma.prisma ?? createPrismaClient();
