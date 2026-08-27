import type { NextRequest } from "next/server";
import { ApiError, created, parseBody, withHandler } from "@/lib/api";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/validations/auth";
import { logActivity } from "@/services/activityLog";
import { createUser, emailExists, findUserById } from "@/services/users";

export const POST = withHandler(async (req: NextRequest) => {
  const input = await parseBody(req, registerSchema);

  if (await emailExists(input.email)) {
    throw new ApiError(409, "An account with this email already exists", {
      email: "This email is already registered",
    });
  }

  // Public registration always creates a standard user; admins are promoted
  // via the team management API.
  const userId = await createUser({ ...input, role: "user" });
  const user = await findUserById(userId);
  if (!user) throw new ApiError(500, "Failed to create account");

  const token = await createSessionToken(user);
  await setSessionCookie(token);

  await logActivity({
    userId,
    action: "auth.register",
    ip: req.headers.get("x-forwarded-for"),
  });

  return created({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatar_url,
  });
});
