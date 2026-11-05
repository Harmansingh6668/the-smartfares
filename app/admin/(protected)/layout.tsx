import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./LogoutButton";
import {
  LayoutDashboard,
  Ticket,
  Store as StoreIcon,
  Newspaper,
  Mail,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/stores", label: "Stores", icon: StoreIcon },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-center">
        <div>
          <h1 className="text-xl font-bold text-ink">Access restricted</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Your account ({user.email}) does not have admin access. Contact an administrator to
            request access.
          </p>
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
        <Link href="/admin" className="block px-2 py-2 text-lg font-bold text-ink">
          Admin
        </Link>
        <nav className="mt-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface hover:text-ink"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-slate-100 pt-4">
          <p className="truncate px-3 text-xs text-ink-muted">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <div className="flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
