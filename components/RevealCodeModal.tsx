"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, ExternalLink } from "lucide-react";
import type { CouponWithStore } from "@/lib/types";

export function RevealCodeModal({
  coupon,
  onClose,
}: {
  coupon: CouponWithStore;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string | null>(null);
  const [affiliateUrl, setAffiliateUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function reveal() {
      try {
        const res = await fetch(`/api/reveal-code/${coupon.id}`, { method: "POST" });
        if (res.status === 429) {
          const body = await res.json();
          throw new Error(body.error ?? "Too many requests. Please try again later.");
        }
        if (!res.ok) throw new Error("Could not reveal this code. Please try again.");
        const data = await res.json();
        if (!cancelled) {
          setCode(data.code);
          setAffiliateUrl(data.affiliateUrl);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    reveal();
    return () => {
      cancelled = true;
    };
  }, [coupon.id]);

  function handleCopy() {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleVisit() {
    if (affiliateUrl) {
      window.open(affiliateUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-ink">{coupon.store.name}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-ink-muted hover:bg-surface">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-1 text-sm text-ink-muted">{coupon.title}</p>

        <div className="mt-5">
          {loading && (
            <div className="flex h-16 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-ink-muted">
              Revealing code...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && code && (
            <div className="flex items-center justify-between rounded-xl border-2 border-dashed border-primary bg-primary-light px-4 py-3">
              <span className="font-mono text-lg font-bold tracking-wider text-ink">{code}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary hover:text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          )}

          {!loading && !error && !code && (
            <div className="rounded-xl border-2 border-dashed border-secondary bg-secondary-light px-4 py-3 text-center font-semibold text-secondary-dark">
              No code needed — deal applies automatically
            </div>
          )}
        </div>

        <button
          onClick={handleVisit}
          disabled={loading || !!error}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-50"
        >
          Visit {coupon.store.name} <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
