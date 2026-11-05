import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams = "",
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  function href(page: number) {
    const sep = extraParams ? "&" : "";
    return `${basePath}?page=${page}${sep}${extraParams}`;
  }

  return (
    <nav className="mt-10 flex items-center justify-center gap-1">
      <Link
        href={href(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={cn(
          "rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface",
          currentPage === 1 && "pointer-events-none opacity-40"
        )}
      >
        Prev
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="px-1 text-ink-muted">…</span>}
          <Link
            href={href(p)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium",
              p === currentPage
                ? "bg-primary text-white"
                : "text-ink-muted hover:bg-surface"
            )}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={href(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-ink-muted hover:bg-surface",
          currentPage === totalPages && "pointer-events-none opacity-40"
        )}
      >
        Next
      </Link>
    </nav>
  );
}
