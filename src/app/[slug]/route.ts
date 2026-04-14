import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return new NextResponse(
      "Short links unavailable: missing SUPABASE_SECRET_KEY",
      {
        status: 503,
      },
    );
  }

  const { data: redirect, error } = await supabase
    .from("redirects")
    .select("destination_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !redirect) {
    return NextResponse.redirect(new URL("/_not-found", request.url));
  }

  const { error: insertError } = await supabase.from("clicks").insert({
    link_id: `redirect:${slug}`,
    referrer: request.headers.get("referer") || null,
    user_agent: request.headers.get("user-agent") || null,
  });

  if (insertError) {
    console.error("[slug] click insert:", insertError.message);
  }

  const destination = redirect.destination_url.startsWith("/")
    ? new URL(redirect.destination_url, request.url).toString()
    : redirect.destination_url;

  return NextResponse.redirect(destination, 302);
}
