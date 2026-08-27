import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { queryOne, type RowDataPacket } from "@/lib/db";
import type { AuthUser, Role, SessionPayload } from "@/types/auth";

export const SESSION_COOKIE = "session";

const DEFAULT_MAX_AGE = Number(process.env.JWT_EXPIRES_IN ?? 86400);
export const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || "estatex-development-jwt-secret-key-at-least-32-chars-2026";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  user: Pick<AuthUser, "id" | "email" | "name" | "role">,
  maxAgeSeconds: number = DEFAULT_MAX_AGE
): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAgeSeconds)
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      role: (payload.role as Role) === "admin" ? "admin" : "user",
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string, maxAgeSeconds: number = DEFAULT_MAX_AGE) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar_url: string | null;
}

/**
 * Resolve the current request's session cookie to a live user record.
 * Returns null when there is no cookie, the token is invalid/expired,
 * or the user no longer exists (soft-deleted included).
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  const row = await queryOne<UserRow>(
    "SELECT id, name, email, role, avatar_url FROM users WHERE id = ? AND deleted_at IS NULL",
    [Number(payload.sub)]
  );
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatarUrl: row.avatar_url,
  };
}
