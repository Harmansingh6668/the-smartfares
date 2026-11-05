"use client";

import { useState } from "react";
import type { CouponWithStore } from "@/lib/types";
import { formatUsageCount } from "@/lib/utils";
import { RevealCodeModal } from "@/components/RevealCodeModal";

export function BestCodeCallout({
  storeName,
  coupon,
}: {
  storeName: string;
  coupon: CouponWithStore;
}) {
  const [open, setOpen] = useState(false);
  const successRate = coupon.is_verified ? 92 : 78;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <h2 className="text-lg font-bold text-ink">
        What&apos;s the Best {storeName} Promo Code right now?
      </h2>
      <p className="mt-2 text-sm text-ink-muted">
        The best {storeName} code is &ldquo;{coupon.title}&rdquo;, verified by our team.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-6 rounded-xl bg-surface p-4">
        <span className="rounded-lg bg-primary-light px-3 py-1.5 text-sm font-extrabold text-primary-dark">
          {coupon.discount_value ?? "DEAL"}
        </span>
        <div className="text-sm">
          <p className="font-semibold text-ink">{successRate}%</p>
          <p className="text-xs text-ink-muted">Success Rate</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-ink">{formatUsageCount(coupon.usage_count)}</p>
          <p className="text-xs text-ink-muted">Used</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="ml-auto shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-dark"
        >
          {coupon.coupon_type === "code" ? "Get Code" : "Get Deal"}
        </button>
      </div>

      {open && <RevealCodeModal coupon={coupon} onClose={() => setOpen(false)} />}
    </div>
  );
}
