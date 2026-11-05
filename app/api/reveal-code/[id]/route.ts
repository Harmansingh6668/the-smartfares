import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashValue } from "@/lib/utils";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  const { allowed, retryAfterSeconds } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many code reveals. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const supabase = createAdminClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("id, code, affiliate_url, usage_count, is_active")
    .eq("id", id)
    .single();

  if (error || !coupon || !coupon.is_active) {
    return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
  }

  const userAgent = headerList.get("user-agent") ?? "unknown";

  await Promise.all([
    supabase
      .from("coupons")
      .update({ usage_count: coupon.usage_count + 1 })
      .eq("id", id),
    supabase.from("coupon_clicks").insert({
      coupon_id: id,
      ip_hash: hashValue(ip),
      user_agent_hash: hashValue(userAgent),
    }),
  ]);

  return NextResponse.json({ code: coupon.code, affiliateUrl: coupon.affiliate_url });
}
