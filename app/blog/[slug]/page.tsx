import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

export const revalidate = 3600;

async function getPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data as BlogPost | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
      publishedTime: post.published_at ?? undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url ?? undefined,
    datePublished: post.published_at,
    author: { "@type": "Organization", name: post.author },
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {post.category && (
        <span className="rounded-full bg-primary-light px-2.5 py-0.5 text-xs font-bold text-primary-dark">
          {post.category.toUpperCase()}
        </span>
      )}
      <h1 className="mt-3 text-3xl font-extrabold text-ink">{post.title}</h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-ink-muted">
        <span>{post.author}</span>
        <span>·</span>
        <span>{formatDate(post.published_at)}</span>
      </div>

      {post.cover_image_url && (
        <div className="relative mt-6 h-72 w-full overflow-hidden rounded-xl sm:h-96">
          <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
        </div>
      )}

      {post.content && (
        <div
          className="prose prose-slate mt-8 max-w-none prose-headings:font-bold prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface px-3 py-1 text-xs text-ink-muted">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
