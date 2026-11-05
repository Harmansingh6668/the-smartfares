"use client";

import { useState } from "react";
import type { Coupon } from "@/lib/types";

type Option = { id: string; name: string };

export function CouponForm({
  coupon,
  stores,
  categories,
  action,
}: {
  coupon?: Coupon;
  stores: Option[];
  categories: Option[];
  action: (formData: FormData) => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action={(formData) => {
        setSubmitting(true);
        action(formData);
      }}
      className="max-w-2xl space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Store">
          <select name="store_id" defaultValue={coupon?.store_id} required className={inputClass}>
            <option value="">Select a store</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select name="category_id" defaultValue={coupon?.category_id ?? ""} className={inputClass}>
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Title">
        <input name="title" defaultValue={coupon?.title} required maxLength={200} className={inputClass} />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          defaultValue={coupon?.description ?? ""}
          rows={3}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Type">
          <select name="coupon_type" defaultValue={coupon?.coupon_type ?? "code"} className={inputClass}>
            <option value="code">Code</option>
            <option value="deal">Deal</option>
            <option value="offer">Offer</option>
          </select>
        </Field>
        <Field label="Code">
          <input name="code" defaultValue={coupon?.code ?? ""} maxLength={100} className={inputClass} />
        </Field>
        <Field label="Discount Value">
          <input
            name="discount_value"
            defaultValue={coupon?.discount_value ?? ""}
            placeholder="50%OFF"
            maxLength={50}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Affiliate URL">
        <input
          name="affiliate_url"
          type="url"
          defaultValue={coupon?.affiliate_url}
          required
          className={inputClass}
        />
      </Field>

      <Field label="Expires At">
        <input
          name="expires_at"
          type="datetime-local"
          defaultValue={coupon?.expires_at ? coupon.expires_at.slice(0, 16) : ""}
          className={inputClass}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Checkbox name="is_active" label="Active" defaultChecked={coupon?.is_active ?? true} />
        <Checkbox name="is_verified" label="Verified" defaultChecked={coupon?.is_verified} />
        <Checkbox name="is_exclusive" label="Exclusive" defaultChecked={coupon?.is_exclusive} />
        <Checkbox name="is_featured" label="Featured" defaultChecked={coupon?.is_featured} />
        <Checkbox name="is_trending" label="Trending" defaultChecked={coupon?.is_trending} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-xl bg-primary px-6 py-2.5 font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {submitting ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
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

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-slate-300 text-primary" />
      {label}
    </label>
  );
}
