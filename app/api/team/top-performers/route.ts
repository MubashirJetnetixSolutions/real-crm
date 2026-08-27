import type { NextRequest } from "next/server";
import { ok, withAuth } from "@/lib/api";
import { getTopPerformers, getYearlyTeamPerformance } from "@/services/users";

export const GET = withAuth(async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("mode");
  const year = Number(searchParams.get("year")) || 2026;

  if (mode === "yearly" || searchParams.has("yearly")) {
    const summary = await getYearlyTeamPerformance(year);
    return ok(summary);
  }

  const topPerformers = await getTopPerformers();
  return ok(topPerformers);
});
