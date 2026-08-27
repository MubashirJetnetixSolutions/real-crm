import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { ZodError, type ZodType } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { logger } from "@/lib/logger";
import type { ApiFailure, ApiSuccess, PaginationMeta, PaginationParams } from "@/types/api";
import type { AuthUser, Role } from "@/types/auth";

/** Throwable error carrying an HTTP status and optional field errors. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
  }
}

export function ok<T>(data: T, meta?: PaginationMeta, status = 200) {
  const body: ApiSuccess<T> = meta ? { data, meta } : { data };
  return NextResponse.json(body, { status });
}

export function created<T>(data: T) {
  return ok(data, undefined, 201);
}

export function noContent() {
  return new NextResponse(null, { status: 204 });
}

function failure(status: number, message: string, fields?: Record<string, string>) {
  const body: ApiFailure = { error: fields ? { message, fields } : { message } };
  return NextResponse.json(body, { status });
}

/** Parse and validate a JSON body against a Zod schema. Throws ApiError(422) with field errors. */
export async function parseBody<T>(req: NextRequest, schema: ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    throw new ApiError(400, "Request body must be valid JSON");
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw new ApiError(422, "Validation failed", zodFieldErrors(result.error));
  }
  return result.data;
}

export function zodFieldErrors(error: ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_";
    if (!fields[key]) fields[key] = issue.message;
  }
  return fields;
}

/** Read page/pageSize search params with sane bounds. */
export function getPagination(searchParams: URLSearchParams, defaultPageSize = 10): PaginationParams {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize")) || defaultPageSize));
  return { page, pageSize, offset: (page - 1) * pageSize };
}

export function paginationMeta(page: number, pageSize: number, total: number): PaginationMeta {
  return { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) };
}

type PublicHandler<P> = (req: NextRequest, ctx: P) => Promise<Response>;
type AuthedHandler<P> = (req: NextRequest, ctx: P, user: AuthUser) => Promise<Response>;

function logAndRespond(req: NextRequest, err: unknown): Response {
  if (err instanceof ApiError) {
    if (err.status >= 500) {
      logger.error("api_error", { method: req.method, path: req.nextUrl.pathname, status: err.status, error: err.message });
    }
    return failure(err.status, err.message, err.fields);
  }
  logger.error("unhandled_error", {
    method: req.method,
    path: req.nextUrl.pathname,
    error: err instanceof Error ? err.message : String(err),
  });
  return failure(500, "Internal server error");
}

/** Wrap a public route handler with error handling and request logging. */
export function withHandler<P>(handler: PublicHandler<P>): PublicHandler<P> {
  return async (req, ctx) => {
    const start = Date.now();
    try {
      const res = await handler(req, ctx);
      logger.info("request", { method: req.method, path: req.nextUrl.pathname, status: res.status, ms: Date.now() - start });
      return res;
    } catch (err) {
      return logAndRespond(req, err);
    }
  };
}

/**
 * Wrap a route handler that requires an authenticated user.
 * Pass roles to additionally require a specific role (403 otherwise).
 */
export function withAuth<P>(handler: AuthedHandler<P>, opts?: { roles?: Role[] }): PublicHandler<P> {
  return withHandler(async (req, ctx) => {
    const user = await getCurrentUser();
    if (!user) throw new ApiError(401, "Authentication required");
    if (opts?.roles && !opts.roles.includes(user.role)) {
      throw new ApiError(403, "You do not have permission to perform this action");
    }
    return handler(req, ctx, user);
  });
}

/** Shorthand for admin-only route handlers. */
export function withAdmin<P>(handler: AuthedHandler<P>): PublicHandler<P> {
  return withAuth(handler, { roles: ["admin"] });
}
