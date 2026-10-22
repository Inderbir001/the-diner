import { parseSettings, type SettingsKey, type SettingsMap } from "@diner/shared";
import { db } from "./supabase";

export async function getSetting<K extends SettingsKey>(key: K): Promise<SettingsMap[K]> {
  const { data } = await db.from("settings").select("value").eq("key", key).maybeSingle();
  return parseSettings(key, data?.value);
}
