import Image from "next/image";
import Link from "next/link";
import type { Post } from "@diner/shared";
import { cn, formatDate, readingTime } from "@/lib/utils";

export function PostCard({ post, large, priority }: { post: Post; large?: boolean; priority?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className={cn("group block", large && "md:grid md:grid-cols-2 md:items-center md:gap-12")}>
      <div className={cn("relative overflow-hidden rounded-[24px] bg-smoke", large ? "aspect-[4/3]" : "aspect-[16/11]")}>
        {post.cover_image && (
          <Image
            src={post.cover_image}
            alt={post.cover_alt ?? post.title}
            fill
            priority={priority}
            sizes={large ? "(min-width:768px) 50vw, 100vw" : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
          />
        )}
      </div>
      <div className={cn("pt-6", large && "md:pt-0")}>
        <p className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted">
          {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
          <span aria-hidden>·</span>
          <span>{readingTime(post.content)} min read</span>
        </p>
        <h3 className={cn("mt-3 font-display leading-tight transition-colors group-hover:text-brass", large ? "text-4xl sm:text-5xl" : "text-2xl")}>
          {post.title}
        </h3>
        {post.excerpt && <p className={cn("mt-3 text-sand", large ? "text-lg" : "line-clamp-2 text-sm")}>{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t) => (
              <li key={t} className="rounded-full border border-white/10 px-3 py-1 text-xs text-sand">
                #{t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
