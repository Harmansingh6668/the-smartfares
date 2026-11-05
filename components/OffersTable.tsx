"use client";

import { useState } from "react";
import { formatDate, maskCode } from "@/lib/utils";
import type { CouponWithStore } from "@/lib/types";
import { RevealCodeModal } from "@/components/RevealCodeModal";

export function OffersTable({ coupons }: { coupons: CouponWithStore[] }) {
  const [active, setActive] = useState<CouponWithStore | null>(null);

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-surface text-left text-xs uppercase tracking-wide text-ink-muted">
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Discount</th>
            <th className="px-4 py-3 font-medium">Offer</th>
            <th className="px-4 py-3 font-medium">Expires</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {coupons.map((c) => (
            <tr key={c.id} className="border-b border-slate-50 last:border-0">
              <td className="px-4 py-3 text-ink-muted">
                {c.coupon_type === "code" ? "CODE" : "DEAL"}
              </td>
              <td className="px-4 py-3 font-semibold text-ink">
                {c.discount_value ?? maskCode(c.code)}
              </td>
              <td className="px-4 py-3 text-ink">{c.title}</td>
              <td className="px-4 py-3 text-ink-muted">
                {c.expires_at ? formatDate(c.expires_at) : "Ongoing"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => setActive(c)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark"
                >
                  {c.coupon_type === "code" ? "Get Code" : "Get Deal"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {active && <RevealCodeModal coupon={active} onClose={() => setActive(null)} />}
    </div>
  );
}
