import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteCoupon } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils";
import type { Coupon } from "@/lib/types";

type CouponRow = Coupon & { store: { name: string } | null };

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*, store:stores(name)")
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<CouponRow[]>();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Coupons</h1>
        <Link
          href="/admin/coupons/new"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + New Coupon
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-surface text-left text-ink-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Store</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium">Uses</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(coupons ?? []).map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 text-ink">{c.title}</td>
                <td className="px-4 py-3 text-ink-muted">{c.store?.name}</td>
                <td className="px-4 py-3 text-ink-muted">{c.coupon_type}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      c.is_active
                        ? "rounded-full bg-secondary-light px-2 py-0.5 text-xs font-medium text-secondary-dark"
                        : "rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-ink-muted"
                    }
                  >
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-muted">{formatDate(c.expires_at)}</td>
                <td className="px-4 py-3 text-ink-muted">{c.usage_count}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/coupons/${c.id}/edit`} className="text-primary hover:underline">
                      Edit
                    </Link>
                    <DeleteButton action={deleteCoupon.bind(null, c.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
