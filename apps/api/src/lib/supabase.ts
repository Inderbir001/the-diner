import { createClient } from "@supabase/supabase-js";
import { env } from "../env";

/** Service-role client. Bypasses RLS — never expose to the browser. */
export const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const MEDIA_BUCKET = "media";

export function publicMediaUrl(path: string): string {
  return db.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
