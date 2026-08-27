import type { NextRequest } from "next/server";
import { ApiError, ok, parseBody, withHandler } from "@/lib/api";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { logActivity } from "@/services/activityLog";
import { consumePasswordResetToken, invalidateResetTokens, updatePassword } from "@/services/users";

export const POST = withHandler(async (req: NextRequest) => {
  const { token, password } = await parseBody(req, resetPasswordSchema);

  const userId = await consumePasswordResetToken(token);
  if (!userId) {
    throw new ApiError(400, "This reset link is invalid or has expired");
  }

  await updatePassword(userId, password);
  await invalidateResetTokens(userId);

  await logActivity({
    userId,
    action: "auth.reset_password",
    ip: req.headers.get("x-forwarded-for"),
  });

  return ok({ message: "Password updated. You can now sign in." });
});
