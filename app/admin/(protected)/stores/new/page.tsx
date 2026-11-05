import { createClient } from "@/lib/supabase/server";
import { createStore } from "@/app/admin/actions";
import { StoreForm } from "@/app/admin/(protected)/stores/StoreForm";

export default async function NewStorePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">New Store</h1>
      <div className="mt-6">
        <StoreForm categories={categories ?? []} action={createStore} />
      </div>
    </div>
  );
}
