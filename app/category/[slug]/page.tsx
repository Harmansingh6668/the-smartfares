import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CouponCard } from "@/components/CouponCard";
import { Pagination } from "@/components/Pagination";
import type { Category, CouponWithStore } from "@/lib/types";

export const revalidate = 3600;

const PAGE_SIZE = 12;

async function getCategory(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).single();
  return data as Category | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} Coupons & Deals`,
    description: category.description ?? `Coupons and deals in ${category.name}.`,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);

  const category = await getCategory(slug);
  if (!category) notFound();

  const supabase = await createClient();
  const from = (page - 1) * PAGE_SIZE;
  const { data, count } = await supabase
    .from("coupons")
    .select("*, store:stores(*), category:categories(*)", { count: "exact" })
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("usage_count", { ascending: false })
    .range(from, from + PAGE_SIZE - 1);

  const coupons = (data ?? []) as CouponWithStore[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-ink">
        <span>{category.icon}</span> {category.name}
      </h1>
      <p className="mt-1 text-sm text-ink-muted">{count ?? 0} offers in this category</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>

      {coupons.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-muted">No coupons in this category yet.</p>
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath={`/category/${slug}`} />
    </div>
  );
}
