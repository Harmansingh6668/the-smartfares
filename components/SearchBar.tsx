"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Store as StoreIcon, Tag } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Result = { type: "store" | "coupon"; id: string; label: string; href: string };

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const supabase = createClient();
      const [{ data: stores }, { data: coupons }] = await Promise.all([
        supabase
          .from("stores")
          .select("id, name, slug")
          .ilike("name", `%${query}%`)
          .limit(5),
        supabase
          .from("coupons")
          .select("id, title, store:stores(slug)")
          .eq("is_active", true)
          .ilike("title", `%${query}%`)
          .limit(5),
      ]);

      const storeResults: Result[] = (stores ?? []).map((s) => ({
        type: "store",
        id: s.id,
        label: s.name,
        href: `/store/${s.slug}`,
      }));
      type CouponSearchRow = {
        id: string;
        title: string;
        store: { slug: string } | { slug: string }[] | null;
      };
      const couponResults: Result[] = (coupons as CouponSearchRow[] | null ?? [])
        .map((c) => ({ ...c, store: Array.isArray(c.store) ? c.store[0] : c.store }))
        .filter((c): c is CouponSearchRow & { store: { slug: string } } => Boolean(c.store))
        .map((c) => ({
          type: "coupon" as const,
          id: c.id,
          label: c.title,
          href: `/store/${c.store.slug}`,
        }));

      setResults([...storeResults, ...couponResults]);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search stores or coupons..."
          className={cn(
            "w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm text-ink placeholder:text-ink-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20",
            compact ? "py-2" : "py-3.5"
          )}
        />
      </form>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
          {results.map((r) => (
            <Link
              key={`${r.type}-${r.id}`}
              href={r.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-surface"
            >
              {r.type === "store" ? (
                <StoreIcon className="h-4 w-4 text-brand" />
              ) : (
                <Tag className="h-4 w-4 text-secondary" />
              )}
              {r.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
