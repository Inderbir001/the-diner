"use client";

import { useEffect, useState } from "react";
import type { GeneralSettings } from "@diner/shared";
import { nowInRestaurant } from "@diner/shared";
import { to12h } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const mins = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

/** "Open now · until 12:30 AM" — computed in the browser so cached pages stay accurate. */
export function OpenStatus({ hours }: { hours: GeneralSettings["hours"] }) {
  const [label, setLabel] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    const compute = () => {
      const now = nowInRestaurant();
      const weekday = new Date(`${now.date}T12:00:00Z`).getUTCDay();
      const today = hours.find((h) => h.day === DAYS[weekday]);
      const yesterday = hours.find((h) => h.day === DAYS[(weekday + 6) % 7]);
      // still inside yesterday's late-night window?
      if (yesterday && !yesterday.closed && mins(yesterday.close) < mins(yesterday.open) && now.minutes < mins(yesterday.close)) {
        return { open: true, text: `Open now · until ${to12h(yesterday.close)}` };
      }
      if (!today || today.closed) return { open: false, text: "Closed today" };
      const o = mins(today.open);
      let c = mins(today.close);
      if (c <= o) c += 1440;
      if (now.minutes >= o && now.minutes < c) return { open: true, text: `Open now · until ${to12h(today.close)}` };
      if (now.minutes < o) return { open: false, text: `Opens today at ${to12h(today.open)}` };
      return { open: false, text: "Closed now" };
    };
    setLabel(compute());
    const id = setInterval(() => setLabel(compute()), 60_000);
    return () => clearInterval(id);
  }, [hours]);

  if (!label) return null;
  return (
    <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-sand">
      <span className="relative flex size-2">
        {label.open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-75" />}
        <span className={`relative inline-flex size-2 rounded-full ${label.open ? "bg-leaf" : "bg-ember"}`} />
      </span>
      {label.text}
    </span>
  );
}
