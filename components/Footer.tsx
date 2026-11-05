"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ticket } from "lucide-react";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "SmartFares Hub";

const columns = [
  {
    title: "Browse",
    links: [
      { href: "/coupons", label: "All Coupons" },
      { href: "/categories", label: "Categories" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about-us", label: "About Us" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-of-use", label: "Terms of Use" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-slate-100 bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
                <Ticket className="h-4 w-4" />
              </span>
              <span className="text-lg font-bold text-ink">{siteName}</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-ink-muted">
              Hand-verified coupons and deals across hundreds of top brands, updated every day.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-xs leading-relaxed text-ink-muted">
            <strong>Affiliate disclosure:</strong> {siteName} may earn a commission when you use
            a coupon or deal linked from this site. This does not affect the price you pay, and
            we only list offers our editorial team has verified.
          </p>
          <p className="mt-3 text-xs text-ink-muted">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
