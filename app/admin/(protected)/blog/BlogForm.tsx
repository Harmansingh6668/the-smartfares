"use client";

import { useState } from "react";
import type { BlogPost } from "@/lib/types";
import { TipTapEditor } from "@/components/admin/TipTapEditor";

export function BlogForm({
  post,
  action,
}: {
  post?: BlogPost;
  action: (formData: FormData) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={(formData) => {
        setSubmitting(true);
        action(formData);
      }}
      className="max-w-3xl space-y-5"
    >
      <Field label="Title">
        <input name="title" defaultValue={post?.title} required maxLength={200} className={inputClass} />
      </Field>
      <Field label="Slug (leave blank to auto-generate)">
        <input name="slug" defaultValue={post?.slug} maxLength={220} className={inputClass} />
      </Field>
      <Field label="Excerpt">
        <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={2} maxLength={500} className={inputClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Author">
          <input name="author" defaultValue={post?.author ?? "Editorial Team"} className={inputClass} />
        </Field>
        <Field label="Category">
          <input name="category" defaultValue={post?.category ?? ""} className={inputClass} />
        </Field>
        <Field label="Tags (comma separated)">
          <input name="tags" defaultValue={post?.tags?.join(", ") ?? ""} className={inputClass} />
        </Field>
      </div>

      <Field label="Cover Image URL">
        <input name="cover_image_url" type="url" defaultValue={post?.cover_image_url ?? ""} className={inputClass} />
      </Field>

      <label className="block text-sm font-medium text-ink">
        Content
        <div className="mt-1">
          <TipTapEditor name="content" defaultValue={post?.content ?? ""} />
        </div>
      </label>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" name="is_published" defaultChecked={post?.is_published} className="h-4 w-4 rounded border-slate-300 text-primary" />
        Published
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {submitting ? "Saving..." : post ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      {children}
    </label>
  );
}
