import { Router } from "express";
import { z } from "zod";
import { RESOURCES, type ResourceName } from "@diner/shared";
import { db } from "../../lib/supabase";
import { HttpError, onlyProvided, unwrap } from "../../lib/http";
import { revalidate } from "../../lib/revalidate";
import { audit } from "../../lib/audit";
import { requireRole } from "../../middleware/auth";

/** Generic CRUD for content tables (menu, events, posts, gallery, testimonials, faqs, pages). */
export const resourcesRouter = Router();
resourcesRouter.use(requireRole("admin"));

function resource(name: string) {
  if (!(name in RESOURCES)) throw new HttpError(404, "Unknown resource");
  return RESOURCES[name as ResourceName];
}

const idParam = z.object({ id: z.uuid() });

resourcesRouter.get("/:resource", async (req, res) => {
  const r = resource(req.params.resource);
  const ascending = r.order !== "created_at";
  const rows = unwrap(await db.from(r.table).select("*").order(r.order, { ascending }).limit(1000));
  res.json({ data: rows });
});

resourcesRouter.get("/:resource/:id", async (req, res) => {
  const r = resource(req.params.resource);
  const { id } = idParam.parse(req.params);
  res.json({ data: unwrap(await db.from(r.table).select("*").eq("id", id).single()) });
});

resourcesRouter.post("/:resource", async (req, res) => {
  const name = req.params.resource;
  const r = resource(name);
  const input = r.schema.parse(req.body) as Record<string, unknown>;
  if (name === "posts" && input.status === "published" && !input.published_at) {
    input.published_at = new Date().toISOString();
  }
  const row = unwrap(await db.from(r.table).insert(input).select("*").single()) as { id: string };
  await Promise.all([revalidate(r.revalidate), audit(req, "create", name, row.id)]);
  res.status(201).json({ data: row });
});

resourcesRouter.patch("/:resource/:id", async (req, res) => {
  const name = req.params.resource;
  const r = resource(name);
  const { id } = idParam.parse(req.params);
  const input = onlyProvided((r.schema as z.ZodObject).partial().parse(req.body), req.body) as Record<
    string,
    unknown
  >;
  if (name === "posts" && input.status === "published" && !input.published_at) {
    const current = unwrap(await db.from("posts").select("published_at").eq("id", id).single()) as {
      published_at: string | null;
    };
    if (!current.published_at) input.published_at = new Date().toISOString();
  }
  const row = unwrap(await db.from(r.table).update(input).eq("id", id).select("*").single());
  await Promise.all([revalidate(r.revalidate), audit(req, "update", name, id, { fields: Object.keys(input) })]);
  res.json({ data: row });
});

resourcesRouter.delete("/:resource/:id", async (req, res) => {
  const name = req.params.resource;
  const r = resource(name);
  const { id } = idParam.parse(req.params);
  unwrap(await db.from(r.table).delete().eq("id", id));
  await Promise.all([revalidate(r.revalidate), audit(req, "delete", name, id)]);
  res.status(204).end();
});

/** Persist a drag-and-drop order: body = { ids: [...] } in display order. */
resourcesRouter.post("/:resource/reorder", async (req, res) => {
  const name = req.params.resource;
  const r = resource(name);
  const { ids } = z.object({ ids: z.array(z.uuid()).max(1000) }).parse(req.body);
  await Promise.all(ids.map((id, i) => db.from(r.table).update({ sort_order: i + 1 }).eq("id", id)));
  await revalidate(r.revalidate);
  res.json({ ok: true });
});
