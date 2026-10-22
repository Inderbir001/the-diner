import { Router } from "express";
import { z } from "zod";
import { socialPostAdminSchema, type IntegrationStatus } from "@diner/shared";
import { db } from "../../lib/supabase";
import { HttpError, onlyProvided, unwrap } from "../../lib/http";
import { revalidate } from "../../lib/revalidate";
import { audit } from "../../lib/audit";
import { requireRole } from "../../middleware/auth";
import { connectInstagram } from "../../services/instagram";
import { syncSocial } from "../../services/sync";
import { env } from "../../env";

export const socialRouter = Router();
socialRouter.use(requireRole("admin"));

socialRouter.get("/status", async (_req, res) => {
  const rows = (unwrap(
    await db
      .from("integrations")
      .select("platform, access_token, account_id, account_name, token_expires_at, last_synced_at, last_error"),
  ) ?? []) as (IntegrationStatus & { access_token: string | null })[];
  const data = rows.map(({ access_token, ...r }) => ({
    ...r,
    connected:
      r.platform === "instagram" ? Boolean(access_token || env.INSTAGRAM_ACCESS_TOKEN) : Boolean(r.account_id),
  }));
  res.json({ data, youtubeApiKey: Boolean(env.YOUTUBE_API_KEY) });
});

socialRouter.post("/instagram/connect", async (req, res) => {
  const { token } = z.object({ token: z.string().trim().min(20) }).parse(req.body);
  try {
    const result = await connectInstagram(token);
    await audit(req, "connect", "instagram", result.username);
    void syncSocial(["instagram"]);
    res.json({ data: result });
  } catch (err) {
    throw new HttpError(400, err instanceof Error ? err.message : "Could not connect Instagram");
  }
});

socialRouter.post("/instagram/disconnect", async (req, res) => {
  await db
    .from("integrations")
    .update({ access_token: null, token_expires_at: null, account_id: null, account_name: null })
    .eq("platform", "instagram");
  await audit(req, "disconnect", "instagram");
  res.json({ ok: true });
});

socialRouter.post("/sync", async (req, res) => {
  const { platform } = z.object({ platform: z.enum(["instagram", "youtube"]).optional() }).parse(req.body ?? {});
  const results = await syncSocial(platform ? [platform] : undefined);
  res.json({ data: results });
});

socialRouter.get("/posts", async (req, res) => {
  const { platform } = z.object({ platform: z.enum(["instagram", "youtube"]).optional() }).parse(req.query);
  let query = db.from("social_posts").select("*").order("published_at", { ascending: false }).limit(200);
  if (platform) query = query.eq("platform", platform);
  res.json({ data: unwrap(await query) });
});

socialRouter.patch("/posts/:id", async (req, res) => {
  const { id } = z.object({ id: z.uuid() }).parse(req.params);
  const input = onlyProvided(socialPostAdminSchema.parse(req.body), req.body);
  const row = unwrap(await db.from("social_posts").update(input).eq("id", id).select("*").single());
  await revalidate(["social"]);
  res.json({ data: row });
});
