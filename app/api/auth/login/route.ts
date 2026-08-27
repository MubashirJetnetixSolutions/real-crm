import type { NextRequest } from "next/server";
import { ApiError, ok, parseBody, withHandler } from "@/lib/api";
import { createSessionToken, REMEMBER_ME_MAX_AGE, setSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";
import { logActivity } from "@/services/activityLog";
import { findUserByEmail, verifyPassword } from "@/services/users";

export const POST = withHandler(async (req: NextRequest) => {
  const { email, password, remember } = await parseBody(req, loginSchema);

  const user = await findUserByEmail(email);
  if (!user || !(await verifyPassword(user, password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  const maxAge = remember ? REMEMBER_ME_MAX_AGE : undefined;
  const token = await createSessionToken(user, maxAge);
  await setSessionCookie(token, maxAge);

  await logActivity({
    userId: user.id,
    action: "auth.login",
    ip: req.headers.get("x-forwarded-for"),
  });

  return ok({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatar_url,
  });
});
