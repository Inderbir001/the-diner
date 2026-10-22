import { Resend } from "resend";
import { formatTime12h, type Booking, type Enquiry } from "@diner/shared";
import { env } from "../env";
import { logger } from "./logger";
import { getSetting } from "./settings";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const escape = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function send(to: string[], subject: string, html: string, replyTo?: string) {
  const recipients = to.filter(Boolean);
  if (!recipients.length) return;
  if (!resend) {
    logger.info({ to: recipients, subject }, "email skipped (RESEND_API_KEY not set)");
    return;
  }
  const { error } = await resend.emails.send({ from: env.EMAIL_FROM, to: recipients, subject, html, replyTo });
  if (error) logger.error({ error, subject }, "email send failed");
}

function layout(title: string, rows: [string, string | number | null | undefined][], footer = "") {
  const body = rows
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#8a8170">${escape(k)}</td><td style="padding:6px 0;color:#1d1a16"><strong>${escape(String(v))}</strong></td></tr>`,
    )
    .join("");
  return `<div style="font-family:Georgia,serif;max-width:520px;margin:auto;padding:32px;background:#faf6ee;border-radius:16px">
<h1 style="font-size:24px;margin:0 0 20px;color:#1d1a16">${escape(title)}</h1>
<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${body}</table>
${footer ? `<p style="font-family:Arial,sans-serif;font-size:13px;color:#5c5446;margin-top:24px">${footer}</p>` : ""}
</div>`;
}

const prettyDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export async function notifyNewBooking(booking: Booking) {
  try {
    const [notifications, general] = await Promise.all([getSetting("notifications"), getSetting("general")]);
    const rows: [string, string | number | null][] = [
      ["Reference", booking.reference],
      ["Name", booking.name],
      ["Phone", booking.phone],
      ["Email", booking.email],
      ["Date", prettyDate(booking.booking_date)],
      ["Time", formatTime12h(booking.booking_time)],
      ["Guests", booking.party_size],
      ["Seating", booking.area],
      ["Occasion", booking.occasion],
      ["Notes", booking.notes],
      ["Status", booking.status],
    ];
    await send(
      notifications.bookingEmails,
      `New booking ${booking.reference}: ${booking.name}, ${booking.party_size} guests, ${prettyDate(booking.booking_date)} ${formatTime12h(booking.booking_time)}`,
      layout("New table booking", rows, `Manage it at ${escape(env.WEB_URL)}/admin/bookings`),
      booking.email ?? undefined,
    );
    if (notifications.sendGuestConfirmation && booking.email) {
      const confirmed = booking.status === "confirmed";
      await send(
        [booking.email],
        confirmed ? `Your table at ${general.name} is confirmed` : `We've received your booking at ${general.name}`,
        layout(
          confirmed ? "See you soon!" : "Booking request received",
          rows.filter(([k]) => !["Phone", "Email", "Status"].includes(k)),
          confirmed
            ? `Need to change something? Call us on ${escape(general.phones[0] ?? "")}.`
            : `We'll confirm your table shortly. Questions? Call ${escape(general.phones[0] ?? "")}.`,
        ),
        general.email || undefined,
      );
    }
  } catch (err) {
    logger.error({ err }, "booking notification failed");
  }
}

export async function notifyBookingStatus(booking: Booking) {
  if (!booking.email || !["confirmed", "cancelled"].includes(booking.status)) return;
  try {
    const [notifications, general] = await Promise.all([getSetting("notifications"), getSetting("general")]);
    if (!notifications.sendGuestConfirmation) return;
    const confirmed = booking.status === "confirmed";
    await send(
      [booking.email],
      confirmed ? `Your table at ${general.name} is confirmed` : `Your booking at ${general.name} was cancelled`,
      layout(
        confirmed ? "Your table is confirmed" : "Booking cancelled",
        [
          ["Reference", booking.reference],
          ["Date", prettyDate(booking.booking_date)],
          ["Time", formatTime12h(booking.booking_time)],
          ["Guests", booking.party_size],
        ],
        `Questions? Call ${escape(general.phones[0] ?? "")}.`,
      ),
      general.email || undefined,
    );
  } catch (err) {
    logger.error({ err }, "status email failed");
  }
}

export async function notifyNewEnquiry(enquiry: Enquiry) {
  try {
    const notifications = await getSetting("notifications");
    await send(
      notifications.enquiryEmails,
      `New ${enquiry.type} enquiry from ${enquiry.name}`,
      layout("New enquiry", [
        ["Type", enquiry.type],
        ["Name", enquiry.name],
        ["Phone", enquiry.phone],
        ["Email", enquiry.email],
        ["Event date", enquiry.event_date],
        ["Guests", enquiry.guests],
        ["Message", enquiry.message],
      ]),
      enquiry.email ?? undefined,
    );
  } catch (err) {
    logger.error({ err }, "enquiry notification failed");
  }
}
