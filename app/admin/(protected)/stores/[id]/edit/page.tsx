import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateStore } from "@/app/admin/actions";
import { StoreForm } from "@/app/admin/(protected)/stores/StoreForm";

export default async function EditStorePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: store }, { data: categories }] = await Promise.all([
    supabase.from("stores").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name"),
  ]);
  if (!store) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Edit Store</h1>
      <div className="mt-6">
        <StoreForm store={store} categories={categories ?? []} action={updateStore.bind(null, id)} />
      </div>
    </div>
  );
}
