"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";
import { ApiError, createEnquiry } from "@/lib/public-api";
import { cn } from "@/lib/utils";

type EnquiryType = "general" | "party" | "corporate" | "feedback";

export function EnquiryForm({ defaultType = "general", showEventFields = false }: { defaultType?: EnquiryType; showEventFields?: boolean }) {
  const [type, setType] = useState<EnquiryType>(defaultType);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const eventFields = showEventFields || type === "party" || type === "corporate";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSubmitting(true);
    setErrors({});
    try {
      await createEnquiry({
        type,
        name: String(f.get("name") ?? ""),
        phone: String(f.get("phone") ?? ""),
        email: String(f.get("email") ?? ""),
        eventDate: String(f.get("eventDate") ?? ""),
        guests: f.get("guests") ? Number(f.get("guests")) : undefined,
        message: String(f.get("message") ?? ""),
        company: String(f.get("company") ?? ""),
      });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.fields) setErrors(err.fields);
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="glass rounded-[28px] p-10 text-center">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-brass text-snow">
          <Check className="size-7" />
        </span>
        <p className="mt-5 font-display text-3xl">Thanks — we've got it.</p>
        <p className="mt-2 text-sand">Someone from our team will get back to you within a day.</p>
      </div>
    );
  }

  const err = (k: string) => errors[k]?.[0];
  const types: { value: EnquiryType; label: string }[] = [
    { value: "party", label: "Private party" },
    { value: "corporate", label: "Corporate event" },
    { value: "general", label: "General" },
    { value: "feedback", label: "Feedback" },
  ];

  return (
    <form onSubmit={onSubmit} className="glass rounded-[28px] p-6 sm:p-10" noValidate>
      <div className="mb-8 flex flex-wrap gap-2" role="radiogroup" aria-label="Enquiry type">
        {types.map((t) => (
          <button
            key={t.value}
            type="button"
            role="radio"
            aria-checked={type === t.value}
            onClick={() => setType(t.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              type === t.value ? "border-brass bg-brass text-snow" : "border-white/10 text-sand hover:text-cream",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="eq-name" className="label">Name</label>
          <input id="eq-name" name="name" required autoComplete="name" className="field" />
          {err("name") && <p className="mt-1 text-xs text-ember">{err("name")}</p>}
        </div>
        <div>
          <label htmlFor="eq-phone" className="label">Phone</label>
          <input id="eq-phone" name="phone" type="tel" autoComplete="tel" className="field" />
          {err("phone") && <p className="mt-1 text-xs text-ember">{err("phone")}</p>}
        </div>
        <div>
          <label htmlFor="eq-email" className="label">Email</label>
          <input id="eq-email" name="email" type="email" autoComplete="email" className="field" />
          {err("email") && <p className="mt-1 text-xs text-ember">{err("email")}</p>}
        </div>
        {eventFields && (
          <>
            <div>
              <label htmlFor="eq-date" className="label">Event date</label>
              <input id="eq-date" name="eventDate" type="date" className="field [color-scheme:light]" />
            </div>
            <div>
              <label htmlFor="eq-guests" className="label">Guests</label>
              <input id="eq-guests" name="guests" type="number" min={1} max={1000} inputMode="numeric" className="field" />
            </div>
          </>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="eq-message" className="label">Message</label>
          <textarea
            id="eq-message"
            name="message"
            rows={4}
            required
            maxLength={2000}
            className="field resize-none"
            placeholder={eventFields ? "Tell us about the occasion, budget, and food or bar preferences." : "How can we help?"}
          />
          {err("message") && <p className="mt-1 text-xs text-ember">{err("message")}</p>}
        </div>
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      </div>
      <button type="submit" disabled={submitting} className="btn-primary mt-8 !px-10 !py-4">
        {submitting && <Loader2 className="size-4 animate-spin" />}
        Send enquiry
      </button>
    </form>
  );
}
