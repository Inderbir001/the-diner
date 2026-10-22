import Image from "next/image";
import { Play } from "lucide-react";
import type { SocialPost, SocialSettings } from "@diner/shared";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";
import { SocialIcon } from "./social-icon";
import { YouTubeLite } from "./youtube-lite";

/** Latest Instagram posts — synced automatically by the API every 30 minutes. */
/** Until Instagram is connected, our own photos fill the grid and link to the profile. */
export function InstagramFeed({
  posts,
  social,
  limit = 8,
  fallbackImages = [],
}: {
  posts: SocialPost[];
  social: SocialSettings;
  limit?: number;
  fallbackImages?: { url: string; alt: string }[];
}) {
  if (!posts.length && !social.instagram) return null;
  const handle = social.instagramHandle ? `@${social.instagramHandle}` : "Instagram";
  return (
    <section className="py-24 sm:py-32" aria-label="Instagram">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow={handle} title="Fresh off the 'gram." />
          {social.instagram && (
            <Reveal>
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost shrink-0">
                <SocialIcon name="instagram" className="size-4" /> Follow us
              </a>
            </Reveal>
          )}
        </div>

        {posts.length > 0 ? (
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {posts.slice(0, limit).map((post, i) => (
              <Reveal as="li" key={post.id} delay={(i % 4) * 0.06}>
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-2xl bg-smoke"
                  aria-label={post.caption?.slice(0, 100) || "Instagram post"}
                >
                  {post.thumbnail_url && (
                    <Image
                      src={post.thumbnail_url}
                      alt={post.caption?.slice(0, 120) || "Instagram post from The Diner"}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                      className="object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-60"
                    />
                  )}
                  {post.media_type === "video" && (
                    <span className="glass absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-full">
                      <Play className="size-3.5 fill-current" />
                    </span>
                  )}
                  {post.caption && (
                    <p className="absolute inset-x-0 bottom-0 line-clamp-3 translate-y-4 p-4 text-xs text-cream opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {post.caption}
                    </p>
                  )}
                </a>
              </Reveal>
            ))}
          </ul>
        ) : (
          <ul className="mt-14 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {fallbackImages.slice(0, limit).map((img, i) => (
              <Reveal as="li" key={img.url} delay={(i % 4) * 0.06}>
                <a
                  href={social.instagram || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-2xl bg-smoke"
                  aria-label={`${img.alt} — follow ${handle} on Instagram`}
                >
                  <Image src={img.url} alt={img.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-center justify-center bg-brass/80 opacity-0 transition group-hover:opacity-100">
                    <SocialIcon name="instagram" className="size-8 text-snow" />
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function YouTubeFeed({ videos, social, limit = 3 }: { videos: SocialPost[]; social: SocialSettings; limit?: number }) {
  if (!videos.length) return null;
  const [featured, ...rest] = videos.slice(0, limit);
  return (
    <section className="py-24 sm:py-32" aria-label="Videos">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading eyebrow="On YouTube" title="Watch the nights unfold." />
          {social.youtube && (
            <Reveal>
              <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="btn-ghost shrink-0">
                <SocialIcon name="youtube" className="size-4" /> Subscribe
              </a>
            </Reveal>
          )}
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <YouTubeLite id={featured.external_id} title={featured.caption?.split("\n")[0] ?? "Video"} thumbnail={featured.thumbnail_url} />
          </Reveal>
          <div className="grid gap-5">
            {rest.map((v, i) => (
              <Reveal key={v.id} delay={0.1 + i * 0.08}>
                <YouTubeLite id={v.external_id} title={v.caption?.split("\n")[0] ?? "Video"} thumbnail={v.thumbnail_url} small />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
