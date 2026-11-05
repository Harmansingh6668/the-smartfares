import { createClient } from "@/lib/supabase/server";
import { MessageRow } from "./MessageRow";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Contact Messages</h1>

      <div className="mt-6 space-y-3">
        {(messages ?? []).map((m) => (
          <MessageRow key={m.id} message={m} />
        ))}
        {(messages ?? []).length === 0 && (
          <p className="text-sm text-ink-muted">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
