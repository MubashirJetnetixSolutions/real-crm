import "server-only";
import { execute, query, queryOne, type RowDataPacket, type SqlParam } from "@/lib/db";
import type { CreateClientInput, UpdateClientInput } from "@/lib/validations/clients";
import type { ClientDealDTO, ClientDTO, ClientStatus, ClientType } from "@/types/clients";

interface ClientRow extends RowDataPacket {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  type: ClientType;
  budget: string | null;
  intent: string | null;
  status: ClientStatus;
  active_deals: number;
  closed_deals: number;
  avatar_url: string | null;
  joined_at: string | null;
  created_at: string;
  updated_at: string;
}

function toDTO(row: ClientRow): ClientDTO {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    type: row.type,
    budget: row.budget,
    intent: row.intent,
    status: row.status,
    activeDeals: row.active_deals,
    closedDeals: row.closed_deals,
    avatarUrl: row.avatar_url,
    joinedAt: row.joined_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface ListClientsFilters {
  search?: string;
  type?: ClientType;
  status?: ClientStatus;
  limit: number;
  offset: number;
  sort: string;
  dir: "asc" | "desc";
}

const SORTABLE: Record<string, string> = {
  name: "name",
  type: "type",
  status: "status",
  joinedAt: "joined_at",
  createdAt: "created_at",
};

export async function listClients(filters: ListClientsFilters): Promise<{ rows: ClientDTO[]; total: number }> {
  const where: string[] = ["deleted_at IS NULL"];
  const params: SqlParam[] = [];

  if (filters.search) {
    where.push("(name LIKE ? OR email LIKE ? OR phone LIKE ?)");
    const like = `%${filters.search}%`;
    params.push(like, like, like);
  }
  if (filters.type) {
    where.push("type = ?");
    params.push(filters.type);
  }
  if (filters.status) {
    where.push("status = ?");
    params.push(filters.status);
  }

  const whereSql = `WHERE ${where.join(" AND ")}`;
  const orderCol = SORTABLE[filters.sort] ?? "created_at";
  const orderDir = filters.dir === "asc" ? "ASC" : "DESC";

  const countRow = await queryOne<RowDataPacket>(
    `SELECT COUNT(*) AS total FROM clients ${whereSql}`,
    params
  );
  const rows = await query<ClientRow>(
    `SELECT * FROM clients ${whereSql} ORDER BY ${orderCol} ${orderDir} LIMIT ${Math.trunc(filters.limit)} OFFSET ${Math.trunc(filters.offset)}`,
    params
  );

  return { rows: rows.map(toDTO), total: Number(countRow?.total ?? 0) };
}

export async function getClientById(id: number): Promise<ClientDTO | null> {
  const row = await queryOne<ClientRow>(
    "SELECT * FROM clients WHERE id = ? AND deleted_at IS NULL LIMIT 1",
    [id]
  );
  return row ? toDTO(row) : null;
}

interface ClientDealRow extends RowDataPacket {
  id: number;
  title: string;
  price: string;
  stage: string | null;
  outcome: "open" | "won" | "lost";
  image_url: string | null;
  updated_at: string;
}

/** Deals linked to a client, newest first — powers the profile's property history. */
export async function getClientDeals(clientId: number): Promise<ClientDealDTO[]> {
  const rows = await query<ClientDealRow>(
    `SELECT id, title, price, stage, outcome, image_url, updated_at
     FROM deals WHERE client_id = ? AND deleted_at IS NULL
     ORDER BY updated_at DESC`,
    [clientId]
  );
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    price: Number(r.price),
    stage: r.stage,
    outcome: r.outcome,
    imageUrl: r.image_url,
    updatedAt: r.updated_at,
  }));
}

export async function createClient(input: CreateClientInput): Promise<ClientDTO> {
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=dbe1ff&color=004ac6&bold=true`;
  const result = await execute(
    `INSERT INTO clients (name, email, phone, address, type, budget, intent, status, avatar_url, joined_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
    [
      input.name,
      input.email,
      input.phone,
      input.address,
      input.type,
      input.budget,
      input.intent ?? "New Inquiry",
      input.status,
      avatar,
    ]
  );
  const client = await getClientById(result.insertId);
  if (!client) throw new Error(`Client ${result.insertId} not found after insert`);
  return client;
}

const UPDATABLE: Record<keyof UpdateClientInput, string> = {
  name: "name",
  email: "email",
  phone: "phone",
  address: "address",
  type: "type",
  budget: "budget",
  intent: "intent",
  status: "status",
};

export async function updateClient(id: number, input: UpdateClientInput): Promise<ClientDTO | null> {
  const sets: string[] = [];
  const params: SqlParam[] = [];
  for (const [key, column] of Object.entries(UPDATABLE) as [keyof UpdateClientInput, string][]) {
    if (input[key] !== undefined) {
      sets.push(`${column} = ?`);
      params.push(input[key] as SqlParam);
    }
  }
  if (sets.length > 0) {
    params.push(id);
    const result = await execute(
      `UPDATE clients SET ${sets.join(", ")} WHERE id = ? AND deleted_at IS NULL`,
      params
    );
    if (result.affectedRows === 0) return null;
  }
  return getClientById(id);
}

/** Soft delete. Returns false when the client does not exist. */
export async function deleteClient(id: number): Promise<boolean> {
  const result = await execute(
    "UPDATE clients SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL",
    [id]
  );
  return result.affectedRows > 0;
}
