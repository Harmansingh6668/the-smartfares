import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CouponCard } from "@/components/CouponCard";
import { Pagination } from "@/components/Pagination";
import type { CouponWithStore } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Coupons & Promo Codes",
  description: "Browse every verified coupon and deal, filterable by store and category.",
};

const PAGE_SIZE = 12;

export default async function CouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  const { data, count } = await supabase
    .from("coupons")
    .select("*, store:stores(*), category:categories(*)", { count: "exact" })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  const coupons = (data ?? []) as CouponWithStore[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink">All Coupons &amp; Promo Codes</h1>
      <p className="mt-1 text-sm text-ink-muted">{count ?? 0} active offers</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>

      {coupons.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-muted">No coupons found.</p>
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/coupons" />
    </div>
  );
}
