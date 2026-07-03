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
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
