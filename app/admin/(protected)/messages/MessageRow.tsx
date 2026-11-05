"use client";

import { useTransition } from "react";
import { markMessageRead } from "@/app/admin/actions";
import type { ContactMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MessageRow({ message }: { message: ContactMessage }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-4",
        message.is_read ? "border-slate-100" : "border-primary/40 bg-primary-light/20"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-ink">{message.name}</p>
          <a href={`mailto:${message.email}`} className="text-sm text-primary hover:underline">
            {message.email}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-muted">
            {new Date(message.created_at).toLocaleString()}
          </span>
          <button
            disabled={pending}
            onClick={() =>
              startTransition(() => markMessageRead(message.id, !message.is_read))
            }
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-ink-muted hover:bg-surface disabled:opacity-50"
          >
            Mark as {message.is_read ? "unread" : "read"}
          </button>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-ink">{message.message}</p>
    </div>
  );
}
