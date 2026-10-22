"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

/** Click-to-load YouTube player: a thumbnail until clicked, so no YouTube JS on page load. */
export function YouTubeLite({ id, title, thumbnail, small }: { id: string; title: string; thumbnail?: string | null; small?: boolean }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-[24px] border border-black/10 bg-smoke">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 text-left" aria-label={`Play: ${title}`}>
          <Image
            src={thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes={small ? "(min-width:1024px) 30vw, 100vw" : "(min-width:1024px) 60vw, 100vw"}
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
          <span
            className={cn(
              "absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brass text-snow transition-transform duration-500 group-hover:scale-110",
              small ? "size-12" : "size-20",
            )}
          >
            <Play className={cn("translate-x-0.5 fill-current", small ? "size-4" : "size-7")} />
          </span>
          <span className={cn("absolute inset-x-0 bottom-0 line-clamp-2 p-5 font-display", small ? "text-lg" : "text-2xl")}>{title}</span>
        </button>
      )}
    </div>
  );
}
