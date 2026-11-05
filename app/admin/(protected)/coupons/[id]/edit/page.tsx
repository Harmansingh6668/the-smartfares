import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateCoupon } from "@/app/admin/actions";
import { CouponForm } from "@/app/admin/(protected)/coupons/CouponForm";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: coupon }, { data: stores }, { data: categories }] = await Promise.all([
    supabase.from("coupons").select("*").eq("id", id).single(),
    supabase.from("stores").select("id, name").order("name"),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  if (!coupon) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Edit Coupon</h1>
      <div className="mt-6">
        <CouponForm
          coupon={coupon}
          stores={stores ?? []}
          categories={categories ?? []}
          action={updateCoupon.bind(null, id)}
        />
      </div>
    </div>
  );
}
