import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { createHash } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function formatDate(date: string | null): string {
  if (!date) return "No Expiry";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(date: string | null): number | null {
  if (!date) return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function maskCode(code: string | null): string {
  if (!code) return "DEAL";
  return "•".repeat(Math.max(6, Math.min(code.length, 10)));
}

export function formatUsageCount(count: number): string {
  if (count <= 0) return "New";
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k+ times`;
  return `${count}+ times`;
}
