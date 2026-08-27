export type Role = "admin" | "user";

/** Public shape of an authenticated user — safe to send to the client. */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string | null;
}

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}
