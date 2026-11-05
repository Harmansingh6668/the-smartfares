"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return supabase;
}

// ---------- Coupons ----------

const couponSchema = z.object({
  store_id: z.string().uuid(),
  category_id: z.string().uuid().nullable(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullable(),
  code: z.string().max(100).nullable(),
  discount_value: z.string().max(50).nullable(),
  coupon_type: z.enum(["code", "deal", "offer"]),
  affiliate_url: z.string().url(),
  is_verified: z.boolean(),
  is_exclusive: z.boolean(),
  is_featured: z.boolean(),
  is_trending: z.boolean(),
  is_active: z.boolean(),
  expires_at: z.string().nullable(),
});

function parseCouponForm(formData: FormData) {
  return couponSchema.parse({
    store_id: String(formData.get("store_id")),
    category_id: formData.get("category_id") ? String(formData.get("category_id")) : null,
    title: String(formData.get("title")),
    description: formData.get("description") ? String(formData.get("description")) : null,
    code: formData.get("code") ? String(formData.get("code")) : null,
    discount_value: formData.get("discount_value") ? String(formData.get("discount_value")) : null,
    coupon_type: String(formData.get("coupon_type")),
    affiliate_url: String(formData.get("affiliate_url")),
    is_verified: formData.get("is_verified") === "on",
    is_exclusive: formData.get("is_exclusive") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_trending: formData.get("is_trending") === "on",
    is_active: formData.get("is_active") === "on",
    expires_at: formData.get("expires_at") ? String(formData.get("expires_at")) : null,
  });
}

export async function createCoupon(formData: FormData) {
  const supabase = await requireAdmin();
  const data = parseCouponForm(formData);
  const { error } = await supabase.from("coupons").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function updateCoupon(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const data = parseCouponForm(formData);
  const { error } = await supabase.from("coupons").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

export async function bulkExpireCoupons(ids: string[]) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("coupons")
    .update({ is_active: false, is_verified: false })
    .in("id", ids);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

// ---------- Stores ----------

const storeSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(160),
  logo_url: z.string().url().nullable(),
  website_url: z.string().url().nullable(),
  description: z.string().max(1000).nullable(),
  is_featured: z.boolean(),
  is_popular: z.boolean(),
  primary_category_id: z.string().uuid().nullable(),
  about_content: z.array(z.string()),
  saving_tips: z.array(z.string()),
  support_tips: z.array(z.string()),
  refund_policy: z.string().nullable(),
  faq: z.array(z.object({ question: z.string(), answer: z.string() })),
});

function linesOf(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseFaqLines(value: FormDataEntryValue | null) {
  return linesOf(value)
    .map((line) => {
      const [question, ...rest] = line.split("|");
      return { question: question?.trim() ?? "", answer: rest.join("|").trim() };
    })
    .filter((f) => f.question && f.answer);
}

function parseStoreForm(formData: FormData) {
  const name = String(formData.get("name"));
  const rawSlug = formData.get("slug");
  const categoryId = formData.get("primary_category_id");
  return storeSchema.parse({
    name,
    slug: slugify(rawSlug ? String(rawSlug) : name),
    logo_url: formData.get("logo_url") ? String(formData.get("logo_url")) : null,
    website_url: formData.get("website_url") ? String(formData.get("website_url")) : null,
    description: formData.get("description") ? String(formData.get("description")) : null,
    is_featured: formData.get("is_featured") === "on",
    is_popular: formData.get("is_popular") === "on",
    primary_category_id: categoryId ? String(categoryId) : null,
    about_content: String(formData.get("about_content") ?? "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    saving_tips: linesOf(formData.get("saving_tips")),
    support_tips: linesOf(formData.get("support_tips")),
    refund_policy: formData.get("refund_policy") ? String(formData.get("refund_policy")) : null,
    faq: parseFaqLines(formData.get("faq")),
  });
}

export async function createStore(formData: FormData) {
  const supabase = await requireAdmin();
  const data = parseStoreForm(formData);
  const { error } = await supabase.from("stores").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/stores");
  redirect("/admin/stores");
}

export async function updateStore(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const data = parseStoreForm(formData);
  const { error } = await supabase.from("stores").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/stores");
  redirect("/admin/stores");
}

export async function deleteStore(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("stores").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/stores");
}

// ---------- Blog posts ----------

const blogSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(220),
  excerpt: z.string().max(500).nullable(),
  content: z.string().nullable(),
  cover_image_url: z.string().url().nullable(),
  author: z.string().max(120),
  category: z.string().max(80).nullable(),
  tags: z.array(z.string()),
  is_published: z.boolean(),
});

function parseBlogForm(formData: FormData) {
  const title = String(formData.get("title"));
  const rawSlug = formData.get("slug");
  const tagsRaw = String(formData.get("tags") ?? "");
  return blogSchema.parse({
    title,
    slug: slugify(rawSlug ? String(rawSlug) : title),
    excerpt: formData.get("excerpt") ? String(formData.get("excerpt")) : null,
    content: formData.get("content") ? String(formData.get("content")) : null,
    cover_image_url: formData.get("cover_image_url")
      ? String(formData.get("cover_image_url"))
      : null,
    author: String(formData.get("author") || "Editorial Team"),
    category: formData.get("category") ? String(formData.get("category")) : null,
    tags: tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    is_published: formData.get("is_published") === "on",
  });
}

export async function createBlogPost(formData: FormData) {
  const supabase = await requireAdmin();
  const data = parseBlogForm(formData);
  const { error } = await supabase.from("blog_posts").insert({
    ...data,
    published_at: data.is_published ? new Date().toISOString() : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const data = parseBlogForm(formData);

  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...data,
      published_at: data.is_published ? existing?.published_at ?? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
}

// ---------- Contact messages ----------

export async function markMessageRead(id: string, isRead: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("contact_messages")
    .update({ is_read: isRead })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
