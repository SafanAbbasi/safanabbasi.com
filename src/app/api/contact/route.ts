import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MINUTES = 15;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, message, website, _t } = body;

  // Honeypot: if the hidden "website" field is filled, it's a bot
  if (website) {
    // Return success silently so the bot thinks it worked
    return NextResponse.json({ success: true });
  }

  // Timestamp check: reject if submitted less than 2 seconds after page load
  if (_t && Date.now() - _t < 2000) {
    return NextResponse.json({ success: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required" },
      { status: 400 }
    );
  }

  // Basic length validation
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json(
      { error: "Input too long" },
      { status: 400 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const supabase = createServerSupabaseClient();

  // Rate limiting: check recent submissions from this IP
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  ).toISOString();

  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", windowStart);

  if (count !== null && count >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429 }
    );
  }

  const { error } = await supabase
    .from("messages")
    .insert({ name, email, message, ip });

  if (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
