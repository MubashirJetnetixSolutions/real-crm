import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "session";

const PUBLIC_PAGES = new Set(["/login"]);
const PUBLIC_API = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]);

async function hasValidSession(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    const secret = process.env.JWT_SECRET || "estatex-development-jwt-secret-key-at-least-32-chars-2026";
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ["HS256"],
    });
    return true;
  } catch {
    return false;
  }
}

/** Reject cross-origin mutating requests (CSRF defense-in-depth on top of SameSite cookies). */
function isCrossOrigin(req: NextRequest): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return false;
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== req.nextUrl.host;
  } catch {
    return true;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isCrossOrigin(req)) {
    return NextResponse.json(
      { error: { message: "Cross-origin request rejected" } },
      { status: 403 }
    );
  }

  const isApi = pathname.startsWith("/api");
  const authenticated = await hasValidSession(req);

  if (isApi) {
    // Route handlers do the authoritative check; this is the optimistic gate.
    if (!PUBLIC_API.has(pathname) && !authenticated) {
      return NextResponse.json(
        { error: { message: "Authentication required" } },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Redirect signed-in users away from the login page.
  if (PUBLIC_PAGES.has(pathname)) {
    if (authenticated) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!authenticated) {
    const loginUrl = new URL("/login", req.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Everything except Next.js internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
