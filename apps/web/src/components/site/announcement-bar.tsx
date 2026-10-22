import Link from "next/link";
import type { AnnouncementSettings } from "@diner/shared";

export function AnnouncementBar({ announcement }: { announcement: AnnouncementSettings }) {
  if (!announcement.enabled || !announcement.text) return null;
  return (
    <div className="relative z-[51] bg-brass text-ink">
      <p className="container-x flex items-center justify-center gap-3 py-2 text-center text-xs font-semibold sm:text-sm">
        <span>{announcement.text}</span>
        {announcement.linkUrl && announcement.linkLabel && (
          <Link href={announcement.linkUrl} className="shrink-0 underline decoration-ink/40 underline-offset-4 hover:decoration-ink">
            {announcement.linkLabel} →
          </Link>
        )}
      </p>
    </div>
  );
}
