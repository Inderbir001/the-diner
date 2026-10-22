"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { CalendarPlus, Check, Loader2, Minus, Plus } from "lucide-react";
import { addDays, formatTime12h, nowInRestaurant, type BookingSettings, type Slot } from "@diner/shared";
import { ApiError, createBooking, getAvailability } from "@/lib/public-api";
import { cn, telHref } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function dayLabel(date: string, today: string) {
  if (date === today) return "Today";
  if (date === addDays(today, 1)) return "Tomorrow";
  return new Date(`${date}T12:00:00Z`).toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" });
}

function icsFile(ref: string, date: string, time: string, guests: number, venue: string, address: string) {
  const start = `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;
  const [h, m] = time.split(":").map(Number);
  const endH = (h + 2) % 24;
  const endDate = h + 2 >= 24 ? addDays(date, 1) : date;
  const end = `${endDate.replace(/-/g, "")}T${String(endH).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//The Diner//Booking//EN", "BEGIN:VEVENT",
    `UID:${ref}@thediner.in`, `DTSTART;TZID=Asia/Kolkata:${start}`, `DTEND;TZID=Asia/Kolkata:${end}`,
    `SUMMARY:Table for ${guests} at ${venue}`, `LOCATION:${address.replace(/,/g, "\\,")}`, `DESCRIPTION:Booking reference ${ref}`,
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}

export function BookingForm({
  settings,
  venue,
  address,
  phone,
}: {
  settings: BookingSettings;
  venue: string;
  address: string;
  phone?: string;
}) {
  const today = useMemo(() => nowInRestaurant().date, []);
  const quickDates = useMemo(() => Array.from({ length: Math.min(14, settings.maxDaysAhead + 1) }, (_, i) => addDays(today, i)), [today, settings.maxDaysAhead]);

  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[] | null>(null);
  const [slotMessage, setSlotMessage] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [done, setDone] = useState<{ reference: string; status: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    setTime(null);
    getAvailability(date, guests)
      .then((r) => {
        if (cancelled) return;
        setSlots(r.slots);
        setSlotMessage(r.message);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setSlots([]);
        setSlotMessage(e.message);
      })
      .finally(() => !cancelled && setLoadingSlots(false));
    return () => {
      cancelled = true;
    };
  }, [date, guests]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!time) {
      toast.error("Pick a time first.");
      return;
    }
    const form = new FormData(e.currentTarget);
    setSubmitting(true);
    setErrors({});
    try {
      const result = await createBooking({
        name: String(form.get("name") ?? ""),
        phone: String(form.get("phone") ?? ""),
        email: String(form.get("email") ?? ""),
        partySize: guests,
        date,
        time,
        area: String(form.get("area") ?? "") || undefined,
        occasion: String(form.get("occasion") ?? "") || undefined,
        notes: String(form.get("notes") ?? "") || undefined,
        company: String(form.get("company") ?? ""),
      });
      setDone(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!settings.enabled) {
    return (
      <div className="glass rounded-[28px] p-10 text-center">
        <p className="font-display text-3xl">Online booking is paused.</p>
        <p className="mt-3 text-sand">Call us and we'll sort you out.</p>
        {phone && (
          <a href={telHref(phone)} className="btn-primary mt-6">
            Call {phone}
          </a>
        )}
      </div>
    );
  }

  if (done) {
    const ics = icsFile(done.reference, date, time!, guests, venue, address);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} className="glass rounded-[28px] p-8 text-center sm:p-14">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-brass text-snow">
          <Check className="size-8" />
        </span>
        <h2 className="mt-6 font-display text-4xl">{done.status === "confirmed" ? "You're booked." : "Request received."}</h2>
        <p className="mx-auto mt-3 max-w-md text-sand">
          {done.status === "confirmed"
            ? "Your table is confirmed. See you soon!"
            : "We'll confirm your table shortly by phone or email."}
        </p>
        <dl className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 text-left text-sm">
          {[
            ["Reference", done.reference],
            ["Guests", String(guests)],
            ["Date", new Date(`${date}T12:00:00Z`).toLocaleDateString("en-IN", { dateStyle: "medium", timeZone: "UTC" })],
            ["Time", formatTime12h(time!)],
          ].map(([k, v]) => (
            <div key={k} className="glass p-4">
              <dt className="text-xs uppercase tracking-widest text-muted">{k}</dt>
              <dd className="mt-1 font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`} download={`the-diner-${done.reference}.ics`} className="btn-ghost">
            <CalendarPlus className="size-4" /> Add to calendar
          </a>
          <Link href="/menu" className="btn-primary">
            Browse the menu
          </Link>
        </div>
      </motion.div>
    );
  }

  const fieldError = (name: string) => errors[name]?.[0];

  return (
    <form onSubmit={onSubmit} className="glass rounded-[28px] p-5 sm:p-10" noValidate>
      {/* step 1 */}
      <fieldset>
        <legend className="mb-6 flex items-center gap-3 font-display text-2xl">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-brass font-sans text-sm font-bold text-snow">1</span>
          When are you coming?
        </legend>

        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          <div>
            <span className="label">Guests</span>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] p-1">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="inline-flex size-10 items-center justify-center rounded-full hover:bg-white/10" aria-label="Fewer guests">
                <Minus className="size-4" />
              </button>
              <output className="w-10 text-center font-display text-2xl" aria-live="polite">
                {guests}
              </output>
              <button
                type="button"
                onClick={() => setGuests((g) => Math.min(settings.maxPartySize, g + 1))}
                className="inline-flex size-10 items-center justify-center rounded-full hover:bg-white/10"
                aria-label="More guests"
              >
                <Plus className="size-4" />
              </button>
            </div>
            {guests >= settings.maxPartySize && (
              <p className="mt-2 max-w-[14rem] text-xs text-muted">
                Bigger group? <Link href="/private-parties" className="text-brass underline">Send a party enquiry</Link>.
              </p>
            )}
          </div>

          <div className="min-w-0">
            <span className="label">Date</span>
            <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
              {quickDates.map((d) => {
                const dd = new Date(`${d}T12:00:00Z`);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDate(d)}
                    className={cn(
                      "flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2.5 transition",
                      date === d ? "border-brass bg-brass text-snow" : "border-white/10 bg-white/[0.03] text-sand hover:border-white/25",
                    )}
                    aria-pressed={date === d}
                  >
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider">{dayLabel(d, today)}</span>
                    <span className="font-display text-2xl leading-tight">{dd.getUTCDate()}</span>
                    <span className="text-[0.65rem] uppercase">{dd.toLocaleDateString("en-IN", { month: "short", timeZone: "UTC" })}</span>
                  </button>
                );
              })}
              <label className="flex w-28 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 px-2 text-center text-xs text-sand">
                Another date
                <input
                  type="date"
                  className="mt-1 w-full bg-transparent text-center text-xs text-cream [color-scheme:light]"
                  min={today}
                  max={addDays(today, settings.maxDaysAhead)}
                  value={quickDates.includes(date) ? "" : date}
                  onChange={(e) => e.target.value && setDate(e.target.value)}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <span className="label">Time</span>
          <div className="min-h-[7rem]">
            {loadingSlots ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="h-11 animate-pulse rounded-xl bg-white/[0.05]" />
                ))}
              </div>
            ) : slots && slots.some((s) => s.available) ? (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {slots.map((s) => (
                  <button
                    type="button"
                    key={s.time}
                    disabled={!s.available}
                    onClick={() => setTime(s.time)}
                    className={cn(
                      "h-11 rounded-xl border text-sm font-semibold transition",
                      time === s.time
                        ? "border-brass bg-brass text-snow"
                        : s.available
                          ? "border-white/10 bg-white/[0.03] text-cream hover:border-brass/50"
                          : "cursor-not-allowed border-transparent text-muted/40 line-through",
                    )}
                    aria-pressed={time === s.time}
                  >
                    {formatTime12h(s.time)}
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-sand">
                {slotMessage ?? "No tables left online for this date."}{" "}
                {phone && (
                  <a href={telHref(phone)} className="text-brass underline">
                    Call {phone}
                  </a>
                )}
              </p>
            )}
          </div>
        </div>
      </fieldset>

      {/* step 2 */}
      <AnimatePresence initial={false}>
        {time && (
          <motion.fieldset
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mt-10 border-t border-white/10 pt-10">
              <h2 className="mb-6 flex items-center gap-3 font-display text-2xl">
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-brass font-sans text-sm font-bold text-snow">2</span>
                Your details
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="label">Name</label>
                  <input id="name" name="name" required autoComplete="name" className="field" aria-invalid={!!fieldError("name")} />
                  {fieldError("name") && <p className="mt-1 text-xs text-ember">{fieldError("name")}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="label">Phone</label>
                  <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+91" className="field" aria-invalid={!!fieldError("phone")} />
                  {fieldError("phone") && <p className="mt-1 text-xs text-ember">{fieldError("phone")}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="label">
                    Email <span className="normal-case tracking-normal text-muted">(for your confirmation)</span>
                  </label>
                  <input id="email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!fieldError("email")} />
                  {fieldError("email") && <p className="mt-1 text-xs text-ember">{fieldError("email")}</p>}
                </div>
                {settings.areas.length > 0 && (
                  <div>
                    <label htmlFor="area" className="label">Seating</label>
                    <select id="area" name="area" className="field" defaultValue="">
                      <option value="">No preference</option>
                      {settings.areas.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </div>
                )}
                {settings.occasions.length > 0 && (
                  <div>
                    <label htmlFor="occasion" className="label">Occasion</label>
                    <select id="occasion" name="occasion" className="field" defaultValue="">
                      <option value="">Just dinner</option>
                      {settings.occasions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="label">Anything we should know?</label>
                  <textarea id="notes" name="notes" rows={3} maxLength={500} className="field resize-none" placeholder="Allergies, high chair, birthday cake…" />
                </div>
                {/* honeypot */}
                <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              </div>
              {settings.policyNote && <p className="mt-6 text-xs leading-relaxed text-muted">{settings.policyNote}</p>}
              <button type="submit" disabled={submitting} className="btn-primary mt-8 w-full !py-4 text-base sm:w-auto sm:!px-10">
                {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
                Book for {guests} · {formatTime12h(time)}
              </button>
            </div>
          </motion.fieldset>
        )}
      </AnimatePresence>
    </form>
  );
}
