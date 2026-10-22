import { Router } from "express";
import { z } from "zod";
import { addDays, enquiryAdminSchema, nowInRestaurant } from "@diner/shared";
import { db } from "../../lib/supabase";
import { unwrap } from "../../lib/http";
import { audit } from "../../lib/audit";
import { requireAdmin, requireRole } from "../../middleware/auth";
import { bookingsRouter } from "./bookings";
import { resourcesRouter } from "./resources";
import { settingsRouter } from "./settings";
import { mediaRouter } from "./media";
import { socialRouter } from "./social";
import { usersRouter } from "./users";

export const adminRouter = Router();
adminRouter.use(requireAdmin);

adminRouter.get("/me", (req, res) => {
  res.json({ data: req.admin });
});

adminRouter.get("/dashboard", async (_req, res) => {
  const today = nowInRestaurant().date;
  const weekEnd = addDays(today, 7);
  const count = async (q: PromiseLike<{ count: number | null }>) => (await q).count ?? 0;
  const head = { count: "exact" as const, head: true };

  const [todayBookings, pending, upcoming, newEnquiries, posts, menuItems, todayGuests, recent] = await Promise.all([
    count(db.from("bookings").select("id", head).eq("booking_date", today).not("status", "in", "(cancelled,no_show)")),
    count(db.from("bookings").select("id", head).eq("status", "pending").gte("booking_date", today)),
    count(
      db
        .from("bookings")
        .select("id", head)
        .gte("booking_date", today)
        .lte("booking_date", weekEnd)
        .not("status", "in", "(cancelled,no_show)"),
    ),
    count(db.from("enquiries").select("id", head).eq("status", "new")),
    count(db.from("posts").select("id", head).eq("status", "published")),
    count(db.from("menu_items").select("id", head)),
    db
      .from("bookings")
      .select("party_size")
      .eq("booking_date", today)
      .not("status", "in", "(cancelled,no_show)")
      .then((r) => (r.data ?? []).reduce((s, b) => s + b.party_size, 0)),
    db
      .from("bookings")
      .select("*")
      .gte("booking_date", today)
      .not("status", "in", "(cancelled,no_show)")
      .order("booking_date")
      .order("booking_time")
      .limit(8)
      .then((r) => r.data ?? []),
  ]);

  res.json({
    data: {
      today,
      stats: { todayBookings, todayGuests, pending, upcoming, newEnquiries, posts, menuItems },
      upcomingBookings: recent,
    },
  });
});

adminRouter.use("/bookings", bookingsRouter);

adminRouter.get("/enquiries", async (req, res) => {
  const { status } = z.object({ status: z.enum(["new", "in_progress", "closed"]).optional() }).parse(req.query);
  let query = db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(500);
  if (status) query = query.eq("status", status);
  res.json({ data: unwrap(await query) });
});

adminRouter.patch("/enquiries/:id", async (req, res) => {
  const { id } = z.object({ id: z.uuid() }).parse(req.params);
  const input = enquiryAdminSchema.parse(req.body);
  const row = unwrap(await db.from("enquiries").update(input).eq("id", id).select("*").single());
  await audit(req, "update", "enquiry", id, input);
  res.json({ data: row });
});

adminRouter.delete("/enquiries/:id", requireRole("admin"), async (req, res) => {
  const { id } = z.object({ id: z.uuid() }).parse(req.params);
  unwrap(await db.from("enquiries").delete().eq("id", id));
  await audit(req, "delete", "enquiry", id);
  res.status(204).end();
});

adminRouter.get("/activity", requireRole("admin"), async (_req, res) => {
  res.json({
    data: unwrap(await db.from("activity_log").select("*").order("created_at", { ascending: false }).limit(200)),
  });
});

adminRouter.use("/settings", settingsRouter);
adminRouter.use("/media", requireRole("admin"), mediaRouter);
adminRouter.use("/social", socialRouter);
adminRouter.use("/users", usersRouter);
adminRouter.use("/content", resourcesRouter);
