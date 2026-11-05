import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteStore } from "@/app/admin/actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminStoresPage() {
  const supabase = await createClient();
  const { data: stores } = await supabase.from("stores").select("*").order("name");

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Stores</h1>
        <Link
          href="/admin/stores/new"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + New Store
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-100 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-surface text-left text-ink-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Popular</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(stores ?? []).map((s) => (
              <tr key={s.id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 text-ink">{s.name}</td>
                <td className="px-4 py-3 text-ink-muted">{s.slug}</td>
                <td className="px-4 py-3 text-ink-muted">{s.is_featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-ink-muted">{s.is_popular ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/stores/${s.id}/edit`} className="text-primary hover:underline">
                      Edit
                    </Link>
                    <DeleteButton action={deleteStore.bind(null, s.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
