import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";
import type { BlogPost } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description: "Shopping guides, sale calendars and savings tips from our editorial team.",
};

const PAGE_SIZE = 9;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = await createClient();
  const { data, count } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact" })
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const posts = (data ?? []) as BlogPost[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink">Blog</h1>
      <p className="mt-1 text-sm text-ink-muted">Guides and tips to help you save more.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
    </div>
  );
}
