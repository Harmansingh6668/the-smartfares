import { createClient } from "@/lib/supabase/server";
import { createCoupon } from "@/app/admin/actions";
import { CouponForm } from "@/app/admin/(protected)/coupons/CouponForm";

export default async function NewCouponPage() {
  const supabase = await createClient();
  const [{ data: stores }, { data: categories }] = await Promise.all([
    supabase.from("stores").select("id, name").order("name"),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">New Coupon</h1>
      <div className="mt-6">
        <CouponForm stores={stores ?? []} categories={categories ?? []} action={createCoupon} />
      </div>
    </div>
  );
}
