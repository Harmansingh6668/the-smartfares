import Link from "next/link";
import { ShieldCheck, Zap, Gift, Handshake, MousePointerClick, RefreshCcw } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CouponCard } from "@/components/CouponCard";
import { StoreCard } from "@/components/StoreCard";
import { CategoryCard } from "@/components/CategoryCard";
import { BlogCard } from "@/components/BlogCard";
import { SearchBar } from "@/components/SearchBar";
import { HeroIllustration } from "@/components/HeroIllustration";
import type { BlogPost, Category, CouponWithStore, Store } from "@/lib/types";

export const revalidate = 3600;

async function getHomeData() {
  const supabase = await createClient();

  const [
    { data: categories },
    { data: trending },
    { data: stores },
    { data: posts },
    { count: couponCount },
    { count: storeCount },
  ] = await Promise.all([
    supabase.from("categories").select("*").order("display_order").limit(10),
    supabase
      .from("coupons")
      .select("*, store:stores(*), category:categories(*)")
      .eq("is_active", true)
      .order("is_trending", { ascending: false })
      .order("usage_count", { ascending: false })
      .limit(6),
    supabase.from("stores").select("*").order("is_popular", { ascending: false }).limit(12),
    supabase
      .from("blog_posts")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3),
    supabase.from("coupons").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("stores").select("id", { count: "exact", head: true }),
  ]);

  return {
    categories: (categories ?? []) as Category[],
    trending: (trending ?? []) as CouponWithStore[],
    stores: (stores ?? []) as Store[],
    posts: (posts ?? []) as BlogPost[],
    couponCount: couponCount ?? 0,
    storeCount: storeCount ?? 0,
  };
}

export default async function HomePage() {
  const { categories, trending, stores, posts, couponCount, storeCount } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-brand-50 to-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand">
              <ShieldCheck className="h-3.5 w-3.5" /> Verified codes. Real savings. Every day.
            </span>
            <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
              Verified Coupons &amp; Promo Codes <span className="text-brand">that actually work</span>
            </h1>
            <p className="mt-4 text-lg text-ink-muted">
              We hand-test {couponCount}+ codes across {storeCount}+ top brands so you save on
              every order — no dead codes, no guesswork.
            </p>

            <div className="mx-auto mt-8 max-w-xl lg:mx-0">
              <SearchBar />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-ink-muted lg:justify-start">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-secondary" /> Verified daily
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-brand" /> Instant reveal
              </span>
              <span className="flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-brand" /> Always free
              </span>
            </div>
          </div>

          <div className="mx-auto hidden w-full max-w-md lg:block">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">Browse by Category</h2>
            <Link href="/categories" className="text-sm font-medium text-brand hover:underline">
              View All Categories
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Coupons */}
      <section className="bg-surface px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-ink">🔥 Trending Coupons</h2>
          <p className="mt-1 text-sm text-ink-muted">Most used codes right now, ranked live</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((coupon, i) => (
              <CouponCard key={coupon.id} coupon={coupon} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Stores */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">Popular Stores</h2>
            <Link href="/coupons" className="text-sm font-medium text-brand hover:underline">
              View All Stores →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {stores.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      {posts.length > 0 && (
        <section className="bg-surface px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">Latest Posts</h2>
              <Link href="/blog" className="text-sm font-medium text-brand hover:underline">
                View all posts →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value proposition */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-3">
          <div>
            <Handshake className="mx-auto h-8 w-8 text-brand" />
            <h3 className="mt-3 font-bold text-ink">Hand-verified</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Every code is tested by our team and dated so you know it&apos;s live.
            </p>
          </div>
          <div>
            <MousePointerClick className="mx-auto h-8 w-8 text-brand" />
            <h3 className="mt-3 font-bold text-ink">One-tap savings</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Reveal, copy and apply your discount at checkout in seconds.
            </p>
          </div>
          <div>
            <RefreshCcw className="mx-auto h-8 w-8 text-brand" />
            <h3 className="mt-3 font-bold text-ink">Updated daily</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Expired codes are removed and fresh offers added every day.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
