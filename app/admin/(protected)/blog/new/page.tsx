import { createBlogPost } from "@/app/admin/actions";
import { BlogForm } from "@/app/admin/(protected)/blog/BlogForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">New Blog Post</h1>
      <div className="mt-6">
        <BlogForm action={createBlogPost} />
      </div>
    </div>
  );
}
