import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CouponCard } from "@/components/CouponCard";
import { StoreCard } from "@/components/StoreCard";
import type { CouponWithStore, Store } from "@/lib/types";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const supabase = await createClient();

  const [{ data: stores }, { data: coupons }] = q
    ? await Promise.all([
        supabase.from("stores").select("*").ilike("name", `%${q}%`).limit(12),
        supabase
          .from("coupons")
          .select("*, store:stores(*), category:categories(*)")
          .eq("is_active", true)
          .ilike("title", `%${q}%`)
          .limit(12),
      ])
    : [{ data: [] }, { data: [] }];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink">
        {q ? `Search results for "${q}"` : "Search"}
      </h1>

      {(stores ?? []).length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold text-ink">Stores</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {(stores as Store[]).map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        </section>
      )}

      {(coupons ?? []).length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-bold text-ink">Coupons</h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(coupons as CouponWithStore[]).map((c) => (
              <CouponCard key={c.id} coupon={c} />
            ))}
          </div>
        </section>
      )}

      {q && (stores ?? []).length === 0 && (coupons ?? []).length === 0 && (
        <p className="mt-10 text-sm text-ink-muted">No results for &quot;{q}&quot;.</p>
      )}
    </div>
  );
}
