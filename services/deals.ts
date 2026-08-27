import "server-only";
import { execute, query, queryOne, type RowDataPacket } from "@/lib/db";
import type { CreateDealInput } from "@/lib/validations/deals";

interface ColumnRow extends RowDataPacket {
  id: number;
  pipeline_id: number;
  name: string;
}

/**
 * Resolve a stage name (e.g. "Negotiation") to a pipeline column, preferring
 * the first pipeline. Falls back to the very first column so a create never
 * fails on stage naming.
 */
async function resolveColumnId(stage: string): Promise<number> {
  const byName = await queryOne<ColumnRow>(
    `SELECT c.id, c.pipeline_id, c.name FROM pipeline_columns c
     JOIN pipelines p ON p.id = c.pipeline_id AND p.deleted_at IS NULL
     WHERE c.name = ? ORDER BY p.sort_order, c.sort_order LIMIT 1`,
    [stage]
  );
  if (byName) return byName.id;

  const first = await queryOne<ColumnRow>(
    `SELECT c.id, c.pipeline_id, c.name FROM pipeline_columns c
     JOIN pipelines p ON p.id = c.pipeline_id AND p.deleted_at IS NULL
     ORDER BY p.sort_order, c.sort_order LIMIT 1`
  );
  if (!first) throw new Error("No pipeline columns exist");
  return first.id;
}

export interface DealListRow extends RowDataPacket {
  id: number;
  title: string;
  price: string;
  priority: string;
  stage: string | null;
  notes: string | null;
  image_url: string | null;
  outcome: "open" | "won" | "lost";
  expected_close_at: string | null;
  column_id: number;
  client_name: string | null;
  agent_name: string | null;
  created_at: string;
  updated_at: string;
}

export async function listDeals(): Promise<DealListRow[]> {
  return query<DealListRow>(
    `SELECT d.id, d.title, d.price, d.priority, d.stage, d.notes, d.image_url,
            d.outcome, d.expected_close_at, d.column_id,
            c.name AS client_name, u.name AS agent_name, d.created_at, d.updated_at
     FROM deals d
     LEFT JOIN clients c ON c.id = d.client_id
     LEFT JOIN users u ON u.id = d.agent_id
     WHERE d.deleted_at IS NULL
     ORDER BY d.created_at DESC`
  );
}

export async function createDeal(input: CreateDealInput): Promise<number> {
  const columnId = await resolveColumnId(input.stage);
  const result = await execute(
    `INSERT INTO deals (title, client_id, property_id, column_id, price, priority, stage, notes, agent_id, expected_close_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.title,
      input.clientId,
      input.propertyId,
      columnId,
      input.price,
      input.priority,
      input.stage,
      input.notes,
      input.agentId,
      input.expectedCloseAt,
    ]
  );
  return result.insertId;
}
