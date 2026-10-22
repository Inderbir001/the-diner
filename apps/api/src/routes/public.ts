import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import {
  bookingReference,
  bookingRequestSchema,
  checkBookingDate,
  enquiryRequestSchema,
  type Booking,
  type Enquiry,
} from "@diner/shared";
import { db } from "../lib/supabase";
import { HttpError, unwrap } from "../lib/http";
import { getSetting } from "../lib/settings";
import { slotsFor } from "../services/bookings";
import { notifyNewBooking, notifyNewEnquiry } from "../lib/mailer";

export const publicRouter = Router();

const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again in a few minutes or call us." },
});

const readLimiter = rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: "draft-8", legacyHeaders: false });

publicRouter.get("/availability", readLimiter, async (req, res) => {
  const { date, partySize } = z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      partySize: z.coerce.number().int().min(1).max(500).default(2),
    })
    .parse(req.query);
  const settings = await getSetting("booking");
  const check = checkBookingDate(settings, date);
  const slots = check.ok ? await slotsFor(settings, date, partySize) : [];
  res.set("Cache-Control", "no-store");
  res.json({ date, slots, message: check.ok ? null : check.reason });
});

publicRouter.post("/bookings", submitLimiter, async (req, res) => {
  const input = bookingRequestSchema.parse(req.body);
  if (input.company) {
    // honeypot filled — pretend success for bots
    res.status(201).json({ reference: "DN-OK", status: "pending" });
    return;
  }
  const settings = await getSetting("booking");
  if (input.partySize > settings.maxPartySize) {
    throw new HttpError(
      400,
      `For groups larger than ${settings.maxPartySize}, please send a party enquiry and we'll arrange it.`,
    );
  }
  const check = checkBookingDate(settings, input.date);
  if (!check.ok) throw new HttpError(400, check.reason);

  const slot = (await slotsFor(settings, input.date, input.partySize)).find((s) => s.time === input.time);
  if (!slot) throw new HttpError(400, "Please pick one of the available times.");
  if (!slot.available) throw new HttpError(409, "That time just filled up. Please pick another slot.");

  const row = {
    reference: bookingReference(),
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    party_size: input.partySize,
    booking_date: input.date,
    booking_time: input.time,
    area: input.area,
    occasion: input.occasion,
    notes: input.notes,
    status: settings.autoConfirm ? "confirmed" : "pending",
    source: "website",
  };
  const booking = unwrap(await db.from("bookings").insert(row).select("*").single()) as Booking;
  void notifyNewBooking(booking);
  res.status(201).json({ reference: booking.reference, status: booking.status });
});

publicRouter.post("/enquiries", submitLimiter, async (req, res) => {
  const input = enquiryRequestSchema.parse(req.body);
  if (input.company) {
    res.status(201).json({ ok: true });
    return;
  }
  if (!input.phone && !input.email) throw new HttpError(400, "Please leave a phone number or email so we can reply.");
  const enquiry = unwrap(
    await db
      .from("enquiries")
      .insert({
        type: input.type,
        name: input.name,
        phone: input.phone || null,
        email: input.email || null,
        event_date: input.eventDate || null,
        guests: input.guests ?? null,
        message: input.message,
      })
      .select("*")
      .single(),
  ) as Enquiry;
  void notifyNewEnquiry(enquiry);
  res.status(201).json({ ok: true });
});
