import type { BookingSettings } from "./settings";

export const TIMEZONE = "Asia/Kolkata";

export interface Slot {
  time: string;
  remaining: number;
  available: boolean;
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (minutes: number) => {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/** Current date (YYYY-MM-DD) and minutes-since-midnight in the restaurant's timezone. */
export function nowInRestaurant(at: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/**
 * Seating times for a service day. A last seating earlier than the first seating
 * (e.g. 12:00 → 00:30) runs past midnight; those slots still belong to the same booking date.
 */
export function seatingTimes(settings: BookingSettings): { time: string; offset: number }[] {
  const start = toMinutes(settings.firstSeating);
  let end = toMinutes(settings.lastSeating);
  if (end < start) end += 1440;
  const out: { time: string; offset: number }[] = [];
  for (let t = start; t <= end; t += settings.slotMinutes) out.push({ time: toHHMM(t), offset: t });
  return out;
}

export type DateCheck = { ok: true } | { ok: false; reason: string };

export function checkBookingDate(settings: BookingSettings, date: string, now = nowInRestaurant()): DateCheck {
  if (!settings.enabled) return { ok: false, reason: "Online booking is paused. Please call us." };
  const diff = daysBetween(now.date, date);
  if (Number.isNaN(diff)) return { ok: false, reason: "Invalid date." };
  if (diff < 0) return { ok: false, reason: "That date has passed." };
  if (diff > settings.maxDaysAhead)
    return { ok: false, reason: `We take bookings up to ${settings.maxDaysAhead} days ahead.` };
  if (settings.blackoutDates.includes(date))
    return { ok: false, reason: "We're not taking online bookings for this date. Please call us." };
  return { ok: true };
}

/**
 * @param booked guests already booked per slot time (cancelled / no-show excluded)
 */
export function availableSlots(
  settings: BookingSettings,
  date: string,
  booked: Record<string, number>,
  partySize = 1,
  now = nowInRestaurant(),
): Slot[] {
  const check = checkBookingDate(settings, date, now);
  if (!check.ok) return [];
  const isToday = date === now.date;
  return seatingTimes(settings).map(({ time, offset }) => {
    const remaining = Math.max(0, settings.capacityPerSlot - (booked[time] ?? 0));
    const tooSoon = isToday && offset < now.minutes + settings.minNoticeMinutes;
    return { time, remaining, available: !tooSoon && remaining >= partySize };
  });
}

export function formatTime12h(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Short, unambiguous booking reference like "DN-7K3QX". */
export function bookingReference(): string {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(5));
  for (const b of bytes) out += alphabet[b % alphabet.length];
  return `DN-${out}`;
}
