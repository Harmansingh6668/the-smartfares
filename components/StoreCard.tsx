import Image from "next/image";
import Link from "next/link";
import type { Store } from "@/lib/types";

export function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/store/${store.slug}`}
      className="group relative flex flex-col items-center gap-3 rounded-xl border border-slate-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {store.is_popular && (
        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Most Popular
        </span>
      )}
      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-white">
        {store.logo_url ? (
          <Image src={store.logo_url} alt={store.name} width={56} height={56} className="object-contain" />
        ) : (
          <span className="text-base font-bold text-ink-muted">{store.name.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-ink group-hover:text-brand">{store.name}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {store.coupon_count + store.offer_count} offers
        </p>
      </div>
    </Link>
  );
}
