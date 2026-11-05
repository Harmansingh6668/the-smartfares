import { createClient } from "@/lib/supabase/server";
import { Ticket, Store as StoreIcon, Newspaper, MousePointerClick } from "lucide-react";

type TopCouponRow = {
  id: string;
  title: string;
  usage_count: number;
  store: { name: string } | null;
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    { count: couponCount },
    { count: storeCount },
    { count: postCount },
    { count: clicksToday },
    { data: topCoupons },
  ] = await Promise.all([
    supabase.from("coupons").select("id", { count: "exact", head: true }),
    supabase.from("stores").select("id", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase
      .from("coupon_clicks")
      .select("id", { count: "exact", head: true })
      .gte("clicked_at", todayStart.toISOString()),
    supabase
      .from("coupons")
      .select("id, title, usage_count, store:stores(name)")
      .order("usage_count", { ascending: false })
      .limit(5)
      .returns<TopCouponRow[]>(),
  ]);

  const stats = [
    { label: "Total Coupons", value: couponCount ?? 0, icon: Ticket },
    { label: "Total Stores", value: storeCount ?? 0, icon: StoreIcon },
    { label: "Blog Posts", value: postCount ?? 0, icon: Newspaper },
    { label: "Clicks Today", value: clicksToday ?? 0, icon: MousePointerClick },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Dashboard</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-100 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-muted">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-2 text-2xl font-bold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-slate-100 bg-white p-5">
        <h2 className="text-sm font-bold text-ink">Top Coupons by Usage</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-ink-muted">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Store</th>
              <th className="pb-2 text-right font-medium">Uses</th>
            </tr>
          </thead>
          <tbody>
            {(topCoupons ?? []).map((c) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2 text-ink">{c.title}</td>
                <td className="py-2 text-ink-muted">{c.store?.name}</td>
                <td className="py-2 text-right font-semibold text-ink">{c.usage_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
