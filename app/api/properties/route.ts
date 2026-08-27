import { ok, withAuth } from "@/lib/api";
import { query, type RowDataPacket } from "@/lib/db";

interface PropertyRow extends RowDataPacket {
  id: number;
  code: string;
  title: string;
  status: string;
}

/** Minimal property list for dropdowns; full property CRUD ships with the Properties feature. */
export const GET = withAuth(async () => {
  const rows = await query<PropertyRow>(
    "SELECT id, code, title, status FROM properties WHERE deleted_at IS NULL ORDER BY title"
  );
  return ok(rows.map((r) => ({ id: r.id, code: r.code, title: r.title, status: r.status })));
});
