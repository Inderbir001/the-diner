"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/** Google Maps loads only when asked — the iframe alone costs ~1MB and several third-party requests. */
export function MapEmbed({ src, title, directionsUrl }: { src: string; title: string; directionsUrl?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 bg-smoke sm:aspect-[16/10]">
      {show ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 size-full grayscale-[0.4] invert-[0.9] hue-rotate-180"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[radial-gradient(circle_at_50%_45%,rgb(216_164_70/0.18),transparent_60%)] p-6 text-center">
          {/* stylised street grid as a placeholder */}
          <svg className="absolute inset-0 size-full opacity-[0.12]" aria-hidden>
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
                <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <span className="relative inline-flex size-14 items-center justify-center rounded-full bg-brass text-ink shadow-[0_0_0_10px_rgb(216_164_70/0.15)]">
            <MapPin className="size-6" />
          </span>
          <div className="relative flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setShow(true)} className="btn-ghost">
              Show map
            </button>
            {directionsUrl && (
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Get directions
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
