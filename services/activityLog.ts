import "server-only";
import { execute } from "@/lib/db";
import { logger } from "@/lib/logger";

/**
 * Persist an audit-trail entry. Never throws — auditing must not break the
 * request that triggered it.
 */
export async function logActivity(entry: {
  userId: number | null;
  action: string;
  entityType?: string;
  entityId?: number;
  details?: Record<string, unknown>;
  ip?: string | null;
}): Promise<void> {
  try {
    await execute(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        entry.userId,
        entry.action,
        entry.entityType ?? null,
        entry.entityId ?? null,
        entry.details ? JSON.stringify(entry.details) : null,
        entry.ip ?? null,
      ]
    );
  } catch (err) {
    logger.error("activity_log_failed", {
      action: entry.action,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
