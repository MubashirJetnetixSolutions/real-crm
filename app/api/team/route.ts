import { ok, withAuth } from "@/lib/api";
import { query, type RowDataPacket } from "@/lib/db";

interface AgentRow extends RowDataPacket {
  id: number;
  name: string;
  job_title: string | null;
  avatar_url: string | null;
}

/** List active team members (used by assignment dropdowns; full team CRUD comes with the Team feature). */
export const GET = withAuth(async () => {
  const rows = await query<AgentRow>(
    `SELECT id, name, job_title, avatar_url FROM users
     WHERE deleted_at IS NULL AND status <> 'Inactive'
     ORDER BY name`
  );
  return ok(
    rows.map((r) => ({
      id: r.id,
      name: r.name,
      jobTitle: r.job_title,
      avatarUrl: r.avatar_url,
    }))
  );
});
