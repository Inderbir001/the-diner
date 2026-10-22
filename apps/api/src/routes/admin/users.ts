import { Router } from "express";
import { z } from "zod";
import { db } from "../../lib/supabase";
import { HttpError, unwrap } from "../../lib/http";
import { audit } from "../../lib/audit";
import { clearAuthCache, requireRole } from "../../middleware/auth";
import { env } from "../../env";

/** Team management — owners only. */
export const usersRouter = Router();
usersRouter.use(requireRole("owner"));

const role = z.enum(["owner", "admin", "staff"]);

usersRouter.get("/", async (_req, res) => {
  res.json({ data: unwrap(await db.from("admin_users").select("*").order("created_at")) });
});

/** Invite by email. Supabase sends the invite; the person sets a password via the link. */
usersRouter.post("/", async (req, res) => {
  const { email, name, role: r } = z
    .object({ email: z.email(), name: z.string().trim().max(80).optional(), role: role.default("admin") })
    .parse(req.body);

  let userId: string | undefined;
  const invite = await db.auth.admin.inviteUserByEmail(email, {
    redirectTo: new URL("/admin/reset", env.WEB_URL).toString(),
  });
  if (invite.data.user) userId = invite.data.user.id;
  else {
    // already registered: find the existing auth user
    const { data } = await db.auth.admin.listUsers({ perPage: 1000 });
    userId = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  }
  if (!userId) throw new HttpError(400, invite.error?.message ?? "Could not invite this user.");

  const row = unwrap(
    await db
      .from("admin_users")
      .upsert({ user_id: userId, email, name: name ?? null, role: r })
      .select("*")
      .single(),
  );
  await audit(req, "invite", "admin_user", userId, { email, role: r });
  res.status(201).json({ data: row });
});

usersRouter.patch("/:id", async (req, res) => {
  const { id } = z.object({ id: z.uuid() }).parse(req.params);
  const { role: r } = z.object({ role }).parse(req.body);
  if (id === req.admin!.id && r !== "owner") throw new HttpError(400, "You can't demote yourself.");
  const row = unwrap(await db.from("admin_users").update({ role: r }).eq("user_id", id).select("*").single());
  clearAuthCache();
  await audit(req, "update", "admin_user", id, { role: r });
  res.json({ data: row });
});

usersRouter.delete("/:id", async (req, res) => {
  const { id } = z.object({ id: z.uuid() }).parse(req.params);
  if (id === req.admin!.id) throw new HttpError(400, "You can't remove yourself.");
  unwrap(await db.from("admin_users").delete().eq("user_id", id));
  clearAuthCache();
  await audit(req, "remove", "admin_user", id);
  res.status(204).end();
});
