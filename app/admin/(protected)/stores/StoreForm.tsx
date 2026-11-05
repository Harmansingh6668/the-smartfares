"use client";

import { useState } from "react";
import type { Store } from "@/lib/types";

type Category = { id: string; name: string };

export function StoreForm({
  store,
  categories,
  action,
}: {
  store?: Store;
  categories: Category[];
  action: (formData: FormData) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  const faqText = (store?.faq ?? [])
    .map((f) => `${f.question} | ${f.answer}`)
    .join("\n");

  return (
    <form
      action={(formData) => {
        setSubmitting(true);
        action(formData);
      }}
      className="max-w-2xl space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input name="name" defaultValue={store?.name} required maxLength={120} className={inputClass} />
        </Field>
        <Field label="Slug (leave blank to auto-generate from name)">
          <input name="slug" defaultValue={store?.slug} maxLength={160} className={inputClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Logo URL">
          <input name="logo_url" type="url" defaultValue={store?.logo_url ?? ""} className={inputClass} />
        </Field>
        <Field label="Website URL">
          <input
            name="website_url"
            type="url"
            defaultValue={store?.website_url ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Primary Category (used for breadcrumb + similar stores)">
        <select name="primary_category_id" defaultValue={store?.primary_category_id ?? ""} className={inputClass}>
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Short Description (used in store directory listings)">
        <textarea
          name="description"
          defaultValue={store?.description ?? ""}
          rows={2}
          className={inputClass}
        />
      </Field>

      <Field label="About / How to Save (one paragraph per blank line)">
        <textarea
          name="about_content"
          defaultValue={(store?.about_content ?? []).join("\n\n")}
          rows={5}
          className={inputClass}
        />
      </Field>

      <Field label="Saving Tips (one per line)">
        <textarea
          name="saving_tips"
          defaultValue={(store?.saving_tips ?? []).join("\n")}
          rows={4}
          className={inputClass}
        />
      </Field>

      <Field label="Customer Support Tips (one per line)">
        <textarea
          name="support_tips"
          defaultValue={(store?.support_tips ?? []).join("\n")}
          rows={3}
          className={inputClass}
        />
      </Field>

      <Field label="Refund Policy">
        <textarea
          name="refund_policy"
          defaultValue={store?.refund_policy ?? ""}
          rows={2}
          className={inputClass}
        />
      </Field>

      <Field label="FAQ (one per line, format: Question? | Answer text)">
        <textarea name="faq" defaultValue={faqText} rows={5} className={inputClass} />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="is_featured" defaultChecked={store?.is_featured} className="h-4 w-4 rounded border-slate-300 text-primary" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="is_popular" defaultChecked={store?.is_popular} className="h-4 w-4 rounded border-slate-300 text-primary" />
          Popular
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {submitting ? "Saving..." : store ? "Update Store" : "Create Store"}
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
