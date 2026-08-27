import type { NextRequest } from "next/server";
import { ApiError, noContent, ok, parseBody, withAuth } from "@/lib/api";
import { createLeadSchema, updateLeadSchema } from "@/lib/validations/leads";
import { logActivity } from "@/services/activityLog";
import { deleteLead, getLeadById, updateLead } from "@/services/leads";

type Ctx = RouteContext<"/api/leads/[id]">;

async function leadIdFrom(ctx: Ctx): Promise<number> {
  const { id } = await ctx.params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId) || leadId <= 0) {
    throw new ApiError(400, "Invalid lead id");
  }
  return leadId;
}

export const GET = withAuth(async (_req: NextRequest, ctx: Ctx) => {
  const id = await leadIdFrom(ctx);
  const lead = await getLeadById(id);
  if (!lead) throw new ApiError(404, "Lead not found");
  return ok(lead);
});

export const PUT = withAuth(async (req: NextRequest, ctx: Ctx, user) => {
  const id = await leadIdFrom(ctx);
  const input = await parseBody(req, createLeadSchema);
  const lead = await updateLead(id, input);
  if (!lead) throw new ApiError(404, "Lead not found");

  await logActivity({
    userId: user.id,
    action: "lead.update",
    entityType: "lead",
    entityId: id,
    ip: req.headers.get("x-forwarded-for"),
  });
  return ok(lead);
});

export const PATCH = withAuth(async (req: NextRequest, ctx: Ctx, user) => {
  const id = await leadIdFrom(ctx);
  const input = await parseBody(req, updateLeadSchema);
  const lead = await updateLead(id, input);
  if (!lead) throw new ApiError(404, "Lead not found");

  await logActivity({
    userId: user.id,
    action: "lead.update",
    entityType: "lead",
    entityId: id,
    ip: req.headers.get("x-forwarded-for"),
  });
  return ok(lead);
});

export const DELETE = withAuth(async (req: NextRequest, ctx: Ctx, user) => {
  const id = await leadIdFrom(ctx);
  const deleted = await deleteLead(id);
  if (!deleted) throw new ApiError(404, "Lead not found");

  await logActivity({
    userId: user.id,
    action: "lead.delete",
    entityType: "lead",
    entityId: id,
    ip: req.headers.get("x-forwarded-for"),
  });
  return noContent();
});
