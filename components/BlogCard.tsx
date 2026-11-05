import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative h-44 w-full overflow-hidden bg-surface">
        {post.cover_image_url && (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover transition group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {post.category && (
          <span className="mb-2 w-fit rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary-dark">
            {post.category.toUpperCase()}
          </span>
        )}
        <h3 className="line-clamp-2 font-bold text-ink group-hover:text-brand">{post.title}</h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{post.excerpt}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-ink-muted">
          <span>{formatDate(post.published_at)}</span>
          <span>{post.author}</span>
        </div>
      </div>
    </Link>
  );
}
