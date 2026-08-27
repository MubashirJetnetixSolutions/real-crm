import type { NextRequest } from "next/server";
import { ApiError, noContent, ok, parseBody, withAuth } from "@/lib/api";
import { createClientSchema, updateClientSchema } from "@/lib/validations/clients";
import { logActivity } from "@/services/activityLog";
import { deleteClient, getClientById, getClientDeals, updateClient } from "@/services/clients";

type Ctx = RouteContext<"/api/clients/[id]">;

async function clientIdFrom(ctx: Ctx): Promise<number> {
  const { id } = await ctx.params;
  const clientId = Number(id);
  if (!Number.isInteger(clientId) || clientId <= 0) {
    throw new ApiError(400, "Invalid client id");
  }
  return clientId;
}

export const GET = withAuth(async (_req: NextRequest, ctx: Ctx) => {
  const id = await clientIdFrom(ctx);
  const client = await getClientById(id);
  if (!client) throw new ApiError(404, "Client not found");
  const deals = await getClientDeals(id);
  return ok({ ...client, deals });
});

export const PUT = withAuth(async (req: NextRequest, ctx: Ctx, user) => {
  const id = await clientIdFrom(ctx);
  const input = await parseBody(req, createClientSchema);
  const client = await updateClient(id, input);
  if (!client) throw new ApiError(404, "Client not found");

  await logActivity({
    userId: user.id,
    action: "client.update",
    entityType: "client",
    entityId: id,
    ip: req.headers.get("x-forwarded-for"),
  });
  return ok(client);
});

export const PATCH = withAuth(async (req: NextRequest, ctx: Ctx, user) => {
  const id = await clientIdFrom(ctx);
  const input = await parseBody(req, updateClientSchema);
  const client = await updateClient(id, input);
  if (!client) throw new ApiError(404, "Client not found");

  await logActivity({
    userId: user.id,
    action: "client.update",
    entityType: "client",
    entityId: id,
    ip: req.headers.get("x-forwarded-for"),
  });
  return ok(client);
});

export const DELETE = withAuth(async (req: NextRequest, ctx: Ctx, user) => {
  const id = await clientIdFrom(ctx);
  const deleted = await deleteClient(id);
  if (!deleted) throw new ApiError(404, "Client not found");

  await logActivity({
    userId: user.id,
    action: "client.delete",
    entityType: "client",
    entityId: id,
    ip: req.headers.get("x-forwarded-for"),
  });
  return noContent();
});
