import { availableSlots, type BookingSettings } from "@diner/shared";
import { db } from "../lib/supabase";
import { unwrap } from "../lib/http";

/** Guests already booked per seating time on a date (cancelled / no-shows don't count). */
export async function bookedGuestsByTime(date: string, excludeId?: string): Promise<Record<string, number>> {
  let query = db
    .from("bookings")
    .select("id, booking_time, party_size")
    .eq("booking_date", date)
    .not("status", "in", "(cancelled,no_show)");
  if (excludeId) query = query.neq("id", excludeId);
  const rows = unwrap(await query) ?? [];
  const out: Record<string, number> = {};
  for (const r of rows) out[r.booking_time] = (out[r.booking_time] ?? 0) + r.party_size;
  return out;
}

export async function slotsFor(settings: BookingSettings, date: string, partySize: number) {
  const booked = await bookedGuestsByTime(date);
  return availableSlots(settings, date, booked, partySize);
}
