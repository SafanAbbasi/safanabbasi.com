import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { linkId } = await request.json();
  const supabase = createServerSupabaseClient();

  const { error } = await supabase.from("clicks").insert({
    link_id: linkId,
    referrer: request.headers.get("referer") || null,
    user_agent: request.headers.get("user-agent") || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
