import type { BookingRequest, EnquiryRequest, Slot } from "@diner/shared";
import { API_URL } from "./env";

export class ApiError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string[]>,
  ) {
    super(message);
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/v1/public${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("We couldn't reach our booking system. Please try again or call us.");
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body.error ?? "Something went wrong.", body.fields);
  return body as T;
}

export const getAvailability = (date: string, partySize: number) =>
  call<{ date: string; slots: Slot[]; message: string | null }>(`/availability?date=${date}&partySize=${partySize}`);

export const createBooking = (input: BookingRequest) =>
  call<{ reference: string; status: string }>("/bookings", { method: "POST", body: JSON.stringify(input) });

export const createEnquiry = (input: EnquiryRequest) =>
  call<{ ok: true }>("/enquiries", { method: "POST", body: JSON.stringify(input) });
