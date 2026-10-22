import { Router } from "express";
import { parseSettings, settingsSchemas, SETTINGS_KEYS, type SettingsKey } from "@diner/shared";
import { db } from "../../lib/supabase";
import { HttpError, unwrap } from "../../lib/http";
import { revalidate } from "../../lib/revalidate";
import { audit } from "../../lib/audit";
import { requireRole } from "../../middleware/auth";

export const settingsRouter = Router();
settingsRouter.use(requireRole("admin"));

settingsRouter.get("/", async (_req, res) => {
  const rows = (unwrap(await db.from("settings").select("key, value")) ?? []) as { key: string; value: unknown }[];
  const byKey = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  res.json({ data: Object.fromEntries(SETTINGS_KEYS.map((k) => [k, parseSettings(k, byKey[k])])) });
});

settingsRouter.put("/:key", async (req, res) => {
  const key = req.params.key as SettingsKey;
  if (!SETTINGS_KEYS.includes(key)) throw new HttpError(404, "Unknown settings section");
  const value = settingsSchemas[key].parse(req.body);
  unwrap(await db.from("settings").upsert({ key, value }).select("key").single());
  // settings feed the layout, SEO and structured data on every page
  await Promise.all([revalidate(["settings"]), audit(req, "update", "settings", key)]);
  res.json({ data: value });
});
