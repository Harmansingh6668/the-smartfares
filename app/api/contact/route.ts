import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  // honeypot field: real users never fill this in
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(`contact:${ip}`);
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (parsed.data.website) {
    // Honeypot triggered — silently pretend success to not tip off bots.
    return NextResponse.json({ ok: true });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json({ error: "Could not send your message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
