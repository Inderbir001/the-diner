import Link from "next/link";
import type { AnnouncementSettings } from "@diner/shared";

export function AnnouncementBar({ announcement }: { announcement: AnnouncementSettings }) {
  if (!announcement.enabled || !announcement.text) return null;
  return (
    <div className="relative z-[51] border-b border-white/10 bg-night/70 text-snow backdrop-blur">
      <p className="container-x flex items-center justify-center gap-3 py-2.5 text-center text-xs font-semibold sm:text-sm">
        <span className="inline-block size-1.5 shrink-0 rounded-full bg-brass" aria-hidden />
        <span>{announcement.text}</span>
        {announcement.linkUrl && announcement.linkLabel && (
          <Link href={announcement.linkUrl} className="shrink-0 font-bold text-brass-light underline-offset-4 hover:underline">
            {announcement.linkLabel} →
          </Link>
        )}
      </p>
    </div>
  );
}
