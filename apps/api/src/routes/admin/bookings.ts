import { Router } from "express";
import { z } from "zod";
import { BOOKING_STATUSES, bookingAdminSchema, bookingReference, type Booking } from "@diner/shared";
import { db } from "../../lib/supabase";
import { onlyProvided, unwrap } from "../../lib/http";
import { audit } from "../../lib/audit";
import { notifyBookingStatus } from "../../lib/mailer";
import { requireRole } from "../../middleware/auth";

export const bookingsRouter = Router();

const listQuery = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.enum(BOOKING_STATUSES).optional(),
  q: z.string().trim().max(80).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

bookingsRouter.get("/", async (req, res) => {
  const { from, to, status, q, page, pageSize } = listQuery.parse(req.query);
  let query = db.from("bookings").select("*", { count: "exact" });
  if (from) query = query.gte("booking_date", from);
  if (to) query = query.lte("booking_date", to);
  if (status) query = query.eq("status", status);
  if (q) {
    const term = q.replace(/[%,()]/g, " ");
    query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%,reference.ilike.%${term}%,email.ilike.%${term}%`);
  }
  const start = (page - 1) * pageSize;
  const { data, count, error } = await query
    .order("booking_date", { ascending: true })
    .order("booking_time", { ascending: true })
    .range(start, start + pageSize - 1);
  if (error) throw error;
  res.json({ data, count });
});

bookingsRouter.post("/", async (req, res) => {
  const input = bookingAdminSchema.parse(req.body);
  const row = unwrap(
    await db
      .from("bookings")
      .insert({ ...input, reference: bookingReference() })
      .select("*")
      .single(),
  ) as Booking;
  await audit(req, "create", "booking", row.id, { reference: row.reference });
  res.status(201).json({ data: row });
});

bookingsRouter.patch("/:id", async (req, res) => {
  const { id } = z.object({ id: z.uuid() }).parse(req.params);
  const input = onlyProvided(bookingAdminSchema.partial().parse(req.body), req.body);
  const before = unwrap(await db.from("bookings").select("status").eq("id", id).single()) as { status: string };
  const row = unwrap(await db.from("bookings").update(input).eq("id", id).select("*").single()) as Booking;
  if (input.status && input.status !== before.status) void notifyBookingStatus(row);
  await audit(req, "update", "booking", id, { fields: Object.keys(input), status: input.status });
  res.json({ data: row });
});

bookingsRouter.delete("/:id", requireRole("admin"), async (req, res) => {
  const { id } = z.object({ id: z.uuid() }).parse(req.params);
  unwrap(await db.from("bookings").delete().eq("id", id));
  await audit(req, "delete", "booking", id);
  res.status(204).end();
});

/** CSV export for the selected date range. */
bookingsRouter.get("/export.csv", async (req, res) => {
  const { from, to, status } = listQuery.parse(req.query);
  let query = db.from("bookings").select("*");
  if (from) query = query.gte("booking_date", from);
  if (to) query = query.lte("booking_date", to);
  if (status) query = query.eq("status", status);
  const rows = (unwrap(await query.order("booking_date").order("booking_time").limit(10000)) ?? []) as Booking[];
  const cols: (keyof Booking)[] = [
    "reference", "booking_date", "booking_time", "name", "phone", "email",
    "party_size", "area", "occasion", "status", "notes", "admin_notes", "source", "created_at",
  ];
  const cell = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    // neutralise spreadsheet formula injection
    const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
    return `"${safe.replace(/"/g, '""')}"`;
  };
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="bookings-${from ?? "all"}.csv"`);
  res.send(csv);
});
