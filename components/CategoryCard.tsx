import Link from "next/link";
import {
  Laptop2,
  ShieldCheck,
  Server,
  GraduationCap,
  Shirt,
  Sparkles,
  Bot,
  Smartphone,
  Plane,
  Stethoscope,
  Tag,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  "software-saas": Laptop2,
  "vpn-security": ShieldCheck,
  "web-hosting": Server,
  "online-learning": GraduationCap,
  "fashion-apparel": Shirt,
  "health-beauty": Sparkles,
  "ai-tools": Bot,
  electronics: Smartphone,
  travel: Plane,
  healthcare: Stethoscope,
};

export function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count?: number;
}) {
  const Icon = ICONS[category.slug] ?? Tag;

  return (
    <Link
      href={`/category/${category.slug}`}
      className="flex flex-col items-center gap-2.5 rounded-xl border border-slate-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-medium text-ink">{category.name}</span>
      {typeof count === "number" && (
        <span className="rounded-full bg-surface px-1.5 py-0.5 text-xs text-ink-muted">
          {count}
        </span>
      )}
    </Link>
  );
}
