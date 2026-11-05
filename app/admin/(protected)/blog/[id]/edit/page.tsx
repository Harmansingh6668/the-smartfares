import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateBlogPost } from "@/app/admin/actions";
import { BlogForm } from "@/app/admin/(protected)/blog/BlogForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Edit Blog Post</h1>
      <div className="mt-6">
        <BlogForm post={post} action={updateBlogPost.bind(null, id)} />
      </div>
    </div>
  );
}
