import type { NextRequest } from "next/server";
import { created, getPagination, ok, paginationMeta, parseBody, withAuth } from "@/lib/api";
import { createClientSchema } from "@/lib/validations/clients";
import { logActivity } from "@/services/activityLog";
import { createClient, listClients } from "@/services/clients";
import { CLIENT_STATUSES, CLIENT_TYPES, type ClientStatus, type ClientType } from "@/types/clients";

export const GET = withAuth(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const { page, pageSize, offset } = getPagination(params, 50);

  const typeParam = params.get("type");
  const statusParam = params.get("status");

  const { rows, total } = await listClients({
    search: params.get("search")?.trim() || undefined,
    type: CLIENT_TYPES.includes(typeParam as ClientType) ? (typeParam as ClientType) : undefined,
    status: CLIENT_STATUSES.includes(statusParam as ClientStatus) ? (statusParam as ClientStatus) : undefined,
    limit: pageSize,
    offset,
    sort: params.get("sort") ?? "createdAt",
    dir: params.get("dir") === "asc" ? "asc" : "desc",
  });

  return ok(rows, paginationMeta(page, pageSize, total));
});

export const POST = withAuth(async (req: NextRequest, _ctx, user) => {
  const input = await parseBody(req, createClientSchema);
  const client = await createClient(input);

  await logActivity({
    userId: user.id,
    action: "client.create",
    entityType: "client",
    entityId: client.id,
    details: { name: client.name },
    ip: req.headers.get("x-forwarded-for"),
  });

  return created(client);
});
