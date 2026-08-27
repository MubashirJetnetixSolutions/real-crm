import type { NextRequest } from "next/server";
import { ok, parseBody, withHandler } from "@/lib/api";
import { logger } from "@/lib/logger";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { logActivity } from "@/services/activityLog";
import { createPasswordResetToken, findUserByEmail } from "@/services/users";

export const POST = withHandler(async (req: NextRequest) => {
  const { email } = await parseBody(req, forgotPasswordSchema);

  const user = await findUserByEmail(email);
  // Always respond identically so the endpoint can't be used to enumerate accounts.
  const response = {
    message: "If an account exists for this email, a reset link has been sent.",
  };

  if (!user) return ok(response);

  const token = await createPasswordResetToken(user.id);
  const resetUrl = `${req.nextUrl.origin}/login?reset_token=${token}`;

  // No SMTP is configured; the reset link is delivered via server logs.
  // Wire this to your mail provider before going live.
  logger.info("password_reset_link", { email: user.email, resetUrl });

  await logActivity({
    userId: user.id,
    action: "auth.forgot_password",
    ip: req.headers.get("x-forwarded-for"),
  });

  if (process.env.NODE_ENV !== "production") {
    return ok({ ...response, resetToken: token });
  }
  return ok(response);
});
