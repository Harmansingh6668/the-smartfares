import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryCard } from "@/components/CategoryCard";
import type { Category } from "@/lib/types";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse coupons and deals by category.",
};

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("display_order");
  const categories = (data ?? []) as Category[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-ink">All Categories</h1>
      <p className="mt-1 text-sm text-ink-muted">Find coupons organized by what you&apos;re shopping for.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
