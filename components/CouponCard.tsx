"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ShieldCheck, Star } from "lucide-react";
import type { CouponWithStore } from "@/lib/types";
import { cn, daysUntil, formatDate, formatUsageCount, maskCode } from "@/lib/utils";
import { RevealCodeModal } from "@/components/RevealCodeModal";

export function CouponCard({
  coupon,
  rank,
}: {
  coupon: CouponWithStore;
  rank?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const remaining = daysUntil(coupon.expires_at);
  const expiringSoon = remaining !== null && remaining <= 3 && remaining >= 0;
  const isDeal = coupon.coupon_type !== "code";

  return (
    <div className="relative rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      {rank && (
        <span className="absolute -left-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
          {rank}
        </span>
      )}

      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-white">
          {coupon.store.logo_url ? (
            <Image
              src={coupon.store.logo_url}
              alt={coupon.store.name}
              width={48}
              height={48}
              className="object-contain"
            />
          ) : (
            <span className="text-sm font-bold text-ink-muted">
              {coupon.store.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-bold",
                isDeal ? "bg-secondary-light text-secondary-dark" : "bg-primary-light text-primary-dark"
              )}
            >
              {coupon.discount_value ?? (isDeal ? "DEAL" : "CODE")}
            </span>
            {coupon.is_verified && (
              <span className="flex items-center gap-1 text-xs font-medium text-secondary-dark">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            )}
            {coupon.is_exclusive && (
              <span className="flex items-center gap-1 text-xs font-medium text-primary-dark">
                <Star className="h-3.5 w-3.5" /> Exclusive
              </span>
            )}
          </div>
          <Link
            href={`/store/${coupon.store.slug}`}
            className="mt-1 block text-sm font-semibold text-ink hover:text-brand"
          >
            {coupon.store.name}
          </Link>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-ink">{coupon.title}</p>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
        <span>Used {formatUsageCount(coupon.usage_count)}</span>
        <span className={cn(expiringSoon && "font-semibold text-red-600")}>
          {coupon.expires_at ? `Ends ${formatDate(coupon.expires_at)}` : "No Expiry"}
        </span>
      </div>

      {coupon.description && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-ink-muted hover:text-ink"
          >
            Details <ChevronDown className={cn("h-3.5 w-3.5 transition", expanded && "rotate-180")} />
          </button>
          {expanded && <p className="mt-2 text-sm text-ink-muted">{coupon.description}</p>}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-surface px-3 py-2 font-mono text-sm font-semibold text-ink-muted">
          {maskCode(coupon.code)}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-dark"
        >
          Get Code
        </button>
      </div>

      {modalOpen && <RevealCodeModal coupon={coupon} onClose={() => setModalOpen(false)} />}
    </div>
  );
}
