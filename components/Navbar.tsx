"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/SearchBar";

const links = [
  { href: "/coupons", label: "Coupons" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
];

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "SmartFares Hub";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
            <Ticket className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-ink">{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium text-ink-muted transition hover:text-brand",
                pathname === link.href && "text-brand"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden w-full max-w-xs md:block">
          <SearchBar compact />
        </div>

        <button
          className="md:hidden rounded-lg p-2 text-ink hover:bg-surface"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <div className="mb-4">
            <SearchBar compact />
          </div>
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-muted hover:text-brand"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
