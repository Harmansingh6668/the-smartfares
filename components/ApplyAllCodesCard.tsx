"use client";

import { useState } from "react";
import { Wand2 } from "lucide-react";
import type { CouponWithStore } from "@/lib/types";
import { RevealCodeModal } from "@/components/RevealCodeModal";

export function ApplyAllCodesCard({
  storeName,
  bestDiscount,
  topCoupon,
}: {
  storeName: string;
  bestDiscount: string;
  topCoupon: CouponWithStore;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-brand px-6 py-6 text-center text-white sm:flex-row sm:text-left">
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
          <Wand2 className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-bold">Apply All {storeName} Codes in One Tap</h2>
          <p className="mt-0.5 text-sm text-white/80">
            Automatically test every code — save up to {bestDiscount}.
          </p>
        </div>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-brand hover:bg-white/90"
      >
        Get Code
      </button>

      {open && <RevealCodeModal coupon={topCoupon} onClose={() => setOpen(false)} />}
    </div>
  );
}
