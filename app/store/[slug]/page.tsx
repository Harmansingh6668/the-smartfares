import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Globe, ChevronRight, HandHeart, Headset, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CouponCard } from "@/components/CouponCard";
import { StoreCard } from "@/components/StoreCard";
import { Pagination } from "@/components/Pagination";
import { ApplyAllCodesCard } from "@/components/ApplyAllCodesCard";
import { BestCodeCallout } from "@/components/BestCodeCallout";
import { FaqAccordion } from "@/components/FaqAccordion";
import { OffersTable } from "@/components/OffersTable";
import { cn, formatDate } from "@/lib/utils";
import type { Category, CouponWithStore, Store } from "@/lib/types";

export const revalidate = 3600;

const PAGE_SIZE = 12;

async function getStore(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stores")
    .select("*, primary_category:categories(*)")
    .eq("slug", slug)
    .single();
  return data as (Store & { primary_category: Category | null }) | null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) return {};
  return {
    title: `${store.name} Coupons & Promo Codes`,
    description: store.description ?? `Verified coupons and deals for ${store.name}.`,
    alternates: { canonical: `/store/${store.slug}` },
  };
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "code", label: "Coupon Codes" },
  { key: "deal", label: "Deals" },
  { key: "verified", label: "Verified" },
] as const;

const SORTS = [
  { key: "popular", label: "Most Popular" },
  { key: "newest", label: "Newest" },
  { key: "discount", label: "Highest Discount" },
] as const;

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string; sort?: string; page?: string }>;
}) {
  const { slug } = await params;
  const { filter = "all", sort = "popular", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);

  const store = await getStore(slug);
  if (!store) notFound();

  const supabase = await createClient();

  // Full unfiltered set — used for the "apply all / best code" callouts and stats,
  // independent of the filter/sort controls on the main list below.
  const { data: allCouponsData } = await supabase
    .from("coupons")
    .select("*, store:stores(*), category:categories(*)")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("usage_count", { ascending: false });
  const allCoupons = (allCouponsData ?? []) as CouponWithStore[];

  let query = supabase
    .from("coupons")
    .select("*, store:stores(*), category:categories(*)", { count: "exact" })
    .eq("store_id", store.id)
    .eq("is_active", true);

  if (filter === "code") query = query.eq("coupon_type", "code");
  if (filter === "deal") query = query.neq("coupon_type", "code");
  if (filter === "verified") query = query.eq("is_verified", true);

  if (sort === "newest") query = query.order("created_at", { ascending: false });
  else if (sort === "discount") query = query.order("discount_value", { ascending: false });
  else query = query.order("usage_count", { ascending: false });

  const from = (page - 1) * PAGE_SIZE;
  const { data, count } = await query.range(from, from + PAGE_SIZE - 1);
  const coupons = (data ?? []) as CouponWithStore[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const [{ data: similarStores }, { data: popularStores }, { data: categories }] =
    await Promise.all([
      store.primary_category_id
        ? supabase
            .from("stores")
            .select("*")
            .eq("primary_category_id", store.primary_category_id)
            .neq("id", store.id)
            .limit(4)
        : Promise.resolve({ data: [] as Store[] }),
      supabase
        .from("stores")
        .select("*")
        .neq("id", store.id)
        .order("is_popular", { ascending: false })
        .limit(8),
      supabase.from("categories").select("*").order("display_order").limit(6),
    ]);

  if (allCoupons.length === 0) notFound();

  const topCoupon = allCoupons[0];
  const bestPercentCoupon = allCoupons.find((c) => c.discount_value?.includes("%"));
  const bestDiscount = (bestPercentCoupon ?? topCoupon).discount_value ?? "a special offer";
  const verifiedCount = allCoupons.filter((c) => c.is_verified).length;
  const codeCount = allCoupons.filter((c) => c.coupon_type === "code").length;
  const totalRedemptions = allCoupons.reduce((sum, c) => sum + c.usage_count, 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${store.name} Coupons`,
    itemListElement: coupons.slice(0, 10).map((c, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: c.title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/${store.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-ink-muted">
        <Link href="/" className="hover:text-brand">
          Home
        </Link>
        {store.primary_category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/category/${store.primary_category.slug}`} className="hover:text-brand">
              {store.primary_category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">{store.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white p-8 text-center sm:flex-row sm:text-left">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100">
          {store.logo_url ? (
            <Image src={store.logo_url} alt={store.name} width={80} height={80} className="object-contain" />
          ) : (
            <span className="text-xl font-bold text-ink-muted">{store.name.slice(0, 2)}</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-ink">{store.name} Promo Code &amp; Discount Code</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {store.name} Promo Code · Updated {formatDate(store.updated_at)} · {allCoupons.length} Offers
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-ink-muted sm:justify-start">
            {store.website_url && (
              <a
                href={store.website_url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex items-center gap-1 text-brand hover:underline"
              >
                <Globe className="h-4 w-4" /> Visit site
              </a>
            )}
          </div>
        </div>
      </div>

      <h2 className="mt-8 text-balance text-xl font-bold text-ink sm:text-2xl">
        Save Up to {bestDiscount} on {store.name} — All Codes Applied in One Tap
      </h2>

      <div className="mt-5">
        <ApplyAllCodesCard storeName={store.name} bestDiscount={bestDiscount} topCoupon={topCoupon} />
      </div>

      {/* Coupon list */}
      <section className="mt-10">
        <h2 className="text-lg font-bold text-ink">{store.name} Coupons &amp; Promo Codes</h2>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f.key}
                href={`/store/${slug}?filter=${f.key}&sort=${sort}`}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm font-medium",
                  filter === f.key
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 text-ink-muted hover:border-primary hover:text-primary"
                )}
              >
                {f.label}
              </Link>
            ))}
          </div>
          <div className="flex gap-2">
            {SORTS.map((s) => (
              <Link
                key={s.key}
                href={`/store/${slug}?filter=${filter}&sort=${s.key}`}
                className={cn(
                  "text-sm font-medium",
                  sort === s.key ? "text-brand" : "text-ink-muted hover:text-brand"
                )}
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>

        {coupons.length === 0 && (
          <p className="mt-10 text-center text-sm text-ink-muted">
            No coupons match this filter right now.
          </p>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={`/store/${slug}`}
          extraParams={`filter=${filter}&sort=${sort}`}
        />
      </section>

      {/* About + tips */}
      {(store.about_content?.length || store.saving_tips?.length) && (
        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          {store.about_content && store.about_content.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-ink">About {store.name} &amp; How to Save</h2>
              <div className="mt-3 space-y-3">
                {store.about_content.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-ink-muted">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}
          {store.saving_tips && store.saving_tips.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-ink">{store.name} Saving Tips &amp; Tricks</h2>
              <ul className="mt-3 space-y-2.5">
                {store.saving_tips.map((tip, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-ink-muted">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Stats */}
      <section className="mt-12 rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="text-sm font-bold text-ink">Is now a good time to save?</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          {[
            { label: "All Discounts", value: allCoupons.length },
            { label: "Promo Codes", value: codeCount },
            { label: `Verified ${store.name}`, value: verifiedCount },
            { label: "Maximum Discount", value: bestDiscount },
            { label: "Total Redemptions", value: totalRedemptions.toLocaleString() },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl bg-surface p-4 text-center">
              <p className="text-lg font-extrabold text-ink">{stat.value}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar stores */}
      {(similarStores ?? []).length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-ink">Similar Stores to {store.name}</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(similarStores as Store[]).map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        </section>
      )}

      {/* Support + Why trust us */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        {store.support_tips && store.support_tips.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-ink">{store.name} Customer Support</h2>
            <ul className="mt-3 space-y-2.5">
              {store.support_tips.map((tip, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-muted">
                  <Headset className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-ink">Why Trust Us?</h2>
          <div className="mt-3 flex gap-2.5 rounded-xl bg-brand-50 p-4 text-sm text-ink-muted">
            <HandHeart className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <p>
              {process.env.NEXT_PUBLIC_SITE_NAME ?? "SmartFares Hub"} is a dedicated savings
              team. We hand-test coupons and rank {store.name} offers by usage so you spend less
              time hunting for codes and more time saving. Verified codes carry a badge and a
              date.
            </p>
          </div>
        </div>
      </section>

      {/* Popular stores + related categories */}
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-ink">Popular Stores</h2>
          <ul className="mt-3 space-y-2">
            {(popularStores ?? []).slice(0, 8).map((s) => (
              <li key={s.id}>
                <Link href={`/store/${s.slug}`} className="text-sm text-ink-muted hover:text-brand">
                  {s.name} Promo Code
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Related Categories</h2>
          <ul className="mt-3 space-y-2">
            {(categories ?? []).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="text-sm text-ink-muted hover:text-brand">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Best code callout */}
      <div className="mt-12">
        <BestCodeCallout storeName={store.name} coupon={topCoupon} />
      </div>

      {/* How to use */}
      <section className="mt-12">
        <h2 className="text-lg font-bold text-ink">How to Use {store.name} Coupons &amp; Deals</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            `Browse the ${store.name} offers listed above and pick the one that fits what you're buying.`,
            `Click through on the offer — it takes you straight to ${store.name}'s relevant page or checkout.`,
            "The discount or perk applies automatically, or paste the code at checkout if one is shown.",
            `Complete your purchase on ${store.name}'s site as normal.`,
          ].map((step, i) => (
            <li key={i} className="rounded-xl border border-slate-100 bg-white p-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand">
                {i + 1}
              </span>
              <p className="mt-2 text-sm text-ink-muted">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Refund policy */}
      {store.refund_policy && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-ink">{store.name} Refund Policy</h2>
          <p className="mt-3 rounded-xl border border-slate-100 bg-white p-4 text-sm text-ink-muted">
            {store.refund_policy}
          </p>
        </section>
      )}

      {/* FAQ */}
      {store.faq && store.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-ink">FAQ for {store.name}</h2>
          <div className="mt-4">
            <FaqAccordion items={store.faq} />
          </div>
        </section>
      )}

      {/* Offers table */}
      <section className="mt-12 mb-4">
        <h2 className="text-lg font-bold text-ink">
          Browse {store.name} Promo Codes &amp; Offers Today
        </h2>
        <div className="mt-4">
          <OffersTable coupons={allCoupons} />
        </div>
      </section>
    </div>
  );
}
