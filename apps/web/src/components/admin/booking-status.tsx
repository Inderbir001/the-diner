import type { BookingStatus } from "@diner/shared";
import { StatusPill } from "./drawer";

const TONE: Record<BookingStatus, "green" | "amber" | "red" | "grey" | "blue"> = {
  pending: "amber",
  confirmed: "green",
  seated: "blue",
  completed: "grey",
  cancelled: "red",
  no_show: "red",
};

export function BookingStatusPill({ status }: { status: BookingStatus }) {
  return <StatusPill tone={TONE[status]}>{status.replace("_", "-")}</StatusPill>;
}
