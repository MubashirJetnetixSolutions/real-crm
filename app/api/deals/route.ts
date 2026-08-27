import type { NextRequest } from "next/server";
import { created, ok, parseBody, withAuth } from "@/lib/api";
import { createDealSchema } from "@/lib/validations/deals";
import { logActivity } from "@/services/activityLog";
import { createDeal, listDeals } from "@/services/deals";

// Minimal deals API: list + create. The kanban board endpoints (move/win/lose,
// per-column ordering, PUT/PATCH/DELETE) ship with the Deals feature.
export const GET = withAuth(async () => {
  const rows = await listDeals();
  return ok(
    rows.map((d) => ({
      id: d.id,
      title: d.title,
      price: Number(d.price),
      priority: d.priority,
      stage: d.stage,
      notes: d.notes,
      imageUrl: d.image_url,
      outcome: d.outcome,
      expectedCloseAt: d.expected_close_at,
      columnId: d.column_id,
      clientName: d.client_name,
      agentName: d.agent_name,
      createdAt: d.created_at,
      updatedAt: d.updated_at,
    }))
  );
});

export const POST = withAuth(async (req: NextRequest, _ctx, user) => {
  const input = await parseBody(req, createDealSchema);
  const dealId = await createDeal(input);

  await logActivity({
    userId: user.id,
    action: "deal.create",
    entityType: "deal",
    entityId: dealId,
    details: { title: input.title },
    ip: req.headers.get("x-forwarded-for"),
  });

  return created({ id: dealId });
});
