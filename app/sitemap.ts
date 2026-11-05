import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [{ data: stores }, { data: categories }, { data: posts }] = await Promise.all([
    supabase.from("stores").select("slug, updated_at"),
    supabase.from("categories").select("slug"),
    supabase.from("blog_posts").select("slug, updated_at").eq("is_published", true),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/coupons",
    "/categories",
    "/blog",
    "/about-us",
    "/how-it-works",
    "/contact",
    "/privacy-policy",
    "/terms-of-use",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const storePages: MetadataRoute.Sitemap = (stores ?? []).map((s) => ({
    url: `${siteUrl}/store/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
    url: `${siteUrl}/category/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...storePages, ...categoryPages, ...blogPages];
}
