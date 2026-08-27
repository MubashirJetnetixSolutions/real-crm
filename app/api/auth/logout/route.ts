import type { NextRequest } from "next/server";
import { noContent, withHandler } from "@/lib/api";
import { clearSessionCookie, getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/services/activityLog";

export const POST = withHandler(async (req: NextRequest) => {
  const user = await getCurrentUser();
  await clearSessionCookie();
  if (user) {
    await logActivity({
      userId: user.id,
      action: "auth.logout",
      ip: req.headers.get("x-forwarded-for"),
    });
  }
  return noContent();
});
