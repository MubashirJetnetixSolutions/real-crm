import type { NextRequest } from "next/server";
import { created, getPagination, ok, paginationMeta, parseBody, withAuth } from "@/lib/api";
import { createLeadSchema } from "@/lib/validations/leads";
import { logActivity } from "@/services/activityLog";
import { createLead, listLeads } from "@/services/leads";
import { LEAD_STAGES, LEAD_STATUSES, type LeadStage, type LeadStatus } from "@/types/leads";

export const GET = withAuth(async (req: NextRequest) => {
  const params = req.nextUrl.searchParams;
  const { page, pageSize, offset } = getPagination(params, 50);

  const stageParam = params.get("stage");
  const statusParam = params.get("status");
  const agentIdParam = Number(params.get("agentId"));

  const { rows, total } = await listLeads({
    search: params.get("search")?.trim() || undefined,
    stage: LEAD_STAGES.includes(stageParam as LeadStage) ? (stageParam as LeadStage) : undefined,
    status: LEAD_STATUSES.includes(statusParam as LeadStatus) ? (statusParam as LeadStatus) : undefined,
    agentId: Number.isInteger(agentIdParam) && agentIdParam > 0 ? agentIdParam : undefined,
    limit: pageSize,
    offset,
    sort: params.get("sort") ?? "createdAt",
    dir: params.get("dir") === "asc" ? "asc" : "desc",
  });

  return ok(rows, paginationMeta(page, pageSize, total));
});

export const POST = withAuth(async (req: NextRequest, _ctx, user) => {
  const input = await parseBody(req, createLeadSchema);
  const lead = await createLead(input);

  await logActivity({
    userId: user.id,
    action: "lead.create",
    entityType: "lead",
    entityId: lead.id,
    details: { name: lead.name },
    ip: req.headers.get("x-forwarded-for"),
  });

  return created(lead);
});
