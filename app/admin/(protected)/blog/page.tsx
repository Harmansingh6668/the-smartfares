import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteBlogPost } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + New Post
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-surface text-left text-ink-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((p) => (
              <tr key={p.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 text-ink">{p.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      p.is_published
                        ? "rounded-full bg-secondary-light px-2 py-0.5 text-xs font-medium text-secondary-dark"
                        : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-muted"
                    }
                  >
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(p.published_at)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/blog/${p.id}/edit`} className="text-primary hover:underline">
                      Edit
                    </Link>
                    <DeleteButton action={deleteBlogPost.bind(null, p.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
