"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({ action, label = "Delete" }: { action: () => Promise<void>; label?: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Are you sure? This cannot be undone.")) {
          startTransition(() => action());
        }
      }}
      className="flex items-center gap-1 text-red-600 hover:underline disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "..." : label}
    </button>
  );
}
