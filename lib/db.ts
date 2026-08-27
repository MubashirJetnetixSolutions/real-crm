import mysql, {
  type Pool,
  type PoolConnection,
  type ResultSetHeader,
  type RowDataPacket,
} from "mysql2/promise";
import { memoryStore } from "./inMemoryDb";

/** Values accepted as prepared-statement parameters. */
export type SqlParam = string | number | bigint | boolean | Date | Buffer | null;

let pool: Pool | null | undefined;
let isMysqlAvailable: boolean | null = null;

export function getPool(): Pool | null {
  if (pool !== undefined) return pool;
  if (!process.env.DATABASE_NAME && !process.env.DATABASE_USER) {
    pool = null;
    isMysqlAvailable = false;
    return null;
  }
  try {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST ?? "127.0.0.1",
      port: Number(process.env.DATABASE_PORT ?? 3306),
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 2000,
      namedPlaceholders: false,
      dateStrings: true,
    });
  } catch {
    pool = null;
    isMysqlAvailable = false;
  }
  return pool;
}

/** Run a SELECT and return all rows. Always uses prepared statements. */
export async function query<T extends RowDataPacket>(
  sql: string,
  params: readonly SqlParam[] = []
): Promise<T[]> {
  const p = getPool();
  if (p && isMysqlAvailable !== false) {
    try {
      const [rows] = await p.execute<T[]>(sql, params as SqlParam[]);
      isMysqlAvailable = true;
      return rows;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "ECONNREFUSED" || code === "ETIMEDOUT" || code === "ENOTFOUND" || code === "ER_ACCESS_DENIED_ERROR" || code === "ER_BAD_DB_ERROR") {
        isMysqlAvailable = false;
      } else {
        throw err;
      }
    }
  }
  return memoryStore.executeQuery<T>(sql, params);
}

/** Run a SELECT and return the first row or null. */
export async function queryOne<T extends RowDataPacket>(
  sql: string,
  params: readonly SqlParam[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/** Run an INSERT/UPDATE/DELETE and return the driver result (insertId, affectedRows). */
export async function execute(
  sql: string,
  params: readonly SqlParam[] = []
): Promise<ResultSetHeader> {
  const p = getPool();
  if (p && isMysqlAvailable !== false) {
    try {
      const [result] = await p.execute<ResultSetHeader>(sql, params as SqlParam[]);
      isMysqlAvailable = true;
      return result;
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "ECONNREFUSED" || code === "ETIMEDOUT" || code === "ENOTFOUND" || code === "ER_ACCESS_DENIED_ERROR" || code === "ER_BAD_DB_ERROR") {
        isMysqlAvailable = false;
      } else {
        throw err;
      }
    }
  }
  return memoryStore.executeMutation(sql, params);
}

/** Run several statements atomically. Rolls back on any thrown error. */
export async function withTransaction<T>(
  fn: (conn: PoolConnection) => Promise<T>
): Promise<T> {
  const p = getPool();
  if (p && isMysqlAvailable !== false) {
    try {
      const conn = await p.getConnection();
      try {
        await conn.beginTransaction();
        const result = await fn(conn);
        await conn.commit();
        return result;
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code;
      if (code === "ECONNREFUSED" || code === "ETIMEDOUT" || code === "ENOTFOUND" || code === "ER_ACCESS_DENIED_ERROR" || code === "ER_BAD_DB_ERROR") {
        isMysqlAvailable = false;
      } else {
        throw err;
      }
    }
  }
  // If in-memory, invoke callback directly with mock connection if needed
  return fn({} as PoolConnection);
}

export type { RowDataPacket, ResultSetHeader, PoolConnection };

