import { ok, withAuth } from "@/lib/api";

export const GET = withAuth(async (_req, _ctx, user) => {
  return ok(user);
});
