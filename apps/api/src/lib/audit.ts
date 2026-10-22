import type { Request } from "express";
import { db } from "./supabase";
import { logger } from "./logger";

export async function audit(
  req: Request,
  action: string,
  entity: string,
  entityId?: string | null,
  details?: Record<string, unknown>,
) {
  const { error } = await db.from("activity_log").insert({
    actor_email: req.admin?.email ?? null,
    action,
    entity,
    entity_id: entityId ?? null,
    details: details ?? null,
  });
  if (error) logger.warn({ error }, "audit insert failed");
}
