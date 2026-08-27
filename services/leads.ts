import "server-only";
import { execute, query, queryOne, type RowDataPacket, type SqlParam } from "@/lib/db";
import type { CreateLeadInput, UpdateLeadInput } from "@/lib/validations/leads";
import type { LeadDTO, LeadStage, LeadStatus } from "@/types/leads";

interface LeadRow extends RowDataPacket {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  property_interest: string | null;
  budget: string | null;
  preferred_location: string | null;
  notes: string | null;
  stage: LeadStage;
  status: LeadStatus;
  source: string | null;
  avatar_url: string | null;
  agent_id: number | null;
  agent_name: string | null;
  agent_avatar: string | null;
  has_follow_up: number;
  created_at: string;
  updated_at: string;
}

const SELECT_LEAD = `
  SELECT l.*, u.name AS agent_name, u.avatar_url AS agent_avatar,
    EXISTS(
      SELECT 1 FROM follow_ups f
      WHERE f.lead_id = l.id AND f.completed_at IS NULL
    ) AS has_follow_up
  FROM leads l
  LEFT JOIN users u ON u.id = l.agent_id AND u.deleted_at IS NULL
`;

function toDTO(row: LeadRow): LeadDTO {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    propertyInterest: row.property_interest,
    budget: row.budget,
    preferredLocation: row.preferred_location,
    notes: row.notes,
    stage: row.stage,
    status: row.status,
    source: row.source,
    avatarUrl: row.avatar_url,
    agentId: row.agent_id,
    agentName: row.agent_name,
    agentAvatar: row.agent_avatar,
    hasFollowUp: Boolean(row.has_follow_up),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface ListLeadsFilters {
  search?: string;
  stage?: LeadStage;
  status?: LeadStatus;
  agentId?: number;
  limit: number;
  offset: number;
  sort: string;
  dir: "asc" | "desc";
}

// Whitelist for ORDER BY — interpolated identifiers must never come from input.
const SORTABLE: Record<string, string> = {
  name: "l.name",
  stage: "l.stage",
  status: "l.status",
  budget: "l.budget",
  createdAt: "l.created_at",
  updatedAt: "l.updated_at",
};

export async function listLeads(filters: ListLeadsFilters): Promise<{ rows: LeadDTO[]; total: number }> {
  const where: string[] = ["l.deleted_at IS NULL"];
  const params: SqlParam[] = [];

  if (filters.search) {
    where.push("(l.name LIKE ? OR l.email LIKE ? OR l.phone LIKE ? OR l.property_interest LIKE ? OR l.budget LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like, like, like);
  }
  if (filters.stage) {
    where.push("l.stage = ?");
    params.push(filters.stage);
  }
  if (filters.status) {
    where.push("l.status = ?");
    params.push(filters.status);
  }
  if (filters.agentId) {
    where.push("l.agent_id = ?");
    params.push(filters.agentId);
  }

  const whereSql = `WHERE ${where.join(" AND ")}`;
  const orderCol = SORTABLE[filters.sort] ?? "l.created_at";
  const orderDir = filters.dir === "asc" ? "ASC" : "DESC";

  const countRow = await queryOne<RowDataPacket>(
    `SELECT COUNT(*) AS total FROM leads l ${whereSql}`,
    params
  );
  const total = Number(countRow?.total ?? 0);

  // LIMIT/OFFSET are validated integers; MySQL prepared statements reject
  // placeholders there in some server versions, so they are interpolated.
  const limit = Math.trunc(filters.limit);
  const offset = Math.trunc(filters.offset);
  const rows = await query<LeadRow>(
    `${SELECT_LEAD} ${whereSql} ORDER BY ${orderCol} ${orderDir} LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  return { rows: rows.map(toDTO), total };
}

export async function getLeadById(id: number): Promise<LeadDTO | null> {
  const row = await queryOne<LeadRow>(`${SELECT_LEAD} WHERE l.id = ? AND l.deleted_at IS NULL`, [id]);
  return row ? toDTO(row) : null;
}

export async function createLead(input: CreateLeadInput): Promise<LeadDTO> {
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=dbe1ff&color=004ac6&bold=true`;
  const result = await execute(
    `INSERT INTO leads
       (name, email, phone, property_interest, budget, preferred_location, notes, stage, status, source, avatar_url, agent_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.email,
      input.phone,
      input.propertyInterest,
      input.budget,
      input.preferredLocation,
      input.notes,
      input.stage,
      input.status,
      input.source,
      avatar,
      input.agentId,
    ]
  );
  const lead = await getLeadById(result.insertId);
  if (!lead) throw new Error(`Lead ${result.insertId} not found after insert`);
  return lead;
}

const UPDATABLE: Record<keyof UpdateLeadInput, string> = {
  name: "name",
  email: "email",
  phone: "phone",
  propertyInterest: "property_interest",
  budget: "budget",
  preferredLocation: "preferred_location",
  notes: "notes",
  stage: "stage",
  status: "status",
  source: "source",
  agentId: "agent_id",
};

export async function updateLead(id: number, input: UpdateLeadInput): Promise<LeadDTO | null> {
  const sets: string[] = [];
  const params: SqlParam[] = [];
  for (const [key, column] of Object.entries(UPDATABLE) as [keyof UpdateLeadInput, string][]) {
    if (input[key] !== undefined) {
      sets.push(`${column} = ?`);
      params.push(input[key] as SqlParam);
    }
  }
  if (sets.length > 0) {
    params.push(id);
    const result = await execute(
      `UPDATE leads SET ${sets.join(", ")} WHERE id = ? AND deleted_at IS NULL`,
      params
    );
    if (result.affectedRows === 0) return null;
  }
  return getLeadById(id);
}

/** Soft delete. Returns false when the lead does not exist (or was already deleted). */
export async function deleteLead(id: number): Promise<boolean> {
  const result = await execute(
    "UPDATE leads SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  return result.affectedRows > 0;
}
